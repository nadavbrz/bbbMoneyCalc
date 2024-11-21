import React, { useState } from "react";
import api from "../utils/api";
import classes from "../style/WorkdayForm.module.css";
import { MdOutlineDateRange } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { IoSunny, IoMoon } from "react-icons/io5";
// import { FaRegMoneyBillAlt } from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";


const WorkdayForm = () => {
  const token = localStorage.getItem("token");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:30");
  const [endTime, setEndTime] = useState("18:00");
  const [shiftTiming, setShiftTiming] = useState("morning");
  const [shiftType, setShiftType] = useState("full-time");
  const [isFridayEvening, setIsFridayEvening] = useState(false);
  const [isSaturday, setIsSaturday] = useState(false);
  const [customHourlyRate, setCustomHourlyRate] = useState(0);
  const [tips, setTips] = useState(0);
  const [hourlyTips, setHourlyTips] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading

  const calculateHoursWorked = () => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    if (end < start) end.setDate(end.getDate() + 1);
    const diffInMs = end - start;
    const hours = diffInMs / (1000 * 60 * 60);
    return hours >= 0 ? hours : 0;
  };

  const calculateTotalEarnings = () => {
    const calculatedHours = calculateHoursWorked();
    const total = parseFloat(tips) + parseFloat(hourlyTips) * calculatedHours;
    setHoursWorked(calculatedHours);
    setTotalEarnings(total.toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading before the request

    const selectedDate = new Date(date);
    const formattedDate = `${String(selectedDate.getDate()).padStart(
      2,
      "0"
    )}-${String(selectedDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${selectedDate.getFullYear()}`;
    const calculatedHours = calculateHoursWorked();

    const workdayData = {
      date: formattedDate,
      startHour: startTime,
      endHour: endTime,
      hoursWorked: calculatedHours,
      shiftTiming,
      shiftType,
      isFridayEvening,
      isSaturday,
      customHourlyRate,
      tips,
      hourlyTips,
      totalEarnings,
    };

    try {
      const result = await api.addWorkday(workdayData);
      setMessage("משמרת נשמרה בהצלחה");
      setTimeout(() => setMessage(""), 5000); // Hide the message after 5 seconds
      // Clear form after submission
      setDate("");
      setStartTime("10:30");
      setEndTime("18:00");
      setShiftTiming("morning");
      setShiftType("full-time");
      setIsFridayEvening(false);
      setIsSaturday(false);
      setCustomHourlyRate(0);
      setTips(0);
      setHourlyTips(0);
      setHoursWorked(0);
      setTotalEarnings(0);
    } catch (error) {
      console.error("Error adding workday:", error);
      setMessage("הייתה בעיה בשמירה. נסה שנית.");
    } finally {
      setLoading(false); // Stop loading after request is finished
    }
  };

  return (
    <>
      {!token && (
        <h1 className={classes.loginText}>תתחבר/י כדי להוסיף משמרת</h1>
      )}
   <form className={classes.form} onSubmit={handleSubmit}>
  {token && <h2 className={classes.title}>הוספת משמרת</h2>}
  <div className={classes.formGroup}>
    <label htmlFor="date" className={classes.label}>
      <MdOutlineDateRange className={`${classes.icon} ${classes.dateIcon}`} /> תאריך:
    </label>
    <input
      type="date"
      id="date"
      className={classes.input}
      value={date}
      onChange={(e) => setDate(e.target.value)}
      required
    />
  </div>
  <div className={classes.formGroup}>
    <label htmlFor="startTime" className={classes.label}>
      <IoMdTime className={`${classes.icon} ${classes.timeIcon}`} /> זמן התחלה:
    </label>
    <input
      type="time"
      id="startTime"
      className={classes.input}
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)}
      step="900"
      required
    />
  </div>
  <div className={classes.formGroup}>
    <label htmlFor="endTime" className={classes.label}>
      <IoMdTime className={`${classes.icon} ${classes.timeIcon}`} /> זמן סיום:
    </label>
    <input
      type="time"
      id="endTime"
      className={classes.input}
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)}
      step="900"
      required
    />
  </div>
  <div className={classes.formGroup}>
    <label htmlFor="shiftTiming" className={classes.label}>
      <IoSunny className={`${classes.icon} ${classes.shiftIcon}`} /> /{" "}
      <IoMoon className={`${classes.icon} ${classes.shiftIcon}`} /> בחר זמן משמרת:
    </label>
    <select
      id="shiftTiming"
      className={classes.select}
      value={shiftTiming}
      onChange={(e) => setShiftTiming(e.target.value)}
    >
      <option value="morning">בוקר</option>
      <option value="evening">ערב</option>
    </select>
  </div>
  <div className={classes.formGroup}>
    <label htmlFor="shiftType" className={classes.label}>
      בחר סוג משמרת:
    </label>
    <select
      id="shiftType"
      className={classes.select}
      value={shiftType}
      onChange={(e) => setShiftType(e.target.value)}
    >
      <option value="part-time">חלקית</option>
      <option value="full-time">מלאה</option>
    </select>
  </div>
  <div className={classes.checkboxGroup}>
    <label className={classes.checkboxLabel}>
      שישי ערב:
      <input
        type="checkbox"
        name="shift"
        checked={isFridayEvening}
        onChange={() => {
          if (isFridayEvening) {
            setIsFridayEvening(false);
          } else {
            setIsFridayEvening(true);
            setIsSaturday(false);
          }
        }}
      />
    </label>
    <label className={classes.checkboxLabel}>
      שבת בוקר:
      <input
        type="checkbox"
        name="shift"
        checked={isSaturday}
        onChange={() => {
          if (isSaturday) {
            setIsSaturday(false);
          } else {
            setIsSaturday(true);
            setIsFridayEvening(false);
          }
        }}
      />
    </label>
  </div>
  <div className={classes.formGroup}>
    <label htmlFor="tips" className={classes.label}>
      <FcMoneyTransfer className={`${classes.icon} ${classes.tipsIcon}`} /> טיפים:
    </label>
    <input
      type="number"
      id="tips"
      className={classes.input}
      value={tips}
      onChange={(e) => setTips(Number(e.target.value))}
      onBlur={calculateTotalEarnings}
      min={0}
    />
  </div>
  <div className={classes.formGroup}>
    <label htmlFor="hourlyTips" className={classes.label}>
      <FcMoneyTransfer className={`${classes.icon} ${classes.tipsIcon}`} /> טיפים לשעה:
    </label>
    <input
      type="number"
      id="hourlyTips"
      className={classes.input}
      value={hourlyTips}
      onChange={(e) => setHourlyTips(Number(e.target.value))}
      onBlur={calculateTotalEarnings}
      min={0}
    />
  </div>
  <div className={classes.submitBox}>
    {token && !loading && (
      <button type="submit" className={classes.submitButton}>
        שמור משמרת
      </button>
    )}
    {loading && <p className={classes.loadingText}>שומר... </p>}
    <p className={classes.submitMessage}>{message}</p>
  </div>
</form>

    </>
  );
};

export default WorkdayForm;
