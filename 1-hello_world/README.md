Hello World

In this part of the tutorial we'll write two small programs in Javascript; a producer that sends a single message, and a consumer that receives messages and prints them out. 

Sending
We'll call our message publisher (sender) send.js and our message consumer (receiver) receive.js. The publisher will connect to RabbitMQ, send a single message, then exit.

Receiving
That's it for our publisher. Our consumer listens for messages from RabbitMQ, so unlike the publisher which publishes a single message, we'll keep the consumer running to listen for messages and print them out.



Font: https://www.rabbitmq.com/getstarted.html