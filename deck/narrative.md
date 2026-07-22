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

## Page 01 — Half the price. The same bill. (K3 pricing paradox)

*The same 8 beats drive all three candidate variants (a: receipts, b: equation,
c: ledger); the bracketed cue names what moves on screen in each.*

**Load:** title only.

1. **[a: receipts print · b: price bars · c: rate table cascades]** "In July,
   Moonshot launched Kimi K3 at three dollars in, fifteen out — half of GPT-5.6
   Sol's rate card, a third of Fable 5's. A Chinese lab pricing *at* flagship
   rates was itself the news. On paper: frontier capability at a discount."

2. **[a/c: benchmark panel, near-tie · b: (comes 4th)]** "And the capability
   story holds up — mostly. On the independent numbers, it's a near-tie at the
   top: two to three points of AA index, a few points of SWE-bench. The
   agentic rows are vendor-run — each model in its own harness — so hold them
   more loosely; the tension between those two kinds of numbers is part of
   tonight's story."

3. **[a: −40%/−70% stamps · b: tokens-per-task bars · c: per-token callout]**
   "So per *token*, K3 is a steal: forty percent under Sol, seventy under
   Fable." *(variant b: "But watch the second line: on the same agentic task,
   K3 generates about twice the tokens Sol does — and decodes two to four
   times slower.")*

4. **[all: the convergence — measured $/task lands, K3 ≈ Sol]** "Then
   developers ran real workloads, and something odd happened: the bills came
   out nearly identical. Ninety-four cents a task versus a dollar four. K3
   talks twice as much, at half the rate — Theo Browne's viral verdict:
   'Price evens out.' Though note — against Fable it genuinely *is* three
   times cheaper per task."

5. **[Q1 appears, ? lands on output price]** "So here's the first question
   this rate card begs: why is output five times the price of input — for
   *every* vendor? That ratio is suspiciously universal."

6. **[Q2 appears, ? lands on cached input]** "Second: why does a cache hit
   cost ten times less than a miss? Ninety percent off, from all three
   vendors, again."

7. **[Q3 appears, ? lands on K3 column]** "And third: what does it take to
   *afford* three-and-fifteen? K3's answer is 2.8 trillion parameters, a new
   attention mechanism, a million tokens of context. Why those choices —
   what physics connects this architecture to this price?"

8. **[promise]** "That's the talk: token cost is physics, not marketing. By
   the end, every number on this slide will be explainable from first
   principles — and we'll come back and read this table again."

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
