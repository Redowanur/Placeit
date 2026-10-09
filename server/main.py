from contextlib import asynccontextmanager
from fastapi import FastAPI
from db.database import init_db, close_db
from api.api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    try:
        yield
    finally:
        await close_db()


app = FastAPI(lifespan=lifespan)

app.include_router(api_router)