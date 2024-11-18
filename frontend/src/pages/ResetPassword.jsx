import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "../style/ResetPassword.module.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [logBtn, setLogBtn] = useState(false);

  const validatePassword = (password) => {
    if (password.includes(" ")) {
      setError("הסיסמה לא יכולה להכיל רווחים.");
      return false;
    }
    if (password.length < 3) {
      setError("הסיסמה חייבת להכיל לפחות 3 תווים");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      return;
    }

    try {
      const response = await fetch(
        "https://bbb-server.brzcode.site/users/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (data) {
        setMessage("הסיסמה עודכנה בהצלחה");
        setLogBtn(true);
        setError("");
      } else {
        setError(data.error || "משהו השתבש, נסה שוב");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("הייתה בעיה בחיבור לשרת");
    }
  };

  return (
    <div className={classes.resetPasswordContainer}>
      <h1 className={classes.resetPasswordTitle}>איפוס סיסמה</h1>
      <form className={classes.resetPasswordForm} onSubmit={handleSubmit}>
        {error && <p className={classes.errorMessage}>{error}</p>}
        {message && <p className={classes.successMessage}>{message}</p>}
        <input
          className={classes.passwordInput}
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className={classes.resetPasswordButton} type="submit">
          איפוס סיסמה
        </button>
        {logBtn && (
          <button
            className={classes.loginButton}
            onClick={() => navigate("/login")}
          >
            התחבר
          </button>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
