import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function AdminPage() {
  const store = await cookies()
  const role = store.get('session_role')?.value
  const email = store.get('session_email')?.value

  if (role !== 'admin') {
    // Simple guard: if not admin, show link back to login
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-lg border p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
          <p className="text-muted-foreground mb-4">Anda harus login sebagai admin.</p>
          <Link href="/admin/login" className="text-primary underline">Ke halaman login</Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Selamat datang{email ? `, ${email}` : ''}.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">Paket Penerbangan</h2>
            <p className="text-sm text-muted-foreground">Kelola data paket penerbangan.</p>
          </div>
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">Pembayaran</h2>
            <p className="text-sm text-muted-foreground">Pantau transaksi terbaru.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
