const express = require('express')
const app = express()

app.use(express.json())

const pemesananControllers = require('../controllers/pemesananControllers')

app.post("/",pemesananControllers.addPemesanan)
app.get("/",pemesananControllers.getAllPemesanan)
app.put("/:id",pemesananControllers.updatePemesanan)
app.delete("/:id",pemesananControllers.deletePemesanan)

module.exports = app