import React from "react";
import { Link } from "react-router-dom";
import classes from "../style/WorkdayItem.module.css";

const WorkdayItem = ({ workday }) => {
  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getDayOfWeek = (date) => {
    const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    return days[date.getDay()];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = getDayOfWeek(date);
    const formattedDate = date.toLocaleDateString();
    return `יום ${dayOfWeek}, ${formattedDate}`;
  };

  return (
    <Link to={`/allWorkDays/${workday._id}`} className={classes.detailsBtn}>
      <div className={classes.workdayItem}>
        <div className={classes.header}>
          <p className={classes.date}>{formatDate(workday.date)}</p>
        </div>
        <div className={classes.details}>
          <p className={classes.time}>
            התחלה: <span>{workday.startHour}</span>
          </p>
          <p className={classes.time}>
            סוף: <span>{workday.endHour}</span>
          </p>
          <p className={classes.hours}>
            שעות עבודה: <span>{workday.hoursWorked}</span>
          </p>
          <p className={classes.earnings}>
            סה"כ: <span>{workday.totalEarnings.toFixed(2)}</span>
          </p>
        </div>
        <div className={classes.actions}></div>
      </div>
    </Link>
  );
};

export default WorkdayItem;
