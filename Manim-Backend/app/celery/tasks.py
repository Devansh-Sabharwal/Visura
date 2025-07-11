from app.celery.celery import celery_app
from app.utils.video import generate_video_from_stream
from app.db.db import SessionLocal 
import asyncio
import time

@celery_app.task
def render_and_upload_video(code_text: str, chat_id: int, request_id: str, message_id: int):
    print("render and upload video called")
    session = SessionLocal()
    try:
        start = time.time()
        print("🚀 Celery task started")
        asyncio.run(generate_video_from_stream(code_text, chat_id, request_id, message_id, session))
        print(time.time()-start, "seconds taken to finish the task by Celery")
    except Exception as e:
        print(f"[VideoGen Error] for chat_id={chat_id}: {str(e)}")
    finally:
        session.close()



