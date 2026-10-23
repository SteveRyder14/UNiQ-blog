/**
 * Static decorative code columns. Motion is pure CSS (transform + opacity);
 * there is no random generation, client state, timer or JS animation loop.
 * Desktop-only — see `.data-rain` in globals.css.
 */
const COLUMNS = [
  { left: 6, delay: 0, duration: 26, text: "01\n10\n01\n11\n00" },
  { left: 18, delay: 8, duration: 31, text: "0x\n7f\n45\n4c\n46" },
  { left: 31, delay: 14, duration: 28, text: "<>\n{}\n[]\n//\n=>" },
  { left: 47, delay: 3, duration: 33, text: "11\n01\n10\n00\n1f" },
  { left: 62, delay: 18, duration: 29, text: "ls\ncd\nrm\ncp\nmv" },
  { left: 76, delay: 6, duration: 32, text: "C2\n7A\n09\nE1\n4D" },
  { left: 89, delay: 12, duration: 27, text: "$_\n>_\n#!\n~/\n&&" },
] as const;

export default function DataRain() {
  return (
    <div className="data-rain" aria-hidden="true">
      {COLUMNS.map((column) => (
        <span
          key={column.left}
          style={{
            left: `${column.left}%`,
            animationDuration: `${column.duration}s`,
            animationDelay: `${column.delay}s`,
          }}
        >
          {column.text}
        </span>
      ))}
    </div>
  );
}
