/* Slides 18-22 shared data: MoE and the systems layer.
   Single source of truth — real-world figures verified, K3-world figures
   (2.8T/41B, 896 experts, Stable LatentMoE) are the talk's fictional facts. */
var MOE = {
  // ---- slide 18: conditional computation ----
  mech: "every FFN → N expert FFNs + a router · each token runs top-k of them",
  decouple: {
    flops: "FLOPs / token follow ACTIVE params",
    quality: "capability follows TOTAL params (roughly)",
    arb: "MoE is the arbitrage between the two",
  },
  dual: {
    isoFlop: ["iso-FLOP — the researcher's view", "≈7× more parameters at equal compute", "Switch Transformer (k=1) · GLaM"],
    isoQuality: ["iso-quality — the operator's view (this talk's)", "dense-level capability at a fraction of the FLOPs", "Mixtral 8×7B ≈ Llama-2-70B quality at 13B active"],
    never: "not “same parameters” — total params go UP",
  },
  mixtral: { total: 47, active: 13, dense: 70, ratio: "≈5×" },  // B params
  whyEveryone: "capability is marketed in TOTAL params — the bill (training + decode) is computed in ACTIVE FLOPs",
  keepBoth: "decode still reads the active params from HBM — and stores ALL of them",

  // ---- slide 19: evolution ----
  axes: [
    ["finer experts", "split each expert into many small ones — more routing combinations, better specialization (DeepSeekMoE)"],
    ["shared expert", "one always-on expert carries common knowledge — routed experts specialize"],
    ["deeper sparsity", "more routed experts, near-constant active — the activation rate collapses"],
  ],
  evo: [
    { key: "v3", name: "DeepSeek-V3", year: 2024, total: 671, active: 37, routed: 256, topk: 8, shared: 1, color: "#3987e5" },
    { key: "k2", name: "Kimi K2", year: 2025, total: 1000, active: 32, routed: 384, topk: 8, shared: 1, color: "#6fb1ff" },
    { key: "k3", name: "Kimi K3", year: 2026, total: 2800, active: 41, routed: 896, topk: 16, shared: 1, color: "#2fd6b0", label: "Stable LatentMoE" },
  ],
  k3rate: "16 / 896 active ≈ 1.8%",
  interp: "the field is buying enormous capacity at near-constant per-token cost",

  // ---- slide 20: the hidden bill ----
  bill: {
    cap: "all 2.8T params must sit in HBM — even though ~98% are idle for any given token",
    capMath: "2.8T @ 4-bit ≈ 1.4 TB of weights → ≥ 8 B200s (192 GB) before KV or activations",
    spread: "the spilled experts must live somewhere — more GPUs, just to hold the model",
    frame: "MoE moved the bottleneck: compute → capacity",
    response: "the systems layer answers: Expert Parallelism, then Prefill–Decode disaggregation",
  },

  // ---- slide 21: expert parallelism ----
  ep: {
    what: "different experts on different GPUs — tokens are dispatched to their experts (all-to-all), computed, combined back",
    vsTP: [
      ["Tensor Parallelism", "splits EVERY matmul — an all-reduce every layer, latency-bound"],
      ["Expert Parallelism", "whole experts stay local — communication only at expert boundaries"],
    ],
    reality: "all-to-all is latency- and topology-sensitive → overlap it: while one micro-batch computes, the next one's tokens are in flight",
    codesign: "expert size, top-k, and group-limited routing are chosen to make EP cheap — the architecture serves the system",
  },

  // ---- slide 22: prefill–decode disaggregation ----
  pd: {
    honesty: "not an MoE trick — PD serves any LLM (Splitwise · DistServe · Mooncake). It answers the prefill/decode split, not MoE.",
    recap: [["prefill", "compute-bound", "TTFT"], ["decode", "bandwidth-bound", "TPOT"]],
    problem: "co-located, the two phases fight for the same GPU and couple their latency targets",
    how: "prefill workers build the KV cache → hand it over the interconnect → decode workers stream tokens",
    benefits: ["scale each pool independently", "per-phase parallelism & batching (different EP degrees)", "prefill spikes no longer stall decode"],
    cost: "the price: shipping KV caches across the network, fast",
    cache: "prefix caching + PD-aware routing: a cached prefix skips prefill entirely — the $0.30 / $3.00 cache-hit gap is this architecture showing through the rate card",
    vllm: "K3's team upstreamed prefix-caching work to vLLM — the economics and the engineering are one story",
  },
};
