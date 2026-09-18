// Steps Provider: owns the current step index and navigation (next/previous,
// bounds-checked), and lets other components subscribe to be notified
// whenever the current step changes.
window.StepsProvider = (function () {
  const firstUnsolvedIndex = STEPS.findIndex(
    (step) => !Scores.isSolved(step.id)
  );
  let index = firstUnsolvedIndex === -1 ? STEPS.length - 1 : firstUnsolvedIndex;
  const subscribers = [];

  function notify() {
    subscribers.forEach((subscriber) => subscriber(STEPS[index], index));
  }

  function getCurrent() {
    return STEPS[index];
  }

  function getIndex() {
    return index;
  }

  function getTotal() {
    return STEPS.length;
  }

  function next() {
    if (index >= STEPS.length - 1) return;
    index += 1;
    notify();
  }

  function previous() {
    if (index <= 0) return;
    index -= 1;
    notify();
  }

  function subscribe(callback) {
    subscribers.push(callback);
  }

  return { getCurrent, getIndex, getTotal, next, previous, subscribe };
})();
