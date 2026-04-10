const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

let connectionPromise = null;

async function connectToMongoDB(url) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(url, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        maxPoolSize: 10,
        minPoolSize: 2,
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error.message);
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}

module.exports = {
  connectToMongoDB,
};
