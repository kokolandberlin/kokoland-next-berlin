export type Dish = {
  id?: string;
  name: string;
  price: number; // EUR
  desc: string;
  category: "veg" | "non-veg";
  type: "starter" | "main" | "side" | "dessert" | "drink";
  vegan?: boolean;
  hot?: number; // 0–3 chilis
};

export const dishes: Dish[] = [
  { name: "Fish Moilee", price: 16.5, desc: "Coconut milk curry with Kerala spices", category: "non-veg", type: "main", hot: 1 },
  { name: "Chicken Mappas", price: 15.0, desc: "Creamy coconut-based chicken curry", category: "non-veg", type: "main", hot: 1 },
  { name: "Malabar Biryani", price: 14.5, desc: "Fragrant rice with spices and meat", category: "non-veg", type: "main", hot: 2 },
  { name: "Puttu & Kadala", price: 11.0, desc: "Steamed rice cakes with chickpea curry", category: "veg", type: "main", vegan: true, hot: 1 },
  { name: "Appam with Stew", price: 11.5, desc: "Rice pancakes with vegetable stew", category: "veg", type: "main", vegan: true, hot: 0 },
  { name: "Beef Fry", price: 17.0, desc: "Kerala-style spicy beef, Thattukada way", category: "non-veg", type: "main", hot: 3 },
  { name: "Avial", price: 8.5, desc: "Mixed vegetables in coconut and yogurt", category: "veg", type: "side", hot: 0 },
  { name: "Kerala Chicken 65", price: 9.0, desc: "Crispy spiced chicken bites", category: "non-veg", type: "starter", hot: 2 },
  { name: "Banana Chips", price: 4.5, desc: "Thin-cut plantain chips with spices", category: "veg", type: "starter", vegan: true, hot: 0 },
  { name: "Parippu Vada", price: 5.5, desc: "Lentil fritters with coconut chutney", category: "veg", type: "starter", vegan: true, hot: 1 },
  { name: "Payasam", price: 6.0, desc: "Sweet vermicelli pudding", category: "veg", type: "dessert", hot: 0 },
  { name: "Unniyappam", price: 6.5, desc: "Deep-fried rice cakes with jaggery", category: "veg", type: "dessert", hot: 0 },
  { name: "Masala Chai", price: 3.5, desc: "Traditional spiced tea", category: "veg", type: "drink", vegan: true, hot: 0 },
  { name: "Kerala Lemonade", price: 4.0, desc: "Fresh lime with ginger and spices", category: "veg", type: "drink", vegan: true, hot: 0 },
  { name: "Kerala Filter Coffee", price: 3.5, desc: "Strong South Indian coffee", category: "veg", type: "drink", hot: 0 },
];

export const formatEur = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
