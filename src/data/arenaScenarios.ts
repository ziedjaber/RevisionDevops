import { ArenaScenario } from "@/types/game";

export const arenaScenarios: ArenaScenario[] = [
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
    id: "inc-505-cherrypick-reset",
    title: "Extraction Chirurgicale (Cherry-Pick) & Purge Hard Reset",
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
];
