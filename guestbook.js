const supabaseUrl = 'https://rujcltpfugvsvqhvlbft.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1amNsdHBmdWd2c3ZxaHZsYmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NDExMjcsImV4cCI6MjEwNTAxNzEyN30.FOqSayT0v-3HfULK6xv8vVxRvvyb9dG0M2A-1HxPk9I';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('comment-form');
  const container = document.getElementById('lista-comentarios');

  async function carregarComentarios() {
    const { data, error } = await _supabase
      .from('comentarios')
      .select('*');

    if (error) {
      console.error('Erro ao buscar comentários:', error);
      container.innerHTML = `<p style="color: #ff4d4d;">Erro ao carregar comentários: ${error.message}</p>`;
      return;
    }

    console.log('Dados recebidos do Supabase:', data);

    if (!data || data.length === 0) {
      container.innerHTML = '<p style="color: #ccc;">Nenhum comentário ainda. Seja o primeiro!</p>';
      return;
    }

  
    const listaInvertida = [...data].reverse();

    container.innerHTML = listaInvertida.map(c => {

      const nomeVal = c.nome || c.Nome || 'Anônimo';
      const msgVal = c.mensagem || c.Mensagem || c.message || '';

      return `
        <div class="comentario-item" style="border: 1px solid #ff4d4d; border-radius: 6px; padding: 12px; margin-top: 12px; background: rgba(0, 0, 0, 0.6); text-align: left;">
          <strong style="color: #ff4d4d; display: block; font-size: 1.1em; margin-bottom: 6px; font-family: inherit;">${escapeHtml(nomeVal)}</strong>
          <p style="color: #ffffff; margin: 0; line-height: 1.4; white-space: pre-wrap; font-family: sans-serif;">${escapeHtml(msgVal)}</p>
        </div>
      `;
    }).join('');
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
