/* Slide-02 data — the four bottlenecks, the technique roster, and a small
   decode-simulator widget reused across slides (the talk's "speedometer"). */
var BN = {
  list: [
    { key: "compute", name: "Compute", unit: "FLOP/s", dom: "dominated by prefill", color: "#3987e5", desc: "raw arithmetic — the matmuls themselves" },
    { key: "bw", name: "Memory bandwidth", unit: "bytes/s", dom: "dominated by decode", color: "#2fd6b0", desc: "streaming weights + KV from HBM to the cores" },
    { key: "cap", name: "Memory capacity", unit: "GB", dom: "weights + KV cache", color: "#c98500", desc: "what has to fit on the GPUs at all" },
    { key: "comm", name: "Communication", unit: "link GB/s", dom: "multi-GPU serving", color: "#9085e9", desc: "GPU ↔ GPU interconnect traffic" },
  ],

  techniques: [
    ["FlashAttention", "FA"],
    ["Grouped-Query Attention", "GQA"],
    ["Multi-head Latent Attention", "MLA"],
    ["Kimi Delta Attention", "KDA"],
    ["Quantization", "FP8 / INT4"],
    ["Mixture-of-Experts", "MoE"],
    ["Expert Parallelism", "EP"],
    ["Prefill–Decode Disaggregation", "PD"],
    ["Multi-Token Prediction", "MTP"],
  ],

  framing: "Every technique you'll see today is a way to pay one of these four bills — sometimes by moving the cost to another one.",
  teaser: "These names mean nothing yet. By the end, you'll sort them yourselves.",

  // animated icon markup per bottleneck (styles in bottlenecks.css)
  iconHTML: function (key) {
    if (key === "compute") return '<div class="bn-icon"><div class="bni-chip"></div></div>';
    if (key === "bw") return '<div class="bn-icon"><div class="bni-pipe"><i></i><i></i><i></i><i></i><i></i></div></div>';
    if (key === "cap") return '<div class="bn-icon"><div class="bni-ram"><i></i></div></div>';
    return '<div class="bn-icon"><svg class="bni-nodes" viewBox="0 0 84 64">' +
      '<line x1="14" y1="14" x2="70" y2="14"/><line x1="14" y1="14" x2="14" y2="50"/>' +
      '<line x1="14" y1="14" x2="70" y2="50"/><line x1="70" y1="14" x2="14" y2="50"/>' +
      '<line x1="70" y1="14" x2="70" y2="50"/><line x1="14" y1="50" x2="70" y2="50"/>' +
      '<circle cx="14" cy="14" r="7"/><circle cx="70" cy="14" r="7"/>' +
      '<circle cx="14" cy="50" r="7"/><circle cx="70" cy="50" r="7"/></svg></div>';
  },

  simWords: ("Sure — I'll refactor the auth module. First, reading src/auth/session.ts to trace the " +
    "token flow through refresh. Found it: the refresh path drops the expiry claim, so " +
    "validate() accepts stale sessions. Patching validate() to re-check exp, wiring the " +
    "claim through rotate(), and adding a regression test for the 31-day boundary. " +
    "Running the suite… 42 passed, 0 failed. Committing and opening the PR. ").split(/\s+/),

  buildSim: function (host, opts) {
    opts = opts || {};
    host.classList.add("sim");
    var main = '<div class="sim-main"><div class="sim-head"><span class="sim-dot"></span>' +
      'decode — <b class="sim-rate">0.0</b> tok/s <span class="sim-badge">baseline ×1.0</span></div>' +
      '<div class="sim-screen"></div></div>';
    var ghost = '<div class="sim-ghost"><div class="sim-head">launch speed (reference)</div><div class="sim-screen"></div></div>';
    host.innerHTML = (opts.ghost ? ghost : "") + main;
    var screens = [].slice.call(host.querySelectorAll(".sim-screen"));
    var rateEl = host.querySelector(".sim-rate");
    var iv = null, rateIv = null, idx = 0;
    function start() {
      stop();
      iv = setInterval(function () {
        var w = BN.simWords[idx++ % BN.simWords.length] + " ";
        screens.forEach(function (s) {
          var sp = document.createElement("span");
          sp.textContent = w;
          s.appendChild(sp);
          while (s.childNodes.length > 90) s.removeChild(s.firstChild);
          s.scrollTop = s.scrollHeight;
        });
      }, 55);
      rateIv = setInterval(function () {
        rateEl.textContent = (17.5 + Math.random() * 1.8).toFixed(1);
      }, 400);
    }
    function stop() {
      if (iv) { clearInterval(iv); iv = null; }
      if (rateIv) { clearInterval(rateIv); rateIv = null; }
      screens.forEach(function (s) { s.innerHTML = ""; });
      if (rateEl) rateEl.textContent = "0.0";
      idx = 0;
    }
    return { start: start, stop: stop };
  },
};
