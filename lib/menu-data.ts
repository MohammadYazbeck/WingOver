export type HomeCategory = "Featured" | "Wings" | "Sandwiches" | "Sides";

export type MenuCategory = "Wings" | "Sandwiches" | "Sides" | "Salads" | "Sauces";

export type MenuItem = {
  name: string;
  description: string;
  price: string;
  image: string;
  tag: string;
  ingredients?: readonly string[];
  video?: string;
};

export type SauceCard = {
  name: string;
  heat: string;
  note: string;
  image: string;
};

export const homeCategories: { label: HomeCategory; number: string }[] = [
  { label: "Featured", number: "01" },
  { label: "Wings", number: "02" },
  { label: "Sandwiches", number: "03" },
  { label: "Sides", number: "04" }
];

export const featuredItems: Record<HomeCategory, MenuItem[]> = {
  Featured: [
    { name: "The WingOver Combo", description: "Crispy wings, fries, slaw, and your pick of sauce.", price: "from 9.90", image: "/images/cutouts/wings-sauced.png", tag: "Fan favorite" },
    { name: "Nashville Stack", description: "Crunchy chicken, pickles, slaw, and a serious hot honey hit.", price: "from 8.90", image: "/images/cutouts/sandwich-nashville.png", tag: "New heat" },
    { name: "Loaded Fries", description: "Golden fries, cheddar sauce, jalapeno, and house drizzle.", price: "from 5.50", image: "/images/cutouts/loaded-fries.png", tag: "Shareable" }
  ],
  Wings: [
    { name: "5 Piece Wings", description: "Choose a sauce, then make it yours.", price: "from 4.90", image: "/images/cutouts/wings-crispy.png", tag: "Pick your heat" },
    { name: "10 Piece Wings", description: "A full table of crispy, saucy goodness.", price: "from 8.90", image: "/images/cutouts/wings-sauced.png", tag: "Best seller" },
    { name: "15 Piece Wings", description: "For big cravings and bigger sauce energy.", price: "from 12.90", image: "/images/cutouts/wings-crispy.png", tag: "Go big" }
  ],
  Sandwiches: [
    { name: "Nashville Chicken", description: "Crispy chicken, hot glaze, pickles, slaw, and comeback sauce.", price: "from 8.90", image: "/images/cutouts/sandwich-nashville.png", tag: "Hot right now" },
    { name: "House Crunch", description: "Stacked chicken, cheese, fresh greens, and house sauce.", price: "from 8.50", image: "/images/cutouts/sandwich-house.png", tag: "The classic" },
    { name: "Honey Mustard Melt", description: "Golden chicken, melty cheese, and a sweet-tangy finish.", price: "from 8.50", image: "/images/cutouts/sandwich-house.png", tag: "Sweet heat" }
  ],
  Sides: [
    { name: "Chicken Popcorn", description: "Bite-sized crunch with a dip on the side.", price: "from 4.50", image: "/images/cutouts/chicken-popcorn.png", tag: "Snackable" },
    { name: "Loaded Fries", description: "The side that steals the table.", price: "from 5.50", image: "/images/cutouts/loaded-fries.png", tag: "Shareable" },
    { name: "Crispy Fries", description: "Golden, salty, and built for dipping.", price: "from 2.90", image: "/images/cutouts/crispy-fries.png", tag: "Always" }
  ]
};

export const sauceCards: SauceCard[] = [
  { name: "Caribbean Vibes", heat: "02 / 05", note: "Bright, tangy, tropical.", image: "/images/sauces/caribbean-vibes.jpg" },
  { name: "Honey Mustard", heat: "01 / 05", note: "Sweet, sharp, classic.", image: "/images/sauces/honey-mustard.jpg" },
  { name: "BBQ", heat: "02 / 05", note: "Smoky with a little bite.", image: "/images/sauces/bbq.jpg" },
  { name: "Honey Habanero", heat: "03 / 05", note: "Sweet first. Kick later.", image: "/images/sauces/honey-habanero.jpg" },
  { name: "House Sauce", heat: "01 / 05", note: "Creamy, tangy, gone fast.", image: "/images/sauces/house-sauce.jpg" },
  { name: "Buffalo", heat: "03 / 05", note: "The original heat check.", image: "/images/sauces/buffalo.jpg" },
  { name: "Cherry Bomb", heat: "04 / 05", note: "Fruity, fiery, unforgettable.", image: "/images/sauces/cherry-bomb.jpg" },
  { name: "Carolina Reaper", heat: "05 / 05", note: "Full fire. No shortcuts.", image: "/images/sauces/carolina-reaper.jpg" },
  { name: "Ghost Pepper", heat: "05 / 05", note: "Proceed with confidence.", image: "/images/sauces/ghost-pepper.jpg" }
];

export const heatScaleLevels = [
  { label: "Not hot", range: "01–02 / 05", min: 1, max: 2 },
  { label: "Hot", range: "03 / 05", min: 3, max: 3 },
  { label: "All the heat", range: "04–05 / 05", min: 4, max: 5 }
].map((level) => ({
  ...level,
  sauces: sauceCards.filter((sauce) => {
    const heat = Number.parseInt(sauce.heat, 10);
    return heat >= level.min && heat <= level.max;
  })
}));

export const menuCategories: { label: MenuCategory; number: string }[] = [
  { label: "Wings", number: "01" },
  { label: "Sandwiches", number: "02" },
  { label: "Sides", number: "03" },
  { label: "Salads", number: "04" },
  { label: "Sauces", number: "05" }
];

export const menuItems: Record<Exclude<MenuCategory, "Sauces">, MenuItem[]> = {
  Wings: [
    { name: "5 Piece Wings", description: "Choose any sauce and make it yours.", price: "from 4.90", image: "/images/cutouts/wings-crispy.png", tag: "Pick your heat", ingredients: ["Crispy chicken wings", "Sauce of choice"] },
    { name: "10 Piece Wings", description: "A full table of crispy, saucy goodness.", price: "from 8.90", image: "/images/cutouts/wings-sauced.png", tag: "Best seller", ingredients: ["Crispy chicken wings", "Sauce of choice"] },
    { name: "15 Piece Wings", description: "For big cravings and bigger sauce energy.", price: "from 12.90", image: "/images/cutouts/wings-crispy.png", tag: "Go big", ingredients: ["Crispy chicken wings", "Sauce of choice"] }
  ],
  Sandwiches: [
    { name: "Nashville Chicken", description: "Crispy chicken, hot glaze, pickles, slaw, and comeback sauce.", price: "from 8.90", image: "/images/cutouts/sandwich-nashville.png", tag: "Hot right now", ingredients: ["Crispy chicken", "Hot glaze", "Pickles", "Slaw", "Comeback sauce"] },
    { name: "House Crunch", description: "Stacked chicken, cheese, fresh greens, and house sauce.", price: "from 8.50", image: "/images/cutouts/sandwich-house.png", tag: "The classic", ingredients: ["Crispy chicken", "Cheese", "Greens", "House sauce"] },
    { name: "Honey Mustard Melt", description: "Golden chicken, melty cheese, and a sweet-tangy finish.", price: "from 8.50", image: "/images/cutouts/sandwich-house.png", tag: "Sweet heat", ingredients: ["Crispy chicken", "Cheese", "Honey mustard"] }
  ],
  Sides: [
    { name: "Loaded Fries", description: "Golden fries, cheddar sauce, jalapeno, and house drizzle.", price: "from 5.50", image: "/images/cutouts/loaded-fries.png", tag: "Shareable", ingredients: ["Fries", "Cheddar sauce", "Jalapeno", "House drizzle"] },
    { name: "Chicken Popcorn", description: "Bite-sized crunch with a dip on the side.", price: "from 4.50", image: "/images/cutouts/chicken-popcorn.png", tag: "Snackable", ingredients: ["Crispy chicken bites", "Dip of choice"] },
    { name: "Crispy Fries", description: "Golden, salty, and built for dipping.", price: "from 2.90", image: "/images/cutouts/crispy-fries.png", tag: "Always", ingredients: ["Seasoned fries", "Dip of choice"] }
  ],
  Salads: [
    { name: "Caesar", description: "Crisp greens, chicken, parmesan, and Caesar dressing.", price: "from 5.90", image: "/images/cutouts/salad-caesar.png", tag: "Fresh", ingredients: ["Chicken", "Greens", "Parmesan", "Caesar dressing"] },
    { name: "Ranch", description: "Chicken, fresh greens, cheddar, tomato, and ranch drizzle.", price: "from 5.90", image: "/images/cutouts/salad-ranch.png", tag: "Cool down", ingredients: ["Chicken", "Greens", "Cheddar", "Tomato", "Ranch"] },
    { name: "Spicy Ranch", description: "Crunchy chicken, cheddar, jalapeno, and spicy ranch.", price: "from 5.90", image: "/images/cutouts/salad-spicy-ranch.png", tag: "With a kick", ingredients: ["Chicken", "Greens", "Cheddar", "Jalapeno", "Spicy ranch"] }
  ]
};

export const sauceCircles = [
  ["Caribbean Vibes", "/images/sauces/caribbean-vibes.jpg"],
  ["Honey Mustard", "/images/sauces/honey-mustard.jpg"],
  ["BBQ", "/images/sauces/bbq.jpg"],
  ["Cheddar", "/images/sauces/cheddar.jpg"],
  ["BBQ Bomb", "/images/sauces/bbq-bomb.jpg"],
  ["Sweet & Spicy", "/images/sauces/sweet-and-spicy.jpg"],
  ["Chicago", "/images/sauces/chicago.jpg"],
  ["Bloody Pirate", "/images/sauces/bloody-pirate.jpg"],
  ["Blue Heaven", "/images/sauces/blue-heaven.jpg"],
  ["Teriyaki", "/images/sauces/teriyaki.jpg"],
  ["Blue Cheese", "/images/sauces/blue-cheese.jpg"],
  ["Ranch", "/images/sauces/ranch.jpg"],
  ["Honey BBQ", "/images/sauces/honey-bbq.jpg"],
  ["Buffalo", "/images/sauces/buffalo.jpg"],
  ["Spicy BBQ", "/images/sauces/spicy-bbq.jpg"],
  ["Honey Habanero", "/images/sauces/honey-habanero.jpg"],
  ["Garlic Parmesan", "/images/sauces/garilc-parmesan.jpg"],
  ["Jalapeno Cheddar", "/images/sauces/jalapeno-cheddar.jpg"],
  ["Dynamite", "/images/sauces/dynamite.jpg"],
  ["House Sauce", "/images/sauces/house-sauce.jpg"],
  ["Carolina Reaper", "/images/sauces/carolina-reaper.jpg"],
  ["Korean Kick", "/images/sauces/korean-kick.jpg"],
  ["Ghost Pepper", "/images/sauces/ghost-pepper.jpg"],
  ["Cherry Bomb", "/images/sauces/cherry-bomb.jpg"],
  ["Hornet's Sting", "/images/sauces/hornet-s-sting.jpg"],
  ["Chipotle", "/images/sauces/chipotle.jpg"],
  ["Mexican", "/images/sauces/buffalo.jpg"],
  ["Blue Moon", "/images/sauces/blue-moon.jpg"],
  ["Camp Fire", "/images/sauces/camp-fire.jpg"],
  ["Nashville", "/images/sauces/dynamite.jpg"]
] as const;
