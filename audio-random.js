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
        { fichier: "Bolero.mp3", nom: "Bolero" }
    ];

    // Fonction isolée pour appliquer et lancer une musique
    function chargerEtJouerMusique(piste) {
        selectAudio.value = piste.fichier;
        audioSource.src = piste.fichier;
        fondSonore.load();
        
        fondSonore.play().catch(error => {
            console.log("Lecture automatique bloquée par le navigateur tant que l'utilisateur n'a pas cliqué sur la page.");
        });
    }

    if (selectAudio && audioSource && fondSonore) {
        // 2. Générer dynamiquement les options dans le menu HTML <select>
        selectAudio.innerHTML = ''; 
        pistesAudio.forEach(piste => {
            const option = document.createElement('option');
            option.value = piste.fichier;
            option.textContent = piste.nom;
            selectAudio.appendChild(option);
        });

        // 3. Sélectionner une première piste au hasard au chargement de la page
        const indexAleatoire = Math.floor(Math.random() * pistesAudio.length);
        const pisteChoisie = pistesAudio[indexAleatoire];
        
        // Appliquer la musique de départ au chargement
        selectAudio.value = pisteChoisie.fichier;
        audioSource.src = pisteChoisie.fichier;
        fondSonore.load();

        // 4. ÉCOUTEUR D'ÉVÉNEMENT : Permettre le changement manuel par l'utilisateur
        selectAudio.addEventListener('change', (event) => {
            const nouvellePisteFichier = event.target.value;
            const pisteTrouvee = pistesAudio.find(p => p.fichier === nouvellePisteFichier);
            if (pisteTrouvee) {
                chargerEtJouerMusique(pisteTrouvee);
            }
        });

        // 5. NOUVEAU - ENCHAÎNEMENT EN MODE ALÉATOIRE CONTINU
        fondSonore.addEventListener('ended', () => {
            let nouvel IndexAleatoire;
            
            // Boucle pour éviter de rejouer exactement le même morceau si le hasard retombe dessus
            do {
                nouvelIndexAleatoire = Math.floor(Math.random() * pistesAudio.length);
            } while (pistesAudio[nouvelIndexAleatoire].fichier === selectAudio.value && pistesAudio.length > 1);

            const prochainePisteAleatoire = pistesAudio[nouvelIndexAleatoire];
            
            // Lance la nouvelle musique et met à jour l'affichage du menu déroulant
            chargerEtJouerMusique(prochainePisteAleatoire);
        });
    }
});