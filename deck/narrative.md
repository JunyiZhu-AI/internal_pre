# Deck narrative

One section per page; one numbered beat per **click**. Speak the beat, then click —
the motion that follows illustrates what you just said (or click first and speak
over the motion; each step is short enough for either). "Load" is what's on screen
before any click.

Controls reminder: click / Space / → / PageDown = next step; the click after the
last step goes to the next page. ← / PageUp = back one step (instant). Page
switching is via the on-screen arrow icons only. Bottom-right: page arrows,
restart, loop (auto-plays all steps, for rehearsal or hallway mode). F = fullscreen.

---

## Page 01 — Everyone Is Talking About K3's Token Cost

**Load:** title only.

1. **[rate card cascades, K3 column glows]** "In July, Moonshot launched Kimi
   K3 at three dollars in, fifteen out — half of GPT-5.6 Sol's rate card, a
   third of Fable 5's. A Chinese lab pricing *at* flagship rates was itself
   the news. On paper: frontier capability at a discount."

2. **[performance table slides in, near-tie]** "And the capability story
   holds up — mostly. On the independent numbers, it's a near-tie at the top:
   two to three points of AA index, a few points of SWE-bench. The agentic
   rows are vendor-run — each model in its own harness — so hold them more
   loosely; the tension between those two kinds of numbers is part of
   tonight's story."

3. **[red discount stamps hit the K3 price column]** "So per *token*, K3
   looks like a steal: forty percent under Sol, seventy under Fable."

4. **[Q1 appears, ? lands on output price]** "So here's the first question
   this rate card begs: why is output five times the price of input — for
   *every* vendor? That ratio is suspiciously universal."

5. **[Q2 appears, ? lands on cached input]** "Second: why does a cache hit
   cost ten times less than a miss? Ninety percent off, from all three
   vendors, again."

6. **[Q3 appears, ? lands on K3 column]** "And third: what does it take to
   *afford* three-and-fifteen? K3's answer is 2.8 trillion parameters, a new
   attention mechanism, a million tokens of context. Why those choices —
   what physics connects this architecture to this price?"

7. **[promise]** "That's the talk: token cost is physics, not marketing. By
   the end, every number on this slide will be explainable from first
   principles — and we'll come back and read this table again."

*(final click → next page)*

---

## Page 02 — Hardware framework and efficient algorithms

*The same 7 beats drive all three candidate variants (a: bucket board,
b: quadrant map, c: circuit anatomy).*

**Load:** title only (variant c: the dimmed GPU anatomy is already visible).

1. **[compute lights up]** "Four numbers govern every inference deployment,
   and everything tonight reduces to them. First: compute — FLOP/s, the raw
   arithmetic. Prefill lives here: chewing through a million-token prompt is
   one giant, beautifully parallel matmul."

2. **[bandwidth lights up]** "Second: memory bandwidth — bytes per second
   between HBM and the cores. Decode lives here: every single generated token
   re-reads the weights and the KV cache. This one line explains most of
   tonight's rate card."

3. **[capacity lights up]** "Third: memory capacity — the gigabytes that
   weights plus KV cache must fit into. Capacity doesn't make you slow; it
   decides how many GPUs you must buy before you serve a single request."

4. **[communication lights up]** "And fourth: communication — once the model
   no longer fits one GPU, every token crosses interconnect, and the network
   between GPUs becomes part of the model."

5. **[framing line]** "So here's the framing for everything that follows:
   every technique you'll see today is a way to pay one of these four bills —
   and quite often, a way to move a cost from one bill to another."

6. **[locked toolkit appears]** "And here's tonight's toolkit: FlashAttention,
   GQA, MLA, KDA, quantization, MoE, expert parallelism, prefill–decode
   disaggregation, multi-token prediction. These names mean nothing yet —
   that's deliberate. By the end of the talk, you'll sort them into these
   four buckets yourselves."

7. **[decode simulator powers on]** "One more thing before we start: this
   screen. It's a decode stream running at K3's launch-day speed — our
   speedometer. Keep an eye on it; every section that follows will make it
   faster."

*(final click → next page)*

---

## Template page — QKᵀ: where attention scores come from

**Load:** title only; empty score grid awaits.

1. **[operands arrive]** "We have four tokens — *The robot lifts boxes*. Each one
   carries a query vector, stacked into Q, and a key vector — here already
   transposed into Kᵀ, keys as columns. d_k is 3, so we can watch every single
   number."

2. **[first cell, slow]** "One score, in slow motion: the query row for *The*
   slides against the key column for *The*. Multiply the aligned entries —
   0.3·1.2, 0.1·(−0.4), 0.2·0.1 — sum them: 0.34. That's all a similarity score
   is: one dot product."

3. **[second cell]** "Next cell, same move — different column. Row times column,
   every time."

4. **[cascade]** "And the other fourteen are identical and independent — which is
   exactly why this is one dense matrix multiplication, and why hardware eats it
   for breakfast. Sixteen scores: every query against every key, in one GEMM."

5. **[÷√d]** "Before softmax, everything shrinks by √d_k. Dot products of random
   d-dimensional vectors grow in variance with d; unscaled, the logits saturate
   softmax into near one-hot and the gradients die. At d_k = 3 it's a nudge — at
   64 it's survival."

6. **[softmax rows]** "Softmax, row by row: scores become weights, each row now
   sums to one. The grid you just watched being multiplied *is* the attention
   pattern — *robot* attends to itself and to *boxes*; *The* spreads out almost
   uniformly, as function words do."

*(final click → next page)*
