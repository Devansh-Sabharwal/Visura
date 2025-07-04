from app.routes import auth, chat,video,message
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import FastAPI
app = FastAPI(title="Manim")
from app.middleware.middleware import auth_middleware 

origins = [
    "http://localhost:3000",
    "https://your-frontend-domain.com", 
]

@app.get("/ping", tags=["Health"])
async def ping():
    return JSONResponse(content={"message": "pong", "status": "ok"})

app.middleware("http")(auth_middleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(auth.router) 
app.include_router(chat.router)  
app.include_router(message.router)
app.include_router(video.router)

