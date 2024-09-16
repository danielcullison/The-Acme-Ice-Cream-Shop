const express = require("express");
const app = express();
app.use(express.json());
const {
  getFlavors,
  createFlavor,
  getSingleFlavor,
  deleteFlavor,
  updateFlavor,
} = require("./db/flavor.js");
const client = require("./db/client.js");

client.connect();

app.get("/api/flavors", async (req, res, next) => {
  try {
    const allFlavors = await getFlavors();

    res.send(allFlavors);
  } catch (err) {
    console.log("ERROR FETCHING FLAVORS: ", err);
  }
});

app.get("/api/flavors/:id", async (req, res, next) => {
  try {
    flavorId = req.params.id;

    const singleFlavor = await getSingleFlavor(flavorId);

    res.send(singleFlavor);
  } catch (err) {
    console.log("ERROR GETTING FLAVOR: ", err);
  }
});

app.post("/api/flavors", async (req, res, next) => {
  try {
    const { name, is_favorite } = req.body;
    const newFlavor = await createFlavor(name, is_favorite);

    res.send(newFlavor);
  } catch (err) {
    console.log("ERROR ADDING FLAVOR: ", err);
  }
});

app.delete("/api/flavors/:id", async (req, res, next) => {
  try {
    const flavorId = req.params.id;

    await deleteFlavor(flavorId);
  } catch (err) {
    console.log("ERROR DELETING FLAVOR: ", err);
  }
});

app.put("/api/flavors/:id", async (req, res, next) => {
  try {
    const flavorId = req.params.id;
    const { name, is_favorite } = req.body;

    const updatedFlavor = await updateFlavor(flavorId, name, is_favorite);
    res.send(updatedFlavor);
  } catch (err) {
    console.log("ERROR UPDATING FLAVOR: ", err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`listening on port ${PORT}`));
