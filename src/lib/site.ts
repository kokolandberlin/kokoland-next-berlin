export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://kokoland.de").replace(/\/$/, "");

/**
 * Delivery from our own site is not open yet. Until it is, guests are sent to
 * the delivery partners. Set DELIVERY_LIVE to true to switch our own delivery
 * on again in the checkout (zones and fees are managed in DishData).
 */
export const DELIVERY_LIVE = false;

// Plain store links, without the tracking and location parameters the apps add.
export const DELIVERY_PARTNERS = [
  { name: "Wolt", href: "https://wolt.com/de/deu/berlin/restaurant/kokoland-kerala-kitchen-indian-food-2" },
  { name: "Uber Eats", href: "https://www.ubereats.com/de/store/kokoland-kerala-kitchen-%26-indian-food/L4SF-uBHSz2kSzQuQL3Xfw" },
] as const;
