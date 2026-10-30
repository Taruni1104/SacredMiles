#!/usr/bin/env node
/**
 * scripts/write-content.js
 * Writes researched story content for all 35 destinations.
 * Run: node scripts/write-content.js
 * Only overwrites files where contentVersion in this script > file version.
 */

const fs = require('fs');
const path = require('path');
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'destinations');

const DESTINATIONS = [
  {
    id: 'sarnath',
    name: 'Sarnath',
    alternativeNames: ['Isipatana', 'Mrigadava', 'Deer Park'],
    category: 'sightseeing',
    city: 'Sarnath',
    state: 'Uttar Pradesh',
    coordinates: { lat: 25.3762, lng: 83.0227 },
    overview: 'Sarnath, located 10 km north of Varanasi, is where Gautama Buddha delivered his first sermon (Dhammacakkappavattana Sutta) after attaining enlightenment at Bodh Gaya. It is one of the four most sacred sites in Buddhism and draws pilgrims and visitors from across the world.',
    historicalBackground: { text: 'Sarnath has been a place of Buddhist activity since at least the 3rd century BCE, when Emperor Ashoka erected a major pillar with a lion capital here — the Ashoka Pillar whose capital became India\'s national emblem. The site was a thriving centre of Buddhist learning and art through the Gupta period (4th–6th century CE). Arab traveller Al-Biruni and Chinese pilgrims Fa Hien (405 CE) and Xuanzang (7th century CE) both recorded large monasteries and the Dhamekh Stupa standing here. The site was largely abandoned after Muslim invasions in the 12th century and was excavated by the Archaeological Survey of India in the 19th–20th centuries.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    religiousSignificance: { text: 'In Buddhist tradition, Sarnath is the site of the "First Turning of the Wheel of Dharma." After attaining enlightenment at Bodh Gaya, the Buddha walked to Sarnath and delivered his first discourse to five ascetic companions, setting in motion the Buddhist path. The site is therefore regarded as the birthplace of the Sangha (monastic community) and foundational to the Three Jewels of Buddhism: the Buddha, the Dharma, and the Sangha. Pilgrims of all Buddhist traditions — Theravada, Mahayana, and Vajrayana — consider Sarnath a primary destination.', classification: 'religious-tradition', sourceIds: ['source-0'], completeness: 'partial' },
    legendsAndTraditions: { text: 'The name "Mrigadava" (Deer Park) derives from the tradition that the Buddha chose this forested deer park for his teaching. According to Jataka tales, the Bodhisattva in a previous life was the king of a herd of deer who offered himself to save the doe that the king wished to kill. Moved, the king granted the Deer Park to the deer forever.', classification: 'legend', sourceIds: ['source-0'], completeness: 'partial' },
    architecture: { text: 'The dominant structure at Sarnath is the Dhamekh Stupa, a massive cylindrical stone tower approximately 43.6 metres high dating to around 500 CE with geometric and floral patterns of Gupta-era stonework. The Dharmarajika Stupa (now largely ruined) and the Ashoka Pillar base (the lion capital is displayed in the Sarnath Museum) are key monuments. The Mulagandhakuti Vihara, a modern temple built in 1931, houses original frescoes painted by Japanese artist Kosetsu Nosu depicting the life of the Buddha.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    ritualsAndFestivals: { text: 'Buddha Purnima (Vesak), celebrated on the full moon of the Vaisakha month, is the most significant festival at Sarnath. Processions, prayers, and chanting are held by Buddhist monks and lay communities. Dhammacakka Day (marking the first sermon) is also observed. Monks from monasteries of multiple nationalities perform puja and meditation at the Dhamekh Stupa complex.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    thingsToExplore: [
      { name: 'Dhamekh Stupa', description: 'The 5th-century CE cylindrical stupa marking the exact spot of the Buddha\'s first sermon.', type: 'landmark' },
      { name: 'Sarnath Archaeological Museum', description: 'Houses the famous Ashoka Lion Capital (India\'s national emblem), the Wheel of Dharma, and Gupta-era sculptures.', type: 'experience' },
      { name: 'Mulagandhakuti Vihara', description: 'A 1931 Sri Lankan-style temple with beautiful frescoes by Japanese artist Kosetsu Nosu.', type: 'landmark' },
      { name: 'Chaukhandi Stupa', description: 'A 4th–5th century CE stupa marking the spot where Buddha met his first five disciples.', type: 'landmark' }
    ],
    visitorInformation: {
      entryFee: { amount: null, currency: 'INR', notes: 'ASI charges a nominal entry fee for the main archaeological park. The museum has a separate entry. Verify current rates at the site.', sourceId: 'source-0', verificationStatus: 'unverified' },
      openingHours: { summary: 'The ASI archaeological park and museum are open daily except Fridays. Typical hours are sunrise to sunset for the park and 10 AM–5 PM for the museum. Verify current timings directly.', sourceId: 'source-0', verificationStatus: 'unverified' },
      dressCode: 'Respectful attire. Remove footwear at temple entrances.',
      photographyPolicy: 'Photography permitted in the park. Photography may be restricted inside the museum — confirm at entry.',
      accessibilityNotes: 'The main stupa complex is on level ground and largely accessible. The museum has steps at entry.',
      bestArrivalTime: 'Morning for fewer crowds. Budget 2–3 hours for the full site.'
    },
    bestTimeToVisit: 'October to March. Buddha Purnima (April/May) for the festival.',
    howToReach: {
      nearestAirport: { name: 'Lal Bahadur Shastri International Airport, Varanasi', distanceKm: 24 },
      nearestRailway: { name: 'Varanasi Junction (BSB)', distanceKm: 13 },
      roadAccess: 'Regular auto-rickshaws, taxis, and city buses connect Varanasi city to Sarnath (approx. 30 minutes).',
      localTransport: 'Auto-rickshaws and cycle-rickshaws available from Sarnath intersection.'
    },
    nearbyPlaces: [{ id: 'kashi', name: 'Kashi Vishwanath (Varanasi)', distanceKm: 10, notes: 'The two sites are commonly visited together.' }],
    sources: [{ id: 'source-0', title: 'Archaeological Survey of India — Sarnath Circle', publisher: 'Archaeological Survey of India', url: 'https://asisarnathcircle.in/', sourceType: 'heritage-authority', accessedDate: '2026-10-30', supportsFields: ['overview', 'historicalBackground', 'architecture'], verificationStatus: 'unverified' }]
  },
  {
    id: 'mathura',
    name: 'Krishna Janmabhoomi (Mathura)',
    alternativeNames: ['Madhurapuri', 'Brajbhoomi'],
    category: 'temple',
    city: 'Mathura',
    state: 'Uttar Pradesh',
    coordinates: { lat: 27.4924, lng: 77.6737 },
    overview: 'Mathura is the birthplace of Lord Krishna, the eighth avatar of Vishnu and one of the most beloved deities in Hinduism. The Krishna Janmabhoomi temple complex marks the site traditionally identified as the prison cell where Krishna was born to Devaki and Vasudeva. Mathura is one of the seven sacred cities (Sapta Puri) of Hinduism.',
    historicalBackground: { text: 'Mathura is one of the oldest continuously inhabited cities in India. It served as the capital of the Surasena kingdom during the time of the Mahabharata and later became a flourishing centre under the Kushana dynasty (1st–3rd century CE), which produced distinctive Mathura-school Buddhist and Hindu sculptures. The Mughal period saw several reconstructions; the current Krishna Janmabhoomi complex was built in 1965 adjacent to the older Keshavdeva temple site.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    religiousSignificance: { text: 'For Vaishnavas, Mathura is part of the Braj region considered the most sacred ground on earth — the land where Krishna spent his childhood and youth. The city is one of the Sapta Puri (seven cities granting liberation). The birth of Krishna in a prison cell despite the tyranny of King Kamsa is celebrated as the triumph of dharma over adharma. Mathura and the surrounding Braj area with its 84 kos parikrama are central to the devotional traditions of Vaishnavism, particularly the Pushti Marg and ISKCON traditions.', classification: 'religious-tradition', sourceIds: ['source-0'], completeness: 'partial' },
    legendsAndTraditions: { text: 'Krishna was born at midnight in a prison cell to the captive Devaki and Vasudeva while the tyrant King Kamsa awaited to kill the child. Immediately after birth, Vasudeva carried the infant across the flooded Yamuna to safety in Gokul. The Yamuna parted to make way, and the serpent Adishesha spread his hoods to shelter the child from rain. This miraculous birth and escape is re-enacted every year during Janmashtami celebrations across India.', classification: 'legend', sourceIds: ['source-0'], completeness: 'partial' },
    architecture: { text: 'The Krishna Janmabhoomi complex includes the Keshavdeva temple and the Garbhagriha (birthplace chamber) — a small, ornate room with a stone slab marking the traditional birth spot. Adjacent to the complex stands the Shahi Eidgah mosque. The current main temple was constructed in 1965. The older Keshavdeva temple built by Bir Singh Deo in 1618 was demolished in 1669; only the Potara Kund tank nearby survives from that period.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    ritualsAndFestivals: { text: 'Janmashtami, celebrating the birth of Krishna at midnight, is the most important festival. Mathura celebrates it with unmatched fervour — temples are elaborately decorated, devotional songs fill the streets, and midnight aartis draw thousands. Holi in Braj (Mathura, Vrindavan, and Barsana) is internationally known for its energetic, colourful celebrations lasting over a week. The Yamuna Chhath and various Krishna-related observances are held throughout the year.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    thingsToExplore: [
      { name: 'Vishram Ghat', description: 'The most sacred ghat on the Yamuna in Mathura, where Krishna is said to have rested after slaying Kamsa. Evening aarti is beautiful.', type: 'ritual' },
      { name: 'Dwarkadhish Temple, Mathura', description: 'A major 1814-built temple near Vishram Ghat dedicated to Krishna as Dwarkadhish, known for its vivid artwork.', type: 'landmark' },
      { name: 'Vrindavan', description: 'The town 15 km away where Krishna spent his youth — home to Banke Bihari Temple, ISKCON, Prem Mandir, and many historic temples.', type: 'experience' },
      { name: 'Govardhan Hill', description: 'Sacred hill 22 km from Mathura that Krishna lifted to shelter villagers from Indra\'s wrath, according to tradition.', type: 'experience' }
    ],
    visitorInformation: {
      entryFee: { amount: 0, currency: 'INR', notes: 'Entry to the main Janmabhoomi complex is free. Security checks are thorough — visitors must leave bags and electronics outside.', sourceId: null, verificationStatus: 'unverified' },
      openingHours: { summary: 'Open daily, early morning to evening with a midday closure. Specific timings vary by season; confirm at the site.', sourceId: null, verificationStatus: 'unverified' },
      dressCode: 'Traditional attire. Cameras, mobile phones, and bags are typically not allowed inside.',
      photographyPolicy: 'Photography is generally not permitted inside the sanctum complex. Follow instructions at the entry gate.',
      accessibilityNotes: 'The complex has level pathways. Assistance for elderly and differently-abled pilgrims should be confirmed at the entrance.',
      bestArrivalTime: 'Early morning or late afternoon. Avoid midday heat in summer.'
    },
    bestTimeToVisit: 'October to March. Janmashtami (July/August) and Holi (March) for festivals.',
    howToReach: {
      nearestAirport: { name: 'Agra Civil Airport', distanceKm: 60 },
      nearestRailway: { name: 'Mathura Junction (MTJ)', distanceKm: 2 },
      roadAccess: 'Mathura is on NH 19 (Delhi–Kolkata). Approximately 145 km from Delhi and 55 km from Agra. Regular buses and taxis operate.',
      localTransport: 'Auto-rickshaws and e-rickshaws are the main modes. Cycle-rickshaws are available for the ghat area.'
    },
    nearbyPlaces: [{ id: 'ayodhya', name: 'Ram Janmabhoomi (Ayodhya)', distanceKm: 450, notes: 'Both are among the seven sacred cities.' }],
    sources: [{ id: 'source-0', title: 'District Mathura — Government of Uttar Pradesh', publisher: 'Government of Uttar Pradesh', url: 'https://mathura.nic.in/', sourceType: 'government-tourism', accessedDate: '2026-10-30', supportsFields: ['overview', 'historicalBackground'], verificationStatus: 'partially_verified' }]
  },
  {
    id: 'haridwar',
    name: 'Har Ki Pauri (Haridwar)',
    alternativeNames: ['Gangadwar', 'Mayapuri', 'Kapilasthana'],
    category: 'temple',
    city: 'Haridwar',
    state: 'Uttarakhand',
    coordinates: { lat: 29.9457, lng: 78.1642 },
    overview: 'Haridwar is the gateway to the Char Dham pilgrimage in the Himalayas and one of the seven sacred cities of Hinduism. Har Ki Pauri (Steps of Hari/Vishnu) is the most sacred ghat on the Ganges at Haridwar, where the river leaves the mountains and enters the plains. The Ganga Aarti held here every evening is one of the most profoundly moving rituals in India.',
    historicalBackground: { text: 'Haridwar is among the oldest cities in India, with references in the Mahabharata (as Gangadwar) and in the accounts of the Puranas. The city has been visited by sages, saints, and pilgrims for millennia. Har Ki Pauri was established in its current form by King Vikramaditya (1st century BCE, by tradition) in memory of his brother Bhartihari. The ghat contains the Brahma Kund, a small pool where according to tradition the nectar (amrit) fell during the churning of the cosmic ocean — making it the site for the Kumbh Mela held every twelve years.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    religiousSignificance: { text: 'Haridwar is where the Ganges descends from the Himalayas to the plains and is therefore considered one of the most auspicious points for ritual bathing. A bath at Har Ki Pauri is believed to wash away sins and break the cycle of rebirth. The city is also a crossing point for pilgrims proceeding to the Char Dham (Kedarnath, Badrinath, Gangotri, Yamunotri). The Kumbh Mela here — held every twelve years and the Ardh Kumbh every six years — is the largest human gathering on Earth.', classification: 'religious-tradition', sourceIds: ['source-0'], completeness: 'partial' },
    legendsAndTraditions: { text: 'According to the Puranic legend of the Samudra Manthan (churning of the ocean), drops of amrit (immortality nectar) fell at four locations — Haridwar, Prayagraj, Ujjain, and Nashik — which are now the four Kumbh Mela sites. At Har Ki Pauri, a footprint imprinted in a stone wall is venerated as the footprint of Vishnu. The name Har Ki Pauri itself means "Footstep of God."', classification: 'legend', sourceIds: ['source-0'], completeness: 'partial' },
    architecture: { text: 'Har Ki Pauri is a broad, multi-level stone ghat descending to the fast-flowing Ganges, flanked by small shrines and temples. The Upper and Lower ghats are separated by a clock tower. Chains are fixed in the river to help pilgrims hold on during the strong current. The ghat is lined with hundreds of small oil lamps placed in leaf boats during aarti. The surrounding area includes Mansa Devi Temple (accessible by cable car) and numerous ashrams and dharamshalas.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    ritualsAndFestivals: { text: 'The Ganga Aarti at Har Ki Pauri is performed every evening at sunset and is the highlight of a visit to Haridwar. Priests simultaneously swing large tiered brass lamps over the flowing river as hundreds of diyas float downstream. Kumbh Mela (every twelve years) and Ardh Kumbh (every six years) are the most significant gatherings. Kanwar Yatra — when devotees walk hundreds of kilometres to carry Ganges water back to their home temples — passes through Haridwar every July–August.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    thingsToExplore: [
      { name: 'Ganga Aarti at Har Ki Pauri', description: 'The nightly fire ritual on the Ganges — arrive at least 45 minutes early to find a good viewing spot.', type: 'ritual' },
      { name: 'Mansa Devi Temple', description: 'Hilltop temple reached by cable car overlooking Haridwar; dedicated to Goddess Mansa Devi who fulfils wishes.', type: 'landmark' },
      { name: 'Chandi Devi Temple', description: 'Another hilltop temple reached by cable car on the opposite side; can be combined with Mansa Devi in one trip.', type: 'landmark' },
      { name: 'Rishikesh (upstream)', description: 'The yoga capital of the world, 25 km upstream, is commonly combined with Haridwar in a single trip.', type: 'experience' }
    ],
    visitorInformation: {
      entryFee: { amount: 0, currency: 'INR', notes: 'Free access to the ghats. Cable car to Mansa Devi and Chandi Devi has a fee.', sourceId: null, verificationStatus: 'unverified' },
      openingHours: { summary: 'The ghat is accessible 24 hours. Ganga Aarti timing varies with season (typically sunset). Confirm at the ghat.', sourceId: null, verificationStatus: 'unverified' },
      dressCode: 'Respectful clothing. Non-Hindus are generally welcome at the ghats.',
      photographyPolicy: 'Photography at the ghat is generally permitted. During aarti, be respectful of the ritual space.',
      accessibilityNotes: 'Stone steps throughout. The ghat is not fully wheelchair accessible.',
      bestArrivalTime: 'Early morning (4–6 AM) for a ritual bath in a relatively peaceful setting. Evening for aarti.'
    },
    bestTimeToVisit: 'October to April. Kumbh/Ardh Kumbh when scheduled. Avoid July–August Kanwar season for a peaceful visit.',
    howToReach: {
      nearestAirport: { name: 'Jolly Grant Airport, Dehradun', distanceKm: 38 },
      nearestRailway: { name: 'Haridwar Junction (HW)', distanceKm: 2 },
      roadAccess: 'Haridwar is 214 km from Delhi on NH 334. Frequent buses from Delhi, Dehradun, and Rishikesh.',
      localTransport: 'Auto-rickshaws and e-rickshaws. The main ghat is a short walk from the bus and railway stations.'
    },
    nearbyPlaces: [{ id: 'rishikesh', name: 'Rishikesh', distanceKm: 25, notes: 'Easily combined in one trip.' }, { id: 'kedarnath', name: 'Kedarnath', distanceKm: 230, notes: 'Starting point for Char Dham yatra.' }],
    sources: [{ id: 'source-0', title: 'District Haridwar — Government of Uttarakhand', publisher: 'Government of Uttarakhand', url: 'https://haridwar.nic.in/', sourceType: 'government-tourism', accessedDate: '2026-10-30', supportsFields: ['overview', 'historicalBackground', 'visitorInformation'], verificationStatus: 'partially_verified' }]
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    alternativeNames: ['Hrishikesh', 'Tapovan', 'Yoga Capital of the World'],
    category: 'sightseeing',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    coordinates: { lat: 30.0869, lng: 78.2676 },
    overview: 'Rishikesh is a pilgrimage town and spiritual centre where the Ganges descends from the Himalayas to the foothills. Known as the Yoga Capital of the World, it is home to hundreds of ashrams, yoga centres, and temples, and serves as the gateway to the Char Dham yatra in the Garhwal Himalayas. The Beatles famously visited Maharishi Mahesh Yogi\'s ashram here in 1968, giving Rishikesh global recognition.',
    historicalBackground: { text: 'Rishikesh has been a forest retreat for sages and ascetics since ancient times, mentioned in the Skanda Purana and other texts. The name derives from "Hrishikesha," one of the names of Vishnu. The major ashrams that define modern Rishikesh — including Sivananda Ashram and Maharishi Mahesh Yogi\'s ashram (Chaurasi Kutia) — were established in the 20th century. After The Beatles\' visit in 1968, Rishikesh became internationally associated with yoga, meditation, and alternative spirituality.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    religiousSignificance: { text: 'For Hindus, Rishikesh is sacred as a site where the Ganges leaves the mountains — bathing here is considered very auspicious. Lakshmanjhula and Ramjhula areas are associated with Lakshmana (Rama\'s brother), who is said to have crossed the Ganges here on a jute rope. The town is considered Devbhoomi — the Land of the Gods — and a natural gateway to the highest Himalayan shrines.', classification: 'religious-tradition', sourceIds: ['source-0'], completeness: 'partial' },
    legendsAndTraditions: { text: 'According to local tradition, Lakshmana performed penance at the spot where Lakshmanjhula bridge now stands. Lord Rama crossed the Ganges here at Ramjhula. The area around Swargashram is said to have been an abode of rishis (sages) who meditated here for thousands of years, and the entire forest was considered a sacred sanctuary where no living being was harmed.', classification: 'legend', sourceIds: ['source-0'], completeness: 'partial' },
    architecture: { text: 'The two iconic suspension bridges — Lakshmanjhula (1929, rebuilt) and Ramjhula — are pedestrian walkways across the fast-flowing Ganges lined with temples and ashrams. Trayambakeshwar Temple rises thirteen storeys high on the banks. The Parmarth Niketan Ashram on the banks of the Ganga is one of the largest in Rishikesh, hosting the famous Ganga Aarti. The abandoned Beatles Ashram (Chaurasi Kutia) is now an open heritage area with striking murals.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    ritualsAndFestivals: { text: 'The Ganga Aarti at Parmarth Niketan and Triveni Ghat at sunset is a daily ceremony similar to Haridwar\'s, with floating diyas on the river. The International Yoga Festival held every March draws yoga practitioners from around the world. The annual Kanwar Mela and various ashram-hosted spiritual retreats attract practitioners throughout the year.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    thingsToExplore: [
      { name: 'Lakshmanjhula Suspension Bridge', description: 'The iconic 450-foot pedestrian bridge across the Ganges with temples and ashrams on both banks.', type: 'landmark' },
      { name: 'Ganga Aarti at Triveni Ghat', description: 'Evening fire ritual on the Ganges banks — one of the more intimate alternatives to Haridwar\'s larger ceremony.', type: 'ritual' },
      { name: 'Beatles Ashram (Chaurasi Kutia)', description: 'Maharishi Mahesh Yogi\'s abandoned ashram visited by The Beatles in 1968, now a heritage site with vibrant street art.', type: 'experience' },
      { name: 'River Rafting on the Ganges', description: 'Class II–IV whitewater rafting stretches between Shivpuri and Rishikesh are popular from September to June.', type: 'experience' }
    ],
    visitorInformation: {
      entryFee: { amount: 0, currency: 'INR', notes: 'Ghat and bridge access is free. Beatles Ashram has a nominal entry fee. Ashrams may request a donation.', sourceId: null, verificationStatus: 'unverified' },
      openingHours: { summary: 'Ghats and bridges are accessible throughout the day. Ashrams have their own schedules.', sourceId: null, verificationStatus: 'unverified' },
      dressCode: 'Conservative dress is appropriate near temples and ashrams. Swimwear is not appropriate on the ghats.',
      photographyPolicy: 'Photography is generally permitted at public sites. Confirm with individual ashrams before photographing inside.',
      accessibilityNotes: 'The Lakshmanjhula bridge has steps. River banks and ghats may be uneven.',
      bestArrivalTime: 'Year-round destination. October–April for pleasant weather and yoga retreats.'
    },
    bestTimeToVisit: 'September to November and February to May. International Yoga Festival in March.',
    howToReach: {
      nearestAirport: { name: 'Jolly Grant Airport, Dehradun', distanceKm: 35 },
      nearestRailway: { name: 'Haridwar Junction (HW)', distanceKm: 25 },
      roadAccess: 'Well connected to Haridwar (25 km), Dehradun (45 km), and Delhi (240 km) by road.',
      localTransport: 'Shared jeeps, autos, and e-rickshaws between Rishikesh and Lakshmanjhula/Ramjhula area.'
    },
    nearbyPlaces: [{ id: 'haridwar', name: 'Har Ki Pauri (Haridwar)', distanceKm: 25, notes: 'Usually combined in one trip.' }, { id: 'kedarnath', name: 'Kedarnath', distanceKm: 210, notes: 'Starting point for Kedarnath trek.' }],
    sources: [{ id: 'source-0', title: 'Uttarakhand Tourism', publisher: 'Government of Uttarakhand', url: 'https://www.uttarakhandtourism.gov.in/destination/rishikesh', sourceType: 'government-tourism', accessedDate: '2026-10-30', supportsFields: ['overview'], verificationStatus: 'unverified' }]
  },
  {
    id: 'kedarnath',
    name: 'Kedarnath',
    alternativeNames: ['Kedareshwar', 'Char Dham', 'Kedara'],
    category: 'temple',
    city: 'Kedarnath',
    state: 'Uttarakhand',
    coordinates: { lat: 30.7352, lng: 79.0669 },
    overview: 'Kedarnath is one of the twelve Jyotirlingas and the most important of the four Char Dham pilgrimage sites in the Garhwal Himalayas. Standing at 3,583 metres above sea level at the head of the Mandakini River and surrounded by snow-covered peaks, the Kedarnath temple is accessible only between May and November, after which heavy snowfall closes it completely.',
    historicalBackground: { text: 'The Kedarnath temple is believed to have been originally built by the Pandavas after the Kurukshetra war, and later revived by Adi Shankaracharya in the 8th century CE. The current stone temple structure is attributed to the medieval period and is built in the Himalayan stone slab style. The temple survived the catastrophic 2013 Uttarakhand floods, though the surrounding infrastructure was devastated. Post-2013 reconstruction work has significantly upgraded the pilgrimage infrastructure.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    religiousSignificance: { text: 'In Hindu tradition, Kedarnath enshrines one of the twelve Jyotirlingas — the self-manifested forms of Lord Shiva believed to radiate divine light. The temple is also part of the Char Dham yatra (with Badrinath, Gangotri, and Yamunotri), completing which is believed to grant moksha. The challenging high-altitude trek is itself considered part of the spiritual merit. The temple is maintained by the Badri-Kedar Temple Committee under the Government of Uttarakhand.', classification: 'religious-tradition', sourceIds: ['source-0'], completeness: 'partial' },
    legendsAndTraditions: { text: 'According to the Mahabharata, after the Kurukshetra war, the Pandavas sought Lord Shiva\'s forgiveness for the killing of their kinsmen. Shiva, wishing to avoid them, transformed into a bull and dived into the earth at Kedarnath. The hump of the bull emerged here; the remaining body parts are believed to manifest at four other Shiva temples (Panch Kedar). Adi Shankaracharya, after reviving the temple in the 8th century, is said to have attained samadhi (liberation) behind the temple — a small shrine marks this spot.', classification: 'legend', sourceIds: ['source-0'], completeness: 'partial' },
    architecture: { text: 'The Kedarnath temple is a compact, robust stone structure built from large grey slabs of stone without mortar, in the Himalayan temple style. The sanctum is small and austere, enshrining the naturally shaped rock linga (the "hump" of the bull form of Shiva). The temple is fronted by a mandapa (hall) that shelters pilgrims during harsh weather. The structure is believed to have withstood centuries of extreme Himalayan conditions and remarkably survived the 2013 floods.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    ritualsAndFestivals: { text: 'The temple opens every year on Akshaya Tritiya (April/May) following an elaborate ritual procession from Ukhimath, where the deity resides during winter. It closes on Diwali (October/November) with equal ceremonial fanfare. Daily rituals include Mahabhishek (early morning), Rudrabhishek, and evening Shayan Aarti. The Kedarnath yatra season (May to November) draws hundreds of thousands of pilgrims annually.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    thingsToExplore: [
      { name: 'Kedarnath Temple Darshan', description: 'The sanctum housing the rock linga of Shiva. Darshan (viewing) is the central act of the pilgrimage.', type: 'ritual' },
      { name: 'Bhairavnath Temple', description: 'Located above the main temple, dedicated to Bhairava — the guardian deity of Kedarnath. Traditionally visited after the main temple.', type: 'landmark' },
      { name: 'Shankaracharya Samadhi', description: 'The memorial shrine behind the temple where Adi Shankaracharya is said to have attained samadhi.', type: 'landmark' },
      { name: 'Vasuki Tal', description: 'A high-altitude glacial lake about 8 km from Kedarnath offering views of the Chaukhamba massif.', type: 'experience' }
    ],
    visitorInformation: {
      entryFee: { amount: 0, currency: 'INR', notes: 'Temple entry is free. Government registration for the Char Dham yatra is mandatory — register at registrationandtouristcare.uk.gov.in before travel.', sourceId: 'source-0', verificationStatus: 'partially_verified' },
      openingHours: { summary: 'Temple is open only from Akshaya Tritiya (April/May) to Diwali (Oct/Nov). Closed during winter. Darshan timing within the season is typically 6 AM to 3 PM and 5 PM to 9 PM — confirm with the temple committee.', sourceId: 'source-0', verificationStatus: 'unverified' },
      dressCode: 'Warm, layered clothing essential. Traditional attire for darshan. Mobile phones may be restricted inside.',
      photographyPolicy: 'Photography inside the sanctum is typically not permitted. Outside photography is generally allowed.',
      accessibilityNotes: 'The 16-km trek from Gaurikund involves significant altitude gain. Pony, palanquin (doli), and helicopter services are available but must be booked in advance through official channels.',
      bestArrivalTime: 'May to June and September to October for the best balance of weather and crowd levels. July–August can be wet and crowded.'
    },
    bestTimeToVisit: 'May–June and September–October. Avoid monsoon season (July–August) when landslides are common.',
    howToReach: {
      nearestAirport: { name: 'Jolly Grant Airport, Dehradun', distanceKm: 239 },
      nearestRailway: { name: 'Haridwar Junction (HW)', distanceKm: 225 },
      roadAccess: 'Drive or take a bus to Gaurikund (the trek base), approx. 225 km from Haridwar via Rishikesh and Rudraprayag.',
      localTransport: '16-km trek from Gaurikund. Ponies and doli (palanquin) available. Helicopter services from Phata, Sersi, and Guptkashi (book officially in advance).'
    },
    nearbyPlaces: [{ id: 'haridwar', name: 'Har Ki Pauri (Haridwar)', distanceKm: 225, notes: 'Main access point from the plains.' }, { id: 'rishikesh', name: 'Rishikesh', distanceKm: 210, notes: 'Another entry point for the yatra.' }],
    sources: [{ id: 'source-0', title: 'Char Dham Registration Portal — Government of Uttarakhand', publisher: 'Government of Uttarakhand', url: 'https://registrationandtouristcare.uk.gov.in/', sourceType: 'government-tourism', accessedDate: '2026-10-30', supportsFields: ['visitorInformation'], verificationStatus: 'partially_verified' }]
  },
  {
    id: 'puri',
    name: 'Jagannath Temple (Puri)',
    alternativeNames: ['Shree Kshetra', 'Jagannath Dham', 'Purusottama Dham'],
    category: 'temple',
    city: 'Puri',
    state: 'Odisha',
    coordinates: { lat: 19.8135, lng: 85.8312 },
    overview: 'The Jagannath Temple at Puri is one of the four sacred Char Dhams of Hinduism and is dedicated to Lord Jagannath — a form of Vishnu or Krishna — along with his siblings Balabhadra and Subhadra. The temple is unique in Indian religion for its tradition of preparing food (mahaprasad) for tens of thousands of pilgrims daily in the world\'s largest kitchen, and for the annual Rath Yatra chariot festival that draws millions.',
    historicalBackground: { text: 'The current Jagannath temple was built in the 12th century CE by King Anantavarman Chodaganga Deva of the Eastern Ganga dynasty. An earlier temple at the site is mentioned in texts from the 6th century CE. The temple complex has been expanded and maintained by successive Odishan dynasties. It stands 65 metres tall and dominates the Puri skyline. The Rath Yatra festival has been continuously celebrated for over 2,000 years, predating the current temple structure.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    religiousSignificance: { text: 'Puri is one of the four Dhams marking the four cardinal directions of India in Hindu pilgrimage geography (Badrinath in the north, Dwarka in the west, Rameswaram in the south, Puri in the east). Lord Jagannath is a uniquely inclusive deity — across his tradition, he is understood as an avatar of Vishnu by Vaishnavas, as Shiva by Shaivas, as the Buddha by some Buddhist traditions, and as a universal deity transcending caste and religious boundaries. Non-Hindus are generally not permitted inside the main temple.', classification: 'religious-tradition', sourceIds: ['source-0'], completeness: 'partial' },
    legendsAndTraditions: { text: 'The origin legend of the Jagannath deity is unique: King Indradyumna of Malwa received a divine command to find the sacred form of Vishnu concealed inside a log of wood (daru brahma) floating in the ocean. A divine craftsman (Vishwakarma or, in some versions, a tribal carpenter) undertook to carve the idol but insisted on working behind closed doors. When the king opened the door before the work was complete, the craftsman vanished, leaving the idols unfinished — without hands and feet. They were consecrated as they were, and this unfinished form remains the sacred standard for all Jagannath idols. Every 12–19 years the wooden idols are replaced in the Nabakalebara ceremony.', classification: 'legend', sourceIds: ['source-0'], completeness: 'partial' },
    architecture: { text: 'The temple is a fine example of Kalinga architecture (the architectural style of ancient Odisha). The main tower (deul) rises 65 metres in the rekha deul style. Four separate shrines stand within the compound: Jagamohana (audience hall), Natamandir (dance hall), and Bhogamandapa (offering hall). The outer compound wall (meghanada pacheri) is 6 metres high and encloses 120 smaller temples. Atop the main tower flies the Nilachakra (blue wheel/chakra) and a flag that, according to tradition, always faces into the wind rather than with it.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    ritualsAndFestivals: { text: 'The Rath Yatra (Chariot Festival), held on the second day of the bright fortnight of Ashadha (June/July), sees three enormous wooden chariots carrying the deities dragged by thousands of devotees through the main street (Bada Danda) to the Gundicha Temple. The festival draws millions and is celebrated worldwide. The Snana Yatra (Bathing Festival) precedes Rath Yatra. Mahaprasad — food cooked in the temple kitchen daily for 100,000 people — is considered highly sacred and non-discriminatory: anyone, regardless of caste or station, may partake.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    thingsToExplore: [
      { name: 'Rath Yatra Procession Route', description: 'The 3-km Grand Road (Bada Danda) between Jagannath Temple and Gundicha Temple along which the chariot procession moves annually.', type: 'ritual' },
      { name: 'Puri Beach', description: 'The wide golden beach facing the Bay of Bengal, 2 km from the temple — one of the most scenic beaches in Odisha.', type: 'experience' },
      { name: 'Konark Sun Temple', description: '35 km from Puri, the 13th-century UNESCO-listed Sun Temple — an essential addition to any Puri visit.', type: 'landmark' },
      { name: 'Raghurajpur Heritage Village', description: 'A craft village 14 km from Puri known for Pattachitra paintings and traditional arts.', type: 'experience' }
    ],
    visitorInformation: {
      entryFee: { amount: 0, currency: 'INR', notes: 'Entry to the temple is free for Hindus. Non-Hindus are not permitted inside the main temple complex. There is a viewing platform (Raghunandan Library rooftop, nearby) where non-Hindus can view the temple from outside.', sourceId: null, verificationStatus: 'unverified' },
      openingHours: { summary: 'The temple is open from early morning to night with breaks. Daily darshan timings vary; confirm with the Shree Jagannath Temple Administration.', sourceId: null, verificationStatus: 'unverified' },
      dressCode: 'Traditional Hindu attire. Men should wear dhoti or pyjama. Women should wear saree or salwar kameez.',
      photographyPolicy: 'Photography inside the temple is not permitted.',
      accessibilityNotes: 'The temple has steps and narrow corridors. Special arrangements for mobility-impaired pilgrims should be confirmed with the temple administration.',
      bestArrivalTime: 'Early morning for darshan before the crowd peaks. Evening for the atmosphere of lamps and chanting.'
    },
    bestTimeToVisit: 'October to February. Rath Yatra (June/July) for the famous festival — book accommodation many months in advance.',
    howToReach: {
      nearestAirport: { name: 'Biju Patnaik International Airport, Bhubaneswar', distanceKm: 60 },
      nearestRailway: { name: 'Puri Railway Station', distanceKm: 2 },
      roadAccess: 'Puri is 60 km from Bhubaneswar on NH 316. Regular buses and taxis.',
      localTransport: 'Auto-rickshaws and taxis available. The temple, beach, and town are within a compact area.'
    },
    nearbyPlaces: [{ id: 'konark', name: 'Sun Temple (Konark)', distanceKm: 35, notes: 'Can be combined as a day trip.' }],
    sources: [{ id: 'source-0', title: 'Shree Jagannath Temple Administration', publisher: 'Shree Jagannath Temple Administration', url: 'https://www.shreejagannath.org/', sourceType: 'official-temple', accessedDate: '2026-10-30', supportsFields: ['overview', 'historicalBackground', 'ritualsAndFestivals'], verificationStatus: 'unverified' }]
  },
  {
    id: 'konark',
    name: 'Sun Temple (Konark)',
    alternativeNames: ['Surya Mandir', 'Black Pagoda', 'Ark Kshetra'],
    category: 'sightseeing',
    city: 'Konark',
    state: 'Odisha',
    coordinates: { lat: 19.8876, lng: 86.0945 },
    overview: 'The Konark Sun Temple, built in the 13th century CE, is a UNESCO World Heritage Site and one of the finest examples of Kalinga-style architecture in India. Conceived as a colossal chariot of the Sun God Surya, with twelve pairs of carved stone wheels and seven stone horses, the temple represents the passage of time through the sun\'s daily journey across the sky.',
    historicalBackground: { text: 'The Sun Temple was built in approximately 1250 CE by King Narasimhadeva I of the Eastern Ganga dynasty. Construction is mentioned in his inscription. European sailors called it the "Black Pagoda" because its dark colour made it a landmark visible from the sea. The main shikhara collapsed sometime before the 19th century (perhaps due to earthquake or structural failure); the massive Jagamohana (porch hall) remains intact and now contains most of the surviving sculptural wealth. The Archaeological Survey of India has carried out extensive preservation work since the 19th century.', classification: 'documented-fact', sourceIds: ['source-0', 'source-1'], completeness: 'partial' },
    religiousSignificance: { text: 'The temple is dedicated to Surya, the Sun God. In Hindu cosmology, Surya is the visible form of the divine, the source of all life and knowledge. The Ark Kshetra (Field of the Sun Chariot) was considered a powerful place for sun worship and healing. The Surya Samhita and Brahma Purana mention sun worship traditions in Odisha. The elaborate sculptural programme — including the famous erotic carvings — is interpreted as representing the full spectrum of human life offered to the divine.', classification: 'religious-tradition', sourceIds: ['source-0'], completeness: 'partial' },
    legendsAndTraditions: { text: 'According to legend, Konark was built by Samba, the son of Krishna, who was cured of leprosy after worshipping Surya for twelve years at this very spot. The most evocative local legend concerns the architect\'s son Dharmapada, who sealed himself inside the sealed sanctum to correctly place the lodestone (magnet) that anchored the structure, sacrificing himself to complete the temple perfectly. These are traditional narratives, not established historical events.', classification: 'legend', sourceIds: ['source-0'], completeness: 'partial' },
    architecture: { text: 'The temple is designed as the chariot of Surya — twelve pairs of elaborately carved stone wheels (each 3 metres in diameter, representing the 12 months and 24 hours) are arranged along the plinth, and seven galloping stone horses draw it eastward into the rising sun. The exterior walls are covered with three horizontal bands of sculpture: the lowest depicting animals, the middle depicting human scenes (including iconic erotic carvings attributed to Tantric iconographic programmes), and the upper depicting divine figures. The chloritic schist stone used in construction acquires a distinctive dark sheen, explaining the "Black Pagoda" name.', classification: 'documented-fact', sourceIds: ['source-0', 'source-1'], completeness: 'partial' },
    ritualsAndFestivals: { text: 'The Konark Dance Festival, held every December against the backdrop of the temple, is a five-day classical dance festival featuring Odissi and other Indian classical forms — one of the most atmospheric cultural events in India. Sun worship on specific solar dates (particularly equinoxes) is traditionally associated with the site. Makar Mela (January) is observed locally.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    thingsToExplore: [
      { name: 'The Chariot Wheels', description: 'The twelve pairs of exquisitely carved stone wheels function as sundials, with the spokes casting shadows to tell time.', type: 'landmark' },
      { name: 'Konark Museum (ASI)', description: 'Displays sculptures and architectural fragments rescued during restoration, including the famous Surya idol.', type: 'experience' },
      { name: 'Chandrabhaga Beach', description: 'A secluded beach 2 km from the temple, one of the cleanest on the Odisha coast.', type: 'experience' },
      { name: 'Konark Dance Festival (December)', description: 'A five-day classical dance festival on the open-air stage with the floodlit temple as backdrop.', type: 'cultural' }
    ],
    visitorInformation: {
      entryFee: { amount: null, currency: 'INR', notes: 'ASI charges a domestic and foreign visitor entry fee. Verify current rates at the site or via the ASI website.', sourceId: 'source-0', verificationStatus: 'unverified' },
      openingHours: { summary: 'Open daily from sunrise to sunset. Closed on national holidays. The light-and-sound show runs in the evening. Verify times with ASI.', sourceId: 'source-0', verificationStatus: 'unverified' },
      dressCode: 'No specific dress code. Comfortable shoes for the sandy paths.',
      photographyPolicy: 'Photography permitted in the exterior complex. Flash photography may be restricted in some areas.',
      accessibilityNotes: 'The main platform has steps. Much of the site is accessible on level ground.',
      bestArrivalTime: 'Early morning for golden light on the stone sculptures. The evening light-and-sound show is highly recommended.'
    },
    bestTimeToVisit: 'October to February. Konark Dance Festival in December.',
    howToReach: {
      nearestAirport: { name: 'Biju Patnaik International Airport, Bhubaneswar', distanceKm: 65 },
      nearestRailway: { name: 'Puri Railway Station', distanceKm: 35 },
      roadAccess: 'Regular bus and taxi service from Puri (35 km) and Bhubaneswar (65 km).',
      localTransport: 'Taxis and auto-rickshaws available in Konark town.'
    },
    nearbyPlaces: [{ id: 'puri', name: 'Jagannath Temple (Puri)', distanceKm: 35, notes: 'Most visitors combine Konark and Puri.' }],
    sources: [
      { id: 'source-0', title: 'UNESCO World Heritage — Konark Sun Temple', publisher: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/list/246/', sourceType: 'heritage-authority', accessedDate: '2026-10-30', supportsFields: ['historicalBackground', 'architecture'], verificationStatus: 'verified' },
      { id: 'source-1', title: 'Ministry of Culture — Konark', publisher: 'Ministry of Culture, Government of India', url: 'https://culture.gov.in/sun-temple-konarak', sourceType: 'government-tourism', accessedDate: '2026-10-30', supportsFields: ['historicalBackground'], verificationStatus: 'partially_verified' }
    ]
  },
  {
    id: 'rameswaram',
    name: 'Ramanathaswamy (Rameswaram)',
    alternativeNames: ['Ramanathapuram', 'Sethu Kshetra', 'Dhanushkodi pilgrimage'],
    category: 'temple',
    city: 'Rameswaram',
    state: 'Tamil Nadu',
    coordinates: { lat: 9.2876, lng: 79.3129 },
    overview: 'Rameswaram is one of the four sacred Char Dhams and home to the Ramanathaswamy Temple — one of the twelve Jyotirlingas — making it doubly significant in Hindu pilgrimage. Located on Pamban Island in the Gulf of Mannar, connected to mainland India by the Pamban Bridge, it is the southernmost major pilgrimage destination and the closest Indian point to Sri Lanka.',
    historicalBackground: { text: 'The Ramanathaswamy Temple\'s origins are attributed to the time of Rama\'s Lanka campaign in the Ramayana. The temple has been expanded over many centuries, with the major corridors and gopurams built during the Nayaka period (16th–17th century CE). The temple is particularly noted for its magnificent outer and inner corridors — the longest temple corridors in India — stretching over 1,200 metres with row upon row of ornately carved pillars.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    religiousSignificance: { text: 'Rameswaram is simultaneously a Char Dham (completing the four sacred directions) and the site of the southernmost Jyotirlinga. It is believed that a pilgrimage to Kashi (Varanasi) is incomplete without subsequently visiting Rameswaram, and vice versa — the two represent the north and south spiritual poles of India. Lord Rama is said to have worshipped Shiva here to atone for the killing of the demon king Ravana (considered a Brahmin). The sacred water from the 22 wells (theerthams) inside the temple complex is used for ritual bathing.', classification: 'religious-tradition', sourceIds: ['source-0'], completeness: 'partial' },
    legendsAndTraditions: { text: 'According to the Ramayana, Lord Rama established and worshipped the Ramanathaswamy Jyotirlinga here before crossing to Sri Lanka to rescue Sita. Hanuman brought a Shivalinga from Kashi at Rama\'s request, but when the auspicious moment arrived before Hanuman returned, Sita made a small linga from sand — this sand linga (Ramalingam) became the presiding deity and is worshipped first before the Kashi linga (Vishwalingam) brought by Hanuman. Adam\'s Bridge (Rama Setu) — the chain of limestone shoals connecting India to Sri Lanka — is traditionally identified as the bridge built by Rama\'s army.', classification: 'legend', sourceIds: ['source-0'], completeness: 'partial' },
    architecture: { text: 'The Ramanathaswamy Temple is remarkable for its corridors. The third corridor is the longest in any Indian temple at approximately 1,220 metres. The corridors are lined with massive, richly carved granite pillars, creating a dramatic visual tunnel effect. The main gopuram (eastern entrance tower) rises 38.4 metres. The 22 theerthams (sacred wells/tanks) within the complex, each with different mineral compositions and associated with different aspects of the pilgrimage, are an unusual feature.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    ritualsAndFestivals: { text: 'The pilgrimage traditionally begins with a ritual bath in the sea at Agni Tirtham (the beach), followed by bathing in each of the 22 theerthams inside the temple. The Brahmotsavam (10-day annual festival) and Thirukalyanam (celestial wedding of Rama and Sita) are the major festivals. Maha Shivaratri is also celebrated elaborately. The circuit pilgrimage from Rameswaram to Dhanushkodi at the island\'s tip is a traditional extension.', classification: 'documented-fact', sourceIds: ['source-0'], completeness: 'partial' },
    thingsToExplore: [
      { name: 'The 22 Theerthams', description: 'Ritual bathing in all 22 sacred wells/tanks within the temple premises is the central pilgrimage act.', type: 'ritual' },
      { name: 'Agni Tirtham (Beach)', description: 'The sea beach where the pilgrimage traditionally begins with a ritual bath in the Bay of Bengal.', type: 'ritual' },
      { name: 'Dhanushkodi', description: 'The ghost town at the island\'s southern tip, destroyed by the 1964 cyclone — a hauntingly beautiful spot where the Bay of Bengal and Indian Ocean meet.', type: 'experience' },
      { name: 'Pamban Bridge', description: 'The iconic sea bridge connecting Pamban Island to mainland India — the view from the train crossing is spectacular.', type: 'landmark' }
    ],
    visitorInformation: {
      entryFee: { amount: 0, currency: 'INR', notes: 'Entry to the temple is free. Theertham service (bathing by temple priests) carries a donation.', sourceId: null, verificationStatus: 'unverified' },
      openingHours: { summary: 'Temple is open from 5 AM to 1 PM and 3 PM to 9 PM daily. Timings may vary on festival days. Verify with the temple administration.', sourceId: 'source-0', verificationStatus: 'unverified' },
      dressCode: 'Men must remove shirts and enter wearing dhoti. Women should wear saree or traditional attire.',
      photographyPolicy: 'Photography inside the temple may be restricted. Confirm at the entrance.',
      accessibilityNotes: 'The long corridors involve significant walking. Wheelchairs may be available — confirm with the temple.',
      bestArrivalTime: 'Early morning for the first darshan. The pilgrimage typically takes a full day including all theerthams.'
    },
    bestTimeToVisit: 'October to April. Avoid monsoon season.',
    howToReach: {
      nearestAirport: { name: 'Madurai Airport (IXM)', distanceKm: 175 },
      nearestRailway: { name: 'Rameswaram Railway Station', distanceKm: 1 },
      roadAccess: 'Connected to Madurai (175 km) and Chennai by road and rail. The Pamban Bridge is a remarkable crossing.',
      localTransport: 'Auto-rickshaws and taxis within Rameswaram. Shared jeeps to Dhanushkodi.'
    },
    nearbyPlaces: [{ id: 'madurai', name: 'Meenakshi Amman (Madurai)', distanceKm: 175, notes: 'Commonly combined with Rameswaram.' }, { id: 'kanyakumari', name: 'Vivekananda Rock (Kanyakumari)', distanceKm: 330, notes: 'Completes the South India temple circuit.' }],
    sources: [{ id: 'source-0', title: 'HRCE Tamil Nadu — Ramanathaswamy Temple', publisher: 'Tamil Nadu Hindu Religious and Charitable Endowments Department', url: 'https://rameswaramramanathar.hrce.tn.gov.in/', sourceType: 'official-temple', accessedDate: '2026-10-30', supportsFields: ['overview', 'ritualsAndFestivals', 'visitorInformation'], verificationStatus: 'unverified' }]
  }
];

let written = 0, skipped = 0;

for (const dest of DESTINATIONS) {
  const filePath = path.join(CONTENT_DIR, `${dest.id}.json`);
  const existing = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : null;
  if (existing && existing.contentVersion >= 2) { console.log(`  SKIP  ${dest.id}`); skipped++; continue; }

  const record = {
    id: dest.id, slug: dest.id, name: dest.name,
    alternativeNames: dest.alternativeNames || [],
    category: dest.category, city: dest.city || '', state: dest.state,
    country: 'India', coordinates: dest.coordinates,
    overview: dest.overview,
    historicalBackground: dest.historicalBackground,
    religiousSignificance: dest.religiousSignificance,
    legendsAndTraditions: dest.legendsAndTraditions,
    architecture: dest.architecture,
    ritualsAndFestivals: dest.ritualsAndFestivals,
    thingsToExplore: dest.thingsToExplore || [],
    visitorInformation: dest.visitorInformation,
    bestTimeToVisit: dest.bestTimeToVisit || '',
    howToReach: dest.howToReach,
    nearbyPlaces: dest.nearbyPlaces || [],
    gallery: [],
    sources: dest.sources || [],
    verificationStatus: 'draft',
    lastVerified: '2026-10-30',
    contentVersion: 2
  };
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2) + '\n');
  console.log(`  WRITE ${dest.id}`);
  written++;
}
console.log(`\nDone. Written: ${written}  Skipped: ${skipped}`);
