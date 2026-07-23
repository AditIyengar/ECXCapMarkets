/*
 * ECX Capital Markets dashboard dataset — generated 2026-07-23 by Claude.
 * Schema:
 *   meta { as_of, subtitle }
 *   meetings[] { date (ISO), bank_label, banks[], project, discussion,
 *                materials_shared[], participants[], source, source_kind: 'sharepoint'|'email' }
 *   facilities[] { name, year, type, region, status, total_size_musd, currency, as_of,
 *                  description, lenders[] { bank, role, commitment_musd, fee_note } }
 *   fee_matrix { source, note, deals_2025[], deals_2026[],
 *                banks[] { bank, total_2025, total_2026, total_combined },
 *                grand_totals { y2025, y2026, combined } }
 * To refresh: re-extract from the sources listed in README.md and regenerate this file.
 */
window.ECX_DATA = {
 "meta": {
  "as_of": "2026-07-23",
  "subtitle": "Global Debt Portfolio · sources: SharePoint Bank Conversation Tracker, CF Pipeline call notes & transcripts, DCM call-notes emails, Q2 2026 lender commitments & fee summaries"
 },
 "meetings": [
  {
   "date": "2026-07-23",
   "bank_label": "Apollo (EU)",
   "banks": [
    "Apollo"
   ],
   "project": "Project Salar (plus Alibaba lease Europe)",
   "discussion": "Call with Apollo UK (Cameron Sutton, George Molesworth, Ben Eppley) on Project Salar. Structure: bank loan plus separate institutional tranche; sizing LTC 80-90% with an upfront LTV test <69% (loan to gross development value, not ongoing); yield ~8.50%, 5-7 year tenor, floating rate; pro-rata equity with 10% cost overrun guarantee; milestones linked to RFS dates with delay language; no rating required (Kroll); 2-3 year make-whole prepayment protection; no fixed draw profile; ticket 'larger the better', can commit up to 100%. DD needs: valuation report, legal and technical DD focused on construction contract and lease. Next step: check NDA and share the Project Salar teaser. Separately, Apollo is working on an executed Alibaba lease in Europe (lease terms more lender-friendly than IG tenants, sanctions language, Singapore PCG entity) but is not comfortable with ByteDance in Europe after the Dublin exit.",
   "materials_shared": [
    "Project Salar teaser to be shared after NDA check"
   ],
   "participants": [
    "ECX: Marjolein Heida (notes author)",
    "Apollo: Cameron Sutton, George Molesworth, Ben Eppley (UK)"
   ],
   "source": "Email 'Re: Call Notes: Apollo / Apterra' from mheida@edgeconnex.com, sent 2026-07-23",
   "source_kind": "email"
  },
  {
   "date": "2026-07-23",
   "bank_label": "Barclays",
   "banks": [
    "Barclays"
   ],
   "project": "Ashville 2 - Unwrapped (backleverage / anchor investor feedback)",
   "discussion": "Barclays feedback relayed to EQT (Johan Hylander) on the Ashville 2 unwrapped financing: on other backleverage providers, Santander and DB are less liquid/more bespoke non-recourse options, with more liquid recourse solutions also flagged; other potential anchor investors identified as Ares, Brookfield, Blue Owl and HPS. Sent alongside the latest term sheets from Apollo and Blackstone (awaiting update) and the Big Sky investor list (Project Scioto 2 targeted investors deck from Barclays).",
   "materials_shared": [
    "Latest TS from Apollo & Blackstone (awaiting update)",
    "Project Scioto 2 Targeted Investors & Diligence_v(2026.07.13) Barclays.pdf",
    "EdgeConneX - Follow Up Materials (2026.01.23) vF.pdf",
    "ECX - Apterra Financing Proposal 06.25.2026 v3.pdf"
   ],
   "participants": [
    "ECX: Laura Godschalx (author), Joe Harar, Aditya Iyengar, Eelco Holst (cc)",
    "EQT: Johan Hylander",
    "Barclays: feedback relayed (no attendees named)"
   ],
   "source": "Email 'Ashville 2 - Unwrapped' from lgodschalx@edgeconnex.com to EQT, sent 2026-07-23",
   "source_kind": "email"
  },
  {
   "date": "2026-07-22",
   "bank_label": "SMBC",
   "banks": [
    "SMBC"
   ],
   "project": "Ashville (HY market) / Austin PF / LC facility",
   "discussion": "Catch-up with Tom Zalewski (Exec Director, SMBC). SMBC is ready to have HY-market conversations for the Ashville opportunity — more issuers entering that market with more data points expected before Ashville launch — and views ECX's track record as a differentiator vs other developers; SMBC requested Ashville financials (ECX to revert) and will schedule an intro call with their HY team. Discussed active workstreams/pipeline; SMBC to expect Austin PF materials next week. Deliverables: SMBC to come back with market color on PF, IG bonds, HY bonds and USPP markets including product comparisons; LC facility indications due shortly (SMBC EMEA team submitting); SMBC curious about gas turbine challenges and will come back with ideas on LLE financings.",
   "materials_shared": [
    "Ashville financials requested by SMBC (ECX to send)",
    "Austin PF materials to be sent to SMBC next week"
   ],
   "participants": [
    "ECX: Aditya Iyengar (notes author)",
    "SMBC: Tom Zalewski (Executive Director)"
   ],
   "source": "Email 'Call Notes: SMBC Catch-Up (7.22.26)' from aiyengar@edgeconnex.com to DCM, sent 2026-07-22",
   "source_kind": "email"
  },
  {
   "date": "2026-07-22",
   "bank_label": "Barclays",
   "banks": [
    "Barclays"
   ],
   "project": "APAC DC ABS / project bonds / back leverage (new relationship)",
   "discussion": "Intro call with Atul Jhavar (MD, Head of DCM APAC) — new relationship introduced via Amit Singh (Linklaters) on 15 Jul. Barclays is working on the first DC ABS transaction in APAC (operational projects in Johor, Malaysia, IG privately rated) and sees potential to replicate the European ABS sequence (Vantage first, ECX ~18 months later), which lines up with ECX's Cyberjaya/Johor capacity completing early 2028. On construction project bonds: market still early-stage with heavy investor education (Barclays ran an NDR 3 weeks earlier with 100+ institutions); first deals need an IG+ hyperscaler — their view is it's too early for a project bond on an Anthropic lease (6-9+ months of education needed). Not yet active in APAC warehouse-to-bond but open; Barclays asked where they can help on back leverage and acquisitions in APAC.",
   "materials_shared": [],
   "participants": [
    "ECX: Sander Borgers (notes author)",
    "Barclays: Atul Jhavar (MD, Head of DCM APAC)"
   ],
   "source": "Email 'Call Notes: Barclays' from sborgers@edgeconnex.com, sent 2026-07-22",
   "source_kind": "email"
  },
  {
   "date": "2026-07-22",
   "bank_label": "Apollo / Apterra (APAC)",
   "banks": [
    "Apollo",
    "Apterra"
   ],
   "project": "Metropolis / ACX HoldCo / ACX Project Finance (Hyderabad & Vizag) / Anthropic-CoreWeave",
   "discussion": "Call with Kai Ngian (MD APAC, Apollo). Metropolis: with an ECX guarantee Apollo can potentially act in the senior at 300bps or below; Etna proceeds seen as a major credit positive; Apollo requested a note showing net leverage (net of Etna cash) and LTV. ACX HoldCo: indicative pricing +500 handle (high 500s), suggests a Singapore HoldCo borrower within ACX for enforcement outside India, no IG rating necessary, size USD300-500m shareable with other HoldCo lenders — Apollo to send indicative level, ECX/ACX to send info pack. ACX PF: appetite for 1/4-1/3 of an ~USD1bn ticket in the Hyderabad and Vizag PFs, pricing threshold above 250bps weighted average (tightened from mid-300s in April), tenor up to 15yr, needs IG private rating and construction-risk mitigation to unlock insurance capital. Anthropic/CoreWeave: Apollo to run internal check; view is best funded in loan format without rating.",
   "materials_shared": [
    "ECX/ACX info pack to be sent to Apollo",
    "Note on net leverage ratio (net of Etna cash) and LTV requested by Apollo",
    "Follow-up on thread: latest Metropolis model (MCN & Herndon, actualized to May), valuation excerpt, slide detailing raised cash (Laura, 7/22)"
   ],
   "participants": [
    "ECX: Sander Borgers (notes author)",
    "Apollo/Apterra: Kai Ngian (MD APAC)"
   ],
   "source": "Email 'Call Notes: Apollo / Apterra' from sborgers@edgeconnex.com, sent 2026-07-22",
   "source_kind": "email"
  },
  {
   "date": "2026-07-21",
   "bank_label": "MUFG",
   "banks": [
    "MUFG"
   ],
   "project": "Austin development financing (Data Center + Energy Center / Hull Street financing; Bastrop power)",
   "discussion": "Catch-up call focused on the Austin Energy Center financing. MUFG shifted from viewing it as partially merchant to a development + tolling structure; reviewing the draft fuel conversion services agreement (termination provisions, credit support) and noted no clear line of sight to ERCOT merchant sales. Key questions on the 6-lease structure (672MW, one entity, one power contract), guarantee mechanics (parent guarantee per lease; ECX guarantee under services agreement plus LC support negotiated with HSE), and the core credit concern of whether MUFG is taking ECX credit risk vs hyperscaler risk if the data center is delayed or never comes online — ECX responded ~$10BN total investment with completion guarantees expected and delay risk reduced by equipment procurement/relocation (referencing Walleye BTM precedent). Timing: Bastrop power 2027-2028 vs first DC module online late 2027; an RFP for the ~$8-9BN data center financing to be sent to MUFG the following week.",
   "materials_shared": [
    "Draft fuel conversion services agreement (previously shared with MUFG)",
    "RFP for ~$8-9BN Austin data center financing to be sent to MUFG early the following week"
   ],
   "participants": [
    "ECX: Aditya Iyengar (notes author)",
    "MUFG: Benjamin Gordon, Alex Bartlett, Ryoma Saito"
   ],
   "source": "Email 'MUFG Call Notes (7.21.26) | Austin Energy Center Financing' from aiyengar@edgeconnex.com, sent 2026-07-21 (Laura noted this call was for the Hull Street financing)",
   "source_kind": "email"
  },
  {
   "date": "2026-07-21",
   "bank_label": "BMO",
   "banks": [
    "BMO"
   ],
   "project": "Bank relationship / LC facility / PF syndication strategy",
   "discussion": "Catch-up call on bank market topics. BMO to return with their own assumptions on LC facility economics (Tim flagged BMO was on a comparable deal the prior week) and to confirm how they capital-classify DevCo/borrowing-base exposure vs project finance. Discussed ECX's broader bank relationship strategy (global vs regional coverage; most APAC banks are active in the US where most fee opportunity sits). BMO said their internal committee 'knows a lot more from the Canyon process' and is excited to keep building the relationship. ECX outlined PF scorecarding (T1-T3 banks able to underwrite up to $1.5B, banks expected to step into GLA roles for syndication/fee allocation), emphasized diversification of capital sources, and communicated bond timing considerations (selectivity driven by negative carry and no-call provisions).",
   "materials_shared": [],
   "participants": [
    "ECX: Aditya Iyengar (notes author)",
    "BMO: Tim (surname not given) and team"
   ],
   "source": "Email 'BMO Call Notes (07.21.26)' from aiyengar@edgeconnex.com to DCM, sent 2026-07-21",
   "source_kind": "email"
  },
  {
   "date": "2026-07-20",
   "bank_label": "Apterra",
   "banks": [
    "Apterra"
   ],
   "project": "Ashville Energy Center 2 — technical walkthrough (power strategy)",
   "discussion": "Technical walkthrough of the Ashville Energy Center 2 with Apterra (including their Chief Risk Officer) led by Raj Chudgar, covering the power load swing solution (UIG microgrid control scheme) and plot plan layout. Apterra had sent power-strategy questions beforehand and called the session very helpful for their internal process. Follow-up: ECX shared the combined Phase 1+2 plot plan and PowerConneX/UIG technical materials and committed to revert on the term sheet within days; Apterra separately reiterated interest in an anchor bid supporting the Phase 1 HY bond with Morgan Stanley and in formalizing the Phase 2 process for a post-Labor Day launch.",
   "materials_shared": [
    "Plot Plan combined.pdf (Ashville Phase 1+2)",
    "PowerConneX - UIG Technicalv1.pdf",
    "Apterra term sheet (ECX mark-up in progress; 'Ashville 2 - Apterra TS mark-up' sent 7/21)"
   ],
   "participants": [
    "ECX: Raj Chudgar, Laura Godschalx, Joe Harar, Sara Schultz",
    "Apterra: Syed Ahmed (MD), Michael Pantelogianis, Helen Chen, Isaac Dacy, Ralph Cho, Matt Froschauer, Chief Risk Officer"
   ],
   "source": "Email thread 'Re: Ashville Phase 2 Proposal' (Laura Godschalx reply sent 2026-07-21/22 thanking Apterra 'for walking through the Ashville Energy Center 2 yesterday')",
   "source_kind": "email"
  },
  {
   "date": "2026-07-17",
   "bank_label": "CPPIB (CPPIB Credit Investments)",
   "banks": [
    "CPPIB"
   ],
   "project": "HoldCo catch-up (Ares holdco upsize context / future debt issuances)",
   "discussion": "HoldCo catch-up call with CPPIB's Real Assets Credit team (Milad Gerami and team). ECX walked through the updated pipeline and simplified org chart, with a follow-up session to finalize the walkthrough and to loop in the CPPIB team on future debt issuances. On 7/20 ECX sent the 2025 audited HoldCo financial statements as discussed. Context from the same week: ECX is currently upsizing its Ares holdco facility (EQT/Ares Herndon upsize process running in parallel).",
   "materials_shared": [
    "Updated pipeline (sent 7/17)",
    "Simplified org chart (sent 7/17)",
    "Holdco FS Signed FY2025.pdf — 2025 audited financials (sent 7/20)"
   ],
   "participants": [
    "ECX: Laura Godschalx, Joe Harar, Rithika Nistala",
    "CPPIB: Milad Gerami (Principal, Real Assets Credit), Kyle Berg, Hira Husnnen, Shibei Li"
   ],
   "source": "Email 'Re: ECX / CPPIB - Holdco catch-up' from lgodschalx@edgeconnex.com, sent 2026-07-20 (call held 2026-07-17, 1:00-2:00pm)",
   "source_kind": "email"
  },
  {
   "date": "2026-07-16",
   "bank_label": "SMBC",
   "banks": [
    "SMBC"
   ],
   "project": "Global relationship catch-up (EQT Europe, tenant offtake, India/Atlas, Project Salar, US pipeline)",
   "discussion": "Morning meeting with SMBC's Phil Green and Luke Hanson. SMBC is focused on recycling capital (OK if voting rights retained; setting up CLO vehicles with private credit) and recommended structuring deals on ECX's behalf with private credit; flagged MS, GS and Easthill as notorious info leakers. On EQT: SMBC will no longer do deals with EQT except for ECX after the Deutsche Glasfaser restructuring (sold $300m position at 50c per Tokyo's orders, ~1/3 of senior written off). Tenant offtake: will revisit Anthropic as tenant subject to financial statements, participated in CoreWeave RCF and A- chip financing, Oracle still closed, will look at Mistral; keen to join the Atlas financing in India (ECX flagged 240MW CW and 220 growing to 640MW AMZN) and will work to get comfortable participating in the ANT 245MW in APAC; EMEA feedback based on their Finland MSFT/Pure DC deal (keepwell letter); ECX to revert comments on Salar RFP; US: ECX mentioned incoming 900+300MW MSFT and Anthropic 245MW unwrapped.",
   "materials_shared": [],
   "participants": [
    "ECX: Randy (Chudgar), Joe Harar, Laura Godschalx, Rithika Nistala",
    "SMBC: Phil Green, Luke Hanson"
   ],
   "source": "Email 'SMBC x ECX 7/16/2026' from rnistala@edgeconnex.com, sent 2026-07-16",
   "source_kind": "email"
  },
  {
   "date": "2026-07-15",
   "bank_label": "Apterra",
   "banks": [
    "Apterra"
   ],
   "project": "Ashville 2 (Ashville Energy Center Phase 2) financing",
   "discussion": "Update call with Apterra on the Ashville 2 unwrapped financing. Feedback is strong: minimum $500m anchor ticket with upside; Syed (Ahmed) slightly concerned on pricing given another deal in the mid-500s, though ANT paper priced at 8.5% unwrapped for Big Sky — vs that deal ECX has a stronger balance sheet, stronger sponsor, Phase 1 already in process and stronger track record (offsets: not grid connected, not NoVa). Momentum to do a lot of ANT; Apterra floated whether an anchor order into Ashville 1 would help. Apterra proposed starting legal docs now for an early-September launch (more PF-style but less microscopic than banks). Next steps: ECX to come back on the term sheet the following week and set up a call with A&O Shearman and DP on a private credit PF structure; Apterra's Chief Risk Officer to join a call with Raj Chudgar the following Monday.",
   "materials_shared": [
    "ECX - Apterra Financing Proposal 06.25.2026 v3.pdf",
    "EdgeConneX - Follow Up Materials (2026.01.23) vF.pdf"
   ],
   "participants": [
    "ECX: Laura Godschalx (notes author)",
    "Apterra: Syed Ahmed and team"
   ],
   "source": "Email 'Ashville 2: Apterra - update call' from lgodschalx@edgeconnex.com, sent 2026-07-15",
   "source_kind": "email"
  },
  {
   "date": "2026-07-14",
   "bank_label": "CIBC",
   "banks": [
    "CIBC"
   ],
   "project": "General relationship catch-up / LC facility",
   "discussion": "30-minute catch-up call (1:00pm ET) between CIBC (Billy White, David Sharp) and EdgeConneX. CIBC circulated a short digital infrastructure deck ahead of the call as reference material. Follow-up on 7/15: Laura sent CIBC the requested materials and invited questions on the LC facility, indicating CIBC is being brought into the LC facility process.",
   "materials_shared": [
    "2026.07.14 Edgeconnex Digital Infrastructure Deck.pdf (from CIBC)",
    "LC facility materials sent by ECX on 7/15 (attachment to 'Re: CIBC / EdgeConnex: Catch-up')"
   ],
   "participants": [
    "ECX: Laura Godschalx, Joe Harar, Aditya Iyengar, Pierre Maitre, Scott Graff",
    "CIBC: Billy White, David Sharp"
   ],
   "source": "Email 'RE: CIBC / EdgeConnex: Catch-up' from Billy.White@cibc.com, sent 2026-07-14",
   "source_kind": "email"
  },
  {
   "date": "2026-04-22",
   "bank_label": "NIBC",
   "banks": [
    "NIBC"
   ],
   "project": "Prologis Sites (Herndon)",
   "discussion": "Prologis sites are now 'Herndon'. Could temporarily use Beluga, or potentially add to the NIBC loan - moving from 40% LTC in Beluga to 65% in NIBC - which would eventually require an appraisal. Plan to use the Orca cash already sitting in Beluga before drawing, given interest costs. Getting BBnB will take a while; the purchase is more to get Prologis off ECX's back on planning.",
   "materials_shared": [],
   "participants": [
    "Marjolein",
    "Laura"
   ],
   "source": "CF Pipeline Call Notes_4.22.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-22",
   "bank_label": "Morgan Stanley / Fitch / Moody's / S&P",
   "banks": [
    "Morgan Stanley"
   ],
   "project": "Project Ashville",
   "discussion": "Building an Energy Center at Ashville as well; DD mostly complete but waiting on the T&T report, 90% design not yet available, and the Energy Center is waiting on a few utility contracts plus a finalized schedule, GMP/construction contract and budget from PCX (PowerConneX) - the gating item. Call held yesterday with Morgan Stanley (Marcus/Danielle); rating agency calls pushed to Thursday/Friday - once started everything should be done within three weeks. Morgan Stanley is working on the rating, already talking to banks in the background and to Fitch, Moody's and S&P; Walleye materials were shared to show how to treat the energy center. Davis Polk engaged as counsel (has done HY bonds before); call with Broadcom on the SNDA regarding the chips; Grace sent comments on the engagement letter but may need to be less aggressive per Johan's feedback.",
   "materials_shared": [
    "Walleye materials (shared with Morgan Stanley for rating agency approach)",
    "Engagement letter comments (Grace)",
    "T&T DD report (pending)"
   ],
   "participants": [
    "Laura",
    "Rithika",
    "Grace",
    "Johan",
    "Eelco"
   ],
   "source": "CF Pipeline Call Notes_4.22.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-22",
   "bank_label": "Goldman Sachs",
   "banks": [
    "Goldman Sachs"
   ],
   "project": "Austin Campus (AUS10 series / Leroy)",
   "discussion": "Joe is putting the Austin Campus forward to Goldman and might get a bridge signed by end of this month; alternatively, a $2bn increase in Leroy could house Austin, and the rest of the campus could be financed this way rather than just the Austin 10 series. Key issue is water metering. It also emerged the campus will be 6 individual leases across multiple entities (Microsoft signing) rather than one lease - Pierre, Alexis and Raj working the legal structuring (multiple OpCos, condo idea from engineering, assignment language).",
   "materials_shared": [],
   "participants": [
    "Joe",
    "Pierre",
    "Alexis",
    "Raj"
   ],
   "source": "CF Pipeline Call Notes_4.22.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-22",
   "bank_label": "Anchor bank group",
   "banks": [],
   "project": "Metropolis (Malaysia)",
   "discussion": "Finalizing the term sheet based on feedback received from the banks.",
   "materials_shared": [
    "Term sheet (being finalized)"
   ],
   "participants": [
    "Sander"
   ],
   "source": "CF Pipeline Call Notes_4.22.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-22",
   "bank_label": "Prospective lenders (unnamed) / Microsoft",
   "banks": [],
   "project": "Finland / Vasa",
   "discussion": "Moving quickly with customer Microsoft, who wants step-in rights to the land lease - competing with lenders who also want step-in rights, so structuring work is needed. Due diligence is ongoing, an appraisal has been engaged; still early stages. Finland closing on the following Monday (per Other Projects), expected to go into Leroy first.",
   "materials_shared": [
    "Appraisal (engaged)"
   ],
   "participants": [
    "Laura"
   ],
   "source": "CF Pipeline Call Notes_4.22.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-22",
   "bank_label": "Prospective RFP bank group",
   "banks": [],
   "project": "ATL 12/13",
   "discussion": "Finalizing the presentation; sending to Eelco for review today/tomorrow, then sending out to banks for the RFP.",
   "materials_shared": [
    "ATL12/13 RfP presentation (final review)"
   ],
   "participants": [
    "Laura",
    "Eelco"
   ],
   "source": "CF Pipeline Call Notes_4.22.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-22",
   "bank_label": "Rabobank",
   "banks": [
    "Rabobank"
   ],
   "project": "Nemo Equipment Facility (Equipment Finance)",
   "discussion": "Rabobank is working on the equipment finance facility; Alex at EQT is having trouble getting hold of their legal counsel for this. Separately, the Rabo equipment facility could in principle fund any invoice, doing the same job as a revolving credit facility (EQT revolver feedback not yet discussed at length).",
   "materials_shared": [],
   "participants": [
    "Laura"
   ],
   "source": "CF Pipeline Call Notes_4.22.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-22",
   "bank_label": "Indian bank group",
   "banks": [],
   "project": "Project Atlas (India ACX)",
   "discussion": "Getting feedback from the banks on Project Atlas (AdaniConneX India).",
   "materials_shared": [],
   "participants": [
    "Sander"
   ],
   "source": "CF Pipeline Call Notes_4.22.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-22",
   "bank_label": "Oaktree / Brookfield / CPPIB",
   "banks": [
    "Brookfield",
    "CPPIB",
    "Oaktree"
   ],
   "project": "Project Narluga (Holdco)",
   "discussion": "Oaktree and Brookfield are working on the Narluga holdco deal; CPPIB is also working on it, looking to take at least $150m but slow in process. Expect 4-6 weeks to signing then 20 days to funding. Johan, Joe and Sander are going on the road together for this.",
   "materials_shared": [],
   "participants": [
    "Johan",
    "Joe",
    "Sander"
   ],
   "source": "CF Pipeline Call Notes_4.22.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-22",
   "bank_label": "Barclays / Credit Agricole CIB",
   "banks": [
    "Barclays",
    "Credit Agricole CIB"
   ],
   "project": "LC Facilities",
   "discussion": "Laura is catching up with Barclays; Eelco is calling Ali at CACIB to push the LC facility along. A summary of LC requirements will be circulated - the $150m due at the end of the month got pushed two weeks, and Rabo sounds likely to get there by then. If cash collateralization is needed, it would just require a locked account with the bank; entity placement shouldn't matter.",
   "materials_shared": [
    "Summary of LC requirements (to be sent)"
   ],
   "participants": [
    "Laura",
    "Eelco"
   ],
   "source": "CF Pipeline Call Notes_4.22.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-22",
   "bank_label": "Woori Bank",
   "banks": [
    "Woori Bank"
   ],
   "project": "Project Walleye / Ohio syndication",
   "discussion": "Rithika and Laura will be in Ohio next week touring Woori around the site. A few questions are coming in from the CLAs, and a new syndication tracker will be shared tomorrow.",
   "materials_shared": [
    "New syndication tracker (to be shared)"
   ],
   "participants": [
    "Rithika",
    "Laura"
   ],
   "source": "CF Pipeline Call Notes_4.22.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-22",
   "bank_label": "Lender group (supermajority consent) / Microsoft",
   "banks": [],
   "project": "Tarpon SNDA",
   "discussion": "AOS is pushing the lenders to accept two items on the Tarpon SNDA; supermajority (2/3) feedback needed from the lenders. If Microsoft approves, ECX can move straight to signing - hopefully quicker than signing a lease.",
   "materials_shared": [],
   "participants": [
    "Laura",
    "Eelco"
   ],
   "source": "CF Pipeline Call Notes_4.22.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-22",
   "bank_label": "EQT / Ares (sponsor-side)",
   "banks": [
    "Ares"
   ],
   "project": "YieldCo & Herndon McNair Collapse / recoups",
   "discussion": "EQT has the ambition to do the YieldCo and Herndon McNair collapse sometime in Q2 2026 (structuring now, timeline uncertain). Upcoming milestones: Finland closing Monday, Norway recoup early May, Austin recoup late May, Ares McNair expected mid-May. New APAC legal colleague (Emily) started two weeks ago and will work on APAC financings.",
   "materials_shared": [],
   "participants": [
    "Marjolein",
    "Grace"
   ],
   "source": "CF Pipeline Call Notes_4.22.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "Wells Fargo",
   "banks": [
    "Wells Fargo"
   ],
   "project": "Leroy Upsize / ATL12",
   "discussion": "Leroy upsize: negotiating the percentages and caps related to power; ECX currently holds the pen with a couple of commercial points open, and counterparties are looking to change thresholds. Wells Fargo is working on this and giving an update today; ECX is considering making Wells Fargo left lead for ATL12 to encourage them on Leroy - Kristen there has the capabilities. Pricing on ATL12 would be better than ATL11 and a better LTC should be achievable. Also trying to reach T&T on adding Norway to Leroy.",
   "materials_shared": [],
   "participants": [
    "Laura"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "Prospective lender group",
   "banks": [],
   "project": "Atlanta 12 (ATL12)",
   "discussion": "A presentation should be ready next week to start sharing with lenders for the Atlanta 12 process.",
   "materials_shared": [
    "ATL12 lender presentation (ready next week)"
   ],
   "participants": [
    "Laura"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "Rabobank",
   "banks": [
    "Rabobank"
   ],
   "project": "Rabobank relationship / Walleye / AdaniConneX / LC",
   "discussion": "Eelco caught up with Rabobank's head of Europe (and separately their new global head of market finance and Mark Sweet on the lending side): Rabobank is rapidly scaling its EdgeConneX exposure, climbing the lender ranks, with a $175m commitment aimed at Walleye and is also looking at AdaniConneX. Eelco following up with Mark; Laura following up with another contact. Plan to involve Randy and Joe with Rabo to build a bigger relationship.",
   "materials_shared": [],
   "participants": [
    "Eelco",
    "Laura",
    "Randy",
    "Joe"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "Barclays / Credit Agricole CIB / Natixis / BBVA / Societe Generale",
   "banks": [
    "BBVA",
    "Barclays",
    "Credit Agricole CIB",
    "Natixis",
    "Societe Generale"
   ],
   "project": "LC Facilities",
   "discussion": "Barclays asked for $200m and CACIB asked for $200m on the LC facilities. Natixis, BBVA and SocGen were asked to come up with a syndicated LC facility, but since this sits with trade finance desks there has been very little movement.",
   "materials_shared": [],
   "participants": [
    "Laura",
    "Eelco"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "Rabobank",
   "banks": [
    "Rabobank"
   ],
   "project": "Project Bonds / Ashville trade facility",
   "discussion": "Discussed whether Ashville could be used for the trade facility: make sure there is a permitted trade payable of up to 360 days and make the Ashville bond a cosigner to Rabobank.",
   "materials_shared": [],
   "participants": [
    "Laura"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "SMBC (with Paul Hastings / Microsoft)",
   "banks": [
    "SMBC"
   ],
   "project": "Project Tarpon",
   "discussion": "Thought the deal was there, but Paul Hastings came back with additional comments; Microsoft is not going to accept them (Paul Hastings said they can only accept half). Dorina is managing communication with Microsoft; SMBC and Paul Hastings may need a call. Joe to call Quinn, and Laura to forward Joe a summary of what is and isn't accepted; Grace possibly to ring Greg. Upcoming third payment in August, expected to run through Leroy.",
   "materials_shared": [
    "Summary of accepted/rejected comments (Laura to send Joe)"
   ],
   "participants": [
    "Laura",
    "Joe",
    "Dorina",
    "Grace"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "Morgan Stanley / Goldman Sachs / rating agencies",
   "banks": [
    "Goldman Sachs",
    "Morgan Stanley"
   ],
   "project": "Project Ashville",
   "discussion": "Engagement letter currently with Morgan Stanley; setting up an all-group call later this week and a rating agency meeting next week. Expect final documentation (lease, credit agreements, everything) by Monday/early next week, then a final call with Google to confirm documents are agreed; EQT also needs to get there. Goldman wants to be involved and is asking when rating agency engagement starts - they will be involved once inclusion decisions are made; Morgan Stanley has been more engaged (via EQT).",
   "materials_shared": [
    "Morgan Stanley engagement letter",
    "Final documentation package (lease, credit agreements) expected"
   ],
   "participants": [
    "Joe"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "Blackstone",
   "banks": [
    "Blackstone"
   ],
   "project": "Project Walleye (closed) - syndication",
   "discussion": "Walleye has closed; still working with Blackstone and the timeline is tracking well alongside the broader syndication, which has a lot of appetite with a deadline at end of the month. One more change being made to the limited guarantee - Don is engaging with Meta to push it through.",
   "materials_shared": [],
   "participants": [
    "Marjolein",
    "Don"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "Beluga portfolio lenders (unnamed)",
   "banks": [],
   "project": "Project Beluga / Bertonico / Milan / Prologis / Finland",
   "discussion": "Building Bertonico into Beluga - some work needed before stepping up to 85%, tracking for a mid-May acquisition. Prologis sites also look like closing in May, expected to be McNair for tax reasons (FP&A disagrees). Milan will also go into Beluga (not Leroy), while Finland is expected to go into Leroy first.",
   "materials_shared": [],
   "participants": [
    "Marjolein"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "Ares",
   "banks": [
    "Ares"
   ],
   "project": "Project Narluga (Ares New Albany)",
   "discussion": "Turning the credit agreement today and expecting pens down by Friday; closing and funding expected two weeks after that.",
   "materials_shared": [
    "Credit agreement turn"
   ],
   "participants": [
    "Sander"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "Clifford Capital / Natixis / OCBC / Mizuho (Mitsuo)",
   "banks": [
    "Clifford Capital",
    "Mizuho",
    "Natixis",
    "OCBC"
   ],
   "project": "Metropolis (Malaysia)",
   "discussion": "Discussed with Clifford Capital and Natixis yesterday; moving to final stages of the term sheet and book build exercise. Current liquidity suggests the term loan transaction side will be filled. OCBC and Mizuho (noted as 'Mitsuo') are also interested.",
   "materials_shared": [
    "Term sheet (final stages)"
   ],
   "participants": [
    "Sander"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "Natixis / ING (+2 other banks)",
   "banks": [
    "ING",
    "Natixis"
   ],
   "project": "AdaniConneX",
   "discussion": "Received term sheet feedback from 4 banks: Natixis agreed the term sheet without comments and can do one-third of the deal; ING confirmed they can do it subject to a few comments.",
   "materials_shared": [
    "Term sheet feedback from 4 banks"
   ],
   "participants": [
    "Sander"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "SMBC / MUFG",
   "banks": [
    "MUFG",
    "SMBC"
   ],
   "project": "Japan financing",
   "discussion": "Sharing an updated term sheet with SMBC and MUFG tomorrow.",
   "materials_shared": [
    "Updated term sheet (to SMBC and MUFG)"
   ],
   "participants": [
    "Sander"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "Taiwanese banks (various)",
   "banks": [],
   "project": "US lending / structuring",
   "discussion": "Eelco caught up with a number of banks in Taiwan; most cannot lend into the US since it creates a 30% withholding tax leakage. Some can work around this if they have a local branch, and borrowing potentially via a Dutch BV could get around the issue. Separately, ex-SocGen banker JJ is joining ECX in Amsterdam (targeting July 1 start) to support the Capital Markets team, bringing project finance advisory and lending experience.",
   "materials_shared": [],
   "participants": [
    "Eelco"
   ],
   "source": "CF Pipeline Call Notes_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-15",
   "bank_label": "Rabobank / EQT",
   "banks": [
    "Rabobank"
   ],
   "project": "Trade facility / Nemo Equipment Facility",
   "discussion": "Laura had a call with Alex (EQT) to discuss whether EQT can sign along on the trade facility; collecting remaining documents to send back to Rabobank. KS/Grace to review the buyer-supplier agreement (only minor comments left, similar to the surety agreements). Laura also checking in with Wells Fargo on their process, assumed on plan. Chris Wenger becomes the new liaison for Hannah (Sonderegger) at EQT.",
   "materials_shared": [
    "Buyer supplier agreement (under legal review)",
    "Documents to Rabobank"
   ],
   "participants": [
    "Laura",
    "Grace",
    "Chris Wenger",
    "Eelco"
   ],
   "source": "CF Pipeline Call Transcript_4.15.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-01",
   "bank_label": "LimitFi",
   "banks": [],
   "project": "Surety Bonds",
   "discussion": "Discussions with LimitFi went sour and there is no movement on the surety bond workstream for now; team is parking it since it would be based on ECX letters of credit and there is not full conviction on the counterparty.",
   "materials_shared": [],
   "participants": [
    "Laura"
   ],
   "source": "CF Pipeline Call Notes_4.1.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-01",
   "bank_label": "BBVA / Natixis / Societe Generale",
   "banks": [
    "BBVA",
    "Natixis",
    "Societe Generale"
   ],
   "project": "Syndicated LC Facility",
   "discussion": "BBVA, Natixis and SocGen are all in discussions on a syndicated LC facility; initial feedback is $1.5bn looks very doable with relationship banks on an uncommitted basis. Trade finance desks are involved so the process is moving slowly. Structuring question raised around EBL (Equity Bridge Loan) letters of credit. Eelco also wants a call with Aon (Aeon), whose desk does LC guarantee syndication, to compare that market against the bank market and possibly feed multiple programs into one structure.",
   "materials_shared": [],
   "participants": [
    "Laura",
    "Eelco"
   ],
   "source": "CF Pipeline Call Notes_4.1.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-01",
   "bank_label": "Wells Fargo",
   "banks": [
    "Wells Fargo"
   ],
   "project": "Leroy (upsize / Norway addition)",
   "discussion": "Norway should be added into Leroy within the next 3-4 weeks; Wells Fargo is working in the background on providing back-leverage for the $1bn increase, with T&T and Newmark engaged on the Norway appraisal and due diligence report. ECX still needs to find a bank that can front the LCs for Blackstone - Wells Fargo couldn't do the fronting; Aeon (Aon) might have a way of doing this. Moving Walleye / New Albany South is going to be the main event.",
   "materials_shared": [
    "T&T / Newmark appraisal and due diligence report for Norway (in progress)"
   ],
   "participants": [
    "Laura"
   ],
   "source": "CF Pipeline Call Notes_4.1.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-01",
   "bank_label": "Rabobank",
   "banks": [
    "Rabobank"
   ],
   "project": "Nemo Equipment Facility (Equipment Finance)",
   "discussion": "Working to get Rabobank comfortable on the equipment finance facility: Rabo cannot give full credit for uncalled capital, so ECX is working to add uncalled commitments and loan commitments to the liquidity definition. Alternatives include doing something with the Scale JV, or starting with a smaller amount and looking to close $400m-$1bn if Rabobank struggles with the look-through to EQT.",
   "materials_shared": [],
   "participants": [
    "Laura"
   ],
   "source": "CF Pipeline Call Notes_4.1.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-01",
   "bank_label": "Oaktree / CPPIB / Brookfield / Ares",
   "banks": [
    "Ares",
    "Brookfield",
    "CPPIB",
    "Oaktree"
   ],
   "project": "Project Narwhal (Holdco)",
   "discussion": "Working with Oaktree, CPPIB and Brookfield on Project Narwhal; Ares is providing a term sheet markup.",
   "materials_shared": [
    "Ares term sheet markup"
   ],
   "participants": [
    "Laura"
   ],
   "source": "CF Pipeline Call Notes_4.1.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-01",
   "bank_label": "Prospective RFP bank group",
   "banks": [],
   "project": "Atlanta 12 (ATL12)",
   "discussion": "Putting a teaser together (that day) and coming up with a list of banks to include in an RFP (Request for Proposal) for the Atlanta 12 financing.",
   "materials_shared": [
    "ATL12 teaser (in preparation)",
    "RfP bank list (in preparation)"
   ],
   "participants": [
    "Laura"
   ],
   "source": "CF Pipeline Call Notes_4.1.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-01",
   "bank_label": "Morgan Stanley / Goldman Sachs",
   "banks": [
    "Goldman Sachs",
    "Morgan Stanley"
   ],
   "project": "Project Ashville (bond issuance)",
   "discussion": "All documents should be ready this week; key documents have been shared with Morgan Stanley and Goldman. Goldman is to confirm the other key documents needed for a bond issuance. Open question whether to put in a pre-development facility first or go straight into a bond. T&T is doing the technical DD.",
   "materials_shared": [
    "Key transaction documents shared with Morgan Stanley and Goldman"
   ],
   "participants": [
    "Laura"
   ],
   "source": "CF Pipeline Call Notes_4.1.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-01",
   "bank_label": "Lender group / Blackstone / NatWest",
   "banks": [
    "Blackstone",
    "NatWest"
   ],
   "project": "Project Walleye",
   "discussion": "Banks want ECX to amend the Meta lease to fix gaps (Meta could assign then terminate the gas contract and claim ECX is not providing power); until the lease is resolved ECX must provide a recourse guarantee from McNair and Herndon. There is also an issue around strict compliance on invoices; goal to be done by Monday 4/6/26. Blackstone is running its credit rating process (target ~2 weeks) - they would be repaid on Leroy and then want to come in on the back of Walleye with a large ticket. NatWest is also interested.",
   "materials_shared": [],
   "participants": [
    "Marjolein"
   ],
   "source": "CF Pipeline Call Notes_4.1.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-01",
   "bank_label": "Ares",
   "banks": [
    "Ares"
   ],
   "project": "Project Orca (post-closing steps)",
   "discussion": "Need to complete an Ares certificate to bring assets outside the 4BV into Orca; Laura to work on it, targeting return to 16-B B.V. by the 8th-10th. Orca proceeds (~EUR 670m expected) will be used to repay the $225m intercompany loan; Josh/Marjolein to share an email with the step plan.",
   "materials_shared": [
    "Step plan email (Josh/Marjolein to share)"
   ],
   "participants": [
    "Marjolein",
    "Laura",
    "Josh Bernstein"
   ],
   "source": "CF Pipeline Call Notes_4.1.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-01",
   "bank_label": "Beluga portfolio lenders (unnamed)",
   "banks": [],
   "project": "Project Milan / Fiersdal (into Beluga)",
   "discussion": "Working on adding Milan to Project Beluga and figuring out feasibility within the portfolio loan; a project financing is also being considered. May need another Beluga Accordion or ABS quickly to make room for Milan in Beluga. The tax structure is difficult.",
   "materials_shared": [],
   "participants": [
    "Marjolein"
   ],
   "source": "CF Pipeline Call Notes_4.1.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-01",
   "bank_label": "Anchor bank group / Intesa / Apollo",
   "banks": [
    "Apollo",
    "Intesa Sanpaolo"
   ],
   "project": "Metropolis (Malaysia) + Oracle 72MW lease",
   "discussion": "A 72MW lease with Oracle was signed overnight and needs financing ASAP; book building should end next week (ByteDance backing out of their RFP was the change). 5 anchor banks can provide around $540m of the $640m required; the market has been thin. Intesa is new and said they can do $100m. Apollo could potentially do 100% of the deal and syndicate later, but at higher cost than commercial banks. Note: an RFS in the lease falls before the Oracle completion date with a 60-day late-fee waiver, meaning ECX will technically be in default for a few months pre-completion; BCEI paused works 1-2 months.",
   "materials_shared": [],
   "participants": [
    "Sander"
   ],
   "source": "CF Pipeline Call Notes_4.1.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-01",
   "bank_label": "AdaniConneX JV lenders",
   "banks": [],
   "project": "India Bridge Financing (Vizag & Hyderabad)",
   "discussion": "A $500m bridge facility for Vizag and Hyderabad has been launched; it will sit within the AdaniConneX JV.",
   "materials_shared": [],
   "participants": [
    "Sander"
   ],
   "source": "CF Pipeline Call Notes_4.1.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-04-01",
   "bank_label": "Ares",
   "banks": [
    "Ares"
   ],
   "project": "Project Narluga",
   "discussion": "Looking to have the Ares Narluga project signed two weeks from now.",
   "materials_shared": [],
   "participants": [
    "Sander"
   ],
   "source": "CF Pipeline Call Notes_4.1.26.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-03-18",
   "bank_label": "Lender group / hedge counterparties (unnamed)",
   "banks": [],
   "project": "Project Beluga",
   "discussion": "Beluga closed on March 16, 2026. First interest rate hedge closed March 17 and second hedge closed March 18. AMS04 and AMS05 were formally extracted from Beluga into the new Project Orca SPV structure as planned, with a structural details email to follow. ECX is also working with Williams (oil & gas) on a PPA for the Beluga expansion plan.",
   "materials_shared": [
    "Email with relevant structural details on AMS04/AMS05 extraction (to be sent)"
   ],
   "participants": [
    "Marjolein"
   ],
   "source": "CF_Pipeline_Notes_3_18_26_Claude.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-03-18",
   "bank_label": "ABS investors (public + private placement market)",
   "banks": [],
   "project": "Project Orca (European ABS securitisation)",
   "discussion": "Orca publicly launched Monday March 16 as ECX's inaugural European ABS securitisation (EUR 707.5m Class A2 Notes, collateralised by AMS04 + AMS05). Roughly EUR 400m was already secured through the prior private marketing process, and public-market traction is good with investor meeting requests and Q&A coming in. Strong ECX-driven preference to price Friday March 20 to avoid weekend macro/political risk; if priced Friday, funding and closing expected end of March or April 1-2.",
   "materials_shared": [
    "Investor Q&A",
    "Private marketing materials"
   ],
   "participants": [
    "Marjolein"
   ],
   "source": "CF_Pipeline_Notes_3_18_26_Claude.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-03-18",
   "bank_label": "Intercompany / EQT (Hurden)",
   "banks": [],
   "project": "Intercompany bridge loan (Orca / Hurden)",
   "discussion": "Josh Bernstein flagged a $225m intercompany bridge loan (per his ~March 17 email to Ilko, who had not yet responded; Marjolein directed Josh to call him). Repayment targeted mid-April once either Orca closes or EQT funds into Hurden, with a committed outside date of end of April, which Laura Godschalx confirmed as acceptable.",
   "materials_shared": [],
   "participants": [
    "Josh Bernstein",
    "Marjolein",
    "Laura"
   ],
   "source": "3.18.26 Call Transcript.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-03-18",
   "bank_label": "Ares / JJ (Avizag counterparty)",
   "banks": [
    "Ares"
   ],
   "project": "Avizag (Vizag) capital call / payment timing",
   "discussion": "Joe Harar asked JJ for a 10-day delay on the Avizag payment (pushing into April), anchored to the March 26 long-stop date. Late in the call JJ came back strongly requesting funding NOT be delayed beyond March 26 because their fiscal year-end is March 31, so the team will proceed without delay. Team to prepare the capital call email to Ares and check with Joe before sending.",
   "materials_shared": [
    "Capital call email to Ares (in preparation)"
   ],
   "participants": [
    "Joe",
    "Marjolein"
   ],
   "source": "3.18.26 Call Transcript.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  },
  {
   "date": "2026-03-11",
   "bank_label": "Internal strategy (club vs. underwrite)",
   "banks": [],
   "project": "Metropolis (Malaysia) / Oracle lease-up",
   "discussion": "Team debated execution strategy for the Malaysia financing given Oracle is harder to underwrite: preference is a club transaction where structuring banks anchor the deal and ECX brings in relationship banks, though an underwrite-and-market syndication is preferred if affordable. Eelco pushed to complete a full bank overview so ECX has a global (not local) bank strategy and a clear narrative on which banks are assumed for what. Laura raised prioritization/staffing concerns given the number of simultaneous processes; a new hire interview had just taken place.",
   "materials_shared": [
    "Bank overview (to be completed internally)"
   ],
   "participants": [
    "Eelco",
    "Sander",
    "Laura",
    "Joe"
   ],
   "source": "3.11.26 Call Transcript.docx (SharePoint · Bank Conversation Tracker folder)",
   "source_kind": "sharepoint"
  }
 ],
 "facilities": [
  {
   "name": "Project Wahoo / Wahoo I & II (EdgeConneX corporate borrowing-base facility upsize - Tranche A4/B4 + Supplemental)",
   "total_size_musd": 2500,
   "currency": "USD",
   "type": "holdco / corporate borrowing-base revolver upsize",
   "status": "CLOSED - Q2 2026 Commitments workbook shows 'Wahoo I & II' at $2,500,000,000 total with top-tier banks at $104,166,667 each (others $90M/$85M/$80M/$50M/$45M/$40M/$30M/$25M). Tracker below reflects syndication status 12/16/25 ($1,040M committed at that date); invite amounts are pre-allocation. Fees: Wahoo Upsize I $18.3M (2025) + Upsize II $6.0M (2026).",
   "as_of": "tracker 2025-12-16; closed total per Q2 2026 commitments workbook",
   "fees_structure": {
    "JLA&JBR": "10.0 bps old money / 25 bps (see notes)",
    "JLA": "5.0 bps old money / 25 bps",
    "Co-Doc": "0.0 bps old money / 25 bps",
    "wahoo_upsize_upfront_pct_from_fee_file": 2.0
   },
   "lenders": [
    {
     "bank": "TD Bank",
     "role": "JLA&JBR (lead arranger, running syndication)",
     "commitment_musd": 125,
     "status": "committed",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "BBVA",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "committed - CL received",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Bank of America",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "committed - CL received",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Rabobank",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "committed - CL received",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "OCBC",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "committed - CL received (prefers $90M hold)",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "JP Morgan",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "committed",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Regions",
     "role": "JLA",
     "commitment_musd": 90,
     "status": "committed",
     "fees": {
      "upfront_bps": 5,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Webster",
     "role": "Co-Doc",
     "commitment_musd": 80,
     "status": "committed - CL received",
     "fees": {
      "upfront_bps": 0,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Flagstar",
     "role": "Co-Doc",
     "commitment_musd": 75,
     "status": "committed",
     "fees": {
      "upfront_bps": 0,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Nomura",
     "role": "Participant (rolling existing $45M)",
     "commitment_musd": 45,
     "status": "committed",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "RBC",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "working - 95% probability",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "MUFG",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "working - 95% probability",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Barclays",
     "role": "JLA&JBR",
     "commitment_musd": 115,
     "status": "working - 90%, will come in at $115M",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "SMBC",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "working - 90%",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "ING",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "working - 90%",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Wells Fargo",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "working - 90%",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Goldman Sachs",
     "role": "JLA",
     "commitment_musd": 90,
     "status": "working - 90%",
     "fees": {
      "upfront_bps": 5,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Mizuho",
     "role": "JLA",
     "commitment_musd": 90,
     "status": "working - 90%",
     "fees": {
      "upfront_bps": 5,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Investec",
     "role": "Participant (extending existing $25M)",
     "commitment_musd": 25,
     "status": "working - 90%",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "First-Citizens Bank",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "working - 75%",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "KfW IPEX-Bank",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "working - 75% (cannot commit by deadline)",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Natixis",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "working - 75%",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "NBC",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "working - 75%",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Truist",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "working - 75%",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Caterpillar",
     "role": "Co-Doc",
     "commitment_musd": 50,
     "status": "working - 50%",
     "fees": {
      "upfront_bps": 0,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "BHI",
     "role": "Co-Doc",
     "commitment_musd": 50,
     "status": "working - 50%",
     "fees": {
      "upfront_bps": 0,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Intesa Sanpaolo",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "potential January close",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "BNP Paribas",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "potential January close (week of Jan 19)",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Standard Chartered",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "potential Jan/Feb",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "US Bank",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "potential January close",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Credit Agricole",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "potential January (commercial approval done)",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "KeyBank",
     "role": "JLA&JBR",
     "commitment_musd": 125,
     "status": "re-evaluate in new year",
     "fees": {
      "upfront_bps": 10,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Citi",
     "role": "JLA",
     "commitment_musd": 90,
     "status": "potential - may reconsider if Amazon signed",
     "fees": {
      "upfront_bps": 5,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Santander",
     "role": "JLA",
     "commitment_musd": 90,
     "status": "potential - relooking in January",
     "fees": {
      "upfront_bps": 5,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Bank Leumi",
     "role": "Participant",
     "commitment_musd": 70,
     "status": "potential January",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "CoBank",
     "role": "Participant",
     "commitment_musd": 40,
     "status": "potential mid-January (AWS lease condition)",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Clifford Capital",
     "role": "Participant",
     "commitment_musd": 50,
     "status": "potential (discussing DDTL carve-out)",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    }
   ]
  },
  {
   "name": "Project Shiner (AUS02 Austin data center DDTL - CoreWeave tenant)",
   "total_size_musd": 1000,
   "currency": "USD",
   "type": "project finance (construction DDTL)",
   "status": "Closed / in syndication of UW positions; $485M committed by non-CLA investors as of 10/9/25. Total 2025 lender fees paid $21.85M (per fee summary; fee base $1,040.5M).",
   "as_of": "2025-10-09",
   "fees_structure": {
    "upfront_pct": 1.5,
    "commitment_fee": "35% of margin",
    "uw_fee_pct": 0.5,
    "structuring_fee_pct": 0.1
   },
   "lenders": [
    {
     "bank": "Societe Generale",
     "role": "CLA (bookrunner)",
     "commitment_musd": 197.5,
     "status": "CLA UW 19.8%",
     "fees": {
      "upfront_bps": 150,
      "upfront_musd": 4.22,
      "other": "2025 Shiner fees per fee file: $4,219,661"
     }
    },
    {
     "bank": "Nomura",
     "role": "CLA",
     "commitment_musd": 210.0,
     "status": "CLA UW 21.0%",
     "fees": {
      "upfront_bps": 150,
      "upfront_musd": 3.19,
      "other": "2025 Shiner fees per fee file: ~$3,179,191"
     }
    },
    {
     "bank": "JP Morgan",
     "role": "CLA",
     "commitment_musd": 197.5,
     "status": "CLA UW 19.8%",
     "fees": {
      "upfront_bps": 150,
      "upfront_musd": 3.19,
      "other": null
     }
    },
    {
     "bank": "Morgan Stanley",
     "role": "CLA",
     "commitment_musd": 197.5,
     "status": "CLA UW 19.8%",
     "fees": {
      "upfront_bps": 150,
      "upfront_musd": 3.19,
      "other": null
     }
    },
    {
     "bank": "Natixis",
     "role": "CLA",
     "commitment_musd": 197.5,
     "status": "CLA UW 19.8%",
     "fees": {
      "upfront_bps": 150,
      "upfront_musd": 3.19,
      "other": null
     }
    },
    {
     "bank": "NBC",
     "role": "JLA",
     "commitment_musd": 85.0,
     "status": "committed 100%",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": "per-lender fee not stated"
     }
    },
    {
     "bank": "TD Bank",
     "role": "JLA",
     "commitment_musd": 85.0,
     "status": "committed 100%",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "CoBank",
     "role": "MLA",
     "commitment_musd": 50.0,
     "status": "committed",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "First Citizens Bank",
     "role": "MLA",
     "commitment_musd": 50.0,
     "status": "committed",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Hana Securities / AI Partners",
     "role": "MLA",
     "commitment_musd": 60.0,
     "status": "committed (possible +$30M in Nov)",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "UMTB (Mizrahi)",
     "role": "MLA",
     "commitment_musd": 50.0,
     "status": "committed",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Principal",
     "role": "MLA",
     "commitment_musd": 50.0,
     "status": "committed",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Farmer Mac",
     "role": "Retail",
     "commitment_musd": 25.0,
     "status": "committed",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Preferred Bank",
     "role": "Retail",
     "commitment_musd": 30.0,
     "status": "committed",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    }
   ]
  },
  {
   "name": "Project Tarpon PF take-out (ATL11 - CTL + EBL)",
   "total_size_musd": 1061.1,
   "currency": "USD",
   "type": "project finance (CTL $865M planned / $846.45M actual + EBL $196.1M planned / $153.95M actual; plus $100M Tarpon Bridge)",
   "status": "Closed 2025. Actual fee bases per fee summary: Tarpon TL $846.45M @103bps ($8.73M), EBL $153.95M @59bps ($0.91M), Bridge $100M @10bps ($0.10M); total Tarpon PF fees $9.65M.",
   "as_of": "2025-06-03 (tracker); fee actuals from Lender Fees Summary 7.21.26",
   "fees_structure": {
    "tl_upfront_pct": 1.03,
    "ebl_upfront_pct": 0.59,
    "bridge_upfront_pct": 0.1
   },
   "lenders": [
    {
     "bank": "SMBC",
     "role": "CLA",
     "commitment_musd": 200.0,
     "status": "UW: EBL $49M (25%) + CTL $173M (20%); target hold $50M EBL + $150M CTL",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 1.91,
      "other": "2025 Tarpon PF fees per fee file ~$1,913,207"
     }
    },
    {
     "bank": "ING",
     "role": "CLA",
     "commitment_musd": 200.0,
     "status": "UW EBL $49M + CTL $173M",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 1.91,
      "other": null
     }
    },
    {
     "bank": "Natixis",
     "role": "CLA",
     "commitment_musd": 200.0,
     "status": "UW EBL $49M + CTL $173M",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 1.91,
      "other": null
     }
    },
    {
     "bank": "MUFG",
     "role": "CLA",
     "commitment_musd": 150.0,
     "status": "UW CTL $173M only (no EBL)",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 1.71,
      "other": null
     }
    },
    {
     "bank": "Societe Generale",
     "role": "CLA",
     "commitment_musd": 150.0,
     "status": "UW EBL $49M + CTL $173M; hold $150M CTL",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 1.91,
      "other": null
     }
    },
    {
     "bank": "JLA/MLA/retail invites (BBVA, BNP, JPM, KDB, KfW, Mizuho, Nomura, OCBC, Rabobank, StanChart at $125M JLA target; CoBank, Apterra, BofA, BoC, Barclays, CACIB, First Citizens, GS, Intesa, Kookmin, LBBW, NatWest, Santander, Siemens, TD, US Bank, Webster at $75M MLA; AIB, BayernLB, Commerzbank, NBC, Sabadell $50M; Associated, CAT, Helaba $25M retail)",
     "role": "planned invites (tracker is a pre-launch plan)",
     "commitment_musd": null,
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": "final allocations not in this tracker"
     }
    }
   ]
  },
  {
   "name": "Project Walleye (data center + energy center financing: DC DDTL $2,081.8M, EC DDTL $842.4M, RCF $30M, LC $120M)",
   "total_size_musd": 3074.2,
   "currency": "USD",
   "type": "project finance (DDTL + RCF + LC)",
   "status": "Closed; $5,895M committed vs $3,074M facility (1.9x oversubscribed) as of 5/27/26. At close the 5 CLAs each held $614.84M (DC $416.4M + EC $168.5M + RCF $6M + LC $24M). 2026 Walleye lender fees total $66.1M.",
   "as_of": "2026-05-27",
   "fees_structure": {
    "syndication_fee_tiers": "JLA $175M commitment: Tranche A 125bps; Institutional 1 ($150M): A 100 / B 112.5; Institutional 2 ($100M): A 87.5 / B 100; Institutional 3 ($75M): A 62.5 / B 75; Institutional 4 (<$75M): A 37.5 / B 50 (bps; Tranche A by special invite)"
   },
   "lenders": [
    {
     "bank": "MUFG",
     "role": "CLA (20% UW $614.8M)",
     "commitment_musd": 614.8,
     "status": "closed; target hold $330M",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 13.83,
      "other": "closing financing fee $13,833,950"
     }
    },
    {
     "bank": "Natixis",
     "role": "CLA (20% UW)",
     "commitment_musd": 614.8,
     "status": "closed",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 13.83,
      "other": "closing financing fee $13,833,950"
     }
    },
    {
     "bank": "Societe Generale",
     "role": "CLA (20% UW)",
     "commitment_musd": 614.8,
     "status": "closed",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 13.83,
      "other": "closing financing fee $13,833,950"
     }
    },
    {
     "bank": "RBC",
     "role": "CLA (20% UW)",
     "commitment_musd": 614.8,
     "status": "closed",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 12.3,
      "other": "closing financing fee $12,296,844"
     }
    },
    {
     "bank": "SMBC",
     "role": "CLA (20% UW)",
     "commitment_musd": 614.8,
     "status": "closed",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 12.3,
      "other": "closing financing fee $12,296,844"
     }
    },
    {
     "bank": "Bank of China",
     "role": "JLA",
     "commitment_musd": 360.0,
     "status": "approved $360M, CL sent",
     "fees": {
      "upfront_bps": 125,
      "upfront_musd": null,
      "other": "JLA tier Tranche A 125bps"
     }
    },
    {
     "bank": "BBVA",
     "role": "JLA",
     "commitment_musd": 175.0,
     "status": "CL received",
     "fees": {
      "upfront_bps": 125,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "BNP",
     "role": "JLA",
     "commitment_musd": 175.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": 125,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Intesa Sanpaolo",
     "role": "JLA",
     "commitment_musd": 175.0,
     "status": "approved",
     "fees": {
      "upfront_bps": 125,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "KDB",
     "role": "JLA",
     "commitment_musd": 175.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": 125,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "KfW",
     "role": "JLA",
     "commitment_musd": 175.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": 125,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "NatWest",
     "role": "JLA",
     "commitment_musd": 175.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": 125,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "OCBC",
     "role": "JLA",
     "commitment_musd": 175.0,
     "status": "credit approved",
     "fees": {
      "upfront_bps": 125,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Rabobank",
     "role": "JLA",
     "commitment_musd": 175.0,
     "status": "CL received",
     "fees": {
      "upfront_bps": 125,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Standard Chartered",
     "role": "JLA",
     "commitment_musd": 175.0,
     "status": "approved (subject to EC completion report)",
     "fees": {
      "upfront_bps": 125,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "TD Bank",
     "role": "JLA",
     "commitment_musd": 175.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": 125,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Blackstone",
     "role": "Institutional",
     "commitment_musd": 750.0,
     "status": "credit approved for $1B, preferred allocation $750M",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": "institutional tier fees per grid"
     }
    },
    {
     "bank": "Bank of Baroda",
     "role": "Retail",
     "commitment_musd": 200.0,
     "status": "CL sent for $200M, preferred allocation $200M",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "ICBC",
     "role": "Retail",
     "commitment_musd": 150.0,
     "status": "approved",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Huntington",
     "role": "Retail",
     "commitment_musd": 100.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "NordLB",
     "role": "Retail",
     "commitment_musd": 100.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Shinhan",
     "role": "Retail",
     "commitment_musd": 100.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "UOB",
     "role": "Retail",
     "commitment_musd": 100.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "UMTB (Mizrahi)",
     "role": "Retail",
     "commitment_musd": 75.0,
     "status": "approved",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Woori Bank",
     "role": "Retail",
     "commitment_musd": 65.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Associated Bank",
     "role": "Retail",
     "commitment_musd": 50.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Banco Sabadell",
     "role": "Retail",
     "commitment_musd": 50.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Farmer Mac",
     "role": "Retail",
     "commitment_musd": 50.0,
     "status": "new CL for $50M",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "First Commercial",
     "role": "Retail",
     "commitment_musd": 30.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Webster Bank",
     "role": "Retail",
     "commitment_musd": 30.0,
     "status": "approved, CL received",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Bank of Hope",
     "role": "Retail",
     "commitment_musd": 25.0,
     "status": "CL provided",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Axiom",
     "role": "Retail",
     "commitment_musd": 10.0,
     "status": "approved, CL sent",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Apple Bank",
     "role": "Retail",
     "commitment_musd": 25.0,
     "status": "working - 75%",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "JA Mitsui",
     "role": "Retail",
     "commitment_musd": 50.0,
     "status": "working - 75%",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    }
   ]
  },
  {
   "name": "Project Beluga Accordion 2 (European portfolio refi - roll EUR 4,395M + new money EUR 1,500M)",
   "total_size_musd": null,
   "total_size_meur": 5895,
   "currency": "EUR",
   "type": "project finance / European portfolio facility (capex TL + RCF, accordion)",
   "status": "In syndication as of 2/20/26: 73.6% of existing book approved roll; new money EUR 1,250M underwritten by 5 bookrunners; EUR ~2,783M weighted new-money book. 2025 'Project Beluga Upsize' fees paid: $35.99M (MS sole structuring $6.19M).",
   "as_of": "2026-02-20",
   "fees_structure": {
    "other": "Morgan Stanley sole structuring bank EUR 6.19M equiv; JLM/bookrunner (active-passive) EUR 1.028M each to ABN AMRO, ING, Natixis, SocGen, SMBC; co-managers EUR 164k each to CACIB, BBVA, Mizuho, Rabobank, MUFG (from Beluga closing cashflow, Apr 2026)"
   },
   "lenders": [
    {
     "bank": "ABN AMRO",
     "role": "Bookrunner",
     "commitment_meur": 265.0,
     "status": "approved roll; new money UW EUR 250M",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 1.03,
      "other": "JLM/bookrunner fee EUR 884,375 (USD 1,028,014)"
     }
    },
    {
     "bank": "ING",
     "role": "Bookrunner",
     "commitment_meur": 200.0,
     "status": "approved; new money UW EUR 250M",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 1.03,
      "other": null
     }
    },
    {
     "bank": "Natixis",
     "role": "Bookrunner",
     "commitment_meur": 133.3,
     "status": "approved; new money UW EUR 250M",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 1.03,
      "other": null
     }
    },
    {
     "bank": "Societe Generale",
     "role": "Bookrunner",
     "commitment_meur": 275.0,
     "status": "approved; new money UW EUR 250M",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 1.03,
      "other": null
     }
    },
    {
     "bank": "SMBC",
     "role": "Bookrunner",
     "commitment_meur": 100.0,
     "status": "approved; new money UW EUR 250M",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 1.03,
      "other": null
     }
    },
    {
     "bank": "Morgan Stanley",
     "role": "Sole Structuring Bank",
     "commitment_meur": null,
     "status": "structuring only",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 6.19,
      "other": "sole structuring fee EUR 5,306,250 -> USD 6,187,458"
     }
    },
    {
     "bank": "Infranity (Generali funds)",
     "role": "Existing lender",
     "commitment_meur": 340.0,
     "status": "declined roll",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "MEAG (Munich Re funds)",
     "role": "Existing lender",
     "commitment_meur": 320.0,
     "status": "reviewing",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "LBBW",
     "role": "Existing lender",
     "commitment_meur": 180.0,
     "status": "reviewing; +EUR 150M accordion @100%",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Mizuho",
     "role": "Existing lender / Co-manager",
     "commitment_meur": 174.3,
     "status": "approved",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 0.16,
      "other": "co-manager fee EUR 141,500"
     }
    },
    {
     "bank": "KfW IPEX",
     "role": "Existing lender",
     "commitment_meur": 170.8,
     "status": "reviewing",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Rabobank",
     "role": "Existing lender / Co-manager",
     "commitment_meur": 170.0,
     "status": "reviewing; +EUR 100M accordion",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 0.16,
      "other": null
     }
    },
    {
     "bank": "OCBC",
     "role": "Existing lender",
     "commitment_meur": 160.0,
     "status": "reviewing; accordion EUR 75M @100%",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "KDB",
     "role": "Existing lender",
     "commitment_meur": 150.0,
     "status": "reviewing (4-6 weeks); accordion EUR 150M @100%",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "DNB",
     "role": "Existing lender",
     "commitment_meur": 140.0,
     "status": "declined",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "BBVA",
     "role": "Existing lender / Co-manager",
     "commitment_meur": 135.0,
     "status": "approved",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 0.16,
      "other": null
     }
    },
    {
     "bank": "Credit Agricole CIB",
     "role": "Existing lender / Co-manager",
     "commitment_meur": 120.0,
     "status": "reviewing; +EUR 100M accordion @100%",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 0.16,
      "other": null
     }
    },
    {
     "bank": "Intesa Sanpaolo",
     "role": "Existing lender",
     "commitment_meur": 120.0,
     "status": "reviewing",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "NatWest",
     "role": "Existing lender",
     "commitment_meur": 110.0,
     "status": "reviewing; accordion EUR 75M @100%",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "NAB",
     "role": "Existing lender",
     "commitment_meur": 106.3,
     "status": "reviewing; accordion EUR 100M @50%",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "MUFG",
     "role": "Potential new lender / Co-manager",
     "commitment_meur": null,
     "status": "reviewing; accordion EUR 175M @100% approved at final committee",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": 0.16,
      "other": null
     }
    },
    {
     "bank": "Unicredit",
     "role": "Existing lender",
     "commitment_meur": 80.0,
     "status": "reviewing",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Other existing lenders (BNP AM 75, KFW 171, TD 60, PKO 60, Sunlife 60 declined, EDRAM 45, AG Insurance 50, CIC 39, StanChart 39, HKMC 39, Ampega 35, Shinhan 35, Siemens 30, La Banque Postale 30 declined, Dai Ichi 25, Sinopac 24, E.Sun 20, Zencap 18, Erste 46 declined, Bank of China 66 declined, Canada Life 35 declined, Kookmin 40 declined)",
     "role_detail": "existing",
     "commitment_meur": null,
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    }
   ]
  },
  {
   "name": "Project Metropolis (Malaysia/Labuan PF - Term Loan $640M + Equity Bridge $160M)",
   "total_size_musd": 800,
   "currency": "USD",
   "type": "project finance (TL + EBL)",
   "status": "Closed 16-Jul-2026. Lender upfront fees $9.72M ($9.6M TL + $0.117M EBL) + structuring fees $2.275M = $11.99M total 2026 Metropolis PF fees.",
   "as_of": "2026-07-16",
   "fees_structure": {
    "tl_upfront_pct": 1.5,
    "ebl_upfront_pct_new_lenders_only": 0.75,
    "structuring_fee": "$425k each to Clifford Capital, MUFG, Natixis, OCBC, Mizuho; ING $150k ESG coordinator fee"
   },
   "lenders": [
    {
     "bank": "BNP Paribas (Singapore)",
     "role": "TL + EBL lender",
     "commitment_musd": 110.02,
     "status": "TL $83.36M + EBL $26.67M",
     "fees": {
      "upfront_bps": 150,
      "upfront_musd": 1.309,
      "other": "TL upfront $1,250,331 + EBL upfront $58,341 (new lender)"
     }
    },
    {
     "bank": "Clifford Capital (Asset Finance + Holdings)",
     "role": "TL + EBL lender",
     "commitment_musd": 110.02,
     "status": "TL $68.36M + $15M + EBL $26.67M",
     "fees": {
      "upfront_bps": 150,
      "upfront_musd": 1.675,
      "other": "TL upfront $1,025,331 + $225,000 + structuring $425,000; EBL $0 (existing)"
     }
    },
    {
     "bank": "DBS",
     "role": "TL lender",
     "commitment_musd": 83.36,
     "status": "TL only",
     "fees": {
      "upfront_bps": 150,
      "upfront_musd": 1.25,
      "other": "upfront $1,250,331"
     }
    },
    {
     "bank": "ING (Singapore)",
     "role": "TL + EBL lender, ESG coordinator",
     "commitment_musd": 110.02,
     "status": "TL $83.36M + EBL $26.67M",
     "fees": {
      "upfront_bps": 150,
      "upfront_musd": 1.459,
      "other": "TL $1,250,331 + ESG coordinator $150,000 + EBL $58,341 (new)"
     }
    },
    {
     "bank": "MUFG (Labuan)",
     "role": "TL + EBL lender, Agent",
     "commitment_musd": 83.18,
     "status": "TL $56.51M + EBL $26.67M",
     "fees": {
      "upfront_bps": 150,
      "upfront_musd": 1.273,
      "other": "TL $847,682 + structuring $425,000; EBL $0 (existing); also agent fees"
     }
    },
    {
     "bank": "Natixis (Singapore)",
     "role": "TL + EBL lender",
     "commitment_musd": 110.02,
     "status": "TL $83.36M + EBL $26.67M",
     "fees": {
      "upfront_bps": 150,
      "upfront_musd": 1.675,
      "other": "TL $1,250,331 + structuring $425,000; EBL $0"
     }
    },
    {
     "bank": "OCBC (Labuan)",
     "role": "TL + EBL lender",
     "commitment_musd": 110.02,
     "status": "TL $83.36M + EBL $26.67M",
     "fees": {
      "upfront_bps": 150,
      "upfront_musd": 1.675,
      "other": "TL $1,250,331 + structuring $425,000; EBL $0"
     }
    },
    {
     "bank": "Mizuho",
     "role": "TL lender",
     "commitment_musd": 83.36,
     "status": "TL only",
     "fees": {
      "upfront_bps": 150,
      "upfront_musd": 1.675,
      "other": "TL $1,250,331 + structuring $425,000"
     }
    }
   ]
  },
  {
   "name": "Corporate LC platform (uncommitted bilateral LC facilities, Edgeconnex International Cooperatief U.A.)",
   "total_size_musd": 1928,
   "currency": "USD",
   "type": "LC / standby letters of credit (uncommitted bilateral facilities)",
   "status": "Active; $1,301M issued of $1,928M corporate capacity as of 7/20/26 (plus $197M ring-fenced: ING Beluga $20M, ABN AMRO Beluga $15M, ING US ABS $12M, SocGen Shiner $30M, SocGen Walleye ringfence $120M).",
   "as_of": "2026-07-20",
   "fees_structure": {
    "lc_facility_upfront_pct": 0.5
   },
   "lenders": [
    {
     "bank": "BBVA",
     "role": "LC issuer (uncommitted)",
     "commitment_musd": 500,
     "status": "issued $250.9M; upsized 6/25/26",
     "fees": {
      "upfront_bps": 50,
      "upfront_musd": 1.96,
      "other": "BBVA LC facility fees in fee file (combined ~$1.96M)"
     }
    },
    {
     "bank": "Natixis North America",
     "role": "LC issuer",
     "commitment_musd": 300,
     "status": "issued $227.9M; upsized from $163M to $300M 6/29/26; $60M EBL cap / $40M financial LC cap",
     "fees": {
      "upfront_bps": 50,
      "upfront_musd": null,
      "other": "NTX LC facility"
     }
    },
    {
     "bank": "Societe Generale",
     "role": "LC issuer",
     "commitment_musd": 300,
     "status": "issued $200M; closed $100M upsize 6/26/26 (up to $550m)",
     "fees": {
      "upfront_bps": 50,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Barclays",
     "role": "LC issuer",
     "commitment_musd": 200,
     "status": "committed, $0 issued; not able to participate in EBL if they participate",
     "fees": {
      "upfront_bps": 50,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Rabobank",
     "role": "LC issuer",
     "commitment_musd": 150,
     "status": "issued $149.6M; only EBL LCs",
     "fees": {
      "upfront_bps": 50,
      "upfront_musd": 0.3,
      "other": "Rabo LC facility upfront fee $300,000 (2026)"
     }
    },
    {
     "bank": "SMBC",
     "role": "LC issuer",
     "commitment_musd": 100,
     "status": "issued $96.2M; $100M cap combined EBL+financial LCs",
     "fees": {
      "upfront_bps": 50,
      "upfront_musd": null,
      "other": "SMBC LC facilities fees 2025 ~$0.25M+"
     }
    },
    {
     "bank": "MUFG",
     "role": "LC issuer",
     "commitment_musd": 100,
     "status": "issued $100M",
     "fees": {
      "upfront_bps": 50,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "SCB (Standard Chartered)",
     "role": "LC issuer",
     "commitment_musd": 100,
     "status": "issued $100M",
     "fees": {
      "upfront_bps": 50,
      "upfront_musd": null,
      "other": "SCB LC facility"
     }
    },
    {
     "bank": "ING",
     "role": "LC issuer",
     "commitment_musd": 80,
     "status": "issued $78.7M; only utility LCs",
     "fees": {
      "upfront_bps": 50,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Blackstone",
     "role": "LC issuer",
     "commitment_musd": 98,
     "status": "issued $98M",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    },
    {
     "bank": "Citi",
     "role": "LC issuer (pipeline)",
     "commitment_musd": 0,
     "status": "listed, no commitment yet",
     "fees": {
      "upfront_bps": null,
      "upfront_musd": null,
      "other": null
     }
    }
   ]
  },
  {
   "name": "Other facilities from Lender Fees Summary (fee bases; per-bank splits not fully parseable)",
   "total_size_musd": null,
   "currency": "USD",
   "type": "various",
   "status": "reference",
   "as_of": "2026-07-21",
   "facilities_detail": [
    {
     "name": "Narwhal (HoldCo)",
     "fee_base_musd": 800,
     "upfront_pct": 2.0,
     "commitment_fee_pct": 1.5,
     "uw_fee_pct": 0.25,
     "total_fees_musd": 16.0,
     "note": "Labeled as HoldCo; Wahoo Upsize I/II (Tranche A4/B4 $500M + supplemental $300M) are extensions of this facility ($10M + $6M fees)"
    },
    {
     "name": "Leroy",
     "fee_base_musd": 1000,
     "upfront_pct": 2.0,
     "commitment_fee": "sliding 1.0% (<$200m) to 2.5% (>$400m)",
     "uw_fee_pct": 0.25,
     "total_fees_musd": 20.0,
     "lenders": [
      {
       "bank": "Blackstone",
       "fees_musd": 21.25
      },
      {
       "bank": "Ares",
       "fees_musd": 19.84
      }
     ]
    },
    {
     "name": "Nemo (Webster)",
     "fee_base_musd": 25,
     "upfront_pct": 1.5,
     "commitment_fee_pct": 0.5,
     "total_fees_musd": 0.4
    },
    {
     "name": "Gotham",
     "fee_base_musd": 279.5,
     "upfront_pct": 1.0,
     "commitment_fee": "30% of margin",
     "total_fees_musd": 2.795,
     "note": "MUFG is main LC issuer for Gotham LCs"
    },
    {
     "name": "Project Vendace",
     "total_2026_fees_musd": 15.14
    },
    {
     "name": "Project Orca",
     "total_2026_fees_musd": 13.18,
     "note": "Beluga accordion closing fees routed via MS: bookrunners ABN/ING/Natixis/SocGen/SMBC ~$1.03M each; co-managers CACIB/BBVA/Mizuho/Rabobank/MUFG ~$0.16M each"
    },
    {
     "name": "Project Beluga Upsize",
     "total_2025_fees_musd": 35.99
    },
    {
     "name": "Project Narluga",
     "total_2026_fees_musd": 7.2,
     "lenders": [
      {
       "bank": "Ares",
       "fees_musd": 7.2
      }
     ]
    }
   ],
   "lenders": []
  }
 ],
 "fee_matrix": {
  "source": "Lender Fees Summary_7.21.26(_VF).xlsx - ECX Lender Fees for 2025 & 2026 Transactions",
  "deals_2025": [
   "Narwhal",
   "Leroy",
   "Nemo",
   "SMBC LC Facilities",
   "Gotham",
   "Tarpon Bridge",
   "Tarpon PF",
   "Shiner",
   "Metropolis",
   "BBVA LC Facility",
   "SMBC LC Facility",
   "SCB LC Facility",
   "NTX LC Facility",
   "Project Wahoo Upsize I"
  ],
  "deals_2026": [
   "Project Wahoo Upsize II",
   "Project Vendace",
   "Project Beluga Upsize",
   "Project Orca",
   "Project Walleye",
   "Rabo LC Facility (upfront fee)",
   "Project Narluga",
   "Project Metropolis PF"
  ],
  "deal_totals": {
   "Nemo": 413000,
   "Gotham": 2795000,
   "Tarpon Bridge": 100000,
   "Tarpon PF": 16335872,
   "Shiner": 21849879,
   "Metropolis_2025": 2480326,
   "BBVA LC Facility": 0,
   "Project Wahoo Upsize I": 18302500,
   "Project Wahoo Upsize II": 6032167,
   "Project Vendace": 15136088,
   "Project Beluga Upsize": 35990581,
   "Project Orca": 13177952,
   "Project Walleye": 66095538,
   "Rabo LC Facility": 300000,
   "Project Narluga": 7200000,
   "Project Metropolis PF": 11991682
  },
  "grand_totals": {
   "total_2025": 103576094,
   "total_2026": 155924007,
   "total_combined": 259500101
  },
  "banks": [
   {
    "bank": "Societe Generale",
    "fees_by_deal": {
     "Project Walleye": 13833950,
     "Shiner": 4219661
    },
    "total_2025": 6545867,
    "total_2026": 25663534,
    "total_combined": 32209401,
    "alignment_confidence": "high"
   },
   {
    "bank": "Ares",
    "fees_by_deal": {
     "Leroy": 19837517,
     "Project Narluga": 7200000
    },
    "total_2025": 19837517,
    "total_2026": 7200000,
    "total_combined": 27037517,
    "alignment_confidence": "high"
   },
   {
    "bank": "Natixis",
    "fees_by_deal": {
     "Project Walleye": 13833950,
     "Project Metropolis PF": 1675331
    },
    "total_2025": 5792685,
    "total_2026": 19770821,
    "total_combined": 25563506,
    "alignment_confidence": "high"
   },
   {
    "bank": "Blackstone",
    "fees_by_deal": {
     "Leroy": 21250000
    },
    "total_2025": 21250000,
    "total_2026": 0,
    "total_combined": 21250000,
    "alignment_confidence": "high"
   },
   {
    "bank": "MUFG",
    "fees_by_deal": {
     "Project Walleye": 13833950,
     "Project Metropolis PF": 1272682
    },
    "total_2025": 3358389,
    "total_2026": 17453858,
    "total_combined": 20812247,
    "alignment_confidence": "high"
   },
   {
    "bank": "SMBC",
    "fees_by_deal": {
     "Project Walleye": 12296844
    },
    "total_2025": 4032133,
    "total_2026": 16558384,
    "total_combined": 20590517,
    "alignment_confidence": "high"
   },
   {
    "bank": "RBC",
    "fees_by_deal": {
     "Project Walleye": 12296844
    },
    "total_2025": 1196429,
    "total_2026": 12296844,
    "total_combined": 13493273,
    "alignment_confidence": "high"
   },
   {
    "bank": "Morgan Stanley",
    "fees_by_deal": {
     "Shiner": 3179191,
     "Project Beluga Upsize": 6187458
    },
    "total_2025": 3179191,
    "total_2026": 6187458,
    "total_combined": 9366649,
    "alignment_confidence": "high"
   },
   {
    "bank": "ING",
    "fees_by_deal": {
     "Project Metropolis PF": 1458672,
     "Project Beluga Upsize": 1028014
    },
    "total_2025": 2463207,
    "total_2026": 5720212,
    "total_combined": 8183419,
    "alignment_confidence": "high"
   },
   {
    "bank": "Goldman Sachs",
    "fees_by_deal": {},
    "total_2025": 150000,
    "total_2026": 7568044,
    "total_combined": 7718044,
    "alignment_confidence": "medium"
   },
   {
    "bank": "TD Bank",
    "fees_by_deal": {},
    "total_2025": 4158929,
    "total_2026": 1664130,
    "total_combined": 5823059,
    "alignment_confidence": "medium"
   },
   {
    "bank": "OCBC",
    "fees_by_deal": {
     "Project Metropolis PF": 1675331
    },
    "total_2025": 2500677,
    "total_2026": 2330154,
    "total_combined": 4830831,
    "alignment_confidence": "high"
   },
   {
    "bank": "JP Morgan",
    "fees_by_deal": {
     "Shiner": 3179191
    },
    "total_2025": 4375619,
    "total_2026": 0,
    "total_combined": 4375619,
    "alignment_confidence": "medium"
   },
   {
    "bank": "ABN AMRO",
    "fees_by_deal": {
     "Project Beluga Upsize": 1028014
    },
    "total_2025": 0,
    "total_2026": 4261540,
    "total_combined": 4261540,
    "alignment_confidence": "high"
   },
   {
    "bank": "Credit Agricole CIB",
    "fees_by_deal": {
     "Project Beluga Upsize": 164482
    },
    "total_2025": 691666,
    "total_2026": 3495893,
    "total_combined": 4187559,
    "alignment_confidence": "medium"
   },
   {
    "bank": "BNP Paribas",
    "fees_by_deal": {
     "Project Metropolis PF": 1308672
    },
    "total_2025": 0,
    "total_2026": 3621469,
    "total_combined": 3621469,
    "alignment_confidence": "high"
   },
   {
    "bank": "Nomura",
    "fees_by_deal": {
     "Shiner": 3179191
    },
    "total_2025": 3291691,
    "total_2026": 0,
    "total_combined": 3291691,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Mizuho",
    "fees_by_deal": {
     "Project Metropolis PF": 1675331,
     "Project Beluga Upsize": 164482
    },
    "total_2025": 1133000,
    "total_2026": 1839813,
    "total_combined": 2972813,
    "alignment_confidence": "high"
   },
   {
    "bank": "Clifford Capital",
    "fees_by_deal": {
     "Project Metropolis PF": 1675331,
     "Metropolis (2025)": 612582
    },
    "total_2025": 612582,
    "total_2026": 2330154,
    "total_combined": 2942736,
    "alignment_confidence": "high"
   },
   {
    "bank": "Barclays",
    "fees_by_deal": {},
    "total_2025": 500000,
    "total_2026": 2176680,
    "total_combined": 2676680,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Rabobank",
    "fees_by_deal": {
     "Project Beluga Upsize": 164482,
     "Rabo LC Facility": 300000
    },
    "total_2025": 1196429,
    "total_2026": 1464130,
    "total_combined": 2660559,
    "alignment_confidence": "medium"
   },
   {
    "bank": "BBVA",
    "fees_by_deal": {
     "Project Beluga Upsize": 164482
    },
    "total_2025": 2368095,
    "total_2026": 164482,
    "total_combined": 2532577,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Nordea",
    "fees_by_deal": {},
    "total_2025": 0,
    "total_2026": 2419208,
    "total_combined": 2419208,
    "alignment_confidence": "medium"
   },
   {
    "bank": "NBC (National Bank of Canada)",
    "fees_by_deal": {},
    "total_2025": 2258929,
    "total_2026": 0,
    "total_combined": 2258929,
    "alignment_confidence": "medium"
   },
   {
    "bank": "UniCredit",
    "fees_by_deal": {},
    "total_2025": 0,
    "total_2026": 2182744,
    "total_combined": 2182744,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Banco Bilbao Vizcaya Argentaria (2nd line, incl. BBVA LC)",
    "fees_by_deal": {},
    "total_2025": 0,
    "total_2026": 1964469,
    "total_combined": 1964469,
    "alignment_confidence": "low"
   },
   {
    "bank": "Intesa Sanpaolo",
    "fees_by_deal": {},
    "total_2025": 691667,
    "total_2026": 1164130,
    "total_combined": 1855797,
    "alignment_confidence": "medium"
   },
   {
    "bank": "First Citizens",
    "fees_by_deal": {},
    "total_2025": 1788095,
    "total_2026": 0,
    "total_combined": 1788095,
    "alignment_confidence": "medium"
   },
   {
    "bank": "KfW",
    "fees_by_deal": {},
    "total_2025": 1550595,
    "total_2026": 0,
    "total_combined": 1550595,
    "alignment_confidence": "medium"
   },
   {
    "bank": "DBS",
    "fees_by_deal": {
     "Project Metropolis PF": 1250331
    },
    "total_2025": 0,
    "total_2026": 1250331,
    "total_combined": 1250331,
    "alignment_confidence": "high"
   },
   {
    "bank": "Truist",
    "fees_by_deal": {},
    "total_2025": 1196429,
    "total_2026": 0,
    "total_combined": 1196429,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Wells Fargo",
    "fees_by_deal": {},
    "total_2025": 1196429,
    "total_2026": 0,
    "total_combined": 1196429,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Bank Leumi",
    "fees_by_deal": {},
    "total_2025": 0,
    "total_2026": 1148667,
    "total_combined": 1148667,
    "alignment_confidence": "medium"
   },
   {
    "bank": "NORD/LB",
    "fees_by_deal": {},
    "total_2025": 0,
    "total_2026": 1105924,
    "total_combined": 1105924,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Standard Chartered",
    "fees_by_deal": {},
    "total_2025": 1104667,
    "total_2026": 0,
    "total_combined": 1104667,
    "alignment_confidence": "medium"
   },
   {
    "bank": "CoBank",
    "fees_by_deal": {},
    "total_2025": 1062500,
    "total_2026": 0,
    "total_combined": 1062500,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Regions",
    "fees_by_deal": {},
    "total_2025": 720000,
    "total_2026": 0,
    "total_combined": 720000,
    "alignment_confidence": "medium"
   },
   {
    "bank": "PKO Bank Polski",
    "fees_by_deal": {},
    "total_2025": 0,
    "total_2026": 654823,
    "total_combined": 654823,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Hana Securities",
    "fees_by_deal": {},
    "total_2025": 600000,
    "total_2026": 0,
    "total_combined": 600000,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Bank of America",
    "fees_by_deal": {},
    "total_2025": 596429,
    "total_2026": 0,
    "total_combined": 596429,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Mizrahi (UMTB)",
    "fees_by_deal": {},
    "total_2025": 500000,
    "total_2026": 0,
    "total_combined": 500000,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Webster",
    "fees_by_deal": {},
    "total_2025": 475000,
    "total_2026": 0,
    "total_combined": 475000,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Citi",
    "fees_by_deal": {},
    "total_2025": 0,
    "total_2026": 375000,
    "total_combined": 375000,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Flagstar",
    "fees_by_deal": {},
    "total_2025": 0,
    "total_2026": 375000,
    "total_combined": 375000,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Infrastructure Finance DMP24 S.a r.l (DMP)",
    "fees_by_deal": {},
    "total_2025": 0,
    "total_2026": 349239,
    "total_combined": 349239,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Caterpillar",
    "fees_by_deal": {},
    "total_2025": 125000,
    "total_2026": 187500,
    "total_combined": 312500,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Principal Insurance Company",
    "fees_by_deal": {},
    "total_2025": 295000,
    "total_2026": 0,
    "total_combined": 295000,
    "alignment_confidence": "medium"
   },
   {
    "bank": "ANZ",
    "fees_by_deal": {},
    "total_2025": 0,
    "total_2026": 291033,
    "total_combined": 291033,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Principal Insurance Company (2nd line)",
    "fees_by_deal": {},
    "total_2025": 200000,
    "total_2026": 0,
    "total_combined": 200000,
    "alignment_confidence": "low"
   },
   {
    "bank": "Preferred Bank",
    "fees_by_deal": {},
    "total_2025": 187500,
    "total_2026": 0,
    "total_combined": 187500,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Siemens",
    "fees_by_deal": {},
    "total_2025": 175000,
    "total_2026": 0,
    "total_combined": 175000,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Credit Industriel et Commercial (CIC)",
    "fees_by_deal": {},
    "total_2025": 0,
    "total_2026": 174620,
    "total_combined": 174620,
    "alignment_confidence": "medium"
   },
   {
    "bank": "National Australia Bank",
    "fees_by_deal": {},
    "total_2025": 0,
    "total_2026": 174620,
    "total_combined": 174620,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Hong Kong Mortgage Corporation (HKMC)",
    "fees_by_deal": {},
    "total_2025": 0,
    "total_2026": 174620,
    "total_combined": 174620,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Rabobank (2nd line)",
    "fees_by_deal": {
     "Project Beluga Upsize": 164482
    },
    "total_2025": 0,
    "total_2026": 164482,
    "total_combined": 164482,
    "alignment_confidence": "low"
   },
   {
    "bank": "Farmer Mac",
    "fees_by_deal": {},
    "total_2025": 156250,
    "total_2026": 0,
    "total_combined": 156250,
    "alignment_confidence": "medium"
   },
   {
    "bank": "Investec",
    "fees_by_deal": {},
    "total_2025": 62500,
    "total_2026": 0,
    "total_combined": 62500,
    "alignment_confidence": "medium"
   }
  ]
 }
};
