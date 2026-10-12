import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 pb-20 pt-24">
      <div className="scanlines relative w-full max-w-lg border border-line bg-[#070b10]">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-[11px] tracking-wider text-dim">
            salvy@linux — bash
          </span>
        </div>
        <div className="px-5 py-6 font-mono text-[13px] leading-[1.9]">
          <p>
            <span className="text-phos">uniq@salvy:~$</span>{" "}
            <span className="text-fog">ls ./requested-note</span>
          </p>
          <p className="text-ember">
            ls: cannot access &lsquo;./requested-note&rsquo;: No such file or
            directory
          </p>
          <p className="mt-4 text-mist">
            <span className="text-dim">exit code 404 —</span> this note
            doesn&rsquo;t exist. It may have been renamed, or I haven&rsquo;t
            written it yet.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="border border-phos bg-phos px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-950 transition-colors hover:bg-transparent hover:text-phos"
            >
              cd ~/blog
            </Link>
            <Link
              href="/about"
              className="border border-line-2 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-mist transition-colors hover:border-phos/60 hover:text-phos"
            >
              whoami
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
