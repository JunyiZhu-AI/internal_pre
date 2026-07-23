/* Slide-03 data — GPU spec trajectory and machine balance.
   All TFLOPS are BF16 DENSE (marketing figures are 2:4 sparse). */
var GPUS = {
  list: [
    { key: "a100", name: "A100", gen: "Ampere · 2020", tflops: 312, bw: 2.0, cap: 80, hbm: "HBM2e", color: "#6b7284" },
    { key: "h100", name: "H100", gen: "Hopper · 2022", tflops: 989, bw: 3.35, cap: 80, hbm: "HBM3", color: "#3987e5" },
    { key: "h200", name: "H200", gen: "Hopper refresh · 2024", tflops: 989, bw: 4.8, cap: 141, hbm: "HBM3e", color: "#6fb1ff" },
    { key: "b200", name: "B200", gen: "Blackwell · 2024", tflops: 2250, bw: 8.0, cap: 192, hbm: "HBM3e", color: "#2fd6b0" },
    { key: "b300", name: "B300", gen: "Blackwell Ultra · 2025", tflops: 3500, bw: 8.0, cap: 288, hbm: "HBM3e", color: "#c98500", approx: true },
  ],

  balance: function (g) { return Math.round(g.tflops / g.bw); },

  precision: [["BF16", 2250], ["FP8", 4500], ["FP4", 9000]],  // B200 dense

  nvl72: {
    name: "GB200 NVL72",
    gpus: 72, hbm: "13.8 TB HBM", aggBw: "~576 TB/s aggregate",
    nvlink: "1.8 TB/s NVLink-5 per GPU (2× Hopper)",
  },

  divergence: "A100 → B200: compute ×7.2 · bandwidth ×4.0",
  h200note: "same FLOPs · +43% bandwidth · +76% capacity",
  rubin: "next: Rubin + HBM4, H2 2026 ⚠ — the divergence continues",
  punchline: "Six years, four architectures: the balance point stays pinned at 150–440 FLOPs/byte. LLM decode runs at AI ≈ 1.",
  cliffhanger: "inference lives on both sides of this roof — where does decode sit?",
  sparse: "all TFLOPS BF16 dense — marketing numbers are 2:4 sparse",
};
