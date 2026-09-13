// Level Actions component: Reset clears every flex editor field and any
// applied styles back to the level's starting state; Submit checks the
// typed flex-editor values against the step's solution, computes a fine
// (mismatched properties), and shows the result in a popup (dismissable
// via its button, a click outside it, or Escape).

const BEST_FINES_KEY = "flexparx-best-fines";
const MISMATCH_FINE_PER_PROP = 10;

function propsMatch(actual, expected) {
  const expectedKeys = Object.keys(expected);
  const actualKeys = Object.keys(actual);
  if (expectedKeys.length !== actualKeys.length) return false;
  return expectedKeys.every((prop) => actual[prop] === expected[prop]);
}

function countMismatches(actual, expected) {
  const keys = new Set([...Object.keys(actual), ...Object.keys(expected)]);
  let count = 0;
  keys.forEach((key) => {
    if (actual[key] !== expected[key]) count += 1;
  });
  return count;
}

function computeMismatchFine(step) {
  const containerMismatches = countMismatches(
    FlexEditor.getContainerProps(),
    step.roadSolution
  );

  const types = Array.from(new Set(step.cars));
  const carMismatches = types.reduce(
    (sum, type) =>
      sum +
      countMismatches(
        FlexEditor.getCarProps(type),
        step.carTypeSolutions[type] || {}
      ),
    0
  );

  return (containerMismatches + carMismatches) * MISMATCH_FINE_PER_PROP;
}

function loadBestFines() {
  try {
    const raw = localStorage.getItem(BEST_FINES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveBestFines(bestFines) {
  localStorage.setItem(BEST_FINES_KEY, JSON.stringify(bestFines));
}

function getTotalFine(bestFines) {
  return Object.values(bestFines).reduce((sum, fine) => sum + fine, 0);
}

function recordAttempt(stepId, fine) {
  const bestFines = loadBestFines();
  const key = String(stepId);

  if (!(key in bestFines) || fine < bestFines[key]) {
    bestFines[key] = fine;
    saveBestFines(bestFines);
  }

  return { bestForStep: bestFines[key], total: getTotalFine(bestFines) };
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

  const attemptFine = computeMismatchFine(step);
  const { bestForStep, total } = recordAttempt(step.id, attemptFine);

  const solved = containerSolved && carsSolved;
  const message = solved ? "Parked! Level solved." : "Not quite - keep adjusting.";
  showPopup(message, solved, attemptFine, bestForStep, total);
  updateTotalDisplay(total);
}

document.addEventListener("DOMContentLoaded", () => {
  updateTotalDisplay(getTotalFine(loadBestFines()));

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
