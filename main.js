document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. CONFIGURATION & LOGIQUE AUDIO (MÉLANGE ALEATOIRE SANS REDONDANCE)
    // ==========================================================================
    const selectAudio = document.getElementById('select-audio');
    const audioSource = document.getElementById('audio-source');
    const fondSonore = document.getElementById('fond-sonore');

    const pistesAudio = [
        { fichier: "Musique/Greensleeves.mp3", nom: "Greensleeves" },
        { fichier: "Musique/FurElise2.mp3", nom: "FurElise2" },
        { fichier: "Musique/Mozart.mp3", nom: "Mozart" },
        { fichier: "Musique/Visiteurs.mp3", nom: "Visiteurs" },
        { fichier: "Musique/Nocturnes.mp3", nom: "Nocturnes" },
        { fichier: "Musique/Clairdelune.mp3", nom: "Clair de lune" },
        { fichier: "Musique/Asturias.mp3", nom: "Asturias" },
        { fichier: "Musique/Bolero.mp3", nom: "Bolero" },
        { fichier: "Musique/Risingsun.mp3", nom: "Rising Sun" },
        { fichier: "Musique/Test.mp3", nom: "Test" },
    ];

    let fileDeLecture = [];
    let indexActuelDansFile = 0;

    function melangerPlaylist() {
        fileDeLecture = [...pistesAudio];
        for (let i = fileDeLecture.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [fileDeLecture[i], fileDeLecture[j]] = [fileDeLecture[j], fileDeLecture[i]];
        }
        indexActuelDansFile = 0;
    }

    function chargerEtJouerMusique(piste) {
        if (!selectAudio || !audioSource || !fondSonore) return;
        selectAudio.value = piste.fichier;
        audioSource.src = piste.fichier;
        fondSonore.load();
        
        fondSonore.play().catch(() => {
            console.log("Lecture automatique bloquée par le navigateur. En attente d'un clic utilisateur.");
            document.body.addEventListener('click', () => {
                fondSonore.play();
            }, { once: true });
        });
    }

    if (selectAudio && audioSource && fondSonore) {
        // Paramètres initiaux du lecteur
        fondSonore.volume = 0.35;
        fondSonore.playbackRate = 1;

        // Génération dynamique des options du menu déroulant
        selectAudio.innerHTML = ''; 
        pistesAudio.forEach(piste => {
            const option = document.createElement('option');
            option.value = piste.fichier;
            option.textContent = piste.nom;
            selectAudio.appendChild(option);
        });

        // Lancement de la première piste aléatoire
        melangerPlaylist();
        const premierePiste = fileDeLecture[indexActuelDansFile];
        chargerEtJouerMusique(premierePiste);

        // Écouteur : Changement manuel par l'utilisateur
        selectAudio.addEventListener('change', (event) => {
            const nouvellePisteFichier = event.target.value;
            const pisteTrouvee = pistesAudio.find(p => p.fichier === nouvellePisteFichier);
            
            if (pisteTrouvee) {
                const indexDansFile = fileDeLecture.findIndex(p => p.fichier === nouvellePisteFichier);
                if (indexDansFile !== -1) {
                    indexActuelDansFile = indexDansFile;
                }
                chargerEtJouerMusique(pisteTrouvee);
            }
        }); 

        // Écouteur : Fin de piste -> Enchaînement automatique intelligent
        fondSonore.addEventListener('ended', () => {
            indexActuelDansFile++; 
            
            if (indexActuelDansFile >= fileDeLecture.length) {
                const dernierePisteFichier = fileDeLecture[fileDeLecture.length - 1].fichier;
                do {
                    melangerPlaylist();
                } while (fileDeLecture[0].fichier === dernierePisteFichier && fileDeLecture.length > 1);
            }

            const prochainePiste = fileDeLecture[indexActuelDansFile];
            chargerEtJouerMusique(prochainePiste);
        });
    }

    // ==========================================================================
    // 2. LOGIQUE DU DIAPORAMA GLOBAL (IMAGES ALÉATOIRES FLUIDES)
    // ==========================================================================
    // On s'assure que le tableau "images" existe via votre fichier externe images.js
    if (typeof images !== 'undefined' && images.length > 0) {
        const container = document.getElementById('bg-slideshow');
        
        if (container) {
            const layers = container.getElementsByClassName('slideshow-layer');
            let activeLayerIndex = 0;
            let currentIndex = 0;

            // Mélange initial du catalogue d'images
            images.sort(() => Math.random() - 0.5);
            
            if (layers.length > 0) {
                layers[activeLayerIndex].style.backgroundImage = `url('${images[0]}')`;
            }

            function preloadImage(url) {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => resolve(url);
                });
            }

            setInterval(async () => {
                if (images.length === 0 || layers.length < 2) return;

                currentIndex = (currentIndex + 1) % images.length;
                const nextImageUrl = images[currentIndex];
                const nextLayerIndex = activeLayerIndex === 0 ? 1 : 0;

                await preloadImage(nextImageUrl);

                layers[nextLayerIndex].style.backgroundImage = `url('${nextImageUrl}')`;
                layers[activeLayerIndex].classList.remove('active');
                layers[nextLayerIndex].classList.add('active');

                activeLayerIndex = nextLayerIndex;
            }, 4000);
        }
    }
});

// ==========================================================================
// 3. LOGIQUE INTERNATIONALE (GESTION DE TRADUCTION SANS ONCLICK INLINE)
// ==========================================================================
let currentLang = localStorage.getItem('userLanguage') || 'fr';
let translations = {};

async function loadTranslations() {
    try {
        const response = await fetch('langue.json');
        if (!response.ok) throw new Error('Erreur de chargement du fichier de langues');
        translations = await response.json();
        applyTranslations(currentLang);
    } catch (error) {
        console.error('Impossible de charger les traductions:', error);
    }
}

function applyTranslations(lang) {
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    document.documentElement.lang = lang;
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('userLanguage', lang);
    applyTranslations(lang);
}

// Lancement initial des langues
loadTranslations();
