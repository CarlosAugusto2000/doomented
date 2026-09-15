document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('comment-form');
  const container = document.getElementById('comments-list');
  async function carregarComentarios() {
    try {
      const res = await fetch('/api/comentarios');
      const comentarios = await res.json();

      if (container) {
        container.innerHTML = comentarios.map(c => `
          <div class="comentario-item" style="border-bottom: 1px solid #444; margin-bottom: 10px; padding-bottom: 5px;">
            <strong>${escapeHtml(c.nome)}</strong>:
            <p>${escapeHtml(c.mensagem)}</p>
          </div>
        `).join('');
      }
    } catch (err) {
      console.error('Erro ao carregar comentários:', err);
    }
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const mensagem = document.getElementById('mensagem').value;

      const res = await fetch('/api/comentarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, mensagem })
      });

      if (res.ok) {
        form.reset();
        carregarComentarios(); 
      } else {
        alert('Erro ao enviar comentário.');
      }
    });
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  carregarComentarios();
});
