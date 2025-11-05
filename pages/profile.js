import { useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { parseCVData } from '../lib/utils'
import { useRouter } from 'next/router'

export default function Profile() {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [profileData, setProfileData] = useState({
    email: '',
    nama: '',
    lokasi: '',
    linkedin: '',
    profil_singkat: '',
    cv_text: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const handleFileChange = (e) => setFile(e.target.files[0])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }
  
  const processFile = async () => {
    if (!file) return
    setIsLoading(true)
    setMessage('')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) throw new Error('Failed to parse file')
      
      const { data } = await response.json()
      setProfileData(prev => ({ ...prev, ...data }))
      setMessage('CV berhasil diproses! Silakan periksa data di bawah.')
    } catch (error) {
      console.error('Error processing file:', error)
      setMessage('Gagal memproses file. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const saveProfile = async (e) => {
    e.preventDefault()
    if (!profileData.email || !profileData.nama || !profileData.cv_text) {
      setMessage('Mohon isi field yang wajib diisi (Email, Nama, dan CV).')
      return
    }
    
    setIsLoading(true)
    setMessage('')
    
    try {
      const { data, error } = await supabase
        .from('Talenta')
        .upsert({
          Nama: profileData.nama,
          Email: profileData.email,
          Lokasi: profileData.lokasi,
          Profil_Singkat: profileData.profil_singkat,
          LinkedIn_URL: profileData.linkedin,
          Raw_CV_Text: profileData.cv_text
        })
        .select()
      
      if (error) throw error
      
      const talentId = data[0].TalentID
      localStorage.setItem('talentId', talentId)
      
      // Trigger mapping
      const mapResponse = await fetch('/api/map-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ talentId, cvText: profileData.cv_text })
      })
      
      if (!mapResponse.ok) throw new Error('Failed to map profile')
      
      setMessage('Profil berhasil disimpan dan dipetakan!')
      setTimeout(() => router.push('/assessment'), 2000)

    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage('Gagal menyimpan profil. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profil Talenta</h1>
        
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Unggah CV Anda</h2>
          <div className="form-group">
            <label className="form-label">Pilih File (PDF, DOCX, atau TXT)</label>
            <input type="file" className="form-control" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
          </div>
          <button className="btn btn-primary" onClick={processFile} disabled={!file || isLoading}>
            {isLoading ? 'Memproses...' : 'Proses CV'}
          </button>
          {message && <div className={`mt-4 p-3 rounded ${message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}
        </div>
        
        <div className="card mt-8">
          <h2 className="text-2xl font-semibold mb-4">Lengkapi Profil Anda</h2>
          <form onSubmit={saveProfile}>
            <div className="form-group"><label className="form-label">Email*</label><input type="email" name="email" className="form-control" value={profileData.email} onChange={handleInputChange} required /></div>
            <div className="form-group"><label className="form-label">Nama Lengkap*</label><input type="text" name="nama" className="form-control" value={profileData.nama} onChange={handleInputChange} required /></div>
            <div className="form-group"><label className="form-label">Lokasi</label><input type="text" name="lokasi" className="form-control" value={profileData.lokasi} onChange={handleInputChange} /></div>
            <div className="form-group"><label className="form-label">URL LinkedIn</label><input type="text" name="linkedin" className="form-control" value={profileData.linkedin} onChange={handleInputChange} /></div>
            <div className="form-group"><label className="form-label">Profil Singkat</label><textarea name="profil_singkat" className="form-control" rows="4" value={profileData.profil_singkat} onChange={handleInputChange}></textarea></div>
            <div className="form-group"><label className="form-label">CV atau Deskripsi Diri*</label><textarea name="cv_text" className="form-control" rows="8" value={profileData.cv_text} onChange={handleInputChange} required></textarea></div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Menyimpan...' : 'Simpan & Petakan Profil'}</button>
          </form>
        </div>
      </div>
    </Layout>
  )
}