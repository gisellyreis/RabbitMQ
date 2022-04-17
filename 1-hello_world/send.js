// requeire the library
const amqp = require('amqplib/callback_api'); 

// connect to RabbitMQ server
// amqp.connect('amqp://localhost', function(error0, connection) {});

// create a channel, which is where most of the API for getting things done resides
// To send, we must declare a queue for us to send to; then we can publish a message to the queue
// create connection
amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  // create channel
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    const queue = 'hello';
    const msg = 'Hello world';

    // assert queue
    /* channel.assertQueue(queue, {
      durable: false
    }); */
    channel.assertQueue(queue);

    // send message to queue
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });
});

// close the connection and exit
/* setTimeout(function() {
    connection.close();
    process.exit(0)
}, 500);
 */