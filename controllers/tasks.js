const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");

//create task (admin)
exports.createTask = async ({ question, right_answer, photo, id_lesson }) => {
  const [record] = await knex("tasks").select("id").where({ question: question });
  if (record) {
    throw new ControllerException("QUESTION_IN_USE", "Question is already in use");
  }

  const [{ id: taskId }] = await knex("tasks")
    .insert([
      {
        question,
        right_answer,
        photo,
        id_lesson
      },
    ])
    .returning("id");
  return { taskId };
};

//edit task (admin)
exports.updateTask = async ({ taskId, question, right_answer, photo, id_lesson }) => {
  const [record] = await knex("tasks")
    .select("id", "question", "right_answer", "photo", "id_lesson")
    .where({ id: taskId })

  if (!record) {
    throw new ControllerException(
      "TASK_NOT_FOUND",
      "Task has not been found"
    );
  }

  const patch = {};
  if (question !== undefined) patch.question = question;
  if (right_answer !== undefined) patch.right_answer = right_answer;
  if (photo !== undefined) patch.photo = photo;
  if (id_lesson !== undefined) patch.id_lesson = id_lesson;
  
  await knex("tasks").update(patch).where({ id: taskId });
  return {};
};

//delete task (admin)
exports.deleteTask = async ({ taskId }) => {
  const [record] = await knex("tasks").select("id").where({ id: taskId });

  if (!record) {
    throw new ControllerException(
      "TASK_NOT_FOUND",
      "Task has not been found"
    );
  }
  await knex("tasks").where({ id: taskId }).del();

  return {};
};

// get by id (admin)
exports.getTaskById = async ({ taskId }) => {
  const [record] = await knex("tasks")
    .select("id", "question", "right_answer", "photo", "id_lesson")
    .where({ id: taskId });

    if (!record) {
      throw new ControllerException("TASK_NOT_FOUND", "Task has not been found")
  }

  return record;
};

exports.getTasksList = async (limit) => {
  const record = await knex("tasks").select("*").limit(limit);
  if (!record) {
    throw new ControllerException(
      "LIST_TASKS_ERROR",
      "Tasks has not been found"
    );
  }
  console.log(record)
  return record;
};