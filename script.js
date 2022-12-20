console.log("script.js")
import appendMessage from "./appendMessage.js"

const currname = prompt("What is your name?")
let currcolor = "black"

if (currname == "" || currname == null) {
  alert("Name cannot be empty")
  throw new Error("Name cannot be empty")
}

var socket = io()
socket.emit("new-user", currname)

var form = document.getElementById("form")
var input = document.getElementById("input")

form.addEventListener("submit", function (e) {
  e.preventDefault()
  if (input.value) {
    socket.emit("chat message", input.value)
    appendMessage(`You: ${input.value}`, currcolor)
    input.value = ""
  }
})

// when another client sends a message, retrieve it here
socket.on("chat message", function ({ name, msg, color }) {
  appendMessage(`${name}: ${msg}`, color)
})

socket.on("confirm-user", ({ name, color }) => {
  appendMessage("You connected", color)
  currcolor = color
})

// when a user connects from another client, display their name
socket.on("user-connected", ({ name, color }) => {
  // console.log(currname, name)
  // if (currname == name) {
  //   appendMessage("You joined", color)
  // } else {
    appendMessage(`${name} connected`, color)
  // }
})

// happens when a user disconnects
socket.on("user-disconnected", ({ name, color }) => {
  appendMessage(`${name} disconnected`, color)
})
