import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('ERRO: Variáveis ausentes:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
    return res.status(500).json({ 
      error: 'Variáveis SUPABASE_URL ou SUPABASE_KEY não configuradas na Vercel.' 
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro na busca do Supabase:', error.message);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data || []);
    }

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
        console.error('Erro na inserção do Supabase:', error.message);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ success: true, data });
    }

    return res.status(405).json({ error: 'Método não permitido.' });

  } catch (err: any) {
    console.error('Erro de execução:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
