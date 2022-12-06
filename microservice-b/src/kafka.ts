import {Kafka, RecordMetadata} from "kafkajs";

const kafka = new Kafka({
  brokers: ['kafka-cluster-ip-service:9092'],
  clientId: 'microservice-b-client',
})

export const sendMessages = async (topic: string, messages: readonly string[]): Promise<RecordMetadata[]> => {
  
    const producer = kafka.producer()

    await producer.connect()

    const recordMetadata = await producer.send({
        topic,
        messages: messages.map((message => ({ value: message }))),
    })

    await producer.disconnect()

    return recordMetadata;
}

export const subscribeKafka = async (topic: string) => {
    const consumer = kafka.consumer({ groupId: 'microservice-b-group' })
    console.log('consumer', consumer)
    const a = await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
            message: message.value?.toString(),
            partition: partition.toString(),
            topic: topic.toString(),
        })
      },
    })
  }