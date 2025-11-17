# backend/app/routes/chat.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.auth_utils import get_current_user
from app.models import User
import os

try:
    from google import genai
except ImportError:
    genai = None

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    history: list[dict] = []

@router.post("/message")
async def chat_message(
    chat: ChatMessage,
    current_user: User = Depends(get_current_user)
):
    api_key = os.getenv("GEMINI_API_KEY")

    if not genai:
        raise HTTPException(status_code=500, detail="Google GenAI SDK not available")

    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    try:
        # Initialize client
        client = genai.Client(api_key=api_key)

        # System prompt
        system_prompt = (
            "You are a helpful health and fitness assistant. Provide concise, "
            "friendly advice about nutrition, exercise, wellness, and healthy habits. "
            "Keep responses brief and actionable. Be encouraging and supportive."
        )

        # Build conversation history
        conversation_parts = []
        for msg in chat.history[-10:]:
            if msg["role"] == "user":
                conversation_parts.append(f"User: {msg['content']}")
            elif msg["role"] == "assistant":
                conversation_parts.append(f"Assistant: {msg['content']}")

        # Add current message
        conversation_parts.append(f"User: {chat.message}")

        # Combine system prompt with conversation
        full_prompt = f"{system_prompt}\n\n" + "\n".join(conversation_parts) + "\n\nAssistant:"

        # Try models in order
        models_to_try = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
        
        last_error = None
        for model_name in models_to_try:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=full_prompt
                )
                response_text = response.text
                print(f"Successfully used model: {model_name}")
                return {"response": response_text}
            except Exception as model_error:
                last_error = model_error
                print(f"Model {model_name} failed: {str(model_error)}")
                continue
        
        # If all models failed
        raise last_error if last_error else Exception("All models failed")

    except Exception as e:
        print(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
