import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useRuleContext, USER_TYPE_OPTIONS } from "../context/RuleContext";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--andover-light-blue);
  padding: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 6vw, 6rem);
  color: var(--andover-dark-blue);
  font-family: var(--andover-font-sans);
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vw, 3rem);
`;

const Heading = styled.h1`
  margin: 0;
  font-family: var(--andover-font-serif);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: clamp(2.1rem, 4vw, 2.8rem);
`;

const AccessNotice = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  padding: clamp(2rem, 4vw, 2.8rem);
  box-shadow: 0 18px 36px rgba(0, 33, 71, 0.12);
  line-height: 1.7;
  font-size: 1rem;
`;

const Panel = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  padding: clamp(2rem, 5vw, 3.4rem);
  box-shadow: 0 22px 44px rgba(0, 33, 71, 0.12);
  display: flex;
  flex-direction: column;
  gap: clamp(1.4rem, 2vw, 1.9rem);
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-family: var(--andover-font-serif);
  font-size: clamp(1.35rem, 2.4vw, 1.8rem);
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const FieldGroup = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
`;

const Input = styled.input`
  border: 1px solid rgba(0, 33, 71, 0.2);
  border-radius: 14px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  font-family: var(--andover-font-sans);

  &:focus {
    outline: none;
    border-color: var(--andover-blue);
    box-shadow: 0 0 0 3px rgba(68, 184, 243, 0.28);
  }
`;

const TextArea = styled.textarea`
  border: 1px solid rgba(0, 33, 71, 0.2);
  border-radius: 14px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  font-family: var(--andover-font-sans);
  min-height: 110px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--andover-blue);
    box-shadow: 0 0 0 3px rgba(68, 184, 243, 0.28);
  }
`;

const ControlsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
  justify-content: space-between;
`;

const Select = styled.select`
  border-radius: 18px;
  border: 1px solid rgba(0, 33, 71, 0.15);
  padding: 0.8rem 1.25rem;
  font-size: 0.95rem;
  font-family: var(--andover-font-sans);
  background: #fff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--andover-blue);
    box-shadow: 0 0 0 3px rgba(68, 184, 243, 0.25);
  }
`;

const ButtonBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const Button = styled.button`
  border: none;
  border-radius: 18px;
  padding: 0.85rem 1.8rem;
  font-size: 0.9rem;
  font-family: var(--andover-font-serif);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  background: ${({ variant }) =>
    variant === "ghost"
      ? "rgba(0, 33, 71, 0.08)"
      : variant === "danger"
      ? "rgba(215, 59, 59, 0.15)"
      : "var(--andover-blue)"};
  color: ${({ variant }) =>
    variant === "ghost"
      ? "var(--andover-dark-blue)"
      : variant === "danger"
      ? "#7d1f1f"
      : "#002147"};
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 32px rgba(0, 33, 71, 0.12);
  }
`;

const BannerToggle = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  accent-color: var(--andover-blue);
  width: 18px;
  height: 18px;
`;

const StatusText = styled.span`
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ $type }) =>
    $type === "error"
      ? "#a83232"
      : $type === "success"
      ? "#1e7f4d"
      : "inherit"};
`;

const editableUserTypes = USER_TYPE_OPTIONS.filter(
  (option) => option.value !== "general"
);

const STORAGE_KEYS = {
  currentUser: "dmun_current_user",
};

function getCurrentUserRole() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.currentUser);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.role || null;
  } catch (error) {
    console.warn("Unable to read current user", error);
    return null;
  }
}

const INITIAL_FORM = Object.freeze({
  homeHeroLines: "",
  homeHeroSubtitle: "",
  homePrimaryCtaText: "",
  homePrimaryCtaLink: "",
  homeSecondaryCtaText: "",
  homeSecondaryCtaLink: "",
  homeBannerEnabled: false,
  homeBannerText: "",
  homeBannerLink: "",
  programsHeroTitle: "",
  programsHeroSubtitle: "",
  programsCallout: "",
  programsCtaText: "",
  programsCtaLink: "",
  aboutHeroTitle: "",
  aboutMissionIntro: "",
  aboutMissionSupporting: "",
  aboutImpactTagline: "",
});

function convertContentToForm(content) {
  const home = content.merged("home");
  const programs = content.merged("programs");
  const about = content.merged("about");

  const heroLines = home?.hero?.lines || [];
  const missionIntro = about?.missionIntro || [];

  return {
    homeHeroLines: heroLines.join("\n"),
    homeHeroSubtitle: home?.hero?.subtitle || "",
    homePrimaryCtaText: home?.hero?.primaryCta?.text || "",
    homePrimaryCtaLink: home?.hero?.primaryCta?.link || "",
    homeSecondaryCtaText: home?.hero?.secondaryCta?.text || "",
    homeSecondaryCtaLink: home?.hero?.secondaryCta?.link || "",
    homeBannerEnabled: Boolean(home?.hero?.banner?.enabled),
    homeBannerText: home?.hero?.banner?.text || "",
    homeBannerLink: home?.hero?.banner?.link || "",
    programsHeroTitle: programs?.heroTitle || "",
    programsHeroSubtitle: programs?.heroSubtitle || "",
    programsCallout: programs?.callout || "",
    programsCtaText: programs?.heroCta?.text || "",
    programsCtaLink: programs?.heroCta?.link || "",
    aboutHeroTitle: about?.heroTitle || "",
    aboutMissionIntro: missionIntro[0] || "",
    aboutMissionSupporting: missionIntro.slice(1).join("\n") || "",
    aboutImpactTagline: about?.impactTagline || "",
  };
}

function buildRuleFromForm(form) {
  const heroLines = form.homeHeroLines
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const missionLines = [
    form.aboutMissionIntro.trim(),
    ...form.aboutMissionSupporting
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  ].filter(Boolean);

  const homeHero = {};
  if (heroLines.length) homeHero.lines = heroLines;
  if (form.homeHeroSubtitle.trim())
    homeHero.subtitle = form.homeHeroSubtitle.trim();
  if (form.homePrimaryCtaText.trim()) {
    homeHero.primaryCta = {
      text: form.homePrimaryCtaText.trim(),
      link: form.homePrimaryCtaLink.trim() || "/",
    };
  }
  if (form.homeSecondaryCtaText.trim()) {
    homeHero.secondaryCta = {
      text: form.homeSecondaryCtaText.trim(),
      link: form.homeSecondaryCtaLink.trim() || "/",
    };
  }
  if (form.homeBannerEnabled && form.homeBannerText.trim()) {
    homeHero.banner = {
      enabled: true,
      text: form.homeBannerText.trim(),
      link: form.homeBannerLink.trim() || "/",
    };
  } else if (form.homeBannerEnabled === false) {
    homeHero.banner = { enabled: false };
  }

  const home = Object.keys(homeHero).length ? { hero: homeHero } : {};

  const programsHero = {};
  if (form.programsHeroTitle.trim())
    programsHero.heroTitle = form.programsHeroTitle.trim();
  if (form.programsHeroSubtitle.trim())
    programsHero.heroSubtitle = form.programsHeroSubtitle.trim();
  if (form.programsCallout.trim())
    programsHero.callout = form.programsCallout.trim();
  if (form.programsCtaText.trim()) {
    programsHero.heroCta = {
      text: form.programsCtaText.trim(),
      link: form.programsCtaLink.trim() || "/programs",
    };
  }

  const aboutSection = {};
  if (form.aboutHeroTitle.trim())
    aboutSection.heroTitle = form.aboutHeroTitle.trim();
  if (missionLines.length) aboutSection.missionIntro = missionLines;
  if (form.aboutImpactTagline.trim())
    aboutSection.impactTagline = form.aboutImpactTagline.trim();

  const rules = {};
  if (Object.keys(home).length) rules.home = home;
  if (Object.keys(programsHero).length) rules.programs = programsHero;
  if (Object.keys(aboutSection).length) rules.about = aboutSection;

  return rules;
}

function RuleManagement() {
  const { getRuleSetForUser, saveRuleSet, clearRuleSet } = useRuleContext();
  const [selectedType, setSelectedType] = useState(editableUserTypes[0].value);
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState(null);
  const [role, setRole] = useState(() => getCurrentUserRole());

  useEffect(() => {
    setRole(getCurrentUserRole());
  }, []);

  const isLead = role === "lead";

  const loadForm = useCallback(() => {
    const ruleSet = getRuleSetForUser(selectedType);
    const data = convertContentToForm(ruleSet);
    setForm((prev) => ({ ...prev, ...data }));
  }, [getRuleSetForUser, selectedType]);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    try {
      const payload = buildRuleFromForm(form);
      saveRuleSet(selectedType, payload);
      setStatus({ type: "success", message: "Rule set saved successfully." });
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Unable to save rules right now." });
    }
  };

  const handleReset = () => {
    clearRuleSet(selectedType);
    loadForm();
    setStatus({ type: "success", message: "Custom rules cleared." });
  };

  if (!isLead) {
    return (
      <PageWrapper>
        <Heading>Rule Management</Heading>
        <AccessNotice>
          You need Lead access to configure site-wide personalization rules.
          Please log in via the Executives Portal with a Lead credential and
          return to this page.
        </AccessNotice>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Heading>Rule Management</Heading>
      <Panel as="form" onSubmit={handleSave}>
        <ControlsRow>
          <div>
            <SectionTitle>Audience Rules</SectionTitle>
            <StatusText $type={status?.type}>{status?.message}</StatusText>
          </div>
          <Select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
          >
            {editableUserTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </ControlsRow>

        <SectionTitle as="h3">Home Page</SectionTitle>
        <FieldGroup>
          <Field>
            <Label htmlFor="homeHeroLines">
              Hero Title Lines (one per line)
            </Label>
            <TextArea
              id="homeHeroLines"
              name="homeHeroLines"
              value={form.homeHeroLines}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label htmlFor="homeHeroSubtitle">Hero Subtitle</Label>
            <TextArea
              id="homeHeroSubtitle"
              name="homeHeroSubtitle"
              value={form.homeHeroSubtitle}
              onChange={handleChange}
              rows={4}
            />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <Label htmlFor="homePrimaryCtaText">Primary CTA Text</Label>
            <Input
              id="homePrimaryCtaText"
              name="homePrimaryCtaText"
              value={form.homePrimaryCtaText}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label htmlFor="homePrimaryCtaLink">Primary CTA Link</Label>
            <Input
              id="homePrimaryCtaLink"
              name="homePrimaryCtaLink"
              value={form.homePrimaryCtaLink}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label htmlFor="homeSecondaryCtaText">Secondary CTA Text</Label>
            <Input
              id="homeSecondaryCtaText"
              name="homeSecondaryCtaText"
              value={form.homeSecondaryCtaText}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label htmlFor="homeSecondaryCtaLink">Secondary CTA Link</Label>
            <Input
              id="homeSecondaryCtaLink"
              name="homeSecondaryCtaLink"
              value={form.homeSecondaryCtaLink}
              onChange={handleChange}
            />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <BannerToggle htmlFor="homeBannerEnabled">
            <ToggleInput
              id="homeBannerEnabled"
              type="checkbox"
              name="homeBannerEnabled"
              checked={Boolean(form.homeBannerEnabled)}
              onChange={handleChange}
            />
            Show promotional banner
          </BannerToggle>
          <Field>
            <Label htmlFor="homeBannerText">Banner Message</Label>
            <Input
              id="homeBannerText"
              name="homeBannerText"
              value={form.homeBannerText}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label htmlFor="homeBannerLink">Banner Link</Label>
            <Input
              id="homeBannerLink"
              name="homeBannerLink"
              value={form.homeBannerLink}
              onChange={handleChange}
            />
          </Field>
        </FieldGroup>

        <SectionTitle as="h3">Programs Page</SectionTitle>
        <FieldGroup>
          <Field>
            <Label htmlFor="programsHeroTitle">Hero Title</Label>
            <Input
              id="programsHeroTitle"
              name="programsHeroTitle"
              value={form.programsHeroTitle}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label htmlFor="programsHeroSubtitle">Hero Subtitle</Label>
            <TextArea
              id="programsHeroSubtitle"
              name="programsHeroSubtitle"
              value={form.programsHeroSubtitle}
              onChange={handleChange}
              rows={4}
            />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <Label htmlFor="programsCallout">Callout / Emphasis</Label>
            <TextArea
              id="programsCallout"
              name="programsCallout"
              value={form.programsCallout}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label htmlFor="programsCtaText">CTA Text</Label>
            <Input
              id="programsCtaText"
              name="programsCtaText"
              value={form.programsCtaText}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label htmlFor="programsCtaLink">CTA Link</Label>
            <Input
              id="programsCtaLink"
              name="programsCtaLink"
              value={form.programsCtaLink}
              onChange={handleChange}
            />
          </Field>
        </FieldGroup>

        <SectionTitle as="h3">About Page</SectionTitle>
        <FieldGroup>
          <Field>
            <Label htmlFor="aboutHeroTitle">Hero Title</Label>
            <Input
              id="aboutHeroTitle"
              name="aboutHeroTitle"
              value={form.aboutHeroTitle}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <Label htmlFor="aboutImpactTagline">Impact Tagline</Label>
            <Input
              id="aboutImpactTagline"
              name="aboutImpactTagline"
              value={form.aboutImpactTagline}
              onChange={handleChange}
            />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <Label htmlFor="aboutMissionIntro">Mission Intro</Label>
            <TextArea
              id="aboutMissionIntro"
              name="aboutMissionIntro"
              value={form.aboutMissionIntro}
              onChange={handleChange}
              rows={4}
            />
          </Field>
          <Field>
            <Label htmlFor="aboutMissionSupporting">
              Additional Mission Paragraphs (one per line)
            </Label>
            <TextArea
              id="aboutMissionSupporting"
              name="aboutMissionSupporting"
              value={form.aboutMissionSupporting}
              onChange={handleChange}
              rows={4}
            />
          </Field>
        </FieldGroup>

        <ButtonBar>
          <Button type="submit">Save Rules</Button>
          <Button type="button" variant="ghost" onClick={loadForm}>
            Revert Changes
          </Button>
          <Button type="button" variant="danger" onClick={handleReset}>
            Clear Custom Rules
          </Button>
        </ButtonBar>
      </Panel>
    </PageWrapper>
  );
}

export default RuleManagement;
