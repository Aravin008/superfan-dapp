const express = require("express");
const multer = require("multer");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/db');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feebackRoute');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { listenToNewEvent } = require("./listners/eventListner");
const app = express();
const PORT = 3001; // Run on different port from frontend dev server
connectDB();

// List of allowed origins
const whitelist = [
  "http://localhost:5173",
  // add more domains here
];

// Dynamic CORS config
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Serve NFT images and metadata
const nftDir = path.join(__dirname, "nfts");
if (!fs.existsSync(nftDir)) fs.mkdirSync(nftDir, { recursive: true });
app.use("/nfts", express.static(nftDir));

// Setup multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, nftDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.floor(Math.random() * 1e6);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});
const upload = multer({ storage });

app.get('/hc.html', (req, res) => {
  res.send("Service:: OK")
})

app.use('/api/user', userRoutes); // user profile routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
// All Event Listners register
listenToNewEvent();

// POST /upload-nft
app.post("/upload-nft", upload.single("image"), (req, res) => {
  const { name = "Untitled", description = "", attributes = "" } = req.body;
  const { file } = req;

  if (!file) return res.status(400).json({ error: "Image file is required." });

  const imageUrl = `/nfts/${file.filename}`;
  const metadata = {
    name,
    description,
    image: imageUrl,
    ...(attributes ? { attributes: JSON.parse(attributes) } : {}),
  };

  const jsonName = file.filename.replace(path.extname(file.filename), ".json");
  const metadataPath = path.join(nftDir, jsonName);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  res.json({
    success: true,
    metadataUrl: `http://localhost:${PORT}/nfts/${jsonName}`,
    metadata,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Backend dev server running on http://localhost:${PORT}`);
});

