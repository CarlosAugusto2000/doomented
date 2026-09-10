document.addEventListener('DOMContentLoaded', () => {
    const secao1 = document.getElementById('secao1');
    const secao2 = document.getElementById('secao2');
    const secao3 = document.getElementById('secao3');
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
    secao1.addEventListener('click', (e) => {
        if (isInteractiveElement(e.target)) return;
        toggleAudio(audio1, audio2);
    });
    secao2.addEventListener('click', (e) => {
        if (isInteractiveElement(e.target)) return;
        toggleAudio(audio2, audio1);
    });
});

if (secao3) {
        secao3.addEventListener('click', (e) => {
            if (isInteractiveElement(e.target)) return;
        });
    }
});
