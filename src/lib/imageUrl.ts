export function resolveImageUrl(url: string): string {
  if (!url) return url;

  // Inject f_auto so Cloudinary converts HEIC/HEIF to a browser-compatible format.
  const cloudinaryMatch = url.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/.+)$/
  );
  if (cloudinaryMatch) {
    return `${cloudinaryMatch[1]}f_auto/${cloudinaryMatch[2]}`;
  }

  return url;
}

export function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(url);
}
