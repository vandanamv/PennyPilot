const express = require("express");
const router = express.Router();
const z = require("zod");
const { User, Goal } = require("../db");
const { authMiddleware } = require("../middleware");

// const AnswerBody = z.object({
//   assignmentCode: z.string(),
//   answers: z.array(ansBody),
//   plagiarismReport: z.number().optional(),
//   time: z.string(), // Ensure time is a string representing a date
// });

router.post("/postgoal", authMiddleware, async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);

  try {
    await Goal.create({
      userId: req.userId,
      title: req.body.title,
      targetAmount: req.body.targetAmount,
      duration: req.body.duration,
    });
    res.status(200).json({ message: "Goal created successfully" });
  } catch (error) {
    console.error("Error saving answer: ", error);
  }
});

router.get("/getgoal", authMiddleware, async (req, res) => {
  try {
    const goal = await Goal.find({
      userId: req.userId,
    });
    res.json({ goal });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

module.exports = router;
//TODOs
// Answer route when request by  student in front end
// get answer route
