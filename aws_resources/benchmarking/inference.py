import os
import json
import torch
import io
import logging
from PIL import Image

# Configure logging for debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# This script runs INSIDE the SageMaker container
# Model weights are PRE-BUNDLED in model.tar.gz and extracted to /opt/ml/model/
# This is the standard approach for production ML deployments - no runtime downloads.

def model_fn(model_dir):
    """
    Loads models from pre-bundled weights in model_dir.
    
    SageMaker extracts model.tar.gz to /opt/ml/model/, so:
    - model_dir = /opt/ml/model
    - Weights are at /opt/ml/model/yolo11n.pt, etc.
    """
    model_type = os.environ.get("MODEL_TYPE", "yolov11-nano")
    logger.info(f"Loading model type: {model_type}")
    logger.info(f"Model directory: {model_dir}")
    logger.info(f"Contents of model_dir: {os.listdir(model_dir)}")
    
    try:
        # 1. YOLO v11 Nano - load from pre-bundled weights
        if model_type == "yolov11-nano":
            from ultralytics import YOLO
            model_path = os.path.join(model_dir, "yolo11n.pt")
            logger.info(f"Loading YOLO v11 Nano from: {model_path}")
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Weights not found at {model_path}")
            return YOLO(model_path)
        
        # 2. YOLO-NAS Small - use Ultralytics NAS (simpler than SuperGradients)
        elif model_type == "yolo-nas":
            from ultralytics import NAS
            
            # Set cache to writable /tmp for any downloads
            os.environ["TORCH_HOME"] = "/tmp/torch_home"
            os.makedirs("/tmp/torch_home", exist_ok=True)
            
            model_path = os.path.join(model_dir, "yolo_nas_s.pt")
            
            if os.path.exists(model_path):
                logger.info(f"Loading YOLO-NAS from pre-bundled weights: {model_path}")
                model = NAS(model_path)
            else:
                # Fallback: use Ultralytics auto-download to /tmp
                logger.warning(f"Pre-bundled weights not found, using Ultralytics auto-download...")
                model = NAS("yolo_nas_s.pt")
            
            logger.info("YOLO-NAS loaded successfully")
            return model
            
        # 3. YOLO v11 Small - load from pre-bundled weights
        elif model_type == "yolo-realtime":
            from ultralytics import YOLO
            model_path = os.path.join(model_dir, "yolo11s.pt")
            logger.info(f"Loading YOLO v11 Small from: {model_path}")
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Weights not found at {model_path}")
            return YOLO(model_path)
        
        # Default fallback
        else:
            from ultralytics import YOLO
            model_path = os.path.join(model_dir, "yolo11n.pt")
            logger.warning(f"Unknown model type '{model_type}', falling back to yolo11n.pt")
            return YOLO(model_path)
            
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        raise

def input_fn(request_body, request_content_type):
    if request_content_type == 'application/x-image':
        return Image.open(io.BytesIO(request_body))
    raise ValueError(f"Unsupported content type: {request_content_type}")

def predict_fn(input_data, model):
    """
    Run inference. All models now use Ultralytics API (YOLO, NAS).
    """
    import time
    start = time.time()
    
    # All Ultralytics models (YOLO v11, NAS) use the same API
    result = model(input_data)
    inference_time = (time.time() - start) * 1000
    return {"result": result, "inference_ms": inference_time}

def output_fn(prediction, content_type):
    """
    Extract metrics from Ultralytics model output.
    Works for YOLO v11 and YOLO-NAS (both use same result format).
    """
    result = prediction["result"]
    inference_ms = prediction.get("inference_ms", 0)
    
    res = result[0]  # Ultralytics returns a list
    output = {
        "model_latency_ms": res.speed.get('inference', inference_ms),
        "detections_count": len(res.boxes),
        "max_confidence": float(res.boxes.conf.max().item()) if len(res.boxes) > 0 else 0.0,
    }
    
    return json.dumps(output)
