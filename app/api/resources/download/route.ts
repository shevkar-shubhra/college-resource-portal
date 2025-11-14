
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = process.env.SUPABASE_BUCKET || "resources";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function buildPublicUrl(filePath: string) {
  const normalized = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  return `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${encodeURI(normalized)}`;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });

    const r = await prisma.resource.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 1,
          select: { filePath: true, fileName: true, mimeType: true, size: true },
        },
      },
    });

    if (!r) return NextResponse.json({ ok: false, error: "resource not found" }, { status: 404 });
    const ver = r.versions && r.versions[0];
    if (!ver || !ver.filePath) return NextResponse.json({ ok: false, error: "no file version" }, { status: 404 });

    const filePath = ver.filePath;
    const usePublic = (process.env.SUPABASE_BUCKET_PUBLIC === "true") || false;

    if (usePublic) {
      const publicUrl = buildPublicUrl(filePath);
      return NextResponse.redirect(publicUrl, 307);
    }

    const ttl = 60;
    const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(filePath, ttl);

    if (error || !data?.signedUrl) {
      console.error("Supabase signedUrl error:", error);
      const publicUrl = buildPublicUrl(filePath);
      return NextResponse.redirect(publicUrl, 307);
    }

    return NextResponse.redirect(data.signedUrl, 307);
  } catch (err) {
    console.error("GET /api/resources/download error:", err);
    return NextResponse.json({ ok: false, error: "internal" }, { status: 500 });
  }
}
