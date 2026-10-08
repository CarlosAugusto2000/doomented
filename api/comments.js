export default async function handler(req, res) {
    // Permite chamadas de qualquer origem (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const SUPABASE_URL = 'https://rujcltpflugvsvqhvlbft.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1amNsdHBmdWd2c3ZxaHZsYmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NDExMjcsImV4cCI6MjEwNTAxNzEyN30.FOqSayT0v-3HfULK6xv8vVxRvvyb9dG0M2A-1HxPk9I';

    try {
        if (req.method === 'GET') {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/comments?select=*&order=created_at.desc`, {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                return res.status(500).json({ message: 'Resposta inválida do Supabase: ' + responseText });
            }

            if (!response.ok) {
                return res.status(response.status).json({ message: data.message || data.msg || 'Erro na API do Supabase' });
            }

            return res.status(200).json(data);
        }

        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            const { nickname, comment } = body || {};

            if (!nickname || !comment) {
                return res.status(400).json({ message: 'Apelido e comentário são obrigatórios.' });
            }

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

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                return res.status(500).json({ message: 'Resposta inválida do Supabase ao salvar: ' + responseText });
            }

            if (!response.ok) {
                return res.status(response.status).json({ message: data.message || data.msg || 'Erro ao guardar no Supabase' });
            }

            return res.status(200).json(data);
        }

        return res.status(405).json({ message: 'Método não permitido' });
    } catch (error) {
        console.error('Erro de servidor:', error);
        return res.status(500).json({ message: `Erro ao comunicar com o Supabase: ${error.message}` });
    }
}
