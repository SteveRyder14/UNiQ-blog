import Logo from "./Logo";

/**
 * Brand intro, shown once per browser session.
 * Hidden by default; the early theme script enables it with
 * `html[data-splash="on"]`, so repeat visits, reduced-motion users and
 * no-JS visitors never see it. All timing lives in CSS.
 */
export default function IntroSplash() {
  return (
    <div className="intro-splash" aria-hidden="true">
      <div className="intro-stage">
        <Logo animated className="intro-logo" />
        <p className="intro-word">UNiQ</p>
        <ul className="intro-log">
          <li>
            <span>init uniq.core</span>
            <b>[ok]</b>
          </li>
          <li>
            <span>mount ~/journal</span>
            <b>[ok]</b>
          </li>
          <li>
            <span>link established</span>
            <b>[ok]</b>
          </li>
        </ul>
        <span className="intro-bar" />
      </div>
    </div>
  );
}
