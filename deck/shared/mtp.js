/* Slide 23 shared data: MTP & speculative decoding. Single source of truth.
   H100 balance ≈ 295 comes from GPUS (989 TFLOPS / 3.35 TB/s) — compute, don't restate. */
var MTP = {
  serial: "decode is serial: one step, one token — and every step re-reads all active weights + KV",
  ai: "arithmetic intensity ≈ 1 FLOP/byte — the die idles",

  spec: {
    draft: "draft k tokens cheaply",
    verify: "verify all k in ONE forward pass — one weight read, k tokens checked",
    lossless: "lossless — the output distribution is unchanged; speedup is capped by the acceptance rate",
  },

  reframe: "a verify pass is a mini-prefill — one weight read amortised over k positions. MTP smuggles prefill's amortisation into the decode loop.",
  econ: "bytes per token ÷ ~k — the same bill quantization pays, by opposite means",
  unique: "the only technique that SPENDS idle compute to BUY bandwidth — rejected drafts are wasted FLOPs, and those FLOPs were free",

  caveats: [
    "a decode-regime weapon: at large batch, decode turns compute-bound — the gain shrinks or inverts",
    "raises decode-node arithmetic intensity → shifts the optimal P : D ratio",
  ],

  dsv3: {
    what: "DeepSeek-V3's MTP: train an extra module to predict the next-NEXT token — then reuse it as the drafter at inference",
    accept: "~85–90% acceptance reported",
    point: "inference acceleration designed into the architecture",
  },
};
