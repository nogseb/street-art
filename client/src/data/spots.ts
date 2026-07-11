export interface Artist {
  id: string;
  name: string;
  born: string;
  origin: string;
  bio: string;
  style: string;
  website?: string;
  instagram?: string;
}

export interface Spot {
  id: number;
  name: string;
  artistIds: string[];
  lat: number;
  lon: number;
  address: string;
  year: string;
  description: string;
  category: "fresque" | "patrimoine" | "kidkreol";
  walkTime?: string;
  photos?: string[];
}

export const artists: Record<string, Artist> = {
  mrdheo: {
    id: "mrdheo",
    name: "Mr Dheo",
    born: "1985",
    origin: "Vila Nova de Gaia, Portugal",
    bio: "Christophe Dheo, alias Mr Dheo, est un street artiste portugais basé à Porto. Il peint des murs à travers le monde depuis 2000. Reconnu pour son style photoréaliste, il réalise des portraits monumentaux d'une précision saisissante. Après plus de 22 ans de carrière continue, il a réalisé des interventions dans plus de 30 pays. Né dans le quartier de Vila Nova de Gaia sur les rives sud du Douro, il développe ses techniques de peinture dès l'enfance et découvre le graffiti à 15 ans.",
    style: "Portrait hyperréaliste monumental",
    instagram: "mrdheo",
  },
  jace: {
    id: "jace",
    name: "Jace",
    born: "1973",
    origin: "Saint-Pierre, La Réunion",
    bio: "Jace est un graffeur français originaire de La Réunion, créateur des Gouzous — ces petits personnages jaunes sans visage mais terriblement expressifs. Son parcours artistique débute dans les années 1980 lorsqu'il découvre le graffiti. Ce qui n'était au départ qu'une passion est devenu son métier. Le graffiti l'a emmené aux quatre coins du monde. Les Gouzous sont devenus un symbole culturel de l'île de La Réunion, visibles de Saint-Denis à Saint-Pierre et désormais dans le monde entier.",
    style: "Personnages stylisés (Gouzous), humour, couleurs vives",
    instagram: "jaceticot",
  },
  kidkreol: {
    id: "kidkreol",
    name: "Kid Kreol & Boogie",
    born: "1984 / 1983",
    origin: "Saint-Denis, La Réunion",
    bio: "Jean-Sébastien Clain (Kid Kreol, né en 1984) et Yannis Nanguet (Boogie, né en 1983) forment un duo d'artistes réunionnais actif depuis 2008. Diplômés de l'École supérieure d'art de La Réunion, ils vivent et travaillent à Saint-Denis. Leur pratique artistique consiste à dévoiler un monde imaginaire créole réunionnais, enraciné dans l'océan Indien et les croyances appartenant à une culture de l'invisible. Leurs oeuvres mêlent mythologie, végétal et onirique. Ils ont réalisé des fresques monumentales à La Réunion, à Maurice, à Lyon et en France métropolitaine.",
    style: "Onirique, mythologie créole, végétal, monde invisible",
    instagram: "kidkreol_boogie",
  },
  stohead: {
    id: "stohead",
    name: "Stohead",
    born: "1973",
    origin: "Schwäbisch Hall, Allemagne",
    bio: "Christoph Haessler, alias Stohead, est l'un des artistes allemands les plus reconnus dans le domaine du street art et du graffiti. Il découvre le graffiti à 14 ans en 1989. Sa pratique se distingue par un travail calligraphique et typographique d'une grande maîtrise, entre lettrage abstrait et geste pictural. Membre du crew Loveletters, il a exposé et peint dans le monde entier.",
    style: "Calligraphie abstraite, lettrage monumental, geste pictural",
    instagram: "stohead",
  },
  nilko: {
    id: "nilko",
    name: "Nilko",
    born: "1979",
    origin: "Paris, France",
    bio: "Nilko est un artiste graffeur parisien, membre du crew Loveletters. Il se démarque par sa capacité à créer avec précision, rapidité et sans croquis préalable. Son sens aigu du détail lui permet de réaliser des fresques d'une précision hors-norme. Il a participé au Festival Réunion Graffiti à Saint-Denis.",
    style: "Lettrage précis, improvisation, détail extrême",
    instagram: "nilkowhite",
  },
  lazoo: {
    id: "lazoo",
    name: "Lazoo",
    born: "1969",
    origin: "Paris, France",
    bio: "Lazoo est un artiste français autodidacte, intéressé par le dessin et la peinture depuis l'enfance. Il commence à peindre en 1986. Proche de la figuration narrative, ses principales sources d'inspiration sont les univers de la bande dessinée, du cinéma et de la culture populaire. Cofondateur des rencontres internationales Kosmopolite, il a exposé au Grand Palais lors de « TAG au Grand Palais » et à la Biennale du Musée d'Art Contemporain de Lyon.",
    style: "Figuration narrative, BD, culture pop, personnages expressifs",
    instagram: "lazoo_art",
  },
  seth: {
    id: "seth",
    name: "Seth Globepainter",
    born: "1972",
    origin: "Paris, France",
    bio: "Julien Malland, alias Seth ou Seth Globepainter, est un street artiste français né à Paris en 1972. Il devient Seth dans les années 1990 lorsqu'il commence à peindre dans les rues de Paris, après avoir été diplômé de l'École nationale supérieure des arts décoratifs. Son style se caractérise par des personnages poétiques, souvent des enfants, intégrés dans des paysages locaux. Il a voyagé et peint dans plus de 30 pays. En décembre 2012, il a collaboré avec Kid Kreol & Boogie à Saint-Denis.",
    style: "Personnages poétiques, enfants rêveurs, intégration au paysage",
    instagram: "seth_globepainter",
  },
};

export const spots: Spot[] = [
  {
    id: 1,
    name: "Tatie Monique",
    artistIds: ["mrdheo"],
    lat: -20.8785,
    lon: 55.4485,
    address: "Rue Labourdonnais, Saint-Denis",
    year: "2025",
    description: "Portrait hyperréaliste monumental d'une femme réunionnaise tenant une tasse fumante « Bonjour Réunion Island ». Les détails sont bluffants — rides, mains, reflets dans la tasse. Réalisée en 4 jours lors du Festival Réunion Graffiti (7e édition, octobre 2025).",
    category: "fresque",
    walkTime: "Départ",
    photos: ["https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?w=600&q=80"],
  },
  {
    id: 2,
    name: "Le Petit Marché",
    artistIds: [],
    lat: -20.8793,
    lon: 55.4497,
    address: "Petit Marché, Saint-Denis",
    year: "",
    description: "Le Petit Marché est un lieu vivant et coloré, parfait pour une pause sensorielle entre deux fresques. Étals d'épices, de vanille, de fruits exotiques. Les rues voisines recèlent des interventions murales spontanées — tags créoles, pochoirs, petites fresques.",
    category: "patrimoine",
    walkTime: "3 min",
    photos: ["https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80"],
  },
  {
    id: 3,
    name: "Rue Juliette-Dodu",
    artistIds: [],
    lat: -20.8808,
    lon: 55.4508,
    address: "Rue Juliette-Dodu, Saint-Denis",
    year: "",
    description: "Probablement la plus belle rue de Saint-Denis. Les anciennes maisons créoles avec leurs varangues et leurs lambrequins en bois côtoient des fresques et des collages qui dialoguent avec l'architecture. Un des meilleurs spots photo du parcours.",
    category: "patrimoine",
    walkTime: "3 min",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"],
  },
  {
    id: 4,
    name: "Gouzous de Jace",
    artistIds: ["jace"],
    lat: -20.8820,
    lon: 55.4490,
    address: "Rue de Paris, Saint-Denis",
    year: "Multiples",
    description: "La rue de Paris est l'artère historique de Saint-Denis. En la parcourant, les Gouzous de Jace apparaissent sur des murs, des poteaux, des volets. Ils se cachent parfois en hauteur ou dans des recoins inattendus. Ne manquez pas la Villa de la Région.",
    category: "fresque",
    walkTime: "5 min",
    photos: ["https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?w=600&q=80"],
  },
  {
    id: 5,
    name: "Fresque Dina Morgabine",
    artistIds: ["kidkreol"],
    lat: -20.8768,
    lon: 55.4512,
    address: "1 rue Issop Ravate, Saint-Denis",
    year: "2021",
    description: "La façade de l'Hôtel Dina Morgabine arbore une fresque monumentale du duo réunionnais Kid Kreol & Boogie. L'oeuvre mêle végétal et street art dans leur style caractéristique inspiré de l'imaginaire et des croyances de l'océan Indien.",
    category: "kidkreol",
    walkTime: "5 min",
    photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"],
  },
  {
    id: 6,
    name: "Koz Lan Gaz",
    artistIds: ["stohead", "nilko", "lazoo"],
    lat: -20.8752,
    lon: 55.4488,
    address: "22 Boulevard Jawaharlal Nehru (Barachois)",
    year: "2021",
    description: "« Koz Lan Gaz » (expression créole : bavarder) est une collaboration franco-allemande réalisée lors du Festival Réunion Graffiti 2021. Lettrage monumental de Stohead et Nilko, personnages colorés de Lazoo. Face à l'océan, au coucher du soleil.",
    category: "fresque",
    walkTime: "2 min",
    photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"],
  },
  {
    id: 7,
    name: "Cosmique + Seth",
    artistIds: ["kidkreol", "seth"],
    lat: -20.8778,
    lon: 55.4428,
    address: "Quartier du Bas de la Rivière, Saint-Denis",
    year: "2012-2013",
    description: "Le quartier historique du Bas de la Rivière abrite la fresque « Cosmique » (2013) de Kid Kreol & Boogie, ainsi que la collaboration monumentale avec Seth Globepainter (2012). Des oeuvres oniriques parfaitement intégrées à l'environnement du quartier.",
    category: "kidkreol",
    walkTime: "10 min",
    photos: ["https://images.unsplash.com/photo-1551913902-c92207136625?w=600&q=80"],
  },
  {
    id: 8,
    name: "Cité des Arts",
    artistIds: ["kidkreol"],
    lat: -20.8895,
    lon: 55.4545,
    address: "23 rue Léopold Rambaud, Saint-Denis",
    year: "2018",
    description: "La Cité des Arts abrite les fresques les plus monumentales de Kid Kreol & Boogie à La Réunion. Plusieurs murs extérieurs sont recouverts d'oeuvres immenses inspirées des paysages, des légendes et de l'imaginaire réunionnais. Un univers cosmogonique à ciel ouvert, à voir absolument.",
    category: "kidkreol",
    walkTime: "5 min en voiture",
    photos: ["https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=600&q=80"],
  },
];

export const categoryColors: Record<string, string> = {
  fresque: "#FF3E52",
  patrimoine: "#2D6A4F",
  kidkreol: "#1A237E",
};

export const categoryLabels: Record<string, string> = {
  fresque: "Fresque",
  patrimoine: "Patrimoine + art urbain",
  kidkreol: "Kid Kreol & Boogie",
};
