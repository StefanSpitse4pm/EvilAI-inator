from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from dependencies import verify_token
from database import fetch_one, fetch_all, execute
from user.models import User
from agenda.models import Agenda
from agenda.schemas import AgendaCreate, AgendaUpdate
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


@router.post("/agenda", status_code=201)
async def create_agenda(item: AgendaCreate, payload: dict = Depends(verify_token)):
    user_email = payload.get('sub')
    user = await fetch_one(select(User.userId).where(User.Email == user_email))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    agenda = Agenda(
        UserID=user['userId'],
        title=item.title,
        startTime=item.startTime,
        color=item.color,
        category=item.category,
        location=item.location  # <-- added
    )
    await execute(
        Agenda.__table__.insert().values(
            UserID=agenda.UserID,
            title=agenda.title,
            startTime=agenda.startTime,
            color=agenda.color,
            category=agenda.category,
            location=agenda.location  # <-- added
        ),
        commit=True
    )
    return {"msg": "Agenda created"}

@router.get("/agenda")
async def get_agendas(payload: dict = Depends(verify_token)):
    user_email = payload.get('sub')
    user = await fetch_one(select(User.userId).where(User.Email == user_email))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    agendas = await fetch_all(select(Agenda).where(Agenda.UserID == user['userId']))
    return agendas

@router.put("/agenda", status_code=200)
async def update_agenda(item: AgendaUpdate, payload: dict = Depends(verify_token)):
    user_email = payload.get('sub')
    user = await fetch_one(select(User.userId).where(User.Email == user_email))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    agenda = await fetch_one(select(Agenda).where(Agenda.AgendaID == item.AgendaID, Agenda.UserID == user['userId']))
    if not agenda:
        raise HTTPException(status_code=404, detail="Agenda not found")
    await execute(
        Agenda.__table__.update().where(
            Agenda.AgendaID == item.AgendaID,
            Agenda.UserID == user['userId']
        ).values(
            title=item.title,
            startTime=item.startTime,
            color=item.color,
            category=item.category,
            location=item.location  # <-- added
        ),
        commit=True
    )
    return {"msg": "Agenda updated"}

@router.delete("/agenda/{agenda_id}", status_code=204)
async def delete_agenda(agenda_id: int, payload: dict = Depends(verify_token)):
    user_email = payload.get('sub')
    user = await fetch_one(select(User.userId).where(User.Email == user_email))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    agenda = await fetch_one(select(Agenda).where(Agenda.AgendaID == agenda_id, Agenda.UserID == user['userId']))
    if not agenda:
        raise HTTPException(status_code=404, detail="Agenda not found")
    await execute(
        Agenda.__table__.delete().where(
            Agenda.AgendaID == agenda_id,
            Agenda.UserID == user['userId']
        ),
        commit=True
    )
    return Response(status_code=204)

