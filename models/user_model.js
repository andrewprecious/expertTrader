const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },

    lname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    country: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    agree: {
      type: Boolean,
      required: true,
    },

    gender: {
      type: String,
      default: "What is your gender",
    },

    phone: {
      type: String,
      default: "Enter Phone No",
    },

    city: {
      type: String,
      default: "Enter City",
    },

    dob: {
      type: String,
    },

    address: {
      type: String,
      default: "Enter Address",
    },

    zipCode: {
      type: String,
      default: "Enter zipcode",
    },

    profilePhoto: {
      type: String,
      default: "upload photo",
    },

    verificationType: {
      type: String,
      default: "Select ID Type",
    },

    idNumber: {
      type: String,
      default: "Enter ID Number",
    },

    idImage: {
      type: String,
    },

    deposits: {
      type: [String],
    },

    withdrawls: {
      type: [String],
    },

    investmentBal: {
      type: String,
      default: "0",
    },

    transactionHistory: {
      type: [String],
    },

    notifications: {
      type: [String],
    },

    profits: {
      type: [String],
      default: [],
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    kycApprovalStatus: {
      type: String,
      default: "Not Submitted",
    },

    accBal: {
      type: String,
      default: "0",
    },

    profitBal: {
      type: String,
      default: "0",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
