import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  
  const { talentId, skills } = req.body
  if (!talentId || !skills) return res.status(400).json({ message: 'Missing talentId or skills' })

  try {
    // Get jobs
    const { data: jobsData, error: jobsError } = await supabase.from('Lowongan_Industri').select('*')
    if (jobsError) throw jobsError

    const matchedJobs = jobsData.filter(job => {
      const requiredSkills = job.Keterampilan_Dibutuhkan.toLowerCase().split(', ');
      return skills.some(skill => requiredSkills.includes(skill.toLowerCase()));
    }).map(job => ({ ...job, matchScore: Math.floor(Math.random() * 30) + 70 }));

    // Mock trainings
    const mockTrainings = [
      { id: 'training_001', title: 'Advanced React Course', provider: 'Tech Academy', format: 'Online', description: 'Pelajari React secara mendalam.', duration: '6 weeks', matchScore: 80 },
      { id: 'training_002', title: 'Node.js Backend Development', provider: 'Code Institute', format: 'Online', description: 'Pelajari cara membangun backend.', duration: '8 weeks', matchScore: 75 }
    ];
    
    res.status(200).json({ success: true, data: { jobs: matchedJobs, trainings: mockTrainings } })
  } catch (error) {
    console.error('Error getting recommendations:', error)
    res.status(500).json({ success: false, message: 'Failed to get recommendations' })
  }
}