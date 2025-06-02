from fastapi import APIRouter, Depends
from starlette.responses import Response
from dependencies import verify_token  # Adjust the import if dependencies.py is in the parent directory
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

@router.get("/notes")
async def get_notes(token: str = Depends(oauth2_scheme)):
    """
    Get all notes
    """
    user = verify_token(token)
    print(f"User: {user}")  