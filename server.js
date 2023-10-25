require('dotenv').config();
const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const corsOption = require("./config/corsOptions");

// Cross Origin Resource Sharing
app.use(cors(corsOption))

app.get("/", (req, res)=>{
    res.send('<h1>Signaling Server is running</h1>')
});

io.on("connection", (socket)=>{
    console.log("A user Connected");
})

const PORT = process.env.PORT || 3500;
server.listen(PORT,()=>{
    console.log(`Listening on *: ${PORT}`);
})

module.exports = app;