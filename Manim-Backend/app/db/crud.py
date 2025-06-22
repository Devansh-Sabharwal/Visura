from sqlmodel import Session, select
from app.db.models import User,Message,Chat,ManimVideo


def get_user_by_email(session: Session, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    return session.exec(stmt).first()

def create_user(session: Session, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def create_message(session:Session,message:Message)->Message:
    session.add(message)
    return message

def create_video(session:Session,video:ManimVideo):
    session.add(video)
    session.commit()


def getContext(session: Session, chatId: str, limit: int = 3):
    stmt = (
        select(Message)
        .where(Message.chatId == chatId)
        .order_by(Message.createdAt.desc())  
        .limit(limit)
    )
    messages = session.exec(stmt).all()[::-1] 

    context = []
    for msg in messages:
        context.append({"role": msg.role, "content": msg.content}) 

    return context