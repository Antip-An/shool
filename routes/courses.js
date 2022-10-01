const courseController = require("../controllers/courses");
const { wrap } = require("async-middleware");
const auth = require("./middelwares/auth");
const express = require("express")
const router = express.Router()


router.post(
    "/create",
    //auth("admin"),
    wrap(async (req, res) => {
      const { title, photo, description } = req.body;
      const { courseId } = await courseController.createCourse({
        title,
        photo,
        description,
      });
  
      res.send({ success: true, courseId, message: 'Курс был успешно создан' });
    })
  );

router.post(
    "/update/:id",
    // auth("admin"),
    wrap(async (req, res) => {
      const { title, photo, description } = req.body;
      await courseController.updateCourse({
        courseId: req.params.id,
        title, photo, description 
      });
  
      res.send({
        success: true,
        message: "Данные были изменены"
      });
    })
  );

  router.get("/:id",
  // auth("admin"),
  wrap(async (req, res) => {
    const id = req.params.id;
    const { id: courseId, title, photo, description } = await courseController.getCourseById({ courseId: id });

    res.send({
      success: true,
      order: { courseId, title, photo, description }
    });
  })
)

router.get(
  "/list/:lim",
  // auth("user"),
  wrap(async (req, res) => {
    const { limit } = req.params;
    const courses = await courseController.getCourseList({
      limit: +limit || 10,
    });

    res.send({
      success: true,
      courses,
      limit,
    });
  })
);

router.delete(
    "/:id",
    //auth("admin"),
    wrap(async (req, res) => {
      await courseController.deleteCourse({ courseId: req.params.id });
  
      res.send({ success: true });
    })
  );


module.exports = router;