export type CycleSlug = 'physics-cycle' | 'chemistry-cycle';

export type ResourceCategorySlug =
  | 'handwritten-notes'
  | 'slides'
  | 'previous-year-questions'
  | 'reference-materials';

export interface ResourceCategoryMeta {
  slug: ResourceCategorySlug;
  title: string;
  shortDescription: string;
}

export interface ResourceSlidePage {
  heading: string;
  bullets: string[];
  formulaOrCode?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  unit: string;
  description: string;
  isSample: boolean;
  downloadable: boolean;
  fileFormat?: string;
  authorNote?: string;
  previewSummary: string;
  previewPages?: ResourceSlidePage[];
  externalReferenceNote?: string;
}

export interface SubjectDefinition {
  slug: string;
  name: string;
  shortName: string;
  cycleSlug: CycleSlug;
  cycleName: string;
  tagline: string;
  description: string;
  visualTheme:
    | 'python'
    | 'mathematics'
    | 'eee'
    | 'mechanical'
    | 'physics'
    | 'environmental'
    | 'epd'
    | 'mechanics'
    | 'chemistry'
    | 'constitution';
  coreTopics: string[];
  resources: Record<ResourceCategorySlug, ResourceItem[]>;
}

export interface CycleDefinition {
  slug: CycleSlug;
  name: string;
  shortDescription: string;
  heroDescription: string;
  imagePath: string;
  subjects: SubjectDefinition[];
}

export const RESOURCE_CATEGORIES: ResourceCategoryMeta[] = [
  {
    slug: 'handwritten-notes',
    title: 'Handwritten Notes',
    shortDescription:
      'Structured topic summaries, derivations, and annotated diagrams organized unit by unit.',
  },
  {
    slug: 'slides',
    title: 'Slides',
    shortDescription:
      'Clean lecture decks and concise slide summaries for fast classroom review and revision.',
  },
  {
    slug: 'previous-year-questions',
    title: 'Question Bank',
    shortDescription:
      'Practice paper templates and exam-pattern preparation frameworks ready for question uploads.',
  },
  {
    slug: 'reference-materials',
    title: 'Reference Materials',
    shortDescription:
      'Standard engineering textbooks, formula sheets, and foundational concept references.',
  },
];

// Shared foundational sample modules for Python & Mathematics so cycle-specific
// syllabi can extend or reuse common modules cleanly.
const sharedPythonHandwrittenSample: ResourceItem = {
  id: 'py-hw-sample-1',
  title: 'Python Control Flow, Functions & Data Structures — Study Guide',
  unit: 'Foundations Module',
  description:
    'Demonstrates how handwritten-style annotated notes appear in preview and offline download mode.',
  isSample: true,
  downloadable: true,
  fileFormat: 'HTML Study Sheet',
  authorNote: 'Sample Content · Replace or append your own PDF/image notes anytime',
  previewSummary:
    'Covers conditional branching, loop invariants, function scope, lists, tuples, dictionaries, and string slicing with worked traces.',
  previewPages: [
    {
      heading: '1. Variables, Types & Control Flow',
      bullets: [
        'Dynamic typing binds names to objects at runtime; use type() and isinstance() to inspect types.',
        'Prefer crisp if / elif / else guards and avoid deeply nested loops when early return clarifies logic.',
        'Loop patterns: range(start, stop, step) excludes stop; enumerate(seq) yields (index, value) cleanly.',
      ],
      formulaOrCode:
        'def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        lo, hi = (mid + 1, hi) if arr[mid] < target else (lo, mid - 1)\n    return -1',
    },
    {
      heading: '2. Core Collections & Complexity Notes',
      bullets: [
        'List (mutable sequence): O(1) amortized append, O(n) membership check.',
        'Tuple (immutable sequence): safe for fixed coordinate pairs and dictionary keys.',
        'Dictionary (hash map): O(1) average key lookup; ideal for frequency counting and memoization.',
      ],
      formulaOrCode:
        'freq = {}\nfor ch in "engineering":\n    freq[ch] = freq.get(ch, 0) + 1',
    },
  ],
};

const sharedPythonSlidesSample: ResourceItem = {
  id: 'py-sl-sample-1',
  title: 'Lecture Deck: Modular Functions, Recursion & File Handling',
  unit: 'Foundations Module',
  description:
    'Sample multi-slide lecture deck demonstrating slide-by-slide preview and local download.',
  isSample: true,
  downloadable: true,
  fileFormat: 'HTML Slide Deck',
  authorNote: 'Sample Content · Ready for custom PPTX/PDF lecture decks',
  previewSummary:
    'Walks through stack frames in recursion, base cases, default mutable argument pitfalls, and safe context-managed file I/O.',
  previewPages: [
    {
      heading: 'Slide 1 — Designing Clean Functions',
      bullets: [
        'Single Responsibility: one function should compute or transform one clear unit of work.',
        'Avoid mutable default arguments like def add_item(x, bucket=[]): use None instead.',
        'Document input types and return invariants in concise docstrings.',
      ],
      formulaOrCode:
        'def append_safe(item, bucket=None):\n    if bucket is None:\n        bucket = []\n    bucket.append(item)\n    return bucket',
    },
    {
      heading: 'Slide 2 — File I/O with Context Managers',
      bullets: [
        'Always open files with `with open(...)` so file descriptors close automatically even on exceptions.',
        'Use strip() when parsing line-by-line engineering telemetry or CSV records.',
      ],
      formulaOrCode:
        'with open("readings.txt", "r", encoding="utf-8") as f:\n    values = [float(line.strip()) for line in f if line.strip()]',
    },
  ],
};

function createSubjectResources(config: {
  subjectSlug: string;
  subjectName: string;
  sampleNote: ResourceItem;
  sampleSlide: ResourceItem;
  samplePyqNote: string;
  referenceBooks: { title: string; authors: string; focus: string }[];
}): Record<ResourceCategorySlug, ResourceItem[]> {
  return {
    'handwritten-notes': [config.sampleNote],
    slides: [config.sampleSlide],
    'previous-year-questions': [
      {
        id: `${config.subjectSlug}-pyq-template`,
        title: `${config.subjectName} — Exam Practice Checklist & Paper Template`,
        unit: 'Exam Preparation',
        description: config.samplePyqNote,
        isSample: true,
        downloadable: false,
        authorNote:
          'Sample Template · Official university question papers are not fabricated; add your institution papers here.',
        previewSummary:
          'Structured preparation checklist covering Part A short conceptual questions, Part B derivations, and numerical problem verification steps.',
        previewPages: [
          {
            heading: 'Exam Preparation Structure (Sample Template)',
            bullets: [
              'Short Conceptual Prompts: Practice 2-mark definitions, units, and boundary conditions.',
              'Derivation Mastery: Reproduce core equations step-by-step without peeking at notes.',
              'Numerical Verification: Check dimensional consistency and significant figures on every answer.',
            ],
          },
        ],
      },
    ],
    'reference-materials': config.referenceBooks.map((book, idx) => ({
      id: `${config.subjectSlug}-ref-${idx + 1}`,
      title: book.title,
      unit: 'Recommended Reading',
      description: `Authors: ${book.authors}. ${book.focus}`,
      isSample: false,
      downloadable: false,
      authorNote: 'Recommended Textbook Reference · Consult your library or publisher edition',
      previewSummary: `${book.title} by ${book.authors} — ${book.focus}`,
      previewPages: [
        {
          heading: book.title,
          bullets: [
            `Authors: ${book.authors}`,
            `Primary Focus: ${book.focus}`,
            'Use this standard reference alongside your lecture notes for deeper proofs and worked examples.',
          ],
        },
      ],
    })),
  };
}

export const CYCLES: CycleDefinition[] = [
  {
    slug: 'physics-cycle',
    name: 'Physics Cycle',
    shortDescription:
      'Build core foundations in programming, engineering mathematics, electrical circuits, mechanical systems, applied physics, and sustainability.',
    heroDescription:
      'Six foundational first-year subjects bridging computational problem solving, mathematical modeling, electrical & mechanical principles, and modern engineering physics.',
    imagePath: '/src/assets/images/physics_cycle_3d_1794997638567.jpg',
    subjects: [
      {
        slug: 'python',
        name: 'Python',
        shortName: 'Python',
        cycleSlug: 'physics-cycle',
        cycleName: 'Physics Cycle',
        tagline: 'Problem solving, algorithms, and structured programming',
        description:
          'Master Python syntax, control flow, modular functions, data structures, file handling, and introductory scientific scripting for engineering problems.',
        visualTheme: 'python',
        coreTopics: [
          'Introduction',
          'Collections and Functions',
          'Functions, Fundamental Programming, and Modules',
          'Testing, Debugging, and Object-Oriented Programming',
        ],
        resources: {
          'handwritten-notes': [
            {
              ...sharedPythonHandwrittenSample,
              id: 'phy-py-hw-1',
            },
          ],
          slides: [
            {
              ...sharedPythonSlidesSample,
              id: 'phy-py-sl-1',
            },
          ],
          'previous-year-questions': [
            {
              id: 'phy-py-pyq-1',
              title: 'Python Programming — Sample Coding & Tracing Practice Framework',
              unit: 'Exam Preparation',
              description:
                'Structured practice guide for dry-running loops, debugging edge cases, and writing clean functions.',
              isSample: true,
              downloadable: false,
              authorNote:
                'Sample Template · Upload your university question papers when ready',
              previewSummary:
                'Demonstrates how previous-year coding questions and output-tracing sets can be organized by topic.',
              previewPages: [
                {
                  heading: 'Practice Pattern: Output Tracing & Problem Solving',
                  bullets: [
                    'Trace list aliasing vs shallow copying (b = a[:] vs b = a).',
                    'Write clean iterative and recursive solutions with explicit edge-case checks.',
                    'Practice reading and aggregating structured text files without external libraries.',
                  ],
                },
              ],
            },
          ],
          'reference-materials': [
            {
              id: 'phy-py-ref-1',
              title: 'Think Python: How to Think Like a Computer Scientist',
              unit: 'Recommended Reading',
              description:
                'Authors: Allen B. Downey. Open-access foundational textbook for algorithmic thinking in Python.',
              isSample: false,
              downloadable: false,
              authorNote: 'Standard Open-Access Reference',
              previewSummary:
                'Clear introduction to functions, recursion, data structures, and debugging workflows for first-year students.',
              previewPages: [
                {
                  heading: 'Think Python — Recommended Chapters',
                  bullets: [
                    'Chapters 1–6: Variables, functions, conditionals, and fruitful recursion.',
                    'Chapters 8–12: Strings, lists, dictionaries, and tuples.',
                    'Chapters 14–16: Files, classes, and engineering debugging habits.',
                  ],
                },
              ],
            },
            {
              id: 'phy-py-ref-2',
              title: 'Python Official Documentation & Standard Library Guide',
              unit: 'Official Language Reference',
              description:
                'Authoritative specification for built-in types, math, itertools, and pathlib modules.',
              isSample: false,
              downloadable: false,
              authorNote: 'Standard Reference',
              previewSummary:
                'Use the official Python tutorial and standard library docs to verify built-in method signatures.',
            },
          ],
        },
      },
      {
        slug: 'mathematics',
        name: 'Mathematics',
        shortName: 'Mathematics',
        cycleSlug: 'physics-cycle',
        cycleName: 'Physics Cycle',
        tagline: 'Differential calculus, linear algebra & vector analysis',
        description:
          'Develop analytical fluency in multivariable calculus, Taylor series, matrices, eigenvalues, and differential equations used across engineering.',
        visualTheme: 'mathematics',
        coreTopics: [
          'Partial Differentiation',
          'Higher Order Differential Equations',
          'Partial Differential Equations',
          'Special Functions and Series Solutions of Differential Equations',
        ],
        resources: createSubjectResources({
          subjectSlug: 'phy-math',
          subjectName: 'Engineering Mathematics (Physics Cycle)',
          sampleNote: {
            id: 'phy-math-hw-1',
            title: 'Multivariable Calculus, Jacobians & Linear Algebra — Study Sheet',
            unit: 'Calculus & Matrices Sample',
            description:
              'Sample annotated summary covering partial derivatives, extrema, and matrix diagonalization.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Study Sheet',
            authorNote: 'Sample Content · Plug in handwritten PDFs per syllabus unit',
            previewSummary:
              'Step-by-step summary of Euler theorem on homogeneous functions, Jacobian determinants, and Cayley-Hamilton verification.',
            previewPages: [
              {
                heading: '1. Partial Derivatives & Jacobians',
                bullets: [
                  'If u = f(x, y) and v = g(x, y), the Jacobian J = ∂(u, v)/∂(x, y) measures local area scaling.',
                  'Chain property: J(u, v / r, θ) = J(u, v / x, y) × J(x, y / r, θ).',
                  'Stationary points require fx = 0 and fy = 0; classify via r·t − s² > 0.',
                ],
                formulaOrCode: 'J = det([[∂u/∂x, ∂u/∂y], [∂v/∂x, ∂v/∂y]])',
              },
              {
                heading: '2. Eigenvalues & Cayley-Hamilton Theorem',
                bullets: [
                  'Solve det(A − λI) = 0 to obtain characteristic eigenvalues λ.',
                  'Every square matrix satisfies its own characteristic polynomial p(A) = 0.',
                ],
                formulaOrCode: 'A·v = λ·v   ⇒   (A − λI)·v = 0',
              },
            ],
          },
          sampleSlide: {
            id: 'phy-math-sl-1',
            title: 'Lecture Deck: Differential Calculus & Taylor Expansions',
            unit: 'Calculus Foundations',
            description:
              'Sample lecture slides illustrating curvature, Maclaurin series, and indeterminate forms.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Slide Deck',
            authorNote: 'Sample Content · Ready for your faculty slide decks',
            previewSummary:
              'Concise visual walkthrough of radius of curvature and standard Maclaurin series expansions.',
            previewPages: [
              {
                heading: 'Slide 1 — Radius of Curvature',
                bullets: [
                  'Cartesian form: ρ = (1 + y₁²)^(3/2) / |y₂|.',
                  'Polar form: ρ = (r² + r₁²)^(3/2) / (r² + 2r₁² − r·r₂).',
                ],
                formulaOrCode: 'e^x = 1 + x + x²/2! + x³/3! + ...',
              },
            ],
          },
          samplePyqNote:
            'Practice structure for proof derivations, Jacobian evaluations, and matrix rank/eigenvalue numericals.',
          referenceBooks: [
            {
              title: 'Higher Engineering Mathematics',
              authors: 'B.S. Grewal',
              focus: 'Comprehensive worked examples for calculus, linear algebra, and ODEs.',
            },
            {
              title: 'Advanced Engineering Mathematics',
              authors: 'Erwin Kreyszig',
              focus: 'Rigorous engineering applications of linear algebra, vector calculus, and differential equations.',
            },
          ],
        }),
      },
      {
        slug: 'eee',
        name: 'EEE',
        shortName: 'EEE',
        cycleSlug: 'physics-cycle',
        cycleName: 'Physics Cycle',
        tagline: 'DC/AC circuits, transformers, machines & power safety',
        description:
          'Understand Kirchhoff laws, AC phasors, single-phase & three-phase power, transformers, DC/AC machines, and domestic electrical safety.',
        visualTheme: 'eee',
        coreTopics: [
          'UNIT 1',
          'UNIT 2',
          'UNIT 3',
          'UNIT 4',
        ],
        resources: createSubjectResources({
          subjectSlug: 'phy-eee',
          subjectName: 'Elements of Electrical Engineering',
          sampleNote: {
            id: 'phy-eee-hw-1',
            title: 'AC Phasors, Power Factor & Transformer Losses — Study Guide',
            unit: 'Circuits & Machines Sample',
            description:
              'Sample notes summarizing KVL/KCL, RMS values, impedance triangles, and transformer efficiency.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Study Sheet',
            authorNote: 'Sample Content · Replace with scanned circuit notes anytime',
            previewSummary:
              'Covers sinusoidal RMS/average values, active vs reactive power, and open-circuit/short-circuit transformer test equations.',
            previewPages: [
              {
                heading: '1. AC Sinusoidal Quantities & Power',
                bullets: [
                  'For sinusoidal wave v(t) = Vm sin(ωt): V_rms = Vm / √2 ≈ 0.707 Vm.',
                  'Impedance Z = R + j(X_L − X_C), phase angle φ = arctan((X_L − X_C)/R).',
                  'Real Power P = V·I·cos(φ) [W], Reactive Q = V·I·sin(φ) [VAR], Apparent S = V·I [VA].',
                ],
                formulaOrCode: 'Power Factor = cos(φ) = P / S = R / |Z|',
              },
              {
                heading: '2. Single-Phase Transformer Essentials',
                bullets: [
                  'EMF Equation: E = 4.44 · f · N · Φ_m.',
                  'Maximum efficiency occurs when Core (Iron) loss equals Copper loss (Pi = I²R).',
                ],
              },
            ],
          },
          sampleSlide: {
            id: 'phy-eee-sl-1',
            title: 'Lecture Deck: Mesh, Nodal Analysis & Three-Phase Systems',
            unit: 'Network Analysis',
            description:
              'Sample slides contrasting Star (Y) and Delta (Δ) three-phase line/phase relations.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Slide Deck',
            authorNote: 'Sample Content',
            previewSummary:
              'Quick-reference summary of Star vs Delta voltage/current formulas and balanced three-phase power.',
            previewPages: [
              {
                heading: 'Slide 1 — Star vs Delta Connections',
                bullets: [
                  'Star (Y): V_L = √3 · V_ph, I_L = I_ph.',
                  'Delta (Δ): V_L = V_ph, I_L = √3 · I_ph.',
                  'Total 3-phase active power (both configurations): P = √3 · V_L · I_L · cos(φ).',
                ],
              },
            ],
          },
          samplePyqNote:
            'Practice outline for mesh/nodal problems, phasor diagrams, and transformer efficiency calculations.',
          referenceBooks: [
            {
              title: 'Basic Electrical Engineering',
              authors: 'D.C. Kulshreshtha',
              focus: 'Foundational DC/AC circuits, magnetic circuits, and electrical machines.',
            },
            {
              title: 'Fundamentals of Electric Circuits',
              authors: 'Charles K. Alexander & Matthew N.O. Sadiku',
              focus: 'Step-by-step circuit analysis and AC power methods.',
            },
          ],
        }),
      },
      {
        slug: 'mechanical',
        name: 'Mechanical',
        shortName: 'Mechanical',
        cycleSlug: 'physics-cycle',
        cycleName: 'Physics Cycle',
        tagline: 'Thermodynamics, turbines, IC engines & manufacturing basics',
        description:
          'Explore energy conversion systems, steam properties, internal combustion engines, refrigeration, machining processes, and mechatronics fundamentals.',
        visualTheme: 'mechanical',
        coreTopics: [
          'Steam Formation & Boilers',
          'IC Engines & Efficiency',
          'Turbines & Refrigeration Cycles',
          'Lathe, Welding & CNC Basics',
        ],
        resources: createSubjectResources({
          subjectSlug: 'phy-mech',
          subjectName: 'Elements of Mechanical Engineering',
          sampleNote: {
            id: 'phy-mech-hw-1',
            title: 'Steam Properties, IC Engines & Power Transmission — Study Guide',
            unit: 'Thermal & Manufacturing Sample',
            description:
              'Sample study sheet covering enthalpy of steam, 4-stroke vs 2-stroke cycles, and gear ratio formulas.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Study Sheet',
            authorNote: 'Sample Content',
            previewSummary:
              'Clear summary of dryness fraction, indicated/brake power, mechanical efficiency, and belt/gear drive ratios.',
            previewPages: [
              {
                heading: '1. Steam Enthalpy & Dryness Fraction',
                bullets: [
                  'Wet steam enthalpy: h = hf + x · hfg, where x is dryness fraction (0 ≤ x ≤ 1).',
                  'Superheated steam enthalpy: h_sup = hg + Cp_s · (T_sup − T_sat).',
                ],
                formulaOrCode: 'η_mech = Brake Power (BP) / Indicated Power (IP)',
              },
              {
                heading: '2. Belt & Gear Drive Velocity Ratios',
                bullets: [
                  'Simple gear train ratio: N1 / N2 = T2 / T1.',
                  'Open belt length depends on pulley diameters D1, D2 and center distance C.',
                ],
              },
            ],
          },
          sampleSlide: {
            id: 'phy-mech-sl-1',
            title: 'Lecture Deck: Lathe Operations, Joining & CNC Overview',
            unit: 'Manufacturing Processes',
            description:
              'Sample slides outlining turning, facing, taper turning, arc welding, and additive manufacturing.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Slide Deck',
            authorNote: 'Sample Content',
            previewSummary:
              'Summarizes fundamental machine tools and modern automated manufacturing workflows.',
            previewPages: [
              {
                heading: 'Slide 1 — Primary Lathe & Joining Operations',
                bullets: [
                  'Turning reduces external cylinder diameter; Facing machines flat end surfaces.',
                  'Arc welding uses localized electric arc heat with flux-coated electrodes.',
                  'CNC translates G-code toolpaths into coordinated multi-axis motion.',
                ],
              },
            ],
          },
          samplePyqNote:
            'Practice structure for labelled engine/turbine diagrams, steam enthalpy numericals, and machining comparisons.',
          referenceBooks: [
            {
              title: 'Elements of Mechanical Engineering',
              authors: 'K.R. Gopalakrishna',
              focus: 'First-year thermal systems, turbines, IC engines, and workshop processes.',
            },
            {
              title: 'Manufacturing Technology',
              authors: 'P.N. Rao',
              focus: 'Foundations of casting, welding, forming, and machining.',
            },
          ],
        }),
      },
      {
        slug: 'physics',
        name: 'Physics',
        shortName: 'Physics',
        cycleSlug: 'physics-cycle',
        cycleName: 'Physics Cycle',
        tagline: 'Quantum mechanics, lasers, optical fibers & solid-state physics',
        description:
          'Connect wave mechanics, Schrödinger equations, laser physics, optical fiber propagation, and semiconductor band theory to modern engineering.',
        visualTheme: 'physics',
        coreTopics: [
          'Oscillations & Resonance',
          'Quantum Mechanics & Wavefunctions',
          'Lasers & Optical Fibers',
          'Electrical Conductivity & Semiconductors',
        ],
        resources: createSubjectResources({
          subjectSlug: 'phy-physics',
          subjectName: 'Engineering Physics',
          sampleNote: {
            id: 'phy-phys-hw-1',
            title: 'Quantum Mechanics, Lasers & Optical Fibers — Formula & Concept Guide',
            unit: 'Modern Physics Sample',
            description:
              'Sample study guide covering de Broglie waves, particle in a 1D box, Einstein coefficients, and numerical aperture.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Study Sheet',
            authorNote: 'Sample Content',
            previewSummary:
              'Covers time-independent Schrödinger equation in an infinite potential well, population inversion, and total internal reflection in step-index fibers.',
            previewPages: [
              {
                heading: '1. Particle in a 1D Infinite Potential Well',
                bullets: [
                  'Normalized eigenfunctions: ψ_n(x) = √(2/L) · sin(nπx / L) for 0 < x < L.',
                  'Quantized energy levels: E_n = (n² h²) / (8 m L²), n = 1, 2, 3...',
                ],
                formulaOrCode: 'λ = h / p = h / √(2 m q V)',
              },
              {
                heading: '2. Optical Fiber Acceptance & Numerical Aperture',
                bullets: [
                  'Total internal reflection requires n_core (n₁) > n_cladding (n₂).',
                  'Numerical Aperture: NA = sin(θ_0) = √(n₁² − n₂²).',
                ],
              },
            ],
          },
          sampleSlide: {
            id: 'phy-phys-sl-1',
            title: 'Lecture Deck: Laser Fundamentals & Semiconductor Fermi Levels',
            unit: 'Photonics & Solid State',
            description:
              'Sample slide summary of spontaneous vs stimulated emission and Fermi-Dirac distribution.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Slide Deck',
            authorNote: 'Sample Content',
            previewSummary:
              'Reviews metastable states, optical resonators, and temperature dependence of Fermi occupation probability.',
            previewPages: [
              {
                heading: 'Slide 1 — Stimulated Emission & Optical Cavity',
                bullets: [
                  'Population inversion requires N₂ > N₁ via optical or electrical pumping.',
                  'Optical resonator mirrors provide positive feedback for coherent, monochromatic output.',
                ],
              },
            ],
          },
          samplePyqNote:
            'Practice layout for wave-equation derivations, optical fiber numericals, and Fermi-level calculations.',
          referenceBooks: [
            {
              title: 'A Textbook of Engineering Physics',
              authors: 'M.N. Avadhanulu & P.G. Kshirsagar',
              focus: 'Optics, quantum physics, acoustics, and solid-state materials.',
            },
            {
              title: 'Concepts of Modern Physics',
              authors: 'Arthur Beiser',
              focus: 'Intuitive derivations in quantum mechanics and atomic physics.',
            },
          ],
        }),
      },
      {
        slug: 'environmental-science',
        name: 'Environmental Science',
        shortName: 'Env. Science',
        cycleSlug: 'physics-cycle',
        cycleName: 'Physics Cycle',
        tagline: 'Ecosystems, energy transitions, pollution control & sustainability',
        description:
          'Study ecological balance, renewable energy technologies, water/air quality engineering, solid waste management, and sustainable design standards.',
        visualTheme: 'environmental',
        coreTopics: [
          'Ecosystems & Biodiversity',
          'Renewable & Conventional Energy',
          'Water & Air Pollution Control',
          'E-Waste & Environmental Policies',
        ],
        resources: createSubjectResources({
          subjectSlug: 'phy-env',
          subjectName: 'Environmental Science',
          sampleNote: {
            id: 'phy-env-hw-1',
            title: 'Water Quality Parameters, Renewable Energy & Waste Systems — Summary',
            unit: 'Sustainability Sample',
            description:
              'Sample notes explaining BOD vs COD, photovoltaic conversion basics, and solid waste hierarchy.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Study Sheet',
            authorNote: 'Sample Content',
            previewSummary:
              'Concise overview of environmental metrics, clean energy trade-offs, and lifecycle engineering.',
            previewPages: [
              {
                heading: '1. Water Quality & Treatment Indicators',
                bullets: [
                  'BOD (Biochemical Oxygen Demand): oxygen consumed by microbes decomposing organic matter over 5 days at 20°C.',
                  'COD (Chemical Oxygen Demand): total chemically oxidizable organic load; always ≥ BOD.',
                ],
              },
              {
                heading: '2. Circular Waste & Energy Hierarchy',
                bullets: [
                  'Prioritize Source Reduction → Reuse → Recycling → Energy Recovery → Safe Disposal.',
                  'Solar PV converts irradiance directly into DC power via p-n junction carrier separation.',
                ],
              },
            ],
          },
          sampleSlide: {
            id: 'phy-env-sl-1',
            title: 'Lecture Deck: Air Quality Standards & Sustainable Engineering',
            unit: 'Environmental Systems',
            description:
              'Sample slides covering particulate control devices, AQI categories, and carbon lifecycle metrics.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Slide Deck',
            authorNote: 'Sample Content',
            previewSummary:
              'Summarizes cyclone separators, electrostatic precipitators, and green engineering principles.',
            previewPages: [
              {
                heading: 'Slide 1 — Industrial Particulate Control',
                bullets: [
                  'Cyclone separators remove coarse particulates via centrifugal vortex separation.',
                  'Electrostatic precipitators (ESP) charge fine fly-ash particles for high-efficiency collection.',
                ],
              },
            ],
          },
          samplePyqNote:
            'Practice structure for case-study answers, environmental impact tables, and clean-energy comparisons.',
          referenceBooks: [
            {
              title: 'Textbook of Environmental Studies for Undergraduate Courses',
              authors: 'Erach Bharucha',
              focus: 'Biodiversity, natural resources, pollution control, and environmental policy.',
            },
            {
              title: 'Introduction to Environmental Engineering and Science',
              authors: 'Gilbert M. Masters & Wendell P. Ela',
              focus: 'Quantitative mass balance, water quality, and atmospheric engineering.',
            },
          ],
        }),
      },
    ],
  },
  {
    slug: 'chemistry-cycle',
    name: 'Chemistry Cycle',
    shortDescription:
      'Explore materials chemistry, engineering mechanics, product design, vector & integral mathematics, Python programming, and constitutional ethics.',
    heroDescription:
      'Six core first-year engineering subjects spanning applied chemistry, statics & dynamics, engineering product design, computational logic, calculus, and civic ethics.',
    imagePath: '/src/assets/images/chemistry_cycle_3d_1794997639171.jpg',
    subjects: [
      {
        slug: 'epd',
        name: 'EPD',
        shortName: 'EPD',
        cycleSlug: 'chemistry-cycle',
        cycleName: 'Chemistry Cycle',
        tagline: 'Engineering Product Design, prototyping & orthographic thinking',
        description:
          'Learn systematic product design thinking, orthographic & isometric projection, CAD modeling principles, material selection, and rapid prototyping.',
        visualTheme: 'epd',
        coreTopics: [
          'Semi-conductor diode',
          'Diode applications',
          'Transistors and operational amplifiers',
          'Digital Electronics',
        ],
        resources: createSubjectResources({
          subjectSlug: 'chem-epd',
          subjectName: 'Engineering Product Design (EPD)',
          sampleNote: {
            id: 'chem-epd-hw-1',
            title: 'Engineering Design Process & First-Angle Projection — Study Guide',
            unit: 'Design Foundations Sample',
            description:
              'Sample study notes covering empathy-to-prototype stages, tolerances, and projection conventions.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Study Sheet',
            authorNote: 'Sample Content',
            previewSummary:
              'Explains iterative engineering design stages, first-angle vs third-angle projections, and DFMA checklists.',
            previewPages: [
              {
                heading: '1. Systematic Product Design Lifecycle',
                bullets: [
                  'Problem Framing → Functional Decomposition → Morphological Matrix → Concept Selection → Prototyping.',
                  'Design for Manufacturing & Assembly (DFMA) minimizes part count and standardizes fasteners.',
                ],
              },
              {
                heading: '2. Orthographic Projection Rules',
                bullets: [
                  'First-Angle Projection: Object sits between observer and projection plane; Top view appears below Front view.',
                  'Hidden edges use dashed lines; centerlines use alternating long-short chain lines.',
                ],
              },
            ],
          },
          sampleSlide: {
            id: 'chem-epd-sl-1',
            title: 'Lecture Deck: Parametric CAD & Rapid Prototyping Workflows',
            unit: 'Prototyping',
            description:
              'Sample slide deck summarizing sketch constraints, STL meshing, and tolerance stacks.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Slide Deck',
            authorNote: 'Sample Content',
            previewSummary:
              'Reviews fully constrained 2D sketches, 3D extrusion/revolve features, and FDM prototyping tolerances.',
            previewPages: [
              {
                heading: 'Slide 1 — Parametric CAD & 3D Printing Tolerances',
                bullets: [
                  'Always fully constrain sketch geometry (dimensions + geometric relations) before extruding.',
                  'Allow 0.2–0.3 mm radial clearance for mating FDM-printed snap-fit parts.',
                ],
              },
            ],
          },
          samplePyqNote:
            'Practice framework for concept selection matrices, ergonomic teardowns, and orthographic view sketching.',
          referenceBooks: [
            {
              title: 'Product Design and Development',
              authors: 'Karl T. Ulrich & Steven D. Eppinger',
              focus: 'Structured concept generation, architecture, and prototyping methodology.',
            },
            {
              title: 'Engineering Drawing',
              authors: 'N.D. Bhatt',
              focus: 'Standard conventions for projections, sections, and dimensioning.',
            },
          ],
        }),
      },
      {
        slug: 'mechanics',
        name: 'Mechanics',
        shortName: 'Mechanics',
        cycleSlug: 'chemistry-cycle',
        cycleName: 'Chemistry Cycle',
        tagline: 'Statics, free-body diagrams, trusses, friction & dynamics',
        description:
          'Analyze concurrent and coplanar force systems, equilibrium of rigid bodies, truss member forces, centroids, moment of inertia, and kinematics.',
        visualTheme: 'mechanics',
        coreTopics: [
          'Statics & Force Systems',
          'Equilibrium & Structures',
          'Distributed Forces',
          'Area Moment of Inertia & Friction',
        ],
        resources: createSubjectResources({
          subjectSlug: 'chem-mech',
          subjectName: 'Engineering Mechanics',
          sampleNote: {
            id: 'chem-mech-hw-1',
            title: 'Equilibrium, Friction & Moment of Inertia — Problem-Solving Guide',
            unit: 'Statics Sample',
            description:
              'Sample study notes detailing FBD conventions, Varignon theorem, and parallel axis theorem.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Study Sheet',
            authorNote: 'Sample Content',
            previewSummary:
              'Step-by-step guide to drawing clean Free-Body Diagrams, resolving moments, and computing second moments of area.',
            previewPages: [
              {
                heading: '1. Rigid Body Equilibrium & Varignon Theorem',
                bullets: [
                  'Static equilibrium in 2D requires ΣFx = 0, ΣFy = 0, and ΣM_O = 0.',
                  'Varignon Theorem: Moment of a resultant about any point equals the algebraic sum of moments of its components.',
                ],
                formulaOrCode: 'I_xx = I_G + A · d²   (Parallel Axis Theorem)',
              },
              {
                heading: '2. Dry Friction & Truss Analysis',
                bullets: [
                  'Limiting friction: F_max = μ_s · N; angle of friction tan(φ) = μ_s.',
                  'Method of Joints: Isolate pins with ≤ 2 unknown member forces.',
                ],
              },
            ],
          },
          sampleSlide: {
            id: 'chem-mech-sl-1',
            title: 'Lecture Deck: Centroids of Composite Sections & Kinematics',
            unit: 'Section Properties',
            description:
              'Sample slides explaining composite area tables and rectilinear projectile motion.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Slide Deck',
            authorNote: 'Sample Content',
            previewSummary:
              'Tabular method for composite I-beams and T-sections plus D’Alembert principle basics.',
            previewPages: [
              {
                heading: 'Slide 1 — Composite Centroid Tabular Workflow',
                bullets: [
                  'Divide complex cross-section into standard rectangles, triangles, and subtracted circular cutouts.',
                  'Compute x̄ = Σ(A_i · x_i) / ΣA_i and ȳ = Σ(A_i · y_i) / ΣA_i.',
                ],
              },
            ],
          },
          samplePyqNote:
            'Practice structure for support reaction numericals, wedge/ladder friction, and composite moment of inertia.',
          referenceBooks: [
            {
              title: 'Engineering Mechanics: Statics and Dynamics',
              authors: 'R.C. Hibbeler',
              focus: 'Clear free-body diagram methodology and 3D vector mechanics.',
            },
            {
              title: 'Engineering Mechanics',
              authors: 'S.S. Bhavikatti',
              focus: 'Step-by-step solved numerical problems for first-year exams.',
            },
          ],
        }),
      },
      {
        slug: 'mathematics',
        name: 'Mathematics',
        shortName: 'Mathematics',
        cycleSlug: 'chemistry-cycle',
        cycleName: 'Chemistry Cycle',
        tagline: 'Integral calculus, vector fields, Laplace transforms & PDEs',
        description:
          'Master multiple integrals, vector calculus theorems, Laplace transforms, higher-order linear ODEs, and numerical root-finding methods.',
        visualTheme: 'mathematics',
        coreTopics: [
          'Partial Differentiation',
          'Higher Order Differential Equations',
          'Partial Differential Equations',
          'Special Functions and Series Solutions of Differential Equations',
        ],
        resources: createSubjectResources({
          subjectSlug: 'chem-math',
          subjectName: 'Engineering Mathematics (Chemistry Cycle)',
          sampleNote: {
            id: 'chem-math-hw-1',
            title: 'Multiple Integrals, Vector Theorems & Laplace Transforms — Guide',
            unit: 'Integral & Transform Sample',
            description:
              'Sample study guide covering order of integration, curl/divergence, and inverse Laplace transforms.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Study Sheet',
            authorNote: 'Sample Content · Cycle-specific syllabus companion',
            previewSummary:
              'Summarizes polar/cylindrical double & triple integration, Stokes & Divergence theorems, and Laplace shift properties.',
            previewPages: [
              {
                heading: '1. Multiple Integrals & Polar Substitution',
                bullets: [
                  'In polar coordinates: dx dy = r dr dθ; sketch the integration region before swapping limits.',
                  'Beta-Gamma identity: B(m, n) = Γ(m)Γ(n) / Γ(m + n), and Γ(1/2) = √π.',
                ],
                formulaOrCode: 'ℒ{f′(t)} = s·F(s) − f(0)',
              },
              {
                heading: '2. Vector Calculus Operators',
                bullets: [
                  'Gradient ∇φ points in the direction of steepest ascent.',
                  'Solenoidal field: ∇ · F = 0; Irrotational (conservative) field: ∇ × F = 0.',
                ],
              },
            ],
          },
          sampleSlide: {
            id: 'chem-math-sl-1',
            title: 'Lecture Deck: Numerical Methods — Newton-Raphson & Runge-Kutta',
            unit: 'Numerical Methods',
            description:
              'Sample slides on iterative root-finding convergence and RK4 ODE stepping.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Slide Deck',
            authorNote: 'Sample Content',
            previewSummary:
              'Shows iteration tables for Newton-Raphson and 4th-order Runge-Kutta slope averaging.',
            previewPages: [
              {
                heading: 'Slide 1 — Newton-Raphson & RK4 Formulas',
                bullets: [
                  'Newton-Raphson: x_{n+1} = x_n − f(x_n) / f′(x_n) (quadratic convergence near simple roots).',
                  'RK4 weights midpoint slopes k2 and k3 twice: Δy = (k1 + 2k2 + 2k3 + k4) / 6.',
                ],
              },
            ],
          },
          samplePyqNote:
            'Practice structure for changing order of integration, Laplace ODE solving, and RK4 tabular iterations.',
          referenceBooks: [
            {
              title: 'Higher Engineering Mathematics',
              authors: 'B.S. Grewal',
              focus: 'Multiple integrals, Laplace transforms, and numerical engineering methods.',
            },
            {
              title: 'Advanced Engineering Mathematics',
              authors: 'Erwin Kreyszig',
              focus: 'Vector calculus theorems and differential equation modeling.',
            },
          ],
        }),
      },
      {
        slug: 'python',
        name: 'Python',
        shortName: 'Python',
        cycleSlug: 'chemistry-cycle',
        cycleName: 'Chemistry Cycle',
        tagline: 'Algorithmic scripting, data structures & engineering computation',
        description:
          'Build clean Python programs for data parsing, modular problem solving, basic object-oriented design, and scientific calculation workflows.',
        visualTheme: 'python',
        coreTopics: [
          'Introduction',
          'Collections and Functions',
          'Functions, Fundamental Programming, and Modules',
          'Testing, Debugging, and Object-Oriented Programming',
        ],
        resources: {
          'handwritten-notes': [
            {
              ...sharedPythonHandwrittenSample,
              id: 'chem-py-hw-1',
            },
          ],
          slides: [
            {
              ...sharedPythonSlidesSample,
              id: 'chem-py-sl-1',
            },
          ],
          'previous-year-questions': [
            {
              id: 'chem-py-pyq-1',
              title: 'Python Programming — Sample Algorithm & Exception Practice Guide',
              unit: 'Exam Preparation',
              description:
                'Sample checklist for testing boundary cases, try/except blocks, and dictionary transformations.',
              isSample: true,
              downloadable: false,
              authorNote:
                'Sample Template · Add your institution question papers here',
              previewSummary:
                'Practice prompts focused on writing defensive Python code and verifying trace tables.',
              previewPages: [
                {
                  heading: 'Practice Pattern: Defensive Scripting',
                  bullets: [
                    'Validate numeric input with try / except ValueError.',
                    'Practice list comprehensions and dictionary sorting by key or value.',
                  ],
                },
              ],
            },
          ],
          'reference-materials': [
            {
              id: 'chem-py-ref-1',
              title: 'Think Python: How to Think Like a Computer Scientist',
              unit: 'Recommended Reading',
              description:
                'Authors: Allen B. Downey. Open-access foundational text for Python programming.',
              isSample: false,
              downloadable: false,
              authorNote: 'Standard Open-Access Reference',
              previewSummary:
                'Structured exercises covering functions, data structures, files, and object-oriented basics.',
            },
          ],
        },
      },
      {
        slug: 'chemistry',
        name: 'Chemistry',
        shortName: 'Chemistry',
        cycleSlug: 'chemistry-cycle',
        cycleName: 'Chemistry Cycle',
        tagline: 'Electrochemistry, energy storage, corrosion & smart materials',
        description:
          'Understand Nernst electrochemistry, Li-ion & fuel cells, corrosion prevention, polymers, nanomaterials, and instrumental analytical methods.',
        visualTheme: 'chemistry',
        coreTopics: [
          'Molecular spectroscopy, phase equilibria, and computational chemistry',
          'Electrochemistry and corrosion',
          'Energy storage devices, hydrogen energy, and sensors',
          'Functional materials and green chemistry',
        ],
        resources: createSubjectResources({
          subjectSlug: 'chem-chemistry',
          subjectName: 'Engineering Chemistry',
          sampleNote: {
            id: 'chem-chem-hw-1',
            title: 'Nernst Equation, Batteries & Corrosion Control — Study Guide',
            unit: 'Electrochemistry Sample',
            description:
              'Sample study notes covering electrode potentials, Li-ion intercalation, and galvanic corrosion.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Study Sheet',
            authorNote: 'Sample Content',
            previewSummary:
              'Reviews standard electrode potentials, Nernst calculation at 298 K, and cathodic protection methods.',
            previewPages: [
              {
                heading: '1. Nernst Equation & Cell EMF',
                bullets: [
                  'At 298 K: E = E° − (0.0591 / n) · log10([Reduced] / [Oxidized]).',
                  'E_cell = E_cathode − E_anode; spontaneous reaction requires E_cell > 0 (ΔG < 0).',
                ],
                formulaOrCode: 'ΔG° = −n · F · E°_cell',
              },
              {
                heading: '2. Corrosion Prevention & Battery Chemistry',
                bullets: [
                  'Sacrificial anode (Mg/Zn blocks) protects buried steel pipelines by shifting steel cathodic.',
                  'Li-ion cells shuttle Li+ ions between layered graphite anode and metal-oxide cathode.',
                ],
              },
            ],
          },
          sampleSlide: {
            id: 'chem-chem-sl-1',
            title: 'Lecture Deck: Conducting Polymers & Nanomaterial Characterization',
            unit: 'Engineering Materials',
            description:
              'Sample slides on conjugated polymer doping and surface area effects at nanoscale.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Slide Deck',
            authorNote: 'Sample Content',
            previewSummary:
              'Compares thermoplastics vs thermosets, polyaniline doping, and carbon nanotube properties.',
            previewPages: [
              {
                heading: 'Slide 1 — Polymer & Nanomaterial Basics',
                bullets: [
                  'Conjugated π-electron backbones enable conductivity upon oxidative/reductive doping.',
                  'Decreasing particle dimension to 1–100 nm drastically increases surface-to-volume ratio.',
                ],
              },
            ],
          },
          samplePyqNote:
            'Practice structure for Nernst numericals, cell reaction balancing, and corrosion mechanism diagrams.',
          referenceBooks: [
            {
              title: 'A Textbook of Engineering Chemistry',
              authors: 'Shashi Chawla',
              focus: 'Electrochemistry, polymers, water treatment, and corrosion engineering.',
            },
            {
              title: 'Engineering Chemistry',
              authors: 'P.C. Jain & Monica Jain',
              focus: 'Comprehensive first-year materials chemistry and analytical techniques.',
            },
          ],
        }),
      },
      {
        slug: 'constitution',
        name: 'Constitution',
        shortName: 'Constitution',
        cycleSlug: 'chemistry-cycle',
        cycleName: 'Chemistry Cycle',
        tagline: 'Constitutional framework, fundamental rights & engineering ethics',
        description:
          'Understand constitutional principles, fundamental rights & duties, governance structure, intellectual property awareness, and professional engineering ethics.',
        visualTheme: 'constitution',
        coreTopics: [
          'Introduction to Constitution of India',
          'Federal System Legislature, Executive and Judiciary',
          'Cyber Law and IP Regime',
          'Introduction to E-Commerce and Professional Ethics',
        ],
        resources: createSubjectResources({
          subjectSlug: 'chem-const',
          subjectName: 'Constitution & Professional Ethics',
          sampleNote: {
            id: 'chem-const-hw-1',
            title: 'Fundamental Rights, Duties & Professional Ethics — Summary Notes',
            unit: 'Constitutional Framework Sample',
            description:
              'Sample structured notes organizing key constitutional articles, writs, and ethical duties of engineers.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Study Sheet',
            authorNote: 'Sample Content',
            previewSummary:
              'Clear breakdown of Articles 14–32, Directive Principles of State Policy, and engineering safety/integrity codes.',
            previewPages: [
              {
                heading: '1. Core Constitutional Pillars',
                bullets: [
                  'Articles 14–18: Right to Equality before law and prohibition of discrimination.',
                  'Articles 19–22: Freedoms of speech, assembly, association, and protection of life & personal liberty (Art. 21).',
                  'Article 32: Constitutional remedies via writs (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto).',
                ],
              },
              {
                heading: '2. Engineering Professional Ethics',
                bullets: [
                  'Hold paramount public safety, health, and welfare in engineering design decisions.',
                  'Maintain honesty in testing reports, conflict-of-interest disclosures, and IP attribution.',
                ],
              },
            ],
          },
          sampleSlide: {
            id: 'chem-const-sl-1',
            title: 'Lecture Deck: Governance Structure & Amendment Procedures',
            unit: 'Civic Institutions',
            description:
              'Sample slides mapping Executive, Legislature, Judiciary checks and balances.',
            isSample: true,
            downloadable: true,
            fileFormat: 'HTML Slide Deck',
            authorNote: 'Sample Content',
            previewSummary:
              'Visual overview of bicameral legislature, judicial review, and emergency provisions.',
            previewPages: [
              {
                heading: 'Slide 1 — Separation of Powers',
                bullets: [
                  'Legislature enacts statutes; Executive implements policy; Judiciary safeguards constitutional validity.',
                  'Constitutional amendments under Article 368 require special majority (and state ratification for federal provisions).',
                ],
              },
            ],
          },
          samplePyqNote:
            'Practice structure for article comparisons, writ distinctions, and engineering ethics case studies.',
          referenceBooks: [
            {
              title: 'Introduction to the Constitution of India',
              authors: 'Durga Das Basu',
              focus: 'Authoritative commentary on constitutional articles, federalism, and governance.',
            },
            {
              title: 'Engineering Ethics',
              authors: 'Charles E. Harris, Michael S. Pritchard & Michael J. Rabins',
              focus: 'Case-based engineering responsibility, safety, and professional conduct.',
            },
          ],
        }),
      },
    ],
  },
];

export function getCycleBySlug(cycleSlug?: string): CycleDefinition | undefined {
  return CYCLES.find((c) => c.slug === cycleSlug);
}

export function getSubjectBySlugs(
  cycleSlug?: string,
  subjectSlug?: string,
): SubjectDefinition | undefined {
  const cycle = getCycleBySlug(cycleSlug);
  if (!cycle) return undefined;
  return cycle.subjects.find((s) => s.slug === subjectSlug);
}

export function getCategoryMeta(
  categorySlug?: string,
): ResourceCategoryMeta | undefined {
  return RESOURCE_CATEGORIES.find((c) => c.slug === categorySlug);
}

export function getAllSubjects(): SubjectDefinition[] {
  return CYCLES.flatMap((c) => c.subjects);
}
