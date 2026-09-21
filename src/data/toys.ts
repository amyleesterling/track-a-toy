import type { Toy } from "./types";

/**
 * Seven toys, seven journeys.
 *
 * Read the honesty rule in types.ts before adding anything here. Each stage
 * carries a confidence level, and "typical" means exactly that: this is how
 * this kind of toy is usually made, not a claim about the one on your floor.
 */

const PLACES = {
  amazon: {
    name: "The Amazon rainforest",
    country: "Brazil",
    lat: -3.12,
    lon: -60.02,
  },
  suratThani: {
    name: "Surat Thani",
    country: "Thailand",
    lat: 9.14,
    lon: 99.33,
  },
  sanPedro: {
    name: "San Pédro",
    country: "Côte d'Ivoire",
    lat: 4.75,
    lon: -6.64,
  },
  malaysiaMill: {
    name: "Johor sawmills",
    country: "Malaysia",
    lat: 1.85,
    lon: 103.76,
  },
  carpathians: {
    name: "The Carpathian beech forests",
    country: "Romania",
    lat: 45.6,
    lon: 25.4,
  },
  rasTanura: {
    name: "Ras Tanura oil terminal",
    country: "Saudi Arabia",
    lat: 26.64,
    lon: 50.16,
  },
  permian: {
    name: "The Permian Basin",
    country: "United States",
    lat: 31.9,
    lon: -102.3,
  },
  rasLaffan: { name: "Ras Laffan", country: "Qatar", lat: 25.9, lon: 51.55 },
  cliffside: {
    name: "Cliffside, near Amarillo",
    country: "United States",
    lat: 35.3,
    lon: -101.9,
  },
  antamina: { name: "Antamina mine", country: "Peru", lat: -9.53, lon: -77.06 },
  mountIsa: {
    name: "Mount Isa",
    country: "Australia",
    lat: -20.72,
    lon: 139.49,
  },
  bayanObo: { name: "Bayan Obo", country: "China", lat: 41.77, lon: 109.97 },
  bangka: {
    name: "Bangka Island tin mines",
    country: "Indonesia",
    lat: -2.13,
    lon: 106.11,
  },
  hsinchu: {
    name: "Hsinchu Science Park",
    country: "Taiwan",
    lat: 24.78,
    lon: 121.0,
  },
  chenghai: {
    name: "Chenghai, Shantou",
    country: "China",
    lat: 23.47,
    lon: 116.76,
  },
  dongguan: {
    name: "Dongguan, Guangdong",
    country: "China",
    lat: 23.02,
    lon: 113.75,
  },
  shenzhen: { name: "Shenzhen", country: "China", lat: 22.54, lon: 114.06 },
  yantian: {
    name: "Yantian container port",
    country: "China",
    lat: 22.58,
    lon: 114.27,
  },
  billund: { name: "Billund", country: "Denmark", lat: 55.73, lon: 9.12 },
  kladno: { name: "Kladno", country: "Czechia", lat: 50.14, lon: 14.1 },
  nyiregyhaza: {
    name: "Nyíregyháza",
    country: "Hungary",
    lat: 47.95,
    lon: 21.72,
  },
  monterrey: { name: "Monterrey", country: "Mexico", lat: 25.69, lon: -100.32 },
  jiaxing: { name: "Jiaxing", country: "China", lat: 30.75, lon: 120.76 },
  binhDuong: {
    name: "Binh Duong",
    country: "Viet Nam",
    lat: 11.07,
    lon: 106.65,
  },
  cikarang: { name: "Cikarang", country: "Indonesia", lat: -6.27, lon: 107.15 },
  wichita: {
    name: "Wichita, Kansas",
    country: "United States",
    lat: 37.69,
    lon: -97.34,
  },
  longBeach: {
    name: "Long Beach and Los Angeles ports",
    country: "United States",
    lat: 33.74,
    lon: -118.27,
  },
  rotterdam: {
    name: "Rotterdam",
    country: "Netherlands",
    lat: 51.95,
    lon: 4.14,
  },
  elSegundo: {
    name: "El Segundo, California",
    country: "United States",
    lat: 33.92,
    lon: -118.42,
  },
  warehouse: {
    name: "A regional warehouse",
    country: "United States",
    lat: 39.77,
    lon: -86.16,
  },
  home: {
    name: "A bedroom floor",
    country: "Anywhere",
    lat: 42.36,
    lon: -71.06,
  },
  landfill: {
    name: "The bin, then somewhere else",
    country: "Anywhere",
    lat: 41.5,
    lon: -81.7,
  },
  space: {
    name: "Out past the sky, for ever",
    country: "Space",
    lat: 0,
    lon: 0,
    offEarth: true,
  },
} as const;

export const toys: Toy[] = [
  // ---------------------------------------------------------------- blocks
  {
    id: "wooden-blocks",
    name: "Wooden blocks",
    tagline: "The shortest journey of the seven.",
    symbol: "🧱",
    madeOf: ["Wood", "Water based paint"],
    bigIdea:
      "A toy can be made of something that grew, and that grew from sunlight, air and rain.",
    stages: [
      {
        id: "blocks-tree",
        kind: "grow",
        title: "A tree stands in the rain for twenty five years",
        place: PLACES.suratThani,
        what: "Most wooden blocks are rubberwood, which comes from the same tree that makes rubber. Farmers tap it for its milky latex for about twenty five years. When it stops giving enough latex, the tree is cut and the wood is used.",
        hook: "The wood is what is left over after the tree has finished its first job.",
        facts: [
          {
            text: "Thailand sent out 2.7 million tonnes of natural rubber in 2023, more than any other country.",
            confidence: "measured",
            sourceIds: ["comtrade-rubber"],
          },
          {
            text: "Using rubberwood means the tree gets a second life instead of being burned.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "blocks-mill",
        kind: "make",
        title: "The sawmill cuts and dries it",
        place: PLACES.malaysiaMill,
        what: "The trunk is sawn into planks and dried in a kiln for days, because wood that is still damp will crack and twist later. Then it is cut into cubes and arches and cylinders, and the edges are sanded round.",
        hook: "Drying the wood takes longer than cutting it.",
        facts: [
          {
            text: "Rounded edges are not decoration. A sharp corner on a block is a corner a toddler lands on.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "blocks-paint",
        kind: "build",
        title: "Paint that is safe to chew",
        place: PLACES.dongguan,
        what: "Blocks are painted with water based paint and checked for lead and other metals, because a two year old will put them in their mouth. Some blocks are left bare so you can see the grain.",
        hook: "Toys for the smallest children have the strictest rules, because they get chewed.",
        facts: [
          {
            text: "China sent out 3.5 million tonnes of toys in 2023, worth 40.5 billion dollars.",
            confidence: "measured",
            sourceIds: ["comtrade-toys"],
          },
        ],
      },
      {
        id: "blocks-ship",
        kind: "ship",
        title: "Into a steel box on a ship",
        place: PLACES.yantian,
        what: "The blocks are boxed, stacked on a pallet, and loaded into a shipping container. The container crosses the Pacific on a ship carrying thousands of others.",
        hook: "One container ship can carry more than twenty thousand of those steel boxes.",
        facts: [
          {
            text: "A ship moves a tonne of cargo using far less fuel than a truck or a plane does for the same distance.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "blocks-home",
        kind: "play",
        title: "Knocked over, again",
        place: PLACES.home,
        what: "Blocks have no battery, no screen and no instructions, and they are often the toy that lasts longest in a family. They get handed down.",
        hook: "This is the only toy of the seven that can outlive the child who was given it.",
        facts: [
          {
            text: "Wood can be repainted, re-sanded and passed on. Most of the other six cannot.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ lego
  {
    id: "lego",
    name: "LEGO bricks",
    tagline: "Oil, pressed into a shape that never changes.",
    symbol: "🟨",
    madeOf: ["ABS plastic", "Colour pigment"],
    bigIdea:
      "A brick made in Denmark in 1958 still clips onto one made this morning, and that is a decision somebody made.",
    stages: [
      {
        id: "lego-oil",
        kind: "pump",
        title: "It starts as oil",
        place: PLACES.rasTanura,
        what: "LEGO bricks are mostly ABS, a hard plastic made from oil. The oil is split in a refinery into smaller pieces, and three of those pieces are combined to make ABS.",
        hook: "The brick in your hand was once underground, and much older than any dinosaur toy.",
        facts: [
          {
            text: "ABS is chosen because it is hard, shiny, and holds an exact shape without bending.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "lego-pellets",
        kind: "make",
        title: "Turned into tiny coloured beads",
        place: PLACES.rotterdam,
        what: "The plastic arrives at the factory not as bricks but as sacks of beads smaller than a pea, already coloured. A machine melts them and squirts them into steel moulds.",
        hook: "Every LEGO brick you have ever touched started as a bead you could lose in the carpet.",
        facts: [
          {
            text: "The moulds are cut so precisely that bricks from different factories and different decades still fit together.",
            confidence: "company",
            sourceIds: ["lego-locations"],
          },
        ],
      },
      {
        id: "lego-mould",
        kind: "build",
        title: "Six factories, one shape",
        place: PLACES.billund,
        what: "LEGO makes bricks in Billund in Denmark, Kladno in Czechia, Nyíregyháza in Hungary, Monterrey in Mexico, Jiaxing in China, and Binh Duong in Vietnam. Each one has to make the identical brick.",
        hook: "Six factories on four continents, and none of them is allowed to be slightly different.",
        facts: [
          {
            text: "The Vietnam factory opened in April 2025 and runs on solar power from panels on its own roofs.",
            confidence: "company",
            sourceIds: ["lego-vietnam"],
          },
          {
            text: "Czechia, Hungary and Denmark are all among the world's biggest toy exporters, and LEGO is a large part of why.",
            confidence: "measured",
            sourceIds: ["comtrade-toys", "lego-locations"],
          },
        ],
      },
      {
        id: "lego-pack",
        kind: "store",
        title: "Counted into bags",
        place: PLACES.kladno,
        what: "Bricks are weighed rather than counted. A machine drops bricks into a bag until the weight is right, which is faster and more accurate than counting them one by one.",
        hook: "The bag was filled by weight, which is why you sometimes get a spare.",
        facts: [
          {
            text: "Spare pieces in a set are usually the small ones, because a lost 1x1 plate is the most likely to be missed.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "lego-home",
        kind: "play",
        title: "Trodden on in bare feet",
        place: PLACES.home,
        what: "The brick is designed to survive being stepped on without breaking, which is exactly why it hurts so much.",
        hook: "It does not break, so your foot takes all of it.",
        facts: [
          {
            text: "Because the shape never changed, bricks from a grandparent's childhood still work in a set bought today.",
            confidence: "company",
            sourceIds: ["lego-locations"],
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------- balloon
  {
    id: "balloon",
    name: "A birthday balloon",
    tagline: "Filled with something the Earth cannot make any more.",
    symbol: "🎈",
    madeOf: ["Latex from a tree", "Helium from deep underground"],
    bigIdea:
      "The helium inside took hundreds of millions of years to make, is used for one afternoon, and then leaves the planet for ever.",
    stages: [
      {
        id: "balloon-latex",
        kind: "grow",
        title: "A cut in the bark, before dawn",
        place: PLACES.sanPedro,
        what: "The balloon's skin is latex, tapped from rubber trees. A worker cuts a shallow spiral in the bark in the early morning, and white latex runs slowly into a cup.",
        hook: "The tree is not cut down. It is cut just deep enough to weep, over and over, for years.",
        facts: [
          {
            text: "By weight, Côte d'Ivoire sent out more natural rubber in 2023 than Indonesia did.",
            confidence: "measured",
            sourceIds: ["comtrade-rubber"],
          },
          {
            text: "Rubber trees came originally from the Amazon and were carried to Africa and Asia, where most now grow.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "balloon-dip",
        kind: "make",
        title: "A balloon shaped stick is dipped",
        place: PLACES.wichita,
        what: "Balloons are made by dipping a balloon shaped form into liquid latex, letting it dry, and peeling it off. The thick lip at the neck is made by rolling the edge before it dries.",
        hook: "A balloon is a thin skin peeled off a shape, not blown like glass.",
        facts: [
          {
            text: "Latex balloons are made of a material that rots, unlike foil balloons.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "balloon-helium-origin",
        kind: "dig",
        title: "The gas was made by rocks breaking down",
        place: PLACES.cliffside,
        what: "Helium is not manufactured. It forms deep underground when radioactive elements in rock slowly break apart, over hundreds of millions of years, and it collects in the same traps that hold natural gas.",
        hook: "Nobody can make more helium. It has to be found.",
        facts: [
          {
            text: "The world produced about 180 million cubic metres of helium in 2024.",
            confidence: "measured",
            sourceIds: ["usgs-helium"],
          },
          {
            text: "Qatar and the United States together made most of it: about 64 and 81 million cubic metres.",
            confidence: "measured",
            sourceIds: ["usgs-helium"],
          },
        ],
      },
      {
        id: "balloon-helium-plant",
        kind: "make",
        title: "Chilled until everything else turns liquid",
        place: PLACES.rasLaffan,
        what: "Helium is separated from natural gas by cooling the mixture until every other gas turns to liquid and drains away. Helium is the last one standing, because it needs to be colder than anything else to condense.",
        hook: "Helium stays a gas down to about 269 degrees below zero, which is how it gets separated.",
        facts: [
          {
            text: "In the United States, party balloons and other lifting uses take 18 percent of the helium, and MRI scanners take 17 percent.",
            confidence: "measured",
            sourceIds: ["usgs-helium"],
          },
        ],
      },
      {
        id: "balloon-party",
        kind: "play",
        title: "One afternoon",
        place: PLACES.home,
        what: "The balloon floats because helium is lighter than air. It slowly leaks out, because helium atoms are so small they slip between the molecules of the latex, and by tomorrow the balloon is on the floor.",
        hook: "It starts leaking the moment it is tied.",
        facts: [
          {
            text: "A helium balloon goes down even if there is no hole, because the atoms escape straight through the skin.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "balloon-space",
        kind: "after",
        title: "And then it leaves the planet",
        place: PLACES.space,
        what: "The helium that escapes rises through the air, and because it is so light, Earth's gravity cannot hold it. It drifts off into space and never comes back.",
        hook: "Every other material in these seven toys stays on Earth. This one does not.",
        facts: [
          {
            text: "Helium is the only thing in this whole site that leaves the planet permanently once it is used.",
            confidence: "typical",
            sourceIds: ["usgs-helium"],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------- animal figures
  {
    id: "animal-figures",
    name: "A unicorn and a dinosaur",
    tagline: "One of these animals was real.",
    symbol: "🦄",
    madeOf: ["Soft PVC plastic", "Hand painted colour"],
    bigIdea:
      "The same factory, the same plastic and the same paintbrush make both the animal that existed and the one that never did.",
    stages: [
      {
        id: "figures-oil",
        kind: "pump",
        title: "Both start as the same barrel of oil",
        place: PLACES.permian,
        what: "Solid animal figures are usually soft PVC. The unicorn and the dinosaur are moulded from the same material, in the same way, on the same day.",
        hook: "Nothing about how they are made knows that one of them is imaginary.",
        facts: [
          {
            text: "Soft PVC is used because it holds fine detail like scales and hair, and it bends instead of snapping.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "figures-sculpt",
        kind: "make",
        title: "Somebody sculpts it first",
        place: PLACES.elSegundo,
        what: "Before any plastic is poured, a person sculpts the animal, by hand or on a computer. For the dinosaur they work from fossil bones and from what scientists currently think it looked like. For the unicorn they work from hundreds of years of paintings and stories.",
        hook: "The dinosaur is a guess built from bones. The unicorn is a guess built from stories.",
        facts: [
          {
            text: "Dinosaur toys change over time as new fossils are found. Many older toys show dinosaurs dragging their tails, which we now think was wrong.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "figures-mould",
        kind: "build",
        title: "Poured, cooled, and pulled out",
        place: PLACES.chenghai,
        what: "Hot liquid plastic fills a metal mould shaped like the animal. It cools, the mould opens, and the figure comes out in one solid piece, all one colour.",
        hook: "It leaves the mould completely blank, like a toy waiting for its skin.",
        facts: [
          {
            text: "Chenghai in Guangdong makes a large share of the world's plastic toys.",
            confidence: "typical",
            sourceIds: ["comtrade-toys"],
          },
        ],
      },
      {
        id: "figures-paint",
        kind: "build",
        title: "Painted by hand, one colour at a time",
        place: PLACES.chenghai,
        what: "Detailed animal figures are painted by people, not machines. Each worker adds one colour and passes it along, so a figure with eight colours has been held by several different pairs of hands.",
        hook: "Somebody painted that dinosaur's eye. A person, with a brush.",
        facts: [
          {
            text: "The eyes are usually painted last, because they are the hardest and the most noticeable if wrong.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "figures-home",
        kind: "play",
        title: "Standing on a shelf together",
        place: PLACES.home,
        what: "In the bedroom the unicorn and the dinosaur stand side by side, the same size, the same shine, equally real to play with.",
        hook: "Play does not care which one was real. Science does.",
        facts: [
          {
            text: "Both are made to the same safety rules: no small parts that break off, and no harmful paint.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- barbie
  {
    id: "barbie",
    name: "Barbie",
    tagline: "More materials than any other toy here, in one small body.",
    symbol: "👱‍♀️",
    madeOf: ["Hard ABS", "Soft vinyl", "Nylon hair", "Fabric"],
    bigIdea:
      "One doll is really five different plastics that have to be made in five different ways and then joined.",
    stages: [
      {
        id: "barbie-plastics",
        kind: "pump",
        title: "Not one plastic, several",
        place: PLACES.rasTanura,
        what: "The head is soft vinyl so the hair can be pushed into it. The body and legs are harder plastic so they hold a pose. The hair is nylon or a similar fibre. These are different materials made in different factories.",
        hook: "Her head and her legs are not made of the same stuff, and they cannot be.",
        facts: [
          {
            text: "Soft head, hard body is a design decision, not an accident: you cannot root hair into hard plastic.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "barbie-hair",
        kind: "build",
        title: "The hair is sewn in, strand by strand",
        place: PLACES.cikarang,
        what: "A machine punches bundles of fibre into the soft head in rows, like a tiny sewing machine. Then the hair is combed, cut and set, sometimes by hand.",
        hook: "Rooting the hair takes longer than moulding the entire rest of the doll.",
        facts: [
          {
            text: "Mattel makes dolls in several countries including Indonesia, Malaysia, China and Mexico.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "barbie-assemble",
        kind: "build",
        title: "Arms, legs, head, clothes",
        place: PLACES.dongguan,
        what: "The pieces arrive separately and people put them together, then dress the doll. Sewing doll clothes is fiddly work that machines are still bad at, so it is done by hand.",
        hook: "Her outfit was sewn by a person at a sewing machine, at doll size.",
        facts: [
          {
            text: "Tiny clothes are harder to sew than adult clothes, because the seams and hems are the same difficulty but much smaller.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "barbie-ship",
        kind: "ship",
        title: "Across the Pacific in a box",
        place: PLACES.longBeach,
        what: "Boxed dolls travel by container ship to a port, then by train or truck to a warehouse, then to a shop or a doorstep.",
        hook: "The doll crossed an ocean lying down in a cardboard box.",
        facts: [
          {
            text: "Toys are light for their size, so a container of dolls hits its volume limit long before its weight limit.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "barbie-home",
        kind: "play",
        title: "Hair cut, permanently",
        place: PLACES.home,
        what: "Rooted hair does not grow back. A haircut is the one change to this toy that can never be undone.",
        hook: "Everything else about her can be re-dressed and re-posed. The hair is final.",
        facts: [
          {
            text: "Because the hair is pushed into holes rather than growing from roots, cutting it removes it for good.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------- monster truck
  {
    id: "monster-truck",
    name: "A monster truck",
    tagline: "Heavy because there is metal inside it.",
    symbol: "🛻",
    madeOf: ["Zinc alloy", "Plastic", "Rubber tyres"],
    bigIdea:
      "The weight in your hand is zinc, dug out of a mountain, and the weight is the whole point.",
    stages: [
      {
        id: "truck-zinc",
        kind: "dig",
        title: "Zinc comes out of a mountain",
        place: PLACES.antamina,
        what: "A die-cast toy truck has a body made of zinc alloy. Zinc is mined from rock, crushed, and separated out. Peru and Australia are two of the biggest producers, and China is by far the biggest.",
        hook: "Die-cast means the metal was poured into a mould as a liquid.",
        facts: [
          {
            text: "The world mined about 12 million tonnes of zinc in 2024. China produced about 4 million tonnes of it.",
            confidence: "measured",
            sourceIds: ["usgs-zinc"],
          },
          {
            text: "Peru mined about 1.3 million tonnes and Australia about 1.1 million tonnes in 2024.",
            confidence: "measured",
            sourceIds: ["usgs-zinc"],
          },
        ],
      },
      {
        id: "truck-cast",
        kind: "make",
        title: "Molten metal, squeezed into a mould",
        place: PLACES.mountIsa,
        what: "The zinc alloy is melted and forced into a steel mould under high pressure. It cools in seconds. The rough edges are knocked off, and the body is ready to paint.",
        hook: "The whole truck body is made in about the time it takes to say its name.",
        facts: [
          {
            text: "Zinc alloy is used instead of steel because it melts at a low enough temperature to pour into detailed moulds.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "truck-tyres",
        kind: "build",
        title: "The tyres are the same tree again",
        place: PLACES.suratThani,
        what: "The oversized tyres are rubber, which may be natural rubber from the same kind of tree that made the balloon and the wooden blocks, or a synthetic rubber made from oil.",
        hook: "The balloon, the blocks and these tyres can all come from one species of tree.",
        facts: [
          {
            text: "Thailand, Indonesia and Côte d'Ivoire are the three largest exporters of natural rubber.",
            confidence: "measured",
            sourceIds: ["comtrade-rubber"],
          },
        ],
      },
      {
        id: "truck-assemble",
        kind: "build",
        title: "Body, base, axles, wheels",
        place: PLACES.dongguan,
        what: "The painted metal body is joined to a plastic base, with the axles trapped between them. On many toy cars the two halves are held together by squashing two small metal posts flat.",
        hook: "Look at the bottom: those two flattened dots are what holds the whole truck together.",
        facts: [
          {
            text: "That is also why taking a die-cast car apart usually breaks it.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "truck-home",
        kind: "play",
        title: "Driven off the end of the sofa",
        place: PLACES.home,
        what: "The metal body is what lets it survive being thrown, crashed and dropped down the stairs.",
        hook: "A plastic truck would have cracked by now. This one dents.",
        facts: [
          {
            text: "Metal bends and keeps its shape roughly; brittle plastic snaps. That is why die-cast toys outlive plastic ones.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------- walkie talkie
  {
    id: "walkie-talkie",
    name: "A walkie talkie",
    tagline: "The most complicated thing on this list, by a long way.",
    symbol: "📻",
    madeOf: [
      "Plastic case",
      "Circuit board",
      "Copper",
      "Tin",
      "Rare earth magnet",
      "Battery",
    ],
    bigIdea:
      "This toy needs materials from more countries than the other six put together, and one of them is a rock that makes magnets.",
    stages: [
      {
        id: "walkie-rare-earth",
        kind: "dig",
        title: "A magnet made from a rare rock",
        place: PLACES.bayanObo,
        what: "The speaker and the microphone both need a strong magnet, and the strongest small magnets are made with neodymium, a rare earth metal. Most of the world's rare earths are mined and processed in China.",
        hook: "Your voice comes out of a magnet pushing a paper cone back and forth.",
        facts: [
          {
            text: "The world mined about 390,000 tonnes of rare earths in 2024, and about 270,000 tonnes of that was in China.",
            confidence: "measured",
            sourceIds: ["usgs-rare-earths"],
          },
          {
            text: "Rare earths are not actually rare in the ground. What is rare is finding them concentrated enough to be worth mining.",
            confidence: "measured",
            sourceIds: ["usgs-rare-earths"],
          },
        ],
      },
      {
        id: "walkie-tin",
        kind: "dig",
        title: "Tin, to stick the parts down",
        place: PLACES.bangka,
        what: "Every part on the circuit board is held there by solder, which is mostly tin. A lot of the world's tin is dredged from the seabed and from pits around Bangka Island in Indonesia.",
        hook: "The parts are not glued or screwed on. They are held by melted metal.",
        facts: [
          {
            text: "Solder has to melt at a low enough temperature to not destroy the parts it is attaching.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "walkie-chip",
        kind: "make",
        title: "A chip smaller than a fingernail",
        place: PLACES.hsinchu,
        what: "One small silicon chip does the work of turning your voice into a radio signal and back again. Chips are made in enormous clean factories where the air is filtered hundreds of times a minute.",
        hook: "The room where the chip was made is cleaner than an operating theatre.",
        facts: [
          {
            text: "A single speck of dust landing in the wrong place ruins a chip, which is why the factories are so clean.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "walkie-board",
        kind: "build",
        title: "Machines place the parts, fast",
        place: PLACES.shenzhen,
        what: "A pick and place machine drops hundreds of tiny components onto the board in seconds, then the whole board goes through an oven that melts the solder all at once.",
        hook: "The board is baked, like a tray of biscuits, to join everything at the same moment.",
        facts: [
          {
            text: "Shenzhen and the towns around it make a large share of the world's consumer electronics.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "walkie-assemble",
        kind: "build",
        title: "Snapped into a plastic shell",
        place: PLACES.dongguan,
        what: "The board, speaker, battery holder and aerial go inside a moulded plastic case, which is screwed or clipped shut. Then every unit is switched on and tested, because a radio that does not receive is not worth shipping.",
        hook: "Somebody turned yours on once, before it was ever boxed.",
        facts: [
          {
            text: "Toys with electronics are tested individually; a wooden block never is.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "walkie-home",
        kind: "play",
        title: "Two children, two rooms, one invisible thread",
        place: PLACES.home,
        what: "Press the button and your voice becomes a radio wave travelling at the speed of light, through walls, to the other handset.",
        hook: "Nothing physical goes between the two handsets. Nothing at all.",
        facts: [
          {
            text: "Both handsets have to be set to the same channel, because they are listening to one particular wavelength out of many.",
            confidence: "typical",
            sourceIds: [],
          },
        ],
      },
      {
        id: "walkie-after",
        kind: "after",
        title: "The hardest one to throw away",
        place: PLACES.landfill,
        what: "A broken walkie talkie contains a battery, a circuit board, copper and a magnet. All of those can be recovered, but only if it goes to electronic waste recycling rather than the bin.",
        hook: "It is the only toy here that is not supposed to go in the household bin.",
        facts: [
          {
            text: "The copper and the rare earth magnet inside are worth recovering. In a landfill they are simply lost.",
            confidence: "typical",
            sourceIds: ["usgs-rare-earths"],
          },
        ],
      },
    ],
  },
];

export function toy(id: string): Toy | undefined {
  return toys.find((t) => t.id === id);
}
