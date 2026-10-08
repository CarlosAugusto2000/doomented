export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const SUPABASE_URL = 'https://rujcltpflugvsvqhvlbft.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1amNsdHBmdWd2c3ZxaHZsYmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NDExMjcsImV4cCI6MjEwNTAxNzEyN30.FOqSayT0v-3HfULK6xv8vVxRvvyb9dG0M2A-1HxPk9I';

    try {
        if (req.method === 'GET') {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/comments?select=*&order=created_at.desc`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            return res.status(response.status).json(data);
        }

        if (req.method === 'POST') {
            const { nickname, comment } = req.body;

            const response = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({ nickname, comment })
            });

            const data = await response.json();
            return res.status(response.status).json(data);
        }

        return res.status(405).json({ message: 'Método não permitido' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
