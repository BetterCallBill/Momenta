import Image from "next/image";
import type { InstagramPost } from "@/lib/types";

interface InstagramShowcaseProps {
  posts: InstagramPost[];
}

export default function InstagramShowcase({ posts }: InstagramShowcaseProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">
            Follow Us on{" "}
            <span className="text-gold-500">Instagram</span>
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
          >
            @momenta.syd →
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={post.imageUrl}
                alt={post.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-brand-black/0 transition-colors group-hover:bg-brand-black/60">
                <p className="px-3 text-center text-xs font-medium text-brand-white opacity-0 transition-opacity group-hover:opacity-100">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
