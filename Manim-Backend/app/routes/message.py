from fastapi import APIRouter,Depends,HTTPException
from app.db.models import Message
from sqlmodel import Session
from app.db.db import get_session
from sqlmodel import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter(tags=["Messages"])

@router.get('/{chatId}/messages')
async def get_chat_messages(chatId: str, session: Session = Depends(get_session)):
    """Get all messages for a chat"""
    try:
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