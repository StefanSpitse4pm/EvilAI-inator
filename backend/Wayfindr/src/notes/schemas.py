from pydantic import BaseModel

class NoteBase(BaseModel):
    title: str
    content: str
    color: str

class NoteUpdate(NoteBase):
    id: int