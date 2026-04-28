import type { Insight } from "../types";

export const insights: Insight[] = [
  {
    id: "i01",
    title: "Developers want to test hands-on before they configure",
    body:
      "Across developer sessions, the first thing participants reach for is a way to send a test message. P1 said 'I usually like to try it hands on as soon as possible.' P6 described the sandbox's purpose as 'just try to send one test message… not really having to set up.' P8 wanted to send a test message with their company name before webhook setup.",
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
    title: "RCS Getting started 2.0 is a meaningful improvement over prior versions",
    body:
      "Every participant who compared versions preferred RCS Getting started 2.0. P1 preferred its single-page layout and richer message log. P6 preferred its 'more clear self-service style'. P13 said the integration experience was 'super easy'. P15 said the onboarding is 'really great… a lot compared to what I have experienced a few months ago.'",
    relatedThemes: ["Time-to-value", "Setup friction"],
    relatedQuoteIds: ["q006", "q029", "q050", "q064"],
    relatedConcepts: ["RCS Getting started 2.0"],
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
];
