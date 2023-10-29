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

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connect", (socket)=>{
    console.log(`Socket Connected`, socket.id);

    // socket.on("room:join", (data) => {
    //     const { email, room } = data;

    //     emailToSocketIdMap.set(email, socket.id);
    //     socketIdToEmailMap.set(socket.id, email);

    //     io.to(room).emit("user:joined", { email, id: socket.id });
    //     socket.join(room);
    //     io.to(socket.id).emit("room:join", data);
    // });

    // socket.on("user:call", ({ to, offer }) => {
    //     io.to(to).emit("incomming:call", { from: socket.id, offer });
    // });

    // socket.on("call:accepted", ({ to, ans }) => {
    //     io.to(to).emit("call:accepted", { from: socket.id, ans });
    // });

    // socket.on("peer:nego:needed", ({ to, offer }) => {
    //     console.log("peer:nego:needed", offer);
    //     io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    // });

    // socket.on("peer:nego:done", ({ to, ans }) => {
    //     console.log("peer:nego:done", ans);
    //     io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    // });
})

const PORT = process.env.PORT || 3500;
server.listen(PORT,()=>{
    console.log(`Listening on *: ${PORT}`);
})

module.exports = app;