import Layout from '../components/Layout'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Digital Talent Platform</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Platform AI-Powered untuk Pemetaan dan Validasi Talenta Digital Indonesia
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Untuk Talenta Digital</h2>
            <p className="mb-4">Dapatkan validasi kompetensi objektif dan rekomendasi karier yang terpersonalisasi.</p>
            <Link href="/profile" className="btn btn-primary">Mulai Sekarang</Link>
          </div>
          
          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Untuk Perusahaan</h2>
            <p className="mb-4">Temukan talenta yang paling sesuai dengan kebutuhan spesifik dan standar kompetensi yang jelas.</p>
            <Link href="/dashboard" className="btn btn-primary">Lihat Dashboard</Link>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Fitur Utama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 text-center">
              <div className="text-blue-500 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Mapping</h3>
              <p>AI menganalisis CV Anda dan memetakan keahlian Anda ke okupasi PON TIK yang relevan.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-blue-500 text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Asesmen Kompetensi</h3>
              <p>AI men-generate soal asesmen secara dinamis sesuai dengan okupasi yang terpetakan.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-blue-500 text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-2">Rekomendasi Karier</h3>
              <p>Dapatkan rekomendasi lowongan pekerjaan dan program pelatihan yang paling sesuai.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-blue-500 text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Dashboard Nasional</h3>
              <p>Visualisasi data agregat untuk pemangku kepentingan dan analisis kebijakan.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}