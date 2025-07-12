from celery import Celery
from dotenv import load_dotenv
load_dotenv()
import os
celery_app = Celery(
    "visura_tasks",  
    broker=os.getenv("CELERY_BROKER_URL"),
    backend=os.getenv("CELERY_BACKEND_URL"),
)

celery_app.conf.task_routes = {
    "app.celery.tasks.render_and_upload_video": {"queue": "video_tasks"},
}
import app.celery.tasks
