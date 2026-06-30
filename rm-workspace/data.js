/* Shared mock dataset for the RM Workspace prototype.
   Defined once, referenced by every page. All figures are illustrative (KWD millions). */
window.DB = (function () {
  const rm = { name: "Yousef Al-Sabah", role: "Senior Relationship Manager · Corporate", initials: "YA", desk: "Corporate Banking — Large Cap" };

  const C = (o) => Object.assign({
    rag: "green", news: [], facilities: [], notes: "",
  }, o);

  const companies = [
    C({ id:"alrai-holding", name:"Al-Rai Holding Co.", short:"AH", group:"Al-Rai Holding Group", parent:true,
      sector:"Diversified Holding", cr:"CR 84213", rating:"4 (Satisfactory)", since:"2009", rag:"green",
      ragReason:"All facilities performing; group review current.",
      funded:42.5, nonfunded:18.2, limit:75, util:60.7, ubo:"Al-Rai family (78%)",
      kyc:{ inc:"1991", review:"Mar 2026", status:"Current", domicile:"Kuwait" },
      profit:{ revenue:1.92, nii:1.18, fees:0.74, roe:"14.2%", prevRoe:"13.1%" },
      facilities:[
        {type:"Term Loan", limit:30, util:22.5, expiry:"Jun 2027", margin:"CBK + 2.25%", sec:"Corporate guarantee"},
        {type:"Overdraft", limit:15, util:9.1, expiry:"Mar 2026", margin:"CBK + 3.00%", sec:"Cash flow"},
        {type:"Guarantee Line", limit:18.2, util:18.2, expiry:"Dec 2026", margin:"1.10% p.a.", sec:"Counter-indemnity"},
        {type:"FX Line", limit:11.8, util:10.9, expiry:"Mar 2026", margin:"—", sec:"Master agreement"},
      ],
      memo:{dcr:"done", risk:"done", cinet:"done", presentation:"done", spreading:"done"},
      news:[
        {t:"Al-Rai Holding posts 11% YoY rise in FY25 consolidated revenue", s:"Group results beat guidance, driven by trading and real-estate segments; net margin steady at 12.4%.", rag:"green", time:"2d"},
      ]}),
    C({ id:"alrai-realestate", name:"Al-Rai Real Estate Co.", short:"AR", group:"Al-Rai Holding Group",
      sector:"Real Estate", cr:"CR 91077", rating:"5 (Watch)", since:"2012", rag:"amber",
      ragReason:"Occupancy on flagship asset down to 81%; renewal under review.",
      funded:28.0, nonfunded:3.5, limit:35, util:31.5, ubo:"Al-Rai Holding (100%)",
      kyc:{ inc:"1998", review:"Aug 2026", status:"Current", domicile:"Kuwait" },
      profit:{ revenue:0.81, nii:0.62, fees:0.19, roe:"9.1%", prevRoe:"10.4%" },
      facilities:[
        {type:"Term Loan (CRE)", limit:25, util:23.0, expiry:"Sep 2026", margin:"CBK + 2.75%", sec:"Mortgage — Salmiya tower"},
        {type:"Overdraft", limit:10, util:5.0, expiry:"Mar 2026", margin:"CBK + 3.25%", sec:"Rental assignment"},
      ],
      memo:{dcr:"review", risk:"done", cinet:"done", presentation:"progress", spreading:"done"},
      news:[
        {t:"Salmiya office occupancy slips as new supply enters market", s:"Sector report flags softening prime rents; Al-Rai Real Estate's flagship tower occupancy estimated near 80%.", rag:"amber", time:"4d"},
      ]}),
    C({ id:"alrai-trading", name:"Al-Rai Trading Co.", short:"AT", group:"Al-Rai Holding Group",
      sector:"Trading & Distribution", cr:"CR 77519", rating:"4 (Satisfactory)", since:"2010", rag:"green",
      ragReason:"Working-capital lines well within limit; receivables current.",
      funded:14.0, nonfunded:9.0, limit:28, util:23.0, ubo:"Al-Rai Holding (100%)",
      kyc:{ inc:"2004", review:"Jan 2027", status:"Current", domicile:"Kuwait" },
      profit:{ revenue:0.66, nii:0.41, fees:0.25, roe:"15.8%", prevRoe:"15.0%" },
      facilities:[
        {type:"Revolving WC", limit:18, util:11.0, expiry:"Jul 2026", margin:"CBK + 2.50%", sec:"Inventory & receivables"},
        {type:"LC / Trade Line", limit:10, util:9.0, expiry:"Jul 2026", margin:"0.85% / quarter", sec:"Pledged goods"},
      ],
      memo:{dcr:"progress", risk:"progress", cinet:"done", presentation:"pending", spreading:"done"},
      news:[]}),
    C({ id:"alrai-media", name:"Al-Rai Media Group", short:"AM", group:"Al-Rai Holding Group",
      sector:"Media & Publishing", cr:"CR 65402", rating:"6 (Substandard watch)", since:"2014", rag:"red",
      ragReason:"Facility renewal due in 2 days; ad revenue down 18% YoY.",
      funded:9.5, nonfunded:1.0, limit:12, util:10.5, ubo:"Al-Rai Holding (85%)",
      kyc:{ inc:"2001", review:"Overdue — Jul 2025", status:"Refresh required", domicile:"Kuwait" },
      profit:{ revenue:0.22, nii:0.18, fees:0.04, roe:"5.3%", prevRoe:"8.9%" },
      facilities:[
        {type:"Term Loan", limit:8, util:7.5, expiry:"02 Jul 2026", margin:"CBK + 3.50%", sec:"Corporate guarantee"},
        {type:"Overdraft", limit:4, util:3.0, expiry:"02 Jul 2026", margin:"CBK + 4.00%", sec:"—"},
      ],
      memo:{dcr:"review", risk:"progress", cinet:"done", presentation:"pending", spreading:"progress"},
      news:[
        {t:"Print advertising spend in region falls for fifth straight quarter", s:"Industry data points to accelerating shift to digital; legacy publishers face margin pressure.", rag:"red", time:"1d"},
      ]}),

    C({ id:"gulf-cement", name:"Gulf Cement Co.", short:"GC", group:"Gulf Cement Group", parent:true,
      sector:"Building Materials", cr:"CR 33218", rating:"4 (Satisfactory)", since:"2007", rag:"amber",
      ragReason:"New facility for kiln upgrade goes to committee Thursday.",
      funded:55.0, nonfunded:22.0, limit:95, util:77.0, ubo:"Listed (free float 41%)",
      kyc:{ inc:"1984", review:"May 2026", status:"Current", domicile:"Kuwait" },
      profit:{ revenue:2.41, nii:1.55, fees:0.86, roe:"13.0%", prevRoe:"12.2%" },
      facilities:[
        {type:"Term Loan", limit:40, util:34.0, expiry:"Dec 2028", margin:"CBK + 2.40%", sec:"Plant & machinery"},
        {type:"Revolving WC", limit:25, util:21.0, expiry:"Aug 2026", margin:"CBK + 2.60%", sec:"Receivables"},
        {type:"Guarantee Line", limit:22, util:22.0, expiry:"Dec 2026", margin:"1.05% p.a.", sec:"Counter-indemnity"},
        {type:"LC Line", limit:8, util:0.0, expiry:"Aug 2026", margin:"0.80% / quarter", sec:"Pledged imports"},
      ],
      memo:{dcr:"review", risk:"done", cinet:"done", presentation:"progress", spreading:"done"},
      news:[
        {t:"Government infrastructure pipeline lifts regional cement demand outlook", s:"Analysts upgrade FY26 volume forecasts on back of new housing and road projects; pricing firm.", rag:"green", time:"3d"},
        {t:"Energy tariff revision could raise clinker production costs", s:"Proposed industrial power tariff change flagged as a margin risk for energy-intensive producers.", rag:"amber", time:"6d"},
      ]}),
    C({ id:"gulf-readymix", name:"Gulf Ready-Mix Co.", short:"GR", group:"Gulf Cement Group",
      sector:"Building Materials", cr:"CR 51980", rating:"4 (Satisfactory)", since:"2011", rag:"green",
      ragReason:"Performing; order book strong on infrastructure demand.",
      funded:12.0, nonfunded:6.0, limit:22, util:18.0, ubo:"Gulf Cement Co. (75%)",
      kyc:{ inc:"2003", review:"May 2026", status:"Current", domicile:"Kuwait" },
      profit:{ revenue:0.54, nii:0.34, fees:0.20, roe:"16.1%", prevRoe:"15.4%" },
      facilities:[
        {type:"Revolving WC", limit:14, util:10.0, expiry:"Aug 2026", margin:"CBK + 2.70%", sec:"Receivables"},
        {type:"Equipment Finance", limit:8, util:8.0, expiry:"Apr 2027", margin:"CBK + 2.90%", sec:"Mixer fleet"},
      ],
      memo:{dcr:"progress", risk:"progress", cinet:"done", presentation:"pending", spreading:"done"},
      news:[]}),
    C({ id:"gulf-aggregates", name:"Gulf Aggregates Co.", short:"GA", group:"Gulf Cement Group",
      sector:"Mining & Materials", cr:"CR 60114", rating:"5 (Watch)", since:"2013", rag:"green",
      ragReason:"Within limits; quarry concession renewed through 2031.",
      funded:7.0, nonfunded:2.0, limit:14, util:9.0, ubo:"Gulf Cement Co. (60%)",
      kyc:{ inc:"2008", review:"Nov 2026", status:"Current", domicile:"Kuwait" },
      profit:{ revenue:0.31, nii:0.21, fees:0.10, roe:"12.7%", prevRoe:"12.9%" },
      facilities:[
        {type:"Term Loan", limit:9, util:6.0, expiry:"Oct 2027", margin:"CBK + 2.80%", sec:"Quarry equipment"},
        {type:"Overdraft", limit:5, util:3.0, expiry:"Aug 2026", margin:"CBK + 3.20%", sec:"—"},
      ],
      memo:{dcr:"pending", risk:"pending", cinet:"progress", presentation:"pending", spreading:"progress"},
      news:[]}),

    C({ id:"burgan-logistics", name:"Burgan Logistics Co.", short:"BL", group:"Burgan Industrial Group", parent:true,
      sector:"Logistics & Transport", cr:"CR 70226", rating:"4 (Satisfactory)", since:"2015", rag:"green",
      ragReason:"Strong cash conversion; new 3PL contract signed.",
      funded:19.0, nonfunded:5.0, limit:32, util:24.0, ubo:"Burgan family (64%)",
      kyc:{ inc:"2006", review:"Feb 2027", status:"Current", domicile:"Kuwait" },
      profit:{ revenue:0.88, nii:0.55, fees:0.33, roe:"17.4%", prevRoe:"16.2%" },
      facilities:[
        {type:"Term Loan", limit:18, util:13.0, expiry:"Mar 2028", margin:"CBK + 2.35%", sec:"Fleet & warehouse"},
        {type:"Revolving WC", limit:14, util:11.0, expiry:"Sep 2026", margin:"CBK + 2.55%", sec:"Receivables"},
      ],
      memo:{dcr:"done", risk:"done", cinet:"done", presentation:"review", spreading:"done"},
      news:[
        {t:"Burgan Logistics wins multi-year 3PL contract with regional retailer", s:"Deal expected to add double-digit revenue uplift from FY26; warehouse expansion planned.", rag:"green", time:"5d"},
      ]}),
    C({ id:"burgan-steel", name:"Burgan Steel Industries", short:"BS", group:"Burgan Industrial Group",
      sector:"Metals Manufacturing", cr:"CR 81443", rating:"5 (Watch)", since:"2016", rag:"amber",
      ragReason:"Margins squeezed by input costs; covenant headroom thinning.",
      funded:23.0, nonfunded:7.0, limit:34, util:30.0, ubo:"Burgan Logistics (70%)",
      kyc:{ inc:"2010", review:"Apr 2026", status:"Current", domicile:"Kuwait" },
      profit:{ revenue:0.74, nii:0.51, fees:0.23, roe:"8.6%", prevRoe:"11.1%" },
      facilities:[
        {type:"Term Loan", limit:20, util:17.0, expiry:"Jun 2027", margin:"CBK + 2.90%", sec:"Plant & machinery"},
        {type:"Revolving WC", limit:14, util:13.0, expiry:"Sep 2026", margin:"CBK + 3.10%", sec:"Inventory"},
      ],
      memo:{dcr:"progress", risk:"review", cinet:"done", presentation:"pending", spreading:"progress"},
      news:[]}),

    C({ id:"kuwait-food", name:"Kuwait Food Industries Co.", short:"KF", group:null,
      sector:"Food & Beverage Mfg.", cr:"CR 42890", rating:"3 (Strong)", since:"2008", rag:"green",
      ragReason:"Investment-grade profile; diversified, low leverage.",
      funded:31.0, nonfunded:11.0, limit:60, util:42.0, ubo:"Listed (free float 55%)",
      kyc:{ inc:"1989", review:"Oct 2026", status:"Current", domicile:"Kuwait" },
      profit:{ revenue:1.46, nii:0.92, fees:0.54, roe:"18.9%", prevRoe:"18.1%" },
      facilities:[
        {type:"Term Loan", limit:30, util:21.0, expiry:"Dec 2029", margin:"CBK + 1.90%", sec:"Negative pledge"},
        {type:"Revolving WC", limit:18, util:14.0, expiry:"Nov 2026", margin:"CBK + 2.10%", sec:"Clean"},
        {type:"Trade / LC Line", limit:12, util:7.0, expiry:"Nov 2026", margin:"0.70% / quarter", sec:"Pledged goods"},
      ],
      memo:{dcr:"done", risk:"done", cinet:"done", presentation:"done", spreading:"done"},
      news:[
        {t:"Kuwait Food expands cold-chain capacity with new distribution hub", s:"Capex funded from internal accruals; management reiterates low-leverage policy.", rag:"green", time:"1w"},
      ]}),
    C({ id:"marina-petro", name:"Marina Petrochemicals Co.", short:"MP", group:null,
      sector:"Petrochemicals", cr:"CR 29655", rating:"6 (Substandard watch)", since:"2013", rag:"red",
      ragReason:"DSCR covenant headroom breached last quarter; remediation in discussion.",
      funded:48.0, nonfunded:14.0, limit:70, util:62.0, ubo:"Private consortium",
      kyc:{ inc:"2009", review:"Jun 2026", status:"Current", domicile:"Kuwait" },
      profit:{ revenue:1.10, nii:0.83, fees:0.27, roe:"4.1%", prevRoe:"9.7%" },
      facilities:[
        {type:"Term Loan", limit:45, util:40.0, expiry:"Mar 2027", margin:"CBK + 3.20%", sec:"Plant & assignment"},
        {type:"Revolving WC", limit:15, util:8.0, expiry:"Aug 2026", margin:"CBK + 3.40%", sec:"Receivables"},
        {type:"Guarantee Line", limit:10, util:14.0, expiry:"Dec 2026", margin:"1.20% p.a.", sec:"Counter-indemnity"},
      ],
      memo:{dcr:"progress", risk:"review", cinet:"done", presentation:"pending", spreading:"progress"},
      news:[
        {t:"Petrochemical spreads narrow on weaker global demand", s:"Margin compression across the sector; producers with high leverage most exposed.", rag:"red", time:"2d"},
      ]}),
  ];

  const byId = {}; companies.forEach(c => byId[c.id] = c);

  const requests = [
    { id:"CRN-2041", companyId:"alrai-media", type:"Facility Renewal", raised:"24 Jun", owner:"Coordination — Layla H.", status:"Pending Docs", atRisk:true,
      followup:"Hi Layla, the Al-Rai Media renewal (CRN-2041) is due to expire on 2 Jul. We're still pending the updated board resolution and FY25 audited financials. Can we confirm receipt today so the package clears committee in time? Happy to chase the client directly if that helps." },
    { id:"CRN-2038", companyId:"gulf-cement", type:"LC Issuance", raised:"23 Jun", owner:"Coordination — Omar K.", status:"In Progress", atRisk:false, followup:null },
    { id:"CRN-2035", companyId:"marina-petro", type:"Covenant Waiver Request", raised:"22 Jun", owner:"Coordination — Fatima A.", status:"Submitted", atRisk:true,
      followup:"Hi Fatima, flagging CRN-2035 (Marina Petrochemicals covenant waiver) — given the quarter-end timeline, could we prioritise routing to credit? The client is expecting an indicative response by Thursday. Let me know what's outstanding from our side." },
    { id:"CRN-2031", companyId:"alrai-trading", type:"Document Amendment", raised:"21 Jun", owner:"Coordination — Omar K.", status:"In Progress", atRisk:false, followup:null },
    { id:"CRN-2029", companyId:"kuwait-food", type:"Facility Drawdown", raised:"20 Jun", owner:"Coordination — Layla H.", status:"Completed", atRisk:false, followup:null },
    { id:"CRN-2026", companyId:"burgan-logistics", type:"Account Opening (Subsidiary)", raised:"19 Jun", owner:"Coordination — Fatima A.", status:"Pending Docs", atRisk:true,
      followup:"Hi Fatima, Burgan Logistics' new subsidiary account (CRN-2026) has been pending docs for a week. Could you confirm exactly which KYC items are outstanding so I can collect them in one go from the client?" },
    { id:"CRN-2022", companyId:"gulf-readymix", type:"Limit Increase", raised:"18 Jun", owner:"Coordination — Omar K.", status:"In Progress", atRisk:false, followup:null },
    { id:"CRN-2019", companyId:"alrai-realestate", type:"Collateral Re-valuation", raised:"17 Jun", owner:"Coordination — Layla H.", status:"In Progress", atRisk:false, followup:null },
    { id:"CRN-2015", companyId:"burgan-steel", type:"Facility Drawdown", raised:"16 Jun", owner:"Coordination — Fatima A.", status:"Completed", atRisk:false, followup:null },
    { id:"CRN-2011", companyId:"gulf-cement", type:"Guarantee Issuance", raised:"15 Jun", owner:"Coordination — Omar K.", status:"Completed", atRisk:false, followup:null },
    { id:"CRN-2008", companyId:"kuwait-food", type:"LC Amendment", raised:"14 Jun", owner:"Coordination — Layla H.", status:"In Progress", atRisk:false, followup:null },
  ];

  const todos = [
    { id:"t1", text:"Follow up on Al-Rai Media facility renewal — expires in 2 days", meta:"Linked to CRN-2041 · committee window closing", prio:"high", companyId:"alrai-media", done:false },
    { id:"t2", text:"Finalise credit memo for Gulf Cement kiln-upgrade facility", meta:"Committee presentation Thursday · memo in review", prio:"high", companyId:"gulf-cement", done:false },
    { id:"t3", text:"Review Marina Petrochemicals covenant-waiver position", meta:"DSCR headroom breached last quarter", prio:"high", companyId:"marina-petro", done:false },
    { id:"t4", text:"Chase outstanding KYC for Burgan Logistics subsidiary account", meta:"Linked to CRN-2026 · pending docs 7 days", prio:"med", companyId:"burgan-logistics", done:false },
    { id:"t5", text:"Confirm collateral re-valuation booking for Al-Rai Real Estate", meta:"Linked to CRN-2019", prio:"med", companyId:"alrai-realestate", done:false },
    { id:"t6", text:"Prepare group profitability pack for Gulf Cement Group review", meta:"Quarterly group relationship review", prio:"med", companyId:"gulf-cement", done:false },
    { id:"t7", text:"Acknowledge completed drawdown — Kuwait Food Industries", meta:"Linked to CRN-2029 · completed", prio:"low", companyId:"kuwait-food", done:true },
  ];

  const feed = [
    { id:"n1", kind:"client", companyId:"alrai-media", t:"Print advertising spend falls for fifth straight quarter", s:"Regional ad market continues shift to digital; legacy publishers face margin pressure. Relevant to the Al-Rai Media renewal under review.", rag:"red", time:"1d" },
    { id:"n2", kind:"client", companyId:"marina-petro", t:"Petrochemical spreads narrow on weaker global demand", s:"Sector-wide margin compression; highly-leveraged producers most exposed. Reinforces the covenant-waiver discussion.", rag:"red", time:"2d" },
    { id:"n3", kind:"client", companyId:"gulf-cement", t:"Government infrastructure pipeline lifts cement demand outlook", s:"Analysts upgrade FY26 volume forecasts — supportive of the Gulf Cement kiln-upgrade case.", rag:"green", time:"3d" },
    { id:"n4", kind:"market", companyId:null, t:"CBK holds discount rate steady at current level", s:"No change to policy rate; pricing on floating facilities unaffected this cycle.", rag:"green", time:"3d" },
    { id:"n5", kind:"client", companyId:"burgan-logistics", t:"Burgan Logistics wins multi-year 3PL contract", s:"Material revenue uplift expected from FY26; supports limit-increase appetite across the group.", rag:"green", time:"5d" },
    { id:"n6", kind:"market", companyId:null, t:"Proposed industrial power tariff revision under consultation", s:"Energy-intensive sectors (cement, petrochem, steel) flagged as cost-exposed. Watch Gulf Cement, Marina, Burgan Steel.", rag:"amber", time:"6d" },
    { id:"n7", kind:"client", companyId:"alrai-realestate", t:"Prime Salmiya office rents soften on new supply", s:"Occupancy pressure on flagship assets; relevant to Al-Rai Real Estate collateral re-valuation.", rag:"amber", time:"4d" },
  ];

  // Page 4 — leads upload list (the "after upload" matched state)
  const leads = [
    { id:"l1", name:"Najma Industrial Group", sector:"Manufacturing", isClient:false, clearance:"none", stage:null },
    { id:"l2", name:"Al-Manar Real Estate Co.", sector:"Real Estate", isClient:false, clearance:"none", stage:null },
    { id:"l3", name:"Gulf Cement Co.", sector:"Building Materials", isClient:true, clearance:"existing", stage:null },
    { id:"l4", name:"Sahara Foods Co.", sector:"Food & Beverage", isClient:false, clearance:"none", stage:null },
    { id:"l5", name:"Kuwait Food Industries Co.", sector:"Food & Beverage", isClient:true, clearance:"existing", stage:null },
    { id:"l6", name:"Boubyan Plastics Co.", sector:"Manufacturing", isClient:false, clearance:"none", stage:null },
    { id:"l7", name:"Marina Petrochemicals Co.", sector:"Petrochemicals", isClient:true, clearance:"existing", stage:null },
    { id:"l8", name:"Falcon Aviation Services", sector:"Aviation", isClient:false, clearance:"none", stage:null },
    { id:"l9", name:"Diyar United Contracting", sector:"Construction", isClient:false, clearance:"none", stage:null },
    { id:"l10", name:"Al-Mulla Trading Est.", sector:"Trading", isClient:false, clearance:"none", stage:null },
    { id:"l11", name:"Reem Healthcare Holding", sector:"Healthcare", isClient:false, clearance:"none", stage:null },
    { id:"l12", name:"Burgan Steel Industries", sector:"Metals", isClient:true, clearance:"existing", stage:null },
    { id:"l13", name:"Zain Tech Ventures", sector:"Technology", isClient:false, clearance:"none", stage:null },
    { id:"l14", name:"Olympia Marine Co.", sector:"Shipping", isClient:false, clearance:"none", stage:null },
  ];
  // a couple already progressed, to show the end-to-end flow populated
  leads[8].clearance="cleared"; leads[8].stage="Meeting Set";
  leads[10].clearance="cleared"; leads[10].stage="Contacted";

  const groups = (() => {
    const g = {};
    companies.forEach(c => { const k = c.group || "Standalone Companies";
      (g[k] = g[k] || []).push(c); });
    return g;
  })();

  return { rm, companies, byId, requests, todos, feed, leads, groups,
    fmt: (n) => "KWD " + Number(n).toLocaleString("en-US",{minimumFractionDigits:1,maximumFractionDigits:1}) + "M" };
})();
