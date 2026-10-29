# SacredMiles — Preliminary Source Discovery Report

**Check date:** 2026-10-30  
**Brand tagline:** The Art of a Meaningful Journey.  
**Scope:** Source discovery against the 35 destination names listed in the user-provided brief; not a repository audit and not a completed destination-story research pass.

## Executive status

- **Repository audit / code changes:** blocked. The only supplied file in the accessible working directory is the research brief; no SacredMiles repository, `lib/data.js`, story component, route files, or `CODE-LEVEL-AUDIT.md` is available. A repository search did not surface a public project matching the identifying filenames.
- **Do not interpret this list as the application's actual catalogue.** The brief lists 35 expected destinations, but the real dataset, IDs, slugs, route references, and itinerary relationships remain unconfirmed.
- **No app stories were changed or marked complete.** Full story writing, claim-by-claim sourcing, schema integration, validation script implementation and QA remain pending until the actual repository is accessible.
- **No commit or push was performed.**

### Source discovery counts (only for this preliminary register)

- Destination research targets listed in the brief: **35**
- Source entries marked `verified` during this pass: **4**
- Source entries marked `partially_verified`: **14**
- Source entries marked `unverified`: **17**
- These counts are not repository audit aggregates. Actual catalogue/story/resource counts must be recomputed from the real destination records.

## Source-status interpretation

- `verified`: a relevant authority page was opened and its on-page content/navigation directly supported the limited stated purpose. This does **not** mean all claims, fees, timings or child booking links on the destination have been verified.
- `partially_verified`: an authoritative source or institutional page was found, and some page details were inspectable, but one or more important link/claim checks remain.
- `unverified`: a candidate source was found, but direct access, official-domain validation, current content review, or service-specific verification remains incomplete. An automated reader returning 403/502/timeout is not by itself proof that the public website is broken.
- No entry is marked `broken` because no public URL was conclusively established to be broken; some could not be fetched by the browsing reader.

## Preliminary destination-by-destination register

| # | Destination | Primary source candidate | Status | Booking status | Main gap |
|---:|---|---|---|---|---|
| 1 | Kashi Vishwanath, Varanasi | [Shri Kashi Vishwanath Temple Trust portal](https://shrikashivishwanath.org/) | `partially_verified` | Booking entry points are visible on the Trust portal; follow each booking link and confirm its destination before production use. | The page opened and exposes Online Services/Ticket Booking. Confirm each individual service endpoint and current slot/price details. |
| 2 | Sarnath | [Archaeological Survey of India — Sarnath Circle](https://asisarnathcircle.in/visitorinformation.php) | `unverified` | No booking conclusion; official page fetch failed in this session. | Search surfaced ASI Sarnath Circle visitor information with ticket and etiquette details, but direct page retrieval failed. Retry manually and verify current rates/timings. |
| 3 | Ram Janmabhoomi, Ayodhya | [District Ayodhya, Government of Uttar Pradesh](https://ayodhya.nic.in/ayodhya-tourism/) | `partially_verified` | Official temple booking endpoint not established by the district page. | Use the district portal for government-backed destination context. Verify any trust-owned darshan/arti service directly from a temple trust notice before labelling a link official. |
| 4 | Krishna Janmabhoomi, Mathura | [District Mathura, Government of Uttar Pradesh](https://mathura.nic.in/tourist-place/shri-krishna-janambhumi/) | `partially_verified` | No official booking outcome recorded. | District page opened; use official institution website only after confirming exact domain and checking the specific service link. |
| 5 | Har Ki Pauri, Haridwar | [District Haridwar, Government of Uttarakhand](https://haridwar.nic.in/tourist-place/har-ki-pauri/) | `partially_verified` | Not applicable / no official booking service identified. | Official government domain and page were opened. Verify current riverfront advisories or event-specific restrictions separately. |
| 6 | Rishikesh | [Uttarakhand Tourism, Government of Uttarakhand](https://www.uttarakhandtourism.gov.in/destination/rishikesh) | `unverified` | No destination-wide booking service applicable/confirmed. | Direct open exposed mostly a client-side frame. Re-open manually, then verify individual activity/ashram/rafting links separately. |
| 7 | Kedarnath | [District Rudraprayag, Government of Uttarakhand](https://rudraprayag.gov.in/kedarnath-yatra-2/) | `partially_verified` | Official yatra registration portal identified. Helicopter bookings should be followed only through official links on the government portal. | Seasonal shrine access and weather restrictions must be rechecked close to travel. The search result identifies mandatory registration and current-year yatra information. |
| 8 | Jagannath Temple, Puri | [Government of India advisory referencing Odisha Tourism guidance](https://www.pbdindia.gov.in/religious-sites-advisory) | `partially_verified` | Official temple booking endpoint not established. Do not use third-party booking-looking sites unless the temple authority links to them. | An apparent booking demo was explicitly labelled 'Demo Site / Not Official Website' in search results and should not be used. Locate the current Shree Jagannath Temple Administration source and verify its domain. |
| 9 | Sun Temple, Konark | [UNESCO World Heritage Centre](https://whc.unesco.org/en/list/246/) | `verified` | No official booking/ticket page verified in this pass. | UNESCO page opened and directly supports the cited historical and architectural summary. Find and check the current ASI ticket/timing page separately. |
| 10 | Ramanathaswamy Temple, Rameswaram | [Tamil Nadu Hindu Religious and Charitable Endowments Department temple portal](https://rameswaramramanathar.hrce.tn.gov.in/) | `unverified` | Official temple portal is identified, but booking functionality needs a successful live check. | Search result showed opening windows, but direct page fetch timed out. Recheck official HRCE page manually before publishing any time. |
| 11 | Meenakshi Amman Temple, Madurai | [Tamil Nadu Hindu Religious and Charitable Endowments Department temple portal](https://maduraimeenakshi.hrce.tn.gov.in/) | `unverified` | No official booking endpoint confirmed. | Search results expose current opening/closing windows, but direct fetch timed out; verify on the page before attaching timings to claims. |
| 12 | Vivekananda Rock, Kanyakumari | [Kanniyakumari District, Government of Tamil Nadu](https://kanniyakumari.nic.in/tspot_vrm/) | `partially_verified` | District page includes a ferry booking link; follow it and verify the operator/authority relationship before classifying as official. | Government page opened. Ferry/boat operations, weather cancellations, and ticket terms are operational details requiring a current check. |
| 13 | Tirumala Venkateswara, Tirupati | [Tirumala Tirupati Devasthanams (TTD)](https://tirumala.org/Darshan.aspx) | `verified` | Official TTD site opened and links to TTD online services and darshan/seva services. | TTD's official site was opened and its pilgrim-services and online-services links were visible. Verify every booking page individually before use. |
| 14 | Mallikarjuna Temple, Srisailam | [Srisaila Devasthanam](https://www.srisailadevasthanam.org/en-in/home) | `partially_verified` | Official service pages identified, but several pages require JavaScript and each booking route still needs manual validation. | The official-looking site identifies the Devasthanam and booking functions, but direct extraction was JavaScript-limited. Test the actual booking endpoints. |
| 15 | Sai Baba Temple, Shirdi | [Shree Saibaba Sansthan Trust, Shirdi](https://www.sai.org.in/en) | `verified` | Verified relationship: the opened Trust website links its Darshan services to online.sai.org.in and warns about fake booking sites. | Strong example of a destination whose official site explicitly identifies the only official booking domain. Use that warning to screen any other domain. |
| 16 | Trimbakeshwar | [District Nashik, Government of Maharashtra](https://nashik.gov.in/en/tourist-place/trimbakeshwar-temple/) | `unverified` | Official booking service not verified. | Search surfaced both government tourism information and a claimed temple-trust URL via Ministry of Tourism. Confirm the link directly from the trust or official tourism authority. |
| 17 | Dwarkadhish Temple, Dwarka | [District Devbhumi Dwarka, Government of Gujarat](https://devbhumidwarka.nic.in/tourist-place/dwarkadhish-temple/) | `unverified` | No official booking endpoint confirmed. | Use the government destination page as a lead, but directly open it and seek temple-controlled guidance for hours, restrictions and any booking services. |
| 18 | Somnath | [Shree Somnath Trust — listed as organizer by Government of India Ministry of Tourism's Utsav portal](https://somnath.org/) | `partially_verified` | Follow official Trust site; individual booking route not checked in this pass. | Government tourism source names Shree Somnath Trust and lists somnath.org. Open the trust site and verify each service-specific link before assigning verified status. |
| 19 | Padmanabhaswamy Temple, Thiruvananthapuram | [Sree Padmanabhaswamy Temple website (domain self-identifies as SPST)](https://spst.in/Timing) | `unverified` | Temple home page advertises online pooja booking, but booking page relationship and exact routes need manual validation. | The temple page did not expose text via the browser reader. Search result content should not be treated as a completed direct verification. |
| 20 | Guruvayur Temple | [Guruvayur Devaswom](https://guruvayurdevaswom.in/) | `unverified` | Website surfaces official booking information, but the page returned 403 to the browser reader. | A browser 403 does not prove the website is broken. Verify manually and use official notices for current darshan restrictions and dress code. |
| 21 | Virupaksha Temple, Hampi | [District Vijayanagara, Government of Karnataka](https://vijayanagara.nic.in/en/tourist-place/virupaksha-temple/) | `unverified` | No standalone official booking service established. | Check ASI/World Heritage sources for the Hampi property and temple authority notices for worship timings separately. |
| 22 | Mysore Palace | [Mysore Palace Board / Government of Karnataka (domain referenced by Government of India tourism planning document; not opened here)](https://mysorepalace.karnataka.gov.in/) | `unverified` | Official palace ticket endpoint not validated. | Verify the palace domain and year-round hours directly; distinguish palace entry, forecourt access, illumination and festival ticketing. |
| 23 | Udupi Sri Krishna Matha | [Udupi Shri Krishna Matha (site self-identifies as official; domain linkage not independently established in this pass)](https://shrikrishnamatha.org/) | `unverified` | Do not assume either domain is authorized for bookings until confirmed by the Matha. | Two domains surfaced as official. Resolve which is controlled by the temple/administration before including any link in the app. |
| 24 | Brahma Temple, Pushkar | [Department of Tourism, Government of Rajasthan](https://www.tourism.rajasthan.gov.in/brahma-temple.html) | `unverified` | No official booking endpoint identified. | The government page describes the temple and religious tradition; attribute the Brahma yajna account as legend, not as documented historical fact. |
| 25 | Birla Mandir, Jaipur | [Incredible India / Ministry of Tourism](https://www.incredibleindia.gov.in/en/rajasthan/jaipur/birla-temple) | `unverified` | No official booking endpoint identified. | The site is a tourism reference, not the temple-management source. Seek temple or Birla trust confirmation for current rules and hours. |
| 26 | City Palace, Udaipur | [City Palace Museum, Udaipur (institution website)](https://www.citypalacemuseum.org/planyourvisit) | `unverified` | Museum website supports online pre-booking per its older FAQ, but current flow needs checking. | This destination is a museum/palace rather than a temple. Keep its story and resource taxonomy heritage-focused. |
| 27 | Mahakaleshwar, Ujjain | [Shri Mahakaleshwar Temple Management Committee, MP Government domain](https://www.shrimahakaleshwar.mp.gov.in/timing) | `unverified` | Official service pages surfaced, but the timing page returned 502 in this session. | A 502 from the reader is not proof of a broken public page. Distinguish aarti schedules from general darshan hours; current site may publish one without the other. |
| 28 | Khajuraho Group of Monuments | [UNESCO World Heritage Centre](https://whc.unesco.org/en/list/240/) | `verified` | No current ASI ticket/booking page verified in this pass. | UNESCO page opened and directly supports heritage claims. Use ASI sources for current entry fees, hours, restricted zones and photography rules. |
| 29 | Kalighat Kali Temple, Kolkata | [Department of Tourism, Government of West Bengal](https://www.wbtourism.gov.in/Religious%20Tourism/details?id=63d800a0e4bbd858c20633ab&template_id=1) | `unverified` | Official temple booking portal not identified. | A booking-looking third-party result appeared in search; do not use it as official. Search the temple trust or state/district administrative page for authoritative rules. |
| 30 | Dakshineswar Kali Temple | [Temple/estate trustee website (page identifies a Board of Trustee and Shebaits; external domain control still needs corroboration)](https://www.dakshineswarkalitemple.org/index.html) | `partially_verified` | No booking service confirmed. | The site opened and includes history/trustee navigation. Confirm domain legitimacy from an official district/state link; treat stories of religious experience as tradition. |
| 31 | Golden Temple, Amritsar | [District Amritsar, Government of Punjab](https://amritsar.nic.in/tourist-place/sri-harmandir-sahib/) | `partially_verified` | No entry ticket/booking service identified; confirm operational guidance with SGPC. | Keep Sikh practice and community institution context accurate and respectful. Visitor etiquette includes covering the head and removing shoes, but reference current SGPC signs. |
| 32 | Vaishno Devi, Katra | [Shri Mata Vaishno Devi Shrine Board](https://www.maavaishnodevi.org/home) | `partially_verified` | Board source says services must be booked exclusively through its official website; confirm destination links live. | Shrine Board warns that it does not authorize private travel agents. Verify registration and weather notices before visitors travel. |
| 33 | Kamakhya Temple, Guwahati | [Maa Kamakhya Devalaya (the institution's own notice identifies this and maakamakhyadevalaya.org as its official websites)](https://maakamakhya.org/) | `partially_verified` | Official site names the booking portal; current availability/pricing and each route still need checking. | Several similarly named sites appear online. Use only domains explicitly named by the Devalaya itself; general and special queue policies may change. |
| 34 | Basilica of Bom Jesus | [Goa Tourism Development Corporation](https://goa-tourism.com/church/basilica-of-bom-jesus/) | `unverified` | No official booking endpoint identified. | Use UNESCO/ASI for heritage designation and conservation; distinguish museum-like visitor hours from Mass schedules. |
| 35 | Shanta Durga Temple | [Government of Goa](https://www.goa.gov.in/places/shanta-durga-temple/) | `partially_verified` | No official booking service identified. | Government of Goa source distinguishes local legend of Shantadurga mediating between Shiva and Vishnu. Attribute as a traditional story, not history. |

## Highest-priority verification findings

1. **Use the official service links exposed by the authority, not a lookalike search result.** The Shirdi Trust site explicitly links to its official online booking portal and warns against fake booking sites. This is the model to follow for every temple/attraction.
2. **At least one apparent Puri booking website surfaced as a demo and explicitly said it was not an official website.** Do not use it. Locate the current temple-administration domain and verify any booking link from a temple-controlled page.
3. **TTD's official page exposes pilgrim services and links to its online services domain.** Preserve that relationship and still check the specific booking endpoint and current policies before displaying it.
4. **For heritage sites, use heritage authorities for historical/architectural claims and the ticketing authority for fees and visiting hours.** UNESCO pages for Konark and Khajuraho support history and heritage context, but do not by themselves verify current entry prices/hours.
5. **Treat search results and blocked page fetches as leads, not proof.** HRCE temple pages for Rameswaram and Madurai and the MP Mahakaleshwar timing page could not be fully retrieved by the browser reader in this pass; their visitor times must not be marked verified from this report.
6. **Religious tradition, historical fact and legend need separate editorial labels.** For example, the Shanta Durga story of mediating between Shiva and Vishnu should be attributed as a local religious legend.

## Exact next actions once the repository is accessible

1. Inspect `lib/data.js`, story components, route files, official-resource helpers, existing metadata fields and `CODE-LEVEL-AUDIT.md`.
2. Export the actual destination dataset and compare IDs/slugs to the 35 research targets above. Use only the IDs/slugs already present; do not build a competing catalogue.
3. Add each resource to the existing schema with title, publisher/authority, exact URL, source type, claims supported, verification status, checked date, and unresolved notes. Do not add any candidate as `verified` until the exact page is opened and the organization/link purpose is corroborated.
4. Research each destination story claim by claim, preserving a clean distinction between historical record, religious tradition, mythology, local legend, current official instructions and labelled planning estimates.
5. Implement the existing-app-compatible status UI and validation script only after the repository schema and component contract are known.
6. Run lint, tests, production build, content validation, and route/itinerary smoke tests. Record real results in `CODE-LEVEL-AUDIT.md` or a dedicated report.

## Machine-readable outputs

- `SACREDMILES_SOURCE_REGISTER_2026-10-30.csv` — spreadsheet-friendly candidate register.
- `SACREDMILES_SOURCE_REGISTER_2026-10-30.json` — structured handoff, explicitly marked as preliminary and not integrated.

## Evidence snapshots consulted

- [Shri Kashi Vishwanath Trust portal](https://shrikashivishwanath.org/) — opened; exposes Online Services and Ticket Booking navigation.
- [ASI Sarnath Circle visitor information](https://asisarnathcircle.in/visitorinformation.php) — surfaced in search, but direct retrieval failed in this session; not verified.
- [District Ayodhya tourism](https://ayodhya.nic.in/ayodhya-tourism/) — opened; Government of Uttar Pradesh portal lists Sri Ram Janm Bhumi Mandir among attractions.
- [District Mathura entry for Shri Krishna Janambhumi](https://mathura.nic.in/tourist-place/shri-krishna-janambhumi/) — opened; government tourism page.
- [District Haridwar page for Har Ki Pauri](https://haridwar.nic.in/tourist-place/har-ki-pauri/) — opened; Government of Uttarakhand portal.
- [District Rudraprayag Kedarnath Yatra page](https://rudraprayag.gov.in/kedarnath-yatra-2/) and [official Char Dham registration](https://registrationandtouristcare.uk.gov.in/) — government sources surfaced; live season/access conditions must be rechecked.
- [UNESCO Konârak page](https://whc.unesco.org/en/list/246/) — opened; supports the 13th-century / Surya chariot / architectural description.
- [Vivekananda Rock Memorial, Kanniyakumari District](https://kanniyakumari.nic.in/tspot_vrm/) — opened; government page surfaced visitor timings and ferry information.
- [TTD official Darshan page](https://tirumala.org/Darshan.aspx) — opened; pilgrim services, accommodation and online-services links visible.
- [Srisaila Devasthanam](https://www.srisailadevasthanam.org/en-in/home) — official source candidate, but page content was JavaScript-limited in the reader.
- [Shree Saibaba Sansthan Trust](https://www.sai.org.in/en) — opened; links to the Trust's online darshan portal.
- [Padmanabhaswamy Temple timing page](https://spst.in/Timing) — candidate found; direct text extraction was JavaScript-limited.
- [Udupi Shri Krishna Matha](https://shrikrishnamatha.org/) — candidate found; a second domain also self-identifies as an official site, so domain ownership needs resolution.
- [City Palace Museum Udaipur visit information](https://www.citypalacemuseum.org/planyourvisit) — candidate institution page; older FAQ information must not be reused as current prices without rechecking.
- [UNESCO Khajuraho page](https://whc.unesco.org/en/list/240/) — opened; supports Chandella chronology and architectural significance.
- [Dakshineswar Kali Temple](https://www.dakshineswarkalitemple.org/index.html) — opened; exposes history and trustee navigation, but external domain-control corroboration remains outstanding.
- [West Bengal Tourism Kalighat page](https://www.wbtourism.gov.in/Religious%20Tourism/details?id=63d800a0e4bbd858c20633ab&template_id=1) — government tourism source surfaced; direct page review pending.
- [SGPC pilgrimage guidelines](https://sgpc.net/important-guidelines-for-pilgrims-visiting-sachkhand-sri-harmandar-sahib-amritsar/) and [District Amritsar page](https://amritsar.nic.in/tourist-place/sri-harmandir-sahib/) — official source candidates for Sikh heritage and visitor etiquette.
- [Vaishno Devi Shrine Board](https://www.maavaishnodevi.org/home) — source surfaced; official portal says pilgrimage registration/RFID and shrine services are provided by the Board.
- [Maa Kamakhya Devalaya official website](https://maakamakhya.org/) and [linked online services candidate](https://mkdonline.co.in/) — official notice surfaced naming those websites and warning against unauthorized online puja services.
- [Goa Tourism Development Corporation page for Basilica of Bom Jesus](https://goa-tourism.com/church/basilica-of-bom-jesus/) — government tourism source surfaced; current public hours/Mass schedule need Basilica confirmation.
- [Government of Goa page for Shanta Durga Temple](https://www.goa.gov.in/places/shanta-durga-temple/) — government source surfaced; labels the Shiva–Vishnu account as local legend.

## Important limitation

This preliminary report is **not** the requested completed implementation. It intentionally does not create or replace `lib/data.js`, does not invent the existing app's schema, does not claim stories are complete, and does not mark uninspected resources as verified. The next unblock is access to the actual SacredMiles repository through GitHub or an uploaded repository ZIP.