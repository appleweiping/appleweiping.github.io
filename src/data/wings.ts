export const wings = [
  { id: "ai-agents", en: "AI & Agent Systems", zh: "人工智能与智能体", accent: "#315b4d" },
  { id: "ai4s-research", en: "AI for Science & Research", zh: "科学智能与研究", accent: "#476b78" },
  { id: "models-data", en: "Recommenders, Models & Data", zh: "推荐、模型与数据", accent: "#6c5575" },
  { id: "systems-security", en: "Systems, Security & Infrastructure", zh: "系统、安全与基础设施", accent: "#5d6254" },
  { id: "robotics-hardware", en: "Robotics, Embedded & Hardware", zh: "机器人、嵌入式与硬件", accent: "#8a603f" },
  { id: "creative-computing", en: "Graphics, Games & Creative Computing", zh: "图形、游戏与创意计算", accent: "#8a4236" },
  { id: "products-tools", en: "Products & Developer Tools", zh: "产品与开发工具", accent: "#866f3d" },
  { id: "coursework-notes", en: "Coursework, Reproductions & Notes", zh: "课程、复现与笔记", accent: "#655f53" },
] as const;

export const newAcquisitions = {
  id: "new-acquisitions",
  en: "New Acquisitions",
  zh: "新近入藏",
  accent: "#765426",
} as const;

export type WingId = (typeof wings)[number]["id"];

export function getWing(id: string) {
  return wings.find((wing) => wing.id === id) ?? newAcquisitions;
}
