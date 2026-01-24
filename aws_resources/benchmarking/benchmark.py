import boto3
import json
import time
import csv
import argparse
import os
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

def benchmark_endpoint(endpoint_name, image_path):
    """
    Sends a single image to a specific SageMaker endpoint and records latency.
    """
    runtime = boto3.client('sagemaker-runtime')
    
    with open(image_path, 'rb') as f:
        image_bytes = f.read()

    start_time = time.time()
    try:
        response = runtime.invoke_endpoint(
            EndpointName=endpoint_name,
            ContentType='application/x-image',
            Body=image_bytes
        )
        end_time = time.time()
        
        result = json.loads(response['Body'].read().decode())
        
        return {
            "Model": endpoint_name,
            "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f"),
            "Roundtrip_Latency_ms": (end_time - start_time) * 1000,
            "Inference_Latency_ms": result.get("latency_ms", 0),
            "Max_Confidence": result.get("max_confidence", 0),
            "Detections": result.get("detections_count", 0),
            "Status": "Success"
        }
    except Exception as e:
        return {
            "Model": endpoint_name,
            "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f"),
            "Status": f"Error: {str(e)}"
        }

def run_benchmarks(endpoints, image_folder, interval=0.5):
    """
    Main loop: Sends images to all endpoints every X seconds.
    """
    images = [os.path.join(image_folder, f) for f in os.listdir(image_folder) 
              if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    if not images:
        print(f"❌ No images found in {image_folder}")
        return

    results = []
    print(f"🚀 Starting benchmark on {len(endpoints)} endpoints...")
    print(f"📸 Using {len(images)} images with a {interval}s interval.")

    try:
        for i, img in enumerate(images):
            print(f"📦 Processing Frame {i+1}/{len(images)}: {os.path.basename(img)}")
            
            # Use ThreadPoolExecutor to call all endpoints in PARALLEL
            with ThreadPoolExecutor(max_workers=len(endpoints)) as executor:
                futures = [executor.submit(benchmark_endpoint, ep, img) for ep in endpoints]
                
                for future in futures:
                    res = future.result()
                    results.append(res)
                    print(f"   ✅ {res['Model']}: {res.get('Roundtrip_Latency_ms', 0):.2f}ms")

            time.sleep(interval)
            
    except KeyboardInterrupt:
        print("\n🛑 Benchmark stopped by user.")

    # Save to CSV
    filename = f"benchmark_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    keys = results[0].keys() if results else []
    
    with open(filename, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(results)
    
    print(f"\n📊 Benchmark Complete! Results saved to: {filename}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--endpoints", nargs="+", required=True, help="List of SageMaker endpoints to test")
    parser.add_argument("--folder", default="test_images", help="Folder containing test images")
    parser.add_argument("--interval", type=float, default=0.5, help="Interval between frames in seconds")
    
    args = parser.parse_args()
    run_benchmarks(args.endpoints, args.folder, args.interval)
