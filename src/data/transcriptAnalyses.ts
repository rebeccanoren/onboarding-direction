import type { TranscriptAnalysis } from "../types";

export const transcriptAnalyses: TranscriptAnalysis[] = [
  {
    transcriptId: "t01",
    userGoal:
      "The user entered with a clear goal: send a message to their own phone to verify that RCS works. They were not trying to set up resources or understand system architecture upfront.",
    concepts: [
      {
        concept: "Onboarding app",
        whatHappened: [
          "The user went through a more structured onboarding flow.",
          "They were asked to enter a phone number, create access keys, and interact with apps and webhooks.",
          "They eventually managed to send a message.",
        ],
        issues: [
          {
            title: "Setup introduced too early",
            points: [
              "Access keys and configuration appeared before value was proven.",
              "Even though the user understood these concepts, they questioned why they were needed at this stage.",
              "This created friction during what they expected to be a quick test.",
            ],
            supportingQuoteIds: ["q003"],
          },
          {
            title: "Testing mixed with setup",
            points: [
              "The flow combined testing with real setup steps.",
              "The user described the page as doing both: testing a message and setting up a real integration.",
              "This made it unclear what was actually required vs optional.",
            ],
            supportingQuoteIds: ["q066"],
          },
          {
            title: "Webhooks introduced without context",
            points: [
              "Webhooks appeared as a step during testing.",
              "The user understood webhooks conceptually but didn’t understand why they were needed now or where they should be configured.",
              "This made the step feel premature and unnecessary for testing.",
            ],
            supportingQuoteIds: ["q067", "q068", "q004"],
          },
        ],
      },
      {
        concept: "RCS Getting started 1.0",
        whatHappened: [
          "The user was given a pre-created “Test RCS Agent.”",
          "They could send a message more quickly, with less friction.",
        ],
        whatWorked: [
          "Faster path to sending a message.",
          "Better overview of delivery states, message logs, payload, and events.",
          "Stronger support for understanding system behaviour after sending.",
        ],
        issues: [
          {
            title: "Test agent caused confusion about ownership and state",
            points: [
              "The user initially assumed the test agent was just for testing — which was correct.",
              "But once inside, the experience shifted toward configuring the agent, preparing for approval, and setting up production-like details.",
              "This created confusion: Is this a temporary test resource or my real agent? Why am I configuring something I didn’t create? Am I testing or preparing to go live?",
            ],
            supportingQuoteIds: ["q069", "q070", "q071"],
          },
        ],
        expected: [
          "A test agent for experimentation.",
          "A separate flow to create their own real agent.",
        ],
      },
    ],
    crossCutting: {
      title: "Unclear boundary between test and real setup",
      intro:
        "Across both Onboarding app and RCS Getting started 1.0, the same core issue appeared. In both experiences, the user struggled to understand:",
      bullets: [
        "What is temporary vs persistent.",
        "What is simulated vs real.",
        "When they are just testing vs when they are setting up for production.",
      ],
      consequences: [
        "Hesitation during testing.",
        "Unnecessary cognitive load.",
        "Reduced clarity about next steps.",
      ],
    },
    behavioralPattern: [
      "Try to send a message immediately.",
      "Check delivery and logs.",
      "Look for API / code to reproduce it.",
      "Only then consider setup and integration.",
    ],
    keyTakeaway: {
      headline:
        "The product does not clearly separate “testing the product” from “setting up the product.”",
      body: [
        "Onboarding app created friction by introducing setup too early.",
        "RCS Getting started 1.0 reduced friction, but introduced confusion by giving a pre-created resource that looked like a real setup.",
      ],
      missingPiece: {
        title: "The missing piece is a clear distinction between:",
        items: [
          "A temporary, system-managed test experience.",
          "A user-owned, production setup.",
        ],
      },
      consequences: [
        "What they are responsible for.",
        "What they can ignore.",
        "When they are actually “getting started” vs “going live.”",
      ],
    },
  },
  {
    transcriptId: "t02",
    userGoal:
      "The user entered with a clear goal: quickly evaluate if RCS works and how easy it is to send a message.",
    userGoalContext: {
      intro:
        "Unlike the previous user, this person is slightly more “documentation-first”, but still aligned with the broader pattern:",
      bullets: [
        "Understand basics.",
        "See how to send a message.",
        "Test it with minimal setup.",
        "Then decide if it’s worth using.",
      ],
      closing:
        "They explicitly wanted a fast way to validate the product without needing to sign up fully or configure everything — a sandbox where they can test:",
      quote:
        "without account, without card details… just to see if this is interesting.",
    },
    concepts: [
      {
        concept: "RCS Getting started 1.0",
        conceptSubtitle: "Lovable-style test experience",
        whatHappened: [
          "Started by reading the documentation to understand how the API worked.",
          "Moved into the sandbox, copied the example request, and sent a test message.",
          "Inspected the request and response side-by-side and felt the task was complete.",
        ],
        whatWorked: [
          "Clear path to send a test message with minimal setup.",
          "Could copy working requests, see request + response, and inspect payloads.",
          "Felt like a true sandbox — removed the “wall” of sign-up, approval, and credit card.",
          "Strongly validated as a better first experience: faster than the current flow, removes friction, proves value early.",
        ],
        keyStrengths: [
          {
            title: "Fast validation of value",
            points: [
              "The user could quickly understand what the API does and how to send a message.",
              "They felt “done” after testing: send message → see that it works → understand the basic API.",
              "This aligns strongly with the broader insight: users don’t want a full setup, they want proof first.",
            ],
          },
          {
            title: "Strong developer experience",
            points: [
              "Loved copyable curl requests, clear request/response structure, and the ability to compare working requests.",
              "This matches how developers normally work.",
            ],
          },
          {
            title: "Clear separation of concerns (mostly)",
            points: [
              "The sandbox was perceived as a testing environment — not a production setup.",
              "This worked better than the previous test.",
            ],
          },
        ],
        issues: [
          {
            title: "RCS Getting started vs real product gap",
            points: [
              "The sandbox teaches the product capability, but not how the real dashboard works.",
              "After testing, users will still enter a complex real setup — agents, senders, real configuration.",
              "Risk: user thinks “this is easy” → then hits complexity later.",
            ],
            supportingQuoteIds: ["q073"],
          },
          {
            title: "Complexity is hidden, not explained",
            points: [
              "The user explicitly acknowledged that real setup is complex (webhooks, countries, approvals, etc.) — but the sandbox hides this.",
              "Tension: good for reducing friction early, but risks a mismatch with reality later.",
              "They questioned whether this complexity even belongs in the sandbox at all.",
            ],
            supportingQuoteIds: ["q074", "q011"],
          },
        ],
      },
      {
        concept: "Onboarding app",
        whatHappened: [
          "Followed the wizard-style flow from the get-started entry point.",
          "Added a phone number, then encountered fields like sender and access key during the test step.",
          "Dropped out of the wizard into supporting content and was unsure when the flow was complete.",
        ],
        issues: [
          {
            title: "Wizard vs documentation confusion",
            points: [
              "The user did not like mixing documentation into a wizard.",
              "They felt: too many clicks, unclear what is actionable vs informational, unclear when they are “done.”",
              "The flow looked like a step-by-step process, but many steps were just reading content.",
              "This created confusion: Is this something I need to do? Or just information?",
            ],
            supportingQuoteIds: ["q075", "q076"],
          },
          {
            title: "Test setup still slightly unclear",
            points: [
              "Fields like sender and access key appeared during the test scenario.",
              "The user expected these to be pre-filled or hidden in a test scenario.",
              "Reinforces the broader insight: even developers don’t want to configure resources during testing.",
            ],
            supportingQuoteIds: ["q077"],
          },
        ],
      },
    ],
    behavioralPattern: [
      "Look for documentation or explanation first.",
      "Understand how sending works.",
      "Find a way to test quickly (sandbox).",
      "Send message and inspect request/response.",
      "Stop once value is proven.",
    ],
    crossCutting: {
      title: "A great sandbox can prove value, but it does not replace onboarding.",
      intro:
        "The user did not want to continue into full setup. They considered the task complete after testing — but flagged that the path beyond testing isn’t addressed.",
      bullets: [
        "The sandbox successfully removes friction and proves value.",
        "But it creates a gap between “this looks easy” and “this is actually complex.”",
        "The product currently either shows too much complexity too early (old flow) or hides too much complexity (sandbox).",
      ],
      consequences: [
        "Users can test easily.",
        "But are not prepared for what comes next.",
      ],
    },
    keyTakeaway: {
      headline:
        "Solving onboarding is not just about making testing easy — it is about connecting testing → real usage in a clear, predictable way.",
      body: [
        "RCS Getting started 2.0 = excellent for evaluation and first value.",
        "Onboarding = needed for real setup and understanding system complexity.",
        "Right now, these two experiences are disconnected.",
      ],
      missingPiece: {
        title: "What’s missing — a clearer bridge between:",
        items: [
          "Testing the product (sandbox).",
          "Understanding how to actually use it in production (dashboard + setup).",
        ],
      },
    },
  },
  {
    transcriptId: "t03",
    userGoal:
      "The user entered with the goal to evaluate RCS as a channel and quickly understand if it’s something they can use.",
    userGoalContext: {
      intro: "They wanted:",
      bullets: [
        "A high-level understanding of what RCS is and what it enables.",
        "Then a quick way to test sending a message.",
        "Without needing to go through full setup.",
      ],
      closing:
        "They explicitly framed this as a quick evaluation task, not a deep integration:",
      quote: "I just want to know if I can achieve what I want with Sinch.",
    },
    concepts: [
      {
        concept: "Onboarding app",
        conceptSubtitle: "Step-by-step / wizard flow",
        mainReaction:
          "The experience felt too heavy, too long, and misaligned with the goal of “getting started.”",
        whatHappened: [
          "Entered the wizard expecting a quick way to evaluate RCS.",
          "Worked through the early steps but quickly felt overwhelmed by the volume of content and configuration.",
          "Hit access-key generation during what they expected to be a quick test, and questioned why it was needed.",
          "Skimmed and clicked forward just to finish, rather than engaging with the content.",
        ],
        issues: [
          {
            title: "“Getting started” feels like “going to production”",
            points: [
              "The flow contained many steps (up to ~16).",
              "The user reacted strongly: it felt overwhelming, and they questioned if all steps were required.",
              "They expected “getting started” to be fast, minimal, and focused on testing.",
              "Instead, it felt like full configuration and production setup.",
            ],
            supportingQuoteIds: ["q079", "q078"],
          },
          {
            title: "Too much information too early",
            points: [
              "The user repeatedly felt overloaded: too many concepts, too much text, too many steps.",
              "They described it as “too much information” and “I just want to be done.”",
              "Information was pushed at users instead of discovered.",
            ],
            supportingQuoteIds: ["q080"],
          },
          {
            title: "Unclear purpose of steps",
            points: [
              "Many steps looked like actions but were just informational.",
              "The user struggled to understand what they needed to do, what they could skip, and when they were “done.”",
              "This created friction: clicking through just to finish, not engaging with content.",
            ],
            supportingQuoteIds: ["q080"],
          },
          {
            title: "Access key confusion during testing",
            points: [
              "The user expected a quick test but was asked to create an access key.",
              "Why do I need this for a test? Is this a real integration step?",
              "They also raised security concerns: what the key is used for, how long it lives, why it exists in a test context.",
            ],
            supportingQuoteIds: ["q015", "q081"],
          },
          {
            title: "Lack of system understanding early",
            points: [
              "At the start, the user did not understand what RCS is in this context, how it relates to Conversation API, or what they can actually do.",
              "They expected a clearer introduction to available channels, capabilities, and use cases.",
            ],
            supportingQuoteIds: ["q014"],
          },
        ],
      },
      {
        concept: "RCS Getting started 1.0",
        conceptSubtitle: "Test-focused experience",
        mainReaction:
          "This felt much better aligned with their expectations.",
        whatHappened: [
          "Landed in a flow that immediately surfaced channel options and capabilities.",
          "Could see what Sinch can do without committing to the wizard sequence.",
          "Engaged directly with sending and observed feedback alongside the action.",
        ],
        keyStrengths: [
          {
            title: "Clear value and capability",
            points: [
              "The sandbox made it obvious what Sinch can do and what channels exist.",
              "Helped them understand the big picture quickly.",
            ],
          },
          {
            title: "Lower cognitive load",
            points: [
              "No long step-by-step flow.",
              "No feeling of “I must complete everything.”",
              "Felt lighter and more flexible.",
            ],
          },
          {
            title: "Action-driven experience",
            points: [
              "Sending a message felt like the core action.",
              "Feedback (logs, request/response) supported understanding.",
            ],
          },
          {
            title: "Better flow structure",
            points: [
              "Actions triggered results directly.",
              "No need to navigate through multiple steps.",
              "The user preferred interaction over navigation, and progressive discovery over forced sequence.",
            ],
          },
        ],
        issues: [],
      },
    ],
    crossCuttingInsights: [
      {
        title: "Strong reaction to step-based onboarding",
        body:
          "Step-by-step onboarding can feel like forced work, not helpful guidance — especially when steps are many, not all are required, and intent is unclear.",
        bulletsIntro: "The user disengaged when:",
        bullets: [
          "Steps are many.",
          "Not all are required.",
          "Intent is unclear.",
        ],
        supportingQuoteIds: ["q078"],
      },
      {
        title: "Testing vs setup is blurred",
        body:
          "Same as previous users: the user wanted to test quickly, but onboarding introduced setup, configuration, and production concepts. This created friction and confusion.",
      },
      {
        title: "Developers want control over information",
        body:
          "This user clearly preferred finding information when needed, not being forced through it. They are used to searching and discovering, not following a fixed path.",
        supportingQuoteIds: ["q083"],
      },
      {
        title: "Trust and security matter early",
        body:
          "Unique to this user: a strong sensitivity to security concepts. Access keys raised concerns about why they exist, how they are used, and whether they are safe — and unclear security led to skepticism.",
        supportingQuoteIds: ["q082"],
      },
    ],
    behavioralPattern: [
      "Try to understand what the product is (high-level).",
      "Look for a way to test quickly.",
      "Avoid heavy setup or long flows.",
      "Ignore or skip excessive steps.",
      "Stop once value is proven.",
    ],
    keyTakeaway: {
      headline:
        "“Getting started” must feel fast, lightweight, and focused on testing — not like a production checklist.",
      body: [
        "This user strongly reinforces and sharpens previous insights.",
      ],
      sections: [
        {
          title: "Core problems identified",
          items: [
            "Onboarding app: too long, too heavy, mixes testing and production.",
            "RCS Getting started 2.0: much better aligned with user intent.",
          ],
        },
        {
          title: "Users want",
          items: [
            "Quick validation.",
            "Minimal friction.",
            "Control over how they explore.",
          ],
        },
        {
          title: "They do not want",
          items: [
            "Long step-by-step flows.",
            "Early setup requirements.",
            "Production complexity upfront.",
          ],
        },
      ],
      closing:
        "If “getting started” feels like work, users will disengage or rush through it instead of learning.",
    },
  },
  {
    transcriptId: "t04",
    userGoal:
      "This junior developer entered with the goal to explore what RCS is and try sending a message.",
    userGoalContext: {
      intro: "Compared to more senior users, they:",
      bullets: [
        "Needed more conceptual guidance upfront.",
        "Relied more on the UI to understand what to do.",
        "Expected a clear, guided “first success” experience.",
      ],
    },
    concepts: [
      {
        concept: "Onboarding app",
        conceptSubtitle: "Step-by-step guide",
        mainReaction:
          "The experience felt structured and helpful, especially for a junior developer, but also confusing when technical concepts appeared without explanation.",
        whatHappened: [
          "Worked through the wizard, appreciating the visible step structure and progress feedback.",
          "Engaged comfortably until access keys, key secrets, and webhooks introduced unfamiliar terminology.",
          "Lost confidence when UI elements didn’t look interactive and when on-page imagery wasn’t clearly labelled.",
        ],
        keyStrengths: [
          {
            title: "Clear step-by-step guidance (important for junior)",
            points: [
              "The user appreciated seeing steps, knowing where they are, and getting progress feedback (green states).",
              "For a junior developer, this created confidence, reduced uncertainty, and a feeling of being guided.",
            ],
          },
          {
            title: "Clean and focused UI",
            points: [
              "Easy to follow visually.",
              "Felt like a clear workflow.",
              "Helped them understand: “this is what I’m supposed to do.”",
            ],
          },
          {
            title: "Helpful explanations of concepts",
            points: [
              "Delivery reports and webhooks were explained in a way they could follow.",
              "Examples (payloads, URLs) helped them connect theory to practice.",
            ],
          },
        ],
        issues: [
          {
            title: "Access key during testing (major issue)",
            points: [
              "The user did not understand what an access key is, what a key secret is, or why it’s needed in a test.",
              "Especially critical for a junior — they don’t have the mental model yet.",
              "They expected “just send a message” but encountered a technical requirement too early.",
              "They explicitly wanted an explanation of what the key is and why it exists.",
            ],
            supportingQuoteIds: ["q085"],
          },
          {
            title: "Technical terminology without support",
            points: [
              "Terms like key secret and webhook were not self-explanatory.",
              "The user needed inline explanations, tooltips, or simple definitions.",
            ],
            supportingQuoteIds: ["q085"],
          },
          {
            title: "Lack of control in the test",
            points: [
              "The user expected to write their own message.",
              "Instead, content felt predefined.",
              "For a junior, this reduces learning and sense of ownership.",
            ],
            supportingQuoteIds: ["q086"],
          },
          {
            title: "Unclear UI interactions",
            points: [
              "Some elements looked clickable but weren’t obvious — or looked like text.",
              "This created hesitation: “can I click this?”, “what does this do?”",
            ],
            supportingQuoteIds: ["q087"],
          },
          {
            title: "Confusion around what they are seeing",
            points: [
              "The user struggled to understand: is this real data? A preview? A screenshot?",
              "This uncertainty makes learning harder for juniors.",
            ],
            supportingQuoteIds: ["q088"],
          },
        ],
      },
      {
        concept: "RCS Getting started 1.0",
        conceptSubtitle: "Test-focused experience",
        mainReaction:
          "This felt much easier and more intuitive, especially for a junior developer.",
        whatHappened: [
          "Quickly understood what to do — RCS is right there, side-by-side with SMS.",
          "Clicked Send and saw an immediate toast confirming the action.",
          "Began designing brand details, but lost the thread when the flow shifted into agent approval and a $200 fee.",
        ],
        keyStrengths: [
          {
            title: "Easier entry point",
            points: [
              "Clear what to do and where to click.",
              "Less reading required.",
            ],
          },
          {
            title: "Immediate feedback",
            points: [
              "Sending a message clearly triggered a result.",
              "The user understood: “something happened.”",
              "This clarity was much stronger than in the onboarding flow.",
            ],
          },
          {
            title: "More interactive learning",
            points: [
              "Could try things and see results.",
              "Especially effective for juniors.",
            ],
          },
          {
            title: "Faster understanding of value",
            points: [
              "The user quickly understood what RCS does and what’s different from SMS.",
            ],
          },
        ],
        issues: [
          {
            title: "Confusing transition to real setup",
            points: [
              "After testing, the flow moved into creating a real agent, branding, and approval.",
              "This confused the user: “am I still testing or going live?”",
            ],
          },
          {
            title: "Hidden system requirements",
            points: [
              "The need for a Conversation API app was not clear.",
              "The user could not understand why sending didn’t work in some cases.",
              "Especially problematic for juniors — they cannot infer hidden dependencies.",
            ],
            supportingQuoteIds: ["q092"],
          },
          {
            title: "Unexpected cost barrier",
            points: [
              "Encountering a $200 fee during the flow broke the testing mindset and felt too heavy.",
              "The user expected free or limited testing.",
            ],
            supportingQuoteIds: ["q091"],
          },
          {
            title: "Navigation becomes unclear after testing",
            points: [
              "After initial success, the user didn’t know what to do next.",
              "Felt “lost” in the flow.",
            ],
            supportingQuoteIds: ["q090"],
          },
        ],
      },
    ],
    crossCuttingInsights: [
      {
        title: "Junior developers need stronger guidance",
        body:
          "Compared to more senior users, juniors rely more on clear structure, explanations, and visible system behaviour. They cannot infer missing concepts or fill in gaps themselves.",
      },
      {
        title: "Test vs setup confusion is amplified",
        body:
          "The same issue appears as with other users, but stronger: mixing test and production flows is more confusing for juniors because they don’t understand system boundaries yet.",
      },
      {
        title: "Learning happens through interaction",
        body:
          "This user clearly benefited from doing and seeing results — not from reading long explanations.",
        supportingQuoteIds: ["q089"],
      },
      {
        title: "Trust and clarity are critical early",
        body:
          "Unclear concepts (keys, security, setup) create confusion and hesitation. For juniors, this quickly leads to loss of confidence.",
      },
    ],
    behavioralPattern: [
      "Look for clear guidance.",
      "Follow steps carefully.",
      "Try to understand concepts along the way.",
      "Learn by interacting.",
      "Get confused when concepts are unexplained or system behaviour is unclear.",
    ],
    keyTakeaway: {
      headline:
        "Junior developers need both structure and simplicity — but not early technical complexity.",
      sections: [
        {
          title: "Main issues",
          items: [
            "Onboarding: good structure, but introduces concepts too early.",
            "RCS Getting started 2.0: great for learning and testing, but unclear transition to real setup.",
          ],
        },
        {
          title: "Juniors benefit from",
          items: [
            "Step-by-step guidance.",
            "Interactive actions.",
            "Clear explanations.",
          ],
        },
        {
          title: "They struggle when",
          items: [
            "Technical concepts appear without context.",
            "System relationships are hidden.",
            "Test flows turn into production setup.",
          ],
        },
      ],
      closing:
        "Start simple, guide clearly, and introduce complexity only when the user is ready — especially for junior developers.",
    },
  },
  {
    transcriptId: "t05",
    userGoal:
      "The user entered with the goal to understand RCS and quickly try sending a message, similar to other users.",
    userGoalContext: {
      intro: "They approached it as:",
      bullets: [
        "Exploring a new messaging capability (for a company like IKEA).",
        "Wanting to test first, then understand how to use it in production.",
      ],
    },
    concepts: [
      {
        concept: "RCS Getting started 1.0",
        conceptSubtitle: "Test-first flow",
        mainReaction:
          "The experience felt easy, intuitive, and well-organized.",
        whatHappened: [
          "Quickly found “Try RCS,” added a phone number, and sent a test message without needing to search.",
          "Inspected delivery states and payloads in the message log.",
          "Explored the message preview, templates, and the send-with-code option.",
        ],
        keyStrengths: [
          {
            title: "Very easy to get started",
            points: [
              "Quickly found “Try RCS,” added a phone number, and sent a message.",
              "Explicitly said it was easy to follow and the steps were clear and structured.",
            ],
          },
          {
            title: "Clear developer value from logs",
            points: [
              "Appreciated delivery states (queued, delivered) and payload details.",
              "Saw this as useful for debugging and validating behaviour.",
            ],
          },
          {
            title: "Good overall flow",
            points: [
              "The experience felt guided and not overwhelming.",
              "They didn't need to search or guess much.",
            ],
          },
        ],
        issues: [
          {
            title: "Message preview not obvious",
            points: [
              "The user expected to immediately see what the message looked like.",
              "The preview existed, but was not visually prominent and was missed at first.",
              "They had to search for it.",
            ],
            supportingQuoteIds: ["q095"],
          },
          {
            title: "Template limitations unclear",
            points: [
              "The user thought they must include media (image, rich card).",
              "They did not understand that text-only messages are possible.",
              "This created confusion about product capabilities and constraints.",
            ],
            supportingQuoteIds: ["q096"],
          },
          {
            title: "“Send with code” concept unclear",
            points: [
              "The user did not understand what the code tab actually does.",
              "They assumed they could paste their own code.",
              "Instead, it generates a request to run externally — a pattern they weren't familiar with.",
            ],
            supportingQuoteIds: ["q097"],
          },
        ],
      },
      {
        concept: "RCS Getting started 1.0",
        conceptSubtitle: "Transition to real setup (agent creation)",
        mainReaction:
          "After testing, the path to real production setup broke down — the user repeatedly got blocked or confused.",
        whatHappened: [
          "Tried to move from testing to creating their own real agent.",
          "Was unsure where to start, then misread “new RCS agent” as a new test agent.",
          "Created an agent but couldn't see its identity in the payload, and was surprised by the Conversation API app requirement.",
        ],
        issues: [
          {
            title: "Hard to find how to create a real agent",
            points: [
              "After testing, the user wanted to move to production and send messages to real customers.",
              "They could not easily find where to create their own agent.",
              "They explicitly searched for “where I can start the real one.”",
            ],
            supportingQuoteIds: ["q098", "q099"],
          },
          {
            title: "“New RCS agent” misunderstood",
            points: [
              "The label “new” caused confusion — user thought it meant a new test agent, not real setup.",
              "This delayed progression.",
            ],
            supportingQuoteIds: ["q100"],
          },
          {
            title: "Weak connection between test → real",
            points: [
              "The user expected their test message setup to carry over.",
              "But the relationship between test agent and real agent was unclear.",
            ],
          },
          {
            title: "Missing feedback after creating agent",
            points: [
              "After creating an agent, user expected to see it reflected in payload and message details.",
              "They specifically looked for the agent name (e.g. IKEA).",
              "When it wasn't visible, it reduced clarity and confidence.",
            ],
            supportingQuoteIds: ["q101"],
          },
          {
            title: "Conversation API dependency unclear",
            points: [
              "The requirement to connect a Conversation API app was not expected.",
              "Even though this user had some prior knowledge, they still said this would be confusing for others — it needs explanation.",
            ],
            supportingQuoteIds: ["q102"],
          },
          {
            title: "Unclear tabs and structure",
            points: [
              "Sections like Countries, Test numbers, and Integrate were hard to interpret.",
              "The user guessed meanings and was unsure what each section actually represents.",
            ],
            supportingQuoteIds: ["q103"],
          },
        ],
      },
      {
        concept: "Onboarding app",
        conceptSubtitle: "Step-based / documentation-style flow",
        mainReaction:
          "Better for understanding concepts in detail, but harder to act on — felt more like documentation than a workflow.",
        whatHappened: [
          "Followed the step-based flow and found explanations of RCS, pricing, APIs, and setup.",
          "Hit access key and message-edit friction during what they expected to be a quick test.",
          "Compared it to the sandbox and concluded the previous version was easier to work with for action.",
        ],
        keyStrengths: [
          {
            title: "Good for understanding concepts",
            points: [
              "Explained RCS, pricing, APIs, and setup.",
              "Felt more like documentation — easier to find information.",
            ],
            // (no quote — keyStrengths supports points only)
          },
        ],
        issues: [
          {
            title: "Requires access key too early",
            points: [
              "Same issue as other users: access key required during testing.",
              "The user explicitly said this should not be needed for a test — it should appear when moving to a real agent.",
            ],
            supportingQuoteIds: ["q105"],
          },
          {
            title: "No editable message",
            points: [
              "The user expected to write their own message.",
              "Instead, the test message was fixed.",
              "This reduced realism and the usefulness of the test.",
            ],
            supportingQuoteIds: ["q104"],
          },
          {
            title: "Too much upfront complexity",
            points: [
              "The user got stuck early — didn't understand keys or steps.",
              "They suggested: give basic info first, then allow testing, then go deeper.",
            ],
            supportingQuoteIds: ["q105"],
          },
          {
            title: "Feels like documentation, not action",
            points: [
              "The user described this flow as more informational.",
              "Compared to the sandbox: less interactive and harder to act on.",
            ],
            supportingQuoteIds: ["q106"],
          },
        ],
      },
    ],
    behavioralPattern: [
      "Find RCS entry point.",
      "Send test message quickly.",
      "Inspect logs and behaviour.",
      "Try to move to real usage.",
      "Get blocked by unclear navigation, unclear concepts, and hidden dependencies.",
    ],
    keyTakeaway: {
      headline:
        "The test experience works well — but the transition to real usage breaks down.",
      sections: [
        {
          title: "Main issues",
          items: [
            "RCS Getting started 2.0: easy to start, clear for testing.",
            "But unclear how to move to production, with a weak connection between test and real setup.",
          ],
        },
        {
          title: "Users want",
          items: [
            "Fast, guided testing.",
            "Clear feedback.",
            "Ability to experiment.",
          ],
        },
        {
          title: "They struggle when",
          items: [
            "Features are hidden or mislabelled.",
            "System relationships are unclear.",
            "Transition to real setup is not obvious.",
          ],
        },
      ],
      closing:
        "The biggest gap is not testing — it's helping users move from testing → real usage in a clear and predictable way.",
    },
  },
  {
    transcriptId: "t06",
    userGoal:
      "The user entered with the goal to understand how RCS works and quickly test sending a message, then move toward implementing it for their own company.",
    userGoalContext: {
      intro: "They clearly separated two intentions:",
      bullets: [
        "Test the capability first.",
        "Then figure out how to implement it properly.",
      ],
      quote: "not really having to set up, but to test it out.",
    },
    concepts: [
      {
        concept: "RCS Getting started 1.0",
        conceptSubtitle: "Test-first experience",
        mainReaction:
          "The experience felt intuitive, useful, and aligned with expectations for testing.",
        whatHappened: [
          "Quickly identified the channel page, opened RCS, and started a test message without confusion about intent.",
          "Inspected message logs and payloads, reasoned about message IDs, and connected UI events to webhook flows.",
          "After testing succeeded, looked for a way to move into real implementation and didn't find one.",
        ],
        keyStrengths: [
          {
            title: "Clear purpose: test the product",
            points: [
              "The user immediately understood this is a place to send a test message.",
              "No confusion about intent — “try it out” was clear.",
            ],
          },
          {
            title: "Strong developer value in logs and payloads",
            points: [
              "Actively inspected payloads and reasoned about message IDs and events.",
              "Used it to understand system behaviour and map how conversations work.",
            ],
          },
          {
            title: "Two-way messaging understood",
            points: [
              "Picked up the ability to reply and the inbound events.",
              "Connected UI → webhook → backend flow.",
            ],
          },
          {
            title: "Good mental model of system architecture",
            points: [
              "Inferred Conversation API as the sending layer and RCS agent as identity.",
              "Shows strong alignment with developer expectations.",
            ],
            // The mental-model line is supported via the second concept entry below.
          },
        ],
        issues: [
          {
            title: "No clear next step after testing (major issue)",
            points: [
              "After successfully testing, the user asked: “how do I go from here to starting the implementation for myself?”",
              "The page felt like a dead end.",
              "They expected a clear transition to “use this in my own project” / “create real setup.”",
            ],
            supportingQuoteIds: ["q107", "q027"],
          },
          {
            title: "Test vs real setup unclear",
            points: [
              "The user understood this is a test agent.",
              "But was unsure: can I continue from this? Do I need to create a new one?",
              "This created hesitation: what is reusable vs temporary?",
            ],
            supportingQuoteIds: ["q108"],
          },
          {
            title: "“Send with code” misunderstood",
            points: [
              "The user initially misinterpreted this feature.",
              "Did not clearly see how it connects to real implementation.",
              "Even after opening it, still lacked clarity on how to move from sandbox → real code usage.",
            ],
            supportingQuoteIds: ["q109"],
          },
        ],
      },
      {
        concept: "RCS Getting started 1.0",
        conceptSubtitle: "Transition to real setup (agent creation)",
        mainReaction:
          "Once inside the setup flow, the steps were straightforward — but the entry point was hidden.",
        whatHappened: [
          "Manually navigated back to find the real-agent creation entry.",
          "Worked through region, use case, compliance, and contact information without major friction.",
          "Connected the agent to a Conversation API app and reached the “ready to go live” state.",
        ],
        keyStrengths: [
          {
            title: "Setup flow itself is understandable",
            points: [
              "Once inside, the user could complete the steps.",
              "They understood regions, use case, and compliance.",
              "Described it as “pretty straightforward.”",
            ],
          },
        ],
        issues: [
          {
            title: "Hard to find entry into setup",
            points: [
              "Biggest issue in this session: there is no clear path from testing → setup.",
              "The user had to go back and search manually.",
            ],
            supportingQuoteIds: ["q028", "q027"],
          },
          {
            title: "Missing “start building” step",
            points: [
              "The user expected something like “Send your first real message” or “Create your own agent.”",
              "This step was missing from the test experience.",
            ],
            supportingQuoteIds: ["q108"],
          },
          {
            title: "Weak connection between test and real",
            points: [
              "The sandbox is clearly isolated.",
              "But not connected to the next step.",
              "User didn't know how the test relates to production setup.",
            ],
          },
          {
            title: "Conversation API dependency needs explanation",
            points: [
              "The user understood it (because of experience).",
              "But still said: it needs explanation.",
            ],
            supportingQuoteIds: ["q111"],
          },
        ],
      },
      {
        concept: "Onboarding app",
        conceptSubtitle: "Step-based / documentation-style flow",
        mainReaction: "Too much reading, not enough doing.",
        whatHappened: [
          "Followed the step-based flow and got useful explanations of APIs, agents, and pricing.",
          "Worked through fifteen steps but didn't feel anything had actually happened along the way.",
          "Compared it directly to the sandbox and preferred the latter for its self-service, action-driven style.",
        ],
        keyStrengths: [
          {
            title: "Good overview of concepts",
            points: [
              "Explains APIs, agents, and pricing.",
              "Helpful for deeper understanding.",
            ],
          },
        ],
        issues: [
          {
            title: "Passive experience (major issue)",
            points: [
              "The user described it as reading steps, not doing anything.",
            ],
            supportingQuoteIds: ["q112"],
          },
          {
            title: "Lack of progress and feedback",
            points: [
              "No sense of completion or progress.",
              "Compared to the sandbox: much weaker engagement.",
            ],
            supportingQuoteIds: ["q029"],
          },
          {
            title: "Separation between learning and doing",
            points: [
              "Information is disconnected from actions.",
              "User has to read → go elsewhere → act.",
              "This creates friction: harder to follow, harder to remember.",
            ],
            supportingQuoteIds: ["q113"],
          },
          {
            title: "Hard to understand where to act",
            points: [
              "User asked: where do I create the agent? Where do I actually do things?",
            ],
            supportingQuoteIds: ["q030"],
          },
        ],
      },
    ],
    crossCuttingInsights: [
      {
        title: "Strong validation of test-first approach",
        body:
          "The sandbox works very well — clear, actionable, and engaging.",
        supportingQuoteIds: ["q026"],
      },
      {
        title: "Biggest gap: no bridge to implementation",
        body:
          "This user highlights it very clearly: testing works, but there is no clear path to “now build this for real.”",
        supportingQuoteIds: ["q107"],
      },
      {
        title: "Developers want momentum",
        body:
          "After testing, they want to continue immediately — not go back and search for next steps.",
      },
      {
        title: "Doing > reading",
        body:
          "The user clearly prefers interactive flows over documentation-style onboarding.",
        supportingQuoteIds: ["q029", "q112"],
      },
    ],
    behavioralPattern: [
      "Identify RCS entry.",
      "Send test message.",
      "Inspect logs and payload.",
      "Understand system behaviour.",
      "Try to move to real implementation.",
      "Get blocked by missing transition.",
    ],
    keyTakeaway: {
      headline:
        "The product successfully enables testing, but fails to guide users into real implementation.",
      sections: [
        {
          title: "Main issues",
          items: [
            "RCS Getting started 2.0: excellent for testing, but ends abruptly.",
            "Onboarding: informative, but too passive.",
          ],
        },
        {
          title: "Users want",
          items: [
            "Fast testing.",
            "Clear feedback.",
            "Immediate next step.",
          ],
        },
        {
          title: "They struggle when",
          items: [
            "Testing feels disconnected from real usage.",
            "Setup entry points are hidden.",
            "Onboarding is too theoretical.",
          ],
        },
      ],
      closing:
        "The critical missing piece is a clear, immediate transition from “this works” → “now build it for real.”",
    },
  },
  {
    transcriptId: "t07",
    userGoal:
      "The user entered with a clear goal to understand RCS quickly, test sending a message, and then set up a real agent for their company.",
    userGoalContext: {
      intro: "They wanted to:",
      bullets: [
        "Understand RCS quickly.",
        "Test sending a message.",
        "Then set up a real agent for their company.",
      ],
      closing:
        "They followed a very natural flow: explore → test → integrate → go live.",
    },
    concepts: [
      {
        concept: "RCS Getting started 2.0",
        conceptSubtitle: "Step-by-step guided sandbox + agent creation",
        mainReaction:
          "This version felt like a clear improvement over previous onboarding experiences — more guided, less overwhelming, easier to understand what to do next.",
        mainReactionQuote:
          "I think it's definitely a step up… it walks you through… baby steps.",
        whatHappened: [
          "Tested a message in the UI, then explored the API request to understand implementation.",
          "Moved into agent creation, completed brand details, region, use case, compliance, and contact information.",
          "Connected the agent to a Conversation API app and submitted for approval — completed the full journey end-to-end.",
        ],
        keyStrengths: [
          {
            title: "Strong test → API → setup progression",
            points: [
              "The user clearly understood the flow: test in UI → explore API → create real agent.",
              "This aligns well with how developers actually think.",
              "They explicitly described the value: UI = “see what it can do,” API = “how to implement it.”",
            ],
          },
          {
            title: "Good balance between simplicity and depth",
            points: [
              "The UI test felt lightweight, not overwhelming.",
              "The API section added depth when needed.",
              "The user did not want technical details upfront, but appreciated them after testing.",
            ],
          },
          {
            title: "Clear, guided setup (major improvement)",
            points: [
              "The agent creation flow felt structured and easy to follow.",
              "The user understood why fields exist and what they are used for.",
              "This is a big improvement from earlier tests where compliance fields felt random and setup felt heavy.",
            ],
            supportingQuoteIds: ["q115"],
          },
          {
            title: "Reduced cognitive load",
            points: [
              "The user highlighted not being “thrown into the deep end.”",
              "The flow breaks down complexity step-by-step.",
            ],
            supportingQuoteIds: ["q116"],
          },
          {
            title: "Strong sense of progress and completion",
            points: [
              "The step-by-step flow made it clear what to do and reduced uncertainty.",
              "User felt: “I can't really go the wrong way.”",
              "This is especially important for less experienced users and cross-functional users.",
            ],
            supportingQuoteIds: ["q117"],
          },
          {
            title: "Good integration of business + technical concepts",
            points: [
              "The user could understand business fields (consent, use case) without confusion.",
              "Even as a developer, they found it “self-explanatory.”",
            ],
            supportingQuoteIds: ["q123"],
          },
        ],
        issues: [
          {
            title: "Weak visibility of key UI elements",
            points: [
              "The user initially missed the message preview (iframe).",
              "Focus was on input fields instead.",
              "Important feedback elements can be overlooked if not visually prioritized.",
            ],
            supportingQuoteIds: ["q118"],
          },
          {
            title: "API concepts need slight clarification",
            points: [
              "Minor confusion around access key vs key ID.",
              "The user inferred correctly, but had to guess.",
              "Naming and clarity could be improved.",
            ],
            supportingQuoteIds: ["q119"],
          },
          {
            title: "“Test vs production” still slightly implicit",
            points: [
              "The concept of sandbox vs real setup was understood, but not explicitly reinforced.",
              "User relied on prior developer knowledge.",
              "Opportunity: make this distinction clearer for less experienced users.",
            ],
          },
          {
            title: "Missing shortcut to “create your own”",
            points: [
              "The user noticed the instruction “create your own,” but expected a more direct link or shortcut.",
              "They wanted a faster path if they are ready to skip testing.",
            ],
            supportingQuoteIds: ["q033"],
          },
          {
            title: "Conversation API concept needs support",
            points: [
              "The user understood it, but explicitly noted others may not.",
              "They suggested a simple explanation or visual diagram.",
            ],
            supportingQuoteIds: ["q120", "q121"],
          },
          {
            title: "Minor UX improvements",
            points: [
              "Suggested persisting data between steps (nice-to-have).",
              "Clearer linking between actions.",
              "Not blockers, more polish.",
            ],
            supportingQuoteIds: ["q122"],
          },
        ],
      },
    ],
    behavioralPattern: [
      "Explore product entry.",
      "Send test message.",
      "Inspect logs and payload.",
      "Understand API usage.",
      "Move to create real agent.",
      "Complete setup.",
      "Submit for approval.",
    ],
    behavioralPatternNote: {
      title: "Key difference vs previous users",
      text: "This user successfully completed the full journey without getting stuck.",
    },
    keyTakeaway: {
      headline:
        "This test shows a major improvement in onboarding effectiveness.",
      body: [
        "The flow now supports the natural developer journey: test → understand → implement → go live.",
      ],
      sections: [
        {
          title: "What's working now",
          items: [
            "Clear progression.",
            "Guided setup.",
            "Reduced friction.",
            "Good balance of UI + API.",
            "Strong sense of control.",
          ],
        },
        {
          title: "What still needs refinement",
          items: [
            "Make key elements (preview, actions) more visible.",
            "Strengthen test vs production clarity.",
            "Add clearer shortcuts for advanced users.",
            "Improve explanation of core concepts (Conversation API, credentials).",
          ],
        },
      ],
      closing:
        "This version successfully solves the biggest problem from earlier tests: users can now move from testing to production without getting stuck.",
    },
  },
  {
    transcriptId: "t08",
    userGoal:
      "The user entered with the goal to evaluate RCS as a channel, send a test message quickly, and then understand how to integrate it into their own system.",
    userGoalContext: {
      intro: "They behaved like a typical developer:",
      bullets: [
        "Skim first.",
        "Try quickly.",
        "Only read when blocked.",
      ],
    },
    concepts: [
      {
        concept: "RCS Getting started 2.0",
        conceptSubtitle: "RCS Getting started 2.0 + agent creation + integration",
        mainReaction:
          "The experience felt logical and usable, but still had friction around concepts, repetition, and flow clarity.",
        mainReactionQuote:
          "Nothing that would cause me to rage quit… pretty good considering the amount of questions.",
        whatHappened: [
          "Scanned the page, picked RCS as the target channel, and went straight to send a test message.",
          "Was immediately drawn to the API request, then hit the missing-RCS-agent prerequisite and went back to set one up.",
          "Worked through compliance, contact info, and Conversation API connection, completing the full setup despite questioning several steps along the way.",
        ],
        keyStrengths: [
          {
            title: "Clear entry into testing",
            points: [
              "The user quickly found RCS and chose to test it.",
              "The entry point felt natural: “I'm gonna try out RCS.”",
              "Confirms that channel → test → explore works well.",
            ],
            supportingQuoteIds: ["q124"],
          },
          {
            title: "Strong developer instinct: go to API immediately",
            points: [
              "The user was immediately drawn to the API request.",
              "Saw it as simple and “easy to construct.”",
              "Reinforces that developers naturally move toward code and payloads early.",
            ],
            supportingQuoteIds: ["q125"],
          },
          {
            title: "Overall flow is understandable",
            points: [
              "The user could move through steps and complete setup.",
              "Even with many steps, they did not get stuck.",
              "Big improvement vs earlier versions: fewer dead ends, clearer progression.",
            ],
            supportingQuoteIds: ["q035"],
          },
          {
            title: "Setup is acceptable (despite complexity)",
            points: [
              "The user acknowledged that many steps are required, likely due to RCS constraints.",
              "They accepted the complexity — as long as it is explained.",
            ],
            supportingQuoteIds: ["q126"],
          },
          {
            title: "End-to-end journey works",
            points: [
              "Unlike earlier users, this user successfully tested, created an agent, and moved toward integration.",
              "The flow is now complete and usable, not just exploratory.",
            ],
            supportingQuoteIds: ["q127"],
          },
        ],
        issues: [
          {
            title: "“RCS agent” concept not understood early",
            points: [
              "The user hit a key issue: “I didn't create an RCS agent.”",
              "They had to go back and figure it out.",
              "Users expect either auto-creation or a clear upfront explanation.",
            ],
            supportingQuoteIds: ["q128"],
          },
          {
            title: "Too many repeated / redundant inputs",
            points: [
              "Same information asked multiple times.",
              "“Feels like stuff that has already been entered.”",
              "Creates unnecessary effort and reduces trust in flow efficiency.",
            ],
            supportingQuoteIds: ["q129"],
          },
          {
            title: "Unclear purpose of compliance questions",
            points: [
              "The user struggled to understand “why I would need to know this.”",
              "They questioned: is this for Sinch? Google? Themselves?",
              "Intent behind questions is unclear.",
            ],
            supportingQuoteIds: ["q130"],
          },
          {
            title: "Who is doing what? (ownership confusion)",
            points: [
              "The user was unsure who they are interacting with: Sinch, Google, or operators.",
              "“I'm not sure who is going to reach out to me.”",
              "Creates trust issues and mental model gaps.",
            ],
            supportingQuoteIds: ["q131"],
          },
          {
            title: "Conversation API concept still too implicit",
            points: [
              "Even with prior knowledge, the user said: “Give me RCS… app is a detail I don't need yet.”",
              "Reinforces a key insight: core architecture leaks too early.",
            ],
            supportingQuoteIds: ["q036"],
          },
          {
            title: "Webhooks introduced too early",
            points: [
              "Strong signal: “I don't really care about webhooks until later.”",
              "User expectation: 1) send message → 2) see it on phone → 3) THEN explore webhooks.",
            ],
            supportingQuoteIds: ["q132"],
          },
          {
            title: "Missing immediate “send from my own agent”",
            points: [
              "After setup, the user wanted to immediately send from their own branded agent.",
              "This is critical — it's the main value of RCS.",
              "When not immediate, momentum is lost.",
            ],
            supportingQuoteIds: ["q037"],
          },
          {
            title: "Some concepts unclear or telecom-heavy",
            points: [
              "Confusion around dispatch vs conversational and channel capabilities.",
              "User expected: “I can do everything.”",
              "Telecom constraints are not intuitive.",
            ],
            supportingQuoteIds: ["q133"],
          },
          {
            title: "Navigation and wayfinding issues",
            points: [
              "The user struggled to return to the app view and find the API again.",
              "Indicates weak system navigation and mental map.",
            ],
            supportingQuoteIds: ["q134"],
          },
        ],
      },
    ],
    behavioralPattern: [
      "Scan page quickly.",
      "Choose RCS.",
      "Try to send message.",
      "Jump to API immediately.",
      "Get blocked by missing concepts (agent, app).",
      "Continue through setup.",
      "Want to test real setup immediately.",
      "Move toward integration.",
    ],
    keyTakeaway: {
      headline:
        "The flow is now complete — but still not fully intuitive.",
      body: [
        "This test highlights a very important shift: users can complete the full journey, but still question concepts, guess meanings, and lack a clear mental model.",
      ],
      sections: [
        {
          title: "What's working now",
          items: [
            "Users can complete the full journey.",
            "Users can understand the main steps.",
            "Testing → setup → integration is possible.",
            "No major blockers.",
          ],
        },
        {
          title: "What still breaks",
          items: [
            "Core concepts still leak too early — RCS agent, Conversation API, and webhooks introduced before needed.",
            "Lack of clarity on “why” — why questions are asked, who requires them, what happens with the data.",
            "Momentum drops after setup — user wants immediate validation, but the flow delays that.",
            "Redundant input reduces trust — repeated fields, lack of prefill.",
          ],
        },
      ],
      closing:
        "This version solves usability — but not fully understanding. Users can now get through the flow and complete setup, but they still question concepts, guess meanings, and lack a clear mental model.",
    },
  },
  {
    transcriptId: "t09",
    userGoal:
      "The user entered with the goal to understand RCS from a business / marketing perspective, set up an agent, and try messaging — not to integrate or deal with technical implementation.",
    userGoalContext: {
      intro: "They approached this as a business user, not a developer:",
      bullets: [
        "Focused on branding, messaging, and use cases.",
        "Less concerned with APIs or system architecture.",
      ],
    },
    concepts: [
      {
        concept: "RCS Getting started 2.0",
        conceptSubtitle: "Non-developer (marketing / sales) perspective",
        mainReaction:
          "The experience felt very simple, clear, and usable for a non-developer — the first test where a non-dev can successfully navigate the flow without major friction.",
        mainReactionQuote:
          "This is pretty simple… pretty straightforward.",
        whatHappened: [
          "Walked through agent setup focusing on brand identity, color, and messaging.",
          "Engaged enthusiastically with rich-card templates and the in-message commerce experience.",
          "Hit confusion at access keys, app connection, and the “integrate” step — concepts that felt developer-only or optional.",
        ],
        keyStrengths: [
          {
            title: "Very strong simplicity and clarity",
            points: [
              "The user immediately understood what the product does and what actions to take.",
              "Flow felt intuitive and easy to follow.",
              "They explicitly said a non-developer could set this up without issues.",
            ],
            supportingQuoteIds: ["q135"],
          },
          {
            title: "Strong appeal for marketing use case",
            points: [
              "The user reacted very positively to branding (logo, colors) and message appearance.",
              "Clearly resonates with marketing personas and brand-focused users.",
            ],
            supportingQuoteIds: ["q038"],
          },
          {
            title: "Templates and rich messages are valuable",
            points: [
              "Rich cards and templates highlighted as highly useful — especially for retail, promotions, and interactive experiences.",
              "Seen as a key selling point of RCS.",
            ],
            supportingQuoteIds: ["q136"],
          },
          {
            title: "Clear step-by-step progression",
            points: [
              "The user always knew what to do next.",
              "Appreciated guided steps and structured flow.",
            ],
            supportingQuoteIds: ["q137"],
          },
          {
            title: "Message logs and feedback are valuable",
            points: [
              "The user liked delivery states and status tracking.",
              "Clear business value: debugging, understanding delivery, identifying issues.",
            ],
            supportingQuoteIds: ["q138"],
          },
          {
            title: "Summary step is appreciated",
            points: [
              "The overview / summary was seen as useful and clear.",
              "Suggested improvement: send it via email as confirmation.",
              "Shows the need for external validation and reassurance.",
            ],
            supportingQuoteIds: ["q040"],
          },
        ],
        issues: [
          {
            title: "Developer concepts (access key, API)",
            points: [
              "The user did not understand: “What would generating an access key do?”",
              "These concepts are unfamiliar and irrelevant to their goal.",
              "Even after explanation, still seen as developer-only territory.",
            ],
            supportingQuoteIds: ["q139"],
          },
          {
            title: "App / Conversation API connection (major issue)",
            points: [
              "Strong confusion around why the agent must be connected to an app: “Why would this not be automatic?”",
              "From their perspective: “I created the agent → why can't I send?”",
              "Mismatch — expectation: agent = ready to use. Reality: requires hidden technical setup.",
            ],
            supportingQuoteIds: ["q140", "q143"],
          },
          {
            title: "Integration step feels optional",
            points: [
              "The user interpreted “integrate” as optional, not required.",
              "Critical issue: they may stop before completing setup.",
              "They suggested making it explicit that integration is required to go live.",
            ],
            supportingQuoteIds: ["q141"],
          },
          {
            title: "Terminology inconsistency",
            points: [
              "Confusion between “conversational / non-conversational” and “dispatch / conversational.”",
              "Inconsistent language creates uncertainty.",
              "Suggested: use one consistent terminology across the flow.",
            ],
            supportingQuoteIds: ["q142", "q039"],
          },
          {
            title: "Ownership and system model unclear",
            points: [
              "The user was unsure how agent, app, and API relate.",
              "They tried to reason it out, but had to guess.",
              "Mental model is not clear.",
            ],
          },
        ],
      },
    ],
    behavioralPattern: [
      "Scan for simple actions.",
      "Create agent.",
      "Focus on branding and messaging.",
      "Follow guided steps.",
      "Ignore or question technical concepts.",
      "Get confused at integration step.",
    ],
    keyTakeaway: {
      headline:
        "Non-developers can now successfully go through most of the onboarding — until technical concepts appear.",
      body: [
        "This test highlights a critical success and a critical gap: non-developers can navigate clear, guided, business-aligned steps — but the moment technical concepts (app, API, access keys) surface, understanding breaks.",
      ],
      sections: [
        {
          title: "Success — non-devs can navigate the flow",
          items: [
            "Clear and guided.",
            "Aligned with business needs.",
            "Branding, messaging, and use cases land well.",
          ],
        },
        {
          title: "Gap — understanding breaks at technical concepts",
          items: [
            "App / API connection feels arbitrary.",
            "Access keys feel irrelevant.",
            "Integration step looks optional.",
          ],
        },
        {
          title: "Non-devs want",
          items: [
            "Simplicity.",
            "Branding control.",
            "Clear steps.",
            "Confirmation.",
          ],
        },
        {
          title: "They struggle when",
          items: [
            "Technical dependencies are exposed.",
            "Required steps look optional.",
            "System relationships are unclear.",
          ],
        },
      ],
      closing:
        "Most important insight: the experience works for non-devs until the system requires developer concepts.",
    },
  },
  {
    transcriptId: "t10",
    userGoal:
      "The user entered with the goal to quickly understand how to use the RCS API, test sending a message, and then integrate it into their own system.",
    userGoalContext: {
      intro:
        "User background — this user has previous experience with Sinch Build and had struggled with the platform in the past:",
      bullets: [
        "Tried to explore RCS and SMS a few months ago.",
        "Found it hard to navigate and understand.",
        "Needed support to complete tasks.",
        "Particularly struggled with finding IDs / credentials and understanding system structure.",
      ],
      closing:
        "In this session, they are effectively re-evaluating the product after previously having a poor experience. They are very API-focused and expect clear request structure, parameter explanations, and runnable examples — looking for:",
      quote:
        "list of all the API calls… parameters… what they are used for.",
    },
    concepts: [
      {
        concept: "RCS Getting started 2.0",
        conceptSubtitle: "Returning user with prior Sinch Build experience",
        mainReaction:
          "The user clearly recognizes a major improvement compared to their previous experience — onboarding is now structured and usable, navigation is much clearer, and key information is easier to find.",
        mainReactionQuote:
          "Really great… a lot compared to what I have experienced before.",
        whatHappened: [
          "Compared the current experience to their past frustration with Sinch Build, immediately noting it felt clearer.",
          "Moved quickly to the API request, inspected variables, and worked through the onboarding flow without needing support.",
          "Identified the centralised app page as a “game changer” for finding IDs and credentials in one place.",
        ],
        keyStrengths: [
          {
            title: "Significant improvement vs previous experience",
            points: [
              "The user explicitly compared past (confusing, hard to navigate) and current (clear and structured).",
              "Confirms the redesign is solving real historical pain points.",
            ],
            supportingQuoteIds: ["q064", "q144"],
          },
          {
            title: "Clear onboarding flow",
            points: [
              "Step-by-step process is easy to follow with no major blockers.",
              "User could complete setup independently.",
            ],
            supportingQuoteIds: ["q145"],
          },
          {
            title: "API playground matches developer expectations",
            points: [
              "Strong validation of request + payload visibility and variable structure.",
              "Aligns with how developers work.",
            ],
            supportingQuoteIds: ["q065"],
          },
          {
            title: "Centralised “app” view is a major improvement",
            points: [
              "Having project ID, app ID, and credentials in one place is highly valued.",
              "Described as a “game changer.”",
              "Directly addresses previous frustration: not knowing where to find things.",
            ],
            supportingQuoteIds: ["q146"],
          },
          {
            title: "Documentation linking is much better",
            points: [
              "User appreciated clear references and the ability to locate IDs and concepts.",
              "“This was very missing before.”",
            ],
            supportingQuoteIds: ["q147"],
          },
        ],
        issues: [
          {
            title: "API usability still requires interpretation",
            points: [
              "Variables not clearly marked — unclear what needs to be replaced.",
              "Slows down the first successful API call.",
            ],
            supportingQuoteIds: ["q148", "q060"],
          },
          {
            title: "Strong expectation for prefill",
            points: [
              "Because the user is logged in and has account context, they expect all credentials and IDs to be prefilled automatically.",
              "“They could prefill everything to simplify experience.”",
            ],
            supportingQuoteIds: ["q061"],
          },
          {
            title: "Missing developer tooling (Postman)",
            points: [
              "Explicit request for a downloadable Postman collection.",
              "Reflects real developer workflow needs.",
            ],
            supportingQuoteIds: ["q149"],
          },
          {
            title: "External dependencies still unclear",
            points: [
              "Confusion around Google requirements and country-specific rules.",
              "Onboarding explains the steps but not why or who requires them.",
            ],
            supportingQuoteIds: ["q150"],
          },
          {
            title: "Compliance fields lack clarity",
            points: [
              "User struggled to distinguish critical legal inputs from optional or informational fields.",
              "The importance of fields is not communicated.",
            ],
            supportingQuoteIds: ["q062", "q063"],
          },
          {
            title: "System complexity still visible",
            points: [
              "User noted multiple layers (project, app, agent).",
              "Even though onboarding improves guidance, underlying complexity still leaks.",
            ],
            supportingQuoteIds: ["q151"],
          },
          {
            title: "Missing error handling guidance",
            points: [
              "Flow shows the success case but not failure scenarios.",
              "User expected troubleshooting support.",
            ],
            supportingQuoteIds: ["q152"],
          },
        ],
      },
    ],
    behavioralPattern: [
      "Compare current experience to past.",
      "Scan onboarding quickly.",
      "Move to API early.",
      "Inspect request and variables.",
      "Complete setup.",
      "Look for integration entry point.",
      "Use app page as main hub.",
    ],
    behavioralPatternNote: {
      title: "Returning user perspective",
      text: "This user previously needed support to complete tasks. In this session they completed the full onboarding independently — a strong validation that the redesign solves real historical usability issues.",
    },
    keyTakeaway: {
      headline:
        "The redesign successfully fixes major usability issues from the previous version.",
      body: [
        "The remaining gaps are now primarily in developer efficiency and clarity, not basic usability.",
      ],
      sections: [
        {
          title: "What's working now",
          items: [
            "Onboarding is usable.",
            "Navigation is clear.",
            "Key information is discoverable.",
            "End-to-end flow is possible.",
          ],
        },
        {
          title: "What still needs improvement",
          items: [
            "API clarity (variables, structure).",
            "Prefill and automation.",
            "Developer tooling (Postman).",
            "Explanation of external dependencies.",
            "Clear prioritization of compliance inputs.",
          ],
        },
        {
          title: "Most important insight",
          items: [
            "Returning users can now succeed without support — but still need help to move fast and confidently with the API.",
          ],
        },
      ],
      closing:
        "A previously frustrated user now succeeds with onboarding, confirming major improvement, but still encounters friction when moving into real API usage.",
    },
  },
  {
    transcriptId: "t11",
    userGoal:
      "The user entered with the goal to explore RCS as a new channel, try sending a message quickly, and then understand how to use it programmatically.",
    userGoalContext: {
      intro: "They behaved like a typical developer:",
      bullets: [
        "Start with the UI to understand.",
        "Then move to code and API usage.",
      ],
    },
    concepts: [
      {
        concept: "RCS Getting started 2.0",
        conceptSubtitle:
          "External developer (first-time user) — strongest validation of the new direction",
        mainReaction:
          "The experience felt very clear, structured, and easy to follow, especially for a first-time user.",
        mainReactionQuote:
          "The UI was pretty straightforward… everything was structured in a clear way.",
        whatHappened: [
          "Scanned the landing page, immediately self-selected RCS, and chose “send test message” without hesitation.",
          "Used the UI to send, then switched to the code tab to inspect the payload — exactly the test → API → code flow RCS Getting started 2.0 was designed for.",
          "Inspected message logs and the API playground, then moved into agent creation and completed setup, only hitting conceptual confusion at the Conversation API connection step.",
        ],
        keyStrengths: [
          {
            title: "Extremely clear entry point and flow",
            points: [
              "Immediately understood where to click (RCS) and chose “send test message” naturally.",
              "Only had to make one decision: test vs create agent.",
              "Strong validation of low-friction entry into testing.",
            ],
            supportingQuoteIds: ["q155", "q156"],
          },
          {
            title: "UI + code duality is highly valued",
            points: [
              "Strongly validated having both UI (simple) and code (technical).",
              "Non-technical users → UI; developers → code.",
              "Clearly articulated the value of supporting both at the same time.",
            ],
            supportingQuoteIds: ["q042"],
          },
          {
            title: "API playground is very strong",
            points: [
              "Prefilled requests were seen as easy to use and low effort.",
              "Clear workflow: copy → paste → run.",
              "Edit-in-UI capability reduces the risk of mistakes.",
            ],
            supportingQuoteIds: ["q157"],
          },
          {
            title: "Message logs are extremely valuable",
            points: [
              "One of the strongest signals in the session.",
              "Logs reduce support needs, give full transparency, and help debug issues.",
              "Specifically valued: delivery states (queued, delivered), payload visibility, and the ability to copy / share data.",
            ],
            supportingQuoteIds: ["q158", "q041"],
          },
          {
            title: "System feedback builds trust",
            points: [
              "User could see exactly what happened and understand the message lifecycle.",
              "Connected this to real operational value: fewer support tickets.",
            ],
          },
          {
            title: "Inline explanations work well",
            points: [
              "Tooltips clarified unknown fields (e.g. contact ID).",
              "Progressive disclosure works effectively.",
            ],
            supportingQuoteIds: ["q159"],
          },
          {
            title: "Overall transparency is a major strength",
            points: [
              "Repeatedly emphasised: everything is visible, nothing hidden.",
              "Builds confidence and understanding.",
            ],
            supportingQuoteIds: ["q160"],
          },
        ],
        issues: [
          {
            title: "Initial decision: test vs create agent",
            points: [
              "User questioned whether users should know whether to test or create an agent first.",
              "Even though they chose correctly, this introduces hesitation.",
            ],
            supportingQuoteIds: ["q161"],
          },
          {
            title: "Some UI elements unclear (button, card types)",
            points: [
              "Minor confusion around button-label purpose and message-type selection.",
              "Not blockers — but unclear for new users.",
            ],
          },
          {
            title: "Some concepts not fully understood (but tolerated)",
            points: [
              "The user could proceed but relied on prior knowledge.",
              "Important nuance: confusion is accepted, not blocking.",
            ],
            supportingQuoteIds: ["q164"],
          },
          {
            title: "API credentials understanding varies",
            points: [
              "Even experienced users may struggle with authentication.",
              "Authentication still needs clearer guidance.",
            ],
            supportingQuoteIds: ["q162"],
          },
          {
            title: "Payload display may be overly detailed",
            points: [
              "Repeated payloads for each event were seen as redundant.",
              "User suggestion: show one payload, then status + timestamps.",
            ],
            supportingQuoteIds: ["q163"],
          },
          {
            title: "Webhook concept requires context",
            points: [
              "Initially unclear why payloads are shown.",
              "Became clear only after explanation.",
              "Context is required for advanced concepts.",
            ],
          },
          {
            title: "Conversation API connection unclear for new users",
            points: [
              "Explicitly: if you don't know what Conversation API is, there might be doubt.",
              "Important distinction: not a UI issue — a conceptual model issue.",
            ],
            supportingQuoteIds: ["q164"],
          },
        ],
      },
    ],
    behavioralPattern: [
      "Scan landing page.",
      "Choose RCS immediately.",
      "Select “send test message.”",
      "Use UI to explore.",
      "Switch to code for deeper understanding.",
      "Inspect logs and payload.",
      "Try API playground.",
      "Move to agent creation.",
      "Complete setup.",
      "Encounter conceptual gaps (API connection).",
    ],
    behavioralPatternNote: {
      title: "First-time external developer perspective",
      text: "This user completed the entire RCS Getting started 2.0 journey end-to-end without any major blocker — the strongest validation yet that the flow works for someone arriving cold to the platform.",
    },
    keyTakeaway: {
      headline:
        "The experience is clear, usable, and supports both technical and non-technical users effectively.",
      body: [
        "This is one of the strongest validations of the new direction. You've successfully created an experience where users can explore, test, and understand without friction — even if they don't fully understand the system yet.",
      ],
      sections: [
        {
          title: "What's working extremely well",
          items: [
            "Clear entry point.",
            "Minimal decisions.",
            "UI + API combined.",
            "Prefilled API requests.",
            "Strong system feedback (logs).",
            "High transparency.",
            "Inline explanations.",
          ],
        },
        {
          title: "What still needs improvement",
          items: [
            "Clarify the initial decision (test vs create agent).",
            "Improve conceptual explanations (Conversation API, authentication, webhooks).",
            "Reduce unnecessary complexity (redundant payload display).",
            "Add light guidance for advanced concepts — explain “why this exists.”",
          ],
        },
        {
          title: "Most important insight",
          items: [
            "From confusion → to confidence and exploration.",
            "Users can succeed without fully understanding the system.",
          ],
        },
      ],
      closing:
        "A highly successful test-first experience where clarity, visibility, and the UI + API combination enable users to progress smoothly, with only minor conceptual gaps remaining.",
    },
  },
  {
    transcriptId: "t12",
    userGoal:
      "The user entered with the goal to quickly test RCS by sending a message, then move to API usage and integration, and explore how it could be used in a real application.",
    userGoalContext: {
      intro: "They showed a strong developer instinct: go from UI → curl → integration:",
      bullets: [
        "Try the UI to understand the product.",
        "Move to curl / the API for real usage.",
        "Then integrate into their own application.",
      ],
      quote:
        "My instinct could be just to open up a terminal and run this command in curl.",
    },
    concepts: [
      {
        concept: "RCS Getting started 2.0",
        conceptSubtitle:
          "Two-phase experience — strong test-first, breaks at ownership",
        mainReaction:
          "The experience is very smooth and user-friendly in the testing phase, but becomes confusing when moving into setup and integration.",
        mainReactionQuote:
          "That was actually super easy… I really liked how user friendly that flow was.",
        whatHappened: [
          "Clicked RCS, chose “send test message,” and validated the product without hesitation.",
          "Moved into the API playground, ran the request, and inspected the queued → delivered → read flow with real-time updates.",
          "Hit confusion at agent creation and the app step — got dropped into an app they didn't create, and found compliance fields tedious and out of order.",
        ],
        keyStrengths: [
          {
            title: "Strong test-first experience",
            points: [
              "Immediately chose “send test message” to validate the product.",
              "Sidestepped the unfamiliar “RCS agent” concept by going straight to the concrete action.",
              "Confirms test-first aligns perfectly with user expectations.",
            ],
            supportingQuoteIds: ["q173"],
          },
          {
            title: "UI + API combination works very well",
            points: [
              "Appreciated UI for exploration and API for real usage.",
              "Explicitly described the ideal flow: try UI once, then switch to API.",
            ],
            supportingQuoteIds: ["q165"],
          },
          {
            title: "API playground is highly effective",
            points: [
              "Strong validation of prefilled requests and auto-populated credentials.",
              "Appreciated the ability to run requests directly without leaving the UI.",
            ],
            supportingQuoteIds: ["q046", "q044"],
          },
          {
            title: "Real-time feedback builds confidence",
            points: [
              "Reacted positively to queued → delivered → read state transitions.",
              "Reinforces that feedback is critical to trust.",
            ],
            supportingQuoteIds: ["q166"],
          },
          {
            title: "Preview + logs are valuable",
            points: [
              "Liked the message preview and the ability to download JSON / copy data.",
              "Even when not fully understood, still perceived as useful.",
            ],
            supportingQuoteIds: ["q045"],
          },
          {
            title: "Separation of UI vs API is correct",
            points: [
              "Validated having two separate paths.",
              "Prevents overload for non-developers.",
            ],
            supportingQuoteIds: ["q167"],
          },
        ],
        issues: [
          {
            title: "“RCS agent” is not understood initially",
            points: [
              "Immediate confusion: “I don't know what an RCS agent is.”",
              "User avoided it by choosing test first — but the term itself is opaque.",
            ],
            supportingQuoteIds: ["q173"],
          },
          {
            title: "Integration step (major issue)",
            points: [
              "The biggest breakdown in the flow.",
              "User is dropped into an app they didn't create.",
              "“This part is confusing to me… I didn't actually set up a test app.”",
            ],
            supportingQuoteIds: ["q048"],
          },
          {
            title: "Lack of ownership over resources",
            points: [
              "User expects to create things themselves.",
              "Instead, the system creates them implicitly.",
              "Breaks the sense of control and the mental model.",
            ],
            supportingQuoteIds: ["q154"],
          },
          {
            title: "App concept is unclear due to timing",
            points: [
              "The concept itself is understood: “it makes sense to connect my application.”",
              "The issue is when and how it is introduced.",
              "Not a concept problem — a timing + ownership problem.",
            ],
            supportingQuoteIds: ["q172"],
          },
          {
            title: "Flow jumps without explanation",
            points: [
              "User gets redirected into app setup without context.",
              "Result: confusion about where they are and what they're doing.",
            ],
          },
          {
            title: "Compliance flow feels heavy and misplaced",
            points: [
              "When creating the agent, user is forced into country, compliance, and business details.",
              "Reaction: “it feels very tedious.”",
              "Not aligned with their current goal (testing).",
            ],
            supportingQuoteIds: ["q168", "q047"],
          },
          {
            title: "Task order is wrong",
            points: [
              "User explicitly suggested moving “send messages” before compliance.",
              "Intent mismatch in flow order.",
            ],
            supportingQuoteIds: ["q171"],
          },
          {
            title: "Required steps are unclear",
            points: [
              "User didn't understand which steps are mandatory.",
              "Leads to incomplete setup and confusion.",
            ],
            supportingQuoteIds: ["q169"],
          },
          {
            title: "Technical concepts without context",
            points: [
              "Webhooks: understood conceptually, but unclear in flow.",
              "Channels: not understood at all — “I don't know what a channel is.”",
            ],
            supportingQuoteIds: ["q170"],
          },
        ],
      },
    ],
    behavioralPattern: [
      "Click RCS.",
      "Choose “send test message.”",
      "Send message.",
      "Validate via logs.",
      "Move to API.",
      "Run request.",
      "Try to integrate.",
      "Get confused at app, agent, and connection.",
      "Continue anyway by guessing.",
    ],
    crossCuttingInsights: [
      {
        title: "Phase 1 (excellent) — test message, API exploration, feedback and logs",
        body:
          "Clear, intuitive, successful. The product works perfectly for “try it.”",
      },
      {
        title: "Phase 2 (problematic) — agent creation, compliance, app integration",
        body:
          "Confusing, heavy, unclear. The product breaks when users try to “own it.”",
      },
      {
        title: "The break point is ownership, not understanding",
        body:
          "The app concept itself isn't confusing — the timing, lack of explanation, and lack of user-driven creation are.",
        supportingQuoteIds: ["q172", "q154"],
      },
      {
        title: "Task ordering doesn't match user intent",
        body:
          "Compliance and business details land before users have validated they care about the product — flipping the order would honour the user's actual goal at each moment.",
        supportingQuoteIds: ["q171"],
      },
    ],
    keyTakeaway: {
      headline:
        "The product works perfectly for “try it” — but breaks when users try to “own it.”",
      body: [
        "This test clearly shows a two-phase experience quality. Phase 1 (test → API → feedback) is intuitive and successful. Phase 2 (agent → compliance → app) is confusing, heavy, and unclear.",
      ],
      sections: [
        {
          title: "What you've solved",
          items: [
            "Initial onboarding.",
            "Value discovery.",
            "API exploration.",
          ],
        },
        {
          title: "What's not yet solved",
          items: [
            "Transition to ownership.",
            "System mental model.",
            "Production readiness.",
          ],
        },
        {
          title: "Most important insight",
          items: [
            "When users move from “test” to “real setup,” the experience breaks.",
            "Specifically at app, agent, and integration.",
          ],
        },
      ],
      closing:
        "A strong test-first experience that enables fast validation, but breaks down when users are asked to create and connect real resources they don't understand or control.",
    },
  },
  {
    transcriptId: "t13",
    userGoal:
      "The user entered with the goal to quickly test RCS, understand how it works compared to SMS, and then set up a real agent for production use.",
    userGoalContext: {
      intro: "They explicitly followed a natural progression:",
      bullets: [
        "Test.",
        "Inspect logs.",
        "Try the API.",
        "Go live.",
      ],
    },
    concepts: [
      {
        concept: "RCS Getting started 2.0",
        conceptSubtitle:
          "External developer with marketing / Mailjet background",
        mainReaction:
          "The experience felt very easy, fast, and intuitive, even for someone not deeply familiar with messaging.",
        mainReactionQuote:
          "Quite simple, clear, and easy to use.",
        whatHappened: [
          "Clicked RCS, chose “send test message,” and validated the product without trying to understand the underlying concepts first.",
          "Switched to the API playground, ran a test request directly from the UI, and inspected the queued / delivered logs and payload.",
          "Created an RCS agent, completed the brand details, region, and use case, and only paused at country setup, the 1-of-4 step counter, and the Conversation API integration prompt.",
        ],
        keyStrengths: [
          {
            title: "Strong test-first experience",
            points: [
              "Immediately chose “send test message” without trying to understand concepts first.",
              "Confirms testing is the natural entry point for RCS.",
            ],
            supportingQuoteIds: ["q174"],
          },
          {
            title: "UI test + API test combination is highly effective",
            points: [
              "Liked creating a message in the UI and then testing via API.",
              "Both paths feel equally easy and serve different developer styles.",
            ],
            supportingQuoteIds: ["q176", "q050"],
          },
          {
            title: "Real-time logs are very valuable",
            points: [
              "Appreciated delivery states (queued, delivered) and payload visibility.",
              "Useful for debugging and understanding system behaviour.",
            ],
          },
          {
            title: "API playground is a strong success",
            points: [
              "Liked being able to run requests directly from the UI without leaving the page.",
              "Curl-first approach aligns with developer expectations.",
            ],
            supportingQuoteIds: ["q050"],
          },
          {
            title: "Preview is highly valued",
            points: [
              "Repeatedly highlighted the message preview as very helpful.",
              "Especially valuable for non-technical understanding and validating output.",
            ],
            supportingQuoteIds: ["q051"],
          },
          {
            title: "Clear mental model of RCS value",
            points: [
              "Quickly understood RCS = SMS + richer capabilities.",
              "A strong product-clarity signal at first contact.",
            ],
            supportingQuoteIds: ["q177"],
          },
          {
            title: "Overall flow feels fast and efficient",
            points: [
              "Emphasised fast feedback and quick results.",
            ],
            supportingQuoteIds: ["q178", "q175"],
          },
        ],
        issues: [
          {
            title: "“RCS agent” is not clearly understood",
            points: [
              "Initial assumption: agent = phone number or country-based sender.",
              "Shows the concept is not intuitive at first contact.",
            ],
            supportingQuoteIds: ["q179"],
          },
          {
            title: "API credentials visibility issue",
            points: [
              "Struggled to locate keys initially, even though the flow worked afterward.",
            ],
            supportingQuoteIds: ["q180"],
          },
          {
            title: "Agent setup flow structure is confusing",
            points: [
              "The page shows “1 of 4” but steps are not clearly ordered.",
              "User assumed other steps might not be required.",
              "Creates uncertainty about completion.",
            ],
            supportingQuoteIds: ["q181"],
          },
          {
            title: "Required vs optional steps unclear",
            points: [
              "User didn't know which steps are mandatory.",
              "Had to explore manually and guess the flow.",
            ],
            supportingQuoteIds: ["q181"],
          },
          {
            title: "Compliance fields need clearer explanation",
            points: [
              "Some fields were understood (e.g. opt-in proof).",
              "Others were confusing — example: opt-out message input — unclear why text is required vs proof.",
            ],
          },
          {
            title: "Country setup is unclear",
            points: [
              "Struggled with differences between options.",
              "Lack of explanation forced guessing.",
            ],
            supportingQuoteIds: ["q052"],
          },
          {
            title: "Agent vs country approval model unclear",
            points: [
              "Confusion between agent approval and country approval — not clear how they relate.",
            ],
            supportingQuoteIds: ["q183"],
          },
          {
            title: "Integration timing mismatch",
            points: [
              "Explicitly: integration should happen later.",
              "Integration is shown too early in the flow.",
            ],
            supportingQuoteIds: ["q182"],
          },
          {
            title: "Test vs production distinction is implicit",
            points: [
              "User understood it, but only through inference.",
              "Opportunity: make it explicit.",
            ],
          },
          {
            title: "Multi-country complexity not clear",
            points: [
              "Pointed out that complexity increases with countries.",
              "But this is not clearly surfaced in the UI.",
            ],
            supportingQuoteIds: ["q053"],
          },
        ],
      },
    ],
    behavioralPattern: [
      "Click RCS.",
      "Send test message.",
      "Inspect logs.",
      "Try API.",
      "Validate results.",
      "Move to create agent.",
      "Complete setup.",
      "Submit for approval.",
      "Explore integration (later).",
    ],
    keyTakeaway: {
      headline:
        "The test-first experience is highly successful and enables fast understanding and value.",
      body: [
        "This is one of the strongest validations of the current direction. You've nailed the “first success moment” — users can test and understand RCS almost instantly.",
      ],
      sections: [
        {
          title: "What's working extremely well",
          items: [
            "Fast test → feedback loop.",
            "UI + API duality.",
            "Logs and transparency.",
            "Preview experience.",
            "Overall simplicity.",
          ],
        },
        {
          title: "What still needs improvement",
          items: [
            "Clarify system concepts (RCS agent, agent vs country, approval model).",
            "Improve setup-flow clarity (step order, required vs optional).",
            "Improve compliance UX (explain purpose of fields, reduce ambiguity).",
            "Delay integration concepts — show only when needed.",
          ],
        },
        {
          title: "Most important insight",
          items: [
            "You've nailed the “first success moment” — users can test and understand RCS almost instantly.",
            "The remaining work is making the system behind that success understandable and predictable.",
          ],
        },
      ],
      closing:
        "An excellent test-first experience that delivers immediate value, but where setup and system concepts still require clearer structure and explanation.",
    },
  },
  {
    transcriptId: "t14",
    userGoal:
      "The user entered with the goal to quickly understand RCS (vs SMS), test sending messages, and then figure out how to implement it.",
    userGoalContext: {
      intro: "They behave like a classic developer:",
      bullets: [
        "Scan → test → inspect → experiment.",
        "Only go deeper when needed.",
      ],
    },
    concepts: [
      {
        concept: "RCS Getting started 2.0",
        conceptSubtitle:
          "External developer — strong test/API, structural confusion at compliance",
        mainReaction:
          "Very positive on the test + API experience, but noticeable confusion in the go-live / compliance flow structure.",
        mainReactionQuote:
          "This is fantastic… very intuitive.",
        whatHappened: [
          "Scanned the landing page, compared RCS vs SMS, and immediately picked “send test message.”",
          "Explored the UI + code combination, scrolled into logs to find delivery feedback, and mentally moved on to the API.",
          "Entered agent creation, completed compliance steps, then hit confusion around two parallel checklists, role differentiation between compliance and integration, and the test-vs-go-live boundary.",
        ],
        keyStrengths: [
          {
            title: "Strong test-first experience",
            points: [
              "Immediately chose “send test message.”",
              "Followed the natural behaviour: explore → test → inspect.",
              "Confirms test-first is exactly right.",
            ],
            supportingQuoteIds: ["q184"],
          },
          {
            title: "Preview is extremely valuable",
            points: [
              "Initially missed it (an important nuance).",
              "But once discovered, it directly helps users understand the difference RCS makes.",
              "Insight: preview is high value, but needs stronger visual priority.",
            ],
            supportingQuoteIds: ["q059"],
          },
          {
            title: "UI + code combination is a major strength",
            points: [
              "User explicitly prefers seeing UI + code together.",
              "Compared the combined view favourably to the isolated playground.",
              "Insight: combined UI + code view > isolated API playground.",
            ],
            supportingQuoteIds: ["q054"],
          },
          {
            title: "API flow aligns with developer behaviour",
            points: [
              "User copies code, moves to terminal, experiments.",
              "Strong validation of the real developer workflow.",
            ],
            supportingQuoteIds: ["q185"],
          },
          {
            title: "Logs and events are useful",
            points: [
              "User immediately looks for feedback and interprets events.",
              "Logs are critical for understanding system behaviour.",
            ],
            supportingQuoteIds: ["q186"],
          },
          {
            title: "Overall flow is intuitive in testing phase",
            points: [
              "User repeatedly understands what to do and follows the flow.",
            ],
            supportingQuoteIds: ["q192"],
          },
        ],
        issues: [
          {
            title: "Flow structure (biggest issue)",
            points: [
              "User clearly struggled with checklist vs flow, sequence vs parallel.",
              "“I was treating these as two distinct blocks.”",
              "“Step one, step two… I didn't realize they were just steps to do.”",
              "Core issue: the mental model of the flow is unclear.",
            ],
            supportingQuoteIds: ["q187", "q057"],
          },
          {
            title: "Compliance vs integration not clearly separated",
            points: [
              "User noticed they are different.",
              "But not what each is for or when to do which.",
              "Important nuance: difference is visible, purpose is not.",
            ],
            supportingQuoteIds: ["q191"],
          },
          {
            title: "Required vs optional unclear",
            points: [
              "User repeatedly guessed what is required.",
              "Leads to uncertainty and trial-and-error.",
            ],
          },
          {
            title: "Connection between steps is unclear",
            points: [
              "User didn't realize earlier steps affect later steps.",
              "Problem: system relationships are hidden.",
            ],
            supportingQuoteIds: ["q187"],
          },
          {
            title: "Integration vs compliance timing unclear",
            points: [
              "User ignored integration initially and assumed sequential flow.",
              "Insight: the system doesn't reflect intent-based progression.",
            ],
            supportingQuoteIds: ["q188"],
          },
          {
            title: "Test vs real usage not clearly separated",
            points: [
              "User struggled with test numbers vs real usage and when they can actually send.",
              "The boundary exists but isn't clearly communicated.",
            ],
            supportingQuoteIds: ["q190"],
          },
          {
            title: "Compliance input confidence",
            points: [
              "User unsure what to write, or whether it would be accepted.",
              "“Would that hurt me later in the flow?”",
              "Lack of confidence — not lack of understanding.",
            ],
            supportingQuoteIds: ["q056"],
          },
          {
            title: "Missing “submit for approval” clarity",
            points: [
              "User missed that submission hadn't happened.",
              "“I have not submitted… I created my own confusion.”",
              "Indicates weak state visibility.",
            ],
            supportingQuoteIds: ["q058"],
          },
          {
            title: "Expectations around test data persistence",
            points: [
              "User expected the test number to carry over.",
              "Shows expectation of continuity between steps.",
            ],
            supportingQuoteIds: ["q189"],
          },
        ],
      },
    ],
    behavioralPattern: [
      "Scan and compare RCS vs SMS.",
      "Choose “send test message.”",
      "Explore UI + preview.",
      "Inspect logs and code.",
      "Move to API mentally.",
      "Enter agent creation.",
      "Follow compliance steps.",
      "Misinterpret flow structure.",
      "Continue anyway.",
      "Eventually understand by progressing.",
    ],
    behavioralPatternNote: {
      title: "Recovery pattern",
      text: "This user got confused at the flow structure but completed the full journey by continuing forward — the system works, even when the structure isn't clearly communicated.",
    },
    keyTakeaway: {
      headline:
        "Users can complete the full journey and recover from confusion — but the structure is still not clearly communicated.",
      body: [
        "This is a very strong validation of progress: the system works end-to-end. The remaining issue is structural clarity, not basic usability.",
      ],
      sections: [
        {
          title: "What's working extremely well",
          items: [
            "Test-first experience.",
            "UI + API combination.",
            "Preview and logs.",
            "Developer workflow alignment.",
            "Overall usability.",
          ],
        },
        {
          title: "What still needs improvement",
          items: [
            "Flow structure & sequencing (highest impact) — checklist vs flow, order vs grouping.",
            "Clarify path separation — compliance vs integration, when to do each.",
            "Make relationships visible — steps affecting each other, system connections.",
            "Improve state clarity — submitted vs not, ready vs not.",
            "Strengthen test vs production distinction.",
          ],
        },
        {
          title: "Most important insight",
          items: [
            "You've solved usability.",
            "The remaining problem is clarity of structure and mental model.",
          ],
        },
      ],
      closing:
        "A highly successful test-first and developer-friendly experience, but with persistent confusion around flow structure, step relationships, and the separation between compliance and integration paths.",
    },
  },
];

export const transcriptAnalysisById = (id: string) =>
  transcriptAnalyses.find((a) => a.transcriptId === id);
