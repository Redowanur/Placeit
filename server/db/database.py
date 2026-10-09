from beanie import init_beanie
from pymongo import AsyncMongoClient

from models.users import User

client: AsyncMongoClient | None = None


async def init_db():
    global client

    client = AsyncMongoClient("mongodb://localhost:27018")

    await init_beanie(
        database=client["placement_portal"],
        document_models=[User],
    )


async def close_db():
    if client is not None:
        await client.close()