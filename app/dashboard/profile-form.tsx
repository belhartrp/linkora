"use client";

import { useState } from "react";

type ProfileFormProps = {
  initialProfile: {
    email: string;
    username: string;
    display_name: string;
    bio: string;
  };
};

export default function DashboardProfileForm({
  initialProfile,
}: ProfileFormProps) {
  const [email] = useState(initialProfile.email);
  const [username, setUsername] = useState(initialProfile.username);
  const [displayName, setDisplayName] = useState(initialProfile.display_name);
  const [bio, setBio] = useState(initialProfile.bio);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        display_name: displayName,
        bio,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage(result.error || "Terjadi kesalahan saat menyimpan profil.");
      setLoading(false);
      return;
    }

    setMessage("Profil berhasil disimpan.");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Email
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-500 outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="misalnya: belhart"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none"
          required
        />
        <p className="mt-2 text-xs text-zinc-500">
          Ini nanti dipakai untuk link publik, misalnya /u/belhart
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Display Name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Nama yang tampil di bio"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tulis bio singkat kamu"
          rows={4}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Simpan profil"}
      </button>

      {message && <p className="text-sm text-zinc-300">{message}</p>}
    </form>
  );
}