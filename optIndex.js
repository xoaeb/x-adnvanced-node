const express = require("express");
const bodyParser = require("body-parser");
const { Worker } = require("worker_threads");
// The Worker class from the worker_threads module is imported to create worker threads.

const app = express();
const port = 3000;
const THREAD_COUNT = 4;
app.use(bodyParser.json());

function createWorker() {
    return new Promise((resolve, reject) => {
        //         createWorker function creates a new worker thread that runs the code in optWorker.js.
        // workerData is passed to the worker, containing the THREAD_COUNT value.
        const worker = new Worker("./optWorker.js", {
            workerData: {
                thread_count: THREAD_COUNT,
            },
        });
        worker.on("message", (data) => {
            resolve(data);
        });
        worker.on("error", (err) => {
            reject(`error is ${err}`);
        });
    });
}

app.get("/nonBlocking", (req, res) => {
    res.status(200).send("non blocking page");
});

app.get("/blocking", async(req, res) => {
    const workerPromises = [];
    for (let index = 0; index < THREAD_COUNT; index++) {
        workerPromises.push(createWorker());
    }

    const thread_result = await Promise.all(workerPromises);
    const total =
        thread_result[0] + thread_result[1] + thread_result[2] + thread_result[3];

    res.status(200).send(`result is ${total}`);
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});

// Parallel Processing: The main thread creates multiple worker threads to perform a CPU-intensive task in parallel. Each worker handles a portion of the total workload.
// createWorker Function: Creates a worker thread and returns a promise that resolves with the worker's result.
// Blocking Route (/blocking): Creates multiple workers, waits for all of them to finish, sums up their results, and sends the final result as the response.
// Worker Thread (optWorker.js): Performs a portion of the total iterations and sends the result back to the main thread.
// By using multiple worker threads, the code distributes the CPU-intensive task across several threads, which can lead to better performance on multi-core systems.