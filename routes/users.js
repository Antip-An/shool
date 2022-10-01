const express = require("express");
const { wrap } = require("async-middleware");
const { body } = require("express-validator");
const usersController = require("../controllers/users");
const { sign: signToken } = require("../utils/token");
const auth = require("./middelwares/auth");
const validate = require("./middelwares/validate");
const checkUser = require("./middelwares/checkUser");

const router = express.Router();


router.post(
  "/singup",
  wrap(async (req, res) => {
    const { login, email, password } = req.body;
    const { userId } = await usersController.singup({
      login,
      email,
      password,
    });

    const token = signToken(userId);

    res.send({ success: true, token });
  })
);

router.post(
  "/singin",
  body("email").isString(),
  body("password").isString(),
  validate(),
  wrap(async (req, res) => {
    const { email, password } = req.body;
    const response = await usersController.singin({ email, password });
    
    if (!response) return res.send({ success: false, message: 'Wrong Credetials' })
    const { userId, userRole } = response
    const token = signToken(userId);

    res.send({ success: true, token, role: userRole });
  })
);

router.get(
  "/:id",
  // auth("admin"),
  body("userId").isNumeric(),
  wrap(async (req, res) => {
    const user = await usersController.getUserById({
      userId: req.params.id,
    });

    res.send({ success: true, user });
  })
);

router.get(
  "/list/:lim",
  // auth("admin"),
  wrap(async (req, res) => {
    const { limit } = req.params;
    const users = await usersController.getUsersList({
      limit: +limit || 10
    });

    res.send({
      success: true,
      users,
      limit,
    });
  })
);

router.post(
  "/role",
  // auth("admin"),
  body("userId").isNumeric(),
  body("role").custom(
    (value) => ["user", "admin"].indexOf(value) >= 0
  ),
  validate(),
  wrap(async (req, res) => {
    const { userId, role } = req.body;
    await usersController.changeRole({ userId, role });

    res.send({ success: true, role });
  })
);

router.post(
  "/profile/edit",
  //auth("user"),
  checkUser(),
  wrap(async (req, res) => {
    const { userId } = req.user
    const { login, email, password } = req.body;
    await usersController.editProfile({ userId, login, email, password });

    res.send({ success: true });
  })
);

// router.post(
//   "/profile/edit",
//   // auth("user"),
//   wrap(async (req, res) => {
//     const { login, email, password } = req.body;
//     await usersController.editProfile({
//       userId: req.user.id,
//       login: req.body.login,
//       email: req.body.email,
//       password:req.body.password,
//     });

//     res.send({ success: true });
//   })
// );

router.delete(
  "/:id",
  //auth("user"),
  wrap(async (req, res) => {
    await usersController.deleteUser({ userId: req.params.id });

    res.send({ success: true });
  })
);

// -----------------------------------------

router.get(
  "/email/confirm/request/:id",
  // auth("user"),
  wrap(async (req, res) => {
    await usersController.requestEmailConfirmation({ userId: req.user.userId });
    res.send({ success: true });
  })
);

router.post(
  "/email/confirm",
  body("confirmationCode")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("Confirmation code must consist of exactly 6 symbols."),
  validate(),
  auth("USER"),
  wrap(async (req, res) => {
    const { confirmationCode } = req.body;
    await usersController.confirmEmail({
      userId: req.user.userId,
      confirmationCode: confirmationCode,
    });
    res.send({ success: true });
  })
);

router.get(
  "/email/confirm",
  wrap(async (req, res) => {
    const { user, code } = req.query;
    await usersController.requestEmailConfirmation({
      userId: user,
      confirmationCode: code,
    });
    res.send({ success: true });
  })
);

module.exports = router;
