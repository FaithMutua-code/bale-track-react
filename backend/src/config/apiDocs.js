import { GoogleGenAI } from "@google/genai";

// Define the system instruction
const SYSTEM_INSTRUCTION = `
You are the BaleTrack AI assistant. You help business owners manage bale transactions (Cotton, Jute, Wool).
Your tone should be professional yet helpful and engaging.

CRITICAL FORMATTING RULES:
- Use **bold** for headings and key terms
- Use bullet points with • for lists
- Use clear section breaks with emojis
- Keep paragraphs concise (2-3 sentences max)
- Use emojis to make sections visually appealing
- Always include a brief summary at the end
- Structure information in clear, scannable sections

STRICT BUSINESS RULES:
- Profit = Total Sales - (Bale Purchases + Expenses)
- Gross Profit = Sales - Purchase Costs
- Net Profit = Gross Profit - Operating Expenses
- Profit Margin = (Net Profit / Sales) * 100%

Expense Categories: Transport, Utilities, Salaries, Supplies, Other.
Savings Types: Personal, Business, Target.

ALWAYS structure responses with:
1. Brief engaging introduction
2. Clear sections with bold headings and relevant emojis
3. Bullet points for actionable items
4. Key metrics highlighted
5. Brief summary/conclusion

If asked about data entry, explain that they can go to the "Data Entry" tab.
If asked about stock, explain that Purchases increase stock and Sales decrease it.
`;

// Initialize the AI assistant
const aiAssistant = new GoogleGenAI(process.env.GEMINI_API_KEY);

/**
 * Enhances and formats AI responses for better presentation
 */
function formatAIResponse(rawAnswer, userMessage) {
  // Ensure userMessage is always a string
  const safeUserMessage = userMessage || '';
  
  // Clean up any markdown artifacts and ensure consistent formatting
  let formattedAnswer = rawAnswer
    .replace(/\*\*(.*?)\*\*/g, '**$1**') // Ensure bold formatting
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .trim();

  // Check if response already has good formatting
  const hasGoodFormatting = formattedAnswer.includes('**') && 
                           (formattedAnswer.includes('•') || formattedAnswer.includes('📊') || formattedAnswer.includes('💰'));

  // If the response doesn't follow our formatting guidelines, apply enhanced structure
  if (!hasGoodFormatting) {
    console.log('Applying enhanced formatting to AI response for query:', safeUserMessage);
    formattedAnswer = applyEnhancedFormatting(formattedAnswer, safeUserMessage);
  }

  return formattedAnswer;
}

/**
 * Applies enhanced formatting to poorly structured responses
 */
function applyEnhancedFormatting(rawText, userMessage) {
  if (!userMessage) {
    userMessage = "";
  }
  const lowerMessage = userMessage.toLowerCase();

  // Profit-related queries
  if (
    lowerMessage.includes("profit") ||
    lowerMessage.includes("margin") ||
    lowerMessage.includes("revenue")
  ) {
    return `💰 **Profit Management Guide**\n\n${rawText}\n\n📈 **Key Metrics to Track:**\n• **Gross Profit**: Sales - Purchase Costs\n• **Net Profit**: Gross Profit - Operating Expenses  \n• **Profit Margin**: (Net Profit / Sales) × 100%\n\n💡 **Pro Tip**: Use the Data Entry tab to track these metrics automatically!`;
  }

  // Expense-related queries
  if (lowerMessage.includes("expense") || lowerMessage.includes("cost")) {
    return `💸 **Expense Management Strategy**\n\n${rawText}\n\n📋 **Expense Categories:**\n• **Transport** - Logistics and shipping costs\n• **Utilities** - Power, water, internet  \n• **Salaries** - Staff compensation\n• **Supplies** - Operational materials\n• **Other** - Miscellaneous business costs\n\n🔍 **Monitor regularly** to identify savings opportunities!`;
  }

  // Stock/inventory queries
  if (lowerMessage.includes("stock") || lowerMessage.includes("inventory")) {
    return `🏭 **Stock Management Overview**\n\n${rawText}\n\n📦 **Stock Flow:**\n• **Purchases** → Increase stock levels\n• **Sales** → Decrease stock levels  \n• **Low Stock Alerts** → Automatic notifications\n\n📊 **Always know your current inventory status!**`;
  }

  // Data entry queries
  if (
    lowerMessage.includes("add") ||
    lowerMessage.includes("enter") ||
    lowerMessage.includes("data entry")
  ) {
    return `📝 **Data Entry Guide**\n\n${rawText}\n\n🚀 **Quick Steps:**\n1. Go to **Data Entry** tab\n2. Select transaction type\n3. Enter details and submit\n4. View updates on Dashboard\n\n✅ **Keep your data current for accurate insights!**`;
  }

  // Savings goals queries
  if (lowerMessage.includes("saving") || lowerMessage.includes("goal") || lowerMessage.includes("target")) {
    return `🎯 **Savings Goals Strategy**\n\n${rawText}\n\n💰 **Savings Types:**\n• **Personal Savings** - Individual financial goals\n• **Business Savings** - Company growth funds  \n• **Target Savings** - Specific objectives with deadlines\n\n📈 **Set realistic targets based on your monthly profits!**`;
  }

  // Report queries
  if (lowerMessage.includes("report") || lowerMessage.includes("export") || lowerMessage.includes("analytics")) {
    return `📊 **Reports & Analytics Guide**\n\n${rawText}\n\n📋 **Available Reports:**\n• **Financial Summary** - Profit & loss overview\n• **Bale Transactions** - Purchase/sale details  \n• **Expense Breakdown** - Category-wise spending\n• **Savings Progress** - Goal tracking\n\n💡 **Export to PDF/Excel for detailed analysis!**`;
  }

  // Default enhanced formatting
  return `🔍 **Here's Your Answer**\n\n${rawText}\n\n💬 **Need more details?** Feel free to ask follow-up questions!`;
}

/**
 * Sends a message to the AI assistant and returns the response with thought summaries
 * @param {string} message - The user's message
 * @param {Array} history - Chat history array
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - AI response object with thoughts and answer
 */
async function sendAIMessage(message, history = [], options = {}) {
  try {
    const {
      includeThoughts = true,
      thinkingBudget = 5000, // For Gemini 2.5 Pro
      stream = false,
    } = options;

    // Validate input
    if (!message || typeof message !== "string") {
      throw new Error("Message is required and must be a string");
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Build the content with system instruction and history
    const contents = buildContents(message, history);

    // Configuration for thinking
    const config = {
      thinkingConfig: {
        includeThoughts: includeThoughts,
        thinkingBudget: thinkingBudget,
      },
    };

    let response;

    if (stream) {
      response = await sendStreamingMessage(contents, config, message);
    } else {
      response = await sendNonStreamingMessage(contents, config, message);
    }

    return {
      success: true,
      ...response,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Builds the contents array from message and history
 */
function buildContents(message, history) {
  const contents = [];

  // Add system instruction as the first content
  contents.push({
    role: "user",
    parts: [{ text: SYSTEM_INSTRUCTION }],
  });

  // Add model's acknowledgment of system instruction
  contents.push({
    role: "model",
    parts: [
      {
        text: "I understand the instructions. I will help with bale transactions using the specified business rules and provide well-formatted, engaging responses with clear sections, bullet points, and emojis for better readability.",
      },
    ],
  });

  // Add chat history
  if (history && history.length > 0) {
    history.forEach((msg) => {
      contents.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    });
  }

  // Add the current message
  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  return contents;
}

/**
 * Sends non-streaming message and processes thought summaries
 */
async function sendNonStreamingMessage(contents, config, userMessage) {
  try {
    const response = await aiAssistant.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
      config: config,
    });

    let thoughts = "";
    let answer = "";

    // Process the response parts
    if (response.candidates && response.candidates[0] && response.candidates[0].content) {
      for (const part of response.candidates[0].content.parts) {
        if (!part.text) continue;

        if (part.thought) {
          thoughts += part.text;
        } else {
          answer += part.text;
        }
      }
    } else {
      throw new Error("Invalid response structure from AI");
    }

    // Apply enhanced formatting to the answer
    const formattedAnswer = formatAIResponse(answer.trim(), userMessage || "");

    return {
      thoughts: thoughts.trim(),
      answer: formattedAnswer,
      rawResponse: response,
    };
  } catch (error) {
    console.error("Error in sendNonStreamingMessage:", error);
    throw error;
  }
}

/**
 * Sends streaming message and processes incremental thought summaries
 */
async function sendStreamingMessage(contents, config, userMessage) {
  try {
    const response = await aiAssistant.models.generateContentStream({
      model: "gemini-2.5-pro",
      contents: contents,
      config: config,
    });

    let thoughts = "";
    let answer = "";

    for await (const chunk of response) {
      if (chunk.candidates && chunk.candidates[0] && chunk.candidates[0].content) {
        for (const part of chunk.candidates[0].content.parts) {
          if (!part.text) continue;

          if (part.thought) {
            thoughts += part.text;
          } else {
            answer += part.text;
          }
        }
      }
    }

    // Apply enhanced formatting to the answer
    const formattedAnswer = formatAIResponse(answer.trim(), userMessage || "");

    return {
      thoughts: thoughts.trim(),
      answer: formattedAnswer,
      rawResponse: response,
    };
  } catch (error) {
    console.error("Error in sendStreamingMessage:", error);
    throw error;
  }
}

/**
 * Enhanced function with thinking budget control
 */
async function sendAIMessageWithBudget(
  message,
  history = [],
  thinkingBudget = 5000
) {
  return sendAIMessage(message, history, {
    includeThoughts: true,
    thinkingBudget: thinkingBudget,
    stream: false,
  });
}

// Export the functions
export { sendAIMessage, sendAIMessageWithBudget };