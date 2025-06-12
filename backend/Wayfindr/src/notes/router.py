from fastapi import APIRouter, Depends, HTTPException
from dependencies import verify_token  
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from database import fetch_one, fetch_all, execute
from sqlalchemy import select
from notes.models import Note  
from user.models import User
from notes.schemas import NoteBase, NoteUpdate
from fastapi import Response

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


@router.post("/note")
async def create_note(note: NoteBase, payload: str = Depends(verify_token)):
    """
    Create a new note for the authenticated user.
    """
    user_email = payload.get('sub')
    user_id = await fetch_one(
        select(User.userId).where(User.Email == user_email)
    )
    
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")

    new_note = Note(
        title=note.title,
        note=note.content,
        color=note.color,
        userID=user_id['userId']
    )

    await execute(
        Note.__table__.insert().values(
            title=new_note.title,
            note=new_note.note,
            color=new_note.color,
            userID=new_note.userID
        ),
        commit=True
    )
    
    return Response(status_code=201, content="Note created successfully")

@router.get("/note")
async def get_note(payload: str = Depends(verify_token)):
    """
    Get all notes by the authenticated user.
    """
    user_email = payload.get('sub')
    user_id = await fetch_one(
        select(User.userId).where(User.Email == user_email)
    )
    notes = await fetch_all(
        select(Note).where(Note.userID == user_id['userId'])
    )
    return notes


@router.put("/note")
async def update_note(note: NoteUpdate, payload: str = Depends(verify_token)):
    """
    Update an existing note for the authenticated user.
    """
    user_email = payload.get('sub')
    user_id = await fetch_one(
        select(User.userId).where(User.Email == user_email)
    )
    
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")

    updated_note = Note(
        title=note.title,
        note=note.content,
        color=note.color,
        userID=user_id['userId']
    )

    await execute(
        Note.__table__.update().where(Note.id == note.id).values(
            title=updated_note.title,
            note=updated_note.note,
            color=updated_note.color,
            userID=updated_note.userID
        ),
        commit=True
    )
    
    return Response(status_code=200, content="Note updated successfully")

@router.delete("/note/{note_id}")
async def delete_note(note_id: int, payload: str = Depends(verify_token)):
    """
    Delete a note by note_id for the authenticated user.
    """
    user_email = payload.get('sub')
    user_id = await fetch_one(
        select(User.userId).where(User.Email == user_email)
    )
    
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")

    note = await fetch_one(
        select(Note).where(Note.id == note_id, Note.userID == user_id['userId'])
    )
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    await execute(
        Note.__table__.delete().where(Note.id == note_id),
        commit=True
    )
    
    return Response(status_code=204, content="Note deleted successfully")