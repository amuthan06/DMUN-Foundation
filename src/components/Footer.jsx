import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const DARK_BLUE = "#002147";
const ACCENT = "var(--andover-accent)";

const FooterBar = styled.footer`
  background: var(--andover-blue);
  color: ${DARK_BLUE};
  font-family: var(--andover-font-serif);
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const DecorativeGlow = styled.div`
  position: absolute;
  inset: -40% -30% auto -30%;
  height: 420px;
  background: radial-gradient(
    circle at top,
    rgba(255, 255, 255, 0.18),
    rgba(255, 255, 255, 0) 60%
  );
  pointer-events: none;
`;

const FooterContent = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(2.4rem, 4vw, 3.2rem) 4vw clamp(2rem, 3vw, 2.6rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1.8rem, 3vw, 2.6rem);
`;

const CTASection = styled(motion.section)`
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 18px;
  padding: clamp(1.2rem, 2.4vw, 2rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(1.2rem, 2.2vw, 2.4rem);
  flex-wrap: wrap;
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const CTAHeading = styled.h3`
  font-size: clamp(1.8rem, 2.6vw, 2.4rem);
  font-style: italic;
  color: ${DARK_BLUE};
  margin: 0;
  line-height: 1.2;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: clamp(0.6rem, 1.6vw, 1.1rem);
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.a`
  border-radius: 40px;
  padding: 0.7rem 2.1rem;
  border: 2px solid ${DARK_BLUE};
  color: ${DARK_BLUE};
  font-family: var(--andover-font-serif);
  font-size: 1rem;
  letter-spacing: 0.01em;
  background: rgba(255, 255, 255, 0.08);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-3px);
    background: ${DARK_BLUE};
    color: var(--andover-blue);
  }

  &:focus-visible {
    outline: 3px solid ${DARK_BLUE};
    outline-offset: 3px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.25);
  margin: 0;
`;

const FooterGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1.05fr repeat(3, minmax(150px, 0.95fr)) 1.7fr;
  column-gap: clamp(0.75rem, 1.6vw, 1.4rem);
  row-gap: clamp(0.75rem, 1.8vw, 1.1rem);
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(180px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 230px;

  @media (max-width: 768px) {
    margin: 0 auto;
    align-items: center;
    max-width: none;
  }
`;

const FooterLogo = styled.img`
  width: 88px;
  height: 88px;
  object-fit: contain;
`;

const BrandBody = styled.div`
  font-size: 0.98rem;
  font-family: var(--andover-font-sans);
  color: ${DARK_BLUE};
  line-height: 1.5;
  letter-spacing: 0.01em;

  strong {
    display: block;
    font-family: var(--andover-font-serif);
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.35rem;
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialIcon = styled.a`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.24);
  }

  &:focus-visible {
    outline: 2px solid ${DARK_BLUE};
    outline-offset: 3px;
  }

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
`;

const LinkColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const ColumnTitle = styled.h4`
  margin: 0 0 0.15rem 0;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const linkStyles = css`
  color: ${DARK_BLUE};
  font-size: 0.95rem;
  font-family: var(--andover-font-sans);
  line-height: 1.6;
  text-decoration: none;
  position: relative;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: ${DARK_BLUE};
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 2px solid ${DARK_BLUE};
    outline-offset: 3px;
  }
`;

const FooterRouterLink = styled(Link)`
  ${linkStyles}
`;

const FooterAnchor = styled.a`
  ${linkStyles}
`;

const ContactColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 340px;

  @media (max-width: 768px) {
    max-width: none;
    align-items: center;
  }
`;

const ContactList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-family: var(--andover-font-sans);
  font-size: 0.95rem;
  line-height: 1.4;

  li strong {
    display: block;
    font-family: var(--andover-font-serif);
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.2rem;
  }
`;

const BottomBar = styled.div`
  background: rgba(255, 255, 255, 0.18);
  padding: 1.2rem 5vw;
`;

const BottomInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CopyrightText = styled.p`
  margin: 0;
  font-family: var(--andover-font-sans);
  font-size: 0.92rem;
  color: ${ACCENT};
`;

const navGroups = [
  {
    title: "Explore DMUN",
    links: [
      { label: "About", to: "/about", type: "internal" },
      { label: "Programs", to: "/programs", type: "internal" },
      { label: "Advocacy", to: "/advocacy", type: "internal" },
      { label: "Research", to: "/research", type: "internal" },
      { label: "Integrity", to: "/integrity", type: "internal" },
      { label: "Newsroom", to: "/newsroom", type: "internal" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Take Action", to: "/take-action", type: "internal" },
      { label: "Partner With Us", to: "/partner", type: "internal" },
      { label: "Volunteer", to: "/volunteer", type: "internal" },
      { label: "Donate", to: "/donate", type: "internal" },
      { label: "Membership", to: "/Membership", type: "internal" },
      { label: "Publications", to: "/Publications", type: "internal" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Donor Relations", to: "/donor-relations", type: "internal" },
      { label: "Mandate", to: "/mandate", type: "internal" },
      { label: "Test Page", to: "/test", type: "internal" },
      {
        label: "Privacy Policy",
        to: "https://docs.google.com/document/d/1QTCCh-nEZfUvIFdN0KzOfbDRWMk05jKL6IOv9okRB5c/edit?usp=sharing",
        type: "external",
      },
      {
        label: "Terms of Use",
        to: "https://docs.google.com/document/d/1QTCCh-nEZfUvIFdN0KzOfbDRWMk05jKL6IOv9okRB5c/edit?usp=sharing",
        type: "external",
      },
    ],
  },
];

const contactItems = [
  {
    label: "Secretariat of the DMUN Foundation",
    value: "4th Floor, 12 Gangnamdaero 156-gil, Seoul, Republic of Korea 06035",
  },
  {
    label: "Liaison Office in the Americas",
    value: "Unit 1814, 50 Causeway St., Boston, MA, USA 02114",
  },
  {
    label: "General Enquiries",
    value: "enquiries@dmun.org",
  },
  {
    label: "Liaison Office",
    value: "+1 (339) 927 8826",
  },
  {
    label: "Secretariat",
    value: "+82 10 5696 8302",
  },
];

const Footer = () => (
  <FooterBar>
    <DecorativeGlow />
    <FooterContent>
      <CTASection
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <CTAHeading>Take Action.</CTAHeading>
        <ActionButtons>
          <ActionButton href="https://mymun.com">REGISTER</ActionButton>
          <ActionButton href="/volunteer">VOLUNTEER</ActionButton>
          <ActionButton href="/donate">GIVE</ActionButton>
        </ActionButtons>
      </CTASection>

      <Divider />

      <FooterGrid
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        viewport={{ once: true, amount: 0.25 }}
      >
        <BrandBlock>
          <FooterLogo src="/dmun-white-logo.png" alt="DMUN Foundation logo" />
          <BrandBody>
            <strong>DMUN Foundation</strong>
            Representing youth, building leaders, and amplifying global voices
            through education, advocacy, and impact-driven programs.
          </BrandBody>
          <SocialRow>
            <SocialIcon
              href="https://www.instagram.com/discovermun/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img src="/instagram-icon.png" alt="" />
            </SocialIcon>
            <SocialIcon
              href="https://www.linkedin.com/company/dmun-foundation/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <img src="/linkedin-icon.png" alt="" />
            </SocialIcon>
            <SocialIcon
              href="https://www.youtube.com/@dmunfoundation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <img src="/Youtube-icon.png" alt="" />
            </SocialIcon>
          </SocialRow>
        </BrandBlock>

        {navGroups.map((group) => (
          <LinkColumn key={group.title}>
            <ColumnTitle>{group.title}</ColumnTitle>
            {group.links.map(({ label, to, type }) =>
              type === "internal" ? (
                <FooterRouterLink key={label} to={to}>
                  {label}
                </FooterRouterLink>
              ) : (
                <FooterAnchor
                  key={label}
                  href={to}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                </FooterAnchor>
              )
            )}
          </LinkColumn>
        ))}

        <ContactColumn>
          <ColumnTitle>Contact</ColumnTitle>
          <ContactList>
            {contactItems.map(({ label, value }) => (
              <li key={label}>
                <strong>{label}</strong>
                {value}
              </li>
            ))}
          </ContactList>
        </ContactColumn>
      </FooterGrid>
    </FooterContent>

    <BottomBar>
      <BottomInner>
        <CopyrightText>
          © 2025 DMUN Foundation, All Rights Reserved.
        </CopyrightText>
      </BottomInner>
    </BottomBar>
  </FooterBar>
);

export default Footer;
