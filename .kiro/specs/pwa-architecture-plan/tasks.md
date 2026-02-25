# Implementation Plan: GAMER-ICU PWA Architecture & Development

## Overview

This plan is organized into weekly phases with parallel tracks for two developers:
- **Kien (Developer A):** Backend, architecture, database, deployment, API routes
- **Jenifer (Developer B):** Frontend, UI components, design, media, animations

Tasks are sequenced so both developers can work simultaneously with minimal blocking. The approach is shell-first: build the structural framework before populating educational content.

## Tasks

- [-] 1. Week 1 — Project Setup & Infrastructure
  - [x] 1.1 [Kien] Initialize Next.js 14+ project with App Router, TypeScript, Tailwind CSS, ESLint, and Prettier
    - Run `npx create-next-app@latest` with TypeScript and App Router options
    - Configure `tailwind.config.ts`, `tsconfig.json`, `.eslintrc.json`
    - Set up the directory structure: `src/app/`, `src/modules/`, `src/components/`, `src/lib/`, `src/hooks/`, `src/types/`
    - _Requirements: 11.3, 12.1_

  - [x] 1.2 [Kien] Set up Supabase project and configure database schema
    - Create Supabase project, obtain API keys and connection string
    - Create all 8 database tables: `users`, `islands`, `activities`, `user_progress`, `user_streaks`, `quiz_attempts`, `user_daily_activity`, `push_subscriptions` per the ER diagram in design
    - Write and apply SQL migration files for the schema
    - _Requirements: 12.2, 10.1_

  - [x] 1.3 [Kien] Configure Row Level Security (RLS) policies on all tables
    - Enable RLS on every table
    - Write policies: users read own data, user_progress/user_streaks/quiz_attempts/user_daily_activity scoped to `auth.uid() = user_id`, islands/activities readable by all authenticated users
    - _Requirements: 1.7, 10.1_

  - [x] 1.4 [Kien] Set up Supabase client libraries for browser and server
    - Create `src/lib/supabase/client.ts` (browser client with `createBrowserClient`)
    - Create `src/lib/supabase/server.ts` (server client with `createServerClient`)
    - Create `src/lib/supabase/middleware.ts` (auth middleware for route protection)
    - Configure environment variables in `.env.local`
    - _Requirements: 11.4, 12.3_

  - [x] 1.5 [Kien] Deploy initial app to Vercel and configure CI/CD
    - Connect GitHub repo to Vercel
    - Set environment variables (Supabase keys, API URL) in Vercel dashboard
    - Verify automatic preview deployments on PRs and production deploy on main branch push
    - Enable Vercel Analytics
    - _Requirements: 12.1, 12.3, 12.4, 12.5_

  - [ ] 1.6 [Jenifer] Set up Tailwind theme with sci-fi/space design tokens
    - Define color palette (dark space theme, accent colors for islands), typography, spacing in `tailwind.config.ts`
    - Create shared UI primitives in `src/components/ui/`: Button, Card, Input, Badge, ProgressBar, Toast
    - Install and configure Framer Motion for animations
    - _Requirements: 9.5_

  - [ ] 1.7 [Jenifer] Create mobile-first layout shell and responsive scaffolding
    - Build `src/app/layout.tsx` with mobile-first responsive container
    - Create navigation shell (bottom nav or sidebar for mobile)
    - Ensure layout works on screens 320px and wider
    - _Requirements: 9.5_

- [ ] 2. Week 2 — Authentication & Onboarding
  - [ ] 2.1 [Kien] Implement Auth Module backend service
    - Create `src/modules/auth/types.ts` with User, Session interfaces
    - Create `src/modules/auth/service.ts` with register, login, logout, getCurrentUser, updateAvatar, completeOnboarding functions using Supabase Auth
    - Create `src/app/api/auth/` route handlers for register, login, logout
    - _Requirements: 1.1, 1.2, 1.3, 1.7_

  - [ ]* 2.2 Write property test for credential validation
    - **Property 1: Invalid credentials are rejected with specific errors**
    - **Validates: Requirements 1.4**

  - [ ]* 2.3 Write property test for RLS data isolation
    - **Property 2: RLS data isolation**
    - **Validates: Requirements 1.7**

  - [ ] 2.4 [Jenifer] Build Login and Registration pages
    - Create `src/app/(auth)/login/page.tsx` with email/password form
    - Create `src/app/(auth)/register/page.tsx` with name/email/password form
    - Add client-side validation (required fields, email format, password length)
    - Display specific error messages from API responses
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 2.5 [Jenifer] Build Star Wars scrolling intro component
    - Create `src/components/onboarding/StarWarsIntro.tsx` with Framer Motion
    - Implement scrolling text animation with the mission narrative from GameOutline.md
    - Add skip button and auto-advance on completion
    - _Requirements: 1.5_

  - [ ] 2.6 [Jenifer] Build Avatar Picker and onboarding flow page
    - Create `src/components/onboarding/AvatarPicker.tsx` with themed avatar options (astronaut, rocket, alien, etc.)
    - Create `src/app/(auth)/onboarding/page.tsx` that chains: Star Wars intro → Avatar selection → redirect to Dashboard
    - Wire to auth service `updateAvatar` and `completeOnboarding` endpoints
    - _Requirements: 1.6_

  - [ ] 2.7 [Kien] Implement auth middleware for route protection
    - Configure `src/lib/supabase/middleware.ts` to check auth on `(main)` route group
    - Redirect unauthenticated users to login
    - Redirect authenticated users who haven't completed onboarding to onboarding page
    - _Requirements: 1.3, 1.7_

- [ ] 3. Week 2 Checkpoint
  - Ensure auth flow works end-to-end: register → onboarding → login → dashboard redirect
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Week 3 — Dashboard, Planet Map & Progression Engine
  - [ ] 4.1 [Kien] Implement Progression Module backend service
    - Create `src/modules/progression/types.ts` with IslandStatus, IslandProgress interfaces
    - Create `src/modules/progression/service.ts` with getUnlockedIslands (calculates based on enrollment_date), getIslandProgress, isFinalExamUnlocked, canAccessContent (binge prevention), markActivityComplete
    - Create `src/app/api/progression/` route handlers
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 4.2 Write property test for island unlock logic
    - **Property 4: Island unlock status matches enrollment day**
    - **Validates: Requirements 2.3, 2.4, 2.6, 5.1, 5.2, 5.3**

  - [ ]* 4.3 Write property test for final exam unlock threshold
    - **Property 17: Final exam unlock threshold**
    - **Validates: Requirements 5.4, 5.5**

  - [ ]* 4.4 Write property test for binge prevention
    - **Property 18: Binge prevention cap**
    - **Validates: Requirements 5.6**

  - [ ] 4.5 [Kien] Seed islands table with 6 islands and their unlock schedules
    - Write seed script or Supabase SQL to insert the 6 islands: Lake Mucosa (day 0), Interlobar Divides (day 0), Valley of Pulmonara (day 31), Bronchial Bluffs (day 31), Mount Pneumora (day 61), Alveolar Highlands (day 61)
    - Include sort_order, total_activities counts from curriculum docs
    - _Requirements: 2.1, 5.1, 5.2, 5.3_

  - [ ] 4.6 [Jenifer] Build Planet Map component
    - Create `src/components/map/PlanetMap.tsx` — interactive map with 6 island nodes positioned on a planet surface
    - Create `src/components/map/IslandNode.tsx` — renders active (tappable, colored) or locked (greyed out, non-interactive) based on IslandStatus
    - Add tap/click handler to navigate to island activity library
    - Style with sci-fi/space theme
    - _Requirements: 2.1, 2.3, 2.4, 2.5_

  - [ ] 4.7 [Jenifer] Build Gamification HUD component
    - Create `src/components/gamification/GamificationHUD.tsx` displaying username, avatar, streak counter, and PEEP Points
    - Create `src/components/gamification/StreakBadge.tsx` with flame/streak icon
    - Create `src/components/gamification/PeepPointsDisplay.tsx` with animated counter
    - _Requirements: 2.2_

  - [ ] 4.8 [Jenifer] Build Dashboard page
    - Create `src/app/(main)/dashboard/page.tsx` composing PlanetMap + GamificationHUD + FeedbackButton
    - Fetch island statuses and user stats via API on page load
    - Add feedback button linking to external Google Form
    - Ensure no leaderboard is displayed
    - _Requirements: 2.1, 2.2, 2.7, 2.8_

  - [ ]* 4.9 Write property test for dashboard stats display
    - **Property 3: Dashboard displays all user stats**
    - **Validates: Requirements 2.2**

- [ ] 5. Week 3 Checkpoint
  - Ensure dashboard renders with planet map, HUD, and correct island lock/unlock states
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Week 4 — Content Module & Activity Shell
  - [ ] 6.1 [Kien] Implement Content Module backend service
    - Create `src/modules/content/types.ts` with Activity, all content type interfaces (VideoContent, ReadingContent, QuizContent, CaseContent, QuestContent, VentLabContent)
    - Create `src/modules/content/schemas.ts` with JSON validation schemas for each activity type
    - Create `src/modules/content/service.ts` with getIslandActivities, getActivity, getVideoUrl (signed URL from Supabase Storage)
    - Create `src/app/api/content/` route handlers
    - _Requirements: 7.1, 7.2, 7.4, 7.5_

  - [ ]* 6.2 Write property test for content schema validation
    - **Property 10: Content schema validation**
    - **Validates: Requirements 7.5**

  - [ ]* 6.3 Write property test for activity list completeness
    - **Property 5: Activity list completeness**
    - **Validates: Requirements 3.1**

  - [ ] 6.4 [Kien] Seed activities table with shell data for all ~80 activities
    - Write seed script inserting activity records for all 6 islands based on curriculum docs
    - Use placeholder content JSON (null or minimal) — actual content populated later
    - Include correct type, title, estimated_minutes, peep_points_value, sort_order per curriculum tables
    - _Requirements: 3.1, 7.1_

  - [ ] 6.5 [Jenifer] Build Island Activity Library page
    - Create `src/app/(main)/island/[id]/page.tsx` showing list of activities for the selected island
    - Create `src/components/activities/ActivityCard.tsx` showing type icon, title, time estimate, PEEP points, completion status
    - Add progress bar showing island completion percentage
    - _Requirements: 3.1_

  - [ ] 6.6 [Jenifer] Build Activity page shell with content type router
    - Create `src/app/(main)/activity/[id]/page.tsx` that fetches activity data and routes to the correct renderer component based on activity type
    - Create placeholder renderers for all 6 types in `src/components/activities/`
    - Show "Coming Soon" placeholder for activities with null/incomplete content
    - _Requirements: 3.2, 3.3, 7.3_

  - [ ]* 6.7 Write property test for correct renderer per activity type
    - **Property 6: Correct renderer per activity type**
    - **Validates: Requirements 3.2**

  - [ ]* 6.8 Write property test for missing content placeholder
    - **Property 11: Missing content shows placeholder**
    - **Validates: Requirements 7.3**

- [ ] 7. Week 4 Checkpoint
  - Ensure island library displays activities and activity page routes to correct renderer
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Week 5 — Activity Renderers (Video, Reading, Quest)
  - [ ] 8.1 [Jenifer] Build VideoPlayer component
    - Create `src/components/activities/VideoPlayer.tsx` with HTML5 video player
    - Fetch signed URL from content service
    - Track completion (video watched to end or threshold)
    - Show retry button on load failure
    - _Requirements: 3.4_

  - [ ] 8.2 [Jenifer] Build ReadingView component
    - Create `src/components/activities/ReadingView.tsx` rendering markdown/rich text body
    - Display confirmation question at the end
    - Only mark complete after correct confirmation answer
    - _Requirements: 3.5_

  - [ ]* 8.3 Write property test for reading confirmation requirement
    - **Property 7: Reading activities require confirmation**
    - **Validates: Requirements 3.5**

  - [ ] 8.4 [Jenifer] Build QuestValidator component
    - Create `src/components/activities/QuestValidator.tsx` with instructions display and password input
    - Validate password against stored value via API
    - Show success/failure feedback
    - _Requirements: 3.8_

  - [ ]* 8.5 Write property test for quest password validation
    - **Property 9: Quest password validation**
    - **Validates: Requirements 3.8**

  - [ ] 8.6 [Kien] Implement Gamification Module backend service
    - Create `src/modules/gamification/types.ts` with PointsResult, StreakInfo interfaces
    - Create `src/modules/gamification/service.ts` with awardPoints (idempotent — checks user_progress for existing completion), getStreak, updateStreak (reset if missed day, increment if consecutive, award bonus at 7), getTotalPoints
    - Create `src/app/api/gamification/` route handlers
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 8.7 Write property test for first completion awards points
    - **Property 12: First completion awards points**
    - **Validates: Requirements 4.1**

  - [ ]* 8.8 Write property test for repeat completion idempotency
    - **Property 13: Repeat completion is idempotent for points**
    - **Validates: Requirements 4.2**

  - [ ]* 8.9 Write property test for streak logic
    - **Property 14: Streak bonus at 7 consecutive days**
    - **Validates: Requirements 4.3**

  - [ ]* 8.10 Write property test for streak reset
    - **Property 15: Streak resets on missed day**
    - **Validates: Requirements 4.4**

  - [ ]* 8.11 Write property test for total points invariant
    - **Property 16: Total points invariant**
    - **Validates: Requirements 4.5**

  - [ ] 8.12 [Kien] Wire activity completion to gamification and progression
    - When any activity renderer reports completion, call gamification.awardPoints and progression.markActivityComplete
    - Update streak on each user session/activity
    - Ensure binge prevention check runs before allowing activity start
    - _Requirements: 4.1, 5.6_

- [ ] 9. Week 5 Checkpoint
  - Ensure video, reading, and quest renderers work with gamification point awarding
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Week 6 — Quiz Module
  - [ ] 10.1 [Kien] Implement Quiz Module backend service
    - Create `src/modules/quiz/types.ts` with QuizQuestion, RandomizedQuiz, QuizResult interfaces
    - Create `src/modules/quiz/randomizer.ts` with Fisher-Yates shuffle for questions and options
    - Create `src/modules/quiz/service.ts` with getQuiz (fetches and randomizes), submitAnswer (validates against correctAnswer), submitQuiz (calculates score, awards proportional points, stores attempt)
    - Create `src/app/api/quiz/` route handlers
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 10.2 Write property test for quiz randomization
    - **Property 19: Quiz randomization produces permutations**
    - **Validates: Requirements 6.2**

  - [ ]* 10.3 Write property test for answer feedback correctness
    - **Property 20: Answer feedback correctness**
    - **Validates: Requirements 6.3**

  - [ ]* 10.4 Write property test for quiz attempt persistence
    - **Property 21: Quiz attempt persistence (round-trip)**
    - **Validates: Requirements 6.5**

  - [ ] 10.5 [Jenifer] Build QuizRenderer component with 4 question types
    - Create `src/components/activities/QuizRenderer.tsx` as the main quiz shell (progress, navigation, submit)
    - Create `src/components/activities/quiz/MCQQuestion.tsx` for multiple choice
    - Create `src/components/activities/quiz/DragDropQuestion.tsx` using dnd-kit for drag and drop
    - Create `src/components/activities/quiz/MatchingQuestion.tsx` using dnd-kit for matching pairs
    - Create `src/components/activities/quiz/FillBlankQuestion.tsx` for fill-in-the-blank with word bank
    - Show immediate feedback per question (correct/incorrect)
    - _Requirements: 6.1, 6.3_

  - [ ]* 10.6 Write property test for quiz points proportional to correct answers
    - **Property 8: Quiz points proportional to correct answers**
    - **Validates: Requirements 3.6**

- [ ] 11. Week 6 Checkpoint
  - Ensure all 4 quiz types render and score correctly with randomization
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Week 7 — Clinical Case Vignettes, Vent Lab & Researcher View
  - [ ] 12.1 [Jenifer] Build CaseVignette component
    - Create `src/components/activities/CaseVignette.tsx` with scenario display, decision tree navigation, and SBAR communication input
    - Support branching paths based on user decisions
    - Include text input for SBAR responses
    - _Requirements: 3.7_

  - [ ] 12.2 [Jenifer] Build VentLabSim component
    - Create `src/components/activities/VentLabSim.tsx` with interactive ventilator interface
    - Display ventilator screen with adjustable settings (FiO2, PEEP, rate, etc.)
    - Show patient response values based on settings
    - _Requirements: 3.9_

  - [ ] 12.3 [Kien] Implement Analytics Module backend service
    - Create `src/modules/analytics/types.ts` with AggregateMetrics, UserMetrics interfaces
    - Create `src/modules/analytics/service.ts` with getAggregateMetrics (queries across user_progress, user_streaks, user_daily_activity), getUserMetrics, exportData (CSV/JSON generation with anonymized IDs)
    - Create `src/app/api/analytics/` route handlers with admin-only middleware
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 12.4 Write property test for researcher view access control
    - **Property 22: Researcher view access control**
    - **Validates: Requirements 8.2**

  - [ ]* 12.5 Write property test for no PII in researcher view
    - **Property 23: No PII in researcher default view**
    - **Validates: Requirements 8.4**

  - [ ] 12.6 [Kien] Build Researcher View page
    - Create `src/app/(main)/researcher/page.tsx` with admin auth gate
    - Display aggregate metrics: total PEEP points per anonymized user, longest streaks, total time, completion rates per island
    - Add export button (CSV/JSON download)
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 13. Week 7 Checkpoint
  - Ensure case vignettes, vent lab, and researcher view are functional
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Week 8 — PWA, Push Notifications & Polish
  - [ ] 14.1 [Kien] Configure PWA manifest and service worker
    - Create `src/app/manifest.ts` with app name, icons, theme color, display: standalone
    - Configure service worker using next-pwa or Serwist for asset caching
    - Test "Add to Home Screen" on Android and iOS
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 14.2 [Kien] Implement push notifications
    - Create `src/lib/push-notifications.ts` with Web Push API subscription management
    - Store push subscriptions in `push_subscriptions` table
    - Create Supabase Edge Function (or API route) to send streak reminders and island unlock alerts
    - _Requirements: 9.4_

  - [ ] 14.3 [Kien] Implement data export and audit logging
    - Add export button functionality in researcher view (calls analytics.exportData)
    - Implement audit logging for data access events (Supabase database triggers or middleware logging)
    - _Requirements: 10.3, 10.5_

  - [ ] 14.4 [Jenifer] Polish UI animations and transitions
    - Add Framer Motion page transitions between dashboard → island → activity
    - Add island unlock animation (greyed out → colorful reveal)
    - Add PEEP Points award animation (counter increment, sparkle effect)
    - Add streak milestone celebration animation
    - _Requirements: 2.3_

  - [ ] 14.5 [Jenifer] Ensure mobile responsiveness across all pages
    - Test all pages on 320px, 375px, 414px, and tablet widths
    - Fix any layout issues, ensure touch targets are at least 44x44px
    - Verify PWA standalone mode looks correct
    - _Requirements: 9.3, 9.5_

  - [ ] 14.6 [Jenifer] Configure anonymous feedback integration
    - Add feedback button component linking to Google Form URL (configurable via env var)
    - Place on dashboard and optionally in activity completion screens
    - _Requirements: 2.7, 10.4_

- [ ] 15. Week 8 Checkpoint
  - Ensure PWA installs correctly, push notifications work, and all UI is polished
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Week 9 — Content Population & Final Integration
  - [ ] 16.1 [Kien] Set up Supabase Storage buckets for video files
    - Create storage bucket for videos with appropriate access policies
    - Upload sample/placeholder videos for testing
    - Verify signed URL generation works for video playback
    - _Requirements: 7.4_

  - [ ] 16.2 [Kien + Jenifer] Populate activity content for Island 1 (Lake Mucosa) and Island 2 (Interlobar Divides)
    - Update activities table with real content JSON for all ~27 activities across Islands 1 and 2
    - Upload video files to Supabase Storage
    - Verify each activity type renders correctly with real content
    - _Requirements: 7.1, 3.1_

  - [ ] 16.3 [Kien] Write end-to-end integration test for full user journey
    - Test: register → onboarding → dashboard → enter island → complete activities → earn points → streak tracking → island progress → final exam unlock
    - Verify binge prevention triggers correctly
    - Verify island unlock schedule works with enrollment date
    - _Requirements: All_

  - [ ] 16.4 [Jenifer] Final UI/UX review and accessibility pass
    - Verify color contrast meets WCAG AA for all text
    - Add aria-labels to interactive elements (map islands, quiz options, buttons)
    - Ensure keyboard navigation works for all interactive components
    - Test with screen reader on mobile
    - _Requirements: 9.5_

- [ ] 17. Final Checkpoint — Full Integration
  - Ensure the complete app works end-to-end with real content for Islands 1 and 2
  - Verify deployment on Vercel with Supabase production instance
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP
- Kien and Jenifer can work in parallel within each week — backend APIs are built alongside frontend components
- Content population (Week 9) only covers Islands 1 & 2 initially — remaining islands follow the same pattern
- The shell-first approach means all pages and components exist before real content is added
- Each checkpoint verifies the week's work before moving forward
