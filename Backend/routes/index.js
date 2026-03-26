const express = require("express");
const UserRoute = require("./UserRoute");
const TransactionRoute = require("./TransactionRoute");
// const StudentRoute = require("./UserRoute");
const PriorityRoute = require("./PriorityRoute");
const GoalRoute = require("./GoalRoute");
const BudgetRoute = require("./BudgetRoute");
const cookieParser = require("cookie-parser");
const Router = express.Router();
Router.use(cookieParser());
Router.use("/user", UserRoute);
Router.use("/transaction", TransactionRoute);
Router.use("/priority", PriorityRoute);
Router.use("/budget", BudgetRoute);
// Router.use("/student", StudentRoute);
Router.use("/goal", GoalRoute);

module.exports = Router;
