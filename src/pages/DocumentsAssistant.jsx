import { useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import * as mammoth from "mammoth/mammoth.browser";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const PageWrapper = styled.div`
  background: var(--andover-light-blue);
  min-height: 100vh;
  padding: clamp(2.6rem, 5vw, 4.2rem) clamp(1.5rem, 6vw, 6rem);
  box-sizing: border-box;
  color: var(--andover-dark-blue);
  font-family: var(--andover-font-sans);
`;

const PageHeading = styled.h1`
  font-family: var(--andover-font-serif);
  font-size: clamp(2rem, 3.4vw, 2.45rem);
  margin: 0 0 0.45rem 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Intro = styled.p`
  max-width: 680px;
  line-height: 1.7;
  margin-bottom: 1.4rem;
`;

const UploadArea = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  border: 2px dashed rgba(0, 33, 71, 0.18);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.66);
  padding: 1.4rem;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: rgba(0, 33, 71, 0.4);
    box-shadow: 0 16px 28px rgba(0, 0, 0, 0.08);
  }

  input {
    display: none;
  }
`;

const UploadTitle = styled.span`
  font-family: var(--andover-font-serif);
  font-size: 1.2rem;
  font-weight: 600;
`;

const UploadHint = styled.span`
  font-size: 0.9rem;
  opacity: 0.75;
`;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 18px;
  padding: 1.6rem;
  box-shadow: 0 14px 30px rgba(0, 33, 71, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  letter-spacing: 0.06em;
  font-family: var(--andover-font-serif);
  text-transform: uppercase;
`;

const ScoreBadge = styled.span`
  align-self: flex-start;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(68, 184, 243, 0.2);
  font-family: var(--andover-font-serif);
  font-size: 0.95rem;
  letter-spacing: 0.05em;
`;

const SectionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const SectionItem = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.92rem;
  line-height: 1.45;
`;

const SectionLabel = styled.span`
  font-family: var(--andover-font-serif);
  font-weight: 600;
`;

const SectionStatus = styled.span`
  font-weight: 600;
  color: ${({ ok }) => (ok ? "#1b6b3e" : "#a11229")};
`;

const FeedbackText = styled.div`
  font-size: 0.95rem;
  line-height: 1.65;
  white-space: pre-line;
`;

const Disclaimer = styled.p`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 1.5rem;
`;

const ErrorBanner = styled.div`
  margin-top: 1.5rem;
  border-radius: 14px;
  padding: 1rem 1.3rem;
  background: rgba(161, 18, 41, 0.12);
  color: #8b0f24;
  font-size: 0.95rem;
  border: 1px solid rgba(161, 18, 41, 0.2);
`;

const LoadingText = styled.div`
  margin-top: 1.5rem;
  font-family: var(--andover-font-serif);
  font-size: 1rem;
  letter-spacing: 0.05em;
`;

const scoringTemplate = [
  { key: "format", label: "Format" },
  { key: "content", label: "Content & Uniqueness" },
  { key: "depth", label: "Depth & Relevance" },
  { key: "approach", label: "Overall Approach" },
];

async function readTxt(file) {
  return file.text();
}

async function readPdf(file) {
  const data = await file.arrayBuffer();
  const pdf = await getDocument({ data }).promise;
  let text = "";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    text += `${pageText}\n`;
  }

  return text;
}

async function readDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value;
}

/**
 * ROP heuristics reference
 * ------------------------
 * These rules approximate the DMUN / GDMUN position paper guidance:
 *  - Required metadata lines (COUNTRY, Government, Delegate, Committee, Agenda).
 *  - Core content signals: stance, relevance, past actions, proposed solutions.
 *  - References expectation ≥ 2, with URLs or bibliography entries accepted.
 *  - Word budget of ~500 words, 3-4 paragraphs recommended.
 * Scoring weights (total 25):
 *  - Format: 5 points
 *  - Content & Uniqueness: 10 points
 *  - Depth & Relevance: 5 points
 *  - Overall Approach: 5 points
 * The assistant uses pattern matching and heuristics to keep everything client-side.
 */
const fieldDefinitions = [
  {
    id: "country",
    label: "Country (uppercase)",
    patterns: [
      /^COUNTRY[\s:-]+([A-Z\s]{2,})$/m,
      /^DELEGATION\s+OF\s+([A-Z\s]{2,})$/m,
    ],
    validate: (value) => !!value && value === value.toUpperCase(),
  },
  {
    id: "institution",
    label: "Government / Institution",
    patterns: [
      /^(?:GOVERNMENT|INSTITUTION|MINISTRY|ORGANISATION|ORGANIZATION)[\s:-]+(.+)$/im,
    ],
  },
  {
    id: "delegate",
    label: "Delegate / Representative",
    patterns: [
      /^(?:DELEGATE|REPRESENTATIVE|AUTHOR|SUBMITTED\s+BY)[\s:-]+(.+)$/im,
    ],
    validate: (value) => /,/.test(value) || /\bfrom\b/i.test(value),
  },
  {
    id: "committee",
    label: "Committee",
    patterns: [/^COMMITTEE[\s:-]+(.+)$/im],
  },
  {
    id: "agenda",
    label: "Agenda / Topic",
    patterns: [/^(?:AGENDA|TOPIC|ISSUE)[\s:-]+(.+)$/im],
  },
];

const contentSignals = {
  stance: /\b(support|oppose|firmly|position|stance)\b/i,
  relevance: /\b(relevance|significance|urgency|critical|impact)\b/i,
  pastActions:
    /\b(previously|past|historically|undertaken|has enacted|implemented)\b/i,
  solutions: /\b(propose|recommend|call upon|solution|should|urge)\b/i,
};

function findField(text, definition) {
  for (const pattern of definition.patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const value = match[1].trim();
      const isValid = definition.validate ? definition.validate(value) : true;
      return { present: true, value, isValid };
    }
  }
  return { present: false };
}

function countReferences(text) {
  const referenceSectionMatch = text.match(
    /(?:REFERENCES|BIBLIOGRAPHY|WORKS CITED)([\s\S]+)/i
  );
  if (!referenceSectionMatch) {
    const urls = text.match(/https?:\/\/\S+/gi) || [];
    return { count: urls.length, sources: urls };
  }

  const referencesBlock = referenceSectionMatch[1];
  const lines = referencesBlock
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const references = lines.filter((line) => line.length > 8);
  return { count: references.length, sources: references.slice(0, 5) };
}

function evaluatePositionPaper(rawText) {
  const text = rawText.replace(/\r\n/g, "\n").trim();
  const lines = text.split("\n").map((line) => line.trim());
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter((para) => para.length > 0);
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const uniqueRatio =
    new Set(words.map((w) => w.toLowerCase())).size / Math.max(words.length, 1);

  const fieldResults = fieldDefinitions.map((definition) => {
    const result = findField(text, definition);
    return {
      ...definition,
      ...result,
      ok: result.present && (result.isValid ?? true),
    };
  });

  const missingFieldCount = fieldResults.filter((field) => !field.ok).length;
  const references = countReferences(text);

  const signalHits = Object.entries(contentSignals).reduce(
    (acc, [key, pattern]) => ({ ...acc, [key]: pattern.test(text) }),
    {}
  );

  const hasFlagReference = /\bflag\b/i.test(text);
  const paragraphsWithinLimit =
    paragraphs.length <= 4 && paragraphs.length >= 2;
  const withinWordBudget = wordCount <= 500;

  let formatScore = 5;
  formatScore -= Math.min(missingFieldCount, 4);
  if (!paragraphsWithinLimit) formatScore -= 1;
  if (!withinWordBudget) formatScore -= 1;
  formatScore = Math.max(0, formatScore);

  const contentScore =
    Object.values(signalHits).reduce(
      (score, hit) => score + (hit ? 2.5 : 0),
      0
    ) + (uniqueRatio > 0.6 ? 1 : 0);
  const boundedContentScore = Math.min(10, Math.round(contentScore * 10) / 10);

  let depthScore = 1.5;
  if (references.count >= 2) depthScore += 2;
  if (references.count >= 3) depthScore += 0.5;
  if (signalHits.pastActions) depthScore += 0.5;
  if (signalHits.solutions) depthScore += 0.5;
  depthScore = Math.min(5, Math.round(depthScore * 10) / 10);

  let approachScore = 2;
  if (paragraphsWithinLimit) approachScore += 1;
  if (withinWordBudget) approachScore += 0.5;
  if (signalHits.solutions) approachScore += 0.5;
  if (signalHits.stance && signalHits.relevance) approachScore += 1;
  approachScore = Math.min(5, Math.round(approachScore * 10) / 10);

  const totalScore =
    Math.round(
      (formatScore + boundedContentScore + depthScore + approachScore) * 10
    ) / 10;

  const feedbackParts = [];

  if (missingFieldCount === 0) {
    feedbackParts.push(
      "All required header fields are present and formatted clearly—great job on structure."
    );
  } else {
    feedbackParts.push(
      `Consider adding the missing header details (${fieldResults
        .filter((field) => !field.ok)
        .map((field) => field.label)
        .join(", ")}) to align fully with the ROP template.`
    );
  }

  if (signalHits.stance && signalHits.solutions) {
    feedbackParts.push(
      "Your position and proposed solutions are clearly articulated, offering a cohesive narrative."
    );
  } else {
    feedbackParts.push(
      "Strengthen the stance and actionable recommendations to present a more decisive roadmap."
    );
  }

  if (references.count >= 2) {
    feedbackParts.push(
      "Reference section meets expectations—consider diversifying sources for even stronger credibility."
    );
  } else {
    feedbackParts.push(
      "Add at least two credible references to reinforce research depth and compliance with ROP guidelines."
    );
  }

  if (uniqueRatio > 0.65) {
    feedbackParts.push(
      "The paper reads authentically with a balanced mix of original phrasing—keep maintaining that unique delegate voice."
    );
  } else {
    feedbackParts.push(
      "Originality estimate indicates room to rephrase recurring language to better reflect your delegation's unique outlook."
    );
  }

  return {
    fieldResults,
    references,
    signalHits,
    wordCount,
    paragraphs: paragraphs.length,
    uniqueRatio,
    hasFlagReference,
    scores: {
      format: formatScore,
      content: boundedContentScore,
      depth: depthScore,
      approach: approachScore,
      total: totalScore,
    },
    feedback: feedbackParts.join("\n\n"),
  };
}

const formatExtensions = [".txt", ".pdf", ".docx"];

function DocumentsAssistant() {
  const [analysis, setAnalysis] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    const lowerName = file.name.toLowerCase();
    const supported = formatExtensions.some((ext) => lowerName.endsWith(ext));
    if (!supported) {
      setError(
        "Unsupported file type. Please upload a TXT, PDF, or DOCX position paper."
      );
      setAnalysis(null);
      return;
    }

    setLoading(true);
    setError("");
    setFileName(file.name);

    try {
      let text = "";
      if (lowerName.endsWith(".txt")) {
        text = await readTxt(file);
      } else if (lowerName.endsWith(".pdf")) {
        text = await readPdf(file);
      } else if (lowerName.endsWith(".docx")) {
        text = await readDocx(file);
      }

      if (!text || text.trim().length === 0) {
        throw new Error(
          "The document appears to be empty or could not be parsed."
        );
      }

      const evaluation = evaluatePositionPaper(text);
      setAnalysis(evaluation);
    } catch (err) {
      console.error(err);
      setError(
        "We were unable to read that position paper. Please verify the file and try again."
      );
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const onInputChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const file = event.dataTransfer?.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const scoreBreakdown = useMemo(() => {
    if (!analysis) return [];
    return scoringTemplate.map((item) => ({
      ...item,
      score: analysis.scores[item.key],
    }));
  }, [analysis]);

  return (
    <PageWrapper>
      <PageHeading>Documents Draft Assistant</PageHeading>
      <Intro>
        Upload your position paper to receive a quick compliance and quality
        review based on the GDMUN Rules of Procedure. The assistant checks
        required header sections, structure, research depth, and provides a
        25-point score with guidance for improvement.
      </Intro>

      <UploadArea onDrop={onDrop} onDragOver={onDragOver}>
        <input type="file" accept=".txt,.pdf,.docx" onChange={onInputChange} />
        <UploadTitle>
          Drop your position paper here or click to upload
        </UploadTitle>
        <UploadHint>
          Supported formats: TXT, PDF, DOCX • Max recommended length: 500 words
        </UploadHint>
        {fileName && <UploadHint>Last uploaded: {fileName}</UploadHint>}
      </UploadArea>

      {loading && <LoadingText>Evaluating draft…</LoadingText>}
      {error && <ErrorBanner>{error}</ErrorBanner>}

      {analysis && !loading && (
        <>
          <ResultGrid>
            <Card>
              <CardTitle>Scorecard</CardTitle>
              <ScoreBadge>{analysis.scores.total}/25</ScoreBadge>
              <SectionList>
                {scoreBreakdown.map((item) => (
                  <SectionItem key={item.key}>
                    <SectionLabel>{item.label}</SectionLabel>
                    <span>
                      {item.score}/{item.key === "content" ? 10 : 5}
                    </span>
                  </SectionItem>
                ))}
              </SectionList>
              <SectionItem>
                <SectionLabel>Word Count</SectionLabel>
                <span>
                  {analysis.wordCount} words · {analysis.paragraphs} paragraphs
                </span>
              </SectionItem>
              <SectionItem>
                <SectionLabel>Originality estimate</SectionLabel>
                <span>
                  {Math.round(analysis.uniqueRatio * 100)}% unique phrasing
                </span>
              </SectionItem>
            </Card>

            <Card>
              <CardTitle>Required Sections</CardTitle>
              <SectionList>
                {analysis.fieldResults.map((field) => (
                  <SectionItem key={field.id}>
                    <SectionLabel>{field.label}</SectionLabel>
                    <SectionStatus ok={field.ok}>
                      {field.ok ? "Present" : "Missing"}
                    </SectionStatus>
                  </SectionItem>
                ))}
                <SectionItem>
                  <SectionLabel>Flag image</SectionLabel>
                  <SectionStatus ok={analysis.hasFlagReference}>
                    {analysis.hasFlagReference
                      ? "Mentioned"
                      : "Not detected (optional)"}
                  </SectionStatus>
                </SectionItem>
                <SectionItem>
                  <SectionLabel>References</SectionLabel>
                  <span>
                    {analysis.references.count >= 2
                      ? `${analysis.references.count} sources`
                      : "Add ≥ 2 sources"}
                  </span>
                </SectionItem>
              </SectionList>
            </Card>

            <Card>
              <CardTitle>Key Signals</CardTitle>
              <SectionList>
                <SectionItem>
                  <SectionLabel>Clear stance</SectionLabel>
                  <SectionStatus ok={analysis.signalHits.stance}>
                    {analysis.signalHits.stance ? "Found" : "Needs clarity"}
                  </SectionStatus>
                </SectionItem>
                <SectionItem>
                  <SectionLabel>Agenda relevance</SectionLabel>
                  <SectionStatus ok={analysis.signalHits.relevance}>
                    {analysis.signalHits.relevance
                      ? "Found"
                      : "Strengthen context"}
                  </SectionStatus>
                </SectionItem>
                <SectionItem>
                  <SectionLabel>Past actions</SectionLabel>
                  <SectionStatus ok={analysis.signalHits.pastActions}>
                    {analysis.signalHits.pastActions
                      ? "Referenced"
                      : "Add historical work"}
                  </SectionStatus>
                </SectionItem>
                <SectionItem>
                  <SectionLabel>Proposed solutions</SectionLabel>
                  <SectionStatus ok={analysis.signalHits.solutions}>
                    {analysis.signalHits.solutions
                      ? "Outlined"
                      : "Expand solutions"}
                  </SectionStatus>
                </SectionItem>
              </SectionList>
            </Card>

            <Card>
              <CardTitle>Feedback</CardTitle>
              <FeedbackText>{analysis.feedback}</FeedbackText>
            </Card>
          </ResultGrid>

          <Disclaimer>
            Originality estimates are heuristic only and not a substitute for
            formal plagiarism checks. This assistant works client-side—no
            documents are uploaded or stored.
          </Disclaimer>
        </>
      )}
    </PageWrapper>
  );
}

export default DocumentsAssistant;
