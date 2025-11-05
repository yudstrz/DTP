import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Recommendations() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState({ jobs: [], trainings: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  
  useEffect(() => {
    const talentId = localStorage.getItem('talentId');
    if (!talentId) { router.push('/profile'); return; }
    fetchUserProfile(talentId);
  }, [router])
  
  const fetchUserProfile = async (talentId) => {
    try {
      const { data: talent, error: talentError } = await supabase.from('Talenta').select('*').eq('TalentID', talentId).single()
      if (talentError) throw talentError
      
      const { data: assessment, error: assessmentError } = await supabase.from('Hasil_Pemetaan_Asesmen').select('*, PON_TIK_Master(Okupasi)').eq('TalentID', talentId).order('Tanggal_Update', { ascending: false }).limit(1).single()
      if (assessmentError && assessmentError.code !== 'PGRST116') throw assessmentError
      
      const { data: skills, error: skillsError } = await supabase.from('Keterampilan_Sertifikasi').select('Nama_Skill_Sertifikasi').eq('TalentID', talentId)
      if (skillsError) throw skillsError
      
      setUserProfile({ ...talent, assessmentScore: assessment?.Skor_Asesmen || 0, assessmentLevel: assessment?.Level_Kompetensi || 'Belum Dinilai', mappedOkupasi: assessment?.PON_TIK_Master?.Okupasi || 'Belum Dipetakan', skills: skills.map(s => s.Nama_Skill_Sertifikasi) });
      fetchRecommendations(talentId, skills.map(s => s.Nama_Skill_Sertifikasi));
    } catch (error) {
      console.error('Error fetching user profile:', error); setIsLoading(false);
    }
  }
  
  const fetchRecommendations = async (talentId, skills) => {
    try {
      const response = await fetch('/api/get-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ talentId, skills })
      })
      if (!response.ok) throw new Error('Failed to fetch recommendations')
      const { data } = await response.json()
      setRecommendations(data)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  if (!userProfile) return <Layout><div className="max-w-4xl mx-auto text-center py-12"><p>Memuat data profil...</p></div></Layout>
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Rekomendasi Karier</h1>
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">Profil Anda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><p><strong>Nama:</strong> {userProfile.Nama}</p><p><strong>Email:</strong> {userProfile.Email}</p><p><strong>Okupasi:</strong> {userProfile.mappedOkupasi}</p></div>
            <div><p><strong>Skor Asesmen:</strong> {userProfile.assessmentScore}/5</p><p><strong>Level Kompetensi:</strong> {userProfile.assessmentLevel}</p><p><strong>Skills:</strong> {userProfile.skills.join(', ')}</p></div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Rekomendasi Lowongan</h2>
          {isLoading ? <p>Memuat rekomendasi...</p> : recommendations.jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.jobs.map(item => (
                <div key={item.LowonganID} className="card">
                  <div className="flex justify-between items-start mb-2"><h3 className="text-xl font-semibold">{item.Posisi}</h3><span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{item.matchScore}% Match</span></div>
                  <p className="text-gray-600 mb-2">{item.Perusahaan}</p><p className="text-gray-600 mb-2">📍 {item.Lokasi}</p>
                  <p className="mb-4">{item.Deskripsi_Pekerjaan}</p>
                  <p className="mb-4"><strong>Skills dibutuhkan:</strong> {item.Keterampilan_Dibutuhkan}</p>
                  <div className="flex space-x-2"><button className="btn btn-primary">Lamar</button><button className="btn">Lihat Detail</button></div>
                </div>
              ))}
            </div>
          ) : <p>Belum ada rekomendasi lowongan yang sesuai.</p>}
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Rekomendasi Pelatihan</h2>
          {isLoading ? <p>Memuat rekomendasi...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.trainings.map(item => (
                <div key={item.id} className="card">
                  <div className="flex justify-between items-start mb-2"><h3 className="text-xl font-semibold">{item.title}</h3><span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">{item.matchScore}% Match</span></div>
                  <p className="text-gray-600 mb-2">{item.provider}</p><p className="text-gray-600 mb-2">📚 {item.format}</p>
                  <p className="text-gray-600 mb-2">⏱️ {item.duration}</p>
                  <p className="mb-4">{item.description}</p>
                  <div className="flex space-x-2"><button className="btn btn-primary">Daftar</button><button className="btn">Lihat Detail</button></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}