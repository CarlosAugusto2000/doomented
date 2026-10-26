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
});
