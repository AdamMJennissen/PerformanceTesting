'use strict'

const autocannon = require('autocannon');
const { PassThrough } = require('stream');

function run(url) {
    const buf = [];
    const outputStream = new PassThrough();

    const inst = autocannon({
        url,
        connections: 10,
        pipelining: 1,
        duration: 10
    });

    autocannon.track(inst, { outputStream });

    outputStream.on('data', data => buf.push(data));
    inst.on('done', () => {
        process.stdout.write(Buffer.concat(buf));
    });
}

console.log('Running all tests in parallel ...');

run('http://localhost:5000/api/v2/events'); // Replace with the actual URL of the open-event-server
