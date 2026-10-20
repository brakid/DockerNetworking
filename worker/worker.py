import pika
import json
import time
import datetime
import uuid
import redis
import os

worker_id = str(uuid.uuid4())

redit_password = os.environ.get("REDIS_PASSWORD", "")
message_queue = os.environ.get("QUEUE_NAME", "")

database = redis.Redis(
    host='database', 
    port=6379, 
    db=0, 
    password=redit_password, 
    decode_responses=True
)
connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
channel = connection.channel()
channel.queue_declare(
    queue=message_queue,
    durable=True,
    arguments={'x-queue-type': 'quorum'}
)

channel.basic_qos(prefetch_count=1)

def callback(channel, method, properties, body):
    message = json.loads(body.decode())

    print(f"[{worker_id}] Received {message}")
    time.sleep(1)

    id = message.get("id", "")

    database.set(f"id-{id}", json.dumps({ "id": id, "worker": worker_id, "timestamp": str(datetime.datetime.now())}))
    
    channel.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume(
    queue=message_queue, 
    on_message_callback=callback,
    auto_ack=False
)

print(f"[{worker_id}] polling for messages")
channel.start_consuming()