/* Slides 24-25 shared data: the completed map + the closing rate card.
   The nine techniques are BN.techniques (same cards as slide 02) — the map
   rows below add the summary columns, keyed by the same abbreviations. */
var CL = {
  // abbr → [bottleneck attacked, stage, in K3?]
  map: {
    "FA":        ["bandwidth — attention IO", "prefill + training", "✓ as kernels"],
    "GQA":       ["KV capacity + bandwidth", "decode", "lineage → MLA"],
    "MLA":       ["KV capacity + bandwidth", "decode", "✓ gated MLA"],
    "KDA":       ["KV capacity + bandwidth", "decode · long ctx", "✓ 3 : 1 hybrid"],
    "FP8 / INT4":["bandwidth + capacity (weights, KV)", "decode", "✓ MXFP4 QAT (expert weights)"],
    "MoE":       ["compute — FLOPs / token", "training + decode", "✓ Stable LatentMoE 896/16"],
    "EP":        ["capacity → communication", "training + decode", "✓ MoonEP"],
    "PD":        ["workload mismatch · KV reuse", "serving", "✓ + prefix cache"],
    "MTP":       ["bandwidth per token — amortisation", "decode", "✓ 1 MTP layer · EAGLE-3 draft"],
  },
  tableNote: "the empty board from the opening, now filled",

  // on-screen speedup is capped for legibility; true factors go in a corner caption
  speedCap: 8,
  trueFactors: "true factors — attention arc ~6× decode (reported) · quant ÷2 bytes again · MTP ÷k",

  // ---- slide 25: the rate card, annotated ----
  receipt: [
    ["input", "$3.00", "prefill is compute-bound — you pay for FLOPs on uncached context"],
    ["cached input", "$0.30", "prefix-cache hit: no prefill compute, the KV already exists → 10×"],
    ["output", "$15.00", "decode is bandwidth-bound and serial — the hardest to scale → 5× input"],
  ],
  answers: [
    ["Q1", "how can a 2.8-trillion-parameter model sell tokens this cheap?", "because every layer — KDA · MLA · MoE · MXFP4 · EP · PD — was co-designed to push these two numbers down"],
    ["Q2", "why is output 5× input — for every vendor?", "decode pays per token in bandwidth; prefill amortises — the roofline, invoiced"],
    ["Q3", "why is a cache hit 10× cheaper?", "prefix caching — a hit skips prefill entirely; PD-style serving makes cached KV shared and routable, so the discount holds at scale"],
  ],
  pattern: "the price sheet is the physics of this talk, invoiced",
  open: [
    "pure-linear futures — does the KV cache disappear?",
    "hardware that rebalances the roofline — does the memory wall move?",
    "Jevons paradox — cheaper tokens, more tokens?",
  ],
  thanks: "Thank you — questions?",
  replay: { label: "⟲ replay the bucket game", href: "02-bottlenecks.html" },
};
