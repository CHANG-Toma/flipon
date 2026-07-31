export type Energy = "basse" | "moyenne" | "haute";
export type Place = "dedans" | "dehors" | "peu-importe";
export type Budget = "0" | "20" | "50" | "80+";
export type Duration = "30" | "60" | "120" | "soirée";

export type Plan = {
  id: string;
  title: string;
  blurb: string;
  steps: string[];
  durationMin: number;
  budgetMax: number;
  energy: Energy;
  place: "dedans" | "dehors";
  category: string;
};

export const PLANS: Plan[] = [
  {
    id: "p1",
    title: "Pique-nique improvisé au parc",
    blurb: "Sortir du canapé sans réserver. Panier, couverture, 90 minutes dehors.",
    steps: [
      "Choisir le parc le plus proche (10 min max)",
      "Acheter 2–3 trucs sympas en chemin",
      "Téléphones en mode avion pendant le repas",
    ],
    durationMin: 90,
    budgetMax: 25,
    energy: "moyenne",
    place: "dehors",
    category: "sortie légère",
  },
  {
    id: "p2",
    title: "Soirée cuisine à l’aveugle",
    blurb: "Chacun achète un ingrédient surprise. Vous cuisinez avec ce que vous avez.",
    steps: [
      "Chacun sort 15 min pour 1 ingrédient mystère",
      "Timer 45 min pour inventer le plat",
      "Noter le plat : à refaire / jamais",
    ],
    durationMin: 90,
    budgetMax: 20,
    energy: "moyenne",
    place: "dedans",
    category: "maison",
  },
  {
    id: "p3",
    title: "Marche photo à deux",
    blurb: "Un quartier, 20 photos chacune·e, puis vote du top 3.",
    steps: [
      "Choisir un quartier peu fréquenté",
      "Marcher 40 min en silence photo",
      "Comparer et élire 3 favoris",
    ],
    durationMin: 60,
    budgetMax: 0,
    energy: "moyenne",
    place: "dehors",
    category: "créatif",
  },
  {
    id: "p4",
    title: "Café + jeu de cartes",
    blurb: "Le lieu du coin, 1 partie, zéro scroll. Simple et efficace.",
    steps: [
      "Choisir un café à moins de 15 min",
      "Commander, poser les téléphones",
      "Jouer 2 manches minimum",
    ],
    durationMin: 60,
    budgetMax: 20,
    energy: "basse",
    place: "dehors",
    category: "sortie légère",
  },
  {
    id: "p5",
    title: "Salon cinéma thème",
    blurb: "Pas Netflix au hasard : un thème, un snack, une règle anti-téléphone.",
    steps: [
      "Tirer un thème (années 90, voyage, comédie)",
      "Préparer un snack en 10 min",
      "Film + 5 min de débrief à la fin",
    ],
    durationMin: 120,
    budgetMax: 10,
    energy: "basse",
    place: "dedans",
    category: "maison",
  },
  {
    id: "p6",
    title: "Challenge 3 restos street",
    blurb: "Goûter 3 stands / food trucks, 1 portion chacun, comparer.",
    steps: [
      "Lister 3 spots à moins de 2 km",
      "Budget max 8 € par stop",
      "Élire le gagnant en rentrant",
    ],
    durationMin: 90,
    budgetMax: 30,
    energy: "haute",
    place: "dehors",
    category: "food",
  },
  {
    id: "p7",
    title: "Atelier cocktail maison",
    blurb: "2 recettes, 1 mocktail, dégustation à l’aveugle.",
    steps: [
      "Choisir 2 recettes simples",
      "Préparer sans goûter (à l’aveugle)",
      "Noter et garder la favorite",
    ],
    durationMin: 60,
    budgetMax: 25,
    energy: "basse",
    place: "dedans",
    category: "maison",
  },
  {
    id: "p8",
    title: "Sunset + glace",
    blurb: "Le plan anti-“on verra” : point de vue + glace, rentrer avant 21 h.",
    steps: [
      "Checker l’heure du coucher de soleil",
      "Acheter 2 glaces en route",
      "10 min sans parler, juste regarder",
    ],
    durationMin: 60,
    budgetMax: 15,
    energy: "basse",
    place: "dehors",
    category: "sortie légère",
  },
  {
    id: "p9",
    title: "Escape room DIY",
    blurb: "Cachez 5 indices dans l’appart. L’autre a 30 min pour résoudre.",
    steps: [
      "Un partenaire prépare 5 indices (15 min)",
      "L’autre résout en 30 min chrono",
      "Inverser les rôles une autre fois",
    ],
    durationMin: 60,
    budgetMax: 0,
    energy: "haute",
    place: "dedans",
    category: "jeu",
  },
  {
    id: "p10",
    title: "Concert / open mic surprise",
    blurb: "Choisir un lieu live ce soir, sans lire les avis 20 minutes.",
    steps: [
      "Ouvrir un agenda culturel local",
      "Prendre le premier créneau possible",
      "Y aller, même 45 minutes seulement",
    ],
    durationMin: 120,
    budgetMax: 40,
    energy: "haute",
    place: "dehors",
    category: "culture",
  },
  {
    id: "p11",
    title: "Massage + playlist 20 min",
    blurb: "Énergie basse, connexion haute. Timer, huile, silence.",
    steps: [
      "Chacun prépare 1 playlist courte",
      "10 min massage chacun",
      "Thé / eau + 5 min de calme",
    ],
    durationMin: 30,
    budgetMax: 0,
    energy: "basse",
    place: "dedans",
    category: "connexion",
  },
  {
    id: "p12",
    title: "Balade marché + plat du soir",
    blurb: "Acheter uniquement ce qui inspire, cuisiner ensemble après.",
    steps: [
      "Aller au marché / épicerie fine",
      "Budget fixe : 25 € max",
      "Cuisiner le butin à deux",
    ],
    durationMin: 120,
    budgetMax: 40,
    energy: "moyenne",
    place: "dehors",
    category: "food",
  },
];

export type Constraints = {
  duration: Duration;
  budget: Budget;
  energy: Energy;
  place: Place;
};

export function durationToMin(d: Duration): number {
  switch (d) {
    case "30":
      return 30;
    case "60":
      return 60;
    case "120":
      return 120;
    case "soirée":
      return 180;
  }
}

export function budgetToMax(b: Budget): number {
  switch (b) {
    case "0":
      return 0;
    case "20":
      return 20;
    case "50":
      return 50;
    case "80+":
      return 999;
  }
}

export function filterPlans(c: Constraints): Plan[] {
  const maxMin = durationToMin(c.duration);
  const maxBudget = budgetToMax(c.budget);
  const energyRank = { basse: 1, moyenne: 2, haute: 3 };

  return PLANS.filter((p) => {
    if (p.durationMin > maxMin + 30) return false;
    if (p.budgetMax > maxBudget) return false;
    if (energyRank[p.energy] > energyRank[c.energy] + 1) return false;
    if (c.place !== "peu-importe" && p.place !== c.place) return false;
    return true;
  }).slice(0, 8);
}
