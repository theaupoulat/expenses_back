const mongoose = require("mongoose");

const Expense = mongoose.model("Expense", {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const User = mongoose.model("User", {
  user: {
    type: String,
    required: true
  },
  totalExpenses: {
    type: Number,
    required: true
  }
});

module.exports = {
  expense: Expense,
  user: User
};
