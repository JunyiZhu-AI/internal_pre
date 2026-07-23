/* Slides 16-17 shared data: quantization notation and the K3 recipe. */
var QT = {
  headline: "WxAy — W-bit weights · A-bit activations",

  wDial: {
    what: "W — weights: static, known offline → quantize aggressively (per-group scales, GPTQ/AWQ-style compensation)",
    buys: "buys bandwidth (decode re-reads every weight) + capacity (HBM footprint)",
  },
  aDial: {
    what: "A — activations: dynamic, outlier-prone → harder; usually 8 or 16 bits",
    buys: "buys compute — a matmul only runs on low-precision tensor cores when BOTH operands are cheap",
  },
  kvDial: { what: "third dial: KV-cache quantization (INT8/FP8 KV)", buys: "pure capacity — longer context, bigger batches" },

  // the taxonomy rows: [name, meaning, what it buys, note]
  rows: [
    ["W4A16", "INT4 weights · FP16 matmul", "bandwidth + capacity", "the serving default — no compute speedup"],
    ["W8A8 / FP8", "both operands 8-bit", "+ tensor-core compute", "native on Hopper / Blackwell"],
    ["MXFP4", "4-bit weights × 8-bit activations", "the frontier", "K3's recipe — next slide"],
    ["KV INT8/FP8", "quantized cache", "capacity only", "the third dial"],
  ],

  b200: "the hardware has dials too — one B200 die: 2,250 / 4,500 / 9,000 TFLOPS at BF16 / FP8 / FP4",

  // slide 17
  timeline: [
    ["PTQ", "compress AFTER training", "accept the loss"],
    ["FP8-native", "precision chosen BEFORE pretraining", "DeepSeek-V3"],
    ["QAT from SFT", "quantization INSIDE training", "K3: MXFP4 weights × MXFP8 activations"],
  ],
  micro: "microscaling: one shared scale per small block of values — what keeps 4-bit weights accurate",
  why: "vs FP8: 4-bit weights halve HBM footprint and decode bandwidth AGAIN — straight into token cost",
  takeaway: "At the frontier, precision is an architecture hyperparameter — co-designed, not a compression afterthought.",
  bridge: "Weights are now cheap to store — but decode still reads every one it uses. What if we used fewer of them per token? Enter MoE.",
};
