const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/nonBlocking", (req, res) => {
    res.status(200).send("non blocking page");
});

app.get("/blocking", (req, res) => {
    let counter = 0;
    for (let index = 0; index < 10000000000; index++) {
        counter++;
    }

    res.status(200).send(`result is ${counter}`);
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});