import type { Quote } from "../types";

export const quotes: Quote[] = [
  // --- t01 / P1 (Developer, Onboarding app → Sandbox 1.0 comparison) ---
  {
    id: "q001",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "01:06",
    quote:
      "Being able to send a message, to my phone or something, is usually the first thing I try to achieve.",
    theme: "Time-to-value",
    interpretation:
      "Developer prioritizes immediate, hands-on testing to validate a service before investing in setup.",
  },
  {
    id: "q002",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "01:57",
    quote:
      "once I've done that, then I can kind of relax and know that, okay, this thing works, then I can just, yeah, use the API and the keys to actually integrate it into, any system.",
    theme: "Time-to-value",
    interpretation:
      "Confidence from quick testing unlocks willingness to invest in deeper integration into any system.",
  },
  {
    id: "q003",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "11:28",
    quote:
      "This sucks having to copy two things here. I don't know if I will need them.",
    theme: "Setup friction",
    interpretation:
      "Manual copy-paste of secrets creates friction; downloadable format would reduce cognitive load.",
  },
  {
    id: "q004",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "16:32",
    quote:
      "I immediately identified that it's just suggesting some, tools that I can use to set up the the webhook, without yeah. To test it locally without deploying anything, which is helpful. This seems to be a paid solution, which I would kinda be pissed about.",
    theme: "Setup friction",
    interpretation:
      "External webhook testing tools suggest complexity; unexpected paywalls undermine trust.",
  },
  {
    id: "q005",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "27:08",
    quote:
      "I would like to have some sort of pricing table. I think, actually, pricing should probably be, a lot higher, up the list. It's one of the first things that I would want to know",
    theme: "Production readiness",
    interpretation:
      "Cost transparency early in exploration prevents wasted evaluation time.",
  },
  {
    id: "q006",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "48:31",
    quote:
      "I like this, message log, table much better. I have everything in one page.",
    theme: "Message logs",
    interpretation:
      "Single-page layout with colocated testing and results feedback improves understanding of API behavior.",
  },
  {
    id: "q007",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "49:40",
    quote:
      "The simulation. I mean, the wording, it's sent test message would be not simulate to message, but I think that's a mistake when when building it. Because, yeah, you are sending a message for real.",
    theme: "Message logs",
    interpretation:
      "Precise language ('send' vs 'simulate') clarifies whether test messages are real or mocked.",
  },
  {
    id: "q008",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "56:08",
    quote:
      "I would say set up the basics, basically. I mean, I I would be able at an end, at the end of of of a guide like this, I would want to be able to send a message whether it's, like, fully set up or not can be can go either way.",
    theme: "Time-to-value",
    interpretation:
      "A successful guide culminates in a working test message; full production setup is secondary to MVP validation.",
  },
  {
    id: "q066",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "10:14",
    quote:
      "It's a combination of me testing and setting up a new key. So while I am testing to send it to my mobile, which is really nice because it gives me a bit more confidence that this whole thing will work, I'm also getting a ready made request.",
    theme: "Setup friction",
    interpretation:
      "Testing and real setup are blended into the same step; users can't tell which actions are temporary and which are persistent.",
  },
  {
    id: "q067",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "12:35",
    quote:
      "I don't understand what this particular thing is, onboarding webhooks. Is this the link that I set up? What do I do with this link? I have no idea.",
    theme: "Setup friction",
    interpretation:
      "Webhooks are introduced during testing without context for why they're needed now or where they should be configured.",
  },
  {
    id: "q068",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "16:18",
    quote:
      "I'm not sure if I would want in this step to go through the whole webhook setup as well. Sometimes it takes a bit too long, and these widgets feel like you wanna finish them in a reasonable time, like in an hour or something.",
    theme: "Setup friction",
    interpretation:
      "Webhook setup is too heavy for an exploration session; it belongs after the user is committed, not during a quick test.",
  },
  {
    id: "q069",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "27:18",
    quote:
      "Now I read it that it's prepared to go live. I thought I could use it for testing.",
    theme: "Setup friction",
    interpretation:
      "Pre-created test agent gets reframed as a production-bound resource, blurring the boundary between testing and going live.",
  },
  {
    id: "q070",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "29:42",
    quote:
      "It is harder to know. It's a bit mixed, the sending and the actual setting up. I'm not completely sure what is in test mode right now and what is me trying to prepare a real app.",
    theme: "Setup friction",
    interpretation:
      "Test mode and real-app preparation are visually and structurally indistinguishable, leaving users unsure of state.",
  },
  {
    id: "q071",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "33:05",
    quote:
      "It looks like I have a test agent. But then when I go into the test agent, I'm kind of trying to set it up, which is weird.",
    theme: "Setup friction",
    interpretation:
      "Test agent ownership is unclear: users expect a system-managed resource and find themselves configuring it like their own.",
  },
  {
    id: "q072",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "33:48",
    quote:
      "If I go to the test agent, I wouldn't expect to set up the test agent. If I want to set up an agent, I would want to set up a new one.",
    theme: "Setup friction",
    interpretation:
      "Users expect a clear separation: a temporary test agent for experimentation, and a separate flow to create their own real agent.",
  },

  // --- t02 / P2 (Developer, Sandbox 1.0) ---
  {
    id: "q009",
    transcriptId: "t02",
    participant: "P2",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "08:50",
    quote:
      "For me these are examples of the most important things they want to do… You want to send a test message and, maybe most of all, you want to test a Rich message.",
    originalQuote:
      "För mig så är det exempel på de viktigaste sakerna de vill göra... Man vill skicka ett testmeddelande och kanske framförallt vill man testa ett Rich meddelande",
    originalLanguage: "Swedish",
    theme: "Time-to-value",
    interpretation:
      "Testing rich messages first shows advanced capability quickly, building confidence.",
  },
  {
    id: "q010",
    transcriptId: "t02",
    participant: "P2",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "10:08",
    quote:
      "Here I'd have found something to do the absolute easiest thing possible without so much setup… As a developer, that's not the first thing you look at — you want to be able to solve your task.",
    originalQuote:
      "Här hade jag träffat något för att kunna göra det absolut lättaste möjliga utan så mycket alltså setup... Det är inte det första man tittar på som utvecklare utan man vill kunna lösa sin uppgift.",
    originalLanguage: "Swedish",
    theme: "Time-to-value",
    interpretation:
      "Developers want to solve their task immediately; minimal setup before results demonstrates value.",
  },
  {
    id: "q011",
    transcriptId: "t02",
    participant: "P2",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "16:53",
    quote:
      "It's when you need all the webhooks and this-and-that that it starts getting more advanced… But this I think is a huge improvement over what we have, especially once it's in place.",
    originalQuote:
      "Det är ju när du behöver alla webhux och hitan ditan som det börjar bli mer avancerat... Men det här tycker jag är jättestor förbättring mot det vi har speciellt när detta kommer ligga",
    originalLanguage: "Swedish",
    theme: "Setup friction",
    interpretation:
      "Separating simple testing from advanced webhook config reduces early friction.",
  },
  {
    id: "q012",
    transcriptId: "t02",
    participant: "P2",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "20:36",
    quote:
      "Yes. Because you can basically just copy it… This is good, I think.",
    originalQuote:
      "Alltså, ja. Därför att du kan I stort sett bara kopiera liksom... Det här är bra tycker jag.",
    originalLanguage: "Swedish",
    theme: "API playground",
    interpretation: "Copy-paste code examples lower the barrier to immediate testing.",
  },
  {
    id: "q013",
    transcriptId: "t02",
    participant: "P2",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "30:29",
    quote:
      "It solves two pretty big problems. It removes the wall you hit when you come in as a user… You have to sign up, you have to become an approved user, you have to submit your credit-card stuff before you can even test anything.",
    originalQuote:
      "Det löser två ganska stora problem. Och det är att det tar bort väggen som är när man kommer in som användare... Du måste signa upp, du måste bli godkända användare, du måste skicka in dina kreditkortsgrejer innan du ens kan testa något.",
    originalLanguage: "Swedish",
    theme: "Time-to-value",
    interpretation:
      "Removing sign-up and payment walls before first test significantly lowers adoption friction.",
  },
  {
    id: "q073",
    transcriptId: "t02",
    participant: "P2",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "33:07",
    quote:
      "It teaches you a lot about our capability as Sinch, but quite little about our dashboard. You'll still sign up and end up on the dashboard where you have to create senders and everything yourself after that.",
    originalQuote:
      "Den lär dig rätt mycket om vår kapacitet som Sinch, den lär dig ganska lite om vår dashboard. Men sedan kommer man ändå signa upp och du kommer hamna på Wadashboard med att du ska skapa upp sändders och allting själv efter det.",
    originalLanguage: "Swedish",
    theme: "Production readiness",
    interpretation:
      "A great sandbox proves capability but doesn't prepare users for the real dashboard's complexity — risking a 'this looks easy' / 'this is actually complex' mismatch.",
  },
  {
    id: "q074",
    transcriptId: "t02",
    participant: "P2",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "28:39",
    quote:
      "Of course you can make something that's a button-press or super easy if you don't take into account all the extra things that come. And the question is, do you even belong in a sandbox in this way?",
    originalQuote:
      "Det är klart att man kan göra någonting som är en knapptryckning eller jättelätt så om man inte tar hänsyn till alla de extra grejerna som kommer... Och frågan är, hör du ens hemma I en sandbox på det här sättet?",
    originalLanguage: "Swedish",
    theme: "Setup friction",
    interpretation:
      "Making the sandbox effortless is possible only by hiding real production complexity — raising a question of whether that complexity belongs in the sandbox at all.",
  },
  {
    id: "q075",
    transcriptId: "t02",
    participant: "P2",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "46:31",
    quote:
      "This feels like a wizard with steps you should take. And then it's unclear when you're done.",
    originalQuote:
      "Den här känns som en wishword med steg man ska ta sig igenom. Och sen så är det oklart när man är klar.",
    originalLanguage: "Swedish",
    theme: "Setup friction",
    interpretation:
      "A wizard format implies completion — but the onboarding app never signals when the user is done, leaving them stuck in an open-ended flow.",
  },
  {
    id: "q076",
    transcriptId: "t02",
    participant: "P2",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "50:00",
    quote:
      "It's a bit unclear that this is a wizard, since there isn't actually action in these in the same way. Instead this is more to read through.",
    originalQuote:
      "Jag tycker kanske att det är lite oklart att det här är en wished, I och med att det faktiskt inte är action I dessa på samma sätt. Utan det här är mer att läsa igenom.",
    originalLanguage: "Swedish",
    theme: "Setup friction",
    interpretation:
      "Reading-heavy steps inside a wizard format break the user's expectation that each step is an action — making it unclear what is actionable vs informational.",
  },
  {
    id: "q077",
    transcriptId: "t02",
    participant: "P2",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "40:13",
    quote:
      "In a test scenario, you'd probably want all this kind of stuff already filled in for a test sender. Or hidden.",
    originalQuote:
      "Det är det jag tänker att allt sånt här, hade du nog I ett testscenario velat redan ifyllt för en test sönder liksom. Eller dolt.",
    originalLanguage: "Swedish",
    theme: "Setup friction",
    interpretation:
      "Even developers don't want to configure resources during testing — sender, access key, etc. should be pre-filled or hidden in a test flow.",
  },

  // --- t03 / P3 (Developer, Onboarding app) ---
  {
    id: "q014",
    transcriptId: "t03",
    participant: "P3",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "02:13",
    quote:
      "But it's a very vague concept for me if I'm just maybe interested in RCS… I can see here that a message is being sent somehow.",
    originalQuote:
      "Men det är ett väldigt vagt begrepp för mig som bara kanske är intresserad av SD-BÖ... Jag ser lite här att här skickas det meddelande på något sätt.",
    originalLanguage: "Swedish",
    theme: "Resource creation",
    interpretation:
      "Vague terminology confuses intent; showing messaging in action clarifies purpose.",
  },
  {
    id: "q015",
    transcriptId: "t03",
    participant: "P3",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "07:00",
    quote:
      "I mostly felt this was — maybe not an integration test, but rather an easy-access test… Why do you need this?",
    originalQuote:
      "Jag kände mest det här som ett Kanske inte ett integrationstest, utan snarare Easee access test... Varför behöver det?",
    originalLanguage: "Swedish",
    theme: "Resource creation",
    interpretation:
      "Access key requirement for quick testing feels premature; simpler playground mode preferred.",
  },
  {
    id: "q016",
    transcriptId: "t03",
    participant: "P3",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "13:11",
    quote:
      "These are two different tests. I think the user experience — now I'm thinking as a developer and I'll keep thinking that way — it's actually good.",
    originalQuote:
      "Det är två olika tester. Jag tror att användarupplevelsen, nu tänker jag som utvecklare och det ska jag fortsätta tänka mig. Då är det faktiskt bra.",
    originalLanguage: "Swedish",
    theme: "API playground",
    interpretation: "Offering both UI and code test views serves different developer preferences.",
  },
  {
    id: "q017",
    transcriptId: "t03",
    participant: "P3",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "43:26",
    quote:
      "If I'm using Sinch, I understand this — I probably have the option to use all these channels to reach my customers… That's reassuring.",
    originalQuote:
      "Använder jag Sinch så förstår jag här. Förmodligen har möjligheten att använda alla dessa kanaler för att nå ut till mina kunder... Det är ju betryggande",
    originalLanguage: "Swedish",
    theme: "Production readiness",
    interpretation:
      "Seeing multi-channel capability demonstrates platform scale and future-proofs the choice.",
  },
  {
    id: "q018",
    transcriptId: "t03",
    participant: "P3",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "51:01",
    quote:
      "What I've asked for is a more straightforward documentation, based on the Sinch documentation we have today, but focused specifically on RCS.",
    originalQuote:
      "Jag har bara bett law och boll... en mer straightforward dokumentation, baserad på dokumentationen som vi har idag, liksom på Sinch, fast mer just för ArssiaS.",
    originalLanguage: "Swedish",
    theme: "Message logs",
    interpretation:
      "Cleaner, channel-specific documentation focused on essentials improves clarity.",
  },
  {
    id: "q078",
    transcriptId: "t03",
    participant: "P3",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "24:41",
    quote:
      "Oh, I have to do sixteen steps? No, I don't have time for that. Do I really have to do everything at once?",
    originalQuote:
      "oj, jag ska göra sexton steg? Nej, det har jag inte tid innan jag tänkt. Jag kanske hade velat, och Emma är jag tvungen att göra allting gång.",
    originalLanguage: "Swedish",
    theme: "Setup friction",
    interpretation:
      "A 16-step flow feels like forced work, not helpful guidance — users disengage at the sight of long sequences.",
  },
  {
    id: "q079",
    transcriptId: "t03",
    participant: "P3",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "37:42",
    quote:
      "This isn't getting started, this is go live. The very concept of getting started for a developer is very generalised — it's a max task of about two minutes, then a developer loses interest.",
    originalQuote:
      "detta är inte geting start, detta är gå live. Själva konceptet med geting Stary från utvecklare är väldigt generaliserat och Det är en maxuppgift på typ två minuter, sen tappar en utvecklare intresset.",
    originalLanguage: "Swedish",
    theme: "Time-to-value",
    interpretation:
      "Getting started must feel fast and lightweight — beyond ~2 minutes, developers lose interest and treat the rest as production setup.",
  },
  {
    id: "q080",
    transcriptId: "t03",
    participant: "P3",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "34:19",
    quote:
      "Redundant information here. Redundant information. I just want to be done, that's how it feels. Then I'm fed information that I might not have any use of right now.",
    originalQuote:
      "Lite överflödig information här. Överflödig information. Jag vill bara bli klar, det känns det som. Sen blir jag matad av Information som jag kanske inte har så mycket nytta av just nu.",
    originalLanguage: "Swedish",
    theme: "Setup friction",
    interpretation:
      "Information is pushed at users instead of discovered — they skim and click through just to finish, ignoring the content.",
  },
  {
    id: "q081",
    transcriptId: "t03",
    participant: "P3",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "09:00",
    quote:
      "I would have become questioning as a developer. I might have become quickly skeptical of the system… Are these keys active forever? And why do I need keys that are active forever in a test tool?",
    originalQuote:
      "Här hade jag blivit fundersam som utvecklare. Jag hade kanske blivit snart skeptisk till systemet... är dessa nycklar aktiva för alltid? Och Varför behöver jag nycklar som är aktiva för alltid I ett testverktyg?",
    originalLanguage: "Swedish",
    theme: "Setup friction",
    interpretation:
      "Long-lived access keys in a test context raise security concerns and undermine trust in the system.",
  },
  {
    id: "q082",
    transcriptId: "t03",
    participant: "P3",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "05:55",
    quote:
      "Above all, as a developer it's about — and I'll actually say this as the first word — build trust. It's often sensitive information being sent here. It could be login credentials or whatever it might be.",
    originalQuote:
      "Framförallt som utvecklare så handlar det om, och det säger jag faktiskt första ordet, build trust. Det är oftast känslig information det här som skickas. Det kan ju vara inloggningsuppgifter eller vad det nu skulle kunna vara.",
    originalLanguage: "Swedish",
    theme: "Production readiness",
    interpretation:
      "Developers' first concern is trust — security signalling and clarity about credentials are foundational, not optional.",
  },
  {
    id: "q083",
    transcriptId: "t03",
    participant: "P3",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "07:13",
    quote:
      "This feels significantly more accessible — it gives me the information I want in a more inductive flow. I'm met with the information I want directly, instead of in a deep hierarchy of sixteen steps.",
    originalQuote:
      "Den här känns betydligt mer lättillgänglig, den ger mig den informationen om jag vill I ett kanske mer induktivt flöde. Jag blir konttad med den informationen jag vill direkt, istället för I en djup hierarki av sexton steg.",
    originalLanguage: "Swedish",
    theme: "Time-to-value",
    interpretation:
      "Developers prefer to discover information on demand in an inductive flow — not be force-fed through a deep step hierarchy.",
  },
  {
    id: "q084",
    transcriptId: "t03",
    participant: "P3",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "34:19",
    quote:
      "It might not have been clear what my original task was. But it's just: with Sinch I can achieve what I want.",
    originalQuote:
      "Det kanske inte var tydligt egentligen vad jag hade för ursprungsuppgift. Men det är... Med Sinch kan jag åstadkomma det jag vill.",
    originalLanguage: "Swedish",
    theme: "Time-to-value",
    interpretation:
      "Quick evaluation comes down to one question: can I do what I need with this product? Everything else is noise.",
  },

  // --- t04 / P4 (Developer, Onboarding app) ---
  {
    id: "q019",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "02:09",
    quote:
      "The first thing I think is that there's quite a lot of text to get through to orient yourself… I got something like — this is some kind of Get-started menu.",
    originalQuote:
      "Det första jag tänker på är att det är ganska mycket text att ta sig igenom för att orientera sig... Jag hade fått som en sån här Det här är nån slags Get started-meny.",
    originalLanguage: "Swedish",
    theme: "Setup friction",
    interpretation:
      "Large text blocks overwhelm; clear progress labels and structure improve orientation.",
  },
  {
    id: "q020",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "03:47",
    quote:
      "That I should be able to start sending messages with RCS… Now I should get to 'Send your first RCS'. Here you enter your number and what you want to send.",
    originalQuote:
      "Att jag ska kunna börja skicka meddelanden med RCS... Nu borde jag komma till Skicka ditt första RCS. Här skickar du ditt nummer och vad vill du skicka?",
    originalLanguage: "Swedish",
    theme: "Time-to-value",
    interpretation:
      "Clear expectation: immediate progression to sending a test message validates the service.",
  },
  {
    id: "q021",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "06:39",
    quote:
      "So that one was closed. And then — now it's selected. That was nice. I liked that it turned green when I was done with that step.",
    originalQuote:
      "Då var den Aite closed. Och sen Då är den vald. Det var nice. Jag tyckte om att det blev grönt när jag var klar med det steget.",
    originalLanguage: "Swedish",
    theme: "Setup friction",
    interpretation:
      "Visual progress indicators (green check) provide psychological reward and clarity.",
  },
  {
    id: "q022",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "23:19",
    quote:
      "I think it should be easy to set up — I should just be able to send after this… it should be simple, and I should get the information I need.",
    originalQuote:
      "Jag tänker att man enkelt ska satt upp liksom Att jag ska bara kunna skicka efter det här... att det ska vara enkelt, att jag ska informationen jag behöver",
    originalLanguage: "Swedish",
    theme: "Time-to-value",
    interpretation:
      "Guide should enable sending quickly while building understanding of terminology.",
  },
  {
    id: "q023",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "29:22",
    quote:
      "Here I want to test RCS. Okay. I think some people would have clicked up here, Get started. I'd probably actually look for the thing I'm really after and click Get started there.",
    originalQuote:
      "Här vill jag testa ASS. Okej. Jag tror det här också är lite så här, vissa hade säkert klickat här uppe, Get started. Jag hade nog faktiskt letat efter det jag faktiskt är sugen efter och klickat Get started där.",
    originalLanguage: "Swedish",
    theme: "Time-to-value",
    interpretation:
      "Developers prefer to find the specific task they want rather than follow a generic Get Started flow.",
  },
  {
    id: "q024",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "34:07",
    quote:
      "The toast came up when I clicked, so something actually happened. Otherwise I'd have had to check.",
    originalQuote:
      "Jag tyckte det här var mycket trevligare. Teästen kom upp när jag klickade att nånting hände då... Annars skulle jag behöva kolla.",
    originalLanguage: "Swedish",
    theme: "Message logs",
    interpretation:
      "Immediate contextual feedback (toast near action) confirms success better than separate pages.",
  },
  {
    id: "q085",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "07:30",
    quote:
      "Key Secret — is it like a password, maybe? I don't really know what it means… Since I don't understand this, I'd want a tooltip box. What does a Key Secret mean? To understand what I'm doing.",
    originalQuote:
      "Key Secret är det typ som ett lösenord, kanske? Jag vet inte riktigt vad det betyder... Jag hade tyckt att det var, eftersom jag inte förstår det här, så velat typ en inforuta. Vad betyder en Key Secret? För att förstå vad jag håller på med.",
    originalLanguage: "Swedish",
    theme: "Setup friction",
    interpretation:
      "Junior developers lack the mental model for technical credentials — they need inline explanations (tooltips, simple definitions) to understand what they're doing.",
  },
  {
    id: "q086",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "08:15",
    quote:
      "It would have been fun to be able to choose what text I wanted to send myself in a test.",
    originalQuote:
      "Det hade varit kul också att få välja vad jag själv ville skicka för text tycker jag I ett test.",
    originalLanguage: "Swedish",
    theme: "Time-to-value",
    interpretation:
      "Predefined test content reduces a junior developer's sense of ownership and learning — they want to write their own message to confirm what's happening.",
  },
  {
    id: "q087",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "16:25",
    quote:
      "Here you can click on something. I wouldn't have thought of that otherwise. I didn't see that these were buttons at all.",
    originalQuote:
      "här kan man klicka på något. Det hade jag nog inte tänkt på annars. Jag såg inte att det här var knappar alls.",
    originalLanguage: "Swedish",
    theme: "Setup friction",
    interpretation:
      "When elements look like text rather than affordances, juniors hesitate — affordance clarity matters more for users still building a mental model.",
  },
  {
    id: "q088",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "11:30",
    quote:
      "I assumed this was a screenshot from some kind of dashboard… this image without any explanation was a bit hard to place — what was I looking at?",
    originalQuote:
      "Jag antar att det här är en scranshot for noll från nån slags dashboard... just den här bilden utan någon förklaring var kanske lite svår att placera vad det var för nånting jag kollade på.",
    originalLanguage: "Swedish",
    theme: "Message logs",
    interpretation:
      "Without a label, junior users can't tell whether they're looking at real data, a preview, or a screenshot — uncertainty makes learning harder.",
  },
  {
    id: "q089",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "29:50",
    quote:
      "When you see RCS next to SMS I understand a little better what RCS means.",
    originalQuote:
      "När man ser RCS bredvid sms så förstår jag kanske lite bättre vad RCS betyder.",
    originalLanguage: "Swedish",
    theme: "Time-to-value",
    interpretation:
      "Side-by-side capability comparison teaches juniors what's different about RCS faster than abstract description.",
  },
  {
    id: "q090",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "51:32",
    quote:
      "I would have been a bit lost now. You don't know where to go after this.",
    originalQuote:
      "Jag hade varit lite lost nu. Du vet inte var du skulle ta vägen efter det här.",
    originalLanguage: "Swedish",
    theme: "Production readiness",
    interpretation:
      "After a successful sandbox test, the next step isn't signposted — juniors are left without a clear path forward.",
  },
  {
    id: "q091",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "43:24",
    quote:
      "$200 to pay. Yes, that's quite a lot. Maybe a bit much. Let me choose how much I want to test-send for. Maybe I want to test-send five dollars. But I wouldn't have wanted to test for $200.",
    originalQuote:
      "tvåhundra dollar att betala. Ja, det är ganska mycket. Det Det är kanske lite mycket. Välj summa du vill kunna testskicka för. Och så kanske jag vill testskicka fem dollar. Men jag hade inte velat testa för tvåhundra dollar.",
    originalLanguage: "Swedish",
    theme: "Production readiness",
    interpretation:
      "An unexpected cost barrier breaks the testing mindset — juniors expect free or limited testing, not production-scale fees during exploration.",
  },
  {
    id: "q092",
    transcriptId: "t04",
    participant: "P4",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "46:49",
    quote:
      "I understood that I had to add Agent Appearance, Add Country, Add Contact Information. I just didn't really understand what to do now.",
    originalQuote:
      "Jag förstod att jag hade ad Agent aperarence, ad country, ad conctinformation. Jag förstod bara riktigt vad jag ska göra nu.",
    originalLanguage: "Swedish",
    theme: "Setup friction",
    interpretation:
      "Hidden system requirements (e.g. Conversation API app) trap junior users — they cannot infer dependencies that the UI doesn't surface.",
  },

  // --- t05 / P5 (Developer, Sandbox 1.0 → Onboarding app) ---
  {
    id: "q093",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "11:03",
    quote:
      "It was easy to work. Even though I haven't worked with RCS or doing this thing before at all, I could get it, what's going on, and the steps were really organized — you could follow them easily.",
    theme: "Time-to-value",
    interpretation:
      "Clear, organised steps in the sandbox enable first-time users to follow along without prior RCS experience.",
  },
  {
    id: "q094",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "04:30",
    quote:
      "From a developer perspective, this is good that you can get this kind of information.",
    theme: "Message logs",
    interpretation:
      "Delivery states and payload visibility are the right kind of feedback for developers debugging and validating behaviour.",
  },
  {
    id: "q095",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "05:44",
    quote:
      "I was looking for something like this, actually. But I didn't see it in the first place. So what I was looking for is something like this here instead.",
    theme: "Message logs",
    interpretation:
      "The message preview existed but wasn't visually prominent — users searched for it, suggesting it should be elevated in the layout.",
  },
  {
    id: "q096",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "07:47",
    quote:
      "What if we just wanted to have a text? Is it possible? When I look at this, I think, oh, like, none of them possible to just have a text… So I cannot just send a text.",
    theme: "Resource creation",
    interpretation:
      "Template options imply media is mandatory — users don't realise text-only messages are possible, creating confusion about product capabilities.",
  },
  {
    id: "q097",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "09:32",
    quote:
      "We can paste our code here, right?… I didn't get that, that's gonna happen because I didn't have that experience before to see something like that.",
    theme: "API playground",
    interpretation:
      "Send-with-code generates a request to run externally, but users assume they can paste their own code — the pattern is unfamiliar without explanation.",
  },
  {
    id: "q098",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "13:57",
    quote:
      "I'm looking for, like, a place that what if I don't want to have a test agent now and I want just to use the, like, a real agent?… So I was looking for where I can start the real one then.",
    theme: "Production readiness",
    interpretation:
      "After testing, users want a clear path to create their own real agent — but the route from test to real isn't obvious.",
  },
  {
    id: "q099",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "15:07",
    quote:
      "I want to send this exact message to, like, hundred thousand of customers now.",
    theme: "Production readiness",
    interpretation:
      "Once value is proven, the user's intent shifts immediately to real customers — the test → real transition needs to support this jump.",
  },
  {
    id: "q100",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "16:02",
    quote:
      "The new, actually, it caused me to have some misunderstanding because I thought that this is gonna make a new test agent.",
    theme: "Resource creation",
    interpretation:
      "“New RCS agent” reads as “new test agent” — the label doesn't signal that this is the real-setup entry point.",
  },
  {
    id: "q101",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "19:56",
    quote:
      "I'm looking for the IKEA… I was expecting that, because the agent that we made was for IKEA. We did test two. And I was thinking that I have to see this in the details here.",
    theme: "Resource creation",
    interpretation:
      "After creating their own agent, users expect to see its identity reflected in payload and logs — its absence reduces clarity and confidence.",
  },
  {
    id: "q102",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "25:37",
    quote:
      "I really didn't think that's gonna happen. If I was not doing this right now, I could understand it could be a shock for them. So maybe some kind of information that there is another layer, or another step even for you to make this happen.",
    theme: "Setup friction",
    interpretation:
      "The Conversation API app dependency is unexpected — even users with prior knowledge agree it would shock new users without an explanation or link.",
  },
  {
    id: "q103",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "26:56",
    quote:
      "Test numbers as a customer who would get the message, or test number as an agent who can send the message to them. I don't know which of them is.",
    theme: "Resource creation",
    interpretation:
      "Tab labels (Countries, Test numbers, Integrate) are ambiguous — users guess at meanings rather than understand what each section represents.",
  },
  {
    id: "q104",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "33:13",
    quote:
      "I was expecting that I would have some box to write my message here. But seems like this one is just sending, like, fake message. It's not what I made because I don't have the possibility to edit that.",
    theme: "Time-to-value",
    interpretation:
      "Predefined test content makes the test feel fake — users want to write their own message to confirm what's actually happening.",
  },
  {
    id: "q105",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "48:55",
    quote:
      "I really don't know how to find these keys. Either it should not need the access key and key secrets for the test… It should be in the other steps. Now if you wanted to have a real agent, now you need to access this key.",
    theme: "Setup friction",
    interpretation:
      "Access keys should not be required for a test — defer them until the user moves to real-agent setup, with an explanation of what they are.",
  },
  {
    id: "q106",
    transcriptId: "t05",
    participant: "P5",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "47:00",
    quote:
      "If I want to choose for action, the previous one was much more easier to work with because it was a bit better to guess what is what. But in this one, it is easier to find the information here.",
    theme: "Time-to-value",
    interpretation:
      "The onboarding app reads more like documentation than action — better for finding information, weaker for actually doing things.",
  },

  // --- t06 / P6 (Developer, comparing Sandbox 1.0 and Onboarding app) ---
  {
    id: "q025",
    transcriptId: "t06",
    participant: "P6",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "00:57",
    quote:
      "this would be, the page that shows, yeah, different channels communication channels for that's available at Cinch... from the cards here, I I get that it will give a short introduction",
    theme: "Time-to-value",
    interpretation:
      "Channel cards provide orientation without overwhelming text.",
  },
  {
    id: "q026",
    transcriptId: "t06",
    participant: "P6",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "06:01",
    quote:
      "I I would say it's, to just try to send one, test message to see how it is working... So not really having to set up, but to test it out.",
    theme: "Time-to-value",
    interpretation: "Clear sandbox purpose: test functionality without setup friction.",
  },
  {
    id: "q027",
    transcriptId: "t06",
    participant: "P6",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "12:40",
    quote:
      "I think it's good. I think, maybe I would, like, explore conversation API, but also, I will maybe... there's, like, no real way of going to get started.",
    theme: "Resource creation",
    interpretation:
      "Gap between exploration and implementation; unclear path from testing to real integration.",
  },
  {
    id: "q028",
    transcriptId: "t06",
    participant: "P6",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "34:49",
    quote:
      "I think it was pretty straightforward. Only thing I missed was, like, some way to, like, go back from the test try RCS agent page... to creating the first RCS app for my own business.",
    theme: "Production readiness",
    interpretation:
      "Missing navigation from sandbox testing to real agent creation leaves users stranded.",
  },
  {
    id: "q029",
    transcriptId: "t06",
    participant: "P6",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "55:33",
    quote:
      "I think I I prefer the first one, because it's more, like, feels like, it's more in in in the app, of, like, this style, of, like, self-service, more clear self-service style.",
    theme: "Time-to-value",
    interpretation:
      "Interactive self-service flow beats step-by-step text; doing builds confidence better than reading.",
  },
  {
    id: "q030",
    transcriptId: "t06",
    participant: "P6",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "56:49",
    quote:
      "I think so. I think maybe and then this because this is, very much step by step... by doing it here or this way... by the end of it, you should have let's say, your the IKEA one should be more or less set up",
    theme: "Setup friction",
    interpretation:
      "Step-by-step content only works if interactive; reading without action feels incomplete.",
  },
  {
    id: "q107",
    transcriptId: "t06",
    participant: "P6",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "13:49",
    quote:
      "How do I go from here to starting the implementation for myself, like, for my company?",
    theme: "Production readiness",
    interpretation:
      "After a successful test, the user immediately wants to start building for their own company — but the page feels like a dead end.",
  },
  {
    id: "q108",
    transcriptId: "t06",
    participant: "P6",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "15:34",
    quote:
      "There's something that should be like — send your first own message from your company or whatever. Something like that, I feel like is missing here.",
    theme: "Production readiness",
    interpretation:
      "The user expected a clear “Send your first real message” / “Create your own agent” step right after testing — its absence breaks momentum.",
  },
  {
    id: "q109",
    transcriptId: "t06",
    participant: "P6",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "17:42",
    quote:
      "I didn't really pay attention too much to send with code, but I probably should have clicked and then seen what it is.",
    theme: "API playground",
    interpretation:
      "“Send with code” doesn't communicate its purpose well — users skim past it and miss the bridge to real implementation.",
  },
  {
    id: "q110",
    transcriptId: "t06",
    participant: "P6",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "01:30",
    quote:
      "We will use the conversation API to be able to do all of the above.",
    theme: "Resource creation",
    interpretation:
      "Strong developer mental model — Conversation API as the unified sending layer is inferred quickly from the channel cards.",
  },
  {
    id: "q111",
    transcriptId: "t06",
    participant: "P6",
    persona: "Developer",
    concept: "Sandbox 1.0",
    timestamp: "26:57",
    quote:
      "There might be missing an explanation to verify your agent, what verify your agent actually means.",
    theme: "Setup friction",
    interpretation:
      "The Conversation API / agent-verification dependency needs a plain-language explanation — even users with prior knowledge flag the gap.",
  },
  {
    id: "q112",
    transcriptId: "t06",
    participant: "P6",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "55:33",
    quote:
      "I did fifteen steps, and I'm not sure if I did anything at all other than read explanations.",
    theme: "Setup friction",
    interpretation:
      "The onboarding app is too passive — fifteen steps of reading without action leave the user unable to confirm progress or completion.",
  },
  {
    id: "q113",
    transcriptId: "t06",
    participant: "P6",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "53:46",
    quote:
      "It's more like I read everything in one spot, and then somewhere else, you're gonna actually see it happening.",
    theme: "Setup friction",
    interpretation:
      "Information and action are disconnected — users have to read in one place and act in another, breaking the learning-by-doing loop.",
  },

  // --- t07 / P7 (Developer, Sandbox 2.0) ---
  {
    id: "q031",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "07:36",
    quote:
      "it's kind of like, you know, like a playground type scenario... it's kinda like what you the environment to, play around with an API or something like that.",
    theme: "API playground",
    interpretation:
      "Developer interprets 'sandbox' as a safe testing environment for APIs — aligns with mental model.",
  },
  {
    id: "q032",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "04:35",
    quote:
      "So I can see all the, like, message information here. The test messages, I can see the IDs, the channel, recipient, correlation ID, and then I can see when it was delivered and when it was queued.",
    theme: "Message logs",
    interpretation:
      "Message logs provide visibility into delivery status and timing, helping developers understand the full message lifecycle.",
  },
  {
    id: "q033",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "17:57",
    quote:
      "Maybe there could be, like, a link or something that if I'm lazy and I'm because I think a lot of us in tech are, like, we just kinda scan... if I don't wanna go through with this whole thing.",
    theme: "Setup friction",
    interpretation:
      "Developer workflow favors quick scanning; unclear CTAs about production setup create friction when users want to skip ahead.",
  },
  {
    id: "q034",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "15:21",
    quote:
      "I think both are useful in different for different reasons... this is helpful for right off from the start... As a tech person, then here, this is like okay. I've seen the functionality, and here now I can see how to actually implement.",
    theme: "API playground",
    interpretation:
      "Separating capability demonstration from implementation details serves users at different stages.",
  },
  {
    id: "q114",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "45:04",
    quote:
      "I think it's definitely a step up from our current experience… I think this is super helpful that it walks you through and gets you, like, baby steps.",
    theme: "Time-to-value",
    interpretation:
      "Sandbox 2.0 reads as a clear step up — the guided, baby-step structure removes the overwhelm of earlier flows.",
  },
  {
    id: "q115",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "45:04",
    quote:
      "It explains the reason for this field and why I need to do this with countries or my business details.",
    theme: "Resource creation",
    interpretation:
      "Inline explanations of compliance / business fields turn previously-random setup steps into purposeful ones — users understand why each input exists.",
  },
  {
    id: "q116",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "49:03",
    quote:
      "I like that it doesn't throw me into the deep end.",
    theme: "Setup friction",
    interpretation:
      "Step-by-step decomposition of complexity reduces cognitive load — users feel held rather than dropped into the system.",
  },
  {
    id: "q117",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "49:58",
    quote:
      "It walks me through the setup of it, so that I almost can't go the wrong way. I kinda have to go, like, follow the correct steps.",
    theme: "Setup friction",
    interpretation:
      "A well-scaffolded flow gives users a strong sense of progress and certainty — they know they're on a path that will work.",
  },
  {
    id: "q118",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "03:03",
    quote:
      "I was focusing more on this. I didn't realize the iframe.",
    theme: "Message logs",
    interpretation:
      "The message preview iframe was overlooked — important feedback elements need stronger visual prioritisation to be noticed.",
  },
  {
    id: "q119",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "10:14",
    quote:
      "Key ID would, I'm assuming, be your access key, and then my secret key would be this one because it's called secret key. Access key and key ID was a little bit, like, I'm just assuming.",
    theme: "Setup friction",
    interpretation:
      "Naming inconsistency between “access key” and “key ID” forces guessing — clearer terminology would remove this minor cognitive tax.",
  },
  {
    id: "q120",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "40:26",
    quote:
      "Maybe some sort of link or something where I can read up on that could be helpful for somebody who doesn't fully understand the concept.",
    theme: "Setup friction",
    interpretation:
      "Even users who understand the Conversation API concept flag that others won't — a contextual link to a primer should accompany the dependency.",
  },
  {
    id: "q121",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "51:57",
    quote:
      "If there's some sort of graphic that explains, you know, this is your conversation API and here's your WhatsApp channel and here's your SMS channel and all that stuff. If I can see a quick, like, little graphic, then I understand.",
    theme: "Setup friction",
    interpretation:
      "A simple visual diagram would communicate the Conversation API → channel relationship faster than prose for visual learners.",
  },
  {
    id: "q122",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "19:41",
    quote:
      "If I'm doing this and I edit these fields, I think it would be smart for that data to persist to this page.",
    theme: "Setup friction",
    interpretation:
      "Edits made on one screen should carry over to the next — a small polish that keeps the user's context intact across the flow.",
  },
  {
    id: "q123",
    transcriptId: "t07",
    participant: "P7",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "47:35",
    quote:
      "Even if I don't come from that background, I understand because I understand what those business things are doing… I think it's pretty self explanatory.",
    theme: "Resource creation",
    interpretation:
      "Business fields (consent, use case) are framed clearly enough that even a developer without a business-side background can complete them without confusion.",
  },

  // --- t08 / P8 (Developer, Sandbox 2.0) ---
  {
    id: "q035",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "29:32",
    quote:
      "I haven't encountered anything that felt difficult, but there is kind of a lot of steps to go through.",
    theme: "Setup friction",
    interpretation:
      "Multi-step flow isn't confusing but creates cognitive load; UX could streamline presentation.",
  },
  {
    id: "q036",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "23:54",
    quote:
      "I think as a first time user, I would just want to say, like, okay. Give me give me RCS. And then this app business is sort of a detail that I don't need to know about.",
    theme: "Resource creation",
    interpretation:
      "Conversation API app concept is a leaky abstraction; users want RCS directly without understanding underlying architecture.",
  },
  {
    id: "q037",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "26:04",
    quote:
      "Yeah. I think so. I think I would want to try and send a test message. And, ideally, I would want to send it with my, company name... to my own phone.",
    theme: "Time-to-value",
    interpretation:
      "First priority is sending a branded message to self; this hands-on proof validates the product.",
  },
  {
    id: "q124",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "02:25",
    quote:
      "I'm gonna try out RCS. Because that's what I came to check out.",
    theme: "Time-to-value",
    interpretation:
      "The channel-first entry point feels natural — users immediately self-select RCS and head into the test flow.",
  },
  {
    id: "q125",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "04:07",
    quote:
      "This is probably what I would look at first, actually. I can tell it's just the HTTP message, looks pretty simple to construct in playground.",
    theme: "API playground",
    interpretation:
      "A developer's instinct is to head to the API request immediately — the payload structure communicates capability faster than UI explanations.",
  },
  {
    id: "q126",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "30:03",
    quote:
      "Nothing that would cause me to rage quit.",
    theme: "Setup friction",
    interpretation:
      "Despite the volume of steps, the flow is now usable end-to-end — no major blocker forces drop-off.",
  },
  {
    id: "q127",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "46:30",
    quote:
      "I managed to get through it, with not that much of a hassle considering the amount of questions.",
    theme: "Time-to-value",
    interpretation:
      "The number of inputs is high, but the flow is structured well enough that a developer completes the journey without getting stuck.",
  },
  {
    id: "q128",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "05:06",
    quote:
      "I didn't create an RCS agent, So I guess I would go back. And I would be curious what is an RCS agent and how do we set one up.",
    theme: "Resource creation",
    interpretation:
      "The RCS agent prerequisite is invisible until the user is blocked — they expect either auto-creation or a clear upfront explanation.",
  },
  {
    id: "q129",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "18:12",
    quote:
      "Feels like it's stuff that has already been entered. So maybe some of it could be prepopulated.",
    theme: "Setup friction",
    interpretation:
      "Repeated questions across steps create unnecessary effort and reduce trust in the flow's efficiency — prefill obvious values.",
  },
  {
    id: "q130",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "12:12",
    quote:
      "I'm confused as to why I would need to know this. Is this something that Cinch wants to know to get to know me as a customer better, or if it's something that's sent passed on to Google for RCS registration.",
    theme: "Setup friction",
    interpretation:
      "Compliance questions feel arbitrary without intent — users can't tell whether the data is for Sinch, Google, or themselves.",
  },
  {
    id: "q131",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "16:50",
    quote:
      "I'm not sure who is going to reach out to me. If that's some RCS entity or if it's Cinch.",
    theme: "Setup friction",
    interpretation:
      "Ownership of the flow is unclear: Sinch, Google, operators all blur together — creates trust issues and a fragmented mental model.",
  },
  {
    id: "q132",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "26:04",
    quote:
      "I don't really care about webhooks until later. If I send to my own phone, then I don't really need confirmation elsewhere. Then I might try webhooks.",
    theme: "Setup friction",
    interpretation:
      "Webhooks belong after the first successful send — users want to see the message arrive on their phone before exploring delivery feedback infrastructure.",
  },
  {
    id: "q133",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "30:46",
    quote:
      "I'm wondering what best for high throughput, best for two way. This is a bit confusing to me… as a user, I would probably just assume to be able to do everything.",
    theme: "Resource creation",
    interpretation:
      "Telecom-driven channel constraints (dispatch vs conversational) aren't intuitive — users default to assuming the platform supports any use case.",
  },
  {
    id: "q134",
    transcriptId: "t08",
    participant: "P8",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "42:32",
    quote:
      "I'm finding it difficult to find my way… I don't know how to find my way back to the app view that I was at previously.",
    theme: "Setup friction",
    interpretation:
      "Navigation between sandbox, agent setup, and the app view is weak — users lose their place when moving between sections.",
  },

  // --- t09 / P9 (Non-developer, Sandbox 2.0) ---
  {
    id: "q038",
    transcriptId: "t09",
    participant: "P9",
    persona: "Non-developer",
    concept: "Sandbox 2.0",
    timestamp: "02:28",
    quote:
      "I think it would like, the the option to have the logo ready immediately, kind of like instantly have how you want the message to come across. It's pretty pretty simple.",
    theme: "Time-to-value",
    interpretation:
      "Non-technical users value immediate visual feedback of branding; seeing the message drives confidence.",
  },
  {
    id: "q039",
    transcriptId: "t09",
    participant: "P9",
    persona: "Non-developer",
    concept: "Sandbox 2.0",
    timestamp: "05:30",
    quote:
      "One way or two way is also some people may find that confusing. But that just, like, I know at least in the US, that's that's the, like, language we're told to use.",
    theme: "Setup friction",
    interpretation:
      "Term consistency matters; 'conversational' vs 'dispatch' terminology confuses users.",
  },
  {
    id: "q040",
    transcriptId: "t09",
    participant: "P9",
    persona: "Non-developer",
    concept: "Sandbox 2.0",
    timestamp: "08:12",
    quote:
      "Having this available for for clarification is good... if they had, like, a confirmation, like, hey. Your agent was successfully set up. This is your Google agent ID. This is your Cinch ID.",
    theme: "Production readiness",
    interpretation:
      "Confirmation emails with key IDs provide reassurance and reference material.",
  },
  {
    id: "q135",
    transcriptId: "t09",
    participant: "P9",
    persona: "Non-developer",
    concept: "Sandbox 2.0",
    timestamp: "00:32",
    quote:
      "This is pretty simple… this is also pretty straightforward. I think that someone without a dev background would be able to go in and set that up pretty well.",
    theme: "Time-to-value",
    interpretation:
      "First test where a non-developer immediately judges the flow as simple and viable for their persona — strong signal of accessibility.",
  },
  {
    id: "q136",
    transcriptId: "t09",
    participant: "P9",
    persona: "Non-developer",
    concept: "Sandbox 2.0",
    timestamp: "12:20",
    quote:
      "This would appeal to, like, a retail brand… most people like the the card, like, the app like experience where they can send you, like, an offer and then you order it… customize your order all within the text message.",
    theme: "Time-to-value",
    interpretation:
      "Templates and rich-card experiences land especially well with marketing personas — the in-message commerce flow is a clear selling point of RCS.",
  },
  {
    id: "q137",
    transcriptId: "t09",
    participant: "P9",
    persona: "Non-developer",
    concept: "Sandbox 2.0",
    timestamp: "18:05",
    quote:
      "I like that it's always taking you to, like, what the next step in the process is… I wouldn't be confused on what to do next.",
    theme: "Time-to-value",
    interpretation:
      "Step-by-step structure gives non-developers a clear forward path — they always know the next action, which builds confidence.",
  },
  {
    id: "q138",
    transcriptId: "t09",
    participant: "P9",
    persona: "Non-developer",
    concept: "Sandbox 2.0",
    timestamp: "11:08",
    quote:
      "Being able to see, like, have updates on what's going on… if they're reading it, that has been delivered, that has been sent. If the number was bad, they'd have access to information. If it bounces, it'd say like 'message not delivered.'",
    theme: "Message logs",
    interpretation:
      "Delivery states and message logs translate directly to business value: debugging, support escalation, and identifying delivery issues.",
  },
  {
    id: "q139",
    transcriptId: "t09",
    participant: "P9",
    persona: "Non-developer",
    concept: "Sandbox 2.0",
    timestamp: "16:35",
    quote:
      "What would generating an access key do exactly? Like, what is the use case for that?",
    theme: "Setup friction",
    interpretation:
      "Developer-only credentials surface in a flow that markets to non-developers — access keys feel irrelevant and unfamiliar to a marketing persona.",
  },
  {
    id: "q140",
    transcriptId: "t09",
    participant: "P9",
    persona: "Non-developer",
    concept: "Sandbox 2.0",
    timestamp: "27:14",
    quote:
      "Why would the RCS agent not automatically be connected to common API?",
    theme: "Setup friction",
    interpretation:
      "From a non-developer mindset, the agent should be ready to use after creation — needing to connect it to a separate Conversation API app feels like hidden plumbing.",
  },
  {
    id: "q141",
    transcriptId: "t09",
    participant: "P9",
    persona: "Non-developer",
    concept: "Sandbox 2.0",
    timestamp: "29:58",
    quote:
      "For someone else, integrate sounds like optional. I think maybe just make it a little bit more clear that you need to integrate for your agent, like, to be able to send messages.",
    theme: "Setup friction",
    interpretation:
      "“Integrate” reads as optional to non-developers — making it explicitly required prevents users from stopping before completing setup.",
  },
  {
    id: "q142",
    transcriptId: "t09",
    participant: "P9",
    persona: "Non-developer",
    concept: "Sandbox 2.0",
    timestamp: "36:33",
    quote:
      "In this one, they're using dispatch. In the other one, they use the term nonconversational and conversational. I think if you kept it all uniform…",
    theme: "Setup friction",
    interpretation:
      "Using two different terms (dispatch / conversational vs nonconversational / conversational) for the same concept creates avoidable confusion — one consistent vocabulary is needed.",
  },
  {
    id: "q143",
    transcriptId: "t09",
    participant: "P9",
    persona: "Non-developer",
    concept: "Sandbox 2.0",
    timestamp: "28:21",
    quote:
      "I made the RCS agent. I've sent the test message. I've done everything I need to do. This would be maybe a little bit confusing… why am I having to connect to the app when it's like, isn't that what I made the agent for kind of thing?",
    theme: "Setup friction",
    interpretation:
      "Mismatch between expectation (agent = ready to send) and reality (agent → app → API connection required) — non-developers don't understand why the work isn't already done.",
  },

  // --- t11 / P11 (Developer, Sandbox 2.0) ---
  {
    id: "q041",
    transcriptId: "t11",
    participant: "P11",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "11:08",
    quote:
      "Like, being able to see, like, like, have updates on what's going on, like, if they're being able like, if they're reading it, that has been delivered, that has been sent. Because that way they'll know if they send a message to, like, a singular number.",
    theme: "Message logs",
    interpretation:
      "Real-time message status visibility reduces support load; users can self-diagnose delivery issues.",
  },
  {
    id: "q042",
    transcriptId: "t11",
    participant: "P11",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "09:24",
    quote:
      "Any client who is using RCS through our platform would definitely leverage it and use it on their own code base.",
    theme: "API playground",
    interpretation:
      "Showing code alongside UI is essential; most users need code samples for their own systems.",
  },
  {
    id: "q043",
    transcriptId: "t11",
    participant: "P11",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "24:57",
    quote: "Why would why would this not be automatic? Like, why would the RCS, like, agent not automatically be connected to common API?",
    theme: "Production readiness",
    interpretation:
      "Manual connection step feels unintuitive; users expect agent creation to wire to messaging automatically.",
  },

  // --- t12 / P12 (Developer, Sandbox 2.0) ---
  {
    id: "q044",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "01:55",
    quote:
      "So since I'm a developer, my instinct could be just to open up a terminal and run this command in curl because that would be the simplest way.",
    theme: "API playground",
    interpretation:
      "Developer prefers direct API access via terminal over UI abstractions for quick prototyping.",
  },
  {
    id: "q045",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "04:59",
    quote:
      "I like the layout of this page. It looks great. I like the fact that the cards are collapsed here, just showing a preview of the information, but the very last one is expanded to show me the output of the commands here.",
    theme: "Time-to-value",
    interpretation:
      "Clear information hierarchy and collapsible cards improve cognitive load.",
  },
  {
    id: "q046",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "07:39",
    quote:
      "So wait. So let me generate a key first. There we go. So these would be the things that I want here. Oh, it's already there, which is beautiful.",
    theme: "Time-to-value",
    interpretation:
      "Auto-population of generated keys reduces friction and meets developer expectations.",
  },
  {
    id: "q047",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "18:33",
    quote: "Website is w w w dot w w dot com… It's, quite heavy.",
    theme: "Production readiness",
    interpretation:
      "RCS go-live compliance requirements feel burdensome to developers unfamiliar with carrier rules.",
  },
  {
    id: "q048",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "31:19",
    quote:
      "This part is confusing to me just because I didn't actually set up a test app beforehand. So, like, this setting up the webhooks part, that makes sense.",
    theme: "Setup friction",
    interpretation:
      "Context loss when navigating between flows; developers need explicit framing of step context.",
  },
  {
    id: "q049",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "39:22",
    quote:
      "That was actually super easy. Like, the sending the test message, working with the API, I really liked how user friendly that flow was.",
    theme: "Time-to-value",
    interpretation:
      "Initial quick-test experience is delightful; complexity only emerges in production flow.",
  },

  // --- t13 / P13 (Developer, Sandbox 2.0) ---
  {
    id: "q050",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "06:56",
    quote:
      "I like the fact that we can run the request directly from there. Usually you need to copy-paste into your terminal.",
    theme: "API playground",
    interpretation:
      "In-browser API execution removes context-switching friction common in API docs.",
  },
  {
    id: "q051",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "14:47",
    quote:
      "Super easy. And once again, I like the fact that you have the preview here, because you can directly see, the what will happen on the on the phone screen.",
    theme: "Message logs",
    interpretation:
      "Real-time visual preview significantly reduces cognitive overhead for non-designers.",
  },
  {
    id: "q052",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "23:41",
    quote:
      "Because I was like, I don't know what it is, and I don't have any information. I didn't pay attention to view. But, okay. So to be honest, I don't know what's the difference between those two.",
    theme: "Setup friction",
    interpretation:
      "Country-specific regulatory variations lack clear guidance; non-experts struggle without docs.",
  },
  {
    id: "q053",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "38:56",
    quote:
      "Great. Except, yeah, few few comments that I that I push for the countries, and, before… it was quite fast, easy to understand… especially if you are, under this market, because this is the you know how, things are working.",
    theme: "Setup friction",
    interpretation:
      "Messaging industry expertise required to navigate compliance steps smoothly.",
  },

  // --- t14 / P14 (Developer, Sandbox 2.0) ---
  {
    id: "q054",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "09:30",
    quote:
      "I really like this view… The the OpenAPI play around I mean, this, this part in particular is important, certainly, but I I'm almost finding myself less interested in, in this version versus, versus the previous version.",
    theme: "Time-to-value",
    interpretation:
      "Combined UI + code preview better serves exploratory developers than API-only playground.",
  },
  {
    id: "q055",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "12:42",
    quote:
      "It it is a little, a little odd, at least only from the perspective of if this is set up to be a test message… I would almost assume that this code would be more or less the same, the same code, but using that, whatever temporary access key is being used in the background.",
    theme: "API playground",
    interpretation:
      "Code samples should match working credentials; divergence between UI test and API code confuses.",
  },
  {
    id: "q056",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "19:56",
    quote:
      "It, it was definitely the the freedom of a, of a text box with a requirement that I wasn't aware of… Would that potentially, hurt me later in the flow?",
    theme: "Setup friction",
    interpretation:
      "Hidden compliance rules (e.g., no slogans in descriptions) appear mid-form and lack up-front guidance.",
  },
  {
    id: "q057",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "24:26",
    quote:
      "Is it fair to say that these two are kind of like, you've done the first part, you've created your agent, now you must do step one, step two to actually start using the agent, as the prepare to go live.",
    theme: "Setup friction",
    interpretation:
      "Two parallel checklists create ambiguity about sequencing and whether both are mandatory.",
  },
  {
    id: "q058",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "44:01",
    quote:
      "Yes. Now, is this, would this just be the the prototype? Or after completing these steps, would this, well, actually, I have not submitted for approval… I broke the prototype and created my own confusion.",
    theme: "Production readiness",
    interpretation:
      "Missing submit-for-approval CTA causes users to think they're complete when compliance steps remain.",
  },
  {
    id: "q059",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "52:33",
    quote:
      "I love the, the previews. The previews give visual to the configuration that I am barreling through… If, if I, as a developer, hear that something is required for compliance, I immediately start to start getting, stakeholders involved.",
    theme: "Production readiness",
    interpretation:
      "Explicit 'compliance required' labels trigger delegation; unlabeled steps look discretionary.",
  },

  // --- t10 / P10 (Developer with sales/account-manager background, Sandbox 2.0) ---
  {
    id: "q060",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "06:06",
    quote:
      "So what I'm looking at this, like, here, it seems that, we need to copy that and to put ourselves, like, our credential to go somewhere to check our project ID and put it.",
    theme: "Resource creation",
    interpretation:
      "Non-developers struggle with parameter identification in API examples; inline docs insufficient.",
  },
  {
    id: "q061",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "07:03",
    quote:
      "I think yes. When I'm, if I'm logging inside the platform and I can do that, then yes… Maybe also, being able to I don't know, to see because I guess when you are on the platform, you could have multiple project ID, multiple, API keys, secrets…",
    theme: "Resource creation",
    interpretation:
      "Pre-filling and contextual credential selection would reduce burden for non-technical onboarders.",
  },
  {
    id: "q062",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "28:45",
    quote:
      "Just to seems to, one contact wants to opt in to receive some communication from us… or by subscribing to a loyalty program… So when you are a sales service customer, I have no idea of what, I should put here.",
    theme: "Setup friction",
    interpretation:
      "Compliance fields (consent, opt-in) lack context for non-legal users; requirements feel arbitrary.",
  },
  {
    id: "q063",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "31:27",
    quote:
      "When you are a sales service customer, when you just want to send messages, I have really no idea of what I should put here… And Yeah. I guess one of the two option is required and if one of the two option is required, I want you don't really know exactly.",
    theme: "Setup friction",
    interpretation:
      "Mandatory compliance fields lack guidance; self-service collapses without domain expertise.",
  },
  {
    id: "q064",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "47:24",
    quote:
      "I think especially the onboarding part… I think it's, really great, at least a lot compared to to what I have experienced, a few months ago… a lot of, details that could maybe some missing links to more information, like to learn more links.",
    theme: "Production readiness",
    interpretation:
      "Dramatic improvement over previous version but still lacks embedded help/learn-more links.",
  },
  {
    id: "q065",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "55:27",
    quote:
      "What you want to see, the request, payload expected, the variables, where to find those variables, and what this call is doing… And here you have clearly, a test, a sample message that you said you will receive it.",
    theme: "Message logs",
    interpretation:
      "Clear labeling of request payloads, variables, and sample outputs accelerates developer onboarding.",
  },
  {
    id: "q144",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "55:53",
    quote:
      "I really see, like, a huge difference compared to when I tried to use it before. A lot better than before. Really.",
    theme: "Production readiness",
    interpretation:
      "Returning user explicitly confirms the redesign solves real historical pain points — a strong validation signal from someone who previously gave up.",
  },
  {
    id: "q145",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "47:24",
    quote:
      "You finish onboarding, which is pretty straightforward. Like, you just need to follow step. Nothing really complicated.",
    theme: "Time-to-value",
    interpretation:
      "Step-by-step structure lets a returning user complete setup independently — no support team needed this time.",
  },
  {
    id: "q146",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "50:18",
    quote:
      "Every secret that you need seems to be on the same page, which is a really game changer in my opinion… having this page of app, which seems to be kind of your starting point.",
    theme: "Resource creation",
    interpretation:
      "The centralised app view (project ID, app ID, credentials in one place) directly fixes the previous version's biggest pain point — “not knowing where to find things.”",
  },
  {
    id: "q147",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "20:37",
    quote:
      "This is very useful. Like, this was something that, in my opinion, was very missing in the previous version. Like, not knowing where you need to go to get your information in the dashboard.",
    theme: "Production readiness",
    interpretation:
      "Documentation linking and clear references to where IDs and concepts live address the returning user's most acute previous frustration.",
  },
  {
    id: "q148",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "07:30",
    quote:
      "Your project ID, this is not really clear as a developer that this is a parameter that you need to fill. So in general, when you want to fill a parameter, you have this kind of notation… If you just look at the URL like that, you may not think that your project ID is a variable that you need to replace.",
    theme: "API playground",
    interpretation:
      "API examples don't visually mark which tokens are variables — using `<chevron>` or `:colon` notation would prevent guessing on the first call.",
  },
  {
    id: "q149",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "01:15",
    quote:
      "What I'm looking for when I'm a developer, when I want to start playing with APIs, is also having the possibility to download somewhere like a Postman collection… so you could see everything quite fast.",
    theme: "API playground",
    interpretation:
      "A downloadable Postman collection is a baseline expectation for developer APIs — it lets users explore endpoints in their own tool of choice.",
  },
  {
    id: "q150",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "27:25",
    quote:
      "I have no idea what I need to do if I should contact someone… kind of lost. I know there is some action required. Don't really know what.",
    theme: "Setup friction",
    interpretation:
      "Country-specific and Google requirements are surfaced as “required,” but onboarding doesn't explain what the action is or who to contact — leaving users stuck.",
  },
  {
    id: "q151",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "39:59",
    quote:
      "There is a lot of layers of hierarchy inside it. So you have a project. Seems like in the project you have apps, but you have also agents. There is a lot of things everywhere, which makes things a bit complicated.",
    theme: "Resource creation",
    interpretation:
      "Even with improved guidance, the underlying project / app / agent hierarchy still leaks — users feel the structural complexity even when the flow itself is clear.",
  },
  {
    id: "q152",
    transcriptId: "t10",
    participant: "P10",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "23:00",
    quote:
      "In case something is not working as you expect, since there is no link to like, okay, well, if something went wrong, like go here and you will see all the different reasons maybe for that, like all the error states.",
    theme: "Setup friction",
    interpretation:
      "The flow shows the success path but no troubleshooting — developers want a documented set of error states with explanations and remediation hints.",
  },
  {
    id: "q153",
    transcriptId: "t01",
    participant: "P1",
    persona: "Developer",
    concept: "Onboarding app",
    timestamp: "06:45",
    quote:
      "I would have an app per integration that I do… I want to integrate it in multiple softwares, multiple back ends maybe. And this is a way for me to kinda separate the integrations. So, yeah, I would expect to find the kind of keys and API when I go into the app.",
    theme: "Resource creation",
    interpretation:
      "Developers see the “app” as a per-integration container — a way to separate backends and locate the keys / API associated with each.",
  },
  {
    id: "q154",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "30:10",
    quote:
      "I would not like the app to be created for me… I should be determining what the name is from the very start.",
    theme: "Resource creation",
    interpretation:
      "Auto-creating the app removes ownership — developers expect to name and create their app deliberately so they know which app they're working in.",
  },
  {
    id: "q155",
    transcriptId: "t11",
    participant: "P11",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "40:09",
    quote:
      "The UI was pretty straightforward. Everything was explained and structured in a clear way. I didn't have to search for anything. It was just there.",
    theme: "Time-to-value",
    interpretation:
      "First-time external developer judges the flow as immediately clear and structured — no searching needed, decisions are minimal.",
  },
  {
    id: "q156",
    transcriptId: "t11",
    participant: "P11",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "40:09",
    quote:
      "The only decision I had to make was which option I'm gonna do — to do a live test, or API testing, or create an RCS agent.",
    theme: "Time-to-value",
    interpretation:
      "Low-friction entry — the entire onboarding collapses into a single early decision point: test vs. create agent.",
  },
  {
    id: "q157",
    transcriptId: "t11",
    participant: "P11",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "23:45",
    quote:
      "You don't have to do anything apart from copying and filling the access key and the secret key. You don't have to type it as well — you could copy and paste. So there will be less mistakes when you do that.",
    theme: "API playground",
    interpretation:
      "Prefilled API requests deliver the right developer ergonomics — copy / paste / run, with reduced typo risk and minimal cognitive overhead.",
  },
  {
    id: "q158",
    transcriptId: "t11",
    participant: "P11",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "12:25",
    quote:
      "This is super useful. Basically, we get a lot of queries revolving around these, because the customer only could see a few details of the message they have sent. So most of the time, when a client wants to know what happened to the message, they would basically have to reach out to an AM or create a ticket. So the queries that right now we have would be reduced.",
    theme: "Message logs",
    interpretation:
      "Visible message logs translate directly to operational value: fewer support queries, fewer tickets, more self-service for customers.",
  },
  {
    id: "q159",
    transcriptId: "t11",
    participant: "P11",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "16:50",
    quote:
      "Now it makes more sense. I had doubts on contact ID — so having this explained to me kind of makes it more clear for me.",
    theme: "Resource creation",
    interpretation:
      "Inline tooltips on unknown fields close the comprehension gap on demand — progressive disclosure works for technical concepts.",
  },
  {
    id: "q160",
    transcriptId: "t11",
    participant: "P11",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "40:09",
    quote:
      "Everything is happening on the front end. They have visibility to the code if they want and how it's gonna show up. So I think it's really transparent. Visibility was there for the user.",
    theme: "Time-to-value",
    interpretation:
      "Transparency is a major strength — the user can see exactly what is happening end-to-end, which builds confidence and reduces guessing.",
  },
  {
    id: "q161",
    transcriptId: "t11",
    participant: "P11",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "01:20",
    quote:
      "Do we expect the client to know which one they should create? Like, do a test message first, or create an RCS agent?",
    theme: "Resource creation",
    interpretation:
      "Even when users choose correctly, the up-front choice between “send test message” and “create agent” introduces a moment of hesitation.",
  },
  {
    id: "q162",
    transcriptId: "t11",
    participant: "P11",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "23:00",
    quote:
      "I've seen even the engineers come and ask what they should use for authenticating this.",
    theme: "API playground",
    interpretation:
      "Authentication is consistently underexplained — even engineers ask which credentials to use, indicating a baseline guidance gap.",
  },
  {
    id: "q163",
    transcriptId: "t11",
    participant: "P11",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "33:29",
    quote:
      "I think it's redundant — we have the same payload repeating itself. The only thing that is changing is the status and event time.",
    theme: "Message logs",
    interpretation:
      "Showing the full payload for every event is unnecessary in a tracking view — show one payload + status / timestamp deltas instead.",
  },
  {
    id: "q164",
    transcriptId: "t11",
    participant: "P11",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "48:20",
    quote:
      "I'm not sure what connecting your RCS agent to the conversation API means… if a customer doesn't know what conversation API is, then there might be a doubt. But it's not because of the UI — it's because of I don't know how the product itself is working.",
    theme: "Setup friction",
    interpretation:
      "The Conversation API connection is a conceptual model issue, not a UI issue — users without prior knowledge will hesitate even with a good UI.",
  },
  {
    id: "q165",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "06:30",
    quote:
      "When I'm just getting familiar with the product, I check out this page one time, and then every single time after that I'll just go straight to the API.",
    theme: "API playground",
    interpretation:
      "Developers happily use the UI once for orientation, then graduate to the API for everything that follows — a clean two-stage workflow.",
  },
  {
    id: "q166",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "04:20",
    quote:
      "It says queued. Oh, now it says delivered. That's cool. So delivered, and then we can tell when the message is read.",
    theme: "Message logs",
    interpretation:
      "Real-time queued → delivered → read state transitions land as concrete proof that messaging works — the moment that converts confidence.",
  },
  {
    id: "q167",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "06:00",
    quote:
      "I think that prevents people who don't gravitate towards the API part from getting overloaded with all of that code… if you're targeting a wide range of people, it makes sense to offer the simple version first, and then go into the more nerdy stuff after.",
    theme: "API playground",
    interpretation:
      "Validates the UI vs API split — supports non-developers without burying them in code, while still serving developers via the playground.",
  },
  {
    id: "q168",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "16:30",
    quote:
      "It feels very tedious filling out this information.",
    theme: "Setup friction",
    interpretation:
      "Compliance / business-detail forms feel disproportionately heavy when the user's current goal is still testing — wrong work at the wrong moment.",
  },
  {
    id: "q169",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "15:14",
    quote:
      "It wasn't clear to me that I need to do both of these or click on both of these items down here.",
    theme: "Setup friction",
    interpretation:
      "Required steps don't read as required — users miss them and end up with incomplete setup.",
  },
  {
    id: "q170",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "29:08",
    quote:
      "I don't really know what a channel is, but apparently that's good.",
    theme: "Setup friction",
    interpretation:
      "Telecom-specific terms like “channel” are unfamiliar to a typical developer — context is needed to anchor advanced concepts.",
  },
  {
    id: "q171",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "35:50",
    quote:
      "That's what I was just gonna say. Probably just, like, move it up one.",
    theme: "Setup friction",
    interpretation:
      "Task order is wrong — the user explicitly suggested moving the “send messages” step earlier, ahead of compliance.",
  },
  {
    id: "q172",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "29:08",
    quote:
      "It makes sense because you have to — I would have to connect my application that I want to work with the agent somehow… It's just confusing because I didn't actually do the creation part, so I just got dropped here.",
    theme: "Resource creation",
    interpretation:
      "The app concept itself isn't confusing — the timing and lack of ownership are. Users want to create the app deliberately, not be dropped into it.",
  },
  {
    id: "q173",
    transcriptId: "t12",
    participant: "P12",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "00:30",
    quote:
      "I don't know what an RCS agent is, so I think the first thing that I would do is click on send test message to see if I can do that.",
    theme: "Time-to-value",
    interpretation:
      "Users sidestep unfamiliar concepts by reaching for the most concrete action — “Send test message” is the universal first move.",
  },
  {
    id: "q174",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "00:42",
    quote:
      "I don't really know what an RCS agent is, in detail, just briefly. But, yeah, first, I will click on send test message.",
    theme: "Time-to-value",
    interpretation:
      "Test-first is the natural entry point — users sidestep unknown concepts by reaching for the concrete action.",
  },
  {
    id: "q175",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "10:30",
    quote:
      "This is quite simple, clear, and easy to use. I didn't pay attention to Node and Python, but most of the time when you test, you use curl.",
    theme: "Time-to-value",
    interpretation:
      "Strong signal that the test-first onboarding works for both new and semi-experienced users without explanation.",
  },
  {
    id: "q176",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "06:56",
    quote:
      "I like both because that's quite easy. Everything is shown.",
    theme: "API playground",
    interpretation:
      "UI + API combination is validated — both feel equally easy and serve different developer styles.",
  },
  {
    id: "q177",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "09:48",
    quote:
      "It looks the same like sending an SMS, but with more capabilities.",
    theme: "Time-to-value",
    interpretation:
      "Strong product clarity — the user immediately positions RCS as “SMS + richer capabilities,” the right mental model.",
  },
  {
    id: "q178",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "38:56",
    quote:
      "You can have result really really quickly.",
    theme: "Time-to-value",
    interpretation:
      "Fast test-to-feedback loop is one of the standout strengths of the new flow.",
  },
  {
    id: "q179",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "01:06",
    quote:
      "An agent for a country, if I'm not wrong, or per country, that is able to send a message?",
    theme: "Resource creation",
    interpretation:
      "“RCS agent” is not intuitive — users guess it means a phone number or country-bound sender, missing its actual identity-and-brand role.",
  },
  {
    id: "q180",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "06:56",
    quote:
      "What I thought weird at the beginning is finding the IDs. I didn't see that to enable that, but that's the only thing that was weird in my opinion.",
    theme: "API playground",
    interpretation:
      "Locating the project / app credentials at first contact is unclear — a small but consistent friction at API setup time.",
  },
  {
    id: "q181",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "14:47",
    quote:
      "When I land on that, this is weird because I land on this page, but the first thing I see is one on four. And, yeah, this is not expanded. So in my mind, I will assume that the other ones are not mandatory, but I assume it is.",
    theme: "Setup friction",
    interpretation:
      "Step counters that don't communicate required-vs-optional create uncertainty about whether the user has actually completed setup.",
  },
  {
    id: "q182",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "30:27",
    quote:
      "First, as a developer, when I wanna test, I don't want to integrate right now from with an app. So this will be later in my discovery of Sinch Build.",
    theme: "Setup friction",
    interpretation:
      "Integration is shown too early in the flow — developers want to validate first and integrate as a later, deliberate step.",
  },
  {
    id: "q183",
    transcriptId: "t13",
    participant: "P13",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "34:54",
    quote:
      "Here, this is the review for the agent specifically. But the countries are not really highlighted somewhere. You don't know what's happening for the country itself. Maybe something else needs to be displayed.",
    theme: "Setup friction",
    interpretation:
      "The agent-vs-country approval model is unclear — users expect to see country-level status alongside the agent's review state.",
  },
  {
    id: "q184",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "00:30",
    quote:
      "If there is a demo, go for the demo. So that's why I honed in straight into send a test message versus create an agent.",
    theme: "Time-to-value",
    interpretation:
      "Confirms the test-first instinct: developers reach for the most concrete demonstration of the product before exploring concepts.",
  },
  {
    id: "q185",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "06:00",
    quote:
      "I would probably end up taking these examples out of the playground, and I would probably end up taking them into my terminal to do a diff between them.",
    theme: "API playground",
    interpretation:
      "Real developer workflow — copy code, move to terminal, experiment locally — is exactly what the API playground enables.",
  },
  {
    id: "q186",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "07:35",
    quote:
      "How am I gonna get notification back that the message has been acted on or so forth? So scrolling to this kind of answered that for me.",
    theme: "Message logs",
    interpretation:
      "Logs answer the developer's most immediate post-send question (“how do I know it worked?”) — which is critical for trust.",
  },
  {
    id: "q187",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "29:30",
    quote:
      "I didn't initially see the connection between the steps that I did previously and that this was doing a setup for the test. I was actually treating these as two distinct blocks of things to be done.",
    theme: "Setup friction",
    interpretation:
      "Two parallel checklists (test setup vs go-live) read as independent — the relationship between them is hidden until the user discovers it accidentally.",
  },
  {
    id: "q188",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "35:45",
    quote:
      "I ignored the integrate tab — mostly because I was taking it from the approach of I just want to write some code to send a message real quick. I'll worry about the integration later.",
    theme: "Setup friction",
    interpretation:
      "Integration is shown alongside compliance, but the user's intent at this stage is just-write-code — the system doesn't reflect that intent-based progression.",
  },
  {
    id: "q189",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "29:30",
    quote:
      "Should my test number from before have been ported over to here since it was already approved?",
    theme: "Setup friction",
    interpretation:
      "Users expect approved test data to carry forward across steps — re-entering the same value reads as missing continuity.",
  },
  {
    id: "q190",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "37:00",
    quote:
      "I wasn't drawing a clear distinction between the test numbers and the go live numbers.",
    theme: "Setup friction",
    interpretation:
      "Test vs production boundary exists in the system but isn't visible — users blur the two and risk acting in the wrong context.",
  },
  {
    id: "q191",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "41:30",
    quote:
      "It was clear that they were different. It wasn't necessarily clear of the role differentiator.",
    theme: "Setup friction",
    interpretation:
      "Compliance vs integration look distinct but their *purpose* (when to do which) isn't communicated — users see two paths but not their respective intents.",
  },
  {
    id: "q192",
    transcriptId: "t14",
    participant: "P14",
    persona: "Developer",
    concept: "Sandbox 2.0",
    timestamp: "44:30",
    quote:
      "This is fantastic. The flow from send test, test the API to so forth — this is fantastic. I love this. It is very intuitive, very intuitive.",
    theme: "Time-to-value",
    interpretation:
      "Strong main-reaction quote — the test → API flow is intuitive and aligns with developer expectations end-to-end.",
  },
];

export const quoteById = (id: string) => quotes.find((q) => q.id === id);
