document.addEventListener('DOMContentLoaded', () => {
    const titulo = document.querySelector('header h1');
    const caixaHmm = document.querySelector('.full-box');
    const musicaTitulo = new Audio('music/vinumsabbathi.mp3');
    const musicaCaixa = new Audio('music/schizo.mp3');
    const toggleAudio = (audioAtual, outroAudio) => {
        if (!outroAudio.paused) {
            outroAudio.pause();
            outroAudio.currentTime = 0;
        }
        if (audioAtual.paused) {
            audioAtual.play().catch(error => {
                console.log('Erro ao tentar tocar o áudio:', error);
            });
        } else {
            audioAtual.pause();
        }
    };
    titulo.addEventListener('click', () => {
        toggleAudio(musicaTitulo, musicaCaixa);
    });
    caixaHmm.addEventListener('click', () => {
        toggleAudio(musicaCaixa, musicaTitulo);
    });
});
