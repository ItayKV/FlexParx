// Flex Editor component: parses the two textareas' typed CSS declarations
// and forwards the resulting prop objects to the Road component.

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

function handleCarPropsInput(event) {
  Road.applyCarProps(parseCssDeclarations(event.target.value));
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("container-props")
    .addEventListener("input", handleContainerPropsInput);
  document
    .getElementById("car-props")
    .addEventListener("input", handleCarPropsInput);

  StepsProvider.subscribe(() => {
    document.getElementById("container-props").value = "";
    document.getElementById("car-props").value = "";
  });
});
