const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Login = require("../../default-models/logins");

exports.auth = async (req, res) => {
  const { login_email, login_password } = req.body;
  let response;

  Login.findOne({
    where: {
      login_email: login_email,
    },
  })
    .then(async (login) => {
      if (login) {
        const is_match = await bcrypt.compare(
          login_password,
          login.login_password
        );

        if (is_match) {
          const jwt_key = process.env.EDUSYSLINK_JWT_KEY;
          if (!jwt_key) {
            throw Error("You must provide a JWT secret key.");
          } else {
            const access_token = jwt.sign({ user: login_email }, jwt_key, {
              expiresIn: 10000,
            });

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
          }
        } else {
          response = res.status(400).json({ error: "Invalid credentials" });
        }
      } else {
        response = res.status(400).json({ error: "User not found" });
      }
    })
    .catch((err) => {
      console.error("\n ERROR: ", err, "\n");
      response = res.status(500).json({ error: "Login query error" });
    });

  return response;
};

exports.createAuth = async (req, res) => {
  let existent_login = await Login.findOne({
    where: {
      login_email: req.body.login_email,
    },
  });

  const salt_rounds = 10;
  const hashed_password = await bcrypt.hash(
    req.body.login_password,
    salt_rounds
  );

  if (!existent_login) {
    let login = {
      login_email: req.body.login_email,
      login_password: hashed_password,
      login_name: req.body.login_name,
      login_type: req.body.login_type,
      login_photo_url: req.body.login_photo_url,
    };

    let saved_login = await Login.create(login);

    return res.status(201).json({
      login_id: saved_login.login_id,
      login_email: saved_login.login_email,
      login_name: saved_login.login_name,
      login_type: saved_login.login_type,
    });
  } else {
    return res
      .status(400)
      .json({ error: "There is already a user with this email." });
  }
};
