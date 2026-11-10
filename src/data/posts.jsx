// Blog and news posts (Dutch). NEW POSTS GO FIRST in the array (prepend, index 0).
//
// Fields:
//   id        internal key, unaccented, used for internal links and the page slug
//   titolo    title (visible, accents allowed)
//   data      publication date YYYY-MM-DD
//   categoria "Blog" or "Nieuws"
//   sommario  2-3 sentence summary (visible under the title; fallback meta description)
//   metaTitolo       optional full <title> of the static page, max 60 characters (fallback: titolo + brand)
//   metaDescrizione  optional meta description, max 160 characters (fallback: sommario)
//   contenuto array of blocks:
//     { tipo: "paragrafo", testo }            paragraph; use [[label|post-id]] for an internal link
//     { tipo: "titoletto", testo }            sub heading
//     { tipo: "immagine", testo: "/assets/images/x.webp", etichetta: "alt text and caption" }
//     { tipo: "emblema", testo: "/assets/images/x.png", etichetta: "alt text" }   transparent crest/emblem, centred, no chip
//     { tipo: "logo", testo: "/assets/images/x.png", etichetta: "alt text" }   small brand logo on a light chip, no caption
//     { tipo: "link", testo: "https://...", etichetta: "button label" }
//   attivo    true to publish, false to hide (build removes its static page)
//
// This file must contain plain JavaScript objects only (no JSX): the build scripts import it as an ES module.
// "Read also" blocks are added automatically (the 2 most recent other posts); do not write them by hand.

export const posts = [
  {
    id: "colossi-frames-nijkerk",
    metaTitolo: "Colossi frames in Nijkerk | S40 Fietsservice",
    metaDescrizione: "Colossi bouwt handgemaakte Nederlandse fietsframes op maat. S40 Fietsservice in Nijkerk helpt bij de keuze van het frame en de montage van je fiets.",
    titolo: "Colossi frames: handgemaakt in Zeeland, met advies en montage bij S40 Fietsservice",
    data: "2026-11-06",
    categoria: "Blog",
    sommario:
      "Colossi bouwt handgemaakte Nederlandse fietsframes, naar jouw maat en wensen. S40 Fietsservice in Nijkerk werkt samen met Colossi en helpt bij de keuze van het frame en de montage van de complete fiets.",
    contenuto: [
      { tipo: "paragrafo", testo: "Niet elke fiets komt uit een fabriek. Sommige frames worden met de hand gebouwd, naar de maat en de wensen van de berijder. Colossi doet dat in Nederland, en S40 Fietsservice kent de bouwers goed." },
      { tipo: "emblema", testo: "/assets/images/colossi-logo.png", etichetta: "Colossi, wapen met het jaartal 1982 en het motto Luctor et Emergo" },
      { tipo: "titoletto", testo: "Wie is Colossi?" },
      { tipo: "paragrafo", testo: "Colossi bouwt handgemaakte Nederlandse fietsframes. Oprichter Jan Kole was beroepsrenner en reed in de jaren zeventig en tachtig in Europa, onder meer voor Solahart-Herca en Femis Bank. Na zijn carrière bouwde hij maatframes voor fietsenwinkels in Nederland, België, Denemarken en het Verenigd Koninkrijk. Het wapen in het logo toont het jaartal 1982 en het motto Luctor et Emergo, dat ook het motto van Zeeland is." },
      { tipo: "paragrafo", testo: "Na een periode met een werkplaats in Shenzhen, vanaf 2005, werkt Colossi sinds 2017 weer vanuit Zeeland. Jan Kole bouwt daar samen met zijn zoon Sander de maatwerkframes met de hand." },
      { tipo: "titoletto", testo: "Wat maakt een Colossi bijzonder?" },
      { tipo: "paragrafo", testo: "Je kiest zelf de geometrie en de buizen. Een frame kan gemoft (lugged), fillet brazed of TIG-gelast zijn, en staal is het favoriete materiaal van de bouwers. Colossi zegt een van de grootste voorraden Columbus-buizen te hebben en bijna alles te kunnen bouwen wat je kunt bedenken." },
      { tipo: "paragrafo", testo: "In de collectie op de website van Colossi staan onder meer de modellen CRIT, STAB, Low Pro, LINER, Mondial Road, Mondial Track, Rambler Road, Rambler Track en Rambler CX, twee gravelframes (Gravel 1 en Gravel 2) en een 29'er." },
      { tipo: "titoletto", testo: "Samen kiezen en bouwen" },
      { tipo: "paragrafo", testo: "Omdat elk Colossi-frame individueel is, vraagt Colossi je eerst contact op te nemen, en zegt binnen 24 uur te reageren. S40 Fietsservice en Colossi werken samen en zijn bevriend. Denk je aan een Colossi-frame, dan kun je bij S40 terecht voor advies over de keuze: type, maat, geometrie en buizen, afgestemd op hoe jij rijdt. Is het frame er, dan monteren we de complete fiets voor je." },
      { tipo: "titoletto", testo: "Van frame naar complete fiets" },
      { tipo: "paragrafo", testo: "Een frame is nog geen fiets. Bij S40 Fietsservice bouwen we fietsen op maat en monteren we fietsen, nieuw en tweedehands. Een goede maat is het begin, en daar helpt een bikefit bij. Lees meer over [[wat een bikefit is|bikefit-nijkerk]]." },
      { tipo: "titoletto", testo: "Langskomen of een afspraak maken" },
      { tipo: "paragrafo", testo: "Loop binnen tijdens de openingstijden: dinsdag tot en met vrijdag van 10:00 tot 18:00 uur en zaterdag van 10:00 tot 16:00 uur. Voor een gesprek over een frame is een afspraak handig, via service@s40.nl of +31 6 26980438. Prijzen zijn op aanvraag." },
      { tipo: "link", testo: "https://www.colossiv5.com/", etichetta: "Bekijk de frames op colossiv5.com" },
    ],
    attivo: true,
  },
  {
    id: "yoonit-cargobikes-nijkerk",
    metaTitolo: "YOONIT cargobikes in Nijkerk | S40 Fietsservice",
    metaDescrizione: "YOONIT bouwt compacte cargobikes in Hamburg. S40 Fietsservice in Nijkerk is officieel dealer: bekijk en probeer verschillende modellen.",
    titolo: "YOONIT cargobikes in Nijkerk: bekijk en probeer ze bij S40 Fietsservice",
    data: "2026-11-05",
    categoria: "Blog",
    sommario:
      "YOONIT bouwt compacte cargobikes in Hamburg, voor gezin, dagelijkse boodschappen of werk. S40 Fietsservice in Nijkerk is officieel dealer: je kunt er verschillende modellen bekijken en proberen.",
    contenuto: [
      { tipo: "paragrafo", testo: "Een traditionele bakfiets is handig, maar ook groot en lastig te stallen. Wie kinderen, de hond of de boodschappen wil meenemen, hoeft daarvoor niet altijd zo'n fiets te kiezen. YOONIT bouwt cargobikes die veel compacter zijn, en bij S40 Fietsservice in Nijkerk kun je ze zien en proberen." },
      { tipo: "logo", testo: "/assets/images/yoonit-logo.png", etichetta: "YOONIT" },
      { tipo: "titoletto", testo: "Wat is YOONIT?" },
      { tipo: "paragrafo", testo: "YOONIT is een merk uit Hamburg. Het ontwerpt compacte cargo- en stadsfietsen en bouwt ze zelf in Hamburg op, met Europese onderdelen. Het merk omschrijft zijn fietsen als compact en modulair. S40 Fietsservice aan de Singel 40 is officieel dealer van YOONIT." },
      { tipo: "titoletto", testo: "Welke modellen zijn er?" },
      { tipo: "paragrafo", testo: "De Mini Cargobike is de ultracompacte lastenfiets voor gezin en dagelijks gebruik: voor kinderen, de hond en de boodschappen. Volgens YOONIT is hij licht, wendbaar en net zo makkelijk te rijden als een gewone fiets." },
      { tipo: "paragrafo", testo: "De Micro Utility Bike is nog kleiner. YOONIT noemt hem de kleinste fiets met cargo-gevoel, met verwisselbare kratten en manden. De PRO Business Bike is bedoeld voor ondernemers, ambachtslieden en maatschappelijke projecten." },
      { tipo: "titoletto", testo: "Een fiets die past bij hoe jij hem gebruikt" },
      { tipo: "paragrafo", testo: "De Mini Cargobike is er voor drie soorten gebruik: Family Up voor het gezin, Daily Basket en Dog Seat voor boodschappen en de hond, en Job Carrier voor werk. De fietsen van YOONIT zijn volledig te configureren, dus je stelt ze samen op jouw gebruik." },
      { tipo: "titoletto", testo: "Accessoires" },
      { tipo: "paragrafo", testo: "Bij de Micro Utility Bike horen verwisselbare kratten en manden. Voor de Mini Cargobike is er een uitvoering met mand en hondenzitje. Welke modellen, uitvoeringen en accessoires er in de winkel staan, wisselt. Vraag er gerust naar." },
      { tipo: "titoletto", testo: "Ook met elektrische aandrijving" },
      { tipo: "paragrafo", testo: "Elektrische aandrijving is bij YOONIT mogelijk, onder meer bij de Mini Cargobike. Vraag in de winkel wat de mogelijkheden zijn." },
      { tipo: "titoletto", testo: "Bekijken en proberen in Nijkerk" },
      { tipo: "paragrafo", testo: "Bij S40 Fietsservice kun je verschillende YOONIT-modellen bekijken en proberen. S40 is een werkplaats van fietsers voor fietsers, en die aandacht voor een goede afstelling geldt ook voor de fiets waarmee je elke dag rijdt. Wil je weten wat we verder doen? Lees dan [[waar je in Nijkerk terecht kunt als racefietser|racefietsenmaker-nijkerk]]." },
      { tipo: "titoletto", testo: "Langskomen of een afspraak maken" },
      { tipo: "paragrafo", testo: "Loop binnen tijdens de openingstijden: dinsdag tot en met vrijdag van 10:00 tot 18:00 uur en zaterdag van 10:00 tot 16:00 uur. Wil je zeker weten dat een model er staat, maak dan een afspraak via service@s40.nl of +31 6 26980438. Prijzen zijn op aanvraag." },
      { tipo: "link", testo: "https://minicargobike.com/", etichetta: "Bekijk de modellen op minicargobike.com" },
    ],
    attivo: true,
  },
  {
    id: "nieuws-suela-schouten",
    metaTitolo: "BMX-racer Suéla Schouten uit Nijkerk | S40 Fietsservice",
    metaDescrizione: "Suéla Schouten uit Nijkerk werd in 2025 wereldkampioene BMX (Women 30-39). S40 Fietsservice sponsort haar en houdt haar fiets rijklaar.",
    titolo: "S40 Fietsservice sponsort BMX-racer Suéla Schouten uit Nijkerk",
    data: "2026-11-03",
    categoria: "Nieuws",
    sommario:
      "Suéla Schouten uit Nijkerk werd in 2025 wereldkampioene BMX in de klasse Women 30-39. S40 Fietsservice is trots dat zij onze sponsoring heeft en dat we haar fiets rijklaar houden.",
    contenuto: [
      { tipo: "paragrafo", testo: "BMX-racer Suéla Schouten komt uit Nijkerk en rijdt kampioenschappen in de BMX-klassen Women en Cruiser. S40 Fietsservice is trots dat we haar mogen sponsoren en dat haar BMX bij ons in de werkplaats staat voor onderhoud en afstelling." },
      { tipo: "immagine", testo: "/assets/images/suela-schouten-bmx.webp", etichetta: "Suéla Schouten met haar BMX, plaatnummer 12, voor een groene muur" },
      { tipo: "titoletto", testo: "Wereldkampioene in Kopenhagen" },
      { tipo: "paragrafo", testo: "In de zomer van 2025 werd Suéla wereldkampioene BMX in de klasse Women 30-39 op het WK in Kopenhagen. Volgens het lokale nieuws won ze daar alle manches en de finales." },
      { tipo: "titoletto", testo: "Ook Europees en Nederlands succes" },
      { tipo: "paragrafo", testo: "In 2024 werd Suéla Europees kampioene in de klasse Cruiser Women 30-39, met de finale in het Italiaanse Verona. Daarnaast won ze meerdere Nederlandse titels in de klassen Women 17+ en Cruiser, onder meer in 2022 in Uithoorn." },
      { tipo: "titoletto", testo: "Wat wij voor haar doen" },
      { tipo: "paragrafo", testo: "BMX racing vraagt veel van een fiets, ook van de remmen. Voor Suéla losten we het typische remprobleem van BMX'en op. Het onderhouden en afstellen van race-BMX'en hoort bij het werk in onze werkplaats, naast racefietsen, gravelbikes en baanfietsen." },
      { tipo: "paragrafo", testo: "Wil je weten wat we nog meer doen? Lees dan [[waar je in Nijkerk terecht kunt als racefietser|racefietsenmaker-nijkerk]]." },
      { tipo: "link", testo: "https://www.instagram.com/suelaschouten/", etichetta: "Volg Suéla op Instagram" },
    ],
    attivo: true,
  },
  {
    id: "bikefit-nijkerk",
    metaTitolo: "Wat is een bikefit bij Nijkerk? | S40 Fietsservice",
    metaDescrizione: "Een bikefit stemt je fiets af op je lichaam en je doelen. Lees wat het is, wanneer het zinvol is en waar je terecht kunt bij Nijkerk.",
    titolo: "Wat is een bikefit en waar laat je die doen bij Nijkerk?",
    data: "2026-11-03",
    categoria: "Blog",
    sommario:
      "Een bikefit stemt je fiets af op je lichaam, je manier van rijden en je doelen. Lees wat het is, wanneer het zinvol is, wat je kunt voorbereiden en waar je terecht kunt bij Nijkerk.",
    contenuto: [
      { tipo: "paragrafo", testo: "Twee fietsers op hetzelfde frame zitten nooit precies hetzelfde. Verschillen in lengte, flexibiliteit, rijstijl en doel zorgen ervoor dat een fiets die voor de een perfect voelt, voor de ander pijn of ongemak geeft. Een bikefit lost dat op door de fiets aan te passen aan jou, in plaats van andersom." },
      { tipo: "titoletto", testo: "Wat is een bikefit?" },
      { tipo: "paragrafo", testo: "Een bikefit, ook wel set-up genoemd, is het afstellen van je fiets op jouw lichaam, jouw manier van rijden en jouw doelen. Het doel is dat je comfortabel, efficiënt en zonder pijn of ongemak fietst. Het gaat daarbij onder meer om de plekken waar je de fiets raakt: het zadel, het stuur en de pedalen." },
      { tipo: "titoletto", testo: "Wanneer heb je een bikefit nodig?" },
      { tipo: "paragrafo", testo: "Je fiets is waarschijnlijk niet goed afgesteld als je tijdens of na het rijden pijn of ongemak hebt in je knieën, rug, nek, schouders of polsen, als je handen of voeten gaan slapen, of als je steeds op je zadel wegglijdt. Een bikefit is ook zinvol bij een nieuwe of tweedehands fiets, na een lange pauze of als je lichaam of doelen veranderen, en als je je voorbereidt op een wedstrijd of een lange tocht. Houd je klachten aan, raadpleeg dan ook een arts of fysiotherapeut." },
      { tipo: "titoletto", testo: "Voor wie een nieuwe of tweedehands fiets koopt" },
      { tipo: "paragrafo", testo: "Wie een fiets koopt, kijkt vaak naar maat en prijs. Maar een framemaat op papier zegt weinig over hoe de fiets op jouw lichaam past. Als je een nieuwe of tweedehands fiets overweegt, heb je vooral baat bij iemand die meekijkt naar de positie en de onderdelen die daarbij passen, voordat je er veel kilometers op maakt." },
      { tipo: "paragrafo", testo: "Bij S40 Fietsservice aan de Singel 40 in Nijkerk hoort set-up en bikefit bij het dagelijkse werk. Het team stelt fietsen af op jouw lichaam en jouw doelen, geeft advies bij de aankoop van een nieuwe fiets en stelt nieuwe of tweedehands fietsen samen naar jouw wensen. De monteurs zijn zelf fietsers en stoppen niet als iets werkt, maar als het in elke positie goed werkt." },
      { tipo: "immagine", testo: "/assets/images/crankset-install.webp", etichetta: "Monteur bij het monteren van een crankstel in de werkplaats" },
      { tipo: "titoletto", testo: "Wat kun je meenemen?" },
      { tipo: "paragrafo", testo: "Neem je eigen fiets mee, de schoenen waarmee je rijdt en kleding waarin je je prettig voelt. Bedenk van tevoren welke klachten je hebt, hoe vaak en hoe lang je rijdt en wat je doel is. Vertel ook of je een wedstrijd of lange tocht gepland hebt. Hoe duidelijker je vraag, hoe gerichter de afstelling." },
      { tipo: "titoletto", testo: "Ook voor racefiets en gravel" },
      { tipo: "paragrafo", testo: "Een goede afstelling is net zo belangrijk op een racefiets als op een gravelbike. Lees ook [[wat je kunt verwachten van een racefietsenmaker|racefietsenmaker-nijkerk]] en [[hoe je een gravelbike in Nijkerk laat onderhouden|gravelbike-onderhoud-nijkerk]]." },
      { tipo: "titoletto", testo: "Een afspraak maken" },
      { tipo: "paragrafo", testo: "Je maakt een afspraak via service@s40.nl, telefoon +31 6 26980438 of het formulier op de website. Zonder afspraak binnenlopen kan ook: de werkplaats is open van dinsdag tot en met vrijdag van 10:00 tot 18:00 uur en op zaterdag van 10:00 tot 16:00 uur. Prijzen zijn op aanvraag." },
    ],
    attivo: true,
  },
  {
    id: "gravelbike-onderhoud-nijkerk",
    metaTitolo: "Gravelbike onderhoud in Nijkerk | S40 Fietsservice",
    metaDescrizione: "Een gravelbike maakt meer vuil, zand en water mee dan een racefiets. Lees waar je op moet letten en waar je in Nijkerk terecht kunt.",
    titolo: "Gravelbike onderhouden of laten repareren in Nijkerk: wat je moet weten",
    data: "2026-11-03",
    categoria: "Blog",
    sommario:
      "Een gravelbike maakt meer vuil, zand en water mee dan een racefiets. Lees waar je op moet letten bij onderhoud en waar je in Nijkerk terecht kunt voor onderhoud en reparatie.",
    contenuto: [
      { tipo: "paragrafo", testo: "Met een gravelbike rijd je over asfalt, grind, zand en bospaden, soms alles in één rit. Dat maakt hem veelzijdig, maar ook gevoeliger voor slijtage dan een fiets die vooral op droog asfalt rijdt. Wie zijn gravelbike goed onderhoudt, heeft er langer plezier van en staat minder vaak stil ver van huis." },
      { tipo: "titoletto", testo: "Waar slijt een gravelbike sneller?" },
      { tipo: "paragrafo", testo: "Zand en modder werken door in de ketting, de tandwielen en de lagers. Water en vuil belasten ook de remmen. Rij je tubeless, dan droogt de sealant in de banden na verloop van tijd op en moet die worden vervangen. Hoe wisselender de ondergrond, hoe belangrijker het is om regelmatig te controleren in plaats van te wachten tot er iets misgaat." },
      { tipo: "titoletto", testo: "Een kleine routine tussen de beurten" },
      { tipo: "paragrafo", testo: "Spoel na een natte of zanderige rit het ergste vuil voorzichtig af, zonder hogedrukstraal op de lagers, en droog de fiets. Reinig de ketting en smeer hem opnieuw. Controleer de bandenspanning en let op nieuwe geluiden uit de trapas of het balhoofd. Een ketting die schoon en gesmeerd blijft, gaat langer mee en schakelt beter." },
      { tipo: "immagine", testo: "/assets/images/chain-cleaning-cyclon.webp", etichetta: "Een fietsketting in de reinigingsmachine van CyclOn" },
      { tipo: "titoletto", testo: "Voor wie lange dagen op onverhard rijdt" },
      { tipo: "paragrafo", testo: "Rij je lange tochten op wisselend terrein of start je gravelwedstrijden, dan heb je een fiets nodig die je ook ver van huis niet in de steek laat. Je wilt een werkplaats die begrijpt wat zo'n dag van je fiets vraagt en die ook een raar geluid serieus neemt, niet alleen wat op de lijst staat." },
      { tipo: "paragrafo", testo: "Bij S40 Fietsservice aan de Singel 40 in Nijkerk onderhouden en repareren fietsers gravelbikes, net als racefietsen, baanfietsen, BMX'en en triatlonfietsen. Het team kijkt naar de hele fiets en neemt ook klussen aan die andere werkplaatsen weigeren. Voor de ketting voert S40 Izumi-kettingen en is het dealer van CyclOn, bekend van fietsverzorging. De gebruikelijke doorlooptijd is 24 uur." },
      { tipo: "titoletto", testo: "Onderhoud, reparatie of iets bijzonders" },
      { tipo: "paragrafo", testo: "Je kunt bij S40 Fietsservice terecht voor alle werkzaamheden: onderhoud, reparatie, onderdelen en accessoires, en een fiets op maat. Een goede afstelling helpt ook op lange dagen: lees [[wat een bikefit is en wanneer je er een nodig hebt|bikefit-nijkerk]]. Rijd je ook op de weg? Dan is dit [[de racefietsenmaker in Nijkerk|racefietsenmaker-nijkerk]] ook voor jouw racefiets de plek." },
      { tipo: "titoletto", testo: "Langskomen of een afspraak maken" },
      { tipo: "paragrafo", testo: "Loop binnen tijdens de openingstijden: dinsdag tot en met vrijdag van 10:00 tot 18:00 uur, zaterdag van 10:00 tot 16:00 uur. Voor een grotere klus is een afspraak handig, via service@s40.nl of +31 6 26980438. Prijzen zijn op aanvraag, omdat elke fiets en elke klus anders is." },
    ],
    attivo: true,
  },
  {
    id: "racefietsenmaker-nijkerk",
    metaTitolo: "Racefietsenmaker in Nijkerk | S40 Fietsservice",
    metaDescrizione: "Wie in of rond Nijkerk een racefiets heeft, wil een werkplaats die snapt wat je vraagt. Dit mag je verwachten van een racefietsenmaker met UCI-ervaring.",
    titolo: "Racefietsenmaker in Nijkerk: waar je fiets in goede handen is",
    data: "2026-11-03",
    categoria: "Blog",
    sommario:
      "Wie in of rond Nijkerk een racefiets heeft, wil een werkplaats die snapt wat jij van je fiets vraagt. Dit mag je verwachten van een racefietsenmaker die zelf koerst en in UCI-teams heeft gewerkt.",
    contenuto: [
      { tipo: "paragrafo", testo: "Een racefiets is geen gewone fiets. Een versnelling die in één positie net niet goed schakelt, een zadel dat een fractie te hoog staat of een kabel die niet vrij loopt: je voelt het op elke rit, en in een wedstrijd kan het verschil maken. Daarom zoeken veel fietsers in Nijkerk en omgeving niet zomaar een fietsenmaker, maar een racefietsenmaker." },
      { tipo: "immagine", testo: "/assets/images/tool-wall.webp", etichetta: "De gereedschapswand in de werkplaats aan de Singel 40" },
      { tipo: "titoletto", testo: "Wat maakt een racefietsenmaker anders?" },
      { tipo: "paragrafo", testo: "Een goede racefietsenmaker kijkt niet alleen naar wat kapot is, maar naar hoe de fiets als geheel werkt: aandrijving, remmen, wielen, positie en de manier waarop jij rijdt. Het verschil zit in ervaring met precies dit soort fietsen en in de wil om door te zetten tot het klopt." },
      { tipo: "titoletto", testo: "Voor wie serieus traint of koerst" },
      { tipo: "paragrafo", testo: "Als je wekelijks kilometers maakt, in clubverband rijdt of wedstrijden start, wil je dat je fiets elke keer hetzelfde doet. Je wilt niet midden in een afdaling merken dat iets niet klopt, en je wilt een werkplaats die begrijpt dat je voor een wedstrijd een datum hebt." },
      { tipo: "paragrafo", testo: "Bij S40 Fietsservice aan de Singel 40 is dat de dagelijkse praktijk. De fietsers achter de werkbank hebben meer dan twintig jaar ervaring in Europa, van amateur tot professioneel, werkten als monteur in UCI-teams en maken fietsen klaar volgens UCI-normen. Ze stoppen niet als de versnellingen schakelen, maar als ze in elke positie perfect werken. En omdat ze zelf rijden, begrijpen ze waarom jouw fiets op tijd klaar moet zijn." },
      { tipo: "titoletto", testo: "Een probleem dat niemand oplost?" },
      { tipo: "paragrafo", testo: "Soms heeft een fiets een probleem dat meerdere werkplaatsen niet oplossen. S40 Fietsservice neemt zulke klussen aan. De tijd die het team steekt in het onderzoeken van het probleem en het zoeken naar de beste oplossing, rekent het niet door. In een Google-recensie schrijft een klant dat andere zaken het niet opgelost kregen en dat het bij S40 meteen en snel werd gerepareerd." },
      { tipo: "titoletto", testo: "Wat kun je laten doen?" },
      { tipo: "paragrafo", testo: "Je kunt bij S40 Fietsservice terecht voor onderhoud en reparatie, wedstrijdvoorbereiding, onderdelen en accessoires, en voor een fiets op maat, nieuw of tweedehands. Ook set-up en bikefit horen erbij: lees [[wat een bikefit is|bikefit-nijkerk]]. Naast racefietsen werkt het team aan gravelbikes, baanfietsen, BMX'en en triatlonfietsen. Voor onderhoud aan je gravelbike lees je [[hier verder|gravelbike-onderhoud-nijkerk]]. De gebruikelijke doorlooptijd is 24 uur." },
      { tipo: "titoletto", testo: "Met of zonder afspraak" },
      { tipo: "paragrafo", testo: "Je kunt zonder afspraak binnenlopen: de werkplaats is open van dinsdag tot en met vrijdag van 10:00 tot 18:00 uur en op zaterdag van 10:00 tot 16:00 uur. Voor een grotere klus of een wedstrijd die eraan komt, is een afspraak handig. Mail service@s40.nl, bel +31 6 26980438 of gebruik het formulier op de website. Prijzen zijn op aanvraag." },
    ],
    attivo: true,
  },
];
