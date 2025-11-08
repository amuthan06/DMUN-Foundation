import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  text-align: center;
  color: var(--andover-dark-blue);
  padding: 4rem 1.5rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 3rem);
  font-family: var(--andover-font-serif);
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Body = styled.p`
  margin: 0;
  max-width: 640px;
  line-height: 1.7;
`;

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 1.6rem;
  background: var(--andover-blue);
  color: #002147;
  border-radius: 999px;
  font-family: var(--andover-font-serif);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(0, 33, 71, 0.2);
  }
`;

function NotFound() {
  return (
    <Wrapper>
      <Title>Page Not Found</Title>
      <Body>
        We couldn’t find the page you were looking for. Try searching the site
        or return to the home page to continue exploring the DMUN Foundation.
      </Body>
      <HomeLink to="/">Back to Home</HomeLink>
    </Wrapper>
  );
}

export default NotFound;
