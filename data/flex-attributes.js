// Flex Attributes: declarative config for the attributes the player can
// add/remove in each flex-editor section - the road container, and each
// car type. Each entry is either a "select" attribute (a fixed set of CSS
// keyword values) or a "number" attribute (a numeric CSS value), and
// drives which value control the flex editor renders for it.
window.FlexAttributes = {
  container: [
    {
      prop: "flex-direction",
      label: "flex-direction",
      type: "select",
      default: "row",
      options: ["row", "row-reverse", "column", "column-reverse"]
    },
    {
      prop: "flex-wrap",
      label: "flex-wrap",
      type: "select",
      default: "nowrap",
      options: ["nowrap", "wrap", "wrap-reverse"]
    },
    {
      prop: "justify-content",
      label: "justify-content",
      type: "select",
      default: "flex-start",
      options: [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly"
      ]
    },
    {
      prop: "align-items",
      label: "align-items",
      type: "select",
      default: "stretch",
      options: ["stretch", "flex-start", "flex-end", "center", "baseline"]
    },
    {
      prop: "align-content",
      label: "align-content",
      type: "select",
      default: "stretch",
      options: [
        "stretch",
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around"
      ]
    }
  ],

  item: [
    {
      prop: "align-self",
      label: "align-self",
      type: "select",
      default: "auto",
      options: [
        "auto",
        "flex-start",
        "flex-end",
        "center",
        "baseline",
        "stretch",
        "start",
        "end"
      ]
    },
    {
      prop: "order",
      label: "order",
      type: "number",
      default: 0,
      min: -10,
      max: 10,
      step: 1
    },
    {
      prop: "flex-grow",
      label: "flex-grow",
      type: "number",
      default: 0,
      min: 0,
      max: 10,
      step: 1
    },
    {
      prop: "flex-shrink",
      label: "flex-shrink",
      type: "number",
      default: 1,
      min: 0,
      max: 10,
      step: 1
    }
  ]};
