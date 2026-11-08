export interface ChapterSection {
  id: string;
  title: string;
  badge?: string;
  content: string;
  keyPoints?: string[];
  codeSnippets?: {
    title: string;
    language: string;
    code: string;
    explanation?: string;
  }[];
  callout?: {
    type: "note" | "tip" | "warning" | "highlight";
    title: string;
    text: string;
  };
}

export interface Chapter {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  slidesRef: string;
  iconName: string;
  estimatedTime: string;
  objectives: string[];
  summary: string;
  sections: ChapterSection[];
  takeaways: string[];
  quickCheatsheet?: {
    cmd: string;
    desc: string;
  }[];
  diagramType?: "architecture" | "cams" | "gitflow" | "cicd" | "docker";
}

export interface ExerciseScenario {
  id: string;
  title: string;
  category: "Git Fundamentals" | "Merge & Rebase" | "Branching & Workflows" | "GitLab CI" | "Docker & Compose" | "Disaster Recovery";
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  duration: string;
  context: string;
  problem: string;
  goal: string;
  initialStatePreset?: string;
  hints: string[];
  validationCriteria: {
    commandPattern?: string; // regex to validate user solution command
    expectedOutputKeywords?: string[];
  };
  stepByStepSolution: {
    step: number;
    title: string;
    command?: string;
    explanation: string;
    visualNote?: string;
  }[];
  trapToAvoid: string;
}

export interface QuizQuestion {
  id: string;
  chapterId: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  referenceSlide?: string;
}

export interface UserProgress {
  completedChapters: number[];
  completedExercises: string[];
  quizScores: Record<string, number>;
  bookmarkedSections: string[];
}
