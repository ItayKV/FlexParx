# FlexParx

A browser game that teaches CSS Flexbox by having the player park cars. Vanilla HTML, CSS, and JS only — no build step, no frameworks, no dependencies.

## Concept

Each step shows a set of vehicles sitting on a "road" (a flex container) and a matching set of parking spots. The player adds flex properties through UI controls (selects and number inputs) to the road container and/or to individual vehicle types. As values change, the vehicles re-flow live with a move animation. The step is solved when every vehicle sits on a parking spot of its own type.

Similar in spirit to Flexbox Froggy, but themed around vehicles and parking, with independent per-type properties.

## Visual Design

- **Toolbar**: top bar with the site name "FlexParx".
- **Color palette**: green across the site, defined as CSS variables in `shared/base.css` (`--green-darkest` … `--green-lightest`, `--grey-road`, text colors).
- **Main view**:
  - Desktop (wider than 1024px): the flex editor on the left (fixed 380px, scrolls internally when it has many rows), the road area on the right.
  - Up to 1024px: the road area on top and the flex editor below it; the whole page scrolls.
- **Road area** (top to bottom): step nav, step instruction, the road, level actions (total fines, Reset, Submit).
- **Road**: dark grey, fixed logical size of 1000×560px on every screen so each step's solution (including where rows/columns wrap) is identical everywhere. `road.js` scales it visually (CSS `transform: scale`) to fit its frame; the transform doesn't affect the flex layout inside it.
- **Vehicles and parking spots** are images in `data/photos/` (`private.png`, `taxi.png`, `truck.png` and the matching `privateP.png`, `taxiP.png`, `truckP.png`). Every vehicle and every spot has the same footprint (1.56 cells of 100px, including margins), so 6 fit in a row and 3 in a column.

## Core Data Model

### Vehicle types
There are exactly **3 vehicle types**:

| Type    | Image                  |
|---------|------------------------|
| private | blue car               |
| taxi    | yellow taxi            |
| truck   | green truck            |

Each type has its own set of item-level properties, independent of the other types. All vehicles of the same type always share the same values.

### Editable properties (`data/flex-attributes.js`)
`FlexAttributes` is a config list that drives the flex editor. Each entry is either a `select` (fixed CSS keywords) or a `number` attribute.
- **Container (road)**: `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-content`.
- **Item (per vehicle type)**: `align-self`, `order`, `flex-grow`, `flex-shrink`.

The player adds an attribute via the "+ Add Attribute" select and removes it with the trash button. Removing an attribute returns it to the CSS default.

### Step object (`data/steps.js`)
Steps live in the `STEPS` array (currently 8 steps). A step defines:
- **`id`**: unique number, also the key for saved scores.
- **`hint`**: the flex concept(s) the step practices, e.g. `"align-items + flex-wrap"`. Shown as a tag next to the instruction.
- **`instruction`**: the task text shown to the player. Must describe the full solution layout.
- **`cars`**: flat list of vehicle type names, e.g. `["private", "truck", "taxi"]`. List order is the starting (DOM) order of the vehicles and of the parking spots.
- **`roadSolution`**: map of CSS property name -> value applied to the parking layer, e.g. `{ "flex-direction": "column" }`. Keys are real kebab-case CSS names, applied via `style.setProperty`.
- **`carTypeSolutions`**: `{ private, taxi, truck }`, each the same shape as `roadSolution`, applied to that type's parking spots.

The road starts as plain `display: flex` with default values until the player changes something.

```js
{
  id: 1,
  hint: "justify-content",
  instruction: "Spread the vehicles along the road...",
  cars: ["private", "taxi", "truck"],
  roadSolution: { "justify-content": "space-between" },
  carTypeSolutions: { private: {}, taxi: {}, truck: {} }
}
```

### Road layers
The road holds two overlapping flex containers of the same size: `#road-parking` (the target layout, built by applying the step's solution to the spots) underneath, and `#road-cars` (the player's layout) on top.

## Win Condition and Scoring

On Submit, `level-actions.js` compares positions, not property values, so any combination of properties that parks the vehicles correctly is accepted:
- Each vehicle's center (from `offsetLeft`/`offsetTop`, unaffected by the scale transform or the move animation) must match the center of a free parking spot of the same type, within 1px.
- Every vehicle that isn't parked correctly adds a $10 fine. A fine of $0 means the step is solved.
- A popup shows the result (success or error), the attempt's fine, the best fine for the step and the total. It closes with its OK button, a click on the backdrop, or Escape.

`data/scores.js` stores the best (lowest) fine per step in `localStorage`. The total shown is the sum of the best fines.

## Navigation and Persistence

- `data/steps-provider.js` (`StepsProvider`) owns the current step index, Previous/Next navigation and a subscribe mechanism that notifies components when the step changes. Steps change without reloading the page.
- On load, the game opens at the first step that hasn't been solved yet (or the last step if all are solved).
- The step nav shows "Step X / Y". Previous/Next are always available within bounds, so the player can return to completed steps.
- Reset clears every editor field and every applied style back to the step's starting state.

## Tech Constraints

- Plain HTML/CSS/JS only. No frameworks, no bundlers, no npm dependencies, no backend. No CSS Grid for the game itself.
- Static site: runs by opening `index.html` directly (`file://`) and on GitHub Pages.
- Structure: `shared/` (base CSS), `components/<name>/` (each with its own `.css` and, where it has behavior, `.js`), and `data/` (`steps.js`, `flex-attributes.js`, `scores.js`, `steps-provider.js`, `photos/` for images).
- Every JS file is wrapped in an IIFE. Components communicate only through the namespaced globals they expose (`window.Road`, `window.FlexEditor`, `window.Scores`, `window.StepsProvider`, plus `STEPS` and `FlexAttributes`), not ES modules.
- `<script>` tags in `index.html` are ordered so the data files load before the components that depend on them.
- HTML structure stays inline in `index.html` per component, marked with `<!-- Component: X -->` comments.