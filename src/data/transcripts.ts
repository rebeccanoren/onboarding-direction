import type { Transcript } from "../types";

export const transcripts: Transcript[] = [
  {
    id: "t01",
    participant: "P1",
    persona: "Developer",
    concepts: ["Onboarding app", "RCS Getting started 1.0"],
    date: "2026-04-24",
    sourceFile: "participant-1-dev-internal.txt",
    audience: "internal",
    summary:
      "P1 was shown the Onboarding app and RCS Getting started 1.0 back-to-back. Found the core testing flow intuitive — sending a message to verify functionality works quickly. Flagged friction with access key management, webhook setup, and wanted pricing information higher up. Later compared with RCS Getting started 1.0 and preferred its single-page layout and richer message log.",
  },
  {
    id: "t02",
    participant: "P2",
    persona: "Developer",
    concepts: ["Onboarding app", "RCS Getting started 1.0"],
    date: "2026-04-24",
    sourceFile: "participant-2-dev-internal.txt",
    audience: "internal",
    summary:
      "P2, familiar with the API from involvement in earlier versions, was shown RCS Getting started 1.0 and the Onboarding app. Strongly preferred RCS Getting started 1.0 for removing barriers (no sign-up required, no credit card) and for showing capability first, then exposing webhook and production complexity gradually.",
  },
  {
    id: "t03",
    participant: "P3",
    persona: "Developer",
    concepts: ["Onboarding app", "RCS Getting started 1.0"],
    date: "2026-04-24",
    sourceFile: "participant-3-dev-internal.txt",
    audience: "internal",
    summary:
      "P3 was shown the Onboarding app and RCS Getting started 1.0. Found RCS Getting started 1.0 more intuitive than the Onboarding app, valuing the ability to test first without sign-up friction. Appreciated interactive elements and visual feedback; noted that a 16-step onboarding felt overwhelming and preferred separating simple testing from complex agent setup.",
  },
  {
    id: "t04",
    participant: "P4",
    persona: "Developer",
    concepts: ["Onboarding app", "RCS Getting started 1.0"],
    date: "2026-04-24",
    sourceFile: "participant-4-dev-internal.txt",
    audience: "internal",
    summary:
      "P4 was shown the Onboarding app and RCS Getting started 1.0. Valued the structured Get Started approach and liked the gamification of progress indicators. Appreciated step-by-step guidance that breaks information into digestible chunks. However, found the flow unclear when transitioning from testing to production, and wanted better explanation of 'test' vs 'live'.",
  },
  {
    id: "t05",
    participant: "P5",
    persona: "Developer",
    concepts: ["Onboarding app", "RCS Getting started 1.0"],
    date: "2026-04-24",
    sourceFile: "participant-5-dev-internal.txt",
    audience: "internal",
    summary:
      "P5 (internal developer) was shown the Onboarding app and RCS Getting started 1.0. Walked through the test-first flow, verified phone number, sent a rich card, and inspected the message log to follow the message lifecycle.",
  },
  {
    id: "t06",
    participant: "P6",
    persona: "Developer",
    concepts: ["Onboarding app", "RCS Getting started 1.0"],
    date: "2026-04-24",
    sourceFile: "participant-6-dev-internal.txt",
    audience: "internal",
    summary:
      "P6 was shown RCS Getting started 1.0 and the Onboarding app. Preferred RCS Getting started 1.0 for its straightforward self-service style and clarity. Found the Onboarding app felt like reading 15 steps without clear action or progress. Valued doing things while learning, with interactive elements that show immediate results rather than purely informational content.",
  },
  {
    id: "t07",
    participant: "P7",
    persona: "Developer",
    concepts: ["RCS Getting started 2.0"],
    date: null,
    sourceFile: "RCS Getting started 2.0-7-dev-internal.txt",
    audience: "internal",
    summary:
      "P7 (internal) tested RCS Getting started 2.0 onboarding for RCS setup. Appreciated the RCS Getting started 2.0 environment and API playground for testing, described the flow from test messages to API integration, and suggested linking to live production setup earlier. Praised the UI design and hand-holding through regulatory steps.",
  },
  {
    id: "t08",
    participant: "P8",
    persona: "Developer",
    concepts: ["RCS Getting started 2.0"],
    date: "2026-04-23",
    sourceFile: "RCS Getting started 2.0-8-dev-internal.txt",
    audience: "internal",
    summary:
      "P8 (internal) explored RCS agent creation and API testing. Found the process comprehensive but noted friction around webhook setup appearing too early and difficulty understanding the Conversation API app requirement. Appreciated test-message functionality but wanted curl examples and clearer documentation on dependencies.",
  },
  {
    id: "t09",
    participant: "P9",
    persona: "Non-developer",
    concepts: ["RCS Getting started 2.0"],
    date: "2026-04-23",
    sourceFile: "RCS Getting started 2.0-9-non-dev-external.txt",
    audience: "external",
    summary:
      "Non-technical P9 (external) tested RCS agent creation and branding setup. Found the UI very straightforward with good visual feedback. Noted confusion around the Conversation API app requirement and suggested clearer language for conversational vs non-conversational modes. Appreciated templates and pre-filled information but wanted email confirmations.",
  },
  {
    id: "t10",
    participant: "P10",
    persona: "Developer",
    concepts: ["RCS Getting started 2.0"],
    date: "2026-04-23",
    sourceFile: "RCS Getting started 2.0-10-dev-external.txt",
    audience: "external",
    summary:
      "P10 (external developer with sales/account-manager background) navigated the onboarding successfully but struggled with missing context around compliance requirements, unclear parameter naming in API payloads, and insufficient explanations of why certain fields (consent, legal docs) were required. Spoke from a developer perspective when discussing API documentation, Postman collections, and prefilled requests.",
  },
  {
    id: "t11",
    participant: "P11",
    persona: "Developer",
    concepts: ["RCS Getting started 2.0"],
    date: "2026-04-23",
    sourceFile: "RCS Getting started 2.0-11-dev-external.txt",
    audience: "external",
    summary:
      "P11 (external) found the send-test-message flow clean and transparent, praised excellent message logs and payload visibility. Valued the ability to view code alongside UI and detailed webhook examples for developers. Flagged ambiguity around when webhooks should appear in setup and concerns about Conversation API connectivity being manual rather than automatic.",
  },
  {
    id: "t12",
    participant: "P12",
    persona: "Developer",
    concepts: ["RCS Getting started 2.0"],
    date: "2026-04-23",
    sourceFile: "RCS Getting started 2.0-12-dev-external.txt",
    audience: "external",
    summary:
      "P12 (external) progressed through send-test-message, API playground, and RCS agent setup. Appreciated preview features and real-time feedback. Found the app creation flow confusing when pre-populated test data was provided without explicit context, and described RCS go-live compliance requirements as heavy.",
  },
  {
    id: "t13",
    participant: "P13",
    persona: "Developer",
    concepts: ["RCS Getting started 2.0"],
    date: "2026-04-23",
    sourceFile: "RCS Getting started 2.0-13-dev-external.txt",
    audience: "external",
    summary:
      "P13 (external; non-native English developer with marketing/Mailjet background) found the onboarding experience significantly improved compared to previous Cinch Build versions. Praised the straightforward flow, real-time previews, and ability to test quickly. Integration experience now seamless and required minimal support team involvement.",
  },
  {
    id: "t14",
    participant: "P14",
    persona: "Developer",
    concepts: ["RCS Getting started 2.0"],
    date: "2026-04-23",
    sourceFile: "RCS Getting started 2.0-14-dev-external.txt",
    audience: "external",
    summary:
      "P14 (external; UX/design background) appreciated the visual previews and intuitive flow but was confused by two parallel checklists (test vs compliance) and role differentiation. Setup friction felt minimal for testing, but compliance steps felt tedious and lacked clarity on which steps were mandatory vs informational.",
  },
  {
    id: "t15",
    participant: "P15",
    persona: "Developer",
    concepts: ["RCS Getting started 3.0"],
    date: "2026-05-25",
    sourceFile: "v3-participant-15-external-dev-2026-05-25-translated.txt",
    audience: "external",
    summary:
      "P15 (external developer, session translated from Swedish) explored the RCS Getting started 3.0 send-first flow. Praised how quickly a test message returned a log entry and how transparent the payload / delivery-status loop was. Repeatedly asked for the payload schema for different message types, language SDKs, TypeScript types, and downloadable 'agent skills' for AI coding tools. Confused by the service / agent / channel / access-key hierarchy — 'the hierarchy and all the layers are what create confusion.' Called the compliance / go-live formulation 'a bit over my pay grade' and said RCS onboarding should have two distinct tracks: play with the API vs. set up your own production agent.",
  },
  {
    id: "t16",
    participant: "P16",
    persona: "Developer",
    concepts: ["RCS Getting started 3.0"],
    date: "2026-05-25",
    sourceFile: "v3-participant-16-internal-dev-2026-05-25-translated.txt",
    audience: "internal",
    summary:
      "P16 (internal developer, translated from Swedish) tested RCS Getting started 3.0 end-to-end. Praised the send-a-test-message shortcut and the way the sandbox lets developers borrow preconfigured resources. Struggled with state loss (checklist and logs disappeared after creating an access key) and with the fact that the UI-first and code-first paths represent the same underlying action. 'Go to Production' language felt too final — the missing step is 'build against your own agent' before real go-live. Also flagged that country selection surfaces heavy operator-approval cost before the developer has finished integrating.",
  },
  {
    id: "t17",
    participant: "P17",
    persona: "Developer",
    concepts: ["RCS Getting started 3.0"],
    date: "2026-05-27",
    sourceFile: "v3-participant-17-external-dev-2026-05-27-translated.txt",
    audience: "external",
    summary:
      "P17 (external developer, translated from Swedish) went straight to docs, ran the RCS Getting started 3.0 sandbox quickly, and pasted the curl example into their own environment. Praised the log, the preview, and the code samples. The big gap: no clear separation between sandbox, dev, and production. Wanted separate keys for test and production, a persistent test environment that stays close to prod, and a single place that lists all the values (project ID, messaging service ID, keys) needed for a production request. Would have looked at webhooks earlier if they had been surfaced in the sandbox.",
  },
  {
    id: "t18",
    participant: "P18",
    persona: "Non-developer",
    concepts: ["RCS Getting started 3.0"],
    date: "2026-06-01",
    sourceFile: "v3-participant-18-external-2026-06-01.txt",
    audience: "external",
    summary:
      "P18 (external non-developer, session in Swedish) read the RCS docs first, then tried the sandbox — 'I love this feature, it's great that you can use Sandbox and get concretely how it looks in my own phone.' Wanted docs and pricing before creating an account. Called out that 'agent' is confusing next to AI agents and that the messaging-service / channel / project-ID relationship is unclear. Refused to fill compliance fields with fake data. Wanted a live cost summary as countries are added — 'I would have wanted to see a summary of this.'",
  },
  {
    id: "t19",
    participant: "P19",
    persona: "Developer",
    concepts: ["RCS Getting started 3.0"],
    date: "2026-06-01",
    sourceFile: "v3-participant-19-external-2026-06-01.txt",
    audience: "external",
    summary:
      "P19 (external developer, first-time messaging-API user) started in the RCS Getting started 3.0 documentation, then had to be pointed to the sandbox — 'I would highlight it a bit more instead of it being hidden.' Once inside, said 'oh, this is fabulous.' Asked for docs and sandbox side-by-side, an LLM/Copilot integration inside the code panel, a preview of the message as it would render on the phone, richer logs with filtering and bulk download, and an architectural overview of how agent / messaging service / channel fit together. Pricing was the explicit blocker to commitment — 'if the costs were clear, I'd just put my credit card number in and go.'",
  },
];

export const transcriptById = (id: string) =>
  transcripts.find((t) => t.id === id);

const audienceByParticipant: Record<string, "internal" | "external"> = {};
for (const t of transcripts) audienceByParticipant[t.participant] = t.audience;

export const audienceForParticipant = (
  participant?: string
): "internal" | "external" | undefined =>
  participant ? audienceByParticipant[participant] : undefined;
