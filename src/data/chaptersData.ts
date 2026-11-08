import { Chapter } from "@/types/course";

export const chaptersData: Chapter[] = [
  {
    id: 1,
    slug: "contexte-avant-devops",
    title: "Le Contexte & Origines de DevOps",
    shortTitle: "1. Origines DevOps",
    slidesRef: "Slides S2 à S7",
    iconName: "History",
    estimatedTime: "15 min",
    objectives: [
      "Comprendre le conflit historique d'intérêts entre Développeurs (Dev) et Administrateurs Système (Ops).",
      "Identifier les 4 étapes fondamentales du cycle de vie logiciel (Développement, Recette, Mise en production, Vie en production).",
      "Comprendre le triangle du développement logiciel moderne (Nouvelle Technologie, Nouvelles Méthodes, Nouvelle Culture).",
      "Mesurer l'impact de l'absence de collaboration (« Chez moi ça marche ! »).",
    ],
    summary:
      "Avant DevOps, les développeurs cherchaient la vélocité et l'innovation, tandis que les exploitants système exigeaient la stabilité (uptime, MTTR). Cette scission causait des retards, des déploiements nocturnes risqués et une dilution des responsabilités. DevOps réconcilie ces deux mondes par l'automatisation et la culture partagée.",
    sections: [
      {
        id: "conflit-dev-ops",
        title: "Deux populations aux objectifs historiquement opposés",
        badge: "Le Mur de la Confusion",
        content: `Dans l'organisation traditionnelle, deux équipes collaborent avec des priorités antinomiques :
- **Analystes / Développeurs :** Évalués sur le volume de fonctionnalités livrées, la vélocité et l'adoption rapide de nouvelles technologies. Leur crédo : le changement.
- **Administrateurs Système (Ops) :** Évalués sur la haute disponibilité (99.99% d'uptime), la scalabilité, la vitesse de réparation (MTTR - Mean Time To Recovery) et la limitation stricte des risques. Leur crédo : la stabilité.

Ce fossé organisationnel engendre le célèbre syndrome **« Chez moi ça marche ! »** (*It works on my machine*) : le développeur livre un livrable sans se soucier de son comportement en production, tandis que l'exploitant refuse ou retarde les déploiements de peur d'une panne.`,
        keyPoints: [
          "Dev = Vélocité et nouveautés fonctionnelles",
          "Ops = Stabilité, métriques de panne (MTTR), SLA et uptime",
          "Conséquence = Frustration mutuelle, déploiements longs et risqués",
        ],
        callout: {
          type: "warning",
          title: "Le Mur de la Confusion (Wall of Confusion)",
          text: "Quand le code traverse la frontière Dev -> Ops sans tests automatisés ni reproductibilité d'environnement, chaque déploiement devient une roulette russe opérationnelle.",
        },
      },
      {
        id: "cycle-de-vie",
        title: "Le Cycle de vie d'un projet logiciel (Schéma circulaire)",
        badge: "Processus",
        content: `Le cours modélise le cycle de vie logiciel en 4 phases continues :
1. **Développement :** Conception, codage des fonctionnalités métier, écriture des premiers tests unitaires.
2. **Recette (QA / Staging) :** Intégration des contributions, tests d'acceptation, vérification de conformité et détection précoce des anomalies.
3. **Mise en production :** Déploiement physique ou cloud, vérification des contraintes non fonctionnelles (temps de réponse, charge, tolérance aux pannes).
4. **Vie en production :** Monitoring applicatif, astreinte, détection des régressions, maintenance corrective et évolutive.`,
        keyPoints: [
          "DevOps compresse les boucles de rétroaction entre ces 4 phases.",
          "Sans automatisation, la phase de Recette et de Mise en production constitue un goulot d'étranglement majeur.",
        ],
      },
      {
        id: "triangle-moderne",
        title: "Le Triangle du Développement Logiciel Moderne (Slide S7)",
        badge: "Piliers",
        content: `Le succès d'un projet technologique contemporain repose sur l'équilibre parfait de trois piliers interdépendants :
1. **Nouvelles Technologies :** Adopter les architectures Microservices, les conteneurs (Docker) et l'écosystème Open Source.
2. **Nouvelles Méthodes :** Pratiques Agiles (Scrum/Kanban), intégration continue (CI), conception orientée utilisateur et automatisation exhaustive.
3. **Nouvelle Culture :** Responsabilisation de bout en bout (*You build it, you run it*), autonomie des équipes et transparence.`,
        codeSnippets: [
          {
            title: "Indicateurs clés avant vs après DevOps",
            language: "markdown",
            code: `| Métrique                     | Vision Traditionnelle | Pratique DevOps   |
|------------------------------|-----------------------|-------------------|
| MTTR (Mean Time To Recovery) | ~29 heures            | ~7 heures         |
| Fréquence de déploiement     | Tous les 3 à 6 mois   | Plusieurs fois/jour|
| Effort d'automatisation test | 0 %                   | 10 % de l'effort  |
| Effort d'auto déploiement    | 0 %                   | 10 % de l'effort  |
| Effort codage pur            | 60 %                  | 45 % (plus pérenne)|`,
            explanation: "Les chiffres du cours démontrent un gain spectaculaire de résilience et de disponibilité.",
          },
        ],
      },
    ],
    takeaways: [
      "DevOps est né pour abattre le mur entre développeurs (désir de changement) et exploitants (désir de stabilité).",
      "Le cycle en 4 phases (Dev -> Recette -> Déploiement -> MCO) doit être fluidifié par l'automatisation.",
      "Le triangle moderne réunit Technologie (Microservices/Docker), Méthode (Agilité/CI-CD) et Culture (Responsabilité).",
    ],
    quickCheatsheet: [
      { cmd: "MTTR", desc: "Mean Time To Recovery : durée moyenne pour restaurer un service après panne" },
      { cmd: "Wall of Confusion", desc: "Frontière hermétique et inefficace entre les équipes de Dev et d'Ops" },
      { cmd: "CAMS", desc: "Piliers DevOps : Culture, Automation, Measurement, Sharing" },
    ],
  },
  {
    id: 2,
    slug: "evolution-des-architectures",
    title: "L'Évolution des Architectures Logicielles",
    shortTitle: "2. Évolution Architectures",
    slidesRef: "Slides S8 à S25",
    iconName: "Layers",
    estimatedTime: "25 min",
    diagramType: "architecture",
    objectives: [
      "Comprendre les limitations physiques et organisationnelles du Monolithe.",
      "Maîtriser les architectures Client/Serveur 2-Tier, 3-Tier et Multi-Tier.",
      "Distinguer l'approche SOA (Services à gros grain) des Microservices (Services à grain fin).",
      "Appréhender les concepts Cloud-Native, la scalabilité indépendante et le découplage des bases de données.",
    ],
    summary:
      "De l'application monolithique empaquetée dans un unique fichier WAR jusqu'aux microservices polyglottes conteneurisés, chaque évolution architecturale répond à un impératif de passage à l'échelle, de résilience et d'innovation continue.",
    sections: [
      {
        id: "le-monolithe",
        title: "2.1 L'Architecture Monolithique",
        badge: "Origine",
        content: `Un monolithe rassemble l'ensemble des fonctionnalités et couches applicatives dans un code source unique :
- **Compilation unique :** Génère un livrable volumineux unique (ex: un gros fichier .war ou .ear Java sous Tomcat/JBoss).
- **Infrastructure unifiée :** Une seule pile technologique imposée (Linux, JVM, dépendances globales).
- **Problèmes inhérents :** 
  - Tout bug mineur dans un composant (ex: génération de facture) peut faire tomber toute la plateforme.
  - Pour scaler un point chaud, il faut dupliquer l'intégralité du monolithe avec toutes ses ressources.
  - Déploiement tout-ou-rien nécessitant des fenêtres de maintenance nocturnes.`,
        keyPoints: [
          "Code unique intégrant toutes les couches (IHM, métier, données)",
          "Déploiement monobloc risqué et lourd",
          "Scalabilité inefficace par duplication globale",
        ],
      },
      {
        id: "architectures-en-tiers",
        title: "2.2 Architectures en Tiers (2-Tier, 3-Tier, Multi-Tier)",
        badge: "Découpage",
        content: `Pour sortir du monolithe compact, les architectures ont séparé les couches :
- **IHM (Présentation) :** Interaction directe utilisateur (UI).
- **Logique métier (Application) :** Règles fonctionnelles et calculs.
- **Gestion des données (Persistance) :** Stockage SGBD et stockage fichiers.

**Évolution :**
- **2-Tier (Client Lourd) :** L'IHM et la logique applicative résident sur le poste client (Niveau 1), qui interroge directement la base de données SQL (Niveau 2). Faible sécurité, logique métier dupliquée sur chaque client.
- **3-Tier :** IHM légère (Niveau 1) -> Serveur d'applications HTTP/RPC/ORB (Niveau 2) -> SGBDR central (Niveau 3).
- **Multi-Tier moderne :** Client -> WAF -> Load Balancer (DMZ) -> Web Tier -> Middle Tier (Messagerie MOM, Cache Redis) -> Data Tier (Clusters SQL / NoSQL).`,
        keyPoints: [
          "Découplage des interfaces et de la persistance",
          "Introduction des Load Balancers et de la DMZ pour la haute disponibilité",
        ],
      },
      {
        id: "soa-vs-microservices",
        title: "2.3 Web Services, SOA et l'avènement des Microservices",
        badge: "Révolution Microservices",
        content: `**Web Services & SOA (Service Oriented Architecture) :**
- Un service est un composant fonctionnel réutilisable exposé via un contrat standardisé (WSDL, SOAP, XML-RPC).
- Modèle à 3 acteurs : le Consommateur (*Consumer*), le Fournisseur (*Provider*) et le Registre d'annuaire (*Service Registry*).
- Limite de la SOA : services à gros grain (*coarse-grained*), couplage fort avec l'Enterprise Service Bus (ESB) central qui devenait un goulet d'étranglement.

**L'Architecture Microservices (MSA) :**
- L'application est un écosystème de petits services indépendants à grain fin (*fine-grained*), chacun dédié à une capacité métier unique (*Single Business Capability*).
- **Données fédérées :** Chaque microservice gère sa propre base de données. Pas de base de données partagée !
- **Communication sans état (Stateless) :** Échanges via des API légères (REST/JSON, gRPC).
- **Déploiement totalement autonome :** Une mise à jour du service Catalogue n'interrompt ni le Panier ni le Paiement.`,
        codeSnippets: [
          {
            title: "Comparatif Synthétique Monolithe vs SOA vs Microservices",
            language: "markdown",
            code: `| Critère          | Monolithe           | SOA (Service-Oriented) | Microservices (MSA)       |
|------------------|---------------------|------------------------|---------------------------|
| Granularité      | Unité unique        | Gros grain (coarse)    | Grain très fin (fine)     |
| Base de données  | Base unique partagée| Base partagée / siloée | Base dédiée par service   |
| Communication    | Appels de fonctions | ESB lourd (SOAP/XML)   | REST léger, JSON, gRPC    |
| Déploiement      | Monobloc tout-ou-rien| Par sous-système       | Totalement indépendant    |
| Résilience       | Point unique de panne| Dépendance forte à l'ESB| Isolation stricte des pannes|`,
          },
        ],
      },
    ],
    takeaways: [
      "Le monolithe souffre de déploiements lourds et de scalabilité inefficace.",
      "Le 3-Tier et le Multi-Tier séparent IHM, logique métier et base de données.",
      "La SOA a introduit les services réutilisables mais restait freinée par des bus ESB lourds.",
      "Les Microservices découpent le système en petites unités autonomes, avec base de données dédiée et déploiement indépendant.",
    ],
    quickCheatsheet: [
      { cmd: "Fine-grained", desc: "Grain fin propre aux microservices : une responsabilité métier unique" },
      { cmd: "Database per service", desc: "Chaque microservice est seul maître de ses données et de son schéma" },
      { cmd: "Cloud-Native", desc: "Conçu nativement pour le cloud : résilience, scalabilité horizontale, conteneurisation" },
    ],
  },
  {
    id: 3,
    slug: "api-rest-json-crud",
    title: "API REST, JSON et Opérations CRUD",
    shortTitle: "3. REST, JSON & CRUD",
    slidesRef: "Slides S26 à S34",
    iconName: "Network",
    estimatedTime: "20 min",
    objectives: [
      "Maîtriser les 6 principes architecturaux de REST (Roy Fielding).",
      "Associer rigoureusement les verbes HTTP (GET, POST, PUT, PATCH, DELETE) aux opérations CRUD.",
      "Comprendre le format JSON comme vecteur standard de communication inter-services.",
      "Savoir modéliser des endpoints orientés ressources et respecter le caractère 'Stateless'.",
    ],
    summary:
      "Dans une architecture microservices, les composants communiquent via le protocole standard HTTP. L'architecture REST structure les échanges autour de ressources identifiées par URI, manipulées par des verbes standards avec des charges utiles JSON.",
    sections: [
      {
        id: "principes-rest",
        title: "REST (Representational State Transfer)",
        badge: "Architecture",
        content: `REST est un style architectural formalisé en 2000 par Roy Fielding pour les systèmes distribués hypermédia :
1. **Client-Serveur :** Séparation stricte de l'interface utilisateur et du stockage/traitement des données.
2. **Sans état (Stateless) :** Chaque requête client doit contenir toutes les informations nécessaires à son traitement. Le serveur ne conserve aucune session utilisateur entre deux requêtes.
3. **Mise en cache (Cacheable) :** Les réponses doivent explicitement indiquer si elles peuvent être mises en cache par le client ou les proxies intermédiaires.
4. **Interface uniforme :** Identification des ressources via des URI (ex: \`/api/v1/users\`), manipulation par des représentations (JSON), messages auto-descriptifs.
5. **Système en couches (Layered System) :** Le client ne peut pas savoir s'il est connecté directement au serveur final ou à un intermédiaire (passerelle, proxy, load balancer).
6. **Code à la demande (optionnel) :** Le serveur peut étendre les capacités du client en envoyant du code exécutable (ex: scripts JS).`,
        callout: {
          type: "note",
          title: "Clin d'œil du cours (Slide S30)",
          text: "« How to insult a developer: Your API is NOT RESTful! » — Une véritable API REST respecte la sémantique HTTP et ne confond jamais GET et POST.",
        },
      },
      {
        id: "verbes-crud-json",
        title: "Mapping Verbes HTTP, Opérations CRUD & Format JSON",
        badge: "Pratique",
        content: `Une ressource REST s'exprime sous forme de nom pluriel (\`/cars\`, \`/orders\`) et les actions s'expriment exclusivement via le verbe HTTP.`,
        codeSnippets: [
          {
            title: "Tableau de correspondance CRUD vs Verbes HTTP",
            language: "markdown",
            code: `| Opération CRUD | Verbe HTTP | URI d'exemple         | Statut HTTP standard        |
|----------------|------------|-----------------------|-----------------------------|
| Create         | POST       | POST /api/v1/cars     | 201 Created (+ Header Location)|
| Read (Liste)   | GET        | GET /api/v1/cars      | 200 OK                      |
| Read (Détail)  | GET        | GET /api/v1/cars/42   | 200 OK ou 404 Not Found     |
| Update (Complet)| PUT       | PUT /api/v1/cars/42   | 200 OK ou 204 No Content    |
| Update (Partiel)| PATCH     | PATCH /api/v1/cars/42 | 200 OK                      |
| Delete         | DELETE     | DELETE /api/v1/cars/42| 204 No Content ou 200 OK    |`,
          },
          {
            title: "Exemple de Payload JSON (Slide S32 - Flotte de véhicules)",
            language: "json",
            code: `{
  "voitures": [
    {
      "marque": "Peugeot",
      "couleur": "Bleue",
      "immatriculation": 2008,
      "revisions": [2012, 2014]
    },
    {
      "marque": "Citroën",
      "couleur": "Blanche",
      "immatriculation": 1999,
      "revisions": [2003, 2005, 2007, 2009, 2011, 2013]
    }
  ]
}`,
            explanation: "JSON est lisible par l'homme, typé, compact et universellement supporté par tous les langages.",
          },
        ],
      },
    ],
    takeaways: [
      "REST s'appuie sur HTTP : les URI représentent les ressources (noms), les verbes HTTP représentent les actions.",
      "Le principe 'Stateless' garantit que chaque requête est autonome et facilite la scalabilité horizontale.",
      "POST = Create, GET = Read, PUT/PATCH = Update, DELETE = Delete.",
      "JSON est le format universel d'échange de données structurées pour les API web.",
    ],
    quickCheatsheet: [
      { cmd: "GET /resources", desc: "Récupérer la collection complète" },
      { cmd: "POST /resources", desc: "Créer une nouvelle entité" },
      { cmd: "PUT /resources/:id", desc: "Remplacement complet de l'entité" },
      { cmd: "PATCH /resources/:id", desc: "Modification partielle d'un champ" },
      { cmd: "DELETE /resources/:id", desc: "Suppression de l'entité" },
    ],
  },
  {
    id: 4,
    slug: "concepts-des-microservices",
    title: "Les Concepts Clés des Microservices",
    shortTitle: "4. Concepts Microservices",
    slidesRef: "Slides S35 à S38",
    iconName: "Boxes",
    estimatedTime: "20 min",
    objectives: [
      "Comprendre la règle de la « Two-Pizza Team » formulée par Jeff Bezos.",
      "Comprendre le polyglotisme technologique (choisir le bon outil pour la bonne tâche).",
      "Maîtriser l'indépendance de déploiement et la réduction des risques opérationnels.",
      "Analyser un cas d'étude réel : Application de VTC / Transport (Slide S37).",
    ],
    summary:
      "Les microservices ne sont pas seulement un choix technique, c'est une transformation organisationnelle. Les petites équipes autonomes possèdent leurs services de bout en bout et déploient à leur propre rythme.",
    sections: [
      {
        id: "proprietes-fondamentales",
        title: "Les 6 propriétés fondamentales d'un bon microservice",
        badge: "Piliers",
        content: `1. **Spécialisation :** Une fonction unique et bien délimitée (*Single Responsibility Principle* à l'échelle architecturale).
2. **Indépendance technologique (Polyglotisme) :** Liberté totale de choisir le langage et la base de données les plus adaptés à chaque composant.
3. **Petites équipes :** Équipes réduites à taille humaine (maximum 8 à 10 personnes).
4. **Déploiement autonome :** Possibilité de mettre à jour et de livrer un service en production sans synchronisation avec les autres équipes.
5. **Évolutivité (Scalabilité fine) :** Allocation de ressources processeur et mémoire uniquement aux microservices soumis à de fortes charges.
6. **Facilité de test :** Surface d'attaque et périmètre de régression circonscrits à un module précis.`,
        keyPoints: [
          "Scalabilité granulaire : ne payez des serveurs que pour les microservices sollicités",
          "Isolation des pannes : un crash du service recommandation n'empêche pas l'utilisateur de payer",
        ],
      },
      {
        id: "two-pizza-polyglot",
        title: "La « Two-Pizza Team » & Polyglotisme (Étude de cas Transport - S37)",
        badge: "Organisation",
        content: `Selon Jeff Bezos (Amazon), une équipe ne doit jamais dépasser le nombre d'individus pouvant être nourris avec deux pizzas (6 à 10 personnes). Moins d'intermédiaires, moins de réunions, décisions instantanées.

**Cas d'étude du cours : Plateforme de Transport & VTC :**
- **Service Paiement :** Développé en **Scala / Play Framework** (exigences de calcul asynchrone, typage fort et concurrence élevée).
- **Service Facturation :** Conçu en **Node.js / Express** (manipulation I/O rapide et génération PDF).
- **Service Notification :** Réalisé en **Python / Flask** (intégration simple des API SMS Twilio, emails SMTP, push WebSockets).
- **Service Passager & Géolocalisation :** Développé sur **Vert.x** (réactivité temps réel non-bloquante).
- **Service Conducteur & Flotte :** Implémenté en **Java EE / Spring Boot** (gestion des règles métier lourdes et transactions relationnelles).
- **Front-end Web & Mobile :** Développé en **Angular / React** appelant les passerelles API.`,
        codeSnippets: [
          {
            title: "Bénéfices du Déploiement Ciblé (Slide S38)",
            language: "markdown",
            code: `- Mise à jour d'un microservice sans redéployer le reste du système.
- Un livrable unifié issu d'un seul dépôt Git dédié.
- Suppression des comités de mise en production inter-équipes.
- Fréquence de livraison multipliée par 10 : du mensuel au bi-quotidien.
- Risques de régression massive éliminés.`,
          },
        ],
      },
    ],
    takeaways: [
      "Une 'Two-Pizza Team' (6 à 10 personnes) possède le cycle de vie complet de son microservice.",
      "Le polyglotisme permet de marier Scala, Node.js, Python et Java selon le besoin exact.",
      "Le déploiement autonome évite les goulots d'étranglement et réduit le risque opérationnel.",
    ],
    quickCheatsheet: [
      { cmd: "Two-Pizza Team", desc: "Taille d'équipe optimale (6-10 personnes) pour minimiser le coût de communication" },
      { cmd: "Polyglot Architecture", desc: "Utilisation de différents langages/bases adaptés aux contraintes spécifiques de chaque service" },
      { cmd: "Blast Radius", desc: "Rayon d'impact : circonscrire l'effet d'une panne à un unique microservice isolé" },
    ],
  },
  {
    id: 5,
    slug: "culture-devops-cams",
    title: "Culture DevOps & Automatisation CI/CD",
    shortTitle: "5. Culture DevOps & CAMS",
    slidesRef: "Slides S39 à S46",
    iconName: "Infinity",
    estimatedTime: "25 min",
    diagramType: "cams",
    objectives: [
      "Maîtriser le modèle CAMS (Culture, Automation, Measurement, Sharing).",
      "Comprendre la boucle infinie DevOps (Plan, Create, Verify, Package, Release, Configure, Monitor).",
      "Distinguer rigoureusement Intégration Continue (CI), Livraison Continue (CDelivery) et Déploiement Continu (CDeployment).",
      "Comprendre les enjeux de maintenance : 5% de projets neufs vs 95% d'évolution de systèmes existants.",
    ],
    summary:
      "DevOps n'est pas un titre de poste ni un simple outil, c'est une culture de collaboration symbiotique unifiée par l'automatisation. Les 3 stades de maturité (CI -> CDelivery -> CDeployment) garantissent un flux continu du commit jusqu'à la production.",
    sections: [
      {
        id: "modele-cams",
        title: "Le Mindset CAMS (Culture, Automation, Measurement, Sharing)",
        badge: "Fondation",
        content: `Pour réussir la transition DevOps, quatre piliers interdépendants sont indispensables :
- **Culture :** Rapprochement humain des équipes, fin des silos étanches, responsabilité partagée (*No Blame Culture*).
- **Automation :** « *Automate all the things!* » — Tout ce qui est exécuté plus d'une fois doit être scripté et automatisé (builds, tests, provisionnement, déploiement).
- **Measurement :** « *Ce qui ne peut être mesuré n'existe pas.* » — Collecte continue de métriques système (CPU, RAM, latence) et métier (taux de conversion, fréquence de commit, MTTR).
- **Sharing :** Partage des connaissances, de la documentation, du code source et des retours d'expérience post-incident (*Post-mortem*).`,
        keyPoints: [
          "Boucle infinie DevOps : Plan -> Create -> Verify -> Package -> Release -> Configure -> Monitor -> Plan...",
          "L'industrie logicielle compte 5% de projets 'from scratch' et 95% de maintenance et évolution !",
        ],
      },
      {
        id: "les-trois-niveaux-automatisation",
        title: "Les 3 Niveaux d'Automatisation (CI, CDelivery, CDeployment)",
        badge: "Pipeline",
        content: `La progression de l'automatisation se décline en 3 paliers progressifs :
1. **Intégration Continue (CI) :** À chaque commit poussé, un serveur d'automatisation compile le code, exécute les tests unitaires et d'intégration et valide la qualité du code.
2. **Livraison Continue (CDelivery) :** Le code validé par la CI est automatiquement empaqueté et déployé sur les environnements de test / recette (Staging). Le déploiement final en production reste soumis à une validation humaine (bouton « Déployer en Production »).
3. **Déploiement Continu (CDeployment) :** Dès qu'un commit franchit avec succès toutes les étapes de la pipeline de tests, il est déployé immédiatement en production sans aucune intervention humaine.`,
        codeSnippets: [
          {
            title: "Comparatif des 3 Paliers d'Automatisation",
            language: "markdown",
            code: `| Palier                     | Tests Automatisés | Staging Automatisé | Production Automatisée |
|----------------------------|-------------------|--------------------|------------------------|
| Intégration Continue (CI)  | ✅ Oui            | ❌ Manuel          | ❌ Manuel              |
| Livraison Continue (CDel.) | ✅ Oui            | ✅ Oui             | 👆 Validation Humaine  |
| Déploiement Continu (CDep.)| ✅ Oui            | ✅ Oui             | 🚀 100% Automatique    |`,
          },
        ],
      },
    ],
    takeaways: [
      "CAMS résume la philosophie DevOps : Culture, Automatisation, Mesure et Partage.",
      "CI = tests automatiques à chaque commit.",
      "Livraison Continue = paquet prêt pour la prod, déploiement déclenché manuellement.",
      "Déploiement Continu = du commit à la production de manière 100% automatisée.",
    ],
    quickCheatsheet: [
      { cmd: "CI", desc: "Continuous Integration : build et tests automatisés à chaque push" },
      { cmd: "CDelivery", desc: "Continuous Delivery : livrable déployable généré automatiquement, validation manuelle finale" },
      { cmd: "CDeployment", desc: "Continuous Deployment : mise en production automatique de tout commit réussi" },
    ],
  },
  {
    id: 6,
    slug: "git-versioning-distribue",
    title: "Git : Maîtriser le Versioning Distribué",
    shortTitle: "6. Git Fondamentaux & Avancé",
    slidesRef: "Slides S47 à S147",
    iconName: "GitBranch",
    estimatedTime: "40 min",
    diagramType: "gitflow",
    objectives: [
      "Comprendre la différence entre VCS local, centralisé (SVN) et distribué (DVCS Git).",
      "Maîtriser les 3 zones fondamentales de Git (Working Directory, Staging Area, Local Repository) et le Stash.",
      "Comprendre le fonctionnement des commits par snapshots SHA-1 (et non par simples deltas).",
      "Manipuler avec précision les branches, le pointeur HEAD (attaché vs détaché).",
      "Maîtriser les opérations avancées : Fast-Forward vs 3-Way Merge, Rebase, Rebase --onto, Reset (soft/mixed/hard), Cherry-pick.",
      "Comparer Git Flow et Trunk-Based Development.",
    ],
    summary:
      "Git est le cœur battant de la collaboration moderne. Conçu par Linus Torvalds, il fonctionne par instantanés (snapshots) cryptographiques SHA-1 et offre des branches ultra-légères.",
    sections: [
      {
        id: "principes-fondamentaux-git",
        title: "6.1 Principes Fondamentaux & Les Trois Zones",
        badge: "Architecture Interne",
        content: `Git stocke l'historique non pas sous forme de différences de fichiers (deltas), mais sous forme d'**instantanés complets (snapshots)** de l'état du projet. Si un fichier n'a pas changé, Git enregistre un lien vers la version déjà stockée.

**Les 3 Zones Locales :**
1. **Working Directory (Répertoire de travail) :** Les fichiers physiques sur votre disque que vous éditez dans votre IDE.
2. **Staging Area / Index (Zone d'indexation) :** Le fichier binaire de préparation contenant l'instantané précis qui constituera le prochain commit.
3. **Local Repository (Dépôt local - dossier .git) :** La base de données d'objets immuables (commits, arbres, blobs) contenant tout l'historique.

**Cycle de vie d'un fichier :**
\`Untracked\` ➔ \`git add\` ➔ \`Staged\` ➔ \`git commit\` ➔ \`Unmodified\` ➔ édition ➔ \`Modified\` ➔ \`git add\` ➔ \`Staged\`.`,
        keyPoints: [
          "Toutes les opérations Git (status, log, diff, commit, branch) sont ultra-rapides et 100% locales.",
          "Chaque commit est identifié par une empreinte cryptographique SHA-1 (40 caractères hexadécimaux).",
          "HEAD est un pointeur spécial indiquant où vous vous trouvez actuellement dans le graphe.",
        ],
      },
      {
        id: "commandes-essentielles",
        title: "6.2 Commandes en Détail : Diff, Reset, Checkout, Commit --amend",
        badge: "Commandes Clés",
        content: `Manipuler Git requiert de bien comprendre la cible de chaque commande :
- \`git diff\` : Compare le Working Directory avec l'Index (ce qui n'est pas encore indexé).
- \`git diff --staged\` (ou \`--cached\`) : Compare l'Index avec le dernier commit HEAD (ce qui va être validé).
- \`git commit --amend\` : Remplace le dernier commit par un nouveau combinant les nouveaux fichiers indexés et/ou un message corrigé. **Ne jamais faire sur un commit public !**
- \`git reset\` :
  - \`git reset --soft HEAD~1\` : Recule la branche d'un commit, mais conserve les modifications dans l'Index (Staging). Idéal pour fusionner plusieurs commits.
  - \`git reset --mixed HEAD~1\` (comportement par défaut) : Recule la branche et vide l'Index, mais conserve vos fichiers modifiés dans le Working Directory.
  - \`git reset --hard HEAD~1\` : **Dangereux !** Détruit le commit, vide l'Index et annule toutes les modifications dans vos fichiers physiques.`,
        codeSnippets: [
          {
            title: "Sortir de l'état 'Detached HEAD' (Branche anonyme)",
            language: "bash",
            code: `# Si vous inspectez un vieux commit par son hash :
git checkout c2b345b
# Vous êtes en 'detached HEAD'. Si vous commitez ici, le commit sera orphelin.
# Pour sauvegarder votre travail sur une vraie branche :
git switch -c ma-nouvelle-branche
# Vos nouveaux commits sont désormais ancrés et protégés !`,
          },
        ],
      },
      {
        id: "merge-vs-rebase",
        title: "6.3 Fusion (Merge) vs Rebase vs Cherry-Pick",
        badge: "Stratégies d'Intégration",
        content: `**1. Git Merge :**
- **Fast-Forward :** Si la branche cible n'a pas divergé de la branche source, Git déplace simplement le pointeur de branche vers l'avant. Aucun nouveau commit créé.
- **3-Way Merge (Fusion à 3 points) :** Si les deux branches ont divergé, Git compare les deux pointes avec leur plus proche ancêtre commun (*Common Ancestor*). Il crée un **commit de fusion** possédant deux parents.

**2. Git Rebase :**
- Réapplique un par un les commits de votre branche courante au sommet d'une autre branche.
- Crée un historique strictement linéaire, sans commits de merge superflus.
- **Règle d'or du rebase :** *« Ne jamais rebaser une branche publique partagée avec d'autres développeurs ! »*

**3. Git Rebase --onto (Slide S85) :**
- Permet de découper une branche et de ne rejouer qu'une portion spécifique de commits sur une nouvelle base.
- Syntaxe : \`git rebase --onto master <commit-depart> <branche-source>\`.

**4. Git Cherry-Pick :**
- Copie chirurgicalement un commit spécifique depuis n'importe quelle branche et l'applique sur votre branche courante avec un nouveau hash.`,
        codeSnippets: [
          {
            title: "Exemples concrets de commandes de fusion et d'alignement",
            language: "bash",
            code: `# Fusionner develop dans master
git checkout master
git merge develop

# Rebaser une branche de feature sur master avant d'ouvrir la PR
git checkout feature/auth
git rebase master

# Récupérer un hotfix précis (ex: hash 2c33a) sur master
git checkout master
git cherry-pick 2c33a`,
          },
        ],
      },
      {
        id: "gitflow-vs-trunk",
        title: "6.4 Styles de Développement : Git Flow vs Trunk-Based Development",
        badge: "Workflows Collaboratifs",
        content: `Le cours (Slides S103 à S110) oppose deux philosophies majeures de travail en équipe :

**Git Flow (Vincent Driessen) :**
- Idéal pour les logiciels traditionnels avec cycles de release planifiés (mensuels, trimestriels).
- Branches permanentes : \`main\` (code stable de production) et \`develop\` (intégration continue des features).
- Branches temporaires :
  - \`feature/*\` : issue de develop, fusionnée dans develop.
  - \`release/*\` : issue de develop pour stabiliser une version, fusionnée dans main ET develop.
  - \`hotfix/*\` : issue de main pour corriger une urgence de prod, fusionnée dans main ET develop avec un nouveau tag.

**Trunk-Based Development :**
- Préconisé dans les organisations DevOps matures (Google, Netflix, Meta).
- Tous les développeurs travaillent sur une branche unique (\`trunk\` ou \`main\`) avec des branches de feature éphémères (< 1 à 2 jours).
- Fusions quotidiennes et tests automatisés intensifs. Déploiement continu rendu possible par les *Feature Flags*.`,
      },
    ],
    takeaways: [
      "Git stocke des snapshots complets, pas de simples deltas.",
      "Trois zones locales : Répertoire de travail ➔ Staging (add) ➔ Dépôt local (commit).",
      "Fast-forward déplace juste le pointeur ; 3-way merge crée un commit à 2 parents.",
      "Rebase réécrit l'historique de manière linéaire : interdit sur les branches publiques !",
      "Git Flow = multi-branches pour livraisons planifiées. Trunk-Based = branche unique pour livraison continue.",
    ],
    quickCheatsheet: [
      { cmd: "git add -A", desc: "Indexer toutes les modifications dans la Staging Area" },
      { cmd: "git commit -m 'msg'", desc: "Créer un snapshot dans le dépôt local" },
      { cmd: "git commit --amend", desc: "Modifier le tout dernier commit local" },
      { cmd: "git switch -c <nom>", desc: "Créer et basculer sur une nouvelle branche" },
      { cmd: "git merge <branche>", desc: "Fusionner une branche dans la branche courante" },
      { cmd: "git rebase <cible>", desc: "Rejouer les commits courants au sommet de la cible" },
      { cmd: "git cherry-pick <hash>", desc: "Copier un commit précis sur la branche active" },
      { cmd: "git reset --hard HEAD~1", desc: "Annuler définitivement le dernier commit et les fichiers modifiés" },
    ],
  },
  {
    id: 7,
    slug: "gitlab-ci-pipelines",
    title: "GitLab CI : Pipelines & Déploiements",
    shortTitle: "7. GitLab CI & Pipelines",
    slidesRef: "Slides S148 à S172",
    iconName: "PlayCircle",
    estimatedTime: "25 min",
    diagramType: "cicd",
    objectives: [
      "Comprendre l'architecture de GitLab CI (Serveur coordinateur vs GitLab Runners).",
      "Maîtriser la syntaxe et la structure du fichier de configuration .gitlab-ci.yml.",
      "Ordonner des étapes (stages) : build, test, notify, deploy.",
      "Gérer les caches de dépendances (Composer, npm) et les artefacts.",
      "Associer les Merge Requests aux pipelines de validation.",
    ],
    summary:
      "GitLab CI automatise l'ensemble du cycle de vie du code dès qu'un push survient. Configuré entièrement via un fichier déclaratif YAML (.gitlab-ci.yml), il orchestre des Runners distribués pour compiler, tester et déployer.",
    sections: [
      {
        id: "architecture-gitlab-ci",
        title: "7.1 Architecture & Fonctionnement de GitLab CI",
        badge: "Architecture CI",
        content: `L'infrastructure GitLab CI se compose de deux entités majeures :
- **Le Serveur GitLab (Coordinateur) :** Héberge le dépôt Git, parse le fichier \`.gitlab-ci.yml\`, gère les déclencheurs (*triggers*), planifie les jobs et affiche les statuts visuels dans les Merge Requests.
- **Les GitLab Runners :** Agents d'exécution autonomes installés sur des machines physiques, virtuelles ou des clusters Kubernetes. Les runners interrogent le serveur GitLab, récupèrent les jobs assignés et les exécutent dans un environnement propre (généralement un conteneur Docker).

**Flux d'échange d'une Merge Request (MR) :**
1. Un développeur pousse sa branche et ouvre une *Merge Request*.
2. GitLab déclenche automatiquement la pipeline CI associée.
3. Un Runner exécute les tests unitaires et d'intégration.
4. **Si la pipeline est verte (validée) :** La Merge Request affiche un badge de succès et peut être fusionnée.
5. **Si la pipeline échoue :** Le merge est bloqué et des notifications (Slack, email) sont envoyées à l'auteur.`,
        keyPoints: [
          "Séparation nette entre le serveur GitLab et les exécuteurs (Runners)",
          "Les Runners peuvent exécuter des builds dans des conteneurs Docker isolés",
          "Partage de clés SSH et de variables sécurisées avec les runners",
        ],
      },
      {
        id: "syntaxe-gitlab-ci",
        title: "7.2 Structure d'un fichier .gitlab-ci.yml (Slides S159 à S167)",
        badge: "Configuration YAML",
        content: `Un fichier \`.gitlab-ci.yml\` définit les étapes chronologiques (\`stages\`) et les jobs associés.`,
        codeSnippets: [
          {
            title: "Exemple de pipeline complète issue du cours (Build, Test, Deploy, Cache)",
            language: "yaml",
            code: `image: node:20-alpine

stages:
  - build
  - test
  - deploy

# Mise en cache des dépendances pour accélérer les builds suivants
cache:
  key: \${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/

job_build:
  stage: build
  script:
    - echo "=== Compilation et installation des dépendances ==="
    - npm ci
    - npm run build
  artifacts:
    expire_in: 1 week
    paths:
      - dist/

job_test:
  stage: test
  script:
    - echo "=== Exécution de la suite de tests automatisés ==="
    - npm test
  dependencies:
    - job_build

job_deploy_staging:
  stage: deploy
  script:
    - echo "=== Déploiement automatique sur Staging ==="
    - ./deploy-staging.sh
  only:
    - develop

job_deploy_production:
  stage: deploy
  script:
    - echo "=== Déploiement sécurisé en Production ==="
    - ./deploy-prod.sh
  only:
    - main
  when: manual # Validation humaine (Continuous Delivery)`,
            explanation: "Remarquez le mot-clé 'when: manual' qui transforme la pipeline en Livraison Continue pour la production.",
          },
        ],
      },
    ],
    takeaways: [
      "GitLab CI repose sur un coordinateur central et des Runners distribués.",
      ".gitlab-ci.yml décrit les 'stages' (étapes chronologiques) et les 'jobs' (scripts d'exécution).",
      "Le cache permet de réutiliser les dépendances d'un build à l'autre sans les re-télécharger.",
      "Les artefacts transmettent les fichiers compilés d'un job à un autre au sein d'une même pipeline.",
    ],
    quickCheatsheet: [
      { cmd: "stages:", desc: "Définition de l'ordre d'exécution (ex: build, test, deploy)" },
      { cmd: "script:", desc: "Commandes bash exécutées à l'intérieur du conteneur du runner" },
      { cmd: "artifacts:", desc: "Fichiers conservés et transmis aux étapes suivantes de la pipeline" },
      { cmd: "cache:", desc: "Conservation de dossiers (node_modules, vendor) entre différentes exécutions" },
      { cmd: "when: manual", desc: "Nécessite un clic humain pour déclencher l'action (Livraison Continue)" },
    ],
  },
  {
    id: 8,
    slug: "docker-et-docker-compose",
    title: "Docker & Docker Compose : Conteneurs & Orchestration",
    shortTitle: "8. Docker & Compose",
    slidesRef: "Slides S173 à S217",
    iconName: "Container",
    estimatedTime: "35 min",
    diagramType: "docker",
    objectives: [
      "Différencier rigoureusement Conteneurisation (Docker) et Virtualisation lourde (Machines Virtuelles).",
      "Comprendre l'architecture de Docker Engine (démon dockerd, API REST, client CLI).",
      "Maîtriser les images Docker, le système de couches (layers en lecture seule) et le cache de build.",
      "Écrire un Dockerfile optimisé (FROM, RUN, COPY, EXPOSE, CMD, ENTRYPOINT).",
      "Gérer la persistance avec les Volumes et les montages Bind Mounts.",
      "Comprendre les modes réseaux : bridge, host, overlay, macvlan et le port mapping (-p).",
      "Orchestrer des microservices avec Docker Compose et exploiter le Service Discovery DNS interne.",
    ],
    summary:
      "Docker encapsule une application et toutes ses dépendances dans une unité logicielle standardisée appelée conteneur. En partageant le noyau du système hôte, les conteneurs sont légers, démarrent en quelques millisecondes et garantissent que le code s'exécute de façon identique partout.",
    sections: [
      {
        id: "conteneur-vs-vm",
        title: "8.1 Conteneurisation vs Virtualisation Lourde (VM)",
        badge: "Fondations",
        content: `**Machine Virtuelle (VM) :**
- Chaque VM embarque un **système d'exploitation invité (Guest OS)** complet avec ses propres pilotes, son propre noyau et ses gigaoctets de mémoire réservée.
- Tourne au-dessus d'un **Hyperviseur** (type 1 ou type 2 : ESXi, KVM, VirtualBox).
- Démarrage long (plusieurs minutes), consommation mémoire et CPU très élevée.

**Conteneur Docker :**
- Les conteneurs partagent le **noyau unique du système hôte (Host OS Kernel)** grâce aux mécanismes Linux *cgroups* (limitation des ressources) et *namespaces* (isolation stricte des processus, réseaux et disques).
- Ne contient que les binaires applicatifs et les bibliothèques requises.
- Démarrage instantané (< 1 seconde), densité exceptionnelle sur un même serveur physique.`,
        keyPoints: [
          "Pas d'hyperviseur ni de second système d'exploitation invité dans Docker",
          "Taille des images en dizaines de mégaoctets contre dizaines de gigaoctets pour une VM",
          "Performances quasi-natives sans surcoût d'émulation matérielle",
        ],
      },
      {
        id: "dockerfile-layers-cache",
        title: "8.2 Docker Engine, Images, Layers et Dockerfile",
        badge: "Construction",
        content: `**Docker Engine :**
Application client-serveur composée de 3 éléments (Slide S177) :
1. Un serveur démon en tâche de fond (\`dockerd\`).
2. Une API REST permettant d'interagir avec le démon.
3. Le client CLI en ligne de commande (\`docker\`).

**Système de couches (Layers) :**
- Une image Docker est une pile immuable de couches en lecture seule.
- Chaque instruction du Dockerfile (\`FROM\`, \`COPY\`, \`RUN\`) génère une nouvelle couche.
- Lorsqu'un conteneur est instancié (\`docker run\`), Docker ajoute une **fine couche inscriptible (Read/Write container layer)** au sommet.
- **Cache de build :** Si une couche n'a pas changé, Docker réutilise le cache au lieu de réexécuter l'instruction. Il faut donc copier les fichiers de dépendances (\`package.json\`) avant le code source applicatif !`,
        codeSnippets: [
          {
            title: "Exemple de Dockerfile optimisé pour microservice Node.js",
            language: "dockerfile",
            code: `# Image de base officielle légère
FROM node:20-alpine

# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Copie préalable des descripteurs pour profiter du cache Docker
COPY package*.json ./

# Installation propre des dépendances de production
RUN npm ci --only=production

# Copie du code source applicatif (couche fréquemment modifiée)
COPY . .

# Documentation du port d'écoute
EXPOSE 3000

# Commande de lancement du microservice
CMD ["node", "src/server.js"]`,
          },
        ],
      },
      {
        id: "persistance-et-reseaux",
        title: "8.3 Persistance des Données & Pilotes Réseaux",
        badge: "Réseaux & Stockage",
        content: `**Persistance des données (Slides S192 à S195) :**
- Par défaut, les données écrites dans la couche inscriptible d'un conteneur disparaissent à sa destruction.
- **Volumes gérés par Docker (\`docker volume create\`) :** Stockés dans un répertoire sécurisé géré par Docker (\`/var/lib/docker/volumes/\`). Indépendants du cycle de vie du conteneur, recommandés en production.
- **Bind Mounts :** Montage direct d'un dossier de la machine hôte dans le conteneur (\`-v /chemin/local:/chemin/conteneur\`). Idéal en développement pour le rechargement à chaud.
- **tmpfs :** Stockage temporaire en mémoire RAM (sécurité des clés, performances).

**Pilotes Réseaux Docker (Slides S197 à S204) :**
- **bridge (défaut) :** Crée un commutateur virtuel (\`docker0\`) avec sous-réseau privé (ex: 172.17.0.0/16). Les conteneurs communiquent entre eux. Pour les exposer au monde extérieur, on utilise le **port mapping** : \`docker run -p 8080:80 mon-api\`.
- **host :** Supprime l'isolation réseau, le conteneur partage directement la carte réseau et l'adresse IP de la machine hôte.
- **overlay :** Permet la communication multi-hôtes entre plusieurs nœuds Docker (Docker Swarm ou Kubernetes).
- **macvlan :** Attribue une véritable adresse MAC physique au conteneur sur le réseau local.
- **none :** Désactive toute interface réseau pour une isolation hermétique.`,
      },
      {
        id: "docker-compose-orchestration",
        title: "8.4 Docker Compose & Service Discovery",
        badge: "Orchestration Multi-Conteneurs",
        content: `Docker Compose permet de définir et lancer une architecture multi-conteneurs complexe à l'aide d'un unique fichier déclaratif YAML (\`docker-compose.yml\`) et d'une seule commande (\`docker compose up -d\`).

**Service Discovery (Découverte de services intégrée - S214-S216) :**
- Docker Compose crée automatiquement un réseau privé de type bridge pour tous les services déclarés.
- Il embarque un **serveur DNS interne hautement disponible**.
- Les conteneurs se découvrent et communiquent simplement en utilisant **le nom de leur service comme nom d'hôte** ! Par exemple, le service web peut interroger l'URL \`http://database:5432\` ou \`http://cache:6379\` sans jamais manipuler d'adresses IP fixes.`,
        codeSnippets: [
          {
            title: "Exemple complet de docker-compose.yml avec Web, Redis et PostgreSQL",
            language: "yaml",
            code: `version: '3.8'

services:
  web-api:
    build: .
    ports:
      - "8000:3000"
    environment:
      - DB_HOST=database # Résolu automatiquement par le DNS Docker !
      - REDIS_HOST=cache
    depends_on:
      - database
      - cache
    networks:
      - backend-net

  cache:
    image: redis:7-alpine
    restart: always
    networks:
      - backend-net

  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app_db
      POSTGRES_USER: devops_user
      POSTGRES_PASSWORD: secret_password
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - backend-net

volumes:
  db-data:

networks:
  backend-net:
    driver: bridge`,
          },
        ],
      },
    ],
    takeaways: [
      "Les conteneurs partagent le noyau de l'hôte et s'isolent via cgroups et namespaces.",
      "Une image Docker est composée de layers en lecture seule superposés.",
      "Le cache de build Docker réutilise les étapes inchangées : toujours copier package.json avant le code !",
      "Les Volumes assurent la persistance des bases de données au-delà de la vie d'un conteneur.",
      "Le port mapping (-p hôte:conteneur) rend accessible un service bridge depuis l'extérieur.",
      "Docker Compose gère les architectures multi-conteneurs et fournit un DNS interne automatique pour la découverte de services.",
    ],
    quickCheatsheet: [
      { cmd: "docker build -t nom:tag .", desc: "Construire une image à partir d'un Dockerfile" },
      { cmd: "docker run -d -p 8080:80 img", desc: "Lancer un conteneur en arrière-plan avec redirection de port" },
      { cmd: "docker ps -a", desc: "Lister tous les conteneurs (actifs et arrêtés)" },
      { cmd: "docker exec -it cont_id sh", desc: "Ouvrir un shell interactif dans un conteneur en cours d'exécution" },
      { cmd: "docker volume ls", desc: "Lister les volumes de données persistants" },
      { cmd: "docker compose up -d", desc: "Démarrer l'ensemble des services multi-conteneurs" },
      { cmd: "docker compose down -v", desc: "Arrêter les services et supprimer conteneurs, réseaux et volumes" },
    ],
  },
];
