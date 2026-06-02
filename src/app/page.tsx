"use client";

import { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import Image from "next/image";

/* Base path for GitHub Pages — must match next.config.ts basePath */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/* Where lead submissions are emailed (FormSubmit.co — no backend needed). */
const LEAD_ENDPOINT = "https://formsubmit.co/ajax/tejbeermanchanda@gmail.com";

/* Lead modal context — any CTA can open the popup with a topic for the prefilled message. */
const LeadModalContext = createContext<(topic: string) => void>(() => {});
const useLeadModal = () => useContext(LeadModalContext);

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

/* ────────────────────────────────────────────────────
   BRAND MARK
   ──────────────────────────────────────────────────── */
const BrandMark = () => (
  <span className="brand-mark" aria-hidden>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#ng)" strokeWidth="2.4" strokeLinecap="round">
      <defs>
        <linearGradient id="ng" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F0DFC0" />
          <stop offset="0.5" stopColor="#D4B87A" />
          <stop offset="1" stopColor="#C8A96E" />
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
  const openLead = useLeadModal();
  return (
    <nav className={`l-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="l-container l-nav-inner">
        <a href="#top" className="l-brand">
          <Image src={`${BASE}/logos/aria.png`} alt="Aria" width={32} height={32} className="brand-logo" />
          Aria
        </a>
        <div className="l-nav-links">
          <a href="#features">Capabilities</a>
          <a href="#how">How it works</a>
          <a href="#usecases">Use cases</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="l-nav-cta">
          <button className="login" onClick={() => openLead("Aria")}>Sign in</button>
          <button className="l-btn l-btn-primary" onClick={() => openLead("getting started with Aria")}>
            Get started <Arrow className="arrow" width={16} height={16} />
          </button>
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

function fmt(sec: number) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function Hero() {
  const openLead = useLeadModal();
  // Vapi call state
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "active" | "ended">("idle");
  const [transcript, setTranscript] = useState<{ role: string; text: string }[]>([]);
  const [partial, setPartial] = useState<{ role: string; text: string } | null>(null);
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

  // Auto-scroll transcript (on finalized lines AND partial updates)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [transcript, partial]);

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
        if (msg.type === "transcript" && msg.transcript) {
          const role = msg.role === "assistant" ? "agent" : "caller";
          if (msg.transcriptType === "partial") {
            // Live update — show words as they're spoken
            setPartial({ role, text: msg.transcript });
          } else if (msg.transcriptType === "final") {
            // Finalized — commit to transcript and clear partial
            setTranscript((prev) => [...prev, { role, text: msg.transcript! }]);
            setPartial(null);
          }
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
    setPartial(null);
    setCallTimer(0);
    vapiRef.current = null;
  }, []);

  const isIdle = callStatus === "idle";
  const isCalling = callStatus === "connecting" || callStatus === "active";

  return (
    <header className="l-hero" id="top">
      {/* Background video */}
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src={`${BASE}/hero-bg.mp4`} type="video/mp4" />
      </video>
      <div className="hero-overlay" />

      <div className="l-container hero-grid">
        {/* Left column — copy */}
        <div className="hero-copy reveal in">
          <h1>
            Never miss a<br />
            customer call <span className="grad-text">again.</span>
          </h1>
          <p className="hero-sub">
            Aria builds tailor-fit AI voice agents that pick up every call for your
            business — booking appointments, quoting prices, and checking inventory in
            real time. No hold music. No voicemail. No lost revenue.
          </p>
          <div className="hero-actions">
            <button className="l-btn l-btn-primary l-btn-lg" onClick={() => openLead("getting started with Aria")}>
              Get started free <Arrow className="arrow" width={18} height={18} />
            </button>
            <a className="l-btn l-btn-ghost l-btn-lg" href="#how">
              See how it works
            </a>
          </div>
        </div>

        {/* Center (or right when idle) column — orb */}
        <div className={`orb-wrap reveal in ${isCalling ? "calling" : ""}`}>
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

        {/* Right column — always present so grid never shifts */}
        <div className="hero-call-transcript">
          {(isCalling || callStatus === "ended") ? (
            <div className="hero-transcript" ref={scrollRef}>
              {callStatus === "connecting" && !partial && transcript.length === 0 && (
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
              {/* Live partial — updates word by word as you or the AI speak */}
              {partial && (
                <div className={`ht-bubble ${partial.role} ht-partial`}>
                  <span className="ht-role">{partial.role === "agent" ? "AI" : "You"}</span>
                  {partial.text}<span className="ht-cursor" />
                </div>
              )}
              {callStatus === "active" && transcript.length === 0 && !partial && (
                <div className="ht-empty">Speak &mdash; the AI is listening...</div>
              )}
            </div>
          ) : (
            <div className="hero-transcript-placeholder" />
          )}
        </div>

      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────
   LOGO BAR
   ──────────────────────────────────────────────────── */
const logos = [
  { name: "Canadian Tire", src: `${BASE}/logos/canadian-tire.png`, w: 120, h: 120 },
  { name: "PartSource",    src: `${BASE}/logos/partsource.svg`,   w: 160, h: 50 },
  { name: "Kal Tire",      src: `${BASE}/logos/kal-tire.png`,     w: 160, h: 45 },
  { name: "Mr. Lube",      src: `${BASE}/logos/mr-lube.jpg`,      w: 160, h: 50 },
  { name: "NAPA Auto Parts", src: `${BASE}/logos/napa.png`,       w: 120, h: 120 },
  { name: "Speedy Auto Service", src: `${BASE}/logos/speedy.jpg`, w: 180, h: 60 },
];

function LogoBar() {
  return (
    <section className="l-section-sm logobar" id="built-for">
      <div className="l-container">
        <div className="section-head reveal">
          <span className="eyebrow">Built for</span>
          <h2>Service businesses like</h2>
          <p>We&apos;re building Aria for the brands that run on phone calls.</p>
        </div>
        <div className="logobar-row reveal">
          {logos.map((l) => (
            <Image
              key={l.name}
              src={l.src}
              alt={l.name}
              width={l.w}
              height={l.h}
              className="logo-img"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   FEATURES
   ──────────────────────────────────────────────────── */
const features = [
  { icon: Brain, title: "Trained on your business", desc: "Aria learns your services, hours, pricing, policies and tone — so it answers like your best employee, not a generic bot.", wide: true },
  { icon: Bolt, title: "Sub-second response", desc: "Natural, uninterrupted conversation with no awkward lag. Callers feel heard, not handled." },
  { icon: Calendar, title: "Books appointments", desc: "Reads your live calendar, offers real openings, and writes the booking back automatically." },
  { icon: BoxIcon, title: "Checks live inventory", desc: "Looks up stock and pricing in real time and can reserve items for pickup on the spot." },
  { icon: Plug, title: "Connects to your stack", desc: "Plugs into your POS, CRM, scheduling and phone system. Works with the tools you already run." },
  { icon: Handoff, title: "Knows when to hand off", desc: "For anything sensitive or out of scope, Aria transfers to the right person — with full call context, so customers never repeat themselves." },
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
  { n: "01", title: "Connect your number", desc: "Forward your existing line or get a new one. Aria starts answering overflow, after-hours, or every call — your call." },
  { n: "02", title: "Train on your business", desc: "Point Aria at your website, price lists, calendar and systems. It builds a tailor-fit agent in minutes, not months." },
  { n: "03", title: "Go live & watch it work", desc: "Your agent handles calls 24/7. Review transcripts, outcomes and bookings from one dashboard, and refine anytime." },
];

function HowItWorks() {
  return (
    <section className="l-section" id="how">
      <div className="l-container">
        <div className="section-head reveal">
          <span className="eyebrow">How it works</span>
          <h2>Live in a day, not a quarter</h2>
          <p>No integration team required. If you can describe how your front desk works, Aria can run it.</p>
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
          <p>If customers call you to book, buy or ask — Aria makes sure someone always answers.</p>
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
    plan: "Starter", price: "$229", unit: "/mo",
    note: "After-hours & overflow for one location.",
    features: ["1,000 minutes / month (~400 calls)", "Then $0.25 / minute", "1 tailor-fit voice agent", "Appointment booking", "Call transcripts & dashboard", "Email support"],
    cta: "Start free trial", featured: false,
  },
  {
    plan: "Growth", price: "$549", unit: "/mo",
    note: "Every call, all day, for a busy shop.",
    features: ["2,500 minutes / month (~1,000 calls)", "Then $0.25 / minute", "Up to 3 agents & locations", "Live inventory & pricing lookups", "CRM, POS & calendar integrations", "Multilingual support (30+ languages)", "Priority support"],
    cta: "Book a demo", featured: true,
  },
  {
    plan: "Enterprise", price: "Custom", unit: "",
    note: "For chains and multi-location brands.",
    features: ["Unlimited minutes & locations", "Volume per-minute rates", "Dedicated solutions engineer", "Custom integrations & SSO", "SOC 2 report & DPA", "SLA & 99.99% uptime"],
    cta: "Talk to sales", featured: false,
  },
];

function Pricing() {
  const openLead = useLeadModal();
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
              <button className={`l-btn ${p.featured ? "l-btn-primary" : "l-btn-ghost"}`} onClick={() => openLead(`the ${p.plan} plan`)}>
                {p.cta} <Arrow className="arrow" width={16} height={16} />
              </button>
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
  { quote: "We were sending 40% of our calls to voicemail during the winter tire rush. Aria picked up every single one and booked them. It paid for itself in a weekend.", name: "Dave Mercier", role: "Owner, Northgate Tire & Auto — Hamilton, ON", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { quote: "Customers honestly can't tell it's AI. It knows our pricing, checks stock, and reserves parts before they even hang up. Our advisors finally have time to sell.", name: "Priya Raman", role: "Operations Manager, Maple Ridge Automotive — Surrey, BC", img: "https://randomuser.me/api/portraits/women/68.jpg" },
  { quote: "After-hours used to be dead air. Now we wake up to a list of booked appointments and captured leads. It's like hiring a night shift that never sleeps.", name: "Marc Tremblay", role: "Owner, Summit Auto Centre — Laval, QC", img: "https://randomuser.me/api/portraits/men/52.jpg" },
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
                <Image className="ava" src={q.img} alt={q.name} width={42} height={42} />
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
  const openLead = useLeadModal();
  return (
    <section className="l-section" id="cta">
      <div className="l-container">
        <div className="cta-band reveal">
          <h2>Stop losing customers<br />to hold music.</h2>
          <p>
            See Aria answer a live call for your business. Book a 15-minute demo and we&apos;ll
            spin up an agent trained on your shop — on the call.
          </p>
          <div className="cta-actions">
            <button className="l-btn l-btn-primary l-btn-lg" onClick={() => openLead("getting started with Aria")}>
              Get started free <Arrow className="arrow" width={18} height={18} />
            </button>
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
function Footer() {
  return (
    <footer className="l-footer">
      <div className="l-container">
        <div className="footer-simple">
          <a href="#top" className="l-brand">
            <Image src={`${BASE}/logos/aria.png`} alt="Aria" width={32} height={32} className="brand-logo" />
            Aria
          </a>
          <p className="footer-blurb">
            Tailor-fit AI voice agents that answer every call for your business — so no
            customer is ever left on hold again.
          </p>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Aria Technologies Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────
   LEAD MODAL — popup contact form (emailed via FormSubmit.co)
   ──────────────────────────────────────────────────── */
function LeadModal({ topic, onClose }: { topic: string | null; onClose: () => void }) {
  const open = topic !== null;
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  // Prefill the message based on which button opened the modal
  useEffect(() => {
    if (topic) {
      setForm((f) => ({ ...f, message: `Hi, I'm reaching out about ${topic}.` }));
      setStatus("idle");
    }
  }, [topic]);

  // Esc to close + lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
          _subject: `New Aria lead — ${topic}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="lead-overlay" onClick={onClose}>
      <div className="lead-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="lead-close" onClick={onClose} aria-label="Close">&times;</button>
        {status === "done" ? (
          <div className="lead-success">
            <div className="lead-check"><CheckIcon width={28} height={28} /></div>
            <h3>Thanks &mdash; we&apos;ll be in touch!</h3>
            <p>We&apos;ve received your details and someone from Aria will reach out shortly.</p>
            <button className="l-btn l-btn-primary l-btn-lg" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <h3>Get started with Aria</h3>
            <p className="lead-sub">Tell us a bit about your business and we&apos;ll set you up.</p>
            <form className="lead-form" onSubmit={submit}>
              <label className="lead-field">
                <span>Name</span>
                <input type="text" required value={form.name} onChange={set("name")} placeholder="Jane Smith" />
              </label>
              <label className="lead-field">
                <span>Email</span>
                <input type="email" required value={form.email} onChange={set("email")} placeholder="jane@yourshop.com" />
              </label>
              <label className="lead-field">
                <span>Company</span>
                <input type="text" value={form.company} onChange={set("company")} placeholder="Yourshop Auto & Tire" />
              </label>
              <label className="lead-field">
                <span>Message</span>
                <textarea rows={3} value={form.message} onChange={set("message")} />
              </label>
              {status === "error" && (
                <p className="lead-err">Something went wrong. Please try again, or email us directly.</p>
              )}
              <button className="l-btn l-btn-primary l-btn-lg" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send"} <Arrow className="arrow" width={18} height={18} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   PAGE
   ──────────────────────────────────────────────────── */
export default function HomePage() {
  useReveal();
  const [leadTopic, setLeadTopic] = useState<string | null>(null);
  const openLead = useCallback((topic: string) => setLeadTopic(topic), []);

  return (
    <LeadModalContext.Provider value={openLead}>
      <div className="landing-page">
        <Navbar />
        <main>
          <Hero />
          <LogoBar />
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
      <LeadModal topic={leadTopic} onClose={() => setLeadTopic(null)} />
    </LeadModalContext.Provider>
  );
}
