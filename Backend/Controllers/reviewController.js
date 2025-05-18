const Review = require('../model/review');
const Booking = require('../model/booking');

exports.submitReview = async (req, res) => {
  try {
    const { booking_id, rating, comment } = req.body;
    const userId = req.user.userId; // From auth middleware
    
    // Verify the booking exists and belongs to the user
    const booking = await Booking.findOne({ 
      _id: booking_id,
      user_id: userId,
      booking_status: 'completed'
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not eligible for review' });
    }
    
    // Check if a review already exists
    const existingReview = await Review.findOne({ booking_id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this trip' });
    }
    
    // Create the review
    const review = new Review({
      user_id: userId,
      booking_id,
      trip_id: booking.trip_id,
      rating,
      comment
    });
    
    await review.save();
    
    res.status(201).json({ 
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
