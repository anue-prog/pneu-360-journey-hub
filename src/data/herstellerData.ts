import continentalLogo from "@/assets/marken/continental.svg";
import michelinLogo from "@/assets/marken/michelin.svg";
import pirelliLogo from "@/assets/marken/pirelli.svg";
import nokianLogo from "@/assets/marken/nokian.svg";
import vredesteinLogo from "@/assets/marken/vredestein.svg";
import bridgestoneLogo from "@/assets/marken/bridgestone.svg";
import yokohamaLogo from "@/assets/marken/yokohama.svg";
import hankookLogo from "@/assets/marken/hankook.svg";
import falkenLogo from "@/assets/marken/falken.svg";
import toyoLogo from "@/assets/marken/toyo.svg";
import goodyearLogo from "@/assets/marken/goodyear.svg";
import cooperLogo from "@/assets/marken/cooper.svg";
import generalLogo from "@/assets/marken/general.svg";
import barumLogo from "@/assets/marken/barum.svg";
import bfgoodrichLogo from "@/assets/marken/bfgoodrich.svg";

export interface Manufacturer {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  founded: number;
  hq: string;
  subBrands: string[];
  funFact: string;
  description: string;
  story: string;
  innovations: string[];
  signature: string;
  employees?: string;
  revenue?: string;
  logo: string;
}

export const manufacturers: Manufacturer[] = [
  {
    id: "continental",
    name: "Continental",
    country: "Deutschland",
    countryCode: "DE",
    flag: "🇩🇪",
    founded: 1871,
    hq: "Hannover",
    subBrands: ["Barum", "General Tire", "Semperit", "Uniroyal", "Gislaved", "Matador"],
    funFact: "Continental stellte 1904 den ersten profilierten Autoreifen der Welt her – davor waren alle Reifen glatt wie Veloreifen.",
    description: "Der älteste Reifenhersteller der Welt. Gegründet in Hannover, als Bismarck noch Kanzler war.",
    story: "Was 1871 als kleine Gummifabrik in Hannover begann, ist heute ein globaler Technologiekonzern. Continental produzierte anfangs Gummiwaren und Pferdehufeinsätze. 1898 kam der erste Autoreifen – und veränderte alles. Im 20. Jahrhundert wurde Conti zum Innovationsmotor: vom profilierten Reifen über schlauchlosen Pneu bis hin zu modernen Fahrassistenzsystemen. Heute steckt Continental-Technologie in jedem dritten Auto weltweit – nicht nur in den Reifen, sondern auch in Bremsen, Sensoren und Software.",
    innovations: [
      "1904 – Erster profilierter Autoreifen der Welt",
      "1943 – Erster schlauschloser Reifen (Serienreife 1955)",
      "1972 – Erster Reifen mit ABS-Kompatibilität entwickelt",
      "2023 – ContiSeal-Technologie: Reifen dichtet Nagellöcher selbst ab",
    ],
    signature: "Deutsche Ingenieurskunst seit über 150 Jahren",
    employees: "~200.000",
    revenue: "41.4 Mrd. €",
    logo: continentalLogo,
  },
  {
    id: "michelin",
    name: "Michelin",
    country: "Frankreich",
    countryCode: "FR",
    flag: "🇫🇷",
    founded: 1889,
    hq: "Clermont-Ferrand",
    subBrands: ["BFGoodrich", "Riken", "Taurus", "Uniroyal (Nordamerika)"],
    funFact: "Der Michelin-Restaurantführer wurde 1900 erfunden, um Leute zum Autofahren zu motivieren – damit sie mehr Reifen brauchen.",
    description: "Französische Ingenieurskunst, die den Reifen neu erfunden hat. Und nebenbei die Gastronomie-Welt revolutionierte.",
    story: "Die Brüder André und Édouard Michelin hatten 1889 eine Vision: bessere Reifen für eine mobile Welt. 1891 gelang ihnen der Durchbruch – der erste abnehmbare Luftreifen. Statt stundenlang den Reifen zu flicken, konnte man ihn in Minuten wechseln. Die geniale Idee dahinter: Wenn Autofahren einfacher wird, fahren mehr Leute Auto. Also mehr Reifen. Also erfanden sie gleich den Michelin-Guide dazu – ursprünglich ein Werkstattverzeichnis, heute der wichtigste Restaurantführer der Welt. Bibendum (das Michelin-Männchen) ist das älteste Firmenmaskottchen, das noch heute aktiv genutzt wird.",
    innovations: [
      "1891 – Erster abnehmbarer Luftreifen (revolutionierte das Autofahren)",
      "1900 – Michelin-Guide: vom Werkstattverzeichnis zum Gourmetführer",
      "1946 – Erfindung des Radialreifens (heute Standard bei 98% aller Autos)",
      "2017 – Vision Concept: luftloser, 3D-gedruckter, biologisch abbaubarer Reifen",
    ],
    signature: "Erfinder des Radialreifens – die wichtigste Reifeninnovation des 20. Jahrhunderts",
    employees: "~132.000",
    revenue: "28.3 Mrd. €",
    logo: michelinLogo,
  },
  {
    id: "pirelli",
    name: "Pirelli",
    country: "Italien",
    countryCode: "IT",
    flag: "🇮🇹",
    founded: 1872,
    hq: "Mailand",
    subBrands: [],
    funFact: "Der Pirelli-Kalender ist so begehrt, dass er nicht verkauft wird – er wird ausschliesslich an VIPs verschenkt.",
    description: "Mailänder Eleganz trifft auf Rennstrecken-Performance. Der einzige Reifenhersteller, der auch die Modewelt beeinflusst.",
    story: "Giovanni Battista Pirelli gründete 1872 in Mailand seine Gummifabrik. Er verband von Anfang an italienische Handwerkskunst mit industrieller Innovation. Pirelli lieferte Telegraphenkabel, bevor der erste Autoreifen kam. Im Motorsport wurde Pirelli zur Legende: seit 2011 einziger Reifenlieferant der Formel 1. Aber Pirelli ist mehr als Technik – der berühmte Pirelli-Kalender machte die Marke auch zum Kulturobjekt. Als einziger der Grossen konzentriert sich Pirelli bewusst auf Premium und Ultra-High-Performance, ohne Budget-Linien.",
    innovations: [
      "1901 – Erster Pirelli-Reifen gewinnt ein Autorennen",
      "1953 – Cinturato: erster Radialreifen mit Textilgürtel",
      "2009 – Cyber Tyre: erster Reifen mit eingebautem Sensor (misst Grip in Echtzeit)",
      "2023 – FSC-zertifizierte Reifen aus nachhaltigem Naturkautschuk",
    ],
    signature: "Einziger Reifenlieferant der Formel 1 seit 2011",
    employees: "~31.600",
    revenue: "6.7 Mrd. €",
    logo: pirelliLogo,
  },
  {
    id: "nokian",
    name: "Nokian Tyres",
    country: "Finnland",
    countryCode: "FI",
    flag: "🇫🇮",
    founded: 1898,
    hq: "Nokia",
    subBrands: [],
    funFact: "Die Stadt Nokia in Finnland gab sowohl dem Reifenhersteller als auch dem Handy-Konzern Nokia den Namen – zwei Weltmarken aus einem Ort mit 33.000 Einwohnern.",
    description: "Finnische Winterkompetenz, geboren aus den härtesten Strassenbedingungen der Welt.",
    story: "In Finnland, wo der Winter 7 Monate dauert und die Temperaturen auf -40°C fallen, entstand 1898 ein Unternehmen, das Reifen für das Überleben baute. 1934 erfand Nokian den ersten Winterreifen der Welt – den 'Kelirengas'. Die Idee: ein Reifen, der bei Eis und Schnee nicht aufgibt. Seither testet Nokian am Polarkreis, wo andere Hersteller nur staunen. Jeder Nokian-Reifen wird in 'White Hell' getestet – dem firmeneigenen Testgelände in Ivalo, Lappland, 300 km nördlich des Polarkreises. Kein anderer Hersteller hat solche Extrembedingungen vor der Haustür.",
    innovations: [
      "1934 – Erster Winterreifen der Welt ('Kelirengas')",
      "1936 – Erster Spikereifen für die arktische Strasse",
      "2013 – Weltrekord: schnellstes Auto auf Eis (335.7 km/h mit Nokian-Reifen)",
      "2022 – Erster CO₂-kompensierter Reifen in der Serienproduktion",
    ],
    signature: "Erfinder des Winterreifens – getestet am Polarkreis",
    employees: "~4.900",
    revenue: "1.6 Mrd. €",
    logo: nokianLogo,
  },
  {
    id: "bridgestone",
    name: "Bridgestone",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    founded: 1931,
    hq: "Tokyo",
    subBrands: ["Firestone", "Seiberling", "Dayton"],
    funFact: "Der Name 'Bridgestone' ist die englische Übersetzung des Gründernamens Ishibashi (石橋) – wörtlich 'Steinbrücke'.",
    description: "Vom japanischen Familienunternehmen zum grössten Reifenhersteller der Welt.",
    story: "Shojiro Ishibashi hatte einen Traum: Japan von importierten Reifen unabhängig machen. 1931 gründete er Bridgestone – eine clevere Übersetzung seines Namens (Ishi = Stein, Bashi = Brücke). Der Durchbruch kam 1988 mit der Übernahme des US-Giganten Firestone für 2.6 Mrd. Dollar – damals die grösste japanische Übernahme im Ausland. Heute produziert Bridgestone in 25 Ländern und ist der umsatzstärkste Reifenhersteller der Welt. Ihre Philosophie: 'Serving Society with Superior Quality'. Bridgestone liefert auch die Reifen für den Space Shuttle Transporter und diverse Militärfahrzeuge.",
    innovations: [
      "1951 – Erster japanischer Radialreifen",
      "1988 – Übernahme von Firestone (grösster Deal der Branche damals)",
      "2012 – ologic-Technologie: schmale, hohe Reifen für weniger Rollwiderstand",
      "2023 – ENLITEN-Technologie: 20% leichter bei gleicher Performance",
    ],
    signature: "Grösster Reifenhersteller der Welt nach Umsatz",
    employees: "~130.000",
    revenue: "28.1 Mrd. €",
    logo: bridgestoneLogo,
  },
  {
    id: "goodyear",
    name: "Goodyear",
    country: "USA",
    countryCode: "US",
    flag: "🇺🇸",
    founded: 1898,
    hq: "Akron, Ohio",
    subBrands: ["Cooper", "Fulda", "Kelly", "Sava", "Dębica"],
    funFact: "Das Goodyear Blimp (Luftschiff) ist eines der bekanntesten Markenzeichen der Welt – es fliegt seit 1925 über US-Sportevents.",
    description: "Amerikas Reifen-Ikone. Von der Mondlandung bis zum Super Bowl – Goodyear ist überall.",
    story: "Frank Seiberling benannte seine 1898 gegründete Firma nach Charles Goodyear, dem Erfinder der Vulkanisierung – obwohl dieser keine Verbindung zur Firma hatte und 38 Jahre vorher gestorben war. Aber der Name wurde zum Mythos. Goodyear-Reifen fuhren auf dem Mond: Alle Apollo-Mondfahrzeuge rollten auf Goodyear-Rädern. Das Goodyear Blimp, das seit 1925 über US-Stadien schwebt, ist eines der bekanntesten Markenzeichen der Welt. 2021 übernahm Goodyear den Konkurrenten Cooper Tire für 2.8 Mrd. Dollar und stärkte damit seine Position als zweitgrösster amerikanischer Reifenhersteller.",
    innovations: [
      "1947 – Erster tubeless (schlauchloser) Reifen in Serienproduktion",
      "1970 – Reifen für das NASA Lunar Rover Vehicle (Mondfahrzeug)",
      "1992 – Aquatred: erster speziell für Aquaplaning-Schutz entwickelter Reifen",
      "2021 – Übernahme von Cooper Tire für 2.8 Mrd. USD",
    ],
    signature: "Die Reifen, die auf dem Mond fuhren",
    employees: "~72.000",
    revenue: "17.4 Mrd. €",
    logo: goodyearLogo,
  },
  {
    id: "yokohama",
    name: "Yokohama",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    founded: 1917,
    hq: "Tokyo",
    subBrands: [],
    funFact: "Yokohama ist offizieller Reifenpartner von Chelsea FC, den Yokohama Rubber Rennteams und zahlreichen Tuning-Szenen weltweit.",
    description: "Japanische Präzision für Sportfahrer und Alltagshelden. Einer der ältesten Reifenhersteller Asiens.",
    story: "1917, mitten im Ersten Weltkrieg, gründeten die Yokohama Cable Manufacturing Co. und BF Goodrich ein Joint Venture in der japanischen Hafenstadt Yokohama. Was als Technologietransfer begann, wurde schnell eigenständig. Yokohama entwickelte sich zum Liebling der Motorsportszene – ADVAN-Reifen sind bis heute in der japanischen Super GT und bei Driftmeisterschaften dominierend. In Europa eher Geheimtipp, in Japan und den USA eine echte Grösse. Yokohama setzt stark auf Nachhaltigkeit und will bis 2050 klimaneutral produzieren.",
    innovations: [
      "1969 – Erster japanischer Winterreifen mit Lamellenstruktur",
      "1978 – ADVAN: erste dedizierte Hochleistungsreifen-Linie Japans",
      "2006 – BluEarth: Öko-Reifen mit Orangenöl im Gummi (weniger Erdöl)",
      "2023 – Ziel: 100% nachhaltige Materialien bis 2050",
    ],
    signature: "Japanischer Motorsport-Spezialist mit ADVAN-DNA",
    employees: "~27.000",
    revenue: "5.2 Mrd. €",
    logo: yokohamaLogo,
  },
  {
    id: "hankook",
    name: "Hankook",
    country: "Südkorea",
    countryCode: "KR",
    flag: "🇰🇷",
    founded: 1941,
    hq: "Seoul",
    subBrands: ["Laufenn", "Kingstar"],
    funFact: "Hankook liefert Erstausrüstung für Porsche, BMW, Mercedes und Audi – vor 20 Jahren war die Marke in Europa noch kaum bekannt.",
    description: "Vom koreanischen Underdog zum Erstausrüster europäischer Premiummarken. Die vielleicht beeindruckendste Aufstiegsgeschichte der Branche.",
    story: "1941 in Korea gegründet, galt Hankook jahrzehntelang als Budget-Alternative. Dann kam der Plan: nicht billiger sein, sondern besser. Hankook investierte Milliarden in Forschung, baute ein europäisches Technikzentrum in Hannover und holte sich systematisch die Erstausrüstungsaufträge der deutschen Premium-Autobauer. Heute rollen BMW M-Modelle, Porsche Taycan und Mercedes-AMG ab Werk auf Hankook-Reifen. Die DTM und die 24h Nürburgring fahren auf Hankook. Die Transformation vom Billigreifen zum gefragten Premiumprodukt ist beispiellos in der Branche.",
    innovations: [
      "1979 – Erster Radialreifen aus koreanischer Produktion",
      "2011 – Exklusiver Reifenpartner der DTM",
      "2019 – Erstausrüstung für Porsche Taycan (erster Elektro-Porsche)",
      "2023 – iON: spezielle EV-Reifenlinie für Elektrofahrzeuge",
    ],
    signature: "Vom Budget-Reifen zum Porsche-Erstausrüster in 20 Jahren",
    employees: "~22.000",
    revenue: "6.8 Mrd. €",
    logo: hankookLogo,
  },
  {
    id: "vredestein",
    name: "Vredestein",
    country: "Niederlande",
    countryCode: "NL",
    flag: "🇳🇱",
    founded: 1909,
    hq: "Enschede",
    subBrands: ["Teil von Apollo Tyres (Indien)"],
    funFact: "Vredestein ist der einzige Reifenhersteller, dessen Felgen von Giorgetto Giugiaro designt wurden – dem Mann hinter VW Golf, Fiat Panda und DeLorean.",
    description: "Niederländisches Design trifft auf indische Skalierung. Der charmante Aussenseiter unter den Reifenmarken.",
    story: "In Enschede, einer kleinen Stadt nahe der deutschen Grenze, begann 1909 die Geschichte von Vredestein. Die Marke blieb bewusst klein und elitär – Qualität statt Quantität. Der legendäre Autodesigner Giorgetto Giugiaro (VW Golf, Fiat Panda, DeLorean) entwarf exklusiv Vredestein-Felgen. 2009 wurde Vredestein vom indischen Apollo-Konzern übernommen, behielt aber seine europäische Identität. Die Reifen werden weiterhin in den Niederlanden entwickelt. Vredestein ist besonders bei Kennern beliebt, die das Besondere suchen.",
    innovations: [
      "1946 – Erste Fahrradreifen mit speziellem Winter-Compound",
      "1999 – Design-Kooperation mit Giorgetto Giugiaro",
      "2009 – Übernahme durch Apollo Tyres bei Erhalt der Markenidentität",
      "2022 – Quatrac Pro: einer der bestgetesteten Ganzjahresreifen Europas",
    ],
    signature: "Design-Reifen vom Giugiaro-Partner",
    employees: "~2.500",
    logo: vredesteinLogo,
  },
  {
    id: "falken",
    name: "Falken",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    founded: 1983,
    hq: "Tokyo (Sumitomo Rubber)",
    subBrands: ["Teil von Sumitomo", "Dunlop (in vielen Märkten)"],
    funFact: "Falkens 24h-Nürburgring-Porsche im ikonischen türkis-blauen Design ist eines der meistfotografierten Rennautos des Jahres.",
    description: "Japanische Motorsport-DNA im auffälligsten Kleid. Falken ist der Reifen für alle, die es ernst meinen.",
    story: "Falken wurde 1983 als Performance-Marke des Sumitomo-Konzerns lanciert. Während die Muttermarke Sumitomo auf Alltagsreifen setzte, durfte Falken laut sein. Und das wurde sie: Das türkis-blaue Falken-Design ist am 24-Stunden-Rennen auf dem Nürburgring eine Ikone. Falken nutzt den Nürburgring als Entwicklungslabor – jeder Reifen wird hier unter Extrembedingungen getestet. In Europa hat sich Falken als sportliche Alternative zu den grossen Premiummarken etabliert, mit exzellentem Preis-Leistungs-Verhältnis und starker Fangemeinde.",
    innovations: [
      "1985 – Erste eigene UHP-Reifenlinie (Ultra High Performance)",
      "1999 – Start des 24h-Nürburgring-Engagements",
      "2015 – AZENIS FK510: einer der meistverkauften Sportreifen Europas",
      "2023 – Ziex ZE320: entwickelt auf Basis von 20+ Jahren Nürburgring-Daten",
    ],
    signature: "Der Nürburgring ist ihr Labor",
    employees: "~36.000 (Sumitomo)",
    logo: falkenLogo,
  },
  {
    id: "toyo",
    name: "Toyo Tires",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    founded: 1945,
    hq: "Osaka",
    subBrands: ["Nitto"],
    funFact: "Die Untermarke Nitto ist in den USA absoluter Kult – kein Truck-Meeting ohne Nitto Trail Grappler.",
    description: "Offroad-Spezialist aus Osaka. Wo andere aufhören, fängt Toyo erst an.",
    story: "Toyo Tires wurde 1945 in Osaka gegründet und fand seine Nische im Offroad- und SUV-Segment. Während andere Hersteller um den Limousinen-Markt kämpften, konzentrierte sich Toyo auf robuste Reifen für schwieriges Gelände. Die Untermarke Nitto wurde in den USA zum Kult: kein Overlanding-Event, kein Truck-Meet ohne Nitto-Reifen. Toyo verbindet japanische Fertigungsqualität mit amerikanischer Truck-Kultur und hat sich als Spezialist für 4x4, SUV und Pickup weltweit einen Namen gemacht.",
    innovations: [
      "1966 – Erster japanischer Reifen speziell für Offroad-Einsatz",
      "1979 – Nitto-Gründung: Spezialisierung auf US-Truck-Markt",
      "2005 – Open Country Serie: Benchmark im SUV-Offroad-Segment",
      "2023 – Proxes Sport 2: Hybrid-Performance für Strasse und leichtes Gelände",
    ],
    signature: "Japanische Qualität für amerikanische Abenteuer",
    employees: "~11.000",
    revenue: "3.4 Mrd. €",
    logo: toyoLogo,
  },
  {
    id: "cooper",
    name: "Cooper Tire",
    country: "USA",
    countryCode: "US",
    flag: "🇺🇸",
    founded: 1914,
    hq: "Findlay, Ohio",
    subBrands: ["Teil von Goodyear (seit 2021)"],
    funFact: "Cooper war über 100 Jahre lang unabhängig – eines der am längsten eigenständig geführten Unternehmen in der US-Reifenindustrie.",
    description: "Über ein Jahrhundert amerikanischer Unabhängigkeit, jetzt Teil der Goodyear-Familie.",
    story: "Cooper Tire überlebte über 100 Jahre als unabhängiger Hersteller in Ohio – ein Kunststück in einer Branche, die von Fusionen lebt. Der Fokus lag immer auf dem amerikanischen Durchschnittsfahrer: zuverlässige Reifen zu fairen Preisen, ohne Glamour. 2021 kam das Ende der Unabhängigkeit: Goodyear übernahm Cooper für 2.8 Milliarden Dollar. Die Marke existiert weiter, aber als Teil eines Grösseren. Die Cooper-DNA – ehrlich, robust, fair – lebt in den Produkten fort.",
    innovations: [
      "1960 – Pionier bei der Herstellung von Winterreifen in den USA",
      "2001 – Discoverer Serie für den SUV-Boom",
      "2019 – Discoverer Rugged Trek: Brücke zwischen Highway und Offroad",
      "2021 – Übernahme durch Goodyear für 2.8 Mrd. USD",
    ],
    signature: "100 Jahre Unabhängigkeit – amerikanische Reifen-DNA",
    employees: "~10.000",
    logo: cooperLogo,
  },
  {
    id: "general",
    name: "General Tire",
    country: "USA",
    countryCode: "US",
    flag: "🇺🇸",
    founded: 1915,
    hq: "Continental-Tochter",
    subBrands: [],
    funFact: "General Tire wurde in Akron, Ohio gegründet – der 'Rubber Capital of the World', wo auch Goodyear und Firestone ihren Sitz hatten.",
    description: "Amerikanisches Offroad-Erbe unter deutscher Führung. General Tire verbindet zwei Welten.",
    story: "In Akron, Ohio – einst die Gummihauptstadt der Welt – gründeten 1915 die Brüder O'Neil die General Tire & Rubber Company. Die Marke machte sich früh einen Namen im Offroad-Bereich. Nach mehreren Besitzerwechseln landete General Tire bei Continental, die das amerikanische Erbe klug mit deutscher Ingenieurskunst verbanden. Heute ist General Tire die Offroad-Marke im Continental-Portfolio und bedient die wachsende Overlanding- und Abenteuer-Community mit robusten, bezahlbaren Reifen.",
    innovations: [
      "1915 – Gründung in Akron, der 'Gummi-Hauptstadt der Welt'",
      "1979 – Erster gezielter Offroad-Reifen der Marke",
      "1987 – Übernahme durch Continental",
      "2023 – Grabber-Serie: eine der beliebtesten AT-Reifenlinien weltweit",
    ],
    signature: "Offroad-Abenteuer mit deutscher Technologie",
    logo: generalLogo,
  },
  {
    id: "nexen",
    name: "Nexen Tire",
    country: "Südkorea",
    countryCode: "KR",
    flag: "🇰🇷",
    founded: 1942,
    hq: "Yangsan",
    subBrands: ["Roadstone"],
    funFact: "Nexen hiess bis 2000 'Heung-A Tire' – die Umbenennung zu 'Nexen' (Next Century) markierte den Neustart als globale Marke.",
    description: "Südkoreanischer Aufsteiger mit europäischem Forschungszentrum und wachsendem Erstausrüstungsanteil.",
    story: "1942 als Heung-A Tire in Korea gegründet, durchlief die Marke eine bemerkenswerte Transformation. Im Jahr 2000 kam der strategische Neustart: Umbenennung zu Nexen ('Next Century'), Investition in ein europäisches Technologiezentrum und aggressive Qualitätsoffensive. Das Ergebnis: Nexen liefert heute Erstausrüstung für Hyundai, Kia, Volkswagen und Fiat. Das Werk in Zatec (Tschechien) produziert seit 2019 speziell für den europäischen Markt. Nexen beweist, dass auch jüngere Marken im Premium-Segment bestehen können.",
    innovations: [
      "2000 – Strategischer Neustart als 'Nexen' (Next Century)",
      "2014 – N'blue HD Plus: einer der rollwiderstandärmsten Reifen seiner Klasse",
      "2019 – Eröffnung des europäischen Werks in Žatec, Tschechien",
      "2023 – Erstausrüstung für VW ID-Modelle (Elektrofahrzeuge)",
    ],
    signature: "Next Century – vom Underdog zum VW-Erstausrüster",
    employees: "~7.000",
    revenue: "1.8 Mrd. €",
    logo: "",
  },
];

export const continents = [
  {
    name: "Europa",
    flag: "🇪🇺",
    countries: ["Deutschland", "Frankreich", "Italien", "Finnland", "Niederlande"],
  },
  {
    name: "Asien",
    flag: "🌏",
    countries: ["Japan", "Südkorea"],
  },
  {
    name: "Nordamerika",
    flag: "🌎",
    countries: ["USA"],
  },
];

export const timelineEvents = manufacturers
  .map((m) => ({ year: m.founded, name: m.name, flag: m.flag, id: m.id }))
  .sort((a, b) => a.year - b.year);
