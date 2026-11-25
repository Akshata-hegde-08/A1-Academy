export type StudyTipCategory =
  | 'Exam Guide'
  | 'Subject Tips'
  | 'FAQs'
  | 'Placements';

export interface StudyTipItem {
  id: string;
  title: string;
  category: StudyTipCategory;
  summary: string;
  sectionId: string;
  subjectId?: string;
}

export interface GuideNavSection {
  id: string;
  label: string;
  shortLabel: string;
}

export interface ImportantTerm {
  id: string;
  term: string;
  fullName: string;
  description: string;
}

export interface CreditGroup {
  id: string;
  credits: number;
  label: string;
  subjects: string;
  accent: 'blue' | 'purple' | 'teal';
}

export interface MarkDistributionRow {
  exam: string;
  maximumMarks: number;
  reducedMarks: number;
}

export interface SubjectTipBlock {
  number?: string;
  title: string;
  body: string[];
  miniCards?: string[];
}

export interface SubjectUnitTip {
  unitLabel: string;
  title: string;
  tip: string;
}

export interface SubjectGuidance {
  id: string;
  name: string;
  shortName: string;
  hasFullGuide: boolean;
  creditBadge?: string;
  overview: string;
  unitTips?: SubjectUnitTip[];
  numberedTips?: SubjectTipBlock[];
  numericalGuidance?: string;
  isaStrategy?: string;
  esaStrategy?: string;
  highGradeStrategy?: string;
  passStrategy?: string;
  timeManagementTip?: string;
  plannedCategories?: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PlacementSheetLink {
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

export const GUIDE_NAV_SECTIONS: GuideNavSection[] = [
  { id: 'exam-guide', label: 'Exam Guide', shortLabel: 'Exam Guide' },
  { id: 'subject-tips', label: 'Subject-wise Tips', shortLabel: 'Subject Tips' },
  { id: 'faqs', label: 'FAQs', shortLabel: 'FAQs' },
  { id: 'placements', label: 'Placements 🤑', shortLabel: 'Placements 🤑' },
];

export const IMPORTANT_TERMS: ImportantTerm[] = [
  {
    id: 'isa',
    term: 'ISA',
    fullName: 'Internal Semester Assessment',
    description: 'Internal Semester Assessment (two mid-term tests).',
  },
  {
    id: 'esa',
    term: 'ESA',
    fullName: 'End Semester Assessment',
    description: 'End Semester Assessment (final examination).',
  },
  {
    id: 'assignment',
    term: 'Assignment',
    fullName: 'Continuous Coursework',
    description:
      'A small project, activity or test submitted during the semester.',
  },
  {
    id: 'lab',
    term: 'Lab',
    fullName: 'Laboratory Evaluation',
    description: 'Practical evaluation done through experiments or coding tasks.',
  },
];

export const CREDIT_GROUPS: CreditGroup[] = [
  {
    id: '5-credit',
    credits: 5,
    label: '5-Credit Subjects',
    subjects: 'Chemistry / Physics + Python / C++',
    accent: 'blue',
  },
  {
    id: '4-credit',
    credits: 4,
    label: '4-Credit Subjects',
    subjects: 'EPD / EEE + Mathematics + Mechanics / Mechanical',
    accent: 'purple',
  },
  {
    id: '2-credit',
    credits: 2,
    label: '2-Credit Subjects',
    subjects: 'Constitution / Environmental Science',
    accent: 'teal',
  },
];

export const MARK_DISTRIBUTION_ROWS: MarkDistributionRow[] = [
  { exam: 'ISA 1', maximumMarks: 40, reducedMarks: 20 },
  { exam: 'ISA 2', maximumMarks: 40, reducedMarks: 20 },
  { exam: 'ESA', maximumMarks: 100, reducedMarks: 20 },
  { exam: 'Assignments', maximumMarks: 10, reducedMarks: 10 },
  { exam: 'Labs', maximumMarks: 20, reducedMarks: 20 },
];

export const ISA_PATTERN_POINTS: string[] = [
  'There are two ISAs. Each ISA covers the 2 units from each subject.',
  'Conducted in hybrid mode.',
  'Includes: 1-mark MCQs, 2-mark MCQs, and 4-mark theory/numerical questions.',
  'All MCQs are single-correct-answer-type questions.',
  'There is no negative marking for MCQs.',
  'It is mandatory to answer MCQ questions on the system (computer) only.',
  'Answers to 4-mark questions can be written either on the system itself or in the provided answer booklets.',
];

export const PLANNED_GUIDE_CATEGORIES: string[] = [
  'Unit-wise preparation strategy',
  'Important topics',
  'Practice strategy',
  'ISA preparation',
  'ESA preparation',
  'Tips for passing and aiming for a high grade',
];

export const SUBJECT_GUIDES: SubjectGuidance[] = [
  {
    id: 'engineering-chemistry',
    name: 'Engineering Chemistry',
    shortName: 'Chemistry',
    hasFullGuide: true,
    creditBadge: '5-Credit Subject',
    overview:
      'Chemistry rewards smart prioritisation. Once I locked down the slide numericals and broke theory into four predictable buckets, scoring well became much less stressful.',
    numberedTips: [
      {
        number: '01',
        title: 'Start With Numericals',
        body: [
          'The numericals are fixed and are from the slides. I would strongly recommend getting all the numerical problems done before your ISAs and ESAs. This can help you secure a substantial portion of your paper.',
        ],
      },
      {
        number: '02',
        title: 'Understand the Four Theory Areas',
        body: ['Theory is actually based on just four ideas.'],
        miniCards: [
          'Concepts',
          'Advantages and Disadvantages',
          'Reactions',
          'Constructions',
        ],
      },
      {
        number: '03',
        title: 'If You Just Want to Pass',
        body: [
          'Perfect the numericals first. You can ask your preferred LLM to convert your entire slides into MCQs and practise them. Make sure you cross-check the generated answers with your original slides. For ESAs, focus on perfecting the numericals and practising PYQs.',
        ],
      },
    ],
    numericalGuidance:
      'Complete every numerical problem directly from your lecture slides before attempting long theory chapters—they are fixed and carry dependable marks.',
    isaStrategy:
      'Lock down all slide numericals first, then turn your lecture slides into practice MCQs and verify every answer against the original slides.',
    esaStrategy:
      'Focus on perfecting the numericals, structuring answers around the four core theory pillars (Concepts, Advantages & Disadvantages, Reactions, Constructions), and solving PYQs.',
    highGradeStrategy:
      'Master every slide numerical with zero calculation slips and organise each unit’s theory notes clearly into concepts, pros/cons, balanced reactions, and labelled constructions.',
    passStrategy:
      'Perfect the numericals first, drill slide-generated MCQs (double-checked against slides) for ISAs, and pair numericals with PYQs for ESAs.',
    timeManagementTip:
      'Spend your initial revision block solely on numericals so you secure guaranteed marks early before revising reactions and constructions.',
  },
  {
    id: 'engineering-mechanics',
    name: 'Engineering Mechanics',
    shortName: 'Mechanics',
    hasFullGuide: true,
    creditBadge: '4-Credit Subject',
    overview:
      'Mechanics is all about speed, consistent problem practice, and not ignoring theory—because theory shows up way more in both ISAs and ESAs than most students expect.',
    numberedTips: [
      {
        number: '01',
        title: 'Master Time Management',
        body: [
          'During exams, the most important thing is time management. Practise solving problems using shortcuts and always choose the method that gives you the answer quickly. There can be multiple approaches to solving the same problem. You can master this only through consistent practice.',
        ],
      },
      {
        number: '02',
        title: 'Aiming for an S Grade?',
        body: [
          'Honestly, make sure you thoroughly learn all the numerical problems and theory. In my experience, numerical problems have appeared unchanged. So practise every problem from your material. Do not skip the theory either.',
        ],
      },
      {
        number: '03',
        title: 'Use YouTube Wisely',
        body: [
          'Do not binge-watch videos from Engineers Academy. Many students spend too much time doing this. You can definitely use the videos when you need help understanding a problem, but I would recommend reading through all the solutions and practising them yourself.',
        ],
      },
      {
        number: '04',
        title: 'If You Just Want to Pass',
        body: [
          'Focus on theory. I am not even kidding! In my ISA 2, the MCQs were entirely theory-based, and ISA 1 was also heavily focused on theory. Even in the ESA, theory made up a significant portion of the paper in my experience. Please do not neglect it.',
          'For my ISAs, the questions came from slides, whereas textbook questions were also tested in the ESA. So make sure you cover both.',
        ],
      },
    ],
    numericalGuidance:
      'Practise every problem in your material yourself instead of passively watching long playlists. Learn faster alternative solution methods so you do not run out of time mid-paper.',
    isaStrategy:
      'Cover all lecture slide theory and material problems carefully—in my experience, ISA 1 was heavily theory-focused and ISA 2 MCQs were entirely theory-based.',
    esaStrategy:
      'Do not stop at slides alone for ESA—make sure you cover textbook questions alongside slides, plus both numericals and theory.',
    highGradeStrategy:
      'Honestly, learn every numerical problem from your material thoroughly (they have appeared unchanged in my experience) and pair that with complete theory coverage.',
    passStrategy:
      'Focus seriously on theory from slides for ISAs and both slides and textbook questions for ESA—theory carries a surprisingly huge share of marks.',
    timeManagementTip:
      'Whenever there are multiple ways to solve a Mechanics problem, practise picking the quickest shortcut approach so you save time under exam pressure.',
  },
  {
    id: 'epd',
    name: 'EPD',
    shortName: 'EPD',
    hasFullGuide: true,
    creditBadge: '4-Credit Subject',
    overview:
      'In EPD (Electronic Principles & Devices), tackling numericals early and understanding how each unit builds—especially starting Unit 4 Flip-Flops ahead of time—keeps everything manageable.',
    unitTips: [
      {
        unitLabel: 'Unit 1',
        title: 'Semiconductors',
        tip: 'Unit 1 is largely based on Class 12 semiconductor concepts. Make sure you practise clippers and clampers. Do not skip these topics.',
      },
      {
        unitLabel: 'Unit 2',
        title: 'AC to DC Conversion',
        tip: 'First understand the entire AC-to-DC conversion process, then go into the depths of each concept. Knowing the whole picture first makes the details easier to understand.',
      },
      {
        unitLabel: 'Unit 3',
        title: 'Transistors and Op-Amps',
        tip: 'This is the hardest unit. Study the slides thoroughly and make sure you understand the concepts properly.',
      },
      {
        unitLabel: 'Unit 4',
        title: 'Digital Electronics',
        tip: "This unit is relatively easy because many of you might have already studied digital electronics in Computer Science or Physics. However, Flip-Flops and Latches may be new to you. Start studying them early. Do not leave them until 2 AM! If you haven't studied the concepts leading up to Flip-Flops before, everything can feel very rushed.",
      },
    ],
    numericalGuidance:
      'EPD is also numerical-intensive. Just like Chemistry, I would recommend completing the numerical problems from your slides first and then moving on to the concepts. This way, you will not have to rush through them at the last minute. Numericals can be a high-scoring area.',
    isaStrategy:
      'Prepare Unit 1 and Unit 4 properly according to your upcoming ISA syllabus, finish slide numericals first, and get through Flip-Flops and Latches well before the night of the exam.',
    esaStrategy:
      'For ESA, lock in Unit 1 (including clippers and clampers), Unit 4, and every numerical problem from the slides, while allocating solid extra study time to Unit 3 slides.',
    highGradeStrategy:
      'Clear all slide numericals first, build the big picture of AC-to-DC conversion in Unit 2, give Unit 3 (Transistors & Op-Amps) thorough slide-level depth, and polish Flip-Flops in Unit 4 early.',
    passStrategy:
      'Prepare Unit 1 and Unit 4 properly according to the upcoming ISA syllabus and practise all the numerical problems from your slides. For ESA, focus on Unit 1, Unit 4 and numericals.',
    timeManagementTip:
      'Do not leave Unit 4 Flip-Flops and Latches until 2 AM, and finish numericals before theory so you never rush calculations at the last minute.',
  },
  {
    id: 'python',
    name: 'Python',
    shortName: 'Python',
    hasFullGuide: false,
    creditBadge: '5-Credit Subject',
    overview: 'Your Python guide is coming soon!',
    plannedCategories: PLANNED_GUIDE_CATEGORIES,
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    shortName: 'Mathematics',
    hasFullGuide: false,
    creditBadge: '4-Credit Subject',
    overview: 'Your Mathematics guide is coming soon!',
    plannedCategories: PLANNED_GUIDE_CATEGORIES,
  },
  {
    id: 'constitution',
    name: 'Constitution',
    shortName: 'Constitution',
    hasFullGuide: false,
    creditBadge: '2-Credit Subject',
    overview: 'Your Constitution guide is coming soon!',
    plannedCategories: PLANNED_GUIDE_CATEGORIES,
  },
  {
    id: 'eee',
    name: 'EEE',
    shortName: 'EEE',
    hasFullGuide: false,
    creditBadge: '4-Credit Subject',
    overview: 'Your EEE guide is coming soon!',
    plannedCategories: PLANNED_GUIDE_CATEGORIES,
  },
  {
    id: 'physics',
    name: 'Physics',
    shortName: 'Physics',
    hasFullGuide: false,
    creditBadge: '5-Credit Subject',
    overview: 'Your Physics guide is coming soon!',
    plannedCategories: PLANNED_GUIDE_CATEGORIES,
  },
  {
    id: 'mechanical',
    name: 'Mechanical',
    shortName: 'Mechanical',
    hasFullGuide: false,
    creditBadge: '4-Credit Subject',
    overview: 'Your Mechanical guide is coming soon!',
    plannedCategories: PLANNED_GUIDE_CATEGORIES,
  },
  {
    id: 'cpp',
    name: 'C++',
    shortName: 'C++',
    hasFullGuide: false,
    creditBadge: '5-Credit Subject',
    overview: 'Your C++ guide is coming soon!',
    plannedCategories: PLANNED_GUIDE_CATEGORIES,
  },
  {
    id: 'environmental-science',
    name: 'Environmental Science',
    shortName: 'EVS',
    hasFullGuide: false,
    creditBadge: '2-Credit Subject',
    overview: 'Your Environmental Science guide is coming soon!',
    plannedCategories: PLANNED_GUIDE_CATEGORIES,
  },
];

export const STUDY_FAQS: FaqItem[] = [
  {
    id: 'isa-vs-esa',
    question: 'What is the difference between ISA and ESA?',
    answer:
      'ISA stands for Internal Semester Assessment and refers to the two mid-term tests. ESA stands for End Semester Assessment and is the final examination.',
  },
  {
    id: 'negative-marking',
    question: 'Are there negative marks for ISA MCQs?',
    answer:
      'According to the exam information provided here, ISA MCQs have no negative marking.',
  },
  {
    id: 'check-isa-results',
    question: 'Where can I check my ISA results?',
    answer: 'You can check your ISA results through the PESU Academy app.',
  },
  {
    id: 'slides-only',
    question: 'Should I study only from slides?',
    answer:
      'Slides are an important study resource, but you should also refer to the syllabus, class instructions, prescribed textbooks and previous-year questions wherever relevant.',
  },
  {
    id: 'little-time-prep',
    question: 'How should I prepare if I have very little time?',
    answer:
      'First check the syllabus and the time remaining. Prioritise topics you have not understood, practise important problems, revise concepts and solve questions under timed conditions.',
  },
  {
    id: 'esa-pattern-availability',
    question: 'When will ESA pattern details be available?',
    answer:
      'ESA pattern information will be updated here when the details are available.',
  },
];

// Replace the empty `url` strings below with the exact Google Sheets URLs when ready.
export const PLACEMENT_SHEETS: PlacementSheetLink[] = [
  {
    id: 'sheet-1',
    title: 'Placement Data – Sheet 1',
    subtitle: 'Original Google Sheets placement records (Sheet 1)',
    url: '',
  },
  {
    id: 'sheet-2',
    title: 'Placement Data – Sheet 2',
    subtitle: 'Original Google Sheets placement records (Sheet 2)',
    url: '',
  },
];

export interface PlacementOfferComparisonRow {
  label: string;
  pesuValue: number;
  rvceValue: number;
  pesuLabel: string;
  rvceLabel: string;
}

export const PLACEMENT_COMPARISON_BARS: PlacementOfferComparisonRow[] = [
  {
    label: 'Total / Final Offers',
    pesuValue: 760,
    rvceValue: 376,
    pesuLabel: '760 offers',
    rvceLabel: '376 final offers',
  },
  {
    label: '50+ LPA Offers',
    pesuValue: 46,
    rvceValue: 40,
    pesuLabel: '46 offers (7 companies)',
    rvceLabel: '40 offers (7 companies)',
  },
  {
    label: '20–50 LPA Range',
    pesuValue: 91,
    rvceValue: 119,
    pesuLabel: '91 offers (18 companies)',
    rvceLabel: '119 offers (34 companies)',
  },
  {
    label: '10–20 LPA Range',
    pesuValue: 369,
    rvceValue: 188,
    pesuLabel: '369 offers',
    rvceLabel: '188 offers',
  },
];

// Exported for platform search compatibility in src/utils/search.ts
export const STUDY_TIPS: StudyTipItem[] = [
  {
    id: 'exam-guide-marks',
    title: 'All About Marks & Exams (ISA & ESA)',
    category: 'Exam Guide',
    summary:
      'Credit groups (5, 4, 2 credits), mark distribution table, ISA hybrid pattern, and PESU Academy results.',
    sectionId: 'exam-guide',
  },
  {
    id: 'tips-engineering-chemistry',
    title: 'Engineering Chemistry Study Guide',
    category: 'Subject Tips',
    summary:
      'Start with slide numericals, four theory pillars (Concepts, Pros/Cons, Reactions, Constructions), and pass strategy.',
    sectionId: 'subject-tips',
    subjectId: 'engineering-chemistry',
  },
  {
    id: 'tips-engineering-mechanics',
    title: 'Engineering Mechanics Study Guide',
    category: 'Subject Tips',
    summary:
      'Time management shortcuts, S-grade material problem mastery, smart YouTube usage, and ISA/ESA theory focus.',
    sectionId: 'subject-tips',
    subjectId: 'engineering-mechanics',
  },
  {
    id: 'tips-epd',
    title: 'EPD Unit-Wise Preparation Guide',
    category: 'Subject Tips',
    summary:
      'Units 1–4 breakdown (Semiconductors, AC-to-DC, Transistors & Op-Amps, Digital Electronics & Flip-Flops) + numericals.',
    sectionId: 'subject-tips',
    subjectId: 'epd',
  },
  {
    id: 'faq-first-year',
    title: 'First-Year Engineering Exam FAQs',
    category: 'FAQs',
    summary:
      'ISA vs ESA, negative marking, PESU Academy results, using slides vs textbooks, and limited-time prep.',
    sectionId: 'faqs',
  },
  {
    id: 'placements-2027',
    title: 'Placements 2027 Analysis (PESU & RVCE)',
    category: 'Placements',
    summary:
      'Placement data sheets, headline offer numbers, compensation bands, and recruiter patterns.',
    sectionId: 'placements',
  },
];
