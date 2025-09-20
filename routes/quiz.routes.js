const express = require("express");
const {generateStandaloneQuiz } = require("../controllers/quizController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();
router.post("/generate", generateStandaloneQuiz);

module.exports = router;