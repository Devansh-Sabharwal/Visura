from fastapi import APIRouter,Depends,HTTPException
from fastapi import Request
from sqlmodel import Session
from sqlalchemy.exc import SQLAlchemyError
from app.db.db import get_session
from pydantic import BaseModel
from app.db.models import Message,Chat
from app.db.crud import create_message,getContext
from app.utils.video import generate_video
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
        session.rollback()
        raise HTTPException(
            status_code=500, 
            detail="Database error occurred"
        ) from e
        
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=501,detail=f"Error in Video generation try again: {str(e)}")

@router.get('/{chatId}/messages')
async def get_chat_messages(chatId: str, session: Session = Depends(get_session)):
    """Get all messages for a chat"""
    messages = session.exec(
        select(Message)
        .where(Message.chatId == chatId)
        .where(Message.role.in_(["user", "assistant", "system"]))
        .order_by(Message.created_at)
    ).all()
    
    return {
        "chatId": chatId,
        "messages": [
            {
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.created_at
            }
            for msg in messages
        ]
    }