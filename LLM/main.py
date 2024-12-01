from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware 
import cv2
import mediapipe as mp
import shutil
import os
import numpy as np

app = FastAPI()

origins = ["*"]  
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

UPLOAD_FOLDER = "uploaded_videos"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def count_pushups(video_path):
    """
    Function to count the number of pushups in a video.
    """
    cap = cv2.VideoCapture(video_path)
    pushup_count = 0
    in_down_position = False
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image) 

        if results.pose_landmarks:
            # Extract relevant landmarks
            landmarks = results.pose_landmarks.landmark
            shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
            elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]
            wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]

            # Calculate the angle of the elbow
            def calculate_angle(a, b, c):
                a = np.array(a)  
                b = np.array(b)  
                c = np.array(c)  

                radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
                angle = np.abs(radians * 180.0 / np.pi)

                if angle > 180.0:
                    angle = 360 - angle

                return angle

            # Get coordinates
            shoulder_coords = (shoulder.x, shoulder.y)
            elbow_coords = (elbow.x, elbow.y)
            wrist_coords = (wrist.x, wrist.y)

            # Calculate angle
            angle = calculate_angle(shoulder_coords, elbow_coords, wrist_coords)

            # Check pushup position based on angle
            if angle < 70:  # Down position
                in_down_position = True
            elif angle > 160 and in_down_position:  # Up position
                pushup_count += 1
                in_down_position = False

    cap.release()
    return pushup_count

@app.post("/upload-video/")
async def upload_video(user_id: str,file: UploadFile = File(...)):
    """
    Endpoint to upload a video file, reduce its quality, and process it to count pushups.
    """
    original_file_location = os.path.join(UPLOAD_FOLDER, f"original_{file.filename}")
    reduced_file_location = os.path.join(UPLOAD_FOLDER, f"reduced_{file.filename}")

    # Save the uploaded file
    with open(original_file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Reduce video quality
    reduce_video_quality(original_file_location, reduced_file_location)

    # Process the reduced quality video to count pushups
    pushup_count = count_pushups(reduced_file_location)

    #Count Exercise duration
    exercise_duration = get_video_length(original_file_location)

    # Clean up uploaded files
    os.remove(original_file_location)
    os.remove(reduced_file_location)

    return JSONResponse(content={
        "user_id": user_id,
        "pushup_count": pushup_count,
        "exercise_duration":exercise_duration
    })

@app.get("/")
async def hello():
    """
    Endpoint to upload a video file and process it to count pushups.
    """

    return JSONResponse(content={"pushup_count": 2})


#Video duration count
def get_video_length(video_path):
    try:
        # Open the video file
        video = cv2.VideoCapture(video_path)

        # Get the frame rate and total frame count
        frame_rate = video.get(cv2.CAP_PROP_FPS)
        frame_count = video.get(cv2.CAP_PROP_FRAME_COUNT)

        # Calculate the duration in seconds
        if frame_rate > 0:
            duration = frame_count / frame_rate
            return round(duration,2)
        else:
            return "Could not retrieve frame rate or frame count."

    except Exception as e:
        return f"Error: {e}"

    finally:
        # Release the video capture object
        video.release()

# Video quality reduction script
def reduce_video_quality(input_path, output_path, scale=0.5, fps=13):
    """
    Reduces the quality of the video by resizing and lowering the frame rate.
    
    Args:
        input_path (str): Path to the input video.
        output_path (str): Path to save the reduced quality video.
        scale (float): Scale factor for resizing the video (default 0.5 for half size).
        fps (int): Frames per second for the output video (default 15).
    """
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise ValueError("Error opening video file")

    # Get the original video parameters
    original_fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Codec for MP4
    scaled_width = int(width * scale)
    scaled_height = int(height * scale)

    # Create the VideoWriter for the output
    out = cv2.VideoWriter(output_path, fourcc, fps, (scaled_width, scaled_height))

    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Downsample the resolution
        resized_frame = cv2.resize(frame, (scaled_width, scaled_height))
        
        # Skip frames to reduce the FPS
        if frame_count % int(original_fps / fps) == 0:
            out.write(resized_frame)

        frame_count += 1

    cap.release()
    out.release()