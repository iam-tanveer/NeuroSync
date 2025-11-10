#!/usr/bin/env python3
"""
LSL-based Muse2 data provider for the backend.

Usage:
1) Install requirements:
   pip install pylsl

   To stream from a Muse2 device to LSL, a convenient tool is muselsl:
   pip install muselsl
   then run in a separate terminal:
   muselsl stream
   (muselsl will scan and connect to the Muse device and publish an LSL EEG stream)

2) Run your backend (this module will connect to the EEG LSL stream and fill muse_buffer).
"""

import threading
import time
import numpy as np
from datetime import datetime
import os
from pylsl import resolve_byprop, StreamInlet, StreamInfo
from asyncio import TimeoutError  # or use built-in TimeoutError directly

_EEG_SR_DEFAULT = 256
_EEG_CHAN_DEFAULT = 4

class MuseBuffer:
    def __init__(self):
        self.lock = threading.Lock()
        self.eeg = np.zeros((_EEG_CHAN_DEFAULT, 0), dtype=np.float32)
        self.ppg = np.zeros((1, 0), dtype=np.float32)
        self.gyro = np.zeros((3, 0), dtype=np.float32)
        self.accel = np.zeros((3, 0), dtype=np.float32)
        self.last_update_time = None
        self.sampling_rate = _EEG_SR_DEFAULT
        self.channel_names = ["TP9", "AF7", "AF8", "TP10"]

    def append(self, samples, timestamp):
        # samples: 1D or 2D array shaped (channels, n_samples) or (channels,)
        with self.lock:
            samples = np.atleast_2d(samples)
            # ensure shape channels x samples
            if samples.shape[0] != _EEG_CHAN_DEFAULT and samples.shape[1] == _EEG_CHAN_DEFAULT:
                samples = samples.T
            if self.eeg.shape[1] == 0:
                self.eeg = samples.astype(np.float32)
            else:
                self.eeg = np.concatenate([self.eeg, samples.astype(np.float32)], axis=1)
            self.last_update_time = timestamp

    def get_last_seconds(self, seconds):
        with self.lock:
            sr = int(self.sampling_rate)
            n = int(sr * seconds)
            if self.eeg.shape[1] == 0:
                return np.zeros((_EEG_CHAN_DEFAULT, 0), dtype=np.float32)
            n = min(n, self.eeg.shape[1])
            return self.eeg[:, -n:].copy()

muse_buffer = MuseBuffer()
_stream_thread = None
_stream_stop = threading.Event()

def _lsl_reader_loop(timeout_connect=15.0):
    """
    Resolve an EEG LSL stream, create an inlet, and read samples into muse_buffer.
    This function blocks until stopped or until connection fails.
    """
    inlet = None
    try:
        # wait for an EEG stream
        info = None
        start_time = time.time()
        while not _stream_stop.is_set() and info is None:
            try:
                streams = resolve_byprop('type', 'EEG', timeout=1.0)
                if streams:
                    info = streams[0]
                    break
            except Exception:
                pass
            if time.time() - start_time > timeout_connect:
                # timed out trying to find stream; keep looping but note the timeout
                break
            time.sleep(0.1)

        if info is None:
            # Try a broader resolve with no property constraint
            streams = resolve_byprop('name', 'MockStream', timeout=5.0)
            # streams = resolve_byprop('name', None, timeout=5.0)
            if streams:
                info = streams[0]

        if info is None:
            # No stream found yet; just sleep and retry until stop requested
            while not _stream_stop.is_set():
                try:
                    streams = resolve_byprop('type', 'EEG', timeout=2.0)
                    if streams:
                        info = streams[0]
                        break
                except Exception:
                    pass
                time.sleep(0.5)

        if info is None:
            return

        inlet = StreamInlet(info, max_chunklen=12)
        # update buffer metadata if available
        sr = info.nominal_srate()
        if sr and sr > 0:
            muse_buffer.sampling_rate = int(sr)
        chan_count = info.channel_count()
        if chan_count:
            # only update channel names/size if it matches expected
            try:
                ch_names = info.desc().child('channels').child('channel').as_xml()
                # ignore parsing complexity; keep defaults if unknown
            except Exception:
                pass

        # Pull samples continuously
        while not _stream_stop.is_set():
            try:
                sample, timestamp = inlet.pull_sample(timeout=1.0)
            except TimeoutError:
                continue
            if sample is None:
                continue
            arr = np.array(sample, dtype=np.float32)
            # arr length may be channels; append as column
            muse_buffer.append(arr[:, None] if arr.ndim == 1 else arr, timestamp)
    except Exception:
        import traceback
        traceback.print_exc()
    finally:
        # cleanup
        try:
            if inlet:
                inlet.close_stream()
        except Exception:
            pass

def start_streaming():
    """Start background LSL reader thread (idempotent)."""
    global _stream_thread, _stream_stop
    if _stream_thread and _stream_thread.is_alive():
        return
    _stream_stop.clear()
    _stream_thread = threading.Thread(target=_lsl_reader_loop, name="muse-lsl-reader", daemon=True)
    _stream_thread.start()
    # allow a short grace period for first samples
    time.sleep(0.5)

def stop_streaming():
    """Stop LSL reader thread."""
    global _stream_thread, _stream_stop
    _stream_stop.set()
    if _stream_thread:
        _stream_thread.join(timeout=2.0)
    _stream_thread = None

def get_latest_eeg_data(window_seconds: int):
    """Return EEG data for the last window_seconds (channels x samples)."""
    return muse_buffer.get_last_seconds(window_seconds)

def save_data(duration_seconds=10, delay_seconds=0, filename=None):
    """
    Save a snapshot (grab the last `duration_seconds` seconds).
    This is a simple implementation that grabs current buffer contents.
    """
    if filename is None:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"muse_data_{ts}.npz"
    start_streaming()
    if delay_seconds:
        time.sleep(delay_seconds)
    eeg = get_latest_eeg_data(duration_seconds)
    samples = eeg.shape[1]
    with muse_buffer.lock:
        ppg = muse_buffer.ppg[:, -samples:].copy() if muse_buffer.ppg.shape[1] >= samples else np.zeros((1, samples), dtype=np.float32)
        gyro = muse_buffer.gyro[:, -samples:].copy() if muse_buffer.gyro.shape[1] >= samples else np.zeros((3, samples), dtype=np.float32)
        accel = muse_buffer.accel[:, -samples:].copy() if muse_buffer.accel.shape[1] >= samples else np.zeros((3, samples), dtype=np.float32)

    metadata = {
        "sampling_rates": {"eeg": muse_buffer.sampling_rate, "ppg": muse_buffer.sampling_rate, "gyro": muse_buffer.sampling_rate, "accel": muse_buffer.sampling_rate},
        "channel_names": {"eeg": muse_buffer.channel_names, "ppg": ["PPG"], "gyro": ["X", "Y", "Z"], "accel": ["X", "Y", "Z"]},
        "duration_seconds": duration_seconds,
        "delay_seconds": delay_seconds,
        "timestamp": datetime.now().isoformat(),
    }

    out_path = os.path.abspath(filename)
    np.savez_compressed(out_path, eeg=eeg, ppg=ppg, gyro=gyro, accel=accel, **metadata)
    return out_path

if __name__ == "__main__":
    start_streaming()
    print("Listening for LSL EEG stream... press Ctrl-C to exit.")
    try:
        while True:
            time.sleep(1.0)
    except KeyboardInterrupt:
        stop_streaming()