const audio = new Audio('music/schizo.mp3');
const title= document.getElementById('title');
title.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

const commentForm = document.getElementById('comment-form');
commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Comentário enviado com sucesso!');
    commentForm.reset();
});