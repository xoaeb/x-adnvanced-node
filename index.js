const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const axios = require("axios");

const Redis = require("redis");

const redisClient = Redis.createClient({
    url: "redis://localhost:6380",
}); //pass in {url:''} to push to production

redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Connect to Redis
redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
    process.exit(1); // Exit the process if Redis connection fails
});

// Connect to Redis
redisClient.connect().catch((err) => {
    console.error("Failed to connect to Redis:", err);
    process.exit(1); // Exit the process if Redis connection fails
});

DEFAULT_EXPIRATION = 3600; //EXPIRE AFTER 120s

app.get("/photos", async(req, res) => {
    const albumId = req.query.albumId;

    const photos = await redisClient.get(`photos?albumId=${albumId}`);
    //getting data with album id takes significantly less time when caching 800ms compared to 20ms 

    try {
        if (photos != null) {
            return res.json(JSON.parse(photos));

            // this takes about 50 ms
        } else {
            const { data } = await axios.get(
                "https://jsonplaceholder.typicode.com/photos", { params: { albumId } }
            );

            redisClient.setEx(
                `photos?albumId=${albumId}`,
                DEFAULT_EXPIRATION,
                JSON.stringify(data)
            );
            res.json(data);

            //this takes around 300ms
        }
    } catch (error) {
        console.log(error);
    }
});

// Redis Cache Retrieval: The code first attempts to retrieve cached photos from Redis using the key "photos".
// Check Cache: If photos are found in the cache(i.e., photos is not null), the cached photos are parsed from their string format back to JSON and sent as the response.

// this returns around 35000 lines of data in about 250ms

app.get("/photos/:id", async(req, res) => {
    const { data } = await axios.get(
        `
                        https: //jsonplaceholder.typicode.com/photos/${req.params.id}`
    );
    res.json(data);
});
// this data in about 600ms

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});