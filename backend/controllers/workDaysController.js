const User = require("../models/user");
const mongoose = require("mongoose");


const addWorkDay = async (req, res) => {
  const {
    date,
    hoursWorked,
    shiftTiming,
    shiftType,
    isFridayEvening,
    isSaturday,
    customHourlyRate,
    tips,
    hourlyTips, // Include hourlyTips in the request body
    startHour,
    endHour,
  } = req.body;
  const userId = req.user._id;

  try {
    const [day, month, year] = date.split("-").map(Number);
    const formattedDate = new Date(year, month - 1, day);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let checkHourlyRate = 35;
    let actualHourlyRate = 35;

    if (isSaturday) {
      actualHourlyRate = 50;
      checkHourlyRate = 40;
    } else if (isFridayEvening && shiftType === "full-time") {
      actualHourlyRate = 50;
      checkHourlyRate = 40;
    } else if (isFridayEvening && shiftType === "part-time") {
      actualHourlyRate = 45;
      checkHourlyRate = 40;
    } else if (shiftType === "full-time" && shiftTiming === "morning") {
      actualHourlyRate = 40;
      checkHourlyRate = 35;
    } else if (shiftType === "part-time" && shiftTiming === "morning") {
      actualHourlyRate = 35;
      checkHourlyRate = 35;
    } else if (shiftType === "full-time" && shiftTiming === "evening") {
      actualHourlyRate = 45;
      checkHourlyRate = 35;
    } else if (shiftType === "part-time" && shiftTiming === "evening") {
      actualHourlyRate = 40;
      checkHourlyRate = 35;
    } else if (shiftType === "other" && customHourlyRate) {
      actualHourlyRate = customHourlyRate;
      checkHourlyRate = customHourlyRate;
    }

    // Calculate earnings with hourlyTips
    const checkEarnings = checkHourlyRate * hoursWorked;
    const cashEarnings = hoursWorked * (actualHourlyRate - checkHourlyRate);
    const totalHourlyTips = hourlyTips * hoursWorked; // Add hourly tips to total earnings
    const totalEarnings = actualHourlyRate * hoursWorked + tips + totalHourlyTips; // Include hourlyTips in totalEarnings

    const newWorkDay = {
      _id: new mongoose.Types.ObjectId(),
      date: formattedDate,
      hoursWorked,
      shiftTiming,
      shiftType,
      isFridayEvening,
      isSaturday,
      customHourlyRate,
      tips,
      hourlyTips, // Save hourlyTips in the workday record
      checkEarnings,
      cashEarnings,
      totalEarnings,
      startHour,
      endHour,
    };
    user.workDays.push(newWorkDay);
    await user.save();

    res.status(200).json({
      workDayId: newWorkDay._id,
      checkEarnings,
      cashEarnings,
      totalEarnings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllWorkDays = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ workDays: user.workDays });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getWorkdayById = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const workday = user.workDays.id(id);
    if (!workday) {
      return res.status(404).json({ message: "Workday not found" });
    }

    res.status(200).json(workday);
  } catch (error) {
    console.error("Error fetching workday by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMonthlyEarnings = async (req, res) => {
  const userId = req.user._id;
  const { month, year } = req.query;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const earnings = user.workDays;
    let totalCheckEarnings = 0;
    let totalCashEarnings = 0;
    let totalTips = 0;
    let totalHours = 0;

    earnings.forEach((day) => {
      let checkHourlyRate = 35;
      let actualHourlyRate = 35;

      if (day.isSaturday) {
        actualHourlyRate = 50;
        checkHourlyRate = 40;
      } else if (day.isFridayEvening && day.shiftType === "full-time") {
        actualHourlyRate = 50;
        checkHourlyRate = 40;
      } else if (day.isFridayEvening && day.shiftType === "part-time") {
        actualHourlyRate = 45;
        checkHourlyRate = 40;
      } else if (
        day.shiftType === "full-time" &&
        day.shiftTiming === "morning"
      ) {
        actualHourlyRate = 40;
        checkHourlyRate = 35;
      } else if (
        day.shiftType === "part-time" &&
        day.shiftTiming === "morning"
      ) {
        actualHourlyRate = 35;
        checkHourlyRate = 35;
      } else if (
        day.shiftType === "full-time" &&
        day.shiftTiming === "evening"
      ) {
        actualHourlyRate = 45;
        checkHourlyRate = 35;
      } else if (
        day.shiftType === "part-time" &&
        day.shiftTiming === "evening"
      ) {
        actualHourlyRate = 40;
        checkHourlyRate = 35;
      } else if (day.shiftType === "other" && day.customHourlyRate) {
        actualHourlyRate = day.customHourlyRate;
        checkHourlyRate = day.customHourlyRate;
      }

      totalCheckEarnings += day.hoursWorked * checkHourlyRate;
      totalCashEarnings +=
        day.hoursWorked * (actualHourlyRate - checkHourlyRate);

      totalTips +=
        (day.tips || 0) + ((day.hourlyTips || 0) * day.hoursWorked || 0);
      totalHours += day.hoursWorked;
    });

    totalCashEarnings += totalTips; 
    const totalEarnings = totalCheckEarnings + totalCashEarnings;
    const averagePerHour =
      totalHours > 0 ? (totalEarnings / totalHours).toFixed(1) : 0; 

    res.status(200).json({
      "Total check": totalCheckEarnings,
      "Total cash": totalCashEarnings,
      "Total earnings": totalEarnings,
      "Total hours": totalHours,
      "Monthly hour rate": averagePerHour,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editWorkDay = async (req, res) => {
  const userId = req.user._id;
  const { workdayId } = req.params;
  const {
    date,
    hoursWorked,
    shiftTiming,
    shiftType,
    isFridayEvening,
    isSaturday,
    customHourlyRate,
    tips,
    hourlyTips,
    startHour,
    endHour,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const workday = user.workDays.id(workdayId);
    if (!workday) return res.status(404).json({ message: "Workday not found" });

    if (date) workday.date = date;
    if (shiftTiming) workday.shiftTiming = shiftTiming;
    if (shiftType) workday.shiftType = shiftType;
    if (isFridayEvening !== undefined)
      workday.isFridayEvening = isFridayEvening;
    if (isSaturday !== undefined) workday.isSaturday = isSaturday;
    if (customHourlyRate) workday.customHourlyRate = customHourlyRate;
    if (tips) workday.tips = tips;
    if (hourlyTips) workday.hourlyTips = hourlyTips;
    if (startHour) workday.startHour = startHour;
    if (endHour) workday.endHour = endHour;

    let hoursWorkedCalc = workday.hoursWorked;

    if (workday.startHour && workday.endHour) {
      const start = new Date(`1970-01-01T${workday.startHour}:00`);
      const end = new Date(`1970-01-01T${workday.endHour}:00`);

      if (end < start) {
        const endOfDay = new Date(`1970-01-01T23:59:59`);
        const hoursBeforeMidnight = (endOfDay - start + 1000) / 3600000;
        const hoursAfterMidnight =
          (end - new Date(`1970-01-01T00:00:00`)) / 3600000;
        hoursWorkedCalc = hoursBeforeMidnight + hoursAfterMidnight;
      } else {
        hoursWorkedCalc = (end - start) / 3600000;
      }

      workday.hoursWorked = hoursWorkedCalc;
    }

    let checkHourlyRate = 35;
    let actualHourlyRate = 35;

    if (workday.isSaturday) {
      actualHourlyRate = 50;
      checkHourlyRate = 40;
    } else if (workday.isFridayEvening && workday.shiftType === "full-time") {
      actualHourlyRate = 50;
      checkHourlyRate = 40;
    } else if (workday.isFridayEvening && workday.shiftType === "part-time") {
      actualHourlyRate = 45;
      checkHourlyRate = 40;
    } else if (
      workday.shiftType === "full-time" &&
      workday.shiftTiming === "morning"
    ) {
      actualHourlyRate = 40;
      checkHourlyRate = 35;
    } else if (
      workday.shiftType === "part-time" &&
      workday.shiftTiming === "morning"
    ) {
      actualHourlyRate = 35;
      checkHourlyRate = 35;
    } else if (
      workday.shiftType === "full-time" &&
      workday.shiftTiming === "evening"
    ) {
      actualHourlyRate = 45;
      checkHourlyRate = 35;
    } else if (
      workday.shiftType === "part-time" &&
      workday.shiftTiming === "evening"
    ) {
      actualHourlyRate = 40;
      checkHourlyRate = 35;
    } else if (workday.shiftType === "other" && workday.customHourlyRate) {
      actualHourlyRate = workday.customHourlyRate;
      checkHourlyRate = workday.customHourlyRate;
    }

    const checkEarnings = checkHourlyRate * hoursWorkedCalc;
    const cashEarnings = hoursWorkedCalc * (actualHourlyRate - checkHourlyRate);
    const totalEarnings =
      actualHourlyRate * hoursWorkedCalc +
      (workday.tips || 0) +
      (workday.hourlyTips || 0) * hoursWorkedCalc;

    workday.checkEarnings = checkEarnings.toFixed(2);
    workday.cashEarnings = cashEarnings.toFixed(2);
    workday.totalEarnings = totalEarnings.toFixed(2);

    await user.save();

    res.status(200).json({
      message: "Workday updated",
      workdayId: workdayId,
      hoursWorked: workday.hoursWorked,
      checkEarnings: workday.checkEarnings,
      cashEarnings: workday.cashEarnings,
      totalEarnings: workday.totalEarnings,
    });
  } catch (err) {
    console.error("Error editing workday:", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteWorkday = async (req, res) => {
  const userId = req.user._id;
  const { workdayId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const workdayIndex = user.workDays.findIndex(
      (day) => day._id.toString() === workdayId
    );
    if (workdayIndex === -1) {
      return res.status(404).json({ message: "Workday not found" });
    }

    user.workDays.splice(workdayIndex, 1);
    await user.save();

    res.status(200).json({ message: "Workday deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  addWorkDay,
  getAllWorkDays,
  getWorkdayById,
  getMonthlyEarnings,
  editWorkDay,
  deleteWorkday,
};
