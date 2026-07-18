export type Locale = "en" | "zh";

export type LocalizedText = Record<Locale, string>;

export interface TimelineItem {
  id: string;
  kind: "research" | "teaching" | "entrepreneurship" | "education";
  organization: string;
  role: LocalizedText;
  dates: LocalizedText;
  location?: LocalizedText;
  summary: LocalizedText;
  details?: LocalizedText[];
}

export interface EducationItem {
  id: string;
  institution: string;
  program: LocalizedText;
  dates: LocalizedText;
  note?: LocalizedText;
}

export interface ResearchDirection {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
}
