import type { SymbolName } from "@/components/Brand";
import type { MenuDish } from "@/lib/menu";

// Each menu category gets its own brand colour and illustrated symbol, used by
// the category tiles, section headers, chips and the art panel of any dish
// that has no photo yet.

export interface CategoryTheme {
  bg: string;
  fg: string;
  symbol: SymbolName;
  /** A live dish photo that represents the category, if any dish has one. */
  image: string | null;
}

const PALETTE = [
  { bg: "#C0F252", fg: "#134033" },
  { bg: "#F21B07", fg: "#F9F1E4" },
  { bg: "#FFCA40", fg: "#134033" },
  { bg: "#FF7008", fg: "#0A2620" },
  { bg: "#7BD348", fg: "#0A2620" },
  { bg: "#02664C", fg: "#F9F1E4" },
  { bg: "#F9F1E4", fg: "#134033" },
  { bg: "#9C2704", fg: "#F9F1E4" },
];

export function symbolFor(category: string): SymbolName {
  const c = category.toLowerCase();
  if (/beverage|drink|getr(ä|ae)nk|chai|tea/.test(c)) return "cardamom";
  if (/dessert|sweet|payasam/.test(c)) return "bloom";
  if (/biriy|biryani|rice|pulao/.test(c)) return "grain";
  if (/porotta|parotta|pathiri|puttu|idiyappam|appam|idli/.test(c)) return "sunring";
  if (/sadya|sadhya|feast|meals/.test(c)) return "sadya";
  if (/salad|veg|green/.test(c)) return "greens";
  if (/special/.test(c)) return "star";
  if (/snack|starter|extra/.test(c)) return "mridangam";
  return "paddy";
}

export function categoryThemes(ordered: string[], dishes: MenuDish[]): Record<string, CategoryTheme> {
  const out: Record<string, CategoryTheme> = {};
  ordered.forEach((cat, i) => {
    const photo = dishes.find((d) => d.category === cat && d.image_url)?.image_url ?? null;
    out[cat] = { ...PALETTE[i % PALETTE.length], symbol: symbolFor(cat), image: photo };
  });
  return out;
}
