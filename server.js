require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const db = require("./util/db");
const Message = require("./models/messages");

const port = 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  console.log("Usuario conectados:", socket.id);

  Message.find()
    .sort({ timestamp: 1 })
    .then((messages) => {
      socket.emit("chat-history", messages);
      console.log("-----Chat History----", messages);
    });

  socket.on("send-message", async (data) => {
    try {
      if (!data.username || !data.message) {
        console.error("Mensaje inválido, faltan datos:", data);
        return;
      }

      const newMessage = new Message({
        username: data.username,
        message: data.message,
        timestamp: new Date(),
      });

      await newMessage.save();
      console.log("Mensaje guardado en la base de datos:", newMessage);

      io.emit("receive-message", newMessage);
    } catch (error) {
      console.error("Error al guardar el mensaje:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

db.connect()
  .then(() => {
    console.log("✅ DB connect");
    app.use(express.static(__dirname + "/public"));
    server.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error conectando a la base de datos:", error);
  });
