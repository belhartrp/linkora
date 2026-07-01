"use client";

import { useState } from "react";

type LinkItem = {
  id: string;
  title: string;
  url: string;
  is_active: boolean;
  sort_order: number | null;
};

export default function LinkList({
  links,
  onUpdate,
  onDelete,
}: {
  links: LinkItem[];
  onUpdate: (formData: FormData) => Promise<void>;
  onDelete: (formData: FormData) => Promise<void>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!links.length) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-800 px-4 py-8 text-sm text-zinc-500">
        Belum ada link. Tambahkan link pertama di form atas.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link) => {
        const isEditing = editingId === link.id;

        return (
          <div
            key={link.id}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4"
          >
            <div className="space-y-4">
              <form action={onUpdate} className="space-y-4">
                <input type="hidden" name="id" value={link.id} />

                <div className="grid gap-3 md:grid-cols-[1fr_1.2fr_auto]">
                  <input
                    name="title"
                    defaultValue={link.title}
                    disabled={!isEditing}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none disabled:opacity-70"
                  />
                  <input
                    name="url"
                    defaultValue={link.url}
                    disabled={!isEditing}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none disabled:opacity-70"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(isEditing ? null : link.id)}
                      className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white"
                    >
                      {isEditing ? "Selesai" : "Edit"}
                    </button>

                    {isEditing ? (
                      <button
                        type="submit"
                        className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                      >
                        Simpan
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-zinc-300">
                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked={link.is_active}
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-950"
                      disabled={!isEditing}
                    />
                    Aktif
                  </label>
                </div>
              </form>

              <div className="flex justify-end">
                <form action={onDelete}>
                  <input type="hidden" name="id" value={link.id} />
                  <button
                    type="submit"
                    className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:border-red-900 hover:text-red-300"
                  >
                    Hapus
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}