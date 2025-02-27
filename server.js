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
    const newMessage = new Message(data);
    await newMessage.save();
    io.emit("receive-message", data);
    console.log("---data message---", data);
  });

 
  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

db.connect()
  .then(() => {
    console.log("✅ DB connect");
    server.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error conectando a la base de datos:", error);
  });
