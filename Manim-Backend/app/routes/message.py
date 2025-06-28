from fastapi import APIRouter,Depends,HTTPException
from app.db.models import Message,Chat
from sqlmodel import Session
from app.db.db import get_session
from sqlmodel import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import SQLAlchemyError
from fastapi.responses import JSONResponse
from fastapi import Request

router = APIRouter(tags=["Messages"])

@router.get('/{chatId}/messages')
async def get_chat_messages(chatId: str, req: Request,session: Session = Depends(get_session)):
    """Get all messages for a chat"""
    user_id = req.state.user_id
    try:
        chat = session.exec(select(Chat).where(Chat.id == chatId,Chat.userId==user_id)).first()
        if not chat:
            return JSONResponse(status_code=400,content={"message":"Page Not found"})
            
        messages = session.exec(
            select(Message)
            .where(Message.chatId == chatId)
            .options(selectinload(Message.video))
            .order_by(Message.createdAt)
        ).all()
        
        return {
            "chatId": chatId,
            "messages": [
                {
                    "role": msg.role,
                    "content": msg.content,
                    "timestamp": msg.createdAt,
                    "video_url": msg.video.url if msg.video else None

                }
                for msg in messages
            ]
        }
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail="Database error"
        ) from e
    
@router.get('/chats/history')
async def get_all_chats(req:Request,session:Session=Depends(get_session)):
    user_id = req.state.user_id
    try:
        chats = session.exec(select(Chat).where(Chat.userId==user_id)).all()
        return {
            "chats": [{
                "chatId":chat.id,
                "title":chat.title,
                "createdAt":chat.createdAt
            }
            for chat in chats]
        }
        
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail="Database error"
        ) from e
    