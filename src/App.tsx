import {
  Fragment,
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
  Info,
  Sparkles,
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
      subValue: "8 internal · 6 external",
    },
    {
      label: "Prototypes tested",
      value: "RCS Getting started (1.0 & 2.0) · Onboarding app",
      hint:
        "Two iterations of the RCS getting started experience, tested with users alongside the onboarding app to validate the onboarding journey from first test to setup.",
    },
  ] as {
    label: string;
    value: string;
    subValue?: string;
    hint?: string;
  }[],
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

/** A single numbered insight inside the new structured "Why this step matters"
 *  layout. Each insight has a bold sub-headline, a short description, and
 *  either supporting quotes (referenced into `step.whyQuotes`) or a small
 *  bullet list (used for things like the "system map alongside the calls"). */
interface JourneyWhyInsight {
  title: string;
  description: string;
  /** Indices into the step's `whyQuotes` array. */
  quoteIndices?: number[];
  /** Used for insights that need a bulleted list instead of (or alongside) quotes. */
  bullets?: { text: string; meta?: string }[];
  /** Extra prose paragraphs rendered after the quotes/bullets — used when an
   *  insight needs a closing reflection following its supporting evidence. */
  closing?: string[];
}

/** Highlighted "tracks" block that sits between the Why-this-step lead and
 *  the numbered insights — used to call out a structural distinction the
 *  reader needs before drilling into specific insights. */
interface JourneyWhyTracks {
  title: string;
  description: string;
  tracks: { label: string; description: string; tone?: "indigo" | "violet" | "amber" }[];
  closing?: string;
}

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
  /** New structured layout for "Why this step matters". When `whyHeadline`
   *  + `whyInsights` are present they take precedence over `whyGroups`. */
  whyHeadline?: string;
  whyLead?: string;
  whyInsights?: JourneyWhyInsight[];
  /** Closing observation rendered as a callout under the insights. */
  whyClosing?: string;
  /** Optional "tracks" block rendered between the lead and the numbered
   *  insights — used when an insight section needs a structural framing
   *  the reader should understand before drilling into specifics. */
  whyTracks?: JourneyWhyTracks;
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
              "I would expect some kind of result in my own cell phone. So not really having to set up, but to test it out.",
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
          {
            title: "New users don't recognise access keys",
            participant: "P5",
            persona: "Developer",
            short:
              "I really don't know what would be the access key or the key secrets here.",
            long:
              "Because I'm new, I really don't know what would be the access key or the key secrets here. And so, like, really sending this message without this, is it gonna work? I don't know. Either it should not need the access key and key secrets for the test\u2026 it should be in the other steps. Now if you wanted to have a real agent, now you need to access this key.",
          },
          {
            title: "Test key or production key?",
            participant: "P6",
            persona: "Developer",
            short:
              "Should this be\u2026 the test key\u2026 or something I reuse later on?",
            long:
              "I think, the only thing I think here is, should this be, like, the test key that I won't just disregard because this feels like something that should be in a list somewhere. So if I create number two here, it should be listed. Let's say, I'm IKEA. Should I actually create, like, a new access key that is called IKEA that I reuse later on? Or should I just have a dummy one, like a test IKEA one?",
          },
        ],
        whyHeadline:
          "Users wants to send a message — not to configure or set up anything.",
        whyLead:
          "From the very first interaction, developers and non-developers reach for the same thing: a working message. They are not trying to configure the system; they are trying to validate that it works.",
        whyInsights: [
          {
            title: "They want to send a test message",
            description:
              "Sending a message is consistently the first action attempted across sessions, regardless of role.",
            quoteIndices: [0, 1],
          },
          {
            title: "Both personas share the same initial need",
            description:
              "At the start, everyone is trying to do the same thing: send a test message. Motivation differs by role, but the first move is identical.",
          },
          {
            title: "The goal is to validate, not configure",
            description:
              "Users aren’t trying to understand the architecture in detail — they’re trying to confirm it works.",
            quoteIndices: [2],
          },
          {
            title: "Early setup creates friction",
            description:
              "Requiring access keys before showing value breaks the expectation of a quick test.",
            bullets: [
              { text: "Users don’t understand why it’s needed." },
              {
                text:
                  "Developers unsure if they’re creating something temporary or production-level.",
              },
            ],
            quoteIndices: [3, 4, 5],
          },
        ],
        whyClosing:
          "In both cases, users want to confirm value before investing time in APIs or setup. If the first interaction lands behind setup, the product loses people before it has shown what it can do.",
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
        whyHeadline:
          "Sending isn’t proof — seeing what happened is.",
        whyLead:
          "After a message is sent, users immediately look for confirmation and insight into what the system actually did. Status, payloads, events, and replies are how they decide whether to trust what they just saw.",
        whyInsights: [
          {
            title: "They inspect message logs and details",
            description:
              "Logs are the first thing users look for after sending — message ID, channel, recipient, queued and delivered timestamps.",
            quoteIndices: [0],
          },
          {
            title: "They explore deeper technical details when available",
            description:
              "Once basics are confirmed, developers dig into payload to understand the wire format and what the API actually sent.",
            quoteIndices: [1],
          },
          {
            title: "They interpret system behaviour through events",
            description:
              "Queued, delivered, replied — the lifecycle is the story of what the system did, not just whether it worked.",
            quoteIndices: [2],
          },
          {
            title: "They expect to understand incoming behaviour too",
            description:
              "Sending isn’t enough. Replies and incoming events tell users the channel is real, not one-way.",
            quoteIndices: [3],
          },
        ],
        whyClosing:
          "This step is not passive. Users are actively trying to understand how the system behaves — and feedback is what turns a single test into trust.",
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
          "See how Conversation API app, sender (RCS agent), and recipient number relate",
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
        whyHeadline:
          "Developers want to try it themselves — but with the friction taken out",
        whyLead:
          "After validating that messaging works, they shift from “does this work?” to “how does this work, and how do I drive it?” — and they want to find out by running the API, not reading about it.",
        whyInsights: [
          {
            title: "They reach for cURL first",
            description:
              "A terminal is the fastest path to “is this real?” — faster than reading docs, faster than building anything.",
            quoteIndices: [0],
          },
          {
            title: "They want to run requests in place",
            description:
              "Sending the request from inside the dashboard collapses the loop — no copy-paste, no context switch.",
            quoteIndices: [1],
          },
          {
            title: "They want a complete API map, not a tutorial",
            description:
              "A list of every endpoint, what it does, and what every parameter means. Reference, not narrative.",
            quoteIndices: [2],
          },
          {
            title: "They expect prefilled, ready-to-run tooling",
            description:
              "Postman collections, prefilled cURL, drop-in SDKs. The bar isn’t “documented” — it’s “downloadable and working in 30 seconds.”",
            quoteIndices: [3, 4],
          },
          {
            title: "They want the system map alongside the calls",
            description:
              "Knowing the endpoint isn’t enough — they need the relationships between the moving parts.",
            bullets: [
              { text: "How messages are sent", meta: "(Conversation API)" },
              { text: "What represents the sender", meta: "(RCS agent)" },
              { text: "How incoming messages are received", meta: "(webhooks)" },
            ],
          },
        ],
        whyClosing:
          "At this stage, developers are motivated to try things themselves — but still expect a low-effort, low-risk environment. Friction here is what makes them bounce.",
        valueProps: [
          {
            title: "Enables hands-on API testing",
            description:
              "Developers can send real requests without setup overhead.",
          },
          {
            title: "Teaches how to build a request",
            description:
              "Shows how Conversation API requests are structured and how to modify them.",
          },
          {
            title: "Makes message types tangible",
            description:
              "Previews different message formats and how they render in practice.",
          },
          {
            title: "Explains system architecture",
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
          {
            title: "Trying it teaches the concepts",
            participant: "P14",
            persona: "Developer",
            short:
              "It educates me a little bit before I actually start working on a product.",
            long:
              "I really like this view. I know that as a dev, I am going to need this bit eventually, but I like this view because of the combined \u2014 I can see the code, I can see what I need to do, and I can also see, just visually, what the differences are. It educates me a little bit before I actually start working on a product, which is very nice.",
          },
        ],
        whyHeadline:
          "Users shift from exploring the product to exploring their own use.",
        whyLead:
          "Once the test message proves the product is real, users move past the demo. They want a channel under their brand, with their credentials, that they can actually send from \u2014 and they want it before integrating anything deeper.",
        whyInsights: [
          {
            title: "They want to graduate from test to real",
            description:
              "Test agents stop being useful once users believe the platform works. They start looking for the path to a real one.",
            quoteIndices: [0],
          },
          {
            title: "Their target is real customers, not their own phone",
            description:
              "They picture sending the same message to thousands of customers \u2014 not running another test.",
            quoteIndices: [1],
          },
          {
            title: "Both personas converge on the same need",
            description:
              "What \u201ctheir own channel\u201d means depends on the role, but the underlying ask is identical.",
            bullets: [
              {
                text: "Developers want",
                meta: "their own credentials, their own agent, control over integration.",
              },
              {
                text: "Business users want",
                meta: "their brand (name, logo, content), control over how they appear to customers.",
              },
            ],
            closing: [
              "Both converge on the same outcome: a channel they own, configured for their business.",
            ],
          },
          {
            title: "Concepts become clear through use",
            description:
              "Terms like \u201cRCS Agent\u201d stop being abstract once users interact with the product. They don\u2019t learn the system upfront \u2014 they understand it by trying it.",
            quoteIndices: [2],
            closing: [
              "Through testing, users build a mental model of how things connect \u2014 Conversation API, agents, messages \u2014 all become clearer in context.",
              "This closes the initial knowledge gap and makes the next step feel obvious.",
              "At this point, setup is no longer confusing \u2014 but it must still be simple. Users are still exploring, so creating a channel should feel fast and lightweight.",
            ],
          },
        ],
        valueProps: [
          {
            title: "Bridges test to real",
            description:
              "Users move from a demo to something they can actually use.",
          },
          {
            title: "Makes concepts understandable",
            description:
              "Abstract terms like \u201cRCS Agent\u201d now have context.",
          },
          {
            title: "Establishes identity",
            description:
              "This is where the brand becomes real in messages.",
          },
          {
            title: "Introduces setup at the right time",
            description:
              "Credentials and configuration now feel necessary, not blocking.",
          },
          {
            title: "Keeps momentum",
            description:
              "Users continue testing, now with their own setup.",
          },
          {
            title: "Supports lightweight creation",
            description:
              "Channel creation must stay simple \u2014 users are still exploring.",
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
        whyHeadline:
          "After setup, the question changes from “does it work?” to “does mine work?”",
        whyLead:
          "Once users have created a channel, they’ve invested something — and they need to confirm it works before doing anything else. The natural next question is “does my setup actually work?” and it needs an answer immediately, not after another setup step.",
        whyInsights: [
          {
            title: "Confirmation unlocks confidence",
            description:
              "Once users see their setup work, they relax and move on. Until then, the flow stalls right after creation.",
          },
          {
            title: "They want to test from their own setup, not a generic one",
            description:
              "Sending with their own brand to their own number is what makes the agent feel like theirs.",
            quoteIndices: [1],
          },
          {
            title: "The intent has shifted",
            description:
              "What looks like the same action — Send test message — is now answering a different question.",
            bullets: [
              { text: "Before", meta: "→ Does the product work?" },
              { text: "Now", meta: "→ Does my setup work?" },
            ],
          },
          {
            title: "Without immediate validation, the flow breaks",
            description:
              "If users cannot confirm their setup right after creation, momentum collapses.",
            bullets: [
              { text: "Validation is delayed or blocked." },
              { text: "The flow breaks right after creation." },
              { text: "Confidence drops instead of building." },
            ],
          },
          {
            title: "This is the second value moment",
            description:
              "It validates, in one action: sender identity, message appearance, and delivery behaviour.",
            bullets: [
              { text: "First", meta: "→ “Messaging works.”" },
              { text: "Second", meta: "→ “My setup works.”" },
            ],
          },
        ],
        whyClosing:
          "Without this moment, users are pushed forward without confidence. Instead of confidence → momentum → progress, we get friction → uncertainty → drop-off. Enabling validation here is what turns setup into trust.",
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
    ],
  },
  {
    id: "production",
    label: "Theme 2 \u00b7 Get ready for production",
    subtitle:
      "Users have validated value. Now they build their own setup and go live.",
    steps: [
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
        whyHeadline:
          "Developers stop exploring and start integrating.",
        whyLead:
          "After validating their setup, developers want to use their own credentials, understand how components connect, and bring messaging into their stack on their terms. The goal is no longer “does this work?” but “how do I make this part of my system?”",
        whyInsights: [
          {
            title: "An app per integration, with keys and API access inside it",
            description:
              "Developers expect an app to represent their system — distinct, owned, and the way they separate integrations.",
            quoteIndices: [0],
          },
          {
            title: "Once it works, they integrate it into any system",
            description:
              "After they trust the platform, the API becomes the obvious next step.",
            quoteIndices: [1],
          },
          {
            title: "They expect to choose the name, not be dropped into one",
            description:
              "Auto-creation without context breaks ownership before integration even starts.",
            quoteIndices: [2],
          },
          {
            title: "They look for system relationships, not features",
            description:
              "The shift in behaviour is consistent across sessions — developers work outwards from the app, not inwards from a button.",
            bullets: [
              { text: "How the app connects to the agent" },
              { text: "API structure and resources" },
              { text: "Webhook configuration and integrations they own" },
            ],
          },
        ],
        whyClosing:
          "If the app is auto-created and connected silently, this breaks ownership, clarity, and the developer’s understanding of how the system fits together. The app must be introduced when developers are ready to own it.",
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
        title: "Get compliant",
        description: [
          "User completes the required business and messaging details, selects countries, and submits the agent for approval.",
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
          {
            title: "Recognising compliance from the form itself",
            participant: "P14",
            persona: "Developer",
            short:
              "Once I got to the use case information, I started to get a sense that this was either regulatory compliance…",
            long:
              "I do see, at least initially, when we started talking about, which one was it? Oh, no — it was the use case. Once I got to the use case information, I started to get a sense that this was either regulatory compliance or I'm checking a box for something. What might trip me up, since I have the benefit of making things up on the spot, is if I didn't have that information. If I'm doing an exploratory analysis of Cinch, for example.",
          },
        ],
        whyHeadline:
          "When users reach compliance, they need guidance to move forward.",
        whyLead:
          "Compliance was not the primary focus of the research — but when users reached it, a clear pattern emerged. Users were often unsure what information was required, how to answer certain questions, or what would happen after submission. This step is regulatory compliance, not product setup, and it follows a different logic than the rest of onboarding.",
        whyTracks: {
          title: "Two parallel tracks",
          description:
            "After the first successful test, users move in two directions:",
          tracks: [
            {
              label: "Integration (developers)",
              description:
                "Continue building, testing, and integrating with the API.",
              tone: "indigo",
            },
            {
              label: "Regulatory compliance",
              description:
                "Provide required business details and submit for approval.",
              tone: "amber",
            },
          ],
          closing:
            "These tracks are independent — but this is not always clear in the current experience.",
        },
        whyInsights: [
          {
            title: "Compliance feels like a blocker — but shouldn’t be",
            description:
              "Many developers assume they must complete this step before continuing, even when their goal is to integrate.",
            quoteIndices: [3],
            closing: [
              "In reality, compliance is only required to send to real users — not to continue building or testing.",
            ],
          },
          {
            title: "Who fills this out depends on the company",
            description:
              "Responsibility for compliance varies:",
            bullets: [
              {
                text: "Startups / solo developers",
                meta:
                  "— the developer often owns everything, including compliance, and must fill it out themselves.",
              },
              {
                text: "Larger organizations",
                meta:
                  "— the developer relies on legal, marketing, or business teams for the required information.",
              },
            ],
            closing: [
              "This means the experience must support both self-serve completion and handoff or collaboration.",
            ],
          },
          {
            title: "Users can complete it — but don’t always have the information",
            description:
              "Even when developers are responsible, they don’t always have the answers readily available. They may:",
            bullets: [
              { text: "make assumptions to move forward, or" },
              { text: "pause to gather input internally." },
            ],
          },
          {
            title: "Guidance in the UI reduces friction",
            description:
              "When forms include clear explanations, examples, or context, users feel more confident progressing. Users respond positively to:",
            bullets: [
              { text: "knowing why information is required" },
              { text: "seeing what good answers look like" },
              { text: "getting inline guidance instead of external docs" },
            ],
            closing: [
              "This is especially important for solo developers who don’t have internal support.",
            ],
          },
          {
            title: "Forms still feel tedious",
            description:
              "Even with guidance, the length and tone of the compliance form can erode momentum.",
            quoteIndices: [1],
          },
          {
            title: "Users need clarity to proceed",
            description:
              "Users don’t need to understand every field — but they need to understand:",
            bullets: [
              { text: "this is a regulatory requirement" },
              { text: "it does not block integration" },
              { text: "it can be completed later" },
            ],
            closing: [
              "Without that clarity, the flow feels linear and blocking. With it, users can confidently continue on their intended path.",
            ],
          },
        ],
        valueProps: [
          {
            title: "Enables production usage",
            description:
              "Approval is required before messages can be sent to real users.",
          },
          {
            title: "Clarifies what is needed",
            description:
              "Users need to understand what to fill in, what is required, and what happens next.",
          },
          {
            title: "Supports go-live confidence",
            description:
              "Clear guidance reduces uncertainty and helps users move from setup to real-world use.",
          },
        ],
        keyInsight: {
          headline:
            "Compliance is a necessary gate, but it should not dominate onboarding. It needs to be clearly separated from testing and introduced when users are ready to go live.",
        },
        keyTakeaway: {
          headline:
            "This is where the agent becomes eligible for real-world use.",
          subtext:
            "The experience should make the approval step feel clear, guided, and manageable.",
        },
      },
    ],
  },
];





interface Principle {
  id: string;
  title: string;
  /** The principle's lead \u2014 a statement of what the principle says. */
  lead: string;
  /** How to apply the principle in design. */
  implication: string;
  /** A short, attributed observation from the research. */
  evidence: string;
}

const PRINCIPLES: Principle[] = [
  {
    id: "pr1",
    title: "Lead with proof, not setup",
    lead:
      "Users do not start by trying to understand the architecture. They start by trying to prove that messaging works.",
    implication:
      "Let users send a message before requiring apps, keys, webhooks, or production setup.",
    evidence:
      "P1 said sending a message to their phone is \u201cusually the first thing I try to achieve,\u201d and that doing it from the application is preferable.",
  },
  {
    id: "pr2",
    title: "Make the first value moment immediate",
    lead:
      "The first successful message is the moment users decide the product is real.",
    implication:
      "The first test should feel fast, safe, and low effort. It should not require long-lived decisions.",
    evidence:
      "P1 said that once they have sent a message, they can \u201crelax\u201d and move on to API keys and integration.",
  },
  {
    id: "pr3",
    title: "Show the result, not just the action",
    lead:
      "A sent message is not enough. Users need to see what happened.",
    implication:
      "After sending, show delivery status, preview, logs, payload, and events close to the action.",
    evidence:
      "P12 reacted positively to queued, delivered, and payload feedback, then naturally moved toward testing the API next.",
  },
  {
    id: "pr4",
    title: "Let users learn by doing",
    lead:
      "Users understand messaging through interaction, not explanation.",
    implication:
      "Use editable examples, live previews, runnable requests, and message logs to teach concepts through use.",
    evidence:
      "P14 said the visual preview helped answer what the different message types meant and educated them before they started building.",
  },
  {
    id: "pr5",
    title: "Separate simple testing from developer exploration",
    lead:
      "The same journey must support both non-technical validation and developer depth.",
    implication:
      "Start with a simple UI test. Then offer code, API playground, payloads, Postman, and webhooks as the developer path.",
    evidence:
      "P12 said the simple visual page prevents non-API users from being overloaded, while developers can still go directly to code.",
  },
  {
    id: "pr6",
    title: "Introduce resources when users have intent",
    lead:
      "Apps, agents, keys, and webhooks are meaningful when users are ready to integrate or go live. Before that, they create confusion.",
    implication:
      "Do not make user-owned app creation a prerequisite for validation. Introduce it when users move from testing to integration.",
    evidence:
      "P12 said they did not want an app created for them without context, but once they created it themselves, webhooks and setup made sense.",
  },
  {
    id: "pr7",
    title: "Keep ownership explicit at integration",
    lead:
      "Developers want control over the resources that represent their system.",
    implication:
      "When users create or connect an app, make the purpose clear: app equals sending layer, agent equals sender identity.",
    evidence:
      "P1 described an app as something they expect to use per integration, with keys and API access inside it.",
  },
  {
    id: "pr8",
    title: "Guide production, do not mix it with testing",
    lead:
      "Compliance and approval are necessary, but they belong after users have validated value.",
    implication:
      "Separate test mode from go-live. Make submit for approval explicit, explain what is required, and clarify what users can do before approval.",
    evidence:
      "P14 completed go-live steps but initially missed that they still needed to submit for approval, creating confusion about whether the setup was ready.",
  },
];


const DATA_BULLETS: string[] = [
  "14 sessions",
  "Developers and non-developers",
  "RCS Getting started (1.0 & 2.0) · Onboarding app testing",
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
      className={`pointer-events-none absolute hidden rounded-full blur-[120px] sm:block ${colorClass} ${sizeClass} ${anim} ${className}`}
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
        <span className="font-serif text-base font-light text-indigo-400 tabular-nums">
          {number}
        </span>
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-3 max-w-3xl text-base font-semibold tracking-tight text-slate-50 sm:text-[23px]">
        {title}
      </h2>
      {introParagraphs.length > 0 && (
        <div className="mt-4 max-w-3xl space-y-3 text-base leading-relaxed text-slate-400">
          {introParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      {introBullets && introBullets.length > 0 && (
        <ul className="mt-3 max-w-3xl space-y-1.5 text-base leading-relaxed text-slate-300">
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
    <span className="text-[11.5px] text-slate-400">{persona}</span>
  ) : null;

const ConceptTag = ({ concept }: { concept: string }) => (
  <span className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-[11.5px] font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/40">
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
  const text = size === "md" ? "text-[11px]" : "text-[10.5px]";
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
        className={`text-slate-50 ${compact ? "text-[14px]" : "text-[15px]"} font-medium italic leading-relaxed`}
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
            className="inline-flex items-center gap-1 text-[11.5px] font-medium uppercase tracking-wide text-slate-400 hover:text-indigo-300"
          >
            Translated from {q.originalLanguage ?? "original"}
            <ChevronDown
              className={`h-3 w-3 transition ${showOriginal ? "rotate-180" : ""}`}
            />
          </button>
          {showOriginal && (
            <p className="mt-2 rounded-lg bg-slate-950 p-3 text-[12.5px] italic leading-relaxed text-slate-400">
              {q.originalQuote}
            </p>
          )}
        </div>
      )}

      <figcaption
        className={`mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 ${compact ? "text-[11.5px]" : "text-[13px]"}`}
      >
        <span className="font-semibold text-slate-50">{q.participant}</span>
        <PersonaLabel persona={q.persona} />
        {t?.audience && <AudienceTag audience={t.audience} />}
        <ConceptTag concept={q.concept} />
        {q.timestamp && (
          <span className="font-mono text-[11.5px] text-slate-400">
            {q.timestamp}
          </span>
        )}
        {t && onViewSource && (
          <button
            type="button"
            onClick={() => onViewSource(t)}
            className="ml-auto inline-flex items-center gap-1 text-[11.5px] font-medium text-slate-400 hover:text-indigo-300"
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









// --- Transcript drawer ---------------------------------------------

const ConceptBadge = ({ concept }: { concept: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-indigo-200">
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
      <span className={`text-[14.5px] leading-relaxed ${textClass}`}>{text}</span>
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
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
        User goal
      </p>
      <p className="mt-3 text-[16px] leading-relaxed text-slate-100">
        {analysis.userGoal}
      </p>
      {analysis.userGoalContext && (
        <div className="mt-5 space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5 sm:p-6">
          {analysis.userGoalContext.intro && (
            <p className="text-[14.5px] leading-relaxed text-slate-300">
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
            <p className="text-[14.5px] leading-relaxed text-slate-300">
              {analysis.userGoalContext.closing}
            </p>
          )}
          {analysis.userGoalContext.quote && (
            <blockquote className="border-l-2 border-indigo-400/60 pl-4 text-[15px] italic leading-relaxed text-slate-200">
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
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
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
                <p className="mt-2 text-[13.5px] italic leading-relaxed text-slate-400">
                  {c.conceptSubtitle}
                </p>
              )}
              {c.mainReaction && (
                <div className="mt-3 rounded-lg border border-slate-700/70 bg-slate-900/60 px-4 py-3">
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Main reaction
                  </p>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-slate-200">
                    {c.mainReaction}
                  </p>
                  {c.mainReactionQuote && (
                    <blockquote className="mt-3 border-l-2 border-indigo-400/60 pl-4 text-[14px] italic leading-relaxed text-slate-300">
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
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
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
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
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
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                  Key strengths
                </p>
                <ol className="mt-3 space-y-4">
                  {c.keyStrengths.map((s, si) => (
                    <li
                      key={si}
                      className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="font-serif text-[17px] tabular-nums text-emerald-300">
                          {si + 1}.
                        </span>
                        <h4 className="text-[16px] font-semibold leading-snug text-slate-50">
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
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                  Main issues
                </p>
                <ol className="mt-3 space-y-5">
                  {c.issues.map((iss, ii) => (
                    <li
                      key={ii}
                      className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="font-serif text-[17px] tabular-nums text-amber-300">
                          {ii + 1}.
                        </span>
                        <h4 className="text-[16px] font-semibold leading-snug text-slate-50">
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
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
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
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-violet-300">
            Cross-cutting insights
          </p>
          <ol className="mt-4 space-y-4">
            {analysis.crossCuttingInsights.map((ins, ii) => (
              <li
                key={ii}
                className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-6"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-[17px] tabular-nums text-violet-300">
                    {ii + 1}.
                  </span>
                  <h4 className="text-[16px] font-semibold leading-snug text-slate-50">
                    {ins.title}
                  </h4>
                </div>
                {ins.body && (
                  <p className="mt-3 ml-7 text-[14.5px] italic leading-relaxed text-slate-300">
                    {ins.body}
                  </p>
                )}
                {ins.bullets && ins.bullets.length > 0 && (
                  <div className="mt-3 ml-7">
                    {ins.bulletsIntro && (
                      <p className="mb-2 text-[13.5px] leading-relaxed text-slate-400">
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
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-violet-300">
          Cross-cutting confusion
        </p>
        <h3 className="mt-2 text-[18px] font-semibold leading-snug text-slate-50 sm:text-[16px]">
          {analysis.crossCutting.title}
        </h3>
        {analysis.crossCutting.intro && (
          <p className="mt-4 text-[14.5px] leading-relaxed text-slate-300">
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
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
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
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Behavioural pattern
      </p>
      <p className="mt-2 text-[14.5px] leading-relaxed text-slate-400">
        The user consistently followed this flow:
      </p>
      <ol className="mt-3 space-y-2">
        {analysis.behavioralPattern.map((step, si) => (
          <li
            key={si}
            className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3"
          >
            <span className="font-serif text-[15.5px] tabular-nums text-indigo-300">
              {String(si + 1).padStart(2, "0")}
            </span>
            <span className="text-[14.5px] leading-relaxed text-slate-200">
              {step}
            </span>
          </li>
        ))}
      </ol>
      {analysis.behavioralPatternNote && (
        <div className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-5">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
            {analysis.behavioralPatternNote.title ??
              "Key difference vs previous users"}
          </p>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-slate-200">
            {analysis.behavioralPatternNote.text}
          </p>
        </div>
      )}
    </section>

    {/* Key takeaway */}
    <section className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent p-6 sm:p-8">
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
        Key takeaway
      </p>
      <h3 className="mt-2 text-[18px] font-semibold leading-snug text-slate-50 sm:text-[17px]">
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
          <p className="text-[13px] font-semibold leading-snug text-cyan-200">
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
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
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
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-indigo-300">
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
        <p className="mt-6 border-l-2 border-indigo-400/60 pl-5 text-[15.5px] italic leading-relaxed text-slate-200">
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
        className="group inline-flex items-center gap-2 rounded-md text-[11.5px] font-semibold uppercase tracking-[0.14em] text-slate-400 transition hover:text-indigo-300"
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
              <h2 className="flex flex-wrap items-center gap-2 text-base font-semibold text-slate-50 sm:text-base">
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-[11.5px] font-medium text-slate-300 transition hover:border-indigo-400/70 hover:text-indigo-300"
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
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Session summary
              </p>
              <p className="mt-3 text-[15.5px] leading-relaxed text-slate-200">
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
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Previous
              </p>
              <p className="truncate text-[11.5px] font-medium text-slate-200">
                {prev
                  ? `${prev.participant} (${prev.persona})`
                  : "—"}
              </p>
            </div>
          </button>

          <p className="hidden shrink-0 text-[11.5px] font-medium uppercase tracking-[0.14em] text-slate-500 sm:block">
            Session {idx + 1} of {totalCount}
          </p>

          <button
            type="button"
            disabled={!next || !onNavigate}
            onClick={() => next && onNavigate?.(next)}
            className="group flex min-w-0 max-w-[45%] items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-right transition enabled:hover:border-indigo-400/70 disabled:opacity-40"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Next
              </p>
              <p className="truncate text-[11.5px] font-medium text-slate-200">
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
  <h3 className="text-[17px] font-semibold leading-snug text-slate-50 sm:text-[15.5px]">
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
      className={`text-[11.5px] font-semibold uppercase tracking-[0.16em] ${cls}`}
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
      <span className={`text-[14.5px] leading-relaxed ${textClass}`}>
        {children}
      </span>
    </li>
  );
};


type ResourceDiscussionTab = "overview" | "auto" | "options";

const RESOURCE_TABS: { id: ResourceDiscussionTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "options", label: "Options compared" },
  { id: "auto", label: "Technical reality" },
];


const ResourceOverviewPane = ({
  onGoToOptions,
}: {
  onGoToOptions?: () => void;
}) => {
  // Playback-rate state for the embedded ownership video. Synced to the
  // <video> element via a ref so the user can change speed without losing
  // the current playhead.
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const RATES = [0.5, 1, 1.25, 1.5, 2];
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);
  return (
  <div className="space-y-10">
    {/* Hero header — violet accent rule + larger title hierarchy */}
    <header className="relative">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-px w-9 bg-gradient-to-r from-violet-400 via-violet-500/60 to-transparent"
        />
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-violet-300">
          Overview · Discussion
        </p>
      </div>
      <h1 className="mt-4 max-w-3xl text-[21px] font-semibold tracking-tight leading-tight text-slate-50 sm:text-[23px] md:text-[31px]">
        Resource creation: timing, motivation, and ownership
      </h1>
      <p className="mt-4 max-w-3xl text-[14.5px] leading-relaxed text-slate-400 sm:text-[15px]">
        A focused discussion on what blocks users from validating their setup,
        and how Conversation API app creation should support the journey from
        testing to integration.
      </p>
    </header>

    {/* Insights stack — same shape as the journey-step "Why this step
        matters" layout: eyebrow + headline + lead + numbered insights, each
        carrying its own evidence inline. Easier to scan than the previous
        seven-section vertical stack. */}
    <div className="border-t border-slate-800/60 pt-8">
      <p className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        <Sparkles className="h-3.5 w-3.5 text-violet-300" strokeWidth={2.25} />
        The thesis in five steps
      </p>

      <h2 className="text-[18px] font-semibold tracking-tight leading-snug text-slate-50 sm:text-[21px]">
        The real question is when, not whether.
      </h2>
      <p className="mt-3 text-[14.5px] leading-relaxed text-slate-300 sm:text-[15px]">
        There are different opinions on whether Conversation API apps should be
        auto-created, manual, or platform-managed. The real question is not
        only technical — it is about timing, motivation, and ownership.
      </p>

      <ol className="mt-7 divide-y divide-slate-800/70 border-y border-slate-800/70">
        {/* 01 — Why the framing matters */}
        <li className="grid grid-cols-[2.25rem_1fr] gap-x-4 py-6 sm:grid-cols-[2.75rem_1fr] sm:gap-x-5">
          <span className="pt-0.5 font-mono text-[11.5px] tabular-nums text-slate-500 sm:text-[12.5px]">
            01
          </span>
          <div className="min-w-0">
            <p className="text-[14.5px] font-semibold text-slate-50 sm:text-[15.5px]">
              Why the framing matters
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300 sm:text-[14px]">
              It is not “auto-create vs manual.” It is about when users have
              built enough motivation for setup to feel like progress.
            </p>
            {/* Reframe block: × Common framing → ✓ Better framing */}
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.05] p-4">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                  <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500/20 text-[9px] font-bold leading-none">
                    ×
                  </span>
                  Common framing
                </p>
                <p className="mt-2 text-[13px] italic leading-snug text-amber-100/90 line-through decoration-amber-400/40 decoration-1 sm:text-[13.5px]">
                  Should apps be auto-created or manual?
                </p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-amber-200/70">
                  This framing misses the user journey.
                </p>
              </div>
              <div
                aria-hidden="true"
                className="hidden md:flex md:flex-col md:items-center md:justify-center md:gap-1"
              >
                <ArrowRight
                  className="h-4 w-4 text-violet-300"
                  strokeWidth={2.25}
                />
                <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-violet-400">
                  Reframe
                </span>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.10] to-emerald-500/[0.04] p-4 shadow-[0_8px_24px_-16px_rgba(52,211,153,0.4)]">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/25 text-[9px] font-bold leading-none">
                    ✓
                  </span>
                  Better framing
                </p>
                <p className="mt-2 text-[13px] font-semibold leading-snug text-emerald-50 sm:text-[13.5px]">
                  When should the app become a user responsibility?
                </p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-emerald-200/80">
                  This names the real decision the design has to make.
                </p>
              </div>
            </div>
          </div>
        </li>

        {/* 02 — Motivation is earned step by step */}
        <li className="grid grid-cols-[2.25rem_1fr] gap-x-4 py-6 sm:grid-cols-[2.75rem_1fr] sm:gap-x-5">
          <span className="pt-0.5 font-mono text-[11.5px] tabular-nums text-slate-500 sm:text-[12.5px]">
            02
          </span>
          <div className="min-w-0">
            <p className="text-[14.5px] font-semibold text-slate-50 sm:text-[15.5px]">
              Motivation is earned step by step
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300 sm:text-[14px]">
              Users become more willing to do setup after each successful step.
            </p>
            <ol className="mt-4 space-y-1.5">
              {[
                "They send a message.",
                "They see it delivered.",
                "They understand what happened.",
                "They create their own channel.",
                "They see their own brand in a real message.",
              ].map((t, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-200 sm:text-[13.5px]"
                >
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-violet-500/35 bg-violet-500/10 font-mono text-[9.5px] tabular-nums text-violet-200">
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-4 py-2.5 text-[13px] font-medium leading-relaxed text-emerald-100 sm:text-[13.5px]">
              At that point, integration no longer feels like a blocker. It
              feels like the next step.
            </p>
          </div>
        </li>

        {/* 03 — Users want to validate, not integrate */}
        <li className="grid grid-cols-[2.25rem_1fr] gap-x-4 py-6 sm:grid-cols-[2.75rem_1fr] sm:gap-x-5">
          <span className="pt-0.5 font-mono text-[11.5px] tabular-nums text-slate-500 sm:text-[12.5px]">
            03
          </span>
          <div className="min-w-0">
            <p className="text-[14.5px] font-semibold text-slate-50 sm:text-[15.5px]">
              Users want to validate, not integrate
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300 sm:text-[14px]">
              After creating a channel, their intent is to confirm that the
              thing they just made works — not to start integrating.
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Expected flow
                </p>
                <ol className="mt-2.5 flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-center sm:gap-1">
                  {[
                    { step: "Create agent", tone: "indigo" },
                    { step: "Send test message", tone: "violet" },
                    { step: "See confirmation", tone: "emerald" },
                  ].map((s, i, arr) => (
                    <li key={i} className="contents">
                      <div
                        className={`flex-1 rounded-lg border px-3 py-2 text-center font-mono text-[11.5px] leading-relaxed sm:text-[12px] ${
                          s.tone === "indigo"
                            ? "border-indigo-500/30 bg-indigo-500/[0.06] text-indigo-100"
                            : s.tone === "violet"
                              ? "border-violet-500/30 bg-violet-500/[0.06] text-violet-100"
                              : "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-100"
                        }`}
                      >
                        {s.step}
                      </div>
                      {i < arr.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="flex shrink-0 items-center justify-center text-slate-500"
                        >
                          <ArrowRight className="hidden h-3.5 w-3.5 sm:block" />
                          <ChevronDown className="h-3.5 w-3.5 sm:hidden" />
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
              <div aria-hidden="true" className="h-px bg-slate-800/60" />
              <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  They want to confirm
                </p>
                <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                  {[
                    "Does my agent work?",
                    "Does my brand appear correctly?",
                    "Was the message delivered?",
                    "Can I inspect what happened?",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2 text-[12.5px] leading-relaxed text-slate-200 sm:text-[13px]"
                    >
                      <span className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
                        <Check className="h-2 w-2" strokeWidth={3} />
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </li>

        {/* 04 — Ownership requires the right timing */}
        <li className="grid grid-cols-[2.25rem_1fr] gap-x-4 py-6 sm:grid-cols-[2.75rem_1fr] sm:gap-x-5">
          <span className="pt-0.5 font-mono text-[11.5px] tabular-nums text-slate-500 sm:text-[12.5px]">
            04
          </span>
          <div className="min-w-0">
            <p className="text-[14.5px] font-semibold text-slate-50 sm:text-[15.5px]">
              Ownership requires the right timing
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300 sm:text-[14px]">
              Users value things more when they have intentionally created,
              named, and understood them. But ownership only works when the
              timing is right.
            </p>
            <JourneyQuoteHover
              q={{
                title: "Don’t name the app for me",
                participant: "P12",
                persona: "Developer",
                short:
                  "I would not like the app to be created for me… I should be determining, like, what the name is from the very start.",
                long:
                  "I would not like the app to be created for this is just me. I don’t want you to create the app for me just and have me drop into this UI. You started calling it, like, test app. I should be determining, like, what the name is from the very start and know that I’m in the test app creation flow or app creation flow. So maybe, like, add a little banner explaining, now you need to create your app.",
              }}
            >
              <blockquote className="mt-3 cursor-default border-l-2 border-slate-700 pl-3.5 transition-colors hover:border-indigo-400/70">
                <p className="text-[13px] italic leading-relaxed text-slate-300 sm:text-[13.5px]">
                  “I would not like the app to be created for me… I should be
                  determining, like, what the name is from the very start.”
                  {" "}
                  <span className="not-italic text-slate-500">—</span>{" "}
                  <span className="not-italic font-mono text-[12px] text-slate-400">
                    P12
                  </span>
                </p>
              </blockquote>
            </JourneyQuoteHover>

            {/* Recorded session clip — P12 talking through resource ownership.
                Native browser controls plus a custom playback-speed pill row
                so reviewers can scrub through faster (research clips often
                contain stretches of dead air). */}
            <figure className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
              <video
                ref={videoRef}
                src="/videos/app-resource.mp4"
                controls
                playsInline
                preload="metadata"
                className="block w-full bg-black"
                crossOrigin="anonymous"
              >
                <track
                  kind="subtitles"
                  src="/videos/app-resource.vtt"
                  srcLang="en"
                  label="English"
                  default
                />
              </video>
              <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 px-3 py-2 sm:px-4">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Session clip · P12
                </span>
                <div
                  role="group"
                  aria-label="Playback speed"
                  className="inline-flex items-center gap-0.5 rounded-md border border-slate-800 bg-slate-900/70 p-0.5"
                >
                  {RATES.map((r) => {
                    const isActive = r === playbackRate;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setPlaybackRate(r)}
                        aria-pressed={isActive}
                        className={`rounded px-2 py-0.5 font-mono text-[10.5px] tabular-nums transition ${
                          isActive
                            ? "bg-indigo-500/20 text-indigo-100 ring-1 ring-indigo-500/40"
                            : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                        }`}
                      >
                        {r}×
                      </button>
                    );
                  })}
                </div>
              </figcaption>
            </figure>

            {/* What this shows — frames the contrast that follows. The
                problem isn't comprehension; it's missing the moment of
                decision. */}
            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                What this shows
              </p>
              <p className="mt-2.5 text-[13px] leading-relaxed text-slate-200 sm:text-[13.5px]">
                The issue is not that users don’t understand the concept of
                having an app.
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-300 sm:text-[13.5px]">
                P12 understands webhooks, credentials, and system connections.
                The problem is being dropped into a setup they didn’t initiate.
              </p>
              <blockquote className="mt-3 border-l-2 border-slate-700 pl-3.5">
                <p className="text-[13px] italic leading-relaxed text-slate-300 sm:text-[13.5px]">
                  “I didn’t actually do the creation part, so I just got
                  dropped here.”
                </p>
              </blockquote>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-4">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                  <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500/20 text-[9px] font-bold leading-none">
                    ×
                  </span>
                  Created too early
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {[
                    "Skips the moment of decision",
                    "Lacks context and purpose",
                    "Feels like platform setup, not something the user owns",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2 text-[12.5px] leading-relaxed text-amber-100/90 sm:text-[13px]"
                    >
                      <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/25 text-[9px] font-bold leading-none">
                    ✓
                  </span>
                  Introduced with intent
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {[
                    "Users understand why the app is needed",
                    "Creation is intentional and meaningful",
                    "Users are ready for webhooks, credentials, and integration",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2 text-[12.5px] leading-relaxed text-emerald-100/90 sm:text-[13px]"
                    >
                      <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Insight-level "Key insight" callout — the pithy summary that
                ties the contrast above to the broader thesis. */}
            <div className="mt-5 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.10] via-indigo-500/[0.05] to-transparent p-4 shadow-[0_8px_24px_-16px_rgba(139,92,246,0.4)] sm:p-5">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                Key insight
              </p>
              <p className="mt-2.5 text-[14px] font-semibold leading-snug text-slate-50 sm:text-[15px]">
                Ownership doesn’t come from configuration.
                <br />
                It comes from creating something with intent, at the right
                moment.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p className="rounded-lg border border-amber-500/25 bg-amber-500/[0.05] px-3 py-2 text-[12px] leading-relaxed text-amber-100/90">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300">
                    Before validation
                  </span>
                  <span className="mt-1 block">The app is infrastructure.</span>
                </p>
                <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.05] px-3 py-2 text-[12px] leading-relaxed text-emerald-100/90">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    After validation
                  </span>
                  <span className="mt-1 block">
                    It becomes part of the user’s system.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </li>

        {/* 05 — Today's setup creates a mismatch */}
        <li className="grid grid-cols-[2.25rem_1fr] gap-x-4 py-6 sm:grid-cols-[2.75rem_1fr] sm:gap-x-5">
          <span className="pt-0.5 font-mono text-[11.5px] tabular-nums text-slate-500 sm:text-[12.5px]">
            05
          </span>
          <div className="min-w-0">
            <p className="text-[14.5px] font-semibold text-slate-50 sm:text-[15.5px]">
              Today’s setup creates a mismatch
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300 sm:text-[14px]">
              At the moment users want to test, the system asks them to set
              up. The gap between those two intents is where momentum dies.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
              <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.10] to-emerald-500/[0.04] p-4 shadow-[0_8px_24px_-16px_rgba(52,211,153,0.4)]">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/25 text-[9px] font-bold leading-none">
                    ✓
                  </span>
                  User intention
                </p>
                <p className="mt-2 text-[13.5px] font-semibold leading-snug text-emerald-50 sm:text-[14px]">
                  Test what they just made
                </p>
                <ul className="mt-3 space-y-1.5">
                  {[
                    "Send a message from their agent.",
                    "See it arrive on their device.",
                    "Get confidence the setup works.",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2 text-[12px] leading-relaxed text-emerald-100/90"
                    >
                      <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                aria-hidden="true"
                className="hidden md:flex md:flex-col md:items-center md:justify-center md:gap-1.5"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/[0.08] text-[13px] font-semibold leading-none text-amber-300">
                  ≠
                </span>
                <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-amber-400">
                  Mismatch
                </span>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                  <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500/20 text-[9px] font-bold leading-none">
                    !
                  </span>
                  Current reality
                </p>
                <p className="mt-2 text-[13.5px] font-semibold leading-snug text-amber-50 sm:text-[14px]">
                  Configure infrastructure first
                </p>
                <ul className="mt-3 space-y-1.5">
                  {[
                    "Create or connect a Conversation API app.",
                    "Manage credentials.",
                    "Think about integration before testing.",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2 text-[12px] leading-relaxed text-amber-100/90"
                    >
                      <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </li>
      </ol>
    </div>

    {/* Key takeaway — closes with the design principle and final thesis. */}
    <section className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.10] via-indigo-500/[0.05] to-transparent p-6 shadow-[0_24px_60px_-32px_rgba(139,92,246,0.4)] sm:p-7">
      <p className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-violet-300">
        <Sparkles className="h-3.5 w-3.5 text-violet-300" strokeWidth={2.25} />
        Key takeaway
      </p>
      <p className="mt-3 text-[17px] font-semibold leading-snug text-slate-50 sm:text-[19px]">
        First prove value.
        <br />
        Then let users create and own the resources that matter.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
            Before validation
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-amber-100/90 sm:text-[13px]">
            The app is infrastructure.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            After validation
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-emerald-100/90 sm:text-[13px]">
            The app can become part of the user’s system.
          </p>
        </div>
      </div>
      <p className="mt-5 text-[13px] leading-relaxed text-slate-400 sm:text-[13.5px]">
        The fix is not choosing between auto-create and manual setup. It is
        deciding when the app becomes a user responsibility — because
        motivation is earned step by step.
      </p>
    </section>

    {/* Forward link — points the reader at the next tab where the four
        possible approaches are compared side-by-side. */}
    {onGoToOptions && (
      <div className="!mt-8 flex justify-center">
        <button
          type="button"
          onClick={onGoToOptions}
          className="group inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-gradient-to-br from-violet-500/15 via-indigo-500/10 to-violet-500/5 px-5 py-2.5 text-[12.5px] font-semibold tracking-[0.04em] text-violet-100 shadow-[0_8px_24px_-12px_rgba(139,92,246,0.5)] transition hover:border-violet-400/70 hover:from-violet-500/25 hover:via-indigo-500/20 hover:text-white sm:px-6 sm:py-2.5 sm:text-[13px]"
        >
          See and compare alternative ways forward
          <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    )}
  </div>
  );
};


const ResourceAutoPane = () => (
  <div className="space-y-10">
    <header>
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-violet-300">
        Technical reality
      </p>
      <h2 className="mt-3 text-[19px] font-semibold tracking-tight leading-tight text-slate-50 sm:text-[21px] md:text-[23px]">
        What the API actually requires
      </h2>
    </header>

    {/* Agent vs App */}
    <section className="space-y-4">
      <p className="text-[15px] leading-relaxed text-slate-300">
        An RCS Agent cannot send messages on its own.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/[0.05] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
            The agent
          </p>
          <p className="mt-2 text-[15.5px] font-semibold leading-snug text-slate-50">
            Sender identity
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">
            Brand, name, logo, profile, and approved use case.
          </p>
        </div>
        <div className="rounded-xl border border-violet-500/25 bg-violet-500/[0.05] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300">
            The Conversation API app
          </p>
          <p className="mt-2 text-[15.5px] font-semibold leading-snug text-slate-50">
            Sending mechanism
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">
            Authentication, routing, delivery, retries, events, and webhooks.
          </p>
        </div>
      </div>
      <p className="text-[15px] leading-relaxed text-slate-300">
        So the question is not:
      </p>
      <p className="rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-5 py-3 text-[14.5px] italic leading-relaxed text-amber-100">
        Can we send without an app?{" "}
        <span className="text-amber-300/80">No.</span>
      </p>
      <p className="text-[15px] leading-relaxed text-slate-300">
        The real question is:
      </p>
      <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-3 text-[14.5px] font-semibold leading-relaxed text-emerald-100">
        Does the app need to be user-owned and user-managed at the validation
        stage?
      </p>
      <p className="text-[15px] leading-relaxed text-slate-300">
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
      <p className="text-[15px] leading-relaxed text-slate-300">
        This means validation can be enabled without making app setup a user
        responsibility too early.
      </p>
    </section>

    {/* Core principle */}
    <section className="rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent p-6 sm:p-8">
      <DiscussionEyebrow color="cyan">Core principle</DiscussionEyebrow>
      <p className="mt-3 text-[17px] leading-snug text-slate-100 sm:text-[15.5px]">
        Validation requires infrastructure, but not user ownership of that
        infrastructure.
      </p>
      <p className="mt-3 text-[14.5px] leading-relaxed text-slate-300">
        The app may still exist technically. But the user should not have to
        create, connect, or understand it before they know why it matters.
      </p>
    </section>

    {/* Core tension */}
    <section className="space-y-4">
      <DiscussionEyebrow color="violet">The core tension</DiscussionEyebrow>
      <p className="text-[15px] leading-relaxed text-slate-300">
        There are two valid needs.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-5">
          <DiscussionH3>Reduce friction early</DiscussionH3>
          <p className="mt-2.5 text-[14px] leading-relaxed text-slate-300">
            Users need to validate quickly without being blocked by setup.
          </p>
        </div>
        <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/[0.04] p-5">
          <DiscussionH3>Preserve clarity and control</DiscussionH3>
          <p className="mt-2.5 text-[14px] leading-relaxed text-slate-300">
            Developers need visibility and ownership of the resources they use
            for real integration.
          </p>
        </div>
      </div>
      <p className="text-[15px] italic leading-relaxed text-slate-200">
        The challenge is to support both.
      </p>
    </section>
  </div>
);

const ResourceOptionsPane = () => {
  // Segmented-control state — which option to read in detail. Default to
  // Option 1 so the reader can step through them in order.
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const optionLabels: { n: number; short: string; tone: "rose" | "amber" | "emerald" }[] = [
    { n: 1, short: "Require setup", tone: "rose" },
    { n: 2, short: "Auto-create", tone: "amber" },
    { n: 3, short: "Guided", tone: "amber" },
    { n: 4, short: "Managed test mode", tone: "emerald" },
  ];
  return (
  <div className="space-y-10">
    <header>
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-violet-300">
        Alternative approaches to enable validation
      </p>
      <h2 className="mt-3 text-[19px] font-semibold tracking-tight leading-tight text-slate-50 sm:text-[21px] md:text-[23px]">
        Four options compared
      </h2>
      <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-300">
        There are multiple ways to enable validation after channel creation.
        All approaches support sending messages, but they differ in when
        users are required to deal with infrastructure.
      </p>
      <p className="mt-4 max-w-3xl rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-3 text-[14.5px] font-semibold leading-relaxed text-emerald-100">
        The core tradeoff is not technical feasibility, but timing of
        responsibility.
      </p>
    </header>

    {/* Segmented control — pick which option to read in detail. Comparison
        table sits at the bottom for at-a-glance scoring across all options. */}
    <section className="space-y-4">
      <DiscussionEyebrow>Read each option in detail</DiscussionEyebrow>
      <div
        role="tablist"
        aria-label="Compare options in detail"
        className="grid grid-cols-2 gap-1 rounded-xl border border-slate-800 bg-slate-950/60 p-1 sm:grid-cols-4"
      >
        {optionLabels.map((o) => {
          const isActive = o.n === selectedOption;
          const activeRing =
            o.tone === "emerald"
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-100 shadow-[0_8px_24px_-12px_rgba(52,211,153,0.45)]"
              : o.tone === "rose"
                ? "border-rose-500/40 bg-rose-500/15 text-rose-100"
                : "border-amber-500/40 bg-amber-500/15 text-amber-100";
          const numTone =
            o.tone === "emerald"
              ? "text-emerald-300"
              : o.tone === "rose"
                ? "text-rose-300"
                : "text-amber-300";
          return (
            <button
              key={o.n}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedOption(o.n)}
              className={`group relative min-w-0 rounded-lg border px-3 py-2 text-left transition ${
                isActive
                  ? activeRing
                  : "border-transparent bg-transparent text-slate-300 hover:border-slate-700/80 hover:bg-slate-900/60 hover:text-slate-100"
              }`}
            >
              <span
                className={`block font-mono text-[10px] font-semibold tabular-nums tracking-[0.14em] ${
                  isActive ? numTone : "text-slate-500"
                }`}
              >
                0{o.n}
              </span>
              <span className="mt-0.5 block truncate text-[12px] font-semibold leading-snug sm:text-[12.5px]">
                {o.short}
              </span>
            </button>
          );
        })}
      </div>
    </section>
    {[
      {
        n: 1,
        title: "Require app setup while creating sender",
        tag: "Current RCS model",
        tagColor: "amber",
        flow: "Create agent → create/connect app → send test message",
        meaningIntro: "While a RCS Agent is created users must:",
        meaningPoints: [
          "Create or select a Conversation API app to connect it to.",
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
          "Mixes compliance with API setup in the same flow.",
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
          "Leads to orphaned or unused apps over time.",
          "Defers confusion to a later stage instead of resolving it.",
          "Users are unaware that an app was created.",
          "The relationship between agent and app remains unclear.",
          "Developers lack control over how resources are structured.",
          "Creates persistent infrastructure for a temporary testing need.",
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
        tag: "New RCS model",
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
    ]
      .filter((opt) => opt.n === selectedOption)
      .map((opt) => {
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
      // Stripe-inspired tone-aware outer card: subtle gradient hint + lift.
      const cardOuterClass = isRecommended
        ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/[0.08] via-emerald-500/[0.03] to-transparent shadow-[0_24px_60px_-32px_rgba(52,211,153,0.4)]"
        : opt.fitTone === "rose"
          ? "border-slate-800 bg-gradient-to-br from-rose-500/[0.04] via-slate-900/40 to-slate-900/40"
          : opt.fitTone === "amber"
            ? "border-slate-800 bg-gradient-to-br from-amber-500/[0.04] via-slate-900/40 to-slate-900/40"
            : "border-slate-800 bg-slate-900/40";
      const numberToneClass = isRecommended
        ? "text-emerald-300"
        : opt.fitTone === "rose"
          ? "text-rose-300/80"
          : "text-amber-300/80";
      return (
        <Fragment key={opt.n}>
          {/* Group context for the recommended option — kept inline since it
              adds nuance the segmented-control button label can't carry. */}
          {opt.n === 4 && (
            <div className="!mt-2 space-y-1.5 border-l-2 border-emerald-500/50 pl-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Recommended approach
              </p>
              <p className="text-[12.5px] leading-relaxed text-slate-400">
                The platform manages the app during testing. The user takes
                ownership only at integration, when it serves their goal.
              </p>
            </div>
          )}
          <article
            className={`relative overflow-hidden rounded-2xl border p-6 sm:p-7 ${cardOuterClass}`}
          >
            {/* Big serif number — stripe-style accent in the corner */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute right-5 top-4 font-serif text-[44px] italic leading-none opacity-20 sm:text-[56px] ${numberToneClass}`}
            >
              {String(opt.n).padStart(2, "0")}
            </span>
            <header className="relative flex flex-wrap items-baseline gap-3 pr-12 sm:pr-16">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Option {opt.n}
              </p>
              {opt.tag && (
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] ${tagBgClass}`}
                >
                  {opt.tag}
                </span>
              )}
              <h3 className="basis-full text-[18px] font-semibold leading-snug tracking-tight text-slate-50 sm:text-[20px]">
                {opt.title}
              </h3>
            </header>
          <div className="mt-4 space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Flow
              </p>
              {/* Stripe-style flow diagram — split on "→", render each step
                  as a pill with a step number, connected by thin arrow lines.
                  The final step (the value moment) gets the option's tone so
                  the eye lands on the outcome of each path. */}
              {(() => {
                const steps = opt.flow.split("→").map((s) => s.trim()).filter(Boolean);
                const lastIdx = steps.length - 1;
                const lastTone = opt.fitTone === "emerald"
                  ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/[0.12] to-emerald-500/[0.04] text-emerald-100 shadow-[0_8px_20px_-12px_rgba(52,211,153,0.45)]"
                  : opt.fitTone === "rose"
                    ? "border-rose-500/30 bg-rose-500/[0.06] text-rose-100"
                    : "border-amber-500/30 bg-amber-500/[0.06] text-amber-100";
                return (
                  <ol className="mt-2.5 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-0">
                    {steps.map((step, i) => {
                      const isLast = i === lastIdx;
                      const stepTone = isLast
                        ? lastTone
                        : "border-slate-700/80 bg-slate-900/70 text-slate-100";
                      const numTone = isLast
                        ? opt.fitTone === "emerald"
                          ? "border-emerald-500/45 bg-emerald-500/15 text-emerald-200"
                          : opt.fitTone === "rose"
                            ? "border-rose-500/35 bg-rose-500/15 text-rose-200"
                            : "border-amber-500/35 bg-amber-500/15 text-amber-200"
                        : "border-slate-700 bg-slate-950/70 text-slate-300";
                      return (
                        <li key={i} className="contents">
                          <div
                            className={`flex flex-1 items-center gap-2.5 rounded-lg border px-3 py-2 transition ${stepTone}`}
                          >
                            <span
                              className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-semibold tabular-nums ${numTone}`}
                            >
                              {i + 1}
                            </span>
                            <span className="text-[12.5px] font-medium leading-snug">
                              {step}
                            </span>
                          </div>
                          {!isLast && (
                            <span
                              aria-hidden="true"
                              className="flex shrink-0 items-center justify-center text-slate-500 sm:px-1.5"
                            >
                              <ArrowRight className="hidden h-3.5 w-3.5 sm:block" />
                              <ChevronDown className="h-3.5 w-3.5 sm:hidden" />
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                );
              })()}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                What this means
              </p>
              {opt.meaningIntro && (
                <p className="mt-1.5 text-[14px] leading-relaxed text-slate-200">
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
                <p className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-[13px] leading-relaxed text-amber-100">
                  {opt.meaningClosing}
                </p>
              )}
            </div>
            {opt.practice && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300">
                  {opt.practice.title}
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-200">
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
                  <p className="mt-5 text-[13px] font-medium leading-relaxed text-slate-300">
                    {opt.practice.mixIntro}
                  </p>
                )}
                {opt.practice.mix && opt.practice.mix.length > 0 && (
                  <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                    {opt.practice.mix.map((m, i) => {
                      const tones = [
                        "border-cyan-500/25 bg-cyan-500/[0.05]",
                        "border-indigo-500/25 bg-indigo-500/[0.05]",
                        "border-amber-500/25 bg-amber-500/[0.05]",
                      ];
                      const labelTones = [
                        "text-cyan-300",
                        "text-indigo-300",
                        "text-amber-300",
                      ];
                      return (
                        <li
                          key={i}
                          className={`rounded-xl border px-3.5 py-3 ${tones[i % 3]}`}
                        >
                          <p
                            className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${labelTones[i % 3]}`}
                          >
                            {m.label}
                          </p>
                          <p className="mt-1.5 text-[13px] italic leading-snug text-slate-200">
                            “{m.text}”
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
            {opt.coreProblem && (
              <div className="rounded-xl border border-rose-500/25 bg-rose-500/[0.04] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-300">
                  {opt.coreProblem.title ?? "Core problem"}
                </p>
                <p className="mt-2 text-[14.5px] font-semibold leading-snug text-slate-50">
                  {opt.coreProblem.headline}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-300">
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
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
                            <p className="text-[13px] font-medium leading-relaxed text-slate-200">
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
                    <p className="text-[13px] font-medium leading-relaxed text-slate-200">
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                    Pros
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {opt.pros.map((p, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-200"
                      >
                        <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-300">
                  {opt.consLabel ?? "Cons"}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {opt.cons.map((c, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-200"
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
                className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${keyLabelClass}`}
              >
                {opt.keyLabel}
              </p>
              <p className="mt-1 text-[13.5px] font-medium leading-relaxed">
                {opt.keyText}
              </p>
              {opt.keyDetail && (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-3.5">
                    <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                      <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/25 text-[9px] font-bold leading-none">
                        ✓
                      </span>
                      {opt.keyDetail.insteadIntro}
                    </p>
                    <p className="mt-2 rounded-md border border-emerald-500/20 bg-slate-950/60 px-3 py-2 font-mono text-[11.5px] leading-relaxed text-emerald-200">
                      {opt.keyDetail.instead}
                    </p>
                  </div>
                  <div className="rounded-xl border border-rose-500/25 bg-rose-500/[0.04] p-3.5">
                    <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-300">
                      <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500/25 text-[9px] font-bold leading-none">
                        ✗
                      </span>
                      {opt.keyDetail.forceIntro}
                    </p>
                    <p className="mt-2 rounded-md border border-rose-500/25 bg-slate-950/60 px-3 py-2 font-mono text-[11.5px] leading-relaxed text-rose-200">
                      {opt.keyDetail.force}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${fitToneClass}`}
            >
              <span className="text-[15.5px]" aria-hidden="true">
                {opt.fitIcon}
              </span>
              <p className="text-[12.5px] font-semibold leading-snug">
                <span className="opacity-70">Fit with research — </span>
                {opt.fitText}
              </p>
            </div>
          </div>
          </article>
        </Fragment>
      );
    })}

    {/* Divider — separates the deep-dive option above from the at-a-glance
        comparison table below, so the two sections feel like distinct
        reading modes rather than one long stack. */}
    <div className="!mt-12 flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        At-a-glance
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-700/60 to-transparent" />
    </div>

    {/* Comparison table — at-a-glance scoring across six dimensions (1–5) */}
    <section className="space-y-4">
      <DiscussionEyebrow>Comparison of approaches</DiscussionEyebrow>
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full border-collapse text-left text-[12px]">
          <thead className="bg-slate-950/70">
            <tr>
              {[
                {
                  label: "Approach",
                  hint: "Which option is being scored.",
                },
                {
                  label: "Immediate validation",
                  hint:
                    "Can the user send a real test message right after creating the agent, with no further setup?",
                },
                {
                  label: "Timing of app responsibility",
                  hint:
                    "When the user is asked to take ownership of the Conversation API app — immediately, deferred, or hidden behind the platform.",
                },
                {
                  label: "Developer control",
                  hint:
                    "How much explicit control developers have over the app, credentials, and integration boundaries.",
                },
                {
                  label: "UX friction",
                  hint:
                    "How much effort the option asks of the user before they can get to a working test.",
                },
                {
                  label: "System clarity",
                  hint:
                    "How clearly the option conveys what's actually happening — agent, app, credentials, webhooks.",
                },
                {
                  label: "Behaviour alignment",
                  hint:
                    "How closely the option matches the test-first sequence observed in the research.",
                },
                {
                  label: "Total",
                  hint: "Sum of the six dimension scores. Higher = better fit.",
                },
              ].map((h) => (
                <th
                  key={h.label}
                  className="border-b border-slate-800 px-3 py-3 align-top text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                >
                  <span
                    tabIndex={0}
                    className="group relative inline-flex cursor-help items-center gap-1 outline-none focus-visible:text-slate-200"
                  >
                    {h.label}
                    {/* Hover/focus popover — short explanation of the column.
                        Positioned absolutely below the header so it doesn't
                        push table layout. */}
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-56 -translate-x-1/2 rounded-lg border border-indigo-500/40 bg-slate-900/95 px-3 py-2 text-[11.5px] font-normal normal-case tracking-normal leading-relaxed text-slate-200 opacity-0 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9),0_8px_20px_-12px_rgba(99,102,241,0.35)] backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      {h.hint}
                    </span>
                  </span>
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
                  className={`inline-flex min-w-[28px] items-center justify-center rounded border px-2 py-0.5 text-[11.5px] font-semibold tabular-nums ${scoreClass(v)}`}
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
                    <span className="mr-2 font-mono text-[11px] tabular-nums text-slate-500">
                      0{ri + 1}
                    </span>
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
                      className={`inline-flex min-w-[36px] items-center justify-center rounded border px-2 py-0.5 text-[11.5px] font-bold tabular-nums ${totalClass(row.total)}`}
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
      <p className="text-[11.5px] leading-relaxed text-slate-500">
        Scored 1 (worst) to 5 (best) on each dimension.{" "}
        <span className="font-mono text-slate-400">5*</span> — control granted
        at the integration stage, not during testing.
      </p>
    </section>

  </div>
  );
};


/**
 * Inline page section that renders the same resource-creation discussion
 * content as the dialog, but stacked vertically (no tabs). Placed
 * between the Journey and Principles sections so the content is visible
 * directly on the page in addition to the dialog launched from Step 5.
 */
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
          aria-label="Discussion: Resource creation — timing, motivation, and ownership"
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                    Discussion · Linked from Step 5
                  </p>
                  <h2 className="mt-0.5 truncate text-base font-semibold text-slate-50 sm:text-base">
                    Resource creation: timing, motivation, and ownership
                  </h2>
                </div>
              </div>
            </div>
            {/* Tab strip — sticky alongside the header */}
            <div className="border-t border-slate-900 bg-slate-950/85 backdrop-blur">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-1 overflow-x-auto px-6 sm:px-8">
                {RESOURCE_TABS.map((t) => {
                  const isActive = t.id === activeTab;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTab(t.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative shrink-0 px-4 py-3 text-[12px] font-medium transition ${
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
                  <ResourceOverviewPane
                    onGoToOptions={() => setActiveTab("options")}
                  />
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
              </AnimatePresence>

              {/* Footer — always visible at the end of any tab */}
              <footer className="mt-12 border-t border-slate-800 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-[12px] font-medium text-slate-300 transition hover:border-indigo-400/70 hover:text-indigo-300"
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

    <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-24 sm:pt-36">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.p
          variants={fadeInUp}
          className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[11.5px] font-medium tracking-[0.14em] text-slate-300 backdrop-blur"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
          RESEARCH FINDINGS · 2026
        </motion.p>

        <motion.h1
          variants={fadeInUp}
          className="mt-8 max-w-5xl text-[35px] font-semibold tracking-tight leading-[1.04] text-slate-50 sm:text-6xl sm:leading-[1.02] md:text-[56px]"
        >
          Messaging Onboarding
          <span className="block bg-gradient-to-r from-indigo-200 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Key Insights &amp; Direction
          </span>
        </motion.h1>

        <motion.div
          variants={fadeInUp}
          className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-slate-400 sm:text-base"
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
              tabIndex={s.hint ? 0 : undefined}
              className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm outline-none transition hover:border-indigo-500/40 focus-visible:border-indigo-500/60 ${
                s.hint ? "cursor-help" : ""
              }`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 opacity-0 transition group-hover:from-indigo-500/10 group-hover:opacity-100"
              />
              <dt className="relative text-[11.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {s.label}
              </dt>
              <dd className="relative mt-2 text-base font-semibold tracking-tight text-slate-50">
                {s.value}
              </dd>
              {s.subValue && (
                <p className="relative mt-1 text-[11.5px] leading-relaxed text-slate-500">
                  {s.subValue}
                </p>
              )}
              {s.hint && (
                <span
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 w-72 -translate-x-1/2 rounded-lg border border-indigo-500/40 bg-slate-900/95 px-4 py-3 text-[12px] font-normal normal-case tracking-normal leading-relaxed text-slate-200 opacity-0 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9),0_8px_20px_-12px_rgba(99,102,241,0.35)] backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  {s.hint}
                </span>
              )}
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
    <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24 lg:py-28">
      <SectionReveal>
        <SectionHeader
          number="01"
          eyebrow="Executive summary"
          title="What the research shows, in seven lines."
        />
      </SectionReveal>
      <StaggerGroup className="divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        {EXEC_SUMMARY.map((t, i) => (
          <StaggerItem key={i}>
            <div className="group flex items-start gap-6 px-6 py-6 transition-colors hover:bg-slate-800/30 sm:px-8">
              <span className="mt-1 font-serif text-base font-light tabular-nums text-indigo-400 transition group-hover:text-indigo-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="space-y-2">
                <p className="text-base font-semibold text-slate-50">
                  {t.headline}
                </p>
                {t.body.map((p, pi) => (
                  <p
                    key={pi}
                    className="text-[14px] leading-relaxed text-slate-400"
                  >
                    {p}
                  </p>
                ))}
                {t.bullets && t.bullets.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {t.bullets.map((b, bi) => (
                      <li
                        key={bi}
                        className="flex items-start gap-2.5 text-[14px] leading-relaxed text-slate-300"
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
// Reusable wrapper that adds the hover/focus -> portal popover behaviour
// around any inline trigger (a card, a blockquote, etc.). The popover lives
// in a portal on document.body so it escapes any `overflow-hidden` ancestor
// (collapsibles, dialogs). It anchors to the trigger and prefers placement
// above; flips below if the trigger is too close to the viewport top.
const JourneyQuoteHover = ({
  q,
  children,
}: {
  q: JourneyQuote;
  children: ReactNode;
}) => {
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

  useLayoutEffect(() => {
    if (!open || !wrapperRef.current) {
      setPopoverRect(null);
      return;
    }
    const update = () => {
      if (!wrapperRef.current) return;
      const r = wrapperRef.current.getBoundingClientRect();
      // Always place the popover above the quote, no matter where the quote
      // sits in the viewport. If the trigger is near the very top of the
      // page the popover may render partly off-screen — that is the
      // explicit user-chosen trade-off for a consistent placement.
      setPopoverRect({
        left: r.left + window.scrollX,
        top: r.top + window.scrollY,
        bottom: r.bottom + window.scrollY,
        width: r.width,
        placeAbove: true,
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
      tabIndex={hasLong ? 0 : undefined}
      aria-expanded={hasLong ? open : undefined}
    >
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && q.long && popoverRect && (
              // Static positioning wrapper. Owns `transform: translateY(...)`
              // so framer-motion's animated transform on the inner element
              // can't override it (the previous bug — popover landed on top
              // of the trigger instead of above it).
              <div
                style={{
                  position: "absolute",
                  left: popoverRect.left,
                  top: popoverRect.placeAbove
                    ? popoverRect.top
                    : popoverRect.bottom,
                  width: popoverRect.width,
                  transform: popoverRect.placeAbove
                    ? "translateY(calc(-100% - 8px))"
                    : "translateY(8px)",
                  zIndex: 50,
                  pointerEvents: "none",
                }}
              >
              <motion.div
                role="tooltip"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: PREMIUM_EASE }}
                className={`rounded-xl border border-indigo-500/40 bg-slate-900/95 p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95),0_10px_25px_-15px_rgba(99,102,241,0.35)] backdrop-blur-md sm:p-5 ${
                  popoverRect.placeAbove ? "origin-bottom" : "origin-top"
                }`}
              >
                {q.title && (
                  <p className="text-[14.5px] font-semibold leading-snug text-slate-50">
                    {q.title}
                  </p>
                )}
                <p className="mt-2 text-[14.5px] italic leading-relaxed text-slate-300">
                  &ldquo;{q.long}&rdquo;
                </p>
                {(q.participant || q.persona) && (
                  <div className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400/60 to-violet-500/60 text-[10.5px] font-semibold text-white ring-1 ring-indigo-300/40">
                      {q.participant
                        ? q.participant.replace(/^P/i, "")
                        : "·"}
                    </span>
                    <span className="text-[11.5px] font-medium text-slate-300">
                      {q.participant ?? "Participant"}
                    </span>
                    {q.persona && (
                      <>
                        <span className="text-slate-600">·</span>
                        <span className="text-[11.5px] text-slate-400">
                          {q.persona}
                        </span>
                      </>
                    )}
                    {(() => {
                      const aud = audienceForParticipant(q.participant);
                      return aud ? <AudienceTag audience={aud} /> : null;
                    })()}
                  </div>
                )}
              </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};

// Original card-style quote row used by `whyGroups` and `JourneyQuotes`.
// On hover, the same popover from `JourneyQuoteHover` reveals `q.long`.


// --- Mock/wireframe illustrations for selected journey steps ---------------

// Simplified Send-test-message mock: template selector with explicit label,
// a single message field, and a quiet send button (the action is a follow-up,
// not the loud focal point).
const SendMessageMock = () => (
  <div className="mx-auto mb-5 max-w-md overflow-hidden rounded-xl border border-dashed border-slate-700 bg-slate-950/70 p-4 sm:p-5">
    {/* Template selector */}
    <p className="text-[11.5px] font-medium text-slate-400">
      Message template
    </p>
    <div className="mt-1.5 inline-flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
      <span className="h-5 w-5 rounded-sm bg-gradient-to-br from-indigo-400/50 to-violet-500/50 ring-1 ring-slate-700" />
      <span className="text-[12.5px] font-medium text-slate-100">
        Text message
      </span>
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </div>

    {/* Message field */}
    <div className="mt-4">
      <p className="text-[11.5px] font-medium text-slate-400">Message</p>
      <div className="mt-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5">
        <p className="text-[12.5px] text-slate-100">
          Check out our latest collection
        </p>
      </div>
    </div>

    {/* Send button — quiet outlined style */}
    <button
      type="button"
      disabled
      className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11.5px] font-medium text-slate-200"
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
              className={`shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] ${labelColor}`}
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
        <span className="rounded-md bg-slate-800 px-2.5 py-1 text-[11.5px] font-medium text-slate-100">
          cURL
        </span>
        <span className="px-2.5 py-1 text-[11.5px] font-medium text-slate-500">
          Node.js
        </span>
        <span className="px-2.5 py-1 text-[11.5px] font-medium text-slate-500">
          Python
        </span>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-slate-500">
        <span>Copy</span>
        <span>Edit</span>
      </div>
    </div>

    {/* Code body with bottom fade */}
    <div className="relative">
      <pre className="overflow-x-auto whitespace-pre px-4 py-2.5 font-mono text-[11.5px] leading-relaxed text-slate-300">
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
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11.5px] font-medium text-slate-200">
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
          <p className="text-[11.5px] font-semibold text-slate-100">Lumen</p>
        </div>

        {/* Rich card — text + buttons only */}
        <div className="mt-1.5 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
          <div className="px-3 py-2.5">
            <p className="text-[11.5px] font-semibold text-slate-50">
              Your order is on the way
            </p>
            <p className="mt-0.5 text-[11.5px] leading-snug text-slate-400">
              Track your delivery and update your preferences from the link
              below.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-indigo-400/40 bg-indigo-500/10 px-2 py-1 text-[11px] font-medium text-indigo-200">
                Track order
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-300">
                Manage preferences
              </span>
            </div>
          </div>
        </div>

        {/* Delivery metadata */}
        <div className="mt-2 flex items-center gap-1.5 text-[10.5px] text-slate-500">
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
  titleIcon,
  alwaysVisible,
  defaultOpen = true,
  className = "mt-8 border-t border-slate-800/60 pt-6",
  children,
}: {
  title: string;
  titleColorClass: string;
  /** Optional icon shown to the left of the title (e.g. ★ for "Why this step matters"). */
  titleIcon?: ReactNode;
  /** Optional content rendered between the toggle and the collapsible body —
   *  stays visible whether the section is open or collapsed. Useful for a
   *  short summary the team should always see. */
  alwaysVisible?: ReactNode;
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
        className={`group mb-4 flex w-full items-center justify-between gap-3 text-[12px] font-semibold uppercase tracking-[0.16em] ${titleColorClass} transition hover:opacity-80`}
      >
        <span className="flex items-center gap-2">
          {titleIcon}
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>
      {alwaysVisible}
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

// "Why this step matters" — bespoke collapsible used only by journey steps.
// Layout differs from the chevron-toggled `JourneyCollapsibleSection`:
// * Eyebrow + Sparkles, no chevron
// * Headline and lead always visible
// * Insights + closing always rendered, but faded behind a gradient mask
//   when collapsed so the team can see there is more content available
// * "Learn more" / "Show less" button toggles full-opacity reveal
const JourneyWhyMatters = ({ step }: { step: JourneyStep }) => {
  const [open, setOpen] = useState(false);
  if (!step.whyInsights || step.whyInsights.length === 0) return null;
  return (
    <div className="mt-8 border-t border-slate-800/60 pt-6">
      <p className="mb-4 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        <Sparkles className="h-3.5 w-3.5 text-violet-300" strokeWidth={2.25} />
        Why this step matters
      </p>

      {(step.whyHeadline || step.whyLead) && (
        <div className="space-y-3">
          {step.whyHeadline && (
            <h5 className="text-[17px] font-semibold tracking-tight leading-snug text-slate-50 sm:text-[17px]">
              {step.whyHeadline}
            </h5>
          )}
          {step.whyLead && (
            <p className="text-[14px] leading-relaxed text-slate-300 sm:text-[13.5px]">
              {step.whyLead}
            </p>
          )}
        </div>
      )}

      {/* Body — full content always rendered. When collapsed, height is
          clamped and a fade mask + reduced opacity make it look like a
          preview. When expanded, mask + clamp lift and content is full.
          `pointer-events-none` while collapsed so hovering inline
          blockquotes does NOT trigger the long-quote popover — interaction
          requires the user to expand first. */}
      <motion.div
        animate={{
          maxHeight: open ? 4000 : 180,
          opacity: open ? 1 : 0.4,
        }}
        initial={false}
        transition={{ duration: 0.35, ease: PREMIUM_EASE }}
        className={`relative mt-6 overflow-hidden ${
          open ? "" : "pointer-events-none"
        }`}
        style={{
          maskImage: open
            ? "none"
            : "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          WebkitMaskImage: open
            ? "none"
            : "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
        }}
        aria-hidden={!open}
      >
        {step.whyTracks && (
          <section className="mb-6 overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.10] via-indigo-500/[0.05] to-transparent shadow-[0_24px_60px_-32px_rgba(139,92,246,0.4)]">
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                {step.whyTracks.title}
              </p>
              <p className="mt-2.5 text-[14px] leading-relaxed text-slate-200 sm:text-[14.5px]">
                {step.whyTracks.description}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {step.whyTracks.tracks.map((t, ti) => {
                  const toneClass =
                    t.tone === "violet"
                      ? "border-violet-500/30 bg-violet-500/[0.06]"
                      : t.tone === "amber"
                        ? "border-amber-500/30 bg-amber-500/[0.06]"
                        : "border-indigo-500/30 bg-indigo-500/[0.06]";
                  const labelClass =
                    t.tone === "violet"
                      ? "text-violet-300"
                      : t.tone === "amber"
                        ? "text-amber-300"
                        : "text-indigo-300";
                  return (
                    <div
                      key={ti}
                      className={`rounded-xl border px-4 py-3 ${toneClass}`}
                    >
                      <p
                        className={`text-[10.5px] font-semibold uppercase tracking-[0.16em] ${labelClass}`}
                      >
                        {t.label}
                      </p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-200 sm:text-[13.5px]">
                        {t.description}
                      </p>
                    </div>
                  );
                })}
              </div>
              {step.whyTracks.closing && (
                <p className="mt-4 text-[12.5px] leading-relaxed text-slate-400 sm:text-[13px]">
                  {step.whyTracks.closing}
                </p>
              )}
            </div>
          </section>
        )}
        <ol className="divide-y divide-slate-800/70 border-y border-slate-800/70">
          {step.whyInsights.map((ins, ii) => (
            <li
              key={ii}
              className="grid grid-cols-[2.25rem_1fr] gap-x-4 py-5 sm:grid-cols-[2.75rem_1fr] sm:gap-x-5"
            >
              <span className="pt-0.5 font-mono text-[11.5px] tabular-nums text-slate-500 sm:text-[11.5px]">
                {String(ii + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-[14.5px] font-semibold text-slate-50 sm:text-[14px]">
                  {ins.title}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300 sm:text-[13px]">
                  {ins.description}
                </p>
                {ins.quoteIndices && ins.quoteIndices.length > 0 && (
                  <div className="mt-3 space-y-2.5">
                    {ins.quoteIndices.map((qi) => {
                      const q = step.whyQuotes[qi];
                      if (!q) return null;
                      return (
                        <JourneyQuoteHover key={qi} q={q}>
                          <blockquote
                            className={`border-l-2 border-slate-700 pl-3.5 transition-colors ${
                              q.long
                                ? "cursor-default hover:border-indigo-400/70"
                                : ""
                            }`}
                          >
                            <p className="text-[13px] italic leading-relaxed text-slate-300 sm:text-[13px]">
                              “{q.short.replace(/^[“"]|[”"]$/g, "")}”
                              {q.participant && (
                                <>
                                  {" "}
                                  <span className="not-italic text-slate-500">
                                    —
                                  </span>{" "}
                                  <span className="not-italic font-mono text-[12px] text-slate-400">
                                    {q.participant}
                                  </span>
                                </>
                              )}
                            </p>
                          </blockquote>
                        </JourneyQuoteHover>
                      );
                    })}
                  </div>
                )}
                {ins.bullets && ins.bullets.length > 0 && (
                  <ul className="mt-3 space-y-1.5 pl-1">
                    {ins.bullets.map((b, bi) => (
                      <li
                        key={bi}
                        className="flex items-baseline gap-2 text-[13px] leading-relaxed text-slate-300 sm:text-[13px]"
                      >
                        <span aria-hidden="true" className="text-slate-500">
                          ·
                        </span>
                        <span>
                          <span className="text-slate-200">{b.text}</span>
                          {b.meta && (
                            <span className="text-slate-500"> {b.meta}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {ins.closing && ins.closing.length > 0 && (
                  <div className="mt-3 space-y-2.5">
                    {ins.closing.map((p, pi) => (
                      <p
                        key={pi}
                        className="text-[12.5px] leading-relaxed text-slate-300 sm:text-[13px]"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
        {step.whyClosing && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3.5 sm:px-5 sm:py-4">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-slate-500"
              strokeWidth={2}
            />
            <p className="text-[13px] leading-relaxed text-slate-300 sm:text-[13px]">
              {step.whyClosing}
            </p>
          </div>
        )}
      </motion.div>

      {/* Toggle — replaces the previous chevron. Centred and prominent so
          it reads as the call-to-action that reveals the supporting evidence. */}
      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="group inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-violet-500/10 px-5 py-2 text-[12.5px] font-semibold tracking-[0.04em] text-violet-100 shadow-[0_8px_24px_-12px_rgba(139,92,246,0.55)] transition hover:border-violet-400/70 hover:from-violet-500/30 hover:via-indigo-500/25 hover:text-white sm:px-6 sm:py-2.5 sm:text-[13px]"
        >
          {open ? "Show less" : "Learn more"}
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : "rotate-0 group-hover:translate-y-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

const JourneyStepCard = ({
  step,
  isActive,
  onOpenDiscussion,
  isFirstTheme,
  themeLabel,
}: {
  step: JourneyStep;
  isActive: boolean;
  onOpenDiscussion?: () => void;
  isFirstTheme: boolean;
  themeLabel: string;
}) => {
  const themeNumber = isFirstTheme ? 1 : 2;
  const themeChipText = isFirstTheme ? "text-indigo-300" : "text-violet-300";
  const themeDot = isFirstTheme ? "bg-indigo-400" : "bg-violet-400";
  const stepBadgeBg = isFirstTheme
    ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-200"
    : "border-violet-500/40 bg-violet-500/10 text-violet-200";
  // Strip the leading "Theme N · " from the label so we can render the parts
  // separately and color them deliberately.
  const themeLabelTitle = themeLabel.replace(/^Theme\s+\d+\s*[·•]\s*/i, "");
  return (
  <motion.article
    animate={{
      // Toned-down active state: subtle border tint, no large indigo shadow.
      borderColor: isActive
        ? isFirstTheme
          ? "rgba(99, 102, 241, 0.22)"
          : "rgba(167, 139, 250, 0.22)"
        : "rgba(30, 41, 59, 1)",
      boxShadow: isActive
        ? "0 12px 32px -22px rgba(0,0,0,0.6)"
        : "0 8px 24px -22px rgba(0,0,0,0.55)",
    }}
    transition={{ duration: 0.5, ease: PREMIUM_EASE }}
    className="rounded-2xl border bg-slate-900/70 p-5 backdrop-blur-sm sm:p-7 lg:p-9"
  >
    {step.illustration && <StepIllustration kind={step.illustration} />}

    {/* Step header strip — surfaces step number, theme, and persona tag in
        one compact row so the step's place in the larger journey is always
        obvious without scanning the side rail. */}
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 sm:mb-5">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] ${stepBadgeBg}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${themeDot}`} />
        Step {step.number}
      </span>
      <span
        className={`text-[10.5px] font-semibold uppercase tracking-[0.18em] ${themeChipText}`}
      >
        Theme {themeNumber} · {themeLabelTitle}
      </span>
      {step.tag && (
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/[0.06] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400/80" />
          {step.tag}
        </span>
      )}
    </div>

    <h4 className="text-[18px] font-semibold tracking-tight leading-tight text-slate-50 sm:text-[21px] md:text-[23px] lg:text-[23px]">
      {step.title}
    </h4>

    {/* Key action subtitle — turns the abstract heading into a concrete verb
        so the user immediately sees what they would actually do here. */}
    {step.keyAction && (
      <div
        className={`mt-4 inline-flex items-center gap-2.5 rounded-lg border bg-slate-950/60 px-3.5 py-2 text-[12px] sm:text-[11px] ${
          isFirstTheme
            ? "border-indigo-500/25"
            : "border-violet-500/25"
        }`}
      >
        <span
          className={`text-[10.5px] font-semibold uppercase tracking-[0.16em] ${
            isFirstTheme ? "text-indigo-300" : "text-violet-300"
          }`}
        >
          Key action
        </span>
        <span aria-hidden="true" className="text-slate-600">
          ›
        </span>
        <span className="font-medium text-slate-100">{step.keyAction}</span>
      </div>
    )}

    {/* Discussion trigger — surfaced prominently on Step 5 (s6) and pinned
        to the top of the viewport while the user scrolls through the step. */}
    {step.id === "s6" && onOpenDiscussion && (
      <button
        type="button"
        onClick={onOpenDiscussion}
        className="group sticky top-[58px] z-20 mt-5 flex w-full items-start gap-3 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-cyan-500/10 p-3.5 text-left backdrop-blur-md transition hover:border-violet-400/60 hover:from-violet-500/25 hover:via-indigo-500/20 sm:gap-4 sm:p-5 lg:top-2 lg:p-6"
      >
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/25 text-violet-200 ring-1 ring-violet-400/40 sm:h-10 sm:w-10">
          <ExternalLink className="h-4 w-4" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold leading-snug text-slate-50 sm:text-[14px] lg:text-[14.5px]">
            Resource creation: timing, motivation, and ownership
          </p>
          <p className="mt-1.5 hidden text-[13px] leading-relaxed text-slate-300 sm:block">
            Why this step exists, the auto-create-vs-explicit-setup tradeoff,
            and the design principle the rest of the journey follows.
          </p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-violet-200 transition group-hover:text-violet-100 sm:mt-3 sm:text-[11px]">
            Open the discussion
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </p>
        </div>
      </button>
    )}

    {step.description.length > 0 && (
      <section
        className="relative mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40 p-5 sm:p-6"
        aria-label="What happens in this step"
      >
        {/* Subtle accent stripe on the left edge — color-codes the snapshot
            to the step's theme without shouting. */}
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 w-0.5 ${
            isFirstTheme
              ? "bg-gradient-to-b from-indigo-400/70 via-indigo-500/40 to-transparent"
              : "bg-gradient-to-b from-violet-400/70 via-violet-500/40 to-transparent"
          }`}
        />
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isFirstTheme ? "bg-indigo-400" : "bg-violet-400"
            }`}
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            What happens in this step
          </p>
        </div>
        <ul className="mt-3.5 space-y-2.5">
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
                  className={`text-[13.5px] leading-relaxed sm:text-[13px] ${
                    kind === "cross" ? "text-slate-400" : "text-slate-200"
                  }`}
                >
                  {text}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    )}

    {step.paths && (
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {step.paths.map((p) => (
          <div
            key={p.label}
            className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
          >
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-indigo-300">
              {p.label}
            </p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-slate-300">
              {p.description}
            </p>
          </div>
        ))}
      </div>
    )}

    <JourneyWhyMatters step={step} />

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
                <p className="text-[14.5px] font-semibold text-slate-50">
                  {v.title}
                </p>
                {v.description && (
                  <p className="mt-1 text-[13.5px] leading-relaxed text-slate-400">
                    {v.description}
                  </p>
                )}
                {hasBullets && (
                  <ul className="mt-2.5 space-y-1.5">
                    {v.bullets!.map((b, bi) => (
                      <li
                        key={bi}
                        className="flex items-start gap-2 text-[13.5px] leading-relaxed text-slate-300"
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
                          <p className="text-[13.5px] font-semibold text-slate-100">
                            {s.label}
                          </p>
                        </div>
                        <p className="mt-1 text-[13.5px] leading-relaxed text-slate-400">
                          {s.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {v.conclusion && (
                  <p className="mt-3 text-[13.5px] leading-relaxed text-slate-300">
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
              className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-200"
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
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
              The goal
            </p>
            <p className="mt-1 text-[15.5px] font-semibold leading-snug text-slate-50">
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
                  <p className="text-[15px] font-semibold leading-snug text-slate-100">
                    {idea.text}
                  </p>
                  {idea.meta && (
                    <p className="mt-0.5 text-[12.5px] italic leading-relaxed text-slate-400">
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
                      className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-slate-300"
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
                      className="flex flex-wrap items-baseline gap-x-2 text-[14px] leading-relaxed"
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
        <p className="mb-4 text-[15px] leading-relaxed text-slate-300">
          {step.nextSteps.intro}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {step.nextSteps.paths.map((p, pi) => (
            <div
              key={pi}
              className="rounded-xl border border-violet-500/25 bg-violet-500/5 px-4 py-4"
            >
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-violet-300">
                {p.label}
              </p>
              <ul className="mt-3 space-y-2">
                {p.items.map((item, ii) => (
                  <li
                    key={ii}
                    className="flex items-start gap-2.5 text-[14px] leading-relaxed text-slate-200"
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
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
          Key insight
        </p>
        <p className="mt-2 text-[16px] font-semibold leading-snug text-slate-50 sm:text-[14.5px]">
          {step.keyInsight.headline}
        </p>
        {step.keyInsight.bullets && step.keyInsight.bullets.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {step.keyInsight.bullets.map((b, bi) => (
              <li
                key={bi}
                className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-slate-300"
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
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
          Key takeaway
        </p>
        <p className="mt-2 text-[17px] font-semibold leading-snug text-slate-50 sm:text-[15.5px]">
          {step.keyTakeaway.headline}
        </p>
        {step.keyTakeaway.subtext && (
          <p className="mt-3 text-[14.5px] italic leading-relaxed text-slate-300">
            {step.keyTakeaway.subtext}
          </p>
        )}
      </div>
    )}
  </motion.article>
  );
};

// Parent-level row: owns the step's useInView observer and passes the active
// state to both the rail dot and the step card, keeping them in sync.
const JourneyStepRow = ({
  step,
  isFirstTheme,
  themeLabel,
  onOpenDiscussion,
}: {
  step: JourneyStep;
  isFirstTheme: boolean;
  themeLabel: string;
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
      // Animating only opacity here (no `scale`) — a `scale` animation would
      // apply `transform` on this element, which creates a containing block
      // for fixed/sticky descendants and would break the Step 5 sticky CTA.
      animate={{ opacity: isActive ? 1 : 0.7 }}
      transition={{ duration: 0.5, ease: PREMIUM_EASE }}
      className="relative pl-10 sm:pl-14"
    >
      <motion.div
        aria-hidden="true"
        animate={{
          scale: isActive ? 1.06 : 1,
          boxShadow: isActive ? activeGlow : restGlow,
        }}
        transition={{ duration: 0.4, ease: PREMIUM_EASE }}
        className={`absolute left-0 top-5 flex h-8 w-8 items-center justify-center rounded-full text-[11.5px] font-semibold text-white ring-1 ring-inset ring-white/15 sm:top-6 sm:h-10 sm:w-10 sm:text-[11.5px] ${dotBg}`}
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
        isFirstTheme={isFirstTheme}
        themeLabel={themeLabel}
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
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24 lg:py-28">
        <SectionReveal>
          <SectionHeader
            number="02"
            eyebrow="Ideal onboarding journey"
            title="A research-backed journey based on how participants actually approached messaging."
            intro="Across sessions, users followed a consistent pattern: first proving the product works, then moving toward setup, integration, and go-live. This journey reflects that progression, organised into two themes:"
            introBullets={[
              "Theme 1 focuses on proving value.",
              "Theme 2 focuses on getting ready for production.",
            ]}
          />
          {/* Important note — frames the journey as a research artefact, not
              a build spec. Sits inside the section reveal so it animates in
              with the header. Amber accent so it reads as guidance, not just
              another paragraph. */}
          <div className="mt-8 mb-12 flex max-w-3xl items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.05] px-5 py-4 sm:mb-16">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
              strokeWidth={2.25}
            />
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                Important note
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-amber-100/90 sm:text-[14.5px]">
                This journey is based on observed user behaviour. It’s designed
                to help us understand user needs and decision points, not to be
                implemented as-is.
              </p>
            </div>
          </div>
        </SectionReveal>

        <div ref={railRef} className="relative mx-auto">
          {/* Background rail — full length, muted */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[15px] top-5 bottom-5 w-px bg-slate-800 sm:left-[19px]"
          />
          {/* Filled progress rail — grows as the user scrolls through the
              journey, anchored to the top so it extends downward.
              Toned down: muted gradient, no shadow glow. */}
          <motion.div
            aria-hidden="true"
            style={{ scaleY: fillProgress }}
            className="pointer-events-none absolute left-[15px] top-5 bottom-5 w-px origin-top bg-gradient-to-b from-indigo-400/70 via-indigo-500/60 to-violet-500/50 sm:left-[19px]"
          />

          <ol className="space-y-7">
            {JOURNEY.flatMap((theme, ti) => {
              const isFirstTheme = ti === 0;
              const themeAccent = isFirstTheme
                ? "text-indigo-300"
                : "text-slate-300";

              return [
                /* Theme 2 transition card — unified panel that holds both
                   the "Customers made a decision" framing and the Theme 2
                   intro inside one violet-tinted block. Reads as one
                   moment in the journey instead of two stacked decorations.
                   For Theme 1 (no phase shift) the simple inline label is
                   used below, unchanged. */
                ...(ti > 0
                  ? [
                      <li
                        key={`${theme.id}-transition`}
                        className="relative pl-10 pt-16 sm:pl-14 sm:pt-20"
                      >
                        <div className="overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.10] via-indigo-500/[0.05] to-transparent shadow-[0_24px_60px_-32px_rgba(139,92,246,0.4)]">
                          {/* Top half — phase-shift narrative */}
                          <div className="px-6 py-6 sm:px-8 sm:py-7">
                            <div className="flex items-center gap-3">
                              <span
                                aria-hidden="true"
                                className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/40 to-violet-400/70"
                              />
                              <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/[0.08] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-violet-200">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.7)]" />
                                Phase shift
                              </span>
                              <span
                                aria-hidden="true"
                                className="h-px flex-1 bg-gradient-to-l from-transparent via-violet-500/40 to-violet-400/70"
                              />
                            </div>
                            <p className="mt-5 text-center text-[18px] font-semibold leading-snug text-violet-50 sm:text-[20px]">
                              Customers made a decision.
                            </p>
                            <p className="mx-auto mt-2 max-w-xl text-center text-[12.5px] leading-relaxed text-violet-200/80 sm:text-[13px]">
                              The journey moves from{" "}
                              <em className="not-italic font-semibold text-violet-100">
                                proving value
                              </em>{" "}
                              to{" "}
                              <em className="not-italic font-semibold text-violet-100">
                                getting ready for production
                              </em>
                              .
                            </p>
                          </div>
                          {/* Divider — internal separator inside the card */}
                          <div
                            aria-hidden="true"
                            className="h-px bg-gradient-to-r from-transparent via-violet-500/25 to-transparent"
                          />
                          {/* Bottom half — Theme 2 intro */}
                          <div className="px-6 py-5 sm:px-8 sm:py-6">
                            <p className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.7)]" />
                              {theme.label}
                            </p>
                            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-slate-300 sm:text-[14px]">
                              {theme.subtitle}
                            </p>
                          </div>
                        </div>
                      </li>,
                    ]
                  : [
                      <li
                        key={`${theme.id}-label`}
                        className="relative pl-10 sm:pl-14"
                      >
                        {/* Theme waypoint dot — keeps Theme 1 anchored to
                            the journey rail (Theme 2 uses the unified card
                            above instead). */}
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 shadow-[0_0_0_4px_rgb(2_6_23)] sm:h-10 sm:w-10"
                        >
                          <span className="h-3 w-3 rounded-full bg-indigo-400 ring-1 ring-indigo-300/40 shadow-[0_0_12px_rgba(129,140,248,0.7)]" />
                        </span>
                        <p
                          className={`text-[11.5px] font-semibold uppercase tracking-[0.18em] ${themeAccent}`}
                        >
                          {theme.label}
                        </p>
                        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-slate-400">
                          {theme.subtitle}
                        </p>
                      </li>,
                    ]),
                ...theme.steps.map((s) => (
                  <JourneyStepRow
                    key={s.id}
                    step={s}
                    isFirstTheme={isFirstTheme}
                    themeLabel={theme.label}
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
  onViewSource: _onViewSource,
}: {
  onViewSource: (t: Transcript) => void;
}) => (
  <section className="relative overflow-hidden border-b border-slate-800/60 bg-slate-900">
    <GlowOrb color="indigo" size="lg" className="left-[-10%] top-[20%]" delay />
    <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24 lg:py-28">
      <SectionReveal>
        <SectionHeader
          number="06"
          eyebrow="Design principles"
          title="Eight principles that should guide onboarding across RCS, SMS, and future channels."
        />
      </SectionReveal>

      <div className="space-y-5">
        {PRINCIPLES.map((p, i) => (
          <article
            key={p.id}
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-colors hover:border-indigo-500/30 sm:p-7 lg:p-8"
          >
            {/* Header: number badge + title */}
            <header className="flex items-baseline gap-4">
              <span className="font-serif text-base font-light tabular-nums leading-none text-indigo-400 sm:text-base">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[18px] font-semibold tracking-tight leading-snug text-slate-50 sm:text-[17px] lg:text-[21px]">
                {p.title}
              </h3>
            </header>

            {/* Lead — the principle's statement */}
            <p className="mt-3 text-[14px] leading-relaxed text-slate-300 sm:text-[13.5px]">
              {p.lead}
            </p>

            {/* Two-card grid: design implication (action) + evidence (research) */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/[0.06] px-4 py-4">
                <p className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.7)]" />
                  Design implication
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-200 sm:text-[13px]">
                  {p.implication}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] px-4 py-4">
                <p className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  Evidence
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-200 sm:text-[13px]">
                  {p.evidence}
                </p>
              </div>
            </div>
          </article>
        ))}
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
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24 lg:py-28">
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
              <li key={b} className="flex gap-3 text-[14px] text-slate-200">
                <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="text-[14px] leading-relaxed text-slate-400">
            Every quote on this site comes from a real session transcript. The
            table below lists each session with a link to open its summary and
            indexed quotes. Swedish sessions are presented in English
            translation; the original wording is available on every quote card.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-slate-950 text-left text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">
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
                        className="inline-flex items-center gap-1 text-[11.5px] font-medium text-indigo-300 hover:text-indigo-200"
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
  { id: "summary", label: "Executive summary" },
  { id: "journey", label: "Ideal onboarding journey", children: JOURNEY_CHILDREN },
  { id: "principles", label: "Design principles" },
  { id: "data", label: "Research data & transcripts" },
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
          className="group flex items-center gap-2 text-[13px] font-semibold tracking-tight text-slate-50"
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
          <span className="font-mono text-[11px] tabular-nums text-slate-500">
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
              <ul className="ml-4 mt-0.5 mb-1 flex flex-col gap-0.5 border-l border-slate-800/80 pl-3 text-[11.5px]">
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
                        <span className="mt-px font-mono text-[10px] tabular-nums text-slate-600">
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
const SideNav = ({
  onOpenDiscussion,
}: {
  onOpenDiscussion?: () => void;
}) => {
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
          className="group flex items-center gap-2 text-[13px] font-semibold tracking-tight text-slate-50"
        >
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-400 to-violet-500 shadow-[0_0_22px_-4px_rgba(129,140,248,0.75)]">
            <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
          </span>
          <span className="leading-tight">
            <span className="block">Messaging</span>
            <span className="block text-[11.5px] font-medium text-slate-400">
              Research findings
            </span>
          </span>
        </a>

        {/* TOC */}
        <p className="mt-12 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Table of contents
        </p>
        <nav className="relative mt-3 flex flex-col gap-0.5 overflow-y-auto pr-1 text-[12.5px]">
          {NAV_ITEMS.map((n, i) => (
            <SideNavRow key={n.id} item={n} index={i} activeId={activeId} />
          ))}
        </nav>

        {/* Resource creation discussion — sits directly under the TOC's
            last entry ("Data"). Visible as its own block with a violet
            accent so it reads as a secondary entry point separate from the
            anchored sections above. */}
        {onOpenDiscussion && (
          <button
            type="button"
            onClick={onOpenDiscussion}
            className="group mt-3 flex w-full items-start gap-3 rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.10] via-indigo-500/[0.06] to-transparent px-3 py-2.5 text-left transition hover:border-violet-400/60 hover:from-violet-500/[0.18] hover:via-indigo-500/[0.10]"
          >
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/40">
              <ExternalLink className="h-2.5 w-2.5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                Deeper discussion
              </span>
              <span className="mt-0.5 block text-[12.5px] font-medium leading-snug text-slate-100 group-hover:text-white">
                Resource creation: timing & ownership
              </span>
            </span>
            <ArrowRight className="mt-1 h-3 w-3 shrink-0 text-violet-300/70 transition group-hover:translate-x-0.5 group-hover:text-violet-200" />
          </button>
        )}

        {/* Scroll progress */}
        <div className="mt-auto pt-8">
          <div className="flex items-center justify-between text-[10.5px] font-mono tabular-nums text-slate-500">
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

const Footer = () => (
  <footer className="bg-slate-900">
    <div className="mx-auto max-w-6xl px-6 py-12 text-[13px] text-slate-400">
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
      <SideNav onOpenDiscussion={() => setDiscussionOpen(true)} />
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
        <div id="principles">
          <Principles onViewSource={setOpenTranscript} />
        </div>
        <div id="data">
          <DataTransparency onOpen={setOpenTranscript} />
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
