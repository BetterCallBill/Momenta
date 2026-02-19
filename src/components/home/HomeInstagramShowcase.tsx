"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { InstagramPost } from "@/lib/types";

interface HomeInstagramShowcaseProps {
  posts: InstagramPost[];
}

export default function HomeInstagramShowcase({ posts }: HomeInstagramShowcaseProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section ref={ref} className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
              Instagram
            </p>
            <h2 className="mt-2 text-2xl font-bold dark:text-brand-white text-brand-black md:text-3xl">
              Follow Our Journey
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium rounded-full px-5 py-2 text-xs"
          >
            Follow @momenta.syd
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
          {posts.map((post, i) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative aspect-square overflow-hidden rounded-[8px] transition-opacity duration-500 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <Image
                src={post.imageUrl}
                alt={post.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-brand-black/0 transition-colors duration-300 group-hover:bg-brand-black/60">
                <p className="px-3 text-center text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 leading-relaxed">
                  {post.caption}
                </p>
              </div>
              <div className="absolute inset-0 rounded-[8px] border border-white/0 transition-colors duration-300 group-hover:border-gold-500/30" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
