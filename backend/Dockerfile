# FROM python:3.11-slim

# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1

# WORKDIR /app

# # System dependencies for PostgreSQL and compilation
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     libpq-dev \
#     gcc \
#     && rm -rf /var/lib/apt/lists/*

# # Copy dependency files first (better caching)
# COPY pyproject.toml ./

# # Install dependencies using pip (more reliable in container)
# RUN pip install --no-cache-dir uv && uv pip install --system -r pyproject.toml

# # Copy app code
# COPY . .

# # Create non-root user
# RUN adduser --disabled-password --gecos '' appuser \
#     && chown -R appuser:appuser /app
# USER appuser

# # Expose default port (informational)
# EXPOSE 8000

# # Run app (PORT injected by host)
# # CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
# CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-7860}"]


# this is for hugging face when uploading
FROM python:3.11-slim

# Force Python to look in /app for everything
ENV PYTHONPATH=/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
RUN pip install --no-cache-dir uv && uv pip install --system -r pyproject.toml

# Copy all files directly into /app
COPY . .

# Grant full permissions to /app
RUN chmod -R 777 /app

# Hugging Face MUST use port 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]



