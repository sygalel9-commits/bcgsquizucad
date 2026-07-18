const appEl = document.getElementById('app');
let semestreActuel = "1er Semestre";
let utilisateurConnecte = null;
let questionsJouees = 0;
const MAX_QUESTIONS_GRATUITES = 5;

const icones = {
  "Geodynamique interne": "🌍",
  "Biologie animale": "🧫",
  "Genetique": "🧬",
  "Biologie Moleculaire": "⚗️",
  "Geodynamique externe": "🌋",
  "Biologie vegetale": "🌿",
  "Paleontologie": "🦴",
  "Informatique": "💻"
};

const couleurs = {
  "Geodynamique interne": "#5FA88F",
  "Biologie animale": "#D4A574",
  "Genetique": "#E0654F",
  "Biologie Moleculaire": "#5FA88F",
  "Geodynamique externe": "#D4A574",
  "Biologie vegetale": "#5FA88F",
  "Paleontologie": "#E0654F",
  "Informatique": "#D4A574"
};

let nomMatiereActuelle = "";
let nomChapitreActuel = "";

function normalizeBool(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 1;
  if (typeof v === 'string') return v === '1' || v.toLowerCase() === 'true';
  return false;
}

// ========== VERIFIER TOKEN AU DEMARRAGE ==========
function init() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      utilisateurConnecte = {
        token,
        nom: payload.nom,
        id: payload.id,
        aPaye: normalizeBool(payload.aPaye)
      };
      questionsJouees = parseInt(localStorage.getItem('questionsJouees') || '0');
      afficherPageAccueil();
    } catch(e) {
      localStorage.removeItem('token');
      afficherLanding();
    }
  } else {
    afficherLanding();
  }
}

// ========== PAGE LANDING (non connecte) ==========
function afficherLanding() {
  appEl.innerHTML = `
    <div style="min-height:80vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px 24px;">

      <div style="font-family:'JetBrains Mono', monospace; font-size:0.7rem; color:var(--sauge); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:20px;">
        UCAD · Licence BCGS
      </div>

      <h1 style="font-family:'Fraunces', serif; font-size:clamp(2.4rem, 6vw, 4rem); font-weight:700; line-height:1.05; max-width:680px; margin-bottom:20px;">
        Révise mieux,<br><em style="color:var(--ocre);">réussis plus.</em>
      </h1>

      <p style="color:rgba(242,237,228,0.6); font-size:1.05rem; max-width:480px; line-height:1.7; margin-bottom:48px;">
        Des quiz intelligents pour chaque chapitre de ta Licence BCGS à l'UCAD. 
        Teste tes connaissances, reçois des explications détaillées et suis ta progression.
      </p>

      <div style="display:flex; gap:14px; flex-wrap:wrap; justify-content:center; margin-bottom:64px;">
        <button class="btn-ocre" onclick="afficherInscription()" style="padding:16px 36px; font-size:1rem;">
          Créer un compte gratuit
        </button>
        <button class="btn-contour" onclick="afficherConnexion()" style="padding:16px 36px; font-size:1rem;">
          Se connecter
        </button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:16px; max-width:700px; width:100%;">
        <div style="background:var(--fond-carte); border:1px solid var(--ligne); border-radius:4px; padding:20px; text-align:left;">
          <div style="font-size:1.6rem; margin-bottom:10px;">🎯</div>
          <div style="font-family:'Fraunces', serif; font-size:1rem; font-weight:600; margin-bottom:6px;">Quiz par chapitre</div>
          <div style="font-size:0.82rem; color:rgba(242,237,228,0.5);">Chaque chapitre a son propre quiz ciblé</div>
        </div>
        <div style="background:var(--fond-carte); border:1px solid var(--ligne); border-radius:4px; padding:20px; text-align:left;">
          <div style="font-size:1.6rem; margin-bottom:10px;">💡</div>
          <div style="font-family:'Fraunces', serif; font-size:1rem; font-weight:600; margin-bottom:6px;">Explications détaillées</div>
          <div style="font-size:0.82rem; color:rgba(242,237,228,0.5);">Comprends pourquoi tu as bon ou faux</div>
        </div>
        <div style="background:var(--fond-carte); border:1px solid var(--ligne); border-radius:4px; padding:20px; text-align:left;">
          <div style="font-size:1.6rem; margin-bottom:10px;">📊</div>
          <div style="font-family:'Fraunces', serif; font-size:1rem; font-weight:600; margin-bottom:6px;">Suivi de progression</div>
          <div style="font-size:0.82rem; color:rgba(242,237,228,0.5);">Vois tes notes et mentions par matière</div>
        </div>
      </div>

      <div style="margin-top:48px; font-family:'JetBrains Mono', monospace; font-size:0.72rem; color:rgba(242,237,228,0.3);">
        5 questions gratuites · Abonnement 500 FCFA/mois · PDF à 200 FCFA
      </div>

    </div>
  `;
}

// ========== PAGE INSCRIPTION ==========
function afficherInscription() {
  appEl.innerHTML = `
    <div style="min-height:80vh; display:flex; align-items:center; justify-content:center; padding:40px 24px;">
      <div style="background:var(--fond-carte); border:1px solid var(--ligne); border-radius:4px; padding:40px; width:100%; max-width:420px;">

        <div class="lien-retour" onclick="afficherLanding()" style="margin-bottom:24px;">← Retour</div>

        <div style="font-family:'Fraunces', serif; font-size:1.8rem; font-weight:700; margin-bottom:6px;">Créer un compte</div>
        <div style="color:rgba(242,237,228,0.5); font-size:0.88rem; margin-bottom:32px;">5 questions gratuites pour commencer</div>

        <div id="erreur-inscription" style="display:none; background:rgba(224,101,79,0.15); border:1px solid var(--terracotta); border-radius:4px; padding:12px; margin-bottom:20px; font-size:0.88rem; color:var(--terracotta);"></div>

        <div style="margin-bottom:18px;">
          <label style="font-family:'JetBrains Mono', monospace; font-size:0.68rem; color:var(--sauge); text-transform:uppercase; letter-spacing:0.06em; display:block; margin-bottom:8px;">Nom complet</label>
          <input id="nom-inscription" type="text" placeholder="Ex: Aminata Diallo" style="width:100%; background:var(--fond); border:1px solid var(--ligne); border-radius:4px; padding:14px 16px; color:var(--papier); font-family:'Inter', sans-serif; font-size:0.95rem; outline:none;">
        </div>

        <div style="margin-bottom:18px;">
          <label style="font-family:'JetBrains Mono', monospace; font-size:0.68rem; color:var(--sauge); text-transform:uppercase; letter-spacing:0.06em; display:block; margin-bottom:8px;">Email</label>
          <input id="email-inscription" type="email" placeholder="ton@email.com" style="width:100%; background:var(--fond); border:1px solid var(--ligne); border-radius:4px; padding:14px 16px; color:var(--papier); font-family:'Inter', sans-serif; font-size:0.95rem; outline:none;">
        </div>

        <div style="margin-bottom:28px;">
          <label style="font-family:'JetBrains Mono', monospace; font-size:0.68rem; color:var(--sauge); text-transform:uppercase; letter-spacing:0.06em; display:block; margin-bottom:8px;">Mot de passe</label>
          <input id="mdp-inscription" type="password" placeholder="Minimum 6 caractères" style="width:100%; background:var(--fond); border:1px solid var(--ligne); border-radius:4px; padding:14px 16px; color:var(--papier); font-family:'Inter', sans-serif; font-size:0.95rem; outline:none;">
        </div>

        <button class="btn-ocre" onclick="inscrire()" style="width:100%; padding:16px; font-size:1rem;">
          Créer mon compte →
        </button>

        <div style="text-align:center; margin-top:20px; font-size:0.85rem; color:rgba(242,237,228,0.5);">
          Déjà un compte ? <span onclick="afficherConnexion()" style="color:var(--ocre); cursor:pointer;">Se connecter</span>
        </div>

      </div>
    </div>
  `;
}

// ========== PAGE CONNEXION ==========
function afficherConnexion() {
  appEl.innerHTML = `
    <div style="min-height:80vh; display:flex; align-items:center; justify-content:center; padding:40px 24px;">
      <div style="background:var(--fond-carte); border:1px solid var(--ligne); border-radius:4px; padding:40px; width:100%; max-width:420px;">

        <div class="lien-retour" onclick="afficherLanding()" style="margin-bottom:24px;">← Retour</div>

        <div style="font-family:'Fraunces', serif; font-size:1.8rem; font-weight:700; margin-bottom:6px;">Connexion</div>
        <div style="color:rgba(242,237,228,0.5); font-size:0.88rem; margin-bottom:32px;">Bon retour parmi nous 👋</div>

        <div id="erreur-connexion" style="display:none; background:rgba(224,101,79,0.15); border:1px solid var(--terracotta); border-radius:4px; padding:12px; margin-bottom:20px; font-size:0.88rem; color:var(--terracotta);"></div>

        <div style="margin-bottom:18px;">
          <label style="font-family:'JetBrains Mono', monospace; font-size:0.68rem; color:var(--sauge); text-transform:uppercase; letter-spacing:0.06em; display:block; margin-bottom:8px;">Email</label>
          <input id="email-connexion" type="email" placeholder="ton@email.com" style="width:100%; background:var(--fond); border:1px solid var(--ligne); border-radius:4px; padding:14px 16px; color:var(--papier); font-family:'Inter', sans-serif; font-size:0.95rem; outline:none;">
        </div>

        <div style="margin-bottom:28px;">
          <label style="font-family:'JetBrains Mono', monospace; font-size:0.68rem; color:var(--sauge); text-transform:uppercase; letter-spacing:0.06em; display:block; margin-bottom:8px;">Mot de passe</label>
          <input id="mdp-connexion" type="password" placeholder="Ton mot de passe" style="width:100%; background:var(--fond); border:1px solid var(--ligne); border-radius:4px; padding:14px 16px; color:var(--papier); font-family:'Inter', sans-serif; font-size:0.95rem; outline:none;">
        </div>

        <button class="btn-ocre" onclick="connecter()" style="width:100%; padding:16px; font-size:1rem;">
          Se connecter →
        </button>

        <div style="text-align:center; margin-top:20px; font-size:0.85rem; color:rgba(242,237,228,0.5);">
          Pas encore de compte ? <span onclick="afficherInscription()" style="color:var(--ocre); cursor:pointer;">S'inscrire</span>
        </div>

      </div>
    </div>
  `;
}

// ========== LOGIQUE INSCRIPTION ==========
async function inscrire() {
  const nom = document.getElementById('nom-inscription').value.trim();
  const email = document.getElementById('email-inscription').value.trim();
  const mdp = document.getElementById('mdp-inscription').value;
  const erreurEl = document.getElementById('erreur-inscription');

  if (!nom || !email || !mdp) {
    erreurEl.style.display = 'block';
    erreurEl.textContent = "Tous les champs sont obligatoires";
    return;
  }
  if (mdp.length < 6) {
    erreurEl.style.display = 'block';
    erreurEl.textContent = "Le mot de passe doit faire au moins 6 caractères";
    return;
  }

  try {
    const reponse = await fetch('/api/inscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, email, motDePasse: mdp })
    });
    const data = await reponse.json();

    if (!reponse.ok) {
      erreurEl.style.display = 'block';
      erreurEl.textContent = data.erreur;
      return;
    }

    // Connexion automatique apres inscription
    await connecterAvec(email, mdp);

  } catch(e) {
    erreurEl.style.display = 'block';
    erreurEl.textContent = "Erreur de connexion au serveur";
  }
}

// ========== LOGIQUE CONNEXION ==========
async function connecter() {
  const email = document.getElementById('email-connexion').value.trim();
  const mdp = document.getElementById('mdp-connexion').value;
  const erreurEl = document.getElementById('erreur-connexion');

  if (!email || !mdp) {
    erreurEl.style.display = 'block';
    erreurEl.textContent = "Tous les champs sont obligatoires";
    return;
  }

  try {
    await connecterAvec(email, mdp, erreurEl);
  } catch(e) {
    erreurEl.style.display = 'block';
    erreurEl.textContent = "Erreur de connexion au serveur";
  }
}

async function connecterAvec(email, mdp, erreurEl) {
  const reponse = await fetch('/api/connexion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, motDePasse: mdp })
  });
  const data = await reponse.json();

  if (!reponse.ok) {
    if (erreurEl) {
      erreurEl.style.display = 'block';
      erreurEl.textContent = data.erreur;
    }
    return;
  }

  localStorage.setItem('token', data.token);
  localStorage.setItem('questionsJouees', '0');
  utilisateurConnecte = {
    token: data.token,
    nom: data.nom,
    aPaye: normalizeBool(data.aPaye)
  };
  questionsJouees = 0;

  afficherPageAccueil();
}

// ========== DECONNEXION ==========
function deconnecter() {
  localStorage.removeItem('token');
  localStorage.removeItem('questionsJouees');
  utilisateurConnecte = null;
  questionsJouees = 0;
  afficherLanding();
}

// ========== HEADER avec utilisateur connecte ==========
function genererHeader() {
  return `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; padding-bottom:20px; border-bottom:1px solid var(--ligne);">
      <div>
        <div style="font-family:'Fraunces', serif; font-size:1rem; font-weight:600;">
          Bonjour, <span style="color:var(--ocre);">${utilisateurConnecte.nom}</span> 👋
        </div>
        <div style="font-family:'JetBrains Mono', monospace; font-size:0.65rem; color:${utilisateurConnecte.aPaye ? 'var(--sauge)' : 'rgba(242,237,228,0.4)'}; margin-top:4px;">
          ${utilisateurConnecte.aPaye ? '✓ Abonné · Accès illimité' : `${MAX_QUESTIONS_GRATUITES - questionsJouees} questions gratuites restantes`}
        </div>
      </div>
      <button onclick="deconnecter()" style="font-family:'JetBrains Mono', monospace; font-size:0.68rem; background:transparent; border:1px solid var(--ligne); color:rgba(242,237,228,0.5); padding:8px 14px; border-radius:4px; cursor:pointer; text-transform:uppercase; letter-spacing:0.04em;">
        Déconnexion
      </button>
    </div>
  `;
}

// ========== PAGE ACCUEIL (connecte) ==========
async function afficherPageAccueil(semestre) {
  if (semestre) semestreActuel = semestre;
  appEl.innerHTML = "<p>Chargement...</p>";

  const reponse = await fetch('/api/matieres/' + encodeURIComponent(semestreActuel));
  const matieres = await reponse.json();
  window.matieresActuelles = matieres;

  let html = genererHeader();

  html += `
    <h1 class="hero-titre">Révise tes cours comme <em>un vrai cahier de labo.</em></h1>
    <p class="hero-sous">Choisis une matière et teste-toi chapitre par chapitre.</p>

    <div class="semestres-toggle" style="margin-bottom:40px;">
      <button class="${semestreActuel === '1er Semestre' ? 'actif' : ''}" onclick="afficherPageAccueil('1er Semestre')">1er Semestre</button>
      <button class="${semestreActuel === '2nd Semestre' ? 'actif' : ''}" onclick="afficherPageAccueil('2nd Semestre')">2nd Semestre</button>
    </div>
  `;

  if (!utilisateurConnecte.aPaye && questionsJouees >= MAX_QUESTIONS_GRATUITES) {
    html += `
      <div style="background:rgba(212,165,116,0.1); border:1px solid var(--ocre); border-radius:4px; padding:24px 28px; margin-bottom:40px; display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap;">
        <div>
          <div style="font-family:'Fraunces', serif; font-size:1.1rem; font-weight:600; margin-bottom:6px;">Tu as utilisé tes 5 questions gratuites</div>
          <div style="color:rgba(242,237,228,0.6); font-size:0.88rem;">Abonne-toi pour 500 FCFA/mois et accède à tous les quiz sans limite.</div>
        </div>
        <button class="btn-ocre" onclick="afficherPaiement()">S'abonner · Payer 500 FCFA via Wave →</button>
      </div>
    `;
  }

  html += `<div class="grille">`;

  matieres.forEach((matiere, index) => {
    const icone = icones[matiere.nom] || "📚";
    const couleur = couleurs[matiere.nom] || "#5FA88F";
    const nbChapitres = matiere.sousMatieres.length;
    const bloque = !utilisateurConnecte.aPaye && questionsJouees >= MAX_QUESTIONS_GRATUITES;

    html += `
      <div class="carte-matiere" style="--accent:${couleur}; ${bloque ? 'opacity:0.5;' : ''}" onclick="${bloque ? 'afficherPaiement()' : `selectionnerMatiere(${index})`}">
        <span class="badge-coin">${nbChapitres} ch.</span>
        <span class="carte-icone">${bloque ? '🔒' : icone}</span>
        <div class="carte-nom">${matiere.nom}</div>
        <div class="carte-meta">${nbChapitres} chapitres</div>
      </div>
    `;
  });

  html += `</div>`;
  appEl.innerHTML = html;
}

// ========== PAGE PAIEMENT WAVE ==========
function afficherPaiement() {
  appEl.innerHTML = `
    <div style="min-height:70vh; display:flex; align-items:center; justify-content:center; padding:40px 24px;">
      <div style="background:var(--fond-carte); border:1px solid var(--ligne); border-radius:4px; padding:40px; width:100%; max-width:460px; text-align:center;">

        <div class="lien-retour" onclick="afficherPageAccueil()" style="text-align:left; margin-bottom:24px;">← Retour</div>

        <div style="font-size:2.5rem; margin-bottom:16px;">📱</div>
        <div style="font-family:'Fraunces', serif; font-size:1.6rem; font-weight:700; margin-bottom:8px;">S'abonner au quiz</div>
        <div style="color:rgba(242,237,228,0.5); font-size:0.88rem; margin-bottom:32px;">Accès illimité à tous les quiz pendant 1 mois</div>

        <div style="background:var(--fond); border:1px solid var(--ligne); border-radius:4px; padding:20px; margin-bottom:28px;">
          <div style="font-family:'JetBrains Mono', monospace; font-size:2.2rem; font-weight:700; color:var(--ocre);">500 FCFA</div>
          <div style="font-size:0.82rem; color:rgba(242,237,228,0.4); margin-top:4px;">par mois · Sans engagement</div>
        </div>

        <div style="text-align:left; margin-bottom:28px;">
          <div style="font-size:0.88rem; color:rgba(242,237,228,0.7); margin-bottom:10px;">✓ Quiz illimités sur toutes les matières</div>
          <div style="font-size:0.88rem; color:rgba(242,237,228,0.7); margin-bottom:10px;">✓ Explications détaillées à chaque question</div>
          <div style="font-size:0.88rem; color:rgba(242,237,228,0.7); margin-bottom:10px;">✓ Suivi de tes scores et progressions</div>
          <div style="font-size:0.88rem; color:rgba(242,237,228,0.4);">✗ Téléchargement PDF (200 FCFA/PDF)</div>
        </div>

        <button class="btn-ocre" style="width:100%; padding:16px; font-size:1rem;">
          S'abonner · Payer 500 FCFA via Wave →
        </button>

        <div style="font-size:0.85rem; color:rgba(242,237,228,0.45); margin-top:12px;">Après paiement, ton compte sera débloqué automatiquement.</div>

        <div style="margin-top:16px; font-size:0.78rem; color:rgba(242,237,228,0.3);">
          Paiement sécurisé via Wave Money
        </div>

      </div>
    </div>
  `;
}

function selectionnerMatiere(index) {
  const matiere = window.matieresActuelles[index];
  afficherMatiere(matiere.nom);
}

// ========== PAGE MATIERE ==========
async function afficherMatiere(nomMatiere) {
  nomMatiereActuelle = nomMatiere;
  appEl.innerHTML = "<p>Chargement...</p>";

  const reponse = await fetch('/api/sousmatieres/' + encodeURIComponent(semestreActuel) + '/' + encodeURIComponent(nomMatiere));
  const chapitres = await reponse.json();
  window.chapitresActuels = chapitres;

  const icone = icones[nomMatiere] || "📚";

  let html = genererHeader();
  html += `
    <div class="lien-retour" onclick="afficherPageAccueil(semestreActuel)">← Retour au ${semestreActuel}</div>
    <h2 class="hero-titre" style="font-size:2.2rem; margin-bottom:6px;">${icone} ${nomMatiere}</h2>
    <p class="hero-sous" style="margin-bottom:32px;">${chapitres.length} chapitres</p>

    <div class="bloc-resume">
      <div>
        <div style="font-family:'JetBrains Mono', monospace; font-size:0.68rem; color:var(--ocre); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px;">Resume du cours</div>
        <div style="font-family:'Fraunces', serif; font-size:1.2rem; font-weight:600;">Le cours complet en PDF</div>
        <div style="font-size:0.82rem; color:rgba(242,237,228,0.4); margin-top:4px;">Lecture disponible dans le site</div>
      </div>
      <button class="btn-ocre" onclick="lirePDF('${nomMatiere}')">📖 Lire le cours</button>
    </div>

    <div style="font-family:'JetBrains Mono', monospace; font-size:0.72rem; color:rgba(242,237,228,0.45); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:18px;">Chapitres</div>

    <div class="grille">
  `;

  chapitres.forEach((chap, index) => {
    const nbQuestions = chap.quiz.length;
    const statut = nbQuestions > 0 ? nbQuestions + " questions" : "A venir";
    const bloque = !utilisateurConnecte.aPaye && questionsJouees >= MAX_QUESTIONS_GRATUITES;

    html += `
      <div class="carte-matiere" style="--accent:#5FA88F; ${bloque ? 'opacity:0.5;' : ''}" onclick="${bloque ? 'afficherPaiement()' : `selectionnerChapitre(${index})`}">
        <div class="carte-nom" style="font-size:1.02rem;">${bloque ? '🔒 ' : ''}${chap.nom}</div>
        <div class="carte-meta">${statut}</div>
      </div>
    `;
  });

  html += `</div>`;
  appEl.innerHTML = html;
}

function selectionnerChapitre(index) {
  const chapitre = window.chapitresActuels[index];
  nomChapitreActuel = chapitre.nom;
  afficherQuiz(nomMatiereActuelle, chapitre.nom);
}

// ========== PAGE QUIZ ==========
let quizActuel = [];
let indexQuestionActuelle = 0;
let reponsesUtilisateur = [];

async function afficherQuiz(nomMatiere, nomChapitre) {
  appEl.innerHTML = "<p>Chargement...</p>";

  const reponse = await fetch('/api/sousmatieres/' + encodeURIComponent(semestreActuel) + '/' + encodeURIComponent(nomMatiere));
  const chapitres = await reponse.json();
  const chapitre = chapitres.find(c => c.nom === nomChapitre);

  quizActuel = chapitre.quiz;
  indexQuestionActuelle = 0;
  reponsesUtilisateur = [];

  if (quizActuel.length === 0) {
    appEl.innerHTML = `
      ${genererHeader()}
      <div class="lien-retour" onclick="afficherMatiere(nomMatiereActuelle)">← Retour</div>
      <p class="hero-sous" style="margin-top:20px;">Aucune question disponible pour ce chapitre pour le moment.</p>
    `;
    return;
  }

  afficherQuestion();
}

function afficherQuestion() {
  // Verifier limite gratuite
  if (!utilisateurConnecte.aPaye && questionsJouees >= MAX_QUESTIONS_GRATUITES) {
    afficherPaiement();
    return;
  }

  const question = quizActuel[indexQuestionActuelle];
  const total = quizActuel.length;
  const pourcentage = (indexQuestionActuelle / total) * 100;
  const lettres = ['A', 'B', 'C', 'D', 'E', 'F'];

  const optionsMelangees = [...question.options]
    .map(option => ({ option }))
    .sort(() => Math.random() - 0.5);

  window.optionsMelangeesActuelles = optionsMelangees;

  let html = `
    ${genererHeader()}
    <div class="lien-retour" onclick="afficherMatiere(nomMatiereActuelle)">← ${nomChapitreActuel}</div>

    <div class="barre-progres-quiz">
      <div class="compteur">Q${indexQuestionActuelle + 1} / ${String(total).padStart(2, '0')}</div>
      <div class="piste"><div class="remplissage" style="width:${pourcentage}%"></div></div>
    </div>

    <h2 class="question-titre">${question.question}</h2>

    <div class="liste-options" id="options">
  `;

  optionsMelangees.forEach((item, i) => {
    html += `
      <div class="option" onclick="choisirReponse(${i})">
        <span class="lettre">${lettres[i]}</span>
        <span>${item.option}</span>
      </div>
    `;
  });

  html += `</div><div id="zone-explication"></div>`;
  appEl.innerHTML = html;
}

function choisirReponse(indexChoisi) {
  const question = quizActuel[indexQuestionActuelle];
  const optionChoisie = window.optionsMelangeesActuelles[indexChoisi].option;
  const estCorrecte = optionChoisie === question.answer;

  // Incrementer compteur de questions jouees
  if (!utilisateurConnecte.aPaye) {
    questionsJouees++;
    localStorage.setItem('questionsJouees', questionsJouees.toString());
  }

  reponsesUtilisateur.push(optionChoisie);

  const options = document.querySelectorAll('.option');
  options.forEach((opt, i) => {
    opt.onclick = null;
    const texte = window.optionsMelangeesActuelles[i].option;
    if (texte === question.answer) {
      opt.classList.add('correcte');
    } else if (i === indexChoisi) {
      opt.classList.add('incorrecte');
    }
  });

  const zoneExplication = document.getElementById('zone-explication');
  zoneExplication.innerHTML = `
    <div class="bloc-explication">
      <div class="etiquette">${estCorrecte ? '✓ Bonne reponse' : '✗ A revoir'}</div>
      <p>${question.explanation}</p>
    </div>
    <button class="btn-ocre" onclick="questionSuivante()">
      ${indexQuestionActuelle + 1 < quizActuel.length ? 'Question suivante →' : 'Voir mon resultat →'}
    </button>
  `;
}

function questionSuivante() {
  indexQuestionActuelle++;
  if (indexQuestionActuelle < quizActuel.length) {
    afficherQuestion();
  } else {
    afficherResultat();
  }
}

async function afficherResultat() {
  const reponse = await fetch('/api/corriger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reponsesUtilisateur, quiz: quizActuel })
  });
  const resultat = await reponse.json();

  // Sauvegarder le score
  await fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: utilisateurConnecte.token,
      semestre: semestreActuel,
      matiere: nomMatiereActuelle,
      chapitre: nomChapitreActuel,
      note: resultat.note,
      mention: resultat.mention
    })
  });

  appEl.innerHTML = `
    ${genererHeader()}
    <div class="ecran-resultat">
      <div style="font-family:'JetBrains Mono', monospace; font-size:0.7rem; color:var(--ocre); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:18px;">
        ${resultat.celebration ? '✨ Excellent travail ✨' : 'Quiz termine'}
      </div>
      <div class="note">${resultat.note}<span>/20</span></div>
      <div class="mention">${resultat.mention}</div>
      <p style="font-family:'JetBrains Mono', monospace; font-size:0.85rem; color:rgba(242,237,228,0.55); margin-bottom:40px;">
        ${resultat.bonnesReponses} / ${resultat.totalQuestions} bonnes reponses
      </p>
      <button class="btn-ocre" onclick="afficherMatiere(nomMatiereActuelle)" style="margin-right:12px;">Retour aux chapitres →</button>
      <button class="btn-contour" onclick="afficherQuiz(nomMatiereActuelle, nomChapitreActuel)">Refaire le quiz</button>
    </div>
  `;
}


function lirePDF(nomMatiere) {
  appEl.innerHTML = `
    ${genererHeader()}
    <div class="lien-retour" onclick="afficherMatiere('${nomMatiere}')">← Retour</div>
    <h2 style="font-family:'Fraunces', serif; font-size:1.6rem; font-weight:700; margin:20px 0 24px;">
      📖 ${nomMatiere}
    </h2>
    <div style="background:var(--fond-carte); border:1px solid var(--ligne); border-radius:4px; padding:40px; text-align:center; color:rgba(242,237,228,0.5);">
      <div style="font-size:2rem; margin-bottom:16px;">📄</div>
      <div style="font-family:'Fraunces', serif; font-size:1.1rem; margin-bottom:8px;">PDF bientôt disponible</div>
      <div style="font-size:0.85rem;">Le cours de ${nomMatiere} sera ajouté prochainement.</div>
    </div>
  `;
}

// ========== DEMARRAGE ==========
init();