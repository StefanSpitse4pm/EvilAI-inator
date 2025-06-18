from pydantic import BaseModel
from datetime import datetime


class AgendaBase(BaseModel):
    title: str
    startTime: datetime
    color: str | None = None
    category: str | None = None
    location: str | None = None  # <-- added

class AgendaCreate(AgendaBase):
    pass

class AgendaUpdate(AgendaBase):
    AgendaID: int