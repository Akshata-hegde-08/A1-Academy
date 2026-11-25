import type { ResourceItem } from './curriculum';

export interface LabDetailItem extends ResourceItem {
  labCategory: string;
}

export interface LabTopic {
  id: string;
  slug: string;
  number: number;
  title: string;
  items: LabTopicSectionItem[];
}

export type LabTopicSectionItem = LabDetailItem;

export interface LabModule {
  id: string;
  slug: 'chemistry' | 'physics' | 'python' | 'matlab';
  subjectLabel: string;
  name: string;
  cycle: 'Physics Cycle' | 'Chemistry Cycle' | 'Both Cycles';
  imagePath: string;
  focus: string;
  includesPointers: string[];
  preparationChecklist: string[];
  vivaTopics: string[];
  labItems: LabDetailItem[];
  topics: LabTopic[];
}

export interface GlobalReferenceBook {
  id: string;
  title: string;
  authors: string;
  subject: string;
  cycle: 'Physics Cycle' | 'Chemistry Cycle' | 'Both Cycles';
  summary: string;
}

interface ChemistryTopicSeed {
  slug: string;
  title: string;
  recordAim: string;
  recordPoints: string[];
  recordFormula: string;
  scilabSummary: string;
  scilabSteps: string[];
  scilabCode: string;
  graphSummary: string;
  graphAxes: string[];
  vivaQuestions: string[];
}

const CHEMISTRY_TOPIC_SEEDS: ChemistryTopicSeed[] = [
  {
    slug: 'copper-in-brass-colorimetric-method',
    title: 'Estimation of amount of copper in brass by colorimetric method',
    recordAim:
      'Estimate the percentage of copper present in a given brass solution using a photoelectric colorimeter based on Beer-Lambert Law.',
    recordPoints: [
      'Dissolve brass sample cleanly, dilute standard CuSO4 stock solutions, and develop deep blue cuprammonium complex using NH4OH.',
      'Measure optical density (absorbance) at 620 nm (red filter) against reagent blank for standard series and unknown brass sample.',
      'Determine unknown copper mass from the linear calibration plot and compute weight percentage in the brass sample.',
    ],
    recordFormula:
      'A = ε · c · l   |   % Copper in Brass = (Mass of Cu from graph / Mass of Brass sample) × 100',
    scilabSummary:
      'Linear least-squares regression and interpolation script in Scilab to compute unknown copper concentration from colorimetric absorbance.',
    scilabSteps: [
      'Input standard Cu2+ volumes/concentrations and measured absorbance values.',
      'Fit linear Beer-Lambert calibration line y = m*x + c and solve for unknown sample concentration.',
    ],
    scilabCode:
      'conc = [0 2 4 6 8 10];\nabs  = [0.00 0.14 0.28 0.42 0.56 0.70];\n[m, c] = reglin(conc, abs);\nA_unknown = 0.35;\nC_unknown = (A_unknown - c) / m;\ndisp("Unknown Cu Concentration (mg): " + string(C_unknown));\nplot(conc, abs, "o-", C_unknown, A_unknown, "rs");\nxlabel("Concentration (mg)"); ylabel("Absorbance");',
    graphSummary:
      'Calibration curve of Absorbance (optical density) versus Volume/Concentration of standard copper solution.',
    graphAxes: [
      'X-axis: Volume or Concentration of standard CuSO4 solution (mL or mg).',
      'Y-axis: Optical Density / Absorbance at 620 nm.',
      'Expected shape: Straight line passing through the origin; drop perpendicular from unknown absorbance to read unknown concentration.',
    ],
    vivaQuestions: [
      'State Beer-Lambert Law and explain the physical meaning of molar absorptivity (ε).',
      'Why is ammonium hydroxide (NH4OH) added to the copper solution before taking colorimetric readings?',
      'Why is a red filter (~620 nm) chosen to measure the absorbance of the deep blue cuprammonium complex?',
      'What is the role of the blank solution in colorimetric estimation?',
    ],
  },
  {
    slug: 'conductometric-titration',
    title: 'Conductometric Titration.',
    recordAim:
      'Determine the strength/amount of strong/weak acid (or acid mixture) present in a given solution by titrating conductometrically against standard NaOH.',
    recordPoints: [
      'Calibrate the conductivity cell with standard KCl solution, rinse with distilled water, and immerse cleanly in the acid analyte.',
      'Add standard NaOH from a burette in 0.5 mL increments, stir thoroughly after each addition, and record specific conductance.',
      'Locate equivalence volume(s) from the intersection of linear conductance branches and compute normality and weight/L.',
    ],
    recordFormula:
      'N_acid · V_acid = N_NaOH · V_equivalence   |   Amount (g/L) = N_acid × Equivalent Weight',
    scilabSummary:
      'Scilab piecewise linear fitting script to plot Conductance vs Volume of NaOH and locate the equivalence point.',
    scilabSteps: [
      'Enter burette volume V and measured conductance G vectors.',
      'Plot G vs V to inspect the sharp V-shaped intersection at neutralization.',
    ],
    scilabCode:
      'V = [0 1 2 3 4 5 6 7 8 9];\nG = [4.8 4.1 3.4 2.7 2.0 1.6 2.1 2.7 3.3 3.9];\nplot(V, G, "-o");\nxlabel("Volume of NaOH (mL)");\nylabel("Conductance (mS)");\ntitle("Conductometric Titration Curve");',
    graphSummary:
      'Plot of Conductance (mS or mho) versus Volume of NaOH added (mL).',
    graphAxes: [
      'X-axis: Volume of standard NaOH added (mL).',
      'Y-axis: Observed Conductance (mS).',
      'Expected shape: Initial sharp fall (fast H+ replaced by slower Na+) followed by sharp rise after equivalence due to excess OH- ions; intersection marks endpoint.',
    ],
    vivaQuestions: [
      'Why does conductance initially decrease when NaOH is added to HCl?',
      'Why does conductance increase rapidly after the equivalence point?',
      'Why is conductometric titration preferred for colored, turbid, or very dilute acid solutions?',
      'Why should the titrant (NaOH) concentration be roughly 10 times stronger than the analyte acid?',
    ],
  },
  {
    slug: 'pka-weak-acid-ph-metric-titration',
    title: 'Determination of pKa value of weak acid by pH-metric titration',
    recordAim:
      'Determine the dissociation constant (pKa) and concentration of a weak monobasic acid (e.g., acetic acid) by pH-metric titration with standard NaOH.',
    recordPoints: [
      'Standardize the glass-calomel combined electrode using pH 4.0 and pH 7.0 standard buffer solutions.',
      'Titrate fixed volume of weak acid with 0.5 mL aliquots of standard NaOH and record steady pH values after stirring.',
      'Identify equivalence volume Ve from the ΔpH/ΔV peak, then read pKa directly as the pH at half-equivalence volume (Ve / 2).',
    ],
    recordFormula:
      'pH = pKa + log([Salt]/[Acid])   |   At half-equivalence (V = Ve / 2), pKa = pH',
    scilabSummary:
      'Scilab script computing ΔpH/ΔV derivative peak to locate Ve and interpolate pKa at Ve / 2.',
    scilabSteps: [
      'Store volume V and pH readings from titration.',
      'Compute ΔpH/ΔV at midpoint volumes to locate the equivalence volume Ve cleanly.',
    ],
    scilabCode:
      'V  = [0 1 2 3 4 4.5 5.0 5.5 6.0 7.0];\npH = [2.9 3.8 4.4 4.8 5.4 6.1 8.8 10.6 11.2 11.7];\ndpHdV = diff(pH) ./ diff(V);\nVmid = (V(1:$-1) + V(2:$)) / 2;\n[mx, idx] = max(dpHdV);\nVe = Vmid(idx);\ndisp("Equivalence Volume Ve (mL): " + string(Ve));\nplot(Vmid, dpHdV, "-o");\nxlabel("Average Volume (mL)"); ylabel("dpH/dV");',
    graphSummary:
      'Dual graph set: (1) Sigmoidal pH vs Volume curve and (2) First derivative ΔpH/ΔV vs Average Volume curve.',
    graphAxes: [
      'X-axis: Volume of NaOH (mL) for sigmoidal plot; Midpoint Volume for derivative plot.',
      'Y-axis: Measured pH (Plot 1) and ΔpH/ΔV (Plot 2).',
      'Expected shape: Steep peak in ΔpH/ΔV gives Ve; reading pH on the sigmoidal curve at V = Ve/2 yields pKa.',
    ],
    vivaQuestions: [
      'What is pKa and how is it mathematically related to Ka?',
      'Explain how the Henderson-Hasselbalch equation justifies pKa = pH at half-equivalence volume.',
      'What is the buffering region visible on the pH-metric titration curve of a weak acid?',
      'Which electrodes form a combined glass electrode assembly?',
    ],
  },
  {
    slug: 'iron-in-rust-potentiometric-titration',
    title: 'Estimation of iron in a rust sample using potentiometric titration.',
    recordAim:
      'Estimate the weight and percentage of iron present in an acid-digested rust sample solution by potentiometric titration against standard K2Cr2O7.',
    recordPoints: [
      'Reduce Fe3+ in the rust extract quantitatively to Fe2+ (e.g., SnCl2 / HgCl2 treatment) and acidify with H2SO4/H3PO4.',
      'Immerse platinum indicator electrode and saturated calomel reference electrode in the Fe2+ solution connected to a potentiometer.',
      'Add standard K2Cr2O7 in 0.5 mL portions, record EMF (mV), locate the ΔE/ΔV maximum peak for equivalence volume, and calculate % Fe.',
    ],
    recordFormula:
      'N_Fe · V_Fe = N_K2Cr2O7 · V_eq   |   Weight of Fe = (N_Fe × 55.85 × Given Volume) / 1000',
    scilabSummary:
      'Scilab script calculating discrete potential derivatives ΔE/ΔV and plotting the sharp endpoint peak.',
    scilabSteps: [
      'Enter titrant volume V and potentiometer EMF values E (in mV).',
      'Compute ΔE/ΔV and extract the exact endpoint volume at maximum slope.',
    ],
    scilabCode:
      'V = [0 1 2 3 3.5 4.0 4.5 5.0 6.0];\nE = [235 258 282 315 352 645 712 735 752];\ndEdV = diff(E) ./ diff(V);\nVmid = (V(1:$-1) + V(2:$)) / 2;\n[pk, idx] = max(dEdV);\ndisp("Endpoint Volume (mL): " + string(Vmid(idx)));\nplot(Vmid, dEdV, "-o");\nxlabel("Average Volume of K2Cr2O7 (mL)"); ylabel("dE/dV (mV/mL)");',
    graphSummary:
      'EMF (E) vs Volume curve alongside the differential peak curve ΔE/ΔV vs Average Volume.',
    graphAxes: [
      'X-axis: Volume of standard K2Cr2O7 added (mL).',
      'Y-axis: Cell EMF in mV (Curve 1) and ΔE/ΔV in mV/mL (Curve 2).',
      'Expected shape: Sigmoidal jump in E near endpoint; sharp spike in ΔE/ΔV pins equivalence volume cleanly.',
    ],
    vivaQuestions: [
      'Name the indicator electrode and reference electrode used in redox potentiometric titration of Fe2+.',
      'Write the balanced redox equation between Fe2+ and dichromate (Cr2O7^2-) in acidic medium.',
      'Why is ΔE/ΔV plotted against average volume instead of relying solely on the sigmoidal E vs V curve?',
      'What is the role of H3PO4 if diphenylamine or redox potential stabilization is involved?',
    ],
  },
  {
    slug: 'phase-diagram-eutectic-cooling-curve',
    title: 'Construction of phase diagram for simple Eutectic system using cooling curve',
    recordAim:
      'Determine freezing points of pure components (e.g., Naphthalene & Biphenyl / Benzoic acid) and mixtures across compositions to construct the binary eutectic phase diagram.',
    recordPoints: [
      'Prepare weighed binary mixtures covering 0% to 100% composition by mass in hard glass boiling tubes.',
      'Melt each mixture completely in a water/oil bath, allow uniform slow cooling, and record temperature every 30 seconds.',
      'Identify initial slope breaks (liquidus) and horizontal eutectic arrest temperatures to map the T–Composition phase diagram.',
    ],
    recordFormula:
      'Condensed Phase Rule: F = C − P + 1   |   At Eutectic Point (C=2, P=3): F = 2 − 3 + 1 = 0 (Invariant)',
    scilabSummary:
      'Scilab script plotting cooling curves (Temperature vs Time) and the assembled Eutectic T-x phase diagram.',
    scilabSteps: [
      'Store composition mass fraction x_B and measured liquidus + eutectic arrest temperatures.',
      'Plot smooth liquidus branches meeting at the invariant eutectic point.',
    ],
    scilabCode:
      'comp = [0 20 40 55 70 85 100];\nT_liq = [80.2 68.5 54.0 40.5 52.0 61.5 70.0];\nT_eut = [40.5 40.5 40.5 40.5 40.5 40.5 40.5];\nplot(comp, T_liq, "-o", comp, T_eut, "--");\nxlabel("% Composition of Component B"); ylabel("Temperature (deg C)");\ntitle("Simple Eutectic Phase Diagram");',
    graphSummary:
      'Cooling curves (Temperature vs Time) for each composition and the consolidated Temperature vs % Composition Eutectic Phase Diagram.',
    graphAxes: [
      'Cooling Curve — X-axis: Time (s/min), Y-axis: Temperature (°C).',
      'Phase Diagram — X-axis: % Composition (0% to 100%), Y-axis: Freezing Temperature (°C).',
      'Expected shape: Two downward-sloping liquidus curves intersecting at the lowest eutectic temperature with a horizontal solidus line.',
    ],
    vivaQuestions: [
      'Define eutectic point, eutectic composition, and eutectic temperature.',
      'State Gibbs Phase Rule and explain why the reduced phase rule F = C − P + 1 is used for condensed systems.',
      'Why is there a break (change in slope) followed by a horizontal plateau on the cooling curve of a mixture?',
      'How many degrees of freedom exist at the eutectic point of a two-component system?',
    ],
  },
  {
    slug: 'viscosity-average-molecular-weight-pva',
    title: 'Determination of viscosity average molecular weight of a polymer(PVA)',
    recordAim:
      'Determine the intrinsic viscosity [η] and viscosity-average molecular weight (Mv) of Polyvinyl Alcohol (PVA) using an Ostwald viscometer.',
    recordPoints: [
      'Clean and vertically mount an Ostwald viscometer in a constant-temperature bath and measure flow time (t0) of pure distilled water.',
      'Prepare PVA aqueous solutions of graded concentrations (e.g., 0.2% to 1.0% g/dL) and record concordant flow times (t) for each.',
      'Compute relative (ηr), specific (ηsp), and reduced viscosity (ηsp/C), extrapolate ηsp/C vs C to C → 0 for [η], and solve Mark-Houwink equation.',
    ],
    recordFormula:
      'η_r = t / t0   |   η_sp = η_r − 1   |   [η] = lim(C→0) (η_sp / C) = K · (Mv)^a',
    scilabSummary:
      'Scilab regression script computing reduced viscosity, extrapolating [η] at C = 0, and solving Mark-Houwink Mv.',
    scilabSteps: [
      'Enter polymer concentration C (g/dL) and flow times t alongside solvent flow time t0.',
      'Fit ηsp/C vs C linearly to obtain intercept [η] and compute Mv = ([η] / K)^(1/a).',
    ],
    scilabCode:
      'C = [0.2 0.4 0.6 0.8 1.0];\nt = [96.2 106.8 118.4 131.0 144.8];\nt0 = 86.0;\neta_sp = (t ./ t0) - 1;\neta_red = eta_sp ./ C;\n[slope, intr_eta] = reglin(C, eta_red);\nK = 4.53e-4; a = 0.64;\nMv = (intr_eta / K)^(1 / a);\ndisp("Intrinsic Viscosity [eta]: " + string(intr_eta));\ndisp("Viscosity Avg Molecular Weight Mv: " + string(Mv));\nplot(C, eta_red, "o-");\nxlabel("Concentration (g/dL)"); ylabel("Reduced Viscosity");',
    graphSummary:
      'Huggins plot of Reduced Viscosity (η_sp / C) versus Polymer Concentration (C).',
    graphAxes: [
      'X-axis: Concentration of PVA solution C (g/dL or g/mL).',
      'Y-axis: Reduced Viscosity (η_sp / C) and/or Inherent Viscosity (ln η_r / C).',
      'Expected shape: Upward-sloping straight line whose y-intercept at C = 0 gives Intrinsic Viscosity [η].',
    ],
    vivaQuestions: [
      'State the Mark-Houwink-Sakurada equation and define every term in it.',
      'Distinguish between relative viscosity, specific viscosity, reduced viscosity, and intrinsic viscosity.',
      'Why must the Ostwald viscometer be held strictly vertical at a constant temperature during measurements?',
      'Why does viscosity-average molecular weight Mv generally differ slightly from number-average (Mn) and weight-average (Mw)?',
    ],
  },
  {
    slug: 'water-quality-ph-conductivity-tds-hardness',
    title:
      'Determination of pH, conductivity, Total Dissolved Salts(TDS) and Total Hardness of given water sample.',
    recordAim:
      'Analyze water quality parameters—pH, electrical conductivity, TDS, and Total Hardness (via EDTA complexometric titration)—for a given water sample.',
    recordPoints: [
      'Calibrate pH meter (pH 4, 7, 9.2 buffers) and conductivity/TDS meter (standard KCl), then record sample pH, conductivity (μS/cm), and TDS (ppm).',
      'Pipette fixed sample volume, add pH 10 NH3–NH4Cl buffer and Eriochrome Black-T (EBT) indicator until wine-red color forms.',
      'Titrate against standardized 0.01 M EDTA until color transitions sharply from wine-red to sky blue and express Total Hardness in ppm CaCO3 eq.',
    ],
    recordFormula:
      'Total Hardness (ppm CaCO3) = (V_EDTA × M_EDTA × 100 × 1000) / V_sample   |   TDS ≈ 0.65 × Conductivity (μS/cm)',
    scilabSummary:
      'Scilab water-quality calculator computing Total Hardness (ppm CaCO3), TDS correlation, and BIS compliance check.',
    scilabSteps: [
      'Input sample volume, standardized EDTA molarity, concordant EDTA titre, and measured conductivity.',
      'Compute hardness in mg/L (ppm CaCO3) and check against drinking water limits.',
    ],
    scilabCode:
      'V_sample = 50; M_edta = 0.01; V_edta = 14.5;\nhardness_ppm = (V_edta * M_edta * 100 * 1000) / V_sample;\ncond_uS = 620;\nest_TDS = 0.65 * cond_uS;\ndisp("Total Hardness (ppm CaCO3): " + string(hardness_ppm));\ndisp("Estimated TDS (ppm): " + string(est_TDS));',
    graphSummary:
      'Bar/comparison chart of measured parameters (pH, Conductivity, TDS, Total Hardness) against standard permissible limits.',
    graphAxes: [
      'X-axis: Water quality parameters (pH, Conductivity, TDS, Total Hardness).',
      'Y-axis: Measured concentration/value alongside BIS desirable & permissible benchmarks.',
      'Expected comparison: Hardness < 200 ppm desirable; pH within 6.5–8.5; TDS < 500 ppm desirable.',
    ],
    vivaQuestions: [
      'Why is pH 10 ammonia buffer maintained during EDTA hardness titration?',
      'Explain the chemical color change of Eriochrome Black-T (EBT) from wine-red to steel blue at the endpoint.',
      'Why is Total Hardness conventionally expressed in parts per million (ppm) equivalents of CaCO3?',
      'What is the physical relationship between electrical conductivity and Total Dissolved Solids (TDS)?',
    ],
  },
  {
    slug: 'chemical-oxygen-demand-cod-industrial-wastewater',
    title:
      'Determination of Chemical Oxygen Demand(COD) of industrial waste water sample.',
    recordAim:
      'Determine the Chemical Oxygen Demand (COD in mg O2/L) of an industrial wastewater sample using the open-reflux potassium dichromate back-titration method.',
    recordPoints: [
      'Reflux measured wastewater sample with known excess standard K2Cr2O7, concentrated H2SO4, Ag2SO4 (catalyst), and HgSO4 (chloride masker) for 2 hours.',
      'Cool, dilute, add ferroin indicator, and back-titrate residual dichromate against standard Ferrous Ammonium Sulphate (FAS) to reddish-brown endpoint.',
      'Perform an identical blank reflux with distilled water and compute COD from the difference (V_blank − V_sample).',
    ],
    recordFormula:
      'COD (mg O2 / L) = [(V_blank − V_sample) × N_FAS × 8 × 1000] / V_wastewater',
    scilabSummary:
      'Scilab calculation and batch-comparison script converting blank vs sample FAS titres directly to COD (mg/L).',
    scilabSteps: [
      'Input blank titre Vb, sample titre Vs, FAS normality, and wastewater sample volume.',
      'Evaluate COD (mg O2/L) and plot sample load across multiple effluent streams.',
    ],
    scilabCode:
      'Vb = 24.8; Vs = 14.2; N_fas = 0.1; V_waste = 25;\nCOD = ((Vb - Vs) * N_fas * 8 * 1000) / V_waste;\ndisp("Chemical Oxygen Demand (mg O2/L): " + string(COD));\nsamples = [1 2 3];\ncod_vals = [COD, 210, 420];\nbar(samples, cod_vals);\nxlabel("Effluent Sample ID"); ylabel("COD (mg O2/L)");',
    graphSummary:
      'Comparison bar chart / calibration plot of FAS titre volume consumed versus COD load (mg O2/L).',
    graphAxes: [
      'X-axis: Effluent Sample Batch / Dilution Ratio.',
      'Y-axis: Chemical Oxygen Demand (mg O2 / L).',
      'Expected trend: Higher organic pollutant load consumes more dichromate, leaving smaller FAS back-titre (Vs) and higher COD.',
    ],
    vivaQuestions: [
      'Why is COD always greater than or equal to BOD for an industrial wastewater sample?',
      'State the specific roles of Ag2SO4 and HgSO4 in the COD reflux mixture.',
      'Why is the equivalent weight of oxygen (8) used in the COD formula?',
      'What color transition occurs at the endpoint when using Ferroin indicator with FAS?',
    ],
  },
  {
    slug: 'cobalt-doped-alpha-al2o3-nanoparticles-combustion',
    title:
      'Synthesis of Cobalt doped alpha-Al2O3 metal oxide nano particles via combustion method.',
    recordAim:
      'Synthesize cobalt-doped α-Al2O3 metal oxide nanoparticles via solution combustion synthesis using metal nitrates (oxidizer) and urea/glycine (fuel).',
    recordPoints: [
      'Dissolve stoichiometric aluminium nitrate [Al(NO3)3·9H2O], cobalt nitrate dopant, and organic fuel (urea/glycine) in minimum deionized water.',
      'Maintain oxidizer-to-fuel ratio (O/F = 1) using propellant chemistry valencies, stir to clear gel, and ignite in a preheated muffle furnace (~500 °C).',
      'Collect porous ash-like foam, grind cleanly into fine powder, calcine at elevated temperature to obtain blue cobalt-doped α-Al2O3 nanoparticles, and compute yield.',
    ],
    recordFormula:
      'Propellant Chemistry: Total Oxidizing Valency / Total Reducing Valency = 1   |   Scherrer Crystallite Size: D = (K · λ) / (β · cosθ)',
    scilabSummary:
      'Scilab script computing stoichiometric oxidizer/fuel molar masses and Debye-Scherrer crystallite diameter from XRD peak FWHM.',
    scilabSteps: [
      'Calculate fuel-to-oxidizer molar balance using valency rules.',
      'Evaluate nanoparticle crystallite size D (nm) using Debye-Scherrer formula from XRD 2θ and FWHM β.',
    ],
    scilabCode:
      'K_s = 0.9; lambda = 0.15406; // Cu K-alpha (nm)\ntheta_deg = 21.7; beta_deg = 0.42;\ntheta = theta_deg * %pi / 180;\nbeta = beta_deg * %pi / 180;\nD_nm = (K_s * lambda) / (beta * cos(theta));\ndisp("Scherrer Crystallite Size D (nm): " + string(D_nm));',
    graphSummary:
      'Schematic XRD diffraction intensity (counts) vs 2θ plot and UV-Vis absorption spectrum for Co-doped α-Al2O3.',
    graphAxes: [
      'X-axis: Diffraction Angle 2θ (degrees, 20°–80°) for XRD profile.',
      'Y-axis: Relative Intensity (a.u.).',
      'Expected pattern: Broadened α-Al2O3 Bragg peaks indicating nanocrystalline domain size; characteristic blue Co2+ optical d-d bands.',
    ],
    vivaQuestions: [
      'What is solution combustion synthesis, and what roles do metal nitrates and urea/glycine play?',
      'How does Co2+ doping impart blue coloration to α-Al2O3 nanocrystals?',
      'Write the Debye-Scherrer equation used to estimate nanoparticle crystallite size from XRD peak broadening.',
      'Why is calcination performed after primary combustion synthesis?',
    ],
  },
];

function buildChemistryTopics(): LabTopic[] {
  return CHEMISTRY_TOPIC_SEEDS.map((seed, index) => {
    const unitLabel = `Topic ${index + 1} · ${seed.title}`;
    return {
      id: `chem-topic-${index + 1}`,
      slug: seed.slug,
      number: index + 1,
      title: seed.title,
      items: [
        {
          id: `chem-${seed.slug}-record`,
          labCategory: 'Record',
          title: `${seed.title} — Lab Record`,
          unit: unitLabel,
          description: seed.recordAim,
          isSample: true,
          downloadable: true,
          fileFormat: 'HTML Study Sheet',
          authorNote: 'Sample Lab Record · Adapt readings from your session',
          previewSummary: seed.recordAim,
          previewPages: [
            {
              heading: 'Aim, Procedure & Formula Summary',
              bullets: seed.recordPoints,
              formulaOrCode: seed.recordFormula,
            },
          ],
        },
        {
          id: `chem-${seed.slug}-scilab`,
          labCategory: 'Sci-lab codes',
          title: `${seed.title} — Sci-lab Codes`,
          unit: unitLabel,
          description: seed.scilabSummary,
          isSample: true,
          downloadable: true,
          fileFormat: 'HTML Code Sheet',
          authorNote: 'Sample Scilab Code · Execute in Scilab Console',
          previewSummary: seed.scilabSummary,
          previewPages: [
            {
              heading: 'Scilab Script & Plotting Steps',
              bullets: seed.scilabSteps,
              formulaOrCode: seed.scilabCode,
            },
          ],
        },
        {
          id: `chem-${seed.slug}-graphs`,
          labCategory: 'Model graphs',
          title: `${seed.title} — Model Graphs`,
          unit: unitLabel,
          description: seed.graphSummary,
          isSample: true,
          downloadable: true,
          fileFormat: 'HTML Graph Guide',
          authorNote: 'Model Graph Plotting Reference',
          previewSummary: seed.graphSummary,
          previewPages: [
            {
              heading: 'Axes Labeling & Expected Curve Shape',
              bullets: seed.graphAxes,
            },
          ],
        },
        {
          id: `chem-${seed.slug}-viva`,
          labCategory: 'Viva questions',
          title: `${seed.title} — Viva Questions`,
          unit: unitLabel,
          description: `Key oral viva questions and core principles tested for ${seed.title}.`,
          isSample: true,
          downloadable: false,
          authorNote: 'Topic Viva Preparation',
          previewSummary: `Essential viva questions for ${seed.title}.`,
          previewPages: [
            {
              heading: 'Expected Oral Viva Questions',
              bullets: seed.vivaQuestions,
            },
          ],
        },
      ],
    };
  });
}

function buildGenericUnitTopics(
  labSlug: 'physics' | 'python' | 'matlab',
  subjectLabel: string,
  categories: string[],
  unitCount = 4,
): LabTopic[] {
  return Array.from({ length: unitCount }, (_, idx) => {
    const unitNum = idx + 1;
    const unitTitle = `Unit ${unitNum}`;
    const unitSlug = `unit-${unitNum}`;

    return {
      id: `${labSlug}-${unitSlug}`,
      slug: unitSlug,
      number: unitNum,
      title: unitTitle,
      items: categories.map((cat) => ({
        id: `${labSlug}-${unitSlug}-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        labCategory: cat,
        title: `${subjectLabel} Lab (${unitTitle}) — ${cat}`,
        unit: `${subjectLabel} Lab · ${unitTitle}`,
        description: `Dedicated ${cat.toLowerCase()} resources organized specifically for ${subjectLabel} Lab ${unitTitle}.`,
        isSample: true,
        downloadable: cat !== 'Viva questions' && cat !== 'HackerRank challenge questions',
        fileFormat: 'HTML Study Sheet',
        authorNote: `${subjectLabel} Lab · ${unitTitle} ${cat}`,
        previewSummary: `Unit-scoped ${cat.toLowerCase()} material for ${subjectLabel} Lab ${unitTitle}.`,
        previewPages: [
          {
            heading: `${unitTitle} — ${cat}`,
            bullets: [
              `Review ${unitTitle} core experimental concepts, objectives, and ${cat.toLowerCase()} requirements before your lab session.`,
              `Verify units, edge cases, and presentation format cleanly for ${unitTitle}.`,
            ],
          },
        ],
      })),
    };
  });
}

export const LAB_MODULES: LabModule[] = [
  {
    id: 'chemistry-lab',
    slug: 'chemistry',
    subjectLabel: 'Chemistry',
    name: 'Chemistry Lab',
    cycle: 'Chemistry Cycle',
    imagePath: '/src/assets/images/lab_chemistry_3d_1795180040249.jpg',
    focus:
      'Volumetric titrations, potentiometry, conductometry, water hardness (EDTA), and colorimetric analysis.',
    includesPointers: [
      'Record',
      'Sci-lab codes',
      'Model graphs',
      'Viva questions',
    ],
    preparationChecklist: [
      'Standardize primary solutions carefully and rinse burettes with titrant.',
      'Record concordant burette readings cleanly in tabular form.',
      'Identify equivalence points accurately on pH / conductance derivative plots.',
    ],
    vivaTopics: [
      'Role of buffer & Eriochrome Black-T indicator in EDTA titration',
      'Principle of potentiometric titration near the endpoint',
      'Beer-Lambert Law linearity limits in colorimetry',
    ],
    labItems: [
      {
        id: 'chem-lab-record',
        labCategory: 'Record',
        title: 'Engineering Chemistry Lab — Record Writing Format & Observations',
        unit: 'Lab Record Guide',
        description:
          'Standard lab record layout covering Aim, Apparatus, Chemicals, Procedure, Observation Tables, Calculations, and Result formatting.',
        isSample: true,
        downloadable: true,
        fileFormat: 'HTML Study Sheet',
        authorNote: 'Sample Lab Record Guide · Adapt readings from your session',
        previewSummary:
          'Shows how to organize titration tables, normality formulas, and error-free final results cleanly in your chemistry lab record.',
        previewPages: [
          {
            heading: 'Standard Record Structure',
            bullets: [
              'Left-hand unruled page: Principle reactions, observation tables, graphs, and step-by-step calculations.',
              'Right-hand ruled page: Aim, apparatus, chemicals required, brief procedure in passive voice, and final result with units.',
            ],
            formulaOrCode: 'N1 * V1 = N2 * V2   |   Strength (g/L) = Normality × Equivalent Weight',
          },
        ],
      },
      {
        id: 'chem-lab-scilab',
        labCategory: 'Sci-lab codes',
        title: 'Sci-Lab Codes — Potentiometric & Conductometric Equivalence Script',
        unit: 'Computational Chemistry',
        description:
          'Sample Scilab scripts for plotting EMF derivative curves (ΔE/ΔV vs V) and conductance endpoints from lab readings.',
        isSample: true,
        downloadable: true,
        fileFormat: 'HTML Code Sheet',
        authorNote: 'Sample Scilab Code · Test directly in Scilab console',
        previewSummary:
          'Demonstrates Scilab vector computation of ΔE/ΔV and automated endpoint plotting.',
        previewPages: [
          {
            heading: 'Potentiometric First Derivative Plot in Scilab',
            bullets: [
              'Enter volume V and EMF E vectors cleanly.',
              'Compute discrete derivative dEdV = diff(E) ./ diff(V) at midpoint volumes.',
            ],
            formulaOrCode:
              'V = [0 0.5 1.0 1.5 2.0 2.5 3.0];\nE = [210 225 248 390 520 545 558];\ndEdV = diff(E) ./ diff(V);\nV_mid = (V(1:$-1) + V(2:$)) / 2;\nplot(V_mid, dEdV, "-o");\nxlabel("Volume of Titrant (mL)"); ylabel("dE/dV");',
          },
        ],
      },
      {
        id: 'chem-lab-graphs',
        labCategory: 'Model graphs',
        title: 'Model Graphs — Potentiometry, Conductometry & Colorimetry Curves',
        unit: 'Plotting Reference',
        description:
          'Axis labeling rules, expected curve shapes, and equivalence-point intersection checkpoints for all instrumentation experiments.',
        isSample: true,
        downloadable: true,
        fileFormat: 'HTML Reference',
        authorNote: 'Sample Graph Guide',
        previewSummary:
          'Outlines expected V-shaped conductometric curves, sigmoidal pH/EMF curves, and Beer-Lambert linear calibration lines.',
        previewPages: [
          {
            heading: 'Key Model Curve Shapes',
            bullets: [
              'Potentiometry: Sigmoidal E vs V curve, sharp peak in ΔE/ΔV vs average V.',
              'Conductometry (Strong Acid vs Strong Base): Descending line intersecting an ascending line at equivalence volume.',
              'Colorimetry: Straight line passing through origin for Absorbance vs Concentration.',
            ],
          },
        ],
      },
      {
        id: 'chem-lab-viva',
        labCategory: 'Viva questions',
        title: 'Viva Questions — Core Electrochemistry & Volumetric Concepts',
        unit: 'Viva Preparation',
        description:
          'Frequently tested oral viva questions on buffers, indicators, electrodes, and Beer-Lambert assumptions.',
        isSample: true,
        downloadable: false,
        authorNote: 'Sample Viva Bank · Review before lab assessment',
        previewSummary:
          'Concise Q&A checklist covering EDTA complexometry, calomel/glass reference electrodes, and conductance principles.',
        previewPages: [
          {
            heading: 'Essential Viva Questions',
            bullets: [
              'Why is pH 10 ammonia buffer used in EDTA water hardness titration?',
              'Why does conductance initially decrease when NaOH is added to HCl?',
              'What are the limitations of the Beer-Lambert Law at high concentrations?',
            ],
          },
        ],
      },
    ],
    topics: buildChemistryTopics(),
  },
  {
    id: 'physics-lab',
    slug: 'physics',
    subjectLabel: 'Physics',
    name: 'Physics Lab',
    cycle: 'Physics Cycle',
    imagePath: '/src/assets/images/lab_physics_3d_1795180040422.jpg',
    focus:
      'Optics, diffraction, laser wavelength measurement, semiconductor energy gap, and LCR resonance experiments.',
    includesPointers: ['Record', 'Model graphs', 'Viva questions'],
    preparationChecklist: [
      'Verify spectrometer or traveling microscope least count before taking readings.',
      'Plot trial graphs with clear axis units and slope calculations.',
      'Estimate percentage error against standard reference constants.',
    ],
    vivaTopics: [
      'Diffraction grating equation (d sinθ = nλ)',
      'Resonance condition and Q-factor in series LCR circuits',
      'Fermi energy & band gap determination in semiconductors',
    ],
    labItems: [
      {
        id: 'phys-lab-record',
        labCategory: 'Record',
        title: 'Engineering Physics Lab — Record Format & Error Calculation Guide',
        unit: 'Lab Record Guide',
        description:
          'Structured format for least-count derivation, tabular observations, slope formulas, and percentage error reporting.',
        isSample: true,
        downloadable: true,
        fileFormat: 'HTML Study Sheet',
        authorNote: 'Sample Lab Record Guide',
        previewSummary:
          'Covers Vernier/Screw Gauge/Spectrometer least counts and clean SI unit presentation in Physics lab records.',
        previewPages: [
          {
            heading: 'Least Count & Tabular Precision',
            bullets: [
              'Always state Least Count (LC) cleanly above every observation table.',
              'Express final quantities with proper SI units and compare against standard textbook constants.',
            ],
            formulaOrCode:
              'Percentage Error = |Experimental − Standard| / Standard × 100%',
          },
        ],
      },
      {
        id: 'phys-lab-graphs',
        labCategory: 'Model graphs',
        title: 'Model Graphs — LCR Resonance, I-V Characteristics & Fermi Curves',
        unit: 'Plotting Reference',
        description:
          'Expected curve geometry, slope tangents, and bandwidth markers (f1, f2, f_r) for Physics experiments.',
        isSample: true,
        downloadable: true,
        fileFormat: 'HTML Reference',
        authorNote: 'Sample Graph Guide',
        previewSummary:
          'Explains plotting I_max / √2 bandwidth markers on series LCR curves and ln(R) vs 1/T lines for thermistor band gap.',
        previewPages: [
          {
            heading: 'Model Graph Checkpoints',
            bullets: [
              'Series LCR Resonance: Bell-shaped Current vs Frequency curve with f1 and f2 at I_max / √2.',
              'Semiconductor Energy Gap: Linear negative-slope line when plotting log10(R) vs 1/T (in Kelvin).',
              'Diode / Zener Characteristics: Knee voltage in forward bias and sharp breakdown in reverse bias.',
            ],
          },
        ],
      },
      {
        id: 'phys-lab-viva',
        labCategory: 'Viva questions',
        title: 'Viva Questions — Optics, Diffraction & Electrical Resonance',
        unit: 'Viva Preparation',
        description:
          'High-frequency viva concepts covering grating constant, resonance quality factor, and band gap interpretation.',
        isSample: true,
        downloadable: false,
        authorNote: 'Sample Viva Bank',
        previewSummary:
          'Quick viva definitions and physical reasoning checks across optics and electronics experiments.',
        previewPages: [
          {
            heading: 'Essential Physics Viva Prompts',
            bullets: [
              'What is grating element d and how does d sinθ = nλ determine laser wavelength?',
              'Why is total impedance purely resistive (Z = R) at resonance in an LCR circuit?',
              'How does energy band gap control electrical conductivity with rising temperature?',
            ],
          },
        ],
      },
    ],
    topics: buildGenericUnitTopics(
      'physics',
      'Physics',
      ['Record', 'Model graphs', 'Viva questions'],
      4,
    ),
  },
  {
    id: 'python-lab',
    slug: 'python',
    subjectLabel: 'Python',
    name: 'Python Lab',
    cycle: 'Both Cycles',
    imagePath: '/src/assets/images/lab_python_3d_1795180039562.jpg',
    focus:
      'Algorithmic problem solving, modular functions, file handling, and structured debugging in Python.',
    includesPointers: [
      'Practice questions',
      'Programs',
      'Sample outputs',
      'HackerRank challenge questions',
    ],
    preparationChecklist: [
      'Write algorithm steps or pseudocode before typing syntax.',
      'Test functions against empty inputs, zero, and negative edge cases.',
      'Practice reading/writing CSV and plain-text datasets cleanly.',
    ],
    vivaTopics: [
      'Mutable vs immutable data types (list vs tuple)',
      'Time complexity of linear vs binary search',
      'Pass-by-object-reference behavior in Python functions',
    ],
    labItems: [
      {
        id: 'py-lab-practice',
        labCategory: 'Practice questions',
        title: 'Python Lab — Core Practice Questions & Edge-Case Checklist',
        unit: 'Problem Sets',
        description:
          'Focused practice prompts across loops, strings, dictionaries, recursion, and file-based engineering data processing.',
        isSample: true,
        downloadable: true,
        fileFormat: 'HTML Practice Sheet',
        authorNote: 'Sample Practice Set',
        previewSummary:
          'Organized practice prompts testing string slicing, frequency maps, list comprehensions, and exception handling.',
        previewPages: [
          {
            heading: 'Practice Prompts to Trace Before Lab',
            bullets: [
              'Count word frequencies from a multi-line text file while ignoring punctuation and letter case.',
              'Filter a list of sensor dictionaries for readings exceeding a dynamic threshold.',
              'Implement recursive and iterative factorial/Fibonacci comparisons with input guards.',
            ],
          },
        ],
      },
      {
        id: 'py-lab-programs',
        labCategory: 'Programs',
        title: 'Python Lab — Reference Programs & Modular Solutions',
        unit: 'Source Programs',
        description:
          'Clean, well-commented reference Python scripts illustrating functions, file I/O, OOP classes, and sorting.',
        isSample: true,
        downloadable: true,
        fileFormat: 'HTML Code Sheet',
        authorNote: 'Sample Programs',
        previewSummary:
          'Annotated Python functions ready to study, trace, and test in your IDE.',
        previewPages: [
          {
            heading: 'Sample Modular Program — Student Grade Summary',
            bullets: [
              'Separates file parsing, computation, and output formatting into pure functions.',
              'Handles malformed numeric tokens gracefully using try/except.',
            ],
            formulaOrCode:
              'def compute_average(marks: list[float]) -> float:\n    return round(sum(marks) / len(marks), 2) if marks else 0.0\n\nscores = [86.5, 91.0, 78.5, 94.0]\nprint("Average Score:", compute_average(scores))',
          },
        ],
      },
      {
        id: 'py-lab-outputs',
        labCategory: 'Sample outputs',
        title: 'Sample Outputs — Expected Console Traces & Test Cases',
        unit: 'Execution Verification',
        description:
          'Exact formatted console outputs and boundary test cases to compare against your own program runs.',
        isSample: true,
        downloadable: true,
        fileFormat: 'HTML Verification Guide',
        authorNote: 'Sample Output Traces',
        previewSummary:
          'Verify whitespace, float rounding, and edge-case terminal outputs before submitting lab code.',
        previewPages: [
          {
            heading: 'Console Output Trace Comparison',
            bullets: [
              'Check newline formatting and exact spacing when automated test runners compare stdout.',
              'Always test empty input [], single-element [42], and duplicate-value inputs.',
            ],
            formulaOrCode:
              'Input: [4, 2, 7, 2, 9]\nSorted Unique: [2, 4, 7, 9]\nMax Difference: 7',
          },
        ],
      },
      {
        id: 'py-lab-hackerrank',
        labCategory: 'HackerRank challenge questions',
        title: 'HackerRank Challenge Questions — Timed Coding Strategy & Patterns',
        unit: 'Competitive / Test Prep',
        description:
          'Problem-solving patterns for HackerRank-style lab tests: reading stdin reliably, handling multiple test cases, and avoiding O(n²) timeouts.',
        isSample: true,
        downloadable: false,
        authorNote: 'Sample Challenge Prep Guide',
        previewSummary:
          'Covers sys.stdin parsing, dict/set O(1) lookups, and two-pointer techniques for timed coding assessments.',
        previewPages: [
          {
            heading: 'HackerRank Test Strategy',
            bullets: [
              'Parse space-separated integers cleanly with list(map(int, input().split())).',
              'Use sets/dictionaries instead of nested loops when input size N ≥ 10^4.',
              'Return exact required format—no extra prompt text inside input("...") on automated judges!',
            ],
          },
        ],
      },
    ],
    topics: buildGenericUnitTopics(
      'python',
      'Python',
      [
        'Practice questions',
        'Programs',
        'Sample outputs',
        'HackerRank challenge questions',
      ],
      4,
    ),
  },
  {
    id: 'matlab-lab',
    slug: 'matlab',
    subjectLabel: 'Matlab',
    name: 'Matlab Lab',
    cycle: 'Both Cycles',
    imagePath: '/src/assets/images/lab_matlab_3d_1795180040399.jpg',
    focus:
      'Matrix operations, symbolic & numerical solving, 2D/3D engineering visualization, and script/function modeling.',
    includesPointers: ['Slides', 'Important lab questions'],
    preparationChecklist: [
      'Verify matrix dimensions and element-wise operators (.*, ./, .^) before running scripts.',
      'Label axes, titles, units, and legends cleanly on every generated 2D/3D plot.',
      'Clear stale workspace variables and check function file naming conventions.',
    ],
    vivaTopics: [
      'Difference between matrix multiplication (*) and element-wise multiplication (.*)',
      'Using linspace vs colon (:) operator for sampled engineering arrays',
      'Plotting 3D meshes and surface contours using meshgrid and surf',
    ],
    labItems: [
      {
        id: 'matlab-lab-slides',
        labCategory: 'Slides',
        title: 'Matlab Lab — Core Syntax, Matrices & Plotting Slides',
        unit: 'Lecture Slides',
        description:
          'Concise slide deck reviewing workspace commands, vector indexing, element-wise math, subplot layouts, and 3D surf plotting.',
        isSample: true,
        downloadable: true,
        fileFormat: 'HTML Slide Deck',
        authorNote: 'Sample Matlab Slide Summary',
        previewSummary:
          'Quick visual review of MATLAB commands commonly needed during first-year engineering labs.',
        previewPages: [
          {
            heading: 'Slide 1 — Vectorized Operations & 2D Plotting',
            bullets: [
              'Always clear stale state at script top with `clc; clear; close all;`.',
              'Use dot operators `.*`, `./`, `.^` for element-wise calculations over arrays.',
            ],
            formulaOrCode:
              'x = linspace(0, 2*pi, 200);\ny = sin(x) .* exp(-0.2*x);\nplot(x, y, "LineWidth", 1.8); grid on;\nxlabel("x (rad)"); ylabel("y(x)"); title("Damped Sinusoid");',
          },
          {
            heading: 'Slide 2 — 3D Surface & Mesh Plotting',
            bullets: [
              'Generate 2D coordinate grids using `[X, Y] = meshgrid(x, y);`.',
              'Visualize surfaces via `surf(X, Y, Z)` or `mesh(X, Y, Z)` with colorbar.',
            ],
          },
        ],
      },
      {
        id: 'matlab-lab-questions',
        labCategory: 'Important lab questions',
        title: 'Matlab Lab — Important Lab Questions & Solving Patterns',
        unit: 'Important Questions',
        description:
          'Key MATLAB lab exercise patterns covering linear system solving (A\\b), polynomial fitting, numerical integration, and ODE solvers.',
        isSample: true,
        downloadable: true,
        fileFormat: 'HTML Study Sheet',
        authorNote: 'Sample Lab Question Patterns',
        previewSummary:
          'Summarizes essential MATLAB functions and verification questions tested in engineering labs.',
        previewPages: [
          {
            heading: 'High-Priority MATLAB Lab Patterns',
            bullets: [
              'Solve linear equations Ax = b accurately using backslash operator `x = A \\ b`.',
              'Find roots of nonlinear equations with `fzero` and integrate curves via `integral`.',
              'Write custom `.m` function files matching the exact function name and test outputs in Command Window.',
            ],
          },
        ],
      },
    ],
    topics: buildGenericUnitTopics(
      'matlab',
      'Matlab',
      ['Slides', 'Important lab questions'],
      4,
    ),
  },
];

export const GLOBAL_REFERENCE_BOOKS: GlobalReferenceBook[] = [
  {
    id: 'ref-grewal',
    title: 'Higher Engineering Mathematics',
    authors: 'B.S. Grewal',
    subject: 'Mathematics',
    cycle: 'Both Cycles',
    summary:
      'Standard reference for differential calculus, matrices, multiple integrals, Laplace transforms, and ODEs.',
  },
  {
    id: 'ref-kreyszig',
    title: 'Advanced Engineering Mathematics',
    authors: 'Erwin Kreyszig',
    subject: 'Mathematics',
    cycle: 'Both Cycles',
    summary:
      'In-depth conceptual treatment of linear algebra, vector calculus, Fourier analysis, and differential equations.',
  },
  {
    id: 'ref-downey',
    title: 'Think Python: How to Think Like a Computer Scientist',
    authors: 'Allen B. Downey',
    subject: 'Python',
    cycle: 'Both Cycles',
    summary:
      'Accessible open-access guide to algorithmic thinking, functions, recursion, and Python data structures.',
  },
  {
    id: 'ref-sadiku',
    title: 'Fundamentals of Electric Circuits',
    authors: 'C.K. Alexander & M.N.O. Sadiku',
    subject: 'EEE',
    cycle: 'Physics Cycle',
    summary:
      'Rigorous circuit analysis covering mesh/nodal methods, AC phasors, power, and magnetically coupled networks.',
  },
  {
    id: 'ref-hibbeler',
    title: 'Engineering Mechanics: Statics & Dynamics',
    authors: 'R.C. Hibbeler',
    subject: 'Mechanics',
    cycle: 'Chemistry Cycle',
    summary:
      'Visual free-body diagram instruction for force systems, trusses, friction, inertia, and rigid-body kinematics.',
  },
  {
    id: 'ref-avadhanulu',
    title: 'A Textbook of Engineering Physics',
    authors: 'M.N. Avadhanulu & P.G. Kshirsagar',
    subject: 'Physics',
    cycle: 'Physics Cycle',
    summary:
      'Covers quantum mechanics, lasers, fiber optics, crystallography, and semiconductor physics.',
  },
  {
    id: 'ref-jain',
    title: 'Engineering Chemistry',
    authors: 'P.C. Jain & Monica Jain',
    subject: 'Chemistry',
    cycle: 'Chemistry Cycle',
    summary:
      'Comprehensive first-year reference for electrochemistry, corrosion science, polymers, and water technology.',
  },
  {
    id: 'ref-ulrich',
    title: 'Product Design and Development',
    authors: 'K.T. Ulrich & S.D. Eppinger',
    subject: 'EPD',
    cycle: 'Chemistry Cycle',
    summary:
      'Structured framework for product planning, concept generation, architecture, and prototyping.',
  },
  {
    id: 'ref-basu',
    title: 'Introduction to the Constitution of India',
    authors: 'Durga Das Basu',
    subject: 'Constitution',
    cycle: 'Chemistry Cycle',
    summary:
      'Authoritative primer on constitutional articles, fundamental rights, governance, and amendments.',
  },
];
