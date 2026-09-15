// Level Actions component: Reset clears every flex editor field and any
// applied styles back to the level's starting state; Submit checks the
// typed flex-editor values against the step's solution, computes a fine
// (mismatched properties), and shows the result in a popup (dismissable
// via its button, a click outside it, or Escape).

const MISMATCH_FINE_PER_PROP = 10;

function buildDefaults(attributes) {
  const defaults = {};
  attributes.forEach((attr) => {
    defaults[attr.prop] = String(attr.default);
  });
  return defaults;
}

const CONTAINER_DEFAULTS = buildDefaults(FlexAttributes.container);
const ITEM_DEFAULTS = buildDefaults(FlexAttributes.item);

// Some values are aliases of each other (e.g. "start"/"flex-start") - map
// to a canonical form before comparing so alias pairs count as equal.
function canonicalValue(value) {
  return FlexAttributes.valueAliases[value] || value;
}

function propsMatch(actual, expected) {
  const expectedKeys = Object.keys(expected);
  const actualKeys = Object.keys(actual);
  if (expectedKeys.length !== actualKeys.length) return false;
  return expectedKeys.every(
    (prop) => canonicalValue(actual[prop]) === canonicalValue(expected[prop])
  );
}

function countMismatches(actual, expected, defaults) {
  const actualKeys = new Set(Object.keys(actual));
  const expectedKeys = new Set(Object.keys(expected));

  const sharedKeys = [...actualKeys].filter((key) => expectedKeys.has(key));
  const missingKeys = [...expectedKeys].filter((key) => !actualKeys.has(key));
  const extraKeys = [...actualKeys].filter((key) => !expectedKeys.has(key));

  const sharedMismatches = sharedKeys.filter(
    (key) => canonicalValue(actual[key]) !== canonicalValue(expected[key])
  ).length;
  const extraMismatches = extraKeys.filter(
    (key) => canonicalValue(actual[key]) !== canonicalValue(defaults[key])
  ).length;

  return sharedMismatches + missingKeys.length + extraMismatches;
}

function computeMismatchFine(step) {
  const containerMismatches = countMismatches(
    FlexEditor.getContainerProps(),
    step.roadSolution,
    CONTAINER_DEFAULTS
  );

  const types = Array.from(new Set(step.cars));
  const carMismatches = types.reduce(
    (sum, type) =>
      sum +
      countMismatches(
        FlexEditor.getCarProps(type),
        step.carTypeSolutions[type] || {},
        ITEM_DEFAULTS
      ),
    0
  );

  return (containerMismatches + carMismatches) * MISMATCH_FINE_PER_PROP;
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
  const { bestForStep, total } = Scores.recordAttempt(step.id, attemptFine);

  const solved = containerSolved && carsSolved;
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
