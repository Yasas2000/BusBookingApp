import React, { useState, useRef, useEffect } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import axios from "axios";

const RatingPopup = ({ bookingId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const modalRef = useRef(null);

  // Close when clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await axios.post("/review/submit", {
        booking_id: bookingId,
        rating,
        comment,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(
        "Failed to submit review. Please try again." + err.response.data.message
      );
      console.error("Error submitting review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaTimes />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-bold mb-2">Thank You!</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Your feedback has been submitted successfully.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-violet-600 mb-6">
              How's your Trip!
            </h2>

            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="hidden"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar
                      className="text-3xl mx-1 transition-colors duration-200"
                      color={
                        ratingValue <= (hover || rating) ? "#FFD700" : "#e4e5e9"
                      }
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>

            <div className="mb-6">
              <label
                htmlFor="comment"
                className="block mb-2 font-medium text-neutral-800 dark:text-neutral-100"
              >
                Comment
              </label>
              <textarea
                id="comment"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full text-neutral-800 dark:text-neutral-100 bg-neutral-200/60 dark:bg-neutral-900/60 px-3 py-2 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
              ></textarea>
            </div>

            {error && (
              <div className="mb-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-violet-600 text-white font-medium rounded-md hover:bg-violet-700 transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RatingPopup;
