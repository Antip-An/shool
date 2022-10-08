exports.up = async (knex) => {
    await knex.schema.createTable("users", (table) => {
        table.increments("id");
        table.string("login").unique().notNullable();
        table.string("email").unique().notNullable();
        table.boolean("email_is_confirmed").notNullable().defaultTo(false);
        table.string("email_confirmation_code", 6);
        table.string("password");
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
        table
            .enu("role", ["user", "admin"])
            .notNullable()
            .defaultTo("user");
    });

    await knex.schema.createTable("courses", (table) => {
        table.increments("id");
        table.string("title").unique().notNullable();
        table.text("description").notNullable();
        table.string("photo");
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("lessons", (table) => {
        table.increments("id");
        table.string("title").notNullable();
        table.text("study").notNullable();
        table.string("photo");
        table.integer('id_course').notNullable();
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
        table.foreign("id_course").references('courses.id');
    });

    await knex.schema.createTable("tasks", (table) => {
        table.increments("id");
        table.text("question").notNullable();
        table.string("right_answer");
        table.string("photo");
        table.integer("id_lesson").notNullable();
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
        table.foreign("id_lesson").references('lessons.id');
    });


    // await knex.schema.createTable("tests", (table) => {
    //     table.increments("id");
    //     table.string("title").notNullable();
    //     table.text("description").notNullable();
    //     table.integer("id_lessons").notNullable();
    //     table.foreign("id_lessons").references('lessons.id');
    //     table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    //     table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    // });

    // await knex.schema.createTable("options", (table) => {
    //     table.increments("id");
    //     table.string("answer").notNullable();
    //     table.bool("right_answer").notNullable();
    //     table.integer("id_task").notNullable();
    //     table.foreign("id_task").references('tasks.id');
    // });
};

exports.down = async (knex) => {
    // await knex.schema.dropTableIfExists("options");
    // await knex.schema.dropTableIfExists("tests");
    await knex.schema.dropTableIfExists("tasks");
    await knex.schema.dropTableIfExists("lessons");
    await knex.schema.dropTableIfExists("users");
    await knex.schema.dropTableIfExists("courses");
};