# FlexParx

A browser game that teaches CSS Flexbox by having the player park cars. Vanilla HTML, CSS, and JS only — no build step, no frameworks, no dependencies.

## Concept

Each level shows a set of cars sitting on a "road" (a flex container) and a matching set of parking spots. The player edits flex properties (via UI controls, not raw code — see Open Questions) applied to the road container and/or to individual car types. As values change, the cars re-flow live. The level is solved when every car's position/order matches its designated parking spot.

This is conceptually similar to Flexbox Froggy / Flexbox Zombies, but themed around cars, parking, and multiple car types with independent per-type properties.

## Visual Design

- **Toolbar**: fixed top bar with the site name "FlexParx" as the logo/title.
- **Color palette**: green, across the whole site (toolbar, buttons, accents, backgrounds). Exact shades TBD — establish a small palette (e.g. dark green for toolbar, mid green for accents/CTAs, light green/off-white for page background) and define as CSS variables.
- **Main view**: primary layout area, right side holds a large "road" panel:
  - Road background: dark grey.
  - Road is the flex container for the cars.
  - Parking spots are rendered on/along the road and are visually marked with their designated position/label so the player can see the target layout.
  - Each parking spot is color-coded to match the car type designated for it (red/yellow/green per the car types table below), using a brighter/lighter tint of that type's color so it reads as a "target" against the dark grey road rather than as a car itself.
- Left side (or elsewhere in main view) is reserved for level info and the flex-property controls (exact placement TBD — see Open Questions).

## Core Data Model

### Car types
There are exactly **3 car types**, distinguished by color:

| Type  | Color  |
|-------|--------|
| car   | red    |
| taxi  | yellow |
| truck | green  |

Each car type has its own settable `align-self` value, independent of the other types. (Item-level properties are limited to `align-self` — see below.)

### Step object
Steps (levels) live in `steps.js` as the `STEPS` array. A step defines:
- **`cars`**: a flat list of car type names, e.g. `["car", "truck", "taxi"]`. List order *is* the starting order of the cars on the road (DOM order), before the player changes anything.
- **`hint`**: names the flex concept this step is teaching (e.g. `"flex-direction"`). Not yet used in the UI — reserved for future hint display.
- The **road**: a flex container. It needs no explicit initial state — it starts as plain `display: flex` with default flex behavior (`flex-direction: row`, `align-items: stretch`, etc.) until the player changes it.
- **`roadSolution`**: a string-to-string map of CSS property name -> CSS value, applied directly to the road container, e.g. `{ "flex-direction": "column" }`. Keys are real CSS property names (kebab-case), not camelCase, so they can be applied via `style.setProperty` without translation.
- **`carTypeSolutions`**: an object mapping each car type (`car`, `taxi`, `truck`) to its own string-to-string CSS property map (same shape as `roadSolution`), applied to that car type's elements. Defaults to an empty object per type when a step doesn't test item-level properties.
- The **parking spots**: designated end positions rendered on the road representing where each car must end up. Applying `roadSolution` (road) and `carTypeSolutions` (per car type) should cause the cars to visually land on these parking spots.

Suggested shape (illustrative, not final):

```js
const STEPS = [
  {
    id: 1,
    hint: "flex-direction",
    cars: ["car", "truck", "taxi"],
    roadSolution: {
      "flex-direction": "column"
    },
    carTypeSolutions: {
      car: {},
      taxi: {},
      truck: {}
    }
  }
];
```

## Win Condition

A level is complete when the live computed layout (car positions, based on current flex values applied to the road and car types) matches the level's solution layout — i.e. every car sits in its designated parking spot.

## Tech Constraints

- Plain HTML/CSS/JS only. No frameworks, no bundlers, no npm dependencies, no server/backend of any kind.
- Static site: must run by directly opening `index.html` in a browser (double-click / `file://`). No dev server, no build step, no install step.
- Structure: `index.html`, `styles.css`, `steps.js` (the `STEPS` data array), plus further JS modules as game/UI logic is added.

## Open Questions / To Be Directed

- How does the player actually change flex values — dropdowns/sliders per property, a code-like input, or preset buttons? Which properties are exposed per level (could vary by level for progressive difficulty)?
- How is "reaching" a parking spot detected — exact CSS value match against the solution, or geometric match (comparing rendered bounding boxes/positions)?
- Is there a level-select screen, or linear progression? How many levels total, and how is difficulty ramped?
- Feedback/scoring: hints, error states, success animation, timer, move counter?
- Do individual cars within the same type ever need different solutions, or is the solution always uniform per type?
- Persistence: save progress (e.g. `localStorage`) across sessions?
- Responsive/mobile behavior for the road + controls layout?
