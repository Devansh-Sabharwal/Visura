import os, uuid, textwrap, subprocess
from typing import List, Optional, Dict, Any
from .gemini import manim_script_from_prompt
from app.utils.utils import find_scene_class, video_output_path
from app.routes import auth, chat, message, video
from pydantic import BaseModel
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from app.db.db import engine
app = FastAPI(title="Manim")

BASE_DIR = Path(__file__).resolve().parent.parent
RENDER_DIR = BASE_DIR / "rendered"
RENDER_DIR.mkdir(exist_ok=True)

# In-memory storage for conversation histories (use Redis/DB for production)
conversation_store: Dict[str, List[Dict[str, Any]]] = {}

class PromptReq(BaseModel):
    prompt: str
    conversation_id: Optional[str] = None  # Optional conversation ID for follow-ups

class ConversationResponse(BaseModel):
    conversation_id: str
    video_filename: str

def render_with_manim(py_file: Path, scene_class: str) -> Path:
    """Run manim. Return path to the rendered MP4 (raises on error)."""
    try:
        subprocess.run(
            ["manim", str(py_file), scene_class, "-qh"],  # -qh = high quality
            check=True,
            cwd=BASE_DIR
        )
    except subprocess.CalledProcessError as err:
        raise RuntimeError(f"Manim failed: {err}") from err

    vid_path = video_output_path(py_file, scene_class)
    if not vid_path.exists():
        raise RuntimeError("Expected video not found after rendering.")
    return vid_path

def generate_and_render(prompt: str, conversation_history: Optional[List] = None) -> tuple[Path, List]:
    """Generate script and render video, returning video path and updated conversation history"""
    
    # Get script and updated conversation history
    script, updated_history = manim_script_from_prompt(prompt, conversation_history)
    
    # Find scene class
    scene = find_scene_class(script)
    if not scene:
        raise RuntimeError("Gemini did not define a scene class")
    
    # Generate unique file
    file_id = uuid.uuid4().hex[:8]
    py_file = RENDER_DIR / f"scene_{file_id}.py"
    py_file.write_text(textwrap.dedent(script))

    # Render video
    vid_path = render_with_manim(py_file, scene)
    
    return vid_path, updated_history

 
app.include_router(auth.router)  # Groups under "Auth" section
# app.include_router(chat.router, tags=["Chats"])  # Groups under "Chats" section



@app.post("/generate", response_model=ConversationResponse)
async def generate(req: PromptReq, bg: BackgroundTasks):
    try:
        # Get existing conversation history or create new
        conversation_history = None
        conversation_id = req.conversation_id
        
        if conversation_id and conversation_id in conversation_store:
            conversation_history = conversation_store[conversation_id]
        else:
            # Create new conversation ID if not provided or doesn't exist
            conversation_id = uuid.uuid4().hex[:12]
        
        # Generate and render with conversation context
        vid_path, updated_history = generate_and_render(req.prompt, conversation_history)
        
        # Store updated conversation history
        conversation_store[conversation_id] = updated_history
        
        # Clean up old Python file in background
        # py_files_to_cleanup = list(RENDER_DIR.glob(f"scene_*.py"))
        # if len(py_files_to_cleanup) > 10:  # Keep only last 10 files
        #     for old_file in py_files_to_cleanup[:-10]:
        #         bg.add_task(cleanup_file, old_file)
        
        return ConversationResponse(
            conversation_id=conversation_id,
            video_filename=vid_path.name
        )
        
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "active_conversations": len(conversation_store)}