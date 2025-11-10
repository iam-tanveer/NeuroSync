from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel
import numpy as np
import random
from typing import Literal

# Import data access from fetch_data module
from fetch_data import get_latest_eeg_data, start_streaming, muse_buffer


# Pydantic models for API responses
class MLStateDetectionResponse(BaseModel):
    """Response model for ML state detection endpoint"""
    primary_state: Literal["focus", "relax", "neutral"]
    probabilities: dict[str, float]


# Initialize FastAPI app
app = FastAPI(
    title="Muse 2 BCI API",
    description="Backend API for Muse 2 EEG headset data processing and insights",
    version="1.0.0"
)

# Create router
router = APIRouter()


# ML Pipeline for State Detection
def process_ml_state_detection(eeg_data: np.ndarray) -> dict:
    """
    Process EEG data through ML pipeline for state detection.

    Pipeline steps:
    1. Data validation and cleaning
    2. Feature extraction (band power, statistical features)
    3. ML model inference
    4. Probability calculation and state determination

    This is a DUMMY implementation. In production, replace with:
    - Proper signal preprocessing (filtering, artifact removal)
    - Feature extraction (PSD, band powers, entropy, etc.)
    - Trained ML model (e.g., Random Forest, Neural Network)

    Args:
        eeg_data: numpy array with shape (4, n_samples) for [TP9, AF7, AF8, TP10]

    Returns:
        dict with keys: primary_state, probabilities
    """

    # Step 1: Data validation and cleaning
    if eeg_data.shape[1] < 100:
        # Insufficient data, return neutral state
        return {
            "primary_state": "neutral",
            "probabilities": {
                "focus": 0.33,
                "relax": 0.33,
                "neutral": 0.34
            }
        }

    # Step 2: Feature extraction (dummy - using simple statistics)
    # In production: extract band powers (delta, theta, alpha, beta, gamma)
    mean_amplitude = np.mean(np.abs(eeg_data))
    std_amplitude = np.std(eeg_data)
    signal_variance = np.var(eeg_data, axis=1).mean()

    # Step 3: ML Model Inference (dummy - using heuristics)
    # In production: load and run trained model

    # Calculate pseudo-probabilities based on signal characteristics
    # High variance + high mean = focus state
    # Low variance + low std = relax state
    # Otherwise = neutral state

    focus_score = min(1.0, (signal_variance / 5000) + (mean_amplitude / 2000))
    relax_score = min(1.0, max(0.1, 1.0 - (std_amplitude / 300)))
    neutral_score = 1.0 - abs(focus_score - 0.5) * 0.5

    # Normalize to sum to 1.0
    total = focus_score + relax_score + neutral_score
    probabilities = {
        "focus": round(focus_score / total, 2),
        "relax": round(relax_score / total, 2),
        "neutral": round(neutral_score / total, 2)
    }

    # Determine primary state (highest probability)
    primary_state = max(probabilities, key=probabilities.get)

    return {
        "primary_state": primary_state,
        "probabilities": probabilities
    }


# API Endpoints
@router.get("/student/insights", response_model=MLStateDetectionResponse)
def ml_detect_state():
    """
    Detect mental state using ML pipeline on 10 seconds of Muse 2 data.

    Data flow:
    1. Input: 10 seconds of Muse 2 EEG data
    2. Processing: Pipeline cleans data and runs through ML algorithm
    3. Output: Primary state and probability distribution

    Returns:
        MLStateDetectionResponse: Primary state and probabilities for focus, relax, neutral
    """
    try:
        # Get 10 seconds of EEG data from buffer
        eeg_data = get_latest_eeg_data(window_seconds=10)

        # Check if streaming is active
        last_update = muse_buffer.last_update_time
        if last_update is None:
            raise HTTPException(
                status_code=503,
                detail="Muse 2 streaming service not started. Please start fetch_data.py first."
            )

        # Process through ML pipeline
        result = process_ml_state_detection(eeg_data)

        return MLStateDetectionResponse(**result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in ML state detection: {str(e)}")


@router.get("/instructor/summary")
def instructor_summary():
    """
    Get instructor dashboard summary with aggregated student metrics.

    Returns:
        dict: Summary statistics including module info and aggregated metrics
    """
    return {
        "module": random.choice(["module 1", "Module 2", "Module 3", "Module 4"]),
        "avg_focus": round(random.uniform(0.5, 0.9), 2),
        "avg_stress": round(random.uniform(0.3, 0.8), 2),
        "avg_engagement": round(random.uniform(0.5, 0.95), 2),
        "students_high_stress": random.randint(5, 25),
        "students_total": 30,
    }


# Include router in app
app.include_router(router)


# Startup event to begin streaming
@app.on_event("startup")
async def startup_event():
    """Start the Muse 2 data streaming service when API starts"""
    print("\n" + "="*50)
    print("Starting Muse 2 BCI API Server")
    print("="*50)
    print("\nInitializing Muse 2 streaming service...")
    try:
        start_streaming()
        print("✓ Streaming service started successfully")
        print("\nAPI is ready to accept requests!")
        print("="*50 + "\n")
    except Exception as e:
        print(f"⚠️  Warning: Could not start streaming service: {e}")
        print("API will still run, but /ml/detect-state will return errors until streaming is started manually.")
        print("="*50 + "\n")


# Main execution
if __name__ == "__main__":
    import uvicorn

    print("\n🚀 Starting Muse 2 BCI API Server...")
    print("📡 The streaming service will start automatically\n")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
