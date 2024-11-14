const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const workDayController = require("../controllers/workDaysController");
const authMiddleware = require("../utils/authMiddleware");
const { sendPasswordResetEmail, resetPassword ,getUserByToken} = require("../utils/sendEmail");


router.post("/register", userController.register);
router.post("/login", userController.loginUser);
router.get("/getAllUsers",authMiddleware.checkAuthMiddleware, userController.getAllUsers);
router.delete("/deleteUser/:userId",authMiddleware.checkAuthMiddleware, userController.deleteUser);
router.post("/workday", authMiddleware.checkAuthMiddleware, workDayController.addWorkDay);
router.get("/earnings", authMiddleware.checkAuthMiddleware, workDayController.getMonthlyEarnings);
router.get("/allWorkDays", authMiddleware.checkAuthMiddleware, workDayController.getAllWorkDays);
router.get("/allWorkDays/:id", authMiddleware.checkAuthMiddleware, workDayController.getWorkdayById);
router.put("/workday/:workdayId", authMiddleware.checkAuthMiddleware, workDayController.editWorkDay);
router.delete("/workday/:workdayId", authMiddleware.checkAuthMiddleware, workDayController.deleteWorkday);
router.post("/send-reset-password-email", sendPasswordResetEmail);
router.post("/reset-password", resetPassword);
router.get("/user/:token", getUserByToken);
router.get("/reset-password", (req, res) => {
    res.status(200).json({ message: "Please provide the token to reset your password." });
  });



module.exports = router;
