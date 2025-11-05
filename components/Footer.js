export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">Digital Talent Platform</h3>
            <p className="text-gray-400">Platform AI-Powered untuk Pemetaan dan Validasi Talenta Digital Indonesia</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Tautan</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Tentang</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Bantuan</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Kebijakan Privasi</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <p className="text-gray-400">Email: info@digitaltalent.id<br />Telepon: (021) 1234-5678</p>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-4">Ikuti Kami</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">FB</a>
              <a href="#" className="text-gray-400 hover:text-white">TW</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2023 Digital Talent Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}