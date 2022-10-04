const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

//create lesson (admin)
exports.createLesson = async ({ title, lesson, photo, id_course }) => {
  const [record] = await knex("lessons").select("id").where({ title: title });
  if (record) {
    throw new ControllerException("TITLE_IN_USE", "Title is already in use");
  }

  const [{ id: lessonId }] = await knex("lessons")
    .insert([
      {
        title,
        lesson,
        photo,
        id_course
      },
    ])
    .returning("id");
  return { lessonId };
};

//edit lesson (admin)
exports.updateLesson = async ({ lessonId, title, lesson, photo, id_course }) => {
  const [record] = await knex("lessons")
    .select("id", "title", "lesson", "photo", "id_course")
    .where({ id: lessonId })

  if (!record) {
    throw new ControllerException(
      "COURSE_NOT_FOUND",
      "Course has not been found"
    );
  }

  const patch = {};
  if (title !== undefined) patch.title = title;
  if (lesson !== undefined) patch.lesson = lesson;
  if (photo !== undefined) patch.photo = photo;
  if (id_course !== undefined) patch.id_course = id_course;
  
  await knex("lessons").update(patch).where({ id: lessonId });
  return {};
};

//delete lesson (admin)
exports.deleteLesson = async ({ lessonId }) => {
  const [record] = await knex("lessons").select("id").where({ id: lessonId });

  if (!record) {
    throw new ControllerException(
      "LESSON_NOT_FOUND",
      "Lesson has not been found"
    );
  }
  await knex("lessons").where({ id: lessonId }).del();

  return {};
};

// get by id (admin)
exports.getLessonById = async ({ lessonId }) => {
  const [record] = await knex("lessons")
    .select("id", "title", "lesson", "photo", "id_course")
    .where({ id: lessonId });

    if (!record) {
      throw new ControllerException("LESSON_NOT_FOUND", "Lesson has not been found")
  }

  return record;
};

exports.getLessonsList = async (limit) => {
  const record = await knex("lessons").select("*").limit(limit);
  if (!record) {
    throw new ControllerException(
      "LIST_LESSONS_ERROR",
      "Lessons has not been found"
    );
  }
  console.log(record)
  return record;
};