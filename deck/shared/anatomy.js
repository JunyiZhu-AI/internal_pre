/* Slide-05 shared data — Transformer anatomy. */
var TA = {
  tokens: [["K", 42], ["3", 18], ["char", 7742], ["ges", 921], ["$", 400], ["3", 18], ["per", 583], ["mill", 3211], ["ion", 245], ["tok", 1151], ["ens", 729]],
  nextDist: [[".", 0.36], ["—", 0.22], ["only", 0.14], ["!", 0.07]],
  caption: "Every technique tonight modifies one of these two machines.",
  attnNote: "compute ∝ n² · KV state ∝ n",
  ffnNote: "per token — sequence-length independent",
  kvTag: "cached at inference →",
  flashTag: "n×n scores — FlashAttention, later",
  moeTag: "MoE replaces this, later",
  price: "$3.00 / 1M",
  split: [["attention", 1 / 3, "#3987e5"], ["FFN", 2 / 3, "#c98500"]],

  chipHTML: function (t) {
    return '<div class="ta-chip"><span class="tt">' + t[0] + '</span><span class="tid">' + t[1] + "</span></div>";
  },
};
