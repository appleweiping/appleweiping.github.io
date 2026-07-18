import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { newAcquisitions, wings } from "../../data/wings";
import type { ProjectRecord } from "../../types/project";
import "../../styles/cabinet.css";
import { getCabinetCopy } from "./copy";
import FallbackCollection from "./FallbackCollection";
import ProjectDialog from "./ProjectDialog";
import { useCabinetStore } from "./store";
import type { CabinetAppProps, CabinetPhase, CabinetView } from "./types";
import { useCabinetCapabilities } from "./useCabinetCapabilities";
import { resolveCabinetWing } from "./wings";

const MuseumCanvas = lazy(() => import("./MuseumCanvas"));

function projectSearchText(project: ProjectRecord, locale: "en" | "zh") {
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

function setProjectQuery(slug?: string) {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set("project", slug);
  else url.searchParams.delete("project");
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

export default function CabinetApp({ projects, locale = "en" }: CabinetAppProps) {
  const text = getCabinetCopy(locale);
  const { capabilities, detected, setCapabilities } = useCabinetCapabilities();
  const [view, setView] = useState<CabinetView>("detecting");
  const phase = useCabinetStore((state) => state.phase);
  const activeWing = useCabinetStore((state) => state.activeWing);
  const selectedSlug = useCabinetStore((state) => state.selectedSlug);
  const setPhase = useCabinetStore((state) => state.setPhase);
  const setActiveWing = useCabinetStore((state) => state.setActiveWing);
  const setSelectedSlug = useCabinetStore((state) => state.setSelectedSlug);
  const [searchQuery, setSearchQuery] = useState("");
  const [pointerLocked, setPointerLocked] = useState(false);
  const shellRef = useRef<HTMLElement>(null);
  const interfaceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const previousPhaseRef = useRef<Exclude<CabinetPhase, "loading" | "project-modal">>("lobby");

  const currentProjects = useMemo(() => projects.filter((project) => resolveCabinetWing(project.wing).id === activeWing), [activeWing, projects]);
  const acquisitionProjects = useMemo(() => projects.filter((project) => project.wing === newAcquisitions.id), [projects]);
  const selectedProject = useMemo(() => projects.find((project) => project.slug === selectedSlug), [projects, selectedSlug]);
  const currentWing = resolveCabinetWing(activeWing);
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase(locale === "zh" ? "zh-CN" : "en-US");
  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return projects.filter((project) => projectSearchText(project, locale).includes(normalizedQuery)).slice(0, 10);
  }, [locale, normalizedQuery, projects]);

  const findProjectTrigger = useCallback((project: ProjectRecord) => {
    const triggers = shellRef.current?.querySelectorAll<HTMLElement>("[data-project-trigger]") ?? [];
    return Array.from(triggers).find((element) => element.dataset.projectTrigger === project.slug) ?? null;
  }, []);

  const openProject = useCallback((project: ProjectRecord, trigger?: HTMLElement, updateQuery = true) => {
    if (document.pointerLockElement) void document.exitPointerLock();
    document.body.style.cursor = "";
    const normalizedWing = resolveCabinetWing(project.wing).id;
    restoreFocusRef.current = trigger ?? findProjectTrigger(project);
    // New acquisitions live in the central lobby rather than a ninth gallery.
    if (normalizedWing !== newAcquisitions.id) setActiveWing(normalizedWing);
    setSelectedSlug(project.slug);
    setSearchQuery("");
    setPhase((currentPhase) => {
      if (currentPhase !== "loading" && currentPhase !== "project-modal") previousPhaseRef.current = currentPhase;
      return "project-modal";
    });
    if (updateQuery) setProjectQuery(project.slug);
  }, [findProjectTrigger, setActiveWing, setPhase, setSelectedSlug]);

  const closeProject = useCallback((updateQuery = true) => {
    const closingSlug = selectedSlug;
    const preferredTarget = restoreFocusRef.current;
    setSelectedSlug(null);
    setPhase(previousPhaseRef.current);
    if (updateQuery) setProjectQuery();
    window.setTimeout(() => {
      if (preferredTarget?.isConnected) {
        preferredTarget.focus();
        return;
      }
      const triggers = shellRef.current?.querySelectorAll<HTMLElement>("[data-project-trigger]") ?? [];
      const replacement = Array.from(triggers).find((element) => element.dataset.projectTrigger === closingSlug);
      (replacement ?? shellRef.current)?.focus();
    }, 0);
  }, [selectedSlug, setPhase, setSelectedSlug]);

  useEffect(() => {
    if (!detected) return;
    const shouldFallback = capabilities.fallbackReasons.length > 0;
    setView(shouldFallback ? "two" : "three");
    setPhase("lobby");

    const deepLinkedSlug = new URLSearchParams(window.location.search).get("project");
    const deepLinkedProject = projects.find((project) => project.slug === deepLinkedSlug);
    if (deepLinkedProject) {
      previousPhaseRef.current = shouldFallback ? "lobby" : "guided";
      openProject(deepLinkedProject, undefined, false);
    }
  }, [capabilities.fallbackReasons.length, detected, openProject, projects, setPhase]);

  useEffect(() => {
    function handlePopState() {
      const slug = new URLSearchParams(window.location.search).get("project");
      const project = projects.find((item) => item.slug === slug);
      if (project) openProject(project, undefined, false);
      else if (selectedSlug) closeProject(false);
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [closeProject, openProject, projects, selectedSlug]);

  useEffect(() => {
    const interfaceElement = interfaceRef.current;
    if (interfaceElement) interfaceElement.inert = phase === "project-modal";
    return () => {
      if (interfaceElement) interfaceElement.inert = false;
    };
  }, [phase]);

  useEffect(() => {
    function pointerLockChange() {
      const canvas = stageRef.current?.querySelector("canvas");
      const locked = document.pointerLockElement === canvas;
      setPointerLocked(locked);
      if (!locked) {
        setPhase((currentPhase) => currentPhase === "free" ? "guided" : currentPhase);
      }
    }
    document.addEventListener("pointerlockchange", pointerLockChange);
    function pointerLockError() {
      setPointerLocked(false);
      setPhase((currentPhase) => currentPhase === "free" ? "guided" : currentPhase);
    }
    document.addEventListener("pointerlockerror", pointerLockError);
    return () => {
      document.removeEventListener("pointerlockchange", pointerLockChange);
      document.removeEventListener("pointerlockerror", pointerLockError);
    };
  }, [setPhase]);

  function beginGuidedTour() {
    previousPhaseRef.current = "guided";
    setPhase("guided");
  }

  function beginFreeMode() {
    if (capabilities.mobile) return;
    previousPhaseRef.current = "free";
    setPhase("free");
    const canvas = stageRef.current?.querySelector("canvas");
    void canvas?.requestPointerLock();
  }

  function returnToGuided() {
    if (document.pointerLockElement) void document.exitPointerLock();
    previousPhaseRef.current = "guided";
    setPhase("guided");
  }

  function useTwoDimensionalCollection() {
    if (document.pointerLockElement) void document.exitPointerLock();
    setView("two");
    setPhase("lobby");
  }

  function tryThreeDimensionalCollection() {
    if (!capabilities.webgl) return;
    setView("three");
    setPhase("guided");
    previousPhaseRef.current = "guided";
  }

  function handleContextLost() {
    if (document.pointerLockElement) void document.exitPointerLock();
    setCapabilities((current) => ({
      ...current,
      webgl: false,
      fallbackReasons: [...new Set([...current.fallbackReasons, "context-lost" as const])],
    }));
    setView("two");
    setPhase("lobby");
  }

  function switchWing(nextWing: string) {
    if (document.pointerLockElement) void document.exitPointerLock();
    setActiveWing(resolveCabinetWing(nextWing).id);
    if (phase === "lobby") return;
    setPhase("guided");
    previousPhaseRef.current = "guided";
  }

  function openFromButton(event: MouseEvent<HTMLButtonElement>, project: ProjectRecord) {
    openProject(project, event.currentTarget);
  }

  const statusMessage = phase === "loading"
    ? text.loading
    : `${locale === "en" ? currentWing.en : currentWing.zh}, ${phase === "free" ? text.free : text.guided}, ${currentProjects.length} ${text.exhibits}`;

  return (
    <section ref={shellRef} className={`cabinet-app cabinet-app--${view}`} data-testid="cabinet-app" aria-label={text.title} tabIndex={-1}>
      <div ref={interfaceRef} className="cabinet-interface">
        <header className="cabinet-toolbar">
          <div className="cabinet-brand">
            <span className="cabinet-brand__seal" aria-hidden="true">格</span>
            <div>
              <strong>{text.title}</strong>
              <span>{text.subtitle}</span>
            </div>
          </div>

          <div className="cabinet-search">
            <label htmlFor="cabinet-project-search">{text.searchLabel}</label>
            <input
              id="cabinet-project-search"
              type="search"
              autoComplete="off"
              value={searchQuery}
              placeholder={text.searchPlaceholder}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
            />
            {normalizedQuery && (
              <div id="cabinet-search-results" className="cabinet-search-results">
                <p>{text.searchResults}</p>
                {searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((project) => (
                      <li key={project.repoId}>
                        <button type="button" onClick={(event) => openFromButton(event, project)}>
                          <span>{project.title}</span>
                          <small>{locale === "en" ? resolveCabinetWing(project.wing).en : resolveCabinetWing(project.wing).zh}</small>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : <p>{text.noSearchResults}</p>}
              </div>
            )}
          </div>

          <label className="cabinet-wing-select">
            <span>{text.galleries}</span>
            <select value={activeWing} onChange={(event) => switchWing(event.currentTarget.value)}>
              {wings.map((wing) => (
                <option key={wing.id} value={wing.id}>{locale === "en" ? wing.en : wing.zh}</option>
              ))}
            </select>
          </label>

          <p className="cabinet-total"><span>{projects.length}</span> {text.collection}</p>
        </header>

        <p className="cabinet-sr-only" role="status" aria-live="polite">{statusMessage}</p>

        {view === "detecting" && (
          <div className="cabinet-loading" role="status">
            <span className="cabinet-loading__seal" aria-hidden="true">研</span>
            <p>{text.loading}</p>
          </div>
        )}

        {view === "two" && (
          <FallbackCollection
            projects={projects}
            locale={locale}
            capabilities={capabilities}
            onOpenProject={openProject}
            onTry3d={tryThreeDimensionalCollection}
          />
        )}

        {view === "three" && (
          <div className="cabinet-experience">
            <div ref={stageRef} className="cabinet-stage" role="region" aria-label={locale === "en" ? "Three-dimensional gallery controls" : "三维展厅控制区"}>
              <div className="cabinet-canvas" aria-hidden="true">
                <Suspense fallback={<div className="cabinet-scene-loading"><span />{text.loading}</div>}>
                  <MuseumCanvas
                    projects={currentProjects}
                    wingId={activeWing}
                    phase={phase}
                    mobile={capabilities.mobile}
                    lowQuality={capabilities.mobile || capabilities.lowPower}
                    onSelectProject={(project) => openProject(project)}
                    onContextLost={handleContextLost}
                  />
                </Suspense>
              </div>

              <nav className="cabinet-wing-map" aria-label={text.galleryMap}>
                {wings.map((wing, index) => (
                  <button
                    key={wing.id}
                    type="button"
                    aria-label={locale === "en" ? wing.en : wing.zh}
                    aria-current={activeWing === wing.id ? "true" : undefined}
                    title={locale === "en" ? wing.en : wing.zh}
                    onClick={() => switchWing(wing.id)}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                ))}
              </nav>

              {phase === "lobby" && (
                <div className="cabinet-lobby">
                  <p className="cabinet-kicker">{text.lobbyEyebrow}</p>
                  <h2>{text.lobbyTitle}</h2>
                  <p>{text.lobbyBody}</p>
                  <button className="cabinet-button" type="button" onClick={beginGuidedTour}>{text.startTour}</button>
                  <section className="cabinet-acquisitions" aria-labelledby="cabinet-acquisitions-title">
                    <h3 id="cabinet-acquisitions-title">{text.newAcquisitions}</h3>
                    {acquisitionProjects.length > 0 ? (
                      <ol>
                        {acquisitionProjects.map((project) => (
                          <li key={project.repoId}>
                            <button type="button" data-project-trigger={project.slug} onClick={(event) => openFromButton(event, project)}>
                              {project.title}
                            </button>
                          </li>
                        ))}
                      </ol>
                    ) : <p>{text.noNewAcquisitions}</p>}
                  </section>
                </div>
              )}

              {phase !== "lobby" && phase !== "loading" && (
                <div className="cabinet-mode-controls" aria-label={text.interfaceStatus}>
                  <span className="cabinet-mode-badge">{phase === "free" ? text.free : text.guided}</span>
                  {!capabilities.mobile && phase !== "free" && (
                    <button type="button" onClick={beginFreeMode}>{text.enterFree}</button>
                  )}
                  {phase === "free" && (
                    <button type="button" onClick={returnToGuided}>{text.returnGuided}</button>
                  )}
                  <button type="button" onClick={useTwoDimensionalCollection}>{text.view2d}</button>
                </div>
              )}

              <p className="cabinet-control-hint">
                {capabilities.mobile ? text.mobileHint : phase === "free" && pointerLocked ? text.pointerHint : ""}
              </p>
            </div>

            <aside className="cabinet-catalogue" aria-labelledby="cabinet-catalogue-title">
              <header>
                <p className="cabinet-kicker">{text.currentGallery}</p>
                <h2 id="cabinet-catalogue-title">{locale === "en" ? currentWing.en : currentWing.zh}</h2>
                <span>{currentProjects.length} {text.exhibits}</span>
              </header>
              <ol>
                {currentProjects.map((project, index) => (
                  <li key={project.repoId}>
                    <button
                      type="button"
                      data-project-trigger={project.slug}
                      onClick={(event) => openFromButton(event, project)}
                    >
                      <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      <strong>{project.title}</strong>
                      <small>{project.sourceKind}</small>
                    </button>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        )}
      </div>

      {phase === "project-modal" && selectedProject && (
        <ProjectDialog project={selectedProject} locale={locale} onClose={closeProject} />
      )}
    </section>
  );
}

export type { CabinetAppProps, CabinetCapabilities, CabinetLocale, CabinetPhase } from "./types";
