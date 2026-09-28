"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Vortex from "./components/Vortex";

type Cap = { title: string; blurb: string };

const caps: Cap[] = [
  {
    title: "Equation learning",
    blurb: "Discover the equations behind a system directly from data.",
  },
  {
    title: "Parameter estimation",
    blurb: "Fast, accurate inference, even when the data is noisy.",
  },
  {
    title: "Coarse graining",
    blurb: "Reduce complex systems to the few quantities that matter.",
  },
  {
    title: "Reduced-order modeling",
    blurb: "Fast surrogates for expensive simulations.",
  },
  {
    title: "Collective dynamics",
    blurb: "Learn how populations move, and uncover the structure within them.",
  },
  {
    title: "Forecasting",
    blurb: "Predictive models with calibrated uncertainty.",
  },
];

const industries: string[] = [
  "Enterprise & industrial R&D",
  "Life sciences & biomedicine",
  "Energy & climate",
  "Advanced manufacturing",
  "Finance & risk",
  "Research labs & academia",
];

const statement =
  "Every system follows rules it never writes down. We recover them from noisy data, turn them into models you can read and trust, and run them fast enough to act on.";

type Status = "idle" | "sending" | "sent" | "error";

function SmallCaps({ children }: { children: string }) {
  return (
    <span className="smallcaps">
      {children.split(" ").map((w, i) => (
        <span key={i}>
          {i > 0 && " "}
          {w === w.toUpperCase() ? (
            w
          ) : (
            <>
              {w[0]}
              <small>{w.slice(1)}</small>
            </>
          )}
        </span>
      ))}
    </span>
  );
}

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const statementRef = useRef<HTMLParagraphElement>(null);

  // Nav backdrop + scroll-lit statement.
  useEffect(() => {
    const el = statementRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
      if (reduce) return el.style.setProperty("--p", "1");
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.82 - r.top) / (r.height + vh * 0.3);
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Dialog: lock body scroll + close on Escape.
  useEffect(() => {
    if (!dialogOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDialogOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [dialogOpen]);

  const openDialog = () => {
    setStatus("idle");
    setError("");
    setDialogOpen(true);
  };

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("sent");
      setForm({ name: "", email: "", company: "", message: "" });
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.error ?? "Could not send. Try again in a moment.");
    setStatus("error");
  };

  const words = statement.split(" ");

  return (
    <>
      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <div className="container nav-inner">
          <a href="#top" className="wordmark" aria-label="Boulder Computational Solutions, back to top">
            <SmallCaps>Boulder Computational Solutions</SmallCaps>
          </a>
          <nav className="nav-links">
            <a href="#capabilities">Capabilities</a>
            <a href="#industries">Industries</a>
          </nav>
          <button className="btn btn-quiet" onClick={openDialog}>
            Get in touch
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <Vortex />
          <div className="container hero-content">
            <h1>
              We change
              <br />
              the equation.
            </h1>
            <p className="hero-sub">
              We recover the equations hidden in noisy data, and the parameters
              that drive them.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={openDialog}>
                Get in touch
              </button>
              <a href="#capabilities" className="btn btn-ghost">
                See what we do
              </a>
            </div>
          </div>
          <p className="eq eq-weak" aria-hidden="true">
            ‖⟨∂<sub>𝑡</sub>𝜑, 𝑈<span className="flip">⟨</span> + ∑<sub>𝑘,𝑝</sub> (−1)<sup>𝑘</sup> 𝑤<sub>𝑘,𝑝</sub> ⟨∂<sub>𝑥</sub><sup>𝑘</sup>𝜑, 𝑈<sup>𝑝</sup><span className="flip">⟨</span>‖<sup>2</sup>
          </p>
          <p className="eq eq-ns" aria-hidden="true">
            ∂<sub>𝑡</sub>𝑢 + (𝑢 ⋅ ∇)𝑢 = −∇𝑝 + 𝜈Δ𝑢 + 𝑓, &nbsp; ∇ ⋅ 𝑢 = 0
          </p>
        </section>

        <section className="container statement">
          <p ref={statementRef} style={{ "--n": words.length } as CSSProperties}>
            {words.map((w, i) => (
              <span key={i} className="word" style={{ "--i": i } as CSSProperties}>
                {w}{" "}
              </span>
            ))}
          </p>
        </section>

        <section id="capabilities" className="container split">
          <div className="split-head">
            <h2>What we do</h2>
            <p>
              No black boxes. Just mathematics, taken further than you&apos;d
              expect.
            </p>
          </div>
          <ul className="ledger">
            {caps.map((c) => (
              <li key={c.title} className="ledger-row cap">
                <h3>{c.title}</h3>
                <p>{c.blurb}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="industries" className="container split">
          <div className="split-head">
            <h2>Where we work</h2>
          </div>
          <ul className="ledger ledger-grid">
            {industries.map((ind) => (
              <li key={ind} className="ledger-row">
                {ind}
              </li>
            ))}
          </ul>
        </section>

        <section className="container cta">
          <h2>Have a problem worth modeling?</h2>
          <p>Tell us what you&apos;re trying to predict, estimate, or discover.</p>
          <button className="btn btn-primary" onClick={openDialog}>
            Get in touch
          </button>
        </section>
      </main>

      <footer className="container card">
        <div className="card-line">
          <SmallCaps>Boulder Computational Solutions, Inc</SmallCaps>
        </div>
        <div className="card-line">
          <span className="eq eq-card" aria-hidden="true">
            ∫<sub>Ω</sub> 𝜑 ∂<sub>𝑡</sub>𝑢 = −∫<sub>Ω</sub> 𝑢 ∂<sub>𝑡</sub>𝜑
          </span>
        </div>
        <div className="card-line">
          <SmallCaps>Boulder, Colorado, USA</SmallCaps>
        </div>
        <div className="card-line" />
        <div className="card-line card-meta">
          <span>© 2026</span>
          <nav>
            <a href="#capabilities">Capabilities</a>
            <a href="#industries">Industries</a>
            <button onClick={openDialog}>Get in touch</button>
          </nav>
        </div>
      </footer>

      {dialogOpen && (
        <div
          className="dialog-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          onClick={() => setDialogOpen(false)}
        >
          <div className="dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-head">
              <h3 id="dialog-title">Get in touch</h3>
              <button
                className="dialog-close"
                onClick={() => setDialogOpen(false)}
                aria-label="Close dialog"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {status === "sent" ? (
              <div className="form-sent">
                <h4>Message sent</h4>
                <p>Thanks. We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <>
                <p className="dialog-lede">
                  Tell us what you&apos;re trying to predict, estimate, or
                  discover. We&apos;ll tell you how we&apos;d approach it.
                </p>

                <form onSubmit={submit} className="contact-form">
                  <label className="field">
                    <span>Name</span>
                    <input
                      required
                      autoFocus
                      value={form.name}
                      onChange={set("name")}
                      autoComplete="name"
                    />
                  </label>
                  <label className="field">
                    <span>Email</span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      autoComplete="email"
                    />
                  </label>
                  <label className="field">
                    <span>
                      Company <em>optional</em>
                    </span>
                    <input
                      value={form.company}
                      onChange={set("company")}
                      autoComplete="organization"
                    />
                  </label>
                  <label className="field">
                    <span>Message</span>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={set("message")}
                    />
                  </label>

                  {status === "error" && (
                    <div className="form-error">{error}</div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary submit-btn"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending…" : "Send message"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
