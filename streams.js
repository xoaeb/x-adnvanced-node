const fs = require("fs");

const readable = fs.createReadStream("./lyrics.txt", { highWaterMark: 50 });

readable.on("data", (chunk) => {
    console.log(chunk.toString());
});

// This code snippet demonstrates how to read a file in chunks using a readable stream in Node.js.
// By using the highWaterMark option, you can control the size of each chunk of data that is read,
// allowing for efficient memory usage and handling of large files. The data event listener processes each chunk as it becomes available,
// making it a powerful tool for stream processing in Node.js applications.