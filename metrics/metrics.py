import pika
import redis
import os
import time
import schedule

redit_password = os.environ.get("REDIS_PASSWORD", "")
message_queue = os.environ.get("QUEUE_NAME", "")
timeseries = os.environ.get("TIMESERIES", "")

database = redis.Redis(
    host='database', 
    port=6379, 
    db=0, 
    password=redit_password, 
    decode_responses=True
)
connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
channel = connection.channel()

try:
    database.ts().create(timeseries, retention_msecs=86400000)
    print(f"Timeseries {timeseries} created")
except Exception:
    pass

def metrics_job():
    queue = channel.queue_declare(
        queue=message_queue,
        passive=True
    )
    message_count = queue.method.message_count
    print("Messages:", message_count)
    database.ts().add(timeseries, timestamp="*", value=message_count)

schedule.every(1).seconds.do(metrics_job)

while True:
    schedule.run_pending()
    time.sleep(1)