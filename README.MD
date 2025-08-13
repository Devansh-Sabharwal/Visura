# About the Project

Visura turns your ideas into **beautiful Manim animations** - instantly.  
Generate stunning 2D animations in seconds with a single prompt.
Type your concept, let AI do the scripting, and watch math, physics, or any visual explanation come alive.  
No Manim setup. No debugging pain. Just pure animation magic.

Say it. See it. Animate it. All with Visura's AI

---

## 🎬 Demo

<video src="https://res.cloudinary.com/dbyfsythn/video/upload/v1755083444/demo_weukqp.mp4" controls width="600"></video>

## Features

- **Natural Language to Animation** — Describe your idea in plain English, and Visura generates both the **explanation** and **Manim CE code**.
- **Background Rendering** — Videos render asynchronously so you get results without waiting forever.
- **Cloud Hosting** — Animations are uploaded to **Cloudinary** for instant playback & sharing.
- **Follow-up Questions** — Keep the conversation going; refine your animation with more prompts.
- **AI Model** — Powered by `gemini-2.5-flash-preview-05-20` via Google Generative AI.

---

## Tech Stack

**Frontend**

- [Next.js](https://nextjs.org/) — Modern React framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling

**Backend**

- [FastAPI](https://fastapi.tiangolo.com/) — High-performance Python API
- [Alembic](https://alembic.sqlalchemy.org) — ORM for message storage
- [Celery](https://docs.celeryq.dev/) + [Redis](https://redis.io/) — Background task queue for rendering
- [Docker Compose](https://docs.docker.com/compose/) — Containerized services

**Animation Engine**

- [Manim CE v0.19.0](https://docs.manim.community/) — Mathematical animation library

**Storage & Media**

- [Cloudinary](https://cloudinary.com/) — Video hosting

## AI Disclaimer

We use **Gemini** to write Manim code.  
90% of the time it’s perfect.  
10% of the time… it’s _creative_ (aka your animation might explode 💥).  
If something fails, just re-prompt — the AI learns from retries.

---

## Installation & Running

Note: The Postgres database for Visura is hosted on Neon.tech. If you prefer, you can also run Postgres locally and adjust the installation steps and connection string in .env accordingly .

You can run Visura in **two ways**:

1. Local Python environment (good for quick dev/debug)
2. Full Docker setup (recommended for consistency & deployment)

---

**Option 1 — Local Development (No Docker)**

**Backend Setup**

1. Clone the repo

```
git clone https://github.com/Devansh-Sabharwal/visura.git
```

2. Go to Backend Folder

```
cd Manim-Backend
```

3. Copy environment variables from .env.example to .env and fill them

4. Activate virtual environment

```
python -m venv venv
venv/bin/activate  # On Windows: venv\Scripts\activate
```

5. Install dependencies

```
pip install -r requirements.txt
```

6. Start Redis (for Celery)

```
docker run -d --name some-redis -p 6379:6379 redis
```

7. Run database migrations

```
alembic upgrade head
```

8. Start FastAPI backend

```
uvicorn app.main:app --reload
```

**Frontend setup**

```
cd ../frontend
npm install
npm run dev
```

**Option 2 — Full Docker Setup (Recommended)**

1. Clone the repo

```
git clone https://github.com/Devansh-Sabharwal/visura.git
```

2. Go to Backend Folder

```
cd Manim-Backend
```

3. Copy environment variables from .env.example to .env and fill them

4. Run database migrations

```
alembic upgrade head
```

5. Build Docker Image

```
docker build -t "visura-backend" .
```

6. Run Docker comose up

```
docker compose up
```

**Frontend setup**

```
cd ../frontend
npm install
npm run dev
```
