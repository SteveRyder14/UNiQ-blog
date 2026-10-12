"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  const key = usePathname();
  return (
    <div key={key} className="page-shell">
      {children}
    </div>
  );
}
