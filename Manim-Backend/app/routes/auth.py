from fastapi import APIRouter,Depends,HTTPException
from app.db.models import User
from sqlmodel import Session
from app.db.db import get_session
from app.db.crud import get_user_by_email,create_user
from sqlalchemy.exc import SQLAlchemyError
from passlib.context import CryptContext
from app.utils.jwt import create_access_token
from pydantic import BaseModel, EmailStr

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleUser(BaseModel):
    email: EmailStr
    name: str | None = None
    googleId: str
    image: str | None = None

router = APIRouter(prefix="/auth",tags=["auth"])

@router.post("/signup",status_code=201)
async def signup(req: UserCreate, session: Session = Depends(get_session)):
    try:
        user = get_user_by_email(session, req.email)
        if user:
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed_password = pwd_context.hash(req.password)
        user_data = req.model_dump()
        user_data["password"] = hashed_password
        new_user = User(**user_data)
        
        return create_user(session, new_user)

        
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail="Database error"
        ) from e

@router.post("/signin",status_code=200)
async def signin(req:UserLogin,session:Session=Depends(get_session)):
    try:
        user = get_user_by_email(session,req.email)
        if(user):
            password = req.password
            hashed_password = user.password
            if pwd_context.verify(password, hashed_password):
                token = create_access_token({"id": user.id})
                return {
                    "token": token,
                    "token_type": "bearer",
                    "name":user.name,
                     "id":user.id
                }
            else:
                if user.password is None:
                    raise HTTPException(status_code=401, detail="Try Signin with Google")
                else :
                    raise HTTPException(status_code=401, detail="Incorrect Password")

        else:
            raise HTTPException(status_code=400, detail="Email not registered")
        
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail="Database error"
        ) from e
    

@router.post("/google")
def google_auth(req:GoogleUser,session:Session=Depends(get_session)):
    try:
        user = get_user_by_email(session,req.email)
        if(user):
            token = create_access_token({"id": user.id})
            return {
                    "token": token,
                    "token_type": "bearer",
                    "name":user.name,
                     "id":user.id
                }

        else:
            user_data = req.model_dump()
            new_user = User(**user_data)
            user = create_user(session, new_user)
            token = create_access_token({"id": user.id})
            return {
                    "token": token,
                    "token_type": "bearer",
                    "name":user.name,
                     "id":user.id
            }
        
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail="Database error"
        ) from e
        
    

