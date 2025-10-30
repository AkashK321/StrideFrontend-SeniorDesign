import React, {useState, useEffect, useRef, JSX} from 'react';
import { StyleSheet, Text, View, Dimensions, LogBox, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native'; // Import for side-effects
import * as cocossd from '@tensorflow-models/coco-ssd';
import Svg, { Rect } from 'react-native-svg';

// Silence a specific warning about tensor-to-image conversion
LogBox.ignoreLogs(['Could not get source-map URL for ...']);

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// --- TypeScript Types ---
type ModelType = cocossd.ObjectDetection;
interface Detection {
    bbox: [number, number, number, number]; // [x, y, width, height]
    class: string;
    score: number;
}
// ------------------------

export default function App(): JSX.Element {
    const [permission, requestPermission] = useCameraPermissions();
    const [model, setModel] = useState<ModelType | null>(null);
    const [detections, setDetections] = useState<Detection[]>([]);
    const cameraRef = useRef<CameraView | null>(null);

    // 1. Load the model on mount
    useEffect(() => {
        (async () => {
            // Initialize TensorFlow.js
            console.log('Initializing TensorFlow.js...');
            await tf.ready();
            console.log('TensorFlow.js ready.');

            // Load the COCO-SSD model
            console.log('Loading COCO-SSD model...');
            const loadedModel = await cocossd.load();
            setModel(loadedModel);
            console.log('Model loaded successfully!');
        })();
    }, []);

    // 2. Handle camera frames for detection
    // NOTE: The following approach for processing camera frames is based on older APIs
    // that are no longer available in the recent versions of expo-camera and @tensorflow/tfjs-react-native.
    // The 'handleCameraStream' function is not called.
    // For real-time object detection, you would typically set up a loop that:
    // 1. Captures an image from the camera using `cameraRef.current.takePictureAsync()`.
    // 2. Converts the image to a tensor using `tf.node.decodeImage()`.
    // 3. Passes the tensor to your model for detection.
    // This would be implemented inside a useEffect hook with a dependency on the loaded model.
    const handleCameraStream = (images: IterableIterator<tf.Tensor3D>) => {
        const loop = async () => {
            if (model) {
                // Get the next frame from the camera
                const imageTensor = images.next().value as tf.Tensor3D;

                if (imageTensor) {
                    try {
                        // Run detection
                        const predictions = await model.detect(imageTensor);

                        // Update state with detections
                        setDetections(predictions as Detection[]);
                    } catch (error) {
                        console.error('Error during detection:', error);
                    }

                    // Dispose of the tensor to prevent memory leaks
                    tf.dispose(imageTensor);
                }
            }
            // Request the next frame to continue the loop
            requestAnimationFrame(loop);
        };
        loop();
    };

    // --- Rendering Functions ---

    // Helper function to render bounding boxes (SVG Rects)
    const renderBoxes = (): (React.JSX.Element | null)[] | null => {
        if (!detections) return null;
        return detections.map((detection: Detection, i: number): JSX.Element | null => {
            if (!detection || !detection.bbox) return null;
            const [x, y, w, h] = detection.bbox;

            // NOTE: This scaling is a simple example.
            // A more robust solution would measure the camera view's actual
            // layout (onLayout prop) and the tensor's dimensions
            // to calculate the correct scaling factor.

            return (
                <Rect
                    key={i}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    strokeWidth="2"
                    stroke="red"
                    fill="transparent"
                />
            );
        });
    };

    // Helper function to render text labels (React Native Text)
    const renderTextBoxes = (): (React.JSX.Element | null)[] | null => {
        if (!detections) return null;
        return detections.map((detection: Detection, i: number): JSX.Element | null => {
            if (!detection || !detection.bbox) return null;
            const [x, y] = detection.bbox;
            const { class: detectionClass, score } = detection;
            return (
                <Text
                    key={`text-${i}`}
                    style={[styles.boxText, { left: x + 5, top: y + 5 }]}
                >
                    {`${detectionClass} (${Math.round(score * 100)}%)`}
                </Text>
            );
        });
    };

    // --- Main Render ---

    if (!permission) {
        return <View style={styles.container}><Text style={styles.loadingText}>Requesting permissions...</Text></View>;
    }
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>No access to camera. Please grant permission.</Text>
                <Button title="Grant Permission" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Stride Project - Local Detection</Text>
            {/*{model ? (*/}
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={'back'}
                    onCameraReady={() => console.log("Camera is ready")}
                />
            {/*) : (*/}
                {/*<Text style={styles.loadingText}>Loading Model...</Text>*/}
            {/*// )}*/}

            {/* SVG overlay for drawing bounding boxes */}
            <Svg style={styles.svg} width={width} height={height}>
                {renderBoxes()}
            </Svg>

            {/* View overlay for rendering text labels (must be separate from Svg) */}
            <View style={styles.textBoxContainer}>
                {renderTextBoxes()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        position: 'absolute',
        top: 50,
        left: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        zIndex: 20, // Must be on top
    },
    camera: {
        width: '100%',
        height: '100%',
    },
    loadingText: {
        color: 'white',
        fontSize: 18,
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 5, // Renders above the camera
    },
    textBoxContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10, // Renders above the SVG
    },
    boxText: {
        position: 'absolute',
        color: 'red',
        fontWeight: 'bold',
        fontSize: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        padding: 2,
    },
});
