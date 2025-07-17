const express = require('express');
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {getAllReminders, createReminder, updateReminder, deleteReminder} = require("../controllers/remindercontroller");
router.route("/")
.get(protect,getAllReminders)
.post(protect, createReminder)

router.route("/:id")
.put(protect, updateReminder)
.delete(protect, deleteReminder)

module.exports = router;