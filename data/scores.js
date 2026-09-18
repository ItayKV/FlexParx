// Scores: persists the best (lowest) fine recorded per step in
// localStorage. Shared by StepsProvider (to resume at the first
// unsolved step) and Level Actions (to compute/display fines).
window.Scores = (function () {
  const BEST_FINES_KEY = "flexparx-best-fines";

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

  function isSolved(stepId) {
  return loadBestFines()[String(stepId)] === 0;
  }

  function hasBestFine(stepId) {
    return String(stepId) in loadBestFines();
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

  return { loadBestFines, getTotalFine, isSolved, hasBestFine, recordAttempt };
})();
