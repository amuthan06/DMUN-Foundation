import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSearch, useSearchNavigation } from "../../context/SearchContext";
import SearchSuggestions from "./SearchSuggestions";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 33, 71, 0.08);
  border: 1px solid rgba(0, 33, 71, 0.15);
  border-radius: 999px;
  padding: 0.35rem 0.75rem;

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(68, 184, 243, 0.35);
  }
`;

const Input = styled.input`
  border: none;
  background: transparent;
  color: inherit;
  font-size: 0.95rem;
  font-family: var(--andover-font-sans);
  min-width: 210px;

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    width: 130px;
    min-width: 130px;
  }
`;

const IconButton = styled.button`
  border: none;
  background: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  color: inherit;

  &:hover {
    opacity: 0.8;
  }
`;

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </svg>
);

const ClearIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function SearchBar() {
  const {
    query,
    setQuery,
    runSuggestionSearch,
    suggestions,
    isSuggestionOpen,
    clearSuggestions,
    popularQueries,
    recentSearches,
    addRecentSearch,
  } = useSearch();
  const navigate = useNavigate();
  const goToPath = useSearchNavigation();
  const inputRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.parentElement.contains(event.target)
      ) {
        clearSuggestions();
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearSuggestions]);

  const handleChange = (event) => {
    const value = event.target.value;
    setActiveIndex(-1);
    runSuggestionSearch(value);
  };

  const submitSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    addRecentSearch(trimmed);
    clearSuggestions();
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (event) => {
    if (!isSuggestionOpen || suggestions.length === 0) {
      if (event.key === "Enter") {
        event.preventDefault();
        submitSearch(query);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0) {
        const suggestion = suggestions[activeIndex];
        if (suggestion.type === "result" && suggestion.path) {
          goToPath(suggestion.path, query);
        } else {
          submitSearch(suggestion.label);
        }
      } else {
        submitSearch(query);
      }
    } else if (event.key === "Escape") {
      clearSuggestions();
      setActiveIndex(-1);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    if (suggestion.type === "result" && suggestion.path) {
      goToPath(suggestion.path, query);
    } else {
      submitSearch(suggestion.label);
    }
  };

  const handleClear = () => {
    setQuery("");
    runSuggestionSearch("");
    inputRef.current?.focus();
  };

  return (
    <Wrapper>
      <InputWrapper>
        <SearchIcon />
        <Input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onFocus={() => runSuggestionSearch(query)}
          placeholder="Search DMUN..."
          onKeyDown={handleKeyDown}
          aria-label="Search DMUN content"
        />
        {query && (
          <IconButton
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <ClearIcon />
          </IconButton>
        )}
      </InputWrapper>
      <SearchSuggestions
        open={isSuggestionOpen}
        suggestions={suggestions}
        activeIndex={activeIndex}
        onHover={setActiveIndex}
        onSelect={handleSuggestionSelect}
        query={query}
        popularQueries={popularQueries}
        recentSearches={recentSearches}
        onSubmitAll={() => submitSearch(query)}
      />
    </Wrapper>
  );
}

export default SearchBar;
