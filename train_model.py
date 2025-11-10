"""
train_model.py

This script trains a Random Forest classifier on the 60-second
.npz files located in the /data subfolders.

... (script description) ...

** CHANGELOG (v5) **
-   Made the data loader even more robust.
-   If 'sampling_rates' key is missing, it prints a warning
    and assumes the standard defaults (e.g., 256 Hz for EEG)
    instead of skipping the file.
"""
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler

# Import our clean pipeline functions from the other file
# This assumes 'ml_pipeline.py' is in the same folder
try:
    from ml_pipeline import (
        extract_basic_eeg_features, 
        extract_basic_ppg_features, 
        flatten_features
    )
except ImportError:
    print("FATAL ERROR: Could not find 'ml_pipeline.py'.")
    print("Please make sure 'ml_pipeline.py' is in the same directory as this script.")
    exit()

# --- 1. Define Constants ---
DATA_DIR = "data"
# We'll use your three categories
CATEGORIES = ["focus", "calm", "stress"]
MODEL_FILENAME = "mental_state_model.pkl"
SCALER_FILENAME = "data_scaler.pkl"
# Define the channel order from our pipeline
CHANNEL_NAMES = np.array(['TP9', 'AF7', 'AF8', 'TP10'])

def load_data_from_files():
    """
    Loops through all .npz files in the data/ subfolders,
    runs the pipeline on them, and builds a feature dataset (X) and labels (y).
    """
    all_features_list = []
    all_labels_list = []
    
    print("Starting data loading and feature extraction...")
    
    for category in CATEGORIES:
        print(f"\n--- Processing Category: {category} ---")
        category_path = os.path.join(DATA_DIR, category)
        if not os.path.exists(category_path):
            print(f"Warning: Directory not found, skipping: {category_path}")
            continue
            
        # Find the .npz files in the folder
        found_files = [f for f in os.listdir(category_path) if f.endswith(".npz")]
        
        if not found_files:
            print(f"No .npz files found in {category_path}. Skipping.")
            continue
            
        for filename in found_files:
            file_path = os.path.join(category_path, filename)
            print(f"Loading and processing {file_path}...")
            
            try:
                data = np.load(file_path, allow_pickle=True)
                
                # --- FIX V3: Check for each key independently ---
                
                # Find EEG data
                if 'eeg' in data:
                    eeg_data = data['eeg']
                elif 'eeg.npy' in data:
                    eeg_data = data['eeg.npy']
                else:
                    print(f"Error: Could not find 'eeg' or 'eeg.npy' in {filename}. Skipping file.")
                    continue 

                # Find PPG data (NOW OPTIONAL)
                ppg_raw = None # Default to None
                if 'ppg' in data:
                    ppg_raw = data['ppg']
                elif 'ppg.npy' in data:
                    ppg_raw = data['ppg.npy']
                else:
                    print(f"Warning: No PPG data in {filename}. Proceeding with EEG-Only.")
                
                # --- FIX V5: Handle missing sampling_rates ---
                sampling_rates = {} # Default to empty dict
                if 'sampling_rates' in data:
                    sampling_rates = data['sampling_rates'].item()
                elif 'sampling_rates.npy' in data:
                    sampling_rates = data['sampling_rates.npy'].item()
                else:
                    print(f"Warning: Could not find 'sampling_rates' in {filename}. Assuming defaults.")
                # --- END FIX V5 ---
                
                # --- Get Sampling Rates (with defaults) ---
                eeg_sfreq = sampling_rates.get('eeg', 256)
                ppg_sfreq = sampling_rates.get('ppg', 64)
                
                if 'eeg' not in sampling_rates:
                    print(f"  > Assuming EEG sample rate: {eeg_sfreq} Hz")

                # --- Fix data shape (Channels, Samples) -> (Samples, Channels) ---
                if eeg_data.shape[0] < eeg_data.shape[1]:
                    eeg_data = eeg_data.T
                
                ppg_data = None
                if ppg_raw is not None:
                    if ppg_raw.ndim > 1 and ppg_raw.shape[0] < ppg_raw.shape[1]:
                        ppg_data = ppg_raw[0, :]
                    else:
                        ppg_data = ppg_raw.flatten()
                
                # --- 1. Run EEG Pipeline ---
                eeg_epochs, _ = extract_basic_eeg_features(
                    eeg_data, eeg_sfreq, CHANNEL_NAMES, 
                    epoch_sec=2.0, overlap_sec=1.0
                )
                
                # --- 2. Run PPG Pipeline ---
                # This will now gracefully handle ppg_data being None
                ppg_features = extract_basic_ppg_features(ppg_data, ppg_sfreq)
                if ppg_features.get('bpm'):
                    print(f"Extracted PPG features: {ppg_features}")
                
                # --- 3. Flatten features ---
                X, feature_names = flatten_features(eeg_epochs, ppg_features, CHANNEL_NAMES)
                
                if X.shape[0] == 0:
                    print(f"Warning: No epochs extracted from {filename}.")
                    continue

                # --- 4. Create labels for *every* epoch from this file
                y = [category] * X.shape[0]
                
                all_features_list.append(X)
                all_labels_list.extend(y)
                print(f"Processed {X.shape[0]} epochs for this file.")
                
            except Exception as e:
                print(f"Error processing {filename}: {e}")
                import traceback
                traceback.print_exc()

    # Combine all features and labels from all files
    if not all_features_list:
        return np.array([]), np.array([]), []
        
    X_combined = np.vstack(all_features_list)
    y_combined = np.array(all_labels_list)
    
    return X_combined, y_combined, feature_names

def main():
    print("====================================")
    print("Starting ML Model Training Script")
    print("====================================")
    
    # 1. Load and process all data
    X, y, feature_names = load_data_from_files()
    if X.shape[0] == 0:
        print("\nFATAL ERROR: No data was loaded.")
        print("Please check your 'data/' folder structure.")
        print("It should be: data/focus/*.npz, data/calm/*.npz, etc.")
        return
        
    print(f"\n--- Total Data Loaded ---")
    print(f"Total Features: {len(feature_names)}")
    print(f"Feature Names: {feature_names}")
    print(f"X shape (total_epochs, total_features): {X.shape}")
    print(f"y shape (total_epochs,): {y.shape}")
    
    unique, counts = np.unique(y, return_counts=True)
    print(f"Class distribution: {dict(zip(unique, counts))}")
    
    # 2. Scale the data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # 3. Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.25, # 25% for testing
        random_state=42,             # For reproducible results
        stratify=y                   # Ensures classes are balanced in splits
    )
    
    print(f"\nTraining set size: {X_train.shape[0]} epochs")
    print(f"Test set size: {X_test.shape[0]} epochs")
    
    # 4. Train the model (Random Forest is great for this)
    print("\nTraining Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    
    # 5. Test the model on the held-out test set
    print("Evaluating model on test set...")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print("\n====================================")
    print(f"--- Model Accuracy: {accuracy * 100:.2f}% ---")
    print("====================================")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))
    
    # 6. Save the final model AND the scaler
    print(f"\nSaving model to {MODEL_FILENAME}...")
    joblib.dump(model, MODEL_FILENAME)
    
    print(f"Saving scaler to {SCALER_FILENAME}...")
    joblib.dump(scaler, SCALER_FILENAME)
    
    print("\nTraining complete! You are ready to build the backend.")
    print("Your 'brain' files are now saved as:")
    print(f"  - {MODEL_FILENAME}")
    print(f"  - {SCALER_FILENAME}")

if __name__ == "__main__":
    main()