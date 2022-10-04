const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

//create course (admin)
exports.createCourse = async ({ title, photo, description }) => {
  const [record] = await knex("courses").select("id").where({ title: title });
  if (record) {
    throw new ControllerException("TITLE_IN_USE", "Title is already in use");
  }

  const [{ id: courseId }] = await knex("courses")
    .insert([
      {
        title,
        photo,
        description,
      },
    ])
    .returning("id");
  return { courseId };
};

//edit course (admin)
exports.updateCourse = async ({ courseId, title, photo, description }) => {
  const [record] = await knex("courses")
    .select("id", "title", "photo", "description")
    .where({ id: courseId })

  if (!record) {
    throw new ControllerException(
      "COURSE_NOT_FOUND",
      "Course has not been found"
    );
  }

  const patch = {};
  if (title !== undefined) patch.title = title;
  if (photo !== undefined) patch.photo = photo;
  if (description !== undefined) patch.description = description;
  
  await knex("courses").update(patch).where({ id: courseId });
  return {};
};

//delete course (admin)
exports.deleteCourse = async ({ courseId }) => {
  const [record] = await knex("courses").select("id").where({ id: courseId });

  if (!record) {
    throw new ControllerException(
      "COURSE_NOT_FOUND",
      "Course has not been found"
    );
  }
  await knex("courses").where({ id: courseId }).del();

  return {};
};

// get by id (admin)
exports.getCourseById = async ({ courseId }) => {
  const [record] = await knex("courses")
    .select("id", "title", "photo", "description")
    .where({ id: courseId });

    if (!record) {
      throw new ControllerException("COURSE_NOT_FOUND", "Course has not been found")
  }

  return record;
};

exports.getCourseList = async (limit) => {
  const record = await knex("courses").select("*").limit(limit);
  if (!record) {
    throw new ControllerException(
      "LIST_COURSES_ERROR",
      "Courses has not been found"
    );
  }
  console.log(record)
  return record;
};