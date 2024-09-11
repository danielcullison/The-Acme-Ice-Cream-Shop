const pg = require("pg");
const express = require("express");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_ice_cream_shop_db"
);
const app = express();

// parse the body into JS Objects
app.use(express.json());

// Log the requests as they come in
app.use(require("morgan")("dev"));

// Returns an array of flavors
app.get("/api/flavors", async (req, res, next) => {
  try {
    const SQL = `
        SELECT * FROM flavors ORDER BY created_at DESC;
      `;

    const response = await client.query(SQL);

    res.json(response.rows);
  } catch (ex) {
    next(ex);
  }
});

// Returns a single flavor
app.get("/api/flavors/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
          SELECT * FROM flavors WHERE id = $1;
      `;
    const response = await client.query(SQL, [id]);

    if (response.rows.length === 0) {
      res.sendStatus(404); // Not Found
    } else {
      res.json(response.rows[0]);
    }
  } catch (ex) {
    next(ex);
  }
});

// Create flavors
app.post("/api/flavors", async (req, res, next) => {
  try {
    const { name } = req.body;
    const SQL = `
        INSERT INTO flavors(name)
        VALUES($1)
        RETURNING *
      `;
    const response = await client.query(SQL, [name]);
    res.send(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

// Update flavors
app.put("/api/flavors/:id", async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const SQL = `
        UPDATE flavors
        SET name = $1, updated_at = now()
        WHERE id = $2
        RETURNING *
      `;
    const response = await client.query(SQL, [name, id]);
    res.send(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

// Delete flavors
app.delete("/api/flavors/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
        DELETE FROM flavors
        WHERE id = $1
      `;
    await client.query(SQL, [id]);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// Initialize Database and Server
const init = async () => {
  await client.connect();
  console.log("Connected to database");

  let SQL = `
      DROP TABLE IF EXISTS flavors;
      CREATE TABLE flavors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `;
  await client.query(SQL);
  console.log("Tables created");

  SQL = `
      INSERT INTO flavors(name) VALUES
      ('Vanilla'),
      ('Chocolate'),
      ('Strawberry');
    `;
  await client.query(SQL);
  console.log("Data seeded");

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`));
};

init();
