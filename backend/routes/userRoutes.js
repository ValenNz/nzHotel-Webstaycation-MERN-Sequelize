const express = require('express')
const app = express()

app.use(express.json())

const userControllers = require('../controllers/userControllers')

app.post("/",userControllers.addUser)
app.get("/",userControllers.getAllUser)
app.get("/:slug",userControllers.getUser)
app.put("/:id",userControllers.updateUser)
app.delete("/:id",userControllers.deleteUser)

module.exports = app