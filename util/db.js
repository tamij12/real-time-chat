const mongoose = require("mongoose");
const URI = process.env.URI;

mongoose.set("strictQuery", false);

const connect = async () => {
  try {
    await mongoose.connect(URI, {
     
    });
    console.log("✅ Base de datos conectada exitosamente.");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1); 
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log("🔌 Base de datos desconectada.");
  } catch (error) {
    console.error("❌ Error al desconectar la base de datos:", error);
  }
};

module.exports = { connect, disconnect };
