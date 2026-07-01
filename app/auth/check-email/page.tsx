export default function CheckEmailPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
          Auth
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Cek email kamu</h1>
        <p className="mt-4 text-sm leading-6 text-zinc-400">
          Kami sudah mengirim link verifikasi ke email yang kamu daftarkan.
          Buka email tersebut lalu klik link untuk mengaktifkan akunmu.
        </p>
      </div>
    </main>
  );
}