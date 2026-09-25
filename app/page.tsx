"use client";

import { startTransition, useEffect, useState } from "react";

type Stage = "create" | "discovery" | "positioning" | "personality" | "battle" | "critic" | "selection" | "visual" | "voice" | "guardian" | "launch" | "kit" | "workflow";
type Direction = { direction_name: string; strategic_territory: string; concept: string; emotional_territory: string; naming_style: string; sample_names: string[]; tagline_direction: string; personality: string[]; strengths: string[]; weaknesses: string[] };
type Visual = { color_palette: string[]; typography: string[]; imagery_style: string; composition: string; symbols: string[]; ui_direction: string; things_to_avoid: string[] };
type Voice = { tone: string; vocabulary: string[]; sentence_style: string; writing_rules: string[]; words_to_use: string[]; words_to_avoid: string[]; example_headline: string; example_product_description: string; example_social_post: string; example_cta: string };
type Guardian = { content?: string; overall_evaluation: string; audience_fit: number; positioning_alignment: number; personality_alignment: number; voice_alignment: number; genericity_risk: number; problems: string[]; explanation: string; recommendations: string[]; improved_version: string };
type Launch = { headline: string; subheadline: string; one_line_pitch: string; product_description: string; social_post: string; cta: string };
type State = { id?: string; name: string; idea: string; audience?: string; problem?: string; alternatives?: string; positioning?: { category: string; target_audience: string; core_problem: string; value_proposition: string; differentiator: string; positioning_statement: string; competitive_angle: string }; personality?: { traits: string[]; principles: string[]; traits_to_avoid: string[] }; directions?: Direction[]; evaluations?: Array<{ scores: Record<string, number>; decision: string; issues: string[]; evidence: string[]; recommendations: string[] }>; selected?: number; visual?: Visual; voice?: Voice; guardian?: Guardian; launch?: Launch; final?: { name: string; tagline: string; pitch: string } };

const demo: State = { id: "demo", name: "Campus Relay", idea: "A platform that helps college students find teammates for hackathons.", audience: "College students who want to build, but do not yet have a crew.", problem: "Students waste the first hours of a hackathon searching for reliable teammates.", alternatives: "Group chats, Discord servers, and asking around at the event.", positioning: { category: "guided coordination platform", target_audience: "College students who want to build", core_problem: "Students waste the first hours searching for reliable teammates.", value_proposition: "Find the right teammates before the clock starts, then ship with momentum.", differentiator: "It turns a vague need into a relevant, human-feeling match.", positioning_statement: "For college builders who need a crew, Campus Relay makes the right teammate easy to find before the clock starts.", competitive_angle: "Clarity and fit over noisy directories." }, personality: { traits: ["Open", "Resourceful", "Specific", "Momentum-driven"], principles: ["Make the next step obvious", "Invite before you impress", "Reward useful momentum"], traits_to_avoid: ["Corporate", "Generic", "Overly formal"] }, selected: 1 };

const steps: Array<[Stage, string]> = [["create", "Idea"], ["discovery", "Discovery"], ["positioning", "Positioning"], ["personality", "Personality"], ["battle", "Brand Battle"], ["critic", "Critic"], ["selection", "Selection"], ["visual", "Visual Identity"], ["voice", "Brand Voice"], ["guardian", "Guardian"], ["launch", "Launch"], ["kit", "Brand Kit"], ["workflow", "Workflow"]];

function localDirections(state: State): Direction[] { const subject = state.name; return [{ direction_name: "Make it real", strategic_territory: "Builder / technical", concept: `A practical engine for making ${subject} useful fast.`, emotional_territory: "Capability and momentum", naming_style: "Compact verbs and construction language", sample_names: ["Forge", "Stackmate", "Buildloop"], tagline_direction: "Find the right move. Make it real.", personality: ["Precise", "Energetic", "Capable"], strengths: ["Feels actionable", "Signals progress"], weaknesses: ["Can sound like a tool"] }, { direction_name: "Find your people", strategic_territory: "Community / crew", concept: "A welcoming signal for the people who make a good idea click.", emotional_territory: "Belonging and recognition", naming_style: "Warm, human, easy-to-say names", sample_names: ["Kinship", "Orbit", "Roommate"], tagline_direction: "Good ideas need the right room.", personality: ["Open", "Warm", "Encouraging"], strengths: ["Lowers first-step anxiety", "Strong emotional hook"], weaknesses: ["Needs proof of speed"] }, { direction_name: "Enter the arena", strategic_territory: "Competitive / arena", concept: "A rallying point for ambitious people working against the clock.", emotional_territory: "Urgency and earned pride", naming_style: "Short, kinetic, game-adjacent names", sample_names: ["Rally", "Bracket", "Draftday"], tagline_direction: "Build your winning team.", personality: ["Bold", "Fast", "Ambitious"], strengths: ["Memorable energy", "Creates urgency"], weaknesses: ["May intimidate beginners"] }]; }

function localVisual(state: State): Visual { return { color_palette: ["Deep ink #1D2924", "Signal orange #F36B3B", "Soft mint #CBE8D8", "Warm paper #F7F8F3"], typography: ["Expressive grotesk headlines", "Compact mono labels", "Readable humanist body"], imagery_style: `Real ${state.audience || "people"} making progress together, captured in candid motion.`, composition: "Open editorial compositions with a clear focal point and generous breathing room.", symbols: ["Relay marks", "Connected paths", "Directional arrows"], ui_direction: "Warm signal colors, crisp borders, and generous space around decisions.", things_to_avoid: ["Stock corporate scenes", "Generic gradients", "Overly competitive cues"] }; }
function localVoice(state: State): Voice { return { tone: "Direct, warm, useful, and quietly confident.", vocabulary: ["crew", "make", "ship", "right fit", "next move"], sentence_style: "Short active sentences with a human invitation.", writing_rules: ["Lead with the useful outcome", "Use active verbs", "Invite before you impress", "Name the friction plainly"], words_to_use: ["find", "build", "together", "ready", "move"], words_to_avoid: ["seamless", "comprehensive", "leverage", "solution"], example_headline: state.directions?.[state.selected ?? 1]?.tagline_direction || "Good ideas need the right room.", example_product_description: state.positioning?.value_proposition || "Make the next move with the right people.", example_social_post: "Your next build gets better when the right people are in the room.", example_cta: "Find your people" }; }
function localGuardian(state: State, content: string): Guardian { const generic = /comprehensive|seamless|leverage|solution/i.test(content); return { overall_evaluation: generic ? "Revise: the message loses the selected brand's human, specific signal." : "Keep: the message is aligned with the established brand system.", audience_fit: generic ? 6 : 9, positioning_alignment: generic ? 7 : 9, personality_alignment: generic ? 5 : 9, voice_alignment: generic ? 4 : 9, genericity_risk: generic ? 8 : 2, problems: generic ? ["Generic corporate vocabulary", "Weak audience signal"] : [], explanation: "The selected voice asks for active, human language tied to a concrete next move.", recommendations: generic ? ["Use active verbs and name a concrete outcome.", "Replace abstract claims with a specific user benefit."] : ["Keep the concrete audience and outcome visible."], improved_version: generic ? `${state.name}: ${state.voice?.example_cta || "Find your people"}. ${state.positioning?.value_proposition || "Make the next move together."}` : content }; }
function localLaunch(state: State): Launch { const direction = state.directions?.[state.selected ?? 1]; const name = state.final?.name || direction?.sample_names[0] || state.name; const tagline = direction?.tagline_direction || "Make the next move together."; return { headline: tagline, subheadline: state.positioning?.value_proposition || "Make a better first move.", one_line_pitch: `${name} helps ${state.positioning?.target_audience?.toLowerCase() || "people"} make the right next move.`, product_description: state.positioning?.positioning_statement || "A clearer way to move forward with the right people.", social_post: `Meet ${name}: ${tagline} Find your next move with people who get it.`, cta: state.voice?.example_cta || "Find your people" }; }

export default function Home() {
  const [stage, setStage] = useState<Stage>("create");
  const [state, setState] = useState<State>(demo);
  const [name, setName] = useState(""); const [idea, setIdea] = useState(""); const [answers, setAnswers] = useState({ audience: "", problem: "", alternatives: "" });
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [demoMode, setDemoMode] = useState(false); const [hydrated, setHydrated] = useState(false);
  const [pick, setPick] = useState<number | null>(null);
  const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");
  async function api<T>(path: string, options?: RequestInit): Promise<T> { const response = await fetch(`${BACKEND_URL}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(options?.headers || {}) } }); if (!response.ok) { const detail = await response.text().catch(() => ""); throw new Error(`Backend ${response.status} on ${path}${detail ? `: ${detail.slice(0, 300)}` : ""}. BrandState preserved; retry.`); } return response.json() as Promise<T>; }
  const selected = state.directions?.[state.selected ?? 1];
  const backendLive = !demoMode && !!state.id && state.id !== "demo";
  useEffect(() => {
    try {
      const snapshot = JSON.parse(window.localStorage.getItem("brandforge-mvp-v2") || "null");
      startTransition(() => {
        if (snapshot?.stage) setStage(snapshot.stage);
        if (snapshot?.state) setState(snapshot.state);
        if (snapshot?.name) setName(snapshot.name);
        if (snapshot?.idea) setIdea(snapshot.idea);
        if (snapshot?.answers) setAnswers(snapshot.answers);
        if (typeof snapshot?.demoMode === "boolean") setDemoMode(snapshot.demoMode);
        setHydrated(true);
      });
    } catch {
      window.localStorage.removeItem("brandforge-mvp-v2"); window.localStorage.removeItem("brandforge-mvp");
      startTransition(() => setHydrated(true));
    }
  }, []);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem("brandforge-mvp-v2", JSON.stringify({ stage, state, name, idea, answers, demoMode }));
  }, [answers, demoMode, hydrated, idea, name, stage, state]);
  const run = async (next: Stage, action: () => Promise<void>) => { setBusy(true); setError(""); try { await action(); setStage(next); } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong. Your current state is preserved."); } finally { setBusy(false); } };
  const refreshFromBackend = async (projectId: string) => { const full = await api<{ positioning?: State["positioning"]; personality?: State["personality"]; brand_directions?: Direction[]; evaluation?: { evaluations?: State["evaluations"] }; selected_direction?: Direction | null; visual_identity?: Visual; brand_voice?: Voice; guardian?: Guardian; launch?: Launch; final_brand?: State["final"] | null; discovery?: { problem?: string; target_users?: string[]; existing_alternatives?: string[] } }>(`/api/projects/${projectId}`); setState(prev => ({ ...prev, positioning: full.positioning ?? prev.positioning, personality: full.personality ?? prev.personality, directions: (full.brand_directions && full.brand_directions.length ? full.brand_directions : prev.directions), evaluations: (full.evaluation?.evaluations && full.evaluation.evaluations.length ? full.evaluation.evaluations : prev.evaluations), visual: (full.visual_identity && Object.keys(full.visual_identity).length ? full.visual_identity : prev.visual), voice: (full.brand_voice && Object.keys(full.brand_voice).length ? full.brand_voice : prev.voice), guardian: (full.guardian && full.guardian.overall_evaluation ? full.guardian : prev.guardian), launch: (full.launch && full.launch.headline ? full.launch : prev.launch), final: full.final_brand ?? prev.final, audience: full.discovery?.target_users?.[0] ?? prev.audience, problem: full.discovery?.problem ?? prev.problem, alternatives: full.discovery?.existing_alternatives?.[0] ?? prev.alternatives, selected: full.selected_direction && full.brand_directions ? Math.max(0, full.brand_directions.findIndex(d => d.direction_name === full.selected_direction?.direction_name)) : prev.selected })); };
  const create = () => run("discovery", async () => { if (!name.trim() || idea.trim().length < 10) throw new Error("Add a project name and an idea of at least 10 characters."); if (demoMode) { setState({ id: "demo", name: name.trim(), idea: idea.trim() }); return; } const created = await api<{ id: string }>(`/api/projects`, { method: "POST", body: JSON.stringify({ name: name.trim(), idea: idea.trim() }) }); setState({ id: created.id, name: name.trim(), idea: idea.trim() }); });
  const discover = () => run("positioning", async () => { if (demoMode) { const audience = (answers.audience || "early adopters").trim().replace(/[.!?]+$/, ""); const problem = (answers.problem || state.idea).trim().replace(/[.!?]+$/, ""); const next = { ...state, audience, problem, alternatives: answers.alternatives }; setState(next); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); await api(`/api/projects/${state.id}/discovery`, { method: "POST", body: JSON.stringify({ answers: { target_users: answers.audience, problem: answers.problem, alternatives: answers.alternatives } }) }); await refreshFromBackend(state.id); });
  const strategy = () => run("personality", async () => { if (demoMode) { const next = { ...state }; setState(next); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); await api(`/api/projects/${state.id}/positioning`, { method: "POST", body: "{}" }); await refreshFromBackend(state.id); });
  const personalityNext = () => run("battle", async () => { if (demoMode) { setState({ ...state, directions: localDirections(state) }); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); await api(`/api/projects/${state.id}/personality`, { method: "POST", body: "{}" }); await refreshFromBackend(state.id); });
  const generateBattle = () => run("battle", async () => { if (demoMode) { setState({ ...state, directions: localDirections(state) }); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); if (!state.directions?.length) { await api(`/api/projects/${state.id}/battle`, { method: "POST", body: "{}" }); await refreshFromBackend(state.id); } }); const battle = () => run("critic", async () => { if (demoMode) { setState({ ...state, directions: localDirections(state) }); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); if (!state.directions?.length) { await api(`/api/projects/${state.id}/battle`, { method: "POST", body: "{}" }); await refreshFromBackend(state.id); } });
  const criticNext = () => run("selection", async () => { if (demoMode) { const evaluations = (state.directions || []).map((_, i) => ({ decision: i === 1 ? "KEEP" : "REVISE", scores: { audience_fit: i === 1 ? 9 : 7, problem_alignment: 8, distinctiveness: i === 1 ? 8 : 6, memorability: i === 2 ? 8 : 7, clarity: 8, personality_alignment: 8, genericity_risk: i === 1 ? 2 : 6, consistency: 8 }, issues: i === 1 ? [] : ["The territory needs a more ownable verbal hook."], evidence: ["This score uses the submitted audience, problem, and positioning."], recommendations: i === 1 ? ["Protect the welcoming language in future copy."] : ["Replace familiar category language with a sharper cue."] })); setState({ ...state, evaluations }); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); await api(`/api/projects/${state.id}/critic`, { method: "POST", body: "{}" }); await refreshFromBackend(state.id); });
  const lockDirection = (index: number) => run("selection", async () => { const direction = state.directions?.[index]; if (!direction) throw new Error("Choose a valid direction."); if (demoMode) { setState({ ...state, selected: index, visual: localVisual({ ...state, selected: index }), final: { name: direction.sample_names[0], tagline: direction.tagline_direction, pitch: state.positioning?.value_proposition || "A clearer way to make the next move." } }); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); await api(`/api/projects/${state.id}/select-direction`, { method: "POST", body: JSON.stringify({ direction_index: index }) }); await refreshFromBackend(state.id); });
  const generateVisual = () => run("visual", async () => { if (demoMode) { if (!state.visual) setState({ ...state, visual: localVisual(state) }); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); if (!state.visual) { await api(`/api/projects/${state.id}/visual`, { method: "POST", body: "{}" }); await refreshFromBackend(state.id); } }); const prepareVoice = () => run("voice", async () => { if (demoMode) { setState({ ...state, voice: localVoice(state) }); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); if (!state.visual) { await api(`/api/projects/${state.id}/visual`, { method: "POST", body: "{}" }); await refreshFromBackend(state.id); } });
  const generateVoice = () => run("voice", async () => { if (demoMode) { if (!state.voice) setState({ ...state, voice: localVoice(state) }); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); if (!state.voice) { await api(`/api/projects/${state.id}/voice`, { method: "POST", body: "{}" }); await refreshFromBackend(state.id); } }); const openGuardian = () => run("guardian", async () => { if (demoMode) { setState({ ...state, voice: state.voice || localVoice(state) }); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); if (!state.voice) { await api(`/api/projects/${state.id}/voice`, { method: "POST", body: "{}" }); await refreshFromBackend(state.id); } });
  const guardian = (content: string) => run("guardian", async () => { if (demoMode) { setState({ ...state, guardian: localGuardian(state, content) }); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); await api(`/api/projects/${state.id}/guardian`, { method: "POST", body: JSON.stringify({ content }) }); await refreshFromBackend(state.id); });
  const generateLaunch = () => run("launch", async () => { if (demoMode) { if (!state.launch) setState({ ...state, launch: localLaunch(state) }); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); if (!state.launch) { await api(`/api/projects/${state.id}/launch`, { method: "POST", body: "{}" }); await refreshFromBackend(state.id); } }); const launch = () => run("kit", async () => { if (demoMode) { setState({ ...state, launch: localLaunch(state) }); return; } if (!state.id) throw new Error("Create the project first. BrandState preserved; retry."); if (!state.launch) { await api(`/api/projects/${state.id}/launch`, { method: "POST", body: "{}" }); await refreshFromBackend(state.id); } await api(`/api/projects/${state.id}/brand-kit`); await refreshFromBackend(state.id); });
  const loadDemo = () => { setDemoMode(true); setState({ ...demo, directions: localDirections(demo) }); setAnswers({ audience: demo.audience || "", problem: demo.problem || "", alternatives: demo.alternatives || "" }); setPick(null); setStage("discovery"); };
  return <main className="mvp-shell"><aside className="mvp-sidebar"><div className="brand-mark"><span>BF</span><div><strong>BRANDFORGE</strong><small>AI BRAND STUDIO</small></div></div><div className="demo-pill"><i /> {demoMode ? "DEMO MODE" : "LIVE MODE"}</div><button className="mode-toggle" onClick={() => setDemoMode(!demoMode)}>{demoMode ? "Switch to live mode" : "Use demo mode"}</button><nav>{steps.map(([key, label], i) => <button key={key} onClick={() => key === "kit" && state.final ? setStage(key) : key === "workflow" ? setStage(key) : undefined} className={stage === key ? "active" : ""}><span>{String(i + 1).padStart(2, "0")}</span>{label}{stage === key && <b>›</b>}</button>)}</nav><button className="reset-link" onClick={() => { setStage("create"); setState(demo); setPick(null); }}>+ New brand</button></aside><section className="mvp-content"><header className="mvp-topbar"><span>WORKSPACE / {state.name.toUpperCase()}</span><span className="live-chip">● {demoMode ? "DEMO DATA" : "LIVE BACKEND"}</span></header>{error && <div className="error-banner">{error}</div>}{busy && <div className="processing">Processing structured brand state...</div>}{stage === "create" && <Create name={name} setName={setName} idea={idea} setIdea={setIdea} onCreate={create} onDemo={loadDemo} />}{stage === "discovery" && <Discovery answers={answers} setAnswers={setAnswers} onNext={discover} />}{stage === "positioning" && <Positioning state={state} onNext={strategy} />}{stage === "personality" && <PersonalityStage state={state} onNext={personalityNext} />}{stage === "battle" && <Battle state={state} onNext={battle} onGenerate={generateBattle} pick={pick} setPick={setPick} />}{stage === "critic" && <Critic state={state} mode="critic" onNext={criticNext} onSelect={lockDirection} pick={pick} />}{stage === "selection" && <Critic state={state} mode="selection" onNext={() => setStage("visual")} onSelect={lockDirection} pick={pick} />}{stage === "visual" && <VisualStage state={state} onNext={prepareVoice} onGenerate={generateVisual} live={backendLive} />}{stage === "voice" && <VoiceStage state={state} onNext={openGuardian} onGenerate={generateVoice} live={backendLive} />}{stage === "guardian" && <GuardianStage state={state} busy={busy} error={error} onCheck={guardian} onContinue={() => setStage("launch")} />}{stage === "launch" && <LaunchStage state={state} onNext={launch} onGenerate={generateLaunch} live={backendLive} />}{stage === "kit" && <Kit state={state} selected={selected} live={backendLive} />}{stage === "workflow" && <Workflow state={state} stage={stage} busy={busy} error={error} onNavigate={setStage} />}</section></main>;
}

function Create({ name, setName, idea, setIdea, onCreate, onDemo }: { name: string; setName: (x: string) => void; idea: string; setIdea: (x: string) => void; onCreate: () => void; onDemo: () => void }) { return <div className="mvp-center"><p className="eyebrow">START WITH A SIGNAL</p><h1>Turn a rough idea into<br /><em>a brand people remember.</em></h1><p className="lede">BrandForge moves in stages: understand, position, challenge, choose. You stay in the loop at every decision.</p><div className="create-form"><label>PROJECT NAME<input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Campus Relay" /></label><label>ROUGH IDEA<textarea value={idea} onChange={e => setIdea(e.target.value)} placeholder="What are you building, for whom, and why does it matter?" /></label><button className="primary-button" onClick={onCreate}>Start discovery <span>→</span></button></div><button className="demo-link" onClick={onDemo}>Open Campus Relay demo ↗</button></div>; }
function Discovery({ answers, setAnswers, onNext }: { answers: { audience: string; problem: string; alternatives: string }; setAnswers: (x: { audience: string; problem: string; alternatives: string }) => void; onNext: () => void }) { return <div className="mvp-page"><p className="eyebrow">STAGE 01 / ADAPTIVE DISCOVERY</p><h1>Let&apos;s find the real<br /><em>problem underneath.</em></h1><p className="lede">These questions are chosen because their answers change the brand strategy. Nothing decorative gets in the way.</p><div className="question-grid">{[["audience", "Who is the primary user you want to win first?", "Audience language determines the brand center of gravity."], ["problem", "What frustrating problem are they experiencing today?", "A specific tension produces a sharper position."], ["alternatives", "What do they use or do instead right now?", "The alternative reveals where your difference can matter."]].map(([key, q, why]) => <label key={key}><span>QUESTION {key === "audience" ? "01" : key === "problem" ? "02" : "03"}</span><strong>{q}</strong><small>{why}</small><textarea value={answers[key as keyof typeof answers]} onChange={e => setAnswers({ ...answers, [key]: e.target.value })} /></label>)}</div><button className="primary-button" onClick={onNext}>Build my positioning <span>→</span></button></div>; }
function Positioning({ state, onNext }: { state: State; onNext: () => void }) { const p = state.positioning; return <div className="mvp-page"><p className="eyebrow">STAGE 02 / POSITIONING</p><h1>Here&apos;s the signal<br /><em>we found.</em></h1><div className="strategy-card"><div><small>CATEGORY</small><strong>{p?.category}</strong></div><div><small>CORE PROBLEM</small><p>{p?.core_problem}</p></div><div><small>VALUE PROPOSITION</small><p>{p?.value_proposition}</p></div><div><small>DIFFERENTIATOR</small><p>{p?.differentiator}</p></div><div className="full"><small>POSITIONING STATEMENT</small><strong>{p?.positioning_statement}</strong></div></div><button className="primary-button" onClick={onNext}>Shape the personality <span>→</span></button></div>; }
function PersonalityStage({ state, onNext }: { state: State; onNext: () => void }) { return <div className="mvp-page"><p className="eyebrow">STAGE 03 / PERSONALITY</p><h1>Give the strategy<br /><em>a point of view.</em></h1><p className="lede">These traits are derived from the audience and positioning, so the brand can behave consistently under pressure.</p><div className="strategy-card personality-card"><div className="full"><small>TRAITS</small><div className="tags">{state.personality?.traits.map(trait => <span key={trait}>{trait}</span>)}</div></div><div><small>PRINCIPLES</small>{state.personality?.principles.map(principle => <p key={principle}>+ {principle}</p>)}</div><div><small>AVOID</small>{state.personality?.traits_to_avoid.map(trait => <p key={trait} className="risk">{trait}</p>)}</div></div><button className="primary-button" onClick={onNext}>Enter the Brand Battle <span>→</span></button></div>; }
function Battle({ state, onNext, onGenerate, pick, setPick }: { state: State; onNext: () => void; onGenerate: () => void; pick: number | null; setPick: (i: number | null) => void }) {
  const directions = state.directions || [];
  if (!directions.length) return (
    <div className="mvp-page wide">
      <p className="eyebrow">STAGE 04 / BRAND BATTLE</p>
      <h1>Three ways to<br /><em>own the idea.</em></h1>
      <p className="lede">The naming agent forges three strategic territories from your positioning and personality. Each one is a different emotional bet on how the brand shows up.</p>
      <div className="bb-empty">
        <span>AWAITING THE BATTLE</span>
        <p>Positioning and personality are locked. Forge the three directions, then compare them side by side.</p>
        <button className="primary-button" onClick={onGenerate}>Forge three directions <span>→</span></button>
      </div>
    </div>
  );
  return (
    <div className="mvp-page wide">
      <p className="eyebrow">STAGE 04 / BRAND BATTLE</p>
      <h1>Three ways to<br /><em>own the idea.</em></h1>
      <p className="lede">Strategic territories, not random name lists. Compare the emotional bet each one makes, mark your gut pick, then let the critic challenge it.</p>
      <div className="battle-grid">
        {directions.map((d, i) => {
          const picked = pick === i;
          return (
            <article key={d.direction_name} className={`bb-card bb${i}${picked ? " is-picked" : ""}`}>
              <header className="bb-head">
                <span className="bb-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="bb-territory">{d.strategic_territory}</span>
                {picked && <span className="bb-flag">YOUR GUT PICK</span>}
              </header>
              <h2>{d.direction_name}</h2>
              <p className="bb-concept">{d.concept}</p>
              <div className="bb-block"><small>SAMPLE NAMES</small><div className="bb-names">{d.sample_names.map(n => <span key={n}>{n}</span>)}</div></div>
              <div className="bb-block"><small>EMOTIONAL TERRITORY</small><strong>{d.emotional_territory}</strong></div>
              <div className="bb-block"><small>NAMING STYLE</small><strong>{d.naming_style}</strong></div>
              <div className="bb-block"><small>TAGLINE DIRECTION</small><strong>{d.tagline_direction}</strong></div>
              <div className="bb-block"><small>PERSONALITY</small><div className="bb-traits">{d.personality.map(t => <span key={t}>{t}</span>)}</div></div>
              <div className="bb-notes">
                <div><small>STRENGTHS</small><ul>{d.strengths.map(s => <li key={s}>{s}</li>)}</ul></div>
                <div className="watch"><small>WATCH-OUTS</small><ul>{d.weaknesses.map(s => <li key={s}>{s}</li>)}</ul></div>
              </div>
              <button className={`bb-pick${picked ? " on" : ""}`} aria-pressed={picked} onClick={() => setPick(picked ? null : i)}>{picked ? "✓ Your pick — clear it" : "Mark as my gut pick"}</button>
            </article>
          );
        })}
      </div>
      <div className="bb-cta">
        <button className="primary-button" onClick={onNext}>Challenge the directions <span>→</span></button>
        <small>{pick != null ? `Gut pick: ${directions[pick]?.direction_name}. The critic answers next.` : "No gut pick marked — the critic evaluates all three."}</small>
      </div>
    </div>
  );
}
function Critic({ state, onNext, onSelect, mode, pick }: { state: State; onNext: () => void; onSelect: (i: number) => void; mode: "critic" | "selection"; pick: number | null }) {
  const directions = state.directions || [];
  const evaluations = state.evaluations || [];
  const scored = evaluations.length > 0;
  const signals: Array<{ key: string; label: string }> = [
    { key: "audience_fit", label: "AUDIENCE FIT" },
    { key: "problem_alignment", label: "PROBLEM ALIGNMENT" },
    { key: "distinctiveness", label: "DISTINCTIVENESS" },
    { key: "memorability", label: "MEMORABILITY" },
    { key: "clarity", label: "CLARITY" },
    { key: "personality_alignment", label: "PERSONALITY FIT" },
    { key: "genericity_risk", label: "GENERICITY RISK" },
    { key: "consistency", label: "CONSISTENCY" }
  ];
  const verdictClass = (decision: string) => { const d = (decision || "").toUpperCase(); return d.includes("KEEP") ? "keep" : d.includes("REVISE") ? "revise" : d.includes("REJECT") ? "reject" : "pending"; };
  const toneFor = (key: string, value: number) => key === "genericity_risk" ? (value <= 3 ? "good" : value >= 7 ? "bad" : "mid") : (value >= 7 ? "good" : value <= 4 ? "bad" : "mid");
  let keep = 0;
  let revise = 0;
  let reject = 0;
  let recs = 0;
  evaluations.forEach(e => { const d = (e.decision || "").toUpperCase(); if (d.includes("KEEP")) keep++; else if (d.includes("REVISE")) revise++; else if (d.includes("REJECT")) reject++; recs += e.recommendations?.length || 0; });
  const pickName = pick != null ? directions[pick]?.direction_name : undefined;
  const pickEv = pick != null ? evaluations[pick] : undefined;
  const eyebrow = mode === "critic" ? "STAGE 05 / ANTI-GENERIC CRITIC" : "STAGE 05 / DIRECTION SELECTION";
  if (!directions.length) return (
    <div className="mvp-page wide">
      <p className="eyebrow">{eyebrow}</p>
      <h1>Keep the strong.<br /><em>Challenge the easy.</em></h1>
      <div className="cc-empty">
        <span>NO DIRECTIONS TO EVALUATE</span>
        <p>The Brand Battle has not produced directions yet. Forge the three directions first, then run the critic.</p>
      </div>
    </div>
  );
  return (
    <div className="mvp-page wide">
      <p className="eyebrow">{eyebrow}</p>
      {mode === "critic" ? <h1>Keep the strong.<br /><em>Challenge the easy.</em></h1> : <h1>Lock in the direction<br /><em>that earned it.</em></h1>}
      <p className="lede">{mode === "critic" ? "The critic checks every direction against your audience, problem, and personality. Scores are signals, not scientific measurements." : "Eight signals, three verdicts. Review why each decision was made, then lock the direction that moves forward."}</p>
      {mode === "critic" && (
        <div className="run-bar">
          <button className="primary-button" onClick={onNext}>Run critic on these directions <span>→</span></button>
          <small>EIGHT SIGNALS PER DIRECTION — VERDICT, EVIDENCE, ISSUES, AND RECOMMENDATIONS FOR EACH.</small>
        </div>
      )}
      {mode === "selection" && !scored && (
        <div className="cc-notice">The critic has not scored these directions. Reset the project and run the critic pass again.</div>
      )}
      <div className="cc-grid">
        {directions.map((d, i) => {
          const ev = evaluations[i];
          const picked = pick === i;
          const locked = state.selected === i;
          const verdict = ev ? (ev.decision || "").toUpperCase() : "";
          const quality = ["audience_fit", "problem_alignment", "distinctiveness", "memorability", "clarity", "personality_alignment", "consistency"].map(k => ev?.scores[k]).filter((v): v is number => typeof v === "number");
          const avg = quality.length ? (quality.reduce((sum, v) => sum + v, 0) / quality.length).toFixed(1) : null;
          const risk = ev && typeof ev.scores.genericity_risk === "number" ? ev.scores.genericity_risk : null;
          return (
            <article key={d.direction_name} className={`cc-card${picked ? " is-pick" : ""}`}>
              <header className="cc-head">
                <span className="cc-index">{String(i + 1).padStart(2, "0")}</span>
                <small className="cc-territory">{d.strategic_territory}</small>
                <b className={`cc-verdict ${ev ? verdictClass(ev.decision) : "pending"}`}>{ev ? verdict || "REVIEWED" : "AWAITING CRITIC"}</b>
                {picked && <span className="cc-chip">YOUR PICK</span>}
                {mode === "selection" && locked && <span className="cc-chip locked">LOCKED</span>}
              </header>
              <h2>{d.direction_name}</h2>
              <p className="cc-concept">{d.concept}</p>
              {!ev && <p className="cc-pending">Awaiting the critic pass. Run the critic to score this direction on all eight signals.</p>}
              {ev && (
                <>
                  <div className="cc-avg">
                    {avg && <span>SIGNAL AVG <b>{avg}</b>/10</span>}
                    {risk != null && <span className={`tone-${toneFor("genericity_risk", risk)}`}>GENERICITY RISK <b>{risk}</b>/10</span>}
                  </div>
                  <div className="cc-signals">
                    {signals.map(s => {
                      const value = ev.scores[s.key];
                      const has = typeof value === "number";
                      const shown = has ? value : 0;
                      return (
                        <div className="cc-signal" key={s.key}>
                          <div className="cc-signal-top"><small>{s.label}</small><span>{has ? `${value}/10` : "—"}</span></div>
                          <div className="cc-track" role="progressbar" aria-label={s.label} aria-valuemin={0} aria-valuemax={10} aria-valuenow={has ? value : undefined}>
                            <i className={has ? toneFor(s.key, value) : ""} style={{ width: `${Math.max(0, Math.min(10, shown)) * 10}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <details className="cc-why">
                    <summary>WHY THIS DECISION?<span>+</span></summary>
                    <div className="cc-why-grid">
                      <section><small>EVIDENCE</small>{ev.evidence.length ? <ul>{ev.evidence.map(item => <li key={item}>{item}</li>)}</ul> : <p>No evidence recorded.</p>}</section>
                      <section><small>ISSUES</small>{ev.issues.length ? <ul>{ev.issues.map(item => <li key={item}>{item}</li>)}</ul> : <p className="good">No issues flagged in this pass.</p>}</section>
                      <section><small>RECOMMENDATIONS</small>{ev.recommendations.length ? <ul>{ev.recommendations.map(item => <li key={item}>{item}</li>)}</ul> : <p>None — protect what already works.</p>}</section>
                    </div>
                  </details>
                  {mode === "selection" && (locked ? <div className="cc-locked">✓ DIRECTION LOCKED</div> : <button className="cc-lock" onClick={() => onSelect(i)}>Lock this direction <span>→</span></button>)}
                </>
              )}
            </article>
          );
        })}
      </div>
      {scored && (
        <section className="loop-strip">
          <div className="loop-top">
            <strong>IMPROVEMENT LOOP</strong>
            <div className="loop-counts">
              <span className="keep">KEEP {keep}</span>
              <span className="revise">REVISE {revise}</span>
              <span className="reject">REJECT {reject}</span>
            </div>
          </div>
          <p>REVISE verdicts send their recommendations back into the Brand Battle for another critic pass — up to three passes. KEEP verdicts are ready to lock. {recs} recommendations are in the loop.</p>
          {pickEv && pickName && <p className="loop-pick">Your gut pick, {pickName}, came back {((pickEv.decision || "").toUpperCase() || "UNSCORED")}{pickEv.issues.length ? ` with ${pickEv.issues.length} issue${pickEv.issues.length > 1 ? "s" : ""} to review above.` : " with no issues flagged."}</p>}
        </section>
      )}
      {mode === "selection" && (
        <div className="cc-cta">
          <button className="primary-button" disabled={state.selected == null} onClick={onNext}>Continue to visual identity <span>→</span></button>
          <small>{state.selected == null ? "LOCK A DIRECTION ABOVE TO CONTINUE." : "SELECTION SAVED — NEXT UP IS VISUAL IDENTITY."}</small>
        </div>
      )}
    </div>
  );
}
function VisualStage({ state, onNext, onGenerate, live }: { state: State; onNext: () => void; onGenerate: () => void; live?: boolean }) { const visual = state.visual || (live ? undefined : localVisual(state)); if (!visual) return <div className="mvp-page"><p className="eyebrow">STAGE 06 / VISUAL IDENTITY</p><h1>Make the strategy<br /><em>visible.</em></h1><p className="lede">Select a direction first, then generate the visual system from the live backend.</p><button className="primary-button" onClick={onGenerate}>Generate the visual system <span>→</span></button></div>; return <div className="mvp-page wide"><p className="eyebrow">STAGE 06 / VISUAL IDENTITY</p><h1>Make the strategy<br /><em>visible.</em></h1><p className="lede">This visual system follows the selected {state.directions?.[state.selected ?? 1]?.strategic_territory} direction and the audience signal from Discovery.</p><div className="system-grid"><section className="system-card color-card"><small>COLOR PALETTE</small><div className="swatches large"><i /><i /><i /><i /></div><p>{visual.color_palette.join(" · ")}</p></section><section className="system-card"><small>TYPOGRAPHY</small>{visual.typography.map(item => <strong key={item}>{item}</strong>)}<small>COMPOSITION</small><p>{visual.composition}</p></section><section className="system-card"><small>IMAGERY + UI</small><p>{visual.imagery_style}</p><p>{visual.ui_direction}</p><small>SYMBOLS</small><p>{visual.symbols.join(" · ")}</p></section><section className="system-card avoid"><small>THINGS TO AVOID</small><p>{visual.things_to_avoid.join(" · ")}</p></section></div><button className="primary-button" onClick={onNext}>Shape the brand voice <span>→</span></button></div>; }
function VoiceStage({ state, onNext, onGenerate, live }: { state: State; onNext: () => void; onGenerate: () => void; live?: boolean }) { const voice = state.voice || (live ? undefined : localVoice(state)); if (!voice) return <div className="mvp-page"><p className="eyebrow">STAGE 07 / BRAND VOICE</p><h1>Sound like<br /><em>yourself.</em></h1><p className="lede">Generate the visual system first, then generate voice from the live backend.</p><button className="primary-button" onClick={onGenerate}>Generate brand voice <span>→</span></button></div>; return <div className="mvp-page wide"><p className="eyebrow">STAGE 07 / BRAND VOICE</p><h1>Sound like<br /><em>yourself.</em></h1><div className="voice-layout"><section className="voice-hero"><small>TONE</small><h2>{voice.tone}</h2><small>EXAMPLE HEADLINE</small><strong>{voice.example_headline}</strong><small>CTA</small><button className="text-button">{voice.example_cta} ↗</button></section><section className="system-card"><small>WRITING RULES</small>{voice.writing_rules.map(rule => <p className="rule" key={rule}>+ {rule}</p>)}<small>USE</small><div className="tags">{voice.words_to_use.map(word => <span key={word}>{word}</span>)}</div><small>AVOID</small><div className="tags avoid-tags">{voice.words_to_avoid.map(word => <span key={word}>{word}</span>)}</div></section></div><button className="primary-button" onClick={onNext}>Open Brand Guardian <span>→</span></button></div>; }
type GuardianVerdict = { key: "strong" | "revise" | "off"; icon: string; label: string };

function guardianVerdict(g: Guardian): GuardianVerdict {
  const text = (g.overall_evaluation || "").toLowerCase();
  const alignment = [g.audience_fit, g.positioning_alignment, g.personality_alignment, g.voice_alignment];
  const average = alignment.reduce((sum, value) => sum + value, 0) / alignment.length;
  const lowest = Math.min(...alignment);
  if (text.includes("reject") || text.includes("off-brand")) return { key: "off", icon: "✕", label: "Off-brand" };
  if (text.includes("revise") || text.includes("needs revision")) return { key: "revise", icon: "⚠", label: "Needs revision" };
  if (lowest <= 3 && g.genericity_risk >= 7) return { key: "off", icon: "✕", label: "Off-brand" };
  if (lowest <= 5 || g.genericity_risk >= 7) return { key: "revise", icon: "⚠", label: "Needs revision" };
  if (text.includes("keep") || average >= 7) return { key: "strong", icon: "✓", label: "Strong alignment" };
  return { key: "revise", icon: "⚠", label: "Needs revision" };
}

function guardianTone(value: number, invert?: boolean): string {
  const score = invert ? 10 - value : value;
  return score >= 7 ? "high" : score >= 4 ? "mid" : "low";
}

function guardianBarWidth(value: number, invert?: boolean): number {
  return Math.min(100, (invert ? 10 - value : value) * 10);
}

function GuardianShield() {
  return (
    <svg className="gt-shield" viewBox="0 0 64 74" aria-hidden="true">
      <path d="M32 3 L59 13 V35 C59 53 47 65 32 71 C17 65 5 53 5 35 V13 Z" />
      <path className="gt-shield-check" d="M20 37 l9 9 l16 -18" />
    </svg>
  );
}
function GuardianStage({ state, busy, error, onCheck, onContinue }: { state: State; busy: boolean; error: string; onCheck: (content: string) => void; onContinue: () => void }) {
  const [content, setContent] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [ready, setReady] = useState(false);
  const guardian = state.guardian;
  const verdict = guardian ? guardianVerdict(guardian) : null;
  const checkedContent = guardian?.content || content;
  const improved = guardian && guardian.improved_version && guardian.improved_version !== checkedContent ? guardian.improved_version : "";
  const failed = !busy && attempted && !!error;
  const signals: Array<{ label: string; value: number; invert?: boolean }> = guardian ? [
    { label: "Audience fit", value: guardian.audience_fit },
    { label: "Positioning alignment", value: guardian.positioning_alignment },
    { label: "Personality alignment", value: guardian.personality_alignment },
    { label: "Voice alignment", value: guardian.voice_alignment },
    { label: "Genericity risk", value: guardian.genericity_risk, invert: true }
  ] : [];
  const checks: Array<{ label: string; value: string }> = [
    { label: "Audience fit", value: state.positioning?.target_audience || state.audience || "Your defined audience" },
    { label: "Positioning alignment", value: state.positioning?.positioning_statement || state.positioning?.category || "Your positioning statement" },
    { label: "Personality alignment", value: state.personality?.traits?.join(" · ") || "Your personality traits" },
    { label: "Voice alignment", value: state.voice?.tone || state.voice?.writing_rules?.[0] || "Your brand tone" },
    { label: "Genericity risk", value: state.voice?.words_to_avoid?.length ? `Words to avoid: ${state.voice.words_to_avoid.slice(0, 4).join(", ")}` : "Your words-to-avoid list" }
  ];
  const chain = ["Content", "Guardian", "Evaluation", "Issues", "Recommendations", "Revision", "Re-check"];
  const startCheck = (value: string) => { setAttempted(true); setReady(false); onCheck(value); };
  const focusInput = () => {
    const el = document.getElementById("gt-content");
    if (el instanceof HTMLTextAreaElement) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
  };
  return (
    <div className="mvp-page wide">
      <div className="gt-head">
        <div>
          <p className="eyebrow">STAGE 08 / QUALITY GATE</p>
          <h1>Brand <em>Guardian.</em></h1>
          <p className="lede">Before you ship, let AI check whether the content still belongs to your brand.</p>
          <p className="gt-sub">The Guardian compares new content against your approved positioning, personality, visual direction, and voice.</p>
        </div>
        <GuardianShield />
      </div>

      <div className="gt-grid">
        <section className="gt-panel gt-input">
          <small>CONTENT TO CHECK</small>
          <textarea id="gt-content" value={content} onChange={event => setContent(event.target.value)} placeholder="Paste a headline, social post, product description, campaign idea, or other brand content..." />
          <div className="gt-run">
            <button className="primary-button" disabled={busy || !content.trim()} onClick={() => startCheck(content)}>Check with Brand Guardian <span>→</span></button>
            <small className="gt-run-hint">{busy ? "Checking against the brand system..." : "One check runs against your full brand system."}</small>
          </div>
        </section>
        <section className="gt-panel gt-checks">
          <small>CHECKS AGAINST</small>
          <ul>
            {checks.map(item => (
              <li key={item.label}><b>{item.label}</b><span>{item.value}</span></li>
            ))}
          </ul>
        </section>
      </div>

      <section className="gt-panel gt-stage">
        {busy && (
          <div className="gt-state loading">
            <GuardianShield />
            <strong>Guardian is checking your content...</strong>
            <p>Comparing the text against your approved brand system.</p>
          </div>
        )}
        {failed && (
          <div className="gt-state error">
            <span className="gt-state-icon">✕</span>
            <strong>Guardian check failed</strong>
            <p>{error}</p>
            <button className="gt-ghost" onClick={() => startCheck(content)}>Retry the check</button>
          </div>
        )}
        {!busy && !guardian && !failed && (
          <div className="gt-state">
            <GuardianShield />
            <strong>Your content hasn&apos;t been checked yet.</strong>
            <p>Paste brand content above and run the Guardian to see the verdict, signals, and suggested fixes.</p>
          </div>
        )}
        {!busy && guardian && verdict && (
          <div className={`gt-verdict ${verdict.key}`}>
                        <div className="gt-vhead">
              <span className={`gt-vbadge ${verdict.key}`}>{verdict.icon}</span>
              <div>
                <small>GUARDIAN VERDICT</small>
                <h2>{verdict.label}</h2>
              </div>
            </div>
            {guardian.overall_evaluation && <p className="gt-eval">{guardian.overall_evaluation}</p>}

            <div className="gt-signals">
              <small>AI EVALUATION SIGNALS</small>
              {signals.map(signal => (
                <div className="gt-signal" key={signal.label}>
                  <span className="gt-signal-name">{signal.label}{signal.invert && <i>lower is better</i>}</span>
                  <span className={`gt-bar tone-${guardianTone(signal.value, signal.invert)}`}><i style={{ width: `${guardianBarWidth(signal.value, signal.invert)}%` }} /></span>
                  <b>{signal.value}<small>/10</small></b>
                </div>
              ))}
              <p className="gt-disclaimer">AI evaluation signals — not scientific measurements</p>
            </div>

            <div className="gt-two">
              <div className="gt-block">
                <small>NEEDS ATTENTION</small>
                {guardian.problems.length
                  ? <ul>{guardian.problems.map((problem, index) => <li key={`${index}-${problem}`}>{problem}</li>)}</ul>
                  : <p className="gt-none">No major issues detected.</p>}
              </div>
              <div className="gt-block">
                <small>RECOMMENDED IMPROVEMENTS</small>
                {guardian.recommendations.length
                  ? <ul>{guardian.recommendations.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul>
                  : <p className="gt-none">No further recommendations for this content.</p>}
              </div>
            </div>

            {improved && (
              <div className="gt-diff">
                <div className="gt-diff-col before"><small>BEFORE</small><p>{checkedContent}</p></div>
                <span className="gt-diff-arrow" aria-hidden="true">→</span>
                <div className="gt-diff-col after"><small>AFTER</small><p>{improved}</p></div>
              </div>
            )}

            {(guardian.explanation || guardian.problems.length > 0 || guardian.recommendations.length > 0) && (
              <details className="gt-why">
                <summary>Why this result?</summary>
                <div className="gt-why-body">
                  {guardian.explanation && <p>{guardian.explanation}</p>}
                  {guardian.problems.length > 0 && (
                    <div><small>ISSUES</small><ul>{guardian.problems.map((problem, index) => <li key={`${index}-${problem}`}>{problem}</li>)}</ul></div>
                  )}
                  {guardian.recommendations.length > 0 && (
                    <div><small>RECOMMENDATIONS</small><ul>{guardian.recommendations.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></div>
                  )}
                  <p className="gt-why-note">Built only from the Guardian&apos;s structured evaluation fields — no hidden reasoning is revealed.</p>
                </div>
              </details>
            )}

            <div className="gt-loop">
              <div className="gt-loop-chain">
                {chain.map((step, index) => (
                  <span className="gt-step" key={step}>{step}{index < chain.length - 1 && <i>→</i>}</span>
                ))}
              </div>
              <div className="gt-loop-actions">
                {verdict.key === "strong" ? (
                  <button className={`gt-ghost${ready ? " ready" : ""}`} onClick={() => setReady(true)}>{ready ? "✓ Looks ready" : "Looks ready"}</button>
                ) : (
                  <button className="gt-ghost" onClick={focusInput}>Revise and check again</button>
                )}
                <button className="primary-button" onClick={onContinue}>Continue to Launch <span>→</span></button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
function LaunchStage({ state, onNext, onGenerate, live }: { state: State; onNext: () => void; onGenerate: () => void; live?: boolean }) { const launch = state.launch || (live ? undefined : localLaunch(state)); if (!launch) return <div className="mvp-page"><p className="eyebrow">STAGE 09 / LAUNCH CONTENT</p><h1>Ready to<br /><em>ship the signal.</em></h1><p className="lede">Run Guardian first, then generate launch content from the live backend.</p><button className="primary-button" onClick={onGenerate}>Generate launch content <span>→</span></button></div>; return <div className="mvp-page wide"><p className="eyebrow">STAGE 09 / LAUNCH CONTENT</p><h1>Ready to<br /><em>ship the signal.</em></h1><div className="launch-grid"><section className="launch-feature"><small>LANDING PAGE HEADLINE</small><h2>{launch.headline}</h2><p>{launch.subheadline}</p><button className="primary-button" onClick={onNext}>Open final Brand Kit <span>→</span></button></section><section className="system-card"><small>ONE-LINE PITCH</small><strong>{launch.one_line_pitch}</strong><small>PRODUCT DESCRIPTION</small><p>{launch.product_description}</p><small>SOCIAL POST</small><p>{launch.social_post}</p><small>CTA</small><strong>{launch.cta}</strong></section></div></div>; }
function Workflow({ state, stage, busy, error, onNavigate }: { state: State; stage: Stage; busy: boolean; error: string; onNavigate: (stage: Stage) => void }) { const [open, setOpen] = useState<Stage | null>(null); const has: Record<string, boolean> = { discovery: !!(state.audience || state.problem || state.positioning), positioning: !!state.positioning, personality: !!((state.personality?.traits?.length) || 0), battle: (state.directions?.length || 0) >= 3, critic: (state.evaluations?.length || 0) > 0, selection: state.selected != null && !!state.final, visual: !!state.visual, voice: !!state.voice, guardian: !!state.guardian, launch: !!state.launch, kit: !!(state.final && state.launch) }; const short = (v?: string, n?: number) => { const text = v || "—"; const max = n || 90; return text.length > max ? `${text.slice(0, max)}…` : text; }; const dirs = (state.directions || []).map(d => d.direction_name).join(" · ") || "Awaiting Brand Battle"; const crit = (state.evaluations || []).map((e, i) => `${state.directions?.[i]?.direction_name || `Direction ${i + 1}`}: ${e.decision}`).join(" · ") || "Awaiting Critic"; const meta: Array<{ key: Stage; label: string; agent: string; purpose: string; input: string; output: string; decision: string }> = [{ key: "discovery", label: "Discovery", agent: "Discovery Agent", purpose: "Ask the smallest set of high-value questions that change the brand strategy.", input: `Project idea: ${short(state.idea, 110)}`, output: state.audience || state.problem ? `${state.audience || "—"} · ${short(state.problem, 80)}` : "Awaiting answers", decision: "Audience and problem locked for positioning." }, { key: "positioning", label: "Positioning", agent: "Positioning Agent", purpose: "Convert discovery into a focused category, audience, problem and value proposition.", input: "Discovery answers", output: short(state.positioning?.positioning_statement, 110), decision: "Strategic angle locked." }, { key: "personality", label: "Personality", agent: "Personality Agent", purpose: "Derive traits, principles and traits-to-avoid from audience and positioning.", input: "Positioning", output: state.personality?.traits.join(" · ") || "—", decision: "Brand behavior locked." }, { key: "battle", label: "Brand Battle", agent: "Naming Agent", purpose: "Generate three strategically distinct territories with naming styles and candidates.", input: "Positioning + Personality", output: dirs, decision: "User selects one direction." }, { key: "critic", label: "Critic", agent: "Anti-Generic Critic", purpose: "Score each direction on audience fit, distinctiveness, clarity and genericity risk.", input: "Three directions", output: crit, decision: "KEEP / REVISE per direction." }, { key: "selection", label: "Selection", agent: "Director", purpose: "Commit one direction as the foundation for the brand system.", input: "Critic scores", output: state.directions?.[state.selected ?? -1]?.direction_name || "—", decision: "Foundation for visual and voice." }, { key: "visual", label: "Visual Identity", agent: "Visual Identity Agent", purpose: "Translate the selected direction into palette, typography and composition.", input: "Selected direction", output: state.visual ? `${state.visual.color_palette.slice(0, 2).join(" · ")} · ${state.visual.typography[0] || ""}` : "—", decision: "Visual system locked." }, { key: "voice", label: "Brand Voice", agent: "Brand Voice Agent", purpose: "Make messages sound consistent with rules, vocabulary and examples.", input: "Personality + Positioning", output: short(state.voice?.tone, 80), decision: "Voice locked." }, { key: "guardian", label: "Guardian", agent: "Brand Guardian Agent", purpose: "Check future content against the established brand system.", input: "Final brand state + new content", output: short(state.guardian?.overall_evaluation, 110), decision: "Keep or revise with an improved version." }, { key: "launch", label: "Launch", agent: "Launch Content Agent", purpose: "Create launch-ready headline, pitch, social post and CTA.", input: "Voice + Positioning", output: short(state.launch?.headline, 80), decision: "Launch copy ready." }, { key: "kit", label: "Brand Kit", agent: "Brand Kit", purpose: "Deliver the coherent system built from all prior stages.", input: "All prior stages", output: state.final ? `${state.final.name} · ${short(state.final.tagline, 60)}` : "—", decision: "Shareable final kit." }]; const statusOf = (key: string): string => { if (error && stage === key) return "Error"; if (has[key]) return "Complete"; if (stage === key) return busy ? "Running" : "Current"; return "Upcoming"; }; const icon: Record<string, string> = { Complete: "✓", Running: "→", Current: "→", Upcoming: "○", Error: "⚠" }; const done = Object.values(has).filter(Boolean).length; const pct = Math.round((done / meta.length) * 100); return <div className="mvp-page wide"><p className="eyebrow">WORKFLOW / DECISION TRACE</p><h1>Every stage leaves<br /><em>a trace.</em></h1><p className="lede">A staged AI system, not a single prompt. {done} of {meta.length} stages complete. Select a stage to inspect its agent, inputs, outputs and decision.</p><div className="wf-progress" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div><p className="wf-progress-label">{pct}% COMPLETE</p><div className="wf-steps">{meta.map((m, index) => { const s = statusOf(m.key); const cls = s.toLowerCase(); const isOpen = open === m.key; const next = meta[index + 1]; return <div key={m.key} className={`wf-step ${cls}`}><button className="wf-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : m.key)}><span className="wf-index">{String(index + 1).padStart(2, "0")}</span><span className="wf-titles"><strong>{m.label}</strong><small>{m.agent} · {s === "Complete" ? short(m.output, 64) : s === "Error" ? "Needs attention — prior work preserved" : s === "Current" || s === "Running" ? "In progress" : `Waiting on ${meta[index - 1]?.label || "Idea"}`}</small></span><span className={`wf-badge ${cls}`}><i>{icon[s]}</i>{s.toUpperCase()}</span></button>{isOpen && <div className="wf-detail"><div><small>PURPOSE</small><p>{m.purpose}</p></div><div><small>INPUT</small><p>{m.input}</p></div><div><small>OUTPUT</small><p>{m.output}</p></div><div><small>DECISION</small><p>{m.decision}</p></div><button className="text-button" onClick={() => onNavigate(m.key)}>Open {m.label} stage ↗</button></div>}{next && <div className="wf-chain" aria-hidden="true"><span>↓</span><span>{next.label.toUpperCase()} RECEIVES THIS OUTPUT</span></div>}</div>; })}</div></div>; }
function Kit({ state, selected, live }: { state: State; selected?: Direction; live?: boolean }) { const visual = state.visual || (live ? undefined : localVisual(state)); const voice = state.voice || (live ? undefined : localVoice(state)); const launch = state.launch || (live ? undefined : localLaunch(state)); const guardian = state.guardian; if (!visual || !voice || !launch) return <div className="mvp-page"><p className="eyebrow">STAGE 10 / FINAL BRAND KIT</p><h1>Incomplete<br /><em>system.</em></h1><p className="lede">Generate visual, voice, guardian, and launch from the live backend before opening the kit.</p></div>; return <div className="mvp-page wide"><p className="eyebrow">STAGE 10 / FINAL BRAND KIT</p><h1>{state.final?.name || selected?.sample_names[0]}</h1><p className="lede">A coherent system built from your discovery, strategy, selected direction, visual identity, voice, and launch content.</p><button type="button" className="primary-button kit-export-button" onClick={() => window.print()}>Export Brand Kit <span>↗</span></button><div className="kit-hero"><small>TAGLINE</small><h2>{state.final?.tagline || selected?.tagline_direction}</h2><p>{state.final?.pitch}</p></div><div className="kit-columns"><section><small>STRATEGY</small><h3>{state.positioning?.value_proposition}</h3><p>{state.positioning?.positioning_statement}</p></section><section><small>PERSONALITY</small><div className="tags">{state.personality?.traits.map(t => <span key={t}>{t}</span>)}</div><p>Principles: {state.personality?.principles.join(" � ")}</p></section><section><small>VISUAL IDENTITY</small><div className="swatches"><i /><i /><i /><i /></div><p>{visual.ui_direction}</p></section><section><small>VOICE</small><h3>{voice.tone}</h3><p>{voice.writing_rules.join(" � ")}</p></section><section><small>LAUNCH</small><h3>{launch.headline}</h3><p>{launch.subheadline}</p><button className="text-button" onClick={() => navigator.clipboard?.writeText(launch.headline)}>Copy headline ?</button></section><section><small>QUALITY CHECK</small>{guardian ? <><h3>Audience fit {guardian.audience_fit} / 10</h3><p>Positioning {guardian.positioning_alignment} / 10 � Personality {guardian.personality_alignment} / 10 � Voice {guardian.voice_alignment} / 10 � Genericity risk {guardian.genericity_risk} / 10 � from your Brand Guardian check</p></> : live ? <><h3>Awaiting Brand Guardian</h3><p>Run the Guardian check to fill this panel with real evaluation signals.</p></> : <><h3>Audience fit 9 / 10</h3><p>Distinctive 8 / 10 � Clarity 8 / 10 � Consistency 8 / 10 � Genericity risk 2 / 10</p></>}</section></div></div>; }

