const db = require("../../utils/db");

const ControllerException = require("../../utils/ControllerException");
const coursesController = require("../courses");

const courses = [
    { title: "course1", description: "about", photo: "1"},
    { title: "course2", description: "about", photo: "2" }
];

beforeEach(async () => {
  await db.seed.run();
});

test("Can create course", async () => {
  const data = await coursesController.createCourse(courses[0]);

  expect(data).toEqual(expect.any(Object));
  expect(data.courseId).toEqual(expect.any(Number));
  expect(data.courseId).toBeGreaterThan(0);
});

test("Cannot register with same title twice", async () => {
  await coursesController.createCourse(courses[0]);
  const result = await coursesController.createCourse(courses[0]).catch((err) => err);

  expect(result).toEqual(expect.any(ControllerException));
  expect(result.exceptionCode).toBe("TITLE_IN_USE");
});