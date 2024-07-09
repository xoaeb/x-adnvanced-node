const { parentPort } = require('worker_threads');

let counter = 0;
for (let index = 0; index < 10000000000; index++) {
    counter++;
}

parentPort.postMessage(counter)

// The parentPort object is used to communicate with the main thread.
// A variable counter is initialized to 0.
// A loop runs 10 billion times, incrementing the counter variable each time. This is a CPU-intensive task.
// Once the loop completes, the result (counter) is sent back to the main thread using parentPort.postMessage(counter).