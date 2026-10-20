FROM python:3.14-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY metrics.py .

CMD ["python3.14", "metrics.py"]
