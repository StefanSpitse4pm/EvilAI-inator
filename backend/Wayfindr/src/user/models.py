from sqlalchemy import VARCHAR, TEXT
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    userId: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    Voornaam: Mapped[str] = mapped_column(VARCHAR(255), unique=True, nullable=False)
    Achternaam: Mapped[str] = mapped_column(VARCHAR(255), unique=True, nullable=False)
    Wachtwoord: Mapped[str] = mapped_column(VARCHAR(128), nullable=False)
    Email: Mapped[str] = mapped_column(VARCHAR(255), unique=True, nullable=False)
    Description: Mapped[str] = mapped_column(TEXT, nullable=True)
    PFP: Mapped[str] = mapped_column(VARCHAR(255), nullable=True)
    Phone: Mapped[str] = mapped_column(VARCHAR(20), nullable=True)

    def __repr__(self):
        return f"<User(userId={self.userId}, Voornaam={self.Voornaam}, Achternaam={self.Achternaam}, Email={self.Email})>"  