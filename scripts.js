document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-music');
    let isPlaying = false;

    function startAudio() {
        if (!isPlaying) {
            audio.play().then(() => {
                isPlaying = true;
             
                window.removeEventListener('click', startAudio);
                window.removeEventListener('keydown', startAudio);
            }).catch(error => {
                console.log("Aguardando interação para reproduzir o áudio:", error);
            });
        }
    }

    window.addEventListener('click', startAudio);
    window.addEventListener('keydown', startAudio);
});
