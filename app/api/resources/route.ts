
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const BUCKET = process.env.SUPABASE_BUCKET || "resources";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || null;

function encodePathPreserveSlashes(p: string) {
  return p
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}
function buildPublicUrl(filePath: string) {
  const normalized = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  return `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${encodePathPreserveSlashes(
    normalized
  )}`;
}

export async function GET() {
  try {
    const rows = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
          select: {
            id: true,
            filePath: true,
            fileName: true,
            mimeType: true,
            size: true,
            version: true,
            createdAt: true,
          },
        },
        uploader: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    const supabaseAdmin = SUPABASE_SERVICE_KEY
      ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
      : null;

    const items = await Promise.all(
      rows.map(async (r) => {
        const ver = r.versions && r.versions[0] ? r.versions[0] : null;
        const filePath = ver?.filePath ?? null;

        let downloadUrl: string | null = filePath ? buildPublicUrl(filePath) : null;


        if (filePath && supabaseAdmin) {
          try {
            const ttl = 60 * 5; // 5 minutes
            const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(filePath, ttl);
            if (!error && data?.signedUrl) downloadUrl = data.signedUrl;
          } catch (e) {
            console.warn("createSignedUrl failed, falling back to public URL", e);
          }
        }

        return {
          id: r.id,
          title: r.title,
          description: r.description,
          courseId: r.courseId,
          uploaderId: r.uploaderId,
          uploader: r.uploader ?? null,
          currentVersionId: r.currentVerId ?? null,
          version: ver
            ? {
                id: ver.id,
                fileName: ver.fileName,
                filePath: ver.filePath,
                mimeType: ver.mimeType,
                size: ver.size,
                version: ver.version,
                createdAt: ver.createdAt,
              }
            : null,
          downloadUrl,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        };
      })
    );

    return NextResponse.json({ ok: true, items });
  } catch (err) {
    console.error("GET /api/resources error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error", details: String(err) }, { status: 500 });
  }
}
