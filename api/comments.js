import https from 'https';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const SUPABASE_HOST = 'rujcltpflugvsvqhvlbft.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1amNsdHBmdWd2c3ZxaHZsYmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NDExMjcsImV4cCI6MjEwNTAxNzEyN30.FOqSayT0v-3HfULK6xv8vVxRvvyb9dG0M2A-1HxPk9I';

    function supabaseRequest(path, method, bodyData = null) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: SUPABASE_HOST,
                port: 443,
                path: path,
                method: method,
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                }
            };

            const request = https.request(options, (response) => {
                let data = '';
                response.on('data', (chunk) => { data += chunk; });
                response.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        resolve({ statusCode: response.statusCode, data: parsed });
                    } catch (e) {
                        resolve({ statusCode: response.statusCode, data: data });
                    }
                });
            });

            request.on('error', (err) => {
                reject(err);
            });

            if (bodyData) {
                request.write(JSON.stringify(bodyData));
            }

            request.end();
        });
    }

    try {
        if (req.method === 'GET') {
            const result = await supabaseRequest('/rest/v1/comments?select=*&order=created_at.desc', 'GET');
            return res.status(result.statusCode).json(result.data);
        }

        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            const { nickname, comment } = body || {};

            if (!nickname || !comment) {
                return res.status(400).json({ message: 'Apelido e comentário são obrigatórios.' });
            }

            const result = await supabaseRequest('/rest/v1/comments', 'POST', { nickname, comment });
            return res.status(result.statusCode).json(result.data);
        }

        return res.status(405).json({ message: 'Método não permitido' });
    } catch (error) {
        console.error('Erro de conexão:', error);
        return res.status(500).json({ message: 'Falha na conexão com o Supabase: ' + error.message });
    }

