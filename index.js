const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const axios = require("axios");

const Redis = require("redis");

const redisClient = Redis.createClient({
    url: "redis://localhost:6380",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
    process.exit(1);
});

redisClient.connect().catch((err) => {
    console.error("Failed to connect to Redis:", err);
    process.exit(1);
});

DEFAULT_EXPIRATION = 3600; //EXPIRE AFTER 120s

app.get("/photos", async(req, res) => {
    const albumId = req.query.albumId;

    const photos = await redisClient.get(`photos?albumId=${albumId}`);
    //getting data with album id takes significantly less time when caching 800ms compared to 20ms

    try {
        if (photos) {
            return res.status(200).json(JSON.parse(photos));

            // this takes about 50 ms
        }
        const { data } = await axios.get(
            "https://jsonplaceholder.typicode.com/photos", { params: { albumId } }
        );

        redisClient.setEx(
            `photos?albumId=${albumId}`,
            DEFAULT_EXPIRATION,
            JSON.stringify(data)
        );
        res.status(200).json(data);

        //this takes around 300ms
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Redis Cache Retrieval: The code first attempts to retrieve cached photos from Redis using the key "photos".
// Check Cache: If photos are found in the cache(i.e., photos is not null), the cached photos are parsed from their string format back to JSON and sent as the response.

// this returns around 35000 lines of data in about 250ms

app.get("/photos/:id", async(req, res) => {
    const photoId = req.params.id;

    const photo = await redisClient.get(`photos?photoId=${photoId}`);

    try {
        if (photo) {
            return res.status(200).json(JSON.parse(photo));
        }
        const { data } = await axios.get(
            `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
        );

        redisClient.setEx(
            `photos?photoId=${photoId}`,
            DEFAULT_EXPIRATION,
            JSON.stringify(data)
        );
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
});
// this fetches data in about 600ms

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});