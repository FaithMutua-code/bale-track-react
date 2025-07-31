import { createUser, loginUser } from "../services/userServices.js";
import User from "../models/userModel.js";

export function userRoutes(app) {
  // Register Route
  // Updated with proper error handling and validation
  app.post("/api/user/signup", async (req, res) => {
    try {
      // Add validation
      if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({
          success: false,
          message: "Name, email and password are required",
          missingFields: {
            name: !req.body.name,
            email: !req.body.email,
            password: !req.body.password,
          },
        });
      }

      const user = await createUser(req.body);

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: user.token, // If your service generates one
      });
    } catch (error) {
      console.error("Signup Error:", error);

      // Handle Mongoose validation errors
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }

      // Handle duplicate key (email/username)
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Account already exists",
          field: Object.keys(error.keyPattern)[0],
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  app.post("/api/user/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const {token , user} = await loginUser({ email, password }); // ✅ Get the token

     // ✅ Now fetch the user
     console.log(user)

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user :{
          id: user._id,
          name: user.name,
          email:user.email
        }
       
      });
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Authentication failed",
        error: error.type || "Invalid credentials",
      });
    }
  });
}
