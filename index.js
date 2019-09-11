const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const models = require("./models");

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(
	process.env.MONGODB_URI || "mongodb://localhost:27017/expenses-report",
	{
		useNewUrlParser: true
	}
);

const Expense = models.expense;
const User = models.user;

// ----------routes

// get all expenses

app.get("/expense", async (req, res) => {
	const response = await Expense.find({}).populate("user");
	res.status(200).json(response);
});

// post expenses and create user when it does not exist

app.post("/expense", async (req, res) => {
	const fetchIdOfUser = await User.findOne({ user: req.body.user });
	console.log(fetchIdOfUser);
	let idOfUser;
	let response;
	if (fetchIdOfUser === null) {
		const newUser = new User({
			user: req.body.user.toLowerCase(),
			totalExpenses: req.body.amount
		});
		response = await newUser.save();
		idOfUser = response._id;
	} else {
		idOfUser = fetchIdOfUser._id;
		fetchIdOfUser.totalExpenses += Number(req.body.amount);
		fetchIdOfUser.save();
	}

	const newExpense = new Expense({
		user: idOfUser,
		description: req.body.description,
		amount: req.body.amount
	});
	await newExpense.save();
	res.json({ status: 200, message: "Expense has been registered" });
});

// get all users

app.get("/users", async (req, res) => {
	const response = await User.find({});
	res.status(200).json(response);
});

app.all("*", (req, res) => {
	res.send("all routes");
});

app.listen(process.env.PORT || 3001, () => {
	console.log("Server Started");
});
