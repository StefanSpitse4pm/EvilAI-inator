from typing import Any, AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncConnection
from sqlalchemy import  (Insert, Select, Update)
from config import settings

engine = create_async_engine(settings.MYSQL_DATABASE_URI)

async def fetch_one(query: Insert | Select | Update, connection: AsyncConnection | None = None, commit: bool = False) -> dict[str, Any]:
    if connection is None:
        async with engine.connect() as connection:
            cursor = await _execute_query(query, connection, commit)
            return cursor.first()._asdict() if cursor.rowcount > 0 else None

    cursor = await _execute_query(query, connection, commit)
    return cursor.first()._asdict() if cursor.rowcount > 0 else None


async def fetch_all(query: Insert | Select | Update, connection: AsyncConnection | None = None, commit: bool = False) -> list[dict[str, Any]]:
    if connection is None:
        async with engine.connect() as connection:
            cursor = await _execute_query(query, connection, commit)
            return [r._asdict() for r in cursor.all()]

    cursor = await _execute_query(query, connection, commit)
    return [r._asdict() for r in cursor.all()]


async def execute(query: Insert | Update, connection: AsyncConnection | None = None, commit: bool = False) -> None:
    if connection is None:
        async with engine.connect() as connection:
            await _execute_query(query, connection, commit)
            return
    await _execute_query(query, connection, commit)


async def _execute_query(query: Insert | Select | Update, connection: AsyncConnection, commit: bool):
    result = await connection.execute(query)
    if commit:
        await connection.commit()
    return result


async def get_db_connection() -> AsyncGenerator[AsyncConnection, Any]:
    connection = await engine.connect()
    try:
        yield connection
    finally:
        await connection.close()