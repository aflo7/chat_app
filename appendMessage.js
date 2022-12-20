export default function appendMessage(text) {
  var item = document.createElement("li")
  item.textContent = text
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
}