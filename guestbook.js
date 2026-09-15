const supabaseUrl = 'https://rujcltpfugvsvqhvlbft.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1amNsdHBmdWd2c3ZxaHZsYmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NDExMjcsImV4cCI6MjEwNTAxNzEyN30.FOqSayT0v-3HfULK6xv8vVxRvvyb9dG0M2A-1HxPk9I';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('comment-form');
  const container = document.getElementById('lista-comentarios');

  async function carregarComentarios() {
    if (!container) return;

    
    container.innerHTML = '<p style="color: #888;">Buscando comentários no Supabase...</p>';

    const { data, error } = await _supabase
      .from('comentarios')
      .select('*');

    if (error) {
      console.error('Erro ao buscar comentários:', error);
      container.innerHTML = `<p style="color: #ff2a2a;">Erro ao carregar: ${error.message}</p>`;
      return;
    }

    console.log('Dados recebidos do Supabase:', data);

    if (!data || data.length === 0) {
      container.innerHTML = '<p style="color: #cccccc;">Nenhum comentário ainda. Seja o primeiro!</p>';
      return;
    }

    
    const listaInvertida = [...data].reverse();

    
    container.innerHTML = '';

    
    listaInvertida.forEach(c => {
      const nomeVal = c.nome || c.Nome || 'Anônimo';
      const msgVal = c.mensagem || c.Mensagem || c.message || '';

      const item = document.createElement('div');
      item.className = 'comentario-item';
      item.style.cssText = 'background-color: #0d0d0d; border: 1px solid #333; padding: 12px; margin-top: 10px; border-radius: 4px; text-align: left;';

      item.innerHTML = `
        <strong style="color: #ff4d4d; font-size: 1.1rem; display: block; margin-bottom: 4px;">${escapeHtml(nomeVal)}</strong>
        <p style="color: #cccccc; margin: 0; line-height: 1.4; word-break: break-word;">${escapeHtml(msgVal)}</p>
      `;

      container.appendChild(item);
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nomeInput = document.getElementById('nome');
      const mensagemInput = document.getElementById('mensagem');

      const nome = nomeInput.value.trim();
      const mensagem = mensagemInput.value.trim();

      if (!nome || !mensagem) return;

      const { error } = await _supabase
        .from('comentarios')
        .insert([{ nome, mensagem }]);

      if (!error) {
        form.reset();
        await carregarComentarios();
      } else {
        alert('Erro ao enviar: ' + error.message);
      }
    });
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  carregarComentarios();
});
