# Resume Builder

[![Deploy to GitHub Pages](https://github.com/ipreencekmr/resume-builder/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/ipreencekmr/resume-builder/actions/workflows/deploy-pages.yml)
[![Live Site](https://img.shields.io/badge/Live-GitHub%20Pages-2ea44f?logo=github)](https://ipreencekmr.github.io/resume-builder/)
[![Last Commit](https://img.shields.io/github/last-commit/ipreencekmr/resume-builder)](https://github.com/ipreencekmr/resume-builder/commits/main)

A clean, ATS-friendly React resume app that reads structured JSON data and exports a professional PDF in one click.

## Live Website

[https://ipreencekmr.github.io/resume-builder/](https://ipreencekmr.github.io/resume-builder/)

## Why This Project

This project is designed to make resume creation simple, consistent, and deployment-ready:

- JSON-driven resume content (easy to update, version, and reuse)
- ATS-friendly section structure
- One-click PDF export (`jsPDF`)
- Deployed with GitHub Pages + GitHub Actions
- Mobile-friendly and lightweight

## Features

- Structured resume rendering from `src/data/resume.json`
- Top-right **Download Resume PDF** action
- Multi-section support:
  - Basics and contact details
  - Professional summary
  - Core skills (grouped by category)
  - Work experience
  - Education
  - Certifications
  - Projects
  - Awards
  - Publications
  - Languages
  - Keywords
- Automatic GitHub Pages production deployment on push to `main`

## Tech Stack

- React 18
- Vite
- jsPDF
- GitHub Actions (Pages deploy workflow)

## Project Structure

```text
.
├── .github/workflows/deploy-pages.yml
├── src
│   ├── data/resume.json
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   └── resumeHtml.js
├── index.html
├── vite.config.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open the local URL shown in terminal (usually `http://localhost:5173`).

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Customize Your Resume

1. Edit [`src/data/resume.json`](./src/data/resume.json).
2. Keep keys consistent with the current schema sections.
3. Save and refresh the app.
4. Click **Download Resume PDF**.

## Deployment (GitHub Pages)

This repo includes a workflow at:

- `.github/workflows/deploy-pages.yml`

On every push to `main`, GitHub Actions will:

1. Install dependencies
2. Build the app
3. Upload the `dist` artifact
4. Deploy to GitHub Pages

Vite base path is configured in `vite.config.js` for Pages builds.

## Resume Data Example

```json
{
  "basics": {
    "full_name": "Jordan Lee",
    "job_title": "Senior Software Engineer"
  },
  "professional_summary": "Results-driven software engineer...",
  "skills": {
    "title": "Core Skills"
  }
}
```

## Notes

- Keep bullet points impact-focused (metrics, outcomes, scope).
- Keep dates and section naming consistent for ATS parsing.
- Verify final PDF formatting before applying to roles.

## License

This project is open for personal customization and learning.
