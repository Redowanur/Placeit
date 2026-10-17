# 🚀 Placeit: A Modern Campus Placement Platform

Placeit is a modern, full-stack campus placement platform built with a high-performance **FastAPI** backend, a responsive **Next.js** frontend, and a flexible **MongoDB** database. This platform is designed to streamline the campus placement process, providing a seamless experience for students and recruiters.

<!-- ## 📁 Repository Structure

```text
taskflow/
├── frontend/                     # Next.js Application (App Router)
│   ├── app/                      # Routing, layouts, and pages
│   ├── components/               # UI components (Shadcn + Tailwind)
│   ├── lib/                      # API clients, utils, fetch configuration
│   ├── types/                    # TypeScript interfaces
│   ├── .env.local.example        # Frontend environment template
│   └── package.json
│
├── backend/                      # FastAPI Python Application
│   ├── app/
│   │   ├── api/v1/               # Endpoint routers (auth, tasks, users)
│   │   ├── core/                 # App configurations and database clients
│   │   ├── models/               # MongoDB models (Pydantic / Motor)
│   │   └── services/             # Business logic and operations
│   ├── .env.example              # Backend environment template
│   ├── main.py                   # FastAPI entrypoint
│   └── pyproject.toml            # Dependencies (Uv / Poetry / Pip)
│
├── docker-compose.yml            # Local development orchestrator
└── README.md                     # This file!
``` -->

<!-- ---

## 🛠️ Tech Stack

*   **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI
*   **Backend:** FastAPI (Python 3.11+), Pydantic v2, Uvicorn
*   **Database:** MongoDB via **Motor** (Asynchronous Python driver)
*   **DevOps:** Docker, Docker Compose

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
*   [Node.js](https://nodejs.org) (v18.0.0 or higher)
*   [Python](https://python.org) (v3.11 or higher)
*   [Docker & Docker Compose](https://docker.com) *(Highly recommended)*

---

### 📦 Setup & Installation

#### 1. Clone the Repository
```bash
git clone https://github.com
cd taskflow
```

#### 2. Configure Environment Variables
You need to set up environment profiles for both parts of the application.

*   **Backend Setup:**
    ```bash
    cd backend
    cp .env.example .env
    ```
    *Open `.env` and configure your secret key and MongoDB connection string.*

*   **Frontend Setup:**
    ```bash
    cd ../frontend
    cp .env.local.example .env.local
    ```
    *Open `.env.local` and ensure `NEXT_PUBLIC_API_URL` points to your backend (`http://localhost:8000`).*

---

### 🐳 Running with Docker (Recommended)

The easiest way to boot up the backend, frontend, and a local MongoDB instance simultaneously is using Docker Compose from the root directory:

```bash
docker-compose up --build
```

Once running, access the services here:
*   **Frontend Web App:** `http://localhost:3000`
*   **FastAPI Backend Server:** `http://localhost:8000`
*   **Interactive API Docs (Swagger):** `http://localhost:8000/docs`

---

### 💻 Running Locally Without Docker

If you prefer executing the services bare-metal on your machine, launch them in separate terminal windows.

#### Step 1: Run the Backend
Ensure you have a MongoDB instance running locally on port `27017` or use a MongoDB Atlas cloud URI in your backend `.env`.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Step 2: Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Reference & Documentation

FastAPI natively serves interactive API visualization. With the backend running, navigate to:

*   **Swagger UI (Interactive Playground):** `http://localhost:8000/docs`
*   **ReDoc (Clean reading view):** `http://localhost:8000/redoc`

---

## 🧪 Testing

### Backend Tests
The backend test suite utilizes `pytest` alongside an in-memory or detached test database.
```bash
cd backend
pytest
```

### Frontend Linting & Formatting
```bash
cd frontend
npm run lint
```

---

## 🚢 Deployment

*   **Frontend:** The Next.js client is ready for zero-configuration deployment on [Vercel](https://vercel.com).
*   **Backend:** The FastAPI service can be containerized via the included configuration and shipped to platforms like Render, Railway, or AWS ECS.

--- -->

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
