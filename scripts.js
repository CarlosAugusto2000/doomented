document.addEventListener('DOMContentLoaded', () => {

    const SUPABASE_URL = 'https://rujcltpfugvsvqhvlbft.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_h6YR_dDHKOUNw0WI9ZFqxw_bsa_6Suj'; 

    let supabase = null;
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    const form = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');

    async function fetchComments() {
        if (!commentsList) return;

        if (!supabase) {
            console.error("Cliente do Supabase não foi carregado corretamente.");
            return;
        }

        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw new Error(error.message);
            }

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

            if (!supabase) {
                alert('Erro na configuração do Supabase.');
                return;
            }

            try {
                const { error } = await supabase
                    .from('comments')
                    .insert([{ nickname, comment }]);

                if (error) {
                    alert('Erro ao enviar comentário: ' + error.message);
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

    const doomentedTitle = document.getElementById('doomented-title');
    const audioMusic = document.getElementById('audio-music');
    const gifLink = document.querySelector('.gif-link');

    if (doomentedTitle && audioMusic) {
        doomentedTitle.addEventListener('click', () => {
            if (!audioMusic.paused) {
                audioMusic.pause();
            } else {
                audioMusic.play().catch(error => {
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
