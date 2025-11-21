// components/AIAssistant.jsx
import { useState, useRef, useEffect } from "react";
import {
  MicrophoneIcon,
  PaperAirplaneIcon,
  XIcon,
  ChatIcon,
} from "@heroicons/react/outline";
import { useTheme } from "../context/ThemeProvider";

import axios from "axios";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { theme } = useTheme();

  const backendUrl = import.meta.env.VITE_BACKEND_URL + "/assistant/chat";

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

  // Remove the local analyzeBaleData function since we'll use the API

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

  try {
    // Convert messages to history format expected by backend
    const history = messages
      .filter(msg => msg.id !== 1) // Exclude initial welcome message
      .map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

    // Prepare request body according to your backend expectations
    const requestBody = {
      message: inputMessage,
      history: history,
      includeThoughts: true,
      thinkingBudget: 5000,
      stream: false
    };

    console.log("=== FRONTEND DEBUG INFO ===");
    console.log("Backend URL:", backendUrl);
    console.log("Request Body:", JSON.stringify(requestBody, null, 2));
    console.log("Environment VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);

    const response = await axios.post(backendUrl, requestBody, {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 30000
    });

    console.log("=== BACKEND RESPONSE ===");
    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    // Axios wraps the response in data property
    const responseData = response.data;

    if (responseData.success) {
      const aiMessage = {
        id: Date.now() + 1,
        text: responseData.answer,
        sender: "ai",
        timestamp: new Date(),
        thoughts: responseData.includeThoughts ? responseData.thoughts : null,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } else {
      const errorMessage = {
        id: Date.now() + 1,
        text: responseData.error || "Sorry, I'm having trouble responding right now. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  } catch (error) {
    console.log("=== ERROR DETAILS ===");
    console.error('Full error object:', error);
    
    if (error.response) {
      // Server responded with error status
      console.log("Error Response Status:", error.response.status);
      console.log("Error Response Data:", error.response.data);
      console.log("Error Response Headers:", error.response.headers);
    } else if (error.request) {
      // Request made but no response received
      console.log("No response received. Request:", error.request);
    } else {
      // Something else happened
      console.log("Error Message:", error.message);
    }
    
    console.log("Error Config:", error.config);
    
    let errorText = "I'm experiencing connection issues. Please check your internet connection and try again.";
    
    if (error.response) {
      errorText = error.response.data?.error || `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorText = "Unable to connect to the AI service. Please check if the backend server is running.";
    } else if (error.code === 'ECONNABORTED') {
      errorText = "Request timed out. The AI is taking longer than expected to respond.";
    } else if (error.message.includes('Network Error')) {
      errorText = "Network error. Please check your internet connection and CORS settings.";
    }
    
    const errorMessage = {
      id: Date.now() + 1,
      text: errorText,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

const quickActions = [
    { label: "Profit Analysis", query: "How do I calculate profit for cotton bales?" },
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

      {/* Chat Panel on the Right Side */}
      {isOpen && (
        <div
          className={`fixed top-0 right-0 h-full w-80 sm:w-96 shadow-2xl border-l flex flex-col z-50 ${themeStyles.container} ${themeStyles.border}`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 border-b ${themeStyles.header}`}
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
                  {/* Optional: Show thoughts if available */}
                  {message.thoughts && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer opacity-70">
                        🤔 See AI's thought process
                      </summary>
                      <div className="mt-1 p-2 bg-opacity-50 rounded text-xs whitespace-pre-line">
                        {message.thoughts}
                      </div>
                    </details>
                  )}
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
