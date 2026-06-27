"use client";

import { useState } from "react";

type LinkItem = {
  id: string;
  title: string;
  url: string;
  sort_order: number;
  is_active: boolean;
};

type DashboardLinksManagerProps = {
  initialLinks: LinkItem[];
};

export default function DashboardLinksManager({
  initialLinks,
}: DashboardLinksManagerProps) {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [movingId, setMovingId] = useState("");

  async function loadLinks() {
    const res = await fetch("/api/links", {
      method: "GET",
      cache: "no-store",
    });

    const result = await res.json();

    if (res.ok) {
      setLinks(result.links || []);
    }
  }

  async function handleAddLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, url }),
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage(result.error || "Gagal menambahkan link.");
      setLoading(false);
      return;
    }

    setTitle("");
    setUrl("");
    setMessage("Link berhasil ditambahkan.");
    await loadLinks();
    setLoading(false);
  }

  function startEdit(link: LinkItem) {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setMessage("");
  }

  function cancelEdit() {
    setEditingId("");
    setEditTitle("");
    setEditUrl("");
    setSavingEdit(false);
  }

  async function handleSaveEdit(id: string) {
    setSavingEdit(true);
    setMessage("");

    const res = await fetch("/api/links", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        title: editTitle,
        url: editUrl,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage(result.error || "Gagal mengubah link.");
      setSavingEdit(false);
      return;
    }

    setMessage("Link berhasil diperbarui.");
    await loadLinks();
    cancelEdit();
  }

  async function handleDeleteLink(id: string) {
    setDeletingId(id);
    setMessage("");

    const res = await fetch("/api/links", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage(result.error || "Gagal menghapus link.");
      setDeletingId("");
      return;
    }

    setMessage("Link berhasil dihapus.");
    await loadLinks();
    setDeletingId("");
  }

  async function handleMove(id: string, direction: "up" | "down") {
    setMovingId(id);
    setMessage("");

    const res = await fetch("/api/links", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        action: "move",
        direction,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage(result.error || "Gagal mengubah urutan link.");
      setMovingId("");
      return;
    }

    setMessage("Urutan link berhasil diperbarui.");
    await loadLinks();
    setMovingId("");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-zinc-400">Link Publik</p>
        <h2 className="mt-2 text-2xl font-bold">Tambah link bio kamu</h2>
        <p className="mt-2 text-zinc-400">
          Link yang kamu tambahkan di sini akan tampil di halaman publik profilmu.
        </p>
      </div>

      <form onSubmit={handleAddLink} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Judul Link
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Misalnya: GitHub saya"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Menambahkan..." : "Tambah link"}
        </button>
      </form>

      {message && <p className="text-sm text-zinc-300">{message}</p>}

      <div className="space-y-3">
        {links.length > 0 ? (
          links.map((link, index) => (
            <div
              key={link.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4"
            >
              {editingId === link.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Judul Link
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      URL
                    </label>
                    <input
                      type="url"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(link.id)}
                      disabled={savingEdit}
                      className="flex-1 rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
                    >
                      {savingEdit ? "Menyimpan..." : "Simpan perubahan"}
                    </button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-xl border border-zinc-700 px-4 py-3 text-zinc-300 transition hover:bg-zinc-800"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-white">{link.title}</p>
                    <p className="mt-1 break-all text-sm text-zinc-400">
                      {link.url}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleMove(link.id, "up")}
                      disabled={index === 0 || movingId === link.id}
                      className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40"
                    >
                      Naik
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMove(link.id, "down")}
                      disabled={index === links.length - 1 || movingId === link.id}
                      className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40"
                    >
                      Turun
                    </button>

                    <button
                      type="button"
                      onClick={() => startEdit(link)}
                      className="rounded-lg border border-blue-900 bg-blue-950 px-3 py-2 text-sm text-blue-300 transition hover:bg-blue-900/40"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link.id)}
                      disabled={deletingId === link.id}
                      className="rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300 transition hover:bg-red-900/40 disabled:opacity-50"
                    >
                      {deletingId === link.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-700 px-4 py-6 text-center text-zinc-500">
            Belum ada link. Tambahkan link pertamamu.
          </div>
        )}
      </div>
    </div>
  );
}