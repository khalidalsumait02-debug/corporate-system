/* RM Workspace — client-side router + pages + in-session interactions.
   No build step, no backend. Mock data lives in data.js (window.DB). */
(function () {
  const DB = window.DB;
  const $ = (s, r=document) => r.querySelector(s);
  const fmt = DB.fmt;
  const ui = { openGroups:{}, accepted:{}, editing:{}, generated:{}, chat:[], chatBusy:false };

  /* ---------- icons ---------- */
  const P = {
    home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    chart:'<line x1="4" y1="20" x2="20" y2="20"/><rect x="6" y="12" width="3" height="6"/><rect x="11" y="8" width="3" height="10"/><rect x="16" y="5" width="3" height="13"/>',
    inbox:'<path d="M4 13h4l2 3h4l2-3h4"/><path d="M4 13l2-8h12l2 8v6H4z"/>',
    layers:'<path d="M12 3 3 8l9 5 9-5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
    spark:'<path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z"/>',
    search:'<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/>',
    bell:'<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    check:'<polyline points="20 6 9 17 4 12"/>',
    chev:'<polyline points="9 6 15 12 9 18"/>',
    x:'<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
    file:'<path d="M14 3H6v18h12V8z"/><path d="M14 3v5h5"/>',
    download:'<path d="M12 3v12"/><polyline points="7 11 12 16 17 11"/><path d="M5 20h14"/>',
    upload:'<path d="M12 16V4"/><polyline points="7 9 12 4 17 9"/><path d="M5 20h14"/>',
    alert:'<path d="M12 3 2 20h20z"/><line x1="12" y1="9" x2="12" y2="14"/><circle cx="12" cy="17.3" r="0.6" fill="currentColor"/>',
    refresh:'<path d="M21 12a9 9 0 1 1-2.6-6.3"/><polyline points="21 3 21 9 15 9"/>',
    edit:'<path d="M4 20h4L18 10l-4-4L4 16z"/>',
    plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    arrow:'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>',
    clock:'<circle cx="12" cy="12" r="8"/><polyline points="12 8 12 12 15 14"/>',
    users:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M16 6a3 3 0 0 1 0 6"/>',
    building:'<rect x="5" y="3" width="14" height="18" rx="1"/><line x1="9" y1="7" x2="9" y2="7.5"/><line x1="15" y1="7" x2="15" y2="7.5"/><line x1="9" y1="11" x2="9" y2="11.5"/><line x1="15" y1="11" x2="15" y2="11.5"/><path d="M10 21v-4h4v4"/>',
    send:'<path d="M4 12 20 4l-6 16-3-7z"/>',
    sliders:'<line x1="4" y1="8" x2="20" y2="8"/><circle cx="9" cy="8" r="2" fill="#fff"/><line x1="4" y1="16" x2="20" y2="16"/><circle cx="15" cy="16" r="2" fill="#fff"/>',
    money:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
  };
  const icon = (n, w) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${w?` width="${w}" height="${w}"`:''}>${P[n]||''}</svg>`;
  const spark = `<svg viewBox="0 0 24 24" fill="currentColor">${P.spark}</svg>`;

  /* ---------- small components ---------- */
  const aiBadge = (txt) => `<span class="ai-badge">${spark}${txt||'AI'}</span>`;
  const rag = (r) => `<span class="rag ${r}"></span>`;
  const ragWord = {red:"Action needed", amber:"Monitor", green:"On track"};
  const pill = (t,k) => `<span class="pill ${k}"><span class="d"></span>${t}</span>`;
  const initials = (c) => c.short;

  const statusPill = (s) => {
    const map = {"Submitted":"grey","In Progress":"blue","Pending Docs":"amber","Completed":"green",
      "Requested":"blue","Under Review":"amber","Cleared":"green","Rejected":"red"};
    return pill(s, map[s]||"grey");
  };
  const compState = {done:{r:"green",l:"Done"},review:{r:"amber",l:"In review"},progress:{r:"amber",l:"Drafting"},pending:{r:"red",l:"Pending"}};

  const aiBlock = (key, src, bodyHtml, opts={}) => {
    const acc = ui.accepted[key];
    return `<div class="ai-block" data-block="${key}">
      <div class="src">${spark} ${src}</div>
      <div class="body">${bodyHtml}</div>
      <div class="ctrl">
        ${acc ? `<span class="acc-flag">${icon('check',14)} Accepted by RM</span>`
              : `<button class="btn sm ai" data-act="accept" data-key="${key}">${icon('check',14)} Accept</button>`}
        <button class="btn sm" data-act="edit" data-key="${key}">${icon('edit',14)} Edit</button>
        <button class="btn sm" data-act="regen" data-key="${key}">${icon('refresh',14)} Regenerate</button>
        <span class="ai-tip">AI-drafted · RM reviews & approves</span>
      </div>
    </div>`;
  };

  /* ---------- nav + shell ---------- */
  const atRisk = DB.requests.filter(r=>r.atRisk && r.status!=="Completed").length;
  const NAV = [
    {g:"Workspace"},
    {id:"dashboard", label:"Daily Dashboard", icon:"home"},
    {id:"analytics", label:"Portfolio Analytics", icon:"chart"},
    {g:"Pipeline"},
    {id:"requests", label:"Request Tracker", icon:"inbox", badge:atRisk},
    {id:"cases", label:"Case Tracker", icon:"layers"},
    {id:"leads", label:"Leads", icon:"target"},
    {g:"Assist"},
    {id:"assistant", label:"RM Assistant", icon:"spark"},
  ];

  function shell() {
    const nav = NAV.map(n => n.g
      ? `<div class="grp">${n.g}</div>`
      : `<a href="#/${n.id}" data-nav="${n.id}">${icon(n.icon)}<span>${n.label}</span>${n.badge?`<span class="badge">${n.badge}</span>`:''}</a>`
    ).join("");
    document.body.innerHTML = `
    <div class="app">
      <aside class="sidebar">
        <div class="brand"><div class="logo">RM</div>
          <div><div class="bt">Meridian</div><div class="bs">RM Workspace</div></div></div>
        <nav class="nav">${nav}</nav>
        <div class="me"><div class="av">${DB.rm.initials}</div>
          <div><div class="mn">${DB.rm.name}</div><div class="mr">Relationship Manager</div></div></div>
      </aside>
      <div class="main">
        <div class="topbar">
          <div class="crumb" id="crumb"></div>
          <div class="search">
            ${icon('search')}
            <input id="gsearch" placeholder="Search clients, groups, CR numbers…" autocomplete="off"/>
            <div class="results" id="sresults"></div>
          </div>
          <button class="bell">${icon('bell')}<span class="dot"></span></button>
        </div>
        <div class="ribbon">${icon('alert',13)} <span>${DB.disclaimer}</span></div>
        <div id="view"></div>
      </div>
    </div>`;
    const inp = $("#gsearch");
    inp.addEventListener("input", onSearch);
    inp.addEventListener("focus", onSearch);
    document.addEventListener("click", (e)=>{ if(!e.target.closest(".search")) $("#sresults").classList.remove("open"); });
  }

  function onSearch(e){
    const q = $("#gsearch").value.trim().toLowerCase();
    const box = $("#sresults");
    if(!q){ box.classList.remove("open"); box.innerHTML=""; return; }
    const hits = DB.companies.filter(c =>
      c.name.toLowerCase().includes(q) || (c.group||"").toLowerCase().includes(q) || c.cr.toLowerCase().includes(q)
    ).slice(0,6);
    box.innerHTML = hits.length ? hits.map(c=>
      `<a href="#/company/${c.id}"><span class="rag ${c.rag}"></span><div><div class="tname">${c.name}</div>
       <div class="tsub">${c.group||"Standalone"} · ${c.cr}</div></div></a>`).join("")
      : `<div style="padding:14px 13px" class="faint">No matches</div>`;
    box.classList.add("open");
  }

  /* ---------- router ---------- */
  const routes = {
    dashboard: pageDashboard, analytics: pageAnalytics, requests: pageRequests,
    cases: pageCases, leads: pageLeads, assistant: pageAssistant,
    company: pageCompany, memo: pageMemo,
  };
  function parse(){
    const h = (location.hash||"#/dashboard").replace(/^#\//,"");
    const [name, param] = h.split("/");
    return { name: routes[name]?name:"dashboard", param };
  }
  function setCrumb(parts){ $("#crumb").innerHTML = parts.map((p,i)=> i===parts.length-1?`<b>${p}</b>`:p).join(" / "); }
  function setActive(name){ document.querySelectorAll("[data-nav]").forEach(a=>a.classList.toggle("active", a.dataset.nav===name)); }

  function render(){
    closeModal();
    const {name, param} = parse();
    setActive(name);
    const view = $("#view");
    view.innerHTML = `<div class="page fade-in">${routes[name](param)}</div>`;
    window.scrollTo(0,0);
    if(name==="assistant") mountAssistant();
  }

  /* ========== PAGE 1 — DASHBOARD ========== */
  function pageDashboard(){
    setCrumb(["Meridian","Daily Dashboard"]);
    const urgent = DB.companies.filter(c=>c.rag==="red").length;
    const openReq = DB.requests.filter(r=>r.status!=="Completed").length;
    const pendingMemo = DB.companies.filter(c=>["review","progress","pending"].includes(c.memo.dcr)).length;
    const portfolio = DB.companies.reduce((a,c)=>a+c.funded+c.nonfunded,0);

    const stats = `<div class="stats">
      ${statCard("Urgent attention", urgent, "clients flagged red", "alert","r")}
      ${statCard("Open requests", openReq, atRisk+" at risk of delay", "inbox","b")}
      ${statCard("Memos in progress", pendingMemo, "across your portfolio", "file","a")}
      ${statCard("Total exposure", fmt(portfolio), DB.companies.length+" clients · "+Object.keys(DB.groups).length+" groups", "money","g")}
    </div>`;

    const todos = DB.todos.map(t=>{
      const c = t.companyId?DB.byId[t.companyId]:null;
      return `<div class="row ${t.done?'done':''}" data-act="todo" data-id="${t.id}">
        <div class="chk ${t.done?'done':''}">${icon('check',12)}</div>
        <div class="tx"><div class="t">${t.text}</div><div class="m">${t.meta}</div></div>
        <span class="prio ${t.prio}">${t.prio}</span>
      </div>`;}).join("");

    const feed = DB.feed.map(n=>{
      const c = n.companyId?DB.byId[n.companyId]:null;
      return `<div class="news">
        <span class="dotc" style="background:var(--${n.rag==='red'?'red':n.rag==='amber'?'amber':'green'})"></span>
        <div style="flex:1">
          <div class="nt">${n.t}</div>
          <div class="ns">${spark2()} ${n.s}</div>
          <div class="nm">${c?`<a class="tag" href="#/company/${c.id}">${c.name}</a>`:`<span class="tag mkt">Market</span>`}
            <span class="faint" style="font-size:11.5px">${n.time}</span></div>
        </div></div>`;}).join("");

    const clients = DB.companies.map(c=>`
      <tr class="click" data-href="#/company/${c.id}">
        <td><span class="rag ${c.rag}" title="${ragWord[c.rag]}"></span></td>
        <td><div class="tname">${c.name}</div><div class="tsub">${c.group||"Standalone"} · ${c.sector}</div></td>
        <td class="tnum">${fmt(c.funded+c.nonfunded)}</td>
        <td>${pill(c.rating.split(" ")[0]+" · "+c.rating.split(" ").slice(1).join(" ").replace(/[()]/g,''), "grey")}</td>
        <td class="muted" style="font-size:12.5px">${c.ragReason}</td>
      </tr>`).join("");

    return `
    <div class="page-head"><div>
      <h1>Good morning, ${DB.rm.name.split(" ")[0]}</h1>
      <p>Here's what your AI assistant prepared for you this morning — ${new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}.</p>
    </div><div class="actions"><a class="btn ai" href="#/assistant">${spark} Ask the assistant</a></div></div>
    ${stats}
    <div class="grid" style="grid-template-columns:1fr 1fr">
      <div class="card">
        <div class="ch">${icon('check')}<h3>Today's priorities</h3>${aiBadge('Auto-generated')}
          <div class="right faint" style="font-size:12px">${DB.todos.filter(t=>!t.done).length} open</div></div>
        <div class="cb flush">${todos}</div>
      </div>
      <div class="card">
        <div class="ch">${icon('bell')}<h3>News & client signals</h3>${aiBadge('AI-summarised')}</div>
        <div class="cb flush" style="max-height:430px;overflow:auto">${feed}</div>
      </div>
    </div>
    <div class="card" style="margin-top:18px">
      <div class="ch">${icon('users')}<h3>My portfolio</h3>
        <div class="right faint" style="font-size:12px">Red = action · Amber = monitor · Green = on track</div></div>
      <div class="cb flush"><table>
        <thead><tr><th style="width:30px"></th><th>Client</th><th>Exposure</th><th>Rating</th><th>Status note</th></tr></thead>
        <tbody>${clients}</tbody></table></div>
    </div>`;
  }
  const spark2 = ()=>`<span style="color:var(--ai)">${spark}</span>`;
  function statCard(lab,val,sub,ic,cls){
    return `<div class="stat ${cls}"><div class="lab">${lab}</div><div class="val">${val}</div>
      <div class="sub">${sub}</div><div class="ic">${icon(ic,18)}</div></div>`;
  }

  /* ========== PAGE 2 — ANALYTICS ========== */
  let aFilter = "all";
  function pageAnalytics(){
    setCrumb(["Meridian","Portfolio Analytics"]);
    const cos = DB.companies;
    const totalFunded = cos.reduce((a,c)=>a+c.funded,0);
    const totalNon = cos.reduce((a,c)=>a+c.nonfunded,0);
    const total = totalFunded+totalNon;
    const limit = cos.reduce((a,c)=>a+c.limit,0);
    // by sector
    const sectors = {};
    cos.forEach(c=>sectors[c.sector]=(sectors[c.sector]||0)+c.funded+c.nonfunded);
    const sectorRows = Object.entries(sectors).sort((a,b)=>b[1]-a[1]);
    const maxSec = Math.max(...sectorRows.map(r=>r[1]));
    // by group
    const grp = {};
    cos.forEach(c=>{const k=c.group||"Standalone";grp[k]=(grp[k]||0)+c.funded+c.nonfunded;});
    const grpRows = Object.entries(grp).sort((a,b)=>b[1]-a[1]);
    const maxG = Math.max(...grpRows.map(r=>r[1]));
    // RAG
    const ragc = {red:0,amber:0,green:0}; cos.forEach(c=>ragc[c.rag]++);
    // top exposures
    const top = [...cos].sort((a,b)=>(b.funded+b.nonfunded)-(a.funded+a.nonfunded)).slice(0,6);

    const bar = (label,val,max)=>`<div class="bar-row"><div class="bl">${label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round(val/max*100)}%"></div></div>
      <div class="bv">${fmt(val)}</div></div>`;

    const donut = (()=>{
      const segs=[["green",ragc.green,"var(--green)"],["amber",ragc.amber,"var(--amber)"],["red",ragc.red,"var(--red)"]];
      const tot=cos.length; let acc=0; const stops=segs.map(([k,v,col])=>{const s=acc/tot*360;acc+=v;const e=acc/tot*360;return `${col} ${s}deg ${e}deg`;}).join(",");
      return `<div class="donut-wrap">
        <div style="width:128px;height:128px;border-radius:50%;background:conic-gradient(${stops});position:relative">
          <div style="position:absolute;inset:18px;background:#fff;border-radius:50%;display:grid;place-items:center;text-align:center">
            <div><div style="font-size:24px;font-weight:750">${cos.length}</div><div class="faint" style="font-size:11px">clients</div></div></div></div>
        <div class="legend">
          <div class="li"><span class="ls" style="background:var(--green)"></span>On track — ${ragc.green}</div>
          <div class="li"><span class="ls" style="background:var(--amber)"></span>Monitor — ${ragc.amber}</div>
          <div class="li"><span class="ls" style="background:var(--red)"></span>Action needed — ${ragc.red}</div>
        </div></div>`;
    })();

    return `
    <div class="page-head"><div><h1>Portfolio Analytics</h1>
      <p>Exposure, concentration and risk health across your book — refreshed automatically.</p></div>
      <div class="actions">${aiBadge('Live from portfolio data')}</div></div>
    <div class="stats">
      ${statCard("Total exposure", fmt(total), `Utilisation ${Math.round(total/limit*100)}% of limits`, "money","b")}
      ${statCard("Funded", fmt(totalFunded), `${Math.round(totalFunded/total*100)}% of book`, "chart","g")}
      ${statCard("Non-funded", fmt(totalNon), `${Math.round(totalNon/total*100)}% of book`, "layers","a")}
      ${statCard("Approved limits", fmt(limit), `Headroom ${fmt(limit-total)}`, "sliders","b")}
    </div>
    <div class="two">
      <div class="card"><div class="ch">${icon('chart')}<h3>Exposure by sector</h3></div>
        <div class="cb"><div class="bars">${sectorRows.map(([s,v])=>bar(s,v,maxSec)).join("")}</div></div></div>
      <div class="card"><div class="ch">${icon('layers')}<h3>Exposure by group</h3></div>
        <div class="cb"><div class="bars">${grpRows.map(([s,v])=>bar(s,v,maxG)).join("")}</div></div></div>
    </div>
    <div class="two" style="margin-top:18px;grid-template-columns:340px 1fr">
      <div class="card"><div class="ch">${icon('target')}<h3>Portfolio health</h3></div>
        <div class="cb">${donut}</div></div>
      <div class="card"><div class="ch">${icon('building')}<h3>Top exposures</h3></div>
        <div class="cb flush"><table><thead><tr><th>Client</th><th>Group</th><th class="right">Funded</th><th class="right">Total</th><th>Status</th></tr></thead>
        <tbody>${top.map(c=>`<tr class="click" data-href="#/company/${c.id}">
          <td class="tname">${c.name}</td><td class="muted">${c.group||"Standalone"}</td>
          <td class="right tnum">${fmt(c.funded)}</td><td class="right tnum">${fmt(c.funded+c.nonfunded)}</td>
          <td>${rag(c.rag)} <span class="faint" style="font-size:12px">${ragWord[c.rag]}</span></td></tr>`).join("")}</tbody></table></div></div>
    </div>`;
  }

  /* ========== PAGE 3 — REQUEST TRACKER ========== */
  let reqClient="all", reqStatus="all";
  function pageRequests(){
    setCrumb(["Meridian","Request Tracker"]);
    const statuses=["all","Submitted","In Progress","Pending Docs","Completed"];
    let rows = DB.requests.filter(r=> (reqClient==="all"||r.companyId===reqClient) && (reqStatus==="all"||r.status===reqStatus));
    const clientOpts = ["all",...new Set(DB.requests.map(r=>r.companyId))];

    const table = rows.map(r=>{
      const c=DB.byId[r.companyId];
      return `<tr>
        <td><div class="tname">${r.id}</div><div class="tsub">${r.raised}</div></td>
        <td><a class="linklike" href="#/company/${c.id}">${c.name}</a></td>
        <td>${r.type}</td>
        <td class="muted">${r.owner}</td>
        <td>${statusPill(r.status)}</td>
        <td>${r.atRisk?`<span class="pill red"><span class="d"></span>${icon('alert',12)} At risk</span>`:`<span class="faint">—</span>`}</td>
        <td class="right">${r.followup?`<button class="btn sm ai" data-act="followup" data-id="${r.id}">${spark} View draft</button>`:`<span class="faint" style="font-size:12px">No action</span>`}</td>
      </tr>`;}).join("") || `<tr><td colspan="7"><div class="empty">No requests match these filters.</div></td></tr>`;

    return `
    <div class="page-head"><div><h1>Request Tracker</h1>
      <p>Every request you've sent to the coordination unit — tracked end-to-end, so you stop chasing for updates.</p></div></div>
    <div class="toolbar">
      <span class="faint" style="font-size:12px;font-weight:600">CLIENT</span>
      ${clientOpts.map(id=>`<button class="chip ${reqClient===id?'on':''}" data-act="rfilter" data-k="client" data-v="${id}">${id==="all"?"All clients":DB.byId[id].name}</button>`).join("")}
    </div>
    <div class="toolbar">
      <span class="faint" style="font-size:12px;font-weight:600">STATUS</span>
      ${statuses.map(s=>`<button class="chip ${reqStatus===s?'on':''}" data-act="rfilter" data-k="status" data-v="${s}">${s==="all"?"All":s}${s!=="all"?` <span class="ct">${DB.requests.filter(r=>r.status===s).length}</span>`:''}</button>`).join("")}
    </div>
    <div class="card"><div class="ch">${icon('inbox')}<h3>Requests</h3>
      <div class="right"><span class="pill red"><span class="d"></span>${atRisk} flagged at risk</span>${aiBadge('AI risk-scored')}</div></div>
      <div class="cb flush"><table>
        <thead><tr><th>Reference</th><th>Client</th><th>Type</th><th>Owner (coordination)</th><th>Status</th><th>AI flag</th><th></th></tr></thead>
        <tbody>${table}</tbody></table></div></div>`;
  }

  /* ========== PAGE 4 — CASE TRACKER ========== */
  function pageCases(){
    setCrumb(["Meridian","Case Tracker"]);
    const comps = ["dcr","risk","cinet","presentation","spreading"];
    const compLab = {dcr:"Credit Memo",risk:"Risk Assessment",cinet:"CINET",presentation:"Presentation",spreading:"Fin. Spreading"};

    const groupHtml = Object.entries(DB.groups).map(([gname, members])=>{
      const open = ui.openGroups[gname];
      const behind = members.filter(m=>comps.some(k=>["pending","review","progress"].includes(m.memo[k]))).length;
      const allDone = members.every(m=>comps.every(k=>m.memo[k]==="done"));
      const pendingMembers = members.filter(m=>comps.some(k=>m.memo[k]==="pending")).length;
      const gstat = allDone?"green":pendingMembers>=2?"red":"amber";
      const head = `<div class="grp-head ${open?'open':''}" data-act="grp" data-id="${gname}">
        <div class="gi">${icon('layers',18)}</div>
        <div><div class="tname">${gname}</div><div class="tsub">${members.length} ${members.length>1?'companies':'company'} · ${behind} with components outstanding</div></div>
        <span class="pill ${gstat}" style="margin-left:14px"><span class="d"></span>${gstat==='green'?'Package ready':gstat==='red'?'Behind':'In progress'}</span>
        <span class="chev">${icon('chev',18)}</span></div>`;
      const body = `<div class="grp-body ${open?'open':''}"><table class="comp-grid">
        <thead><tr><th>Company</th>${comps.map(k=>`<th>${compLab[k]}</th>`).join("")}<th></th></tr></thead>
        <tbody>${members.map(m=>`<tr>
          <td><a class="linklike" href="#/company/${m.id}">${m.name}</a></td>
          ${comps.map(k=>{const st=compState[m.memo[k]];return `<td><span class="cstat">${rag(st.r)}${st.l}</span></td>`;}).join("")}
          <td class="right"><a class="btn sm ai" href="#/memo/${m.id}">${icon('file',14)} Open memo</a></td>
        </tr>`).join("")}</tbody></table></div>`;
      return `<div class="grp-row">${head}${body}</div>`;
    }).join("");

    return `
    <div class="page-head"><div><h1>Case Tracker</h1>
      <p>Committee packages by group and company — see at a glance which entities in a large group are behind.</p></div>
      <div class="actions">${aiBadge('AI assembles each package')}</div></div>
    <div class="toolbar"><span class="faint" style="font-size:12.5px">${icon('chart',14)} Click a group to expand its companies. Each dot shows a committee component's status.</span></div>
    ${groupHtml}`;
  }

  /* ========== PAGE 3a — CREDIT MEMO ========== */
  function memoSections(c){
    const f = c.facilities;
    const reqFac = f[0];
    return [
      {key:"overview", title:"1. Borrower Overview", src:"Drafted from client master file + group structure",
        html:`<p><b>${c.name}</b> (${c.cr}) is a ${c.sector.toLowerCase()} company${c.group?` within the <b>${c.group}</b>`:" operating on a standalone basis"}, banking with us since ${c.since}. Ultimate ownership: ${c.ubo}. The relationship spans ${f.length} facilities with total approved limits of ${fmt(c.limit)} and current utilisation of ${fmt(c.util)} (${Math.round(c.util/c.limit*100)}%).</p>
        <p>The company holds an internal risk rating of <b>${c.rating}</b>. KYC is ${c.kyc.status.toLowerCase()} (last reviewed ${c.kyc.review}). ${c.ragReason}</p>`},
      {key:"facility", title:"2. Facility Structure", src:"Assembled from facility schedule + pricing grid",
        html:`<p>This memo seeks approval for the following structure (lead facility shown; full schedule attached):</p>
        <div class="kv" style="margin:6px 0 4px">
          <div class="c"><div class="k">Lead facility</div><div class="v">${reqFac.type}</div></div>
          <div class="c"><div class="k">Limit</div><div class="v">${fmt(reqFac.limit)}</div></div>
          <div class="c"><div class="k">Pricing</div><div class="v">${reqFac.margin}</div></div>
          <div class="c"><div class="k">Security</div><div class="v">${reqFac.sec}</div></div>
        </div>
        <p>Aggregate funded exposure post-approval: ${fmt(c.funded)}; non-funded: ${fmt(c.nonfunded)}. Tenor and covenants per standard corporate terms.</p>`},
      {key:"financials", title:"3. Financial Analysis", src:"Spread from FY25 audited financials + management accounts",
        html:`<p>Key indicators (illustrative relationship view; see the public-filing snapshot on the company page for reported figures):</p>
        <div class="kv" style="margin:6px 0 4px">
          <div class="c"><div class="k">Revenue</div><div class="v">${c.profit.revenue.toFixed(2)}M</div></div>
          <div class="c"><div class="k">Net interest income</div><div class="v">${c.profit.nii.toFixed(2)}M</div></div>
          <div class="c"><div class="k">Fee income</div><div class="v">${c.profit.fees.toFixed(2)}M</div></div>
          <div class="c"><div class="k">Return on equity</div><div class="v">${c.profit.roe} <span class="faint">(prev ${c.profit.prevRoe})</span></div></div>
        </div>
        <p>Cash generation is ${c.rag==='green'?'healthy and comfortably covers debt service':c.rag==='amber'?'adequate but trending softer; debt-service headroom is being monitored':'under pressure, with debt-service coverage below covenant in the last quarter'}.</p>`},
      {key:"risk", title:"4. Risk Assessment & Rating", src:"Generated from rating model + risk-grade rationale",
        html:`<p>Proposed internal rating: <b>${c.rating}</b>. Principal risk considerations:</p>
        <ul style="margin:4px 0 8px;padding-left:18px;color:#2c3a47">
          <li>Sector outlook: ${c.sector} — ${c.rag==='red'?'challenged near term':c.rag==='amber'?'mixed; cost watch':'stable to positive'}.</li>
          <li>Leverage & coverage: utilisation at ${Math.round(c.util/c.limit*100)}% of limits.</li>
          <li>Security: ${reqFac.sec.toLowerCase()}; ${c.nonfunded>0?'contingent exposure via guarantee/LC lines':'no material contingent exposure'}.</li>
        </ul>
        <p>Mitigants: established relationship since ${c.since}${c.group?', group support available':''}, ${c.kyc.status==='Current'?'current KYC':'KYC refresh in progress'}.</p>`},
      {key:"recommendation", title:"5. RM Recommendation", src:"Drafted from memo conclusions — RM to confirm",
        html:`<p>I recommend <b>${c.rag==='red'?'approval subject to enhanced conditions':'approval'}</b> of the proposed structure for ${c.name}. ${c.rag==='red'?'Given current pressures, I propose tightened covenant monitoring, quarterly management accounts, and a six-month review trigger.':c.rag==='amber'?'I propose standard covenants with semi-annual review given the sector cost watch.':'The relationship is well-managed and profitable; standard covenants and annual review are appropriate.'} Pricing is in line with the risk grade and protects relationship return on equity of ${c.profit.roe}.</p>`},
    ];
  }

  function pageMemo(id){
    const c = DB.byId[id] || DB.companies[0];
    setCrumb(["Meridian","Case Tracker","Credit Memo"]);
    const secs = memoSections(c);
    const accepted = secs.filter(s=>ui.accepted["m_"+c.id+"_"+s.key]).length;
    const body = secs.map(s=>{
      const key="m_"+c.id+"_"+s.key;
      const editing = ui.editing[key];
      const inner = editing
        ? `<textarea data-edit="${key}">${s.html.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}</textarea>
           <div style="margin-top:9px"><button class="btn sm accent" data-act="save" data-key="${key}">${icon('check',14)} Save edit</button></div>`
        : s.html;
      return `<div class="memo-sec" data-sec="${key}">
        <div class="sh">${icon('file',16)}<h4>${s.title}</h4>
          ${ui.accepted[key]?`<span class="acc-flag" style="margin-left:auto">${icon('check',14)} Accepted</span>`:`<span class="ai-badge" style="margin-left:auto">${spark}AI</span>`}</div>
        <div class="sec-inner">${inner}</div>
        <div class="ctrl" style="border:0;padding:10px 0 0">
          <div class="src" style="border:0;background:none;padding:0;border-radius:0">${spark} ${s.src}</div>
          <div style="margin-left:auto;display:flex;gap:8px">
            ${ui.accepted[key]?'':`<button class="btn sm ai" data-act="accept" data-key="${key}">${icon('check',14)} Accept</button>`}
            <button class="btn sm" data-act="edit" data-key="${key}">${icon('edit',14)} Edit</button>
            <button class="btn sm" data-act="regen" data-key="${key}">${icon('refresh',14)} Regenerate</button>
          </div>
        </div></div>`;}).join("");

    return `
    <div class="page-head"><div>
      <div class="crumb" style="margin-bottom:6px"><a class="linklike" href="#/cases">${icon('arrow',13)} Back to Case Tracker</a></div>
      <h1>Credit Memo — ${c.name}</h1>
      <p>${c.group||"Standalone"} · ${c.cr} · committee package</p></div>
      <div class="actions">
        <button class="btn">${icon('download',15)} Export to committee pack</button>
        <button class="btn primary" data-act="approve-memo">${icon('check',15)} Submit to committee</button></div></div>
    <div class="memo">
      <div class="memo-doc">
        <div class="mh"><div class="spread">
          <div><div class="faint" style="font-size:11px;letter-spacing:.05em;text-transform:uppercase;font-weight:700">Detailed Credit Request</div>
            <h2 style="font-size:19px;margin-top:4px">${c.name}</h2></div>
          <div class="right">${aiBadge('Drafted by AI')}<div class="faint" style="font-size:11.5px;margin-top:6px">5 sections · ${accepted}/5 accepted</div></div>
        </div></div>
        ${body}
      </div>
      <div class="memo-side">
        <div class="card">
          <div class="ch">${spark2()}<h3>How this was built</h3></div>
          <div class="cb">
            <p class="muted" style="font-size:12.5px;margin:0 0 12px">The assistant assembled this memo from the client master file, FY25 financials, the rating model and CINET — work that previously took hours of manual drafting.</p>
            <div class="kv">
              <div class="c"><div class="k">Sources used</div><div class="v">7 documents</div></div>
              <div class="c"><div class="k">Draft time</div><div class="v">38 seconds</div></div>
              <div class="c"><div class="k">CINET</div><div class="v">${pill('Pulled','green')}</div></div>
              <div class="c"><div class="k">Risk rating</div><div class="v">${c.rating.split(" ")[0]}</div></div>
            </div>
            <div class="divider"></div>
            <div class="muted" style="font-size:12px">Every section is AI-drafted and waits for your review. Accept, edit or regenerate — nothing is final until you approve it.</div>
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ========== PAGE 5 — LEADS ========== */
  let leadSel = {};
  function pageLeads(){
    setCrumb(["Meridian","Leads"]);
    const L = DB.leads;
    const uploaded = L.filter(l=>l.clearance==="none"||l.clearance==="existing");
    const newOnes = L.filter(l=>!l.isClient && l.clearance==="none");
    const inReview = L.filter(l=>l.clearance==="requested");
    const stages = ["Contacted","Meeting Set","Proposal","Won","Lost"];
    const active = L.filter(l=>l.clearance==="cleared");

    const uploadTable = `<table>
      <thead><tr><th style="width:34px"></th><th>Company</th><th>Sector</th><th>Match result</th><th>Clearance</th></tr></thead>
      <tbody>${uploaded.map(l=>`<tr>
        <td>${l.isClient?'<span class="faint">—</span>':`<div class="chk ${leadSel[l.id]?'done':''}" data-act="lead-sel" data-id="${l.id}">${icon('check',12)}</div>`}</td>
        <td class="tname">${l.name}</td><td class="muted">${l.sector}</td>
        <td>${l.isClient?pill('Existing client','blue'):pill('New prospect','grey')}</td>
        <td>${l.isClient?'<span class="faint" style="font-size:12px">Already onboarded</span>':statusPill('—'.replace('—','Not requested')).replace('Not requested','Not requested')}</td>
      </tr>`).join("")}</tbody></table>`;

    const selCount = Object.values(leadSel).filter(Boolean).length;

    const reviewHtml = inReview.length?inReview.map(l=>`<div class="row">
        <div class="tx"><div class="t">${l.name}</div><div class="m">${l.sector} · clearance requested</div></div>
        <span class="pill amber"><span class="d"></span>Under Review</span>
      </div>`).join(""):`<div class="empty">No clearances in review. Select new prospects above and request clearance.</div>`;

    const kanban = `<div class="kanban">${stages.map(st=>{
      const items = active.filter(l=>l.stage===st);
      return `<div class="kcol"><h4>${st} <span class="faint">${items.length}</span></h4>
        ${items.map(l=>`<div class="kcard"><div class="kn">${l.name}</div><div class="ks">${l.sector}</div>
          <select data-act="stage" data-id="${l.id}">${stages.map(s=>`<option ${s===l.stage?'selected':''}>${s}</option>`).join("")}</select></div>`).join("")||'<div class="faint" style="font-size:12px;padding:6px">—</div>'}
      </div>`;}).join("")}</div>`;

    return `
    <div class="page-head"><div><h1>Leads</h1>
      <p>From a raw company list to qualified, cleared prospects — the whole funnel in one place.</p></div></div>

    <div class="card" style="margin-bottom:18px">
      <div class="ch">${icon('upload')}<h3>1 · Upload & match</h3>${aiBadge('Auto-matched against client base')}</div>
      <div class="cb">
        <div class="spread" style="margin-bottom:14px">
          <div class="muted" style="font-size:13px">A list of ${uploaded.length} companies was uploaded. The assistant checked each against your existing client base.</div>
          <button class="btn sm">${icon('upload',14)} Upload new list</button>
        </div>
        <div class="card" style="box-shadow:none"><div class="cb flush">${uploadTable}</div></div>
        <div class="spread" style="margin-top:14px">
          <div class="muted" style="font-size:13px">${selCount?`<b>${selCount}</b> new prospect${selCount>1?'s':''} selected`:'Tick the new prospects you want to clear.'}</div>
          <button class="btn accent" data-act="req-clear" ${selCount?'':'disabled'}>${icon('arrow',15)} Request clearance${selCount?` (${selCount})`:''}</button>
        </div>
      </div>
    </div>

    <div class="two">
      <div class="card"><div class="ch">${icon('clock')}<h3>2 · Clearance status</h3></div>
        <div class="cb flush">${reviewHtml}</div>
        ${inReview.length?`<div class="cb" style="border-top:1px solid var(--line-soft)"><button class="btn sm ai" data-act="run-clear">${spark} Simulate compliance review → clear</button></div>`:''}
      </div>
      <div class="card"><div class="ch">${icon('target')}<h3>Lead funnel</h3></div>
        <div class="cb">
          <div class="bars">
            ${[["Uploaded",uploaded.length],["New prospects",newOnes.length+inReview.length+active.length],["In review",inReview.length],["Active leads",active.length]].map(([l,v],i)=>
              `<div class="bar-row"><div class="bl">${l}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100,v/uploaded.length*100)}%"></div></div><div class="bv">${v}</div></div>`).join("")}
          </div>
        </div></div>
    </div>

    <div class="card" style="margin-top:18px">
      <div class="ch">${icon('users')}<h3>3 · Active leads</h3><div class="right faint" style="font-size:12px">Drag-free demo — update stage with the dropdown</div></div>
      <div class="cb">${kanban}</div>
    </div>`;
  }

  /* ========== ASSISTANT ========== */
  const QA = [
    { q:"Which clients need my attention today?",
      a:`<h5>One client is flagged red, and a few ambers need watching:</h5><ul>
        <li><b>Noor Financial Investment</b> (NIG group) — red; covenant waiver requested, investment-company earnings volatile.</li>
        <li><b>Combined Group Contracting</b> — amber; performance guarantee pending for the new KOC award, plus two active disputes.</li>
        <li><b>Shomoul / The Avenues Riyadh</b> (Mabanee) — amber; SAR 11.44bn project financing, drawdown to committee Thursday.</li></ul>
        I've already put these at the top of your to-do list.` },
    { q:"Summarise the KIPCO group exposure.",
      a:`<h5>KIPCO Group — 5 companies in your book:</h5><ul>
        <li>Total exposure <b>KWD 165.0M</b> across the holding and its subsidiaries.</li>
        <li>KIPCO (holding) is amber — leverage improving; Fitch revised the outlook to Stable (BB-) in Dec 2025.</li>
        <li>Burgan Bank is on track; United Real Estate and Qurain Petrochemical are amber (CRE utilisation / petchem spreads).</li></ul>
        The group profitability pack is ready on each company page.` },
    { q:"Draft a follow-up to coordination on the at-risk requests.",
      a:`<h5>I've drafted follow-ups for the ${atRisk} at-risk requests:</h5><ul>
        <li>CRN-3071 — CGC performance guarantee, KOC award (to Layla H.)</li>
        <li>CRN-3068 — Noor Financial covenant waiver (to Fatima A.)</li>
        <li>CRN-3061 — Boubyan Petrochemical FX line renewal (to Layla H.)</li>
        <li>CRN-3050 — Tristar subsidiary account (to Layla H.)</li></ul>
        Open the <a class="linklike" href="#/requests">Request Tracker</a> and click "View draft" on any flagged request to send.` },
    { q:"What's the status of my committee packages?",
      a:`<h5>Across your book:</h5><ul>
        <li><b>Gulf Cable Group</b> and <b>Boubyan Group</b> — packages essentially ready.</li>
        <li><b>Mabanee</b> — Avenues Riyadh memo in review, presentation drafting.</li>
        <li><b>National Industries Group</b> — mixed; Noor Financial is the blocker.</li></ul>
        See the full matrix in the <a class="linklike" href="#/cases">Case Tracker</a>.` },
  ];

  function pageAssistant(){
    setCrumb(["Meridian","RM Assistant"]);
    if(ui.chat.length===0){
      ui.chat.push({role:"a", html:`<h5>Good morning, ${DB.rm.name.split(" ")[0]} 👋</h5>I'm your relationship assistant. I've already reviewed your portfolio, requests and the morning news. Ask me anything, or pick a suggestion below.`});
    }
    return `
    <div class="page-head"><div><h1>RM Assistant</h1>
      <p>Your portfolio, requests and market signals — ask in plain language.</p></div>
      <div class="actions">${aiBadge('Demo · scripted responses')}</div></div>
    <div class="chat">
      <div class="stream" id="stream"></div>
      <div class="suggest" id="suggest">${QA.map((x,i)=>`<button class="sg" data-act="ask" data-i="${i}">${x.q}</button>`).join("")}</div>
      <div class="compose">
        <input id="chatin" placeholder="Ask about a client, request or your portfolio…"/>
        <button class="btn accent" data-act="send-chat">${icon('send',15)} Send</button>
      </div>
    </div>`;
  }
  function mountAssistant(){
    drawChat();
    const inp=$("#chatin");
    if(inp) inp.addEventListener("keydown",e=>{ if(e.key==="Enter") sendChat(inp.value); });
  }
  function drawChat(){
    const s=$("#stream"); if(!s) return;
    s.innerHTML = ui.chat.map(m=>`<div class="msg ${m.role}">
      <div class="ava">${m.role==='a'?spark:DB.rm.initials}</div>
      <div class="bub">${m.html}</div></div>`).join("") +
      (ui.chatBusy?`<div class="msg a"><div class="ava">${spark}</div><div class="bub"><div class="typing"><i></i><i></i><i></i></div></div></div>`:'');
    s.scrollTop=s.scrollHeight;
  }
  function ask(i){ const x=QA[i]; sendChat(x.q, x.a); }
  function sendChat(q, cannedHtml){
    q=(q||"").trim(); if(!q||ui.chatBusy) return;
    const inp=$("#chatin"); if(inp) inp.value="";
    ui.chat.push({role:"u", html:q});
    let ans = cannedHtml;
    if(!ans){
      const hit = QA.find(x=>x.q.toLowerCase()===q.toLowerCase());
      ans = hit?hit.a:`Here's what I can see for that. For this demo I respond in full to the suggested questions below — try one of those to see a complete, sourced answer.`;
    }
    ui.chatBusy=true; drawChat();
    setTimeout(()=>{ ui.chatBusy=false; ui.chat.push({role:"a", html:ans}); drawChat(); }, 950);
  }

  /* ========== COMPANY PAGE ========== */
  function pageCompany(id){
    const c = DB.byId[id]; if(!c) return `<div class="empty">Company not found.</div>`;
    setCrumb(["Meridian","Portfolio",c.name]);
    const reqs = DB.requests.filter(r=>r.companyId===c.id);
    const facRows = c.facilities.map(f=>`<tr>
      <td class="tname">${f.type}</td><td class="right tnum">${fmt(f.limit)}</td>
      <td class="right tnum">${fmt(f.util)}</td><td class="right tnum">${fmt(f.limit-f.util)}</td>
      <td>${f.expiry}</td><td class="muted">${f.margin}</td><td class="muted">${f.sec}</td></tr>`).join("");

    const gen = ui.generated["prof_"+c.id];
    const profCard = gen
      ? `<table><thead><tr><th>Metric</th><th class="right">Per client</th><th class="right">Per group</th></tr></thead><tbody>
          ${[["Revenue",c.profit.revenue,c.profit.revenue*2.3],["Net interest income",c.profit.nii,c.profit.nii*2.3],
             ["Fee income",c.profit.fees,c.profit.fees*2.3],["Return on equity",c.profit.roe,"13.6%"]].map(([k,v,g])=>
            `<tr><td>${k}</td><td class="right tnum">${typeof v==='number'?v.toFixed(2)+'M':v}</td><td class="right tnum">${typeof g==='number'?g.toFixed(2)+'M':g}</td></tr>`).join("")}
        </tbody></table>`
      : `<div class="center" style="padding:24px 0">
          <p class="muted" style="font-size:13px;margin:0 0 14px">Generate profitability & exposure tables, per client and per group.</p>
          <button class="btn ai" data-act="gen-prof" data-id="${c.id}">${spark} Generate tables</button></div>`;

    const news = c.news.length?c.news.map(n=>`<div class="news" style="padding:13px 0">
        <span class="dotc" style="background:var(--${n.rag==='red'?'red':n.rag==='amber'?'amber':'green'})"></span>
        <div><div class="nt">${n.t}</div><div class="ns">${spark2()} ${n.s}</div>
        <div class="faint" style="font-size:11.5px;margin-top:4px">${n.date}</div></div></div>`).join("")
      : `<div class="empty">No recent company news.</div>`;

    return `
    <div class="page-head"><div>
      <div class="crumb" style="margin-bottom:6px"><a class="linklike" href="#/dashboard">${icon('arrow',13)} Back to portfolio</a></div>
    </div></div>
    <div class="co-head">
      <div class="co-logo">${c.short}</div>
      <div style="flex:1">
        <div class="spread"><div class="flex"><h1 style="font-size:21px">${c.name}</h1>
          ${c.ticker?`<span class="pill blue">${c.ticker}</span>`:''}
          <span class="pill grey">${c.parent?'Group parent':'Subsidiary'}</span></div>
          <span class="pill ${c.rag}"><span class="d"></span>${ragWord[c.rag]}</span></div>
        <div class="co-meta">
          <div class="m"><div class="k">Group</div><div class="v">${c.group||"Standalone"}</div></div>
          <div class="m"><div class="k">Sector</div><div class="v">${c.sector}</div></div>
          <div class="m"><div class="k">CR Number</div><div class="v">${c.cr}</div></div>
          <div class="m"><div class="k">Risk rating</div><div class="v">${c.rating}</div></div>
          <div class="m"><div class="k">Relationship since</div><div class="v">${c.since}</div></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <a class="btn primary" href="#/memo/${c.id}">${icon('file',15)} Open credit memo</a>
        <a class="btn" href="#/requests">${icon('inbox',15)} ${reqs.length} request${reqs.length!==1?'s':''}</a>
      </div>
    </div>

    ${aiBlock("co_"+c.id, "AI briefing · summarised from filings, financials & news",
      `<p style="margin:0">${c.name} is a ${c.rating.toLowerCase().includes('strong')?'strong':c.rag==='red'?'closely-watched':'satisfactory'} ${c.sector.toLowerCase()} name, banking with us since ${c.since}. Total exposure stands at ${fmt(c.funded+c.nonfunded)} against limits of ${fmt(c.limit)}. ${c.ragReason} Latest ROE ${c.profit.roe} (prior ${c.profit.prevRoe}).</p>`)}

    ${c.pub?`<div class="card" style="margin-top:18px">
      <div class="ch">${icon('file')}<h3>Public filing snapshot</h3>
        <span class="pill green">Real public data</span>
        <div class="right faint" style="font-size:11.5px">Source: ${c.pub.src}</div></div>
      <div class="cb">
        <div class="co-meta" style="margin:0">
          ${c.pub.rev?`<div class="m"><div class="k">Revenue ${c.pub.year?'· '+c.pub.year:''}</div><div class="v">${DB.fmtPub(c.pub.rev,c.pub.cur)}</div></div>`:''}
          ${c.pub.net?`<div class="m"><div class="k">Net profit</div><div class="v">${DB.fmtPub(c.pub.net,c.pub.cur)}</div></div>`:''}
          ${c.pub.rating?`<div class="m"><div class="k">Public rating</div><div class="v">${c.pub.rating}</div></div>`:''}
          ${c.ticker?`<div class="m"><div class="k">Listing</div><div class="v">${c.ticker}</div></div>`:''}
        </div>
        ${c.pub.note?`<p class="muted" style="font-size:12.5px;margin:12px 0 0">${c.pub.note}</p>`:''}
      </div></div>`:''}

    <div class="two" style="margin-top:18px">
      <div class="card"><div class="ch">${icon('money')}<h3>Credit facilities</h3>
        <div class="right faint" style="font-size:12px">Funded ${fmt(c.funded)} · Non-funded ${fmt(c.nonfunded)}</div></div>
        <div class="cb flush"><table><thead><tr><th>Facility</th><th class="right">Limit</th><th class="right">Utilised</th><th class="right">Available</th><th>Expiry</th><th>Pricing</th><th>Security</th></tr></thead>
        <tbody>${facRows}</tbody></table></div></div>
    </div>

    <div class="three" style="margin-top:18px">
      <div class="card"><div class="ch">${icon('users')}<h3>KYC</h3></div><div class="cb">
        <div class="kv"><div class="c"><div class="k">Incorporated</div><div class="v">${c.kyc.inc}</div></div>
          <div class="c"><div class="k">Domicile</div><div class="v">${c.kyc.domicile}</div></div>
          <div class="c"><div class="k">UBO</div><div class="v">${c.ubo}</div></div>
          <div class="c"><div class="k">KYC review</div><div class="v">${c.kyc.review}</div></div>
          <div class="c" style="grid-column:1/3"><div class="k">Status</div><div class="v">${c.kyc.status==='Current'?pill('Current','green'):pill(c.kyc.status,'amber')}</div></div></div>
      </div></div>
      <div class="card"><div class="ch">${icon('layers')}<h3>Exposure</h3></div><div class="cb">
        <div class="kv"><div class="c"><div class="k">Funded</div><div class="v">${fmt(c.funded)}</div></div>
          <div class="c"><div class="k">Non-funded</div><div class="v">${fmt(c.nonfunded)}</div></div>
          <div class="c"><div class="k">Total limits</div><div class="v">${fmt(c.limit)}</div></div>
          <div class="c"><div class="k">Utilisation</div><div class="v">${Math.round(c.util/c.limit*100)}%</div></div></div>
        <div class="bar-track" style="margin-top:12px"><div class="bar-fill" style="width:${Math.round(c.util/c.limit*100)}%"></div></div>
      </div></div>
      <div class="card"><div class="ch">${spark2()}<h3>Relationship economics</h3>${aiBadge('Illustrative · on demand')}</div>
        <div class="cb flush" id="profcard" style="padding:0 16px">${profCard}</div></div>
    </div>

    <div class="card" style="margin-top:18px"><div class="ch">${icon('bell')}<h3>Company news</h3>${aiBadge('AI-summarised')}</div>
      <div class="cb">${news}</div></div>`;
  }

  /* ========== modal ========== */
  function modal(html){
    closeModal();
    const d=document.createElement("div"); d.className="modal-bg"; d.id="modal";
    d.innerHTML=`<div class="modal">${html}</div>`;
    d.addEventListener("click",e=>{ if(e.target===d) closeModal(); });
    document.body.appendChild(d);
  }
  function closeModal(){ const m=$("#modal"); if(m) m.remove(); }

  /* ========== events ========== */
  document.addEventListener("click", (e)=>{
    const row = e.target.closest("tr.click,[data-href]");
    const act = e.target.closest("[data-act]");
    if(act){
      const a=act.dataset.act, k=act.dataset.key, id=act.dataset.id;
      if(a==="todo"){ const t=DB.todos.find(x=>x.id===id); t.done=!t.done; render(); return; }
      if(a==="grp"){ const g=act.dataset.id; ui.openGroups[g]=!ui.openGroups[g]; render(); return; }
      if(a==="rfilter"){ if(act.dataset.k==="client") reqClient=act.dataset.v; else reqStatus=act.dataset.v; render(); return; }
      if(a==="accept"){ ui.accepted[k]=true; render(); return; }
      if(a==="edit"){ ui.editing[k]=!ui.editing[k]; render(); return; }
      if(a==="save"){ ui.editing[k]=false; ui.accepted[k]=true; render(); return; }
      if(a==="regen"){ regen(k, act); return; }
      if(a==="approve-memo"){ modal(`<div class="mh2">${icon('check')}<h3>Submitted to committee</h3><button class="x" data-act="close">${icon('x')}</button></div>
        <div class="mb2"><p class="muted">In the live product this packages the accepted memo, risk assessment, CINET report and presentation into the committee pack and routes it for approval. (Demo — no document is sent.)</p></div>
        <div class="mf"><button class="btn primary" data-act="close">Done</button></div>`); return; }
      if(a==="gen-prof"){ genProf(id, act); return; }
      if(a==="followup"){ showFollowup(id); return; }
      if(a==="lead-sel"){ leadSel[id]=!leadSel[id]; render(); return; }
      if(a==="req-clear"){ DB.leads.forEach(l=>{ if(leadSel[l.id]){ l.clearance="requested"; } }); leadSel={}; render(); return; }
      if(a==="run-clear"){ DB.leads.forEach(l=>{ if(l.clearance==="requested"){ l.clearance="cleared"; l.stage="Contacted"; } }); render(); return; }
      if(a==="ask"){ ask(+act.dataset.i); return; }
      if(a==="send-chat"){ sendChat($("#chatin").value); return; }
      if(a==="close"){ closeModal(); return; }
    }
    if(row && row.dataset.href){
      if(e.target.closest("a,button,select,.chk")) return;
      location.hash = row.dataset.href; return;
    }
  });
  document.addEventListener("change",(e)=>{
    const sel=e.target.closest("[data-act='stage']");
    if(sel){ const l=DB.leads.find(x=>x.id===sel.dataset.id); l.stage=sel.value; render(); }
  });

  function regen(key, btn){
    const sec = document.querySelector(`[data-sec="${key}"] .sec-inner`) || (btn.closest(".ai-block")?.querySelector(".body"));
    if(!sec) return;
    const old = sec.innerHTML;
    sec.innerHTML = `<div class="gen"><span class="spin"></span> Regenerating with AI…</div>`;
    setTimeout(()=>{ sec.innerHTML = old; sec.classList.add("fade-in"); ui.accepted[key]=false; }, 1100);
  }
  function genProf(id, btn){
    const card=$("#profcard");
    card.innerHTML=`<div class="gen"><span class="spin"></span> Generating profitability & exposure tables…</div>`;
    setTimeout(()=>{ ui.generated["prof_"+id]=true; render(); }, 1200);
  }
  function showFollowup(id){
    const r=DB.requests.find(x=>x.id===id); const c=DB.byId[r.companyId];
    modal(`<div class="mh2">${spark2()}<h3>AI-drafted follow-up</h3>${aiBadge('Ready to send')}<button class="x" data-act="close">${icon('x')}</button></div>
      <div class="mb2">
        <div class="muted" style="font-size:12.5px;margin-bottom:10px">${r.id} · ${c.name} · to ${r.owner}</div>
        <div class="ai-block"><div class="body" style="white-space:pre-line;font-size:13.5px;line-height:1.7">${r.followup}</div></div>
      </div>
      <div class="mf"><button class="btn" data-act="close">Edit</button><button class="btn accent" data-act="close">${icon('send',15)} Send to coordination</button></div>`);
  }

  /* ---------- boot ---------- */
  shell();
  window.addEventListener("hashchange", render);
  render();
})();
