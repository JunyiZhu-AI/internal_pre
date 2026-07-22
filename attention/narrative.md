# Narrative — Attention style lab

This is the speaker script that accompanies the eight style variants. Each section is
written to be spoken over that variant's animation loop; cues in *[brackets]* mark the
moment in the animation the sentence belongs to. All variants use the same worked
example — the sequence **"The robot lifts boxes"** with d_k = 3 — so the numbers you
say out loud are the numbers on screen.

Audience: ML practitioners. The script assumes they know what embeddings and matrix
products are, and spends its words on *why* each step exists.

---

## 1 · Dataflow pipeline

*[Q, K, V matrices appear]* Every token's embedding is projected three ways — a query,
a key, and a value. Same input, three learned linear maps: W_Q, W_K, W_V.

*[wires draw toward S]* Queries and keys meet in a single matrix product. S = QKᵀ over
√d_k: sixteen numbers, each one the dot product of a query row with a key row — "how
relevant is token j to token i," for every pair, in one GEMM. That's the whole trick:
relevance scoring is not a loop, it's a matmul.

*[softmax chip, A appears]* Softmax runs along each row, so every query ends up with a
probability distribution over the keys — each row of A sums to exactly one.

*[output appears]* And the second matmul, A·V, spends those probabilities: every output
row is a convex combination of value rows. Two matrix multiplications with a softmax
between them — that is the entire mechanism.

## 2 · Matmul close-up

*[first cell computes slowly]* Let's slow the first cell all the way down. The query row
for "The" slides against the key column for "The": multiply the aligned entries —
0.3·1.2, 0.1·(−0.4), 0.2·0.1 — and sum. One score: 0.34. That is all a "similarity"
is here.

*[cells fill rapidly]* Every other cell is the same move with a different row–column
pair, and they're all independent — which is why the hardware loves this and why
attention scales as one dense n×n product.

*[÷√d sweep]* Before softmax, everything shrinks by √d_k. Dot products of random
d-dimensional vectors have variance that grows with d; without this correction the
logits blow up and softmax saturates to near one-hot — tiny gradients, dead heads.

*[rows morph to weights]* Then softmax, row by row: scores become weights, and the
grid you just watched being multiplied *is* the attention pattern.

## 3 · Softmax anatomy

*[row highlighted, logit bars]* Take one query — "robot" — and its four scaled scores.
Positive, negative, whatever: they're just logits.

*[exp bars spring]* Exponentiation does two jobs: it makes everything positive, and it
amplifies gaps — a score that's larger by one becomes e times heavier.

*[unit bar fills]* Dividing by the sum squeezes those magnitudes into a unit
interval — a genuine probability distribution over keys. Watch the segments: "robot"
keeps 0.42 of the mass, "boxes" takes 0.34, and the rest is nearly ignored.

*[A row fills in]* Do that for every row and you have A: a row-stochastic matrix. Every
downstream mixing step inherits that guarantee — outputs stay inside the convex hull
of the values.

## 4 · Token graph

*[arcs draw from a query]* Forget matrices for a second: attention is a directed,
weighted graph over the sequence. Each query token sends an edge to every key, and the
edge weight is exactly the entry A_ij you saw computed before.

*[thick vs thin edges]* Look at "lifts": its heaviest edges go to "boxes" and to
itself — the verb pulls in its argument. Thin edges aren't zero; softmax never gives an
exact zero, it just starves them.

*[matrix row highlight]* The graph and the heatmap are the same object — a row of A is
one node's out-edges. This is also why attention is O(n²): it's a complete graph.

*[mix bar]* And the output for that token is the value vectors flowing back along the
edges, each scaled by its weight — 0.36·v(boxes) + 0.33·v(lifts) + the small remainders.

## 5 · Formula first

*[QKᵀ lit]* One line, four ideas. First: QKᵀ — all pairwise query–key dot products in
a single product. Similarities, en masse.

*[√d lit, two bar groups]* Second, the part everyone forgets to motivate: √d_k. Same
row of scores, softmaxed raw versus scaled — raw is already sharper at d_k = 3, and at
d_k = 64 the unscaled version collapses to one-hot. The scale keeps softmax in its
useful, differentiable regime.

*[softmax lit]* Third: softmax makes each row a distribution — attention weights are
not learned parameters; they're computed fresh from the content, every forward pass.

*[V collapse]* Fourth: multiply by V, and the weighted value rows collapse into the
output — for "lifts", mostly value of "boxes" plus its own. Content-dependent routing,
in one differentiable line.

## 6 · Isometric scene

*[slabs arrive]* Three tensors enter: queries, keys, values — same shape, different jobs.

*[K flips]* The transpose isn't bookkeeping; it's what lets one matmul compare
everything against everything: keys turn their feature axis toward the queries.

*[collision → S]* Q meets Kᵀ, and the score slab materializes between them — the
geometry of the diagram *is* the shape arithmetic: (4×3)·(3×4) → 4×4.

*[softmax sweep]* A softmax wave runs the rows: heat becomes weight.

*[V docks, output rises]* Values dock against the weights, and the output lifts off the
floor — same shape as the input embeddings, ready for the residual stream. That closure
is the point: attention is shape-preserving, so you can stack it.

## 7 · Terminal

*[first command types]* The honest version: the whole mechanism is three lines.

*[S prints]* `S = Q @ K.T / sqrt(d_k)` — one line, sixteen dot products. Watch the
numbers land: these are real values from real 3-d vectors, not an artist's impression.

*[A prints, cells glow]* `A = softmax(S, axis=-1)` — the highlighted cells are the heavy
weights: "robot" attends to itself and to "boxes"; the article "The" attends almost
uniformly, which is typical — function words rarely have a strong opinion.

*[row sums]* Sanity check on screen: every row sums to 1.00.

*[out prints]* `out = A @ V`. That's the punchline for practitioners: if you can read
these three lines, you understand attention; everything else — heads, masks, caches —
is engineering around them.

## 8 · Spotlight

*[query card pulses, beams shine]* Intuition mode: each token gets a flashlight. The
query is what the token is looking *for*; where the beam lands brightest is where its
attention goes.

*[brightness differences]* "boxes" lights itself up and glances at "robot" — the weights
on screen, 0.42 and 0.28, are the exact softmax outputs from the other slides, just
rendered as light.

*[chips fly to tray]* What the token actually collects isn't the score — it's the value
vectors, flying back in proportion to the light. The tray fills to exactly 1.0.

*[loop to next query]* Every token does this simultaneously, against every other token.
That's the mechanism: look everywhere, weigh by fit, take a weighted average of what
everyone offers.

---

### Shared closing beat (any variant)

Whichever style we pick: two matmuls and a softmax. QKᵀ asks "who matters to whom";
softmax turns that into budgets; ·V spends the budgets on content. Multi-head is this,
h times in parallel with different projections; causal masking just deletes edges into
the future; KV-caching stores K and V so generation doesn't recompute them. The core
never changes.
