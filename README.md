# DevOps & Git Mastery Lab 🚀

> Plateforme interactive d'apprentissage, d'entraînement pratique et simulateur visuel de graphe de commits Git, basée sur le cours universitaire **« Plateformes Collaboratives - DevOps & Gestion de version Git »** (ISIMS, Pr. Bassem BOUAZIZ).

---

## 🌟 Présentation Générale

**DevOps & Git Mastery Lab** est une application web moderne développée avec **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide React** et **Framer Motion**.

Elle concrétise les **218 slides** du cursus universitaire d'ingénieur en proposant :
1. **8 Modules de Cours Complets & Interactifs** : du contexte historique Dev vs Ops jusqu'à l'orchestration Docker Compose.
2. **Un Simulateur Graphique du Graphe de Commits Git** : moteur in-memory avec visualisateur SVG multi-branches, gestion du pointeur `HEAD` (attaché ou détaché), les 3 zones locales (Working Directory, Staging Area, Local Repository) et un terminal interactif avec auto-complétion.
3. **Un Laboratoire d'Exercices Pratiques** : 6 scénarios industriels concrets (conflit de merge, rebase interactif, récupération de commit orphelin, hotfix Git Flow, cache GitLab CI, Service Discovery Docker) avec indices progressifs et solutions pas à pas.
4. **Un Examen Blanc & Certification ISIMS** : QCM de 20 questions approfondies avec explications détaillées et références directes aux slides du cours.
5. **Outils Développeur** : Générateur de configurations `.gitlab-ci.yml` et `docker-compose.yml` en temps réel, plus un aide-mémoire (Cheat Sheet) Git exhaustif.

---

## 🎨 Direction Artistique & Design System (Luxury Tech Minimalist)

- **Palette :**
  - Fond sombre profond : `#090A0F` / `#0B0D14` avec gradients radiaux et effets de halo subtils.
  - Cartes et panneaux : `zinc-900/80` et `zinc-950/90` avec effet verre biseauté (*glassmorphism*).
  - Bordures lumineuses : `border-zinc-800` avec lueurs ciblées.
  - Accents dorés / ambrés : `amber-400` / `amber-500` pour l'élégance et la hiérarchie.
  - Accents cyan / émeraude : `cyan-400` / `emerald-400` pour les états Git réussis et les liaisons du graphe.
- **Typographie :**
  - Sans-serif moderne : Inter / system sans-serif haute lisibilité.
  - Monospace : JetBrains Mono / Fira Code pour le code, les hachages SHA-1 et les commandes CLI.
- **Micro-interactions :** Animations douces, feedback instantané lors des validations et célébrations confettis lors des réussites d'exercices.

---

## 📚 Programme Académique Couvert (8 Chapitres ISIMS)

| Chapitre | Titre du Module | Slides Réf. | Concepts Clés & Outils Visuels |
|---|---|---|---|
| **1** | **Le Contexte & Origines de DevOps** | S2 à S7 | Conflit Dev (vélocité) vs Ops (stabilité/MTTR), Wall of Confusion, Cycle de vie en 4 phases, Triangle moderne. |
| **2** | **L'Évolution des Architectures** | S8 à S25 | Monolithe (WAR), Client/Serveur 2N/3N, SOA avec Bus ESB, Microservices Cloud-Native, Diagramme comparatif interactif. |
| **3** | **API REST, JSON & Opérations CRUD** | S26 à S34 | Principes de Roy Fielding, Stateless, Uniform Interface, Mapping Verbes HTTP (GET/POST/PUT/PATCH/DELETE) vers CRUD. |
| **4** | **Les Concepts Clés des Microservices** | S35 à S38 | Règle de la *Two-Pizza Team* (6-10 pers), Polyglotisme (Scala, Python, Java, Node), Déploiement ciblé et isolation des pannes. |
| **5** | **Culture DevOps & Modèle CAMS** | S39 à S46 | Culture, Automation, Measurement, Sharing. Les 3 paliers : Intégration Continue (CI) ➔ Livraison Continue ➔ Déploiement Continu. |
| **6** | **Git : Versioning Distribué** | S47 à S147 | Snapshots SHA-1, les 3 zones (WorkDir, Index, .git), Fast-Forward vs 3-Way Merge, Rebase linéaire, Git Flow vs Trunk-Based. |
| **7** | **GitLab CI : Pipelines & Déploiements** | S148 à S172 | Coordinateur vs Runners, `.gitlab-ci.yml`, stages, gestion du cache (`cache:`) vs artefacts (`artifacts:`), validation Merge Request. |
| **8** | **Docker & Docker Compose** | S173 à S217 | Conteneurs vs VM (partage du noyau hôte), Docker Engine (dockerd, API, CLI), Layers, Volumes, Pilotes réseaux, DNS Service Discovery. |

---

## ⚡ Fonctionnalités du Simulateur Git Interactif

Le simulateur reproduit le comportement exact du CLI Git :
- **Commandes supportées :**
  - `git init`
  - `git status`
  - `git add <fichier>` / `git add .`
  - `git commit -m "..."`
  - `git commit --amend -m "..."`
  - `git branch <nom>` / `git branch -d <nom>`
  - `git switch <nom>` / `git checkout <nom>`
  - `git switch -c <nom>` / `git checkout -b <nom>`
  - `git checkout <hash>` *(démonstration interactive de l'état HEAD détachée)*
  - `git merge <branche>` *(détection automatique Fast-Forward vs commit 3-Way merge)*
  - `git rebase <cible>` *(réapplication séquentielle des commits)*
  - `git cherry-pick <hash>`
  - `git reset --soft/--mixed/--hard <cible>`
  - `git tag <nom>`
  - `git stash` / `git stash pop`
  - `git log`
- **Visualisation SVG réactive :**
  - Trajectoires courbes de fusion reliant les commits parents et enfants.
  - Badges de branches aux couleurs distinctes (`main`, `develop`, `feature/*`, `hotfix/*`).
  - Badge spécial du pointeur `HEAD` (soit fixé sur une branche, soit en état détaché sur un hash SHA-1 précis).
- **Scénarios préconfigurés en 1 clic :**
  - Dépôt Standard
  - Branches Divergentes (idéal pour tester merge vs rebase)
  - Scénario Git Flow complet
  - Piège du Detached HEAD (avec guide de sauvetage)

---

## 🧪 Scénarios du Laboratoire d'Exercices Pratiques

1. **Résolution de Conflit de Fusion (3-Way Merge)** : arbitrage des balises `<<<<<<< HEAD`, indexation et finalisation du commit de merge.
2. **Nettoyer l'Historique avant Pull Request (Git Rebase)** : alignement linéaire et respect de la règle d'or du rebase.
3. **Sauvetage du Detached HEAD** : sécurisation des commits orphelins via `git switch -c`.
4. **Sauvetage d'Urgence en Production (Hotfix Git Flow)** : création de la branche depuis `main`, tagging `v1.0.2` et double fusion `main` + `develop`.
5. **Conception d'une Pipeline GitLab CI Robuste** : configuration optimale du cache, des artefacts et du déclenchement manuel en production.
6. **Orchestration Multi-Conteneurs & Service Discovery** : configuration d'un environnement Web + PostgreSQL + Redis dans `docker-compose.yml` exploitant le DNS interne de Docker.

---

## 🛠️ Installation & Démarrage Local

### Prérequis
- **Node.js** v18+ ou v20+
- **npm** ou **pnpm**

### Installation
\`\`\`bash
# Cloner ou naviguer dans le dossier du projet
cd "projet de revision"

# Installer les dépendances
npm install
\`\`\`

### Démarrage en Mode Développement
\`\`\`bash
npm run dev
\`\`\`
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build de Production
\`\`\`bash
npm run build
npm start
\`\`\`

---

## 🏛️ Crédits & Références
- **Institution :** Institut Supérieur d'Informatique et de Multimédia de Sfax (ISIMS).
- **Matière :** Plateformes Collaboratives - DevOps & Gestion de version Git.
- **Enseignants :** Pr. Bassem BOUAZIZ, Elies Jebri.
- **Références bibliographiques :**
  - Mikael Krief, *Learning DevOps*, Packt Publishing.
  - Stéphane Goudeau & Samuel Metias, *Découvrir DevOps*, Dunod.
  - Pro Git Book (*git-scm.com*).
