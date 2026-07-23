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

**Load:** the GPU anatomy is visible but dimmed. (Once the toolkit cards are
revealed at beat 6, they are draggable — drop one on a hardware zone and that
zone absorbs it with a red flash, and **that zone's meter** reacts: bandwidth →
the decode speedometer accelerates; compute → processor tiles go idle;
capacity → an HBM layer empties; interconnect → link traffic thins. The bucket you pay
decides which meter moves — the framing line, made mechanical. Dragging never
advances the slide.)

1. **[capacity lights up]** "Four numbers govern every inference deployment,
   and everything tonight reduces to them. First: memory capacity — the
   gigabytes that weights plus KV cache must fit into. Capacity doesn't make
   you slow; it decides how many GPUs you must buy before you serve a single
   request."

2. **[bandwidth lights up]** "Second: memory bandwidth — bytes per second
   between HBM and the processor. Decode lives here: every single generated
   token re-reads the weights and the KV cache. This one line explains most
   of tonight's rate card."

3. **[compute lights up]** "Third: compute — FLOP/s, the raw arithmetic.
   Prefill lives here: chewing through a million-token prompt is one giant,
   beautifully parallel matmul."

4. **[interconnect lights up]** "And fourth: interconnect — once the model no
   longer fits one GPU, every token crosses NVLink or InfiniBand, and the
   network between GPUs becomes part of the model."

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

## Page 03 — The Memory Wall: Memory Access Lags Behind Compute

*All figures BF16 dense. Story: teach the plot on the A100 alone, place
decode on it, then pile on the generations — the decode dot crawls up ×4 and
stalls while the ceilings explode ×11. (NVL72 rack material moved to the
expert-parallelism slide; FP8/FP4 ceilings moved to the quantization
section.)*

**Load:** title, empty log–log axes.

1. **[A100 alone: roof draws, ridge ~156]** "One machine first: A100, 2020.
   Two numbers from the spec sheet — 312 teraFLOPS, 2 terabytes a second —
   and one derived ratio: 156 FLOPs per byte. On this plot, that's the whole
   machine: a bandwidth slant, a compute ceiling, and the ridge where they
   meet. Arithmetic intensity — FLOPs per byte moved from HBM — is the only
   x-axis you need tonight. These are dense BF16 figures, by the way; the
   marketing numbers are 2:4 sparse."

2. **[regions label]** "The ridge splits the world in two. Left of it,
   memory-bound: performance is bandwidth times intensity, and adding FLOPs
   changes nothing. Right of it, compute-bound: the ceiling is all that
   matters."

3. **[decode dot lands at AI ≈ 1]** "Now place tonight's workload. LLM
   decode reads every weight to produce a couple of FLOPs each — arithmetic
   intensity about one. Here. Deep in memory-bound territory, at two
   teraFLOPS attainable — on a 312-teraFLOP machine. That's less than one
   percent of the silicon doing useful work."

4. **[H100 roof; dot climbs to 3.35]** "So surely newer hardware fixes this?
   H100: compute triples to 989. Decode's roof rises exactly with
   bandwidth — to 3.35. The ceiling tripled; decode got two-thirds more."

5. **[H200 roof; dot to 4.8]** "H200 is the honest confession: same silicon,
   same FLOPs, 43% more bandwidth — and the market paid a premium for it.
   When vendors can charge more for the same compute plus more memory, you
   know what's scarce. Decode's roof: 4.8."

6. **[B200 roof; dot to 8]** "Blackwell: 2,250 teraFLOPS, and decode's roof
   reaches eight. Ceilings up seven-fold since A100; decode up four-fold."

7. **[B300 ⚠: dot shakes, +0; band + punchline]** "And Blackwell Ultra —
   compute pushes toward 3,500, bandwidth doesn't move: decode gains
   *nothing*. Add the band: across six years the ridge lives between 150 and
   440, and decode sits at one. This is the structural fact of the talk:
   hardware cannot fix memory-bound. Everything from here on — every
   technique in the toolkit — is about attacking this from the *software and
   architecture* side. Rubin and HBM4 arrive next year; the divergence
   continues."

*(final click → next page)*

---

## Page 04 — Prefill vs Decode: Two Different Workloads

*Deliberately low-text: the roofline dot and the thermal anatomy carry the
argument; these beats carry the words. During beat 4 the KV block fills to
capacity within a few seconds — let it hit the wall before clicking on.*

**Load:** title only.

1. **[the machine, idle]** "Here's the machine you already know how to read —
   processor, the HBM pipe, the memory itself. Inference runs on it in two
   completely different modes, and you're about to watch both."

2. **[prefill: die saturates, pipe cool, KV receipt]** "Mode one: prefill.
   The whole prompt arrives at once, thousands of positions in parallel. The
   weights are read from HBM *once* and amortised across all of them — so
   arithmetic intensity scales with sequence length, the processor saturates,
   utilisation pins near 95%, and we're deep in compute-bound territory.
   This phase sets your time-to-first-token, and it's why input tokens are
   cheap. And notice the receipt it leaves behind: a fresh KV cache block."

3. **[the flip: first token]** "Then the first output token appears — and
   the entire thermal picture inverts."

4. **[decode: pipe red-hot, die idle, KV growing]** "Mode two: decode. One
   token at a time, and for *every* token the machine drags all 140 GB of
   weights — plus the growing KV cache — through the pipe, to do just 140
   gigaFLOPs of work. Arithmetic intensity: one. The pipe glows, the
   processor idles at three percent — and watch the KV block: every token
   adds a row, until it hits the ceiling and physically squeezes out the
   batch slots beside it. Decode throughput *is* bandwidth; latency *is*
   bytes-read. Shrinking bytes per token is the entire game of efficient
   decode."

5. **[caption]** "Same model. Same GPU. Two different workloads. That's why
   output tokens cost five times input on every rate card — and almost every
   technique in tonight's toolkit attacks one of these two pictures."

*(final click → next page)*

---

## Page 05 — Transformer Anatomy

*Same 5 beats for all three candidate variants (a: assembly line, b: zoom
levels, c: two machines). This is the vocabulary slide — later slides point
back at the two machines it names.*

**Load:** title only.

1. **[pipeline builds]** "The whole model
   is a short pipeline: text, tokenizer, embeddings, N identical blocks, LM
   head, a distribution over the next token. Two things to notice. The
   token is the atomic unit of everything tonight — compute, memory, and
   billing: that three-dollars-per-million on the rate card is literally
   counting these chips, about three-quarters of a word each. And the N
   blocks are structurally identical — every difference between model
   families lives *inside* the block."

2. **[one block opens: pre-LN diagram, residual highways]** "So open one.
   Pre-LN block: normalise, attention, add it back; normalise, FFN, add it
   back. Those two glowing bypasses are the residual highways that keep
   gradients alive at depth. Which leaves exactly two machines to
   understand."

3. **[attention machine: QKV, heads, exit doors]** "Machine one: attention —
   the only place tokens talk to each other. Three projections, heads in
   parallel, softmax of QKᵀ over root-d times V, and an output projection.
   Two doors here matter for the rest of the talk: the K and V projections
   are exactly what gets *cached* at inference — that purple tag is the KV
   cache from the last slide. And the n-by-n score matrix that just flashed
   is the thing FlashAttention will refuse to materialise."

4. **[FFN machine]** "Machine two: the FFN — two wide matmuls and a
   nonlinearity, applied to every token independently. No token sees
   another; sequence length doesn't enter. And this is the sub-layer MoE
   will later replace with routed experts."

5. **[parameter split + caption]** "Where do the parameters live? Roughly
   two-thirds FFN, one-third attention — and their costs scale differently:
   attention's compute grows quadratically with context and its KV state
   linearly, while the FFN is constant per token. That split *is* the map of
   this talk: one evolution line fixes attention's scaling, the other fixes
   the FFN's parameter bill. Every technique tonight modifies one of these
   two machines."

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
