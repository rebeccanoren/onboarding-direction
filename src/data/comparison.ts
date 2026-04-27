import type { ComparisonRow } from "../types";

export const comparisonRows: ComparisonRow[] = [
  {
    dimension: "Time to value",
    onboardingApp:
      "Users reach a send-message moment after multiple steps. P4 described 'quite a lot of text to get through' before getting oriented.",
    sandbox2:
      "A working test message is reachable quickly. P12 called the send-test flow 'actually super easy'. P13 said 'super easy' after seeing the preview. P26 saw the sandbox purpose as 'just try to send one test message'.",
    evidenceQuoteId: "q049",
  },
  {
    dimension: "Cognitive load",
    onboardingApp:
      "P8 said 'a lot of steps to go through'. P3 felt the flow was really an 'easy-access test' — resources demanded before purpose was clear.",
    sandbox2:
      "P12 liked that cards are collapsed, showing a preview and expanding the last one. P1 preferred having 'everything in one page'.",
    evidenceQuoteId: "q045",
  },
  {
    dimension: "Clarity of next step",
    onboardingApp:
      "P6 said 'there's, like, no real way of going to get started' for exploring the Conversation API next.",
    sandbox2:
      "P1: 'once I've done that, then I can just, yeah, use the API and the keys to actually integrate it' — clear progression from test to API.",
    evidenceQuoteId: "q002",
  },
  {
    dimension: "Developer usefulness",
    onboardingApp:
      "External webhook tools suggested early. P1 noted one was a paid solution and would 'kinda be pissed about' it.",
    sandbox2:
      "P11: showing code alongside UI 'makes sense' because 'any client who is using RCS… would leverage it'. P44 would run curl directly from the terminal.",
    evidenceQuoteId: "q042",
  },
  {
    dimension: "Non-developer accessibility",
    onboardingApp:
      "Requires familiarity with keys and webhooks that non-developers cannot reason about.",
    sandbox2:
      "P9 (non-dev) navigated branding/agent setup and called the UI 'pretty pretty simple'. P15 (non-dev) completed the flow but hit walls on compliance fields.",
    evidenceQuoteId: "q038",
  },
  {
    dimension: "Resource creation",
    onboardingApp:
      "Access keys and app creation demanded up front. P3 asked 'why do you need this?' when hitting access-key requirements for a simple test.",
    sandbox2:
      "P2 praised that it removes sign-up, user approval and credit-card walls before any testing. Keys appear when they are relevant (P12: 'it's already there, which is beautiful').",
    evidenceQuoteId: "q013",
  },
  {
    dimension: "Production readiness",
    onboardingApp:
      "P6 missed a path from the test RCS agent page back to 'creating the first RCS app for my own business'.",
    sandbox2:
      "Path to production exists but compliance steps feel heavy. P12: compliance is 'quite heavy'. P14 wanted an explicit submit-for-approval CTA.",
    evidenceQuoteId: "q028",
  },
  {
    dimension: "Risk",
    onboardingApp:
      "Low trust early; users may abandon before reaching first value. P1 wanted pricing visible much earlier.",
    sandbox2:
      "Test-first trust established early; risk shifts to compliance (P14 on hidden content rules, P15 on consent field ambiguity).",
    evidenceQuoteId: "q056",
  },
];
