import { z } from "zod";

export const demoKindSchema = z.enum(["embed", "external", "media", "none"]);
export const sourceKindSchema = z.enum([
  "original",
  "research",
  "coursework",
  "reproduction",
  "fork",
  "experiment",
  "meta",
]);

export const wingIdSchema = z.enum([
  "ai-agents",
  "ai4s-research",
  "models-data",
  "systems-security",
  "robotics-hardware",
  "creative-computing",
  "products-tools",
  "coursework-notes",
  "new-acquisitions",
]);

const httpsUrlSchema = z.url({ protocol: /^https$/ });
const verifiedAtSchema = z.union([z.iso.date(), z.iso.datetime()]);
export const allowedEmbedOrigins = [
  "https://www.youtube-nocookie.com",
  "https://player.vimeo.com",
  "https://codesandbox.io",
  "https://stackblitz.com",
] as const;

export function isAllowedEmbedUrl(value: string): boolean {
  try {
    return (allowedEmbedOrigins as readonly string[]).includes(new URL(value).origin);
  } catch {
    return false;
  }
}

function isSafeMediaSource(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("..")) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

const demoSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("embed"),
    url: httpsUrlSchema.refine(isAllowedEmbedUrl, "Embed URL origin is not on the reviewed allowlist."),
    embedAllowed: z.literal(true),
    verifiedAt: verifiedAtSchema.optional(),
  }),
  z.object({ kind: z.literal("external"), url: httpsUrlSchema, embedAllowed: z.literal(false), verifiedAt: verifiedAtSchema.optional() }),
  z.object({ kind: z.literal("media"), url: httpsUrlSchema.optional(), embedAllowed: z.literal(false), verifiedAt: verifiedAtSchema.optional() }),
  z.object({ kind: z.literal("none"), url: z.never().optional(), embedAllowed: z.literal(false), verifiedAt: z.never().optional() }),
]);

export const projectRecordSchema = z.object({
  repoId: z.number().int().positive(),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  repository: z.string().regex(/^appleweiping\/[A-Za-z0-9_.-]+$/),
  title: z.string().min(1),
  summary: z.object({ en: z.string().min(1), zh: z.string().min(1) }),
  sourceKind: sourceKindSchema,
  wing: wingIdSchema,
  topics: z.array(z.string()),
  languages: z.array(z.string()),
  status: z.string().min(1),
  contribution: z.object({ en: z.string(), zh: z.string() }).optional(),
  media: z.array(z.object({
    kind: z.enum(["image", "screenshot", "photo", "video", "recording", "screen-recording", "notebook", "document", "hardware"]),
    src: z.string().min(1).refine(isSafeMediaSource, "Media sources must be reviewed HTTPS URLs or root-relative public assets."),
    attribution: z.string().optional(),
  })),
  demo: demoSchema,
  curationStatus: z.enum(["curated", "metadata-only"]),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
}).superRefine((project, context) => {
  if (project.demo.kind === "media" && project.media.length === 0) {
    context.addIssue({ code: "custom", path: ["media"], message: "Media demos require at least one media record." });
  }
});

export type DemoKind = z.infer<typeof demoKindSchema>;
export type SourceKind = z.infer<typeof sourceKindSchema>;
export type WingId = z.infer<typeof wingIdSchema>;
export type ProjectRecord = z.infer<typeof projectRecordSchema>;

export const projectSnapshotSchema = z.object({
  owner: z.literal("appleweiping"),
  expectedPublicCount: z.number().int().nonnegative(),
  syncedAt: z.string(),
  projects: z.array(projectRecordSchema),
});

export type ProjectSnapshot = z.infer<typeof projectSnapshotSchema>;
