// Step Instruction component: shows the current step's task and the flex
// concept it practices, kept in sync with StepsProvider.
function updateStepInstructionUI(step) {
  document.getElementById("step-instruction-concept").textContent = step.hint;
  document.getElementById("step-instruction-text").textContent = step.instruction;
}
 
document.addEventListener("DOMContentLoaded", () => {
  updateStepInstructionUI(StepsProvider.getCurrent());
  StepsProvider.subscribe(updateStepInstructionUI);
});
 

































