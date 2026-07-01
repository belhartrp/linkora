import { signUp } from "./actions";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
          Auth
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Buat akun</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Daftar akun baru untuk mulai membuat halaman Linkora-mu.
        </p>

        <form action={signUp} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-zinc-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-zinc-600"
            />
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Daftar
          </button>
        </form>
      </div>
    </main>
  );
}