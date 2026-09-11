// Game logic: current step state, and wiring the flex-editor textareas
// to the road's two layers (parking = target layout, cars = player layout).

let currentStep = STEPS[0];

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

function applyProps(element, props) {
  Object.entries(props).forEach(([prop, value]) => {
    element.style.setProperty(prop, value);
  });
}

function renderParking(step) {
  const parkingLayer = document.getElementById("road-parking");
  parkingLayer.innerHTML = "";
  parkingLayer.style.cssText = "";
  applyProps(parkingLayer, step.roadSolution);

  step.cars.forEach((type) => {
    const spot = document.createElement("div");
    spot.className = `parking-spot parking-spot--${type}`;
    applyProps(spot, step.carTypeSolutions[type] || {});
    parkingLayer.appendChild(spot);
  });
}

function renderCars(step) {
  const carsLayer = document.getElementById("road-cars");
  carsLayer.innerHTML = "";
  carsLayer.style.cssText = "";

  step.cars.forEach((type) => {
    const car = document.createElement("div");
    car.className = `car car--${type}`;
    carsLayer.appendChild(car);
  });
}

function handleContainerPropsInput(event) {
  const carsLayer = document.getElementById("road-cars");
  carsLayer.style.cssText = "";
  applyProps(carsLayer, parseCssDeclarations(event.target.value));
}

function handleCarPropsInput(event) {
  const props = parseCssDeclarations(event.target.value);
  document.querySelectorAll("#road-cars .car").forEach((car) => {
    applyProps(car, props);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderParking(currentStep);
  renderCars(currentStep);

  document
    .getElementById("container-props")
    .addEventListener("input", handleContainerPropsInput);
  document
    .getElementById("car-props")
    .addEventListener("input", handleCarPropsInput);
});
