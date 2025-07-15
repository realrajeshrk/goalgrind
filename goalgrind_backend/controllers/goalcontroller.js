const Goal = require('../models/goal');

// GET goals

exports.getGoals = async (req,res) => {
        console.log("getgoals endpoint hit")

    const goals = await Goal.find( {user:req.user._id})
    res.json({
        message: "goals fetched",
        goals: goals
    });
}//post /api/goals

exports.createGoal = async (req,res) => {
    console.log("create endpoint hit")
    console.log(req.body)
    try {
    const { title, description, targetDate } = req.body;

    //validation are hnadlded in frontend
    const goal = await Goal.create({ 
        user: req.user._id,
        title,
        description,
        targetDate
    });

    res.status(201).json(goal)
  } catch (error) {
    console.error('❌ Error in createGoal:', error.message);
    return res.status(500).json({ message: error.message }); // ✅ this is correct  }
}
}
// PUT /api/goals/:id
exports.updateGoal = async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });

  if (!goal) return res.status(404).json({ message: 'Goal not found' });

  Object.assign(goal, req.body);
  await goal.save();

  res.json(goal);
};

//Delete goal /api/goals/:id

exports.deleteGoal = async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!goal) return res.status(404).json({ message: 'Goal not found' });

  res.json({ message: 'Goal deleted' });
};