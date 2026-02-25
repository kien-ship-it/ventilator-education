# Requirements Document: GAMER-ICU PWA Architecture & Development Plan

## Introduction

GAMER-ICU is a gamified Progressive Web App (PWA) for pediatric ICU Registered Nurses to learn about invasive mechanical ventilation (IMV). The app delivers a 90-day curriculum across 6 themed "islands" on a sci-fi planet, using game mechanics (PEEP Points, streaks, island unlocks) to drive engagement. This document captures the functional and non-functional requirements for the architecture, technology stack, and phased development of the application. The system is built with Next.js on Vercel with Supabase as the backend, following a modular monolith architecture.

## Glossary

- **PWA**: Progressive Web App — a web application installable on mobile devices via "Add to Home Screen"
- **PEEP_Points**: The in-app currency earned by completing activities; named after Positive End-Expiratory Pressure
- **Island**: A themed region on the planet map representing a curriculum module containing 11–16 activities
- **Activity**: A single content unit within an island (video, reading, quiz, clinical case vignette, quest, or vent lab)
- **Streak**: A count of consecutive days a user logs in and engages with content
- **Dashboard**: The main screen showing the planet map, user stats, and navigation
- **Vent_Lab**: An interactive ventilator simulation activity type
- **Quest**: A real-life task validated by a supervisor-provided password
- **Clinical_Case_Vignette**: A scenario-based activity involving medical management decisions and SBAR communication
- **SBAR**: Situation, Background, Assessment, Recommendation — a clinical communication framework
- **Researcher_View**: A hidden administrative interface displaying aggregate user metrics
- **Final_Exam**: An island-level assessment unlocked after 80% activity completion
- **Modular_Monolith**: An architectural pattern where the application is a single deployable unit with clearly separated internal modules
- **Supabase**: An open-source Firebase alternative providing PostgreSQL database, authentication, storage, and real-time capabilities
- **Vercel**: A cloud platform for deploying Next.js applications
- **Content_Shell**: The structural framework of pages and components built before actual educational content is populated

## Requirements

### Requirement 1: User Authentication and Onboarding

**User Story:** As a pediatric ICU RN, I want to create an account and log in securely, so that my progress and PEEP Points are saved across sessions.

#### Acceptance Criteria

1. WHEN a new user visits the app for the first time, THE Authentication_Module SHALL present a registration form requiring name, email, and password
2. WHEN a user submits valid registration credentials, THE Authentication_Module SHALL create a new user account in Supabase Auth and redirect to the onboarding sequence
3. WHEN a registered user submits valid login credentials, THE Authentication_Module SHALL authenticate the user via Supabase Auth and redirect to the Dashboard
4. IF a user submits invalid or incomplete credentials, THEN THE Authentication_Module SHALL display a specific error message indicating the validation failure
5. WHEN a user logs in for the first time after registration, THE Onboarding_Module SHALL display a Star Wars-style scrolling text intro explaining the mission narrative
6. WHEN the scrolling intro completes, THE Onboarding_Module SHALL prompt the user to select an avatar icon (astronaut, rocket, or other themed options)
7. THE Authentication_Module SHALL use Supabase Auth with Row Level Security (RLS) to ensure users can only access their own data

### Requirement 2: Dashboard and Planet Map

**User Story:** As a nurse learner, I want to see a planet map with all 6 islands and my current stats, so that I can navigate the curriculum and track my progress.

#### Acceptance Criteria

1. WHEN an authenticated user navigates to the Dashboard, THE Dashboard SHALL display a planet map showing all 6 islands: Lake Mucosa, Interlobar Divides, Valley of Pulmonara, Bronchial Bluffs, Mount Pneumora, and Alveolar Highlands
2. WHEN the Dashboard loads, THE Dashboard SHALL display the user's username, selected avatar, current streak count, and total PEEP_Points
3. WHILE an island is within its unlock window (Days 0–30 for Islands 1–2, Days 31–60 for Islands 3–4, Days 61–90 for Islands 5–6), THE Dashboard SHALL render that island as active and tappable
4. WHILE an island is outside its unlock window, THE Dashboard SHALL render that island as greyed out and non-interactive
5. WHEN a user taps an active island, THE Dashboard SHALL navigate to that island's activity library
6. WHILE an island has been previously unlocked, THE Dashboard SHALL keep that island accessible even after its initial 30-day window has passed
7. THE Dashboard SHALL display a feedback button that opens an external anonymous Google Form link
8. THE Dashboard SHALL NOT display a global leaderboard

### Requirement 3: Island and Activity Structure

**User Story:** As a nurse learner, I want to access a library of mixed-media activities within each island, so that I can learn through videos, quizzes, readings, simulations, and real-life tasks.

#### Acceptance Criteria

1. WHEN a user enters an island, THE Island_Module SHALL display a list of all activities for that island with their type (Video, Reading, Quiz, Clinical Case Vignette, Quest, Vent Lab), estimated time, and PEEP_Points value
2. WHEN a user selects an activity, THE Content_Interface SHALL load the appropriate content renderer for that activity type and display a progress bar
3. THE Island_Module SHALL support 6 activity types: Video, Reading/Graphic, Quiz, Clinical Case Vignette, Quest, and Vent Lab
4. WHEN a user completes a Video activity, THE Activity_Tracker SHALL mark it complete and award the designated PEEP_Points
5. WHEN a user completes a Reading/Graphic activity, THE Activity_Tracker SHALL present a single confirmation question before marking it complete
6. WHEN a user completes a Quiz activity, THE Activity_Tracker SHALL award PEEP_Points proportional to correct answers
7. WHEN a user engages with a Clinical Case Vignette, THE Content_Interface SHALL present the scenario, allow medical management decisions, and include an SBAR communication component
8. WHEN a user attempts a Quest, THE Quest_Module SHALL prompt for a supervisor-provided password to validate real-life task completion
9. WHEN a user engages with a Vent Lab activity, THE Content_Interface SHALL render an interactive ventilator simulation

### Requirement 4: PEEP Points and Gamification Engine

**User Story:** As a nurse learner, I want to earn PEEP Points for completing activities and maintain streaks, so that I stay motivated throughout the 90-day curriculum.

#### Acceptance Criteria

1. WHEN a user completes an activity for the first time, THE Gamification_Engine SHALL award the designated PEEP_Points for that activity
2. WHEN a user completes an activity they have previously completed, THE Gamification_Engine SHALL allow the user to redo the activity for practice but SHALL NOT award additional PEEP_Points
3. WHEN a user logs in on consecutive days for 7 days, THE Gamification_Engine SHALL award a streak bonus of additional PEEP_Points
4. THE Gamification_Engine SHALL persist the user's current streak count and reset the streak to zero if a day is missed
5. THE Gamification_Engine SHALL calculate and store the total PEEP_Points per user for researcher access

### Requirement 5: Island Unlock and Progression Logic

**User Story:** As a nurse learner, I want islands to unlock on a timed schedule with completion gates, so that the curriculum follows a spaced repetition model over 90 days.

#### Acceptance Criteria

1. WHEN the user's enrollment day count is between 0 and 30, THE Progression_Engine SHALL unlock Islands 1 (Lake Mucosa) and 2 (Interlobar Divides)
2. WHEN the user's enrollment day count is between 31 and 60, THE Progression_Engine SHALL additionally unlock Islands 3 (Valley of Pulmonara) and 4 (Bronchial Bluffs)
3. WHEN the user's enrollment day count is between 61 and 90, THE Progression_Engine SHALL additionally unlock Islands 5 (Mount Pneumora) and 6 (Alveolar Highlands)
4. WHEN a user has completed 80% or more of an island's activities, THE Progression_Engine SHALL unlock the Final Exam for that island
5. IF a user has completed fewer than 80% of an island's activities, THEN THE Progression_Engine SHALL keep the Final Exam locked and display the current completion percentage
6. THE Progression_Engine SHALL implement a binge prevention mechanism that limits the amount of content a user can complete in a single day

### Requirement 6: Quiz Module

**User Story:** As a nurse learner, I want to take quizzes with varied question types and randomized content, so that I can actively test my knowledge.

#### Acceptance Criteria

1. THE Quiz_Module SHALL support 4 question types: Multiple Choice (MCQ), Drag and Drop, Matching, and Fill-in-the-Blank with word bank
2. WHEN a quiz is loaded, THE Quiz_Module SHALL randomize the order of questions and the order of answer options within each question
3. WHEN a user submits a quiz answer, THE Quiz_Module SHALL provide immediate feedback indicating whether the answer is correct or incorrect
4. WHEN a user retakes a quiz, THE Quiz_Module SHALL re-randomize questions and options to prevent memorization of answer positions
5. THE Quiz_Module SHALL store quiz attempts and scores for researcher metrics

### Requirement 7: Content Management and Shell Architecture

**User Story:** As a developer, I want to build a content shell that can be populated with educational content later, so that the app structure is complete before content is finalized.

#### Acceptance Criteria

1. THE Content_Management_System SHALL store all activity content (video URLs, text, quiz questions, case vignettes) in a structured format in Supabase
2. THE Content_Management_System SHALL separate content data from presentation logic so that content can be added, updated, or removed without code changes
3. WHEN a content entry is missing or incomplete, THE Content_Interface SHALL display a placeholder indicating the content is coming soon
4. THE Content_Management_System SHALL support cloud storage for video files via Supabase Storage
5. THE Content_Management_System SHALL define a JSON schema for each activity type to ensure consistent content structure

### Requirement 8: Researcher View

**User Story:** As a researcher, I want to access aggregate user metrics without identifying individual users, so that I can evaluate curriculum effectiveness while maintaining IRB compliance.

#### Acceptance Criteria

1. WHEN a researcher accesses the Researcher View, THE Researcher_Module SHALL display aggregate metrics including total PEEP_Points per user (anonymized), longest streaks, total time spent, and completion rates per island
2. THE Researcher_Module SHALL be accessible only through a hidden route or admin authentication
3. THE Researcher_Module SHALL support data export functionality for offline analysis
4. THE Researcher_Module SHALL NOT display personally identifiable information in the default view

### Requirement 9: PWA and Mobile Experience

**User Story:** As a nurse learner, I want to install the app on my phone and receive push notifications, so that I can access the curriculum conveniently and stay on track.

#### Acceptance Criteria

1. THE PWA_Module SHALL provide a valid Web App Manifest enabling "Add to Home Screen" installation on both Android and iOS devices
2. THE PWA_Module SHALL register a Service Worker that caches critical assets for offline shell loading
3. WHEN the app is installed as a PWA, THE PWA_Module SHALL display a standalone app experience without browser chrome
4. THE PWA_Module SHALL implement push notifications via the Web Push API to send streak reminders and island unlock alerts
5. THE PWA_Module SHALL be responsive and optimized for mobile-first usage on screens 320px and wider

### Requirement 10: Data Privacy and HIPAA Compliance

**User Story:** As a system administrator, I want user data stored in a HIPAA-compliant manner with privacy safeguards, so that the app meets legal and IRB requirements.

#### Acceptance Criteria

1. THE Data_Layer SHALL store all personally identifiable information (PII) in Supabase with Row Level Security (RLS) policies enforced
2. THE Data_Layer SHALL encrypt data at rest and in transit using TLS 1.2 or higher
3. THE Data_Layer SHALL implement an export button allowing researchers to extract anonymized aggregate data
4. THE Feedback_System SHALL route all user feedback through an external anonymous Google Form to maintain IRB compliance
5. THE Data_Layer SHALL log all data access events for audit purposes

### Requirement 11: Modular Monolith Backend Architecture

**User Story:** As a developer, I want the backend organized as a modular monolith with clear module boundaries, so that the codebase is maintainable and can be split into microservices in the future if needed.

#### Acceptance Criteria

1. THE Backend SHALL be organized into distinct modules: Authentication, Content, Gamification, Progression, Quiz, and Analytics
2. WHEN modules communicate, THE Backend SHALL use well-defined internal interfaces rather than direct database access across module boundaries
3. THE Backend SHALL use Next.js API Routes (App Router) as the API layer, with each module owning its own route namespace
4. THE Backend SHALL use Supabase client libraries for database operations, authentication, and file storage within each module
5. WHEN a new module is added, THE Backend SHALL allow integration without modifying existing modules

### Requirement 12: Deployment and Infrastructure

**User Story:** As a developer, I want the app deployed on Vercel with Supabase, so that the infrastructure is scalable, cost-effective, and easy to manage.

#### Acceptance Criteria

1. THE Deployment_Pipeline SHALL deploy the Next.js application to Vercel with automatic preview deployments for pull requests
2. THE Deployment_Pipeline SHALL configure Supabase as the database, authentication, and storage provider
3. THE Deployment_Pipeline SHALL set up environment variables for Supabase keys, API URLs, and push notification credentials securely in Vercel
4. THE Deployment_Pipeline SHALL enable Vercel Analytics for performance monitoring
5. WHEN a developer pushes to the main branch, THE Deployment_Pipeline SHALL trigger an automatic production deployment
