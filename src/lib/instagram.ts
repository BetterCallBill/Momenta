import type { InstagramPost } from "./types";

/**
 * Mock Instagram adapter.
 *
 * To swap with a live adapter, implement the same `getInstagramPosts` signature
 * using the Instagram Graph API:
 *   GET https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp&access_token=TOKEN
 *
 * Then replace this file's export or use an environment variable to toggle.
 */
export async function getInstagramPosts(): Promise<InstagramPost[]> {
  return [
    {
      id: "ig-1",
      imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=400&fit=crop",
      caption: "Morning trail run through the Blue Mountains 🏃‍♂️",
      permalink: "#",
      timestamp: new Date().toISOString(),
    },
    {
      id: "ig-2",
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop",
      caption: "Weekend hiking with the crew 🥾",
      permalink: "#",
      timestamp: new Date().toISOString(),
    },
    {
      id: "ig-3",
      imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=400&fit=crop",
      caption: "Golf day at the course ⛳",
      permalink: "#",
      timestamp: new Date().toISOString(),
    },
    {
      id: "ig-4",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
      caption: "Sunset yoga session 🧘",
      permalink: "#",
      timestamp: new Date().toISOString(),
    },
    {
      id: "ig-5",
      imageUrl: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=400&h=400&fit=crop",
      caption: "BJJ fundamentals class 🥋",
      permalink: "#",
      timestamp: new Date().toISOString(),
    },
    {
      id: "ig-6",
      imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop",
      caption: "Community outdoor social 🎉",
      permalink: "#",
      timestamp: new Date().toISOString(),
    },
  ];
}
