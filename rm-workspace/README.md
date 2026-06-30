# Meridian — Corporate Banking RM Workspace (Clickable Prototype)

A **front-end-only, clickable prototype** of a modern corporate banking workspace
for a Relationship Manager (RM / RO). Built as a **pitch demo for decision-makers**:
no backend, no database, no login, no live AI. Every screen shows realistic mock
data and **pre-generated content clearly labelled as AI-produced**, telling the
story of a workspace where the AI has *already done the work* and the RM simply
reviews finished artifacts.

## Run it

It's plain HTML/CSS/JS — no install, no build step.

```bash
cd rm-workspace
python3 -m http.server 8000
# then open http://localhost:8000
```

(Or simply open `index.html` directly in a browser.)

## What's inside

| Screen | What it shows |
|---|---|
| **Daily Dashboard** | AI-generated to-do list, AI-summarised news & client signals, and the portfolio with red/amber/green status. |
| **Portfolio Analytics** | Exposure by sector and group, portfolio health donut, top exposures. |
| **Request Tracker (CRN)** | Every request to the coordination unit, with AI "at-risk" flags and pre-drafted follow-up messages. |
| **Case Tracker** | Committee packages by group/company; expand a group to see each entity's component status (Credit Memo, Risk, CINET, Presentation, Spreading). |
| **Credit Memo** | A finished, AI-drafted detailed credit request — review / accept / edit / regenerate each section, then submit to committee. |
| **Leads** | Upload → AI client-matching → request clearance → active-leads funnel with editable stages. |
| **Per-Company page** | AI briefing, facilities, exposure, KYC, on-demand profitability tables, company news. |
| **RM Assistant** | A scripted, plain-language assistant over the portfolio (clearly labelled as a demo). |

## Suggested demo walkthrough (~90 seconds)

1. **Dashboard** — glance at the AI to-dos and the red/amber/green portfolio; tick a to-do; click a news item's client link.
2. **Company page** — read the AI briefing, view facilities, click **Generate** for the profitability table.
3. **Credit Memo** — scroll the AI-drafted sections, **Regenerate** one to show the AI moment, **Accept** it.
4. **Case Tracker** — expand a group, see which subsidiaries are behind.
5. **Request Tracker** — open an at-risk request's pre-drafted follow-up.
6. **Leads** — select new prospects, request clearance, run the simulated review, move a lead's stage.

## Notes

- **In-session state only.** Ticking to-dos, accepting memo sections, changing lead stages, and filtering all work live but reset on refresh — there is no storage.
- **Generic branding** ("Meridian") — no real bank identity. All names, CR numbers and figures are illustrative.
- Everything AI-produced carries a consistent **AI badge + source line + accept/edit/regenerate** treatment.
- This is a prototype for buy-in. A production build would add real data, authentication, and compliance controls.
