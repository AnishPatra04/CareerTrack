# CareerTrack Automated Testing & Component Coverage Documentation

This document describes the automated testing framework setup, test cases, and coverage results for the CareerTrack job tracking application.

## 1. Testing Stack & Packages Installed
The testing setup leverages a modern Vite-compatible unit testing stack:
* **Vitest**: Vite-native test runner.
* **jsdom**: Browser simulation environment for React component rendering.
* **React Testing Library**: Component testing helper targeting DOM interactions.
* **@testing-library/jest-dom**: DOM assertion matchers (e.g. `toBeInTheDocument`).
* **@vitest/coverage-v8**: High-performance code coverage provider.

## 2. Configuration Setup
* **[vitest.config.js](file:///c:/Users/patra/OneDrive/Desktop/jb5/vitest.config.js)**: Configures global test settings, jsdom, the test setup file, and sets the components coverage target scope.
* **[src/test/setup.js](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/test/setup.js)**: Configures global DOM assertions, mocks the browser `localStorage` API, and registers mocks for clean REST API interception.
* **[package.json](file:///c:/Users/patra/OneDrive/Desktop/jb5/package.json)**: Added test scripts:
  * `"test": "vitest run"`
  * `"test:coverage": "vitest run --coverage"`

## 3. Test Cases & Coverage Areas
The test suite consists of **10 test suites containing 38 unit tests** covering key component behaviors and UI features:

### 1. [ApplicationFormModal.test.jsx](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/components/__tests__/ApplicationFormModal.test.jsx)
* **Required-field validation**: Verifies Company Name and Job Title display errors on empty submit.
* **Successful Submission**: Verifies filling valid inputs triggers the `onSave` callback with exact structured data.
* **Security validation**: Assures job posting URL input rejects unsafe schemes (e.g. `javascript:` vectors).

### 2. [ApplicationsView.test.jsx](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/components/__tests__/ApplicationsView.test.jsx)
* **Rendering**: Validates grid rows display company names, positions, locations, and status tags.
* **Filtering**: Verifies search query input and status selection dropdown filter table rows dynamically.
* **User Interactions**: Triggers callback actions for viewing details, editing, and confirms the delete dialog.

### 3. [ApplicationDetailsModal.test.jsx](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/components/__tests__/ApplicationDetailsModal.test.jsx)
* **Details Pane**: Assures key details (company, role, location, notes) render correctly.
* **AI Prep tab transition**: Triggers transition to "AI Interview Prep" tab and verifies the idle state.
* **AI Success execution**: Mocks fetch response to return strategic JSON data and asserts the UI displays the summary, likely questions, talking points, and preparation tips.
* **API Failure & Retry**: Verifies API failure response renders error cards and confirms the "Try Again" retry action triggers a new request.

### 4. [DashboardView.test.jsx](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/components/__tests__/DashboardView.test.jsx)
* **Stats calculation**: Validates total count, active pipeline count, interview count, and offer count calculate and render correctly.
* **Empty state**: Renders dashboard empty state message when applications array is empty.
* **Recent applications**: Renders sorted list of recent job applications and handles view details button callback.
* **Upcoming interviews**: Filters and lists scheduled future interview dates.

### 5. [InterviewsView.test.jsx](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/components/__tests__/InterviewsView.test.jsx)
* **Empty state**: Fallback display when no applications have interview dates.
* **Timeline partition**: Correctly splits interviews into upcoming (future/today) and completed (past) lists with corresponding count badges.

### 6. [SettingsView.test.jsx](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/components/__tests__/SettingsView.test.jsx)
* **Form bindings**: Maps initial configuration values to text inputs, dropdowns, and checkboxes.
* **Validation**: Restricts save actions when name is empty or when email is malformed.
* **Instant styling application**: Applies data attributes and classes to HTML document and body instantly.

### 7. [AnalyticsView.test.jsx](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/components/__tests__/AnalyticsView.test.jsx)
* **Empty state**: Displays fallback message when no data exists.
* **Ratios**: Renders total counters and correct calculated interview/offer rate percentages.

### 8. [Sidebar.test.jsx](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/components/__tests__/Sidebar.test.jsx)
* **Initials avatar**: Computes profile initials correctly.
* **Tab transitions**: Triggers tab switching callbacks.

### 9. [Toast.test.jsx](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/components/__tests__/Toast.test.jsx)
* **Timers**: Auto-destroys notifications after duration.
* **Dismiss actions**: Triggers toast removal handlers.

### 10. [EmptyState.test.jsx](file:///c:/Users/patra/OneDrive/Desktop/jb5/src/components/__tests__/EmptyState.test.jsx)
* **Base UI**: Assures titles, description labels, and action CTAs render correctly.

## 4. Coverage Results
Executing `npm run test:coverage` reports the following results:
* **Total Components Tested**: 10 out of 10 components (100% of component files covered).
* **Statement Coverage of src/components/**: **74.82%** (exceeds the 50% capstone requirement, with solid margin above the 60% goal).
* **Line Coverage of src/components/**: **76.57%**.
* **Overall Statement Coverage (all files, including App.jsx)**: **60.23%**.

## 5. How to Run Tests
* Run unit tests: `npm test`
* Run coverage reporting: `npm run test:coverage`
