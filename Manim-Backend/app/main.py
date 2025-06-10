from app.routes import auth, chat
from fastapi import FastAPI
app = FastAPI(title="Manim")
from app.middleware.middleware import auth_middleware 

app.middleware("http")(auth_middleware)
app.include_router(auth.router) 
app.include_router(chat.router)  

