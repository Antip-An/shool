exports.seed = async function(knex) {
  await knex('tasks').del()
  await knex('lessons').del()
  await knex('courses').del()
  // await knex('users').del()

  // await knex('users').insert([
  //   {
  //     id: 1,
  //     login: "admin",
  //     email: "a@mail.ru",
  //     email_is_confirmed: true,
  //     password:"admin",
  //     role:"admin"
  //   }
  // ]);

  await knex('courses').insert([
    {
      id: 1,
      title: "Зельеварение",
      description: "зелье"
    }
  ]);

  await knex('lessons').insert([
    {
      id: 1,
      title: "Зелье для излечения фурункулов",
      study: "text",
      id_course: "1"
    }
  ]);

  await knex('tasks').insert([
    {
      id: 1,
      question: "Входят ли в состав залья змеиные зубы. Ответьте Да или Нет.",
      right_answer: 'Да',
      id_lesson: 1
    }
  ]);

};

