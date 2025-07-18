const Reminder = require('../models/reminder');

// GET reminders

exports.getAllReminders = async (req,res) => {
    const reminders = await Reminder.find({user: req.user._id});
    if(!reminders) {
        return res.status(404).json({
            message: "Remainders not found"
        })
    }
    res.json({
        messages: "Remainders fetched",
        reminders
    })
}

exports.createReminder = async (req,res) => {
   const {title, remindAt} = req.body;
try {
   if(!title || !remindAt)
     return res.status(404).json({
        message : "Not enough info"
    })

    const reminderNew= await Reminder.create ({
        user:req.user._id,
        title,
        remindAt
    })

    res.status(201).json({reminderNew})
}
    catch (error) {
    console.error('❌ Error in createReminder:', error.message);
    return res.status(500).json({ message: error.message }); // ✅ this is correct  }
}
}

exports.updateReminder = async (req, res) => {
 const reminder = await Reminder.findOne({user: req.user._id, _id: req.params.id})

 if(!reminder)
    return res.status(500).json({ message: "No such reminder"})

 Object.assign(reminder ,req.body);
  await reminder.save();

  res.json(reminder)
}

exports.deleteReminder = async (req, res) => {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id , user: req.user._id});
    
    if(!reminder)
    return res.status(500).json({ message: "No such reminder"})

    res.json({message: "goal deleted"})
    
}

