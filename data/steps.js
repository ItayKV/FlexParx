// List of steps (levels) for FlexParx.
// Shape follows the level object described in CLAUDE.md.
//
// roadSolution and each entry in carTypeSolutions are string-to-string maps
// of CSS property name -> CSS value, applied directly to the road container
// / car elements respectively.
const STEPS = [
  {
    id: 1,
    hint: "flex-direction",
    cars: ["car", "car", "car"],
    roadSolution: {
      "flex-direction": "column"
    },
    carTypeSolutions: {
      car: {},
      taxi: {},
      truck: {}
    }
  },
  {
    id: 2,
    hint: "flex-direction",
    cars: ["car", "truck", "taxi"],
    roadSolution: {
      "justify-content": "space-around"
    },
    carTypeSolutions: {
      car: {'align-self': 'end'},
      taxi: {},
      truck: {'align-self': 'center'}
    }
  }
];
