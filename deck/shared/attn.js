/* Single source of truth for the attention example used by every style variant.
   4 tokens, d_k = 3. All downstream matrices are COMPUTED here, so every
   variant shows the same, correct numbers. */
var ATTN = (function () {
  var tokens = ["The", "robot", "lifts", "boxes"];
  var dk = 3;

  // Hand-picked so the attention pattern is peaky and plausible
  // (robot->robot/boxes, lifts->boxes/lifts, boxes->boxes).
  var Q = [
    [0.3, 0.1, 0.2],
    [0.6, 1.9, 0.2],
    [0.3, 1.5, 1.6],
    [1.6, 1.4, 0.4],
  ];
  var K = [
    [1.2, -0.4, 0.1],
    [0.2, 1.3, -0.2],
    [-0.3, 0.4, 1.1],
    [0.9, 0.8, 0.6],
  ];
  var V = [
    [0.9, 0.1, 0.2],
    [0.1, 1.0, 0.3],
    [0.2, 0.3, 1.0],
    [0.8, 0.7, 0.1],
  ];

  function transpose(M) {
    return M[0].map(function (_, j) { return M.map(function (row) { return row[j]; }); });
  }
  function matmul(A, B) {
    return A.map(function (row) {
      return B[0].map(function (_, j) {
        return row.reduce(function (s, a, k) { return s + a * B[k][j]; }, 0);
      });
    });
  }
  function softmaxRow(row) {
    var m = Math.max.apply(null, row);
    var ex = row.map(function (x) { return Math.exp(x - m); });
    var sum = ex.reduce(function (a, b) { return a + b; }, 0);
    return ex.map(function (e) { return e / sum; });
  }

  var KT = transpose(K);                       // 3x4
  var Sraw = matmul(Q, KT);                    // 4x4 unscaled logits
  var scale = 1 / Math.sqrt(dk);
  var S = Sraw.map(function (r) { return r.map(function (x) { return x * scale; }); });
  var A = S.map(softmaxRow);                   // 4x4 row-stochastic
  var O = matmul(A, V);                        // 4x3 output

  // ---- shared formatting / color helpers ----
  function fmt(x, d) { return x.toFixed(d === undefined ? 2 : d); }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function mix(c1, c2, t) {
    return "rgb(" + Math.round(lerp(c1[0], c2[0], t)) + "," +
      Math.round(lerp(c1[1], c2[1], t)) + "," + Math.round(lerp(c1[2], c2[2], t)) + ")";
  }
  // Sequential (attention weights 0..1): one aqua hue, dim -> bright on dark surface.
  function weightColor(w) { return mix([21, 32, 43], [47, 214, 176], Math.min(1, Math.max(0, w))); }
  // Diverging (raw logits): cool blue (neg) <-> neutral <-> warm orange (pos).
  function scoreColor(x, maxAbs) {
    maxAbs = maxAbs || 3;
    var t = Math.min(1, Math.abs(x) / maxAbs);
    return x >= 0 ? mix([42, 46, 59], [217, 89, 38], t) : mix([42, 46, 59], [57, 135, 229], t);
  }
  // Ink that stays readable on top of weightColor(w) cells.
  function inkFor(w) { return w > 0.55 ? "#0c1116" : "#c7cce0"; }

  // Build a matrix as a CSS grid of .cell divs; opts: {digits, colorFn, cls}
  function buildMatrix(container, M, opts) {
    opts = opts || {};
    container.classList.add("matrix");
    container.style.gridTemplateColumns = "repeat(" + M[0].length + ", auto)";
    M.forEach(function (row, i) {
      row.forEach(function (x, j) {
        var c = document.createElement("div");
        c.className = "cell" + (opts.cls ? " " + opts.cls : "");
        c.dataset.i = i; c.dataset.j = j;
        c.textContent = fmt(x, opts.digits);
        if (opts.colorFn) {
          c.style.background = opts.colorFn(x);
          c.style.color = opts.inkFn ? opts.inkFn(x) : "";
        }
        container.appendChild(c);
      });
    });
    return container;
  }

  return {
    tokens: tokens, dk: dk, scale: scale,
    Q: Q, K: K, V: V, KT: KT, Sraw: Sraw, S: S, A: A, O: O,
    transpose: transpose, matmul: matmul, softmaxRow: softmaxRow,
    fmt: fmt, mix: mix, weightColor: weightColor, scoreColor: scoreColor,
    inkFor: inkFor, buildMatrix: buildMatrix,
  };
})();
