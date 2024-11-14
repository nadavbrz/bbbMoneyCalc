const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const secretKey = process.env.SECRET_KEY;
const BACKEND_URL = process.env.BACKEND_URL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  console.log("Received email:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "המשתמש לא נמצא" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    const resetLink = `http://localhost:5173/resetPassword?token=${token}`;

    const mailOptions = {
      from: process.env.MAIL,
      to: user.mail,
      subject: "שחזור סיסמה",
      html: `<p>שלום ${user.mail},</p>
             <p>כדי לשחזר את הסיסמה שלך, לחץ על הקישור הבא:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>הקישור תקף למשך שעה אחת בלבד.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "הודעת שחזור סיסמה נשלחה למייל שלך" });
  } catch (error) {
    console.error("שגיאה בשליחת המייל:", error);
    res
      .status(500)
      .json({ message: "שגיאה בשליחת המייל", error: error.message });
  }
};
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, secretKey);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "המשתמש לא נמצא" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "הסיסמה שוחזרה בהצלחה" });
  } catch (err) {
    console.error("שגיאה באיפוס הסיסמה:", err);
    res
      .status(400)
      .json({ message: "שגיאה באיפוס הסיסמה", error: err.message });
  }
};
const getUserByToken = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "המשתמש לא נמצא" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("שגיאה באימות הטוקן:", error);
    res
      .status(400)
      .json({ message: "שגיאה באימות הטוקן", error: error.message });
  }
};
module.exports = { sendPasswordResetEmail, resetPassword,getUserByToken };
