const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    payment: {
      type: String,
      required: true,
    },

    amount: {
      type: String,
      required: true,
    },

    proofOfPayment: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Deposit = mongoose.model("deposit", depositSchema);
module.exports = Deposit;
