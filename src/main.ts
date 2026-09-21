import { createGlobe, distanceKm, type Globe } from "./globe/globe";
import { toys } from "./data/toys";
import { source } from "./data/sources";
import { validateToys } from "./data/validate";
import type { Confidence, Stage, Toy } from "./data/types";
import "./style.css";

/**
 * Track a Toy. Pick a toy, then walk its journey one stop at a time while the
 * globe turns to each place and draws the route behind you.
 */

const problems = validateToys();
if (problems.length) {
  // Failing loudly beats shipping a page that quietly claims too much.
  console.error("Toy data failed validation:\n" + problems.join("\n"));
}

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("Track a Toy needs an #app element.");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  measured: "Measured",
  company: "Said by the maker",
  typical: "Usually true",
};
const CONFIDENCE_TITLE: Record<Confidence, string> = {
  measured: "A number from a named dataset. The source is listed below.",
  company: "Stated publicly by the company that makes it.",
  typical: "How this kind of toy is usually made. Not a claim about your one.",
};

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// ------------------------------------------------------------------ layout
const page = el("div", "page");
const header = el("header", "masthead");
const title = el("h1", "masthead__title", "Track a Toy");
const blurb = el(
  "p",
  "masthead__blurb",
  "Pick a toy and follow it backwards, all the way to the ground it came out of.",
);
header.append(title, blurb);

const picker = el("nav", "picker");
picker.setAttribute("aria-label", "Choose a toy");

const main = el("main", "layout");
const stageEl = el("div", "stage");
const panel = el("div", "panel");
main.append(stageEl, panel);

const footer = el("footer", "colophon");
page.append(header, picker, main, footer);
root.append(page);

// ------------------------------------------------------------------- panel
const toyName = el("h2", "panel__toy");
const toyIdea = el("p", "panel__idea");
const madeOf = el("ul", "panel__madeof");
const progress = el("ol", "panel__steps");
progress.setAttribute("aria-label", "Steps in the journey");

const card = el("article", "card");
card.setAttribute("aria-live", "polite");
const cardStep = el("p", "card__step");
const cardTitle = el("h3", "card__title");
const cardPlace = el("p", "card__place");
const cardWhat = el("p", "card__what");
const cardHook = el("p", "card__hook");
const cardFacts = el("ul", "card__facts");
const cardSources = el("details", "card__sources");
card.append(
  cardStep,
  cardTitle,
  cardPlace,
  cardWhat,
  cardHook,
  cardFacts,
  cardSources,
);

const controls = el("div", "controls");
const prev = el("button", "controls__button", "Back");
prev.type = "button";
const next = el(
  "button",
  "controls__button controls__button--next",
  "Next stop",
);
next.type = "button";
const distance = el("p", "controls__distance");
controls.append(prev, next);

panel.append(toyName, toyIdea, madeOf, progress, card, controls, distance);

// ------------------------------------------------------------------- state
let current: Toy = toys[0];
let index = 0;
let globe: Globe | null = null;

function renderPicker(): void {
  picker.replaceChildren();
  for (const item of toys) {
    const button = el("button", "picker__toy");
    button.type = "button";
    button.dataset.toy = item.id;
    button.append(
      el("span", "picker__symbol", item.symbol),
      el("span", "picker__name", item.name),
    );
    button.addEventListener("click", () => selectToy(item.id));
    picker.append(button);
  }
}

function renderSteps(): void {
  progress.replaceChildren();
  current.stages.forEach((stage, i) => {
    const item = el("li");
    const button = el("button", "panel__step");
    button.type = "button";
    button.textContent = String(i + 1);
    button.title = stage.title;
    button.setAttribute("aria-label", `Stop ${i + 1}: ${stage.title}`);
    button.addEventListener("click", () => goTo(i));
    item.append(button);
    progress.append(item);
  });
}

function renderStage(): void {
  const stage: Stage = current.stages[index];
  cardStep.textContent = `Stop ${index + 1} of ${current.stages.length}`;
  cardTitle.textContent = stage.title;
  cardPlace.textContent = `${stage.place.name}, ${stage.place.country}`;
  cardWhat.textContent = stage.what;
  cardHook.textContent = stage.hook;

  cardFacts.replaceChildren();
  for (const fact of stage.facts) {
    const item = el("li", "fact");
    const badge = el("span", `fact__badge fact__badge--${fact.confidence}`);
    badge.textContent = CONFIDENCE_LABEL[fact.confidence];
    badge.title = CONFIDENCE_TITLE[fact.confidence];
    item.append(badge, el("span", "fact__text", fact.text));
    cardFacts.append(item);
  }

  const used = [...new Set(stage.facts.flatMap((f) => f.sourceIds))]
    .map(source)
    .filter(Boolean);
  cardSources.replaceChildren();
  cardSources.hidden = used.length === 0;
  if (used.length) {
    cardSources.append(
      el("summary", undefined, "Where these numbers come from"),
    );
    const list = el("ul", "card__sourcelist");
    for (const s of used) {
      const item = el("li");
      const link = el("a");
      link.href = s!.url;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      link.textContent = s!.title;
      item.append(link, el("span", "card__publisher", ` ${s!.publisher}`));
      list.append(item);
    }
    cardSources.append(list);
  }

  [...progress.querySelectorAll<HTMLButtonElement>(".panel__step")].forEach(
    (button, i) => {
      button.setAttribute("aria-current", String(i === index));
      button.classList.toggle("is-done", i < index);
    },
  );

  prev.disabled = index === 0;
  next.disabled = index === current.stages.length - 1;
  next.textContent =
    index === current.stages.length - 1 ? "Journey complete" : "Next stop";

  const travelled = current.stages
    .slice(0, index)
    .reduce(
      (sum, stage, i) =>
        sum + distanceKm(stage.place, current.stages[i + 1].place),
      0,
    );
  distance.textContent =
    index === 0
      ? "The journey starts here."
      : `So far this toy has travelled about ${Math.round(travelled).toLocaleString()} km.`;

  globe?.focusStage(index);
}

function goTo(to: number): void {
  index = Math.max(0, Math.min(current.stages.length - 1, to));
  renderStage();
}

function selectToy(id: string): void {
  const found = toys.find((t) => t.id === id);
  if (!found) return;
  current = found;
  index = 0;
  toyName.textContent = current.name;
  toyIdea.textContent = current.bigIdea;
  madeOf.replaceChildren();
  for (const material of current.madeOf)
    madeOf.append(el("li", "panel__material", material));
  [...picker.querySelectorAll<HTMLButtonElement>(".picker__toy")].forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.toy === id)),
  );
  renderSteps();
  globe?.setRoute(current.stages);
  renderStage();
}

prev.addEventListener("click", () => goTo(index - 1));
next.addEventListener("click", () => goTo(index + 1));
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") goTo(index + 1);
  if (event.key === "ArrowLeft") goTo(index - 1);
});

footer.append(
  el(
    "p",
    "colophon__note",
    "Every journey here is a typical one for that kind of toy, not a record of any single toy. Each fact says whether it is measured, stated by the maker, or just how these things are usually made.",
  ),
);

renderPicker();

createGlobe({
  container: stageEl,
  reducedMotion,
  onPickStage: goTo,
}).then((made) => {
  globe = made;
  globe.setRoute(current.stages);
  globe.focusStage(index);
  // A hook so a test can read the state without scraping the DOM.
  window.trackAToy = {
    toyId: () => current.id,
    stageIndex: () => index,
    stageCount: () => current.stages.length,
    routeKm: () => globe?.routeKm() ?? 0,
    problems,
  };
});

selectToy(toys[0].id);

declare global {
  interface Window {
    trackAToy?: {
      toyId: () => string;
      stageIndex: () => number;
      stageCount: () => number;
      routeKm: () => number;
      problems: string[];
    };
  }
}
