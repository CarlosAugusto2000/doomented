import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Configuração de CORS para permitir requisições do seu frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  // Verifica se as variáveis de ambiente foram configuradas na Vercel
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ 
      error: 'Variáveis SUPABASE_URL ou SUPABASE_KEY não foram encontradas na Vercel.' 
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. BUSCAR COMENTÁRIOS (GET)
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data || []);
    }

    // 2. ENVIAR COMENTÁRIO (POST)
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { nome, mensagem } = body || {};

      if (!nome || !mensagem) {
        return res.status(400).json({ error: 'Nome e mensagem são obrigatórios.' });
      }

      const { data, error } = await supabase
        .from('comentarios')
        .insert([{ nome, mensagem }]);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ success: true, data });
    }

    return res.status(405).json({ error: 'Método não permitido.' });

  } catch (err: any) {
    return res.status(500).json({ error: 'Erro interno no servidor: ' + err.message });
  }
}
