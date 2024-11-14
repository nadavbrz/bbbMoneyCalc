import React from "react";
import WorkdayList from "../components/WorkdayList";
import classes from '../style/Workdays.module.css';


const Workdays = () => {
  const token = localStorage.getItem("token")
  return (
    <div className={classes.workDayPage}>
      {token ? <h1 className={classes.header}>כל המשמרות</h1> : <h1 className={classes.header}>תתחבר/י כדי לצפות במשמרות שלך</h1>}
      <WorkdayList />
    </div>
  );
};

export default Workdays;
