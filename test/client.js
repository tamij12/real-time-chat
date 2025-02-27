const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Conectado al servidor de Socket.io con ID:", socket.id);

  socket.emit("send-message", { user: "Test", message: "Hola servidor!" });
});

socket.on("receive-message", (data) => {
  console.log("📩 Mensaje recibido del servidor:", data);
});

socket.on("disconnect", () => {
  console.log("❌ Desconectado del servidor");
});
