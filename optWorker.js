const { workerData, parentPort } = require("worker_threads");

let counter = 0;
for (let index = 0; index < 10000000000 / workerData.thread_count; index++) {
    counter++;
}

parentPort.postMessage(counter);

// This distributes the workload among the worker threads.
// Once the loop completes, the result (counter) is sent back to the main thread using parentPort.postMessage(counter).