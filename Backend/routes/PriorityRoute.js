const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware");
const { z } = require("zod");
const { User, Priority, Goal } = require("../db");
const { default: mongoose } = require("mongoose");

const priorityBody = z.object({
  Friends: z.object({
    exp: z.number(),
    priority: z.number(),
    allowed: z.number(),
  }),
  Food: z.object({
    exp: z.number(),
    priority: z.number(),
    allowed: z.number(),
  }),
  Entertainment: z.object({
    exp: z.number(),
    priority: z.number(),
    allowed: z.number(),
  }),
  Grocery: z.object({
    exp: z.number(),
    priority: z.number(),
    allowed: z.number(),
  }),
  Others: z.object({
    exp: z.number(),
    priority: z.number(),
    allowed: z.number(),
  }),
});

//create assignment
router.post("/create", authMiddleware, async (req, res) => {
  const { success } = assignmentBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Invalid input types",
    });
  }
  const ExistingAssignment = await Assignment.findOne({
    assignmentCode: req.body.assignmentCode,
  });

  if (ExistingAssignment) {
    return res.status(411).json({
      message: "Assignment Code is already taken",
    });
  }
  const assignment = await Assignment.create({
    teacherId: req.userId,
    assignmentCode: req.body.assignmentCode,
    title: req.body.title,
    questions: req.body.questions,
    plag: req.body.plag,
    deadline: req.body.deadline,
  });

  res.status(200).json({ assignment });
});
//view assignment
router.get("/getpriority", authMiddleware, async (req, res) => {
  try {
    const priority = await Priority.find({
      userId: req.userId,
    });

    res.json({
      priority: priority,
    });
  } catch (error) {
    console.error("Error fetching Priority", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/postpriority", authMiddleware, async (req, res) => {
  try {
    const { success } = priorityBody.safeParse(req.body);

    if (!success) {
      return res.status(411).json({ message: "Invalid priority values" });
    }

    const userId = req.userId;
    const { Friends, Food, Entertainment, Grocery, Others } = req.body;
    await Priority.findOneAndUpdate(
      { userId },
      {
        $set: {
          Friends,
          Food,
          Entertainment,
          Grocery,
          Others,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({ message: "Priority data saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const calculateDailyLimitHandler = async (req, res) => {
  try {
    const priority = await Priority.findOne({ userId: req.userId });
    if (!priority) {
      return res.status(404).json({ message: "Priority not found" });
    }

    const { Friends, Food, Entertainment, Grocery, Others } = priority;
    const list = { Friends, Food, Entertainment, Grocery, Others };

    const user = await User.findOne({ _id: req.userId });
    const expectedSaving = user.expectedSaving;

    const salary = user.income;
    const moneyRemaining = user.balance; // Replace with actual value

    // const RdaysRemaining = () => {
    //   const today = new Date();
    //   const lastDayOfMonth = new Date(
    //     today.getFullYear(),
    //     today.getMonth() + 1,
    //     0
    //   );
    //   return lastDayOfMonth.getDate() - today.getDate();
    // }; // Replace with actual value
    const daysRemaining = 15;
    console.log(list);
    const result = evaluate(
      list,
      salary,
      expectedSaving,
      moneyRemaining,
      daysRemaining
    );

    // const updatedFields = {};
    // for (let category in result.list) {
    //   if (list[category].allowed !== result.list[category].allowed) {
    //     updatedFields[`${category}.allowed`] = result.list[category].allowed;
    //   }
    // }

    const upi = await Priority.updateOne(
      { userId: req.userId },
      {
        $set: {
          Friends: result.list.Friends,
          Food: result.list.Food,
          Entertainment: result.list.Entertainment,
          Grocery: result.list.Grocery,
          Others: result.list.Others,
        },
      }
    );
    // console.log(result.list);

    res.status(200).json({ result: result, upi });
    // res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

router.get("/calculateDailylimit", authMiddleware, calculateDailyLimitHandler);
router.get("/calculateDailyLimit", authMiddleware, calculateDailyLimitHandler);

function evaluate(list, sal, goal, money_remaining, days_remaining) {
  let exp_total = 0;
  let max_allowed = sal - goal;
  let worst_case = 0;

  for (let i in list) {
    exp_total += list[i].exp;
    worst_case += (list[i].priority / 100) * list[i].exp;
  }

  console.log(max_allowed);
  let possible = true;

  if (
    worst_case > max_allowed ||
    money_remaining < (worst_case / 30) * days_remaining + goal
  ) {
    console.log("Not possible");
    possible = false;
    probability = 0;
  } else {
    console.log("Possible");
    possible = true;
    let per_day_ideal = max_allowed / 30;
    let per_day_current = (money_remaining - goal) / days_remaining;
    probability = per_day_ideal / per_day_current;
    if (probability > 1) {
      probability = 1 / probability;
    }
    console.log(probability);
  }

  if (possible) {
    if (money_remaining - exp_total >= goal) {
    } else {
      sorted = [];
      for (let i in list) {
        sorted.push([i, list[i].exp, list[i].priority, list[i].allowed]);
      }
      console.log(sorted);
      sorted.sort((a, b) => {
        return a[2] - b[2];
      });
      console.log(sorted);

      let extra_to_be_saved = goal - (money_remaining - exp_total);

      console.log(extra_to_be_saved);

      for (let i in sorted) {
        list[sorted[i][0]].allowed = list[sorted[i][0]].exp;
        if (extra_to_be_saved == 0) {
          break;
        } else if (
          ((100 - list[sorted[i][0]].priority) / 100) * list[sorted[i][0]].exp <
          extra_to_be_saved
        ) {
          // console.log(sorted[i]);
          // console..log(((100-list[sorted[i][0]].priority)/100)*list[sorted[i][0]].exp)
          list[sorted[i][0]].allowed -=
            ((100 - list[sorted[i][0]].priority) / 100) *
            list[sorted[i][0]].exp;
          extra_to_be_saved -=
            ((100 - list[sorted[i][0]].priority) / 100) *
            list[sorted[i][0]].exp;
        } else if (
          ((100 - list[sorted[i][0]].priority) / 100) *
            list[sorted[i][0]].exp >=
          extra_to_be_saved
        ) {
          list[sorted[i][0]].allowed -= extra_to_be_saved;
          extra_to_be_saved = 0;
        }
      }
    }
    daily = {};
    for (let i in list) {
      daily[i] = list[i].allowed / days_remaining;
    }
    console.log(daily);
    return { daily, probability, list };
  }
  // console.log(list);
  return { daily: 0, probability, list };
}

router.get("/wellness", authMiddleware, async (req, res) => {
  try {
    const priorityData = await Priority.findOne({ userId: req.userId });

    if (!priorityData) {
      return res.status(404).json({ message: "Priority data not found" });
    }

    const { Friends, Food, Entertainment, Grocery, Others } = priorityData;
    const recommendedList = { Friends, Food, Entertainment, Grocery, Others };

    let totalPriority = 0;
    let wellnessNumerator = 0;

    // Calculate total priority and wellness numerator
    for (let category in recommendedList) {
      if (recommendedList[category].exp !== 0) {
        totalPriority += recommendedList[category].priority;
        wellnessNumerator +=
          (recommendedList[category].priority *
            recommendedList[category].allowed) /
          recommendedList[category].exp;
      }
    }

    // Calculate wellness score
    let wellnessScore = 0;
    if (totalPriority > 0) {
      wellnessScore = (wellnessNumerator / totalPriority) * 100;
    }

    // Round wellness score to two decimal places
    wellnessScore = Math.round(wellnessScore * 100) / 100;

    res.json({ wellnessScore });
  } catch (error) {
    console.error("Error fetching wellness data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
