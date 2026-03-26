const express = require("express");
const router = express.Router();
const { Transaction, User } = require("../db");
const { authMiddleware } = require("../middleware");

router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { amount, category, to } = req.body;

    // Find the user and check balance
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has sufficient balance
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Create a new transaction
    const newTransaction = await Transaction.create({
      userId: req.userId,
      date: new Date(),
      amount,
      category,
      to,
    });

    // Deduct amount from user's balance
    user.balance -= amount;

    // Save the updated user balance
    await user.save();

    res.status(200).json({
      message: "Transaction successful",
      balance: user.balance,
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error performing transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/deposit", authMiddleware, async (req, res) => {
  try {
    const { depositAmount } = req.body;

    // Ensure depositAmount is provided
    if (!depositAmount) {
      return res.status(400).json({ message: "Deposit amount is required" });
    }

    // Find the user and update their balance
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.balance += depositAmount;

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: "Deposit successful",
      balance: user.balance,
    });
  } catch (error) {
    console.error("Error Transaction", error);
    res.status(500).json({
      message: "Error occurred",
    });
  }
});

router.get("/getTransaction", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.userId,
    }).sort({ date: -1 });
    res.json({
      transactions: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:transactionId", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.transactionId,
      userId: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.balance += transaction.amount;
    await user.save();
    await transaction.deleteOne();

    res.status(200).json({
      message: "Transaction deleted successfully",
      balance: user.balance,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
