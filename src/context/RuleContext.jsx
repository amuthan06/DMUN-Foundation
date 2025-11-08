import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "dmun_rule_sets";
const USER_TYPE_KEY = "dmun_current_user_type";

export const USER_TYPE_OPTIONS = [
  { value: "general", label: "General Visitor" },
  { value: "delegate", label: "Delegate" },
  { value: "parent", label: "Parent" },
  { value: "educator", label: "Educator" },
];

const BASE_CONTENT = {
  home: {
    hero: {
      lines: ["Representing Youth,", "Building Leaders."],
      subtitle:
        "DMUN Foundation empowers young diplomats through free, world-class programming and global opportunities.",
      primaryCta: { text: "Explore Programs", link: "/programs" },
      secondaryCta: { text: "Volunteer", link: "/volunteer" },
      banner: { enabled: false, text: "", link: "" },
    },
  },
  programs: {
    heroTitle: "Programs that Transform Potential into Purpose",
    heroSubtitle:
      "DMUN delivers free, high-impact learning experiences that cultivate diplomacy, leadership, and global citizenship.",
    heroCta: { text: "View Program Catalog", link: "/programs#catalog" },
    emphasisTag: "student-growth",
    callout:
      "Our initiatives are accessible globally and designed for every learner.",
  },
  about: {
    heroTitle: "About Us",
    missionHeading: "What We Do",
    missionIntro: [
      "The DMUN Foundation is a youth-led, non-profit organisation committed to democratizing diplomacy education.",
      "We empower young people to become active stakeholders in the conversations that shape our world.",
      "Through accessible programs, we build pathways into international relations, public policy, and civic leadership.",
    ],
    impactTagline:
      "Together we advance youth leadership, multilingual communication, and inclusive diplomacy.",
  },
};

const PRESET_RULES = {
  delegate: {
    home: {
      hero: {
        lines: ["Your Next Conference Starts Here", "Lead the Debate."],
        subtitle:
          "Sharpen your diplomacy skills with DMUN’s global simulations, workshops, and mentorship.",
        primaryCta: {
          text: "Register for Upcoming Conference",
          link: "/programs#conferences",
        },
        secondaryCta: {
          text: "Download Prep Guide",
          link: "/documents-assistant",
        },
        banner: {
          enabled: true,
          text: "Winter Conference 2025 registration is now live — secure your committee seat.",
          link: "/newsroom/5",
        },
      },
    },
    programs: {
      heroTitle: "Conference-Ready Training Designed for Delegates",
      heroSubtitle:
        "Level up with intensive committees, negotiation labs, and real-time feedback from expert chairs.",
      heroCta: { text: "Secure Your Spot", link: "/programs#conferences" },
      emphasisTag: "delegate-skill",
      callout:
        "From mock sessions to crisis drills, DMUN programs prepare you to lead with confidence on conference day.",
    },
    about: {
      heroTitle: "Built by Delegates, for Delegates",
      missionIntro: [
        "We know the conference floor because we’ve stood on it — every DMUN program is designed by active youth leaders.",
        "Our mission is to open doors to global diplomacy, one committee session at a time.",
        "Get access to coaching, research guidance, and an international community of peers.",
      ],
      impactTagline: "Compete globally. Collaborate deeply. Champion change.",
    },
  },
  parent: {
    home: {
      hero: {
        lines: [
          "Help Your Child Become a Global Leader",
          "Invest in Confidence.",
        ],
        subtitle:
          "DMUN programs strengthen English fluency, public speaking, and critical thinking through real-world diplomacy.",
        primaryCta: {
          text: "Help Your Child Develop Leadership",
          link: "/programs#parent-guide",
        },
        secondaryCta: { text: "Explore Success Stories", link: "/newsroom" },
        banner: {
          enabled: true,
          text: "Parents receive personalized progress updates throughout the program journey.",
          link: "/about#impact",
        },
      },
    },
    programs: {
      heroTitle: "Educational Experiences that Grow with Your Child",
      heroSubtitle:
        "Our curated pathways build communication, research, and collaboration skills — with flexible schedules that support academics.",
      heroCta: {
        text: "Download Parent Overview",
        link: "/programs#parent-guide",
      },
      emphasisTag: "family-outcomes",
      callout:
        "Take-home reflections, personalized feedback, and mentorship ensure every student thrives.",
    },
    about: {
      heroTitle: "Partnering with Families for Lifelong Skills",
      missionIntro: [
        "DMUN helps young people find their voice — and gives parents clear benchmarks for growth.",
        "Our team curates safe, supportive environments for students to practice leadership and diplomacy.",
        "Families stay informed with weekly briefings, showcase events, and milestone celebrations.",
      ],
      impactTagline:
        "Confidence today. College, career, and civic readiness tomorrow.",
    },
  },
  educator: {
    home: {
      hero: {
        lines: [
          "Bring Diplomacy into Your Classroom",
          "Activate Student Leadership.",
        ],
        subtitle:
          "Co-create experiential learning with DMUN — from co-curricular clubs to accredited curriculum extensions.",
        primaryCta: {
          text: "Bring MUN to Your School",
          link: "/programs#school-partnerships",
        },
        secondaryCta: {
          text: "Download Curriculum Toolkit",
          link: "/research",
        },
        banner: {
          enabled: true,
          text: "Schools can co-host DMUN simulations and receive faculty training at no cost.",
          link: "/partner",
        },
      },
    },
    programs: {
      heroTitle: "Curriculum-Aligned Programs for Schools",
      heroSubtitle:
        "Embed inquiry, debate, and global citizenship into your timetable with DMUN’s turnkey modules.",
      heroCta: {
        text: "Schedule a Faculty Briefing",
        link: "/programs#school-partnerships",
      },
      emphasisTag: "curriculum-integration",
      callout:
        "We provide lesson plans, assessment rubrics, and co-teaching support to make implementation seamless.",
    },
    about: {
      heroTitle: "A Trusted Partner for Educational Leaders",
      missionIntro: [
        "DMUN collaborates with schools to extend international-mindedness and student agency.",
        "Our interdisciplinary programming complements humanities, civics, and language curricula.",
        "Professional learning sessions equip educators to facilitate Model UN with confidence.",
      ],
      impactTagline:
        "Empower your staff. Inspire your students. Expand your impact.",
    },
  },
};

function clone(value) {
  return value ? JSON.parse(JSON.stringify(value)) : {};
}

function deepMerge(target, source) {
  if (!source) return target;
  const output = target;
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue)
    ) {
      output[key] = deepMerge(
        output[key] ? { ...output[key] } : {},
        sourceValue
      );
    } else {
      output[key] = sourceValue;
    }
  });
  return output;
}

const RuleContext = createContext(null);

export function RuleProvider({ children }) {
  const [userType, setUserTypeState] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_TYPE_KEY);
      return stored || "general";
    } catch (error) {
      console.warn("Unable to read user type preference", error);
      return "general";
    }
  });

  const [ruleSets, setRuleSets] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Unable to parse rule sets", error);
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(USER_TYPE_KEY, userType);
    } catch (error) {
      console.warn("Unable to persist user type", error);
    }
  }, [userType]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ruleSets));
    } catch (error) {
      console.warn("Unable to persist rule sets", error);
    }
  }, [ruleSets]);

  const setUserType = useCallback((nextType) => {
    setUserTypeState(nextType);
  }, []);

  const saveRuleSet = useCallback((type, rule) => {
    setRuleSets((prev) => ({
      ...prev,
      [type]: rule,
    }));
  }, []);

  const clearRuleSet = useCallback((type) => {
    setRuleSets((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  }, []);

  const getMergedContent = useCallback(
    (pageKey, defaults) => {
      const base = clone(defaults || BASE_CONTENT[pageKey]);
      const preset = clone(PRESET_RULES[userType]?.[pageKey] || {});
      const overrides = clone(ruleSets[userType]?.[pageKey] || {});
      return deepMerge(deepMerge(base, preset), overrides);
    },
    [ruleSets, userType]
  );

  const getRuleSetForUser = useCallback(
    (type) => ({
      defaults: clone(BASE_CONTENT),
      preset: clone(PRESET_RULES[type] || {}),
      stored: clone(ruleSets[type] || {}),
      merged: (pageKey) => {
        const base = clone(BASE_CONTENT[pageKey]);
        const preset = clone(PRESET_RULES[type]?.[pageKey] || {});
        const overrides = clone(ruleSets[type]?.[pageKey] || {});
        return deepMerge(deepMerge(base, preset), overrides);
      },
    }),
    [ruleSets]
  );

  const value = useMemo(
    () => ({
      userType,
      userTypes: USER_TYPE_OPTIONS,
      ruleSets,
      setUserType,
      saveRuleSet,
      clearRuleSet,
      getMergedContent,
      getRuleSetForUser,
    }),
    [
      userType,
      ruleSets,
      setUserType,
      saveRuleSet,
      clearRuleSet,
      getMergedContent,
      getRuleSetForUser,
    ]
  );

  return <RuleContext.Provider value={value}>{children}</RuleContext.Provider>;
}

export function useRuleContext() {
  const context = useContext(RuleContext);
  if (!context) {
    throw new Error("useRuleContext must be used within a RuleProvider");
  }
  return context;
}

export function usePersonalizedContent(pageKey, defaults) {
  const { getMergedContent } = useRuleContext();
  const memoDefaults = useMemo(() => defaults, [defaults]);
  return useMemo(
    () => getMergedContent(pageKey, memoDefaults),
    [getMergedContent, memoDefaults, pageKey]
  );
}
