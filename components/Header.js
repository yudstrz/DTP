import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Digital Talent Platform
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/profile" className="hover:text-blue-200">Profil</Link></li>
            <li><Link href="/assessment" className="hover:text-blue-200">Asesmen</Link></li>
            <li><Link href="/recommendations" className="hover:text-blue-200">Rekomendasi</Link></li>
            <li><Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}