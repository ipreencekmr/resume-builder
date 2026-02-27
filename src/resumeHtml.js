const safe = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const listItems = (items = []) => items.map((item) => `<li>${safe(item)}</li>`).join("");

const sectionTitle = (title) => `<h2>${safe(title)}</h2>`;

const skillBlocks = (skills = {}) =>
  Object.entries(skills)
    .filter(([key, value]) => key !== "title" && value?.values?.length)
    .map(
      ([, value]) => `
        <p><strong>${safe(value.title)}:</strong> ${safe(value.values.join(", "))}</p>
      `
    )
    .join("");

const workBlocks = (work = []) =>
  work
    .map(
      (item) => `
      <article>
        <h3>${safe(item.job_title)} - ${safe(item.company)}</h3>
        <p>${safe(item.location)} | ${safe(item.start_date)} to ${safe(item.end_date)} | ${safe(item.employment_type)}</p>
        <ul>${listItems(item.responsibilities)}</ul>
        ${
          item.technologies?.length
            ? `<p><strong>Technologies:</strong> ${safe(item.technologies.join(", "))}</p>`
            : ""
        }
      </article>
    `
    )
    .join("");

const educationBlocks = (education = []) =>
  education
    .map(
      (item) => `
      <article>
        <h3>${safe(item.degree)} in ${safe(item.field_of_study)}</h3>
        <p>${safe(item.institution)}</p>
        <p>${safe(item.start_date)} to ${safe(item.end_date)}${item.gpa ? ` | GPA: ${safe(item.gpa)}` : ""}</p>
      </article>
    `
    )
    .join("");

const certBlocks = (certs = []) =>
  certs
    .map(
      (item) => `
      <li>
        <strong>${safe(item.name)}</strong> - ${safe(item.issuer)} (${safe(item.level || "N/A")}) | Earned: ${safe(item.date_earned)}${item.expiration_date ? ` | Expires: ${safe(item.expiration_date)}` : ""}${item.credential_id ? ` | ID: ${safe(item.credential_id)}` : ""}
      </li>
    `
    )
    .join("");

const projectBlocks = (projects = []) =>
  projects
    .map(
      (item) => `
      <article>
        <h3>${safe(item.name)}</h3>
        <p><strong>Role:</strong> ${safe(item.role)}</p>
        <p>${safe(item.description)}</p>
        ${
          item.technologies?.length
            ? `<p><strong>Technologies:</strong> ${safe(item.technologies.join(", "))}</p>`
            : ""
        }
        ${item.link ? `<p><strong>Link:</strong> ${safe(item.link)}</p>` : ""}
      </article>
    `
    )
    .join("");

const awardBlocks = (awards = []) =>
  awards
    .map((item) => `<li><strong>${safe(item.title)}</strong> - ${safe(item.issuer)} (${safe(item.date)})</li>`)
    .join("");

const publicationBlocks = (publications = []) =>
  publications
    .map(
      (item) => `
      <li>
        <strong>${safe(item.title)}</strong> - ${safe(item.publisher)} (${safe(item.date)})${item.link ? ` | ${safe(item.link)}` : ""}
      </li>
    `
    )
    .join("");

const languageBlocks = (languages = []) =>
  languages.map((item) => `<li>${safe(item.language)} - ${safe(item.proficiency)}</li>`).join("");

export const buildResumeHtml = (resume) => {
  const { basics = {}, professional_summary = "", skills = {} } = resume;
  const location = [basics.location?.city, basics.location?.state, basics.location?.country]
    .filter(Boolean)
    .join(", ");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safe(basics.full_name || "Resume")}</title>
  <style>
    :root { color-scheme: light; }
    body { font-family: Arial, Helvetica, sans-serif; color: #111; margin: 0; background: #fff; }
    main { max-width: 900px; margin: 0 auto; padding: 32px 24px; }
    h1 { margin: 0 0 4px; font-size: 32px; }
    h2 { font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin: 24px 0 10px; text-transform: uppercase; letter-spacing: 0.03em; }
    h3 { margin: 0 0 6px; font-size: 16px; }
    p, li { font-size: 14px; line-height: 1.45; margin: 0 0 8px; }
    ul { margin: 0 0 10px 20px; padding: 0; }
    .meta { margin-bottom: 12px; font-size: 14px; }
    .links { margin-bottom: 8px; }
    article { margin-bottom: 12px; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>${safe(basics.full_name)}</h1>
      <p class="meta">${safe(basics.job_title || "")}${location ? ` | ${safe(location)}` : ""}</p>
      <p class="meta">${safe(basics.contacts?.email || "")}${basics.contacts?.phone ? ` | ${safe(basics.contacts.phone)}` : ""}</p>
      <p class="links">${safe(basics.connect?.linkedin || "")}${basics.connect?.github ? ` | ${safe(basics.connect.github)}` : ""}${basics.connect?.portfolio ? ` | ${safe(basics.connect.portfolio)}` : ""}</p>
    </header>

    ${professional_summary ? `${sectionTitle("Professional Summary")}<p>${safe(professional_summary)}</p>` : ""}
    ${sectionTitle(skills.title || "Core Skills")}
    ${skillBlocks(skills)}
    ${resume.work_experience?.length ? `${sectionTitle("Work Experience")}${workBlocks(resume.work_experience)}` : ""}
    ${resume.education?.length ? `${sectionTitle("Education")}${educationBlocks(resume.education)}` : ""}
    ${resume.certifications?.length ? `${sectionTitle("Certifications")}<ul>${certBlocks(resume.certifications)}</ul>` : ""}
    ${resume.projects?.length ? `${sectionTitle("Projects")}${projectBlocks(resume.projects)}` : ""}
    ${resume.awards?.length ? `${sectionTitle("Awards")}<ul>${awardBlocks(resume.awards)}</ul>` : ""}
    ${resume.publications?.length ? `${sectionTitle("Publications")}<ul>${publicationBlocks(resume.publications)}</ul>` : ""}
    ${resume.languages?.length ? `${sectionTitle("Languages")}<ul>${languageBlocks(resume.languages)}</ul>` : ""}
    ${resume.keywords?.length ? `${sectionTitle("Keywords")}<p>${safe(resume.keywords.join(", "))}</p>` : ""}
  </main>
</body>
</html>`;
};
