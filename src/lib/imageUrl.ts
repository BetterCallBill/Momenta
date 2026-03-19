/**
 * Converts a Google Drive sharing URL to a direct-access image URL.
 * Input:  https://drive.google.com/file/d/FILE_ID/view?usp=drive_link
 * Output: https://drive.google.com/uc?export=view&id=FILE_ID
 *
 * Cloudinary and all other URLs are returned as-is.
 */
export function resolveImageUrl(url: string): string {
  if (!url) return url;

  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  return url;
}

/**
 * Google Drive URLs redirect through a viewer page which breaks Next.js image
 * optimisation. Return true for these so callers can set unoptimized.
 */
export function needsUnoptimized(url: string): boolean {
  if (!url) return false;
  return url.includes("drive.google.com") || url.includes("lh3.googleusercontent.com");
}
