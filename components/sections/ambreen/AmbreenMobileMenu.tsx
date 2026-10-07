"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

const navItems = [
  ["About", "#about"], ["Expertise", "#expertise"],
  ["Experience", "#experience"], ["Projects", "/ambreen/projects"],
  ["Tech Stack", "#tech-stack"], ["Education", "#education"],
  ["Contact", "#contact"],
];

export default function AmbreenMobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    element.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <dialog ref={dialog} aria-labelledby="ambreen-menu-title" onCancel={onClose}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-background p-7 text-foreground backdrop:bg-background/80">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <p id="ambreen-menu-title" className="text-sm font-semibold">Ambreen Fatima</p>
        <button type="button" onClick={onClose} aria-label="Close menu" className="rounded-md border border-border p-3 focus-visible:outline-2 focus-visible:outline-accent"><X size={20} /></button>
      </div>
      <nav aria-label="Portfolio sections" className="flex flex-col gap-1 py-8">
        <Link href="/" onClick={onClose} className="mb-4 rounded-md border border-border px-3 py-3 text-base font-semibold text-accent hover:bg-secondary focus-visible:outline-2 focus-visible:outline-accent">← Back to AAYI Tech</Link>
        {navItems.map(([name, href]) => <Link key={href} href={href.startsWith("/") ? href : `${pathname === "/ambreen" ? "" : "/ambreen"}${href}`} onClick={onClose} className="rounded-md px-3 py-3 text-xl font-medium hover:bg-secondary focus-visible:outline-2 focus-visible:outline-accent">{name}</Link>)}
      </nav>
      <a href="/ambreen/Ambreen_Fatima_CV.pdf" download className="inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Download resume</a>
    </dialog>
  );
}
