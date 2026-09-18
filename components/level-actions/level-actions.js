// Level Actions component: Reset clears every flex editor field and any
// applied styles back to the level's starting state; Submit checks where the
// cars actually ended up - each car must sit on a parking spot of its own
// type - fines every car that doesn't, and shows the result in a popup
// (dismissable via its button, a click outside it, or Escape).
//
// Checking positions rather than the chosen property values means any
// combination of flex properties that parks the cars correctly is accepted.
(function () {
  const MISPARKED_FINE_PER_CAR = 10;
  const POSITION_TOLERANCE_PX = 1;

  // Center of an element within its road layer. offsetLeft/offsetTop come from
  // layout and ignore transforms, so the result isn't affected by a car's move
  // animation still running or by the road being scaled to fit the screen.
  function layoutCenter(element) {
    return {
      x: element.offsetLeft + element.offsetWidth / 2,
      y: element.offsetTop + element.offsetHeight / 2
    };
  }

  function isSamePosition(a, b) {
    return (
      Math.abs(a.x - b.x) <= POSITION_TOLERANCE_PX &&
      Math.abs(a.y - b.y) <= POSITION_TOLERANCE_PX
    );
  }

  // Cars and spots are both rendered in step.cars order, so the element at
  // index i is of type step.cars[i] in both layers (the CSS `order` property
  // moves elements visually but never changes their DOM order). Cars of the
  // same type are interchangeable, so each car may take any free spot of its
  // type; a taken spot can't be used by a second car.
  function countMisparkedCars(step) {
    const cars = document.querySelectorAll("#road-cars .car");
    const spots = Array.from(document.querySelectorAll("#road-parking .parking-spot"));
    const freeSpotIndexes = new Set(spots.keys());
    let misparked = 0;

    cars.forEach((car, carIndex) => {
      const carCenter = layoutCenter(car);
      const spotIndex = [...freeSpotIndexes].find(
        (i) =>
          step.cars[i] === step.cars[carIndex] &&
          isSamePosition(carCenter, layoutCenter(spots[i]))
      );

      if (spotIndex === undefined) {
        misparked += 1;
      } else {
        freeSpotIndexes.delete(spotIndex);
      }
    });

    return misparked;
  }

  function computeFine(step) {
    return countMisparkedCars(step) * MISPARKED_FINE_PER_CAR;
  }

  function updateTotalDisplay(total) {
    document.getElementById("level-actions-total").textContent =
      `Total fines: $${total}`;
  }

  function showPopup(message, isSuccess, attemptFine, bestForStep, total) {
    const dialog = document.getElementById("feedback-popup-dialog");
    document.getElementById("feedback-popup-message").textContent = message;
    document.getElementById("feedback-popup-score").textContent =
      `Fine: $${attemptFine} · Best: $${bestForStep} · Total: $${total}`;
    dialog.classList.toggle("feedback-popup__dialog--success", isSuccess);
    dialog.classList.toggle("feedback-popup__dialog--error", !isSuccess);
    document.getElementById("feedback-popup").hidden = false;
    document.getElementById("feedback-popup-close").focus();
  }

  function closePopup() {
    const popup = document.getElementById("feedback-popup");
    if (popup.hidden) return;
    popup.hidden = true;
    document.getElementById("level-actions-submit").focus();
  }

  function handlePopupKeydown(event) {
    if (event.key === "Escape") closePopup();
  }

  function handleReset() {
    const step = StepsProvider.getCurrent();

    FlexEditor.reset();
    Road.applyContainerProps({});
    Array.from(new Set(step.cars)).forEach((type) => {
      Road.applyCarProps(type, {});
    });
  }

  function handleSubmit() {
    const step = StepsProvider.getCurrent();

    const attemptFine = computeFine(step);
    const { bestForStep, total } = Scores.recordAttempt(step.id, attemptFine);

    const solved = attemptFine === 0;
    const message = solved ? "Parked! Level solved." : "Not quite - keep adjusting.";
    showPopup(message, solved, attemptFine, bestForStep, total);
    updateTotalDisplay(total);
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateTotalDisplay(Scores.getTotalFine(Scores.loadBestFines()));

    document
      .getElementById("level-actions-reset")
      .addEventListener("click", handleReset);
    document
      .getElementById("level-actions-submit")
      .addEventListener("click", handleSubmit);
    document
      .getElementById("feedback-popup-close")
      .addEventListener("click", closePopup);
    document
      .getElementById("feedback-popup-backdrop")
      .addEventListener("click", closePopup);
    document.addEventListener("keydown", handlePopupKeydown);

    StepsProvider.subscribe(closePopup);
  });
})();