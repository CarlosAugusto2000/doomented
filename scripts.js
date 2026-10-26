document.addEventListener('DOMContentLoaded', () => {
    const bgAudio = document.getElementById('bg-music');
    const rangerAudio = document.getElementById('ranger-audio');
    const victoryAudio = document.getElementById('victory-audio');
    const SUPABASE_URL = 'https://rujcltpfugvsvqhvlbft.supabase.co';
    const SUPABASE_ANON_KEY ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1amNsdHBmdWd2c3ZxaHZsYmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NDExMjcsImV4cCI6MjEwNTAxNzEyN30.FOqSayT0v-3HfULK6xv8vVxRvvyb9dG0M2A-1HxPk9I'
    const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    async function loadComments() {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;

    const { data, error } = await _supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar comentários:', error);
        return;
    }

    commentsList.innerHTML = '';

    data.forEach(item => {
        const commentCard = document.createElement('div');
        commentCard.className = 'comment-item-card';
        commentCard.style.cssText = `
            background-color: #000000;
            border: 1px solid #3B0764;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 16px;
            box-shadow: 0 0 15px rgba(107, 33, 168, 0.2);
        `;

        commentCard.innerHTML = `
            <div style="font-family: 'MedievalSharp', cursive; font-size: 1.2rem; color: #A855F7; margin-bottom: 8px; text-shadow: 0 0 8px rgba(168, 85, 247, 0.5);">
                ${escapeHtml(item.nickname)}
            </div>
            <div style="font-family: sans-serif; font-size: 0.95rem; color: #FFFFFF; line-height: 1.5; word-break: break-word;">
                ${escapeHtml(item.comment)}
            </div>
        `;
        commentsList.appendChild(commentCard);
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
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
});
