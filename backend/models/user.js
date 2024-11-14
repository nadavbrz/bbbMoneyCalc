const mongoose = require("mongoose");

const workDaySchema = new mongoose.Schema({
  date: Date,
  startHour: String,
  endHour: String,
  hoursWorked: Number,
  shiftTiming: String,
  shiftType: String,
  isFridayEvening: Boolean,
  isSaturday: Boolean,
  customHourlyRate: Number,
  tips: Number,
  hourlyTips: Number,
  checkEarnings: Number,
  cashEarnings: Number,
  totalEarnings: Number,
});

const userSchema = new mongoose.Schema({
  mail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "user"],
  },
  workDays: [workDaySchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
