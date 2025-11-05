// components/Header.js
import Link from 'next/link'

export default function Header() {
  return (
    <header className="header-container">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Digital Talent Platform
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/profile" className="text-gray-600 hover:text-primary font-medium transition-colors">
                  Profil
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="text-gray-600 hover:text-primary font-medium transition-colors">
                  Asesmen
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-gray-600 hover:text-primary font-medium transition-colors">
                  Rekomendasi
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary font-medium transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}