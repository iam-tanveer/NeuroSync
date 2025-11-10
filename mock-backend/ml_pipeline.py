"""
ml_pipeline.py
Reusable functions for the NeuroSync ML pipeline.

** CHANGELOG (v2) **
- Handles missing PPG data gracefully.
"""
import numpy as np
import heartpy as hp
from scipy.signal import butter, filtfilt, iirnotch, welch
from scipy.integrate import trapezoid
import json

def extract_basic_eeg_features(eeg_data, eeg_sfreq, channel_names, epoch_sec=2.0, overlap_sec=1.0):
    """
    Applies minimal filtering and extracts features from ALL epochs.
    No artifact rejection.
    """

    # --- Step 1: Filtering (Non-negotiable) ---
    eeg_referenced = eeg_data
    try:
        tp9_idx = np.where(channel_names == 'TP9')[0][0]
        tp10_idx = np.where(channel_names == 'TP10')[0][0]
        tp_avg = eeg_data[:, [tp9_idx, tp10_idx]].mean(axis=1, keepdims=True)
        eeg_referenced = eeg_data - tp_avg
    except Exception:
        print("Could not re-reference EEG. Using original data.")

    # Bandpass filter (1-45 Hz)
    bp_low, bp_high = 1.0, 45.0
    nyquist = 0.5 * eeg_sfreq
    b, a = butter(N=4, Wn=[bp_low/nyquist, bp_high/nyquist], btype='bandpass')
    eeg_bandpassed = filtfilt(b, a, eeg_referenced, axis=0)

    # Notch filter (50 Hz)
    notch_freq, Q = 50.0, 30
    b_notch, a_notch = iirnotch(notch_freq, Q, fs=eeg_sfreq) 
    filtered_eeg = filtfilt(b_notch, a_notch, eeg_bandpassed, axis=0)

    # --- Step 2: Epoch & Extract Features (from ALL epochs) ---
    BANDS = {
        'delta': [1, 4],
        'theta': [4, 8],
        'alpha': [8, 12],
        'beta': [12, 30],
        'gamma': [30, 45]
    }

    epoch_samples = int(epoch_sec * eeg_sfreq)
    overlap_samples = int(overlap_sec * eeg_sfreq)
    step_samples = epoch_samples - overlap_samples

    all_epochs_features = [] # List to hold feature dicts

    for start in range(0, filtered_eeg.shape[0] - epoch_samples + 1, step_samples):
        end = start + epoch_samples
        epoch_data = filtered_eeg[start:end, :]

        epoch_features = {'start_time_sec': start / eeg_sfreq}

        for ch_idx in range(eeg_data.shape[1]):
            ch_name = channel_names[ch_idx] 
            freqs, psd = welch(epoch_data[:, ch_idx], fs=eeg_sfreq, nperseg=epoch_samples)

            ch_features = {}
            for band, (low, high) in BANDS.items():
                band_mask = (freqs >= low) & (freqs <= high)
                if not np.any(band_mask):
                    band_power = 0.0
                else:
                    band_power = trapezoid(psd[band_mask], freqs[band_mask])

                ch_features[band] = band_power

            epoch_features[ch_name] = ch_features

        all_epochs_features.append(epoch_features)

    return all_epochs_features, filtered_eeg


def extract_basic_ppg_features(ppg_data, sfreq):
    """
    Extracts basic time-domain HRV features.
    Gracefully handles empty or invalid data.
    """
    basic_measures = {
        'bpm': None,
        'rmssd': None
    }

    # --- FIX: Handle missing PPG data ---
    if ppg_data is None or ppg_data.size == 0:
        # This is now expected behavior
        return basic_measures
    # --- END FIX ---

    print(f"Processing PPG data (length {len(ppg_data)} samples) at {sfreq} Hz...")

    measures = {}
    try:
        _, measures = hp.process(ppg_data, sample_rate=sfreq)
        print("HeartPy processing complete.")

        # Update the measures only if processing was successful
        basic_measures['bpm'] = measures.get('bpm')
        basic_measures['rmssd'] = measures.get('rmssd')

    except Exception as e:
        print(f"HeartPy failed to find a valid signal (data is likely too short or noisy).")

    return basic_measures


def flatten_features(eeg_features, ppg_features, channel_names):
    """
    Converts the feature dictionaries into a simple list
    of feature vectors (X) for an ML model.

    Handles cases where ppg_features might be empty or None.
    """
    X = []

    # These are our "column headers"
    feature_names = []

    # Get EEG feature names
    if eeg_features:
        first_epoch = eeg_features[0]
        for ch_name in channel_names:
            if ch_name in first_epoch:
                for band_name in first_epoch[ch_name].keys():
                    feature_names.append(f"{ch_name}_{band_name}")

    # Add PPG feature names *only if they exist*
    if ppg_features and ppg_features.get('bpm') is not None:
        for ppg_feature in ppg_features.keys():
            feature_names.append(f"ppg_{ppg_feature}")

    # Build the feature vector (X) for each epoch
    for epoch in eeg_features:
        feature_vector = []

        # Add EEG features in order
        for ch_name in channel_names:
            if ch_name in epoch:
                for band_name in epoch[ch_name].keys():
                    # Use .get() for safety, default to 0
                    feature_vector.append(epoch[ch_name].get(band_name, 0))

        # Add the (repeating) PPG features *only if they exist*
        if ppg_features and ppg_features.get('bpm') is not None:
            for ppg_feature in ppg_features.keys():
                # Use .get() for safety, default to 0 (for None)
                val = ppg_features.get(ppg_feature)
                feature_vector.append(val if val is not None else 0)

        X.append(feature_vector)

    return np.array(X), feature_names