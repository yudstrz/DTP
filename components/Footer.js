// components/Footer.js
export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Digital Talent Platform</h3>
            <p>
              Platform AI-Powered untuk Pemetaan dan Validasi Talenta Digital Indonesia
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Tautan</h4>
            <ul className="space-y-2">
              <li><a href="#">Tentang</a></li>
              <li><a href="#">Bantuan</a></li>
              <li><a href="#">Kebijakan Privasi</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Kontak</h4>
            <p>
              Email: info@digitaltalent.id<br />
              Telepon: (021) 1234-5678
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Ikuti Kami</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-white transition-colors">f</a>
              <a href="#" className="text-2xl hover:text-white transition-colors">t</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center">
          <p>&copy; 2023 Digital Talent Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}