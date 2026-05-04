import mongoose from "mongoose";
import pkg from "passport-local-mongoose";


const passportLocalMongoose = pkg.default || pkg;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;