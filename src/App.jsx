import { useState, useRef, useEffect, Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 40, fontFamily: "monospace", color: "red" }}>
        <h2>App crash:</h2>
        <pre>{this.state.error.message}</pre>
        <pre>{this.state.error.stack}</pre>
      </div>
    );
    return this.props.children;
  }
}// Uncontrolled input — React bemoeit zich niet met de waarde tijdens typen.
// Alleen bij mount wordt de beginwaarde gezet via ref. Opslaan gebeurt onBlur.
const EditableText = ({ value, onCommit, style }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && ref.current !== document.activeElement) {
      ref.current.value = value;
    }
  }, [value]);
  return (
    <input
      ref={ref}
      defaultValue={value}
      onBlur={e => onCommit(e.target.value)}
      style={style}
    />
  );
};

const translations = {
  nl: {
    appTitle: "HACCP Gevaren Analyse",
    appSubtitle: "Grondstoffen · Leveranciers · Verificatie",
    nav: { dashboard: "Dashboard", ingredients: "Grondstoffen", hazards: "Gevarenanalyse", reports: "Rapporten", admin: "Beheer" },
    dashboard: {
      title: "Dashboard",
      welcome: "Welkom in G3 Analysis",
      stats: ["Grondstoffen", "Leveranciers", "Gevaren geïdentificeerd", "Hoog risico items"],
      recentAlerts: "Recente RASFF Meldingen",
      quickActions: "Snelle Acties",
      actions: ["Importeer grondstoffen", "Start gevarenanalyse", "Genereer rapport", "Bekijk RASFF alerts"],
    },
    ingredients: {
      title: "Grondstoffen Beheer",
      import: "Importeer CSV/Excel",
      addManual: "Handmatig toevoegen",
      search: "Zoek grondstof...",
      cols: ["Artikel", "Artikelnr.", "Leverancier", "Groep", "Subgroep", "Acties"],
      groupSuggestion: "AI-groepsindeling voorstel",
      detailLevel: "Detailniveau analyse",
      levels: ["Ingrediënt", "Artikel", "Subgroep", "Hoofdgroep"],
    },
    hazards: {
      title: "Gevarenanalyse",
      selectProduct: "Selecteer product of groep",
      hazardTypes: ["Microbiologisch", "Chemisch", "Fysisch", "Allergeen"],
      probability: "Kans",
      severity: "Ernst",
      risk: "Risico",
      riskLevels: { 1: "Verwaarloosbaar", 2: "Laag", 3: "Gemiddeld", 4: "Hoog", 5: "Kritiek" },
      legislation: "Wetgeving",
      euOnly: "EU-wetgeving",
      euNl: "EU + Nederlandse wetgeving",
      addHazard: "Voeg gevaar toe",
    },
    reports: {
      title: "Rapporten & Uitdraai",
      exportExcel: "Exporteer Excel",
      exportPdf: "Exporteer PDF",
      groupBy: "Groepeer op",
      groupOptions: ["Grondstof", "Leverancier", "Productgroep", "Risiconiveau"],
      preview: "Rapport Voorbeeld",
    },
    admin: {
      title: "Beheer & Database",
      dbTitle: "Gevaren Database",
      rasffAlerts: "RASFF Meldingen",
      updateSuggestions: "Update Voorstellen",
      addHazardDb: "Voeg gevaar toe aan database",
      eurLexSync: "Synchroniseer EUR-Lex",
      rasffSync: "Synchroniseer RASFF",
    },
    common: { save: "Opslaan", cancel: "Annuleren", edit: "Bewerken", delete: "Verwijderen", view: "Bekijken", add: "Toevoegen", close: "Sluiten", confirm: "Bevestigen" },
  },
  en: {
    appTitle: "HACCP Hazard Analysis",
    appSubtitle: "Raw Materials · Suppliers · Verification",
    nav: { dashboard: "Dashboard", ingredients: "Ingredients", hazards: "Hazard Analysis", reports: "Reports", admin: "Admin" },
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome to the HACCP Analysis System",
      stats: ["Raw Materials", "Suppliers", "Hazards Identified", "High Risk Items"],
      recentAlerts: "Recent RASFF Notifications",
      quickActions: "Quick Actions",
      actions: ["Import ingredients", "Start hazard analysis", "Generate report", "View RASFF alerts"],
    },
    ingredients: {
      title: "Ingredient Management",
      import: "Import CSV/Excel",
      addManual: "Add manually",
      search: "Search ingredient...",
      cols: ["Article", "Article No.", "Supplier", "Group", "Subgroup", "Actions"],
      groupSuggestion: "AI Group Assignment Proposal",
      detailLevel: "Analysis detail level",
      levels: ["Ingredient", "Article", "Subgroup", "Main group"],
    },
    hazards: {
      title: "Hazard Analysis",
      selectProduct: "Select product or group",
      hazardTypes: ["Microbiological", "Chemical", "Physical", "Allergen"],
      probability: "Probability",
      severity: "Severity",
      risk: "Risk",
      riskLevels: { 1: "Negligible", 2: "Low", 3: "Medium", 4: "High", 5: "Critical" },
      legislation: "Legislation",
      euOnly: "EU legislation",
      euNl: "EU + Dutch legislation",
      addHazard: "Add hazard",
    },
    reports: {
      title: "Reports & Export",
      exportExcel: "Export Excel",
      exportPdf: "Export PDF",
      groupBy: "Group by",
      groupOptions: ["Ingredient", "Supplier", "Product group", "Risk level"],
      preview: "Report Preview",
    },
    admin: {
      title: "Administration & Database",
      dbTitle: "Hazard Database",
      rasffAlerts: "RASFF Notifications",
      updateSuggestions: "Update Proposals",
      addHazardDb: "Add hazard to database",
      eurLexSync: "Sync EUR-Lex",
      rasffSync: "Sync RASFF",
    },
    common: { save: "Save", cancel: "Cancel", edit: "Edit", delete: "Delete", view: "View", add: "Add", close: "Close", confirm: "Confirm" },
  },
};

const sampleIngredients = [
  { id: 1, article: "Sla (ijsbergsla)", articleNo: "GR-001", supplier: "FreshFarm BV", group: "Groenten", subgroup: "Bladgroenten", risk: 4 },
  { id: 2, article: "Spinazie vers", articleNo: "GR-002", supplier: "GreenLeaf NL", group: "Groenten", subgroup: "Bladgroenten", risk: 4 },
  { id: 3, article: "Kipfilet vers", articleNo: "VL-001", supplier: "PoultryPlus", group: "Vlees & vis", subgroup: "Gevogelte", risk: 5 },
  { id: 4, article: "Tarwebloem", articleNo: "GR-010", supplier: "MillPro BV", group: "Granen", subgroup: "Tarwe", risk: 2 },
  { id: 5, article: "Melk vol", articleNo: "ZU-001", supplier: "DairyDutch", group: "Zuivel", subgroup: "Melk", risk: 3 },
  { id: 6, article: "Eieren (vrije uitloop)", articleNo: "ZU-010", supplier: "EggFarm Oost", group: "Zuivel", subgroup: "Eieren", risk: 4 },
  { id: 7, article: "Olijfolie extra vierge", articleNo: "OL-001", supplier: "MedOil Import", group: "Vetten & oliën", subgroup: "Plantaardig", risk: 2 },
  { id: 8, article: "Suiker (biet)", articleNo: "SU-001", supplier: "Cosun BV", group: "Zoetstoffen", subgroup: "Suiker", risk: 1 },
];

const sampleHazards = [
  { id: 1, hazardType: "Microbiologisch", hazard: "Salmonella spp.",    probability: 3, severity: 4, legislation: "EC 2073/2005", productGroups: ["Bladgroenten", "Gevogelte", "Zuivel"] },
  { id: 2, hazardType: "Microbiologisch", hazard: "E. coli O157:H7",   probability: 2, severity: 4, legislation: "EC 2073/2005", productGroups: ["Bladgroenten", "Vlees & vis", "Gevogelte"] },
  { id: 3, hazardType: "Chemisch",        hazard: "Pesticideresiduen",  probability: 3, severity: 3, legislation: "EC 396/2005",  productGroups: ["Bladgroenten", "Groenten", "Granen", "Vetten & oliën"] },
  { id: 4, hazardType: "Allergeen",       hazard: "Gluten (tarwe)",     probability: 2, severity: 4, legislation: "EU 1169/2011", productGroups: ["Granen"] },
  { id: 5, hazardType: "Fysisch",         hazard: "Metaaldeeltjes",     probability: 1, severity: 4, legislation: "Warenwet NL",  productGroups: ["Granen", "Zuivel", "Zoetstoffen", "Vetten & oliën"] },
];

const rasffAlerts = [
  { id: 1, date: "2025-03-01", product: "Vers spinazie - Italië", hazard: "Salmonella", status: "Nieuw", severity: "Hoog" },
  { id: 2, date: "2025-02-28", product: "Kipfilet - Polen", hazard: "Campylobacter", status: "Beoordeeld", severity: "Hoog" },
  { id: 3, date: "2025-02-25", product: "Olijfolie - Griekenland", hazard: "Pesticiden (chlorpyrifos)", status: "Nieuw", severity: "Gemiddeld" },
  { id: 4, date: "2025-02-20", product: "Tarwebloem - NL", hazard: "Mycotoxinen (DON)", status: "Verwerkt", severity: "Laag" },
];

// Placeholder hazard detail database — will be replaced with real DB later
const hazardDetailDB = {
  "Salmonella spp.": {
    nl: {
      general: "Salmonella is een gramnegatieve, staafvormige bacterie die wereldwijd voorkomt in de darm van mens en dier. De bacterie overleeft goed in vochtige omgevingen en kan zich snel vermenigvuldigen bij temperaturen tussen 7°C en 48°C.",
      sources: "Belangrijkste bronnen zijn pluimvee, eieren, vlees, rauwe groenten (met name bladgroenten), en kruisbesmetting via oppervlakken en handen.",
      productContext: {
        "Bladgroenten": "Bladgroenten zoals sla en spinazie raken besmet via irrigatiewater, dierlijke mest of kruisbesmetting tijdens oogst en verwerking. RASFF-meldingen tonen een stijgende trend voor Salmonella in verse bladgroenten uit Zuid-Europa.",
        "Gevogelte": "Kippen zijn een primaire reservoir van Salmonella. Besmetting treedt op tijdens slachten en verwerking. Prevalentie in Nederlandse pluimveebedrijven wordt gemonitord via EC 2160/2003.",
        "default": "Kan aanwezig zijn via kruisbesmetting, besmet water of dierlijke mest in de keten."
      },
      consumerEffects: ["Gastro-enteritis (misselijkheid, braken, diarree)", "Koorts en buikkrampen (6–72 uur na inname)", "Ernstige complicaties bij ouderen, zwangeren, jonge kinderen en immuungecompromitteerde personen", "Reactieve artritis als langetermijngevolg (zeldzaam)", "Ziekenhuisopname vereist bij invasieve Salmonellosis"],
      incubation: "6 tot 72 uur",
      duration: "4 tot 7 dagen",
      riskGroups: ["Ouderen (>65 jaar)", "Jonge kinderen (<5 jaar)", "Zwangere vrouwen", "Immuungecompromitteerde personen"],
      legislation: ["EC 2073/2005 — Microbiologische criteria levensmiddelen", "EC 2160/2003 — Bestrijding Salmonella in pluimvee"],
    },
    en: {
      general: "Salmonella is a gram-negative, rod-shaped bacterium found worldwide in the intestines of humans and animals. It survives well in moist environments and multiplies rapidly at temperatures between 7°C and 48°C.",
      sources: "Main sources include poultry, eggs, meat, raw vegetables (especially leafy greens), and cross-contamination via surfaces and hands.",
      productContext: {
        "Bladgroenten": "Leafy vegetables such as lettuce and spinach become contaminated via irrigation water, animal manure or cross-contamination during harvest and processing.",
        "Gevogelte": "Chickens are a primary reservoir of Salmonella. Contamination occurs during slaughter and processing.",
        "default": "Can be present via cross-contamination, contaminated water or animal manure in the chain."
      },
      consumerEffects: ["Gastroenteritis (nausea, vomiting, diarrhoea)", "Fever and abdominal cramps (6–72 hours after ingestion)", "Severe complications in elderly, pregnant, young children and immunocompromised", "Reactive arthritis as long-term sequela (rare)", "Hospitalisation required in invasive Salmonellosis"],
      incubation: "6 to 72 hours",
      duration: "4 to 7 days",
      riskGroups: ["Elderly (>65 years)", "Young children (<5 years)", "Pregnant women", "Immunocompromised persons"],
      legislation: ["EC 2073/2005 — Microbiological criteria for foodstuffs", "EC 2160/2003 — Control of Salmonella in poultry"],
    }
  },
  "E. coli O157:H7": {
    nl: {
      general: "Enterohemorragische E. coli (EHEC) O157:H7 is een shigatoxine-producerende bacteriestam die zelfs bij lage infectiedoses ernstige ziekte kan veroorzaken. Infectieuze dosis: <100 organismen.",
      sources: "Herkauwers (met name runderen) zijn het belangrijkste reservoir. Overdracht via rauw/ondergaar vlees, onbehandeld water, rauwe groenten en zuivel.",
      productContext: {
        "Bladgroenten": "Besmetting via bewaterd met besmet oppervlaktewater of contact met rundveedrijfmest. Enkele grote uitbraken wereldwijd waren gelinkt aan verse spinazie.",
        "default": "Kan worden geïntroduceerd via besmet water of contact met fecaal materiaal."
      },
      consumerEffects: ["Bloederige diarree (hemorragische colitis)", "Hemolytisch-uremisch syndroom (HUS) — nierfalen, met name bij kinderen", "Trombotische trombocytopenische purpura (TTP)", "Permanente nierschade mogelijk", "Sterfte bij kwetsbare groepen"],
      incubation: "2 tot 10 dagen",
      duration: "5 tot 10 dagen (HUS kan weken duren)",
      riskGroups: ["Jonge kinderen (<5 jaar) — hoogste risico op HUS", "Ouderen", "Immuungecompromitteerde personen"],
      legislation: ["EC 2073/2005", "EFSA guidance on STEC"],
    },
    en: {
      general: "Enterohemorrhagic E. coli (EHEC) O157:H7 is a Shiga toxin-producing strain capable of causing serious illness even at low infectious doses (<100 organisms).",
      sources: "Ruminants (especially cattle) are the main reservoir. Transmission via raw/undercooked meat, untreated water, raw vegetables and dairy.",
      productContext: {
        "Bladgroenten": "Contamination via irrigation with polluted surface water or contact with cattle slurry. Several major outbreaks worldwide were linked to fresh spinach.",
        "default": "Can be introduced via contaminated water or contact with faecal material."
      },
      consumerEffects: ["Bloody diarrhoea (haemorrhagic colitis)", "Haemolytic uraemic syndrome (HUS) — kidney failure, especially in children", "Thrombotic thrombocytopaenic purpura (TTP)", "Permanent kidney damage possible", "Fatality in vulnerable groups"],
      incubation: "2 to 10 days",
      duration: "5 to 10 days (HUS can last weeks)",
      riskGroups: ["Young children (<5 years) — highest risk of HUS", "Elderly", "Immunocompromised persons"],
      legislation: ["EC 2073/2005", "EFSA guidance on STEC"],
    }
  },
  "Pesticideresiduen": {
    nl: {
      general: "Pesticideresiduen zijn chemische resten van gewasbeschermingsmiddelen die achterblijven op of in levensmiddelen na gebruik tijdens de teelt. EU-wetgeving stelt Maximale Residu Limieten (MRL's) vast.",
      sources: "Gebruik van insecticiden, fungiciden en herbiciden tijdens teelt. Residuen kunnen ook aanwezig zijn door omgevingsbesmetting of drachtplanten.",
      productContext: {
        "Bladgroenten": "Bladgroenten hebben door hun grote oppervlak relatief hoge blootstelling aan sproeimiddelen. Overschrijdingen worden regelmatig gemeld in RASFF voor producten uit niet-EU landen.",
        "default": "Aanwezig via gebruik van gewasbeschermingsmiddelen tijdens teelt of na de oogst."
      },
      consumerEffects: ["Acute vergiftiging bij hoge doses (hoofdpijn, misselijkheid, neurologische symptomen)", "Chronische effecten bij langdurige blootstelling (hormoonverstoring, carcinogeniteit bij specifieke stoffen)", "Chloorpyrifos: neurotoxisch, met name schadelijk voor ontwikkeling bij kinderen", "Glyfosaat: mogelijk carcinogeen (IARC Groep 2A)"],
      incubation: "Acuut: minuten tot uren; chronisch: jaren",
      duration: "Afhankelijk van stof en blootstelling",
      riskGroups: ["Kinderen", "Zwangere vrouwen", "Personen met hoge groenteconsumptie"],
      legislation: ["EC 396/2005 — MRL's voor pesticiden", "EC 1107/2009 — Toelating gewasbeschermingsmiddelen"],
    },
    en: {
      general: "Pesticide residues are chemical remnants of crop protection products remaining on or in food after use during cultivation. EU legislation sets Maximum Residue Levels (MRLs).",
      sources: "Use of insecticides, fungicides and herbicides during cultivation. Residues may also arise from environmental contamination.",
      productContext: {
        "Bladgroenten": "Leafy vegetables have relatively high exposure to spray agents due to their large surface area. Exceedances are regularly reported in RASFF for products from non-EU countries.",
        "default": "Present via use of crop protection products during cultivation or post-harvest."
      },
      consumerEffects: ["Acute poisoning at high doses (headache, nausea, neurological symptoms)", "Chronic effects from prolonged exposure (endocrine disruption, carcinogenicity for specific substances)", "Chlorpyrifos: neurotoxic, particularly harmful to child development", "Glyphosate: possibly carcinogenic (IARC Group 2A)"],
      incubation: "Acute: minutes to hours; chronic: years",
      duration: "Depends on substance and exposure level",
      riskGroups: ["Children", "Pregnant women", "Persons with high vegetable consumption"],
      legislation: ["EC 396/2005 — MRLs for pesticides", "EC 1107/2009 — Authorisation of plant protection products"],
    }
  },
  "Gluten (tarwe)": {
    nl: {
      general: "Gluten is een eiwitcomplex (gliadine + glutenine) dat van nature voorkomt in tarwe, rogge, gerst en spelt. Voor personen met coeliakie of tarweallergie vormt inname een serieus gezondheidsrisico.",
      sources: "Tarwebloem en -producten, maar ook kruisbesmetting via gedeelde productieapparatuur of opslagruimten.",
      productContext: {
        "Granen": "Tarwe is de primaire bron van gluten. Besmetting van andere graansoorten (bijv. haver) via gezamenlijke oogst of verwerking is een bekend risico.",
        "default": "Kruisbesmetting via productieapparatuur, transport of opslag nabij tarweproducten."
      },
      consumerEffects: ["Coeliakie: auto-immuunreactie met beschadiging dunne darm, malabsorptie", "Tarweallergie: urticaria, angio-oedeem, anafylaxie (zeldzaam maar ernstig)", "Niet-coeliakie glutensensitiviteit: gastro-intestinale klachten, vermoeidheid", "Bij coeliakie: osteoporose, vruchtbaarheidsproblemen, verhoogd risico op darmlymfoom bij langdurige blootstelling"],
      incubation: "Coeliakie: chronisch; allergie: minuten tot 2 uur",
      duration: "Coeliakie: levenslang bij voortgezette blootstelling",
      riskGroups: ["Personen met coeliakie (~1% populatie)", "Personen met tarweallergie", "Personen met glutensensitiviteit"],
      legislation: ["EU 1169/2011 — Verstrekking voedselinformatie (verplichte allergenenvermelding)", "Codex Alimentarius — Gluten-free standaard"],
    },
    en: {
      general: "Gluten is a protein complex (gliadin + glutenin) naturally present in wheat, rye, barley and spelt. Ingestion poses a serious health risk for persons with coeliac disease or wheat allergy.",
      sources: "Wheat flour and products, but also cross-contamination via shared production equipment or storage areas.",
      productContext: {
        "Granen": "Wheat is the primary source of gluten. Contamination of other grains (e.g. oats) via combined harvesting or processing is a known risk.",
        "default": "Cross-contamination via production equipment, transport or storage near wheat products."
      },
      consumerEffects: ["Coeliac disease: autoimmune reaction with small intestine damage, malabsorption", "Wheat allergy: urticaria, angioedema, anaphylaxis (rare but serious)", "Non-coeliac gluten sensitivity: gastrointestinal complaints, fatigue", "In coeliac disease: osteoporosis, fertility problems, increased risk of intestinal lymphoma"],
      incubation: "Coeliac disease: chronic; allergy: minutes to 2 hours",
      duration: "Coeliac disease: lifelong with continued exposure",
      riskGroups: ["Persons with coeliac disease (~1% population)", "Persons with wheat allergy", "Persons with gluten sensitivity"],
      legislation: ["EU 1169/2011 — Food information to consumers (mandatory allergen labelling)", "Codex Alimentarius — Gluten-free standard"],
    }
  },
  "Metaaldeeltjes": {
    nl: {
      general: "Fysische verontreiniging door metaalfragmenten afkomstig van productieapparatuur, gereedschappen, of verpakkingsmateriaal. Omvat ijzer, roestvast staal, aluminium en andere metalen.",
      sources: "Slijtage van messen, zeven, transportbanden en maalinstallaties. Lassen en onderhoudswerkzaamheden zonder adequate reiniging.",
      productContext: {
        "default": "Kan in elk product terechtkomen via productielijnen. Risico is hoger bij intensief mechanisch bewerkte grondstoffen."
      },
      consumerEffects: ["Tandbreuk of beschadiging gebitsprothesen", "Verwonding mond, keel, slokdarm of maag-darmkanaal", "Interne bloeding bij scherpe fragmenten", "Obstructie maag-darmkanaal (groot formaat)"],
      incubation: "Onmiddellijk na inname",
      duration: "Afhankelijk van ernst verwonding",
      riskGroups: ["Kinderen (verslikking)", "Ouderen met gebitsprothesen", "Personen met maag-darmklachten"],
      legislation: ["Warenwet (Nederland)", "EC 178/2002 — Algemene levensmiddelenwetgeving (veiligheidsplicht)"],
    },
    en: {
      general: "Physical contamination by metal fragments originating from production equipment, tools or packaging materials. Includes iron, stainless steel, aluminium and other metals.",
      sources: "Wear from knives, sieves, conveyor belts and grinding installations. Welding and maintenance work without adequate cleaning.",
      productContext: {
        "default": "Can enter any product via production lines. Risk is higher for intensively mechanically processed raw materials."
      },
      consumerEffects: ["Tooth fracture or damage to dental prostheses", "Injury to mouth, throat, oesophagus or gastrointestinal tract", "Internal bleeding from sharp fragments", "Gastrointestinal obstruction (large size)"],
      incubation: "Immediately after ingestion",
      duration: "Depends on severity of injury",
      riskGroups: ["Children (choking risk)", "Elderly with dental prostheses", "Persons with gastrointestinal conditions"],
      legislation: ["Warenwet (Netherlands)", "EC 178/2002 — General food law (safety obligation)"],
    }
  }
};

const getRiskColor = (risk) => {
  if (risk >= 10) return "#dc2626"; // Hoog - rood
  if (risk >= 5)  return "#ea580c"; // Midden - oranje
  return "#16a34a";                 // Laag - groen
};

const getRiskLabel = (score, lang) => {
  if (score >= 10) return lang === "nl" ? "Hoog" : "High";
  if (score >= 5)  return lang === "nl" ? "Midden" : "Medium";
  return lang === "nl" ? "Laag" : "Low";
};

// Helper: get risk colors based on score and matrix type
const getRiskColorsForMatrix = (score, type) => {
  // 4x5 matrix: 3 categories Laag 0-4, Midden 5-9, Hoog 10-16
  if (score >= 10) return { bg: "#fee2e2", fg: "#dc2626", label: "Hoog" };
  if (score >= 5)  return { bg: "#ffedd5", fg: "#ea580c", label: "Midden" };
  return { bg: "#dcfce7", fg: "#16a34a", label: "Laag" };
};

const RiskMatrix = ({ probability, severity, onChangeProbability, onChangeSeverity, t, matrixType = "4x5" }) => {
  const maxP = 4;
  const maxS = 4;
  const minS = 0;
  const risk = probability * severity;

  const cells = [];
  for (let s = maxS; s >= minS; s--) {
    for (let p = 1; p <= maxP; p++) {
      const r = p * s;
      const isActive = p === probability && s === severity;
      const { bg, fg } = getRiskColorsForMatrix(r, matrixType);
      cells.push(
        <div key={`${p}-${s}`} onClick={() => { onChangeProbability(p); onChangeSeverity(s); }}
          style={{
            width: 36, height: 36, cursor: "pointer", borderRadius: 4,
            background: bg,
            border: isActive ? "3px solid #000000" : "1px solid #dde0e8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: isActive ? 800 : 400,
            color: fg,
            transition: "all 0.15s",
          }}>
          {r}
        </div>
      );
    }
  }

  const { bg: riskBg, fg: riskFg, label: riskLabel } = getRiskColorsForMatrix(risk, "4x5");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center" }}>
        <div style={{ fontSize: 11, color: "#4a5568", width: 60 }}>{t.hazards.severity} ↕</div>
        <div style={{ fontSize: 11, color: "#4a5568" }}>{t.hazards.probability} →</div>
      </div>
      {/* Row labels (severity) + cells */}
      {Array.from({ length: maxS - minS + 1 }, (_, i) => maxS - i).map(s => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }}>
          <div style={{ width: 56, fontSize: 10, color: "#4a5568", textAlign: "right", paddingRight: 4 }}>E={s}</div>
          {Array.from({ length: maxP }, (_, i) => i + 1).map(p => {
            const r = p * s;
            const isActive = p === probability && s === severity;
            const { bg, fg } = getRiskColorsForMatrix(r, matrixType);
            return (
              <div key={p} onClick={() => { onChangeProbability(p); onChangeSeverity(s); }}
                style={{ width: 36, height: 36, cursor: "pointer", borderRadius: 4, background: bg,
                  border: isActive ? "3px solid #000000" : "1px solid #dde0e8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: isActive ? 800 : 400, color: fg, transition: "all 0.15s" }}>
                {r}
              </div>
            );
          })}
        </div>
      ))}
      {/* Column labels (probability) */}
      <div style={{ display: "flex", gap: 3, marginTop: 2, paddingLeft: 60 }}>
        {Array.from({ length: maxP }, (_, i) => i + 1).map(p => (
          <div key={p} style={{ width: 36, textAlign: "center", fontSize: 10, color: "#4a5568" }}>K={p}</div>
        ))}
      </div>
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700,
          background: riskBg, color: riskFg, border: `2px solid ${riskFg}` }}>
          {t.hazards.risk}: {risk} — {riskLabel}
        </div>
        <div style={{ fontSize: 11, color: "#8a94a6" }}>
          {"Matrix 4×5 (K×E, 3 niveaus)"}
        </div>
      </div>
    </div>
  );
};

const HazardDetailModal = ({ hazard, selectedIngredient, lang, legislation, getRiskBadge, getRiskColor, styles, t, onClose }) => {
  const [activeTab, setActiveTab] = useState("general");
  const db = hazardDetailDB[hazard.hazard];
  const info = db ? db[lang] : null;
  const subgroup = selectedIngredient?.subgroup || selectedIngredient?.group || null;
  const productCtx = info?.productContext?.[subgroup] || info?.productContext?.[selectedIngredient?.group] || info?.productContext?.default || null;

  const tabs = [
    { key: "general", label: lang === "nl" ? "Algemeen" : "General", icon: "▣" },
    { key: "product", label: lang === "nl" ? "Product context" : "Product context", icon: "◇" },
    { key: "consumer", label: lang === "nl" ? "Gevolgen consument" : "Consumer effects", icon: "◎" },
    { key: "legislation", label: lang === "nl" ? "Wetgeving" : "Legislation", icon: "▷" },
  ];

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={{ ...styles.modalBox, minWidth: 620, maxWidth: 740 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 12, background: "#eff0f5", padding: "2px 8px", borderRadius: 4, color: "#4a5568" }}>{hazard.hazardType}</span>
              {getRiskBadge(hazard.probability * hazard.severity)}
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "#8a94a6" }}>{hazard.legislation}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#003855" }}>{hazard.hazard}</div>
            {selectedIngredient && (
              <div style={{ fontSize: 12, color: "#4a5568", marginTop: 4 }}>
                {lang === "nl" ? "Gelinkt aan:" : "Linked to:"} <strong>{selectedIngredient.article}</strong> · {selectedIngredient.supplier}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#8a94a6", lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: lang === "nl" ? "Kans" : "Probability", value: hazard.probability },
            { label: lang === "nl" ? "Ernst" : "Severity", value: hazard.severity },
            { label: lang === "nl" ? "Risico" : "Risk", value: hazard.probability * hazard.severity }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "10px 0", background: "#eff0f5", borderRadius: 8, border: `1px solid ${i === 2 ? getRiskColor(item.value) + "55" : "#dde0e8"}` }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: i === 2 ? getRiskColor(item.value) : "#003855" }}>{item.value}</div>
              <div style={{ fontSize: 11, color: "#8a94a6" }}>{item.label}</div>
            </div>
          ))}
        </div>

        {!info ? (
          <div style={{ padding: 20, background: "#fef9c3", borderRadius: 8, border: "1px solid #fde68a", fontSize: 13, color: "#fa6401" }}>
            {lang === "nl" ? "Gedetailleerde informatie voor dit gevaar is nog niet beschikbaar in de database. U kunt uw eigen database hier later aan koppelen." : "Detailed information for this hazard is not yet available in the database. You can link your own database here later."}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", gap: 2, marginBottom: 16, borderBottom: "2px solid #e2e8f0" }}>
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  style={{ padding: "8px 14px", border: "none", cursor: "pointer", fontSize: 12, background: "none",
                    color: activeTab === tab.key ? "#003855" : "#4a5568", fontWeight: activeTab === tab.key ? 700 : 500,
                    borderBottom: activeTab === tab.key ? "3px solid #003855" : "3px solid transparent",
                    marginBottom: -2 }}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "general" && (
              <div>
                <p style={{ fontSize: 13, color: "#000000", lineHeight: 1.7, marginBottom: 14 }}>{info.general}</p>
                <div style={{ background: "#eff0f5", borderRadius: 8, padding: 14, border: "1px solid #e2e8f0", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#4a5568", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{lang === "nl" ? "Belangrijkste bronnen" : "Main sources"}</div>
                  <p style={{ fontSize: 13, color: "#000000", lineHeight: 1.6, margin: 0 }}>{info.sources}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: "#fff8f3", borderRadius: 8, padding: 12, border: "1px solid #fed7aa" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#003855", marginBottom: 4 }}>⏱ {lang === "nl" ? "Incubatietijd" : "Incubation period"}</div>
                    <div style={{ fontSize: 13, color: "#000000" }}>{info.incubation}</div>
                  </div>
                  <div style={{ background: "#fff8f3", borderRadius: 8, padding: 12, border: "1px solid #fed7aa" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#003855", marginBottom: 4 }}>{lang === "nl" ? "Duur ziekte" : "Duration of illness"}</div>
                    <div style={{ fontSize: 13, color: "#000000" }}>{info.duration}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "product" && (
              <div>
                {productCtx ? (
                  <div>
                    {selectedIngredient && (
                      <div style={{ background: "#fff8f3", borderRadius: 8, padding: 12, border: "1px solid #bfdbfe", marginBottom: 12, fontSize: 12, color: "#003855" }}>
                        <strong>{lang === "nl" ? "Specifiek voor:" : "Specific to:"}</strong> {selectedIngredient.article} ({selectedIngredient.subgroup || selectedIngredient.group})
                      </div>
                    )}
                    <p style={{ fontSize: 13, color: "#000000", lineHeight: 1.7 }}>{productCtx}</p>
                  </div>
                ) : (
                  <div style={{ color: "#4a5568", fontSize: 13, padding: 12 }}>{lang === "nl" ? "Geen productspecifieke informatie beschikbaar." : "No product-specific information available."}</div>
                )}
                <div style={{ marginTop: 16, background: "#fef9c3", borderRadius: 8, padding: 12, border: "1px solid #fde68a" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fa6401", marginBottom: 8 }}>{lang === "nl" ? "Risicogroepen" : "Risk groups"}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {info.riskGroups.map((g, i) => (
                      <span key={i} style={{ fontSize: 12, background: "#fff", padding: "3px 10px", borderRadius: 20, border: "1px solid #fde68a", color: "#fa6401" }}>{g}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "consumer" && (
              <div>
                <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 12 }}>{lang === "nl" ? "Mogelijke gezondheidseffecten bij blootstelling:" : "Possible health effects upon exposure:"}</div>
                {info.consumerEffects.map((effect, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", marginBottom: 6, background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, color: "#000000", alignItems: "flex-start" }}>
                    <span style={{ color: "#dc2626", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>▲</span>
                    <span style={{ lineHeight: 1.5 }}>{effect}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, background: "#fee2e2", borderRadius: 8, padding: 12, border: "1px solid #fecaca" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#991b1b", marginBottom: 8 }}>{lang === "nl" ? "Kwetsbare groepen" : "Vulnerable groups"}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {info.riskGroups.map((g, i) => (
                      <span key={i} style={{ fontSize: 12, background: "#fff", padding: "3px 10px", borderRadius: 20, border: "1px solid #fecaca", color: "#991b1b" }}>{g}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "legislation" && (
              <div>
                {info.legislation.map((leg, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", marginBottom: 8, background: "#eff0f5", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, alignItems: "center" }}>
                    <span style={{ color: "#fa6401", fontWeight: 700, flexShrink: 0 }}>◷</span>
                    <span style={{ color: "#000000" }}>{leg}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, padding: 12, background: "#fff8f3", borderRadius: 8, border: "1px solid #bbf7d0", fontSize: 12, color: "#003855" }}>
                  ℹ {lang === "nl" ? `Wetgevingsbasis: ${legislation === "eu" ? "EU-wetgeving" : "EU + Nederlandse wetgeving"}` : `Legislative basis: ${legislation === "eu" ? "EU legislation" : "EU + Dutch legislation"}`}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "#8a94a6", flex: 1 }}>
            {lang === "nl" ? "ⓘ Informatie afkomstig uit gevarendatabase" : "ⓘ Information sourced from hazard database"}
          </div>
          <button style={styles.btn("secondary")} onClick={onClose}>{t.common.close}</button>
        </div>
      </div>
    </div>
  );
};

// HazardScoreCard: one card per ingredient × hazard combination
const HazardScoreCard = ({ ing, hazard, verifFactors, computeVerifScore, computeVerifSuggestion, defaultFactorValues, setVerifPlanning, showNotif, styles, matrixType = "4x5" }) => {
  const riskScore = hazard.probability * hazard.severity;
  const { bg: riskBg, fg: riskFg } = getRiskColorsForMatrix(riskScore, "4x5");

  const [factorValues, setFactorValues] = useState(() => defaultFactorValues(riskScore));
  const [collapsed, setCollapsed] = useState(true);

  const score = computeVerifScore(factorValues);
  const { measure, freq } = computeVerifSuggestion(score);

  const scoreBg = score >= 75 ? "#fee2e2" : score >= 50 ? "#ffedd5" : score >= 25 ? "#fef9c3" : "#dcfce7";
  const scoreFg = score >= 75 ? "#dc2626" : score >= 50 ? "#ea580c" : score >= 25 ? "#ca8a04" : "#16a34a";
  const hazardTypeIcon = { "Microbiologisch": "◉", "Chemisch": "◎", "Fysisch": "◈", "Allergeen": "◇" };
  const activeFactors = verifFactors.filter(f => f.active);

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, marginBottom: 8, overflow: "hidden" }}>
      {/* Header row */}
      <div onClick={() => setCollapsed(c => !c)}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", cursor: "pointer",
          background: collapsed ? "#eff0f5" : "#fff", borderBottom: collapsed ? "none" : "1px solid #e2e8f0" }}>
        <span style={{ fontSize: 16 }}>{"◬"}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>{hazard.hazard}</div>
          <div style={{ fontSize: 11, color: "#8a94a6" }}>{hazard.hazardType} · {hazard.legislation}
            {hazard.aiGenerated && <span style={{ marginLeft: 6, fontSize: 10, padding: "1px 6px", background: "#003855", color: "#fff", borderRadius: 20, fontWeight: 700 }}>✦ AI</span>}
          </div>
        </div>
        {/* Risk from hazard analysis */}
        <div style={{ textAlign: "center", padding: "3px 10px", borderRadius: 8, background: riskBg, border: `1px solid ${riskFg}33` }}>
          <div style={{ fontSize: 10, color: riskFg }}>Risicoscore</div>
          <div style={{ fontWeight: 800, fontSize: 14, color: riskFg }}>{hazard.probability} × {hazard.severity} = {riskScore}</div>
        </div>
        {/* Verification score gauge */}
        <div style={{ textAlign: "center", padding: "3px 10px", borderRadius: 8, background: scoreBg, border: `1px solid ${scoreFg}33`, minWidth: 80 }}>
          <div style={{ fontSize: 10, color: scoreFg }}>Verificatiescore</div>
          <div style={{ fontWeight: 800, fontSize: 14, color: scoreFg }}>{score}/100</div>
        </div>
        {/* Suggested measure preview */}
        {measure && (
          <span style={{ fontSize: 11, padding: "2px 8px", background: "#fff8f3", color: "#fa6401", borderRadius: 20, border: "1px solid #bfdbfe", whiteSpace: "nowrap" }}>
            {measure.icon} {measure.label}
          </span>
        )}
        <span style={{ color: "#8a94a6", fontSize: 14 }}>{collapsed ? "▶" : "▼"}</span>
      </div>

      {/* Expanded factor inputs */}
      {!collapsed && (
        <div style={{ padding: 16, background: "#fff" }}>
          {/* Score bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4a5568", marginBottom: 4 }}>
              <span>Licht (geen/minimale verificatie)</span>
              <span style={{ fontWeight: 700, color: scoreFg }}>Score: {score}/100</span>
              <span>Zwaar (intensieve verificatie)</span>
            </div>
            <div style={{ height: 10, background: "#eff0f5", borderRadius: 20, overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${score}%`, borderRadius: 20,
                background: score >= 75 ? "#dc2626" : score >= 50 ? "#ea580c" : score >= 25 ? "#ca8a04" : "#16a34a",
                transition: "width 0.3s ease" }} />
            </div>
          </div>

          {/* Factor inputs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
            {activeFactors.map(f => (
              <div key={f.id} style={{ padding: 10, background: "#eff0f5", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 11, marginBottom: 2, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#000000" }}>{f.label}</span>
                  <span style={{ padding: "0 6px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                    background: f.direction === "verlichtend" ? "#dcfce7" : "#fef2f2",
                    color: f.direction === "verlichtend" ? "#16a34a" : "#dc2626" }}>
                    {f.direction} ×{f.weight}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  {f.options.map(opt => {
                    const selected = factorValues[f.id] === opt.value;
                    const optColor = opt.value === -1 ? "#fa6401" : opt.value === 1 ? "#dc2626" : "#4a5568";
                    const optBg    = opt.value === -1 ? "#fff8f3"  : opt.value === 1 ? "#fee2e2"  : "#eff0f5";
                    return (
                      <button key={opt.label} onClick={() => setFactorValues(prev => ({ ...prev, [f.id]: opt.value }))}
                        style={{ flex: 1, padding: "5px 4px", borderRadius: 5, cursor: "pointer", fontSize: 11, fontWeight: selected ? 700 : 400,
                          border: `1.5px solid ${selected ? optColor : "#dde0e8"}`,
                          background: selected ? optBg : "#fff", color: selected ? optColor : "#4a5568" }}>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestion */}
          {measure && freq && (
            <div style={{ padding: 12, borderRadius: 8, border: "1.5px solid #bbf7d0", background: "#fff8f3", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#4a5568", marginBottom: 4 }}>Verificatievoorstel op basis van score {score}/100</div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#003855" }}>{measure.icon} {measure.label}</span>
                  <span style={{ fontSize: 12, padding: "2px 10px", background: "#fff8f3", color: "#003855", borderRadius: 20, fontWeight: 600 }}>⏱ {freq.label}</span>
                </div>
              </div>
              <button style={{ ...styles.btn(), fontSize: 12, padding: "6px 14px", flexShrink: 0 }}
                onClick={() => {
                  setVerifPlanning(prev => [...prev, {
                    id: Date.now(), ingredient: ing.article, supplier: ing.supplier,
                    hazard: hazard.hazard, measure: measure.label, frequency: freq.label,
                    score, nextDate: "", status: "gepland", lastDone: null, notes: ""
                  }]);
                  showNotif(`${ing.article} × ${hazard.hazard} toegevoegd aan planning`);
                }}>
                + Planning
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function App() {
  const [lang, setLang] = useState("nl");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [legislation, setLegislation] = useState("eu");
  const [analysisLevel, setAnalysisLevel] = useState("groep");
  const [ingredients, setIngredients] = useState(sampleIngredients);
  const [hazards, setHazards] = useState(sampleHazards);
  const [dbLoaded, setDbLoaded] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupBy, setGroupBy] = useState(0);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showHazardModal, setShowHazardModal] = useState(false);
  const [editHazard, setEditHazard] = useState(null);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [editIngredient, setEditIngredient] = useState(null);
  const [ingredientModalTab, setIngredientModalTab] = useState("basis");
  const [showGroupSuggestion, setShowGroupSuggestion] = useState(false);
  const [showHazardDetail, setShowHazardDetail] = useState(false);
  const [selectedHazardDetail, setSelectedHazardDetail] = useState(null);
  const [notification, setNotification] = useState(null);

  // Update tracking state
  const [updateMode, setUpdateMode] = useState("manual"); // "manual" | "auto"
  const [autoFrequency, setAutoFrequency] = useState("weekly"); // "daily" | "weekly" | "monthly"
  const [showUpdateInbox, setShowUpdateInbox] = useState(false);
  const [showLoginBanner, setShowLoginBanner] = useState(true);

  // Pending changes — simulated incoming updates from admin database
  const [pendingChanges, setPendingChanges] = useState([
    {
      id: 1, hazardName: "Salmonella spp.", hazardType: "Microbiologisch",
      changeType: "probability", field: "Kans",
      oldValue: 2, newValue: 3,
      reason: "5 nieuwe RASFF-meldingen voor verse bladgroenten (spinazie, Italië) in feb–mrt 2025",
      source: "RASFF", date: "2025-03-08", urgent: true, status: "pending",
    },
    {
      id: 2, hazardName: "Salmonella spp.", hazardType: "Microbiologisch",
      changeType: "legislation", field: "Wetgeving",
      oldValue: "EC 2073/2005", newValue: "EC 2073/2005 (amendement feb 2025)",
      reason: "Drempelwaarden voor Salmonella in verse kruiden aangescherpt via amendement",
      source: "EUR-Lex", date: "2025-03-01", urgent: false, status: "pending",
    },
    {
      id: 3, hazardName: "Sesam", hazardType: "Allergeen",
      changeType: "new_hazard", field: "Nieuw gevaar",
      oldValue: null, newValue: "Sesam (EU 2023/1426)",
      reason: "Sesam toegevoegd als verplicht te vermelden allergeen per EU 2023/1426, van kracht per jan 2025",
      source: "EUR-Lex", date: "2025-02-20", urgent: false, status: "pending",
    },
    {
      id: 4, hazardName: "Mycotoxinen (DON)", hazardType: "Chemisch",
      changeType: "severity", field: "Ernst",
      oldValue: 3, newValue: 4,
      reason: "EFSA herziening 2024: DON-normen in granen aangescherpt, gezondheidseffecten zwaarder gewogen",
      source: "EFSA", date: "2025-02-15", urgent: false, status: "pending",
    },
    {
      id: 5, hazardName: "E. coli O157:H7", hazardType: "Microbiologisch",
      changeType: "probability", field: "Kans",
      oldValue: 3, newValue: 2,
      reason: "Verbeterde hygiënemaatregelen in NL slachterijen — prevalentie gedaald per NVWA jaarrapport 2024",
      source: "NVWA", date: "2025-01-30", urgent: false, status: "pending",
    },
  ]);

  // Accepted changes history (audit trail)
  const [changeHistory, setChangeHistory] = useState([
    {
      id: 101, hazardName: "Listeria monocytogenes", changeType: "probability",
      field: "Kans", oldValue: 1, newValue: 2,
      reason: "Meerdere uitbraken gekoppeld aan kant-en-klare maaltijden in NL/BE",
      source: "RASFF", date: "2024-11-15", acceptedDate: "2024-11-18", acceptedBy: "Admin",
    },
    {
      id: 102, hazardName: "Gluten (tarwe)", changeType: "legislation",
      field: "Wetgeving", oldValue: "EU 1169/2011", newValue: "EU 1169/2011 + EU 2023/1425",
      reason: "Nieuwe uitvoeringsverordening allergenenvermelding gepubliceerd",
      source: "EUR-Lex", date: "2024-10-01", acceptedDate: "2024-10-05", acceptedBy: "Admin",
    },
  ]);

  const pendingCount = pendingChanges.filter(c => c.status === "pending").length;

  const statValues = [
    ingredients.length,
    [...new Set(ingredients.map(i => i.supplier))].length,
    hazards.length,
    hazards.filter(h => h.probability * h.severity >= 8).length,
  ];
  const fileInputRef = useRef(null);
  const t = translations[lang];

  // Load export libraries
  useEffect(() => {
    if (!window.XLSX) {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      document.head.appendChild(s);
    }
    if (!window.jspdf) {
      const s1 = document.createElement("script");
      s1.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      s1.onload = () => {
        const s2 = document.createElement("script");
        s2.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js";
        document.head.appendChild(s2);
      };
      document.head.appendChild(s1);
    }
  });



  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ── AI Gevarenanalyse (Insight modus) ──────────────────────────────────────
  const [aiAnalysing, setAiAnalysing] = useState(false);
  const [aiError, setAiError] = useState(null);

  const analyzeWithAI = async (ingredient) => {
    if (!ingredient) return;
    setAiAnalysing(true);
    setAiError(null);
    try {
      const prompt = `Je bent een HACCP-expert. Analyseer de volgende grondstof en geef een gedetailleerde risicoanalyse.

Grondstof: ${ingredient.article}
Leverancier: ${ingredient.supplier || "onbekend"}
Productgroep: ${ingredient.group || "onbekend"}
Subgroep: ${ingredient.subgroup || "onbekend"}

Geef een analyse van de relevante gevaren voor deze grondstof op basis van:
- RASFF-meldingen en Europese voedselveiligheidsincidenten
- EU-wetgeving (EC 2073/2005, EC 396/2005, EU 1169/2011 e.a.)
- EFSA-risicobeoordelingen
- Bekende frauderisico's (VACCP)

Geef je antwoord ALLEEN als JSON in dit exacte formaat, zonder uitleg:
{
  "hazards": [
    {
      "hazard": "naam van het gevaar",
      "hazardType": "Microbiologisch|Chemisch|Fysisch|Allergeen",
      "probability": 1-4,
      "severity": 1-4,
      "legislation": "relevante EU-verordening",
      "controlMeasure": "beheersmaatreegel",
      "rationale": "korte onderbouwing"
    }
  ],
  "fraudRisks": [
    {
      "fraudType": "type fraude",
      "vulnerability": 1-5,
      "detectability": 1-5,
      "rationale": "onderbouwing"
    }
  ],
  "summary": "korte samenvatting van het risicoprofiel"
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();

      // Haal de JSON uit de response
      const textBlock = data.content?.find(b => b.type === "text");
      if (!textBlock) throw new Error("Geen response van AI");

      let analysis;
      try {
        const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
        analysis = JSON.parse(jsonMatch?.[0] || textBlock.text);
      } catch(e) {
        throw new Error("AI response kon niet worden verwerkt");
      }

      // Voeg gevaren toe aan de state
      if (analysis.hazards?.length > 0) {
        const newHazards = analysis.hazards.map((h, i) => ({
          id: Date.now() + i,
          hazard: h.hazard,
          hazardType: h.hazardType || "Microbiologisch",
          productGroups: [ingredient.group, ingredient.subgroup].filter(Boolean),
          probability: Math.min(4, Math.max(1, h.probability || 2)),
          severity: Math.min(4, Math.max(0, h.severity || 2)),
          legislation: h.legislation || "EU wetgeving",
          controlMeasure: h.controlMeasure || "",
          rationale: h.rationale || "",
          aiGenerated: true,
          aiDate: new Date().toISOString().slice(0, 10),
          ingredient: ingredient.article
        }));

        setHazards(prev => {
          // Verwijder bestaande AI-gevaren voor deze grondstof
          const filtered = prev.filter(h => !(h.aiGenerated && h.ingredient === ingredient.article));
          return [...filtered, ...newHazards];
        });

        showNotif(`${newHazards.length} gevaren geïdentificeerd voor ${ingredient.article}`);
      }

      // Voeg frauderisico's toe
      if (analysis.fraudRisks?.length > 0) {
        const newFraud = analysis.fraudRisks.map((f, i) => ({
          id: Date.now() + 1000 + i,
          article: ingredient.article,
          supplier: ingredient.supplier || "",
          fraudType: f.fraudType,
          vulnerability: Math.min(5, Math.max(1, f.vulnerability || 3)),
          detectability: Math.min(5, Math.max(1, f.detectability || 3)),
          aiGenerated: true
        }));
        setFraudItems(prev => {
          const filtered = prev.filter(f => !(f.aiGenerated && f.article === ingredient.article));
          return [...filtered, ...newFraud];
        });
      }

    } catch(e) {
      console.error("AI analyse fout:", e);
      setAiError(e.message);
      showNotif("AI analyse mislukt: " + e.message, "error");
    } finally {
      setAiAnalysing(false);
    }
  };

  // ── Supabase: sync één verif taak ──────────────────────────────────────────
  const syncVerif = async (task, deleted = false) => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const _u = import.meta.env.VITE_SUPABASE_URL;
      const _k = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!_u || !_k) return;
      const _sb = createClient(_u, _k);
      if (deleted) {
        if (task.id && task.id < 1e12) await _sb.from("verif_planning").delete().eq("id", task.id);
        return;
      }
      const row = { ingredient: task.ingredient, supplier: task.supplier, hazard: task.hazard, measure: task.measure, frequency: task.frequency, next_date: task.nextDate || null, status: task.status, last_done: task.lastDone || null, notes: task.notes, score: task.score };
      if (task.id && task.id < 1e12) {
        await _sb.from("verif_planning").update(row).eq("id", task.id);
      } else {
        const { data } = await _sb.from("verif_planning").insert(row).select("id").single();
        if (data) setVerifPlanning(prev => prev.map(x => x.id === task.id ? { ...x, id: data.id } : x));
      }
    } catch(e) { console.error("VerifSync fout:", e); }
  };







  useEffect(() => {
    (async () => {
      let sb = null;
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        sb = (url && key) ? createClient(url, key) : null;
      } catch(e) { console.error("Supabase init fout:", e); }
      if (!sb) { setDbLoaded(true); return; }
      try {
        const [iR, hR, fR, vR] = await Promise.all([
          sb.from("ingredients").select("*").order("id"),
          sb.from("hazards").select("*").order("id"),
          sb.from("fraud_items").select("*").order("id"),
          sb.from("verif_planning").select("*").order("id"),
        ]);
        if (!iR.error && iR.data?.length > 0)
          setIngredients(iR.data.map(r => ({ id: r.id, article: r.article, articleNo: r.article_no, supplier: r.supplier, group: r.group, subgroup: r.subgroup, risk: r.risk, composite: r.composite, subIngredients: r.sub_ingredients || [] })));
        if (!hR.error && hR.data?.length > 0)
          setHazards(hR.data.map(r => ({ id: r.id, hazard: r.hazard, hazardType: r.hazard_type, productGroups: r.product_groups || [], probability: r.probability, severity: r.severity, legislation: r.legislation, controlMeasure: r.control_measure })));
        if (!fR.error && fR.data?.length > 0)
          setFraudItems(fR.data.map(r => ({ id: r.id, article: r.article, supplier: r.supplier, fraudType: r.fraud_type, vulnerability: r.vulnerability, detectability: r.detectability })));
        if (!vR.error && vR.data?.length > 0)
          setVerifPlanning(vR.data.map(r => ({ id: r.id, ingredient: r.ingredient, supplier: r.supplier, hazard: r.hazard, measure: r.measure, frequency: r.frequency, nextDate: r.next_date || "", status: r.status, lastDone: r.last_done || null, notes: r.notes || "", score: r.score })));
      } catch(e) { console.error("Supabase fout:", e); }
      finally { setDbLoaded(true); }
    })();
  }, []);

    // Parse imported ingredient file (CSV or XLSX)
  const processImportFile = (file) => {
    const XLSX = window.XLSX;
    if (!XLSX) { showNotif("SheetJS nog niet geladen, probeer opnieuw", "error"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
        if (!rows.length) { showNotif("Geen data gevonden in bestand", "error"); return; }

        // Flexible column matching (case-insensitive, trim)
        const col = (row, ...keys) => {
          for (const k of keys) {
            const found = Object.keys(row).find(h => h.trim().toLowerCase() === k.toLowerCase());
            if (found && row[found] !== "") return String(row[found]).trim();
          }
          return "";
        };

        const productGroups = ["Bladgroenten","Groenten","Gevogelte","Vlees & vis","Granen","Zuivel","Eieren","Vetten & oliën","Zoetstoffen","Noten & zaden","Kruiden & specerijen","Sauzen & marinades"];

        const parsed = rows.map((row, i) => {
          const ingredientenRaw = col(row, "ingredienten (bij samengestelde producten)", "ingredienten", "ingrediënten", "ingredients", "sub_ingredienten", "sub-ingrediënten");
          const isComposite = col(row, "samengesteld", "composite") === "ja" || col(row, "samengesteld", "composite").toLowerCase() === "yes" || ingredientenRaw !== "";

          // Parse "Pinda's (Noten & zaden); Suiker (Zoetstoffen)" style
          const subIngredients = ingredientenRaw
            ? ingredientenRaw.split(";").map(s => {
                const match = s.trim().match(/^(.+?)\s*[(]([^)]+)[)]\s*$/);
                if (match) return { name: match[1].trim(), group: match[2].trim() };
                return { name: s.trim(), group: "" };
              }).filter(s => s.name)
            : [];

          return {
            id: Date.now() + i,
            article: col(row, "artikel", "artikelnaam", "article", "naam", "name") || `Rij ${i+1}`,
            articleNo: col(row, "artikelnummer", "artikel_nr", "articleno", "article_no", "nr"),
            supplier: col(row, "leverancier", "supplier"),
            group: col(row, "productgroep", "groep", "group"),
            subgroup: col(row, "subgroep", "subgroup"),
            risk: Number(col(row, "risico", "risk")) || 2,
            composite: isComposite,
            subIngredients,
          };
        });

        setIngredients(prev => [...prev, ...parsed]);
        setShowImportModal(false);
        showNotif(`✓ ${parsed.length} grondstoffen geïmporteerd${parsed.filter(p => p.composite).length > 0 ? ` (${parsed.filter(p => p.composite).length} samengesteld)` : ""}`);
      } catch (err) {
        showNotif("Fout bij inlezen bestand: " + err.message, "error");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Download template Excel
  const downloadTemplate = () => {
    const XLSX = window.XLSX;
    if (!XLSX) { showNotif("SheetJS nog niet geladen", "error"); return; }

    const header = ["artikelnaam", "artikelnummer", "leverancier", "ingredienten (bij samengestelde producten)"];
    const uitleg = [
      "Naam van het artikel",
      "Uniek artikelnummer",
      "Naam van de leverancier",
      "Leeg laten als enkelvoudig. Bij samengesteld: 'Pinda\\'s (Noten & zaden); Suiker (Zoetstoffen)'"
    ];
    const voorbeeld1 = ["Satesaus", "SA-001", "Struik Foods", "Pinda's (Noten & zaden); Suiker (Zoetstoffen); Ketjap (Sauzen & marinades); Knoflook (Kruiden & specerijen)"];
    const voorbeeld2 = ["Kipfilet vers", "VL-001", "PoultryPlus", ""];
    const voorbeeld3 = ["Tarwebloem", "GR-010", "MillPro BV", ""];

    const ws = XLSX.utils.aoa_to_sheet([header, uitleg]);

    // Column widths
    ws["!cols"] = [30, 18, 22, 80].map(w => ({ wch: w }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Grondstoffen");
    XLSX.writeFile(wb, "haccp_grondstoffen_template.xlsx");
  };

  const acceptChange = (id) => {
    const change = pendingChanges.find(c => c.id === id);
    setPendingChanges(prev => prev.map(c => c.id === id ? { ...c, status: "accepted" } : c));
    setChangeHistory(prev => [{ ...change, acceptedDate: new Date().toISOString().slice(0,10), acceptedBy: "Admin" }, ...prev]);
    // Apply change to hazards list if relevant
    if (change.changeType === "probability") {
      setHazards(prev => prev.map(h => h.hazard === change.hazardName ? { ...h, probability: change.newValue, _updated: true, _updateDate: new Date().toISOString().slice(0,10) } : h));
    }
    if (change.changeType === "severity") {
      setHazards(prev => prev.map(h => h.hazard === change.hazardName ? { ...h, severity: change.newValue, _updated: true, _updateDate: new Date().toISOString().slice(0,10) } : h));
    }
    if (change.changeType === "legislation") {
      setHazards(prev => prev.map(h => h.hazard === change.hazardName ? { ...h, legislation: change.newValue, _updated: true, _updateDate: new Date().toISOString().slice(0,10) } : h));
    }
    showNotif(`Wijziging voor ${change.hazardName} goedgekeurd en verwerkt`);
  };

  const rejectChange = (id) => {
    const change = pendingChanges.find(c => c.id === id);
    setPendingChanges(prev => prev.map(c => c.id === id ? { ...c, status: "rejected" } : c));
    showNotif(`Wijziging voor ${change.hazardName} afgewezen`, "error");
  };

  const acceptAllChanges = () => {
    pendingChanges.filter(c => c.status === "pending").forEach(c => acceptChange(c.id));
  };

  // Fraud analysis state
  const [fraudItems, setFraudItems] = useState([
    { id: 1, ingredient: "Olijfolie", supplier: "MedOil BV", fraudType: "Vervalsing", description: "Versnijding met goedkopere plantaardige oliën (zonnebloem, soja)", vulnerability: 4, detectability: 2, history: "Meerdere Europese fraudeschandalen bekend (2013, 2016)", motivation: "Hoog economisch voordeel, marge tot 40%", legislation: "EU 29/2012, EU 1151/2012" },
    { id: 2, ingredient: "Honing", supplier: "NaturSweet NL", fraudType: "Vervalsing", description: "Toevoeging van suikersiropen (rijst, maïs) of water", vulnerability: 5, detectability: 2, history: "Grootschalige fraude in EU-markt aantoonbaar via C4-suikertest", motivation: "Zeer hoog economisch voordeel, lage detectiekans", legislation: "EU 2001/110/EG" },
    { id: 3, ingredient: "Kipfilet vers", supplier: "PoultryFresh NL", fraudType: "Verkeerde herkomst", description: "Verkeerde aanduiding oorsprong (bv. NL i.p.v. buiten EU)", vulnerability: 3, detectability: 3, history: "NVWA inspecties 2022: 8% niet-conforme herkomstaanduiding gevogelte", motivation: "Prijsverschil EU vs. non-EU ≈ €1,20/kg", legislation: "EU 1169/2011, EU 543/2008" },
    { id: 4, ingredient: "Tarwebloem", supplier: "GrainMill BV", fraudType: "Niet-toegestane toevoegingen", description: "Toevoeging van niet-vergunde bleekmiddelen of kalkgehalte-aanpassing", vulnerability: 2, detectability: 4, history: "Incidenten voornamelijk buiten EU, NL laag risico", motivation: "Kostenreductie bij productie", legislation: "EU 1333/2008" },
    { id: 5, ingredient: "Biologisch gedroogde tomaten", supplier: "SunDry Italia", fraudType: "Valse certificering", description: "Conventionele tomaten verkocht als biologisch gecertificeerd", vulnerability: 4, detectability: 2, history: "RASFF 2023: meerdere meldingen biologisch-fraude Italië/Spanje", motivation: "Prijspremie biologisch ≈ 60-80% hoger", legislation: "EU 2018/848" },
  ]);
  const [showFraudModal, setShowFraudModal] = useState(false);
  const [editFraud, setEditFraud] = useState(null);
  const [fraudSearch, setFraudSearch] = useState("");

  // Verification plan state
  const [verifTab, setVerifTab] = useState("beslismodel");
  const [planningView, setPlanningView] = useState("niveau"); // "niveau" | "leverancier"
  const [verifSubTab, setVerifSubTab] = useState("factoren");
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [questionnaireConfig, setQuestionnaireConfig] = useState({ level: "leverancier", includeHaccp: true, includeVaccp: false, supplier: "", ingredient: "" });
  const [addFactorModal, setAddFactorModal] = useState(false);
  const [addFactorDraft, setAddFactorDraft] = useState({ label: "", direction: "verzwarend", weight: 2 });
  const [addMeasureModal, setAddMeasureModal] = useState(false);
  const [addMeasureDraft, setAddMeasureDraft] = useState({ label: "", icon: "◈" });

  const [verifFactors, setVerifFactors] = useState([
    { id: 1, label: "Ketenborging certificaat aanwezig", active: true, weight: 3, direction: "verlichtend", options: [{ label: "Ja", value: -1 }, { label: "Nee", value: 1 }] },
    { id: 2, label: "Nieuwe leverancier",                active: true, weight: 3, direction: "verzwarend",  options: [{ label: "Ja", value: 1 }, { label: "Nee", value: -1 }] },
    { id: 3, label: "Risiconiveau gevaar",               active: true, weight: 4, direction: "verzwarend",  options: [{ label: "Laag (1–3)", value: -1 }, { label: "Midden (4–8)", value: 0 }, { label: "Hoog/Kritiek (≥9)", value: 1 }] },
    { id: 4, label: "Risk Plaza certificaat aanwezig",   active: true, weight: 2, direction: "verlichtend", options: [{ label: "Ja", value: -1 }, { label: "Nee", value: 1 }] },
    { id: 5, label: "Betrouwbaarheid leverancier",       active: true, weight: 3, direction: "verlichtend", options: [{ label: "Goed", value: -1 }, { label: "Matig", value: 0 }, { label: "Onbekend/Slecht", value: 1 }] },
    { id: 6, label: "Beheersing in eigen proces",        active: true, weight: 3, direction: "verlichtend", options: [{ label: "Ja", value: -1 }, { label: "Nee", value: 1 }] },
  ]);

  // Measures ranked lightest → heaviest; threshold = minimum score to trigger this measure
  const [verifMeasures, setVerifMeasures] = useState([
    { id: 1, label: "Geen actie",                                    icon: "✓",  active: true, order: 1, threshold: 0  },
    { id: 2, label: "Questionnaire",                                 icon: "▣", active: true, order: 2, threshold: 20 },
    { id: 3, label: "Grondstofgevaren uitvragen (leverancierslvl.)", icon: "▣", active: true, order: 3, threshold: 35 },
    { id: 4, label: "CoA opvragen",                                  icon: "◇", active: true, order: 4, threshold: 50 },
    { id: 5, label: "Analyse uitvoeren",                             icon: "◉", active: true, order: 5, threshold: 65 },
    { id: 6, label: "Audit op locatie",                              icon: "▦", active: true, order: 6, threshold: 80 },
    { id: 7, label: "Consument waarschuwen",                         icon: "⚠",  active: true, order: 7, threshold: 95, special: true },
  ]);

  // Frequencies ranked lightest → heaviest
  const [verifFrequencies, setVerifFrequencies] = useState([
    { id: 1, label: "1x per 3 jaar",     active: true, order: 1, threshold: 0  },
    { id: 2, label: "1x per jaar",        active: true, order: 2, threshold: 25 },
    { id: 3, label: "2x per jaar",        active: true, order: 3, threshold: 45 },
    { id: 4, label: "√n leveringen",      active: true, order: 4, threshold: 60 },
    { id: 5, label: "2×√n leveringen",    active: true, order: 5, threshold: 75 },
    { id: 6, label: "Maandelijks",         active: true, order: 6, threshold: 88 },
    { id: 7, label: "Elke levering",       active: true, order: 7, threshold: 95 },
  ]);

  // Compute 0–100 verification score from selected factor values
  // factorValues: { [factorId]: optionValue (-1 | 0 | 1) }
  const computeVerifScore = (factorValues) => {
    const activeFactors = verifFactors.filter(f => f.active);
    if (activeFactors.length === 0) return 50;
    const maxPossible = activeFactors.reduce((s, f) => s + f.weight, 0);
    let raw = 0;
    activeFactors.forEach(f => {
      const val = factorValues[f.id] ?? 0; // -1 verlichtend, 0 neutraal, 1 verzwarend
      raw += f.weight * val; // range: -maxPossible … +maxPossible
    });
    // Normalise to 0–100: -max → 0, 0 → 50, +max → 100
    return Math.round(((raw + maxPossible) / (2 * maxPossible)) * 100);
  };

  // Given a score, find the appropriate measure and frequency
  const computeVerifSuggestion = (score) => {
    const activeMeasures = verifMeasures.filter(m => m.active && !m.special).sort((a, b) => b.threshold - a.threshold);
    const activeFreqs    = verifFrequencies.filter(f => f.active).sort((a, b) => b.threshold - a.threshold);
    const measure  = activeMeasures.find(m => score >= m.threshold) || activeMeasures[activeMeasures.length - 1];
    const freq     = activeFreqs.find(f => score >= f.threshold)    || activeFreqs[activeFreqs.length - 1];
    return { measure, freq, score };
  };

  // Auto-derive initial factor values from hazard risk score
  const defaultFactorValues = (hazardRiskScore) => {
    const vals = {};
    verifFactors.forEach(f => {
      if (f.id === 3) { // Risiconiveau
        vals[f.id] = hazardRiskScore >= 9 ? 1 : hazardRiskScore >= 4 ? 0 : -1;
      } else {
        vals[f.id] = 0; // neutral default
      }
    });
    return vals;
  };

  const [verifPlanning, setVerifPlanning] = useState([
    { id: 1, ingredient: "Sla (ijsbergsla)", supplier: "FreshFarm NL", measure: "CoA opvragen", frequency: "Elke levering", nextDate: "2025-04-01", status: "gepland", lastDone: null, notes: "" },
    { id: 2, ingredient: "Kipfilet vers", supplier: "PoultryFresh NL", measure: "Analyse uitvoeren", frequency: "2x per jaar", nextDate: "2025-06-01", status: "gepland", lastDone: "2024-12-01", notes: "" },
    { id: 3, ingredient: "Olijfolie", supplier: "MedOil BV", measure: "Audit op locatie", frequency: "1x per jaar", nextDate: "2025-09-01", status: "te laat", lastDone: "2024-03-01", notes: "" },
    { id: 4, ingredient: "Tarwebloem", supplier: "GrainMill BV", measure: "Questionnaire", frequency: "1x per jaar", nextDate: "2025-05-01", status: "gepland", lastDone: "2024-05-01", notes: "" },
    { id: 5, ingredient: "Spinazie vers", supplier: "FreshFarm NL", measure: "CoA opvragen", frequency: "Elke levering", nextDate: "2025-04-01", status: "uitgevoerd", lastDone: "2025-03-08", notes: "CoA ontvangen, goedgekeurd" },
  ]);

  // Compute next review date based on autoFrequency
  const getNextReviewDate = () => {
    const now = new Date("2026-03-11");
    const d = new Date(now);
    if (autoFrequency === "daily") d.setDate(d.getDate() + 1);
    else if (autoFrequency === "weekly") d.setDate(d.getDate() + (7 - d.getDay() + 1) % 7 || 7);
    else if (autoFrequency === "monthly") { d.setMonth(d.getMonth() + 1); d.setDate(1); }
    else if (autoFrequency === "quarterly") { const q = Math.floor(d.getMonth() / 3); d.setMonth((q + 1) * 3); d.setDate(1); }
    else if (autoFrequency === "biannual") { d.setMonth(d.getMonth() < 6 ? 6 : 12); d.setDate(1); }
    else if (autoFrequency === "yearly") { d.setFullYear(d.getFullYear() + 1); d.setMonth(0); d.setDate(1); }
    return d.toISOString().slice(0, 10);
  };

  const computeImpact = () => {
    const pending = pendingChanges.filter(c => c.status === "pending");
    const affected = [];
    pending.forEach(change => {
      const matchingHazard = hazards.find(h => h.hazard === change.hazardName);
      if (!matchingHazard && change.changeType !== "new_hazard") return;
      const groups = matchingHazard?.productGroups || [];
      ingredients.forEach(ing => {
        const ingGroups = ing.composite && ing.subIngredients?.length > 0
          ? [...new Set(ing.subIngredients.filter(s => s.group).map(s => s.group))]
          : [ing.subgroup, ing.group].filter(Boolean);
        if (ingGroups.some(g => groups.includes(g))) {
          const verifTask = verifPlanning.find(p => p.ingredient === ing.article && p.hazard === change.hazardName);
          affected.push({ change, ingredient: ing, hazard: matchingHazard, verifTask });
        }
      });
      if (change.changeType === "new_hazard") {
        affected.push({ change, ingredient: null, hazard: null, verifTask: null, isNew: true });
      }
    });
    return affected;
  };

  const impactItems = computeImpact();
  const affectedHazardIds = [...new Set(impactItems.filter(i => i.hazard).map(i => i.hazard.id))];
  const affectedIngredientIds = [...new Set(impactItems.filter(i => i.ingredient).map(i => i.ingredient.id))];
  const affectedVerifIds = [...new Set(impactItems.filter(i => i.verifTask).map(i => i.verifTask.id))];

  const filteredIngredients = ingredients.filter(i =>
    i.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navItems = [
    { key: "dashboard",    icon: "▤",  label: t.nav.dashboard },
    { key: "ingredients",  icon: "◈",  label: t.nav.ingredients },
    { key: "hazards",      icon: "◬",  label: t.nav.hazards },
    { key: "fraud",        icon: "◎",  label: lang === "nl" ? "Fraudeanalyse" : "Fraud analysis" },
    { key: "verification", icon: "◻",  label: lang === "nl" ? "Verificatieplan" : "Verification plan" },
    { key: "reports",      icon: "▦",  label: t.nav.reports },
    { key: "changes",      icon: "↻",  label: "Wijzigingen & Back-ups", badge: pendingCount > 0 ? pendingCount : null },
    { key: "admin",        icon: "◐",  label: t.nav.admin },
  ];

  const styles = {
    app: { display: "flex", height: "100vh", fontFamily: "'IBM Plex Sans', 'Helvetica Neue', sans-serif", background: "#eff0f5", color: "#003855" },
    sidebar: { width: 220, background: "#003855", display: "flex", flexDirection: "column", padding: "0", flexShrink: 0 },
    sidebarHeader: { padding: "24px 20px 20px", borderBottom: "1px solid #1e293b" },
    sidebarTitle: { color: "#eff0f5", fontSize: 15, fontWeight: 700, letterSpacing: "0.01em" },
    sidebarSubtitle: { color: "#4a5568", fontSize: 11, marginTop: 3 },
    navItem: (active) => ({
      display: "flex", alignItems: "center", gap: 10, padding: "11px 20px",
      cursor: "pointer", fontSize: 13.5, fontWeight: active ? 600 : 400,
      color: active ? "#ffffff" : "#8a94a6",
      background: active ? "#fa6401" : "transparent",
      borderLeft: active ? "3px solid #f5a554" : "3px solid transparent",
      transition: "all 0.15s",
    }),
    main: { flex: 1, overflow: "auto", display: "flex", flexDirection: "column" },
    topBar: { background: "#fff", borderBottom: "1px solid #dde0e8", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
    content: { flex: 1, padding: "28px", overflowY: "auto" },
    card: { background: "#fff", borderRadius: 10, border: "1px solid #dde0e8", padding: 20, marginBottom: 20 },
    pageTitle: { fontSize: 24, fontWeight: 800, marginBottom: 20, color: "#003855" },
    statCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "18px 20px", flex: 1 },
    btn: (variant = "primary") => ({
      padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600,
      background: variant === "primary" ? "#fa6401" : variant === "danger" ? "#dc2626" : variant === "outline" ? "transparent" : "#eff0f5",
      color: variant === "primary" ? "#fff" : variant === "danger" ? "#fff" : variant === "outline" ? "#fa6401" : "#000000",
      border: variant === "outline" ? "1.5px solid #fa6401" : variant === "secondary" ? "1px solid #e2e8f0" : "none",
    }),
    badge: (color) => ({
      display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: color === "red" ? "#fee2e2" : color === "orange" ? "#ffedd5" : color === "yellow" ? "#fef9c3" : "#dcfce7",
      color: color === "red" ? "#dc2626" : color === "orange" ? "#ea580c" : color === "yellow" ? "#ca8a04" : "#16a34a",
    }),
    input: { width: "100%", padding: "8px 12px", border: "1.5px solid #dde0e8", borderRadius: 6, fontSize: 13, background: "#fff", outline: "none", boxSizing: "border-box" },
    select: { padding: "8px 12px", border: "1.5px solid #dde0e8", borderRadius: 6, fontSize: 13, background: "#fff", outline: "none", cursor: "pointer" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th: { padding: "10px 12px", textAlign: "left", background: "#eff0f5", color: "#4a5568", fontWeight: 600, fontSize: 12, borderBottom: "2px solid #dde0e8" },
    td: { padding: "10px 12px", borderBottom: "1px solid #eff0f5", verticalAlign: "middle" },
    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modalBox: { background: "#fff", borderRadius: 12, padding: 28, minWidth: 540, maxWidth: 640, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  };

  const getRiskBadge = (risk) => {
    const color = risk >= 10 ? "red" : risk >= 5 ? "orange" : "green";
    const { label } = getRiskColorsForMatrix(risk, "4x5");
    return <span style={styles.badge(color)}>{label}</span>;
  };

  // Dashboard
  const renderDashboard = () => (
    <div>
      <div style={{ ...styles.pageTitle, marginBottom: 24 }}>{t.dashboard.welcome}</div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {t.dashboard.stats.map((label, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ fontSize: 28, fontWeight: 800, color: i === 3 ? "#dc2626" : "#fa6401" }}>{statValues[i]}</div>
            <div style={{ fontSize: 12, color: "#4a5568", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={styles.card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>{t.dashboard.recentAlerts}</div>
          {rasffAlerts.slice(0, 3).map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={styles.badge(a.severity === "Hoog" || a.severity === "High" ? "red" : a.severity === "Gemiddeld" || a.severity === "Medium" ? "orange" : "yellow")}>
                {a.severity}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{a.product}</div>
                <div style={{ fontSize: 11, color: "#8a94a6" }}>{a.hazard} · {a.date}</div>
              </div>
              <span style={{ fontSize: 11, color: a.status === "Nieuw" || a.status === "New" ? "#dc2626" : "#4a5568" }}>{a.status}</span>
            </div>
          ))}
        </div>
        <div style={styles.card}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>{t.dashboard.quickActions}</div>
          {t.dashboard.actions.map((action, i) => (
            <div key={i} onClick={() => setActiveNav(["ingredients","ingredients","reports","admin"][i])}
              style={{ padding: "10px 14px", marginBottom: 8, borderRadius: 8, background: "#eff0f5", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {action} <span style={{ color: "#8a94a6" }}>→</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Risico overzicht per productgroep</div>
        {["Groenten", "Vlees & vis", "Granen", "Zuivel", "Vetten & oliën"].map((group, i) => {
          const groupIngredients = ingredients.filter(ing => ing.group === group);
          const avgRisk = groupIngredients.length ? Math.round(groupIngredients.reduce((a, b) => a + b.risk, 0) / groupIngredients.length) : 0;
          const maxRisk = groupIngredients.length ? Math.max(...groupIngredients.map(i => i.risk)) : 0;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 120, fontSize: 13, color: "#000000" }}>{group}</div>
              <div style={{ flex: 1, height: 8, background: "#eff0f5", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${(maxRisk / 16) * 100}%`, height: "100%", borderRadius: 4, background: getRiskColor(maxRisk) }} />
              </div>
              <div style={{ width: 80, textAlign: "right" }}>{getRiskBadge(maxRisk)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Ingredients
  const renderIngredients = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={styles.pageTitle}>{t.ingredients.title}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={styles.btn("outline")} onClick={() => setShowImportModal(true)}>{t.ingredients.import}</button>
          <button style={styles.btn()} onClick={() => {
            setEditIngredient({ id: Date.now(), article: "", articleNo: "", supplier: "", group: "", subgroup: "", risk: 2, composite: false, subIngredients: [] });
            setIngredientModalTab("basis");
            setShowIngredientModal(true);
          }}>+ {t.ingredients.addManual}</button>
        </div>
      </div>

      <div style={{ ...styles.card, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input style={{ ...styles.input, maxWidth: 280 }} placeholder={t.ingredients.search} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>{t.ingredients.cols.map((col, i) => <th key={i} style={styles.th}>{col}</th>)}</tr>
          </thead>
          <tbody>
            {filteredIngredients.map(ing => (
              <tr key={ing.id} style={{ cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = "#eff0f5"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                <td style={styles.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontWeight: 500 }}>{ing.article}</span>
                    {ing.composite && (
                      <span style={{ fontSize: 10, padding: "1px 7px", background: "#fff8f3", color: "#fa6401", borderRadius: 20, border: "1px solid #fde68a", fontWeight: 700 }}>
                        Samengesteld
                      </span>
                    )}
                  </div>
                  {ing.composite && ing.subIngredients?.length > 0 && (
                    <div style={{ fontSize: 11, color: "#8a94a6", marginTop: 2 }}>
                      {ing.subIngredients.map(s => s.name).join(" · ")}
                    </div>
                  )}
                </td>
                <td style={styles.td}><span style={{ fontFamily: "monospace", fontSize: 12, color: "#4a5568" }}>{ing.articleNo}</span></td>
                <td style={styles.td}>{ing.supplier}</td>
                <td style={styles.td}><span style={{ padding: "2px 8px", background: "#fff8f3", color: "#fa6401", borderRadius: 4, fontSize: 12 }}>{ing.group}</span></td>
                <td style={styles.td}><span style={{ color: "#4a5568", fontSize: 12 }}>{ing.subgroup}</span></td>
                <td style={styles.td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ ...styles.btn("outline"), padding: "4px 10px", fontSize: 12 }} onClick={() => { setSelectedIngredient(ing); setActiveNav("hazards"); }}>Analyse</button>
                    <button style={{ ...styles.btn("secondary"), padding: "4px 10px", fontSize: 12 }}
                      onClick={() => { setEditIngredient({ ...ing, subIngredients: ing.subIngredients || [] }); setIngredientModalTab("basis"); setShowIngredientModal(true); }}>✎</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ingredient modal */}
      {showIngredientModal && editIngredient && (
        <div style={styles.modal} onClick={() => setShowIngredientModal(false)}>
          <div style={{ ...styles.modalBox, maxWidth: 580 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{editIngredient.article ? `${editIngredient.article}` : "Nieuwe grondstof"}</div>
              <button onClick={() => setShowIngredientModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8a94a6" }}>✕</button>
            </div>

            <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "2px solid #e2e8f0" }}>
              {[{ key: "basis", label: "Basisgegevens" }, { key: "samengesteld", label: "Samengesteld product" }].map(tab => (
                <button key={tab.key} onClick={() => setIngredientModalTab(tab.key)}
                  style={{ padding: "7px 16px", border: "none", cursor: "pointer", fontSize: 12, background: "none",
                    color: ingredientModalTab === tab.key ? "#003855" : "#4a5568", fontWeight: ingredientModalTab === tab.key ? 700 : 500,
                    borderBottom: ingredientModalTab === tab.key ? "3px solid #003855" : "3px solid transparent", marginBottom: -2 }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {ingredientModalTab === "basis" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["Artikelnaam", "article"], ["Artikelnummer", "articleNo"], ["Leverancier", "supplier"], ["Productgroep", "group"], ["Subgroep", "subgroup"]].map(([label, field]) => (
                  <div key={field}>
                    <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 4 }}>{label}</div>
                    <input value={editIngredient[field] || ""} onChange={e => setEditIngredient(d => ({ ...d, [field]: e.target.value }))}
                      style={{ ...styles.input, width: "100%" }} />
                  </div>
                ))}
              </div>
            )}

            {ingredientModalTab === "samengesteld" && (
              <div>
                <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #fde68a", marginBottom: 16, padding: 12 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <input type="checkbox" checked={!!editIngredient.composite}
                      onChange={e => setEditIngredient(d => ({ ...d, composite: e.target.checked }))}
                      style={{ width: 16, height: 16 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>Dit is een samengesteld product</div>
                      <div style={{ fontSize: 12, color: "#003855" }}>Gevaren worden afgeleid van de productgroepen van alle sub-ingrediënten samen</div>
                    </div>
                  </label>
                </div>

                {editIngredient.composite && (
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Sub-ingrediënten</div>
                    {(editIngredient.subIngredients || []).map((sub, si) => (
                      <div key={si} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
                        <input value={sub.name} placeholder="Naam (bijv. Pinda's)"
                          onChange={e => setEditIngredient(d => ({ ...d, subIngredients: d.subIngredients.map((x, i) => i === si ? { ...x, name: e.target.value } : x) }))}
                          style={{ ...styles.input }} />
                        <select value={sub.group || ""} onChange={e => setEditIngredient(d => ({ ...d, subIngredients: d.subIngredients.map((x, i) => i === si ? { ...x, group: e.target.value } : x) }))}
                          style={{ ...styles.select }}>
                          <option value="">— Productgroep —</option>
                          {["Bladgroenten","Groenten","Gevogelte","Vlees & vis","Granen","Zuivel","Eieren","Vetten & oliën","Zoetstoffen","Noten & zaden","Kruiden & specerijen","Sauzen & marinades"].map(g => (
                            <option key={g}>{g}</option>
                          ))}
                        </select>
                        <button onClick={() => setEditIngredient(d => ({ ...d, subIngredients: d.subIngredients.filter((_, i) => i !== si) }))}
                          style={{ ...styles.btn("danger"), padding: "6px 10px" }}>✕</button>
                      </div>
                    ))}
                    <button style={{ ...styles.btn("outline"), marginTop: 4 }}
                      onClick={() => setEditIngredient(d => ({ ...d, subIngredients: [...(d.subIngredients || []), { name: "", group: "" }] }))}>
                      + Sub-ingrediënt toevoegen
                    </button>

                    {(editIngredient.subIngredients || []).some(s => s.group) && (
                      <div style={{ marginTop: 16, padding: 12, background: "#fff8f3", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#003855", marginBottom: 6 }}>Afgeleide productgroepen voor gevarenanalyse:</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {[...new Set((editIngredient.subIngredients || []).filter(s => s.group).map(s => s.group))].map(g => (
                            <span key={g} style={{ padding: "2px 10px", background: "#fff8f3", color: "#003855", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{g}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
              <button style={styles.btn("secondary")} onClick={() => setShowIngredientModal(false)}>Annuleren</button>
              <button style={styles.btn()} onClick={() => {
                if (!editIngredient.article.trim()) return;
                const isNew = !ingredients.some(x => x.id === editIngredient.id);
                const newItem = isNew ? { ...editIngredient, id: Date.now() } : editIngredient;
                setIngredients(prev => isNew ? [...prev, newItem] : prev.map(x => x.id === newItem.id ? newItem : x));
                (async () => {
                  try {
                    const { createClient } = await import("@supabase/supabase-js");
                    const _u = import.meta.env.VITE_SUPABASE_URL, _k = import.meta.env.VITE_SUPABASE_ANON_KEY;
                    if (_u && _k) {
                      const _sb = createClient(_u, _k);
                      const row = {article:newItem.article,article_no:newItem.articleNo,supplier:newItem.supplier,group:newItem.group,subgroup:newItem.subgroup,risk:newItem.risk,composite:newItem.composite,sub_ingredients:newItem.subIngredients||[]};
                      if (isNew) { const {data} = await _sb.from("ingredients").insert(row).select("id").single(); if(data) setIngredients(prev=>prev.map(x=>x.id===newItem.id?{...x,id:data.id}:x)); }
                      else { await _sb.from("ingredients").update(row).eq("id",newItem.id); }
                    }
                  } catch(e) { console.error("DB fout:", e); }
                })();
                setShowIngredientModal(false);
                showNotif(`${editIngredient.article} opgeslagen`);
              }}>Opslaan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  const [selectedHazardType, setSelectedHazardType] = useState(null); // null = alle types
  const [hazardGroupFilter, setHazardGroupFilter] = useState(null); // null = alle

  const renderHazards = () => {
    // Determine active context: selected ingredient or group filter
    // For composite ingredients, collect all productgroups from sub-ingredients
    const activeGroups = selectedIngredient
      ? selectedIngredient.composite && selectedIngredient.subIngredients?.length > 0
        ? [...new Set(selectedIngredient.subIngredients.filter(s => s.group).map(s => s.group))]
        : [selectedIngredient.subgroup, selectedIngredient.group].filter(Boolean)
      : hazardGroupFilter ? [hazardGroupFilter] : [];
    const activeGroup = activeGroups[0] || null;
    const activeGroupLabel = selectedIngredient ? selectedIngredient.article : (hazardGroupFilter || "Alle grondstoffen");

    // Filter hazards based on selection
    const filteredHazards = hazards.filter(h => {
      const typeMatch = !selectedHazardType || h.hazardType === selectedHazardType;
      const groupMatch = activeGroups.length === 0 || (h.productGroups && h.productGroups.some(g =>
        activeGroups.includes(g)
      ));
      return typeMatch && (activeGroups.length > 0 ? groupMatch : true);
    });

    const allGroups = [...new Set(ingredients.map(i => i.group))];

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={styles.pageTitle}>{t.hazards.title}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {/* Detail level selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", background: "#eff0f5", borderRadius: 20 }}>
              <span style={{ fontSize: 11, color: "#4a5568", paddingLeft: 6, fontWeight: 600 }}>Niveau:</span>
              {[
                { key: "groep", label: "Groep" },
                { key: "subgroep", label: "Subgroep" },
                { key: "artikel", label: "Artikel" },
                { key: "ingredient", label: "Ingrediënt" },
              ].map(lvl => (
                <button key={lvl.key} onClick={() => setAnalysisLevel(lvl.key)}
                  style={{ padding: "4px 12px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: analysisLevel === lvl.key ? "#fa6401" : "transparent",
                    color: analysisLevel === lvl.key ? "#fff" : "#4a5568" }}>
                  {lvl.label}
                </button>
              ))}
            </div>
            <button style={styles.btn("outline")} onClick={() => setShowGroupSuggestion(true)}>Deel automatisch in groepen</button>
            <select style={styles.select} value={legislation} onChange={e => setLegislation(e.target.value)}>
              <option value="eu">{t.hazards.euOnly}</option>
              <option value="eu-nl">{t.hazards.euNl}</option>
            </select>
            <button style={styles.btn()} onClick={() => { setEditHazard({ hazardType: "Microbiologisch", hazard: "", probability: 2, severity: 3, legislation: "", productGroups: activeGroup ? [activeGroup] : [] }); setShowHazardModal(true); }}>+ {t.hazards.addHazard}</button>
            {selectedIngredient && (
              <button
                style={{ ...styles.btn(), background: aiAnalysing ? "#8a94a6" : "#003855", display: "flex", alignItems: "center", gap: 6 }}
                onClick={() => analyzeWithAI(selectedIngredient)}
                disabled={aiAnalysing}>
                {aiAnalysing ? "⏳ Analyseren..." : "✦ Analyseer met AI"}
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
          {/* LEFT SIDEBAR */}
          <div>
            <div style={styles.card}>
              <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {analysisLevel === "groep" ? "Productgroepen" : analysisLevel === "subgroep" ? "Subgroepen" : analysisLevel === "artikel" ? "Artikelen" : "Ingrediënten"}
              </div>

              {/* All */}
              <div onClick={() => { setSelectedIngredient(null); setHazardGroupFilter(null); }}
                style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 13, marginBottom: 6, fontWeight: !activeGroup ? 700 : 400,
                  background: !activeGroup ? "#eff0f5" : "transparent", color: !activeGroup ? "#003855" : "#000000",
                  border: !activeGroup ? "1px solid #e2e8f0" : "1px solid transparent" }}>
                Alle grondstoffen
                <span style={{ float: "right", fontSize: 11, background: "#dde0e8", borderRadius: 20, padding: "1px 7px", color: "#4a5568" }}>{hazards.length}</span>
              </div>

              {/* Groep niveau */}
              {analysisLevel === "groep" && (() => {
                const groups = [...new Set(ingredients.map(i => i.group).filter(Boolean))];
                return groups.map(g => {
                  const count = hazards.filter(h => h.productGroups?.includes(g)).length;
                  const isActive = hazardGroupFilter === g && !selectedIngredient;
                  return (
                    <div key={g} onClick={() => { setHazardGroupFilter(g); setSelectedIngredient(null); }}
                      style={{ padding: "7px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, marginBottom: 3,
                        background: isActive ? "#fff8f3" : "transparent", border: isActive ? "1px solid #bbf7d0" : "1px solid transparent",
                        color: isActive ? "#003855" : "#000000", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: isActive ? 700 : 400 }}>{g}</span>
                      {count > 0 && <span style={{ fontSize: 11, background: "#eff0f5", borderRadius: 20, padding: "0 6px", color: "#4a5568" }}>{count}</span>}
                    </div>
                  );
                });
              })()}

              {/* Subgroep niveau */}
              {analysisLevel === "subgroep" && (() => {
                const subgroups = [...new Set(ingredients.map(i => i.subgroup).filter(Boolean))];
                return subgroups.map(sg => {
                  const count = hazards.filter(h => h.productGroups?.includes(sg)).length;
                  const isActive = hazardGroupFilter === sg && !selectedIngredient;
                  return (
                    <div key={sg} onClick={() => { setHazardGroupFilter(sg); setSelectedIngredient(null); }}
                      style={{ padding: "7px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, marginBottom: 3,
                        background: isActive ? "#fff8f3" : "transparent", border: isActive ? "1px solid #bbf7d0" : "1px solid transparent",
                        color: isActive ? "#003855" : "#000000", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: isActive ? 700 : 400 }}>{sg}</span>
                      {count > 0 && <span style={{ fontSize: 11, background: "#eff0f5", borderRadius: 20, padding: "0 6px", color: "#4a5568" }}>{count}</span>}
                    </div>
                  );
                });
              })()}

              {/* Artikel / Ingrediënt niveau */}
              {(analysisLevel === "artikel" || analysisLevel === "ingredient") && ingredients.map(ing => {
                const relevantCount = hazards.filter(h => h.productGroups?.some(g => g === ing.subgroup || g === ing.group)).length;
                const isActive = selectedIngredient?.id === ing.id;
                return (
                  <div key={ing.id} onClick={() => { setSelectedIngredient(ing); setHazardGroupFilter(null); }}
                    style={{ padding: "7px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, marginBottom: 3,
                      background: isActive ? "#fff8f3" : "transparent", border: isActive ? "1px solid #bfdbfe" : "1px solid transparent",
                      color: isActive ? "#fa6401" : "#000000" }}>
                    <div style={{ fontWeight: isActive ? 700 : 500 }}>
                      {ing.article}
                      {ing.composite && <span style={{ marginLeft: 4, fontSize: 10, padding: "1px 5px", background: "#fff8f3", color: "#fa6401", borderRadius: 10, fontWeight: 700 }}>Samengesteld</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "#8a94a6", display: "flex", justifyContent: "space-between" }}>
                      <span>{analysisLevel === "artikel" ? ing.articleNo : ing.supplier}</span>
                      <span style={{ background: relevantCount > 0 ? "#fee2e2" : "#eff0f5", color: relevantCount > 0 ? "#dc2626" : "#8a94a6", borderRadius: 20, padding: "0 6px", fontWeight: 600 }}>{relevantCount}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hazard type filter */}
            <div style={styles.card}>
              <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.05em" }}>Gevarentype</div>
              <div onClick={() => setSelectedHazardType(null)}
                style={{ padding: "7px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, marginBottom: 4,
                  background: !selectedHazardType ? "#eff0f5" : "transparent", fontWeight: !selectedHazardType ? 700 : 400,
                  border: !selectedHazardType ? "1px solid #e2e8f0" : "1px solid transparent" }}>
                Alle types
              </div>
              {["Microbiologisch","Chemisch","Fysisch","Allergeen"].map((type, i) => (
                <div key={type} onClick={() => setSelectedHazardType(selectedHazardType === type ? null : type)}
                  style={{ padding: "7px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, marginBottom: 4,
                    fontWeight: selectedHazardType === type ? 700 : 400,
                    background: selectedHazardType === type ? "#fff8f3" : "transparent",
                    color: selectedHazardType === type ? "#003855" : "#000000",
                    border: selectedHazardType === type ? "1px solid #bbf7d0" : "1px solid transparent" }}>
                  {["◉","◎","◈","◇"][i]} {type}
                </div>
              ))}
            </div>

            {/* Mini risicomatrix */}
            <div style={styles.card}>
              <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 8, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.05em" }}>Risicomatrix 4×5</div>
              <div style={{ fontSize: 10, color: "#8a94a6", marginBottom: 8 }}>Kans (K) × Ernst (E)</div>
              {/* Column headers K=1..4 */}
              <div style={{ display: "flex", gap: 2, marginBottom: 2, paddingLeft: 22 }}>
                {[1,2,3,4].map(p => (
                  <div key={p} style={{ width: 24, textAlign: "center", fontSize: 9, color: "#8a94a6", fontWeight: 600 }}>K={p}</div>
                ))}
              </div>
              {/* Rows E=4..0 */}
              {[4,3,2,1,0].map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
                  <div style={{ width: 20, fontSize: 9, color: "#8a94a6", fontWeight: 600, textAlign: "right", paddingRight: 2 }}>E={s}</div>
                  {[1,2,3,4].map(p => {
                    const r = p * s;
                    const { bg, fg } = getRiskColorsForMatrix(r, "4x5");
                    return (
                      <div key={p} style={{ width: 24, height: 24, borderRadius: 3, background: bg,
                        border: "1px solid #dde0e8", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 9, fontWeight: 700, color: fg }}>
                        {r}
                      </div>
                    );
                  })}
                </div>
              ))}
              {/* Legend */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 10 }}>
                {[["Laag","0–4","#dcfce7","#16a34a"],["Midden","5–9","#ffedd5","#ea580c"],["Hoog","10–16","#fee2e2","#dc2626"]].map(([l,r,bg,fg]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10 }}>
                    <span style={{ padding: "1px 7px", borderRadius: 20, background: bg, color: fg, fontWeight: 600 }}>{r}</span>
                    <span style={{ color: "#4a5568" }}>{l.split(" ")[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN AREA */}
          <div>
            {/* Context banner */}
            {activeGroup && (
              <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bfdbfe", marginBottom: 16, padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#003855", display: "flex", alignItems: "center", gap: 8 }}>
                      {selectedIngredient ? `${selectedIngredient.article}` : `${hazardGroupFilter}`}
                      {selectedIngredient?.composite && (
                        <span style={{ fontSize: 11, padding: "1px 8px", background: "#fff8f3", color: "#fa6401", borderRadius: 20, border: "1px solid #fde68a", fontWeight: 700 }}>Samengesteld</span>
                      )}
                    </div>
                    {selectedIngredient && (
                      <div style={{ fontSize: 12, color: "#fa6401", marginTop: 2 }}>
                        {selectedIngredient.supplier} · {selectedIngredient.group} › {selectedIngredient.subgroup}
                        <span style={{ marginLeft: 8, padding: "1px 7px", background: "#fde8d4", borderRadius: 20, fontWeight: 600 }}>
                          Art. {selectedIngredient.articleNo}
                        </span>
                      </div>
                    )}
                    {selectedIngredient?.composite && selectedIngredient.subIngredients?.length > 0 && (
                      <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                        <span style={{ fontSize: 11, color: "#4a5568", marginRight: 2 }}>Sub-ingrediënten:</span>
                        {selectedIngredient.subIngredients.filter(s => s.name).map((s, i) => (
                          <span key={i} style={{ fontSize: 11, padding: "1px 8px", background: "#fff", border: "1px solid #bfdbfe", borderRadius: 20, color: "#003855" }}>
                            {s.name}{s.group ? ` (${s.group})` : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: filteredHazards.length > 0 ? "#dc2626" : "#fa6401" }}>{filteredHazards.length}</div>
                    <div style={{ fontSize: 11, color: "#4a5568" }}>relevante gevaren</div>
                  </div>
                </div>
              </div>
            )}

            {/* No results */}
            {filteredHazards.length === 0 && (
              <div style={{ ...styles.card, textAlign: "center", padding: 40, color: "#8a94a6" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Geen gevaren gevonden voor deze selectie</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Voeg een gevaar toe of pas de filters aan</div>
              </div>
            )}

            {/* Hazard cards */}
            {filteredHazards.map(h => {
              // Get product context for selected ingredient
              const dbEntry = hazardDetailDB[h.hazard];
              const productCtx = dbEntry ? (() => {
                const ctx = dbEntry[lang]?.productContext;
                if (!ctx) return null;
                if (selectedIngredient) return ctx[selectedIngredient.subgroup] || ctx[selectedIngredient.group] || ctx["default"];
                if (hazardGroupFilter) return ctx[hazardGroupFilter] || ctx["default"];
                return null;
              })() : null;

              return (
                <div key={h.id} style={{ ...styles.card, marginBottom: 14, border: affectedHazardIds.includes(h.id) ? "2px solid #f97316" : undefined }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: 12, background: "#eff0f5", padding: "2px 8px", borderRadius: 4, color: "#4a5568" }}>{h.hazardType}</span>
                        {getRiskBadge(h.probability * h.severity)}
                        {h._updated && (
                          <span style={{ fontSize: 11, padding: "2px 8px", background: "#fff8f3", color: "#15803d", borderRadius: 20, fontWeight: 700, border: "1px solid #86efac" }}>
                            Bijgewerkt {h._updateDate}
                          </span>
                        )}
                        {affectedHazardIds.includes(h.id) && (
                          <span onClick={() => setShowUpdateInbox(true)} style={{ fontSize: 11, padding: "2px 10px", background: "#fff8f3", color: "#fa6401", borderRadius: 20, fontWeight: 700, border: "1px solid #fed7aa", cursor: "pointer" }}>
                            Wijziging in behandeling — klik om te beoordelen
                          </span>
                        )}
                        {/* Product group tags */}
                        {h.productGroups && h.productGroups.map(pg => (
                          <span key={pg} style={{ fontSize: 11, padding: "1px 7px", background: pg === (selectedIngredient?.subgroup || selectedIngredient?.group || hazardGroupFilter) ? "#fef9c3" : "#eff0f5",
                            color: pg === (selectedIngredient?.subgroup || selectedIngredient?.group || hazardGroupFilter) ? "#fa6401" : "#8a94a6",
                            border: `1px solid ${pg === (selectedIngredient?.subgroup || selectedIngredient?.group || hazardGroupFilter) ? "#fbc99a" : "#dde0e8"}`,
                            borderRadius: 20, fontWeight: pg === (selectedIngredient?.subgroup || selectedIngredient?.group || hazardGroupFilter) ? 700 : 400 }}>
                            {pg}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#fa6401", textDecoration: "underline dotted", textUnderlineOffset: 3 }}
                        onClick={() => { setSelectedHazardDetail(h); setShowHazardDetail(true); }}
                        title="Klik voor meer informatie">
                        {h.hazard} <span style={{ fontSize: 12, fontWeight: 400, color: "#f5a554" }}>ⓘ</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#4a5568", marginTop: 2 }}>{h.legislation}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button style={{ ...styles.btn("outline"), padding: "4px 10px", fontSize: 12 }} onClick={() => { setEditHazard(h); setShowHazardModal(true); }}>Bewerk</button>
                      <button style={{ ...styles.btn("danger"), padding: "4px 10px", fontSize: 12 }} onClick={() => { setHazards(prev => prev.filter(x => x.id !== h.id)); (async()=>{try{const{createClient}=await import("@supabase/supabase-js");const _u=import.meta.env.VITE_SUPABASE_URL,_k=import.meta.env.VITE_SUPABASE_ANON_KEY;if(_u&&_k&&h.id<1e12){const _sb=createClient(_u,_k);await _sb.from("hazards").delete().eq("id",h.id);}}catch(e){console.error("DB fout:",e);}})(); showNotif("Gevaar verwijderd", "error"); }}>✕</button>
                    </div>
                  </div>

                  {/* Product context box — shown when ingredient/group is selected */}
                  {productCtx && (
                    <div style={{ padding: 12, background: "#fef9c3", borderRadius: 8, border: "1px solid #fde68a", marginBottom: 12, fontSize: 12, color: "#713f12", lineHeight: 1.6 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>
                        {selectedIngredient ? `Context voor ${selectedIngredient.article}` : `Context voor ${hazardGroupFilter}`}
                      </div>
                      {productCtx}
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    {[{ label: t.hazards.probability, value: h.probability }, { label: t.hazards.severity, value: h.severity }, { label: t.hazards.risk, value: h.probability * h.severity }].map((item, i) => (
                      <div key={i} style={{ textAlign: "center", padding: 10, background: "#eff0f5", borderRadius: 8, border: `1px solid ${i === 2 ? getRiskColor(item.value) + "55" : "#dde0e8"}` }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: i === 2 ? getRiskColor(item.value) : "#003855" }}>{item.value}</div>
                        <div style={{ fontSize: 11, color: "#8a94a6" }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Fraud Analysis
  const fraudTypes = ["Vervalsing", "Verkeerde herkomst", "Niet-toegestane toevoegingen", "Valse certificering"];
  const fraudTypeColors = {
    "Vervalsing": { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
    "Verkeerde herkomst": { bg: "#fff8f3", text: "#fa6401", border: "#fbc99a" },
    "Niet-toegestane toevoegingen": { bg: "#fefce8", text: "#fa6401", border: "#fbc99a" },
    "Valse certificering": { bg: "#f5f3ff", text: "#fa6401", border: "#ddd6fe" },
  };
  const getFraudRisk = (v, d) => v * (6 - d); // vulnerability × (6 - detectability) → high vuln + low detect = high risk
  const getFraudRiskLabel = (score) => score >= 16 ? "Kritiek" : score >= 10 ? "Hoog" : score >= 5 ? "Gemiddeld" : "Laag";
  const getFraudRiskColor = (score) => score >= 16 ? "#dc2626" : score >= 10 ? "#ea580c" : score >= 5 ? "#ca8a04" : "#16a34a";
  const getFraudRiskBg = (score) => score >= 16 ? "#fee2e2" : score >= 10 ? "#ffedd5" : score >= 5 ? "#fef9c3" : "#dcfce7";

  const renderFraud = () => {
    const filtered = fraudItems.filter(f =>
      f.ingredient.toLowerCase().includes(fraudSearch.toLowerCase()) ||
      f.fraudType.toLowerCase().includes(fraudSearch.toLowerCase()) ||
      f.supplier.toLowerCase().includes(fraudSearch.toLowerCase())
    );
    const highRisk = fraudItems.filter(f => getFraudRisk(f.vulnerability, f.detectability) >= 10).length;

    return (
      <div>
        {/* Header with VACCP label */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={styles.pageTitle}>Fraudeanalyse</div>
              <span style={{ fontSize: 11, padding: "3px 10px", background: "#f5f3ff", color: "#fa6401", border: "1px solid #ddd6fe", borderRadius: 20, fontWeight: 700, letterSpacing: "0.05em" }}>VACCP</span>
            </div>
            <div style={{ fontSize: 13, color: "#4a5568", maxWidth: 580 }}>
              Vulnerability Assessment and Critical Control Points — beoordeling van kwetsbaarheid voor voedselfraude per grondstof.
              <span style={{ marginLeft: 8, padding: "2px 8px", background: "#fff8f3", color: "#fa6401", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                Gescheiden van HACCP-gevarenanalyse
              </span>
            </div>
          </div>
          <button style={{ ...styles.btn(), display: "flex", alignItems: "center", gap: 6 }}
            onClick={() => { setEditFraud({ id: null, ingredient: "", supplier: "", fraudType: "Vervalsing", description: "", vulnerability: 3, detectability: 3, history: "", motivation: "", legislation: "" }); setShowFraudModal(true); }}>
            + Fraude-risico toevoegen
          </button>
        </div>

        {/* Distinction banner */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ padding: 16, borderRadius: 10, background: "#fff8f3", border: "1.5px solid #86efac" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#003855", marginBottom: 6 }}>HACCP — Gevarenanalyse</div>
            <div style={{ fontSize: 12, color: "#000000", lineHeight: 1.6 }}>
              Onbedoelde gevaren: microbiologisch, chemisch, fysisch, allergenen.<br />
              Matrix: <strong>Kans × Ernst</strong> van schade voor de consument.
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 10, background: "#f5f3ff", border: "1.5px solid #c4b5fd" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#fa6401", marginBottom: 6 }}>VACCP — Fraudeanalyse</div>
            <div style={{ fontSize: 12, color: "#000000", lineHeight: 1.6 }}>
              Bewuste, economisch gemotiveerde fraude met levensmiddelen.<br />
              Matrix: <strong>Kwetsbaarheid × Detecteerbaarheid</strong> van de fraude.
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Beoordeelde grondstoffen", value: fraudItems.length, color: "#fa6401", icon: "◇" },
            { label: "Hoog/kritiek risico", value: highRisk, color: "#dc2626", icon: "●" },
            { label: "Fraudetypen", value: [...new Set(fraudItems.map(f => f.fraudType))].length, color: "#fa6401", icon: "◬" },
            { label: "Gem. kwetsbaarheid", value: fraudItems.length ? (fraudItems.reduce((s, f) => s + f.vulnerability, 0) / fraudItems.length).toFixed(1) : "—", color: "#fa6401", icon: "▩" },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#8a94a6", marginTop: 2 }}>{s.label}</div>
                </div>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Vulnerability × Detectability matrix */}
        <div style={styles.card}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Kwetsbaarheidsmatrix — Kwetsbaarheid (V) × Detecteerbaarheid (D)</div>
          <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 14 }}>
            Risico = Kwetsbaarheid × (6 − Detecteerbaarheid). Lage detecteerbaarheid = moeilijk te ontdekken = hoger risico.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "40px repeat(5,1fr)", gap: 3, maxWidth: 480 }}>
            <div />
            {[1,2,3,4,5].map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, color: "#4a5568", fontWeight: 600, paddingBottom: 4 }}>D={d}</div>
            ))}
            {[5,4,3,2,1].map(v => [
              <div key={`v${v}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#4a5568", fontWeight: 600 }}>V={v}</div>,
              ...[1,2,3,4,5].map(d => {
                const score = v * (6 - d);
                const items = fraudItems.filter(f => f.vulnerability === v && f.detectability === d);
                return (
                  <div key={`${v}-${d}`} style={{ aspectRatio: "1", borderRadius: 6, background: getFraudRiskBg(score), border: `1.5px solid ${score >= 16 ? "#fca5a5" : score >= 10 ? "#fdba74" : score >= 5 ? "#fde047" : "#86efac"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 44 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: getFraudRiskColor(score) }}>{score}</div>
                    {items.length > 0 && (
                      <div style={{ position: "absolute", top: 2, right: 3, width: 16, height: 16, borderRadius: "50%", background: "#fa6401", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{items.length}</div>
                    )}
                  </div>
                );
              })
            ])}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 11 }}>
            {[["Kritiek (≥16)", "#fee2e2", "#dc2626"], ["Hoog (10–15)", "#ffedd5", "#fa6401"], ["Gemiddeld (5–9)", "#fef9c3", "#fa6401"], ["Laag (<5)", "#fff8f3", "#fa6401"]].map(([label, bg, fg]) => (
              <span key={label} style={{ padding: "2px 8px", borderRadius: 20, background: bg, color: fg, fontWeight: 600 }}>{label}</span>
            ))}
          </div>
        </div>

        {/* Fraud items table */}
        <div style={styles.card}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <input style={{ ...styles.input, flex: 1, maxWidth: 320 }} placeholder="Zoek op grondstof, type of leverancier..." value={fraudSearch} onChange={e => setFraudSearch(e.target.value)} />
            <div style={{ fontSize: 12, color: "#8a94a6", marginLeft: "auto" }}>{filtered.length} items</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Grondstof", "Leverancier", "Fraudetype", "Beschrijving", "V", "D", "Risico", "Niveau", ""].map((h, i) => (
                    <th key={i} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => {
                  const score = getFraudRisk(f.vulnerability, f.detectability);
                  const tc = fraudTypeColors[f.fraudType] || fraudTypeColors["Vervalsing"];
                  return (
                    <tr key={f.id} onMouseEnter={e => e.currentTarget.style.background = "#faf5ff"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{f.ingredient}</td>
                      <td style={{ ...styles.td, fontSize: 12, color: "#4a5568" }}>{f.supplier}</td>
                      <td style={styles.td}>
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600, background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>{f.fraudType}</span>
                      </td>
                      <td style={{ ...styles.td, fontSize: 12, color: "#000000", maxWidth: 200 }}>{f.description}</td>
                      <td style={{ ...styles.td, textAlign: "center", fontWeight: 800, color: "#fa6401" }}>{f.vulnerability}</td>
                      <td style={{ ...styles.td, textAlign: "center", fontWeight: 800, color: "#4a5568" }}>{f.detectability}</td>
                      <td style={{ ...styles.td, textAlign: "center" }}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: getFraudRiskColor(score) }}>{score}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: getFraudRiskBg(score), color: getFraudRiskColor(score) }}>{getFraudRiskLabel(score)}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button style={{ ...styles.btn("outline"), padding: "4px 10px", fontSize: 11 }} onClick={() => { setEditFraud({ ...f }); setShowFraudModal(true); }}>✎</button>
                          <button style={{ ...styles.btn("danger"), padding: "4px 10px", fontSize: 11 }} onClick={() => { setFraudItems(prev => prev.filter(x => x.id !== f.id)); (async()=>{try{const{createClient}=await import("@supabase/supabase-js");const _u=import.meta.env.VITE_SUPABASE_URL,_k=import.meta.env.VITE_SUPABASE_ANON_KEY;if(_u&&_k&&f.id<1e12){const _sb=createClient(_u,_k);await _sb.from("fraud_items").delete().eq("id",f.id);}}catch(e){console.error("DB fout:",e);}})(); showNotif("Fraude-risico verwijderd", "error"); }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Verification Plan
  const renderVerification = () => {
    const tabs = [
      { key: "beslismodel", icon: "▷", label: "Beslismodel" },
      { key: "planning", icon: "◫", label: "Planning & opvolging" },
      { key: "questionnaire", icon: "▣", label: "Questionnaire" },
    ];
    const statusColor = { gepland: ["#fff8f3","#fa6401"], uitgevoerd: ["#fff8f3","#fa6401"], "te laat": ["#fee2e2","#dc2626"] };

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={styles.pageTitle}>Verificatieplan</div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "2px solid #e2e8f0" }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setVerifTab(tab.key)}
              style={{ padding: "9px 18px", border: "none", cursor: "pointer", fontSize: 13, background: "none",
                color: verifTab === tab.key ? "#003855" : "#4a5568", fontWeight: verifTab === tab.key ? 700 : 500,
                borderBottom: verifTab === tab.key ? "3px solid #003855" : "3px solid transparent", marginBottom: -2 }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: BESLISMODEL ── */}
        {verifTab === "beslismodel" && (
          <div>
            <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "#eff0f5", borderRadius: 8, padding: 4, width: "fit-content" }}>
              {[
                { key: "factoren", label: "1. Factoren" },
                { key: "maatregelen", label: "2. Maatregelen" },
                { key: "scorekaart", label: "3. Scorekaart" },
                { key: "matrix", label: "Beslismatrix" },
              ].map(st => (
                <button key={st.key} onClick={() => setVerifSubTab(st.key)}
                  style={{ padding: "7px 16px", border: "none", cursor: "pointer", fontSize: 12, borderRadius: 6,
                    background: verifSubTab === st.key ? "#fff" : "transparent",
                    color: verifSubTab === st.key ? "#003855" : "#4a5568",
                    fontWeight: verifSubTab === st.key ? 700 : 500,
                    boxShadow: verifSubTab === st.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                  {st.label}
                </button>
              ))}
            </div>

              {/* STAP 1: FACTOREN */}
              {verifSubTab === "factoren" && (
                <div>
                  <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bfdbfe", marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: "#003855", lineHeight: 1.6 }}>
                      Stel per factor in of die <strong>verzwarend</strong> (hogere verificatie-intensiteit) of <strong>verlichtend</strong> (lagere intensiteit) werkt,
                      en hoe zwaar die factor meeweegt (1–5). Samen bepalen ze de verificatiescore (0–100).
                    </div>
                  </div>
                  {verifFactors.map((f, fi) => (
                    <div key={f.id} style={{ ...styles.card, marginBottom: 10, opacity: f.active ? 1 : 0.45 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <input type="checkbox" checked={f.active} onChange={() => setVerifFactors(prev => prev.map((x, i) => i === fi ? { ...x, active: !x.active } : x))}
                          style={{ width: 16, height: 16, cursor: "pointer", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 180, fontWeight: 600, fontSize: 13 }}>{f.label}</div>

                        {/* Direction toggle */}
                        <div style={{ display: "flex", gap: 4 }}>
                          {["verlichtend", "verzwarend"].map(dir => (
                            <button key={dir} onClick={() => setVerifFactors(prev => prev.map((x, i) => i === fi ? { ...x, direction: dir } : x))}
                              style={{ padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${f.direction === dir ? (dir === "verlichtend" ? "#16a34a" : "#dc2626") : "#dde0e8"}`,
                                background: f.direction === dir ? (dir === "verlichtend" ? "#dcfce7" : "#fee2e2") : "#fff",
                                color: f.direction === dir ? (dir === "verlichtend" ? "#16a34a" : "#dc2626") : "#4a5568",
                                fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                              {dir === "verlichtend" ? "↓ Verlichtend" : "↑ Verzwarend"}
                            </button>
                          ))}
                        </div>

                        {/* Weight */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, color: "#4a5568" }}>Gewicht:</span>
                          {[1,2,3,4,5].map(w => (
                            <button key={w} onClick={() => setVerifFactors(prev => prev.map((x, i) => i === fi ? { ...x, weight: w } : x))}
                              style={{ width: 28, height: 28, borderRadius: 4, border: `1.5px solid ${f.weight === w ? "#fa6401" : "#dde0e8"}`,
                                background: f.weight === w ? "#fa6401" : "#fff", color: f.weight === w ? "#fff" : "#4a5568",
                                fontWeight: 700, fontSize: 12, cursor: "pointer" }}>{w}</button>
                          ))}
                        </div>

                        <button style={{ ...styles.btn("danger"), padding: "4px 8px", fontSize: 11 }}
                          onClick={() => setVerifFactors(prev => prev.filter((_, i) => i !== fi))}>✕</button>
                      </div>
                    </div>
                  ))}
                  <button style={{ ...styles.btn("outline"), marginTop: 8 }} onClick={() => {
                    setAddFactorDraft({ label: "", direction: "verzwarend", weight: 2 });
                    setAddFactorModal(true);
                  }}>+ Factor toevoegen</button>

                  {/* Add factor modal */}
                  {addFactorModal && (
                    <div style={styles.modal} onClick={() => setAddFactorModal(false)}>
                      <div style={{ ...styles.modalBox, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Nieuwe factor</div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 4 }}>Naam</div>
                          <input autoFocus value={addFactorDraft.label}
                            onChange={e => setAddFactorDraft(d => ({ ...d, label: e.target.value }))}
                            placeholder="bijv. Audit goedgekeurd"
                            style={{ ...styles.input, width: "100%" }} />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 6 }}>Effect op verificatie</div>
                          <div style={{ display: "flex", gap: 8 }}>
                            {["verlichtend", "verzwarend"].map(dir => (
                              <button key={dir} onClick={() => setAddFactorDraft(d => ({ ...d, direction: dir }))}
                                style={{ flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12,
                                  border: `1.5px solid ${addFactorDraft.direction === dir ? (dir === "verlichtend" ? "#16a34a" : "#dc2626") : "#dde0e8"}`,
                                  background: addFactorDraft.direction === dir ? (dir === "verlichtend" ? "#dcfce7" : "#fee2e2") : "#fff",
                                  color: addFactorDraft.direction === dir ? (dir === "verlichtend" ? "#16a34a" : "#dc2626") : "#4a5568" }}>
                                {dir === "verlichtend" ? "↓ Verlichtend" : "↑ Verzwarend"}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 6 }}>Gewicht (1–5)</div>
                          <div style={{ display: "flex", gap: 6 }}>
                            {[1,2,3,4,5].map(w => (
                              <button key={w} onClick={() => setAddFactorDraft(d => ({ ...d, weight: w }))}
                                style={{ flex: 1, height: 36, borderRadius: 6, border: `1.5px solid ${addFactorDraft.weight === w ? "#fa6401" : "#dde0e8"}`,
                                  background: addFactorDraft.weight === w ? "#fa6401" : "#fff",
                                  color: addFactorDraft.weight === w ? "#fff" : "#4a5568", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{w}</button>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <button style={styles.btn("secondary")} onClick={() => setAddFactorModal(false)}>Annuleren</button>
                          <button style={styles.btn()} disabled={!addFactorDraft.label.trim()}
                            onClick={() => {
                              if (!addFactorDraft.label.trim()) return;
                              setVerifFactors(prev => [...prev, {
                                id: Date.now(), label: addFactorDraft.label.trim(),
                                active: true, weight: addFactorDraft.weight, direction: addFactorDraft.direction,
                                options: addFactorDraft.direction === "verlichtend"
                                  ? [{ label: "Ja", value: -1 }, { label: "Nee", value: 1 }]
                                  : [{ label: "Ja", value: 1 }, { label: "Nee", value: -1 }]
                              }]);
                              setAddFactorModal(false);
                            }}>Factor toevoegen</button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                    <button style={styles.btn()} onClick={() => setVerifSubTab("maatregelen")}>Volgende: Maatregelen →</button>
                  </div>
                </div>
              )}

              {/* STAP 2: MAATREGELEN */}
              {verifSubTab === "maatregelen" && (
                <div>
                  <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bfdbfe", marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: "#003855", lineHeight: 1.6 }}>
                      Rangschik de maatregelen van <strong>licht naar zwaar</strong> en stel de <strong>drempelwaarde</strong> in (0–100).
                      Het systeem kiest de zwaarste maatregel waarvoor de verificatiescore de drempel overschrijdt.
                      Doe hetzelfde voor frequenties.
                    </div>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Maatregelen — licht → zwaar</div>
                  {[...verifMeasures].sort((a, b) => a.order - b.order).map((m, mi) => (
                    <div key={m.id} style={{ ...styles.card, marginBottom: 8, opacity: m.active ? 1 : 0.45,
                      borderLeft: `4px solid ${m.special ? "#f59e0b" : "#fa6401"}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <input type="checkbox" checked={m.active}
                          onChange={() => setVerifMeasures(prev => prev.map(x => x.id === m.id ? { ...x, active: !x.active } : x))}
                          style={{ width: 16, height: 16, cursor: "pointer" }} />
                        <span style={{ fontSize: 18 }}>{m.icon}</span>
                        <div style={{ flex: 1, minWidth: 160, fontWeight: 600, fontSize: 13 }}>{m.label}</div>
                        {m.special && <span style={{ fontSize: 11, padding: "2px 8px", background: "#fff8f3", color: "#fa6401", borderRadius: 20, border: "1px solid #fde68a" }}>Bijzonder</span>}
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 11, color: "#4a5568" }}>Drempel:</span>
                          <input type="range" min={0} max={100} step={5} value={m.threshold}
                            onChange={e => setVerifMeasures(prev => prev.map(x => x.id === m.id ? { ...x, threshold: +e.target.value } : x))}
                            style={{ width: 100 }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#fa6401", minWidth: 36 }}>≥{m.threshold}</span>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => setVerifMeasures(prev => {
                            const sorted = [...prev].sort((a, b) => a.order - b.order);
                            const idx = sorted.findIndex(x => x.id === m.id);
                            if (idx === 0) return prev;
                            const newOrder = [...prev];
                            const ai = newOrder.findIndex(x => x.id === m.id);
                            const bi = newOrder.findIndex(x => x.id === sorted[idx - 1].id);
                            [newOrder[ai].order, newOrder[bi].order] = [newOrder[bi].order, newOrder[ai].order];
                            return [...newOrder];
                          })} style={{ ...styles.btn("outline"), padding: "3px 8px", fontSize: 12 }}>↑</button>
                          <button onClick={() => setVerifMeasures(prev => {
                            const sorted = [...prev].sort((a, b) => a.order - b.order);
                            const idx = sorted.findIndex(x => x.id === m.id);
                            if (idx === sorted.length - 1) return prev;
                            const newOrder = [...prev];
                            const ai = newOrder.findIndex(x => x.id === m.id);
                            const bi = newOrder.findIndex(x => x.id === sorted[idx + 1].id);
                            [newOrder[ai].order, newOrder[bi].order] = [newOrder[bi].order, newOrder[ai].order];
                            return [...newOrder];
                          })} style={{ ...styles.btn("outline"), padding: "3px 8px", fontSize: 12 }}>↓</button>
                          <button onClick={() => setVerifMeasures(prev => prev.filter(x => x.id !== m.id))}
                            style={{ ...styles.btn("danger"), padding: "3px 8px", fontSize: 12 }}>✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button style={{ ...styles.btn("outline"), marginTop: 4, marginBottom: 20 }}
                    onClick={() => { setAddMeasureDraft({ label: "", icon: "◈" }); setAddMeasureModal(true); }}>
                    + Maatregel toevoegen
                  </button>

                  {/* Add maatregel modal */}
                  {addMeasureModal && (
                    <div style={styles.modal} onClick={() => setAddMeasureModal(false)}>
                      <div style={{ ...styles.modalBox, maxWidth: 380 }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Nieuwe maatregel</div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                          <div style={{ width: 64 }}>
                            <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 4 }}>Icoon</div>
                            <input value={addMeasureDraft.icon}
                              onChange={e => setAddMeasureDraft(d => ({ ...d, icon: e.target.value }))}
                              style={{ ...styles.input, textAlign: "center", fontSize: 20, padding: "6px 4px" }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 4 }}>Naam</div>
                            <input autoFocus value={addMeasureDraft.label}
                              onChange={e => setAddMeasureDraft(d => ({ ...d, label: e.target.value }))}
                              placeholder="bijv. Steekproef uitvoeren"
                              style={{ ...styles.input, width: "100%" }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                          <button style={styles.btn("secondary")} onClick={() => setAddMeasureModal(false)}>Annuleren</button>
                          <button style={styles.btn()} disabled={!addMeasureDraft.label.trim()}
                            onClick={() => {
                              if (!addMeasureDraft.label.trim()) return;
                              setVerifMeasures(prev => [...prev, {
                                id: Date.now(), label: addMeasureDraft.label.trim(),
                                icon: addMeasureDraft.icon || "◈", active: true,
                                order: prev.length + 1, threshold: 50
                              }]);
                              setAddMeasureModal(false);
                            }}>Maatregel toevoegen</button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Frequenties — licht → zwaar</div>
                  {[...verifFrequencies].sort((a, b) => a.order - b.order).map((f) => (
                    <div key={f.id} style={{ ...styles.card, marginBottom: 8, opacity: f.active ? 1 : 0.45 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input type="checkbox" checked={f.active}
                          onChange={() => setVerifFrequencies(prev => prev.map(x => x.id === f.id ? { ...x, active: !x.active } : x))}
                          style={{ width: 16, height: 16, cursor: "pointer" }} />
                        <span style={{ fontSize: 14 }}>⏱</span>
                        <div style={{ flex: 1, minWidth: 140, fontWeight: 600, fontSize: 13 }}>⏱ {f.label}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 11, color: "#4a5568" }}>Drempel:</span>
                          <input type="range" min={0} max={100} step={5} value={f.threshold}
                            onChange={e => setVerifFrequencies(prev => prev.map(x => x.id === f.id ? { ...x, threshold: +e.target.value } : x))}
                            style={{ width: 100 }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#fa6401", minWidth: 36 }}>≥{f.threshold}</span>
                        </div>
                        <button onClick={() => setVerifFrequencies(prev => prev.filter(x => x.id !== f.id))}
                          style={{ ...styles.btn("danger"), padding: "3px 8px", fontSize: 12 }}>✕</button>
                      </div>
                    </div>
                  ))}
                  <button style={{ ...styles.btn("outline"), marginTop: 4 }}
                    onClick={() => setVerifFrequencies(prev => [...prev, { id: Date.now(), label: "Nieuwe frequentie", active: true, order: prev.length + 1, threshold: 50 }])}>
                    + Frequentie toevoegen
                  </button>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                    <button style={styles.btn("secondary")} onClick={() => setVerifSubTab("factoren")}>← Terug</button>
                    <button style={styles.btn()} onClick={() => setVerifSubTab("scorekaart")}>Volgende: Scorekaart →</button>
                  </div>
                </div>
              )}

              {/* STAP 3: SCOREKAART */}
              {verifSubTab === "scorekaart" && (() => {
                // Build combinations based on analysisLevel from gevarenanalyse
                const combinations = [];

                if (analysisLevel === "groep") {
                  // Group by hoofdgroep
                  const groups = [...new Set(ingredients.map(i => i.group).filter(Boolean))];
                  groups.forEach(g => {
                    const relevantHazards = hazards.filter(h => h.productGroups?.includes(g));
                    if (relevantHazards.length > 0) {
                      combinations.push({ key: g, label: g, sublabel: `Productgroep`, hazards: relevantHazards });
                    }
                  });
                } else if (analysisLevel === "subgroep") {
                  const subgroups = [...new Set(ingredients.map(i => i.subgroup).filter(Boolean))];
                  subgroups.forEach(sg => {
                    const relevantHazards = hazards.filter(h => h.productGroups?.includes(sg));
                    if (relevantHazards.length > 0) {
                      combinations.push({ key: sg, label: sg, sublabel: `Subgroep`, hazards: relevantHazards });
                    }
                  });
                } else {
                  // artikel of ingredient: per grondstof
                  ingredients.forEach(ing => {
                    const ingGroups = ing.composite && ing.subIngredients?.length > 0
                      ? [...new Set(ing.subIngredients.filter(s => s.group).map(s => s.group))]
                      : [ing.subgroup, ing.group].filter(Boolean);
                    const relevantHazards = hazards.filter(h =>
                      h.productGroups && h.productGroups.some(pg => ingGroups.includes(pg))
                    );
                    if (relevantHazards.length > 0) {
                      combinations.push({
                        key: String(ing.id),
                        label: analysisLevel === "artikel" ? `${ing.article} (${ing.articleNo})` : ing.article,
                        sublabel: `${ing.supplier} · ${ing.group}`,
                        ing,
                        hazards: relevantHazards
                      });
                    }
                  });
                }

                return (
                  <div>
                    <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bfdbfe", marginBottom: 16 }}>
                      <div style={{ fontSize: 13, color: "#003855" }}>
                        De scorekaart volgt het niveau ingesteld in de gevarenanalyse: <strong>
                          {analysisLevel === "groep" ? "Productgroep" : analysisLevel === "subgroep" ? "Subgroep" : analysisLevel === "artikel" ? "Artikel" : "Ingrediënt"}
                        </strong>. Vul de factoren in per gevaar — het systeem zoekt de bijpassende rij in de beslismatrix.
                        Klik op een rij om de factoren in te vullen en het verificatievoorstel te zien.
                      </div>
                    </div>

                    {combinations.length === 0 && (
                      <div style={{ ...styles.card, textAlign: "center", padding: 40, color: "#8a94a6" }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>—</div>
                        <div style={{ fontWeight: 600 }}>Geen gekoppelde gevaren gevonden</div>
                        <div style={{ fontSize: 12, marginTop: 4 }}>Zorg dat grondstoffen productgroepen hebben die overeenkomen met de productgroepen in de gevarenanalyse.</div>
                      </div>
                    )}

                    {combinations.map(({ key, label, sublabel, ing, hazards: ingHazards }) => (
                      <div key={key} style={{ ...styles.card, marginBottom: 20 }}>
                        {/* Header */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #f1f5f9" }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 15 }}>
                              {analysisLevel === "groep" ? "◈" : analysisLevel === "subgroep" ? "◈" : "◈"} {label}
                            </div>
                            <div style={{ fontSize: 12, color: "#4a5568", marginTop: 2 }}>{sublabel}</div>
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span style={{ fontSize: 12, padding: "3px 10px", background: "#eff0f5", borderRadius: 20, color: "#000000" }}>
                              {ingHazards.length} gevaar{ingHazards.length !== 1 ? "s" : ""}
                            </span>
                            <span style={{ fontSize: 11, padding: "2px 8px", background: "#fff8f3", color: "#fa6401", borderRadius: 20, fontWeight: 600 }}>
                              {analysisLevel === "groep" ? "Groepsniveau" : analysisLevel === "subgroep" ? "Subgroepniveau" : analysisLevel === "artikel" ? `Art. ${ing?.articleNo}` : ing?.supplier}
                            </span>
                          </div>
                        </div>

                        {/* One HazardScoreCard per hazard */}
                        {ingHazards.map(h => (
                          <div key={h.id}>
                            {affectedHazardIds.includes(h.id) && (
                              <div onClick={() => setShowUpdateInbox(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "#fff8f3", border: "1px solid #fed7aa", borderRadius: 8, marginBottom: 6, cursor: "pointer", fontSize: 12 }}>
                                <span style={{ fontWeight: 700, color: "#fa6401" }}>Wijziging in behandeling voor {h.hazard}</span>
                                <span style={{ color: "#fa6401" }}>— klik om te beoordelen →</span>
                              </div>
                            )}
                            <HazardScoreCard
                              ing={ing || { article: label, articleNo: key, supplier: sublabel, group: label }}
                              hazard={h}
                              verifFactors={verifFactors}
                              computeVerifScore={computeVerifScore}
                              computeVerifSuggestion={computeVerifSuggestion}
                              defaultFactorValues={defaultFactorValues}
                              setVerifPlanning={setVerifPlanning}
                              showNotif={showNotif}
                              styles={styles}
                              matrixType="4x5"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* BESLISMATRIX — score-gebaseerde weergave */}
              {verifSubTab === "matrix" && (() => {
                const activeFactors  = verifFactors.filter(f => f.active);
                const activeMeasures = [...verifMeasures].filter(m => m.active).sort((a, b) => a.order - b.order);
                const activeFreqs    = [...verifFrequencies].filter(f => f.active).sort((a, b) => a.order - b.order);
                const maxWeight      = activeFactors.reduce((s, f) => s + f.weight, 0);

                // Build score bands: for each active measure, what score range triggers it?
                const regularMeasures = activeMeasures.filter(m => !m.special);
                const bands = regularMeasures.map((m, mi) => {
                  const nextThreshold = regularMeasures[mi + 1]?.threshold ?? 101;
                  // Match frequency: highest freq whose threshold <= measure threshold
                  const matchFreq = [...activeFreqs].reverse().find(f => f.threshold <= m.threshold) || activeFreqs[0];
                  return { measure: m, freq: matchFreq, from: m.threshold, to: Math.min(nextThreshold - 1, 100) };
                });

                // Palette: green → red across bands
                const bandColor = (bi, total) => {
                  const ratio = bi / Math.max(total - 1, 1);
                  const r = Math.round(220 * ratio + 22 * (1 - ratio));
                  const g = Math.round(100 * (1 - ratio) + 163 * (1 - ratio));
                  return `rgb(${r},${Math.round(163 * (1 - ratio * 0.8))},${Math.round(74 * (1 - ratio))})`;
                };

                return (
                  <div>
                    <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bfdbfe", marginBottom: 20 }}>
                      <div style={{ fontSize: 13, color: "#003855", lineHeight: 1.7 }}>
                        <strong>Hoe werkt de score?</strong> Elke factor levert een bijdrage aan de verificatiescore (0–100).
                        Verlichtende factoren verlagen de score, verzwarende factoren verhogen hem.
                        Het systeem kiest automatisch de maatregel en frequentie waarvan de drempelwaarde het hoogst is zonder de score te overschrijden.
                        Pas factoren aan in stap 1, drempelwaarden in stap 2.
                      </div>
                    </div>

                    {/* Visuele scoreband */}
                    <div style={{ ...styles.card, marginBottom: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Verificatieschaal 0–100 → Maatregel</div>
                      <div style={{ display: "flex", height: 40, borderRadius: 10, overflow: "hidden", marginBottom: 10, border: "1px solid #e2e8f0" }}>
                        {bands.map((band, bi) => {
                          const width = band.to - band.from + 1;
                          const col = bandColor(bi, bands.length);
                          return (
                            <div key={bi} title={`Score ${band.from}–${band.to}: ${band.measure.label}`}
                              style={{ flex: width, background: col, display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 10, fontWeight: 700, color: "#fff", overflow: "hidden", whiteSpace: "nowrap", padding: "0 4px",
                                borderRight: bi < bands.length - 1 ? "2px solid rgba(255,255,255,0.4)" : "none" }}>
                              {width > 10 ? `${band.measure.icon} ${band.measure.label}` : band.measure.icon}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8a94a6" }}>
                        <span>0 — alle factoren verlichtend</span>
                        <span>100 — alle factoren verzwarend</span>
                      </div>
                      {activeMeasures.some(m => m.special) && (
                        <div style={{ marginTop: 10, padding: "8px 12px", background: "#fff8f3", borderRadius: 8, border: "1px solid #fed7aa", fontSize: 12, color: "#003855" }}>
                          <strong>Bijzondere maatregel buiten schaal:</strong> {activeMeasures.filter(m => m.special).map(m => m.label).join(", ")} — wordt handmatig ingezet.
                        </div>
                      )}
                    </div>

                    {/* Drempelwaarden tabel */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Maatregelen per scoreband</div>
                        <table style={{ ...styles.table, fontSize: 12 }}>
                          <thead>
                            <tr style={{ background: "#003855" }}>
                              {["Score ≥", "Maatregel", "Frequentie"].map((h, i) => (
                                <th key={i} style={{ ...styles.th, background: "#003855", color: "#eff0f5", fontSize: 11 }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {bands.map((band, bi) => (
                              <tr key={bi} style={{ background: bi % 2 === 0 ? "#fff" : "#eff0f5" }}>
                                <td style={{ ...styles.td, textAlign: "center" }}>
                                  <span style={{ padding: "2px 10px", borderRadius: 20, fontWeight: 800, fontSize: 12,
                                    background: bi === 0 ? "#fff8f3" : bi < bands.length * 0.4 ? "#fef9c3" : bi < bands.length * 0.7 ? "#ffedd5" : "#fee2e2",
                                    color:      bi === 0 ? "#fa6401" : bi < bands.length * 0.4 ? "#fa6401" : bi < bands.length * 0.7 ? "#fa6401" : "#dc2626" }}>
                                    ≥{band.from}
                                  </span>
                                </td>
                                <td style={styles.td}><span style={{ fontSize: 15, marginRight: 5 }}>{band.measure.icon}</span><strong>{band.measure.label}</strong></td>
                                <td style={{ ...styles.td, color: "#fa6401", fontWeight: 600 }}>⏱ {band.freq?.label || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Factorbijdrage aan score</div>
                        <div style={{ fontSize: 11, color: "#4a5568", marginBottom: 10, padding: "6px 10px", background: "#eff0f5", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                          Max gewicht: <strong>{maxWeight}</strong> · Score = ((Σ gewogen waarden + {maxWeight}) / {2 * maxWeight}) × 100
                        </div>
                        {activeFactors.map(f => (
                          <div key={f.id} style={{ marginBottom: 8, padding: 10, background: "#eff0f5", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <span style={{ fontSize: 12 }}>{f.label}</span>
                              <span style={{ fontSize: 11, padding: "1px 8px", borderRadius: 20, fontWeight: 700,
                                background: f.direction === "verlichtend" ? "#dcfce7" : "#fef2f2",
                                color:      f.direction === "verlichtend" ? "#16a34a" : "#dc2626",
                                border: `1px solid ${f.direction === "verlichtend" ? "#bbf7d0" : "#fecaca"}` }}>
                                {f.direction === "verlichtend" ? "↓" : "↑"} ×{f.weight}
                              </span>
                            </div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {f.options.map(opt => {
                                const raw = f.weight * opt.value;
                                const scoreDelta = Math.round((raw / (2 * maxWeight)) * 100);
                                return (
                                  <span key={opt.label} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20,
                                    background: opt.value < 0 ? "#fff8f3" : opt.value > 0 ? "#fee2e2" : "#eff0f5",
                                    color:      opt.value < 0 ? "#fa6401" : opt.value > 0 ? "#dc2626" : "#4a5568",
                                    border:     `1px solid ${opt.value < 0 ? "#fbc99a" : opt.value > 0 ? "#fecaca" : "#dde0e8"}` }}>
                                    {opt.label}: {scoreDelta > 0 ? "+" : ""}{scoreDelta} pt
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        {activeFactors.length === 0 && (
                          <div style={{ fontSize: 12, color: "#8a94a6", fontStyle: "italic" }}>Geen actieve factoren — activeer factoren in stap 1.</div>
                        )}
                      </div>
                    </div>

                    <div style={{ fontSize: 12, color: "#8a94a6" }}>
                      Drempelwaarden aanpassen → stap 2 · Verificatietaken aanmaken → Scorekaart (stap 3)
                    </div>
                  </div>
                );
              })()}
            </div>
        )}

        {/* ── TAB 2: PLANNING ── */}
        {verifTab === "planning" && (
          <div>
            {/* Level indicator — zelfde als scorekaart */}
            <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bbf7d0", marginBottom: 12, padding: "8px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: "#003855" }}>
                Detailniveau: <strong>
                  {analysisLevel === "groep" ? "Productgroep" : analysisLevel === "subgroep" ? "Subgroep" : analysisLevel === "artikel" ? "Artikel" : "Ingrediënt"}
                </strong> — instelbaar in de Gevarenanalyse.
              </span>
            </div>

            {/* Unplanned banner */}
            {(() => {
              const planned = new Set(verifPlanning.map(p => `${p.ingredient}__${p.hazard}`));
              const unplanned = [];
              if (analysisLevel === "groep") {
                [...new Set(ingredients.map(i => i.group).filter(Boolean))].forEach(g =>
                  hazards.filter(h => h.productGroups?.includes(g))
                    .forEach(h => { if (!planned.has(`${g}__${h.hazard}`)) unplanned.push({ key: g, label: g, supplier: "Productgroep", hazard: h }); })
                );
              } else if (analysisLevel === "subgroep") {
                [...new Set(ingredients.map(i => i.subgroup).filter(Boolean))].forEach(sg =>
                  hazards.filter(h => h.productGroups?.includes(sg))
                    .forEach(h => { if (!planned.has(`${sg}__${h.hazard}`)) unplanned.push({ key: sg, label: sg, supplier: "Subgroep", hazard: h }); })
                );
              } else {
                ingredients.forEach(ing => {
                  const ingGroups = ing.composite && ing.subIngredients?.length > 0
                    ? [...new Set(ing.subIngredients.filter(s => s.group).map(s => s.group))]
                    : [ing.subgroup, ing.group].filter(Boolean);
                  hazards.filter(h => h.productGroups?.some(pg => ingGroups.includes(pg)))
                    .forEach(h => { if (!planned.has(`${ing.article}__${h.hazard}`)) unplanned.push({ key: ing.article, label: ing.article, supplier: ing.supplier, hazard: h }); });
                });
              }
              if (unplanned.length === 0) return null;
              return (
                <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #fed7aa", marginBottom: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20 }}>!</span>
                  <div style={{ flex: 1, fontSize: 13, color: "#003855" }}>
                    <strong>{unplanned.length} combinatie{unplanned.length !== 1 ? "s" : ""}</strong> staan nog niet in de planning.
                  </div>
                  <button style={{ ...styles.btn(), fontSize: 12, padding: "6px 14px" }} onClick={() => {
                    let added = 0;
                    unplanned.forEach(({ label, supplier, hazard: h }) => {
                      const riskScore = h.probability * h.severity;
                      const defaultVals = {};
                      verifFactors.forEach(f => { if (f.id === 3) defaultVals[f.id] = riskScore >= 9 ? 1 : riskScore >= 4 ? 0 : -1; else defaultVals[f.id] = 0; });
                      const score = computeVerifScore(defaultVals);
                      const { measure, freq } = computeVerifSuggestion(score);
                      if (measure) setVerifPlanning(prev => [...prev, {
                        id: Date.now() + added++, ingredient: label, supplier,
                        hazard: h.hazard, measure: measure.label, frequency: freq?.label || "1x per jaar",
                        score, nextDate: "", status: "gepland", lastDone: null, notes: "Automatisch gegenereerd"
                      }]);
                    });
                    showNotif(`${unplanned.length} combinaties toegevoegd aan planning`);
                  }}>Genereer ontbrekende taken</button>
                </div>
              );
            })()}

            {/* Toolbar */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
              {/* Toggle: niveau vs leverancier */}
              <div style={{ display: "flex", background: "#eff0f5", borderRadius: 8, padding: 3, gap: 2 }}>
                {[
                  { key: "niveau", label: analysisLevel === "groep" ? "Productgroep" : analysisLevel === "subgroep" ? "Subgroep" : analysisLevel === "artikel" ? "Artikel" : "Ingrediënt" },
                  { key: "leverancier", label: "Leverancier" },
                ].map(opt => (
                  <button key={opt.key} onClick={() => setPlanningView(opt.key)}
                    style={{ padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                      background: planningView === opt.key ? "#fff" : "transparent",
                      color: planningView === opt.key ? "#fa6401" : "#4a5568",
                      boxShadow: planningView === opt.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {[
                { label: "Gepland",    value: verifPlanning.filter(p => p.status === "gepland").length,    color: "#fa6401", bg: "#fff8f3" },
                { label: "Uitgevoerd", value: verifPlanning.filter(p => p.status === "uitgevoerd").length, color: "#16a34a", bg: "#dcfce7" },
                { label: "Te laat",    value: verifPlanning.filter(p => p.status === "te laat").length,    color: "#dc2626", bg: "#fee2e2" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "6px 14px", borderRadius: 20, background: s.bg, fontSize: 12, fontWeight: 700, color: s.color }}>
                  {s.value} {s.label}
                </div>
              ))}
              <div style={{ flex: 1 }} />
              <button style={styles.btn()} onClick={() => setVerifPlanning(prev => [...prev, {
                id: Date.now(), ingredient: "", supplier: "", hazard: "",
                measure: "CoA opvragen", frequency: "1x per jaar",
                nextDate: "", status: "gepland", lastDone: null, notes: ""
              }])}>+ Taak toevoegen</button>
            </div>

            {/* Groups — niveau of leverancier */}
            {(() => {
              const groups = [];

              if (planningView === "leverancier") {
                // Groepeer op leverancier
                const suppliers = [...new Set(verifPlanning.map(p => p.supplier || "Onbekend"))];
                suppliers.forEach(s => {
                  const items = verifPlanning.filter(p => (p.supplier || "Onbekend") === s);
                  groups.push({ key: s, label: s, sublabel: "Leverancier", items });
                });              } else {
                // Groepeer op analysisLevel (identiek aan scorekaart)
                if (analysisLevel === "groep") {
                  [...new Set(ingredients.map(i => i.group).filter(Boolean))].forEach(g => {
                    groups.push({ key: g, label: g, sublabel: "Productgroep", items: verifPlanning.filter(p => p.ingredient === g) });
                  });
                } else if (analysisLevel === "subgroep") {
                  [...new Set(ingredients.map(i => i.subgroup).filter(Boolean))].forEach(sg => {
                    groups.push({ key: sg, label: sg, sublabel: "Subgroep", items: verifPlanning.filter(p => p.ingredient === sg) });
                  });
                } else if (analysisLevel === "artikel") {
                  [...new Set(ingredients.map(i => i.articleNo))].forEach(nr => {
                    const ing = ingredients.find(i => i.articleNo === nr);
                    if (!ing) return;
                    groups.push({ key: nr, label: ing.article, sublabel: ing.supplier, items: verifPlanning.filter(p => p.ingredient === ing.article) });
                  });
                } else {
                  ingredients.forEach(ing => {
                    groups.push({ key: ing.articleNo, label: ing.article, sublabel: ing.supplier, items: verifPlanning.filter(p => p.ingredient === ing.article) });
                  });
                }
                // Overig: taken die niet in de indeling vallen
                const knownLabels = new Set(groups.map(g => g.label));
                const extraKeys = [...new Set(verifPlanning.map(p => p.ingredient).filter(k => k && !knownLabels.has(k)))];
                extraKeys.forEach(k => groups.push({ key: k, label: k, sublabel: "Overig", items: verifPlanning.filter(p => p.ingredient === k) }));
                // Lege taken (nieuw toegevoegd zonder ingredient)
                const emptyTasks = verifPlanning.filter(p => !p.ingredient);
                if (emptyTasks.length > 0) groups.push({ key: "__nieuw__", label: "Nieuwe taken", sublabel: "Vul ingrediënt in", items: emptyTasks });
              }

              return groups.filter(g => g.items.length > 0).map(group => (
                <div key={group.key} style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#003855", padding: "8px 12px", background: "#eff0f5", borderRadius: "8px 8px 0 0", border: "1px solid #e2e8f0", borderBottom: "none", display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{group.label}</span>
                    <span style={{ fontSize: 11, color: "#8a94a6", fontWeight: 400 }}>{group.sublabel}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11, padding: "1px 8px", background: "#dde0e8", borderRadius: 20, color: "#4a5568" }}>{group.items.length} taak{group.items.length !== 1 ? "en" : ""}</span>
                  </div>
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
                    <table style={{ ...styles.table, marginBottom: 0 }}>
                      <thead>
                        <tr>
                          {["Gevaar", "Maatregel", "Frequentie", "Volgende datum", "Status", "Laatste uitvoering", "Notities", ""].map((h, i) => (
                            <th key={i} style={styles.th}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map(item => {
                          const [sbg, sfg] = statusColor[item.status] || ["#eff0f5", "#4a5568"];
                          const isAffected = affectedVerifIds.includes(item.id) ||
                            impactItems.some(imp => imp.ingredient?.article === item.ingredient && imp.change?.hazardName === item.hazard);
                          return (
                            <tr key={item.id} style={{ background: isAffected ? "#fff8f3" : undefined }}>
                              {!item.ingredient && (
                                <td style={styles.td} colSpan={1}>
                                  <input style={{ ...styles.input, fontSize: 12 }} value={item.ingredient || ""} placeholder="Ingrediënt..."
                                    onChange={e => setVerifPlanning(prev => prev.map(p => p.id === item.id ? { ...p, ingredient: e.target.value } : p))}
                                    onBlur={e => syncVerif({...item, ingredient: e.target.value})} />
                                </td>
                              )}
                              <td style={styles.td} colSpan={item.ingredient ? 1 : undefined}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ fontSize: 11, fontStyle: item.hazard ? "normal" : "italic" }}>{item.hazard || "—"}</span>
                                  {isAffected && (
                                    <span onClick={() => setShowUpdateInbox(true)} style={{ fontSize: 10, padding: "1px 6px", background: "#fbc99a", color: "#fa6401", borderRadius: 20, fontWeight: 700, cursor: "pointer" }}>Herzie</span>
                                  )}
                                </div>
                              </td>
                              <td style={styles.td}>
                                <select style={{ ...styles.select, fontSize: 12 }} value={item.measure}
                                  onChange={e => setVerifPlanning(prev => prev.map(p => p.id === item.id ? { ...p, measure: e.target.value } : p))} onBlur={e => syncVerif({...item, measure: e.target.value})}>
                                  {verifMeasures.filter(m => m.active).map(m => <option key={m.id}>{m.label}</option>)}
                                </select>
                              </td>
                              <td style={styles.td}>
                                <select style={{ ...styles.select, fontSize: 12 }} value={item.frequency}
                                  onChange={e => setVerifPlanning(prev => prev.map(p => p.id === item.id ? { ...p, frequency: e.target.value } : p))} onBlur={e => syncVerif({...item, frequency: e.target.value})}>
                                  {verifFrequencies.filter(f => f.active).sort((a, b) => a.order - b.order).map(f => <option key={f.id}>{f.label}</option>)}
                                </select>
                              </td>
                              <td style={styles.td}>
                                <input type="date" style={{ ...styles.input, fontSize: 12, padding: "4px 8px" }} value={item.nextDate}
                                  onChange={e => setVerifPlanning(prev => prev.map(p => p.id === item.id ? { ...p, nextDate: e.target.value } : p))} onBlur={e => syncVerif({...item, nextDate: e.target.value})} />
                              </td>
                              <td style={styles.td}>
                                <select style={{ ...styles.select, fontSize: 12, background: sbg, color: sfg, fontWeight: 700 }} value={item.status}
                                  onChange={e => setVerifPlanning(prev => prev.map(p => p.id === item.id ? { ...p, status: e.target.value } : p))} onBlur={e => syncVerif({...item, status: e.target.value})}>
                                  {["gepland", "uitgevoerd", "te laat"].map(s => <option key={s}>{s}</option>)}
                                </select>
                              </td>
                              <td style={styles.td}>
                                <input type="date" style={{ ...styles.input, fontSize: 12, padding: "4px 8px" }} value={item.lastDone || ""}
                                  onChange={e => setVerifPlanning(prev => prev.map(p => p.id === item.id ? { ...p, lastDone: e.target.value, status: "uitgevoerd" } : p))} onBlur={e => syncVerif({...item, lastDone: e.target.value, status: "uitgevoerd"})} />
                              </td>
                              <td style={styles.td}>
                                <input style={{ ...styles.input, fontSize: 12 }} value={item.notes} placeholder="Notitie..."
                                  onChange={e => setVerifPlanning(prev => prev.map(p => p.id === item.id ? { ...p, notes: e.target.value } : p))} onBlur={e => syncVerif({...item, notes: e.target.value})} />
                              </td>
                              <td style={styles.td}>
                                <button style={{ ...styles.btn("danger"), padding: "4px 8px", fontSize: 11 }}
                                  onClick={() => { syncVerif(item, true); setVerifPlanning(prev => prev.filter(p => p.id !== item.id)); }}>✕</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {/* ── TAB 3: QUESTIONNAIRE ── */}
        {verifTab === "questionnaire" && (
          <div>
            <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bfdbfe", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#003855", lineHeight: 1.6 }}>
                Genereer een vragenlijst voor een leverancier op basis van de geïdentificeerde gevaren. De questionnaire vraagt naar beheersing van de geselecteerde gevaren en kan als PDF worden geëxporteerd.
              </div>
            </div>

            <div style={styles.card}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Questionnaire instellen</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Niveau</label>
                  <select style={{ ...styles.select, width: "100%" }} value={questionnaireConfig.level}
                    onChange={e => setQuestionnaireConfig(c => ({ ...c, level: e.target.value }))}>
                    <option value="leverancier">Per leverancier</option>
                    <option value="grondstof">Per grondstof</option>
                    <option value="combinatie">Grondstof × gevaar</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Leverancier</label>
                  <select style={{ ...styles.select, width: "100%" }} value={questionnaireConfig.supplier}
                    onChange={e => setQuestionnaireConfig(c => ({ ...c, supplier: e.target.value }))}>
                    <option value="">— Alle leveranciers —</option>
                    {[...new Set(ingredients.map(i => i.supplier))].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Grondstof</label>
                  <select style={{ ...styles.select, width: "100%" }} value={questionnaireConfig.ingredient}
                    onChange={e => setQuestionnaireConfig(c => ({ ...c, ingredient: e.target.value }))}>
                    <option value="">— Alle grondstoffen —</option>
                    {ingredients.map(i => <option key={i.id}>{i.article}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                  <input type="checkbox" checked={questionnaireConfig.includeHaccp} onChange={e => setQuestionnaireConfig(c => ({ ...c, includeHaccp: e.target.checked }))} />
                  HACCP gevaren meenemen
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                  <input type="checkbox" checked={questionnaireConfig.includeVaccp} onChange={e => setQuestionnaireConfig(c => ({ ...c, includeVaccp: e.target.checked }))} />
                  Frauderisico's meenemen (VACCP)
                </label>
              </div>
              <button style={styles.btn()} onClick={() => setShowQuestionnaireModal(true)}>
                Questionnaire voorvertonen & exporteren
              </button>
            </div>

            {/* Questionnaire preview modal */}
            {showQuestionnaireModal && (
              <div style={styles.modal} onClick={() => setShowQuestionnaireModal(false)}>
                <div style={{ ...styles.modalBox, minWidth: 680, maxWidth: 780 }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Leveranciersvragenlijst</div>
                      <div style={{ fontSize: 12, color: "#4a5568" }}>
                        {questionnaireConfig.supplier || "Alle leveranciers"} · {new Date().toLocaleDateString("nl-NL")}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={styles.btn()} onClick={() => { showNotif("PDF wordt gegenereerd..."); }}>Export PDF</button>
                      <button onClick={() => setShowQuestionnaireModal(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#8a94a6" }}>✕</button>
                    </div>
                  </div>

                  <div style={{ padding: 16, background: "#eff0f5", borderRadius: 8, marginBottom: 20, fontSize: 12, color: "#000000", lineHeight: 1.6 }}>
                    Geachte leverancier,<br /><br />
                    In het kader van ons HACCP-systeem verzoeken wij u onderstaande vragen te beantwoorden met betrekking tot de beheersing van geïdentificeerde gevaren in de door u geleverde grondstoffen.
                    Uw antwoorden worden vertrouwelijk behandeld.
                  </div>

                  {questionnaireConfig.includeHaccp && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, padding: "6px 12px", background: "#fef2f2", borderRadius: 6, color: "#dc2626" }}>
                        HACCP — Microbiologische, chemische, fysische en allergene gevaren
                      </div>
                      {hazards.map((h, hi) => (
                        <div key={h.id} style={{ marginBottom: 16, padding: 14, border: "1px solid #e2e8f0", borderRadius: 8 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{hi + 1}. {h.hazard} <span style={{ fontSize: 11, color: "#4a5568", fontWeight: 400 }}>({h.hazardType})</span></div>
                          {[
                            `Welke maatregelen neemt u om ${h.hazard} te beheersen in uw productieproces?`,
                            `Beschikt u over analyseuitslagen of CoA's voor ${h.hazard}? Zo ja, hoe recent?`,
                            `Zijn er incidenten bekend met ${h.hazard} in uw bedrijf de afgelopen 3 jaar?`,
                          ].map((q, qi) => (
                            <div key={qi} style={{ marginBottom: 8 }}>
                              <div style={{ fontSize: 12, color: "#000000", marginBottom: 4 }}>{String.fromCharCode(97 + qi)}. {q}</div>
                              <div style={{ height: 36, background: "#eff0f5", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 11, color: "#8a94a6", padding: "8px 10px" }}>
                                Antwoord leverancier...
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {questionnaireConfig.includeVaccp && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, padding: "6px 12px", background: "#f5f3ff", borderRadius: 6, color: "#fa6401" }}>
                        VACCP — Voedselfraude en authenticiteit
                      </div>
                      {fraudItems.slice(0, 3).map((f, fi) => (
                        <div key={f.id} style={{ marginBottom: 16, padding: 14, border: "1px solid #e2e8f0", borderRadius: 8 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{hazards.length + fi + 1}. {f.fraudType}: {f.ingredient}</div>
                          {[
                            `Hoe garandeert u de authenticiteit en herkomst van ${f.ingredient}?`,
                            `Welke certificeringen of audits zijn aanwezig voor ${f.ingredient}?`,
                          ].map((q, qi) => (
                            <div key={qi} style={{ marginBottom: 8 }}>
                              <div style={{ fontSize: 12, color: "#000000", marginBottom: 4 }}>{String.fromCharCode(97 + qi)}. {q}</div>
                              <div style={{ height: 36, background: "#eff0f5", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 11, color: "#8a94a6", padding: "8px 10px" }}>
                                Antwoord leverancier...
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ padding: 14, background: "#eff0f5", borderRadius: 8, fontSize: 12, color: "#4a5568", marginBottom: 16 }}>
                    <strong>Ondertekening:</strong><br />
                    Naam: _________________________ &nbsp; Functie: _________________________<br />
                    Datum: _________________________ &nbsp; Handtekening: _________________________
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button style={styles.btn("secondary")} onClick={() => setShowQuestionnaireModal(false)}>{t.common.close}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Reports
  const buildReportRows = () => {
    const rows = [];
    ingredients.forEach(ing => {
      hazards.forEach(haz => {
        const risk = haz.probability * haz.severity;
        rows.push({
          artikel: ing.article,
          artikelnr: ing.articleNo,
          leverancier: ing.supplier,
          groep: ing.group,
          subgroep: ing.subgroup,
          gevaar: haz.hazard,
          type: haz.hazardType,
          kans: haz.probability,
          ernst: haz.severity,
          risico: risk,
          risiconiveau: getRiskColorsForMatrix(risk, "4x5").label,
          wetgeving: haz.legislation,
          bijgewerkt: haz._updateDate || "—",
        });
      });
    });
    if (groupBy === 1) rows.sort((a, b) => a.leverancier.localeCompare(b.leverancier));
    if (groupBy === 2) rows.sort((a, b) => a.groep.localeCompare(b.groep));
    if (groupBy === 3) rows.sort((a, b) => b.risico - a.risico);
    return rows;
  };

  const exportExcel = () => {
    try {
      const XLSX = window.XLSX;
      if (!XLSX) { showNotif("SheetJS niet geladen", "error"); return; }
      const rows = buildReportRows();
      const headers = lang === "nl"
        ? ["Artikel", "Artikelnr.", "Leverancier", "Groep", "Subgroep", "Gevaar", "Type", "Kans", "Ernst", "Risico", "Risiconiveau", "Wetgeving", "Bijgewerkt"]
        : ["Article", "Article No.", "Supplier", "Group", "Subgroup", "Hazard", "Type", "Probability", "Severity", "Risk", "Risk level", "Legislation", "Updated"];
      const wsData = [
        [`HACCP Gevarenanalyse grondstoffen — ${new Date().toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB")}`],
        [`${lang === "nl" ? "Wetgeving" : "Legislation"}: ${legislation === "eu" ? "EU" : "EU + NL"}`],
        [],
        headers,
        ...rows.map(r => [r.artikel, r.artikelnr, r.leverancier, r.groep, r.subgroep, r.gevaar, r.type, r.kans, r.ernst, r.risico, r.risiconiveau, r.wetgeving, r.bijgewerkt]),
      ];
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      // Column widths
      ws["!cols"] = [22,12,18,14,14,22,16,6,6,6,12,20,12].map(w => ({ wch: w }));
      // Style header row (row 4, 0-indexed 3)
      const headerRange = XLSX.utils.decode_range(ws["!ref"]);
      for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
        const cell = ws[XLSX.utils.encode_cell({ r: 3, c: C })];
        if (cell) cell.s = { font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "1E3A5F" } } };
      }
      XLSX.utils.book_append_sheet(wb, ws, lang === "nl" ? "Gevarenanalyse" : "Hazard Analysis");

      // Second sheet: risk summary per group
      const groups = [...new Set(ingredients.map(i => i.group))];
      const summaryData = [
        [lang === "nl" ? "Productgroep" : "Product group", lang === "nl" ? "Aantal gevaren" : "No. hazards", lang === "nl" ? "Max risico" : "Max risk", lang === "nl" ? "Risiconiveau" : "Risk level"],
        ...groups.map(g => {
          const groupRows = rows.filter(r => r.groep === g);
          const maxRisk = groupRows.length ? Math.max(...groupRows.map(r => r.risico)) : 0;
          return [g, groupRows.length, maxRisk, getRiskColorsForMatrix(maxRisk, "4x5").label];
        }),
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(summaryData);
      ws2["!cols"] = [22, 14, 12, 14].map(w => ({ wch: w }));
      XLSX.utils.book_append_sheet(wb, ws2, lang === "nl" ? "Samenvatting" : "Summary");

      XLSX.writeFile(wb, `HACCP_Gevarenanalyse_${new Date().toISOString().slice(0,10)}.xlsx`);
      showNotif(lang === "nl" ? "Excel gedownload ✓" : "Excel downloaded ✓");
    } catch (e) {
      showNotif("Export mislukt: " + e.message, "error");
    }
  };

  const exportPdf = () => {
    try {
      const { jsPDF } = window.jspdf;
      if (!jsPDF) { showNotif("jsPDF niet geladen — even wachten en opnieuw proberen", "error"); return; }
      if (!window.jspdf.jsPDF.API?.autoTable) { showNotif("AutoTable plugin niet geladen — even wachten en opnieuw proberen", "error"); return; }

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const rows = buildReportRows();
      const pageW = doc.internal.pageSize.getWidth();
      const date = new Date().toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB");

      // Header banner
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageW, 20, "F");
      doc.setTextColor(241, 245, 249);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("HACCP Gevarenanalyse Grondstoffen", 10, 13);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text(`${date}  ·  ${legislation === "eu" ? "EU-wetgeving" : "EU + Nederlandse wetgeving"}  ·  Vertrouwelijk`, pageW - 10, 13, { align: "right" });

      // Main table via AutoTable
      const headers = lang === "nl"
        ? ["Artikel", "Leverancier", "Groep", "Gevaar", "Type", "K", "E", "Risico", "Niveau", "Wetgeving"]
        : ["Article", "Supplier", "Group", "Hazard", "Type", "P", "S", "Risk", "Level", "Legislation"];

      const tableRows = rows.map(r => [
        r.artikel, r.leverancier, r.groep, r.gevaar, r.type,
        String(r.kans), String(r.ernst), String(r.risico), r.risiconiveau, r.wetgeving
      ]);

      doc.autoTable({
        startY: 25,
        head: [headers],
        body: tableRows,
        styles: { fontSize: 7, cellPadding: 2.5, overflow: "linebreak", valign: "middle" },
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold", fontSize: 7.5 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 36 },
          1: { cellWidth: 28 },
          2: { cellWidth: 22 },
          3: { cellWidth: 34 },
          4: { cellWidth: 22 },
          5: { cellWidth: 8, halign: "center", fontStyle: "bold" },
          6: { cellWidth: 8, halign: "center", fontStyle: "bold" },
          7: { cellWidth: 10, halign: "center", fontStyle: "bold" },
          8: { cellWidth: 18, halign: "center" },
          9: { cellWidth: "auto" },
        },
        didParseCell: (data) => {
          // Color risk score cell
          if (data.column.index === 7 && data.section === "body") {
            const risk = Number(data.cell.raw);
            if (risk >= 12) { data.cell.styles.fillColor = [254, 226, 226]; data.cell.styles.textColor = [185, 28, 28]; }
            else if (risk >= 8) { data.cell.styles.fillColor = [255, 237, 213]; data.cell.styles.textColor = [154, 52, 18]; }
            else if (risk >= 4) { data.cell.styles.fillColor = [254, 249, 195]; data.cell.styles.textColor = [133, 77, 14]; }
            else { data.cell.styles.fillColor = [220, 252, 231]; data.cell.styles.textColor = [22, 101, 52]; }
          }
          // Color risk level cell
          if (data.column.index === 8 && data.section === "body") {
            const risk = rows[data.row.index]?.risico || 0;
            if (risk >= 12) { data.cell.styles.textColor = [185, 28, 28]; data.cell.styles.fontStyle = "bold"; }
            else if (risk >= 8) { data.cell.styles.textColor = [154, 52, 18]; data.cell.styles.fontStyle = "bold"; }
            else if (risk >= 4) { data.cell.styles.textColor = [133, 77, 14]; }
            else { data.cell.styles.textColor = [22, 101, 52]; }
          }
          // Group separator styling when groupBy === 2
          if (groupBy === 2 && data.section === "body" && data.column.index === 2) {
            data.cell.styles.fontStyle = "bold";
          }
        },
        willDrawPage: (data) => {
          // Repeat header on new pages
          if (data.pageNumber > 1) {
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, pageW, 12, "F");
            doc.setTextColor(241, 245, 249);
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.text("HACCP Gevarenanalyse Grondstoffen", 10, 8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(148, 163, 184);
            doc.text(`${date} — vervolg`, pageW - 10, 8, { align: "right" });
          }
        },
        margin: { top: 25, left: 10, right: 10 },
      });

      // Summary page
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageW, 20, "F");
      doc.setTextColor(241, 245, 249);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(lang === "nl" ? "Samenvatting per productgroep" : "Summary per product group", 10, 13);

      const groups = [...new Set(ingredients.map(i => i.group))];
      const summaryRows = groups.map(g => {
        const groupRows = rows.filter(r => r.groep === g);
        const maxRisk = groupRows.length ? Math.max(...groupRows.map(r => r.risico)) : 0;
        const hazardTypes = [...new Set(groupRows.map(r => r.type))].join(", ");
        return [g, String(groupRows.length), String(maxRisk), getRiskColorsForMatrix(maxRisk, "4x5").label, hazardTypes];
      });

      doc.autoTable({
        startY: 28,
        head: [[
          lang === "nl" ? "Productgroep" : "Product group",
          lang === "nl" ? "Aantal gevaren" : "No. hazards",
          lang === "nl" ? "Max. risico" : "Max. risk",
          lang === "nl" ? "Risiconiveau" : "Risk level",
          lang === "nl" ? "Gevarentypen" : "Hazard types",
        ]],
        body: summaryRows,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: "bold" },
          1: { cellWidth: 30, halign: "center" },
          2: { cellWidth: 25, halign: "center", fontStyle: "bold" },
          3: { cellWidth: 30, halign: "center" },
          4: { cellWidth: "auto" },
        },
        didParseCell: (data) => {
          if (data.column.index === 2 && data.section === "body") {
            const risk = Number(data.cell.raw);
            if (risk >= 12) { data.cell.styles.fillColor = [254,226,226]; data.cell.styles.textColor = [185,28,28]; }
            else if (risk >= 8) { data.cell.styles.fillColor = [255,237,213]; data.cell.styles.textColor = [154,52,18]; }
            else if (risk >= 4) { data.cell.styles.fillColor = [254,249,195]; data.cell.styles.textColor = [133,77,14]; }
            else { data.cell.styles.fillColor = [220,252,231]; data.cell.styles.textColor = [22,101,52]; }
          }
        },
        margin: { top: 28, left: 10, right: 10 },
      });

      // Footer on all pages
      const pageCount = doc.getNumberOfPages();
      for (let p = 1; p <= pageCount; p++) {
        doc.setPage(p);
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.setFont("helvetica", "normal");
        doc.text(
          `HACCP Gevarenanalyse — Vertrouwelijk — Pagina ${p} van ${pageCount}`,
          pageW / 2, doc.internal.pageSize.getHeight() - 5, { align: "center" }
        );
      }

      doc.save(`HACCP_Gevarenanalyse_${new Date().toISOString().slice(0,10)}.pdf`);
      showNotif(lang === "nl" ? "PDF gedownload ✓" : "PDF downloaded ✓");
    } catch (e) {
      showNotif("PDF export mislukt: " + e.message, "error");
    }
  };

  const renderReports = () => {
    const rows = buildReportRows();
    const groupLabels = lang === "nl" ? ["Grondstof", "Leverancier", "Productgroep", "Risiconiveau"] : ["Ingredient", "Supplier", "Product group", "Risk level"];
    return (
      <div>
        <div style={styles.pageTitle}>{t.reports.title}</div>

        {/* Export controls */}
        <div style={styles.card}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: "#4a5568" }}>{t.reports.groupBy}:</span>
              <select style={styles.select} value={groupBy} onChange={e => setGroupBy(Number(e.target.value))}>
                {groupLabels.map((opt, i) => <option key={i} value={i}>{opt}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 12, color: "#8a94a6" }}>{rows.length} {lang === "nl" ? "rijen" : "rows"}</div>
            <button style={{ ...styles.btn(), display: "flex", alignItems: "center", gap: 6 }} onClick={exportExcel}>
              {t.reports.exportExcel}
            </button>
            <button style={{ ...styles.btn("secondary"), display: "flex", alignItems: "center", gap: 6 }} onClick={exportPdf}>
              {t.reports.exportPdf}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div style={styles.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{t.reports.preview}</div>
            <div style={{ fontSize: 12, color: "#4a5568" }}>
              {lang === "nl" ? "Gevarenanalyse grondstoffen" : "Raw material hazard analysis"} · {new Date().toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB")} · {legislation === "eu" ? "EU" : "EU + NL"}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={{ background: "#003855" }}>
                  {(lang === "nl"
                    ? ["Artikel", "Artikelnr.", "Leverancier", "Groep", "Gevaar", "Type", "K", "E", "Risico", "Risiconiveau", "Wetgeving"]
                    : ["Article", "Article No.", "Supplier", "Group", "Hazard", "Type", "P", "S", "Risk", "Risk level", "Legislation"]
                  ).map((h, i) => (
                    <th key={i} style={{ ...styles.th, background: "#003855", color: "#eff0f5", fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const { bg: riskBg, fg: riskFg, label: riskLevelLabel } = getRiskColorsForMatrix(row.risico, "4x5");
                  const showGroupHeader = groupBy === 2 && (i === 0 || rows[i-1].groep !== row.groep);
                  return [
                    showGroupHeader && (
                      <tr key={`g-${i}`} style={{ background: "#eff0f5" }}>
                        <td colSpan={11} style={{ ...styles.td, fontWeight: 700, fontSize: 12, color: "#003855", padding: "6px 12px" }}>
                          {row.groep}
                        </td>
                      </tr>
                    ),
                    <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#eff0f5" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fff8f3"}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#eff0f5"}>
                      <td style={{ ...styles.td, fontWeight: 500 }}>{row.artikel}</td>
                      <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 11, color: "#4a5568" }}>{row.artikelnr}</td>
                      <td style={styles.td}>{row.leverancier}</td>
                      <td style={styles.td}><span style={{ padding: "2px 7px", background: "#fff8f3", color: "#fa6401", borderRadius: 4, fontSize: 11 }}>{row.groep}</span></td>
                      <td style={styles.td}>{row.gevaar}</td>
                      <td style={{ ...styles.td, fontSize: 11, color: "#4a5568" }}>{row.type}</td>
                      <td style={{ ...styles.td, textAlign: "center", fontWeight: 700 }}>{row.kans}</td>
                      <td style={{ ...styles.td, textAlign: "center", fontWeight: 700 }}>{row.ernst}</td>
                      <td style={{ ...styles.td, textAlign: "center" }}>
                        <span style={{ fontWeight: 800, fontSize: 14, color: riskFg }}>{row.risico}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: riskBg, color: riskFg }}>{row.risiconiveau}</span>
                      </td>
                      <td style={{ ...styles.td, fontSize: 11, color: "#4a5568", fontFamily: "monospace" }}>{row.wetgeving}</td>
                    </tr>
                  ];
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk summary */}
        <div style={styles.card}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>{lang === "nl" ? "Samenvatting per productgroep" : "Summary per product group"}</div>
          {[...new Set(ingredients.map(i => i.group))].map((group, gi) => {
            const groupRows = rows.filter(r => r.groep === group);
            const maxRisk = groupRows.length ? Math.max(...groupRows.map(r => r.risico)) : 0;
            const riskFg = getRiskColorsForMatrix(maxRisk, "4x5").fg;
            return (
              <div key={gi} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 130, fontSize: 13 }}>{group}</div>
                <div style={{ width: 60, fontSize: 12, color: "#8a94a6" }}>{groupRows.length} {lang === "nl" ? "gevaren" : "hazards"}</div>
                <div style={{ flex: 1, height: 8, background: "#eff0f5", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${(maxRisk / 16) * 100}%`, height: "100%", borderRadius: 4, background: getRiskColor(maxRisk) }} />
                </div>
                <div style={{ width: 30, textAlign: "right", fontWeight: 800, color: riskFg }}>{maxRisk}</div>
                <div style={{ width: 80 }}>{getRiskBadge(maxRisk)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Admin state
  const [adminTab, setAdminTab] = useState("database");

  // Backup state
  const [backups, setBackups] = useState([
    { id: 1, label: "Automatische back-up", timestamp: "2026-03-11 03:00", trigger: "auto", size: "42 KB", note: "", status: "ok" },
    { id: 2, label: "Automatische back-up", timestamp: "2026-03-10 03:00", trigger: "auto", size: "41 KB", note: "", status: "ok" },
    { id: 3, label: "Handmatige back-up", timestamp: "2026-03-09 14:22", trigger: "manual", size: "40 KB", note: "Voor grote update gevarendatabase", status: "ok" },
    { id: 4, label: "Automatische back-up", timestamp: "2026-03-09 03:00", trigger: "auto", size: "38 KB", note: "", status: "ok" },
    { id: 5, label: "Automatische back-up", timestamp: "2026-03-08 03:00", trigger: "auto", size: "38 KB", note: "", status: "ok" },
  ]);
  const [backupSettings, setBackupSettings] = useState({ autoEnabled: true, frequency: "daily", retentionDays: 30 });
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(null);
  const [backupNote, setBackupNote] = useState("");
  const [dbSearch, setDbSearch] = useState("");
  const [showDbModal, setShowDbModal] = useState(false);
  const [editDbEntry, setEditDbEntry] = useState(null);

  // Local editable copy of the hazard detail database
  const [dbEntries, setDbEntries] = useState(
    Object.entries(hazardDetailDB).map(([name, data], i) => ({
      id: i + 1,
      name,
      type: ["Microbiologisch","Microbiologisch","Chemisch","Allergeen","Fysisch"][i] || "Microbiologisch",
      defaultProbability: [3,2,3,2,1][i] || 2,
      defaultSeverity: [5,5,3,4,4][i] || 3,
      legislation_nl: data.nl.legislation.join("; "),
      general_nl: data.nl.general,
      sources_nl: data.nl.sources,
      incubation_nl: data.nl.incubation,
      duration_nl: data.nl.duration,
      riskGroups_nl: data.nl.riskGroups.join("; "),
      consumerEffects_nl: data.nl.consumerEffects.join("\n"),
      productContexts: Object.entries(data.nl.productContext).map(([group, text]) => ({ group, text_nl: text, text_en: data.en?.productContext?.[group] || "" })),
      lastUpdated: "2025-03-01",
      source: "Handmatig ingevoerd",
    }))
  );

  const emptyDbEntry = {
    id: null, name: "", type: "Microbiologisch",
    defaultProbability: 2, defaultSeverity: 3,
    legislation_nl: "", general_nl: "", sources_nl: "",
    incubation_nl: "", duration_nl: "",
    riskGroups_nl: "", consumerEffects_nl: "",
    productContexts: [{ group: "", text_nl: "", text_en: "" }],
    lastUpdated: new Date().toISOString().slice(0,10),
    source: "Handmatig ingevoerd",
  };

  const filteredDb = dbEntries.filter(e =>
    e.name.toLowerCase().includes(dbSearch.toLowerCase()) ||
    e.type.toLowerCase().includes(dbSearch.toLowerCase())
  );

  const adminTabs = [
    { key: "database", icon: "▤", label: "Gevaren Database" },
    { key: "productlinks", icon: "⌥", label: "Productgroepkoppelingen" },
    { key: "rasff", icon: "◎", label: "RASFF Meldingen" },
    { key: "sync", icon: "⇆", label: "Synchronisatie" },
    { key: "suggestions", icon: "◈", label: "Update Voorstellen" },
    { key: "settings", icon: "⚙", label: "Update instellingen" },
    { key: "backups", icon: "◬", label: "Back-ups & Herstel" },
    { key: "instellingen", icon: "◐", label: "Instellingen" },
  ];

  // ── WIJZIGINGEN, BACK-UPS & UPDATES ──────────────────────────────────────
  const [changesTab, setChangesTab] = useState("inbox");

  const renderChanges = () => {
    const pending = pendingChanges.filter(c => c.status === "pending");
    const handled = pendingChanges.filter(c => c.status !== "pending");
    const freqLabels = { daily: "Dagelijks", weekly: "Wekelijks", monthly: "Maandelijks", quarterly: "Per kwartaal", biannual: "Halfjaarlijks", yearly: "Jaarlijks" };

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={styles.pageTitle}>Wijzigingen, Back-ups &amp; Updates</div>
          {pending.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "#fff8f3", border: "1.5px solid #f97316", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#fa6401" }}>
              {pending.length} wijziging{pending.length !== 1 ? "en" : ""} wachten op beoordeling
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "2px solid #e2e8f0" }}>
          {[
            { key: "inbox", label: `Inbox (${pending.length})` },
            { key: "impact", label: `Impact (${impactItems.filter(i => !i.isNew).length})` },
            { key: "changelog", label: "Changelog" },
            { key: "frequency", label: "Herzieningsfrequentie" },
            { key: "backups", label: "Back-ups" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setChangesTab(tab.key)}
              style={{ padding: "9px 18px", border: "none", cursor: "pointer", fontSize: 13, background: "none", whiteSpace: "nowrap",
                color: changesTab === tab.key ? "#003855" : "#4a5568", fontWeight: changesTab === tab.key ? 700 : 500,
                borderBottom: changesTab === tab.key ? "3px solid #003855" : "3px solid transparent", marginBottom: -2 }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── INBOX ── */}
        {changesTab === "inbox" && (
          <div>
            <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bfdbfe", padding: "12px 16px", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#003855", lineHeight: 1.6 }}>
                Hier verzamelt de app alle wijzigingen vanuit de centrale gevarendatabase. Je beoordeelt ze zelf — pas na goedkeuring worden ze verwerkt in jouw analyse en verificatieplan.
                {updateMode === "auto" && <span> Volgende geplande herziening: <strong>{getNextReviewDate()}</strong> ({freqLabels[autoFrequency]}).</span>}
              </div>
            </div>

            {pending.length > 0 && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                <button style={styles.btn()} onClick={() => { acceptAllChanges(); showNotif("Alle wijzigingen goedgekeurd"); }}>
                  ✓ Alles goedkeuren ({pending.length})
                </button>
              </div>
            )}
            {pending.length === 0 && (
              <div style={{ padding: 32, textAlign: "center", color: "#4a5568", background: "#eff0f5", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                <div style={{ fontWeight: 600 }}>Geen openstaande wijzigingen</div>
                <div style={{ fontSize: 12, marginTop: 4, color: "#8a94a6" }}>Alles is up-to-date</div>
              </div>
            )}
            {pending.map(change => (
              <div key={change.id} style={{ marginBottom: 12, padding: 16, borderRadius: 10, border: `1.5px solid ${change.urgent ? "#fbc99a" : "#dde0e8"}`, background: change.urgent ? "#fff8f3" : "#fff" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                      {change.urgent && <span style={{ fontSize: 11, padding: "2px 8px", background: "#dc2626", color: "#fff", borderRadius: 20, fontWeight: 700 }}>Urgent</span>}
                      <span style={{ fontSize: 11, padding: "2px 8px", background: "#eff0f5", color: "#4a5568", borderRadius: 20 }}>{change.source}</span>
                      <span style={{ fontSize: 11, color: "#8a94a6" }}>{change.date}</span>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600,
                        background: change.changeType === "new_hazard" ? "#fff8f3" : change.changeType === "probability" || change.changeType === "severity" ? "#fff8f3" : "#fff8f3",
                        color: change.changeType === "new_hazard" ? "#003855" : change.changeType === "probability" || change.changeType === "severity" ? "#fa6401" : "#fa6401" }}>
                        {change.changeType === "new_hazard" ? "Nieuw gevaar" : change.changeType === "probability" ? "Kanswijziging" : change.changeType === "severity" ? "Ernstwijziging" : "Wetgevingswijziging"}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{change.hazardName}
                      <span style={{ fontSize: 12, fontWeight: 400, color: "#4a5568", marginLeft: 6 }}>{change.hazardType}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 13 }}>
                      <span style={{ fontWeight: 600, color: "#4a5568", fontSize: 12 }}>{change.field}:</span>
                      {change.oldValue !== null ? (
                        <>
                          <span style={{ padding: "3px 10px", background: "#fee2e2", color: "#dc2626", borderRadius: 6, fontWeight: 700, fontSize: typeof change.oldValue === "number" ? 15 : 11 }}>{change.oldValue}</span>
                          <span style={{ color: "#8a94a6", fontSize: 16 }}>→</span>
                          <span style={{ padding: "3px 10px", background: "#fff8f3", color: "#fa6401", borderRadius: 6, fontWeight: 700, fontSize: typeof change.newValue === "number" ? 15 : 11 }}>{change.newValue}</span>
                          {typeof change.newValue === "number" && typeof change.oldValue === "number" && (
                            <span style={{ fontSize: 12, color: change.newValue > change.oldValue ? "#dc2626" : "#fa6401", fontWeight: 700 }}>
                              {change.newValue > change.oldValue ? "▲" : "▼"} {Math.abs(change.newValue - change.oldValue)}
                            </span>
                          )}
                        </>
                      ) : (
                        <span style={{ padding: "3px 10px", background: "#fff8f3", color: "#fa6401", borderRadius: 6, fontWeight: 600, fontSize: 12 }}>+ {change.newValue}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "#000000", lineHeight: 1.5, background: "#eff0f5", padding: "8px 10px", borderRadius: 6, marginBottom: 6 }}>
                      <em>{change.reason}</em>
                    </div>
                    {(() => {
                      const hits = impactItems.filter(i => i.change.id === change.id && !i.isNew);
                      if (!hits.length) return null;
                      return (
                        <div style={{ fontSize: 11, padding: "5px 10px", background: "#fff8f3", border: "1px solid #fed7aa", borderRadius: 6, color: "#fa6401" }}>
                          Raakt <strong>{hits.length}</strong> combinatie{hits.length !== 1 ? "s" : ""} in jouw analyse: {hits.slice(0,3).map(h => h.ingredient.article).join(", ")}{hits.length > 3 ? ` + ${hits.length-3} meer` : ""}
                          <button style={{ marginLeft: 8, background: "none", border: "none", color: "#fa6401", cursor: "pointer", fontSize: 11, fontWeight: 700, textDecoration: "underline" }} onClick={() => setChangesTab("impact")}>Bekijk impact →</button>
                        </div>
                      );
                    })()}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                    <button style={{ ...styles.btn(), padding: "6px 16px", fontSize: 12 }} onClick={() => { acceptChange(change.id); showNotif(`${change.hazardName} goedgekeurd`); }}>✓ Goedkeuren</button>
                    <button style={{ ...styles.btn("secondary"), padding: "6px 16px", fontSize: 12 }} onClick={() => { rejectChange(change.id); showNotif(`${change.hazardName} afgewezen`); }}>✕ Afwijzen</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── IMPACT ── */}
        {changesTab === "impact" && (
          <div>
            <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #fed7aa", padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#003855" }}>
              Onderstaande grondstof × gevaar combinaties worden geraakt door openstaande wijzigingen. Na goedkeuring moeten deze herbeoordeeld worden.
            </div>
            {impactItems.filter(i => !i.isNew).length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "#4a5568", background: "#eff0f5", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                <div style={{ fontWeight: 600 }}>Geen impact op huidige analyse</div>
              </div>
            ) : (
              [...new Set(impactItems.filter(i => !i.isNew).map(i => i.change.id))].map(changeId => {
                const change = pendingChanges.find(c => c.id === changeId);
                const hits = impactItems.filter(i => i.change.id === changeId && !i.isNew);
                return (
                  <div key={changeId} style={{ ...styles.card, marginBottom: 14, borderLeft: "4px solid #f97316" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{change.hazardName}</span>
                      <span style={{ fontSize: 11, padding: "2px 10px", background: "#fff8f3", color: "#fa6401", borderRadius: 20, border: "1px solid #fed7aa" }}>
                        {change.field}: {change.oldValue} → {change.newValue}
                      </span>
                    </div>
                    {hits.map((hit, hi) => (
                      <div key={hi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#eff0f5", borderRadius: 8, marginBottom: 6, fontSize: 12 }}>
                        
                        <span style={{ fontWeight: 600, flex: 1 }}>{hit.ingredient.article}</span>
                        <span style={{ color: "#4a5568" }}>{hit.ingredient.supplier}</span>
                        {hit.verifTask
                          ? <span style={{ padding: "2px 8px", background: "#fff8f3", color: "#fa6401", borderRadius: 20, border: "1px solid #fed7aa", fontSize: 11, fontWeight: 600 }}>Herzien</span>
                          : <span style={{ padding: "2px 8px", background: "#eff0f5", color: "#4a5568", borderRadius: 20, fontSize: 11 }}>Geen verificatietaak</span>}
                        <button style={{ ...styles.btn("outline"), padding: "3px 10px", fontSize: 11 }}
                          onClick={() => { setSelectedIngredient(hit.ingredient); setActiveNav("hazards"); }}>
                          Ga naar analyse →
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── CHANGELOG ── */}
        {changesTab === "changelog" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
              {[
                { label: "In behandeling", value: pending.length, color: "#f5a554" },
                { label: "Urgent", value: pending.filter(c => c.urgent).length, color: "#dc2626" },
                { label: "Goedgekeurd", value: changeHistory.length + handled.filter(c => c.status === "accepted").length, color: "#fa6401" },
                { label: "Afgewezen", value: handled.filter(c => c.status === "rejected").length, color: "#4a5568" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: 14, background: "#eff0f5", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#8a94a6", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontWeight: 700, fontSize: 13, color: "#000000", marginBottom: 12 }}>Verwerkte wijzigingen — auditlogboek</div>
            {[...handled, ...changeHistory].length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "#8a94a6", background: "#eff0f5", borderRadius: 8 }}>Nog geen verwerkte wijzigingen</div>
            ) : (
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                <table style={{ ...styles.table, marginBottom: 0 }}>
                  <thead>
                    <tr>{["Status","Gevaar","Type","Wijziging","Bron","Datum","Verwerkt op"].map((h, i) => <th key={i} style={styles.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {[...handled, ...changeHistory].map((c, i) => (
                      <tr key={i}>
                        <td style={styles.td}><span style={{ fontSize: 16 }}>{c.status === "accepted" || c.acceptedDate ? "✓" : "✕"}</span></td>
                        <td style={styles.td}><span style={{ fontWeight: 600 }}>{c.hazardName}</span><br /><span style={{ fontSize: 11, color: "#8a94a6" }}>{c.hazardType}</span></td>
                        <td style={styles.td}><span style={{ fontSize: 11, color: "#4a5568" }}>{c.field}</span></td>
                        <td style={styles.td}>
                          <span style={{ fontFamily: "monospace", fontSize: 12 }}>
                            <span style={{ color: "#dc2626" }}>{c.oldValue}</span> → <span style={{ color: "#fa6401" }}>{c.newValue}</span>
                          </span>
                        </td>
                        <td style={styles.td}><span style={{ fontSize: 11, padding: "2px 7px", background: "#eff0f5", borderRadius: 20, color: "#4a5568" }}>{c.source || "—"}</span></td>
                        <td style={styles.td}><span style={{ fontSize: 12, color: "#8a94a6" }}>{c.date}</span></td>
                        <td style={styles.td}><span style={{ fontSize: 12, color: "#8a94a6" }}>{c.acceptedDate || "—"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── FREQUENTIE ── */}
        {changesTab === "frequency" && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bfdbfe", marginBottom: 20, padding: "14px 18px" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#003855", marginBottom: 4 }}>Herzieningsfrequentie instellen</div>
              <div style={{ fontSize: 13, color: "#003855", lineHeight: 1.6 }}>
                Bepaal hoe vaak wijzigingen vanuit de centrale database worden doorgevoerd in jouw analyse en verificatieplan. Updates worden altijd eerst verzameld in de inbox — pas na jouw goedkeuring worden ze verwerkt.
              </div>
            </div>

            <div style={{ ...styles.card, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Update modus</div>
              {[
                { key: "manual", icon: "◻", label: "Handmatig (op aanvraag)", desc: "Je bepaalt zelf wanneer je de inbox bekijkt en wijzigingen verwerkt. Geen automatische meldingen." },
                { key: "auto", icon: "⚡", label: "Automatisch op schema", desc: "De app herinnert je op de ingestelde datum dat er wijzigingen klaarstaan. Je blijft zelf goedkeuren." },
              ].map(mode => (
                <div key={mode.key} onClick={() => setUpdateMode(mode.key)}
                  style={{ display: "flex", gap: 14, padding: 14, borderRadius: 10, marginBottom: 10, cursor: "pointer", border: `2px solid ${updateMode === mode.key ? "#fa6401" : "#dde0e8"}`, background: updateMode === mode.key ? "#fff8f3" : "#eff0f5" }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{mode.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: updateMode === mode.key ? "#fa6401" : "#003855", marginBottom: 3 }}>{mode.label}</div>
                    <div style={{ fontSize: 12, color: "#4a5568", lineHeight: 1.5 }}>{mode.desc}</div>
                  </div>
                  <div style={{ alignSelf: "center", flexShrink: 0 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${updateMode === mode.key ? "#fa6401" : "#cbd5e1"}`, background: updateMode === mode.key ? "#fa6401" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {updateMode === mode.key && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...styles.card, opacity: updateMode === "auto" ? 1 : 0.4, pointerEvents: updateMode === "auto" ? "auto" : "none" }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Frequentie</div>
              <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 16 }}>Hoe vaak wil je herinnerd worden om de inbox te beoordelen?</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { key: "daily", label: "Dagelijks", desc: "Elke dag om 06:00", icon: "◷" },
                  { key: "weekly", label: "Wekelijks", desc: "Elke maandag", icon: "◫" },
                  { key: "monthly", label: "Maandelijks", desc: "1e dag van de maand", icon: "◧" },
                  { key: "quarterly", label: "Per kwartaal", desc: "1 jan, 1 apr, 1 jul, 1 okt", icon: "▩" },
                  { key: "biannual", label: "Halfjaarlijks", desc: "1 januari en 1 juli", icon: "◫" },
                  { key: "yearly", label: "Jaarlijks", desc: "1 januari", icon: "▦" },
                ].map(freq => (
                  <div key={freq.key} onClick={() => setAutoFrequency(freq.key)}
                    style={{ display: "flex", gap: 10, padding: 12, borderRadius: 8, cursor: "pointer", border: `1.5px solid ${autoFrequency === freq.key ? "#fa6401" : "#dde0e8"}`, background: autoFrequency === freq.key ? "#fff8f3" : "#eff0f5", alignItems: "center" }}>
                    <span style={{ fontSize: 20 }}>{freq.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{freq.label}</div>
                      <div style={{ fontSize: 11, color: "#8a94a6" }}>{freq.desc}</div>
                    </div>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${autoFrequency === freq.key ? "#fa6401" : "#cbd5e1"}`, background: autoFrequency === freq.key ? "#fa6401" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {autoFrequency === freq.key && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {updateMode === "auto" && (
              <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bbf7d0", marginTop: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#003855", marginBottom: 6 }}>Huidige instelling</div>
                <div style={{ fontSize: 13, display: "flex", gap: 20, flexWrap: "wrap" }}>
                  <span><span style={{ color: "#4a5568" }}>Frequentie:</span> <strong>{freqLabels[autoFrequency]}</strong></span>
                  <span><span style={{ color: "#4a5568" }}>Volgende herziening:</span> <strong>{getNextReviewDate()}</strong></span>
                  <span><span style={{ color: "#4a5568" }}>Openstaand:</span> <strong style={{ color: pending.length > 0 ? "#dc2626" : "#003855" }}>{pending.length}</strong></span>
                </div>
                <button style={{ ...styles.btn(), marginTop: 12 }} onClick={() => showNotif("Instellingen opgeslagen")}>Opslaan</button>
              </div>
            )}
          </div>
        )}

        {/* ── BACK-UPS ── */}
        {changesTab === "backups" && (
          <div>
            <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bfdbfe", marginBottom: 20, padding: "14px 18px" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#003855", marginBottom: 6 }}>Back-up strategie</div>
              <div style={{ fontSize: 13, color: "#003855", lineHeight: 1.7 }}>
                Drie lagen: <strong>automatische dagelijkse back-ups</strong> · <strong>versiegeschiedenis per wijziging</strong> (changelog) · <strong>handmatige snapshots</strong>.
              </div>
              <div style={{ marginTop: 10, padding: "8px 12px", background: "#fff", borderRadius: 8, border: "1px solid #dbeafe", fontSize: 12, color: "#4a5568" }}>
                Herstel overschrijft alle huidige data. Maak eerst een handmatige back-up als je de huidige staat wilt bewaren.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
              <div>
                <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bbf7d0", marginBottom: 16, padding: "14px 16px" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: "#003855" }}>Handmatige back-up maken</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={backupNote} onChange={e => setBackupNote(e.target.value)}
                      placeholder="Optionele notitie..."
                      style={{ ...styles.input, flex: 1 }} />
                    <button style={{ ...styles.btn(), whiteSpace: "nowrap" }} onClick={() => {
                      const now = new Date();
                      const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
                      setBackups(prev => [{ id: Date.now(), label: "Handmatige back-up", timestamp: ts, trigger: "manual", size: "43 KB", note: backupNote, status: "ok" }, ...prev]);
                      setBackupNote("");
                      showNotif("✓ Back-up aangemaakt");
                    }}>Nu opslaan</button>
                  </div>
                </div>

                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Beschikbare back-ups ({backups.length})</div>
                {backups.map((b, bi) => (
                  <div key={b.id} style={{ ...styles.card, marginBottom: 8, padding: "12px 16px", borderLeft: `4px solid ${b.trigger === "manual" ? "#fa6401" : "#10b981"}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontSize: 20 }}>{b.trigger === "manual" ? "◻" : "◈"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{b.label}</span>
                          {bi === 0 && <span style={{ fontSize: 10, padding: "1px 7px", background: "#fff8f3", color: "#003855", borderRadius: 20, fontWeight: 700 }}>Meest recent</span>}
                          <span style={{ fontSize: 11, padding: "1px 7px", background: b.trigger === "manual" ? "#fff8f3" : "#fff8f3", color: b.trigger === "manual" ? "#fa6401" : "#003855", borderRadius: 20 }}>
                            {b.trigger === "manual" ? "Handmatig" : "Automatisch"}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#4a5568", marginTop: 2 }}>
                          {b.timestamp} · {b.size}
                          {b.note && <span style={{ marginLeft: 8, fontStyle: "italic", color: "#8a94a6" }}>"{b.note}"</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ ...styles.btn("outline"), padding: "4px 10px", fontSize: 11 }} onClick={() => showNotif(`Back-up van ${b.timestamp} geëxporteerd`)}>⬇ Export</button>
                        <button style={{ ...styles.btn("danger"), padding: "4px 10px", fontSize: 11 }} onClick={() => setShowRestoreConfirm(b)}>↩ Herstel</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ ...styles.card }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Instellingen</div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input type="checkbox" checked={backupSettings.autoEnabled} onChange={e => setBackupSettings(s => ({ ...s, autoEnabled: e.target.checked }))} style={{ width: 16, height: 16 }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>Automatische back-ups</div>
                        <div style={{ fontSize: 11, color: "#4a5568" }}>Dagelijks om 03:00</div>
                      </div>
                    </label>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 6 }}>Frequentie</div>
                    {[{ v: "daily", l: "Dagelijks" }, { v: "weekly", l: "Wekelijks" }, { v: "monthly", l: "Maandelijks" }].map(opt => (
                      <label key={opt.v} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer", opacity: backupSettings.autoEnabled ? 1 : 0.4 }}>
                        <input type="radio" checked={backupSettings.frequency === opt.v} disabled={!backupSettings.autoEnabled} onChange={() => setBackupSettings(s => ({ ...s, frequency: opt.v }))} />
                        <span style={{ fontSize: 13 }}>{opt.l}</span>
                      </label>
                    ))}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 6 }}>Bewaarperiode: <strong>{backupSettings.retentionDays} dagen</strong></div>
                    <input type="range" min={7} max={90} value={backupSettings.retentionDays} onChange={e => setBackupSettings(s => ({ ...s, retentionDays: Number(e.target.value) }))} style={{ width: "100%", opacity: backupSettings.autoEnabled ? 1 : 0.4 }} disabled={!backupSettings.autoEnabled} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8a94a6" }}><span>7d</span><span>90d</span></div>
                  </div>
                  <button style={{ ...styles.btn(), width: "100%" }} onClick={() => showNotif("Instellingen opgeslagen")}>Opslaan</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAdmin = () => (
    <div>
      <div style={styles.pageTitle}>{t.admin.title}</div>

      {/* Admin tab bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "2px solid #e2e8f0", overflowX: "auto" }}>
        {adminTabs.map(tab => (
          <button key={tab.key} onClick={() => setAdminTab(tab.key)}
            style={{ padding: "9px 16px", border: "none", cursor: "pointer", fontSize: 13,
              whiteSpace: "nowrap", background: "none",
              color: adminTab === tab.key ? "#003855" : "#4a5568", fontWeight: adminTab === tab.key ? 700 : 500,
              borderBottom: adminTab === tab.key ? "3px solid #003855" : "3px solid transparent",
              marginBottom: -2 }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* DATABASE TAB */}
      {adminTab === "database" && (
        <div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <input style={{ ...styles.input, maxWidth: 300 }} placeholder="Zoek gevaar of type..." value={dbSearch} onChange={e => setDbSearch(e.target.value)} />
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 12, color: "#8a94a6" }}>{filteredDb.length} gevaren in database</div>
            <button style={styles.btn()} onClick={() => { setEditDbEntry({ ...emptyDbEntry }); setShowDbModal(true); }}>
              + Nieuw gevaar
            </button>
          </div>

          <div style={styles.card}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Gevaar", "Type", "Std. Kans", "Std. Ernst", "Std. Risico", "Wetgeving", "Bijgewerkt", "Bron", "Acties"].map((h, i) => (
                    <th key={i} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDb.map(entry => (
                  <tr key={entry.id} onMouseEnter={e => e.currentTarget.style.background = "#eff0f5"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{entry.name}</div>
                      <div style={{ fontSize: 11, color: "#8a94a6", marginTop: 2 }}>
                        {entry.productContexts.filter(p => p.group && p.group !== "default").map(p => p.group).join(", ") || "—"}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4,
                        background: entry.type === "Microbiologisch" ? "#fef2f2" : entry.type === "Chemisch" ? "#fefce8" : entry.type === "Allergeen" ? "#fff8f3" : "#f0f9ff",
                        color: entry.type === "Microbiologisch" ? "#dc2626" : entry.type === "Chemisch" ? "#fa6401" : entry.type === "Allergeen" ? "#003855" : "#0369a1" }}>
                        {entry.type}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: "center", fontWeight: 700 }}>{entry.defaultProbability}</td>
                    <td style={{ ...styles.td, textAlign: "center", fontWeight: 700 }}>{entry.defaultSeverity}</td>
                    <td style={styles.td}>
                      {getRiskBadge(entry.defaultProbability * entry.defaultSeverity)}
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#4a5568" }}>
                        {entry.legislation_nl.split(";")[0].trim()}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontSize: 11, color: "#8a94a6" }}>{entry.lastUpdated}</td>
                    <td style={styles.td}>
                      <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 20, background: entry.source === "Handmatig ingevoerd" ? "#eff0f5" : "#fff8f3", color: entry.source === "Handmatig ingevoerd" ? "#4a5568" : "#003855" }}>
                        {entry.source}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button style={{ ...styles.btn("outline"), padding: "4px 10px", fontSize: 11 }}
                          onClick={() => { setEditDbEntry({ ...entry }); setShowDbModal(true); }}>Bewerk</button>
                        <button style={{ ...styles.btn("danger"), padding: "4px 10px", fontSize: 11 }}
                          onClick={() => { setDbEntries(prev => prev.filter(e => e.id !== entry.id)); showNotif("Gevaar verwijderd uit database", "error"); }}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCT LINKS TAB */}
      {adminTab === "productlinks" && (
        <div>
          <div style={{ ...styles.card, marginBottom: 16, background: "#fff8f3", border: "1px solid #bfdbfe" }}>
            <div style={{ fontSize: 13, color: "#003855" }}>
              <strong>Productgroepkoppelingen</strong> bepalen welke specifieke informatie wordt getoond wanneer een gebruiker op een gevaar klikt dat gelinkt is aan een bepaalde grondstof of groep.
            </div>
          </div>
          {filteredDb.map(entry => (
            <div key={entry.id} style={{ ...styles.card, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{entry.name}
                  <span style={{ fontSize: 12, fontWeight: 400, color: "#4a5568", marginLeft: 8 }}>{entry.type}</span>
                </div>
                <button style={{ ...styles.btn("outline"), fontSize: 12, padding: "4px 12px" }}
                  onClick={() => {
                    const updated = { ...entry, productContexts: [...entry.productContexts, { group: "", text_nl: "", text_en: "" }] };
                    setDbEntries(prev => prev.map(e => e.id === entry.id ? updated : e));
                  }}>+ Voeg productgroep toe</button>
              </div>
              {entry.productContexts.map((ctx, ci) => (
                <div key={ci} style={{ display: "grid", gridTemplateColumns: "180px 1fr 40px", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                  <input style={styles.input} placeholder="Productgroep (bv. Bladgroenten)" value={ctx.group}
                    onChange={e => {
                      const updated = { ...entry, productContexts: entry.productContexts.map((c, i) => i === ci ? { ...c, group: e.target.value } : c) };
                      setDbEntries(prev => prev.map(en => en.id === entry.id ? updated : en));
                    }} />
                  <textarea style={{ ...styles.input, resize: "vertical", minHeight: 56, fontFamily: "inherit", lineHeight: 1.5 }}
                    placeholder="Productspecifieke beschrijving (NL)..."
                    value={ctx.text_nl}
                    onChange={e => {
                      const updated = { ...entry, productContexts: entry.productContexts.map((c, i) => i === ci ? { ...c, text_nl: e.target.value } : c) };
                      setDbEntries(prev => prev.map(en => en.id === entry.id ? updated : en));
                    }} />
                  <button onClick={() => {
                    const updated = { ...entry, productContexts: entry.productContexts.filter((_, i) => i !== ci) };
                    setDbEntries(prev => prev.map(en => en.id === entry.id ? updated : en));
                  }} style={{ ...styles.btn("danger"), padding: "6px 10px", alignSelf: "center" }}>✕</button>
                </div>
              ))}
              <button style={{ ...styles.btn("primary"), fontSize: 12, padding: "5px 14px" }} onClick={() => showNotif(`${entry.name} koppelingen opgeslagen`)}>Opslaan</button>
            </div>
          ))}
        </div>
      )}

      {/* RASFF TAB */}
      {adminTab === "rasff" && (
        <div style={styles.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>RASFF Meldingen</div>
            <button style={styles.btn()} onClick={() => showNotif("RASFF gesynchroniseerd")}>Synchroniseer RASFF</button>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>{["Datum", "Product", "Gevaar", "Ernst", "Status", "Actie"].map((h, i) => <th key={i} style={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rasffAlerts.map(a => (
                <tr key={a.id} onMouseEnter={e => e.currentTarget.style.background = "#eff0f5"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <td style={{ ...styles.td, fontSize: 12, color: "#4a5568" }}>{a.date}</td>
                  <td style={styles.td}>{a.product}</td>
                  <td style={styles.td}>{a.hazard}</td>
                  <td style={styles.td}><span style={styles.badge(a.severity === "Hoog" ? "red" : a.severity === "Gemiddeld" ? "orange" : "yellow")}>{a.severity}</span></td>
                  <td style={styles.td}><span style={{ fontSize: 12, color: a.status === "Nieuw" ? "#dc2626" : "#4a5568", fontWeight: a.status === "Nieuw" ? 700 : 400 }}>{a.status}</span></td>
                  <td style={styles.td}>
                    <button style={{ ...styles.btn("outline"), fontSize: 11, padding: "3px 10px" }} onClick={() => showNotif("Melding verwerkt — kanswaarde bijgewerkt")}>Verwerk → DB</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SYNC TAB */}
      {adminTab === "sync" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { icon: "▷", label: "EUR-Lex Wetgeving", lastSync: "2025-03-01", desc: "Automatisch ophalen van nieuwe en gewijzigde EU-verordeningen relevant voor levensmiddelenveiligheid.", action: "Synchroniseer EUR-Lex", color: "#fff8f3", border: "#fbc99a" },
            { icon: "◎", label: "RASFF Feed", lastSync: "2025-03-08", desc: "Real-time meldingen van het Rapid Alert System for Food and Feed van de Europese Commissie.", action: "Synchroniseer RASFF", color: "#fff8f3", border: "#fbc99a" },
            { icon: "▤", label: "Nederlandse Warenwet", lastSync: "2025-02-15", desc: "Nationale aanvullingen op EU-wetgeving via wetten.overheid.nl.", action: "Synchroniseer NL Wetgeving", color: "#fff8f3", border: "#fbc99a" },
            { icon: "◈", label: "EFSA Database", lastSync: "2025-02-01", desc: "Wetenschappelijke adviezen en risicobeoordelingen van de European Food Safety Authority.", action: "Synchroniseer EFSA", color: "#fff8f3", border: "#e9d5ff" },
          ].map((item, i) => (
            <div key={i} style={{ ...styles.card, background: item.color, border: `1px solid ${item.border}` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#8a94a6" }}>Laatste sync: {item.lastSync}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#000000", lineHeight: 1.6, marginBottom: 14 }}>{item.desc}</p>
              <button style={styles.btn()} onClick={() => showNotif(`${item.label} gesynchroniseerd`)}>{item.action}</button>
            </div>
          ))}
        </div>
      )}

      {/* SUGGESTIONS TAB */}
      {adminTab === "suggestions" && (
        <div>
          <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #fed7aa", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#003855" }}>
              <strong>Update voorstellen</strong> worden automatisch gegenereerd op basis van nieuwe RASFF-meldingen en gewijzigde wetgeving. Verwerk ze om de database actueel te houden.
            </div>
          </div>
          {[
            { text: "Salmonella: drempelwaarde gewijzigd in EC 2073/2005 amendement (feb 2025)", type: "Wetgeving", urgent: true, action: "Ernst aanpassen van 4 → 5" },
            { text: "5 nieuwe RASFF-meldingen voor verse spinazie (Salmonella) — overweeg kansverhoging", type: "RASFF", urgent: true, action: "Kans aanpassen van 2 → 3 voor Bladgroenten" },
            { text: "Nieuwe allergenenverordening — sesam toegevoegd als verplicht te vermelden allergeen (EU 2023/1426)", type: "Wetgeving", urgent: false, action: "Nieuw gevaar toevoegen: Sesam" },
            { text: "EFSA herziening mycotoxinen in granen — DON-normen aangescherpt", type: "EFSA", urgent: false, action: "Wetgeving bijwerken voor Mycotoxinen" },
          ].map((s, i) => (
            <div key={i} style={{ ...styles.card, marginBottom: 10, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={styles.badge(s.urgent ? "orange" : "yellow")}>{s.type}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#000000", marginBottom: 4 }}>{s.text}</div>
                <div style={{ fontSize: 12, color: "#4a5568" }}>→ Voorgestelde actie: <em>{s.action}</em></div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button style={{ ...styles.btn(), padding: "5px 12px", fontSize: 12 }} onClick={() => showNotif("Voorstel verwerkt en database bijgewerkt")}>✓ Verwerk</button>
                <button style={{ ...styles.btn("secondary"), padding: "5px 12px", fontSize: 12 }} onClick={() => showNotif("Voorstel genegeerd")}>✕ Negeer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SETTINGS TAB */}
      {adminTab === "settings" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            {/* Update mode */}
            <div style={styles.card}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Update modus</div>
              <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 16, lineHeight: 1.5 }}>
                Kies hoe de gevarenanalyse bijgewerkt wordt wanneer er nieuwe informatie beschikbaar is in de database.
              </div>
              {[
                { key: "manual", icon: "◻", label: "Handmatig (op aanvraag)", desc: "U ontvangt een melding bij nieuwe updates. U beslist zelf wanneer u de analyse bijwerkt door de wijzigingen te beoordelen en goed te keuren." },
                { key: "auto", icon: "⚡", label: "Automatisch", desc: "De analyse wordt automatisch bijgewerkt op basis van de ingestelde frequentie. Wijzigingen worden direct verwerkt, maar blijven zichtbaar in het auditlogboek." },
              ].map(mode => (
                <div key={mode.key} onClick={() => setUpdateMode(mode.key)}
                  style={{ display: "flex", gap: 12, padding: 14, borderRadius: 10, marginBottom: 10, cursor: "pointer", border: `2px solid ${updateMode === mode.key ? "#fa6401" : "#dde0e8"}`, background: updateMode === mode.key ? "#fff8f3" : "#eff0f5" }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{mode.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: updateMode === mode.key ? "#fa6401" : "#003855", marginBottom: 4 }}>{mode.label}</div>
                    <div style={{ fontSize: 12, color: "#4a5568", lineHeight: 1.5 }}>{mode.desc}</div>
                  </div>
                  <div style={{ marginLeft: "auto", flexShrink: 0, alignSelf: "center" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${updateMode === mode.key ? "#fa6401" : "#cbd5e1"}`, background: updateMode === mode.key ? "#fa6401" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {updateMode === mode.key && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Frequency (only when auto) */}
            <div style={{ ...styles.card, opacity: updateMode === "auto" ? 1 : 0.4, pointerEvents: updateMode === "auto" ? "auto" : "none" }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Update frequentie</div>
              <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 16, lineHeight: 1.5 }}>
                Hoe vaak wordt de analyse automatisch vergeleken met de meest recente database?
              </div>
              {[
                { key: "daily", label: "Dagelijks", desc: "Elke dag om 06:00 uur", icon: "◷" },
                { key: "weekly", label: "Wekelijks", desc: "Elke maandag om 06:00 uur", icon: "◫" },
                { key: "monthly", label: "Maandelijks", desc: "Eerste dag van de maand", icon: "◧" },
                { key: "quarterly", label: "Per kwartaal", desc: "1 jan, 1 apr, 1 jul, 1 okt", icon: "▩" },
                { key: "biannual", label: "Halfjaarlijks", desc: "1 januari en 1 juli", icon: "◫" },
                { key: "yearly", label: "Jaarlijks", desc: "1 januari om 06:00 uur", icon: "▦" },
              ].map(freq => (
                <div key={freq.key} onClick={() => setAutoFrequency(freq.key)}
                  style={{ display: "flex", gap: 10, padding: 12, borderRadius: 8, marginBottom: 8, cursor: "pointer", border: `1.5px solid ${autoFrequency === freq.key ? "#fa6401" : "#dde0e8"}`, background: autoFrequency === freq.key ? "#fff8f3" : "#eff0f5", alignItems: "center" }}>
                  <span style={{ fontSize: 18 }}>{freq.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{freq.label}</div>
                    <div style={{ fontSize: 11, color: "#8a94a6" }}>{freq.desc}</div>
                  </div>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${autoFrequency === freq.key ? "#fa6401" : "#cbd5e1"}`, background: autoFrequency === freq.key ? "#fa6401" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {autoFrequency === freq.key && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification preferences */}
          <div style={styles.card}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Meldingsvoorkeuren</div>
            <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 16 }}>Hoe wilt u op de hoogte gesteld worden van wijzigingen?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { icon: "●", label: "Melding bij inloggen", desc: "Oranje banner bovenaan de pagina direct na inloggen", always: true },
                { icon: "▣", label: "Wijzigingenoverzicht", desc: "Overzichtspagina met alle wijzigingen, oud vs. nieuw, per gevaar", always: true },
                { icon: "◷", label: "Markering op gevaar", desc: "'Bijgewerkt op [datum]' label direct op het gevaar in de analyse", always: true },
              ].map((item, i) => (
                <div key={i} style={{ padding: 14, borderRadius: 8, border: "2px solid #2563eb", background: "#fff8f3" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 13, color: "#fa6401" }}>{item.label}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, padding: "1px 6px", background: "#fa6401", color: "#fff", borderRadius: 20 }}>Altijd aan</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#4a5568", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Current status */}
          <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bbf7d0" }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: "#003855" }}>Huidige instellingen</div>
            <div style={{ display: "flex", gap: 20, fontSize: 13, flexWrap: "wrap" }}>
              <div><span style={{ color: "#4a5568" }}>Update modus:</span> <strong>{updateMode === "manual" ? "Handmatig (op aanvraag)" : "Automatisch"}</strong></div>
              {updateMode === "auto" && <div><span style={{ color: "#4a5568" }}>Frequentie:</span> <strong>{{ daily: "Dagelijks", weekly: "Wekelijks", monthly: "Maandelijks", quarterly: "Per kwartaal", biannual: "Halfjaarlijks", yearly: "Jaarlijks" }[autoFrequency]}</strong></div>}
              <div><span style={{ color: "#4a5568" }}>Openstaande updates:</span> <strong style={{ color: pendingCount > 0 ? "#dc2626" : "#003855" }}>{pendingCount}</strong></div>
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button style={styles.btn()} onClick={() => showNotif("Instellingen opgeslagen")}>Instellingen opslaan</button>
              {pendingCount > 0 && <button style={{ ...styles.btn("outline") }} onClick={() => setShowUpdateInbox(true)}>Bekijk openstaande updates ({pendingCount})</button>}
            </div>
          </div>
        </div>
      )}

      {/* DB ENTRY EDIT MODAL */}
      {showDbModal && editDbEntry && (
        <div style={styles.modal} onClick={() => setShowDbModal(false)}>
          <div style={{ ...styles.modalBox, minWidth: 680, maxWidth: 780 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              {editDbEntry.id ? "Gevaar bewerken" : "+ Nieuw gevaar toevoegen"}
            </div>
            <div style={{ fontSize: 12, color: "#8a94a6", marginBottom: 20 }}>
              Alle velden zijn beschikbaar in de detailweergave wanneer gebruikers op een gevaar klikken.
            </div>

            {/* Basisgegevens */}
            <div style={{ fontWeight: 700, fontSize: 12, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Basisgegevens</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Naam gevaar *</label>
                <input style={styles.input} value={editDbEntry.name} onChange={e => setEditDbEntry(d => ({ ...d, name: e.target.value }))} placeholder="bv. Salmonella spp." />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Type *</label>
                <select style={{ ...styles.select, width: "100%" }} value={editDbEntry.type} onChange={e => setEditDbEntry(d => ({ ...d, type: e.target.value }))}>
                  {["Microbiologisch", "Chemisch", "Fysisch", "Allergeen"].map(ht => <option key={ht}>{ht}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Standaard kans (1–5)</label>
                <input type="number" min="1" max="5" style={styles.input} value={editDbEntry.defaultProbability} onChange={e => setEditDbEntry(d => ({ ...d, defaultProbability: Number(e.target.value) }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Standaard ernst (1–5)</label>
                <input type="number" min="1" max="5" style={styles.input} value={editDbEntry.defaultSeverity} onChange={e => setEditDbEntry(d => ({ ...d, defaultSeverity: Number(e.target.value) }))} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Wetgeving (meerdere: scheiden met ;)</label>
                <input style={styles.input} value={editDbEntry.legislation_nl} onChange={e => setEditDbEntry(d => ({ ...d, legislation_nl: e.target.value }))} placeholder="bv. EC 2073/2005; EC 2160/2003" />
              </div>
            </div>

            {/* Beschrijvingen */}
            <div style={{ fontWeight: 700, fontSize: 12, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Beschrijving (NL)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Algemene omschrijving</label>
                <textarea style={{ ...styles.input, resize: "vertical", minHeight: 80, fontFamily: "inherit", lineHeight: 1.5 }} value={editDbEntry.general_nl} onChange={e => setEditDbEntry(d => ({ ...d, general_nl: e.target.value }))} placeholder="Wetenschappelijke omschrijving van het gevaar..." />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Bronnen / herkomst</label>
                <textarea style={{ ...styles.input, resize: "vertical", minHeight: 80, fontFamily: "inherit", lineHeight: 1.5 }} value={editDbEntry.sources_nl} onChange={e => setEditDbEntry(d => ({ ...d, sources_nl: e.target.value }))} placeholder="Waar komt dit gevaar vandaan..." />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Incubatietijd</label>
                <input style={styles.input} value={editDbEntry.incubation_nl} onChange={e => setEditDbEntry(d => ({ ...d, incubation_nl: e.target.value }))} placeholder="bv. 6 tot 72 uur" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Duur ziekte</label>
                <input style={styles.input} value={editDbEntry.duration_nl} onChange={e => setEditDbEntry(d => ({ ...d, duration_nl: e.target.value }))} placeholder="bv. 4 tot 7 dagen" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Risicogroepen (scheiden met ;)</label>
                <input style={styles.input} value={editDbEntry.riskGroups_nl} onChange={e => setEditDbEntry(d => ({ ...d, riskGroups_nl: e.target.value }))} placeholder="bv. Ouderen; Kinderen <5 jaar; Zwangere vrouwen" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Gevolgen voor consument (één per regel)</label>
                <textarea style={{ ...styles.input, resize: "vertical", minHeight: 80, fontFamily: "inherit", lineHeight: 1.5 }} value={editDbEntry.consumerEffects_nl} onChange={e => setEditDbEntry(d => ({ ...d, consumerEffects_nl: e.target.value }))} placeholder={"Gastro-enteritis\nKoorts en buikkrampen\n..."} />
              </div>
            </div>

            {/* Standaard risico preview */}
            <div style={{ padding: "10px 14px", background: "#eff0f5", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 20, display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
              <span style={{ color: "#4a5568" }}>Standaard risicoscore:</span>
              <strong style={{ fontSize: 18, color: getRiskColor(editDbEntry.defaultProbability * editDbEntry.defaultSeverity) }}>
                {editDbEntry.defaultProbability * editDbEntry.defaultSeverity}
              </strong>
              {getRiskBadge(editDbEntry.defaultProbability * editDbEntry.defaultSeverity)}
              <span style={{ fontSize: 11, color: "#8a94a6" }}>({editDbEntry.defaultProbability} × {editDbEntry.defaultSeverity})</span>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button style={styles.btn("secondary")} onClick={() => setShowDbModal(false)}>{t.common.cancel}</button>
              <button style={styles.btn()} onClick={() => {
                if (editDbEntry.id) {
                  setDbEntries(prev => prev.map(e => e.id === editDbEntry.id ? { ...editDbEntry, lastUpdated: new Date().toISOString().slice(0,10) } : e));
                  showNotif("Gevaar bijgewerkt in database");
                } else {
                  setDbEntries(prev => [...prev, { ...editDbEntry, id: Date.now(), lastUpdated: new Date().toISOString().slice(0,10) }]);
                  showNotif("Nieuw gevaar toegevoegd aan database");
                }
                setShowDbModal(false);
              }}>{t.common.save}</button>
            </div>
          </div>
        </div>
      )}
      {/* BACKUPS TAB */}
      {adminTab === "backups" && (
        <div>
          {/* Info banner */}
          <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bfdbfe", marginBottom: 20, padding: "14px 18px" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#003855", marginBottom: 6 }}>Back-up strategie</div>
            <div style={{ fontSize: 13, color: "#003855", lineHeight: 1.7 }}>
              Drie lagen van beveiliging: <strong>automatische dagelijkse back-ups</strong> · <strong>versiegeschiedenis per wijziging</strong> (auditlogboek) · <strong>handmatige snapshots</strong> voor grote updates.
              Bij een crash kan je de database herstellen naar elke opgeslagen versie.
            </div>
            <div style={{ marginTop: 10, padding: "8px 12px", background: "#fff", borderRadius: 8, border: "1px solid #dbeafe", fontSize: 12, color: "#4a5568" }}>
              <strong>Let op:</strong> Herstel vanuit een back-up overschrijft alle huidige data. Dit kan niet ongedaan worden gemaakt. Maak eerst een handmatige back-up als je de huidige staat wilt bewaren.
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
            {/* Left: backup list */}
            <div>
              {/* Manual backup row */}
              <div style={{ ...styles.card, background: "#fff8f3", border: "1px solid #bbf7d0", marginBottom: 16, padding: "14px 16px" }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: "#003855" }}>Handmatige back-up maken</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input value={backupNote} onChange={e => setBackupNote(e.target.value)}
                    placeholder="Optionele notitie (bijv. 'voor import nieuwe leveranciers')"
                    style={{ ...styles.input, flex: 1 }} />
                  <button style={{ ...styles.btn(), whiteSpace: "nowrap" }} onClick={() => {
                    const now = new Date();
                    const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
                    setBackups(prev => [{ id: Date.now(), label: "Handmatige back-up", timestamp: ts, trigger: "manual", size: "43 KB", note: backupNote, status: "ok" }, ...prev]);
                    setBackupNote("");
                    showNotif("✓ Back-up aangemaakt");
                  }}>Back-up nu maken</button>
                </div>
              </div>

              {/* Backup list */}
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: "#000000" }}>Beschikbare back-ups ({backups.length})</div>
              {backups.map((b, bi) => (
                <div key={b.id} style={{ ...styles.card, marginBottom: 8, padding: "12px 16px",
                  borderLeft: `4px solid ${b.trigger === "manual" ? "#fa6401" : "#10b981"}`,
                  background: bi === 0 ? "#eff0f5" : "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 20 }}>{b.trigger === "manual" ? "◻" : "◈"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{b.label}</span>
                        {bi === 0 && <span style={{ fontSize: 10, padding: "1px 7px", background: "#fff8f3", color: "#003855", borderRadius: 20, fontWeight: 700 }}>Meest recent</span>}
                        <span style={{ fontSize: 11, padding: "1px 7px", background: b.trigger === "manual" ? "#fff8f3" : "#fff8f3",
                          color: b.trigger === "manual" ? "#fa6401" : "#003855", borderRadius: 20 }}>
                          {b.trigger === "manual" ? "Handmatig" : "Automatisch"}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#4a5568", marginTop: 2 }}>
                        {b.timestamp} · {b.size}
                        {b.note && <span style={{ marginLeft: 8, color: "#8a94a6", fontStyle: "italic" }}>"{b.note}"</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ ...styles.btn("outline"), padding: "5px 12px", fontSize: 12 }}
                        onClick={() => showNotif(`Back-up van ${b.timestamp} gedownload`)}>⬇ Export</button>
                      <button style={{ ...styles.btn("danger"), padding: "5px 12px", fontSize: 12 }}
                        onClick={() => setShowRestoreConfirm(b)}>↩ Herstel</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: settings */}
            <div>
              <div style={{ ...styles.card, padding: "16px" }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: "#000000" }}>Back-up instellingen</div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <input type="checkbox" checked={backupSettings.autoEnabled}
                      onChange={e => setBackupSettings(s => ({ ...s, autoEnabled: e.target.checked }))}
                      style={{ width: 16, height: 16 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>Automatische back-ups</div>
                      <div style={{ fontSize: 11, color: "#4a5568" }}>Dagelijks om 03:00 's nachts</div>
                    </div>
                  </label>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 6 }}>Frequentie</div>
                  {[{ v: "daily", l: "Dagelijks" }, { v: "weekly", l: "Wekelijks" }, { v: "monthly", l: "Maandelijks" }].map(opt => (
                    <label key={opt.v} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, cursor: "pointer", opacity: backupSettings.autoEnabled ? 1 : 0.4 }}>
                      <input type="radio" checked={backupSettings.frequency === opt.v} disabled={!backupSettings.autoEnabled}
                        onChange={() => setBackupSettings(s => ({ ...s, frequency: opt.v }))} />
                      <span style={{ fontSize: 13 }}>{opt.l}</span>
                    </label>
                  ))}
                </div>

                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, color: "#4a5568", marginBottom: 6 }}>Bewaarperiode: <strong>{backupSettings.retentionDays} dagen</strong></div>
                  <input type="range" min={7} max={90} step={1} value={backupSettings.retentionDays}
                    onChange={e => setBackupSettings(s => ({ ...s, retentionDays: Number(e.target.value) }))}
                    style={{ width: "100%", opacity: backupSettings.autoEnabled ? 1 : 0.4 }}
                    disabled={!backupSettings.autoEnabled} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8a94a6" }}>
                    <span>7 dagen</span><span>90 dagen</span>
                  </div>
                </div>

                <button style={{ ...styles.btn(), width: "100%" }}
                  onClick={() => showNotif("Back-up instellingen opgeslagen")}>Instellingen opslaan</button>

                <div style={{ marginTop: 16, padding: "10px 12px", background: "#eff0f5", borderRadius: 8, fontSize: 12, color: "#4a5568", lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 600, color: "#000000", marginBottom: 4 }}>ℹ Na Supabase koppeling</div>
                  Automatische back-ups worden opgeslagen in Supabase Storage. Point-in-Time Recovery (PITR) biedt extra beveiliging op databaseniveau. De bewaarperiode is instelbaar per plan.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── INSTELLINGEN TAB ── */}
      {adminTab === "instellingen" && (
        <div style={{ maxWidth: 680 }}>
          <div style={{ ...styles.card, marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: "#003855" }}>Risicomatrix</div>
            <div style={{ fontSize: 13, color: "#4a5568", marginBottom: 16, lineHeight: 1.6 }}>
              De app gebruikt de <strong>4×5 matrix</strong>: Kans (1–4) × Ernst (0–4) = score 0–16, met 3 risiconiveaus.
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[["Laag","0–4","#dcfce7","#16a34a"],["Midden","5–9","#ffedd5","#ea580c"],["Hoog","10–16","#fee2e2","#dc2626"]].map(([l,r,bg,fg]) => (
                <span key={l} style={{ padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: bg, color: fg }}>{l} ({r})</span>
              ))}
            </div>
            <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(4, 28px)", gap: 2 }}>
              {Array.from({ length: 5 }, (_, si) => 4 - si).flatMap(s =>
                Array.from({ length: 4 }, (_, pi) => pi + 1).map(p => {
                  const r = p * s;
                  const { bg, fg } = getRiskColorsForMatrix(r, "4x5");
                  return <div key={`${p}-${s}`} style={{ width: 28, height: 28, borderRadius: 3, background: bg,
                    border: "1px solid #dde0e8", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 600, color: fg }}>{r}</div>;
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Restore confirm modal */}
      {showRestoreConfirm && (
        <div style={styles.modal} onClick={() => setShowRestoreConfirm(null)}>
          <div style={{ ...styles.modalBox, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 32, textAlign: "center", marginBottom: 12 }}>!</div>
            <div style={{ fontWeight: 800, fontSize: 16, textAlign: "center", marginBottom: 8 }}>Database herstellen?</div>
            <div style={{ fontSize: 13, color: "#4a5568", textAlign: "center", marginBottom: 16, lineHeight: 1.6 }}>
              Je staat op het punt de database te herstellen naar de versie van<br />
              <strong style={{ color: "#003855" }}>{showRestoreConfirm.timestamp}</strong>.<br />
              Alle huidige data wordt <strong style={{ color: "#dc2626" }}>overschreven</strong>. Dit kan niet ongedaan worden gemaakt.
            </div>
            <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 12, color: "#991b1b", marginBottom: 20 }}>
              Tip: klik Annuleren en maak eerst een handmatige back-up als je de huidige staat wilt bewaren.
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button style={styles.btn("secondary")} onClick={() => setShowRestoreConfirm(null)}>Annuleren</button>
              <button style={styles.btn("danger")} onClick={() => {
                setShowRestoreConfirm(null);
                showNotif(`✓ Database hersteld naar versie van ${showRestoreConfirm.timestamp}`);
              }}>↩ Ja, herstel naar deze versie</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="30" height="44" viewBox="0 0 100 148" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Hoofd */}
              <circle cx="50" cy="22" r="16" stroke="white" strokeWidth="5" fill="none"/>
              {/* Nek */}
              <line x1="50" y1="38" x2="50" y2="50" stroke="white" strokeWidth="5" strokeLinecap="round"/>
              {/* Bovenlijf */}
              <path d="M14 62 Q14 50 50 50 Q86 50 86 62 L86 100 Q86 106 80 106 L20 106 Q14 106 14 100 Z" stroke="white" strokeWidth="5" fill="none" strokeLinejoin="round"/>
              {/* Taille lijn */}
              <path d="M20 88 Q35 93 50 88 Q65 83 80 88" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
              {/* Linker arm + bicep */}
              <line x1="14" y1="62" x2="2" y2="48" stroke="white" strokeWidth="5" strokeLinecap="round"/>
              <ellipse cx="0" cy="41" rx="10" ry="6.5" stroke="white" strokeWidth="4" fill="none" transform="rotate(-25 0 41)"/>
              <line x1="-5" y1="36" x2="4" y2="23" stroke="white" strokeWidth="5" strokeLinecap="round"/>
              <rect x="-1" y="14" width="14" height="11" rx="3.5" stroke="white" strokeWidth="3.5" fill="none"/>
              {/* Rechter arm + bicep */}
              <line x1="86" y1="62" x2="98" y2="48" stroke="white" strokeWidth="5" strokeLinecap="round"/>
              <ellipse cx="100" cy="41" rx="10" ry="6.5" stroke="white" strokeWidth="4" fill="none" transform="rotate(25 100 41)"/>
              <line x1="105" y1="36" x2="96" y2="23" stroke="white" strokeWidth="5" strokeLinecap="round"/>
              <rect x="87" y="14" width="14" height="11" rx="3.5" stroke="white" strokeWidth="3.5" fill="none"/>
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={styles.sidebarTitle}>G3 Insight</div>
              <div style={{ color: "#fa6401", fontSize: 11, fontWeight: 700, letterSpacing: "0.03em" }}>by Preach-on</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "16px 0", flex: 1 }}>
          {navItems.map(item => (
            <div key={item.key} onClick={() => setActiveNav(item.key)} style={styles.navItem(activeNav === item.key)}>
              <span style={{ width: 18, textAlign: "center", flexShrink: 0, fontSize: 15, opacity: 0.9 }}>{item.icon}</span>
              {item.label}
              {item.badge && <span style={{ marginLeft: "auto", fontSize: 10, padding: "1px 7px", background: "#dc2626", color: "#fff", borderRadius: 20, fontWeight: 700 }}>{item.badge}</span>}
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1e293b" }}>
          <div style={{ fontSize: 11, color: "#000000", marginBottom: 8 }}>TAAL / LANGUAGE</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["nl", "en"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ flex: 1, padding: "5px", borderRadius: 5, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: lang === l ? "#fa6401" : "#003855", color: lang === l ? "#fff" : "#8a94a6" }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <div style={styles.topBar}>
          <div style={{ fontSize: 13, color: "#4a5568" }}>
            {navItems.find(n => n.key === activeNav)?.label}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 12, padding: "4px 10px", background: "#fff8f3", color: "#003855", borderRadius: 20, border: "1px solid #bbf7d0" }}>
              ✓ {legislation === "eu" ? t.hazards.euOnly : t.hazards.euNl}
            </span>
            {/* Pending changes badge */}
            {pendingCount > 0 && (
              <button onClick={() => setShowUpdateInbox(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, border: "1.5px solid #f97316", background: "#fff8f3", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#fa6401" }}>
                {pendingCount} update{pendingCount > 1 ? "s" : ""} beschikbaar
              </button>
            )}

            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fa6401", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>A</div>
          </div>
        </div>

        <div style={styles.content}>
          {activeNav === "dashboard" && renderDashboard()}
          {activeNav === "ingredients" && renderIngredients()}
          {activeNav === "hazards" && renderHazards()}
          {activeNav === "fraud" && renderFraud()}
          {activeNav === "verification" && renderVerification()}
          {activeNav === "reports" && renderReports()}
          {activeNav === "changes" && renderChanges()}
          {activeNav === "admin" && renderAdmin()}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div style={styles.modal} onClick={() => setShowImportModal(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t.ingredients.import}</div>
            <div style={{ fontSize: 13, color: "#4a5568", marginBottom: 16 }}>Importeer een CSV of Excel-bestand met je grondstoffen.</div>

            {/* Template download */}
            <div style={{ background: "#fff8f3", border: "1px solid #bfdbfe", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#003855", marginBottom: 6 }}>Template gebruiken</div>
              <div style={{ fontSize: 12, color: "#003855", marginBottom: 10, lineHeight: 1.6 }}>
                Download het template, vul je grondstoffen in en upload het terug. Samengestelde producten (bijv. satesaus) vul je in via de kolom <strong>ingredienten</strong> in het formaat:<br />
                <code style={{ background: "#fde8d4", padding: "1px 6px", borderRadius: 4 }}>Pinda's (Noten & zaden); Suiker (Zoetstoffen)</code>
              </div>
              <button style={{ ...styles.btn(), fontSize: 12 }} onClick={downloadTemplate}>⬇ Download template (.xlsx)</button>
            </div>

            {/* Drop zone */}
            <div style={{ border: "2px dashed #e2e8f0", borderRadius: 10, padding: 32, textAlign: "center", marginBottom: 16, cursor: "pointer", background: "#eff0f5" }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) processImportFile(f); }}>
              <div style={{ fontSize: 32, marginBottom: 8, color: "#003855" }}>◫</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#000000" }}>Sleep bestand hiernaartoe of klik om te bladeren</div>
              <div style={{ fontSize: 12, color: "#8a94a6", marginTop: 4 }}>CSV, XLSX, XLS — max. 10MB</div>
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }}
                onChange={e => { const f = e.target.files[0]; if (f) processImportFile(f); e.target.value = ""; }} />
            </div>

            {/* Kolom uitleg */}
            <div style={{ background: "#eff0f5", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#4a5568" }}>
              <div style={{ fontWeight: 600, color: "#000000", marginBottom: 6 }}>Verwachte kolommen</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 12px" }}>
                {[["artikelnaam", "verplicht"], ["artikelnummer", "optioneel"], ["leverancier", "optioneel"], ["ingredienten (bij samengestelde producten)", "optioneel — leeg laten als enkelvoudig"]].map(([k, v]) => (
                  <div key={k}><strong>{k}</strong> <span style={{ color: "#8a94a6" }}>— {v}</span></div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff8f3", border: "1px solid #bbf7d0", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 12, color: "#003855" }}>
              <strong>AI-groepsindeling:</strong> Na het importeren doet de app automatisch een voorstel voor logische groepsindeling.
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button style={styles.btn("secondary")} onClick={() => setShowImportModal(false)}>{t.common.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* Group Suggestion Modal */}
      {showGroupSuggestion && (
        <div style={styles.modal} onClick={() => setShowGroupSuggestion(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>AI-groepsindeling voorstel</div>
            <div style={{ fontSize: 13, color: "#4a5568", marginBottom: 16 }}>Op basis van uw grondstoffen stelt de app de volgende indeling voor:</div>
            {[["Bladgroenten", ["Sla (ijsbergsla)", "Spinazie vers", "Rucola"]], ["Gevogelte", ["Kipfilet vers", "Kalkoenfilet"]], ["Tarweproducten", ["Tarwebloem", "Tarwezemelen"]]].map(([group, items], i) => (
              <div key={i} style={{ marginBottom: 12, padding: 12, background: "#eff0f5", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#003855" }}>{group}</div>
                {items.map((item, j) => <div key={j} style={{ fontSize: 12, color: "#4a5568", padding: "2px 0" }}>· {item}</div>)}
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <button style={styles.btn("secondary")} onClick={() => setShowGroupSuggestion(false)}>{t.common.cancel}</button>
              <button style={styles.btn()} onClick={() => { setShowGroupSuggestion(false); showNotif("Groepsindeling toegepast"); }}>{t.common.confirm}</button>
            </div>
          </div>
        </div>
      )}

      {/* Hazard Edit Modal */}
      {showHazardModal && editHazard && (
        <div style={styles.modal} onClick={() => setShowHazardModal(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{editHazard.id ? "Gevaar bewerken" : "Gevaar toevoegen"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Gevaartype</label>
                <select style={{ ...styles.select, width: "100%" }} value={editHazard.hazardType} onChange={e => setEditHazard(h => ({ ...h, hazardType: e.target.value }))}>
                  {["Microbiologisch","Chemisch","Fysisch","Allergeen"].map(type => <option key={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Wetgeving</label>
                <input style={styles.input} value={editHazard.legislation} onChange={e => setEditHazard(h => ({ ...h, legislation: e.target.value }))} placeholder="bv. EC 2073/2005" />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Gevaar omschrijving</label>
              <input style={styles.input} value={editHazard.hazard} onChange={e => setEditHazard(h => ({ ...h, hazard: e.target.value }))} placeholder="bv. Salmonella spp." />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 8 }}>Kans × Ernst matrix (klik om te selecteren)</label>
              <RiskMatrix
                probability={editHazard.probability} severity={editHazard.severity}
                onChangeProbability={p => setEditHazard(h => ({ ...h, probability: p }))}
                onChangeSeverity={s => setEditHazard(h => ({ ...h, severity: s }))}
                t={t} matrixType="4x5" />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button style={styles.btn("secondary")} onClick={() => setShowHazardModal(false)}>{t.common.cancel}</button>
              <button style={styles.btn()} onClick={() => {
                const isNew = !editHazard.id;
                const newItem = isNew ? { ...editHazard, id: Date.now() } : editHazard;
                if (!isNew) {
                  setHazards(prev => prev.map(h => h.id === newItem.id ? newItem : h));
                } else {
                  setHazards(prev => [...prev, newItem]);
                }
                (async () => {
                try {
                  const { createClient } = await import("@supabase/supabase-js");
                  const _u = import.meta.env.VITE_SUPABASE_URL, _k = import.meta.env.VITE_SUPABASE_ANON_KEY;
                  if (_u && _k) {
                    const _sb = createClient(_u, _k);
                    const row = {hazard:newItem.hazard,hazard_type:newItem.hazardType,product_groups:newItem.productGroups||[],probability:newItem.probability,severity:newItem.severity,legislation:newItem.legislation,control_measure:newItem.controlMeasure};
                    if (isNew) { const {data} = await _sb.from("hazards").insert(row).select("id").single(); if(data) setHazards(prev=>prev.map(h=>h.id===newItem.id?{...h,id:data.id}:h)); }
                    else { await _sb.from("hazards").update(row).eq("id",newItem.id); }
                  }
                } catch(e) { console.error("DB fout:", e); }
              })();
                setShowHazardModal(false);
                showNotif(lang === "nl" ? "Gevaar opgeslagen" : "Hazard saved");
              }}>{t.common.save}</button>
            </div>
          </div>
        </div>
      )}

      {/* Hazard Detail Modal */}
      {showHazardDetail && selectedHazardDetail && (
        <HazardDetailModal
          hazard={selectedHazardDetail}
          selectedIngredient={selectedIngredient}
          lang={lang}
          legislation={legislation}
          getRiskBadge={getRiskBadge}
          getRiskColor={getRiskColor}
          styles={styles}
          t={t}
          onClose={() => setShowHazardDetail(false)}
        />
      )}

      {/* Fraud Modal */}
      {showFraudModal && editFraud && (
            <div style={styles.modal} onClick={() => setShowFraudModal(false)}>
              <div style={{ ...styles.modalBox, minWidth: 580 }} onClick={e => e.stopPropagation()}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{editFraud.id ? "Fraude-risico bewerken" : "Fraude-risico toevoegen"}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Grondstof</label>
                    <input style={styles.input} value={editFraud.ingredient} onChange={e => setEditFraud(f => ({ ...f, ingredient: e.target.value }))} placeholder="bv. Olijfolie" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Leverancier</label>
                    <input style={styles.input} value={editFraud.supplier} onChange={e => setEditFraud(f => ({ ...f, supplier: e.target.value }))} placeholder="bv. MedOil BV" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Fraudetype</label>
                    <select style={{ ...styles.select, width: "100%" }} value={editFraud.fraudType} onChange={e => setEditFraud(f => ({ ...f, fraudType: e.target.value }))}>
                      {fraudTypes.map(ft => <option key={ft}>{ft}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Wetgeving</label>
                    <input style={styles.input} value={editFraud.legislation} onChange={e => setEditFraud(f => ({ ...f, legislation: e.target.value }))} placeholder="bv. EU 1169/2011" />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Omschrijving fraudescenario</label>
                  <input style={styles.input} value={editFraud.description} onChange={e => setEditFraud(f => ({ ...f, description: e.target.value }))} placeholder="bv. Versnijding met goedkopere olie" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Economische motivatie</label>
                    <input style={styles.input} value={editFraud.motivation} onChange={e => setEditFraud(f => ({ ...f, motivation: e.target.value }))} placeholder="bv. Prijsverschil €1,20/kg" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#4a5568", display: "block", marginBottom: 4 }}>Fraudehistorie / bronnen</label>
                    <input style={styles.input} value={editFraud.history} onChange={e => setEditFraud(f => ({ ...f, history: e.target.value }))} placeholder="bv. RASFF 2023-meldingen" />
                  </div>
                </div>
                {/* V × D sliders */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {[
                    { key: "vulnerability", label: "Kwetsbaarheid (V)", sublabel: "1 = nauwelijks kwetsbaar · 5 = zeer kwetsbaar", color: "#fa6401" },
                    { key: "detectability", label: "Detecteerbaarheid (D)", sublabel: "1 = nauwelijks detecteerbaar · 5 = goed detecteerbaar", color: "#fa6401" },
                  ].map(({ key, label, sublabel, color }) => (
                    <div key={key} style={{ padding: 14, background: "#eff0f5", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 11, color: "#8a94a6", marginBottom: 10 }}>{sublabel}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {[1,2,3,4,5].map(v => (
                          <button key={v} onClick={() => setEditFraud(f => ({ ...f, [key]: v }))}
                            style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: `2px solid ${editFraud[key] === v ? color : "#dde0e8"}`, background: editFraud[key] === v ? color : "#fff", color: editFraud[key] === v ? "#fff" : "#4a5568", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Live score preview */}
                <div style={{ padding: 12, borderRadius: 8, background: getFraudRiskBg(getFraudRisk(editFraud.vulnerability, editFraud.detectability)), border: `1px solid ${getFraudRiskColor(getFraudRisk(editFraud.vulnerability, editFraud.detectability))}33`, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: getFraudRiskColor(getFraudRisk(editFraud.vulnerability, editFraud.detectability)) }}>{getFraudRisk(editFraud.vulnerability, editFraud.detectability)}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: getFraudRiskColor(getFraudRisk(editFraud.vulnerability, editFraud.detectability)) }}>{getFraudRiskLabel(getFraudRisk(editFraud.vulnerability, editFraud.detectability))}</div>
                    <div style={{ fontSize: 11, color: "#4a5568" }}>Risicoscore = V({editFraud.vulnerability}) × (6 − D({editFraud.detectability})) = {getFraudRisk(editFraud.vulnerability, editFraud.detectability)}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button style={styles.btn("secondary")} onClick={() => setShowFraudModal(false)}>{t.common.cancel}</button>
                  <button style={styles.btn()} onClick={() => {
                    const isNew = !editFraud.id;
                    const newItem = isNew ? { ...editFraud, id: Date.now() } : editFraud;
                    if (!isNew) {
                      setFraudItems(prev => prev.map(f => f.id === newItem.id ? newItem : f));
                    } else {
                      setFraudItems(prev => [...prev, newItem]);
                    }
                    (async () => {
                    try {
                      const { createClient } = await import("@supabase/supabase-js");
                      const _u = import.meta.env.VITE_SUPABASE_URL, _k = import.meta.env.VITE_SUPABASE_ANON_KEY;
                      if (_u && _k) {
                        const _sb = createClient(_u, _k);
                        const row = {article:newItem.article,supplier:newItem.supplier,fraud_type:newItem.fraudType,vulnerability:newItem.vulnerability,detectability:newItem.detectability};
                        if (isNew) { const {data} = await _sb.from("fraud_items").insert(row).select("id").single(); if(data) setFraudItems(prev=>prev.map(f=>f.id===newItem.id?{...f,id:data.id}:f)); }
                        else { await _sb.from("fraud_items").update(row).eq("id",newItem.id); }
                      }
                    } catch(e) { console.error("DB fout:", e); }
                  })();
                    setShowFraudModal(false);
                    showNotif("Fraude-risico opgeslagen");
                  }}>{t.common.save}</button>
                </div>
              </div>
            </div>
      )}

      {/* Update Inbox Modal */}
      {showUpdateInbox && (() => {
        // Redirect via useEffect to avoid setState during render
        setTimeout(() => {
          setShowUpdateInbox(false);
          setActiveNav("changes");
          setChangesTab("inbox");
        }, 0);
        return null;
      })()}

      {/* Notification */}
      {notification && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: notification.type === "error" ? "#dc2626" : "#fa6401", color: "#fff", padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", zIndex: 2000, animation: "fadeIn 0.2s" }}>
          {notification.type === "error" ? "✕" : "✓"} {notification.msg}
        </div>
      )}
    </div>
  );
}

// Wrap met ErrorBoundary zodat crashes zichtbaar zijn
const AppWithBoundary = () => <ErrorBoundary><App /></ErrorBoundary>;
export { AppWithBoundary as default };
