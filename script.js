console.log("script.js")
import appendMessage from "./appendMessage.js"

const name = prompt("What is your name?")

if (name == "" || name == null) {
  alert("Name cannot be empty")
  throw new Error("Name cannot be empty")
}

appendMessage("You joined")

var socket = io()
socket.emit("new-user", name)

var form = document.getElementById("form")
var input = document.getElementById("input")

form.addEventListener("submit", function (e) {
  e.preventDefault()
  if (input.value) {
    socket.emit("chat message", input.value)
    input.value = ""
  }
})

// when another client sends a message, retrieve it here
socket.on("chat message", function (msg) {
  appendMessage(msg)
})

// when a user connects from another client, display their name
socket.on("user-connected", (name) => {
  appendMessage(`${name} connected`)
})

// happens when a user disconnects
socket.on("user-disconnected", (name) => {
  appendMessage(`${name} disconnected`)
})
