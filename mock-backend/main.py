from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
import logging

# import your real/simulated muse helper (create mock-backend/fetch_data.py)
from fetch_data import start_streaming, stop_streaming

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Mock Classroom Wellbeing API")

# during development allow Vite dev server; change to ["*"] only if you need it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.on_event("startup")
def on_startup():
    logger.info("Starting Muse stream...")
    try:
        start_streaming()
        logger.info("Muse stream started.")
    except Exception:
        logger.exception("Failed to start Muse stream.")


@app.on_event("shutdown")
def on_shutdown():
    logger.info("Stopping Muse stream...")
    try:
        stop_streaming()
        logger.info("Muse stream stopped.")
    except Exception:
        logger.exception("Failed to stop Muse stream.")


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(router)