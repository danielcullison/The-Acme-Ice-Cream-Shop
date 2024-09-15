const client = require("./client.js");
const { createFlavor } = require("./flavor.js");

const dropTables = async () => {
  try {
    console.log("DROPPED TABLES");

    await client.query(`
            DROP TABLE IF EXISTS flavor;
            `);
  } catch (err) {
    console.log("ERROR DROPPING TABLES: ", err);
  }
};

const createTables = async () => {
  try {
    console.log("CREATING TABLES");

    await client.query(`
            CREATE TABLE flavor(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            is_favorite BOOLEAN NOT NULL,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
            );
        `);

    console.log("TABLES CREATED");
  } catch (err) {
    console.log("ERROR CREATING TABLES: ", err);
  }
};

const init = async () => {
  await client.connect();
  console.log("CONNECTED");

  await dropTables();

  await createTables();

  await createFlavor("Vanilla", false);
  await createFlavor("Cookie Dough", true);
  await createFlavor("Chocolate", false);
};

init();
