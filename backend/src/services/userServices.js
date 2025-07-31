import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export async function createUser({ name, password, email }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    name,
    password: hashedPassword,
  });

  return await user.save();
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    console.log("Login Failed Missing Credentials");
    throw { status: 400, message: "Username and password are required" };
  }

  const user = await User.findOne({ email });

  if (!user) {
    console.log("Login Failed Username not found");
    throw { status: 401, message: "Invalid Credentials" };
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    console.log("Login Failed invalid Credentials");
    throw { status: 401, message: "Username or password are invalid" };
  }

  console.log("Login Successful");

  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  }
}
