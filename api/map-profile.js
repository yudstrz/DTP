import { supabase } from '../../lib/supabase'
import { callGeminiAPI } from '../../lib/utils'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  
  const { talentId, cvText } = req.body
  if (!talentId || !cvText) return res.status(400).json({ message: 'Missing talentId or cvText' })

  try {
    // Fetch all PON TIK Master data
    const { data: ponData, error: ponError } = await supabase.from('PON_TIK_Master').select('*')
    if (ponError) throw ponError

    // Create a prompt for Gemini to find the best match
    const ponListText = ponData.map(p => `- ${p.OkupasiID}: ${p.Okupasi} (${p.Unit_Kompetensi})`).join('\n')
    const prompt = `
      Berdasarkan teks CV berikut, tentukan okupasi PON TIK yang paling relevan.
      
      Teks CV:
      """${cvText}"""
      
      Daftar Okupasi PON TIK:
      ${ponListText}
      
      Respon HANYA dalam format JSON berikut:
      {
        "okupasiId": "ID_OKUPASI_YANG_DIPILIH",
        "okupasiNama": "Nama Okupasi",
        "skorKecocokan": 0.85,
        "gapKeterampilan": "Skill1, Skill2, Skill3"
      }
    `

    const aiResponse = await callGeminiAPI(prompt)
    const mappingResult = JSON.parse(aiResponse)

    // Save the mapping result to the database
    const { error: insertError } = await supabase.from('Hasil_Pemetaan_Asesmen').insert({
      TalentID: talentId,
      OkupasiID_Mapped: mappingResult.okupasiId,
      Skor_Kecocokan_Awal: mappingResult.skorKecocokan,
      Skor_Asesmen: 0, // Not assessed yet
      Level_Kompetensi: 'Belum Dinilai',
      Gap_Keterampilan: mappingResult.gapKeterampilan,
      Tanggal_Update: new Date().toISOString()
    })

    if (insertError) throw insertError

    res.status(200).json({ success: true, data: mappingResult })

  } catch (error) {
    console.error('Error mapping profile:', error)
    res.status(500).json({ success: false, message: 'Failed to map profile', error: error.message })
  }
}