export default function appendMessage(text, color = "black") {
  var item = document.createElement("li")
  item.textContent = text
  item.style.color = color
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
}