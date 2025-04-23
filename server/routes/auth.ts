import { Router } from "express";
import { User } from "@shared/schema";
import { storage } from "../storage";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const router = Router();
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Register with Google auth
router.post("/api/auth/google", async (req, res) => {
  try {
    const { email, displayName, uid } = req.body;
    
    if (!email || !uid) {
      return res.status(400).json({ message: "Missing required Google auth data" });
    }
    
    // Check if user already exists with this email
    let user = await storage.getUserByEmail(email);
    
    if (!user) {
      // Generate a random password for Google users
      const randomPass = randomBytes(16).toString("hex");
      const hashedPassword = await hashPassword(randomPass);
      
      // Create a new user
      user = await storage.createUser({
        username: displayName || email.split("@")[0],
        password: hashedPassword,
        email: email,
        isSubscribed: false
      });
    }
    
    // Log the user in (create session)
    req.login(user, (err) => {
      if (err) {
        console.error("Session login error:", err);
        return res.status(500).json({ message: "Authentication error" });
      }
      return res.status(200).json(user);
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
});

export default router;