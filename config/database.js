import { connection, connect, set } from "mongoose";
var admin = require("firebase-admin");
import "dotenv/config";
const MONGO_URL = process.env.MONGO_URL;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
var serviceAccount = require("./serviceAccountKey.json");

(function SetupDatabase() {
  const { readyState } = connection;

  if (readyState !== 1 || readyState !== 2) {
    set("strictQuery", false);
    connect(MONGO_URL, options)
      .then(() => {
        console.log("INFO - MongoDB Database connected.");
      })
      .catch((err) =>
        console.log("ERROR - Unable to connect to the database:", err)
      );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://smarttravelaid-default-rtdb.firebaseio.com",
    });
    console.log("Connected to firebase");
  }
})();
