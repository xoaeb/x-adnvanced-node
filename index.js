const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const axios = require("axios");

const jwt = require('jsonwebtoken');
require('dotenv').config();


// Middleware to parse JSON bodies
app.use(express.json());


const PORT = process.env.PORT
const SECRET_KEY = process.env.SECRET_KEY;



// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (authHeader == null) return res.sendStatus(401);

    jwt.verify(authHeader, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign(user, SECRET_KEY, { expiresIn: '15m' });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign(user, SECRET_KEY, { expiresIn: '7d' });
};



// Login Route
app.post('/login', (req, res) => {
    const user = req.body

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);


    res.json({ accessToken, refreshToken });
});

// Protected Route
app.get('/protected', authenticateToken, (req, res) => {
    res.send('Protected Information');
});

// Refresh Token Route
app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken });
    });
});


app.get("/", async(req, res) => {
    const data = { msg: "hello" };
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

app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}`);
});