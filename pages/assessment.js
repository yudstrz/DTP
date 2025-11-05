import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'

export default function Assessment() {
  const router = useRouter()
  const [talentData, setTalentData] = useState(null)
  const [assessmentData, setAssessmentData] = useState({ currentQuestion: null, currentQuestionIndex: 0, answers: [], isComplete: false, score: 0, level: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  useEffect(() => {
    const talentId = localStorage.getItem('talentId');
    if (!talentId) { router.push('/profile'); return; }
    fetchTalentData(talentId);
  }, [router])
  
  const fetchTalentData = async (talentId) => {
    try {
      const { data: talent, error: talentError } = await supabase.from('Talenta').select('*').eq('TalentID', talentId).single()
      if (talentError) throw talentError
      
      const { data: mapping, error: mappingError } = await supabase.from('Hasil_Pemetaan_Asesmen').select('*, PON_TIK_Master(*)').eq('TalentID', talentId).order('Tanggal_Update', { ascending: false }).limit(1).single()
      if (mappingError && mappingError.code !== 'PGRST116') throw mappingError

      setTalentData({ ...talent, mappedOkupasi: mapping?.PON_TIK_Master?.Okupasi || 'Belum Dipetakan', okupasiId: mapping?.OkupasiID_Mapped });
    } catch (error) {
      console.error('Error fetching talent data:', error)
      setMessage('Gagal memuat data talenta.')
    }
  }
  
  const generateQuestion = async () => {
    if (!talentData?.okupasiId) { setMessage('Anda harus menyelesaikan pemetaan profil terlebih dahulu.'); return; }
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ okupasiId: talentData.okupasiId, previousQuestions: assessmentData.answers.map(a => a.question) })
      })
      if (!response.ok) throw new Error('Failed to generate question')
      const { data } = await response.json()
      setAssessmentData(prev => ({ ...prev, currentQuestion: data }))
    } catch (error) {
      console.error('Error generating question:', error)
      setMessage('Gagal membuat soal.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleAnswer = (selectedOption) => {
    if (!assessmentData.currentQuestion) return
    const isCorrect = selectedOption === assessmentData.currentQuestion.correctAnswer
    const newAnswers = [...assessmentData.answers, { question: assessmentData.currentQuestion.question, selectedOption, correctAnswer: assessmentData.currentQuestion.correctAnswer, isCorrect }]
    const newScore = isCorrect ? assessmentData.score + 1 : assessmentData.score
    const newIndex = assessmentData.currentQuestionIndex + 1
    const isComplete = newIndex >= 5
    
    setAssessmentData({ ...assessmentData, answers: newAnswers, score: newScore, currentQuestionIndex: newIndex, isComplete })
    if (isComplete) calculateLevel(newScore)
    else generateQuestion()
  }
  
  const calculateLevel = (score) => {
    const level = score >= 4 ? 'Ahli (Expert)' : score >= 3 ? 'Menengah (Intermediate)' : score >= 2 ? 'Junior (Junior)' : 'Pemula (Beginner)'
    setAssessmentData(prev => ({ ...prev, level }))
    saveAssessmentResults(score, level)
  }
  
  const saveAssessmentResults = async (score, level) => {
    if (!talentData) return
    try {
      const { error } = await supabase.from('Hasil_Pemetaan_Asesmen').upsert({
        TalentID: talentData.TalentID,
        OkupasiID_Mapped: talentData.okupasiId,
        Skor_Asesmen: score,
        Level_Kompetensi: level,
        Gap_Keterampilan: 'Contoh Gap: Python, AWS', // Simplified
        Tanggal_Update: new Date().toISOString()
      })
      if (error) throw error
      setMessage('Hasil asesmen berhasil disimpan!')
    } catch (error) {
      console.error('Error saving assessment results:', error)
      setMessage('Gagal menyimpan hasil asesmen.')
    }
  }
  
  const resetAssessment = () => setAssessmentData({ currentQuestion: null, currentQuestionIndex: 0, answers: [], isComplete: false, score: 0, level: '' })
  
  if (!talentData) return <Layout><div className="max-w-4xl mx-auto text-center py-12"><p>Memuat data...</p></div></Layout>
  if (!talentData.okupasiId) return <Layout><div className="max-w-4xl mx-auto text-center py-12"><p>Anda harus menyelesaikan pemetaan profil terlebih dahulu.</p></div></Layout>
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Asesmen Kompetensi</h1>
        <div className="card"><h2 className="text-2xl font-semibold mb-4">Informasi Talenta</h2><p><strong>Nama:</strong> {talentData.Nama}</p><p><strong>Email:</strong> {talentData.Email}</p><p><strong>Okupasi:</strong> {talentData.mappedOkupasi}</p></div>
        
        {!assessmentData.isComplete ? (
          <div className="card mt-8">
            <h2 className="text-2xl font-semibold mb-4">Pertanyaan {assessmentData.currentQuestionIndex + 1} dari 5</h2>
            {assessmentData.currentQuestion ? (
              <div>
                <p className="text-lg mb-6">{assessmentData.currentQuestion.question}</p>
                <div className="space-y-3">{assessmentData.currentQuestion.options.map((option, i) => <button key={i} className="btn w-full text-left p-4 border border-gray-300 rounded hover:bg-gray-100" onClick={() => handleAnswer(option)}>{option}</button>)}</div>
              </div>
            ) : (
              <div className="text-center py-8">{isLoading ? <p>Memuat soal...</p> : <button className="btn btn-primary" onClick={generateQuestion}>Mulai Asesmen</button>}</div>
            )}
            {message && <div className={`mt-4 p-3 rounded ${message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}
          </div>
        ) : (
          <div className="card mt-8">
            <h2 className="text-2xl font-semibold mb-4">Hasil Asesmen</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded"><p className="text-3xl font-bold text-blue-600">{assessmentData.score}/5</p><p className="text-gray-600">Skor Anda</p></div>
              <div className="text-center p-4 bg-green-50 rounded"><p className="text-2xl font-bold text-green-600">{assessmentData.level}</p><p className="text-gray-600">Level Kompetensi</p></div>
            </div>
            <div className="flex space-x-4"><button className="btn btn-primary" onClick={() => router.push('/recommendations')}>Lihat Rekomendasi</button><button className="btn" onClick={resetAssessment}>Ulangi Asesmen</button></div>
            {message && <div className={`mt-4 p-3 rounded ${message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}
          </div>
        )}
      </div>
    </Layout>
  )
}