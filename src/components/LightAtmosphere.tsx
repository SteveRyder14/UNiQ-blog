/**
 * Decorative, CSS-only layer for the light theme: slow fluid light plus a
 * faint scan line that sweeps the viewport. Sits behind all content.
 */
export default function LightAtmosphere() {
  return (
    <div className="light-atmosphere" aria-hidden="true">
      <span className="light-fluid light-fluid-a" />
      <span className="light-fluid light-fluid-b" />
      <span className="light-fluid light-fluid-c" />
      <span className="light-scan" />
    </div>
  );
}
