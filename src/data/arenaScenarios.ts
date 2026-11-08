import { ArenaScenario } from "@/types/game";

export const arenaScenarios: ArenaScenario[] = [
  // ==================== JUNIOR (4 Scenarios) ====================
  {
    id: "inc-101-detached-head",
    title: "Sauvetage d'un Commit Orphelin en Detached HEAD",
    difficulty: "Junior",
    category: "Detached HEAD & Rescue",
    xpReward: 200,
    incidentCode: "INC-101",
    incidentBrief:
      "Un développeur a inspecté le commit tagué 'v1.0' (c2b345b) puis a codé et validé un correctif critique de fuite mémoire (9f8e7d6) alors que HEAD était détachée ! S'il bascule sur 'main', son commit 9f8e7d6 sera perdu.",
    missionGoal:
      "Ancrer immédiatement le commit 9f8e7d6 dans une nouvelle branche nommée 'fix/memory-leak', puis la fusionner dans 'main'.",
    initialPreset: "arena-detached",
    objectives: [
      {
        id: "obj-1",
        label: "Créer et basculer sur la branche 'fix/memory-leak' sur le commit orphelin 9f8e7d6",
        check: (state) =>
          Boolean(
            state.branches["fix/memory-leak"] &&
              state.branches["fix/memory-leak"].targetHash === "9f8e7d6"
          ),
      },
      {
        id: "obj-2",
        label: "Sortir de l'état Detached HEAD (HEAD attachée à une branche)",
        check: (state) => state.head.type === "branch",
      },
      {
        id: "obj-3",
        label: "Basculer sur 'main' et fusionner 'fix/memory-leak' (Merge 3-Way)",
        check: (state) => {
          const mainHash = state.branches["main"]?.targetHash;
          const mainCommit = mainHash ? state.commits[mainHash] : null;
          return Boolean(
            state.head.target === "main" &&
              mainCommit &&
              mainCommit.parents.includes("9f8e7d6")
          );
        },
      },
    ],
    hints: [
      "Étape 1 : Pour sauver un commit en état Detached HEAD, créez une branche dessus avec : git switch -c fix/memory-leak",
      "Étape 2 : Revenez sur la branche principale avec : git switch main",
      "Étape 3 : Intégrez la branche sauvée avec : git merge fix/memory-leak",
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        command: "git switch -c fix/memory-leak",
        description:
          "Attache une nouvelle branche 'fix/memory-leak' sur le commit orphelin 9f8e7d6 et sort immédiatement de l'état Detached HEAD.",
      },
      {
        stepNumber: 2,
        command: "git switch main",
        description:
          "Repositionne HEAD sur la branche 'main' (le commit 9f8e7d6 est désormais protégé par l'étiquette fix/memory-leak).",
      },
      {
        stepNumber: 3,
        command: "git merge fix/memory-leak",
        description:
          "Réalise une fusion à 3 points (3-way merge) intégrant le correctif de fuite mémoire dans 'main'.",
      },
    ],
    postMortemTakeaway:
      "Commiter en Detached HEAD crée des commits sur une branche anonyme (Slide S75). Utilisez toujours 'git switch -c <branche>' avant de quitter ce commit.",
  },
  {
    id: "inc-102-fast-forward",
    title: "Livraison Linéaire par Fast-Forward & Nettoyage",
    difficulty: "Junior",
    category: "Merge & Conflits",
    xpReward: 150,
    incidentCode: "INC-102",
    incidentBrief:
      "Sarah a terminé la pipeline d'intégration continue sur la branche 'feature/gitlab-ci' (6e99c2b). Aucun commit n'a été fait sur 'main' depuis son départ. L'architecte exige une intégration Fast-Forward suivie de la suppression de la branche temporaire.",
    missionGoal:
      "Faire avancer 'main' sur 'feature/gitlab-ci' par Fast-Forward, poser le tag 'v1.1' et supprimer la branche 'feature/gitlab-ci'.",
    initialPreset: "arena-fastforward",
    objectives: [
      {
        id: "obj-1",
        label: "Fusionner 'feature/gitlab-ci' dans 'main' par Fast-Forward (main pointe sur 6e99c2b)",
        check: (state) => state.branches["main"]?.targetHash === "6e99c2b",
      },
      {
        id: "obj-2",
        label: "Créer le tag 'v1.1' sur le nouveau sommet de 'main'",
        check: (state) => state.tags["v1.1"] === "6e99c2b",
      },
      {
        id: "obj-3",
        label: "Supprimer la branche fusionnée 'feature/gitlab-ci'",
        check: (state) => !state.branches["feature/gitlab-ci"],
      },
    ],
    hints: [
      "Vous êtes déjà sur 'main'. Lancez : git merge feature/gitlab-ci",
      "Posez le tag avec : git tag v1.1",
      "Supprimez l'étiquette de branche obsolète avec : git branch -d feature/gitlab-ci",
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        command: "git merge feature/gitlab-ci",
        description:
          "Comme 'main' (a8c912b) est un ancêtre direct de 'feature/gitlab-ci' (6e99c2b), Git effectue un Fast-Forward sans créer de commit de merge.",
      },
      {
        stepNumber: 2,
        command: "git tag v1.1",
        description: "Marque officiellement la version 1.1 avec pipeline CI.",
      },
      {
        stepNumber: 3,
        command: "git branch -d feature/gitlab-ci",
        description:
          "Supprime le pointeur de branche 'feature/gitlab-ci' devenu inutile (les commits restent dans 'main').",
      },
    ],
    postMortemTakeaway:
      "Un Fast-Forward (Slide S81) déplace simplement le pointeur de branche vers l'avant lorsqu'il n'y a aucune divergence d'historique.",
  },
  {
    id: "inc-103-commit-amend",
    title: "Remplacement d'un Commit Incomplet (--amend)",
    difficulty: "Junior",
    category: "Reset & Annulation",
    xpReward: 180,
    incidentCode: "INC-103",
    incidentBrief:
      "Un développeur Junior vient de créer le commit ed489a1 sur 'main', mais il a oublié d'indexer le fichier 'src/config/cors.ts' qui se trouve toujours dans le Working Directory !",
    missionGoal:
      "Indexer le fichier oublié 'src/config/cors.ts' puis remplacer le dernier commit ed489a1 sans créer de deuxième commit grâce à 'git commit --amend'.",
    initialPreset: "arena-amend",
    objectives: [
      {
        id: "obj-1",
        label: "Vider le Working Directory et l'Index en intégrant src/config/cors.ts",
        check: (state) =>
          state.workingDirectory.length === 0 && state.stagingArea.length === 0,
      },
      {
        id: "obj-2",
        label: "Remplacer le commit ed489a1 par un nouveau commit amendé sur 'main'",
        check: (state) => {
          const mainHash = state.branches["main"]?.targetHash;
          return Boolean(
            mainHash &&
              mainHash !== "ed489a1" &&
              state.commits[mainHash]?.parents.includes("c1a012a")
          );
        },
      },
    ],
    hints: [
      "Étape 1 : Indexez le fichier oublié avec : git add src/config/cors.ts",
      "Étape 2 : Remplacez le dernier commit avec : git commit --amend -m \"feat: complete CORS middleware\"",
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        command: "git add src/config/cors.ts",
        description:
          "Transfère le fichier oublié du Working Directory vers la Staging Area (Index).",
      },
      {
        stepNumber: 2,
        command: 'git commit --amend -m "feat: complete CORS middleware"',
        description:
          "Prend l'Index et réécrit le dernier commit ed489a1 en le remplaçant par un nouveau commit unique (Slide S71).",
      },
    ],
    postMortemTakeaway:
      "'git commit --amend' (Slide S71) ne crée pas un commit supplémentaire : il remplace le dernier commit par un tout nouvel instantané SHA-1.",
  },
  {
    id: "inc-104-mixed-reset-unstage",
    title: "Désindexation d'Urgence de Secrets Locaux",
    difficulty: "Junior",
    category: "Reset & Annulation",
    xpReward: 190,
    incidentCode: "INC-104",
    incidentBrief:
      "Sur 'main', le commit bad002b contient par erreur des clés d'API sensibles et bad001a contient des logs de debug. Vous devez reculer 'main' sur la release stable 'v1.2' (c2b345b) en nettoyant l'Index (mode --mixed par défaut).",
    missionGoal:
      "Reculer 'main' de 2 commits (HEAD~2) avec un reset mixte afin de ramener 'main' sur c2b345b tout en vidant la Staging Area.",
    initialPreset: "arena-reset",
    objectives: [
      {
        id: "obj-1",
        label: "Repositionner 'main' sur le commit stable c2b345b (v1.2)",
        check: (state) => state.branches["main"]?.targetHash === "c2b345b",
      },
      {
        id: "obj-2",
        label: "Conserver les modifications désindexées dans le Working Directory (mode --mixed)",
        check: (state) =>
          state.stagingArea.length === 0 && state.workingDirectory.length > 0,
      },
    ],
    hints: [
      "Exécutez simplement : git reset HEAD~2",
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        command: "git reset HEAD~2",
        description:
          "Recule HEAD et 'main' de 2 commits (sur c2b345b), vide l'Index mais conserve les fichiers dans le Working Directory (Slide S78).",
      },
    ],
    postMortemTakeaway:
      "Sans option, 'git reset HEAD~n' exécute le mode '--mixed' (Slide S78) : il déplace la branche et réinitialise l'Index sans effacer le répertoire de travail.",
  },

  // ==================== MID (4 Scenarios) ====================
  {
    id: "inc-202-3way-merge",
    title: "Intégration de Branches Divergentes (3-Way Merge)",
    difficulty: "Mid",
    category: "Merge & Conflits",
    xpReward: 250,
    incidentCode: "INC-202",
    incidentBrief:
      "Pendant que Bob développait l'authentification OAuth2 sur 'feature/oauth' (9b11e4f), Alice a poussé un cache Redis sur 'main' (d4e501c). Les deux branches ont divergé à partir de l'ancêtre commun a8c912b.",
    missionGoal:
      "Fusionner 'feature/oauth' dans 'main' via un 3-Way Merge, puis supprimer la branche 'feature/oauth'.",
    initialPreset: "arena-3way",
    objectives: [
      {
        id: "obj-1",
        label: "Créer le commit de fusion à 2 parents sur 'main' (d4e501c + 9b11e4f)",
        check: (state) => {
          const mainHash = state.branches["main"]?.targetHash;
          const commit = mainHash ? state.commits[mainHash] : null;
          return Boolean(
            commit &&
              commit.isMerge &&
              commit.parents.includes("d4e501c") &&
              commit.parents.includes("9b11e4f")
          );
        },
      },
      {
        id: "obj-2",
        label: "Nettoyer la branche 'feature/oauth' après la fusion",
        check: (state) => !state.branches["feature/oauth"],
      },
    ],
    hints: [
      "Vérifiez que HEAD est sur 'main', puis exécutez : git merge feature/oauth",
      "Une fois le commit de fusion créé, supprimez la branche : git branch -d feature/oauth",
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        command: "git merge feature/oauth",
        description:
          "Git compare l'ancêtre commun (a8c912b) avec les deux pointes (d4e501c et 9b11e4f) et génère le commit de fusion e815ec4 à 2 parents.",
      },
      {
        stepNumber: 2,
        command: "git branch -d feature/oauth",
        description: "Nettoie la branche de fonctionnalité une fois intégrée.",
      },
    ],
    postMortemTakeaway:
      "Lors d'une divergence (Slide S82), Git réalise un 3-Way Merge qui produit un commit de fusion possédant deux parents.",
  },
  {
    id: "inc-203-stash-context-switch",
    title: "Mise en Réserve (Stash) & Tag d'Urgence sur Main",
    difficulty: "Mid",
    category: "Detached HEAD & Rescue",
    xpReward: 260,
    incidentCode: "INC-203",
    incidentBrief:
      "Vous êtes en plein développement sur 'feature/oauth' avec des fichiers modifiés et indexés non prêts à être commités. Le Release Manager vous demande de basculer immédiatement sur 'main' pour poser le tag 'v1.0.5', puis de reprendre votre travail sur 'feature/oauth'.",
    missionGoal:
      "Mettre vos modifications en réserve avec 'git stash', basculer sur 'main' pour créer le tag 'v1.0.5', puis revenir sur 'feature/oauth' et restaurer votre travail avec 'git stash pop'.",
    initialPreset: "arena-stash",
    objectives: [
      {
        id: "obj-1",
        label: "Poser le tag 'v1.0.5' sur le commit c2b345b de 'main'",
        check: (state) => state.tags["v1.0.5"] === "c2b345b",
      },
      {
        id: "obj-2",
        label: "Revenir sur 'feature/oauth' et restaurer le stash (stash vide + Working Dir restauré)",
        check: (state) =>
          state.head.target === "feature/oauth" &&
          state.stash.length === 0 &&
          state.workingDirectory.length > 0,
      },
    ],
    hints: [
      "1. Mettez de côté vos fichiers en cours : git stash",
      "2. Basculez sur main et taguez : git switch main && git tag v1.0.5",
      "3. Revenez sur feature/oauth et restaurez : git switch feature/oauth && git stash pop",
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        command: "git stash",
        description:
          "Sauvegarde proprement le Working Directory et l'Index dans la pile refs/stash.",
      },
      {
        stepNumber: 2,
        command: "git switch main && git tag v1.0.5",
        description:
          "Bascule sur 'main' avec un arbre de travail propre et pose le tag 'v1.0.5'.",
      },
      {
        stepNumber: 3,
        command: "git switch feature/oauth && git stash pop",
        description:
          "Retourne sur 'feature/oauth' et dépile les modifications mises en réserve.",
      },
    ],
    postMortemTakeaway:
      "'git stash' permet d'interrompre un travail en cours sans faire de commit inachevé, puis de le restaurer avec 'git stash pop'.",
  },
  {
    id: "inc-204-soft-reset-squash",
    title: "Condensation (Squash) de Commits WIP via Reset --soft",
    difficulty: "Mid",
    category: "Reset & Annulation",
    xpReward: 280,
    incidentCode: "INC-204",
    incidentBrief:
      "Un développeur a pollué la branche 'main' avec deux petits commits temporaires ('wip: temporary console.log debug' et 'wip: fix typo in draft') au-dessus de c2b345b. Vous devez les regrouper en un seul commit propre sans perdre le code.",
    missionGoal:
      "Reculer 'main' de 2 commits avec 'git reset --soft HEAD~2' pour garder tous les changements dans l'Index, puis créer un unique commit propre.",
    initialPreset: "arena-soft-squash",
    objectives: [
      {
        id: "obj-1",
        label: "Remplacer les 2 commits WIP par un unique commit propre ayant c2b345b comme parent direct",
        check: (state) => {
          const mainHash = state.branches["main"]?.targetHash;
          const commit = mainHash ? state.commits[mainHash] : null;
          return Boolean(
            mainHash &&
              mainHash !== "w10011a" &&
              mainHash !== "w20022b" &&
              mainHash !== "c2b345b" &&
              commit?.parents.includes("c2b345b") &&
              state.stagingArea.length === 0
          );
        },
      },
    ],
    hints: [
      "Étape 1 : Reculez de 2 commits en gardant l'Index avec : git reset --soft HEAD~2",
      "Étape 2 : Validez l'Index en un seul commit propre : git commit -m \"feat: clean user profile endpoint\"",
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        command: "git reset --soft HEAD~2",
        description:
          "Ramène 'main' sur c2b345b tout en conservant les modifications des 2 commits WIP déjà indexées dans la Staging Area (Slide S78).",
      },
      {
        stepNumber: 2,
        command: 'git commit -m "feat: clean user profile endpoint"',
        description:
          "Crée un unique commit propre regroupant l'ensemble des modifications.",
      },
    ],
    postMortemTakeaway:
      "'git reset --soft HEAD~n' (Slide S78) est la technique royale pour condenser (squasher) plusieurs petits commits WIP en un seul commit propre.",
  },
  {
    id: "inc-301-linear-rebase",
    title: "Réécriture Linéaire avant Merge Request (Rebase)",
    difficulty: "Mid",
    category: "Rebase & Historique",
    xpReward: 300,
    incidentCode: "INC-301",
    incidentBrief:
      "La politique CI/CD de l'équipe interdit les commits de merge sur les branches de fonctionnalités. Vous êtes sur 'feature/oauth' qui a divergé de 'main'. Vous devez rejouer vos commits au sommet de 'main', puis faire avancer 'main' en Fast-Forward.",
    missionGoal:
      "Rebaser 'feature/oauth' sur 'main', puis basculer sur 'main' et fusionner en Fast-Forward.",
    initialPreset: "arena-rebase",
    objectives: [
      {
        id: "obj-1",
        label: "Rebaser 'feature/oauth' au sommet du commit d4e501c de 'main'",
        check: (state) => {
          const featHash = state.branches["feature/oauth"]?.targetHash;
          const featCommit = featHash ? state.commits[featHash] : null;
          return Boolean(featCommit && featCommit.parents.includes("d4e501c"));
        },
      },
      {
        id: "obj-2",
        label: "Basculer sur 'main' et intégrer 'feature/oauth' par Fast-Forward",
        check: (state) => {
          const mainHash = state.branches["main"]?.targetHash;
          const featHash = state.branches["feature/oauth"]?.targetHash;
          return Boolean(
            state.head.target === "main" &&
              mainHash &&
              mainHash === featHash &&
              state.commits[mainHash]?.parents.includes("d4e501c")
          );
        },
      },
    ],
    hints: [
      "Depuis 'feature/oauth', lancez : git rebase main",
      "Basculez ensuite sur 'main' : git switch main",
      "Terminez par le Fast-Forward : git merge feature/oauth",
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        command: "git rebase main",
        description:
          "Rejoue les modifications de 'feature/oauth' au-dessus de la pointe actuelle de 'main' (d4e501c) avec un nouveau SHA-1 linéaire.",
      },
      {
        stepNumber: 2,
        command: "git switch main",
        description: "Bascule sur la branche principale 'main'.",
      },
      {
        stepNumber: 3,
        command: "git merge feature/oauth",
        description:
          "Comme 'feature/oauth' a été rebasée au-dessus de 'main', la fusion s'effectue désormais en pur Fast-Forward !",
      },
    ],
    postMortemTakeaway:
      "Un rebase local suivi d'un merge Fast-Forward garantit un historique 100% linéaire tout en respectant la règle d'or : ne jamais rebaser une branche publique.",
  },

  // ==================== DEVOPS LEAD (4 Scenarios) ====================
  {
    id: "inc-404-gitflow-hotfix",
    title: "Urgence Cyber-Sécurité en Production (Hotfix Git Flow)",
    difficulty: "DevOps Lead",
    category: "Git Flow & Hotfix",
    xpReward: 400,
    incidentCode: "INC-404",
    incidentBrief:
      "Alerte Rouge : Une faille critique est exploitée sur la prod ('main' en v1.0.1). La branche 'develop' contient des travaux instables du Sprint 2 et ne peut pas être déployée. Appliquez le protocole strict Hotfix de Git Flow (Slide S108).",
    missionGoal:
      "Créer 'hotfix/sec' depuis 'main', commiter le patch, fusionner dans 'main' avec le tag 'v1.0.2', ET fusionner dans 'develop'.",
    initialPreset: "arena-hotfix",
    objectives: [
      {
        id: "obj-1",
        label: "Positionner 'main' sur le nouveau commit du correctif et poser le tag 'v1.0.2'",
        check: (state) => {
          const mainHash = state.branches["main"]?.targetHash;
          return Boolean(
            mainHash &&
              mainHash !== "c2b345b" &&
              state.tags["v1.0.2"] === mainHash
          );
        },
      },
      {
        id: "obj-2",
        label: "Reporter le correctif dans 'develop' (fusionner le hotfix dans develop)",
        check: (state) => {
          const devHash = state.branches["develop"]?.targetHash;
          const devCommit = devHash ? state.commits[devHash] : null;
          return Boolean(devHash && devHash !== "d2f789d" && devCommit?.isMerge);
        },
      },
    ],
    hints: [
      "1. Basculez d'abord sur 'main' : git switch main",
      "2. Créez la branche hotfix : git switch -c hotfix/sec",
      "3. Validez le patch : git commit -am \"fix: security patch\"",
      "4. Fusionnez dans main et taguez : git switch main && git merge hotfix/sec && git tag v1.0.2",
      "5. Fusionnez aussi dans develop : git switch develop && git merge hotfix/sec",
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        command: "git switch main",
        description: "Se place sur le dernier état stable de production (c2b345b).",
      },
      {
        stepNumber: 2,
        command: "git switch -c hotfix/sec",
        description: "Crée le couloir d'urgence 'hotfix/sec' à partir de 'main'.",
      },
      {
        stepNumber: 3,
        command: 'git commit -am "fix: patch auth guard vulnerability"',
        description: "Indexe et valide immédiatement le correctif de sécurité.",
      },
      {
        stepNumber: 4,
        command: "git switch main && git merge hotfix/sec && git tag v1.0.2",
        description: "Met à jour la production 'main' en Fast-Forward et scelle la version v1.0.2.",
      },
      {
        stepNumber: 5,
        command: "git switch develop && git merge hotfix/sec",
        description:
          "Étape critique : fusionne le hotfix dans 'develop' pour éviter que la faille ne réapparaisse lors de la prochaine release !",
      },
    ],
    postMortemTakeaway:
      "Dans Git Flow (Slide S108), un hotfix part exclusivement de 'main', mais doit impérativement être fusionné à la fois dans 'main' ET dans 'develop'.",
  },
  {
    id: "inc-405-rebase-onto-surgeon",
    title: "Greffe Chirurgicale de Sous-Branche (Rebase --onto)",
    difficulty: "DevOps Lead",
    category: "Rebase & Historique",
    xpReward: 420,
    incidentCode: "INC-405",
    incidentBrief:
      "Scénario classique du cours (Slides S85 & S104) : La branche 'client' (2c33a00) a été créée à partir de la branche 'server' (169a600). Le Lead veut livrer 'client' sur 'main' immédiatement, mais le code de 'server' est encore instable !",
    missionGoal:
      "Utiliser 'git rebase --onto main 169a600' pour greffer uniquement 'client' sur 'main' (c2b345b), puis fusionner 'client' dans 'main' en Fast-Forward.",
    initialPreset: "arena-rebase-onto",
    objectives: [
      {
        id: "obj-1",
        label: "Rebaser 'client' directement sur 'main' (c2b345b) en excluant 'server' (169a600)",
        check: (state) => {
          const clientHash = state.branches["client"]?.targetHash;
          const clientCommit = clientHash ? state.commits[clientHash] : null;
          return Boolean(
            clientCommit && clientCommit.parents.includes("c2b345b")
          );
        },
      },
      {
        id: "obj-2",
        label: "Basculer sur 'main' et fusionner 'client' en Fast-Forward",
        check: (state) => {
          const mainHash = state.branches["main"]?.targetHash;
          const clientHash = state.branches["client"]?.targetHash;
          return Boolean(
            state.head.target === "main" &&
              mainHash &&
              mainHash === clientHash &&
              state.commits[mainHash]?.parents.includes("c2b345b")
          );
        },
      },
    ],
    hints: [
      "1. Vous êtes sur 'client'. Lancez : git rebase --onto main 169a600",
      "2. Basculez sur 'main' : git switch main",
      "3. Fusionnez en Fast-Forward : git merge client",
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        command: "git rebase --onto main 169a600",
        description:
          "Prend uniquement les commits de 'client' postérieurs à 169a600 et les rejoue directement au sommet de 'main' (Slide S85).",
      },
      {
        stepNumber: 2,
        command: "git switch main",
        description: "Se positionne sur 'main'.",
      },
      {
        stepNumber: 3,
        command: "git merge client",
        description: "Avance 'main' par Fast-Forward sur le commit rebasé de 'client'.",
      },
    ],
    postMortemTakeaway:
      "'git rebase --onto <nouvelle-base> <parent-exclu>' (Slide S85) permet d'extraire une sous-branche sans embarquer les commits de sa branche parente intermédiaire.",
  },
  {
    id: "inc-505-cherrypick-reset",
    title: "Extraction Chirurgicale (Cherry-Pick) & Tag Release",
    difficulty: "DevOps Lead",
    category: "Reset & Annulation",
    xpReward: 350,
    incidentCode: "INC-505",
    incidentBrief:
      "Sur 'develop', le commit 2c33a99 corrige un bug bloquant de paiement, mais il est entouré de commits expérimentaux instables (d100a1b et d300c3d). Le Lead vous demande de copier uniquement le commit 2c33a99 sur 'main' sans embarquer le reste de 'develop'.",
    missionGoal:
      "Depuis 'main', copier chirurgicalement le commit 2c33a99 avec cherry-pick et poser le tag 'v2.0.1'.",
    initialPreset: "arena-cherrypick",
    objectives: [
      {
        id: "obj-1",
        label: "Appliquer le commit 2c33a99 sur 'main' via git cherry-pick",
        check: (state) => {
          const mainHash = state.branches["main"]?.targetHash;
          const mainCommit = mainHash ? state.commits[mainHash] : null;
          return Boolean(
            mainHash &&
              mainHash !== "c2b345b" &&
              mainCommit &&
              mainCommit.parents.includes("c2b345b") &&
              mainCommit.message.includes("payment")
          );
        },
      },
      {
        id: "obj-2",
        label: "Poser le tag 'v2.0.1' sur le nouveau commit cherry-pické de 'main'",
        check: (state) => {
          const mainHash = state.branches["main"]?.targetHash;
          return Boolean(mainHash && mainHash !== "c2b345b" && state.tags["v2.0.1"] === mainHash);
        },
      },
    ],
    hints: [
      "Vous êtes sur 'main'. Copiez le commit cible avec : git cherry-pick 2c33a99",
      "Posez ensuite le tag avec : git tag v2.0.1",
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        command: "git cherry-pick 2c33a99",
        description:
          "Extrait uniquement le patch du commit 2c33a99 depuis 'develop' et l'applique sur 'main' avec un nouvel identifiant SHA-1 (Slide S83).",
      },
      {
        stepNumber: 2,
        command: "git tag v2.0.1",
        description: "Tague la nouvelle version patchée de production.",
      },
    ],
    postMortemTakeaway:
      "git cherry-pick (Slide S83) permet d'importer un unique commit sur la branche active sans fusionner toute la branche source.",
  },
  {
    id: "inc-606-hard-reset-purge",
    title: "Purge Totale de Commits Corrompus (Reset --hard)",
    difficulty: "DevOps Lead",
    category: "Reset & Annulation",
    xpReward: 380,
    incidentCode: "INC-606",
    incidentBrief:
      "Deux commits erronés (bad001a et bad002b) contenant des fichiers de secrets ont été validés localement sur 'main'. Vous devez purger intégralement ces 2 commits ainsi que l'Index et le Répertoire de travail (Slide S80), puis sceller le tag 'v1.2-clean'.",
    missionGoal:
      "Exécuter un 'git reset --hard HEAD~2' pour ramener 'main' sur c2b345b en écrasant l'Index et le Working Directory, puis poser le tag 'v1.2-clean'.",
    initialPreset: "arena-reset",
    objectives: [
      {
        id: "obj-1",
        label: "Ramener 'main' sur c2b345b avec Index et Working Directory totalement vides (--hard)",
        check: (state) =>
          state.branches["main"]?.targetHash === "c2b345b" &&
          state.stagingArea.length === 0 &&
          state.workingDirectory.length === 0,
      },
      {
        id: "obj-2",
        label: "Poser le tag 'v1.2-clean' sur le commit restauré c2b345b",
        check: (state) => state.tags["v1.2-clean"] === "c2b345b",
      },
    ],
    hints: [
      "Étape 1 : Purgez les 2 derniers commits en mode --hard : git reset --hard HEAD~2",
      "Étape 2 : Posez le tag : git tag v1.2-clean",
    ],
    solutionSteps: [
      {
        stepNumber: 1,
        command: "git reset --hard HEAD~2",
        description:
          "Recule 'main' de 2 commits (sur c2b345b) et réinitialise intégralement l'Index ET le Working Directory (Slide S80).",
      },
      {
        stepNumber: 2,
        command: "git tag v1.2-clean",
        description: "Certifie l'état propre du dépôt local.",
      },
    ],
    postMortemTakeaway:
      "'git reset --hard' (Slide S80) est la seule variante de reset qui écrase le Working Directory en plus de déplacer HEAD et de réinitialiser l'Index.",
  },
];
