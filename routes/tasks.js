const taskController = require("../controllers/tasks");
const { wrap } = require("async-middleware");
const auth = require("./middelwares/auth");
const express = require("express");
const router = express.Router();

router.post(
  "/create",
  //auth("admin"),
  wrap(async (req, res) => {
    const { question, right_answer, photo, id_lesson } = req.body;
    const { taskId } = await taskController.createTask({
      question,
      right_answer,
      photo,
      id_lesson,
    });

    res.send({ success: true, taskId, message: "Вопрос был успешно создан" });
  })
);

router.post(
  "/update/:id",
  // auth("admin"),
  wrap(async (req, res) => {
    const { question, right_answer, photo, id_lesson } = req.body;
    await taskController.updateTask({
      taskId: req.params.id,
      question,
      right_answer,
      photo,
      id_lesson,
    });

    res.send({
      success: true,
      message: "Данные были изменены",
    });
  })
);

router.get(
  "/list/:lim",
  // auth("user"),
  wrap(async (req, res) => {
    const { limit } = req.params;
    const tasks = await taskController.getTasksList({
      limit: +limit || 10,
    });

    res.send({
      success: true,
      tasks,
      limit,
    });
  })
);

router.delete(
  "/:id",
  //auth("admin"),
  wrap(async (req, res) => {
    await taskController.deleteTask({ taskId: req.params.id });

    res.send({ success: true });
  })
);

router.get(
  "/:id",
  // auth("admin"),
  wrap(async (req, res) => {
    const id = req.params.id;
    const {
      id: taskId,
      question,
      right_answer,
      photo,
      id_lesson,
    } = await taskController.getTaskById({ taskId: id });

    res.send({
      success: true,
      order: { taskId, question, right_answer, photo, id_lesson },
    });
  })
);

module.exports = router;
