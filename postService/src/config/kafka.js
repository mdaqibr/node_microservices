import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
dotenv.config();

console.log('KAFKA_BROKER:', process.env.KAFKA_BROKER);

const kafka = new Kafka({
  clientId: 'post-service',
  brokers: [process.env.KAFKA_BROKER],
});

export const producer = kafka.producer();
