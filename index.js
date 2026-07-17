require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./database');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const SECRET = process.env.SECRET_JWT || "bcgs_quiz_secret_2024";
const app = express();
const port = process.env.PORT || 3000;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

// Security and logging
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const data = {
  "1er Semestre": [
    {
      nom: "Geodynamique interne",
      pdfCours: null,
      sousMatieres: [
        { nom: "Introduction a la geologie", quiz: [
  {
    type: "qcm",
    question: "La géologie est définie comme l'étude de la Terre. Parmi les propositions suivantes, laquelle correspond à l'aspect CAUSAL de la géologie ?",
    options: [
      "Décrire la disposition et la nature des roches à la surface de la Terre.",
      "Observer les phénomènes de plissement et de fracturation des roches.",
      "Rechercher les conditions de formation des minéraux et expliquer la genèse des phénomènes géologiques."
    ],
    answer: "Rechercher les conditions de formation des minéraux et expliquer la genèse des phénomènes géologiques.",
    explanation: "L'aspect causal cherche le POURQUOI des phénomènes géologiques : pourquoi telle roche s'est-elle formée ? Dans quelles conditions ? C'est le niveau d'analyse le plus profond. L'aspect descriptif répond au QUOI (nature et disposition des matériaux) et l'aspect évolutif répond au COMMENT ça change (déformation, métamorphisme, magmatisme)."
  },
  {
    type: "qcm",
    question: "Le magmatisme et le métamorphisme relèvent de la géodynamique :",
    options: [
      "Externe, car ils modifient la surface de la Terre.",
      "Interne, car ce sont des processus endogènes.",
      "Interne et externe à la fois, selon le contexte."
    ],
    answer: "Interne, car ce sont des processus endogènes.",
    explanation: "La géodynamique INTERNE regroupe tous les processus endogènes, c'est-à-dire qui prennent naissance en PROFONDEUR dans la Terre : magmatisme (plutonisme et volcanisme) et métamorphisme. La géodynamique externe, elle, regroupe les processus exogènes liés aux agents de surface (érosion, sédimentation, paléontologie)."
  },
  {
    type: "qcm",
    question: "Nicolas Sténon est considéré comme l'un des fondateurs de la géologie. Quelle discipline a-t-il principalement établie ?",
    options: [
      "La minéralogie.",
      "La stratigraphie.",
      "La géophysique."
    ],
    answer: "La stratigraphie.",
    explanation: "Le Danois Nicolas Sténon (1638-1686) a posé les bases de la STRATIGRAPHIE, en établissant notamment le principe de superposition des couches. La géologie est une science jeune dont les bases scientifiques ont été construites à partir de ses travaux."
  },
  {
    type: "qcm",
    question: "Un géologue observe un affleurement. Parmi ces exemples, lequel correspond à une observation INDIRECTE ?",
    options: [
      "Identifier une roche à l'œil nu avec une loupe.",
      "Mesurer la résistivité des terrains par carottage électrique.",
      "Prélever un échantillon de roche sur une falaise."
    ],
    answer: "Mesurer la résistivité des terrains par carottage électrique.",
    explanation: "Les observations INDIRECTES utilisent des instruments géophysiques pour sonder le sous-sol sans le voir directement. Le carottage électrique mesure la résistivité des terrains en profondeur. Les deux autres exemples (identifier à l'œil nu, prélever un échantillon) sont des observations DIRECTES réalisées sur l'affleurement."
  },
  {
    type: "qcm",
    question: "Parmi les méthodes géophysiques suivantes, laquelle est valable jusqu'à 500 m de profondeur seulement ?",
    options: [
      "La méthode sismique.",
      "La méthode gravimétrique.",
      "La méthode magnétique."
    ],
    answer: "La méthode magnétique.",
    explanation: "La méthode MAGNÉTIQUE, qui mesure le champ magnétique terrestre à l'aide d'un magnétomètre pour détecter les anomalies liées aux roches cristallines, n'est valable que jusqu'à 500 m de profondeur. La méthode SISMIQUE, elle, est valable jusqu'à 2000 m et est surtout utilisée par les géologues pétroliers."
  },
  {
    type: "qcm",
    question: "Le principe de l'uniformitarisme affirme que :",
    options: [
      "Les phénomènes géologiques anciens ne peuvent pas être comparés aux phénomènes actuels.",
      "Les mêmes causes produisent les mêmes effets aux époques anciennes comme aujourd'hui.",
      "Les phénomènes actuels sont toujours plus intenses que les phénomènes anciens."
    ],
    answer: "Les mêmes causes produisent les mêmes effets aux époques anciennes comme aujourd'hui.",
    explanation: "Le principe d'uniformitarisme (Prévost et Lyell, 1820) postule que les lois physiques et chimiques qui régissent les phénomènes géologiques sont constantes dans le temps. Cela permet au géologue d'interpréter le passé à partir de l'observation du présent. Attention : ce principe a des LIMITES — il ne peut pas expliquer des phénomènes dont on n'observe plus de correspondance actuelle, comme la transformation de roches sédimentaires en métamorphiques."
  },
  {
    type: "qcm",
    question: "Lequel de ces phénomènes NE PEUT PAS être expliqué par le principe de l'uniformitarisme ?",
    options: [
      "La vitesse de sédimentation des vases au fond de l'océan.",
      "La genèse et la mise en place des roches plutoniques en profondeur.",
      "La formation du pétrole par fermentation de boue marine."
    ],
    answer: "La genèse et la mise en place des roches plutoniques en profondeur.",
    explanation: "Le principe de l'uniformitarisme ne peut pas s'appliquer aux phénomènes dont on n'observe PAS de correspondance actuelle directement. La mise en place des roches PLUTONIQUES se fait en profondeur et ne peut être observée directement aujourd'hui. En revanche, la sédimentation et la formation du pétrole ont des analogues actuels observables."
  },
  {
    type: "qcm",
    question: "La chronologie relative est basée sur deux principes. Parmi les propositions suivantes, laquelle est CORRECTE ?",
    options: [
      "Le principe de superposition et le principe d'identité paléontologique.",
      "Le principe d'uniformitarisme et le principe de superposition.",
      "La datation radioactive et le principe de superposition."
    ],
    answer: "Le principe de superposition et le principe d'identité paléontologique.",
    explanation: "La chronologie RELATIVE utilise deux principes stratigraphiques : 1) le principe de SUPERPOSITION (une couche inférieure est plus ancienne qu'une couche supérieure) et 2) le principe d'IDENTITÉ PALÉONTOLOGIQUE (deux couches contenant les mêmes fossiles sont contemporaines). La datation radioactive appartient à la chronologie ABSOLUE, pas relative."
  },
  {
    type: "qcm",
    question: "La chronologie relative s'applique principalement aux roches :",
    options: [
      "Magmatiques et métamorphiques.",
      "Sédimentaires uniquement.",
      "Magmatiques uniquement."
    ],
    answer: "Sédimentaires uniquement.",
    explanation: "La chronologie RELATIVE, basée sur la stratigraphie et la paléontologie, s'applique essentiellement aux terrains SÉDIMENTAIRES. Elle ne fonctionne pas sur les roches magmatiques et métamorphiques car ces dernières ne contiennent pas de fossiles utilisables et ne se déposent pas en couches horizontales successives."
  },
  {
    type: "qcm",
    question: "Quelle est l'unité de durée utilisée à l'échelle géologique ?",
    options: [
      "L'année.",
      "Le siècle.",
      "Le million d'années (Ma)."
    ],
    answer: "Le million d'années (Ma).",
    explanation: "À l'échelle humaine, on raisonne en années. Mais les phénomènes géologiques sont si longs que l'unité utilisée est le MILLION D'ANNÉES (Ma). Par exemple, les dinosaures ont disparu il y a 65 Ma, et la Terre a environ 4 500 Ma."
  },
  {
    type: "qcm",
    question: "Le forage le plus profond jamais réalisé par l'homme atteint environ :",
    options: [
      "12 km, ce qui représente une infime fraction du rayon terrestre.",
      "100 km, soit environ 1/60ème du rayon terrestre.",
      "500 km, permettant d'atteindre le manteau supérieur."
    ],
    answer: "12 km, ce qui représente une infime fraction du rayon terrestre.",
    explanation: "Le forage le plus profond n'atteint que 12 km, alors que le rayon de la Terre est de 6 370 km. C'est pourquoi les méthodes INDIRECTES (géophysique) sont indispensables pour étudier la structure profonde de la Terre — on ne peut tout simplement pas y aller directement."
  },
  {
    type: "qcm",
    question: "L'affleurement est défini comme :",
    options: [
      "Un échantillon de roche prélevé sur le terrain.",
      "La partie d'un terrain visible à la surface de la Terre.",
      "Une carte géologique représentant les roches en surface."
    ],
    answer: "La partie d'un terrain visible à la surface de la Terre.",
    explanation: "Un AFFLEUREMENT est la partie d'un terrain géologique directement observable à la surface de la Terre (falaise, carrière, montagne, bord de route...). C'est le point de départ de toute observation directe en géologie. On les repère à l'aide de cartes topographiques, de photographies aériennes ou de photos satellites."
  },
  {
    type: "qcm",
    question: "La méthode sismique utilisée pour explorer le sous-sol consiste à :",
    options: [
      "Mesurer le champ magnétique terrestre à l'aide d'un magnétomètre.",
      "Provoquer une explosion en surface et analyser les ondes se propageant dans le sol.",
      "Mesurer l'intensité de la pesanteur à l'aide d'un gravimètre."
    ],
    answer: "Provoquer une explosion en surface et analyser les ondes se propageant dans le sol.",
    explanation: "La méthode SISMIQUE (sismique-réflexion) consiste à générer des ondes (par explosion ou vibration) depuis la surface, qui se propagent dans le sous-sol et sont réfléchies ou réfractées au niveau des discontinuités entre couches. Les géophones en surface enregistrent ces ondes, permettant de déterminer la profondeur, la nature et l'orientation des terrains jusqu'à 2000 m."
  },
  {
    type: "qcm",
    question: "Parmi ces roches, lesquelles posent le plus de problèmes à la chronologie relative ?",
    options: [
      "Les roches sédimentaires marines.",
      "Les roches du Précambrien (magmatiques et métamorphiques).",
      "Les roches sédimentaires continentales."
    ],
    answer: "Les roches du Précambrien (magmatiques et métamorphiques).",
    explanation: "Deux époques posent problème à la chronologie relative : le PRÉCAMBRIEN (représenté essentiellement par des roches magmatiques et métamorphiques, sur lesquelles les principes de superposition et d'identité paléontologique ne s'appliquent pas) et le QUATERNAIRE (dépôts très nombreux et variés avec une multitude de fossiles difficiles à corréler)."
  },
  {
    type: "qcm",
    question: "La géologie est qualifiée de science de diagnostic. Cela signifie que :",
    options: [
      "Elle prédit avec certitude les catastrophes naturelles à venir.",
      "À partir de faits et d'observations, on émet des hypothèses qu'on vérifie pour en tirer des conclusions.",
      "Elle se base uniquement sur les expériences en laboratoire."
    ],
    answer: "À partir de faits et d'observations, on émet des hypothèses qu'on vérifie pour en tirer des conclusions.",
    explanation: "La géologie est une science de DIAGNOSTIC : comme un médecin qui observe des symptômes, le géologue observe des faits sur le terrain, émet des hypothèses explicatives, puis les vérifie. C'est une démarche scientifique fondée sur l'observation, l'hypothèse et la vérification — et non sur la prédiction certaine ou uniquement l'expérimentation."
  },
  {
    type: "qcm",
    question: "La résistivité d'une roche éruptive est de l'ordre de :",
    options: [
      "10 Ωm.",
      "300 à 500 Ωm.",
      "10 000 à 20 000 Ωm."
    ],
    answer: "10 000 à 20 000 Ωm.",
    explanation: "La résistivité varie énormément selon la nature des roches : Argile ≈ 10 Ωm, Schiste ≈ 300-500 Ωm, Calcaire ≈ 1000-2000 Ωm, Roches éruptives ≈ 10 000-20 000 Ωm, Pétrole ≈ plusieurs milliards Ωm. Les roches éruptives (magmatiques) ont une très forte résistivité car elles conduisent très mal le courant électrique."
  },
  {
    type: "qcm",
    question: "L'expérimentation en géologie est limitée principalement par :",
    options: [
      "Le manque d'équipements modernes.",
      "Le paramètre durée : le temps expérimental est infime par rapport à la durée réelle des phénomènes géologiques.",
      "L'impossibilité de reproduire les conditions de pression."
    ],
    answer: "Le paramètre durée : le temps expérimental est infime par rapport à la durée réelle des phénomènes géologiques.",
    explanation: "La principale limite de l'expérimentation en géologie est le TEMPS. Un phénomène géologique peut durer des millions d'années, alors qu'une expérience en laboratoire dure au maximum quelques années. On peut reproduire les conditions de pression et de température, mais pas la durée réelle des phénomènes géologiques."
  },
  {
    type: "qcm",
    question: "Parmi les disciplines suivantes, laquelle appartient à la géodynamique EXTERNE ?",
    options: [
      "Le volcanisme.",
      "La paléontologie.",
      "Le métamorphisme."
    ],
    answer: "La paléontologie.",
    explanation: "La géodynamique EXTERNE regroupe les processus exogènes (en surface) : géomorphologie, stratigraphie, sédimentation, PALÉONTOLOGIE et pédologie. La géodynamique INTERNE regroupe les processus endogènes (en profondeur) : magmatisme (volcanisme, plutonisme) et métamorphisme."
  },
  {
    type: "qcm",
    question: "La chronologie absolue introduit la notion de :",
    options: [
      "Ordre relatif entre les couches géologiques.",
      "Durée réelle en millions d'années d'un événement géologique.",
      "Distribution des fossiles dans les terrains sédimentaires."
    ],
    answer: "Durée réelle en millions d'années d'un événement géologique.",
    explanation: "La chronologie ABSOLUE (basée sur la radioactivité) permet de donner l'âge EXACT d'une roche en millions d'années (Ma), introduisant ainsi la notion de DURÉE. La chronologie RELATIVE, elle, donne uniquement un ordre (avant/après) sans chiffre précis — c'est une notion d'ordre, pas de durée."
  },
  {
    type: "qcm",
    question: "Le but ultime de la géologie est de :",
    options: [
      "Exploiter les ressources naturelles du sous-sol.",
      "Retracer l'histoire de la Terre et expliquer les lois de genèse et transformation des matériaux terrestres.",
      "Prévoir les séismes et éruptions volcaniques avec précision."
    ],
    answer: "Retracer l'histoire de la Terre et expliquer les lois de genèse et transformation des matériaux terrestres.",
    explanation: "Le but fondamental de la géologie est double : 1) RETRACER l'histoire de la Terre par l'étude des matériaux constitutifs de l'écorce terrestre, et 2) EXPLIQUER les lois et mécanismes de genèse et de transformation de ces matériaux. La prospection de ressources et la prévision des risques naturels sont des applications pratiques, mais pas le but premier de la science géologique."
  }
] },
        { nom: "Methodes d'etudes", quiz: [
  {
    type: "qcm",
    question: "Les méthodes d’études en géologie se divisent principalement en :",
    options: [
      "Méthodes sur le terrain et méthodes au laboratoire",
      "Uniquement des observations directes",
      "Seulement des méthodes géophysiques",
      "Méthodes théoriques uniquement"
    ],
    answer: "Méthodes sur le terrain et méthodes au laboratoire",
    explanation: "Elles combinent observation directe et analyse approfondie. Pourquoi cette distinction est-elle fondamentale pour une bonne compréhension des terrains ?"
  },
  {
    type: "qcm",
    question: "Les observations directes sur le terrain se font principalement sur :",
    options: [
      "Les affleurements (parties visibles des terrains à la surface)",
      "Uniquement par forage profond",
      "À partir de satellites uniquement",
      "Dans des laboratoires fermés"
    ],
    answer: "Les affleurements (parties visibles des terrains à la surface)",
    explanation: "Ils sont repérés grâce aux cartes topographiques, reliefs, carrières ou photos aériennes. Pourquoi les affleurements sont-ils le point de départ essentiel du travail du géologue ?"
  },
  {
    type: "qcm",
    question: "L’étude des affleurements inclut :",
    options: [
      "Identification des roches, description des structures et échantillonnage",
      "Uniquement la mesure de la gravité",
      "Seulement l’analyse chimique en laboratoire",
      "L’étude des fossiles exclusivement"
    ],
    answer: "Identification des roches, description des structures et échantillonnage",
    explanation: "On décrit les roches, leur position, épaisseur, plissements, cassures, etc. Pourquoi cet examen direct reste-t-il irremplaçable ?"
  },
  {
    type: "qcm",
    question: "Les observations indirectes sur le terrain font appel à :",
    options: [
      "La géophysique (méthodes sismique, magnétique, gravimétrique, électrique)",
      "Uniquement l’observation visuelle",
      "Les expériences de synthèse minérale",
      "Les analyses chimiques au laboratoire"
    ],
    answer: "La géophysique (méthodes sismique, magnétique, gravimétrique, électrique)",
    explanation: "Elles permettent d’explorer en profondeur sans creuser partout. Pourquoi ces méthodes sont-elles très utilisées en prospection pétrolière ?"
  },
  {
    type: "qcm",
    question: "La méthode sismique (réflexion) consiste à :",
    options: [
      "Provoquer des ondes artificielles et analyser leur réflexion",
      "Mesurer le champ magnétique de la Terre",
      "Analyser la résistivité électrique des terrains",
      "Mesurer la pesanteur"
    ],
    answer: "Provoquer des ondes artificielles et analyser leur réflexion",
    explanation: "Elle permet de connaître profondeur, nature et orientation des terrains jusqu’à 2000 m. Pourquoi cette méthode est-elle privilégiée par les géologues pétroliers ?"
  },
  {
    type: "qcm",
    question: "La méthode magnétique permet de détecter :",
    options: [
      "Des anomalies liées à la présence de roches cristallines en profondeur",
      "La résistivité électrique des terrains",
      "Uniquement les ondes sismiques",
      "La pesanteur locale"
    ],
    answer: "Des anomalies liées à la présence de roches cristallines en profondeur",
    explanation: "Elle est très sensible et valable jusqu’à 500 m. Pourquoi cette méthode est-elle utile pour cartographier le socle ?"
  },
  {
    type: "qcm",
    question: "La méthode gravimétrique mesure :",
    options: [
      "Les variations d’intensité de la pesanteur (anomalies gravimétriques)",
      "Les ondes sismiques réfléchies",
      "Le champ magnétique terrestre",
      "La résistivité électrique"
    ],
    answer: "Les variations d’intensité de la pesanteur (anomalies gravimétriques)",
    explanation: "Les anomalies traduisent excédent ou déficit de masse. Pourquoi cette méthode aide-t-elle à détecter des structures en profondeur ?"
  },
  {
    type: "qcm",
    question: "La méthode du carottage électrique mesure :",
    options: [
      "La résistivité électrique des terrains",
      "Le champ magnétique",
      "Les ondes sismiques",
      "La pesanteur"
    ],
    answer: "La résistivité électrique des terrains",
    explanation: "Les valeurs varient fortement selon la nature des roches (argile, calcaire, pétrole…). Pourquoi cette méthode est-elle très discriminative ?"
  },
  {
    type: "qcm",
    question: "Les méthodes au laboratoire incluent :",
    options: [
      "L’étude des minéraux et fossiles au microscope, analyses chimiques et synthèse des résultats",
      "Uniquement les observations sur affleurements",
      "Les mesures géophysiques sur le terrain",
      "Les forages profonds uniquement"
    ],
    answer: "L’étude des minéraux et fossiles au microscope, analyses chimiques et synthèse des résultats",
    explanation: "On produit ensuite cartes thématiques, coupes et modèles. Pourquoi le laboratoire est-il indispensable après le travail de terrain ?"
  },
  {
    type: "qcm",
    question: "L’expérimentation en géologie est surtout possible dans le domaine :",
    options: [
      "De la synthèse des minéraux",
      "De l’étude des séismes naturels",
      "De la tectonique des plaques en temps réel",
      "De la sédimentation à grande échelle"
    ],
    answer: "De la synthèse des minéraux",
    explanation: "Les domaines d’expérimentation directe sont limités en géologie. Pourquoi la synthèse minérale est-elle un champ privilégié ?"
  },
  {
    type: "qcm",
    question: "Les affleurements artificiels sont souvent représentés par :",
    options: [
      "Les carrières (ex. : carrière de Diack)",
      "Uniquement les montagnes naturelles",
      "Les fonds océaniques",
      "Les zones désertiques"
    ],
    answer: "Les carrières (ex. : carrière de Diack)",
    explanation: "Ils permettent une observation directe facilitée par l’homme. Pourquoi ces sites sont-ils très utiles pour les étudiants et chercheurs ?"
  },
  {
    type: "qcm",
    question: "Les méthodes géophysiques sont particulièrement utiles pour :",
    options: [
      "Explorer le sous-sol sans excavation importante",
      "Remplacer totalement l’observation directe",
      "Étudier uniquement les roches de surface",
      "Analyser les fossiles"
    ],
    answer: "Explorer le sous-sol sans excavation importante",
    explanation: "Elles complètent les observations directes. Pourquoi leur combinaison avec les méthodes directes donne-t-elle les meilleurs résultats ?"
  },
  {
    type: "qcm",
    question: "Le débit en prismes (orgues) est caractéristique des :",
    options: [
      "Roches magmatiques volcaniques (basalte)",
      "Roches sédimentaires",
      "Roches métamorphiques",
      "Sédiments meubles"
    ],
    answer: "Roches magmatiques volcaniques (basalte)",
    explanation: "Exemple célèbre en Auvergne. Pourquoi cette structure prismatique se forme-t-elle lors du refroidissement ?"
  },
  {
    type: "qcm",
    question: "Les méthodes d’études en géologie visent à :",
    options: [
      "Combiner observations directes, indirectes et analyses en laboratoire",
      "Utiliser uniquement la géophysique",
      "Se limiter aux affleurements naturels",
      "Ignorer le travail de terrain"
    ],
    answer: "Combiner observations directes, indirectes et analyses en laboratoire",
    explanation: "Approche intégrée. Pourquoi cette pluridisciplinarité est-elle nécessaire pour comprendre les phénomènes géologiques ?"
  },
  {
    type: "qcm",
    question: "La sismique réflexion est particulièrement employée en :",
    options: [
      "Prospection pétrolière",
      "Étude des roches de surface",
      "Analyse des fossiles",
      "Cartographie des affleurements"
    ],
    answer: "Prospection pétrolière",
    explanation: "Elle permet d’imager le sous-sol jusqu’à grande profondeur. Pourquoi cette méthode a-t-elle révolutionné l’exploration des hydrocarbures ?"
  },
  {
    type: "qcm",
    question: "Globalement, les méthodes d’études en géologie montrent que :",
    options: [
      "Le géologue combine travail de terrain, géophysique et analyses en laboratoire",
      "Le géologue travaille uniquement en laboratoire",
      "Les observations directes sont inutiles",
      "La géophysique remplace tout le reste"
    ],
    answer: "Le géologue combine travail de terrain, géophysique et analyses en laboratoire",
    explanation: "Approche complémentaire. Pourquoi cette méthodologie intégrée est-elle la force de la géologie moderne ?"
  }
] },
        { nom: "Seismologie", quiz: [
  {
    type: "qcm",
    question: "Un séisme est défini comme :",
    options: [
      "Une vibration de surface causée par le vent ou la mer.",
      "Une rupture brutale de roches en profondeur soumises à des tensions accumulées pendant des années ou des siècles.",
      "Une éruption volcanique provoquant des tremblements de terre."
    ],
    answer: "Une rupture brutale de roches en profondeur soumises à des tensions accumulées pendant des années ou des siècles.",
    explanation: "Un SÉISME est une rupture BRUTALE de roches en PROFONDEUR sous l'effet de tensions tectoniques qui s'accumulent lentement pendant des années, voire des siècles. Ce n'est pas uniquement lié aux volcans — un séisme peut se produire sans aucune activité volcanique. La durée d'accumulation des contraintes avant rupture est une caractéristique essentielle."
  },
  {
    type: "qcm",
    question: "L'épicentre d'un séisme est :",
    options: [
      "Le lieu en profondeur où se produit la rupture des roches.",
      "La zone en surface située à la verticale du foyer.",
      "L'appareil qui enregistre les ondes sismiques."
    ],
    answer: "La zone en surface située à la verticale du foyer.",
    explanation: "L'ÉPICENTRE est la projection du foyer à la surface de la Terre — c'est la zone en surface à la verticale du FOYER (hypocentre). C'est généralement là où les dégâts sont les plus importants. Le FOYER (ou hypocentre) est le lieu réel de la rupture, EN PROFONDEUR. Confondre ces deux termes est une erreur très fréquente aux examens."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre un sismographe et un sismogramme ?",
    options: [
      "Le sismographe est la courbe enregistrée, le sismogramme est l'appareil.",
      "Le sismographe est l'appareil d'enregistrement, le sismogramme est la courbe tracée.",
      "Ce sont deux termes synonymes désignant le même appareil."
    ],
    answer: "Le sismographe est l'appareil d'enregistrement, le sismogramme est la courbe tracée.",
    explanation: "SISMOGRAPHE = l'appareil qui enregistre les ondes sismiques. SISMOGRAMME = la courbe dessinée par le sismographe, représentant le mouvement du sol en fonction du temps. C'est une distinction fondamentale : l'un est l'outil, l'autre est le résultat. Une analogie : l'électrocardiographe est l'appareil, l'électrocardiogramme est la courbe produite."
  },
  {
    type: "qcm",
    question: "Combien de types d'ondes sismiques peut-on distinguer sur un sismogramme ?",
    options: [
      "Deux types : les ondes P et les ondes S.",
      "Trois types : les ondes P, S et L.",
      "Un seul type : les ondes de compression."
    ],
    answer: "Trois types : les ondes P, S et L.",
    explanation: "L'analyse des sismogrammes permet de distinguer TROIS types d'ondes : 1) Ondes P (premières, rapides, traversent solides ET fluides), 2) Ondes S (secondes, lentes, traversent uniquement les solides), 3) Ondes L (ondes de surface, les plus lentes, se propagent uniquement en surface). Ces trois types arrivent à des moments différents à la station d'enregistrement."
  },
  {
    type: "qcm",
    question: "Les ondes P sont dites 'de compression'. Cela signifie qu'elles :",
    options: [
      "Font vibrer la matière perpendiculairement à leur direction de propagation.",
      "Font vibrer la matière parallèlement à leur direction de propagation (compression-dilatation).",
      "Ne se propagent qu'à la surface de la Terre."
    ],
    answer: "Font vibrer la matière parallèlement à leur direction de propagation (compression-dilatation).",
    explanation: "Les ondes P (Primaires ou de Pression) sont des ondes LONGITUDINALES : elles compriment et dilatent la matière dans la même direction que leur propagation — comme un ressort qu'on pousse et tire. C'est pourquoi elles peuvent traverser TOUS les milieux (solides ET fluides). Les ondes S, elles, sont TRANSVERSALES (vibration perpendiculaire) et ne traversent que les solides."
  },
  {
    type: "qcm",
    question: "Pourquoi les ondes S ne peuvent-elles pas traverser les fluides ?",
    options: [
      "Parce que les fluides sont trop denses pour les laisser passer.",
      "Parce que les fluides ne résistent pas au cisaillement — les molécules glissent librement sans transmettre la vibration.",
      "Parce que les fluides absorbent toute l'énergie des ondes sismiques."
    ],
    answer: "Parce que les fluides ne résistent pas au cisaillement — les molécules glissent librement sans transmettre la vibration.",
    explanation: "Les ondes S sont des ondes de CISAILLEMENT : elles font vibrer la matière perpendiculairement à leur direction de propagation. Un FLUIDE n'a pas de rigidité — ses molécules glissent librement les unes par rapport aux autres sans transmettre ce mouvement de côté. Seul un milieu SOLIDE, rigide, peut résister au cisaillement et donc transmettre les ondes S. C'est ce principe qui a révélé l'état liquide du noyau externe."
  },
  {
    type: "qcm",
    question: "L'hodographe est :",
    options: [
      "Un appareil qui mesure la magnitude des séismes.",
      "Un graphique représentant les temps d'arrivée des ondes sismiques en fonction de la distance épicentrale.",
      "La carte mondiale de répartition des séismes."
    ],
    answer: "Un graphique représentant les temps d'arrivée des ondes sismiques en fonction de la distance épicentrale.",
    explanation: "L'HODOGRAPHE est un graphique (courbe hodographe) qui représente le TEMPS D'ARRIVÉE des différentes ondes sismiques (P, S, L) à chaque station en fonction de la DISTANCE ÉPICENTRALE (distance entre l'épicentre et la station). La pente de ces courbes indique la vitesse de propagation des ondes. C'est un outil fondamental pour déduire la structure interne du globe."
  },
  {
    type: "qcm",
    question: "Que nous apprend l'augmentation progressive de la vitesse des ondes P et S avec la profondeur ?",
    options: [
      "Que la température diminue avec la profondeur.",
      "Que les couches profondes ont des propriétés physiques (densité, élasticité) différentes de celles de la surface.",
      "Que les ondes sismiques s'affaiblissent avec la profondeur."
    ],
    answer: "Que les couches profondes ont des propriétés physiques (densité, élasticité) différentes de celles de la surface.",
    explanation: "La vitesse de propagation d'une onde dépend des CARACTÉRISTIQUES DU MILIEU traversé : densité, pression, température et composition. L'augmentation des vitesses des ondes P et S avec la profondeur démontre que les couches profondes ont des propriétés physiques différentes (généralement plus denses et plus rigides). Cela prouve que la Terre n'est PAS un milieu homogène."
  },
  {
    type: "qcm",
    question: "Quelle propriété particulière des ondes L (de surface) les distingue des ondes P et S ?",
    options: [
      "Leur vitesse augmente constamment avec la distance au foyer.",
      "Leur vitesse est constante car le milieu parcouru ne change pas avec l'éloignement du foyer.",
      "Elles sont les plus rapides des trois types d'ondes."
    ],
    answer: "Leur vitesse est constante car le milieu parcouru ne change pas avec l'éloignement du foyer.",
    explanation: "Les ondes L se propagent UNIQUEMENT en surface. Le milieu qu'elles traversent (la surface terrestre) ne change pas de propriétés avec l'éloignement du foyer — d'où une vitesse CONSTANTE. En revanche, les ondes P et S ont des vitesses CROISSANTES car elles plongent en profondeur et traversent des couches de plus en plus denses. Les ondes L sont aussi les PLUS LENTES des trois types."
  },
  {
    type: "qcm",
    question: "Lorsqu'une onde sismique rencontre une discontinuité, que se passe-t-il ?",
    options: [
      "L'onde est entièrement absorbée par la discontinuité.",
      "L'onde est réfléchie et/ou réfractée, selon les lois de Descartes.",
      "L'onde accélère brusquement sans changer de direction."
    ],
    answer: "L'onde est réfléchie et/ou réfractée, selon les lois de Descartes.",
    explanation: "Lorsqu'une onde sismique atteint une DISCONTINUITÉ (frontière entre deux milieux de propriétés physiques différentes), elle se comporte comme la lumière à l'interface entre deux milieux optiques : elle est en partie RÉFLÉCHIE (rebondit) et en partie RÉFRACTÉE (change de direction en traversant). Ces comportements obéissent aux LOIS DE DESCARTES et permettent de détecter et localiser les discontinuités en profondeur."
  },
  {
    type: "qcm",
    question: "Dans le cas d'un séisme, à une onde P incidente correspondent :",
    options: [
      "Uniquement une onde P réfléchie.",
      "Deux ondes réfléchies (P et S) et deux ondes réfractées (P et S).",
      "Une seule onde réfractée P."
    ],
    answer: "Deux ondes réfléchies (P et S) et deux ondes réfractées (P et S).",
    explanation: "C'est une complication spécifique à la sismique : à une onde de compression (P) incidente unique correspondent QUATRE ondes : deux réfléchies (une P et une S) et deux réfractées (une P et une S). Cela est dû à la CONVERSION DES MODES à l'interface — une partie de l'énergie de l'onde P est convertie en onde S lors de la réflexion et de la réfraction. C'est un phénomène qui complexifie l'interprétation des sismogrammes."
  },
  {
    type: "qcm",
    question: "La mise en évidence de la discontinuité de Gutenberg (à 2900 km) est due à l'observation que :",
    options: [
      "Les ondes P accélèrent brusquement à cette profondeur.",
      "Les ondes S disparaissent et les ondes P ralentissent brutalement à cette profondeur.",
      "Les ondes L pénètrent en profondeur à ce niveau."
    ],
    answer: "Les ondes S disparaissent et les ondes P ralentissent brutalement à cette profondeur.",
    explanation: "La discontinuité de GUTENBERG est mise en évidence par deux observations simultanées à 2900 km : 1) Les ondes S DISPARAISSENT — ce qui indique que le noyau externe est LIQUIDE, 2) Les ondes P subissent une CHUTE BRUTALE de vitesse. Ces changements créent une 'zone d'ombre' sismique entre 103° et 143° de distance épicentrale, où aucune onde directe n'est enregistrée."
  },
  {
    type: "qcm",
    question: "La discontinuité de Lehman (à ~5150 km) a été découverte grâce à :",
    options: [
      "La réapparition des ondes S après leur blocage dans le noyau externe.",
      "L'accélération brutale des ondes L en profondeur.",
      "La disparition totale des ondes P dans le noyau interne."
    ],
    answer: "La réapparition des ondes S après leur blocage dans le noyau externe.",
    explanation: "La DISCONTINUITÉ DE LEHMAN a été découverte par la sismologue Inge Lehmann en 1936. Elle correspond à la frontière entre le noyau externe (LIQUIDE — les ondes S ne passent pas) et la graine (SOLIDE — les ondes S reprennent). La réapparition des ondes S au-delà de 5150 km de profondeur prouve que la GRAINE est solide, malgré les températures extrêmes qui y règnent."
  },
  {
    type: "qcm",
    question: "Les ondes sismiques sont utilisées pour étudier la structure interne de la Terre car :",
    options: [
      "Elles sont visibles à l'œil nu et faciles à observer.",
      "Leur vitesse de propagation dépend des caractéristiques du milieu traversé (densité, pression, composition).",
      "Elles se propagent uniquement à la surface et permettent de cartographier le relief."
    ],
    answer: "Leur vitesse de propagation dépend des caractéristiques du milieu traversé (densité, pression, composition).",
    explanation: "Les ondes sismiques sont des 'sondes naturelles' de l'intérieur de la Terre car leur vitesse de propagation est directement fonction des propriétés physiques du milieu traversé : DENSITÉ, PRESSION, TEMPÉRATURE et COMPOSITION. Tout changement de ces propriétés se traduit par un changement de vitesse (détecté sur les hodographes) ou par une réflexion/réfraction (détectée sur les sismogrammes). C'est le principe fondamental de la sismologie."
  },
  {
    type: "qcm",
    question: "Toutes les stations sismiques du monde enregistrent :",
    options: [
      "Des courbes totalement différentes après chaque séisme, selon leur position.",
      "Le même type de courbe de vitesses des ondes P et S après chaque séisme.",
      "Uniquement les ondes L, les plus lentes et donc les plus faciles à détecter."
    ],
    answer: "Le même type de courbe de vitesses des ondes P et S après chaque séisme.",
    explanation: "Quelle que soit leur position sur le globe, TOUTES les stations d'observation enregistrent le MÊME TYPE de courbe concernant les vitesses des ondes P et S après chaque séisme. Cette universalité prouve que la structure interne de la Terre est la même partout — elle est CONCENTRIQUE et HOMOGÈNE à chaque profondeur donnée. C'est la base du modèle PREM (Preliminary Reference Earth Model)."
  },
  {
    type: "qcm",
    question: "La vitesse des ondes P dans la mésosphère (manteau profond) est d'environ :",
    options: [
      "3,5 km/s",
      "8,1 km/s",
      "13 km/s"
    ],
    answer: "13 km/s",
    explanation: "Les vitesses des ondes P varient selon les enveloppes : Manteau supérieur lithosphérique ≈ 8,1 km/s ; Asthénosphère : diminue (LVZ) puis remonte ; Mésosphère (manteau profond) ≈ 13 km/s. Cette forte vitesse dans la mésosphère reflète la très grande RIGIDITÉ et DENSITÉ des roches à ces profondeurs sous l'effet des pressions considérables."
  },
  {
    type: "qcm",
    question: "La méthode de sismique-réflexion utilisée en exploration géologique est valable jusqu'à :",
    options: [
      "500 m de profondeur.",
      "2000 m de profondeur.",
      "12 km de profondeur."
    ],
    answer: "2000 m de profondeur.",
    explanation: "La méthode de SISMIQUE-RÉFLEXION consiste à provoquer des explosions en surface et à analyser les ondes réfléchies par les couches souterraines. Elle est valable jusqu'à 2000 m de profondeur et est surtout utilisée par les GÉOLOGUES PÉTROLIERS pour localiser les réservoirs d'hydrocarbures. À ne pas confondre avec la méthode magnétique (valable jusqu'à 500 m) ou les forages (12 km)."
  },
  {
    type: "qcm",
    question: "Quelle information fondamentale la sismologie nous fournit-elle sur le noyau externe ?",
    options: [
      "Il est solide, comme la graine.",
      "Il est à l'état liquide, car les ondes S ne le traversent pas.",
      "Il est gazeux, en raison des très hautes températures."
    ],
    answer: "Il est à l'état liquide, car les ondes S ne le traversent pas.",
    explanation: "Le fait que les ondes S (qui ne traversent que les solides) DISPARAISSENT au niveau de la discontinuité de Gutenberg (2900 km) et ne réapparaissent qu'après la discontinuité de Lehman (5150 km) prouve irréfutablement que le NOYAU EXTERNE est à l'état LIQUIDE. C'est l'une des grandes découvertes de la sismologie. Ce noyau liquide, composé de fer et nickel, est à l'origine du champ magnétique terrestre."
  },
  {
    type: "qcm",
    question: "La distance épicentrale est :",
    options: [
      "La profondeur du foyer par rapport à la surface.",
      "La distance entre l'épicentre et la station d'enregistrement.",
      "La distance entre deux épicentres de séismes différents."
    ],
    answer: "La distance entre l'épicentre et la station d'enregistrement.",
    explanation: "La DISTANCE ÉPICENTRALE est la distance mesurée à la surface de la Terre entre l'ÉPICENTRE (projection du foyer en surface) et la STATION SISMIQUE qui enregistre les ondes. Elle est généralement exprimée en degrés d'arc (°) ou en kilomètres. C'est l'axe horizontal des courbes hodographes. Elle ne doit pas être confondue avec la PROFONDEUR du foyer."
  },
  {
    type: "qcm",
    question: "Le modèle PREM (Preliminary Reference Earth Model) est construit à partir de :",
    options: [
      "L'analyse des roches remontées par des forages très profonds.",
      "L'analyse de milliers de sismogrammes enregistrés partout dans le monde.",
      "Des expériences en laboratoire simulant les conditions du manteau."
    ],
    answer: "L'analyse de milliers de sismogrammes enregistrés partout dans le monde.",
    explanation: "Le PREM est le modèle sismologique de RÉFÉRENCE mondial, construit à partir de l'analyse statistique de MILLIERS de sismogrammes enregistrés par des stations réparties sur toute la surface du globe après de nombreux séismes. Il décrit quantitativement comment les vitesses des ondes P et S, la densité, la pression et d'autres propriétés physiques varient avec la profondeur à l'intérieur de la Terre."
  }
] },
        { nom: "Gravimetrie", quiz: [
  {
    type: "qcm",
    question: "La gravimétrie est définie comme :",
    options: [
      "L'étude des séismes et des ondes sismiques dans le sous-sol.",
      "La science de la mesure et de l'étude de la pesanteur, c'est-à-dire de l'accélération que subit un corps au repos à la surface de la Terre.",
      "L'étude du champ magnétique terrestre et de ses variations."
    ],
    answer: "La science de la mesure et de l'étude de la pesanteur, c'est-à-dire de l'accélération que subit un corps au repos à la surface de la Terre.",
    explanation: "La GRAVIMÉTRIE est la science qui mesure et étudie la PESANTEUR, notée g (accélération de la pesanteur). La pesanteur résulte de la force gravitationnelle exercée par la Terre, mais aussi par les autres astres (Lune, Soleil), et de l'effet centrifuge dû à la rotation terrestre. Elle nous renseigne sur le dynamisme du globe et la constitution de ses enveloppes."
  },
  {
    type: "qcm",
    question: "La pesanteur g varie à la surface du globe en fonction de trois facteurs. Lesquels ?",
    options: [
      "La latitude, la température et la composition des roches.",
      "La latitude, l'altitude et le relief.",
      "La pression, la température et la profondeur."
    ],
    answer: "La latitude, l'altitude et le relief.",
    explanation: "La valeur de g varie selon trois facteurs : 1) La LATITUDE (la Terre est aplatie aux pôles — on est plus proche du centre, donc g est plus fort aux pôles qu'à l'équateur), 2) L'ALTITUDE (plus on monte, plus on s'éloigne du centre de la Terre, donc g diminue), 3) Le RELIEF (les masses rocheuses environnantes exercent une attraction supplémentaire). Ces trois facteurs doivent être corrigés pour détecter les anomalies du sous-sol."
  },
  {
    type: "qcm",
    question: "Le Géoïde est défini comme :",
    options: [
      "La forme géométrique parfaitement sphérique de la Terre.",
      "La surface équipotentielle de gravité correspondant au niveau moyen des mers.",
      "L'ellipsoïde mathématique utilisé pour calculer la valeur théorique de g."
    ],
    answer: "La surface équipotentielle de gravité correspondant au niveau moyen des mers.",
    explanation: "Le GÉOÏDE est la forme gravimétrique réelle de la Terre. C'est la surface équipotentielle de gravité correspondant au NIVEAU MOYEN DES MERS (altitude zéro). Un observateur se déplaçant sur le géoïde n'éprouve aucune sensation de montée ou de descente — la gravité est toujours perpendiculaire à son déplacement. À ne pas confondre avec l'ELLIPSOÏDE DE CLAIRAUT, qui est le modèle mathématique approximant le géoïde."
  },
  {
    type: "qcm",
    question: "Si la Terre était immobile et si la répartition des masses était parfaitement homogène, le Géoïde serait :",
    options: [
      "Un ellipsoïde aplati aux pôles.",
      "Une sphère parfaite.",
      "Un géoïde avec de nombreuses ondulations."
    ],
    answer: "Une sphère parfaite.",
    explanation: "Le Géoïde serait une SPHÈRE PARFAITE si deux conditions étaient réunies : 1) la Terre était IMMOBILE (pas de rotation — donc pas d'effet centrifuge qui aplati la Terre aux pôles) et 2) la répartition des MASSES était HOMOGÈNE (pas de différences de densité entre les roches). En réalité, la rotation terrestre et l'hétérogénéité des masses créent des ondulations du géoïde."
  },
  {
    type: "qcm",
    question: "L'ellipsoïde de Clairaut est :",
    options: [
      "La forme exacte de la Terre mesurée par satellite.",
      "Un modèle mathématique approximant le Géoïde, permettant le calcul théorique de g.",
      "La surface de référence des fonds océaniques."
    ],
    answer: "Un modèle mathématique approximant le Géoïde, permettant le calcul théorique de g.",
    explanation: "L'ELLIPSOÏDE DE CLAIRAUT est une approximation mathématique du Géoïde. Il permet de calculer la valeur THÉORIQUE de g en tout point du globe caractérisé par une altitude et une latitude données. Tout écart entre la valeur CALCULÉE sur l'ellipsoïde et la valeur MESURÉE sur le terrain s'appelle une ANOMALIE, imputable à une inhomogénéité de répartition des masses dans le sous-sol."
  },
  {
    type: "qcm",
    question: "Une anomalie gravimétrique est :",
    options: [
      "La valeur mesurée de g en un point donné.",
      "L'écart entre la valeur mesurée de g et la valeur théorique calculée sur l'ellipsoïde de Clairaut.",
      "La variation de g due à l'altitude uniquement."
    ],
    answer: "L'écart entre la valeur mesurée de g et la valeur théorique calculée sur l'ellipsoïde de Clairaut.",
    explanation: "Une ANOMALIE GRAVIMÉTRIQUE = valeur MESURÉE de g − valeur THÉORIQUE calculée. Si la différence est nulle, le sous-sol est homogène comme prévu. Si elle est non nulle, c'est qu'il y a une inhomogénéité en profondeur : soit un excès de masse (anomalie positive), soit un déficit de masse (anomalie négative). C'est l'outil fondamental de la gravimétrie pour sonder le sous-sol."
  },
  {
    type: "qcm",
    question: "La correction d'altitude (correction de Faye ou 'à l'air libre') compense :",
    options: [
      "Les masses rocheuses situées entre la station et l'altitude zéro.",
      "L'irrégularité du relief autour de la station de mesure.",
      "L'altitude de la station par rapport au niveau de référence."
    ],
    answer: "L'altitude de la station par rapport au niveau de référence.",
    explanation: "La correction d'ALTITUDE (dite 'à l'air libre' ou correction de FAYE) rend compte de l'altitude de la station de mesure. Plus une station est haute, plus elle est éloignée du centre de la Terre, donc g y est plus faible. Cette correction ramène la mesure à ce qu'elle serait au niveau de la mer, comme si l'air entre la station et le sol de référence était vide — d'où le nom 'à l'air libre'."
  },
  {
    type: "qcm",
    question: "La correction de plateau (Cp) en gravimétrie rend compte de :",
    options: [
      "L'altitude de la station par rapport au niveau de la mer.",
      "Les masses rocheuses situées entre la station et la côte zéro (niveau de la mer).",
      "L'irrégularité du relief autour de la station."
    ],
    answer: "Les masses rocheuses situées entre la station et la côte zéro (niveau de la mer).",
    explanation: "La correction de PLATEAU (Cp) corrige l'effet attractif des MASSES ROCHEUSES situées entre la station de mesure et le niveau de référence (altitude zéro). Ces roches exercent une attraction vers le haut (contraire à celle de la Terre) qui réduit la valeur mesurée de g. Cette correction est indispensable pour les stations situées en altitude sur des plateaux ou des montagnes."
  },
  {
    type: "qcm",
    question: "La correction de Bouguer est :",
    options: [
      "Uniquement la correction d'altitude (Ca).",
      "La somme des trois corrections : altitude (Ca), plateau (Cp) et topographique (Ct).",
      "La différence entre la valeur mesurée et la valeur de plateau."
    ],
    answer: "La somme des trois corrections : altitude (Ca), plateau (Cp) et topographique (Ct).",
    explanation: "La CORRECTION DE BOUGUER est la somme des TROIS corrections nécessaires pour obtenir l'anomalie gravimétrique : 1) Ca = correction d'altitude (Faye), 2) Cp = correction de plateau, 3) Ct = correction topographique (irrégularité du relief autour de la station). L'ANOMALIE DE BOUGUER = valeur mesurée − valeur calculée, après application de ces trois corrections."
  },
  {
    type: "qcm",
    question: "Une anomalie de Bouguer NÉGATIVE signifie qu'il y a :",
    options: [
      "Un excès de masse à l'aplomb du point de mesure.",
      "Un déficit de masse à l'aplomb du point de mesure.",
      "Une valeur de g conforme à la théorie, sans anomalie."
    ],
    answer: "Un déficit de masse à l'aplomb du point de mesure.",
    explanation: "Anomalie de Bouguer NÉGATIVE = on a mesuré moins que ce qu'on attendait théoriquement → DÉFICIT DE MASSE à l'aplomb. Cela signifie que les matériaux en profondeur sont MOINS DENSES que prévu (ex : une racine légère sous une montagne). Anomalie POSITIVE = EXCÈS DE MASSE (matériaux plus denses que prévu). Ce raisonnement est le cœur de l'interprétation gravimétrique."
  },
  {
    type: "qcm",
    question: "Les anomalies de Bouguer sont généralement NÉGATIVES dans les régions de montagnes. Pourquoi ?",
    options: [
      "Parce que l'altitude élevée réduit mécaniquement la valeur de g.",
      "Parce que les montagnes ont des racines de matériaux légers qui s'enfoncent dans le manteau dense, créant un déficit de masse.",
      "Parce que les roches des montagnes sont toujours moins denses que les roches des plaines."
    ],
    answer: "Parce que les montagnes ont des racines de matériaux légers qui s'enfoncent dans le manteau dense, créant un déficit de masse.",
    explanation: "Sous les montagnes, il existe des RACINES crustales légères qui s'enfoncent dans le manteau plus dense (modèle d'Airy). Ces racines de matériaux légers créent un DÉFICIT DE MASSE à l'aplomb de la montagne par rapport aux prédictions théoriques — d'où l'anomalie de Bouguer NÉGATIVE. C'est la conséquence directe de l'ISOSTASIE : les montagnes 'flottent' sur le manteau comme des icebergs."
  },
  {
    type: "qcm",
    question: "Les anomalies de Bouguer sont généralement POSITIVES sur les fonds marins profonds. Cela indique :",
    options: [
      "Un déficit de masse dû à la présence d'eau peu dense.",
      "Un excès de masse dû à la présence de roches océaniques denses à faible profondeur.",
      "Une absence totale d'anomalie dans ces régions."
    ],
    answer: "Un excès de masse dû à la présence de roches océaniques denses à faible profondeur.",
    explanation: "Sur les FONDS MARINS PROFONDS, l'anomalie de Bouguer est POSITIVE car la croûte océanique est mince et dense — les roches denses du manteau sont proches de la surface. Il y a donc un EXCÈS DE MASSE par rapport aux prédictions théoriques. C'est l'inverse de ce qui se passe sous les montagnes. Cette asymétrie océan/continent est une preuve directe de l'isostasie."
  },
  {
    type: "qcm",
    question: "L'instrument utilisé pour mesurer l'intensité de la pesanteur sur le terrain est :",
    options: [
      "Le magnétomètre.",
      "Le gravimètre.",
      "Le sismographe."
    ],
    answer: "Le gravimètre.",
    explanation: "Le GRAVIMÈTRE est l'instrument spécifique qui mesure l'intensité de la pesanteur g en un point donné. Le MAGNÉTOMÈTRE mesure le champ magnétique terrestre. Le SISMOGRAPHE enregistre les ondes sismiques. Chaque méthode géophysique a son instrument propre — les confondre est une erreur classique."
  },
  {
    type: "qcm",
    question: "Le Géoïde est déterminé par altimétrie satellitale. Cette technique mesure :",
    options: [
      "La composition chimique des roches du fond océanique.",
      "Le temps aller-retour des ondes émises par un satellite et réfléchies sur la surface des océans.",
      "La température des eaux océaniques en profondeur."
    ],
    answer: "Le temps aller-retour des ondes émises par un satellite et réfléchies sur la surface des océans.",
    explanation: "L'ALTIMÉTRIE SATELLITALE détermine la distance entre un satellite en orbite et la surface des océans en mesurant le TEMPS ALLER-RETOUR des ondes émises par le satellite et réfléchies sur l'eau. La compilation de millions de mesures permet d'éliminer les perturbations (vents, courants) et de construire la surface du Géoïde. Les ondulations de courte longueur d'onde du Géoïde reflètent même la TOPOGRAPHIE des fonds océaniques."
  },
  {
    type: "qcm",
    question: "La pesanteur résulte de :",
    options: [
      "Uniquement de la force gravitationnelle exercée par la Terre.",
      "De la force gravitationnelle exercée par la Terre et les autres astres, ET de l'effet centrifuge dû à la rotation terrestre.",
      "Uniquement de l'effet centrifuge dû à la rotation de la Terre."
    ],
    answer: "De la force gravitationnelle exercée par la Terre et les autres astres, ET de l'effet centrifuge dû à la rotation terrestre.",
    explanation: "La PESANTEUR est la résultante de DEUX composantes : 1) La force GRAVITATIONNELLE exercée par la Terre, mais aussi par les autres astres (Lune, Soleil, planètes) — c'est pourquoi les marées existent, 2) L'effet CENTRIFUGE dû à la rotation de la Terre sur elle-même. C'est la combinaison de ces deux forces qui donne la valeur de g en tout point de la surface terrestre."
  },
  {
    type: "qcm",
    question: "La gravimétrie renseigne sur :",
    options: [
      "Uniquement la forme extérieure de la Terre.",
      "Le dynamisme du globe et la constitution des différentes enveloppes terrestres.",
      "Uniquement la composition chimique des roches de surface."
    ],
    answer: "Le dynamisme du globe et la constitution des différentes enveloppes terrestres.",
    explanation: "La GRAVIMÉTRIE fournit des informations sur le DYNAMISME du globe (mouvements tectoniques, subsidence, isostasie) et sur la CONSTITUTION des différentes enveloppes (variations de densité en profondeur). C'est un outil puissant d'exploration du sous-sol — bien plus profond que les méthodes directes (forages). Elle permet aussi de mieux connaître la forme exacte de la Terre (Géoïde)."
  },
  {
    type: "qcm",
    question: "La correction topographique (Ct) en gravimétrie corrige l'effet de :",
    options: [
      "L'altitude de la station de mesure.",
      "L'irrégularité du relief autour de la station de mesure.",
      "Les masses rocheuses entre la station et le niveau zéro."
    ],
    answer: "L'irrégularité du relief autour de la station de mesure.",
    explanation: "La correction TOPOGRAPHIQUE (Ct) rend compte des irrégularités du RELIEF autour de la station de mesure. Les vallées et collines environnantes exercent des attractions gravitationnelles dans diverses directions, qui perturbent la mesure verticale de g. Cette correction est particulièrement importante dans les zones de relief accidenté comme les chaînes de montagnes."
  },
  {
    type: "qcm",
    question: "Les ondulations de courte longueur d'onde du Géoïde rendent compte de :",
    options: [
      "Les variations climatiques à la surface des océans.",
      "La topographie des fonds océaniques.",
      "Les mouvements des plaques tectoniques en temps réel."
    ],
    answer: "La topographie des fonds océaniques.",
    explanation: "Les ondulations de COURTE LONGUEUR D'ONDE du Géoïde reflètent directement la TOPOGRAPHIE DES FONDS OCÉANIQUES. En effet, les reliefs sous-marins (dorsales, fosses, monts sous-marins) créent des anomalies locales de gravité qui se traduisent par de légères déformations de la surface de l'eau — et donc du Géoïde. C'est ainsi qu'on a pu cartographier les fonds marins depuis l'espace grâce aux satellites."
  },
  {
    type: "qcm",
    question: "L'anomalie gravimétrique est imputable à :",
    options: [
      "Des erreurs de mesure du gravimètre sur le terrain.",
      "L'inhomogénéité de la répartition des masses à l'intérieur du globe.",
      "Des variations de la température atmosphérique au moment de la mesure."
    ],
    answer: "L'inhomogénéité de la répartition des masses à l'intérieur du globe.",
    explanation: "Après application de toutes les corrections (Bouguer), tout écart résiduel entre la valeur mesurée et la valeur théorique est une ANOMALIE imputable à l'INHOMOGÉNÉITÉ de la répartition des masses EN PROFONDEUR. C'est la signature géophysique de structures géologiques cachées : bassins sédimentaires, intrusions magmatiques, racines crustales, poches de fluides... C'est le principe de base de la prospection gravimétrique."
  },
  {
    type: "qcm",
    question: "Pourquoi dit-on que g est plus fort aux pôles qu'à l'équateur ?",
    options: [
      "Parce que les roches polaires sont plus denses que les roches équatoriales.",
      "Parce que la Terre est aplatie aux pôles — on y est plus proche du centre, donc l'attraction gravitationnelle y est plus forte.",
      "Parce que la rotation de la Terre augmente g aux pôles."
    ],
    answer: "Parce que la Terre est aplatie aux pôles — on y est plus proche du centre, donc l'attraction gravitationnelle y est plus forte.",
    explanation: "La Terre est un ELLIPSOÏDE aplati aux pôles et renflé à l'équateur (à cause de sa rotation). Aux PÔLES, on est plus PROCHE du centre de la Terre → attraction gravitationnelle plus forte → g plus élevé. À l'ÉQUATEUR, on est plus ÉLOIGNÉ du centre → g plus faible. De plus, l'effet centrifuge (maximal à l'équateur) s'oppose à la gravité, réduisant encore g à l'équateur par rapport aux pôles."
  }
] },
        { nom: "Magnetisme", quiz: [
  {
    type: "qcm",
    question: "Le champ magnétique terrestre est généré par :",
    options: [
      "La rotation de la graine solide au centre de la Terre.",
      "La rotation du noyau externe liquide (fer et nickel) qui crée des courants électriques.",
      "L'aimantation permanente des roches de la croûte terrestre."
    ],
    answer: "La rotation du noyau externe liquide (fer et nickel) qui crée des courants électriques.",
    explanation: "Le champ magnétique terrestre est produit par un mécanisme de DYNAMO : le NOYAU EXTERNE LIQUIDE (composé de fer et nickel en fusion) est en rotation permanente. Ce mouvement de métal conducteur génère des COURANTS ÉLECTRIQUES, qui produisent à leur tour un CHAMP MAGNÉTIQUE. C'est le même principe qu'un dynamo de vélo. Si le noyau externe se solidifiait, le champ magnétique disparaîtrait."
  },
  {
    type: "qcm",
    question: "La susceptibilité magnétique (k) d'un corps est :",
    options: [
      "La capacité d'un corps à résister au champ magnétique terrestre.",
      "La capacité d'un corps à s'aimanter sous l'effet d'un champ magnétique H, selon la relation ɸ = k × H.",
      "La durée pendant laquelle un corps conserve son aimantation après avoir quitté un champ magnétique."
    ],
    answer: "La capacité d'un corps à s'aimanter sous l'effet d'un champ magnétique H, selon la relation ɸ = k × H.",
    explanation: "La SUSCEPTIBILITÉ MAGNÉTIQUE (k) caractérise la capacité d'un matériau à ACQUÉRIR une aimantation ɸ lorsqu'il est placé dans un champ magnétique H. La relation est : ɸ = k × H. Plus k est élevé, plus le matériau s'aimante facilement. Elle varie énormément selon la nature du matériau : très élevée pour les ferromagnétiques (magnétite), quasi nulle pour les paramagnétiques et diamagnétiques."
  },
  {
    type: "qcm",
    question: "Parmi les trois types de matériaux magnétiques, lequel conserve une aimantation PERMANENTE ?",
    options: [
      "Les matériaux paramagnétiques.",
      "Les matériaux diamagnétiques.",
      "Les matériaux ferromagnétiques."
    ],
    answer: "Les matériaux ferromagnétiques.",
    explanation: "Les trois types de matériaux : 1) FERROMAGNÉTIQUES → aimantation FORTE et PERMANENTE (conservée après suppression du champ), 2) PARAMAGNÉTIQUES → aimantation faible et TEMPORAIRE, 3) DIAMAGNÉTIQUES → aimantation très faible et TEMPORAIRE. Seuls les FERROMAGNÉTIQUES, notamment la MAGNÉTITE (Fe₃O₄), présentent un intérêt en géologie car ils conservent une aimantation permanente qui 'fossilise' le champ magnétique."
  },
  {
    type: "qcm",
    question: "La magnétite est un minéral ferromagnétique de formule chimique :",
    options: [
      "Fe₂O₃ (hématite).",
      "Fe₃O₄.",
      "FeCO₃ (sidérite)."
    ],
    answer: "Fe₃O₄.",
    explanation: "La MAGNÉTITE a pour formule Fe₃O₄ — c'est un oxyde de fer mixte (Fe²⁺ et Fe³⁺). C'est le minéral ferromagnétique le plus important en géologie car il s'aimante fortement et conserve cette aimantation de façon permanente (Aimantation Thermorémanente). À ne pas confondre avec l'HÉMATITE (Fe₂O₃) ou la SIDÉRITE (FeCO₃) qui sont des oxydes/carbonates de fer mais sans les mêmes propriétés magnétiques."
  },
  {
    type: "qcm",
    question: "L'Aimantation Thermorémanente (ATR) se produit lorsque :",
    options: [
      "Un magma chaud dépasse 600°C et les minéraux s'alignent sur le champ magnétique.",
      "Des minéraux de magnétite refroidissent en dessous de 600°C et figent leur alignement selon le champ magnétique terrestre de l'époque.",
      "Une roche est exposée au champ magnétique terrestre actuel en surface."
    ],
    answer: "Des minéraux de magnétite refroidissent en dessous de 600°C et figent leur alignement selon le champ magnétique terrestre de l'époque.",
    explanation: "L'ATR se forme en deux étapes : 1) Au-dessus de 600°C (température de Curie), l'agitation thermique empêche l'aimantation — les moments magnétiques sont DÉSORGANISÉS. 2) En refroidissant EN DESSOUS DE 600°C, les cristaux de magnétite s'alignent selon le champ magnétique terrestre AMBIANT et cet alignement se FIGE définitivement. La roche devient ainsi une 'BOUSSOLE FOSSILISÉE' conservant la direction du champ magnétique à l'époque de sa formation."
  },
  {
    type: "qcm",
    question: "La température de 600°C est cruciale en paléomagnétisme car c'est :",
    options: [
      "La température de fusion du basalte.",
      "La température de Curie — en dessous de laquelle la magnétite peut conserver une aimantation permanente.",
      "La température minimale pour que le magma remonte à la surface."
    ],
    answer: "La température de Curie — en dessous de laquelle la magnétite peut conserver une aimantation permanente.",
    explanation: "600°C est la TEMPÉRATURE DE CURIE de la magnétite. Au-dessus de cette température, l'agitation thermique détruit toute aimantation — les moments magnétiques sont aléatoires. En dessous, les moments magnétiques s'alignent et se figent selon le champ ambiant. C'est cette température critique qui contrôle l'enregistrement paléomagnétique. Elle ne doit pas être confondue avec la température de fusion des roches (généralement >1000°C)."
  },
  {
    type: "qcm",
    question: "Le paléomagnétisme est :",
    options: [
      "L'étude du champ magnétique terrestre actuel par satellite.",
      "L'étude du champ magnétique terrestre ANCIEN à travers l'ATR conservée dans les roches.",
      "La méthode de datation des roches par radioactivité."
    ],
    answer: "L'étude du champ magnétique terrestre ANCIEN à travers l'ATR conservée dans les roches.",
    explanation: "Le PALÉOMAGNÉTISME est la discipline qui étudie le champ magnétique terrestre PASSÉ en analysant l'Aimantation Thermorémanente (ATR) conservée dans les roches ancienne. En mesurant l'orientation de la magnétite dans des roches d'âges différents, on peut reconstituer l'évolution du champ magnétique terrestre au cours des temps géologiques. C'est une discipline fondamentale pour comprendre l'expansion océanique et la dérive des continents."
  },
  {
    type: "qcm",
    question: "Les inversions du champ magnétique terrestre signifient que :",
    options: [
      "Le champ magnétique disparaît temporairement.",
      "Les pôles magnétiques Nord et Sud s'échangent — le pôle Nord magnétique devient Sud et vice versa.",
      "L'intensité du champ magnétique augmente brutalement."
    ],
    answer: "Les pôles magnétiques Nord et Sud s'échangent — le pôle Nord magnétique devient Sud et vice versa.",
    explanation: "Une INVERSION du champ magnétique correspond à un ÉCHANGE des pôles magnétiques : le pôle Nord magnétique devient Sud et le pôle Sud devient Nord. Lors d'une période de POLARITÉ INVERSE, une boussole pointerait vers le Sud géographique. Ces inversions sont enregistrées dans l'ATR des roches : une roche formée pendant une polarité inverse montre une aimantation orientée en sens contraire du champ actuel."
  },
  {
    type: "qcm",
    question: "Quelle est la durée approximative entre deux inversions successives du champ magnétique terrestre ?",
    options: [
      "Environ 700 000 ans.",
      "De 1 à 3 millions d'années en moyenne.",
      "Environ 70 à 80 millions d'années."
    ],
    answer: "De 1 à 3 millions d'années en moyenne.",
    explanation: "Les inversions du champ magnétique se produisent en moyenne tous les 1 à 3 MILLIONS D'ANNÉES (Ma), mais avec une grande irrégularité. La période ACTUELLE de polarité normale a débuté il y a environ 700 000 ans — ce n'est donc PAS la durée entre deux inversions, mais l'âge de la dernière inversion. L'étude des 70-80 derniers Ma a permis de recenser de nombreuses inversions et de les dater précisément."
  },
  {
    type: "qcm",
    question: "La dernière inversion du champ magnétique terrestre s'est produite il y a environ :",
    options: [
      "1 à 3 millions d'années.",
      "70 à 80 millions d'années.",
      "700 000 ans."
    ],
    answer: "700 000 ans.",
    explanation: "La DERNIÈRE INVERSION du champ magnétique s'est produite il y a environ 700 000 ans — c'est le début de la période de polarité NORMALE actuelle. Attention au piège : 1 à 3 Ma est la DURÉE MOYENNE entre deux inversions (pas la date de la dernière). 70-80 Ma est la PÉRIODE TOTALE sur laquelle les inversions ont été étudiées et cartographiées grâce au paléomagnétisme des basaltes."
  },
  {
    type: "qcm",
    question: "Une roche basaltique dont la magnétite est orientée en sens INVERSE du champ actuel indique que :",
    options: [
      "La roche est très récente, formée il y a moins de 700 000 ans.",
      "La roche s'est formée pendant une période de POLARITÉ INVERSE — les pôles magnétiques étaient échangés par rapport à aujourd'hui.",
      "La roche a été déformée par la tectonique des plaques."
    ],
    answer: "La roche s'est formée pendant une période de POLARITÉ INVERSE — les pôles magnétiques étaient échangés par rapport à aujourd'hui.",
    explanation: "Si la magnétite d'un basalte est orientée EN SENS INVERSE du champ magnétique actuel, cela signifie que cette roche s'est refroidie pendant une PÉRIODE DE POLARITÉ INVERSE — une époque où les pôles magnétiques étaient échangés. La magnétite a enregistré fidèlement le champ de l'époque. Les roches récentes (moins de 700 000 ans) montrent une polarité NORMALE comme aujourd'hui."
  },
  {
    type: "qcm",
    question: "L'expansion océanique (Hess, 1960) explique que :",
    options: [
      "Les continents se rapprochent progressivement les uns des autres.",
      "Du nouveau plancher océanique se crée en permanence aux dorsales et s'écarte de part et d'autre.",
      "La croûte océanique est plus ancienne que la croûte continentale."
    ],
    answer: "Du nouveau plancher océanique se crée en permanence aux dorsales et s'écarte de part et d'autre.",
    explanation: "La théorie de l'EXPANSION OCÉANIQUE (H. Hess, 1960) postule que du magma remonte en permanence au niveau des DORSALES médio-océaniques, forme de nouvelle croûte océanique, puis s'ÉCARTE de part et d'autre de la dorsale. Cela implique que la croûte océanique est d'autant PLUS ANCIENNE qu'on s'éloigne de la dorsale — et qu'elle est ENTIÈREMENT RÉGÉNÉRÉE en 200 à 300 Ma. C'est le fondement de la tectonique des plaques."
  },
  {
    type: "qcm",
    question: "Les bandes magnétiques symétriques de part et d'autre d'une dorsale sont la preuve de :",
    options: [
      "La présence de roches continentales au fond des océans.",
      "L'expansion océanique : le plancher enregistre les inversions magnétiques au fur et à mesure de sa création.",
      "La subduction de la croûte océanique sous la croûte continentale."
    ],
    answer: "L'expansion océanique : le plancher enregistre les inversions magnétiques au fur et à mesure de sa création.",
    explanation: "Les BANDES MAGNÉTIQUES symétriques de part et d'autre des dorsales constituent la PREUVE DIRECTE de l'expansion océanique. Au fur et à mesure que le plancher se crée à la dorsale, les basaltes enregistrent la polarité du moment (normale ou inverse). Comme le plancher s'écarte symétriquement, les bandes se retrouvent en miroir de chaque côté. Plus on s'éloigne de la dorsale, plus les bandes (et les roches) sont ANCIENNES."
  },
  {
    type: "qcm",
    question: "Une anomalie magnétique POSITIVE au-dessus du plancher océanique correspond à :",
    options: [
      "Une bande de basaltes de polarité INVERSE qui s'oppose au champ actuel.",
      "Une bande de basaltes de polarité NORMALE qui renforce le champ actuel.",
      "L'absence totale de basaltes magnétisés dans cette zone."
    ],
    answer: "Une bande de basaltes de polarité NORMALE qui renforce le champ actuel.",
    explanation: "Une anomalie magnétique POSITIVE signifie que le champ mesuré est SUPÉRIEUR au champ théorique. Cela se produit quand les basaltes sous-marins ont une aimantation de POLARITÉ NORMALE (même sens que le champ actuel) qui RENFORCE le champ mesuré. À l'inverse, les bandes de POLARITÉ INVERSE s'OPPOSENT au champ actuel → anomalie NÉGATIVE. L'alternance de ces bandes + et − est la signature de l'expansion océanique."
  },
  {
    type: "qcm",
    question: "Comment la preuve de l'expansion océanique a-t-elle été validée à posteriori ?",
    options: [
      "Par des forages atteignant le manteau au niveau des dorsales.",
      "Par les découvertes liées au paléomagnétisme des roches du plancher océanique.",
      "Par des observations directes des dorsales à l'aide de sous-marins."
    ],
    answer: "Par les découvertes liées au paléomagnétisme des roches du plancher océanique.",
    explanation: "L'hypothèse de HESS (1960) sur l'expansion océanique, initialement basée sur les données sismiques et la topographie des fonds marins, a été VALIDÉE à posteriori grâce au PALÉOMAGNÉTISME. La découverte de bandes magnétiques symétriques et alternées de part et d'autre des dorsales, enregistrant fidèlement les inversions du champ magnétique, a fourni la preuve irréfutable que le plancher océanique se crée bien aux dorsales et s'écarte progressivement."
  },
  {
    type: "qcm",
    question: "Selon le cours, les propriétés magnétiques des roches n'existent qu'à :",
    options: [
      "Toutes les profondeurs, jusqu'au noyau.",
      "Moins de 15 km de profondeur (à proximité de la surface).",
      "Plus de 100 km de profondeur, dans le manteau."
    ],
    answer: "Moins de 15 km de profondeur (à proximité de la surface).",
    explanation: "Les roches n'ont des propriétés magnétiques utiles qu'à PROXIMITÉ DE LA SURFACE, à des profondeurs inférieures à 15 km. Au-delà, les températures dépassent la TEMPÉRATURE DE CURIE (600°C pour la magnétite), ce qui détruit toute aimantation permanente. C'est pourquoi les anomalies magnétiques mesurées en surface reflètent uniquement la structure de la croûte superficielle, pas le manteau profond."
  },
  {
    type: "qcm",
    question: "Les anomalies magnétiques de grande longueur d'onde (détectées par satellite) sont dues à :",
    options: [
      "Des variations d'aimantation de la croûte profonde et de la partie supérieure du manteau.",
      "Des variations de la rotation du noyau externe.",
      "Des variations de température à la surface des océans."
    ],
    answer: "Des variations d'aimantation de la croûte profonde et de la partie supérieure du manteau.",
    explanation: "Les anomalies magnétiques de GRANDE LONGUEUR D'ONDE (s'étendant sur des milliers de kilomètres) détectées par satellites sont dues aux variations d'aimantation de la CROÛTE PROFONDE et sans doute de la partie supérieure du MANTEAU. Ces variations peuvent être produites par des réchauffements locaux de l'écorce (lors des orogenèses et du métamorphisme) qui font perdre aux roches leurs propriétés ferrimagnétiques en dépassant la température de Curie."
  },
  {
    type: "qcm",
    question: "La Terre peut être assimilée à :",
    options: [
      "Un aimant en fer à cheval avec un pôle Nord au nord et un pôle Sud au sud.",
      "Un barreau aimanté unique situé au centre de la Terre, dans le noyau.",
      "Un réseau de plusieurs aimants répartis dans la croûte terrestre."
    ],
    answer: "Un barreau aimanté unique situé au centre de la Terre, dans le noyau.",
    explanation: "Le champ magnétique terrestre peut être considéré comme le champ produit par un DIPÔLE UNIQUE (barreau aimanté) situé au CENTRE DE LA TERRE — c'est-à-dire dans le noyau. Ce champ magnétique s'étend autour de la Terre et s'AMENUISE au fur et à mesure qu'on s'en éloigne. Cette simplification (modèle dipolaire) est une bonne approximation pour le champ magnétique à grande échelle, même si localement des variations complexes existent."
  },
  {
    type: "qcm",
    question: "Le plancher océanique est entièrement régénéré en :",
    options: [
      "Environ 10 millions d'années.",
      "Environ 200 à 300 millions d'années.",
      "Environ 4,5 milliards d'années (âge de la Terre)."
    ],
    answer: "Environ 200 à 300 millions d'années.",
    explanation: "Selon le modèle de HESS, le plancher océanique est entièrement RÉGÉNÉRÉ en 200 à 300 MILLIONS D'ANNÉES. Cela signifie qu'il n'existe pas de croûte océanique plus vieille que 300 Ma sur Terre — elle a toujours été détruite par subduction avant. C'est pourquoi la croûte océanique est beaucoup plus JEUNE que la croûte continentale, qui peut conserver des roches vieilles de plus de 4 milliards d'années."
  },
  {
    type: "qcm",
    question: "L'étude du paléomagnétisme des basaltes a permis de démontrer que le champ magnétique terrestre est dû à :",
    options: [
      "L'aimantation permanente des roches cristallines de la croûte.",
      "La rotation du noyau externe liquide, qui serait responsable des variations et inversions observées.",
      "L'attraction exercée par le Soleil et la Lune sur la Terre."
    ],
    answer: "La rotation du noyau externe liquide, qui serait responsable des variations et inversions observées.",
    explanation: "L'analyse paléomagnétique a confirmé que le champ magnétique terrestre est généré par la ROTATION DU NOYAU EXTERNE LIQUIDE (dynamo terrestre). Les inversions observées reflètent des changements complexes dans les mouvements de convection du fer liquide. Ce n'est pas l'aimantation des roches crustales (trop superficielle et localisée) ni l'attraction des astres (qui ne produit pas de champ magnétique dipolaire global)."
  }
] },
        { nom: "Materiaux constitutifs de l'ecorce terrestre", quiz: [
  {
    type: "qcm",
    question: "Les matériaux constitutifs de l’écorce terrestre sont principalement :",
    options: [
      "Les roches et les minéraux",
      "Uniquement les fluides (eau et pétrole)",
      "Les gaz atmosphériques",
      "Les organismes vivants"
    ],
    answer: "Les roches et les minéraux",
    explanation: "Ils forment la partie solide de l’écorce. Pourquoi distinguer minéraux et roches est-il fondamental en géologie ?"
  },
  {
    type: "qcm",
    question: "Un minéral est défini comme :",
    options: [
      "Une substance naturelle, solide, à composition chimique définie et structure cristalline ordonnée",
      "Un assemblage de plusieurs minéraux",
      "Une roche fragmentée",
      "Un matériau organique"
    ],
    answer: "Une substance naturelle, solide, à composition chimique définie et structure cristalline ordonnée",
    explanation: "Exemples : quartz, feldspath, mica. Pourquoi cette définition stricte permet-elle d’identifier les minéraux ?"
  },
  {
    type: "qcm",
    question: "Une roche est :",
    options: [
      "Un assemblage de un ou plusieurs minéraux ou débris",
      "Un minéral pur",
      "Uniquement d’origine magmatique",
      "Toujours sédimentaire"
    ],
    answer: "Un assemblage de un ou plusieurs minéraux ou débris",
    explanation: "Exemples : granite, basalte, calcaire. Pourquoi les roches sont-elles les unités de base de l’écorce terrestre ?"
  },
  {
    type: "qcm",
    question: "Les trois grands types de roches qui constituent l’écorce terrestre sont :",
    options: [
      "Magmatiques, sédimentaires et métamorphiques",
      "Uniquement magmatiques et sédimentaires",
      "Volcaniques, plutoniques et filoniennes",
      "Continentales et océaniques uniquement"
    ],
    answer: "Magmatiques, sédimentaires et métamorphiques",
    explanation: "Classification fondamentale selon leur origine. Pourquoi cette tripartition est-elle essentielle ?"
  },
  {
    type: "qcm",
    question: "Les roches magmatiques se forment par :",
    options: [
      "Refroidissement et cristallisation du magma",
      "Dépôt et compaction de sédiments",
      "Transformation sous haute pression et température",
      "Altération superficielle"
    ],
    answer: "Refroidissement et cristallisation du magma",
    explanation: "Elles sont endogènes. Pourquoi leur texture dépend-elle de la vitesse de refroidissement ?"
  },
  {
    type: "qcm",
    question: "La croûte continentale est principalement composée de :",
    options: [
      "Roches granitiques (riches en silice)",
      "Roches basaltiques",
      "Roches sédimentaires uniquement",
      "Péridotites"
    ],
    answer: "Roches granitiques (riches en silice)",
    explanation: "Composition felsique. Pourquoi la croûte continentale est-elle moins dense que la croûte océanique ?"
  },
  {
    type: "qcm",
    question: "La croûte océanique est principalement constituée de :",
    options: [
      "Basalte (roches mafiques)",
      "Granite",
      "Calcaire",
      "Grès"
    ],
    answer: "Basalte (roches mafiques)",
    explanation: "Plus dense et plus mince. Pourquoi cette différence de composition explique-t-elle la subduction ?"
  },
  {
    type: "qcm",
    question: "Les roches sédimentaires se forment par :",
    options: [
      "Accumulation, compaction et cimentation de sédiments",
      "Refroidissement du magma",
      "Métamorphisme",
      "Fusion partielle du manteau"
    ],
    answer: "Accumulation, compaction et cimentation de sédiments",
    explanation: "Elles couvrent une grande partie de la surface terrestre. Pourquoi sont-elles importantes pour l’étude de l’histoire de la Terre ?"
  },
  {
    type: "qcm",
    question: "Le métamorphisme transforme les roches par :",
    options: [
      "Action de la température et de la pression sans fusion complète",
      "Refroidissement rapide en surface",
      "Dépôt sédimentaire",
      "Altération chimique superficielle"
    ],
    answer: "Action de la température et de la pression sans fusion complète",
    explanation: "Exemples : schiste, gneiss, marbre. Pourquoi les roches métamorphiques sont-elles courantes dans le socle continental ?"
  },
  {
    type: "qcm",
    question: "Les minéraux les plus abondants dans l’écorce terrestre sont :",
    options: [
      "Les silicates (quartz, feldspaths, micas, amphiboles, pyroxènes)",
      "Les carbonates uniquement",
      "Les oxydes de fer uniquement",
      "Les sulfures"
    ],
    answer: "Les silicates (quartz, feldspaths, micas, amphiboles, pyroxènes)",
    explanation: "Ils représentent plus de 90% de l’écorce. Pourquoi les silicates dominent-ils la composition minéralogique ?"
  },
  {
    type: "qcm",
    question: "La composition moyenne de la croûte continentale est :",
    options: [
      "Riche en silice et aluminium (felsique)",
      "Riche en fer et magnésium (mafique)",
      "Riche en carbonates",
      "Pauvre en silice"
    ],
    answer: "Riche en silice et aluminium (felsique)",
    explanation: "Granitoïde. Pourquoi cette composition influence-t-elle sa densité et son comportement isostatique ?"
  },
  {
    type: "qcm",
    question: "Les roches magmatiques volcaniques ont une texture :",
    options: [
      "Microlitique ou vitreuse (refroidissement rapide)",
      "Grenue (cristaux gros)",
      "Schisteuse",
      "Clastique"
    ],
    answer: "Microlitique ou vitreuse (refroidissement rapide)",
    explanation: "Exemple : basalte, rhyolite. Pourquoi cette texture diffère-t-elle des roches plutoniques ?"
  },
  {
    type: "qcm",
    question: "Les roches plutoniques ont une texture grenue car :",
    options: [
      "Elles se refroidissent lentement en profondeur",
      "Elles se refroidissent rapidement en surface",
      "Elles sont formées par sédimentation",
      "Elles subissent un métamorphisme"
    ],
    answer: "Elles se refroidissent lentement en profondeur",
    explanation: "Exemple : granite, gabbro. Pourquoi les cristaux sont-ils visibles à l’œil nu ?"
  },
  {
    type: "qcm",
    question: "Les roches sédimentaires détritiques sont formées par :",
    options: [
      "Fragmentation et accumulation de débris",
      "Précipitation chimique",
      "Transformation métamorphique",
      "Cristallisation magmatique"
    ],
    answer: "Fragmentation et accumulation de débris",
    explanation: "Exemples : grès, conglomérat, argile. Pourquoi ces roches sont-elles très répandues en surface ?"
  },
  {
    type: "qcm",
    question: "Le calcaire est une roche sédimentaire :",
    options: [
      "D’origine biochimique ou chimique",
      "Magmatique",
      "Métamorphique",
      "Détritique uniquement"
    ],
    answer: "D’origine biochimique ou chimique",
    explanation: "Principalement formé de calcite. Pourquoi les roches carbonatées sont-elles importantes en géologie du Sénégal ?"
  },
  {
    type: "qcm",
    question: "Le gneiss est une roche :",
    options: [
      "Métamorphique",
      "Magmatique volcanique",
      "Sédimentaire détritique",
      "Sédimentaire chimique"
    ],
    answer: "Métamorphique",
    explanation: "Elle présente un foliation. Pourquoi les roches métamorphiques indiquent-elles souvent des zones de déformation intense ?"
  },
  {
    type: "qcm",
    question: "La distinction entre croûte continentale et océanique repose principalement sur :",
    options: [
      "La composition, l’épaisseur et la densité",
      "Uniquement la couleur",
      "L’âge uniquement",
      "La présence de fossiles"
    ],
    answer: "La composition, l’épaisseur et la densité",
    explanation: "Continentale : épaisse et légère ; Océanique : mince et dense. Pourquoi cette différence est-elle clé en tectonique des plaques ?"
  },
  {
    type: "qcm",
    question: "Les minéraux ferromagnésiens (olivine, pyroxène, amphibole) sont typiques des :",
    options: [
      "Roches mafiques",
      "Roches felsiques",
      "Roches sédimentaires",
      "Roches métamorphiques uniquement"
    ],
    answer: "Roches mafiques",
    explanation: "Riches en fer et magnésium. Pourquoi ces minéraux sont-ils abondants dans la croûte océanique ?"
  },
  {
    type: "qcm",
    question: "Les matériaux constitutifs de l’écorce terrestre sont le résultat :",
    options: [
      "Des processus magmatiques, sédimentaires et métamorphiques",
      "Uniquement des processus externes",
      "Uniquement de l’altération",
      "De la vie uniquement"
    ],
    answer: "Des processus magmatiques, sédimentaires et métamorphiques",
    explanation: "Cycle des roches. Pourquoi ces trois processus expliquent-ils la diversité des matériaux de l’écorce ?"
  },
  {
    type: "qcm",
    question: "Globalement, la leçon sur les matériaux constitutifs de l’écorce terrestre permet de comprendre :",
    options: [
      "La nature, la composition et l’origine des roches qui forment la partie solide externe de la Terre",
      "Uniquement les processus internes profonds",
      "Les phénomènes atmosphériques",
      "Les fossiles uniquement"
    ],
    answer: "La nature, la composition et l’origine des roches qui forment la partie solide externe de la Terre",
    explanation: "Base indispensable pour la suite du cours. Pourquoi maîtriser ces matériaux est-il crucial en géodynamique interne ?"
  }
] },
        { nom: "La derive des continents", quiz: [
  {
    type: "qcm",
    question: "La Tectonique des Plaques est :",
    options: [
      "La théorie expliquant le mouvement des plaques lithosphériques à la surface de la Terre",
      "L’étude uniquement des séismes",
      "La description des roches sédimentaires",
      "L’analyse des minéraux"
    ],
    answer: "La théorie expliquant le mouvement des plaques lithosphériques à la surface de la Terre",
    explanation: "C’est le cadre unificateur de la géodynamique interne. Pourquoi cette théorie est-elle considérée comme une révolution en géologie ?"
  },
  {
    type: "qcm",
    question: "La lithosphère est :",
    options: [
      "La couche rigide externe (croûte + manteau supérieur) fragmentée en plaques",
      "La couche plastique du manteau",
      "Le noyau externe liquide",
      "La croûte océanique uniquement"
    ],
    answer: "La couche rigide externe (croûte + manteau supérieur) fragmentée en plaques",
    explanation: "Elle repose sur l’asthénosphère plus ductile. Pourquoi cette rigidité permet-elle le mouvement des plaques ?"
  },
  {
    type: "qcm",
    question: "Les plaques lithosphériques se déplacent grâce à :",
    options: [
      "La convection mantellique",
      "Uniquement la gravité",
      "Les marées océaniques",
      "L’activité solaire"
    ],
    answer: "La convection mantellique",
    explanation: "La chaleur interne entraîne des courants de convection. Pourquoi ce mécanisme est-il le moteur principal de la tectonique ?"
  },
  {
    type: "qcm",
    question: "Les trois principaux types de limites de plaques sont :",
    options: [
      "Divergentes, convergentes et transformantes (décrochantes)",
      "Uniquement convergentes et divergentes",
      "Magmatiques, sédimentaires et métamorphiques",
      "Continentales et océaniques"
    ],
    answer: "Divergentes, convergentes et transformantes (décrochantes)",
    explanation: "Chaque type produit des phénomènes spécifiques. Pourquoi cette classification est-elle fondamentale ?"
  },
  {
    type: "qcm",
    question: "Aux limites divergentes, on observe :",
    options: [
      "Une expansion océanique avec formation de nouvelle croûte (dorsales médio-océaniques)",
      "La subduction d’une plaque sous une autre",
      "Un glissement latéral",
      "Uniquement des séismes profonds"
    ],
    answer: "Une expansion océanique avec formation de nouvelle croûte (dorsales médio-océaniques)",
    explanation: "Exemple : dorsale médio-atlantique. Pourquoi ce processus est-il à l’origine de la croûte océanique ?"
  },
  {
    type: "qcm",
    question: "Aux limites convergentes, on peut avoir :",
    options: [
      "Subduction (océan-continent ou océan-océan) ou collision continentale",
      "Formation de nouvelle croûte océanique",
      "Glissement latéral uniquement",
      "Aucune déformation"
    ],
    answer: "Subduction (océan-continent ou océan-océan) ou collision continentale",
    explanation: "Cela génère des chaînes de montagnes et des arcs volcaniques. Pourquoi ces zones sont-elles les plus actives sismiquement et volcaniquement ?"
  },
  {
    type: "qcm",
    question: "Les failles transformantes sont caractérisées par :",
    options: [
      "Un mouvement horizontal (cisaillement) sans création ni destruction de croûte",
      "La création de nouvelle croûte",
      "La destruction de croûte par subduction",
      "Uniquement des volcans"
    ],
    answer: "Un mouvement horizontal (cisaillement) sans création ni destruction de croûte",
    explanation: "Exemple : faille de San Andreas. Pourquoi ces failles produisent-elles de grands séismes ?"
  },
  {
    type: "qcm",
    question: "La preuve principale de l’expansion océanique est :",
    options: [
      "Le paléomagnétisme (anomalies magnétiques symétriques des deux côtés des dorsales)",
      "Uniquement les fossiles",
      "Les mesures gravimétriques",
      "Les roches sédimentaires"
    ],
    answer: "Le paléomagnétisme (anomalies magnétiques symétriques des deux côtés des dorsales)",
    explanation: "Inversion des pôles magnétiques. Pourquoi cette preuve a-t-elle été décisive pour accepter la tectonique des plaques ?"
  },
  {
    type: "qcm",
    question: "La subduction explique :",
    options: [
      "La formation des arcs volcaniques et des fosses océaniques",
      "L’expansion des océans",
      "Le glissement latéral des plaques",
      "La formation des dorsales"
    ],
    answer: "La formation des arcs volcaniques et des fosses océaniques",
    explanation: "La plaque plongeante fond partiellement. Pourquoi la subduction est-elle à l’origine de la majorité des séismes profonds ?"
  },
  {
    type: "qcm",
    question: "La collision continentale est responsable de :",
    options: [
      "La formation des grandes chaînes de montagnes (ex. : Himalaya)",
      "La création de nouvelle croûte océanique",
      "Les failles transformantes",
      "L’expansion océanique"
    ],
    answer: "La formation des grandes chaînes de montagnes (ex. : Himalaya)",
    explanation: "Aucune subduction possible entre deux continents. Pourquoi ce type de convergence produit-il des reliefs très élevés ?"
  },
  {
    type: "qcm",
    question: "La théorie de la Tectonique des Plaques a été proposée dans les années :",
    options: [
      "1960",
      "1910 (Wegener)",
      "1800",
      "2000"
    ],
    answer: "1960",
    explanation: "Après la dérive des continents de Wegener. Pourquoi cette théorie a-t-elle unifié de nombreuses observations géologiques ?"
  },
  {
    type: "qcm",
    question: "Le moteur principal de la tectonique des plaques est :",
    options: [
      "La chaleur interne de la Terre (radioactivité et chaleur résiduelle)",
      "La force du vent",
      "Les marées",
      "L’activité biologique"
    ],
    answer: "La chaleur interne de la Terre (radioactivité et chaleur résiduelle)",
    explanation: "Elle entraîne la convection mantellique. Pourquoi cette énergie interne est-elle essentielle à la dynamique terrestre ?"
  },
  {
    type: "qcm",
    question: "Les points chauds (hotspots) sont :",
    options: [
      "Des zones de remontée de magma fixe par rapport aux plaques",
      "Des limites de plaques convergentes",
      "Des zones de subduction",
      "Des failles transformantes"
    ],
    answer: "Des zones de remontée de magma fixe par rapport aux plaques",
    explanation: "Exemple : chaîne des îles Hawaii. Pourquoi ils permettent de reconstituer le mouvement des plaques ?"
  },
  {
    type: "qcm",
    question: "La lithosphère océanique est :",
    options: [
      "Plus dense et plus mince que la lithosphère continentale",
      "Plus épaisse et moins dense",
      "Absente sous les océans",
      "Toujours en expansion"
    ],
    answer: "Plus dense et plus mince que la lithosphère continentale",
    explanation: "Elle subducte plus facilement. Pourquoi cette différence est-elle clé dans le cycle de Wilson ?"
  },
  {
    type: "qcm",
    question: "La Tectonique des Plaques explique :",
    options: [
      "La distribution des séismes, volcans, chaînes de montagnes et dorsales",
      "Uniquement les roches sédimentaires",
      "Les variations climatiques",
      "La formation des minéraux uniquement"
    ],
    answer: "La distribution des séismes, volcans, chaînes de montagnes et dorsales",
    explanation: "Cadre global. Pourquoi cette théorie est-elle centrale en géodynamique interne ?"
  },
  {
    type: "qcm",
    question: "Globalement, la leçon sur la Tectonique des Plaques permet de comprendre :",
    options: [
      "Le fonctionnement dynamique de l’intérieur de la Terre et l’évolution de la surface",
      "Uniquement les méthodes d’étude",
      "Les minéraux isolément",
      "Les roches sédimentaires uniquement"
    ],
    answer: "Le fonctionnement dynamique de l’intérieur de la Terre et l’évolution de la surface",
    explanation: "Synthèse majeure du cours. Pourquoi cette leçon est-elle l’une des plus importantes en Géodynamique Interne ?"
  }
] }
     ]
    },
    {
      nom: "Biologie animale",
      pdfCours: null,
      sousMatieres: [
        { nom: "Introduction a la cytologie", quiz: [
  {
    type: "qcm",
    question: "Quel instrument a permis, dans les années 1950, de démontrer l'existence de deux types fondamentalement différents de cellules ?",
    options: [
      "Le microscope optique à contraste de phase.",
      "Le microscope électronique.",
      "Le microscope à fluorescence."
    ],
    answer: "Le microscope électronique.",
    explanation: "C'est l'avènement du MICROSCOPE ÉLECTRONIQUE dans les années 1950 qui a démontré que les bactéries et cyanobactéries possédaient un plan d'organisation fondamentalement différent des autres cellules — menant à la distinction procaryotes/eucaryotes. Le microscope optique (même à contraste de phase ou fluorescence) n'offre pas la résolution suffisante pour révéler cette différence ultrastructurale."
  },
  {
    type: "qcm",
    question: "Qui a proposé en premier les termes 'eucaryote' et 'procaryote', et quand ?",
    options: [
      "Schleiden et Schwann, en 1838-1839.",
      "E. Chatton, en 1920, mais l'idée ne fut acceptée que trente ans plus tard.",
      "Knoll et Ruska, en 1931, lors de l'invention du microscope électronique."
    ],
    answer: "E. Chatton, en 1920, mais l'idée ne fut acceptée que trente ans plus tard.",
    explanation: "Les termes EUCARYOTE et PROCARYOTE ont été proposés par E. CHATTON en 1920, mais cette distinction ne fut ACCEPTÉE que trente ans plus tard (années 1950), grâce aux observations en microscopie électronique. C'est un piège classique : l'idée précède de loin sa reconnaissance scientifique. SCHLEIDEN et SCHWANN ont formulé la théorie cellulaire (1838-1839) ; KNOLL et RUSKA ont inventé le microscope électronique (1931)."
  },
  {
    type: "qcm",
    question: "Quelle est la caractéristique fondamentale qui distingue une cellule procaryote d'une cellule eucaryote ?",
    options: [
      "La cellule procaryote est plus petite et ne possède pas de membrane plasmique.",
      "La cellule procaryote ne possède pas de noyau individualisé : son matériel génétique est en contact direct avec le cytoplasme.",
      "La cellule procaryote ne possède pas d'ADN, contrairement à la cellule eucaryote."
    ],
    answer: "La cellule procaryote ne possède pas de noyau individualisé : son matériel génétique est en contact direct avec le cytoplasme.",
    explanation: "La différence FONDAMENTALE est l'ABSENCE DE NOYAU INDIVIDUALISÉ chez les procaryotes : leur ADN est en contact direct avec le cytoplasme, sans enveloppe nucléaire. La taille est effectivement différente (1-10 µm vs 10-100 µm) mais ce n'est pas la caractéristique FONDAMENTALE. La cellule procaryote POSSÈDE bien de l'ADN — elle n'a simplement pas de noyau pour le contenir. L'absence de membrane plasmique est fausse : les procaryotes ont une membrane qui les délimite."
  },
  {
    type: "qcm",
    question: "Quelle est la taille moyenne d'une cellule procaryote ?",
    options: [
      "10 à 100 µm.",
      "1 à 10 µm.",
      "15 à 250 nm."
    ],
    answer: "1 à 10 µm.",
    explanation: "Les cellules PROCARYOTES mesurent en moyenne entre 1 et 10 µm. Les cellules EUCARYOTES mesurent entre 10 et 100 µm. Les VIRUS mesurent entre 15 et 250 nm — bien plus petits que les bactéries. Ces trois valeurs sont régulièrement interverties dans les QCM. Mémorise : virus (nm) < procaryotes (1-10 µm) < eucaryotes (10-100 µm)."
  },
  {
    type: "qcm",
    question: "Parmi les caractères généraux des cellules procaryotes, lesquels sont corrects ?",
    options: [
      "Présence d'organites internes spécialisés et de mouvements intracellulaires actifs.",
      "Forme en bâtonnets ou sphérique, absence d'organites internes, absence de mouvements intracellulaires.",
      "Présence d'un vrai noyau entouré d'une membrane et de mitochondries pour produire de l'énergie."
    ],
    answer: "Forme en bâtonnets ou sphérique, absence d'organites internes, absence de mouvements intracellulaires.",
    explanation: "Les procaryotes présentent une forme en BÂTONNETS (bacille) ou SPHÉRIQUE (coque), sont dépourvus d'ORGANITES internes et de MOUVEMENTS intracellulaires. Les seules membranes rencontrées sont celles qui les délimitent. La présence d'organites et de mouvements intracellulaires caractérise les EUCARYOTES. La présence d'un vrai noyau et de mitochondries caractérise exclusivement les EUCARYOTES."
  },
  {
    type: "qcm",
    question: "En quoi les Archées (Archébactéries) diffèrent-elles des Eubactéries ?",
    options: [
      "Les Archées colonisent des milieux particuliers extrêmes (ex. sources thermales) ; les Eubactéries sont les bactéries classiques classées selon la coloration de Gram.",
      "Les Archées possèdent un vrai noyau ; les Eubactéries sont de vraies procaryotes sans noyau.",
      "Les Archées sont des cellules eucaryotes unicellulaires ; les Eubactéries sont des procaryotes."
    ],
    answer: "Les Archées colonisent des milieux particuliers extrêmes (ex. sources thermales) ; les Eubactéries sont les bactéries classiques classées selon la coloration de Gram.",
    explanation: "Les ARCHÉES (Archébactéries) colonisent des milieux extrêmes comme les sources thermales (bactéries thermophiles). Les EUBACTÉRIES sont les bactéries classiques, classées en Gram+ et Gram- selon leur paroi bactérienne. Les DEUX sont des PROCARYOTES (sans vrai noyau). Le piège est d'attribuer un noyau aux Archées ou d'en faire des eucaryotes — c'est faux, les deux groupes sont procaryotes."
  },
  {
    type: "qcm",
    question: "Que révèle la coloration de Gram chez les Eubactéries ?",
    options: [
      "La présence ou l'absence de mitochondries dans la cellule bactérienne.",
      "Les propriétés de la paroi bactérienne, permettant de classer les bactéries en Gram+ et Gram-.",
      "La quantité d'ADN présente dans le cytoplasme bactérien."
    ],
    answer: "Les propriétés de la paroi bactérienne, permettant de classer les bactéries en Gram+ et Gram-.",
    explanation: "La COLORATION DE GRAM révèle les propriétés de la PAROI BACTÉRIENNE vis-à-vis de colorants spécifiques, permettant de classer les Eubactéries en GRAM+ et GRAM-. Cette classification a une importance médicale majeure (choix de l'antibiotique). Les mitochondries sont ABSENTES des procaryotes. La quantité d'ADN n'est pas révélée par la coloration de Gram."
  },
  {
    type: "qcm",
    question: "Quelle théorie explique l'origine des cellules eucaryotes selon le cours ?",
    options: [
      "La théorie de la génération spontanée.",
      "La théorie endosymbiotique.",
      "La théorie de la sélection naturelle de Darwin."
    ],
    answer: "La théorie endosymbiotique.",
    explanation: "La THÉORIE ENDOSYMBIOTIQUE est présentée dans le cours comme l'explication la plus plausible de l'origine des cellules EUCARYOTES. Elle postule que certains organites (mitochondries, chloroplastes) dérivent de bactéries ancestrales englobées par une cellule hôte. La GÉNÉRATION SPONTANÉE a été réfutée (Redi, Pasteur). La SÉLECTION NATURELLE est le mécanisme de l'évolution des espèces (Darwin) — un concept distinct de l'origine des eucaryotes."
  },
  {
    type: "qcm",
    question: "Les globules rouges des mammifères sont-ils des cellules eucaryotes ?",
    options: [
      "Non, ce sont des procaryotes car ils n'ont pas de noyau.",
      "Oui, ce sont des cellules eucaryotes, mais anucléées par perte de leur noyau initial au cours de leur maturation.",
      "Non, ce sont des virus car ils sont dépourvus de noyau et de membrane plasmique."
    ],
    answer: "Oui, ce sont des cellules eucaryotes, mais anucléées par perte de leur noyau initial au cours de leur maturation.",
    explanation: "Les GLOBULES ROUGES (érythrocytes) des mammifères sont des EUCARYOTES ANUCLÉÉS : ils perdent leur noyau au cours de leur maturation. Ils ne sont donc PAS des procaryotes (l'absence de noyau ne suffit pas à faire d'une cellule un procaryote). Ils ne sont pas des VIRUS non plus : ils ont une membrane plasmique et un cytoplasme. C'est un piège classique qui teste la compréhension de la distinction procaryote/eucaryote."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qu'un syncytium ?",
    options: [
      "Une cellule eucaryote avec un très grand noyau unique.",
      "Un territoire cytoplasmique présentant plusieurs noyaux, comme les cellules musculaires striées squelettiques.",
      "Une bactérie qui possède un cytoplasme commun avec une cellule hôte."
    ],
    answer: "Un territoire cytoplasmique présentant plusieurs noyaux, comme les cellules musculaires striées squelettiques.",
    explanation: "Un SYNCYTIUM est un territoire cytoplasmique qui présente PLUSIEURS NOYAUX dans un même espace — exemple classique : les cellules MUSCULAIRES STRIÉES SQUELETTIQUES. Ce n'est pas simplement un grand noyau unique : c'est bien plusieurs noyaux dans un cytoplasme continu. Ne pas confondre avec le PLASMODE (plusieurs noyaux résultant d'une amitose sans division du cytoplasme) — concept vu en reproduction asexuée."
  },
  {
    type: "qcm",
    question: "Quelle est la taille habituelle d'une cellule eucaryote ?",
    options: [
      "1 à 10 µm.",
      "15 à 250 nm.",
      "10 à 100 µm."
    ],
    answer: "10 à 100 µm.",
    explanation: "Les cellules EUCARYOTES mesurent généralement entre 10 et 100 µm. Les cellules PROCARYOTES mesurent entre 1 et 10 µm. Les VIRUS mesurent entre 15 et 250 nm. Ces valeurs sont inversées dans les pièges classiques. Retiens l'ordre croissant : virus (nm) < procaryotes (µm, petits) < eucaryotes (µm, grands)."
  },
  {
    type: "qcm",
    question: "Parmi les structures suivantes, lesquelles ne sont visibles qu'au microscope électronique (ultrastructures) ?",
    options: [
      "Noyau, nucléole, mitochondries.",
      "Lysosomes, peroxysomes, ribosomes, centrioles.",
      "Membrane plasmique, appareil de Golgi, réticulum endoplasmique."
    ],
    answer: "Lysosomes, peroxysomes, ribosomes, centrioles.",
    explanation: "Les ULTRASTRUCTURES observables uniquement au MICROSCOPE ÉLECTRONIQUE sont : lysosomes, peroxysomes, endosomes, vésicules d'endocytose, RIBOSOMES, centrioles. Le NOYAU, le NUCLÉOLE et les MITOCHONDRIES peuvent être observés au microscope optique après coloration. L'APPAREIL DE GOLGI et le RE sont également des ultrastructures — mais la liste du cours cite explicitement lysosomes, peroxysomes, ribosomes, centrioles comme exemples."
  },
  {
    type: "qcm",
    question: "Quelle est la composition chimique de l'eau, et pourquoi est-elle dite 'polaire' ?",
    options: [
      "L'eau est composée de C, H et O ; elle est polaire car elle contient du carbone chargé.",
      "L'eau est composée d'un atome d'O lié à deux atomes d'H ; elle est polaire car l'O attire le nuage électronique, créant une charge partielle négative sur O et positive sur les H.",
      "L'eau est composée d'un atome d'H lié à deux atomes d'O ; elle est polaire car les O sont chargés positivement."
    ],
    answer: "L'eau est composée d'un atome d'O lié à deux atomes d'H ; elle est polaire car l'O attire le nuage électronique, créant une charge partielle négative sur O et positive sur les H.",
    explanation: "L'eau (PM = 18) est composée d'UN ATOME D'OXYGÈNE lié par liaisons covalentes à DEUX ATOMES D'HYDROGÈNE. Elle est POLAIRE car l'oxygène attire le nuage électronique vers lui → charge partielle NÉGATIVE sur O, charge partielle POSITIVE sur les H. Cette polarité explique ses propriétés de solvant (attire les molécules polaires et les ions). Elle ne contient PAS de carbone (C est l'élément des molécules organiques)."
  },
  {
    type: "qcm",
    question: "Quelle proportion l'eau représente-t-elle dans la matière vivante ?",
    options: [
      "Environ 25% de la matière vivante.",
      "Environ 75% de la matière vivante.",
      "Moins de 10% de la matière vivante."
    ],
    answer: "Environ 75% de la matière vivante.",
    explanation: "L'eau représente environ 75% de la MATIÈRE VIVANTE (le cours dit qu'elle 'avoisine les 75%' et 'dépasse en général les 60%'). C'est la molécule la plus abondante dans les cellules vivantes. Ce chiffre est un repère fondamental à mémoriser. Les deux autres options sont des pièges qui inversent ou minimisent cette valeur."
  },
  {
    type: "qcm",
    question: "Quels sont les 4 rôles de l'eau dans la cellule selon le cours ?",
    options: [
      "Solvant, milieu des réactions biologiques, substrat ou produit de réactions (ex. hydrolyse), stabilisation des structures cellulaires.",
      "Production d'énergie (ATP), transport de l'oxygène, digestion des protéines, stockage des glucides.",
      "Synthèse des lipides, régulation du pH, formation des chromosomes, protection contre les virus."
    ],
    answer: "Solvant, milieu des réactions biologiques, substrat ou produit de réactions (ex. hydrolyse), stabilisation des structures cellulaires.",
    explanation: "Selon le cours, l'eau joue 4 rôles : (1) SOLVANT de nombreuses substances cellulaires ; (2) MILIEU de la quasi-totalité des réactions biologiques ; (3) Participe comme SUBSTRAT ou PRODUIT dans certaines réactions (ex. hydrolyse) ; (4) Contribue à STABILISER des structures cellulaires comme les membranes. La production d'ATP, la digestion et la synthèse des lipides sont des fonctions d'autres molécules ou organites."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre macroéléments et oligoéléments minéraux ?",
    options: [
      "Les macroéléments sont organiques (à base de carbone) ; les oligoéléments sont minéraux (sans carbone).",
      "Les macroéléments (Ca, P, K, Cl, Na, Mg) sont présents en grandes quantités ; les oligoéléments (Fe, Zn, Cu, I...) sont présents en très faibles quantités (traces).",
      "Les macroéléments sont uniquement présents dans les os ; les oligoéléments uniquement dans le sang."
    ],
    answer: "Les macroéléments (Ca, P, K, Cl, Na, Mg) sont présents en grandes quantités ; les oligoéléments (Fe, Zn, Cu, I...) sont présents en très faibles quantités (traces).",
    explanation: "La distinction macroéléments/oligoéléments repose sur les QUANTITÉS mises en jeu : MACROÉLÉMENTS (Ca, P, K, Cl, Na, Mg) en grandes quantités ; OLIGOÉLÉMENTS (Fe, Zn, Cu, Mn, I, Mo...) en traces. Les deux sont des minéraux INORGANIQUES (sans carbone) — la première option est fausse. Leur localisation dans l'organisme n'est pas limitée aux os ou au sang — ils ont des rôles variés (enzymes, hormones, pH, osmose...)."
  },
  {
    type: "qcm",
    question: "Quelle est la formule brute générale des glucides, et de quels éléments sont-ils composés ?",
    options: [
      "(CH2O)n ; ils sont composés de C, H et O uniquement (corps ternaires).",
      "CH3-(CH2)n-COOH ; ils contiennent C, H, O et parfois P ou N.",
      "C, H, O, N et S ; ce sont des corps quaternaires comme les protéines."
    ],
    answer: "(CH2O)n ; ils sont composés de C, H et O uniquement (corps ternaires).",
    explanation: "Les GLUCIDES ont la formule brute (CH2O)n et sont des corps TERNAIRES (C, H, O uniquement). La formule CH3-(CH2)n-COOH est celle des LIPIDES (acides gras). Les corps contenant C, H, O, N et S sont les PROTÉINES (corps quaternaires). Les glucides jouent des rôles dans la constitution de la matière vivante (acides nucléiques, paroi), la reconnaissance cellulaire et les réserves énergétiques."
  },
  {
    type: "qcm",
    question: "Quelle propriété physique caractérise les lipides, les distinguant notamment des glucides ?",
    options: [
      "Les lipides sont solubles dans l'eau et insolubles dans les solvants organiques.",
      "Les lipides sont insolubles dans l'eau (hydrophobes ou amphiphiles) et solubles dans les solvants organiques apolaires.",
      "Les lipides sont des corps quaternaires contenant obligatoirement du phosphore et de l'azote."
    ],
    answer: "Les lipides sont insolubles dans l'eau (hydrophobes ou amphiphiles) et solubles dans les solvants organiques apolaires.",
    explanation: "Les LIPIDES sont INSOLUBLES dans l'eau (hydrophobes ou amphiphiles) et SOLUBLES dans les solvants organiques apolaires (alcool, benzène, éther, chloroforme). C'est l'inverse des glucides et protéines qui sont solubles dans l'eau. Les lipides complexes peuvent contenir du phosphore ou de l'azote, mais ce n'est pas obligatoire pour tous les lipides — les lipides SIMPLES sont uniquement ternaires (C, H, O)."
  },
  {
    type: "qcm",
    question: "Quels éléments chimiques composent les protéines (protides) ?",
    options: [
      "Uniquement C, H et O — comme les glucides.",
      "C, H, O et N, avec toujours un peu de soufre (S) et parfois du phosphore (P).",
      "Uniquement des acides aminés sans atomes de carbone."
    ],
    answer: "C, H, O et N, avec toujours un peu de soufre (S) et parfois du phosphore (P).",
    explanation: "Les PROTÉINES sont des corps QUATERNAIRES composés de C, H, O et N, avec TOUJOURS un peu de SOUFRE (S) et quelques autres éléments comme le phosphore. C'est la présence de l'AZOTE (N) qui les distingue des glucides et des lipides simples (ternaires). Les acides aminés — leurs constituants de base — contiennent bien du carbone : ils ont une fonction acide (-COOH) et une fonction amine (-NH2), toutes deux carbonées."
  },
  {
    type: "qcm",
    question: "Quelle est la taille des virus, et en quoi diffèrent-ils fondamentalement des cellules procaryotes ?",
    options: [
      "Les virus mesurent 1 à 10 µm comme les bactéries ; ils diffèrent par l'absence de cytoplasme uniquement.",
      "Les virus mesurent 15 à 250 nm, bien plus petits que les bactéries ; ils sont dépourvus de structures cellulaires essentielles (membrane plasmique, hyaloplasme, ribosomes) et ne peuvent se reproduire qu'en utilisant la machinerie d'une cellule hôte.",
      "Les virus mesurent 10 à 100 µm comme les eucaryotes ; ils diffèrent par leur ADN double brin uniquement."
    ],
    answer: "Les virus mesurent 15 à 250 nm, bien plus petits que les bactéries ; ils sont dépourvus de structures cellulaires essentielles (membrane plasmique, hyaloplasme, ribosomes) et ne peuvent se reproduire qu'en utilisant la machinerie d'une cellule hôte.",
    explanation: "Les VIRUS mesurent 15 à 250 nm (bien plus petits que les bactéries : 1-10 µm). Ils sont constitués d'un MATÉRIEL GÉNÉTIQUE (ADN ou ARN) + une COQUE PROTÉIQUE. Ils sont dépourvus de membrane plasmique, d'hyaloplasme et de ribosomes — donc PAS des cellules. Ils sont INACTIFS hors de la cellule hôte et ne peuvent se reproduire qu'en utilisant la machinerie cellulaire d'un hôte. Ce n'est pas uniquement l'absence de cytoplasme qui les définit — c'est l'ensemble de ces caractères."
  }
]
 },
        { nom: "Presentation de la cellule", quiz: [
  {
    type: "qcm",
    question: "Quel instrument a permis, dans les années 1950, de démontrer l'existence de deux types fondamentalement différents de cellules ?",
    options: [
      "Le microscope optique à contraste de phase.",
      "Le microscope électronique.",
      "Le microscope à fluorescence."
    ],
    answer: "Le microscope électronique.",
    explanation: "C'est l'avènement du MICROSCOPE ÉLECTRONIQUE dans les années 1950 qui a démontré que les bactéries et cyanobactéries possédaient un plan d'organisation fondamentalement différent des autres cellules — menant à la distinction procaryotes/eucaryotes. Le microscope optique (même à contraste de phase ou fluorescence) n'offre pas la résolution suffisante pour révéler cette différence ultrastructurale."
  },
  {
    type: "qcm",
    question: "Qui a proposé en premier les termes 'eucaryote' et 'procaryote', et quand ?",
    options: [
      "Schleiden et Schwann, en 1838-1839.",
      "E. Chatton, en 1920, mais l'idée ne fut acceptée que trente ans plus tard.",
      "Knoll et Ruska, en 1931, lors de l'invention du microscope électronique."
    ],
    answer: "E. Chatton, en 1920, mais l'idée ne fut acceptée que trente ans plus tard.",
    explanation: "Les termes EUCARYOTE et PROCARYOTE ont été proposés par E. CHATTON en 1920, mais cette distinction ne fut ACCEPTÉE que trente ans plus tard (années 1950), grâce aux observations en microscopie électronique. C'est un piège classique : l'idée précède de loin sa reconnaissance scientifique. SCHLEIDEN et SCHWANN ont formulé la théorie cellulaire (1838-1839) ; KNOLL et RUSKA ont inventé le microscope électronique (1931)."
  },
  {
    type: "qcm",
    question: "Quelle est la caractéristique fondamentale qui distingue une cellule procaryote d'une cellule eucaryote ?",
    options: [
      "La cellule procaryote est plus petite et ne possède pas de membrane plasmique.",
      "La cellule procaryote ne possède pas de noyau individualisé : son matériel génétique est en contact direct avec le cytoplasme.",
      "La cellule procaryote ne possède pas d'ADN, contrairement à la cellule eucaryote."
    ],
    answer: "La cellule procaryote ne possède pas de noyau individualisé : son matériel génétique est en contact direct avec le cytoplasme.",
    explanation: "La différence FONDAMENTALE est l'ABSENCE DE NOYAU INDIVIDUALISÉ chez les procaryotes : leur ADN est en contact direct avec le cytoplasme, sans enveloppe nucléaire. La taille est effectivement différente (1-10 µm vs 10-100 µm) mais ce n'est pas la caractéristique FONDAMENTALE. La cellule procaryote POSSÈDE bien de l'ADN — elle n'a simplement pas de noyau pour le contenir. L'absence de membrane plasmique est fausse : les procaryotes ont une membrane qui les délimite."
  },
  {
    type: "qcm",
    question: "Quelle est la taille moyenne d'une cellule procaryote ?",
    options: [
      "10 à 100 µm.",
      "1 à 10 µm.",
      "15 à 250 nm."
    ],
    answer: "1 à 10 µm.",
    explanation: "Les cellules PROCARYOTES mesurent en moyenne entre 1 et 10 µm. Les cellules EUCARYOTES mesurent entre 10 et 100 µm. Les VIRUS mesurent entre 15 et 250 nm — bien plus petits que les bactéries. Ces trois valeurs sont régulièrement interverties dans les QCM. Mémorise : virus (nm) < procaryotes (1-10 µm) < eucaryotes (10-100 µm)."
  },
  {
    type: "qcm",
    question: "Parmi les caractères généraux des cellules procaryotes, lesquels sont corrects ?",
    options: [
      "Présence d'organites internes spécialisés et de mouvements intracellulaires actifs.",
      "Forme en bâtonnets ou sphérique, absence d'organites internes, absence de mouvements intracellulaires.",
      "Présence d'un vrai noyau entouré d'une membrane et de mitochondries pour produire de l'énergie."
    ],
    answer: "Forme en bâtonnets ou sphérique, absence d'organites internes, absence de mouvements intracellulaires.",
    explanation: "Les procaryotes présentent une forme en BÂTONNETS (bacille) ou SPHÉRIQUE (coque), sont dépourvus d'ORGANITES internes et de MOUVEMENTS intracellulaires. Les seules membranes rencontrées sont celles qui les délimitent. La présence d'organites et de mouvements intracellulaires caractérise les EUCARYOTES. La présence d'un vrai noyau et de mitochondries caractérise exclusivement les EUCARYOTES."
  },
  {
    type: "qcm",
    question: "En quoi les Archées (Archébactéries) diffèrent-elles des Eubactéries ?",
    options: [
      "Les Archées colonisent des milieux particuliers extrêmes (ex. sources thermales) ; les Eubactéries sont les bactéries classiques classées selon la coloration de Gram.",
      "Les Archées possèdent un vrai noyau ; les Eubactéries sont de vraies procaryotes sans noyau.",
      "Les Archées sont des cellules eucaryotes unicellulaires ; les Eubactéries sont des procaryotes."
    ],
    answer: "Les Archées colonisent des milieux particuliers extrêmes (ex. sources thermales) ; les Eubactéries sont les bactéries classiques classées selon la coloration de Gram.",
    explanation: "Les ARCHÉES (Archébactéries) colonisent des milieux extrêmes comme les sources thermales (bactéries thermophiles). Les EUBACTÉRIES sont les bactéries classiques, classées en Gram+ et Gram- selon leur paroi bactérienne. Les DEUX sont des PROCARYOTES (sans vrai noyau). Le piège est d'attribuer un noyau aux Archées ou d'en faire des eucaryotes — c'est faux, les deux groupes sont procaryotes."
  },
  {
    type: "qcm",
    question: "Que révèle la coloration de Gram chez les Eubactéries ?",
    options: [
      "La présence ou l'absence de mitochondries dans la cellule bactérienne.",
      "Les propriétés de la paroi bactérienne, permettant de classer les bactéries en Gram+ et Gram-.",
      "La quantité d'ADN présente dans le cytoplasme bactérien."
    ],
    answer: "Les propriétés de la paroi bactérienne, permettant de classer les bactéries en Gram+ et Gram-.",
    explanation: "La COLORATION DE GRAM révèle les propriétés de la PAROI BACTÉRIENNE vis-à-vis de colorants spécifiques, permettant de classer les Eubactéries en GRAM+ et GRAM-. Cette classification a une importance médicale majeure (choix de l'antibiotique). Les mitochondries sont ABSENTES des procaryotes. La quantité d'ADN n'est pas révélée par la coloration de Gram."
  },
  {
    type: "qcm",
    question: "Quelle théorie explique l'origine des cellules eucaryotes selon le cours ?",
    options: [
      "La théorie de la génération spontanée.",
      "La théorie endosymbiotique.",
      "La théorie de la sélection naturelle de Darwin."
    ],
    answer: "La théorie endosymbiotique.",
    explanation: "La THÉORIE ENDOSYMBIOTIQUE est présentée dans le cours comme l'explication la plus plausible de l'origine des cellules EUCARYOTES. Elle postule que certains organites (mitochondries, chloroplastes) dérivent de bactéries ancestrales englobées par une cellule hôte. La GÉNÉRATION SPONTANÉE a été réfutée (Redi, Pasteur). La SÉLECTION NATURELLE est le mécanisme de l'évolution des espèces (Darwin) — un concept distinct de l'origine des eucaryotes."
  },
  {
    type: "qcm",
    question: "Les globules rouges des mammifères sont-ils des cellules eucaryotes ?",
    options: [
      "Non, ce sont des procaryotes car ils n'ont pas de noyau.",
      "Oui, ce sont des cellules eucaryotes, mais anucléées par perte de leur noyau initial au cours de leur maturation.",
      "Non, ce sont des virus car ils sont dépourvus de noyau et de membrane plasmique."
    ],
    answer: "Oui, ce sont des cellules eucaryotes, mais anucléées par perte de leur noyau initial au cours de leur maturation.",
    explanation: "Les GLOBULES ROUGES (érythrocytes) des mammifères sont des EUCARYOTES ANUCLÉÉS : ils perdent leur noyau au cours de leur maturation. Ils ne sont donc PAS des procaryotes (l'absence de noyau ne suffit pas à faire d'une cellule un procaryote). Ils ne sont pas des VIRUS non plus : ils ont une membrane plasmique et un cytoplasme. C'est un piège classique qui teste la compréhension de la distinction procaryote/eucaryote."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qu'un syncytium ?",
    options: [
      "Une cellule eucaryote avec un très grand noyau unique.",
      "Un territoire cytoplasmique présentant plusieurs noyaux, comme les cellules musculaires striées squelettiques.",
      "Une bactérie qui possède un cytoplasme commun avec une cellule hôte."
    ],
    answer: "Un territoire cytoplasmique présentant plusieurs noyaux, comme les cellules musculaires striées squelettiques.",
    explanation: "Un SYNCYTIUM est un territoire cytoplasmique qui présente PLUSIEURS NOYAUX dans un même espace — exemple classique : les cellules MUSCULAIRES STRIÉES SQUELETTIQUES. Ce n'est pas simplement un grand noyau unique : c'est bien plusieurs noyaux dans un cytoplasme continu. Ne pas confondre avec le PLASMODE (plusieurs noyaux résultant d'une amitose sans division du cytoplasme) — concept vu en reproduction asexuée."
  },
  {
    type: "qcm",
    question: "Quelle est la taille habituelle d'une cellule eucaryote ?",
    options: [
      "1 à 10 µm.",
      "15 à 250 nm.",
      "10 à 100 µm."
    ],
    answer: "10 à 100 µm.",
    explanation: "Les cellules EUCARYOTES mesurent généralement entre 10 et 100 µm. Les cellules PROCARYOTES mesurent entre 1 et 10 µm. Les VIRUS mesurent entre 15 et 250 nm. Ces valeurs sont inversées dans les pièges classiques. Retiens l'ordre croissant : virus (nm) < procaryotes (µm, petits) < eucaryotes (µm, grands)."
  },
  {
    type: "qcm",
    question: "Parmi les structures suivantes, lesquelles ne sont visibles qu'au microscope électronique (ultrastructures) ?",
    options: [
      "Noyau, nucléole, mitochondries.",
      "Lysosomes, peroxysomes, ribosomes, centrioles.",
      "Membrane plasmique, appareil de Golgi, réticulum endoplasmique."
    ],
    answer: "Lysosomes, peroxysomes, ribosomes, centrioles.",
    explanation: "Les ULTRASTRUCTURES observables uniquement au MICROSCOPE ÉLECTRONIQUE sont : lysosomes, peroxysomes, endosomes, vésicules d'endocytose, RIBOSOMES, centrioles. Le NOYAU, le NUCLÉOLE et les MITOCHONDRIES peuvent être observés au microscope optique après coloration. L'APPAREIL DE GOLGI et le RE sont également des ultrastructures — mais la liste du cours cite explicitement lysosomes, peroxysomes, ribosomes, centrioles comme exemples."
  },
  {
    type: "qcm",
    question: "Quelle est la composition chimique de l'eau, et pourquoi est-elle dite 'polaire' ?",
    options: [
      "L'eau est composée de C, H et O ; elle est polaire car elle contient du carbone chargé.",
      "L'eau est composée d'un atome d'O lié à deux atomes d'H ; elle est polaire car l'O attire le nuage électronique, créant une charge partielle négative sur O et positive sur les H.",
      "L'eau est composée d'un atome d'H lié à deux atomes d'O ; elle est polaire car les O sont chargés positivement."
    ],
    answer: "L'eau est composée d'un atome d'O lié à deux atomes d'H ; elle est polaire car l'O attire le nuage électronique, créant une charge partielle négative sur O et positive sur les H.",
    explanation: "L'eau (PM = 18) est composée d'UN ATOME D'OXYGÈNE lié par liaisons covalentes à DEUX ATOMES D'HYDROGÈNE. Elle est POLAIRE car l'oxygène attire le nuage électronique vers lui → charge partielle NÉGATIVE sur O, charge partielle POSITIVE sur les H. Cette polarité explique ses propriétés de solvant (attire les molécules polaires et les ions). Elle ne contient PAS de carbone (C est l'élément des molécules organiques)."
  },
  {
    type: "qcm",
    question: "Quelle proportion l'eau représente-t-elle dans la matière vivante ?",
    options: [
      "Environ 25% de la matière vivante.",
      "Environ 75% de la matière vivante.",
      "Moins de 10% de la matière vivante."
    ],
    answer: "Environ 75% de la matière vivante.",
    explanation: "L'eau représente environ 75% de la MATIÈRE VIVANTE (le cours dit qu'elle 'avoisine les 75%' et 'dépasse en général les 60%'). C'est la molécule la plus abondante dans les cellules vivantes. Ce chiffre est un repère fondamental à mémoriser. Les deux autres options sont des pièges qui inversent ou minimisent cette valeur."
  },
  {
    type: "qcm",
    question: "Quels sont les 4 rôles de l'eau dans la cellule selon le cours ?",
    options: [
      "Solvant, milieu des réactions biologiques, substrat ou produit de réactions (ex. hydrolyse), stabilisation des structures cellulaires.",
      "Production d'énergie (ATP), transport de l'oxygène, digestion des protéines, stockage des glucides.",
      "Synthèse des lipides, régulation du pH, formation des chromosomes, protection contre les virus."
    ],
    answer: "Solvant, milieu des réactions biologiques, substrat ou produit de réactions (ex. hydrolyse), stabilisation des structures cellulaires.",
    explanation: "Selon le cours, l'eau joue 4 rôles : (1) SOLVANT de nombreuses substances cellulaires ; (2) MILIEU de la quasi-totalité des réactions biologiques ; (3) Participe comme SUBSTRAT ou PRODUIT dans certaines réactions (ex. hydrolyse) ; (4) Contribue à STABILISER des structures cellulaires comme les membranes. La production d'ATP, la digestion et la synthèse des lipides sont des fonctions d'autres molécules ou organites."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre macroéléments et oligoéléments minéraux ?",
    options: [
      "Les macroéléments sont organiques (à base de carbone) ; les oligoéléments sont minéraux (sans carbone).",
      "Les macroéléments (Ca, P, K, Cl, Na, Mg) sont présents en grandes quantités ; les oligoéléments (Fe, Zn, Cu, I...) sont présents en très faibles quantités (traces).",
      "Les macroéléments sont uniquement présents dans les os ; les oligoéléments uniquement dans le sang."
    ],
    answer: "Les macroéléments (Ca, P, K, Cl, Na, Mg) sont présents en grandes quantités ; les oligoéléments (Fe, Zn, Cu, I...) sont présents en très faibles quantités (traces).",
    explanation: "La distinction macroéléments/oligoéléments repose sur les QUANTITÉS mises en jeu : MACROÉLÉMENTS (Ca, P, K, Cl, Na, Mg) en grandes quantités ; OLIGOÉLÉMENTS (Fe, Zn, Cu, Mn, I, Mo...) en traces. Les deux sont des minéraux INORGANIQUES (sans carbone) — la première option est fausse. Leur localisation dans l'organisme n'est pas limitée aux os ou au sang — ils ont des rôles variés (enzymes, hormones, pH, osmose...)."
  },
  {
    type: "qcm",
    question: "Quelle est la formule brute générale des glucides, et de quels éléments sont-ils composés ?",
    options: [
      "(CH2O)n ; ils sont composés de C, H et O uniquement (corps ternaires).",
      "CH3-(CH2)n-COOH ; ils contiennent C, H, O et parfois P ou N.",
      "C, H, O, N et S ; ce sont des corps quaternaires comme les protéines."
    ],
    answer: "(CH2O)n ; ils sont composés de C, H et O uniquement (corps ternaires).",
    explanation: "Les GLUCIDES ont la formule brute (CH2O)n et sont des corps TERNAIRES (C, H, O uniquement). La formule CH3-(CH2)n-COOH est celle des LIPIDES (acides gras). Les corps contenant C, H, O, N et S sont les PROTÉINES (corps quaternaires). Les glucides jouent des rôles dans la constitution de la matière vivante (acides nucléiques, paroi), la reconnaissance cellulaire et les réserves énergétiques."
  },
  {
    type: "qcm",
    question: "Quelle propriété physique caractérise les lipides, les distinguant notamment des glucides ?",
    options: [
      "Les lipides sont solubles dans l'eau et insolubles dans les solvants organiques.",
      "Les lipides sont insolubles dans l'eau (hydrophobes ou amphiphiles) et solubles dans les solvants organiques apolaires.",
      "Les lipides sont des corps quaternaires contenant obligatoirement du phosphore et de l'azote."
    ],
    answer: "Les lipides sont insolubles dans l'eau (hydrophobes ou amphiphiles) et solubles dans les solvants organiques apolaires.",
    explanation: "Les LIPIDES sont INSOLUBLES dans l'eau (hydrophobes ou amphiphiles) et SOLUBLES dans les solvants organiques apolaires (alcool, benzène, éther, chloroforme). C'est l'inverse des glucides et protéines qui sont solubles dans l'eau. Les lipides complexes peuvent contenir du phosphore ou de l'azote, mais ce n'est pas obligatoire pour tous les lipides — les lipides SIMPLES sont uniquement ternaires (C, H, O)."
  },
  {
    type: "qcm",
    question: "Quels éléments chimiques composent les protéines (protides) ?",
    options: [
      "Uniquement C, H et O — comme les glucides.",
      "C, H, O et N, avec toujours un peu de soufre (S) et parfois du phosphore (P).",
      "Uniquement des acides aminés sans atomes de carbone."
    ],
    answer: "C, H, O et N, avec toujours un peu de soufre (S) et parfois du phosphore (P).",
    explanation: "Les PROTÉINES sont des corps QUATERNAIRES composés de C, H, O et N, avec TOUJOURS un peu de SOUFRE (S) et quelques autres éléments comme le phosphore. C'est la présence de l'AZOTE (N) qui les distingue des glucides et des lipides simples (ternaires). Les acides aminés — leurs constituants de base — contiennent bien du carbone : ils ont une fonction acide (-COOH) et une fonction amine (-NH2), toutes deux carbonées."
  },
  {
    type: "qcm",
    question: "Quelle est la taille des virus, et en quoi diffèrent-ils fondamentalement des cellules procaryotes ?",
    options: [
      "Les virus mesurent 1 à 10 µm comme les bactéries ; ils diffèrent par l'absence de cytoplasme uniquement.",
      "Les virus mesurent 15 à 250 nm, bien plus petits que les bactéries ; ils sont dépourvus de structures cellulaires essentielles (membrane plasmique, hyaloplasme, ribosomes) et ne peuvent se reproduire qu'en utilisant la machinerie d'une cellule hôte.",
      "Les virus mesurent 10 à 100 µm comme les eucaryotes ; ils diffèrent par leur ADN double brin uniquement."
    ],
    answer: "Les virus mesurent 15 à 250 nm, bien plus petits que les bactéries ; ils sont dépourvus de structures cellulaires essentielles (membrane plasmique, hyaloplasme, ribosomes) et ne peuvent se reproduire qu'en utilisant la machinerie d'une cellule hôte.",
    explanation: "Les VIRUS mesurent 15 à 250 nm (bien plus petits que les bactéries : 1-10 µm). Ils sont constitués d'un MATÉRIEL GÉNÉTIQUE (ADN ou ARN) + une COQUE PROTÉIQUE. Ils sont dépourvus de membrane plasmique, d'hyaloplasme et de ribosomes — donc PAS des cellules. Ils sont INACTIFS hors de la cellule hôte et ne peuvent se reproduire qu'en utilisant la machinerie cellulaire d'un hôte. Ce n'est pas uniquement l'absence de cytoplasme qui les définit — c'est l'ensemble de ces caractères."
  }
] },
        { nom: "Methode d'etude de la cellule", quiz: [
  {
    type: "qcm",
    question: "Quel est le principe commun au microscope optique (MO) et au microscope électronique (ME) ?",
    options: [
      "Les deux utilisent un faisceau de photons dévié par des lentilles en verre pour former une image agrandie.",
      "La déviation d'un flux de particules traversant l'objet à observer, en utilisant respectivement des photons et des électrons.",
      "Les deux produisent des images en noir et blanc grâce à des lentilles magnétiques."
    ],
    answer: "La déviation d'un flux de particules traversant l'objet à observer, en utilisant respectivement des photons et des électrons.",
    explanation: "Le MO et le ME partagent le MÊME PRINCIPE : la déviation d'un flux de particules traversant l'objet à observer. Ce qui les distingue, c'est la NATURE des particules utilisées : PHOTONS pour le MO, ÉLECTRONS pour le ME. La première option est fausse car elle attribue les photons aux DEUX microscopes. La troisième option est fausse car les images en noir et blanc et les lentilles magnétiques caractérisent uniquement le ME."
  },
  {
    type: "qcm",
    question: "Quelle est la source d'éclairage du microscope optique, et quelle est celle du microscope électronique ?",
    options: [
      "MO : filament (électrons) / ME : lampe (photons).",
      "MO : lampe (photons) / ME : filament (électrons).",
      "MO et ME : les deux utilisent une lampe à photons, mais de puissance différente."
    ],
    answer: "MO : lampe (photons) / ME : filament (électrons).",
    explanation: "Le MO est éclairé par une LAMPE produisant des PHOTONS (lumière visible). Le ME est éclairé par un FILAMENT produisant des ÉLECTRONS. C'est un piège classique d'inversion. Les électrons ont une longueur d'onde beaucoup plus courte que les photons, ce qui explique le pouvoir séparateur bien supérieur du ME."
  },
  {
    type: "qcm",
    question: "Quel est le pouvoir séparateur du microscope optique, et que signifie cette valeur ?",
    options: [
      "0,2 µm : c'est la plus petite distance entre deux points que le MO peut distinguer comme séparés.",
      "4 Å : c'est la résolution maximale du MO en conditions optimales de coloration.",
      "×1000 : c'est le grossissement maximal du MO, qui correspond aussi à son pouvoir séparateur."
    ],
    answer: "0,2 µm : c'est la plus petite distance entre deux points que le MO peut distinguer comme séparés.",
    explanation: "Le POUVOIR SÉPARATEUR du MO est de 0,2 µm, ce qui signifie que deux points séparés par moins de 0,2 µm apparaîtront fusionnés. Le pouvoir séparateur du ME est de 4 Å (= 0,4 nm), soit environ 500 fois supérieur. Le GROSSISSEMENT (×25 à ×1000 pour le MO) est un concept différent du pouvoir séparateur — un fort grossissement avec un mauvais pouvoir séparateur donne une image grande mais floue."
  },
  {
    type: "qcm",
    question: "Quel est le grossissement maximal du microscope électronique ?",
    options: [
      "×25 à ×1000.",
      "×1000 à plus de ×1 000 000.",
      "×8000 uniquement, valeur fixe depuis son invention en 1931."
    ],
    answer: "×1000 à plus de ×1 000 000.",
    explanation: "Le ME offre un grossissement de ×1000 à plus d'×1 000 000. Le MO offre ×25 à ×1000. La valeur ×8000 citée dans le chapitre I est le grossissement du PREMIER microscope électronique (Knoll et Ruska, 1931) — ce n'est pas la valeur actuelle ni fixe. La troisième option est donc un piège historique."
  },
  {
    type: "qcm",
    question: "Quel type de lentilles utilise le microscope électronique, et pourquoi est-ce différent du microscope optique ?",
    options: [
      "Des lentilles en verre, comme le MO, mais de plus grande puissance.",
      "Des lentilles magnétiques, car les électrons (contrairement aux photons) sont déviés par les champs magnétiques.",
      "Des lentilles en cristal liquide, permettant de moduler la déviation des électrons en temps réel."
    ],
    answer: "Des lentilles magnétiques, car les électrons (contrairement aux photons) sont déviés par les champs magnétiques.",
    explanation: "Le ME utilise des LENTILLES MAGNÉTIQUES car les ÉLECTRONS (particules chargées) sont déviés par les champs magnétiques — contrairement aux photons (lumière) qui sont déviés par des lentilles EN VERRE dans le MO. C'est une conséquence directe de la nature différente des particules utilisées. Les lentilles en cristal liquide n'existent pas dans ce contexte."
  },
  {
    type: "qcm",
    question: "Peut-on observer des cellules vivantes au microscope électronique ?",
    options: [
      "Oui, à condition d'utiliser un fixateur chimique doux qui préserve les fonctions cellulaires.",
      "Non, les cellules doivent être mortes et fixées pour le ME, contrairement au MO qui peut observer des cellules vivantes ou mortes.",
      "Oui, uniquement avec le microscope électronique à balayage (MEB), pas avec le MET."
    ],
    answer: "Non, les cellules doivent être mortes et fixées pour le ME, contrairement au MO qui peut observer des cellules vivantes ou mortes.",
    explanation: "Le ME ne peut observer que des cellules MORTES car fixées (la déshydratation totale et la fixation tuent les cellules). Le MO peut observer des cellules VIVANTES OU MORTES. C'est l'une des différences fondamentales entre les deux instruments. Le type de ME (transmission ou balayage) ne change pas cette contrainte — toutes les techniques ME nécessitent une fixation."
  },
  {
    type: "qcm",
    question: "Quelle est l'épaisseur des coupes réalisées pour le microscope électronique ?",
    options: [
      "2 à 10 µm, comme pour le microscope optique.",
      "1/200 de l'épaisseur de la cellule (coupes ultrafines).",
      "1 à 10 mm, pour permettre au faisceau d'électrons de pénétrer l'échantillon."
    ],
    answer: "1/200 de l'épaisseur de la cellule (coupes ultrafines).",
    explanation: "Pour le ME, on réalise des COUPES ULTRAFINES correspondant à 1/200 de l'épaisseur de la cellule. Pour le MO, les coupes mesurent entre 2 et 10 µm. Les coupes en mm sont beaucoup trop épaisses pour toute microscopie — c'est un piège d'ordre de grandeur. La finesse des coupes est indispensable pour que le faisceau d'électrons puisse traverser l'échantillon."
  },
  {
    type: "qcm",
    question: "Comment obtient-on le contraste dans les préparations pour microscope électronique ?",
    options: [
      "Par l'utilisation de colorants vitaux sélectifs comme le bleu de méthylène.",
      "Par la fixation avec des sels de métaux lourds qui se fixent sur certains constituants de la matière vivante.",
      "Par l'éclairage à une longueur d'onde spécifique provoquant la fluorescence des molécules."
    ],
    answer: "Par la fixation avec des sels de métaux lourds qui se fixent sur certains constituants de la matière vivante.",
    explanation: "Pour le ME, le contraste est obtenu par des SELS DE MÉTAUX LOURDS (ex. acétate d'uranyle, citrate de plomb) qui se fixent sur certains constituants cellulaires et dévient différemment le faisceau d'électrons. Le BLEU DE MÉTHYLÈNE est un colorant du MO. La FLUORESCENCE est le principe du microscope à fluorescence (variante du MO). Ces trois techniques sont propres à trois contextes différents — les confondre est un piège classique."
  },
  {
    type: "qcm",
    question: "Les images produites par le microscope électronique sont-elles en couleur ou en noir et blanc ?",
    options: [
      "En couleur, car les électrons interagissent avec les colorants comme la lumière.",
      "En noir et blanc, car les électrons ne permettent pas de distinguer les longueurs d'onde du spectre visible.",
      "En couleur artificielle, grâce aux colorants fluorescents injectés dans les cellules avant observation."
    ],
    answer: "En noir et blanc, car les électrons ne permettent pas de distinguer les longueurs d'onde du spectre visible.",
    explanation: "Les images du ME sont en NOIR ET BLANC : les électrons n'interagissent pas avec les longueurs d'onde du spectre visible, donc aucune couleur naturelle n'est produite. Les couleurs que l'on voit parfois sur des images de ME sont des COLORATIONS ARTIFICIELLES ajoutées numériquement après la prise d'image. Les colorants fluorescents sont utilisés en MICROSCOPIE À FLUORESCENCE (variante du MO, pas du ME)."
  },
  {
    type: "qcm",
    question: "Quelle technique du microscope électronique permet d'obtenir des images en trois dimensions ?",
    options: [
      "La coloration au bleu de méthylène associée à la microscopie en lumière directe.",
      "Le scanner, le balayage, et le cryodécapage.",
      "La microscopie à fluorescence combinée au contraste de phase."
    ],
    answer: "Le scanner, le balayage, et le cryodécapage.",
    explanation: "Des techniques spécifiques au ME comme le SCANNER, le BALAYAGE (microscope électronique à balayage, MEB) et le CRYODÉCAPAGE permettent d'obtenir des images en TROIS DIMENSIONS. Le bleu de méthylène est un colorant du MO. La fluorescence et le contraste de phase sont des variantes du MO — elles ne produisent pas d'images 3D de cette nature."
  },
  {
    type: "qcm",
    question: "Quel est l'ordre correct des étapes de préparation d'un tissu pour le microscope optique ?",
    options: [
      "Coloration → Fixation → Inclusion → Coupe → Montage.",
      "Fixation → Inclusion → Coupe → Coloration → Montage.",
      "Inclusion → Fixation → Montage → Coupe → Coloration."
    ],
    answer: "Fixation → Inclusion → Coupe → Coloration → Montage.",
    explanation: "L'ordre exact est : FIXATION (stopper les altérations) → INCLUSION (durcir dans la paraffine) → COUPE (microtome, 2-10 µm) → COLORATION (colorants sélectifs) → MONTAGE (entre lame et lamelle). Tout autre ordre est logiquement incohérent : on ne peut pas colorer avant de couper, ni couper avant d'inclure. L'ordre est une question d'examen classique sur ce chapitre."
  },
  {
    type: "qcm",
    question: "Pourquoi la fixation est-elle la première étape indispensable de la préparation pour le MO ?",
    options: [
      "Pour colorer les structures cellulaires avant leur observation.",
      "Pour éviter les altérations du matériel biologique et figer la cellule dans son état d'origine.",
      "Pour durcir le tissu afin de permettre la réalisation de coupes fines au microtome."
    ],
    answer: "Pour éviter les altérations du matériel biologique et figer la cellule dans son état d'origine.",
    explanation: "La FIXATION a pour rôle d'ÉVITER LES ALTÉRATIONS (dégradation enzymatique, putréfaction) et de FIGER la cellule dans son état au moment du prélèvement, à l'aide de fixateurs chimiques (alcool, formol) ou physiques (température). Le DURCISSEMENT est le rôle de l'INCLUSION (paraffine). La COLORATION est une étape postérieure. Confondre fixation et inclusion est un piège fréquent."
  },
  {
    type: "qcm",
    question: "Pourquoi l'inclusion dans la paraffine nécessite-t-elle une déshydratation préalable ?",
    options: [
      "Car la paraffine est hydrophobe et ne peut pas pénétrer dans un tissu contenant encore de l'eau.",
      "Car l'eau empêche la coloration ultérieure des coupes histologiques.",
      "Car la déshydratation permet d'amplifier le signal des colorants fluorescents."
    ],
    answer: "Car la paraffine est hydrophobe et ne peut pas pénétrer dans un tissu contenant encore de l'eau.",
    explanation: "La PARAFFINE est HYDROPHOBE (repousse l'eau). Pour qu'elle puisse pénétrer dans le tissu et l'imprégner complètement pour le durcir, il faut d'abord éliminer toute l'eau par DÉSHYDRATATION. C'est un principe physico-chimique simple : hydrophobe et eau ne se mélangent pas. L'eau n'empêche pas la coloration en elle-même, et les colorants fluorescents relèvent de la microscopie à fluorescence (MO), pas de l'inclusion."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qu'un artefact en microscopie, et quand apparaît-il ?",
    options: [
      "Une structure cellulaire rare visible uniquement au microscope électronique.",
      "Une modification artificielle de la structure cellulaire induite par les traitements de préparation, qui peut faire croire à l'existence d'une structure inexistante en réalité.",
      "Un colorant vital qui amplifie le signal des structures sans les modifier."
    ],
    answer: "Une modification artificielle de la structure cellulaire induite par les traitements de préparation, qui peut faire croire à l'existence d'une structure inexistante en réalité.",
    explanation: "Un ARTEFACT est une modification ARTIFICIELLE causée par les traitements de préparation (fixation, inclusion, coupe, coloration) qui peut créer l'illusion d'une structure n'existant pas dans la cellule vivante. C'est un risque inhérent à toute préparation histologique. Le cours l'énonce clairement : 'Il y a risques d'artefacts.' Un colorant qui amplifie sans modifier est l'idéal recherché — l'artefact est justement ce qu'on veut éviter."
  },
  {
    type: "qcm",
    question: "Quel est le principe de la microscopie en contraste de phase ?",
    options: [
      "L'éclairage à une longueur d'onde spéciale provoquant l'émission de fluorescence par les molécules.",
      "La provocation d'un déphasage des différents rayons lumineux traversant la préparation.",
      "L'utilisation d'un faisceau d'électrons dévié par les structures cellulaires pour former une image."
    ],
    answer: "La provocation d'un déphasage des différents rayons lumineux traversant la préparation.",
    explanation: "Le CONTRASTE DE PHASE exploite le DÉPHASAGE des rayons lumineux lorsqu'ils traversent des structures d'indices de réfraction différents — ce déphasage est converti en différence de contraste visible. C'est très utile pour observer des CELLULES VIVANTES et transparentes sans coloration. La FLUORESCENCE utilise une longueur d'onde spéciale pour exciter les molécules. Le FAISCEAU D'ÉLECTRONS caractérise le ME, pas le MO."
  },
  {
    type: "qcm",
    question: "Dans quel contexte privilégie-t-on la microscopie à fluorescence ?",
    options: [
      "Pour observer des bactéries très épaisses nécessitant un fort grossissement.",
      "Spécialement pour les préparations très translucides et fines, peu contrastées (cellules de mammifères, bactéries, tissus).",
      "Pour obtenir des images en trois dimensions de la surface des cellules."
    ],
    answer: "Spécialement pour les préparations très translucides et fines, peu contrastées (cellules de mammifères, bactéries, tissus).",
    explanation: "La MICROSCOPIE À FLUORESCENCE est particulièrement adaptée aux préparations TRÈS TRANSLUCIDES, FINES et PEU CONTRASTÉES comme les cellules de mammifères, les bactéries et les tissus. Elle utilise une longueur d'onde spéciale pour exciter des molécules fluorescentes, révélant des structures invisibles en lumière directe. Les images 3D de surface sont obtenues avec le MEB (ME à balayage). L'épaisseur des bactéries n'est pas un critère pour choisir la fluorescence."
  },
  {
    type: "qcm",
    question: "Pourquoi faut-il souvent 'bloquer' le métabolisme cellulaire rapidement avant d'étudier le fonctionnement cellulaire ?",
    options: [
      "Pour permettre aux isotopes radioactifs de se fixer plus efficacement sur les molécules cibles.",
      "Pour éviter toutes modifications chimiques qui altéreraient l'état de la cellule au moment de l'étude.",
      "Pour faciliter l'injection des anticorps spécifiques dans le compartiment cellulaire étudié."
    ],
    answer: "Pour éviter toutes modifications chimiques qui altéreraient l'état de la cellule au moment de l'étude.",
    explanation: "L'étude du fonctionnement cellulaire nécessite de BLOQUER le métabolisme rapidement (congélation rapide, fixation chimique) pour ÉVITER TOUTES MODIFICATIONS CHIMIQUES qui changeraient l'état réel de la cellule. Le métabolisme est si rapide que sans blocage, la cellule continue de fonctionner et l'image obtenue ne reflète plus l'état initial. Les isotopes et anticorps sont des outils utilisés APRÈS ce blocage."
  },
  {
    type: "qcm",
    question: "Comment les isotopes radioactifs sont-ils utilisés pour étudier le fonctionnement cellulaire ?",
    options: [
      "On remplace un atome normal par sa version radioactive (ex. ¹⁶O → ¹⁸O) pour suivre le devenir des atomes ou molécules au cours des réactions chimiques.",
      "On injecte des isotopes directement dans le noyau cellulaire pour marquer l'ADN uniquement.",
      "On utilise les isotopes pour colorer les organites avant observation au microscope électronique."
    ],
    answer: "On remplace un atome normal par sa version radioactive (ex. ¹⁶O → ¹⁸O) pour suivre le devenir des atomes ou molécules au cours des réactions chimiques.",
    explanation: "L'utilisation des ISOTOPES consiste à remplacer un atome normal par sa version radioactive (ex. ¹⁶O remplacé par ¹⁸O) pour TRACER le déplacement des atomes ou molécules dans les réactions cellulaires — comme un 'GPS moléculaire'. Ils ne sont pas injectés dans le noyau spécifiquement : ils peuvent marquer n'importe quelle molécule selon l'expérience. Ils ne colorent pas pour le ME — ce sont des outils de traçage biochimique, pas des colorants."
  },
  {
    type: "qcm",
    question: "Quel est le rôle des anticorps spécifiques dans l'étude du fonctionnement cellulaire ?",
    options: [
      "Détecter et localiser certaines molécules complexes comme des protéines virales dans la cellule.",
      "Bloquer toutes les réactions enzymatiques pour figer la cellule avant observation.",
      "Remplacer les colorants traditionnels dans la préparation pour la microscopie optique classique."
    ],
    answer: "Détecter et localiser certaines molécules complexes comme des protéines virales dans la cellule.",
    explanation: "Les ANTICORPS SPÉCIFIQUES sont utilisés pour DÉTECTER et LOCALISER certaines molécules complexes — exemple du cours : les protéines virales. Un anticorps reconnaît spécifiquement sa molécule cible (antigène) et permet de la visualiser, souvent couplé à un marqueur fluorescent. Ils ne bloquent pas le métabolisme (c'est le rôle de la congélation ou fixation). Ils ne remplacent pas les colorants classiques — ils répondent à un objectif différent : identifier une molécule précise, pas colorer une structure générale."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre la microinjection et l'utilisation des anticorps comme méthodes d'étude du fonctionnement cellulaire ?",
    options: [
      "La microinjection introduit une substance DANS la cellule pour suivre son déplacement entre compartiments ; les anticorps détectent et localisent des molécules déjà présentes dans la cellule.",
      "La microinjection est réservée au ME ; les anticorps sont utilisés uniquement avec le MO.",
      "Il n'y a aucune différence : les deux méthodes visent à introduire des molécules étrangères dans la cellule pour marquer l'ADN."
    ],
    answer: "La microinjection introduit une substance DANS la cellule pour suivre son déplacement entre compartiments ; les anticorps détectent et localisent des molécules déjà présentes dans la cellule.",
    explanation: "La MICROINJECTION consiste à introduire directement une substance dans la cellule pour SUIVRE SON DÉPLACEMENT entre compartiments cellulaires. Les ANTICORPS SPÉCIFIQUES servent à DÉTECTER et LOCALISER des molécules déjà présentes (ex. protéines virales). Les deux méthodes étudient le fonctionnement cellulaire mais avec des approches opposées : l'une introduit quelque chose, l'autre détecte ce qui est déjà là. Aucune de ces méthodes n'est exclusive à un type de microscope."
  }
] },
        { nom: "La membrane plasmique", quiz: [
  {
    type: "qcm",
    question: "Pourquoi le modèle de la membrane plasmique est-il appelé 'mosaïque fluide' ?",
    options: [
      "Mosaïque car la membrane est rigide comme un carrelage ; fluide car l'eau traverse librement.",
      "Mosaïque car la membrane est composée d'une diversité de composants ; fluide car ces composants sont mobiles, la membrane se comportant comme un milieu liquide à deux dimensions.",
      "Mosaïque car la membrane contient uniquement des lipides variés ; fluide car les protéines y circulent librement."
    ],
    answer: "Mosaïque car la membrane est composée d'une diversité de composants ; fluide car ces composants sont mobiles, la membrane se comportant comme un milieu liquide à deux dimensions.",
    explanation: "Le terme MOSAÏQUE vient de la DIVERSITÉ des composants membranaires (lipides, protéines, glucides). Le terme FLUIDE vient de la MOBILITÉ de ces composants : la membrane se comporte comme un MILIEU LIQUIDE À DEUX DIMENSIONS. La membrane n'est donc pas rigide — c'est le contraire. Ce n'est pas uniquement les lipides ni uniquement les protéines qui créent la fluidité : c'est l'ensemble des composants mobiles."
  },
  {
    type: "qcm",
    question: "Quelles sont les deux fonctions fondamentales de la membrane plasmique ?",
    options: [
      "Synthèse des protéines et stockage de l'énergie sous forme d'ATP.",
      "Séparer le milieu intracellulaire du milieu extracellulaire, et contrôler les échanges entre la cellule et son environnement.",
      "Produire des lipides membranaires et dégrader les déchets cellulaires."
    ],
    answer: "Séparer le milieu intracellulaire du milieu extracellulaire, et contrôler les échanges entre la cellule et son environnement.",
    explanation: "La membrane plasmique a deux fonctions fondamentales : (1) SÉPARER le milieu intracellulaire (hyaloplasme/cytosol) du milieu extracellulaire — fonction de frontière ; (2) CONTRÔLER les échanges entre la cellule et son environnement — fonction d'interface sélective. Elle joue aussi un rôle dans l'ADHÉRENCE et la COMMUNICATION cellulaire. La synthèse des protéines est le rôle des ribosomes. La production d'ATP est le rôle des mitochondries."
  },
  {
    type: "qcm",
    question: "Qu'observe-t-on au microscope électronique lorsqu'on examine la membrane plasmique ?",
    options: [
      "Une structure trilaminaire : deux feuillets denses (20 Å) de nature protéique encadrant un feuillet clair (35 Å) de nature lipidique.",
      "Une structure monolaminaire de 75 Å d'épaisseur, entièrement lipidique.",
      "Une structure trilaminaire : deux feuillets clairs (35 Å) de nature lipidique encadrant un feuillet dense (20 Å) de nature protéique."
    ],
    answer: "Une structure trilaminaire : deux feuillets denses (20 Å) de nature protéique encadrant un feuillet clair (35 Å) de nature lipidique.",
    explanation: "Au ME, la membrane apparaît comme une structure TRILAMINAIRE (trilamellaire) composée de : deux FEUILLETS DENSES de 20 Å chacun (de nature PROTÉIQUE) qui encadrent un FEUILLET CLAIR de 35 Å (de nature LIPIDIQUE). L'épaisseur totale est d'environ 75 Å. La deuxième option est fausse : la membrane n'est pas monolaminaire. La troisième option INVERSE les natures des feuillets — c'est le piège classique : dense = protéique, clair = lipidique."
  },
  {
    type: "qcm",
    question: "Quelle est la composition en poids sec de la membrane plasmique ?",
    options: [
      "52% de lipides, 40% de protéines et 8% de glucides.",
      "52% de protéines, 40% de lipides et 8% de glucides.",
      "52% de glucides, 40% de lipides et 8% de protéines."
    ],
    answer: "52% de protéines, 40% de lipides et 8% de glucides.",
    explanation: "La composition en poids sec de la membrane plasmique est : 52% de PROTÉINES, 40% de LIPIDES et 8% de GLUCIDES. La première option inverse protéines et lipides — piège classique. Les protéines sont donc majoritaires en poids, même si les lipides sont souvent perçus comme la composante principale (car ils forment la bicouche de base). Les glucides sont toujours minoritaires (8%)."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qui rend un phospholipide 'amphiphile', et quelle conséquence cela a-t-il sur son organisation en solution aqueuse ?",
    options: [
      "Il est amphiphile car il est entièrement hydrophobe ; en solution aqueuse, il précipite au fond.",
      "Il est amphiphile car il possède une tête hydrophile (groupement phosphate) et une queue hydrophobe (acides gras) ; en solution aqueuse, les têtes se tournent vers l'eau et les queues se cachent à l'intérieur, formant spontanément une bicouche.",
      "Il est amphiphile car il est entièrement hydrophile ; en solution aqueuse, il se dissout uniformément."
    ],
    answer: "Il est amphiphile car il possède une tête hydrophile (groupement phosphate) et une queue hydrophobe (acides gras) ; en solution aqueuse, les têtes se tournent vers l'eau et les queues se cachent à l'intérieur, formant spontanément une bicouche.",
    explanation: "Un phospholipide est AMPHIPHILE car il possède les DEUX caractères : une TÊTE HYDROPHILE (groupement phosphate, aime l'eau) et une QUEUE HYDROPHOBE (acides gras, fuit l'eau). En solution aqueuse, cette double nature force une auto-organisation spontanée : têtes vers l'eau, queues cachées à l'intérieur → BICOUCHE LIPIDIQUE. Cette organisation ne nécessite pas d'énergie — elle est dictée par la physique moléculaire."
  },
  {
    type: "qcm",
    question: "Quelles sont les quatre conformations possibles des lipides amphiphiles en solution aqueuse ?",
    options: [
      "Micelle, monocouche, bicouche plane simple, liposome.",
      "Micelle, bicouche, vésicule, membrane trilaminaire.",
      "Monocouche, bicouche, tricouche, tétracouche."
    ],
    answer: "Micelle, monocouche, bicouche plane simple, liposome.",
    explanation: "Selon le cours, les lipides amphiphiles peuvent s'organiser en 4 conformations : (1) MICELLE (sphère avec queues à l'intérieur) ; (2) MONOCOUCHE (une seule couche à l'interface eau/air) ; (3) BICOUCHE PLANE SIMPLE (la membrane biologique classique) ; (4) LIPOSOME (vésicule fermée à double bicouche). La 'membrane trilaminaire' est une description de l'image au ME, pas une conformation lipidique. 'Tricouche' et 'tétracouche' n'existent pas."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre les glycérophospholipides et les sphingophospholipides ?",
    options: [
      "Les glycérophospholipides ont une base glycérol ; les sphingophospholipides ont une base sphingosine (ex. sphingomyéline avec la choline).",
      "Les glycérophospholipides sont hydrophobes ; les sphingophospholipides sont hydrophiles.",
      "Les glycérophospholipides forment la face externe de la membrane ; les sphingophospholipides forment la face interne."
    ],
    answer: "Les glycérophospholipides ont une base glycérol ; les sphingophospholipides ont une base sphingosine (ex. sphingomyéline avec la choline).",
    explanation: "La différence entre les deux types de phospholipides est leur BASE CHIMIQUE : GLYCÉROPHOSPHOLIPIDES = glycérol + 2 acides gras + acide phosphorique + alcools ou acides aminés ; SPHINGOPHOSPHOLIPIDES = sphingosine + acide gras + acide phosphorique + alcool (ex. choline → SPHINGOMYÉLINE). Les deux sont amphiphiles. La répartition interne/externe ne suit pas cette classification — c'est une distinction biochimique, pas topographique."
  },
  {
    type: "qcm",
    question: "Quelle est la particularité du cholestérol dans la membrane plasmique ?",
    options: [
      "Il est présent dans toutes les membranes biologiques, y compris celles des organites et des procaryotes.",
      "Il est spécifique à la cellule animale, absent de la membrane des organites et des procaryotes, et joue un rôle dans la stabilité mécanique de la membrane.",
      "Il est localisé uniquement à l'extérieur de la cellule pour former le glycocalyx."
    ],
    answer: "Il est spécifique à la cellule animale, absent de la membrane des organites et des procaryotes, et joue un rôle dans la stabilité mécanique de la membrane.",
    explanation: "Le CHOLESTÉROL est SPÉCIFIQUE à la CELLULE ANIMALE : il est ABSENT de la membrane des organites ET des procaryotes. C'est pourquoi il peut servir de MARQUEUR SPÉCIFIQUE de la membrane plasmique. Il appartient à la famille des STÉROLS et son groupement hydrophobe le loge à l'intérieur de la membrane. Il joue un rôle dans la STABILITÉ MÉCANIQUE. Le GLYCOCALYX est formé par les GLYCOLIPIDES — pas le cholestérol."
  },
  {
    type: "qcm",
    question: "Où sont localisés les glycolipides dans la membrane plasmique, et quel est leur rôle ?",
    options: [
      "À l'intérieur de la bicouche lipidique ; ils servent de réserve énergétique pour la cellule.",
      "Uniquement à l'extérieur de la cellule ; ils participent à la formation du glycocalyx et à la reconnaissance cellulaire (groupes sanguins ABO, CMH).",
      "Également répartis des deux côtés de la membrane ; ils contrôlent la fluidité membranaire."
    ],
    answer: "Uniquement à l'extérieur de la cellule ; ils participent à la formation du glycocalyx et à la reconnaissance cellulaire (groupes sanguins ABO, CMH).",
    explanation: "Les GLYCOLIPIDES (sucres + lipides) sont localisés UNIQUEMENT À L'EXTÉRIEUR de la cellule. Ils participent à la formation du GLYCOCALYX, qui joue un rôle dans la RECONNAISSANCE CELLULAIRE (antigènes de surface du système ABO, CMH — système majeur d'histocompatibilité). La réserve énergétique est le rôle des lipides de réserve (triglycérides), pas des glycolipides. La fluidité est régulée par le cholestérol, pas les glycolipides."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre les protéines extrinsèques (PE) et les protéines intrinsèques (PI) membranaires ?",
    options: [
      "Les PE traversent toute la bicouche lipidique ; les PI sont situées uniquement en surface.",
      "Les PE sont localisées en surface (entièrement intra- ou extracellulaires) sans traverser la bicouche ; les PI (transmembranaires) traversent la bicouche lipidique.",
      "Les PE sont exclusivement extracellulaires ; les PI sont exclusivement intracellulaires."
    ],
    answer: "Les PE sont localisées en surface (entièrement intra- ou extracellulaires) sans traverser la bicouche ; les PI (transmembranaires) traversent la bicouche lipidique.",
    explanation: "Les PROTÉINES EXTRINSÈQUES (PE) sont localisées en SURFACE de la membrane, soit entièrement intracellulaires, soit entièrement extracellulaires — elles ne traversent PAS la bicouche. Les PROTÉINES INTRINSÈQUES (PI) ou transmembranaires TRAVERSENT la bicouche lipidique et sont elles aussi AMPHIPHILES. La première option INVERSE les définitions — c'est le piège le plus classique sur les protéines membranaires."
  },
  {
    type: "qcm",
    question: "Quel est le rôle des microvillosités (bordure en brosse) et où sont-elles localisées ?",
    options: [
      "Au pôle basal des cellules épithéliales ; elles permettent les échanges bidirectionnels d'eau et de minéraux avec la matrice extracellulaire.",
      "Au pôle apical des cellules épithéliales (entérocytes) ; elles augmentent la surface d'échanges et interviennent dans l'absorption.",
      "Dans les cellules du tubule rénal ; elles logent des mitochondries pour fournir l'énergie des transports actifs."
    ],
    answer: "Au pôle apical des cellules épithéliales (entérocytes) ; elles augmentent la surface d'échanges et interviennent dans l'absorption.",
    explanation: "Les MICROVILLOSITÉS (bordure en brosse) sont des expansions cytoplasmiques en doigts de gant (<1 µm de longueur, 0,1 µm de diamètre) situées au PÔLE APICAL des cellules épithéliales (ex. entérocytes intestinaux). Elles augmentent la SURFACE D'ÉCHANGES et interviennent dans l'ABSORPTION. Le PÔLE BASAL avec échanges bidirectionnels décrit les INTRA-DIGITATIONS. Les MITOCHONDRIES logées dans des compartiments décrivent les MICROINVAGINATIONS (tubule rénal)."
  },
  {
    type: "qcm",
    question: "Qu'arrive-t-il à une cellule placée dans un milieu hypertonique ?",
    options: [
      "La cellule gonfle car l'eau entre massivement par osmose.",
      "La cellule rétrécit (plasmolyse) car l'eau sort de la cellule vers le milieu extérieur plus concentré.",
      "La cellule reste stable car les concentrations sont identiques de part et d'autre de la membrane."
    ],
    answer: "La cellule rétrécit (plasmolyse) car l'eau sort de la cellule vers le milieu extérieur plus concentré.",
    explanation: "En milieu HYPERTONIQUE, le milieu extérieur a une concentration ionique PLUS FORTE que l'intérieur de la cellule. L'eau suit le gradient osmotique et SORT de la cellule → la cellule RÉTRÉCIT : c'est la PLASMOLYSE. La cellule qui GONFLE est celle placée en milieu HYPOTONIQUE (milieu extérieur moins concentré → l'eau entre). La cellule STABLE est celle en milieu ISOTONIQUE (concentrations égales). Ces trois situations sont régulièrement inversées dans les QCM."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre la diffusion facilitée par canal et la diffusion facilitée par transporteur (perméase) ?",
    options: [
      "Les canaux sont saturables ; les transporteurs ne le sont pas.",
      "Les canaux sont non saturables (débit proportionnel au gradient) ; les transporteurs sont saturables (comme une enzyme avec un substrat).",
      "Les canaux consomment de l'ATP ; les transporteurs fonctionnent sans énergie."
    ],
    answer: "Les canaux sont non saturables (débit proportionnel au gradient) ; les transporteurs sont saturables (comme une enzyme avec un substrat).",
    explanation: "La différence clé est la SATURABILITÉ : les CANAUX sont NON SATURABLES (le débit augmente proportionnellement au gradient, sans limite de saturation) ; les TRANSPORTEURS (perméases) sont SATURABLES (comme une enzyme, il existe une vitesse maximale au-delà de laquelle tous les sites sont occupés). Les deux fonctionnent SANS ATP (diffusion facilitée = passive). La première option INVERSE les deux propriétés — c'est le piège classique."
  },
  {
    type: "qcm",
    question: "Quels sont les trois types de canaux protéiques impliqués dans la diffusion facilitée ?",
    options: [
      "Canaux ioniques, aquaporines, jonctions gap.",
      "Canaux ioniques, perméases, pompes Na+/K+.",
      "Aquaporines, transporteurs actifs, symports."
    ],
    answer: "Canaux ioniques, aquaporines, jonctions gap.",
    explanation: "Les trois types de CANAUX selon le cours sont : (1) CANAUX IONIQUES (transport des ions Na+, K+, Ca²+...) ; (2) AQUAPORINES (transport exclusif de l'eau) ; (3) JONCTIONS GAP (transport de tous types de solutés sous un seuil de taille, entre deux cellules adjacentes). Les PERMÉASES sont des TRANSPORTEURS (pas des canaux). La POMPE Na+/K+ est un transport ACTIF primaire (consomme de l'ATP). Les SYMPORTS relèvent du transport actif secondaire."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qui caractérise fondamentalement le transport actif par rapport à la diffusion ?",
    options: [
      "Le transport actif suit le gradient de concentration, sans consommation d'énergie.",
      "Le transport actif s'effectue contre le gradient de concentration et nécessite une dépense d'énergie, le plus souvent par hydrolyse de l'ATP.",
      "Le transport actif utilise des canaux protéiques non saturables pour faire passer des ions."
    ],
    answer: "Le transport actif s'effectue contre le gradient de concentration et nécessite une dépense d'énergie, le plus souvent par hydrolyse de l'ATP.",
    explanation: "Le TRANSPORT ACTIF se distingue de la diffusion par deux caractères : (1) il s'effectue CONTRE le gradient de concentration (du moins concentré vers le plus concentré) ; (2) il nécessite une DÉPENSE D'ÉNERGIE, le plus souvent par HYDROLYSE DE L'ATP. La diffusion (simple ou facilitée) suit TOUJOURS le gradient et ne consomme PAS d'ATP. Les canaux non saturables caractérisent la diffusion facilitée, pas le transport actif."
  },
  {
    type: "qcm",
    question: "Combien d'ions Na+ et K+ la pompe Na+/K+ ATPase transporte-t-elle à chaque cycle, et dans quel sens ?",
    options: [
      "2 Na+ sortent et 3 K+ entrent, en échange d'une molécule d'ATP.",
      "3 Na+ sortent et 2 K+ entrent, en échange d'une molécule d'ATP.",
      "3 Na+ et 3 K+ entrent simultanément, avec consommation de 2 ATP."
    ],
    answer: "3 Na+ sortent et 2 K+ entrent, en échange d'une molécule d'ATP.",
    explanation: "La POMPE Na+/K+ ATPase effectue un transport ASYMÉTRIQUE : 3 Na+ SORTENT et 2 K+ ENTRENT pour chaque molécule d'ATP hydrolysée. Ce transport est contre le gradient pour les deux ions (Na+ est plus concentré dehors, K+ est plus concentré dedans). La première option INVERSE les chiffres de Na+ et K+ — piège classique. La troisième option est fausse : les deux ions vont dans des sens OPPOSÉS (pas ensemble) et une seule ATP est utilisée."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre un symport et un antiport dans le transport actif secondaire ?",
    options: [
      "Symport : les deux molécules vont dans des sens opposés ; antiport : les deux vont dans le même sens.",
      "Symport : les deux molécules vont dans le même sens ; antiport : les deux vont dans des sens opposés.",
      "Symport et antiport sont deux noms pour le même mécanisme de co-transport."
    ],
    answer: "Symport : les deux molécules vont dans le même sens ; antiport : les deux vont dans des sens opposés.",
    explanation: "Dans le transport actif secondaire (co-transport) : SYMPORT = les deux molécules couplées vont dans le MÊME SENS (syn = ensemble) ; ANTIPORT = les deux molécules vont dans des SENS OPPOSÉS (anti = contre). La première option INVERSE les deux définitions — c'est le piège le plus fréquent sur ce sujet. Les deux mécanismes couplent un transport favorable (dans le sens du gradient) à un transport défavorable (contre le gradient)."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre l'endocytose et l'exocytose ?",
    options: [
      "Endocytose : une vésicule interne fusionne avec la membrane pour libérer son contenu dehors ; exocytose : la membrane se referme sur elle-même pour capturer une substance extérieure.",
      "Endocytose : la membrane se referme sur elle-même pour capturer une substance extérieure sous forme de vésicule ; exocytose : une vésicule interne fusionne avec la membrane pour libérer son contenu dehors.",
      "Endocytose et exocytose sont deux noms du même transport vésiculaire, utilisés selon le type de molécule transportée."
    ],
    answer: "Endocytose : la membrane se referme sur elle-même pour capturer une substance extérieure sous forme de vésicule ; exocytose : une vésicule interne fusionne avec la membrane pour libérer son contenu dehors.",
    explanation: "ENDOCYTOSE = la membrane se REFERME sur elle-même pour CAPTURER une substance extérieure → vésicule qui entre dans la cellule (endo = vers l'intérieur). EXOCYTOSE = une vésicule interne FUSIONNE avec la membrane pour LIBÉRER son contenu dehors (exo = vers l'extérieur). La première option INVERSE les deux définitions — c'est le piège classique. Ces deux mécanismes sont utilisés pour les GROSSES MOLÉCULES qui ne peuvent pas passer par les canaux ou transporteurs."
  },
  {
    type: "qcm",
    question: "Pourquoi les bicouches lipidiques sont-elles imperméables aux ions et molécules chargées ?",
    options: [
      "Car les ions sont trop légers pour traverser la bicouche sans aide.",
      "Car le cœur hydrophobe de la bicouche repousse les molécules polaires et les ions chargés, qui sont hydrophiles.",
      "Car les ions sont trop gros pour passer entre les têtes hydrophiles des phospholipides."
    ],
    answer: "Car le cœur hydrophobe de la bicouche repousse les molécules polaires et les ions chargés, qui sont hydrophiles.",
    explanation: "La bicouche lipidique est imperméable aux ions et molécules chargées car son CŒUR CENTRAL est HYDROPHOBE (les queues des acides gras). Or les ions et molécules polaires sont HYDROPHILES — ils sont repoussés par le milieu hydrophobe central. La taille n'est pas le critère principal : c'est l'HYDROPHOBICITÉ et la CHARGE électrique qui déterminent le passage. C'est pourquoi des protéines canal (aquaporines, canaux ioniques) sont nécessaires pour faire passer ces molécules."
  },
  {
    type: "qcm",
    question: "Quels types de molécules peuvent traverser la bicouche lipidique par simple diffusion, sans aide protéique ?",
    options: [
      "Les ions Na+, K+ et Cl- car ils sont petits et abondants dans la cellule.",
      "Les molécules hydrophobes et les petites molécules non chargées comme O₂, CO₂, et les petits alcools.",
      "Les grosses protéines et les acides nucléiques car ils sont produits en grande quantité par la cellule."
    ],
    answer: "Les molécules hydrophobes et les petites molécules non chargées comme O₂, CO₂, et les petits alcools.",
    explanation: "La SIMPLE DIFFUSION à travers la bicouche est possible uniquement pour : les molécules HYDROPHOBES (lipophiles, compatibles avec le cœur hydrophobe de la membrane) et les PETITES MOLÉCULES NON CHARGÉES (O₂, CO₂, petits alcools). Les IONS (Na+, K+, Cl-) sont chargés → imperméables sans canal. Les GROSSES PROTÉINES et ACIDES NUCLÉIQUES sont beaucoup trop grands et polaires pour traverser directement la bicouche — ils nécessitent des transports vésiculaires ou des pores spécifiques."
  }
] },
        { nom: "Organisation interne de la cellule", quiz: [
  {
    type: "qcm",
    question: "Le réticulum endoplasmique granulaire (REG) et le réticulum endoplasmique lisse (REL) se distinguent principalement par :",
    options: [
      "Leur localisation dans la cellule : REG près du noyau, REL près de la membrane plasmique.",
      "La présence ou l'absence de ribosomes : REG couvert de ribosomes (synthèse de protéines), REL dépourvu de ribosomes (synthèse de lipides, détoxification).",
      "Leur composition chimique : REG contient des lipides, REL contient des protéines."
    ],
    answer: "La présence ou l'absence de ribosomes : REG couvert de ribosomes (synthèse de protéines), REL dépourvu de ribosomes (synthèse de lipides, détoxification).",
    explanation: "La distinction fondamentale entre REG et REL est la présence (REG) ou l'absence (REL) de RIBOSOMES sur leur surface. Le REG (ou RER) STOCKE et EXCRÈTE les protéines synthétisées par ses ribosomes. Le REL est dépourvu de ribosomes et est impliqué dans la synthèse des LIPIDES et la DÉTOXIFICATION (notamment dans le foie). La localisation n'est pas le critère de distinction. La composition est inversée dans la troisième option — c'est le piège classique."
  },
  {
    type: "qcm",
    question: "D'où découlent les réticulums endoplasmiques dans la cellule ?",
    options: [
      "Ils découlent de la membrane plasmique et s'étendent vers le noyau.",
      "Ils découlent de la membrane nucléaire et forment un réseau membranaire interne.",
      "Ils sont synthétisés de novo par les ribosomes libres du cytoplasme."
    ],
    answer: "Ils découlent de la membrane nucléaire et forment un réseau membranaire interne.",
    explanation: "Selon le cours, les réticulums endoplasmiques DÉCOULENT DE LA MEMBRANE NUCLÉAIRE et forment un réseau membranaire interne. Cela explique pourquoi la membrane externe du noyau est en CONTINUITÉ avec les membranes du REG — ce sont des structures connectées. Ils ne dérivent pas de la membrane plasmique ni ne sont synthétisés de novo par des ribosomes libres."
  },
  {
    type: "qcm",
    question: "Quel est le rôle exact de l'appareil de Golgi dans la cellule ?",
    options: [
      "Il synthétise directement les protéines à partir des acides aminés fournis par le cytoplasme.",
      "Il stocke, modifie (grâce à des enzymes), trie et véhicule les protéines et lipides produits par le réticulum vers leur destination finale (intra- ou extracellulaire).",
      "Il produit de l'ATP en oxydant les protéines venues du réticulum endoplasmique."
    ],
    answer: "Il stocke, modifie (grâce à des enzymes), trie et véhicule les protéines et lipides produits par le réticulum vers leur destination finale (intra- ou extracellulaire).",
    explanation: "L'APPAREIL DE GOLGI a 4 rôles selon le cours : STOCKER, MODIFIER (via des enzymes — ex. glycosylation, coupure), TRIER et VÉHICULER les protéines et lipides reçus du réticulum endoplasmique vers leur destination finale (intra- ou extracellulaire). Il ne SYNTHÉTISE pas les protéines (c'est le rôle des ribosomes) ni ne produit d'ATP (c'est le rôle des mitochondries). La synthèse vient d'abord (RE), puis le tri et l'expédition (Golgi)."
  },
  {
    type: "qcm",
    question: "Comment s'appelle l'ensemble structurel formé par l'appareil de Golgi, et de quoi est-il composé ?",
    options: [
      "Un nucléosome ; composé d'une protéine centrale entourée d'ADN enroulé.",
      "Un dictyosome ; composé de saccules lisses aux bords épaissis (citernes aplaties et empilées) accompagnés de vésicules isolées.",
      "Un chondriome ; composé de citernes aplaties entourant une matrice riche en enzymes."
    ],
    answer: "Un dictyosome ; composé de saccules lisses aux bords épaissis (citernes aplaties et empilées) accompagnés de vésicules isolées.",
    explanation: "L'appareil de Golgi forme un ensemble appelé DICTYOSOME, composé de SACCULES LISSES aux bords épaissis (aussi appelées CITERNES APLATIES ET EMPILÉES) accompagnés de VÉSICULES ISOLÉES. Le NUCLÉOSOME est l'unité de base de la chromatine (ADN + histones). Le CHONDRIOME est l'ensemble des MITOCHONDRIES d'une cellule — terme fréquemment utilisé dans ce cours pour désigner les mitochondries."
  },
  {
    type: "qcm",
    question: "Que signifie le terme 'chondriome' dans le contexte de ce cours ?",
    options: [
      "L'ensemble des ribosomes d'une cellule.",
      "L'ensemble des mitochondries d'une cellule.",
      "L'ensemble des peroxysomes d'une cellule."
    ],
    answer: "L'ensemble des mitochondries d'une cellule.",
    explanation: "Dans ce cours, le terme CHONDRIOME désigne l'ENSEMBLE DES MITOCHONDRIES d'une cellule (du grec 'chondros' = grain et 'soma' = corps). C'est un terme spécifique qui peut surprendre en examen. L'ensemble des RIBOSOMES n'a pas de nom d'ensemble spécifique dans ce cours. L'ensemble des PEROXYSOMES n'a pas non plus de terme collectif désigné."
  },
  {
    type: "qcm",
    question: "Quelle est la fonction principale des mitochondries, et comment leur nombre varie-t-il selon les cellules ?",
    options: [
      "Elles synthétisent les protéines ; leur nombre est constant (une seule par cellule).",
      "Elles convertissent l'énergie d'une forme à une autre (respiration cellulaire → ATP) ; leur nombre dépend de l'activité métabolique de la cellule.",
      "Elles dégradent les déchets cellulaires ; elles sont plus nombreuses dans les cellules peu actives."
    ],
    answer: "Elles convertissent l'énergie d'une forme à une autre (respiration cellulaire → ATP) ; leur nombre dépend de l'activité métabolique de la cellule.",
    explanation: "Les MITOCHONDRIES convertissent l'énergie d'une forme à une autre via la RESPIRATION CELLULAIRE pour produire de l'ATP. Leur nombre varie selon l'ACTIVITÉ MÉTABOLIQUE : une cellule très active (ex. cellule musculaire) aura PLUS de mitochondries qu'une cellule peu active. Ce n'est pas une seule par cellule — certaines cellules en ont des milliers. La dégradation des déchets est le rôle des LYSOSOMES."
  },
  {
    type: "qcm",
    question: "Que contient la matrice mitochondriale ?",
    options: [
      "Uniquement des enzymes de la respiration cellulaire, sans matériel génétique propre.",
      "De l'ADN mitochondrial, des ribosomes et des enzymes.",
      "Des histones, de l'ARN ribosomique et du cholestérol membranaire."
    ],
    answer: "De l'ADN mitochondrial, des ribosomes et des enzymes.",
    explanation: "La MATRICE MITOCHONDRIALE contient : de l'ADN MITOCHONDRIAL (propre à la mitochondrie, circulaire comme chez les bactéries), des RIBOSOMES (permettant la synthèse de certaines protéines mitochondriales) et des ENZYMES (de la respiration cellulaire). La présence d'ADN et de ribosomes propres est la preuve de l'ORIGINE BACTÉRIENNE des mitochondries (théorie endosymbiotique). Les histones sont associés à l'ADN NUCLÉAIRE, pas mitochondrial."
  },
  {
    type: "qcm",
    question: "Quelle est la différence fondamentale entre les lysosomes et les peroxysomes ?",
    options: [
      "Les lysosomes dégradent H₂O₂ avec des catalases ; les peroxysomes digèrent les macromolécules ingérées par phagocytose.",
      "Les lysosomes sont remplis d'hydrolases acides et digèrent les macromolécules et organites usés ; les peroxysomes contiennent des enzymes oxydatives qui neutralisent H₂O₂ (toxique) en H₂O + O₂.",
      "Les lysosomes et peroxysomes ont exactement le même rôle, seul leur nom diffère selon les espèces."
    ],
    answer: "Les lysosomes sont remplis d'hydrolases acides et digèrent les macromolécules et organites usés ; les peroxysomes contiennent des enzymes oxydatives qui neutralisent H₂O₂ (toxique) en H₂O + O₂.",
    explanation: "LYSOSOMES : sacs membranaires remplis d'HYDROLASES ACIDES (enzymes digestives, pH acide ≈ 5) → digestion de MACROMOLÉCULES ingérées par phagocytose/pinocytose, et d'ORGANITES USÉS (autophagie). PEROXYSOMES : contiennent des ENZYMES OXYDATIVES et des CATALASES qui dégradent H₂O₂ (peroxyde d'hydrogène, toxique) en H₂O + O₂. La première option INVERSE les deux rôles — c'est le piège classique. Ces deux organites ont tous les deux un rôle de dégradation mais de substances très différentes."
  },
  {
    type: "qcm",
    question: "Dans quelles cellules les peroxysomes sont-ils particulièrement abondants, et pourquoi ?",
    options: [
      "Dans les cellules nerveuses, car elles produisent beaucoup de neurotransmetteurs à dégrader.",
      "Dans les cellules hépatiques (foie) et rénales, car ces cellules ont une activité métabolique et de détoxification très intense produisant beaucoup de H₂O₂.",
      "Dans les érythrocytes, car ils n'ont pas de noyau et doivent compenser avec plus de peroxysomes."
    ],
    answer: "Dans les cellules hépatiques (foie) et rénales, car ces cellules ont une activité métabolique et de détoxification très intense produisant beaucoup de H₂O₂.",
    explanation: "Les PEROXYSOMES sont nombreux dans les CELLULES HÉPATIQUES (hépatocytes) et RÉNALES car ces cellules ont une activité MÉTABOLIQUE et de DÉTOXIFICATION très intense, générant beaucoup de H₂O₂ comme sous-produit. Les cellules nerveuses ont d'autres besoins spécifiques. Les ÉRYTHROCYTES (globules rouges) sont ANUCLÉÉS et ont un métabolisme très simplifié — ils ne compensent pas l'absence de noyau par des peroxysomes."
  },
  {
    type: "qcm",
    question: "Qu'arrive-t-il aux enzymes des lysosomes à la mort d'une cellule ?",
    options: [
      "Elles sont exportées hors de la cellule pour digérer les cellules voisines.",
      "Elles sont libérées dans le cytoplasme et assurent la digestion (autolyse) de tous les organites de la cellule morte.",
      "Elles sont inactivées par le pH neutre du cytoplasme et ne causent aucun dommage."
    ],
    answer: "Elles sont libérées dans le cytoplasme et assurent la digestion (autolyse) de tous les organites de la cellule morte.",
    explanation: "À la MORT CELLULAIRE, les membranes des lysosomes se rompent et libèrent leurs HYDROLASES ACIDES dans le cytoplasme. Ces enzymes assurent alors l'AUTOLYSE : la DIGESTION de tous les organites de la cellule morte. C'est un processus naturel de recyclage. Les enzymes ne sont pas exportées vers les cellules voisines. Elles ne sont pas inactivées par le pH neutre — au contraire, elles agissent à pH acide mais peuvent quand même dégrader les composants cellulaires une fois libérées massivement."
  },
  {
    type: "qcm",
    question: "Quels sont les trois types de filaments du cytosquelette, du plus fin au plus épais ?",
    options: [
      "Microtubules (7 nm) → Filaments intermédiaires (10 nm) → Microfilaments (25 nm).",
      "Microfilaments (~7 nm) → Filaments intermédiaires (~10 nm) → Microtubules (~25 nm).",
      "Filaments intermédiaires (7 nm) → Microfilaments (10 nm) → Microtubules (25 nm)."
    ],
    answer: "Microfilaments (~7 nm) → Filaments intermédiaires (~10 nm) → Microtubules (~25 nm).",
    explanation: "L'ordre croissant de diamètre est : MICROFILAMENTS (~7 nm, actine) → FILAMENTS INTERMÉDIAIRES (~10 nm, kératine, vimentine...) → MICROTUBULES (~25 nm, tubuline α et β). La première option INVERSE microfilaments et microtubules — c'est le piège le plus fréquent. Les microtubules sont les plus ÉPAIS malgré leur nom ('micro'), ce qui crée souvent une confusion avec les microfilaments."
  },
  {
    type: "qcm",
    question: "Quel est le rôle des microfilaments d'actine lors de la division cellulaire animale ?",
    options: [
      "Ils forment le fuseau mitotique qui sépare les chromosomes vers les pôles opposés.",
      "Un anneau d'actine et de myosine pince la cellule pour donner naissance aux deux cellules filles (cytocinèse).",
      "Ils forment la lamina nucléaire qui maintient la forme du noyau pendant la division."
    ],
    answer: "Un anneau d'actine et de myosine pince la cellule pour donner naissance aux deux cellules filles (cytocinèse).",
    explanation: "Lors de la division cellulaire animale, un ANNEAU CONTRACTILE composé d'ACTINE et de MYOSINE se forme à l'équateur de la cellule et se CONTRACTE pour PINCER le cytoplasme → CYTOCINÈSE (division du cytoplasme), donnant naissance aux deux cellules filles. Le FUSEAU MITOTIQUE qui sépare les chromosomes est composé de MICROTUBULES. La LAMINA NUCLÉAIRE est une structure protéique (filaments intermédiaires de lamines) qui soutient l'enveloppe nucléaire."
  },
  {
    type: "qcm",
    question: "Quelle propriété particulière des filaments intermédiaires les rend utiles en médecine, notamment en cancérologie ?",
    options: [
      "Leur capacité à se dépolymériser rapidement, permettant de cibler les cellules cancéreuses en division.",
      "Leur spécificité cellulaire : ils signent l'ORIGINE de la cellule et permettent de détecter l'origine des cellules cancéreuses.",
      "Leur rôle dans la production d'ATP, perturbé dans les cellules cancéreuses."
    ],
    answer: "Leur spécificité cellulaire : ils signent l'ORIGINE de la cellule et permettent de détecter l'origine des cellules cancéreuses.",
    explanation: "Les FILAMENTS INTERMÉDIAIRES sont chimiquement et structuralement très STABLES et SPÉCIFIQUES des types cellulaires : ils SIGNENT L'ORIGINE CELLULAIRE. En cancérologie, cela permet de détecter l'ORIGINE des CELLULES CANCÉREUSES même lorsqu'elles ont migré (métastases). Par exemple, la vimentine marque les cellules mésenchymateuses, la kératine marque les cellules épithéliales. La dépolymérisation rapide caractérise les MICROTUBULES et MICROFILAMENTS, pas les filaments intermédiaires (qui sont stables)."
  },
  {
    type: "qcm",
    question: "De quelle protéine les microtubules sont-ils composés, et quelle est leur propriété dynamique ?",
    options: [
      "D'actine ; ils sont stables et ne changent jamais de longueur une fois polymérisés.",
      "De tubuline (α et β-tubuline) ; ils sont dynamiques et peuvent croître et rétrécir rapidement par ajout ou suppression de tubuline.",
      "De myosine ; ils se contractent lors de la division cellulaire pour séparer les chromosomes."
    ],
    answer: "De tubuline (α et β-tubuline) ; ils sont dynamiques et peuvent croître et rétrécir rapidement par ajout ou suppression de tubuline.",
    explanation: "Les MICROTUBULES sont composés de TUBULINE (dimères de α-tubuline et β-tubuline). Ils sont des structures DYNAMIQUES qui peuvent CROÎTRE et RÉTRÉCIR rapidement par ajout ou suppression de protéines de tubuline à leurs extrémités. L'ACTINE compose les MICROFILAMENTS (pas les microtubules). La MYOSINE est une protéine motrice associée à l'actine. Les filaments stables sont les FILAMENTS INTERMÉDIAIRES."
  },
  {
    type: "qcm",
    question: "Qu'est-ce que le centrosome, et de quoi est-il composé ?",
    options: [
      "Le centre de la mitochondrie où se déroule la respiration cellulaire ; composé d'une matrice riche en enzymes.",
      "Le centre organisateur des microtubules (MTOC), composé de deux centrioles placés perpendiculairement l'un par rapport à l'autre.",
      "Le centre de tri de l'appareil de Golgi, composé de saccules aplaties et de vésicules de sécrétion."
    ],
    answer: "Le centre organisateur des microtubules (MTOC), composé de deux centrioles placés perpendiculairement l'un par rapport à l'autre.",
    explanation: "Le CENTROSOME est le MTOC (Microtubule Organizing Center = Centre Organisateur des Microtubules). Il est composé de DEUX CENTRIOLES placés PERPENDICULAIREMENT l'un par rapport à l'autre. En interphase, il est localisé PROCHE DU NOYAU. Lors de la division cellulaire, il organise le FUSEAU MITOTIQUE. Le centre de la mitochondrie s'appelle la MATRICE. Le centre de tri de l'appareil de Golgi n'a pas de nom spécifique isolé dans ce cours."
  },
  {
    type: "qcm",
    question: "Quelle est la structure commune aux cils et aux flagelles ?",
    options: [
      "9 doublets périphériques + 1 doublet central (structure '9+1').",
      "9 doublets périphériques + 1 doublet central, avec bras radiaires, gaine interne, bras de dynéines et ponts de nexine.",
      "18 microtubules simples disposés en cercle autour d'un microtubule central unique."
    ],
    answer: "9 doublets périphériques + 1 doublet central, avec bras radiaires, gaine interne, bras de dynéines et ponts de nexine.",
    explanation: "Cils et flagelles partagent un schéma structural commun appelé axonème : 9 DOUBLETS PÉRIPHÉRIQUES + 1 DOUBLET CENTRAL (structure '9+2'), avec BRAS RADIAIRES, GAINE INTERNE, BRAS DE DYNÉINES (protéines motrices) et PONTS DE NEXINE. La première option simplifie correctement (9+1 doublet central) mais omet les structures protéiques associées essentielles. La troisième option (18 microtubules simples) est complètement fausse — les éléments sont des DOUBLETS, pas des microtubules simples."
  },
  {
    type: "qcm",
    question: "Quelle est la taille approximative du noyau cellulaire, et combien de noyaux trouve-t-on habituellement par cellule ?",
    options: [
      "1 à 2 µm de diamètre ; toujours un seul noyau par cellule.",
      "5 à 7 µm de diamètre ; en général un noyau par cellule, sauf érythrocytes (sans noyau) et cellules hépatiques (souvent 2 noyaux).",
      "10 à 20 µm de diamètre ; le nombre de noyaux est variable et non régulé."
    ],
    answer: "5 à 7 µm de diamètre ; en général un noyau par cellule, sauf érythrocytes (sans noyau) et cellules hépatiques (souvent 2 noyaux).",
    explanation: "Le NOYAU mesure environ 5 à 7 µm de diamètre. En général, il y a UN NOYAU par cellule. Mais il existe des exceptions notables : les ÉRYTHROCYTES (globules rouges des mammifères) sont ANUCLÉÉS (sans noyau) et les CELLULES HÉPATIQUES (hépatocytes) ont souvent 2 NOYAUX. Les cellules musculaires striées squelettiques ont plusieurs noyaux (syncytium). Le noyau n'est donc pas universellement présent ni unique — c'est un piège classique d'examen."
  },
  {
    type: "qcm",
    question: "Quelle est la relation entre la membrane nucléaire externe et le réticulum endoplasmique ?",
    options: [
      "La membrane nucléaire externe est en continuité avec les membranes du réticulum endoplasmique rugueux (RER).",
      "La membrane nucléaire externe est en continuité avec la membrane plasmique via des tunnels cytoplasmiques.",
      "La membrane nucléaire externe est totalement indépendante du RE et ne communique avec aucune autre membrane."
    ],
    answer: "La membrane nucléaire externe est en continuité avec les membranes du réticulum endoplasmique rugueux (RER).",
    explanation: "La MEMBRANE NUCLÉAIRE EXTERNE est en CONTINUITÉ directe avec les membranes du RÉTICULUM ENDOPLASMIQUE RUGUEUX (RER). C'est pourquoi les RE découlent de la membrane nucléaire. Cette continuité physique explique aussi pourquoi la membrane externe du noyau peut porter des ribosomes. La membrane interne, elle, est recouverte de la LAMINA NUCLÉAIRE (protéique). Le noyau n'est pas en continuité avec la membrane plasmique."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre l'euchromatine et l'hétérochromatine ?",
    options: [
      "L'euchromatine est condensée et transcriptionnellement inactive ; l'hétérochromatine est décondensée et active.",
      "L'euchromatine est décondensée et transcriptionnellement active ; l'hétérochromatine est condensée et transcriptionnellement inactive.",
      "L'euchromatine et l'hétérochromatine sont deux noms synonymes pour la même forme de chromatine."
    ],
    answer: "L'euchromatine est décondensée et transcriptionnellement active ; l'hétérochromatine est condensée et transcriptionnellement inactive.",
    explanation: "EUCHROMATINE : chromatine DÉCONDENSÉE, accessible aux enzymes de transcription → TRANSCRIPTIONNELLEMENT ACTIVE (les gènes sont exprimés). HÉTÉROCHROMATINE : chromatine CONDENSÉE, inaccessible → TRANSCRIPTIONNELLEMENT INACTIVE (les gènes sont silencieux). La première option INVERSE les deux définitions — c'est le piège classique. Le préfixe 'eu' (vrai, bon) désigne la forme active ; 'hétéro' (différent) désigne la forme compactée et inactive."
  },
  {
    type: "qcm",
    question: "Quel est le rôle du nucléole, et que produit-il ?",
    options: [
      "Il stocke l'ADN chromosomique et le protège de la dégradation enzymatique.",
      "Il synthèse l'ARN ribosomique (ARNr) avec des protéines importées du cytoplasme, contribuant ainsi à la fabrication des ribosomes.",
      "Il produit de l'ATP pour alimenter les échanges entre le noyau et le cytoplasme via les pores nucléaires."
    ],
    answer: "Il synthèse l'ARN ribosomique (ARNr) avec des protéines importées du cytoplasme, contribuant ainsi à la fabrication des ribosomes.",
    explanation: "Le NUCLÉOLE est une masse opaque de granules et fibres associés à la chromatine. Son rôle est de synthétiser l'ARN RIBOSOMIQUE (ARNr) en association avec des PROTÉINES importées du cytoplasme, contribuant à la fabrication des RIBOSOMES. Il ne stocke pas l'ADN chromosomique (c'est la chromatine qui le contient). La production d'ATP est le rôle des MITOCHONDRIES. Le nucléole DISPARAÎT lors de la division cellulaire (prophase) puis se REFORME en télophase."
  },
  {
    type: "qcm",
    question: "Combien de pores nucléaires un noyau possède-t-il, et quelle est leur fonction ?",
    options: [
      "2 à 6 pores par noyau ; ils permettent uniquement l'entrée de l'ARN vers le cytoplasme.",
      "2 000 à 6 000 pores par noyau ; ils assurent la communication entre le nucléoplasme et le cytoplasme (échanges bidirectionnels).",
      "20 000 à 60 000 pores par noyau ; ils assurent exclusivement la sortie de l'ADN vers le cytoplasme."
    ],
    answer: "2 000 à 6 000 pores par noyau ; ils assurent la communication entre le nucléoplasme et le cytoplasme (échanges bidirectionnels).",
    explanation: "Un noyau possède entre 2 000 et 6 000 PORES NUCLÉAIRES, couvrant environ le TIERS de la membrane nucléaire. Ces pores assurent la COMMUNICATION BIDIRECTIONNELLE entre le NUCLÉOPLASME et le CYTOPLASME : sortie des ARNm vers le cytoplasme, entrée des protéines (histones, facteurs de transcription) vers le noyau. La valeur '2 à 6 pores' est une réduction absurde. L'ADN ne sort PAS du noyau via les pores — c'est l'ARN qui en sort."
  }
] },
        { nom: "Cycle cellulaire et Meiose", quiz: [
  {
    type: "qcm",
    question: "Quelle est la définition exacte du cycle cellulaire ?",
    options: [
      "Un processus par lequel une cellule produit de l'ATP pour assurer ses fonctions métaboliques.",
      "Un processus bien ordonné au cours duquel une cellule se divise en deux cellules filles identiques.",
      "Un processus par lequel une cellule se différencie en un type cellulaire spécialisé."
    ],
    answer: "Un processus bien ordonné au cours duquel une cellule se divise en deux cellules filles identiques.",
    explanation: "Le CYCLE CELLULAIRE est défini comme un PROCESSUS BIEN ORDONNÉ au cours duquel une cellule se divise en DEUX CELLULES FILLES IDENTIQUES. C'est le mécanisme essentiel de reproduction de tous les êtres vivants. La production d'ATP est une fonction métabolique continue, pas un processus cyclique. La DIFFÉRENCIATION est un processus distinct qui aboutit à des cellules DIFFÉRENTES — l'opposé de la division cellulaire qui produit des cellules IDENTIQUES."
  },
  {
    type: "qcm",
    question: "Quelles sont les trois phases de l'interphase, et dans quel ordre se succèdent-elles ?",
    options: [
      "S → G1 → G2.",
      "G1 → S → G2.",
      "G2 → G1 → S."
    ],
    answer: "G1 → S → G2.",
    explanation: "L'INTERPHASE se compose de trois phases dans cet ordre strict : G1 (croissance et synthèse protéique) → S (Synthèse = réplication de l'ADN) → G2 (préparation à la division). Toute inversion de cet ordre est biologically impossible : on ne peut pas dupliquer l'ADN (S) avant d'avoir les ressources suffisantes (G1), ni entrer en mitose (M) avant de vérifier que la duplication est complète (G2). L'ordre G1→S→G2 est un repère fondamental d'examen."
  },
  {
    type: "qcm",
    question: "Que signifie 'G' dans G1 et G2, et que représente G0 ?",
    options: [
      "G = Génétique ; G0 = phase où la cellule corrige ses erreurs génétiques avant division.",
      "G = Gap (espace ou intervalle) ; G0 = caractérise les cellules ayant perdu leur capacité de division (ex. globules rouges, cellules musculaires).",
      "G = Globule ; G0 = phase transitoire entre la fin de S et le début de la mitose."
    ],
    answer: "G = Gap (espace ou intervalle) ; G0 = caractérise les cellules ayant perdu leur capacité de division (ex. globules rouges, cellules musculaires).",
    explanation: "'G' signifie GAP = espace ou intervalle en anglais. G0 caractérise les cellules ayant PERDU DÉFINITIVEMENT leur capacité mitotique — exemples du cours : cellules MUSCULAIRES et GLOBULES ROUGES. Ces cellules sont 'sorties' du cycle cellulaire de façon irréversible. G ne signifie pas 'génétique' ni 'globule'. G0 n'est pas une phase transitoire : c'est une sortie PERMANENTE du cycle."
  },
  {
    type: "qcm",
    question: "Quelle est la quantité d'ADN (en Q) au début et à la fin de la phase S ?",
    options: [
      "Début S : 4Q → Fin S : 2Q (l'ADN est coupé en deux pour préparer la division).",
      "Début S : 2Q → Fin S : 4Q (l'ADN est dupliqué par réplication).",
      "Début S : 2Q → Fin S : 2Q (la quantité d'ADN ne change pas pendant la synthèse)."
    ],
    answer: "Début S : 2Q → Fin S : 4Q (l'ADN est dupliqué par réplication).",
    explanation: "La phase S est la phase de SYNTHÈSE : l'ADN est RÉPLIQUÉ par des ADN polymérases. La quantité d'ADN DOUBLE : de 2Q au début à 4Q à la fin. À la fin de S, chaque molécule d'ADN existe en DOUBLE EXEMPLAIRE correspondant aux deux CHROMATIDES SŒURS. La première option INVERSE le sens — l'ADN augmente, il ne diminue pas. La troisième option est fausse : la phase S est définie précisément par cette augmentation de quantité d'ADN."
  },
  {
    type: "qcm",
    question: "Quelles protéines sont synthétisées spécifiquement pendant la phase S, et pourquoi ?",
    options: [
      "Des facteurs de croissance, pour stimuler la division des cellules voisines.",
      "Des histones, qui seront associées à l'ADN nouvellement répliqué pour former la chromatine.",
      "Des cyclines, pour activer les CDK et déclencher la mitose immédiatement après la réplication."
    ],
    answer: "Des histones, qui seront associées à l'ADN nouvellement répliqué pour former la chromatine.",
    explanation: "Pendant la phase S, en plus de la réplication de l'ADN, la cellule synthétise des HISTONES qui s'associeront à l'ADN nouvellement répliqué pour former la CHROMATINE (complexe ADN + histones = nucléosomes). Cette synthèse est couplée à la réplication car chaque nouvelle molécule d'ADN doit immédiatement être emballée. Les FACTEURS DE CROISSANCE sont synthétisés en G1. Les CYCLINES sont synthétisées et dégradées à différents moments du cycle — pas spécifiquement en S."
  },
  {
    type: "qcm",
    question: "Quel signal déclenche la mitose à la fin de la phase G2 ?",
    options: [
      "La phosphorylation des histones par la CDK4, qui condense la chromatine en chromosomes.",
      "L'activation du MPF (Facteur Promoteur de Mitose = complexe Cycline/p34cdk2) par déphosphorylation.",
      "La synthèse complète des microtubules du fuseau, qui envoie un signal au noyau."
    ],
    answer: "L'activation du MPF (Facteur Promoteur de Mitose = complexe Cycline/p34cdk2) par déphosphorylation.",
    explanation: "À la fin de G2, une DÉPHOSPHORYLATION active le MPF (MATURATION/MITOSIS PROMOTING FACTOR), complexe Cycline/p34cdk2, qui DÉCLENCHE LA MITOSE. C'est le signal moléculaire de passage de G2 à M. La phosphorylation des histones est une conséquence de l'activation du MPF, pas le déclencheur. Les microtubules se forment APRÈS le déclenchement de la mitose, pas avant."
  },
  {
    type: "qcm",
    question: "Pendant la prophase de la mitose, quels sont les événements principaux ? (ordre logique)",
    options: [
      "Les chromosomes s'alignent sur la plaque équatoriale ; les centromères se divisent.",
      "Les centrioles se divisent et forment les asters ; l'enveloppe nucléaire se rompt ; le fuseau achromatique se forme ; les chromosomes se condensent et deviennent visibles.",
      "Les chromatides se séparent et migrent vers les pôles ; la cellule s'allonge."
    ],
    answer: "Les centrioles se divisent et forment les asters ; l'enveloppe nucléaire se rompt ; le fuseau achromatique se forme ; les chromosomes se condensent et deviennent visibles.",
    explanation: "En PROPHASE (~45 min) : division des CENTRIOLES et formation des ASTERS, RUPTURE de l'enveloppe nucléaire, formation du FUSEAU ACHROMATIQUE (microtubules), CONDENSATION des chromosomes qui deviennent visibles. L'alignement sur la plaque équatoriale est la MÉTAPHASE. La séparation des chromatides et la migration aux pôles sont l'ANAPHASE. Confondre ces étapes est le piège classique de ce chapitre."
  },
  {
    type: "qcm",
    question: "Pendant la métaphase de la mitose, que se passe-t-il exactement au niveau des centromères ?",
    options: [
      "Les centromères se divisent, libérant les deux chromatides sœurs qui migrent vers les pôles.",
      "Les chromosomes s'alignent sur la plaque équatoriale ; les centromères NE SE DIVISENT PAS encore ; le kinétochore s'attache aux microtubules du fuseau.",
      "Les centromères se dissolvent et l'ADN se décondense pour permettre la transcription."
    ],
    answer: "Les chromosomes s'alignent sur la plaque équatoriale ; les centromères NE SE DIVISENT PAS encore ; le kinétochore s'attache aux microtubules du fuseau.",
    explanation: "En MÉTAPHASE (~5 min) : les chromosomes s'alignent sur la PLAQUE ÉQUATORIALE au centre de la cellule. Chaque chromatide développe un KINÉTOCHORE dans sa région centromérique qui attire et se lie aux microtubules du fuseau. IMPORTANT : les centromères NE SE DIVISENT PAS en métaphase — leur division se produit en ANAPHASE. C'est le piège classique : confondre l'alignement (métaphase) et la séparation (anaphase)."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qui se produit exactement en anaphase de la mitose ?",
    options: [
      "Les chromosomes homologues se séparent et migrent vers les pôles, réduisant le nombre chromosomique de moitié.",
      "Les centromères se dédoublent ; chaque chromosome donne 2 chromosomes-fils identiques qui migrent vers les pôles opposés.",
      "L'enveloppe nucléaire se reforme autour des chromosomes massés aux pôles."
    ],
    answer: "Les centromères se dédoublent ; chaque chromosome donne 2 chromosomes-fils identiques qui migrent vers les pôles opposés.",
    explanation: "En ANAPHASE (~2 min) : les CENTROMÈRES SE DÉDOUBLENT, libérant les deux chromatides sœurs. Chaque chromosome donne 2 CHROMOSOMES-FILS IDENTIQUES qui migrent vers les PÔLES OPPOSÉS. Le nombre de chromosomes DOUBLE momentanément (4n) avant que la cellule se divise. La séparation des CHROMOSOMES HOMOLOGUES (avec réduction du nombre) est caractéristique de l'ANAPHASE I DE LA MÉIOSE — c'est le piège le plus classique. La reformation de l'enveloppe nucléaire est la TÉLOPHASE."
  },
  {
    type: "qcm",
    question: "Quel est le résultat final de la mitose en termes de nombre de cellules et de contenu en ADN ?",
    options: [
      "4 cellules haploïdes (n, Q) génétiquement différentes.",
      "2 cellules diploïdes (2n, 2Q) génétiquement identiques à la cellule mère.",
      "2 cellules diploïdes (2n, 4Q) avec le double d'ADN de la cellule mère."
    ],
    answer: "2 cellules diploïdes (2n, 2Q) génétiquement identiques à la cellule mère.",
    explanation: "La MITOSE produit 2 CELLULES FILLES DIPLOÏDES (2n) contenant chacune 2Q d'ADN — identiques à la cellule mère. 4 cellules haploïdes génétiquement différentes est le résultat de la MÉIOSE. 2 cellules à 4Q serait le résultat si la cytodiérèse ne se produisait pas — mais après la télophase et la cytodiérèse, l'ADN revient à 2Q par cellule. Ces trois résultats sont régulièrement confondus en examen."
  },
  {
    type: "qcm",
    question: "Quelle est la relation entre une CDK et une cycline dans la régulation du cycle cellulaire ?",
    options: [
      "Une CDK est active seule ; la cycline l'inhibe pour arrêter le cycle.",
      "Une CDK seule est INACTIVE ; elle doit s'associer à une cycline spécifique pour former un complexe ACTIF capable de phosphoryler des protéines cibles.",
      "Une cycline seule est active ; elle phosphoryle directement les substrats sans CDK."
    ],
    answer: "Une CDK seule est INACTIVE ; elle doit s'associer à une cycline spécifique pour former un complexe ACTIF capable de phosphoryler des protéines cibles.",
    explanation: "Les CDK (Kinases Cycline-Dépendantes) sont INACTIVES SEULES. Elles doivent s'associer à une CYCLINE spécifique pour former un complexe ACTIF qui PHOSPHORYLE des protéines cibles, déclenchant l'étape suivante du cycle. Les cyclines sont synthétisées et dégradées cycliquement — c'est leur fluctuation qui contrôle QUAND les CDK s'activent. Ni la CDK seule ni la cycline seule ne sont actives — l'association est indispensable."
  },
  {
    type: "qcm",
    question: "Quelles cyclines s'associent avec quelles CDK pendant la phase G1 ?",
    options: [
      "Les cyclines A s'associent avec CDK1 pour déclencher la réplication de l'ADN.",
      "Les cyclines D1, D2 et D3 s'associent avec CDK4 ou CDK6, formant des complexes qui phosphorylent RB1/E2F et stimulent l'expression de gènes de la synthèse d'ADN.",
      "Les cyclines E s'associent avec CDK2 pour déclencher directement la mitose depuis G1."
    ],
    answer: "Les cyclines D1, D2 et D3 s'associent avec CDK4 ou CDK6, formant des complexes qui phosphorylent RB1/E2F et stimulent l'expression de gènes de la synthèse d'ADN.",
    explanation: "En G1, ce sont les CYCLINES D1, D2, D3 qui s'associent avec CDK4 ou CDK6. Ces complexes phosphorylent RB1/E2F → la phosphorylation LIBÈRE E2F qui entre dans le noyau et stimule l'expression de gènes contrôlant la SYNTHÈSE DE L'ADN (transition G1→S). Les cyclines A/CDK1 interviennent plus tard (phase S et M). Ce mécanisme précis (RB1/E2F) est souvent posé en examen pour tester la maîtrise des détails de la régulation."
  },
  {
    type: "qcm",
    question: "Qui a décrit la méiose pour la première fois, et dans quel contexte ?",
    options: [
      "Virchow, en 1858, lors de ses travaux sur la théorie cellulaire.",
      "Edouard van Beneden, en 1880, dans ses travaux sur les nématodes parasites de l'intestin du cheval (Ascaris megalocephala).",
      "Flemming, en 1875, lors de la découverte des chromosomes dans les cellules végétales."
    ],
    answer: "Edouard van Beneden, en 1880, dans ses travaux sur les nématodes parasites de l'intestin du cheval (Ascaris megalocephala).",
    explanation: "La MÉIOSE a été décrite pour la première fois par l'embryologiste EDOUARD VAN BENEDEN en 1880, lors de ses travaux sur les NÉMATODES PARASITES de l'intestin du cheval, Ascaris megalocephala. VIRCHOW (1858) a formulé 'omnis cellula e cellula'. FLEMMING (1875) a découvert les CHROMOSOMES — une contribution différente. Ces auteurs et dates sont souvent mélangés dans les QCM."
  },
  {
    type: "qcm",
    question: "Pourquoi la méiose est-elle qualifiée de 'division réductionnelle' pour sa première division ?",
    options: [
      "Car elle réduit la quantité d'énergie (ATP) consommée par la cellule lors de la division.",
      "Car elle réduit de moitié le nombre de chromosomes : de 2n (diploïde) à n (haploïde), par séparation des chromosomes homologues.",
      "Car elle réduit le temps de division par rapport à la mitose."
    ],
    answer: "Car elle réduit de moitié le nombre de chromosomes : de 2n (diploïde) à n (haploïde), par séparation des chromosomes homologues.",
    explanation: "La MÉIOSE I est dite RÉDUCTIONNELLE car elle RÉDUIT DE MOITIÉ le nombre de chromosomes : de 2n (diploïde) à n (haploïde). Cela se fait par la SÉPARATION DES CHROMOSOMES HOMOLOGUES (pas des chromatides sœurs). C'est fondamentalement différent de la mitose où le nombre reste 2n. La MÉIOSE II est dite ÉQUATIONNELLE car elle sépare les chromatides sœurs sans changer le nombre haploïde (comme une mitose à n chromosomes)."
  },
  {
    type: "qcm",
    question: "Qu'est-ce que le crossing-over et à quelle étape de la méiose se produit-il ?",
    options: [
      "Un échange de fragments entre chromatides NON-homologues, se produisant en Métaphase I.",
      "Un échange de fragments de chromatides homologues (recombinaison), se produisant en Prophase I lors de l'appariement des chromosomes homologues (tétrades/bivalents).",
      "Une duplication supplémentaire de l'ADN, se produisant entre la méiose I et la méiose II."
    ],
    answer: "Un échange de fragments de chromatides homologues (recombinaison), se produisant en Prophase I lors de l'appariement des chromosomes homologues (tétrades/bivalents).",
    explanation: "Le CROSSING-OVER est un échange de fragments entre CHROMATIDES HOMOLOGUES (pas entre chromatides non-homologues) se produisant en PROPHASE I, lors de l'appariement des chromosomes homologues qui forment des TÉTRADES (ou BIVALENTS = 4 chromatides). C'est la source du BRASSAGE INTRA-CHROMOSOMIQUE — une des deux sources de diversité génétique de la méiose. Il n'y a PAS de réplication d'ADN entre méiose I et méiose II — c'est explicitement indiqué dans le cours."
  },
  {
    type: "qcm",
    question: "Quelle est la différence cruciale entre la Métaphase I (méiose) et la Métaphase (mitose) concernant les centromères ?",
    options: [
      "En Métaphase I et en Métaphase, les centromères se divisent dans les deux cas.",
      "En Métaphase (mitose) : les centromères ne se divisent pas encore. En Métaphase I (méiose) : les centromères ne se divisent pas non plus — les chromosomes homologues sont de part et d'autre de la plaque équatoriale.",
      "En Métaphase (mitose) : les centromères se divisent. En Métaphase I (méiose) : les centromères ne se divisent pas."
    ],
    answer: "En Métaphase (mitose) : les centromères ne se divisent pas encore. En Métaphase I (méiose) : les centromères ne se divisent pas non plus — les chromosomes homologues sont de part et d'autre de la plaque équatoriale.",
    explanation: "Dans les DEUX CAS (Métaphase mitose et Métaphase I méiose), les centromères NE SE DIVISENT PAS. La différence est dans la DISPOSITION : en Métaphase mitose, chaque chromosome individuel est aligné à l'équateur avec ses deux chromatides ; en Métaphase I méiose, ce sont les PAIRES DE CHROMOSOMES HOMOLOGUES qui se placent de PART ET D'AUTRE de la plaque équatoriale. Les centromères ne se divisent qu'en ANAPHASE (mitose) et ANAPHASE II (méiose II)."
  },
  {
    type: "qcm",
    question: "Pourquoi l'Anaphase I de la méiose est-elle fondamentalement différente de l'Anaphase de la mitose ?",
    options: [
      "En Anaphase I : les CENTROMÈRES SE DIVISENT et les chromatides sœurs se séparent. En Anaphase mitose : les chromosomes homologues entiers migrent.",
      "En Anaphase I : chaque CHROMOSOME ENTIER DUPLIQUÉ (2 chromatides) migre vers un pôle ; les chromosomes homologues se séparent de façon ALÉATOIRE. En Anaphase mitose : les centromères se divisent et les chromatides sœurs se séparent.",
      "Il n'y a aucune différence : dans les deux cas, les chromatides sœurs se séparent et migrent aux pôles."
    ],
    answer: "En Anaphase I : chaque CHROMOSOME ENTIER DUPLIQUÉ (2 chromatides) migre vers un pôle ; les chromosomes homologues se séparent de façon ALÉATOIRE. En Anaphase mitose : les centromères se divisent et les chromatides sœurs se séparent.",
    explanation: "C'est LA différence clé entre mitose et méiose I : en ANAPHASE I, les CHROMOSOMES HOMOLOGUES SE SÉPARENT (chacun migre entier avec ses 2 chromatides encore liées) de façon ALÉATOIRE → brassage inter-chromosomique. Les centromères NE SE DIVISENT PAS en Anaphase I. En ANAPHASE MITOSE, les CENTROMÈRES SE DIVISENT et les CHROMATIDES SŒURS se séparent. Cette différence est la question clé du chapitre et une question d'examen classique."
  },
  {
    type: "qcm",
    question: "Pourquoi n'y a-t-il pas de réplication d'ADN entre la méiose I et la méiose II ?",
    options: [
      "Car les enzymes ADN polymérase sont détruites à la fin de la méiose I.",
      "Car les cellules issues de la méiose I sont déjà à 4Q d'ADN et n'ont pas besoin de dupliquer davantage.",
      "Car la méiose II est une division ÉQUATIONNELLE qui sépare les chromatides sœurs déjà existantes — une nouvelle réplication doublerait inutilement l'information génétique.",
      ],
    answer: "Car la méiose II est une division ÉQUATIONNELLE qui sépare les chromatides sœurs déjà existantes — une nouvelle réplication doublerait inutilement l'information génétique.",
    explanation: "Il n'y a PAS de réplication entre méiose I et méiose II car la méiose II est une division ÉQUATIONNELLE dont le but est de SÉPARER LES CHROMATIDES SŒURS déjà présentes depuis la phase S initiale. Une réplication produirait 8 chromatides au lieu de 4 — inutile et génétiquement incorrect. Les cellules issues de méiose I sont à n chromosomes, chacun à 2 chromatides (2Q) — pas à 4Q. Les ADN polymérases ne sont pas détruites — elles sont simplement non-activées."
  },
  {
    type: "qcm",
    question: "Quelles sont les deux sources de diversité génétique produites par la méiose ?",
    options: [
      "Les mutations aléatoires de l'ADN et la réplication semi-conservative.",
      "Le brassage INTRA-chromosomique (crossing-over en Prophase I) et le brassage INTER-chromosomique (séparation aléatoire des chromosomes homologues en Anaphase I).",
      "La condensation des chromosomes en Prophase I et la division des centromères en Anaphase II."
    ],
    answer: "Le brassage INTRA-chromosomique (crossing-over en Prophase I) et le brassage INTER-chromosomique (séparation aléatoire des chromosomes homologues en Anaphase I).",
    explanation: "La méiose produit de la diversité génétique via DEUX mécanismes : (1) BRASSAGE INTRA-CHROMOSOMIQUE : le CROSSING-OVER en Prophase I échange des fragments entre chromatides homologues → nouvelles combinaisons d'allèles sur un même chromosome. (2) BRASSAGE INTER-CHROMOSOMIQUE : la SÉPARATION ALÉATOIRE des chromosomes homologues en Anaphase I → combinaisons indépendantes de chromosomes d'origines paternelle et maternelle. Les mutations sont une source de diversité mais ne font pas partie de la méiose elle-même."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre la différenciation cellulaire et la division cellulaire ?",
    options: [
      "La différenciation et la division produisent toutes les deux des cellules identiques à la cellule mère.",
      "La DIVISION (mitose) produit des cellules identiques à la cellule mère ; la DIFFÉRENCIATION est le processus par lequel une cellule embryonnaire acquiert une identité spécialisée (neurone, cellule épidermique...), perdant progressivement sa pluripotence.",
      "La différenciation augmente le nombre de cellules ; la division spécialise les cellules existantes."
    ],
    answer: "La DIVISION (mitose) produit des cellules identiques à la cellule mère ; la DIFFÉRENCIATION est le processus par lequel une cellule embryonnaire acquiert une identité spécialisée (neurone, cellule épidermique...), perdant progressivement sa pluripotence.",
    explanation: "La DIVISION CELLULAIRE (mitose) produit des cellules IDENTIQUES (même ADN, même type). La DIFFÉRENCIATION CELLULAIRE est un processus DISTINCT par lequel une cellule embryonnaire initialement totipotente acquiert progressivement une identité SPÉCIALISÉE (neurone, cellule musculaire...) en activant certains gènes et en réprimant d'autres. Les deux processus se combinent dans le développement : multiplication d'abord, puis spécialisation. La troisième option INVERSE les rôles."
  }
] },
        { nom: "Cycle de la vie", quiz: [
  {
    type: "qcm",
    question: "Quelle est la définition exacte du cycle de vie biologique ?",
    options: [
      "La durée moyenne de vie d'un individu de l'espèce, de sa naissance à sa mort naturelle.",
      "L'ensemble des transformations par lesquelles les individus d'une espèce peuvent passer pour assurer leur continuité.",
      "Le nombre de générations successives que peut produire une espèce en une année."
    ],
    answer: "L'ensemble des transformations par lesquelles les individus d'une espèce peuvent passer pour assurer leur continuité.",
    explanation: "Le CYCLE DE VIE BIOLOGIQUE est défini dans le cours comme L'ENSEMBLE DES TRANSFORMATIONS par lesquelles les individus d'une espèce passent pour assurer leur CONTINUITÉ. Ce n'est pas la durée de vie d'un individu (c'est l'espérance de vie) ni le nombre de générations par an (c'est le taux de reproduction). L'exemple du cours est le cycle de vie d'une POULE : œuf → poussin → poule adulte → ponte → œuf..."
  },
  {
    type: "qcm",
    question: "Quels sont les deux événements fondamentaux qui se succèdent dans tout cycle de vie sexué ?",
    options: [
      "La mitose et la cytodiérèse.",
      "La méiose (2n → n) et la fécondation (n + n → 2n).",
      "La réplication de l'ADN et la différenciation cellulaire."
    ],
    answer: "La méiose (2n → n) et la fécondation (n + n → 2n).",
    explanation: "Dans tout cycle de vie SEXUÉ, deux événements sont indispensables et se succèdent : la MÉIOSE qui réduit le nombre de chromosomes de 2n à n (passage du diploïde au haploïde) et la FÉCONDATION qui combine deux gamètes haploïdes pour rétablir la diploïdie (n + n → 2n). La classification des cycles dépend du MOMENT et de la DURÉE de ces deux événements dans la vie de l'organisme. La mitose et la cytodiérèse concernent la division cellulaire ordinaire, pas les cycles de vie."
  },
  {
    type: "qcm",
    question: "Combien de types de cycles de vie sont décrits dans le cours, et quels sont-ils ?",
    options: [
      "Deux types : haplophasique et diplophasique.",
      "Trois types : haplophasique, diplophasique et mixte.",
      "Quatre types : haplophasique, diplophasique, mixte et parthénogénétique."
    ],
    answer: "Trois types : haplophasique, diplophasique et mixte.",
    explanation: "Le cours décrit TROIS types de cycles de vie : (1) HAPLOPHASIQUE : phase haploïde prédominante ; (2) DIPLOPHASIQUE : phase diploïde prédominante ; (3) MIXTE : alternance équilibrée des deux phases. La parthénogenèse est un MODE DE REPRODUCTION (développement d'un ovocyte sans fécondation) — pas un type de cycle de vie. Ces trois types se distinguent par la PROPORTION relative du temps passé à l'état haploïde ou diploïde."
  },
  {
    type: "qcm",
    question: "Dans un cycle haplophasique, quelle phase est prédominante, et quel est le stade diploïde ?",
    options: [
      "La phase DIPLOÏDE (2n) est prédominante ; les gamètes haploïdes ne durent que quelques heures.",
      "La phase HAPLOÏDE (n) est prédominante ; le stade diploïde (zygote, 2n) est très réduit dans le temps et dans l'espace.",
      "Les deux phases sont strictement équilibrées ; ni l'une ni l'autre ne prédomine."
    ],
    answer: "La phase HAPLOÏDE (n) est prédominante ; le stade diploïde (zygote, 2n) est très réduit dans le temps et dans l'espace.",
    explanation: "Dans le cycle HAPLOPHASIQUE, la phase HAPLOÏDE (n) est PRÉDOMINANTE. Le cours précise que les individus qui se rencontrent sont assimilables à des GAMÈTES (n chromosomes). Le stade DIPLOÏDE (zygote : 2n chromosomes) est TRÈS RÉDUIT dans le temps et dans l'espace — le zygote fait aussitôt une méiose pour revenir à l'état haploïde. La première option décrit le cycle DIPLOPHASIQUE. La troisième option décrit le cycle MIXTE."
  },
  {
    type: "qcm",
    question: "Quels organismes ont un cycle haplophasique ?",
    options: [
      "Les animaux, notamment les mammifères et les oiseaux.",
      "Certaines algues, champignons et protozoaires.",
      "Les plantes à fleurs (angiospermes) uniquement."
    ],
    answer: "Certaines algues, champignons et protozoaires.",
    explanation: "Les exemples de cycle HAPLOPHASIQUE donnés dans le cours sont : CERTAINES ALGUES, CHAMPIGNONS et PROTOZOAIRES. Ces organismes passent la majorité de leur existence à l'état haploïde. Les ANIMAUX (mammifères, oiseaux) ont un cycle DIPLOPHASIQUE. Les PLANTES À FLEURS ont généralement un cycle MIXTE ou diplophasique selon les espèces — ce n'est pas un exemple du cours pour le haplophasique."
  },
  {
    type: "qcm",
    question: "Dans un cycle diplophasique, quelle phase est réduite, et à quoi est-elle limitée ?",
    options: [
      "La phase DIPLOÏDE est réduite au stade zygote uniquement.",
      "La phase HAPLOÏDE est réduite aux GAMÈTES uniquement.",
      "Il n'y a pas de phase réduite ; diploïde et haploïde alternent de façon équilibrée."
    ],
    answer: "La phase HAPLOÏDE est réduite aux GAMÈTES uniquement.",
    explanation: "Dans le cycle DIPLOPHASIQUE, le cours précise que 'la phase haploïde est réduite aux GAMÈTES'. L'organisme passe presque toute sa vie à l'état DIPLOÏDE (2n). Seuls les gamètes (spermatozoïdes et ovules) sont haploïdes, et leur durée de vie est très courte. C'est le cycle de L'HOMME et des animaux. La phase diploïde réduite au seul zygote décrit le cycle HAPLOPHASIQUE. L'alternance équilibrée décrit le cycle MIXTE."
  },
  {
    type: "qcm",
    question: "Quel type de cycle de vie est propre à l'Homme ?",
    options: [
      "Haplophasique, car l'Homme passe la majeure partie de sa vie à produire des gamètes haploïdes.",
      "Mixte, car l'Homme alterne entre des phases haploïdes (enfance) et diploïdes (adulte).",
      "Diplophasique, car toutes les cellules somatiques de l'Homme sont diploïdes (2n = 46), et seuls les gamètes sont haploïdes (n = 23)."
    ],
    answer: "Diplophasique, car toutes les cellules somatiques de l'Homme sont diploïdes (2n = 46), et seuls les gamètes sont haploïdes (n = 23).",
    explanation: "L'HOMME a un cycle DIPLOPHASIQUE : TOUTES ses cellules somatiques sont DIPLOÏDES (2n = 46 chromosomes). Seuls les GAMÈTES (spermatozoïdes et ovules) sont haploïdes (n = 23). La phase haploïde est donc réduite au strict minimum — les gamètes ne vivent que quelques heures à quelques jours. L'Homme ne passe pas par une phase haploïde pendant l'enfance — il est diploïde depuis le zygote. Il n'y a pas d'alternance haploïde/diploïde au cours de la vie humaine."
  },
  {
    type: "qcm",
    question: "Qu'est-ce que le cycle mixte, et en quoi regroupe-t-il les caractéristiques des deux autres cycles ?",
    options: [
      "Le cycle mixte est un cycle où l'organisme peut choisir entre reproduction sexuée et asexuée selon les conditions du milieu.",
      "Le cycle mixte regroupe simultanément les caractéristiques des cycles haplophasique ET diplophasique : il y a une alternance de génération entre une phase haploïde significative et une phase diploïde significative.",
      "Le cycle mixte concerne les organismes hermaphrodites capables de se féconder eux-mêmes."
    ],
    answer: "Le cycle mixte regroupe simultanément les caractéristiques des cycles haplophasique ET diplophasique : il y a une alternance de génération entre une phase haploïde significative et une phase diploïde significative.",
    explanation: "Le cours définit le cycle MIXTE comme celui qui 'regroupe SIMULTANÉMENT les caractéristiques des cycles haplophasique et diplophasique'. Il y a une ALTERNANCE DE GÉNÉRATION : une génération haploïde (gamétophyte) alterne avec une génération diploïde (sporophyte), toutes deux ayant une durée significative. Ce n'est pas lié à la capacité de choisir entre modes de reproduction (ça c'est la plasticité reproductive). L'hermaphrodisme est un déterminisme sexuel — un concept différent."
  },
  {
    type: "qcm",
    question: "Dans le cycle haplophasique, à quel moment se produit la méiose par rapport à la fécondation ?",
    options: [
      "La méiose se produit AVANT la fécondation pour produire les gamètes haploïdes.",
      "La méiose se produit IMMÉDIATEMENT APRÈS la fécondation : le zygote diploïde fait aussitôt une méiose pour revenir à l'état haploïde.",
      "La méiose et la fécondation se produisent simultanément dans le zygote."
    ],
    answer: "La méiose se produit IMMÉDIATEMENT APRÈS la fécondation : le zygote diploïde fait aussitôt une méiose pour revenir à l'état haploïde.",
    explanation: "Dans le cycle HAPLOPHASIQUE, la MÉIOSE se produit IMMÉDIATEMENT APRÈS la FÉCONDATION : le ZYGOTE (2n), stade diploïde très court, fait aussitôt une méiose pour revenir à l'état HAPLOÏDE — qui est l'état prédominant. C'est l'inverse du cycle diplophasique, où la méiose est tardive (dans les gonades de l'adulte diploïde) et ne produit que les gamètes. La méiose et la fécondation ne se produisent jamais simultanément — ce sont deux événements distincts et séquentiels."
  },
  {
    type: "qcm",
    question: "Dans le cycle diplophasique, à quel moment précis passe-t-on de l'état diploïde à l'état haploïde ?",
    options: [
      "Lors de la fécondation : la fusion de deux gamètes haploïdes produit un zygote diploïde.",
      "Lors de la méiose dans les gonades : les cellules diploïdes germinales produisent des gamètes haploïdes.",
      "Lors de la naissance : l'organisme passe de l'état diploïde embryonnaire à l'état haploïde juvénile."
    ],
    answer: "Lors de la méiose dans les gonades : les cellules diploïdes germinales produisent des gamètes haploïdes.",
    explanation: "Dans le cycle DIPLOPHASIQUE de l'Homme : on passe de l'état DIPLOÏDE à HAPLOÏDE lors de la MÉIOSE dans les GONADES (testicules chez l'homme, ovaires chez la femme) — les cellules germinales diploïdes (2n) produisent des gamètes haploïdes (n). On passe de l'état HAPLOÏDE à DIPLOÏDE lors de la FÉCONDATION (n + n → 2n = zygote). La naissance n'entraîne aucun changement de ploïdie — le bébé est diploïde comme l'embryon."
  },
  {
    type: "qcm",
    question: "Pourquoi la méiose est-elle indispensable dans tout cycle de vie sexué ?",
    options: [
      "Car sans méiose, les cellules ne pourraient pas se diviser et l'organisme ne pourrait pas croître.",
      "Car sans méiose, la fécondation doublerait le nombre de chromosomes à chaque génération, rendant le génome ingérable au fil des générations.",
      "Car la méiose produit de l'énergie (ATP) nécessaire à la formation des gamètes."
    ],
    answer: "Car sans méiose, la fécondation doublerait le nombre de chromosomes à chaque génération, rendant le génome ingérable au fil des générations.",
    explanation: "La MÉIOSE est indispensable car elle RÉDUIT DE MOITIÉ le nombre de chromosomes (2n → n) avant la fécondation. Sans méiose, la FÉCONDATION (n + n → 2n) DOUBLERAIT le nombre de chromosomes à chaque génération : 46 → 92 → 184... Le génome deviendrait rapidement ingérable. La méiose maintient donc la CONSTANCE DU NOMBRE CHROMOSOMIQUE au fil des générations. La croissance de l'organisme est assurée par la MITOSE, pas la méiose. La méiose ne produit pas d'ATP."
  },
  {
    type: "qcm",
    question: "Dans quel type de cycle la phase diploïde est-elle la plus courte ?",
    options: [
      "Dans le cycle diplophasique.",
      "Dans le cycle mixte.",
      "Dans le cycle haplophasique."
    ],
    answer: "Dans le cycle haplophasique.",
    explanation: "Dans le cycle HAPLOPHASIQUE, la phase DIPLOÏDE (représentée par le zygote) est la PLUS COURTE — elle est 'très réduite dans le temps et dans l'espace' selon le cours. Le zygote fait immédiatement une méiose pour revenir à l'état haploïde dominant. Dans le cycle DIPLOPHASIQUE, c'est la phase HAPLOÏDE qui est la plus courte (réduite aux gamètes). Dans le cycle MIXTE, les deux phases ont une durée significative — aucune n'est extrêmement courte."
  },
  {
    type: "qcm",
    question: "Un champignon présente un cycle où les individus sont haploïdes la majeure partie de leur vie et ne forment une cellule diploïde que brièvement lors de la fécondation. Quel type de cycle est-ce ?",
    options: [
      "Diplophasique.",
      "Haplophasique.",
      "Mixte."
    ],
    answer: "Haplophasique.",
    explanation: "Ce champignon a un cycle HAPLOPHASIQUE : les individus sont HAPLOÏDES (n) la majeure partie de leur vie, et la cellule DIPLOÏDE (zygote, 2n) n'existe que brièvement lors de la fécondation avant de faire une méiose. C'est exactement la définition du cycle haplophasique du cours : 'le stade diploïde (zygote) est très réduit dans le temps et dans l'espace.' Les champignons sont d'ailleurs cités comme exemples classiques de ce cycle dans le cours."
  },
  {
    type: "qcm",
    question: "Les individus d'un cycle haplophasique sont-ils considérés comme des gamètes ? Pourquoi ?",
    options: [
      "Non, ils sont diploïdes et produisent des gamètes par méiose comme les animaux.",
      "Oui, car dans ce cycle les individus qui se rencontrent sont assimilables à des gamètes (n chromosomes) — ils sont eux-mêmes haploïdes.",
      "Non, ils sont des spores haploïdes qui n'ont pas de fonction reproductrice."
    ],
    answer: "Oui, car dans ce cycle les individus qui se rencontrent sont assimilables à des gamètes (n chromosomes) — ils sont eux-mêmes haploïdes.",
    explanation: "Le cours précise explicitement que dans le cycle HAPLOPHASIQUE, 'les individus qui se rencontrent sont ASSIMILABLES À DES GAMÈTES (n chromosomes)'. Autrement dit, l'organisme haploïde lui-même joue le rôle de gamète — il peut directement fusionner avec un autre organisme haploïde lors de la fécondation. C'est fondamentalement différent du cycle diplophasique où les gamètes sont des cellules spécialisées PRODUITES PAR un organisme diploïde. La notion de spore n'est pas introduite dans ce chapitre du cours."
  },
  {
    type: "qcm",
    question: "Dans quel type de cycle la fécondation rétablit-elle la diploïdie pour une durée très longue ?",
    options: [
      "Dans le cycle haplophasique.",
      "Dans le cycle mixte.",
      "Dans le cycle diplophasique."
    ],
    answer: "Dans le cycle diplophasique.",
    explanation: "Dans le cycle DIPLOPHASIQUE, la FÉCONDATION rétablit la diploïdie pour une TRÈS LONGUE DURÉE : le zygote diploïde se développe en un organisme adulte diploïde qui vivra toute sa vie à l'état 2n. La méiose ne se produira que bien plus tard, uniquement dans les gonades, pour produire les gamètes. Dans le cycle HAPLOPHASIQUE, la fécondation ne rétablit la diploïdie que BRIÈVEMENT (le zygote refait aussitôt une méiose). Dans le cycle MIXTE, la durée de la phase diploïde est intermédiaire."
  },
  {
    type: "qcm",
    question: "Quelle est la principale conséquence du type de cycle de vie sur l'organisme ?",
    options: [
      "Le type de cycle détermine la vitesse de reproduction de l'espèce uniquement.",
      "Le type de cycle détermine la PROPORTION DU TEMPS passé à l'état haploïde ou diploïde, ce qui influence la façon dont la sélection naturelle agit sur les gènes.",
      "Le type de cycle ne change rien à la biologie de l'organisme — c'est une simple classification académique."
    ],
    answer: "Le type de cycle détermine la PROPORTION DU TEMPS passé à l'état haploïde ou diploïde, ce qui influence la façon dont la sélection naturelle agit sur les gènes.",
    explanation: "Le TYPE DE CYCLE DE VIE détermine la PROPORTION DE TEMPS passé à l'état HAPLOÏDE (n) ou DIPLOÏDE (2n). Cela a des implications biologiques importantes : chez un organisme haploïde dominant, chaque gène est présent en UN SEUL EXEMPLAIRE → la sélection naturelle agit directement sur tous les allèles (même récessifs). Chez un organisme diploïde dominant, les gènes sont en DEUX EXEMPLAIRES → les allèles récessifs peuvent être 'cachés' par les allèles dominants. Ce n'est pas qu'une classification académique — c'est biologiquement fondamental."
  },
  {
    type: "qcm",
    question: "Dans le cycle mixte, comment appelle-t-on les deux générations qui alternent ?",
    options: [
      "Génération haploïde et génération diploïde, sans noms spécifiques dans le cours.",
      "Génération asexuée et génération sexuée.",
      "Phase gamétophytique (haploïde) et phase sporophytique (diploïde), selon la terminologie botanique générale."
    ],
    answer: "Génération haploïde et génération diploïde, sans noms spécifiques dans le cours.",
    explanation: "Dans le cours de L1 BCGS, le cycle MIXTE est décrit comme regroupant simultanément les caractéristiques haplophasique et diplophasique, avec une GÉNÉRATION HAPLOÏDE et une GÉNÉRATION DIPLOÏDE qui alternent. Les termes GAMÉTOPHYTE et SPOROPHYTE sont des termes botaniques plus avancés qui ne sont pas introduits dans ce chapitre spécifique. Génération asexuée/sexuée est également inexact — les deux générations peuvent être impliquées dans la reproduction sexuée."
  },
  {
    type: "qcm",
    question: "Un organisme dont le zygote (2n) est la seule cellule diploïde de tout son cycle fait quel type de cycle ?",
    options: [
      "Cycle diplophasique.",
      "Cycle haplophasique.",
      "Cycle mixte."
    ],
    answer: "Cycle haplophasique.",
    explanation: "Si le ZYGOTE (2n) est la SEULE cellule DIPLOÏDE de tout le cycle → c'est un cycle HAPLOPHASIQUE parfait : le zygote est formé par fécondation (n + n → 2n), puis fait IMMÉDIATEMENT une méiose pour produire des individus haploïdes → la phase diploïde est réduite à UN SEUL STADE CELLULAIRE (le zygote). Dans le cycle DIPLOPHASIQUE, c'est l'inverse : les gamètes sont les seules cellules haploïdes. Dans le cycle MIXTE, il y a une alternance entre une GÉNÉRATION haploïde entière et une GÉNÉRATION diploïde entière."
  },
  {
    type: "qcm",
    question: "Pourquoi dit-on que le cycle diplophasique est le cycle de l'Homme et des animaux ?",
    options: [
      "Car les animaux passent alternativement par des stades haploïdes et diploïdes tout au long de leur développement.",
      "Car chez les animaux, TOUTES les cellules de l'organisme (sauf les gamètes) sont diploïdes, et la méiose n'a lieu que dans les gonades pour produire les gamètes haploïdes.",
      "Car les animaux ne se reproduisent que sexuellement, sans jamais passer par un stade haploïde."
    ],
    answer: "Car chez les animaux, TOUTES les cellules de l'organisme (sauf les gamètes) sont diploïdes, et la méiose n'a lieu que dans les gonades pour produire les gamètes haploïdes.",
    explanation: "Le cycle DIPLOPHASIQUE caractérise l'Homme et les animaux car TOUTES les cellules somatiques de l'organisme sont DIPLOÏDES (2n). La MÉIOSE n'a lieu que dans les GONADES et uniquement pour produire des GAMÈTES haploïdes (n) — phase haploïde réduite au minimum. Dès la fécondation (n + n → 2n), l'organisme est diploïde et le reste jusqu'à la prochaine méiose dans ses propres gonades. Il n'y a pas d'alternance de stades haploïde/diploïde au cours du développement animal."
  },
  {
    type: "qcm",
    question: "Quel est le point commun entre les trois types de cycles de vie (haplophasique, diplophasique, mixte) ?",
    options: [
      "Dans les trois cas, la méiose et la fécondation alternent obligatoirement, maintenant la constance du nombre chromosomique de l'espèce.",
      "Dans les trois cas, la phase haploïde est plus longue que la phase diploïde.",
      "Dans les trois cas, les individus sont diploïdes pendant leur période de croissance active."
    ],
    answer: "Dans les trois cas, la méiose et la fécondation alternent obligatoirement, maintenant la constance du nombre chromosomique de l'espèce.",
    explanation: "Le POINT COMMUN fondamental entre les trois types de cycles SEXUÉS est que la MÉIOSE et la FÉCONDATION alternent toujours — quelle que soit la durée relative des phases haploïde et diploïde. C'est ce qui maintient la CONSTANCE DU NOMBRE CHROMOSOMIQUE de l'espèce au fil des générations : méiose (2n → n) compensée par fécondation (n + n → 2n). La phase haploïde n'est PAS toujours plus longue (elle est la plus courte dans le cycle diplophasique). Les individus ne sont PAS toujours diploïdes pendant leur croissance (dans le cycle haplophasique, la croissance se fait à l'état haploïde)."
  }
] },
        { nom: "Reproduction assexuee chez les unicellulaires", quiz: [
  {
    type: "qcm",
    question: "Chez les unicellulaires, la reproduction asexuée est principalement réalisée par :",
    options: [
      "Fusion de gamètes",
      "Division cellulaire sans intervention de gamètes",
      "Conjugaison obligatoire",
      "Production de spores sexuées"
    ],
    answer: "Division cellulaire sans intervention de gamètes",
    explanation: "Elle produit des clones génétiquement identiques au parent. Pourquoi cette stratégie est-elle particulièrement adaptée aux conditions environnementales stables et favorables ?"
  },
  {
    type: "qcm",
    question: "Le mode de reproduction asexuée le plus courant chez les bactéries (procaryotes) est :",
    options: [
      "Bourgeonnement",
      "Fission binaire (scissiparité)",
      "Schizogonie",
      "Fragmentation"
    ],
    answer: "Fission binaire (scissiparité)",
    explanation: "La cellule s'allonge, réplique son ADN circulaire et se divise en deux cellules filles égales. Comment cette division rapide permet-elle une croissance exponentielle en milieu riche ?"
  },
  {
    type: "qcm",
    question: "Dans la fission binaire bactérienne, la réplication de l'ADN se produit :",
    options: [
      "Après la division cytoplasmique",
      "Avant la division, souvent attachée à la membrane",
      "Sans réplication",
      "Pendant la cytocinèse uniquement"
    ],
    answer: "Avant la division, souvent attachée à la membrane",
    explanation: "L'ADN circulaire est répliqué et séparé vers les pôles. Pourquoi l'attachement membranaire facilite-t-il la ségrégation équitable du génome ?"
  },
  {
    type: "qcm",
    question: "Chez certains eucaryotes unicellulaires (ex. paramécies, amibes), la reproduction asexuée se fait par :",
    options: [
      "Mitose suivie de cytocinèse",
      "Conjugaison uniquement",
      "Bourgeonnement exclusif",
      "Production d'endospores"
    ],
    answer: "Mitose suivie de cytocinèse",
    explanation: "La mitose produit deux noyaux identiques, puis la cellule se divise. Pourquoi cette division équationnelle maintient-elle la ploïdie et la stabilité génétique ?"
  },
  {
    type: "qcm",
    question: "Le bourgeonnement est un mode de reproduction asexuée typique chez :",
    options: [
      "Les bactéries uniquement",
      "Les levures (ex. Saccharomyces) et certains protozoaires",
      "Toutes les algues unicellulaires",
      "Les cyanobactéries exclusivement"
    ],
    answer: "Les levures (ex. Saccharomyces) et certains protozoaires",
    explanation: "Un bourgeon se forme sur la cellule mère, reçoit une copie du noyau et se détache. Pourquoi cette division asymétrique permet-elle une reproduction rapide tout en conservant la cellule mère ?"
  },
  {
    type: "qcm",
    question: "La schizogonie (ou mitose multiple) est observée chez :",
    options: [
      "Les bactéries",
      "Certains protozoaires parasites (ex. Plasmodium, apicomplexés)",
      "Les levures",
      "Les cyanobactéries"
    ],
    answer: "Certains protozoaires parasites (ex. Plasmodium, apicomplexés)",
    explanation: "Le noyau se divise plusieurs fois avant la cytocinèse, libérant de nombreux mérozoïtes. Comment ce mode accélère-t-il la multiplication dans un hôte ?"
  },
  {
    type: "qcm",
    question: "Les endospores sont une forme de :",
    options: [
      "Reproduction asexuée active",
      "Résistance et survie chez certaines bactéries (ex. Bacillus, Clostridium)",
      "Reproduction sexuée",
      "Bourgeonnement"
    ],
    answer: "Résistance et survie chez certaines bactéries (ex. Bacillus, Clostridium)",
    explanation: "Elles se forment en conditions défavorables et germent quand les conditions redeviennent favorables. Pourquoi les endospores ne constituent-elles pas une reproduction au sens strict, mais une stratégie de persistance ?"
  },
  {
    type: "qcm",
    question: "Chez les algues unicellulaires (ex. Chlamydomonas), la reproduction asexuée se fait souvent par :",
    options: [
      "Zoospores flagellées issues de mitoses",
      "Fission binaire sans flagelles",
      "Conjugaison",
      "Production d'oosphères"
    ],
    answer: "Zoospores flagellées issues de mitoses",
    explanation: "La cellule mère produit plusieurs zoospores mobiles par mitoses successives. Comment la motilité des zoospores favorise-t-elle la dispersion dans l'environnement aquatique ?"
  },
  {
    type: "qcm",
    question: "La reproduction asexuée produit des descendants :",
    options: [
      "Génétiquement identiques au parent (clones)",
      "Toujours génétiquement différents",
      "Haploïdes uniquement",
      "Avec recombinaison obligatoire"
    ],
    answer: "Génétiquement identiques au parent (clones)",
    explanation: "Pas de brassage génétique. Pourquoi cette absence de variation est-elle un avantage en milieu stable mais un désavantage en milieu changeant ?"
  },
  {
    type: "qcm",
    question: "Chez les protozoaires ciliés (ex. paramécies), la reproduction asexuée est :",
    options: [
      "Toujours par conjugaison",
      "Par fission binaire transversale",
      "Par bourgeonnement externe",
      "Par schizogonie"
    ],
    answer: "Par fission binaire transversale",
    explanation: "Division perpendiculaire à l'axe cilié. Pourquoi cette orientation préserve-t-elle la polarité et la structure ciliaire ?"
  },
  {
    type: "qcm",
    question: "La vitesse de reproduction asexuée chez les bactéries peut atteindre :",
    options: [
      "Une division toutes les 20 minutes dans des conditions optimales",
      "Une division par jour",
      "Une division par semaine",
      "Une division par an"
    ],
    answer: "Une division toutes les 20 minutes dans des conditions optimales",
    explanation: "Ex. Escherichia coli. Comment cette rapidité permet-elle une adaptation rapide aux ressources disponibles ?"
  },
  {
    type: "qcm",
    question: "Le bourgeonnement chez les levures produit :",
    options: [
      "Deux cellules de taille identique",
      "Une cellule fille plus petite que la mère",
      "Des spores internes",
      "Des cellules haploïdes uniquement"
    ],
    answer: "Une cellule fille plus petite que la mère",
    explanation: "Division asymétrique. Pourquoi la cellule mère reste-t-elle viable et capable de bourgeonner à nouveau rapidement ?"
  },
  {
    type: "qcm",
    question: "Chez les apicomplexés (ex. Plasmodium), la reproduction asexuée dans l'hôte vertébré est :",
    options: [
      "Schizogonie hépatique et érythrocytaire",
      "Fission binaire simple",
      "Bourgeonnement externe",
      "Conjugaison"
    ],
    answer: "Schizogonie hépatique et érythrocytaire",
    explanation: "Multiplication massive dans les cellules hôtes. Comment cette stratégie permet-elle une augmentation exponentielle du parasite ?"
  },
  {
    type: "qcm",
    question: "La reproduction asexuée chez les unicellulaires est :",
    options: [
      "Toujours plus rapide que la sexuée",
      "Souvent plus rapide et économe en énergie",
      "Toujours plus lente",
      "Sans avantage sélectif"
    ],
    answer: "Souvent plus rapide et économe en énergie",
    explanation: "Pas besoin de partenaire ni de méiose. Pourquoi cela confère-t-il un avantage compétitif en milieu non limitant ?"
  },
  {
    type: "qcm",
    question: "Les cyanobactéries (procaryotes photosynthétiques) se reproduisent asexuellement par :",
    options: [
      "Fission binaire ou fragmentation",
      "Production de gamètes",
      "Schizogonie",
      "Bourgeonnement interne"
    ],
    answer: "Fission binaire ou fragmentation",
    explanation: "Division simple ou fragmentation de filaments. Comment la fragmentation permet-elle une dispersion dans les milieux aquatiques ?"
  },
  {
    type: "qcm",
    question: "La reproduction asexuée ne génère pas de :",
    options: [
      "Variation génétique par recombinaison",
      "Clones identiques",
      "Division cellulaire",
      "Croissance de population"
    ],
    answer: "Variation génétique par recombinaison",
    explanation: "Pas de crossing-over ni de fusion. Pourquoi cette absence de diversité rend-elle les populations vulnérables aux changements environnementaux soudains ?"
  },
  {
    type: "qcm",
    question: "Chez les amibes, la reproduction asexuée est :",
    options: [
      "Par fission binaire",
      "Par bourgeonnement uniquement",
      "Par production d'endospores",
      "Par conjugaison"
    ],
    answer: "Par fission binaire",
    explanation: "Division simple du cytoplasme après mitose. Pourquoi ce mode est-il adapté aux organismes amiboïdes mobiles ?"
  },
  {
    type: "qcm",
    question: "La fission binaire chez les procaryotes ne nécessite pas :",
    options: [
      "Fuseau mitotique comme chez les eucaryotes",
      "Réplication d'ADN",
      "Cytocinèse",
      "Croissance cellulaire préalable"
    ],
    answer: "Fuseau mitotique comme chez les eucaryotes",
    explanation: "Séparation passive ou par croissance membranaire. Comment cela simplifie-t-il le processus par rapport à la mitose eucaryote ?"
  },
  {
    type: "qcm",
    question: "La reproduction asexuée chez les unicellulaires permet :",
    options: [
      "Une colonisation rapide d'un habitat favorable",
      "Une grande diversité génétique",
      "Une résistance accrue aux parasites",
      "Une évolution lente"
    ],
    answer: "Une colonisation rapide d'un habitat favorable",
    explanation: "Production massive de clones. Pourquoi cette stratégie est-elle dominante chez les micro-organismes en milieu opportuniste ?"
  },
  {
    type: "qcm",
    question: "Globalement, la reproduction asexuée chez les unicellulaires est :",
    options: [
      "Le mode principal, rapide et conservateur du génotype",
      "Secondaire par rapport à la sexuée",
      "Toujours associée à la méiose",
      "Exclusivement chez les eucaryotes"
    ],
    answer: "Le mode principal, rapide et conservateur du génotype",
    explanation: "Elle domine chez procaryotes et de nombreux eucaryotes unicellulaires. Comment ce mode soutient-il la survie et la prolifération en conditions favorables ?"
  }
] },
        { nom: "Reproduction sexuee chez les unicellulaires", quiz: [
  {
    type: "qcm",
    question: "La reproduction sexuée chez les unicellulaires implique :",
    options: [
      "La fusion de deux gamètes haploïdes pour former un zygote diploïde",
      "Une division cellulaire simple sans fusion",
      "La production de clones identiques",
      "La scissiparité uniquement"
    ],
    answer: "La fusion de deux gamètes haploïdes pour former un zygote diploïde",
    explanation: "Syngamie = fusion gamétique. Pourquoi cette fusion est-elle nécessaire pour rétablir la diploidie après une phase haploïde ?"
  },
  {
    type: "qcm",
    question: "Chez la plupart des unicellulaires eucaryotes, la reproduction sexuée alterne avec :",
    options: [
      "Une phase haploïde dominante et une phase diploïde brève (zygote)",
      "Une phase diploïde dominante permanente",
      "Une absence totale de phase haploïde",
      "Une reproduction uniquement asexuée"
    ],
    answer: "Une phase haploïde dominante et une phase diploïde brève (zygote)",
    explanation: "Cycle haplontique typique. Pourquoi la phase diploïde est-elle souvent réduite au seul zygote chez ces organismes ?"
  },
  {
    type: "qcm",
    question: "La conjugation est un mode de reproduction sexuée typique chez :",
    options: [
      "Les ciliés (ex. Paramecium)",
      "Les levures uniquement",
      "Les bactéries",
      "Les algues vertes uniquement"
    ],
    answer: "Les ciliés (ex. Paramecium)",
    explanation: "Échange de matériel génétique via un pont cytoplasmique sans véritable fusion cellulaire. Pourquoi ce processus est-il qualifié de parasexuel plutôt que de sexuel au sens strict ?"
  },
  {
    type: "qcm",
    question: "Dans la conjugation chez Paramecium, les deux individus échangent :",
    options: [
      "Un noyau haploïde migrateur",
      "Leur noyau entier",
      "Des chloroplastes",
      "Des mitochondries"
    ],
    answer: "Un noyau haploïde migrateur",
    explanation: "Noyau haploïde migre et fusionne avec le noyau stationnaire. Comment cet échange permet-il une recombinaison génétique sans production de gamètes mobiles ?"
  },
  {
    type: "qcm",
    question: "L'isogamie désigne :",
    options: [
      "La fusion de deux gamètes morphologiquement et physiologiquement identiques",
      "La fusion d'un gamète mâle et d'un gamète femelle différenciés",
      "La division binaire",
      "La production d'endospores"
    ],
    answer: "La fusion de deux gamètes morphologiquement et physiologiquement identiques",
    explanation: "Ex. Chlamydomonas isogame. Pourquoi l'isogamie est-elle considérée comme la forme ancestrale de la reproduction sexuée ?"
  },
  {
    type: "qcm",
    question: "L'anisogamie se caractérise par :",
    options: [
      "Deux gamètes de tailles et de mobilités différentes",
      "Deux gamètes identiques",
      "Un seul gamète",
      "Aucune fusion gamétique"
    ],
    answer: "Deux gamètes de tailles et de mobilités différentes",
    explanation: "Gamète mâle petit et mobile, gamète femelle plus grand et moins mobile. Pourquoi cette différenciation augmente-t-elle l'efficacité de la fécondation ?"
  },
  {
    type: "qcm",
    question: "L'oogamie est la forme la plus évoluée de :",
    options: [
      "Gamètes très différenciés : spermatozoïde mobile et petit vs ovule immobile et volumineux",
      "Gamètes identiques",
      "Gamètes intermédiaires",
      "Absence de gamètes"
    ],
    answer: "Gamètes très différenciés : spermatozoïde mobile et petit vs ovule immobile et volumineux",
    explanation: "Ex. Oedogonium, Volvox. Comment l'oogamie optimise-t-elle la survie du zygote et la dispersion du matériel génétique mâle ?"
  },
  {
    type: "qcm",
    question: "Chez Chlamydomonas, la reproduction sexuée peut être :",
    options: [
      "Isogame ou anisogame selon les souches",
      "Toujours oogame",
      "Toujours asexuée",
      "Par conjugation uniquement"
    ],
    answer: "Isogame ou anisogame selon les souches",
    explanation: "Certaines espèces ou souches montrent une transition isogamie → anisogamie. Pourquoi cette variabilité illustre-t-elle l'évolution vers la différenciation sexuelle ?"
  },
  {
    type: "qcm",
    question: "La méiose chez les unicellulaires à cycle haplontique se produit :",
    options: [
      "Dans le zygote diploïde (méiose post-zygotique)",
      "Avant la formation du zygote",
      "Pendant la phase de croissance haploïde",
      "Jamais"
    ],
    answer: "Dans le zygote diploïde (méiose post-zygotique)",
    explanation: "Le zygote subit immédiatement la méiose pour redonner des cellules haploïdes. Pourquoi cette stratégie maintient-elle une phase haploïde dominante ?"
  },
  {
    type: "qcm",
    question: "La reproduction sexuée chez les unicellulaires produit :",
    options: [
      "Une recombinaison génétique et une diversité des descendants",
      "Des clones identiques au parent",
      "Une réduction du nombre de cellules",
      "Une absence totale de variation"
    ],
    answer: "Une recombinaison génétique et une diversité des descendants",
    explanation: "Crossing-over et brassage indépendant. Pourquoi cette diversité augmente-t-elle les chances de survie face à des environnements changeants ou à des parasites ?"
  },
  {
    type: "qcm",
    question: "Chez les ciliés, la conjugation est précédée de :",
    options: [
      "Une mitose du micronoyau pour produire des noyaux haploïdes",
      "Une méiose immédiate",
      "Une fission binaire",
      "Une schizogonie"
    ],
    answer: "Une mitose du micronoyau pour produire des noyaux haploïdes",
    explanation: "Le micronoyau subit mitose puis méiose. Comment cela prépare-t-il l'échange génétique entre deux individus ?"
  },
  {
    type: "qcm",
    question: "La reproduction sexuée est souvent déclenchée chez les unicellulaires par :",
    options: [
      "Des conditions défavorables (famine, sécheresse, densité élevée)",
      "Des conditions optimales uniquement",
      "Une température constante",
      "Une lumière permanente"
    ],
    answer: "Des conditions défavorables (famine, sécheresse, densité élevée)",
    explanation: "Signal de stress environnemental. Pourquoi la sexualité apparaît-elle comme une stratégie d’échappement face à des conditions hostiles ?"
  },
  {
    type: "qcm",
    question: "Chez certaines algues unicellulaires, le zygote peut former :",
    options: [
      "Une zygospore résistante",
      "Une cellule fille identique immédiatement",
      "Un gamète supplémentaire",
      "Une spore asexuée"
    ],
    answer: "Une zygospore résistante",
    explanation: "Zygospore = zygote à paroi épaisse. Comment cette structure permet-elle de survivre à des conditions défavorables ?"
  },
  {
    type: "qcm",
    question: "La reproduction sexuée chez les unicellulaires nécessite généralement :",
    options: [
      "Deux partenaires de mating types différents (+ et –)",
      "Un seul individu",
      "Trois partenaires",
      "Aucun partenaire"
    ],
    answer: "Deux partenaires de mating types différents (+ et –)",
    explanation: "Système de types sexuels. Pourquoi cette incompatibilité homotypique empêche-t-elle l’autofécondation et favorise-t-elle la diversité ?"
  },
  {
    type: "qcm",
    question: "Dans la méiose post-zygotique, le produit final est :",
    options: [
      "Quatre cellules haploïdes",
      "Deux cellules diploïdes",
      "Une cellule diploïde",
      "Huit cellules haploïdes"
    ],
    answer: "Quatre cellules haploïdes",
    explanation: "Deux divisions méiotiques. Comment cela restaure-t-il la phase haploïde dominante typique des unicellulaires ?"
  },
  {
    type: "qcm",
    question: "L’avantage principal de la reproduction sexuée chez les unicellulaires est :",
    options: [
      "La création de variation génétique par recombinaison",
      "La production rapide de clones",
      "La conservation exacte du génotype parental",
      "La réduction de la taille cellulaire"
    ],
    answer: "La création de variation génétique par recombinaison",
    explanation: "Crossing-over et brassage. Pourquoi cette variation est-elle particulièrement utile contre les parasites évoluant rapidement (théorie de la Reine Rouge) ?"
  },
  {
    type: "qcm",
    question: "Chez les levures (Saccharomyces), la reproduction sexuée implique :",
    options: [
      "Fusion d’haploïdes a et α → diploïde → sporulation méiotique",
      "Fission binaire uniquement",
      "Conjugation sans fusion",
      "Schizogonie"
    ],
    answer: "Fusion d’haploïdes a et α → diploïde → sporulation méiotique",
    explanation: "Cycle diplobiontique bref. Pourquoi la phase diploïde est-elle transitoire chez les levures ?"
  },
  {
    type: "qcm",
    question: "La reproduction sexuée est :",
    options: [
      "Moins fréquente que l’asexuée chez la plupart des unicellulaires",
      "Toujours dominante",
      "Absente chez tous les unicellulaires",
      "Exclusivement par oogamie"
    ],
    answer: "Moins fréquente que l’asexuée chez la plupart des unicellulaires",
    explanation: "Asexuée = mode principal, sexuée = occasionnelle. Pourquoi la sexualité reste-t-elle conservée malgré son coût énergétique plus élevé ?"
  },
  {
    type: "qcm",
    question: "La transition isogamie → anisogamie → oogamie illustre :",
    options: [
      "L’évolution vers une spécialisation des rôles sexuels",
      "Une régression vers l’asexué",
      "Une absence de différenciation",
      "Une perte de diversité génétique"
    ],
    answer: "L’évolution vers une spécialisation des rôles sexuels",
    explanation: "De gamètes identiques à gamètes très différenciés. Pourquoi cette évolution augmente-t-elle l’efficacité reproductive dans des environnements complexes ?"
  },
  {
    type: "qcm",
    question: "Globalement, la reproduction sexuée chez les unicellulaires permet :",
    options: [
      "La recombinaison génétique et une adaptation à long terme via la diversité",
      "Une multiplication rapide uniquement",
      "La conservation parfaite du génotype",
      "Une survie sans variation"
    ],
    answer: "La recombinaison génétique et une adaptation à long terme via la diversité",
    explanation: "Complémentaire à l’asexuée rapide. Comment l’alternance des deux modes maximise-t-elle les chances de survie et d’évolution des lignées unicellulaires ?"
  }
] },
        { nom: "Reproduction sexuee chez les pluricellulaires", quiz: [
  {
    type: "qcm",
    question: "La reproduction sexuée chez les organismes pluricellulaires implique :",
    options: [
      "La fusion de deux gamètes haploïdes pour former un zygote diploïde",
      "Une division cellulaire simple sans fusion",
      "La production de clones identiques",
      "La scissiparité uniquement"
    ],
    answer: "La fusion de deux gamètes haploïdes pour former un zygote diploïde",
    explanation: "Syngamie = fusion gamétique. Pourquoi cette fusion rétablit-elle la diploidie après la réduction méiotique et permet-elle le brassage génétique ?"
  },
  {
    type: "qcm",
    question: "Chez les animaux pluricellulaires, le cycle de vie est généralement :",
    options: [
      "Diplobiontique : phase diploïde dominante, méiose dans les gonades",
      "Haplontique : phase haploïde dominante",
      "Haplodiplontique avec alternance égale",
      "Sans méiose"
    ],
    answer: "Diplobiontique : phase diploïde dominante, méiose dans les gonades",
    explanation: "Organisme diploïde → gamètes haploïdes → zygote diploïde. Pourquoi la phase haploïde est-elle réduite aux seuls gamètes chez les animaux ?"
  },
  {
    type: "qcm",
    question: "Chez les plantes pluricellulaires, le cycle de vie est typiquement :",
    options: [
      "Haplodiplontique avec alternance de générations sporophytique et gamétophytique",
      "Diplobiontique comme chez les animaux",
      "Haplontique sans sporophyte",
      "Sans phase diploïde"
    ],
    answer: "Haplodiplontique avec alternance de générations sporophytique et gamétophytique",
    explanation: "Sporophyte (2n) produit spores → gamétophyte (n) produit gamètes. Pourquoi cette alternance permet-elle une double phase multicellulaire chez les plantes ?"
  },
  {
    type: "qcm",
    question: "La méiose produit :",
    options: [
      "Quatre cellules haploïdes à partir d'une cellule diploïde",
      "Deux cellules diploïdes identiques",
      "Une cellule haploïde uniquement",
      "Des cellules identiques au parent"
    ],
    answer: "Quatre cellules haploïdes à partir d'une cellule diploïde",
    explanation: "Réduction chromosomique + recombinaison. Comment la méiose assure-t-elle à la fois la réduction du nombre de chromosomes et la diversité génétique ?"
  },
  {
    type: "qcm",
    question: "La fécondation est :",
    options: [
      "L'union d'un gamète mâle et d'un gamète femelle",
      "Une division mitotique",
      "Une méiose",
      "Une fission binaire"
    ],
    answer: "L'union d'un gamète mâle et d'un gamète femelle",
    explanation: "Fusion des noyaux (caryogamie) et des cytoplasmes. Pourquoi la fécondation double-t-elle le nombre de chromosomes et rétablit-elle la diploidie ?"
  },
  {
    type: "qcm",
    question: "Chez les mammifères, la reproduction sexuée est :",
    options: [
      "Interne avec fécondation interne et développement embryonnaire interne",
      "Externe dans l'eau",
      "Sans gamètes différenciés",
      "Par conjugation"
    ],
    answer: "Interne avec fécondation interne et développement embryonnaire interne",
    explanation: "Spermatozoïdes mobiles fécondent ovule dans les voies génitales. Pourquoi la fécondation interne augmente-t-elle les chances de survie des zygotes ?"
  },
  {
    type: "qcm",
    question: "Chez les plantes à fleurs (angiospermes), la reproduction sexuée implique :",
    options: [
      "Double fécondation : zygote + albumen",
      "Fécondation simple uniquement",
      "Pas de méiose",
      "Production de zoospores"
    ],
    answer: "Double fécondation : zygote + albumen",
    explanation: "Un spermatozoïde féconde l'ovule → zygote ; l'autre féconde la cellule centrale → albumen. Pourquoi cette double fécondation est-elle une adaptation nutritionnelle ?"
  },
  {
    type: "qcm",
    question: "Le gamétophyte est la génération :",
    options: [
      "Haploïde qui produit les gamètes par mitose",
      "Diploïde qui produit les spores",
      "Sans chromosomes",
      "Exclusivement animale"
    ],
    answer: "Haploïde qui produit les gamètes par mitose",
    explanation: "Génération sexuée. Pourquoi le gamétophyte produit-il des gamètes sans réduction chromosomique supplémentaire ?"
  },
  {
    type: "qcm",
    question: "Le sporophyte est la génération :",
    options: [
      "Diploïde qui produit les spores par méiose",
      "Haploïde qui produit les gamètes",
      "Sans reproduction",
      "Exclusivement végétale"
    ],
    answer: "Diploïde qui produit les spores par méiose",
    explanation: "Génération asexuée. Comment le sporophyte permet-il la dispersion et la résistance des spores dans l'environnement ?"
  },
  {
    type: "qcm",
    question: "Chez les mousses, la phase dominante est :",
    options: [
      "Le gamétophyte haploïde",
      "Le sporophyte diploïde",
      "Le zygote uniquement",
      "Aucune phase multicellulaire"
    ],
    answer: "Le gamétophyte haploïde",
    explanation: "Plante verte = gamétophyte ; sporophyte = petite tige sur le gamétophyte. Pourquoi la dominance du gamétophyte est-elle typique des bryophytes ?"
  },
  {
    type: "qcm",
    question: "Chez les fougères et les plantes à graines, la phase dominante est :",
    options: [
      "Le sporophyte diploïde",
      "Le gamétophyte haploïde",
      "Le zygote uniquement",
      "Le gamétophyte femelle uniquement"
    ],
    answer: "Le sporophyte diploïde",
    explanation: "Plante visible = sporophyte ; gamétophyte = petit et réduit. Pourquoi cette inversion de dominance accompagne-t-elle la conquête terrestre ?"
  },
  {
    type: "qcm",
    question: "L'avantage principal de la reproduction sexuée chez les pluricellulaires est :",
    options: [
      "La création de variation génétique par recombinaison et brassage",
      "La production rapide de clones",
      "La conservation exacte du génotype parental",
      "Une réduction de la taille"
    ],
    answer: "La création de variation génétique par recombinaison et brassage",
    explanation: "Crossing-over et assortiment indépendant. Pourquoi cette diversité améliore-t-elle l'adaptation à long terme et la résistance aux parasites ?"
  },
  {
    type: "qcm",
    question: "Chez les animaux, les gamètes sont produits par :",
    options: [
      "Méiose dans les gonades",
      "Mitose uniquement",
      "Fission binaire",
      "Schizogonie"
    ],
    answer: "Méiose dans les gonades",
    explanation: "Spermatogenèse et ovogenèse. Comment la méiose garantit-elle la production de gamètes haploïdes génétiquement diversifiés ?"
  },
  {
    type: "qcm",
    question: "La fécondation externe est typique chez :",
    options: [
      "De nombreux poissons et amphibiens aquatiques",
      "Tous les mammifères",
      "Les oiseaux",
      "Les reptiles terrestres"
    ],
    answer: "De nombreux poissons et amphibiens aquatiques",
    explanation: "Gamètes libérés dans l'eau. Pourquoi la fécondation externe est-elle adaptée aux milieux aquatiques mais risquée sur terre ?"
  },
  {
    type: "qcm",
    question: "La pollinisation chez les angiospermes est :",
    options: [
      "Le transfert du pollen (gamétophyte mâle) vers le stigmate",
      "La fusion directe des gamètes",
      "La méiose dans l'ovule",
      "La production de spores"
    ],
    answer: "Le transfert du pollen (gamétophyte mâle) vers le stigmate",
    explanation: "Étape préalable à la fécondation. Comment les mécanismes de pollinisation (vent, insectes) augmentent-ils la diversité génétique ?"
  },
  {
    type: "qcm",
    question: "La reproduction sexuée chez les pluricellulaires nécessite :",
    options: [
      "Deux parents de sexes différents ou types sexuels compatibles",
      "Un seul parent",
      "Trois parents",
      "Aucun parent"
    ],
    answer: "Deux parents de sexes différents ou types sexuels compatibles",
    explanation: "Systèmes de sexes ou de mating types. Pourquoi cette biparentalité favorise-t-elle la recombinaison génétique ?"
  },
  {
    type: "qcm",
    question: "Chez les plantes à graines, la phase gamétophyte est :",
    options: [
      "Très réduite (sac embryonnaire et tube pollinique)",
      "Dominante et visible",
      "Absente",
      "Diploïde"
    ],
    answer: "Très réduite (sac embryonnaire et tube pollinique)",
    explanation: "Adaptation à la vie terrestre. Pourquoi la réduction du gamétophyte protège-t-elle les cellules reproductrices de la dessiccation ?"
  },
  {
    type: "qcm",
    question: "La reproduction sexuée est :",
    options: [
      "Moins rapide mais plus diversifiante que l'asexuée",
      "Toujours plus rapide",
      "Sans coût énergétique",
      "Exclusivement asexuée chez les plantes"
    ],
    answer: "Moins rapide mais plus diversifiante que l'asexuée",
    explanation: "Coût de production de gamètes et recherche de partenaire. Pourquoi la sexualité est-elle conservée malgré ce coût chez la plupart des pluricellulaires ?"
  },
  {
    type: "qcm",
    question: "L'alternance des générations permet aux plantes :",
    options: [
      "De combiner avantages de la phase haploïde (expression des mutations récessives) et diploïde (masquage des mutations)",
      "De supprimer toute variation",
      "De ne pas avoir de méiose",
      "De produire uniquement des clones"
    ],
    answer: "De combiner avantages de la phase haploïde (expression des mutations récessives) et diploïde (masquage des mutations)",
    explanation: "Phase haploïde expose les allèles récessifs ; phase diploïde protège. Comment cela optimise-t-il l'adaptation et la purge des mutations délétères ?"
  },
  {
    type: "qcm",
    question: "Globalement, la reproduction sexuée chez les pluricellulaires assure :",
    options: [
      "Diversité génétique, adaptation à long terme et évolution par recombinaison",
      "Production rapide de clones identiques",
      "Conservation parfaite du génotype parental",
      "Une survie sans variation"
    ],
    answer: "Diversité génétique, adaptation à long terme et évolution par recombinaison",
    explanation: "Complémentaire à l'asexuée chez certains organismes. Comment la sexualité soutient-elle l'évolution et la survie des lignées pluricellulaires sur des échelles temporelles longues ?"
  }
] },
        { nom: "Examen 2021", quiz: [] },
        { nom: "Examen 2022", quiz: [] }
      ]
    },
    {
      nom: "Genetique",
      pdfCours: null,
      sousMatieres: [
        { nom: "Notions fondamentales de la genetique", quiz: [
  {
    type: "qcm",
    question: "Un gène est défini principalement par :",
    options: [
      "Sa séquence nucléotidique uniquement",
      "Sa position sur le chromosome (locus)",
      "Sa longueur uniquement",
      "Sa fonction protéique uniquement"
    ],
    answer: "Sa position sur le chromosome (locus)",
    explanation: "Un gène est une région d'ADN à un locus précis (ex. 17p13.1 pour TP53). Pourquoi la localisation est-elle plus importante que la seule séquence pour définir un gène ?"
  },
  {
    type: "qcm",
    question: "Les deux exemplaires d'un même gène sur les chromosomes homologues sont appelés :",
    options: [
      "Allèles",
      "Chromatides",
      "Centromères",
      "Télomères"
    ],
    answer: "Allèles",
    explanation: "Un gène peut exister sous différentes formes (allèles). Pourquoi la présence de deux allèles par gène (un sur chaque chromosome homologue) est-elle fondamentale pour la génétique mendélienne ?"
  },
  {
    type: "qcm",
    question: "Un individu qui possède deux allèles identiques pour un gène est :",
    options: [
      "Homozygote",
      "Hétérozygote",
      "Dominant",
      "Récessif"
    ],
    answer: "Homozygote",
    explanation: "AA ou aa. Pourquoi l'état homozygote rend-il l'expression du caractère plus prévisible que l'état hétérozygote ?"
  },
  {
    type: "qcm",
    question: "Le bras court d'un chromosome est noté :",
    options: [
      "p",
      "q",
      "r",
      "s"
    ],
    answer: "p",
    explanation: "Bras court = p, bras long = q. Pourquoi cette nomenclature standardisée est-elle indispensable pour localiser précisément les gènes (ex. 17p13.1) ?"
  },
  {
    type: "qcm",
    question: "Le caryotype normal de l'homme est :",
    options: [
      "46, XX",
      "46, XY",
      "23, XY",
      "44, XX"
    ],
    answer: "46, XY",
    explanation: "46 chromosomes dont 22 paires d'autosomes + XY. Pourquoi le caryotype permet-il de détecter les anomalies de nombre (aneuploïdie) ou de structure ?"
  },
  {
    type: "qcm",
    question: "Le phénotype correspond à :",
    options: [
      "L'ensemble des caractères observables d'un individu",
      "Le patrimoine génétique complet",
      "La séquence d'ADN",
      "Le nombre de chromosomes"
    ],
    answer: "L'ensemble des caractères observables d'un individu",
    explanation: "Ex. : couleur des yeux, groupe sanguin. Pourquoi le phénotype est-il l'expression visible du génotype mais pas toujours fidèle à lui ?"
  },
  {
    type: "qcm",
    question: "Le génotype est :",
    options: [
      "Le patrimoine génétique (ensemble des gènes)",
      "L'expression visible des caractères",
      "Le nombre de chromosomes",
      "La forme des chromosomes"
    ],
    answer: "Le patrimoine génétique (ensemble des gènes)",
    explanation: "Il est invisible directement. Pourquoi le génotype est-il transmis tel quel aux descendants alors que le phénotype peut varier ?"
  },
  {
    type: "qcm",
    question: "L'ADN mitochondrial est transmis :",
    options: [
      "Par les deux parents",
      "Presque exclusivement par la mère (hérédité cytoplasmique)",
      "Uniquement par le père",
      "Par les chromosomes sexuels"
    ],
    answer: "Presque exclusivement par la mère (hérédité cytoplasmique)",
    explanation: "L'ovule apporte la grande majorité des mitochondries. Pourquoi les maladies mitochondriales sont-elles transmises par les mères ?"
  },
  {
    type: "qcm",
    question: "Le code génétique mitochondrial est :",
    options: [
      "Identique au code nucléaire",
      "Légèrement différent du code nucléaire",
      "Composé de 5 lettres",
      "Sans codon stop"
    ],
    answer: "Légèrement différent du code nucléaire",
    explanation: "Ex. : UGA code pour Trp au lieu de Stop. Pourquoi ces petites différences soutiennent-elles l'origine endosymbiotique des mitochondries ?"
  },
  {
    type: "qcm",
    question: "Un gène code pour :",
    options: [
      "Une protéine (via ARN messager)",
      "Directement un chromosome",
      "Uniquement de l'ARN ribosomal",
      "Uniquement des lipides"
    ],
    answer: "Une protéine (via ARN messager)",
    explanation: "Flux d'information : ADN → ARN → Protéine (dogme central). Pourquoi ce flux explique-t-il que la séquence d'ADN détermine le phénotype ?"
  },
  {
    type: "qcm",
    question: "Les chromosomes homologues portent :",
    options: [
      "Les mêmes gènes aux mêmes loci (mais pas forcément les mêmes allèles)",
      "Des gènes totalement différents",
      "Un seul gène chacun",
      "Aucun gène"
    ],
    answer: "Les mêmes gènes aux mêmes loci (mais pas forcément les mêmes allèles)",
    explanation: "Un de chaque parent. Pourquoi cette paire est-elle essentielle pour la diploidie et la méiose ?"
  },
  {
    type: "qcm",
    question: "L'ADN nucléaire est :",
    options: [
      "Linéaire et contenu dans les chromosomes",
      "Circulaire comme l'ADN mitochondrial",
      "Présent uniquement dans le cytoplasme",
      "Sans histones"
    ],
    answer: "Linéaire et contenu dans les chromosomes",
    explanation: "Associé aux histones pour former la chromatine. Pourquoi l'organisation en chromosomes permet-elle une compaction et une régulation fine ?"
  },
  {
    type: "qcm",
    question: "Un individu hétérozygote pour un gène possède :",
    options: [
      "Deux allèles différents",
      "Deux allèles identiques",
      "Un seul allèle",
      "Aucun allèle"
    ],
    answer: "Deux allèles différents",
    explanation: "Ex. : Aa. Pourquoi l'hétérozygote peut-il exprimer le phénotype dominant tout en étant porteur de l'allèle récessif ?"
  },
  {
    type: "qcm",
    question: "Le locus d'un gène correspond à :",
    options: [
      "Sa position précise sur un chromosome",
      "Sa séquence nucléotidique",
      "Sa fonction",
      "Sa taille"
    ],
    answer: "Sa position précise sur un chromosome",
    explanation: "Ex. : TP53 en 17p13.1. Pourquoi connaître le locus est-il indispensable pour cartographier les gènes et détecter les mutations ?"
  },
  {
    type: "qcm",
    question: "L'ADN est universel car :",
    options: [
      "Il est présent chez tous les êtres vivants avec le même code génétique de base",
      "Il n'existe que chez les eucaryotes",
      "Il est toujours circulaire",
      "Il ne code que pour les protéines mitochondriales"
    ],
    answer: "Il est présent chez tous les êtres vivants avec le même code génétique de base",
    explanation: "Preuve de l'origine commune de la vie. Pourquoi les petites variations (ex. code mitochondrial) n'invalident pas cette universalité ?"
  },
  {
    type: "qcm",
    question: "Les anomalies chromosomiques peuvent être :",
    options: [
      "De nombre (aneuploïdie) ou de structure (remaniements)",
      "Uniquement de nombre",
      "Uniquement de structure",
      "Absentes chez l'humain"
    ],
    answer: "De nombre (aneuploïdie) ou de structure (remaniements)",
    explanation: "Ex. : trisomie 21, délétions, translocations. Pourquoi le caryotype est-il l'outil de référence pour les détecter ?"
  },
  {
    type: "qcm",
    question: "Le phénotype dépend du :",
    options: [
      "Génotype mais peut aussi être influencé par l'environnement",
      "Génotype uniquement",
      "Environnement uniquement",
      "Nombre de chromosomes"
    ],
    answer: "Génotype mais peut aussi être influencé par l'environnement",
    explanation: "Génotype → Phénotype, mais pas l'inverse. Pourquoi cette relation unidirectionnelle est-elle fondamentale en génétique ?"
  },
  {
    type: "qcm",
    question: "L'ADN mitochondrial est :",
    options: [
      "Circulaire, sans introns, et transmis par la mère",
      "Linéaire comme l'ADN nucléaire",
      "Présent uniquement dans le noyau",
      "Transmis par le père"
    ],
    answer: "Circulaire, sans introns, et transmis par la mère",
    explanation: "16 569 pb chez l'humain. Pourquoi cette transmission maternelle explique-t-elle l'hérédité mitochondriale ?"
  },
  {
    type: "qcm",
    question: "Un allèle récessif s'exprime phénotypiquement :",
    options: [
      "Uniquement à l'état homozygote",
      "À l'état hétérozygote",
      "Toujours, même chez l'homozygote dominant",
      "Jamais"
    ],
    answer: "Uniquement à l'état homozygote",
    explanation: "Ex. : aa pour albinisme. Pourquoi les allèles récessifs peuvent-ils rester 'cachés' dans la population sous forme de porteurs ?"
  },
  {
    type: "qcm",
    question: "Globalement, les généralités en génétique permettent de comprendre :",
    options: [
      "La relation entre génotype, phénotype et transmission de l'information héréditaire",
      "Uniquement la structure des chromosomes",
      "Seulement le code génétique",
      "La reproduction asexuée"
    ],
    answer: "La relation entre génotype, phénotype et transmission de l'information héréditaire",
    explanation: "Base indispensable avant d'aborder Mendel. Pourquoi maîtriser ces concepts est-il crucial pour analyser correctement les croisements mendéliens ?"
  }
] },
        { nom: "Monohybridisme", quiz: [
  {
    type: "qcm",
    question: "Le monohybridisme est un croisement dans lequel :",
    options: [
      "Un seul caractère (un seul gène) est suivi",
      "Deux caractères sont suivis simultanément",
      "Plusieurs caractères sont analysés",
      "Aucun caractère n'est suivi"
    ],
    answer: "Un seul caractère (un seul gène) est suivi",
    explanation: "Le monohybridisme suit la loi de ségrégation de Mendel. Pourquoi étudier un seul gène à la fois est-il une démarche logique avant d’aborder des cas plus complexes ?"
  },
  {
    type: "qcm",
    question: "Lors d’un croisement entre deux lignées pures (homozygotes) différentes pour un caractère, les individus de la F1 sont :",
    options: [
      "Tous identiques au parent dominant (uniformité des hybrides)",
      "Moitié dominant, moitié récessif",
      "Tous récessifs",
      "Variable selon l’environnement"
    ],
    answer: "Tous identiques au parent dominant (uniformité des hybrides)",
    explanation: "Phénotype dominant chez tous les F1. Pourquoi ce résultat a-t-il permis à Mendel de découvrir le concept de dominance ?"
  },
  {
    type: "qcm",
    question: "Dans un croisement monohybridique Bb × Bb, le rapport génotypique attendu en F2 est :",
    options: [
      "1 BB : 2 Bb : 1 bb",
      "3 BB : 1 bb",
      "1 BB : 1 bb",
      "100% Bb"
    ],
    answer: "1 BB : 2 Bb : 1 bb",
    explanation: "Rapport 1:2:1. Comment cet équilibre s’explique-t-il par la ségrégation des allèles pendant la méiose ?"
  },
  {
    type: "qcm",
    question: "Le rapport phénotypique attendu en F2 d’un croisement monohybridique est généralement :",
    options: [
      "3 : 1 (dominant : récessif)",
      "1 : 1",
      "9 : 3 : 3 : 1",
      "1 : 2 : 1"
    ],
    answer: "3 : 1 (dominant : récessif)",
    explanation: "3 individus dominants pour 1 récessif. Pourquoi ce rapport 3:1 est-il la signature du monohybridisme ?"
  },
  {
    type: "qcm",
    question: "Un individu hétérozygote (Aa) a un phénotype :",
    options: [
      "Identique à l’homozygote dominant (AA)",
      "Identique à l’homozygote récessif (aa)",
      "Intermédiaire",
      "Toujours récessif"
    ],
    answer: "Identique à l’homozygote dominant (AA)",
    explanation: "L’allèle dominant masque l’allèle récessif. Pourquoi ce phénomène explique-t-il la réapparition du caractère récessif en F2 ?"
  },
  {
    type: "qcm",
    question: "L’échiquier de Punnett permet de :",
    options: [
      "Déterminer toutes les combinaisons possibles de gamètes",
      "Observer directement les chromosomes",
      "Mesurer la taille des gènes",
      "Extraire l’ADN"
    ],
    answer: "Déterminer toutes les combinaisons possibles de gamètes",
    explanation: "Méthode visuelle simple. Pourquoi cet outil reste-t-il très utile pour prédire les rapports en monohybridisme ?"
  },
  {
    type: "qcm",
    question: "Dans le croisement test (test-cross), on croise un individu de phénotype dominant avec :",
    options: [
      "Un individu homozygote récessif",
      "Un individu homozygote dominant",
      "Un individu hétérozygote",
      "Un individu F1"
    ],
    answer: "Un individu homozygote récessif",
    explanation: "Cela permet de déterminer si l’individu dominant est homozygote ou hétérozygote. Pourquoi ce croisement est-il un outil essentiel en génétique ?"
  },
  {
    type: "qcm",
    question: "Si tous les descendants d’un test-cross sont dominants, le parent testé est :",
    options: [
      "Homozygote dominant",
      "Hétérozygote",
      "Homozygote récessif",
      "Mutant"
    ],
    answer: "Homozygote dominant",
    explanation: "Aucun individu récessif n’apparaît. Comment ce résultat confirme-t-il le génotype du parent ?"
  },
  {
    type: "qcm",
    question: "Un allèle dominant s’exprime :",
    options: [
      "Aussi bien chez l’homozygote que chez l’hétérozygote",
      "Seulement chez l’homozygote",
      "Seulement chez l’hétérozygote",
      "Jamais"
    ],
    answer: "Aussi bien chez l’homozygote que chez l’hétérozygote",
    explanation: "Exemple : allèle B pour pelage noir. Pourquoi cette propriété est-elle à la base de la loi de dominance de Mendel ?"
  },
  {
    type: "qcm",
    question: "Un allèle récessif s’exprime phénotypiquement :",
    options: [
      "Uniquement à l’état homozygote",
      "À l’état hétérozygote",
      "Toujours",
      "Jamais"
    ],
    answer: "Uniquement à l’état homozygote",
    explanation: "Exemple : albinisme (aa). Pourquoi les allèles récessifs peuvent-ils se transmettre sans être visibles pendant plusieurs générations ?"
  },
  {
    type: "qcm",
    question: "Mendel a choisi le pois comme modèle car :",
    options: [
      "Il présente des caractères contrastés, faciles à observer et peu influencés par l’environnement",
      "Il se reproduit très lentement",
      "Il a un grand nombre de chromosomes",
      "Il est impossible à croiser"
    ],
    answer: "Il présente des caractères contrastés, faciles à observer et peu influencés par l’environnement",
    explanation: "Choix stratégique. Pourquoi ce modèle a-t-il permis à Mendel d’obtenir des résultats clairs et reproductibles ?"
  },
  {
    type: "qcm",
    question: "Dans un croisement monohybridique Bb × bb, le rapport phénotypique attendu est :",
    options: [
      "1 noir : 1 blanc",
      "3 noir : 1 blanc",
      "100% noir",
      "100% blanc"
    ],
    answer: "1 noir : 1 blanc",
    explanation: "C’est un test-cross. Comment ce rapport permet-il de confirmer que le parent Bb est hétérozygote ?"
  },
  {
    type: "qcm",
    question: "La loi de ségrégation de Mendel stipule que :",
    options: [
      "Les allèles d’un même gène se séparent lors de la formation des gamètes",
      "Les allèles restent toujours ensemble",
      "Les caractères se mélangent définitivement",
      "Les allèles dominants disparaissent"
    ],
    answer: "Les allèles d’un même gène se séparent lors de la formation des gamètes",
    explanation: "Chaque gamète reçoit un seul allèle. Pourquoi cette loi est-elle la base du monohybridisme ?"
  },
  {
    type: "qcm",
    question: "Un individu porteur d’un allèle récessif délétère mais qui ne l’exprime pas est :",
    options: [
      "Hétérozygote (porteur)",
      "Homozygote récessif",
      "Homozygote dominant",
      "Mutant visible"
    ],
    answer: "Hétérozygote (porteur)",
    explanation: "Exemple : porteur sain de la drépanocytose (AS). Pourquoi les porteurs sont-ils très importants en génétique des populations ?"
  },
  {
    type: "qcm",
    question: "Le génotype BB et Bb donnent le même phénotype car :",
    options: [
      "B est dominant sur b",
      "b est dominant sur B",
      "Les deux allèles sont récessifs",
      "Il n’y a pas de dominance"
    ],
    answer: "B est dominant sur b",
    explanation: "Dominance complète. Pourquoi ce phénomène explique-t-il que le caractère récessif disparaisse en F1 puis réapparaisse en F2 ?"
  },
  {
    type: "qcm",
    question: "Mendel a observé que le caractère récessif réapparaît en F2 dans la proportion de :",
    options: [
      "1/4 des individus",
      "1/2 des individus",
      "3/4 des individus",
      "Tous les individus"
    ],
    answer: "1/4 des individus",
    explanation: "Proportion classique 3:1. Comment cette réapparition a-t-elle permis à Mendel de formuler la loi de ségrégation ?"
  },
  {
    type: "qcm",
    question: "Le monohybridisme est une étape fondamentale car :",
    options: [
      "Il permet de comprendre la transmission d’un seul gène avant d’aborder des cas plus complexes",
      "Il étudie directement deux gènes",
      "Il ignore les lois de Mendel",
      "Il concerne uniquement les plantes"
    ],
    answer: "Il permet de comprendre la transmission d’un seul gène avant d’aborder des cas plus complexes",
    explanation: "Approche progressive. Pourquoi cette simplification a-t-elle été décisive dans la découverte des principes de l’hérédité ?"
  },
  {
    type: "qcm",
    question: "Dans un croisement BB × bb, tous les individus F1 ont le génotype :",
    options: [
      "Bb",
      "BB",
      "bb",
      "BB et bb"
    ],
    answer: "Bb",
    explanation: "Tous hétérozygotes. Pourquoi ce résultat est-il la base de la loi de dominance ?"
  },
  {
    type: "qcm",
    question: "Un caractère qui n’apparaît que chez les homozygotes récessifs est dit :",
    options: [
      "Récessif",
      "Dominant",
      "Codominant",
      "Intermédiaire"
    ],
    answer: "Récessif",
    explanation: "Exemple : pelage blanc chez le cobaye. Pourquoi les caractères récessifs sont-ils souvent masqués dans la population ?"
  },
  {
    type: "qcm",
    question: "Globalement, le monohybridisme permet de comprendre :",
    options: [
      "La loi de ségrégation et le concept de dominance/récessivité",
      "La liaison des gènes",
      "L’assortiment indépendant de plusieurs gènes",
      "Les mutations chromosomiques"
    ],
    answer: "La loi de ségrégation et le concept de dominance/récessivité",
    explanation: "Fondement de la génétique mendélienne. Pourquoi maîtriser le monohybridisme est-il indispensable avant d’étudier le dihybridisme ?"
  }
] },
        { nom: "Dihybridisme (segregation independante de deux genes)", quiz:[
          
  {
    type: "qcm",
    question: "Le dihybridisme consiste à étudier simultanément :",
    options: [
      "Deux caractères (deux gènes) différents",
      "Un seul caractère",
      "Trois caractères ou plus",
      "Uniquement les caractères liés"
    ],
    answer: "Deux caractères (deux gènes) différents",
    explanation: "Exemple : couleur et forme de la graine chez le pois. Pourquoi étudier deux gènes à la fois est-il une étape logique après le monohybridisme ?"
  },
  {
    type: "qcm",
    question: "La loi de l’assortiment indépendant de Mendel stipule que :",
    options: [
      "Les allèles de gènes différents se séparent indépendamment les uns des autres",
      "Les allèles de deux gènes restent toujours ensemble",
      "Un seul gène est transmis",
      "Les gènes sont toujours liés"
    ],
    answer: "Les allèles de gènes différents se séparent indépendamment les uns des autres",
    explanation: "Cela se produit lors de la métaphase I de la méiose. Pourquoi cette loi est-elle vraie uniquement si les gènes sont sur des chromosomes différents ou très éloignés ?"
  },
  {
    type: "qcm",
    question: "Dans un croisement dihybride entre deux doubles hétérozygotes (AaBb × AaBb), le rapport phénotypique attendu en F2 est :",
    options: [
      "9 : 3 : 3 : 1",
      "3 : 1",
      "1 : 2 : 1",
      "1 : 1 : 1 : 1"
    ],
    answer: "9 : 3 : 3 : 1",
    explanation: "9 dominant-dominant : 3 dominant-récessif : 3 récessif-dominant : 1 récessif-récessif. Comment ce rapport prouve-t-il l’assortiment indépendant ?"
  },
  {
    type: "qcm",
    question: "Le rapport génotypique complet en F2 d’un dihybridisme est :",
    options: [
      "1 : 2 : 1 : 2 : 4 : 2 : 1 : 2 : 1",
      "9 : 3 : 3 : 1",
      "1 : 1 : 1 : 1",
      "3 : 1"
    ],
    answer: "1 : 2 : 1 : 2 : 4 : 2 : 1 : 2 : 1",
    explanation: "Il y a 9 combinaisons génotypiques différentes. Pourquoi ce rapport est-il plus complexe que celui du monohybridisme ?"
  },
  {
    type: "qcm",
    question: "Si deux gènes sont sur des chromosomes différents, la probabilité qu’un gamète reçoive à la fois l’allèle A et l’allèle B est :",
    options: [
      "1/4 (indépendants)",
      "1/2",
      "1",
      "0"
    ],
    answer: "1/4 (indépendants)",
    explanation: "Chaque gène segregue indépendamment. Comment ce calcul est-il à la base du rapport 9:3:3:1 ?"
  },
  {
    type: "qcm",
    question: "L’échiquier de Punnett pour un dihybridisme est de taille :",
    options: [
      "4 × 4 (16 cases)",
      "2 × 2 (4 cases)",
      "8 × 8",
      "1 × 1"
    ],
    answer: "4 × 4 (16 cases)",
    explanation: "Chaque parent produit 4 types de gamètes. Pourquoi cet outil devient-il plus compliqué à utiliser avec plus de gènes ?"
  },
  {
    type: "qcm",
    question: "Dans un croisement AaBb × aabb (test-cross dihybride), le rapport attendu est :",
    options: [
      "1 : 1 : 1 : 1",
      "9 : 3 : 3 : 1",
      "3 : 1",
      "1 : 2 : 1"
    ],
    answer: "1 : 1 : 1 : 1",
    explanation: "Cela permet de tester si les deux gènes sont indépendants. Comment ce rapport confirme-t-il l’assortiment indépendant ?"
  },
  {
    type: "qcm",
    question: "Si on obtient un rapport 9:3:3:1 en F2, cela signifie que :",
    options: [
      "Les deux gènes sont sur des chromosomes différents (assortiment indépendant)",
      "Les deux gènes sont liés",
      "Un seul gène est en jeu",
      "Il y a dominance incomplète"
    ],
    answer: "Les deux gènes sont sur des chromosomes différents (assortiment indépendant)",
    explanation: "C’est la preuve expérimentale de la deuxième loi de Mendel. Pourquoi ce rapport disparaît-il quand les gènes sont liés ?"
  },
  {
    type: "qcm",
    question: "Mendel a observé l’assortiment indépendant grâce à :",
    options: [
      "Des caractères situés sur des chromosomes différents",
      "Des caractères liés sur le même chromosome",
      "Un seul caractère",
      "Des mutations"
    ],
    answer: "Des caractères situés sur des chromosomes différents",
    explanation: "Chance ou choix judicieux. Pourquoi cette observation a-t-elle été fondamentale pour la génétique moderne ?"
  },
  {
    type: "qcm",
    question: "Si deux gènes sont indépendants, la probabilité d’obtenir un individu A_B_ en F2 est :",
    options: [
      "9/16",
      "3/16",
      "1/16",
      "4/16"
    ],
    answer: "9/16",
    explanation: "Combinaison des probabilités : (3/4) × (3/4) = 9/16. Comment cette multiplication des fractions reflète-t-elle l’indépendance ?"
  },
  {
    type: "qcm",
    question: "L’assortiment indépendant se produit pendant :",
    options: [
      "La métaphase I de la méiose",
      "La mitose",
      "La phase S",
      "La prophase II"
    ],
    answer: "La métaphase I de la méiose",
    explanation: "Orientation aléatoire des chromosomes homologues. Pourquoi ce mécanisme explique-t-il la ségrégation indépendante ?"
  },
  {
    type: "qcm",
    question: "Un individu AaBb peut produire combien de types de gamètes différents si les gènes sont indépendants ?",
    options: [
      "4 types (AB, Ab, aB, ab)",
      "2 types",
      "1 type",
      "16 types"
    ],
    answer: "4 types (AB, Ab, aB, ab)",
    explanation: "Chaque allèle se combine librement. Pourquoi ce nombre double-t-il par rapport au monohybridisme ?"
  },
  {
    type: "qcm",
    question: "Le dihybridisme permet de comprendre :",
    options: [
      "Comment plusieurs caractères sont transmis simultanément",
      "Uniquement la dominance",
      "La liaison des gènes",
      "Les mutations"
    ],
    answer: "Comment plusieurs caractères sont transmis simultanément",
    explanation: "Extension du monohybridisme. Pourquoi cette étape est-elle cruciale avant d’étudier la liaison des gènes ?"
  },
  {
    type: "qcm",
    question: "Si on obtient un rapport différent de 9:3:3:1 en F2, cela peut indiquer :",
    options: [
      "Que les gènes sont liés ou qu’il y a interaction entre gènes",
      "Que les gènes sont indépendants",
      "Une erreur de Mendel",
      "Uniquement un gène"
    ],
    answer: "Que les gènes sont liés ou qu’il y a interaction entre gènes",
    explanation: "Déviation du rapport classique. Pourquoi ces déviations ont-elles permis de découvrir de nouveaux phénomènes en génétique ?"
  },
  {
    type: "qcm",
    question: "La combinaison phénotypique la plus rare en F2 d’un dihybridisme est :",
    options: [
      "Le double récessif (aabb)",
      "Le double dominant (AABB)",
      "Le dominant pour un seul caractère",
      "Toutes sont égales"
    ],
    answer: "Le double récessif (aabb)",
    explanation: "Proportion 1/16. Pourquoi cette classe est-elle importante pour calculer les probabilités ?"
  },
  {
    type: "qcm",
    question: "Mendel a testé l’assortiment indépendant sur :",
    options: [
      "Sept caractères différents du pois",
      "Un seul caractère",
      "Des caractères liés",
      "Des animaux"
    ],
    answer: "Sept caractères différents du pois",
    explanation: "Il a choisi des caractères sur des chromosomes différents. Pourquoi ce choix a-t-il été déterminant dans sa découverte ?"
  },
  {
    type: "qcm",
    question: "En dihybridisme, chaque gène suit :",
    options: [
      "Indépendamment les règles du monohybridisme",
      "Les mêmes règles que la liaison",
      "Uniquement la dominance",
      "Aucune règle"
    ],
    answer: "Indépendamment les règles du monohybridisme",
    explanation: "Chaque paire d’allèles segregue de façon autonome. Comment cela simplifie-t-il l’analyse ?"
  },
  {
    type: "qcm",
    question: "Le dihybridisme est une extension directe :",
    options: [
      "Du monohybridisme",
      "De la liaison des gènes",
      "Des mutations",
      "De la méiose uniquement"
    ],
    answer: "Du monohybridisme",
    explanation: "Multiplication des probabilités. Pourquoi cette extension a-t-elle été une avancée majeure dans la compréhension de l’hérédité ?"
  },
  {
    type: "qcm",
    question: "Si deux gènes sont indépendants, la probabilité d’avoir un individu avec les deux caractères dominants en F2 est :",
    options: [
      "9/16",
      "3/16",
      "1/16",
      "4/16"
    ],
    answer: "9/16",
    explanation: "Combinaison des deux dominances. Comment ce calcul illustre-t-il la multiplication des fractions ?"
  },
  {
    type: "qcm",
    question: "Globalement, le dihybridisme avec ségrégation indépendante permet de comprendre :",
    options: [
      "Comment plusieurs gènes sont transmis de façon autonome",
      "La liaison génétique",
      "Les anomalies chromosomiques",
      "Uniquement le monohybridisme"
    ],
    answer: "Comment plusieurs gènes sont transmis de façon autonome",
    explanation: "Base de la génétique mendélienne classique. Pourquoi cette loi est-elle fondamentale avant d’aborder la liaison des gènes et les cartes génétiques ?"
  }
] },
        { nom: "Dihybridisme (la liaison des genes)", quiz: [
  {
    type: "qcm",
    question: "La liaison des gènes (linkage) signifie que :",
    options: [
      "Deux gènes sont situés sur le même chromosome",
      "Deux gènes sont sur des chromosomes différents",
      "Les gènes s’assortissent toujours indépendamment",
      "Les gènes ne sont jamais transmis ensemble"
    ],
    answer: "Deux gènes sont situés sur le même chromosome",
    explanation: "Ils sont physiquement liés. Pourquoi cette proximité réduit-elle la probabilité d’assortiment indépendant ?"
  },
  {
    type: "qcm",
    question: "Lorsque deux gènes sont liés, le rapport phénotypique en F2 s’éloigne de :",
    options: [
      "9 : 3 : 3 : 1",
      "3 : 1",
      "1 : 1 : 1 : 1",
      "1 : 2 : 1"
    ],
    answer: "9 : 3 : 3 : 1",
    explanation: "On observe plus de phénotypes parentaux et moins de recombinants. Pourquoi ce déséquilibre est-il la signature de la liaison ?"
  },
  {
    type: "qcm",
    question: "Les gamètes parentaux (non recombinants) sont produits en :",
    options: [
      "Plus grande quantité que les gamètes recombinants",
      "Même quantité que les recombinants",
      "Quantité nulle",
      "Quantité supérieure seulement chez les homozygotes"
    ],
    answer: "Plus grande quantité que les gamètes recombinants",
    explanation: "Ils correspondent à la configuration d’origine. Pourquoi leur fréquence élevée indique-t-elle une liaison génétique ?"
  },
  {
    type: "qcm",
    question: "Le crossing-over entre deux gènes liés permet :",
    options: [
      "La production de gamètes recombinants",
      "La suppression totale de la recombinaison",
      "La liaison complète",
      "La disparition des allèles"
    ],
    answer: "La production de gamètes recombinants",
    explanation: "Il se produit pendant la prophase I de la méiose. Pourquoi plus les gènes sont éloignés, plus le taux de crossing-over est élevé ?"
  },
  {
    type: "qcm",
    question: "La fréquence de recombinaison (FR) entre deux gènes est utilisée pour :",
    options: [
      "Calculer la distance génétique entre eux (en centimorgans)",
      "Déterminer le nombre de chromosomes",
      "Mesurer la dominance",
      "Calculer le nombre d’allèles"
    ],
    answer: "Calculer la distance génétique entre eux (en centimorgans)",
    explanation: "1% de recombinaison = 1 cM. Pourquoi cette mesure permet-elle de construire des cartes génétiques ?"
  },
  {
    type: "qcm",
    question: "Si la fréquence de recombinaison entre deux gènes est de 8%, on dit que :",
    options: [
      "Ils sont liés et relativement proches",
      "Ils sont indépendants",
      "Ils sont sur des chromosomes différents",
      "Ils sont complètement liés"
    ],
    answer: "Ils sont liés et relativement proches",
    explanation: "Moins de 50% de recombinaison = liaison. Pourquoi une FR de 50% correspond-elle à l’assortiment indépendant ?"
  },
  {
    type: "qcm",
    question: "Dans un croisement test d’un double hétérozygote en cis (AB/ab), les individus parentaux sont majoritaires car :",
    options: [
      "Les allèles parentaux sont transmis ensemble sans crossing-over",
      "Il y a eu beaucoup de crossing-over",
      "Les gènes sont indépendants",
      "Les allèles sont codominants"
    ],
    answer: "Les allèles parentaux sont transmis ensemble sans crossing-over",
    explanation: "Configuration cis ou trans (coupling/repulsion). Pourquoi la phase de liaison (cis ou trans) influence-t-elle les résultats ?"
  },
  {
    type: "qcm",
    question: "Lorsque deux gènes sont complètement liés (aucun crossing-over), le rapport en test-cross est :",
    options: [
      "1 : 1 (seulement deux types de descendants)",
      "1 : 1 : 1 : 1",
      "9 : 3 : 3 : 1",
      "3 : 1"
    ],
    answer: "1 : 1 (seulement deux types de descendants)",
    explanation: "Pas de recombinants. Pourquoi ce résultat ressemble-t-il à un monohybridisme ?"
  },
  {
    type: "qcm",
    question: "La liaison génétique a été découverte grâce à :",
    options: [
      "L’observation de déviations par rapport au rapport 9:3:3:1",
      "Les travaux de Mendel",
      "L’étude des chromosomes sexuels uniquement",
      "Les mutations chromosomiques"
    ],
    answer: "L’observation de déviations par rapport au rapport 9:3:3:1",
    explanation: "Travaux de Morgan sur la drosophile. Pourquoi cette découverte a-t-elle complété la théorie mendélienne ?"
  },
  {
    type: "qcm",
    question: "Plus deux gènes sont éloignés sur un chromosome, :",
    options: [
      "Plus la fréquence de recombinaison est élevée",
      "Moins ils recombinent",
      "Plus ils sont complètement liés",
      "Moins ils sont transmis"
    ],
    answer: "Plus la fréquence de recombinaison est élevée",
    explanation: "Jusqu’à un maximum de 50%. Pourquoi cette limite correspond-elle à l’assortiment indépendant ?"
  },
  {
    type: "qcm",
    question: "Un individu AaBb en configuration cis a les allèles :",
    options: [
      "A et B sur le même chromosome, a et b sur l’autre",
      "A et b sur le même chromosome",
      "Tous les allèles dominants sur un chromosome",
      "Aucun allèle dominant"
    ],
    answer: "A et B sur le même chromosome, a et b sur l’autre",
    explanation: "Configuration de couplage (coupling). Pourquoi distinguer cis et trans est-il important dans l’analyse de liaison ?"
  },
  {
    type: "qcm",
    question: "La carte génétique mesure la distance entre gènes en :",
    options: [
      "Centimorgans (cM)",
      "Nombre de paires de bases",
      "Nombre de chromosomes",
      "Pourcentage de dominance"
    ],
    answer: "Centimorgans (cM)",
    explanation: "1 cM = 1% de recombinaison. Pourquoi cette unité est-elle très utile en cartographie génétique ?"
  },
  {
    type: "qcm",
    question: "Lorsque la fréquence de recombinaison est exactement 50%, on conclut que :",
    options: [
      "Les gènes sont indépendants (ou très éloignés)",
      "Les gènes sont complètement liés",
      "Il n’y a qu’un seul gène",
      "Il y a dominance incomplète"
    ],
    answer: "Les gènes sont indépendants (ou très éloignés)",
    explanation: "Comportement identique à l’assortiment indépendant. Pourquoi cette valeur est-elle le seuil entre liaison et indépendance ?"
  },
  {
    type: "qcm",
    question: "La liaison des gènes explique pourquoi certains caractères sont :",
    options: [
      "Souvent hérités ensemble",
      "Toujours indépendants",
      "Jamais transmis",
      "Uniquement récessifs"
    ],
    answer: "Souvent hérités ensemble",
    explanation: "Héritage en bloc. Pourquoi cela a-t-il des conséquences importantes en génétique médicale (ex. : maladies liées) ?"
  },
  {
    type: "qcm",
    question: "Le crossing-over est un phénomène :",
    options: [
      "Aléatoire qui augmente la diversité génétique",
      "Qui supprime toute variation",
      "Qui se produit uniquement en mitose",
      "Absent chez les eucaryotes"
    ],
    answer: "Aléatoire qui augmente la diversité génétique",
    explanation: "Il brise la liaison. Pourquoi le crossing-over est-il essentiel pour l’évolution malgré la liaison ?"
  },
  {
    type: "qcm",
    question: "En cas de liaison complète, un individu AaBb produira :",
    options: [
      "Seulement deux types de gamètes (AB et ab ou Ab et aB)",
      "Quatre types de gamètes",
      "Un seul type de gamète",
      "Huit types de gamètes"
    ],
    answer: "Seulement deux types de gamètes (AB et ab ou Ab et aB)",
    explanation: "Pas de recombinants. Pourquoi ce comportement modifie-t-il fortement les prévisions mendéliennes classiques ?"
  },
  {
    type: "qcm",
    question: "La liaison des gènes a été mise en évidence chez :",
    options: [
      "La drosophile par Thomas Morgan",
      "Le pois par Mendel",
      "L’humain uniquement",
      "Les bactéries"
    ],
    answer: "La drosophile par Thomas Morgan",
    explanation: "Études sur la couleur des yeux et la longueur des ailes. Pourquoi la drosophile a-t-elle été un modèle idéal pour découvrir la liaison ?"
  },
  {
    type: "qcm",
    question: "La distance génétique entre deux gènes liés est proportionnelle à :",
    options: [
      "La fréquence de crossing-over entre eux",
      "Leur dominance",
      "Leur taille",
      "Leur séquence nucléotidique"
    ],
    answer: "La fréquence de crossing-over entre eux",
    explanation: "Plus grande distance = plus de recombinaison. Pourquoi cette relation permet-elle de classer les gènes sur une carte ?"
  },
  {
    type: "qcm",
    question: "Le dihybridisme avec liaison des gènes est plus complexe que le cas d’assortiment indépendant car :",
    options: [
      "Les gènes ne se comportent plus de façon totalement autonome",
      "Les gènes sont toujours indépendants",
      "Il n’y a plus de dominance",
      "Il n’y a plus de méiose"
    ],
    answer: "Les gènes ne se comportent plus de façon totalement autonome",
    explanation: "Ils sont transmis en bloc sauf en cas de crossing-over. Pourquoi cela représente-t-il une exception importante aux lois de Mendel ?"
  },
  {
    type: "qcm",
    question: "Globalement, l’étude de la liaison des gènes permet de :",
    options: [
      "Construire des cartes génétiques et mieux comprendre l’organisation des chromosomes",
      "Ignorer la méiose",
      "Étudier uniquement le monohybridisme",
      "Supprimer la variation génétique"
    ],
    answer: "Construire des cartes génétiques et mieux comprendre l’organisation des chromosomes",
    explanation: "Base de la cartographie génétique. Pourquoi cette notion est-elle essentielle en génétique moderne et en médecine ?"
  }
] },
        { nom: "Cas particuliers", quiz: [
  {
    type: "qcm",
    question: "Les cas particuliers du Mendélisme concernent :",
    options: [
      "Les situations où les règles mendéliennes classiques ne s’appliquent pas directement",
      "Uniquement le monohybridisme",
      "Seulement la liaison des gènes",
      "Les mutations chromosomiques uniquement"
    ],
    answer: "Les situations où les règles mendéliennes classiques ne s’appliquent pas directement",
    explanation: "Exemples : dominance incomplète, codominance, épistasie, létalité… Pourquoi ces exceptions sont-elles importantes pour comprendre la complexité de l’hérédité ?"
  },
  {
    type: "qcm",
    question: "Dans la dominance incomplète, l’hétérozygote a un phénotype :",
    options: [
      "Intermédiaire entre les deux homozygotes",
      "Identique à l’homozygote dominant",
      "Identique à l’homozygote récessif",
      "Toujours récessif"
    ],
    answer: "Intermédiaire entre les deux homozygotes",
    explanation: "Exemple : fleur rouge × fleur blanche = fleurs roses. Pourquoi ce cas montre-t-il que la dominance n’est pas toujours complète ?"
  },
  {
    type: "qcm",
    question: "La codominance se caractérise par :",
    options: [
      "L’expression simultanée et complète des deux allèles chez l’hétérozygote",
      "Un phénotype intermédiaire",
      "La suppression d’un allèle",
      "L’absence d’expression"
    ],
    answer: "L’expression simultanée et complète des deux allèles chez l’hétérozygote",
    explanation: "Exemple : groupe sanguin AB. Pourquoi la codominance est-elle différente de la dominance incomplète ?"
  },
  {
    type: "qcm",
    question: "Un exemple classique de codominance est :",
    options: [
      "Le système ABO du groupe sanguin",
      "La couleur de la fleur chez le pétunia",
      "La couleur du pelage chez la souris",
      "La taille des graines chez le pois"
    ],
    answer: "Le système ABO du groupe sanguin",
    explanation: "Les allèles IA et IB sont tous deux exprimés chez l’hétérozygote AB. Pourquoi ce cas est-il très utile en médecine légale ?"
  },
  {
    type: "qcm",
    question: "L’allélisme multiple désigne :",
    options: [
      "L’existence de plus de deux allèles pour un même gène dans une population",
      "La présence de deux allèles uniquement",
      "Des gènes sur des chromosomes différents",
      "Des gènes liés"
    ],
    answer: "L’existence de plus de deux allèles pour un même gène dans une population",
    explanation: "Exemple : système ABO avec IA, IB et i. Pourquoi l’allélisme multiple augmente-t-il la diversité génétique ?"
  },
  {
    type: "qcm",
    question: "La létalité d’un allèle signifie que :",
    options: [
      "L’homozygote pour cet allèle ne survit pas",
      "L’allèle est toujours dominant",
      "L’allèle n’est jamais transmis",
      "L’allèle est codominant"
    ],
    answer: "L’homozygote pour cet allèle ne survit pas",
    explanation: "Exemple : allèle jaune chez la souris (AY). Pourquoi la létalité modifie-t-elle les rapports mendéliens attendus ?"
  },
  {
    type: "qcm",
    question: "Dans le cas de létalité récessive, le rapport en F2 devient :",
    options: [
      "2 : 1 au lieu de 3 : 1",
      "9 : 3 : 3 : 1",
      "1 : 2 : 1",
      "3 : 1"
    ],
    answer: "2 : 1 au lieu de 3 : 1",
    explanation: "Les homozygotes récessifs meurent. Pourquoi ce rapport modifié est-il un indice de létalité ?"
  },
  {
    type: "qcm",
    question: "L’épistasie est une interaction où :",
    options: [
      "Un gène masque l’expression d’un autre gène",
      "Deux gènes s’expriment indépendamment",
      "Un allèle devient récessif",
      "Il n’y a aucune interaction"
    ],
    answer: "Un gène masque l’expression d’un autre gène",
    explanation: "Exemple : couleur du pelage chez les souris (gène C masque le gène A). Pourquoi l’épistasie complique-t-elle l’analyse mendélienne ?"
  },
  {
    type: "qcm",
    question: "La pléiotropie désigne :",
    options: [
      "Un gène qui influence plusieurs caractères",
      "Plusieurs gènes qui contrôlent un seul caractère",
      "Un gène sans effet",
      "Une mutation chromosomique"
    ],
    answer: "Un gène qui influence plusieurs caractères",
    explanation: "Exemple : gène de la drépanocytose. Pourquoi la pléiotropie montre-t-elle que l’action des gènes est souvent complexe ?"
  },
  {
    type: "qcm",
    question: "Dans le cas de dominance incomplète (ex. : RR = rouge, rr = blanc), le croisement RR × rr donne en F1 :",
    options: [
      "Tous roses (Rr)",
      "Tous rouges",
      "Tous blancs",
      "Moitié rouge, moitié blanc"
    ],
    answer: "Tous roses (Rr)",
    explanation: "Phénotype intermédiaire. Pourquoi ce résultat contredit-il la dominance complète mendélienne ?"
  },
  {
    type: "qcm",
    question: "Un rapport 9:3:4 en F2 est typique de :",
    options: [
      "Épistasie récessive",
      "Dominance incomplète",
      "Assortiment indépendant classique",
      "Liaison complète"
    ],
    answer: "Épistasie récessive",
    explanation: "Le gène récessif masque l’expression d’un autre gène. Pourquoi ce rapport est-il un indice d’interaction génique ?"
  },
  {
    type: "qcm",
    question: "Dans le cas de létalité dominante, :",
    options: [
      "L’homozygote dominant meurt",
      "L’homozygote récessif meurt",
      "Tous les individus survivent",
      "Seuls les hétérozygotes meurent"
    ],
    answer: "L’homozygote dominant meurt",
    explanation: "Exemple : achondroplasie chez l’homme. Pourquoi ce type de létalité est-il rare ?"
  },
  {
    type: "qcm",
    question: "La codominance et la dominance incomplète ont en commun :",
    options: [
      "L’hétérozygote ne présente pas le phénotype du dominant complet",
      "L’hétérozygote est toujours identique à l’homozygote dominant",
      "Il n’y a pas d’expression des allèles",
      "Ils ne concernent qu’un seul gène"
    ],
    answer: "L’hétérozygote ne présente pas le phénotype du dominant complet",
    explanation: "Ils représentent des exceptions à la dominance complète. Pourquoi ces cas enrichissent-ils la compréhension de l’expression génique ?"
  },
  {
    type: "qcm",
    question: "Un gène pléiotrope peut expliquer :",
    options: [
      "Pourquoi une maladie génétique affecte plusieurs organes",
      "Un seul caractère",
      "La liaison génétique",
      "L’assortiment indépendant"
    ],
    answer: "Pourquoi une maladie génétique affecte plusieurs organes",
    explanation: "Exemple : phénylcétonurie. Pourquoi la pléiotropie complique-t-elle le diagnostic et le conseil génétique ?"
  },
  {
    type: "qcm",
    question: "Dans le cas d’épistasie dominante, le rapport en F2 peut devenir :",
    options: [
      "12 : 3 : 1 ou 13 : 3",
      "9 : 3 : 3 : 1",
      "1 : 2 : 1",
      "3 : 1"
    ],
    answer: "12 : 3 : 1 ou 13 : 3",
    explanation: "Un gène dominant masque l’expression d’un autre. Pourquoi ces rapports modifiés sont-ils des preuves d’interactions épistatiques ?"
  },
  {
    type: "qcm",
    question: "Les cas particuliers du Mendélisme montrent que :",
    options: [
      "L’hérédité est plus complexe que les lois simples de Mendel",
      "Les lois de Mendel sont fausses",
      "Il n’y a aucune interaction entre gènes",
      "Tous les caractères sont indépendants"
    ],
    answer: "L’hérédité est plus complexe que les lois simples de Mendel",
    explanation: "Mendel a décrit des cas simples. Pourquoi l’étude des exceptions a permis d’enrichir la génétique ?"
  },
  {
    type: "qcm",
    question: "Un exemple de gène à effet pléiotrope chez l’homme est :",
    options: [
      "Le gène de la fibrose kystique",
      "Le gène de la couleur des yeux uniquement",
      "Le gène de la taille",
      "Le gène mitochondrial"
    ],
    answer: "Le gène de la fibrose kystique",
    explanation: "Il affecte poumons, pancréas, intestins… Pourquoi la pléiotropie est-elle fréquente dans les maladies génétiques ?"
  },
  {
    type: "qcm",
    question: "La dominance incomplète et la codominance sont des exemples de :",
    options: [
      "Absence de dominance complète",
      "Létalité",
      "Liaison génétique",
      "Épistasie"
    ],
    answer: "Absence de dominance complète",
    explanation: "Ils montrent une expression intermédiaire ou simultanée des allèles. Pourquoi ces cas remettent-ils en question l’idée d’une dominance universelle ?"
  },
  {
    type: "qcm",
    question: "Les cas particuliers du Mendélisme sont importants car ils permettent :",
    options: [
      "De mieux comprendre les mécanismes réels de l’expression génique",
      "D’ignorer les lois de Mendel",
      "De simplifier tous les croisements",
      "D’étudier uniquement la liaison"
    ],
    answer: "De mieux comprendre les mécanismes réels de l’expression génique",
    explanation: "Ils révèlent interactions, modulations et complexités. Pourquoi cette compréhension est-elle essentielle en génétique médicale ?"
  },
  {
    type: "qcm",
    question: "Globalement, les cas particuliers du Mendélisme montrent que :",
    options: [
      "La génétique mendélienne classique est une simplification utile mais incomplète",
      "Les lois de Mendel ne s’appliquent jamais",
      "Tous les caractères suivent le rapport 9:3:3:1",
      "Il n’existe pas d’interaction entre gènes"
    ],
    answer: "La génétique mendélienne classique est une simplification utile mais incomplète",
    explanation: "Base solide, mais la réalité est plus nuancée. Pourquoi maîtriser ces cas particuliers est-il indispensable pour analyser correctement les héritages complexes ?"
  }
] },
        { nom: "Mutations genetiques et mutations chromosomiques", quiz: [
  {
    type: "qcm",
    question: "Une mutation génique est :",
    options: [
      "Un changement dans la séquence nucléotidique d’un gène",
      "Un changement du nombre de chromosomes",
      "Une modification de la structure d’un chromosome entier",
      "Uniquement une erreur pendant la mitose"
    ],
    answer: "Un changement dans la séquence nucléotidique d’un gène",
    explanation: "Elle concerne un seul gène ou une petite partie d’ADN. Pourquoi les mutations ponctuelles sont-elles à la base de la variabilité génétique et de nombreuses maladies ?"
  },
  {
    type: "qcm",
    question: "Une mutation ponctuelle peut être :",
    options: [
      "Une substitution, une insertion ou une délétion d’une base",
      "Uniquement une délétion de chromosome",
      "Uniquement une duplication",
      "Un changement du nombre total de chromosomes"
    ],
    answer: "Une substitution, une insertion ou une délétion d’une base",
    explanation: "Ce sont les mutations géniques les plus fréquentes. Pourquoi une substitution peut-elle être silencieuse, missense ou nonsense ?"
  },
  {
    type: "qcm",
    question: "Une mutation silencieuse est :",
    options: [
      "Une substitution qui ne change pas l’acide aminé",
      "Une mutation qui entraîne une protéine tronquée",
      "Une délétion de plusieurs bases",
      "Une translocation chromosomique"
    ],
    answer: "Une substitution qui ne change pas l’acide aminé",
    explanation: "Grâce à la dégénérescence du code génétique. Pourquoi ces mutations sont-elles souvent sans effet phénotypique ?"
  },
  {
    type: "qcm",
    question: "Une mutation faux-sens (missense) entraîne :",
    options: [
      "Le remplacement d’un acide aminé par un autre",
      "L’apparition d’un codon stop prématuré",
      "Aucun changement d’acide aminé",
      "Une délétion de plusieurs acides aminés"
    ],
    answer: "Le remplacement d’un acide aminé par un autre",
    explanation: "Exemple : drépanocytose (HbS). Pourquoi ce type de mutation peut-il avoir des effets graves ou bénins selon la position ?"
  },
  {
    type: "qcm",
    question: "Une mutation non-sens (nonsense) provoque :",
    options: [
      "L’apparition d’un codon stop prématuré → protéine tronquée",
      "Un changement silencieux",
      "Une insertion de bases",
      "Un décalage du cadre de lecture"
    ],
    answer: "L’apparition d’un codon stop prématuré → protéine tronquée",
    explanation: "La protéine est souvent non fonctionnelle. Pourquoi ces mutations sont-elles généralement délétères ?"
  },
  {
    type: "qcm",
    question: "Une mutation par décalage du cadre de lecture (frameshift) est causée par :",
    options: [
      "Insertion ou délétion d’un nombre de bases non multiple de 3",
      "Substitution d’une base",
      "Duplication d’un chromosome",
      "Inversion chromosomique"
    ],
    answer: "Insertion ou délétion d’un nombre de bases non multiple de 3",
    explanation: "Elle altère tous les codons en aval. Pourquoi ce type de mutation est-il souvent très grave ?"
  },
  {
    type: "qcm",
    question: "Les mutations chromosomiques concernent :",
    options: [
      "Des modifications de structure ou de nombre de chromosomes entiers",
      "Uniquement un seul nucléotide",
      "Des changements dans un seul gène",
      "Uniquement les mitochondries"
    ],
    answer: "Des modifications de structure ou de nombre de chromosomes entiers",
    explanation: "Elles sont souvent visibles au caryotype. Pourquoi sont-elles généralement plus graves que les mutations géniques ?"
  },
  {
    type: "qcm",
    question: "La trisomie 21 est un exemple de :",
    options: [
      "Aneuploidie (mutation de nombre)",
      "Délétion",
      "Inversion",
      "Translocation réciproque"
    ],
    answer: "Aneuploidie (mutation de nombre)",
    explanation: "Présence de trois chromosomes 21. Pourquoi cette anomalie est-elle l’une des plus fréquentes chez l’homme ?"
  },
  {
    type: "qcm",
    question: "Une délétion chromosomique consiste en :",
    options: [
      "La perte d’un segment de chromosome",
      "L’ajout d’un segment supplémentaire",
      "Le retournement d’un segment",
      "L’échange entre deux chromosomes"
    ],
    answer: "La perte d’un segment de chromosome",
    explanation: "Exemple : syndrome du cri du chat (délétion 5p). Pourquoi les délétions sont-elles souvent délétères ?"
  },
  {
    type: "qcm",
    question: "Une translocation réciproque est :",
    options: [
      "L’échange de segments entre deux chromosomes non homologues",
      "La perte d’un segment",
      "Le doublement d’un segment",
      "Le retournement d’un segment"
    ],
    answer: "L’échange de segments entre deux chromosomes non homologues",
    explanation: "Peut être équilibrée ou déséquilibrée. Pourquoi les translocations équilibrées peuvent-elles être transmissibles sans effet visible ?"
  },
  {
    type: "qcm",
    question: "Une inversion chromosomique consiste en :",
    options: [
      "Le retournement de 180° d’un segment de chromosome",
      "La perte d’un chromosome entier",
      "L’ajout d’un chromosome supplémentaire",
      "La fusion de deux chromosomes"
    ],
    answer: "Le retournement de 180° d’un segment de chromosome",
    explanation: "Peut être paracentrique ou péricentrique. Pourquoi les inversions peuvent-elles perturber la méiose ?"
  },
  {
    type: "qcm",
    question: "Les mutations peuvent être :",
    options: [
      "Spontanées ou induites par des agents mutagènes",
      "Uniquement spontanées",
      "Uniquement induites",
      "Toujours réparées"
    ],
    answer: "Spontanées ou induites par des agents mutagènes",
    explanation: "Exemples : rayonnements, produits chimiques, virus. Pourquoi les cellules ont-elles des mécanismes de réparation de l’ADN ?"
  },
  {
    type: "qcm",
    question: "Une mutation somatique :",
    options: [
      "Ne se transmet pas à la descendance",
      "Est transmise à tous les descendants",
      "Concerne uniquement les gamètes",
      "Est toujours létale"
    ],
    answer: "Ne se transmet pas à la descendance",
    explanation: "Elle touche les cellules du corps. Pourquoi ces mutations sont-elles importantes en cancérologie ?"
  },
  {
    type: "qcm",
    question: "Une mutation germinale :",
    options: [
      "Peut être transmise à la descendance",
      "N’affecte que les cellules somatiques",
      "Est toujours silencieuse",
      "Ne concerne que les mitochondries"
    ],
    answer: "Peut être transmise à la descendance",
    explanation: "Elle touche les cellules reproductrices. Pourquoi ces mutations sont-elles essentielles en génétique médicale ?"
  },
  {
    type: "qcm",
    question: "Le syndrome de Turner est dû à :",
    options: [
      "Une monosomie X (45, XO)",
      "Une trisomie 21",
      "Une délétion 5p",
      "Une translocation 14/21"
    ],
    answer: "Une monosomie X (45, XO)",
    explanation: "Aneuploidie. Pourquoi ce syndrome n’existe-t-il que chez les femmes ?"
  },
  {
    type: "qcm",
    question: "Une duplication chromosomique peut entraîner :",
    options: [
      "Une surexpression de certains gènes",
      "La perte complète d’un gène",
      "Un retournement de segment",
      "Une séparation des chromosomes"
    ],
    answer: "Une surexpression de certains gènes",
    explanation: "Exemple : syndrome de Charcot-Marie-Tooth. Pourquoi les duplications peuvent-elles causer des maladies ?"
  },
  {
    type: "qcm",
    question: "Les agents mutagènes les plus connus sont :",
    options: [
      "Les rayonnements ionisants, les produits chimiques et certains virus",
      "Uniquement les aliments",
      "Seulement la température",
      "Uniquement les bactéries"
    ],
    answer: "Les rayonnements ionisants, les produits chimiques et certains virus",
    explanation: "Exemples : UV, tabac, benzène. Pourquoi l’exposition à ces agents doit-elle être limitée ?"
  },
  {
    type: "qcm",
    question: "La plupart des mutations sont :",
    options: [
      "Délétères ou neutres",
      "Bénéfiques",
      "Toujours visibles",
      "Toujours réparées parfaitement"
    ],
    answer: "Délétères ou neutres",
    explanation: "Les mutations bénéfiques sont rares. Pourquoi l’organisme a-t-il développé des systèmes de réparation de l’ADN ?"
  },
  {
    type: "qcm",
    question: "Les mutations chromosomiques sont généralement :",
    options: [
      "Plus faciles à détecter au caryotype que les mutations géniques",
      "Impossible à détecter",
      "Toujours silencieuses",
      "Uniquement germinales"
    ],
    answer: "Plus faciles à détecter au caryotype que les mutations géniques",
    explanation: "Elles affectent la structure ou le nombre visible des chromosomes. Pourquoi le caryotype reste-t-il un examen clé ?"
  },
  {
    type: "qcm",
    question: "Globalement, les mutations géniques et chromosomiques sont :",
    options: [
      "La source principale de la variabilité génétique et de nombreuses maladies héréditaires",
      "Toujours bénéfiques pour l’espèce",
      "Sans aucun effet sur l’évolution",
      "Uniquement présentes chez les plantes"
    ],
    answer: "La source principale de la variabilité génétique et de nombreuses maladies héréditaires",
    explanation: "Matière première de l’évolution, mais aussi cause de pathologies. Pourquoi leur étude est-elle fondamentale en biologie et en médecine ?"
  }
] },
        { nom: "Examen 2021", quiz: [] },
        { nom: "Examen 2022", quiz: [] }
      ]
    },
    {
      nom: "Biologie Moleculaire",
      pdfCours: null,
      sousMatieres: [
        { nom: "TD Biologie moleculaire" ,quiz:[
  {
    type: "qcm",
    question: "La Biologie Moléculaire est une discipline qui se situe au croisement de :",
    options: [
      "La génétique, la biochimie et la physique",
      "Uniquement la génétique et la physiologie",
      "La botanique et la zoologie",
      "La microbiologie et l’écologie uniquement"
    ],
    answer: "La génétique, la biochimie et la physique",
    explanation: "Elle étudie les mécanismes du vivant au niveau moléculaire. Pourquoi cette interdisciplinarité est-elle essentielle pour comprendre le fonctionnement de la cellule ?"
  },
  {
    type: "qcm",
    question: "Le Dogme Central de la Biologie Moléculaire a été proposé par :",
    options: [
      "Francis Crick en 1953",
      "Watson et Crick en 1953",
      "Mendel en 1865",
      "Avery en 1944"
    ],
    answer: "Francis Crick en 1953",
    explanation: "Il décrit le flux de l’information génétique : ADN → ARN → Protéine. Pourquoi ce dogme reste-t-il central même s’il a été nuancé par la suite ?"
  },
  {
    type: "qcm",
    question: "Dans le Dogme Central, le processus qui permet de passer de l’ADN à l’ARN s’appelle :",
    options: [
      "Transcription",
      "Traduction",
      "Réplication",
      "Épissage"
    ],
    answer: "Transcription",
    explanation: "L’ARN messager est synthétisé à partir d’un gène. Pourquoi la transcription est-elle la première étape de l’expression génétique ?"
  },
  {
    type: "qcm",
    question: "La Traduction correspond à :",
    options: [
      "La synthèse d’une protéine à partir d’un ARN messager",
      "La copie de l’ADN en ARN",
      "La réplication de l’ADN",
      "La réparation de l’ADN"
    ],
    answer: "La synthèse d’une protéine à partir d’un ARN messager",
    explanation: "1 codon (3 nucléotides) code pour 1 acide aminé. Pourquoi le code génétique est-il dit dégénéré ?"
  },
  {
    type: "qcm",
    question: "Le support chimique principal de l’information génétique est :",
    options: [
      "L’ADN",
      "L’ARN",
      "Les protéines",
      "Les lipides"
    ],
    answer: "L’ADN",
    explanation: "Découvert grâce aux travaux d’Avery, puis confirmé par Hershey et Chase. Pourquoi l’ADN est-il considéré comme le support stable de l’hérédité ?"
  },
  {
    type: "qcm",
    question: "La structure en double hélice de l’ADN a été découverte en :",
    options: [
      "1953 par Watson, Crick, Wilkins et Franklin",
      "1865 par Mendel",
      "1944 par Avery",
      "1958 par Meselson et Stahl"
    ],
    answer: "1953 par Watson, Crick, Wilkins et Franklin",
    explanation: "Modèle basé sur les clichés de diffraction aux rayons X de Franklin. Pourquoi cette découverte a-t-elle révolutionné la biologie ?"
  },
  {
    type: "qcm",
    question: "L’ARN messager (ARNm) a pour rôle principal :",
    options: [
      "Transporter l’information génétique du noyau vers les ribosomes",
      "Former la structure des ribosomes",
      "Transporter les acides aminés",
      "Réguler l’expression des gènes"
    ],
    answer: "Transporter l’information génétique du noyau vers les ribosomes",
    explanation: "Il est transcrit à partir de l’ADN. Pourquoi l’ARNm est-il considéré comme un intermédiaire indispensable ?"
  },
  {
    type: "qcm",
    question: "Les ARN de transfert (ARNt) servent à :",
    options: [
      "Transporter les acides aminés vers le ribosome pendant la traduction",
      "Copier l’information de l’ADN",
      "Constituer le ribosome",
      "Réguler la transcription"
    ],
    answer: "Transporter les acides aminés vers le ribosome pendant la traduction",
    explanation: "Ils possèdent un anticodon. Pourquoi cette fonction est-elle cruciale pour la fidélité de la synthèse protéique ?"
  },
  {
    type: "qcm",
    question: "Le code génétique est :",
    options: [
      "Universel, dégénéré, non ambigu et lu dans un sens",
      "Spécifique à chaque organisme",
      "Lu dans les deux sens",
      "Composé de 2 nucléotides par codon"
    ],
    answer: "Universel, dégénéré, non ambigu et lu dans un sens",
    explanation: "Presque identique chez tous les êtres vivants. Pourquoi cette universalité soutient-elle l’idée d’une origine commune de la vie ?"
  },
  {
    type: "qcm",
    question: "Un gène est :",
    options: [
      "Une séquence d’ADN qui code pour une protéine ou un ARN fonctionnel",
      "Uniquement une protéine",
      "Un chromosome entier",
      "Un fragment d’ARN non codant"
    ],
    answer: "Une séquence d’ADN qui code pour une protéine ou un ARN fonctionnel",
    explanation: "Unité de base de l’hérédité. Pourquoi la définition moderne d’un gène inclut-elle aussi les ARN non codants ?"
  },
  {
    type: "qcm",
    question: "L’épissage de l’ARN pré-messager permet :",
    options: [
      "D’éliminer les introns et de joindre les exons",
      "De copier l’ADN",
      "De synthétiser les protéines",
      "De répliquer l’ADN"
    ],
    answer: "D’éliminer les introns et de joindre les exons",
    explanation: "Phénomène typique des eucaryotes. Pourquoi l’épissage augmente-t-il la diversité protéique ?"
  },
  {
    type: "qcm",
    question: "La biologie moléculaire est devenue un outil puissant à partir des années :",
    options: [
      "1970",
      "1950",
      "1865",
      "2000"
    ],
    answer: "1970",
    explanation: "Grâce au développement des technologies de recombinaison de l’ADN. Pourquoi cette période marque-t-elle le début de la biologie moléculaire moderne ?"
  },
  {
    type: "qcm",
    question: "Les principales molécules de la vie étudiées en biologie moléculaire sont :",
    options: [
      "ADN, ARN et Protéines",
      "Lipides et glucides uniquement",
      "Vitamines et hormones",
      "Sels minéraux"
    ],
    answer: "ADN, ARN et Protéines",
    explanation: "Elles portent et expriment l’information génétique. Pourquoi ces trois classes de macromolécules sont-elles au cœur du cours ?"
  },
  {
    type: "qcm",
    question: "La réplication de l’ADN est :",
    options: [
      "Semi-conservative",
      "Conservative",
      "Dispersive",
      "Aléatoire"
    ],
    answer: "Semi-conservative",
    explanation: "Démontrée par Meselson et Stahl. Pourquoi ce mécanisme assure-t-il la fidélité de la transmission génétique ?"
  },
  {
    type: "qcm",
    question: "Globalement, ce cours de Biologie Moléculaire permet de comprendre :",
    options: [
      "Les mécanismes moléculaires du stockage, de la transmission et de l’expression de l’information génétique",
      "Uniquement l’anatomie des cellules",
      "Les processus physiologiques des organes",
      "La classification des organismes"
    ],
    answer: "Les mécanismes moléculaires du stockage, de la transmission et de l’expression de l’information génétique",
    explanation: "Objectif central du cours. Pourquoi ces connaissances sont-elles fondamentales pour la biologie moderne et la médecine ?"
  }
] },
        { nom: "Examen 2022", quiz: [] },
        { nom: "Examen 2024", quiz: [] }
      ]
    },
 {
  nom: "Informatique",
  pdfCours: null,
  sousMatieres: [
    { nom: "initialisation à l`algorithmique et la programmation en language C", quiz: [] },
    { nom: "Concepts de base de l`algorithmique", quiz: [] },
    { nom: "Concepts de base du language C", quiz: [] },
    { nom: "Structure de controle", quiz: [] },
    { nom: "Tableaux et chaines de caracteres", quiz: [] },
    { nom: "Fonctions et pointeurs:", quiz: [] }
  ]
}
  ],
  "2nd Semestre": [
    {
      nom: "Geodynamique externe",
      pdfCours: null,
      sousMatieres: [
        { nom: "Phenomenes externes", quiz: [
  {
    type: "qcm",
    question: "Les roches exogènes (roches sédimentaires) se forment :",
    options: [
      "À la surface de la Terre à partir de roches préexistantes",
      "En profondeur par cristallisation du magma",
      "Par transformation sous haute pression et température",
      "Uniquement par précipitation chimique en milieu marin"
    ],
    answer: "À la surface de la Terre à partir de roches préexistantes",
    explanation: "Elles couvrent environ 75% de la surface terrestre. Pourquoi ces roches sont-elles si importantes en géologie appliquée ?"
  },
  {
    type: "qcm",
    question: "Les roches sédimentaires résultent principalement de :",
    options: [
      "L’accumulation, le compactage et la cimentation de débris minéraux ou organiques",
      "La fusion et le refroidissement du magma",
      "La transformation métamorphique des roches",
      "L’altération uniquement sans transport"
    ],
    answer: "L’accumulation, le compactage et la cimentation de débris minéraux ou organiques",
    explanation: "Elles sont souvent stratifiées et fossilifères. Pourquoi cette origine explique-t-elle leur grande variabilité ?"
  },
  {
    type: "qcm",
    question: "Les deux grandes catégories de roches exogènes sont :",
    options: [
      "Roches résiduelles et roches sédimentaires",
      "Roches magmatiques et métamorphiques",
      "Roches plutoniques et volcaniques",
      "Roches détritiques et chimiques uniquement"
    ],
    answer: "Roches résiduelles et roches sédimentaires",
    explanation: "Les résiduelles se forment sur place, les sédimentaires après transport. Pourquoi cette distinction est-elle fondamentale ?"
  },
  {
    type: "qcm",
    question: "Le cycle des roches sédimentaires inclut les étapes suivantes :",
    options: [
      "Altération → Érosion → Transport → Sédimentation → Diagenèse",
      "Fusion → Cristallisation → Métamorphisme",
      "Subduction → Magmatisme",
      "Érosion uniquement sans dépôt"
    ],
    answer: "Altération → Érosion → Transport → Sédimentation → Diagenèse",
    explanation: "Cycle exogène classique. Pourquoi ce cycle est-il continu à la surface de la Terre ?"
  },
  {
    type: "qcm",
    question: "L’altération est l’ensemble des processus :",
    options: [
      "Physiques, chimiques et biologiques qui dégradent les roches en surface",
      "Internes de la Terre (magmatisme)",
      "De compaction profonde",
      "De fusion partielle"
    ],
    answer: "Physiques, chimiques et biologiques qui dégradent les roches en surface",
    explanation: "Elle prépare les matériaux pour l’érosion. Pourquoi l’altération est-elle le premier maillon du cycle sédimentaire ?"
  },
  {
    type: "qcm",
    question: "L’altération physique (mécanique) se caractérise par :",
    options: [
      "Une fragmentation sans modification de la composition chimique",
      "Une dissolution complète des minéraux",
      "Une transformation chimique des roches",
      "Une précipitation de nouveaux minéraux"
    ],
    answer: "Une fragmentation sans modification de la composition chimique",
    explanation: "Exemples : gélifraction, thermoclastie, abrasion. Pourquoi ce type d’altération est-il dominant en zones froides ou arides ?"
  },
  {
    type: "qcm",
    question: "La gélifraction (cryoclastie) est due à :",
    options: [
      "L’alternance gel/dégel de l’eau dans les fissures",
      "Des variations brutales de température sans eau",
      "L’action des racines des plantes",
      "L’abrasion par le vent"
    ],
    answer: "L’alternance gel/dégel de l’eau dans les fissures",
    explanation: "Elle provoque l’éclatement des roches. Pourquoi ce processus est-il très efficace en montagne ou en zone polaire ?"
  },
  {
    type: "qcm",
    question: "La thermoclastie résulte :",
    options: [
      "De variations brutales de température entraînant une dilatation différentielle",
      "De l’action du gel",
      "De l’abrasion par les glaciers",
      "De l’attaque chimique par les acides"
    ],
    answer: "De variations brutales de température entraînant une dilatation différentielle",
    explanation: "Fréquent dans les déserts et hautes montagnes. Pourquoi ce phénomène est-il plus marqué sur les roches sombres ?"
  },
  {
    type: "qcm",
    question: "L’érosion correspond à :",
    options: [
      "Le détachement et l’enlèvement des particules altérées",
      "Le dépôt des sédiments",
      "La transformation diagénétique",
      "L’altération chimique uniquement"
    ],
    answer: "Le détachement et l’enlèvement des particules altérées",
    explanation: "Elle est assurée par l’eau, le vent, la glace et la gravité. Pourquoi l’érosion est-elle indispensable au transport des matériaux ?"
  },
  {
    type: "qcm",
    question: "Le transport des sédiments peut être assuré par :",
    options: [
      "L’eau, le vent, les glaciers et la gravité",
      "Uniquement le magma",
      "Les réactions chimiques",
      "Les microorganismes uniquement"
    ],
    answer: "L’eau, le vent, les glaciers et la gravité",
    explanation: "Chaque agent donne des caractéristiques différentes aux sédiments. Pourquoi le mode de transport influence-t-il la nature des roches sédimentaires ?"
  },
  {
    type: "qcm",
    question: "La sédimentation (dépôt) se produit généralement :",
    options: [
      "Dans les bassins sédimentaires (points bas, fonds océaniques, deltas…)",
      "En altitude uniquement",
      "Dans les zones de subduction",
      "Au niveau des dorsales médio-océaniques"
    ],
    answer: "Dans les bassins sédimentaires (points bas, fonds océaniques, deltas…)",
    explanation: "C’est le lieu d’accumulation des sédiments. Pourquoi les milieux de sédimentation sont-ils très variés ?"
  },
  {
    type: "qcm",
    question: "La diagenèse correspond à :",
    options: [
      "L’ensemble des transformations qui transforment les sédiments en roches sédimentaires",
      "L’altération superficielle",
      "Le transport des particules",
      "L’érosion initiale"
    ],
    answer: "L’ensemble des transformations qui transforment les sédiments en roches sédimentaires",
    explanation: "Compaction, cimentation, recristallisation… Pourquoi la diagenèse est-elle la dernière étape du cycle sédimentaire ?"
  },
  {
    type: "qcm",
    question: "Les roches sédimentaires détritiques (clastiques) sont formées par :",
    options: [
      "L’accumulation de fragments de roches préexistantes",
      "Précipitation chimique directe",
      "Activité biologique uniquement",
      "Fusion magmatique"
    ],
    answer: "L’accumulation de fragments de roches préexistantes",
    explanation: "Exemples : grès, conglomérat, argile. Pourquoi ce groupe est-il le plus abondant ?"
  },
  {
    type: "qcm",
    question: "Les roches sédimentaires chimiques et biochimiques se forment par :",
    options: [
      "Précipitation de minéraux ou activité des organismes",
      "Fragmentation mécanique uniquement",
      "Métamorphisme",
      "Refroidissement du magma"
    ],
    answer: "Précipitation de minéraux ou activité des organismes",
    explanation: "Exemples : calcaire, évaporites, charbon. Pourquoi ces roches sont-elles importantes en géologie économique ?"
  },
  {
    type: "qcm",
    question: "Les roches résiduelles se forment :",
    options: [
      "Sur place par altération sans transport important",
      "Après un long transport par les rivières",
      "En milieu marin profond",
      "Par volcanisme"
    ],
    answer: "Sur place par altération sans transport important",
    explanation: "Exemple : latérite, bauxite. Pourquoi ces roches sont-elles souvent riches en minerais ?"
  },
  {
    type: "qcm",
    question: "Les discontinuités dans les roches (diaclases, failles, joints, porosité) favorisent :",
    options: [
      "L’altération et l’érosion",
      "La formation de roches magmatiques",
      "La subduction",
      "La fusion partielle"
    ],
    answer: "L’altération et l’érosion",
    explanation: "Elles permettent la pénétration de l’eau et des agents externes. Pourquoi ces discontinuités accélèrent-elles les processus exogènes ?"
  },
  {
    type: "qcm",
    question: "Les phénomènes externes (géodynamique externe) sont principalement liés à :",
    options: [
      "L’énergie solaire et l’action des agents atmosphériques",
      "La chaleur interne de la Terre",
      "La convection mantellique",
      "La radioactivité du noyau"
    ],
    answer: "L’énergie solaire et l’action des agents atmosphériques",
    explanation: "Contrairement à la géodynamique interne. Pourquoi cette distinction est-elle importante ?"
  },
  {
    type: "qcm",
    question: "Globalement, les phénomènes externes permettent de comprendre :",
    options: [
      "La genèse des roches sédimentaires et le modelé de la surface terrestre",
      "La structure profonde de la Terre",
      "Les séismes et les volcans",
      "La tectonique des plaques uniquement"
    ],
    answer: "La genèse des roches sédimentaires et le modelé de la surface terrestre",
    explanation: "Ils sculptent le relief et forment les bassins sédimentaires. Pourquoi cette partie du cours est-elle essentielle en géologie ?"
  }
] },
        { nom: "Milieux de sedimentation", quiz: [
  {
    type: "qcm",
    question: "Un milieu de sédimentation est :",
    options: [
      "L’environnement où les sédiments se déposent et s’accumulent",
      "Le lieu d’altération des roches",
      "La zone de transport uniquement",
      "Le site de fusion magmatique"
    ],
    answer: "L’environnement où les sédiments se déposent et s’accumulent",
    explanation: "Chaque milieu possède des conditions physiques, chimiques et biologiques spécifiques. Pourquoi l’identification du milieu est-elle fondamentale en géologie sédimentaire ?"
  },
  {
    type: "qcm",
    question: "Les milieux de sédimentation se classent généralement en :",
    options: [
      "Continentaux, transitionnels et marins",
      "Uniquement magmatiques et sédimentaires",
      "Internes et externes",
      "Tropicaux et polaires uniquement"
    ],
    answer: "Continentaux, transitionnels et marins",
    explanation: "Cette classification dépend de la position par rapport au niveau de la mer. Pourquoi cette répartition est-elle très utile pour interpréter les séries sédimentaires ?"
  },
  {
    type: "qcm",
    question: "Parmi les milieux continentaux, on trouve :",
    options: [
      "Fluvial, lacustre, éolien et glaciaire",
      "Deltaïque et littoral uniquement",
      "Plateau continental et abyssal",
      "Récifal et lagunaire"
    ],
    answer: "Fluvial, lacustre, éolien et glaciaire",
    explanation: "Ils sont situés sur les continents. Pourquoi les sédiments continentaux sont-ils souvent oxydés et grossiers ?"
  },
  {
    type: "qcm",
    question: "Le milieu fluvial est caractérisé par :",
    options: [
      "Le transport et le dépôt par les rivières (conglomérats, grès)",
      "Le dépôt chimique de calcaire",
      "L’action exclusive du vent",
      "Une sédimentation très fine en eau profonde"
    ],
    answer: "Le transport et le dépôt par les rivières (conglomérats, grès)",
    explanation: "Les dépôts sont souvent lenticulaires et montrent des structures de chenaux. Pourquoi ce milieu est-il très important pour l’exploration des hydrocarbures ?"
  },
  {
    type: "qcm",
    question: "Le milieu éolien (désertique) se reconnaît par :",
    options: [
      "Des dunes, des sables bien triés et des structures de stratification entrecroisée",
      "Des dépôts fins laminés",
      "Des conglomérats grossiers",
      "Des récifs coralliens"
    ],
    answer: "Des dunes, des sables bien triés et des structures de stratification entrecroisée",
    explanation: "Le vent trie efficacement les grains. Pourquoi les sédiments éoliens sont-ils souvent bien classés ?"
  },
  {
    type: "qcm",
    question: "Un milieu transitionnel typique est :",
    options: [
      "Le delta (zone entre terre et mer)",
      "Le milieu abyssal profond",
      "Le lac continental",
      "Le glacier"
    ],
    answer: "Le delta (zone entre terre et mer)",
    explanation: "Exemple : delta du fleuve Sénégal. Pourquoi les deltas sont-ils des milieux très riches en hydrocarbures ?"
  },
  {
    type: "qcm",
    question: "Les milieux marins peu profonds (plateau continental) sont caractérisés par :",
    options: [
      "Des dépôts carbonatés, grès et marnes avec traces de vie abondante",
      "Des turbidites et argiles fines",
      "Des sables éoliens",
      "Des dépôts glaciaires"
    ],
    answer: "Des dépôts carbonatés, grès et marnes avec traces de vie abondante",
    explanation: "Zone photique avec forte activité biologique. Pourquoi ces milieux sont-ils souvent fossilifères ?"
  },
  {
    type: "qcm",
    question: "Le milieu récifal correspond à :",
    options: [
      "Un environnement peu profond avec construction de récifs coralliens ou algaires",
      "Un bassin profond sans lumière",
      "Un désert continental",
      "Un lac d’eau douce"
    ],
    answer: "Un environnement peu profond avec construction de récifs coralliens ou algaires",
    explanation: "Très productif biologiquement. Pourquoi les récifs sont-ils d’excellents réservoirs de pétrole ?"
  },
  {
    type: "qcm",
    question: "Dans le milieu marin profond (bassin abyssal), on trouve principalement :",
    options: [
      "Des argiles fines, turbidites et sédiments pélagiques",
      "Des conglomérats grossiers",
      "Des dunes de sable",
      "Des évaporites"
    ],
    answer: "Des argiles fines, turbidites et sédiments pélagiques",
    explanation: "Faible énergie et grande profondeur. Pourquoi les turbidites sont-elles caractéristiques de ce milieu ?"
  },
  {
    type: "qcm",
    question: "Les évaporites se forment principalement dans :",
    options: [
      "Les milieux lagunaires ou sabkhas très chauds et peu profonds",
      "Les milieux glaciaires",
      "Les deltas fluviaux",
      "Les bassins océaniques profonds"
    ],
    answer: "Les milieux lagunaires ou sabkhas très chauds et peu profonds",
    explanation: "Par évaporation intense (ex. : gypse, halite). Pourquoi ces roches indiquent-elles un climat aride ?"
  },
  {
    type: "qcm",
    question: "Les turbidites sont des dépôts typiques :",
    options: [
      "Des courants de turbidité en milieu marin profond",
      "Du vent dans les déserts",
      "Des rivières en plaine alluviale",
      "Des glaciers"
    ],
    answer: "Des courants de turbidité en milieu marin profond",
    explanation: "Elles montrent un granoclassement. Pourquoi ce faciès est-il important pour reconstituer les paléoenvironnements ?"
  },
  {
    type: "qcm",
    question: "L’identification d’un milieu de sédimentation repose sur :",
    options: [
      "La nature des sédiments, les structures sédimentaires et les fossiles",
      "Uniquement la couleur des roches",
      "La composition minéralogique uniquement",
      "La profondeur actuelle uniquement"
    ],
    answer: "La nature des sédiments, les structures sédimentaires et les fossiles",
    explanation: "Approche pluridisciplinaire. Pourquoi l’analyse des faciès est-elle essentielle en stratigraphie ?"
  },
  {
    type: "qcm",
    question: "Un milieu glaciaire se caractérise par :",
    options: [
      "Des dépôts mal triés (tillites) et des stries glaciaires",
      "Des sables bien triés",
      "Des calcaires récifaux",
      "Des argiles laminées fines"
    ],
    answer: "Des dépôts mal triés (tillites) et des stries glaciaires",
    explanation: "Action mécanique puissante des glaciers. Pourquoi ces dépôts indiquent-ils un climat froid ?"
  },
  {
    type: "qcm",
    question: "Les milieux de sédimentation contrôlent :",
    options: [
      "La nature, la géométrie et la distribution des roches sédimentaires",
      "Uniquement le métamorphisme",
      "La tectonique des plaques",
      "La formation des roches magmatiques"
    ],
    answer: "La nature, la géométrie et la distribution des roches sédimentaires",
    explanation: "Chaque milieu laisse une signature particulière. Pourquoi cette connaissance est-elle indispensable en géologie pétrolière ?"
  },
  {
    type: "qcm",
    question: "Globalement, l’étude des milieux de sédimentation permet de :",
    options: [
      "Reconstituer les paléoenvironnements et prédire la distribution des ressources naturelles",
      "Étudier uniquement les roches magmatiques",
      "Comprendre les processus internes de la Terre",
      "Analyser les séismes"
    ],
    answer: "Reconstituer les paléoenvironnements et prédire la distribution des ressources naturelles",
    explanation: "Outil clé en géologie sédimentaire. Pourquoi cette leçon est-elle très appliquée ?"
  }
] },
        { nom: "TD milieux de sedimentation", quiz: [
  {
    type: "qcm",
    question: "Le principe d'actualisme consiste à expliquer :",
    options: [
      "Un phénomène ancien par des événements actuels.",
      "Un phénomène actuel par des événements anciens.",
      "Un phénomène actuel par des événements actuels."
    ],
    answer: "Un phénomène ancien par des événements actuels.",
    explanation: "Le principe d'actualisme, aussi appelé uniformitarisme, postule que les processus géologiques qui agissent aujourd’hui sont les mêmes que ceux qui ont agi dans le passé. Il permet d’interpréter les roches anciennes en observant les phénomènes actuels. C’est l’un des fondements de la géologie moderne depuis Hutton et Lyell. Pourquoi observer le présent est-il essentiel pour comprendre le passé ?"
  },
  {
    type: "qcm",
    question: "Un dépôt sédimentaire détritique ancien avec un granoclassement latéral (gravier – sable – argile) serait caractéristique de :",
    options: [
      "Un milieu fluviatile ou désertique.",
      "Un milieu fluviatile ou lacustre.",
      "Un milieu lacustre ou désertique."
    ],
    answer: "Un milieu fluviatile ou lacustre.",
    explanation: "Le granoclassement latéral reflète une diminution progressive de l’énergie du milieu de dépôt de l’amont vers l’aval. Cela est très typique des systèmes fluviatiles (cônes de déjection, plaines alluviales) ou des deltas lacustres. Comment ce granoclassement nous aide-t-il à reconstituer l’ancienne direction du courant ?"
  },
  {
    type: "qcm",
    question: "Les terrasses fluviatiles sont les restes de couches :",
    options: [
      "Géologiques anciennes érodées avant l’apparition du cours d’eau.",
      "Déposées puis érodées par le cours d’eau.",
      "Géologiques anciennes érodées par le cours d’eau sans dépôt préalable."
    ],
    answer: "Déposées puis érodées par le cours d’eau.",
    explanation: "Les terrasses fluviatiles sont les témoins d’anciens lits majeurs du fleuve. Elles se forment lors de phases d’aggradation (dépôt) suivies de phases d’incision (érosion verticale) dues à des changements de niveau de base, de climat ou de tectonique. Pourquoi les terrasses fluviatiles sont-elles de bons indicateurs des variations climatiques ou tectoniques ?"
  },
  {
    type: "qcm",
    question: "Dans le cas des terrasses fluviatiles étagées, la terrasse basse est :",
    options: [
      "La plus vieille.",
      "La plus jeune.",
      "Du même âge que les autres terrasses."
    ],
    answer: "La plus jeune.",
    explanation: "Dans un système de terrasses étagées, chaque nouvelle incision du fleuve abandonne une terrasse plus basse que la précédente. Ainsi, plus on descend vers la rivière actuelle, plus les terrasses sont récentes. Quelle est l’importance de cet étagement pour reconstituer l’histoire du paysage ?"
  },
  {
    type: "qcm",
    question: "Le calcaire est une roche sédimentaire :",
    options: [
      "Détritique.",
      "Chimique.",
      "Chimique ou biochimique."
    ],
    answer: "Chimique ou biochimique.",
    explanation: "Les calcaires peuvent se former par précipitation chimique directe ou, plus souvent, par accumulation de restes biologiques (coquilles, squelettes, récifs coralliens). Ils témoignent donc souvent d’une forte activité biologique ou de conditions physico-chimiques particulières. Pourquoi les calcaires sont-ils d’excellents enregistreurs des paléoenvironnements marins ?"
  },
  {
    type: "qcm",
    question: "Les évaporites sont des roches chimiques qui caractérisent principalement :",
    options: [
      "Les lagunes.",
      "Les lacs.",
      "Les deltas."
    ],
    answer: "Les lagunes.",
    explanation: "Les évaporites (gypse, anhydrite, halite) se forment par évaporation intense de l’eau dans des milieux confinés et chauds où l’apport d’eau est faible. Les lagunes côtières et les sabkhas sont les environnements les plus favorables. Que nous indique la présence d’évaporites sur le climat ancien ?"
  },
  {
    type: "qcm",
    question: "Le delta se forme à l’embouchure d’une rivière dont la charge :",
    options: [
      "Solide est importante.",
      "Soluble est importante.",
      "Solide est faible."
    ],
    answer: "Solide est importante.",
    explanation: "Un delta se construit lorsque la rivière apporte une grande quantité de sédiments détritiques qui se déposent plus rapidement que la mer ou le lac ne peut les évacuer. Quelle est la conséquence de ce dépôt sur la ligne de côte ?"
  },
  {
    type: "qcm",
    question: "Une lagune est un milieu sédimentaire :",
    options: [
      "Continental fermé.",
      "Marin ouvert.",
      "Intermédiaire partiellement fermé."
    ],
    answer: "Intermédiaire partiellement fermé.",
    explanation: "La lagune est un plan d’eau côtier peu profond, séparé de la mer ouverte par une barrière mais communiquant avec elle par des passes. Elle présente des conditions intermédiaires entre milieu continental et marin. Pourquoi les lagunes sont-elles des milieux très sensibles aux variations du niveau marin ?"
  },
  {
    type: "qcm",
    question: "Dans un cours d’eau, le granoclassement longitudinal des dépôts est dû à :",
    options: [
      "Un hydrodynamisme croissant de l’amont vers l’aval.",
      "Un hydrodynamisme décroissant de l’amont vers l’aval.",
      "Un hydrodynamisme constant."
    ],
    answer: "Un hydrodynamisme décroissant de l’amont vers l’aval.",
    explanation: "L’énergie cinétique de l’eau diminue progressivement de l’amont vers l’aval. Les grosses particules se déposent en premier en amont, tandis que les plus fines atteignent l’aval. Comment ce granoclassement aide-t-il à déterminer la direction paléocourant ?"
  },
  {
    type: "qcm",
    question: "Les moraines sont des dépôts :",
    options: [
      "Bien triés lacustres.",
      "Mal triés glaciaires.",
      "Bien triés fluviatiles."
    ],
    answer: "Mal triés glaciaires.",
    explanation: "Les glaciers transportent un mélange très hétérogène de blocs, graviers, sables et argiles sans tri hydraulique. Les moraines sont donc des dépôts très mal classés. Pourquoi les moraines sont-elles de bons marqueurs des anciennes extensions glaciaires ?"
  },
  {
    type: "qcm",
    question: "Le milieu éolien se reconnaît surtout par :",
    options: [
      "Des sables bien triés et des stratifications entrecroisées (dunes).",
      "Des dépôts mal triés et des stries glaciaires.",
      "Des laminations fines et turbidites."
    ],
    answer: "Des sables bien triés et des stratifications entrecroisées (dunes).",
    explanation: "Le vent est un agent de transport très sélectif. Il produit des sables bien triés et des structures sédimentaires typiques comme les stratifications obliques de dunes. Quelles sont les implications climatiques d’un dépôt éolien important ?"
  },
  {
    type: "qcm",
    question: "Un milieu récifal est typiquement :",
    options: [
      "Un environnement peu profond avec forte activité biologique (corail, algues).",
      "Un bassin marin profond.",
      "Un désert continental."
    ],
    answer: "Un environnement peu profond avec forte activité biologique (corail, algues).",
    explanation: "Les récifs se développent en zone photique (eaux claires et peu profondes) où la production carbonatée par les organismes est très élevée. Pourquoi les récifs sont-ils considérés comme d’excellents réservoirs d’hydrocarbures ?"
  },
  {
    type: "qcm",
    question: "Les turbidites sont des dépôts caractéristiques des :",
    options: [
      "Milieux marins profonds (courants de turbidité).",
      "Milieux fluviatiles.",
      "Milieux éoliens."
    ],
    answer: "Milieux marins profonds (courants de turbidité).",
    explanation: "Les courants de turbidité sont des coulées denses qui descendent les talus continentaux et déposent des séquences granoclassées en milieu profond. Quel est le rôle des turbidites dans la construction des éventails sous-marins ?"
  },
  {
    type: "qcm",
    question: "Le diagramme de Hjulström permet d’étudier :",
    options: [
      "La relation entre vitesse de l’eau et taille des particules (érosion, transport, sédimentation).",
      "La profondeur des bassins sédimentaires.",
      "La composition chimique des roches."
    ],
    answer: "La relation entre vitesse de l’eau et taille des particules (érosion, transport, sédimentation).",
    explanation: "Ce diagramme montre pour chaque taille de particule les vitesses nécessaires à l’érosion, au transport et au dépôt. Il est très utile pour interpréter les paléoenvironnements. Comment ce diagramme relie-t-il énergie du milieu et taille des grains ?"
  },
  {
    type: "qcm",
    question: "Un milieu continental typique est :",
    options: [
      "Le milieu fluvial, lacustre ou glaciaire.",
      "Le milieu marin profond.",
      "Le milieu lagunaire exclusivement."
    ],
    answer: "Le milieu fluvial, lacustre ou glaciaire.",
    explanation: "Ces milieux se situent sur les continents, loin de l’influence marine directe. Quelles sont les principales différences entre sédiments continentaux et marins ?"
  },
  {
    type: "qcm",
    question: "Les milieux de sédimentation contrôlent principalement :",
    options: [
      "La nature, la géométrie et la distribution des roches sédimentaires.",
      "La tectonique des plaques.",
      "Les processus magmatiques."
    ],
    answer: "La nature, la géométrie et la distribution des roches sédimentaires.",
    explanation: "Chaque milieu possède ses propres conditions hydrodynamiques, chimiques et biologiques qui déterminent le type de sédiment qui s’y accumule. Pourquoi cette connaissance est-elle fondamentale en prospection pétrolière ?"
  },
  {
    type: "qcm",
    question: "Les sédiments glaciaires sont généralement :",
    options: [
      "Mal triés et hétérogènes.",
      "Bien triés et fins.",
      "Uniquement chimiques."
    ],
    answer: "Mal triés et hétérogènes.",
    explanation: "Le transport glaciaire est mécanique et non sélectif, ce qui donne des dépôts très polymictes et mal classés. Comment distinguer un dépôt glaciaire d’un dépôt fluviatile ?"
  },
  {
    type: "qcm",
    question: "Un milieu de sédimentation est défini comme :",
    options: [
      "Un bassin où règnent des conditions physiques, chimiques et biologiques relativement constantes.",
      "Uniquement une zone de forte érosion.",
      "Uniquement un lieu de transport."
    ],
    answer: "Un bassin où règnent des conditions physiques, chimiques et biologiques relativement constantes.",
    explanation: "Cette constance des conditions permet la formation de faciès sédimentaires caractéristiques et répétitifs. Pourquoi cette définition est-elle centrale en analyse de faciès ?"
  },
  {
    type: "qcm",
    question: "Les dépôts de plaine d’inondation sont typiques :",
    options: [
      "Des milieux fluviatiles.",
      "Des milieux éoliens.",
      "Des milieux abyssaux."
    ],
    answer: "Des milieux fluviatiles.",
    explanation: "Lors des crues, les rivières débordent et déposent des sédiments fins (vases, limons) sur les plaines d’inondation. Quel type de roche domine généralement dans ces dépôts ?"
  },
  {
    type: "qcm",
    question: "Globalement, l’étude des milieux de sédimentation permet de :",
    options: [
      "Reconstituer les paléoenvironnements et prédire la répartition des ressources.",
      "Étudier uniquement les roches magmatiques.",
      "Analyser les mouvements des plaques tectoniques."
    ],
    answer: "Reconstituer les paléoenvironnements et prédire la répartition des ressources.",
    explanation: "Elle est indispensable en géologie appliquée, notamment pour l’exploration pétrolière, minière et la gestion des ressources en eau. Pourquoi les milieux de sédimentation sont-ils considérés comme la mémoire du paysage ancien ?"
  }
]

 },
        { nom: "Examen 2021", quiz: [] }
      ]
    },
    {
      nom: "Biologie vegetale",
      pdfCours: null,
      sousMatieres: [
        { nom: "Generalites sur les biomolecules", quiz: [
  {
    type: "qcm",
    question: "Un atome est constitué de :",
    options: [
      "Un noyau central (protons et neutrons) autour duquel gravitent des électrons.",
      "Un ensemble d'électrons uniquement, sans noyau central.",
      "Deux atomes liés entre eux par une liaison covalente."
    ],
    answer: "Un noyau central (protons et neutrons) autour duquel gravitent des électrons.",
    explanation: "L'ATOME est la plus petite particule constituée d'un NOYAU CENTRAL composé de PROTONS et de NEUTRONS, autour duquel GRAVITENT des ÉLECTRONS. C'est la brique de base de toute matière. La troisième option décrit en réalité une MOLÉCULE (un corps constitué par des atomes reliés entre eux), pas un atome."
  },
  {
    type: "qcm",
    question: "Parmi les six atomes cités comme fondamentaux du vivant (C, H, O, N, P, S), lesquels constituent les QUATRE atomes les plus fondamentaux qui constituent le vivant ?",
    options: [
      "Carbone, Hydrogène, Oxygène, Azote.",
      "Carbone, Phosphore, Soufre, Azote.",
      "Hydrogène, Oxygène, Phosphore, Soufre."
    ],
    answer: "Carbone, Hydrogène, Oxygène, Azote.",
    explanation: "Le cours identifie six atomes présents dans les molécules organiques (C, H, O, N, P, S), mais insiste sur QUATRE ATOMES FONDAMENTAUX qui constituent le vivant : CARBONE (C), HYDROGÈNE (H), OXYGÈNE (O) et AZOTE (N). Le Phosphore (P) et le Soufre (S) sont présents 'quelquefois' en plus, mais ne font pas partie du noyau fondamental des quatre."
  },
  {
    type: "qcm",
    question: "Une liaison covalente est :",
    options: [
      "Une liaison chimique entre deux atomes qui échangent définitivement un électron.",
      "Une liaison chimique entre deux atomes qui mettent en commun une ou plusieurs paires d'électrons.",
      "Une interaction électrostatique entre un ion positif et un ion négatif."
    ],
    answer: "Une liaison chimique entre deux atomes qui mettent en commun une ou plusieurs paires d'électrons.",
    explanation: "Une LIAISON COVALENTE est une liaison chimique entre deux atomes qui METTENT EN COMMUN (partagent) une ou plusieurs paires d'électrons — ce n'est pas un échange définitif (ce serait plutôt le principe d'une liaison ionique). C'est ce type de liaison qui relie les atomes entre eux au sein d'une molécule organique, comme les 24 atomes du glucose."
  },
  {
    type: "qcm",
    question: "Le glucose, cité en exemple dans le cours, est une molécule constituée de :",
    options: [
      "6 atomes de carbone uniquement.",
      "24 atomes reliés entre eux par des liaisons covalentes.",
      "10 atomes reliés par des liaisons hydrogène."
    ],
    answer: "24 atomes reliés entre eux par des liaisons covalentes.",
    explanation: "Le cours utilise le GLUCOSE comme exemple concret de molécule organique : c'est un corps constitué d'un ensemble de 24 ATOMES reliés entre eux par des LIAISONS COVALENTES. Attention au piège : le glucose contient 6 atomes de CARBONE (formule C6H12O6), mais le nombre total d'atomes (C + H + O) est bien de 24."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qui distingue une molécule organique d'une molécule inorganique, selon le cours ?",
    options: [
      "La molécule organique contient à la fois du carbone ET de l'hydrogène ; l'inorganique non.",
      "La molécule organique ne contient jamais d'oxygène ; l'inorganique en contient toujours.",
      "La molécule inorganique est toujours une source d'énergie, contrairement à l'organique."
    ],
    answer: "La molécule organique contient à la fois du carbone ET de l'hydrogène ; l'inorganique non.",
    explanation: "Les MOLÉCULES ORGANIQUES sont constituées À LA FOIS d'atomes de CARBONE et d'HYDROGÈNE, et ont une valeur énergétique. Les MOLÉCULES INORGANIQUES (minérales) ne contiennent PAS à la fois du carbone et de l'hydrogène, et NE SONT PAS une source d'énergie (ex. H2O). C'est l'inverse de ce que propose la 3ème option : c'est l'organique qui a une valeur énergétique, pas l'inorganique."
  },
  {
    type: "qcm",
    question: "Quelle proportion de la masse cellulaire est représentée par l'eau ?",
    options: [
      "Au moins 30%.",
      "Au moins 50%.",
      "Au moins 70%."
    ],
    answer: "Au moins 70%.",
    explanation: "L'eau représente AU MOINS 70% DE LA MASSE CELLULAIRE, ce qui en fait le constituant le plus abondant de la cellule, largement devant les molécules organiques (80-90% de la masse SÈCHE seulement, c'est-à-dire une fois l'eau retirée)."
  },
  {
    type: "qcm",
    question: "Pourquoi l'eau peut-elle former des liaisons hydrogène et jouer un rôle de solvant ?",
    options: [
      "Parce qu'elle est une molécule apolaire, donc elle repousse les autres molécules polaires.",
      "Parce qu'elle est polaire : les atomes d'H portent une faible charge positive et l'atome d'O une faible charge négative.",
      "Parce qu'elle contient un atome de carbone qui attire les charges positives."
    ],
    answer: "Parce qu'elle est polaire : les atomes d'H portent une faible charge positive et l'atome d'O une faible charge négative.",
    explanation: "La POLARITÉ de l'eau vient du fait que les atomes d'Hydrogène portent une FAIBLE CHARGE POSITIVE et l'atome d'Oxygène une FAIBLE CHARGE NÉGATIVE. Cette asymétrie permet à l'eau de former des PONTS D'HYDROGÈNE avec ses voisines et d'autres molécules polaires, et d'interagir avec les ions chargés (+) ou (-). L'eau ne contient pas de carbone : ce n'est pas une molécule organique."
  },
  {
    type: "qcm",
    question: "En dehors de son rôle de solvant, quel autre rôle chimique direct joue l'eau selon le cours ?",
    options: [
      "Un rôle de catalyseur qui accélère toutes les réactions sans y participer.",
      "Un rôle de réactif dans les réactions d'hydrolyse, et elle est libérée lors des réactions de synthèse.",
      "Un rôle structural en formant des liaisons covalentes avec les protéines."
    ],
    answer: "Un rôle de réactif dans les réactions d'hydrolyse, et elle est libérée lors des réactions de synthèse.",
    explanation: "L'eau joue aussi un rôle de RÉACTIF dans les réactions d'HYDROLYSE (elle est consommée pour casser une liaison), et à l'inverse, sa LIBÉRATION au cours des réactions de SYNTHÈSE permet l'établissement de liaisons covalentes (ex. condensation de deux nucléotides). Ce n'est pas un simple catalyseur : elle participe chimiquement à la réaction, elle n'est pas juste un accélérateur passif."
  },
  {
    type: "qcm",
    question: "Les ions inorganiques (Na+, K+, Mg2+, Ca2+, ...) représentent quelle proportion de la masse cellulaire, et quel est leur rôle ?",
    options: [
      "1% de la masse cellulaire ; ils interviennent dans plusieurs réactions du métabolisme.",
      "50% de la masse cellulaire ; ils forment la structure de la paroi cellulaire.",
      "1% de la masse cellulaire ; ils constituent la principale source d'énergie de la cellule."
    ],
    answer: "1% de la masse cellulaire ; ils interviennent dans plusieurs réactions du métabolisme.",
    explanation: "Les IONS INORGANIQUES représentent environ 1% DE LA MASSE CELLULAIRE et interviennent dans plusieurs RÉACTIONS DU MÉTABOLISME. Ils ne sont pas une source d'énergie (rappel : les molécules inorganiques n'en ont pas), et ils ne forment pas de structure comme la cellulose (qui est un glucide, une molécule organique)."
  },
  {
    type: "qcm",
    question: "Quelle proportion de la masse SÈCHE d'une cellule est représentée par les composés organiques ?",
    options: [
      "10 à 20%.",
      "80 à 90%.",
      "Environ 1%."
    ],
    answer: "80 à 90%.",
    explanation: "Les composés organiques représentent 80 À 90% DE LA MASSE SÈCHE de la plupart des cellules (c'est-à-dire une fois l'eau retirée). Attention à ne pas confondre avec le chiffre de l'eau (≥70% de la masse cellulaire TOTALE, humide) : ce sont deux mesures différentes — l'une sur la masse totale, l'autre sur la masse sèche."
  },
  {
    type: "qcm",
    question: "Quelles sont les 4 grandes classes de biomolécules organiques annoncées par le cours ?",
    options: [
      "Glucides, Protides, Lipides, Acides nucléiques.",
      "Glucides, Vitamines, Minéraux, Protides.",
      "Eau, Glucides, Lipides, Sels minéraux."
    ],
    answer: "Glucides, Protides, Lipides, Acides nucléiques.",
    explanation: "Le cours annonce 4 GRANDES CLASSES de biomolécules organiques : les GLUCIDES, les PROTIDES, les LIPIDES et les ACIDES NUCLÉIQUES (ADN et ARN). Ce sont exactement les 4 séquences qui seront étudiées dans la suite du chapitre 1. L'eau et les sels minéraux ne font pas partie de ces classes puisqu'ils sont inorganiques."
  },
  {
    type: "qcm",
    question: "Chez les végétaux chlorophylliens (autotrophes), les glucides sont principalement convertis en :",
    options: [
      "Amidon, pour le stockage (réserve).",
      "Cellulose, comme unique source d'énergie.",
      "Glycogène, comme chez les animaux."
    ],
    answer: "Amidon, pour le stockage (réserve).",
    explanation: "Chez les VÉGÉTAUX CHLOROPHYLLIENS (autotrophes), les glucides (sucres) sont convertis essentiellement en AMIDON pour le stockage (réserve). C'est un point de vigilance classique en QCM : le GLYCOGÈNE est la forme de réserve glucidique chez les ANIMAUX (hétérotrophes), pas chez les plantes."
  },
  {
    type: "qcm",
    question: "Quelle est la différence d'usage des glucides entre organismes autotrophes et hétérotrophes ?",
    options: [
      "Les autotrophes stockent les glucides en amidon (réserve) ; les hétérotrophes les utilisent comme source d'énergie dans le métabolisme.",
      "Les hétérotrophes fabriquent les glucides par photosynthèse ; les autotrophes les consomment uniquement.",
      "Il n'y a aucune différence : les deux groupes utilisent les glucides exactement de la même façon."
    ],
    answer: "Les autotrophes stockent les glucides en amidon (réserve) ; les hétérotrophes les utilisent comme source d'énergie dans le métabolisme.",
    explanation: "Chez les AUTOTROPHES (végétaux chlorophylliens), les glucides sont convertis en AMIDON pour la réserve. Chez les HÉTÉROTROPHES (animaux), les glucides sont utilisés directement comme SOURCE D'ÉNERGIE dans les réactions du métabolisme. C'est la PHOTOSYNTHÈSE qui permet aux autotrophes de fabriquer leurs propres glucides — les hétérotrophes ne la réalisent pas."
  },
  {
    type: "qcm",
    question: "La cellulose, citée comme exemple de rôle structural des glucides, est principalement le composant majeur de :",
    options: [
      "La membrane plasmique des cellules animales.",
      "La paroi des cellules végétales.",
      "Le noyau des cellules végétales."
    ],
    answer: "La paroi des cellules végétales.",
    explanation: "La CELLULOSE est la principale molécule STRUCTURALE de la PAROI des végétaux. Le cours souligne aussi son importance industrielle (le bois est en partie constitué de cellulose, tout comme le coton et le papier qui sont de la cellulose quasi pure). Ce n'est pas un composant de la membrane plasmique (faite de lipides et protéines) ni du noyau."
  },
  {
    type: "qcm",
    question: "Parmi les rôles fondamentaux des glucides cités dans le cours, lequel concerne la 'reconnaissance et communication entre cellules' ?",
    options: [
      "Le stockage énergétique sous forme d'amidon.",
      "L'adressage des protéines, les polyholosides antigéniques et les groupes sanguins A et B.",
      "La formation de la double hélice de l'ADN."
    ],
    answer: "L'adressage des protéines, les polyholosides antigéniques et les groupes sanguins A et B.",
    explanation: "Le rôle de RECONNAISSANCE ET COMMUNICATION entre cellules est illustré par : l'adressage des protéines pour leur transport intracellulaire, les polyholosides antigéniques des bactéries, et les groupes sanguins A et B. Le stockage énergétique (amidon) est un rôle DIFFÉRENT (réserve), et la double hélice d'ADN relève des acides nucléiques, pas des glucides."
  }
] },
        { nom: "La classe des glucides", quiz: [
  {
    type: "qcm",
    question: "Quelle est la principale source des glucides sur Terre ?",
    options: [
      "La respiration cellulaire.",
      "La photosynthèse.",
      "L'hydrolyse des lipides."
    ],
    answer: "La photosynthèse.",
    explanation: "Les GLUCIDES sont les molécules les plus abondantes sur Terre, et la plus grande partie provient de la PHOTOSYNTHÈSE (6CO2 + 6H2O → C6H12O6 + 6O2). La respiration cellulaire est au contraire la réaction INVERSE, qui consomme les glucides pour produire de l'énergie, elle n'en est pas la source."
  },
  {
    type: "qcm",
    question: "Comment distingue-t-on les oses des osides dans la classification des glucides ?",
    options: [
      "Les oses sont des polymères hydrolysables ; les osides sont des monomères non hydrolysables.",
      "Les oses sont des sucres simples non hydrolysables ; les osides sont des polymères hydrolysables d'oses.",
      "Les oses contiennent du phosphore ; les osides n'en contiennent jamais."
    ],
    answer: "Les oses sont des sucres simples non hydrolysables ; les osides sont des polymères hydrolysables d'oses.",
    explanation: "Les OSES (monosaccharides) sont les sucres simples, NON HYDROLYSABLES, comme le glucose ou le fructose. Les OSIDES sont des polymères d'oses (Oses)n, donc HYDROLYSABLES par definition, puisqu'ils peuvent être décomposés en leurs oses constitutifs par hydrolyse. La première option inverse exactement les deux définitions."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre un oligoholoside et un polyholoside ?",
    options: [
      "L'oligoholoside a n < 10 oses ; le polyholoside a n ≥ 10 oses.",
      "L'oligoholoside contient un aglycone ; le polyholoside n'en contient jamais.",
      "L'oligoholoside est toujours réducteur ; le polyholoside ne l'est jamais."
    ],
    answer: "L'oligoholoside a n < 10 oses ; le polyholoside a n ≥ 10 oses.",
    explanation: "Au sein des HOLOSIDES (Oses)n, on distingue selon la valeur de n : OLIGOHOLOSIDES (oligosaccharides) si n < 10 (ex. saccharose = glucose + fructose), et POLYHOLOSIDES (polysaccharides) si n ≥ 10 (ex. amidon, inuline, cellulose). La présence d'un aglycone caractérise les HÉTÉROSIDES, pas les holosides — les holosides ne contiennent QUE des oses."
  },
  {
    type: "qcm",
    question: "Quelle est la formule générale d'un ose ?",
    options: [
      "(CH2O)n avec n ≥ 3.",
      "(C6H12O6)n avec n ≥ 1.",
      "(CHO)n avec n ≥ 5."
    ],
    answer: "(CH2O)n avec n ≥ 3.",
    explanation: "La formule générale des oses est (CH2O)n avec n ≥ 3. Le glucose (C6H12O6) est un cas particulier avec n=6, mais ce n'est pas la formule générale de tous les oses — un triose comme le glycéraldéhyde a n=3, soit C3H6O3."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qui différencie un aldose d'un cétose ?",
    options: [
      "L'aldose porte une fonction aldéhyde ; le cétose porte une fonction cétone.",
      "L'aldose est toujours cyclique ; le cétose est toujours linéaire.",
      "L'aldose contient du carbone anomérique ; le cétose n'en contient pas."
    ],
    answer: "L'aldose porte une fonction aldéhyde ; le cétose porte une fonction cétone.",
    explanation: "Un ALDOSE porte une fonction ALDÉHYDE (toujours sur le carbone C1), un CÉTOSE porte une fonction CÉTONE (toujours sur le carbone C2). Les deux peuvent exister sous forme linéaire OU cyclique selon les conditions, et les deux peuvent posséder un carbone anomérique une fois cyclisés."
  },
  {
    type: "qcm",
    question: "Sur quel carbone se trouve la fonction cétone d'un cétose, comme la dihydroxyacétone ?",
    options: [
      "Toujours sur le C1.",
      "Toujours sur le C2.",
      "Toujours sur le dernier carbone de la chaîne."
    ],
    answer: "Toujours sur le C2.",
    explanation: "Règle de numérotation du cours : pour les CÉTOSES, le carbone qui porte la fonction cétone est TOUJOURS le C2. À l'inverse, pour les ALDOSES, la fonction aldéhyde est toujours portée par le C1. C'est cette règle qui fixe le sens de lecture de la molécule."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qu'un carbone asymétrique (C*) ?",
    options: [
      "Un carbone relié à 4 groupements identiques.",
      "Un carbone relié à 4 groupements différents.",
      "Un carbone qui porte uniquement la fonction aldéhyde."
    ],
    answer: "Un carbone relié à 4 groupements différents.",
    explanation: "Un CARBONE ASYMÉTRIQUE (C*) est un carbone relié à 4 GROUPEMENTS DIFFÉRENTS. C'est ce type de carbone qui rend possible l'existence de deux configurations spatiales distinctes (comme D-glycéraldéhyde et L-glycéraldéhyde), appelées énantiomères."
  },
  {
    type: "qcm",
    question: "Comment détermine-t-on si un ose appartient à la série D ou à la série L ?",
    options: [
      "Selon le nombre total d'atomes de carbone de la molécule.",
      "Selon la position (droite ou gauche) du OH porté par le carbone asymétrique le plus éloigné de la fonction carbonyle.",
      "Selon que l'ose est un aldose ou un cétose."
    ],
    answer: "Selon la position (droite ou gauche) du OH porté par le carbone asymétrique le plus éloigné de la fonction carbonyle.",
    explanation: "La série D ou L est déterminée par la position du OH porté par le carbone asymétrique LE PLUS ÉLOIGNÉ de la fonction carbonyle (Fischer) : OH à DROITE → série D, OH à GAUCHE → série L. Chez les végétaux, la série D est de loin la plus fréquente. Le fait d'être aldose ou cétose n'a rien à voir avec cette classification D/L."
  },
  {
    type: "qcm",
    question: "Le D-glucose et le D-fructose, qui partagent la même formule C6H12O6, sont des :",
    options: [
      "Énantiomères, car ils diffèrent par la configuration D/L.",
      "Isomères de fonction, car ils diffèrent par la nature de leur fonction réductrice (aldéhyde vs cétone).",
      "Anomères, car ils diffèrent par la configuration du carbone anomérique."
    ],
    answer: "Isomères de fonction, car ils diffèrent par la nature de leur fonction réductrice (aldéhyde vs cétone).",
    explanation: "Le D-glucose (aldose) et le D-fructose (cétose) ont la même formule brute C6H12O6 mais diffèrent uniquement par la nature de leur fonction réductrice (aldéhyde vs cétone) : ce sont des ISOMÈRES DE FONCTION. Les ÉNANTIOMÈRES (comme D- et L-glycéraldéhyde) sont des images miroir de la MÊME fonction. Les ANOMÈRES (alpha/beta) concernent la configuration du carbone anomérique après cyclisation d'UNE MÊME molécule."
  },
  {
    type: "qcm",
    question: "À partir de combien d'atomes de carbone un ose adopte-t-il une forme cyclique en solution aqueuse ?",
    options: [
      "À partir de 3 atomes de carbone.",
      "À partir de 5 atomes de carbone.",
      "Uniquement à partir de 7 atomes de carbone."
    ],
    answer: "À partir de 5 atomes de carbone.",
    explanation: "À PARTIR DE 5 ATOMES DE CARBONE, les oses en solution aqueuse adoptent une forme CYCLIQUE (représentation de Haworth) : le groupement carbonyle réagit avec un OH de la même molécule. En dessous de 5 carbones (trioses, tétroses), les oses restent sous forme linéaire."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre un cycle pyranique et un cycle furanique ?",
    options: [
      "Le cycle pyranique a 6 côtés (ex. glucose) ; le cycle furanique a 5 côtés (ex. fructose).",
      "Le cycle pyranique concerne uniquement les cétoses ; le furanique uniquement les aldoses.",
      "Le cycle pyranique n'a pas de carbone anomérique, contrairement au furanique."
    ],
    answer: "Le cycle pyranique a 6 côtés (ex. glucose) ; le cycle furanique a 5 côtés (ex. fructose).",
    explanation: "Le CYCLE PYRANIQUE a 6 côtés (ex. le glucose forme un cycle pyranique), le CYCLE FURANIQUE a 5 côtés (ex. le fructose forme un cycle furanique). Les deux types de cycles possèdent un carbone anomérique, et le type de cycle n'est pas strictement lié au fait d'être aldose ou cétose."
  },
  {
    type: "qcm",
    question: "Le carbone anomérique du glucose (cycle pyranique) est le :",
    options: [
      "C1, car c'est le carbone qui portait la fonction aldéhyde et qui réagit avec l'oxygène du C5.",
      "C2, comme pour tous les oses cycliques.",
      "C6, car c'est le dernier carbone de la chaîne."
    ],
    answer: "C1, car c'est le carbone qui portait la fonction aldéhyde et qui réagit avec l'oxygène du C5.",
    explanation: "Pour le glucose (un aldose), le C1 (qui portait la fonction aldéhyde) réagit avec l'oxygène porté par le C5 pour former le cycle : le C1 devient donc le CARBONE ANOMÉRIQUE. Attention, ce n'est pas systématiquement le C2 : pour le fructose (un cétose), c'est le C2 qui devient le carbone anomérique, car c'est lui qui portait la fonction cétone."
  },
  {
    type: "qcm",
    question: "Pour un ose de série D, comment reconnaît-on la forme alpha (α) de la forme béta (β) ?",
    options: [
      "OH du carbone anomérique en bas du cycle → forme alpha ; OH en haut → forme béta.",
      "OH du carbone anomérique en haut du cycle → forme alpha ; OH en bas → forme béta.",
      "La distinction alpha/béta ne s'applique qu'aux oses de série L."
    ],
    answer: "OH du carbone anomérique en bas du cycle → forme alpha ; OH en haut → forme béta.",
    explanation: "Pour les molécules de série D : si le OH du carbone anomérique (C1) est représenté EN BAS du cycle de Haworth → forme ALPHA (α) ; s'il est EN HAUT → forme BÉTA (β). Cette distinction alpha/béta est justement typique des oses de série D (les plus fréquents chez les végétaux) et sert de base pour définir les liaisons osidiques (ex. amidon en α1-4 vs cellulose en β1-4)."
  },
  {
    type: "qcm",
    question: "Comment se forme une liaison osidique (glycosidique) entre deux oses ?",
    options: [
      "Par une réaction de condensation avec perte d'une molécule d'H2O, impliquant au moins un carbone anomérique.",
      "Par une réaction d'hydrolyse avec consommation d'une molécule d'H2O.",
      "Par un échange direct d'électrons entre les deux noyaux des oses."
    ],
    answer: "Par une réaction de condensation avec perte d'une molécule d'H2O, impliquant au moins un carbone anomérique.",
    explanation: "La LIAISON OSIDIQUE se forme par une réaction de CONDENSATION (déshydratation) : les deux oses perdent une molécule d'H2O en se liant. Au moins UN des deux carbones impliqués doit être le CARBONE ANOMÉRIQUE. La réaction INVERSE (hydrolyse, qui elle consomme de l'eau) permet au contraire de SÉPARER les deux oses — c'est le principe qui relie ce chapitre au rôle de l'eau vu en Séquence 1."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qui définit un sucre réducteur après formation d'une liaison osidique ?",
    options: [
      "La présence d'au moins un OH de carbone anomérique resté libre après la liaison.",
      "L'absence totale de carbone anomérique dans la molécule.",
      "Le fait que la molécule contienne uniquement des liaisons de type béta."
    ],
    answer: "La présence d'au moins un OH de carbone anomérique resté libre après la liaison.",
    explanation: "Un sucre est dit RÉDUCTEUR (donneur d'électron) si, après la formation de la liaison osidique, il reste au moins un OH de carbone ANOMÉRIQUE LIBRE (non engagé dans la liaison). Si les deux carbones anomériques des deux oses sont engagés dans la liaison, aucun OH anomérique n'est libre → le sucre est NON RÉDUCTEUR."
  },
  {
    type: "qcm",
    question: "Chez la plupart des végétaux, sous quelle forme et avec quel type de liaison les glucides de réserve sont-ils stockés ?",
    options: [
      "Sous forme d'inuline, polymère de fructose en liaison béta 1-4.",
      "Sous forme d'amidon, polymère de glucose en liaison alpha 1-4 (avec ramifications alpha 1-6).",
      "Sous forme de cellulose, polymère de glucose en liaison béta 1-4."
    ],
    answer: "Sous forme d'amidon, polymère de glucose en liaison alpha 1-4 (avec ramifications alpha 1-6).",
    explanation: "Chez LA PLUPART des végétaux, les glucides de réserve sont stockés sous forme d'AMIDON, un polymère de glucose lié en ALPHA 1-4 (avec des ramifications en alpha 1-6). L'INULINE (polymère de fructose) est un cas PARTICULIER, propre à la famille des Composées (Astéracées). La CELLULOSE, elle, n'est pas une réserve mais un glucide de CONSTITUTION (paroi), avec des liaisons BÉTA 1-4."
  },
  {
    type: "qcm",
    question: "Quelle est la différence structurale essentielle entre l'amidon (réserve) et la cellulose (constitution), sachant que les deux sont des polymères de glucose ?",
    options: [
      "L'amidon est composé de fructose alors que la cellulose est composée de glucose.",
      "Le type de liaison osidique diffère : alpha 1-4 pour l'amidon, béta 1-4 pour la cellulose.",
      "L'amidon ne contient aucune liaison osidique, contrairement à la cellulose."
    ],
    answer: "Le type de liaison osidique diffère : alpha 1-4 pour l'amidon, béta 1-4 pour la cellulose.",
    explanation: "L'amidon et la cellulose sont tous les deux des polymères de GLUCOSE, mais leur rôle biologique totalement différent (réserve énergétique vs résistance structurale de la paroi) vient uniquement du TYPE DE LIAISON : ALPHA 1-4 pour l'amidon, BÉTA 1-4 pour la cellulose. C'est cette différence de liaison qui permet à la cellulose de former des microfibrilles très résistantes par liaisons hydrogène entre chaînes voisines."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qu'un hétéroside, et en quoi diffère-t-il d'un holoside ?",
    options: [
      "Un hétéroside est un polymère composé exclusivement d'oses, comme un holoside.",
      "Un hétéroside est composé d'oses liés à un aglycone, une molécule non glucidique (phénol, lipide, protide).",
      "Un hétéroside est un ose simple non hydrolysable, contrairement à l'holoside qui est un polymère."
    ],
    answer: "Un hétéroside est composé d'oses liés à un aglycone, une molécule non glucidique (phénol, lipide, protide).",
    explanation: "Un HÉTÉROSIDE est composé d'oses liés à un AGLYCONE, c'est-à-dire une molécule NON GLUCIDIQUE (phénol, lipide, protide). C'est ce qui le distingue de l'HOLOSIDE, qui lui est constitué EXCLUSIVEMENT d'oses. Exemples d'hétérosides : tanoïdes (oses + phénols), glycoprotéines (oses + protéines), glycolipides (oses + lipides), acides nucléiques (oses + base azotée + phosphate)."
  },
  {
    type: "qcm",
    question: "Quelle réaction permet de mettre en évidence les tanoïdes en présence de bichromate de potassium ?",
    options: [
      "Un précipité bleu, noir ou vert, utilisé dans l'industrie de l'encre.",
      "Un précipité brun-acajou, utilisé pour mettre en évidence les tanoïdes.",
      "Un composé insoluble et imputrescible, utilisé pour le tannage de la peau."
    ],
    answer: "Un précipité brun-acajou, utilisé pour mettre en évidence les tanoïdes.",
    explanation: "En présence de BICHROMATE DE POTASSIUM, les tanoïdes forment un précipité BRUN-ACAJOU, une réaction utilisée spécifiquement pour les METTRE EN ÉVIDENCE (test diagnostique). Ne pas confondre avec la réaction en présence de SELS DE FER (précipité bleu/noir/vert, utilisé pour fabriquer de l'encre) ou en présence de PROTÉINES (composé insoluble et imputrescible, utilisé pour le tannage du cuir)."
  }
] },
        { nom: "La classe des lipides", quiz: [
  {
    type: "qcm",
    question: "Qu'est-ce qui définit un lipide, contrairement aux glucides ou aux protides ?",
    options: [
      "Une propriété physique : la faible solubilité dans l'eau (hydrophobie), plutôt qu'une structure chimique unique.",
      "La présence systématique d'un carbone anomérique.",
      "La présence obligatoire d'azote et de phosphore dans toutes les molécules."
    ],
    answer: "Une propriété physique : la faible solubilité dans l'eau (hydrophobie), plutôt qu'une structure chimique unique.",
    explanation: "Contrairement aux glucides (définis par leur structure (CH2O)n) ou aux acides nucléiques, les LIPIDES sont définis par une PROPRIÉTÉ PHYSIQUE : ils sont peu solubles dans l'eau (HYDROPHOBES) mais se dissolvent dans les solvants organiques. Le carbone anomérique est une notion propre aux OSES, pas aux lipides. L'azote et le phosphore ne sont présents que dans les lipides COMPLEXES (hétérolipides), pas dans tous les lipides."
  },
  {
    type: "qcm",
    question: "Quel réactif colore les lipides en rouge orangé, comme test de mise en évidence ?",
    options: [
      "Le bichromate de potassium.",
      "Le rouge Soudan III.",
      "Les sels de fer."
    ],
    answer: "Le rouge Soudan III.",
    explanation: "Les lipides sont colorés en ROUGE ORANGÉ par le ROUGE SOUDAN III et apparaissent translucides sur du papier. Le bichromate de potassium et les sels de fer sont des réactifs utilisés pour mettre en évidence les TANOÏDES (un hétéroside glucidique vu en Séquence 2), pas les lipides — piège classique de confusion entre séquences."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre lipides simples (homolipides) et lipides complexes (hétérolipides) ?",
    options: [
      "Les homolipides contiennent C, O, H ; les hétérolipides contiennent en plus N, P (et éventuellement S).",
      "Les homolipides sont hydrophiles ; les hétérolipides sont hydrophobes.",
      "Les homolipides sont réservés aux membranes ; les hétérolipides sont réservés au stockage énergétique."
    ],
    answer: "Les homolipides contiennent C, O, H ; les hétérolipides contiennent en plus N, P (et éventuellement S).",
    explanation: "Les LIPIDES SIMPLES (homolipides) sont constitués uniquement de C, O et H. Les LIPIDES COMPLEXES (hétérolipides) contiennent en plus de l'AZOTE et du PHOSPHORE (et éventuellement du soufre). Tous les lipides, simples ou complexes, restent hydrophobes de par leur définition même — l'hydrophilie n'est pas un critère de distinction ici (c'est la tête polaire des lipides complexes qui est hydrophile, pas la molécule entière)."
  },
  {
    type: "qcm",
    question: "Parmi les trois fonctions principales des lipides citées dans le cours, laquelle correspond aux triglycérides ?",
    options: [
      "Messagers transmetteurs de signaux entre récepteurs.",
      "Substance de réserve énergétique stockée dans le cytoplasme.",
      "Partie intégrante de l'architecture des membranes biologiques."
    ],
    answer: "Substance de réserve énergétique stockée dans le cytoplasme.",
    explanation: "Les TRIGLYCÉRIDES constituent la RÉSERVE ÉNERGÉTIQUE stockée sous forme de gouttelettes lipidiques dans le CYTOPLASME. Le rôle de constitution des membranes est plutôt joué par les PHOSPHOLIPIDES et GLYCOLIPIDES (molécules amphipathiques), et le rôle de messager concerne certaines molécules lipidiques signalisatrices — les triglycérides eux-mêmes ne jouent ni l'un ni l'autre de ces deux rôles."
  },
  {
    type: "qcm",
    question: "Quelle est la formule générale d'un acide gras ?",
    options: [
      "R-COOH.",
      "(CH2O)n.",
      "R-NH2."
    ],
    answer: "R-COOH.",
    explanation: "Les acides gras sont des acides carboxyliques de formule R-COOH. La formule (CH2O)n est celle des OSES (glucides), et R-NH2 correspond à une fonction amine, typique des ACIDES AMINÉS (protides), pas des acides gras."
  },
  {
    type: "qcm",
    question: "Quelle est la particularité du nombre d'atomes de carbone des acides gras naturels ?",
    options: [
      "Il est toujours impair, entre 3 et 19.",
      "Il est toujours pair, entre 4 et 20.",
      "Il est toujours supérieur à 30, comme pour les stérides."
    ],
    answer: "Il est toujours pair, entre 4 et 20.",
    explanation: "Les acides gras ont un nombre PAIR d'atomes de carbone, compris ENTRE 4 ET 20. Attention à ne pas confondre avec les alcools à longue chaîne des cérides/stérides, qui eux comportent 30 à 40 atomes de C — un piège fréquent entre catégories de lipides."
  },
  {
    type: "qcm",
    question: "Pourquoi la chaîne carbonée d'un acide gras est-elle hydrophobe ?",
    options: [
      "Parce qu'elle ne comporte que des liaisons apolaires C-H, incapables de s'associer à l'eau.",
      "Parce qu'elle porte plusieurs groupements phosphate chargés négativement.",
      "Parce qu'elle est systématiquement cyclique comme le cholestérol."
    ],
    answer: "Parce qu'elle ne comporte que des liaisons apolaires C-H, incapables de s'associer à l'eau.",
    explanation: "La chaîne aliphatique de l'acide gras ne comporte que des liaisons C-H, qui sont APOLAIRES et donc incapables de s'associer à l'eau (elle-même une molécule polaire, vue en Séquence 1) → la chaîne est HYDROPHOBE. Les groupements phosphate chargés sont au contraire ce qui rend la TÊTE des phospholipides hydrophile, pas la chaîne carbonée elle-même."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qui distingue un acide gras saturé d'un acide gras insaturé ?",
    options: [
      "Le saturé possède au moins une liaison double C=C ; l'insaturé n'en possède aucune.",
      "L'insaturé possède au moins une liaison double C=C ; le saturé n'en possède aucune.",
      "Le saturé est toujours liquide à température ambiante ; l'insaturé est toujours solide."
    ],
    answer: "L'insaturé possède au moins une liaison double C=C ; le saturé n'en possède aucune.",
    explanation: "Un acide gras SATURÉ ne possède AUCUNE liaison multiple (que des liaisons simples C-C). Un acide gras INSATURÉ possède AU MOINS UNE liaison DOUBLE entre deux atomes de C. La troisième option inverse l'état physique réel : ce sont les glycérides INSATURÉS qui sont plutôt liquides (huiles), et les SATURÉS qui sont plutôt solides (graisses) — piège d'inversion classique."
  },
  {
    type: "qcm",
    question: "L'acide palmitique (16 atomes de C, sans liaison double) est un exemple typique de :",
    options: [
      "Acide gras insaturé.",
      "Acide gras saturé.",
      "Glycérolipide complexe."
    ],
    answer: "Acide gras saturé.",
    explanation: "L'ACIDE PALMITIQUE (16 C, aucune liaison multiple) est l'exemple donné par le cours pour un acide gras SATURÉ. Ce n'est ni un acide gras insaturé (qui aurait au moins une double liaison, comme l'acide oléique 18:1 ou l'acide linoléique 18:2), ni un glycérolipide (qui nécessiterait une liaison avec du glycérol)."
  },
  {
    type: "qcm",
    question: "Dans la notation '18:2 Δ9,12' utilisée pour l'acide linoléique, que représentent les chiffres 18 et 2 ?",
    options: [
      "18 = nombre de doubles liaisons, 2 = nombre d'atomes de carbone.",
      "18 = nombre d'atomes de carbone, 2 = nombre de doubles liaisons.",
      "18 = position de la première double liaison, 2 = nombre total de carbones."
    ],
    answer: "18 = nombre d'atomes de carbone, 2 = nombre de doubles liaisons.",
    explanation: "Dans la notation '18:2 Δ9,12', le premier nombre (18) correspond au NOMBRE D'ATOMES DE CARBONE de la chaîne, et le second (2) au NOMBRE DE DOUBLES LIAISONS. Les chiffres après le Δ (ici 9 et 12) indiquent la POSITION de ces doubles liaisons dans la chaîne — ils ne représentent ni un nombre de carbones ni un nombre de liaisons."
  },
  {
    type: "qcm",
    question: "Par quel type de liaison chimique un acide gras se lie-t-il le plus souvent au reste d'une molécule lipidique ?",
    options: [
      "Une liaison osidique, comme pour les glucides.",
      "Une liaison ester, formée par estérification entre un OH et un COOH.",
      "Une liaison peptidique, comme pour les protéines."
    ],
    answer: "Une liaison ester, formée par estérification entre un OH et un COOH.",
    explanation: "L'acide gras s'engage le plus souvent dans une LIAISON ESTER via une réaction d'ESTÉRIFICATION (condensation entre un H d'un groupement OH et un OH d'un groupement COOH, avec perte d'eau). La liaison osidique est propre aux GLUCIDES (entre oses), et la liaison peptidique est propre aux PROTIDES (entre acides aminés) — ces deux liaisons ne concernent pas les acides gras."
  },
  {
    type: "qcm",
    question: "Un triglycéride est formé quand :",
    options: [
      "Un seul des 3 OH du glycérol est estérifié par un acide gras.",
      "Les 3 OH du glycérol sont estérifiés par des acides gras.",
      "Le glycérol est phosphaté sur son 3ème OH."
    ],
    answer: "Les 3 OH du glycérol sont estérifiés par des acides gras.",
    explanation: "Le TRIGLYCÉRIDE correspond à l'estérification des 3 OH du glycérol par des acides gras. Si un seul OH est estérifié, on parle de MONOglycéride ; si deux, de DIglycéride. La phosphatation du 3ème OH du glycérol par l'acide phosphorique ne donne pas un triglycéride mais un PHOSPHOLIPIDE (acide phosphatidique)."
  },
  {
    type: "qcm",
    question: "Quelle proportion des lipides cellulaires les triglycérides représentent-ils ?",
    options: [
      "Environ 10 à 20%.",
      "Environ 80 à 90%.",
      "La quasi-totalité, soit plus de 99%."
    ],
    answer: "Environ 80 à 90%.",
    explanation: "Les TRIGLYCÉRIDES représentent 80 À 90% des lipides cellulaires — ce sont les principales formes de réserve lipidique. Ce chiffre est à rapprocher (sans les confondre) de celui des glucides vu en Séquence 1 : les composés organiques représentent 80 à 90% de la masse SÈCHE d'une cellule — deux statistiques différentes portant sur des objets différents."
  },
  {
    type: "qcm",
    question: "Pourquoi les glycérides saturés sont-ils généralement solides (graisses) alors que les insaturés sont plutôt liquides (huiles) ?",
    options: [
      "Le cours établit cette corrélation entre degré de saturation et état physique sans détailler le mécanisme moléculaire ici.",
      "Parce que les glycérides saturés contiennent du phosphore, contrairement aux insaturés.",
      "Parce que les glycérides insaturés sont exclusivement d'origine animale."
    ],
    answer: "Le cours établit cette corrélation entre degré de saturation et état physique sans détailler le mécanisme moléculaire ici.",
    explanation: "Le cours indique directement que les GLYCÉRIDES SATURÉS sont SOLIDES (graisses) et les GLYCÉRIDES INSATURÉS sont souvent LIQUIDES (huiles). La présence de phosphore ne concerne pas les glycérides simples mais les PHOSPHOLIPIDES (une catégorie différente). Rien dans le cours ne réserve les insaturés au règne animal — au contraire, les huiles végétales (riches en insaturés) sont un exemple courant."
  },
  {
    type: "qcm",
    question: "Un phospholipide (acide phosphatidique) résulte de la fixation de l'acide phosphorique sur :",
    options: [
      "Le 1er OH du glycérol.",
      "Le 2ème OH du glycérol.",
      "Le 3ème OH du glycérol."
    ],
    answer: "Le 3ème OH du glycérol.",
    explanation: "Le phospholipide (acide phosphatidique) se forme par phosphatation du 3ÈME OH du glycérol par l'acide phosphorique (H3PO4). Les deux autres OH du glycérol restent estérifiés par des acides gras (chaînes hydrophobes), donnant à la molécule sa structure amphipathique caractéristique."
  },
  {
    type: "qcm",
    question: "Dans la nomenclature des phospholipides (ex. Phosphatidyl-choline, Phosphatidyl-sérine), à quoi correspond le suffixe (choline, sérine, inositol...) ?",
    options: [
      "Au nom de l'acide gras attaché à la queue hydrophobe.",
      "Au nom du substituant R de la tête polaire de la molécule.",
      "Au type de liaison osidique reliant les deux chaînes aliphatiques."
    ],
    answer: "Au nom du substituant R de la tête polaire de la molécule.",
    explanation: "Le suffixe après 'Phosphatidyl-' correspond au nom du SUBSTITUANT R de la TÊTE de la molécule (choline, sérine, inositol, éthanolamine...). Ce n'est ni le nom de l'acide gras (qui reste dans la queue hydrophobe non nommée dans cette nomenclature), ni une liaison osidique — les phospholipides ne contiennent pas de liaison osidique, c'est un concept propre aux glucides."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qui différencie structurellement un glycolipide d'un phospholipide ?",
    options: [
      "Le glycolipide porte un groupement glucidique (ose) au niveau de la tête polaire, au lieu d'un phosphate.",
      "Le glycolipide n'a qu'une seule chaîne hydrocarbonée, contre deux pour le phospholipide.",
      "Le glycolipide est hydrophile dans sa totalité, contrairement au phospholipide."
    ],
    answer: "Le glycolipide porte un groupement glucidique (ose) au niveau de la tête polaire, au lieu d'un phosphate.",
    explanation: "Le GLYCOLIPIDE a la même architecture générale que le phospholipide (2 chaînes aliphatiques hydrophobes + tête polaire), sauf que sa TÊTE POLAIRE porte un GROUPEMENT GLUCIDIQUE (ose) au lieu d'un phosphate. Les deux possèdent bien DEUX chaînes hydrocarbonées, et aucun des deux n'est hydrophile 'dans sa totalité' — c'est justement leur caractère amphipathique (une partie hydrophile + une partie hydrophobe) qui les définit."
  },
  {
    type: "qcm",
    question: "Le caractère amphipathique (ou amphiphile) des phospholipides et glycolipides est directement responsable de :",
    options: [
      "La formation de la structure en bicouche des membranes biologiques.",
      "La formation de liaisons peptidiques entre acides aminés.",
      "L'apparition du carbone anomérique lors de la cyclisation des oses."
    ],
    answer: "La formation de la structure en bicouche des membranes biologiques.",
    explanation: "C'est un point central du cours, repris dans le chapitre sur les membranes : la propriété AMPHIPATHIQUE des phospholipides (partie hydrophile + partie hydrophobe) est la CAUSE DIRECTE de la structure en BICOUCHE des membranes biologiques, les têtes hydrophiles s'orientant vers l'eau et les queues hydrophobes se regroupant entre elles. Les liaisons peptidiques et le carbone anomérique n'ont aucun rapport avec les lipides."
  },
  {
    type: "qcm",
    question: "Le cholestérol (animaux) et l'ergostérol (végétaux), cités comme exemples de stérides, sont formés par :",
    options: [
      "L'union d'acides gras à longue chaîne et d'alcools à longue chaîne (30 à 40 C), avec des atomes de C organisés en 4 cycles.",
      "L'estérification des 3 OH du glycérol par des acides gras à courte chaîne.",
      "La phosphatation du glycérol suivie de la fixation d'un groupement ose."
    ],
    answer: "L'union d'acides gras à longue chaîne et d'alcools à longue chaîne (30 à 40 C), avec des atomes de C organisés en 4 cycles.",
    explanation: "Les STÉRIDES (comme le cholestérol et l'ergostérol, avec 27 atomes de C) sont des esters COMPLEXES formés par l'union d'acides gras à longue chaîne et d'ALCOOLS à longue chaîne (30 à 40 atomes de C, à comparer au glycérol qui n'en a que 3). Leurs atomes de C s'organisent en 4 CYCLES. Ce n'est ni un triglycéride classique (à courte chaîne d'alcool), ni un phospholipide (pas de phosphate ici)."
  },
  {
    type: "qcm",
    question: "Une unité isoprénique, brique de base des lipides isopréniques (terpènes, caroténoïdes...), comporte combien d'atomes de carbone ?",
    options: [
      "3 atomes de C, comme le glycérol.",
      "5 atomes de C.",
      "40 atomes de C, comme le carotène entier."
    ],
    answer: "5 atomes de C.",
    explanation: "L'unité ISOPRÉNIQUE comporte 5 ATOMES DE CARBONE. En s'associant plusieurs fois, ces unités forment des molécules plus grandes : par exemple le CAROTÈNE contient 8 restes isopréniques, soit 8 x 5 = 40 atomes de C au total. Le glycérol (3 C) et le carotène entier (40 C) sont donc des repères différents, à ne pas confondre avec l'unité isoprénique elle-même."
  }
] },
        { nom: "La classe des proteines", quiz: [
  {
    type: "qcm",
    question: "Quels atomes composent obligatoirement les protides, en plus des atomes parfois présents (P et S) ?",
    options: [
      "C, H, O et N.",
      "C, H et O uniquement, comme les glucides.",
      "C, H, O, N, P et S, toujours ensemble."
    ],
    answer: "C, H, O et N.",
    explanation: "Les protides contiennent obligatoirement des atomes de C, H, O ET N, plus PARFOIS des atomes de P et S (pas systématiquement). L'AZOTE (N) est justement ce qui distingue les protides des glucides (C, H, O uniquement). Dire que P et S sont 'toujours' présents est un piège : le cours précise bien 'quelquefois'."
    },
  {
    type: "qcm",
    question: "Dans la classification des protides, quelle est la différence entre un oligopeptide et un polypeptide ?",
    options: [
      "L'oligopeptide a n ≤ 10 acides aminés ; le polypeptide a n > 10.",
      "L'oligopeptide est non hydrolysable ; le polypeptide est hydrolysable.",
      "L'oligopeptide contient toujours une chaîne latérale hydrophobe ; le polypeptide non."
    ],
    answer: "L'oligopeptide a n ≤ 10 acides aminés ; le polypeptide a n > 10.",
    explanation: "Les OLIGOPEPTIDES sont des (acides aminés)n avec n ≤ 10, les POLYPEPTIDES (comme les protéines) sont des (acides aminés)n avec n > 10. Les deux sont des PEPTIDES, donc des polymères HYDROLYSABLES — c'est l'ACIDE AMINÉ seul (le monomère) qui est non hydrolysable, pas l'oligopeptide."
  },
  {
    type: "qcm",
    question: "Quels sont les 4 groupes portés par le carbone alpha (Cα) d'un acide aminé ?",
    options: [
      "Une fonction acide carboxylique, une fonction amine, un atome H, et une chaîne latérale R.",
      "Une fonction aldéhyde, une fonction cétone, un OH et un atome H.",
      "Deux fonctions carboxyliques et deux chaînes latérales R."
    ],
    answer: "Une fonction acide carboxylique, une fonction amine, un atome H, et une chaîne latérale R.",
    explanation: "Le carbone α porte toujours 4 groupes : une fonction ACIDE CARBOXYLIQUE (-COOH), une fonction AMINE primaire (-NH2, sauf la proline qui a une amine secondaire), un ATOME H, et une CHAÎNE LATÉRALE R qui confère à chaque acide aminé sa spécificité. Fonctions aldéhyde/cétone sont propres aux OSES (glucides), pas aux acides aminés."
  },
  {
    type: "qcm",
    question: "Quel acide aminé fait exception en portant une fonction amine SECONDAIRE plutôt que primaire ?",
    options: [
      "La glycine.",
      "La proline.",
      "L'alanine."
    ],
    answer: "La proline.",
    explanation: "La PROLINE est l'exception mentionnée dans le cours : contrairement aux autres acides aminés qui portent une fonction amine PRIMAIRE, elle porte une fonction amine SECONDAIRE. La glycine et l'alanine sont citées comme exemples d'acides aminés naturels de série L, mais ne font pas exception sur ce point précis."
  },
  {
    type: "qcm",
    question: "Comment distingue-t-on un acide alpha aminé d'un acide béta aminé ?",
    options: [
      "Dans l'acide alpha aminé, amine et acide carboxylique sont liés au même carbone ; dans le béta, ils sont liés à des carbones différents.",
      "L'acide alpha aminé n'a pas de chaîne latérale R, contrairement au béta.",
      "L'acide béta aminé est le seul type rencontré dans les protéines naturelles."
    ],
    answer: "Dans l'acide alpha aminé, amine et acide carboxylique sont liés au même carbone ; dans le béta, ils sont liés à des carbones différents.",
    explanation: "Dans un ACIDE ALPHA AMINÉ, le groupement amine (-NH2) et le groupement acide (-COOH) sont liés au MÊME carbone (α). Dans un ACIDE BÉTA AMINÉ, l'amine est liée au carbone β et l'acide au carbone α : ils ne sont donc PAS sur le même carbone. Ce sont les acides ALPHA aminés (pas béta) qui entrent dans la composition des protéines — piège d'inversion classique."
  },
  {
    type: "qcm",
    question: "Combien d'acides aminés naturels existe-t-il, et combien constituent réellement les protéines ?",
    options: [
      "Plus de 300 acides aminés existent, mais seulement 20 constituent les protéines naturelles.",
      "Exactement 20 acides aminés existent, tous présents dans les protéines.",
      "Plus de 300 acides aminés constituent systématiquement chaque protéine."
    ],
    answer: "Plus de 300 acides aminés existent, mais seulement 20 constituent les protéines naturelles.",
    explanation: "Il existe PLUS DE 300 acides aminés dans la nature, mais SEULEMENT 20 D'ENTRE EUX constituent les protéines naturelles. Ce n'est donc pas 'exactement 20 qui existent' (il y en a beaucoup plus au total), et une protéine donnée n'utilise pas nécessairement les 300 — elle pioche parmi les 20 acides aminés protéinogènes."
  },
  {
    type: "qcm",
    question: "Pourquoi dit-on qu'un acide aminé est une molécule 'amphotère' ?",
    options: [
      "Parce que ses fonctions -COOH et -NH2 sont ionisables, lui permettant de se comporter comme un acide ou une base.",
      "Parce qu'il possède à la fois une fonction aldéhyde et une fonction cétone.",
      "Parce qu'il est à la fois hydrophile et totalement insoluble dans l'eau."
    ],
    answer: "Parce que ses fonctions -COOH et -NH2 sont ionisables, lui permettant de se comporter comme un acide ou une base.",
    explanation: "Le caractère AMPHOTÈRE vient du fait que -COOH et -NH2 sont IONISABLES : selon le pH du milieu, l'acide aminé peut se comporter comme un ACIDE (en milieu basique, il perd un proton → -COO⁻) ou comme une BASE (en milieu acide, il gagne un proton → -NH3⁺). Les fonctions aldéhyde/cétone concernent les oses, pas les acides aminés — et 'hydrophile et insoluble' est contradictoire en soi."
  },
  {
    type: "qcm",
    question: "En milieu acide, que devient la fonction amine (-NH2) d'un acide aminé ?",
    options: [
      "Elle gagne un proton et devient -NH3+.",
      "Elle perd un proton et devient -NH-.",
      "Elle reste totalement inchangée quel que soit le pH."
    ],
    answer: "Elle gagne un proton et devient -NH3+.",
    explanation: "En MILIEU ACIDE, l'acide aminé GAGNE un proton : le groupement amine devient -NH3+ (chargé positivement). À l'inverse, en MILIEU BASIQUE, c'est le groupement carboxyle qui PERD un proton pour devenir -COO⁻. En milieu neutre, les deux formes ionisées coexistent (ion dipolaire, -NH3+ et -COO⁻)."
  },
  {
    type: "qcm",
    question: "Contrairement aux glucides naturels qui appartiennent à la série D, les acides aminés naturels appartiennent à quelle série ?",
    options: [
      "La série L.",
      "La série D également, comme les glucides.",
      "Ni D ni L, cette classification ne s'applique pas aux acides aminés."
    ],
    answer: "La série L.",
    explanation: "C'est un point de vigilance central du cours : les GLUCIDES naturels sont de série D, tandis que les ACIDES AMINÉS naturels sont de série L (ex. Gly, Ala, Val). C'est un contraste explicite entre ces deux grandes classes de biomolécules, et un piège d'examen très classique si on inverse D et L entre glucides et acides aminés."
  },
  {
    type: "qcm",
    question: "Selon le cours, comment évolue la solubilité dans l'eau d'un acide aminé en fonction du nombre d'atomes de carbone de son radical R ?",
    options: [
      "Elle augmente avec le nombre d'atomes de C du radical.",
      "Elle diminue avec le nombre d'atomes de C du radical.",
      "Elle reste constante, indépendamment du radical R."
    ],
    answer: "Elle diminue avec le nombre d'atomes de C du radical.",
    explanation: "Les acides aminés sont solubles dans l'eau, mais leur SOLUBILITÉ DIMINUE avec le nombre d'atomes de C constituant le radical R (plus la chaîne latérale est longue/carbonée, plus elle tend vers l'hydrophobie, réduisant la solubilité globale de la molécule)."
  },
  {
    type: "qcm",
    question: "Les protéines de réserve, citées dans les rôles des protides, sont stockées sous quelle forme et dans quel compartiment ?",
    options: [
      "Sous forme de grains d'aleurone, dans la vacuole.",
      "Sous forme de triglycérides, dans le cytoplasme.",
      "Sous forme d'amidon, dans les plastes."
    ],
    answer: "Sous forme de grains d'aleurone, dans la vacuole.",
    explanation: "Le rôle de RÉSERVE des protides se manifeste sous forme de GRAINS D'ALEURONE, situés dans la VACUOLE. Les triglycérides sont la réserve des LIPIDES (dans le cytoplasme, vu en Séquence 3), et l'amidon est la réserve des GLUCIDES (vu en Séquence 2) — trois mécanismes de réserve différents à ne pas confondre entre séquences."
  },
  {
    type: "qcm",
    question: "Quel rôle des protéines correspond aux anticorps qui distinguent le soi du non-soi ?",
    options: [
      "Rôle enzymatique.",
      "Rôle dans le système de défense immunologique.",
      "Rôle de transport."
    ],
    answer: "Rôle dans le système de défense immunologique.",
    explanation: "Les anticorps, décrits comme des protéines (glycoprotéines) capables de distinguer le soi du non-soi, relèvent du rôle de DÉFENSE IMMUNOLOGIQUE. Le rôle ENZYMATIQUE concerne la catalyse des réactions métaboliques, et le rôle de TRANSPORT concerne les protéines porteuses des membranes biologiques — des fonctions bien distinctes listées séparément dans le cours."
  },
  {
    type: "qcm",
    question: "Entre quels groupements chimiques se forme spécifiquement la liaison peptidique ?",
    options: [
      "Entre le groupement carboxyle alpha d'un acide aminé et le groupement aminé alpha d'un autre acide aminé.",
      "Entre deux groupements carboxyles alpha de deux acides aminés différents.",
      "Entre le carbone anomérique d'un ose et le groupement amine d'un acide aminé."
    ],
    answer: "Entre le groupement carboxyle alpha d'un acide aminé et le groupement aminé alpha d'un autre acide aminé.",
    explanation: "La LIAISON PEPTIDIQUE se forme toujours entre le groupement CARBOXYLE alpha (-COO-) d'un acide aminé et le groupement AMINÉ alpha (-NH3+) d'un AUTRE acide aminé — jamais entre deux groupements du même type. La liaison entre un ose et un acide aminé n'existe pas sous cette forme dans ce contexte (ce serait plutôt le principe d'une glycoprotéine, un hétéroside vu en Séquence 2, pas une liaison peptidique)."
  },
  {
    type: "qcm",
    question: "Comme pour les liaisons osidique et ester, la formation d'une liaison peptidique s'accompagne de :",
    options: [
      "La consommation d'une molécule d'H2O (hydrolyse).",
      "L'élimination d'une molécule d'H2O (condensation).",
      "L'ajout d'un groupement phosphate."
    ],
    answer: "L'élimination d'une molécule d'H2O (condensation).",
    explanation: "Comme la liaison osidique (glucides) et la liaison ester (lipides), la LIAISON PEPTIDIQUE résulte d'une réaction de CONDENSATION avec ÉLIMINATION d'une molécule d'H2O. C'est le principe unificateur qu'on retrouve dans les trois grandes classes de biomolécules polymérisables. La réaction inverse, l'hydrolyse, consomme de l'eau et sert à casser la liaison — pas à la former."
  },
  {
    type: "qcm",
    question: "Dans un polypeptide, quel résidu porte le groupement aminé libre à l'une des extrémités ?",
    options: [
      "Le résidu N-terminal.",
      "Le résidu C-terminal.",
      "Le résidu central, situé au milieu de la chaîne."
    ],
    answer: "Le résidu N-terminal.",
    explanation: "Le RÉSIDU N-TERMINAL porte le groupement AMINE libre à une extrémité de la chaîne polypeptidique. À l'autre extrémité, le RÉSIDU C-TERMINAL porte le groupement CARBOXYLE libre. Entre les deux se trouvent les résidus de la chaîne, engagés chacun dans deux liaisons peptidiques (sauf ces deux résidus terminaux)."
  },
  {
    type: "qcm",
    question: "La structure primaire d'une protéine correspond à :",
    options: [
      "La séquence linéaire des acides aminés unis par liaisons peptidiques, dictée par l'information génétique.",
      "Le repliement en hélice alpha ou feuillet béta de la chaîne.",
      "L'association de plusieurs chaînes polypeptidiques en une molécule fonctionnelle."
    ],
    answer: "La séquence linéaire des acides aminés unis par liaisons peptidiques, dictée par l'information génétique.",
    explanation: "La STRUCTURE PRIMAIRE est la séquence LINÉAIRE des acides aminés reliés par liaisons peptidiques, dictée par l'INFORMATION GÉNÉTIQUE. Les ponts disulfures (entre cystéines) sont aussi pris en compte à ce niveau. Le repliement en hélice/feuillet correspond à la structure SECONDAIRE, et l'association de plusieurs chaînes à la structure QUATERNAIRE."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre les liaisons de la structure primaire et celles de la structure secondaire d'une protéine ?",
    options: [
      "La primaire repose sur des liaisons covalentes fortes (peptidiques) ; la secondaire sur des liaisons faibles (ioniques, hydrophobes, hydrogène).",
      "La primaire repose sur des liaisons hydrogène ; la secondaire sur des liaisons peptidiques covalentes.",
      "Les deux structures reposent exactement sur le même type de liaisons."
    ],
    answer: "La primaire repose sur des liaisons covalentes fortes (peptidiques) ; la secondaire sur des liaisons faibles (ioniques, hydrophobes, hydrogène).",
    explanation: "La structure PRIMAIRE repose sur des liaisons COVALENTES FORTES (les liaisons peptidiques, + ponts disulfures). La structure SECONDAIRE, elle, résulte d'interactions plus FAIBLES : ioniques, hydrophobes (forces de Van der Waals) et hydrogène, dues à la diversité des chaînes latérales R. Ce sont deux niveaux d'organisation avec des liaisons de nature très différente, contrairement à ce que suggère la 3ème option."
  },
  {
    type: "qcm",
    question: "Dans l'hélice alpha, entre quels atomes se forment les liaisons hydrogène qui stabilisent la structure ?",
    options: [
      "Entre l'atome O à double liaison d'un acide aminé et l'atome H du groupement amine d'un autre acide aminé.",
      "Entre deux atomes de carbone anomérique appartenant à des chaînes voisines.",
      "Entre les groupements phosphate de deux résidus consécutifs."
    ],
    answer: "Entre l'atome O à double liaison d'un acide aminé et l'atome H du groupement amine d'un autre acide aminé.",
    explanation: "Dans l'HÉLICE ALPHA, les liaisons hydrogène se forment entre l'atome O à DOUBLE LIAISON d'un acide aminé et l'atome H du groupement AMINE d'un AUTRE acide aminé, le long de la même chaîne. Le carbone anomérique est un concept propre aux oses, et les groupements phosphate n'interviennent pas dans la structure secondaire des protéines."
  },
  {
    type: "qcm",
    question: "Quelle est la différence structurale principale entre l'hélice alpha et le feuillet béta plissé ?",
    options: [
      "L'hélice alpha se stabilise par liaisons hydrogène le long d'une même chaîne ; le feuillet béta se stabilise par liaisons hydrogène entre chaînes voisines alignées en zigzag.",
      "Seul le feuillet béta implique des liaisons hydrogène, l'hélice alpha n'en possède aucune.",
      "L'hélice alpha concerne uniquement la structure tertiaire, pas la structure secondaire."
    ],
    answer: "L'hélice alpha se stabilise par liaisons hydrogène le long d'une même chaîne ; le feuillet béta se stabilise par liaisons hydrogène entre chaînes voisines alignées en zigzag.",
    explanation: "L'HÉLICE ALPHA se stabilise par des liaisons hydrogène le long D'UNE MÊME CHAÎNE. Le FEUILLET BÉTA PLISSÉ provient d'un alignement en ZIGZAG des chaînes, stabilisé par des liaisons hydrogène ENTRE CHAÎNES CONTIGUËS (voisines) — les groupements R s'étendant au-dessus et en dessous du feuillet. Les deux sont bien deux formes de la structure SECONDAIRE, pas tertiaire, et les deux impliquent des liaisons hydrogène."
  },
  {
    type: "qcm",
    question: "Pourquoi dit-on que la structure tertiaire est la forme 'biologiquement active' d'une protéine, par exemple pour les enzymes ?",
    options: [
      "Parce qu'elle correspond au repliement 3D global de la protéine, incluant des interactions entre régions distantes de la chaîne.",
      "Parce qu'elle correspond uniquement à la séquence brute d'acides aminés sans aucun repliement.",
      "Parce qu'elle nécessite obligatoirement l'association de 4 chaînes polypeptidiques identiques."
    ],
    answer: "Parce qu'elle correspond au repliement 3D global de la protéine, incluant des interactions entre régions distantes de la chaîne.",
    explanation: "La STRUCTURE TERTIAIRE résulte du repliement de l'hélice alpha en une structure GLOBULAIRE TRIDIMENSIONNELLE, avec des interactions entre RÉGIONS de la protéine (pas seulement des résidus voisins comme en structure secondaire). C'est cette conformation 3D précise qui rend la protéine biologiquement active. La séquence brute sans repliement correspond à la structure PRIMAIRE, et l'association de 4 chaînes identiques décrit un cas particulier de structure QUATERNAIRE (l'hémoglobine), pas une règle générale de la structure tertiaire."
  },
  {
    type: "qcm",
    question: "Que se passe-t-il si une protéine perd sa conformation tertiaire par dénaturation (chaleur, pH) ?",
    options: [
      "Elle perd également sa fonction biologique.",
      "Elle gagne une nouvelle fonction biologique plus efficace.",
      "Sa structure primaire (séquence d'acides aminés) est immédiatement détruite aussi."
    ],
    answer: "Elle perd également sa fonction biologique.",
    explanation: "En PERDANT SA CONFORMATION (dénaturation, par exemple sous l'effet de la chaleur ou du pH), la protéine PERD ÉGALEMENT SA FONCTION BIOLOGIQUE — c'est le lien direct entre structure tertiaire et activité biologique. La dénaturation ne détruit pas nécessairement les liaisons peptidiques de la structure primaire (liaisons covalentes fortes) : elle affecte surtout les liaisons faibles de la structure secondaire/tertiaire."
  },
  {
    type: "qcm",
    question: "La structure quaternaire d'une protéine, illustrée par l'hémoglobine (4 sous-unités), repose sur :",
    options: [
      "La combinaison de plusieurs chaînes polypeptidiques par liaisons non covalentes et ponts disulfures.",
      "Une seule chaîne polypeptidique repliée sur elle-même en structure globulaire.",
      "La liaison covalente directe entre deux acides gras et une chaîne polypeptidique."
    ],
    answer: "La combinaison de plusieurs chaînes polypeptidiques par liaisons non covalentes et ponts disulfures.",
    explanation: "La STRUCTURE QUATERNAIRE résulte de la combinaison, par des liaisons NON COVALENTES et des PONTS DISULFURES, de PLUSIEURS chaînes polypeptidiques (sous-unités, identiques ou non) en une seule molécule fonctionnelle. Exemples : hémoglobine (4 sous-unités chez les animaux), ribosomes (2 sous-unités). Une seule chaîne repliée décrit plutôt la structure TERTIAIRE, pas quaternaire, qui nécessite par définition plusieurs chaînes."
  }
] },
        { nom: "Structure membranaire", quiz: [
  {
    type: "qcm",
    question: "Parmi les propriétés générales des membranes biologiques, laquelle décrit leur capacité à ne pas laisser passer n'importe quelle molécule ?",
    options: [
      "La perméabilité sélective.",
      "La fluidité membranaire.",
      "L'amphipathie des phospholipides."
    ],
    answer: "La perméabilité sélective.",
    explanation: "La PERMÉABILITÉ SÉLECTIVE désigne la capacité de la membrane à contrôler quelles molécules passent et lesquelles sont bloquées. La FLUIDITÉ concerne plutôt la mobilité des phospholipides (utile pour l'auto-réparation), et l'AMPHIPATHIE est la propriété physico-chimique qui explique la formation de la bicouche, pas directement la sélectivité du passage."
  },
  {
    type: "qcm",
    question: "Au microscope électronique, la membrane apparaît sous forme de deux feuillets sombres séparés par un espace clair. Que représentent ces deux zones ?",
    options: [
      "Les feuillets sombres = pôles hydrophobes ; l'espace clair = les pôles hydrophiles.",
      "Les feuillets sombres = pôles hydrophiles ; l'espace clair = le pôle hydrophobe.",
      "Les feuillets sombres = protéines transmembranaires ; l'espace clair = glucides membranaires."
    ],
    answer: "Les feuillets sombres = pôles hydrophiles ; l'espace clair = le pôle hydrophobe.",
    explanation: "Les DEUX FEUILLETS SOMBRES correspondent aux deux PÔLES HYDROPHILES (affinité pour l'eau) situés vers l'extérieur et l'intérieur de la cellule. L'ESPACE CLAIR au milieu correspond au PÔLE HYDROPHOBE (repousse l'eau). C'est le caractère amphiphile des phospholipides qui impose cette disposition en bicouche — les protéines et glucides ne définissent pas cette image en feuillets."
  },
  {
    type: "qcm",
    question: "Dans le modèle de la mosaïque fluide de Singer et Nicholson (1970), quel est le rôle respectif de la bicouche lipidique et des protéines/glucides ?",
    options: [
      "La bicouche lipidique porte les fonctions ; les protéines et glucides donnent l'architecture.",
      "La bicouche lipidique donne l'architecture ; les protéines et glucides portent les fonctions.",
      "Seuls les glucides déterminent à la fois l'architecture et les fonctions de la membrane."
    ],
    answer: "La bicouche lipidique donne l'architecture ; les protéines et glucides portent les fonctions.",
    explanation: "Le cours établit clairement cette répartition des rôles : la STRUCTURE des lipides (en bicouche) explique l'ARCHITECTURE de la membrane, tandis que les PROTÉINES et les GLUCIDES portent les FONCTIONS spécifiques (transport, reconnaissance, etc.). C'est un point de vigilance : ne pas inverser architecture et fonction entre lipides et protéines/glucides."
  },
  {
    type: "qcm",
    question: "Quel stérol est présent dans la membrane des cellules végétales, selon le modèle de la mosaïque fluide ?",
    options: [
      "Le cholestérol.",
      "L'ergostérol.",
      "Le phytol."
    ],
    answer: "L'ergostérol.",
    explanation: "Chez les cellules VÉGÉTALES, le stérol inséré entre les phospholipides est l'ERGOSTÉROL, alors que chez les cellules ANIMALES c'est le CHOLESTÉROL. Le phytol est une molécule isoprénique différente, vue au Chapitre 1 comme squelette de base de la chlorophylle — il n'a rien à voir avec la structure membranaire ici."
  },
  {
    type: "qcm",
    question: "Parmi les 3 types de protéines membranaires du modèle de la mosaïque fluide, laquelle traverse entièrement la bicouche lipidique ?",
    options: [
      "La protéine périphérique.",
      "La protéine intrinsèque.",
      "La protéine transmembranaire."
    ],
    answer: "La protéine transmembranaire.",
    explanation: "La PROTÉINE TRANSMEMBRANAIRE traverse ENTIÈREMENT la bicouche lipidique, d'un côté à l'autre. La PROTÉINE PÉRIPHÉRIQUE reste À LA SURFACE de la membrane, et la PROTÉINE INTRINSÈQUE est solidement ancrée DANS la couche lipidique mais sans nécessairement la traverser complètement — trois positions bien distinctes à ne pas confondre."
  },
  {
    type: "qcm",
    question: "À quelle fréquence approximative un phospholipide change-t-il de position avec un voisin (mouvement latéral) au sein d'une même couche ?",
    options: [
      "Environ une fois toutes les demi-heures.",
      "Plus d'un million de fois par seconde.",
      "Une seule fois par cycle cellulaire."
    ],
    answer: "Plus d'un million de fois par seconde.",
    explanation: "Le mouvement LATÉRAL (échange de position avec un voisin dans la même couche) se produit PLUS D'UN MILLION DE FOIS PAR SECONDE (vitesse ≈ 2 µm/s) — c'est un mouvement très rapide. Le mouvement de BASCULE (flip-flop) d'une couche à l'autre, lui, est beaucoup plus rare : environ UNE FOIS TOUTES LES DEMI-HEURES. Attention à ne pas inverser ces deux fréquences très différentes."
  },
  {
    type: "qcm",
    question: "Le mouvement de bascule d'un phospholipide d'une couche à l'autre de la bicouche (flip-flop) se produit à quelle fréquence approximative ?",
    options: [
      "Plus d'un million de fois par seconde.",
      "Environ une fois toutes les demi-heures.",
      "Environ une fois par seconde."
    ],
    answer: "Environ une fois toutes les demi-heures.",
    explanation: "Le FLIP-FLOP (bascule d'une couche à l'autre) est un événement RARE : environ UNE FOIS TOUTES LES DEMI-HEURES. C'est bien plus lent que le mouvement latéral (échange avec un voisin dans la même couche), qui lui se produit plus d'un million de fois par seconde — piège classique si on confond les deux types de mouvements."
  },
  {
    type: "qcm",
    question: "Grâce à quelle propriété une membrane percée ou déchirée peut-elle se refermer d'elle-même ?",
    options: [
      "La perméabilité sélective.",
      "La fluidité de la membrane, due à la mobilité des phospholipides.",
      "La présence de protéines transmembranaires uniquement."
    ],
    answer: "La fluidité de la membrane, due à la mobilité des phospholipides.",
    explanation: "C'est la FLUIDITÉ de la membrane (due à la mobilité constante des phospholipides) qui permet à une membrane percée de se REFERMER D'ELLE-MÊME, les phospholipides se rapprochant pour combler l'ouverture. La perméabilité sélective concerne le contrôle du passage des molécules, pas la réparation structurale de la membrane."
  },
  {
    type: "qcm",
    question: "Parmi ces molécules, lesquelles traversent librement la bicouche lipidique sans intermédiaire protéique, selon leur nature lipophile ?",
    options: [
      "Le glucose et le saccharose.",
      "Les acides gras, l'O2 et le CO2.",
      "Les ions Na+ et K+."
    ],
    answer: "Les acides gras, l'O2 et le CO2.",
    explanation: "Les molécules LIPOPHILES (apolaires) et les GAZ, comme les acides gras, l'O2, le CO2 et le N2, traversent LIBREMENT la bicouche lipidique sans avoir besoin de protéine. Le glucose et le saccharose sont de GROSSES MOLÉCULES POLAIRES non chargées qui nécessitent des protéines de transport, et les ions (Na+, K+) sont des molécules polaires CHARGÉES qui ne traversent pas non plus la bicouche seule."
  },
  {
    type: "qcm",
    question: "La bicouche lipidique est-elle perméable aux molécules hydrosolubles et aux ions ?",
    options: [
      "Oui, elles la traversent librement comme les molécules liposolubles.",
      "Non, elle est imperméable ; ces molécules doivent passer par des protéines transmembranaires.",
      "Seuls les ions positifs la traversent librement, contrairement aux ions négatifs."
    ],
    answer: "Non, elle est imperméable ; ces molécules doivent passer par des protéines transmembranaires.",
    explanation: "La bicouche est IMPERMÉABLE aux molécules HYDROSOLUBLES et aux IONS. Ces molécules doivent obligatoirement passer par des PROTÉINES TRANSMEMBRANAIRES (protéines porteuses/perméases ou canaux protéiques). Il n'y a pas de distinction entre ions positifs et négatifs à ce niveau : aucun des deux ne traverse la bicouche seule."
  },
  {
    type: "qcm",
    question: "Qu'est-ce qui caractérise fondamentalement un transport passif (diffusion), par opposition à un transport actif ?",
    options: [
      "Il se fait selon le gradient de concentration, sans dépense d'énergie (ATP).",
      "Il se fait contre le gradient de concentration, avec dépense d'énergie.",
      "Il nécessite systématiquement une protéine porteuse spécifique."
    ],
    answer: "Il se fait selon le gradient de concentration, sans dépense d'énergie (ATP).",
    explanation: "Le TRANSPORT PASSIF se fait SELON le gradient de concentration (du milieu concentré vers le dilué), jusqu'à égalisation des concentrations, SANS DÉPENSE D'ÉNERGIE (pas d'ATP). C'est le TRANSPORT ACTIF qui se fait CONTRE le gradient et nécessite de l'énergie. Le transport passif n'exige pas toujours une protéine (ex. diffusion simple), contrairement à la diffusion facilitée qui elle en a besoin."
  },
  {
    type: "qcm",
    question: "L'osmose correspond à :",
    options: [
      "La diffusion passive de l'eau à travers la membrane.",
      "Le transport actif d'ions par une pompe consommant de l'ATP.",
      "La diffusion facilitée du glucose par une protéine porteuse."
    ],
    answer: "La diffusion passive de l'eau à travers la membrane.",
    explanation: "L'OSMOSE est spécifiquement la diffusion PASSIVE de l'EAU à travers la membrane, sans dépense d'énergie. Elle ne concerne pas les ions (qui relèvent du transport actif par pompe) ni le glucose (qui relève de la diffusion facilitée via une protéine porteuse) — c'est un type de transport passif à part, réservé à l'eau."
  },
  {
    type: "qcm",
    question: "Quelle est la différence entre diffusion simple et diffusion facilitée ?",
    options: [
      "La diffusion simple nécessite un canal protéique ; la diffusion facilitée n'en nécessite aucun.",
      "La diffusion facilitée nécessite un canal ou une protéine porteuse (perméase) ; la diffusion simple n'en nécessite pas.",
      "La diffusion facilitée consomme de l'ATP ; la diffusion simple n'en consomme pas."
    ],
    answer: "La diffusion facilitée nécessite un canal ou une protéine porteuse (perméase) ; la diffusion simple n'en nécessite pas.",
    explanation: "La DIFFUSION FACILITÉE nécessite un CANAL ou une PROTÉINE PORTEUSE (perméase) pour faire traverser la molécule. La DIFFUSION SIMPLE, elle, se fait SANS aucun intermédiaire protéique (typiquement pour les molécules lipophiles). Les deux restent des transports PASSIFS : ni l'une ni l'autre ne consomme d'ATP — c'est ce qui les distingue toutes deux du transport actif."
  },
  {
    type: "qcm",
    question: "Le transport actif primaire (pompe) se caractérise par :",
    options: [
      "L'utilisation d'un gradient ionique déjà établi, sans consommation directe d'ATP.",
      "Une consommation directe d'ATP pour faire passer les molécules contre leur gradient.",
      "L'absence totale de dépense d'énergie, comme un transport passif."
    ],
    answer: "Une consommation directe d'ATP pour faire passer les molécules contre leur gradient.",
    explanation: "Le TRANSPORT ACTIF PRIMAIRE (pompe) consomme DIRECTEMENT de l'ATP pour déplacer des molécules CONTRE leur gradient de concentration. L'utilisation d'un gradient ionique sans consommation directe d'ATP décrit plutôt le TRANSPORT ACTIF SECONDAIRE (co-transport), qui reste néanmoins toujours couplé à un transport actif primaire en amont."
  },
  {
    type: "qcm",
    question: "Le transport actif secondaire (co-transport) est caractérisé par :",
    options: [
      "Une consommation directe d'ATP, indépendante de tout gradient ionique.",
      "L'utilisation d'un gradient ionique, sans consommation directe d'ATP, mais toujours couplé à un transport actif primaire.",
      "L'absence de toute protéine porteuse, contrairement au transport primaire."
    ],
    answer: "L'utilisation d'un gradient ionique, sans consommation directe d'ATP, mais toujours couplé à un transport actif primaire.",
    explanation: "Le TRANSPORT ACTIF SECONDAIRE (co-transport) utilise un GRADIENT IONIQUE déjà établi, SANS consommer directement d'ATP — mais il reste TOUJOURS COUPLÉ à un transport actif primaire (qui, lui, a créé ce gradient ionique via l'ATP). Il utilise bien une protéine porteuse, tout comme le transport primaire — la 3ème option est donc fausse."
  },
  {
    type: "qcm",
    question: "Un transporteur de type 'symport' déplace :",
    options: [
      "Une seule molécule dans un seul sens.",
      "Deux molécules dans le même sens.",
      "Deux molécules dans des sens opposés."
    ],
    answer: "Deux molécules dans le même sens.",
    explanation: "Le SYMPORT déplace DEUX molécules dans le MÊME SENS à travers la membrane. L'UNIPORT déplace une SEULE molécule dans un seul sens, et l'ANTIPORT déplace deux molécules dans des SENS OPPOSÉS. Ce sont trois sous-catégories de protéines porteuses à bien distinguer selon le nombre de molécules transportées et leur direction relative."
  },
  {
    type: "qcm",
    question: "Sur quelle membrane trouve-t-on des glycoprotéines périphériques impliquées dans la reconnaissance de signaux (récepteurs, supports antigéniques) ?",
    options: [
      "La membrane plasmique.",
      "La membrane interne de la mitochondrie.",
      "La membrane de la vacuole."
    ],
    answer: "La membrane plasmique.",
    explanation: "C'est la MEMBRANE PLASMIQUE qui présente des GLYCOPROTÉINES PÉRIPHÉRIQUES impliquées dans la reconnaissance de signaux (récepteurs de signaux, supports antigéniques). La membrane interne de la mitochondrie est plutôt spécialisée dans les protéines de la chaîne respiratoire, et la membrane de la vacuole dans l'accumulation de protons H+ — chaque membrane a sa spécificité propre."
  },
  {
    type: "qcm",
    question: "Quelle membrane porte les complexes protéiques impliqués dans la photosynthèse (photosystèmes I et II, ATP synthases) ?",
    options: [
      "La membrane externe du chloroplaste.",
      "La membrane des thylakoïdes.",
      "La membrane nucléaire."
    ],
    answer: "La membrane des thylakoïdes.",
    explanation: "Ce sont les MEMBRANES DES THYLAKOÏDES qui portent les complexes protéiques de la PHOTOSYNTHÈSE (photosystèmes I et II, ATP synthases). C'est un piège important : les membranes de L'ENVELOPPE PLASTIDIALE (interne et externe, donc PAS les thylakoïdes) jouent seulement un rôle de TRANSPORT et NE participent PAS aux réactions de photosynthèse."
  },
  {
    type: "qcm",
    question: "Les membranes (interne et externe) de l'enveloppe plastidiale participent-elles directement aux réactions de la photosynthèse ?",
    options: [
      "Oui, elles portent les photosystèmes I et II comme les thylakoïdes.",
      "Non, elles jouent uniquement un rôle de transport et ne participent pas à la photosynthèse.",
      "Seule la membrane externe participe à la photosynthèse, pas l'interne."
    ],
    answer: "Non, elles jouent uniquement un rôle de transport et ne participent pas à la photosynthèse.",
    explanation: "Le cours précise explicitement que les membranes (interne et externe) de L'ENVELOPPE PLASTIDIALE jouent un rôle de TRANSPORT uniquement et NE PARTICIPENT PAS aux réactions de photosynthèse. Ce sont les MEMBRANES DES THYLAKOÏDES (structures internes distinctes de l'enveloppe) qui portent les photosystèmes I et II — piège fréquent entre enveloppe et thylakoïdes."
  },
  {
    type: "qcm",
    question: "La membrane externe de la mitochondrie participe-t-elle à la chaîne respiratoire ?",
    options: [
      "Oui, c'est elle qui porte les protéines de la chaîne respiratoire.",
      "Non, elle joue uniquement un rôle de transport ; c'est la membrane interne qui porte la chaîne respiratoire.",
      "Oui, mais uniquement pour les protéines d'oxydoréduction, pas pour les ATP synthases."
    ],
    answer: "Non, elle joue uniquement un rôle de transport ; c'est la membrane interne qui porte la chaîne respiratoire.",
    explanation: "La MEMBRANE EXTERNE de la mitochondrie joue uniquement un rôle de TRANSPORT et NE PARTICIPE PAS à la chaîne respiratoire. C'est la MEMBRANE INTERNE des mitochondries qui porte les protéines d'oxydoréduction de la chaîne respiratoire et les ATP synthases. C'est exactement le même type de piège que pour le chloroplaste (enveloppe externe/interne vs structure interne spécialisée)."
  }
] },    
        { nom: "Les acides nucléiques", quiz: [] },
        { nom: "Le chloroplaste et la photosynthèse", quiz: [
  {
    type: "qcm",
    question: "Comparé à la mitochondrie, le chloroplaste est :",
    options: [
      "Présent dans toutes les cellules eucaryotes, invisible au microscope optique.",
      "Présent uniquement chez les végétaux autotrophes, visible au microscope optique.",
      "Présent uniquement dans les cellules animales, invisible au microscope optique."
    ],
    answer: "Présent uniquement chez les végétaux autotrophes, visible au microscope optique.",
    explanation: "Le CHLOROPLASTE est présent UNIQUEMENT chez les végétaux AUTOTROPHES et VISIBLE au microscope optique (MO). C'est la MITOCHONDRIE qui est présente dans TOUTES les cellules eucaryotes et INVISIBLE au MO — les deux caractéristiques sont inversées entre les deux organites, un piège de confusion classique."
  },
  {
    type: "qcm",
    question: "Quelle est la disposition du système membranaire interne caractéristique du chloroplaste, et comment s'appelle-t-il ?",
    options: [
      "Perpendiculaire au grand axe de l'organite, appelé crêtes mitochondriales.",
      "Parallèle au grand axe de l'organite, appelé thylakoïdes.",
      "Circulaire autour du noyau, appelé nucléosome."
    ],
    answer: "Parallèle au grand axe de l'organite, appelé thylakoïdes.",
    explanation: "Dans le CHLOROPLASTE, le système membranaire est disposé PARALLÈLEMENT au grand axe de l'organite et forme les THYLAKOÏDES. À l'inverse, dans la MITOCHONDRIE, le système membranaire est PERPENDICULAIRE au grand axe et forme les CRÊTES MITOCHONDRIALES — c'est un point de vigilance à ne pas inverser entre les deux organites."
  },
  {
    type: "qcm",
    question: "Que signifie le terme 'semi-autonome' appliqué à la fois au chloroplaste et à la mitochondrie ?",
    options: [
      "Ils renferment leur propre matériel génétique pour synthétiser une partie de leurs protéines, indépendamment du noyau.",
      "Ils sont totalement autonomes et ne dépendent jamais du noyau pour aucune protéine.",
      "Ils dépendent entièrement du noyau et ne possèdent aucun matériel génétique propre."
    ],
    answer: "Ils renferment leur propre matériel génétique pour synthétiser une partie de leurs protéines, indépendamment du noyau.",
    explanation: "Le chloroplaste et la mitochondrie sont dits SEMI-AUTONOMES car ils renferment leur PROPRE matériel génétique (ADN et ARN) et leurs propres ribosomes (plastoribosomes / mitoribosomes) pour synthétiser une PARTIE de leurs protéines, INDÉPENDAMMENT du noyau. Le préfixe 'semi' indique justement qu'ils ne sont pas TOTALEMENT autonomes — ils dépendent aussi en partie du noyau pour d'autres protéines."
  },
  {
    type: "qcm",
    question: "La phase lumineuse (photochimique) de la photosynthèse se déroule où, et dépend-elle directement de la lumière ?",
    options: [
      "Dans le stroma, et ne dépend pas directement de la lumière.",
      "Dans les membranes des thylakoïdes, et dépend directement de la lumière.",
      "Dans la matrice mitochondriale, et dépend directement de la lumière."
    ],
    answer: "Dans les membranes des thylakoïdes, et dépend directement de la lumière.",
    explanation: "La PHASE LUMINEUSE (phototrophie photosynthétique) se déroule dans les MEMBRANES DES THYLAKOÏDES et dépend DIRECTEMENT de la lumière. C'est la PHASE OBSCURE (autotrophie photosynthétique) qui se déroule dans le STROMA et NE dépend PAS de la lumière. La matrice mitochondriale n'a rien à voir avec la photosynthèse — c'est le siège du cycle de Krebs dans la respiration."
  },
  {
    type: "qcm",
    question: "Quels sont les deux produits obtenus à l'issue de la phase lumineuse, utilisés ensuite dans le cycle de Calvin-Benson ?",
    options: [
      "Du glucose et de l'O2.",
      "De l'ATP et du NADPH2.",
      "Du CO2 et de l'eau."
    ],
    answer: "De l'ATP et du NADPH2.",
    explanation: "La phase lumineuse produit de l'ATP et du NADPH2, qui seront utilisés dans la phase obscure (cycle de Calvin-Benson) pour convertir le CO2 en carbone organique. Le glucose est le produit FINAL de toute la photosynthèse (phase obscure incluse), pas un produit direct de la phase lumineuse seule. Le CO2 est au contraire un SUBSTRAT consommé dans la phase obscure, pas un produit de la phase lumineuse."
  },
  {
    type: "qcm",
    question: "Quel est l'accepteur primaire d'électrons du photosystème II (PSII) ?",
    options: [
      "La chlorophylle A0.",
      "La phéophytine.",
      "La ferrédoxine."
    ],
    answer: "La phéophytine.",
    explanation: "L'accepteur primaire du PSII est la PHÉOPHYTINE. L'accepteur primaire du PSI, lui, est la CHLOROPHYLLE A0 — ne pas inverser les deux photosystèmes. La ferrédoxine intervient plus loin dans la chaîne, après le PSI, pour transporter les électrons jusqu'à la NADP réductase."
  },
  {
    type: "qcm",
    question: "Dans un couple redox comme NADP+/NADPH2, quelle est la forme réduite (donneuse d'électrons) ?",
    options: [
      "NADP+.",
      "NADPH2.",
      "Les deux formes sont équivalentes, aucune n'est réductrice."
    ],
    answer: "NADPH2.",
    explanation: "Dans le couple NADP+/NADPH2, le NADPH2 est la forme RÉDUITE (donneuse d'électrons), tandis que le NADP+ est la forme OXYDÉE (accepteuse d'électrons). C'est la règle générale des couples redox du cours : formes réduites = donneurs (NADPH2, H2O) ; formes oxydées = accepteurs (NADP, O2)."
  },
  {
    type: "qcm",
    question: "Dans la réaction de photosynthèse (réaction de Hill), quel est le donneur d'électrons et quel est l'accepteur final ?",
    options: [
      "H2O est le donneur d'électrons ; NADP est l'accepteur final.",
      "NADP est le donneur d'électrons ; H2O est l'accepteur final.",
      "O2 est le donneur d'électrons ; CO2 est l'accepteur final."
    ],
    answer: "H2O est le donneur d'électrons ; NADP est l'accepteur final.",
    explanation: "Dans la phototrophie photosynthétique, l'H2O est le DONNEUR D'ÉLECTRONS (via la photolyse de l'eau au niveau du PSII) et le NADP est l'ACCEPTEUR FINAL d'électrons, réduit en NADPH2. Le CO2 n'intervient pas dans cette réaction de transfert d'électrons de la phase lumineuse : il est fixé plus tard, dans la phase obscure."
  },
  {
    type: "qcm",
    question: "Que provoque la photolyse de l'eau au niveau du PSII ?",
    options: [
      "La libération de glucose et d'ATP.",
      "La libération de 2 électrons, ½O2 et 2H+.",
      "La formation directe de NADPH2 sans passer par la chaîne d'électrons."
    ],
    answer: "La libération de 2 électrons, ½O2 et 2H+.",
    explanation: "La PHOTOLYSE DE L'EAU, provoquée par la lumière solaire au niveau du PSII, libère 2 ÉLECTRONS, ½O2 et 2H+. Les électrons libérés remplacent ceux perdus par la chlorophylle a du centre réactionnel, qui redevient ainsi stable. Le NADPH2, lui, n'est formé qu'à la fin de la chaîne, après le passage par le PSI et la ferrédoxine, pas directement par la photolyse."
  },
  {
    type: "qcm",
    question: "Que se passe-t-il lorsque les électrons traversent le complexe de cytochromes, entre le PSII et le PSI ?",
    options: [
      "Ils gagnent de l'énergie, ce qui permet de synthétiser directement du glucose.",
      "Ils perdent de l'énergie, utilisée pour transférer des protons H+ du stroma vers l'espace intrathylakoïde.",
      "Ils sont directement transférés au NADP sans passer par le PSI."
    ],
    answer: "Ils perdent de l'énergie, utilisée pour transférer des protons H+ du stroma vers l'espace intrathylakoïde.",
    explanation: "En traversant le COMPLEXE DE CYTOCHROMES, les électrons PERDENT de l'énergie, qui est utilisée pour amener des protons H+ du STROMA vers l'espace INTRATHYLAKOÏDE (lumen), créant ainsi le gradient de protons. Les électrons, une fois déchargés, sont ensuite transmis au PSI pour être rechargés en énergie — ils ne vont donc pas directement au NADP à ce stade."
  },
  {
    type: "qcm",
    question: "Comment le gradient de protons H+ créé entre le lumen et le stroma est-il utilisé pour synthétiser l'ATP ?",
    options: [
      "Les H+ repassent à travers l'ATP synthase dans le sens du gradient, libérant de l'énergie utilisée pour la synthèse d'ATP.",
      "Les H+ sont directement transformés en ATP par la Rubisco dans le stroma.",
      "Le gradient de protons n'intervient pas dans la synthèse d'ATP, seule la lumière directe compte."
    ],
    answer: "Les H+ repassent à travers l'ATP synthase dans le sens du gradient, libérant de l'énergie utilisée pour la synthèse d'ATP.",
    explanation: "Quand les protons H+ REPASSENT à travers l'ATP SYNTHASE dans le sens de leur gradient (du lumen vers le stroma), l'énergie ainsi libérée est utilisée par l'enzyme pour SYNTHÉTISER L'ATP, libéré dans le stroma. La Rubisco n'a aucun rôle dans la synthèse d'ATP : c'est l'enzyme qui fixe le CO2 sur le RuBP dans le cycle de Calvin-Benson (phase obscure)."
  },
  {
    type: "qcm",
    question: "Quelle enzyme catalyse la fixation du CO2 sur le ribulose biphosphate (RuBP), première étape du cycle de Calvin-Benson ?",
    options: [
      "L'ATP synthase.",
      "La Rubisco.",
      "La NADP réductase."
    ],
    answer: "La Rubisco.",
    explanation: "La RUBISCO catalyse la fixation du CO2 sur le RIBULOSE BIPHOSPHATE (RuBP), formant une molécule instable qui se scinde rapidement en 2 molécules de 3-phosphoglycérate (3-PGA). L'ATP synthase intervient dans la synthèse d'ATP (phase lumineuse), et la NADP réductase réduit le NADP en NADPH2 — deux enzymes différentes intervenant à d'autres étapes."
  },
  {
    type: "qcm",
    question: "Après la fixation du CO2 par la Rubisco, combien de molécules de 3-phosphoglycérate (3-PGA), à combien d'atomes de carbone, sont formées ?",
    options: [
      "1 molécule de 3-PGA à 6 atomes de carbone.",
      "2 molécules de 3-PGA à 3 atomes de carbone chacune.",
      "3 molécules de 3-PGA à 2 atomes de carbone chacune."
    ],
    answer: "2 molécules de 3-PGA à 3 atomes de carbone chacune.",
    explanation: "La fixation du CO2 par la Rubisco forme une molécule instable qui se scinde rapidement en 2 MOLÉCULES DE 3-PHOSPHOGLYCÉRATE (3-PGA), chacune à 3 ATOMES DE CARBONE. C'est un point de calcul important pour comprendre les bilans chiffrés du cycle de Calvin-Benson."
  },
  {
    type: "qcm",
    question: "Le 3-phosphoglycérate (3-PGA) est converti en 3-phosphoglycéraldéhyde (G3P) grâce à :",
    options: [
      "Une phosphorylation par l'ATP suivie d'une réduction par le NADPH2.",
      "Une décarboxylation oxydante suivie d'une réduction par le FADH2.",
      "Une simple hydrolyse sans intervention d'ATP ni de NADPH2."
    ],
    answer: "Une phosphorylation par l'ATP suivie d'une réduction par le NADPH2.",
    explanation: "Le 3-PGA est d'abord PHOSPHORYLÉ PAR L'ATP pour donner l'acide 1,3-biphosphoglycérique, puis RÉDUIT PAR LE NADPH2 pour former le G3P (3-phosphoglycéraldéhyde), le PREMIER SUCRE formé du cycle. La décarboxylation oxydante et le FADH2 sont des éléments du cycle de Krebs (respiration mitochondriale), pas du cycle de Calvin-Benson."
  },
  {
    type: "qcm",
    question: "Pour que le cycle de Calvin-Benson se poursuive indéfiniment (bilan pour 1 molécule de G3P disponible pour la cellule), combien de molécules de CO2, d'ATP et de NADPH2 sont consommées ?",
    options: [
      "6 CO2, 18 ATP et 12 NADPH2.",
      "3 CO2, 9 ATP et 6 NADPH2.",
      "1 CO2, 3 ATP et 2 NADPH2."
    ],
    answer: "3 CO2, 9 ATP et 6 NADPH2.",
    explanation: "Pour qu'1 molécule de G3P soit disponible pour la cellule (et que le cycle continue, avec régénération du RuBP), il faut consommer 3 CO2, 9 ATP et 6 NADPH2. Le bilan '6 CO2, 18 ATP, 12 NADPH2' correspond à la synthèse d'1 molécule COMPLÈTE DE GLUCOSE (qui nécessite 2 G3P), et non à 1 seule molécule de G3P — un piège classique de facteur 2."
  },
  {
    type: "qcm",
    question: "Combien de CO2, d'ATP et de NADPH2 faut-il pour synthétiser 1 molécule complète de glucose via le cycle de Calvin-Benson ?",
    options: [
      "3 CO2, 9 ATP et 6 NADPH2.",
      "6 CO2, 18 ATP et 12 NADPH2.",
      "12 CO2, 36 ATP et 24 NADPH2."
    ],
    answer: "6 CO2, 18 ATP et 12 NADPH2.",
    explanation: "Pour synthétiser 1 MOLÉCULE COMPLÈTE DE GLUCOSE (qui nécessite 2 molécules de G3P), il faut 6 CO2, 18 ATP et 12 NADPH2 — soit exactement le double du bilan pour 1 seule molécule de G3P (3 CO2, 9 ATP, 6 NADPH2), car il faut 2 G3P pour former 1 glucose."
  },
  {
    type: "qcm",
    question: "Une partie du G3P produit par le cycle de Calvin-Benson sert à régénérer le RuBP. Que devient l'autre partie ?",
    options: [
      "Elle est directement rejetée sous forme de CO2.",
      "Elle entre dans les réactions métaboliques de la plante (glucides, acides gras, acides aminés).",
      "Elle retourne intégralement dans la phase lumineuse pour régénérer le NADP."
    ],
    answer: "Elle entre dans les réactions métaboliques de la plante (glucides, acides gras, acides aminés).",
    explanation: "Une partie du G3P sert à RÉGÉNÉRER le RuBP pour que le cycle continue, tandis que l'AUTRE PARTIE entre dans les RÉACTIONS MÉTABOLIQUES de la plante pour former des glucides, des acides gras et des acides aminés. Le G3P n'est ni rejeté sous forme de CO2 (ce serait contre-productif, le CO2 est justement le substrat fixé), ni renvoyé vers la phase lumineuse (les deux phases sont liées par ATP/NADPH2, pas par le G3P)."
  },
  {
    type: "qcm",
    question: "Que renferment les membranes des thylakoïdes, en plus des pigments chlorophylliens et caroténoïdes ?",
    options: [
      "Des complexes protéiques comme les photosystèmes PSI/PSII et l'ATP synthase.",
      "L'appareil de Golgi et le réticulum endoplasmique.",
      "Les enzymes de la glycolyse."
    ],
    answer: "Des complexes protéiques comme les photosystèmes PSI/PSII et l'ATP synthase.",
    explanation: "Les membranes des thylakoïdes renferment, en plus des pigments (chlorophylles et caroténoïdes), des COMPLEXES PROTÉIQUES tels que les PHOTOSYSTÈMES PSI et PSII et l'ATP SYNTHASE, impliqués dans les réactions d'oxydoréduction de la phase lumineuse. L'appareil de Golgi et le réticulum endoplasmique sont des structures cellulaires distinctes, sans lien avec les thylakoïdes. Les enzymes de la glycolyse se trouvent dans le cytoplasme, pas dans le chloroplaste."
  },
  {
    type: "qcm",
    question: "Un centre réactionnel de photosystème est constitué de :",
    options: [
      "Une paire de chlorophylle a, qui cède ses électrons à un accepteur primaire.",
      "Uniquement des caroténoïdes, sans chlorophylle.",
      "Une molécule unique de phéophytine, sans antenne collectrice."
    ],
    answer: "Une paire de chlorophylle a, qui cède ses électrons à un accepteur primaire.",
    explanation: "Le CENTRE RÉACTIONNEL d'un photosystème présente une PAIRE DE CHLOROPHYLLE A, qui cède ses électrons à un ACCEPTEUR PRIMAIRE (phéophytine pour PSII, chlorophylle A0 pour PSI). L'antenne collectrice (composée de chlorophylles a et b et de caroténoïdes) entoure ce centre réactionnel et lui transmet l'énergie captée — les caroténoïdes seuls ne constituent pas le centre réactionnel."
  },
  {
    type: "qcm",
    question: "Dans un couple redox comme O2/H2O, plus la valeur du potentiel redox E0 est forte, plus :",
    options: [
      "Le réducteur de ce couple est fort.",
      "L'oxydant de ce couple est fort.",
      "Le couple devient totalement inerte, sans capacité oxydante ni réductrice."
    ],
    answer: "L'oxydant de ce couple est fort.",
    explanation: "Selon la règle donnée par le cours : plus la valeur du E0 d'un couple est FORTE, plus l'OXYDANT de ce couple est fort (ex. O2/H2O, E0 = +0,82V, un oxydant puissant). À l'inverse, plus le E0 est FAIBLE, plus le RÉDUCTEUR est fort (ex. NAD+/NADH2, E0 = -0,32V). Ces valeurs de potentiel redox permettent de prédire le sens du transfert d'électrons dans les chaînes de transport."
  }
] },
        { nom: "Le mitochondrie et la respiration cellulaire", quiz: [
  {
    type: "qcm",
    question: "Comparée à la membrane interne, la membrane externe de la mitochondrie est :",
    options: [
      "Relativement perméable.",
      "Peu perméable et présente des crêtes mitochondriales.",
      "Totalement imperméable à toute molécule."
    ],
    answer: "Relativement perméable.",
    explanation: "La MEMBRANE EXTERNE de la mitochondrie est une double couche phospholipidique RELATIVEMENT PERMÉABLE. C'est la MEMBRANE INTERNE qui est PEU PERMÉABLE et présente des replis appelés CRÊTES MITOCHONDRIALES, renfermant les complexes protéiques de la chaîne respiratoire — les deux propriétés sont inversées entre les deux membranes, un piège fréquent."
  },
  {
    type: "qcm",
    question: "Dans quel compartiment se déroule la glycolyse ?",
    options: [
      "Dans la matrice mitochondriale.",
      "Dans le cytoplasme.",
      "Dans la membrane mitochondriale interne."
    ],
    answer: "Dans le cytoplasme.",
    explanation: "La GLYCOLYSE se déroule dans le CYTOPLASME, car les molécules organiques sont trop grosses pour pénétrer directement dans la mitochondrie. C'est le CYCLE DE KREBS qui se déroule dans la MATRICE mitochondriale, et la CHAÎNE RESPIRATOIRE dans la MEMBRANE MITOCHONDRIALE INTERNE — trois étapes, trois lieux différents à ne pas confondre."
  },
  {
    type: "qcm",
    question: "Où se déroule le cycle de Krebs, et où se déroule la chaîne respiratoire ?",
    options: [
      "Le cycle de Krebs dans la matrice mitochondriale ; la chaîne respiratoire dans la membrane mitochondriale interne.",
      "Le cycle de Krebs dans la membrane mitochondriale interne ; la chaîne respiratoire dans la matrice.",
      "Les deux se déroulent dans le cytoplasme, comme la glycolyse."
    ],
    answer: "Le cycle de Krebs dans la matrice mitochondriale ; la chaîne respiratoire dans la membrane mitochondriale interne.",
    explanation: "Le CYCLE DE KREBS se déroule dans la MATRICE mitochondriale, et la CHAÎNE RESPIRATOIRE (oxydations terminales) dans la MEMBRANE MITOCHONDRIALE INTERNE. Aucun des deux ne se déroule dans le cytoplasme — c'est la GLYCOLYSE, la première étape, qui a lieu dans le cytoplasme, en dehors de la mitochondrie."
  },
  {
    type: "qcm",
    question: "Pourquoi la glycolyse se déroule-t-elle en dehors de la mitochondrie, dans le cytoplasme ?",
    options: [
      "Parce que les molécules organiques sont trop grosses pour pénétrer directement dans la mitochondrie.",
      "Parce que la mitochondrie ne possède pas les enzymes nécessaires à la glycolyse.",
      "Parce que la glycolyse nécessite la présence de lumière, absente dans la mitochondrie."
    ],
    answer: "Parce que les molécules organiques sont trop grosses pour pénétrer directement dans la mitochondrie.",
    explanation: "Les molécules organiques (comme le glucose) sont trop GROSSES pour pénétrer directement dans la mitochondrie : elles doivent d'abord être oxydées en fragments plus petits dans le CYTOPLASME, via la glycolyse. Ce n'est pas une question d'enzymes absentes (la mitochondrie a bien les siennes pour le cycle de Krebs et la chaîne respiratoire), et la lumière n'a rien à voir avec la respiration cellulaire (contrairement à la photosynthèse)."
  },
  {
    type: "qcm",
    question: "Combien de réactions comporte la glycolyse, et quel est son résultat sur le glucose ?",
    options: [
      "10 réactions, aboutissant à une dégradation partielle du glucose en 2 pyruvates.",
      "3 réactions, aboutissant à une dégradation complète du glucose en CO2 et H2O.",
      "8 réactions, aboutissant directement à la formation d'acétyl-CoA."
    ],
    answer: "10 réactions, aboutissant à une dégradation partielle du glucose en 2 pyruvates.",
    explanation: "La glycolyse est un ensemble de 10 RÉACTIONS qui transforment le glucose en 2 PYRUVATES (dégradation PARTIELLE, pas complète). La dégradation complète en CO2 et H2O nécessite les étapes suivantes (cycle de Krebs + chaîne respiratoire). La formation directe d'acétyl-CoA n'a lieu qu'après la glycolyse, lors de l'étape préparatoire du cycle de Krebs (décarboxylation oxydante du pyruvate)."
  },
  {
    type: "qcm",
    question: "Quel est le bilan net (production moins consommation) de la glycolyse ?",
    options: [
      "2 ATP + 2 NADH2.",
      "4 ATP + 4 NADH2.",
      "-2 ATP + 2 NADH2 (bilan négatif en ATP)."
    ],
    answer: "2 ATP + 2 NADH2.",
    explanation: "Le BILAN NET de la glycolyse est de 2 ATP + 2 NADH2 : le processus consomme 2 ATP au départ mais en produit 4 à la fin (net = +2 ATP), plus 2 NADH2. Ce bilan net (2 ATP, pas 4) est un point de vigilance fréquent, car on peut confondre production brute et bilan net."
  },
  {
    type: "qcm",
    question: "En milieu anaérobie, quel est l'accepteur final d'électrons du NADH2 produit par la glycolyse, et quel processus en résulte ?",
    options: [
      "L'O2 est l'accepteur final, ce qui donne la respiration.",
      "Une substance organique est l'accepteur final, ce qui donne la fermentation.",
      "Le CO2 est l'accepteur final, ce qui donne la photosynthèse."
    ],
    answer: "Une substance organique est l'accepteur final, ce qui donne la fermentation.",
    explanation: "En MILIEU ANAÉROBIE, l'accepteur final d'électrons est une SUBSTANCE ORGANIQUE, ce qui donne une FERMENTATION (lactique ou alcoolique). En MILIEU AÉROBIE, c'est l'O2 qui est l'accepteur final, ce qui donne H2O et correspond à la RESPIRATION. La photosynthèse n'a rien à voir avec le devenir du NADH2 issu de la glycolyse : c'est un processus totalement différent, propre aux chloroplastes."
  },
  {
    type: "qcm",
    question: "Comment le pyruvate traverse-t-il la membrane mitochondriale externe pour entrer dans la mitochondrie ?",
    options: [
      "Par des porines.",
      "Par simple diffusion à travers la bicouche lipidique, comme un gaz.",
      "Par un transporteur de type antiport uniquement."
    ],
    answer: "Par des porines.",
    explanation: "Le pyruvate traverse la membrane mitochondriale EXTERNE par des PORINES (cohérent avec le fait que cette membrane est relativement perméable). C'est ensuite au niveau de la membrane mitochondriale INTERNE, peu perméable, que le pyruvate a besoin de TRANSPORTEURS de type SYMPORT couplés à des entrées de protons pour entrer dans la matrice."
  },
  {
    type: "qcm",
    question: "Que produit la décarboxylation oxydante du pyruvate, étape préparatoire du cycle de Krebs, pour 1 molécule de pyruvate ?",
    options: [
      "1 acétyl-CoA + 1 CO2, couplé à la réduction du NAD en NADH2.",
      "2 acétyl-CoA + 2 CO2, sans production de NADH2.",
      "1 oxaloacétate + 1 citrate, sans dégagement de CO2."
    ],
    answer: "1 acétyl-CoA + 1 CO2, couplé à la réduction du NAD en NADH2.",
    explanation: "La décarboxylation oxydante d'1 molécule de pyruvate produit 1 ACÉTYL-CoA + 1 CO2, réaction COUPLÉE à la réduction du NAD en NADH2. Pour les 2 pyruvates issus d'un glucose, le bilan total est donc 2 CO2 + 2 NADH2. L'oxaloacétate et le citrate n'apparaissent qu'à l'étape suivante, quand l'acétyl-CoA entre dans le cycle proprement dit."
  },
  {
    type: "qcm",
    question: "Dans le cycle de Krebs proprement dit, l'acétyl-CoA (2C) se combine à quelle molécule pour former l'acide citrique (6C) ?",
    options: [
      "Le pyruvate (3C).",
      "L'oxaloacétate (4C).",
      "Le 3-phosphoglycérate (3C)."
    ],
    answer: "L'oxaloacétate (4C).",
    explanation: "L'ACÉTYL-CoA (2C) se combine à l'OXALOACÉTATE (4C) pour former l'ACIDE CITRIQUE (6C), point de départ du cycle en 8 étapes qui régénère perpétuellement l'oxaloacétate. Le pyruvate a déjà été transformé en acétyl-CoA à l'étape précédente, et le 3-phosphoglycérate est une molécule du cycle de Calvin-Benson (photosynthèse), sans rapport avec le cycle de Krebs."
  },
  {
    type: "qcm",
    question: "Quel est le bilan du cycle de Krebs en termes d'ATP produit directement, comparé à son pouvoir réducteur ?",
    options: [
      "Bilan en ATP élevé (10 ATP) mais pouvoir réducteur faible.",
      "Bilan en ATP faible (2 ATP pour 4 CO2 dégagés) mais pouvoir réducteur élevé (6 NADH2 + 2 FADH2).",
      "Ni ATP ni pouvoir réducteur ne sont produits directement par le cycle de Krebs."
    ],
    answer: "Bilan en ATP faible (2 ATP pour 4 CO2 dégagés) mais pouvoir réducteur élevé (6 NADH2 + 2 FADH2).",
    explanation: "Le cycle de Krebs a un bilan en ATP FAIBLE (2 ATP pour 4 CO2 dégagés), mais un POUVOIR RÉDUCTEUR ÉLEVÉ (6 NADH2 + 2 FADH2), qui sera responsable de la production d'une grande quantité d'ATP, mais PLUS TARD, dans la chaîne respiratoire. Ce contraste (peu d'ATP directement, beaucoup de pouvoir réducteur) est un point clé à retenir."
  },
  {
    type: "qcm",
    question: "Pourquoi les électrons du NADH2 ne sont-ils pas transférés directement à l'O2 dans la chaîne respiratoire ?",
    options: [
      "Pour éviter une dissémination de l'énergie sous forme de chaleur, le transfert passe par des protéines transporteuses.",
      "Parce que le NADH2 ne peut physiquement jamais entrer en contact avec l'O2 dans la cellule.",
      "Parce que l'O2 est déjà entièrement consommé au niveau du complexe I."
    ],
    answer: "Pour éviter une dissémination de l'énergie sous forme de chaleur, le transfert passe par des protéines transporteuses.",
    explanation: "Pour ÉVITER UNE DISSÉMINATION D'ÉNERGIE SOUS FORME DE CHALEUR, le transfert des électrons du NADH2 (donneur) à l'O2 (accepteur final) ne se fait PAS directement, mais passe par une CHAÎNE de protéines transporteuses (complexes I à IV), permettant une libération progressive et contrôlée de l'énergie, utilisable pour pomper des protons."
  },
  {
    type: "qcm",
    question: "Quelle enzyme oxyde le NADH2 au niveau du complexe I de la chaîne respiratoire ?",
    options: [
      "La succinate déshydrogénase.",
      "La NADH2 déshydrogénase.",
      "La cytochrome-C oxydase."
    ],
    answer: "La NADH2 déshydrogénase.",
    explanation: "Le COMPLEXE I possède le site de liaison de la NADH2 DÉSHYDROGÉNASE, qui oxyde le NADH2 en NAD+ + 2H+ + 2e-, réaction très exergonique permettant le pompage de protons. La succinate déshydrogénase agit au COMPLEXE II (sur le FADH2), et la cytochrome-C oxydase agit au COMPLEXE IV (oxydation du cytochrome C, réduction de l'O2)."
  },
  {
    type: "qcm",
    question: "Contrairement aux complexes I, III et IV, le complexe II de la chaîne respiratoire :",
    options: [
      "Ne pompe pas de protons H+, car sa réaction n'est pas assez exergonique.",
      "Pompe deux fois plus de protons H+ que les autres complexes.",
      "Est le seul complexe capable de réduire directement l'O2 en H2O."
    ],
    answer: "Ne pompe pas de protons H+, car sa réaction n'est pas assez exergonique.",
    explanation: "Le COMPLEXE II (site de la succinate déshydrogénase, transfère les électrons du FADH2 vers l'ubiquinone) a une variation d'enthalpie libre PAS ASSEZ EXERGONIQUE pour permettre le déplacement de protons — c'est une exception parmi les 4 complexes. Ce sont les complexes I, III ET IV qui fonctionnent comme des pompes à protons. Seul le complexe IV réduit l'O2 en H2O, pas le complexe II."
  },
  {
    type: "qcm",
    question: "Quel complexe de la chaîne respiratoire oxyde le cytochrome C et réduit l'O2 en H2O ?",
    options: [
      "Le complexe I.",
      "Le complexe III.",
      "Le complexe IV."
    ],
    answer: "Le complexe IV.",
    explanation: "Le COMPLEXE IV (site de la cytochrome-C oxydase) oxyde le cytochrome C et réduit l'O2 EN H2O — c'est donc à ce niveau que l'O2 agit comme accepteur final d'électrons et que l'H2O est produite. Le complexe III, lui, oxyde l'ubiquinol et transmet les électrons au cytochrome C, mais ne réduit pas directement l'O2."
  },
  {
    type: "qcm",
    question: "Quels sont les deux transporteurs mobiles et indépendants de la chaîne respiratoire, en plus des 4 complexes protéiques fixes ?",
    options: [
      "L'ubiquinone (coenzyme Q) et le cytochrome C.",
      "Le NAD et le FAD.",
      "La Rubisco et la ferrédoxine."
    ],
    answer: "L'ubiquinone (coenzyme Q) et le cytochrome C.",
    explanation: "En plus des 4 complexes protéiques (I, II, III, IV), qui sont immobiles et volumineux, la chaîne respiratoire comprend deux transporteurs MOBILES et INDÉPENDANTS : l'UBIQUINONE (coenzyme Q) et le CYTOCHROME C. Le NAD et le FAD sont des coenzymes qui transportent le pouvoir réducteur avant d'entrer dans la chaîne, pas des composants mobiles de la chaîne elle-même. La Rubisco et la ferrédoxine appartiennent à la photosynthèse, pas à la respiration."
  },
  {
    type: "qcm",
    question: "Comment l'énergie du gradient de protons (force proton-motrice) est-elle finalement utilisée pour synthétiser l'ATP ?",
    options: [
      "Les H+ retournent vers la matrice à travers l'ATP synthase, induisant un changement de conformation qui favorise la synthèse endergonique d'ATP.",
      "Les H+ s'accumulent définitivement dans l'espace intermembranaire sans jamais revenir dans la matrice.",
      "L'ATP est synthétisé directement par le complexe IV, sans intervention de l'ATP synthase."
    ],
    answer: "Les H+ retournent vers la matrice à travers l'ATP synthase, induisant un changement de conformation qui favorise la synthèse endergonique d'ATP.",
    explanation: "La force proton-motrice ramène les H+ vers la MATRICE à travers l'ATP SYNTHASE (sphère pédonculée). Ce passage induit un CHANGEMENT DE CONFORMATION des sous-unités de l'enzyme, ce qui favorise la synthèse ENDERGONIQUE d'ATP. C'est le même principe (chimiosmose) que dans le chloroplaste, mais ici les H+ retournent vers la matrice au lieu du stroma."
  },
  {
    type: "qcm",
    question: "Combien d'ATP sont produits par la réoxydation d'1 molécule de NADH2, et d'1 molécule de FADH2, dans la chaîne respiratoire ?",
    options: [
      "3 ATP pour 1 NADH2, et 2 ATP pour 1 FADH2.",
      "2 ATP pour 1 NADH2, et 3 ATP pour 1 FADH2.",
      "1 ATP pour chacun, NADH2 et FADH2."
    ],
    answer: "3 ATP pour 1 NADH2, et 2 ATP pour 1 FADH2.",
    explanation: "La réoxydation d'1 NADH2 entraîne la production de 3 ATP, et celle d'1 FADH2 entraîne la production de 2 ATP. C'est cette différence qui explique pourquoi, lorsque des électrons de la glycolyse sont injectés au niveau du FADH2 au lieu du NADH2, on obtient 2 ATP au lieu de 3, réduisant le bilan total de 38 à 36 ATP."
  },
  {
    type: "qcm",
    question: "Quel est le bilan net théorique maximal en ATP par molécule de glucose, à l'issue de la respiration cellulaire complète (4 ATP directs + 10 NADH2 + 2 FADH2) ?",
    options: [
      "36 ATP, toujours et sans exception.",
      "38 ATP.",
      "10 ATP seulement, correspondant au pouvoir réducteur uniquement."
    ],
    answer: "38 ATP.",
    explanation: "Le bilan net théorique est : 4 ATP directs + (10 NADH2 x 3 ATP) + (2 FADH2 x 2 ATP) = 4 + 30 + 4 = 38 ATP par molécule de glucose. Le bilan réel de 36 ATP (et non 38) survient dans certaines cellules où les 2 NADH2 de la glycolyse ne pénètrent pas directement dans la mitochondrie et sont réinjectés au niveau du FADH2 — donc 36 n'est pas systématique, c'est une variante réduite du maximum théorique de 38."
  }
] },
        { nom: "Examen de rattrapage 2023", quiz: [] },
        { nom: "TD Biologie", quiz: [] }
      ]
    },
    {
      nom: "Paleontologie",
      pdfCours: null,
      sousMatieres: [
        { nom: "chapitre 1", quiz: [] },
        { nom: "chapitre 2", quiz: [] },
        { nom: "chapitre 3", quiz: [] },
        { nom: "chapitre 4", quiz: [] }

      ]
    }
  ]
};

app.get('/api/semestres', (req, res) => {
  res.json(Object.keys(data));
});

app.get('/api/matieres/:semestre', (req, res) => {
  const semestre = req.params.semestre;
  if (data[semestre]) {
    res.json(data[semestre]);
  } else {
    res.status(404).json({ erreur: "Semestre introuvable" });
  }
});

app.get('/api/sousmatieres/:semestre/:matiere', (req, res) => {
  const { semestre, matiere } = req.params;
  if (!data[semestre]) {
    return res.status(404).json({ erreur: "Semestre introuvable" });
  }
  const matiereTrouvee = data[semestre].find(m => m.nom === matiere);
  if (!matiereTrouvee) {
    return res.status(404).json({ erreur: "Matiere introuvable" });
  }
  res.json(matiereTrouvee.sousMatieres);
});
app.post('/api/corriger', (req, res) => {
  const { reponsesUtilisateur, quiz } = req.body;

  if (!Array.isArray(reponsesUtilisateur) || !Array.isArray(quiz)) {
    return res.status(400).json({ erreur: "Donnees invalides" });
  }

  let bonnesReponses = 0;

  quiz.forEach((question, index) => {
    if (reponsesUtilisateur[index] === question.answer) {
      bonnesReponses++;
    }
  });

  const noteSur20 = (bonnesReponses / quiz.length) * 20;
  const noteArrondie = Math.round(noteSur20 * 100) / 100;

  let mention = "";
  let celebration = false;

  if (noteArrondie >= 18) {
    mention = "Excellent";
    celebration = true;
  } else if (noteArrondie >= 15) {
    mention = "Tres bien";
  } else if (noteArrondie >= 10) {
    mention = "Bien";
  } else {
    mention = "Peut mieux faire";
  }

  res.json({
    bonnesReponses: bonnesReponses,
    totalQuestions: quiz.length,
    note: noteArrondie,
    mention: mention,
    celebration: celebration
  });
});
// Route inscription
app.post('/api/inscription',
  [
    body('nom').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('motDePasse').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ erreur: errors.array() });

    const { nom, email, motDePasse } = req.body;
    const motDePasseChiffre = await bcrypt.hash(motDePasse, SALT_ROUNDS);

    try {
      const result = await pool.query(
        'INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES ($1, $2, $3) RETURNING id',
        [nom, email, motDePasseChiffre]
      );
      res.json({ message: "Compte cree avec succes", id: result.rows[0].id });
    } catch (err) {
      res.status(400).json({ erreur: "Cet email est deja utilise" });
    }
  }
);

// Route connexion
app.post('/api/connexion',
  [
    body('email').isEmail().normalizeEmail(),
    body('motDePasse').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ erreur: errors.array() });

    const { email, motDePasse } = req.body;

    const result = await pool.query(
      'SELECT * FROM utilisateurs WHERE email = $1',
      [email]
    );
    const utilisateur = result.rows[0];

    if (!utilisateur) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect" });
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.mot_de_passe);

    if (!motDePasseValide) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect" });
    }

  const token = jwt.sign(
    { id: utilisateur.id, nom: utilisateur.nom, aPaye: utilisateur.a_paye },
    SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: "Connexion reussie",
    token,
    nom: utilisateur.nom,
    aPaye: utilisateur.a_paye
  });
});

// Route sauvegarder score
app.post('/api/score',
  [
    body('token').notEmpty(),
    body('semestre').notEmpty(),
    body('matiere').notEmpty(),
    body('chapitre').notEmpty(),
    body('note').isFloat({ min: 0, max: 20 }),
    body('mention').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ erreur: errors.array() });

    const { token, semestre, matiere, chapitre, note, mention } = req.body;

    try {
      const decoded = jwt.verify(token, SECRET);
      await pool.query(
        'INSERT INTO scores (utilisateur_id, semestre, matiere, chapitre, note, mention) VALUES ($1, $2, $3, $4, $5, $6)',
        [decoded.id, semestre, matiere, chapitre, note, mention]
      );
      res.json({ message: "Score sauvegarde" });
    } catch (err) {
      res.status(401).json({ erreur: "Non autorise" });
    }
  }
);
app.get('/api/classement', async (req, res) => {
  const result = await pool.query(`
    SELECT 
      u.nom,
      u.id,
      ROUND(AVG(s.note)::numeric, 2) as moyenne,
      COUNT(s.id) as "nombreQuiz"
    FROM utilisateurs u
    JOIN scores s ON s.utilisateur_id = u.id
    GROUP BY u.id, u.nom
    HAVING COUNT(s.id) >= 1
    ORDER BY moyenne DESC
    LIMIT 10
  `);
  res.json(result.rows);
});

app.get('/api/meilleur', async (req, res) => {
  const result = await pool.query(`
    SELECT 
      u.nom,
      u.afficher_classement,
      ROUND(AVG(s.note)::numeric, 2) as moyenne,
      COUNT(s.id) as "nombreQuiz"
    FROM utilisateurs u
    JOIN scores s ON s.utilisateur_id = u.id
    GROUP BY u.id, u.nom, u.afficher_classement
    HAVING COUNT(s.id) >= 1
    ORDER BY moyenne DESC
    LIMIT 1
  `);
  res.json(result.rows[0] || null);
});

app.post('/api/classement/visibilite', async (req, res) => {
  const { token, afficher } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET);
    await pool.query(
      'UPDATE utilisateurs SET afficher_classement = $1 WHERE id = $2',
      [afficher ? 1 : 0, decoded.id]
    );
    res.json({ message: "Preference mise a jour" });
  } catch(e) {
    res.status(401).json({ erreur: "Non autorise" });
  }
});
app.listen(process.env.PORT || port, () => {
  console.log("Serveur demarre sur http://localhost:" + port);
});