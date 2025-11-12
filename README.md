# CS391-Project
Spark! Bytes — BU Food Event Platform
Overview

Spark! Bytes is a web-based food event platform built for Boston University’s BU Spark! program, designed to connect students with free leftover food events around campus.
Users can log in, sign up, and create food event posts to reduce food waste and promote sustainability through community sharing.

What This Project Accomplishes

Enables students and clubs to post leftover food events (location, time, description).

Lets users browse and discover nearby events in real time.

Provides secure authentication and account management via Supabase.

Implements modern UI components and responsive design using React, Tailwind, and Ant Design.

Tech Stack
Layer	Tools / Technologies	Description
Frontend	React.js, TypeScript, HTML, CSS, JavaScript	Built with React for a fast and dynamic single-page experience.
Styling	Tailwind CSS, Ant Design (Antd API)	Clean, responsive, component-based UI styling and pre-built Ant Design components for modals, forms, and buttons.
Backend / Auth	Supabase (PostgreSQL + Auth)	Used for user authentication (sign up, login, password reset) and secure database management.
API Layer	Supabase Client API	Direct integration with Supabase’s JavaScript API for data read/write and authentication.
Deployment	Next.js (App Router)	Deployed as a server-rendered React app using Next.js’s App Router structure.
Core Features

User Authentication (Supabase Auth):
Secure sign-up, login, and password reset pages styled consistently with the Create Event interface.

Create and Manage Events:
Users can post new events with title, description, and time fields.

Unified UI Experience:
Consistent card-style layout across Login, Signup, and Create Event pages using TailwindCSS.

Dark-Themed Aesthetic:
Inspired by BU Spark! branding, providing a sleek black and teal color palette.

Agile Development Process

We followed a Scrum-inspired Agile process to manage the project lifecycle.

Weekly Sprint Cycle

Each week consisted of:

Sprint Planning: Defined goals and deliverables for the week.

Daily Standups: Quick team syncs to report progress and blockers.

Sprint Review: Demonstrated completed features (e.g., working login UI, Supabase integration).

Retrospective: Discussed what worked well and what to improve in the next sprint.

This process ensured iterative development, continuous feedback, and efficient teamwork throughout the project.

Team Workflow

Version control via GitHub and feature-based branching.

Each feature (Login UI, Create Event form, etc.) developed in short iterations.

Collaborative issue tracking using Agile board tools (e.g., Notion, Trello, or GitHub Projects).

Peer review for pull requests to ensure code quality and consistent style.

Future Enhancements

Event filtering by time, distance, or category.

Integration with Google Maps API for location-based search.

Push notifications for new nearby events.

Analytics dashboard for event engagement and food waste reduction metrics.
