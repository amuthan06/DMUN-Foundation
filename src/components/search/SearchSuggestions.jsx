import styled from "styled-components";

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: min(420px, 80vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 26px 50px rgba(0, 33, 71, 0.14);
  padding: 0.75rem 0.35rem;
  z-index: 2000;
  display: ${({ $open }) => ($open ? "block" : "none")};
`;

const SectionTitle = styled.div`
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.68rem;
  color: rgba(0, 33, 71, 0.55);
  font-family: var(--andover-font-serif);
  padding: 0.35rem 0.9rem;
`;

const Item = styled.button`
  width: 100%;
  text-align: left;
  border: none;
  background: ${({ $active }) =>
    $active ? "rgba(68, 184, 243, 0.15)" : "transparent"};
  color: var(--andover-dark-blue);
  font-family: var(--andover-font-sans);
  padding: 0.6rem 0.9rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  &:hover {
    background: rgba(68, 184, 243, 0.2);
  }
`;

const ItemTitle = styled.span`
  font-size: 0.92rem;
  font-weight: 600;
`;

const ItemMeta = styled.span`
  font-size: 0.75rem;
  opacity: 0.7;
`;

const Keyword = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: rgba(0, 33, 71, 0.06);
  font-size: 0.78rem;
  margin: 0.2rem;
`;

const EmptyState = styled.div`
  padding: 0.9rem;
  font-size: 0.82rem;
  color: rgba(0, 33, 71, 0.7);
`;

const Footer = styled.div`
  border-top: 1px solid rgba(0, 33, 71, 0.08);
  margin-top: 0.4rem;
  padding: 0.5rem 0.9rem 0 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: rgba(0, 33, 71, 0.6);
`;

const FooterLink = styled.button`
  background: none;
  border: none;
  color: var(--andover-blue);
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

const HighlightText = styled.span`
  background: ${({ $highlight }) =>
    $highlight ? "rgba(255, 215, 0, 0.45)" : "transparent"};
`;

function renderHighlightedText(text, matches) {
  if (!matches || matches.length === 0) {
    return text;
  }

  const parts = [];
  let lastIndex = 0;

  matches.forEach(([start, end]) => {
    if (start > lastIndex) {
      parts.push({ text: text.slice(lastIndex, start), highlight: false });
    }
    parts.push({ text: text.slice(start, end + 1), highlight: true });
    lastIndex = end + 1;
  });

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false });
  }

  return parts.map((part, index) => (
    <HighlightText key={`${part.text}-${index}`} $highlight={part.highlight}>
      {part.text}
    </HighlightText>
  ));
}

function SearchSuggestions({
  open,
  suggestions,
  activeIndex,
  onHover,
  onSelect,
  query,
  popularQueries,
  recentSearches,
  onSubmitAll,
}) {
  if (!open) {
    return null;
  }

  const hasResultSuggestions = suggestions.some(
    (item) => item.type === "result"
  );

  const keywordSection =
    query.trim().length === 0
      ? [
          {
            title: "Recent searches",
            data: recentSearches.map((term) => ({ term, type: "recent" })),
          },
          {
            title: "Popular on DMUN",
            data: popularQueries.map((term) => ({ term, type: "popular" })),
          },
        ]
      : [];

  return (
    <Dropdown $open={open} role="listbox" aria-label="Search suggestions">
      {hasResultSuggestions && (
        <>
          <SectionTitle>Top results</SectionTitle>
          {suggestions
            .filter((item) => item.type === "result")
            .map((item, index) => (
              <Item
                key={item.id}
                type="button"
                onMouseEnter={() => onHover(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(item)}
                $active={index === activeIndex}
              >
                <ItemTitle>
                  {renderHighlightedText(item.title, item.titleMatches)}
                </ItemTitle>
                <ItemMeta>
                  {item.category} · {item.path}
                </ItemMeta>
              </Item>
            ))}
        </>
      )}

      {keywordSection.length > 0 &&
        keywordSection.map(
          (section) =>
            section.data.length > 0 && (
              <div key={section.title}>
                <SectionTitle>{section.title}</SectionTitle>
                <div>
                  {section.data.map(({ term, type }) => (
                    <Keyword
                      key={`${type}-${term}`}
                      onClick={() => onSelect({ label: term, type })}
                    >
                      {term}
                    </Keyword>
                  ))}
                </div>
              </div>
            )
        )}

      {!hasResultSuggestions && query.trim().length > 0 && (
        <EmptyState>
          No instant matches yet. Press enter to see full results.
        </EmptyState>
      )}

      <Footer>
        <span>Press Enter for full search</span>
        <FooterLink type="button" onClick={onSubmitAll}>
          See all results
        </FooterLink>
      </Footer>
    </Dropdown>
  );
}

export default SearchSuggestions;
