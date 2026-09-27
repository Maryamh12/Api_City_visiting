/**
 * seed-db.js
 * 40 world cities, 4-6 rich stories each (~200 stories total).
 * Run:  npm run seed-db
 */

import mongoose from "mongoose";
import bcrypt   from "bcrypt";
import { connectToDb } from "./db.js";
import Cat  from "../models/cat.js";
import User from "../models/user.js";

const CITIES = [
  {
    name: "Paris",
    text: "The city of light where centuries of history blend with contemporary flair. From the Louvre to the Eiffel Tower, Paris is a living museum of artistic brilliance and romance.",
    image: "https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Sunrise at the Eiffel Tower", image: "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Arriving at Trocadero before dawn, the city was still asleep. As the first light hit the iron lattice, the tower turned gold. A street musician started playing Satie on an accordion. Nobody had asked him to. Nobody needed to." },
      { name: "Lost in the Marais", image: "https://images.pexels.com/photos/1796736/pexels-photo-1796736.jpeg?auto=compress&cs=tinysrgb&w=600", description: "We ditched the map entirely and let the cobblestones lead us. Down one alley we found a gallery showing only photographs of hands. Down another, a fromagerie where the owner had been cutting cheese for fifty years and still loved every minute of it." },
      { name: "The Perfect Croissant", image: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=600", description: "Three boulangeries, one verdict. The winner was a tiny place on Rue de Bretagne with no sign, just a handwritten note in the window. The croissant shattered at the first bite, showering the pavement with butter-flaked crumbs. Worth every one." },
      { name: "Musee d Orsay at Dusk", image: "https://images.pexels.com/photos/2929168/pexels-photo-2929168.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Impressionists glow differently in the late afternoon. I stood in front of Monet's water lilies for twenty minutes without moving, trying to understand how someone turned blurred light into emotion. I still do not know. That might be the point." },
      { name: "Seine by Night", image: "https://images.pexels.com/photos/3015484/pexels-photo-3015484.jpeg?auto=compress&cs=tinysrgb&w=600", description: "We bought a bottle of wine and sat on the steps by Pont des Arts watching the bateaux mouches drift past. Every city looks better at night reflected in water. Paris looks transcendent." },
      { name: "Montmartre at Dawn", image: "https://images.pexels.com/photos/1197095/pexels-photo-1197095.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The white dome of Sacre-Coeur above the sleeping city. Cobblestones still wet from overnight rain. A cat watching from a doorstep. Montmartre at 6am belongs to the artists who never left and the visitors who got up early enough to find them." },
    ],
  },
  {
    name: "Tokyo",
    text: "A city of extraordinary contrasts where serene temples stand beside neon-lit skyscrapers. Japan's capital weaves ancient Shinto tradition into the fabric of cutting-edge technology and pop culture.",
    image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Cherry Blossoms in Ueno Park", image: "https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Every spring, Ueno transforms into a pink canopy. Hana spread her picnic mat beneath the trees and joined thousands in hanami. Sake cups were raised, petals fell, and for one afternoon nothing else existed." },
      { name: "Midnight Ramen in Shinjuku", image: "https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Kenji discovered the best ramen of his life at 2am in a tiny eight-seat counter in a Shinjuku alley. The broth had simmered for eighteen hours. Neon signs flickered over rain-slicked streets. He went back three nights in a row." },
      { name: "Tsukiji at Dawn", image: "https://images.pexels.com/photos/2232979/pexels-photo-2232979.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The outer market opens before Tokyo wakes. We ate the freshest tuna sashimi of our lives standing at a counter the size of a bookshelf, watching boats unload in the harbour mist. Everything about it was perfect." },
      { name: "Senso-ji Before the Crowds", image: "https://images.pexels.com/photos/5745823/pexels-photo-5745823.jpeg?auto=compress&cs=tinysrgb&w=600", description: "6am at Senso-ji is a different world. The incense smoke drifts straight up through still air, monks in saffron robes pass through the gate, and the only sounds are footsteps on stone. By 9am the selfie sticks have arrived. Get there early." },
      { name: "Shibuya Crossing at Rush Hour", image: "https://images.pexels.com/photos/1510595/pexels-photo-1510595.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Two thousand people crossing from every direction at once, and nobody collides. It is the most organised chaos on earth. I stood on the Starbucks balcony and watched for an hour. A choreography nobody rehearsed." },
      { name: "Akihabara After Dark", image: "https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Eight floors of manga, vintage game cartridges, and figures still in their boxes. A boy on the fourth floor was selling his entire Gundam collection. He looked like it was costing him something to let it go. I understood that feeling." },
    ],
  },
  {
    name: "New York",
    text: "The city that never sleeps - a relentless, exhilarating tapestry of ambition and diversity stretching from the brownstones of Brooklyn to the towers of Manhattan.",
    image: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Central Park in October", image: "https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The trees go amber and scarlet all at once. People jog past in layers, couples share one side of a bench, a saxophonist plays near Bethesda Fountain. Central Park in autumn is the city remembering how to breathe." },
      { name: "The High Line at Sunrise", image: "https://images.pexels.com/photos/771881/pexels-photo-771881.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Nobody is there yet. The old rail tracks are still damp from overnight rain. The sun rises behind the Empire State and throws long shadows across the wildflower beds. In an hour it will be busy. Right now it belongs to you." },
      { name: "Brooklyn Bridge Walk", image: "https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Walk it from Brooklyn at dusk. The cables glow amber, the skyline appears piece by piece, and the East River catches everything. By the time you reach Manhattan you understand why people moved here and never left." },
      { name: "A Slice on the Lower East Side", image: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Dollar pizza, folded once, standing at the counter. The guy behind the glass has been doing this for thirty years. He does not ask what you want. He knows. This is what New York actually tastes like." },
      { name: "Jazz at the Village Vanguard", image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Seventy seats, the best acoustics in jazz, a bill that reads like a history of the music. Miles played here. Coltrane played here. Tonight a quartet from New Orleans played with no pause. We did not want them to stop." },
    ],
  },
  {
    name: "London",
    text: "Centuries of history layered under a cosmopolitan present. From the Tower of London to Shoreditch street art, London never stops reinventing itself while remembering everything.",
    image: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Borough Market on Sunday", image: "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Artisan cheese, sourdough still warm from the oven, Ethiopian coffee, Scotch eggs. Borough Market is London at its most generous. The Thames glittered outside. Church bells rang across Southwark Bridge." },
      { name: "Lost in the British Museum", image: "https://images.pexels.com/photos/2695232/pexels-photo-2695232.jpeg?auto=compress&cs=tinysrgb&w=600", description: "I planned one hour. I stayed five. The Rosetta Stone drew me in, then the Elgin Marbles, then a tiny Roman hairpin from 200 AD. Evidence that the impulse to be beautiful is the most persistent thing about us." },
      { name: "Hampstead Heath at Dusk", image: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=600", description: "From Parliament Hill the whole city unrolls below. St Paul's dome, the Shard catching the last light. Londoners walk their dogs up here like it is nothing. Like this view has not been stopping people dead for three hundred years." },
      { name: "Pub Culture in Soho", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "A Victorian pub in Soho with hand-pulled bitter and a snug where writers have been arguing about everything since the 1950s. The landlord knows everyone by name. The beer is room temperature. This is deliberate. This is correct." },
      { name: "Notting Hill in August", image: "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Carnival brings two million people and the bass from a hundred sound systems. Jerk chicken smoke rising over the terraces. Notting Hill Carnival is the largest street party in Europe and the most generous. Strangers share food. Everyone dances." },
    ],
  },
  {
    name: "Rome",
    text: "The Eternal City where every cobblestone has a story and every corner reveals another layer of two thousand years of civilisation, art, and very good pasta.",
    image: "https://images.pexels.com/photos/753639/pexels-photo-753639.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "The Pantheon at Opening Time", image: "https://images.pexels.com/photos/2225439/pexels-photo-2225439.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Queue fifteen minutes early and walk in as the doors open. The oculus pours light down in a column that moves across the floor as the morning turns. Hadrian built this in 125 AD and it still stands. An unremarkable Monday." },
      { name: "Cacio e Pepe at a Local Trattoria", image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Three ingredients: pasta, pecorino, black pepper. In the right hands it becomes something that makes you quiet for a moment. The trattoria had six tables and a waiter who sighed when we said we were from England. Then brought extra bread anyway." },
      { name: "Trastevere by Night", image: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=600", description: "When the restaurants fill and the plazas light up with lanterns, Trastevere becomes the Rome the Romans actually live in. Sit outside, order the house red, listen to a street guitarist play Battisti. This is why you came." },
      { name: "The Borghese Gallery", image: "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600", description: "You can only book two hours and they enforce it. Those two hours contain Bernini's Apollo and Daphne, marble that moves, marble that breathes. Stand in front of it. That is all the instruction you need." },
      { name: "Colosseum at First Light", image: "https://images.pexels.com/photos/753639/pexels-photo-753639.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Before the tour groups arrive, the Forum is yours. Walk the Via Sacra in silence. The Arch of Titus. The Temple of Saturn. The Colosseum shadow falling across the ancient road. Rome's past is not behind glass. It is underfoot." },
    ],
  },
  {
    name: "Barcelona",
    text: "Gaudi's dreamlike architecture, golden beaches, a world-class food scene, and a fiercely proud Catalan identity make Barcelona one of the most alive cities in Europe.",
    image: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Sagrada Familia at Noon", image: "https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=600", description: "At noon the stained glass throws pools of amber, violet and emerald across the nave floor. Gaudi conceived this as a stone bible for people who could not read. The light does the reading for you. Book towers early, they sell out weeks ahead." },
      { name: "La Boqueria Before 9am", image: "https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600", description: "After 10am it belongs to tourists. Before 9 it belongs to chefs. We ate jamon standing up with cafe con leche and watched a restaurant owner negotiate over clams with the quiet intensity of a chess player." },
      { name: "Park Guell on a Weekday", image: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Gaudi's hillside park looks like a fairy tale reimagined by a geologist. The mosaic salamander, the colonnaded market hall, the serpentine benches. Go Tuesday morning in November and you will have sections nearly to yourself." },
      { name: "El Born at Midnight", image: "https://images.pexels.com/photos/3015484/pexels-photo-3015484.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Barcelona does not start until 11pm. By midnight, El Born is alive with terrace bars, a jazz club spilling music onto the street, couples arguing passionately over nothing, a dog sitting patiently outside a restaurant." },
      { name: "Barceloneta Beach at Dawn", image: "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Empty at 6am except for a few early swimmers and the fishermen returning from the night. The Mediterranean is flat and silver. The city behind you is completely quiet. This is a Barcelona that most visitors never see." },
    ],
  },
  {
    name: "Istanbul",
    text: "The city where East meets West literally. Istanbul straddles two continents, and its Ottoman mosques, Byzantine churches, spice bazaars and modern art galleries occupy the same impossible city.",
    image: "https://images.pexels.com/photos/1549326/pexels-photo-1549326.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Hagia Sophia at First Light", image: "https://images.pexels.com/photos/3777979/pexels-photo-3777979.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Built in 537 AD as the greatest church in the world, converted to a mosque, turned into a museum, reconverted to a mosque. Hagia Sophia has survived everything. Inside, the dome floats above you on what seems like light alone." },
      { name: "The Grand Bazaar", image: "https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Four thousand shops across sixty streets inside one roof. Lanterns, carpets, spice pyramids, ceramics, leather, gold, all competing for your attention at the same volume. The trick is to wander without needing anything. Then you find everything." },
      { name: "Bosphorus at Sunset", image: "https://images.pexels.com/photos/3889856/pexels-photo-3889856.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Take the public ferry from Eminonu. For the price of a coffee you get an hour on the water between two continents as the sun drops behind the minarets. Fishermen cast lines from the Galata Bridge above. Seagulls follow the wake." },
      { name: "Turkish Breakfast in Karakoy", image: "https://images.pexels.com/photos/3434523/pexels-photo-3434523.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Turkish breakfast is not a meal. It is a ceremony. Olives, white cheese, cucumber, tomato, honey, kaymak, soft eggs, and cay in tulip glasses that never empty. We sat by the water for two hours and felt entirely restored." },
      { name: "Whirling Dervishes", image: "https://images.pexels.com/photos/4388164/pexels-photo-4388164.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Sema ceremony in Galata is not a performance. The dervishes spin for forty minutes, arms extended, right palm up to receive grace, left palm down to pass it to the earth. Watching in silence felt like overhearing someone's prayer." },
    ],
  },
  {
    name: "Kyoto",
    text: "Japan's ancient imperial capital, where a thousand temples, geisha traditions, and the world's most precise garden design coexist with bullet trains and excellent matcha ice cream.",
    image: "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Fushimi Inari Before Dawn", image: "https://images.pexels.com/photos/2187609/pexels-photo-2187609.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Ten thousand vermilion torii gates wind up the mountain. Start climbing at 5am and you will have the lower gates to yourself. The light filters through in amber shafts. By 8am the crowds arrive. The foxes watch from the shadows at any hour." },
      { name: "Arashiyama Bamboo Grove", image: "https://images.pexels.com/photos/1198817/pexels-photo-1198817.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The bamboo makes a sound when the wind moves through it, a hollow clicking, almost musical. The light is green and diffused. It feels like being underwater in a forest. The grove is not large, but it is complete." },
      { name: "Tea Ceremony in Gion", image: "https://images.pexels.com/photos/3887985/pexels-photo-3887985.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The matcha is bitter and electric green. The ceramic bowl is four hundred years old and repaired with gold, the art of kintsugi, making something more beautiful because of its breaks. The ceremony takes an hour for one cup. Every second is intentional." },
      { name: "Philosopher's Path in Autumn", image: "https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The canal path between Nanzen-ji and Ginkaku-ji is lined with cherry trees. In autumn they go crimson and gold and the canal reflects every colour. A philosopher walked here every day. Walking it once, you understand why he needed to come back." },
      { name: "Nishiki Market", image: "https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The narrow covered market called Kyoto's Kitchen. Five blocks of pickled vegetables, fresh tofu, matcha confections, grilled skewers, and dried seafood. The vendors have supplied Kyoto restaurants for generations. Everything is prepared with a precision that matches the temples nearby." },
    ],
  },
  {
    name: "Amsterdam",
    text: "A city of canals, bicycles, Golden Age paintings, and a tolerance that has made it one of Europe's most liveable and most visited cities for five centuries.",
    image: "https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "The Rijksmuseum at Opening", image: "https://images.pexels.com/photos/2068380/pexels-photo-2068380.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Night Watch is bigger than you think. Rembrandt painted it in 1642 and it has commanded the room ever since. Arrive at nine when the doors open and you will have three minutes alone with it. Take them." },
      { name: "Cycling the Jordaan", image: "https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Hire a bike from the station and just ride. The Jordaan is a grid of 17th-century canal houses, cheese shops, flower stalls, and brown cafes. No hills, no traffic that will not yield to you. This is how Amsterdam is supposed to be seen." },
      { name: "Anne Frank House", image: "https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Book months in advance. The house is small and the hiding space is smaller than you imagined. Her bedroom diary cutouts are still on the wall. The weight of what happened here presses down on every visitor. Come anyway. The weight is the point." },
      { name: "Herring at a Harbour Stall", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Raw herring, eaten by the tail, with raw onion on top. The first time is a negotiation with yourself. After that it is simply delicious. The harbour stall near Centraal Station has been doing this the same way since before most countries existed." },
      { name: "Keukenhof in Tulip Season", image: "https://images.pexels.com/photos/1531660/pexels-photo-1531660.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Thirty kilometres of flower paths through seven million bulbs. In April the whole country smells of tulips. Keukenhof opens for eight weeks and in those eight weeks the Netherlands shows you exactly what it can do when it decides to be beautiful." },
    ],
  },
  {
    name: "Sydney",
    text: "Sun, surf, the Opera House, and a harbour so beautiful it embarrasses all other harbours. Sydney is the city that makes you want to move there by the end of the first day.",
    image: "https://images.pexels.com/photos/995764/pexels-photo-995764.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Opera House at Sunrise", image: "https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The shells catch the early light and glow against the harbour. From Mrs Macquarie's Chair you see the whole composition at once, Opera House, Harbour Bridge, ferries carving white lines in blue water. It is exactly as good as you think it will be. Better." },
      { name: "Bondi to Coogee Walk", image: "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Six kilometres of coastal path above the Pacific. Sandstone cliffs, tidal pools, surfers reading waves from above. Stop at Bronte for fish and chips. Eat them on the grass above the beach. This is the walk that made Sydneysiders smug. Deservedly." },
      { name: "Ferry to Manly", image: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The best thirty minutes in Sydney costs the price of a ferry ticket. The Manly ferry crosses the harbour past the Opera House, under the Bridge, and out through the Heads to the open Pacific. Come back at dusk when the city is lit." },
      { name: "Surry Hills on a Saturday", image: "https://images.pexels.com/photos/2868257/pexels-photo-2868257.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The neighbourhood where Sydney eats. Coffee shops with queues that move faster than they look, bakeries, ramen, a cheese cave, a bar that opens at noon and is already full. Surry Hills on Saturday is Sydney at ease with itself." },
      { name: "Blue Mountains Day Trip", image: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Ninety minutes west by train, the eucalyptus forests drop away into valleys so deep and blue that early settlers thought they were looking at the sea. The Three Sisters sandstone formation at Katoomba. The Scenic Railway, the steepest in the world. Then back to Sydney for dinner." },
    ],
  },
  {
    name: "Dubai",
    text: "A city that decided fifty years ago to become the future and has been sprinting toward it ever since. Dubai is excessive, astonishing, contradictory, and genuinely unlike anywhere else on earth.",
    image: "https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Burj Khalifa at Dusk", image: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=600", description: "828 metres. The highest observation deck is above the clouds on bad days. On clear days the Gulf extends to the horizon and the desert rolls away in every direction. The city below looks like a circuit board. Sunset from here is otherworldly." },
      { name: "The Old Souk", image: "https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Cross the Dubai Creek by abra and you enter a different city. The Gold Souk and Spice Souk are dense, fragrant, and entirely serious. This is trade as it was practised before malls existed. The haggling is part of the price." },
      { name: "Desert Safari at Night", image: "https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=600", description: "An hour from the city the dunes are absolute silence. A desert camp under no moon, the Milky Way visible from edge to edge. A falcon on a handler's wrist. Tea with cardamom. The contrast between this and the towers nearby is the real story of Dubai." },
      { name: "Dubai Frame at Sunrise", image: "https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The giant picture frame divides old Dubai on one side from new Dubai on the other. Walk the glass bridge between them and look down at both worlds simultaneously. It is deliberately metaphorical. It also works as metaphor, which is harder to achieve than it sounds." },
      { name: "Dubai Creek at Dawn", image: "https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Wooden dhow cargo boats still operate from the Creek exactly as they did before the towers. At dawn the crews are loading by hand. Beyond them the skyline of the financial district appears in the morning haze. Two Dubais, separated by sixty years and visible in one glance." },
    ],
  },
  {
    name: "Mexico City",
    text: "One of the world's largest and most underrated cities. More museums than any capital except Washington, the best food in the Americas, and a depth of pre-Columbian history that stops you mid-step.",
    image: "https://images.pexels.com/photos/3290078/pexels-photo-3290078.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Teotihuacan at Dawn", image: "https://images.pexels.com/photos/2684384/pexels-photo-2684384.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Pyramid of the Sun at sunrise, before the bus tours arrive. You climb 248 steps to a platform where priests once read the sky. The Avenue of the Dead stretches below, the desert silent in every direction. Ancient and total." },
      { name: "Tacos at 3am", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The best tacos in Mexico City are served late from carts. Al pastor shaved from a vertical spit, pineapple on top, cilantro and onion, a slice of lime. Three tacos, forty pesos total. The man in the suit next to me was also eating them standing up. The great equaliser." },
      { name: "Frida Kahlo Museum", image: "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600", description: "La Casa Azul, the Blue House, where Frida was born, lived, and died. Her paintbrushes are still in jars. Her Tehuana dresses are in the wardrobe. Her presence is so strong in every room that the absence of her feels temporary." },
      { name: "Xochimilco on Sunday", image: "https://images.pexels.com/photos/3290078/pexels-photo-3290078.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The floating gardens of Xochimilco are ancient Aztec chinampas. On Sundays they fill with families on flower-painted boats while mariachi bands float past. Bring beer. Accept the serenade. This is joy, organised." },
      { name: "Palacio de Bellas Artes", image: "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The marble Art Nouveau and Art Deco palace contains murals by Rivera, Orozco, and Siqueiros. Each artist argued with the building's scale and won. To stand inside it is to understand that Mexico City takes its culture with the seriousness of a nation that invented several." },
    ],
  },
  {
    name: "Cape Town",
    text: "Mountain, ocean, vineyard, and township. Cape Town compresses more drama into one city than most countries manage across their entire territory. Table Mountain is just the beginning.",
    image: "https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Table Mountain at Sunrise", image: "https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Hike up Platteklip Gorge before dawn and arrive on the summit as the sun rises over the mountains. The Cape Peninsula stretches south below. Both oceans are visible on a clear day. This is one of the great views on earth." },
      { name: "Boulders Beach Penguins", image: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=600", description: "African penguins nest between the boulders and lumber down to the water in complete indifference to the tourists watching them. They have been here since 1982. The tourists are newer. The penguins have the confidence of a species that knows this." },
      { name: "Bo-Kaap at Golden Hour", image: "https://images.pexels.com/photos/3280130/pexels-photo-3280130.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Cape Malay quarter is painted in cobalt, lime, coral, and yellow. The streets slope steeply up Signal Hill. The call to prayer echoes through the painted terraces. The most photographed neighbourhood in South Africa, and it deserves every photograph." },
      { name: "Stellenbosch Winelands", image: "https://images.pexels.com/photos/2691996/pexels-photo-2691996.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Forty-five minutes from Cape Town, the valley fills with Cape Dutch estate houses and endless vines. The producers here are world class and the prices are not London prices. We drove from estate to estate and had to take a taxi home. Entirely worth it." },
      { name: "Chapman's Peak Drive", image: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The cliff road carved into the face of a mountain above the Atlantic Ocean. Each bend reveals a different angle on the same impossible view. Hout Bay below, the open ocean ahead, baboons on the road who do not care about your schedule." },
    ],
  },
  {
    name: "Prague",
    text: "The most beautiful city in Central Europe, somehow spared by World War II. Prague's Gothic towers, Baroque palaces, Art Nouveau cafes, and medieval astronomical clock occupy a city small enough to walk across.",
    image: "https://images.pexels.com/photos/2346216/pexels-photo-2346216.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Charles Bridge at 5am", image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Thirty saints line the bridge at 5am alongside one or two photographers and the swans on the Vltava below. Morning mist hangs in the river valley. By 9am the bridge is a moving crowd. Set an alarm." },
      { name: "Old Town Square Clock", image: "https://images.pexels.com/photos/2346216/pexels-photo-2346216.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Astronomical Clock chimes at the top of each hour and the apostles parade. Everyone photographs the clock instead of the apostles. The clock has been doing this every hour since 1410. The tourists are a newer addition." },
      { name: "Pilsner in a Cellar", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Unfiltered tank Pilsner Urquell in a Gothic cellar beneath Mala Strana. The beer is fresh from the tank, pale and slightly hazy, with a head that holds its shape. This is what beer tastes like when a country makes it their national art form." },
      { name: "Vysehrad Cemetery", image: "https://images.pexels.com/photos/1693095/pexels-photo-1693095.jpeg?auto=compress&cs=tinysrgb&w=600", description: "On the hill above the river, the national cemetery contains Dvorak, Smetana, Mucha, and Capek. Art Nouveau iron gates, overgrown paths, a silence that feels earned. These are the people who made Czech culture what it is." },
      { name: "Kafka's Prague", image: "https://images.pexels.com/photos/2346216/pexels-photo-2346216.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Franz Kafka was born, lived, and worked in Prague and barely left. Walk from his birthplace near the Old Town Square to the Kafka Museum on the Mala Strana side. The city he wrote about is still here, still labyrinthine, still faintly threatening. The bureaucracy has improved slightly." },
    ],
  },
  {
    name: "Buenos Aires",
    text: "Where European architecture meets Latin passion. Argentina's capital moves to the rhythm of tango, asado smoke, and political argument. The most European city in South America and entirely unlike any European city.",
    image: "https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Tango in San Telmo", image: "https://images.pexels.com/photos/3792581/pexels-photo-3792581.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Find a milonga, a tango salon, where portenos actually dance. Arrive at midnight. Watch for an hour before attempting anything. The language between the bodies is specific and precise. The music is sadness turned athletic." },
      { name: "Parrilla Lunch on Sunday", image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Sunday lunch at a parrilla is a three-hour commitment. Chorizo, morcilla, costillas, each cut arriving with the slow authority of a procession. A Malbec that costs twelve pesos. A table full of argument and affection." },
      { name: "Recoleta Cemetery", image: "https://images.pexels.com/photos/1693095/pexels-photo-1693095.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The most expensive address in Argentina is occupied entirely by the dead. Marble mausoleums the size of small houses and Eva Peron's tomb, still receiving flowers. Wander with no agenda and you will spend two hours reading the architecture of grief and ambition." },
      { name: "La Boca on a Sunday", image: "https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The brightly painted corrugated iron houses of El Caminito, tango dancers performing in the street, a grillmaster outside every restaurant. La Boca on Sunday is pure Buenos Aires theatre. None of it is subtle. All of it is alive." },
      { name: "MALBA Museum", image: "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Museum of Latin American Art has Frida Kahlo, Torres Garcia, Lam, and Siqueiros all in one building. The permanent collection alone justifies a visit. The cafe on the ground floor has a cortado that is unreasonably good." },
    ],
  },
  {
    name: "Marrakech",
    text: "The Red City of Morocco, a medieval medina of souks, riads, and snake charmers around Jemaa el-Fna square, where storytellers and acrobats have performed the same act for a thousand years.",
    image: "https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Jemaa el-Fna at Dusk", image: "https://images.pexels.com/photos/4388164/pexels-photo-4388164.jpeg?auto=compress&cs=tinysrgb&w=600", description: "As the sun sets, food stalls assemble from nowhere, smoke rises from fifty grills at once, storytellers gather crowds. The noise is total. Snake charmers, henna artists, acrobats. Jemaa el-Fna at dusk has been the world's greatest square for a thousand years." },
      { name: "The Souks", image: "https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Fourteen thousand shops in a labyrinth of alleys. Each trade has its own quarter: spices, leather, textiles, silver, ceramics. The tanneries are three floors of colour and smell, where leather has been treated in the same stone vats since the 11th century." },
      { name: "Mint Tea and Silence", image: "https://images.pexels.com/photos/3434523/pexels-photo-3434523.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Every negotiation begins with mint tea. The tea is poured from high above the glass and is extremely sweet. Accepting it means twenty minutes of conversation before anything is bought or sold. The most civilised commercial practice I have encountered." },
      { name: "Saadian Tombs", image: "https://images.pexels.com/photos/2225439/pexels-photo-2225439.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Sealed in 1603 and not rediscovered until 1917. The tombs are tiled in zellij and carved cedar, with a silence and quality of light designed for contemplation. A small door in the Kasbah leads to a world hidden for three hundred years." },
      { name: "Riad Breakfast", image: "https://images.pexels.com/photos/2935232/pexels-photo-2935232.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Breakfast in a riad courtyard: msemen flatbread, argan oil honey, fresh orange juice from the souk, mint tea, and the sound of the city outside the walls. The riad is an inward-facing architecture, built around silence and water. Moroccan wisdom that every city should steal." },
    ],
  },
  {
    name: "Vienna",
    text: "Mozart, Freud, Klimt, Schubert. Vienna has produced more civilisation per square kilometre than almost anywhere. It also has the best coffee houses and the most formal waiters in the world.",
    image: "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Kunsthistorisches Museum", image: "https://images.pexels.com/photos/2068380/pexels-photo-2068380.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The staircase alone is worth the entry. Marble, gilded, the ceiling painted with mythology. Vermeer, Velazquez, Titian, Raphael, all here, without the queues of Paris or London. The Habsburgs had acquisitive taste and excellent cataloguers." },
      { name: "Cafe Central", image: "https://images.pexels.com/photos/2892618/pexels-photo-2892618.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Freud thought here. Trotsky played chess here. The arched ceilings are thirty feet high, the newspapers are on wooden sticks, and the waiter brings your Melange with a glass of water and a small expression of reproach if you do not order cake." },
      { name: "State Opera Standing Room", image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Queue eighty minutes before curtain for standing tickets. For the price of a coffee you stand with perfect acoustics and watch a world-class orchestra perform Wagner. The standing-room regulars bring silk scarves to reserve their spot. The most civilised queue in Europe." },
      { name: "Naschmarkt", image: "https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Vienna's main open-air market stretches for over a kilometre. Turkish, Syrian, Italian, Austrian, every stall a different country. Saturday mornings bring the flea market at one end. A Viennese institution since the 16th century, still entirely necessary." },
      { name: "Schonbrunn at Christmas", image: "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Christmas market in front of the Baroque palace is the one all other Christmas markets are trying to be. Gluhwein, roasted chestnuts, handmade ornaments, and the yellow facade lit behind it all. The Habsburgs are gone but their stage set remains and it is magnificent." },
    ],
  },
  {
    name: "Singapore",
    text: "The most efficiently organised city on earth and one of the most interesting. Singapore's hawker centres, Marina Bay skyline, colonial heritage, and four cultures living genuinely alongside each other reward careful attention.",
    image: "https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Hawker Centre Breakfast", image: "https://images.pexels.com/photos/2232979/pexels-photo-2232979.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Kaya toast, soft-boiled eggs with soy sauce and white pepper, kopi-O. Seven dollars total. A hawker centre full of people from four countries eating the same breakfast. The Singapore food identity is a miracle of synthesis." },
      { name: "Gardens by the Bay at Night", image: "https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Supertrees light up at 8pm in a sound and light show that turns the garden into something between a forest and a motherboard. It is completely artificial and completely spectacular. Singapore does not apologise for building things that did not exist before." },
      { name: "Little India on Deepavali", image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Serangoon Road lit from end to end, temples open and fragrant with jasmine, families in silk saris moving between stalls. Deepavali in Little India is evidence that Singapore's multiculturalism is not a policy document. It is a lived fact." },
      { name: "Hawker Chan Michelin Stall", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The world's cheapest Michelin-starred meal, soya sauce chicken rice, two dollars. The queue moves methodically. The chicken is glossy and perfectly seasoned. The rice is cooked in chicken stock. This is what happens when a city takes street food as seriously as any restaurant." },
      { name: "Marina Bay Sands Rooftop", image: "https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The infinity pool on the 57th floor of the boat-shaped tower looks north across the entire island. At dusk the financial district towers light up one by one. The pool is guests only. The observation deck is for everyone. Both views are the same city, seen from two different relationships to money." },
    ],
  },
  {
    name: "Cairo",
    text: "The mother of all cities. Cairo is ancient beyond comprehension, the pyramids were already old when Rome was founded, and thoroughly, chaotically, magnificently alive today.",
    image: "https://images.pexels.com/photos/3689855/pexels-photo-3689855.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Giza at Sunrise", image: "https://images.pexels.com/photos/3689855/pexels-photo-3689855.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Great Pyramid is 4,500 years old, 138 metres tall, and made of 2.3 million stones. These facts do not prepare you for how it feels to stand at the base and look up. Something in the human nervous system registers age at a level below words. You will be quiet." },
      { name: "Khan el-Khalili at Night", image: "https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The medieval bazaar near al-Azhar fills with incense smoke, the clatter of copper workers, and tea houses where shisha smoke drifts in slow clouds. It has been a market since 1382. The scale of time in Cairo turns everything elsewhere into recently established businesses." },
      { name: "Egyptian Museum", image: "https://images.pexels.com/photos/2695232/pexels-photo-2695232.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The largest collection of Egyptian antiquities on earth. Objects appear around corners unexpectedly. The gold death mask of Tutankhamun is in room 3. It was made for a boy who died at 19. It is the most beautiful object I have ever seen." },
      { name: "Nile Felucca at Sunset", image: "https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The felucca is a traditional Nile sailboat. Hire one for an hour at sunset when the minarets catch the last light and the river traffic slows. The boatman does not speak much. The river does not need commentary. The Nile is older than the city on its banks." },
      { name: "Coptic Cairo", image: "https://images.pexels.com/photos/1549326/pexels-photo-1549326.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Hanging Church, the Ben Ezra Synagogue, and a warren of narrow streets where Coptic Christianity has continued uninterrupted since the first century. In Old Cairo, the Abrahamic religions exist within a few hundred metres of each other, as they have for two thousand years." },
    ],
  },
  {
    name: "Lisbon",
    text: "The city of fado, azulejo tiles, and trams that climb impossible hills. Lisbon is small enough to walk across in a day and deep enough to take a month. Also the sunniest capital in Europe.",
    image: "https://images.pexels.com/photos/1534560/pexels-photo-1534560.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Alfama at Sunrise", image: "https://images.pexels.com/photos/1534560/pexels-photo-1534560.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Lisbon's oldest district tumbles down from the castle in white walls, azulejo facades, and cats sleeping on windowsills. At sunrise there is nobody but the cats and a bakery opening. The miradouros look out over the Tagus in a light that is specifically Lisbon's." },
      { name: "Fado in a Tasca", image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Fado demands you stop eating and listen. The Portuguese word is saudade, a longing for something you may never have had. In a small Alfama tasca, a woman sang with her eyes closed. The room was completely still. When she finished, nobody moved for a moment." },
      { name: "Pasteis de Belem", image: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=600", description: "The original pastel de nata, made since 1837. Warm, dusted with cinnamon, the custard still trembling inside a shattering pastry shell. The recipe is a secret. The queue is a given. It takes twelve minutes. They are worth forty." },
      { name: "Tram 28", image: "https://images.pexels.com/photos/2871358/pexels-photo-2871358.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The vintage yellow tram creaks through Alfama and Graca, too narrow for the streets it serves, negotiating corners with a confidence that seems structurally improbable. Pickpockets work tram 28. So do people who have lived here their whole lives and still find it the most convenient way across the hill." },
      { name: "Belem Tower at Dusk", image: "https://images.pexels.com/photos/1534560/pexels-photo-1534560.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Manueline tower on the Tagus was built in 1516 to guard the port from which Vasco da Gama sailed to India and changed the world. At dusk, with the river gold behind it and the Discoveries Monument nearby, you feel the weight of what was risked and what was found." },
    ],
  },
  {
    name: "Bangkok",
    text: "Chaotic, gorgeous, bewildering, and completely alive. Bangkok moves at a frequency entirely its own, golden temples beside rooftop bars, tuk-tuks beside Ferraris, street food beside Michelin stars.",
    image: "https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Wat Pho Before the Heat", image: "https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Reclining Buddha is 46 metres long and covered in gold leaf. His feet are inlaid with mother-of-pearl. In the early morning, monks chant in the surrounding cloister. The sound moves through the golden corridors and settles in the courtyard like incense smoke." },
      { name: "Chatuchak Weekend Market", image: "https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Eight thousand stalls. Ceramics, vintage clothes, orchids, antiques, street food, and handwoven textiles. The largest weekend market on earth. It requires a system. We had no system. We found things anyway." },
      { name: "Floating Market at Dawn", image: "https://images.pexels.com/photos/2187609/pexels-photo-2187609.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The canal fills with wooden boats loaded with papaya, mango, and morning glory. Longtail boats scream past. Someone sells noodle soup from a boat. This exists. It has existed for centuries. The Instagram photos do not prepare you for the noise and smell, which are the whole point." },
      { name: "Rooftop Bar Above Silom", image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Bangkok from above at night is a grid of lights stretching to every horizon. A glass of Singha, the warm night air, the constant hum of ten million people moving below. The temples' spires catch floodlights in gold. Two cities in one view." },
      { name: "Street Food on Yaowarat", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Chinatown at night. Roasted duck, char siu pork, oyster omelette, bird's nest soup, and mango sticky rice from a cart. The street is so full at 9pm that movement becomes negotiation. The vendors work with the speed of people who have been doing this since before you were born." },
    ],
  },
  {
    name: "Tehran",
    text: "Iran's vast, surprising capital where ancient history meets modernity and where the famous hospitality of Persian culture meets the complexity of a country the world misunderstands.",
    image: "https://images.pexels.com/photos/3799176/pexels-photo-3799176.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Golestan Palace", image: "https://images.pexels.com/photos/3799176/pexels-photo-3799176.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Qajar royal complex in the heart of Tehran. Mirrored halls, mosaic tile facades, throne rooms filled with European art collected by shahs who travelled and bought indiscriminately. The Mirror Hall, where a thousand mirrors fragment the light, is one of the most beautiful rooms in Asia." },
      { name: "Grand Bazaar of Tehran", image: "https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Ten kilometres of covered passages, the largest covered bazaar in the world. The spice section is a wall of colour. The carpet section is a silence where merchants pour tea and unfold kilometres of knot. Time moves differently in here." },
      { name: "Darband in the Mountains", image: "https://images.pexels.com/photos/8177153/pexels-photo-8177153.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Alborz Mountains rise directly from Tehran's northern suburbs. The Darband trail passes tea houses clinging to the cliff face where men play backgammon and drink doogh. The city below recedes. The mountains are always there, even when Tehran forgets them." },
      { name: "Persian Breakfast", image: "https://images.pexels.com/photos/3434523/pexels-photo-3434523.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Noon-paneer-gerdoo: bread, white cheese, walnuts, honey, fresh herbs, clotted cream, and black tea in a glass. Iranian breakfast is eaten slowly and with conversation. Every guest is treated as though they have honoured the house by arriving. There is no English word for ta arof." },
      { name: "Niavaran Palace Complex", image: "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The last Shah's private residence in the foothills of the Alborz. The rooms are frozen in 1979, the year the family fled. A Picasso on the wall next to Persian miniatures. A helicopter on the lawn. Modernism and dynasty in one arrested moment." },
    ],
  },
  {
    name: "Rio de Janeiro",
    text: "The Marvellous City, sugar loaf mountains, Carnival, samba, caipirinha, and beaches where Cariocas play footvolley in the shadow of Christ the Redeemer in that extraordinary light.",
    image: "https://images.pexels.com/photos/1655895/pexels-photo-1655895.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Christ the Redeemer at Dawn", image: "https://images.pexels.com/photos/1655895/pexels-photo-1655895.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Take the cog train up Corcovado in the dark and arrive at the summit as the sun rises behind the Atlantic. The city appears below in mist and light. Christ's arms extend over all of it. It is, unavoidably, moving." },
      { name: "Ipanema at Sunset", image: "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=600", description: "At Arpoador, the whole city gathers on Friday evenings to applaud the sunset. Literally, the crowd applauds. The Cariocas clap and cheer as though it has done something personally for them. It has. It always has." },
      { name: "Lapa on Saturday Night", image: "https://images.pexels.com/photos/3792581/pexels-photo-3792581.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The colonial arches of Lapa are the setting for the largest free outdoor party in Rio every Saturday. Samba schools practice in the streets, ten thousand people dance on the pavement. This is the city's most democratic institution. Nobody is turned away." },
      { name: "Sugarloaf by Cable Car", image: "https://images.pexels.com/photos/1655895/pexels-photo-1655895.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Two cable cars to the summit of Sugarloaf Mountain. From the top, Guanabara Bay spreads below like a map, the city's mountains and beaches arranged by a designer of frankly excessive ambition. Come at dusk. Stay for the lights." },
      { name: "Santa Teresa Neighbourhood", image: "https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The hilltop neighbourhood reached by the last tram in Rio. Artists, colonial mansions in various states of restoration, a bar with a view over the entire city, and the Escadaria Selaron, the world's most decorated staircase, tiled by a Chilean artist who spent twenty years on it." },
    ],
  },
  {
    name: "Seoul",
    text: "South Korea's capital moves faster than almost any city on earth. K-pop, skincare, fried chicken, ancient palaces, and a tech industry that makes Silicon Valley feel relaxed.",
    image: "https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Gyeongbokgung Palace", image: "https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The main Joseon dynasty palace opens each morning to guardsmen in full ceremonial dress. Rent a hanbok and entry is free. Five thousand people a day look magnificent on the palace steps." },
      { name: "Gwangjang Market", image: "https://images.pexels.com/photos/2232979/pexels-photo-2232979.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The oldest covered market in Korea and the best place to eat. Bindaetteok, mung bean pancakes, fried on an iron griddle. The ladies who make these have been at the same spot for thirty years. They know exactly what they are doing." },
      { name: "Bukchon Hanok Village", image: "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Six hundred traditional hanok houses on a hillside between two palaces. The curved tile roofs are unchanged from the Joseon period. In the early morning, before the walking tour groups arrive, you can hear the neighbourhood waking up. A different Seoul." },
      { name: "Hongdae on a Friday Night", image: "https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The university district where Seoul's youth culture lives. Buskers on every corner performing at a level that would fill venues in other cities. A convenience store where everyone stands outside with beer. Hongdae at midnight is Seoul at its most itself." },
      { name: "DMZ Day Trip", image: "https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg?auto=compress&cs=tinysrgb&w=600", description: "An hour north by bus, the most militarised border on earth. The Joint Security Area where the two Koreas face each other across a concrete line. A North Korean soldier photographing us from ten metres away. The weight of the twentieth century pressing down on a very small patch of ground." },
    ],
  },
  {
    name: "Edinburgh",
    text: "Scotland's compact, dramatic capital. A medieval Old Town, a Georgian New Town, a castle on a volcanic crag, and a literary culture so dense it seeps from the pub walls.",
    image: "https://images.pexels.com/photos/3573383/pexels-photo-3573383.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Arthur's Seat at Dawn", image: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=600", description: "An extinct volcano in the middle of the city. The forty-minute climb arrives at a summit 250 metres above the Firth of Forth, with the castle below and the Highlands beyond on a clear day. Start before sunrise. Edinburgh at dawn from above is one of the great urban views." },
      { name: "The Royal Mile at Fringe", image: "https://images.pexels.com/photos/3573383/pexels-photo-3573383.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Fringe transforms Edinburgh into the world's largest arts festival. Every doorway has a flyer, every pavement a performance. Comedians, theatre, circus, orchestras in churches. For three weeks the city contains more art per square metre than anywhere else." },
      { name: "Scotch Whisky Experience", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Single malt whisky is a geography lesson. The Islay malts taste of the sea. The Speyside malts taste of honey and apple. A master blender can tell you where rain fell by what is in the glass. One of the most civilised forms of paying attention." },
      { name: "Greyfriars Kirkyard", image: "https://images.pexels.com/photos/1693095/pexels-photo-1693095.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The 17th-century cemetery at the heart of the Old Town. The real Harry Potter inspiration, the grave of Greyfriars Bobby, and the Covenanters' Prison where 1,200 were held through a Scottish winter. History in Edinburgh is never entirely past." },
      { name: "Scottish National Gallery", image: "https://images.pexels.com/photos/2068380/pexels-photo-2068380.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Free, as all national galleries in Scotland are. The collection runs from Renaissance masters to Scottish colourists. Raeburn's portrait of The Skating Minister is here, catching an 18th-century clergyman doing exactly what ministers should not. The building is Neoclassical and the coffee is very good." },
    ],
  },
  {
    name: "Athens",
    text: "The cradle of Western civilisation, still operating in the same location. Athens has the Acropolis, the finest feta, and an ouzo culture that rewards patience.",
    image: "https://images.pexels.com/photos/3598289/pexels-photo-3598289.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Acropolis at Sunrise", image: "https://images.pexels.com/photos/3598289/pexels-photo-3598289.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Parthenon was built in 447 BC from 22,000 tonnes of marble. At sunrise, before the queues form, it rises above the city in the clear Attic light and it is incomprehensible that humans built this with their hands." },
      { name: "Monastiraki Flea Market", image: "https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Sunday morning in Monastiraki. Roman columns integrated into shop walls, Byzantine churches next to vinyl record stalls, a man selling Byzantine coins of uncertain provenance. Athens integrates its history by simply continuing to live on top of it." },
      { name: "Taverna in Plaka", image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Octopus drying on a washing line, a cat watching from a step, a waiter who brings things you did not order because he thought you should try them. Greek philoxenia, love of strangers, predates the tourism industry by about 2,500 years." },
      { name: "Ouzo at Sunset in Psiri", image: "https://images.pexels.com/photos/2346216/pexels-photo-2346216.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Ouzo served cold with water that turns it cloudy, accompanied by small plates of olives, octopus, and cheese. In Psiri at sunset, we sat for three hours and watched the sky turn the Acropolis orange. Correct." },
      { name: "Cape Sounion Day Trip", image: "https://images.pexels.com/photos/3598289/pexels-photo-3598289.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Seventy kilometres south by bus, the Temple of Poseidon on a cliff above the Aegean. Lord Byron carved his name in the marble in 1810. The temple has been here since 444 BC watching ships sail to and from Athens. The sea below it is exactly the colour you imagine when someone says Aegean blue." },
    ],
  },
  {
    name: "Copenhagen",
    text: "The happiest city in the world, if the surveys are believed. Walking around Copenhagen, you believe them. Bicycles, New Nordic cuisine, harbour swimming, and design that makes everything beautiful.",
    image: "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "New Nordic Cuisine", image: "https://images.pexels.com/photos/2232979/pexels-photo-2232979.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The New Nordic movement, foraging, fermentation, hyper-local menus, transformed Copenhagen's entire food scene. The restaurants that followed the revolution cook with the same ambition at a fraction of the original price. The revolution succeeded." },
      { name: "Cycling to Louisiana", image: "https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Forty-five minutes north by bicycle, Louisiana Museum of Modern Art sits on a cliff above the Oresund Strait. Giacometti, Calder, Warhol. The architecture integrates so completely with the sea and trees that the art and the view compete equally." },
      { name: "Tivoli Gardens", image: "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The oldest amusement park still operating in the world, opened 1843. Walt Disney visited and took notes. At night, 100,000 lights outline the rides and trees. The roller coaster is wooden and old and still terrifying. The peacocks wander freely." },
      { name: "Swimming in the Harbour", image: "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Copenhagen cleaned its harbour so thoroughly that you can swim in the city centre. Islands Brygge harbour bath has five pools and a diving tower. On a summer evening, half the city is in the water. This is what happens when a city decides its infrastructure should serve joy." },
      { name: "Nyhavn on a Summer Evening", image: "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The 17th-century canal with its colourful townhouses, wooden schooners, and outdoor restaurants. Hans Christian Andersen lived at number 67. At 7pm in June, every table is taken and the light is still full and nobody wants to go home. This is summer at its most Danish, which is to say most civilised." },
    ],
  },
  {
    name: "Hanoi",
    text: "Vietnam's ancient capital. French colonial architecture over Vietnamese street life, pho before dawn, the Old Quarter, and a lake where a giant turtle once surfaced and changed history.",
    image: "https://images.pexels.com/photos/4090971/pexels-photo-4090971.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Pho at 6am", image: "https://images.pexels.com/photos/2232979/pexels-photo-2232979.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The best pho is eaten on a plastic stool three inches from the pavement, before the city fully wakes. A bowl of beef broth that has been cooking since 3am, with rice noodles, rare beef, and a plate of herbs, lime, and chilli. This is what Hanoi tastes like at its most essential." },
      { name: "The Old Quarter", image: "https://images.pexels.com/photos/4090971/pexels-photo-4090971.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Thirty-six streets, each traditionally devoted to a single trade: silk, paper, tin, bamboo, herbal medicine. Walking in the evening, motorbikes threading between pedestrians, noodle steam rising. Hanoi moving at full speed in a very small space." },
      { name: "Hoan Kiem Lake at Dawn", image: "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=600", description: "At 5am the lake is ringed by elderly Vietnamese doing tai chi, aerobics, and badminton. They have been doing this together for years. The Turtle Tower island sits in the middle. Hanoi believes in the legend. So did I, briefly, in that light." },
      { name: "Train Street", image: "https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=600", description: "A residential alley where a train passes twice a day with thirty centimetres clearance on each side. The residents pull their chairs in. The tourists step back. The train passes with extraordinary noise and closeness. Everyone breathes out." },
      { name: "Halong Bay by Junk", image: "https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Three hours east by road, then onto a wooden junk sailing between three thousand limestone karsts rising from the Gulf of Tonkin. At night the other junks disappear and you are anchored in absolute silence surrounded by vertical rock and still water. The stars are the most numerous you have ever seen." },
    ],
  },
  {
    name: "Reykjavik",
    text: "The world's northernmost capital. 130,000 people who punch far above their cultural weight with Viking history, Northern Lights, geothermal pools, and a music scene their size does not explain.",
    image: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Northern Lights Over Hallgrimskirkja", image: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The church looks like a rocket designed by a Viking. At 2am in December, the aurora appears over its tower, green curtains shifting through the black sky. No photograph fully captures what happens to your body when you see them for the first time." },
      { name: "The Blue Lagoon", image: "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Geothermal seawater at 38 degrees, surrounded by black lava fields, steam rising into the Arctic air. It is entirely tourist infrastructure built on a genuinely extraordinary natural phenomenon. You emerge feeling like you have been professionally restored." },
      { name: "Golden Circle in Winter", image: "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Geysir erupts every ten minutes. Gullfoss waterfall drops into a canyon in two stages. Thingvellir is where two tectonic plates pull apart and you can stand in the rift. In winter, all of this happens in conditions that remind you how provisional comfort is." },
      { name: "Midnight Sun Walk", image: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=600", description: "In June the sun does not set. At 11pm it is still full daylight, the harbour golden, the streets full of people who have not processed that it is nearly midnight. Your sense of time completely breaks down. This is the correct response." },
      { name: "Whale Watching from Reykjavik", image: "https://images.pexels.com/photos/3573383/pexels-photo-3573383.jpeg?auto=compress&cs=tinysrgb&w=600", description: "A two-hour boat trip from the old harbour in summer. Humpbacks breach alongside the boat with a casual enormity that is impossible to process. Puffins raft on the surface, indifferent to the whales and to us. The mountains behind the city are still snow-capped in June. Iceland is consistently more than you expected." },
    ],
  },
  {
    name: "San Francisco",
    text: "The city built on a fault line and a gold rush, still golden, still shaking. The Golden Gate, the fog, Victorian houses, the burritos, and the Pacific all coexist in 49 square miles of remarkable tension.",
    image: "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Golden Gate at Fog Time", image: "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The fog rolls in through the Gate from the Pacific most summer afternoons, a slow white river between orange towers. From the Marin headlands, you watch it pour through like a tide. The bridge disappears and reappears. One of the most theatrical natural events on a daily schedule." },
      { name: "Mission District Murals", image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Mission has more murals per block than any neighbourhood in America. Chicano art, political protest, portraits of the displaced. A neighbourhood that fights gentrification by covering everything in colour." },
      { name: "Dolores Park on Sunday", image: "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Burritos from Mission taquerias, canned wine, the city skyline above the palm trees, fog advancing from the west. Dolores Park on Sunday is San Francisco at its most San Franciscan. Diverse, beautiful, slightly precarious, and very much alive." },
      { name: "Alcatraz by Night Ferry", image: "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The night tour approaches the island by water, the prison lit against the dark bay, the city skyline glowing behind. Rangers who feel no obligation to sugarcoat anything tell the stories of escapes, hunger strikes, and the eleven years the island was occupied by Native Americans." },
      { name: "Muir Woods at Opening", image: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Coast redwoods 1,200 years old in a canyon across the Golden Gate. The tallest trees are 80 metres high. The canopy filters the morning light into something cathedral. The silence is complete. These trees were old when the Normans invaded England. Walking among them adjusts your sense of scale permanently." },
    ],
  },
  {
    name: "Bali",
    text: "The island of a thousand temples, rice terraces, surf breaks, and ceremonies. Bali's Hindu culture has maintained its identity amid mass tourism with a resilience that is itself worth studying.",
    image: "https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Tegalalang Rice Terraces", image: "https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The subak system, Bali's ancient water temple cooperative, has kept these terraces productive for a thousand years. In the morning light, the steps of paddies descend into the valley in shades of green that have no name in English." },
      { name: "Ceremony in Ubud", image: "https://images.pexels.com/photos/4388164/pexels-photo-4388164.jpeg?auto=compress&cs=tinysrgb&w=600", description: "In Bali, ceremonies happen constantly. On a morning walk we stopped as a procession of women in white carried offerings to a temple. The gamelan music came first, then the colour, then the incense. The divine and the daily are not separate here." },
      { name: "Surfing at Uluwatu", image: "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=600", description: "A left-hand break below a cliff-edge temple, considered one of the ten best waves in the world. From the clifftop warung, you watch surfers ride it while monkeys steal your snacks. The temple has been there longer than surfing." },
      { name: "Cooking Class in Ubud", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "A Balinese cooking class starts at the market, learning to identify galangal, kaffir lime leaf, and shrimp paste by smell. Then four hours making babi guling spice paste from scratch. Eating what you cooked in the garden at noon. The bumbu is the most complex flavour I know." },
      { name: "Tanah Lot at Sunset", image: "https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The sea temple on a rock stack, accessible only at low tide, silhouetted against the Indian Ocean sunset. Thousands come every evening and it is still extraordinary. The sea crashes around the base, the sky turns red, and the temple becomes a two-dimensional thing against the colour. No photograph does it justice." },
    ],
  },
  {
    name: "New Orleans",
    text: "The most unique city in America. French and Spanish colonial history layered with African and Caribbean culture, producing jazz, Mardi Gras, beignets, and a relationship with celebration unlike anything north of it.",
    image: "https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Frenchmen Street on a Tuesday", image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Not the tourist jazz of Bourbon Street. Frenchmen Street is where New Orleans actually plays. On any weeknight, three or four bars have live bands. The music spills onto the street, people dance between the bars. It feels like a city reminding itself why it exists." },
      { name: "Cafe Du Monde Before Sunrise", image: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=600", description: "Beignets and cafe au lait at 5am while the French Quarter sleeps. The beignets arrive buried under powdered sugar. The chicory coffee is black and strong. Cafe Du Monde has been open 24 hours every day since 1862, closed only by Hurricane Katrina." },
      { name: "Second Line Parade", image: "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The brass band leads and the neighbourhood follows, dancing with umbrellas and handkerchiefs. Second line parades happen most Sundays in neighbourhoods tourists never reach. To join one uninvited is, in fact, invited. The whole point is that everyone comes." },
      { name: "Commander's Palace Brunch", image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Saturday jazz brunch in a Victorian turquoise mansion. 25-cent martinis, turtle soup, bread pudding souffle. The ceremony of the service is its own argument for remaining at the table for three hours. Worth every minute." },
      { name: "Garden District Walking Tour", image: "https://images.pexels.com/photos/3573383/pexels-photo-3573383.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Antebellum mansions behind wrought iron fences under oak trees that have been growing since before the Civil War. The wealth that built these houses came from sugar and from slavery. Walking here without knowing that is impossible. Walking here knowing it is heavy and necessary." },
    ],
  },
  {
    name: "Porto",
    text: "Portugal's second city, stacked on granite hills above the Douro River. Azulejo-tiled churches, port wine caves, fado drifting from windows, and the golden light of the Atlantic coast.",
    image: "https://images.pexels.com/photos/2845013/pexels-photo-2845013.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Sao Bento Station", image: "https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The entrance hall is tiled with 20,000 azulejo panels depicting scenes from Portuguese history. This is the most beautiful train station in the world and it is also a functioning train station. People check departure boards in front of panels that tell the story of their country." },
      { name: "Port Wine Tasting in Gaia", image: "https://images.pexels.com/photos/2691996/pexels-photo-2691996.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The wine caves of Vila Nova de Gaia have been maturing port since the 17th century. A twenty-year tawny in a dark cellar. Wine that has been waiting since before your parents were born for you to open it." },
      { name: "Ribeira at Night", image: "https://images.pexels.com/photos/2845013/pexels-photo-2845013.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The waterfront neighbourhood at night. Fishing boats moored on the Douro, restaurant lights reflected in the water, the Luis I bridge lit against the dark. Porto at night is less grand than Lisbon and more honest. It is a working city that happens to be beautiful." },
      { name: "Livraria Lello Bookshop", image: "https://images.pexels.com/photos/2929168/pexels-photo-2929168.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The most beautiful bookshop in the world. Gothic-Art Nouveau interior, a sweeping divided staircase, stained glass ceiling. J.K. Rowling taught English in Porto and is said to have been inspired here. Buy a book. Read it on the Ribeira." },
      { name: "Francesinha at Midnight", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Porto sandwich: layers of meat, covered in melted cheese, submerged in a spiced beer and tomato sauce, with a fried egg on top. It is excessive, specific, and entirely Porto. The locals eat it after midnight. There is no correct time to stop eating a Francesinha." },
    ],
  },
  {
    name: "Medellín",
    text: "Colombia's city of eternal spring transformed itself from the world's most dangerous to one of Latin America's most innovative, and now teaches urban planning to the world.",
    image: "https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "The Metro Cable", image: "https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The gondola lifts you from the metro into the comunas, hillside neighbourhoods that were once no-go zones. Today they have outdoor escalators, libraries, and parks. Medellin is the experiment that proved urban transformation is possible." },
      { name: "Botero Plaza", image: "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Fernando Botero donated twenty-three monumental bronze sculptures to his hometown. Enormous, deliberately volumetric figures installed in a public square where children climb them and vendors sell fruit around them. Art at the scale of a city, for a city." },
      { name: "Guatape Day Trip", image: "https://images.pexels.com/photos/2474689/pexels-photo-2474689.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Ninety minutes from Medellin, a town where every building has its lower walls covered in painted bas-relief tiles. Then El Penon, a 200-metre granite monolith from a reservoir. 740 steps. The lake islands from the summit are extraordinary." },
      { name: "Nightlife in El Poblado", image: "https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Parque Lleras at 11pm. Every terrace bar full, salsa and champeta competing from different directions. Medellin's nightlife has the energy of a city that decided collectively to enjoy what it built. There is something specifically joyful about a place that knows what it was and knows what it became." },
      { name: "Flower Festival Parade", image: "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Every August, the Silleteros carry elaborate floral arrangements strapped to their backs through the streets. Arrangements that weigh up to 100 kilos, depicting landscapes, cityscapes, and Colombian history in flower. This has been happening since 1957. The flowers are grown in the mountains above the city." },
    ],
  },
  {
    name: "Mumbai",
    text: "The city of maximum India. More ambition, more film, more money, more colour, more noise, and more humanity per square metre than almost anywhere on earth.",
    image: "https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Marine Drive at Sunrise", image: "https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Queen's Necklace is being walked by insomniacs, early yoga practitioners, and people who simply could not bear their apartments any longer. The Arabian Sea is silver. The city behind has seventeen million inhabitants and for twenty minutes it is nearly quiet." },
      { name: "Vada Pav at CST Station", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Mumbai burger. Spiced potato fritter in a bread roll with green chutney. Eaten at a cart outside Chhatrapati Shivaji Terminus, surrounded by millions of commuters, pigeons, and taxis. This is the defining street food of India's most cinematic city." },
      { name: "Elephanta Caves by Ferry", image: "https://images.pexels.com/photos/2684384/pexels-photo-2684384.jpeg?auto=compress&cs=tinysrgb&w=600", description: "An hour by ferry from the Gateway of India, a volcanic island with Hindu cave temples from the 5th century. The rock-cut Trimurti, the three-headed form of Shiva, is six metres tall and one of the great works of Indian sculpture. The ferry journey through the harbour is also magnificent." },
      { name: "Bollywood at Film City", image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Bollywood produces more films than Hollywood. Film City in Goregaon is where most of them are made. On a studio tour you walk through sets that are simultaneously Mughal palaces, Swiss villages, and 1970s Bombay. The scale of the industry's appetite for fantasy is one of the great human spectacles." },
      { name: "Dharavi Walking Tour", image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600", description: "One of Asia's largest informal settlements generates 600 million dollars a year in small manufacturing. Leather, pottery, recycling, embroidery. To walk through it with a guide is to discover a city within a city with its own schools, temples, economy, and community architecture. The narrative of failure misses the narrative of ingenuity." },
    ],
  },
  {
    name: "Tbilisi",
    text: "Georgia's ancient, crumbling, beautiful, utterly unique capital. Where sulphur baths, Orthodox churches, Persian ruins, Soviet architecture, and the most interesting wine tradition in the world coexist on the banks of the Mtkvari.",
    image: "https://images.pexels.com/photos/3889856/pexels-photo-3889856.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "The Old Town Sulphur Baths", image: "https://images.pexels.com/photos/3889856/pexels-photo-3889856.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The sulphur springs that give the city its name feed a network of domed bathhouses in Abanotubani. The private rooms have marble slabs, and for fifteen dollars someone will scrub you with a kese mitt until you wonder how you have lived without this. The water smells of sulphur. Stay anyway." },
      { name: "Narikala Fortress at Dusk", image: "https://images.pexels.com/photos/2346216/pexels-photo-2346216.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The 4th-century fortress overlooks the city from the cliff. At dusk, the view takes in the Metekhi Church, the Mtkvari River, the Soviet-era entertainment hall shaped like a flying saucer, and a Ferris wheel still operating above the botanic garden. Tbilisi contains centuries without irony." },
      { name: "Wine in a Qvevri", image: "https://images.pexels.com/photos/2691996/pexels-photo-2691996.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Georgian wine is the oldest in the world, eight thousand years old, and made in clay amphorae buried in the earth. The amber wines, fermented on the skins, are unlike anything from France or Italy. Dense, complex, tannic, and specific to this soil and these grape varieties." },
      { name: "Khinkali for Breakfast", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Georgian dumpling, pleated dough around spiced meat and broth, eaten by hand by biting through the top and drinking the soup before eating the rest. The knot is left on the plate as a count of how many you have eaten. We each ate eight. The correct amount is as many as you can manage." },
      { name: "Mtatsminda Park at Night", image: "https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The funicular climbs the mountain behind the old city to a Soviet-era amusement park with the best view of Tbilisi. At night the city spreads below in a bowl of light, the fortress lit on one side and the new glass bridge glowing on the other. Soviet kitsch and genuine magnificence in one place." },
    ],
  },
  {
    name: "Dubrovnik",
    text: "The pearl of the Adriatic, a medieval walled city on a limestone cliff above a sea so blue it seems deliberate. Game of Thrones filmed here for good reason. The real city is better than the show.",
    image: "https://images.pexels.com/photos/2346216/pexels-photo-2346216.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Walking the Walls Before 8am", image: "https://images.pexels.com/photos/2346216/pexels-photo-2346216.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The two-kilometre circuit of the medieval walls takes ninety minutes. Do it at opening time, before the cruise ships arrive, when the Adriatic is still flat and the terracotta roofscape is empty of crowds. The walls were built in the 13th century and never successfully breached." },
      { name: "Swimming at Buza", image: "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=600", description: "A hole in the city wall, a ladder down a cliff, and you are in the Adriatic. Buza bar clings to the rocks outside the walls and serves cold beer to people in swimwear watching the ferries head toward the islands. This is not a beach. It is something better." },
      { name: "Old Town at Dusk", image: "https://images.pexels.com/photos/3015484/pexels-photo-3015484.jpeg?auto=compress&cs=tinysrgb&w=600", description: "After the day visitors return to their ships, Dubrovnik Old Town empties and becomes the city it is when nobody is performing it. Restaurant tables appear on the Stradun, the marble street polished white by centuries of feet. The sea glows through every gap between buildings." },
      { name: "Lokrum Island", image: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Ten minutes by ferry. Peacocks wander between a Benedictine monastery, botanical gardens, and a saltwater lake connected to the sea where you can swim with the fish that come in with the tide. The island has been inhabited since the 11th century." },
      { name: "Sunset from Mount Srd", image: "https://images.pexels.com/photos/2346216/pexels-photo-2346216.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The cable car rises above the walled city in two minutes. From the top, the entire coast opens up, the islands of the Elafiti archipelago floating in the Adriatic, the old city below like a model of itself. At sunset the walls turn gold and the sea turns copper and nothing needs to be said." },
    ],
  },
  {
    name: "Bruges",
    text: "The best-preserved medieval city in Europe, a canal city of Gothic guildhouses, Flemish Primitive paintings, chocolate shops, and Belgian beer that is taken as seriously as wine anywhere in France.",
    image: "https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Canals Before the Day Trippers", image: "https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg?auto=compress&cs=tinysrgb&w=600", description: "At 7am, Bruges is a 15th-century city in full. The reflections of step-gabled merchant houses in the canal, a cygnet following a swan, a baker opening shutters. By 10am the day-trip coaches from Brussels have arrived. Before 8am it is the city it used to be." },
      { name: "Groeningemuseum", image: "https://images.pexels.com/photos/2068380/pexels-photo-2068380.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Van Eyck, Memling, van der Weyden, the Flemish Primitive masters in the city where they worked. Jan van Eyck is buried in Bruges. His painting technique created a depth of colour that nobody equalled for a century. Everything else from this period is here." },
      { name: "Belgian Beer at De Garre", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Hidden down an alley, De Garre serves its own triple at 11.5% in a glass shaped specifically for it, with a froth that takes three minutes to settle. The beer list is long and serious. The bar has three tables downstairs. They will not rush you. Do not rush yourself." },
      { name: "Belfry Climb", image: "https://images.pexels.com/photos/3573383/pexels-photo-3573383.jpeg?auto=compress&cs=tinysrgb&w=600", description: "366 steps to the top of the Belfry, where 47 bells in a carillon have been rung since 1280. The bell-ringer plays concerts with his hands and feet simultaneously. The view from the top is all of Bruges laid flat, every rooftile visible." },
      { name: "Chocolate Workshop", image: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=600", description: "Bruges has more chocolate shops per square metre than any city in the world. The Belgian chocolate tradition is specific: couverture chocolate with a minimum cocoa butter content, hand-made pralines, no industrial shortcuts. A workshop teaches you why the difference matters. You will eat the evidence." },
    ],
  },
  {
    name: "Chiang Mai",
    text: "Northern Thailand's cultural capital. Cooler than Bangkok, slower, and full of temples, night markets, cooking schools, elephant sanctuaries, and mountain trails into the jungle.",
    image: "https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg?auto=compress&cs=tinysrgb&w=600",
    storys: [
      { name: "Doi Suthep at Dawn", image: "https://images.pexels.com/photos/2187609/pexels-photo-2187609.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Monks carry offerings up the 309 steps to the golden chedi at the summit as the dawn light catches the Lanna-style parasols. The mountain temple looks out over the valley and the city below. A white elephant chose this site in the 14th century. His judgment was excellent." },
      { name: "Sunday Night Market", image: "https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The Walking Street on Wualai Road every Sunday. Silver jewellery, hand-painted umbrellas, hill tribe textiles, street food, and a saxophone player covering Careless Whisper near the city gate. Chiang Mai's craft tradition is serious and the market is where it shows itself best." },
      { name: "Cooking Class", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "A Thai cooking class in Chiang Mai starts at the farm market, selecting galangal, kaffir lime, lemongrass, and bird's eye chilli. Then five dishes: khao soi, green curry, pad see ew, spring rolls, mango sticky rice. Eating everything you cooked in the garden is the most satisfying possible way to spend a morning." },
      { name: "Elephants at a Sanctuary", image: "https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=600", description: "An ethical sanctuary where elephants rescued from logging and entertainment industries live in forest. Mud baths in the morning. You help bathe them in the river. A female pushes her head against your side to say hello. There is no way to prepare for how large and gentle these animals are." },
      { name: "Doi Inthanon at Sunset", image: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=600", description: "The highest peak in Thailand, two hours south of Chiang Mai. The summit is often in cloud. When the cloud clears at sunset, the mountains of Burma are visible to the west. The royal chedis on the slopes are surrounded by gardens of flowers that have no business growing this far south. Horticulture as determination." },
    ],
  },
];

const seedDatabase = async () => {
  const connStr = process.env.DB_CONNECTION_STRING || "mongodb://localhost:27017/citytour";
  console.log("\n🔌 Connecting to: " + connStr + "\n");

  try {
    await connectToDb();
    console.log("✅ Database connected\n");

    await Cat.deleteMany({});
    await User.deleteMany({});
    console.log("🗑️  Cleared existing data");

    const hashedPassword = await bcrypt.hash("Admin1234!", 10);
    const admin = await User.create({
      userName: "admin",
      email:    "admin@citytour.com",
      password: hashedPassword,
      role:     "admin",
    });
    console.log("👤 Admin user created");
    console.log("   Email:    admin@citytour.com");
    console.log("   Password: Admin1234!\n");

    const citiesWithOwner = CITIES.map(city => ({
      ...city,
      createdBy: admin._id,
      storys: city.storys.map(story => ({
        ...story,
        createdBy: admin._id,
        comments:  [],
        likes:     [],
      })),
    }));

    await Cat.insertMany(citiesWithOwner);

    const totalStories = CITIES.reduce((sum, c) => sum + c.storys.length, 0);

    console.log("🏙️  Inserted " + CITIES.length + " cities");
    console.log("📖 Inserted " + totalStories + " stories");
    console.log("\n✅ Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  Login: admin@citytour.com / Admin1234!");
    console.log("  Run:   npm run dev");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  } catch (err) {
    console.error("\n❌ Seeding failed: " + err.message);
    if (err.message.includes("ECONNREFUSED") || err.name === "MongoNetworkError") {
      console.error("   👉 MongoDB is not running.");
      console.error("   Mac:     brew services start mongodb-community");
      console.error("   Windows: net start MongoDB");
      console.error("   Linux:   sudo systemctl start mongod\n");
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDatabase();
