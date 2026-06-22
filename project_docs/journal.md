# Project Journal

## Branch: `develop`

### Database Configuration

1. Created `dbConfig.js` and implemented the database connection function.
2. Imported and executed the database connection during application startup.
3. Important learning:
   - `dotenv.config()` must be executed before application initialization.
   - If environment variables are loaded after the app starts, configuration-dependent code may fail unexpectedly.

---

## Branch: `api/models`

### Initial API Infrastructure

1. Created the foundational API structure for the application.
2. Implemented initial Mongoose models.
3. Added validation using the `validator` package for:
   - Email addresses
   - Passwords
   - Profile picture URLs

---

## Branch: `pages/onboarding`

### Frontend Pages

1. Created the onboarding page.
2. Created login and signup pages.

---

## Branch: `api/auth`

### Authentication System

1. Implemented login, signup, and logout APIs.
2. Added password hashing using `bcrypt`.
3. Added JWT-based authentication.
4. Stored authentication tokens in cookies.
5. Created validation logic for incoming authentication data.
6. Generated a secure JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Key Learnings

- Passwords should never be stored in plain text.
- JWTs provide a stateless authentication mechanism.
- Authentication cookies simplify session persistence across page refreshes.

---

## Branch: `pages/profile`

### Evolution Analysis

**Git Diff Summary**

- 208 insertions
- 26 deletions
- 5 files modified

---

### Backend Evolution (`profileRouter.js`)

#### Before

```js
profileRouter.patch("/profile/edit");
```

Route existed as a placeholder and returned a simple string response.

#### After

- Added authentication middleware.
- Added database update logic.
- Added whitelist validation.
- Added structured error handling.
- Returned updated user data.

#### Security Improvement

Whitelist validation prevents unauthorized updates to sensitive fields such as:

- Role
- Admin permissions
- Protected account properties

---

### Frontend Evolution (`Profile.jsx`)

| Area               | Before                      | After                             |
| ------------------ | --------------------------- | --------------------------------- |
| Edit Mode          | Read-only UI                | Editable form state               |
| Save Functionality | Not implemented             | API integration                   |
| User Feedback      | None                        | Sonner notifications              |
| Discard Changes    | Not available               | Rollback functionality            |
| Form Inputs        | Static values               | Controlled components             |
| Code Organization  | Repeated object definitions | `createProfileObject()` helper    |
| State Management   | Single state                | Current + Original state tracking |

---

### Authentication Fix (`Auth.jsx`)

#### Root Cause

Redirect logic executed before the user context had finished updating.

#### Symptom

Incorrect navigation due to stale user data.

#### Fix

Used fresh API response data:

```js
response.data.userInfo;
```

instead of relying on context immediately after:

```js
setUser(...)
```

---

### Code Quality Improvements

1. Extracted reusable helper functions.
2. Reduced duplicated profile initialization logic.
3. Improved state synchronization through `useEffect`.
4. Centralized error handling.
5. Added rollback support through state isolation.

---

## Overall Project Learnings

1. Features often begin as placeholders and evolve through multiple iterations.
2. Security considerations become increasingly important as APIs mature.
3. User experience improves significantly with proper feedback mechanisms.
4. State management complexity grows alongside feature complexity.
5. Repeated patterns are strong indicators that helper functions or abstractions should be introduced.
6. Small architectural decisions early on can prevent major refactors later.

## Branch: `update/profile`

### Backend: Profile Edit API (`profileRouter.js`)

1. Imported the `User` model for database operations.
2. Added missing `verifyAuth` middleware to the `/profile/edit` route.
3. Implemented whitelist validation using an `allowedUpdates` array.
4. Updated user profiles using:

```js
findByIdAndUpdate(id, updates, {
  runValidators: true,
});
```

5. Added proper error handling and JSON responses.
6. Returned the updated user document after successful updates.

### Frontend: Authentication Redirect Bug Fix (`Auth.jsx`)

#### Problem

Navigation occurred before `setUser()` completed, resulting in stale context data during redirects.

#### Solution

Changed:

```js
UserRedirectURL(user);
```

to:

```js
UserRedirectURL(response.data.userInfo);
```

#### Learning

React state updates are asynchronous. Newly updated state should not be relied upon immediately after calling a setter.

---

### Frontend: Profile Page Refactor (`Profile.jsx`)

#### Features Added

1. Integrated Sonner toast notifications.

2. Created `createProfileObject()` helper function to remove duplicate object definitions.

3. Added `originalProfileData` state to track previously saved data.

4. Implemented a **Discard Changes** feature.

5. Added success, error, and loading feedback via toast notifications.

6. Synced:
   - User context
   - Current profile state
   - Original profile state

7. Added a top-center toaster with a 2000ms duration.

#### Key Learnings

- Whitelist filtering is critical for API security.
- State setters are asynchronous.
- Helper functions improve maintainability and reduce duplication.
- Toast notifications provide immediate user feedback.
- Maintaining an "original" copy of data enables rollback and discard functionality.

---

## Branch: `pages/dashboard`

### Dashboard Redesign & UX Improvements

#### UI Modernization

1. Redesigned the dashboard with a cleaner and more modern wellness-focused interface.

2. Improved visual hierarchy using:
   - Gradient hero banners
   - Health stat cards
   - Progress indicators
   - Trend visualizations
   - Better spacing and typography

3. Added responsive layouts for:
   - Desktop
   - Tablet
   - Mobile devices

---

### Dynamic Greeting System

#### Features Added

1. Implemented time-based greetings using:

```js
new Date().getHours();
```

2. Added contextual greetings for:
   - Morning
   - Afternoon
   - Evening
   - Night

3. Introduced randomized wellness-focused messages during late hours to create a more engaging experience.

#### Key Learnings

- Small personalization features significantly improve perceived product quality.
- Dynamic content makes dashboards feel more alive and user-centric.
- Context-aware messaging increases user engagement without adding complexity.

---

## Branch: `pages/done`

### Application Completion & Feature Integration

This branch focused on completing the remaining user-facing pages, integrating backend APIs, and refining the overall user experience.

---

### Dashboard Integration

#### Features Added

1. Connected dashboard metrics to live user data.
2. Added dynamic health summaries.
3. Displayed progress across hydration, nutrition, habits, and wellness metrics.
4. Improved navigation flow between tracking modules.
5. Added reusable dashboard components for future scalability.

#### Key Learnings

- Centralized data fetching improves consistency across pages.
- Clear visual summaries help users understand progress faster.
- Reusable components reduce future maintenance effort.

---

### Hydration Tracking

#### Features Added

1. Built a dedicated hydration tracking page.
2. Added daily water intake monitoring.
3. Implemented quick-add hydration actions.
4. Added hydration goals and progress calculations.
5. Created hydration history and trend visualizations.
6. Integrated hydration APIs for creating, updating, and retrieving daily hydration data.

#### Challenges & Learnings

- Daily tracking systems require careful date handling.
- Consistent date storage prevents duplicate records.
- Historical visualizations improve user motivation and retention.

---

### Nutrition System Planning

#### Features Designed

1. Defined a simplified nutrition workflow centered around the AI Companion.

2. Eliminated the need for manual meal creation inside the Nutrition page.

3. Designed a fixed AI questionnaire based on time of day:
   - Morning
   - Afternoon
   - Evening/Night

4. Planned automatic calculation of:
   - Calories
   - Protein
   - Carbohydrates
   - Fats

5. Designed weekly average nutrition summaries for long-term tracking.

#### Key Learnings

- Collecting nutrition data through guided conversations reduces user friction.
- Structured AI workflows provide more consistent data than free-form input.
- Simplicity often leads to higher user adoption than feature-heavy solutions.

---

### Landing Page & Authentication Redesign

#### Features Added

1. Redesigned the onboarding experience with:
   - Modern gradients
   - Glassmorphism effects
   - Improved CTAs
   - Responsive layouts

2. Redesigned login and signup pages.

3. Improved form structure and visual hierarchy.

4. Fixed browser autofill behavior by using proper autocomplete attributes.

5. Enhanced mobile responsiveness across authentication screens.

#### Key Learnings

- First impressions heavily influence user perception.
- Browser autofill behavior requires deliberate input configuration.
- Modern UI patterns can significantly improve onboarding experience.

---

### Navigation & Layout Improvements

#### Features Added

1. Redesigned sidebar navigation.

2. Improved active-state indicators.

3. Added responsive mobile drawer behavior.

4. Redesigned application header with:
   - Sticky navigation
   - Scroll-based actions
   - Improved branding

5. Standardized spacing, colors, and typography across pages.

#### Key Learnings

- Consistency across layouts improves usability.
- Responsive navigation is critical for mobile accessibility.
- Shared design systems accelerate future development.

---

### Overall Project Learnings

1. Most development effort comes from integration and refinement rather than initial implementation.
2. User experience improves dramatically through small iterative enhancements.
3. Reusable components and helper functions reduce long-term complexity.
4. Data visualization makes health metrics easier to understand.
5. Daily tracking applications require careful handling of dates and user state.
6. Guided workflows are often more effective than complex manual input systems.
7. Consistent UI patterns create a more professional and maintainable application.

## branch -> date/timzone-fix
## Overview

This PR refactors hydration date handling to use a timezone-aware `dayKey` instead of relying on client-generated date values. It also updates the hydration UI to display dates dynamically based on the hydration record.

## Changes

### Added

* Introduced `getDayKey(timezone)` utility to generate a consistent `YYYY/MM/DD` date key using a specified timezone.

### Removed

* Removed local `today` date initialization and normalization from `Hydration.jsx`.
* Removed the `date` field from hydration record creation requests.

### Updated

* Replaced the hardcoded `"Today, 20 May"` label with a dynamic date derived from `hydration.dayKey`.
* Updated the UI to display the correct day information for the current hydration record.

## Benefits

* Ensures consistent date handling across different timezones.
* Eliminates dependency on client-side date calculations.
* Reduces the risk of hydration records being assigned to the wrong day due to timezone differences.
* Makes the hydration date display dynamic and data-driven.
