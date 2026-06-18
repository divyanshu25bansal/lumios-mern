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
   - Elevated stat cards
   - Better spacing and typography
   - Consistent color palette

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