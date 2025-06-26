from sqlmodel import  Field, Relationship
from sqlmodel import SQLModel
from typing import Optional, List
from datetime import datetime, timezone
import uuid

class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True)
    password: Optional[str] = None
    name: Optional[str]
    googleId: Optional[str] = Field(default=None, unique=True)
    image: Optional[str]
    createdAt : datetime = Field(default_factory=datetime.now)
    chats: List["Chat"] = Relationship(back_populates="user")


class Chat(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    title: Optional[str]
    userId: str = Field(foreign_key="user.id")
    createdAt : datetime = Field(default_factory=datetime.now)
    user: User = Relationship(back_populates="chats")
    messages: List["Message"] = Relationship(back_populates="chat")
    videos: List["ManimVideo"] = Relationship(back_populates="chat")


class Message(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    chatId: str = Field(foreign_key="chat.id")
    video_id: Optional[str] = Field(default=None, foreign_key="manimvideo.id")
    role: str
    content: str
    createdAt : datetime = Field(default_factory=datetime.now)
    chat: Chat = Relationship(back_populates="messages")
    video: Optional["ManimVideo"] = Relationship(back_populates="message")


class ManimVideo(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    chatId: str = Field(foreign_key="chat.id")
    url: str
    title: Optional[str]
    createdAt : datetime = Field(default_factory=datetime.now)
    chat: Chat = Relationship(back_populates="videos")
    message: Optional["Message"] = Relationship(back_populates="video")
