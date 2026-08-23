export type Fit = "best" | "strong" | "training" | "later"

export type Brokerage = {
  id: string
  rank: number
  name: string
  dre: string
  fit: Fit
  tagline: string
  whyForYou: string
  officeRequired: false
  newAgentOk: boolean
  partTimeOk: boolean
  monthlyFee: number
  signupFee: number
  splitSummary: string
  firstYearNote: string
  support: string
  metroList: string
  applyUrl: string
  applyLabel: string
  phone?: string
  questions: string[]
  watchouts: string[]
}

export const profile = {
  city: "Modesto, California",
  license: "California salesperson (newly licensed)",
  goal: "Work independently with little or no office time",
  mls: "MetroList (Stanislaus, San Joaquin, Sacramento region)",
  association: "Lodi Association of REALTORS® — Modesto office",
} as const

export const brokerages: Brokerage[] = [
  {
    id: "reebroker",
    rank: 1,
    name: "REeBroker Group",
    dre: "01522411",
    fit: "best",
    tagline: "Best first call from Modesto if you want zero desk time and no monthly bill.",
    whyForYou:
      "California cloud brokerage since 2005. Officially no office requirement, accepts newly licensed and dual-career agents, and already has a Manteca branch on file — you still work from home. Year one with 0–3 deals, a $0 monthly fee matters more than a national brand.",
    officeRequired: false,
    newAgentOk: true,
    partTimeOk: true,
    monthlyFee: 0,
    signupFee: 0,
    splitSummary:
      "100% after a flat ~$500 broker fee + risk management (~$200 per million of sale price). Optional 8% plan capped at $15,000/year.",
    firstYearNote:
      "Newly licensed agents must use mentorship on the first file (~25% of that commission). After that, you are on the flat-fee plan.",
    support:
      "24/7 broker hotline, Zoom file review, on-demand training. Phone (760) 722-3222.",
    metroList:
      "You join LAR + MetroList yourself; they sign association paperwork and help you pick a board. Confirm MetroList participant status on the call.",
    applyUrl: "https://reebroker.com/becomeanagent.aspx",
    applyLabel: "Apply to REeBroker",
    phone: "760-722-3222",
    questions: [
      "Are you a MetroList participant so I can join as a subscriber from Modesto?",
      "Will you DocuSign LAR and MetroList forms remotely?",
      "On my first file, is mentorship 25% instead of the $500 flat fee, or in addition?",
      "Is E&O inside the risk-management fee?",
    ],
    watchouts: [
      "First-file mentorship is required for new licensees — that is actually useful, but confirm the math.",
      "You still pay NAR / C.A.R. / LAR / MetroList dues yourself.",
    ],
  },
  {
    id: "real-estate-source",
    rank: 2,
    name: "Real Estate Source, Inc.",
    dre: "01869619",
    fit: "strong",
    tagline: "Simplest 100% plan: $595 a file, E&O included, no monthly fee.",
    whyForYou:
      "Folsom-based California brokerage (closer to you than most cloud shops). Optional free meeting space in Folsom if you ever want a table — not required. Clean math for a new agent who may close one or two deals this year.",
    officeRequired: false,
    newAgentOk: true,
    partTimeOk: true,
    monthlyFee: 0,
    signupFee: 0,
    splitSummary: "100% commission. $595 flat broker fee per transaction, including E&O. No desk, tech, or monthly fees advertised.",
    firstYearNote:
      "No monthly carry. Two Modesto-priced deals cost about $1,190 to the brokerage before association/MLS dues.",
    support: "They advertise 24/7 broker support and transaction coordinators. Confirm response time for a first-time purchase agreement.",
    metroList:
      "Ask whether they already participate in MetroList. Folsom is MetroList territory, which is a good sign — still verify Modesto subscriber paperwork.",
    applyUrl: "https://morecommission.info/",
    applyLabel: "Open Real Estate Source",
    questions: [
      "Can a Modesto agent hang with you and join MetroList + LAR without coming to Folsom?",
      "Who reviews my first residential purchase agreement, and how fast?",
      "Any extra fee for dual agency or a personal / family deal?",
    ],
    watchouts: [
      "Less of a national training campus than eXp. You will generate your own business.",
      "Confirm current $595 figure on the call — published fees move.",
    ],
  },
  {
    id: "real",
    rank: 3,
    name: "Real Brokerage",
    dre: "02022092",
    fit: "strong",
    tagline: "National cloud shop with no monthly fee and a $12k cap.",
    whyForYou:
      "Fully virtual. California entity is Real Brokerage Technologies (DRE 02022092), designated officer Robert Watson. No desk, no monthly technology bill. Better long-term math than eXp if you start closing regularly — worse than a flat-fee CA shop if you close one deal.",
    officeRequired: false,
    newAgentOk: true,
    partTimeOk: true,
    monthlyFee: 0,
    signupFee: 249,
    splitSummary:
      "85/15 until a $12,000 anniversary cap, then 100% minus ~$285 per sale. $750 annual brokerage fee taken from the first three closings ($900 effective 9/1/2026). $40 CBR fee per file ($50 after 9/1/2026).",
    firstYearNote:
      "$249 to join. No monthly bill if you close nothing. On 2 deals at $10k GCI each, you still pay 15% + CBR + a slice of the annual fee.",
    support:
      "Cloud platform (reZEN). Broker signatures: casign@therealbrokerage.com. CA broker desk: cabroker@therealbrokerage.com. (855) 450-0442.",
    metroList:
      "eXp/Real agents in this region routinely join MetroList; you still complete subscriber paperwork and need the designated broker’s signature.",
    applyUrl: "https://joinrealbrokerage.com/",
    applyLabel: "Apply to Real",
    phone: "855-450-0442",
    questions: [
      "Do you have a MetroList participant broker for a Stanislaus County agent?",
      "Is there a new-agent mentor split on my first files?",
      "Who sponsors me in California, and do I have to join a team?",
    ],
    watchouts: [
      "Join flow usually wants a sponsor. You do not have to join a team; team caps are different.",
      "National cloud = thinner local coaching unless you pick a Central Valley mentor.",
    ],
  },
  {
    id: "exp",
    rank: 4,
    name: "eXp Realty of California",
    dre: "01878277",
    fit: "training",
    tagline: "Most training without a building — but you pay $85 every month even with zero deals.",
    whyForYou:
      "True cloud campus (eXp World), kvCORE, and a defined new-agent mentor program. San Ramon corporate office; you never have to go. Worth it if you want structure. Expensive if you are dual-career and might close slowly.",
    officeRequired: false,
    newAgentOk: true,
    partTimeOk: true,
    monthlyFee: 85,
    signupFee: 149,
    splitSummary:
      "80/20 to a $16,000 anniversary cap, then 100% minus a ~$250 transaction fee. ~$25 broker review + ~$60 risk management per file. New agents: extra mentor split on the first three deals (commonly 60/20/10/10).",
    firstYearNote:
      "$85 × 12 = $1,020 even if you close nothing. First three deals keep less than 80%. Strongest virtual training of this list.",
    support:
      "Virtual campus, mentor program, CA broker email ca.broker@exprealty.net. License transfer uses DRE 01878277.",
    metroList:
      "Documented CA process: association/MLS forms go to the CA broker for signature. MetroList is used by eXp agents in Stanislaus County.",
    applyUrl: "https://joinapp.exprealty.com/",
    applyLabel: "Apply to eXp",
    questions: [
      "Who would mentor a brand-new Modesto agent, and is the extra split only on three files?",
      "Will you sign LAR / MetroList documents the same week I transfer?",
      "Can I skip recruiting / revenue share and just sell?",
    ],
    watchouts: [
      "Monthly fee never sleeps. Bad fit if you only want the license parked.",
      "You will be asked to pick a sponsor. Pick someone who actually answers the phone, not a random recruiter.",
    ],
  },
]

export const skipList = [
  {
    name: "Keller Williams Modesto / Manteca",
    reason:
      "Actively hiring, including unlicensed applicants — but the culture is office, training rooms, and team production. Skip if you do not want to go in.",
  },
  {
    name: "PMZ Real Estate",
    reason:
      "The local listing machine. Strong brand in Stanislaus. Also a traditional shop. Only consider if you change your mind and want a bullpen.",
  },
  {
    name: "Coldwell Banker / Century 21 / Compass",
    reason:
      "Franchise or coastal culture, floor time or office expectations in most shops. Compass is not a Modesto-first brokerage.",
  },
]

export const localSetup = {
  dreLicensing: {
    title: "Hang your license (DRE eLicensing)",
    url: "https://secure.dre.ca.gov/elicensing/",
    steps: [
      "Create or log in to DRE eLicensing.",
      "Choose Add Responsible Broker (you are newly licensed, not transferring from another shop).",
      "Enter the brokerage DRE number from the card you pick.",
      "The new broker certifies online. You cannot take listings until that affiliation is active on dre.ca.gov.",
    ],
  },
  association: {
    title: "Join the Lodi Association of REALTORS®",
    url: "https://connectlar.org/",
    phone: "(209) 523-5316",
    address: "421 E Morris Ave, Modesto, CA 95354",
    notes:
      "LAR covers Modesto, Turlock, Ceres, and the rest of Stanislaus/San Joaquin. Membership is how you get C.A.R. zipForm and NAR. Budget roughly $1,000–1,800 in year-one NAR + C.A.R. + local dues (confirm current invoice with LAR). Apply at connectlar.org.",
  },
  mls: {
    title: "MetroList subscriber access",
    phone: "(888) 898-9788 ext. 330",
    email: "modesto@metrolist.net",
    notes:
      "MetroList is the MLS for Stanislaus County (Prospector). Your broker must be a MetroList participant; you join as a subscriber. Identity is usually in person at a MetroList admin center or via a notarized application — that is onboarding, not floor time. Admin fee has been $200 plus monthly/quarterly service and an eKEY lockbox fee.",
  },
  callScript: [
    "I am a newly licensed California salesperson in Modesto.",
    "I need a brokerage with no office or floor-time requirement.",
    "I will generate my own business (sphere, notary, and local marketing).",
    "I need MetroList subscriber access and LAR membership paperwork signed remotely.",
    "Please email the current independent-contractor agreement and a written fee schedule before I transfer my DRE.",
  ],
}

export const fitLabel: Record<Fit, string> = {
  best: "Start here",
  strong: "Strong fit",
  training: "If you want training",
  later: "Later",
}
