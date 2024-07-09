const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

let items = [];
let currentId = 1;

// Create (POST)
app.post("/items", (req, res) => {
    const item = {
        id: currentId++,
        name: req.body.name,
    };
    items.push(item);
    res.status(201).send(item);
});

// Read (GET)
app.get("/items", (req, res) => {
    res.send(items);
});

app.get("/items/:id", (req, res) => {
    const item = items.find((i) => i.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).send("Item not found");
    }
    res.send(item);
});

// Update (PUT)
app.put("/items/:id", (req, res) => {
    const item = items.find((i) => i.id === parseInt(req.params.id));
    if (!item) {
        return res.status(404).send("Item not found");
    }
    item.name = req.body.name;
    res.send(item);
});

// Delete (DELETE)
app.delete("/items/:id", (req, res) => {
    const itemIndex = items.findIndex((i) => i.id === parseInt(req.params.id));
    if (itemIndex === -1) {
        return res.status(404).send("Item not found");
    }
    items.splice(itemIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});