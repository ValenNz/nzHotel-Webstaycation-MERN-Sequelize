const express = require('express')
const app = express()

app.use(express.json())

const pelangganControllers = require('../controllers/pelangganControllers')

app.post("/",pelangganControllers.addPelanggan)
app.get("/",pelangganControllers.getAllPelanggan)
app.get("/:slug",pelangganControllers.getPelanggan)
app.put("/:id",pelangganControllers.updatePelanggan)
app.delete("/:id",pelangganControllers.deletePelanggan)

module.exports = app