import { createReadStream } from 'fs'
import { parseCVData } from '../../lib/utils'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  // This is a simplified client-side approach. For true server-side parsing,
  // you'd need to use formidable/multer and libraries like pdf-parse and mammoth.
  // For now, we'll assume the client sends the text directly.
  try {
    const chunks = []
    for await (const chunk of req) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)
    const cvText = buffer.toString('utf-8') // Assuming plain text for simplicity
    const parsedData = parseCVData(cvText)
    res.status(200).json({ success: true, data: parsedData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Failed to parse CV' })
  }
}