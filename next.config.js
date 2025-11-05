/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    SUPABASE_URL: 'https://gzspvxyjaorxukqjzcgw.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6c3B2eHlqYW9yeHVrcWp6Y2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDcyMTgsImV4cCI6MjA3Nzg4MzIxOH0.jDHkpjVIbL5JpPRn-AeZ9lNFC57ja0iO6ooYRjLL-P4',
    GEMINI_API_KEY: 'AIzaSyCR8xgDIv5oYBaDmMyuGGWjqpFi7U8SGA4'
  }
}

module.exports = nextConfig