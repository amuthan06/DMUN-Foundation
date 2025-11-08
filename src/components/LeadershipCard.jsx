import PropTypes from "prop-types";
import styled from "styled-components";
import { motion } from "framer-motion";

const Card = styled(motion.article)`
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(0, 33, 71, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0, 33, 71, 0.08);
  min-height: 100%;
`;

const Photo = styled.div`
  position: relative;
  width: 100%;
  padding-top: 60%;
  background: rgba(68, 184, 243, 0.12);
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  padding: 1.6rem 1.8rem 1.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  flex: 1;
`;

const Name = styled.h3`
  margin: 0;
  font-family: var(--andover-font-serif);
  font-size: 1.4rem;
  letter-spacing: 0.05em;
`;

const Title = styled.p`
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.8;
  line-height: 1.45;
`;

const Bio = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  flex: 1;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.7;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  font-size: 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(0, 33, 71, 0.15);
  text-decoration: none;
  color: var(--andover-dark-blue);
  font-family: var(--andover-font-sans);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(68, 184, 243, 0.6);
    box-shadow: 0 12px 20px rgba(68, 184, 243, 0.15);
  }

  &:focus-visible {
    outline: 3px solid rgba(68, 184, 243, 0.45);
    outline-offset: 2px;
  }
`;

const variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

function LeadershipCard({ leader }) {
  const { name, title, bio, image, linkedin, email, location, department } =
    leader;

  return (
    <Card
      variants={variants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      aria-labelledby={`${name}-label`}
    >
      <Photo>
        <img
          src={image}
          alt={`Portrait of ${name}`}
          onError={(event) => {
            event.target.src = "/dmun-white-logo.png";
          }}
        />
      </Photo>
      <Content>
        <Name id={`${name}-label`}>{name}</Name>
        <Title>
          {title}
          {department ? ` · ${department}` : ""}
        </Title>
        {location && <Meta aria-label="Location">{location}</Meta>}
        <Bio>{bio}</Bio>
        <Actions>
          {linkedin && (
            <ActionButton
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`LinkedIn profile of ${name}`}
            >
              LinkedIn
            </ActionButton>
          )}
          {email && (
            <ActionButton href={`mailto:${email}`} aria-label={`Email ${name}`}>
              Contact
            </ActionButton>
          )}
        </Actions>
      </Content>
    </Card>
  );
}

LeadershipCard.propTypes = {
  leader: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    department: PropTypes.string,
    location: PropTypes.string,
    bio: PropTypes.string.isRequired,
    linkedin: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default LeadershipCard;
