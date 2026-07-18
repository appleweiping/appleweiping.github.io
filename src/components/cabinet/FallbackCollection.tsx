import { useMemo, useState, type MouseEvent } from "react";
import { newAcquisitions, wings } from "../../data/wings";
import type { ProjectRecord } from "../../types/project";
import { getCabinetCopy } from "./copy";
import type { CabinetCapabilities, CabinetLocale } from "./types";
import { resolveCabinetWing } from "./wings";

interface FallbackCollectionProps {
  projects: ProjectRecord[];
  locale: CabinetLocale;
  capabilities: CabinetCapabilities;
  onOpenProject: (project: ProjectRecord, trigger?: HTMLElement) => void;
  onTry3d: () => void;
}

function searchableText(project: ProjectRecord, locale: CabinetLocale) {
  return [
    project.title,
    project.repository,
    project.summary[locale],
    project.sourceKind,
    project.status,
    ...project.topics,
    ...project.languages,
  ].join(" ").toLocaleLowerCase(locale === "zh" ? "zh-CN" : "en-US");
}

export default function FallbackCollection({
  projects,
  locale,
  capabilities,
  onOpenProject,
  onTry3d,
}: FallbackCollectionProps) {
  const text = getCabinetCopy(locale);
  const [query, setQuery] = useState("");
  const [wing, setWing] = useState("all");
  const normalizedQuery = query.trim().toLocaleLowerCase(locale === "zh" ? "zh-CN" : "en-US");
  const visibleProjects = useMemo(() => projects.filter((project) => {
    const projectWing = resolveCabinetWing(project.wing).id;
    return (wing === "all" || projectWing === wing)
      && (!normalizedQuery || searchableText(project, locale).includes(normalizedQuery));
  }), [locale, normalizedQuery, projects, wing]);

  const reasons = capabilities.fallbackReasons.map((reason) => {
    if (reason === "webgl") return text.fallbackWebgl;
    if (reason === "reduced-motion") return text.fallbackMotion;
    if (reason === "save-data") return text.fallbackData;
    if (reason === "context-lost") return text.fallbackContext;
    return text.fallbackPower;
  });

  function openProject(event: MouseEvent<HTMLButtonElement>, project: ProjectRecord) {
    onOpenProject(project, event.currentTarget);
  }

  return (
    <section className="cabinet-fallback" data-testid="cabinet-fallback" aria-labelledby="cabinet-fallback-title">
      <header className="cabinet-fallback__header">
        <p className="cabinet-kicker">{text.collection} · {projects.length}</p>
        <h2 id="cabinet-fallback-title">{text.fallbackTitle}</h2>
        <p>{text.fallbackBody}</p>
        {reasons.length > 0 && (
          <ul className="cabinet-reason-list" aria-label={text.interfaceStatus}>
            {reasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        )}
        {capabilities.webgl && (
          <button className="cabinet-button cabinet-button--light" type="button" onClick={onTry3d}>
            {text.try3d}
          </button>
        )}
      </header>

      <div className="cabinet-fallback__filters" role="search">
        <label>
          <span>{text.searchLabel}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder={text.searchPlaceholder}
          />
        </label>
        <label>
          <span>{text.filterGallery}</span>
          <select value={wing} onChange={(event) => setWing(event.currentTarget.value)}>
            <option value="all">{text.allGalleries}</option>
            {wings.map((item) => (
              <option key={item.id} value={item.id}>{locale === "en" ? item.en : item.zh}</option>
            ))}
            <option value={newAcquisitions.id}>
              {locale === "en" ? `Central lobby · ${newAcquisitions.en}` : `中央前厅 · ${newAcquisitions.zh}`}
            </option>
          </select>
        </label>
      </div>

      <p className="cabinet-result-count" aria-live="polite">
        <strong>{visibleProjects.length}</strong> {text.exhibits}
      </p>

      {visibleProjects.length > 0 ? (
        <div className="cabinet-fallback__grid">
          {visibleProjects.map((project, index) => {
            const projectWing = resolveCabinetWing(project.wing);
            return (
              <article className="cabinet-record" data-fallback-project={project.slug} key={project.repoId}>
                <div className="cabinet-record__number" aria-hidden="true">
                  {String(index + 1).padStart(3, "0")}
                </div>
                <p className="cabinet-record__meta">
                  {locale === "en" ? projectWing.en : projectWing.zh} · {project.sourceKind}
                </p>
                <h3>{project.title}</h3>
                <p>{project.summary[locale]}</p>
                <button
                  className="cabinet-text-button"
                  type="button"
                  data-project-trigger={project.slug}
                  onClick={(event) => openProject(event, project)}
                >
                  {text.openExhibit}<span aria-hidden="true"> ↗</span>
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="cabinet-empty">{text.noCollectionResults}</p>
      )}
    </section>
  );
}
