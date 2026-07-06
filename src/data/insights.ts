import type { Insight } from "../types";

export const insights: Insight[] = [
  {
    id: "i01",
    title: "Developers want to test hands-on before they configure",
    body:
      "Across developer sessions, the first thing participants reach for is a way to send a test message. P1 said 'I usually like to try it hands on as soon as possible.' P6 described the purpose of RCS Getting started 1.0 as 'just try to send one test message… not really having to set up.' P8 wanted to send a test message with their company name before webhook setup.",
    relatedThemes: ["Time-to-value", "Setup friction"],
    relatedQuoteIds: ["q001", "q026", "q037", "q049"],
    relatedConcepts: ["RCS Getting started 2.0", "Onboarding app"],
    confidence: "High",
  },
  {
    id: "i02",
    title: "First value moment is a working test message, visible in logs",
    body:
      "Participants describe the 'aha' moment as seeing the message either arrive on their phone or appear in the message log. P1 said the guide should end with being able to send a message, and preferred RCS Getting started 2.0's message log. P7 praised the visible delivery/queue status. P11 wanted status updates so 'they'll know' what happened.",
    relatedThemes: ["Time-to-value", "Message logs"],
    relatedQuoteIds: ["q008", "q032", "q041", "q065"],
    relatedConcepts: ["RCS Getting started 2.0"],
    confidence: "High",
  },
  {
    id: "i03",
    title: "Resource creation (keys, apps, agents) belongs after the first test",
    body:
      "Participants object to creating resources before they understand why. P3 called the Onboarding app 'an easy-access test' and asked 'why do you need this?' P8 said the 'app business is a detail I don't need to know about' as a first-time user. P2 praised RCS Getting started 2.0 for removing the sign-up and credit-card wall before testing.",
    relatedThemes: ["Resource creation", "Setup friction"],
    relatedQuoteIds: ["q015", "q036", "q013", "q027"],
    relatedConcepts: ["RCS Getting started 2.0", "Onboarding app"],
    confidence: "High",
  },
  {
    id: "i04",
    title: "Each iteration (1.0 → 2.0 → 3.0) has moved further in the send-first direction",
    body:
      "Every participant who compared versions preferred the newer one. P1 preferred RCS Getting started 1.0's single-page layout and richer log over the Onboarding app. P13 (2.0) called integration 'super easy.' The 3.0 sessions extend that arc: P16 called the send-a-test shortcut 'really good,' P17 pasted the curl example straight into their code, and P19 called the sandbox 'fabulous' once they found it. The direction is validated; each iteration exposes the next layer of blockers (terminology, pricing, dev/prod split) that the previous one didn't have to answer.",
    relatedThemes: ["Time-to-value", "Setup friction"],
    relatedQuoteIds: ["q006", "q029", "q050", "q210", "q220", "q240"],
    relatedConcepts: [
      "RCS Getting started 3.0",
      "RCS Getting started 2.0",
      "RCS Getting started 1.0",
    ],
    confidence: "High",
  },
  {
    id: "i05",
    title: "The Onboarding app provides structure, but step count feels heavy",
    body:
      "Participants value the structured path but describe fatigue. P4 said it was 'quite a lot of text to get through'. P6 said it 'feels like reading… by doing it here or this way'. P8 noted 'there is kind of a lot of steps to go through'.",
    relatedThemes: ["Setup friction"],
    relatedQuoteIds: ["q019", "q030", "q035"],
    relatedConcepts: ["Onboarding app"],
    confidence: "Medium",
  },
  {
    id: "i06",
    title: "Developers want payloads, code, and logs — and RCS Getting started 2.0 delivers this",
    body:
      "Developers praised in-browser curl and payload visibility. P12 said 'that was actually super easy… I really liked how user friendly that flow was'. P13 liked being able to 'run the request directly from there'. P11 said putting code alongside the UI 'makes sense… any client would leverage it'.",
    relatedThemes: ["API playground", "Message logs"],
    relatedQuoteIds: ["q044", "q050", "q042", "q049"],
    relatedConcepts: ["RCS Getting started 2.0"],
    confidence: "High",
  },
  {
    id: "i07",
    title: "Non-developers complete the RCS Getting started 2.0 flow but stumble on compliance",
    body:
      "P9 navigated branding and agent creation smoothly and called the UI 'pretty pretty simple'. P15 finished the flow but hit walls on compliance/consent fields — 'as a sales service customer, I have no idea what I should put here'. Self-service works for testing; compliance still assumes domain expertise.",
    relatedThemes: ["Setup friction", "Production readiness"],
    relatedQuoteIds: ["q038", "q062", "q063", "q064"],
    relatedConcepts: ["RCS Getting started 2.0"],
    confidence: "High",
  },
  {
    id: "i08",
    title: "Test → API → production is how participants naturally progressed",
    body:
      "After a successful test, participants described moving to code and then to production. P1: 'once I've done that… then I can use the API and the keys'. P12: flow 'super easy' for test, then ran into RCS go-live compliance. P14 wanted an explicit 'submit for approval' CTA to close the loop to production.",
    relatedThemes: ["Time-to-value", "Production readiness"],
    relatedQuoteIds: ["q002", "q049", "q058"],
    relatedConcepts: ["RCS Getting started 2.0"],
    confidence: "High",
  },
  {
    id: "i09",
    title: "The sandbox is the strongest hook we have — and half of users don't find it",
    body:
      "In 3.0, once participants got into the sandbox they praised it in strong terms: P18 called it 'great,' P19 called it 'fabulous.' But P19 didn't see it until the moderator pointed at it — 'I would highlight it a bit more instead of it being hidden.' P17 used it fluently but couldn't tell whether it was theirs or Sinch's. The sandbox works; the entry-point does not. Landing the send-first experience should be the primary visual affordance of the page.",
    relatedThemes: ["Time-to-value", "Setup friction"],
    relatedQuoteIds: ["q240", "q230", "q222", "q210"],
    relatedConcepts: ["RCS Getting started 3.0"],
    confidence: "High",
  },
  {
    id: "i10",
    title: "Pricing is the final gate before commitment — hiding it defers the decision",
    body:
      "P19 was explicit: 'if the costs were clear, I'd just put my credit card number in and go.' P18 wanted a live cost summary as countries were added — 'I would have wanted a summary of this.' The 2.0 sessions surfaced the same pattern (P1 wanted pricing 'a lot higher up the list'). Without pricing at the point of decision — before account creation, and again as country selections accumulate — evaluators pause and often churn.",
    relatedThemes: ["Production readiness", "Time-to-value"],
    relatedQuoteIds: ["q241", "q233", "q231", "q005"],
    relatedConcepts: [
      "RCS Getting started 3.0",
      "RCS Getting started 2.0",
      "Onboarding app",
    ],
    confidence: "High",
  },
  {
    id: "i11",
    title: "The messaging-service / agent / channel hierarchy is the persistent blocker",
    body:
      "Across 3.0 sessions, participants of both personas couldn't map the vocabulary onto each other: 'agent' collides with AI-agent (P18, P19); 'messaging service' has no analogue in developer tools they know (P15); the relationship between channel, agent, and service surfaces late as a tooltip that P19 said should have been front-and-center. P15 summarised the developer view bluntly: 'the hierarchy and all the layers are what create confusion… I just want a list of my agents.' The concepts themselves are defensible — the entry-point needs a visual architectural map, not more inline copy.",
    relatedThemes: ["Setup friction", "Resource creation"],
    relatedQuoteIds: ["q243", "q232", "q214", "q205"],
    relatedConcepts: ["RCS Getting started 3.0"],
    confidence: "High",
  },
  {
    id: "i12",
    title: "Developers want a persistent dev environment, not a single 'go live' jump",
    body:
      "3.0 developers described a missing step between sandbox and production. P16: '\"Go to Production\" sounds very final… there's usually some step in between.' P17 wanted 'separate keys for test and for production' and 'a test environment as similar as possible to production' that they could keep using through development. Today the flow offers 'sandbox' (Sinch's) or 'go live' (fully compliant, operator-approved) — nothing in between. The developer path (test → build against my own agent → go live) exists in the product but isn't surfaced as a first-class stage.",
    relatedThemes: ["Production readiness", "Setup friction"],
    relatedQuoteIds: ["q211", "q212", "q221", "q224"],
    relatedConcepts: ["RCS Getting started 3.0"],
    confidence: "High",
  },
  {
    id: "i13",
    title: "SDKs, types, and AI-agent scaffolding belong on the first code surface",
    body:
      "Raw curl is a good floor but a bad ceiling. P15 spent time hunting for TypeScript types and asked for downloadable 'agent skills' (MCP-style scaffolding for AI coding tools). P17 valued Node and Python examples for 'copy and paste'. P19 asked for LLM/Copilot integration inside the code panel. The API-playground surface should default to a language picker (curl / Node / Python / other) and expose an AI-agent skill / MCP entry-point alongside — not one page deeper.",
    relatedThemes: ["API playground", "Setup friction"],
    relatedQuoteIds: ["q204", "q201", "q244", "q220"],
    relatedConcepts: ["RCS Getting started 3.0"],
    confidence: "Medium",
  },
];
