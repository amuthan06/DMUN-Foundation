import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Fuse from "fuse.js";
import { useNavigate } from "react-router-dom";
import { searchIndex } from "../data/searchIndex";

const SearchContext = createContext();

const STORAGE_KEY_RECENT = "dmun_recent_searches";

const fuseOptions = {
  keys: [
    { name: "title", weight: 0.45 },
    { name: "content", weight: 0.35 },
    { name: "tags", weight: 0.2 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  shouldSort: true,
};

const synonymsMap = {
  donate: ["contribute", "support", "give", "funding"],
  donation: ["contribute", "support", "give"],
  advocacy: ["campaign", "policy", "human rights"],
  program: ["workshop", "training", "initiative"],
  leadership: ["executive", "director", "team", "trustee"],
  youth: ["student", "young people", "delegates"],
  research: ["publication", "report", "data", "insight"],
  conference: ["summit", "event", "meeting"],
  help: ["assist", "support", "aid"],
};

const popularQueries = [
  "leadership",
  "donate",
  "youth programs",
  "advocacy",
  "press release",
];

const initialRecent = () => {
  try {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY_RECENT);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to read recent searches", error);
  }
  return [];
};

const mapResult = (result) => {
  const { item, matches, score } = result;
  const matchIndex = {};
  matches?.forEach((match) => {
    matchIndex[match.key] = match.indices;
  });

  const createSnippet = () => {
    if (!matchIndex.content || matchIndex.content.length === 0) {
      return {
        snippet: item.content.slice(0, 180),
        snippetMatches: [],
      };
    }

    const [start, end] = matchIndex.content[0];
    const snippetStart = Math.max(0, start - 80);
    const snippetEnd = Math.min(item.content.length, end + 80);
    const snippet = item.content.slice(snippetStart, snippetEnd);
    const adjustedMatches = matchIndex.content.map(([s, e]) => [
      Math.max(0, s - snippetStart),
      Math.min(snippet.length - 1, e - snippetStart),
    ]);

    return {
      snippet,
      snippetMatches: adjustedMatches,
    };
  };

  const { snippet, snippetMatches } = createSnippet();

  return {
    id: item.id,
    title: item.title,
    path: item.path,
    category: item.category,
    snippet,
    snippetMatches,
    titleMatches: matchIndex.title || [],
    score,
  };
};

function augmentQuery(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);

  const synonyms = words.flatMap((word) => synonymsMap[word] || []);
  const unique = Array.from(new Set([...words, ...synonyms]));
  return unique.join(" ");
}

export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(initialRecent);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fuse = useMemo(() => new Fuse(searchIndex, fuseOptions), []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          STORAGE_KEY_RECENT,
          JSON.stringify(recentSearches)
        );
      }
    } catch (error) {
      console.error("Failed to persist recent searches", error);
    }
  }, [recentSearches]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setIsSuggestionOpen(false);
  }, []);

  const runSuggestionSearch = useCallback(
    (value) => {
      const trimmed = value.trim();
      setQuery(value);

      if (trimmed.length === 0) {
        const combined = [
          ...recentSearches.map((term) => ({
            type: "recent",
            label: term,
          })),
          ...popularQueries.map((term) => ({
            type: "popular",
            label: term,
          })),
        ].slice(0, 8);
        setSuggestions(combined);
        setIsSuggestionOpen(true);
        return;
      }

      const augmented = augmentQuery(trimmed);
      const results = fuse.search(augmented, { limit: 6 });
      if (results.length === 0) {
        setSuggestions([]);
        setIsSuggestionOpen(false);
        return;
      }

      const mapped = results.map((res) => ({
        type: "result",
        ...mapResult(res),
      }));
      setSuggestions(mapped);
      setIsSuggestionOpen(true);
    },
    [fuse, recentSearches]
  );

  const addRecentSearch = useCallback((term) => {
    const cleaned = term.trim();
    if (!cleaned) return;
    setRecentSearches((prev) => {
      const next = [cleaned, ...prev.filter((item) => item !== cleaned)];
      return next.slice(0, 8);
    });
  }, []);

  const performSearch = useCallback(
    (value) => {
      const trimmed = value.trim();
      setQuery(trimmed);
      if (trimmed.length === 0) {
        return { results: [], correction: null };
      }

      setIsLoading(true);
      const augmented = augmentQuery(trimmed);
      const results = fuse.search(augmented, { limit: 60 });
      setIsLoading(false);

      if (results.length > 0) {
        const mapped = results.map(mapResult);
        return { results: mapped, correction: null };
      }

      // fallback suggestion with higher threshold
      const suggestionResult = fuse.search(augmented, {
        limit: 1,
        threshold: 0.55,
      });
      if (suggestionResult.length > 0) {
        const title = suggestionResult[0].item.title;
        return { results: [], correction: title };
      }

      return { results: [], correction: null };
    },
    [fuse]
  );

  const value = useMemo(
    () => ({
      query,
      setQuery,
      suggestions,
      isSuggestionOpen,
      runSuggestionSearch,
      clearSuggestions,
      performSearch,
      addRecentSearch,
      recentSearches,
      popularQueries,
      isLoading,
    }),
    [
      query,
      suggestions,
      isSuggestionOpen,
      runSuggestionSearch,
      clearSuggestions,
      performSearch,
      addRecentSearch,
      recentSearches,
      isLoading,
    ]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}

export function useSearchNavigation() {
  const navigate = useNavigate();
  const { clearSuggestions, addRecentSearch } = useSearch();

  return useCallback(
    (path, term) => {
      if (!path) return;
      if (term) {
        addRecentSearch(term);
      }
      clearSuggestions();
      navigate(path);
    },
    [navigate, clearSuggestions, addRecentSearch]
  );
}
