"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type AvatarFormProps = {
  currentAvatarUrl: string | null;
  displayName: string;
};

export default function AvatarForm({
  currentAvatarUrl,
  displayName,
}: AvatarFormProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setMessage("");
  }

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setMessage("Pilih foto terlebih dahulu.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("/api/avatar", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage(result.error || "Gagal mengunggah foto.");
      setUploading(false);
      return;
    }

    setAvatarUrl(result.avatar_url);
    setPreview(null);
    setMessage("Foto profil berhasil diperbarui.");
    setUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const displayUrl = preview || avatarUrl;
  const initial = displayName?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-400">Foto Profil</p>
        <h2 className="mt-2 text-2xl font-bold">Upload foto profil</h2>
        <p className="mt-2 text-zinc-400">
          Foto ini akan tampil di halaman publik profilmu. Maks 2MB, format JPG/PNG/WebP.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24 flex-shrink-0">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt={`Avatar ${displayName}`}
              fill
              className="rounded-full object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800 text-3xl font-bold text-white">
              {initial}
            </div>
          )}
        </div>

        <div className="space-y-3 flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-xl file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700"
          />

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? "Mengunggah..." : "Simpan foto profil"}
          </button>
        </div>
      </div>

      {message && (
        <p className="text-sm text-zinc-300">{message}</p>
      )}
    </div>
  );
}