const UserProfile = require('../models/UserProfile');
const CustomError = require('../utils/CustomErrors'); // optional helper for throwing errors

const createOrUpdateProfile = async (req, res, next) => {
  try {
    const { accountId, name, bio, avatarUrl, isCreator, socials } = req.body;

    if (!accountId) {
      throw new CustomError('Wallet ID is required', 400);
    }

    const update = {
      name,
      bio,
      avatarUrl,
      isCreator,
      socials,
      updatedAt: Date.now(),
    };

    const profile = await UserProfile.findOneAndUpdate(
      { accountId },
      update,
      { new: true, upsert: true }
    );

    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

const getPublicProfile = async (req, res, next) => {
  try {
    const { walletId } = req.params;

    const profile = await UserProfile.findOne({ accountId: walletId });

    if (!profile) {
      throw new CustomError('Profile not found', 404);
    }

    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const { address } = req.user;

    const profile = await UserProfile.findOne({ accountId: address });

    if (!profile) {
      // User authenticated cause he reached here using token but not found in db
      return res.status(200).json({ accountId: address, profile: null });
    }

    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

const getCreators = async (req, res) => {
  const { search = "", exact = "false", page = 1, limit = 20 } = req.query;
  const query = {};

  if (search) {
    if (exact === "true") {
      // Exact address match
      query.accountId = search.toLowerCase();
    } else {
      // Partial match on name or address
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // case insensitive
        { accountId: { $regex: search, $options: "i" } },
      ];
    }
  }

  // Always only search creators
  query.isCreator = true;

  const creators = await UserProfile
    .find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  if (exact === "true" && creators.length === 0) {
    throw new CustomError("User Not Found.", 404);
  }

  return res.json({ creators });
}


module.exports = {
  createOrUpdateProfile,
  getPublicProfile,
  getMe,
  getCreators
}