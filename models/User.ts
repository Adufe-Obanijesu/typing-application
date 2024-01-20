import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  scores: {
    type: Object,
    required: true,
  },
});

export default mongoose.model("Users", UserSchema, "users");
