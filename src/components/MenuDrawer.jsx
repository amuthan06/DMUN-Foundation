import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import React, { useMemo, useEffect } from "react";

const slideIn = keyframes`
  from { transform: translateX(12%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const DARK_BLUE = "#002147";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: ${({ open }) => (open ? "flex" : "none")};
  background: rgba(0, 19, 42, 0.3);
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.18s ease;
  justify-content: flex-end;
`;

const Drawer = styled.aside`
  width: clamp(280px, 30vw, 420px);
  max-width: 480px;
  height: 100vh;
  background: var(--andover-accent);
  color: ${DARK_BLUE};
  display: flex;
  flex-direction: column;
  box-shadow: 18px 0 40px rgba(0, 0, 0, 0.12);
  animation: ${slideIn} 0.26s cubic-bezier(0.4, 0, 0.2, 1);
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.6rem clamp(1.6rem, 4vw, 2.2rem) 1.1rem;
`;

const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BrandTitle = styled.h2`
  margin: 0;
  font-size: 1.32rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
`;

const BrandSubtitle = styled.p`
  margin: 0;
  font-family: var(--andover-font-sans);
  font-size: 0.85rem;
  line-height: 1.45;
`;

const CloseButton = styled.button`
  border: none;
  background: rgba(0, 33, 71, 0.08);
  color: ${DARK_BLUE};
  border-radius: 999px;
  padding: 0.4rem 0.85rem;
  font-size: 0.88rem;
  font-family: var(--andover-font-sans);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(0, 33, 71, 0.16);
    transform: translateY(-2px);
  }
`;

const CloseIcon = styled.span`
  font-size: 1rem;
  line-height: 1;
`;

const DrawerBody = styled.div`
  flex: 1;
  padding: 0 clamp(1.6rem, 3.6vw, 2.3rem) clamp(1.8rem, 3.2vw, 2.1rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1.35rem, 2.6vw, 2rem);
  overflow-y: auto;
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

const SectionHeading = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  font-weight: 700;
  text-transform: uppercase;
`;

const LinkList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const NavLink = styled(Link)`
  font-family: var(--andover-font-serif);
  font-size: 1.1rem;
  color: ${DARK_BLUE};
  text-decoration: none;
  line-height: 1.3;
  transition: transform 0.18s ease, color 0.18s ease;

  &:hover {
    transform: translateX(4px);
    color: ${DARK_BLUE};
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(0, 33, 71, 0.08);
`;

const ContactBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  font-family: var(--andover-font-sans);
  font-size: 0.8rem;
  line-height: 1.45;
`;

const ContactLabel = styled.span`
  font-family: var(--andover-font-serif);
  font-weight: 600;
  letter-spacing: 0.05em;
  font-size: 0.78rem;
  text-transform: uppercase;
`;

const SocialList = styled.div`
  display: flex;
  gap: 0.7rem;
`;

const SocialLink = styled.a`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 33, 71, 0.08);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba(0, 33, 71, 0.18);
  }

  img {
    width: 18px;
    height: 18px;
  }
`;

const menuGroups = [
  {
    title: "Discover DMUN",
    links: [
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Research", to: "/research" },
      { label: "Newsroom", to: "/newsroom" },
      { label: "Publications", to: "/Publications" },
      { label: "Documents Assistant", to: "/documents-assistant" },
      { label: "Executives Login", to: "/executives-login" },
    ],
  },
  {
    title: "Our Work",
    links: [
      { label: "Programs", to: "/programs" },
      { label: "Advocacy", to: "/advocacy" },
      { label: "Take Action", to: "/take-action" },
      { label: "Integrity", to: "/integrity" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Volunteer", to: "/volunteer" },
      { label: "Donate", to: "/donate" },
      { label: "Partner With Us", to: "/partner" },
      { label: "Membership", to: "/Membership" },
      { label: "Donor Relations", to: "/donor-relations" },
    ],
  },
];

const MenuDrawer = ({ open, onClose }) => {
  const handleNavigate = useMemo(
    () => (to) => () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      onClose();
    },
    [onClose]
  );

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  return (
    <Overlay open={open} onClick={onClose}>
      <Drawer onClick={(event) => event.stopPropagation()}>
        <DrawerHeader>
          <BrandBlock>
            <BrandTitle>DMUN Foundation</BrandTitle>
          </BrandBlock>
          <CloseButton onClick={onClose}>
            <CloseIcon>✕</CloseIcon>
          </CloseButton>
        </DrawerHeader>

        <DrawerBody>
          <Divider />

          {menuGroups.map(({ title, links }) => (
            <NavSection key={title}>
              <SectionHeading>{title}</SectionHeading>
              <LinkList>
                {links.map(({ label, to }) => (
                  <NavLink key={label} to={to} onClick={handleNavigate(to)}>
                    {label}
                  </NavLink>
                ))}
              </LinkList>
            </NavSection>
          ))}

          <Divider />

          <ContactBlock>
            <ContactLabel>Global Offices</ContactLabel>
            <span>
              4th Floor, 12 Gangnamdaero 156-gil, Seoul, Republic of Korea 06035
            </span>
            <span>Unit 1814, 50 Causeway St., Boston, MA 02114, USA</span>
            <span>enquiries@dmun.org</span>
            <span>+1 (339) 927 8826 · +82 10 5696 8302</span>
            <SocialList>
              <SocialLink
                href="https://www.instagram.com/discovermun/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <img src="/instagram-icon.png" alt="" />
              </SocialLink>
              <SocialLink
                href="https://www.linkedin.com/company/dmun-foundation/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <img src="/linkedin-icon.png" alt="" />
              </SocialLink>
              <SocialLink
                href="https://www.youtube.com/@dmunfoundation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <img src="/Youtube-icon.png" alt="" />
              </SocialLink>
            </SocialList>
          </ContactBlock>
        </DrawerBody>
      </Drawer>
    </Overlay>
  );
};

export default MenuDrawer;
