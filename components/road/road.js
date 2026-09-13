// Road component: renders parking spots (target layout) and cars (player
// layout), and applies live prop changes from the Flex Editor with a FLIP
// position animation.
window.Road = (function () {
  let currentStep = STEPS[0];

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

  // FLIP animation: measure car positions before the layout-affecting
  // mutation, run the mutation, then measure again and animate from the old
  // position to the new one via transform (CSS transitions can't smoothly
  // animate the discrete properties - order/align-self/flex-direction -
  // driving the move).
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

  function render(step) {
    currentStep = step;
    renderParking(step);
    renderCars(step);
  }

  function applyContainerProps(props) {
    withCarPositionAnimation(() => {
      const carsLayer = document.getElementById("road-cars");
      carsLayer.style.cssText = "";
      applyProps(carsLayer, props);
    });
  }

  function applyCarProps(props) {
    withCarPositionAnimation(() => {
      document.querySelectorAll("#road-cars .car").forEach((car) => {
        car.style.cssText = "";
        applyProps(car, props);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => render(currentStep));

  return { render, applyContainerProps, applyCarProps };
})();
