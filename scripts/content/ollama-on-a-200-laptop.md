A $200 laptop: 8GB of RAM, integrated graphics, a fan that has been losing since 2019. And my question: can this thing run a *useful* local LLM?

Three weeks of testing later, the answer is **yes, within a very specific envelope**. Here's the envelope.

## The hardware reality

- RAM is the whole budget. Integrated GPU shares your system memory, so 8GB is really ~6GB for the model.
- A **4-bit quantized 7B** model weighs about 4.5GB. It fits — barely — leaving the context window on a short leash.
- A **3B model** leaves 3-4GB of headroom. This is the sweet spot on this hardware.

```bash
# the entire install
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen2.5:3b
```

## Numbers, not vibes

Measured on the actual laptop, q4 quantization, no other load:

- **3B model — ~18 tokens/sec.** Usable, pleasant. This is the daily driver.
- **7B model — ~4 tokens/sec.** Usable, slow. Fine for batch jobs, not for conversation.
- **7B with a big context — ~2 tokens/sec.** A screen saver.

The context window is the silent killer. Doubling it roughly doubled my latency, because every generation re-reads everything. **Keep the context small.** For a personal assistant, 4-8 exchanges is plenty.

## What's actually useful at 4 tokens/sec

Surprisingly a lot — if you stop asking for prose:

- **Summarizing** a meeting note I dictate (the model gets 300 words, returns 30)
- **Renaming and organizing files** — it proposes, a script executes
- **Regex and shell one-liners** — it's a lookup with opinions, and the opinions are good
- **Commit messages** from a `git diff` paste. Small output, big win.

What's *not* useful: long document analysis, anything requiring many tool calls (each round trip multiplies the latency), and code generation over ~100 lines.

## The thermal tax

An integrated chip doing matrix math is a heating pad. My mitigations, in order of effect:

1. An undervolt profile — cooler, 15% faster, not a typo
2. Power plan capped, fan curve raised
3. Closing every browser tab (the RAM was the bottleneck before the heat)

> On weak hardware, a 3B model that answers in two seconds beats a 7B model you keep closing because it's "thinking" for ten.

## Verdict

The $200 laptop is not a small data center. It's a **personal coprocessor**: fast enough for drafts, lookups, and cleanup; too slow for heavy lifting. That's a genuinely useful machine — and it never saw a single one of my files in transit.

Next time: what changes when the same setup moves to a proper GPU box (see: the Salvy build notes).
