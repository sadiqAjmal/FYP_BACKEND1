import User from "../../models/user";
import bcrypt from "bcrypt";
import { sendMail } from "../resetEmail";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import Caretaker from "../../models/caretaker";
export const signup = async (user) => {
  if (user.email && user.password && user.fullName) {
    const userID = nanoid();
    const caretakerID = nanoid();
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      throw "Email already exists";
    }
    try {
      const token = jwt.sign(
        {
          _id: userID,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET
      );
      await sendMail(
        user.email,
        `<div style="text-align: center;">
                <p>You have registered for <span><h1>Smart Travel Aid</h1></span></p>
                <p>Click the following button to verify:</p>
                <p><a href="https://fyp-backend1.onrender.com/v1/auth/verify/${token}" style="display:inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">VERIFY EMAIL</a></p>
                <p><strong>Ignore this mail if you did not signup</strong></p>
              </div>`,
        "Verify Email"
      );
    } catch (err) {
      throw "Please Enter a valid email";
    }
    try {
      const token = jwt.sign(
        {
          _id: caretakerID,
          email: user.caretakerEmail,
          name: user.caretakerName,
        },
        process.env.JWT_SECRET
      );
      await sendMail(
        user.caretakerEmail,
        `<div style="text-align: center;">
              <p>You have registered for <span><h1>Smart Travel Aid</h1></span></p>
              <p>Click the following button to verify:</p>
              <p><a href="https://fyp-backend1.onrender.com/v1/auth/verify/${token}" style="display:inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">VERIFY EMAIL</a></p>
              <p><strong>Ignore this mail if you did not signup</strong></p>
            </div>`,
        "Verify Email"
      );
    } catch (err) {
      throw "Please Enter a valid email";
    }
    console.log(user.password);
    const hashedPass = await bcrypt.hash(user.password, 10); // Use an appropriate number of rounds, like 10

    const data = new User({
      _id: userID,
      email: user.email,
      mobile: user.mobile,
      password: hashedPass,
      name: user.fullName,
      caretaker: caretakerID,
      role: "user",
      status: "pending",
    });
    await data.save();
    const hashedPassC = await bcrypt.hash(user.caretakerPassword, 10); // Use an appropriate number of rounds, like 10
    const careTaker = new Caretaker({
      _id: caretakerID,
      password: hashedPassC,
      name: user.caretakerName,
      email: user.caretakerEmail,
      user: userID,
      status: "pending",
    });
    await careTaker.save();
    return;
  }
  throw "Not Enough Info";
};
