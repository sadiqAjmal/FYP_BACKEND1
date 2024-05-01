import { connection, connect, set } from "mongoose";
var admin = require("firebase-admin");
import "dotenv/config";
const MONGO_URL = process.env.MONGO_URL;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

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
      credential: admin.credential.cert({
        type: process.env.TYPE,
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_x509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_x509_CERT_URL,
      }),
      databaseURL: "https://smarttravelaid-default-rtdb.firebaseio.com",
    });
    console.log("Connected to Firebase");
  }
})();
