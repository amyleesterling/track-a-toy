import { sourceIds } from "./sources";
import { toys } from "./toys";
import type { Toy } from "./types";

/**
 * The guard that keeps this project honest. A claim marked "measured" with no
 * source behind it is the exact failure this project must not ship, so it is a
 * build error rather than a review note.
 */
export function validateToys(list: Toy[] = toys): string[] {
  const errors: string[] = [];
  const seenToyIds = new Set<string>();
  const seenStageIds = new Set<string>();

  for (const item of list) {
    if (seenToyIds.has(item.id)) errors.push(`${item.id}: duplicate toy ID`);
    seenToyIds.add(item.id);
    if (!item.name || !item.tagline || !item.bigIdea)
      errors.push(`${item.id}: missing name, tagline or big idea`);
    if (item.madeOf.length === 0)
      errors.push(`${item.id}: does not say what it is made of`);
    if (item.stages.length < 3)
      errors.push(`${item.id}: a journey needs at least three stages`);

    const kinds = item.stages.map((stage) => stage.kind);
    if (!kinds.includes("play"))
      errors.push(`${item.id}: no stage where a child actually plays with it`);

    for (const stage of item.stages) {
      const where = `${item.id}/${stage.id}`;
      if (seenStageIds.has(stage.id))
        errors.push(`${where}: duplicate stage ID`);
      seenStageIds.add(stage.id);
      if (!stage.title || !stage.what || !stage.hook)
        errors.push(`${where}: missing title, description or hook`);
      const { lat, lon } = stage.place;
      if (!Number.isFinite(lat) || lat < -90 || lat > 90)
        errors.push(`${where}: latitude ${lat} is not on Earth`);
      if (!Number.isFinite(lon) || lon < -180 || lon > 180)
        errors.push(`${where}: longitude ${lon} is not on Earth`);
      if (!stage.place.name || !stage.place.country)
        errors.push(`${where}: place is missing a name or a country`);
      if (stage.place.country === "Space" && !stage.place.offEarth)
        errors.push(
          `${where}: a place in space must be marked offEarth, or it gets drawn at 0, 0`,
        );

      for (const fact of stage.facts) {
        if (!fact.text) errors.push(`${where}: empty fact`);
        // This is the rule the whole project rests on.
        if (fact.confidence !== "typical" && fact.sourceIds.length === 0)
          errors.push(
            `${where}: "${fact.text.slice(0, 40)}..." is marked ${fact.confidence} but cites nothing`,
          );
        for (const id of fact.sourceIds)
          if (!sourceIds.has(id))
            errors.push(`${where}: cites unknown source "${id}"`);
      }
    }
  }
  return errors;
}

/** Every distinct place across every journey, for drawing the globe. */
export function allPlaces(list: Toy[] = toys) {
  const seen = new Map<
    string,
    { name: string; country: string; lat: number; lon: number }
  >();
  for (const item of list)
    for (const stage of item.stages)
      seen.set(`${stage.place.lat},${stage.place.lon}`, stage.place);
  return [...seen.values()];
}
