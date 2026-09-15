import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Libera o CORS para aceitar requisições do seu frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Se as chaves do Supabase estiverem ausentes no servidor
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Configuração do Supabase ausente na Vercel.' });
  }

  try {
    // BUSCAR COMENTÁRIOS (GET)
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data || []);
    }

    // ENVIAR COMENTÁRIO (POST)
    if (req.method === 'POST') {
      const { nome, mensagem } = req.body || {};

      if (!nome || !mensagem) {
        return res.status(400).json({ error: 'Preencha todos os campos.' });
      }

      const { data, error } = await supabase
        .from('comentarios')
        .insert([{ nome, mensagem }]);

      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    return res.status(405).json({ error: 'Método não permitido.' });

  } catch (err: any) {
    console.error('Erro na API:', err.message);
    return res.status(500).json({ error: err.message });
  }
