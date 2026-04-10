from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from agent import research_agent
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchRequest(BaseModel):
    topic: str


@app.post("/api/research")
async def research(request: ResearchRequest):
    """Stream research results for the given topic"""
    if not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    
    if not os.getenv("ANTHROPIC_API_KEY"):
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not configured")
    
    async def event_generator():
        try:
            async for chunk in research_agent(request.topic):
                yield chunk
        except Exception as e:
            error_message = json.dumps({"type": "error", "content": str(e)}) + "\n"
            yield f"data: {error_message}\n\n"
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/health")
def health():
    """Health check endpoint"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
