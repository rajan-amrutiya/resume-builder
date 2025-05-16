**Hackathon** **PRD:** **AI** **Resume** **Builder+**

**Time:** 24-hour Hackathon **Team:** Team NextGen (4 members)
**Judging** **Criteria:** Feature Completion, Layered Architecture,
Testing, SOPs

**1.** **Problem** **Statement**

Job seekers currently face a significant time burden in the often
tedious and error-prone process of formatting resumes. Ensuring resumes
are Applicant Tracking System (ATS) friendly and maintaining multiple
versions adds further complexity. Our application, "AI Resume Builder+,"
aims to streamline this process by empowering users to:

> ● **Create** **multiple,** **ATS-friendly** **resumes** **rapidly.**
>
> ● **Securely** **manage** **and** **organize** **all** **resume**
> **versions** **in** **a** **centralized** **location.** ● **Export**
> **professional,** **polished** **PDF** **resumes** **with** **a**
> **single** **click.**

**2.** **Minimum** **Viable** **Product** **(MVP)** **Features**
**(Prioritized** **for** **24-Hour** **Hackathon)**

Given the time constraint, we will focus on delivering a robust and
functional core experience.

**Core** **Features** **(Must** **Have** **for** **MVP)**

> ● **User** **Authentication** **(New)**
>
> ○ **Description:** Securely authenticate users to protect their data
> and enable personalized resume management.
>
> ○ **Functionality:**
>
> ■ Implementation of Google and GitHub login using NextAuth.js. ■
> Secure user registration and login.
>
> ○ **Technology:** NextAuth.js
>
> ○ **Testing:** Verify the authentication flow requires fewer than 3
> clicks from initiation to successful login.
>
> ● **Profile** **Storage** **(New)**
>
> ○ **Description:** Securely store user profiles and associated resume
> data. ○ **Functionality:**
>
> ■ Database schema design to accommodate user information and multiple
> resume versions.
>
> ■ Backend API endpoints for creating, reading, updating, and deleting
> user profiles. ○ **Technology:** Node.js (backend), \[Specify Database
> e.g., MongoDB Atlas, PostgreSQL on
>
> Railway\]
>
> ○ **Testing:** Ensure user data is persisted correctly and securely.
>
> ● **AI** **Resume** **Creation** **(Enhanced)**
>
> ○ **Description:** Leverage AI to intelligently structure
> user-provided text or voice input into standard resume sections.
>
> ○ **Functionality:**
>
> ■ Accepts text input (copy-paste) and potentially voice input (if
> feasible within the timeframe).
>
> ■ AI model capable of identifying and categorizing information into
> relevant resume sections (e.g., Contact Information,
> Summary/Objective, Experience, Education, Skills).
>
> ■ Automatic saving of the AI-generated structure to the user's
> profile. ○ **Technology:** \[Specify AI Model/Library e.g., OpenAI
> API, NLP.js\]
>
> ○ **Testing:** Evaluate the accuracy of section detection, aiming for
> at least 90% accuracy across various input formats.
>
> ● **Resume** **Management** **Dashboard** **(New)**
>
> ○ **Description:** Provide users with a central interface to manage
> their created resumes. ○ **Functionality:**
>
> ■ Display a list of all resumes associated with the logged-in user. ■
> Enable users to view, edit, duplicate, and delete their resumes.
>
> ○ **Technology:** React.js (frontend)
>
> ○ **Testing:** Verify that Create, Read, Update, and Delete (CRUD)
> operations on resumes function correctly, including basic offline
> functionality if time permits for local storage caching.

**Bonus** **Features** **(If** **Time** **Permits)**

> ● **Live** **Preview** **Editor:** Provide a real-time visual
> representation of the resume as it's being created or edited.
>
> ● **1-Click** **PDF** **Export:** Allow users to instantly download
> their selected resume as a polished PDF document.
