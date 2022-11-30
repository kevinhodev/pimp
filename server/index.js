const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileupload = require("express-fileupload");
const Título = require("./models/Título");
const getData = require("./utils/data");

const app = express();

app.use(cors());
app.use(fileupload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/titulos", async (req, res) => {
  const file = Object.values(req.files)[0];
  const títulos = getData(file.data.toString("utf-8"));

  try {
    await Título.collection.insertMany(títulos);

    res.status(201).json({
      message: `${títulos.length} títulos carregados com sucesso!`,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get("/relatorios", async (req, res) => {
  try {
    let códigos = await Título.aggregate([
      {
        $group: {
          _id: "$apresentante.código",
          count: {
            $count: {},
          },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    let apresentantes = await Título.aggregate([
      {
        $group: {
          _id: "$apresentante.nome",
          count: {
            $count: {},
          },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    let espécies = await Título.aggregate([
      {
        $group: {
          _id: "$espécie",
          count: {
            $count: {},
          },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    let fins = await Título.find({
      fins_falimentares: "S",
    });

    res.status(200).json({
      reports: { códigos, espécies, apresentantes, fins },
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const DB_USER = "kevin";
const DB_PASSWORD = "MUfHqpWmY7uIBuP4";

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@prot04cluster.pcawzd3.mongodb.net/prot04?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
  });
