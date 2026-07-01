"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";

type AvatarUploadProps = {
  initialUrl: string;
};

export default function AvatarUpload({ initialUrl }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState(initialUrl || "");
  const [uploadedUrl, setUploadedUrl] = useState(initialUrl || "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();

      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError("Upload avatar gagal.");
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      if (!data?.publicUrl) {
        setError("Gagal mengambil URL avatar.");
        return;
      }

      setPreviewUrl(data.publicUrl);
      setUploadedUrl(data.publicUrl);
    });
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        Avatar
      </label>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-zinc-800">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                No image
              </div>
            )}
          </div>

          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:font-medium file:text-black hover:file:opacity-90"
            />

            <p className="mt-2 text-xs text-zinc-500">
              Pilih gambar dari perangkat kamu. Format gambar umum seperti JPG atau PNG aman dipakai.
            </p>

            {isPending ? (
              <p className="mt-2 text-xs text-zinc-400">Uploading avatar...</p>
            ) : null}

            {error ? (
              <p className="mt-2 text-xs text-red-400">{error}</p>
            ) : null}
          </div>
        </div>
      </div>

      <input type="hidden" name="avatarUrl" value={uploadedUrl} />
    </div>
  );
}