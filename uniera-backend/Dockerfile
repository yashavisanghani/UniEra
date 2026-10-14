# UniEra Flask backend (SLA Task 4)
FROM python:3.11-slim

WORKDIR /app

# install Python libraries first (this layer is cached between builds)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy the backend code
COPY . .

# listen on all interfaces inside the container, debug off
ENV FLASK_HOST=0.0.0.0 \
    FLASK_DEBUG=0

EXPOSE 5000
CMD ["python", "app.py"]
