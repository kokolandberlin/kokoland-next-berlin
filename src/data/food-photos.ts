// Studio photos of Kokoland dishes, cut out from their backdrop (transparent
// WebP, ~760px) and named with search keywords. Files live in /assets/food;
// the covers in /assets/covers are full-bleed 16:9 photos for page headers and
// social previews.

const f = (name: string) => `/assets/food/kokoland-berlin-${name}.webp`;
const c = (name: string) => `/assets/covers/kokoland-berlin-${name}.jpg`;

export interface FoodPhoto {
  src: string;
  alt: string;
}

export const plates = {
  porottaBeef: { src: f("porotta-with-kerala-beef-fry-indian-street-food"), alt: "Porotta with Kerala beef fry at kokoland Berlin" },
  porotta: { src: f("kerala-porotta-parotta-indian-bread"), alt: "Kerala porotta (parotta) at kokoland Berlin" },
  kappaBiryani: { src: f("kerala-kappa-biryani-indian-street-food"), alt: "Kerala kappa biryani, Indian street food at kokoland Berlin" },
  kappaFish: { src: f("kappa-with-kottayam-fish-curry-kerala-food"), alt: "Kappa with Kottayam fish curry at kokoland Berlin" },
  puttuKadala: { src: f("puttu-with-kadala-curry-kerala-breakfast"), alt: "Puttu with kadala curry, Kerala breakfast at kokoland Berlin" },
  puttu: { src: f("puttu-kerala-steamed-rice-cake"), alt: "Puttu, Kerala steamed rice cake at kokoland Berlin" },
  kadala: { src: f("kadala-curry-kerala-vegan-food"), alt: "Kadala curry, Kerala black chickpea curry at kokoland Berlin" },
  kokoChicken: { src: f("koko-chicken-fry-kerala-street-food"), alt: "Koko chicken fry, Kerala street food at kokoland Berlin" },
  beefDry: { src: f("kerala-beef-dry-fry-indian-street-food"), alt: "Kerala beef dry fry at kokoland Berlin" },
  beefCutlet: { src: f("beef-cutlet-kerala-street-food"), alt: "Beef cutlet, Kerala street food at kokoland Berlin" },
  porkRoast: { src: f("kerala-pork-roast-indian-food"), alt: "Kerala pork roast at kokoland Berlin" },
  chilliPork: { src: f("chilli-pork-indo-chinese-indian-street-food"), alt: "Chilli pork, Indo-Chinese Indian street food at kokoland Berlin" },
  paneerChilli: { src: f("paneer-chilli-indo-chinese-indian-street-food"), alt: "Paneer chilli, Indo-Chinese Indian street food at kokoland Berlin" },
  samosa: { src: f("veg-samosa-indian-street-food-snack"), alt: "Vegetable samosas, Indian street food at kokoland Berlin" },
  pakoda: { src: f("onion-pakoda-indian-street-food-snack"), alt: "Onion pakoda, Indian street food snack at kokoland Berlin" },
  bananaFritters: { src: f("banana-fritters-pazhampori-kerala-snack"), alt: "Banana fritters (pazhampori), a Kerala snack at kokoland Berlin" },
  coconutPudding: { src: f("coconut-pudding-kerala-dessert"), alt: "Coconut pudding, Kerala dessert at kokoland Berlin" },
  semiya: { src: f("semiya-kesari-indian-dessert"), alt: "Semiya kesari, Indian dessert at kokoland Berlin" },
  rice: { src: f("steamed-rice-kerala-indian-food"), alt: "Steamed rice in a coconut shell bowl at kokoland Berlin" },
  gheeRice: { src: f("ghee-rice-fried-onion-kerala-indian-food"), alt: "Ghee rice with fried onion at kokoland Berlin" },
  beefBowl: { src: f("beef-rice-bowl-kerala-indian-street-food"), alt: "Kerala beef rice bowl at kokoland Berlin" },
  curryBowl: { src: f("curry-rice-bowl-kerala-indian-street-food"), alt: "Kerala curry rice bowl at kokoland Berlin" },
  chickenRoll: { src: f("chicken-roll-kerala-street-food"), alt: "Kerala chicken roll at kokoland Berlin" },
  chickenWrap: { src: f("special-chicken-wrap-indian-street-food"), alt: "Special chicken wrap, Indian street food at kokoland Berlin" },
  chickenSandwich: { src: f("chicken-sandwich-indian-street-food"), alt: "Chicken sandwich, Indian street food at kokoland Berlin" },
  tofuWrap: { src: f("tofu-vegan-wrap-indian-street-food"), alt: "Tofu vegan wrap, Indian street food at kokoland Berlin" },
  tofuSandwich: { src: f("tofu-sandwich-vegan-indian-street-food"), alt: "Tofu sandwich, vegan Indian street food at kokoland Berlin" },
} satisfies Record<string, FoodPhoto>;

export const covers = {
  spread: { src: c("kerala-kitchen-indian-street-food-cover-1"), alt: "kokoland Kerala kitchen: Indian street food dishes from above" },
  feast: { src: c("kerala-kitchen-indian-street-food-cover-2"), alt: "kokoland Kerala kitchen: Kerala and Indian street food spread" },
  wraps: { src: c("kerala-kitchen-indian-street-food-cover-3"), alt: "kokoland Kerala kitchen: wraps, chilli pork and beef fry" },
  porottaCloseup: { src: c("kerala-kitchen-indian-street-food-closeup-1"), alt: "Porotta, beef fry and kappa biryani at kokoland Berlin" },
  closeup: { src: c("kerala-kitchen-indian-street-food-closeup-2"), alt: "Close-up of Kerala dishes at kokoland Berlin" },
} satisfies Record<string, FoodPhoto>;

// Order matters: the more specific names come first.
const BY_NAME: [RegExp, FoodPhoto][] = [
  [/porotta.*(beef|fry)|beef.*porotta/i, plates.porottaBeef],
  [/puttu.*(kadala|kadla|chickpea)|kadala.*puttu/i, plates.puttuKadala],
  [/kappa.*(fish|meen)/i, plates.kappaFish],
  [/kappa.*biryani|biryani.*kappa/i, plates.kappaBiryani],
  [/beef.*cutlet|cutlet/i, plates.beefCutlet],
  [/beef.*(dry|fry|roast|ularth)/i, plates.beefDry],
  [/chilli.*pork|pork.*chilli/i, plates.chilliPork],
  [/pork/i, plates.porkRoast],
  [/paneer.*chilli|chilli.*paneer/i, plates.paneerChilli],
  [/tofu.*(wrap)|vegan.*wrap/i, plates.tofuWrap],
  [/tofu.*sandwich/i, plates.tofuSandwich],
  [/chicken.*wrap/i, plates.chickenWrap],
  [/chicken.*roll/i, plates.chickenRoll],
  [/chicken.*sandwich/i, plates.chickenSandwich],
  [/koko.*chicken|chicken.*(fry|65)/i, plates.kokoChicken],
  [/samosa/i, plates.samosa],
  [/pakoda|pakora/i, plates.pakoda],
  [/banana.*(fritter|fry)|pazham/i, plates.bananaFritters],
  [/coconut.*pudding/i, plates.coconutPudding],
  [/semiya|kesari/i, plates.semiya],
  [/kadala|chickpea/i, plates.kadala],
  [/puttu/i, plates.puttu],
  [/ghee rice/i, plates.gheeRice],
  [/^(steamed |plain )?rice$/i, plates.rice],
  [/porotta|parotta|paratha/i, plates.porotta],
];

/** A studio photo for a dish by name, used when the dish has no photo of its own in DishData. */
export function photoForDish(name: string): FoodPhoto | null {
  for (const [re, photo] of BY_NAME) if (re.test(name)) return photo;
  return null;
}
