"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ────────────────────────────────────────────────────
   HOOKS
   ──────────────────────────────────────────────────── */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function useCountUp(target: number, duration = 1600): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !done.current) {
          done.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(target * eased);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [target, duration]);
  return [ref, val];
}

/* ────────────────────────────────────────────────────
   SVG ICONS
   ──────────────────────────────────────────────────── */

const svgBase: React.SVGProps<SVGSVGElement> = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

type IconProps = React.SVGProps<SVGSVGElement>;

const Arrow = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const Phone = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" /></svg>
);
const PhoneOff = (p: IconProps) => (
  <svg {...svgBase} {...p} stroke="#fff"><path d="M10.7 13.3a16 16 0 0 1-2.3-3.7l1-1a2 2 0 0 0 .5-2.1A11 11 0 0 1 9.1 4 2 2 0 0 0 7.1 2.3H4a2 2 0 0 0-2 2.2A19 19 0 0 0 4.6 12M22 2 2 22" /><path d="M16.5 9.5a11 11 0 0 0 2.4.5 2 2 0 0 1 1.7 2v2.9" /></svg>
);
const Calendar = (p: IconProps) => (
  <svg {...svgBase} {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" /></svg>
);
const BoxIcon = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M21 8 12 3 3 8v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8" /></svg>
);
const Clock = (p: IconProps) => (
  <svg {...svgBase} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const Brain = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M12 5a3 3 0 0 0-6 .2A3 3 0 0 0 4 11a3 3 0 0 0 2 5 3 3 0 0 0 6 .3V5zM12 5a3 3 0 0 1 6 .2A3 3 0 0 1 20 11a3 3 0 0 1-2 5 3 3 0 0 1-6 .3" /></svg>
);
const Bolt = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" /></svg>
);
const Plug = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M12 22v-5M9 8V2M15 8V2M5 8h14v3a7 7 0 0 1-14 0V8z" /></svg>
);
const Chart = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M3 3v18h18" /><path d="M7 15l3-4 3 2 4-6" /></svg>
);
const Shield = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
);
const Handoff = (p: IconProps) => (
  <svg {...svgBase} {...p}><circle cx="8.5" cy="7" r="3" /><path d="M3 20a5.5 5.5 0 0 1 11 0" /><path d="M16 12h6m0 0-2.4-2.4M22 12l-2.4 2.4" /></svg>
);
const CheckIcon = (p: IconProps) => (
  <svg {...svgBase} {...p} width="18" height="18"><path d="m20 6-11 11-5-5" /></svg>
);
const Star = (p: IconProps) => (
  <svg {...svgBase} {...p} width="16" height="16" fill="currentColor" stroke="none"><path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1L12 2z" /></svg>
);
const MenuIcon = (p: IconProps) => (
  <svg {...svgBase} {...p}><path d="M3 12h18M3 6h18M3 18h18" /></svg>
);
const Mic = (p: IconProps) => (
  <svg {...svgBase} {...p}><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v4" /></svg>
);
const Volume = (p: IconProps) => (
  <svg {...svgBase} {...p} width="16" height="16"><path d="M11 5 6 9H2v6h4l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></svg>
);
const VolumeOff = (p: IconProps) => (
  <svg {...svgBase} {...p} width="16" height="16"><path d="M11 5 6 9H2v6h4l5 4z" /><path d="M22 9l-6 6M16 9l6 6" /></svg>
);

/* ────────────────────────────────────────────────────
   BRAND MARK
   ──────────────────────────────────────────────────── */
const BrandMark = () => (
  <span className="brand-mark" aria-hidden>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#ng)" strokeWidth="2.4" strokeLinecap="round">
      <defs>
        <linearGradient id="ng" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2dd4bf" />
          <stop offset="0.5" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <line x1="4" y1="10" x2="4" y2="14" />
      <line x1="9" y1="6" x2="9" y2="18" />
      <line x1="14" y1="3" x2="14" y2="21" />
      <line x1="19" y1="8" x2="19" y2="16" />
    </svg>
  </span>
);

/* ────────────────────────────────────────────────────
   NAVBAR
   ──────────────────────────────────────────────────── */
function Navbar() {
  const scrolled = useScrolled();
  return (
    <nav className={`l-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="l-container l-nav-inner">
        <a href="#top" className="l-brand">
          <BrandMark />
          Golden Robin
        </a>
        <div className="l-nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#usecases">Use cases</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="l-nav-cta">
          <Link className="login" href="/sign-in">Sign in</Link>
          <Link className="l-btn l-btn-primary" href="/sign-up">
            Get started <Arrow className="arrow" width={16} height={16} />
          </Link>
          <button className="l-nav-toggle" aria-label="Menu"><MenuIcon /></button>
        </div>
      </div>
    </nav>
  );
}

/* ────────────────────────────────────────────────────
   HERO
   ──────────────────────────────────────────────────── */
const heroBars = [18, 30, 22, 38, 26, 16, 32, 24, 12];

function Hero() {
  // Vapi call state
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "active" | "ended">("idle");
  const [transcript, setTranscript] = useState<{ role: string; text: string }[]>([]);
  const [callTimer, setCallTimer] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vapiRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Call timer
  useEffect(() => {
    if (callStatus === "active") {
      timerRef.current = setInterval(() => setCallTimer((t) => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callStatus]);

  // Auto-scroll transcript
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [transcript]);

  const startCall = useCallback(async () => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      alert("Vapi public key not configured.");
      return;
    }
    try {
      const VapiModule = await import("@vapi-ai/web");
      const Vapi = VapiModule.default;
      const vapi = new Vapi(publicKey);
      vapiRef.current = vapi;
      setCallStatus("connecting");
      setTranscript([]);
      setCallTimer(0);

      vapi.on("call-start", () => setCallStatus("active"));
      vapi.on("call-end", () => {
        setCallStatus("ended");
        if (timerRef.current) clearInterval(timerRef.current);
      });
      vapi.on("error", () => {
        setCallStatus("ended");
        if (timerRef.current) clearInterval(timerRef.current);
      });
      vapi.on("message", (msg: { type: string; role?: string; transcript?: string; transcriptType?: string }) => {
        if (msg.type === "transcript" && msg.transcriptType === "final" && msg.transcript) {
          setTranscript((prev) => [...prev, {
            role: msg.role === "assistant" ? "agent" : "caller",
            text: msg.transcript!,
          }]);
        }
      });

      await vapi.start("453df4ad-5987-42de-a879-6f5fd10c5796");
    } catch {
      setCallStatus("ended");
    }
  }, []);

  const endCall = useCallback(() => {
    if (vapiRef.current) vapiRef.current.stop();
    setCallStatus("ended");
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const resetCall = useCallback(() => {
    setCallStatus("idle");
    setTranscript([]);
    setCallTimer(0);
    vapiRef.current = null;
  }, []);

  const isIdle = callStatus === "idle";
  const isCalling = callStatus === "connecting" || callStatus === "active";

  return (
    <header className="l-hero" id="top">
      {/* Background video */}
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />

      <div className="l-container hero-grid">
        <div className="reveal in">
          <span className="hero-badge">
            <span className="tag">NEW</span>
            <b>Golden Robin 2.0</b> — sub-second response, human-grade tone
          </span>
          <h1>
            Never miss a<br />
            customer call <span className="grad-text">again.</span>
          </h1>
          <p className="hero-sub">
            Golden Robin builds tailor-fit AI voice agents that pick up every call for your
            business — booking appointments, quoting prices, and checking inventory in
            real time. No hold music. No voicemail. No lost revenue.
          </p>
          <div className="hero-actions">
            <Link className="l-btn l-btn-primary l-btn-lg" href="/sign-up">
              Get started free <Arrow className="arrow" width={18} height={18} />
            </Link>
            <a className="l-btn l-btn-ghost l-btn-lg" href="#demo">
              <Phone width={17} height={17} /> Hear it in action
            </a>
          </div>
        </div>

        <div className={`orb-wrap reveal in ${isCalling ? "calling" : ""}`}>
          {/* The orb — click to call */}
          <div
            className="orb"
            onClick={isIdle ? startCall : undefined}
            role={isIdle ? "button" : undefined}
            tabIndex={isIdle ? 0 : undefined}
            aria-label={isIdle ? "Start a live call with our AI" : undefined}
          >
            <span className="orb-ring" />
            <span className="orb-ring" />
            <span className="orb-ring" />
            <div className="orb-core">
              {isCalling ? (
                <div className="orb-mic"><Mic width={36} height={36} /></div>
              ) : (
                <div className="l-wave" aria-hidden="true">
                  {heroBars.map((h, i) => (
                    <span key={i} style={{ height: h, animationDelay: `${i * 0.09}s` }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Idle — click to talk prompt */}
          {isIdle && (
            <button className="orb-cta" onClick={startCall}>
              <Mic width={14} height={14} />
              <span className="pulse-dot" />
              Talk to our AI &mdash; try it live
            </button>
          )}

          {/* Calling — status indicator */}
          {isCalling && (
            <div className="orb-status">
              <span className="live-dot" />
              {callStatus === "connecting" ? "Connecting..." : `Live · ${fmt(callTimer)}`}
            </div>
          )}

          {/* Transcript panel */}
          {(isCalling || callStatus === "ended") && (
            <div className="hero-transcript" ref={scrollRef}>
              {callStatus === "connecting" && (
                <div className="ht-bubble agent">
                  <div className="typing"><span /><span /><span /></div>
                </div>
              )}
              {transcript.map((line, i) => (
                <div key={i} className={`ht-bubble ${line.role}`}>
                  <span className="ht-role">{line.role === "agent" ? "AI" : "You"}</span>
                  {line.text}
                </div>
              ))}
              {callStatus === "active" && transcript.length === 0 && (
                <div className="ht-empty">Speak &mdash; the AI is listening...</div>
              )}
            </div>
          )}

          {/* End call button */}
          {callStatus === "active" && (
            <button className="orb-end-call" onClick={endCall}>
              <PhoneOff width={16} height={16} /> End call
            </button>
          )}

          {/* Call ended — call again */}
          {callStatus === "ended" && (
            <button className="orb-cta" onClick={resetCall}>
              <Phone width={14} height={14} /> Call again
            </button>
          )}
        </div>

        {/* Trust bar — anchored at the bottom of the hero viewport */}
        <div className="hero-trust">
          <div className="dots"><span /><span /><span /><span /></div>
          Trusted by 400+ service businesses answering 2M+ calls a month
        </div>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────
   LOGO BAR
   ──────────────────────────────────────────────────── */
const logos = ["Canadian Tire", "Midas", "Jiffy Lube", "PartSource", "Mr. Lube", "Kal Tire"];

function LogoBar() {
  return (
    <section className="logobar">
      <div className="l-container">
        <p>Powering front-desk calls for service businesses across North America</p>
        <div className="logobar-row">
          {logos.map((l) => (
            <span className="logo" key={l}>
              <span className="dot" /> {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   DEMO — Simulated + Live Vapi Call
   ──────────────────────────────────────────────────── */

type Line = { s: "agent" | "caller"; t: string };

const scenarios = [
  {
    id: "appt",
    icon: Calendar,
    title: "Book a service appointment",
    desc: "Customer wants a seasonal tire change",
    outcome: "Appointment booked — Tue, May 28 · 2:30 PM",
    lines: [
      { s: "agent" as const, t: "Thanks for calling Canadian Tire Auto Service, this is Alex. How can I help you today?" },
      { s: "caller" as const, t: "Hi, I need to get my winter tires swapped over to summers." },
      { s: "agent" as const, t: "Happy to set that up. Can I grab your year, make and model so I pull the right service?" },
      { s: "caller" as const, t: "It's a 2021 Honda CR-V." },
      { s: "agent" as const, t: "Perfect. A seasonal changeover on the CR-V runs about 45 minutes. I have openings tomorrow at 10:15 AM or 2:30 PM. Which works better?" },
      { s: "caller" as const, t: "Afternoon's better, let's do 2:30." },
      { s: "agent" as const, t: "Done — Tuesday at 2:30 with our tire bay. I'll text you a confirmation and a reminder the morning of. Anything else?" },
      { s: "caller" as const, t: "Nope, that's great. Thanks!" },
    ],
  },
  {
    id: "price",
    icon: BoxIcon,
    title: "Check price & live inventory",
    desc: "Customer asks about a product in stock",
    outcome: "Item located · 7 in stock · held for pickup",
    lines: [
      { s: "agent" as const, t: "Canadian Tire, this is Alex. What can I help you find?" },
      { s: "caller" as const, t: "Do you have the MotoMaster Eliminator battery for a Ford F-150 in stock?" },
      { s: "agent" as const, t: "Let me check live inventory. Yes — the Eliminator Group 65 fits your F-150. We have 7 in stock at the Barrie location." },
      { s: "caller" as const, t: "How much is it?" },
      { s: "agent" as const, t: "It's 239.99 right now, and it's on promo this week with 40 dollars off when you trade in your old battery." },
      { s: "caller" as const, t: "Oh nice. Can you hold one for me?" },
      { s: "agent" as const, t: "Already done — I've reserved one under your number for pickup today. Just see the service desk when you arrive." },
    ],
  },
  {
    id: "after",
    icon: Clock,
    title: "After-hours inquiry",
    desc: "Call comes in at 11 PM, store is closed",
    outcome: "Lead captured · callback scheduled 8:05 AM",
    lines: [
      { s: "agent" as const, t: "Thanks for calling Canadian Tire. We're closed for the evening, but I can still help — this is Alex." },
      { s: "caller" as const, t: "Oh, I didn't realize it was so late. My car won't start and I need it looked at." },
      { s: "agent" as const, t: "I'm sorry to hear that. I can book you the first diagnostic slot tomorrow and arrange a tow partner if you need one tonight." },
      { s: "caller" as const, t: "Yeah, please book the morning slot." },
      { s: "agent" as const, t: "You're in at 8 AM for a no-start diagnostic. I've also flagged your file so a service advisor calls you back at 8:05 to confirm the tow. You're all set." },
      { s: "caller" as const, t: "Wow, thank you — that's a relief." },
    ],
  },
];

const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;

function fmt(sec: number) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

const FEMALE = ["female", "samantha", "victoria", "karen", "moira", "tessa", "fiona", "zira", "jenny",
  "aria", "michelle", "ava", "allison", "susan", "serena", "catherine", "linda", "heather", "hazel",
  "sonia", "natasha", "clara", "emily", "amber", "jane", "nova", "libby", "zuzana", "google us english"];
const MALE = ["male", "daniel", "alex", "fred", "thomas", "tom", "aaron", "david", "mark", "guy",
  "rishi", "ryan", "eric", "arthur", "george", "james", "liam", "oliver", "william", "gordon", "lee",
  "jacob", "brandon", "christopher", "diego", "davis", "tony", "jason", "google uk english male"];

type VoiceProfile = { voice: SpeechSynthesisVoice; rate: number; pitch: number };
type VoicePlan = { agent: VoiceProfile; caller: VoiceProfile }[];

function buildVoicePlan(allVoices: SpeechSynthesisVoice[]): VoicePlan | null {
  const en = allVoices.filter((v) => /^en(-|_|$)/i.test(v.lang));
  const pool = (en.length ? en : allVoices).slice();
  if (!pool.length) return null;

  const quality = (v: SpeechSynthesisVoice) => {
    const n = v.name.toLowerCase();
    let s = 0;
    if (/natural|neural/.test(n)) s += 120;
    if (/online/.test(n)) s += 90;
    if (/premium|enhanced|siri/.test(n)) s += 80;
    if (/google/.test(n)) s += 70;
    if (/microsoft/.test(n)) s += 40;
    if (v.localService === false) s += 30;
    return s;
  };
  const ranked = pool.sort((a, b) => quality(b) - quality(a));
  const has = (v: SpeechSynthesisVoice, list: string[]) => list.some((n) => v.name.toLowerCase().includes(n));

  let females = ranked.filter((v) => has(v, FEMALE));
  let males = ranked.filter((v) => has(v, MALE));
  const rest = ranked.filter((v) => !females.includes(v) && !males.includes(v));
  rest.forEach((v, i) => (i % 2 ? males : females).push(v));
  if (!females.length) females = ranked.slice();
  if (!males.length) males = ranked.slice();

  const pick = (arr: SpeechSynthesisVoice[], i: number) => (arr.length ? arr[i % arr.length] : ranked[0]);

  return [
    { agent: { voice: pick(females, 0), rate: 1.0, pitch: 1.06 }, caller: { voice: pick(males, 0), rate: 1.0, pitch: 0.92 } },
    { agent: { voice: pick(males, 1), rate: 1.07, pitch: 0.99 }, caller: { voice: pick(females, 1), rate: 1.03, pitch: 1.08 } },
    { agent: { voice: pick(females, 2), rate: 0.96, pitch: 1.0 }, caller: { voice: pick(males, 2), rate: 0.94, pitch: 0.84 } },
  ];
}

function Demo() {
  const [active, setActive] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [visible, setVisible] = useState<Line[]>([]);
  const [typing, setTyping] = useState(false);
  const [speaking, setSpeaking] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [timer, setTimer] = useState(0);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runId = useRef(0);
  const voicePlan = useRef<VoicePlan | null>(null);

  const scenario = scenarios[active];

  useEffect(() => {
    if (!speechSupported) return;
    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) voicePlan.current = buildVoicePlan(voices);
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  // Simulated demo playback
  useEffect(() => {
    const myRun = ++runId.current;
    const lines = scenario.lines;

    setVisible([]);
    setTyping(false);
    setDone(false);
    setSpeaking(null);
    setTimer(0);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (tickRef.current) clearInterval(tickRef.current);
    if (speechSupported) window.speechSynthesis.cancel();

    const stale = () => myRun !== runId.current;
    const after = (ms: number, fn: () => void) =>
      timers.current.push(setTimeout(() => { if (!stale()) fn(); }, ms));

    tickRef.current = setInterval(() => setTimer((t) => t + 1), 1000);

    const speakLine = (line: Line, onDone: () => void) => {
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(line.t);
      const plan = voicePlan.current;
      const prof = plan && plan[active] ? plan[active][line.s] : null;
      const v = prof && prof.voice;
      if (v) u.voice = v;
      u.lang = (v && v.lang) || "en-US";
      u.rate = prof ? prof.rate : line.s === "agent" ? 1.0 : 0.96;
      u.pitch = prof ? prof.pitch : line.s === "agent" ? 1.05 : 0.9;
      u.volume = 1;
      let finished = false;
      const finish = () => { if (finished || stale()) return; finished = true; onDone(); };
      u.onend = finish;
      u.onerror = finish;
      after(Math.min(line.t.length * 78 + 1600, 13000), finish);
      synth.resume();
      synth.speak(u);
    };

    const reveal = (i: number, line: Line) => {
      setVisible((v) => [...v, line]);
      if (soundOn && speechSupported) {
        setSpeaking(i);
        speakLine(line, () => {
          setSpeaking(null);
          after(340, () => playLine(i + 1));
        });
      } else {
        const ms = line.s === "agent"
          ? Math.min(950 + line.t.length * 32, 3400)
          : Math.min(720 + line.t.length * 28, 2700);
        after(ms, () => playLine(i + 1));
      }
    };

    const playLine = (i: number) => {
      if (stale()) return;
      if (i >= lines.length) {
        setDone(true);
        if (tickRef.current) clearInterval(tickRef.current);
        after(4800, () => setActive((a) => (a + 1) % scenarios.length));
        return;
      }
      const line = lines[i];
      if (line.s === "agent") {
        setTyping(true);
        after(720, () => { setTyping(false); reveal(i, line); });
      } else {
        after(440, () => reveal(i, line));
      }
    };

    after(500, () => playLine(0));

    return () => {
      runId.current++;
      timers.current.forEach(clearTimeout);
      if (tickRef.current) clearInterval(tickRef.current);
      if (speechSupported) window.speechSynthesis.cancel();
    };
  }, [active, soundOn]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visible, typing, done]);

  return (
    <section className="l-section" id="demo">
      <div className="l-container demo-grid">
        <div className="demo-copy reveal">
          <span className="eyebrow">Live demo</span>
          <h2>Listen to Golden Robin handle a real call.</h2>
          <p>
            This is the actual flow — your agent answers instantly, understands intent,
            taps your live systems, and gets the job done. Pick a scenario to listen.
          </p>
          <div className="demo-scenarios">
            {scenarios.map((sc, i) => {
              const Ico = sc.icon;
              return (
                <button
                  key={sc.id}
                  className={`scenario-btn ${i === active ? "active" : ""}`}
                  onClick={() => setActive(i)}
                >
                  <span className="s-ico"><Ico width={18} height={18} /></span>
                  <span className="s-meta">
                    <span className="s-title">{sc.title}</span>
                    <span className="s-desc">{sc.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="reveal">
          <div className="phone">
            <div className="phone-head">
              <div className="phone-avatar">G</div>
              <div className="who">
                <b>Golden Robin &middot; Canadian Tire</b>
                <span>
                  <span className="live-dot" />
                  Live call
                </span>
              </div>
              <div className="phone-timer">{fmt(timer)}</div>
              {speechSupported && (
                <button
                  className={`sound-toggle ${soundOn ? "on" : "off"}`}
                  onClick={() => setSoundOn((s) => !s)}
                  aria-label={soundOn ? "Mute call" : "Play call with sound"}
                >
                  <span className="pinger">{soundOn ? <Volume /> : <VolumeOff />}</span>
                  {soundOn ? "Sound on" : "Sound"}
                </button>
              )}
            </div>

            <div className="transcript" ref={scrollRef}>
              {visible.map((line, i) => (
                <div key={i} className={`bubble ${line.s} ${speaking === i ? "speaking" : ""}`}>
                  <div className="speaker">{line.s === "agent" ? "Golden Robin" : "Caller"}</div>
                  {line.t}
                </div>
              ))}
              {typing && (
                <div className="bubble agent">
                  <div className="typing"><span /><span /><span /></div>
                </div>
              )}
              {done && (
                <div className="outcome">
                  <CheckIcon width={16} height={16} /> {scenario.outcome}
                </div>
              )}
            </div>

            <div className="phone-foot">
              <div className="mini-wave" aria-hidden="true">
                {[12, 18, 9, 20, 14, 8, 16].map((h, i) => (
                  <span key={i} style={{ height: h, animationDelay: `${i * 0.08}s` }} />
                ))}
              </div>
              <button className="call-btn" aria-label="End call">
                <PhoneOff width={20} height={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   FEATURES
   ──────────────────────────────────────────────────── */
const features = [
  { icon: Brain, title: "Trained on your business", desc: "Golden Robin learns your services, hours, pricing, policies and tone — so it answers like your best employee, not a generic bot.", wide: true },
  { icon: Bolt, title: "Sub-second response", desc: "Natural, uninterrupted conversation with no awkward lag. Callers feel heard, not handled." },
  { icon: Calendar, title: "Books appointments", desc: "Reads your live calendar, offers real openings, and writes the booking back automatically." },
  { icon: BoxIcon, title: "Checks live inventory", desc: "Looks up stock and pricing in real time and can reserve items for pickup on the spot." },
  { icon: Plug, title: "Connects to your stack", desc: "Plugs into your POS, CRM, scheduling and phone system. Works with the tools you already run." },
  { icon: Handoff, title: "Knows when to hand off", desc: "For anything sensitive or out of scope, Golden Robin transfers to the right person — with full call context, so customers never repeat themselves." },
  { icon: Chart, title: "Every call, captured", desc: "Full transcripts, intent tags, sentiment and outcomes — searchable in one dashboard." },
  { icon: Shield, title: "Secure & compliant", desc: "SOC 2 Type II, PCI-aware call handling, and PIPEDA/GDPR-ready data controls by default." },
];

function Features() {
  return (
    <section className="l-section" id="features">
      <div className="l-container">
        <div className="section-head reveal">
          <span className="eyebrow">Capabilities</span>
          <h2>An agent that actually <span className="grad-text">gets the job done</span></h2>
          <p>Not a phone tree. Not a voicemail. A capable voice agent that understands the caller and acts on it.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => {
            const Ico = f.icon;
            return (
              <div className={`feature reveal ${f.wide ? "wide" : ""}`} key={f.title} style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                <div className="f-ico"><Ico width={22} height={22} /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   HOW IT WORKS
   ──────────────────────────────────────────────────── */
const steps = [
  { n: "01", title: "Connect your number", desc: "Forward your existing line or get a new one. Golden Robin starts answering overflow, after-hours, or every call — your call." },
  { n: "02", title: "Train on your business", desc: "Point Golden Robin at your website, price lists, calendar and systems. It builds a tailor-fit agent in minutes, not months." },
  { n: "03", title: "Go live & watch it work", desc: "Your agent handles calls 24/7. Review transcripts, outcomes and bookings from one dashboard, and refine anytime." },
];

function HowItWorks() {
  return (
    <section className="l-section" id="how">
      <div className="l-container">
        <div className="section-head reveal">
          <span className="eyebrow">How it works</span>
          <h2>Live in a day, not a quarter</h2>
          <p>No integration team required. If you can describe how your front desk works, Golden Robin can run it.</p>
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step l-card reveal" key={s.n} style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < steps.length - 1 && <Arrow className="connector" width={22} height={22} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   USE CASES
   ──────────────────────────────────────────────────── */
const useCases = [
  { ico: "\u{1F527}", title: "Auto & tire service", desc: "Book changeovers, repairs and diagnostics. Quote labour and check parts in stock." },
  { ico: "\u{1F6D2}", title: "Retail & big-box", desc: "Answer price, availability and store-hours questions, and reserve items for pickup." },
  { ico: "\u{1F37D}", title: "Restaurants", desc: "Take reservations and takeout orders, answer the menu, and handle the dinner rush overflow." },
  { ico: "\u{1F3E5}", title: "Clinics & dental", desc: "Schedule and reschedule visits, run reminders, and triage routine patient questions." },
  { ico: "\u{1F3E0}", title: "Home services", desc: "Capture every lead, quote ballpark pricing, and dispatch the next available crew." },
  { ico: "\u{1F487}", title: "Salons & spas", desc: "Fill the calendar, manage cancellations, and rebook no-shows without lifting a finger." },
  { ico: "\u{1F43E}", title: "Veterinary", desc: "Book check-ups and grooming, refill scripts, and route emergencies to a human fast." },
  { ico: "\u{1F3E2}", title: "Property & rentals", desc: "Field tenant calls, log maintenance requests, and screen prospective renters 24/7." },
];

function UseCases() {
  return (
    <section className="l-section l-section-sm" id="usecases">
      <div className="l-container">
        <div className="section-head reveal">
          <span className="eyebrow">Built for</span>
          <h2>Any business that lives on the phone</h2>
          <p>If customers call you to book, buy or ask — Golden Robin makes sure someone always answers.</p>
        </div>
        <div className="usecases">
          {useCases.map((c, i) => (
            <div className="usecase reveal" key={c.title} style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
              <div className="u-ico">{c.ico}</div>
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   STATS
   ──────────────────────────────────────────────────── */
function Stat({ value, suffix, prefix, decimals = 0, label }: {
  value: number; suffix?: string; prefix?: string; decimals?: number; label: string;
}) {
  const [ref, val] = useCountUp(value);
  const shown = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString();
  return (
    <div className="stat" ref={ref}>
      <div className="num grad-text">{prefix}{shown}{suffix}</div>
      <div className="lbl">{label}</div>
    </div>
  );
}

function Stats() {
  return (
    <section className="l-section">
      <div className="l-container">
        <div className="stats-band reveal">
          <Stat value={100} suffix="%" label="Of calls answered, instantly" />
          <Stat value={38} suffix="%" label="More appointments booked" />
          <Stat value={0.7} decimals={1} suffix="s" label="Average time to pick up" />
          <Stat value={62} suffix="%" label="Lower front-desk cost" />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   PRICING
   ──────────────────────────────────────────────────── */
const plans = [
  {
    plan: "Starter", price: "$199", unit: "/mo",
    note: "For a single location finding its feet.",
    features: ["Up to 500 calls / month", "1 tailor-fit voice agent", "Appointment booking", "Call transcripts & dashboard", "Email support"],
    cta: "Start free trial", featured: false,
  },
  {
    plan: "Growth", price: "$549", unit: "/mo",
    note: "For busy shops that live on the phone.",
    features: ["Up to 2,500 calls / month", "Up to 3 agents & locations", "Live inventory & pricing lookups", "CRM, POS & calendar integrations", "Multilingual support (30+ languages)", "Priority support"],
    cta: "Book a demo", featured: true,
  },
  {
    plan: "Enterprise", price: "Custom", unit: "",
    note: "For chains and multi-location brands.",
    features: ["Unlimited calls & locations", "Dedicated solutions engineer", "Custom integrations & SSO", "SOC 2 report & DPA", "SLA & 99.99% uptime"],
    cta: "Talk to sales", featured: false,
  },
];

function Pricing() {
  return (
    <section className="l-section" id="pricing">
      <div className="l-container">
        <div className="section-head reveal">
          <span className="eyebrow">Pricing</span>
          <h2>Cheaper than a missed call</h2>
          <p>Every plan includes a 14-day free trial. No setup fees, cancel anytime.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((p, i) => (
            <div className={`price-card reveal ${p.featured ? "featured" : ""}`} key={p.plan} style={{ transitionDelay: `${i * 80}ms` }}>
              {p.featured && <span className="ribbon">Most popular</span>}
              <span className="plan">{p.plan}</span>
              <div className="price">{p.price}<span>{p.unit}</span></div>
              <div className="price-note">{p.note}</div>
              <ul>
                {p.features.map((f) => (
                  <li key={f}><CheckIcon /> {f}</li>
                ))}
              </ul>
              <Link className={`l-btn ${p.featured ? "l-btn-primary" : "l-btn-ghost"}`} href="/sign-up">
                {p.cta} <Arrow className="arrow" width={16} height={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   TESTIMONIALS
   ──────────────────────────────────────────────────── */
const quotes = [
  { quote: "We were sending 40% of our calls to voicemail during the winter tire rush. Golden Robin picked up every single one and booked them. It paid for itself in a weekend.", name: "Dave Mercier", role: "Service Manager, Auto Centre" },
  { quote: "Customers honestly can't tell it's AI. It knows our pricing, checks stock, and reserves parts before they even hang up. Our advisors finally have time to sell.", name: "Priya Raman", role: "Operations Lead, Retail Group" },
  { quote: "After-hours used to be dead air. Now we wake up to a list of booked appointments and captured leads. It's like hiring a night shift that never sleeps.", name: "Marc Tremblay", role: "Owner, Northgate Tire & Auto" },
];

function Testimonials() {
  return (
    <section className="l-section">
      <div className="l-container">
        <div className="section-head reveal">
          <span className="eyebrow">Loved by operators</span>
          <h2>The phone stops being a problem</h2>
        </div>
        <div className="tcards">
          {quotes.map((q, i) => (
            <div className="tcard reveal" key={q.name} style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="stars">{[...Array(5)].map((_, j) => <Star key={j} />)}</div>
              <p className="quote">&ldquo;{q.quote}&rdquo;</p>
              <div className="who">
                <span className="ava" />
                <div>
                  <b>{q.name}</b>
                  <span>{q.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   CTA
   ──────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="l-section" id="cta">
      <div className="l-container">
        <div className="cta-band reveal">
          <h2>Stop losing customers<br />to hold music.</h2>
          <p>
            See Golden Robin answer a live call for your business. Book a 15-minute demo and we&apos;ll
            spin up an agent trained on your shop — on the call.
          </p>
          <div className="cta-actions">
            <Link className="l-btn l-btn-primary l-btn-lg" href="/sign-up">
              Get started free <Arrow className="arrow" width={18} height={18} />
            </Link>
            <a className="l-btn l-btn-ghost l-btn-lg" href="tel:+17624262064">
              <Phone width={17} height={17} /> Call our AI: (762) 426-2064
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   FOOTER
   ──────────────────────────────────────────────────── */
const Social = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
);

const footerCols = [
  { h: "Product", links: ["Features", "How it works", "Use cases", "Pricing", "Integrations"] },
  { h: "Company", links: ["About", "Careers", "Blog", "Contact"] },
  { h: "Resources", links: ["Docs", "API", "Security", "Status"] },
];

function Footer() {
  return (
    <footer className="l-footer">
      <div className="l-container">
        <div className="footer-grid">
          <div>
            <a href="#top" className="l-brand">
              <BrandMark />
              Golden Robin
            </a>
            <p className="footer-blurb">
              Tailor-fit AI voice agents that answer every call for your business — so no
              customer is ever left on hold again.
            </p>
          </div>
          {footerCols.map((c) => (
            <div className="footer-col" key={c.h}>
              <h5>{c.h}</h5>
              {c.links.map((l) => (
                <a href="#" key={l}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Golden Robin Technologies Inc. All rights reserved.</span>
          <div className="footer-social">
            <a href="#" aria-label="X"><Social d="M18.9 2H22l-7.3 8.3L23 22h-6.5l-5-6.6L5.6 22H2.5l7.8-8.9L1.7 2h6.6l4.6 6 5-6zm-2.3 18h1.8L7.5 3.8H5.6L16.6 20z" /></a>
            <a href="#" aria-label="LinkedIn"><Social d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H9z" /></a>
            <a href="#" aria-label="GitHub"><Social d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.300-4.6-1.1-4.6-5a4 4 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7a4 4 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A10 10 0 0 0 12 2z" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────
   PAGE
   ──────────────────────────────────────────────────── */
export default function HomePage() {
  useReveal();

  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <Hero />
        <LogoBar />
        <Demo />
        <Features />
        <HowItWorks />
        <UseCases />
        <Stats />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
