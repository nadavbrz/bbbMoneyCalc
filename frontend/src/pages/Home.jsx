import React from "react";
import { Link } from "react-router-dom";
import classes from "../style/Home.module.css";
const token = localStorage.getItem("token");

const HomePage = () => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>ברוך הבא לאתר ניהול המשמרות שלך!</h1>
        <p className={classes.description}>
          מתבלבלים כמה הרווחתם היום? כמה מזומן עשיתם? כמה בכלל כל החודש? פשוט
          הוסיפו את המשמרת שלכם ותראו את ההכנסות
        </p>
        {token && (
          <div className={classes.actions}>
            <Link to="/addWorkDay" className={classes.linkButton}>
              הוספת משמרת
            </Link>
          </div>
        )}
        {!token && (
          <div className={classes.actions}>
            <Link to="/register" className={classes.linkButton}>
              יצירת חשבון
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
