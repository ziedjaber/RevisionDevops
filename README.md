# ⚡ DevOps & Git Drill Arena — 100% Practice Platform

> Plateforme web interactive d'entraînement intensif (**"Drill & Challenge Platform"**) dédiée à la maîtrise opérationnelle de **Git**, **GitLab CI** et **Docker / Microservices**, sans aucun cours théorique magistral — **100% pratique pure**.

Développée avec **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion** et **Lucide React**.

---

## 🎯 Architecture des 4 Modes d'Entraînement & Gamification

### 1. 🚨 Mode 1 : Arena de Problèmes & Scénarios Réels de Prod ([`ProductionArena.tsx`](file:///d:/Work/Cycle%20ingenieur/Cycle/2eme%20année/Devops/projet%20de%20revision/src/components/arena/ProductionArena.tsx))
- **6 Incidents de Production Réels (`INC-101` à `INC-505`)** classés par niveau (**Junior**, **Mid**, **DevOps Lead**) :
  - `INC-101` : Sauvetage d'un Commit Orphelin en **Detached HEAD** (`git switch -c` + `merge`).
  - `INC-102` : Livraison Linéaire par **Fast-Forward**, tagging `v1.1` et nettoyage de branche.
  - `INC-202` : Intégration de Branches Divergentes via **3-Way Merge** (commit à 2 parents).
  - `INC-301` : Réécriture Linéaire avant Merge Request (**Git Rebase** + Fast-Forward).
  - `INC-404` : Urgence Cyber-Sécurité en Production (**Hotfix Git Flow** sur `main` ET `develop` avec tag `v1.0.2`).
  - `INC-505` : Extraction Chirurgicale d'un correctif (**Git Cherry-Pick**) sans embarquer les commits instables.
- **Validation des objectifs en temps réel** directement sur l'état du graphe Git (`GitRepoState`).
- **Bouton « Exécuter Étape sur le Graphe (Pas à Pas) »** : permet d'animer visuellement la résolution étape par étape sur le graphe SVG.

### 2. 💻 Mode 2 : Terminal Interactif — Command Drills ([`CommandDrillMode.tsx`](file:///d:/Work/Cycle%20ingenieur/Cycle/2eme%20année/Devops/projet%20de%20revision/src/components/drills/CommandDrillMode.tsx))
- **18 Missions CLI rapides** réparties en 3 niveaux (**Junior**, **Mid**, **DevOps Lead**).
- Validation syntaxique instantanée par expressions régulières tolérantes (`git diff --staged` / `--cached`, `git switch -c` / `git checkout -b`, `git rebase --onto`, `git reset --soft HEAD~3`, `docker run -p 8000:80`, `docker-compose up -d`, etc.).
- Multiplicateur de score actif selon la série en cours (**Streak x1.5**, **x2**).

### 3. ⏱️ Mode 3 : Quiz & QCM Chronométrés / Scorés ([`TimedQuizArena.tsx`](file:///d:/Work/Cycle%20ingenieur/Cycle/2eme%20année/Devops/projet%20de%20revision/src/components/quiz/TimedQuizArena.tsx))
- **24 Questions Techniques** réparties par niveau (**Junior** 30s/q, **Mid** 35s/q, **DevOps Lead** 40s/q, ou **Marathon Complet**).
- Calcul de **Bonus de Vitesse** + **Multiplicateur de Streak**.
- **Bilan Post-Match & Récapitulatif Détaillé des Erreurs** avec bouton **« Re-tester uniquement mes erreurs »**.

### 4. 🌿 Mode 4 : Simulateur Libre du Graphe Git ([`GitSimulator.tsx`](file:///d:/Work/Cycle%20ingenieur/Cycle/2eme%20année/Devops/projet%20de%20revision/src/components/simulator/GitSimulator.tsx))
- Bac à sable graphique complet avec rendu SVG des commits SHA-1, courbes de fusion, pointeur `HEAD` (attaché ou détaché), inspecteur des **3 Zones Locales** (*Working Directory*, *Staging Area*, *Local Repository*) et presets en 1 clic.

### 5. 🏆 Système de Gamification & Journal Post-Mortem ([`SkillBadgesAndErrors.tsx`](file:///d:/Work/Cycle%20ingenieur/Cycle/2eme%20année/Devops/projet%20de%20revision/src/components/gamification/SkillBadgesAndErrors.tsx))
- **Score XP en direct**, progression de rang (*Junior DevOps Operator* ➔ *Mid Git & Docker Engineer* ➔ *Senior CI/CD Architect* ➔ *Principal DevOps Lead*) et **compteur de Streak** (`🔥`).
- **12 Badges de Compétences** (*Bronze*, *Silver*, *Gold*, *Diamond*) débloqués automatiquement avec notification toast.
- **Récapitulatif Détaillé des Erreurs (Error Vault)** : consigne chaque commande ou réponse erronée avec comparaison côte à côte (`✗ Votre tentative` vs `✓ Solution attendue`) et diagnostic technique.

---

## 🚀 Démarrage Rapide

```bash
# Lancer le serveur de développement
npm run dev

# Build de production
npm run build
npm start
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000).
