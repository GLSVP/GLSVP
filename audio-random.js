document.addEventListener('DOMContentLoaded', () => {
    const selectAudio = document.getElementById('select-audio');
    const audioSource = document.getElementById('audio-source');
    const fondSonore = document.getElementById('fond-sonore');

    // 1. Liste centralisée de vos fichiers audio
    const pistesAudio = [
        { fichier: "Greensleeves.mp3", nom: "Greensleeves" },
        { fichier: "FurElise2.mp3", nom: "FurElise2" },
        { fichier: "Mozart.mp3", nom: "Mozart" },
        { fichier: "Visiteurs.mp3", nom: "Visiteurs" },
        { fichier: "Nocturnes.mp3", nom: "Nocturnes" },
        { fichier: "Clairdelune.mp3", nom: "Clair de lune" },
        { fichier: "Asturias.mp3", nom: "Asturias" },
        { fichier: "Bolero.mp3", nom: "Bolero" },
        { fichier: "Risingsun.mp3", nom: "Rising Sun" },
        { fichier: "Storm.mp3", nom: "Storm" },
        { fichier: "Vivaldi.mp3", nom: "Vivaldi" },
        { fichier: "West.mp3", nom: "West" },
        { fichier: "Vedere.mp3", nom: "Vedere" }
    ];

    // Variables pour gérer la file d'attente sans redondance
    let fileDeLecture = [];
    let indexActuelDansFile = 0;

    // Fonction de mélange de Fisher-Yates pour mélanger la playlist au hasard
    function melangerPlaylist() {
        // Crée une copie de la liste originale pour la mélanger
        fileDeLecture = [...pistesAudio];
        for (let i = fileDeLecture.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [fileDeLecture[i], fileDeLecture[j]] = [fileDeLecture[j], fileDeLecture[i]];
        }
        indexActuelDansFile = 0; // Réinitialise l'index au début de la file
    }

    // Fonction unifiée pour charger et lancer une musique
    function chargerEtJouerMusique(piste) {
        selectAudio.value = piste.fichier;
        audioSource.src = piste.fichier;
        fondSonore.load();
        
        fondSonore.play().catch(error => {
            console.log("Lecture automatique bloquée par le navigateur tant que l'utilisateur n'a pas cliqué sur la page.");
        });
    }

    if (selectAudio && audioSource && fondSonore) {
        // 2. Générer dynamiquement les options dans le menu HTML <select> dans l'ordre d'origine
        selectAudio.innerHTML = ''; 
        pistesAudio.forEach(piste => {
            const option = document.createElement('option');
            option.value = piste.fichier;
            option.textContent = piste.nom;
            selectAudio.appendChild(option);
        });

        // 3. Initialiser et mélanger la file d'attente au chargement
        melangerPlaylist();
        
        // Sélectionner la première piste issue du mélange aléatoire
        const premierePiste = fileDeLecture[indexActuelDansFile];
        selectAudio.value = premierePiste.fichier;
        audioSource.src = premierePiste.fichier;
        fondSonore.load();

        // 4. ÉCOUTEUR D'ÉVÉNEMENT : Permettre le changement manuel par l'utilisateur
        selectAudio.addEventListener('change', (event) => {
            const nouvellePisteFichier = event.target.value;
            const pisteTrouvee = pistesAudio.find(p => p.fichier === nouvellePisteFichier);
            
            if (pisteTrouvee) {
                // Si l'utilisateur change manuellement, on met à jour l'index dans notre file d'attente
                const indexDansFile = fileDeLecture.findIndex(p => p.fichier === nouvellePisteFichier);
                if (indexDansFile !== -1) {
                    indexActuelDansFile = indexDansFile;
                }
                chargerEtJouerMusique(pisteTrouvee);
            }
        });

        // 5. ENCHAÎNEMENT SANS REDONDANCE (Chaque piste est lue une seule fois)
        fondSonore.addEventListener('ended', () => {
            indexActuelDansFile++; // Passer à l'élément suivant de notre liste mélangée
            
            // Si toutes les pistes de la file ont été lues
            if (indexActuelDansFile >= fileDeLecture.length) {
                const dernierePisteFichier = fileDeLecture[fileDeLecture.length - 1].fichier;
                
                // On remélange la liste pour le cycle suivant
                do {
                    melangerPlaylist();
                } while (fileDeLecture[0].fichier === dernierePisteFichier && fileDeLecture.length > 1);
                // La boucle do-while évite que la première piste du nouveau cycle soit la même que la dernière du cycle précédent
            }

            const prochainePiste = fileDeLecture[indexActuelDansFile];
            chargerEtJouerMusique(prochainePiste);
        });
    }
});
