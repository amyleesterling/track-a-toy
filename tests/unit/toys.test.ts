import { describe, expect, it } from "vitest";
import { toys, toy } from "../../src/data/toys";
import { sources } from "../../src/data/sources";
import { allPlaces, validateToys } from "../../src/data/validate";

describe("the seven journeys", () => {
  it("ships exactly the seven toys Amy asked for", () => {
    expect(toys.map((t) => t.id)).toEqual([
      "wooden-blocks",
      "lego",
      "balloon",
      "animal-figures",
      "barbie",
      "monster-truck",
      "walkie-talkie",
    ]);
  });

  it("passes validation, so nothing claims more than it can show", () => {
    expect(validateToys()).toEqual([]);
  });

  it("rejects a measured claim with no source behind it", () => {
    const broken = structuredClone(toys);
    broken[0].stages[0].facts[0].confidence = "measured";
    broken[0].stages[0].facts[0].sourceIds = [];
    expect(validateToys(broken).join("\n")).toMatch(
      /marked measured but cites nothing/,
    );
  });

  it("rejects a citation to a source that does not exist", () => {
    const broken = structuredClone(toys);
    broken[1].stages[0].facts[0].sourceIds = ["not-a-real-source"];
    expect(validateToys(broken).join("\n")).toMatch(/unknown source/);
  });

  it("rejects a place that is not on Earth", () => {
    const broken = structuredClone(toys);
    broken[2].stages[0].place.lat = 120;
    expect(validateToys(broken).join("\n")).toMatch(/is not on Earth/);
  });

  it("gives every toy a stage where a child plays with it", () => {
    for (const item of toys)
      expect(item.stages.some((s) => s.kind === "play")).toBe(true);
  });

  it("puts every place somewhere real on the globe", () => {
    const places = allPlaces();
    expect(places.length).toBeGreaterThan(15);
    for (const place of places) {
      expect(Math.abs(place.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(place.lon)).toBeLessThanOrEqual(180);
    }
  });
});

describe("sources", () => {
  it("gives every source a working-looking URL and says what it is for", () => {
    for (const s of sources) {
      expect(s.url).toMatch(/^https:\/\//);
      expect(s.usedFor.length).toBeGreaterThan(20);
      expect(s.publisher.length).toBeGreaterThan(3);
    }
  });

  it("cites USGS for every mineral number and UN Comtrade for every trade number", () => {
    const cited = new Set(
      toys.flatMap((t) =>
        t.stages.flatMap((s) => s.facts.flatMap((f) => f.sourceIds)),
      ),
    );
    expect(cited).toContain("usgs-helium");
    expect(cited).toContain("usgs-zinc");
    expect(cited).toContain("usgs-rare-earths");
    expect(cited).toContain("comtrade-toys");
    expect(cited).toContain("comtrade-rubber");
  });

  it("has no unused sources", () => {
    const cited = new Set(
      toys.flatMap((t) =>
        t.stages.flatMap((s) => s.facts.flatMap((f) => f.sourceIds)),
      ),
    );
    const unused = sources.map((s) => s.id).filter((id) => !cited.has(id));
    expect(unused).toEqual([]);
  });
});

describe("the balloon, which is the point of the whole site", () => {
  it("follows the helium from underground all the way off the planet", () => {
    const balloon = toy("balloon")!;
    const kinds = balloon.stages.map((s) => s.kind);
    expect(kinds).toContain("dig");
    expect(kinds).toContain("play");
    expect(kinds).toContain("after");
    expect(balloon.stages.at(-1)!.place.name).toMatch(/for ever/i);
  });
});
