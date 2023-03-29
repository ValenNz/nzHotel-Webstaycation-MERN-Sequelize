const express = require('express')
const md5 = require('md5');
const path = require('path');
const fs = require('fs')
const slugify = require('slugify');


const uploadUser = require('../middleware/UploadImage').single('foto')
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

    if (!req.file) return res.json({ message: "No file uploaded" })

    let newUser = {
      nama_user: req.body.nama_user,
      slug: slugify(req.body.nama_user, slugOptions),
      email: req.body.email,
      password: md5(req.body.password),
      role: req.body.role,
      foto: req.file.filename,
    }

    /* Ekseskusi tambah data  */
    await userModel.create(newUser)
    .then(result => res.json({ success: 1, message: "Data has been inserted", data: result }))
    .catch(err => res.json({ success: 0, message: err.message }))
  })
}

/* READ */
exports.getAllUser = async (req,res) => {
  await userModel.findAll()
    .then(result => res.json({ success: 1, data: result }))
    .catch(err => res.json({ success: 0, message: err.message }))
}

/* Update */
exports.updateUser = async (req, res) => { 
  uploadUser(req, res, async err => {
      if (err) {
          return res.json({ message: err })
      }

      if (!req.file) return res.json({ message: "No file uploaded" })


      let idUser = req.params.id

      let dataUser = {
        nama_user: req.body.nama_user,
        slug: slugify(req.body.nama_user, slugOptions),
        email: req.body.email,
        password: md5(req.body.password),
        role: req.body.role
      }

      if (req.file) {
          const selectedUser = await userModel.findOne({
              where: { id : id }
          })

          const oldFotoUser = selectedMember.foto

          const pathFoto = path.join(__dirname, `../public/foto_user`, oldFotoUser)

          if (fs.existsSync(pathFoto)) {
              fs.unlink(pathFoto, err => console.log(err)) 
          }

          idUser.foto = req.file.filename    
      }
      
      userModel.update(dataUser, { where: { id: idUser } })  
      .then(result => res.json({ success: 1, message: "Data has been updated" }))
      .catch(err => res.json({ success: 0, message: err.message }))
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
