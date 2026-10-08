
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');

    const SUPABASE_URL = 'https://rujcltpflugvsvqhvlbft.supabase.co';

    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1amNsdHBmdWd2c3ZxaHZsYmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NDExMjcsImV4cCI6MjEwNTAxNzEyN30.FOqSayT0v-3HfULK6xv8vVxRvvyb9dG0M2A-1HxPk9I';

    async function fetchComments() {
        if (!commentsList) return;

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/comments?select=*&order=created_at.desc`, {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            commentsList.innerHTML = '';

            if (!data || data.length === 0) {
                commentsList.innerHTML = '<p style="color: #a855f7;">Nenhum comentário ainda. Seja o primeiro!</p>';
                return;
            }

            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'comment-card';

                const dateFormatted = new Date(item.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                card.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-nickname">${escapeHtml(item.nickname)}</span>
                        <span class="comment-date">${dateFormatted}</span>
                    </div>
                    <div class="comment-body">${escapeHtml(item.comment)}</div>
                `;
                commentsList.appendChild(card);
            });
        } catch (err) {
            console.error("Erro no Supabase:", err);
            commentsList.innerHTML = `<p style="color: #ff4d4d;">Erro ao carregar comentários: ${err.message}</p>`;
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nicknameInput = document.getElementById('nickname');
            const commentInput = document.getElementById('comment');

            const nickname = nicknameInput ? nicknameInput.value.trim() : '';
            const comment = commentInput ? commentInput.value.trim() : '';

            if (!nickname || !comment) {
                alert('Por favor, preencha o apelido e o comentário!');
                return;
            }

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({ nickname, comment })
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    alert('Erro ao enviar comentário: ' + (errData.message || `Erro HTTP ${response.status}`));
                } else {
                    alert('Comentário enviado com sucesso!');
                    form.reset();
                    fetchComments();
                }
            } catch (err) {
                alert('Erro de conexão ao enviar o comentário.');
                console.error(err);
            }
        });
    }

    fetchComments();


    const section1 = document.getElementById('section-1');
    const section2 = document.getElementById('section-2');
    const gifLink = document.querySelector('.gif-link');

    const audio1 = document.getElementById('audio-sec1');
    const audio2 = document.getElementById('audio-sec2');

    function pauseAll() {
        if (audio1) audio1.pause();
        if (audio2) audio2.pause();
    }

    if (section1 && audio1) {
        section1.addEventListener('click', () => {
            if (!audio1.paused) {
                audio1.pause();
            } else {
                pauseAll();
                audio1.play().catch(error => {
                    console.log("Ação do usuário necessária para tocar o áudio:", error);
                });
            }
        });
    }

    if (section2 && audio2) {
        section2.addEventListener('click', () => {
            if (!audio2.paused) {
                audio2.pause();
            } else {
                pauseAll();
                audio2.play().catch(error => {
                    console.log("Ação do usuário necessária para tocar o áudio:", error);
                });
            }
        });
    }

    if (gifLink) {
        gifLink.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});
