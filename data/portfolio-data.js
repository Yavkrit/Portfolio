// ============================================================
// PORTFOLIO DATA — Edit this file to update all content
// ============================================================

window.PORTFOLIO = {

  personal: {
    name: "Yavkrit Vashishtha",
    title: "Embedded Software Engineer & Research Scholar",
    roles: [
      "Research Engineer",
      "AI Developer",
      "Embedded Systems Engineer",
      "Biomedical Imaging Researcher",
      "Computer Vision Enthusiast",
      "Firmware Developer",
      "Creative Technologist"
    ],
    tagline: "Where science meets engineering meets art.",
    bio: `Embedded Software Engineer and Research Scholar with 2+ years of industry experience in firmware development, Linux-based systems, and protocol integration for IP camera platforms. Pursuing Integrated M.Tech + Ph.D. in Biomedical Instrumentation & AI at AcSIR (CSIR-CSIO), focusing on Terahertz-based diagnostic imaging.`,
    email: "yvashishtha04@gmail.com",
    github: "https://github.com/Yavkrit",
    linkedin: "https://www.linkedin.com/in/yavkrit-vashishtha-50819b286",
    location: "Chandigarh, India",
    institution: "CSIR-CSIO, Chandigarh / AcSIR New Delhi",
    enrollmentNo: "32EE25J15013"
  },

  heroPrimary: "images/portrait_1.png",

  // ── EXPERIENCE ────────────────────────────────────────────
  experience: [
    {
      id: "csir_csio",
      role: "Research Scholar — Integrated M.Tech + Ph.D.",
      company: "CSIR-CSIO / AcSIR New Delhi",
      shortName: "CSIR-CSIO",
      period: "Jan 2025 – Present",
      location: "Chandigarh, India",
      type: "Research",
      description: `Pursuing an Integrated Dual Degree Programme (M.Tech + Ph.D.) in Biomedical Instrumentation, AI & Embedded Systems at CSIR-CSIO — one of India's premier scientific research organisations. Research is focused on non-invasive diagnostic imaging using Terahertz radiation, combined with AI-driven analytics pipelines.`,
      highlights: [
        "Designing THz-based non-invasive diagnostic imaging systems for biomedical applications",
        "Architecting embedded sensor networks and AI-driven analytics pipelines for THz signal acquisition",
        "Developing deep learning algorithms (TensorFlow/PyTorch) for biomedical data modelling and anomaly detection",
        "DAC-1 Doctoral Advisory Committee review successfully completed — June 2026"
      ],
      technologies: ["Python", "TensorFlow", "PyTorch", "OpenCV", "THz Imaging", "Signal Processing", "Embedded Systems", "C++", "MATLAB"],
      supervisor: "Dr. Naveen Sharma (Senior Scientist, CSIR-CSIO; Professor, AcSIR)"
    },
    {
      id: "einfochips",
      role: "Embedded Software Engineer",
      company: "eInfochips (An Arrow Electronics Company)",
      shortName: "eInfochips",
      period: "Jun 2023 – Jan 2025",
      location: "Ahmedabad, India",
      type: "Industry",
      description: `Contributed to embedded firmware and software development for professional IP camera and multi-sensor platform solutions, working with industry-leading global clients in the security and surveillance domain. Delivered production-grade code across firmware, API integration, REST backend, and system validation workflows.`,
      highlights: [
        "Developed and integrated ONVIF (Profiles S, G, T, M) and SUNAPI-compliant functionalities for PTZ and multi-sensor IP cameras in C++ on Linux",
        "Built RESTful API integrations for Video Management Systems (VMS), improving protocol compliance and interoperability",
        "Implemented Network Storage Drive (NSD) module enabling secure IP-based data caching and retrieval",
        "Developed low-level peripheral drivers (GPIO, SPI, I²C, UART, ADC) on STM32 microcontrollers within modular BSP layers via Yocto build system and ARM cross-compilation",
        "Applied RTOS task scheduling, interrupt handling, and memory optimization to improve firmware reliability",
        "Performed API testing with Postman, led unit testing and debugging across cross-functional engineering teams"
      ],
      technologies: ["C", "C++", "Linux", "STM32", "RTOS", "ONVIF", "SUNAPI", "RESTful APIs", "Yocto", "ARM", "SPI", "I²C", "UART", "GPIO", "Postman", "GDB", "CMake"],
      clients: ["Hanwha Vision", "Honeywell"],
      note: "Certain project details are protected under confidentiality agreements. Technologies and engineering responsibilities are shared with appropriate professional discretion."
    },
    {
      id: "vivo",
      role: "Associate Manufacturing / System Engineer",
      company: "vivo / DBG Technology Co. Ltd.",
      shortName: "vivo / DBG",
      period: "Jun 2021 – Jun 2022",
      location: "Noida & Bawal, India",
      type: "Internship",
      description: `Engineering internship focused on electronics manufacturing, PCBA validation, and production quality assurance across large-scale mobile device production lines serving multiple global brands including OPPO, vivo, Realme, and Xiaomi.`,
      highlights: [
        "Performed PCBA validation, SMT line operations, and CCD optical inspection across mobile production lines",
        "Touchscreen calibration and functional testing for OPPO, VIVO, Realme, and Xiaomi devices",
        "Supervised assembly-line operations and ensured adherence to quality and reliability testing standards"
      ],
      technologies: ["PCBA Validation", "SMT", "CCD Inspection", "Quality Assurance", "Production Testing", "Electronics Manufacturing"]
    }
  ],

  // ── EDUCATION ─────────────────────────────────────────────
  education: [
    {
      degree: "Integrated M.Tech + Ph.D. — Biomedical Instrumentation, AI & Embedded Systems",
      institution: "Academy of Scientific and Innovative Research (AcSIR) / CSIR-CSIO",
      period: "Jan 2025 – Present",
      location: "Chandigarh, India",
      details: "Integrated Dual Degree Programme (IDDP) · Supervisor: Dr. Naveen Sharma"
    },
    {
      degree: "B.Tech — Electronics & Communication Engineering",
      institution: "Charotar University of Science and Technology (CHARUSAT)",
      period: "Jul 2019 – May 2023",
      location: "Anand, India",
      details: "CGPA: 8.69 / 10"
    }
  ],

  // ── PROJECTS ─────────────────────────────────────────────
  projects: [
    {
      id: "lime",
      title: "LIME — Li-Fi Integrated Message Encoder",
      subtitle: "Bidirectional Free-Space Optical Communication System",
      category: "Embedded Systems / Optical Comms",
      status: "Completed",
      year: "2022 – 2023",
      heroImage: "images/lime_block_diagram.jpg",
      tags: ["Li-Fi", "FSO", "Arduino", "Embedded C++", "OOK Modulation", "Optical Comms"],
      overview: `LIME (Li-Fi Integrated Message Encoder) is a fully self-designed, built, and tested bidirectional free-space optical (FSO) communication system capable of simultaneous text and voice transmission using laser diodes and photovoltaic solar panel receivers. Features a novel automatic threshold calibration algorithm achieving secure wire-free data transmission at up to 9600 baud with less than 1% BER under controlled conditions.`,
      problem: `Existing cheap FSO prototypes share three critical limitations: unidirectional data flow only, single-mode operation (text OR voice — not simultaneously), and manual threshold calibration that fails whenever ambient light conditions change — requiring operator intervention with a multimeter before every session.`,
      solution: `LIME resolves all three limitations in a single battery-powered dual-node system. Each node handles simultaneous bidirectional transmission, carries both text (OOK-encoded) and live audio at the same time, and autonomously self-calibrates its detection threshold before every session — zero user action required.`,
      architecture: [
        "Two symmetric self-contained nodes — Arduino UNO (ATmega328P at 16 MHz)",
        "Two red laser diode transmitters + two solar panel photovoltaic receivers per node",
        "OOK (On-Off Keying) text encoding with Nokia-style 4×4 keypad entry",
        "0.96\" OLED display (SSD1306, I²C bus) for real-time message output on each node",
        "Audio transmitter: TIP142 Darlington transistor modulating laser intensity for voice",
        "Audio receiver chain: LM358 op-amp → PAM class-D amplifier → speaker",
        "Adaptive threshold: T = L_avg + K (K=60 ADC counts, 500ms sampling window)",
        "Power: 4×18650 Li-ion cells → LM7805 linear regulator → 5V regulated rail"
      ],
      results: [
        "100% message accuracy at 1m node separation (indoor lab conditions)",
        "94% message accuracy at 3m node separation",
        "Audio quality MOS score: 3.8/5 at 1m — acceptable intelligibility",
        "Automatic threshold calibration functional across 10 to 800 lux ambient light",
        "Less than 1% BER under controlled conditions at up to 9600 baud",
        "Eliminates RF interference and EMI — suitable for hospitals and EMI-sensitive environments",
        "No comparable system in published literature combines bidirectionality, dual-mode, self-calibration, and standalone UI in one battery-powered unit"
      ],
      technologies: ["Arduino UNO", "ATmega328P", "TIP142 Darlington", "LM358 Op-Amp", "PAM Class-D Amp", "OOK Modulation", "OLED SSD1306", "I²C Bus", "18650 Li-ion", "LM7805", "Embedded C/C++", "Adaptive Threshold Algorithm"],
      links: { github: "https://github.com/Yavkrit", paper: "assets/LIME_Report.docx" }
    },
    {
      id: "einfochips_proj",
      title: "Embedded Camera Platform Development",
      subtitle: "Industry Project at eInfochips (Arrow Electronics) — NDA Protected",
      category: "Embedded Systems / Industry",
      status: "Completed",
      year: "2023 – 2025",
      heroImage: null,
      customVis: "camera",
      tags: ["C/C++", "Linux", "ONVIF", "SUNAPI", "STM32", "REST APIs", "Yocto", "RTOS"],
      overview: `2-year industry tenure at eInfochips (an Arrow Electronics company) contributing to embedded software and firmware development for professional IP camera platforms and multi-sensor surveillance systems. Worked with global industry leaders in the security domain delivering production-grade, standards-compliant firmware and API integrations. Note: Specific project details are protected under confidentiality agreements.`,
      problem: `Professional IP cameras require strict protocol compliance (ONVIF, SUNAPI), reliable low-level peripheral communication, and robust firmware architectures capable of supporting multiple camera profiles (PTZ, multi-sensor) while maintaining interoperability across Video Management Systems (VMS) from multiple vendors.`,
      solution: `Designed and implemented protocol stacks, low-level BSP drivers, and API integration layers for camera platforms used by tier-1 security brands. Ensured standards compliance, cross-system interoperability, and firmware reliability through rigorous unit testing and RTOS optimization.`,
      architecture: [
        "ONVIF Profiles S/G/T/M implementation in C++ on Linux (PTZ, recording, analytics, metadata)",
        "SUNAPI-compliant REST API integration for Hanwha Vision camera ecosystem",
        "STM32 BSP development: GPIO, SPI, I²C, UART, ADC peripheral drivers",
        "Yocto build system integration and ARM cross-compilation toolchain",
        "RTOS task scheduling, interrupt handling, and memory optimization",
        "NSD (Network Storage Drive) module for secure IP-based data caching",
        "RESTful API backend integrations for VMS interoperability",
        "Postman-driven API testing and validation workflows"
      ],
      results: [
        "Production-grade ONVIF stack delivered for PTZ camera product line",
        "SUNAPI compliance achieved for Hanwha Vision client integration",
        "NSD module enabled new data caching capability for storage-less deployments",
        "STM32 BSP drivers validated across multiple peripheral configurations",
        "Firmware reliability improved through systematic unit testing with Google Test",
        "Cross-functional collaboration with teams across hardware, QA, and product"
      ],
      technologies: ["C", "C++", "Linux", "STM32", "RTOS", "ONVIF", "SUNAPI", "RESTful APIs", "Yocto", "ARM Cross-Compilation", "SPI", "I²C", "UART", "GPIO", "Postman", "GDB", "CMake", "Google Test"],
      links: { github: null, paper: null },
      confidential: false,
      industryNote: "🔒 Specific client details and proprietary implementation particulars are protected under NDA. Technologies, responsibilities, and engineering domain shared with professional discretion."
    },
    {
      id: "thz_imaging",
      title: "AI-Assisted Sub-THz Plantar Imaging System",
      subtitle: "Computational Pipeline for CW FPA Camera — Active Doctoral Research",
      category: "AI / Biomedical Imaging / THz",
      status: "In Progress",
      year: "2025 – Present",
      heroImage: null,
      customVis: "thz_plantar",
      tags: ["THz Imaging", "AI", "Computer Vision", "Biomedical", "Python", "Deep Learning"],
      overview: `Active doctoral research at CSIR-CSIO developing a novel AI-assisted imaging system using compact sub-Terahertz (sub-THz) radiation for non-contact biomedical skin analysis. Building an end-to-end computational pipeline combining hardware characterisation, AI-based image enhancement, and quantitative analysis for age group studies across Indian volunteer cohorts.`,
      problem: `Current biomedical imaging methods lack a practical, non-contact, 2D spatially-resolved imaging modality that is simultaneously insensitive to skin tone variation — a critical limitation for diverse South Asian populations where melanin interference affects optical methods.`,
      solution: `Sub-THz radiation (50–700 GHz) is inherently insensitive to melanin, penetrates skin to clinically relevant depths, and interacts strongly with water content. Combining a compact CW FPA camera with an AI-driven computational pipeline enables quantitative analysis without the cost and complexity of traditional THz-TDS systems.`,
      architecture: [
        "CW FPA camera: 50–700 GHz range, compact and room-temperature operation",
        "Multi-image acquisition pipeline for full-area plantar coverage",
        "AI-based image enhancement using CNN/deep learning architectures",
        "Quantitative analysis pipeline with age group stratification",
        "Validation against established reference measurements"
      ],
      results: [
        "DAC-1 Doctoral Advisory Committee review successfully completed — June 2026",
        "Novel end-to-end THz pipeline under active development",
        "Age group stratified analysis ongoing with Indian volunteer cohorts"
      ],
      technologies: ["Python", "TensorFlow", "PyTorch", "OpenCV", "MATLAB", "Signal Processing", "CNN", "NumPy", "Biomedical Imaging"],
      links: { github: "https://github.com/Yavkrit", paper: null, presentation: "assets/thz_presentation.html" },
      confidential: true
    },
    {
      id: "walmart_capstone",
      title: "Retail Sales Intelligence & Forecasting",
      subtitle: "Walmart Multi-Store EDA, Macro-Economic Impact Analysis & 12-Week Predictive Modelling in R",
      category: "Data Science / Predictive Analytics",
      status: "Completed",
      year: "2024",
      heroImage: null,
      isCapstone: true,
      capstoneIcon: "📊",
      tags: ["R", "EDA", "Time Series", "Forecasting", "Retail Analytics", "ggplot2", "Statistics"],
      overview: `End-to-end data science capstone using R on Walmart's multi-store weekly sales dataset (6,435 records, 8 features). The goal was to transform raw transactional data into actionable inventory and business intelligence — answering six specific analytical questions about macro-economic drivers and then building a predictive model to forecast 12 weeks of future sales per store. Covered the full pipeline from data cleaning and outlier handling through EDA, correlation analysis, and time-series forecasting.`,
      problem: `A national retail chain with 45 outlets across the country was unable to match inventory supply with actual demand. Sales varied significantly week-to-week and store-to-store, but without analytical visibility into *why* — whether driven by unemployment, temperature, fuel price, CPI, or holiday seasonality — inventory planning was largely guesswork, leading to costly over- and under-stocking cycles.`,
      solution: `Applied a structured R-based data science workflow: cleaned the dataset, handled missing values, and performed outlier analysis using the IQR method. Used ggplot2 visualisations and correlation analysis to answer each business question individually — unemployment vs. sales, seasonal trends, temperature effects, CPI impact, and store rankings. Then built time-series regression models to forecast next-12-week sales for every store with quantified confidence intervals, enabling data-driven inventory decisions.`,
      architecture: [
        "Dataset: walmart.csv — 6,435 rows × 8 features: Store, Date, Weekly_Sales, Holiday_Flag, Temperature, Fuel_Price, CPI, Unemployment",
        "Data cleaning: missing value imputation, type coercion, date parsing to weekly time index",
        "Outlier analysis: IQR-based detection, boxplot and scatter-overlay visualisations",
        "EDA: distribution analysis across all 45 stores, correlation heatmaps, seasonal decomposition",
        "Unemployment × Sales: correlation analysis to identify most-affected stores",
        "Seasonality analysis: week-of-year aggregation revealing Q4 holiday peaks",
        "Temperature × Sales: scatter regression to quantify weather impact per region",
        "CPI × Sales: store-level CPI grouping to assess consumer price sensitivity",
        "Store ranking: cumulative weekly sales ranking — top and bottom performers identified",
        "Predictive model: time-series regression with 12-week forward forecast per store, confidence intervals plotted"
      ],
      results: [
        "Pinpointed which stores suffered most from high local unemployment — enabling targeted intervention",
        "Confirmed strong Q4 seasonality: holiday weeks drove 15–20% above-average sales across most stores",
        "Temperature showed a weak negative correlation with sales in northern stores — summer slumps explained",
        "High-CPI stores showed dampened long-term growth — identified as market saturation signals",
        "Ranked all 45 stores by historical performance; top-bottom performance gap quantified",
        "12-week sales forecast delivered per store with trend and confidence bands for inventory planning"
      ],
      technologies: ["R", "ggplot2", "dplyr", "tidyr", "lubridate", "forecast", "TSA", "IQR Outlier Analysis", "Time Series Regression", "EDA"],
      links: { github: "https://github.com/Yavkrit", paper: "assets/capstone/walmart_capstone.pdf" }
    },
    {
      id: "customer_churn",
      title: "Customer Churn Prediction — Deep Learning",
      subtitle: "Binary Classification with Keras Neural Networks for Telecom Retention Analytics",
      category: "Deep Learning / Business Analytics",
      status: "Completed",
      year: "2024",
      heroImage: null,
      isCapstone: true,
      capstoneIcon: "🔄",
      tags: ["Keras", "Deep Learning", "Binary Classification", "Telecom", "Python", "Neural Networks", "Dropout Regularisation"],
      overview: `Built a complete deep learning pipeline in Python (Keras/TensorFlow) to predict binary customer churn for a telecom company. The project covered the full workflow — data manipulation and filtering, EDA with business visualisations, and progressive construction of three neural network architectures of increasing sophistication — from a baseline model through dropout regularisation to a multi-feature classifier. Confusion matrices and Accuracy vs. Epochs plots were generated for each model to evaluate and compare performance.`,
      problem: `Telecom company "Leo" was losing customers to competitors with no early warning system to identify at-risk subscribers. Reactive retention — contacting customers after they've already churned — is expensive and largely ineffective. The challenge was to build a predictive model that could flag churn risk before it materialised, using available subscriber data.`,
      solution: `Approached the problem in three phases: (1) data manipulation to segment and filter the customer base by demographics and usage patterns; (2) business visualisations to understand churn distribution and service breakdowns; and (3) progressive neural network design in Keras — starting with a baseline 2-layer model on a single feature, then adding dropout regularisation to combat overfitting, and finally expanding to a multi-feature input model for improved predictive power. Models were evaluated with confusion matrices and training curves.`,
      architecture: [
        "Data manipulation: filtered male customers, DSL internet subscribers, female senior citizens paying by mailed cheque, and early-tenure / low-spend customers",
        "Visualisation: pie chart of churn distribution across the subscriber base; bar chart of Internet Service type breakdown",
        "Model 1 — Baseline: Input layer (12 nodes, ReLU) → Hidden layer (8 nodes, ReLU) → Output; feature: Tenure; Adam optimiser; 150 epochs",
        "Model 2 — Regularised: Added Dropout(0.3) after input layer and Dropout(0.2) after hidden layer to reduce overfitting; same features and hyperparameters",
        "Model 3 — Multi-feature: Extended input to Tenure + Monthly Charges + Total Charges; same 12→8 architecture with Adam, 150 epochs",
        "Evaluation: confusion matrix and Accuracy vs. Epochs graph generated for all three models; test set predictions compared against ground truth"
      ],
      results: [
        "All three models successfully trained and evaluated; accuracy curves showed stable convergence within 150 epochs",
        "Dropout regularisation (Model 2) reduced overfitting relative to the baseline — train/val accuracy gap narrowed",
        "Multi-feature model (Model 3) achieved the best overall generalisation — Tenure alone was insufficient as a sole predictor",
        "Confusion matrix analysis confirmed meaningful churn class recall — minimising false negatives critical for retention targeting",
        "Data manipulation tasks surfaced key subscriber segments: high churn risk concentrated in short-tenure, low-spend users",
        "Actionable insight: monthly charges and total spend are stronger churn signals than tenure alone"
      ],
      technologies: ["Python", "Keras", "TensorFlow", "Pandas", "NumPy", "Matplotlib", "Dropout Regularisation", "Adam Optimiser", "Confusion Matrix", "Binary Classification", "Jupyter Notebook"],
      links: { github: "https://github.com/Yavkrit", paper: "assets/capstone/customer_churn.pdf" }
    },
    {
      id: "covid_analysis",
      title: "COVID-19 Trend Analysis & Forecasting",
      subtitle: "Multi-Source Pandemic Data Pipeline with Plotly Interactive Visualisation & Facebook Prophet Forecasting",
      category: "Data Analysis / Public Health / Time Series",
      status: "Completed",
      year: "2024",
      heroImage: null,
      isCapstone: true,
      capstoneIcon: "🦠",
      tags: ["Python", "Pandas", "Plotly", "Facebook Prophet", "Time Series", "Forecasting", "Public Health"],
      overview: `Built an end-to-end pandemic analytics pipeline in Python to analyse COVID-19 trends across India and globally. The project ingested multi-file datasets (CSV + Excel) covering confirmed cases, deaths, and recoveries, then used Plotly for rich interactive visualisations and Facebook Prophet for time-series forecasting. The final output was a visual prediction of expected case counts one week into the future, grounded in the actual statistical trend of the outbreak data.`,
      problem: `The COVID-19 pandemic produced enormous volumes of daily case data across hundreds of countries and Indian states. Raw data across multiple files in mixed formats was difficult to combine and interpret. Without a structured analytical pipeline, identifying the real trend signal (vs. reporting noise), understanding infection vs. recovery trajectories, and making near-term forecasts was practically infeasible for decision-makers.`,
      solution: `Designed a Python pipeline that: (1) used Pandas to programmatically accumulate and merge data from multiple CSV and Excel files into a unified time-indexed dataset; (2) applied Plotly to create interactive, zoomable visualisations of infection growth, death rates, and recovery curves — both globally and for India specifically; (3) integrated Facebook Prophet to model the time series and generate 7-day-ahead case count forecasts; and (4) combined the historical trend and the Prophet forecast in a single visual to communicate predicted outbreak trajectory clearly.`,
      architecture: [
        "Data ingestion: multi-file accumulation using Pandas — CSV and Excel files merged on date and region keys",
        "Dataset scope: global confirmed cases, deaths, recovered; India-specific state-level breakdown",
        "Preprocessing: date parsing, forward-fill for missing records, cumulative vs. daily new case derivation",
        "Visualisation (Plotly): interactive line charts for infection growth, death curves, recovery rates — global and India",
        "Rate analysis: case fatality rate (CFR) and recovery rate computed and visualised over time",
        "Time-series modelling: Facebook Prophet fit to confirmed case trend — daily seasonality and trend components extracted",
        "Forecast output: 7-day forward prediction with Prophet uncertainty intervals plotted alongside historical actuals",
        "Combined visualisation: historical data + forecast overlay in a single interactive Plotly figure"
      ],
      results: [
        "Successfully merged and cleaned multi-source pandemic data into a unified, analysis-ready dataset",
        "Plotly interactive charts clearly revealed India's distinct COVID-19 wave structure and recovery improvement over time",
        "Case fatality rate trend analysis showed declining CFR in later waves — consistent with improved clinical protocols",
        "Facebook Prophet accurately captured the underlying trend and seasonal reporting patterns in the data",
        "7-day case forecast generated with confidence intervals — demonstrating practical near-term predictive capability",
        "Combined historical + forecast visualisation provided clear, communicable epidemiological insight"
      ],
      technologies: ["Python", "Pandas", "Plotly", "Facebook Prophet", "NumPy", "Multi-file Data Merging", "Time Series Forecasting", "Interactive Visualisation", "Jupyter Notebook"],
      links: { github: "https://github.com/Yavkrit", paper: "assets/capstone/covid19_analysis.pdf" }
    }
  ],

  // ── RESEARCH (concise, no sensitive details) ──────────────
  research: {
    current: {
      title: "AI-Assisted Sub-Terahertz Imaging for Biomedical Applications",
      institution: "CSIR-CSIO, Chandigarh / AcSIR New Delhi",
      supervisor: "Dr. Naveen Sharma (Senior Scientist)",
      focus: "Age Group Analysis · Non-Contact Imaging · Terahertz",
      summary: `My doctoral research focuses on developing a novel non-contact biomedical imaging system using compact sub-Terahertz (sub-THz) radiation, enhanced with artificial intelligence. The goal is to create an accessible, non-invasive imaging capability that works effectively across diverse populations — a challenge that existing optical methods struggle with. This is active, ongoing research at CSIR-CSIO, Chandigarh.`,
      highlights: [
        "Non-contact, non-ionising sub-THz imaging for biomedical skin analysis",
        "AI-driven computational image enhancement pipeline",
        "Quantitative analysis across different age groups",
        "Population-inclusive imaging — effective across diverse skin tones",
        "DAC-1 (Doctoral Advisory Committee Review 1) cleared — June 2026"
      ]
    },
    publications: []
  },

  // ── SKILLS ───────────────────────────────────────────────
  skills: {
    "Languages & Programming": [
      { name: "C / C++", level: 88 }, { name: "Python", level: 85 },
      { name: "Embedded C", level: 88 }, { name: "Bash / Shell", level: 72 },
      { name: "R (Data Science)", level: 70 }, { name: "MATLAB", level: 70 }
    ],
    "Embedded & Hardware": [
      { name: "STM32 / Arduino", level: 88 }, { name: "Linux / RTOS", level: 84 },
      { name: "SPI / I²C / UART", level: 86 }, { name: "Yocto / ARM", level: 78 },
      { name: "BSP Development", level: 75 }, { name: "GPIO / ADC Drivers", level: 85 }
    ],
    "Protocols & Standards": [
      { name: "ONVIF (S/G/T/M)", level: 85 }, { name: "SUNAPI", level: 82 },
      { name: "RESTful APIs", level: 88 }, { name: "TCP/IP", level: 80 },
      { name: "Postman / API Testing", level: 90 }, { name: "CMake / Make", level: 76 }
    ],
    "AI & Data Science": [
      { name: "TensorFlow", level: 78 }, { name: "OpenCV", level: 82 },
      { name: "Computer Vision", level: 80 }, { name: "Scikit-learn", level: 75 },
      { name: "PyTorch", level: 70 }, { name: "Google Test / Mock", level: 75 }
    ]
  },

  // ── CERTIFICATES ─────────────────────────────────────────
  // Each cert supports: title, issuer, date, credentialId, pdfFile, pdfs (array for multi-cert), link
  certificates: [
    {
      id: "cert_ds_ai",
      title: "Advanced Certification in Data Science & AI",
      issuer: "IIT Madras (Pravartak / Intellipaat)",
      date: "2024",
      credentialId: null,
      pdfs: [
        { label: "Programme Certificate — IIT Madras", file: "assets/certificates/ds_ai_cert.pdf" },
        { label: "Intellipaat Completion Certificate", file: "assets/certificates/intellipaat_cert.pdf" }
      ],
      link: null,
      tags: ["Data Science", "AI", "Machine Learning", "IIT Madras"]
    },
    {
      id: "cert_cpp_test",
      title: "C++ Unit Testing: Google Test & Google Mock",
      issuer: "Udemy",
      date: "2024",
      credentialId: null,
      pdfFile: "assets/certificates/cpp_unit_testing.pdf",
      link: null,
      tags: ["C++", "Unit Testing", "Google Test", "TDD"]
    },
    {
      id: "cert_cpp_adv",
      title: "Advanced C Programming: Pointers & Memory Management",
      issuer: "Udemy",
      date: "2023",
      credentialId: null,
      pdfs: [
        { label: "Certificate I — Pointers", file: "assets/certificates/cpp_adv_pointers.pdf" },
        { label: "Certificate II — Advanced Course", file: "assets/certificates/cpp_adv_course.pdf" }
      ],
      link: null,
      tags: ["C", "Pointers", "Memory Management", "Embedded"]
    },
    {
      id: "cert_ai_managers",
      title: "AI for Managers",
      issuer: "Microsoft & LinkedIn Learning",
      date: "2024",
      credentialId: null,
      pdfFile: "assets/certificates/ai_managers.pdf",
      link: null,
      tags: ["AI", "Management", "Microsoft", "LinkedIn Learning"]
    },
    {
      id: "cert_android",
      title: "Android App Development",
      issuer: "Online Certification",
      date: "2023",
      credentialId: null,
      pdfFile: "assets/certificates/android_dev.pdf",
      link: null,
      tags: ["Android", "Mobile Development", "Java/Kotlin"]
    }
  ],

  // ── TIMELINE ─────────────────────────────────────────────
  timeline: [
    { year: "2019", event: "B.Tech at CHARUSAT", detail: "Electronics & Communication Engineering. CGPA: 8.69/10. Anand, Gujarat.", type: "education" },
    { year: "2021–22", event: "Engineering Internship — vivo / DBG Technology", detail: "PCBA validation, SMT line ops, CCD inspection across OPPO/VIVO/Xiaomi production lines.", type: "work" },
    { year: "2022–23", event: "LIME Project — Self-Built Li-Fi System", detail: "Designed, built, and tested a complete bidirectional FSO communication system from scratch. <1% BER, 9600 baud.", type: "project" },
    { year: "2023", event: "B.Tech Graduation", detail: "Graduated from CHARUSAT with CGPA 8.69. Joined eInfochips.", type: "education" },
    { year: "2023–25", event: "Embedded Software Engineer — eInfochips", detail: "Firmware for PTZ cameras & multi-sensor platforms. ONVIF/SUNAPI, STM32, RTOS, Yocto, Linux.", type: "work" },
    { year: "2025", event: "Joined CSIR-CSIO as IDDP Scholar", detail: "Began Integrated M.Tech + Ph.D. at AcSIR under Dr. Naveen Sharma. THz + AI research.", type: "education" },
    { year: "2026", event: "DAC-1 Successfully Cleared", detail: "Doctoral Advisory Committee Review 1 for THz biomedical imaging research. Chandigarh.", type: "milestone" }
  ]
};
