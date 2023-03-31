const express = require('express')
const md5 = require('md5');
const path = require('path');
const fs = require('fs')
const slugify = require('slugify');


const uploadPelanggan = require('../middleware/uploadPelanggan').single('foto')
const pelangganModel = require('../models/index').pelanggan;

const slugOptions = {
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    locale: 'id'
  };

  /* CREATE */
exports.addPelanggan = async (req, res) => { 
  uploadPelanggan(req, res, async err => {
    if (err) {
        return res.json({ message: err })
    }

    if (!req.file) {
      let newPelanggan = {
        nama: req.body.nama,
        slug: slugify(req.body.nama, slugOptions),
        email: req.body.email,
        password: md5(req.body.password),
        role: req.body.role,
      }
      await pelangganModel.create(newPelanggan)
      .then(result => res.json({ success: 1, message: "Data has been inserted without foto", data: result }))
      .catch(err => res.json({ success: 0, message: err.message }))
    } else {
      let newPelanggan = {
        nama: req.body.nama,
        slug: slugify(req.body.nama, slugOptions),
        email: req.body.email,
        password: md5(req.body.password),
        role: req.body.role,
        foto: req.file.filename,
      }
      await pelangganModel.create(newPelanggan)
      .then(result => res.json({ success: 1, message: "Data has been inserted", data: result }))
      .catch(err => res.json({ success: 0, message: err.message }))
    }
  
  })
}

/* READ */
exports.getAllPelanggan = async (req,res) => {
  await pelangganModel.findAll()
    .then(result => res.json({ success: 1, data: result }))
    .catch(err => res.json({ success: 0, message: err.message }))
}

/* READ DETAIL */
exports.getPelanggan = async (req,res) => {
  let params = { slug: req.params.slug };

  await pelangganModel.findOne({ where: params })
    .then(result => res.json({ data: result }))
    .catch(error => res.json({ message: error.message }))
}

/* Update */
exports.updatePelanggan = async (req, res) => { 
  uploadPelanggan(req, res, async err => {
      if (err) {
          return res.json({ message: err })
      }

      if (!req.file) return res.json({ message: "No file uploaded" })


      let params = { id_pelanggan: req.params.id }

      let dataPelanggan = {
        nama: req.body.nama,
        slug: slugify(req.body.nama, slugOptions),
        email: req.body.email,
        password: md5(req.body.password),
        role: req.body.role
      }

      if (req.file) {
        let oldImg = await pelangganModel.findOne({ where: params });
        let oldImgName = oldImg.foto;

        let loc = path.join(__dirname, '../public/foto_pelanggan/', oldImgName);
        fs.unlink(loc, (err) => console.log(err));

        let finalImageURL =req.file.filename;
        dataPelanggan.foto = finalImageURL;  
      }
      
      await pelangganModel.update(dataPelanggan, { where: params })
      .then(result => res.json({ success: 1, message: "Data has been updated" }))
      .catch(error => res.json({ success: 0, message: error.message }))
  })
}

exports.deletePelanggan = async  (req, res) => { 

  let params = { id_pelanggan: req.params.id }

  
  let delImg = await pelangganModel.findOne({ where: params });
  if (delImg) {
    let delImgName = delImg.foto;
    let loc = path.join(__dirname, '../public/foto_pelanggan/', delImgName);
    fs.unlink(loc, (err) => console.log(err));
  }

  await pelangganModel.destroy({ where: params })
    .then(result => res.json({ success: 1, message: "Data has been deleted" }))
    .catch(error => res.json({ success: 0, message: error.message }))
}
