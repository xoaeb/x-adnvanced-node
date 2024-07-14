const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const axios = require('axios');

app.get("/photos", async(req, res) => {
    const albumId = req.query.albumId;
    const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/photos", { params: { albumId } }
    );
    res.json(data);
});

// this returns around 35000 lines of data in about 250ms

app.get("/photos/:id", async(req, res) => {
    const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
    );
    res.json(data);
});
// this data in about 600ms

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});