import { plates, type FoodPhoto } from "@/data/food-photos";

// The Our story page is built but not public yet: it is not linked in the nav,
// not in the sitemap and set to noindex. Flip this once photos and details are in.
export const STORY_LIVE = false;

type Bilingual = { en: string; de: string };

export interface StoryChapter {
  id: string;
  /** Short label on the timeline dot, e.g. a year. */
  label: Bilingual;
  title: Bilingual;
  text: Bilingual;
  /** Names to show as chips: pop-ups, markets, partners. */
  items?: string[];
  /** A real photo for this chapter. Until one is added the page shows a plate cut-out. */
  photo?: FoodPhoto;
  link?: { href: string; label: Bilingual };
  /** Decorative plate shown while there is no photo. */
  plate: FoodPhoto;
}

// Only what the owners have told us. Add dates, photos and links here; the page
// renders whatever is in this list.
export const chapters: StoryChapter[] = [
  {
    id: "cloud-kitchen",
    label: { en: "2021", de: "2021" },
    title: { en: "It began as a cloud kitchen", de: "Es begann als Cloud Kitchen" },
    text: {
      en: "In 2021 kokoland started with no dining room at all: a cloud kitchen cooking Kerala food for delivery and takeaway. Our dishes also found their way to people through Homemeal.",
      de: "2021 startete kokoland ganz ohne Gastraum: als Cloud Kitchen, die Kerala-Küche zum Liefern und Mitnehmen kochte. Unsere Gerichte erreichten die Leute auch über Homemeal.",
    },
    items: ["Delivery", "Takeaway", "Homemeal"],
    plate: plates.porottaBeef,
  },
  {
    id: "pop-ups",
    label: { en: "Pop-ups", de: "Pop-ups" },
    title: { en: "Then we went out to find people", de: "Dann gingen wir zu den Leuten" },
    text: {
      en: "We took the kitchen on the road: pop-ups at Babylon with We Desi, with Bite Club, and stalls at NK Flohmarkt and Markthalle Pfefferberg.",
      de: "Wir nahmen die Küche mit auf Tour: Pop-ups im Babylon mit We Desi, mit dem Bite Club sowie Stände auf dem NK Flohmarkt und in der Markthalle Pfefferberg.",
    },
    items: ["Bite Club", "We Desi at Babylon", "NK Flohmarkt", "Markthalle Pfefferberg"],
    plate: plates.samosa,
  },
  {
    id: "collabs",
    label: { en: "Collabs", de: "Kollabos" },
    title: { en: "Cooking with friends", de: "Kochen mit Freunden" },
    text: {
      en: "We teamed up with Vagabund on Museum Island, pairing Kerala plates with a Berlin crowd.",
      de: "Gemeinsam mit Vagabund auf der Museumsinsel brachten wir Kerala-Teller zu einem Berliner Publikum.",
    },
    items: ["Vagabund, Museum Island"],
    plate: plates.kappaFish,
  },
  {
    id: "weddings",
    label: { en: "Weddings", de: "Hochzeiten" },
    title: { en: "Weddings and private events", de: "Hochzeiten und private Feiern" },
    text: {
      en: "We have catered weddings and private events, from a few dozen guests to a full house.",
      de: "Wir haben Hochzeiten und private Feiern beliefert, von ein paar Dutzend Gästen bis zum vollen Haus.",
    },
    link: { href: "/catering", label: { en: "Plan your event", de: "Dein Event planen" } },
    plate: plates.puttuKadala,
  },
  {
    id: "guests",
    label: { en: "Guests", de: "Gäste" },
    title: { en: "Famous guests and kind words", de: "Prominente Gäste und freundliche Worte" },
    text: {
      en: "Along the way the actor Vineeth Sreenivasan came by to eat, and Mrinal wrote about us on her blog.",
      de: "Unterwegs kam der Schauspieler Vineeth Sreenivasan zum Essen vorbei, und Mrinal schrieb in ihrem Blog über uns.",
    },
    plate: plates.kappaBiryani,
  },
];
