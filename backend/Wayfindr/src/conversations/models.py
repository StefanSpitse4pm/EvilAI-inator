from sqlalchemy import TEXT , DateTime, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from datetime import datetime

class Base(DeclarativeBase):
    pass
class Conversation(Base):
    __tablename__ = "Conversation"
    ConversationID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    UserID: Mapped[int] = mapped_column(Integer, ForeignKey("User.id"), nullable=False)
    Created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now)
class Prompt(Base):
    __tablename__ = "Prompt"
    PromptID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    Message: Mapped[str] = mapped_column(TEXT, nullable=False)
    Response: Mapped[str] = mapped_column(TEXT, nullable=False)
    ConversationID: Mapped[int] = mapped_column(Integer, ForeignKey("Conversation.id"), nullable=False)
    
    def __repr__(self):
        return f"<Prompt(id={self.id}, userID={self.userID})>"