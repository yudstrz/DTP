// Fungsi ini adalah placeholder. Di browser, parsing PDF/DOCX memerlukan library klien.
// Untuk parsing di server-side (API route), Anda memerlukan library seperti 'pdf-parse' dan 'mammoth'.
export function extractTextFromPDF(arrayBuffer) {
  // NOTE: Implementasi nyata memerlukan library seperti pdf-parse
  // Contoh: const pdf = require('pdf-parse'); const data = await pdf(arrayBuffer); return data.text;
  console.warn("extractTextFromPDF is a placeholder. Implement with a library like 'pdf-parse' in API route.");
  return "Teks dari PDF (placeholder)";
}

export function extractTextFromDOCX(arrayBuffer) {
  // NOTE: Implementasi nyata memerlukan library seperti mammoth
  // Contoh: const mammoth = require('mammoth'); const result = await mammoth.extractRawText({arrayBuffer}); return result.value;
  console.warn("extractTextFromDOCX is a placeholder. Implement with a library like 'mammoth' in API route.");
  return "Teks dari DOCX (placeholder)";
}

export function parseCVData(cvText) {
  const data = {
    email: "",
    nama: "",
    linkedin: "",
    lokasi: "",
    cv_text: cvText
  }
  
  const emailMatch = cvText.match(/[\w\.-]+@[\w\.-]+\.\w+/)
  if (emailMatch) data.email = emailMatch[0]
  
  const linkedinMatch = cvText.match(/linkedin\.com\/in\/([\w-]+)/i)
  if (linkedinMatch) data.linkedin = `https://www.linkedin.com/in/${linkedinMatch[1]}`
  
  const firstLine = cvText.split('\n')[0].trim()
  if (firstLine && !firstLine.includes('@') && firstLine.split(' ').length < 5) {
    data.nama = firstLine
  }
  
  const lokasiMatch = cvText.match(/(Jakarta|Bandung|Surabaya|Yogyakarta|Jogja|Medan|Semarang|Makassar|Denpasar|Palembang)/i)
  if (lokasiMatch) {
    let lokasi = lokasiMatch[0]
    if (lokasi.toLowerCase() === "jogja") lokasi = "Yogyakarta"
    data.lokasi = lokasi
  }
  
  return data
}

export async function callGeminiAPI(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 1024 }
      })
    })
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    throw error; // Re-throw to be handled by the caller
  }
}