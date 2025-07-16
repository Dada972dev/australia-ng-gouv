document.getElementById('recruitment-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const webhookURL = 'https://discord.com/api/webhooks/1338567574098804757/X3arz2xgJZg19D7UNDTuFG2bNXrumrb77vNbSnQrOR8DkM3ue49teaoeq3nPfOZqr121'; // Remplacez par votre URL de webhook Discord

    const formData = new FormData(event.target);

    const payload = {
        content: `
📌 **Pseudo in-game** : ${formData.get('pseudo')}
📌 **Identifiant Discord** : ${formData.get('discord')}
📌 **Âge** : ${formData.get('age')} ans
⏳ **Temps de jeu interserveur** : ${formData.get('playtime')}
🗺️ **Serveur où tu joues** : ${formData.get('server')}
📌 **Plateforme principale** : ${formData.get('platform')}

🎯 **Ce qui t'intéresse au TheTimes** : ${formData.get('interests')}
🛠️ **Tes compétences particulières** : ${formData.get('skills')}
🎤 **Bon micro** : ${formData.get('micro')}
📰 **Expérience dans un journal** : ${formData.get('experience')}
✨ **Qualités / Défauts** : ${formData.get('qualities')}
📆 **Disponibilités** : ${formData.get('availability')}

🔥 **Motivations** : ${formData.get('motivations')}
        `
    };

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Votre candidature a été envoyée avec succès !');
            event.target.reset();
        } else {
            alert('Une erreur est survenue lors de l\'envoi de votre candidature.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi du webhook :', error);
        alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    }
});