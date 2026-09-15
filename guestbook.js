const supabaseUrl = 'https://rujcltpfugvsvqhvlbft.supabase.co';
const supabaseKey = 'SUA_CHAVE_ANON_PUBLIC_AQUI';
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
      container.innerHTML = '<p style="color: red;">Erro ao carregar comentários.</p>';
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
