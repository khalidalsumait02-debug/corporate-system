/* Shared mock dataset — Corporate Banking RM Workspace prototype.
   REAL public company data (Boursa Kuwait / public filings & ratings, 2024-2026) is used
   for realism; ALL bank-internal figures (facilities, exposures, internal ratings,
   relationship details, requests, to-dos) are FICTIONAL and not real client information. */
window.DB = (function () {
  const rm = { name: "Yousef Al-Sabah", role: "Senior Relationship Manager · Corporate", initials: "YA", desk: "Corporate Banking — Large Cap Groups" };
  const disclaimer = "Illustrative prototype. Real public figures (revenue, net profit, public credit ratings, news) are shown to make the demo realistic; all bank-internal data — facilities, exposures, internal ratings and relationship details — is fictional and not real client information.";

  // ---- raw group definitions (figures: bank-internal in KWD millions unless noted) ----
  const GROUPS = [
    { group:"KIPCO Group", members:[
      { id:"kipco", name:"Kuwait Projects Co. (KIPCO)", short:"KP", sector:"Diversified Holding", ticker:"KPROJ", parent:true,
        rag:"amber", ragReason:"Holding-company leverage improving after 2025 asset monetisation; Fitch revised outlook to Stable.",
        funded:38, nonfunded:9, limit:60, rating:"5 (Watch)", since:"2006", ubo:"Al Futtooh Holding 31.9%; widely held",
        pub:{rev:1490, net:15.65, cur:"KWD M", year:"FY2024", rating:"Fitch BB-/Stable (Dec 2025)", src:"KIPCO Annual Report 2024; Fitch"},
        news:[{t:"Fitch revises KIPCO outlook to Stable, affirms BB-", s:"After ~US$936M of intragroup asset monetisation in 2025, net loan-to-value fell to 37.2% from 52.9%; Fitch lifted the outlook from Negative to Stable.", date:"16 Dec 2025", rag:"green"}] },
      { id:"burgan", name:"Burgan Bank", short:"BB", sector:"Commercial Banking", ticker:"BURG",
        rag:"green", ragReason:"Strong franchise; completed United Gulf Bank acquisition.",
        funded:12, nonfunded:30, limit:55, rating:"3 (Strong)", since:"2008", ubo:"KIPCO 61%",
        pub:{net:46.4, cur:"KWD M", year:"FY2024", rating:"Fitch A/Stable", src:"KIPCO AR 2024; Fitch"},
        news:[{t:"Burgan Bank completes acquisition of United Gulf Bank", s:"US$190M deal (~1.0x book) closed Q1 2025, adding ~60-70bps drag on regulatory capital ratios.", date:"Q1 2025", rag:"amber"}] },
      { id:"urc", name:"United Real Estate Co. (URC)", short:"UR", sector:"Real Estate", ticker:"URC",
        rag:"amber", ragReason:"Development pipeline carrying elevated utilisation.",
        funded:30, nonfunded:4, limit:40, rating:"5 (Watch)", since:"2009", ubo:"KIPCO 62%",
        pub:{rev:88.6, net:5.1, cur:"KWD M", year:"FY2024", src:"KIPCO AR 2024"} },
      { id:"napesco", name:"National Petroleum Services (NAPESCO)", short:"NP", sector:"Oil & Gas Services", ticker:"NAPESCO",
        rag:"green", ragReason:"Net profit +56% YoY; comfortable headroom.",
        funded:9, nonfunded:6, limit:20, rating:"4 (Satisfactory)", since:"2012", ubo:"KIPCO 60%",
        pub:{rev:41.0, net:13.4, cur:"KWD M", year:"FY2024", src:"KIPCO AR 2024"} },
      { id:"qpic", name:"Qurain Petrochemical (QPIC)", short:"QP", sector:"Petrochemicals", ticker:"QPIC",
        rag:"amber", ragReason:"Paraxylene price weakness via EQUATE/KARO is a margin watch.",
        funded:22, nonfunded:5, limit:35, rating:"5 (Watch)", since:"2011", ubo:"Widely held; KIPCO-linked",
        pub:{note:"EQUATE FY2024 revenue ~US$3.81bn (+22%); KARO posted a US$5.66M loss in 2024.", src:"KIPCO AR 2024"} },
    ]},
    { group:"Tamdeen Group", members:[
      { id:"taminv", name:"Tamdeen Investment Co.", short:"TI", sector:"Real Estate Holding", ticker:"TAMINV", parent:true,
        rag:"green", ragReason:"Near debt-free at holding level; project finance sits in operating subsidiaries.",
        funded:6, nonfunded:1, limit:12, rating:"3 (Strong)", since:"2010", ubo:"Al Marzouq family",
        pub:{rev:15.93, net:13.51, cur:"KWD M", year:"FY2024", src:"Kamco / Boursa filing"},
        news:[{t:"Tamdeen acquires majority stake in 4Sale International", s:"First major digital investment — controlling interest in Kuwait's leading online marketplace, signalling a shift beyond physical real estate.", date:"02 Jun 2026", rag:"green"}] },
      { id:"tamdeen-re", name:"Tamdeen Real Estate Co.", short:"TR", sector:"Real Estate", 
        rag:"amber", ragReason:"Development utilisation high; flagship asset leasing monitored.",
        funded:28, nonfunded:3, limit:35, rating:"4 (Satisfactory)", since:"2011", ubo:"Tamdeen Group" },
      { id:"tamdeen-malls", name:"Tamdeen Shopping Centers", short:"TS", sector:"Retail Malls",
        rag:"green", ragReason:"360 Mall, Al Khiran & Al Kout performing; strong footfall.",
        funded:40, nonfunded:6, limit:55, rating:"4 (Satisfactory)", since:"2011", ubo:"Tamdeen Group",
        news:[{t:"Tamdeen breaks ground on 'The Farm Kuwait' in Sabah Al Salem", s:"New agri-leisure destination — diversification beyond malls into experiential formats; a pipeline asset not yet generating revenue.", date:"15 Feb 2026", rag:"amber"}] },
      { id:"grand-hyatt", name:"Grand Hyatt Kuwait", short:"GH", sector:"Hospitality",
        rag:"amber", ragReason:"Hospitality recovery solid but seasonal; refinance window approaching.",
        funded:9, nonfunded:1, limit:14, rating:"5 (Watch)", since:"2016", ubo:"Tamdeen Group" },
    ]},
    { group:"National Industries Group (NIG)", members:[
      { id:"nig", name:"National Industries Group Holding", short:"NG", sector:"Industrial Conglomerate", ticker:"NIND", parent:true,
        rag:"amber", ragReason:"Holding leverage elevated (~103% D/E); negative levered FCF during investment cycle.",
        funded:20, nonfunded:5, limit:32, rating:"5 (Watch)", since:"2007", ubo:"Widely held",
        pub:{rev:49.9, net:14.0, cur:"KWD M", year:"TTM 2026", rating:"D/E ~103%", src:"Boursa Kuwait / Yahoo Finance"},
        news:[{t:"J3 consortium (NIG, Mabanee, Privatization Holding) advances Jaber Al-Ahmad Residential City", s:"NIG is co-developer in a KD154M (~US$500M) PPP housing project — a push into Kuwait social infrastructure.", date:"24 Apr 2025", rag:"green"}] },
      { id:"nicbm", name:"National Industries Co. (NICBM)", short:"NC", sector:"Building Materials", ticker:"NICBM",
        rag:"green", ragReason:"Largest domestic building-materials producer; order book firm.",
        funded:18, nonfunded:6, limit:30, rating:"4 (Satisfactory)", since:"2008", ubo:"NIG" },
      { id:"ikarus", name:"Ikarus Petroleum Industries", short:"IK", sector:"Petrochemicals", ticker:"IKARUS",
        rag:"amber", ragReason:"Petrochemical spreads soft; earnings volatility.",
        funded:14, nonfunded:3, limit:22, rating:"5 (Watch)", since:"2013", ubo:"NIG major shareholder" },
      { id:"noor", name:"Noor Financial Investment", short:"NF", sector:"Financial Services", ticker:"NOORINV",
        rag:"red", ragReason:"Investment-company earnings volatile; exposure under review and covenant waiver requested.",
        funded:8, nonfunded:2, limit:14, rating:"6 (Substandard watch)", since:"2014", ubo:"NIG" },
      { id:"proclad", name:"Proclad Group", short:"PC", sector:"Specialist Engineering",
        rag:"green", ragReason:"Niche oil & gas engineering; diversified geography (UK, Singapore).",
        funded:11, nonfunded:4, limit:18, rating:"4 (Satisfactory)", since:"2015", ubo:"NIG" },
    ]},
    { group:"Agility Group", members:[
      { id:"agility", name:"Agility Global", short:"AG", sector:"Logistics Holding", ticker:"AGLTY (ADX)", parent:true,
        rag:"green", ragReason:"Asset-light holding; ~8% DSV stake is a NAV swing factor; ADX listing still young.",
        funded:30, nonfunded:8, limit:50, rating:"4 (Satisfactory)", since:"2009", ubo:"Sultan family (control)",
        pub:{rev:5100, net:128, cur:"USD M", year:"FY2024-25", src:"Agility Annual Report 2025"},
        news:[{t:"ROSHN Group & Agility Logistics Parks sign JV for Saudi logistics development", s:"Agility partners with the Saudi sovereign developer to co-develop Grade-A logistics parks — a material KSA expansion.", date:"2025", rag:"green"}] },
      { id:"tristar", name:"Tristar Group", short:"TG", sector:"Fuel Logistics & Shipping",
        rag:"green", ragReason:"Diversified fuel logistics; ~US$1.2bn revenue, 30 countries.",
        funded:23, nonfunded:7, limit:34, rating:"4 (Satisfactory)", since:"2014", ubo:"Agility" },
      { id:"menzies", name:"Menzies Aviation", short:"MZ", sector:"Aviation Services",
        rag:"green", ragReason:"World's largest aviation services by country count; contract wins expanding.",
        funded:16, nonfunded:5, limit:26, rating:"4 (Satisfactory)", since:"2020", ubo:"Agility",
        news:[{t:"Menzies Aviation secures 15-year ground handling licence at Bangalore (Kempegowda)", s:"Long-dated contract at one of India's busiest airports, extending the South Asia footprint.", date:"2026", rag:"green"}] },
      { id:"alp", name:"Agility Logistics Parks", short:"AL", sector:"Industrial Real Estate",
        rag:"green", ragReason:"Warehouse capacity scaling across KSA, UAE, Africa.",
        funded:19, nonfunded:3, limit:30, rating:"4 (Satisfactory)", since:"2013", ubo:"Agility" },
    ]},
    { group:"Mabanee Group", members:[
      { id:"mabanee", name:"Mabanee Company", short:"MB", sector:"Real Estate / Malls", ticker:"MABANEE", parent:true,
        rag:"green", ragReason:"The Avenues Kuwait near-full occupancy; Avenues Riyadh is the key leverage/execution watch.",
        funded:35, nonfunded:8, limit:60, rating:"3 (Strong)", since:"2008", ubo:"Widely held; MSCI Kuwait constituent",
        pub:{rev:450, net:84.6, cur:"see note", year:"FY2025", note:"FY2025 net profit KWD 84.6M (+30%); revenue ~US$450M; total assets ~KWD 1.66bn.", src:"Mabanee AR 2025"},
        news:[{t:"Mabanee & NBK sign Kuwait's first green loan (KD25M) for Souk Sabah", s:"Sharia-compliant green loan over 100 months structured under Green Loan Principles — a Kuwait market first.", date:"Nov 2025", rag:"green"},
              {t:"Mabanee upsizes Avenues Riyadh financing to SAR 11.44bn", s:"Added SAR 3.45bn for the Riyadh towers; total project debt SAR 11.44bn at 14.25-year tenor, held at the Saudi (Shomoul) level.", date:"Late 2025", rag:"amber"}] },
      { id:"avenues-kw", name:"The Avenues — Kuwait", short:"AK", sector:"Retail Mall",
        rag:"green", ragReason:"1.3M sqm, 98% occupancy — the group's core income engine.",
        funded:60, nonfunded:5, limit:80, rating:"3 (Strong)", since:"2009", ubo:"Mabanee" },
      { id:"shomoul", name:"Shomoul — The Avenues Riyadh", short:"AR", sector:"Mega Development (KSA)", ticker:"60% Mabanee",
        rag:"amber", ragReason:"SAR 11.44bn project financing; construction & lease-up risk in a developing Riyadh retail market.",
        funded:48, nonfunded:10, limit:70, rating:"5 (Watch)", since:"2019", ubo:"Mabanee 60%" },
      { id:"souk-sabah", name:"Souk Sabah (S3)", short:"S3", sector:"Retail & Hospitality",
        rag:"green", ragReason:"KD25M green-loan project; LEED Gold target, completion 2028.",
        funded:12, nonfunded:2, limit:20, rating:"4 (Satisfactory)", since:"2024", ubo:"Mabanee" },
    ]},
    { group:"Boubyan Group", members:[
      { id:"boubyan-bank", name:"Boubyan Bank", short:"BY", sector:"Islamic Banking", ticker:"BOUBYAN", parent:true,
        rag:"green", ragReason:"3rd-largest Kuwait bank by financing; problem-financing ratio 1.0% vs 1.7% sector.",
        funded:14, nonfunded:20, limit:45, rating:"3 (Strong)", since:"2010", ubo:"National Bank of Kuwait (majority)",
        pub:{net:0, cur:"KWD M", year:"9M2024", rating:"Fitch A/Stable; Moody's A2", note:"Net profit +25% YoY (9M2024); CET1 13.7%; ~89% deposit-funded.", src:"Fitch (Dec 2024); Moody's (Jun 2025)"},
        news:[{t:"Moody's affirms Boubyan Bank at A2/Stable", s:"Cites improving asset quality, a solid deposit franchise and growing market share as Kuwait's 3rd-largest lender.", date:"29 Jun 2025", rag:"green"}] },
      { id:"bpc", name:"Boubyan Petrochemical (BPC)", short:"BP", sector:"Petrochemicals Holding", ticker:"BPCC",
        rag:"green", ragReason:"Investment holding; healthy margins (~38%).",
        funded:18, nonfunded:4, limit:30, rating:"4 (Satisfactory)", since:"2012", ubo:"Boubyan-linked",
        pub:{rev:334, cur:"USD M", year:"FY to Apr 2025", note:"Revenue ~US$334M; net margin ~38%. Fiscal year ends 30 April.", src:"GlobalData / Boursa Kuwait"} },
      { id:"boubyan-takaful", name:"Boubyan Takaful Insurance", short:"BT", sector:"Takaful Insurance",
        rag:"green", ragReason:"Stable underwriting; within limits.",
        funded:4, nonfunded:1, limit:8, rating:"4 (Satisfactory)", since:"2013", ubo:"Boubyan Group" },
      { id:"blme", name:"Bank of London & Middle East (BLME)", short:"BL", sector:"Islamic Banking (UK)",
        rag:"amber", ragReason:"UK Sharia-compliant bank; private since 2021 — limited public disclosure.",
        funded:10, nonfunded:3, limit:18, rating:"4 (Satisfactory)", since:"2021", ubo:"Boubyan Bank (100%)" },
    ]},
    { group:"Combined Group Contracting", members:[
      { id:"cgc", name:"Combined Group Contracting (CGC)", short:"CG", sector:"Construction & Contracting", ticker:"CGCK", parent:true,
        rag:"amber", ragReason:"Revenue +53% YoY but two active disputes (MPW, KOC) and heavy government-receivable concentration.",
        funded:40, nonfunded:22, limit:75, rating:"5 (Watch)", since:"2007", ubo:"Listed; founding family",
        pub:{rev:254.5, net:15.8, cur:"KWD M", year:"FY2025", note:"Projects on hand ~US$640M; clients heavily government/quasi-government.", src:"Boursa Kuwait / Yahoo Finance"},
        news:[{t:"CGC signs Kuwait Oil Company flowlines contract (RFP-2141028)", s:"New KOC award for construction of flowlines and associated works — adds to the order book.", date:"Q1 2026", rag:"green"},
              {t:"CGC awarded US Army Corps of Engineers construction package", s:"USACE contract win indicating cross-regional reach beyond Gulf government clients.", date:"Early 2026", rag:"green"}] },
      { id:"cgc-rocks", name:"Combined Group Rocks", short:"CR", sector:"Quarrying & Materials",
        rag:"green", ragReason:"Supplies aggregates to parent; steady.",
        funded:7, nonfunded:2, limit:14, rating:"4 (Satisfactory)", since:"2012", ubo:"CGC" },
      { id:"cgc-energy", name:"Combined Energy", short:"CE", sector:"Oil & Gas Services",
        rag:"green", ragReason:"Supports O&G project work; within limits.",
        funded:9, nonfunded:5, limit:18, rating:"4 (Satisfactory)", since:"2014", ubo:"CGC" },
      { id:"cgc-emirates", name:"CGC Emirates", short:"CM", sector:"Contracting (UAE)",
        rag:"amber", ragReason:"UAE backlog conversion slower; margins thin.",
        funded:12, nonfunded:6, limit:22, rating:"5 (Watch)", since:"2015", ubo:"CGC" },
    ]},
    { group:"Gulf Cable Group", members:[
      { id:"gulf-cable", name:"Gulf Cable & Electrical Industries", short:"GC", sector:"Electrical / Cables", ticker:"CABLE", parent:true,
        rag:"green", ragReason:"Low leverage (<0.1x D/E); profit sensitive to copper/aluminium prices and equity portfolio.",
        funded:12, nonfunded:4, limit:24, rating:"3 (Strong)", since:"2007", ubo:"Listed; widely held",
        pub:{rev:123.1, net:20.8, cur:"KWD M", year:"FY2024", note:"Total assets KWD 326M; borrowings < KWD 27M (D/E < 0.1x). 50th anniversary in 2025.", src:"Gulf Cable AR 2024"},
        news:[{t:"Gulf Cable builds ~27% stake in First Investment Company", s:"Open-market purchases (KD16.4M) crossed the significant-influence threshold, reclassifying it as an equity-method associate.", date:"Q3 2025", rag:"amber"}] },
      { id:"gc-jordan", name:"Gulf Cable & Multi Industries (Jordan)", short:"GJ", sector:"Cable Manufacturing",
        rag:"green", ragReason:"Jordan sales +31% YoY.",
        funded:8, nonfunded:2, limit:14, rating:"4 (Satisfactory)", since:"2013", ubo:"Gulf Cable" },
      { id:"gc-hvac", name:"Refrigeration & A/C Systems Co.", short:"RA", sector:"HVAC Services",
        rag:"green", ragReason:"Acquired 2024; integrating into services segment.",
        funded:5, nonfunded:1, limit:9, rating:"4 (Satisfactory)", since:"2024", ubo:"Gulf Cable" },
      { id:"heisco", name:"HEISCO (associate)", short:"HE", sector:"Industrial / Marine / O&G", ticker:"HEISCO",
        rag:"green", ragReason:"Net profit +28% YoY; associate of the group (28.3%).",
        funded:14, nonfunded:6, limit:24, rating:"4 (Satisfactory)", since:"2011", ubo:"Gulf Cable 28.3%" },
    ]},
  ];

  // ---- synthesise full company records (mock banking detail) ----
  const SEC = {
    "Construction & Contracting":{tl:"Term Loan", nf:"Performance Guarantee Line", sec:"Assignment of contract proceeds", m:"CBK + 3.00%"},
    "Real Estate":{tl:"Term Loan (CRE)", nf:"Guarantee Line", sec:"Mortgage over property", m:"CBK + 2.75%"},
    "Real Estate / Malls":{tl:"Term Loan (CRE)", nf:"Guarantee Line", sec:"Mortgage & rental assignment", m:"CBK + 2.60%"},
    "Retail Mall":{tl:"Term Loan (CRE)", nf:"Guarantee Line", sec:"Mortgage & rental assignment", m:"CBK + 2.55%"},
    "Petrochemicals":{tl:"Term Loan", nf:"LC / Trade Line", sec:"Plant & assignment", m:"CBK + 2.90%"},
    "Building Materials":{tl:"Term Loan", nf:"LC Line", sec:"Plant & machinery", m:"CBK + 2.50%"},
  };
  const def = {tl:"Term Loan", nf:"Guarantee Line", sec:"Corporate guarantee", m:"CBK + 2.60%"};
  const EXP = ["Mar 2026","Aug 2026","Dec 2026","Jun 2027","Dec 2027","Sep 2028"];
  const r2 = (n)=>Math.round(n*10)/10;

  function facilities(c, i){
    const s = SEC[c.sector] || def;
    const out = [];
    const tlUtil = r2(c.funded*0.62), wcUtil = r2(c.funded - tlUtil);
    out.push({type:s.tl, limit:r2(c.limit*0.5), util:tlUtil, expiry:EXP[(i+3)%EXP.length], margin:s.m, sec:s.sec});
    out.push({type:"Revolving Working Capital", limit:r2(c.limit*0.3), util:wcUtil, expiry:EXP[(i+1)%EXP.length], margin:"CBK + 2.80%", sec:"Receivables & inventory"});
    if(c.nonfunded>0) out.push({type:s.nf, limit:r2(Math.max(c.nonfunded, c.limit*0.2)), util:c.nonfunded, expiry:EXP[(i+2)%EXP.length], margin:"1.10% p.a.", sec:"Counter-indemnity"});
    return out;
  }
  const MEMO_SETS = [
    {dcr:"done",risk:"done",cinet:"done",presentation:"done",spreading:"done"},
    {dcr:"review",risk:"done",cinet:"done",presentation:"progress",spreading:"done"},
    {dcr:"progress",risk:"progress",cinet:"done",presentation:"pending",spreading:"done"},
    {dcr:"review",risk:"progress",cinet:"done",presentation:"pending",spreading:"progress"},
    {dcr:"pending",risk:"pending",cinet:"progress",presentation:"pending",spreading:"progress"},
  ];

  const r3=(n)=>Math.round(n*100)/100;
  function classify(c, idx){
    const fac=facilities(c, idx); let cl=0,cu=0,nl=0,nu=0;
    fac.forEach(f=>{ const nc=/Guarantee|LC|Trade/.test(f.type); if(nc){nl+=f.limit;nu+=f.util;}else{cl+=f.limit;cu+=f.util;} });
    return {fac, cash:{limit:r2(cl),util:r2(cu)}, nonCash:{limit:r2(nl),util:r2(nu)}};
  }
  function synthExposure(c, idx){ const x=classify(c,idx);
    return {cash:x.cash, nonCash:x.nonCash, total:{limit:r2(x.cash.limit+x.nonCash.limit), util:r2(x.cash.util+x.nonCash.util)}}; }
  function synthMarket(c, idx){ const e=synthExposure(c,idx);
    const sC=0.18+(idx%5)*0.06, sN=0.15+(idx%4)*0.07;
    const mc={limit:r2(e.cash.limit/sC), util:r2(e.cash.util/sC)};
    const mn={limit:e.nonCash.limit?r2(e.nonCash.limit/sN):0, util:e.nonCash.util?r2(e.nonCash.util/sN):0};
    const mt={limit:r2(mc.limit+mn.limit), util:r2(mc.util+mn.util)};
    return {cash:mc, nonCash:mn, total:mt,
      share: mt.util?e.total.util/mt.util:0,
      shareCash: mc.util?e.cash.util/mc.util:0,
      shareNonCash: mn.util?e.nonCash.util/mn.util:0 }; }
  function synthIncome(c, idx){
    const tot=c.funded+c.nonfunded, F={"2023":0.86,"2024":0.94,"2025":1.0,"YTD 2026":0.42}, w=(idx%7)*0.02;
    const out={};
    Object.entries(F).forEach(([y,f])=>{
      const nii=r3((c.funded*0.052+w)*f), fx=r3((tot*0.006)*f), liab=r3((tot*0.013)*f),
            lc=r3((c.nonfunded*0.020)*f), lg=r3((c.nonfunded*0.016)*f), fees=r3((tot*0.004)*f);
      out[y]={nii,fx,liab,lc,lg,fees,total:r3(nii+fx+liab+lc+lg+fees)};
    });
    return out;
  }
  function synthRorwa(c){ const rwa=c.funded*1.0+c.nonfunded*0.5; const inc=c.funded*0.052+(c.funded+c.nonfunded)*0.023; return rwa?((inc/rwa)*100).toFixed(1)+"%":"—"; }
  function synthCovenants(c){
    const red=c.rag==="red", amb=c.rag==="amber";
    return [
      {name:"Debt-service coverage (DSCR)", req:"≥ 1.25x", actual: red?"1.08x":amb?"1.31x":"1.66x", status: red?"breach":amb?"watch":"ok"},
      {name:"Net debt / EBITDA", req:"≤ 3.5x", actual: red?"3.9x":amb?"3.2x":"2.4x", status: red?"breach":"ok"},
      {name:"Tangible net worth", req:"≥ KWD "+Math.round(c.limit*0.6)+"M", actual:"KWD "+Math.round(c.limit*(red?0.55:0.95))+"M", status: red?"watch":"ok"},
    ];
  }
  function synthDocs(c, idx){
    const D=["Mar 2026","May 2026","Aug 2026","Nov 2026","Feb 2027"];
    const st=(i)=> (idx+i)%5===0?"due-soon":"current";
    return [
      {doc:"Audited financials FY2025", due:D[idx%5], status: c.rag==="red"?"overdue":"current"},
      {doc:"Insurance — asset cover", due:D[(idx+1)%5], status: st(1)},
      {doc:"KYC periodic review", due: c.rag==="red"?"Overdue":D[(idx+2)%5], status: c.rag==="red"?"overdue":"current"},
      {doc:"Collateral valuation", due:D[(idx+3)%5], status: st(3)},
      {doc:"Facility expiry — lead facility", due:D[(idx+4)%5], status: st(4)},
    ];
  }
  function synthCollateral(c, idx){
    const secured=r2(c.funded*0.7+c.nonfunded), cov=c.rag==="red"?0.9:c.rag==="amber"?1.15:1.42, val=r2(secured*cov);
    const T={"Real Estate":"First mortgage over property","Real Estate / Malls":"Mortgage & rental assignment","Retail Mall":"Mortgage & rental assignment","Construction & Contracting":"Assignment of contract proceeds","Petrochemicals":"Plant, machinery & assignment","Building Materials":"Plant & machinery","Electrical / Cables":"Plant & inventory pledge"};
    return { items:[{type:T[c.sector]||"Corporate guarantee & receivables", value:val},{type:"Cash margin / lien", value:r2(c.nonfunded*0.15)}],
      secured, coverage: secured?Math.round(val/secured*100):0 };
  }
  const companies = [];
  let gi=0;
  GROUPS.forEach(g=>{
    g.members.forEach((m, j)=>{
      const idx = companies.length;
      const util = r2(m.funded + m.nonfunded);
      const roeBase = 8 + ((idx*7)%12);
      companies.push(Object.assign({
        group:g.group,
        cr:"CR " + (20000 + idx*1374 % 79999),
        util,
        kyc:{ inc:String(1980 + (idx*3)%30), domicile: m.sector.includes("UK")?"United Kingdom":m.sector.includes("KSA")?"Saudi Arabia":"Kuwait",
          review: m.rag==="red"?"Overdue — refresh required":["Mar 2026","May 2026","Aug 2026","Nov 2026","Feb 2027"][idx%5],
          status: m.rag==="red"?"Refresh required":"Current" },
        profit:{ revenue: m.pub&&m.pub.rev?m.pub.rev:r2(util*0.9+5), revCur: m.pub&&m.pub.cur?m.pub.cur:"KWD M",
          nii:r2(util*0.18+0.3), fees:r2(util*0.07+0.2), roe:roeBase.toFixed(1)+"%", prevRoe:(roeBase-1.1).toFixed(1)+"%" },
        facilities: facilities(m, idx),
        memo: m.memo || MEMO_SETS[idx % MEMO_SETS.length],
        news: m.news || [],
        exposure: synthExposure(m, idx),
        market: synthMarket(m, idx),
        income: synthIncome(m, idx),
        rorwa: synthRorwa(m),
        covenants: synthCovenants(m),
        documents: synthDocs(m, idx),
        collateral: synthCollateral(m, idx),
      }, m));
    });
    gi++;
  });
  const byId={}; companies.forEach(c=>byId[c.id]=c);

  // ---- requests (CRN) ----
  const requests = [
    { id:"CRN-3071", companyId:"cgc", type:"Performance Guarantee Issuance", raised:"26 Jun", owner:"Coordination — Layla H.", status:"Pending Docs", atRisk:true,
      followup:"Hi Layla, CRN-3071 — the performance guarantee for Combined Group Contracting's new KOC flowlines award — has been pending docs for several days. The client needs it issued before mobilisation. Could you confirm exactly which items are outstanding so I can collect them in one go? Happy to escalate if it helps hit the deadline." },
    { id:"CRN-3068", companyId:"noor", type:"Covenant Waiver Request", raised:"25 Jun", owner:"Coordination — Fatima A.", status:"Submitted", atRisk:true,
      followup:"Hi Fatima, flagging CRN-3068 — Noor Financial Investment's covenant waiver. Given quarter-end timing, can we prioritise routing to credit? The client expects an indicative response by Thursday. Let me know what's outstanding from our side." },
    { id:"CRN-3065", companyId:"shomoul", type:"Facility Drawdown (Avenues Riyadh)", raised:"24 Jun", owner:"Coordination — Omar K.", status:"In Progress", atRisk:false, followup:null },
    { id:"CRN-3061", companyId:"bpc", type:"FX Line Renewal", raised:"23 Jun", owner:"Coordination — Layla H.", status:"Pending Docs", atRisk:true,
      followup:"Hi Layla, Boubyan Petrochemical's FX line (CRN-3061) lapses shortly and renewal is still pending docs. Their fiscal year ends 30 April, so the audited financials are available — can we confirm receipt and move this forward today?" },
    { id:"CRN-3058", companyId:"kipco", type:"Bond Refinancing Facility", raised:"22 Jun", owner:"Coordination — Omar K.", status:"In Progress", atRisk:false, followup:null },
    { id:"CRN-3054", companyId:"tamdeen-malls", type:"LC Issuance", raised:"21 Jun", owner:"Coordination — Fatima A.", status:"In Progress", atRisk:false, followup:null },
    { id:"CRN-3050", companyId:"tristar", type:"Account Opening (Subsidiary)", raised:"20 Jun", owner:"Coordination — Layla H.", status:"Pending Docs", atRisk:true,
      followup:"Hi Layla, Tristar's new subsidiary account (CRN-3050) has been pending docs for a week. Could you confirm which KYC items remain so I can collect them from the client in a single request?" },
    { id:"CRN-3046", companyId:"gulf-cable", type:"Limit Increase", raised:"19 Jun", owner:"Coordination — Omar K.", status:"In Progress", atRisk:false, followup:null },
    { id:"CRN-3042", companyId:"urc", type:"Collateral Re-valuation", raised:"18 Jun", owner:"Coordination — Fatima A.", status:"In Progress", atRisk:false, followup:null },
    { id:"CRN-3038", companyId:"nicbm", type:"Facility Drawdown", raised:"16 Jun", owner:"Coordination — Layla H.", status:"Completed", atRisk:false, followup:null },
    { id:"CRN-3033", companyId:"burgan", type:"Guarantee Issuance", raised:"15 Jun", owner:"Coordination — Omar K.", status:"Completed", atRisk:false, followup:null },
    { id:"CRN-3029", companyId:"mabanee", type:"Green Loan Drawdown (Souk Sabah)", raised:"14 Jun", owner:"Coordination — Fatima A.", status:"In Progress", atRisk:false, followup:null },
  ];

  const todos = [
    { id:"t1", text:"Issue performance guarantee for CGC's KOC flowlines award — client mobilising", meta:"Linked to CRN-3071 · pending docs", prio:"high", companyId:"cgc", done:false },
    { id:"t2", text:"Finalise credit memo for the Mabanee — Avenues Riyadh drawdown", meta:"Committee Thursday · memo in review", prio:"high", companyId:"shomoul", done:false },
    { id:"t3", text:"Review Noor Financial covenant-waiver position", meta:"Investment-company earnings volatile · waiver requested", prio:"high", companyId:"noor", done:false },
    { id:"t4", text:"Chase outstanding KYC for Tristar subsidiary account", meta:"Linked to CRN-3050 · pending docs 7 days", prio:"med", companyId:"tristar", done:false },
    { id:"t5", text:"Renew Boubyan Petrochemical FX line before lapse", meta:"Linked to CRN-3061", prio:"med", companyId:"bpc", done:false },
    { id:"t6", text:"Prepare group profitability pack for KIPCO Group review", meta:"Quarterly group relationship review", prio:"med", companyId:"kipco", done:false },
    { id:"t7", text:"Acknowledge completed drawdown — National Industries Co. (NICBM)", meta:"Linked to CRN-3038 · completed", prio:"low", companyId:"nicbm", done:true },
  ];

  const feed = [
    { id:"n1", kind:"client", companyId:"kipco", t:"Fitch revises KIPCO outlook to Stable, affirms BB-", s:"Net loan-to-value fell to 37.2% after ~US$936M of 2025 asset monetisation. Supports our holding-company exposure view.", rag:"green", time:"16 Dec 2025" },
    { id:"n2", kind:"client", companyId:"mabanee", t:"Mabanee & NBK sign Kuwait's first green loan (KD25M)", s:"Souk Sabah financed via a Sharia-compliant green loan — relevant to our Souk Sabah drawdown in progress.", rag:"green", time:"Nov 2025" },
    { id:"n3", kind:"client", companyId:"cgc", t:"CGC signs Kuwait Oil Company flowlines contract", s:"New KOC award adds to the order book — and to our pending performance-guarantee request.", rag:"green", time:"Q1 2026" },
    { id:"n4", kind:"client", companyId:"noor", t:"Investment-company earnings stay volatile across the sector", s:"Reinforces the Noor Financial covenant-waiver discussion now under review.", rag:"red", time:"2d" },
    { id:"n5", kind:"client", companyId:"taminv", t:"Tamdeen acquires majority stake in 4Sale International", s:"First major digital investment — broadens the group beyond physical real estate.", rag:"green", time:"02 Jun 2026" },
    { id:"n6", kind:"market", companyId:null, t:"CBK holds discount rate steady", s:"No change to policy rate; pricing on floating CBK-linked facilities unaffected this cycle.", rag:"green", time:"3d" },
    { id:"n7", kind:"market", companyId:null, t:"Proposed industrial power tariff revision under consultation", s:"Energy-intensive names flagged as cost-exposed — watch QPIC, Ikarus, NICBM.", rag:"amber", time:"6d" },
    { id:"n8", kind:"client", companyId:"agility", t:"ROSHN & Agility Logistics Parks sign Saudi JV", s:"Material KSA expansion for the logistics parks business; supports group appetite.", rag:"green", time:"2025" },
  ];

  // ---- Leads: uploaded prospect list, matched against the bank's ~50 corporate clients ----
  const leads = [
    { id:"l1", name:"Mezzan Holding Co.", sector:"Food & Consumer", isClient:false, clearance:"none", stage:null },
    { id:"l2", name:"Humansoft Holding Co.", sector:"Education", isClient:false, clearance:"none", stage:null },
    { id:"l3", name:"Combined Group Contracting", sector:"Construction", isClient:true, clearance:"existing", stage:null },
    { id:"l4", name:"Jazeera Airways", sector:"Aviation", isClient:false, clearance:"none", stage:null },
    { id:"l5", name:"Mabanee Company", sector:"Real Estate", isClient:true, clearance:"existing", stage:null },
    { id:"l6", name:"ACICO Industries", sector:"Building Materials", isClient:false, clearance:"none", stage:null },
    { id:"l7", name:"Gulf Cable & Electrical Industries", sector:"Industrials", isClient:true, clearance:"existing", stage:null },
    { id:"l8", name:"Kuwait Cement Co.", sector:"Building Materials", isClient:false, clearance:"none", stage:null },
    { id:"l9", name:"Integrated Holding Co.", sector:"Oil & Gas Services", isClient:false, clearance:"none", stage:null },
    { id:"l10", name:"Agility Global", sector:"Logistics", isClient:true, clearance:"existing", stage:null },
    { id:"l11", name:"Salhia Real Estate Co.", sector:"Real Estate", isClient:false, clearance:"none", stage:null },
    { id:"l12", name:"ALAFCO Aviation Lease & Finance", sector:"Aviation Leasing", isClient:false, clearance:"none", stage:null },
    { id:"l13", name:"Mezzan Industries", sector:"Manufacturing", isClient:false, clearance:"none", stage:null },
    { id:"l14", name:"Kuwait & Gulf Link Transport", sector:"Logistics", isClient:false, clearance:"none", stage:null },
    { id:"l15", name:"Alimtiaz Investment Group", sector:"Investment", isClient:false, clearance:"none", stage:null },
  ];
  leads[8].clearance="cleared"; leads[8].stage="Meeting Set";   // Integrated Holding
  leads[10].clearance="cleared"; leads[10].stage="Contacted";   // Salhia

  const groups = (()=>{ const g={}; companies.forEach(c=>{ const k=c.group||"Standalone Companies"; (g[k]=g[k]||[]).push(c); }); return g; })();

  const fmt = (n)=> "KWD " + Number(n).toLocaleString("en-US",{minimumFractionDigits:1,maximumFractionDigits:1}) + "M";
  const fmtPub = (v,cur)=>{ if(cur==="USD M") return "US$ " + Number(v).toLocaleString("en-US",{maximumFractionDigits:0}) + "M"; if(cur==="KWD M") return "KWD " + Number(v).toLocaleString("en-US",{minimumFractionDigits:1,maximumFractionDigits:2}) + "M"; return v; };

  return { rm, disclaimer, companies, byId, requests, todos, feed, leads, groups, fmt, fmtPub };
})();
