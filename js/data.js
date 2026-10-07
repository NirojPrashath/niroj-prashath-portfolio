/* ==========================================================================
   NP / data.js
   Single source of truth for every page. No fetch(), no build step:
   the site works from disk (file://) as well as from a server.
   ========================================================================== */

window.NP = (function () {
  "use strict";

  const profile = {
    name: "Yogeswaran Niroj Prashath",
    short: "Niroj Prashath",
    initials: "NP",
    title: "Software Engineer & UI/UX Designer",
    location: "Sri Lanka",
    availability: "Open to thoughtful junior roles, internships, and considered freelance projects",
    headline: "Design for people. Engineer with intent.",
    intro:
      "I bring interface design and software engineering together to build human first digital products from the first interaction to the system behind it.",
    positioning:
      "Interface design and software engineering, practised as one craft, in service of human-first products.",
    education: "Software Engineering student at the National Apprentice & Industrial Training Authority (NAITA)",
    email: "yogeswarannirojprashath@gmail.com"
  };

  const links = {
    email: "mailto:yogeswarannirojprashath@gmail.com",
    gmail:
      "https://mail.google.com/mail/?view=cm&fs=1&to=yogeswarannirojprashath@gmail.com&su=Project%20enquiry%20%E2%80%94%20portfolio",
    github: "https://github.com/NirojPrashath",
    linkedin: "https://linkedin.com/in/niroj-prashath-493631367",
    /* click-to-chat: https://wa.me/<international number>[?text=<prefilled>] */
    whatsapp: "https://wa.me/94719824282?text=Hi%20Niroj%2C%20I%20found%20your%20portfolio",
    instagram: "https://www.instagram.com/mr_redwolf_toro",
    drive: "https://drive.google.com/drive/folders/1aveTu2z-zrZS7g2Lzt1AtTp6DD7th7Pp"
  };

  const stats = [
    { value: 12, suffix: "+", label: "projects and builds" },
    { value: 32, suffix: "", label: "routes in the newer work" },
    { value: 1, pad: 2, suffix: "", label: "industry internship" }
  ];

  /** the numbered capability row under the hero (reference: "#01 Brand Strategy") */
  const capabilities = [
    { n: "#01", label: "UI/UX & Product" },
    { n: "#02", label: "Front-end Engineering" },
    { n: "#03", label: "Android · Kotlin" },
    { n: "#04", label: "Backend & Data" }
  ];

  const callouts = [
    "UI/UX + Figma",
    "React + JavaScript",
    "Kotlin / Android",
    "Firebase + Maps"
  ];

  const ticker = [
    "Interface systems",
    "React",
    "Kotlin · Jetpack Compose",
    "Figma",
    "Firebase",
    "Google Maps SDK",
    "Node.js",
    "MySQL",
    "JavaFX",
    "Python",
    "Apps Script",
    "Product thinking",
    "Accessibility",
    "Multilingual UI"
  ];

  const about = {
    paragraphs: [
      "I am a Software Engineering student at NAITA who enjoys taking an unclear problem, finding its key constraints, and turning it into software people can actually use.",
      "My work sits where **interface design and engineering meet** emergency response, commerce, healthcare, booking, and travel products. I care about the parts people forget to design: empty states, error states, what happens at 2am when the network drops, and what the system does when two people want the same seat.",
      "That means I sketch in Figma, build in React and Kotlin, model the data, wire the API, and then go back and fix the copy because a product is only as good as its least-considered screen."
    ],
    tags: [
      "Software Engineer",
      "UI/UX Designer",
      "Web + Android",
      "Based in Sri Lanka"
    ],
    status: "Open to thoughtful junior roles & internships.",
    focus:
      "Comfortable across the stack: interface systems, component libraries, data modelling, API integration, and the documentation that keeps a project alive after handover."
  };

  const credentials = [
    {
      kicker: "Industry internship",
      title: "Software Engineering Intern",
      org: "Proxima Private Limited",
      desc:
        "Real project work inside a professional team: Agile delivery, full-stack development, code review, and the habit of solving problems rather than symptoms.",
      tags: ["Agile", "Full-stack", "Team delivery", "Problem-solving"],
      icon: "briefcase"
    },
    {
      kicker: "Education",
      title: "Software Engineering Program",
      org: "NAITA · Sri Lanka",
      desc:
        "A structured program covering programming fundamentals, object-oriented design, databases, web and mobile development, and modern engineering methods.",
      tags: ["OOP", "Databases", "Web", "Mobile", "Engineering methods"],
      icon: "cap"
    }
  ];

  const skills = [
    {
      label: "Craft 01",
      title: "UI/UX & product",
      items: ["Figma", "Responsive UI", "Interaction design", "Product thinking"]
    },
    {
      label: "Craft 02",
      title: "Languages",
      items: ["Java", "Kotlin", "Python", "JavaScript", "HTML5", "CSS3", "SQL"]
    },
    {
      label: "Craft 03",
      title: "Web & application frameworks",
      items: ["React", "Android", "Jetpack Compose", "JavaFX"]
    },
    {
      label: "Craft 04",
      title: "Backend, data & platforms",
      items: ["Node.js", "Firebase", "MySQL", "Google Apps Script", "Google Maps SDK"]
    },
    {
      label: "Craft 05",
      title: "Tools",
      items: ["Git", "GitHub", "VS Code", "Android Studio"]
    }
  ];

  /* ------------------------------------------------------------ projects */
  const projects = [
    {
      id: "project-01",
      idx: "01",
      title: "RAASTA",
      short: "RAASTA",
      image: null,          // concept - no product screens to capture
      imageAlt: null,
      motif: "route",       // drawn motif stands in for a product screen
      category: "Mobility · Android + web · Concept",
      filters: ["mobile", "web"],
      context: "Google Fund My Crazy · 2026",
      summary:
        "An emergency-response concept that alerts nearby drivers when an ambulance is approaching, so a corridor opens before the siren arrives.",
      lead: "About a minute of advance warning, delivered inside a map experience people already recognise.",
      points: [
        "Live route countdown so a driver knows how long the corridor is needed, not just that it exists.",
        "A multilingual pull-aside instruction — shown in Tamil, Sinhala, English and Hindi — that tells the driver what to do without reading a paragraph.",
        "Voice guidance and an auto-dismiss state so the alert leaves the screen the moment it is no longer relevant.",
        "Ambulance-run broadcasts, nearby-driver awareness, and a thank-you state that closes the loop politely instead of silently."
      ],
      metrics: [
        { v: "~1 min", l: "advance warning" },
        { v: "4", l: "languages" },
        { v: "Ambulance", l: "run broadcasts" }
      ],
      tech: ["Kotlin", "Jetpack Compose", "Maps SDK", "Directions API", "Gemini Vision"],
      inside: [
        "Driver-side alert sheet that never blocks turn-by-turn navigation",
        "Dispatch broadcast model for an active ambulance run",
        "Auto-dismiss rules tied to route progress, not a timer",
        "Voice prompts localised alongside every visual string"
      ],
      decisions: [
        { title: "Warning, not wallpaper", note: "The alert is designed to be dismissed quickly a corridor that opens and closes beats a notification that lingers." },
        { title: "Language is part of the UI", note: "Tamil, Sinhala, English and Hindi were treated as layout constraints from the first screen, not as a later translation pass." },
        { title: "Familiar map, new signal", note: "The concept reuses standard mapping patterns so the driver recognises the surface instantly under stress." }
      ]
    },
    {
      id: "project-02",
      idx: "02",
      title: "Iron Tide",
      short: "Iron Tide",
      image: "assets/img/projects/iron-tide-wide.jpg",
      imageCard: "assets/img/projects/iron-tide-card.jpg",
      imageAlt:
        "Iron Tide homepage: a dark gym hero reading “Lift heavy. Breathe. Repeat.” with class booking and a weekly schedule.",
      category: "Fitness · Web experience",
      filters: ["web"],
      context: "Gym website · First-visit journey",
      summary:
        "A gym website built around one question a real person asks: what actually happens when I walk in for the first time?",
      lead: "8 routes, 5 switchable colour directions, one clear path from curiosity to a booked trial class.",
      points: [
        "Coaching information, timetable, and visit details arranged so a first-timer can plan before they commit.",
        "A trial-class booking path that ends in a confirmation, not a contact form dead-end.",
        "Named routes and features: /coaches, /visit, /trial, programmes, timetable, and membership.",
        "Five switchable colour directions including a light “Studio” treatment and a bold high contrast one so the identity could be tested, not guessed."
      ],
      metrics: [
        { v: "8", l: "routes" },
        { v: "5", l: "colour directions" },
        { v: "1", l: "trial booking path" }
      ],
      tech: ["HTML5", "CSS3", "JavaScript", "Responsive UI", "Figma"],
      inside: [
        "Programme and timetable browsing without a page reload",
        "Coach profiles linked to the classes they actually take",
        "Visit planning content: parking, changing rooms, what to bring",
        "Membership comparison with plain-language inclusions"
      ],
      decisions: [
        { title: "Design the decision, not the page", note: "Every route answers one part of the first-visit question, so no page has to carry the whole story." },
        { title: "Palettes as a system", note: "Because colours are tokens rather than hard-coded values, five directions could be swapped without touching layout." }
      ]
    },
    {
      id: "project-03",
      idx: "03",
      title: "Knuckles Roasters",
      short: "Knuckles",
      image: "assets/img/projects/knuckles-roasters-wide.jpg",
      imageCard: "assets/img/projects/knuckles-roasters-card.jpg",
      imageAlt:
        "Knuckles Roasters homepage: a light Ceylon coffee storefront with the roast calendar, six origin coffees and a shop grid.",
      category: "Commerce · Storefront system",
      filters: ["commerce", "web"],
      context: "Ceylon coffee · Storefront and merchandising",
      summary:
        "A material-first Ceylon coffee storefront with a complete shopping journey, from discovering a roast to cart and checkout.",
      lead: "11 routes, 58 UI components and 110 source files a real storefront system, not a single landing page.",
      points: [
        "Home, filtered shop, three product pages including a deliberate “not a coffee” edge case cart, multi-step checkout, subscription, brew guide and wholesale.",
        "Cart totals recalculate the moment quantities change; checkout fields validate as the flow progresses.",
        "Six switchable palettes; Slate is the one that keeps attention on the coffee and its material story.",
        "58 UI components covering states, not just the happy path."
      ],
      metrics: [
        { v: "11", l: "routes" },
        { v: "58", l: "UI components" },
        { v: "110", l: "source files" },
        { v: "6", l: "palettes" }
      ],
      tech: ["JavaScript", "CSS3", "Component library", "Figma", "Git"],
      inside: [
        "Multi-step checkout with per-step validation and a review step",
        "Cart state that recalculates line items, totals and shipping live",
        "Subscription flow for repeat roasts and recurring billing copy",
        "Filtered shop with an edge-case product outside the core category"
      ],
      decisions: [
        { title: "Material first", note: "The Slate palette exists so packaging, roast colour and texture carry the brand instead of decorative chrome." },
        { title: "Edge cases get real pages", note: "The “not a coffee” product is treated as a first-class page a storefront that breaks on the exception is not finished." }
      ]
    },
    {
      id: "project-04",
      idx: "04",
      title: "B-Ceylon",
      short: "B-Ceylon",
      image: "assets/img/projects/b-ceylon-wide.jpg",
      imageCard: "assets/img/projects/b-ceylon-card.jpg",
      imageAlt:
        "B-Ceylon Entertainment Vol. 2 event page: a countdown timer, venue and line-up panels above the reservation call to action.",
      category: "Full-stack · Booking platform",
      filters: ["web", "commerce"],
      context: "Events · Ticketing software",
      summary:
        "B-Ceylon is booking and ticketing software: responsive reservations, live seat inventory, seat locking, and tickets that scan at the gate.",
      lead: "From an open seat on a map to a barcode at the door, without a spreadsheet in between.",
      points: [
        "Live seat inventory with seat locking so two people cannot confirm the same seat.",
        "Downloadable digital tickets carrying both a QR code and a CODE128 barcode.",
        "Tickets export as PDF for printing or offline scanning.",
        "Stack: JavaScript front end, Apps Script API, and Google Sheets as the operational data store."
      ],
      metrics: [
        { v: "QR + CODE128", l: "ticket formats" },
        { v: "PDF", l: "ticket download" },
        { v: "Live", l: "seat inventory" }
      ],
      tech: ["JavaScript", "Google Apps Script", "Google Sheets API", "PDF generation", "Responsive UI"],
      inside: [
        "Seat map with locked, held and sold states",
        "Reservation flow that survives a refresh mid-booking",
        "Organiser-side inventory view backed by the same data source",
        "Gate-ready ticket artefacts: QR, barcode and PDF"
      ],
      decisions: [
        { title: "Conflict before convenience", note: "Seat locking is enforced server-side, because a beautiful booking flow that double-books a seat is a broken product." },
        { title: "Lean infrastructure, honest limits", note: "Google Sheets plus Apps Script kept the platform deployable for a small team the trade-offs are documented rather than hidden." }
      ]
    },
    {
      id: "project-05",
      idx: "05",
      title: "Vet Lanka Animal Hospital",
      short: "Vet Lanka",
      image: "assets/img/projects/vet-lanka-wide.jpg",
      imageCard: "assets/img/projects/vet-lanka-card.jpg",
      imageAlt:
        "Vet Lanka Animal Hospital homepage: opening hours, call and WhatsApp actions, and the new clinic photographed from the road.",
      category: "Healthcare · Real veterinary practice",
      filters: ["healthcare", "web"],
      context: "Haliela, Badulla District · Client work",
      summary:
        "A practical website for a real animal hospital, built so pet owners can review services, plan a visit, and reach the clinic without friction.",
      lead: "6 routes shaped around the three things visitors actually do: check, plan, contact.",
      points: [
        "Services, live opening status, and visit planning that ends in a WhatsApp contact form — the channel the clinic already uses.",
        "A pet shop section and a content-status page so the clinic can see what is published and what is pending.",
        "Project imagery is AI-generated except the pet-shop photograph supplied by the client; the source is documented in the project's NOTICE.md."
      ],
      metrics: [
        { v: "6", l: "routes" },
        { v: "Live", l: "opening status" },
        { v: "WhatsApp", l: "contact flow" }
      ],
      tech: ["HTML5", "CSS3", "JavaScript", "Responsive UI", "NOTICE.md documentation"],
      inside: [
        "Opening-hours logic that reflects the current day and time",
        "Visit planning content written for worried owners, not browsers",
        "Image provenance recorded per asset for the client's records",
        "Content status page for unpublished or pending sections"
      ],
      decisions: [
        { title: "Meet people where they are", note: "WhatsApp is the contact channel in this district; adding a web form nobody reads would have been decoration." },
        { title: "Document provenance", note: "AI-generated versus client-supplied imagery is stated in NOTICE.md useful, honest, and easy to audit later." }
      ]
    },
    {
      id: "project-06",
      idx: "06",
      title: "Wayfarer",
      short: "Wayfarer",
      image: "assets/img/projects/wayfarer-wide.jpg",
      imageCard: "assets/img/projects/wayfarer-card.jpg",
      imageAlt:
        "Wayfarer homepage: a search bar for anywhere, any dates, two adults, over stay photography with a free-cancellation badge.",
      category: "Travel · Global booking product",
      filters: ["web", "commerce"],
      context: "Stays and experiences · Multi-currency",
      summary:
        "A booking flow for stays and experiences designed without assuming a single country's currency, cities, or travel habits.",
      lead: "7 routes, 8 cities across 5 continents, 6 currencies — USD, EUR, GBP, AUD, JPY and INR.",
      points: [
        "Routes: Discover, Search, Experiences trip builder, Stay detail, Checkout, Confirmation, and My Trips.",
        "Search with a price slider, eight stay types, eight amenities, five sort orders, filter chips, skeleton and empty states, and a map panel with price pins.",
        "Stay detail with a gallery lightbox, per-date calendar pricing, and a live price breakdown.",
        "Checkout validates traveller details and formats card input; the traveller chooses the payment currency.",
        "Confirmation issues a boarding-pass-style ticket plus a downloadable .ics invite; My Trips adds a countdown, itinerary and cancellation flow."
      ],
      metrics: [
        { v: "7", l: "routes" },
        { v: "8", l: "cities · 5 continents" },
        { v: "6", l: "currencies" },
        { v: "5", l: "sort orders" }
      ],
      tech: ["React", "JavaScript", "CSS3", "Figma", "i18n-aware formatting"],
      inside: [
        "Trip builder that holds multiple experiences before checkout",
        "Calendar pricing per date, with a live breakdown as guests change",
        "Skeleton loading and empty states for every list surface",
        "Plain-language cancellation path with status feedback"
      ],
      decisions: [
        { title: "No default country", note: "Currency, city and date formats are inputs, not assumptions the flow was designed for a traveller who is not the developer." },
        { title: "Price honesty", note: "The breakdown updates live in search, stay detail and checkout so the number never changes as a surprise." }
      ]
    }
  ];

  const supporting = [
    {
      n: "S1",
      title: "Admin Control App",
      desc:
        "Kotlin / Jetpack Compose organiser app with PIN-protected access, booking and revenue views, profit status, and booking search and cancellation.",
      tags: ["Kotlin", "Jetpack Compose", "Android"]
    },
    {
      n: "S2",
      title: "Booking Mobile App",
      desc:
        "Kotlin / Material UI customer app to browse access tiers, reserve a place, and carry a digital QR ticket in the same flow.",
      tags: ["Kotlin", "Material UI", "REST"]
    },
    {
      n: "S3",
      title: "Income & Expense Tracker",
      desc:
        "Python command-line tool for logging, categorising and summarising income and expenses, using file I/O to keep records between sessions.",
      tags: ["Python", "CLI", "File I/O"]
    },
    {
      n: "S4",
      title: "ATM Simulation System",
      desc:
        "Java / JavaFX desktop simulator for balances, withdrawals and deposits, built around object-oriented design rather than shortcuts.",
      tags: ["Java", "JavaFX", "OOP"]
    },
    {
      n: "S5",
      title: "Personal Wallet",
      desc:
        "Responsive wallet website for desktop and mobile, combining HTML, CSS and JavaScript with a backend to keep balances consistent.",
      tags: ["HTML/CSS", "JavaScript", "Backend"]
    },
    {
      n: "S6",
      title: "Digital Diary — Memory Lane",
      desc:
        "Kotlin Android diary for creating, updating and removing entries, with Firebase real-time sync so the same entry appears on every device.",
      tags: ["Kotlin", "Firebase", "Realtime sync"]
    }
  ];

  /* ------------------------------------------------------------ workflow */
  const workflow = {
    intro:
      "A calm process for unclear problems. Five passes — each one leaves a decision written down, so nothing important lives only in my head.",
    steps: [
      {
        id: "flow-discover",
        num: "01",
        title: "Discover",
        lede:
          "Understand before designing. I start with the person, the constraint, and the mess not the layout.",
        cols: [
          { h: "Activities", items: ["Stakeholder conversation", "Constraint mapping", "Reference and competitor sweep", "Success criteria written down"] },
          { h: "Artefacts", items: ["Problem statement", "Constraint map", "Questions list"] },
          { h: "Tools", items: ["Figma (boards)", "Notes in Markdown", "GitHub issues"] }
        ]
      },
      {
        id: "flow-define",
        num: "02",
        title: "Define",
        lede:
          "Turn the mess into a scope. What is in the first version, what waits, and what the product refuses to be.",
        cols: [
          { h: "Activities", items: ["Route and screen inventory", "Information architecture", "Data model sketch", "Edge-case register"] },
          { h: "Artefacts", items: ["Route map", "Scope boundary", "Edge-case list"] },
          { h: "Tools", items: ["Figma", "Mermaid diagrams", "Markdown specs"] }
        ]
      },
      {
        id: "flow-design",
        num: "03",
        title: "Design",
        lede:
          "Interface as a system: tokens first, components second, screens last with states designed at the same time as the happy path.",
        cols: [
          { h: "Activities", items: ["Type and colour tokens", "Component library", "Empty, loading and error states", "Responsive and accessibility passes"] },
          { h: "Artefacts", items: ["Component inventory", "State matrix", "Palette directions"] },
          { h: "Tools", items: ["Figma", "Contrast checking", "Keyboard-only review"] }
        ]
      },
      {
        id: "flow-engineer",
        num: "04",
        title: "Engineer",
        lede:
          "Build it properly so the interface can stay honest. Real validation, real data, real failure behaviour.",
        cols: [
          { h: "Activities", items: ["Component-driven build", "API and data integration", "Validation and seat/inventory logic", "Localisation of strings"] },
          { h: "Artefacts", items: ["Working routes", "Reusable components", "Documented API contract"] },
          { h: "Tools", items: ["React", "Kotlin / Jetpack Compose", "Firebase", "Node.js", "Git"] }
        ]
      },
      {
        id: "flow-refine",
        num: "05",
        title: "Refine & ship",
        lede:
          "Ship, then look at it again with fresh eyes: performance, accessibility, and the copy nobody read twice.",
        cols: [
          { h: "Activities", items: ["Breakpoint and device QA", "Performance and asset pass", "Accessibility and reduced-motion check", "README / NOTICE handover"] },
          { h: "Artefacts", items: ["QA checklist", "Handover docs", "Known-limits note"] },
          { h: "Tools", items: ["DevTools", "Lighthouse", "Screen-reader spot checks"] }
        ]
      }
    ],
    principles: [
      { k: "P1", t: "States are the design", d: "Empty, loading, error and offline are designed alongside the happy path not patched in later." },
      { k: "P2", t: "Multilingual by default", d: "Tamil, Sinhala, English and Hindi layouts were the first version of RAASTA, not an afterthought." },
      { k: "P3", t: "Opaque over decorative", d: "Solid surfaces keep text perfectly readable; atmosphere comes from light, not from haze." },
      { k: "P4", t: "Write it down", d: "Decisions live in README and NOTICE files so the next person inherits reasoning, not folklore." },
      { k: "P5", t: "Respect the low end", d: "Budget Android hardware, thin networks and tired eyes are the cases I design for." },
      { k: "P6", t: "Finish the edges", d: "A cancellation flow and a thank-you state matter as much as the hero screen." }
    ],
    kpis: [
      { v: "5", l: "passes per project" },
      { v: "32", l: "routes shipped in recent work" },
      { v: "58", l: "components in one storefront" },
      { v: "4", l: "languages designed for" }
    ]
  };

  const contact = {
    heading: "Building something that deserves careful engineering?",
    body:
      "I am open to internships, junior software roles, and thoughtful freelance projects. If you are building a product that could use a careful engineer and a considered interface, I would like to hear about it.",
    note: "Based in Sri Lanka · working across time zones · replies within a day or two.",
    actions: [
      { label: "Email me", href: "gmail", kind: "primary", icon: "mail" },
      { label: "View GitHub", href: "github", kind: "ghost", icon: "github" }
    ],
    channels: [
      { label: "Gmail", value: profile.email, href: "gmail", icon: "mail" },
      { label: "LinkedIn", value: "linkedin.com/in/niroj-prashath-493631367", href: "linkedin", icon: "linkedin" },
      { label: "GitHub", value: "github.com/NirojPrashath", href: "github", icon: "github" },
      /* the number is deliberately never printed — the row opens a chat */
      { label: "WhatsApp", value: "WhatsApp", href: "whatsapp", icon: "whatsapp" },
      { label: "Instagram", value: "instagram.com/mr_redwolf_toro", href: "instagram", icon: "instagram" }
    ]
  };

  const footer = {
    note: "© 2026 Yogeswaran Niroj Prashath · Software Engineer & UI/UX Designer",
    sub: "Designed and Built by Niroj Prashath"
  };

  return {
    profile, links, stats, callouts, capabilities, ticker, about, credentials, skills,
    projects, supporting, workflow, contact, footer,
    /**
     * Frame sequence - the shared Drive starter ("Cinematic").
     * currentFrame(i) => path + padStart(4, "0") + ext, canvas raster 1920x1080,
     * 300 frames scrubbed by page scroll from top to bottom.
     */
    sequence: {
      count: 300,
      path: "frames/frame_",
      ext: ".jpg",
      pad: 4,
      nativeWidth: 1920,
      nativeHeight: 1080
    }
  };
})();
