import React, { useEffect, useState } from "react";
import api from "../utils/api";
import WorkdayItem from "./WorkdayItem";
import classes from "../style/WorkdayList.module.css";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";

const WorkdayList = () => {
  const token = localStorage.getItem("token");
  const [workdays, setWorkdays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchWorkdays = async () => {
      const data = await api.getWorkdays();
      setWorkdays(data);
    };
    fetchWorkdays();
  }, []);

  const filterWorkdaysByMonth = (workdays, month, year) => {
    return workdays.filter((workday) => {
      const workdayDate = new Date(workday.date);
      return (
        workdayDate.getMonth() + 1 === month &&
        workdayDate.getFullYear() === year
      );
    });
  };

  const calculateMonthlyTotals = (filteredWorkdays) => {
    let totalCheckEarnings = 0;
    let totalCashEarnings = 0;
    let totalTips = 0;
    let totalHours = 0;

    filteredWorkdays.forEach((day) => {
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

    return {
      totalCheckEarnings,
      totalCashEarnings: totalCashEarnings + totalTips,
      totalHours,
      totalEarnings: totalCheckEarnings + totalCashEarnings + totalTips,
      averagePerHour:
        totalHours > 0
          ? (
              (totalCheckEarnings + totalCashEarnings + totalTips) / 
              totalHours
            ).toFixed(1)
          : 0,
    };
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const filteredWorkdays = filterWorkdaysByMonth(
    workdays,
    currentMonth,
    currentYear
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const totals = calculateMonthlyTotals(filteredWorkdays);

  return (
    <div className={classes.workdayListContainer}>
      <p className={classes.addBtn}>
        <Link to="/addWorkDay">
          <IoMdAdd size={30} />
        </Link>
      </p>

      <div className={classes.monthAndNavigation}>
        <h2 className={classes.month}>
          {`המשמרות של ${new Date(currentYear, currentMonth - 1).toLocaleString(
            "default",
            { month: "long" }
          )} ${currentYear}`}
        </h2>

        <div className={classes.navigation}>
          <button onClick={handlePreviousMonth} className={classes.prevButton}>
            <IoMdArrowForward size={20} />
            חודש קודם
          </button>
          <button onClick={handleNextMonth} className={classes.nextButton}>
            חודש הבא
            <IoMdArrowBack size={20} />
          </button>
        </div>
      </div>

      <div className={classes.totals}>
        <h3>סיכום חודש</h3>
        <p>
          סה"כ שעות: <b>{totals.totalHours}</b>
        </p>
        <p>
          סה"כ בצ'ק: <b>{totals.totalCheckEarnings}</b>
        </p>
        <p>
          סה"כ במזומן (כולל טיפים):<b> {totals.totalCashEarnings}</b>
        </p>
        <p>
          סה"כ רווחים: <b>{totals.totalEarnings}</b>
        </p>
        <p>
          ממוצע לשעה: <b>{totals.averagePerHour}</b>
        </p>
      </div>

      <div className={classes.workdayList}>
        {filteredWorkdays.length > 0 ? (
          filteredWorkdays.map((workday) => (
            <WorkdayItem key={workday._id} workday={workday} />
          ))
        ) : (
          <p className={classes.noWorkdays}>אין משמרות בחודש זה</p>
        )}
      </div>
    </div>
  );
};

export default WorkdayList;
