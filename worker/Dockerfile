FROM python:3.14-slim

WORKDIR /app

# install dependencies at build time so the container needs
# no internet access at runtime and can stay in the backend network only
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY worker.py .

CMD ["python3.14", "worker.py"]
