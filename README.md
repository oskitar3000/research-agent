# Research Agent

A modern web application for researching topics using AI-powered web search. Built with Python FastAPI backend and React + Vite frontend.

## Features

- 🔍 **AI-Powered Research**: Uses Claude Sonnet 4 with web search capability to research any topic
- 🚀 **Real-time Streaming**: Stream research results as they're gathered (ChatGPT-style)
- 🎨 **Modern UI**: Clean, responsive interface built with React and Vite
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast Performance**: Optimized backend and frontend for quick responses

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Anthropic API Key ([Get one here](https://console.anthropic.com))

## Project Structure

```
research-agent/
├── backend/
│   ├── main.py           # FastAPI server
│   ├── agent.py          # Claude API integration
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── App.css       # Styling
│   │   └── main.jsx      # Entry point
│   ├── index.html        # HTML template
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Vite configuration
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Setup & Installation

### 1. Clone the repository and navigate to the project

```bash
cd research-agent
```

### 2. Set up the backend

```bash
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp ../.env.example ../.env

# Edit .env and add your Anthropic API key
# ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Set up the frontend

```bash
cd ../frontend

# Install dependencies
npm install
```

## Running the Application

### Start the backend

```bash
cd backend

# Make sure your virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run the FastAPI server
python main.py
```

The backend will be available at `http://localhost:8000`

### Start the frontend (in a new terminal)

```bash
cd frontend

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Enter a research topic in the search box
3. Click "Research" to start the research process
4. Watch as the AI gathers information and streams results in real-time
5. The application will display sources and relevant information

## API Endpoints

### POST /api/research

Streams research results for a given topic.

**Request:**
```json
{
  "topic": "climate change impacts on agriculture"
}
```

**Response:** Server-Sent Events stream with the following message format:
```json
{
  "type": "content",
  "content": "streamed text content..."
}
```

Message types:
- `content`: Streamed research content
- `done`: Research complete
- `error`: An error occurred

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Building for Production

### Backend

No build step needed for the backend. Deploy the `backend` folder with the dependencies installed in a production Python environment.

### Frontend

```bash
cd frontend

# Build the production bundle
npm run build

# The optimized bundle will be in the dist/ folder
```

## Technologies Used

- **Backend**: FastAPI, Python, Anthropic SDK
- **Frontend**: React, Vite, CSS3
- **APIs**: Anthropic Claude API with web search

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please refer to the documentation or create an issue in the repository.
