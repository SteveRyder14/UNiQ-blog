type P = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconTerminal = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="2.5" y="4" width="19" height="16" rx="1.5" />
    <path d="M6.5 9.5 10 12.5 6.5 15.5" />
    <path d="M12.5 15.5h5" />
  </svg>
);

export const IconChip = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="7" y="7" width="10" height="10" rx="1" />
    <path d="M9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4" />
  </svg>
);

export const IconBrain = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 5a3 3 0 0 0-3 3 3 3 0 0 0-2.5 4.8A3 3 0 0 0 8 18.5c.6.5 1.4.5 2 .2l1-.6 1 .6c.6.3 1.4.3 2-.2a3 3 0 0 0 1.5-5.7A3 3 0 0 0 15 8a3 3 0 0 0-3-3Z" />
    <path d="M12 5v13.5" />
    <path d="M9.5 10.5h1.2M13.3 13.5h1.2" />
  </svg>
);

export const IconNetwork = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="5" r="2.2" />
    <circle cx="5" cy="18" r="2.2" />
    <circle cx="19" cy="18" r="2.2" />
    <path d="M10.8 6.9 6.2 16M13.2 6.9l4.6 9.1M7.2 18h9.6" />
  </svg>
);

export const IconWave = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3 10v4M6.5 7.5v9M10 5v14M13.5 8v8M17 4.5v15M20.5 9.5v5" />
  </svg>
);

export const IconWrench = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M14.5 6.5a4 4 0 0 0-5.2 5L4 16.8a1.8 1.8 0 1 0 2.5 2.5l5.3-5.3a4 4 0 0 0 5-5.2L14 11.5 12.5 10l2-2.5-3.3-3.3a4 4 0 0 0 3.3 2.3Z" />
  </svg>
);

export const IconPhone = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="7" y="2.5" width="10" height="19" rx="2" />
    <path d="M10.5 5h3" />
    <circle cx="12" cy="18" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const IconArrow = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 12h15M13 5.5 19.5 12 13 18.5" />
  </svg>
);

export const IconSearch = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15.2 15.2 5 5" />
  </svg>
);

export const IconGitHub = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 1.8a10.2 10.2 0 0 0-3.2 19.9c.5.1.7-.2.7-.5v-1.9c-2.9.6-3.5-1.2-3.5-1.2-.5-1.2-1.2-1.5-1.2-1.5-1-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.5 1.1 3.1.9.1-.7.4-1.1.7-1.4-2.3-.3-4.8-1.2-4.8-5.2 0-1.1.4-2 1.1-2.8-.1-.2-.5-1.3.1-2.7 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.2 0c2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.5.1 2.7.7.8 1.1 1.7 1.1 2.8 0 4-2.5 4.9-4.8 5.2.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10.2 10.2 0 0 0 12 1.8Z" />
  </svg>
);

export const IconMail = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
  </svg>
);

export const IconClock = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5.2l3.4 2" />
  </svg>
);

export const IconTag = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3.5 12.5v-8a1 1 0 0 1 1-1h8l8 8-9 9-8-8Z" />
    <circle cx="8.5" cy="8.5" r="1.2" />
  </svg>
);

export const IconSun = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4 19 19M19 5l-1.6 1.6M6.6 17.4 5 19" />
  </svg>
);

export const IconMoon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} aria-hidden="true">
    <path d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6a8.5 8.5 0 1 0 11.6 11.6Z" />
  </svg>
);
