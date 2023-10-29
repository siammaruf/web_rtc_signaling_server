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
//app.use(cors(corsOption))

app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://cofixer.xyz"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
    res.setHeader("Access-Control-Max-Age", 7200);
  
    next();
  });

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