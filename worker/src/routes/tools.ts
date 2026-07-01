import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../env";
import { requireAuth, getUser } from "../auth-middleware";
import type { IStorage } from "../storage";
import { authMiddleware } from "../auth-middleware";

const router = new Hono<{ Bindings: Env; Variables: { user: ReturnType<typeof getUser> } }>();
router.use("*", authMiddleware);

/**
 * POST /api/interpret-dream — Keyword-based dream interpretation (no auth required).
 */
const dreamSchema = z.object({
  dreamText: z.string().min(1, "Dream text is required"),
});

router.post("/interpret-dream", zValidator("json", dreamSchema), (c) => {
  const { dreamText } = c.req.valid("json");
  const dreamLower = dreamText.toLowerCase();

  const cosmicKeywords = [
    { word: "star", tag: "Cosmic Connection" },
    { word: "space", tag: "Cosmic Connection" },
    { word: "galaxy", tag: "Cosmic Connection" },
    { word: "universe", tag: "Cosmic Connection" },
    { word: "planet", tag: "Cosmic Connection" },
    { word: "float", tag: "Spiritual Growth" },
    { word: "fly", tag: "Spiritual Growth" },
    { word: "light", tag: "Awakening" },
    { word: "dark", tag: "Shadow Work" },
    { word: "cosmic", tag: "Cosmic Connection" },
    { word: "energy", tag: "Energy Work" },
    { word: "consciousness", tag: "Expansion" },
    { word: "expand", tag: "Expansion" },
    { word: "vast", tag: "Expansion" },
    { word: "connect", tag: "Connection" },
  ];

  const tags: string[] = [];
  cosmicKeywords.forEach(({ word, tag }) => {
    if (dreamLower.includes(word) && !tags.includes(tag)) {
      tags.push(tag);
    }
  });

  if (tags.length === 0) {
    tags.push("Self-Discovery", "Inner Journey");
  }

  const parts: string[] = [];

  if (tags.includes("Cosmic Connection")) {
    parts.push("Your dream suggests a deep connection to the cosmos. The celestial symbols represent your expanding consciousness and spiritual growth.");
  }
  if (tags.includes("Spiritual Growth")) {
    parts.push("The sensation of floating or flying indicates your spirit's natural tendency to transcend physical limitations. You may be going through a period of spiritual evolution.");
  }
  if (tags.includes("Expansion")) {
    parts.push("Your consciousness is expanding beyond conventional boundaries. This dream reflects your readiness to embrace a more expansive understanding of reality.");
  }
  if (tags.includes("Shadow Work")) {
    parts.push("The darkness in your dream may represent unexplored aspects of your psyche that contain valuable cosmic wisdom when integrated.");
  }
  if (tags.includes("Energy Work")) {
    parts.push("You're becoming more aware of the subtle energies that connect all beings in the universe. This dream is encouraging you to develop your sensitivity to these cosmic energies.");
  }
  if (tags.includes("Connection")) {
    parts.push("Your dream reflects a deep yearning for meaningful connection—not just with other humans, but with the entire cosmic web of existence.");
  }
  if (tags.includes("Awakening")) {
    parts.push("The presence of light symbolizes an awakening of higher consciousness and spiritual insight. You're beginning to see reality from a more enlightened perspective.");
  }

  const interpretation = parts.length > 0
    ? parts.join(" ")
    : "Your dream contains cosmic symbolism that suggests you're undergoing a period of spiritual expansion and growth. Pay attention to intuitive insights that arise during this time.";

  return c.json({
    interpretation,
    tags: tags.slice(0, 3),
  });
});

/**
 * POST /api/quiz-results — Simple quiz archetype assignment (no auth required).
 */
router.post("/quiz-results", async (c) => {
  const body = await c.req.json();
  const { answers } = body;

  if (!answers) {
    return c.json({ message: "Quiz answers are required" }, 400);
  }

  const archetypes = [
    {
      title: "Stellar Seeker",
      description: "You are drawn to the mysteries of the cosmos and seek spiritual growth through cosmic connection. Your intuitive nature helps you perceive patterns others miss.",
      archetype: "Seeker",
    },
    {
      title: "Quantum Explorer",
      description: "You blend scientific curiosity with spiritual openness. You're fascinated by the quantum nature of reality and how consciousness interacts with the physical world.",
      archetype: "Explorer",
    },
    {
      title: "Cosmic Sage",
      description: "Your wisdom comes from understanding the interconnectedness of all things. You see the universe as a living entity and yourself as an integral part of it.",
      archetype: "Sage",
    },
    {
      title: "Astral Voyager",
      description: "You're a natural traveler of the mind and spirit. Your imagination allows you to journey beyond physical limitations and explore the frontiers of consciousness.",
      archetype: "Voyager",
    },
    {
      title: "Star Weaver",
      description: "You see the threads that connect all beings and events. You have a gift for finding meaning in cosmic coincidences and weaving them into your life story.",
      archetype: "Weaver",
    },
  ];

  let archetypeIndex = 0;
  const finalQuestion = Object.keys(answers).find((key) => parseInt(key) === 5);
  if (finalQuestion) {
    const answer = answers[finalQuestion].toLowerCase();
    if (answer.includes("spiritual")) archetypeIndex = 0;
    else if (answer.includes("scientific")) archetypeIndex = 1;
    else if (answer.includes("wonder")) archetypeIndex = 3;
    else if (answer.includes("connection")) archetypeIndex = 4;
    else archetypeIndex = 2;
  }

  return c.json(archetypes[archetypeIndex]);
});

/**
 * POST /api/users/:id/subscription — Update user subscription (requires auth).
 */
router.post("/users/:id/subscription", requireAuth, async (c) => {
  const userId = parseInt(c.req.param("id"), 10);
  const currentUser = getUser(c);
  const storage: IStorage = c.get("storage");

  // Verify the authenticated user matches the requested userId
  if (!currentUser || currentUser.id !== userId) {
    return c.json({ message: "Forbidden" }, 403);
  }

  const body = await c.req.json();
  if (typeof body.isSubscribed !== "boolean") {
    return c.json({ message: "Invalid subscription status" }, 400);
  }

  try {
    const updatedUser = await storage.updateUserSubscription(userId, body.isSubscribed);
    if (!updatedUser) {
      return c.json({ message: "User not found" }, 404);
    }
    return c.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      isSubscribed: updatedUser.isSubscribed,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return c.json({ message: "Error updating subscription" }, 500);
  }
});

export { router as toolsRoutes };
