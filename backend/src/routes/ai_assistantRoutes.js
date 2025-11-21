import express from "express";
import { sendAIMessage } from "../config/apiDocs.js";

const aiRouter = express.Router();

/**
 * POST /api/ai/chat
 * Send a message to the AI assistant with optional thought summaries
 *
 * Request Body:
 * {
 *   "message": "string (required)",
 *   "history": "array (optional)",
 *   "includeThoughts": "boolean (optional, default: true)",
 *   "thinkingBudget": "number (optional, default: 5000)",
 *   "stream": "boolean (optional, default: false)"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "thoughts": "string",
 *   "answer": "string",
 *   "timestamp": "string"
 * }
 */
aiRouter.post("/chat", async (req, res) => {
  try {
    const {
      message,
      history = [],
      includeThoughts = true,
      thinkingBudget = 5000,
      stream = false,
    } = req.body;

    // Validate required fields
    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    if (typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Message must be a string",
      });
    }

    // Validate history format if provided
    if (history && !Array.isArray(history)) {
      return res.status(400).json({
        success: false,
        error: "History must be an array",
      });
    }

    // Validate thinking budget
    if (
      thinkingBudget &&
      (typeof thinkingBudget !== "number" || thinkingBudget < 0)
    ) {
      return res.status(400).json({
        success: false,
        error: "Thinking budget must be a positive number",
      });
    }

    // Call the AI function with all parameters
     const result = await sendAIMessage(message, history, {
      includeThoughts,
      thinkingBudget,
      stream,
      userMessage: message // Pass the original message for formatting
    });

    // Return appropriate status code based on success
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/ai/health
 * Health check endpoint to verify AI service is working
 */
aiRouter.get("/health", async (req, res) => {
  try {
    // Test with a simple message to verify the AI service is working
    const testResult = await sendAIMessage(
      "Say 'OK' if you are working properly",
      [],
      { includeThoughts: false }
    );

    res.json({
      status: testResult.success ? "healthy" : "unhealthy",
      service: "BaleTrack AI",
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
      aiResponse: testResult.success ? "responsive" : "unresponsive",
    });
  } catch (error) {
    console.error("Health Check Error:", error);
    res.status(503).json({
      status: "unhealthy",
      service: "BaleTrack AI",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/ai/examples
 * Returns example requests for testing
 */
aiRouter.get("/examples", (req, res) => {
  const examples = {
    example_requests: [
      {
        name: "Basic Profit Calculation",
        method: "POST",
        endpoint: "/api/ai/chat",
        body: {
          message: "How do I calculate profit for cotton bales?",
          history: [],
          includeThoughts: true,
          thinkingBudget: 5000,
        },
      },
      {
        name: "Complex Business Analysis",
        method: "POST",
        endpoint: "/api/ai/chat",
        body: {
          message:
            "Compare cotton vs jute bale profitability with sample numbers",
          history: [],
          includeThoughts: true,
          thinkingBudget: 8000,
        },
      },
      {
        name: "With Chat History",
        method: "POST",
        endpoint: "/api/ai/chat",
        body: {
          message: "Now calculate net profit with $2,000 operating expenses",
          history: [
            {
              sender: "user",
              text: "My gross profit is $5,000",
            },
            {
              sender: "ai",
              text: "Great! Gross profit of $5,000 is a good starting point. To calculate net profit, we need to subtract operating expenses from this amount.",
            },
          ],
          includeThoughts: true,
          thinkingBudget: 4000,
        },
      },
      {
        name: "Without Thoughts (Faster)",
        method: "POST",
        endpoint: "/api/ai/chat",
        body: {
          message: "What are the expense categories?",
          history: [],
          includeThoughts: false,
        },
      },
    ],
  };
  res.json(examples);
});

export default aiRouter;
