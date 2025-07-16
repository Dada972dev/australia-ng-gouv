const articles = {
  video: {
    base: 6000,
    options: {
      "Voix off": 2000,
      "Musique": 500,
      "RTX": 1000,
      "Images": 1000,
      "Vous pouvez parler": 1000,
      "4k": 1000,
      "Publication sur Youtube": 2000
    },
    durations: {
      "30 sec": 1,
      "1 min": 2,
      "2 min": 2.5
    },
    name: "Vidéo"
  },
  short: {
    base: 4000,
    options: {
      "Voix off": 1000,
      "Musique": 250,
      "RTX": 1000,
      "Images": 750,
      "Vous pouvez parler": 750,
      "4k": 1000,
      "Publication": 1000
    },
    durations: {
      "30 sec": 1,
      "1 min": 2
    },
    name: "Short"
  },
  image: {
    base: 4000,
    options: {
      "RTX": 500,
      "Format personnalisé": 250,
      "Image de fond personnalisé": 1000,
      "Intégration 3D": 2000,
      "4k": 1000,
      "Publication (Insta)": 1000
    },
    durations: {
      "Pack de 1": 1,
      "Pack de 2": 1.5,
      "Pack de 3": 2
    },
    name: "Image"
  }
};

let currentArticleKey = null;
let currentOptions = {};
let currentDuration = null;
let projectDescription = "";
let cart = [];

function selectArticle(key) {
  currentArticleKey = key;
  currentOptions = {};
  currentDuration = null;
  projectDescription = "";
  document.getElementById("modalTitle").textContent = "Options pour " + articles[key].name;
  document.getElementById("projectDesc").value = "";
  loadOptionsForm(key);
  loadDurations(key);
  goTo("page-options");
}

function loadOptionsForm(key) {
  const form = document.getElementById("optionsForm");
  form.innerHTML = "";
  const opts = articles[key].options;
  for (const option in opts) {
    const price = opts[option];
    const id = "opt_" + option.replace(/\s+/g, "_");
    const label = document.createElement("label");
    label.htmlFor = id;
    label.innerHTML = `<input type="checkbox" id="${id}" name="option" value="${option}" /> ${option} (+${price} $)`;
    form.appendChild(label);
  }
}

function loadDurations(key) {
  const select = document.getElementById("durationSelect");
  select.innerHTML = "";
  const durations = articles[key].durations;
  for (const dur in durations) {
    const price = durations[dur];
    const option = document.createElement("option");
    option.value = dur;
    option.textContent = dur + " - " + price + " $";
    select.appendChild(option);
  }
  // Set default
  if (select.options.length > 0) select.selectedIndex = 0;
}

function addToCart() {
  const optsChecked = Array.from(document.querySelectorAll('#optionsForm input[type="checkbox"]:checked'))
    .map(el => el.value);

  currentOptions = optsChecked;
  currentDuration = document.getElementById("durationSelect").value;
  projectDescription = document.getElementById("projectDesc").value.trim();

  if (!currentDuration) {
    alert("Veuillez sélectionner une durée/pack.");
    return;
  }

  if (!projectDescription) {
    alert("Merci de fournir une description du projet.");
    return;
  }

  // Calcul prix corrigé avec multiplicateur
  const article = articles[currentArticleKey];
  let basePrice = article.base;
  for (const opt of currentOptions) {
    basePrice += article.options[opt];
  }
  const multiplier = article.durations[currentDuration];
  const price = basePrice * multiplier;

  const item = {
    type: currentArticleKey,
    name: article.name,
    options: currentOptions,
    duration: currentDuration,
    description: projectDescription,
    price: price
  };

  cart.push(item);

  alert("Article ajouté au panier !");
  goTo("page-panier");
  updateCartUI();
}

function updateCartUI() {
  const list = document.getElementById("cartList");
  list.innerHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.name}</strong><br>
                    Durée: ${item.duration}<br>
                    Options: ${item.options.length ? item.options.join(", ") : "Aucune"}<br>
                    Description: ${item.description}<br>
                    Prix: ${item.price} $`;
    list.appendChild(li);
    total += item.price;
  });
  document.getElementById("totalPrice").textContent = total;
}

function goTo(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById(pageId);
  page.classList.add("active");

  // Cacher confirmation message si on revient au final
  if (pageId === "page-final") {
    document.getElementById("confirmationMessage").style.display = "none";
  }
  // Cacher devis page au besoin
  if (pageId !== "quotePage") {
    document.getElementById("quotePage").style.display = "none";
  }
}

async function handleFinal() {
  // Récupération des infos
  const pseudo = document.getElementById("pseudo").value.trim();
  const server = document.getElementById("server").value.trim();
  const country = document.getElementById("country").value.trim();
  const discord = document.getElementById("discord").value.trim();
  const typeDoc = document.querySelector('input[name="typeDoc"]:checked').value;

  if (!pseudo || !server || !country || !discord) {
    alert("Merci de remplir tous les champs.");
    return;
  }

  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  if (typeDoc === "facture") {
    // Envoi webhook Discord
    const webhookUrl = "https://discord.com/api/webhooks/1394018555174981734/kCM6RIq3pg5xA-VTadwUW6o9_vjCZcmKyf2EOceueG1NQ9N76wqKA5FRMhhr9SpaC_um";

    // Construction de l'embed
    const totalPrice = cart.reduce((acc, cur) => acc + cur.price, 0);

    const fields = cart.map((item, idx) => ({
      name: `${idx+1}. ${item.name} (${item.duration})`,
      value:
        `Description: ${item.description}\n` +
        `Options: ${item.options.length ? item.options.join(", ") : "Aucune"}\n` +
        `Prix: ${item.price} $`
    }));

    const embed = {
      title: "Nouvelle Commande",
      color: 5814783,
      fields: fields,
      footer: {
        text: `Total: ${totalPrice} $`
      },
      timestamp: new Date().toISOString(),
      author: {
        name: pseudo
      }
    };

    const content = {
      content: `Commande par **${pseudo}**\nServeur: ${server}\nPays: ${country}\nDiscord: ${discord}`,
      embeds: [embed]
    };

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(content)
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi au webhook.");

      // Confirmation
      document.getElementById("confirmationMessage").textContent =
        `Merci pour votre commande, ${pseudo} ! Nous vous prions d'ouvrir un ticket , si ce n'est pas deja fait.`;
      document.getElementById("confirmationMessage").style.display = "block";

      // Vider panier & formulaire
      cart = [];
      updateCartUI();
      document.getElementById("finalForm").reset();

    } catch (error) {
      alert("Erreur lors de l'envoi de la commande : " + error.message);
    }
  } else if (typeDoc === "devis") {
    // Affichage du devis dans la page HTML

    const totalPrice = cart.reduce((acc, cur) => acc + cur.price, 0);

    let html = `<p><strong>Pseudo InGame :</strong> ${pseudo}<br>
                <strong>Serveur :</strong> ${server}<br>
                <strong>Pays :</strong> ${country}<br>
                <strong>Discord :</strong> ${discord}</p>`;

    html += `<table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Durée/Pack</th>
                  <th>Options</th>
                  <th>Description</th>
                  <th>Prix</th>
                </tr>
              </thead>
              <tbody>`;

    cart.forEach((item, i) => {
      html += `<tr>
                <td>${i+1}</td>
                <td>${item.name}</td>
                <td>${item.duration}</td>
                <td>${item.options.length ? item.options.join(", ") : "Aucune"}</td>
                <td>${item.description}</td>
                <td>${item.price} $</td>
              </tr>`;
    });

    html += `</tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="5" style="text-align:right;">Total :</td>
                  <td>${totalPrice} $</td>
                </tr>
              </tfoot>
            </table>`;

    document.getElementById("quoteContent").innerHTML = html;
    document.getElementById("quotePage").style.display = "block";
    goTo("quotePage");
  }
}