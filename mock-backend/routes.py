from fastapi import APIRouter, Query
import numpy as np
from typing import Dict, Any
from fetch_data import get_latest_eeg_data, muse_buffer

router = APIRouter()

@router.get("/student/insights")
def student_insights(window_seconds: int = Query(5, ge=1, le=60)) -> Dict[str, Any]:
    """
    Return a small ML-style summary based on the last `window_seconds` of EEG.
    Frontend can call /student/insights?window_seconds=5
    """
    eeg = get_latest_eeg_data(window_seconds)  # shape: (channels, samples)
    if eeg.size == 0:
        return {
            "primary_state": "neutral",
            "probabilities": {"focus": 0.33, "relax": 0.33, "neutral": 0.34},
            "timestamp": muse_buffer.last_update_time,
        }

    # simple signal feature -> proxy probabilities (replace with your model later)
    power = float(np.mean(np.square(eeg)))  # mean squared amplitude
    # map power to probabilities: arbitrary mapping for demo
    # (tweak thresholds/scale to match your real data later)
    import math
    score = math.tanh((power - 50.0) / 50.0)  # -1..1
    focus = max(0.0, 0.5 - 0.5 * score)
    relax = max(0.0, 0.5 + 0.5 * score)
    neutral = max(0.0, 1.0 - (focus + relax))
    total = focus + relax + neutral or 1.0
    probs = {"focus": focus / total, "relax": relax / total, "neutral": neutral / total}
    primary = max(probs, key=probs.get)

    return {
        "primary_state": primary,
        "probabilities": probs,
        "power": power,
        "timestamp": muse_buffer.last_update_time,
    }