const lessonController = require("../controllers/lessons");
const { wrap } = require("async-middleware");
const auth = require("./middelwares/auth");
const express = require("express");
const router = express.Router();

router.post(
  "/create",
  //auth("admin"),
  wrap(async (req, res) => {
    const { title, lesson, photo, id_course } = req.body;
    const { lessonId } = await lessonController.createLesson({
      title,
      lesson,
      photo,
      id_course
    });

    res.send({ success: true, lessonId, message: "Урок был успешно создан" });
  })
);

router.post(
  "/update/:id",
  // auth("admin"),
  wrap(async (req, res) => {
    const { title, lesson, photo, id_course } = req.body;
    await lessonController.updateLesson({
      lessonId: req.params.id,
      title,
      lesson,
      photo,
      id_course
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
    const lessons = await lessonController.getLessonsList({
      limit: +limit || 10,
    });

    res.send({
      success: true,
      lessons,
      limit,
    });
  })
);

router.delete(
  "/:id",
  //auth("admin"),
  wrap(async (req, res) => {
    await lessonController.deleteLesson({ lessonId: req.params.id });

    res.send({ success: true });
  })
);

router.get(
  "/:id",
  // auth("admin"),
  wrap(async (req, res) => {
    const id = req.params.id;
    const {
      id: lessonId,
      title,
      lesson,
      photo,
      id_course
    } = await lessonController.getLessonById({ lessonId: id });

    res.send({
      success: true,
      order: { lessonId, title, lesson, photo, id_course },
    });
  })
);

module.exports = router;
