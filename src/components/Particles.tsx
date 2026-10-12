/**
 * Pure-CSS floating particles — no JS animation loop, zero main-thread cost.
 * Deterministic positions/durations so SSR and client markup always match.
 */
const PARTICLES = [
  { left: 6, dur: 14, delay: 0, sway: 26 },
  { left: 14, dur: 18, delay: 3.2, sway: -20 },
  { left: 23, dur: 12, delay: 6.1, sway: 14 },
  { left: 31, dur: 20, delay: 1.4, sway: -32 },
  { left: 42, dur: 15, delay: 8.3, sway: 22 },
  { left: 51, dur: 17, delay: 4.7, sway: -16 },
  { left: 60, dur: 13, delay: 9.9, sway: 30 },
  { left: 68, dur: 19, delay: 2.6, sway: -24 },
  { left: 77, dur: 14, delay: 7.2, sway: 18 },
  { left: 84, dur: 16, delay: 5.5, sway: -28 },
  { left: 91, dur: 21, delay: 0.8, sway: 20 },
  { left: 97, dur: 15, delay: 10.4, sway: -14 },
];

export default function Particles() {
  return (
    <div className="particles" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            ["--sway" as string]: `${p.sway}px`,
          }}
        />
      ))}
    </div>
  );
}
