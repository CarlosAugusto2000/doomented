document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('comment-form');
    const listaComentarios = document.getElementById('lista-comentarios');
    async function carregarComentarios() {
        try {
            const response = await fetch('/api/comentarios');
            if (!response.ok) throw new Error('Erro ao buscar comentários');
            
            const comentarios = await response.json();
            
            listaComentarios.innerHTML = ''; 

            if (comentarios.length === 0) {
                listaComentarios.innerHTML = '<p style="color: #888; text-align: center;">Nenhum comentário ainda. Seja o primeiro!</p>';
                return;
            }

            comentarios.forEach(c => {
                const item = document.createElement('div');
                item.className = 'comment-item';
                const dataEnvio = new Date(c.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                item.innerHTML = `
                    <div class="comment-header">
                        <strong>${escapeHTML(c.nome)}</strong>
                        <span class="comment-date">${dataEnvio}</span>
                    </div>
                    <p class="comment-text">${escapeHTML(c.mensagem)}</p>
                `;
                listaComentarios.appendChild(item);
            });
        } catch (error) {
            console.error('Erro:', error);
            listaComentarios.innerHTML = '<p style="color: #ff5555;">Erro ao carregar comentários.</p>';
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();

        if (!nome || !mensagem) return;

        try {
            const response = await fetch('/api/comentarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, mensagem })
            });

            if (response.ok) {
                form.reset(); 
                carregarComentarios(); 
            } else {
                alert('Ocorreu um erro ao enviar seu comentário.');
            }
        } catch (error) {
            console.error('Erro no envio:', error);
            alert('Falha na conexão com o servidor.');
        }
    });

    carregarComentarios();
});
