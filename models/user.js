import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
  },
  status: {
    type: String,
  },
  caretaker: {
    type: String,
    ref: "Caretaker",
  },
  caretakerAppToken: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
