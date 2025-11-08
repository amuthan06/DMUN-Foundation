import { useMemo, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import LeadershipCard from "../components/LeadershipCard";
import { leadershipTeam } from "../data/leadership";

const PageWrapper = styled.div`
  background: var(--andover-light-blue);
  min-height: 100vh;
  padding: clamp(1.8rem, 4vw, 3.5rem) clamp(1.3rem, 5vw, 5rem);
  box-sizing: border-box;
  color: var(--andover-dark-blue);
  font-family: var(--andover-font-sans);
  display: flex;
  flex-direction: column;
  gap: clamp(1.4rem, 2.2vw, 2.3rem);
`;

const IntroSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(0.8rem, 1.8vw, 1.6rem);
  align-items: flex-start;
`;

const IntroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Heading = styled.h1`
  margin: 0;
  font-family: var(--andover-font-serif);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: clamp(1.85rem, 3vw, 2.4rem);
`;

const Mission = styled.p`
  margin: 0;
  font-size: 0.96rem;
  line-height: 1.55;
  max-width: 720px;
`;

const QuoteCard = styled.div`
  background: rgba(68, 184, 243, 0.16);
  border-radius: 24px;
  padding: clamp(0.9rem, 2vw, 1.4rem);
  box-shadow: 0 18px 38px rgba(0, 33, 71, 0.12);
  font-family: var(--andover-font-serif);
  font-size: 0.96rem;
  line-height: 1.55;
  position: relative;
  overflow: hidden;
  color: var(--andover-dark-blue);
`;

const QuoteAttribution = styled.span`
  display: block;
  margin-top: 0.5rem;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const ControlsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-top: -0.3rem;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  border: 1px solid rgba(0, 33, 71, 0.2);
  border-radius: 999px;
  background: ${({ active }) => (active ? "var(--andover-blue)" : "#fff")};
  color: ${({ active }) => (active ? "#002147" : "var(--andover-dark-blue)")};
  font-family: var(--andover-font-serif);
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  padding: 0.55rem 1.2rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 22px rgba(0, 33, 71, 0.12);
  }

  &:focus-visible {
    outline: 3px solid rgba(68, 184, 243, 0.45);
    outline-offset: 3px;
  }
`;

const LeadershipGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 320px));
  justify-content: center;
  gap: clamp(1.4rem, 2.6vw, 2rem);
  align-items: stretch;
`;

const EmptyState = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  font-size: 1rem;
  opacity: 0.8;
`;

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Executive Office", value: "Executive Office" },
  { label: "Board of Trustees", value: "Board of Trustees" },
  { label: "Programs", value: "Programs" },
  { label: "Research", value: "Research" },
  { label: "Advocacy", value: "Advocacy" },
];

const featuredQuote =
  "“Empowering young leaders at DMUN means investing in a future where diplomacy is co-authored by the next generation.”";

const quoteAttribution = "Jaewon Choi · Executive Director";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ExecutiveLeadership() {
  const [activeDepartment, setActiveDepartment] = useState("all");

  const filteredTeam = useMemo(() => {
    if (activeDepartment === "all") return leadershipTeam;
    return leadershipTeam.filter(
      (member) => member.department === activeDepartment
    );
  }, [activeDepartment]);

  return (
    <PageWrapper>
      <IntroSection>
        <IntroText>
          <Heading>Meet Our Leaders</Heading>
          <Mission>
            Meet the dedicated individuals who guide our mission and inspire our
            community.
          </Mission>
        </IntroText>
        <QuoteCard aria-label="Leadership quote">
          {featuredQuote}
          <QuoteAttribution>{quoteAttribution}</QuoteAttribution>
        </QuoteCard>
      </IntroSection>

      <ControlsRow>
        <FilterGroup role="toolbar" aria-label="Filter leaders by department">
          {filterOptions.map((option) => (
            <FilterButton
              key={option.value}
              type="button"
              active={activeDepartment === option.value}
              aria-pressed={activeDepartment === option.value}
              onClick={() => setActiveDepartment(option.value)}
            >
              {option.label}
            </FilterButton>
          ))}
        </FilterGroup>
      </ControlsRow>

      {filteredTeam.length === 0 ? (
        <EmptyState>No team members found for this department yet.</EmptyState>
      ) : (
        <LeadershipGrid
          as={motion.section}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {filteredTeam.map((leader) => (
            <LeadershipCard key={leader.email} leader={leader} />
          ))}
        </LeadershipGrid>
      )}
    </PageWrapper>
  );
}

export default ExecutiveLeadership;
