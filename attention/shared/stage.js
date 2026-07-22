/* Fixed 1280x720 stage, letterboxed and scaled to fit the window —
   layouts are designed once and look identical on any screen. */
(function () {
  function fit() {
    var stage = document.querySelector(".stage");
    if (!stage) return;
    var s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    stage.style.transform = "translate(-50%, -50%) scale(" + s + ")";
  }
  window.addEventListener("resize", fit);
  window.addEventListener("load", fit);
  document.addEventListener("DOMContentLoaded", fit);
})();
