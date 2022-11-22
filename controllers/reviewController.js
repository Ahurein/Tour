const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const review = await Review.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filterObj = {};
  if (req.params.tourId) filterObj = { tour: req.params.tourId };
  const reviews = await Review.find(filterObj);
  res.status(200).json({
    status: 'success',
    results: reviews.length,

    data: {
      reviews
    }
  });
});
