// NCERT / CBSE curriculum data for Classes 9-12
// Classes 11 & 12 are split into Science / Commerce / Arts streams.
// Class 9 & 10 include the CBSE skill subjects: AI (417), IT (402), Computer Applications (165).

export type Chapter = string;
export type Subject = { name: string; chapters: Chapter[] };

export type ClassData =
  | { label: string; subjects: Subject[]; streams?: undefined }
  | { label: string; streams: Record<string, Subject[]>; subjects?: undefined };

// ---------- Common subjects for Classes 11/12 (all streams) ----------

const ENGLISH_11: Subject = {
  name: "English",
  chapters: [
    "The Portrait of a Lady",
    "We're Not Afraid to Die… if We Can All Be Together",
    "Discovering Tut: the Saga Continues",
    "Landscape of the Soul",
    "The Ailing Planet",
    "The Browning Version",
    "The Adventure",
    "Silk Road",
  ],
};

const ENGLISH_12: Subject = {
  name: "English",
  chapters: [
    "The Last Lesson",
    "Lost Spring",
    "Deep Water",
    "The Rattrap",
    "Indigo",
    "Poets and Pancakes",
    "The Interview",
    "Going Places",
    "My Mother at Sixty-six",
    "An Elementary School Classroom in a Slum",
    "Keeping Quiet",
    "A Thing of Beauty",
    "Aunt Jennifer's Tigers",
  ],
};

const PHE_11: Subject = {
  name: "Physical Education",
  chapters: [
    "Changing Trends and Career in Physical Education",
    "Olympic Value Education",
    "Physical Fitness, Wellness and Lifestyle",
    "Physical Education and Sports for CWSN",
    "Yoga",
    "Physical Activity and Leadership Training",
    "Test, Measurement and Evaluation",
    "Fundamentals of Anatomy and Physiology in Sports",
    "Psychology and Sports",
    "Training and Doping in Sports",
  ],
};

const PHE_12: Subject = {
  name: "Physical Education",
  chapters: [
    "Management of Sporting Events",
    "Children and Women in Sports",
    "Yoga as Preventive Measure for Lifestyle Disease",
    "Physical Education and Sports for CWSN",
    "Sports and Nutrition",
    "Test and Measurement in Sports",
    "Physiology and Injuries in Sports",
    "Biomechanics and Sports",
    "Psychology and Sports",
    "Training in Sports",
  ],
};

// Computer Science (Sumita Arora — Computer Science with Python)
const CS_11: Subject = {
  name: "Computer Science (Python — Sumita Arora)",
  chapters: [
    "Computer System",
    "Encoding Schemes and Number System",
    "Emerging Trends",
    "Introduction to Problem Solving",
    "Getting Started with Python",
    "Python Fundamentals",
    "Data Handling",
    "Flow of Control",
    "Functions",
    "String Manipulation",
    "List Manipulation",
    "Tuples",
    "Dictionaries",
    "Understanding Societal Impacts (Cyber Safety)",
  ],
};

const CS_12: Subject = {
  name: "Computer Science (Python — Sumita Arora)",
  chapters: [
    "Revision of Python Basics",
    "Working with Functions",
    "Using Python Libraries",
    "File Handling",
    "Recursion",
    "Idea of Algorithmic Efficiency",
    "Data Structure: Stack",
    "Data Structure: Queue",
    "Computer Networks",
    "Database Concepts",
    "Structured Query Language (SQL)",
    "Interface Python with MySQL",
    "Societal Impacts",
  ],
};

// ---------- Class 11 stream subjects ----------

const MATH_11: Subject = {
  name: "Mathematics",
  chapters: [
    "Sets",
    "Relations and Functions",
    "Trigonometric Functions",
    "Complex Numbers and Quadratic Equations",
    "Linear Inequalities",
    "Permutations and Combinations",
    "Binomial Theorem",
    "Sequences and Series",
    "Straight Lines",
    "Conic Sections",
    "Introduction to Three Dimensional Geometry",
    "Limits and Derivatives",
    "Statistics",
    "Probability",
  ],
};

const PHYSICS_11: Subject = {
  name: "Physics",
  chapters: [
    "Units and Measurements",
    "Motion in a Straight Line",
    "Motion in a Plane",
    "Laws of Motion",
    "Work, Energy and Power",
    "System of Particles and Rotational Motion",
    "Gravitation",
    "Mechanical Properties of Solids",
    "Mechanical Properties of Fluids",
    "Thermal Properties of Matter",
    "Thermodynamics",
    "Kinetic Theory",
    "Oscillations",
    "Waves",
  ],
};

const CHEM_11: Subject = {
  name: "Chemistry",
  chapters: [
    "Some Basic Concepts of Chemistry",
    "Structure of Atom",
    "Classification of Elements and Periodicity in Properties",
    "Chemical Bonding and Molecular Structure",
    "Thermodynamics",
    "Equilibrium",
    "Redox Reactions",
    "Organic Chemistry — Some Basic Principles and Techniques",
    "Hydrocarbons",
  ],
};

const BIO_11: Subject = {
  name: "Biology",
  chapters: [
    "The Living World",
    "Biological Classification",
    "Plant Kingdom",
    "Animal Kingdom",
    "Morphology of Flowering Plants",
    "Anatomy of Flowering Plants",
    "Structural Organisation in Animals",
    "Cell — The Unit of Life",
    "Biomolecules",
    "Cell Cycle and Cell Division",
    "Photosynthesis in Higher Plants",
    "Respiration in Plants",
    "Plant Growth and Development",
    "Breathing and Exchange of Gases",
    "Body Fluids and Circulation",
    "Excretory Products and Their Elimination",
    "Locomotion and Movement",
    "Neural Control and Coordination",
    "Chemical Coordination and Integration",
  ],
};

const ACCOUNTS_11: Subject = {
  name: "Accountancy",
  chapters: [
    "Introduction to Accounting",
    "Theory Base of Accounting",
    "Recording of Transactions - I",
    "Recording of Transactions - II",
    "Bank Reconciliation Statement",
    "Trial Balance and Rectification of Errors",
    "Depreciation, Provisions and Reserves",
    "Financial Statements - I",
    "Financial Statements - II",
    "Accounts from Incomplete Records",
    "Applications of Computers in Accounting",
  ],
};

const BST_11: Subject = {
  name: "Business Studies",
  chapters: [
    "Business, Trade and Commerce",
    "Forms of Business Organisation",
    "Private, Public and Global Enterprises",
    "Business Services",
    "Emerging Modes of Business",
    "Social Responsibility of Business and Business Ethics",
    "Formation of a Company",
    "Sources of Business Finance",
    "Small Business and Entrepreneurship Development",
    "Internal Trade",
    "International Business",
  ],
};

const ECO_11: Subject = {
  name: "Economics",
  chapters: [
    "Introduction (Statistics for Economics)",
    "Collection of Data",
    "Organisation of Data",
    "Presentation of Data",
    "Measures of Central Tendency",
    "Measures of Dispersion",
    "Correlation",
    "Index Numbers",
    "Indian Economy on the Eve of Independence",
    "Indian Economy 1950–1990",
    "Liberalisation, Privatisation and Globalisation",
    "Poverty",
    "Human Capital Formation in India",
    "Rural Development",
    "Employment: Growth, Informalisation and Related Issues",
    "Environment and Sustainable Development",
    "Comparative Development Experiences of India and its Neighbours",
  ],
};

const HISTORY_11: Subject = {
  name: "History",
  chapters: [
    "From the Beginning of Time",
    "Writing and City Life",
    "An Empire Across Three Continents",
    "The Central Islamic Lands",
    "Nomadic Empires",
    "The Three Orders",
    "Changing Cultural Traditions",
    "Confrontation of Cultures",
    "The Industrial Revolution",
    "Displacing Indigenous Peoples",
    "Paths to Modernisation",
  ],
};

const POLSCI_11: Subject = {
  name: "Political Science",
  chapters: [
    "Constitution: Why and How?",
    "Rights in the Indian Constitution",
    "Election and Representation",
    "Executive",
    "Legislature",
    "Judiciary",
    "Federalism",
    "Local Governments",
    "Constitution as a Living Document",
    "The Philosophy of the Constitution",
    "Political Theory: An Introduction",
    "Freedom",
    "Equality",
    "Social Justice",
    "Rights",
    "Citizenship",
    "Nationalism",
    "Secularism",
    "Peace",
    "Development",
  ],
};

const GEO_11: Subject = {
  name: "Geography",
  chapters: [
    "Geography as a Discipline",
    "The Origin and Evolution of the Earth",
    "Interior of the Earth",
    "Distribution of Oceans and Continents",
    "Minerals and Rocks",
    "Geomorphic Processes",
    "Landforms and their Evolution",
    "Composition and Structure of Atmosphere",
    "Solar Radiation, Heat Balance and Temperature",
    "Atmospheric Circulation and Weather Systems",
    "Water in the Atmosphere",
    "World Climate and Climate Change",
    "Water (Oceans)",
    "Movements of Ocean Water",
    "Life on the Earth",
    "Biodiversity and Conservation",
    "India — Location",
    "Structure and Physiography",
    "Drainage System",
    "Climate",
    "Natural Vegetation",
    "Natural Hazards and Disasters",
  ],
};

const PSYCH_11: Subject = {
  name: "Psychology",
  chapters: [
    "What is Psychology?",
    "Methods of Enquiry in Psychology",
    "Human Development",
    "Sensory, Attentional and Perceptual Processes",
    "Learning",
    "Human Memory",
    "Thinking",
    "Motivation and Emotion",
    "Self and Personality",
  ],
};

const SOCIO_11: Subject = {
  name: "Sociology",
  chapters: [
    "Sociology and Society",
    "Terms, Concepts and their Use in Sociology",
    "Understanding Social Institutions",
    "Culture and Socialisation",
    "Doing Sociology: Research Methods",
    "Social Structure, Stratification and Social Processes in Society",
    "Social Change and Social Order in Rural and Urban Society",
    "Environment and Society",
    "Introducing Western Sociologists",
    "Indian Sociologists",
  ],
};

// ---------- Class 12 stream subjects ----------

const MATH_12: Subject = {
  name: "Mathematics",
  chapters: [
    "Relations and Functions",
    "Inverse Trigonometric Functions",
    "Matrices",
    "Determinants",
    "Continuity and Differentiability",
    "Application of Derivatives",
    "Integrals",
    "Application of Integrals",
    "Differential Equations",
    "Vector Algebra",
    "Three Dimensional Geometry",
    "Linear Programming",
    "Probability",
  ],
};

const PHYSICS_12: Subject = {
  name: "Physics",
  chapters: [
    "Electric Charges and Fields",
    "Electrostatic Potential and Capacitance",
    "Current Electricity",
    "Moving Charges and Magnetism",
    "Magnetism and Matter",
    "Electromagnetic Induction",
    "Alternating Current",
    "Electromagnetic Waves",
    "Ray Optics and Optical Instruments",
    "Wave Optics",
    "Dual Nature of Radiation and Matter",
    "Atoms",
    "Nuclei",
    "Semiconductor Electronics",
  ],
};

const CHEM_12: Subject = {
  name: "Chemistry",
  chapters: [
    "Solutions",
    "Electrochemistry",
    "Chemical Kinetics",
    "The d- and f-Block Elements",
    "Coordination Compounds",
    "Haloalkanes and Haloarenes",
    "Alcohols, Phenols and Ethers",
    "Aldehydes, Ketones and Carboxylic Acids",
    "Amines",
    "Biomolecules",
  ],
};

const BIO_12: Subject = {
  name: "Biology",
  chapters: [
    "Sexual Reproduction in Flowering Plants",
    "Human Reproduction",
    "Reproductive Health",
    "Principles of Inheritance and Variation",
    "Molecular Basis of Inheritance",
    "Evolution",
    "Human Health and Disease",
    "Microbes in Human Welfare",
    "Biotechnology — Principles and Processes",
    "Biotechnology and Its Applications",
    "Organisms and Populations",
    "Ecosystem",
    "Biodiversity and Conservation",
  ],
};

const ACCOUNTS_12: Subject = {
  name: "Accountancy",
  chapters: [
    "Accounting for Not-for-Profit Organisation",
    "Accounting for Partnership: Basic Concepts",
    "Reconstitution of a Partnership Firm — Admission of a Partner",
    "Reconstitution of a Partnership Firm — Retirement / Death of a Partner",
    "Dissolution of Partnership Firm",
    "Accounting for Share Capital",
    "Issue and Redemption of Debentures",
    "Financial Statements of a Company",
    "Analysis of Financial Statements",
    "Accounting Ratios",
    "Cash Flow Statement",
  ],
};

const BST_12: Subject = {
  name: "Business Studies",
  chapters: [
    "Nature and Significance of Management",
    "Principles of Management",
    "Business Environment",
    "Planning",
    "Organising",
    "Staffing",
    "Directing",
    "Controlling",
    "Financial Management",
    "Financial Markets",
    "Marketing Management",
    "Consumer Protection",
  ],
};

const ECO_12: Subject = {
  name: "Economics",
  chapters: [
    "Introduction to Microeconomics",
    "Theory of Consumer Behaviour",
    "Production and Costs",
    "The Theory of the Firm under Perfect Competition",
    "Market Equilibrium",
    "Non-competitive Markets",
    "Introduction to Macroeconomics",
    "National Income Accounting",
    "Money and Banking",
    "Determination of Income and Employment",
    "Government Budget and the Economy",
    "Open Economy Macroeconomics",
  ],
};

const HISTORY_12: Subject = {
  name: "History",
  chapters: [
    "Bricks, Beads and Bones",
    "Kings, Farmers and Towns",
    "Kinship, Caste and Class",
    "Thinkers, Beliefs and Buildings",
    "Through the Eyes of Travellers",
    "Bhakti-Sufi Traditions",
    "An Imperial Capital: Vijayanagara",
    "Peasants, Zamindars and the State",
    "Kings and Chronicles",
    "Colonialism and the Countryside",
    "Rebels and the Raj",
    "Colonial Cities",
    "Mahatma Gandhi and the Nationalist Movement",
    "Understanding Partition",
    "Framing the Constitution",
  ],
};

const POLSCI_12: Subject = {
  name: "Political Science",
  chapters: [
    "The Cold War Era",
    "The End of Bipolarity",
    "US Hegemony in World Politics",
    "Alternative Centres of Power",
    "Contemporary South Asia",
    "International Organisations",
    "Security in the Contemporary World",
    "Environment and Natural Resources",
    "Globalisation",
    "Challenges of Nation-Building",
    "Era of One-Party Dominance",
    "Politics of Planned Development",
    "India's External Relations",
    "Challenges to and Restoration of the Congress System",
    "The Crisis of Democratic Order",
    "Rise of Popular Movements",
    "Regional Aspirations",
    "Recent Developments in Indian Politics",
  ],
};

const GEO_12: Subject = {
  name: "Geography",
  chapters: [
    "Human Geography — Nature and Scope",
    "The World Population",
    "Human Development",
    "Primary Activities",
    "Secondary Activities",
    "Tertiary and Quaternary Activities",
    "Transport and Communication",
    "International Trade",
    "Human Settlements",
    "Population: Distribution, Density, Growth and Composition (India)",
    "Migration: Types, Causes and Consequences",
    "Human Development (India)",
    "Human Settlements (India)",
    "Land Resources and Agriculture",
    "Water Resources",
    "Mineral and Energy Resources",
    "Manufacturing Industries",
    "Planning and Sustainable Development in Indian Economy",
    "Transport and Communication (India)",
    "International Trade (India)",
    "Geographical Perspective on Selected Issues and Problems",
  ],
};

const PSYCH_12: Subject = {
  name: "Psychology",
  chapters: [
    "Variations in Psychological Attributes",
    "Self and Personality",
    "Meeting Life Challenges",
    "Psychological Disorders",
    "Therapeutic Approaches",
    "Attitude and Social Cognition",
    "Social Influence and Group Processes",
  ],
};

const SOCIO_12: Subject = {
  name: "Sociology",
  chapters: [
    "Introducing Indian Society",
    "The Demographic Structure of the Indian Society",
    "Social Institutions: Continuity and Change",
    "The Market as a Social Institution",
    "Patterns of Social Inequality and Exclusion",
    "The Challenges of Cultural Diversity",
    "Structural Change",
    "Cultural Change",
    "The Story of Indian Democracy",
    "Change and Development in Rural Society",
    "Change and Development in Industrial Society",
    "Globalisation and Social Change",
    "Mass Media and Communications",
    "Social Movements",
  ],
};

// ---------- Classes 9 & 10 skill / vocational subjects ----------

const AI_9: Subject = {
  name: "Artificial Intelligence (417)",
  chapters: [
    "Communication Skills",
    "Self-Management Skills",
    "ICT Skills",
    "Entrepreneurial Skills",
    "Green Skills",
    "Introduction to AI",
    "AI Project Cycle",
    "Neural Networks",
    "Introduction to Python",
  ],
};

const AI_10: Subject = {
  name: "Artificial Intelligence (417)",
  chapters: [
    "Communication Skills",
    "Self-Management Skills",
    "ICT Skills",
    "Entrepreneurial Skills",
    "Green Skills",
    "Introduction to AI",
    "AI Project Cycle",
    "Advance Python",
    "Data Science",
    "Computer Vision",
    "Natural Language Processing",
    "Evaluation",
  ],
};

const IT_9: Subject = {
  name: "Information Technology (402)",
  chapters: [
    "Communication Skills",
    "Self-Management Skills",
    "ICT Skills",
    "Entrepreneurial Skills",
    "Green Skills",
    "Introduction to IT-ITeS Industry",
    "Data Entry and Keyboarding Skills",
    "Digital Documentation",
    "Electronic Spreadsheet",
    "Digital Presentation",
  ],
};

const IT_10: Subject = {
  name: "Information Technology (402)",
  chapters: [
    "Communication Skills",
    "Self-Management Skills",
    "ICT Skills",
    "Entrepreneurial Skills",
    "Green Skills",
    "Digital Documentation (Advanced)",
    "Electronic Spreadsheet (Advanced)",
    "Database Management System",
    "Web Applications and Security",
  ],
};

const CAPP_9: Subject = {
  name: "Computer Applications (165)",
  chapters: [
    "Basics of Information Technology",
    "Cyber-safety",
    "Office Tools",
    "Scratch / Python Fundamentals",
    "Digital Documentation",
  ],
};

const CAPP_10: Subject = {
  name: "Computer Applications (165)",
  chapters: [
    "Networking",
    "HTML Basics",
    "HTML — Advanced Features",
    "Cyber Ethics",
    "Scratch / Python",
    "Working with E-mail, E-banking, E-commerce",
  ],
};

// Hindi (Kshitij + Sparsh — Course A) for Class 9 & 10
const HINDI_9: Subject = {
  name: "हिंदी (Hindi)",
  chapters: [
    "दो बैलों की कथा",
    "ल्हासा की ओर",
    "उपभोक्तावाद की संस्कृति",
    "साँवले सपनों की याद",
    "प्रेमचंद के फटे जूते",
    "मेरे बचपन के दिन",
    "एक कुत्ता और एक मैना",
    "साखियाँ एवं सबद (कबीर)",
    "वाख (ललद्यद)",
    "सवैये (रसखान)",
    "कैदी और कोकिला",
    "ग्राम श्री",
    "मेघ आए",
    "यमराज की दिशा",
  ],
};

const HINDI_10: Subject = {
  name: "हिंदी (Hindi)",
  chapters: [
    "पद (सूरदास)",
    "राम-लक्ष्मण-परशुराम संवाद (तुलसीदास)",
    "सवैये और कवित्त (देव)",
    "आत्मकथ्य (जयशंकर प्रसाद)",
    "उत्साह / अट नहीं रही है (सूर्यकांत त्रिपाठी 'निराला')",
    "यह दंतुरित मुस्कान / फसल (नागार्जुन)",
    "छाया मत छूना (गिरिजा कुमार माथुर)",
    "कन्यादान (ऋतुराज)",
    "संगतकार (मंगलेश डबराल)",
    "नेताजी का चश्मा (स्वयं प्रकाश)",
    "बालगोबिन भगत (रामवृक्ष बेनीपुरी)",
    "लखनवी अंदाज़ (यशपाल)",
    "मानवीय करुणा की दिव्य चमक (सर्वेश्वर दयाल सक्सेना)",
    "एक कहानी यह भी (मन्नू भंडारी)",
    "स्त्री-शिक्षा के विरोधी कुतर्कों का खंडन (महावीरप्रसाद द्विवेदी)",
    "नौबतखाने में इबादत (यतीन्द्र मिश्र)",
    "संस्कृति (भदन्त आनंद कौसल्यायन)",
  ],
};

// Urdu (Nawa-e-Urdu / Gulzar-e-Urdu) for Class 9 & 10
const URDU_9: Subject = {
  name: "اُردُو (Urdu)",
  chapters: [
    "نعت (الطاف حسین حالی)",
    "ابرِ کرم (علامہ اقبال)",
    "ماں (منشی پریم چند)",
    "حج کا سفر (شبلی نعمانی)",
    "دیوالی (سجاد حیدر یلدرم)",
    "بہادر (رشید احمد صدیقی)",
    "خط (سرسید احمد خان)",
    "غزل (میر تقی میر)",
    "غزل (مرزا غالب)",
    "نظم — پنجرے کی چڑیا",
    "نظم — چاند کا پیغام",
  ],
};

const URDU_10: Subject = {
  name: "اُردُو (Urdu)",
  chapters: [
    "حمد (نظیر اکبر آبادی)",
    "نعت (محسن کاکوروی)",
    "غزل (میر تقی میر)",
    "غزل (مرزا غالب)",
    "غزل (علامہ اقبال)",
    "نظم — ماں کا خواب (علامہ اقبال)",
    "نظم — ہمالہ (علامہ اقبال)",
    "مکتوب (غالب کے خطوط)",
    "خط (مولانا ابوالکلام آزاد)",
    "افسانہ — نیا قانون (سعادت حسن منٹو)",
    "افسانہ — گڈریا (اشفاق احمد)",
    "مضمون — عید الفطر",
    "مضمون — بھارت کی ثقافت",
    "سفر نامہ — دلی کی سیر",
  ],
};

// Entrepreneurship (Class 11 & 12 — Commerce)
const ENTREP_11: Subject = {
  name: "Entrepreneurship",
  chapters: [
    "Entrepreneurship: Concept and Functions",
    "An Entrepreneur",
    "Entrepreneurial Journey",
    "Entrepreneurship as Innovation and Problem Solving",
    "Understanding the Market",
    "Business Arithmetic",
    "Resource Mobilization",
  ],
};

const ENTREP_12: Subject = {
  name: "Entrepreneurship",
  chapters: [
    "Entrepreneurial Opportunity",
    "Entrepreneurial Planning",
    "Enterprise Marketing",
    "Enterprise Growth Strategies",
    "Business Arithmetic",
    "Resource Mobilization",
  ],
};

// ---------- Full curriculum ----------

export const CURRICULUM: Record<string, ClassData> = {
  "9": {
    label: "Class 9",
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          "Number Systems",
          "Polynomials",
          "Coordinate Geometry",
          "Linear Equations in Two Variables",
          "Introduction to Euclid's Geometry",
          "Lines and Angles",
          "Triangles",
          "Quadrilaterals",
          "Circles",
          "Heron's Formula",
          "Surface Areas and Volumes",
          "Statistics",
        ],
      },
      {
        name: "Science",
        chapters: [
          "Matter in Our Surroundings",
          "Is Matter Around Us Pure",
          "Atoms and Molecules",
          "Structure of the Atom",
          "The Fundamental Unit of Life",
          "Tissues",
          "Motion",
          "Force and Laws of Motion",
          "Gravitation",
          "Work and Energy",
          "Sound",
          "Improvement in Food Resources",
        ],
      },
      {
        name: "Social Science",
        chapters: [
          "The French Revolution",
          "Socialism in Europe and the Russian Revolution",
          "Nazism and the Rise of Hitler",
          "Forest Society and Colonialism",
          "Pastoralists in the Modern World",
          "India — Size and Location",
          "Physical Features of India",
          "Drainage",
          "Climate",
          "Natural Vegetation and Wildlife",
          "Population",
          "What is Democracy? Why Democracy?",
          "Constitutional Design",
          "Electoral Politics",
          "Working of Institutions",
          "Democratic Rights",
          "The Story of Village Palampur",
          "People as Resource",
          "Poverty as a Challenge",
          "Food Security in India",
        ],
      },
      {
        name: "English",
        chapters: [
          "The Fun They Had",
          "The Sound of Music",
          "The Little Girl",
          "A Truly Beautiful Mind",
          "The Snake and the Mirror",
          "My Childhood",
          "Reach for the Top",
          "Kathmandu",
          "If I Were You",
        ],
      },
      AI_9,
      IT_9,
      CAPP_9,
    ],
  },
  "10": {
    label: "Class 10",
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          "Real Numbers",
          "Polynomials",
          "Pair of Linear Equations in Two Variables",
          "Quadratic Equations",
          "Arithmetic Progressions",
          "Triangles",
          "Coordinate Geometry",
          "Introduction to Trigonometry",
          "Some Applications of Trigonometry",
          "Circles",
          "Areas Related to Circles",
          "Surface Areas and Volumes",
          "Statistics",
          "Probability",
        ],
      },
      {
        name: "Science",
        chapters: [
          "Chemical Reactions and Equations",
          "Acids, Bases and Salts",
          "Metals and Non-Metals",
          "Carbon and Its Compounds",
          "Life Processes",
          "Control and Coordination",
          "How do Organisms Reproduce?",
          "Heredity",
          "Light — Reflection and Refraction",
          "The Human Eye and the Colourful World",
          "Electricity",
          "Magnetic Effects of Electric Current",
          "Our Environment",
        ],
      },
      {
        name: "Social Science",
        chapters: [
          "The Rise of Nationalism in Europe",
          "Nationalism in India",
          "The Making of a Global World",
          "The Age of Industrialisation",
          "Print Culture and the Modern World",
          "Resources and Development",
          "Forest and Wildlife Resources",
          "Water Resources",
          "Agriculture",
          "Minerals and Energy Resources",
          "Manufacturing Industries",
          "Lifelines of National Economy",
          "Power Sharing",
          "Federalism",
          "Gender, Religion and Caste",
          "Political Parties",
          "Outcomes of Democracy",
          "Development",
          "Sectors of the Indian Economy",
          "Money and Credit",
          "Globalisation and the Indian Economy",
          "Consumer Rights",
        ],
      },
      {
        name: "English",
        chapters: [
          "A Letter to God",
          "Nelson Mandela: Long Walk to Freedom",
          "Two Stories about Flying",
          "From the Diary of Anne Frank",
          "Glimpses of India",
          "Mijbil the Otter",
          "Madam Rides the Bus",
          "The Sermon at Benares",
          "The Proposal",
        ],
      },
      AI_10,
      IT_10,
      CAPP_10,
    ],
  },
  "11": {
    label: "Class 11",
    streams: {
      Science: [PHYSICS_11, CHEM_11, BIO_11, MATH_11, CS_11, ENGLISH_11, PHE_11],
      Commerce: [ACCOUNTS_11, BST_11, ECO_11, MATH_11, CS_11, ENGLISH_11, PHE_11],
      Arts: [
        HISTORY_11,
        POLSCI_11,
        GEO_11,
        PSYCH_11,
        SOCIO_11,
        ECO_11,
        ENGLISH_11,
        PHE_11,
        CS_11,
      ],
    },
  },
  "12": {
    label: "Class 12",
    streams: {
      Science: [PHYSICS_12, CHEM_12, BIO_12, MATH_12, CS_12, ENGLISH_12, PHE_12],
      Commerce: [ACCOUNTS_12, BST_12, ECO_12, MATH_12, CS_12, ENGLISH_12, PHE_12],
      Arts: [
        HISTORY_12,
        POLSCI_12,
        GEO_12,
        PSYCH_12,
        SOCIO_12,
        ECO_12,
        ENGLISH_12,
        PHE_12,
        CS_12,
      ],
    },
  },
};

export const CLASS_KEYS = ["9", "10", "11", "12"] as const;

export const STREAM_KEYS = ["Science", "Commerce", "Arts"] as const;

export function classHasStreams(classKey: string): boolean {
  const c = CURRICULUM[classKey];
  return !!c && "streams" in c && c.streams !== undefined;
}

export function subjectsFor(classKey: string, stream: string): Subject[] {
  const c = CURRICULUM[classKey];
  if (!c) return [];
  if ("subjects" in c && c.subjects) return c.subjects;
  if ("streams" in c && c.streams) return c.streams[stream] ?? [];
  return [];
}
