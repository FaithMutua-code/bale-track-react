import React, { useState } from "react";
import { useTheme } from "../context/ThemeProvider";

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {theme } = useTheme()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (ratingValue) => {
    setRating(ratingValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Submitted data:", { ...formData, rating });
      setSubmitSuccess(true);
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        message: "",
        company: "",
      });
      setRating(0);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {rating ? `${rating} star${rating !== 1 ? 's' : ''}` : "Rate us"}
        </span>
      </div>
    );
  };

  return (
    <div 
    
    className="min-h-screen bg-[#2D3748] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
        {submitSuccess ? (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-3 text-lg font-medium text-gray-900">
              Thank you for your feedback!
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              We appreciate you taking the time to share your experience with us.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="mt-5 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit another feedback
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Share Your Feedback
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  placeholder="Your name"
                  required
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  placeholder="your.email@example.com"
                  required
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company (optional)
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  placeholder="Your company name"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Feedback Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  placeholder="Your feedback helps us improve. Please share your thoughts..."
                  required
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting || rating === 0
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Feedback
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 ml-2"
                      >
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}