# Step 1: Use an official Python image as a base
FROM python:3.10-slim

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy the application code into the container
COPY . /app

# Step 4: Install required system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Step 5: Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 6: Expose port 8000
EXPOSE 8000

# Step 7: Command to run the FastAPI app
CMD ["fastapi", "run","main.py", "--host", "0.0.0.0", "--port", "8000"]