import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkdayById, deleteWorkday } from "../utils/api";
import classes from "../style/WorkdayDetail.module.css";
import { CiEdit } from "react-icons/ci";
import { IoMdArrowRoundBack, IoMdTime } from "react-icons/io";
import { FcMoneyTransfer } from "react-icons/fc";
import { FaMoneyCheck, FaHourglassEnd } from "react-icons/fa";
import { BsCash } from "react-icons/bs";
import { FaShekelSign } from "react-icons/fa6";
import { MdCancel, MdDelete } from "react-icons/md";

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
          <button
            className={classes.backButton}
            onClick={() => navigate("/allWorkDays")}
          >
            <IoMdArrowRoundBack />
          </button>
          <p className={classes.workdayInfo}>
            <IoMdTime className={`${classes.icon} ${classes.time}`} /> שעת
            התחלה: {workday.startHour}
          </p>
          <p className={classes.workdayInfo}>
            <IoMdTime className={`${classes.icon} ${classes.time}`} /> שעת סיום:{" "}
            {workday.endHour}
          </p>
          <p className={classes.workdayInfo}>
            <FaHourglassEnd className={`${classes.icon} ${classes.time}`} />{" "}
            שעות עבודה: {workday.hoursWorked}
          </p>
          <p className={classes.workdayInfo}>
            <FaMoneyCheck className={`${classes.icon} ${classes.money}`} /> כסף
            שהולך לצ'ק: {workday.checkEarnings}
          </p>
          <p className={classes.workdayInfo}>
            <BsCash className={`${classes.icon} ${classes.cash}`} /> השלמה:{" "}
            {workday.cashEarnings}
          </p>
          <p className={classes.workdayInfo}>
            <FcMoneyTransfer className={`${classes.icon} ${classes.tips}`} />{" "}
            טיפים: {workday.tips}
          </p>
          <p className={classes.workdayInfo}>
            <FcMoneyTransfer className={`${classes.icon} ${classes.tips}`} />{" "}
            טיפים לשעה: {workday.hourlyTips || 0}
          </p>
          <p className={classes.workdayInfo}>
            שכר שעתי: {(workday.totalEarnings / workday.hoursWorked).toFixed(1)}
          </p>
          <p className={classes.totals}>
            סך הכל: {workday.totalEarnings}
            <FaShekelSign className={classes.shekelIcon} />
          </p>

          <div className={classes.actionButtons}>
            <button className={classes.editBtn} onClick={handleEditToggle}>
              ערוך משמרת
              <CiEdit />
            </button>
            <button className={classes.deleteBtn} onClick={handleDelete}>
              מחק משמרת
              <MdDelete />
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`${classes.form} ${classes.formEditable}`}
        >
          <div className={classes.inputGroup}>
            <label htmlFor="startHour">
              <IoMdTime className={classes.icon} /> שעת התחלה:
            </label>
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
            <label htmlFor="endHour">
              <IoMdTime className={classes.icon} /> שעת סיום:
            </label>
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
            <label htmlFor="tips">
              <FcMoneyTransfer className={classes.icon} /> טיפים:
            </label>
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
            <label htmlFor="hourlyTips">
              <FcMoneyTransfer className={classes.icon} /> טיפים לשעה:
            </label>
            <input
              type="number"
              id="hourlyTips"
              name="hourlyTips"
              value={formData.hourlyTips}
              onChange={handleChange}
              min={0}
            />
          </div>
          <div className={classes.twoBtn}>
          <button className={classes.submitEdit} type="submit">
            שמור<CiEdit/>
          </button>
          <button
            className={classes.cancelEdit}
            onClick={handleEditToggle}
            type="button"
          >
            בטל עריכה<MdCancel />
          </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default WorkdayDetails;
