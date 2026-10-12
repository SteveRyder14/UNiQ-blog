I built tic-tac-toe five times. Same tiny game, five different stacks, and I did it on purpose. This is the method, and why a game this small is the most honest classroom I know.

## The rule of the method

Every pass, the game had to be *fully playable* before moving on. No half-built versions. A finished ugly thing teaches more than a broken impressive one.

## Pass 1 — no tools at all

Plain files, manual reload, the state is a global variable and the render is a string.

What I learned: a "framework" is mostly **rendering state as a tree** and **keeping that tree honest**. Stripped to the bone, the whole job is: mutate state, redraw. The mystery of React started dying here.

## Pass 2 — the DOM, by hand

Direct `document.getElementById` calls, event listeners everywhere, and the classic bug: the render code assumed a fresh DOM it didn't have.

What I learned: **frameworks exist to stop you from lying to the DOM.** Every manual `if (changed) update` is a future bug with a delay.

## Pass 3 — state in, tree out

I wrote a tiny pattern: one state object, one `render()` that rebuilds the board from it. The hand-DOM bugs vanished overnight, because the board could no longer disagree with the state.

What I learned: this is 80% of what any component framework sells. The other 20% is diffing, so you don't rebuild everything.

## Pass 4 — a real framework, eyes open

Same game, now with a real framework and its diffing. And here's the trick that made it a *learning* project: I kept my pass-3 renderer beside it, and diffed the outputs mentally. I could finally say *exactly* what the diffing pass was saving me.

```js
// pass 3: rebuild everything, simple and correct
function render(state) {
  board.innerHTML = "";
  for (const cell of state.cells) board.append(makeCell(cell));
}
```

## Pass 5 — the deployed version

The one that's live on my website. Same five lessons, plus: input validation (the board gets clicked fast), a tiny bit of accessibility, and a win condition I could *prove* correct.

Which brings me to the best part: **minimax**. Once the AI could play, I could *demonstrate* the game theory instead of describing it. The computer never loses now — and I can show you, board by board, exactly why.

## Why not just do a "real" project?

Because a real project hides the mechanism. In a big app, the framework does ten things at once and you never see which is which. In tic-tac-toe, the state has nine cells. When it breaks, there is *nowhere to hide* — the bug is yours, the fix is yours, and the lesson sticks.

> Start where the state fits in your head. Scale up only after the small thing is boring.

Five builds, one afternoon each. The game is still 3x3. I'm not the same person I was at build one.
