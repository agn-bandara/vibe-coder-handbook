/* ---------- RENDER ---------- */
const TABS=[
{id:"patterns",label:"Design Patterns"},
{id:"principles",label:"Principles"},
{id:"testing",label:"Testing & CI/CD"},
{id:"security",label:"Security"},
{id:"compliance",label:"Compliance"},
{id:"stack",label:"Tech Stack"},
{id:"sdlc",label:"SDLC"}
];
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let current="patterns", filters={};
function hl(text,q){const e=esc(text);if(!q)return e;const re=new RegExp("("+q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","ig");return e.replace(re,"<mark>$1</mark>")}

function card(e,q){
  const lv=e.lv?`<span class="lv" title="Level it operates at">${LEVELS[e.lv]}</span>`:"";
  const rows=[];
  if(e.p) rows.push(`<div class="row say"><span class="ic">S</span><div><span class="k">Say this to the AI</span><span class="txt">${hl(e.p,q)}</span><br><button class="copy" type="button" data-copy="${esc(e.p)}">Copy prompt</button></div></div>`);
  if(e.r) rows.push(`<div class="row flag"><span class="ic">!</span><div><span class="k">Red flag in AI output</span>${hl(e.r,q)}</div></div>`);
  if(e.x) rows.push(`<div class="row skip"><span class="ic">×</span><div><span class="k">When not to use</span>${hl(e.x,q)}</div></div>`);
  if(e.t) rows.push(`<div class="row tools"><span class="ic">T</span><div><span class="k">Tools</span>${hl(e.t,q)}</div></div>`);
  return `<article class="card"><div class="hd"><div><h3>${hl(e.n,q)}</h3><div class="sub">${esc(e.c)}</div></div>${lv}</div>
  <div class="bd"><p>${hl(e.w,q)}</p>${e.a?`<p class="an">${hl(e.a,q)}</p>`:""}${rows.join("")}${exampleBlock(e.n)}</div></article>`;
}

/* ---------- CODE EXAMPLES ---------- */
const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,"");
const EX=new Map(Object.entries(typeof EXAMPLES==="object"?EXAMPLES:{}).map(([k,v])=>[norm(k),v]));
function colorCode(code,lang){
  const mark=lang==="py"?"#":"//";
  return code.split("\n").map(line=>{
    const i=line.indexOf(mark);
    const isComment=i>=0&&(line.slice(0,i).trim()===""||/\s{2,}$/.test(line.slice(0,i)));
    return isComment?esc(line.slice(0,i))+`<span class="cm">${esc(line.slice(i))}</span>`:esc(line);
  }).join("\n");
}
function exampleBlock(name){
  const ex=EX.get(norm(name));
  if(!ex)return "";
  return `<button type="button" class="ex-open" data-ex="${esc(name)}"><span class="ex-ic">&lt;/&gt;</span>Code example<span class="ex-langs">Python · JavaScript</span></button>`;
}
function openExample(name){
  const ex=EX.get(norm(name)), dlg=$("#exDialog");
  if(!ex||!dlg)return;
  const langs=[["py","Python"],["js","JavaScript"]].filter(([k])=>ex[k]);
  const entry=[...PATTERNS,...PRINCIPLES,...TESTING,...SECURITY].find(e=>norm(e.n)===norm(name));
  $("#exTitle").textContent=name;
  $("#exSub").textContent=entry?entry.c+(entry.lv?" · "+LEVELS[entry.lv]:""):"";
  $("#exLangs").innerHTML=langs.map(([k,l])=>`<button type="button" class="ex-lang" data-lang="${k}">${l}</button>`).join("");
  $("#exBody").innerHTML=langs.map(([k])=>`<pre class="code ${k}"><code>${colorCode(ex[k],k)}</code></pre>`).join("");
  $("#exCopy").textContent="Copy";
  if(typeof dlg.showModal==="function")dlg.showModal();else dlg.setAttribute("open","");
}
function setLang(l){document.documentElement.dataset.codeLang=l;try{localStorage.setItem("codeLang",l)}catch(e){}}
try{setLang(localStorage.getItem("codeLang")||"py")}catch(e){setLang("py")}
function chipBar(id,list){
  const cats=["All",...new Set(list.map(e=>e.c))];
  const f=filters[id]||"All";
  return `<div class="chips" data-for="${id}">${cats.map(c=>`<button class="chip" type="button" aria-pressed="${c===f}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>`;
}
function filtered(id,list){const f=filters[id]||"All";return f==="All"?list:list.filter(e=>e.c===f)}
const legend=`<div class="legend"><span><i style="background:var(--go)"></i>Say this to the AI</span><span><i style="background:var(--warn)"></i>Red flag in AI output</span><span><i style="background:var(--hold)"></i>When not to use</span><span><i style="background:var(--cobalt)"></i>Tools</span></div>`;
const ladder=`<div class="panel"><h3>The level it operates at</h3><div class="ladder">
${Object.entries({1:["Code","a line, a function"],2:["Module","a class, a file"],3:["Feature","a component, a service"],4:["System","architecture, many services"],5:["Process","team, release, lifecycle"]}).map(([k,v])=>`<div class="rung"><b>L${k}</b><span>${v[0]} <em>· ${v[1]}</em></span></div>`).join("")}
</div><p class="label" style="margin-top:10px">You work at L2–L5. The AI handles L1 syntax.</p></div>`;

function viewPatterns(){
  return `<div class="intro"><div><span class="label">Sheet 01</span><h2>Design Patterns</h2>
  <p class="lede">Proven shapes for recurring problems. You don’t need the syntax; you need the name. Naming a pattern in a prompt gives the AI a precise blueprint instead of letting it improvise.</p>
  <p>Includes all 23 classic ‘Gang of Four’ patterns plus the architectural, resilience and AI-era patterns used in modern systems.</p></div>${ladder}</div>
  ${legend}${chipBar("patterns",PATTERNS)}<span class="count">${filtered("patterns",PATTERNS).length} patterns</span>
  <div class="grid">${filtered("patterns",PATTERNS).map(e=>card(e)).join("")}</div>`;
}
function viewPrinciples(){
  return `<div class="intro"><div><span class="label">Sheet 02</span><h2>Design Principles</h2>
  <p class="lede">Patterns are solutions; principles are the rules you judge any solution by. Use them as review questions on every piece of AI-generated code.</p>
  <p>Fastest win: after the AI writes something, ask it to review its own output against SOLID, DRY, KISS and YAGNI and list violations.</p></div>
  <div class="panel"><h3>One review prompt</h3><p class="row say" style="margin:0"><span class="ic">S</span><span class="txt" style="font-family:var(--f-mono);font-size:12.5px">Review this change against SOLID, DRY, KISS, YAGNI and separation of concerns. List each violation with file, line, why it matters, and a fix. Don’t rewrite unrelated code.</span></p></div></div>
  ${legend}${chipBar("principles",PRINCIPLES)}<span class="count">${filtered("principles",PRINCIPLES).length} principles</span>
  <div class="grid">${filtered("principles",PRINCIPLES).map(e=>card(e)).join("")}</div>`;
}
function viewTesting(){
  const stages=[["Commit","Pre-commit","Format, lint, secret scan"],["Build","CI","Install, compile, type-check"],["Test","CI","Unit + integration, coverage"],["Scan","CI","Dependencies, SAST, SBOM"],["Package","CI","Docker image / installer, signed"],["Staging","CD","Auto-deploy, E2E + smoke tests"],["Approve","Gate","Human sign-off (or auto if green)"],["Production","CD","Canary / flag, monitor, rollback ready"]];
  return `<div class="intro"><div><span class="label">Sheet 03</span><h2>Testing, QA &amp; CI/CD</h2>
  <p class="lede">Tests are how you know the AI built what you asked for. Without them, every change is a gamble.</p>
  <p>The core rule for vibe coders: write the expected behaviour first (acceptance criteria), then let the AI build to it, then let CI prove it on every change.</p></div>
  <div class="panel"><h3>Minimum viable QA</h3><p style="margin:0;font-size:13.5px">1. Acceptance criteria for every feature.<br>2. Unit tests on all calculations.<br>3. E2E tests on 3–5 critical journeys.<br>4. CI blocks merge on any failure.<br>5. Error tracking in production.</p></div></div>
  <div><span class="label">A standard CI/CD pipeline, left to right</span><div class="pipe" style="margin-top:8px">${stages.map((s,i)=>`<div class="stage${s[1]==="Gate"?" gate":""}"><span class="label">${String(i+1).padStart(2,"0")} · ${s[1]}</span><strong>${s[0]}</strong>${s[2]}</div>`).join("")}</div></div>
  ${legend}${chipBar("testing",TESTING)}<span class="count">${filtered("testing",TESTING).length} entries</span>
  <div class="grid">${filtered("testing",TESTING).map(e=>card(e)).join("")}</div>`;
}
function viewSecurity(){
  return `<div class="intro"><div><span class="label">Sheet 04</span><h2>Security</h2>
  <p class="lede">AI-generated code fails most often here, because insecure code still works in a demo. Security bugs only show up when someone attacks.</p>
  <p>Built on the OWASP Top 10 (2025 edition) for web apps, plus the OWASP list of risks specific to LLM features.</p></div>
  <div class="warnbox"><b>Never let the AI:</b> put API keys in frontend code · build SQL from strings · write its own login or crypto · install packages you haven’t verified · give an AI agent write access without an approval step.</div></div>
  ${legend}${chipBar("security",SECURITY)}<span class="count">${filtered("security",SECURITY).length} entries</span>
  <div class="grid">${filtered("security",SECURITY).map(e=>card(e)).join("")}</div>`;
}
function viewCompliance(){
  const list=filtered("compliance",COMPLIANCE);
  return `<div class="intro"><div><span class="label">Sheet 05</span><h2>Compliance</h2>
  <p class="lede">Compliance is decided by three things: <b>where</b> your users are, <b>what data</b> you handle, and <b>what could go wrong</b> if the software fails. Not by the language you code in.</p>
  <p>So: can a vibe coder build ATM software? The tiers below show how far the gap closes as stakes rise.</p></div>
  <div class="panel"><h3>Three questions to ask first</h3><p style="margin:0;font-size:13.5px">1. Whose personal data do I store, and where do they live?<br>2. Do I touch money, health, children, or safety?<br>3. Who sells or uses it, and in which market (EU, US, Sri Lanka…)?</p></div></div>
  <div><span class="label">How far these sheets close the gap, by risk tier</span>
  <div class="tiers" style="margin-top:8px">${TIERS.map(t=>`<div class="tier ${t.cls||""}"><div class="t">T${t.t}</div><div><h3>${t.h}</h3><p>${t.e}</p><div class="bar" aria-label="Gap closable: about ${t.pct}%"><i style="width:${t.pct}%"></i></div></div><div class="gap">${t.g}</div></div>`).join("")}</div></div>
  ${chipBar("compliance",COMPLIANCE)}<span class="count">${list.length} regimes</span>
  <div class="scroll"><table><thead><tr><th>Standard / law</th><th>Domain</th><th>Region</th><th>Applies to</th><th>What it asks of software</th></tr></thead>
  <tbody>${list.map(e=>`<tr><td>${esc(e.n)}</td><td>${esc(e.c)}</td><td>${esc(e.reg)}</td><td>${esc(e.ap)}</td><td>${esc(e.ask)}</td></tr>`).join("")}</tbody></table></div>`;
}
let stackPick="web";
function viewStack(){
  const s=STACKS[stackPick];
  return `<div class="intro"><div><span class="label">Sheet 06</span><h2>Tech Stack Selector</h2>
  <p class="lede">Pick what you’re building to see a sensible default stack, layer by layer. Then use the feature table to pick libraries.</p></div>
  <div class="okbox"><b>Selection rules.</b> Choose boring, popular tools: the AI has seen far more examples of them, so it writes better code. One language where you can. Managed services over self-hosting. Only add a technology when you can name the problem it solves.</div></div>
  <div><span class="label">1 · What are you building?</span><div class="picker" style="margin-top:8px">${Object.entries(STACKS).map(([k,v])=>`<button class="pick" type="button" data-stack="${k}" aria-pressed="${k===stackPick}"><strong>${v.h}</strong><small>${v.d}</small></button>`).join("")}</div></div>
  <div><span class="label">2 · Recommended stack: ${esc(s.h)}</span><div class="stack" style="margin-top:8px">${s.L.map(l=>`<div class="layer"><span class="label">${esc(l[0])}</span><div class="pickname">${esc(l[1])}</div>${l[2]?`<p>${esc(l[2])}</p>`:""}</div>`).join("")}</div></div>
  <div class="row say"><span class="ic">S</span><div><span class="k">Say this to the AI</span><span class="txt">Use this stack: ${esc(s.L.map(l=>l[1]).join("; "))}. Don’t add other frameworks or services without asking me and explaining why.</span></div></div>
  <div><span class="label">3 · Feature → library</span><div class="scroll" style="margin-top:8px"><table><thead><tr><th>Feature</th><th>Common choices</th><th>Note</th></tr></thead><tbody>${FEATURES.map(f=>`<tr><td>${esc(f[0])}</td><td>${esc(f[1])}</td><td>${esc(f[2])}</td></tr>`).join("")}</tbody></table></div></div>`;
}
function viewSdlc(){
  return `<div class="intro"><div><span class="label">Sheet 07</span><h2>SDLC</h2>
  <p class="lede">The Software Development Lifecycle is the route from idea to retirement. Every model runs the same phases; they differ in how often they loop.</p>
  <p><b>Currently accepted practice:</b> Agile delivery (Scrum or Kanban) with DevOps/DevSecOps automation: short iterations, CI/CD, monitoring. Regulated and safety-critical work keeps V-model traceability, often run inside agile iterations.</p></div>
  <div class="okbox"><b>For a solo vibe coder:</b> Kanban + DevSecOps. Write the spec files, keep 1–2 tasks in progress, let CI guard every merge, ship small.</div></div>
  <div><span class="label">The phases, in order, and the file that proves each one</span><div class="phases" style="margin-top:8px">${PHASES.map((p,i)=>`<div class="phase"><span class="label">Phase ${i+1}</span><strong>${p[0]}</strong><p>${p[1]}</p><p><code>${esc(p[2])}</code></p></div>`).join("")}</div></div>
  <div class="row say"><span class="ic">S</span><div><span class="k">Say this to the AI at the start of a project</span><span class="txt">Before writing code, draft PRODUCT.md (problem, users, non-goals), REQUIREMENTS.md (user stories with Given/When/Then), and ARCHITECTURE.md (components, data model, risks). Wait for my approval.</span></div></div>
  ${chipBar("sdlc",SDLC)}
  <div class="scroll"><table><thead><tr><th>Model</th><th>Type</th><th>How it works</th><th>Good for</th><th>Poor fit</th><th>For vibe coders</th></tr></thead><tbody>${filtered("sdlc",SDLC).map(e=>`<tr><td>${esc(e.n)}</td><td>${esc(e.c)}</td><td>${esc(e.w)}</td><td>${esc(e.ok)}</td><td>${esc(e.bad)}</td><td>${esc(e.vc)}</td></tr>`).join("")}</tbody></table></div>`;
}
const VIEWS={patterns:viewPatterns,principles:viewPrinciples,testing:viewTesting,security:viewSecurity,compliance:viewCompliance,stack:viewStack,sdlc:viewSdlc};

/* ---------- SEARCH ---------- */
function searchAll(q){
  const ql=q.toLowerCase(), m=e=>Object.values(e).some(v=>typeof v==="string"&&v.toLowerCase().includes(ql));
  const groups=[["Design Patterns",PATTERNS.filter(m),"card"],["Principles",PRINCIPLES.filter(m),"card"],["Testing & CI/CD",TESTING.filter(m),"card"],["Security",SECURITY.filter(m),"card"],
    ["Compliance",COMPLIANCE.filter(m).map(e=>({n:e.n,c:e.c+" · "+e.reg,w:e.ap+" "+e.ask})),"card"],
    ["SDLC",SDLC.filter(m).map(e=>({n:e.n,c:e.c,w:e.w+" For vibe coders: "+e.vc})),"card"],
    ["Feature libraries",FEATURES.filter(f=>f.join(" ").toLowerCase().includes(ql)).map(f=>({n:f[0],c:"Tech stack",w:f[1]+(f[2]?". "+f[2]:"")})),"card"]].filter(g=>g[1].length);
  const total=groups.reduce((a,g)=>a+g[1].length,0);
  if(!total) return `<div class="empty">No entries match “${esc(q)}”. Try a shorter word, like “auth” or “test”.</div>`;
  return `<span class="count">${total} matches for “${esc(q)}”</span>`+groups.map(g=>`<div class="results"><h2>${g[0]}</h2><div class="grid">${g[1].map(e=>card(e,q)).join("")}</div></div>`).join("");
}

/* ---------- WIRING ---------- */
function renderTabs(){
  $("#tabs").innerHTML=TABS.map((t,i)=>`<button role="tab" type="button" id="tab-${t.id}" aria-selected="${t.id===current&&!$("#q").value}" data-tab="${t.id}"><span class="no">${String(i+1).padStart(2,"0")}</span>${t.label}</button>`).join("");
}
function render(){
  const q=$("#q").value.trim();
  $("#main").innerHTML=`<section class="sheet">${q?searchAll(q):VIEWS[current]()}</section>`;
  renderTabs();
}
document.addEventListener("click",ev=>{
  const tab=ev.target.closest("[data-tab]");
  if(tab){current=tab.dataset.tab;$("#q").value="";try{history.replaceState(null,"","#"+current)}catch(e){}render();window.scrollTo({top:0});return}
  const chip=ev.target.closest(".chip");
  if(chip){filters[chip.parentElement.dataset.for]=chip.dataset.cat;render();return}
  const st=ev.target.closest("[data-stack]");
  if(st){stackPick=st.dataset.stack;render();return}
  const lb=ev.target.closest(".ex-lang");
  if(lb){setLang(lb.dataset.lang);return}
  const eo=ev.target.closest(".ex-open");
  if(eo){openExample(eo.dataset.ex);return}
  if(ev.target.closest("#exClose")||ev.target.id==="exDialog"){$("#exDialog").close();return}
  const ec=ev.target.closest("#exCopy");
  if(ec){const box=$("#exBody");const lang=document.documentElement.dataset.codeLang;
    const pre=box.querySelector("pre.code."+lang)||box.querySelector("pre.code");
    const done=()=>{ec.textContent="Copied";setTimeout(()=>ec.textContent="Copy",1400)};
    const fallback=()=>{const r=document.createRange();r.selectNodeContents(pre);const s=getSelection();s.removeAllRanges();s.addRange(r);ec.textContent="Press Ctrl+C"};
    try{navigator.clipboard.writeText(pre.innerText).then(done,fallback)}catch(e){fallback()}
    return}
  const cp=ev.target.closest(".copy");
  if(cp){const txt=cp.dataset.copy;const done=()=>{cp.textContent="Copied";setTimeout(()=>cp.textContent="Copy prompt",1400)};
    try{navigator.clipboard.writeText(txt).then(done,()=>{selectText(cp)})}catch(e){selectText(cp)}}
});
function selectText(btn){const el=btn.previousElementSibling.previousElementSibling;const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);btn.textContent="Press Ctrl+C"}
let t;$("#q").addEventListener("input",()=>{clearTimeout(t);t=setTimeout(render,120)});
const h=(location.hash||"").slice(1);if(VIEWS[h])current=h;
render();
