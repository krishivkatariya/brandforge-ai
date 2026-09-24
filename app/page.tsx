"use client";

import { useEffect, useState } from "react";

type View = "dashboard" | "workflow" | "battle" | "guardian" | "kit";

type Direction = {
  label: string;
  title: string;
  color: string;
  concept: string;
  names: string[];
  tagline: string;
  fit: string;
  risk: string;
};

const stages = [
  ["01", "Discovery", "Understand the audience, problem, and stakes."],
  ["02", "Positioning", "Turn raw insight into a sharp strategic angle."],
  ["03", "Personality", "Define how the brand should feel and behave."],
  ["04", "Brand Battle", "Generate three genuinely different directions."],
  ["05", "Critic", "Challenge generic, unclear, or inconsistent choices."],
  ["06", "Selection", "Choose the direction with the strongest signal."],
  ["07", "Visual Identity", "Translate strategy into a visual language."],
  ["08", "Brand Voice", "Make every message sound unmistakably yours."],
  ["09", "Guardian", "Check new content against the brand system."],
  ["10", "Launch", "Ship a coherent launch-ready kit."],
];

const directions: Direction[] = [
  {
    label: "A / BUILDER",
    title: "Forge the crew",
    color: "orange",
    concept: "A practical, high-energy toolkit for people who make things together.",
    names: ["Forge", "Stackmate", "Buildloop"],
    tagline: "Find your people. Ship your thing.",
    fit: "Makes the product feel useful, active, and close to the builder's reality.",
    risk: "Forge is a crowded metaphor and needs a distinct verbal signature.",
  },
  {
    label: "B / COMMUNITY",
    title: "The right room",
    color: "mint",
    concept: "A welcoming signal for finding the people who make a great project click.",
    names: ["Kinship", "Roommate", "Orbit"],
    tagline: "Good ideas need the right room.",
    fit: "Leans into belonging and lowers the anxiety of finding collaborators.",
    risk: "Can feel soft unless the product proves it moves quickly.",
  },
  {
    label: "C / COMPETITION",
    title: "Enter the arena",
    color: "blue",
    concept: "A bold, game-like rallying point for ambitious teams under a deadline.",
    names: ["Rally", "Bracket", "Draftday"],
    tagline: "Build your winning team.",
    fit: "Creates urgency and memorability for hackathon-driven, competitive users.",
    risk: "Competition can make first-time users feel excluded or intimidated.",
  },
];

const demoProject = {
  name: "Campus Relay",
  idea: "A platform that helps college students find teammates for hackathons.",
  audience: "College students who want to build, but do not yet have a crew.",
  problem: "Students waste the first hours of a hackathon searching for reliable teammates.",
  value: "Find the right teammates before the clock starts, then ship with momentum.",
  personality: ["Bold", "Resourceful", "Open", "Fast-moving"],
  decision: "Community is the strongest wedge: belonging gets students over the first hurdle.",
  selected: 1,
  guardianText: "We are launching our new feature next week. It is a comprehensive solution for all your collaboration needs.",
};

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [project, setProject] = useState(() => {
    if (typeof window === "undefined") return demoProject;
    const saved = window.localStorage.getItem("brandforge-project");
    return saved ? JSON.parse(saved) : demoProject;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [guardianText, setGuardianText] = useState(demoProject.guardianText);
  const [guardianChecked, setGuardianChecked] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    window.localStorage.setItem("brandforge-project", JSON.stringify(project));
  }, [project]);

  const selected = directions[project.selected];
  const runWorkflow = () => {
    setIsRunning(true);
    setToast("Running structured workflow...");
    window.setTimeout(() => {
      setIsRunning(false);
      setToast("Workflow complete. Brand state updated.");
      setView("battle");
    }, 900);
  };

  const selectDirection = (index: number) => {
    setProject({ ...project, selected: index });
    setToast("Direction selected. Downstream stages now use this decision.");
  };

  const downloadKit = () => {
    const blob = new Blob([JSON.stringify({ project, direction: selected, stages }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "brandforge-brand-kit.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark"><span>BF</span><div><strong>BRANDFORGE</strong><small>AI BRAND STUDIO</small></div></div>
        <div className="demo-pill"><i /> DEMO MODE <span>LIVE DATA</span></div>
        <nav className="nav-list" aria-label="Main navigation">
          <NavItem label="Dashboard" active={view === "dashboard"} onClick={() => setView("dashboard")} icon="01" />
          <NavItem label="Brand workflow" active={view === "workflow"} onClick={() => setView("workflow")} icon="02" />
          <NavItem label="Brand battle" active={view === "battle"} onClick={() => setView("battle")} icon="03" />
          <NavItem label="Brand guardian" active={view === "guardian"} onClick={() => setView("guardian")} icon="04" />
          <NavItem label="Brand kit" active={view === "kit"} onClick={() => setView("kit")} icon="05" />
        </nav>
        <div className="sidebar-footer"><div className="avatar">KR</div><div><strong>Kitchen table</strong><small>Personal workspace</small></div><span className="more">...</span></div>
      </aside>

      <section className="content">
        <header className="topbar"><div className="breadcrumbs">WORKSPACE <span>/</span> {project.name.toUpperCase()}</div><div className="top-actions"><button className="icon-button" aria-label="Notifications">&#9673;</button><button className="outline-button" onClick={() => { setProject(demoProject); setToast("Demo project reset."); }}>Reset demo</button><div className="avatar small">KR</div></div></header>
        {toast && <button className="toast" onClick={() => setToast("")}>{toast} <b>×</b></button>}

        {view === "dashboard" && <Dashboard project={project} onRun={runWorkflow} isRunning={isRunning} onNavigate={setView} />}
        {view === "workflow" && <Workflow onNavigate={setView} />}
        {view === "battle" && <Battle selected={project.selected} onSelect={selectDirection} />}
        {view === "guardian" && <Guardian text={guardianText} setText={setGuardianText} checked={guardianChecked} onCheck={() => setGuardianChecked(true)} />}
        {view === "kit" && <Kit project={project} selected={selected} onDownload={downloadKit} />}
      </section>
    </main>
  );
}

function NavItem({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon: string }) {
  return <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}><span className="nav-number">{icon}</span>{label}{active && <b>›</b>}</button>;
}

function Dashboard({ project, onRun, isRunning, onNavigate }: { project: typeof demoProject; onRun: () => void; isRunning: boolean; onNavigate: (view: View) => void }) {
  return <>
    <div className="page-heading"><div><p className="eyebrow">PROJECT / 01</p><h1>Shape something <em>worth remembering.</em></h1><p className="lede">One structured workflow from rough idea to a brand system you can actually ship.</p></div><button className="primary-button" onClick={onRun}>{isRunning ? "Analyzing..." : "Continue workflow"}<span>→</span></button></div>
    <section className="hero-grid"><div className="idea-card"><div className="card-label"><span className="status-dot" /> CURRENT PROJECT <b>DEMO</b></div><h2>{project.name}</h2><p>{project.idea}</p><div className="idea-meta"><span><small>Audience</small>{project.audience}</span><span><small>Stage</small><strong>Brand battle</strong></span></div></div><div className="signal-card"><div className="card-label">WORKFLOW SIGNAL <span>UPDATED JUST NOW</span></div><div className="signal-score">07 <small>/ 10</small></div><p>Stages completed</p><div className="progress"><i /></div><div className="signal-foot"><span>Strong momentum</span><span>70%</span></div></div></section>
    <section className="section-heading"><div><p className="eyebrow">THE ENGINE</p><h2>From fog to signal</h2></div><button className="text-button" onClick={() => onNavigate("workflow")}>See full workflow <span>↗</span></button></section>
    <div className="stage-grid">{stages.slice(0, 6).map(([number, title, desc], index) => <button className={`stage-card ${index < 5 ? "done" : "current"}`} key={title} onClick={() => onNavigate(index === 3 || index === 4 ? "battle" : "workflow")}><div className="stage-top"><span>{number}</span><i>{index < 5 ? "✓" : "→"}</i></div><h3>{title}</h3><p>{desc}</p><small>{index < 5 ? "COMPLETE" : "NEXT UP"}</small></button>)}</div>
    <section className="insight-row"><div><span className="quote-mark">“</span><p>{project.decision}</p><small>AI DECISION / POSITIONING AGENT</small></div><div className="next-panel"><span>NEXT ACTION</span><strong>Choose your strongest<br />strategic territory.</strong><button onClick={() => onNavigate("battle")}>Open brand battle →</button></div></section>
  </>;
}

function Workflow({ onNavigate }: { onNavigate: (view: View) => void }) {
  return <><div className="page-heading compact"><div><p className="eyebrow">THE WORKFLOW / TRANSPARENT BY DESIGN</p><h1>Every decision leaves a trace.</h1><p className="lede">BrandForge keeps structured context moving forward, so a launch line never loses the insight that shaped it.</p></div></div><div className="workflow-list">{stages.map(([number, title, desc], index) => <div className={`workflow-row ${index < 6 ? "complete" : ""}`} key={title}><div className="workflow-index">{number}<span>{index < 6 ? "✓" : "○"}</span></div><div><h3>{title}</h3><p>{desc}</p></div><div className="workflow-context"><small>{index === 0 ? "INPUT" : "CONTEXT USED"}</small><span>{index === 0 ? "Raw idea + constraints" : `${index + 1} structured outputs`}</span></div><div className="workflow-output"><small>OUTPUT</small><span>{index === 4 ? "Scores + recommendations" : index === 8 ? "Consistency report" : "Validated brand state"}</span></div></div>)}</div><button className="primary-button" onClick={() => onNavigate("battle")}>Inspect the battle stage <span>→</span></button></>;
}

function Battle({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  return <><div className="page-heading compact"><div><p className="eyebrow">STAGE 04 / STRATEGY IN MOTION</p><h1>Brand battle</h1><p className="lede">Three territories. One decision. Each direction is intentionally different, then tested against the same audience and problem.</p></div><div className="iteration">CRITIC LOOP <strong>2 / 3</strong><small>REVISE PASS COMPLETE</small></div></div><div className="battle-grid">{directions.map((direction, index) => <article className={`direction-card ${direction.color} ${selected === index ? "selected" : ""}`} key={direction.title}><div className="direction-head"><span>{direction.label}</span>{selected === index ? <b className="selected-badge">SELECTED</b> : <button onClick={() => onSelect(index)}>Choose →</button>}</div><h2>{direction.title}</h2><p>{direction.concept}</p><div className="sample-names">{direction.names.map(name => <span key={name}>{name}</span>)}</div><div className="direction-detail"><small>TAGLINE DIRECTION</small><strong>{direction.tagline}</strong><small>WHY IT FITS</small><p>{direction.fit}</p><small>CRITIC FLAG</small><p className="risk">{direction.risk}</p></div></article>)}</div><div className="critic-bar"><div className="critic-icon">!</div><div><strong>Anti-generic critic</strong><p>Community has the clearest audience fit, but “Kinship” needs a sharper ownable story. The system has carried that recommendation into the next stage.</p></div><div className="critic-score"><small>OVERALL SIGNAL</small><strong>82<span>/100</span></strong></div></div></>;
}

function Guardian({ text, setText, checked, onCheck }: { text: string; setText: (value: string) => void; checked: boolean; onCheck: () => void }) {
  return <><div className="page-heading compact"><div><p className="eyebrow">STAGE 09 / BRAND GUARDIAN</p><h1>Keep the signal intact.</h1><p className="lede">Paste a future message. The Guardian checks it against Campus Relay&apos;s audience, positioning, personality, and voice.</p></div></div><div className="guardian-grid"><div className="guardian-input"><label>CONTENT TO CHECK <span>LIVE BRAND STATE ATTACHED</span></label><textarea value={text} onChange={event => setText(event.target.value)} /><button className="primary-button" onClick={onCheck}>{checked ? "Checked against brand" : "Run guardian check"}<span>→</span></button></div><div className={`guardian-result ${checked ? "ready" : ""}`}><div className="result-label"><span className="status-dot" /> {checked ? "EVALUATION COMPLETE" : "WAITING FOR CONTENT"}</div>{checked ? <><h2>Clear idea. Too generic.</h2><p>The message is understandable, but “comprehensive solution” sounds corporate and does not reflect the fast, welcoming Campus Relay voice.</p><div className="check-list"><span><b>62</b> Audience fit</span><span><b>41</b> Voice match</span><span><b>28</b> Distinctiveness</span></div><div className="revision"><small>REVISED VERSION</small><strong>New feature, new teammates, zero waiting around. Find your next build partner on Campus Relay.</strong></div></> : <div className="empty-result"><span>◎</span><p>Your evaluation will show the evidence, score, and a revised version here.</p></div>}</div></div></>;
}

function Kit({ project, selected, onDownload }: { project: typeof demoProject; selected: Direction; onDownload: () => void }) {
  return <><div className="page-heading compact"><div><p className="eyebrow">BRAND KIT / READY TO SHIP</p><h1>{project.name}</h1><p className="lede">A living system built from your decisions, not a pile of disconnected outputs.</p></div><button className="primary-button" onClick={onDownload}>Download JSON <span>↓</span></button></div><div className="kit-mast"><div><small>SELECTED DIRECTION</small><h2>{selected.title}</h2><p>{selected.tagline}</p></div><div className="kit-name"><small>BRAND NAME</small><strong>{selected.names[0]}</strong><span>Audience fit 88 / 100</span></div></div><div className="kit-grid"><KitBlock title="Strategy"><p>{project.value}</p><dl><dt>Audience</dt><dd>{project.audience}</dd><dt>Problem</dt><dd>{project.problem}</dd></dl></KitBlock><KitBlock title="Personality"><div className="trait-list">{project.personality.map(trait => <span key={trait}>{trait}</span>)}</div><p className="muted">Avoid: corporate, generic, overly formal</p></KitBlock><KitBlock title="Visual direction"><div className="swatches"><i /><i /><i /><i /></div><p>Warm signal colors, open compositions, and a kinetic editorial feel. Confident without becoming competitive.</p></KitBlock><KitBlock title="Launch copy"><strong className="launch-headline">Good ideas need the right room.</strong><p>Find teammates who make your next build move faster.</p><button className="text-button" onClick={() => navigator.clipboard?.writeText("Good ideas need the right room.")}>Copy headline ↗</button></KitBlock></div></>;
}

function KitBlock({ title, children }: { title: string; children: React.ReactNode }) { return <section className="kit-block"><div className="card-label">{title.toUpperCase()} <span>01</span></div>{children}</section>; }
