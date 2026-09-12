document.addEventListener('DOMContentLoaded', () => {
    const secao1 = document.getElementById('secao1');
    const secao2 = document.getElementById('secao2');
    const secao3 = document.getElementById('secao3');
    const secao5 = document.getElementById('secao5');
    const audio1 = document.getElementById('audio1');
    const audio2 = document.getElementById('audio2');

    function toggleAudio(targetAudio, otherAudio) {
        otherAudio.pause();
        otherAudio.currentTime = 0;

        if (!targetAudio.paused) {
            targetAudio.pause();
        } else {
            targetAudio.play().catch(error => {
                console.log("Erro ao tentar tocar o áudio: ", error);
            });
        }
    }

    function isInteractiveElement(target) {
        return target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a');
    }

    if (secao1) {
        secao1.addEventListener('click', (e) => {
            if (isInteractiveElement(e.target)) return;
            toggleAudio(audio1, audio2);
        });
    }

    if (secao2) {
        secao2.addEventListener('click', (e) => {
            if (isInteractiveElement(e.target)) return;
            toggleAudio(audio2, audio1);
        });
    }

    if (secao3) {
        secao3.addEventListener('click', (e) => {
            if (isInteractiveElement(e.target)) return;
        });
    }
});

if (secao5) {
    secao5.addEventListener('click', (e) => {
        if (isInteractiveElement(e.target)) return;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('comment-form');
    const container = document.getElementById('lista-comentarios');

    function carregarComentarios() {
        const comentarios = JSON.parse(localStorage.getItem('doomented_comments') || '[]');
        container.innerHTML = comentarios.map(c => `
            <div class="comment-item">
                <span class="comment-author">${c.nome}</span>
                <p class="comment-text">${c.mensagem}</p>
            </div>
        `).join('');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const mensagem = document.getElementById('mensagem').value;

        const comentarios = JSON.parse(localStorage.getItem('doomented_comments') || '[]');
        comentarios.unshift({ nome, mensagem });
        localStorage.setItem('doomented_comments', JSON.stringify(comentarios));

        form.reset();
        carregarComentarios();
    });

    carregarComentarios();
});
