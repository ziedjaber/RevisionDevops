import { ExerciseScenario } from "@/types/course";

export const exercisesData: ExerciseScenario[] = [
  {
    id: "git-merge-conflict",
    title: "1. Résolution de Conflit de Fusion (3-Way Merge)",
    category: "Merge & Rebase",
    difficulty: "Intermédiaire",
    duration: "15 min",
    context:
      "Sur une application e-commerce, Alice a modifié la méthode de calcul de TVA sur 'main' pendant que Bob a implémenté un système de remises sur 'feature/discounts'. Les deux ont modifié la même ligne dans 'src/pricing.ts'.",
    problem:
      "Lorsque vous tentez d'intégrer le travail avec 'git merge feature/discounts', Git s'arrête avec le message : 'CONFLICT (content): Merge conflict in src/pricing.ts. Automatic merge failed; fix conflicts and then commit the result.'",
    goal: "Inspecter le statut du dépôt, comprendre la structure des balises de conflit, résoudre manuellement le conflit, indexer le fichier résolu et finaliser le commit de merge.",
    initialStatePreset: "divergent",
    hints: [
      "Lancez 'git status' pour identifier précisément quel fichier est en état 'both modified'.",
      "Dans le fichier en conflit, repérez les balises <<<<<<< HEAD, ======= et >>>>>>> feature/discounts.",
      "Après avoir fusionné la logique métier dans le fichier, vous devez obligatoirement faire 'git add src/pricing.ts'.",
      "Terminez en exécutant 'git commit' sans modifier le message par défaut ou avec un message clair.",
    ],
    validationCriteria: {
      commandPattern: "git\\s+(merge|add|commit)",
      expectedOutputKeywords: ["Merge", "commit", "conflict", "resolved"],
    },
    stepByStepSolution: [
      {
        step: 1,
        title: "Vérifier l'état du dépôt",
        command: "git status",
        explanation:
          "Git indique que les deux branches ont modifié 'src/pricing.ts'. L'arbre de travail est en pause en attendant votre arbitrage.",
      },
      {
        step: 2,
        title: "Examiner le conflit dans le fichier",
        explanation: `Git insère des marqueurs visuels dans le code :
<<<<<<< HEAD
const total = amount * 1.20; // Version Alice (main)
=======
const total = amount * (1 - discountRate); // Version Bob (feature)
>>>>>>> feature/discounts

La solution consiste à conserver les deux fonctionnalités :
const total = (amount * (1 - discountRate)) * 1.20;`,
      },
      {
        step: 3,
        title: "Indexer le fichier résolu",
        command: "git add src/pricing.ts",
        explanation:
          "Pour Git, faire 'git add' sur un fichier en conflit signifie officiellement : 'J'ai arbitré et résolu le conflit'.",
      },
      {
        step: 4,
        title: "Finaliser la fusion",
        command: "git commit -m \"Merge branch 'feature/discounts' into main\"",
        explanation:
          "Git génère le commit de fusion à 2 parents (votre pointeur HEAD avance et absorbe l'historique de Bob).",
      },
    ],
    trapToAvoid:
      "Ne faites JAMAIS 'git checkout --ours' ou 'git checkout --theirs' aveuglément sans comprendre, car vous écraseriez irrémédiablement le travail de l'autre développeur.",
  },
  {
    id: "git-rebase-clean-history",
    title: "2. Nettoyer l'Historique avant Pull Request (Git Rebase)",
    category: "Merge & Rebase",
    difficulty: "Avancé",
    duration: "20 min",
    context:
      "Vous avez développé une fonctionnalité de paiement sur votre branche 'feature/stripe'. En local, vous avez accumulé 4 commits désordonnés : 'wip', 'fix typo', 'test again', 'finally works!'.",
    problem:
      "Le Tech Lead exige un historique atomique, clair et rebasé sur le sommet actuel de 'main' avant d'autoriser la revue de code.",
    goal: "Mettre à jour votre branche par rapport à 'main' sans créer de commit de merge parasite, et créer un historique strictement linéaire.",
    initialStatePreset: "divergent",
    hints: [
      "Assurez-vous d'abord que votre copie de travail locale est propre (arbre propre).",
      "Basculez sur votre branche de feature : 'git checkout feature/stripe'.",
      "Lancez 'git rebase main' pour rejouer vos commits au-dessus des dernières nouveautés de main.",
      "Si vous deviez réécrire les 3 derniers commits, la commande interactive serait 'git rebase -i HEAD~3'.",
    ],
    validationCriteria: {
      commandPattern: "git\\s+rebase\\s+main",
      expectedOutputKeywords: ["rebase", "success", "main"],
    },
    stepByStepSolution: [
      {
        step: 1,
        title: "Mettre à jour la branche main locale",
        command: "git checkout main && git pull origin main",
        explanation: "On s'assure d'avoir la dernière version stable du projet en local.",
      },
      {
        step: 2,
        title: "Revenir sur la branche de feature",
        command: "git checkout feature/stripe",
        explanation: "Le rebase doit toujours être lancé depuis la branche qu'on souhaite déplacer.",
      },
      {
        step: 3,
        title: "Lancer le rebase sur main",
        command: "git rebase main",
        explanation:
          "Git met de côté vos commits de feature, avance votre branche jusqu'à la pointe de 'main', puis réapplique un à un vos commits en recalculant de nouveaux SHA-1.",
      },
      {
        step: 4,
        title: "Pousser les modifications sur le serveur",
        command: "git push --force-with-lease origin feature/stripe",
        explanation:
          "Comme les SHA-1 ont été réécrits, un push classique est rejeté. L'option '--force-with-lease' est plus sécurisée que '--force' car elle vérifie que personne d'autre n'a poussé entre temps.",
      },
    ],
    trapToAvoid:
      "Règle d'or de la Slide S85 : Ne jamais rebaser une branche publique partagée comme 'main' ou 'develop' ! Vous casseriez l'historique de tous vos collègues.",
  },
  {
    id: "git-detached-head-rescue",
    title: "3. Sortir du Piège du 'Detached HEAD' (HEAD Détachée)",
    category: "Disaster Recovery",
    difficulty: "Débutant",
    duration: "10 min",
    context:
      "Voulant vérifier le comportement du système lors de la version précédente v1.0, un développeur a exécuté 'git checkout c2b345b'. Il a ensuite corrigé un bug et fait deux commits sans s'apercevoir qu'il n'était sur aucune branche.",
    problem:
      "HEAD pointe directement sur un hash de commit et non sur une référence de branche. S'il exécute 'git checkout main', ses deux nouveaux commits deviendront orphelins et seront perdus !",
    goal: "Sécuriser les commits orphelins en créant une nouvelle branche d'ancrage avant de quitter cet état.",
    initialStatePreset: "detached",
    hints: [
      "Observez l'invite de commande ou 'git status' : il indique 'HEAD détachée sur...'.",
      "Pour donner un nom à cet historique sans perdre les commits, il suffit d'y attacher une branche.",
      "La commande moderne est 'git switch -c <nom-de-branche>' ou 'git checkout -b <nom-de-branche>'.",
    ],
    validationCriteria: {
      commandPattern: "git\\s+(switch\\s+-c|checkout\\s+-b|branch)\\s+",
      expectedOutputKeywords: ["branche", "switch", "branch"],
    },
    stepByStepSolution: [
      {
        step: 1,
        title: "Constater l'état de détachement",
        command: "git status",
        explanation: "Git prévient explicitement que vous êtes sur une branche anonyme.",
      },
      {
        step: 2,
        title: "Créer et basculer sur une nouvelle branche immédiatement",
        command: "git switch -c fix/historical-bug",
        explanation:
          "Cette commande unique crée le pointeur de branche 'fix/historical-bug' sur le commit courant et y attache HEAD. Tous vos commits sont désormais parfaitement sauvegardés !",
      },
      {
        step: 3,
        title: "Vérifier le graphe",
        command: "git log --oneline -n 3",
        explanation: "HEAD pointe désormais sur la nouvelle branche 'fix/historical-bug', le danger est écarté.",
      },
    ],
    trapToAvoid:
      "Si vous avez déjà quitté par mégarde un état detached HEAD avec 'git checkout main', ne paniquez pas : vos commits existent encore ! Tapez 'git reflog' pour retrouver leur hash SHA-1 et créez votre branche dessus.",
  },
  {
    id: "git-gitflow-hotfix",
    title: "4. Sauvetage d'Urgence en Production (Hotfix Git Flow)",
    category: "Branching & Workflows",
    difficulty: "Intermédiaire",
    duration: "25 min",
    context:
      "Une vulnérabilité critique d'injection SQL est exploitée en direct sur la production (branche 'main', version 1.0.1). Parallèlement, l'équipe a 12 fonctionnalités à moitié terminées sur la branche 'develop'.",
    problem:
      "Il est strictement interdit de fusionner 'develop' en production car le code n'est pas prêt. Il faut corriger la faille immédiatement sur 'main' ET réintégrer le correctif dans 'develop' pour ne pas réintroduire le bug lors de la prochaine release.",
    goal: "Appliquer la méthodologie Git Flow stricte (Slide S108) pour traiter le hotfix.",
    initialStatePreset: "gitflow",
    hints: [
      "Une branche de hotfix naît TOUJOURS de 'main', jamais de 'develop'.",
      "Nommez la branche 'hotfix/v1.0.2' ou 'hotfix/sql-patch'.",
      "Une fois le commit du fix effectué, fusionnez d'abord dans 'main', taguez 'v1.0.2', puis fusionnez dans 'develop'.",
    ],
    validationCriteria: {
      commandPattern: "git\\s+(checkout|switch|merge|tag)",
      expectedOutputKeywords: ["hotfix", "main", "develop", "v1.0.2"],
    },
    stepByStepSolution: [
      {
        step: 1,
        title: "Partir de la version exacte de production",
        command: "git checkout main",
        explanation: "On se positionne sur la version actuellement déployée en production.",
      },
      {
        step: 2,
        title: "Créer la branche de hotfix",
        command: "git switch -c hotfix/patch-sql-injection",
        explanation: "La branche de secours est isolée de tous les développements en cours sur develop.",
      },
      {
        step: 3,
        title: "Appliquer et valider le correctif",
        command: "git commit -am \"security: patch prepared statements to prevent SQL injection\"",
        explanation: "Le patch est testé et validé.",
      },
      {
        step: 4,
        title: "Fusionner dans main et poser un tag de version",
        command: "git checkout main && git merge hotfix/patch-sql-injection && git tag -a v1.0.2 -m \"Release v1.0.2 - Hotfix SQL Injection\"",
        explanation: "La production est prête à être redéployée avec sa version incrémentée.",
      },
      {
        step: 5,
        title: "Réintégrer le correctif dans develop",
        command: "git checkout develop && git merge hotfix/patch-sql-injection",
        explanation: "Crucial ! Si vous oubliez cette étape, la prochaine release écrasera votre correctif et rouvrira la faille de sécurité.",
      },
      {
        step: 6,
        title: "Nettoyer la branche temporaire",
        command: "git branch -d hotfix/patch-sql-injection",
        explanation: "La branche de hotfix a rempli sa mission et peut être supprimée.",
      },
    ],
    trapToAvoid:
      "L'erreur numéro 1 en entreprise : corriger sur 'main' et oublier de reporter le merge sur 'develop'. Deux mois plus tard, la faille réapparaît !",
  },
  {
    id: "gitlab-ci-pipeline-config",
    title: "5. Concevoir une Pipeline GitLab CI Robuste (.gitlab-ci.yml)",
    category: "GitLab CI",
    difficulty: "Intermédiaire",
    duration: "20 min",
    context:
      "Une équipe livre une application TypeScript. Les builds sont actuellement manuels et des régressions sont régulièrement poussées en recette.",
    problem:
      "Le chef de projet veut automatiser la validation : à chaque push, exécuter les tests. Si les tests passent sur 'develop', déployer automatiquement en recette. Pour 'main', exiger un clic de validation humaine avant la prod.",
    goal: "Écrire le fichier .gitlab-ci.yml complet en respectant les mots-clés officiels de GitLab CI (stages, cache, artifacts, only, when: manual).",
    hints: [
      "Déclarez les 'stages' : build, test, deploy.",
      "Utilisez 'cache:' pour mettre en cache 'node_modules/' avec 'key: ${CI_COMMIT_REF_SLUG}'.",
      "Dans le job de build, créez des 'artifacts:' pour transmettre le dossier 'dist/' aux étapes suivantes.",
      "Pour la production sur la branche main, utilisez 'when: manual' (Continuous Delivery).",
    ],
    validationCriteria: {
      commandPattern: "(stages|script|cache|artifacts|when:\\s*manual)",
      expectedOutputKeywords: ["stages", "build", "test", "deploy"],
    },
    stepByStepSolution: [
      {
        step: 1,
        title: "Déclarer l'image de base et les stages chronologiques",
        explanation: `image: node:20-alpine

stages:
  - build
  - test
  - deploy`,
      },
      {
        step: 2,
        title: "Configurer le cache global des paquets",
        explanation: `cache:
  key: \${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/`,
      },
      {
        step: 3,
        title: "Créer le job de test unitaire",
        explanation: `unit_tests:
  stage: test
  script:
    - npm test
  coverage: '/All files[^|]*\\|[^|]*\\s+(\\d+\\.\\d+)/'`,
      },
      {
        step: 4,
        title: "Configurer la mise en production sous contrôle humain",
        explanation: `deploy_prod:
  stage: deploy
  only:
    - main
  when: manual # Déploiement déclenché uniquement après clic du Lead DevOps
  script:
    - ./scripts/deploy-production.sh`,
      },
    ],
    trapToAvoid:
      "Confondre 'cache' et 'artifacts' : le cache sert à accélérer les builds futurs (ex: dépendances téléchargées), tandis que les artefacts servent à transmettre les binaires compilés entre les jobs d'une MÊME exécution de pipeline.",
  },
  {
    id: "docker-multicontainer-compose",
    title: "6. Orchestration Multi-Conteneurs & Service Discovery",
    category: "Docker & Compose",
    difficulty: "Avancé",
    duration: "25 min",
    context:
      "Vous développez un microservice de gestion d'utilisateurs qui a besoin d'une base de données PostgreSQL et d'un cache Redis pour les sessions.",
    problem:
      "En local, lancer les trois briques à la main avec 'docker run' est fastidieux, les IP changent à chaque reboot et les données de la base sont perdues dès que le conteneur s'arrête.",
    goal: "Créer un fichier 'docker-compose.yml' qui configure les 3 services, un réseau privé 'app-net', un volume persistant 'pgdata', et exploite le Service Discovery DNS interne.",
    hints: [
      "Déclarez 3 services : 'api', 'database', 'cache'.",
      "Pour la base postgres, utilisez 'volumes: - pgdata:/var/lib/postgresql/data'.",
      "Dans l'environnement de l'api, configurez 'DB_HOST=database' (le nom du service est résolu par le DNS Docker).",
      "Ouvrez le port de l'API avec 'ports: - \"3000:3000\"'.",
    ],
    validationCriteria: {
      commandPattern: "(services|database|volumes|networks|docker-compose)",
      expectedOutputKeywords: ["services", "postgres", "volumes", "networks"],
    },
    stepByStepSolution: [
      {
        step: 1,
        title: "Rédiger le fichier docker-compose.yml",
        explanation: `version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=database   # Service discovery DNS Docker automatique !
      - REDIS_HOST=cache
    depends_on:
      - database
      - cache
    networks:
      - app-net

  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: users_db
      POSTGRES_USER: devops
      POSTGRES_PASSWORD: supersecretpassword
    volumes:
      - pgdata:/var/lib/postgresql/data # Persistance des données
    networks:
      - app-net

  cache:
    image: redis:7-alpine
    networks:
      - app-net

volumes:
  pgdata: # Volume managé persistant

networks:
  app-net:
    driver: bridge`,
      },
      {
        step: 2,
        title: "Démarrer l'ensemble de la pile en arrière-plan",
        command: "docker compose up -d",
        explanation: "Docker Compose télécharge les images, crée le réseau bridge, monte le volume et démarre les 3 conteneurs dans l'ordre défini par 'depends_on'.",
      },
      {
        step: 3,
        title: "Vérifier le statut des conteneurs",
        command: "docker compose ps",
        explanation: "Tous les services doivent afficher l'état 'Up (healthy)' avec leurs redirections de ports.",
      },
    ],
    trapToAvoid:
      "Ne codez JAMAIS d'adresses IP fixes (ex: 172.17.0.2) dans votre code source ou vos variables d'environnement. Utilisez TOUJOURS le nom du service Docker Compose ('database', 'cache').",
  },
];
