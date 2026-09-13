// Flex Editor component: parses the typed CSS declarations from the
// container textarea and one textarea per car type present in the current
// step, and forwards the resulting prop objects to the Road component.

function parseCssDeclarations(text) {
  const props = {};
  text.split(/[\n;]+/).forEach((line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) return;
    const prop = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (prop && value) {
      props[prop] = value;
    }
  });
  return props;
}

function handleContainerPropsInput(event) {
  Road.applyContainerProps(parseCssDeclarations(event.target.value));
}

function handleCarPropsInput(type) {
  return (event) => {
    Road.applyCarProps(type, parseCssDeclarations(event.target.value));
  };
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function renderCarTypeFields(step) {
  const container = document.getElementById("car-type-fields");
  container.innerHTML = "";

  const types = Array.from(new Set(step.cars));
  types.forEach((type) => {
    const field = document.createElement("div");
    field.className = "flex-editor__field";

    const label = document.createElement("label");
    label.className = "flex-editor__label";
    label.setAttribute("for", `car-props-${type}`);
    label.textContent = capitalize(type);

    const textarea = document.createElement("textarea");
    textarea.id = `car-props-${type}`;
    textarea.className = "flex-editor__textarea";
    textarea.placeholder = `${type} flex attributes`;
    textarea.addEventListener("input", handleCarPropsInput(type));

    field.appendChild(label);
    field.appendChild(textarea);
    container.appendChild(field);
  });
}

function reset() {
  document.getElementById("container-props").value = "";
  renderCarTypeFields(StepsProvider.getCurrent());
}

function getContainerProps() {
  return parseCssDeclarations(document.getElementById("container-props").value);
}

function getCarProps(type) {
  const textarea = document.getElementById(`car-props-${type}`);
  return textarea ? parseCssDeclarations(textarea.value) : {};
}

window.FlexEditor = { reset, getContainerProps, getCarProps };

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("container-props")
    .addEventListener("input", handleContainerPropsInput);

  renderCarTypeFields(StepsProvider.getCurrent());

  StepsProvider.subscribe((step) => {
    document.getElementById("container-props").value = "";
    renderCarTypeFields(step);
  });
});
