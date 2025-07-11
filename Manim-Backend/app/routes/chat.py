from fastapi import APIRouter,Depends,HTTPException
from fastapi import Request
from sqlmodel import Session
from sqlalchemy.exc import SQLAlchemyError
from app.celery.tasks import render_and_upload_video
from app.db.db import get_session
from pydantic import BaseModel
from app.db.models import Message,Chat
from app.db.crud import create_message,getContext
from app.utils.video import generate_video
from sqlmodel import select
from typing import Optional
from fastapi.responses import StreamingResponse
from fastapi import BackgroundTasks
from app.gemini import build_content_list, client, types, SYSTEM_PROMPT
import json
import asyncio
import uuid
import time
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



@router.post("/prompt-stream")
async def stream_chat(body: PromptReq, req: Request, background_tasks: BackgroundTasks,session: Session = Depends(get_session)):
    user_id = req.state.user_id
    prompt = body.prompt
    chat_id = body.chatId
    print(user_id)
    print(prompt)
    print(chat_id)
    request_id = uuid.uuid4().hex
    async def generate_stream():
        try:
            buffer = ""
            explanation_text=""
            code_text=""
            current_type = "none"
            chat = session.exec(select(Chat).where(Chat.id == chat_id)).first()
            if not chat:
                chat = Chat(id=chat_id, userId=user_id, title=generateTitleFromPrompt(prompt))
                session.add(chat)
                session.commit()


            new_message = Message(role="user", content=prompt, chatId=chat_id)
            create_message(session, new_message)

            
            context = getContext(session, chat_id, 3)
            contents = build_content_list(context)
            
            CODE_DELIMITER = "<<<CODE>>>"
            EXPLANATION_DELIMITER = "<<<EXPLANATION>>>"
            
            # Keep track of partial delimiters
            max_delimiter_len = max(len(CODE_DELIMITER), len(EXPLANATION_DELIMITER))
            
            yield f"data: {json.dumps({'type': 'debug', 'text': 'starting stream...'})}\n\n"
            await asyncio.sleep(0.01)
            start = time.time()
            
            try:
                resp = client.models.generate_content_stream(
                    model="gemini-2.5-flash-preview-05-20",
                    config=types.GenerateContentConfig(
                        temperature=0.1,
                        max_output_tokens=20000,
                        system_instruction=SYSTEM_PROMPT,
                        thinking_config=types.ThinkingConfig(thinking_budget=0)
                    ),
                    contents=contents
                )
                
                for chunk in resp:
                    if not chunk.text:
                        continue
                    buffer += chunk.text.replace("\\n", "\n")
                    if(start!=0):
                        print(time.time()-start,"seconds taken by gemini to respond")
                        start = 0
                    # Process and stream immediately, but keep potential delimiter parts
                    while len(buffer) > max_delimiter_len:
                        # Look for complete delimiters
                        code_pos = buffer.find(CODE_DELIMITER)
                        explanation_pos = buffer.find(EXPLANATION_DELIMITER)
                        
                        # Find the earliest delimiter
                        earliest_pos = -1
                        next_type = None
                        
                        if code_pos != -1 and explanation_pos != -1:
                            if code_pos < explanation_pos:
                                earliest_pos = code_pos
                                next_type = "code"
                            else:
                                earliest_pos = explanation_pos
                                next_type = "explanation"
                        elif code_pos != -1:
                            earliest_pos = code_pos
                            next_type = "code"
                        elif explanation_pos != -1:
                            earliest_pos = explanation_pos
                            next_type = "explanation"
                        
                        if earliest_pos != -1:
                            # Found a delimiter - process everything before it
                            before_delimiter = buffer[:earliest_pos]
                            
                            if before_delimiter:
                                # Stream the content immediately
                                if current_type == "explanation":
                                    explanation_text += before_delimiter
                                else:
                                    code_text += before_delimiter
                                
                                yield f"data: {json.dumps({'type': current_type, 'text': before_delimiter})}\n\n"
                            
                            # Switch type and remove processed content
                            current_type = next_type
                            delimiter_len = len(CODE_DELIMITER) if next_type == "code" else len(EXPLANATION_DELIMITER)
                            buffer = buffer[earliest_pos + delimiter_len:]
                        else:
                            # No delimiter found - stream all but keep potential delimiter part
                            # Keep the last max_delimiter_len characters in case they're part of a split delimiter
                            safe_to_stream = buffer[:-max_delimiter_len]
                            
                            if safe_to_stream:
                                if current_type == "explanation":
                                    explanation_text += safe_to_stream
                                else:
                                    code_text += safe_to_stream
                                
                                yield f"data: {json.dumps({'type': current_type, 'text': safe_to_stream})}\n\n"
                                buffer = buffer[-max_delimiter_len:]  # Keep potential delimiter part
                            
                            break
                
                # Process any remaining buffer content (final chunk)
                if buffer:
                    # Check one more time for delimiters in the final buffer
                    code_pos = buffer.find(CODE_DELIMITER)
                    explanation_pos = buffer.find(EXPLANATION_DELIMITER)
                    
                    # Process any remaining delimiters
                    while code_pos != -1 or explanation_pos != -1:
                        earliest_pos = -1
                        next_type = None
                        
                        if code_pos != -1 and explanation_pos != -1:
                            if code_pos < explanation_pos:
                                earliest_pos = code_pos
                                next_type = "code"
                            else:
                                earliest_pos = explanation_pos
                                next_type = "explanation"
                        elif code_pos != -1:
                            earliest_pos = code_pos
                            next_type = "code"
                        elif explanation_pos != -1:
                            earliest_pos = explanation_pos
                            next_type = "explanation"
                        
                        # Process content before delimiter
                        before_delimiter = buffer[:earliest_pos]
                        if before_delimiter:
                            if current_type == "explanation":
                                explanation_text += before_delimiter
                            else:
                                code_text += before_delimiter
                            
                            yield f"data: {json.dumps({'type': current_type, 'text': before_delimiter})}\n\n"
                        
                        # Switch type and continue
                        current_type = next_type
                        delimiter_len = len(CODE_DELIMITER) if next_type == "code" else len(EXPLANATION_DELIMITER)
                        buffer = buffer[earliest_pos + delimiter_len:]
                        
                        
                        code_pos = buffer.find(CODE_DELIMITER)
                        explanation_pos = buffer.find(EXPLANATION_DELIMITER)
                    
                    
                    if buffer:
                        if current_type == "explanation":
                            explanation_text += buffer
                        else:
                            code_text += buffer
                        
                        yield f"data: {json.dumps({'type': current_type, 'text': buffer})}\n\n"
            
            except Exception as e:
                print(f"Error processing stream: {e}")
                print(e)
                yield f"data: {json.dumps({'type': 'error', 'text': str(e)})}\n\n"
            
            
            yield f"data: {json.dumps({'type': 'done', 'request_id': request_id})}\n\n"
            clean_code = code_text.replace("\\n", "\n")
            data = {
                "explanation": explanation_text,
                "code": clean_code
            }
            content = json.dumps(data)
                        
            new_message = Message(role="model", content=content,chatId=chat_id)
            message = create_message(session, new_message)
            session.commit()
            print("message id: ",message.id)
            render_and_upload_video.delay(code_text, chat_id,request_id,message.id)

        except Exception as e:
            session.rollback()
            print(e)
            yield f"data: {json.dumps({'type': 'error', 'text': 'Database Error'})}\n\n"
            return
    return StreamingResponse(generate_stream(), media_type="text/plain")

def generateTitleFromPrompt(prompt):
    words = prompt.split(" ")
    title = " ".join(words[:8])
    if len(words) > 8:
        title += "..."
    return title
    