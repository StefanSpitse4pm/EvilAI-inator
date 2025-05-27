from fastapi import APIRouter
from starlette.responses import Response

router = APIRouter()
@router.get("/user")
async def get_user(response: Response):
    pass

@router.post("/user")
async def post_user():
    pass

@router.delete("/user")
async def delete_user():
    pass




