from sqlmodel import Session, create_engine
import os
from dotenv import load_dotenv
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,  # <-- important!
        pool_recycle=3600,
        pool_size=5,
        max_overflow=10
 ) 

def get_session():
    with Session(engine) as session:
        yield session

SessionLocal = lambda: Session(engine)