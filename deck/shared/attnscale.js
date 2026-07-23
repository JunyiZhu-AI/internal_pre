/* Slides 06-08 shared data: attention scaling + KV cache arithmetic. */
var AS = {
  presets: [
    { lab: "1k", n: 1024 },
    { lab: "8k", n: 8192 },
    { lab: "128k", n: 131072 },
    { lab: "1M", n: 1048576 },
  ],
  hbmGB: 80,                                   // H100 for scale reference

  entries: function (n) { return n * n; },
  sGB: function (n) { return n * n * 2 / 1e9; },   // BF16, one head

  fmtN: function (x) {
    if (x >= 1e12) return (x / 1e12).toFixed(1) + " T";
    if (x >= 1e9) return (x / 1e9).toFixed(1) + " B";
    if (x >= 1e6) return (x / 1e6).toFixed(1) + " M";
    return Math.round(x / 1e3) + " k";
  },
  fmtGB: function (gb) {
    if (gb >= 1000) return (gb / 1000).toFixed(1) + " TB";
    if (gb >= 1) return gb.toFixed(gb < 10 ? 1 : 0) + " GB";
    return Math.round(gb * 1000) + " MB";
  },

  // naive attention HBM traffic: 4 passes over an n x n matrix (write S,
  // read S for softmax, write P = softmax(S), read P for PV), BF16
  naiveBytesGB: function (n) { return 4 * n * n * 2 / 1e9; },
  // flash: Q,K,V,O streamed once, d=128, BF16 (order-n)
  flashBytesGB: function (n) { return 4 * n * 128 * 2 / 1e9; },

  // KV cache (Llama-3-70B with GQA)
  kvTerms: [["2", "K and V"], ["80", "layers"], ["8", "KV heads"], ["128", "head dim"], ["2 B", "BF16"]],
  kvPerTokMB: 2 * 80 * 8 * 128 * 2 / 1e6,      // 0.328 MB / token
  kvGB: function (n) { return 2 * 80 * 8 * 128 * 2 * n / 1e9; },

  sin: "FLOPs ∝ n² and bytes ∝ n² — the original sin of attention",
  flashLesson: "Count bytes, not FLOPs.",
  flashVerdict: "same numerics · 2–4× faster · the default kernel everywhere",
  kvPunch: "Every factor is an architecture knob — that is the next section.",
};
