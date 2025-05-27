from fastapi import APIRouter
from starlette.responses import Response
from database import fetch_one
from sqlalchemy import select
from user.models import User


router = APIRouter()
@router.get("/user/{user_id}")
async def get_user(user_id: int):
    return await fetch_one(select(User).where(User.userId == user_id))


@router.post("/user/")
async def post_user():
    pass

@router.post("/login")
async def post_user():
    pass

@router.delete("/user")
async def delete_user():
    pass




