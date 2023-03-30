const express = require ('express')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

const userModel = require('../models/index').admin

const authenticate = async (req, res) => {
    let dataLogin = {
        username: req.body.username,
        password: md5(req.body.password)
    }

    await userModel.findOne({where:dataLogin})
    .then(dataUser => {
        if(dataUser){
            let payload = JSON.stringify(dataUser)
            let secret = 'nzhotelmern'
            let token = jwt.sign(payload, secret)
    
            res.json({ success: 1, message: "Login success, welcome back!", data: result, token: token })
        }  else {
            res.json({ success: 0, message: "Invalid email or password!" })
        }
    })
    .catch(error => res.json({ message: error.message }))    
}

module.exports = authenticate
