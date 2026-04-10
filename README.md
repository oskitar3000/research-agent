# Research Agent

A modern web application for researching topics using AI-powered web search. Built with Python FastAPI backend and React + Vite frontend.

## Features

- 🔍 **AI-Powered Research** — Uses Claude Sonnet 4 with web search to research any topic
- 🚀 **Real-time Streaming** — Results stream as they're gathered, ChatGPT-style
- 📝 **Markdown Rendering** — Structured output with proper headings, bold text and lists
- 💡 **Topic Suggestions** — One-click suggested topics to get started instantly
- 🕐 **Search History** — Revisit your last 10 searches with a single click
- 🎨 **Modern UI** — Clean, responsive interface built with React and Vite

## Preview

![Research Agent UI](assets/UI%20FrontEnd.png)

![Research Agent Loading](assets/UI%20FrontEnt%20Loading%20Search.png)

![Research Agent Results](assets/UI%20FrontEnt%20Search%20Finished.png)

![Research Agent Prompt](assets/Prompt.png)

## Live Demo

- 🌐 **Frontend:** https://research-agent.oscar-monterde-camacho-marketing.workers.dev
- ⚙️ **Backend API:** https://research-agent-production-2233.up.railway.app

### Infrastructure

![Frontend on Cloudflare](assets/FrontEnd%20Cloudfare.png)

![Backend on Railway](assets/Backend%20Railway.png)

> Frontend hosted on Cloudflare Workers — Backend hosted on Railway

## Prerequisites

- Python 3.9+
- Node.js 18+
- An Anthropic API key → https://console.anthropic.com

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/oskitar3000/research-agent.git
cd research-agent
```

### 2. Set up the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "ANTHROPIC_API_KEY=your-key-here" > .env
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

## Running the App

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```
Backend runs at `http://localhost:8000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Click a suggested topic or type your own
3. Hit **Research** and watch results stream in real time
4. Past searches are saved — click any to re-run it

## API Reference

### `POST /api/research`

**Request:**
```json
{ "topic": "computer vision in sports" }
```

**Response (SSE stream):**
```json
{ "type": "content", "content": "streamed text..." }
{ "type": "done", "content": "" }
{ "type": "error", "content": "error message" }
```

### `GET /health`
```json
{ "status": "ok" }
```

## Roadmap

- [x] Real-time streaming responses
- [x] Markdown rendering
- [x] Topic suggestions
- [x] Search history
- [ ] Export results as PDF
- [ ] Multi-model support (GPT-4, Gemini)
- [ ] Save and share research sessions

## Author

Oscar Monterde — [github.com/oskitar3000](https://github.com/oskitar3000)

---

Built as part of an AI portfolio project.