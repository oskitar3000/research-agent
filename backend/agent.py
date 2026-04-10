import anthropic
import json
from typing import AsyncGenerator
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

async def research_agent(topic: str) -> AsyncGenerator[str, None]:
    system_prompt = """You are a research assistant that helps users research topics and find information. 
You have access to web search capabilities to find current and accurate information.
When you research a topic, provide comprehensive information with sources and citations.
Format your response with clear sections and cite sources when providing information."""
    
    messages = [
        {
            "role": "user",
            "content": f"Research the following topic and provide comprehensive information: {topic}"
        }
    ]
    
    try:
        with client.messages.stream(
            model="claude-sonnet-4-20250514",
            max_tokens=2048,
            system=system_prompt,
            messages=messages,
        ) as stream:
            for text in stream.text_stream:
                data = json.dumps({"type": "content", "content": text})
                yield f"data: {data}\n\n"
        
        completion_data = json.dumps({"type": "done", "content": ""})
        yield f"data: {completion_data}\n\n"
        
    except Exception as e:
        error_data = json.dumps({"type": "error", "content": str(e)})
        yield f"data: {error_data}\n\n"
