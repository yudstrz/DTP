import { supabase } from '../../lib/supabase'
import { callGeminiAPI } from '../../lib/utils'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  
  const { okupasiId, previousQuestions } = req.body
  if (!okupasiId) return res.status(400).json({ message: 'Missing okupasiId' })

  try {
    const { data: okupasi, error } = await supabase.from('PON_TIK_Master').select('*').eq('OkupasiID', okupasiId).single()
    if (error) throw error

    const prompt = `
      Buat 1 soal pilihan ganda untuk asesmen kompetensi pada okupasi ${okupasi.Okupasi}.
      Unit Kompetensi: ${okupasi.Unit_Kompetensi}
      Keterampilan Kunci: ${okupasi.Kuk_Keywords}
      
      ${previousQuestions && previousQuestions.length > 0 ? `Soal ini harus berbeda dari soal-soal sebelumnya: ${previousQuestions.join(', ')}` : ''}
      
      Format response harus JSON dengan struktur:
      {
        "question": "Teks pertanyaan",
        "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
        "correctAnswer": "Opsi A"
      }
    `
    
    const response = await callGeminiAPI(prompt)
    const questionData = JSON.parse(response)
    
    res.status(200).json({ success: true, data: questionData })
  } catch (error) {
    console.error('Error generating question:', error)
    res.status(500).json({ success: false, message: 'Failed to generate question' })
  }
}