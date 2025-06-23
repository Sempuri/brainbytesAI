// All imports must use ES Modules syntax
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateResponse } from "./aiService.js"; // Note the .js extension is required

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:8080",
  "https://brainbytes-frontend.onrender.com", // deployed frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Initialize AI model
//aiService.initializeAI();

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) throw new Error("Missing MONGODB_URI");
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Define schemas
// Message schema
const messageSchema = new mongoose.Schema({
  text: String,
  isUser: Boolean,
  category: { type: String, default: "general" },
  questionType: { type: String, default: "general" },
  sentiment: { type: String, default: "neutral" },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" },
});

const Message = mongoose.model("Message", messageSchema);

// User Profile Schema
const userProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferredSubjects: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

// Learning Material Schema
const learningMaterialSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const LearningMaterial = mongoose.model(
  "LearningMaterial",
  learningMaterialSchema
);

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// API Routes
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized", userId: req.user.userId });
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the BrainBytes API" });
});

// Register Route
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, preferredSubjects } = req.body;

    const existingUser = await UserProfile.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserProfile({
      name,
      email,
      password: hashedPassword,
      preferredSubjects,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        preferredSubjects: newUser.preferredSubjects,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserProfile.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredSubjects: user.preferredSubjects,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot Password
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserProfile.findOne({ email });
    if (!user) {
      // Always respond with success to prevent email enumeration
      return res.json({
        message: "If this email is registered, a reset link has been sent.",
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    // In production, send an email here.
    // For dev, return the reset link in the response:
    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(
      email
    )}`;
    res.json({
      message: "If this email is registered, a reset link has been sent.",
      resetLink,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset Password
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, token, password } = req.body;
    const user = await UserProfile.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user's profile (protected)
app.get("/api/auth/profile", authMiddleware, async (req, res) => {
  try {
    const user = await UserProfile.findById(req.user.userId).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update current user's profile (protected)
app.put("/api/auth/profile", authMiddleware, async (req, res) => {
  try {
    const { name, preferredSubjects } = req.body;

    const updatedUser = await UserProfile.findByIdAndUpdate(
      req.user.userId,
      {
        name,
        preferredSubjects,
        updatedAt: Date.now(),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all messages
app.get("/api/messages", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user.userId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new message and get AI response
app.post("/api/messages", authMiddleware, async (req, res) => {
  try {
    if (
      !req.body.text ||
      typeof req.body.text !== "string" ||
      req.body.text.trim() === ""
    ) {
      return res.status(400).json({ error: "Message text is required" });
    }
    // 1. Save user message (initially without category)
    const userMessage = new Message({
      text: req.body.text,
      isUser: true,
      userId: req.user.userId,
    });
    await userMessage.save();

    // 2. Generate AI response
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 30000)
    );
    const aiResultPromise = generateResponse(req.body.text);
    const aiResult = await Promise.race([
      aiResultPromise,
      timeoutPromise,
    ]).catch((error) => {
      console.error("AI response timed out or failed:", error);
      return {
        category: "error",
        response:
          "I'm sorry, but I couldn't process your request in time. Please try again with a simpler question.",
        questionType: "general",
        sentiment: "neutral",
      };
    });

    // 3. Update user message with AI's detected category, questionType, sentiment
    userMessage.category = aiResult.category;
    userMessage.questionType = aiResult.questionType;
    userMessage.sentiment = aiResult.sentiment;
    await userMessage.save();

    // 4. Save AI message with same metadata
    const aiMessage = new Message({
      text: aiResult.response,
      isUser: false,
      category: aiResult.category,
      questionType: aiResult.questionType,
      sentiment: aiResult.sentiment,
      userId: req.user.userId,
    });
    await aiMessage.save();

    // 5. Return both messages
    res.status(201).json({
      userMessage,
      aiMessage,
      category: aiResult.category,
      questionType: aiResult.questionType || "general",
      sentiment: aiResult.sentiment || "neutral",
    });
  } catch (err) {
    console.error("Error in /api/messages route:", err);
    res.status(400).json({ error: err.message });
  }
});

// Learning Materials CRUD Operations
// Create a new learning material
app.post("/api/materials", async (req, res) => {
  try {
    const { subject, topic, content } = req.body;

    const material = new LearningMaterial({
      subject,
      topic,
      content,
    });

    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all learning materials
app.get("/api/materials", async (req, res) => {
  try {
    // Support filtering by subject
    const filter = {};
    if (req.query.subject) {
      filter.subject = req.query.subject;
    }

    const materials = await LearningMaterial.find(filter);

    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific learning material
app.get("/api/materials/:id", async (req, res) => {
  try {
    const material = await LearningMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ error: "Learning material not found" });
    }

    res.json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a learning material
app.put("/api/materials/:id", async (req, res) => {
  try {
    const { subject, topic, content } = req.body;
    const updatedMaterial = await LearningMaterial.findByIdAndUpdate(
      req.params.id,
      {
        subject,
        topic,
        content,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({ error: "Learning material not found" });
    }

    res.json(updatedMaterial);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a learning material
app.delete("/api/materials/:id", async (req, res) => {
  try {
    const deletedMaterial = await LearningMaterial.findByIdAndDelete(
      req.params.id
    );

    if (!deletedMaterial) {
      return res.status(404).json({ error: "Learning material not found" });
    }

    res.json({ message: "Learning material deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Start the server (only if not in test)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app; // Export app for Supertest
export { Message };
