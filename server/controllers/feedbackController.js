const Feedback = require('../models/Feedback');
const CustomError = require('../utils/CustomErrors'); // optional helper for throwing errors

const createFeedback = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !message) {
      throw new CustomError('Name and message are required', 400);
    }

    const data = {
      name: name.trim(),
      email: email?.trim(),
      message: message.trim(),
      updatedAt: Date.now(),
    };

    const newFeedback = new Feedback(data);
    await newFeedback.save();

    res.status(200).json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
};

const getFeedbacks = async (req, res, next) => {
  try {
    const queryParams = req.query;
    const pageSize = 10;
    const currentPage = parseInt(queryParams.page, 10) || 1;
    const offset = (currentPage - 1) * pageSize;

    const total = await Feedback.countDocuments();

    if (offset >= total) {
      return res.status(200).json({
        data: [],
        meta: { current: currentPage, next: null, total }
      });
    }

    const feedbackList = await Feedback.find({})
      .sort({ updatedAt: -1 }) // latest first
      .skip(offset)
      .limit(pageSize);

    res.status(200).json({
      data: feedbackList,
      meta: {
        current: currentPage,
        next: offset + pageSize < total ? currentPage + 1 : null,
        total
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFeedback,
  getFeedbacks
};
