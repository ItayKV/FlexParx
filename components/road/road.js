// Road component: renders parking spots (target layout) and cars (player
// layout), and applies live prop changes from the Flex Editor with a FLIP
// position animation.
window.Road = (function () {
  // The road has a fixed logical size (see road.css), so every step's
  // solution lays out the same on any screen. It is scaled visually to fit
  // the free space in its frame - a transform, so the flex layout inside it
  // is unaffected.
  let scale = 1;

  function fitRoadToFrame() {
    const frame = document.querySelector(".road-frame");
    const road = frame.querySelector(".road");

    scale = Math.min(
      1,
      frame.clientWidth / road.offsetWidth,
      frame.clientHeight / road.offsetHeight
    );
    road.style.transform = scale < 1 ? `scale(${scale})` : "";
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
      // Rects are measured on screen (scaled); the transform below is
      // applied inside the scaled road, so convert back to road pixels.
      const dx = (first.left - last.left) / scale;
      const dy = (first.top - last.top) / scale;

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

  function applyCarProps(type, props) {
    withCarPositionAnimation(() => {
      document.querySelectorAll(`#road-cars .car--${type}`).forEach((car) => {
        car.style.cssText = "";
        applyProps(car, props);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Re-fit whenever the frame's size changes: window resizes, and also
    // layout shifts such as a longer instruction text on another step.
    new ResizeObserver(fitRoadToFrame).observe(
      document.querySelector(".road-frame")
    );

    render(StepsProvider.getCurrent());
    StepsProvider.subscribe((step) => render(step));
  });

  return { render, applyContainerProps, applyCarProps };
})();