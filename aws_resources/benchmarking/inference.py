import os
import json
import torch
import io
from PIL import Image
import numpy as np

# This script runs INSIDE the SageMaker container
# We no longer need the install() function because we are providing a requirements.txt
# which SageMaker installs automatically during the deployment/boot phase.

def model_fn(model_dir):
    """
    Loads the ACTUAL models requested.
    """
    model_type = os.environ.get("MODEL_TYPE", "yolov11-nano")
    
    # 1. ACTUAL YOLO v11 Nano (Official Ultralytics)
    if model_type == "yolov11-nano":
        from ultralytics import YOLO
        return YOLO('yolo11n.pt') 
    
    # 2. ACTUAL YOLO-NAS Small (Official Deci AI / SuperGradients)
    elif model_type == "yolo-nas":
        from super_gradients.training import models
        return models.get("yolo_nas_s", pretrained_weights="coco")
        
    # 3. ACTUAL YOLO v11 Small (Standard Real-time model)
    elif model_type == "yolo-realtime":
        from ultralytics import YOLO
        return YOLO('yolo11s.pt')
    
    from ultralytics import YOLO
    return YOLO('yolo11n.pt')

def input_fn(request_body, request_content_type):
    if request_content_type == 'application/x-image':
        return Image.open(io.BytesIO(request_body))
    raise ValueError(f"Unsupported content type: {request_content_type}")

def predict_fn(input_data, model):
    """
    Run inference. Both Ultralytics and SuperGradients use similar patterns.
    """
    import time
    start = time.time()
    
    # Check if it's a SuperGradients model (YOLO-NAS)
    if hasattr(model, 'predict') and 'super_gradients' in str(type(model)):
        result = model.predict(input_data)
        inference_time = (time.time() - start) * 1000
        return {"result": result, "inference_ms": inference_time, "model_type": "yolo-nas"}
    else:
        # Ultralytics YOLO
        result = model(input_data)
        inference_time = (time.time() - start) * 1000
        return {"result": result, "inference_ms": inference_time, "model_type": "ultralytics"}

def output_fn(prediction, content_type):
    """
    Extract metrics from model output. Handles both Ultralytics and SuperGradients formats.
    """
    model_type = prediction.get("model_type", "ultralytics")
    result = prediction["result"]
    inference_ms = prediction.get("inference_ms", 0)
    
    # Ultralytics YOLO (v11 Nano and v11 Small/Realtime)
    if model_type == "ultralytics":
        res = result[0]  # Ultralytics returns a list
        output = {
            "model_latency_ms": res.speed.get('inference', inference_ms),
            "detections_count": len(res.boxes),
            "max_confidence": float(res.boxes.conf.max().item()) if len(res.boxes) > 0 else 0.0,
        }
    # SuperGradients YOLO-NAS
    else:
        # YOLO-NAS returns ImagesPredictions, access first image's prediction
        pred = result[0].prediction if hasattr(result, '__getitem__') else result.prediction
        output = {
            "model_latency_ms": inference_ms,
            "detections_count": len(pred.confidence) if hasattr(pred, 'confidence') else 0,
            "max_confidence": float(pred.confidence.max()) if hasattr(pred, 'confidence') and len(pred.confidence) > 0 else 0.0,
        }
    
    return json.dumps(output)
