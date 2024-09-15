const client = require("./client.js");

const createFlavor = async (flavorName, flavorIsFavorite) => {
  try {
    const { rows } = await client.query(`
            INSERT INTO flavor (name, is_favorite)
            VALUES ('${flavorName}', ${flavorIsFavorite})
            RETURNING *
        `);
    return rows[0];
  } catch (err) {
    console.log("ERROR CREATING A FLAVOR: ", err);
  }
};

const getFlavors = async () => {
  try {
    const { rows } = await client.query(`
            SELECT * FROM flavor;
        `);
    return rows;
  } catch (err) {
    console.log("ERRROR GETTING FLAVORS: ", err);
  }
};

const getSingleFlavor = async (flavorId) => {
  try {
    const { rows } = await client.query(`
            SELECT * FROM flavor WHERE id = ${flavorId}
        `);
    return rows;
  } catch (err) {
    console.log("ERROR GETTING FLAVOR");
  }
};

const deleteFlavor = async (flavorId) => {
  try {
    await client.query(
      `
        DELETE FROM flavor WHERE id = $1
      `,
      [flavorId]
    );
  } catch (err) {
    console.log("ERROR DELETING FLAVOR: ", err);
  }
};

const updateFlavor = async (flavorId, newName, newFavoriteStatus) => {
  try {
    await client.query(`
        UPDATE flavor
        SET name = $2, is_favorite = $3
        WHERE id = $1
        RETURNING *
      `, [flavorId, newName, newFavoriteStatus]);
  } catch (err) {
    console.log("ERROR UPDATING FLAVOR: ", err);
  }
};

module.exports = {
  createFlavor: createFlavor,
  getFlavors: getFlavors,
  getSingleFlavor: getSingleFlavor,
  deleteFlavor: deleteFlavor,
  updateFlavor: updateFlavor
};
