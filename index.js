const express = require("express")
var cors = require("cors")

const app = express()
app.use(
  cors({
    origin: "https://app3.memberssonly.xyz",
    credentials: true
  })
)
app.use(express.static(__dirname))
require("dotenv").config()
app.set("trust_proxy", 1)

const http = require("http")
const server = http.createServer(app)

const { Server } = require("socket.io")
const io = new Server(server)

const users = {}
const colors = [
  "#089dcd",
  "#0085fd",
  "#03d46c",
  "#022a8a",
  "#088139",
  "#05a79c",
  "#0603f3",
  "#064f43",
  "#09e0dc",
  "#0a24ee",
  "#05e7dc",
  "#055dc9",
  "#0d8f3e",
  "#0e2cdd",
  "#0c6094",
  "#024fb8",
  "#0a405c",
  "#060e1c",
  "#052ec2",
  "#0d2d28",
  "#0863f1",
  "#090533",
  "#0437d2",
  "#0aa7b8",
  "#0e21a3",
  "#03780b",
  "#013c47",
  "#05e373",
  "#04dc0d",
  "#007891",
  "#0f3cd9",
  "#0bb917",
  "#0562b0",
  "#0ed85a",
  "#08e2c3",
  "#0a247f",
  "#0230f9",
  "#0e0d5a",
  "#0d0b96",
  "#0a9c16",
  "#0b62c1",
  "#07a488",
  "#0933da",
  "#03c230",
  "#0a69ac",
  "#02b459",
  "#0c7b5e",
  "#09e983",
  "#02db71",
  "#0dc0cc",
  "#0704f5",
  "#000cd7",
  "#057f20",
  "#085d12",
  "#0c136a",
  "#0e9494",
  "#03b2b4",
  "#068d9d",
  "#0e2fde",
  "#02ec69",
  "#0bd29b",
  "#029af7",
  "#089b72",
  "#032b34",
  "#00502e",
  "#0d8262",
  "#0b2485",
  "#0dfc1c",
  "#0ba8b7",
  "#09a7a1",
  "#05efd9",
  "#0b54ca",
  "#0410aa",
  "#04c274",
  "#0911d9",
  "#093fb6",
  "#081de7",
  "#0bb6a2",
  "#00e36c",
  "#095f09",
  "#0c83eb",
  "#0d2780",
  "#0cdf96",
  "#0e07db",
  "#000dca",
  "#074d06",
  "#0cd9b7",
  "#065030",
  "#0169ed",
  "#07fbdb",
  "#0f2932",
  "#00d350",
  "#033eb5",
  "#0ed8a1",
  "#09206f",
  "#04a14a",
  "#076447",
  "#0aae96",
  "#08d4d5",
  "#09cd45"
]

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

app.get("/test", (req, res) => {
  res.json({ msg: "test" })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
