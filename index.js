const express = require("express")
const app = express()
app.use(express.static(__dirname))

const http = require("http")
const server = http.createServer(app)

const { Server } = require("socket.io")
const io = new Server(server)

const users = {}

io.on("connection", (socket) => {
  // socket.broadcast.emit('a user connected');

  socket.on("new-user", (name) => {
    users[socket.id] = name
    console.log(users)
    socket.broadcast.emit("user-connected", name)
  })
  // on form submit, this event fires
  // socket.on('chat message', (msg) => {
  //   console.log('message: ' + msg);
  // });

  // on form submit, this event fires
  // send a message to everyone connected to the socket
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg)
  })

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id)
    socket.broadcast.emit("user-disconnected", users[socket.id])
  })
})

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

server.listen(3000, () => {
  console.log("Listening on port 3000...")
})