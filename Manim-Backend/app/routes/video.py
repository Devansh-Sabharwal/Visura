from fastapi import APIRouter,Depends,HTTPException
from sqlmodel import Session
from app.db.db import get_session
from app.db.models import ManimVideo
from sqlmodel import select

router = APIRouter(tags=["video"])

@router.get("/videos/{request_id}")
def get_video_by_request_id(request_id: str, session: Session = Depends(get_session)):
    video = session.exec(
        select(ManimVideo).where(ManimVideo.id == request_id)
    ).first()

    if not video:
        raise HTTPException(status_code=404, detail="Video not ready")

    return {"video_url": video.url}
