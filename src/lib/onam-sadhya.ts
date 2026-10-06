// Content for /onam-sadhya. Dish names and descriptions are the 2026 menu from
// the old kokoland.de Sadhya page; season dates are from the 2022-2026 pages.

export type GroupId = "sides" | "veg" | "rice" | "sweet";

export const GROUPS: Record<GroupId, { label: string; blurb: string; color: string }> = {
  sides: { label: "Crunch & tang", blurb: "The small things that wake up the leaf.", color: "#FFCA40" },
  veg: { label: "Curries & veg", blurb: "Coconut, curry leaves and patience.", color: "#F9F1E4" },
  rice: { label: "Rice & pours", blurb: "The base, and everything you ladle over it.", color: "#FF7008" },
  sweet: { label: "The sweet finish", blurb: "Milk, jaggery and a slow stir.", color: "#F21B07" },
};

export const GROUP_ORDER: GroupId[] = ["sides", "veg", "rice", "sweet"];

export interface Dish {
  id: string;
  name: string;
  desc: string;
  group: GroupId;
  /** Position on the banana-leaf illustration (1000 x 440 viewBox). */
  x: number;
  y: number;
  r: number;
  fill?: string;
}

export const DISHES: Dish[] = [
  { id: "kaya-varuthathu", name: "Kaya Varuthathu", desc: "Crunchy fried banana chips.", group: "sides", x: 232, y: 258, r: 22 },
  { id: "sarkaravaraty", name: "Sarkaravaraty", desc: "Banana chips coated in jaggery.", group: "sides", x: 300, y: 308, r: 22 },
  { id: "pappadam", name: "Pappadam", desc: "Crispy rice flour wafers.", group: "sides", x: 400, y: 318, r: 28 },
  { id: "achar", name: "Achar", desc: "Spicy Kerala-style pickle.", group: "sides", x: 175, y: 160, r: 16 },
  { id: "pulinji", name: "Pulinji", desc: "Sweet and tangy chutney made with tamarind, ginger, and jaggery.", group: "sides", x: 240, y: 195, r: 18 },

  { id: "thoran", name: "Thoran", desc: "Stir-fried seasonal vegetables with grated coconut.", group: "veg", x: 300, y: 135, r: 26 },
  { id: "avial", name: "Avial", desc: "A signature Kerala curry made with vegetables, coconut, and curry leaves.", group: "veg", x: 385, y: 135, r: 28 },
  { id: "olan", name: "Olan", desc: "Ash gourd and cowpeas cooked in coconut milk.", group: "veg", x: 470, y: 135, r: 26 },
  { id: "erisseri", name: "Erisseri", desc: "Pumpkin and coconut curry.", group: "veg", x: 555, y: 135, r: 26 },
  { id: "kootukary", name: "Kootukary", desc: "Mixed vegetables and lentils tempered with coconut.", group: "veg", x: 640, y: 135, r: 26 },
  { id: "pachadi", name: "Pachadi", desc: "Sweet-sour yogurt raita with fruits or vegetables.", group: "veg", x: 720, y: 140, r: 24 },
  { id: "kichadi", name: "Kichadi", desc: "A mildly sweet and tangy yogurt side dish.", group: "veg", x: 795, y: 150, r: 24 },

  { id: "matta-rice", name: "Matta Rice", desc: "Traditional Kerala red rice with a nutty flavor.", group: "rice", x: 500, y: 290, r: 52, fill: "#F9F9F9" },
  { id: "sambar", name: "Sambar", desc: "Lentil-based mixed vegetable stew flavored with tamarind and spices.", group: "rice", x: 625, y: 262, r: 24 },
  { id: "pulissery", name: "Pulissery", desc: "Creamy yogurt curry with mild spices.", group: "rice", x: 668, y: 318, r: 22 },
  { id: "rasam", name: "Rasam", desc: "A tangy and spicy tomato-based soup.", group: "rice", x: 595, y: 345, r: 20 },
  { id: "moru", name: "Moru", desc: "Spiced buttermilk curry: buttermilk simmered with turmeric, green chilies, and curry leaves.", group: "rice", x: 735, y: 295, r: 22 },

  { id: "payasam", name: "Payasam", desc: "Traditional Kerala dessert with milk, jaggery, and vermicelli/rice ada.", group: "sweet", x: 850, y: 255, r: 32 },
];

export const STEPS = [
  { n: "01", title: "Hands first", body: "A sadhya is eaten with your hands. Tradition says it tastes better that way." },
  { n: "02", title: "Start dry, go wet", body: "Begin with rice and the dry dishes, a little of each: thoran, avial, olan. Then sambar over the rice, followed by rasam and pulissery." },
  { n: "03", title: "Sweet, then cool", body: "Payasam comes next. Moru, the spiced buttermilk, closes the meal with the last of the rice." },
  { n: "04", title: "Fold it toward you", body: "When you are done, fold the leaf toward you. It is the polite way to say thank you." },
];

export interface SeasonDate {
  label: string;
  soldOut?: boolean;
}

export const SEASONS: { year: number; dates: SeasonDate[] }[] = [
  { year: 2022, dates: [{ label: "4 Sep" }, { label: "11 Sep", soldOut: true }, { label: "17 Sep" }] },
  { year: 2023, dates: [{ label: "9 Sep", soldOut: true }, { label: "16 Sep" }] },
  { year: 2025, dates: [{ label: "30 Aug" }, { label: "5 Sep" }, { label: "6 Sep" }] },
  { year: 2026, dates: [{ label: "22 Aug" }, { label: "26 Aug", soldOut: true }, { label: "29 Aug", soldOut: true }, { label: "30 Aug", soldOut: true }] },
];

export const FAQS = [
  {
    q: "What is an Onam sadhya?",
    a: "Onam is Kerala's harvest festival, and the sadhya is its feast: a vegetarian meal of many small dishes served together on a banana leaf, each with its own place on the leaf.",
  },
  {
    q: "What is on the kokoland Onam sadhya?",
    a: "Eighteen dishes: matta rice, sambar, rasam, moru, pulissery, avial, thoran, pachadi, kichadi, erisseri, olan, kootukary, pulinji, achar, pappadam, banana chips, jaggery-coated banana chips (sarkaravaraty) and payasam.",
  },
  {
    q: "Is the sadhya vegetarian?",
    a: "Yes, every dish is vegetarian. Several contain dairy, such as yogurt, buttermilk and the milk in the payasam, so tell us about any allergies when you order.",
  },
  {
    q: "When can I get the sadhya?",
    a: "We cook it around Onam on a few set days in late August or September, and the days fill up quickly. Pre-orders are announced ahead of the festival. If you would like it on another day, ask us and we will see what we can do.",
  },
  {
    q: "Takeaway, dine-in or delivery?",
    a: "Past seasons offered takeaway and dine-in, and in 2025 we delivered it to doorsteps too. In 2026 you could also add a real banana leaf to your order.",
  },
];
