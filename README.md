# 🚀 AI-Powered Placement Preparation Platform

An AI-powered, full-stack web application designed to help students and freshers prepare for campus placements and software engineering interviews through a unified platform.

The platform brings together resume analysis, interview preparation, job matching, Data Structures and Algorithms (DSA) practice, aptitude assessments, and personalized learning roadmaps.

## 📌 Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Key Features](#-key-features)
* [Technology Stack](#-technology-stack)
* [System Architecture](#-system-architecture)
* [Project Structure](#-project-structure)
* [Getting Started](#-getting-started)
* [Environment Variables](#-environment-variables)
* [Running the Application](#-running-the-application)
* [Testing](#-testing)
* [Future Enhancements](#-future-enhancements)
* [Security Considerations](#-security-considerations)
* [Author](#-author)

## 📖 Overview

Preparing for placements often requires students to use multiple platforms for resume building, coding practice, aptitude preparation, interview preparation, and job searching.

The AI-Powered Placement Preparation Platform aims to simplify this process by providing these essential preparation tools in one place.

The application combines a React-based user interface, a Node.js and Express.js backend, MongoDB for data storage, and AI-assisted capabilities to support a more structured and personalized placement preparation experience.

**Target Users:** College students, fresh graduates, and job seekers preparing for technical and non-technical interviews.

## 🎯 Problem Statement

Students frequently struggle to organize their placement preparation because their learning resources and progress are scattered across different platforms.

This project addresses the problem by providing a centralized application where users can practice, monitor their progress, evaluate their preparation, and identify areas for improvement.

## ✨ Key Features

### 📄 1. Resume Analysis

* Analyze resume information to identify strengths and areas for improvement.
* Support resume-based preparation and feedback.
* Help users improve the relevance of their resumes for target roles.

### 🎤 2. Interview Preparation

* Practice technical and HR interview questions.
* Use interview preparation features to improve readiness.
* Identify topics that require additional preparation.

### 💼 3. Job Matching

* Explore job opportunities represented in the application.
* Match preparation goals with relevant job roles.
* Discover skills associated with target positions.

**Note:** Job listings may contain sample or seeded data and should not be treated as verified live vacancies.

### 💻 4. DSA Practice and Tracking

* Practice Data Structures and Algorithms.
* Track coding practice and learning progress.
* Build consistency in technical interview preparation.

### 🧠 5. Aptitude Assessments

* Practice aptitude questions.
* Evaluate performance through assessments.
* Identify areas where further practice is needed.

### 🗺️ 6. Personalized Learning Roadmap

* Organize placement preparation into learning activities.
* Track progress across preparation modules.
* Help users focus on areas requiring improvement.

### 🔐 7. Authentication and Protected APIs

* User authentication using JSON Web Tokens (JWT).
* Protected backend endpoints.
* Role-based authorization where implemented.

## 🛠️ Technology Stack

| Technology     | Purpose                                      |
| -------------- | -------------------------------------------- |
| MongoDB        | Database and persistent data storage         |
| Express.js     | Backend API framework                        |
| React.js       | Interactive user interface                   |
| Node.js        | Backend JavaScript runtime                   |
| JavaScript     | Application development                      |
| JWT            | Authentication and token-based authorization |
| Gemini API     | Optional AI-assisted functionality           |
| npm            | Dependency management and scripts            |
| Git and GitHub | Version control and collaboration            |

The exact technologies used by individual modules depend on their implementation in the source code.

## 🏗️ System Architecture

The application follows a client-server architecture based on the MERN stack.

```text
              USER
                |
                v
       React.js Frontend
                |
                v
        HTTP / REST APIs
                |
                v
       Node.js + Express.js
                |
        +-------+--------+
        |                |
        v                v
     MongoDB         AI Service
    Database       (Gemini API,
                    if configured)
```

### How It Works

1. **Frontend:** React.js renders the user interface and handles user interactions.
2. **API Communication:** The frontend sends HTTP requests to backend API endpoints.
3. **Backend Processing:** Express.js processes requests, applies validation and authentication, and executes application logic.
4. **Database:** MongoDB stores and retrieves application data.
5. **AI Integration:** AI-assisted features can communicate with the configured AI service through the backend.
6. **Response:** The backend returns the result to the frontend for display.

## 📂 Project Structure

```text
AI-Powered-Placement-Preparation-Platform/
│
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── ...
│
├── frontend/
│   ├── package.json
│   └── ...
│
├── .gitignore
├── package.json
└── README.md
```

The backend contains server-side logic, API endpoints, authentication, and database operations.

The frontend contains the React application and user interface.

*Refer to the individual folders for the complete source code and implementation details.*

## 🚀 Getting Started

Follow these instructions to run the application locally on Windows.

### Prerequisites

Install the following software before starting:

* [Node.js](https://nodejs.org/) — version 20 or later.
* npm — included with Node.js.
* [MongoDB](https://www.mongodb.com/) — a local database installation or MongoDB Atlas account.
* [Git](https://git-scm.com/) — for version control.
* [Visual Studio Code](https://code.visualstudio.com/) — recommended code editor.

### 1. Clone the Repository

```bash
git clone https://github.com/eshikawadhwani30/AI-Powered-Placement-Preparation-Platform.git
```

Navigate into the project directory:

```bash
cd AI-Powered-Placement-Preparation-Platform
```

### 2. Install Backend Dependencies

```bash
npm install --prefix backend
```

### 3. Install Frontend Dependencies

```bash
npm install --prefix frontend
```

### 4. Configure Environment Variables

Copy the example environment file:

```powershell
Copy-Item backend/.env.example backend/.env
```

Open `backend/.env` and configure the required values.

Refer to the environment variables section below.

### 5. Start the Application

Start the backend and frontend in separate terminals, following the instructions below.

## ⚙️ Environment Variables

Configure the backend environment variables according to `backend/.env.example`.

Typical settings include:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
```

**Important:**

* Use your own database credentials and API keys.
* Generate a strong, random JWT secret.
* The Gemini API key is optional if the relevant AI functionality is not being used.
* Check `backend/.env.example` and the backend configuration to confirm the exact variable names and requirements.
* Never commit your `.env` file or expose API keys in frontend code.

## ▶️ Running the Application

### Start the Backend

Open a terminal at the project root and run:

```bash
npm run server
```

The backend API is configured to run at:

```text
http://localhost:5000
```

### Start the Frontend

Open a second terminal at the project root and run:

```bash
npm run client
```

The frontend development server is configured to run at:

```text
http://localhost:5173
```

Open the frontend URL in your browser to access the application.

**Troubleshooting:** If a command fails, check the root `package.json` scripts, database connection, and environment configuration. The frontend and backend must both be running for the full application to work.

## 🧪 Testing

Run the backend test suite:

```bash
npm test --prefix backend
```

Build the frontend to check for build errors:

```bash
npm run build --prefix frontend
```

Resolve any errors before deploying the application.

## 🔮 Future Enhancements

Potential improvements include:

* Advanced AI-powered resume analysis with ATS-oriented feedback.
* Resume-to-job-description matching and skill-gap identification.
* AI-generated technical and HR interview questions.
* Interactive mock interviews with structured feedback.
* Expanded DSA question banks with difficulty levels and topic filters.
* Detailed aptitude performance analytics.
* Personalized study plans based on individual performance.
* Progress dashboards and preparation statistics.
* Verified job listings and application tracking.
* Deployment with secure production configuration.

These are potential enhancements and do not necessarily represent features already implemented.

## 🔒 Security Considerations

* Keep database credentials and API keys private.
* Use strong JWT secrets and validate authentication tokens.
* Validate and sanitize user inputs on the backend.
* Apply authorization checks to protected resources.
* Configure appropriate CORS policies.
* Use HTTPS in production.
* Never rely exclusively on frontend validation for security-sensitive operations.

## 👩‍💻 Author

**Eshika Wadhwani**

B.E. Information Technology | D. Y. Patil College of Engineering, Akurdi

* GitHub: [@eshikawadhwani30](https://github.com/eshikawadhwani30)

---

⭐ If you find this project useful, consider giving the repository a star.

*Built to make placement preparation more organized, accessible, and structured for students and freshers.*
