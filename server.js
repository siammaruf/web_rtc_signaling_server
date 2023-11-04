require('dotenv').config();
const express = require("express");
const corsOptions = require("./config/corsOptions")
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, corsOptions);

app.get("/", (req, res)=>{
    res.send('<h1>Signaling Server is running</h1>')
});

const userToSocketIdMap = new Map();
const socketIdToUserMap = new Map();
let joinedUsers = [];

io.on("connection", (socket)=>{
    socket.emit("user:connected",socket.id)

    socket.on("disconnect", (reason) => {
        const getIndex = joinedUsers.findIndex((e)=>e.id === socket.id);
        joinedUsers.splice(getIndex,1);

        if(joinedUsers.length){
            joinedUsers.forEach((item)=>{
                socket.to(item.room).emit("user:joined", joinedUsers)
            })
        }
        
    });

    socket.on("room:join", (data) => {
        const { user, room } = data;
        const checkUser = joinedUsers.filter(item=>item.user === user);

        if(checkUser.length >= 1){
            socket.emit("user:exists", checkUser);
            return false;
        }else{
            userToSocketIdMap.set(user, socket.id);
            socketIdToUserMap.set(socket.id, user);
            joinedUsers.push({"user": user,"room":room, "id":socket.id})
    
            //io.to(room).emit("user:joined", { user, id:socket.id });
            socket.join(room);
            io.to(socket.id).emit("room:join", data);
            io.to(room).emit("user:joined", joinedUsers);
        }
    });

    socket.on("user:call", ({ from, to, offer }) => {
        io.to(to).emit("incomming:call", { from, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
        console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });

    socket.on("user:msg",(data)=>{
        io.to(data.socketId).emit("user:reply",{
            from:data.to,
            to:data.socketId,
            message:data.msg
        })
    })
})

const PORT = process.env.PORT || 3500;
server.listen(PORT,()=>{
    console.log(`Listening on *: ${PORT}`);
})

module.exports = app;