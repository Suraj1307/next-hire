# NextHire — Your Path to Career Success

<p align="center">
  <strong>Build better resumes. Match smarter. Apply faster.</strong>
</p>

<p align="center">
  A full-stack career productivity platform that brings resume building, AI-powered career assistance, job discovery, application tracking, reminders, and premium tools into one place.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/API-Express-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-8E75B2" alt="Google Gemini" />
</p>

---

## Overview

**NextHire** is a MERN-stack application designed to help job seekers organize and improve their job-search workflow. Users can create and manage resumes, get AI-assisted feedback, compare a resume with a job description, explore job opportunities, track applications, generate professional emails, and schedule reminders.

The platform also includes a premium membership flow with UPI payment submission and an admin area for manually reviewing payment references.

## Features

### Resume Builder
- Create and manage resumes from a structured editor.
- Organize personal details, education, experience, projects, skills, and achievements.
- Preview and download a resume.
- Save resume data for later editing.

### AI Resume Analysis
- Generate AI-assisted feedback on resume content.
- Review strengths, improvement areas, and suggestions.
- Use the feedback to improve resume clarity and relevance.

### Resume vs. Job Description Analysis
- Provide a job description and select a resume for comparison.
- Get an AI-generated match assessment.
- Identify relevant and missing skills and improvement opportunities.

### Job Search
- Search and explore job opportunities.
- Review relevant job information and application links where available.
- Apply the app's free/premium search limits.

### Application Tracker
- Keep job applications organized in one place.
- Record company, role, application date, status, and notes.
- Update application status, including Applied, Interview, Offer, and Rejected.
- Edit and delete application records.
- View application activity through dashboard statistics.

### Smart Reminders & Email Notifications
- Create reminders for application follow-ups, interviews, and other job-search tasks.
- Schedule reminders for a chosen date and time.
- Process due reminders with `node-cron`.
- Send reminder notifications using Nodemailer and Gmail SMTP.
- Track reminder completion and email-sent state.
- Use a database claim/lock to reduce the chance of concurrent workers processing the same reminder.

### AI Email Generator
- Generate personalized, professional email drafts with Google Gemini.
- Provide job and company context to tailor the generated content.
- Review and edit the generated draft before using it.

### Premium Membership & UPI Payments
- Display the premium plan and UPI payment instructions.
- Support QR-based UPI payment initiation.
- Let users submit a UTR/reference number for review.
- Keep payment verification manual: an administrator checks the actual payment before approving access.

> **Payment note:** A submitted UTR is a reference for manual review; it is not automatic proof of payment. Never treat a demo or seeded payment record as a real transaction.

### Admin Dashboard
- Restrict administrative functions to authorized admin accounts.
- Review submitted payment requests and their UTR details.
- Approve or reject requests after checking the actual payment.
- View payment-related statistics.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, React Router, Tailwind CSS |
| State management | Zustand |
| API communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, HTTP cookies, bcrypt |
| AI | Google Gemini API |
| Scheduled tasks | node-cron |
| Email | Nodemailer, Gmail SMTP |
| Supporting tools | dotenv, CORS, cookie-parser |

## Application Screenshots

The screenshot links below use the eight Google Drive file IDs included in the supplied draft. Make sure those files are shared so that anyone with the link can view them. If a screenshot does not render in GitHub, download it from Drive and add it to the repository (for example, under `docs/screenshots/`); repository-hosted images are generally more reliable.

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1wCCWgpVjY5Qd6agIYtVF596WLY0SKQ28" width="90%" alt="NextHire application screenshot 1" />
</p>

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1pNA-4kS2dSfNndzHglPbl6Fvre5NxbJq" width="90%" alt="NextHire application screenshot 2" />
</p>

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1r1DNYyPY7onXQBldI-usCrsoO7sPy7_r" width="90%" alt="NextHire application screenshot 3" />
</p>

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1rcEGhUg4ISqDMLLLPrIdwlVxJ5i6D3RK" width="90%" alt="NextHire application screenshot 4" />
</p>

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1fHv9ruuLUnAFnwsa7i29bXzU9XxIjI3y" width="90%" alt="NextHire application screenshot 5" />
</p>

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1vl-SWiBZX-foGRRSaiirJRqUVSL1_gaD" width="90%" alt="NextHire application screenshot 6" />
</p>

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1fwtfsU32GUjfQ5HQInhPvw77tbgJGDUn" width="90%" alt="NextHire application screenshot 7" />
</p>

<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1CtUVaj3YFw6Oxzh65icpK3tpmuyvQVQz" width="90%" alt="NextHire application screenshot 8" />
</p>

## Project Structure

```text
next-hire/
├── backend/
│   ├── config/          # Database and service configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication and authorization
│   ├── models/          # Mongoose models
│   ├── routes/          # Express API routes
│   ├── utils/           # Shared utilities and scheduled jobs
│   ├── index.js         # Backend entry point
│   └── seed.js          # Optional demo-data seeder
│
└── frontend/
    ├── public/          # Public static assets
    └── src/
        ├── assets/      # Images and branding assets
        ├── components/  # Reusable UI components
        ├── pages/       # Application pages
        ├── store/       # Zustand stores
        └── ...
```

*The structure above is a high-level guide; individual folders may differ as the project evolves.*

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database (local MongoDB or MongoDB Atlas)
- A Google Gemini API key for AI features
- Gmail account with a Gmail App Password for reminder emails (optional if email reminders are not being used)

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd next-hire
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create `backend/.env` and configure the variables expected by your backend code. The database variable used by the current connection module is `MONGO_URI`.

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
FRONTEND_URL=http://localhost:5173
EMAIL_USER=<your-gmail-address>
EMAIL_PASS=<your-gmail-app-password>
GEMINI_API_KEY=<your-gemini-api-key>
```

Check the Gemini integration code for the exact API-key variable name used in your version of the project. Do not commit `.env` files, database credentials, API keys, or Gmail App Passwords.

### 4. Install frontend dependencies

Open a second terminal:

```bash
cd next-hire/frontend
npm install
```

### 5. Configure frontend environment variables

Create `frontend/.env` if your frontend uses environment variables. Set the API base URL variable expected by the Axios configuration, for example:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Use the exact variable name read by your frontend code. Do not add unused environment variables.

### 6. Start the backend

From the `backend` directory, run the development script defined in `backend/package.json` (commonly `npm run dev`). If no development script exists, use the start command configured for your project.

### 7. Start the frontend

From the `frontend` directory:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Demo Data (Optional)

The project includes a `backend/seed.js` script for creating demo users and related sample records. Run it only against a local or dedicated development database:

```bash
cd backend
node seed.js
```

The current demo seed creates sample user, resume, application, and payment records. **The payment records created by the seed script are fake demonstration data and must never be used as real transaction or revenue information.** Do not run the seed script against production data.

## Security Notes

- Passwords are hashed with bcrypt.
- Authentication uses JWT-based sessions with cookies.
- Protected routes enforce authentication and user-level access.
- Administrative payment actions require authorization.
- Store secrets in environment variables and keep `.env` out of version control.
- Payment approval is a manual administrative process; the app does not verify a UTR automatically against a bank or UPI provider.

## Tested Workflows

The following workflows have been exercised during development:

- Signup, login, and protected user access.
- Resume creation, editing, preview, and download.
- Gemini-powered resume/JD analysis and AI email drafting.
- Job search and application tracking.
- Dashboard statistics.
- Reminder scheduling and Gmail SMTP delivery.
- UPI payment submission and admin-side manual verification flow.

## Future Improvements

- Move screenshots into the repository for stable rendering in GitHub README.
- Add automated tests for critical API and UI workflows.
- Add payment-provider integration if automated payment confirmation is required.
- Improve observability and retry handling for scheduled email delivery.

## Author

**Suraj Kumar**

- GitHub: [@Suraj1307](https://github.com/Suraj1307)
- LinkedIn: [Suraj Kumar](https://www.linkedin.com/in/suraj-kumar-a59915285/)
- Email: [surajrajnkh1244@gmail.com](mailto:surajrajnkh1244@gmail.com)

## Contributions

Suggestions and contributions are welcome. Feel free to open an issue to report a bug or propose an improvement, or submit a pull request with a clear description of the changes.

---

<p align="center">
  <strong>NextHire — Build better resumes. Match smarter. Apply faster.</strong><br />
  Made with ❤️ by Suraj Kumar
</p>
