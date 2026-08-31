const audioTitle = new Audio('music/schizo.mp3');
const audioText = new Audio('music/quake.mp3');
const title = document.getElementById('title');
const welcomeText = document.getElementById('welcome-text');
title.addEventListener('click', () => { 
    if (!audioText.paused) {
        audioText.pause();
        audioText.currentTime = 0;
    }
    if (audioTitle.paused) {
        audioTitle.play().catch(error => console.log("Erro ao tocar áudio:", error));
    } else {
        audioTitle.pause();
    }
});
welcomeText.addEventListener('click', () => {
    
    if (!audioTitle.paused) {
        audioTitle.pause();
        audioTitle.currentTime = 0;
    }
    if (audioText.paused) {
        audioText.play().catch(error => console.log("Erro ao tocar áudio:", error));
    } else {
        audioText.pause();
    }
});
const commentForm = document.getElementById('comment-form');
commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Comentário enviado com sucesso!');
    commentForm.reset();
});
