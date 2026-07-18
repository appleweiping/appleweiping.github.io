import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { isAllowedEmbedUrl, type ProjectRecord } from "../../types/project";
import { getCabinetCopy } from "./copy";
import type { CabinetLocale } from "./types";
import { resolveCabinetWing } from "./wings";

interface ProjectDialogProps {
  project: ProjectRecord;
  locale: CabinetLocale;
  onClose: () => void;
}

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "iframe",
  "video[controls]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function ProjectDemo({ project, locale }: { project: ProjectRecord; locale: CabinetLocale }) {
  const text = getCabinetCopy(locale);
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const { demo } = project;

  if (demo.kind === "embed") {
    if (!demo.url || !demo.embedAllowed || !isAllowedEmbedUrl(demo.url)) {
      return <p className="cabinet-demo-note">{text.demoUnavailable}</p>;
    }
    return (
      <div className="cabinet-demo-block">
        <p>{text.demoEmbedIntro}</p>
        {!embedLoaded ? (
          <button className="cabinet-button" type="button" onClick={() => setEmbedLoaded(true)}>
            {text.loadDemo}
          </button>
        ) : (
          <div className="cabinet-demo-frame">
            <iframe
              src={demo.url}
              title={`${project.title} — ${text.demo}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-downloads allow-forms allow-popups allow-scripts"
            />
          </div>
        )}
        <a className="cabinet-inline-link" href={demo.url} target="_blank" rel="noreferrer">
          {text.openDemo}<span aria-hidden="true"> ↗</span>
        </a>
      </div>
    );
  }

  if (demo.kind === "external") {
    return demo.url ? (
      <div className="cabinet-demo-block">
        <p>{text.demoExternal}</p>
        <a className="cabinet-button" href={demo.url} target="_blank" rel="noreferrer">
          {text.openDemo}<span aria-hidden="true"> ↗</span>
        </a>
      </div>
    ) : <p className="cabinet-demo-note">{text.demoUnavailable}</p>;
  }

  if (demo.kind === "media") {
    if (project.media.length === 0) return <p className="cabinet-demo-note">{text.demoUnavailable}</p>;
    return (
      <div className="cabinet-media-grid" aria-label={text.demoMedia}>
        {project.media.map((item, index) => {
          const key = `${item.src}-${index}`;
          if (["image", "screenshot", "photo"].includes(item.kind)) {
            return (
              <figure key={key}>
                <img src={item.src} alt={`${project.title} — ${text.demoMedia} ${index + 1}`} loading="lazy" referrerPolicy="no-referrer" />
                {item.attribution && <figcaption>{item.attribution}</figcaption>}
              </figure>
            );
          }
          if (["video", "recording", "screen-recording"].includes(item.kind)) {
            return (
              <figure key={key}>
                <video src={item.src} controls preload="metadata" aria-label={`${project.title} — ${text.demoMedia} ${index + 1}`} />
                {item.attribution && <figcaption>{item.attribution}</figcaption>}
              </figure>
            );
          }
          return (
            <a key={key} className="cabinet-inline-link" href={item.src} target="_blank" rel="noreferrer">
              {text.demoMedia} {index + 1}<span aria-hidden="true"> ↗</span>
            </a>
          );
        })}
      </div>
    );
  }

  return <p className="cabinet-demo-note">{text.demoNone}</p>;
}

export default function ProjectDialog({ project, locale, onClose }: ProjectDialogProps) {
  const text = getCabinetCopy(locale);
  const titleId = useId();
  const summaryId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const projectWing = resolveCabinetWing(project.wing);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const closeButton = dialog.querySelector<HTMLButtonElement>("[data-dialog-close]");
    closeButton?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialog?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])
        .filter((element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true");
      if (focusable.length === 0) {
        event.preventDefault();
        dialog?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [onClose, project.slug]);

  const dialog = (
    <div className="cabinet-dialog-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <div
        ref={dialogRef}
        className="cabinet-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={summaryId}
        tabIndex={-1}
      >
        <div className="cabinet-dialog__header">
          <div>
            <p className="cabinet-kicker">
              {text.details} · {locale === "en" ? projectWing.en : projectWing.zh}
            </p>
            <h2 id={titleId}>{project.title}</h2>
          </div>
          <button className="cabinet-close" type="button" data-dialog-close onClick={onClose}>
            <span>{text.close}</span><span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="cabinet-dialog__body">
          <section className="cabinet-dialog__intro">
            <p id={summaryId}>{project.summary[locale]}</p>
            <dl className="cabinet-facts">
              <div><dt>{text.recordType}</dt><dd>{project.sourceKind}</dd></div>
              <div><dt>{text.status}</dt><dd>{project.status}</dd></div>
              <div><dt>{text.updated}</dt><dd>{project.updatedAt.slice(0, 10)}</dd></div>
              <div><dt>{text.demo}</dt><dd>{project.demo.kind}</dd></div>
            </dl>
            {project.contribution && (
              <div className="cabinet-contribution">
                <h3>{text.contribution}</h3>
                <p>{project.contribution[locale]}</p>
              </div>
            )}
            <div className="cabinet-chip-row" aria-label={locale === "en" ? "Topics and technologies" : "主题与技术"}>
              {[...project.languages, ...project.topics].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
            </div>
            {project.curationStatus === "metadata-only" && <p className="cabinet-pending">{text.pending}</p>}
            <a className="cabinet-button" href={`https://github.com/${project.repository}`} target="_blank" rel="noreferrer">
              {text.repository}<span aria-hidden="true"> ↗</span>
            </a>
          </section>
          <section className="cabinet-dialog__demo" aria-labelledby={`${titleId}-demo`}>
            <h3 id={`${titleId}-demo`}>{text.demo}</h3>
            <ProjectDemo key={project.slug} project={project} locale={locale} />
          </section>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
