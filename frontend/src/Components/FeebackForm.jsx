import React, { useState } from "react";
import { useTheme } from "../context/ThemeProvider";

export default function FeedbackForm() {
  const [activeTab, setActiveTab] = useState('feedback'); // 'feedback' or 'complaint'
  const { theme } = useTheme();

  // Feedback Form State
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Complaint Form State
  const [complaintData, setComplaintData] = useState({
    name: "",
    email: "",
    company: "",
    orderNumber: "",
    complaintType: "",
    subject: "",
    description: "",
    desiredResolution: "",
    attachments: [],
    contactPreference: "email",
    urgency: "medium"
  });
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  const complaintTypes = [
    "Product Quality Issue",
    "Shipping/Delivery Problem",
    "Billing/Payment Issue",
    "Customer Service",
    "Website/Technical Problem",
    "Return/Refund Request",
    "Product Not as Described",
    "Other"
  ];

  const urgencyLevels = [
    { value: "low", label: "Low", description: "General inquiry" },
    { value: "medium", label: "Medium", description: "Need resolution within 48 hours" },
    { value: "high", label: "High", description: "Urgent - need resolution within 24 hours" },
    { value: "critical", label: "Critical", description: "Immediate attention required" }
  ];

  // Feedback Handlers
  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (ratingValue) => {
    setRating(ratingValue);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Feedback submitted:", { ...feedbackData, rating });
      setFeedbackSubmitted(true);
      resetFeedbackForm();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const resetFeedbackForm = () => {
    setFeedbackData({
      name: "",
      email: "",
      message: "",
      company: "",
    });
    setRating(0);
    setHover(0);
  };

  // Complaint Handlers
  const handleComplaintChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setComplaintData(prev => ({ ...prev, attachments: Array.from(files) }));
    } else {
      setComplaintData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingComplaint(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Complaint submitted:", complaintData);
      setComplaintSubmitted(true);
      resetComplaintForm();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  const resetComplaintForm = () => {
    setComplaintData({
      name: "",
      email: "",
      company: "",
      orderNumber: "",
      complaintType: "",
      subject: "",
      description: "",
      desiredResolution: "",
      attachments: [],
      contactPreference: "email",
      urgency: "medium"
    });
  };

  // Star Rating Component
  const StarRating = ({ value, onChange, hover, onHover }) => {
    return (
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              key={index}
              type="button"
              className="focus:outline-none"
              onClick={() => onChange(ratingValue)}
              onMouseEnter={() => onHover(ratingValue)}
              onMouseLeave={() => onHover(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-8 h-8 transition-colors duration-200 ${
                  ratingValue <= (hover || value) 
                    ? "text-yellow-400" 
                    : "text-gray-300"
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          );
        })}
        <span className="ml-2 text-sm text-gray-600">
          {value ? `${value} star${value !== 1 ? 's' : ''}` : "Rate us"}
        </span>
      </div>
    );
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-[#2D3748]' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Feedback System
          </h1>
          <p className="text-lg text-gray-600">
            We value your input. Choose how you'd like to share your experience with us.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 py-4 px-6 text-center font-medium text-lg transition-colors duration-200 ${
              activeTab === 'feedback'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Share Feedback</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('complaint')}
            className={`flex-1 py-4 px-6 text-center font-medium text-lg transition-colors duration-200 ${
              activeTab === 'complaint'
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>File Complaint</span>
            </div>
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Feedback Form */}
          {activeTab === 'feedback' && (
            <div>
              {feedbackSubmitted ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                  <p className="text-gray-600 mb-6">Your feedback has been submitted successfully.</p>
                  <button
                    onClick={() => setFeedbackSubmitted(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit More Feedback
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={feedbackData.name}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleFeedbackChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={feedbackData.email}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleFeedbackChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company (optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={feedbackData.company}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleFeedbackChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating <span className="text-red-500">*</span>
                    </label>
                    <StarRating
                      value={rating}
                      onChange={handleRatingChange}
                      hover={hover}
                      onHover={setHover}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Feedback Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={feedbackData.message}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      onChange={handleFeedbackChange}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmittingFeedback || rating === 0}
                      className={`flex-1 py-3 px-4 rounded-md text-white font-medium ${
                        isSubmittingFeedback || rating === 0
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                    </button>
                    <button
                      type="button"
                      onClick={resetFeedbackForm}
                      className="py-3 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Complaint Form */}
          {activeTab === 'complaint' && (
            <div>
              {complaintSubmitted ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Received!</h2>
                  <p className="text-gray-600 mb-6">We'll review your complaint and contact you within 24 hours.</p>
                  <button
                    onClick={() => setComplaintSubmitted(false)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    File Another Complaint
                  </button>
                </div>
              ) : (
                <form onSubmit={handleComplaintSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="complaint-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="complaint-name"
                        name="name"
                        value={complaintData.name}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        onChange={handleComplaintChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="complaint-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="complaint-email"
                        name="email"
                        value={complaintData.email}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        onChange={handleComplaintChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={complaintData.company}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        onChange={handleComplaintChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Order Number
                      </label>
                      <input
                        type="text"
                        id="orderNumber"
                        name="orderNumber"
                        value={complaintData.orderNumber}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        onChange={handleComplaintChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="complaintType" className="block text-sm font-medium text-gray-700 mb-1">
                        Complaint Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="complaintType"
                        name="complaintType"
                        value={complaintData.complaintType}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        onChange={handleComplaintChange}
                      >
                        <option value="">Select a category</option>
                        {complaintTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                        Urgency Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="urgency"
                        name="urgency"
                        value={complaintData.urgency}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        onChange={handleComplaintChange}
                      >
                        {urgencyLevels.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label} - {level.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={complaintData.subject}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      onChange={handleComplaintChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Detailed Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={complaintData.description}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      onChange={handleComplaintChange}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmittingComplaint}
                      className={`flex-1 py-3 px-4 rounded-md text-white font-medium ${
                        isSubmittingComplaint
                          ? "bg-red-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {isSubmittingComplaint ? "Submitting..." : "Submit Complaint"}
                    </button>
                    <button
                      type="button"
                      onClick={resetComplaintForm}
                      className="py-3 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}