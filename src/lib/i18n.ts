export type Locale = "en" | "zh";

export const translations = {
  en: {
    nav: {
      home: "Home",
      events: "Events",
      calendar: "Calendar",
      gallery: "Gallery",
      partners: "Partners",
      about: "About",
      contact: "Contact",
      register: "Register Now",
    },
    hero: {
      cta_events: "View This Week's Events",
      cta_join: "Join Us",
    },
    footer: {
      tagline: "Sydney's most active Chinese outdoor community.",
      rights: "All rights reserved.",
    },
    common: {
      back_to_events: "Back to Events",
      spots_left: (n: number) => `${n} spots left`,
      event_full: "Full",
      free: "Free",
      register_now: "Register Now",
      featured: "Featured",
      no_events: "No events this month",
    },
  },
  zh: {
    nav: {
      home: "首页",
      events: "活动",
      calendar: "日历",
      gallery: "相册",
      partners: "合作伙伴",
      about: "关于我们",
      contact: "联系我们",
      register: "立即报名",
    },
    hero: {
      cta_events: "查看本周活动",
      cta_join: "加入我们",
    },
    footer: {
      tagline: "悉尼最活跃的华人户外社群。",
      rights: "版权所有。",
    },
    common: {
      back_to_events: "返回活动列表",
      spots_left: (n: number) => `剩余 ${n} 个名额`,
      event_full: "已满",
      free: "免费",
      register_now: "立即报名",
      featured: "精选",
      no_events: "本月暂无活动",
    },
  },
} satisfies Record<Locale, unknown>;

export type Translations = typeof translations.en;
