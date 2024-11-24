'use strict';

/*
PLEASE KEEP IN MIND THIS FILE STILL HAS YET TO BE THOROUGHLY TESTED.
*/

//following lines set up the server
const http = require('http');
const autocannon = require('autocannon');
const server = http.createServer(handle);
server.listen(0, startBench); //starts up server, make sure everything is configured first though

function handle(req, res) {
  if (req.method === 'POST' && req.url === '/example/api/endpoint/') { //Will eventually update to have correct endpoint
    let body = '';

    req.on('data', (chunk) => { //gets data from request body
      body += chunk;
    });

    req.on('end', () => { //executes once all data has been received, should send success message if everything goes well
      console.log('Received PATCH data:', body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Event updated successfully' }));
    });
  } else {
    res.writeHead(404); //error message for if things don't go well
    res.end('Not Found');
  }
}

function startBench() {
  const url = "https://github.com/fossasia/open-event-server";

  //Following code is simulating if 100 users made POST requests to the url for ten seconds
  autocannon(
    {
      url,
      method: 'POST',
      connections: 100, //concurrent user count
      duration: 10, //10 second duration
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_name: 'Event Management',
        start_time: '2024-11-25T12:00:00Z',
      }),
    },
    finishedBench
  );

  function finishedBench(err, res) {
    console.log('Finished Edit Transaction Benchmark', err, res);
  }
}
