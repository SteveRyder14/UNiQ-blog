/**
 * Site-wide vignette. A fixed, click-through overlay that darkens the frame
 * edges so the centre of the page reads clean and the content feels lit.
 * Purely decorative — hidden from assistive tech and inert to pointer events.
 */
export default function Vignette() {
  return <div className="vignette-layer" aria-hidden="true" />;
}
