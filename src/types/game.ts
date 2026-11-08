import { GitRepoState } from "./git";

export type DifficultyLevel = "Junior" | "Mid" | "DevOps Lead";

export type GameMode = "arena" | "drills" | "quiz" | "sandbox" | "profile";

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  tier: "bronze" | "silver" | "gold" | "diamond";
  conditionText: string;
}

export interface MistakeRecord {
  id: string;
  timestamp: string;
  mode: "arena" | "drills" | "quiz";
  difficulty: DifficultyLevel;
  category: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export interface PlayerStats {
  xp: number;
  currentStreak: number;
  maxStreak: number;
  solvedArenaIds: string[];
  completedDrillIds: string[];
  quizPerfectRuns: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  unlockedBadgeIds: string[];
  mistakes: MistakeRecord[];
}

export interface ArenaSolutionStep {
  stepNumber: number;
  command: string;
  description: string;
}

export interface ArenaScenario {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  category: "Merge & Conflits" | "Detached HEAD & Rescue" | "Rebase & Historique" | "Git Flow & Hotfix" | "Reset & Annulation";
  xpReward: number;
  incidentCode: string;
  incidentBrief: string;
  missionGoal: string;
  initialPreset: string;
  objectives: {
    id: string;
    label: string;
    check: (state: GitRepoState, commandHistory: string[]) => boolean;
  }[];
  hints: string[];
  solutionSteps: ArenaSolutionStep[];
  postMortemTakeaway: string;
}

export interface CommandDrill {
  id: string;
  difficulty: DifficultyLevel;
  category: "Git Zones & Diff" | "Branches & HEAD" | "Merge & Rebase" | "Reset & Rescue" | "GitLab CI & Docker";
  xpReward: number;
  scenarioContext: string;
  prompt: string;
  acceptedPatterns: string[]; // regex strings
  canonicalCommand: string;
  simulatedOutput: string;
  explanation: string;
  hint: string;
}

export interface TimedQuizQuestion {
  id: string;
  difficulty: DifficultyLevel;
  category: string;
  timeLimitSec: number;
  basePoints: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
