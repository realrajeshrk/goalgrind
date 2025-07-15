const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token;
   console.log("From protect middleware")
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      //console.log(req.headers)
      console.log(token)
      // verify token
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(verifiedToken.id);
      console.log(req)
      next();
    } catch (error) {
        console.log(error)
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "no token provided" });
  }
};

module.exports = protect;