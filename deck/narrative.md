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

5. **[locked toolkit appears]** "And here's tonight's toolkit: FlashAttention,
   GQA, MLA, KDA, quantization, MoE, expert parallelism, prefill–decode
   disaggregation, multi-token prediction. These names mean nothing yet —
   that's deliberate. By the end of the talk, you'll sort them into these
   four buckets yourselves."

6. **[decode simulator powers on]** "One more thing before we start: this
   screen. It's a decode stream running at K3's launch-day speed — our
   speedometer. The small gray window beneath it is a ghost pinned at that
   launch speed, so you can always see how far we've come. Keep an eye on
   them; every section that follows widens the gap."

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
3. "And here is where that box actually ships: K3's backbone — three KDA
   linear layers for every one gated-MLA full-attention layer. Notice the
   blue blocks: those are the MLA layers from two slides ago; that slide
   wasn't history, it's a quarter of this stack. Around the KDA layers, the
   engineering details you'd expect: a short convolution for local context,
   chunked hardware-efficient kernels."
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

*Bucket payments: slide 02's machine returns and each dial visibly pays its
bucket; the locked toolkit card unlocks. The B200 FP8/FP4 ceilings cut from
slide 03 deliberately reappear here.*

### 16 — Quantization: Decoding the Notation

1. "The entire quantization field hides in one line of notation: W-x A-y —
   x-bit weights, y-bit activations. The two letters buy completely
   different things, and if you know which letter you turned, you know which
   bottleneck you fixed."
2. "Turn the W dial. Weights are static — known before deployment — so you
   can be aggressive: four bits, per-group scales, GPTQ- and AWQ-style error
   compensation, all offline. What does it buy? Bandwidth — decode re-reads
   every weight, every token — and capacity. What does it NOT buy? Compute.
   Watch the tensor cores: still FP16. W4A16 is the serving default, and it
   is a pure memory play."
3. "Now the A dial. Activations are dynamic and outlier-prone — harder. But
   the moment BOTH operands are cheap, the matmul drops onto low-precision
   tensor cores, and now you bought compute. That gives you the whole
   family: W4A16 for serving, eight-bit both ways for compute, four-bit
   weights at the frontier — and the KV cache as a third dial that buys
   capacity alone."
4. "And remember the roofline slide, where I hid the B200's other two
   ceilings? Here they are: 2,250, 4,500, 9,000. The hardware has dials
   too — and it's turning them in the same direction."

### 17 — Precision Becomes an Architecture Hyperparameter

1. "Watch where quantization enters the pipeline. Old world: after training
   — PTQ, compress and accept the loss. Then DeepSeek-V3 moved it before
   pretraining: FP8-native. K3 moves it inside training: quantization-aware
   training from the SFT stage onward."
2. "K3's recipe: MXFP4 weights, MXFP8 activations. The 'MX' is microscaling
   — one shared scale per small block of values — and that block-wise scale
   is what keeps four-bit weights accurate. Watch the wall repaint sixteen,
   eight, four — and the quality line hold flat."
3. "The payoff: versus FP8, four-bit weights halve the weight memory and
   the decode bandwidth *again* — and that flows straight into the token
   price. Watch the machine: footprint frees, the pipe carries half the
   bytes per token, quality holds."
4. "So the takeaway: at the frontier, precision is an architecture
   hyperparameter, co-designed with the model — not a compression
   afterthought. And now weights are cheap to store — but decode still
   reads every weight it uses. What if we simply used fewer of them per
   token? Enter MoE."

*(final click → next page)*

---

## Pages 18–22 — MoE and the systems layer (one flow, five slides)

*The machine continues: the GPU package from 16–17 stays on stage. We zoom
into the die for the unzip, fill HBM with the expert grid, hit the capacity
wall, multiply the package into a rack, and finally split the rack into two
pools — landing back on the rate card's $0.30.*

### 18 — MoE: Conditional Computation

1. "Slide 17 ended on a promise: what if a token simply used fewer weights?
   Here's the machine again. Zoom into the die — one layer of the stack,
   the part we haven't touched all talk: the FFN. Dense, it's roughly
   two-thirds of the parameters, and every token pays for all of it."
2. "The trick: unzip the FFN into N parallel experts and put a router in
   front. Watch the tokens come through — each one activates only the
   top-k, here two of eight, and every token picks a different pair;
   Switch Transformer pushed it all the way to k = 1. The experts a token
   doesn't route to simply don't run. Keep watching — this never stops."
3. "That one move decouples two numbers that used to be the same. FLOPs
   per token follow the ACTIVE parameters — the flat blue bar. Capability
   — roughly — follows the TOTAL, the amber bar that just soared. That
   arbitrage is the whole story: it's how a Mixtral with 13 billion
   active matched a 70-billion dense model at a fraction of the FLOPs
   per token."
4. "So why is every frontier open model MoE now? Because capability is
   marketed in total params, and the bill — training and decode alike — is
   computed in active FLOPs. But hold both numbers: decode still reads the
   active parameters from HBM every token — and HBM has to store ALL of
   them. That second number is about to send us a bill."

### 19 — The MoE Evolution: Finer, Sparser, Shared

1. "Here's the machine again — and this time HBM is the hero, because HBM
   is where the experts live. One MoE layer, the way slide 18 left it:
   eight coarse experts."
2. "The frontier pushed that picture along three axes. Finer: DeepSeekMoE
   split coarse experts into many small ones — watch the eight shatter
   into sixty-four — more routing combinations, better specialization.
   Shared: one always-on expert carries the common knowledge, freeing the
   routed ones to specialize. And sparser — watch the activation rate
   collapse: eight of sixty-four wake per token."
3. "Run the race. DeepSeek-V3, 2024: 671 billion total, 37 active — 256
   routed experts, top-8, one shared. Kimi K2, 2025: a trillion total,
   32 active — 384 experts, still top-8."
4. "And K3: 896 routed experts, top-16, plus two shared experts — 2.8
   trillion total, 41 billion active. Sixteen out of 896 is a 1.8 percent
   activation rate; the recipe is called Stable LatentMoE. That's the grid
   filling HBM on the left — the teal bar on top is the shared experts,
   never off."
5. "One line of interpretation: the field is buying enormous capacity at
   near-constant per-token cost. Total goes 671 → 1,000 → 2,800; the
   active row — note the ×10 zoom it needs to even be visible — barely
   moves."

### 20 — MoE's Hidden Bill

1. "The four buckets from the start of the talk are back. Turn the model
   MoE and watch compute: it relaxes — the matmul bill follows 41 billion
   active, not 2.8 trillion. Look at the processor: only the four active
   experts are on it at all — the idle ones never leave HBM. But in this
   talk, a discount at one bucket usually means an invoice at another."
2. "Invoice one: capacity. All 2.8 trillion parameters must sit in HBM,
   even though ninety-eight percent are idle for any given token. At four
   bits that's about 1.4 terabytes of weights — at least eight B200s
   before a single byte of KV cache. It does not fit in one package."
3. "Invoice two: communication. The moment experts live on different GPUs,
   every MoE layer becomes an all-to-all token exchange — out to the
   experts, back from the experts, every layer. Interconnect is now a
   first-class bottleneck."
4. "So the reframe: MoE moved the bottleneck — from compute to capacity
   plus interconnect. The rest of this section is the systems layer
   answering: expert parallelism, then prefill–decode disaggregation."

### 21 — Expert Parallelism

1. "One package becomes eight. Expert parallelism: different experts on
   different GPUs — 896 experts across 8 GPUs is 112 each — and the model
   that didn't fit is now sharded across a rack."
2. "The cost is choreography — and here is what all-to-all actually looks
   like. Every GPU holds its own tokens, but at the MoE layer each
   token's experts usually live somewhere else. So all of them swap at
   once: every GPU sending to every GPU, paths crossing the whole rack.
   Compute happens at the destination — watch the dies flash — then
   everyone swaps back. Dispatch, compute, combine — and it never stops:
   this exchange happens at every single MoE layer."
3. "Why not tensor parallelism? TP splits every matmul — an all-reduce
   every single layer, latency-bound. EP keeps whole experts local and
   communicates only at expert boundaries."
4. "All-to-all is latency- and topology-sensitive, so the serving trick is
   overlap: while one micro-batch computes, the next one's tokens are in
   flight — communication tucks under compute. And notice the direction of
   design: expert size, top-k, group-limited routing are chosen to make EP
   cheap. The architecture serves the system — and racks like the GB200
   NVL72, 1.8 terabytes a second of NVLink per GPU, are the system."

### 22 — Prefill–Decode Disaggregation

1. "Honesty first: this last one is not an MoE trick — Splitwise, DistServe,
   Mooncake all did it for dense models. It answers the oldest split in
   this talk: prefill is compute-bound and owns time-to-first-token;
   decode is bandwidth-bound and owns time-per-output-token. Co-locate
   them and they fight for the same GPU — and couple those two latency
   targets."
2. "So split the machines. A prefill pool builds the KV cache; the parcel
   ships over the interconnect; a decode pool streams tokens out. TTFT and
   TPOT are now tuned independently — each gauge has its own owner."
3. "What it buys: each pool scales to its own traffic; each phase gets its
   own parallelism and batching — frontier MoE clusters run different EP
   degrees in P and D; and a prefill spike no longer stalls everyone's
   decode. The price: shipping KV caches across the network, fast."
4. "And with that, the rate card again. Question 2 — why is a cache hit
   ten times cheaper? Because a hit skips prefill entirely — that's
   prefix caching, and that alone is the ten-x: watch the bypass path go
   around the P pool. What PD-style serving adds is scale — the cached KV
   becomes a shared, routable resource, so any hit can be served by any
   decode pool and the discount holds across a datacenter. $3.00 becomes
   $0.30. K3's team upstreamed prefix-caching work to vLLM — the
   economics and the engineering are one story."

*(final click → next page)*

---

## Page 23 — Multi-Token Prediction

*The machine one last time: the die drops tokens onto a conveyor out of the
package; a separate draft model appears, then docks into the die as the MTP
head. Speak "reported" aloud for the 85–90% figure.*

1. "The machine one last time — and now watch what it makes. The die drops
   finished tokens onto a conveyor running out of the package. Look at the
   exchange rate: for every single token that rolls off, the whole amber
   HBM block flashes and streams down the pipe — all active weights plus
   KV, re-read from scratch, every step. Decode is serial: one step, one
   token. That's arithmetic intensity of roughly one FLOP per byte on a
   machine balanced at about 295 — the tally says it plainly: three reads,
   three tokens. The die idles while the pipe does all the work."
2. "The general technique has a name: speculative decoding. The classic
   form: a completely separate small draft model — note it's its own
   little box, not part of our die — guesses ahead, placing a few ghost
   tokens on the belt. Then the big model runs one ordinary forward pass —
   one weight read — and stamps all of them at once: the guesses it agrees
   with solidify and roll away; the one it rejects drops off the belt, and
   generation redraws from that point. Keep watching — draft, verify,
   accept, reject, again and again; that's the decode loop now. The tally
   flips: one read, three tokens. Two things to hold. It's lossless —
   verification keeps the output distribution exactly unchanged, so the
   speedup is capped only by the acceptance rate. And in the classic
   two-model form, that acceptance hinges on how well a foreign little
   model mimics the target — remember that weakness."
3. "Reframe what you just saw: a verify pass is a mini-prefill. One weight
   read amortised over k positions — the same amortisation prefill gets
   for free, smuggled into the decode loop. Economically: bytes per token
   divided by roughly k — the same bandwidth bill quantization pays, by
   opposite means. And look at how it's paid: the amber bar shrinks while
   the idle die tiles light up. This is the only technique in the talk
   that spends idle compute to buy bandwidth — rejected drafts are wasted
   FLOPs, and those FLOPs were free anyway."
4. "Now the twist that makes it MTP. Fix the classic form's weakness at
   the root: don't hire a foreign drafter — train one inside the model.
   Watch the little box dock into the die and turn blue. MTP is
   speculative decoding designed into the architecture — the drafter
   trained inside the model. DeepSeek-V3 trains an extra module to predict
   the next-NEXT token, then reuses it as the drafter at inference; because
   it shares the trunk, it mimics the target superbly — reported acceptance
   around 85 to 90 percent. Inference acceleration designed into the
   architecture — this section's motto, and the note to end it on."

*(final click → next page)*

---

## Pages 24–25 — The closing (the map completed, the price tag reread)

*Slide 02's board returns, reproduced exactly — same package, W/KV HBM,
pipes, die, peers, tags, tray, speedometer + ghost. This page is a pure
DEMONSTRATION: nothing is draggable; each click auto-plays the next phase
and the cards fly themselves into their buckets with slide 02's absorb
animations. (The interactive version stays on slide 02 — the closing page's
replay chip jumps there.)*

### 24 — The Machine, Fully Upgraded

1. "Here is the board from the start of the talk — but you've lived inside
   this machine for an hour now. HBM for weights, HBM for KV, the pipe, the
   die, the interconnect stubs — the four buckets. On the right, our
   speedometer, with its launch-day ghost pinned at one-x. And the nine
   names that meant nothing at nine-fifteen. You could sort these yourselves
   now — so let's do it, fast."
2. "The attention arc first, plus the quant dial. FlashAttention — bandwidth,
   the IO of the score matrix. GQA, MLA, KDA — each one hits capacity AND
   bandwidth, because KV bytes are both a footprint and a per-token read;
   watch the KV block shrink three times. Quantization — the weight cells
   themselves shrink. Five cards, and the meter is already pulling away from
   the ghost."
3. "Now the card with a plot twist. MoE docks in compute — FLOPs per token
   drop, the die's tiles go idle, the meter jumps. But watch: red alerts —
   all the weights no longer fit in one package, and every MoE layer is an
   all-to-all. A discount at one bucket, invoices at two others — you know
   this story. Expert parallelism pays both: capacity became communication,
   and communication was tamed. The alerts clear."
4. "MTP — bandwidth. One weight read now carries k tokens: the pipe traffic
   thins, and notice the die heat up — this is the only card on the board
   that spends compute to buy bandwidth. Those little dashed tokens
   flickering by the meter are the rejected drafts — wasted FLOPs that
   were free anyway."
5. "And prefill–decode disaggregation: the serving screen itself splits —
   a P pool owning time-to-first-token, a D pool owning time-per-output-
   token, each gauge tuned alone. Fifteen out of fifteen: the meter reads
   four-point-seven-five against the launch-day ghost — and the corner
   caption keeps the honest arithmetic on the real factors."
6. "Pull back. The empty board from the opening, now filled: nine
   techniques, the bottleneck each one attacks, the stage where it bites,
   and whether it ships in K3. Every row is a targeted strike on one of four
   buckets. That's the whole talk in one table."

*(final click → next page)*

### 25 — Thank You

*A minimal end card: the upgraded machine keeps faintly running behind a
centered thank-you and the replay chip (which jumps back to slide 02's
bucket game). Closing remarks — the answered questions, the co-design
pattern, any open questions — are spoken over this page, on the wrap-up
of slide 24's table.*

1. "That's the talk. The machine keeps humming back there — everything we
   built this evening, still running. Thank you — questions? And if anyone
   wants another go at sorting the cards, this button jumps straight back
   to the bucket game."

*(end of deck)*

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
