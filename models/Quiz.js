const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    question: { type: String, required: true },
    options: {
      type: [String], // ["Option A", "Option B", "Option C", "Option D"]
      validate: [arr => arr.length === 4, "Must have exactly 4 options"]
    },
    answer: { type: String, required: true }, // must match one of options
    isPinned: { type: Boolean, default: false },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", QuizSchema);
