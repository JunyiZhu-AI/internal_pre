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

## Pages 06–08 — Attention at scale (one flow, three slides)

*The n×n object is the protagonist throughout: the to-scale square (06),
the tiled square (07), the causal triangle + K/V strips (08).*

### 06 — Self-Attention Recap: The O(n²) Problem (5 clicks)

1. **[recap / setup at n = 1k]** "You know this machine — softmax of QKᵀ over
   root-d, times V. At toy scale it was adorable. Now run it at serving
   scale."
2. **[naïve dataflow]** "Look at what the naïve kernel does to HBM: write
   the full n×n score matrix S out, read it back for softmax, write the
   probabilities P back out, read P again for the V product. Four full
   passes over n² numbers — two writes, two reads."
3. **[n = 8k]** "Grow the context. Sixty-seven million entries — fine."
4. **[n = 128k]** "128k: sixteen *billion* entries — 33 gigabytes. That is a
   third of the GPU's entire memory, for the scratch matrix of ONE head."
5. **[n = 1M + punch]** "A million tokens? Two terabytes. It does not fit —
   nothing fits. Both the FLOPs and the bytes scale as n². This is the
   original sin of attention, and everything in this part of the talk is a
   response to it."

### 07 — FlashAttention: The Bottleneck Was Memory, Not Compute (4 clicks)

1. **[naïve side]** "Here's that naïve kernel as an IO bill: at 128k, S and
   P cross the pipe four times — nearly 140 gigabytes of traffic for one
   op."
2. **[flash side]** "FlashAttention's whole idea: tile Q, K, V into blocks
   that fit in on-chip SRAM, keep a running max and running sum — the online
   softmax — and the n×n matrix simply never exists in HBM."
3. **[the race / ratio]** "Same arithmetic. Identical numerics, bit for bit
   comparable. But the traffic drops from order n-squared to order n —
   roughly a thousand times fewer bytes at this scale. And the wall-clock speedup
   is 2–4×, which tells you exactly what was binding."
4. **[lesson]** "That's the deepest lesson in this talk, and it will recur in
   the KV cache, in quantization, in MoE: count bytes, not FLOPs."

### 08 — KV Cache: Trading Memory for Compute (4 clicks)

1. **[decode without cache]** "Now decode. Without memory of the past, step
   t re-derives the keys and values of every previous token — quadratic
   total work. Nobody serves like this."
2. **[cache on]** "So we remember: store every layer's K and V once, and
   each new token only computes itself and reads the cache. Decoding
   becomes linear — this is what makes autoregressive serving feasible at
   all."
3. **[the bill]** "But memory was traded for that compute, and here's the
   receipt, term by term: two tensors, times 80 layers, times 8 KV heads —
   note that's GQA already helping — times head dimension 128, times two
   bytes. A third of a megabyte per token."
4. **[42.9 GB + squeeze]** "Multiply by a 128k context: forty-three
   gigabytes for ONE request — competing with the weights for HBM, eating
   the batch, capping throughput. And look at that formula again: every
   factor in it is an architecture decision. Layers, KV heads, head width,
   precision — turning those knobs is the entire next section."

*(final click → next page)*

---

## Pages 09–15 — The Attention Evolution (one thread, seven slides)

*The matrix lineage: the n×n matrix and purple K/V strips from 06–08 are
reshaped slide after slide. The mini-map strip on each page tracks position
in the lineage. Reported/speculative figures (MLA per-token size, all K3
numbers) carry no on-screen mark — say "reported" out loud where the beats
do.*

### 09 — The Attention Evolution Map (divider)

1. "Part three: attention. Seven years of efficient-attention research —
   MQA, GQA, MLA, sparse, linear, hybrids, KDA — looks like a zoo, but it's
   one continuous story, and we'll judge every step by a single metric: KV
   bytes per decoded token, times quality retained."
2. "The first half of the lineage: share the KV heads — GQA. Compress what's
   left into a latent — MLA. Attend to fewer tokens — sparse. Watch the
   gauge: megabytes to hundreds of kilobytes to tens."
3. "Then the radical half: replace the cache with a fixed-size state —
   linear attention and SSMs. And the current frontier, inside K3: Kimi
   Delta Attention — which, as we'll see, mixes linear with full attention."
4. "Fewer bytes per decoded token, same quality. That's the whole story —
   let's walk it."

### 10 — MQA / GQA: Share the KV Heads

1. "Baseline multi-head attention: every one of 64 query heads carries its
   own K and V. Sixty-four private copies into the cache, every token."
2. "The cheapest fix in the book: stop that. MQA goes to the extreme — one
   shared K,V for everyone — a bit too brutal for quality. GQA settles in
   between: groups of eight queries share one KV head."
3. "Effect on the formula from the cache slide: divide by eight. And here's
   the confession — the 0.33 megabytes per token I showed you *already had
   GQA inside*. Without it, Llama-3-70B would pay 2.6 megabytes."
4. "Cost: slight quality loss, more for MQA than GQA — so GQA became the
   default: Llama, Mistral, Gemma. And note the pattern: this is the first
   architecture knob in history turned purely for inference economics."

### 11 — MLA: Compress KV into a Latent

1. "DeepSeek's move goes further: don't share the heads — compress them.
   Project every token's K and V down to one low-rank latent vector, about
   512 dimensions plus a small RoPE part. Cache *only the latent*."
2. "Per-token cache drops to the seventy-kilobyte class — an order of
   magnitude below GQA, at comparable reported quality."
3. "The elegant part: at inference the up-projection folds into W_Q and W_O
   — absorbed, gone. Decoding pays zero extra compute for the compression."
4. "DeepSeek V2 and V3, Kimi K2 — and K3's full-attention layers still use
   gated MLA today. Keep that in mind: MLA isn't a detour we pass by; it's
   part of the endpoint."

### 12 — Sparse Attention: Attend to Fewer Tokens

1. "A different axis entirely: keep attention exact, but aim it at fewer
   tokens. Sliding window — each token sees the last w — and suddenly cache
   and compute are bounded by w, not by context."
2. "The modern versions learn *where* to look: DeepSeek's NSA runs
   compressed, selected, and local branches; Kimi's MoBA gates blocks like
   a mixture of experts routes tokens."
3. "Whatever falls outside the window or the selected blocks can be evicted
   from the cache — that's a capacity win exactly where long context hurts."
4. "The trade-off: selection is discrete. Miss a block, lose the memory.
   Long-range recall needs care — which is precisely what the next idea
   attacks."

### 13 — Linear Attention & SSMs: Replace the Cache with a State

1. "The radical option: drop softmax. Attention becomes a linear recurrence
   — a running memory matrix updated as S plus v k-transpose. Decode now
   reads and writes a fixed d-by-d state. Look at the two loops: one drags a
   cache that grows forever; the other carries a box that never grows."
2. "The state-space branch arrived at the same place from control theory —
   Mamba, selective state spaces, hardware-efficient scans."
3. "The write rule matters: DeltaNet updates memory by a *delta rule* — an
   error-correcting write that fixes the stored entry instead of piling on
   top. Gated DeltaNet adds forgetting."
4. "The catch is information-theoretic, not an engineering bug: a fixed
   state cannot hold an unbounded past. Pure-linear models lag on
   recall-heavy tasks — and that gap is what hybrids exist to close."

### 14 — Kimi Delta Attention: The Frontier of the Linear Line

1. "Zoom into that state box. Gated DeltaNet gave it a delta write and one
   forget gate — one scalar per head. Everything in the memory decays at
   the same rate."
2. "KDA's upgrade: make the gate channel-wise. Every channel of the memory
   gets its own forget rate — some hold on for thousands of tokens, some
   flush immediately. Reported: much better long-context retention."
3. "Around it: a short convolution for local context, and chunked kernels
   that keep it hardware-efficient. This is the backbone attention of K3 —
   three linear layers for every one gated-MLA full-attention layer."
4. "Place it on our map: KDA attacks decode bandwidth with the fixed state
   AND capacity with the tiny cache — at million-token scale. The lineage
   converges here."

### 15 — Attention Line: The Payoff

1. "Read the gauge one last time, across the whole line: megabytes per
   token under MHA, 330 kilobytes under GQA, seventy under MLA, tens under
   the hybrid-KDA recipe — mostly state, barely cache."
2. "K3's reported numbers for that recipe: about 75% less KV cache, and up
   to 6.3× decode throughput at a million tokens of context. Watch the
   speedometer."
3. "And quality? Reported parity or better on long-context benchmarks —
   that's the claim to interrogate, but it's the claim."
4. "So attention fixed its context scaling. The other machine in the block
   still carries two-thirds of the parameters — next: shrink the weights
   themselves. Quantization."

*(final click → next page)*

---

## Pages 16–17 — Quantization (the notation, then the frontier)

*Three candidate flows (a: dials rig, b: split-flap notation, c: bucket
payments). Same 4 beats each. The B200 FP8/FP4 ceilings cut from slide 03
deliberately reappear here.*

### 16 — Quantization: Decoding the Notation

1. "The entire quantization field hides in one line of notation: W-x A-y —
   x-bit weights, y-bit activations. The two letters buy completely
   different things, and if you know which letter you turned, you know which
   bottleneck you fixed. One rule of community etiquette before we start:
   bare digits mean integer; floating-point schemes go by their format name."
2. "Turn the W dial. Weights are static — known before deployment — so you
   can be aggressive: four bits, per-group scales, GPTQ- and AWQ-style error
   compensation, all offline. What does it buy? Bandwidth — decode re-reads
   every weight, every token — and capacity. What does it NOT buy? Compute.
   Watch the tensor cores: still FP16. W4A16 is the serving default, and it
   is a pure memory play."
3. "Now the A dial. Activations are dynamic and outlier-prone — harder. But
   the moment BOTH operands are cheap, the matmul drops onto low-precision
   tensor cores, and now you bought compute. That's the whole taxonomy:
   W8A8 was the SmoothQuant era; 'FP8' is the same digits on the native
   Hopper path — nobody calls it W8A8-FP8; W4A8 is the specialist
   throughput stack; and the KV cache is a third dial that buys capacity
   alone."
4. "One caveat with a signature you'll see again: grow the batch until
   decode goes compute-bound, and these wins fade — quantization is a
   bandwidth-regime weapon. And remember the roofline slide, where I hid
   the B200's other two ceilings? Here they are: 2,250, 4,500, 9,000.
   The hardware has dials too — and it's turning them in the same
   direction."

### 17 — Precision Becomes an Architecture Hyperparameter

1. "Watch where quantization enters the pipeline. Old world: after training
   — PTQ, compress and accept the loss. Then DeepSeek-V3 moved it before
   pretraining: FP8-native. K3 moves it inside training: quantization-aware
   training from the SFT stage onward."
2. "K3's recipe: MXFP4 weights, MXFP8 activations. The 'MX' is microscaling
   — one shared scale per small block of values — and that block-wise scale
   is what keeps four-bit weights accurate. Watch the wall repaint sixteen,
   eight, four — and the quality line hold flat."
3. "Here's the punchline: in the notation, this is still just W4A8. The
   digits didn't move — everything underneath them did. Number system:
   integer became microscaling float. Origin: post-training became
   quantization-aware. Hardware: hand-written kernels became
   Blackwell-native. The digits record bit widths; K3's advance lives in
   the three things they don't record. And versus FP8 it halves weight
   memory and decode bandwidth *again* — straight into the token price."
4. "So the takeaway: at the frontier, precision is an architecture
   hyperparameter, co-designed with the model — not a compression
   afterthought. And now weights are cheap to store — but decode still
   reads every weight it uses. What if we simply used fewer of them per
   token? Enter MoE."

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
