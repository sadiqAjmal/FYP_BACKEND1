const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();

// POST endpoint to receive app token and send notification
router.post("/send-notification", async (req, res) => {
  const { token, title, body } = req.body;
  console.log(req.body);
  try {
    await admin.messaging().send({
      token: token,
      notification: {
        title: title || "Notification Title",
        body: body || "Notification Body",
      },
    });

    res.status(200).send("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send("Error sending notification");
  }
});

export default router;
