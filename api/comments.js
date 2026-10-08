import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rujcltpflugvsvqhvlbft.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1amNsdHBmdWd2c3ZxaHZsYmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NDExMjcsImV4cCI6MjEwNTAxNzEyN30.FOqSayT0v-3HfULK6xv8vVxRvvyb9dG0M2A-1HxPk9I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                return res.status(400).json({ message: error.message });
            }

            return res.status(200).json(data);
        }

        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            const { nickname, comment } = body || {};

            if (!nickname || !comment) {
                return res.status(400).json({ message: 'Apelido e comentário são obrigatórios.' });
            }

            const { data, error } = await supabase
                .from('comments')
                .insert([{ nickname, comment }])
                .select();

            if (error) {
                return res.status(400).json({ message: error.message });
            }

            return res.status(200).json(data);
        }

        return res.status(405).json({ message: 'Método não permitido' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
