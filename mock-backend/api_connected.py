"""
api_connected.py (v4 - Crash Fix)

This is the main, ML-CONNECTED backend server.

** CHANGELOG (v4) **
-   FIXED: "index 4 is out of bounds" crash.
-   Added a slice [0:4, :] to explicitly select only the 4 EEG
    channels and ignore the 5th (AUX) channel from the LSL stream.
-   Kept the DEBUG print statements.
"""
from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import random
from typing import Literal, Dict, Any
import joblib # For loading the model
import logging
import uvicorn
import math

# --- 1. Import all our project files ---
try:
    # Import data access from fetch_data module
    from fetch_data import get_latest_eeg_data, start_streaming, stop_streaming, muse_buffer
    
    # Import the REAL pipeline functions
    from ml_pipeline import (
        extract_basic_eeg_features, 
        extract_basic_ppg_features, 
        flatten_features
    )
except ImportError as e:
    print("="*50)
    print(f"FATAL ERROR: Could not import a project file: {e}")
    print("Please make sure 'api_connected.py', 'ml_pipeline.py', and 'fetch_data.py' are all in the same directory.")
    print("="*50)
    exit()


# --- 2. Configure Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# --- 3. Load the "Brain" at Startup ---
MODEL_FILENAME = "mental_state_model.pkl"
SCALER_FILENAME = "data_scaler.pkl"
try:
    model = joblib.load(MODEL_FILENAME)
    scaler = joblib.load(SCALER_FILENAME)
    logger.info("--- ML Model and Scaler loaded successfully. ---")
except FileNotFoundError:
    logger.warning(f"--- WARNING: Could not find {MODEL_FILENAME} or {SCALER_FILENAME}. ---")
    logger.warning("--- This is likely because they are in the parent folder. ---")
    logger.warning("--- Please move them into this directory. ---")
    logger.warning("--- API will run with DUMMY model. ---")
    model = None
    scaler = None

# Define the constants our pipeline needs
CHANNEL_NAMES = np.array(['TP9', 'AF7', 'AF8', 'TP10'])


# --- 4. Define API Data Models ---
class MLStateDetectionResponse(BaseModel):
    """Response model for ML state detection endpoint"""
    primary_state: str # Use str for flexibility (e.g., 'neutral')
    probabilities: dict[str, float]
    ppg_metrics: dict[str, Any] # Add ppg_metrics to the response


# --- 5. Initialize FastAPI App & Router ---
app = FastAPI(
    title="NeuroSync BCI API (ML Connected)",
    description="Backend API for Muse 2 EEG headset data processing and insights",
    version="2.0.0"
)
router = APIRouter()


# --- 6. The REAL ML Pipeline Function ---
def process_ml_state_detection(eeg_data: np.ndarray, ppg_data: np.ndarray = None) -> dict:
    """
    Process EEG data through the REAL ML pipeline.
    This function replaces the dummy one.
    """
    
    # --- Get Sampling Rates (from the buffer, with defaults) ---
    eeg_sfreq = muse_buffer.sampling_rate or 256.0
    ppg_sfreq = 64.0 # We'll assume a default if not present

    # --- 1. Run EEG Pipeline ---
    # Process the 10s chunk into 2s epochs
    eeg_epochs, _ = extract_basic_eeg_features(
        eeg_data, eeg_sfreq, CHANNEL_NAMES, 
        epoch_sec=2.0, overlap_sec=1.0 # 10s data -> 9 epochs
    )
    
    # --- 2. Run PPG Pipeline ---
    # We pass None because fetch_data.py doesn't support PPG
    ppg_features = extract_basic_ppg_features(None, ppg_sfreq)
    
    if not eeg_epochs:
        # Insufficient data, return neutral state
        logger.warning("No valid EEG epochs found in 10s chunk.")
        return {
            "primary_state": "neutral",
            "probabilities": {"focus": 0.33, "calm": 0.33, "stress": 0.0, "neutral": 0.34},
            "ppg_metrics": ppg_features
        }

    # --- 3. Flatten features ---
    X, _ = flatten_features(eeg_epochs, ppg_features, CHANNEL_NAMES)
    
    if X.shape[0] == 0:
        raise Exception("Feature flattening produced no data.")
    
    # --- 4. Scale and Predict ---
    X_scaled = scaler.transform(X)
    
    # Get probabilities for ALL epochs in the 10s chunk
    epoch_probabilities = model.predict_proba(X_scaled)
    
    # Average the probabilities across all epochs
    avg_probabilities_vec = np.mean(epoch_probabilities, axis=0)
    
    # Get the final class names and primary state
    classes = model.classes_
    primary_state = classes[np.argmax(avg_probabilities_vec)]
    
    # Build the probability dictionary
    prob_dict = {classes[i]: avg_probabilities_vec[i] for i in range(len(classes))}
    
    # --- START DEBUGGING ---
    # We will print the *average* features for the 10s chunk
    avg_features_scaled = np.mean(X_scaled, axis=0)
    # print this in a nice format, rounded to 2 decimal places
    print(f"DEBUG: Avg features (SCALED): {np.round(avg_features_scaled, 2)}")
    print(f"DEBUG: Probabilities: {np.round(avg_probabilities_vec, 2)}")
    print(f"DEBUG: Predicted State: {primary_state}")
    # --- END DEBUGGING ---
    
    # Ensure all 3 of our classes are present, even if model didn't train on one
    for state in ["focus", "calm", "stress", "neutral"]:
        if state not in prob_dict:
            prob_dict[state] = 0.0
         
    return {
        "primary_state": primary_state,
        "probabilities": prob_dict,
        "ppg_metrics": ppg_features
    }

def process_dummy_model(eeg_data: np.ndarray) -> dict:
    """The dummy model, kept as a fallback."""
    logger.info("--- Using DUMMY model ---")
    if eeg_data.size == 0:
        return {
            "primary_state": "neutral",
            "probabilities": {"focus": 0.33, "calm": 0.33, "stress": 0.0, "neutral": 0.34},
            "ppg_metrics": {"bpm": None, "rmssd": None}
        }
    
    # --- FIX: Ensure we only process 4 channels ---
    eeg_data_4ch = eeg_data[0:4, :]
    power = float(np.mean(np.square(eeg_data_4ch)))
    
    # Use tanh, a function that maps -inf to +inf to a -1 to +1 range
    # We'll center it around 50 (a guess for 'normal' power)
    score = math.tanh((power - 50.0) / 50.0)
    
    # score = -1 (low power) -> focus = 0, calm = 1
    # score = 0 (mid power)  -> focus = 0.5, calm = 0.5
    # score = +1 (high power) -> focus = 1, calm = 0
    focus = max(0.0, 0.5 + 0.5 * score)
    calm = max(0.0, 0.5 - 0.5 * score)
    neutral = max(0.0, 1.0 - (focus + calm)) # Leftover
    
    # Normalize
    total = focus + calm + neutral or 1.0
    probs = {
        "focus": focus / total, 
        "calm": calm / total, 
        "stress": 0.0, # Dummy model doesn't predict stress
        "neutral": neutral / total
    }
    
    primary = max(probs, key=probs.get)
    
    return {
        "primary_state": primary,
        "probabilities": probs,
        "ppg_metrics": {"bpm": None, "rmssd": None}
    }


# --- 7. The API Endpoints ---
@router.get("/student/insights", response_model=MLStateDetectionResponse)
def ml_detect_state(window_seconds: int = Query(10, ge=2, le=60)):
    """
    Detect mental state using ML pipeline on 10 seconds of Muse 2 data.
    """
    try:
        # Get 10 seconds of EEG data from buffer
        # Data shape from fetch_data is (channels, samples),
        # and could be 5 channels (4 EEG + 1 AUX)
        raw_eeg_from_buffer = get_latest_eeg_data(window_seconds=window_seconds)
        
        # --- FIX: Explicitly select only the first 4 channels ---
        # This drops the 5th (AUX) channel and makes our app robust
        eeg_data_ch_x_samples = raw_eeg_from_buffer[0:4, :] 
        # --- END FIX ---
        
        # Our pipeline expects (samples, channels)
        if eeg_data_ch_x_samples.shape[1] < (muse_buffer.sampling_rate * 2): # Not enough for one epoch
            logger.warning(f"Not enough data in buffer ({eeg_data_ch_x_samples.shape[1]} samples), returning neutral.")
            # Pass the 4-channel data to the dummy model
            return MLStateDetectionResponse(**process_dummy_model(eeg_data_ch_x_samples)) # Return neutral
        
        eeg_data_samples_x_ch = eeg_data_ch_x_samples.T

        # Check if streaming is active
        if muse_buffer.last_update_time is None:
            raise HTTPException(status_code=503, detail="Muse 2 streaming service not started.")

        # --- Run the REAL model if it's loaded ---
        if model and scaler:
            logger.info("Processing with REAL ML model...")
            # Pass the (samples, 4 channels) data to the real model
            result = process_ml_state_detection(eeg_data_samples_x_ch)
        else:
            # Pass the (4 channels, samples) data to the dummy model
            result = process_dummy_model(eeg_data_ch_x_samples) 

        return MLStateDetectionResponse(**result)

    except Exception as e:
        logger.exception(f"Error in ML state detection: {e}")
        raise HTTPException(status_code=500, detail=f"Error in ML state detection: {str(e)}")


@router.get("/instructor/summary")
def instructor_summary():
    """
    Get instructor dashboard summary with aggregated student metrics.
    (This is still a DUMMY endpoint)
    """
    return {
        "module": random.choice(["Module 1", "Module 2", "Module 3"]),
        "avg_focus": round(random.uniform(0.5, 0.9), 2),
        "avg_stress": round(random.uniform(0.1, 0.3), 2),
        "avg_engagement": round(random.uniform(0.5, 0.95), 2),
        "students_high_stress": random.randint(1, 5),
        "students_total": 30,
    }

@app.get("/health")
def health():
    return {"status": "ok", "muse_streaming": muse_buffer.last_update_time is not None}


# --- 8. App Configuration (CORS, Router) ---

# --- FIX: Explicitly add all likely frontend ports ---
allowed_origins = [
    "http://localhost:5173",  # Default Vite port
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # From your vite.config.ts
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)
app.include_router(router)


# --- 9. Startup/Shutdown Events ---
# (Using deprecated on_event for compatibility with user's files)
@app.on_event("startup")
async def startup_event():
    """Start the Muse 2 data streaming service when API starts"""
    logger.info("="*50)
    logger.info("Starting Muse 2 BCI API Server")
    logger.info("="*50)
    logger.info("Initializing Muse 2 streaming service...")
    try:
        start_streaming()
        logger.info("✓ Streaming service started successfully")
        logger.info("API is ready to accept requests!")
        logger.info("="*50)
    except Exception as e:
        logger.exception("⚠️  Fatal: Could not start streaming service.")
        
@app.on_event("shutdown")
def on_shutdown():
    logger.info("Stopping Muse stream...")
    try:
        stop_streaming()
        logger.info("Muse stream stopped.")
    except Exception:
        logger.exception("Failed to stop Muse stream.")


# --- 10. Main execution ---
if __name__ == "__main__":
    print("\n🚀 Starting Muse 2 BCI API Server...")
    print("   Please ensure muselsl is streaming in another terminal.")
    print("   Test in browser: http://127.0.0.1:8000/student/insights")
    print("   API Docs: http://127.0.0.1:8000/docs")
    print("\n")
    
    uvicorn.run(
        "api_connected:app", 
        host="127.0.0.1",
        port=8000,
        log_level="info",
        reload=True 
    )