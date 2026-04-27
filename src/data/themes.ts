import type { ThemeDefinition } from "../types";

export const themes: ThemeDefinition[] = [
  {
    id: "Time-to-value",
    description:
      "How quickly a user can reach a first meaningful result — usually sending a message.",
    keywords: [
      "send",
      "test",
      "first message",
      "quick",
      "hands on",
      "try",
      "experience",
      "works",
      "easy",
    ],
  },
  {
    id: "Resource creation",
    description:
      "Creating accounts, apps, channels, agents, or keys. When these are required vs. when they become meaningful.",
    keywords: [
      "access key",
      "api key",
      "credential",
      "project id",
      "create app",
      "agent",
      "rcs agent",
      "conversation api",
      "webhook setup",
    ],
  },
  {
    id: "API playground",
    description: "Exploring the API — code samples, curl, payloads, in-browser execution.",
    keywords: [
      "api",
      "playground",
      "curl",
      "code",
      "payload",
      "request",
      "response",
      "sdk",
      "language",
    ],
  },
  {
    id: "Message logs",
    description:
      "Visibility into delivery status, queue, IDs, and what just happened after a send.",
    keywords: [
      "log",
      "logs",
      "message log",
      "delivered",
      "queued",
      "status",
      "preview",
      "result",
      "output",
    ],
  },
  {
    id: "Setup friction",
    description:
      "Any step that slows the user down — too many steps, confusing copy, missing context, hidden requirements.",
    keywords: [
      "steps",
      "confusing",
      "friction",
      "text",
      "overwhelming",
      "struggle",
      "stuck",
      "compliance",
      "mandatory",
      "tedious",
    ],
  },
  {
    id: "Production readiness",
    description:
      "Moving from test to live — approvals, compliance, carrier rules, pricing, real agents.",
    keywords: [
      "production",
      "go live",
      "approval",
      "pricing",
      "compliance",
      "carrier",
      "real",
      "live",
      "submit",
    ],
  },
];
