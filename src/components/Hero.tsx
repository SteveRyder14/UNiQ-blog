import Link from "next/link";
import RoleRotator from "./RoleRotator";
import GlitchPhrase from "./GlitchPhrase";
import DataRain from "./DataRain";
import HeroTerminal from "./HeroTerminal";

export default function Hero({ postCount }: { postCount: number }) {
  return (
    <section className="hero-new relative overflow-hidden pt-[72px]">
      <div className="hero-aurora" aria-hidden="true">
        <span className="aurora aurora-one" />
        <span className="aurora aurora-two" />
      </div>
      <DataRain />
      <div className="light-orbs" aria-hidden="true">
        <span className="light-orb orb-a" />
        <span className="light-orb orb-b" />
        <span className="light-orb orb-c" />
      </div>
      <div className="hero-grid" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-[1280px] gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24 lg:pt-20">
        <div className="hero-copy">
          <div className="flex flex-wrap items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-phos/50 motion-reduce:animate-none" />
              <span className="relative h-2 w-2 rounded-full bg-phos" />
            </span>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-phos">
              uniq@salvy
            </p>
            <span className="font-mono text-[10px] text-dim" aria-hidden="true">
              :~/journal$
            </span>
            <span className="block-caret" aria-hidden="true" />
            <span className="hidden h-3 w-px bg-line-2 sm:block" aria-hidden="true" />
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-dim sm:block">
              Currently:
            </p>
            <p className="hidden text-[12px] sm:block">
              <RoleRotator />
            </p>
          </div>

          <h1 className="mt-7 max-w-[720px] font-display text-[clamp(3.4rem,8vw,7.2rem)] font-semibold leading-[0.88] tracking-[-0.045em] text-fog">
            <span className="hero-line">Build it.</span>
            <span className="hero-line block">Break it.</span>
            <span className="hero-line block">
              <GlitchPhrase text="Understand it." />
            </span>
            <span className="hero-line block">Make it better.</span>
          </h1>

          <p className="hero-line mt-8 max-w-xl text-[17px] leading-8 text-mist">
            Practical notes on Android internals, Linux, local AI, audio and
            the satisfying work of figuring out how things actually work.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#latest"
              data-magnetic className="magnetic btn-shine group inline-flex items-center gap-3 rounded-full bg-fog px-6 py-3.5 text-sm font-semibold text-ink-950 transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-phos"
            >
              Start reading
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <Link
              href="/archive"
              data-magnetic className="magnetic group inline-flex items-center gap-3 rounded-full border border-line-2 bg-ink-900/60 px-6 py-3.5 text-sm font-semibold text-fog transition-[transform,border-color] hover:-translate-y-0.5 hover:border-fog"
            >
              Browse the archive
              <span className="font-mono text-[10px] text-dim transition-colors group-hover:text-phos">
                {postCount} notes
              </span>
            </Link>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-2 divide-x divide-line border-y border-line py-5">
            <div className="hero-stat pr-5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-dim">
                Notes published
              </dt>
              <dd className="mt-2 font-display text-3xl font-semibold text-fog">
                {String(postCount).padStart(2, "0")}
              </dd>
            </div>
            <div className="hero-stat pl-5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-dim">
                Areas of focus
              </dt>
              <dd className="mt-2 font-display text-3xl font-semibold text-phos">05</dd>
            </div>
          </dl>
        </div>

        <div data-tilt className="hero-panel tilt-panel relative mx-auto w-full max-w-[560px]">
          <div className="float-chips" aria-hidden="true">
            <span className="float-chip chip-a">
              <i className="chip-dot" />
              salvy · online
            </span>
            <span className="float-chip chip-b">
              <i className="chip-dot" />
              build · passing
            </span>
            <span className="float-chip chip-c">
              <i className="chip-dot" />
              {postCount} notes indexed
            </span>
          </div>
          <div className="hero-spotlight relative overflow-hidden rounded-[28px] border border-line-2 bg-ink-900 p-2 shadow-[0_30px_70px_-38px_rgba(0,0,0,0.55)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/avatar.jpg"
              alt="A developer at a computer with green terminal screens"
              className="aspect-[4/3] w-full rounded-[21px] object-cover"
            />
            <span className="cam-hud" aria-hidden="true">
              <span className="cam-label cam-label-l">cam_01 · 4k</span>
              <span className="cam-label cam-label-r">
                <i className="cam-rec" />
                rec
              </span>
            </span>
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
              <span className="rounded-full bg-ink-950/85 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-fog backdrop-blur">
                desk · 01:42
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-ink-950/85 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-phos backdrop-blur">
                <span className="status-dot" aria-hidden="true" />
                building
              </span>
            </div>
          </div>

          <div className="relative z-10 mx-4 -mt-10 sm:mx-8">
            <HeroTerminal />
          </div>
        </div>
      </div>
    </section>
  );
}
