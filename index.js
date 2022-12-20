const express = require("express")
var cors = require('cors')

const app = express()
app.use(cors({
  origin: 'https://app3.memberssonly.xyz',credentials: true
}));
app.use(express.static(__dirname))
require('dotenv').config()
app.set('trust_proxy', 1)


const http = require("http")
const server = http.createServer(app)

const { Server } = require("socket.io")
const io = new Server(server)

const users = {}
const colors = ["blue", "red", "pink", "green", "orange", "purple"]

io.on("connection", (socket) => {
  // socket.broadcast.emit('a user connected');

  socket.on("new-user", (name) => {
    let color = colors.pop()
    if (color == undefined) {
      color = "black"
    }
    users[socket.id] = { name, color }
    socket.emit("confirm-user", users[socket.id]) // send this user to sender
    socket.broadcast.emit("user-connected", users[socket.id]) // send user info to all clients expect sender
    // io.emit("user-connected", users[socket.id])// send to all connected clients
  })

  // on form submit, this event fires
  // send a message to everyone connected to the socket
  socket.on("chat message", (msg) => {
    // io.emit("chat message", msg)
    const name = users[socket.id].name
    const color = users[socket.id].color

    socket.broadcast.emit("chat message", { name, msg, color })
  })

  socket.on("disconnect", () => {
    // console.log("user disconnected", socket.id)
    socket.broadcast.emit("user-disconnected", users[socket.id], () => {
      delete users[socket.id]
    })
  })
})

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})
const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
