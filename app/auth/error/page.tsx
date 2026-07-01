export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-red-900/50 bg-zinc-950 p-8">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-red-400">
          Auth error
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          Verifikasi gagal
        </h1>
        <p className="mt-4 text-sm leading-6 text-zinc-300">
          {params.error || "Terjadi kesalahan saat memproses autentikasi."}
        </p>
      </div>
    </main>
  );
}