const jwt = require("jsonwebtoken");
const Login = require("../../default-models/logins");

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

exports.createAuth = async (req, res) => {
  let existentLogin = await Login.findOne({
    where: {
      login_email: req.body.login_email,
    },
  });

  if (!existentLogin) {
    let login = {
      login_email: req.body.login_email,
      login_password: req.body.login_password,
      login_name: req.body.login_name,
      login_photo_url: req.body.login_photo_url,
    };

    let saved_login = await Login.create(login);

    return res.status(201).json({
      login_id: saved_login.login_id,
      login_email: saved_login.login_email,
      login_name: saved_login.login_name,
    });
  } else {
    return res
      .status(400)
      .json({ error: "There is already a user with this email." });
  }
};
