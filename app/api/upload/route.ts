
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import formidable from "formidable";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Readable } from "stream";
import type { IncomingMessage } from "http";


export const config = {
  api: {
    bodyParser: false,
  },
};

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = process.env.SUPABASE_BUCKET || "resources";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function parseForm(req: IncomingMessage) {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
    maxFileSize: 200 * 1024 * 1024,
  });

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );
}


function getStringField(val: undefined | string | string[] | Buffer): string | null {
  if (Array.isArray(val)) return val.length > 0 ? String(val[0]) : null;
  if (val === undefined) return null;
  if (Buffer.isBuffer(val)) return val.toString();
  return String(val);
}

export async function POST(req: Request) {
  try {
    console.log("📸 Upload route hit!");

    const rawSession = await getServerSession({ req, ...authOptions } as any);
    console.log("📦 Session:", rawSession);

    const session = rawSession as { user?: { id?: string; email?: string } } | null | undefined;
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    function toNodeRequest(req: Request): IncomingMessage {
  const body = Readable.fromWeb(req.body as any);
  const nodeReq = Object.assign(body, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.url,
  });
  return nodeReq as unknown as IncomingMessage;
}

const nodeReq = toNodeRequest(req);
const { fields, files } = await parseForm(nodeReq);

    const fileField = (files as any).file;
    if (!fileField) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const fileObj = Array.isArray(fileField) ? fileField[0] : fileField;

    const tempFilePath = (fileObj as any).filepath || (fileObj as any).path;
    const originalName = (fileObj as any).originalFilename || (fileObj as any).name || "upload.bin";
    const mimeType = (fileObj as any).mimetype || "application/octet-stream";
    const size = (fileObj as any).size || (tempFilePath ? fs.statSync(tempFilePath).size : 0);

    // basic validation
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/zip",
      "image/png",
      "image/jpeg",
    ];
    if (!allowed.includes(mimeType)) {
      try { if (tempFilePath) fs.unlinkSync(tempFilePath); } catch {}
      return NextResponse.json({ error: "File type not allowed", mimeType }, { status: 400 });
    }
    const MAX_BYTES = 200 * 1024 * 1024;
    if (size > MAX_BYTES) {
      try { if (tempFilePath) fs.unlinkSync(tempFilePath); } catch {}
      return NextResponse.json({ error: "File too large", size }, { status: 400 });
    }

    const title = getStringField(fields.title) || originalName;
    const courseId = getStringField(fields.courseId);
    const description = getStringField(fields.description);
    const tagsRaw = getStringField(fields.tags);
    const tags = tagsRaw ? (() => { try { return JSON.parse(tagsRaw); } catch { return null } })() : null;

    // create resource
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        courseId,
        uploaderId: userId,
      },
    });

    // storage path
    const versionNumber = 1;
    const storagePath = `resources/${resource.id}/v${versionNumber}/${originalName}`;

    // read file bytes and upload
    const fileBuffer = fs.readFileSync(tempFilePath);

    const { error: uploadErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadErr) {
      console.error("Supabase upload error:", uploadErr);
      await prisma.resource.delete({ where: { id: resource.id } });
      try { if (tempFilePath) fs.unlinkSync(tempFilePath); } catch {}
      return NextResponse.json({ error: "Upload failed", details: uploadErr }, { status: 500 });
    }

    // create version record
    const version = await prisma.resourceVersion.create({
      data: {
        resourceId: resource.id,
        filePath: storagePath,
        fileName: originalName,
        mimeType,
        size: Number(size),
        uploaderId: userId,
        version: versionNumber,
      },
    });

    await prisma.resource.update({
      where: { id: resource.id },
      data: { currentVerId: version.id },
    });

    // cleanup temp file
    try { if (tempFilePath) fs.unlinkSync(tempFilePath); } catch {}

    return NextResponse.json({
      ok: true,
      resource: { id: resource.id, title: resource.title, versionId: version.id, filePath: version.filePath, tags },
    });
  } catch (err) {
    console.error("Upload handler error:", err);
    return NextResponse.json({ error: "Internal server error", details: String(err) }, { status: 500 });
  }
}
