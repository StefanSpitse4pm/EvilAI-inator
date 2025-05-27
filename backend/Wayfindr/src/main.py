from .conversations.router import router as conversations_route
from .notes.router import router as notes_route
from .user.router import router as user_route
from .user.router import router as user_route
from fastapi import FastAPI

# project: Wayfindr

app = FastAPI()

app.include_router(user_route)
  app.include_router(user_route)
  app.include_router(notes_route)
  app.include_router(conversations_route)
  