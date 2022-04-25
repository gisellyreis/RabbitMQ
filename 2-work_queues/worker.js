// Fake a second of work for every dot in the message body. 
// It will pop messages from the queue and perform the task

const amqp = require('amqplib/callback_api'); 

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    const queue = 'task_queue';

    channel.assertQueue(queue, {
      durable: true
    });

    channel.prefetch(1);
    
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, function(msg) {
      var secs = msg.content.toString().split('.').length -1;

      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");

        // manual acknowledgment mode
        channel.ack(msg);
      }, secs * 1000);
    }, {
        // automatic acknowledgment mode =  noAck: true
        // delete the message after read it

        // manual acknowledgment mode
        noAck: false
    });
  });
});