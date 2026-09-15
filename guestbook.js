document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('comment-form');
  const container = document.getElementById('lista-comentarios'); 


  async function carregarComentarios() {
    try {
      const res = await fetch('/api/comentarios');
      const comentarios = await res.json();

      if (!comentarios || comentarios.length === 0) {
        container.innerHTML = '<p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
        return;
      }

      container.innerHTML = comentarios.map(c => `
        <div class="comentario-item" style="border-bottom: 1px solid #444; margin-top: 15px; padding-bottom: 10px;">
          <strong style="color: #4da6ff;">${escapeHtml(c.nome)}</strong>
          <p style="margin-top: 5px;">${escapeHtml(c.mensagem)}</p>
        </div>
      `).join('');

    } catch (err) {
      console.error('Erro ao buscar comentários:', err);
      container.innerHTML = '<p style="color: red;">Erro ao carregar comentários.</p>';
    }
  }
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = document.getElementById('nome').value;
      const mensagem = document.getElementById('mensagem').value;

      try {
        const res = await fetch('/api/comentarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, mensagem })
        });

        if (res.ok) {
          form.reset();
          carregarComentarios(); 
        } else {
          alert('Erro ao enviar o comentário. Tente novamente.');
        }
      } catch (err) {
        console.error('Erro no envio:', err);
      }
    });
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  carregarComentarios();
});
