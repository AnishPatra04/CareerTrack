# CareerTrack Capstone Production Deployment Checklist

This document details the production readiness verification, deployment procedures, safety features, and final sign-off steps for CareerTrack.

## 1. Build Verification
- [ ] Run `npm run lint` — Confirm 0 errors and 0 warnings.
- [ ] Run `npm run build` — Confirm client environment compiles successfully and outputs minified static assets to the `/dist` folder.
- [ ] Confirm no runtime syntax errors exist in built assets.

## 2. Testing
All unit tests and coverage metrics are verified locally:
- **Test Command**: `npm test`
- **Coverage Command**: `npm run test:coverage`
- **Verified Results**:
  - **10 test suites** passed
  - **38 tests** passed
  - **100% component file coverage** (10 out of 10 components covered)
  - **74.82% component statement coverage** (exceeds the 50% threshold)
  - **76.57% component line coverage**
  - **60.23% overall statement coverage** (including `App.jsx`)

- [ ] Run tests and coverage again prior to deployment to verify clean local test run.

## 3. Accessibility
- **Baseline Audit (axe DevTools)**:
  - Identified **7 serious WCAG 2 AA color-contrast violations** caused by muted text (`#94a3b8`) on white backgrounds (`#ffffff`) having a contrast of only 2.56:1 (minimum required is 4.5:1).
- **Remediation**:
  - CSS custom design token `--text-muted` under `:root` in `src/index.css` was changed to Slate 500 (`#64748b`), elevating the contrast ratio to **4.77:1** (complying with WCAG 2 AA).
- **Verification Results**:
  - [ ] axe DevTools re-scan: **0 total issues**
- **Production Lighthouse Audit**:
  - **Performance**: 99
  - **Accessibility**: 100
  - **Best Practices**: 100
  - **SEO**: 91

## 4. AI Integration Resilience
The application interacts with Google Gemini through the server-side proxy `/api/generate-prep` endpoint.
Resilience mechanisms currently in place:
* **Server-side Security**: The API key is stored server-side and never sent to the client browser.
* **Transient Error Retries**: Server-side error detection for transient status codes (429, 500, 502, 503, 504) handles retries gracefully.
* **Request Timeout**: Requests are configured with a strict timeout boundary to avoid hanging connections.
* **Model Fallbacks**: Configured to switch to a secondary fallback Gemini model in the event of primary model failures.
* **UI Error Gracefulness**: Any malformed responses or API failures are gracefully handled by the frontend, rendering a user-friendly error message block with an explicit "Try Again" retry action button.

## 5. Environment Variables
* **Required Variable**: `GEMINI_API_KEY` must be populated with a valid key on the deployment environment.
* **Security constraint**: `.env` is reserved for local environments and must never be committed to Git.
* **Template**: Use [`.env.example`](file:///c:/Users/patra/OneDrive/Desktop/jb5/.env.example) as the template structure.

## 6. Deployment Verification Checklist
- [ ] Confirm production branch build succeeds on deployment platform.
- [ ] Verify production URL resolves and loads.
- [ ] Verify AI Interview Prep notes generation runs successfully in production.
- [ ] Confirm no `GEMINI_API_KEY` is exposed in client-side source maps, dev tools, or network requests.
- [ ] Verify all main placement tracker workflows function correctly (adding, editing, viewing, and deleting applications).
- [ ] Verify error states gracefully render when the endpoint returns non-200.
- [ ] Run a production Lighthouse audit to check accessibility and performance metrics.

## 7. Safe Failure Mechanisms
* **Missing API Key**: Resolves in a clean API response failure handled by the client as a "Preparation Failed" block.
* **Gemini API Errors**: Handled by the endpoint and reported to the client as a descriptive error card.
* **Transient API Failures**: Client shows a friendly explanation state and enables a manual "Try Again" regenerate trigger.
* **Malformed Responses**: Handled safely in parsing logic; defaults to showing a retry state.

## 8. Rollback Plan
If deployment is managed via Vercel or similar Git-integrated platform:
1. Revert to the previous known-good deployment instantaneously using the Vercel dashboard.
2. In case of build failures, redeploy the previous known-good Git commit hash.
3. Validate that the rolled-back deployment returns to active service.

## 9. Monitoring / Operation
* Log checking approach:
  * Check platform-specific deployment logs (e.g., Vercel Function logs) for runtime exceptions and API status trends.
  * Check deployment status alerts and console reports for runtime issues.

## 10. Final Sign-off
* **Status**: Ready for production review
* **Date**: 26 August 2026

- [ ] All 38 tests are passing
- [ ] Linter is clean (0 errors)
- [ ] Build compiles cleanly (0 errors)
- [ ] Color contrast accessibility issues are resolved (0 violations)
- [ ] Local environment files are safe and not committed

**Signature**: ___________________________
