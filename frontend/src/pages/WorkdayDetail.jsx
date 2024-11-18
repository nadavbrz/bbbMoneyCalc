import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkdayById, deleteWorkday } from "../utils/api";
import classes from "../style/WorkdayDetail.module.css";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";

const WorkdayDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [workday, setWorkday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    startHour: "",
    endHour: "",
    hoursWorked: "",
    checkEarnings: "",
    cashEarnings: "",
    tips: "",
    hourlyTips: "",
    totalEarnings: "",
    shiftType: "full-time",
    shiftTiming: "morning",
    isFridayEvening: false,
    isSaturday: false,
    customHourlyRate: 0,
  });

  useEffect(() => {
    const fetchWorkday = async () => {
      try {
        const data = await getWorkdayById(id);
        setWorkday(data);
        setFormData({
          startHour: data.startHour,
          endHour: data.endHour,
          hoursWorked: data.hoursWorked,
          checkEarnings: data.checkEarnings || 0,
          cashEarnings: data.cashEarnings || 0,
          tips: data.tips || 0,
          hourlyTips: data.hourlyTips || "",
          totalEarnings: data.totalEarnings,
          shiftType: data.shiftType || "full-time",
          shiftTiming: data.shiftTiming || "morning",
          isFridayEvening: data.isFridayEvening || false,
          isSaturday: data.isSaturday || false,
          customHourlyRate: data.customHourlyRate || 0,
        });
        setLoading(false);
      } catch (err) {
        setError("Error fetching workday details.");
        setLoading(false);
      }
    };

    fetchWorkday();
  }, [id]);

  const handleEditToggle = () => setEditing((prev) => !prev);

  const calculateTotal = (data) => {
    const { checkEarnings, cashEarnings, tips, hourlyTips, hoursWorked } = data;
    const checkTotal =
      (parseFloat(checkEarnings) || 0) * (parseFloat(hoursWorked) || 0);
    const cashTotal =
      (parseFloat(cashEarnings) || 0) * (parseFloat(hoursWorked) || 0);
    const tipsTotal = parseFloat(tips) || 0;
    const hourlyTipsTotal =
      (parseFloat(hourlyTips) || 0) * (parseFloat(hoursWorked) || 0);
    const total = checkTotal + cashTotal + tipsTotal + hourlyTipsTotal;
    return total.toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => {
      const updatedFormData = {
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "startHour" || name === "endHour") {
        const start = new Date(`1970-01-01T${updatedFormData.startHour}:00`);
        const end = new Date(`1970-01-01T${updatedFormData.endHour}:00`);
        if (end <= start) end.setDate(end.getDate() + 1);
        const hoursWorked = (end - start) / 3600000;
        updatedFormData.hoursWorked =
          hoursWorked > 0 ? hoursWorked.toFixed(2) : "0";
      }

      updatedFormData.totalEarnings = calculateTotal(updatedFormData);
      return updatedFormData;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedData = {
      ...formData,
      totalEarnings: calculateTotal(formData),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://bbb-server.brzcode.site/users/workDay/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      navigate("/allWorkDays");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWorkday(id);
      navigate("/allWorkDays");
    } catch (error) {
      console.error("Error deleting workday:", error);
    }
  };

  if (loading) return <p className={classes.loading}>...טוען</p>;
  if (error) return <p className={classes.error}>{error}</p>;

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>
        המשמרת של {new Date(workday.date).toLocaleDateString()}
      </h1>
      {!editing ? (
        <div className={`${classes.details} ${classes.detailsNonEditable}`}>
          <p>שעת התחלה: {workday.startHour}</p>
          <p>שעת סיום: {workday.endHour}</p>
          <p>שעות עבודה: {workday.hoursWorked}</p>
          <p>כסף שהולך לצ'ק: {workday.checkEarnings}</p>
          <p>השלמה: {workday.cashEarnings}</p>
          <p>טיפים: {workday.tips}</p>
          <p>טיפים לשעה: {workday.hourlyTips || 0}</p>
          <p>
            שכר שעתי: {(workday.totalEarnings / workday.hoursWorked).toFixed(1)}
          </p>
          <p>סך הכל: {workday.totalEarnings}</p>
          <div className={classes.actionButtons}>
            <button className={classes.btn} onClick={handleEditToggle}>
              ערוך <CiEdit />
            </button>
            <button className={classes.btn} onClick={handleDelete}>
              מחק משמרת <MdDelete />
            </button>
            <button
              className={classes.btn}
              onClick={() => navigate("/allWorkDays")}
            >
              חזור <IoMdArrowRoundBack />
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`${classes.form} ${classes.formEditable}`}
        >
          <div className={classes.inputGroup}>
            <label htmlFor="startHour">שעת התחלה:</label>
            <input
              type="time"
              id="startHour"
              name="startHour"
              value={formData.startHour}
              onChange={handleChange}
              required
            />
          </div>
          <div className={classes.inputGroup}>
            <label htmlFor="endHour">שעת סיום:</label>
            <input
              type="time"
              id="endHour"
              name="endHour"
              value={formData.endHour}
              onChange={handleChange}
              required
            />
          </div>
          <div className={classes.inputGroup}>
            <label htmlFor="checkEarnings">כסף שהולך לצ'ק:</label>
            <input
              type="number"
              id="checkEarnings"
              name="checkEarnings"
              value={formData.checkEarnings}
              onChange={handleChange}
              required
            />
          </div>
          <div className={classes.inputGroup}>
            <label htmlFor="tips">טיפים:</label>
            <input
              type="number"
              id="tips"
              name="tips"
              value={formData.tips}
              onChange={handleChange}
              min={0}
            />
          </div>
          <div className={classes.inputGroup}>
            <label htmlFor="hourlyTips">טיפים לשעה:</label>
            <input
              type="number"
              id="hourlyTips"
              name="hourlyTips"
              value={formData.hourlyTips}
              onChange={handleChange}
              min={0}
            />
          </div>
          <button type="submit">שמור</button>
          <button onClick={handleEditToggle} type="button">
            בטל עריכה
          </button>
        </form>
      )}
    </div>
  );
};

export default WorkdayDetails;
