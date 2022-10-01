const db = require("../../utils/db");

const ControllerException = require("../../utils/ControllerException");
const usersController = require("../users");
//const { test } = require("../../knexfile");

const users = [
  { login: "John", email: "johm@smith.com", password: "12345" },
  { login: "Johnn", email: "johm@smith.com", password: "12345" },
  { login: "Jack", email: "jack@smith.com", password: "12346" },
  { login: "Jane", email: "jane@smith.com", password: "12347" },
  { login: "Inna", email: "inna@smith.com", password: "12348" },
];

beforeEach(async () => {
  await db.seed.run();
});

// allusers

test("Can register user", async () => {
  const data = await usersController.singup(users[0]);

  expect(data).toEqual(expect.any(Object));
  expect(data.userId).toEqual(expect.any(Number));
  expect(data.userId).toBeGreaterThan(0);
});

test("Can save all fields on register", async () => {
  const { userId } = await usersController.singup(users[0]);
  const record = await adminController.getUserById({ userId });

  expect(record.login).toBe(users[0].login);
  expect(record.email).toBe(users[0].email);
  expect(record.role).toBe("user");
  expect(record.emailIsConfirmed).toBe(false);
});

test("Cannot register with same login twice", async () => {
  await usersController.singup(users[0]);
  const result = await usersController.singup(users[0]).catch((err) => err);

  expect(result).toEqual(expect.any(ControllerException));
  expect(result.exceptionCode).toBe("SINGUP_ERROR");
});

test("Cannot register with same email twice", async () => {
  await usersController.singup(users[0]);
  const result = await usersController.singup(users[1]).catch((err) => err);

  expect(result).toEqual(expect.any(ControllerException));
  expect(result.exceptionCode).toBe("SINGUP_ERROR");
});

test("Can login user", async () => {
  const data = await usersController.singup(users[0]);
  const result = await usersController.singin(users[0]).catch((err) => err);

  expect(data).toEqual(expect.any(Object));
  expect(result).toEqual(expect.any(Object));
  expect(data.userId).toBeGreaterThan(0);
  expect(result.userId).toBeGreaterThan(0);

  console.log(result)
})

test("Cannot login user", async () => {
  const result = await usersController.singin(users[0]).catch((err) => err);

  expect(result).toEqual(expect.any(ControllerException));
  expect(result.exceptionCode).toBe("SINGIN_ERROR");
})

// users



//admin