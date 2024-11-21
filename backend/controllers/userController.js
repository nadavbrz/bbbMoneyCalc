const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = process.env.SECRET_KEY;
const mail = process.env.MAIL;

const register = async (req, res) => {
  const { mail, password } = req.body;
  try {
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ message: "המשתמש כבר קיים" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = mail === process.env.ADMIN_EMAIL ? "admin" : "user";  

    const user = new User({ mail, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, mail: user.mail, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      message: "המשתמש נוצר",
      mail: user.mail,
      role: user.role,
      token: token,
    });
  } catch (err) {
    res.status(400).json({ message: "שגיאה ביצירת המשתמש", error: err.message });
  }
};



const loginUser = async (req, res) => {
  const { mail, password } = req.body;
  try {
    const user = await User.findOne({ mail });
    if (!user) return res.status(404).json({ message: "אחד הפרטים לא נכונים" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "אחד הפרטים לא נכונים" });
    const token = jwt.sign(
      { userId: user._id, mail: user.mail, role: user.role },

      secretKey,
      { expiresIn: "30d" }
    );
    res.json({ mail: user.mail, token: token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "לא ניתן להיכנס", error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "לא סופק טוקן" });

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.status(403).json({ message: "טוקן לא תקין" });

      if (decoded.role !== "admin") {
        return res.status(403).json({ message: "לא מורשה" });
      }

      User.find()
        .select("mail workDays ")
        .then((users) => {
          const usersWithWorkDaysLength = users.map((user) => ({
            id: user._id,
            mail: user.mail,
            workDaysLength: user.workDays.length,
          }));
          res.json(usersWithWorkDaysLength);
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: "לא ניתן לקבל את המשתמשים", error: error.message });
        });
    });
  } catch (error) {
    res.status(500).json({ message: "שגיאה בשרת", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "לא סופק טוקן, גישה נדחתה" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res
        .status(401)
        .json({ message: "המשתמש לא נמצא או שהטוקן לא תקין" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "אסור למחוק משתמשים" });
    }

    const userToDelete = await User.findByIdAndDelete(req.params.userId);

    if (!userToDelete) {
      return res.status(404).json({ message: "לא נמצא משתמש למחיקה" });
    }

    res.json({ message: "המשתמש נמחק" });
  } catch (error) {
    console.error("שגיאה במחיקת משתמש:", error.message);
    res.status(500).json({ message: "שגיאה בשרת", error: error.message });
  }
};

module.exports = {
  register,
  loginUser,
  getAllUsers,
  deleteUser,
};
