document.addEventListener('DOMContentLoaded', () => {
    const section1 = document.getElementById('section-1');
    const section2 = document.getElementById('section-2');

    const audio1 = document.getElementById('audio-sec1');
    const audio2 = document.getElementById('audio-sec2');

  
    function pauseAll() {
        audio1.pause();
        audio2.pause();
    }

    
    section1.addEventListener('click', () => {
       
        if (!audio1.paused) {
            audio1.pause();
        } else {
   
            pauseAll();
            audio1.play().catch(error => {
                console.log("Ação do usuário necessária para tocar o áudio:", error);
            });
        }
    });

    section2.addEventListener('click', () => {
       
        if (!audio2.paused) {
            audio2.pause();
        } else {
       
            pauseAll();
            audio2.play().catch(error => {
                console.log("Ação do usuário necessária para tocar o áudio:", error);
            });
        }
    });
});
