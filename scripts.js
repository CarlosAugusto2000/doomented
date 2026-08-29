document.addEventListener('DOMContentLoaded', () => {
    const titulo = document.querySelector('header h1');
    const musica = new Audio('/vinumsabbathi.mp3');
    titulo.addEventListener('click', () => {
        musica.currentTime = 0;
        musica.play().catch(error => {
            console.log('Erro ao tentar tocar o áudio:', error);
        });
    });
    titulo.style.cursor = 'pointer';
});
