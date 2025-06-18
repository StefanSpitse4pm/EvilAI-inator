from conversations.router import router as conversations_route
from notes.router import router as notes_route
from user.router import router as user_route
from agenda.router import router as agenda_route
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# project: Wayfindr

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_route)
app.include_router(notes_route)
app.include_router(conversations_route)
app.include_router(agenda_route)
