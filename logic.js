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

// FLIP animation: measure car positions before the layout-affecting mutation,
// run the mutation, then measure again and animate from the old position to
// the new one via transform (CSS transitions can't smoothly animate the
// discrete properties - order/align-self/flex-direction - driving the move).
function withCarPositionAnimation(mutate) {
  const cars = Array.from(document.querySelectorAll("#road-cars .car"));
  const firstRects = cars.map((car) => car.getBoundingClientRect());

  mutate();

  cars.forEach((car, i) => {
    const first = firstRects[i];
    const last = car.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;

    if (dx || dy) {
      car.style.transition = "none";
      car.style.transform = `translate(${dx}px, ${dy}px)`;

      requestAnimationFrame(() => {
        car.style.transition = "";
        car.style.transform = "";
      });
    }
  });
}

function handleContainerPropsInput(event) {
  const props = parseCssDeclarations(event.target.value);
  withCarPositionAnimation(() => {
    const carsLayer = document.getElementById("road-cars");
    carsLayer.style.cssText = "";
    applyProps(carsLayer, props);
  });
}

function handleCarPropsInput(event) {
  const props = parseCssDeclarations(event.target.value);
  withCarPositionAnimation(() => {
    document.querySelectorAll("#road-cars .car").forEach((car) => {
      car.style.cssText = "";
      applyProps(car, props);
    });
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
