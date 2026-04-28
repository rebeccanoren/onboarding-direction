import type { Principle, ResearchSource } from "../types";

export const principles: Principle[] = [
  {
    id: "p1",
    title: "Test before setup",
    elaboration:
      "Let users confirm the system works before asking them to configure anything.",
  },
  {
    id: "p2",
    title: "Confidence before commitment",
    elaboration:
      "Build trust in a small, reversible action before asking for long-lived decisions.",
  },
  {
    id: "p3",
    title: "Reveal complexity progressively",
    elaboration:
      "Expose resources, concepts, and options only when the user is ready to act on them.",
  },
  {
    id: "p4",
    title: "One screen, one primary intention",
    elaboration:
      "Each step should have one obvious thing to do — supporting actions are secondary.",
  },
  {
    id: "p5",
    title: "Support both UI-first and code-first users",
    elaboration:
      "Offer a UI path that non-developers can complete and a code path developers can jump into.",
  },
  {
    id: "p6",
    title: "Make system feedback visible",
    elaboration:
      "Show logs, payloads, and delivery status right after an action so users can see the system working.",
  },
  {
    id: "p7",
    title: "Introduce resources when they become meaningful",
    elaboration:
      "Apps, channels, keys, and agents appear when the user's intent justifies them, not before.",
  },
  {
    id: "p8",
    title: "Let users move from test → API → production",
    elaboration:
      "Design the progression so each step earns the next: a successful test makes API exploration obvious; API usage makes production setup obvious.",
  },
];

export const researchSources: ResearchSource[] = [
  {
    id: "s1",
    title: "RCS Getting started 2.0 usability tests",
    description:
      "Moderated sessions testing the send-first RCS Getting started 2.0 prototype. Developers and non-developers.",
    sessions: 10,
    concept: "RCS Getting started 2.0",
  },
  {
    id: "s2",
    title: "Onboarding app usability tests",
    description:
      "Sessions testing the guided onboarding app, often as a comparison point to RCS Getting started 2.0.",
    sessions: 4,
    concept: "Onboarding app",
  },
  {
    id: "s3",
    title: "RCS setup flow observations",
    description:
      "Notes on RCS agent creation, compliance, and go-live requirements encountered in RCS Getting started 2.0 sessions.",
    sessions: 8,
    concept: "RCS setup",
  },
];
