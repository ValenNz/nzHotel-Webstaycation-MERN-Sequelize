const express = require('express')
const md5 = require('md5');
const path = require('path');
const fs = require('fs')
const slugify = require('slugify');


const uploadUser = require('../middleware/uploadUser').single('foto')
const userModel = require('../models/index').user;

const slugOptions = {
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    locale: 'id'
  };

  /* CREATE */
exports.addUser = async (req, res) => { 
  uploadUser(req, res, async err => {
    if (err) {
        return res.json({ message: err })
    }

    if (!req.file) {
      let newUser = {
        nama_user: req.body.nama_user,
        slug: slugify(req.body.nama_user, slugOptions),
        email: req.body.email,
        password: md5(req.body.password),
        role: req.body.role,
      }
      await userModel.create(newUser)
      .then(result => res.json({ success: 1, message: "Data has been inserted without foto", data: result }))
      .catch(err => res.json({ success: 0, message: err.message }))
    } else {
      let newUser = {
        nama_user: req.body.nama_user,
        slug: slugify(req.body.nama_user, slugOptions),
        email: req.body.email,
        password: md5(req.body.password),
        role: req.body.role,
        foto: req.file.filename,
      }
      await userModel.create(newUser)
      .then(result => res.json({ success: 1, message: "Data has been inserted", data: result }))
      .catch(err => res.json({ success: 0, message: err.message }))
    }
  
  })
}


/* READ */
exports.getAllUser = async (req,res) => {
  await userModel.findAll()
    .then(result => res.json({ success: 1, data: result }))
    .catch(err => res.json({ success: 0, message: err.message }))
}

/* READ BY SLUG */
exports.getUser = async (req,res) => {
  let params = { slug: req.params.slug };

  await userModel.findOne({ where: params })
    .then(result => res.json({ success: 1, data: result }))
    .catch(error => res.json({ success: 0, message: error.message }))
}

/* Update */
exports.updateUser = async (req, res) => { 
  uploadUser(req, res, async err => {
      if (err) {
          return res.json({ message: err })
      }

      if (!req.file) return res.json({ message: "No file uploaded" })


      let params = { id_user: req.params.id }

      let dataUser = {
        nama_user: req.body.nama_user,
        slug: slugify(req.body.nama_user, slugOptions),
        email: req.body.email,
        password: md5(req.body.password),
        role: req.body.role
      }

      if (req.file) {
        let oldImg = await userModel.findOne({ where: params });
        let oldImgName = oldImg.foto;

        let loc = path.join(__dirname, '../public/foto_user/', oldImgName);
        fs.unlink(loc, (err) => console.log(err));

        let finalImageURL =req.file.filename;
        dataUser.foto = finalImageURL;  
      }
      
      await userModel.update(dataUser, { where: params })
      .then(result => res.json({ success: 1, message: "Data has been updated" }))
      .catch(error => res.json({ success: 0, message: error.message }))
  })
}

exports.deleteUser = async  (req, res) => { 

  let params = { id_user: req.params.id }

  
  let delImg = await userModel.findOne({ where: params });
  if (delImg) {
    let delImgName = delImg.foto;
    let loc = path.join(__dirname, '../public/foto_user/', delImgName);
    fs.unlink(loc, (err) => console.log(err));
  }

  await userModel.destroy({ where: params })
    .then(result => res.json({ success: 1, message: "Data has been deleted" }))
    .catch(error => res.json({ success: 0, message: error.message }))
}
