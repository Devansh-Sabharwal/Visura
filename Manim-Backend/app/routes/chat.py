from fastapi import APIRouter,Depends,HTTPException
from fastapi import Request
from sqlmodel import Session
from sqlalchemy.exc import SQLAlchemyError
from app.db.db import get_session
from pydantic import BaseModel
from app.db.models import Message,Chat
from app.db.crud import create_message,getContext
from app.utils.video import generate_video,generate_video_from_stream
from sqlmodel import select
from typing import Optional

class ChatResponse(BaseModel):
    success: bool
    chatId: str
    video_url: Optional[str] = None
    public_id: Optional[str] = None
    message: str
    script: Optional[str] = None
    error: Optional[str] = None


class PromptReq(BaseModel):
    prompt:str
    chatId:str

router = APIRouter(prefix="/chat",tags=["Chats"])

@router.post('/prompt')
async def chat(body:PromptReq,req:Request,session:Session=Depends(get_session)):
    try:
        print("request reached")
        userId  = req.state.user_id
        prompt  = body.prompt
        chatId = body.chatId

        chat = session.exec(select(Chat).where(Chat.id == chatId)).first()
        print("userId:",userId,"\n","prompt:",prompt,"\n","chatId:",chatId,"\n")
        if not chat:
            chat = Chat(
                id=chatId,
                userId=userId,
                title=f"{chatId[:6]}",  # Optional: Give it a default title
            )
            session.add(chat)
            session.commit()


        new_message = Message(
            role="user",
            content=prompt,
            chatId=chatId,
        )
        create_message(session,new_message)
        context = getContext(session,chatId,3)
        
        video_result = await generate_video(context, chatId, session)
        session.commit()
        return ChatResponse(
            success=True,
            chatId=chatId,
            video_url=video_result["video_url"],
            public_id=video_result["public_id"],
            message="Video generated successfully",
            script=None  # Don't send script to frontend unless needed
        )
        
    except SQLAlchemyError as e:
        print(e)
        session.rollback()
        raise HTTPException(
            status_code=500, 
            detail="Database error occurred"
        ) from e
        
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=501,detail=f"Error in Video generation try again: {str(e)}")


from fastapi.responses import StreamingResponse
from fastapi import BackgroundTasks
from app.gemini import build_content_list, client, types, SYSTEM_PROMPT
import json
from app.utils.video import generate_video_from_stream
from app.db.db import SessionLocal
import asyncio
import uuid

@router.post("/prompt-stream")
async def stream_chat(body: PromptReq, req: Request, background_tasks: BackgroundTasks,session: Session = Depends(get_session)):
    user_id = req.state.user_id
    prompt = body.prompt
    chat_id = body.chatId

    request_id = uuid.uuid4().hex
    async def generate_stream():
        try:
            buffer = ""
            explanation_text=""
            code_text=""
            current_type = "explanation"
            chat = session.exec(select(Chat).where(Chat.id == chat_id)).first()
            if not chat:
                chat = Chat(id=chat_id, userId=user_id, title=f"{chat_id[:6]}")
                session.add(chat)
                session.commit()


            new_message = Message(role="user", content=prompt, chatId=chat_id)
            create_message(session, new_message)

            
            context = getContext(session, chat_id, 3)
            contents = build_content_list(context)

            # Stream Gemini response
            resp = client.models.generate_content_stream(
                model="gemini-2.5-flash-preview-05-20",
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    max_output_tokens=20000,
                    system_instruction=SYSTEM_PROMPT
                ),
                contents=contents
            )
            for chunk in resp:
                if not chunk.text:
                    continue
                print(chunk)
                buffer += chunk.text

                while True:
                    if "<<<CODE>>>" in buffer:
                        before, buffer = buffer.split("<<<CODE>>>", 1)
                        if(current_type=="explanation" and before.strip()): 
                            explanation_text += before.strip()
                        yield f"data: {json.dumps({'type': current_type, 'text': before.strip()})}\n\n"
                        current_type = "code"
                    elif "<<<EXPLANATION>>>" in buffer:
                        before, buffer = buffer.split("<<<EXPLANATION>>>", 1)
                        if(current_type=="explanation"): 
                            explanation_text += before.strip()
                        yield f"data: {json.dumps({'type': current_type, 'text': before.strip()})}\n\n"
                        current_type = "explanation"
                    else:
                        break

            
            if buffer.strip():
                if(current_type=="explanation"): 
                    explanation_text += buffer.strip()
                else:
                    code_text+=buffer.strip()
                yield f"data: {json.dumps({'type': current_type, 'text': buffer.strip()})}\n\n"

            yield f"data: {json.dumps({'type': 'done', 'request_id': request_id})}\n\n"

            data = {
                "explanation":explanation_text,
                "code":code_text
            }
            content = json.dumps(data)
            new_message = Message(role="model", content=content,chatId=chat_id)
            create_message(session, new_message)
            session.commit()

            background_tasks.add_task(generate_video_background, code_text, chat_id,request_id)

        except Exception as e:
            session.rollback()
            yield f"\n[Error: {str(e)}]".encode("utf-8")

    return StreamingResponse(generate_stream(), media_type="text/plain")


def generate_video_background(code_text, chat_id,request_id):
    session = SessionLocal()
    try:
        asyncio.run(generate_video_from_stream(code_text, chat_id, request_id,session))
    except Exception as e:
        
        print(f"[VideoGen Error] for chat_id={chat_id}: {str(e)}")

    finally:
        session.close()
