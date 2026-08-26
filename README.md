# CareerTrack — Job Application & Placement Tracking Dashboard

CareerTrack is a professional, production-quality SaaS-style React dashboard designed for students and job seekers to monitor their application pipelines, track upcoming assessments and interviews, evaluate search analytics, and manage settings.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Run
1. Navigate to the project root directory:
   ```bash
   cd c:/Users/patra/OneDrive/Desktop/jb5
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the displayed localhost URL (typically [http://localhost:5173/](http://localhost:5173/)).

### Production Build
To bundle the application for production:
```bash
npm run build
```

### AI Interview Prep Assistant Configuration

The **AI Interview Prep Assistant** is integrated directly into the Job Details modal. It generates personalized interview preparation strategies, typical questions, targeted talking points, and custom tips based on the selected application's metadata (company, title, job type, location, and notes).

- **LLM Provider**: Google Gemini (specifically the `gemini-3.7-flash` model).
- **Environment Variable Name**: `GEMINI_API_KEY`.
- **Security Architecture**: The API key is managed securely on the server-side.
  - In development, Vite's dev server middleware (`configureServer` proxy in `vite.config.js`) intercepts `/api/generate-prep` calls and executes the API requests safely inside the Node process, reading the key from `.env` or `.env.local` to prevent client-side exposure.
  - In production, Vercel routes `/api/generate-prep` requests to the secure node-runtime serverless function in `api/generate-prep.js`, keeping the key isolated.
- **Setup**: Create a `.env` file in the root directory and specify your key:
  ```env
  GEMINI_API_KEY=your_gemini_api_key_here
  ```

---

## AI-Assisted Development & Submission Documentation

### Project Overview
CareerTrack is a standalone front-end single-page application built using React, Vite, JavaScript, and custom Vanilla CSS. It provides a visual and interactive hub for organizing internship, contract, and full-time applications. Key views include:
- **Dashboard**: High-level statistical cards, recent logs, timeline events, and pipeline distributions.
- **Applications Grid**: Responsive table featuring pagination/filtering, search strings, and CRUD options.
- **Interviews Timeline**: Grouped segments separating upcoming chronological rounds and completed feedback.
- **Analytics**: Graphic percentage rings reflecting offer and rejection rates.
- **Settings**: System configurations toggling dark theme, email/name modifications, and compact layouts.

### Prompts Used During Development

#### Prompt 1: Initial Creation Request
> I want you to build a complete, polished React application called "CareerTrack" — a Job Application and Placement Tracking Dashboard.
> 
> This is a standalone AI-assisted development project. The goal is to create a realistic, production-quality React application while using you as my development assistant throughout the implementation.
> 
> [Detailed requirements followed for Technology (React/Vite/JS/CSS, no Tailwind, no TypeScript), Sidebar/Nav Structure, Dashboard calculation, Applications CRUD + Confirmation, Add/Edit modal, Interviews upcoming/completed chronological views, Analytics visualizations, Settings Dark/Light theme + compact mode toggling, LocalStorage persistence, visual design, responsiveness, accessibility, error handling, and component architecture.]

#### Prompt 2: Refinement Request
> The application is already complete. I now need a final refinement pass for the project submission.
> 
> Make ONLY three small, genuine improvements to the existing application. Do not add major features or redesign the application.
> 
> For each improvement:
> 1. Identify a real minor issue or usability/detail problem in the current implementation.
> 2. Explain why it is worth improving.
> 3. Make the change directly in the workspace.
> 4. Clearly record: Improvement number, Problem, File name changed, Exact change made, Why the change improves the application.

---

### AI Assistance Summary
Antigravity (AI assistant) served as a pair programmer to build, refactor, and verify the app:
1. **Implementation & Architecture**: Bootstrapped the modular component layout, separation of concerns between state wrappers (`App.jsx`), and dedicated sub-views (`Sidebar.jsx`, `DashboardView.jsx`, etc.).
2. **UI Design & Theme Styling**: Coded the theme systems using CSS custom properties (light vs dark mode HSL variables) and responsive table columns that wrap into cards via media queries on mobile.
3. **Verification**: Executed a background headless browser verification tour using the subagent to test stats recalculations, searching, and dark mode toggles, producing a recorded walkthrough video.

---

### Manual Improvements

We performed a final review of the AI-generated code and implemented the following three manual refinements to polish the submission:

#### 1. Date Applied Timezone Synchronization
- **File Name**: [src/components/ApplicationFormModal.jsx](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/components/ApplicationFormModal.jsx)
- **Problem**: The default application date utilized UTC parsing (`new Date().toISOString()`), which caused calendar dates to shift depending on the user's geographical timezone (e.g. defaulting to yesterday/tomorrow depending on the time of day).
- **Exact Change**: Replaced UTC date string extraction with a local timezone calendar date calculation (`getLocalDateString`).
- **Benefit**: Ensures default form date coordinates match the user's actual local calendar day.

#### 2. Logical Date Range Validation
- **File Name**: [src/components/ApplicationFormModal.jsx](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/components/ApplicationFormModal.jsx)
- **Problem**: Form inputs did not restrict the interview date value relative to application date, allowing users to enter interview dates scheduled prior to application dates.
- **Exact Change**: Added check `interviewDate < dateApplied` inside the `validateForm` block and linked error formatting to the DOM input fields.
- **Benefit**: Protects chronological integrity, ensuring timeline events don't break logic.

#### 3. Search Box Clear Button
- **File Name**: [src/components/ApplicationsView.jsx](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/components/ApplicationsView.jsx)
- **Problem**: Resetting filtered search queues required users to manually double-click or backspace the search input field.
- **Exact Change**: Rendered an inline SVG 'X' button inside the search input wrapper appearing only when character input exists, linking click handlers to clear the search query.
- **Benefit**: Offers one-click desktop/mobile navigation back to standard unfiltered grids.

---

### Final Build Verification

A compilation check was conducted to bundle all assets:
- **Build Command**: `npm run build`
- **Output**: The compiler completed successfully:
  - **Modules Transformed**: 1,813 modules transformed.
  - **Build Errors**: 0.
  - **Asset Output**: Generated bundled chunks under `dist/assets/` containing index JS and index CSS.
