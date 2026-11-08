"use client";

import React, { useState } from "react";
import { Search, Copy, Check, Terminal, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface CheatItem {
  cmd: string;
  desc: string;
  category: "Bases & Dépôt" | "Branches & Navigation" | "Fusions & Historique" | "Annulations & Stash" | "Distant (Remote)";
  warning?: string;
}

const cheatItems: CheatItem[] = [
  {
    cmd: "git init",
    desc: "Initialise un nouveau dépôt Git local dans le répertoire courant.",
    category: "Bases & Dépôt",
  },
  {
    cmd: "git status",
    desc: "Affiche l'état des fichiers modifiés, indexés et non suivis.",
    category: "Bases & Dépôt",
  },
  {
    cmd: "git add <fichier>",
    desc: "Ajoute un fichier spécifique à la Staging Area (Index).",
    category: "Bases & Dépôt",
  },
  {
    cmd: "git add .",
    desc: "Indexe l'ensemble des fichiers modifiés et nouveaux dans la Staging Area.",
    category: "Bases & Dépôt",
  },
  {
    cmd: 'git commit -m "message"',
    desc: "Enregistre un nouvel instantané (snapshot SHA-1) dans le dépôt local.",
    category: "Bases & Dépôt",
  },
  {
    cmd: 'git commit --amend -m "nouveau message"',
    desc: "Remplace le tout dernier commit local par une nouvelle version modifiée.",
    category: "Bases & Dépôt",
    warning: "Ne jamais modifier un commit déjà poussé sur un dépôt partagé !",
  },
  {
    cmd: "git branch",
    desc: "Liste toutes les branches locales avec astérisque sur la branche active.",
    category: "Branches & Navigation",
  },
  {
    cmd: "git branch <nom>",
    desc: "Crée une nouvelle branche ancrée sur le commit courant.",
    category: "Branches & Navigation",
  },
  {
    cmd: "git switch <branche>",
    desc: "Bascule sur la branche spécifiée (commande moderne remplaçant checkout).",
    category: "Branches & Navigation",
  },
  {
    cmd: "git switch -c <nouvelle-branche>",
    desc: "Crée une nouvelle branche et bascule immédiatement dessus.",
    category: "Branches & Navigation",
  },
  {
    cmd: "git checkout <commit_hash>",
    desc: "Bascule HEAD sur un commit précis (Attention : état Detached HEAD).",
    category: "Branches & Navigation",
    warning: "Créez une branche avec 'git switch -c' si vous voulez commiter ici.",
  },
  {
    cmd: "git branch -d <branche>",
    desc: "Supprime une branche locale déjà fusionnée.",
    category: "Branches & Navigation",
  },
  {
    cmd: "git merge <branche>",
    desc: "Fusionne la branche spécifiée dans la branche active (Fast-forward ou 3-way).",
    category: "Fusions & Historique",
  },
  {
    cmd: "git rebase <cible>",
    desc: "Rejoue les commits de la branche active au sommet de la branche cible.",
    category: "Fusions & Historique",
    warning: "« No one shall rebase a shared branch » : Interdit sur branches publiques.",
  },
  {
    cmd: "git cherry-pick <hash>",
    desc: "Copie chirurgicalement un commit d'une autre branche sur la branche active.",
    category: "Fusions & Historique",
  },
  {
    cmd: "git log --oneline --graph --all",
    desc: "Affiche l'arbre historique complet des branches sous forme graphique condensée.",
    category: "Fusions & Historique",
  },
  {
    cmd: "git reset --soft HEAD~1",
    desc: "Annule le dernier commit mais conserve les fichiers indexés dans le Staging.",
    category: "Annulations & Stash",
  },
  {
    cmd: "git reset --mixed HEAD~1",
    desc: "Annule le dernier commit et vide le Staging, conserve les fichiers modifiés.",
    category: "Annulations & Stash",
  },
  {
    cmd: "git reset --hard HEAD~1",
    desc: "Détruit définitivement le dernier commit et annule toutes les modifications.",
    category: "Annulations & Stash",
    warning: "Action destructrice irréversible pour le travail non validé.",
  },
  {
    cmd: "git stash",
    desc: "Met de côté les modifications de travail en cours et nettoie l'arbre.",
    category: "Annulations & Stash",
  },
  {
    cmd: "git stash pop",
    desc: "Restaure les dernières modifications mises de côté dans le stash.",
    category: "Annulations & Stash",
  },
  {
    cmd: "git remote add origin <url>",
    desc: "Associe un dépôt distant au dépôt local sous l'alias 'origin'.",
    category: "Distant (Remote)",
  },
  {
    cmd: "git fetch origin",
    desc: "Télécharge les commits et branches du serveur sans toucher à vos fichiers locaux.",
    category: "Distant (Remote)",
  },
  {
    cmd: "git pull origin <branche>",
    desc: "Récupère les nouveautés distantes et les fusionne immédiatement (fetch + merge).",
    category: "Distant (Remote)",
  },
  {
    cmd: "git push -u origin <branche>",
    desc: "Envoie les commits locaux vers la branche distante et configure le suivi.",
    category: "Distant (Remote)",
  },
];

export const GitCheatSheet: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const categories = [
    "All",
    "Bases & Dépôt",
    "Branches & Navigation",
    "Fusions & Historique",
    "Annulations & Stash",
    "Distant (Remote)",
  ];

  const filtered = cheatItems.filter((item) => {
    const matchCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch =
      item.cmd.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Search & Filter Header */}
      <div className="p-6 rounded-3xl border border-zinc-800 bg-[#0F121C]/90 backdrop-blur-xl shadow-subtle-card space-y-4">
        <div>
          <Badge variant="gold">Référence Rapide</Badge>
          <h2 className="text-xl font-bold text-zinc-100 mt-2">
            Aide-Mémoire Exhaustif des Commandes Git (ISIMS Cheat Sheet)
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Retrouvez rapidement la syntaxe exacte, les options critiques et les mises en garde pour chaque commande.
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une commande ou une explication (ex: rebase, detached, reset, tag)..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === c
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {c === "All" ? "Toutes les commandes" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Commands List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900/90 transition-all space-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <button
                  onClick={() => handleCopy(item.cmd)}
                  className="text-zinc-500 hover:text-amber-400 text-xs flex items-center gap-1 transition-colors"
                  title="Copier la commande"
                >
                  {copiedCmd === item.cmd ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <pre className="p-2 rounded-lg bg-black text-amber-300 font-mono text-xs overflow-x-auto border border-zinc-800/80">
                $ {item.cmd}
              </pre>

              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{item.desc}</p>
            </div>

            {item.warning && (
              <div className="mt-2 pt-2 border-t border-zinc-800 text-[11px] text-rose-300 flex items-start gap-1.5">
                <span>⚠️</span>
                <span>{item.warning}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
