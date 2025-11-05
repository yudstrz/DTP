// pages/index.js
import Layout from '../components/Layout'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Digital Talent Platform</h1>
          <p>
            Platform AI-Powered untuk Pemetaan dan Validasi Talenta Digital Indonesia
          </p>
          <div className="hero-buttons">
            <Link href="/profile" className="btn btn-primary">
              Mulai Sekarang
            </Link>
            <Link href="/dashboard" className="btn btn-secondary">
              Lihat Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container my-16">
        <h2 className="text-3xl font-bold text-center mb-8">Fitur Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card feature-card">
            <div className="feature-icon">📊</div>
            <h3>AI-Powered Mapping</h3>
            <p>AI menganalisis CV Anda dan memetakan keahlian Anda ke okupasi PON TIK yang relevan.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">📝</div>
            <h3>Asesmen Kompetensi</h3>
            <p>AI men-generate soal asesmen secara dinamis sesuai dengan okupasi yang terpetakan.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">💼</div>
            <h3>Rekomendasi Karier</h3>
            <p>Dapatkan rekomendasi lowongan pekerjaan dan program pelatihan yang paling sesuai.</p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">📈</div>
            <h3>Dashboard Nasional</h3>
            <p>Visualisasi data agregat untuk pemangku kepentingan dan analisis kebijakan.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai Karir Anda?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan platform kami dan temukan potensi terbesar Anda dalam dunia digital.
          </p>
          <Link href="/profile" className="btn btn-primary">
            Daftar Sekarang
          </Link>
        </div>
      </section>
    </Layout>
  )
}