const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const z = require("zod");
const { User } = require("../db");
const { authMiddleware } = require("../middleware");
const {
  getJwtSecret,
  hashPassword,
  isHashedPassword,
  verifyPassword,
} = require("../auth");

const JWT_SECRET = getJwtSecret();

const signupBody = z.object({
  mailId: z.string().email(),
  username: z.string(),
  income: z.number(),
  password: z.string().min(6),
  fixedExpense: z.number(),
  expectedSaving: z.number(),
  balance: z.number(),
});
router.post("/signup", async (req, res) => {
  try {
    const { success } = signupBody.safeParse(req.body);
    const normalizedMailId = req.body.mailId?.trim().toLowerCase();

    if (!success) {
      return res.status(411).json({
        message: "Enter Inputs in proper format.",
      });
    }
    const ExistingUser = await User.findOne({
      mailId: normalizedMailId,
    });
    if (ExistingUser) {
      return res.status(411).json({
        message: "Email already taken.",
      });
    }
    const user = await User.create({
      mailId: normalizedMailId,
      username: req.body.username,
      password: hashPassword(req.body.password),
      income: req.body.income,
      balance: req.body.balance,
      fixedExpense: req.body.fixedExpense,
      expectedSaving: req.body.expectedSaving,
    });

    const userId = user._id;

    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );

    res.json({
      message: "User Signed Up successfully.",
      token: token,
    });
  } catch (error) {
    console.error("Signup failed:", error);
    res.status(503).json({
      message: "Database unavailable. Please check the MongoDB connection and try again.",
    });
  }
});

//Sign In route
const signinBody = z.object({
  mailId: z.string().email(),
  password: z.string(),
});

//signin post req
router.post("/signin", async (req, res) => {
  try {
    const { success } = signinBody.safeParse(req.body);
    const normalizedMailId = req.body.mailId?.trim().toLowerCase();

    if (!success) {
      return res.status(411).json({
        message: "Invalid Inputs!!",
      });
    }

    const user = await User.findOne({
      mailId: normalizedMailId,
    });

    if (user && verifyPassword(req.body.password, user.password)) {
      if (!isHashedPassword(user.password)) {
        user.password = hashPassword(req.body.password);
        await user.save();
      }

      const token = jwt.sign(
        {
          userId: user._id,
        },
        JWT_SECRET
      );

      res.json({
        token: token,
      });
      return;
    }

    res.status(411).json({
      message: "Invalid email or password.",
    });
  } catch (error) {
    console.error("Signin failed:", error);
    res.status(503).json({
      message: "Database unavailable. Please check the MongoDB connection and try again.",
    });
  }
});

const getUserHandler = async (req, res) => {
  const userId = req.userId;
  const user = await User.findOne({
    _id: userId,
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ user });
};

router.get("/getuser", authMiddleware, getUserHandler);
router.get("/getUser", authMiddleware, getUserHandler);
//student will put the assignment code and gets into assignment page

module.exports = router;
