const root = document.documentElement
root.classList.add('js')

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const languageStorageKey = 'site-language'
const supportedLanguages = ['en', 'zh', 'ja']

const translations = {
  en: {
    skipToContent: 'Skip to content',
    siteLabel: 'Academic Profile',
    navPrimaryLabel: 'Primary',
    langGroupLabel: 'Language selector',
    navProfile: 'Profile',
    navResume: 'Resume',
    metaTitleProfile: 'Weiping Yan | プロフィール',
    metaDescriptionProfile: 'Weiping Yan は AI for Science、基盤モデル、AI によるアナログ回路設計・最適化に取り組む AI4X 学部研究者です。',
    profileHeroTitle: 'AI4X undergraduate researcher in the joint program between TU Delft and Eindhoven University of Technology.',
    profileHeroLede: 'I work across computer science, electrical engineering, and applied physics, with a primary interest in AI for Science, foundation models, and AI-driven analog circuit design and optimization.',
    profileHeroNote: 'I am interested in research where learning systems have to remain accountable to scientific structure, technical constraints, and real engineering design decisions.',
    readResume: 'Read resume',
    openPdf: 'Open PDF',
    contactLinksLabel: 'Contact links',
    contactEmail: 'Email',
    portraitAlt: 'Portrait of Weiping Yan',
    portraitCaption: 'AI4X undergraduate researcher.',
    academicSummaryLabel: 'Academic summary',
    identityProgram: 'Program',
    identityProgramValue: 'TU Delft x Eindhoven University of Technology',
    identityBackground: 'Background',
    identityBackgroundValue: 'Computer science, electrical engineering, applied physics',
    identityDirection: 'Direction',
    identityDirectionValue: 'AI for Science, foundation models, analog circuit optimization',
    profileNarrativeLabel: 'Profile narrative',
    readingPath: 'Reading Path',
    narrativeLede: 'A compact academic profile, organized as a guided line from identity to research direction, selected experience, and contact.',
    aboutHeading: '自己紹介',
    aboutIntro: 'I am an undergraduate student in the joint program between Delft University of Technology and Eindhoven University of Technology.',
    aboutBody1: 'My training spans computer science, electrical engineering, and applied physics, which shapes how I approach research problems: not as isolated software tasks, but as questions about representation, system behavior, and design under constraints.',
    aboutBody2: 'I am moving toward research that connects modern machine learning with scientific understanding and engineering automation, especially in domains where physical structure still has to remain legible.',
    researchHeading: 'Research directions',
    researchIntro: 'The problems that interest me sit where model capability meets scientific or engineering structure.',
    researchAi4ScienceTitle: 'AI for Science',
    researchAi4ScienceBody: 'Applying learning systems to scientific and technical problems where domain constraints, structure, and usefulness matter more than generic benchmark performance.',
    researchFoundationTitle: 'Foundation models',
    researchFoundationBody: 'Interested in foundation models as reasoning tools for technical workflows, structured knowledge, and complex design tasks rather than only conversational interfaces.',
    researchAnalogTitle: 'Analog circuit design and optimization',
    researchAnalogBody: 'Exploring AI-driven methods for analog circuit modeling, optimization, and design automation in physically constrained environments.',
    experienceHeading: 'Selected experience',
    experienceIntro: 'Recent work has moved between machine learning research, semiconductor workflows, and data-driven scientific analysis.',
    exp1Date: 'Mar 2026 - Present',
    exp1Title: 'Research Assistant Intern, AI Research Group',
    exp1Body: 'Working on LLM for Recommendation (LLM4Rec).',
    exp2Date: 'Jul 2025 - Sep 2025',
    exp2Title: 'Research Assistant, Zhangjiang Laboratory',
    exp2Body: 'Studied semiconductor IC design workflows and EDA toolchains, including schematic design, pre-layout simulation, layout verification, DRC/LVS, and MPW-oriented tape-out preparation.',
    exp3Date: 'Sep 2023 - Feb 2024',
    exp3Title: 'Student Researcher, Carnegie Mellon University',
    exp3Body: 'Conducted an environmental data research project on the relation between PM2.5 air pollution and respiratory disease incidence using Python for exploratory analysis, statistical inference, and visualization.',
    contactHeading: 'Contact',
    contactIntro: 'Open to research conversations, academic collaborations, and future opportunities aligned with these directions.',
    resumePageLink: 'Resume page',
    footerNote: 'Minimal academic site designed for direct GitHub Pages deployment.',
    metaTitleResume: 'Weiping Yan | 履歴書',
    metaDescriptionResume: 'Resume and academic summary for Weiping Yan.',
    resumePageTitle: 'Formal record, kept simple.',
    resumePageLede: 'This page provides a short structured summary above the PDF. The PDF remains the canonical document for applications and direct sharing.',
    resumeSummaryLabel: 'Resume summary',
    resumeEducationLabel: 'Education',
    resumeEducationTitle: 'TU Delft x Eindhoven University of Technology',
    resumeEducationBody: 'B.Sc. in Computer Science, Electrical Engineering and Applied Physics, Sep 2024 - Jun 2028.',
    resumeResearchLabel: 'Research direction',
    resumeResearchTitle: 'AI for Science, foundation models, analog design',
    resumeResearchBody: 'Focused on technically grounded research linking machine learning with scientific reasoning, engineering workflows, and circuit optimization.',
    resumeExperienceLabel: 'Selected experience',
    resumeExperienceTitle: 'Research across ML and semiconductor systems',
    resumeExperiencePoint1: 'LLM for Recommendation research',
    resumeExperiencePoint2: 'Zhangjiang Laboratory semiconductor workflow training',
    resumeExperiencePoint3: 'Environmental data research using Python',
    resumeLinksLabel: 'Links',
    resumeLinksTitle: 'Direct contact and files',
    openPdfDirectly: 'Open PDF directly',
    pdfLabel: 'PDF',
    embeddedResumeViewer: 'Embedded resume viewer',
    openOrDownloadPdf: 'Open or download the PDF',
    resumeFrameTitle: 'Weiping Yan resume PDF',
    resumeDocumentNote: 'If the embedded viewer does not render in your browser, use the direct PDF link above.',
  },
  zh: {
    skipToContent: '跳至正文',
    siteLabel: '學術主頁',
    navPrimaryLabel: '主導航',
    langGroupLabel: '語言切換',
    navProfile: '主頁',
    navResume: '簡歷',
    metaTitleProfile: '嚴煒平 | 主頁',
    metaDescriptionProfile: '嚴煒平是一名 AI4X 本科研究者，主要關注 AI for Science、基礎模型，以及 AI 驅動的模擬電路設計與優化。',
    profileHeroTitle: 'AI4X 本科研究者，就讀於 TU Delft 與 Eindhoven University of Technology 聯合培養項目。',
    profileHeroLede: '我的背景橫跨計算機科學、電子工程與應用物理，目前主要關注 AI for Science、基礎模型，以及 AI 驅動的模擬電路設計與優化。',
    profileHeroNote: '我對這類研究問題特別感興趣：學習系統必須同時對科學結構、技術約束與真實工程設計決策保持可解釋與可負責。',
    readResume: '查看簡歷',
    openPdf: '打開 PDF',
    contactLinksLabel: '聯絡方式',
    contactEmail: '郵箱',
    portraitAlt: '嚴煒平的個人照片',
    portraitCaption: 'AI4X 本科研究者。',
    academicSummaryLabel: '學術摘要',
    identityProgram: '項目',
    identityProgramValue: 'TU Delft x Eindhoven University of Technology',
    identityBackground: '背景',
    identityBackgroundValue: '計算機科學、電子工程、應用物理',
    identityDirection: '方向',
    identityDirectionValue: 'AI for Science、基礎模型、模擬電路優化',
    profileNarrativeLabel: '主頁敘事',
    readingPath: '閱讀路徑',
    narrativeLede: '這是一份緊湊的學術主頁，通過一條導向路徑將身份、研究方向、經歷與聯絡方式串聯起來。',
    aboutHeading: '關於我',
    aboutIntro: '我是一名就讀於 Delft University of Technology 與 Eindhoven University of Technology 聯合培養項目的本科生。',
    aboutBody1: '我的訓練背景橫跨計算機科學、電子工程與應用物理，因此我更傾向於把研究問題視為表徵、系統行為與受約束設計的問題，而不只是孤立的軟件任務。',
    aboutBody2: '我正在逐步走向一類研究方向：將現代機器學習與科學理解、工程自動化連接起來，尤其是在物理結構仍需保持清晰可讀的場景中。',
    researchHeading: '研究方向',
    researchIntro: '我最感興趣的問題，通常出現在模型能力與科學或工程結構相遇的地方。',
    researchAi4ScienceTitle: 'AI for Science',
    researchAi4ScienceBody: '將學習系統應用於具有明確領域約束、結構性與實際價值的科學與工程問題，而不只停留在通用基準表現上。',
    researchFoundationTitle: '基礎模型',
    researchFoundationBody: '關注基礎模型作為技術工作流、結構化知識與複雜設計任務中的推理工具，而不僅是對話界面。',
    researchAnalogTitle: '模擬電路設計與優化',
    researchAnalogBody: '探索 AI 驅動的方法，用於受物理約束的模擬電路建模、優化與設計自動化。',
    experienceHeading: '代表經歷',
    experienceIntro: '最近幾段經歷主要分布在機器學習研究、半導體工作流，以及數據驅動的科學分析之間。',
    exp1Date: '2026年3月 - 至今',
    exp1Title: '研究助理實習生，AI Research Group',
    exp1Body: '參與 LLM for Recommendation（LLM4Rec）方向的研究工作。',
    exp2Date: '2025年7月 - 2025年9月',
    exp2Title: '研究助理，張江實驗室',
    exp2Body: '學習半導體 IC 設計工作流與 EDA 工具鏈，包括原理圖設計、前仿真、版圖驗證、DRC/LVS 以及面向 MPW 的流片準備。',
    exp3Date: '2023年9月 - 2024年2月',
    exp3Title: '學生研究者，Carnegie Mellon University',
    exp3Body: '使用 Python 對 PM2.5 空氣污染與呼吸系統疾病發病率之間的關係進行環境數據研究，包括探索分析、統計推斷與可視化。',
    contactHeading: '聯絡',
    contactIntro: '歡迎與我交流研究問題、學術合作，以及與上述方向相關的未來機會。',
    resumePageLink: '簡歷頁面',
    footerNote: '面向 GitHub Pages 直接部署的極簡學術網站。',
    metaTitleResume: '嚴煒平 | 簡歷',
    metaDescriptionResume: '嚴煒平的簡歷與學術摘要頁面。',
    resumePageTitle: '正式履歷，保持簡潔。',
    resumePageLede: '本頁先提供一份簡短的結構化摘要，再附上 PDF。PDF 仍然是正式申請與分享時的標準版本。',
    resumeSummaryLabel: '簡歷摘要',
    resumeEducationLabel: '教育',
    resumeEducationTitle: 'TU Delft x Eindhoven University of Technology',
    resumeEducationBody: '本科：計算機科學、電子工程與應用物理，2024年9月 - 2028年6月。',
    resumeResearchLabel: '研究方向',
    resumeResearchTitle: 'AI for Science、基礎模型、模擬設計',
    resumeResearchBody: '聚焦於將機器學習與科學推理、工程工作流及電路優化連接起來的技術型研究問題。',
    resumeExperienceLabel: '代表經歷',
    resumeExperienceTitle: '跨機器學習與半導體系統的研究實踐',
    resumeExperiencePoint1: 'LLM for Recommendation 研究',
    resumeExperiencePoint2: '張江實驗室半導體工作流訓練',
    resumeExperiencePoint3: '使用 Python 進行環境數據研究',
    resumeLinksLabel: '鏈接',
    resumeLinksTitle: '聯絡方式與文件入口',
    openPdfDirectly: '直接打開 PDF',
    pdfLabel: 'PDF',
    embeddedResumeViewer: '內嵌簡歷查看器',
    openOrDownloadPdf: '打開或下載 PDF',
    resumeFrameTitle: '嚴煒平簡歷 PDF',
    resumeDocumentNote: '如果你的瀏覽器無法顯示內嵌查看器，請使用上方的 PDF 直接鏈接。',
  },
  ja: {
    skipToContent: '本文へ移動',
    siteLabel: '学術プロフィール',
    navPrimaryLabel: 'メインナビゲーション',
    langGroupLabel: '言語切替',
    navProfile: 'プロフィール',
    navResume: '履歴書',
    metaTitleProfile: 'Weiping Yan | Profile',
    metaDescriptionProfile: 'Weiping Yan is an AI4X undergraduate researcher working across AI for Science, foundation models, and AI-driven analog circuit design and optimization.',
    profileHeroTitle: 'TU Delft と Eindhoven University of Technology の合同プログラムに所属する AI4X 学部研究者。',
    profileHeroLede: '私の背景は計算機科学、電気電子工学、応用物理にまたがっており、主な関心は AI for Science、基盤モデル、そして AI によるアナログ回路設計・最適化です。',
    profileHeroNote: '特に、学習システムが科学的構造、技術的制約、そして実際の工学設計判断に対して説明可能であり続ける必要のある研究課題に関心があります。',
    readResume: '履歴書を見る',
    openPdf: 'PDF を開く',
    contactLinksLabel: '連絡先リンク',
    contactEmail: 'メール',
    portraitAlt: 'Weiping Yan のポートレート',
    portraitCaption: 'AI4X 学部研究者。',
    academicSummaryLabel: '学術サマリー',
    identityProgram: 'プログラム',
    identityProgramValue: 'TU Delft x Eindhoven University of Technology',
    identityBackground: '背景',
    identityBackgroundValue: '計算機科学、電気電子工学、応用物理',
    identityDirection: '研究軸',
    identityDirectionValue: 'AI for Science、基盤モデル、アナログ回路最適化',
    profileNarrativeLabel: 'プロフィール構成',
    readingPath: '読書の導線',
    narrativeLede: 'このページは、アイデンティティから研究関心、経験、連絡先へと視線を導く、コンパクトな学術プロフィールとして構成されています。',
    aboutHeading: 'About',
    aboutIntro: '私は Delft University of Technology と Eindhoven University of Technology の合同プログラムに所属する学部生です。',
    aboutBody1: '計算機科学、電気電子工学、応用物理にまたがる訓練を受けてきたため、研究課題を単なるソフトウェア問題ではなく、表現、システム挙動、制約下での設計の問題として捉える傾向があります。',
    aboutBody2: '現在は、現代の機械学習を科学的理解や工学的自動化へと接続する研究、とくに物理的構造の可読性が依然として重要な領域へと進んでいます。',
    researchHeading: '研究方向',
    researchIntro: '私が最も関心を持つのは、モデル能力と科学・工学の構造が交わる地点にある問題です。',
    researchAi4ScienceTitle: 'AI for Science',
    researchAi4ScienceBody: '領域制約、構造、実用性が重要となる科学・工学の課題に対して、学習システムを適用することに関心があります。',
    researchFoundationTitle: '基盤モデル',
    researchFoundationBody: '基盤モデルを、対話インターフェースだけでなく、技術ワークフロー、構造化知識、複雑な設計タスクのための推論手段として捉えています。',
    researchAnalogTitle: 'アナログ回路設計と最適化',
    researchAnalogBody: '物理制約の強い環境における、アナログ回路のモデリング、最適化、設計自動化のための AI 駆動手法を探っています。',
    experienceHeading: '主な経験',
    experienceIntro: '最近の活動は、機械学習研究、半導体ワークフロー、そしてデータ駆動型の科学分析にまたがっています。',
    exp1Date: '2026年3月 - 現在',
    exp1Title: 'Research Assistant Intern, AI Research Group',
    exp1Body: 'LLM for Recommendation（LLM4Rec）に関する研究に取り組んでいます。',
    exp2Date: '2025年7月 - 2025年9月',
    exp2Title: 'Research Assistant, Zhangjiang Laboratory',
    exp2Body: '回路図設計、プリレイアウトシミュレーション、レイアウト検証、DRC/LVS、MPW 向けテープアウト準備を含む、半導体 IC 設計ワークフローと EDA ツールチェーンを学びました。',
    exp3Date: '2023年9月 - 2024年2月',
    exp3Title: 'Student Researcher, Carnegie Mellon University',
    exp3Body: 'PM2.5 大気汚染と呼吸器疾患発症率の関係について、Python を用いた探索分析、統計推論、可視化を含む環境データ研究を行いました。',
    contactHeading: '連絡先',
    contactIntro: '研究に関する対話、学術的な協力、そしてこれらの方向に沿った今後の機会について歓迎します。',
    resumePageLink: '履歴書ページ',
    footerNote: 'GitHub Pages へ直接デプロイできるミニマルな学術サイトです。',
    metaTitleResume: 'Weiping Yan | Resume',
    metaDescriptionResume: 'Weiping Yan の履歴書と学術サマリー。',
    resumePageTitle: '正式な記録を、簡潔に。',
    resumePageLede: 'このページでは PDF の上に短い構造化サマリーを掲載しています。PDF は応募や共有のための正式な文書です。',
    resumeSummaryLabel: '履歴書サマリー',
    resumeEducationLabel: '学歴',
    resumeEducationTitle: 'TU Delft x Eindhoven University of Technology',
    resumeEducationBody: '学士課程：計算機科学、電気電子工学、応用物理（2024年9月 - 2028年6月）。',
    resumeResearchLabel: '研究方向',
    resumeResearchTitle: 'AI for Science、基盤モデル、アナログ設計',
    resumeResearchBody: '機械学習を科学的推論、工学ワークフロー、回路最適化へ接続する、技術的に根拠のある研究に焦点を当てています。',
    resumeExperienceLabel: '主な経験',
    resumeExperienceTitle: '機械学習と半導体系にまたがる研究経験',
    resumeExperiencePoint1: 'LLM for Recommendation の研究',
    resumeExperiencePoint2: 'Zhangjiang Laboratory における半導体ワークフロー研修',
    resumeExperiencePoint3: 'Python を用いた環境データ研究',
    resumeLinksLabel: 'リンク',
    resumeLinksTitle: '連絡先とファイル',
    openPdfDirectly: 'PDF を直接開く',
    pdfLabel: 'PDF',
    embeddedResumeViewer: '埋め込み履歴書ビューア',
    openOrDownloadPdf: 'PDF を開く / ダウンロード',
    resumeFrameTitle: 'Weiping Yan 履歴書 PDF',
    resumeDocumentNote: 'ブラウザで埋め込みビューアが表示されない場合は、上の PDF リンクを使用してください。',
  },
}

function normalizeLanguage(language) {
  const value = `${language || ''}`.toLowerCase()
  if (value.startsWith('zh')) return 'zh'
  if (value.startsWith('ja')) return 'ja'
  return 'en'
}

function getStoredLanguage() {
  try {
    const storedLanguage = window.localStorage.getItem(languageStorageKey)
    return storedLanguage ? normalizeLanguage(storedLanguage) : ''
  } catch {
    return ''
  }
}

function setStoredLanguage(language) {
  try {
    window.localStorage.setItem(languageStorageKey, language)
  } catch {
    // Ignore storage failures.
  }
}

function applyTranslations(language) {
  const bundle = translations[language] || translations.en
  document.documentElement.lang = language === 'zh' ? 'zh-Hant' : language

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n')
    if (!key || !(key in bundle)) return
    element.textContent = bundle[key]
  })

  document.querySelectorAll('[data-i18n-attr]').forEach((element) => {
    const spec = element.getAttribute('data-i18n-attr')
    if (!spec) return

    spec.split(';').forEach((segment) => {
      const [attribute, key] = segment.split(':').map((value) => value && value.trim())
      if (!attribute || !key || !(key in bundle)) return
      element.setAttribute(attribute, bundle[key])
    })
  })

  document.querySelectorAll('[data-lang-button]').forEach((button) => {
    const isActive = button.getAttribute('data-lang-button') === language
    button.setAttribute('aria-pressed', `${isActive}`)
  })

  setStoredLanguage(language)
  window.dispatchEvent(new Event('resize'))
  window.dispatchEvent(new Event('scroll'))
}

function initI18n() {
  const fallbackLanguage = normalizeLanguage(navigator.language || navigator.userLanguage)
  const storedLanguage = getStoredLanguage()
  const activeLanguage = supportedLanguages.includes(storedLanguage) ? storedLanguage : fallbackLanguage

  document.querySelectorAll('[data-lang-button]').forEach((button) => {
    button.addEventListener('click', () => {
      const language = button.getAttribute('data-lang-button')
      if (!language || !supportedLanguages.includes(language)) return
      applyTranslations(language)
    })
  })

  applyTranslations(activeLanguage)
}

function initReveals() {
  const revealElements = Array.from(document.querySelectorAll('[data-reveal]'))
  if (revealElements.length === 0) return

  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  }, {
    threshold: 0.16,
    rootMargin: '0px 0px -10% 0px',
  })

  revealElements.forEach((element) => observer.observe(element))
}

function initHeroPointer() {
  const hero = document.querySelector('[data-hero]')
  if (!(hero instanceof HTMLElement)) return
  if (prefersReducedMotion.matches || !window.matchMedia('(pointer: fine)').matches) return

  let rafId = 0
  let nextX = 50
  let nextY = 34

  function commit() {
    rafId = 0
    hero.style.setProperty('--hero-x', `${nextX}%`)
    hero.style.setProperty('--hero-y', `${nextY}%`)
  }

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect()
    nextX = ((event.clientX - rect.left) / rect.width) * 100
    nextY = ((event.clientY - rect.top) / rect.height) * 100
    if (rafId !== 0) return
    rafId = requestAnimationFrame(commit)
  })

  hero.addEventListener('pointerleave', () => {
    nextX = 50
    nextY = 34
    if (rafId !== 0) return
    rafId = requestAnimationFrame(commit)
  })
}

function buildSignalPath(points) {
  if (points.length === 0) return ''
  if (points.length === 1) {
    const point = points[0]
    return `M ${point.x} ${point.y}`
  }

  let path = `M ${points[0].x} ${points[0].y}`
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]
    const current = points[index]
    const midY = previous.y + (current.y - previous.y) / 2
    path += ` C ${previous.x} ${midY}, ${current.x} ${midY}, ${current.x} ${current.y}`
  }
  return path
}

function initSignalMap() {
  const shell = document.querySelector('[data-signal-shell]')
  if (!(shell instanceof HTMLElement)) return

  const svg = shell.querySelector('[data-signal-svg]')
  const track = shell.querySelector('[data-signal-track]')
  const progress = shell.querySelector('[data-signal-progress]')
  const dotsGroup = shell.querySelector('[data-signal-dots]')
  const sections = Array.from(shell.querySelectorAll('[data-story-section]'))
  const anchors = Array.from(shell.querySelectorAll('[data-signal-anchor]'))

  if (
    !(svg instanceof SVGSVGElement) ||
    !(track instanceof SVGPathElement) ||
    !(progress instanceof SVGPathElement) ||
    !(dotsGroup instanceof SVGGElement) ||
    sections.length === 0 ||
    anchors.length === 0
  ) {
    return
  }

  let rafId = 0
  let pathLength = 1

  function updateActiveSection() {
    const probe = window.innerHeight * 0.34
    let activeSection = sections[0]

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      if (rect.top <= probe) activeSection = section
    })

    sections.forEach((section) => {
      const isActive = section === activeSection
      section.classList.toggle('is-active', isActive)
      const index = sections.indexOf(section)
      const dot = dotsGroup.children[index]
      if (!(dot instanceof SVGCircleElement)) return
      dot.classList.toggle('is-active', isActive)
    })
  }

  function updateProgressStroke() {
    const rect = shell.getBoundingClientRect()
    const viewport = window.innerHeight || document.documentElement.clientHeight
    const total = rect.height + viewport * 0.28
    const progressValue = Math.min(Math.max((viewport * 0.74 - rect.top) / total, 0), 1)
    progress.style.strokeDasharray = `${pathLength}`
    progress.style.strokeDashoffset = `${pathLength * (1 - progressValue)}`
  }

  function redraw() {
    rafId = 0

    const shellRect = shell.getBoundingClientRect()
    const width = shell.clientWidth
    const height = shell.scrollHeight

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    const points = anchors.map((anchor) => {
      const rect = anchor.getBoundingClientRect()
      return {
        x: rect.left - shellRect.left + rect.width / 2,
        y: rect.top - shellRect.top + rect.height / 2,
      }
    })

    if (points.length === 0) return

    const topPoint = {
      x: points[0].x,
      y: Math.max(points[0].y - 92, 0),
    }
    const bottomPoint = {
      x: points[points.length - 1].x,
      y: Math.min(points[points.length - 1].y + 108, height),
    }
    const fullPoints = [topPoint, ...points, bottomPoint]
    const pathData = buildSignalPath(fullPoints)

    track.setAttribute('d', pathData)
    progress.setAttribute('d', pathData)

    while (dotsGroup.firstChild) {
      dotsGroup.removeChild(dotsGroup.firstChild)
    }

    points.forEach((point) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      dot.setAttribute('class', 'signal-dot')
      dot.setAttribute('cx', `${point.x}`)
      dot.setAttribute('cy', `${point.y}`)
      dot.setAttribute('r', '6.5')
      dotsGroup.appendChild(dot)
    })

    pathLength = track.getTotalLength() || 1
    shell.classList.add('signal-ready')
    updateProgressStroke()
    updateActiveSection()
  }

  function schedule() {
    if (rafId !== 0) return
    rafId = requestAnimationFrame(redraw)
  }

  window.addEventListener('resize', schedule)
  window.addEventListener('scroll', () => {
    updateProgressStroke()
    updateActiveSection()
  }, { passive: true })

  schedule()
}

function initSpirit() {
  const canUseSpirit =
    !prefersReducedMotion.matches &&
    window.matchMedia('(pointer: fine)').matches &&
    window.innerWidth > 760

  if (!canUseSpirit) return

  const spirit = document.createElement('div')
  spirit.className = 'spirit'
  spirit.setAttribute('aria-hidden', 'true')
  spirit.innerHTML = `
    <svg viewBox="0 0 44 92" role="presentation">
      <path class="spirit-tail" d="M 23 79 C 17 69, 16 57, 20 45 C 23 35, 24 25, 21 14" />
      <path class="spirit-aura" d="M 17 26 C 17 19, 21 12, 27 12 C 31 12, 34 16, 34 22 C 34 29, 29 36, 24 42 C 20 38, 17 32, 17 26 Z" />
      <path class="spirit-core" d="M 19 25 C 19 18, 23 13, 28 13 C 31 13, 33 16, 33 20 C 33 27, 28 33, 23 38 C 20 35, 19 30, 19 25 Z" />
      <path class="spirit-edge" d="M 26 14 C 29 17, 30 21, 29 27 C 28 31, 26 34, 23 37 C 24 29, 23 21, 26 14 Z" />
    </svg>
  `
  document.body.appendChild(spirit)

  let rafId = 0
  let targetX = window.innerWidth * 0.64
  let targetY = window.innerHeight * 0.24
  let currentX = targetX
  let currentY = targetY
  let lastMoveTime = performance.now()
  let isVisible = false

  function animate(now) {
    const idleFor = now - lastMoveTime
    const isIdle = idleFor > 1200
    const driftX = Math.sin(now * 0.00115) * 4 + Math.sin(now * 0.00043) * 2.6
    const driftY = Math.cos(now * 0.001) * 6.5 + Math.sin(now * 0.00058) * 1.8
    const desiredX = targetX + 24 + driftX
    const desiredY = targetY - 40 + driftY
    const easing = isIdle ? 0.034 : 0.055

    currentX += (desiredX - currentX) * easing
    currentY += (desiredY - currentY) * easing

    const angle = Math.max(-9, Math.min(9, (desiredX - currentX) * 0.1))
    const scale = isIdle ? 0.97 : 1
    spirit.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${angle}deg) scale(${scale})`

    if (isVisible || Math.abs(desiredX - currentX) > 0.2 || Math.abs(desiredY - currentY) > 0.2) {
      rafId = requestAnimationFrame(animate)
      return
    }

    rafId = 0
  }

  function schedule() {
    if (rafId !== 0) return
    rafId = requestAnimationFrame(animate)
  }

  function showSpirit() {
    if (isVisible) return
    isVisible = true
    spirit.classList.add('is-visible')
    schedule()
  }

  function hideSpirit() {
    if (!isVisible) return
    isVisible = false
    spirit.classList.remove('is-visible')
    schedule()
  }

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    targetX = event.clientX
    targetY = event.clientY
    lastMoveTime = performance.now()
    showSpirit()
  }, { passive: true })

  document.addEventListener('mouseout', (event) => {
    if (event.relatedTarget !== null) return
    hideSpirit()
  })

  window.addEventListener('blur', hideSpirit)
}

function init() {
  initI18n()
  initReveals()
  initHeroPointer()
  initSignalMap()
  initSpirit()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true })
} else {
  init()
}
