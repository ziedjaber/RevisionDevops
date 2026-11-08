import { QuizQuestion } from "@/types/course";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    chapterId: 1,
    question: "Dans l'organisation logicielle traditionnelle avant DevOps, quel était l'objectif premier des administrateurs système (Ops) ?",
    options: [
      "La livraison rapide du maximum de nouvelles fonctionnalités",
      "La stabilité du système, le temps de disponibilité (uptime) et la réduction du MTTR",
      "L'écriture des tests unitaires et la réécriture du code legacy",
      "L'expérimentation de nouveaux frameworks web à chaque sprint",
    ],
    correctIndex: 1,
    explanation:
      "Les exploitants (Ops) sont évalués sur la disponibilité (uptime 99.9%), la stabilité de l'infrastructure et le MTTR (Mean Time To Recovery). Les développeurs sont évalués sur la vélocité et l'innovation, d'où le conflit historique.",
    referenceSlide: "Slide S3-S4",
  },
  {
    id: "q2",
    chapterId: 1,
    question: "Quelles sont les 4 étapes du cycle de vie d'un projet logiciel décrites dans le cours ?",
    options: [
      "Spécification, Implémentation, Débogage, Clôture",
      "Développement, Recette, Mise en production, Vie en production",
      "Architecture, Codage, Déploiement, Vente",
      "Planification, Chiffrage, Test unitaire, Archivage",
    ],
    correctIndex: 1,
    explanation:
      "Le schéma circulaire du cours (Slide S5) décompose le cycle en : 1. Développement, 2. Recette (QA/intégration), 3. Mise en production, 4. Vie en production (MCO et maintenance).",
    referenceSlide: "Slide S5",
  },
  {
    id: "q3",
    chapterId: 2,
    question: "Quelle est la principale caractéristique de la base de données dans une véritable architecture Microservices (MSA) ?",
    options: [
      "Une unique base de données SQL Server partagée entre tous les services via des clés étrangères",
      "Chaque microservice possède et gère exclusivement sa propre base de données (données fédérées)",
      "Toutes les données sont stockées dans la mémoire RAM sans persistance",
      "La base de données est directement administrée par les interfaces web des clients",
    ],
    correctIndex: 1,
    explanation:
      "En microservices, le principe cardinal est le découplage strict des données : 'Database per service'. Les services ne partagent jamais leur base de données et communiquent uniquement via leurs API (REST/gRPC).",
    referenceSlide: "Slide S25",
  },
  {
    id: "q4",
    chapterId: 2,
    question: "Dans l'évolution des architectures, quelle est la distinction majeure entre SOA et Microservices ?",
    options: [
      "La SOA utilise des conteneurs Docker, pas les microservices",
      "La SOA est à gros grain (coarse-grained) souvent centrée sur un bus ESB lourd ; les microservices sont à grain fin (fine-grained) et décentralisés",
      "La SOA est réservée aux applications mobiles, les microservices au desktop",
      "Les microservices imposent un unique langage de programmation pour toute l'entreprise",
    ],
    correctIndex: 1,
    explanation:
      "La SOA (Slide S23) propose des services à gros grain (coarse-grained) souvent dépendants d'un ESB. Les microservices sont à grain très fin (fine-grained), indépendants, avec équipes autonomes.",
    referenceSlide: "Slide S23",
  },
  {
    id: "q5",
    chapterId: 3,
    question: "Que signifie le caractère 'Stateless' (sans état) dans l'architecture REST ?",
    options: [
      "Le serveur ne répond qu'une seule fois puis s'éteint",
      "Chaque requête client doit contenir toutes les informations nécessaires à son traitement sans dépendre d'une session stockée sur le serveur",
      "La base de données ne contient aucune table relationnelle",
      "Le code JavaScript s'exécute sans variables d'état",
    ],
    correctIndex: 1,
    explanation:
      "En REST, 'Stateless' signifie que le serveur ne conserve aucun contexte de session entre les requêtes. Chaque requête est autonome, ce qui facilite grandement la scalabilité horizontale.",
    referenceSlide: "Slide S28",
  },
  {
    id: "q6",
    chapterId: 3,
    question: "Quelle méthode HTTP correspond rigoureusement à l'opération CRUD 'Create' avec création d'une nouvelle ressource ?",
    options: ["GET", "PUT", "POST", "PATCH"],
    correctIndex: 2,
    explanation:
      "POST est la méthode standard utilisée pour créer une nouvelle ressource dans une collection. Le serveur répond généralement avec le code '201 Created' et l'URI de la ressource créée dans l'en-tête Location.",
    referenceSlide: "Slide S33",
  },
  {
    id: "q7",
    chapterId: 4,
    question: "Quelle est la taille maximale d'une équipe préconisée par la règle de la « Two-Pizza Team » ?",
    options: [
      "2 à 3 personnes",
      "6 à 10 personnes au maximum",
      "25 à 30 personnes",
      "Plus de 50 personnes pour couvrir tous les métiers",
    ],
    correctIndex: 1,
    explanation:
      "La règle de la 'Two-Pizza Team' (Slide S37) stipule qu'une équipe ne doit jamais dépasser le nombre de personnes que deux pizzas peuvent rassasier (soit 6 à 10 individus), pour maximiser l'agilité et réduire les coûts de communication.",
    referenceSlide: "Slide S37",
  },
  {
    id: "q8",
    chapterId: 5,
    question: "Que signifie l'acronyme CAMS, pilier du 'mindset' DevOps ?",
    options: [
      "Code, Architecture, Monitoring, Security",
      "Culture, Automation, Measurement, Sharing",
      "Continuous, Agile, Modular, Scalable",
      "Compute, API, Microservices, Storage",
    ],
    correctIndex: 1,
    explanation:
      "CAMS (Slide S39) désigne les 4 fondations de DevOps : Culture (collaboration sans blâme), Automation (tout scripter), Measurement (métriques & observabilité) et Sharing (partage du savoir et du code).",
    referenceSlide: "Slide S39",
  },
  {
    id: "q9",
    chapterId: 5,
    question: "Quelle est la différence fondamentale entre la Livraison Continue (Continuous Delivery) et le Déploiement Continu (Continuous Deployment) ?",
    options: [
      "La livraison continue ne teste pas le code",
      "En livraison continue, le déploiement en production nécessite une validation humaine (bouton manuel) ; en déploiement continu, il est 100% automatique",
      "Le déploiement continu s'applique uniquement aux bases de données",
      "Il n'y a aucune différence, ce sont deux termes strictement synonymes",
    ],
    correctIndex: 1,
    explanation:
      "En Continuous Delivery, le livrable est prêt à être déployé à tout moment mais un être humain appuie sur le bouton. En Continuous Deployment, tout commit vert passe directement en production sans validation humaine.",
    referenceSlide: "Slide S41",
  },
  {
    id: "q10",
    chapterId: 6,
    question: "Comment Git stocke-t-il les différentes versions d'un projet ?",
    options: [
      "Sous forme de simples fichiers deltas (différences de lignes par rapport à la version précédente)",
      "Sous forme d'instantanés complets (snapshots) avec hachage cryptographique SHA-1",
      "Par envoi direct sur un serveur FTP centralisé",
      "En compressant tout le disque dur dans une archive zip à chaque sauvegarde",
    ],
    correctIndex: 1,
    explanation:
      "Contrairement à CVS ou Subversion qui stockent des deltas, Git fonctionne par 'snapshots' (instantanés complets). Les fichiers inchangés sont simplement référencés par un pointeur.",
    referenceSlide: "Slide S57",
  },
  {
    id: "q11",
    chapterId: 6,
    question: "Quelles sont les trois zones locales fondamentales de Git ?",
    options: [
      "Client, Serveur, Cloud",
      "Working Directory, Staging Area (Index), Local Repository",
      "Cache, Mémoire vive, Disque dur",
      "Trunk, Branches, Tags",
    ],
    correctIndex: 1,
    explanation:
      "Les 3 zones locales sont : 1. Working Directory (espace de travail), 2. Staging Area / Index (zone de préparation du prochain commit), 3. Local Repository (historique validé dans .git).",
    referenceSlide: "Slide S60-S63",
  },
  {
    id: "q12",
    chapterId: 6,
    question: "Qu'est-ce qu'une fusion de type 'Fast-Forward' dans Git ?",
    options: [
      "Une fusion qui supprime automatiquement tous les conflits sans avertissement",
      "Un simple déplacement vers l'avant du pointeur de branche, car la branche courante est un ancêtre direct de la branche à intégrer",
      "Une fusion accélérée par un algorithme d'intelligence artificielle",
      "Une fusion nécessitant obligatoirement deux parents",
    ],
    correctIndex: 1,
    explanation:
      "Le Fast-Forward (Slide S81) intervient lorsqu'il n'y a pas eu de divergence entre les deux branches. Git n'a pas besoin de créer de commit de fusion : il avance simplement le pointeur de la branche.",
    referenceSlide: "Slide S81",
  },
  {
    id: "q13",
    chapterId: 6,
    question: "Quelle est la règle d'or absolue concernant l'utilisation de 'git rebase' ?",
    options: [
      "Toujours rebaser sur la branche de production en plein après-midi",
      "« No one shall rebase a shared branch » : Ne jamais réécrire l'historique d'une branche publique partagée avec d'autres",
      "Ne faire de rebase que sur des dépôts de plus de 10 000 commits",
      "Le rebase ne fonctionne qu'avec des fichiers en langage C",
    ],
    correctIndex: 1,
    explanation:
      "Règle d'or (Slide S85) : Le rebase réécrit les identifiants SHA-1 des commits. Si d'autres personnes ont cloné et basé leur travail sur cette branche, leur historique divergera de manière chaotique.",
    referenceSlide: "Slide S85",
  },
  {
    id: "q14",
    chapterId: 6,
    question: "Que se passe-t-il si vous commitez alors que vous vous trouvez en état 'detached HEAD' (HEAD détachée) ?",
    options: [
      "Git refuse d'enregistrer le commit et formate le répertoire",
      "Le commit est créé, mais il n'est rattaché à aucune branche ; si vous changez de branche, il deviendra orphelin",
      "Le commit est automatiquement poussé sur GitHub",
      "Le commit est fusionné directement dans la branche main",
    ],
    correctIndex: 1,
    explanation:
      "En 'detached HEAD' (Slide S75), HEAD pointe directement sur un hash de commit. Les nouveaux commits n'ont pas d'étiquette de branche pour les retenir. Il faut faire 'git switch -c <nouvelle-branche>' pour les conserver.",
    referenceSlide: "Slide S75",
  },
  {
    id: "q15",
    chapterId: 6,
    question: "Dans le modèle Git Flow, de quelle branche naissent obligatoirement les branches de 'hotfix' ?",
    options: [
      "De la branche develop",
      "De la branche main (production)",
      "De n'importe quelle branche feature en cours",
      "Du tag v0.0.1",
    ],
    correctIndex: 1,
    explanation:
      "Dans Git Flow (Slide S108), les branches hotfix partent toujours de 'main' pour corriger une urgence de production, puis sont fusionnées à la fois dans 'main' ET dans 'develop'.",
    referenceSlide: "Slide S108",
  },
  {
    id: "q16",
    chapterId: 7,
    question: "Dans l'infrastructure GitLab CI, quel composant est chargé d'exécuter concrètement les scripts de build et de test ?",
    options: [
      "L'interface graphique du navigateur web de l'utilisateur",
      "Les GitLab Runners (agents autonomes connectés au serveur GitLab)",
      "Le serveur DNS du fournisseur d'accès",
      "Le registre Docker Hub exclusivement",
    ],
    correctIndex: 1,
    explanation:
      "GitLab CI (Slide S155-S156) sépare le coordinateur central des 'GitLab Runners' : ce sont ces agents qui exécutent les commandes 'script:' dans des conteneurs dédiés.",
    referenceSlide: "Slide S156",
  },
  {
    id: "q17",
    chapterId: 7,
    question: "Dans un fichier .gitlab-ci.yml, quelle est la différence essentielle entre 'cache' et 'artifacts' ?",
    options: [
      "Il n'y a aucune différence technique",
      "'cache' conserve des fichiers (ex: node_modules) entre différents builds pour accélérer l'exécution ; 'artifacts' transmet des fichiers compilés d'un job à un autre au sein d'une même pipeline",
      "'artifacts' ne fonctionne qu'avec des images PNG",
      "'cache' envoie les fichiers par email au développeur",
    ],
    correctIndex: 1,
    explanation:
      "Le cache est optimiste et sert à réutiliser des dépendances (vendor, node_modules) entre des pipelines successives. Les artefacts sont garantis et transmettent les livrables (dist/, .war) entre jobs d'une même exécution.",
    referenceSlide: "Slide S160-S167",
  },
  {
    id: "q18",
    chapterId: 8,
    question: "Quelle est la différence fondamentale d'architecture entre un conteneur Docker et une Machine Virtuelle (VM) ?",
    options: [
      "Une VM est plus rapide et démarre en moins d'une seconde",
      "Les conteneurs partagent le noyau unique du système d'exploitation hôte ; les VM embarquent chacune un système d'exploitation invité (Guest OS) complet au-dessus d'un hyperviseur",
      "Docker nécessite l'installation de Windows Server sur chaque conteneur",
      "Les conteneurs ne peuvent pas exécuter de code compilé",
    ],
    correctIndex: 1,
    explanation:
      "Architecture Docker (Slide S176) : pas de Guest OS ni d'hyperviseur lourd. Tous les conteneurs partagent le noyau Linux hôte via cgroups et namespaces, ce qui confère une légèreté et une vélocité maximales.",
    referenceSlide: "Slide S176",
  },
  {
    id: "q19",
    chapterId: 8,
    question: "À quoi sert l'indicateur '-p 8080:80' dans la commande 'docker run -p 8080:80 nginx' ?",
    options: [
      "À limiter la consommation mémoire à 80 Mo",
      "À mapper le port 8080 de la machine hôte vers le port 80 exposé par le conteneur",
      "À créer 8080 conteneurs simultanés",
      "À définir le mot de passe administrateur",
    ],
    correctIndex: 1,
    explanation:
      "Port Mapping (Slide S203) : -p portHôte:portConteneur permet d'accéder au service interne du conteneur (ex: port 80) depuis le monde extérieur en tapant localhost:8080.",
    referenceSlide: "Slide S203",
  },
  {
    id: "q20",
    chapterId: 8,
    question: "Dans Docker Compose, comment fonctionne la découverte de service (Service Discovery) intégrée ?",
    options: [
      "Il faut saisir manuellement l'adresse IP de chaque conteneur dans un fichier texte",
      "Un serveur DNS interne résout automatiquement le nom du service (ex: 'database' ou 'cache') en l'adresse IP du conteneur correspondant",
      "Les services communiquent par signaux infrarouges",
      "Seul le port 80 peut être découvert automatiquement",
    ],
    correctIndex: 1,
    explanation:
      "Service Discovery (Slide S214-S216) : Docker Compose intègre un résolveur DNS embarqué. Tout service peut contacter un autre service par son simple nom déclaré dans le docker-compose.yml (ex: http://database:5432).",
    referenceSlide: "Slide S214",
  },
];
