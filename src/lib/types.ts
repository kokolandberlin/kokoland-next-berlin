export type MenuCategory = "veg" | "non-veg";
export type MenuType = "starter" | "main" | "side" | "dessert" | "drink";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  type: MenuType;
  is_vegan: boolean;
  heat: number;
  image_url: string | null;
  is_paused: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  discount_label: string | null;
  code: string | null;
  image_url: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
};

// Shape consumed by the public Menu UI (mirrors the original static Dish).
export type Dish = {
  id: string;
  name: string;
  price: number;
  desc: string;
  // Optional: DishData's `recipes` table (the live menu source) has no
  // veg/non-veg field, so real recipes come through with category unset
  // rather than a guessed value. Menu.tsx's veg/non-veg filter pills simply
  // don't match an unset category (not shown as either) — never fabricated.
  category?: MenuCategory;
  type: MenuType;
  vegan?: boolean;
  hot?: number;
};

export const menuItemToDish = (m: MenuItem): Dish => ({
  id: m.id,
  name: m.name,
  price: Number(m.price),
  desc: m.description,
  category: m.category,
  type: m.type,
  vegan: m.is_vegan,
  hot: m.heat,
});

// DishData's recipes.category is free text (e.g. "Starters"/"Mains"), used
// by both POS and the web Storefront — semantically the course grouping,
// i.e. Dish.type here, NOT Dish.category (which is the veg/non-veg axis
// recipes has no data for at all). Minimal shape so this stays decoupled
// from DishData's full Recipe type.
export interface DishDataRecipe {
  id: string;
  name: string;
  category: string;
  price: number;
  emoji?: string | null;
  image_url?: string | null;
}

const RECIPE_CATEGORY_TO_TYPE: Record<string, MenuType> = {
  starters: "starter",
  starter: "starter",
  appetizers: "starter",
  mains: "main",
  main: "main",
  sides: "side",
  side: "side",
  desserts: "dessert",
  dessert: "dessert",
  drinks: "drink",
  drink: "drink",
  beverages: "drink",
};

export const recipeToDish = (r: DishDataRecipe): Dish => ({
  id: r.id,
  name: r.name,
  price: Number(r.price),
  desc: "",
  type: RECIPE_CATEGORY_TO_TYPE[r.category.trim().toLowerCase()] ?? "main",
  // category (veg/non-veg) intentionally omitted — no source data.
});
