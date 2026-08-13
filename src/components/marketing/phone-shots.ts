export type PhoneShot = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

/** Mockups iPhone pré-optimisés (WebP + blur LCP). */
export const PHONE_SHOTS = {
  sessionPortrait: {
    src: "/marketing/mockup/new-session-portrait.webp",
    width: 900,
    height: 1773,
    blurDataURL:
      "data:image/webp;base64,UklGRtIAAABXRUJQVlA4WAoAAAAQAAAACwAAFwAAQUxQSFEAAAABf6CQjSQ4ti/SAhzQRURgR8ssI/IDRpFsNSocoIATPrIPJCAFaWhAQ9yc3r+tgYj+B7feS1bu+75FheoI9CSTHEgr8k42xI7wV4UqENx6LxkAVlA4IFoAAADwAwCdASoMABgAPzmEuVOvKKWisAgB4CcJaQDMHCK4Vz+RNN1+BWkAAP7ZgHjBwZCfwwgaE3f48w2SpgAYXfC2/yWcnbNLJ+Ec4t9v/osPAdOam4+BK4nHeAA=",
  },
  joinPortrait: {
    src: "/marketing/mockup/join-session-portrait.webp",
    width: 900,
    height: 1773,
    blurDataURL:
      "data:image/webp;base64,UklGRtAAAABXRUJQVlA4WAoAAAAQAAAACwAAFwAAQUxQSFEAAAABf6CQjSQ4ti/SAhzQRURgR8ssI/IDRpFsNSocoIATPrIPJCAFaWhAQ9yc3r+tgYj+B7feS1bu+75FheoI9CSTHEgr8k42xI7wV4UqENx6LxkAVlA4IFgAAACwAwCdASoMABgAPzmGulQvKSWjMAgB4CcJZQAAXla2zSrRVC+YAAD+2YB4wTfyPeFhMAwRyrYIb0xCMFpLoK+Hj29gFYSMApd95W+VDRNjTMqtJ6OiFAAA",
  },
  nearbyPortrait: {
    src: "/marketing/mockup/nearby-portrait.webp",
    width: 900,
    height: 1773,
    blurDataURL:
      "data:image/webp;base64,UklGRsoAAABXRUJQVlA4WAoAAAAQAAAACwAAFwAAQUxQSFEAAAABf6CQjSQ4ti/SAhzQRURgR8ssI/IDRpFsNSocoIATPrIPJCAFaWhAQ9yc3r+tgYj+B7feS1bu+75FheoI9CSTHEgr8k42xI7wV4UqENx6LxkAVlA4IFIAAADQAwCdASoMABgAPzmIuVQvKSWjMAgB4CcJaQDDNBwsF9i/HUkORIAA/tlh//ifsjCL0IcebdSCIM0VO/IRLLa3DuLHE1Mh0JAO+F/FcwyiwYAA",
  },
  historyLeft: {
    src: "/marketing/mockup/history-left.webp",
    width: 960,
    height: 1601,
    blurDataURL:
      "data:image/webp;base64,UklGRuIAAABXRUJQVlA4WAoAAAAQAAAACwAAEwAAQUxQSIkAAAANgFvb1rLo4K4pocv314FXYBkRix7ogwaIXULIiJxJNXN3nzd/DRExAQBBw90rcqOF++v+dtwE6oDN480swBIGA8AdxL8Qn09BQz4A1D9bQJO+dLEBn0+P+pIuXkAhbwBN+trpYQMGpSf0JX0ewIvBKhwCZ+VaPmCAJcCsPVWlor3zB97n3f4zAABWUDggMgAAALACAJ0BKgwAFAA/OYa5U68pJaKwCAHgJwlnAAB7IAD+7RXgjAUEu7vvIuMhYd5HAAAA",
  },
} as const satisfies Record<string, PhoneShot>;
