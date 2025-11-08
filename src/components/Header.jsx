import styled from "styled-components";
import { Link } from "react-router-dom";
import React from "react";
import SearchBar from "./search/SearchBar";
import { useRuleContext } from "../context/RuleContext";

const DARK_BLUE = "#002147";
const ABBOT_BLUE = "#44b8f3";

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="butt"
    strokeLinejoin="miter"
  >
    <polyline points="2 2 12 12 22 2"></polyline>
  </svg>
);

const MenuGlyph = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    style={{ verticalAlign: "middle" }}
  >
    <line x1="3" y1="8" x2="21" y2="8" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="16" x2="21" y2="16" />
  </svg>
);

const HeaderBar = styled.header`
  background: ${ABBOT_BLUE};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  left: 0;
  right: 0;
  position: fixed;
  top: 0;
  padding: 0 3vw;
  height: 70px;
  margin: 0;
  box-sizing: border-box;
  z-index: 9999 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, color 0.3s ease;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  height: 100%;
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
  object-fit: contain;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  margin-left: auto;
  margin-right: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  font-size: 1rem;
  font-family: var(--andover-font-sans);
  font-weight: 500;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: inherit;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const PersonaSelect = styled.select`
  border: 1px solid rgba(0, 33, 71, 0.2);
  background: rgba(255, 255, 255, 0.95);
  color: #002147;
  font-size: 0.85rem;
  font-family: var(--andover-font-sans);
  border-radius: 999px;
  padding: 0.3rem 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #ffffff;
  }

  &:focus-visible {
    outline: 3px solid rgba(68, 184, 243, 0.4);
    outline-offset: 2px;
  }

  option {
    color: #002147;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const PersonaLabel = styled.span`
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
  font-family: var(--andover-font-sans);
  color: rgba(255, 255, 255, 0.9);

  @media (max-width: 768px) {
    display: none;
  }
`;

const Header = ({ onMenuClick }) => {
  const { userType, setUserType, userTypes } = useRuleContext();

  return (
    <>
      <HeaderBar>
        <StyledLink to="/">
          <Logo src="/dmun-white-logo.png" alt="DMUN Foundation Logo" />
        </StyledLink>

        <Navigation>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/programs">Programs</NavLink>
          <NavLink to="/advocacy">Advocacy</NavLink>
          <NavLink to="/research">Research</NavLink>
          <NavLink to="/leadership">Leadership</NavLink>
          <NavLink to="/newsroom">Newsroom</NavLink>
        </Navigation>

        <Right>
          <PersonaLabel>Viewing as</PersonaLabel>
          <PersonaSelect
            value={userType}
            onChange={(event) => setUserType(event.target.value)}
            aria-label="Select audience type"
          >
            {userTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </PersonaSelect>
          <SearchBar />
          <NavLink
            as="button"
            onClick={onMenuClick}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <MenuGlyph /> Menu
          </NavLink>
        </Right>
      </HeaderBar>
    </>
  );
};

export default Header;
