import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import SearchResultCard from "../components/search/SearchResultCard";
import { useSearch } from "../context/SearchContext";

const PageWrapper = styled.main`
  min-height: 100vh;
  padding: clamp(2rem, 5vw, 3.5rem) clamp(1.4rem, 6vw, 5.5rem);
  background: var(--andover-light-blue);
  color: var(--andover-dark-blue);
  font-family: var(--andover-font-sans);
  display: flex;
  flex-direction: column;
  gap: clamp(1.4rem, 2.6vw, 2rem);
`;

const Heading = styled.h1`
  margin: 0;
  font-family: var(--andover-font-serif);
  font-size: clamp(1.8rem, 3.2vw, 2.6rem);
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const Summary = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.9;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
`;

const FilterButton = styled.button`
  border-radius: 999px;
  border: 1px solid rgba(0, 33, 71, 0.18);
  padding: 0.45rem 1rem;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: ${({ $active }) => ($active ? "var(--andover-blue)" : "#fff")};
  color: ${({ $active }) => ($active ? "#002147" : "var(--andover-dark-blue)")};
  cursor: pointer;

  &:hover {
    box-shadow: 0 12px 22px rgba(0, 33, 71, 0.12);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(2rem, 3vw, 2.6rem);
  width: 100%;
  max-width: 1180px;
  margin: 1.5rem auto 2.5rem auto;
  padding-block: clamp(0.8rem, 1.6vw, 1.2rem);
  align-items: start;
  justify-items: center;
  grid-auto-rows: minmax(100px, auto);
  box-sizing: border-box;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;
const GridItem = styled.div`
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;
const DidYouMean = styled.div`
  background: rgba(68, 184, 243, 0.18);
  border-radius: 18px;
  padding: 1rem 1.2rem;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
`;

const SuggestionButton = styled.button`
  border: none;
  background: none;
  color: var(--andover-blue);
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: clamp(1.8rem, 4vw, 2.6rem);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
`;

const SuggestionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Pill = styled.button`
  border-radius: 999px;
  border: 1px solid rgba(0, 33, 71, 0.2);
  padding: 0.5rem 1.1rem;
  background: #fff;
  cursor: pointer;
  font-size: 0.82rem;

  &:hover {
    background: rgba(68, 184, 243, 0.18);
  }
`;

const LoadingState = styled.div`
  font-size: 0.95rem;
  opacity: 0.7;
`;

function useQueryString() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const allCategory = "All";

function SearchResults() {
  const params = useQueryString();
  const queryParam = params.get("q") || "";
  const { performSearch, addRecentSearch, popularQueries, isLoading } =
    useSearch();
  const [results, setResults] = useState([]);
  const [correction, setCorrection] = useState(null);
  const [activeFilter, setActiveFilter] = useState(allCategory);

  useEffect(() => {
    const { results: searchResults, correction: suggestion } =
      performSearch(queryParam);
    setResults(searchResults);
    setCorrection(suggestion);
    addRecentSearch(queryParam);
  }, [performSearch, addRecentSearch, queryParam]);

  const categories = useMemo(() => {
    const categoryMap = new Map();
    results.forEach((result) => {
      const count = categoryMap.get(result.category) || 0;
      categoryMap.set(result.category, count + 1);
    });
    const sorted = Array.from(categoryMap.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
    return [allCategory, ...sorted.map(([name]) => name)];
  }, [results]);

  const filteredResults =
    activeFilter === allCategory
      ? results
      : results.filter((result) => result.category === activeFilter);

  const totalResults = results.length;

  const handleSuggestionClick = (suggestion) => {
    const params = new URLSearchParams(window.location.search);
    params.set("q", suggestion);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
    const { results: searchResults, correction: suggestionText } =
      performSearch(suggestion);
    setResults(searchResults);
    setCorrection(suggestionText);
    addRecentSearch(suggestion);
  };

  return (
    <PageWrapper>
      <div>
        <Heading>Search Results</Heading>
        <Summary>
          Showing {totalResults} result{totalResults === 1 ? "" : "s"} for “
          {queryParam}”
        </Summary>
      </div>

      {correction && (
        <DidYouMean>
          Did you mean:
          <SuggestionButton
            type="button"
            onClick={() => handleSuggestionClick(correction)}
          >
            {correction}
          </SuggestionButton>
        </DidYouMean>
      )}

      {isLoading ? (
        <LoadingState>Searching the DMUN knowledge base…</LoadingState>
      ) : totalResults > 0 ? (
        <>
          <Controls
            role="toolbar"
            aria-label="Filter search results by category"
          >
            {categories.map((category) => {
              const count =
                category === allCategory
                  ? totalResults
                  : results.filter((result) => result.category === category)
                      .length;
              return (
                <FilterButton
                  key={category}
                  type="button"
                  $active={category === activeFilter}
                  onClick={() => setActiveFilter(category)}
                >
                  {category} ({count})
                </FilterButton>
              );
            })}
          </Controls>

          <ContentGrid>
            {filteredResults.map((result) => (
              <SearchResultCard key={result.id} result={result} />
            ))}
          </ContentGrid>
        </>
      ) : (
        <EmptyState>
          <div>No results for “{queryParam}”.</div>
          <div>Try searching for:</div>
          <SuggestionsList>
            {popularQueries.map((term) => (
              <Pill
                key={term}
                type="button"
                onClick={() => handleSuggestionClick(term)}
              >
                {term}
              </Pill>
            ))}
          </SuggestionsList>
        </EmptyState>
      )}
    </PageWrapper>
  );
}

export default SearchResults;
