// components/AIAssistant.jsx
import { useState, useRef, useEffect } from "react";
import {
  MicrophoneIcon,
  PaperAirplaneIcon,
  XIcon,
  ChatIcon,
} from "@heroicons/react/outline";
import { useTheme } from "../context/ThemeProvider";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Theme-aware styles
  const themeStyles = {
    container:
      theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200",
    header:
      theme === "dark"
        ? "bg-primary-dark border-gray-700 text-white"
        : "bg-primary border-gray-200 text-white",
    messageAI:
      theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800",
    messageUser:
      theme === "dark" ? "bg-primary-dark text-white" : "bg-primary text-white",
    input:
      theme === "dark"
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500",
    quickAction:
      theme === "dark"
        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700",
    textMuted: theme === "dark" ? "text-gray-400" : "text-gray-500",
    border: theme === "dark" ? "border-gray-700" : "border-gray-200",
  };

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your BaleTrack AI assistant. I can help you with:\n\n• Analyzing your bale transactions\n• Explaining profit calculations\n• Helping with data entry\n• Generating insights from your reports\n• Answering questions about your business\n\nHow can I help you today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const analyzeBaleData = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Profit analysis
    if (
      lowerMessage.includes("profit") ||
      lowerMessage.includes("revenue") ||
      lowerMessage.includes("margin")
    ) {
      return "I can analyze your profit trends. Based on your dashboard, profit is calculated as: **Total Sales - (Bale Purchases + Expenses)**.\n\n💰 **Key Metrics:**\n• Gross Profit: Sales - Purchase Costs\n• Net Profit: Gross Profit - Operating Expenses\n• Profit Margin: (Net Profit / Sales) × 100%\n\nCheck your Reports page for detailed breakdowns and trends over time.";
    }

    // Stock management
    if (
      lowerMessage.includes("stock") ||
      lowerMessage.includes("inventory") ||
      lowerMessage.includes("warehouse")
    ) {
      return "🏭 **Stock Management Overview:**\n\nYour warehouse stock is tracked automatically:\n• **Purchases** increase stock levels\n• **Sales** decrease stock levels\n• **Low stock alerts** when levels drop below threshold\n\n📊 **Current Status:** View real-time stock levels on your Dashboard and manage bales in Data Entry section.";
    }

    // Expense analysis
    if (
      lowerMessage.includes("expense") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("spending")
    ) {
      return "💸 **Expense Tracking:**\n\nExpenses are categorized into:\n• **Transport** - Logistics and shipping\n• **Utilities** - Power, water, internet\n• **Salaries** - Staff payments\n• **Supplies** - Operational materials\n• **Other** - Miscellaneous costs\n\n📈 **Impact:** All expenses affect your net profit. Track them regularly in Data Entry → Expenses tab.";
    }

    // Savings goals
    if (
      lowerMessage.includes("saving") ||
      lowerMessage.includes("goal") ||
      lowerMessage.includes("target")
    ) {
      return "🎯 **Savings Goals Management:**\n\nYou can set three types of savings:\n• **Personal Savings** - Individual financial goals\n• **Business Savings** - Company growth funds\n• **Target Savings** - Specific objectives with deadlines\n\n💡 **Tip:** Set realistic targets based on your monthly profit margins for achievable goals.";
    }

    // Data entry help
    if (
      lowerMessage.includes("add") ||
      lowerMessage.includes("enter") ||
      lowerMessage.includes("data entry") ||
      lowerMessage.includes("create")
    ) {
      return "📝 **Data Entry Guide:**\n\n**To Add Bales:**\n1. Go to **Data Entry** tab\n2. Select **Bales** section\n3. Choose bale type (Cotton, Jute, Wool)\n4. Select transaction type (Purchase/Sale)\n5. Enter quantity and price per unit\n6. Add optional description\n7. Submit the form\n\n**To Add Expenses:**\n1. Switch to **Expenses** tab in Data Entry\n2. Select category and enter amount\n3. Add description and date\n4. Submit\n\n**To Add Savings:**\n1. Switch to **Savings** tab\n2. Choose savings type and amount\n3. Set target if applicable\n4. Submit";
    }

    // Report generation
    if (
      lowerMessage.includes("report") ||
      lowerMessage.includes("export") ||
      lowerMessage.includes("download")
    ) {
      return "📊 **Reports & Analytics:**\n\nAvailable report types:\n• **Financial Summary** - Profit & loss overview\n• **Bale Transactions** - Purchase/sale details\n• **Expense Breakdown** - Category-wise spending\n• **Savings Progress** - Goal tracking\n\n📁 **Export Options:**\n• **PDF** - For formal reporting and sharing\n• **Excel** - For data analysis and manipulation\n\nNavigate to **Reports** page and use export buttons in top-right corner.";
    }

    // Dashboard help
    if (
      lowerMessage.includes("dashboard") ||
      lowerMessage.includes("overview") ||
      lowerMessage.includes("home")
    ) {
      return "🏠 **Dashboard Overview:**\n\nYour dashboard shows:\n• **Net Profit/Loss** - Current financial position\n• **Warehouse Stock** - Available bale inventory\n• **Monthly Expenses** - Current period spending\n• **Total Savings** - Accumulated savings\n• **Bales Activity Chart** - Weekly transactions\n• **Recent Transactions** - Latest activities\n• **Expense Breakdown** - Spending categories\n\nUse this for quick business health checks!";
    }

    // Theme/UI questions
    if (
      lowerMessage.includes("theme") ||
      lowerMessage.includes("dark") ||
      lowerMessage.includes("light") ||
      lowerMessage.includes("mode") ||
      lowerMessage.includes("appearance")
    ) {
      return "🎨 **Theme Settings:**\n\nYou can switch between:\n• **Light Mode** - Bright interface for daytime\n• **Dark Mode** - Softer interface for nighttime\n\n**To change theme:**\n1. Look for the moon/sun icon in sidebar\n2. Click to toggle between modes\n3. Your preference is saved automatically\n\nThe theme applies to all pages including Dashboard, Data Entry, Savings, and Reports.";
    }

    // General business advice
    if (
      lowerMessage.includes("advice") ||
      lowerMessage.includes("improve") ||
      lowerMessage.includes("better") ||
      lowerMessage.includes("tip")
    ) {
      return "💡 **Business Optimization Tips:**\n\nBased on industry best practices:\n• **Stock Management** - Maintain 2-4 weeks of inventory\n• **Pricing Strategy** - Regular competitor analysis\n• **Expense Control** - Monthly expense reviews\n• **Savings Habit** - Allocate 10-20% of profits to savings\n• **Data Consistency** - Daily transaction recording\n• **Seasonal Planning** - Adjust for market fluctuations\n• **Customer Feedback** - Regular system feedback collection";
    }

    // Feature explanations
    if (
      lowerMessage.includes("feature") ||
      lowerMessage.includes("what can") ||
      lowerMessage.includes("help with")
    ) {
      return "🔧 **BaleTrack Features I Can Help With:**\n\n**Core Functions:**\n• Bale transaction tracking\n• Warehouse stock management\n• Expense categorization\n• Savings goal setting\n• Financial reporting\n• Profit analysis\n\n**Advanced Features:**\n• Dark/Light theme switching\n• PDF/Excel report exports\n• Real-time dashboard updates\n• Mobile-responsive design\n• Data filtering and sorting\n\nAsk me about any specific feature!";
    }

    // Default response for unknown queries
    return "🤖 **BaleTrack Assistant:**\n\nI understand you're asking about bale management. Could you be more specific about:\n\n📈 **Financial Analysis**\n• Profit calculations and margins\n• Revenue optimization\n• Expense management\n\n🏭 **Operations**\n• Stock and inventory management\n• Bale tracking procedures\n• Warehouse operations\n\n💾 **Data Management**\n• Data entry procedures\n• Report generation\n• Export functionality\n\n🎯 **Planning**\n• Savings goals\n• Business strategy\n• Performance improvement\n\nI'm here to help you get the most from BaleTrack!";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = analyzeBaleData(inputMessage);
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: "Profit Analysis", query: "How is my profit calculated?" },
    { label: "Add Bale", query: "How do I add a new bale?" },
    { label: "Stock Status", query: "Tell me about stock management" },
    { label: "Expense Help", query: "How should I track expenses?" },
  ];

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50 ${
            theme === "dark"
              ? "bg-primary-dark hover:bg-primary text-white"
              : "bg-primary hover:bg-primary-dark text-white"
          }`}
          aria-label="Open AI Assistant"
        >
          <ChatIcon className="w-6 h-6" />
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-80 sm:w-96 h-96 rounded-2xl shadow-2xl border flex flex-col z-50 ${themeStyles.container} ${themeStyles.border}`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 border-b rounded-t-2xl ${themeStyles.header} ${themeStyles.border}`}
          >
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  theme === "dark" ? "bg-gray-700" : "bg-white"
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    theme === "dark" ? "text-primary-light" : "text-primary"
                  }`}
                >
                  AI
                </span>
              </div>
              <div>
                <h3 className="font-semibold">BaleTrack Assistant</h3>
                <p className="text-xs opacity-80">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? `${themeStyles.messageUser} rounded-br-none`
                      : `${themeStyles.messageAI} rounded-bl-none`
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p
                    className={`text-xs opacity-70 mt-1 ${
                      message.sender === "user"
                        ? "text-blue-100"
                        : themeStyles.textMuted
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className={`rounded-2xl rounded-bl-none px-4 py-2 ${themeStyles.messageAI}`}
                >
                  <div className="flex space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full animate-bounce ${
                        theme === "dark" ? "bg-gray-400" : "bg-gray-500"
                      }`}
                    ></div>
                    <div
                      className={`w-2 h-2 rounded-full animate-bounce ${
                        theme === "dark" ? "bg-gray-400" : "bg-gray-500"
                      }`}
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className={`w-2 h-2 rounded-full animate-bounce ${
                        theme === "dark" ? "bg-gray-400" : "bg-gray-500"
                      }`}
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className={`text-xs mb-2 ${themeStyles.textMuted}`}>
                Quick actions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(action.query)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${themeStyles.quickAction}`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className={`p-4 border-t ${themeStyles.border}`}>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your bales, profits, or reports..."
                  className={`w-full px-4 py-2 pr-10 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm ${themeStyles.input}`}
                  rows="1"
                  style={{ minHeight: "40px", maxHeight: "120px" }}
                />
                <button
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors ${
                    theme === "dark"
                      ? "text-gray-400 hover:text-primary-light"
                      : "text-gray-400 hover:text-primary"
                  }`}
                >
                  <MicrophoneIcon className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-2 rounded-2xl transition-colors ${
                  theme === "dark"
                    ? "bg-primary-dark text-white hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
