import React from "react";
import { Link } from "react-router-dom";
import classes from "../style/NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={classes.notFoundPage}>
      <div className={classes.content}>
        <h1 className={classes.heading}>הדף לא נמצא</h1>
        <p className={classes.message}>
          מצטערים, הדף שביקשת לא נמצא. אנא חזור לדף הראשי או נסה לחפש משהו אחר.
        </p>
        <Link to="/" className={classes.homeLink}>
          חזור לדף הבית
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
