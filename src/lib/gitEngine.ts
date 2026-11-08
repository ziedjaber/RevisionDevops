import { GitRepoState, GitCommit, GitBranch, CommandOutput } from "@/types/git";
import { generateShortId } from "./utils";

const BRANCH_COLORS = [
  "#10B981", // emerald (commits & success)
  "#F59E0B", // amber (gold active)
  "#06B6D4", // cyan (HEAD & links)
  "#8B5CF6", // violet (branches)
  "#EF4444", // ruby red (hotfix / alerts)
  "#3B82F6", // blue
  "#EC4899", // pink
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
      message: "feat: initial commit (root-commit)",
      author: "Lead DevOps",
      timestamp: "J-3",
      lane: 0,
    },
    [c2Hash]: {
      hash: c2Hash,
      shortHash: c2Hash,
      parents: [c1Hash],
      message: "feat: microservice auth JWT",
      author: "Lead DevOps",
      timestamp: "J-2",
      lane: 0,
    },
    [c3Hash]: {
      hash: c3Hash,
      shortHash: c3Hash,
      parents: [c2Hash],
      message: "fix: token TTL validation",
      author: "Lead DevOps",
      timestamp: "J-1",
      lane: 0,
    },
  };

  const branches: Record<string, GitBranch> = {
    main: {
      name: "main",
      targetHash: c3Hash,
      isCurrent: true,
      color: "#10B981",
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
  if (preset === "divergent" || preset === "arena-3way" || preset === "arena-rebase") {
    const c1 = "745a6ef";
    const c2 = "a8c912b";
    const c3 = "d4e501c";
    const f1 = "2c33a9d";
    const f2 = "9b11e4f";

    const commits: Record<string, GitCommit> = {
      [c1]: { hash: c1, shortHash: c1, parents: [], message: "chore: init repo", author: "DevOps", timestamp: "3j", lane: 0 },
      [c2]: { hash: c2, shortHash: c2, parents: [c1], message: "feat: REST API gateway", author: "DevOps", timestamp: "2j", lane: 0 },
      [c3]: { hash: c3, shortHash: c3, parents: [c2], message: "perf: add Redis cache layer", author: "Alice", timestamp: "5h", lane: 0 },
      [f1]: { hash: f1, shortHash: f1, parents: [c2], message: "feat: OAuth2 provider", author: "Bob", timestamp: "1j", lane: 1 },
      [f2]: { hash: f2, shortHash: f2, parents: [f1], message: "test: unit tests OAuth2", author: "Bob", timestamp: "2h", lane: 1 },
    };

    return {
      commits,
      branches: {
        main: { name: "main", targetHash: c3, isCurrent: preset !== "arena-rebase", color: "#10B981" },
        "feature/oauth": { name: "feature/oauth", targetHash: f2, isCurrent: preset === "arena-rebase", color: "#F59E0B" },
      },
      tags: { "v1.0": c2 },
      head: { type: "branch", target: preset === "arena-rebase" ? "feature/oauth" : "main" },
      stagingArea: [],
      workingDirectory: [],
      stash: [],
      currentLaneCount: 2,
    };
  }

  if (preset === "arena-fastforward") {
    const c1 = "745a6ef";
    const c2 = "a8c912b";
    const f1 = "3f88d1a";
    const f2 = "6e99c2b";

    const commits: Record<string, GitCommit> = {
      [c1]: { hash: c1, shortHash: c1, parents: [], message: "chore: initial setup", author: "DevOps", timestamp: "3j", lane: 0 },
      [c2]: { hash: c2, shortHash: c2, parents: [c1], message: "feat: core CRUD endpoints", author: "DevOps", timestamp: "2j", lane: 0 },
      [f1]: { hash: f1, shortHash: f1, parents: [c2], message: "feat: add Dockerfile alpine", author: "Sarah", timestamp: "1j", lane: 1 },
      [f2]: { hash: f2, shortHash: f2, parents: [f1], message: "feat: add docker-compose.yml", author: "Sarah", timestamp: "4h", lane: 1 },
    };

    return {
      commits,
      branches: {
        main: { name: "main", targetHash: c2, isCurrent: true, color: "#10B981" },
        "feature/docker": { name: "feature/docker", targetHash: f2, isCurrent: false, color: "#06B6D4" },
      },
      tags: { "v1.0": c2 },
      head: { type: "branch", target: "main" },
      stagingArea: [],
      workingDirectory: [],
      stash: [],
      currentLaneCount: 2,
    };
  }

  if (preset === "gitflow" || preset === "arena-hotfix") {
    const c1 = "c1a012a";
    const c2 = "c2b345b";
    const dev1 = "d1e456d";
    const dev2 = "d2f789d";
    const feat1 = "f1a111f";

    const commits: Record<string, GitCommit> = {
      [c1]: { hash: c1, shortHash: c1, parents: [], message: "release: v1.0.0", author: "Lead", timestamp: "4j", lane: 0 },
      [c2]: { hash: c2, shortHash: c2, parents: [c1], message: "release: v1.0.1", author: "Lead", timestamp: "3j", lane: 0 },
      [dev1]: { hash: dev1, shortHash: dev1, parents: [c2], message: "chore: start sprint 2", author: "Dev", timestamp: "2j", lane: 1 },
      [dev2]: { hash: dev2, shortHash: dev2, parents: [dev1], message: "feat: WIP payment gateway", author: "Dev", timestamp: "1j", lane: 1 },
      [feat1]: { hash: feat1, shortHash: feat1, parents: [dev2], message: "feat: Stripe webhook", author: "Dev", timestamp: "4h", lane: 2 },
    };

    return {
      commits,
      branches: {
        main: { name: "main", targetHash: c2, isCurrent: false, color: "#10B981" },
        develop: { name: "develop", targetHash: dev2, isCurrent: true, color: "#06B6D4" },
        "feature/cart": { name: "feature/cart", targetHash: feat1, isCurrent: false, color: "#8B5CF6" },
      },
      tags: { "v1.0.1": c2 },
      head: { type: "branch", target: "develop" },
      stagingArea: [],
      workingDirectory: ["src/security/auth-guard.ts"],
      stash: [],
      currentLaneCount: 3,
    };
  }

  if (preset === "detached" || preset === "arena-detached") {
    const c1 = "c1a012a";
    const c2 = "c2b345b";
    const c3 = "c3c678c";
    const orphan = "9f8e7d6";

    const commits: Record<string, GitCommit> = {
      [c1]: { hash: c1, shortHash: c1, parents: [], message: "chore: init", author: "Bassem", timestamp: "3j", lane: 0 },
      [c2]: { hash: c2, shortHash: c2, parents: [c1], message: "feat: core engine v1", author: "Bassem", timestamp: "2j", lane: 0 },
      [c3]: { hash: c3, shortHash: c3, parents: [c2], message: "feat: analytics tracker", author: "Bassem", timestamp: "1j", lane: 0 },
      [orphan]: { hash: orphan, shortHash: orphan, parents: [c2], message: "fix: critical memory leak patch", author: "You", timestamp: "5m", lane: 1 },
    };

    return {
      commits,
      branches: {
        main: { name: "main", targetHash: c3, isCurrent: false, color: "#10B981" },
      },
      tags: { "v1.0": c2 },
      head: { type: "detached", target: orphan },
      stagingArea: [],
      workingDirectory: [],
      stash: [],
      currentLaneCount: 2,
    };
  }

  if (preset === "arena-reset") {
    const c1 = "c1a012a";
    const c2 = "c2b345b";
    const bad1 = "bad001a";
    const bad2 = "bad002b";

    const commits: Record<string, GitCommit> = {
      [c1]: { hash: c1, shortHash: c1, parents: [], message: "feat: initial microservice", author: "DevOps", timestamp: "2j", lane: 0 },
      [c2]: { hash: c2, shortHash: c2, parents: [c1], message: "feat: stable release v1.2", author: "DevOps", timestamp: "1j", lane: 0 },
      [bad1]: { hash: bad1, shortHash: bad1, parents: [c2], message: "wip: debug print statements", author: "Junior", timestamp: "20m", lane: 0 },
      [bad2]: { hash: bad2, shortHash: bad2, parents: [bad1], message: "oops: committed .env secrets by mistake", author: "Junior", timestamp: "5m", lane: 0 },
    };

    return {
      commits,
      branches: {
        main: { name: "main", targetHash: bad2, isCurrent: true, color: "#10B981" },
      },
      tags: { "v1.2": c2 },
      head: { type: "branch", target: "main" },
      stagingArea: [],
      workingDirectory: [],
      stash: [],
      currentLaneCount: 1,
    };
  }

  if (preset === "arena-cherrypick") {
    const c1 = "c1a012a";
    const c2 = "c2b345b";
    const d1 = "d100a1b";
    const fixHash = "2c33a99";
    const d3 = "d300c3d";

    const commits: Record<string, GitCommit> = {
      [c1]: { hash: c1, shortHash: c1, parents: [], message: "chore: init repo", author: "Lead", timestamp: "4j", lane: 0 },
      [c2]: { hash: c2, shortHash: c2, parents: [c1], message: "release: v2.0.0 prod", author: "Lead", timestamp: "3j", lane: 0 },
      [d1]: { hash: d1, shortHash: d1, parents: [c2], message: "feat: experimental UI refactor", author: "Team", timestamp: "2j", lane: 1 },
      [fixHash]: { hash: fixHash, shortHash: fixHash, parents: [d1], message: "fix: null pointer in payment controller", author: "Team", timestamp: "1j", lane: 1 },
      [d3]: { hash: d3, shortHash: d3, parents: [fixHash], message: "feat: unfinished GraphQL migration", author: "Team", timestamp: "3h", lane: 1 },
    };

    return {
      commits,
      branches: {
        main: { name: "main", targetHash: c2, isCurrent: true, color: "#10B981" },
        develop: { name: "develop", targetHash: d3, isCurrent: false, color: "#F59E0B" },
      },
      tags: { "v2.0.0": c2 },
      head: { type: "branch", target: "main" },
      stagingArea: [],
      workingDirectory: [],
      stash: [],
      currentLaneCount: 2,
    };
  }

  return getInitialRepoState();
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
  const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // Handle chained commands with &&
  if (trimmed.includes("&&")) {
    const subCommands = trimmed.split("&&").map((s) => s.trim()).filter(Boolean);
    let currentState = next;
    const outputs: string[] = [];
    let lastType: CommandOutput["type"] = "success";

    for (const cmd of subCommands) {
      const res = executeGitCommand(cmd, currentState);
      currentState = res.nextState;
      outputs.push(`$ ${cmd}\n${res.output.output}`);
      if (res.output.type === "error") {
        lastType = "error";
        break;
      }
    }

    return {
      nextState: currentState,
      output: {
        command: rawCommand,
        output: outputs.join("\n\n"),
        type: lastType,
        timestamp: now,
      },
    };
  }

  if (!trimmed.startsWith("git")) {
    return {
      nextState: state,
      output: {
        command: rawCommand,
        output: `bash: ${trimmed.split(" ")[0]}: commande non reconnue dans ce terminal Git. Commencez par 'git'.`,
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
        output: "Initialized empty Git repository in /workspace/prod-service/.git/",
        type: "success",
        timestamp: now,
      },
    };
  }

  // 2. git status
  if (subCmd === "status") {
    const headInfo =
      next.head.type === "branch"
        ? `On branch ${next.head.target}`
        : `HEAD detached at ${next.head.target.slice(0, 7)}`;

    let statusText = `${headInfo}\n`;
    if (next.stagingArea.length > 0) {
      statusText += `\nChanges to be committed:\n  (use "git reset HEAD <file>..." to unstage)\n`;
      next.stagingArea.forEach((f) => {
        statusText += `\tmodified:   ${f}\n`;
      });
    }

    if (next.workingDirectory.length > 0) {
      statusText += `\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n`;
      next.workingDirectory.forEach((f) => {
        statusText += `\tmodified:   ${f}\n`;
      });
    }

    if (next.stagingArea.length === 0 && next.workingDirectory.length === 0) {
      statusText += "\nnothing to commit, working tree clean";
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

  // 3. git diff
  if (subCmd === "diff") {
    const isStaged = parts.includes("--staged") || parts.includes("--cached");
    const isHead = parts.includes("HEAD");
    if (isStaged) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output:
            next.stagingArea.length > 0
              ? `diff --git a/${next.stagingArea[0]} b/${next.stagingArea[0]}\n--- a/${next.stagingArea[0]}\n+++ b/${next.stagingArea[0]}\n@@ -14,2 +14,3 @@\n+  const validated = sanitizeInput(req.body);`
              : "Aucune différence entre l'Index (Staging Area) et HEAD.",
          type: "info",
          timestamp: now,
        },
      };
    }
    return {
      nextState: state,
      output: {
        command: rawCommand,
        output:
          next.workingDirectory.length > 0 || isHead
            ? `diff --git a/src/service.ts b/src/service.ts\n@@ -21,1 +21,2 @@\n-  timeout: 3000\n+  timeout: 5000\n+  retry: 3`
            : "Aucune différence non indexée entre Working Directory et Index.",
        type: "info",
        timestamp: now,
      },
    };
  }

  // 4. git add
  if (subCmd === "add") {
    const fileTarget = parts[2];
    if (!fileTarget) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "Nothing specified, nothing added. Maybe you wanted to say 'git add .'?",
          type: "error",
          timestamp: now,
        },
      };
    }

    if (fileTarget === "." || fileTarget === "-A" || fileTarget === "--all") {
      const toStage = next.workingDirectory.length > 0 ? next.workingDirectory : ["src/patch.ts"];
      next.stagingArea = Array.from(new Set([...next.stagingArea, ...toStage]));
      next.workingDirectory = [];
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `[Index] ${next.stagingArea.length} fichier(s) indexé(s) dans la Staging Area.`,
          type: "success",
          timestamp: now,
        },
      };
    }

    next.stagingArea = Array.from(new Set([...next.stagingArea, fileTarget]));
    next.workingDirectory = next.workingDirectory.filter((f) => f !== fileTarget);
    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `[Index] '${fileTarget}' ajouté à la Staging Area (SHA-1 blob généré).`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 5. git commit
  if (subCmd === "commit") {
    const isAmend = trimmed.includes("--amend");
    const isAll = parts.includes("-a") || parts.includes("-am") || trimmed.includes(" -a ");

    const msgMatch = trimmed.match(/-m\s+["']([^"']+)["']/) || trimmed.match(/-am\s+["']([^"']+)["']/);
    const message = msgMatch ? msgMatch[1] : "feat: update implementation";

    if (isAll && next.workingDirectory.length > 0) {
      next.stagingArea = Array.from(new Set([...next.stagingArea, ...next.workingDirectory]));
      next.workingDirectory = [];
    }

    const currentHash = getCurrentCommitHash(next);

    if (isAmend && currentHash && next.commits[currentHash]) {
      const existing = next.commits[currentHash];
      const newHash = "4ca87" + generateShortId().slice(0, 2);
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
          output: `[${next.head.type === "branch" ? next.head.target : "detached HEAD"} ${newHash}] ${next.commits[newHash].message}\n Date: ${now}\n 1 file changed, 12 insertions(+) (commit remplacé via --amend)`,
          type: "success",
          timestamp: now,
        },
      };
    }

    const newHash = generateShortId();
    const parentHashes = currentHash ? [currentHash] : [];

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
      author: "DevOps Engineer",
      timestamp: "À l'instant",
      lane,
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
        output: `[${next.head.type === "branch" ? next.head.target : "detached HEAD"} ${newHash}] ${message}\n 1 file changed, 18 insertions(+)`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 6. git branch
  if (subCmd === "branch") {
    const isDelete = parts.includes("-d") || parts.includes("-D");
    if (isDelete) {
      const branchToDelete = parts[parts.length - 1];
      if (!next.branches[branchToDelete]) {
        return {
          nextState: state,
          output: {
            command: rawCommand,
            output: `error: branch '${branchToDelete}' not found.`,
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
            output: `error: Cannot delete branch '${branchToDelete}' checked out at '/workspace/prod-service'`,
            type: "error",
            timestamp: now,
          },
        };
      }
      const oldTarget = next.branches[branchToDelete].targetHash;
      delete next.branches[branchToDelete];
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `Deleted branch ${branchToDelete} (was ${oldTarget.slice(0, 7)}).`,
          type: "success",
          timestamp: now,
        },
      };
    }

    const branchName = parts[2];
    if (!branchName) {
      const branchList = Object.keys(next.branches)
        .map((b) => (next.head.type === "branch" && next.head.target === b ? `* ${b}` : `  ${b}`))
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
          output: `fatal: A branch named '${branchName}' already exists.`,
          type: "error",
          timestamp: now,
        },
      };
    }

    const targetCommitSpec = parts[3];
    let anchorHash = getCurrentCommitHash(next);
    if (targetCommitSpec) {
      const found = Object.keys(next.commits).find((h) => h.startsWith(targetCommitSpec));
      if (found) anchorHash = found;
    }

    if (!anchorHash) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "fatal: Not a valid object name: 'HEAD'.",
          type: "error",
          timestamp: now,
        },
      };
    }

    const colorIndex = Object.keys(next.branches).length % BRANCH_COLORS.length;
    next.branches[branchName] = {
      name: branchName,
      targetHash: anchorHash,
      isCurrent: false,
      color: BRANCH_COLORS[colorIndex],
    };
    next.currentLaneCount = Object.keys(next.branches).length;

    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `Branche '${branchName}' créée sur le commit ${anchorHash.slice(0, 7)}.`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 7. git checkout or git switch
  if (subCmd === "checkout" || subCmd === "switch") {
    // Handle git checkout -- <file>
    if (parts.includes("--")) {
      next.workingDirectory = [];
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: "Modifications locales annulées dans le Working Directory depuis l'Index/HEAD.",
          type: "success",
          timestamp: now,
        },
      };
    }

    const isNewBranch = parts.includes("-b") || parts.includes("-c");
    const flagIndex = parts.indexOf("-b") >= 0 ? parts.indexOf("-b") : parts.indexOf("-c");
    const target = isNewBranch ? parts[flagIndex + 1] : parts[2];

    if (!target) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "fatal: missing branch or commit argument.",
          type: "error",
          timestamp: now,
        },
      };
    }

    if (isNewBranch) {
      const currentHash = getCurrentCommitHash(next);
      if (!currentHash) {
        return {
          nextState: state,
          output: {
            command: rawCommand,
            output: "fatal: cannot create branch without commits.",
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
          output: `Switched to a new branch '${target}' (ancrée sur ${currentHash.slice(0, 7)})`,
          type: "success",
          timestamp: now,
        },
      };
    }

    if (next.branches[target]) {
      Object.values(next.branches).forEach((b) => (b.isCurrent = false));
      next.branches[target].isCurrent = true;
      next.head = { type: "branch", target };
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `Switched to branch '${target}'`,
          type: "success",
          timestamp: now,
        },
      };
    }

    // Check relative ~ spec like main~1 or HEAD~1
    if (target.includes("~")) {
      const [refPart, stepsStr] = target.split("~");
      const steps = parseInt(stepsStr, 10) || 1;
      let startHash =
        refPart === "HEAD"
          ? getCurrentCommitHash(next)
          : next.branches[refPart]?.targetHash || null;

      for (let i = 0; i < steps; i++) {
        if (startHash && next.commits[startHash]?.parents[0]) {
          startHash = next.commits[startHash].parents[0];
        }
      }

      if (startHash && next.commits[startHash]) {
        Object.values(next.branches).forEach((b) => (b.isCurrent = false));
        next.head = { type: "detached", target: startHash };
        return {
          nextState: next,
          output: {
            command: rawCommand,
            output: `Note: switching to '${target}' (${startHash.slice(0, 7)}).\nYou are in 'detached HEAD' state. Use 'git switch -c <new-branch-name>' to retain commits.`,
            type: "warning",
            timestamp: now,
          },
        };
      }
    }

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
          output: `Note: switching to '${targetCommit.slice(0, 7)}'.\nYou are in 'detached HEAD' state (branche anonyme).\nPour conserver vos commits sur ce point : git switch -c <nom-branche>`,
          type: "warning",
          timestamp: now,
        },
      };
    }

    return {
      nextState: state,
      output: {
        command: rawCommand,
        output: `error: pathspec '${target}' did not match any file(s) or branch known to git`,
        type: "error",
        timestamp: now,
      },
    };
  }

  // 8. git merge
  if (subCmd === "merge") {
    const sourceBranchName = parts[2];
    if (!sourceBranchName || !next.branches[sourceBranchName]) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: `merge: ${sourceBranchName || ""} - not something we can merge`,
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
          output: "fatal: impossible de fusionner en état Detached HEAD. Basculez d'abord sur une branche.",
          type: "error",
          timestamp: now,
        },
      };
    }

    const currentBranchName = next.head.target;
    const headHash = next.branches[currentBranchName].targetHash;
    const sourceHash = next.branches[sourceBranchName].targetHash;

    if (headHash === sourceHash) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: "Already up to date.",
          type: "info",
          timestamp: now,
        },
      };
    }

    // Check Fast-Forward
    let isFastForward = false;
    let curr = sourceHash;
    while (curr && next.commits[curr]) {
      if (next.commits[curr].parents.includes(headHash)) {
        isFastForward = true;
        break;
      }
      curr = next.commits[curr].parents[0];
    }

    if (isFastForward && !parts.includes("--no-ff")) {
      next.branches[currentBranchName].targetHash = sourceHash;
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `Updating ${headHash.slice(0, 7)}..${sourceHash.slice(0, 7)}\nFast-forward (avancement direct du pointeur '${currentBranchName}' sans commit de fusion).`,
          type: "success",
          timestamp: now,
        },
      };
    }

    // 3-Way Merge
    const mergeHash = "e815ec4";
    const finalHash = next.commits[mergeHash] ? generateShortId() : mergeHash;

    next.commits[finalHash] = {
      hash: finalHash,
      shortHash: finalHash,
      parents: [headHash, sourceHash],
      message: `Merge branch '${sourceBranchName}' into ${currentBranchName}`,
      author: "DevOps Engineer",
      timestamp: "À l'instant",
      lane: Object.keys(next.branches).indexOf(currentBranchName),
      isMerge: true,
    };

    next.branches[currentBranchName].targetHash = finalHash;

    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `Merge made by the 'ort' strategy (3-Way Merge).\nCommit de fusion à 2 parents créé : [${currentBranchName} ${finalHash}]`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 9. git rebase
  if (subCmd === "rebase") {
    const isOnto = parts.includes("--onto");
    const targetBranch = isOnto ? parts[parts.indexOf("--onto") + 1] : parts[2];

    if (!targetBranch || !next.branches[targetBranch]) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: `fatal: invalid upstream '${targetBranch || ""}'`,
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
          output: "fatal: cannot rebase in detached HEAD state.",
          type: "error",
          timestamp: now,
        },
      };
    }

    const currentBranchName = next.head.target;
    const targetHash = next.branches[targetBranch].targetHash;
    const oldHeadCommit = next.commits[next.branches[currentBranchName].targetHash];

    const rebasedHash = generateShortId();
    next.commits[rebasedHash] = {
      hash: rebasedHash,
      shortHash: rebasedHash,
      parents: [targetHash],
      message: oldHeadCommit ? `${oldHeadCommit.message} (rebased)` : "feat: rebased commit",
      author: oldHeadCommit?.author || "DevOps",
      timestamp: "À l'instant",
      lane: next.commits[targetHash]?.lane ?? 0,
    };

    next.branches[currentBranchName].targetHash = rebasedHash;

    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `Successfully rebased and updated refs/heads/${currentBranchName}.\n(Historique linéarisé au-dessus de '${targetBranch}', nouveau SHA-1 : ${rebasedHash})`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 10. git cherry-pick
  if (subCmd === "cherry-pick") {
    const targetCommitHash = parts[2];
    const commitToPick = Object.values(next.commits).find(
      (c) => c.hash === targetCommitHash || c.shortHash.startsWith(targetCommitHash || "")
    );

    if (!commitToPick) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: `fatal: bad revision '${targetCommitHash || ""}'`,
          type: "error",
          timestamp: now,
        },
      };
    }

    const currentHash = getCurrentCommitHash(next);
    const newHash = "f142b" + generateShortId().slice(0, 2);

    next.commits[newHash] = {
      hash: newHash,
      shortHash: newHash,
      parents: currentHash ? [currentHash] : [],
      message: `${commitToPick.message} (cherry-picked)`,
      author: commitToPick.author,
      timestamp: "À l'instant",
      lane: next.head.type === "branch" ? Object.keys(next.branches).indexOf(next.head.target) : 0,
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
        output: `[${next.head.type === "branch" ? next.head.target : "HEAD"} ${newHash}] ${commitToPick.message}\n 1 file changed, 6 insertions(+)`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 11. git reset
  if (subCmd === "reset") {
    // Handle git reset -- <file> or git reset HEAD <file>
    if (parts.includes("--") || (parts[2] === "HEAD" && parts[3])) {
      next.workingDirectory = Array.from(new Set([...next.workingDirectory, ...next.stagingArea]));
      next.stagingArea = [];
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: "Unstaged changes after reset (fichiers retirés de la Staging Area).",
          type: "info",
          timestamp: now,
        },
      };
    }

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
    } else {
      const matchedCommit = Object.keys(next.commits).find((h) => h.startsWith(targetSpec));
      if (matchedCommit) targetHash = matchedCommit;
      else if (next.branches[targetSpec]) targetHash = next.branches[targetSpec].targetHash;
      else if (next.tags[targetSpec]) targetHash = next.tags[targetSpec];
    }

    if (!targetHash) {
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: `fatal: ambiguous argument '${targetSpec}': unknown revision`,
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
          output: `HEAD is now at ${targetHash.slice(0, 7)} ${next.commits[targetHash]?.message || ""}\n(--hard : Index et Working Directory réinitialisés)`,
          type: "warning",
          timestamp: now,
        },
      };
    }

    if (isSoft) {
      next.stagingArea = ["src/recovered-changes.ts"];
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `HEAD reculée à ${targetHash.slice(0, 7)} (--soft : les modifications restent indexées dans la Staging Area).`,
          type: "success",
          timestamp: now,
        },
      };
    }

    next.stagingArea = [];
    next.workingDirectory = ["src/unstaged-changes.ts"];
    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `Unstaged changes after reset (--mixed par défaut):\nM\tsrc/unstaged-changes.ts\nHEAD is now at ${targetHash.slice(0, 7)}`,
        type: "info",
        timestamp: now,
      },
    };
  }

  // 12. git tag
  if (subCmd === "tag") {
    const tagName = parts.includes("-a") ? parts[parts.indexOf("-a") + 1] : parts[2];
    if (!tagName) {
      const tagList = Object.keys(next.tags).join("\n");
      return {
        nextState: state,
        output: {
          command: rawCommand,
          output: tagList || "Aucun tag.",
          type: "info",
          timestamp: now,
        },
      };
    }

    const currentHash = getCurrentCommitHash(next);
    if (currentHash) {
      next.tags[tagName] = currentHash;
    }
    return {
      nextState: next,
      output: {
        command: rawCommand,
        output: `Tag '${tagName}' posé sur le commit ${currentHash?.slice(0, 7)}.`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 13. git stash
  if (subCmd === "stash") {
    const isPop = parts.includes("pop") || parts.includes("apply");
    if (isPop) {
      if (next.stash.length === 0) {
        return {
          nextState: state,
          output: {
            command: rawCommand,
            output: "error: No stash entries found.",
            type: "error",
            timestamp: now,
          },
        };
      }
      const popped = next.stash.pop();
      next.workingDirectory.push("src/stashed-work.ts");
      return {
        nextState: next,
        output: {
          command: rawCommand,
          output: `Dropped refs/stash@{0} (${popped?.message}) - Modifications restaurées dans le Working Directory.`,
          type: "success",
          timestamp: now,
        },
      };
    }

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
        output: `Saved working directory and index state WIP on ${branchName}: ${currentHash.slice(0, 7)}`,
        type: "success",
        timestamp: now,
      },
    };
  }

  // 14. git log / reflog
  if (subCmd === "log" || subCmd === "reflog") {
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
        return `* ${c.shortHash}${refsStr} ${c.message} [${c.author}]`;
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

  // 15. git fetch / pull / push
  if (subCmd === "fetch" || subCmd === "pull" || subCmd === "push") {
    return {
      nextState: state,
      output: {
        command: rawCommand,
        output:
          subCmd === "fetch"
            ? "From origin\n * [new ref] origin/main -> origin/main (Branches de suivi distantes mises à jour sans modifier l'arbre local)"
            : subCmd === "pull"
            ? "From origin\nFast-forward (fetch + merge exécutés avec succès)"
            : `To github.com:isims-devops/prod-service.git\n   c1a012a..${getCurrentCommitHash(next)?.slice(0, 7)}  ${next.head.target} -> ${next.head.target}`,
        type: "success",
        timestamp: now,
      },
    };
  }

  return {
    nextState: state,
    output: {
      command: rawCommand,
      output: `git: '${subCmd}' is not a git command. Try: status, add, commit, branch, switch, checkout, merge, rebase, cherry-pick, reset, tag, stash, diff, log.`,
      type: "warning",
      timestamp: now,
    },
  };
}
