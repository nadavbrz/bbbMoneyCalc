import React, { useState } from "react";
import api from "../utils/api";
import classes from "../style/RegisterForm.module.css";

const ResetPasswordRequestForm = () => {
  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await api.requestPasswordReset(mail);
      setMessage(response.message);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reset email");
    }
  };

  return (
    <div className={classes.formContainer}>
      <h2>איפוס סיסמה</h2>
      {message && <p className={classes.success}>{message}</p>}
      {error && <p className={classes.error}>{error}</p>}
      <form onSubmit={handleRequestReset} className={classes.form}>
        <input
          type="email"
          placeholder="הזן את כתובת המייל שלך"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          className={classes.input}
          required
        />
        <button type="submit" className={classes.button}>
          שלח קישור לאיפוס הסיסמה
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordRequestForm;
