/* Tiny test harness: every page registers named checks that flip a badge to
   PASS / FAIL, so on the deployed host you can tell at a glance what ran.
   No workers, no network calls — plain DOM only. */
(function () {
  var results = {};

  function badge(id) {
    return document.querySelector('[data-check="' + id + '"] .badge');
  }

  function set(id, state, msg) {
    results[id] = { state: state, msg: msg || "" };
    var el = badge(id);
    if (el) {
      el.textContent = state + (msg ? " — " + msg : "");
      el.className = "badge " + state.toLowerCase();
    }
    render();
  }

  function render() {
    var summary = document.getElementById("summary");
    if (!summary) return;
    var ids = Object.keys(results);
    var pass = ids.filter(function (i) { return results[i].state === "PASS"; }).length;
    var fail = ids.filter(function (i) { return results[i].state === "FAIL"; }).length;
    summary.textContent = pass + " passed, " + fail + " failed, " +
      (ids.length - pass - fail) + " pending";
  }

  window.reportPass = function (id, msg) { set(id, "PASS", msg); };
  window.reportFail = function (id, msg) { set(id, "FAIL", msg); };

  // Surface any uncaught error prominently — on a locked-down host this is
  // often the only clue (e.g. CSP blocking a script).
  window.addEventListener("error", function (e) {
    var bar = document.getElementById("errbar");
    if (bar) {
      bar.style.display = "block";
      bar.textContent = "Uncaught error: " + (e.message || e.type) +
        (e.filename ? " [" + e.filename.split("/").pop() + "]" : "");
    }
  }, true);

  // After 5s, anything still pending is marked so you don't wait forever.
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.querySelectorAll("[data-check] .badge").forEach(function (el) {
        if (el.textContent === "PENDING") {
          el.textContent = "NO SIGNAL — script never reported; check visually";
          el.className = "badge fail";
        }
      });
    }, 5000);
  });
})();
