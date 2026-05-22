// Main Wellbeing page
const { useState, useEffect, useRef } = React;

// Inline SVG icons — line, single weight, hand-of-an-illustrator feel
const Icons = {
  heart: (p) => (
    <svg viewBox="0 0 32 32" fill="none" {...p}>
      <path d="M16 26C7 20 4 14 6 10c2-4 7-3 10 1c3-4 8-5 10-1c2 4-1 10-10 16Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  cloud: (p) => (
    <svg viewBox="0 0 32 32" fill="none" {...p}>
      <path d="M9 22h14a5 5 0 0 0 1-9.9A7 7 0 0 0 10 11a5 5 0 0 0-1 11Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M14 16v3M19 16v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  leaf: (p) => (
    <svg viewBox="0 0 32 32" fill="none" {...p}>
      <path d="M7 25C5 16 11 6 25 6c0 14-9 20-18 19Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M7 25C12 20 17 15 22 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  spark: (p) => (
    <svg viewBox="0 0 32 32" fill="none" {...p}>
      <path d="M16 6v8M16 18v8M6 16h8M18 16h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  book: (p) => (
    <svg viewBox="0 0 32 32" fill="none" {...p}>
      <path d="M6 7h9c2 0 3 1 3 3v17c0-2-1-3-3-3H6V7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M26 7h-9c-2 0-3 1-3 3v17c0-2 1-3 3-3h9V7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  arrow: (p) => (
    <svg viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M3 8h10M13 8l-4-4M13 8l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowDown: (p) => (
    <svg viewBox="0 0 16 16" fill="none" {...p}>
      <path d="M8 3v10M8 13l-4-4M8 13l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const HELP_ICONS = [Icons.heart, Icons.cloud, Icons.leaf, Icons.spark, Icons.book];

// Decorative line-drawn illustrations
function HeroOrnament() {
  return (
    <svg className="hero-orn" viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <path d="M30 100 Q 100 30 170 100 Q 100 170 30 100Z" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path d="M100 20 Q 30 100 100 180 Q 170 100 100 20Z" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

function SectionDivider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <svg viewBox="0 0 100 12" preserveAspectRatio="none">
        <path d="M0 6 Q 25 0 50 6 T 100 6" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
      </svg>
    </div>
  );
}

// ─── PALETTES ────────────────────────────────────────────────────────────────
const PALETTES = {
  forest: { bg: "#F1ECE2", paper: "#FBF7EE", ink: "#1F2A22", inkSoft: "#5B6258", brand: "#2F4A3A", brandSoft: "#E5E5D5", accent: "#C77A53", accentSoft: "#F3D9C5", line: "#D9D0BD" },
  sea:    { bg: "#ECEFEE", paper: "#F7F9F8", ink: "#1A2730", inkSoft: "#5D6A6F", brand: "#1F3D52", brandSoft: "#D7DDDC", accent: "#7BA89E", accentSoft: "#D9E6E2", line: "#C9D2D0" },
  plum:   { bg: "#F6EFE6", paper: "#FBF6EE", ink: "#23161E", inkSoft: "#62575E", brand: "#3B2A4A", brandSoft: "#E8DDDF", accent: "#D88C66", accentSoft: "#F3DCC8", line: "#DDCFB9" },
};

const HERO_LAYOUTS = ["editorial", "portrait", "wide"];

// ─── APP ─────────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lang": "en",
  "paletteKey": "forest",
  "headlineFont": "newsreader",
  "heroLayout": "editorial",
  "density": "regular"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const copy = window.I18N[t.lang] || window.I18N.en;
  const pal = PALETTES[t.paletteKey] || PALETTES.forest;
  const headlineFont =
    t.headlineFont === "cormorant"
      ? "'Cormorant Garamond', serif"
      : t.headlineFont === "instrument"
      ? "'Instrument Serif', serif"
      : "'Newsreader', serif";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cssVars = {
    "--bg": pal.bg,
    "--paper": pal.paper,
    "--ink": pal.ink,
    "--ink-soft": pal.inkSoft,
    "--brand": pal.brand,
    "--brand-soft": pal.brandSoft,
    "--accent": pal.accent,
    "--accent-soft": pal.accentSoft,
    "--line": pal.line,
    "--headline-font": headlineFont,
    "--density": t.density === "compact" ? "0.85" : t.density === "comfy" ? "1.15" : "1",
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="page" style={cssVars}>
      <TopNav copy={copy} scrolled={scrolled} onBook={() => setBookingOpen(true)} onNav={scrollTo} t={t} setTweak={setTweak} />
      <Hero copy={copy} onBook={() => setBookingOpen(true)} layout={t.heroLayout} />
      <Marquee copy={copy} />
      <HelpSection copy={copy} />
      <SectionDivider />
      <FormatsSection copy={copy} />
      <SafeSpace copy={copy} />
      <MeetSection copy={copy} onBook={() => setBookingOpen(true)} />
      <AccessSection copy={copy} onBook={() => setBookingOpen(true)} />
      <Footer copy={copy} />

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} copy={copy} palette={pal} />

      <TweaksUI t={t} setTweak={setTweak} />
    </div>
  );
}

// ─── TOP NAV ─────────────────────────────────────────────────────────────────
function TopNav({ copy, scrolled, onBook, onNav, t, setTweak }) {
  return (
    <header className={"top-nav" + (scrolled ? " scrolled" : "")}>
      <div className="nav-inner">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 14C4 8 8 4 14 4M20 10C20 16 16 20 10 20M4 14C7 14 14 7 14 4M20 10C17 10 10 17 10 20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="brand-text">
            <span className="brand-team">TEAM</span>
            <span className="brand-sub">Wellbeing</span>
          </span>
        </a>
        <nav className="nav-links">
          <a href="#help" onClick={(e) => { e.preventDefault(); onNav("help"); }}>{copy.nav.help}</a>
          <a href="#formats" onClick={(e) => { e.preventDefault(); onNav("formats"); }}>{copy.nav.formats}</a>
          <a href="#meet" onClick={(e) => { e.preventDefault(); onNav("meet"); }}>{copy.nav.meet}</a>
          <a href="#access" onClick={(e) => { e.preventDefault(); onNav("access"); }}>{copy.nav.access}</a>
        </nav>
        <div className="nav-right">
          <LangSwitcher t={t} setTweak={setTweak} />
          <button className="btn btn-primary btn-sm" onClick={onBook}>
            {copy.nav.book}
            <Icons.arrow width="12" height="12" />
          </button>
        </div>
      </div>
    </header>
  );
}

function LangSwitcher({ t, setTweak }) {
  return (
    <div className="lang-switch">
      {["en", "ru", "uz"].map((l) => (
        <button
          key={l}
          className={"lang-btn" + (t.lang === l ? " active" : "")}
          onClick={() => setTweak("lang", l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero({ copy, onBook, layout }) {
  return (
    <section className={"hero hero-" + layout}>
      <HeroOrnament />
      <div className="hero-inner">
        <div className="hero-text">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            {copy.hero.eyebrow}
          </div>
          <h1 className="display" style={{ fontFamily: "var(--headline-font)" }}>
            {copy.hero.title.map((line, i) => (
              <span key={i} className={"line line-" + i}>
                {line}
              </span>
            ))}
          </h1>
          <p className="lead">{copy.hero.sub}</p>
          <div className="hero-ctas">
            <button className="btn btn-primary btn-lg" onClick={onBook}>
              {copy.hero.primaryCta}
              <Icons.arrow width="14" height="14" />
            </button>
            <a href={"mailto:" + copy.officer.email} className="btn btn-ghost btn-lg">
              {copy.hero.secondaryCta}
            </a>
          </div>
          <div className="hero-badge">
            <span className="dot dot-live" />
            {copy.hero.badge}
          </div>
        </div>

        <aside className="hero-card">
          <div className="hero-card-photo">
            <image-slot
              id="shakhnoza-portrait"
              shape="rounded"
              radius="14"
              placeholder="Drop a portrait of Shakhnoza here"
              style={{ width: "100%", height: "100%" }}
            ></image-slot>
            <div className="photo-frame" aria-hidden="true" />
          </div>
          <div className="hero-card-meta">
            <div className="hero-card-label">{copy.officer.label}</div>
            <div className="hero-card-name" style={{ fontFamily: "var(--headline-font)" }}>
              {copy.officer.name}
            </div>
            <div className="hero-card-role">{copy.officer.role}</div>
            <div className="hero-card-divider" />
            <div className="hero-card-contacts">
              <div className="hcc-row">
                <span className="hcc-k">TG</span>
                <a href="#" className="hcc-v">{copy.officer.tg}</a>
              </div>
              <div className="hcc-row">
                <span className="hcc-k">@</span>
                <a href={"mailto:" + copy.officer.email} className="hcc-v">{copy.officer.email}</a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <a className="scroll-cue" href="#help" onClick={(e) => {
        e.preventDefault();
        document.getElementById("help")?.scrollIntoView({ behavior: "smooth" });
      }}>
        <Icons.arrowDown width="14" height="14" />
        <span>scroll</span>
      </a>
    </section>
  );
}

// ─── MARQUEE ────────────────────────────────────────────────────────────────
function Marquee({ copy }) {
  const items = copy.lang === "ru"
    ? ["Конфиденциально", "·", "Безопасно", "·", "С эмпатией", "·", "Бесплатно", "·", "EN · RU · UZ"]
    : ["Confidential", "·", "Safe", "·", "Empathetic", "·", "Free for students", "·", "English · Russian · Uzbek"];
  // simpler: just inline
  const tokens = ["Confidential", "Safe", "Empathetic", "Free for students", "English · Russian · Uzbek"];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...Array(3)].flatMap((_, k) =>
          tokens.map((tk, i) => (
            <span key={k + "-" + i} className="marquee-item">
              <span className="marquee-dot" /> {tk}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

// ─── HELP SECTION ───────────────────────────────────────────────────────────
function HelpSection({ copy }) {
  return (
    <section id="help" className="section section-help">
      <div className="container">
        <div className="section-head">
          <div className="kicker">{copy.help.kicker}</div>
          <h2 className="h2" style={{ fontFamily: "var(--headline-font)" }}>{copy.help.title}</h2>
          <p className="section-sub">{copy.help.sub}</p>
        </div>
        <div className="help-grid">
          {copy.help.items.map((it, i) => {
            const Icon = HELP_ICONS[i % HELP_ICONS.length];
            return (
              <article key={i} className={"help-card help-card-" + i}>
                <div className="help-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="help-icon"><Icon width="36" height="36" /></div>
                <h3 className="help-title">{it.t}</h3>
                <p className="help-body">{it.d}</p>
              </article>
            );
          })}
          <div className="help-card help-card-cta">
            <p className="help-cta-text">Something else on your mind?</p>
            <a href={"mailto:" + copy.officer.email} className="help-cta-link">
              Just write to us
              <Icons.arrow width="12" height="12" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FORMATS ────────────────────────────────────────────────────────────────
function FormatsSection({ copy }) {
  return (
    <section id="formats" className="section section-formats">
      <div className="container">
        <div className="section-head section-head-left">
          <div className="kicker">{copy.formats.kicker}</div>
          <h2 className="h2" style={{ fontFamily: "var(--headline-font)" }}>{copy.formats.title}</h2>
          <p className="section-sub">{copy.formats.sub}</p>
        </div>
        <div className="formats-grid">
          {copy.formats.items.map((it, i) => (
            <article key={i} className="format-card">
              <div className="format-tag">{it.tag}</div>
              <h3 className="format-title" style={{ fontFamily: "var(--headline-font)" }}>{it.t}</h3>
              <p className="format-desc">{it.d}</p>
              <ul className="format-bullets">
                {it.bullets.map((b, j) => (
                  <li key={j}>
                    <span className="fb-mark">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="format-foot">
                <span className="format-num">0{i + 1} / 03</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SAFE SPACE QUOTE ──────────────────────────────────────────────────────
function SafeSpace({ copy }) {
  return (
    <section className="section section-safe">
      <div className="container container-narrow">
        <div className="safe-mark">{copy.safe.quoteOpen}</div>
        <blockquote className="safe-quote" style={{ fontFamily: "var(--headline-font)" }}>
          {copy.safe.quote}
        </blockquote>
        <div className="safe-caption">— {copy.safe.caption}</div>
      </div>
    </section>
  );
}

// ─── MEET ────────────────────────────────────────────────────────────────────
function MeetSection({ copy, onBook }) {
  return (
    <section id="meet" className="section section-meet">
      <div className="container">
        <div className="meet-grid">
          <div className="meet-photo">
            <image-slot
              id="shakhnoza-portrait-large"
              shape="rounded"
              radius="6"
              placeholder="Editorial portrait — landscape preferred"
              style={{ width: "100%", aspectRatio: "4/5" }}
            ></image-slot>
            <div className="meet-photo-caption">
              <span>Shakhnoza in conversation,</span>
              <span>Student Support Department</span>
            </div>
          </div>
          <div className="meet-body">
            <div className="kicker">— {copy.meet.kicker}</div>
            <h2 className="h2" style={{ fontFamily: "var(--headline-font)" }}>{copy.officer.name}</h2>
            <p className="meet-lead">{copy.meet.lead}</p>
            <p className="meet-text">{copy.meet.body}</p>
            <dl className="meet-details">
              <div className="md-row">
                <dt>{copy.meet.detailLabels.role}</dt>
                <dd>{copy.officer.role}</dd>
              </div>
              <div className="md-row">
                <dt>{copy.meet.detailLabels.dept}</dt>
                <dd>{copy.officer.dept}</dd>
              </div>
              <div className="md-row">
                <dt>{copy.meet.detailLabels.email}</dt>
                <dd><a href={"mailto:" + copy.officer.email}>{copy.officer.email}</a></dd>
              </div>
              <div className="md-row">
                <dt>{copy.meet.detailLabels.tg}</dt>
                <dd><a href="#">{copy.officer.tg}</a></dd>
              </div>
              <div className="md-row">
                <dt>{copy.meet.detailLabels.languages}</dt>
                <dd>{copy.meet.languages}</dd>
              </div>
            </dl>
            <button className="btn btn-primary" onClick={onBook}>
              Book a session with Shakhnoza
              <Icons.arrow width="12" height="12" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ACCESS ─────────────────────────────────────────────────────────────────
function AccessSection({ copy, onBook }) {
  return (
    <section id="access" className="section section-access">
      <div className="container">
        <div className="section-head">
          <div className="kicker">{copy.access.kicker}</div>
          <h2 className="h2" style={{ fontFamily: "var(--headline-font)" }}>{copy.access.title}</h2>
        </div>
        <div className="access-grid">
          {copy.access.steps.map((s, i) => (
            <div key={i} className="access-step">
              <div className="as-num" style={{ fontFamily: "var(--headline-font)" }}>{s.n}</div>
              <h3 className="as-title">{s.t}</h3>
              <p className="as-desc">{s.d}</p>
              <button
                className="as-cta"
                onClick={() => {
                  if (i === 0) onBook();
                  else if (i === 1) window.location.href = "mailto:" + copy.officer.email;
                }}
              >
                <span className="as-cta-label">{s.cta}</span>
                <Icons.arrow width="14" height="14" />
              </button>
              <div className="as-meta">{s.ctaSub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────
function Footer({ copy }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-mark" style={{ fontFamily: "var(--headline-font)" }}>Wellbeing.</div>
            <div className="footer-tag">{copy.footer.uni} · {copy.footer.tag}</div>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <div className="footer-col-h">Services</div>
              <ul>
                {copy.footer.links.map((l, i) => (
                  <li key={i}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <div className="footer-col-h">Contact</div>
              <ul>
                <li><a href={"mailto:" + copy.officer.email}>{copy.officer.email}</a></li>
                <li><a href="#">{copy.officer.tg}</a></li>
                <li>{copy.officer.dept}</li>
              </ul>
            </div>
            <div className="footer-col">
              <div className="footer-col-h">Languages</div>
              <ul>
                <li>{copy.footer.langs}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">{copy.footer.copy}</div>
          <div className="footer-mini-links">
            <a href="#">Privacy</a>
            <a href="#">Accessibility</a>
            <a href="#">Code of conduct</a>
          </div>
        </div>
        <div className="footer-massive" aria-hidden="true" style={{ fontFamily: "var(--headline-font)" }}>
          You're not alone.
        </div>
      </div>
    </footer>
  );
}

// ─── TWEAKS UI ──────────────────────────────────────────────────────────────
function TweaksUI({ t, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Language" />
      <TweakRadio
        label="UI language"
        value={t.lang}
        options={["en", "ru", "uz"]}
        onChange={(v) => setTweak("lang", v)}
      />
      <TweakSection label="Visual" />
      <TweakColor
        label="Palette"
        value={[
          PALETTES[t.paletteKey].bg,
          PALETTES[t.paletteKey].brand,
          PALETTES[t.paletteKey].accent,
        ]}
        options={[
          [PALETTES.forest.bg, PALETTES.forest.brand, PALETTES.forest.accent],
          [PALETTES.sea.bg, PALETTES.sea.brand, PALETTES.sea.accent],
          [PALETTES.plum.bg, PALETTES.plum.brand, PALETTES.plum.accent],
        ]}
        onChange={(v) => {
          const idx = [
            [PALETTES.forest.bg, PALETTES.forest.brand, PALETTES.forest.accent],
            [PALETTES.sea.bg, PALETTES.sea.brand, PALETTES.sea.accent],
            [PALETTES.plum.bg, PALETTES.plum.brand, PALETTES.plum.accent],
          ].findIndex((p) => p[0] === v[0]);
          const keys = ["forest", "sea", "plum"];
          setTweak("paletteKey", keys[idx] || "forest");
        }}
      />
      <TweakSelect
        label="Headline font"
        value={t.headlineFont}
        options={[
          { value: "newsreader", label: "Newsreader (default)" },
          { value: "cormorant", label: "Cormorant Garamond" },
          { value: "instrument", label: "Instrument Serif" },
        ]}
        onChange={(v) => setTweak("headlineFont", v)}
      />
      <TweakRadio
        label="Hero layout"
        value={t.heroLayout}
        options={HERO_LAYOUTS}
        onChange={(v) => setTweak("heroLayout", v)}
      />
      <TweakRadio
        label="Density"
        value={t.density}
        options={["compact", "regular", "comfy"]}
        onChange={(v) => setTweak("density", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
