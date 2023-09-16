const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (!err) {
        req.usuario = decoded.user;
        return next();
      } else {
        res.status(401).json({ error: "Unauthorized user" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Invalid token provided" });
  }
};
