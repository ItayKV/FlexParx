// Level Actions component: Reset clears every flex editor field and any
// applied styles back to the level's starting state; Submit checks the
// typed flex-editor values against the step's solution and shows the
// result in a popup (dismissable via its button or a click outside it).

function propsMatch(actual, expected) {
  const expectedKeys = Object.keys(expected);
  const actualKeys = Object.keys(actual);
  if (expectedKeys.length !== actualKeys.length) return false;
  return expectedKeys.every((prop) => actual[prop] === expected[prop]);
}

function showPopup(message, isSuccess) {
  const dialog = document.getElementById("feedback-popup-dialog");
  document.getElementById("feedback-popup-message").textContent = message;
  dialog.classList.toggle("feedback-popup__dialog--success", isSuccess);
  dialog.classList.toggle("feedback-popup__dialog--error", !isSuccess);
  document.getElementById("feedback-popup").hidden = false;
}

function closePopup() {
  document.getElementById("feedback-popup").hidden = true;
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

  const containerSolved = propsMatch(
    FlexEditor.getContainerProps(),
    step.roadSolution
  );

  const types = Array.from(new Set(step.cars));
  const carsSolved = types.every((type) =>
    propsMatch(FlexEditor.getCarProps(type), step.carTypeSolutions[type] || {})
  );

  if (containerSolved && carsSolved) {
    showPopup("Parked! Level solved.", true);
  } else {
    showPopup("Not quite - keep adjusting.", false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
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
