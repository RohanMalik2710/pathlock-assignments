# Project Manager Assignments

This repository contains two separate projects developed as part of the PathLock coding assignments. Both are full-stack applications built using **.NET** for the backend and **React** for the frontend, styled with **Tailwind CSS**.

---

## Repository Structure

```
ProjectManagerAssignments/
 ┣ assignment-1/
 ┃ ┣ backend/
 ┃ ┗ frontend/
 ┗ assignment-2-and-3/
   ┣ backend/
   ┗ frontend/
```

---

## Assignment 1

**Tech Stack:**

* .NET 8 (Web API)
* React (TypeScript)
* Tailwind CSS

**Overview:**
This project focuses on building a project management API and frontend interface using TypeScript with React. It supports basic CRUD operations for managing projects and tasks and is styled with Tailwind CSS for a clean, responsive design.

**Key Features:**

* RESTful API built with ASP.NET Core
* Entity Framework Core for database operations
* React TypeScript frontend with Tailwind styling
* CRUD functionality for projects and tasks
* Responsive and minimal user interface

---

## Assignment 2 and 3

**Tech Stack:**

* .NET 8 (Web API)
* React (JavaScript)
* Tailwind CSS

**Overview:**
This project builds upon the previous one by adding additional functionality and improvements. It includes more complex task management logic, scheduling, and due date handling in the backend service layer.

**Key Features:**

* Task scheduling service integrated into the backend
* Due date and project timeline tracking
* Improved API structure using controllers and services
* React JavaScript frontend with Tailwind CSS
* Simple and responsive user experience

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Running the Backend

Navigate to the backend folder for either project:

```bash
cd assignment-1/backend
# or
cd assignment-2-and-3/backend
```

Restore dependencies:

```bash
dotnet restore
```

Run database migrations:

```bash
dotnet ef database update
```

Start the server:

```bash
dotnet run
```

The API will be available at:

```
https://localhost:5001
or
http://localhost:5000
```

### 3. Running the Frontend

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The frontend will run at:

```
http://localhost:3000
```

---

## Future Improvements

* Add user authentication and authorization
* Implement automated notifications for due tasks
* Extend the scheduler service for recurring tasks
* Integrate AI-based task prioritization

---

## Author

**Rohan Malik**
* Student Developer
* Email: rohanmalik2710@gmail.com
* GitHub: github.com/rohanmalik2710
* LinkedIn: linkedin.com/in/rohan-malik-977330269

---

## License

This repository is open-sourced under the **MIT License**.
