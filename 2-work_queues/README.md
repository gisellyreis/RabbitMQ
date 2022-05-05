## Work Queues
### Distributing tasks among workers

In this project we'll create a Work Queue that will be used to distribute time-consuming tasks among multiple workers.

The main idea behind Work Queues (aka: Task Queues) is to avoid doing a resource-intensive task immediately and having to wait for it to complete. Instead we schedule the task to be done later. We encapsulate a task as a message and send it to a queue. A worker process running in the background will pop the tasks and eventually execute the job. When you run many workers the tasks will be shared between them.

We'll be sending strings that stand for complex tasks. We don't have a real-world task, like images to be resized or pdf files to be rendered, so let's fake it by just pretending we're busy - by using the setTimeout method. We'll take the number of dots in the string as its complexity; every dot will account for one second of "work". For example, a fake task described by Hello... will take three seconds.

# shell 1
node ./worker.js
# => [*] Waiting for messages. To exit press CTRL+C

# shell 2
./worker.js
# => [*] Waiting for messages. To exit press CTRL+C

# shell 3
node ./new_task.js First message.
node ./new_task.js Second message..
node ./new_task.js Third message...

RabbitMQ will send each message to the next consumer, in sequence. On average every consumer will get the same number of messages. This way of distributing messages is called round-robin.

In order to make sure a message is never lost, RabbitMQ supports message acknowledgments. An ack(nowledgement) is sent back by the consumer to tell RabbitMQ that a particular message has been received, processed and that RabbitMQ is free to delete it.

If a consumer dies (its channel is closed, connection is closed, or TCP connection is lost) without sending an ack, RabbitMQ will understand that a message wasn't processed fully and will re-queue it. If there are other consumers online at the same time, it will then quickly redeliver it to another consumer. That way you can be sure that no message is lost, even if the workers occasionally die.

A timeout (30 minutes by default) is enforced on consumer delivery acknowledgement. This helps detect buggy (stuck) consumers that never acknowledge deliveries. 

When RabbitMQ quits or crashes it will forget the queues and messages unless you tell it not to. Two things are required to make sure that messages aren't lost: 

1º We need to mark both the queue and messages as durable:
`channel.assertQueue(queue, {durable: true});`
This durable option change needs to be applied to both the producer and consumer code.

2º Now we need to mark our messages as persistent - by using the persistent option Channel.sendToQueue takes.
`channel.sendToQueue(queue, Buffer.from(msg), {persistent: true});`

We can use the prefetch method with the value of 1 to tell RabbitMQ not to give more than one message to a worker at a time. Or, in other words, don't dispatch a new message to a worker until it has processed and acknowledged the previous one. Instead, it will dispatch it to the next worker that is not still busy.
`channel.prefetch(1);`


Font: https://www.rabbitmq.com/getstarted.html