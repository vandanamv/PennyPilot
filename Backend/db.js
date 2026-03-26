const mongoose = require("mongoose");
require("dotenv").config();

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  throw new Error("MONGO_URL is not set. Add it to Backend/.env before starting the server.");
}

mongoose.set("bufferCommands", false);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("Connection error", err);
    throw err;
  }
};

// Define Schemas
const UserSchema = new mongoose.Schema({
  mailId: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,

    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
  },
  income: {
    type: Number,
    required: true,
  },
  fixedExpense: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  expectedSaving: {
    type: Number,
    required: true,
  },
});

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

const GoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    lowercase: true,
  },

  targetAmount: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
});

const PrioritySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Friends: {
    exp: {
      type: Number,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
    allowed: {
      type: Number,
      required: true,
    },
  },
  Food: {
    exp: {
      type: Number,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
    allowed: {
      type: Number,
      required: true,
    },
  },
  Entertainment: {
    exp: {
      type: Number,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
    allowed: {
      type: Number,
      required: true,
    },
  },
  Grocery: {
    exp: {
      type: Number,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
    allowed: {
      type: Number,
      required: true,
    },
  },
  Others: {
    exp: {
      type: Number,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
    allowed: {
      type: Number,
      required: true,
    },
  },
});

const BudgetLimitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  daily: {
    type: Number,
    default: 0,
  },
  weekly: {
    type: Number,
    default: 0,
  },
  monthly: {
    type: Number,
    default: 0,
  },
});

// Create Models
const User = mongoose.model("User", UserSchema);
const Transaction = mongoose.model("Transaction", TransactionSchema);
const Goal = mongoose.model("Goal", GoalSchema);
const Priority = mongoose.model("Priority", PrioritySchema);
const BudgetLimit = mongoose.model("BudgetLimit", BudgetLimitSchema);

// Export Models
module.exports = {
  connectToDatabase,
  User,
  Transaction,
  Goal,
  Priority,
  BudgetLimit,
};
