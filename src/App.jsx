import { useState } from "react";
import sourceResume from "./data/resume.json";
import { jsPDF } from "jspdf";

const formatLocation = (location = {}) =>
  [location.city, location.state, location.country].filter(Boolean).join(", ");

const downloadPdf = (data) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (required = 18) => {
    if (y + required > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const addTextBlock = (text, opts = {}) => {
    if (!text) return;
    const { size = 10, bold = false, gap = 14 } = opts;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(text), contentWidth);
    ensureSpace(lines.length * (size + 2) + gap);
    doc.text(lines, margin, y);
    y += lines.length * (size + 2) + gap;
  };

  const addSection = (title) => {
    addTextBlock(title, { size: 12, bold: true, gap: 8 });
    doc.setLineWidth(0.6);
    doc.line(margin, y - 5, pageWidth - margin, y - 5);
    y += 6;
  };

  const addBullet = (text) => addTextBlock(`- ${text}`, { size: 10, gap: 8 });

  const location = [
    data.basics?.location?.city,
    data.basics?.location?.state,
    data.basics?.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  addTextBlock(data.basics?.full_name, { size: 20, bold: true, gap: 8 });
  addTextBlock(`${data.basics?.job_title || ""}${location ? ` | ${location}` : ""}`, {
    size: 11,
    gap: 6,
  });
  addTextBlock(
    `${data.basics?.contacts?.email || ""}${
      data.basics?.contacts?.phone ? ` | ${data.basics.contacts.phone}` : ""
    }`,
    { size: 10, gap: 6 }
  );
  addTextBlock(
    [data.basics?.connect?.linkedin, data.basics?.connect?.github, data.basics?.connect?.portfolio]
      .filter(Boolean)
      .join(" | "),
    { size: 10, gap: 14 }
  );

  if (data.professional_summary) {
    addSection("PROFESSIONAL SUMMARY");
    addTextBlock(data.professional_summary, { size: 10, gap: 10 });
  }

  const skillGroups = Object.entries(data.skills || {}).filter(
    ([key, value]) => key !== "title" && value?.values?.length
  );
  if (skillGroups.length) {
    addSection((data.skills?.title || "Core Skills").toUpperCase());
    skillGroups.forEach(([, group]) => {
      addTextBlock(`${group.title}: ${group.values.join(", ")}`, { size: 10, gap: 8 });
    });
  }

  if (data.work_experience?.length) {
    addSection("WORK EXPERIENCE");
    data.work_experience.forEach((job) => {
      addTextBlock(`${job.job_title} - ${job.company}`, { size: 11, bold: true, gap: 6 });
      addTextBlock(`${job.location} | ${job.start_date} to ${job.end_date} | ${job.employment_type}`, {
        size: 10,
        gap: 6,
      });
      (job.responsibilities || []).forEach((duty) => addBullet(duty));
      if (job.technologies?.length) {
        addTextBlock(`Technologies: ${job.technologies.join(", ")}`, { size: 10, gap: 10 });
      }
    });
  }

  if (data.education?.length) {
    addSection("EDUCATION");
    data.education.forEach((edu) => {
      addTextBlock(`${edu.degree} in ${edu.field_of_study}`, { size: 11, bold: true, gap: 6 });
      addTextBlock(`${edu.institution}`, { size: 10, gap: 6 });
      addTextBlock(`${edu.start_date} to ${edu.end_date}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`, {
        size: 10,
        gap: 8,
      });
    });
  }

  if (data.certifications?.length) {
    addSection("CERTIFICATIONS");
    data.certifications.forEach((cert) => {
      addBullet(
        `${cert.name} - ${cert.issuer} (${cert.level || "N/A"}) | Earned: ${cert.date_earned}${
          cert.expiration_date ? ` | Expires: ${cert.expiration_date}` : ""
        }${cert.credential_id ? ` | ID: ${cert.credential_id}` : ""}`
      );
    });
  }

  if (data.projects?.length) {
    addSection("PROJECTS");
    data.projects.forEach((project) => {
      addTextBlock(project.name, { size: 11, bold: true, gap: 6 });
      addTextBlock(`Role: ${project.role}`, { size: 10, gap: 6 });
      addTextBlock(project.description, { size: 10, gap: 6 });
      if (project.technologies?.length) {
        addTextBlock(`Technologies: ${project.technologies.join(", ")}`, { size: 10, gap: 6 });
      }
      if (project.link) {
        addTextBlock(`Link: ${project.link}`, { size: 10, gap: 8 });
      }
    });
  }

  if (data.awards?.length) {
    addSection("AWARDS");
    data.awards.forEach((award) => addBullet(`${award.title} - ${award.issuer} (${award.date})`));
  }

  if (data.publications?.length) {
    addSection("PUBLICATIONS");
    data.publications.forEach((pub) =>
      addBullet(`${pub.title} - ${pub.publisher} (${pub.date})${pub.link ? ` | ${pub.link}` : ""}`)
    );
  }

  if (data.languages?.length) {
    addSection("LANGUAGES");
    data.languages.forEach((language) => addBullet(`${language.language} - ${language.proficiency}`));
  }

  if (data.keywords?.length) {
    addSection("KEYWORDS");
    addTextBlock(data.keywords.join(", "), { size: 10, gap: 8 });
  }

  doc.save(`${(data.basics?.full_name || "resume").replace(/\s+/g, "-").toLowerCase()}.pdf`);
};

const Section = ({ title, children }) => (
  <section className="section">
    <h2>{title}</h2>
    {children}
  </section>
);

function App() {
  const [resumeData, setResumeData] = useState(sourceResume);
  const [jsonText, setJsonText] = useState(JSON.stringify(sourceResume, null, 2));
  const [editorState, setEditorState] = useState("Edit JSON and click Apply Changes");
  const [editorError, setEditorError] = useState("");

  const applyChanges = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("JSON root must be an object.");
      }
      setResumeData(parsed);
      setJsonText(JSON.stringify(parsed, null, 2));
      setEditorError("");
      setEditorState("Changes applied successfully.");
    } catch (error) {
      setEditorError(error.message || "Invalid JSON format.");
      setEditorState("Fix the JSON error and apply again.");
    }
  };

  const resetToDefault = () => {
    setResumeData(sourceResume);
    setJsonText(JSON.stringify(sourceResume, null, 2));
    setEditorError("");
    setEditorState("Reset to default resume.json content.");
  };

  const skillGroups = Object.entries(resumeData.skills || {}).filter(
    ([key, value]) => key !== "title" && value?.values?.length
  );

  return (
    <div className="page-layout">
      <section className="editor-card" aria-label="Resume JSON editor">
        <div className="editor-head">
          <h2>Interactive JSON Editor</h2>
          <p>Modify values and apply instantly to preview + PDF export.</p>
        </div>
        <textarea
          value={jsonText}
          onChange={(event) => setJsonText(event.target.value)}
          spellCheck={false}
          aria-label="Resume JSON"
        />
        <div className="editor-actions">
          <button type="button" onClick={applyChanges}>
            Apply Changes
          </button>
          <button type="button" className="button-secondary" onClick={resetToDefault}>
            Reset
          </button>
        </div>
        <p className="editor-state">{editorState}</p>
        {editorError ? <p className="editor-error">Error: {editorError}</p> : null}
      </section>

      <main className="container" aria-label="ATS-friendly resume preview">
        <header className="resume-header">
          <div className="header-top">
            <div>
              <h1>{resumeData.basics?.full_name}</h1>
              <p>
                {resumeData.basics?.job_title} | {formatLocation(resumeData.basics?.location)}
              </p>
              <p>
                {resumeData.basics?.contacts?.email} | {resumeData.basics?.contacts?.phone}
              </p>
              <p>
                {resumeData.basics?.connect?.linkedin} | {resumeData.basics?.connect?.github} |{" "}
                {resumeData.basics?.connect?.portfolio}
              </p>
            </div>
            <button type="button" onClick={() => downloadPdf(resumeData)}>
              Download Resume PDF
            </button>
          </div>
        </header>

        {resumeData.professional_summary && (
          <Section title="Professional Summary">
            <p>{resumeData.professional_summary}</p>
          </Section>
        )}

        {skillGroups.length > 0 && (
          <Section title={resumeData.skills?.title || "Core Skills"}>
            {skillGroups.map(([key, value]) => (
              <p key={key}>
                <strong>{value.title}:</strong> {value.values.join(", ")}
              </p>
            ))}
          </Section>
        )}

        {resumeData.work_experience?.length > 0 && (
          <Section title="Work Experience">
            {resumeData.work_experience.map((job) => (
              <article key={`${job.company}-${job.start_date}`} className="item">
                <h3>
                  {job.job_title} - {job.company}
                </h3>
                <p>
                  {job.location} | {job.start_date} to {job.end_date} | {job.employment_type}
                </p>
                <ul>
                  {job.responsibilities?.map((duty) => (
                    <li key={duty}>{duty}</li>
                  ))}
                </ul>
                {job.technologies?.length > 0 && (
                  <p>
                    <strong>Technologies:</strong> {job.technologies.join(", ")}
                  </p>
                )}
              </article>
            ))}
          </Section>
        )}

        {resumeData.education?.length > 0 && (
          <Section title="Education">
            {resumeData.education.map((edu) => (
              <article key={`${edu.institution}-${edu.start_date}`} className="item">
                <h3>
                  {edu.degree} in {edu.field_of_study}
                </h3>
                <p>{edu.institution}</p>
                <p>
                  {edu.start_date} to {edu.end_date}
                  {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                </p>
              </article>
            ))}
          </Section>
        )}

        {resumeData.certifications?.length > 0 && (
          <Section title="Certifications">
            <ul>
              {resumeData.certifications.map((cert) => (
                <li key={cert.credential_id || cert.name}>
                  <strong>{cert.name}</strong> - {cert.issuer} ({cert.level || "N/A"}) | Earned:{" "}
                  {cert.date_earned}
                  {cert.expiration_date ? ` | Expires: ${cert.expiration_date}` : ""}
                  {cert.credential_id ? ` | ID: ${cert.credential_id}` : ""}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {resumeData.projects?.length > 0 && (
          <Section title="Projects">
            {resumeData.projects.map((project) => (
              <article key={project.name} className="item">
                <h3>{project.name}</h3>
                <p>
                  <strong>Role:</strong> {project.role}
                </p>
                <p>{project.description}</p>
                {project.technologies?.length > 0 && (
                  <p>
                    <strong>Technologies:</strong> {project.technologies.join(", ")}
                  </p>
                )}
                {project.link && (
                  <p>
                    <strong>Link:</strong> {project.link}
                  </p>
                )}
              </article>
            ))}
          </Section>
        )}

        {resumeData.awards?.length > 0 && (
          <Section title="Awards">
            <ul>
              {resumeData.awards.map((award) => (
                <li key={`${award.title}-${award.date}`}>
                  <strong>{award.title}</strong> - {award.issuer} ({award.date})
                </li>
              ))}
            </ul>
          </Section>
        )}

        {resumeData.publications?.length > 0 && (
          <Section title="Publications">
            <ul>
              {resumeData.publications.map((pub) => (
                <li key={`${pub.title}-${pub.date}`}>
                  <strong>{pub.title}</strong> - {pub.publisher} ({pub.date})
                  {pub.link ? ` | ${pub.link}` : ""}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {resumeData.languages?.length > 0 && (
          <Section title="Languages">
            <ul>
              {resumeData.languages.map((language) => (
                <li key={language.language}>
                  {language.language} - {language.proficiency}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {resumeData.keywords?.length > 0 && (
          <Section title="Keywords">
            <p>{resumeData.keywords.join(", ")}</p>
          </Section>
        )}
      </main>
    </div>
  );
}

export default App;
