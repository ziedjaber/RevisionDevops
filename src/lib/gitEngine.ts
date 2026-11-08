import { GitRepoState, GitCommit, GitBranch, CommandOutput } from "@/types/git";
import { generateShortId } from "./utils";

const BRANCH_COLORS = [
  "#06B6D4", // cyan
  "#F59E0B", // amber
  "#10B981", // emerald
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#3B82F6", // blue
  "#F97316", // orange
  "#14B8A6", // teal
];

export function getInitialRepoState(): GitRepoState {
  const c1Hash = "c1a012a";
  const c2Hash = "c2b345b";
  const c3Hash = "c3c678c";

  const commits: Record<string, GitCommit> = {
    [c1Hash]: {
      hash: c1Hash,
      shortHash: c1Hash,
      parents: [],
      message: "feat: initial commit (project structure)",
      author: "Bassem B.",
      timestamp: "Il y a 3 jours",
      lane: 0,
    },
    [c2Hash]: {
      hash: c2Hash,
      shortHash: c2Hash,
      parents: [c1Hash],
      message: "feat: add user authentication module",
      author: "Bassem B.",
      timestamp: "Il y a 2 jours",
      lane: 0,
    },
    [c3Hash]: {
      hash: c3Hash,
      shortHash: c3Hash,
      parents: [c2Hash],
      message: "fix: update token expiration logic",
      author: "Bassem B.",
      timestamp: "Il y a 1 jour",
      lane: 0,
    },
  };

  const branches: Record<string, GitBranch> = {
    main: {
      name: "main",
      targetHash: c3Hash,
      isCurrent: true,
      color: "#06B6D4",
    },
  };

  return {
    commits,
    branches,
    tags: {
      "v1.0.0": c2Hash,
    },
    head: {
      type: "branch",
      target: "main",
    },
    stagingArea: [],
    workingDirectory: ["config/app.json", "src/auth/service.ts"],
    stash: [],
    currentLaneCount: 1,
  };
}

export function getPresetState(preset: string): GitRepoState {
  const base = getInitialRepoState();

  if (preset === "divergent") {
    // main has c1 -> c2 -> c3 -> c4
    // feature has c1 -> c2 -> f1 -> f2
    const c1 = "c1a012a";
    const c2 = "c2b345b";
    const c3 = "c3c678c";
    const c4 = "c4d901d";
    const f1 = "f1e234e";
    const f2 = "f2a567f";

    const commits: Record<string, GitCommit> = {
      [c1]: { hash: c1, shortHash: c1, parents: [], message: "chore: init repo", author: "DevOps", timestamp: "3j", lane: 0 },
      [c2]: { hash: c2, shortHash: c2, parents: [c1], message: "feat: add base API", author: "DevOps", timestamp: "2j", lane: 0 },
      [c3]: { hash: c3, shortHash: c3, parents: [c2], message: "docs: update API endpoints", author: "Alice", timestamp: "1j", lane: 0 },
      [c4]: { hash: c4, shortHash: c4, parents: [c3], message: "perf: add Redis cache", author: "Alice", timestamp: "5h", lane: 0 },
      [f1]: { hash: f1, shortHash: f1, parents: [c2], message: "feat: OAuth2 Google login", author: "Bob", timestamp: "1j", lane: 1 },
      [f2]: { hash: f2, shortHash: f2, parents: [f1], message: "test: unit tests for OAuth", author: "Bob", timestamp: "3h", lane: 1 },
    };

    return {
      commits,
      branches: {
        main: { name: "main", targetHash: c4, isCurrent: true, color: "#06B6D4" },
        "feature/oauth": { name: "feature/oauth", targetHash: f2, isCurrent: false, color: "#F59E0B" },
      },
      tags: { "v1.0": c2 },
      head: { type: "branch", target: "main" },
      stagingArea: [],
      workingDirectory: ["README.md"],
      stash: [],
      currentLaneCount: 2,
    };
  }

  if (preset === "gitflow") {
    // main, develop, feature/cart, hotfix/security
    const c1 = "c1a012a";
    const c2 = "c2b345b";
    const dev1 = "d1e456d";
    const dev2 = "d2f789d";
    const feat1 = "f1a111f";
    const hotfix1 = "h1b222h";

    const commits: Record<string, GitCommit> = {
      [c1]: { hash: c1, shortHash: c1, parents: [], message: "release: v1.0.0", author: "Lead", timestamp: "4j", lane: 0 },
      [c2]: { hash: c2, shortHash: c2, parents: [c1], message: "release: v1.0.1", author: "Lead", timestamp: "3j", lane: 0 },
      [dev1]: { hash: dev1, shortHash: dev1, parents: [c2], message: "chore: start sprint 2", author: "Dev", timestamp: "2j", lane: 1 },
      [dev2]: { hash: dev2, shortHash: dev2, parents: [dev1], message: "feat: add payment gateway", author: "Dev", timestamp: "1j", lane: 1 },
      [feat1]: { hash: feat1, shortHash: feat1, parents: [dev2], message: "feat: Stripe webhook handler", author: "Dev", timestamp: "4h", lane: 2 },
      [hotfix1]: { hash: hotfix1, shortHash: hotfix1, parents: [c2], message: "hotfix: SQL injection patch (CVE-2026)", author: "SecOps", timestamp: "2h", lane: 3 },
    };

    return {
      commits,
      branches: {
        main: { name: "main", targetHash: c2, isCurrent: false, color: "#06B6D4" },
        develop: { name: "develop", targetHash: dev2, isCurrent: true, color: "#10B981" },
        "feature/cart": { name: "feature/cart", targetHash: feat1, isCurrent: false, color: "#8B5CF6" },
        "hotfix/security": { name: "hotfix/security", targetHash: hotfix1, isCurrent: false, color: "#EC4899" },
      },
      tags: { "v1.0.1": c2 },
      head: { type: "branch", target: "develop" },
      stagingArea: ["src/payments/stripe.ts"],
      workingDirectory: [],
      stash: [],
      currentLaneCount: 4,
    };
  }

  if (preset === "detached") {
    // HEAD points directly to a commit hash c2b345b
    const c1 = "c1a012a";
    const c2 = "c2b345b";
    const c3 = "c3c678c";

    const commits: Record<string, GitCommit> = {
      [c1]: { hash: c1, shortHash: c1, parents: [], message: "chore: init", author: "Bassem", timestamp: "3j", lane: 0 },
      [c2]: { hash: c2, shortHash: c2, parents: [c1], message: "feat: core engine v1", author: "Bassem", timestamp: "2j", lane: 0 },
      [c3]: { hash: c3, shortHash: c3, parents: [c2], message: "feat: analytics tracker", author: "Bassem", timestamp: "1j", lane: 0 },
    };

    return {
      commits,
      branches: {
        main: { name: "main", targetHash: c3, isCurrent: false, color: "#06B6D4" },
      },
      tags: { "v1.0": c2 },
      head: { type: "detached", target: c2 },
      stagingArea: [],
      workingDirectory: ["experiment.ts"],
      stash: [],
      currentLaneCount: 1,
    };
  }

  return base;
}

export function getCurrentCommitHash(state: GitRepoState): string | null {
  if (state.head.type === "branch") {
    const branch = state.branches[state.head.target];
    return branch ? branch.targetHash : null;
  }
  return state.head.target;
}

export function executeGitCommand(
  rawCommand: string,
  state: GitRepoState
): { nextState: GitRepoState; output: CommandOutput } {
  const trimmed = rawCommand.trim();
  const next: GitRepoState = JSON.parse(JSON.stringify(state));
  const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  if (!trimmed.startsWith("git")) {
    return {
      nextState: state,
      output: {
        command: rawCommand,
        output: `bash: commande introuvable: ${trimmed.split(" ")[0]}. Tapez une commande commençant par 'git'.`,
        type: "error",
        timestamp: now,
      },
    };
  }

  const parts = trimmed.split(/\s+/);
  const subCmd = parts[1];

  // 1. git init
  if (subCmd === "init") {
    const fresh = getInitialRepoState();
    return {
      nextState: fresh,
      output: {
        command: rawCommand,
        output: "Dépôt Git vide initialisé dans /workspace/devops-lab/.git/",
        type: "success",
        timestamp: now,
      },
    };
  }

  // 2. git status
  if (subCmd === "status") {
    const headInfo =
      next.head.type === "branch"
        ? `Sur la branche ${next.head.target}`
        : `HEAD détachée sur ${next.head.target.slice(0, 7)}`;

    let statusText = `${headInfo}\n`;
    if (next.stagingArea.length > 0) {
      statusText += `\nModifications qui seront validées :\n  (utilisez "git restore --staged <fichier>..." pour désindexer)\n`;
      next.stagingArea.forEach((f) => {
        statusText += `\t\x1b[32mnouveau fichier:   ${f}\x1b[0m\n`;
      });
    }

    if (next.workingDirectory.length > 0) {
      statusText += `\nModifications qui ne sont pas indexées pour validation :\n  (utilisez "git add <fichier>..." pour mettre à jour)\n`;
      next.workingDirectory.forEach((f) => {
        statusText += `\t\x1b[31mmodifié:         ${f}\x1b[0m\n`;
      });
    }

    if (next.stagingArea.length === 0 && next.workingDirectory.length === 0) {
      statusText += "\narbre de travail propre, rien à valider.";
    }

    return {
      nextState: state,
      output: {
        command: rawCommand,
        output: statusText,
        type: "info",
        timestamp: now,
      },
    };
  }

  // 3. git add
  if (subCmd === "add") {
    const fileTarget = parts[2];
    if (!fileTarget) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "Erreur: Rien spécifié, rien ajouté. Ex: git add . ou git add fichier.ts",
          type: "error",
          timestamp: now,
        },
      };
    }

    if (fileTarget === "." || fileTarget === "-A") {
      next.stagingArea = Array.from(new Set([...next.stagingArea, ...next.workingDirectory]));
      next.workingDirectory = [];
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `Indexation de ${next.stagingArea.length} fichier(s) vers la Staging Area (Index).`,
          type: "success",
          timestamp: now,
        },
      };
    }

    // specific file
    next.stagingArea = Array.from(new Set([...next.stagingArea, fileTarget]));
    next.workingDirectory = next.workingDirectory.filter((f) => f !== fileTarget);
    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `Fichier '${fileTarget}' ajouté à la Staging Area.`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 4. git commit
  if (subCmd === "commit") {
    const isAmend = trimmed.includes("--amend");
    const isAll = trimmed.includes("-a") || trimmed.includes("-am");

    // parse commit message
    const msgMatch = trimmed.match(/-m\s+["']([^"']+)["']/);
    let message = msgMatch ? msgMatch[1] : "commit standard";

    if (isAll) {
      next.stagingArea = Array.from(new Set([...next.stagingArea, ...next.workingDirectory]));
      next.workingDirectory = [];
    }

    if (next.stagingArea.length === 0 && !isAmend) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "rien à valider, la copie de travail est propre (utilisez 'git add' d'abord).",
          type: "warning",
          timestamp: now,
        },
      };
    }

    const currentHash = getCurrentCommitHash(next);

    if (isAmend && currentHash && next.commits[currentHash]) {
      const existing = next.commits[currentHash];
      const newHash = generateShortId();
      delete next.commits[currentHash];

      next.commits[newHash] = {
        ...existing,
        hash: newHash,
        shortHash: newHash,
        message: msgMatch ? message : existing.message + " (amended)",
        timestamp: "À l'instant",
      };

      if (next.head.type === "branch") {
        next.branches[next.head.target].targetHash = newHash;
      } else {
        next.head.target = newHash;
      }

      next.stagingArea = [];
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `[${next.head.type === "branch" ? next.head.target : "HEAD détachée"} ${newHash}] (amend) ${next.commits[newHash].message}`,
          type: "success",
          timestamp: now,
        },
      };
    }

    const newHash = generateShortId();
    const parentHashes = currentHash ? [currentHash] : [];

    // determine lane
    let lane = 0;
    if (next.head.type === "branch") {
      const branchName = next.head.target;
      const branchKeys = Object.keys(next.branches);
      const bIdx = branchKeys.indexOf(branchName);
      lane = bIdx >= 0 ? bIdx : 0;
    } else {
      lane = next.currentLaneCount;
    }

    next.commits[newHash] = {
      hash: newHash,
      shortHash: newHash,
      parents: parentHashes,
      message,
      author: "Ingénieur DevOps",
      timestamp: "À l'instant",
      lane,
    };

    if (next.head.type === "branch") {
      next.branches[next.head.target].targetHash = newHash;
    } else {
      next.head.target = newHash;
    }

    const filesCommittedCount = Math.max(1, next.stagingArea.length);
    next.stagingArea = [];

    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `[${next.head.type === "branch" ? next.head.target : "HEAD détachée"} ${newHash}] ${message}\n ${filesCommittedCount} fichier(s) modifié(s), ${Math.floor(Math.random() * 20) + 5} insertions(+)`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 5. git branch
  if (subCmd === "branch") {
    const isDelete = parts.includes("-d") || parts.includes("-D");
    if (isDelete) {
      const branchToDelete = parts[parts.length - 1];
      if (!next.branches[branchToDelete]) {
        return {
          nextState: state,
          output: {
            command: rawCommand,
            output: `Erreur: Branche '${branchToDelete}' introuvable.`,
            type: "error",
            timestamp: now,
          },
        };
      }
      if (next.head.type === "branch" && next.head.target === branchToDelete) {
        return {
          nextState: state,
          output: {
            command: rawCommand,
            output: `Erreur: Impossible de supprimer la branche active '${branchToDelete}'. Basculez d'abord sur une autre branche.`,
            type: "error",
            timestamp: now,
          },
        };
      }
      delete next.branches[branchToDelete];
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `Branche '${branchToDelete}' supprimée avec succès.`,
          type: "success",
          timestamp: now,
        },
      };
    }

    const branchName = parts[2];
    if (!branchName) {
      // list branches
      const branchList = Object.keys(next.branches)
        .map((b) => (next.head.type === "branch" && next.head.target === b ? `* \x1b[32m${b}\x1b[0m` : `  ${b}`))
        .join("\n");
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: branchList,
          type: "info",
          timestamp: now,
        },
      };
    }

    if (next.branches[branchName]) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: `Erreur fatale: Une branche nommée '${branchName}' existe déjà.`,
          type: "error",
          timestamp: now,
        },
      };
    }

    const currentHash = getCurrentCommitHash(next);
    if (!currentHash) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "Erreur: Pas de commit sur lequel ancrer la nouvelle branche.",
          type: "error",
          timestamp: now,
        },
      };
    }

    const colorIndex = Object.keys(next.branches).length % BRANCH_COLORS.length;
    next.branches[branchName] = {
      name: branchName,
      targetHash: currentHash,
      isCurrent: false,
      color: BRANCH_COLORS[colorIndex],
    };
    next.currentLaneCount = Object.keys(next.branches).length;

    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `Nouvelle branche '${branchName}' créée à partir de ${currentHash.slice(0, 7)}.`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 6. git checkout or git switch
  if (subCmd === "checkout" || subCmd === "switch") {
    const isNewBranch = parts.includes("-b") || parts.includes("-c");
    let target = isNewBranch ? parts[parts.indexOf("-b") >= 0 ? parts.indexOf("-b") + 1 : parts.indexOf("-c") + 1] : parts[2];

    if (!target) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "Erreur: Spécifiez une branche ou un commit cible.",
          type: "error",
          timestamp: now,
        },
      };
    }

    // create new branch and checkout
    if (isNewBranch) {
      const currentHash = getCurrentCommitHash(next);
      if (!currentHash) {
        return {
          nextState: state,
          output: {
            command: rawCommand,
            output: "Erreur: Impossible de créer une branche sans commit initial.",
            type: "error",
            timestamp: now,
          },
        };
      }

      Object.values(next.branches).forEach((b) => (b.isCurrent = false));
      const colorIndex = Object.keys(next.branches).length % BRANCH_COLORS.length;
      next.branches[target] = {
        name: target,
        targetHash: currentHash,
        isCurrent: true,
        color: BRANCH_COLORS[colorIndex],
      };
      next.head = { type: "branch", target };
      next.currentLaneCount = Object.keys(next.branches).length;

      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `Bascule sur la nouvelle branche '${target}'`,
          type: "success",
          timestamp: now,
        },
      };
    }

    // checkout existing branch
    if (next.branches[target]) {
      Object.values(next.branches).forEach((b) => (b.isCurrent = false));
      next.branches[target].isCurrent = true;
      next.head = { type: "branch", target };
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `Bascule sur la branche '${target}'\nVotre branche est à jour avec 'origin/${target}'.`,
          type: "success",
          timestamp: now,
        },
      };
    }

    // checkout by commit hash -> DETACHED HEAD!
    const targetCommit = Object.keys(next.commits).find(
      (h) => h === target || h.startsWith(target)
    );

    if (targetCommit) {
      Object.values(next.branches).forEach((b) => (b.isCurrent = false));
      next.head = { type: "detached", target: targetCommit };
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `Note : passage en état 'HEAD détachée' sur ${targetCommit.slice(0, 7)}.\nVous pouvez inspecter, faire des modifications expérimentales et les valider, puis abandonner les commits sans impacter aucune branche en basculant sur une autre.\n\nSi vous souhaitez créer une nouvelle branche pour conserver vos commits : git switch -c <nom-de-la-nouvelle-branche>`,
          type: "warning",
          timestamp: now,
        },
      };
    }

    return {
      nextState: state,
      output: {
        command: rawCommand,
        output: `Erreur: Référence '${target}' inconnue (branche ou commit introuvable).`,
        type: "error",
        timestamp: now,
      },
    };
  }

  // 7. git merge
  if (subCmd === "merge") {
    const sourceBranchName = parts[2];
    if (!sourceBranchName || !next.branches[sourceBranchName]) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: `Erreur: Branche source '${sourceBranchName || ""}' introuvable.`,
          type: "error",
          timestamp: now,
        },
      };
    }

    if (next.head.type !== "branch") {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "Erreur: Impossible de fusionner en état HEAD détachée. Basculez d'abord sur une branche.",
          type: "error",
          timestamp: now,
        },
      };
    }

    const currentBranchName = next.head.target;
    if (currentBranchName === sourceBranchName) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "Déjà à jour (tentative de fusion de la branche avec elle-même).",
          type: "info",
          timestamp: now,
        },
      };
    }

    const headHash = next.branches[currentBranchName].targetHash;
    const sourceHash = next.branches[sourceBranchName].targetHash;

    if (headHash === sourceHash) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "Déjà à jour.",
          type: "info",
          timestamp: now,
        },
      };
    }

    // Check Fast-Forward: is current HEAD an ancestor of sourceHash?
    let isFastForward = false;
    let curr = sourceHash;
    while (curr && next.commits[curr]) {
      if (next.commits[curr].parents.includes(headHash)) {
        isFastForward = true;
        break;
      }
      curr = next.commits[curr].parents[0];
    }

    if (isFastForward) {
      next.branches[currentBranchName].targetHash = sourceHash;
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `Mise à jour ${headHash.slice(0, 7)}..${sourceHash.slice(0, 7)}\nFast-forward : la branche '${currentBranchName}' avance directement sur '${sourceBranchName}'.`,
          type: "success",
          timestamp: now,
        },
      };
    }

    // 3-Way Merge: Create a merge commit with 2 parents!
    const mergeHash = generateShortId();
    next.commits[mergeHash] = {
      hash: mergeHash,
      shortHash: mergeHash,
      parents: [headHash, sourceHash],
      message: `Merge branch '${sourceBranchName}' into ${currentBranchName}`,
      author: "Ingénieur DevOps",
      timestamp: "À l'instant",
      lane: next.branches[currentBranchName] ? Object.keys(next.branches).indexOf(currentBranchName) : 0,
      isMerge: true,
    };

    next.branches[currentBranchName].targetHash = mergeHash;

    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `Fusion effectuée par la stratégie 'ort' (3-way merge).\nNouveau commit de fusion créé : [${currentBranchName} ${mergeHash}] Merge branch '${sourceBranchName}' into ${currentBranchName}`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 8. git rebase
  if (subCmd === "rebase") {
    const targetBranch = parts[2];
    if (!targetBranch || !next.branches[targetBranch]) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: `Erreur: Branche cible de rebase '${targetBranch || ""}' introuvable.`,
          type: "error",
          timestamp: now,
        },
      };
    }

    if (next.head.type !== "branch") {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "Erreur: Impossible de faire un rebase en état HEAD détachée.",
          type: "error",
          timestamp: now,
        },
      };
    }

    const currentBranchName = next.head.target;
    const targetHash = next.branches[targetBranch].targetHash;

    // Collect commits unique to current branch
    const rebasedHash = generateShortId();
    const oldCommit = next.commits[next.branches[currentBranchName].targetHash];
    const newMsg = oldCommit ? oldCommit.message : "rebased commit";

    next.commits[rebasedHash] = {
      hash: rebasedHash,
      shortHash: rebasedHash,
      parents: [targetHash],
      message: newMsg,
      author: oldCommit?.author || "DevOps",
      timestamp: "À l'instant",
      lane: next.commits[targetHash]?.lane ?? 0,
    };

    next.branches[currentBranchName].targetHash = rebasedHash;

    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `Rebase appliqué avec succès sur '${targetBranch}'. Les commits de '${currentBranchName}' ont été rejoués au sommet de '${targetBranch}' avec de nouveaux SHA-1 linéaires.`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 9. git cherry-pick
  if (subCmd === "cherry-pick") {
    const targetCommitHash = parts[2];
    const commitToPick = Object.values(next.commits).find(
      (c) => c.hash === targetCommitHash || c.shortHash === targetCommitHash
    );

    if (!commitToPick) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: `Erreur: Commit '${targetCommitHash}' introuvable pour le cherry-pick.`,
          type: "error",
          timestamp: now,
        },
      };
    }

    const currentHash = getCurrentCommitHash(next);
    const newHash = generateShortId();

    next.commits[newHash] = {
      hash: newHash,
      shortHash: newHash,
      parents: currentHash ? [currentHash] : [],
      message: `${commitToPick.message} (cherry-picked from ${commitToPick.shortHash})`,
      author: commitToPick.author,
      timestamp: "À l'instant",
      lane: 0,
    };

    if (next.head.type === "branch") {
      next.branches[next.head.target].targetHash = newHash;
    } else {
      next.head.target = newHash;
    }

    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `[${next.head.type === "branch" ? next.head.target : "HEAD"} ${newHash}] ${commitToPick.message}\n 1 fichier modifié, 3 insertions(+)`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 10. git reset
  if (subCmd === "reset") {
    const isHard = parts.includes("--hard");
    const isSoft = parts.includes("--soft");
    const targetSpec = parts[parts.length - 1];

    let targetHash: string | null = null;
    const currentHash = getCurrentCommitHash(next);

    if (targetSpec.startsWith("HEAD~")) {
      const count = parseInt(targetSpec.replace("HEAD~", ""), 10) || 1;
      let curr = currentHash;
      for (let i = 0; i < count; i++) {
        if (curr && next.commits[curr] && next.commits[curr].parents.length > 0) {
          curr = next.commits[curr].parents[0];
        }
      }
      targetHash = curr;
    } else if (next.commits[targetSpec]) {
      targetHash = targetSpec;
    } else if (next.branches[targetSpec]) {
      targetHash = next.branches[targetSpec].targetHash;
    }

    if (!targetHash) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "Erreur: Cible de reset invalide.",
          type: "error",
          timestamp: now,
        },
      };
    }

    if (next.head.type === "branch") {
      next.branches[next.head.target].targetHash = targetHash;
    } else {
      next.head.target = targetHash;
    }

    if (isHard) {
      next.stagingArea = [];
      next.workingDirectory = [];
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `HEAD est maintenant à ${targetHash.slice(0, 7)} ${next.commits[targetHash]?.message || ""}\n(Staging Area et Copie de travail réinitialisées - modifications perdues).`,
          type: "warning",
          timestamp: now,
        },
      };
    }

    if (isSoft) {
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `HEAD déplacée à ${targetHash.slice(0, 7)} (Les modifications restent indexées dans la Staging Area).`,
          type: "success",
          timestamp: now,
        },
      };
    }

    // Default --mixed
    next.stagingArea = [];
    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `Modifications non indexées après reset:\n M  src/app.ts\nHEAD est maintenant à ${targetHash.slice(0, 7)}`,
        type: "info",
        timestamp: now,
      },
    };
  }

  // 11. git tag
  if (subCmd === "tag") {
    const tagName = parts[2];
    if (!tagName) {
      const tagList = Object.keys(next.tags).join("\n");
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: tagList || "Aucun tag défini.",
          type: "info",
          timestamp: now,
        },
      };
    }

    const currentHash = getCurrentCommitHash(next);
    if (!currentHash) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "Erreur: Pas de commit à étiqueter.",
          type: "error",
          timestamp: now,
        },
      };
    }

    next.tags[tagName] = currentHash;
    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `Tag '${tagName}' créé avec succès sur le commit ${currentHash.slice(0, 7)}.`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 12. git stash
  if (subCmd === "stash") {
    const isPop = parts.includes("pop");
    if (isPop) {
      if (next.stash.length === 0) {
        return {
          nextState: state,
          output: {
            command: rawCommand,
            output: "Erreur: Aucune modification dans la pile de stash.",
            type: "error",
            timestamp: now,
          },
        };
      }
      const popped = next.stash.pop();
      next.workingDirectory.push("restored-work.ts");
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `Sur la branche ${next.head.type === "branch" ? next.head.target : "HEAD"}\nModifications rétablies depuis le stash (${popped?.message}).`,
          type: "success",
          timestamp: now,
        },
      };
    }

    // Stash current work
    const branchName = next.head.type === "branch" ? next.head.target : "HEAD";
    const currentHash = getCurrentCommitHash(next) || "0000000";
    next.stash.push({
      id: `stash@{${next.stash.length}}`,
      message: `WIP on ${branchName}: ${currentHash.slice(0, 7)}`,
      branch: branchName,
      date: now,
    });
    next.workingDirectory = [];
    next.stagingArea = [];

    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `Répertoire de travail et état de l'index sauvegardés dans WIP on ${branchName}: ${currentHash.slice(0, 7)}. Arbre propre.`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 13. git log
  if (subCmd === "log") {
    const commitsList = Object.values(next.commits)
      .reverse()
      .map((c) => {
        const branchBadge = Object.entries(next.branches).find(([, b]) => b.targetHash === c.hash);
        const tagBadge = Object.entries(next.tags).find(([, h]) => h === c.hash);
        const refLabels = [];
        if (next.head.type === "detached" && next.head.target === c.hash) refLabels.push("HEAD");
        if (branchBadge) refLabels.push(branchBadge[0] === next.head.target ? `HEAD -> ${branchBadge[0]}` : branchBadge[0]);
        if (tagBadge) refLabels.push(`tag: ${tagBadge[0]}`);

        const refsStr = refLabels.length > 0 ? ` (${refLabels.join(", ")})` : "";
        return `* \x1b[33m${c.shortHash}\x1b[0m\x1b[32m${refsStr}\x1b[0m ${c.message} - \x1b[36m${c.author}\x1b[0m (${c.timestamp})`;
      })
      .join("\n");

    return {
      nextState: state,
      output: {
        command: rawCommand,
        output: commitsList || "Aucun commit.",
        type: "info",
        timestamp: now,
      },
    };
  }

  return {
    nextState: state,
    output: {
      command: rawCommand,
      output: `Commande 'git ${subCmd}' non reconnue dans le simulateur ou syntaxe non prise en charge. Commandes supportées : init, status, add, commit, branch, checkout, switch, merge, rebase, cherry-pick, reset, tag, stash, log.`,
      type: "warning",
      timestamp: now,
    },
  };
}
