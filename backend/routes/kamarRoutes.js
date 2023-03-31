const express = require('express')
const app = express()

app.use(express.json())

const kamarControllers = require('../controllers/kamarControllers')

app.post("/",kamarControllers.addKamar)
app.get("/",kamarControllers.getAllKamar)
app.put("/:id",kamarControllers.updateKamar)
app.delete("/:id",kamarControllers.deleteKamar)

module.exports = app