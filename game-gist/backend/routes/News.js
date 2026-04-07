const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");
const { addNews, getNews, getNewsById, deleteNews, getApiNews } = require("../controller/news");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extOk = allowed.test(file.originalname.toLowerCase().split(".").pop());
  const mimeOk = allowed.test(file.mimetype);
  cb(extOk && mimeOk ? null : new Error("Only JPEG, PNG, WebP allowed"), extOk && mimeOk);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.post(
  "/",
  auth,
  adminOnly,
  upload.single("image"),
  [
    body("title").trim().notEmpty().withMessage("Title required"),
    body("shortDesc").trim().notEmpty().withMessage("Short description required"),
    body("description").trim().notEmpty().withMessage("Description required"),
  ],
  addNews
);

router.get("/", getNews);
router.get("/external", getApiNews);
router.get("/:id", getNewsById);
router.delete("/:id", auth, adminOnly, deleteNews);

module.exports = router;
