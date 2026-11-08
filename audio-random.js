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

    if (selectAudio && audioSource && fondSonore) {
        // 2. Générer dynamiquement les options dans le menu HTML <select>
        selectAudio.innerHTML = ''; 
        pistesAudio.forEach(piste => {
            const option = document.createElement('option');
            option.value = piste.fichier;
            option.textContent = piste.nom;
            selectAudio.appendChild(option);
        });

        // 3. Sélectionner une piste au hasard au chargement de la page
        const indexAleatoire = Math.floor(Math.random() * pistesAudio.length);
        const pisteChoisie = pistesAudio[indexAleatoire];

        // Appliquer la musique aléatoire de départ
        selectAudio.value = pisteChoisie.fichier;
        audioSource.src = pisteChoisie.fichier;
        fondSonore.load();

        // 4. ÉCOUTEUR D'ÉVÉNEMENT : Permettre la sélection manuelle
        selectAudio.addEventListener('change', (event) => {
            const nouvellePiste = event.target.value;
            audioSource.src = nouvellePiste;
            fondSonore.load(); // Recharge le lecteur avec le nouveau morceau
            
            // Optionnel : Lance la musique automatiquement après le changement manuel
            fondSonore.play().catch(error => {
                console.log("Lecture automatique bloquée par le navigateur tant que l'utilisateur n'a pas interagi avec la page.");
            });
        });
    }
});
