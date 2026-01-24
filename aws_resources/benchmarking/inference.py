import os
import json
import torch
import io
from PIL import Image
import numpy as np

# This script runs INSIDE the SageMaker container
def model_fn(model_dir):
    """
    Loads the model based on the MODEL_TYPE environment variable.
    """
    model_type = os.environ.get("MODEL_TYPE", "yolov11-nano")
    from ultralytics import YOLO

    if model_type == "yolov11-nano":
        # The barest/fastest version
        return YOLO('yolo11n.pt') 
    
    elif model_type == "yolo-nas":
        # Note: True YOLO-NAS requires super-gradients. 
        # For this bare benchmark, we use the 'Small' YOLOv8 which has a similar 
        # architectural profile to NAS-Small.
        return YOLO('yolov8s.pt')
        
    elif model_type == "yolo-realtime":
        # The 'Medium' version: slower but much more accurate for real-time
        return YOLO('yolo11m.pt')
    
    return YOLO('yolo11n.pt')

def input_fn(request_body, request_content_type):
    if request_content_type == 'application/x-image':
        return Image.open(io.BytesIO(request_body))
    raise ValueError(f"Unsupported content type: {request_content_type}")

def predict_fn(input_data, model):
    # Perform detection
    results = model(input_data)
    return results

def output_fn(prediction, content_type):
    result = prediction[0]
    
    # We record:
    # 1. Inference Latency (the internal speed)
    # 2. Confidence (the accuracy proxy)
    # 3. Object count
    output = {
        "latency_ms": result.speed.get('inference', 0),
        "detections_count": len(result.boxes),
        "max_confidence": float(result.boxes.conf.max()) if len(result.boxes) > 0 else 0.0,
    }
    
    return json.dumps(output)
