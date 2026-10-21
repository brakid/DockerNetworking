FROM python:3.14-slim

WORKDIR /app
RUN useradd --system -M appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY worker.py .

USER appuser

CMD ["python3.14", "worker.py"]
