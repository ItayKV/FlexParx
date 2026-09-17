// Flex Editor component: renders one section per target (the road
// container, and one per car type present in the current step) where the
// player adds/removes flex attributes from FlexAttributes' config-driven
// list, each backed by a select or number control depending on its type,
// and forwards the resulting prop map to the Road component live.

const TRASH_ICON_SVG =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>';

function createValueControl(attr, onChange) {
  let control;

  if (attr.type === "number") {
    control = document.createElement("input");
    control.type = "number";
    control.value = attr.default;
    if (attr.min !== undefined) control.min = attr.min;
    if (attr.max !== undefined) control.max = attr.max;
    if (attr.step !== undefined) control.step = attr.step;
    control.addEventListener("input", onChange);
  } else {
    control = document.createElement("select");
    attr.options.forEach((option) => {
      const optionEl = document.createElement("option");
      optionEl.value = option;
      optionEl.textContent = option;
      control.appendChild(optionEl);
    });
    control.value = attr.default;
    control.addEventListener("change", onChange);
  }

  control.className = "flex-editor__row-control";
  return control;
}

// Renders one "section" (a list of added attribute rows plus an add
// control) into `container`, backed by `attributes` (FlexAttributes.container
// or .item), calling `onChange` with the section's current prop map
// whenever a row is added, removed, or edited. Returns a `getProps()`
// reader that reflects the live DOM state, so no separate JS state needs
// to be kept in sync with it.
function buildAttributeSection(container, attributes, onChange) {
  container.innerHTML = "";

  const rows = document.createElement("div");
  rows.className = "flex-editor__rows";

  const addSelect = document.createElement("select");
  addSelect.className = "flex-editor__add-select";

  function currentProps() {
    const props = {};
    rows.querySelectorAll(".flex-editor__row").forEach((row) => {
      const control = row.querySelector(".flex-editor__row-control");
      props[row.dataset.prop] = control.value;
    });
    return props;
  }

  function refreshAddOptions() {
    const addedProps = new Set(
      Array.from(rows.querySelectorAll(".flex-editor__row")).map(
        (row) => row.dataset.prop
      )
    );
    const available = attributes.filter((attr) => !addedProps.has(attr.prop));

    addSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "+ Add Attribute";
    placeholder.disabled = true;
    placeholder.selected = true;
    addSelect.appendChild(placeholder);

    available.forEach((attr) => {
      const option = document.createElement("option");
      option.value = attr.prop;
      option.textContent = attr.label;
      addSelect.appendChild(option);
    });

    addSelect.disabled = available.length === 0;
  }

  function addRow(attr) {
    const row = document.createElement("div");
    row.className = "flex-editor__row";
    row.dataset.prop = attr.prop;

    const label = document.createElement("span");
    label.className = "flex-editor__row-label";
    label.textContent = attr.label;

    const control = createValueControl(attr, () => onChange(currentProps()));

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "flex-editor__row-remove";
    removeBtn.setAttribute("aria-label", `Remove ${attr.label}`);
    removeBtn.innerHTML = TRASH_ICON_SVG;
    removeBtn.addEventListener("click", () => {
      row.remove();
      refreshAddOptions();
      onChange(currentProps());
    });

    row.appendChild(label);
    row.appendChild(control);
    row.appendChild(removeBtn);
    rows.appendChild(row);

    refreshAddOptions();
  }

  addSelect.addEventListener("change", () => {
    const prop = addSelect.value;
    if (!prop) return;
    addRow(attributes.find((attr) => attr.prop === prop));
    onChange(currentProps());
  });

  container.appendChild(rows);
  container.appendChild(addSelect);

  refreshAddOptions();

  return { getProps: currentProps };
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

let containerSection = null;
const carSections = {};

function renderContainerField() {
  const container = document.getElementById("container-attrs");
  containerSection = buildAttributeSection(
    container,
    FlexAttributes.container,
    (props) => Road.applyContainerProps(props)
  );
}
function renderCarTypeFields(step) {
  const wrapper = document.getElementById("car-type-fields");
  wrapper.innerHTML = "";
  Object.keys(carSections).forEach((type) => delete carSections[type]);

  const types = Array.from(new Set(step.cars));
  types.forEach((type) => {
    const field = document.createElement("div");
    field.className = "flex-editor__field";

    const label = document.createElement("span");
    label.className = "flex-editor__label";
    label.textContent = capitalize(type);

    const attrsContainer = document.createElement("div");

    field.appendChild(label);
    field.appendChild(attrsContainer);
    wrapper.appendChild(field);

    carSections[type] = buildAttributeSection(
      attrsContainer,
      FlexAttributes.item,
      (props) => Road.applyCarProps(type, props)
    );
  });
}

function reset() {
  renderContainerField();
  renderCarTypeFields(StepsProvider.getCurrent());
}

function getContainerProps() {
  return containerSection ? containerSection.getProps() : {};
}

function getCarProps(type) {
  return carSections[type] ? carSections[type].getProps() : {};
}

window.FlexEditor = { reset, getContainerProps, getCarProps };

document.addEventListener("DOMContentLoaded", () => {
  renderContainerField();
  renderCarTypeFields(StepsProvider.getCurrent());

  StepsProvider.subscribe((step) => {
    renderContainerField();
    renderCarTypeFields(step);
  });
});
