const express = require("express");
const userRouter = require("./users");
const courseRouter = require("./courses");
const lessonRouter = require("./lessons");
const taskRouter = require("./tasks");

const router = express.Router();

router.use(express.json());

router.use("/users", userRouter);
router.use("/courses", courseRouter);
router.use("/lessons", lessonRouter);
router.use("/tasks", taskRouter);

router.use((req, res) => {
  res.send({ success: false, code: "NOT_IMPLEMENTED" });
});
router.use((err, req, res, next) => {
  if (err.name === "CONTROLLER_EXCEPTION") {
    res.send({ success: false, code: err.exceptionCode, message: err.message });
  } else {
    console.error(err);
    res.send({ success: false, code: "INTERNAL_ERROR" });
  }
});

module.exports = router;