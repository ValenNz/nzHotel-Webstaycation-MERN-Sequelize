const express = require('express')
const app = express()

app.use(express.json())

const tipeKamarControllers = require('../controllers/tipeKamarControllers')

app.post("/",tipeKamarControllers.addTipeKamar)
app.get("/",tipeKamarControllers.getAllTipeKamar)
app.put("/:id",tipeKamarControllers.updateTipeKamar)
app.delete("/:id",tipeKamarControllers.deleteTipeKamar)

module.exports = app