export interface GitCommit {
  hash: string;
  shortHash: string;
  parents: string[];
  message: string;
  author: string;
  timestamp: string;
  tag?: string;
  lane: number;
  isMerge?: boolean;
}

export interface GitBranch {
  name: string;
  targetHash: string;
  isCurrent: boolean;
  color: string;
  isRemote?: boolean;
}

export interface GitHead {
  type: "branch" | "detached";
  target: string; // branch name or commit hash
}

export interface GitFileStatus {
  path: string;
  status: "untracked" | "modified" | "staged" | "deleted";
}

export interface GitStashItem {
  id: string;
  message: string;
  branch: string;
  date: string;
}

export interface GitRepoState {
  commits: Record<string, GitCommit>;
  branches: Record<string, GitBranch>;
  tags: Record<string, string>; // tag name -> commit hash
  head: GitHead;
  stagingArea: string[]; // files in stage
  workingDirectory: string[]; // modified untracked files
  stash: GitStashItem[];
  currentLaneCount: number;
}

export interface CommandOutput {
  command: string;
  output: string;
  type: "success" | "error" | "info" | "warning";
  timestamp: string;
}
