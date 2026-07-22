/* Slide-01 data — single source of truth for all pricing-slide variants.
   List prices per 1M tokens, July 2026. Per-task arithmetic is consistent:
   output-tokens/task × output rate + small input remainder = measured cost. */
var PRICING = {
  models: [
    {
      key: "k3", name: "Kimi K3", color: "#2fd6b0",
      input: 3.00, cached: 0.30, output: 15.00,
      ctx: "1M", open: "Yes (Jul 27)",
      task: 0.94, outTokens: 60, inCost: 0.04,
    },
    {
      key: "sol", name: "GPT-5.6 Sol", color: "#3987e5",
      input: 5.00, cached: 0.50, output: 30.00,
      ctx: "~1M", open: "No",
      task: 1.04, outTokens: 30, inCost: 0.14,
    },
    {
      key: "fable", name: "Claude Fable 5", color: "#c98500",
      input: 10.00, cached: 1.00, output: 50.00,
      ctx: "1M", open: "No",
      task: 2.75, outTokens: 50, inCost: 0.25,
    },
  ],

  // vals: [k3, sol, fable]; best: index of winner; src: independent | vendor-run
  bench: [
    { label: "AA Intelligence Index", vals: [57, 59, 60], best: 2, src: "independent", max: 100 },
    { label: "SWE-bench Verified", vals: [93.4, 96.2, 95.0], best: 1, src: "independent", max: 100 },
    { label: "GPQA Diamond", vals: [93.5, 94.1, 92.6], best: 1, src: "independent", max: 100 },
    { label: "Terminal-Bench 2.1", vals: [88.3, 88.8, 84.6], best: 1, src: "vendor-run", max: 100 },
    { label: "SWE Marathon (long-horizon)", vals: [42.0, 39.0, 35.0], best: 0, src: "vendor-run", max: 100 },
    { label: "Frontend Code Arena", vals: ["#1", "#2", "#3"], best: 0, src: "arena", max: null },
  ],

  questions: [
    "Why is output 5× more expensive than input — for every vendor?",
    "Why is a cache hit 10× cheaper than a miss?",
    "Why does competing at $3 / $15 take 2.8T params, KDA, and 1M context?",
  ],

  quote: "“K3 is half the price per token; GPT-5.6 uses half as many tokens. Price evens out.”",
  quoteBy: "— Theo Browne",
  footnote: "⚠ vendor-run rows: each model in its own harness. Independent rows (AA, SWE-bench Verified) tell a soberer story — that tension is part of the cost discussion.",
  promise: "By the end of this talk, every number on this slide is explainable from first principles.",

  fmt$: function (x) { return "$" + x.toFixed(2); },
};
