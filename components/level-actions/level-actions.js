// Level Actions component: Reset clears every flex editor field and any
// applied styles back to the level's starting state; Submit checks the
// currently applied road/car-type properties against the step's solution.

function propsMatch(actual, expected) {
  const expectedKeys = Object.keys(expected);
  const actualKeys = Object.keys(actual);
  if (expectedKeys.length !== actualKeys.length) return false;
  return expectedKeys.every((prop) => actual[prop] === expected[prop]);
}

function setFeedback(message, isSuccess) {
  const feedback = document.getElementById("level-actions-feedback");
  feedback.textContent = message;
  feedback.classList.toggle("level-actions__feedback--success", isSuccess);
  feedback.classList.toggle("level-actions__feedback--error", !isSuccess);
}

function handleReset() {
  const step = StepsProvider.getCurrent();

  FlexEditor.reset();
  Road.applyContainerProps({});
  Array.from(new Set(step.cars)).forEach((type) => {
    Road.applyCarProps(type, {});
  });

  const feedback = document.getElementById("level-actions-feedback");
  feedback.textContent = "";
  feedback.className = "level-actions__feedback";
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
    setFeedback("Parked! Level solved.", true);
  } else {
    setFeedback("Not quite - keep adjusting.", false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("level-actions-reset")
    .addEventListener("click", handleReset);
  document
    .getElementById("level-actions-submit")
    .addEventListener("click", handleSubmit);

  StepsProvider.subscribe(() => {
    document.getElementById("level-actions-feedback").textContent = "";
    document.getElementById("level-actions-feedback").className =
      "level-actions__feedback";
  });
});
