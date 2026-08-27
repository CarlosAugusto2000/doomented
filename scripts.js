const audioTitle = new Audio('music/schizo.mp3');
const audioText = new Audio('music/quake.mp3'); // Substitua pelo caminho da sua nova música

const title = document.getElementById('title');
const welcomeText = document.getElementById('welcome-text');

title.addEventListener('click', () => {
    if (!audioText.paused) {
        audioText.pause();
    } else {
        audioTitle.pause();
    }
});

welcomeText.addEventListener('click', () => {
    if (!audioTitle.paused) {
        audioTitle.pause();
    }
    if (audioText.paused) {
        audioText.play();
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
