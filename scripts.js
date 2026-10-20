document.addEventListener('DOMContentLoaded', () => {
    const bgAudio = document.getElementById('bg-music');
    const rangerAudio = document.getElementById('ranger-audio');
    const victoryAudio = document.getElementById('victory-audio');
    
    let isPlaying = false;
    let activeResultAudio = null;

 
    function startAudio() {
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

    const fateCards = document.querySelectorAll('.fate-card');
    const resultScreen = document.getElementById('result-screen');
    const resultTitle = document.getElementById('result-title');
    const resultImageContainer = document.getElementById('result-image-container');
    const btnBack = document.getElementById('btn-back');


    fateCards.forEach(card => {
        card.addEventListener('click', (event) => {
        
 
            if (bgAudio) {
                bgAudio.pause();
                bgAudio.currentTime = 0;
                isPlaying = false;
            }

            const choice = card.getAttribute('data-choice');
            resultImageContainer.innerHTML = ''; 

            if (choice === 'poorly') {
                resultTitle.textContent = "You choose poorly";
                activeResultAudio = rangerAudio;
            } else if (choice === 'best') {
                resultTitle.textContent = "Congratulations, you are the best!";
                activeResultAudio = victoryAudio;

                const img = document.createElement('img');
                img.src = 'doomguy.jpeg';
                img.alt = 'Doomguy';
                img.className = 'doomguy-img';
                resultImageContainer.appendChild(img);
            }

         
            if (resultScreen) {
                resultScreen.classList.remove('hidden');
            }

            if (activeResultAudio) {
                activeResultAudio.currentTime = 0;
                activeResultAudio.play().catch(error => {
                    console.log("Erro ao reproduzir áudio automático:", error);
                });
            }
        });
    });


    if (resultScreen) {
        resultScreen.addEventListener('click', (event) => {
            if (event.target === btnBack) return;

            if (activeResultAudio) {
                activeResultAudio.currentTime = 0;
                activeResultAudio.play().catch(error => {
                    console.log("Aguardando interação para áudio de resultado:", error);
                });
            }
        });
    }

    if (btnBack) {
        btnBack.addEventListener('click', (event) => {
            event.stopPropagation(); 


            
            resultScreen.classList.add('hidden');

            if (activeResultAudio) {
                activeResultAudio.pause();
                activeResultAudio.currentTime = 0;
                activeResultAudio = null;
            }

     
            startAudio();
        });
    }
});
