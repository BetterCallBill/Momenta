"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 dark:bg-brand-black bg-white">

      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
        aria-label="Main navigation"
      >
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-gold-500">M</span>
          <span className="dark:text-brand-white text-brand-black">omenta</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium dark:text-brand-white/80 text-neutral-600 transition-colors hover:text-gold-500"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/events"
              className="btn-premium rounded-full px-5 py-2 text-sm"
            >
              Register Now
            </Link>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            className="flex flex-col gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-0.5 w-6 dark:bg-brand-white bg-brand-black transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 dark:bg-brand-white bg-brand-black transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 dark:bg-brand-white bg-brand-black transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t dark:border-neutral-800 border-neutral-200 dark:bg-brand-black/95 bg-white/95 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium dark:text-brand-white/80 text-neutral-600 transition-colors dark:hover:bg-neutral-800 hover:bg-neutral-100 hover:text-gold-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link
                href="/events"
                onClick={() => setMenuOpen(false)}
                className="btn-premium block rounded-full px-5 py-2.5 text-center text-sm"
              >
                Register Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
