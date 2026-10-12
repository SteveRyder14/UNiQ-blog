Every cloud assistant I've used works in exactly the same direction: my data goes out, an answer comes back. I wanted the opposite. Something that runs on my own hardware, reads my own screen, and touches my own files — and never phones home.

That's Salvy. A year of weekend evenings in, it's now the assistant I actually use. This is the honest write-up: the architecture, the parts that work, and the parts that are still embarrassing.

## What Salvy is not

It's not a chatbot with tools bolted on. A chatbot answers. I keep hitting a wall with that: I ask "what's this file on my desktop?" and the correct answer is to *look* at my desktop, not to ask me to describe it.

Salvy is an **agent loop**: perceive, decide, act, observe. The model is a means. The tools are the point.

## The stack

- **Ollama** serving a 7B model (q4 quantized) on a modest desktop build
- A thin **Python orchestrator** that owns the loop and the memory
- Tools implemented as plain functions with a strict JSON contract:

```json
{
  "tool": "launch_app",
  "args": { "name": "firefox" },
  "reason": "user asked to open the browser"
}
```

The orchestrator never lets the model touch the shell directly. It emits a tool call, the orchestrator validates the shape, checks permissions, and executes. That single decision has saved my system more than once.

## The toolset so far

Three tools cover most of my real use:

1. **`read_screen`** — a screenshot, run through Tesseract OCR, reduced to the ~200 most "text-like" lines. The model gets a transcript of what's on screen, not a megabyte of PNG.
2. **`launch_app` / `close_app`** — resolved through a small whitelist. Firefox, VS Code, a few others. The whitelist is a file I edit by hand, on purpose.
3. **`run_shell_gated`** — the dangerous one. It runs a command, but only from a template list I pre-approved, and every execution lands in a log with the model's stated reason.

That last part is the feature I'm proudest of. `reason` isn't decoration — when something goes wrong, I can read *why* the agent thought it was okay.

## Latency is the real UI

People judge local models on quality. You should also judge them on latency, because latency is where the experience lives or dies.

- A 7B model on my machine: **24 tokens/sec**. Usable.
- The same prompt through a cloud API: faster, but every keystroke of my data now travels somewhere.

The tricks that mattered:

- **Small context windows.** Salvy keeps the last ~4 exchanges, not a novel. Every token you carry is a token you pay for in time.
- **Streaming output.** A model that answers in 6 seconds *feels* instant if the first word arrives in 300ms.
- **Caching tool results.** The same screenshot within 10 seconds doesn't need a second OCR pass.

> A local assistant isn't a compromise with cloud AI. It's a different contract: slower to be sure, but the machine you own does the thinking.

## What's next

- A wake phrase that actually works in a room with music playing (audio is personal to me, so this one's a sore spot)
- **File-aware context** — "summarize the notes from last week" should mean my notes directory, with zero files uploaded anywhere
- Better failure behavior. Right now, when OCR returns garbage, Salvy confidently explains the garbage. I want it to say *I can't read this* instead.

## The budget note

The whole box runs Salvy for under $300 of second-hand parts: a used 4060, 32GB of DDR4, a B650 board. Cheaper than two years of the subscription I replaced — and the subscription is now a memory that lives in this blog post.

Next entry goes deeper on the OCR pipeline, because the screenshot→text path is where 80% of the "magic" (and 80% of the bugs) actually happen.
