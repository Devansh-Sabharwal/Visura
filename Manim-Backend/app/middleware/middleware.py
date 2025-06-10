from fastapi import Request
from fastapi.responses import JSONResponse
from app.utils.jwt import verify_access_token
from jose import JWTError
async def auth_middleware(request: Request, call_next):
    # List of paths that don't require authentication
    public_paths = [
        "/auth/signin",
        "/auth/google", 
        "/auth/signup",
        "/docs",
        "/redoc",
        "/openapi.json",
        "/favicon.ico"
    ]
    
    # Skip auth for public paths
    if any(request.url.path.startswith(path) for path in public_paths):
        return await call_next(request)

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse(status_code=401, content={"detail": "Unauthorized"})

    token = auth_header.split(" ")[1]
    try:
        payload = verify_access_token(token)
        if not payload or "id" not in payload:
            return JSONResponse(status_code=401, content={"detail": "Invalid token payload"})
        
        request.state.user_id = payload["id"]
        return await call_next(request)
    except JWTError as e:  
        return JSONResponse(status_code=401, content={"detail": "Invalid token"})
    
