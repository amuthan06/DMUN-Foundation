import { leadershipTeam } from "./leadership";
import { newsroomArticles } from "./newsroomArticles";

const basePages = [
  {
    id: "page-home",
    title: "DMUN Foundation · Home",
    content:
      "Representing Youth, Building Leaders. DMUN connects young delegates globally through free programs, events, and diplomacy resources. Upcoming events, youth empowerment, global impact, and leadership opportunities.",
    path: "/",
    category: "Pages",
    tags: ["home", "overview", "youth leadership", "events", "programs"],
  },
  {
    id: "page-about",
    title: "About the DMUN Foundation",
    content:
      "Mission, history, philosophy, impact statistics, leadership overview, and global representation. Learn about our values, annual reports, and the people guiding our mission.",
    path: "/about",
    category: "Pages",
    tags: ["about", "mission", "history", "leadership", "impact"],
  },
  {
    id: "page-programs",
    title: "Programs · DMUN Foundation",
    content:
      "Workshops, leadership training, global citizen seminars, and youth exchange initiatives. Explore program highlights, impact stories, community service opportunities, and online engagement.",
    path: "/programs",
    category: "Pages",
    tags: ["programs", "education", "workshops", "leadership development"],
  },
  {
    id: "page-advocacy",
    title: "Advocacy · DMUN Foundation",
    content:
      "Advocacy strategies, ethical statement, ways to take action, policy engagement, and support for youth voices in diplomacy. Includes campaigns, human rights, and sustainable development goals.",
    path: "/advocacy",
    category: "Pages",
    tags: ["advocacy", "campaigns", "policy", "human rights", "youth voice"],
  },
  {
    id: "page-research",
    title: "Research · DMUN Foundation",
    content:
      "Research areas, publications, data insights, international collaborations, and evidence-based recommendations produced by DMUN. Access to reports, youth statements, and academic references.",
    path: "/research",
    category: "Pages",
    tags: ["research", "publications", "reports", "data", "insights"],
  },
  {
    id: "page-integrity",
    title: "Integrity & Compliance",
    content:
      "Ethics, transparency, documentation, anti-corruption policies, compliance forms, diversity and inclusion standards, and safeguarding principles guiding DMUN operations.",
    path: "/integrity",
    category: "Pages",
    tags: ["integrity", "compliance", "ethics", "governance", "policies"],
  },
  {
    id: "page-mandate",
    title: "Mandate · Mission and Values",
    content:
      "The foundation’s constitutional mandate, mission, vision, strategic goals, core values, and governance structure.",
    path: "/mandate",
    category: "Pages",
    tags: ["mandate", "mission", "vision", "values", "constitution"],
  },
  {
    id: "page-take-action",
    title: "Take Action · Volunteer, Donate, Partner",
    content:
      "How to get involved with DMUN through volunteering, donations, partnerships, advocacy, and youth engagement opportunities.",
    path: "/take-action",
    category: "Pages",
    tags: ["take action", "volunteer", "donate", "partner", "support"],
  },
  {
    id: "page-donor-relations",
    title: "Donor Relations",
    content:
      "Donor integrity, transparency commitments, stewardship practices, reporting, and contact information for donor enquiries.",
    path: "/donor-relations",
    category: "Pages",
    tags: ["donors", "funding", "support", "transparency"],
  },
  {
    id: "page-publications",
    title: "Publications & Statements",
    content:
      "Browse DMUN’s research publications, statements, interventions, youth reports, and collaborative outputs.",
    path: "/Publications",
    category: "Pages",
    tags: ["publications", "reports", "statements", "research"],
  },
  {
    id: "page-membership",
    title: "Membership · DMUN Foundation",
    content:
      "Explore membership categories, admission process, application forms, and governance committees supporting the foundation.",
    path: "/Membership",
    category: "Pages",
    tags: ["membership", "application", "board", "committee"],
  },
  {
    id: "page-newsroom",
    title: "Newsroom · DMUN Foundation",
    content:
      "Press releases, articles, event recaps, media resources, and updates from the DMUN Foundation.",
    path: "/newsroom",
    category: "Pages",
    tags: ["news", "press release", "media", "updates", "events"],
  },
  {
    id: "page-volunteer",
    title: "Volunteer with DMUN",
    content:
      "Volunteer opportunities, values, application details, and impact of volunteering with the DMUN Foundation.",
    path: "/volunteer",
    category: "Pages",
    tags: ["volunteer", "service", "youth", "opportunities"],
  },
  {
    id: "page-donate",
    title: "Donate to DMUN",
    content:
      "Why donate, how contributions are used, donor recognition, funding priorities, and online giving options.",
    path: "/donate",
    category: "Pages",
    tags: ["donate", "contribute", "give", "funding", "support"],
  },
];

const leadershipEntries = leadershipTeam.map((leader) => ({
  id: `leader-${leader.email}`,
  title: `${leader.name} · ${leader.title}`,
  content: `${leader.bio} Department: ${leader.department}. Location: ${
    leader.location
  }. Contact: ${leader.email || ""}.`,
  path: "/leadership",
  category: "Leadership",
  tags: [
    "leadership",
    "team",
    leader.department,
    leader.location,
    "executive",
    "director",
  ].filter(Boolean),
}));

const newsroomEntries = newsroomArticles.map((article) => ({
  id: `news-${article.id}`,
  title: article.title,
  content: `${article.summary || ""} ${article.date || ""} ${
    article.category || ""
  }`,
  path: `/newsroom/${article.id}`,
  category: "Newsroom",
  tags: [
    "news",
    "press release",
    "media",
    article.category,
    "event",
    "update",
  ].filter(Boolean),
}));

const additionalContent = [
  {
    id: "exec-portal",
    title: "Executives Portal",
    content:
      "DMUN executives login to manage messages, leadership roles, and broadcast alerts to the team.",
    path: "/executives-login",
    category: "Pages",
    tags: ["executives", "login", "management", "messages"],
  },
  {
    id: "documents-assistant",
    title: "Documents Draft Assistant",
    content:
      "Upload DMUN position papers to receive compliance and quality feedback aligned with GDMUN Rules of Procedure.",
    path: "/documents-assistant",
    category: "Tools",
    tags: ["documents", "assistant", "position paper", "rules of procedure"],
  },
];

export const searchIndex = [
  ...basePages,
  ...additionalContent,
  ...leadershipEntries,
  ...newsroomEntries,
];
