import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Quote as QuoteIcon,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";
import type {
  Persona,
  Quote,
  Transcript,
  TranscriptAnalysis,
} from "./types";
import { quotes, quoteById } from "./data/quotes";
import {
  audienceForParticipant,
  transcripts,
  transcriptById,
} from "./data/transcripts";
import { transcriptAnalysisById } from "./data/transcriptAnalyses";

// =================================================================
// Content (drafted against the 13 transcripts / 65 quotes in /data)
// =================================================================

const HERO = {
  title: "Messaging Onboarding: Key Insights & Direction",
  supporting: [
    "Across fourteen usability sessions, a clear pattern emerged: users try to validate messaging first, then figure out how to set it up and integrate it.",
    "This presentation shows what users actually do, where they get blocked, and the onboarding approach that better supports that journey.",
  ],
  stats: [
    { label: "Research sessions", value: "14" },
    {
      label: "Personas covered",
      value: "13 Developers & 1 non-developer",
    },
    {
      label: "Prototypes tested",
      value: "Sandbox 1.0 · Sandbox 2.0 · Onboarding app",
    },
  ],
};

interface ExecSummaryItem {
  headline: string;
  /** One or more paragraphs of body text. */
  body: string[];
  /** Optional bullet list (e.g. for the persona-divergence finding). */
  bullets?: string[];
}

const EXEC_SUMMARY: ExecSummaryItem[] = [
  {
    headline: "Users seek proof before setup",
    body: [
      "Across sessions, most participants tried to send a message as their first action.",
      "They were not looking to configure resources or understand the system upfront.",
    ],
  },
  {
    headline: "The first value moment is a working message",
    body: [
      "Users evaluate the product by sending a message and seeing it delivered through logs, status, or preview.",
      "This immediate feedback builds trust and helps users understand how the system works.",
    ],
  },
  {
    headline: "Early setup creates friction",
    body: [
      "Apps, keys, agents, and webhooks are necessary.",
      "But when introduced before the first test, they feel like blockers rather than progress.",
    ],
  },
  {
    headline: "Users start the same, then diverge",
    body: [
      "Most users begin by testing the product.",
      "After that, their paths diverge:",
    ],
    bullets: [
      "Developers move toward API integration.",
      "Business users move toward setup and compliance.",
    ],
  },
  {
    headline: "Resources only make sense with intent",
    body: [
      "Concepts like apps, keys, and agents become clear when users are ready to integrate or go live.",
      "Before that, they are often confusing or ignored.",
    ],
  },
  {
    headline: "Users learn by doing, not by reading",
    body: [
      "Participants engaged by taking action \u2014 sending messages, running requests, and exploring results.",
      "Documentation and navigation were typically secondary until after initial interaction.",
    ],
  },
  {
    headline: "Implication: lead with value, introduce setup later",
    body: [
      "Start with a test-first entry point to prove the product works.",
      "Then introduce API and resources when users move toward integration and go-live.",
    ],
  },
];

// --- Ideal onboarding journey ---------------------------------------------

interface JourneyQuote {
  short: string;
  long?: string;
  /** Short descriptive headline shown above the long quote in the popover. */
  title?: string;
  /** Participant ID, e.g. "P1". */
  participant?: string;
  /** Persona label, e.g. "Developer". */
  persona?: string;
}

type JourneyIllustration = "send" | "analytics" | "api" | "delivered";

type JourneyDescriptionItem =
  | string
  | { kind: "check" | "cross"; text: string };

type JourneyWhyGroup =
  | {
      kind?: "quotes";
      intro: string;
      /** Indices into the step's `whyQuotes` array. */
      quoteIndices: number[];
    }
  | {
      kind: "commentary";
      /** Optional small uppercase eyebrow heading shown above the text. */
      title?: string;
      /** Stand-alone editorial paragraph between quote groups. */
      text: string;
      /** Optional per-persona (or per-segment) sub-items below the lead text. */
      subItems?: { label: string; text: string }[];
      /** Optional plain bullet list rendered after the lead text. */
      bullets?: string[];
      /** Optional closing sentence after the sub-items. */
      conclusion?: string;
    };

interface JourneyDesignPrinciples {
  items: string[];
  goal?: string;
}

interface JourneyConcreteIdea {
  text: string;
  /** Optional secondary line shown below the main idea (e.g. "(curl, UI, or API playground)"). */
  meta?: string;
  /** Plain bullet list of supporting points. */
  bullets?: string[];
  /** Structured label/description sub-items (used for relational mappings). */
  subItems?: { label: string; description: string }[];
}

interface JourneyValueProp {
  title: string;
  description?: string;
  /** Optional plain bullet list rendered under the title/description. */
  bullets?: string[];
  /** Optional closing sentence rendered after bullets / sub-items. */
  conclusion?: string;
  /** Optional nested list rendered under the title (e.g. per-persona). */
  subItems?: { label: string; text: string }[];
}

interface JourneyStep {
  id: string;
  number: number;
  title: string;
  description: JourneyDescriptionItem[];
  keyAction?: string;
  whyQuotes: JourneyQuote[];
  /** When present, the Why section renders quotes grouped under intro lines. */
  whyGroups?: JourneyWhyGroup[];
  /** When present, a Value section appears at the bottom of the step card. */
  valueProps?: JourneyValueProp[];
  paths?: { label: string; description: string }[];
  illustration?: JourneyIllustration;
  /** Optional persona/audience tag displayed above the title. */
  tag?: string;
  /** "What happens next" section with branching paths, each with bullet items. */
  nextSteps?: {
    intro: string;
    paths: { label: string; items: string[] }[];
  };
  /** Optional standalone insight callout shown before the Key takeaway. */
  keyInsight?: { headline: string; bullets?: string[] };
  /** Closing summary statement shown after the Value section. */
  keyTakeaway?: { headline: string; subtext?: string };
  /** Optional design-principles block (typically used for technical steps). */
  designPrinciples?: JourneyDesignPrinciples;
  /** Optional concrete implementation ideas listed after the principles. */
  concreteIdeas?: JourneyConcreteIdea[];
}

interface JourneyTheme {
  id: string;
  label: string;
  subtitle: string;
  steps: JourneyStep[];
}

const JOURNEY: JourneyTheme[] = [
  {
    id: "experience-value",
    label: "Theme 1 \u00b7 Experience value",
    subtitle:
      "Users prove the product works before they configure anything.",
    steps: [
      {
        id: "s1",
        number: 1,
        title: "Send your first message",
        illustration: "send",
        description: [
          { kind: "check", text: "User sends a message directly in the UI" },
          { kind: "cross", text: "No resource creation" },
          { kind: "cross", text: "No access keys" },
          { kind: "cross", text: "No technical setup" },
        ],
        keyAction: "Send message",
        whyQuotes: [
          {
            title: "Developers want hands-on first",
            participant: "P1",
            persona: "Developer",
            short:
              "Being able to send a message\u2026 is usually the first thing I try to achieve.",
            long:
              "Yeah. I try to go and find the service. See how I can set it up. I usually like to try it hands on as soon as possible. So being able to send a message, to my phone or something, is usually the first thing I try to achieve, whether I can do that through the web app directly or have to do some additional setup. That\u2019s the end goal either way. But obviously, it\u2019s better if I can just do it out of the application itself.",
          },
          {
            title: "First click is Send test message",
            participant: "P12",
            persona: "Developer",
            short:
              "I think the first thing that I would do is click on send test message.",
            long:
              "Send a test message, create RCS agent. I don\u2019t know what an RCS agent is, so I think the first thing that I would do is click on send test message to see if I can do that. Alright, so I can send it to my device which is what I would want to do, so I click here to add my phone number. That looks good enough.",
          },
          {
            title: "A tangible result on a real phone",
            participant: "P6",
            persona: "Developer",
            short:
              "I would expect some kind of result in my own cell phone.",
            long:
              "I would say it\u2019s to just try to send one test message to see how it is working. I guess I would use my phone number and then just go through the whole steps, and I would expect some kind of result in my own cell phone. So not really having to set up, but to test it out.",
          },
          {
            title: "Access keys block a quick test",
            participant: "P3",
            persona: "Developer",
            short:
              "Why do I need [an access key]? I thought this would be a quick test.",
            long:
              "I just want to quickly be able to send a message and there it gets blocked by access key\u2026 why do I need that? I thought this would be a quick test.",
          },
        ],
        whyGroups: [
          {
            intro:
              "Users consistently try to send a message as their first action.",
            quoteIndices: [0, 1],
          },
          {
            kind: "commentary",
            text:
              "They are not trying to configure the system. They are trying to validate that it works.",
          },
          {
            kind: "commentary",
            text: "This applies to both developers and non-developers.",
            subItems: [
              {
                label: "Developers",
                text: "want to quickly validate behaviour before writing code.",
              },
              {
                label: "Non-developers",
                text:
                  "want to understand the product without technical setup.",
              },
            ],
            conclusion:
              "In both cases, users want to confirm value before investing time in APIs or setup.",
          },
          {
            intro: "They also expect real, immediate feedback:",
            quoteIndices: [2],
          },
          {
            intro:
              "When this is blocked by setup, it creates friction at the very first interaction:",
            quoteIndices: [3],
          },
        ],
        valueProps: [
          {
            title: "Immediate value perception",
            description:
              "Users experience the product working within seconds.",
          },
          {
            title: "Educates through experience",
            description:
              "The test message shows what a message looks like in practice, helping users understand the core concept without prior knowledge.",
          },
          {
            title: "Introduces sender and template concepts naturally",
            description:
              "By seeing a real message — sender, format, branding, and message templates — users begin to understand what a sender (e.g. RCS agent) and a template represent.",
          },
        ],
        keyTakeaway: {
          headline:
            "The first message is the moment the product proves itself.",
          subtext:
            "Setup earns its place after value is shown — not before.",
        },
      },
      {
        id: "s2",
        number: 2,
        title: "See that it works",
        illustration: "analytics",
        description: [
          "Delivery status (queued, delivered, read)",
          "Message preview",
          "Message logs and payload",
        ],
        keyAction: "View result",
        whyQuotes: [
          {
            title: "Inspecting the message log",
            participant: "P7",
            persona: "Developer",
            short:
              "I can see the IDs, the channel, recipient, correlation ID, and when it was delivered and queued.",
            long:
              "So then I click that. Okay. So I see all of my \u2014 oh, that\u2019s really cool. So I can see all the message information here. The test messages, I can see the IDs, the channel, recipient, correlation ID, and then I can see when it was delivered and when it was queued.",
          },
          {
            title: "Drilling into the payload",
            participant: "P7",
            persona: "Developer",
            short:
              "You can click on the view payload. That\u2019s a little bit more information there.",
            long:
              "You can click on the view payload. That\u2019s a little bit more information there for me. Download. Okay. So now I\u2019ve tested it, and now I want to test the APIs. So that\u2019s nice.",
          },
          {
            title: "Events tell the story",
            participant: "P11",
            persona: "Developer",
            short:
              "It shows you the message got queued on the RCSN, and it got delivered. And reply received from the recipient.",
            long:
              "Here it says everything. That\u2019s the best thing. It shows you the message got queued on the RCSN, and it got delivered. And reply received from the recipient. So a recipient actually replied to the RCS message.",
          },
          {
            title: "Incoming events and replies",
            participant: "P11",
            persona: "Developer",
            short:
              "If they have any incoming message here \u2014 it\u2019s super nice.",
            long:
              "I think this is really nice that they could see the message that they send and what\u2019s the status of the message. And if they have any incoming message here \u2014 it\u2019s super nice, I would say.",
          },
        ],
        whyGroups: [
          {
            intro:
              "After sending a message, users immediately look for confirmation and insight into what happened.",
            quoteIndices: [],
          },
          {
            intro: "They inspect message logs and details:",
            quoteIndices: [0],
          },
          {
            intro:
              "They explore deeper technical details when available:",
            quoteIndices: [1],
          },
          {
            intro: "They interpret system behaviour through events:",
            quoteIndices: [2],
          },
          {
            intro: "They also expect to understand incoming behaviour:",
            quoteIndices: [3],
          },
          {
            kind: "commentary",
            text:
              "This step is not passive. Users are actively trying to understand how the system behaves.",
          },
        ],
        valueProps: [
          {
            title: "Confirms the product works",
            description:
              "Users see that their message was processed and delivered.",
          },
          {
            title: "Builds trust through transparency",
            description: "Clear status and logs reduce uncertainty.",
          },
          {
            title: "Works for both personas",
            subItems: [
              {
                label: "Business users",
                text: "validate that messaging works and see real outcomes.",
              },
              {
                label: "Developers",
                text:
                  "inspect logs, payload, and events to understand system behaviour.",
              },
            ],
          },
          {
            title: "Enables deeper understanding (for developers)",
            description:
              "Technical details (IDs, payload, events) provide a natural entry point into how the system works.",
          },
          {
            title: "Drives next steps",
            description:
              "Users move naturally toward API usage, integration, or setup.",
          },
        ],
        keyTakeaway: {
          headline:
            "This is where the product shifts from \u201cit works\u201d to \u201cI understand how it works.\u201d",
        },
      },
      {
        id: "s4",
        number: 3,
        title: "Explore the API (developers)",
        tag: "Developer step",
        illustration: "api",
        description: [
          "View the full API request behind the message",
          "See how Conversation API, sender (RCS agent), and test number relate",
          "Run a preconfigured request with minimal effort",
          "Explore webhooks and incoming events",
        ],
        whyQuotes: [
          {
            title: "The instinct is curl",
            participant: "P12",
            persona: "Developer",
            short:
              "My instinct could be just to open up a terminal and run this command in curl.",
            long:
              "So since I’m a developer, my instinct could be just to open up a terminal and run this command in curl because that would be the simplest way. I don’t have to, like, open up a file, throw this in there, and then run it. It just runs directly, and then I’ll see the app within the terminal.",
          },
          {
            title: "Run the request directly from the page",
            participant: "P13",
            persona: "Developer",
            short:
              "I like the fact that we can run the request directly from there.",
            long:
              "I like both because that’s quite easy. Everything is shown… I like the fact that we can run the request directly from there, because usually you have the code displayed and you need to copy-paste directly on your terminal. But here, everything is set up and you can do it on your own.",
          },
          {
            title: "What developers really look for",
            participant: "P10",
            persona: "Developer",
            short:
              "What I’m really looking for is the list of all the API calls and the resources, what they are used for, and the description of all the parameters.",
            long:
              "I know that on my side, when I try to integrate some API or things like that, I go a bit on getting started just to have kind of an overview of that. But what I’m really looking for just after that is really the list of all the API calls and the resources, what they are used for, and the description of all the parameters — what values you expect, things like that.",
          },
          {
            title: "Postman-style downloadable collections",
            participant: "P10",
            persona: "Developer",
            short:
              "Often APIs propose collections you could just download… and start playing with the code with all the parameters that you just need to fill.",
            long:
              "What I’m looking for when I’m a developer, when I want to start playing with APIs, is also the possibility to download somewhere like a Postman collection. A lot of times, developer APIs propose this kind of collections that you could just download, put inside your Postman interface, and start playing with the code — with all the parameters that you just need to fill.",
          },
          {
            title: "Prefill everything to simplify",
            participant: "P10",
            persona: "Developer",
            short:
              "They could prefill everything for you to simplify your experience.",
            long:
              "When you are in a public documentation, you need to guess all of that because nothing is associated to your account. Here, as you are in the context of your own account and you are already signed in, it means that this platform already has all your information. So they could prefill everything for you to simplify your experience.",
          },
        ],
        whyGroups: [
          {
            intro:
              "After validating that messaging works, developers naturally move toward understanding how it works technically.",
            quoteIndices: [0],
          },
          {
            intro: "They inspect the request and response structure:",
            quoteIndices: [1],
          },
          {
            intro:
              "They look for clear API reference and parameter descriptions:",
            quoteIndices: [2],
          },
          {
            intro:
              "They expect ready-to-run tooling — Postman collections, prefilled requests:",
            quoteIndices: [3, 4],
          },
          {
            kind: "commentary",
            text:
              "They expect to understand system relationships and flows:",
            bullets: [
              "How messages are sent (Conversation API)",
              "What represents the sender (RCS agent)",
              "How incoming messages are received (webhooks)",
            ],
          },
          {
            kind: "commentary",
            text:
              "At this stage, developers are motivated to try things themselves — but still expect a low-effort, low-risk environment.",
          },
        ],
        valueProps: [
          {
            title: "Enables hands-on API testing",
            description:
              "Developers can try real requests without setup overhead.",
          },
          {
            title: "Educates system architecture",
            description:
              "Clarifies the relationship between Conversation API → sender → recipient.",
          },
          {
            title: "Reduces integration friction",
            description:
              "Preconfigured requests remove the need to figure out setup.",
          },
          {
            title: "Supports fast experimentation",
            description:
              "Developers can modify and test requests immediately.",
          },
          {
            title: "Prepares for real integration",
            description:
              "Developers gain confidence before using their own credentials.",
          },
        ],
        designPrinciples: {
          items: [
            "No resource creation required",
            "No persistent setup needed",
            "Testing should not require users to create or manage persistent credentials",
            "Everything is prefilled and ready to run",
          ],
          goal: "Copy, run, modify.",
        },
        concreteIdeas: [
          {
            text: "Prefilled API request",
            meta: "(curl, UI, or API playground)",
            bullets: [
              "Matches the message just sent.",
              "Can be run immediately with no setup.",
            ],
          },
          {
            text: "Managed test access",
            bullets: [
              "No need to create or store credentials.",
              "Uses temporary or system-provided access.",
            ],
          },
          {
            text: "Clear mapping between system components",
            subItems: [
              {
                label: "Conversation API",
                description: "sending layer.",
              },
              {
                label: "Sender (RCS agent)",
                description: "identity.",
              },
              {
                label: "Test number",
                description: "recipient.",
              },
            ],
          },
          {
            text: "Visible system behavior",
            bullets: [
              "Delivery status and message lifecycle.",
              "Webhook preview or simulated incoming events.",
            ],
          },
          {
            text: "Tools for deeper exploration",
            bullets: [
              "Downloadable Postman collection.",
              "Ability to modify and rerun requests.",
            ],
          },
        ],
        keyTakeaway: {
          headline:
            "Developers don’t want to set up the API first. They want to understand it and try it first.",
        },
      },
    ],
  },
  {
    id: "production",
    label: "Theme 2 \u00b7 Get ready for production",
    subtitle:
      "Users have validated value. Now they build their own setup and go live.",
    steps: [
      {
        id: "s5",
        number: 4,
        title: "Set up your own channel",
        description: [
          { kind: "check", text: "User creates their own RCS Agent" },
          { kind: "check", text: "Defines how they appear to end users" },
          { kind: "check", text: "Continues testing using their own setup" },
        ],
        keyAction: "Create channel",
        whyQuotes: [
          {
            title: "Users want to graduate from test to real",
            participant: "P5",
            persona: "Developer",
            short:
              "What if I don\u2019t want to have a test agent\u2026 I just want a real agent?",
            long:
              "I\u2019m looking, for, like, a place that what if I don\u2019t want to have a test, agent now and I want just to use the, like, a real agent? Is this because I was assuming that even if you, as a customer, apply, you can have a test agent or test you can do some testing first and then start your, like, real message, or then start sending your real messages to the customer. So I was looking for where I can start the real one then.",
          },
          {
            title: "The intent is real customers",
            participant: "P5",
            persona: "Developer",
            short:
              "I want to send this exact message to, like, a hundred thousand customers now.",
            long:
              "Like, I as IKEA for example. I went through this and I did this to see okay. Like, the message was look like this before. Like when I wanted to send, now I\u2019m okay with it. So I want to send, this, like, this exact message to, like, hundred thousand of customers now.",
          },
        ],
        whyGroups: [
          {
            intro:
              "After validating that messaging works, users want to move beyond test:",
            quoteIndices: [0, 1],
          },
          {
            kind: "commentary",
            text:
              "They are no longer exploring. They want something they own and can use for real.",
          },
          {
            kind: "commentary",
            text:
              "The intent behind \u201ctheir own channel\u201d differs by persona, and the product needs to support both.",
            subItems: [
              {
                label: "Developers want",
                text:
                  "their own credentials, their own agent, control over integration.",
              },
              {
                label: "Business users want",
                text:
                  "their brand (name, logo, content), control over how they appear to customers.",
              },
            ],
            conclusion:
              "\ud83d\udc49 Both converge on the same need: a channel they own, configured for their business.",
          },
        ],
        valueProps: [
          {
            title: "Bridges test to real",
            description:
              "Users move from a demo to something they can actually use.",
          },
          {
            title: "Establishes identity",
            description:
              "This is where the brand becomes real in messages.",
          },
          {
            title: "Introduces real setup at the right time",
            description:
              "Credentials and integration now feel necessary, not blocking.",
          },
          {
            title: "Keeps momentum",
            description:
              "Users continue testing, now with their own setup.",
          },
        ],
        keyInsight: {
          headline:
            "This is the first moment where setup is welcomed, not resisted.",
          bullets: [
            "Earlier, setup blocked progress.",
            "Now, it is progress.",
            "The difference is timing.",
          ],
        },
        keyTakeaway: {
          headline:
            "Users don\u2019t just try messaging. They start using it for their own business.",
        },
      },
      {
        id: "s6",
        number: 5,
        title: "Validate your setup (second value moment)",
        illustration: "delivered",
        description: [
          {
            kind: "check",
            text: "User sends a message from the agent they just created",
          },
          {
            kind: "check",
            text: "Sees their own brand (name, logo, content) in a real message",
          },
          {
            kind: "check",
            text: "Confirms delivery through logs, status, and preview",
          },
          {
            kind: "check",
            text: "Continues testing using the dashboard or API playground",
          },
        ],
        keyAction: "Send test message",
        whyQuotes: [
          {
            title: "Confirmation unlocks confidence",
            participant: "P1",
            persona: "Developer",
            short:
              "Once I’ve done that… then I can kind of relax and know that this thing works.",
            long:
              "So, yeah, that that’s the thing I’ll usually want to achieve. And once I’ve done that, then I can kind of relax and know that, okay, this thing works, then I can just, yeah, use the API and the keys to actually integrate it into, any system.",
          },
          {
            title: "Test from their own setup",
            participant: "P8",
            persona: "Developer",
            short:
              "I think I would want to try and send a test message… ideally I would want to send it with my company name.",
            long:
              "I think I would want to try and send a test message. And, ideally, I would want to send it with my, company name to my own phone. I think that’s what I would like to see immediately because I don’t really care about webhooks until — if I send to my own phone, then I don’t really need confirmation elsewhere. Then I might try webhooks.",
          },
        ],
        whyGroups: [
          {
            kind: "commentary",
            title: "The problem",
            text:
              "After creating a channel, users reach a critical moment: they’ve set something up, but can’t easily confirm it works. At this point, the natural question becomes: “Does my setup actually work?”",
          },
          {
            intro: "Research signals:",
            quoteIndices: [0, 1],
          },
          {
            kind: "commentary",
            title: "What users try to do",
            text:
              "Users instinctively reach for Send test message. But the intent has shifted:",
            bullets: [
              "Before → Does the product work?",
              "Now → Does my setup work?",
            ],
            conclusion: "This marks the transition from trying → owning.",
          },
          {
            kind: "commentary",
            title: "What happens without validation",
            text: "If users cannot immediately confirm their setup:",
            bullets: [
              "Validation is delayed or blocked.",
              "The flow breaks right after creation.",
              "Confidence drops instead of building.",
            ],
            conclusion:
              "Result: friction, confusion, and increased drop-off risk.",
          },
          {
            kind: "commentary",
            title: "The solution direction",
            text:
              "Enable a way to validate the setup immediately after creation.",
          },
          {
            kind: "commentary",
            title: "What this enables",
            text: "Users can:",
            bullets: [
              "Send messages using their agent.",
              "See delivery status and message logs.",
              "Inspect payloads and behaviour.",
              "Continue testing without interruption.",
            ],
          },
          {
            kind: "commentary",
            title: "Constraints (by design)",
            text: "Validation is real, but intentionally limited:",
            bullets: [
              "Restricted to test scenarios (own number, test devices).",
              "Cannot reach real customers.",
              "Not production-ready.",
            ],
            conclusion:
              "It should feel real, while remaining safe and low-risk.",
          },
          {
            kind: "commentary",
            title: "Why this step is critical",
            text: "This is the second value moment:",
            bullets: [
              "First → “Messaging works.”",
              "Second → “My setup works.”",
            ],
            conclusion:
              "It validates, in one action: sender identity, message appearance, delivery behaviour.",
          },
          {
            kind: "commentary",
            title: "If this isn’t supported",
            text: "Users are pushed forward without confidence.",
            bullets: [
              "Instead of: confidence → momentum → progress",
              "we get: friction → uncertainty → drop-off",
            ],
          },
        ],
        valueProps: [
          {
            title: "Builds confidence immediately",
            description: "Users validate what they just created.",
          },
          {
            title: "Maintains momentum",
            description: "No interruption after setup.",
          },
          {
            title: "Works for both personas",
            subItems: [
              {
                label: "Developers",
                text: "Explore behaviour and logs.",
              },
              {
                label: "Business users",
                text: "Validate brand and message.",
              },
            ],
          },
          {
            title: "Supports progression",
            description: "Users move forward knowing what works.",
          },
        ],
        keyInsight: {
          headline: "Validation should happen immediately after creation.",
        },
        keyTakeaway: {
          headline:
            "Users don’t stop after creating a channel. They need to confirm it works right away.",
          subtext:
            "Enabling this moment turns setup into confidence, and confidence into progress.",
        },
      },
      {
        id: "s8",
        number: 6,
        title: "Integrate with your system",
        tag: "Developer step",
        illustration: "api",
        description: [
          {
            kind: "check",
            text: "Developer connects their backend to send and receive messages",
          },
          {
            kind: "check",
            text: "Creates a new Conversation API app or selects an existing one",
          },
          {
            kind: "check",
            text: "Connects the app to the RCS agent",
          },
          {
            kind: "check",
            text: "Retrieves API credentials and sends messages from their own environment",
          },
          {
            kind: "check",
            text: "Configures webhooks to handle incoming messages and delivery events",
          },
        ],
        keyAction: "Create app & connect",
        whyQuotes: [
          {
            title: "An app per integration",
            participant: "P1",
            persona: "Developer",
            short:
              "An app… I would expect to find the keys and the API when I go into the app… a way for me to separate integrations… maybe multiple backends.",
            long:
              "I would have concept of an app. An app, kind of a just a concept of when I would — okay. So when you usually use APIs, I would have an app per integration that I do. So perhaps I want to use the same account in CinchBuilt too and the same API, but I want to integrate it in multiple, softwares, multiple back ends maybe. And this is a way for me to kinda separate the integrations. And, I would say, perhaps for billing reasons or other things. So, yeah, I would expect to find the kind of keys and API when I go into the app.",
          },
          {
            title: "Then integrate it into any system",
            participant: "P1",
            persona: "Developer",
            short:
              "Once I’ve done that… then I can kind of relax and know that, okay, this thing works. Then I can just use the API and the keys to actually integrate it into any system.",
            long:
              "So, yeah, that that’s the thing I’ll usually want to achieve. And once I’ve done that, then I can kind of relax and know that, okay, this thing works, then I can just, yeah, use the API and the keys to actually integrate it into, any system.",
          },
          {
            title: "I should determine the name from the start",
            participant: "P12",
            persona: "Developer",
            short:
              "I would not like the app to be created… I should be determining what the name is from the very start.",
            long:
              "I would not like the app to be created for this is just me. I don’t want you to create the app for me just and have me drop into this UI. You started calling it, like, test app. I should be determining, like, what the name is from the very start and know that I’m in the test app creation flow or app creation flow. So maybe, like, add a little banner explaining, now you need to create your app.",
          },
        ],
        whyGroups: [
          {
            intro:
              "After validating their setup, developers move from testing to integration and control. Their goal is no longer to explore — it is to use their own credentials, understand how components connect, and integrate messaging into their system.",
            quoteIndices: [0, 1, 2],
          },
          {
            kind: "commentary",
            text: "These reflect a clear shift in behaviour:",
            bullets: [
              "Developers try to understand how the app connects to the agent.",
              "They look for API structure and resources.",
              "They expect to configure webhooks and integrations themselves.",
            ],
          },
          {
            kind: "commentary",
            title: "What happens in this step",
            text: "The developer now takes ownership of the setup:",
            subItems: [
              {
                label: "Create or choose app",
                text:
                  "Represents their system in the platform. Defines how messages are sent and received.",
              },
              {
                label: "Connect app to agent",
                text: "Links identity (agent) with sending layer (app).",
              },
              {
                label: "Get API credentials",
                text:
                  "Used in backend requests. Enables programmatic messaging.",
              },
              {
                label: "Set up webhooks",
                text:
                  "Receive incoming messages. Handle delivery, read, and reply events.",
              },
            ],
          },
          {
            kind: "commentary",
            title: "Why this step must be explicit",
            text:
              "When the app is introduced here, it aligns with developer expectations:",
            bullets: [
              "They understand why it exists.",
              "They need it for their use case.",
              "They want to control it.",
            ],
            conclusion:
              "If the app is already auto-created and connected, this breaks ownership, clarity, and understanding of system relationships.",
          },
        ],
        valueProps: [
          {
            title: "Enables real integration",
            description:
              "Developers move from UI-based testing to backend implementation.",
          },
          {
            title: "Provides control and ownership",
            description:
              "Developers explicitly create or select the app that represents their system.",
          },
          {
            title: "Clarifies architecture",
            description:
              "The relationship between agent and app becomes visible and understandable.",
            subItems: [
              {
                label: "Agent",
                text: "Identity — who the message is from.",
              },
              {
                label: "App",
                text:
                  "Sending layer — how the message is delivered and tracked.",
              },
            ],
          },
          {
            title: "Supports real-world use cases",
            description: "Developers can now:",
            bullets: [
              "Send messages programmatically.",
              "Receive and process events.",
              "Integrate messaging into workflows.",
            ],
          },
        ],
        keyInsight: {
          headline: "Developers expect to control integration.",
          bullets: [
            "Create their own resources.",
            "Understand how they connect.",
            "Configure how data flows through their system.",
          ],
        },
        keyTakeaway: {
          headline:
            "This is where messaging becomes part of the developer’s system.",
          subtext:
            "Not something they tried — but something they own and control.",
        },
      },
      {
        id: "s9",
        number: 7,
        title: "Get compliant (prepare for approval)",
        description: [
          {
            kind: "check",
            text: "User completes required business and messaging details",
          },
          {
            kind: "check",
            text: "Selects countries and understands market-specific requirements",
          },
          {
            kind: "check",
            text: "Submits the agent for review by Google and mobile operators",
          },
        ],
        keyAction: "Submit for approval",
        whyQuotes: [
          {
            title: "No idea what to enter",
            participant: "P10",
            persona: "Developer",
            short:
              "When you are a sales service customer, when you just want to send messages, I have really no idea of what I should put here.",
            long:
              "When you are a sales service customer, when you just want to send messages, I have really no idea of what I should put here. And I guess one of the two options is required, and if one of the two options is required… I want — you don't really know exactly.",
          },
          {
            title: "Compliance forms feel tedious",
            participant: "P12",
            persona: "Developer",
            short:
              "It feels very tedious filling out this information.",
            long:
              "It feels very tedious filling out this information. But I do like the fact that tabbing works, so I don't have to, like, go click on each thing.",
          },
          {
            title: "Don’t know what action is required",
            participant: "P10",
            persona: "Developer",
            short:
              "I have no idea what I need to do if I should contact someone… kind of lost. I know there is some action required. Don’t really know what.",
            long:
              "Okay. And how do we know what we need to do here? When you have special requirement — I have no idea what I need to do if I should contact someone, kind of lost. I know there is some action required. Don’t really know what.",
          },
        ],
        whyGroups: [
          {
            intro:
              "After integrating their system, users move to: “What do I need to fill in to go live?” At this point, the agent is technically ready — but not yet approved to message real users.",
            quoteIndices: [0, 1, 2],
          },
          {
            kind: "commentary",
            text: "These reflect a clear pattern:",
            bullets: [
              "Users are unsure what to enter.",
              "They don’t understand what is required vs optional.",
              "They feel pressure to get the information right.",
            ],
          },
          {
            kind: "commentary",
            title: "What happens in this step",
            text: "The user prepares their agent for approval:",
            subItems: [
              {
                label: "Business verification",
                text: "Company details, contact person, and legal identifiers.",
              },
              {
                label: "Messaging use case",
                text:
                  "What messages will be sent, how users opt in, and how users opt out.",
              },
              {
                label: "Country selection",
                text:
                  "Choose where the agent will operate and understand country-specific requirements.",
              },
              {
                label: "Review and submit",
                text:
                  "Submit to Google and review by mobile operators per country.",
              },
            ],
          },
          {
            kind: "commentary",
            title: "Why this step matters",
            text:
              "Without approval, the agent cannot send messages to real users — messages remain limited to test scenarios.",
            conclusion:
              "This is the gate between testing and integration → and real-world messaging.",
          },
        ],
        valueProps: [
          {
            title: "Enables production usage",
            description:
              "Approval is required to send messages to customers.",
          },
          {
            title: "Builds trust with carriers and users",
            description: "Ensures:",
            bullets: [
              "Compliant messaging.",
              "Clear opt-in / opt-out flows.",
              "Verified business identity.",
            ],
          },
          {
            title: "Prevents delays and rejection",
            description: "Getting this right avoids:",
            bullets: [
              "Failed submissions.",
              "Back-and-forth with operators.",
            ],
          },
          {
            title: "Supports business users",
            description:
              "This step aligns with non-technical needs:",
            bullets: [
              "Legal responsibility.",
              "Brand trust.",
              "Communication clarity.",
            ],
          },
        ],
        keyInsight: {
          headline:
            "This step shifts from exploration → to form completion, and from speed → to accuracy.",
          bullets: [
            "Users slow down because the inputs are unfamiliar.",
            "And because the consequences feel higher.",
          ],
        },
        keyTakeaway: {
          headline:
            "This is where the agent becomes eligible for real-world use.",
          subtext: "Not just technically ready — but approved to operate.",
        },
      },
    ],
  },
];


const RESOURCE_STAGES: { stage: string; rule: string }[] = [
  {
    stage: "Early stage",
    rule: "Resources can be hidden or managed.",
  },
  {
    stage: "Integration",
    rule: "Resources should be explicit.",
  },
  {
    stage: "Production",
    rule: "Resources should be guided.",
  },
];



interface Principle {
  id: string;
  title: string;
  whyItMatters: string;
  whatItMeans: string;
  exampleQuoteId: string;
}

const PRINCIPLES: Principle[] = [
  {
    id: "pr1",
    title: "Test before setup",
    whyItMatters:
      "Users decide whether a product works by trying it, not by reading documentation. If the first interaction is configuration, we lose them before they see that the system works.",
    whatItMeans:
      "Let users confirm the system works before asking them to configure anything. For messaging, that means sending a message.",
    exampleQuoteId: "q001",
  },
  {
    id: "pr2",
    title: "Confidence before commitment",
    whyItMatters:
      "Long-lived decisions (accounts, billing, resources) need evidence behind them. Users will not commit to setup on faith.",
    whatItMeans:
      "Build trust through a small, reversible action before asking for long-lived decisions.",
    exampleQuoteId: "q002",
  },
  {
    id: "pr3",
    title: "Reveal complexity progressively",
    whyItMatters:
      "Exposing unfamiliar concepts before users have context turns those concepts into obstacles.",
    whatItMeans:
      "Expose apps, keys, agents, webhooks, and compliance only when users are ready to act on them.",
    exampleQuoteId: "q015",
  },
  {
    id: "pr4",
    title: "One screen, one primary intention",
    whyItMatters:
      "Screens with multiple competing actions force users to guess which one matters. A clear primary action keeps people moving.",
    whatItMeans:
      "Each step should have one clear action. Everything else should support that action.",
    exampleQuoteId: "q042",
  },
  {
    id: "pr5",
    title: "Support UI-first and code-first users",
    whyItMatters:
      "Developers, non-developers, and PMs all evaluate the platform. A single path serves some and excludes others.",
    whatItMeans:
      "Let non-developers complete a visual test and let developers jump into code.",
    exampleQuoteId: "q034",
  },
  {
    id: "pr6",
    title: "Make system feedback visible",
    whyItMatters:
      "Without feedback, users cannot tell if their action worked. Silence erodes the trust a successful action should have built.",
    whatItMeans:
      "Show delivery status, logs, payloads, and previews immediately after action.",
    exampleQuoteId: "q006",
  },
  {
    id: "pr7",
    title: "Introduce resources when meaningful",
    whyItMatters:
      "Apps, channels, keys, and agents are infrastructure. Users accept infrastructure when it supports their goal, not before.",
    whatItMeans:
      "Apps, channels, keys, and agents should appear when the user\u2019s intent justifies them.",
    exampleQuoteId: "q036",
  },
  {
    id: "pr8",
    title: "Let users move from test \u2192 API \u2192 production",
    whyItMatters:
      "Across sessions, participants followed this sequence when the tool allowed it. Blocking the sequence cost trust and progress.",
    whatItMeans:
      "Each step should earn the next: test proves value, API enables integration, production setup enables launch.",
    exampleQuoteId: "q002",
  },
];

const DIRECTION_RECS: { title: string; detail: string }[] = [
  {
    title: "Start with a working test.",
    detail:
      "Let users send a message without requiring setup. Sandbox or managed test resources support the first value moment.",
  },
  {
    title: "Move to API after proof.",
    detail:
      "Expose code and integration once users know the system works. Share credentials between UI test and code sample so copy-paste reproduces the result.",
  },
  {
    title: "Introduce resources at integration.",
    detail:
      "Apps, keys, and agents become relevant when users are connecting to their own system. Explain how the pieces relate and show what is created.",
  },
  {
    title: "Use guided onboarding for production.",
    detail:
      "Use structure for compliance, countries, approvals, and go-live — after users have validated value, not before.",
  },
];

const DATA_BULLETS: string[] = [
  "13 usability sessions",
  "Developers and non-developers",
  "Sandbox 2.0 and onboarding app testing",
  "Think-aloud tasks",
  "Quotes used as supporting evidence",
  "Swedish sessions translated to English with original transcripts preserved",
];

// =================================================================
// Motion primitives & decorative backgrounds
// =================================================================

const PREMIUM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: PREMIUM_EASE },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// Reusable wrapper that reveals its children as they scroll into view.
const SectionReveal = ({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    variants={{
      hidden: { opacity: 0, y: 32 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: PREMIUM_EASE, delay },
      },
    }}
  >
    {children}
  </motion.div>
);

const StaggerGroup = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    variants={staggerContainer}
  >
    {children}
  </motion.div>
);

const StaggerItem = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.div className={className} variants={fadeInUp}>
    {children}
  </motion.div>
);

// Soft radial glow blob — placed absolutely inside a `relative` parent.
const GlowOrb = ({
  className = "",
  color = "indigo",
  size = "md",
  delay = false,
}: {
  className?: string;
  color?: "indigo" | "violet" | "cyan";
  size?: "sm" | "md" | "lg" | "xl";
  delay?: boolean;
}) => {
  const colorClass = {
    // Softer ambient glows — let the content lead, not the background.
    indigo: "bg-indigo-500/[0.14]",
    violet: "bg-violet-500/[0.11]",
    cyan: "bg-cyan-500/[0.08]",
  }[color];
  const sizeClass = {
    sm: "h-[280px] w-[280px]",
    md: "h-[420px] w-[420px]",
    lg: "h-[640px] w-[640px]",
    xl: "h-[820px] w-[820px]",
  }[size];
  const anim = delay ? "orb-animate-slow" : "orb-animate";
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-[120px] ${colorClass} ${sizeClass} ${anim} ${className}`}
    />
  );
};

// Scroll-spy hook: returns the id of the section currently in view.
const useActiveSection = (ids: string[]): string => {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);
  return active;
};

// =================================================================
// Small UI primitives
// =================================================================

const SectionHeader = ({
  number,
  eyebrow,
  title,
  intro,
  introBullets,
}: {
  number: string;
  eyebrow: string;
  title: string;
  /** One paragraph (string) or several (string[]). */
  intro?: string | string[];
  /** Optional small list rendered after the intro. */
  introBullets?: string[];
}) => {
  const introParagraphs =
    typeof intro === "string" ? [intro] : intro ?? [];
  return (
    <header className="mb-12">
      <div className="flex items-baseline gap-4">
        <span className="font-serif text-3xl font-light text-indigo-400 tabular-nums">
          {number}
        </span>
        <span className="text-[13.5px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-slate-50 sm:text-[34px]">
        {title}
      </h2>
      {introParagraphs.length > 0 && (
        <div className="mt-4 max-w-3xl space-y-3 text-lg leading-relaxed text-slate-400">
          {introParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      {introBullets && introBullets.length > 0 && (
        <ul className="mt-3 max-w-3xl space-y-1.5 text-lg leading-relaxed text-slate-300">
          {introBullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};

const PersonaLabel = ({ persona }: { persona?: Persona }) =>
  persona ? (
    <span className="text-[13.5px] text-slate-400">{persona}</span>
  ) : null;

const ConceptTag = ({ concept }: { concept: string }) => (
  <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-[13px] font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/40">
    {concept}
  </span>
);

// --- Quote card -----------------------------------------------------

const AudienceTag = ({
  audience,
  size = "sm",
}: {
  audience: "internal" | "external";
  size?: "sm" | "md";
}) => {
  const tone =
    audience === "internal"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
  const padding = size === "md" ? "px-2.5 py-0.5" : "px-2 py-0.5";
  const text = size === "md" ? "text-[12px]" : "text-[11px]";
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-[0.14em] ${tone} ${padding} ${text}`}
    >
      {audience}
    </span>
  );
};

const QuoteCard = ({
  q,
  onViewSource,
  compact = false,
}: {
  q: Quote;
  onViewSource?: (t: Transcript) => void;
  compact?: boolean;
}) => {
  const t = transcriptById(q.transcriptId);
  const [showOriginal, setShowOriginal] = useState(false);
  return (
    <motion.figure
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: PREMIUM_EASE }}
      className={`group rounded-2xl border border-slate-800 bg-slate-900/70 ${compact ? "p-4" : "p-5"} shadow-[0_6px_20px_-15px_rgba(0,0,0,0.8)] backdrop-blur-sm transition-colors hover:border-indigo-500/40`}
    >
      <blockquote
        className={`text-slate-50 ${compact ? "text-[16.5px]" : "text-[17.5px]"} font-medium italic leading-relaxed`}
      >
        <span className="mr-1 font-serif text-indigo-500">&ldquo;</span>
        {q.quote}
        <span className="ml-0.5 font-serif text-indigo-500">&rdquo;</span>
      </blockquote>

      {q.originalQuote && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowOriginal((v) => !v)}
            className="inline-flex items-center gap-1 text-[13px] font-medium uppercase tracking-wide text-slate-400 hover:text-indigo-300"
          >
            Translated from {q.originalLanguage ?? "original"}
            <ChevronDown
              className={`h-3 w-3 transition ${showOriginal ? "rotate-180" : ""}`}
            />
          </button>
          {showOriginal && (
            <p className="mt-2 rounded-lg bg-slate-950 p-3 text-[14.5px] italic leading-relaxed text-slate-400">
              {q.originalQuote}
            </p>
          )}
        </div>
      )}

      <figcaption
        className={`mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 ${compact ? "text-[13.5px]" : "text-[15.5px]"}`}
      >
        <span className="font-semibold text-slate-50">{q.participant}</span>
        <PersonaLabel persona={q.persona} />
        {t?.audience && <AudienceTag audience={t.audience} />}
        <ConceptTag concept={q.concept} />
        {q.timestamp && (
          <span className="font-mono text-[13px] text-slate-400">
            {q.timestamp}
          </span>
        )}
        {t && onViewSource && (
          <button
            type="button"
            onClick={() => onViewSource(t)}
            className="ml-auto inline-flex items-center gap-1 text-[13.5px] font-medium text-slate-400 hover:text-indigo-300"
          >
            <ExternalLink className="h-3 w-3" />
            View session
          </button>
        )}
      </figcaption>
    </motion.figure>
  );
};

// =================================================================
// Cross-corpus research analysis (rendered inside the transcript drawer)
// Synthesised from all 14 session transcripts.
// =================================================================

interface AnalysisInsight {
  headline: string;
  evidence: { participant: string; persona: string; quote: string }[];
}

interface AnalysisPattern {
  title: string;
  goal: string;
  behaviours: string[];
  focus: string[];
  ignored: string[];
}

interface AnalysisFriction {
  title: string;
  detail: string;
  quote?: { participant: string; persona: string; text: string };
}

interface AnalysisOpportunity {
  title: string;
  detail: string;
}

interface AnalysisFlowStep {
  step: string;
  why: string;
}

interface ResearchAnalysisData {
  insights: AnalysisInsight[];
  patterns: AnalysisPattern[];
  friction: AnalysisFriction[];
  opportunities: AnalysisOpportunity[];
  principles: string[];
  flow: AnalysisFlowStep[];
}

const RESEARCH_ANALYSIS: ResearchAnalysisData = {
  insights: [
    {
      headline:
        "Users open the product expecting to send a message — not to set up.",
      evidence: [
        {
          participant: "P1",
          persona: "Developer · internal",
          quote:
            "Being able to send a message, to my phone or something, is usually the first thing I try to achieve.",
        },
        {
          participant: "P12",
          persona: "Developer · external",
          quote:
            "I think the first thing that I would do is click on send test message.",
        },
        {
          participant: "P6",
          persona: "Developer · internal",
          quote:
            "I would say it’s to just try to send one test message to see how it is working.",
        },
      ],
    },
    {
      headline:
        "Visible feedback (logs, status, preview) is what proves the system works.",
      evidence: [
        {
          participant: "P7",
          persona: "Developer · internal",
          quote:
            "I can see all the message information here. The test messages, I can see the IDs, the channel, recipient, correlation ID, and then I can see when it was delivered and when it was queued.",
        },
        {
          participant: "P11",
          persona: "Developer · external",
          quote:
            "It shows you the message got queued on the RCSN, and it got delivered. And reply received from the recipient.",
        },
        {
          participant: "P1",
          persona: "Developer · internal",
          quote:
            "Once I’ve done that, then I can kind of relax and know that this thing works.",
        },
      ],
    },
    {
      headline:
        "Access keys and resource setup demanded before the first test read as obstacles.",
      evidence: [
        {
          participant: "P3",
          persona: "Developer · internal",
          quote:
            "I just want to quickly be able to send a message and there it gets blocked by access key… why do I need that? I thought this would be a quick test.",
        },
        {
          participant: "P1",
          persona: "Developer · internal",
          quote:
            "This sucks having to copy two things here. I don’t know if I will need them.",
        },
        {
          participant: "P8",
          persona: "Developer · internal",
          quote:
            "I think as a first time user, I would just want to say, like, okay, give me RCS. And then this app business is sort of a detail that I don’t need to know about.",
        },
      ],
    },
    {
      headline:
        "Developers transition from UI test to API exploration immediately after a successful send.",
      evidence: [
        {
          participant: "P12",
          persona: "Developer · external",
          quote:
            "Since I’m a developer, my instinct could be just to open up a terminal and run this command in curl because that would be the simplest way.",
        },
        {
          participant: "P13",
          persona: "Developer · external",
          quote:
            "I like the fact that we can run the request directly from there, because usually you have the code displayed and you need to copy paste directly on your terminal.",
        },
      ],
    },
    {
      headline:
        "Developers expect prefilled, runnable, downloadable tooling — not raw documentation.",
      evidence: [
        {
          participant: "P10",
          persona: "Developer · external",
          quote:
            "Often, like, a lot of time, some old developer APIs propose this kind of collections that you could just download, put inside your Postman interface, and start playing with the code with all the parameters that you just need to fill.",
        },
        {
          participant: "P10",
          persona: "Developer · external",
          quote:
            "As you are in the context of your own account and you are already signed in, it means that this platform already has all your information. So they could prefill everything for you to simplify your experience.",
        },
      ],
    },
    {
      headline:
        "Compliance and go-live steps feel heavy and unguided once users leave the test surface.",
      evidence: [
        {
          participant: "P14",
          persona: "Developer · external",
          quote:
            "It was definitely the freedom of a text box with a requirement that I wasn’t aware of… would that potentially hurt me later in the flow?",
        },
        {
          participant: "P10",
          persona: "Developer · external",
          quote:
            "When you are a sales service customer, when you just want to send messages, I have really no idea of what I should put here.",
        },
        {
          participant: "P14",
          persona: "Developer · external",
          quote:
            "I have not submitted for approval… I broke the prototype and created my own confusion.",
        },
      ],
    },
    {
      headline:
        "Non-developers complete the test path with little help but stall on architectural concepts.",
      evidence: [
        {
          participant: "P9",
          persona: "Non-developer · external",
          quote:
            "The option to have the logo ready immediately, kind of like instantly have how you want the message to come across — it’s pretty pretty simple.",
        },
        {
          participant: "P9",
          persona: "Non-developer · external",
          quote:
            "One way or two way is also some people may find that confusing. But that just, like, I know at least in the US, that’s the language we’re told to use.",
        },
      ],
    },
    {
      headline:
        "Users want the system to know what it knows — they expect prefill, not repeated input.",
      evidence: [
        {
          participant: "P10",
          persona: "Developer · external",
          quote:
            "When you are in a public documentation, you need to guess all of that because nothing is associated to your account. Here, as you are in the context of your own account and you are already signed in, it means that this platform already has all your information.",
        },
        {
          participant: "P12",
          persona: "Developer · external",
          quote:
            "So let me generate a key first. There we go… oh, it’s already there, which is beautiful.",
        },
      ],
    },
  ],
  patterns: [
    {
      title: "Test-first behaviour (all personas)",
      goal: "Validate that messaging actually works before investing time.",
      behaviours: [
        "Locate a Send / Send-test entry point",
        "Add their own phone number",
        "Send and watch for the message to arrive",
      ],
      focus: [
        "The send button",
        "Message arriving on phone",
        "Delivery status feedback",
      ],
      ignored: [
        "Marketing copy",
        "Side-bar resources",
        "Long onboarding text blocks",
      ],
    },
    {
      title: "Log inspection (developers and non-developers)",
      goal: "Confirm the action had an effect and understand what happened.",
      behaviours: [
        "Scroll to message log immediately after sending",
        "Click into the payload",
        "Read event sequence (queued / delivered / read)",
      ],
      focus: [
        "IDs, channel, recipient, correlation ID",
        "Status transitions",
        "Reply / incoming events",
      ],
      ignored: [
        "Documentation links elsewhere on the page",
        "Marketing CTAs after send",
      ],
    },
    {
      title: "API / code transition (developers only)",
      goal: "Reproduce the test in their own code and start integrating.",
      behaviours: [
        "Open the code or curl tab",
        "Look for credentials and ask if they’re shared with the UI",
        "Mention Postman, mention copy-paste into terminal",
      ],
      focus: [
        "Request structure and payload",
        "Whether credentials match UI test",
        "Per-language samples",
      ],
      ignored: [
        "Visual previewers",
        "UI-only flows",
      ],
    },
    {
      title: "Resource / production transition (when intent shifts)",
      goal: "Move from sandbox to a real, named, owned setup.",
      behaviours: [
        "Look for ‘create RCS agent’ / ‘create app’ CTAs",
        "Ask how the app, agent, channel, and Conversation API relate",
        "Engage with country, compliance, and approval steps",
      ],
      focus: [
        "Object relationships (app ↔ agent ↔ channel)",
        "Required compliance fields",
        "Submit-for-approval CTA",
      ],
      ignored: [
        "Sandbox controls (now outgrown)",
      ],
    },
  ],
  friction: [
    {
      title: "Access-key prompt appears before the first test",
      detail:
        "Users hit a credential wall while trying to send a quick test, before any product value has been demonstrated.",
      quote: {
        participant: "P3",
        persona: "Developer · internal",
        text:
          "I just want to quickly be able to send a message and there it gets blocked by access key… why do I need that? I thought this would be a quick test.",
      },
    },
    {
      title: "Conversation API ‘app’ concept is a leaky abstraction",
      detail:
        "First-time users do not understand why an app object exists; they expect ‘give me RCS’.",
      quote: {
        participant: "P8",
        persona: "Developer · internal",
        text:
          "I think as a first time user, I would just want to say, like, okay, give me RCS. And then this app business is sort of a detail that I don’t need to know about.",
      },
    },
    {
      title: "Webhook setup surfaced before its purpose is clear",
      detail:
        "Webhook configuration tools appear during the testing phase, even when nothing has been sent yet.",
      quote: {
        participant: "P1",
        persona: "Developer · internal",
        text:
          "I immediately identified that it’s just suggesting some tools that I can use to set up the webhook, without yeah. To test it locally without deploying anything, which is helpful. This seems to be a paid solution, which I would kinda be pissed about.",
      },
    },
    {
      title: "Compliance fields lack context",
      detail:
        "Required consent / opt-in / legal fields have no inline explanation; non-legal users are forced to guess.",
      quote: {
        participant: "P10",
        persona: "Developer · external",
        text:
          "When you are a sales service customer, when you just want to send messages, I have really no idea of what I should put here.",
      },
    },
    {
      title: "Two parallel checklists confuse sequencing",
      detail:
        "‘Send test’ and ‘Prepare to go live’ run side-by-side without clarifying which comes first.",
      quote: {
        participant: "P14",
        persona: "Developer · external",
        text:
          "Is it fair to say that these two are kind of like, you’ve done the first part, you’ve created your agent, now you must do step one, step two to actually start using the agent, as the prepare to go live.",
      },
    },
    {
      title: "Country variants and regional rules are unclear",
      detail:
        "Country-specific compliance variants are presented without describing the difference.",
      quote: {
        participant: "P13",
        persona: "Developer · external",
        text:
          "Because I was like, I don’t know what it is, and I don’t have any information. I didn’t pay attention to view. But, okay. So to be honest, I don’t know what’s the difference between those two.",
      },
    },
    {
      title: "Conversation API ↔ RCS agent connection feels manual",
      detail:
        "Users expect agent creation to wire to the Conversation API automatically; the manual link is unintuitive.",
      quote: {
        participant: "P11",
        persona: "Developer · external",
        text:
          "Why would the RCS agent not automatically be connected to common API?",
      },
    },
    {
      title: "Submit-for-approval CTA is missing or hidden",
      detail:
        "Users finish the prototype steps and don’t know whether they’ve actually submitted.",
      quote: {
        participant: "P14",
        persona: "Developer · external",
        text:
          "I have not submitted for approval… I broke the prototype and created my own confusion.",
      },
    },
  ],
  opportunities: [
    {
      title: "Send-first sandbox entry",
      detail:
        "Make a working send-test the first screen — no account, no key, no app required.",
    },
    {
      title: "Prefilled, in-browser API runner",
      detail:
        "Reuse the same temporary credentials for UI test and code sample. Let users copy, run, and modify.",
    },
    {
      title: "Downloadable Postman collection",
      detail:
        "Offer a one-click Postman download at the integration step — explicitly requested by P10 (developer).",
    },
    {
      title: "Auto-link Conversation API app + RCS agent",
      detail:
        "Remove the manual handoff that confused P11; if both must exist, create them together by default.",
    },
    {
      title: "Compliance field guidance",
      detail:
        "Inline ‘what this is for’ tooltips, persona presets (transactional / marketing / support) for non-legal users.",
    },
    {
      title: "Visible Submit-for-approval CTA",
      detail:
        "Close the prototype-to-production loop with an obvious, labelled action so users know they’re done.",
    },
    {
      title: "Clear test-vs-live mode indicator",
      detail:
        "Persist a banner / status pill so users always know whether they’re in sandbox or live.",
    },
    {
      title: "Country / regional rules explained inline",
      detail:
        "Country variants need a one-line explainer. Avoid cold dropdowns where ‘you just have to know.’",
    },
  ],
  principles: [
    "Proof before setup — let users send a message before configuring resources.",
    "Reveal complexity progressively — apps, keys, agents, webhooks appear when intent justifies them.",
    "Prefill what the system already knows — don’t ask users to repeat what their account context provides.",
    "Feedback is the proof — logs, payloads, and previews must be one click away from the action.",
    "One path, two branches — share the first value moment across personas, then diverge by intent.",
  ],
  flow: [
    {
      step: "Send your first message",
      why: "Across all 14 sessions, the first action users reach for is sending a message — not setup.",
    },
    {
      step: "See it work",
      why: "Logs, status, and preview prove the system worked. This is where trust forms.",
    },
    {
      step: "Try the API (developers)",
      why: "Once the UI test succeeds, developers immediately want curl, payload, and copy-paste-ready code.",
    },
    {
      step: "Create persistent resources",
      why: "Apps, keys, and agents make sense once users are moving toward integration — not before.",
    },
    {
      step: "Validate again from real setup",
      why: "After creating their own agent, users want to confirm it still works — second value moment.",
    },
    {
      step: "Branch by intent (integrate / go live)",
      why: "Developers go to API + webhooks; business users go to compliance + countries + approvals.",
    },
    {
      step: "Submit for approval and go live",
      why: "Users tolerate compliance once value is proven. An explicit submit CTA closes the loop.",
    },
  ],
};

const ResearchAnalysisSection = () => (
  <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6">
    <div className="flex items-baseline gap-2">
      <p className="text-[13.5px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
        Research analysis
      </p>
      <p className="text-[12.5px] text-slate-500">across all 14 sessions</p>
    </div>

    {/* Key insights */}
    <div>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Key insights
      </p>
      <ol className="mt-3 space-y-4">
        {RESEARCH_ANALYSIS.insights.map((ins, i) => (
          <li
            key={i}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[12px] text-slate-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[15.5px] font-semibold leading-snug text-slate-50">
                {ins.headline}
              </p>
            </div>
            <ul className="mt-3 space-y-2">
              {ins.evidence.map((ev, ei) => (
                <li
                  key={ei}
                  className="border-l-2 border-indigo-500/40 pl-3 text-[14px] italic leading-relaxed text-slate-300"
                >
                  &ldquo;{ev.quote}&rdquo;
                  <span className="not-italic"> — </span>
                  <span className="not-italic font-medium text-slate-400">
                    {ev.participant}
                  </span>
                  <span className="not-italic text-slate-500">
                    {" · "}
                    {ev.persona}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>

    {/* Behavioural patterns */}
    <div>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Behavioural patterns
      </p>
      <div className="mt-3 grid gap-3">
        {RESEARCH_ANALYSIS.patterns.map((p, i) => (
          <article
            key={i}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
          >
            <p className="text-[15.5px] font-semibold text-slate-50">
              {p.title}
            </p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-slate-400">
              <span className="font-semibold text-slate-300">Goal:</span>{" "}
              {p.goal}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[
                { label: "Behaviours", items: p.behaviours, tone: "indigo" },
                { label: "Focus on", items: p.focus, tone: "emerald" },
                { label: "Ignored", items: p.ignored, tone: "slate" },
              ].map((col) => (
                <div key={col.label}>
                  <p
                    className={`text-[11.5px] font-semibold uppercase tracking-[0.12em] ${
                      col.tone === "indigo"
                        ? "text-indigo-300"
                        : col.tone === "emerald"
                          ? "text-emerald-300"
                          : "text-slate-400"
                    }`}
                  >
                    {col.label}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {col.items.map((it, ii) => (
                      <li
                        key={ii}
                        className="flex gap-1.5 text-[13.5px] leading-relaxed text-slate-300"
                      >
                        <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>

    {/* Friction points */}
    <div>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Friction points
      </p>
      <ul className="mt-3 space-y-3">
        {RESEARCH_ANALYSIS.friction.map((f, i) => (
          <li
            key={i}
            className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
          >
            <p className="text-[14.5px] font-semibold text-slate-50">
              {f.title}
            </p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-slate-300">
              {f.detail}
            </p>
            {f.quote && (
              <p className="mt-2 border-l-2 border-amber-500/40 pl-3 text-[13.5px] italic leading-relaxed text-slate-300">
                &ldquo;{f.quote.text}&rdquo;
                <span className="not-italic"> — </span>
                <span className="not-italic font-medium text-slate-400">
                  {f.quote.participant}
                </span>
                <span className="not-italic text-slate-500">
                  {" · "}
                  {f.quote.persona}
                </span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>

    {/* Opportunities */}
    <div>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Opportunity areas
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {RESEARCH_ANALYSIS.opportunities.map((o, i) => (
          <li
            key={i}
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3"
          >
            <p className="text-[14.5px] font-semibold text-slate-50">
              {o.title}
            </p>
            <p className="mt-0.5 text-[13.5px] leading-relaxed text-slate-400">
              {o.detail}
            </p>
          </li>
        ))}
      </ul>
    </div>

    {/* Principles */}
    <div>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Suggested product principles
      </p>
      <ul className="mt-3 space-y-2">
        {RESEARCH_ANALYSIS.principles.map((p, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-[14.5px] leading-relaxed text-slate-200"
          >
            <span className="font-mono text-[12px] text-indigo-300">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Natural onboarding flow */}
    <div>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Natural onboarding flow
      </p>
      <p className="mt-1 text-[13.5px] leading-relaxed text-slate-400">
        Reflects how users actually behaved across the corpus, not what we
        designed for.
      </p>
      <ol className="mt-3 space-y-2">
        {RESEARCH_ANALYSIS.flow.map((s, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3"
          >
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-[12px] font-semibold text-white">
              {i + 1}
            </span>
            <div>
              <p className="text-[14.5px] font-semibold text-slate-50">
                {s.step}
              </p>
              <p className="mt-0.5 text-[13.5px] leading-relaxed text-slate-400">
                <span className="font-semibold text-slate-300">Why:</span>{" "}
                {s.why}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

// --- Transcript drawer ---------------------------------------------

const ConceptBadge = ({ concept }: { concept: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-indigo-200">
    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.7)]" />
    {concept}
  </span>
);

const AnalysisBullet = ({
  text,
  tone = "default",
}: {
  text: string;
  tone?: "default" | "muted" | "warn" | "good";
}) => {
  const dotClass =
    tone === "warn"
      ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
      : tone === "good"
        ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
        : tone === "muted"
          ? "bg-slate-500"
          : "bg-indigo-400";
  const textClass = tone === "muted" ? "text-slate-400" : "text-slate-200";
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
      <span className={`text-[17px] leading-relaxed ${textClass}`}>{text}</span>
    </li>
  );
};

const TranscriptAnalysisView = ({
  analysis,
}: {
  analysis: TranscriptAnalysis;
}) => (
  <div className="space-y-12">
    {/* User goal */}
    <section>
      <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
        User goal
      </p>
      <p className="mt-3 text-[19px] leading-relaxed text-slate-100">
        {analysis.userGoal}
      </p>
      {analysis.userGoalContext && (
        <div className="mt-5 space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5 sm:p-6">
          {analysis.userGoalContext.intro && (
            <p className="text-[17px] leading-relaxed text-slate-300">
              {analysis.userGoalContext.intro}
            </p>
          )}
          {analysis.userGoalContext.bullets &&
            analysis.userGoalContext.bullets.length > 0 && (
              <ul className="space-y-2">
                {analysis.userGoalContext.bullets.map((b, bi) => (
                  <AnalysisBullet key={bi} text={b} />
                ))}
              </ul>
            )}
          {analysis.userGoalContext.closing && (
            <p className="text-[17px] leading-relaxed text-slate-300">
              {analysis.userGoalContext.closing}
            </p>
          )}
          {analysis.userGoalContext.quote && (
            <blockquote className="border-l-2 border-indigo-400/60 pl-4 text-[17.5px] italic leading-relaxed text-slate-200">
              <span className="mr-1 font-serif text-indigo-400">&ldquo;</span>
              {analysis.userGoalContext.quote}
              <span className="ml-0.5 font-serif text-indigo-400">&rdquo;</span>
            </blockquote>
          )}
        </div>
      )}
    </section>

    {/* Observations by concept */}
    <section>
      <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Observations by concept
      </p>
      <div className="mt-4 space-y-8">
        {analysis.concepts.map((c, ci) => (
          <article
            key={ci}
            className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 sm:p-6"
          >
            <header className="mb-4">
              <ConceptBadge concept={c.concept} />
              {c.conceptSubtitle && (
                <p className="mt-2 text-[16px] italic leading-relaxed text-slate-400">
                  {c.conceptSubtitle}
                </p>
              )}
              {c.mainReaction && (
                <div className="mt-3 rounded-lg border border-slate-700/70 bg-slate-900/60 px-4 py-3">
                  <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Main reaction
                  </p>
                  <p className="mt-1 text-[17px] leading-relaxed text-slate-200">
                    {c.mainReaction}
                  </p>
                  {c.mainReactionQuote && (
                    <blockquote className="mt-3 border-l-2 border-indigo-400/60 pl-4 text-[16.5px] italic leading-relaxed text-slate-300">
                      <span className="mr-1 font-serif text-indigo-400">
                        &ldquo;
                      </span>
                      {c.mainReactionQuote}
                      <span className="ml-0.5 font-serif text-indigo-400">
                        &rdquo;
                      </span>
                    </blockquote>
                  )}
                </div>
              )}
            </header>

            {c.whatHappened.length > 0 && (
              <div>
                <p className="text-[13.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  What happened
                </p>
                <ul className="mt-2.5 space-y-2">
                  {c.whatHappened.map((p, pi) => (
                    <AnalysisBullet key={pi} text={p} />
                  ))}
                </ul>
              </div>
            )}

            {c.whatWorked && c.whatWorked.length > 0 && (
              <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-5">
                <p className="text-[13.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                  What worked
                </p>
                <ul className="mt-2.5 space-y-2">
                  {c.whatWorked.map((p, pi) => (
                    <AnalysisBullet key={pi} text={p} tone="good" />
                  ))}
                </ul>
              </div>
            )}

            {c.keyStrengths && c.keyStrengths.length > 0 && (
              <div className="mt-6">
                <p className="text-[13.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                  Key strengths
                </p>
                <ol className="mt-3 space-y-4">
                  {c.keyStrengths.map((s, si) => (
                    <li
                      key={si}
                      className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="font-serif text-[20px] tabular-nums text-emerald-300">
                          {si + 1}.
                        </span>
                        <h4 className="text-[18.5px] font-semibold leading-snug text-slate-50">
                          {s.title}
                        </h4>
                      </div>
                      <ul className="mt-3 ml-7 space-y-2">
                        {s.points.map((p, pi) => (
                          <AnalysisBullet key={pi} text={p} tone="good" />
                        ))}
                      </ul>
                      {s.supportingQuoteIds &&
                        s.supportingQuoteIds.length > 0 && (
                          <div className="mt-4 ml-7">
                            <CollapsibleQuotes
                              label={`${s.supportingQuoteIds.length} supporting quote${
                                s.supportingQuoteIds.length === 1 ? "" : "s"
                              }`}
                              quotes={s.supportingQuoteIds
                                .map((qid) => quoteById(qid))
                                .filter((q): q is Quote => !!q)}
                            />
                          </div>
                        )}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {c.issues.length > 0 && (
              <div className="mt-6">
                <p className="text-[13.5px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                  Main issues
                </p>
                <ol className="mt-3 space-y-5">
                  {c.issues.map((iss, ii) => (
                    <li
                      key={ii}
                      className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="font-serif text-[20px] tabular-nums text-amber-300">
                          {ii + 1}.
                        </span>
                        <h4 className="text-[18.5px] font-semibold leading-snug text-slate-50">
                          {iss.title}
                        </h4>
                      </div>
                      <ul className="mt-3 ml-7 space-y-2">
                        {iss.points.map((p, pi) => (
                          <AnalysisBullet key={pi} text={p} tone="muted" />
                        ))}
                      </ul>
                      {iss.supportingQuoteIds &&
                        iss.supportingQuoteIds.length > 0 && (
                          <div className="mt-4 ml-7">
                            <CollapsibleQuotes
                              label={`${iss.supportingQuoteIds.length} supporting quote${
                                iss.supportingQuoteIds.length === 1 ? "" : "s"
                              }`}
                              quotes={iss.supportingQuoteIds
                                .map((qid) => quoteById(qid))
                                .filter((q): q is Quote => !!q)}
                            />
                          </div>
                        )}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {c.expected && c.expected.length > 0 && (
              <div className="mt-5 rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-5">
                <p className="text-[13.5px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
                  The user explicitly expected
                </p>
                <ul className="mt-2.5 space-y-2">
                  {c.expected.map((p, pi) => (
                    <AnalysisBullet key={pi} text={p} />
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>

    {/* Cross-cutting insights (multi-item) */}
    {analysis.crossCuttingInsights &&
      analysis.crossCuttingInsights.length > 0 && (
        <section>
          <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-violet-300">
            Cross-cutting insights
          </p>
          <ol className="mt-4 space-y-4">
            {analysis.crossCuttingInsights.map((ins, ii) => (
              <li
                key={ii}
                className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-6"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-[20px] tabular-nums text-violet-300">
                    {ii + 1}.
                  </span>
                  <h4 className="text-[18.5px] font-semibold leading-snug text-slate-50">
                    {ins.title}
                  </h4>
                </div>
                {ins.body && (
                  <p className="mt-3 ml-7 text-[17px] italic leading-relaxed text-slate-300">
                    {ins.body}
                  </p>
                )}
                {ins.bullets && ins.bullets.length > 0 && (
                  <div className="mt-3 ml-7">
                    {ins.bulletsIntro && (
                      <p className="mb-2 text-[16px] leading-relaxed text-slate-400">
                        {ins.bulletsIntro}
                      </p>
                    )}
                    <ul className="space-y-2">
                      {ins.bullets.map((b, bi) => (
                        <AnalysisBullet key={bi} text={b} />
                      ))}
                    </ul>
                  </div>
                )}
                {ins.supportingQuoteIds &&
                  ins.supportingQuoteIds.length > 0 && (
                    <div className="mt-4 ml-7">
                      <CollapsibleQuotes
                        label={`${ins.supportingQuoteIds.length} supporting quote${
                          ins.supportingQuoteIds.length === 1 ? "" : "s"
                        }`}
                        quotes={ins.supportingQuoteIds
                          .map((qid) => quoteById(qid))
                          .filter((q): q is Quote => !!q)}
                      />
                    </div>
                  )}
              </li>
            ))}
          </ol>
        </section>
      )}

    {/* Cross-cutting confusion */}
    {analysis.crossCutting && (
      <section className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent p-6 sm:p-8">
        <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-violet-300">
          Cross-cutting confusion
        </p>
        <h3 className="mt-2 text-[22px] font-semibold leading-snug text-slate-50 sm:text-[24px]">
          {analysis.crossCutting.title}
        </h3>
        {analysis.crossCutting.intro && (
          <p className="mt-4 text-[17px] leading-relaxed text-slate-300">
            {analysis.crossCutting.intro}
          </p>
        )}
        <ul className="mt-3 space-y-2">
          {analysis.crossCutting.bullets.map((b, bi) => (
            <AnalysisBullet key={bi} text={b} />
          ))}
        </ul>
        {analysis.crossCutting.consequences &&
          analysis.crossCutting.consequences.length > 0 && (
            <div className="mt-5">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                This led to
              </p>
              <ul className="mt-2.5 space-y-2">
                {analysis.crossCutting.consequences.map((c, ci) => (
                  <AnalysisBullet key={ci} text={c} tone="muted" />
                ))}
              </ul>
            </div>
          )}
      </section>
    )}

    {/* Behavioral pattern */}
    <section>
      <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Behavioural pattern
      </p>
      <p className="mt-2 text-[17px] leading-relaxed text-slate-400">
        The user consistently followed this flow:
      </p>
      <ol className="mt-3 space-y-2">
        {analysis.behavioralPattern.map((step, si) => (
          <li
            key={si}
            className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
          >
            <span className="font-serif text-[18px] tabular-nums text-indigo-300">
              {String(si + 1).padStart(2, "0")}
            </span>
            <span className="text-[17px] leading-relaxed text-slate-200">
              {step}
            </span>
          </li>
        ))}
      </ol>
      {analysis.behavioralPatternNote && (
        <div className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-5">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
            {analysis.behavioralPatternNote.title ??
              "Key difference vs previous users"}
          </p>
          <p className="mt-1.5 text-[17px] leading-relaxed text-slate-200">
            {analysis.behavioralPatternNote.text}
          </p>
        </div>
      )}
    </section>

    {/* Key takeaway */}
    <section className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent p-6 sm:p-8">
      <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
        Key takeaway
      </p>
      <h3 className="mt-2 text-[22px] font-semibold leading-snug text-slate-50 sm:text-[26px]">
        {analysis.keyTakeaway.headline}
      </h3>
      {analysis.keyTakeaway.body && analysis.keyTakeaway.body.length > 0 && (
        <ul className="mt-4 space-y-2">
          {analysis.keyTakeaway.body.map((b, bi) => (
            <AnalysisBullet key={bi} text={b} />
          ))}
        </ul>
      )}
      {analysis.keyTakeaway.missingPiece && (
        <div className="mt-5 rounded-xl border border-cyan-500/25 bg-slate-950/40 p-5">
          <p className="text-[15px] font-semibold leading-snug text-cyan-200">
            {analysis.keyTakeaway.missingPiece.title}
          </p>
          <ul className="mt-2.5 space-y-2">
            {analysis.keyTakeaway.missingPiece.items.map((it, ii) => (
              <AnalysisBullet key={ii} text={it} />
            ))}
          </ul>
        </div>
      )}
      {analysis.keyTakeaway.consequences &&
        analysis.keyTakeaway.consequences.length > 0 && (
          <div className="mt-5">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Without that distinction, users don’t know
            </p>
            <ul className="mt-2.5 space-y-2">
              {analysis.keyTakeaway.consequences.map((c, ci) => (
                <AnalysisBullet key={ci} text={c} tone="muted" />
              ))}
            </ul>
          </div>
        )}
      {analysis.keyTakeaway.sections &&
        analysis.keyTakeaway.sections.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {analysis.keyTakeaway.sections.map((s, si) => (
              <div
                key={si}
                className="rounded-xl border border-indigo-500/20 bg-slate-950/40 p-5"
              >
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-indigo-300">
                  {s.title}
                </p>
                <ul className="mt-2.5 space-y-2">
                  {s.items.map((it, ii) => (
                    <AnalysisBullet key={ii} text={it} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      {analysis.keyTakeaway.closing && (
        <p className="mt-6 border-l-2 border-indigo-400/60 pl-5 text-[18px] italic leading-relaxed text-slate-200">
          {analysis.keyTakeaway.closing}
        </p>
      )}
    </section>
  </div>
);

/**
  * Collapsible quote group — used in three places inside the transcript dialog:
  * 1. Inline "Supporting quotes" under each issue.
  * 2. Inline "Supporting quotes" under each cross-cutting insight.
  * 3. Footer "All quotes from this session" list.
  *
  * All collapsed by default per Rebecca's feedback (the dialog has a lot of content).
  */
const CollapsibleQuotes = ({
  label,
  quotes: qs,
  size = "compact",
  cols = 1,
}: {
  label: string;
  quotes: Quote[];
  size?: "compact" | "full";
  cols?: 1 | 2;
}) => {
  const [open, setOpen] = useState(false);
  if (qs.length === 0) return null;
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group inline-flex items-center gap-2 rounded-md text-[13.5px] font-semibold uppercase tracking-[0.14em] text-slate-400 transition hover:text-indigo-300"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
        {open ? "Hide" : "Show"} {label}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: PREMIUM_EASE }}
            className="overflow-hidden"
          >
            <div
              className={`grid gap-${size === "compact" ? "2.5" : "3"} ${
                cols === 2 ? "lg:grid-cols-2" : ""
              }`}
            >
              {qs.map((q) => (
                <QuoteCard
                  key={q.id}
                  q={q}
                  compact={size === "compact"}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CollapsibleQuotesSection = ({
  label,
  related,
}: {
  label: string;
  related: Quote[];
}) => (
  <section>
    <CollapsibleQuotes
      label={label}
      quotes={related}
      size="full"
      cols={2}
    />
  </section>
);

const TranscriptDialog = ({
  transcript,
  onClose,
  onNavigate,
}: {
  transcript: Transcript | null;
  onClose: () => void;
  onNavigate?: (t: Transcript) => void;
}) => {
  // ESC to close + arrow keys to navigate + body-scroll lock while open
  useEffect(() => {
    if (!transcript) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (!onNavigate) return;
      const idx = transcripts.findIndex((t) => t.id === transcript.id);
      if (e.key === "ArrowLeft" && idx > 0) {
        onNavigate(transcripts[idx - 1]);
      } else if (
        e.key === "ArrowRight" &&
        idx >= 0 &&
        idx < transcripts.length - 1
      ) {
        onNavigate(transcripts[idx + 1]);
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [transcript, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {transcript && (
        <TranscriptDialogContent
          transcript={transcript}
          onClose={onClose}
          onNavigate={onNavigate}
        />
      )}
    </AnimatePresence>
  );
};

const TranscriptDialogContent = ({
  transcript,
  onClose,
  onNavigate,
}: {
  transcript: Transcript;
  onClose: () => void;
  onNavigate?: (t: Transcript) => void;
}) => {
  const idx = transcripts.findIndex((t) => t.id === transcript.id);
  const prev = idx > 0 ? transcripts[idx - 1] : null;
  const next = idx < transcripts.length - 1 ? transcripts[idx + 1] : null;
  const totalCount = transcripts.length;
  const related = quotes.filter((q) => q.transcriptId === transcript.id);
  const analysis = transcriptAnalysisById(transcript.id);
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Research session for ${transcript.participant}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: PREMIUM_EASE }}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-sm"
    >
      {/* Sticky header */}
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -8, opacity: 0 }}
        transition={{ duration: 0.35, ease: PREMIUM_EASE, delay: 0.05 }}
        className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-indigo-400/70 hover:text-indigo-300"
            >
              <X className="h-4 w-4" />
            </button>
            <div
              aria-hidden="true"
              className="h-9 w-px shrink-0 bg-slate-800"
            />
            <div className="min-w-0">
              <h2 className="flex flex-wrap items-center gap-2 text-xl font-semibold text-slate-50 sm:text-2xl">
                <span>
                  {transcript.participant}
                  <span className="ml-1.5 text-slate-400">
                    ({transcript.persona})
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-1.5">
                  {transcript.concepts.map((c) => (
                    <ConceptTag key={c} concept={c} />
                  ))}
                </span>
                <AudienceTag audience={transcript.audience} size="md" />
              </h2>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={`/transcripts/${encodeURIComponent(transcript.sourceFile)}`}
              download={transcript.sourceFile}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-[13.5px] font-medium text-slate-300 transition hover:border-indigo-400/70 hover:text-indigo-300"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download transcript</span>
              <span className="sm:hidden">Download</span>
            </a>
          </div>
        </div>
      </motion.header>

      {/* Scrollable content */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ duration: 0.4, ease: PREMIUM_EASE, delay: 0.1 }}
        className="flex-1 overflow-y-auto"
      >
        <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-10 sm:px-8 sm:py-12">
          {analysis ? (
            <TranscriptAnalysisView analysis={analysis} />
          ) : (
            <section>
              <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Session summary
              </p>
              <p className="mt-3 text-[18px] leading-relaxed text-slate-200">
                {transcript.summary}
              </p>
            </section>
          )}

          <CollapsibleQuotesSection
            related={related}
            label={
              analysis
                ? `All quotes from this session (${related.length})`
                : `Quotes used as evidence (${related.length})`
            }
          />
        </div>
      </motion.div>

      {/* Bottom navigation: previous / next participant */}
      <motion.footer
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 8, opacity: 0 }}
        transition={{ duration: 0.35, ease: PREMIUM_EASE, delay: 0.15 }}
        className="border-t border-slate-800 bg-slate-950/90 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-6 py-4 sm:px-8">
          <button
            type="button"
            disabled={!prev || !onNavigate}
            onClick={() => prev && onNavigate?.(prev)}
            className="group flex min-w-0 max-w-[45%] items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-left transition enabled:hover:border-indigo-400/70 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4 shrink-0 text-slate-400 transition group-enabled:group-hover:text-indigo-300" />
            <div className="min-w-0">
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Previous
              </p>
              <p className="truncate text-[13.5px] font-medium text-slate-200">
                {prev
                  ? `${prev.participant} (${prev.persona})`
                  : "—"}
              </p>
            </div>
          </button>

          <p className="hidden shrink-0 text-[12.5px] font-medium uppercase tracking-[0.14em] text-slate-500 sm:block">
            Session {idx + 1} of {totalCount}
          </p>

          <button
            type="button"
            disabled={!next || !onNavigate}
            onClick={() => next && onNavigate?.(next)}
            className="group flex min-w-0 max-w-[45%] items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-right transition enabled:hover:border-indigo-400/70 disabled:opacity-40"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Next
              </p>
              <p className="truncate text-[13.5px] font-medium text-slate-200">
                {next
                  ? `${next.participant} (${next.persona})`
                  : "—"}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-enabled:group-hover:text-indigo-300" />
          </button>
        </div>
      </motion.footer>
    </motion.div>
  );
};

// =================================================================
// Resource creation discussion — a dedicated full-screen dialog opened
// from Step 5 (Validate your setup). Long-form essay about timing,
// ownership, and the auto-creation tradeoff.
// =================================================================

const DiscussionH3 = ({ children }: { children: ReactNode }) => (
  <h3 className="text-[20px] font-semibold leading-snug text-slate-50 sm:text-[22px]">
    {children}
  </h3>
);

const DiscussionEyebrow = ({
  children,
  color = "indigo",
}: {
  children: ReactNode;
  color?: "indigo" | "violet" | "emerald" | "cyan" | "amber";
}) => {
  const cls = {
    indigo: "text-indigo-300",
    violet: "text-violet-300",
    emerald: "text-emerald-300",
    cyan: "text-cyan-300",
    amber: "text-amber-300",
  }[color];
  return (
    <p
      className={`text-[12.5px] font-semibold uppercase tracking-[0.16em] ${cls}`}
    >
      {children}
    </p>
  );
};

const DiscussionBullet = ({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "muted";
}) => {
  const dotClass =
    tone === "muted"
      ? "bg-slate-500"
      : "bg-indigo-400";
  const textClass = tone === "muted" ? "text-slate-400" : "text-slate-200";
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`}
      />
      <span className={`text-[17px] leading-relaxed ${textClass}`}>
        {children}
      </span>
    </li>
  );
};

const DiscussionPullQuote = ({
  text,
  participant,
  persona,
}: {
  text: string;
  participant?: string;
  persona?: string;
}) => (
  <blockquote className="my-2 rounded-xl border border-indigo-500/25 bg-indigo-500/[0.06] px-5 py-4">
    <p className="text-[18px] italic leading-relaxed text-slate-100">
      <span className="mr-1 font-serif text-indigo-400">&ldquo;</span>
      {text}
      <span className="ml-0.5 font-serif text-indigo-400">&rdquo;</span>
    </p>
    {(participant || persona) && (
      <p className="mt-2 text-[13px] font-medium text-slate-400">
        {participant}
        {persona ? <span className="text-slate-500"> · {persona}</span> : null}
      </p>
    )}
  </blockquote>
);

type ResourceDiscussionTab =
  | "overview"
  | "auto"
  | "options"
  | "direction";

const RESOURCE_TABS: { id: ResourceDiscussionTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "auto", label: "Technical reality" },
  { id: "options", label: "Options compared" },
  { id: "direction", label: "Recommended direction" },
];


const ResourceOverviewPane = () => (
  <div className="space-y-12">
    {/* Title */}
    <header>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-violet-300">
        Overview
      </p>
      <h1 className="mt-3 text-[32px] font-semibold tracking-tight leading-tight text-slate-50 sm:text-[40px]">
        Resource creation: timing and ownership
      </h1>
      <p className="mt-4 max-w-3xl text-[17.5px] leading-relaxed text-slate-400">
        A focused discussion on what blocks users from validating their setup,
        and how Conversation API app creation should support the journey from
        testing to integration.
      </p>
    </header>

    {/* Why this page exists */}
    <section className="space-y-4">
      <DiscussionEyebrow color="violet">Why this page exists</DiscussionEyebrow>
      <p className="text-[17.5px] leading-relaxed text-slate-300">
        There are different opinions on whether Conversation API apps should be:
      </p>
      <ul className="space-y-2">
        <DiscussionBullet>Auto-created when a channel is created.</DiscussionBullet>
        <DiscussionBullet>Explicitly created or selected later.</DiscussionBullet>
        <DiscussionBullet>Managed by the platform during testing.</DiscussionBullet>
      </ul>
      <p className="text-[17.5px] leading-relaxed text-slate-300">
        The research suggests that the real question is not simply:
      </p>
      <p className="rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-5 py-3 text-[17px] italic leading-relaxed text-amber-100">
        Should apps be auto-created or manual?
      </p>
      <p className="text-[17.5px] leading-relaxed text-slate-300">
        The better question is:
      </p>
      <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-3 text-[17px] font-semibold leading-relaxed text-emerald-100">
        When should the app become a user responsibility?
      </p>
    </section>

    {/* What research shows */}
    <section className="space-y-4">
      <DiscussionEyebrow>What research shows</DiscussionEyebrow>
      <p className="text-[17.5px] leading-relaxed text-slate-300">
        After creating a channel, users expect to validate it. Their intent is
        simple:
      </p>
      <DiscussionPullQuote text="I just want to see if it works." />
      <p className="text-[17.5px] leading-relaxed text-slate-300">They expect:</p>
      <p className="rounded-lg border border-slate-800 bg-slate-900/50 px-5 py-4 font-mono text-[15.5px] leading-relaxed text-slate-200">
        Create agent → send test message → see confirmation
      </p>
      <p className="text-[17.5px] leading-relaxed text-slate-300">
        They want to confirm:
      </p>
      <ul className="space-y-2">
        <DiscussionBullet>Does my agent work?</DiscussionBullet>
        <DiscussionBullet>Does my brand appear correctly?</DiscussionBullet>
        <DiscussionBullet>Was the message delivered?</DiscussionBullet>
        <DiscussionBullet>Can I inspect what happened?</DiscussionBullet>
      </ul>
    </section>

    {/* What gets in the way */}
    <section className="space-y-4">
      <DiscussionEyebrow color="amber">What gets in the way</DiscussionEyebrow>
      <p className="text-[17.5px] leading-relaxed text-slate-300">
        Today, validation can require users to:
      </p>
      <ul className="space-y-2">
        <DiscussionBullet>Create or connect a Conversation API app.</DiscussionBullet>
        <DiscussionBullet>Manage credentials.</DiscussionBullet>
        <DiscussionBullet>Start thinking about integration.</DiscussionBullet>
      </ul>
      <p className="text-[17.5px] leading-relaxed text-slate-300">
        This creates a mismatch:
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
            User intention
          </p>
          <p className="mt-2 text-[20px] font-semibold leading-snug text-slate-50">
            Test
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-amber-300">
            Current reality
          </p>
          <p className="mt-2 text-[20px] font-semibold leading-snug text-slate-50">
            Setup
          </p>
        </div>
      </div>
    </section>
  </div>
);

const ResourceAutoPane = () => (
  <div className="space-y-10">
    <header>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-violet-300">
        Technical reality
      </p>
      <h2 className="mt-3 text-[28px] font-semibold tracking-tight leading-tight text-slate-50 sm:text-[34px]">
        What the API actually requires
      </h2>
    </header>

    {/* Agent vs App */}
    <section className="space-y-4">
      <p className="text-[17.5px] leading-relaxed text-slate-300">
        An RCS Agent cannot send messages on its own.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/[0.05] p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
            The agent
          </p>
          <p className="mt-2 text-[18px] font-semibold leading-snug text-slate-50">
            Sender identity
          </p>
          <p className="mt-2 text-[16px] leading-relaxed text-slate-300">
            Brand, name, logo, profile, and approved use case.
          </p>
        </div>
        <div className="rounded-xl border border-violet-500/25 bg-violet-500/[0.05] p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-violet-300">
            The Conversation API app
          </p>
          <p className="mt-2 text-[18px] font-semibold leading-snug text-slate-50">
            Sending mechanism
          </p>
          <p className="mt-2 text-[16px] leading-relaxed text-slate-300">
            Authentication, routing, delivery, retries, events, and webhooks.
          </p>
        </div>
      </div>
      <p className="text-[17.5px] leading-relaxed text-slate-300">
        So the question is not:
      </p>
      <p className="rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-5 py-3 text-[17px] italic leading-relaxed text-amber-100">
        Can we send without an app?{" "}
        <span className="text-amber-300/80">No.</span>
      </p>
      <p className="text-[17.5px] leading-relaxed text-slate-300">
        The real question is:
      </p>
      <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-3 text-[17px] font-semibold leading-relaxed text-emerald-100">
        Does the app need to be user-owned and user-managed at the validation
        stage?
      </p>
      <p className="text-[17.5px] leading-relaxed text-slate-300">
        Based on the API model, it does not.
      </p>
    </section>

    {/* Managed validation can use */}
    <section className="space-y-4">
      <DiscussionEyebrow>A managed validation model can use</DiscussionEyebrow>
      <ul className="space-y-2">
        <DiscussionBullet>Platform-owned Conversation API app pools per region.</DiscussionBullet>
        <DiscussionBullet>Temporary assignment of the RCS Agent to a managed test app.</DiscussionBullet>
        <DiscussionBullet>System-owned webhooks to capture delivery events and replies.</DiscussionBullet>
        <DiscussionBullet>In-product logs and event timelines.</DiscussionBullet>
        <DiscussionBullet>Reassignment to a user-owned app when the user moves into integration.</DiscussionBullet>
      </ul>
      <p className="text-[17.5px] leading-relaxed text-slate-300">
        This means validation can be enabled without making app setup a user
        responsibility too early.
      </p>
    </section>

    {/* Core principle */}
    <section className="rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent p-6 sm:p-8">
      <DiscussionEyebrow color="cyan">Core principle</DiscussionEyebrow>
      <p className="mt-3 text-[20px] leading-snug text-slate-100 sm:text-[22px]">
        Validation requires infrastructure, but not user ownership of that
        infrastructure.
      </p>
      <p className="mt-3 text-[17px] leading-relaxed text-slate-300">
        The app may still exist technically. But the user should not have to
        create, connect, or understand it before they know why it matters.
      </p>
    </section>

    {/* Core tension */}
    <section className="space-y-4">
      <DiscussionEyebrow color="violet">The core tension</DiscussionEyebrow>
      <p className="text-[17.5px] leading-relaxed text-slate-300">
        There are two valid needs.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-5">
          <DiscussionH3>Reduce friction early</DiscussionH3>
          <p className="mt-2.5 text-[16.5px] leading-relaxed text-slate-300">
            Users need to validate quickly without being blocked by setup.
          </p>
        </div>
        <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/[0.04] p-5">
          <DiscussionH3>Preserve clarity and control</DiscussionH3>
          <p className="mt-2.5 text-[16.5px] leading-relaxed text-slate-300">
            Developers need visibility and ownership of the resources they use
            for real integration.
          </p>
        </div>
      </div>
      <p className="text-[17.5px] italic leading-relaxed text-slate-200">
        The challenge is to support both.
      </p>
    </section>
  </div>
);

const ResourceOptionsPane = () => (
  <div className="space-y-10">
    <header>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-violet-300">
        Alternative approaches to enable validation
      </p>
      <h2 className="mt-3 text-[28px] font-semibold tracking-tight leading-tight text-slate-50 sm:text-[34px]">
        Four options compared
      </h2>
      <p className="mt-4 max-w-3xl text-[17.5px] leading-relaxed text-slate-300">
        There are multiple ways to enable validation after channel creation.
        All approaches support sending messages, but they differ in when
        users are required to deal with infrastructure.
      </p>
      <p className="mt-4 max-w-3xl rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-3 text-[17px] font-semibold leading-relaxed text-emerald-100">
        The core tradeoff is not technical feasibility, but timing of
        responsibility.
      </p>
    </header>

    {/* Comparison table — at-a-glance scoring across six dimensions (1–5) */}
    <section className="space-y-4">
      <DiscussionEyebrow>Comparison of approaches</DiscussionEyebrow>
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full border-collapse text-left text-[14px]">
          <thead className="bg-slate-950/70">
            <tr>
              {[
                "Approach",
                "Immediate validation",
                "Timing of app responsibility",
                "Developer control",
                "UX friction",
                "System clarity",
                "Behaviour alignment",
                "Total",
              ].map((h) => (
                <th
                  key={h}
                  className="border-b border-slate-800 px-3 py-3 align-top text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                opt: "Require app setup",
                immediate: 1,
                timing: 1,
                control: 5,
                ux: 1,
                clarity: 4,
                alignment: 1,
                total: 13,
              },
              {
                opt: "Auto-create app",
                immediate: 5,
                timing: 2,
                control: 1,
                ux: 5,
                clarity: 2,
                alignment: 3,
                total: 18,
              },
              {
                opt: "Guided connection",
                immediate: 2,
                timing: 2,
                control: 4,
                ux: 3,
                clarity: 4,
                alignment: 4,
                total: 19,
              },
              {
                opt: "Managed test mode",
                immediate: 5,
                timing: 5,
                control: "5*" as const,
                ux: 5,
                clarity: 4,
                alignment: 5,
                total: 29,
                isRec: true,
              },
            ].map((row, ri) => {
              const isRec = !!row.isRec;
              const scoreClass = (v: number | string) => {
                const n =
                  typeof v === "number"
                    ? v
                    : parseInt(String(v).replace(/\D.*/, ""), 10);
                if (n >= 5)
                  return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
                if (n === 4)
                  return "border-indigo-500/30 bg-indigo-500/10 text-indigo-200";
                if (n === 3)
                  return "border-amber-500/30 bg-amber-500/10 text-amber-200";
                return "border-rose-500/30 bg-rose-500/10 text-rose-200";
              };
              const totals = [13, 18, 19, 29];
              const max = Math.max(...totals);
              const totalClass = (t: number) => {
                if (t === max)
                  return "border-emerald-500/40 bg-emerald-500/15 text-emerald-100";
                if (t >= 18)
                  return "border-indigo-500/30 bg-indigo-500/10 text-indigo-200";
                return "border-rose-500/30 bg-rose-500/10 text-rose-200";
              };
              const Score = ({ v }: { v: number | string }) => (
                <span
                  className={`inline-flex min-w-[28px] items-center justify-center rounded border px-2 py-0.5 text-[13px] font-semibold tabular-nums ${scoreClass(v)}`}
                >
                  {v}
                </span>
              );
              return (
                <tr
                  key={ri}
                  className={`${
                    isRec
                      ? "bg-emerald-500/[0.05]"
                      : "border-b border-slate-800/60 last:border-0"
                  }`}
                >
                  <td className="px-3 py-3 align-middle font-semibold text-slate-100">
                    {row.opt}
                    {isRec && (
                      <span className="ml-2 inline-flex items-center rounded border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200">
                        Recommended
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <Score v={row.immediate} />
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <Score v={row.timing} />
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <Score v={row.control} />
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <Score v={row.ux} />
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <Score v={row.clarity} />
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <Score v={row.alignment} />
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <span
                      className={`inline-flex min-w-[36px] items-center justify-center rounded border px-2 py-0.5 text-[13.5px] font-bold tabular-nums ${totalClass(row.total)}`}
                    >
                      {row.total}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] leading-relaxed text-slate-500">
        Scored 1 (worst) to 5 (best) on each dimension.{" "}
        <span className="font-mono text-slate-400">5*</span> — control granted
        at the integration stage, not during testing.
      </p>
    </section>

    {[
      {
        n: 1,
        title: "Require app setup before testing",
        tag: "Current RCS model",
        tagColor: "amber",
        flow: "Create agent → create/connect app → send test message",
        meaningIntro: "Before users can send a test message, they must:",
        meaningPoints: [
          "Create or select a Conversation API app.",
          "Connect the RCS Agent to that app.",
          "Provide required setup details (including parts of compliance and configuration).",
        ],
        meaningClosing:
          "The connection between the RCS Agent (identity) and the Conversation API app (sending layer) is required before any validation can happen.",
        practice: {
          title: "What actually happens in practice",
          intro:
            "This step is not just “connect an app.” It often includes:",
          points: [
            "Choosing or creating an app without understanding what it represents.",
            "Providing configuration inputs tied to integration.",
            "Encountering compliance-related fields or requirements.",
            "Being exposed to concepts like credentials, webhooks, or regions.",
          ],
          mixIntro: "This mixes multiple concerns into a single moment:",
          mix: [
            { label: "Validation", text: "Does this work?" },
            { label: "Integration", text: "How do I connect this to my system?" },
            {
              label: "Compliance / setup",
              text: "What do I need to go live?",
            },
          ],
        },
        coreProblem: {
          title: "Core problem",
          headline:
            "We are mixing testing, integration, and compliance into one step.",
          intro: "At a point where users:",
          points: [
            "Have not validated the product yet.",
            "May not know how they will integrate.",
            "May not even be technical (business users).",
          ],
        },
        pros: [
          "Fully aligned with technical architecture.",
          "No hidden system behaviour.",
          "Clear ownership from the start.",
        ],
        cons: [
          "Blocks validation at the wrong moment.",
          "Forces integration thinking too early.",
          "Introduces compliance and setup before users are ready.",
          "Requires users to understand system architecture upfront.",
          "High friction for both developers and business users.",
          "Breaks the “quick test” expectation.",
          "Increases drop-off risk.",
        ],
        keyLabel: "Key issue",
        keyText:
          "Validation depends on understanding architecture, integration, and setup.",
        keyTone: "amber" as const,
        keyDetail: {
          insteadIntro: "Instead of allowing users to:",
          instead: "create → test → understand → integrate",
          forceIntro: "We force:",
          force: "create → integrate → configure → then test",
        },
        fitIcon: "❌",
        fitText: "Conflicts with observed behaviour",
        fitTone: "rose" as const,
      },
      {
        n: 2,
        title: "Auto-create and connect app",
        flow: "Create agent → auto-create app → send test message",
        meaningIntro:
          "The system automatically creates and connects a Conversation API app in the background, allowing users to send a test message immediately without any setup.",
        meaningClosing:
          "Users can take action right away, but the underlying structure is not visible or explained.",
        pros: [
          "Removes immediate friction.",
          "Enables a fast first test.",
          "No manual setup required upfront.",
        ],
        cons: [
          "Users are unaware that an app was created.",
          "The relationship between agent and app remains unclear.",
          "Developers lack control over how resources are structured.",
          "Creates persistent infrastructure for a temporary testing need.",
          "Leads to orphaned or unused apps over time.",
          "Defers confusion to a later stage instead of resolving it.",
        ],
        keyLabel: "Key issue",
        keyText: "Enables sending, but not understanding.",
        keyTone: "amber" as const,
        fitIcon: "⚠️",
        fitText:
          "Solves short-term friction, but creates long-term confusion",
        fitTone: "amber" as const,
      },
      {
        n: 3,
        title: "Lightweight guided connection",
        tag: "New RCS model (proposed)",
        tagColor: "violet",
        flow: "Create agent → guided connect step → send test message",
        meaningIntro:
          "Users are guided through a simplified and more structured app connection step before they can send a test message.",
        meaningClosing:
          "The experience improves how the app is introduced, but the connection is still required before any validation.",
        pros: [
          "Improves clarity compared to the current model.",
          "Makes the relationship between agent and app more visible.",
          "Preserves transparency into how the system works.",
          "Reduces confusion at the integration stage.",
        ],
        cons: [
          "Still introduces setup before users can validate.",
          "Still requires users to engage with unfamiliar concepts too early.",
          "Breaks the expectation of an immediate, simple test.",
          "Adds friction at a critical moment in the journey.",
          "Does not align with user intent during the testing phase.",
        ],
        keyLabel: "Key issue",
        keyText:
          "Improves how setup is presented, but not when it is introduced.",
        keyTone: "amber" as const,
        fitIcon: "⚠️",
        fitText: "Better than current, but still misaligned with intent",
        fitTone: "amber" as const,
      },
      {
        n: 4,
        title: "Managed test mode",
        tag: "Recommended direction",
        tagColor: "emerald",
        flow: "Create agent → validate in test mode → integrate later",
        meaningIntro:
          "Users can test what they've created immediately. The system handles the required infrastructure behind the scenes, and app setup is introduced only when users are ready to integrate.",
        howLabel: "How it works",
        how: [
          "The agent is temporarily connected to a system-managed app.",
          "This app is treated as managed test infrastructure, not a user resource.",
          {
            heading: "In the UI:",
            bullets: [
              "The connection is not exposed.",
              "The app does not appear in the user's inventory.",
              "Users simply test their agent.",
            ],
          },
          {
            heading: "In API / developer context:",
            bullets: [
              "A managed test app ID may be exposed for sending test requests.",
              "It is clearly labelled as test-only and system-managed.",
              "It is not something the user creates, owns, or manages.",
            ],
          },
          "Messages can be sent to test numbers immediately.",
          "Delivery status, logs, and events are shown directly in the UI.",
        ],
        howFollowUp: {
          title: "When users are ready to integrate:",
          bullets: [
            "They create or select their own app.",
            "The agent is then connected to their app.",
            "This is the first point where the app becomes a visible, user-owned resource.",
          ],
        },
        pros: [],
        cons: [
          "Requires managed infrastructure (apps, webhooks, event routing).",
          "Requires clear separation between test and production.",
          "Requires a defined transition from testing to integration.",
        ],
        consLabel: "Cons / constraints",
        keyLabel: "Key insight",
        keyText:
          "The app still exists — but during testing, it is infrastructure, not a user responsibility.",
        keyTone: "emerald" as const,
        fitIcon: "✅",
        fitText: "Strongly aligned",
        fitTone: "emerald" as const,
      },
    ].map((opt) => {
      const isRecommended = opt.n === 4;
      const tagBgClass =
        opt.tagColor === "emerald"
          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
          : opt.tagColor === "amber"
            ? "border-amber-500/40 bg-amber-500/15 text-amber-200"
            : opt.tagColor === "violet"
              ? "border-violet-500/40 bg-violet-500/15 text-violet-200"
              : "";
      const fitToneClass =
        opt.fitTone === "emerald"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
          : opt.fitTone === "amber"
            ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
            : "border-rose-500/30 bg-rose-500/10 text-rose-200";
      const keyToneClass =
        opt.keyTone === "emerald"
          ? "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-100"
          : "border-amber-500/30 bg-amber-500/[0.06] text-amber-100";
      const keyLabelClass =
        opt.keyTone === "emerald" ? "text-emerald-300" : "text-amber-300";
      const cardOuterClass = isRecommended
        ? "border-emerald-500/40 bg-emerald-500/[0.05] shadow-[0_0_0_1px_rgba(52,211,153,0.15)]"
        : "border-slate-800 bg-slate-900/40";
      return (
        <article
          key={opt.n}
          className={`rounded-2xl border p-6 sm:p-7 ${cardOuterClass}`}
        >
          <header className="flex flex-wrap items-baseline gap-3">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Option {opt.n}
            </p>
            <h3 className="text-[22px] font-semibold leading-snug text-slate-50 sm:text-[24px]">
              {opt.title}
            </h3>
            {opt.tag && (
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-[0.12em] ${tagBgClass}`}
              >
                {opt.tag}
              </span>
            )}
          </header>
          <div className="mt-4 space-y-5">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Flow
              </p>
              <p className="mt-1.5 rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3 font-mono text-[14.5px] leading-relaxed text-slate-200">
                {opt.flow}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                What this means
              </p>
              {opt.meaningIntro && (
                <p className="mt-1.5 text-[16.5px] leading-relaxed text-slate-200">
                  {opt.meaningIntro}
                </p>
              )}
              {opt.meaningPoints && opt.meaningPoints.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {opt.meaningPoints.map((m, i) => (
                    <DiscussionBullet key={i}>{m}</DiscussionBullet>
                  ))}
                </ul>
              )}
              {opt.meaningClosing && (
                <p className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-[15.5px] leading-relaxed text-amber-100">
                  {opt.meaningClosing}
                </p>
              )}
            </div>
            {opt.practice && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                  {opt.practice.title}
                </p>
                <p className="mt-2 text-[16px] leading-relaxed text-slate-200">
                  {opt.practice.intro}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {opt.practice.points.map((p, i) => (
                    <DiscussionBullet key={i} tone="muted">
                      {p}
                    </DiscussionBullet>
                  ))}
                </ul>
                {opt.practice.mixIntro && (
                  <p className="mt-4 text-[15.5px] font-medium leading-relaxed text-slate-300">
                    {opt.practice.mixIntro}
                  </p>
                )}
                {opt.practice.mix && opt.practice.mix.length > 0 && (
                  <ul className="mt-2.5 space-y-1.5">
                    {opt.practice.mix.map((m, i) => (
                      <li
                        key={i}
                        className="flex flex-wrap items-baseline gap-x-2 text-[15.5px] leading-relaxed"
                      >
                        <span className="font-semibold text-slate-100">
                          {m.label}
                        </span>
                        <span className="text-slate-500">→</span>
                        <span className="italic text-slate-300">
                          “{m.text}”
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {opt.coreProblem && (
              <div className="rounded-xl border border-rose-500/25 bg-rose-500/[0.04] p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-rose-300">
                  {opt.coreProblem.title ?? "Core problem"}
                </p>
                <p className="mt-2 text-[17px] font-semibold leading-snug text-slate-50">
                  {opt.coreProblem.headline}
                </p>
                <p className="mt-3 text-[15.5px] leading-relaxed text-slate-300">
                  {opt.coreProblem.intro}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {opt.coreProblem.points.map((p, i) => (
                    <DiscussionBullet key={i} tone="muted">
                      {p}
                    </DiscussionBullet>
                  ))}
                </ul>
              </div>
            )}
            {opt.how && (
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {opt.howLabel ?? "How it works"}
                </p>
                <div className="mt-2 space-y-3">
                  {(() => {
                    const blocks: React.ReactNode[] = [];
                    let runStart = 0;
                    const flushRun = (endExclusive: number) => {
                      const run = opt.how
                        .slice(runStart, endExclusive)
                        .filter((h): h is string => typeof h === "string");
                      if (run.length === 0) return;
                      blocks.push(
                        <ul
                          key={`run-${runStart}`}
                          className="space-y-1.5"
                        >
                          {run.map((h, i) => (
                            <DiscussionBullet key={i}>{h}</DiscussionBullet>
                          ))}
                        </ul>,
                      );
                    };
                    opt.how.forEach((h, i) => {
                      if (typeof h !== "string") {
                        flushRun(i);
                        blocks.push(
                          <div key={`grp-${i}`}>
                            <p className="text-[15.5px] font-medium leading-relaxed text-slate-200">
                              {h.heading}
                            </p>
                            <ul className="mt-2 space-y-1.5">
                              {h.bullets.map((b, j) => (
                                <DiscussionBullet key={j}>{b}</DiscussionBullet>
                              ))}
                            </ul>
                          </div>,
                        );
                        runStart = i + 1;
                      }
                    });
                    flushRun(opt.how.length);
                    return blocks;
                  })()}
                </div>
                {opt.howFollowUp && (
                  <div className="mt-4">
                    <p className="text-[15.5px] font-medium leading-relaxed text-slate-200">
                      {opt.howFollowUp.title}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {opt.howFollowUp.bullets.map((b, i) => (
                        <DiscussionBullet key={i}>{b}</DiscussionBullet>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <div
              className={`grid gap-4 ${opt.pros.length > 0 ? "sm:grid-cols-2" : ""}`}
            >
              {opt.pros.length > 0 && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                    Pros
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {opt.pros.map((p, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-[15.5px] leading-relaxed text-slate-200"
                      >
                        <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-rose-300">
                  {opt.consLabel ?? "Cons"}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {opt.cons.map((c, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-[15.5px] leading-relaxed text-slate-200"
                    >
                      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={`rounded-lg border px-4 py-3 ${keyToneClass}`}>
              <p
                className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${keyLabelClass}`}
              >
                {opt.keyLabel}
              </p>
              <p className="mt-1 text-[16px] font-medium leading-relaxed">
                {opt.keyText}
              </p>
              {opt.keyDetail && (
                <div className="mt-4 space-y-2.5">
                  <p className="text-[14.5px] leading-relaxed text-amber-100/85">
                    {opt.keyDetail.insteadIntro}
                  </p>
                  <p className="rounded-md border border-emerald-500/25 bg-slate-950/60 px-3 py-2 font-mono text-[14px] leading-relaxed text-emerald-200">
                    {opt.keyDetail.instead}
                  </p>
                  <p className="text-[14.5px] leading-relaxed text-amber-100/85">
                    {opt.keyDetail.forceIntro}
                  </p>
                  <p className="rounded-md border border-rose-500/30 bg-slate-950/60 px-3 py-2 font-mono text-[14px] leading-relaxed text-rose-200">
                    {opt.keyDetail.force}
                  </p>
                </div>
              )}
            </div>
            <div
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${fitToneClass}`}
            >
              <span className="text-[18px]" aria-hidden="true">
                {opt.fitIcon}
              </span>
              <p className="text-[14.5px] font-semibold leading-snug">
                <span className="opacity-70">Fit with research — </span>
                {opt.fitText}
              </p>
            </div>
          </div>
        </article>
      );
    })}
  </div>
);

const ResourceDirectionPane = () => (
  <div className="space-y-10">
    <header>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-violet-300">
        Recommended direction
      </p>
      <h2 className="mt-3 text-[28px] font-semibold tracking-tight leading-tight text-slate-50 sm:text-[34px]">
        Separate testing from integration
      </h2>
    </header>

    {/* Use managed test infrastructure */}
    <section className="space-y-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] p-6 sm:p-7">
      <DiscussionEyebrow color="emerald">
        Use managed test infrastructure for validation
      </DiscussionEyebrow>
      <p className="text-[17.5px] leading-relaxed text-slate-200">
        Testing should use platform-owned infrastructure.
      </p>
      <p className="text-[17px] leading-relaxed text-slate-300">
        Users should be able to:
      </p>
      <ul className="space-y-2">
        <DiscussionBullet>Send a message using their agent.</DiscussionBullet>
        <DiscussionBullet>See delivery status and logs.</DiscussionBullet>
        <DiscussionBullet>Confirm behaviour.</DiscussionBullet>
        <DiscussionBullet>Understand what happened.</DiscussionBullet>
      </ul>
      <p className="text-[17px] italic leading-relaxed text-slate-200">
        Without first creating or connecting their own app.
      </p>
    </section>

    {/* Use user-owned apps for integration */}
    <section className="space-y-4 rounded-2xl border border-indigo-500/25 bg-indigo-500/[0.04] p-6 sm:p-7">
      <DiscussionEyebrow>Use user-owned apps for integration</DiscussionEyebrow>
      <p className="text-[17.5px] leading-relaxed text-slate-200">
        When users move toward integration:
      </p>
      <ul className="space-y-2">
        <DiscussionBullet>The purpose of the app becomes clear.</DiscussionBullet>
        <DiscussionBullet>The agent / app relationship can be explained.</DiscussionBullet>
        <DiscussionBullet>Developers can create or select apps intentionally.</DiscussionBullet>
        <DiscussionBullet>Webhooks and credentials become relevant.</DiscussionBullet>
      </ul>
    </section>

    {/* Design principle */}
    <section className="rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent p-6 sm:p-8">
      <DiscussionEyebrow color="cyan">Design principle</DiscussionEyebrow>
      <p className="mt-3 text-[20px] leading-snug text-slate-100 sm:text-[22px]">
        Users should not be required to create or connect an app before they
        understand why it exists.
      </p>
      <p className="mt-3 text-[17px] leading-relaxed text-slate-300">
        But when they move into integration, they should remain in control of
        it.
      </p>
    </section>

    {/* Implication for onboarding */}
    <section className="space-y-4">
      <DiscussionEyebrow>Implication for onboarding</DiscussionEyebrow>
      <ul className="space-y-2">
        <DiscussionBullet>Do not make app setup a prerequisite for validation.</DiscussionBullet>
        <DiscussionBullet>Do not use hidden auto-created user apps as the default solution.</DiscussionBullet>
        <DiscussionBullet>Use managed test infrastructure for early validation.</DiscussionBullet>
        <DiscussionBullet>Introduce app creation when users move into integration.</DiscussionBullet>
        <DiscussionBullet>
          Apply the same principle across SMS, RCS, and WhatsApp, even if
          implementation differs by channel.
        </DiscussionBullet>
      </ul>
    </section>

    {/* Open questions */}
    <section className="space-y-4">
      <DiscussionEyebrow color="amber">Open questions</DiscussionEyebrow>
      <ol className="space-y-3">
        {[
          "What is the lightest managed test architecture we can support?",
          "How many managed apps are needed per region?",
          "How should event routing and tenant isolation work?",
          "What should the test data retention policy be?",
          "How do we communicate the move from test mode to user-owned integration?",
          "How do we avoid hidden or orphaned resources?",
          "How should this principle apply across SMS, RCS, and WhatsApp?",
        ].map((q, i) => (
          <li
            key={i}
            className="flex items-start gap-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] px-5 py-4"
          >
            <span className="font-serif text-[20px] tabular-nums text-amber-300">
              {i + 1}
            </span>
            <span className="text-[17px] leading-relaxed text-slate-200">
              {q}
            </span>
          </li>
        ))}
      </ol>
    </section>

    {/* Key takeaway */}
    <section className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent p-6 sm:p-8">
      <DiscussionEyebrow>Key takeaway</DiscussionEyebrow>
      <p className="mt-3 text-[22px] leading-snug text-slate-100 sm:text-[26px]">
        The goal is not to remove the app.
      </p>
      <p className="mt-1 text-[22px] font-semibold leading-snug text-slate-50 sm:text-[26px]">
        The goal is to introduce it when it becomes meaningful.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-4 py-3 text-[16px] font-medium leading-relaxed text-emerald-100">
          Use managed infrastructure for validation.
        </p>
        <p className="rounded-lg border border-indigo-500/25 bg-indigo-500/[0.06] px-4 py-3 text-[16px] font-medium leading-relaxed text-indigo-100">
          Use user-owned resources for integration.
        </p>
      </div>
    </section>
  </div>
);

/**
 * Inline page section that renders the same resource-creation discussion
 * content as the dialog, but stacked vertically (no tabs). Placed
 * between the Journey and Principles sections so the content is visible
 * directly on the page in addition to the dialog launched from Step 5.
 */
const ResourceCreationSection = () => (
  <section className="relative overflow-hidden border-b border-slate-800/60 bg-slate-950">
    <GlowOrb
      color="violet"
      size="lg"
      className="left-[-10%] top-[20%]"
      delay
    />
    <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28">
      <SectionReveal>
        <SectionHeader
          number="03"
          eyebrow="Discussion · Linked from Step 5"
          title="Resource creation: timing and ownership"
          intro={[
            "A focused discussion on what blocks users from validating their setup, and how Conversation API app creation should support that journey.",
            "Shown in full on the page so the team can read straight through. The same content is also available as a dialog from Step 5 of the Journey.",
          ]}
        />
      </SectionReveal>
      <div className="mx-auto w-full max-w-5xl space-y-16">
        <ResourceOverviewPane />
        <div className="border-t border-slate-800/60" aria-hidden="true" />
        <ResourceAutoPane />
        <div className="border-t border-slate-800/60" aria-hidden="true" />
        <ResourceOptionsPane />
        <div className="border-t border-slate-800/60" aria-hidden="true" />
        <ResourceDirectionPane />
      </div>
    </div>
  </section>
);

const ResourceCreationDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<ResourceDiscussionTab>("overview");
  const scrollRef = useRef<HTMLDivElement>(null);
  // Reset to first tab + scroll-to-top each time the dialog opens.
  useEffect(() => {
    if (open) {
      setActiveTab("overview");
    }
  }, [open]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [activeTab]);

  // ESC to close + body-scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Discussion: Resource creation — timing and ownership"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: PREMIUM_EASE }}
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/97 backdrop-blur-sm"
        >
          {/* Sticky header */}
          <motion.header
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.35, ease: PREMIUM_EASE, delay: 0.05 }}
            className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur"
          >
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-5 sm:px-8">
              <div className="flex min-w-0 items-center gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-indigo-400/70 hover:text-indigo-300"
                >
                  <X className="h-4 w-4" />
                </button>
                <div
                  aria-hidden="true"
                  className="h-9 w-px shrink-0 bg-slate-800"
                />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                    Discussion · Linked from Step 5
                  </p>
                  <h2 className="mt-0.5 truncate text-lg font-semibold text-slate-50 sm:text-xl">
                    Resource creation: timing and ownership
                  </h2>
                </div>
              </div>
            </div>
            {/* Tab strip — sticky alongside the header */}
            <div className="border-t border-slate-900 bg-slate-950/85 backdrop-blur">
              <div className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-6 sm:px-8">
                {RESOURCE_TABS.map((t) => {
                  const isActive = t.id === activeTab;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTab(t.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative shrink-0 px-4 py-3 text-[14px] font-medium transition ${
                        isActive
                          ? "text-slate-50"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="relative">{t.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="resource-tab-underline"
                          className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.7)]"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 32,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.header>

          {/* Scrollable content */}
          <motion.div
            ref={scrollRef}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.4, ease: PREMIUM_EASE, delay: 0.1 }}
            className="flex-1 overflow-y-auto"
          >
            <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 sm:py-12">
              <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.22, ease: PREMIUM_EASE }}
                >
                  <ResourceOverviewPane />
                </motion.div>
              )}

              {activeTab === "auto" && (
                <motion.div
                  key="auto"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.22, ease: PREMIUM_EASE }}
                >
                  <ResourceAutoPane />
                </motion.div>
              )}

              {activeTab === "options" && (
                <motion.div
                  key="options"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.22, ease: PREMIUM_EASE }}
                >
                  <ResourceOptionsPane />
                </motion.div>
              )}

              {activeTab === "direction" && (
                <motion.div
                  key="direction"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.22, ease: PREMIUM_EASE }}
                >
                  <ResourceDirectionPane />
                </motion.div>
              )}
              </AnimatePresence>

              {/* Footer — always visible at the end of any tab */}
              <footer className="mt-12 border-t border-slate-800 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-[14px] font-medium text-slate-300 transition hover:border-indigo-400/70 hover:text-indigo-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Step 5
                </button>
              </footer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// =================================================================
// Section components
// =================================================================

const Hero = () => (
  <section className="relative overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
    {/* Layered background decorations — softer, fewer */}
    <div aria-hidden="true" className="absolute inset-0 grid-bg opacity-50" />
    <div aria-hidden="true" className="absolute inset-0 noise-bg opacity-[0.025]" />
    <GlowOrb
      color="indigo"
      size="xl"
      className="left-[-10%] top-[-20%]"
    />
    <GlowOrb
      color="violet"
      size="lg"
      className="right-[-8%] top-[10%]"
      delay
    />

    <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-24 sm:pt-36">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.p
          variants={fadeInUp}
          className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[13.5px] font-medium tracking-[0.14em] text-slate-300 backdrop-blur"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
          RESEARCH FINDINGS · 2026
        </motion.p>

        <motion.h1
          variants={fadeInUp}
          className="mt-8 max-w-5xl text-[44px] font-semibold tracking-tight leading-[1.04] text-slate-50 sm:text-6xl sm:leading-[1.02] md:text-[72px]"
        >
          Messaging Onboarding
          <span className="block bg-gradient-to-r from-indigo-200 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Key Insights &amp; Direction
          </span>
        </motion.h1>

        <motion.div
          variants={fadeInUp}
          className="mt-8 max-w-3xl space-y-4 text-lg leading-relaxed text-slate-400 sm:text-xl"
        >
          {HERO.supporting.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </motion.div>

        <motion.dl
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-16 grid gap-4 sm:grid-cols-3"
        >
          {HERO.stats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3, ease: PREMIUM_EASE }}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition hover:border-indigo-500/40"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 opacity-0 transition group-hover:from-indigo-500/10 group-hover:opacity-100"
              />
              <dt className="relative text-[13.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {s.label}
              </dt>
              <dd className="relative mt-2 text-xl font-semibold tracking-tight text-slate-50">
                {s.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>
    </div>
  </section>
);

const ExecutiveSummary = () => (
  <section className="relative border-b border-slate-800/60 bg-slate-950">
    <GlowOrb
      color="indigo"
      size="lg"
      className="right-[-15%] top-[20%]"
      delay
    />
    <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28">
      <SectionReveal>
        <SectionHeader
          number="01"
          eyebrow="Executive summary"
          title="What the research shows, in seven lines."
          intro="Read top to bottom. The rest of this report is evidence, comparison, and the product decision that follows from these seven findings."
        />
      </SectionReveal>
      <StaggerGroup className="divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        {EXEC_SUMMARY.map((t, i) => (
          <StaggerItem key={i}>
            <div className="group flex items-start gap-6 px-6 py-6 transition-colors hover:bg-slate-800/30 sm:px-8">
              <span className="mt-1 font-serif text-2xl font-light tabular-nums text-indigo-400 transition group-hover:text-indigo-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-slate-50">
                  {t.headline}
                </p>
                {t.body.map((p, pi) => (
                  <p
                    key={pi}
                    className="text-[16.5px] leading-relaxed text-slate-400"
                  >
                    {p}
                  </p>
                ))}
                {t.bullets && t.bullets.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {t.bullets.map((b, bi) => (
                      <li
                        key={bi}
                        className="flex items-start gap-2.5 text-[16.5px] leading-relaxed text-slate-300"
                      >
                        <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  </section>
);

// --- Ideal journey section --------------------------------------------------

// All quotes visible as short preview cards. Hovering any one expands that
// card's text to the full quote in place. Only one expanded at a time; the
// short and long versions never show together.
// Single quote row: short excerpt is always visible. On hover, an absolute
// popover appears below the card with the full quote and its title. Because
// the popover lives inside the same wrapper, moving the mouse from card to
// popover keeps it open.
const JourneyQuoteCard = ({ q }: { q: JourneyQuote }) => {
  const [open, setOpen] = useState(false);
  const hasLong = !!q.long;
  const activate = () => hasLong && setOpen(true);
  const deactivate = () => hasLong && setOpen(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [popoverRect, setPopoverRect] = useState<{
    left: number;
    top: number;
    bottom: number;
    width: number;
    placeAbove: boolean;
  } | null>(null);

  // Measure the trigger's window-relative position so the portal-rendered
  // popover can sit directly above it (preferred), escaping any
  // `overflow-hidden` ancestors. If there isn't enough room above the trigger
  // in the viewport, flip the popover below the trigger instead.
  useLayoutEffect(() => {
    if (!open || !wrapperRef.current) {
      setPopoverRect(null);
      return;
    }
    const update = () => {
      if (!wrapperRef.current) return;
      const r = wrapperRef.current.getBoundingClientRect();
      // Heuristic: prefer above. Flip below only if the space above the
      // trigger (in the viewport) is clearly insufficient for a popover.
      const ESTIMATED_HEIGHT = 220;
      const placeAbove = r.top >= ESTIMATED_HEIGHT;
      setPopoverRect({
        left: r.left + window.scrollX,
        top: r.top + window.scrollY,
        bottom: r.bottom + window.scrollY,
        width: r.width,
        placeAbove,
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onFocus={activate}
      onBlur={deactivate}
    >
      <article
        tabIndex={hasLong ? 0 : undefined}
        aria-expanded={hasLong ? open : undefined}
        className={`rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 outline-none ${
          hasLong ? "cursor-default" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30">
            <QuoteIcon className="h-3 w-3" />
          </span>
          <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Research quote
          </p>
          {q.participant && (
            <>
              <span className="text-slate-700">·</span>
              <p className="text-[13px] font-medium text-slate-300">
                {q.participant}
                {q.persona ? (
                  <span className="text-slate-500"> · {q.persona}</span>
                ) : null}
              </p>
              {(() => {
                const aud = audienceForParticipant(q.participant);
                return aud ? <AudienceTag audience={aud} /> : null;
              })()}
            </>
          )}
        </div>
        <p className="mt-2.5 text-[16px] font-medium leading-relaxed text-slate-100">
          &ldquo;{q.short}&rdquo;
        </p>
      </article>

      {/* Popover lives in a portal on document.body so it can escape any
          ancestor `overflow-hidden` (collapsible section wrappers, etc.).
          Positioned absolutely at the trigger's measured rect, then translated
          up by 100% of its own height to sit above the card. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && q.long && popoverRect && (
              <motion.div
                role="tooltip"
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.2, ease: PREMIUM_EASE }}
                style={{
                  position: "absolute",
                  left: popoverRect.left,
                  // Anchor at the trigger's top (above) or bottom (below).
                  top: popoverRect.placeAbove
                    ? popoverRect.top
                    : popoverRect.bottom,
                  width: popoverRect.width,
                  // Translate up by 100% + 8px when above, or just 8px gap below.
                  transform: popoverRect.placeAbove
                    ? "translateY(calc(-100% - 8px))"
                    : "translateY(8px)",
                }}
                className={`pointer-events-none z-50 rounded-xl border border-indigo-500/40 bg-slate-900/95 p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95),0_10px_25px_-15px_rgba(99,102,241,0.35)] backdrop-blur-md sm:p-5 ${
                  popoverRect.placeAbove ? "origin-bottom" : "origin-top"
                }`}
              >
                {q.title && (
                  <p className="text-[17px] font-semibold leading-snug text-slate-50">
                    {q.title}
                  </p>
                )}
                <p className="mt-2 text-[17px] italic leading-relaxed text-slate-300">
                  &ldquo;{q.long}&rdquo;
                </p>
                {(q.participant || q.persona) && (
                  <div className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400/60 to-violet-500/60 text-[11px] font-semibold text-white ring-1 ring-indigo-300/40">
                      {q.participant
                        ? q.participant.replace(/^P/i, "")
                        : "·"}
                    </span>
                    <span className="text-[13px] font-medium text-slate-300">
                      {q.participant ?? "Participant"}
                    </span>
                    {q.persona && (
                      <>
                        <span className="text-slate-600">·</span>
                        <span className="text-[13px] text-slate-400">
                          {q.persona}
                        </span>
                      </>
                    )}
                    {(() => {
                      const aud = audienceForParticipant(q.participant);
                      return aud ? (
                        <AudienceTag audience={aud} />
                      ) : null;
                    })()}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};

const JourneyQuotes = ({ quotes }: { quotes: JourneyQuote[] }) => (
  <JourneyCollapsibleSection
    title="Why this step matters"
    titleColorClass="text-slate-400"
    className="mt-6 border-t border-slate-800/60 pt-5"
  >
    <div className="space-y-2.5">
      {quotes.map((q, i) => (
        <JourneyQuoteCard key={i} q={q} />
      ))}
    </div>
  </JourneyCollapsibleSection>
);

// --- Mock/wireframe illustrations for selected journey steps ---------------

// Simplified Send-test-message mock: template selector with explicit label,
// a single message field, and a quiet send button (the action is a follow-up,
// not the loud focal point).
const SendMessageMock = () => (
  <div className="mx-auto mb-5 max-w-md overflow-hidden rounded-xl border border-dashed border-slate-700 bg-slate-950/70 p-4 sm:p-5">
    {/* Template selector */}
    <p className="text-[12.5px] font-medium text-slate-400">
      Message template
    </p>
    <div className="mt-1.5 inline-flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
      <span className="h-5 w-5 rounded-sm bg-gradient-to-br from-indigo-400/50 to-violet-500/50 ring-1 ring-slate-700" />
      <span className="text-[14.5px] font-medium text-slate-100">
        Text message
      </span>
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </div>

    {/* Message field */}
    <div className="mt-4">
      <p className="text-[12.5px] font-medium text-slate-400">Message</p>
      <div className="mt-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5">
        <p className="text-[14.5px] text-slate-100">
          Check out our latest collection
        </p>
      </div>
    </div>

    {/* Send button — quiet outlined style */}
    <button
      type="button"
      disabled
      className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-[13.5px] font-medium text-slate-200"
    >
      Send test message
      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
    </button>
  </div>
);

// Compact skeleton-style log: two rows representing queued + delivered events
// with placeholder bars instead of real text values.
const AnalyticsRowMock = () => {
  const rows: {
    icon: "clock" | "check";
    label: string;
    accent: "amber" | "emerald";
    bars: { w: number; tone?: "muted" }[];
  }[] = [
    {
      icon: "clock",
      label: "Queued",
      accent: "amber",
      bars: [{ w: 96 }, { w: 144, tone: "muted" }],
    },
    {
      icon: "check",
      label: "Delivered",
      accent: "emerald",
      bars: [{ w: 112 }, { w: 168, tone: "muted" }],
    },
  ];
  return (
    <div className="mx-auto mb-5 max-w-xl overflow-hidden rounded-xl border border-dashed border-slate-700 bg-slate-950/70 px-3 py-1.5 sm:px-4">
      {rows.map((r, i) => {
        const Icon = r.icon === "clock" ? Clock : Check;
        const ringColor =
          r.accent === "amber"
            ? "bg-amber-500/15 text-amber-300 ring-amber-500/30"
            : "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.45)]";
        const labelColor =
          r.accent === "amber" ? "text-amber-300" : "text-emerald-300";
        return (
          <div
            key={i}
            className={`flex items-center gap-3 py-2.5 ${
              i > 0 ? "border-t border-slate-800/60" : ""
            }`}
          >
            <span
              className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md ring-1 ${ringColor}`}
            >
              <Icon className="h-3 w-3" strokeWidth={3} />
            </span>
            <div className="flex flex-1 min-w-0 flex-col gap-1.5">
              {r.bars.map((b, bi) => (
                <span
                  key={bi}
                  className={`block h-2 rounded-full ${
                    b.tone === "muted" ? "bg-slate-800" : "bg-slate-700"
                  }`}
                  style={{ width: `${b.w}px`, maxWidth: "100%" }}
                />
              ))}
            </div>
            <span
              className={`shrink-0 font-mono text-[12px] uppercase tracking-[0.12em] ${labelColor}`}
            >
              {r.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Compact API playground mock: tab strip, syntax-highlighted curl snippet
// with placeholder pills, soft fade-out to suggest more code below, and a
// quiet Run button. Sized smaller than full-width and not full-height.
const ApiPlaygroundMock = () => (
  <div className="mx-auto mb-5 max-w-2xl overflow-hidden rounded-xl border border-dashed border-slate-700 bg-slate-950/80">
    {/* Tab strip */}
    <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
      <div className="flex items-center gap-1">
        <span className="rounded-md bg-slate-800 px-2.5 py-1 text-[12.5px] font-medium text-slate-100">
          cURL
        </span>
        <span className="px-2.5 py-1 text-[12.5px] font-medium text-slate-500">
          Node.js
        </span>
        <span className="px-2.5 py-1 text-[12.5px] font-medium text-slate-500">
          Python
        </span>
      </div>
      <div className="flex items-center gap-3 text-[12px] text-slate-500">
        <span>Copy</span>
        <span>Edit</span>
      </div>
    </div>

    {/* Code body with bottom fade */}
    <div className="relative">
      <pre className="overflow-x-auto whitespace-pre px-4 py-2.5 font-mono text-[12.5px] leading-relaxed text-slate-300">
        <span>curl -X POST </span>
        <span className="text-emerald-300">
          &quot;https://api.sinch.com/conversations/v1/projects/
        </span>
        <span className="rounded bg-emerald-500/15 px-1 text-emerald-300">
          {"{Project ID}"}
        </span>
        <span className="text-emerald-300">/messages:send&quot;</span>
        <span className="text-slate-500"> \</span>
        {"\n"}
        <span> -u </span>
        <span className="text-emerald-300">&quot;</span>
        <span className="rounded bg-amber-500/15 px-1 text-amber-200 ring-1 ring-amber-500/30">
          {"{Access key}"}
        </span>
        <span className="text-emerald-300">:&quot;</span>
        <span className="text-slate-500"> \</span>
        {"\n"}
        <span> -d </span>
        <span className="text-emerald-300">&apos;</span>
        {"{ "}
        <span className="text-cyan-300">&quot;app_id&quot;</span>
        <span>: </span>
        <span className="text-emerald-300">&quot;</span>
        <span className="rounded bg-emerald-500/15 px-1 text-emerald-300">
          {"{Conversation API app ID}"}
        </span>
        <span className="text-emerald-300">&quot;</span>
        <span>, </span>
        <span className="text-slate-500">…</span>
        {"\n"}
      </pre>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-slate-950"
      />
    </div>

    {/* Footer */}
    <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-3 py-2.5">
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-[12.5px] font-medium text-slate-200">
        <span className="text-slate-500">▷</span>
        Run request
      </span>
    </div>
  </div>
);

// Rich-message-delivered mockup: a branded RCS agent message arriving on a
// device, with avatar, rich card, and a Delivered checkmark in the metadata
// row. Used for "Validate again" — the second value moment.
const DeliveredMessageMock = () => (
  <div className="mx-auto mb-5 max-w-md overflow-hidden rounded-xl border border-dashed border-slate-700 bg-slate-950/70 p-4 sm:p-5">
    <div className="flex items-start gap-3">
      {/* Avatar — branded logo mark on a gradient disc */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 ring-2 ring-indigo-500/40">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-[22px] w-[22px] text-white"
        >
          {/* Sun-style brand mark: filled core + 8 rays (matches "Lumen") */}
          <circle cx="12" cy="12" r="3.5" fill="currentColor" />
          <path
            d="M12 4v2M12 18v2M4 12h2M18 12h2M6.5 6.5l1.4 1.4M16.1 16.1l1.4 1.4M6.5 17.5l1.4-1.4M16.1 7.9l1.4-1.4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bubble */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <p className="text-[13.5px] font-semibold text-slate-100">Lumen</p>
        </div>

        {/* Rich card — text + buttons only */}
        <div className="mt-1.5 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
          <div className="px-3 py-2.5">
            <p className="text-[13.5px] font-semibold text-slate-50">
              Your order is on the way
            </p>
            <p className="mt-0.5 text-[12.5px] leading-snug text-slate-400">
              Track your delivery and update your preferences from the link
              below.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-indigo-400/40 bg-indigo-500/10 px-2 py-1 text-[12px] font-medium text-indigo-200">
                Track order
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[12px] font-medium text-slate-300">
                Manage preferences
              </span>
            </div>
          </div>
        </div>

        {/* Delivery metadata */}
        <div className="mt-2 flex items-center gap-1.5 text-[11.5px] text-slate-500">
          <span>2:14 PM</span>
          <span className="text-slate-700">·</span>
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <Check className="h-3 w-3" strokeWidth={3} />
            <Check className="-ml-2 h-3 w-3" strokeWidth={3} />
            Delivered
          </span>
        </div>
      </div>
    </div>
  </div>
);

const StepIllustration = ({ kind }: { kind: JourneyIllustration }) => {
  if (kind === "send") return <SendMessageMock />;
  if (kind === "analytics") return <AnalyticsRowMock />;
  if (kind === "api") return <ApiPlaygroundMock />;
  if (kind === "delivered") return <DeliveredMessageMock />;
  return null;
};

/**
  * Collapsible section wrapper used inside JourneyStepCard for the major
  * content blocks (Why / Value / Key design principles / Concrete ideas /
  * What happens next). Defaults to open; the eyebrow heading becomes a button
  * with a chevron that toggles content height.
  */
const JourneyCollapsibleSection = ({
  title,
  titleColorClass,
  defaultOpen = true,
  className = "mt-8 border-t border-slate-800/60 pt-6",
  children,
}: {
  title: string;
  titleColorClass: string;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`group mb-4 flex w-full items-center justify-between gap-3 text-[14px] font-semibold uppercase tracking-[0.16em] ${titleColorClass} transition hover:opacity-80`}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: PREMIUM_EASE }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const JourneyStepCard = ({
  step,
  isActive,
  onOpenDiscussion,
}: {
  step: JourneyStep;
  isActive: boolean;
  onOpenDiscussion?: () => void;
}) => (
  <motion.article
    animate={{
      // Toned-down active state: subtle border tint, no large indigo shadow.
      borderColor: isActive
        ? "rgba(99, 102, 241, 0.18)"
        : "rgba(30, 41, 59, 1)",
      boxShadow: isActive
        ? "0 12px 32px -22px rgba(0,0,0,0.6)"
        : "0 8px 24px -22px rgba(0,0,0,0.55)",
    }}
    transition={{ duration: 0.5, ease: PREMIUM_EASE }}
    className="rounded-2xl border bg-slate-900/70 p-7 backdrop-blur-sm sm:p-9"
  >
    {step.illustration && <StepIllustration kind={step.illustration} />}
    {step.tag && (
      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/[0.06] px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
        {step.tag}
      </span>
    )}
    <h4 className="text-[28px] font-semibold tracking-tight leading-tight text-slate-50 sm:text-[32px] lg:text-[34px]">
      {step.title}
    </h4>

    {/* Discussion trigger — surfaced prominently on Step 5 (s6) and pinned
        to the top of the viewport while the user scrolls through the step. */}
    {step.id === "s6" && onOpenDiscussion && (
      <button
        type="button"
        onClick={onOpenDiscussion}
        className="group sticky top-[60px] z-20 mt-5 flex w-full items-start gap-4 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-cyan-500/10 p-5 text-left backdrop-blur-md transition hover:border-violet-400/60 hover:from-violet-500/25 hover:via-indigo-500/20 sm:p-6 lg:top-2"
      >
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/25 text-violet-200 ring-1 ring-violet-400/40">
          <ExternalLink className="h-4 w-4" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[19px] font-semibold leading-snug text-slate-50 sm:text-[21px]">
            Resource creation: timing and ownership
          </p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-slate-300">
            Why this step exists, the auto-create-vs-explicit-setup tradeoff,
            and the design principle the rest of the journey follows.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-violet-200 transition group-hover:text-violet-100">
            Open the discussion
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </p>
        </div>
      </button>
    )}

    {step.description.length > 0 && (
      <ul className="mt-5 space-y-2.5">
        {step.description.map((d, i) => {
          const isString = typeof d === "string";
          const text = isString ? d : d.text;
          const kind = isString ? "string" : d.kind;
          return (
            <li key={i} className="flex items-start gap-3">
              {kind === "check" ? (
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              ) : kind === "cross" ? (
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-800 text-slate-500 ring-1 ring-slate-700">
                  <X className="h-3 w-3" strokeWidth={3} />
                </span>
              ) : (
                <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
              )}
              <span
                className={`text-[18px] leading-relaxed ${
                  kind === "cross" ? "text-slate-400" : "text-slate-200"
                }`}
              >
                {text}
              </span>
            </li>
          );
        })}
      </ul>
    )}

    {step.paths && (
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {step.paths.map((p) => (
          <div
            key={p.label}
            className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
          >
            <p className="text-[13.5px] font-semibold uppercase tracking-[0.14em] text-indigo-300">
              {p.label}
            </p>
            <p className="mt-1.5 text-[17.5px] leading-relaxed text-slate-300">
              {p.description}
            </p>
          </div>
        ))}
      </div>
    )}

    {step.whyGroups ? (
      <JourneyCollapsibleSection title="Why this step matters" titleColorClass="text-slate-400">
        <div className="space-y-5">
          {step.whyGroups.map((g, gi) => {
            if (g.kind === "commentary") {
              return (
                <div
                  key={gi}
                  className="border-l-2 border-slate-700/80 pl-4"
                >
                  {g.title && (
                    <p className="mb-1.5 text-[13px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
                      {g.title}
                    </p>
                  )}
                  <p className="text-[18px] italic leading-relaxed text-slate-200">
                    {g.text}
                  </p>
                  {g.bullets && g.bullets.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {g.bullets.map((b, bi) => (
                        <li
                          key={bi}
                          className="flex gap-2 text-[17px] leading-relaxed text-slate-300"
                        >
                          <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {g.subItems && g.subItems.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {g.subItems.map((s, si) => (
                        <li
                          key={si}
                          className="flex gap-2 text-[17px] leading-relaxed text-slate-300"
                        >
                          <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                          <span>
                            <span className="font-semibold text-slate-100">
                              {s.label}
                            </span>{" "}
                            <span className="text-slate-300">{s.text}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {g.conclusion && (
                    <p className="mt-3 text-[17.5px] italic leading-relaxed text-slate-200">
                      {g.conclusion}
                    </p>
                  )}
                </div>
              );
            }
            return (
              <div key={gi}>
                <p className="text-[17.5px] leading-relaxed text-slate-300">
                  {g.intro}
                </p>
                {g.quoteIndices.length > 0 && (
                  <div className="mt-3 space-y-2.5">
                    {g.quoteIndices.map((qi) => {
                      const q = step.whyQuotes[qi];
                      if (!q) return null;
                      return <JourneyQuoteCard key={qi} q={q} />;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </JourneyCollapsibleSection>
    ) : (
      <JourneyQuotes quotes={step.whyQuotes} />
    )}

    {step.valueProps && (
      <JourneyCollapsibleSection title="Value" titleColorClass="text-emerald-300">
        <div className="grid gap-3 sm:grid-cols-2">
          {step.valueProps.map((v, vi) => {
            const hasSubItems = !!(v.subItems && v.subItems.length > 0);
            const hasBullets = !!(v.bullets && v.bullets.length > 0);
            const wide = hasSubItems;
            return (
              <div
                key={vi}
                className={`rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3.5 ${
                  wide ? "sm:col-span-2" : ""
                }`}
              >
                <p className="text-[17px] font-semibold text-slate-50">
                  {v.title}
                </p>
                {v.description && (
                  <p className="mt-1 text-[16px] leading-relaxed text-slate-400">
                    {v.description}
                  </p>
                )}
                {hasBullets && (
                  <ul className="mt-2.5 space-y-1.5">
                    {v.bullets!.map((b, bi) => (
                      <li
                        key={bi}
                        className="flex items-start gap-2 text-[16px] leading-relaxed text-slate-300"
                      >
                        <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {hasSubItems && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {v.subItems!.map((s, si) => (
                      <div
                        key={si}
                        className="rounded-md border border-emerald-500/15 bg-slate-950/40 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                          <p className="text-[16px] font-semibold text-slate-100">
                            {s.label}
                          </p>
                        </div>
                        <p className="mt-1 text-[16px] leading-relaxed text-slate-400">
                          {s.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {v.conclusion && (
                  <p className="mt-3 text-[16px] leading-relaxed text-slate-300">
                    {v.conclusion}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </JourneyCollapsibleSection>
    )}

    {step.designPrinciples && (
      <JourneyCollapsibleSection
        title="Key design principles"
        titleColorClass="text-indigo-300"
      >
        <ul className="space-y-2">
          {step.designPrinciples.items.map((p, pi) => (
            <li
              key={pi}
              className="flex items-start gap-3 text-[17.5px] leading-relaxed text-slate-200"
            >
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        {step.designPrinciples.goal && (
          <div className="mt-4 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-3">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
              The goal
            </p>
            <p className="mt-1 text-[18px] font-semibold leading-snug text-slate-50">
              {step.designPrinciples.goal}
            </p>
          </div>
        )}
      </JourneyCollapsibleSection>
    )}

    {step.concreteIdeas && step.concreteIdeas.length > 0 && (
      <JourneyCollapsibleSection
        title="Concrete ideas"
        titleColorClass="text-cyan-300"
      >
        <ul className="space-y-4">
          {step.concreteIdeas.map((idea, ii) => (
            <li key={ii} className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                <div className="flex-1">
                  <p className="text-[17.5px] font-semibold leading-snug text-slate-100">
                    {idea.text}
                  </p>
                  {idea.meta && (
                    <p className="mt-0.5 text-[14.5px] italic leading-relaxed text-slate-400">
                      {idea.meta}
                    </p>
                  )}
                </div>
              </div>
              {idea.bullets && idea.bullets.length > 0 && (
                <ul className="ml-7 space-y-1.5">
                  {idea.bullets.map((b, bi) => (
                    <li
                      key={bi}
                      className="flex items-start gap-2.5 text-[16px] leading-relaxed text-slate-300"
                    >
                      <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-cyan-400/60" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {idea.subItems && idea.subItems.length > 0 && (
                <ul className="ml-7 space-y-1.5">
                  {idea.subItems.map((s, si) => (
                    <li
                      key={si}
                      className="flex flex-wrap items-baseline gap-x-2 text-[16.5px] leading-relaxed"
                    >
                      <span className="font-semibold text-slate-100">
                        {s.label}
                      </span>
                      <span className="text-slate-500">→</span>
                      <span className="text-slate-400">
                        {s.description}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </JourneyCollapsibleSection>
    )}

    {step.nextSteps && (
      <JourneyCollapsibleSection
        title="What happens next"
        titleColorClass="text-violet-300"
      >
        <p className="mb-4 text-[17.5px] leading-relaxed text-slate-300">
          {step.nextSteps.intro}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {step.nextSteps.paths.map((p, pi) => (
            <div
              key={pi}
              className="rounded-xl border border-violet-500/25 bg-violet-500/5 px-4 py-4"
            >
              <p className="text-[13.5px] font-semibold uppercase tracking-[0.14em] text-violet-300">
                {p.label}
              </p>
              <ul className="mt-3 space-y-2">
                {p.items.map((item, ii) => (
                  <li
                    key={ii}
                    className="flex items-start gap-2.5 text-[16.5px] leading-relaxed text-slate-200"
                  >
                    <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.7)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </JourneyCollapsibleSection>
    )}

    {step.keyInsight && (
      <div className="mt-8 rounded-xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent p-5 sm:p-6">
        <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
          Key insight
        </p>
        <p className="mt-2 text-[19px] font-semibold leading-snug text-slate-50 sm:text-[21px]">
          {step.keyInsight.headline}
        </p>
        {step.keyInsight.bullets && step.keyInsight.bullets.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {step.keyInsight.bullets.map((b, bi) => (
              <li
                key={bi}
                className="flex items-start gap-2.5 text-[17px] leading-relaxed text-slate-300"
              >
                <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )}

    {step.keyTakeaway && (
      <div className="mt-8 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent p-5 sm:p-6">
        <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
          Key takeaway
        </p>
        <p className="mt-2 text-[20px] font-semibold leading-snug text-slate-50 sm:text-[22px]">
          {step.keyTakeaway.headline}
        </p>
        {step.keyTakeaway.subtext && (
          <p className="mt-3 text-[17px] italic leading-relaxed text-slate-300">
            {step.keyTakeaway.subtext}
          </p>
        )}
      </div>
    )}
  </motion.article>
);

// Parent-level row: owns the step's useInView observer and passes the active
// state to both the rail dot and the step card, keeping them in sync.
const JourneyStepRow = ({
  step,
  isFirstTheme,
  onOpenDiscussion,
}: {
  step: JourneyStep;
  isFirstTheme: boolean;
  onOpenDiscussion?: () => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const isActive = useInView(ref, {
    margin: "-45% 0px -45% 0px",
    amount: "some",
  });
  const dotBg = isFirstTheme
    ? "bg-gradient-to-br from-indigo-400 to-indigo-600"
    : "bg-gradient-to-br from-violet-400 to-violet-600";
  // Toned-down active state: subtle ring, no large glow, gentle scale.
  const activeGlow = isFirstTheme
    ? "0 0 0 3px rgb(2, 6, 23), 0 0 0 4px rgba(129,140,248,0.20)"
    : "0 0 0 3px rgb(2, 6, 23), 0 0 0 4px rgba(167,139,250,0.18)";
  const restGlow = "0 0 0 3px rgb(2, 6, 23), 0 0 0 0 rgba(129,140,248,0)";
  return (
    <motion.li
      ref={ref}
      id={`journey-${step.id}`}
      animate={{
        scale: isActive ? 1 : 0.99,
        opacity: isActive ? 1 : 0.7,
      }}
      transition={{ duration: 0.5, ease: PREMIUM_EASE }}
      className="relative pl-14"
    >
      <motion.div
        aria-hidden="true"
        animate={{
          scale: isActive ? 1.06 : 1,
          boxShadow: isActive ? activeGlow : restGlow,
        }}
        transition={{ duration: 0.4, ease: PREMIUM_EASE }}
        className={`absolute left-0 top-6 flex h-10 w-10 items-center justify-center rounded-full text-[15.5px] font-semibold text-white ring-1 ring-inset ring-white/15 ${dotBg}`}
      >
        <span className="relative">{step.number}</span>
        {/* Subtle inner highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent"
        />
      </motion.div>
      <JourneyStepCard
        step={step}
        isActive={isActive}
        onOpenDiscussion={onOpenDiscussion}
      />
    </motion.li>
  );
};

const IdealJourney = ({
  onOpenDiscussion,
}: {
  onOpenDiscussion?: () => void;
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 65%", "end 65%"],
  });
  const fillProgress = useSpring(scrollYProgress, {
    // Softer spring: slower follow, more damping — the rail fills calmly
    // rather than racing the scroll.
    stiffness: 50,
    damping: 28,
    mass: 0.6,
  });

  return (
    <section className="relative overflow-hidden border-b border-slate-800/60 bg-slate-950">
      <GlowOrb color="violet" size="lg" className="left-[-12%] top-[30%]" delay />
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28">
        <SectionReveal>
          <SectionHeader
            number="02"
            eyebrow="Ideal onboarding journey"
            title="A research-backed journey based on how participants actually approached messaging."
            intro={[
              "Across sessions, users followed a consistent pattern: first proving the product works, then moving toward setup, integration, and go-live.",
              "This journey reflects that progression, organised into two themes:",
            ]}
            introBullets={[
              "Theme 1 focuses on proving value.",
              "Theme 2 focuses on getting ready for production.",
            ]}
          />
        </SectionReveal>

        <div ref={railRef} className="relative mx-auto">
          {/* Background rail — full length, muted */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[19px] top-5 bottom-5 w-px bg-slate-800"
          />
          {/* Filled progress rail — grows as the user scrolls through the
              journey, anchored to the top so it extends downward.
              Toned down: muted gradient, no shadow glow. */}
          <motion.div
            aria-hidden="true"
            style={{ scaleY: fillProgress }}
            className="pointer-events-none absolute left-[19px] top-5 bottom-5 w-px origin-top bg-gradient-to-b from-indigo-400/70 via-indigo-500/60 to-violet-500/50"
          />

          <ol className="space-y-7">
            {JOURNEY.flatMap((theme, ti) => {
              const isFirstTheme = ti === 0;
              const themeAccent = isFirstTheme
                ? "text-indigo-300"
                : "text-slate-300";

              return [
                <li
                  key={`${theme.id}-label`}
                  className={`relative pl-14 ${ti > 0 ? "pt-10" : ""}`}
                >
                  {/* Theme transition divider above Theme 2 */}
                  {ti > 0 && (
                    <div
                      aria-hidden="true"
                      className="absolute left-14 right-0 top-0 flex items-center gap-3"
                    >
                      <span className="h-px flex-1 bg-gradient-to-r from-slate-800 via-slate-700 to-transparent" />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Phase shift
                      </span>
                      <span className="h-px flex-1 bg-gradient-to-l from-slate-800 via-slate-700 to-transparent" />
                    </div>
                  )}
                  {/* Theme waypoint dot */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 shadow-[0_0_0_4px_rgb(2_6_23)]"
                  >
                    <span
                      className={`h-3 w-3 rounded-full ring-1 ${
                        isFirstTheme
                          ? "bg-indigo-400 ring-indigo-300/40 shadow-[0_0_12px_rgba(129,140,248,0.7)]"
                          : "bg-violet-400 ring-violet-300/40 shadow-[0_0_12px_rgba(167,139,250,0.6)]"
                      }`}
                    />
                  </span>
                  <p
                    className={`text-[13px] font-semibold uppercase tracking-[0.18em] ${themeAccent}`}
                  >
                    {theme.label}
                  </p>
                  <p className="mt-2 max-w-2xl text-[16.5px] leading-relaxed text-slate-400">
                    {theme.subtitle}
                  </p>
                </li>,
                ...theme.steps.map((s) => (
                  <JourneyStepRow
                    key={s.id}
                    step={s}
                    isFirstTheme={isFirstTheme}
                    onOpenDiscussion={onOpenDiscussion}
                  />
                )),
              ];
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};


const Principles = ({
  onViewSource,
}: {
  onViewSource: (t: Transcript) => void;
}) => (
  <section className="relative overflow-hidden border-b border-slate-800/60 bg-slate-900">
    <GlowOrb color="indigo" size="lg" className="left-[-10%] top-[20%]" delay />
    <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28">
      <SectionReveal>
      <SectionHeader
        number="06"
        eyebrow="Design principles"
        title="Eight principles that follow from the research."
        intro="Each principle states why it matters, what it means in practice, and gives one example quote from the sessions."
      />
      </SectionReveal>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        {PRINCIPLES.map((p, i) => {
          const example = quoteById(p.exampleQuoteId);
          return (
            <div
              key={p.id}
              className={i > 0 ? "border-t border-slate-800" : ""}
            >
              <div className="flex items-baseline gap-6 px-6 pt-6 sm:px-8">
                <span className="font-serif text-xl font-light tabular-nums text-indigo-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold text-slate-50">
                  {p.title}
                </h3>
              </div>
              <div className="grid gap-6 px-6 pb-8 pt-4 pl-[calc(1.5rem+2.5rem)] pr-6 sm:grid-cols-2 lg:grid-cols-3 sm:px-8 sm:pl-[calc(2rem+2.5rem)]">
                <div>
                  <p className="text-[13.5px] font-semibold uppercase tracking-wide text-slate-400">
                    Why it matters
                  </p>
                  <p className="mt-1.5 text-[16.5px] leading-relaxed text-slate-300">
                    {p.whyItMatters}
                  </p>
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold uppercase tracking-wide text-slate-400">
                    What it means
                  </p>
                  <p className="mt-1.5 text-[16.5px] leading-relaxed text-slate-300">
                    {p.whatItMeans}
                  </p>
                </div>
                {example && (
                  <div>
                    <p className="text-[13.5px] font-semibold uppercase tracking-wide text-slate-400">
                      Example
                    </p>
                    <div className="mt-1.5">
                      <QuoteCard
                        q={example}
                        onViewSource={onViewSource}
                        compact
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const RecommendedDirection = () => (
  <section className="relative overflow-hidden border-b border-slate-800/60 bg-slate-950 text-slate-100">
    <GlowOrb color="indigo" size="xl" className="left-[-15%] top-[-10%]" />
    <div aria-hidden="true" className="absolute inset-0 grid-bg opacity-25" />
    <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28">
      <SectionReveal>
      <div className="max-w-3xl">
        <p className="text-[13.5px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
          07 · Recommended direction
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-[34px]">
          Start with value. Introduce setup when it becomes meaningful.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          Four actions, sequenced to match how users actually progress through
          the messaging journey.
        </p>
      </div>
      </SectionReveal>

      <ol className="mt-14 grid gap-5 lg:grid-cols-2">
        {DIRECTION_RECS.map((d, i) => (
          <li
            key={i}
            className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6"
          >
            <div className="flex items-start gap-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[13.5px] font-semibold text-emerald-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-lg font-semibold text-white">{d.title}</p>
                <p className="mt-1.5 text-[16.5px] leading-relaxed text-slate-300">
                  {d.detail}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14 max-w-3xl rounded-2xl border-l-4 border-indigo-400 bg-slate-800/40 p-6 sm:p-8">
        <p className="text-[13.5px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Key statement
        </p>
        <p className="mt-3 text-[16.5px] leading-relaxed text-slate-300">
          The goal is not to remove complexity.
        </p>
        <p className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          The goal is to move it to the moment when users are ready to act on
          it.
        </p>
      </div>

      {/* Small subsection: what this means for resource creation */}
      <div className="mt-12 rounded-2xl border border-slate-700 bg-slate-800/30 p-6 sm:p-8">
        <p className="text-[13.5px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
          What this means for resource creation
        </p>
        <p className="mt-3 max-w-3xl text-[16.5px] leading-relaxed text-slate-300">
          {`The research does not support a simple \u201Cauto-create vs manual\u201D decision. It supports a timing principle: resources should not be a user responsibility before value is proven.`}
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {RESOURCE_STAGES.map((s) => (
            <li
              key={s.stage}
              className="rounded-xl border border-slate-700 bg-slate-900/60 p-4"
            >
              <p className="text-[13.5px] font-semibold uppercase tracking-wide text-indigo-300">
                {s.stage}
              </p>
              <p className="mt-1.5 text-[16.5px] leading-relaxed text-slate-200">
                {s.rule}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 max-w-3xl">
        <p className="text-3xl font-semibold tracking-tight text-white sm:text-[32px]">
          Proof first. Setup second.
        </p>
      </div>
    </div>
  </section>
);

const DataTransparency = ({
  onOpen,
}: {
  onOpen: (t: Transcript) => void;
}) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/60 bg-slate-900">
      <GlowOrb color="indigo" size="md" className="right-[-5%] top-[30%]" delay />
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28">
        <SectionReveal>
        <SectionHeader
          number="08"
          eyebrow="Data transparency"
          title="What this report is based on."
        />
        </SectionReveal>

        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <ul className="space-y-2.5 rounded-2xl border border-slate-800 bg-slate-950 p-6">
            {DATA_BULLETS.map((b) => (
              <li key={b} className="flex gap-3 text-[16.5px] text-slate-200">
                <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="text-[16.5px] leading-relaxed text-slate-400">
            Every quote on this site comes from a real session transcript. The
            table below lists each session with a link to open its summary and
            indexed quotes. Swedish sessions are presented in English
            translation; the original wording is available on every quote card.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <table className="w-full border-collapse text-[15.5px]">
            <thead>
              <tr className="bg-slate-950 text-left text-[13.5px] font-semibold uppercase tracking-wide text-slate-400">
                <th className="border-b border-slate-800 px-4 py-3">
                  Participant
                </th>
                <th className="border-b border-slate-800 px-4 py-3">Persona</th>
                <th className="border-b border-slate-800 px-4 py-3">
                  Audience
                </th>
                <th className="border-b border-slate-800 px-4 py-3">Concept</th>
                <th className="border-b border-slate-800 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {transcripts.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-slate-800/60 hover:bg-slate-800/60"
                >
                  <td className="px-4 py-3 font-semibold text-slate-50">
                    {t.participant}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{t.persona}</td>
                  <td className="px-4 py-3">
                    <AudienceTag audience={t.audience} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {t.concepts.map((c) => (
                        <ConceptTag key={c} concept={c} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => onOpen(t)}
                        className="inline-flex items-center gap-1 text-[13.5px] font-medium text-indigo-300 hover:text-indigo-200"
                      >
                        Read summary <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

interface NavChild {
  id: string;
  label: string;
  number: number;
  /** Optional small tag (e.g. "Developer") rendered next to the label. */
  tag?: string;
}

interface NavItem {
  id: string;
  label: string;
  /** Optional sub-items rendered under an expand/collapse toggle. */
  children?: NavChild[];
}

// Build journey sub-items dynamically from the JOURNEY data so the TOC stays
// in sync if steps are added, removed, or renumbered. Strip parentheticals
// from step titles for the TOC ("Explore the API (developers)" → "Explore the
// API") and surface the step's `tag` as a small chip instead.
const JOURNEY_CHILDREN: NavChild[] = JOURNEY.flatMap((theme) =>
  theme.steps.map((step) => {
    // Drop any "(...)" suffix from the displayed label.
    const label = step.title.replace(/\s*\([^)]*\)\s*$/, "").trim();
    // If the step has a tag like "Developer step", shorten it to just
    // "Developer" for a tighter TOC chip.
    const tag = step.tag
      ? step.tag.replace(/\s*step\s*$/i, "").trim()
      : undefined;
    return {
      id: `journey-${step.id}`,
      label,
      number: step.number,
      tag,
    };
  }),
);

const NAV_ITEMS: NavItem[] = [
  { id: "summary", label: "Summary" },
  { id: "journey", label: "Journey", children: JOURNEY_CHILDREN },
  { id: "resource-discussion", label: "Resource discussion" },
  { id: "principles", label: "Principles" },
  { id: "direction", label: "Direction" },
  { id: "data", label: "Data" },
  { id: "analysis", label: "Analysis" },
];

// Flat list of every id (top-level + children) for scroll-spy.
const ALL_NAV_IDS: string[] = NAV_ITEMS.flatMap((n) => [
  n.id,
  ...(n.children?.map((c) => c.id) ?? []),
]);

const useScrollProgress = (): number => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
};

// Slim mobile-only top bar — minimal brand + scroll progress, no nav links.
const MobileTopBar = () => {
  const progress = useScrollProgress();
  return (
    <div className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center px-6 py-3">
        <a
          href="#top"
          className="group flex items-center gap-2 text-[15.5px] font-semibold tracking-tight text-slate-50"
        >
          <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-400 to-violet-500 shadow-[0_0_20px_-5px_rgba(129,140,248,0.7)]">
            <span className="h-2 w-2 rounded-full bg-white/90" />
          </span>
          <span>Messaging onboarding</span>
        </a>
      </div>
      <div className="relative h-px w-full bg-transparent">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400"
          style={{
            width: `${progress * 100}%`,
            boxShadow: "0 0 12px rgba(129,140,248,0.6)",
          }}
        />
      </div>
    </div>
  );
};

// Single TOC row. Items with children render an expand/collapse toggle and
// reveal child links indented below. The expand state defaults to "open if a
// child is currently active," so deep-linking to a step keeps context.
const SideNavRow = ({
  item,
  index,
  activeId,
}: {
  item: NavItem;
  index: number;
  activeId: string;
}) => {
  const hasChildren = !!(item.children && item.children.length > 0);
  const childActive = hasChildren
    ? item.children!.some((c) => c.id === activeId)
    : false;
  const isActive = activeId === item.id || childActive;
  const [open, setOpen] = useState(childActive);
  // Auto-open this group when a child becomes active via scroll.
  useEffect(() => {
    if (childActive) setOpen(true);
  }, [childActive]);

  return (
    <div>
      <div
        className={`group relative flex items-center gap-2 rounded-md transition ${
          isActive ? "text-slate-50" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        {isActive && (
          <motion.span
            layoutId="side-nav-active"
            className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
        )}
        <a
          href={`#${item.id}`}
          className="flex flex-1 items-center gap-3 py-2 pl-4 pr-1"
        >
          <span className="font-mono text-[12px] tabular-nums text-slate-500">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="relative">{item.label}</span>
        </a>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Collapse steps" : "Expand steps"}
            className="mr-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-500 transition hover:text-slate-200"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                open ? "rotate-0" : "-rotate-90"
              }`}
            />
          </button>
        )}
      </div>
      {hasChildren && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="children"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: PREMIUM_EASE }}
              className="overflow-hidden"
            >
              <ul className="ml-4 mt-0.5 mb-1 flex flex-col gap-0.5 border-l border-slate-800/80 pl-3 text-[13px]">
                {item.children!.map((c) => {
                  const cActive = activeId === c.id;
                  return (
                    <li key={c.id}>
                      <a
                        href={`#${c.id}`}
                        className={`relative flex items-start gap-2.5 rounded-md py-1.5 pr-2 pl-2 transition ${
                          cActive
                            ? "text-slate-100"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        <span className="mt-px font-mono text-[10.5px] tabular-nums text-slate-600">
                          {String(c.number).padStart(2, "0")}
                        </span>
                        <span className="flex flex-wrap items-center gap-1.5 leading-snug">
                          <span>{c.label}</span>
                          {c.tag && (
                            <span className="inline-flex items-center rounded border border-cyan-500/25 bg-cyan-500/[0.06] px-1.5 py-px text-[9.5px] font-semibold uppercase tracking-[0.12em] text-cyan-300">
                              {c.tag}
                            </span>
                          )}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

// Left-rail Table of Contents column. Lives in its own grid/flex column
// alongside the main page content. Inside the column, the inner content is
// sticky so it stays in view while scrolling. Hidden on screens below lg.
const SideNav = () => {
  const activeId = useActiveSection(ALL_NAV_IDS);
  const progress = useScrollProgress();
  return (
    <aside
      aria-label="Table of contents"
      className="hidden w-72 shrink-0 border-r border-slate-800/60 bg-slate-950/60 lg:block"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col px-6 py-8">
        {/* Brand */}
        <a
          href="#top"
          className="group flex items-center gap-2 text-[15.5px] font-semibold tracking-tight text-slate-50"
        >
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-400 to-violet-500 shadow-[0_0_22px_-4px_rgba(129,140,248,0.75)]">
            <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
          </span>
          <span className="leading-tight">
            <span className="block">Messaging</span>
            <span className="block text-[12.5px] font-medium text-slate-400">
              Research findings
            </span>
          </span>
        </a>

        {/* TOC */}
        <p className="mt-12 text-[12.5px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Table of contents
        </p>
        <nav className="relative mt-3 flex flex-col gap-0.5 overflow-y-auto pr-1 text-[14.5px]">
          {NAV_ITEMS.map((n, i) => (
            <SideNavRow key={n.id} item={n} index={i} activeId={activeId} />
          ))}
        </nav>

        {/* Scroll progress */}
        <div className="mt-auto pt-8">
          <div className="flex items-center justify-between text-[11.5px] font-mono tabular-nums text-slate-500">
            <span className="uppercase tracking-[0.18em]">Progress</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="relative mt-2 h-0.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400"
              style={{
                width: `${progress * 100}%`,
                boxShadow: "0 0 10px rgba(129,140,248,0.6)",
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

const ResearchAnalysis = () => (
  <section className="relative overflow-hidden border-b border-slate-800/60 bg-slate-950">
    <GlowOrb color="indigo" size="lg" className="right-[-12%] top-[60%]" delay />
    <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28">
      <SectionReveal>
        <SectionHeader
          number="09"
          eyebrow="Research analysis"
          title="The full structured analysis behind the report."
          intro="Every insight on this site is grounded in this analysis. It synthesises observed behaviour, friction, opportunities, and design principles across all 14 sessions — and proposes a natural onboarding flow based on what users actually did."
        />
      </SectionReveal>
      <SectionReveal>
        <ResearchAnalysisSection />
      </SectionReveal>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-900">
    <div className="mx-auto max-w-7xl px-6 py-12 text-[15.5px] text-slate-400">
      <p>
        Based on {transcripts.length} usability test sessions. Quotes used as
        supporting evidence. Swedish sessions translated to English with
        originals preserved.
      </p>
    </div>
  </footer>
);

// =================================================================
// App
// =================================================================

export default function App() {
  const [openTranscript, setOpenTranscript] = useState<Transcript | null>(null);
  const [discussionOpen, setDiscussionOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 lg:flex">
      <SideNav />
      <div className="min-w-0 flex-1">
        <MobileTopBar />
        <Hero />
        <div id="summary">
          <ExecutiveSummary />
        </div>
        <div id="journey">
          <IdealJourney
            onOpenDiscussion={() => setDiscussionOpen(true)}
          />
        </div>
        <div id="resource-discussion">
          <ResourceCreationSection />
        </div>
        <div id="principles">
          <Principles onViewSource={setOpenTranscript} />
        </div>
        <div id="direction">
          <RecommendedDirection />
        </div>
        <div id="data">
          <DataTransparency onOpen={setOpenTranscript} />
        </div>
        <div id="analysis">
          <ResearchAnalysis />
        </div>
        <Footer />
      </div>

      <TranscriptDialog
        transcript={openTranscript}
        onClose={() => setOpenTranscript(null)}
        onNavigate={(t) => setOpenTranscript(t)}
      />
      <ResourceCreationDialog
        open={discussionOpen}
        onClose={() => setDiscussionOpen(false)}
      />
    </div>
  );
}
