const supabaseUrl = 'https://rujcltpfugvsvqhvlbft.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1amNsdHBmdWd2c3ZxaHZsYmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NDExMjcsImV4cCI6MjEwNTAxNzEyN30.FOqSayT0v-3HfULK6xv8vVxRvvyb9dG0M2A-1HxPk9I';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('comment-form');
  const container = document.getElementById('lista-comentarios');

  async function carregarComentarios() {
    const { data, error } = await _supabase
      .from('comentarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro retornado pelo Supabase:', error);
      container.innerHTML = `<p style="color: red;">Erro ao carregar comentários: ${error.message}</p>`;
      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = '<p>Nenhum comentário ainda. Seja o primeiro!</p>';
      return;
    }

    container.innerHTML = data.map(c => `
      <div class="comentario-item">
        <strong>${escapeHtml(c.nome)}</strong>
        <p>${escapeHtml(c.mensagem)}</p>
      </div>
    `).join('');
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const mensagem = document.getElementById('mensagem').value;

      const { error } = await _supabase
        .from('comentarios')
        .insert([{ nome, mensagem }]);

      if (!error) {
        form.reset();
        carregarComentarios();
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
