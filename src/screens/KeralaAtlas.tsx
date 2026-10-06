"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Pause, Play } from "lucide-react";
import Reveal from "@/components/Reveal";
import { Symbol, type SymbolName } from "@/components/Brand";
import type { MenuDish } from "@/lib/menu";

type Chip = { label: string; q?: string };
type Stop = { id: string; name: string; area: string; tag: string; body: string; chips: Chip[]; color: { bg: string; fg: string }; symbol: SymbolName };
type Culture = { name: string; body: string; symbol: SymbolName };
type Shop = { name: string; body: string };

const COLORS = [
  { bg: "#02664C", fg: "#F9F1E4" },
  { bg: "#F21B07", fg: "#F9F1E4" },
  { bg: "#FFCA40", fg: "#134033" },
  { bg: "#7BD348", fg: "#0A2620" },
  { bg: "#FF7008", fg: "#0A2620" },
  { bg: "#134033", fg: "#C0F252" },
  { bg: "#9C2704", fg: "#F9F1E4" },
  { bg: "#C0F252", fg: "#134033" },
];

// All of this is general culinary and cultural background on Kerala, written
// to tell the story of where the dishes on the menu come from.
const content = (de: boolean) =>
  de
    ? {
        kicker: "Eine Küste, viele Küchen",
        title: "Von Malabar bis Travancore",
        intro:
          "Kerala ist ein schmaler Küstenstreifen zwischen Westghats und Arabischem Meer, aber auf dem Teller ist es ein ganzer Kontinent. Händler, Pilger, Könige und Glaubensgemeinschaften haben hier über Jahrtausende gekocht. Reise einmal von Norden nach Süden.",
        north: "Norden",
        south: "Süden",
        pause: "Pause",
        play: "Abspielen",
        onPlate: "Auf dem Teller",
        onMenu: "Gerade auf unserer Karte",
        seeOnMenu: "Auf der Karte ansehen",
        culturesTitle: "Kulturen am Tisch",
        culturesIntro: "Keralas Küche gehört nicht einer Gemeinschaft. Sie ist ein langes Gespräch zwischen vielen.",
        shopsTitle: "Wo Kerala isst",
        shopsIntro: "Manche der besten Gerichte kommen nicht aus Restaurants.",
        stops: [
          { name: "Kannur & Kasaragod", area: "Nord-Malabar", tag: "Der hohe Norden", body: "Wo Kerala auf die Küste von Karnataka trifft. Thalassery hat dem Land seine berühmte Biryani geschenkt, Kannur die Theyyam-Rituale, und Kasaragod bringt einen Hauch Tulu-Küche mit. Es gibt gefüllte Miesmuscheln, scharfe Fischcurrys und Masalas, die mit frischer Kokosnuss gemahlen werden.", chips: [{ label: "Thalassery-Biryani", q: "biriyani" }, { label: "Gefüllte Miesmuscheln" }, { label: "Fischcurry" }] },
          { name: "Kozhikode & Malappuram", area: "Malabar-Küste", tag: "Die Mappila-Küche", body: "Calicut war der Hafen, an dem Vasco da Gama 1498 an Land ging, und der Gewürzhandel mit Arabien prägt die Küche bis heute. Die Mappila-Küche (der muslimischen Gemeinschaft Malabars) lebt von Dum-Biryani, hauchdünnem Pathiri, gefülltem Hähnchen, Halwa und würzigem Sulaimani-Tee.", chips: [{ label: "Kozhikodan Biryani", q: "biriyani" }, { label: "Pathiri", q: "pathiri" }, { label: "Sulaimani-Tee" }, { label: "Halwa" }] },
          { name: "Palakkad", area: "Die Palakkad-Lücke", tag: "Reis und Tamil-Einfluss", body: "Hier öffnen sich die Westghats zur Palakkad-Lücke, und die tamilische Kultur strömt herein. Auf den Feldern wächst der rote Matta-Reis, der das Sadya trägt. Die Küche der Palakkad-Iyer ist eine rein vegetarische Meisterklasse aus Tamarinde, Kokos und Jaggery: Sambar, Kootu, Pulissery und Mor Kuzhambu.", chips: [{ label: "Matta-Reis", q: "rice" }, { label: "Sambar" }, { label: "Pulissery" }, { label: "Kootu" }] },
          { name: "Thrissur", area: "Kulturhauptstadt Keralas", tag: "Pooram und Festmahl", body: "Die Kulturhauptstadt Keralas und Heimat des Thrissur Pooram, bei dem geschmückte Elefanten und Trommel-Ensembles die Stadt füllen. Im Bezirk liegt auch das antike Muziris, wo früh Händler, Christen, Muslime und Juden an Land gingen. Der Tisch spiegelt das wider: Sadya wie im Tempel, Rindfleisch-Fry der syrischen Christen und weiche Reisklößchen namens Pidi.", chips: [{ label: "Sadya" }, { label: "Beef Fry", q: "beef" }, { label: "Pidi & Hähnchen" }] },
          { name: "Kochi & Ernakulam", area: "Der alte Gewürzhafen", tag: "Eine Hafenstadt voller Einflüsse", body: "Araber, Chinesen, Portugiesen, Niederländer, Briten und eine jüdische Gemeinde haben in Kochi ihre Spuren hinterlassen. Das schmeckt man in Fisch-Molee in Kokosmilch, in den Bäckereien von Fort Kochi mit ihren Cutlets und Puffs und im Fang von den chinesischen Fischernetzen.", chips: [{ label: "Fisch-Molee" }, { label: "Garnelen-Roast" }, { label: "Cutlet", q: "cutlet" }] },
          { name: "Kuttanad & Kottayam", area: "Die Backwaters", tag: "Wasser, Toddy und Nasrani-Küche", body: "Hier liegen Reisfelder unter dem Meeresspiegel zwischen Kanälen. Es gibt Karimeen (Perlbuntbarsch) im Bananenblatt, Entencurry und das Kottayam-Fischcurry mit Kudampuli. In den Toddy-Shops gehört Kappa (Maniok) mit scharfem Fischcurry dazu. Die syrisch-christliche (Nasrani) Küche zeigt sich hier am reichsten: Appam mit Stew, Roasts mit Kokosspänen.", chips: [{ label: "Karimeen Pollichathu" }, { label: "Entencurry" }, { label: "Kappa & Fischcurry" }, { label: "Appam & Stew" }] },
          { name: "Idukki & Wayanad", area: "Das Hügelland", tag: "Gewürzgärten und Waldküche", body: "Kardamom, Pfeffer, Kaffee und Tee wachsen hier in den Hügeln, und das Essen ist genauso ursprünglich. Die Adivasi-Küchen kennen Bambusreis, Wildhonig, Knollen und Hirse. Aus Wayanad kommt der duftende Gandhakasala-Reis.", chips: [{ label: "Gandhakasala-Reis" }, { label: "Bambusreis" }, { label: "Kappa & Chammanthi" }] },
          { name: "Travancore", area: "Alappuzha bis Thiruvananthapuram", tag: "Das große Sadya", body: "Die Heimat des großen Sadya auf dem Bananenblatt: Sambar, Avial, Olan, Pachadi, Parippu mit Ghee und Payasam. Tempel servieren legendäre Opfergaben wie den Palpayasam von Ambalapuzha, Aranmula verköstigt mit dem Valla Sadya die Bootsrennen-Pilger, Kollam ist für seine Cashews bekannt, und im Süden gibt es Ulli Theeyal und Puttu mit Kadala.", chips: [{ label: "Onam-Sadya", q: "sadhya" }, { label: "Palpayasam" }, { label: "Ulli Theeyal" }, { label: "Puttu & Kadala", q: "puttu" }] },
        ],
        cultures: [
          { name: "Tempel & Sadya", symbol: "sadya", body: "Hinduistische Küchen, von Nair-Haushalten bis zu den Namboothiri-Tempelküchen: vegetarische Festessen auf dem Bananenblatt, bei Onam und Vishu mit über zwanzig Gerichten." },
          { name: "Syrische Christen", symbol: "kalasam", body: "Eine der ältesten christlichen Gemeinschaften der Welt. Ihre Küche brachte Appam mit Stew, Fisch-Molee, Entenbraten und Rindfleisch mit Kokosspänen auf den Tisch, vor allem zu Ostern und Weihnachten." },
          { name: "Mappila-Muslime", symbol: "grain", body: "Aus Jahrhunderten des Handels mit Arabien: Dum-Biryani, Pathiri, Unnakkaya, Chatti Pathiri, und abends beim Fastenbrechen im Ramadan ein langer Tisch voller Snacks." },
          { name: "Küsten- und Fischergemeinden", symbol: "fish", body: "Der Fang des Tages, sauer mit Kudampuli, in Kokosmilch oder knusprig gebraten. Fisch ist für Kerala fast ein Grundnahrungsmittel." },
          { name: "Palakkad-Iyer", symbol: "greens", body: "Tamilische Brahmanen-Küchen im Palakkad-Tal: vegetarisch, mit Tamarinde, Kokos und Jaggery, und mit Gerichten wie Kootu und Mor Kuzhambu." },
          { name: "Adivasi-Küchen", symbol: "paddy", body: "In den Hügeln von Wayanad und Idukki: Bambusreis, Hirse, Wurzelknollen und Waldhonig, gekocht mit dem, was die Jahreszeit gibt." },
          { name: "Die jüdische Gemeinde Kochis", symbol: "star", body: "Eine der ältesten jüdischen Gemeinden Indiens ließ sich in Kochi nieder. Ihre Festtagsküche gehört zur bunten Mischung aus Kokos, Gewürzen und Backkunst der Stadt." },
          { name: "Händler und Seefahrer", symbol: "sunring", body: "Araber, Chinesen, Portugiesen, Niederländer und Briten kamen wegen des Pfeffers. Die Portugiesen brachten Chili, Cashew und Maniok, die heute aus Keralas Küche nicht mehr wegzudenken sind." },
        ] as Culture[],
        shops: [
          { name: "Chaya Kada", body: "Der Teeladen an der Ecke: Milchtee, Zeitung, Gespräch und ein Parippu Vada dazu." },
          { name: "Thattukada", body: "Blechbuden am Straßenrand, die bis spät in die Nacht offen haben: Porotta mit Rind, Omelett, Dosa." },
          { name: "Kallu Shappu", body: "Toddy-Shops, in denen Kappa mit scharfem Fischcurry geteilt wird. Sehr laut, sehr lecker." },
          { name: "Bäckerei", body: "Keralas Bäckereien sind Snackläden: Gemüse-Cutlets, Puffs, Rolls und süße Brötchen." },
          { name: "Oonu", body: "Das Reis-Mittagessen auf dem Blatt mit Thoran, Sambar, Pickles und Papadam." },
        ] as Shop[],
      }
    : {
        kicker: "One coast, many kitchens",
        title: "From Malabar to Travancore",
        intro:
          "Kerala is a narrow strip of coast between the Western Ghats and the Arabian Sea, but on the plate it is a whole continent. Traders, pilgrims, kings and faiths have cooked here for thousands of years. Take the trip from north to south.",
        north: "North",
        south: "South",
        pause: "Pause",
        play: "Play",
        onPlate: "On the plate",
        onMenu: "On our menu right now",
        seeOnMenu: "See it on the menu",
        culturesTitle: "Cultures at the table",
        culturesIntro: "Kerala's food doesn't belong to one community. It is a long conversation between many.",
        shopsTitle: "Where Kerala eats",
        shopsIntro: "Some of the best food never comes from a restaurant.",
        stops: [
          { name: "Kannur & Kasaragod", area: "North Malabar", tag: "The far north", body: "Where Kerala meets the Karnataka coast. Thalassery gave the country its famous biryani, Kannur its theyyam rituals, and Kasaragod brings a hint of Tulu cooking. Expect stuffed mussels, fiery fish curries and masalas ground with fresh coconut.", chips: [{ label: "Thalassery biryani", q: "biriyani" }, { label: "Stuffed mussels" }, { label: "Fish curry" }] },
          { name: "Kozhikode & Malappuram", area: "The Malabar coast", tag: "The Mappila kitchen", body: "Calicut is the port where Vasco da Gama landed in 1498, and the spice trade with Arabia still shapes the food. The Mappila kitchen (of Malabar's Muslim community) runs on dum biryani, paper-thin pathiri, stuffed chicken, halwa and spiced sulaimani tea.", chips: [{ label: "Kozhikodan biryani", q: "biriyani" }, { label: "Pathiri", q: "pathiri" }, { label: "Sulaimani tea" }, { label: "Halwa" }] },
          { name: "Palakkad", area: "The Palakkad Gap", tag: "Rice and Tamil influence", body: "Here the Western Ghats open into the Palakkad Gap and Tamil culture flows in. The fields grow the red matta rice that anchors the sadya. The Palakkad Iyer kitchen is a fully vegetarian masterclass in tamarind, coconut and jaggery: sambar, kootu, pulissery and mor kuzhambu.", chips: [{ label: "Matta rice", q: "rice" }, { label: "Sambar" }, { label: "Pulissery" }, { label: "Kootu" }] },
          { name: "Thrissur", area: "Kerala's cultural capital", tag: "Pooram and feasts", body: "Kerala's cultural capital and home of the Thrissur Pooram, when decorated elephants and drum ensembles fill the city. The district also holds ancient Muziris, where traders, Christians, Muslims and Jews arrived early. The table reflects it: temple-style sadya, Syrian Christian beef fry and the soft rice dumplings called pidi.", chips: [{ label: "Sadya" }, { label: "Beef fry", q: "beef" }, { label: "Pidi & chicken" }] },
          { name: "Kochi & Ernakulam", area: "The old spice port", tag: "A harbour of influences", body: "Arabs, Chinese, Portuguese, Dutch, British and a Jewish community all left a mark on Kochi. You can taste it in fish molee in coconut milk, in the Fort Kochi bakeries with their cutlets and puffs, and in the catch from the Chinese fishing nets.", chips: [{ label: "Fish molee" }, { label: "Prawn roast" }, { label: "Cutlet", q: "cutlet" }] },
          { name: "Kuttanad & Kottayam", area: "The backwaters", tag: "Water, toddy and Nasrani cooking", body: "Rice paddies lie below sea level between canals. Expect karimeen (pearl spot) in banana leaf, duck curry and Kottayam fish curry soured with kudampuli. In the toddy shops, kappa (tapioca) comes with a fiery fish curry. Syrian Christian (Nasrani) cooking is at its richest here: appam with stew, roasts with coconut slices.", chips: [{ label: "Karimeen pollichathu" }, { label: "Duck curry" }, { label: "Kappa & fish curry" }, { label: "Appam & stew" }] },
          { name: "Idukki & Wayanad", area: "The hill country", tag: "Spice gardens and forest kitchens", body: "Cardamom, pepper, coffee and tea grow in these hills, and the food is just as wild. Adivasi kitchens cook with bamboo rice, wild honey, tubers and millets. Wayanad gives us the fragrant gandhakasala rice.", chips: [{ label: "Gandhakasala rice" }, { label: "Bamboo rice" }, { label: "Kappa & chammanthi" }] },
          { name: "Travancore", area: "Alappuzha to Thiruvananthapuram", tag: "The grand sadya", body: "Home of the grand sadya on a banana leaf: sambar, avial, olan, pachadi, parippu with ghee and payasam. Temples serve legendary offerings like Ambalapuzha's palpayasam, Aranmula feeds boat-race pilgrims with its valla sadya, Kollam is known for cashews, and the south adds ulli theeyal and puttu with kadala.", chips: [{ label: "Onam sadya", q: "sadhya" }, { label: "Palpayasam" }, { label: "Ulli theeyal" }, { label: "Puttu & kadala", q: "puttu" }] },
        ],
        cultures: [
          { name: "Temple & sadya", symbol: "sadya", body: "Hindu kitchens, from Nair households to Namboothiri temple kitchens: vegetarian feasts on a banana leaf, with twenty-plus dishes at Onam and Vishu." },
          { name: "Syrian Christians", symbol: "kalasam", body: "One of the oldest Christian communities in the world. Their kitchen gave us appam with stew, fish molee, duck roast and beef with coconut slices, especially at Easter and Christmas." },
          { name: "Mappila Muslims", symbol: "grain", body: "From centuries of trade with Arabia: dum biryani, pathiri, unnakkaya, chatti pathiri, and a long table of snacks to break the fast at Ramadan." },
          { name: "Coastal & fishing communities", symbol: "fish", body: "The catch of the day, soured with kudampuli, simmered in coconut milk or fried crisp. Fish is close to a staple in Kerala." },
          { name: "Palakkad Iyers", symbol: "greens", body: "Tamil Brahmin kitchens of the Palakkad valley: vegetarian, built on tamarind, coconut and jaggery, with dishes like kootu and mor kuzhambu." },
          { name: "Adivasi kitchens", symbol: "paddy", body: "In the hills of Wayanad and Idukki: bamboo rice, millets, root tubers and forest honey, cooked with whatever the season gives." },
          { name: "Kochi's Jewish community", symbol: "star", body: "One of India's oldest Jewish communities settled in Kochi. Its festive cooking is part of the city's mix of coconut, spice and baking." },
          { name: "Traders & seafarers", symbol: "sunring", body: "Arabs, Chinese, Portuguese, Dutch and British came for the pepper. The Portuguese brought chilli, cashew and cassava, now impossible to imagine in Kerala's cooking." },
        ] as Culture[],
        shops: [
          { name: "Chaya kada", body: "The corner tea shop: milky tea, the newspaper, conversation and a parippu vada on the side." },
          { name: "Thattukada", body: "Tin roadside stalls that stay open late: porotta and beef, omelettes, dosa." },
          { name: "Kallu shappu", body: "Toddy shops where kappa and fiery fish curry are shared round a table. Loud and delicious." },
          { name: "Bakery", body: "Kerala's bakeries are snack shops: vegetable cutlets, puffs, rolls and sweet buns." },
          { name: "Oonu", body: "The rice lunch on a leaf with thoran, sambar, pickle and papadam." },
        ] as Shop[],
      };

const SYMBOLS: SymbolName[] = ["kombu", "mridangam", "paddy", "chenda", "elephant-duo", "fish", "greens", "kalasam"];

const KeralaAtlas = ({ de, dishes, onPick, showHeading = true }: { de: boolean; dishes: MenuDish[]; onPick: (q: string) => void; showHeading?: boolean }) => {
  const c = content(de);
  const stops: Stop[] = c.stops.map((s, i) => ({ ...s, id: `stop-${i}`, color: COLORS[i % COLORS.length], symbol: SYMBOLS[i % SYMBOLS.length] }));
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(false);
  const [hover, setHover] = useState(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onMenu = (q?: string) => !!q && dishes.some((d) => `${d.name} ${d.category}`.toLowerCase().includes(q));

  useEffect(() => {
    setAuto(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!auto || hover) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % stops.length), 7500);
    return () => window.clearInterval(id);
  }, [auto, hover, stops.length]);

  const go = (i: number, manual = true) => {
    setIdx(i);
    if (manual) setAuto(false);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (idx + (e.key === "ArrowRight" ? 1 : -1) + stops.length) % stops.length;
    go(n);
    refs.current[n]?.focus();
  };
  const cur = stops[idx];

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-5">
      {showHeading ? (
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-chili">{c.kicker}</span>
          <h2 className="mt-3 font-display text-5xl font-extrabold leading-[0.95] lg:text-7xl">{c.title}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-forest/75">{c.intro}</p>
        </Reveal>
      ) : (
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-chili">{c.kicker}</span>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-[0.95] lg:text-6xl">{c.title}</h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-forest/75">{c.intro}</p>
        </Reveal>
      )}

      {/* ---- the route, north to south ---- */}
      <div className="mt-14" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.25em] text-forest/55">
          <span>↑ {c.north}</span>
          <button onClick={() => setAuto((a) => !a)} className="inline-flex items-center gap-1.5 rounded-full border-2 border-forest/15 px-3 py-1 normal-case tracking-normal transition-colors hover:border-forest" aria-label={auto ? c.pause : c.play}>
            {auto ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />} {auto ? c.pause : c.play}
          </button>
          <span>{c.south} ↓</span>
        </div>

        <div role="tablist" aria-label={c.title} onKeyDown={onKey} className="relative flex gap-2 overflow-x-auto pb-4 pt-2 [scrollbar-width:none] md:justify-between">
          <div className="pointer-events-none absolute left-4 right-4 top-[26px] hidden h-1 rounded-full bg-forest/10 md:block" aria-hidden>
            <motion.div className="h-full rounded-full" style={{ background: cur.color.bg }} animate={{ width: `${(idx / (stops.length - 1)) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
          </div>
          {stops.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => { refs.current[i] = el; }}
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={i === idx}
              aria-controls={`panel-${s.id}`}
              tabIndex={i === idx ? 0 : -1}
              onClick={() => go(i)}
              className="relative z-10 flex shrink-0 flex-col items-center gap-1.5 px-1 md:w-24"
            >
              <motion.span
                animate={{ scale: i === idx ? 1.18 : 1 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-cream font-display text-base font-extrabold shadow-md"
                style={{ background: i <= idx ? s.color.bg : "#E7DFD0", color: i <= idx ? s.color.fg : "#134033" }}
              >
                {i + 1}
              </motion.span>
              <span className={`text-center text-[11px] font-bold leading-tight md:text-xs ${i === idx ? "text-forest" : "text-forest/55"}`}>{s.name}</span>
            </button>
          ))}
        </div>

        {stops.map((s, i) => (
          <motion.div
            key={s.id}
            role="tabpanel"
            id={`panel-${s.id}`}
            aria-labelledby={`tab-${s.id}`}
            hidden={i !== idx}
            initial={false}
            animate={i === idx ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5, ease: [0.21, 0.7, 0.25, 1] }}
          >
            <div className="relative overflow-hidden rounded-[2rem] p-7 sm:p-10" style={{ background: s.color.bg, color: s.color.fg }}>
              <Symbol name={s.symbol} className="pointer-events-none absolute -bottom-10 -right-8 h-64 w-64 rotate-12 opacity-15" />
              <div className="relative grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <span className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest" style={{ background: s.color.fg, color: s.color.bg }}>{s.area}</span>
                  <h3 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{s.name}</h3>
                  <p className="mt-2 font-display text-lg font-bold opacity-80">{s.tag}</p>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-lg leading-relaxed opacity-90">{s.body}</p>
                  <div className="mt-6 text-xs font-bold uppercase tracking-[0.2em] opacity-70">{c.onPlate}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {s.chips.map((chip) => {
                      const live = onMenu(chip.q);
                      return chip.q && live ? (
                        <button key={chip.label} onClick={() => onPick(chip.q!)} title={c.seeOnMenu} className="group inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5" style={{ borderColor: s.color.fg, background: s.color.fg, color: s.color.bg }}>
                          <span className="h-2 w-2 rounded-full bg-chili" aria-hidden /> {chip.label} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ) : (
                        <span key={chip.label} className="rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold" style={{ borderColor: `${s.color.fg}66` }}>{chip.label}</span>
                      );
                    })}
                  </div>
                  {s.chips.some((x) => onMenu(x.q)) && <p className="mt-3 text-xs font-medium opacity-70"><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-chili align-middle" aria-hidden />{c.onMenu}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ---- cultures ---- */}
      <div className="mt-24">
        <Reveal>
          <h3 className="font-display text-4xl font-extrabold leading-[0.95] lg:text-5xl">{c.culturesTitle}</h3>
          <p className="mt-3 max-w-2xl text-forest/70">{c.culturesIntro}</p>
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.cultures.map((cu, i) => (
            <motion.div
              key={cu.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border-2 border-forest/10 bg-white/60 p-6 backdrop-blur transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-cream"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-forest transition-transform duration-500 group-hover:rotate-[360deg]">
                <Symbol name={cu.symbol} className="h-8 w-8" />
              </span>
              <h4 className="mt-4 font-display text-xl font-extrabold leading-snug">{cu.name}</h4>
              <p className="mt-2 text-sm leading-relaxed opacity-75">{cu.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ---- shop cultures ---- */}
      <div className="mt-20">
        <Reveal>
          <h3 className="font-display text-4xl font-extrabold leading-[0.95] lg:text-5xl">{c.shopsTitle}</h3>
          <p className="mt-3 text-forest/70">{c.shopsIntro}</p>
        </Reveal>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <AnimatePresence>
            {c.shops.map((sh, i) => (
              <motion.div
                key={sh.name}
                initial={{ opacity: 0, rotate: i % 2 ? 2 : -2, y: 24 }}
                whileInView={{ opacity: 1, rotate: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ rotate: i % 2 ? -1.5 : 1.5, y: -4 }}
                className="rounded-2xl p-5"
                style={{ background: COLORS[(i * 3 + 1) % COLORS.length].bg, color: COLORS[(i * 3 + 1) % COLORS.length].fg }}
              >
                <h4 className="font-display text-lg font-extrabold">{sh.name}</h4>
                <p className="mt-1.5 text-sm leading-snug opacity-85">{sh.body}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default KeralaAtlas;
