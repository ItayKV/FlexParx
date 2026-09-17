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
  instruction: "Spread the cars along the road: the first at the start, the last at the end, with equal space between them.",
  cars: ["private", "taxi", "truck"],
  roadSolution: { "justify-content": "space-between" },
  carTypeSolutions: { private: {}, taxi: {}, truck: {} }
},

{
  id: 2,
  hint: "align-items",
  instruction: "Pull all the cars over to the bottom edge of the road.",
  cars: ["taxi", "truck", "private", "taxi"],
  roadSolution: {
    "align-items": "flex-end"
  },
  carTypeSolutions: { private: {}, taxi: {}, truck: {} }
},

{
    id: 3,
    hint: "justify-content + align-items",
    instruction:
      "Line the cars up along the middle of the road, with the same gap before the first car, between every two cars, and after the last.",
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
  hint: "flex-direction",
  instruction: "The cars came in from the wrong side. Park them at the other end of the road, in reverse order.",
  cars: ["taxi", "private", "truck"],
  roadSolution: { "flex-direction": "row-reverse" },
  carTypeSolutions: { private: {}, taxi: {}, truck: {} }
},

{
  id: 5,
  hint: "flex-wrap",
  instruction: "The row is so crowded that the cars are getting squeezed. Let them keep their size and continue onto a new row below.",
  cars: ["private", "taxi", "truck", "taxi", "private", "truck", "taxi", "private"],
  roadSolution: { "flex-wrap": "wrap" },
  carTypeSolutions: { private: {}, taxi: {}, truck: {} }
},
{
    id: 6,
    hint: "align-items + flex-wrap",
    instruction:
      "Nine cars won't fit in one row. Wrap them into two rows, with the first row on top, and pull each row down to the bottom of its half of the road.",
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
    hint: "flex-direction + justify-content",
    instruction:
      "Stack the cars in a single column along the left side of the road, pushed all the way to the bottom, with the first car on top.",
    cars: ["private", "truck", "taxi"],
    roadSolution: {
      "flex-direction": "column",
      "justify-content": "flex-end"
    },
    carTypeSolutions: {
      private: {},
      taxi: {},
      truck: {}
    }
  },
  {
    id: 8,
    hint: "align-items + flex-direction + flex-wrap",
    instruction:
      "Park the cars top to bottom in columns, starting a new column to the right whenever one fills up. The road splits into equal strips, one per column: push each column to the right edge of its strip.",
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
