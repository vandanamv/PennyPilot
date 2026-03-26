const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware");
const { BudgetLimit, Transaction } = require("../db");

const getStartOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getStartOfWeek = (date) => {
  const current = new Date(date);
  const day = current.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  current.setDate(current.getDate() + diff);
  current.setHours(0, 0, 0, 0);
  return current;
};

const getStartOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const getAlertLevel = (usage) => {
  if (usage >= 90) return "critical";
  if (usage >= 75) return "warning";
  if (usage >= 50) return "watch";
  return "safe";
};

const buildBudgetSummary = (limits, spending) => {
  const summarize = (label, limit, spent) => {
    const usage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    return {
      label,
      limit,
      spent,
      remaining: Math.max(limit - spent, 0),
      usage: limit > 0 ? usage : 0,
      alertLevel: limit > 0 ? getAlertLevel(usage) : "safe",
    };
  };

  return {
    daily: summarize("Daily", Number(limits.daily || 0), spending.daily),
    weekly: summarize("Weekly", Number(limits.weekly || 0), spending.weekly),
    monthly: summarize("Monthly", Number(limits.monthly || 0), spending.monthly),
  };
};

router.get("/", authMiddleware, async (req, res) => {
  try {
    const budget = await BudgetLimit.findOne({ userId: req.userId });
    res.json({
      budget: budget || { daily: 0, weekly: 0, monthly: 0 },
    });
  } catch (error) {
    console.error("Error fetching budget limits:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { daily = 0, weekly = 0, monthly = 0 } = req.body;

    const budget = await BudgetLimit.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          daily: Number(daily || 0),
          weekly: Number(weekly || 0),
          monthly: Number(monthly || 0),
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    res.status(200).json({
      message: "Budget limits saved successfully",
      budget,
    });
  } catch (error) {
    console.error("Error saving budget limits:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const budget = await BudgetLimit.findOne({ userId: req.userId });
    const limits = budget || { daily: 0, weekly: 0, monthly: 0 };
    const now = new Date();

    const transactions = await Transaction.find({ userId: req.userId });

    const spending = transactions.reduce(
      (acc, transaction) => {
        const amount = Math.abs(Number(transaction.amount || 0));
        const transactionDate = new Date(transaction.date);

        if (transactionDate >= getStartOfDay(now)) {
          acc.daily += amount;
        }
        if (transactionDate >= getStartOfWeek(now)) {
          acc.weekly += amount;
        }
        if (transactionDate >= getStartOfMonth(now)) {
          acc.monthly += amount;
        }

        return acc;
      },
      { daily: 0, weekly: 0, monthly: 0 }
    );

    const summary = buildBudgetSummary(limits, spending);

    res.json({
      budget: limits,
      summary,
    });
  } catch (error) {
    console.error("Error building budget summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
