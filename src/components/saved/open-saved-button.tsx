"use client";

import { useSaved } from "@/context/saved-context";

export function OpenSavedButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { openSaved } = useSaved();
  return (
    <button type="button" onClick={openSaved} className={className}>
      {children}
    </button>
  );
}
