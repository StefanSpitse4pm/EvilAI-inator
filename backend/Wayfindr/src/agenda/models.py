from sqlalchemy import  VARCHAR, DateTime, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from datetime import datetime

class Base(DeclarativeBase):
    pass
class Agenda(Base):
    __tablename__ = "Agenda"
    AgendaID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    UserID: Mapped[int] = mapped_column(Integer, ForeignKey("User.userId"), nullable=False)
    startTime: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    title: Mapped[str] = mapped_column(VARCHAR(255), nullable=False)
    color: Mapped[str] = mapped_column(VARCHAR(7), nullable=True)
    category: Mapped[str] = mapped_column(VARCHAR(30), nullable=True)
    location: Mapped[str] = mapped_column(VARCHAR(255), nullable=True)