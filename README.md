# Track a Toy

**Play it here: https://amyleesterling.github.io/track-a-toy/**

Pick a toy and follow it backwards across the world, all the way to the ground
it came out of. Seven toys: wooden blocks, LEGO bricks, a birthday balloon,
a plastic unicorn and dinosaur, Barbie, a die-cast monster truck, and a
walkie talkie.

Run it locally:

```bash
npm install --legacy-peer-deps
npm run dev
```

## The honesty rule

This project never claims to know where one particular toy in one particular
bedroom came from. Each journey is a typical chain for that kind of toy, and
**every single fact carries a confidence level**:

| Badge | Means |
| --- | --- |
| **Measured** | A figure from a named dataset. The source is linked on the card. |
| **Said by the maker** | Stated publicly by the company that makes it. |
| **Usually true** | How this kind of toy is usually made. Not a claim about yours. |

A fact marked `measured` or `company` with no source behind it is a **test
failure**, not a review note. See `validateToys()` in `src/data/validate.ts`.

## Where the numbers come from

- **USGS Mineral Commodity Summaries 2025** for helium, zinc and rare earths:
  world production by country for 2024.
- **UN Comtrade** for 2023 trade: toys (HS 9503) and natural rubber (HS 4001),
  exports to world.
- **The LEGO Group** for its own factory locations.
- **Natural Earth** 110m land polygons for the coastlines, which are public
  domain.

Two things worth knowing about the Comtrade data, because both nearly put a
false number on the page:

1. The free preview endpoint caps at 500 rows and truncates alphabetically.
   A naive query makes **Czechia** look like the world's largest toy exporter.
   It is not; China is, at $40.55 billion and 3.5 million tonnes in 2023.
2. Comtrade returns the same trade broken down several ways at once, by
   secondary partner and by transport mode. Summing every row double counts.
   Germany's toy exports came out **eight times too high** before this was
   caught. Only the row with `partner2Code` 0 and `motCode` 0 is the total.

## The favourite facts

- **Helium is the only material here that leaves the planet.** It forms by
  radioactive decay over hundreds of millions of years, floats a balloon for an
  afternoon, and is then light enough to escape Earth's gravity for good. Party
  balloons and other lifting uses take 18 percent of US helium; MRI scanners
  take 17 percent.
- **The balloon, the wooden blocks and the monster truck's tyres can all come
  from the same species of tree**, *Hevea brasiliensis*. The blocks are made
  from its wood after it stops yielding latex, at about twenty five years old.
- **By weight, Côte d'Ivoire exported more natural rubber in 2023 than
  Indonesia did.**
- **Czechia, Hungary and Denmark are all major toy exporters**, and LEGO is a
  large part of why: it has factories in Kladno, Nyíregyháza and Billund.

## Architecture

- `src/data/` is the whole point. `toys.ts` holds the seven journeys,
  `sources.ts` holds every citation, `validate.ts` enforces the honesty rule.
  None of it imports a renderer.
- `src/globe/globe.ts` draws the Earth and the routes. Journeys are great
  circle arcs, because that is the genuinely shortest path over a sphere.
- `src/main.ts` is the page.

Two geometry notes, both of which were bugs first:

- The globe turns to a place using a **quaternion** that maps the place's own
  direction onto the camera's, not a pair of Euler angles. Computing spin and
  tilt separately means guessing at rotation order and sign, and being 180
  degrees wrong is invisible until you notice a Thai marker sitting on Florida.
- A place that is **not on Earth** is marked `offEarth`. Helium that escapes
  has no latitude, and drawing it at 0, 0 puts it in the Gulf of Guinea and
  adds thousands of imaginary kilometres to the total.

## Testing

```bash
npm test          # data validation and globe geometry
npm run test:e2e  # the seven journeys in a real browser
```

Screenshots land in `docs/evidence/`.

## A note on npm

`npm install` on its own currently crashes in npm 10.9.2's peer dependency
resolver with `Cannot read properties of null (reading 'edgesOut')`. Use
`--legacy-peer-deps`.
