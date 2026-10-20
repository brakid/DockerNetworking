import CORS from "bun-routes-cors";
import { RedisClient } from "bun";
import { connect } from"amqplib";

const client = new RedisClient(`redis://:${Bun.env.REDIS_PASSWORD}@database:6379`);
const connection = await connect('amqp://rabbitmq');
const channel = await connection.createChannel();

const queueName = Bun.env.QUEUE_NAME!;
await channel.assertQueue(queueName, {
  durable: true,
  arguments: {
    "x-queue-type": "quorum"
  }
});

interface Result {
    id: string,
    worker: string,
    timestamp: string
};

console.log(`Listening to port 3000`);
Bun.serve({ 
    port: 3000,
    hostname: "0.0.0.0",
    routes: CORS({
        "/trigger": {
            GET: async (req) => {
                const id = await client.incr("ids");
                channel.sendToQueue(queueName, Buffer.from(JSON.stringify({ id })));
                return Response.json({ id: id.toString() });
            },
        },
        "/result/:id": {
            GET: async (req) => {
                const result = JSON.parse(await client.get(`id-${req.params.id}`) || "{}");
                if (Object.keys(result).length === 0) {
                    return new Response("No result", {
                        status: 404,
                        headers: { "Content-Type": "text/plain; charset=utf-8" }
                        }
                    );
                }
                return Response.json(result);
            },
        },
        "/": () => new Response("Home"),
    }, {
        origin: "*",
        methods: "*",
        headers: "*",
    }),
});