const Message = require('../models/Message');
const CustomError = require('../utils/CustomErrors');

const getMessages = async (req, res, next) => {
  try {
    const { page = 1, accountId, type } = req.query;
    // const queryParams = req.query;
    const pageSize = 10;
    const currentPage = parseInt(page, 10) || 1;
    const offset = (currentPage - 1) * pageSize;

    const filter = {};

    // Sent = from this user, Received = to this user
    if (accountId && type === "sent") {
      filter.from = accountId;
    } else if (accountId && type === "received") {
      filter.to = accountId;
    }

    const total = await Message.countDocuments();

    if (offset >= total) {
      return res.status(200).json({
        data: [],
        meta: { current: currentPage, next: null, total }
      });
    }

    const messageList = await Message.find(filter)
      .sort({ updatedAt: -1 }) // latest first
      .skip(offset)
      .limit(pageSize);

    res.status(200).json({
      data: messageList,
      meta: {
        current: currentPage,
        next: (offset + pageSize < total) && (messageList.length === pageSize) 
              ? currentPage + 1 : null,
        total
      }
    });
  } catch (err) {
    next(err);
  }
};

const getMessagesWithReply = async (req, res, next) => {
  try {
    const { page = 1, accountId, type } = req.query;
    const pageSize = 10;
    const currentPage = parseInt(page, 10) || 1;
    const skip = (currentPage - 1) * pageSize;

    const match = {};

    // Sent = from this user, Received = to this user
    if (accountId && type === "sent") {
      match.from = accountId;
    } else if (accountId && type === "received") {
      match.to = accountId;
    }

    // Only fetch top-level messages (not replies)
    match.replyTo = null;

    const result = await Message.aggregate([
      { $match: match },
      { $sort: { updatedAt: -1 } },
      { $skip: skip },
      { $limit: pageSize },

      // Join with replies (assuming 1 reply per message max)
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "replyTo",
          as: "replies"
        }
      },
      {
        $addFields: {
          reply: { $arrayElemAt: ["$replies", 0] }
        }
      },
      { $project: { replies: 0 } } // Clean up
    ]);

    // Count total top-level messages
    const total = await Message.countDocuments({ ...match });

    res.status(200).json({
      data: result,
      meta: {
        current: currentPage,
        next: (skip + pageSize < total && result.length === pageSize)
          ? currentPage + 1 : null,
        total
      }
    });
  } catch (err) {
    next(err);
  }
};

const getMessageById = async (req, res) => {
  const message = await Message.findOne({ msgId: req.params.id }).lean();
  if (!message) {
    throw new CustomError("Not Found", 404);
  }

  res.json({ data: message });
};

const getMessageByIdWithReply = async (req, res) => {
  const result = await Message.aggregate([
    { $match: { msgId: req.params.id } },
    {
      $lookup: {
        from: "messages",
        localField: "_id",
        foreignField: "replyTo",
        as: "replies"
      }
    },
    {
      $addFields: {
        reply: { $arrayElemAt: ["$replies", 0] }
      }
    },
    { $project: { replies: 0 } }
  ]);

  if (!result.length) {
    throw new CustomError("Not Found", 404);
  }

  res.json({ data: result[0] });
};

module.exports = {
  getMessages,
  getMessagesWithReply,
  getMessageById,
  getMessageByIdWithReply
}