export interface StatCardData {
  number: string;
  label: string;
}

export interface TeamMemberData {
  role: string;
  iconName: string;
}

export interface ApproachStepData {
  number: number;
  title: string;
  description: string;
}

export interface ImpactStatData {
  value: number;
  suffix: string;
  label: string;
}

export interface GoalCardData {
  number: string;
  title: string;
  outcomes: string[];
}

export interface OutcomeData {
  text: string;
  sdg: string;
}

export interface CollaboratorData {
  name: string;
  logo?: string;
}

export const NAVBAR_CONTENT = {
  logo: {
    monogram: "TDG",
    fullName: "Turning Drylands Green",
  },
  links: [
    { label: "Problem", href: "#problem" },
    { label: "About", href: "#about" },
    { label: "Approach", href: "#approach" },
    { label: "Impact", href: "#impact" },
    { label: "Outcomes", href: "#outcomes" },
    { label: "Collaborate", href: "#collaborate" },
    { label: "Contact", href: "#contact" },
  ],
  cta: "Partner With Us",
};

export const HERO_CONTENT = {
  headline: "Turning Drylands Green",
  subheading: "Rehabilitating Kenya's Drylands Catchments. Restoring Denuded Landscapes. Securing Livelihoods.",
  ctaLearnMore: "Learn More",
  ctaPartner: "Partner With Us",
};

export const PROBLEM_CONTENT = {
  eyebrow: "CONTEXT",
  paragraphs: [
    "Over 84% of Kenya's landmass (approximately 587,000 square kilometers) is classified as Arid and Semi-Arid Lands (ASAL). These vast landscapes are incredibly fragile, increasingly harsh, and severely denuded.",
    "Driven by global climate change, dryland degradation has accelerated rapidly. Drought frequency has shifted from a historical recurrence cycle of every 10–15 years (pre-1960s) to very frequently (less than a year) today, leaving ecosystems no time to recover.",
    "The consequences are devastating: Oxfam reports over KES 11.2 Billion in livestock losses, exacerbated by recurring flash floods that wash away topsoil, accelerate erosion, and cause direct loss of human and animal lives."
  ],
  stats: [
    { number: "84%", label: "Kenya classified as ASAL" },
    { number: "<1 yr", label: "Drought recurrence cycle today" },
    { number: "KES 11.2B", label: "Livestock losses reported" }
  ] as StatCardData[],
};

export const ABOUT_CONTENT = {
  eyebrow: "ABOUT TDG",
  history: {
    founded: "December 2022",
    established: "June 2024",
    authority: "Registrar of Societies, Attorney General's Office, Kenya",
  },
  mission: "Rehabilitating Kenya's Dryland Catchments for the Restoration of Denuded Landscapes, Securing Livelihoods",
  narrative: "Turning Drylands Green (TDG) Foundation was formed out of direct field observations in Narok, Samburu, and Baringo counties. Witnessing animal carcasses littering dry grazing lands, children sleeping from hunger, and mothers digging dry riverbeds for hours to scoop a cup of water crystallised our mission. We believe that restoring ecosystems is the ultimate way to secure human livelihoods.",
  team: [
    { role: "Team Leader", iconName: "Users" },
    { role: "Dryland Hydrologist", iconName: "Droplet" },
    { role: "Conservatoire of Forests", iconName: "Trees" },
    { role: "Social Development Practitioner", iconName: "Handshake" },
    { role: "Range Grass Practitioner", iconName: "Sprout" },
    { role: "Environmentalist (Climate Change)", iconName: "Globe" },
    { role: "Construction Engineer", iconName: "Wrench" },
    { role: "Cartographer", iconName: "Map" },
    {role: "IT Specialist", iconName: "DeviceLaptop" }
  ] as TeamMemberData[],
};

export const APPROACH_CONTENT = {
  eyebrow: "THE STRATEGY",
  title: "Our Approach",
  steps: [
    {
      number: 1,
      title: "(Reconnaissance) Survey & Map",
      description: "Identify and map critical catchments across 7 counties using modern geographical data.",
    },
    {
      number: 2,
      title: "Community Mobilisation",
      description: "Elect and train Catchment User Groups to foster local ownership and long-term capacity building.",
    },
    {
      number: 3,
      title: "Development of Adequate Water Storage Infrastructure",
      description : "Develop water storage infrastructure to harvest and store rainwater for communities, livestock, and ecosystem restoration."
    },
    {
      number: 4,
      title: "Water Harvesting",
      description: "Excavate cut-off drains, water pans, and shallow wells, and actively rehabilitate natural waterways.",
    },
    {
      number: 5,
      title: "Vegetation Restoration",
      description: "Establish local nurseries, plant agro-forestry trees, fodder shrubs, and reseed dryland grass pastures.",
    },
    {
      number: 6,
      title: "Scale & Replicate",
      description: "Upscale and replicate our proven catchment restoration model across all drylands as funding allows.",
    },
  ] as ApproachStepData[],
  callout: "While this approach is multi-sectorial, implementation shall be synced — it should neither be left to ASALs, Water, Agriculture, Environment, nor Forestry departments solely.",
  counties: ["Baringo", "Kilifi", "Makueni", "Narok", "Kajiado", "Taita Taveta", "Turkana"],
};

export const IMPACT_CONTENT = {
  eyebrow: "IMPACT",
  title: "Why This Cannot Wait",
  stats: [
    { value: 25, suffix: "%", label: "of Kenya's population supported by ASALs" },
    { value: 50, suffix: "%+", label: "of labor force employed (directly & indirectly)" },
    { value: 188.2, suffix: "B", label: "livestock sector contribution to economy (KNBS 2022) in KES" },
    { value: 10, suffix: "%+", label: "of national export earnings from ASALs" },
  ] as ImpactStatData[],
};

export const GOALS_CONTENT = {
  eyebrow: "LOGFRAME",
  title: "Project Goals",
  cards: [
     {
      number: "01",
      title: "Community Mobilization and Empowerment",
      outcomes: [
        "Local communities fully trained in modern dryland forest management",
        "Establishment of functional governance for catchment user groups",
        "Equitable sharing of resources and management duties",
        "Empower displaced and returnee communities to own, lead and sustain rangeland restoration activities."
      ]
    },
    {
      number: "02",
      title: "Catchment Rehabilitation",
      outcomes: [
        "Dilapidated and eroded waterways restored to natural flows",
        "Soil stabilization through deliberate vegetation on embankments",
        "Mitigation of destructive flash floods downstream",
        "Re-establish physical and social connectivity in areas fragmented by hydrological damage",
        "Conduct gully healing interventions to mitigate negative impacts on subsurface water levels",
        "Control land degradation through erosion prevention and soil stabilization"
      ]
    },
    {
      number: "03",
      title: "Water Availability",
      outcomes: [
        "Targeting catchments in dry lands fully equipped with sustainable water",
        "Excavated water pans, cut-off drains, and shallow wells operational",
        "Reduced trek times for community water collection"
      ]
    },         
    {
      number: "04",
      title: "Forest Cover",
      outcomes: [
        "Increase regional forest cover by a target of 15%",
        "Community tree nurseries established with indigenous species",
        "Unlocking local carbon sequestration potential"
      ]
    },
    {
      number: "05",
      title: "Forage Improvement",
      outcomes: [
        "100 acres of improved pasture established per target catchment",
        "Identification and selection of resilient native grass species",
        "Year-round availability of livestock feed and fodder"
      ]
    },
    {
      number: "06",
      title: "Restoration of Livelihoods",
      outcomes: [
        "Improved pasture boosts livestock productivity and household income.",
        "Households shift from aid dependence to self-sufficient food production.",
        "Reliable water access reduces disease, travel burden, and resource conflict.",
        "Restored vegetation enables carbon credit income for communities."
      ]
    }
  ] as GoalCardData[],
};

export const OUTCOMES_CONTENT = {
  eyebrow: "DELIVERABLES",
  title: "Expected Outcomes",
  intro: "By syncing water harvesting, soil conservation, and biological restoration, the TDG Foundation targets systemic impact. Our Interventions align directly with UN Sustainable Developement Goals (SDGs) to create a self-sustaining Recovery Process.",
  list: [
    { text: "Carbon credit trading platforms enabled for dryland pastoralists", sdg: "SDG 1, 12" },
    { text: "Livestock productivity & family food security improved", sdg: "SDG 2, 3" },
    { text: "School attendance & cognitive performance improved by easing water fetching burden", sdg: "SDG 4" },
    { text: "Communities empowered — sustainability & equity", sdg: "SDG 5, 10" },
    { text: "Rainwater harvested & stored — reduced climate variability impacts", sdg: "SDG 6, 16" },
    { text: "Forest cover increased — carbon sequestration opened in ASALs", sdg: "SDG 13" },
    { text: "Carbon emissions reduced by 30%", sdg: "SDG 13" },
    { text: "Wildlife water restored — tourism and regional biodiversity supported", sdg: "SDG 15" },
    { text: "Government saves billions in reactive disaster relief budgets", sdg: "SDG 17" },
  ] as OutcomeData[],
};

export const COLLABORATORS_CONTENT = {
  eyebrow: "PARTNERSHIPS",
  title: "Potential Collaborators",
  subtitle: "We are actively seeking partnerships with:",
  list: [
    { name: "Government of Kenya (Treasury, Environment, ASALs, Agriculture, Livestock, Water)", logo: "kenya logo.png" },
    { name: "Council of Governors", logo: "council of governors.png" },
    { name: "IUCN", logo: "iunc logo.jpg" },
    { name: "Japanese Embassy", logo: "japan nairobi embassy logo.png" },
    { name: "UN-Habitat · UNDP · UNEP · FAO", logo: "un habitat logo.png" },
    { name: "Conservation International", logo: "conservation international.jpg" },
    { name: "OXFAM GB", logo: "oxfarm logo.jpg" },
    { name: "Peace Parks Foundation", logo: "Peace Parks Foundation logo.png" },
    { name: "African Forest Landscape Restoration Initiative", logo: "African Forest Landscape Restoration Initiative_logo.png" },
    { name: "World Resources International (WRI)", logo: "worldresourceinstitute.png" },
    { name: "Imara Integrated Farmers' Solutions" },
    { name: "Safaricom", logo: "safaricomlogo.jpg" },
    { name: "Green Belt Movement", logo: "greenbeltmovement.jpg" }
  ] as CollaboratorData[],
};

export const CONTACT_CONTENT = {
  eyebrow: "GET INVOLVED",
  title: "Partner With Us",
  body: "While the Communities in the affected Catchments have largely been displaced (due to the prevailing harsh"+
  " environment), have lost their livelihoods thus being rendered poor. TDG has the 'how' & expertise to assist "+
  "in the transformation of this deplorable state; it is actively seeking Collaborators, Founders to augment "+
  "developemnt activities in these vast Catchments.\n Our initial target is kshs. 105m(us$ 800,000) "+
  "for the pilot Catchments in in 7 Counties (Baringo, Makueni, Isiolo, Kajiado, Kilifi, Narok & Turkana).",
  prioritySites: "Of these, the priority Catchments are Lake Baringo, River Kwa Ngwesu (Makueni), & Enkare Narok Catchments @Kshs 15 Million Each (Kshs 45 Million in Total)",
  details: {
    teamLeader: "Bill A. Lijoh",
    telephones: ["+254 716 778863", "+254 737 388730"],
    email: "balijoh2012@gmail.com",
    address: "Tabere Crescent Apartments, Block 1026F, Kileleshwa, P.O. Box 216-00625, Kangemi, Nairobi"
  }
};
