import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * The UNiQ mark: a split "U" crossed by an orbit ring, with a four-point star.
 * Drawn as vectors so it stays crisp at every size and can be animated.
 * Colour comes from `currentColor`, so it follows the active theme.
 */
const U_CAP = "M474 518 L568 467 L568 576 Z";
const U_BODY =
  "M497 548 L568 591 L568 745 C575 775 605 797 640 797 C680 790 700 745 700 700 L700 553 L777 514 L772 715 C770 780 710 842 630 842 C565 842 515 795 498 735 Z";
const STAR =
  "M719 376 C725 410 733 435 780 447 C733 458 725 485 719 517 C713 485 705 458 657 447 C705 435 713 410 719 376 Z";

const RING = { cx: 637, cy: 668, rx: 262, ry: 62, rotate: -21 };

export default function Logo({
  className,
  animated = false,
  label = "UNiQ",
}: {
  className?: string;
  animated?: boolean;
  label?: string;
}) {
  const uid = useId();
  const cutId = `${uid}-cut`;
  const frontId = `${uid}-front`;
  const ringTransform = `rotate(${RING.rotate} ${RING.cx} ${RING.cy})`;

  return (
    <svg
      viewBox="380 366 520 490"
      role="img"
      aria-label={label}
      className={cn("logo-mark", animated && "logo-animated", className)}
      fill="none"
    >
      <defs>
        {/* Cuts a clean gap through the U where the ring passes in front. */}
        <mask id={cutId} maskUnits="userSpaceOnUse" x="380" y="366" width="520" height="490">
          <rect x="380" y="366" width="520" height="490" fill="white" />
          <ellipse
            cx={RING.cx}
            cy={RING.cy}
            rx={RING.rx}
            ry={RING.ry}
            transform={ringTransform}
            stroke="black"
            strokeWidth="34"
            fill="none"
          />
        </mask>
        {/* Keeps only the near (lower) half of the ring in front of the U. */}
        <clipPath id={frontId}>
          <rect
            x="-400"
            y="0"
            width="800"
            height="400"
            transform={`translate(${RING.cx} ${RING.cy}) rotate(${RING.rotate})`}
          />
        </clipPath>
      </defs>

      {/* far side of the ring sits behind the letter */}
      <ellipse
        className="logo-ring logo-ring-back"
        cx={RING.cx}
        cy={RING.cy}
        rx={RING.rx}
        ry={RING.ry}
        transform={ringTransform}
        stroke="currentColor"
        strokeWidth="13"
        fill="none"
        pathLength={1}
      />

      <g mask={`url(#${cutId})`} className="logo-u" fill="currentColor">
        <path d={U_CAP} />
        <path d={U_BODY} />
      </g>

      {/* near side of the ring crosses in front */}
      <g clipPath={`url(#${frontId})`}>
        <ellipse
          className="logo-ring logo-ring-front"
          cx={RING.cx}
          cy={RING.cy}
          rx={RING.rx}
          ry={RING.ry}
          transform={ringTransform}
          stroke="currentColor"
          strokeWidth="13"
          fill="none"
          pathLength={1}
        />
      </g>

      <path className="logo-star" d={STAR} fill="currentColor" />
    </svg>
  );
}
