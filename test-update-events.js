'use strict';

const autocannon = require('autocannon');
const { PassThrough } = require('stream');

function startBench(url) {
    const buf = [];
    const outputStream = new PassThrough();

    const inst = autocannon({
        url,
        method: 'POST',
        connections: 100, // Concurrent user count
        duration: 20, // 10-second duration
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            event_name: 'Event Management',
            start_time: '2024-11-25T12:00:00Z',
        }),
    });

    autocannon.track(inst, { outputStream });

    outputStream.on('data', (data) => buf.push(data));
    inst.on('done', () => {
        process.stdout.write(Buffer.concat(buf));
    });
}

console.log('Starting the benchmark ...');

startBench('http://localhost:8080/api/v2/events'); // Replace with the actual URL
