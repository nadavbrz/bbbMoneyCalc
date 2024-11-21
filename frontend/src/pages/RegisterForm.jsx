import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import classes from "../style/RegisterForm.module.css";

const RegisterForm = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mail.length < 3) {
      setError("מייל לא תקין.");
      return;
    }

    if (mail.includes(" ")) {
      setError("מייל לא יכול להכיל רווחים.");
      return;
    }

    if (password.includes(" ")) {
      setError("הסיסמה לא יכולה להכיל רווחים.");
      return;
    }
    if (password.length < 3) {
      setError("הסיסמה חייבת להכיל לפחות 3 תווים");
      return;
    }

    try {
      const response = await api.registerUser({ mail, password });
  
      if (response.token) {
        localStorage.setItem("token", response.token);  
        setSuccess(response.message);
        navigate("/addWorkDay");
        window.location.reload();
      } else {
        setError("Token not received. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unexpected error occurred.");
    }
  
  };

  return (
    <div className={classes.formContainer}>
      <h2>הרשמה</h2>
      {error && <p className={classes.error}>{error}</p>}
      {success && <p className={classes.success}>{success}</p>}
      <form onSubmit={handleSubmit} className={classes.form}>
        <label htmlFor="mail">כתובת מייל</label>
        <input
          type="text"
          id="mail"
          placeholder="כתובת מייל"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          className={classes.input}
          required
        />
        <label htmlFor="password">סיסמה</label>
        <input
          type="password"
          id="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={classes.input}
          required
        />
        <button type="submit" className={classes.button}>
          להירשם
        </button>
      </form>
      <button
        onClick={() => navigate("/login")}
        className={classes.switchButton}
      >
        יש לך כבר חשבון? לחץ כדי להתחבר
      </button>
    </div>
  );
};

export default RegisterForm;
