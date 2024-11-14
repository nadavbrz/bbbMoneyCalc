import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import classes from "../style/RegisterForm.module.css";

const LoginForm = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/allWorkDays");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.loginUser({ mail, password });
      localStorage.setItem("token", response.token);
      navigate("/allWorkDays");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className={classes.formContainer}>
      <h2>התחברות</h2>
      {error && <p className={classes.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={classes.form}>
        <input
          type="text"
          placeholder="כתובת מייל"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          className={classes.input}
          required
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={classes.input}
          required
        />
        <div className={classes.rememberMe}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label htmlFor="rememberMe">תזכור אותי</label>
        </div>
        <button type="submit" className={classes.button}>
          כניסה
        </button>
      </form>
      <button
        onClick={() => navigate("/register")}
        className={classes.switchButton}
      >
        אין לך חשבון? לחץ כדי להירשם
      </button>
      <button
        onClick={() => navigate("/reset-password")}
        className={classes.resetButton}
      >
        שכחת את הסיסמה?
      </button>
    </div>
  );
};

export default LoginForm;
