import type { EducationItem, ResearchDirection, TimelineItem } from "@/types/content";

export const identity = {
  name: "Weiping Yan",
  email: "vipinapple986@gmail.com",
  github: "https://github.com/appleweiping",
  linkedin: "https://www.linkedin.com/in/weiping-yan-b62567383",
  title: {
    en: "AI for Science Undergraduate Researcher",
    zh: "AI for Science 本科研究者",
  },
  summary: {
    en: "I work at the intersection of machine learning, scientific inquiry, and engineering design. My current interests include AI for Science, foundation models for technical workflows, and AI-assisted analog circuit modeling and optimization.",
    zh: "我的工作位于机器学习、科学探索与工程设计的交叉地带。目前主要关注 AI for Science、面向技术工作流的基础模型，以及 AI 辅助的模拟电路建模与优化。",
  },
};

export const researchDirections: ResearchDirection[] = [
  {
    id: "ai4s",
    title: { en: "AI for Science", zh: "科学智能" },
    summary: {
      en: "Learning systems for scientific and engineering problems where physical structure, constraints, and reproducible evidence matter.",
      zh: "面向科学与工程问题构建学习系统，重视物理结构、领域约束与可复现证据。",
    },
  },
  {
    id: "foundation-models",
    title: { en: "Foundation models", zh: "基础模型" },
    summary: {
      en: "Foundation models as reasoning tools for recommendation, structured knowledge, and complex technical workflows.",
      zh: "将基础模型用于推荐、结构化知识与复杂技术工作流中的推理。",
    },
  },
  {
    id: "analog-eda",
    title: { en: "AI-driven analog EDA", zh: "AI 驱动的模拟 EDA" },
    summary: {
      en: "Machine-learning methods for analog circuit modeling, optimization, and design automation under physical constraints.",
      zh: "探索物理约束下的模拟电路建模、优化与设计自动化方法。",
    },
  },
];

export const timeline: TimelineItem[] = [
  {
    id: "umn-nlp",
    kind: "research",
    organization: "University of Minnesota — Minnesota NLP Group",
    role: { en: "NLP Research Intern", zh: "自然语言处理研究实习生" },
    dates: { en: "July 2026 — Present", zh: "2026 年 7 月 — 至今" },
    summary: {
      en: "Undergraduate research internship in natural language processing. Public project details are linked only when supporting evidence is available.",
      zh: "参与自然语言处理方向的本科研究实习；仅在存在公开证据时关联具体项目。",
    },
  },
  {
    id: "veylora",
    kind: "entrepreneurship",
    organization: "Veylora Labs",
    role: { en: "Co-Founder", zh: "联合创始人" },
    dates: { en: "May 2026 — Present", zh: "2026 年 5 月 — 至今" },
    summary: {
      en: "Developing executive-intelligence systems that help organizational leaders identify patterns, risks, and opportunities across fragmented operational information.",
      zh: "开发面向管理者的组织智能系统，从分散的运营信息中识别模式、风险与机会。",
    },
  },
  {
    id: "cuhk",
    kind: "research",
    organization: "The Chinese University of Hong Kong",
    role: { en: "Research Assistant", zh: "研究助理" },
    dates: { en: "March 2026 — Present", zh: "2026 年 3 月 — 至今" },
    summary: {
      en: "Research activity in LLM for Recommendation (LLM4Rec) and AI for Science.",
      zh: "开展大语言模型推荐（LLM4Rec）与 AI for Science 方向的研究工作。",
    },
  },
  {
    id: "tue-ta",
    kind: "teaching",
    organization: "Eindhoven University of Technology",
    role: { en: "Teaching Assistant", zh: "教学助理" },
    dates: { en: "September 2025 — November 2025", zh: "2025 年 9 月 — 2025 年 11 月" },
    summary: {
      en: "Supported undergraduate teaching in calculus and logic/set theory through tutorials, problem solving, and structured feedback.",
      zh: "协助本科微积分与逻辑/集合论教学，组织习题课并提供结构化反馈。",
    },
    details: [
      {
        en: "Guided work on limits, derivatives, integrals, formal reasoning, and set operations.",
        zh: "辅导极限、导数、积分、形式推理与集合运算。",
      },
    ],
  },
  {
    id: "zhangjiang",
    kind: "research",
    organization: "Zhangjiang Laboratory",
    role: { en: "Research Assistant", zh: "研究助理" },
    dates: { en: "July 2025 — September 2025", zh: "2025 年 7 月 — 2025 年 9 月" },
    location: { en: "Shanghai, China", zh: "中国上海" },
    summary: {
      en: "Studied semiconductor IC design workflows and EDA toolchains from schematic and pre-layout simulation through verification and MPW-oriented tape-out preparation.",
      zh: "研究半导体 IC 设计流程与 EDA 工具链，覆盖原理图、预布局仿真、版图验证及面向 MPW 的流片准备。",
    },
    details: [
      {
        en: "Documented public PDK concepts and how DRC constraints influence layout strategy and manufacturability.",
        zh: "整理公开 PDK 概念及 DRC 约束对版图策略与可制造性的影响。",
      },
      {
        en: "Compiled notes on DRC/LVS roles, common failure modes, and sign-off debugging approaches.",
        zh: "整理 DRC/LVS 的作用、常见失败模式与 sign-off 调试方法。",
      },
      {
        en: "Prepared a milestone and risk overview from schematic sign-off to foundry submission; no tape-out claim is made.",
        zh: "形成从原理图签核到代工厂提交的里程碑与风险概览，不宣称已完成流片。",
      },
    ],
  },
  {
    id: "pm25",
    kind: "research",
    organization: "Independent research project",
    role: { en: "Student Researcher", zh: "学生研究者" },
    dates: { en: "September 2023 — February 2024", zh: "2023 年 9 月 — 2024 年 2 月" },
    location: { en: "Beijing, China", zh: "中国北京" },
    summary: {
      en: "Investigated PM2.5 exposure and respiratory-disease incidence under the joint supervision of Prof. Soummya Kar (Carnegie Mellon University) and Associate Prof. Qiang Gao (Southeast University).",
      zh: "在卡内基梅隆大学 Soummya Kar 教授与东南大学高强副教授共同指导下，研究 PM2.5 暴露与呼吸系统疾病发病率的关系。",
    },
    details: [
      {
        en: "Built a structured environmental and public-health dataset and used Python for exploratory analysis, statistical inference, and visualization.",
        zh: "构建环境与公共健康结构化数据集，并使用 Python 进行探索性分析、统计推断和可视化。",
      },
    ],
  },
];

export const higherEducation: EducationItem[] = [
  {
    id: "umn",
    institution: "University of Minnesota",
    program: {
      en: "B.S. studies in Computer Science and Electrical Engineering",
      zh: "计算机科学与电气工程本科阶段学习",
    },
    dates: { en: "May 2026 — Present", zh: "2026 年 5 月 — 至今" },
  },
  {
    id: "delft-tue",
    institution: "Delft University of Technology × Eindhoven University of Technology",
    program: {
      en: "Concurrent B.Sc. studies across Computer Science & Engineering, Electrical Engineering, and Applied Physics",
      zh: "计算机科学与工程、电气工程、应用物理并行本科阶段学习",
    },
    dates: { en: "September 2024 — August 2026", zh: "2024 年 9 月 — 2026 年 8 月" },
    note: { en: "Transferred to the University of Minnesota.", zh: "后转入明尼苏达大学。" },
  },
];

export const earlierEducation: EducationItem[] = [
  {
    id: "hznu-high",
    institution: "The Affiliated High School to Hangzhou Normal University",
    program: {
      en: "High School Diploma — Chinese, Mathematics, English, Physics, Chemistry, and Technology",
      zh: "高中课程 — 语文、数学、英语、物理、化学与技术",
    },
    dates: { en: "September 2021 — August 2024", zh: "2021 年 9 月 — 2024 年 8 月" },
  },
  {
    id: "sfls",
    institution: "Shanghai Foreign Language School Affiliated to SISU",
    program: { en: "Science and Engineering", zh: "理工方向学习" },
    dates: { en: "July 2023 — August 2024", zh: "2023 年 7 月 — 2024 年 8 月" },
  },
];

export const skills = {
  en: [
    "Statistical inference",
    "Data analysis",
    "Data visualization",
    "Machine learning",
    "Scientific computing",
    "Research software engineering",
  ],
  zh: ["统计推断", "数据分析", "数据可视化", "机器学习", "科学计算", "科研软件工程"],
};

export const homeEvidenceSlugs = [
  "topo-flow-limits",
  "inr-aliasing-limits",
  "lumen-rec",
  "truce-rec",
  "venus-basestation",
  "art-history-museum",
];
