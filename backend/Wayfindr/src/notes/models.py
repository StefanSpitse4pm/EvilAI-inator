from sqlalchemy import VARCHAR, TEXT
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase

class Base(DeclarativeBase):
    pass

class Note(Base):
    __tablename__ = "Note"

    title: Mapped[str] = mapped_column(VARCHAR(255), nullable=False)
    userID: Mapped[int] = mapped_column(nullable=False)

    def __repr__(self):
        return f"<Note(noteId={self.noteId}, title={self.title}, userId={self.userId})>"
