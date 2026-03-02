import Link from "next/link";

const LINKS = [
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const SOCIALS = [
  { href: "#", label: "Instagram", icon: "instagram" },
  { href: "#", label: "WeChat", icon: "wechat" },
  { href: "#", label: "Facebook", icon: "facebook" },
];

function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "instagram":
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "wechat":
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.2 4.127c-3.763 0-6.932 2.674-6.932 6.135 0 3.461 3.169 6.136 6.932 6.136.694 0 1.367-.098 2-.268a.66.66 0 01.546.075l1.452.849a.249.249 0 00.128.042.227.227 0 00.222-.226c0-.055-.022-.109-.036-.163l-.298-1.131a.452.452 0 01.163-.508C20.453 19.846 21.73 18.075 21.73 16.253c0-3.461-3.169-6.135-6.932-6.135zm-2.846 3.928c-.49 0-.888-.404-.888-.9s.397-.9.888-.9c.49 0 .888.404.888.9s-.397.9-.888.9zm5.693 0c-.49 0-.888-.404-.888-.9s.397-.9.888-.9.888.404.888.9-.397.9-.888.9z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  return (
    <footer className="border-t dark:border-neutral-800 border-neutral-200 dark:bg-brand-black bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="text-2xl font-bold">
              <span className="text-gold-500">M</span>
              <span className="dark:text-brand-white text-brand-black">omenta</span>
            </Link>
            <p className="mt-3 text-sm dark:text-brand-white/60 text-neutral-500 leading-relaxed">
              Sydney&apos;s Chinese outdoor community. Running, hiking, golf, BJJ,
              yoga and more.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold-500">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm dark:text-brand-white/60 text-neutral-500 transition-colors hover:text-gold-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold-500">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark:text-brand-white/60 text-neutral-500 transition-colors hover:text-gold-500"
                  aria-label={s.label}
                >
                  <SocialIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t dark:border-neutral-800 border-neutral-200 pt-6 text-center text-xs dark:text-brand-white/40 text-neutral-400">
          &copy; {new Date().getFullYear()} Momenta. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
