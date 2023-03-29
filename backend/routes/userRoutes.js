const express = require('express')
const md5 = require('md5');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');

const { uploadUser } = require('../middleware/uploadImage');
const user = require('../models/index').user;

const app = express();  

const slugOptions = {
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    locale: 'id'
  };

  app.get('/', async (req, res) => {
    await user.findAll()
      .then(result => res.json({ success: 1, data: result }))
      .catch(error => res.json({ success: 0, message: error.message }))
  });


  app.post('/', uploadUser.single('foto'), async (req, res) => {
    if (!req.file) return res.json({ message: "No file uploaded" })
  
    let finalImageURL = req.protocol + '://' + req.get('host') + '/usr/' + req.file.filename;
  
    let data = {
      nama_user: req.body.nama_user,
      foto: finalImageURL,
      slug: slugify(req.body.nama_user, slugOptions),
      email: req.body.email,
      password: md5(req.body.password),
      role: req.body.role
    }
  
    await user.create(data)
      .then(result => res.json({ success: 1, message: "Data has been inserted", data: result }))
      .catch(error => res.json({ success: 0, message: error.message }))
  });
  
  module.exports = app;
