from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from starlette.responses import Response
from conversations import service
from dependencies import verify_token
from database import fetch_one, execute, fetch_all
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

@router.get("/conversations/")
async def get_conversations(payload: str = Depends(verify_token)):
    """
    Get all conversations for the authenticated user.
    """
    user_email = payload.get('sub')
    user_id = await fetch_one(select(User.userId).where(User.Email == user_email))

    if not user_id:
        return Response(status_code=404, content="User not found")
    
    conversations = await fetch_all(
        select(Conversation).where(Conversation.UserID == user_id['userId'])
    )
    
    if not conversations:
        return Response(status_code=404, content="No conversations found")
    
    return conversations

@router.get("/prompts/{conversation_id}")
async def get_prompts(conversation_id: int, payload: str = Depends(verify_token)):
    """
    Get all prompts for a specific conversation.
    """
    user_email = payload.get('sub')
    user_id = await fetch_one(select(User.userId).where(User.Email == user_email))

    if not user_id:
        return Response(status_code=404, content="User not found")
    
    prompts = await fetch_all(
        select(Prompt).where(Prompt.ConversationID == conversation_id)
    )
    
    if not prompts:
        return Response(status_code=404, content="No prompts found for this conversation")
    
    return prompts