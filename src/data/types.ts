/**
 * The shape of a toy's journey.
 *
 * The honesty rule for this whole project: we never claim to know where one
 * particular toy in one particular bedroom came from. Each journey describes a
 * typical chain for that kind of toy, and every stage says whether its numbers
 * are measured, published by the company that makes the thing, or a general
 * industry pattern. `confidence` is not decoration; it is what stops a
 * plausible story from being read as a receipt.
 */

export type Confidence =
  /** A figure from a named dataset or official publication. */
  | "measured"
  /** Stated publicly by the company that makes the product. */
  | "company"
  /** How this kind of thing is usually made. Not specific to one toy. */
  | "typical";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  /** What this source is actually being used for, in plain words. */
  usedFor: string;
  retrieved: string;
}

export interface Place {
  name: string;
  country: string;
  /**
   * True for somewhere that is not on Earth's surface. Helium that escapes
   * has no latitude, and drawing it at 0, 0 puts it in the Gulf of Guinea,
   * which is worse than not drawing it at all.
   */
  offEarth?: boolean;
  /** Degrees north, negative south. */
  lat: number;
  /** Degrees east, negative west. */
  lon: number;
}

export type StageKind =
  | "grow"
  | "dig"
  | "pump"
  | "make"
  | "build"
  | "ship"
  | "store"
  | "play"
  | "after";

export interface Fact {
  text: string;
  confidence: Confidence;
  sourceIds: string[];
}

export interface Stage {
  id: string;
  kind: StageKind;
  /** Short label for the step, in a child's words. */
  title: string;
  place: Place;
  /** What happens here. Two or three sentences at most. */
  what: string;
  /** The thing worth remembering. One sentence. */
  hook: string;
  facts: Fact[];
}

export interface Toy {
  id: string;
  name: string;
  /** One line under the name. */
  tagline: string;
  /** An emoji stand-in, so the project ships with no image licensing. */
  symbol: string;
  /** What this toy is mostly made of, in a child's words. */
  madeOf: string[];
  stages: Stage[];
  /** The question this toy answers better than the others. */
  bigIdea: string;
}
