/* Deck engine — click-synced GSAP steps + page navigation.
   Page contract:
     1. include manifest.js (defines DECK_PAGES order), gsap, this file
     2. build ONE gsap.timeline({paused:true}); call DECK.markStep(tl) at each
        click boundary (narrative beat); then DECK.register(tl, {reset: fn})
        where fn restores any DOM state changed via .call() (may be omitted).
   Controls:
     click / Space / ArrowRight / PageDown : next step (at end: next page)
     ArrowLeft / PageUp                    : previous step (instant, no motion)
     on-screen arrow icons                 : previous / next page
     loop button : play all steps continuously, looping
     reset button: back to the page's initial state (also turns loop off)
     F           : fullscreen
*/
var DECK = (function () {
  var tl = null, resetFn = null, pauseTimes = [], looping = false;

  var pages = window.DECK_PAGES || [];
  var here = location.pathname.split("/").pop() || "index.html";
  var idx = pages.indexOf(here);

  // ---- 16:9 stage scaling ----
  function fit() {
    var stage = document.querySelector(".stage");
    if (!stage) return;
    var s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    stage.style.transform = "translate(-50%, -50%) scale(" + s + ")";
  }
  window.addEventListener("resize", fit);

  // ---- controls ----
  var ICONS = {
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 9 8 9"/></svg>',
    loop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
  };
  var ui = {};
  function buildControls() {
    var bar = document.createElement("div");
    bar.id = "deck-controls";
    bar.innerHTML =
      '<button class="dbtn" id="dk-prev" title="previous page">' + ICONS.prev + "</button>" +
      '<div class="dpage" id="dk-page"></div>' +
      '<button class="dbtn" id="dk-next" title="next page">' + ICONS.next + "</button>" +
      '<div class="dsep"></div>' +
      '<button class="dbtn" id="dk-reset" title="restart this page">' + ICONS.reset + "</button>" +
      '<button class="dbtn" id="dk-loop" title="auto-play all steps, looping">' + ICONS.loop + "</button>";
    (document.querySelector(".stage") || document.body).appendChild(bar);
    bar.addEventListener("click", function (e) { e.stopPropagation(); });
    ui.prev = bar.querySelector("#dk-prev");
    ui.next = bar.querySelector("#dk-next");
    ui.page = bar.querySelector("#dk-page");
    ui.loop = bar.querySelector("#dk-loop");
    ui.reset = bar.querySelector("#dk-reset");
    ui.prev.onclick = prevPage;
    ui.next.onclick = nextPage;
    ui.reset.onclick = function () { reset(false); };
    ui.loop.onclick = toggleLoop;
    ui.prev.disabled = idx <= 0;
    ui.next.disabled = idx < 0 || idx >= pages.length - 1;
    updateUI();
  }

  function updateUI() {
    if (!ui.page) return;
    ui.page.textContent = (idx >= 0 ? idx + 1 : "?") + " / " + (pages.length || "?");
    var atEnd = tl && tl.progress() >= 1 && !looping;
    ui.page.classList.toggle("atend", !!atEnd);
  }

  // ---- step machinery ----
  function markStep(t) {
    var time = t.duration();
    pauseTimes.push(time);
    t.addPause(time, function () {
      if (looping) t.play();
      updateUI();
    });
    // spacer so the next step's zero-duration .call()s sit strictly AFTER the
    // pause point — otherwise GSAP fires them on the same frame the pause lands
    t.to({}, { duration: 0.02 });
  }

  function register(t, opts) {
    tl = t;
    resetFn = (opts && opts.reset) || null;
    tl.eventCallback("onComplete", function () {
      if (looping) {
        gsap.delayedCall(1.8, function () { if (looping) reset(true); });
      }
      updateUI();
    });
    tl.pause(0);
    fit();
    updateUI();
  }

  function advance() {
    if (!tl) { nextPage(); return; }
    if (tl.progress() >= 1) { nextPage(); return; }
    if (tl.paused()) {
      tl.play();
    } else {
      // impatient click mid-motion: jump to the end of the current step,
      // firing .call()s along the way so DOM state stays correct
      var now = tl.time();
      var next = null;
      for (var i = 0; i < pauseTimes.length; i++) {
        if (pauseTimes[i] > now + 0.01) { next = pauseTimes[i]; break; }
      }
      tl.pause();
      if (next !== null) tl.seek(next, false);
      else tl.seek(tl.duration(), false);
    }
    updateUI();
  }

  function prevStep() {
    if (!tl) return;
    if (looping) { looping = false; ui.loop && ui.loop.classList.remove("on"); }
    var now = tl.time();
    var target = 0;
    for (var i = 0; i < pauseTimes.length; i++) {
      if (pauseTimes[i] < now - 0.05) target = pauseTimes[i];
    }
    // rebuild from the start so .call() DOM mutations are correctly re-applied
    if (resetFn) resetFn();
    tl.pause(0);
    if (target > 0) tl.seek(target, false);
    updateUI();
  }

  function reset(andPlay) {
    if (!tl) return;
    if (!andPlay) { looping = false; ui.loop && ui.loop.classList.remove("on"); }
    if (resetFn) resetFn();
    tl.pause(0);
    if (andPlay) tl.play();
    updateUI();
  }

  function toggleLoop() {
    looping = !looping;
    ui.loop.classList.toggle("on", looping);
    if (looping && tl) {
      if (tl.progress() >= 1) reset(true);
      else if (tl.paused()) tl.play();
    }
    updateUI();
  }

  function nextPage() {
    if (idx >= 0 && idx < pages.length - 1) location.href = pages[idx + 1];
  }
  function prevPage() {
    if (idx > 0) location.href = pages[idx - 1];
  }

  // ---- input ----
  // A drag also ends in a click event; only treat press-and-release-in-place
  // as "advance" so draggable elements (e.g. the bucket game) don't conflict.
  var downX = 0, downY = 0, pressed = false, dragged = false;
  document.addEventListener("pointerdown", function (e) {
    pressed = true; dragged = false; downX = e.clientX; downY = e.clientY;
  });
  document.addEventListener("pointermove", function (e) {
    if (pressed && Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 8) dragged = true;
  });
  document.addEventListener("pointerup", function () { pressed = false; });
  document.addEventListener("click", function (e) {
    if (dragged) return;
    if (e.target.closest("a, button, #deck-controls, [data-no-advance]")) return;
    advance();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === " " || e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault(); advance();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault(); prevStep();
    } else if (e.key === "f" || e.key === "F") {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    }
  });

  document.addEventListener("DOMContentLoaded", function () { buildControls(); fit(); });

  // The manifest may be stale in the browser cache after a deploy (pages get
  // renamed/removed). Re-fetch it fresh in the background and correct the
  // navigation list if it changed — prevents "next page" pointing at a
  // deleted file.
  fetch("shared/manifest.js", { cache: "no-store" }).then(function (r) { return r.text(); })
    .then(function (txt) {
      var m = txt.match(/\[([^\]]*)\]/);
      if (!m) return;
      var fresh = (m[1].match(/"([^"]+)"/g) || []).map(function (s) { return s.slice(1, -1); });
      if (fresh.length && fresh.join() !== pages.join()) {
        pages = fresh;
        idx = pages.indexOf(here);
        if (ui.prev) ui.prev.disabled = idx <= 0;
        if (ui.next) ui.next.disabled = idx < 0 || idx >= pages.length - 1;
        updateUI();
      }
    }).catch(function () { /* file:// or offline — keep the baked-in list */ });

  return {
    register: register, markStep: markStep, advance: advance,
    prevStep: prevStep, reset: reset,
    _tl: function () { return tl; },   // for automated tests
  };
})();
