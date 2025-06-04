from pydantic import BaseModel, EmailStr
from typing import Optional
class UserBase(BaseModel):
    Voornaam: str
    Achternaam: str
    Email: EmailStr
    Description: Optional[str] = None
    PFP: Optional[str] = None
    Phone: Optional[str] = None

class UserRead(UserBase):
    userId: int

class UserCreate(UserBase):
    Wachtwoord: str

class UserLogin(BaseModel):
    Email: EmailStr
    Wachtwoord: str
