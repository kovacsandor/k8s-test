// import axios from "axios";
import {Kafka, RecordMetadata} from "kafkajs";

const kafka = new Kafka({
  brokers: ['kafka-cluster-ip-service:9092'],
  clientId: 'microservice-a-client',
})

export const sendMessages = async (topic: string, messages: readonly string[]): Promise<RecordMetadata[]> => {
  
    const producer = kafka.producer()

    await producer.connect()
    const recordMetadata = await producer.send({
        topic,
        messages: messages.map((message => ({ 
            key: 'test-message-key',
            value: message,
         }))),
    })

    await producer.disconnect()

    return recordMetadata;
}
