import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/infrastructure/supabase/client.server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const slug = formData.get("slug") as string;

    if (!file || !slug) {
      return NextResponse.json({ error: "Missing file or slug" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    // Update product with image URL
    const { error: updateError } = await supabase
      .from("products")
      .update({ images: [urlData.publicUrl] })
      .eq("slug", slug);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, url: urlData.publicUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}