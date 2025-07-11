from celery import Celery

celery_app = Celery(
    "visura_tasks",  
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
)

celery_app.conf.task_routes = {
    "app.celery.tasks.render_and_upload_video": {"queue": "video_tasks"},
}
import app.celery.tasks
