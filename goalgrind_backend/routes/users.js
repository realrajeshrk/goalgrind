var express = require('express');
var router = express.Router();
const protect = require('../middleware/authMiddleware')
/* GET users listing. */
router.get('/me', protect, (req, res) => {
  res.json(
    {
      message: "authenticated route",
      user: req.user,
      body: req.body
    }
  );
});

module.exports = router;
