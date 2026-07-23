/* Slides 09-15 shared data: the attention-evolution lineage.
   One thread metric everywhere: KV bytes per decoded token x quality. */
var EV = {
  nodes: [
    { key: "mha", name: "MHA", sub: "baseline", bytes: "2.6 MB", color: "#6b7284" },
    { key: "gqa", name: "MQA / GQA", sub: "share KV heads", bytes: "330 KB", color: "#3987e5" },
    { key: "mla", name: "MLA", sub: "low-rank latent", bytes: "~70 KB", color: "#6fb1ff" },
    { key: "sparse", name: "Sparse", sub: "fewer tokens", bytes: "≤ window", color: "#e0a935" },
    { key: "linear", name: "Linear / SSM", sub: "fixed-size state", bytes: "O(1) state", color: "#2fd6b0" },
    { key: "hybrid", name: "Hybrid", sub: "linear + full mix", bytes: "", color: "#9085e9" },
    { key: "kda", name: "KDA", sub: "per-channel gates", bytes: "~tens of KB", color: "#e04b38" },
  ],

  metric: "judged by one metric: KV bytes / token × quality retention",
  story: "seven years, one continuous story: fewer bytes per decoded token — same quality",

  // per-technique facts
  gqa: {
    mhaHeads: 64, kvHeads: 8, factor: 8,
    note: "Llama-3-70B: 64 query heads share 8 KV heads → cache ÷ 8",
    already: "slide 08's 0.33 MB/token already had GQA inside — without it: 2.6 MB",
    adopters: "the default compromise: Llama · Mistral · Gemma",
    pattern: "the first architecture knob turned purely for inference economics",
  },
  mla: {
    latent: "c_t: rank ≈ 512 + 64 RoPE dims",
    bytes: "~70 KB / token — an order of magnitude below GQA",
    absorb: "up-projection absorbed into W_Q / W_O → zero extra decode compute",
    adopters: "DeepSeek-V2/V3 · Kimi K2 · K3's full-attention layers (gated MLA)",
    framing: "not a detour — both history and part of the SOTA endpoint",
  },
  sparse: {
    window: "sliding window: attend to the last w tokens — cache bounded by w",
    learned: "learned selection: NSA (compress + select + local) · MoBA (block gating)",
    evict: "outside the window/blocks, KV can be evicted → capacity win at long context",
    tradeoff: "selection is discrete — it can miss; long-range recall needs care",
  },
  linear: {
    recur: "drop softmax → attention becomes a linear RNN: Sₜ = Sₜ₋₁ + vₜkₜᵀ",
    state: "decode touches a fixed d×d state — not the history",
    ssm: "the SSM branch: Mamba — selective state spaces, hardware-efficient scan",
    delta: "DeltaNet: delta-rule write (error-correcting, not accumulating) · Gated DeltaNet adds forgetting",
    catch: "a fixed state cannot hold an unbounded past → recall gap → hybrids",
  },
  kda: {
    from: "Gated DeltaNet: delta write + one scalar forget gate per head",
    upgrade: "KDA: the gate goes channel-wise — every memory channel forgets at its own rate",
    plumbing: "short conv for local context · chunked, hardware-efficient kernels",
    home: "the linear layers of Kimi Linear — and K3's backbone, paired with gated MLA",
    position: "attacks decode bandwidth (fixed state) AND capacity (tiny cache) at 1M context",
  },
  payoff: {
    kvcut: "≈ 75% KV cache reduction (3:1 hybrid + MLA)",
    speed: "6.3", speedLabel: "× decode throughput at 1M context",
    quality: "quality parity or better on long-context benchmarks",
    ladder: [["MHA", "2.6 MB"], ["GQA", "330 KB"], ["MLA", "~70 KB"], ["hybrid-KDA", "~tens of KB"]],
    bridge: "context scaling: fixed. Next: shrink the weights themselves — quantization.",
  },

  // compact recurring mini-map strip (slides 10-15). activeIdx: index into nodes.
  mapStrip: function (host, activeIdx) {
    host.classList.add("ev-strip");
    EV.nodes.forEach(function (n, i) {
      var d = document.createElement("div");
      d.className = "ev-sn" + (i < activeIdx ? " done" : i === activeIdx ? " on" : "");
      d.innerHTML = '<i style="background:' + (i <= activeIdx ? n.color : "#2a2e3b") + '"></i><span>' + n.name + "</span>";
      host.appendChild(d);
      if (i < EV.nodes.length - 1) {
        var s = document.createElement("b");
        s.className = "ev-seg" + (i < activeIdx ? " done" : "");
        host.appendChild(s);
      }
    });
  },
};
