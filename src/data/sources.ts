import type { Source } from "./types";

/**
 * Every number on this site traces back to one of these. If a claim cannot
 * name a source here, it does not go on the page.
 */

export const RETRIEVED = "2026-09-20";

export const sources: Source[] = [
  {
    id: "usgs-helium",
    title: "Mineral Commodity Summaries 2025: Helium",
    publisher: "U.S. Geological Survey",
    url: "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-helium.pdf",
    usedFor:
      "World helium production by country for 2024, what helium is used for in the United States, and the price.",
    retrieved: RETRIEVED,
  },
  {
    id: "usgs-zinc",
    title: "Mineral Commodity Summaries 2025: Zinc",
    publisher: "U.S. Geological Survey",
    url: "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-zinc.pdf",
    usedFor: "World zinc mine production by country for 2024.",
    retrieved: RETRIEVED,
  },
  {
    id: "usgs-rare-earths",
    title: "Mineral Commodity Summaries 2025: Rare Earths",
    publisher: "U.S. Geological Survey",
    url: "https://pubs.usgs.gov/periodicals/mcs2025/mcs2025-rare-earths.pdf",
    usedFor: "World rare earth mine production by country for 2024.",
    retrieved: RETRIEVED,
  },
  {
    id: "comtrade-toys",
    title: "UN Comtrade, commodity 9503 (toys), exports to world, 2023",
    publisher: "United Nations Statistics Division",
    url: "https://comtradeapi.un.org/public/v1/preview/C/A/HS?reporterCode=156&period=2023&partnerCode=0&cmdCode=9503&flowCode=X",
    usedFor:
      "How much of the world's toys each country sends out, by value and by weight, for 2023.",
    retrieved: RETRIEVED,
  },
  {
    id: "comtrade-rubber",
    title:
      "UN Comtrade, commodity 4001 (natural rubber), exports to world, 2023",
    publisher: "United Nations Statistics Division",
    url: "https://comtradeapi.un.org/public/v1/preview/C/A/HS?reporterCode=764&period=2023&partnerCode=0&cmdCode=4001&flowCode=X",
    usedFor: "Which countries send out the most natural rubber, for 2023.",
    retrieved: RETRIEVED,
  },
  {
    id: "lego-vietnam",
    title: "The LEGO Group opens its factory in Binh Duong, Vietnam",
    publisher: "The LEGO Group",
    url: "https://www.lego.com/en-us/aboutus/news",
    usedFor:
      "That the Vietnam factory opened in April 2025, its cost, and that it runs on solar power.",
    retrieved: RETRIEVED,
  },
  {
    id: "lego-locations",
    title: "LEGO Group locations",
    publisher: "The LEGO Group",
    url: "https://www.lego.com/en-us/aboutus/lego-group/contact/locations",
    usedFor: "Which towns the LEGO factories are in.",
    retrieved: RETRIEVED,
  },
];

export function source(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}

/** Every source id referenced anywhere, so nothing can cite a ghost. */
export const sourceIds = new Set(sources.map((s) => s.id));
