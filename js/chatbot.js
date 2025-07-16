  const chatbox = document.getElementById("chatbox");
  const chatBody = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");

  let pseudo = "Invité";
  const avatarUser = "https://ui-avatars.com/api/?name=Invite&background=007bff&color=fff";
  const avatarBot = "https://cdn-icons-png.flaticon.com/512/4712/4712027.png";
  let messages = [];

  const keywords = {
    "bonjour": "Bonjour ! Comment puis-je vous aider ? 👋",
    "Australie": "Tu est ici sur le site web de l'australie du serveur sigma , tu peux voir notre ministère , constitution ou encore notre histoire rp.",
    "pays": "Si tu souhaite rejoindre le pays , tu peux te rendre sur notre discord. ",
    "rejoindre": "Si tu souhaite rejoindre le pays , tu peux te rendre sur notre discord. ",
    "SIGMA": "Le sigma et notre serveur de jeu. ",
    "ministre": "Nos ministres sont disponible sur la page ministère ",
    "bjr": "Bonjour ! Comment puis-je vous aider ? 👋",
    "salut!": "Bonjour ! Comment puis-je vous aider ? 👋",
    "yo": "Bonjour ! Comment puis-je vous aider ? 👋",
    "histoire": "Notre histoire rp et disponible sur le site , les chapitres sortent tous les lundi!",
  };

  function toggleChat() {
    if (chatbox.style.display === "flex") {
      sendToDiscord();
      chatbox.style.display = "none";
    } else {
      const inputName = prompt("Entrez votre pseudo :", pseudo);
      if (inputName) pseudo = inputName;
      chatbox.style.display = "flex";
      if (!chatBody.innerHTML) autoBotMessage("Bienvenue sur le support Royal 👑. Tapez votre question.");
    }
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = "";
    addMessage(text, "user");

    const foundKey = Object.keys(keywords).find(k => text.toLowerCase().includes(k));
    if (foundKey) {
      autoBotMessage(keywords[foundKey]);
} else {
  autoBotMessage("Je ne comprends pas bien. Voulez-vous rejoindre notre Discord? Nous pourrons mieux vous aider?");
  setTimeout(() => {
    const btn = document.createElement("button");
    btn.innerText = "Rejoindre Discord";
    btn.classList.add("discord-button"); // ✅ Appliquer la classe CSS ici

    btn.onclick = () => window.open("https://discord.com/invite/W77mUvSV5E", "_blank");

    const div = createBubble("", avatarBot, "bot");
    div.appendChild(btn);
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);
}
  }

  function autoBotMessage(text) {
    const bubble = createBubble(text, avatarBot, "bot");
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
    messages.push({from: "bot", text});
  }

  function addMessage(text, sender) {
    const bubble = createBubble(`${sender === "user" ? pseudo + ': ' : ''}${text}`, sender === "user" ? avatarUser : avatarBot, sender);
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
    messages.push({from: sender, text});
  }

  function createBubble(text, avatar, type) {
    const div = document.createElement("div");
    div.classList.add("bubble", type);
    div.innerHTML = `<img src="${avatar}" class="avatar"><span>${text}</span>`;
    return div;
  }

  function sendToDiscord() {
    if (messages.length === 0) return;
    const embeds = [{
      title: `Conversation avec ${pseudo}`,
      color: 3447003,
      fields: messages.map((m, i) => ({
        name: m.from === "user" ? `👤 ${pseudo}` : "🤖 Bot",
        value: m.text,
        inline: false
      })),
      footer: { text: "RoyalSupport Bot" },
      timestamp: new Date().toISOString()
    }];

    const payload = { username: "RoyalSupport", embeds };
    const webhookURL = "https://discord.com/api/webhooks/1394414095238959114/CocjA06C0Q1v2bf5X6j665Ls5HX1mMl6vVrEYva0UK4xAfSKxJW7l9V-Ml5vMnFMezq3";

    fetch(webhookURL, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }).then(() => { messages = []; }).catch(console.error);
  }

  window.addEventListener("beforeunload", sendToDiscord);
s