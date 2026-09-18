// Step Nav component: wires the Previous/Next buttons to StepsProvider's
// navigation and keeps the label/disabled state in sync with the current step.

(function () {
  function updateStepNavUI() {
    document.getElementById("step-nav-label").textContent =
      `Step ${StepsProvider.getIndex() + 1} / ${StepsProvider.getTotal()}`;
    document.getElementById("step-nav-prev").disabled = StepsProvider.getIndex() === 0;
    document.getElementById("step-nav-next").disabled =
      StepsProvider.getIndex() === StepsProvider.getTotal() - 1;
  }

  document.addEventListener("DOMContentLoaded", () => {
    document
      .getElementById("step-nav-prev")
      .addEventListener("click", () => StepsProvider.previous());
    document
      .getElementById("step-nav-next")
      .addEventListener("click", () => StepsProvider.next());

    StepsProvider.subscribe(updateStepNavUI);
    updateStepNavUI();
  });
})();