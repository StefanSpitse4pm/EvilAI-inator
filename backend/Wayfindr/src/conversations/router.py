from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from starlette.responses import Response
from conversations import service
from dependencies import verify_token
from database import fetch_one, execute
from sqlalchemy import select
from user.models import User
from conversations.models import Conversation, Prompt

router = APIRouter()

@router.delete("/conversation/{conversation_id}")
async def delete_conversation(conversation_id: int, payload: str = Depends(verify_token)):
    """
    Delete a conversation by its ID.
    """
    user_email = payload.get('sub')
    user_id = await fetch_one(select(User.userId).where(User.Email == user_email))
    
    if not user_id:
        return Response(status_code=404, content="User not found")
    
    await execute(Prompt.__table__.delete().where(Prompt.ConversationID == conversation_id), commit=True)

    result = await execute(
        Conversation.__table__.delete().where(
            Conversation.ConversationID == conversation_id,
            Conversation.UserID == user_id['userId']
        ),
        commit=True
    )
    
    if result.rowcount == 0:
        return Response(status_code=404, content="Conversation not found or not owned by user")
    
    return Response(status_code=204)

@router.post("/ask")
async def ask(message: str, conversation_id: int, payload: str = Depends(verify_token)):
    """
    Ask a question to the AI buddy.
    """
    user_email = payload.get('sub')
    user_id = await fetch_one(select(User.userId).where(User.Email == user_email))
    if not user_id:
        return Response(status_code=404, content="User not found")
    
    ai = service.AIbuddy()
    return StreamingResponse(
        ai.ask_ai(message, conversation_id),
        media_type="text/event-stream")

@router.post("/conversation")
async def create_conversation(payload: str = Depends(verify_token)):
    """
    Create a new conversation.
    """
    user_email = payload.get('sub')
    user_id = await fetch_one(select(User.userId).where(User.Email == user_email))

    if not user_id:
        return Response(status_code=404, content="User not found")
    new_conversation = Conversation(UserID=user_id['userId'])
    result = await execute(
        Conversation.__table__.insert().values(
            UserID=new_conversation.UserID,
        ),
        commit=True
    )
    return {"conversation_id": result.lastrowid}


