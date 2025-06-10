from sqlmodel import Session, create_engine
import os
from dotenv import load_dotenv
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=False) 

def get_session():
    with Session(engine) as session:
        yield session