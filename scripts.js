const SUPABASE_URL = 'https://rujcltpfugvsvqhvlbft.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_h6YR_dDHKOUNw0WI9ZFqxw_bsa_6Suj';


let _supabase = null;
if (typeof supabase !== 'undefined') {
    const { createClient } = supabase;
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

document.addEventListener('DOMContentLoaded', () => {

 
    const bgAudio = document.getElementById('bg-music');
    const rangerAudio = document.getElementById('ranger-audio');
    const victoryAudio = document.getElementById('victory-audio');
    
    let isPlaying = false;
    let lockBgMusic = false; 

    function startAudio() {
        if (lockBgMusic) return;

        if (!isPlaying && bgAudio) {
            bgAudio.play().then(() => {
                isPlaying = true;
            }).catch(error => {
                console.log("Aguardando interação para reproduzir o áudio:", error);
            });
        }
    }

    window.addEventListener('click', startAudio);
    window.addEventListener('keydown', startAudio);



    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');

    if (commentForm && _supabase) {
        fetchComments();

        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nickname = document.getElementById('nickname').value;
            const commentText = document.getElementById('comment').value;

            const submitBtn = commentForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            const { error } = await _supabase
                .from('comments')
                .insert([{ nickname: nickname, comment: commentText }]);

            if (error) {
                console.error('Erro ao enviar comentário:', error);
                alert('Erro ao enviar comentário. Tente novamente.');
            } else {
                commentForm.reset();
                fetchComments(); 
            }

            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
    }

    async function fetchComments() {
        if (!commentsList || !_supabase) return;

        const { data, error } = await _supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar comentários:', error);
            commentsList.innerHTML = '<p style="color: #F97316;">Erro ao carregar comentários.</p>';
            return;
        }

        commentsList.innerHTML = '';

        if (data.length === 0) {
            commentsList.innerHTML = '<p style="color: #FED7AA; font-family: sans-serif;">Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
            return;
        }

        data.forEach((item) => {
            const commentCard = document.createElement('div');
            commentCard.style.cssText = `
                background-color: #000000;
                border: 1px solid #7C2D12;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(194, 65, 12, 0.2);
            `;

            const dateFormatted = new Date(item.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            commentCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <strong style="font-family: 'MedievalSharp', cursive; color: #F97316; font-size: 1.1rem;">${escapeHtml(item.nickname)}</strong>
                    <span style="font-family: sans-serif; font-size: 0.8rem; color: #888;">${dateFormatted}</span>
                </div>
                <p style="font-family: sans-serif; color: #FFFFFF; font-size: 0.95rem; line-height: 1.4; word-break: break-word;">${escapeHtml(item.comment)}</p>
            `;

            commentsList.appendChild(commentCard);
        });
    }

 
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
});
