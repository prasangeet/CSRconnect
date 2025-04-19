# Use slim Python image to keep it lightweight
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Install pip dependencies only — no build tools
COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy actual project code into container
COPY backend /app

# Set environment variables (but don't include secrets here)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Port exposed (update if needed)
EXPOSE 8000

# Start with gunicorn
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
