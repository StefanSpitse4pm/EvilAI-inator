from fastapi import APIRouter
from starlette.responses import Response
from database import fetch_one, execute
from sqlalchemy import select
from user.models import User
from user.schemas import UserBase, UserCreate, UserRead, UserLogin
from user.service import get_password_hash, verify_password, create_access_token
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter()
@router.get("/user/{user_id}")
async def get_user(user_id: int):
    """
    Get user by user_id
    """
    return await fetch_one(select(User).where(User.userId == user_id))


@router.post("/user/", response_model=UserRead)
async def post_user(user: UserCreate):
    """
    Create a new user
    """
    db_user = await fetch_one(
        select(User).where(User.Email == user.Email))

    if db_user:
        return Response(status_code=400, content={"detail":[{"msg":"User already exists"}]})
    new_user = User(
        Voornaam=user.Voornaam,
        Achternaam=user.Achternaam,
        Wachtwoord=user.Wachtwoord,
        Email=user.Email,
        Description=user.Description,
        PFP=user.PFP,
        Phone=user.Phone
    )

    await execute(
        User.__table__.insert().values(
            Voornaam=new_user.Voornaam,
            Achternaam=new_user.Achternaam,
            Wachtwoord=get_password_hash(new_user.Wachtwoord),
            Email=new_user.Email,
            Description=new_user.Description,
            PFP=new_user.PFP,
            Phone=new_user.Phone
        ),
        commit=True
    )

    new_user = await fetch_one(select(User).where(User.Email == user.Email))
    if not new_user:
        return JSONResponse(status_code=500, content={"detail":[{"msg":"Failed to create user"}]})
    
    return UserRead(
        userId=new_user['userId'],
        Voornaam=new_user['Voornaam'],
        Achternaam=new_user['Achternaam'],
        Email=new_user['Email'],
    )

@router.post("/login")
async def login(user: UserLogin):
    """
    Login user
    """
    db_user = await fetch_one(
        select(User).where(User.Email == user.Email))

    if not db_user or not verify_password(user.Wachtwoord, db_user['Wachtwoord']):
        return Response(status_code=401, content={"detail":[{"msg":"Invalid credentials"}]})
    
    access_token = create_access_token(data={"sub": db_user['Email']}) 
    return {"access_token": access_token, "token_type": "bearer"}


@router.delete("/user/{user_id}", status_code=204)
async def delete_user(user_id: int):
    """
    Delete user by user_id
    """
    db_user = await fetch_one(select(User).where(User.userId == user_id))
    if not db_user:
        return Response(status_code=404, content={"detail":[{"msg":"User not found"}]})
    
    await execute(
        User.__table__.delete().where(User.userId == user_id),
        commit=True
    )
    return Response(status_code=204, content={"detail":[{"msg":"User deleted successfully"}]})




