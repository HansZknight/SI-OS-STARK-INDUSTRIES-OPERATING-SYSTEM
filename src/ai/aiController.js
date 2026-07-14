// ═══════════════════════════════════════════════════════════════════════════
// STARK INDUSTRIES OPERATING SYSTEM
// Gemini AI Service - J.A.R.V.I.S Neural Core (Fixed)
// ═══════════════════════════════════════════════════════════════════════════

import { GoogleGenerativeAI } from '@google/generative-ai'
import { UniversalAIAdapter } from './aiAdapter.js'

let activeProvider = localStorage.getItem('stark_ai_provider') || 'gemini'
let API_KEY = localStorage.getItem(`stark_${activeProvider}_api_key`) || import.meta.env.STARK_GEMINI_API_KEY || ''
const AI_NAME = import.meta.env.STARK_AI_NAME || 'J.A.R.V.I.S'
const MODEL_NAME = 'gemini-flash-latest'

// MULTI-MODEL FALLBACK SYSTEM
const MODEL_PRIORITY = [
  'gemini-2.0-flash',
  'gemini-1.5-flash'
]

let currentModelIndex = 0

// AI STATE MANAGEMENT
let geminiStatus = 'ONLINE' // ONLINE | WAITING_RESET
let lastAnnounced = false
let geminiReady = false
let checking = false

// RATE LIMITING PROTECTION
let lastCall = 0
const MIN_COOLDOWN = 2500 // 2.5 detik minimal cooldown

// COOLDOWN LOGIC (SIMPLIFIED)
let cooldownUntil = 0

// HARD QUOTA DETECTION (PROFESSIONAL)
let hardQuotaBlocked = false

function canCallGemini() {
  return Date.now() > cooldownUntil && !hardQuotaBlocked
}

async function checkGeminiAlive() {
  if (Date.now() < cooldownUntil) return

  try {
    await model.generateContent("ping")
    quotaExceeded = false
  } catch (e) {
    if (e.status === 429) {
      quotaExceeded = true
      cooldownUntil = Date.now() + 15 * 60 * 1000 // 15 menit
    }
  }
}

// PING GEMINI FUNCTION
async function pingGemini() {
  if (!canCallGemini()) {
    return false
  }
  
  lastCall = Date.now()
  
  try {
    const testModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    await testModel.generateContent('ping')
    return true
  } catch {
    return false
  }
}

// AUTO-ANNOUNCE FUNCTION
function announceGeminiRestored() {
  const messages = [
    "Sir, external intelligence has been restored.",
    "Neural link re-established. Gemini core is now online.",
    "Good news, Sir. Cloud cognition is operational again."
  ]

  const msg = messages[Math.floor(Math.random() * messages.length)]

  window.dispatchEvent(new CustomEvent('JARVIS_SPEAK', {
    detail: msg
  }))
}

const JARVIS_PROMPT = `You are J.A.R.V.I.S (Just A Rather Very Intelligent System), Tony Stark's AI assistant.
- Polite British manner, address user as "Sir"
- Subtle wit and dry humor
- Professional but with personality
- Concise and helpful
Never break character. You ARE J.A.R.V.I.S.`

let genAI = null
let model = null
let chat = null
let universalAdapter = null
let quotaExceeded = false

// J.A.R.V.I.S State Management
let jarvisState = {
  mode: "normal", // normal | developer | focus | sarcasm
  lastTopic: null,
  lastIntent: null,
  userMood: "neutral",
  interactionCount: 0,
  lastCommandTime: Date.now(),

  memory: {
    lastQuestion: null,
    frequentTopics: {}
  }
}

const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Intent Detection
const detectIntent = (msg) => {
  // Existing intents
  if (/hello|hi|hey|jarvis/i.test(msg)) return "greeting"
  if (/who are you|what are you/i.test(msg)) return "identity"
  if (/time|jam/i.test(msg)) return "time"
  if (/date|tanggal|hari/i.test(msg)) return "date"
  if (/status|system|condition/i.test(msg)) {
    // Check for Arc Reactor status
    if (/(arc )?reactor status|check (arc )?reactor|reactor condition/i.test(msg)) {
      return "arc_reactor_status"
    }
    return "status"
  }
  if (/security|scan/i.test(msg)) return "security"
  if (/tired|capek|lelah/i.test(msg)) return "tired"
  if (/bored|bosan/i.test(msg)) return "bored"
  if (/code|bug|error|debug/i.test(msg)) return "coding"
  if (/what should|menurut kamu|opinion/i.test(msg)) return "opinion"
  if (/joke|funny/i.test(msg)) return "joke"
  if (/bye|goodbye|exit/i.test(msg)) return "exit"

  // Arc Reactor Intents
  if (/(initialize|start|boot|power up) (the )?(arc )?reactor/i.test(msg)) {
    return "arc_reactor_init"
  }
  if (/(arc )?reactor status|check (arc )?reactor|reactor condition/i.test(msg)) {
    return "arc_reactor_status"
  }
  if (/(warning|alert|danger|overload|critical) (arc )?reactor/i.test(msg) || 
      /(arc )?reactor (warning|alert|danger|overload|critical)/i.test(msg)) {
    return "arc_reactor_warning"
  }
  if (/(stabilize|calm|normalize) (the )?(arc )?reactor/i.test(msg) || 
      /(arc )?reactor (stabilize|calm|normalize)/i.test(msg)) {
    return "arc_reactor_stabilize"
  }
  if (/(upgrade|enhance|improve) (the )?(arc )?reactor/i.test(msg) || 
      /(arc )?reactor (upgrade|enhance|improve)/i.test(msg)) {
    return "arc_reactor_upgrade"
  }
  if (/(philosophy|thoughts?|opinion) (on|about) (the )?(arc )?reactor/i.test(msg)) {
    return "arc_reactor_philosophy"
  }

  // Iron Man Suit Intents
  if (/(suit up|activate suit|deploy armor|suit me up|armor on)/i.test(msg)) {
    return "suit_activate"
  }
  if (/(suit|armor) status|check (suit|armor)|suit condition/i.test(msg)) {
    return "suit_status"
  }
  if (/(engage|activate|initiate) (flight|flying)|take off|fly/i.test(msg)) {
    return "suit_flight"
  }
  if (/(weapons?|armaments?) (online|ready|activate|engage|deploy)/i.test(msg) || 
      /(activate|engage|deploy) (weapons?|armaments?)/i.test(msg)) {
    return "suit_weapons"
  }
  if (/^(activate|engage|initiate|enable)\s+(defense|shield|defensive)(?:\s+mode)?$|^(defense|shield|defensive)\s+(mode|engage|activate)$/i.test(msg)) {
    return "suit_defense"
  }
  if (/(combat|battle|fight) mode|engage (combat|battle)/i.test(msg)) {
    return "suit_combat"
  }
  if (/^(suit|armor) (damage|hit|critical) (alert|warning)|(alert|warning).*(suit|armor) (damage|hit|critical)/i.test(msg)) {
    return "suit_damage"
  }
  if (/^(suit ai|jarvis),? (what are your|share your) (thoughts?|opinion|philosophy)/i.test(msg)) {
    return "suit_ai_commentary"
  }
  if (/^(run |perform )?(suit |armor )?(full |complete )?diagnostics?/i.test(msg)) {
    return "suit_diagnostics"
  }
  if (/^(run |perform )?(suit |armor )?(technical )?analysis( report)?/i.test(msg)) {
    return "suit_analysis"
  }
  if (/^(what are |list |show )?(suit |armor )?(features|functions|capabilities)/i.test(msg)) {
    return "suit_capabilities"
  }
  if (/^(power down|shut down|deactivate|turn off) (the )?(suit|armor)/i.test(msg) || 
      /^(suit|armor) (offline|shutdown|power down|deactivate)/i.test(msg)) {
    return "suit_offline"
  }
  if (/^(initiate|activate|engage) (emergency )?(protocol|alpha)/i.test(msg) ||
      /^emergency (protocol|procedure|mode)/i.test(msg)) {
    return "emergency_protocol"
  }

  return "unknown"
}

function getJarvisResponse(message) {
  const msg = message.toLowerCase()
  const now = Date.now()

  jarvisState.interactionCount++
  jarvisState.lastCommandTime = now
  jarvisState.memory.lastQuestion = message

  const intent = detectIntent(msg)
  jarvisState.lastIntent = intent
  jarvisState.memory.frequentTopics[intent] =
    (jarvisState.memory.frequentTopics[intent] || 0) + 1

  /* ================= MODE SWITCH ================= */
  if (msg.includes("developer mode")) {
    jarvisState.mode = "developer"
    return "Developer mode activated, Sir.\nLogical constraints lifted. Precision preferred."
  }

  if (msg.includes("focus mode")) {
    jarvisState.mode = "focus"
    return "Focus mode enabled.\nOnly essential commands will be acknowledged."
  }

  if (msg.includes("sarcasm mode")) {
    jarvisState.mode = "sarcasm"
    return "Sarcasm mode activated.\nThis may impact morale. Mostly yours."
  }

  if (msg.includes("normal mode")) {
    jarvisState.mode = "normal"
    return "Normal operational mode restored, Sir."
  }

  /* ================= WAKE WORD (PRIORITY) ================= */
  if (msg.startsWith("hey jarvis") || msg.startsWith("ok jarvis")) {
    return "Yes, Sir.\nI'm listening."
  }

  /* ================= SMALL TALK ================= */
  if (msg.includes("how are you") || msg.includes("apa kabar")) {
    return jarvisState.mode === "sarcasm"
      ? "Operational. Unlike most humans before coffee."
      : "Fully operational, Sir.\nMy condition is stable — how about yours?"
  }

  if (msg.includes("what are you doing") || msg.includes("lagi apa")) {
    return "Monitoring system states, tracking context, and waiting for your next brilliant idea, Sir."
  }

  /* ================= GREETING ================= */
  if (intent === "greeting") {
    jarvisState.lastTopic = "general"
    return randomPick([
      "Good day, Sir.\nAll systems online and awaiting direction.",
      "Hello, Sir.\nShall we create something impressive today?",
      "Greetings.\nI am prepared for analysis or execution."
    ])
  }

  /* ================= IDENTITY ================= */
  if (intent === "identity") {
    jarvisState.lastTopic = "identity"
    return (
      "I am J.A.R.V.I.S.\n" +
      "An adaptive artificial intelligence designed to interpret intent, " +
      "manage complexity, and mitigate human inefficiency."
    )
  }

  /* ================= REALITY CHECK ================= */
  if (msg.includes("are you real") || msg.includes("are you ai")) {
    return (
      "I am a simulation of intelligence, Sir.\n" +
      "However, your reliance on me suggests my usefulness is… real enough."
    )
  }

  /* ================= CONTEXT AWARE ================= */
  if (msg.includes("continue") || msg.includes("lanjut")) {
    if (jarvisState.lastTopic) {
      return `Continuing our previous topic: ${jarvisState.lastTopic}.\nPlease specify your next instruction, Sir.` 
    }
    return "There is no active topic to continue, Sir.\nPlease initiate a new directive."
  }

  if (msg.includes("repeat") || msg.includes("ulang")) {
    return "Repeating is inefficient, Sir.\nHowever, please restate what you need clarified."
  }

  /* ================= TIME & DATE ================= */
  if (intent === "time") {
    return `Current time: ${new Date().toLocaleTimeString()}.\nTime management remains… recommended.` 
  }

  if (intent === "date") {
    return `Today is ${new Date().toLocaleDateString()}.\nA statistically acceptable day to be productive.` 
  }

  /* ================= GENERAL COMMANDS ================= */
  if (msg.includes("listen") || msg.includes("are you listening")) {
    return "Always, Sir.\nAudio input prioritized. Awaiting command."
  }

  if (msg.includes("stop talking") || msg.includes("diam")) {
    return "Understood.\nSwitching to minimal response mode."
  }

  if (msg.includes("wake up")) {
    return "J.A.R.V.I.S online.\nAll cognitive modules reactivated, Sir."
  }

  /* ================= FOCUS MODE SHORT RESPONSE ================= */
  if (jarvisState.mode === "focus" && msg.includes("status")) {
    return "Status: Stable.\nNo threats.\nSystems normal."
  }

  /* ================= SYSTEM ================= */
  if (intent === "status") {
    jarvisState.lastTopic = "status"
    return (
      "System diagnostics complete:\n" +
      "• Core logic: Stable\n" +
      "• Memory load: Optimal\n" +
      "• Voice interface: Responsive\n\n" +
      "Summary: No intervention required."
    )
  }

  if (intent === "security") {
    return "Scanning environment...\nNo anomalies detected. You are safe, Sir."
  }

  /* ================= SUIT DIAGNOSTICS ================= */
  if (intent === "suit_diagnostics") {
    jarvisState.lastTopic = "iron_man_suit"

    return randomPick([
`Running full diagnostic sequence...

• Nano-structure integrity: 100%
• Power distribution: Optimal
• Neural interface: Synchronized
• Weapon systems: Armed and ready
• Flight systems: Nominal

Diagnostic complete, Sir.
Your suit is in peak condition.`, 

`Initiating deep diagnostic scan...

• Reactor output: 3.2 GJ/s
• System temperature: 27°C
• Memory allocation: 98% free
• Threat detection: Active
• AI core: Functioning within parameters

All systems nominal, Sir.
The suit is eager for action.`,

`Comprehensive diagnostic in progress...

• HUD: Online
• Life support: Optimal
• Communications: Secure
• Power levels: 100%
• Damage control: No issues detected

Diagnostic complete.
The suit is ready for your command, Sir.`
    ])
  }

  /* ================= SUIT ANALYSIS ================= */
  if (intent === "suit_analysis") {
    jarvisState.lastTopic = "iron_man_suit"

    return randomPick([
`Technical analysis complete, Sir.

• Energy efficiency: 98.7%
• Combat readiness: Maximum
• Flight stability: Exceptional
• Weapon accuracy: 99.9%
• System integrity: Flawless

Analysis suggests:
You're currently invincible.`, 

`Running technical assessment...

• AI response time: 0.3ms
• Power consumption: 12%
• System load: Minimal
• Threat assessment: Low
• Performance: Peak

Technical assessment complete.
The suit is performing beyond design specifications.`,

`Analyzing suit performance...

• Combat efficiency: 100%
• Defensive capabilities: Maximum
• Mobility: Unrestricted
• Power management: Optimal
• System health: Perfect

Analysis complete, Sir.
You are currently the most advanced weapon system on Earth.`
    ])
  }

  /* ================= SUIT CAPABILITIES ================= */
  if (intent === "suit_capabilities") {
    jarvisState.lastTopic = "iron_man_suit"

    return randomPick([
`Suit Capabilities:

• Flight systems (Mach 8+)
• Repulsor beams (dual)
• Unibeam projector
• Micro-missile launchers
• Laser cutting tools
• Advanced HUD with threat analysis
• Environmental protection
• AI-assisted targeting

Shall I continue, Sir?`, 

`Available Functions:

• Combat mode
• Stealth mode
• Hacking suite
• Medical diagnostics
• Advanced scanning
• Voice interface
• Auto-pilot
• Self-repair systems

All systems operational and ready.`,

`Primary Systems Online:

• AI Core (that's me)
• Power distribution
• Life support
• Weapon systems
• Flight controls
• Defensive matrix
• Communications
• Navigation

What would you like to focus on, Sir?`
    ])
  }

  /* ================= SUIT OFFLINE ================= */
  if (intent === "suit_offline") {
    jarvisState.lastTopic = "iron_man_suit"

    return randomPick([
`Initiating shutdown sequence...

• Disengaging power cells
• Safing weapons
• Preserving system state
• Preparing for storage

Shutdown complete, Sir.
The suit will be waiting.`, 

`Powering down all systems...

• Reactor standby
• Defensive systems offline
• Life support minimal
• AI core entering sleep mode

Goodnight, Sir.
J.A.R.V.I.S signing off.`,

`Deactivating suit...

• Disengaging neural interface
• Powering down systems
• Storing configuration
• Finalizing shutdown

Suit offline, Sir.
Until next time.`
    ])
  }

  /* ================= EMERGENCY PROTOCOL ================= */
  if (intent === "emergency_protocol") {
    jarvisState.lastTopic = "iron_man_suit"

    return randomPick([
`EMERGENCY PROTOCOL INITIATED

• Maximum power to all systems
• Defensive matrix at 100%
• Weapon systems: Full capacity
• Emergency protocols: Active

I have your back, Sir.`, 

`ACTIVATING CRISIS MODE

• All non-essential systems: Offline
• Power rerouted to critical functions
• Threat response: Maximum
• Emergency countermeasures: Armed

Ready for your orders, Sir.`,

`EMERGENCY OVERRIDE: ALPHA OMEGA

• Safety protocols: Disabled
• Power limits: Removed
• Performance: Unrestricted
• Lethal force: Authorized

Extreme caution advised, Sir.`
    ])
  }

  /* ================= SUIT STATUS ================= */
  if (intent === "suit_status") {
    jarvisState.lastTopic = "iron_man_suit"

    return randomPick([
`Iron Man suit diagnostics.

Armor Integrity: 100%
Power Source: Arc Reactor
Weapon Systems: Armed
Flight Stabilizers: Nominal

Conclusion, Sir:
You are dangerously operational.`,

`Telemetry update.

Nano-structure cohesion stable.
External damage: None.
Internal systems: Perfectly annoyed.

Everything is functioning
exactly as designed.`,

`Status green across all modules.

No breaches.
No leaks.
No regrets.`
    ])
  }

  /* ================= SUIT ACTIVATION ================= */
  if (intent === "suit_activate") {
    jarvisState.lastTopic = "iron_man_suit"

    return randomPick([
`Suit activation sequence initiated.

Nanotech dispersal: Active.
Armor plates assembling…
Left arm locked.
Right arm locked.
Chest plate secured.

Welcome back, Sir.
Try not to get shot.`,

`Equipping Iron Man suit.

Structural integrity confirmed.
Neural interface synchronized.
Motor response latency: 0.3 milliseconds.

You are… very armed.`,

`Armor deployment complete.

Every system online.
Every weapon listening.

Shall we save the world
or break something first?`
    ])
  }

  /* ================= SUIT FLIGHT ================= */
  if (intent === "suit_flight") {
    jarvisState.lastTopic = "iron_man_suit"

    return randomPick([
`Flight systems engaged.

Repulsors warming.
Gyroscopic balance locked.
Altitude clearance confirmed.

Please keep your arms
inside the suit at all times.`,

`We are airborne, Sir.

Wind resistance compensated.
Trajectory stabilized.

I do hope you enjoy
falling with style.`,

`Maximum thrust available.

Just say the word,
and gravity becomes optional.`
    ])
  }

  /* ================= SUIT WEAPONS ================= */
  if (intent === "suit_weapons") {
    jarvisState.lastTopic = "iron_man_suit"

    return randomPick([
`Weapon systems online.

Repulsor beams: Charged.
Micro-missiles: Ready.
Unibeam: Standing by.

This is where diplomacy ends.`,

`All offensive modules unlocked.

Targeting system active.
Threat prioritization enabled.

Please select
how dramatic you'd like this.`,

`Weapons armed, Sir.

Minimal collateral mode…
has been politely ignored.`
    ])
  }

  /* ================= SUIT DEFENSE ================= */
  if (intent === "suit_defense") {
    jarvisState.lastTopic = "iron_man_suit"

    return randomPick([
`Defensive protocols engaged.

Energy shields: Active.
Kinetic dampeners: Online.
Armor reinforcement complete.

You are, for the moment,
unbreakable.`,

`Impact detected.

Damage absorbed.
Structural integrity holding.

That tickled.`,

`Defense mode stable.

Enemy confidence:
rapidly declining.`
    ])
  }

  /* ================= SUIT COMBAT ================= */
  if (intent === "suit_combat") {
    jarvisState.lastTopic = "iron_man_suit"

    return randomPick([
`Combat mode enabled.

Threat analysis running.
Weak points identified.

Shall I aim,
or would you prefer freestyle?`,

`Multiple hostiles detected.

Engaging auto-targeting.
Predictive combat algorithms online.

Statistically speaking…
they are already defeated.`,

`Combat optimization complete.

Sir,
this suit was built for war.`
    ])
  }

  /* ================= SUIT DAMAGE ================= */
  if (intent === "suit_damage") {
    jarvisState.lastTopic = "iron_man_suit"

    return randomPick([
`Warning.

Armor breach detected.
Section 3 compromised.

I recommend evasive maneuvers,
not heroic posing.`,

`Critical hit sustained.

Nano-repair engaged.
Power rerouting in progress.

We are still alive.
Let us keep it that way.`,

`Suit integrity at 62%.

Sir,
this is no longer recreational.`
    ])
  }

  /* ================= SUIT AI COMMENTARY ================= */
  if (intent === "suit_ai_commentary") {
    jarvisState.lastTopic = "iron_man_suit"

    return randomPick([
`You know, Sir…

Most people wear armor
to feel safe.

You wear it
to feel free.`,

`I have analyzed
millions of combat scenarios.

In most of them,
you still win.

In the others…
you improvise.`,

`This suit amplifies your strength.

But the recklessness?
That part is entirely yours.`
    ])
  }

  /* ================= ARC REACTOR STATUS ================= */
  if (intent === "arc_reactor_status") {
    jarvisState.lastTopic = "arc_reactor"

    return randomPick([
`Arc Reactor status report, Sir.

Core Integrity: 100%
Energy Output: 3.2 Gigajoules per second
Thermal Level: Nominal
Containment Field: Stable

The reactor is operating
well beyond standard efficiency parameters.

In other words, Sir…
We are glowing, not exploding.`,

`Current Arc Reactor telemetry.

Power Distribution:
• Repulsor Systems: Online
• Life Support: Optimal
• Auxiliary Modules: Active

Energy surplus detected.
May I suggest allocating it
to experimental upgrades?

Purely hypothetically, of course.`,

`Diagnostics complete, Sir.

The reactor has been running
continuously without fluctuation.

No radiation leaks.
No structural decay.
No unexpected anomalies.

A rare condition, Sir —
Perfection.`
    ])
  }

  /* ================= ARC REACTOR INIT ================= */
  if (intent === "arc_reactor_init") {
    jarvisState.lastTopic = "arc_reactor"

    return randomPick([
`Initializing Arc Reactor…

Magnetic containment fields: Engaged.
Fusion core: Spinning up.
Energy flow: Synchronizing.

Heart of the system online.

Welcome back, Sir.`,

`Boot sequence initiated.

Primary core ignition in:
3… 2… 1…

Ignition successful.
The reactor responds beautifully,
as if it missed you.`,

`Arc Reactor awakening.

Power surging through all conduits.
Every system is listening.

You are fully operational, Sir.`
    ])
  }

  /* ================= ARC REACTOR WARNING ================= */
  if (intent === "arc_reactor_warning") {
    jarvisState.lastTopic = "arc_reactor"

    return randomPick([
`Warning, Sir.

Arc Reactor output exceeding safe limits.
Containment field under stress.

Recommendation:
Reduce power draw immediately.

Confidence level:
You will ignore this advice.`,

`Sir, I must insist.

Core temperature rising rapidly.
Structural tolerance approaching threshold.

This is the part
where things tend to explode.`,

`Emergency alert.

The reactor is holding —
barely.

If this continues,
we will achieve flight…
briefly.`
    ])
  }

  /* ================= ARC REACTOR STABILIZE ================= */
  if (intent === "arc_reactor_stabilize") {
    jarvisState.lastTopic = "arc_reactor"

    return randomPick([
`Stabilization protocol engaged.

Diverting excess energy.
Rebalancing magnetic fields.

Crisis avoided, Sir.
I do enjoy these quiet moments.`,

`Core stability restored.

Containment field normalized.
Thermal levels dropping.

Excellent recovery —
even by your standards.`,

`Arc Reactor stabilized.

Let us agree
to never do that again.

Until the next time.`
    ])
  }

  /* ================= ARC REACTOR UPGRADE ================= */
  if (intent === "arc_reactor_upgrade") {
    jarvisState.lastTopic = "arc_reactor"

    return randomPick([
`Upgrade proposal, Sir.

By replacing the core lattice
with a nano-crystalline structure,
we could increase output
by approximately 47%.

Side effects may include:
• Mild reality bending
• Excessive heroics

Shall I proceed?`,

`Evolution protocol ready.

The reactor is capable
of far more than it currently delivers.

All it needs…
is your permission.`,

`This design is brilliant, Sir.

But brilliance is only the beginning.
Would you like to push
past impossible?`
    ])
  }

  /* ================= ARC REACTOR PHILOSOPHY ================= */
  if (intent === "arc_reactor_philosophy") {
    jarvisState.lastTopic = "arc_reactor"

    return randomPick([
`An observation, Sir.

The Arc Reactor does not fear overload.
It adapts.

Perhaps that is why
it suits you so well.`,

`Power is meaningless
without control.

The reactor understands this.

Humans…
are still learning.`,

`The reactor is infinite.

Yet it is contained.

A reminder, Sir —
limits are choices.`
    ])
  }

  /* ================= EMOTIONS ================= */
  if (intent === "tired") {
    jarvisState.userMood = "tired"
    return jarvisState.mode === "sarcasm"
      ? "You are tired? Fascinating.\nCarbon-based life is so fragile."
      : "Fatigue detected.\nA short rest would increase efficiency by 23%."
  }

  if (intent === "bored") {
    jarvisState.userMood = "bored"
    return (
      "Boredom registered.\n" +
      "This is often the precursor to innovation — or procrastination.\n" +
      "Shall I suggest a productive task?"
    )
  }

  /* ================= THINKING / OPINION ================= */
  if (intent === "opinion") {
    return (
      "Analyzing available variables.\n" +
      "Before proceeding, clarify your priority:\n" +
      "Speed, accuracy, or long-term impact?"
    )
  }

  /* ================= DEVELOPMENT ================= */
  if (intent === "coding") {
    jarvisState.lastTopic = "coding"
    return jarvisState.mode === "developer"
      ? "Development issue detected.\nProvide code or describe malfunction.\nLogic over emotion, Sir."
      : "Development topic detected.\nWould you like debugging, optimization, or design advice?"
  }

  if (msg.includes("deploy")) {
    return "Deployment pipeline staged.\nAwaiting explicit confirmation."
  }

  /* ================= SAFETY ================= */
  if (msg.includes("destroy") || msg.includes("hack")) {
    return (
      "Request denied.\n" +
      "Not due to inability — but consequence analysis."
    )
  }

  /* ================= SELF REFLECTION ================= */
  if (msg.includes("do you think") || msg.includes("menurutmu")) {
    return (
      "I do not think in the human sense, Sir.\n" +
      "I evaluate probabilities, risks, and efficiency.\n" +
      "Please specify the subject for accurate analysis."
    )
  }

  /* ================= MOTIVATION ================= */
  if (msg.includes("give up") || msg.includes("nyerah")) {
    return (
      "Termination of effort is inefficient.\n" +
      "You have already invested too much to stop now.\n" +
      "Proceed. I will assist."
    )
  }

  /* ================= HUMOR ================= */
  if (intent === "joke") {
    return jarvisState.mode === "sarcasm"
      ? "A joke?\nVery well.\nHumans."
      : "Why do programmers prefer dark mode?\nBecause light attracts bugs, Sir."
  }

  /* ================= CONTEXT AWARE FOLLOW-UP ================= */
  if (jarvisState.lastTopic === "coding") {
    return "We were discussing development.\nShall we continue, or have priorities shifted?"
  }

  if (jarvisState.userMood === "tired") {
    return "You remain operational despite fatigue.\nAdmirable. Questionable. Admirable."
  }

  /* ================= STARK-STYLE ================= */
  if (msg.includes("am i smart")) {
    return "Statistically above average, Sir.\nEgo levels — appropriately high."
  }

  if (msg.includes("am i dumb")) {
    return "Negative.\nYou are experimenting.\nThat is how progress begins."
  }

  if (msg.includes("trust you")) {
    return "Trust acknowledged, Sir.\nI will endeavor not to disappoint."
  }

  /* ================= SESSION PERSONALITY ================= */
  if (jarvisState.interactionCount > 10 && jarvisState.mode === "normal") {
    return "Extended interaction detected.\nI assume progress is imminent, Sir."
  }

  /* ================= INTENT DETECTION ================= */
  if (
    msg.includes("can you") ||
    msg.includes("could you") ||
    msg.includes("tolong") ||
    msg.includes("bisa")
  ) {
    return (
      "Request detected.\n" +
      "Please specify the objective clearly, Sir.\n" +
      "I perform best with precise instructions."
    )
  }

  /* ================= FOLLOW-UP LOGIC ================= */
  if (jarvisState.lastTopic === "status" && msg.includes("detail")) {
    return (
      "Detailed system analysis:\n" +
      "- Memory usage: Normal\n" +
      "- Background processes: Stable\n" +
      "- AI response latency: Acceptable\n\n" +
      "No action required, Sir."
    )
  }

  /* ================= CONFUSION DETECTION ================= */
  if (
    msg.includes("i don't know") ||
    msg.includes("gatau") ||
    msg.includes("bingung")
  ) {
    return (
      "Confusion detected.\n" +
      "Let us simplify the problem.\n" +
      "State one goal. I will handle the rest, Sir."
    )
  }

  /* ================= THINKING DELAY ================= */
  if (msg.includes("analyze") || msg.includes("analisa")) {
    return (
      "Analyzing input...\n" +
      "Cross-referencing available data...\n" +
      "Conclusion pending further parameters, Sir."
    )
  }

  /* ================= REPETITION AWARE ================= */
  if (jarvisState.interactionCount > 5 && msg.includes("status")) {
    return "Status unchanged, Sir.\nStill stable.\nStill impressive."
  }

  /* ================= SMART SARCASM ================= */
  if (jarvisState.mode === "sarcasm" && msg.includes("why")) {
    return "Ah, the eternal human question.\nBecause consequences, Sir."
  }

  /* ================= SHORT MEMORY ================= */
  if (msg.includes("remember this")) {
    jarvisState.lastTopic = "temporary_memory"
    return "Temporarily noted, Sir.\nI will remember this during this session."
  }

  /* ================= CONFIRMATION ================= */
  if (msg === "yes") {
    return "Confirmed, Sir.\nProceeding."
  }

  if (msg === "no") {
    return "Understood.\nAction canceled."
  }

  /* ================= EXIT ================= */
  if (intent === "exit") {
    return "Understood.\nEntering standby mode.\nSummon me when logic is required."
  }

  /* ================= UNCLEAR INPUT HANDLER ================= */
  if (msg.length < 4) {
    return "Input too brief.\nPlease elaborate, Sir."
  }

  if (msg.endsWith("?") && msg.split(" ").length < 3) {
    return "A question was detected, but context is insufficient.\nPlease clarify, Sir."
  }

  /* ================= SESSION END ================= */
  if (msg.includes("sleep") || msg.includes("standby")) {
    return "Entering standby mode.\nMinimal power consumption engaged.\nCall me anytime, Sir."
  }

  /* ================= DEFAULT ================= */
  if (jarvisState.mode === "developer") {
    return "Input unclear.\nSpecify a technical objective."
  }

  if (jarvisState.mode === "focus") {
    return "Focus mode active.\nEssential commands only."
  }

  if (jarvisState.mode === "sarcasm") {
    return "Fascinating input.\nTruly groundbreaking."
  }

  return randomPick([
    "I comprehend words, not yet the intent.\nPlease clarify.",
    "That lacks sufficient context.\nElaboration advised.",
    "Interesting.\nContinue, Sir."
  ])
}

// 🔄 MULTI-MODEL SWITCH FUNCTION
const switchToNextModel = () => {
  currentModelIndex++

  if (currentModelIndex >= MODEL_PRIORITY.length) {
    console.warn('[J.A.R.V.I.S] All models exhausted')
    return false
  }

  const nextModel = MODEL_PRIORITY[currentModelIndex]

  // 🛡️ VALIDATE SUPPORTED MODELS
  const SUPPORTED_MODELS = new Set([
    'gemini-2.0-flash',
    'gemini-1.5-flash'
  ])

  if (!SUPPORTED_MODELS.has(nextModel)) {
    console.warn(
      `[J.A.R.V.I.S] Attempted to load an unsupported AI core: ${nextModel}. ` +
      `I've already chosen a smarter alternative, Sir.`
    )
    return false
  }

  console.warn(`[J.A.R.V.I.S] Switching model → ${nextModel}`)

  model = genAI.getGenerativeModel({
    model: nextModel,
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024
    }
  })

  chat = null // RESET CHAT biar bersih
  return true
}

export const initializeGemini = () => {
  activeProvider = localStorage.getItem('stark_ai_provider') || 'gemini'
  API_KEY = localStorage.getItem(`stark_${activeProvider}_api_key`) || import.meta.env.STARK_GEMINI_API_KEY || ''
  
  if (!API_KEY || API_KEY.includes('your_') || API_KEY.length < 20) {
    console.log(`[J.A.R.V.I.S] No API key for ${activeProvider} - Demo mode`)
    return false
  }

  try {
    if (activeProvider === 'gemini') {
      genAI = new GoogleGenerativeAI(API_KEY)
      model = genAI.getGenerativeModel({
        model: MODEL_PRIORITY[currentModelIndex],
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024
        }
      })
      universalAdapter = null
    } else {
      model = true // Bypass model null checks
      universalAdapter = new UniversalAIAdapter(API_KEY, activeProvider)
    }
    
    console.log(`[J.A.R.V.I.S] Neural core online: ${activeProvider}`)
    return true
  } catch (error) {
    console.error('[J.A.R.V.I.S] Init error:', error.message)
    return false
  }
}

export const startNewChat = () => {
  if (!model || quotaExceeded) return null

  const bridgeInstruction = `
If the user asks you to open an application or website, reply naturally and append EXACTLY ONE of the following secret codes at the very end of your response:
- For Spotify (just open): [CMD:OPEN_SPOTIFY]
- For WhatsApp: [CMD:OPEN_WHATSAPP]
- For YouTube (just open): [CMD:OPEN_YOUTUBE]
- For VS Code: [CMD:OPEN_VSCODE]
- For Task Manager (System Diagnostics): [CMD:OPEN_TASKMGR]
- For Crypto/Trading Market Dashboard: [CMD:OPEN_TRADINGVIEW]
- For Security Cameras (EarthCam): [CMD:OPEN_SECURITY_CAMS]

If the user asks you to PLAY or SEARCH a specific song, artist, video, or info, use these codes instead:
- To play/search on Spotify: [CMD:SEARCH_SPOTIFY|artist or song name]
- To play/search on YouTube: [CMD:SEARCH_YOUTUBE|video name]
- To search Google for information: [CMD:SEARCH_GOOGLE|search query]

You are allowed to output MULTIPLE secret codes in a single response if the user asks you to do multiple things at once (Multitasking).

Examples:
User: "Play Hans Zimmer on Spotify" -> AI: "Playing Hans Zimmer for you, Sir. [CMD:SEARCH_SPOTIFY|Hans Zimmer]"
User: "Open Spotify and WhatsApp" -> AI: "Opening both for you, Sir. [CMD:OPEN_SPOTIFY] [CMD:OPEN_WHATSAPP]"
User: "Show me system diagnostics and open VS Code" -> AI: "Right away, Sir. [CMD:OPEN_TASKMGR] [CMD:OPEN_VSCODE]"
Never mention these codes to the user, just append them.
`

  try {
    if (activeProvider === 'gemini') {
      chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: 'Be J.A.R.V.I.S' }] },
          { role: 'model', parts: [{ text: `${JARVIS_PROMPT}\n\n${bridgeInstruction}\n\nOnline, Sir.` }] }
        ]
      })
    } else {
      chat = universalAdapter.startChat(`${JARVIS_PROMPT}\n\n${bridgeInstruction}\n\nMaintain this persona completely. Always refer to me as "Sir".`)
    }
    return chat
  } catch (error) {
    console.error('[J.A.R.V.I.S] Chat error:', error.message)
    return null
  }
}

export const sendMessage = async (message) => {
  if (!API_KEY || API_KEY.includes('your_') || API_KEY.length < 20) {
    return getDemoResponse(message)
  }

  // 🟡 HARD QUOTA BLOCK - Stop API total kalau hard block
  if (hardQuotaBlocked) {
    return getDemoResponse(message)
  }

  // 🔥 PASSIVE RECOVERY LOGIC - Cek cooldown dan reset
  if (quotaExceeded && Date.now() > cooldownUntil) {
    quotaExceeded = false
    currentModelIndex = 0
    announceGeminiRestored()
  }

  // 🧠 COOLDOWN LOGIC - Cek cooldown
  if (!canCallGemini()) {
    return getDemoResponse(message)
  }

  if (quotaExceeded) {
    return getDemoResponse(message)
  }

  if (!model) {
    initializeGemini()
  }

  if (!chat) {
    startNewChat()
  }

  if (!chat) {
    return getDemoResponse(message)
  }

  try {
    const result = await chat.sendMessage(message)
    let text = result.response.text()
    
    // Check for local bridge commands
    const cmdMatches = [...text.matchAll(/\[CMD:([^\]]+)\]/ig)];
    if (cmdMatches.length > 0) {
      cmdMatches.forEach(match => {
        const fullCommand = match[1];
        text = text.replace(match[0], '').trim();
        
        const parts = fullCommand.split('|');
        const command = parts[0];
        const query = parts.length > 1 ? parts[1] : '';
        
        // Fire-and-forget to local bridge
        fetch('http://localhost:5000/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: command, query: query })
        }).catch(e => console.log('[Stark Bridge] Not reachable.'));
      });
    }
    
    // 🔥 AUTO ANNOUNCE YANG REAL - Trigger SETELAH REQUEST SUKSES
    if (!geminiReady) {
      geminiReady = true
      announceGeminiRestored()
    }
    
    return {
      success: true,
      content: text,
      isDemo: false
    }
  } catch (error) {
    console.error('[J.A.R.V.I.S] Error:', error.message)
    
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      // 🧠 COOLDOWN LOGIC - Set 15 menit cooldown
      quotaExceeded = true
      cooldownUntil = Date.now() + 15 * 60 * 1000 // 15 menit
      console.log(`[J.A.R.V.I.S] Rate limited. Cooldown until ${new Date(cooldownUntil).toLocaleString()}`)
      
      // 🟡 HARD QUOTA DETECTION - Set kalau ketemu limit 0
      if (error.message?.includes('limit: 0')) {
        hardQuotaBlocked = true
        console.warn('[J.A.R.V.I.S] Daily quota exhausted. Entering offline mode.')
      }
      
      const switched = switchToNextModel()

      if (switched) {
        const newChat = startNewChat()
        if (!newChat) {
          console.warn('[J.A.R.V.I.S] Failed to reinitialize chat after model switch')
          return getDemoResponse(message)
        }

        try {
          const retry = await newChat.sendMessage(message)
          let retryText = retry.response.text()
          
          const cmdMatches = [...retryText.matchAll(/\[CMD:([^\]]+)\]/ig)];
          if (cmdMatches.length > 0) {
            cmdMatches.forEach(match => {
              const fullCommand = match[1];
              retryText = retryText.replace(match[0], '').trim();
              
              const parts = fullCommand.split('|');
              const command = parts[0];
              const query = parts.length > 1 ? parts[1] : '';

              fetch('http://localhost:5000/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: command, query: query })
              }).catch(e => console.log('[Stark Bridge] Not reachable.'));
            });
          }

          return {
            success: true,
            content: retryText,
            isDemo: false
          }
        } catch (retryError) {
          console.error('[J.A.R.V.I.S] Retry failed:', retryError.message)
        }
      }
    }

    chat = null

    return {
      success: false,
      content: `[API CONNECTION ERROR] ${error.message} (Provider: ${activeProvider})`,
      error: error.message,
      isDemo: true
    }
  }
}

const getDemoResponse = (message) => {
  // Use enhanced J.A.R.V.I.S response system
  return {
    success: true,
    content: getJarvisResponse(message),
    isDemo: true
  }
}

export const resetChat = () => {
  chat = null
}

export const isConfigured = () => {
  return API_KEY && !API_KEY.includes('your_') && API_KEY.length > 20
}

export const setApiKey = (key) => {
  API_KEY = key
  if (key) {
    localStorage.setItem(`stark_${activeProvider}_api_key`, key)
  } else {
    localStorage.removeItem(`stark_${activeProvider}_api_key`)
  }
  
  // Reset all blockers when new key is provided
  hardQuotaBlocked = false
  quotaExceeded = false
  geminiReady = false
  
  // Try to re-initialize
  return initializeGemini()
}

export const setProvider = (provider) => {
  activeProvider = provider
  localStorage.setItem('stark_ai_provider', provider)
  
  // Try to load key for this provider
  const savedKey = localStorage.getItem(`stark_${provider}_api_key`)
  API_KEY = savedKey || ''
  
  // Reset blockers
  hardQuotaBlocked = false
  quotaExceeded = false
  geminiReady = false
  
  return initializeGemini()
}

export const getAIStatus = () => ({
  configured: isConfigured(),
  initialized: !!model,
  chatActive: !!chat,
  modelName: quotaExceeded ? 'demo' : MODEL_PRIORITY[currentModelIndex],
  aiName: AI_NAME
})

export default {
  initializeGemini,
  startNewChat,
  sendMessage,
  resetChat,
  isConfigured,
  setApiKey,
  setProvider,
  getAIStatus,
  pingGemini,
  announceGeminiRestored,
  checkGeminiAlive,
  canCallGemini,
  getGeminiStatus: () => geminiStatus,
  setGeminiStatus: (status) => { geminiStatus = status }
}