"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import type { GalleryImage } from "@/lib/types";

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const image = images[currentIndex];

  const goNext = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const goPrev = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goNext, goPrev]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-0 flex h-full max-h-full w-full max-w-full items-center justify-center bg-brand-black/95 p-0"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-neutral-800 p-2 text-brand-white/70 hover:text-brand-white"
        aria-label="Close"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-neutral-800 p-3 text-brand-white/70 hover:text-brand-white"
        aria-label="Previous image"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="relative mx-16 max-h-[80vh] max-w-[80vw]">
        <Image
          src={image.url}
          alt={image.alt}
          width={1200}
          height={800}
          className="max-h-[80vh] w-auto rounded-lg object-contain"
          sizes="80vw"
        />
        <p className="mt-3 text-center text-sm text-brand-white/60">
          {image.alt}
        </p>
      </div>

      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-neutral-800 p-3 text-brand-white/70 hover:text-brand-white"
        aria-label="Next image"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-brand-white/40">
        {currentIndex + 1} / {images.length}
      </div>
    </dialog>
  );
}
