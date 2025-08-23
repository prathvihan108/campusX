# Use a slim Python base image
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /app/ml

# Copy requirements file and install dependencies
COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt


# Copy the rest of your ML app code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Command to run the app with Uvicorn for production
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
