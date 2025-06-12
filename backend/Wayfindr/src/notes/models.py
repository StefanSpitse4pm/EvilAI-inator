from sqlalchemy import VARCHAR, TEXT, DateTime, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, relationship
from datetime import datetime

class Base(DeclarativeBase):
    pass

class Note(Base):
    __tablename__ = "Note"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(VARCHAR(255), nullable=False)
    note: Mapped[str] = mapped_column(TEXT, nullable=False)
    color: Mapped[str] = mapped_column(VARCHAR(7), nullable=False)
    userID: Mapped[int] = mapped_column(Integer, ForeignKey("User.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now, onupdate=datetime.now)

    def __repr__(self):
        return f"<Note(id={self.id}, title={self.title}, userID={self.userID})>"



