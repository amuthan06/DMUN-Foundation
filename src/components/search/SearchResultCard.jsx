import styled from "styled-components";
import { Link } from "react-router-dom";

const Card = styled.article`
  background: #ffffff;
  border-radius: 20px;
  padding: clamp(0.9rem, 1.9vw, 1.45rem);
  box-shadow: 0 16px 28px rgba(0, 33, 71, 0.07);
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  border: 1px solid rgba(0, 33, 71, 0.05);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
  height: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 24px 48px rgba(0, 33, 71, 0.12);
  }
`;

const TitleLink = styled(Link)`
  font-family: var(--andover-font-serif);
  font-size: clamp(1.05rem, 2.2vw, 1.25rem);
  color: var(--andover-dark-blue);
  text-decoration: none;
  line-height: 1.4;

  &:hover {
    text-decoration: underline;
  }
`;

const Meta = styled.span`
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(0, 33, 71, 0.55);
`;

const Snippet = styled.p`
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.65;
  color: rgba(0, 33, 71, 0.9);
`;

const MatchText = styled.span`
  background: rgba(255, 215, 0, 0.45);
  border-radius: 4px;
`;

const Path = styled.span`
  font-size: 0.75rem;
  color: rgba(0, 33, 71, 0.55);
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

  return parts.map((part, index) =>
    part.highlight ? (
      <MatchText key={`${part.text}-${index}`}>{part.text}</MatchText>
    ) : (
      <span key={`${part.text}-${index}`}>{part.text}</span>
    )
  );
}

function SearchResultCard({ result }) {
  return (
    <Card>
      <Meta>{result.category}</Meta>
      <TitleLink to={result.path}>
        {renderHighlightedText(result.title, result.titleMatches)}
      </TitleLink>
      <Snippet>
        {renderHighlightedText(result.snippet, result.snippetMatches)}
      </Snippet>
      <Path>{result.path}</Path>
    </Card>
  );
}

export default SearchResultCard;
