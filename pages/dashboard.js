import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({ totalTalents: 0, totalOccupations: 0, skillGapData: [], occupationDistribution: [], locationDistribution: [], clusterAnalysis: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [aiInsights, setAiInsights] = useState('')
  
  useEffect(() => { fetchDashboardData() }, [])
  
  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const [talentsRes, occupationsRes, mappingRes, locationRes, gapRes, clusterRes] = await Promise.all([
        supabase.from('Talenta').select('*', { count: 'exact', head: true }),
        supabase.from('PON_TIK_Master').select('*', { count: 'exact', head: true }),
        supabase.from('Hasil_Pemetaan_Asesmen').select('PON_TIK_Master(Okupasi)'),
        supabase.from('Talenta').select('Lokasi').not('Lokasi', 'is', null),
        supabase.from('Hasil_Pemetaan_Asesmen').select('Gap_Keterampilan').not('Gap_Keterampilan', 'is', null),
        supabase.from('Hasil_Pemetaan_Asesmen').select('Skor_Kecocokan_Awal', 'Skor_Asesmen')
      ])

      if (talentsRes.error || occupationsRes.error || mappingRes.error || locationRes.error || gapRes.error || clusterRes.error) throw new Error('Error fetching dashboard data')

      const occupationCounts = mappingRes.data.reduce((acc, curr) => { const okupasi = curr.PON_TIK_Master?.Okupasi || 'Unknown'; acc[okupasi] = (acc[okupasi] || 0) + 1; return acc; }, {})
      const locationCounts = locationRes.data.reduce((acc, curr) => { const lokasi = curr.Lokasi || 'Unknown'; acc[lokasi] = (acc[lokasi] || 0) + 1; return acc; }, {})
      const skillGapCounts = gapRes.data.reduce((acc, curr) => { curr.Gap_Keterampilan.split(',').forEach(g => { g = g.trim(); if(g) acc[g] = (acc[g] || 0) + 1; }); return acc; }, {})
      
      const clusters = { 'Validated': 0, 'Over-promise': 0, 'Hidden Gem': 0, 'Emerging': 0 }
      const threshold = 0.7;
      clusterRes.data.forEach(item => {
        const kecocokan = item.Skor_Kecocokan_Awal || 0; const asesmen = item.Skor_Asesmen || 0;
        if (kecocokan >= threshold && asesmen >= threshold) clusters['Validated']++;
        else if (kecocokan >= threshold && asesmen < threshold) clusters['Over-promise']++;
        else if (kecocokan < threshold && asesmen >= threshold) clusters['Hidden Gem']++;
        else clusters['Emerging']++;
      });

      setDashboardData({
        totalTalents: talentsRes.count, totalOccupations: occupationsRes.count,
        skillGapData: Object.entries(skillGapCounts).sort((a,b) => b[1]-a[1]).slice(0,5).map(([name, value])=>({name, value})),
        occupationDistribution: Object.entries(occupationCounts).map(([name, value])=>({name, value})),
        locationDistribution: Object.entries(locationCounts).map(([name, value])=>({name, value})),
        clusterAnalysis: [
          { name: 'Validated', value: clusters['Validated'], color: '#10b981' },
          { name: 'Over-promise', value: clusters['Over-promise'], color: '#f59e0b' },
          { name: 'Hidden Gem', value: clusters['Hidden Gem'], color: '#3b82f6' },
          { name: 'Emerging', value: clusters['Emerging'], color: '#ef4444' }
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const generateAIInsights = async () => {
    setIsLoading(true)
    try {
      // Placeholder for AI insights generation
      setAiInsights("## Insight Utama\n\n1. **Kekurangan JavaScript**: JavaScript adalah skill gap terbesar.\n2. **Konsentrasi Geografis**: Sebagian besar talenta berada di Jakarta.\n3. **Potensi Hidden Gem**: Banyak talenta yang belum terdeteksi dengan baik.\n\n## Rekomendasi Kebijakan\n\n1. **Program Pelatihan JavaScript**: Mengembangkan program pelatihan JavaScript.\n2. **Pengembangan Talent di Luar Jawa**: Mendorong pengembangan ekosistem digital di luar Jawa.\n3. **Sistem Deteksi Talent**: Meningkatkan algoritma pemetaan.");
    } catch (error) {
      console.error('Error generating AI insights:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isLoading && !dashboardData.totalTalents) return <Layout><div className="max-w-6xl mx-auto text-center py-12"><p>Memuat data dashboard...</p></div></Layout>
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard Nasional</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center"><h2 className="text-3xl font-bold text-blue-600">{dashboardData.totalTalents.toLocaleString()}</h2><p className="text-gray-600">Total Talenta</p></div>
          <div className="card text-center"><h2 className="text-3xl font-bold text-green-600">{dashboardData.totalOccupations}</h2><p className="text-gray-600">Jenis Okupasi</p></div>
          <div className="card text-center"><h2 className="text-3xl font-bold text-purple-600">{dashboardData.skillGapData.length}</h2><p className="text-gray-600">Skill Gap</p></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card"><h2 className="text-xl font-semibold mb-4">Distribusi Okupasi</h2><ResponsiveContainer width="100%" height={300}><BarChart data={dashboardData.occupationDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" angle={-45} textAnchor="end" height={100} /><YAxis /><Tooltip /><Bar dataKey="value" fill="#3b82f6" /></BarChart></ResponsiveContainer></div>
          <div className="card"><h2 className="text-xl font-semibold mb-4">Sebaran Lokasi</h2><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={dashboardData.locationDistribution} cx="50%" cy="50%" labelLine={false} label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">{dashboardData.locationDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={['#0088fe', '#00c49f', '#ffbb28', '#ff8042', '#8884d8'][index % 5]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card"><h2 className="text-xl font-semibold mb-4">Skill Gap Nasional</h2><ResponsiveContainer width="100%" height={300}><BarChart data={dashboardData.skillGapData} layout="horizontal"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={100} /><Tooltip /><Bar dataKey="value" fill="#ef4444" /></BarChart></ResponsiveContainer></div>
          <div className="card"><h2 className="text-xl font-semibold mb-4">Analisis Klaster Talenta</h2><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={dashboardData.clusterAnalysis} cx="50%" cy="50%" labelLine={false} label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">{dashboardData.clusterAnalysis.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="mt-4"><p><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>Validated</p><p><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>Over-promise</p><p><span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>Hidden Gem</p><p><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>Emerging</p></div></div>
        </div>
        
        <div className="card">
          <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">Analisis AI & Rekomendasi</h2><button className="btn btn-primary" onClick={generateAIInsights} disabled={isLoading}>{isLoading ? 'Memproses...' : 'Generate Insight AI'}</button></div>
          {aiInsights ? <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: aiInsights.replace(/\n/g, '<br>').replace(/## (.*)/g, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^\d\. (.*)/gm, '<li>$1</li>').replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>') }} /> : <p>Klik tombol "Generate Insight AI" untuk mendapatkan analisis.</p>}
        </div>
      </div>
    </Layout>
  )
}