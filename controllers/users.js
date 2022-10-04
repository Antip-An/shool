const ControllerException = require("../utils/ControllerException");
const knex = require("../utils/db");
const { hash, compare } = require("bcryptjs");
const mailer = require("../utils/mailer");

// register (any)
exports.singup = async ({ login, email, password }) => {
  try {
    const hashedPassword = await hash(password, 10);
    const [{ id: userId }] = await knex("users")
      .insert([{ login, email, password: hashedPassword }])
      .returning("id");

    await mailer(
      email,
      "Успешная регистрация",
      '"Вы успешно зарегистрировались на сайте "Онлайн курсы магических дисциплин"',
      "<b>Новая регистрация</b>"
    );
    return { userId };
  } catch (error) {
    throw new ControllerException("SINGUP_ERROR", "Registration error");
  }
};

// login (any)
exports.singin = async ({ email, password }) => {
  const [user] = await knex("users")
    .select("id", "password as hashedPassword", "role")
    .where({ email });
  if (!user) {
    throw new ControllerException("SINGIN_ERROR", "Sing in error");
  }
  const isCompared = await compare(password, user.hashedPassword);
  if (!isCompared) return false;

  return { userId: user.id, userRole: user.role };
};

// user by id (admin)
exports.getUserById = async ({ userId }) => {
  const [{ id, login, email, role }] = await knex("users").where({
    id: userId,
  });

  if (!login) {
    throw new ControllerException("USER_NOT_FOUND", "User has not been found");
  }

  return { id, login, email, role };
};

// list users (admin)
exports.getUsersList = async (limit) => {
  const record = await knex("users").select("*").limit(limit);
  if (!record) {
    throw new ControllerException(
      "LIST_USERS_ERROR",
      "Users has not been found"
    );
  }

  return record;
};

// change role (admin)
exports.changeRole = async ({ userId, role }) => {
  const [record] = await knex("users").select("id").where({ id: userId });

  if (!record) {
    throw new ControllerException("USER_NOT_FOUND", "User has not been found");
  }

  await knex("users").update({ role }).where({ id: userId });

  return {};
};

// edit profile (user)
exports.editProfile = async ({ userId, login, email, password }) => {
  const hashedPassword = await hash(password, 10);
  const [record] = await knex("users")
    . where({ id: userId })
    .select("id", "login", "email", "password");

  if (!record) {
    throw new ControllerException("USER_NOT_FOUND", "User has not been found");
  }

  const patch = {};
  if (login) patch.login = login;
  if (email) {
    patch.email = email;
    patch.email_is_confirmed = false;

    patch.email_confirmation_code = "000000";
  }

  if (password) patch.password = hashedPassword;

  await knex("users").update(patch).where({ id: userId });

  return {};
};


//delete profile (user) 
exports.deleteUser = async ({ userId }) => {
  const [record] = await knex("users")
      .select("id")
      .where({ id: userId })

  if (!record) {
      throw new ControllerException("USER_NOT_FOUND", "User has not been found")
  } 
  await knex("users").where({ id: userId }).del()
  return {}
}

// restore password (user)
// exports.restorePassword = async ({
//     userId,
//     password,
//     passRestored = false,
//   }) => {
//     if (passRestored) {
//       await knex("users")
//         .update({ password: await hashPass(password) })
//         .where({ id: userId });
//       return {};
//     } else {
//       throw new ControllerException("ACCESS_DENIED", "Access denied");
//     }
//   };

// -------------------------------------------------

// request email confirmation (user)
exports.requestEmailConfirmation = async ({ userId }) => {
  const confirmationCode = generateCode();
  const [record] = await knex("users")
    .select("email_is_confirmed as emailIsConfirmed")
    .where({ id: userId });
  console.log(user);
  if (!record) {
    throw new ControllerException("USER_NOT_FOUND", "User has not been found");
  }

  if (record.emailIsConfirmed) {
    throw new ControllerException(
      "EMAIL_ALREADY_CONFIRMED",
      "User has already confirmed their email"
    );
  }

  // await knex("users")
  //   .update({ email_confirmation_code: confirmationCode })
  //   .where({ id: userId });

  //   return {};

  // TODO: Send email

  // const [{ email: email }] = await knex("users")
  //   .where({ id: userId })
  //   .update({
  //     email_confirmation_code: confirmationCode,
  //     updated_at: knex.fn.now(),
  //   })
  //   .returning("email");
  // const transport = transporter.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   secure: process.env.EMAIL_SECURE,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });
  // const message = {
  //   from: process.env.EMAIL_USER,
  //   to: email,
  //   subject: "Онлайн курсы магических дисциплин",
  //   html: `<p><i>A <b>confirmation code</b> for you there:</i></p>
  //          <p style="font-size:24px"><b>${confirmationCode}</b></p>
  //          <p>If you did not create an account on <a href="${process.env.SITE_URL}">${process.env.SITE_URL}</a>,
  //          <br/>please ignore this message</p>`,
  // };
  // transport.sendMail(message, (err, info) => {
  //   if (err) {
  //     throw new ControllerException("MAIL_NOT_SENT", "Mail has not been sent");
  //   }
  // });

  return {};
};

// confirm emall (user)
exports.confirmEmail = async ({ userId, confirmationCode }) => {
  const [record] = await knex("users")
    .select(
      "email_is_confirmed as emailIsConfirmed",
      "email_confirmation_code as emailConfirmationCode"
    )
    .where({ id: userId });

  if (
    !record ||
    record.emailConfirmationCode === null ||
    record.emailIsConfirmed ||
    record.emailConfirmationCode !== confirmationCode
  ) {
    throw new ControllerException(
      "FORBIDDEN",
      "Wrong userId or confirmationCode"
    );
  }

  await knex("users")
    .update({ email_is_confirmed: true, email_confirmation_code: null })
    .where({ id: userId });

  return {};
};
