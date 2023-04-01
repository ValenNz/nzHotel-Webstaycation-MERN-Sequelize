const express = require('express')
const app = express()

app.use(express.json())

const detailPemesananControllers = require('../controllers/detailPemesananControllers')

app.get("/:id",detailPemesananControllers.getDetailPemesanan)

module.exports = app