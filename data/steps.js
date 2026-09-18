// List of steps (levels) for FlexParx.
// Shape follows the level object described in CLAUDE.md.
//
// roadSolution and each entry in carTypeSolutions are string-to-string maps
// of CSS property name -> CSS value, applied directly to the road container
// / car elements respectively.
const STEPS = [
  {
  id: 1,
  hint: "justify-content",
  instruction: "Spread the vehicles along the road, first vehicle at the start of the road, last one at the end, equal gaps between them.",
  cars: ["private", "taxi", "truck"],
  roadSolution: { "justify-content": "space-between" },
  carTypeSolutions: { private: {}, taxi: {}, truck: {} }
},

{
  id: 2,
  hint: "align-items + align-self",
  instruction: "Park all vehicles over to the bottom edge of the road, but leave the taxis waiting in the middle of the road.",
  cars: ["taxi", "truck", "private", "taxi"],
  roadSolution: {
    "align-items": "flex-end"
  },
  carTypeSolutions: { private: {}, taxi: {"align-self": "center"}, truck: {} }
},

{
    id: 3,
    hint: "justify-content + align-items",
    instruction:
      "Line the vehicles up along the middle of the road, with the same gap before the first vehicle, between every two vehicles, and after the last.",
    cars: ["truck", "private", "taxi"],
    roadSolution: {
      "justify-content": "space-evenly",
      "align-items": "center"
    },
    carTypeSolutions: {
      private: {},
      taxi: {},
      truck: {}
    }
  },

  {
  id: 4,
  hint: "flex-direction + align-self",
  instruction: "The vehicles came in from the wrong side. Park them at the other end of the road, in reverse order, and park the truck down to the bottom edge.",
  cars: ["taxi", "private", "truck"],
  roadSolution: { "flex-direction": "row-reverse" },
  carTypeSolutions: { private: {}, taxi: {}, truck: { "align-self": "flex-end"} }
},

{
  id: 5,
  hint: "flex-wrap",
  instruction: "The row is so crowded that the vehicles are getting squeezed. If you don't want your car to get scratched, let them keep their size and continue onto a new row below.",
  cars: ["private", "taxi", "truck", "taxi", "private", "truck", "taxi", "private"],
  roadSolution: { "flex-wrap": "wrap" },
  carTypeSolutions: { private: {}, taxi: {}, truck: {} }
},
{
    id: 6,
    hint: "align-items + flex-wrap",
    instruction:
      "9 vehicles won't fit in one row. Park them in two rows, with the first row on top, and position each row down to the bottom of its half of the road.",
    cars: ["truck", "taxi", "private", "taxi", "truck", "private", "private", "taxi", "truck"],
    roadSolution: {
      "flex-wrap": "wrap",
      "align-items": "flex-end"
    },
    carTypeSolutions: {
      private: {},
      taxi: {},
      truck: {}
    }
  },
  {
    id: 7,
    hint: "flex-direction + justify-content + align-self",
    instruction:
      "Park the vehicles in a single column along the left side of the road, pushed all the way to the bottom. The private car has to park in the middle of the road instead, at the same height as the rest of its column.",
    cars: ["private", "truck", "taxi"],
    roadSolution: {
      "flex-direction": "column",
      "justify-content": "flex-end"
    },
    carTypeSolutions: {
      private: {"align-self": "center"},
      taxi: {},
      truck: {}
    }
  },
  {
    id: 8,
    hint: "align-items + flex-direction + flex-wrap",
    instruction:
      "Park the cars top to bottom in columns, starting a new column to the right whenever one fills up, and push each car to the right edge of its column",
    cars: ["taxi", "private", "truck", "private", "truck", "taxi", "private"],
    roadSolution: {
      "flex-direction": "column",
      "flex-wrap": "wrap",
      "align-items": "flex-end"
    },
    carTypeSolutions: {
      private: {},
      taxi: {},
      truck: {}
    }
  }
];
