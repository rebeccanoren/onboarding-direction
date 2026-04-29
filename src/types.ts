export type Persona =
  | "Developer"
  | "Non-developer"
  | "PM"
  | "Marketing/business user"
  | "Unknown";

export type Concept =
  | "RCS Getting started 2.0"
  | "RCS Getting started 1.0"
  | "Onboarding app"
  | "SMS onboarding"
  | "RCS setup";

export type Theme =
  | "Time-to-value"
  | "Resource creation"
  | "API playground"
  | "Message logs"
  | "Setup friction"
  | "Production readiness";

export type Audience = "internal" | "external";

export interface Transcript {
  id: string;
  participant: string;
  persona: Persona;
  /** Concepts shown in the session — most internal sessions covered both
   *  the Onboarding app and RCS Getting started 1.0; RCS Getting started 2.0 sessions usually one. */
  concepts: Concept[];
  date: string | null;
  sourceFile: string;
  videoUrl?: string;
  summary: string;
  audience: Audience;
}

export interface Quote {
  id: string;
  transcriptId: string;
  participant: string;
  persona?: Persona;
  concept: Concept;
  timestamp?: string;
  quote: string;
  /** If the original was spoken in another language, preserve it verbatim here. */
  originalQuote?: string;
  originalLanguage?: "Swedish";
  theme: Theme;
  interpretation?: string;
}

export interface Insight {
  id: string;
  title: string;
  body: string;
  relatedThemes: Theme[];
  relatedQuoteIds: string[];
  relatedConcepts?: Concept[];
  confidence?: Confidence;
}

export type Confidence = "High" | "Medium" | "Low";

export interface EvidenceClaim {
  claim: string;
  /** MUST contain >= 2 quotes from distinct participants. */
  evidence: Quote[];
}

export interface ComparisonSide {
  concept: Concept;
  strengths: EvidenceClaim[];
  weaknesses: EvidenceClaim[];
}

export interface DecisionPoint {
  question: string;
  answer: Concept | string;
  rationale: string;
  evidenceQuoteIds?: string[];
}

export interface Answer {
  shortAnswer: string;
  whatTheDataSays: string;
  supportingQuotes: Quote[];
  interpretation: string;
  productImplication: string;
  confidence: Confidence;
  confidenceReason?: string;
  retrievedTranscriptIds?: string[];
  /** Per-concept strengths/weaknesses with inline evidence. Present for comparison answers. */
  comparison?: ComparisonSide[];
  /** Explicit product decisions supported by evidence. Present for comparison answers. */
  decision?: DecisionPoint[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text?: string;
  answer?: Answer;
  noEvidence?: boolean;
}

export interface Filters {
  concepts: Concept[];
  personas: Persona[];
  themes: Theme[];
}

export interface ComparisonRow {
  dimension: string;
  onboardingApp: string;
  rcs2: string;
  evidenceQuoteId: string;
}

export interface Principle {
  id: string;
  title: string;
  elaboration: string;
}

export interface ResearchSource {
  id: string;
  title: string;
  description: string;
  sessions: number;
  concept: Concept;
}

export interface ThemeDefinition {
  id: Theme;
  description: string;
  keywords: string[];
}

export interface TranscriptAnalysisIssue {
  /** Short title, e.g. "Setup introduced too early". */
  title: string;
  /** Bullet-list explanation of what happened. */
  points: string[];
  /** Quote IDs (from quotes.ts, scoped to this transcript) that support this issue. */
  supportingQuoteIds?: string[];
}

export interface TranscriptAnalysisConcept {
  concept: Concept;
  /** Optional descriptive subtitle for the concept badge (e.g. "Lovable-style test experience"). */
  conceptSubtitle?: string;
  /** Optional one-line summary of the user's overall reaction to this concept. */
  mainReaction?: string;
  /** Optional verbatim pull-quote rendered under the main reaction. */
  mainReactionQuote?: string;
  /** Plain narrative of what the participant did with this concept. */
  whatHappened: string[];
  /** What worked well — typically used for the "better" concept in a comparison. */
  whatWorked?: string[];
  /** Optional structured strengths (each with a title + supporting points and optional quotes). */
  keyStrengths?: {
    title: string;
    points: string[];
    supportingQuoteIds?: string[];
  }[];
  /** Numbered issues/main problems observed. */
  issues: TranscriptAnalysisIssue[];
  /** What the user explicitly expected (renders as an "expected" callout). */
  expected?: string[];
}

/** Multi-item cross-cutting insight (used when a session surfaces several themes). */
export interface CrossCuttingInsight {
  title: string;
  /** Optional narrative paragraph (italicised in the renderer). */
  body?: string;
  /** Optional intro line before the bullets. */
  bulletsIntro?: string;
  bullets?: string[];
  supportingQuoteIds?: string[];
}

export interface TranscriptAnalysis {
  transcriptId: string;
  /** One-paragraph statement of why the user came in. */
  userGoal: string;
  /** Optional supporting context for the user goal (e.g. behavioural pattern up-front, comparisons). */
  userGoalContext?: {
    intro?: string;
    bullets?: string[];
    closing?: string;
    /** Optional pull-quote to highlight the user's exact framing. */
    quote?: string;
  };
  /** Per-concept observations (e.g. Onboarding app, RCS Getting started 1.0). */
  concepts: TranscriptAnalysisConcept[];
  /** Optional cross-cutting issue spanning both/all concepts. */
  crossCutting?: {
    title: string;
    intro?: string;
    bullets: string[];
    /** "This led to..." consequences list. */
    consequences?: string[];
  };
  /** Optional multi-item cross-cutting insights (each with its own title and body/bullets). */
  crossCuttingInsights?: CrossCuttingInsight[];
  /** Ordered behavioural pattern observed across the session. */
  behavioralPattern: string[];
  /** Optional note rendered as a callout below the pattern (e.g. "Key difference vs previous users…"). */
  behavioralPatternNote?: { title?: string; text: string };
  /** Closing takeaway with a strong headline and supporting points. */
  keyTakeaway: {
    headline: string;
    body?: string[];
    /** "The missing piece is..." structured note. */
    missingPiece?: { title: string; items: string[] };
    /** "Without this, users don't know..." consequence list. */
    consequences?: string[];
    /** Optional additional titled sub-callouts (e.g. "Core problems identified", "Users want", "They do not want"). */
    sections?: { title: string; items: string[] }[];
    /** Optional closing italic line shown at the bottom of the takeaway. */
    closing?: string;
  };
}
