document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. CONFIGURATION & LOGIQUE AUDIO (MÉLANGE ALEATOIRE SANS REDONDANCE)
    // ==========================================================================
    const selectAudio = document.getElementById('select-audio');
    const audioSource = document.getElementById('audio-source');
    const fondSonore = document.getElementById('fond-sonore');

    const pistesAudio = [
        { fichier: "musiques/Visiteurs.mp3", nom: "Visiteurs" },
        { fichier: "musiques/Les portes.mp3", nom: "Les portes" },
        { fichier: "musiques/Broderie.mp3", nom: "Broderie" },
        { fichier: "musiques/Menestrel.mp3", nom: "Menestrel" },
        { fichier: "musiques/Le passage.mp3", nom: "Le passage" },
        { fichier: "musiques/Emile.mp3", nom: "Emile" },
        { fichier: "musiques/Interdits.mp3", nom: "Interdits" },
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

    function chargerEtJouerMusique(piste, tempsDebut = 0, etaitEnPause = false) {
        if (!selectAudio || !audioSource || !fondSonore) return;
        selectAudio.value = piste.fichier;
        audioSource.src = piste.fichier;
        fondSonore.load();

        // Caler la musique à la seconde exacte sauvegardée
        if (tempsDebut > 0) {
            fondSonore.addEventListener('loadedmetadata', () => {
                fondSonore.currentTime = tempsDebut;
            }, { once: true });
        }

        // Ne relancer la lecture que si elle n'était pas en pause
        if (!etaitEnPause) {
            fondSonore.play().catch(() => {
                console.log("Lecture automatique bloquée par le navigateur. En attente d'un clic.");
                document.body.addEventListener('click', () => {
                    fondSonore.play();
                }, { once: true });
            });
        }
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

        // Préparation de la playlist aléatoire
        melangerPlaylist();

        // Vérification d'une lecture en cours depuis la page précédente
        const fichierSauvegarde = sessionStorage.getItem('glsvp_audio_fichier');
        const tempsSauvegarde = parseFloat(sessionStorage.getItem('glsvp_audio_temps')) || 0;
        const etaitEnPause = sessionStorage.getItem('glsvp_audio_pause') === 'true';

        const pisteReprise = pistesAudio.find(p => p.fichier === fichierSauvegarde);

        if (pisteReprise) {
            // Synchroniser l'index de la playlist avec la piste reprise
            const indexReprise = fileDeLecture.findIndex(p => p.fichier === pisteReprise.fichier);
            if (indexReprise !== -1) indexActuelDansFile = indexReprise;
            
            chargerEtJouerMusique(pisteReprise, tempsSauvegarde, etaitEnPause);
        } else {
            // Premier chargement du site : lancement aléatoire normal
            const premierePiste = fileDeLecture[indexActuelDansFile];
            chargerEtJouerMusique(premierePiste);
        }

        // Sauvegarde automatique juste avant de changer de page
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('glsvp_audio_fichier', selectAudio.value);
            sessionStorage.setItem('glsvp_audio_temps', fondSonore.currentTime);
            sessionStorage.setItem('glsvp_audio_pause', fondSonore.paused);
        });
        
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

    // -------------------------------------------------------------------------
    // 2. LOGIQUE DU DIAPORAMA GLOBAL (IMAGES ALÉATOIRES FLUIDES)
    // -------------------------------------------------------------------------
    let diaporamaInterval = null;

    function lancerDiaporama(pageActuelle) {
    if (diaporamaInterval) clearInterval(diaporamaInterval);

    const images = (typeof catalogueImages !== 'undefined' && catalogueImages[pageActuelle])
        ? [...catalogueImages[pageActuelle]]
        : [];

    if (images.length > 0) {
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

        diaporamaInterval = setInterval(async () => {
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
    }

    // Lancement initial au chargement de la page
    const pageInitiale = document.body.dataset.page || 'accueil';
    lancerDiaporama(pageInitiale);


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

    window.changeLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('userLanguage', lang);
    applyTranslations(lang);
    };

    // Lancement initial des langues
    loadTranslations();

    // Redirection mobile passerelle
    const lienPasserelle = document.querySelector(".lien-passerelle");

    if (lienPasserelle) {
        lienPasserelle.addEventListener("click", (event) => {
            if (window.matchMedia("(max-width: 768px)").matches) {
                event.preventDefault();
                // Remplacez l'URL ci-dessous par le bon lien pour mobile
                const urlMobile = "https://passerelleportage.fr/qui-sommes-nous/#:~:text=Nous%20voyons";
                window.open(urlMobile, "_blank");
                }
        });
    }
    
    // -------------------------------------------------------------------------
    // 4. NAVIGATION FLUIDE SANS RECHARGEMENT (PRÉSERVE LA POSITION ET L'AUDIO)
    // -------------------------------------------------------------------------
    document.querySelectorAll('.btn-discipline').forEach(lien => {
    lien.addEventListener('click', async (e) => {
        e.preventDefault(); // Bloque le rechargement et garde la fenêtre figée

        const url = lien.getAttribute('href');

        try {
        const reponse = await fetch(url);
        if (!reponse.ok) throw new Error('Page introuvable');
        const texteHtml = await reponse.text();

        const parser = new DOMParser();
        const nouveauDoc = parser.parseFromString(texteHtml, 'text/html');

        const ancienMain = document.querySelector('main');
        const nouveauMain = nouveauDoc.querySelector('main');

        if (ancienMain && nouveauMain) {
            // 1. Remplace uniquement le contenu central
            ancienMain.innerHTML = nouveauMain.innerHTML;
            document.title = nouveauDoc.title;

            // 2. Met à jour l'identifiant de page et relance le bon diaporama
            const nouvellePage = nouveauDoc.body.dataset.page || 'accueil';
            document.body.dataset.page = nouvellePage;
            lancerDiaporama(nouvellePage);

            // 3. Traduit les nouveaux textes injectés dans <main>
            if (typeof applyTranslations === 'function') {
            applyTranslations(currentLang);
            }

            // 4. Met à jour l'URL dans la barre d'adresse
            window.history.pushState({}, '', url);
        }
        } catch (erreur) {
        window.location.href = url; // Sécurité si testé en local sans serveur
        }
    });
    });

    // Gère les boutons Précédent/Suivant du navigateur
    window.addEventListener('popstate', () => {
    window.location.reload();
    });


});