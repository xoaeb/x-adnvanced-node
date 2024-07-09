const express = require("express");
const bodyParser = require("body-parser");
const { Worker } = require("worker_threads");
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/nonBlocking", (req, res) => {
    res.status(200).send("non blocking page");
});

app.get("/blocking", (req, res) => {
    const worker = new Worker("./worker.js");
    worker.on("message", (data) => {
        res.status(200).send(`result is ${data}`);
    });
    worker.on("error", (err) => {
        res.status(404).send(`error is ${err}`);
    });
});

// When this route is accessed, it creates a new worker thread using the Worker class.
// The worker thread runs the code in worker.js.
// worker.on('message', ...) listens for messages from the worker thread. When the worker thread sends a message (the result of the computation), the server responds with that result.
// worker.on('error', ...) listens for errors from the worker thread. If an error occurs, the server responds with an error message.

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});