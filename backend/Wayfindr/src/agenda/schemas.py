from pydantic import BaseModel
from datetime import datetime


class AgendaBase(BaseModel):
    title: str
    startTime: datetime
    endTime: datetime

class AgendaCreate(AgendaBase):
    pass

class AgendaUpdate(AgendaBase):
    AgendaID: int