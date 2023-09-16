const jwt = require("jsonwebtoken");
const Login = require("./models/logins");

exports.auth = async (req, res) => {
  const { login_email, login_password } = req.body;
  let response;

  Login.findOne({
    where: {
      login_email: login_email,
    },
  })
    .then((login) => {
      if (login) {
        if (login_password === login.login_password) {
          const access_token = jwt.sign(
            { user: login_email },
            process.env.JWT_KEY,
            {
              expiresIn: 10000,
            }
          );

          let count = login.login_count;
          if (count === null) {
            count = 1;
          } else {
            count = Number(count) + 1;
          }

          Login.update(
            {
              login_count: count,
            },
            {
              where: { login_id: login.login_id },
            }
          );

          response = res.status(200).json({
            login_id: login.login_id,
            login_name: login.login_name,
            login_email: login_email,
            access_token: access_token,
          });
        } else {
          response = res.status(400).json({ error: "Invalid credentials" });
        }
      } else {
        response = res.status(400).json({ error: "User not found" });
      }
    })
    .catch((err) => {
      console.log("\n ERROR: ", err, "\n");
      response = res.status(500).json({ error: "Login query error" });
    });

  return response;
};
