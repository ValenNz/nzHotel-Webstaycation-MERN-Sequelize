const express = require('express');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');


const uploadTipeKamar   = require('../middleware/uploadTipeKamar').single('foto')
const tipeKamarModel = require('../models/index').tipe_kamar;

const slugOptions = {
  replacement: '-',
  remove: /[*+~.()'"!:@]/g,
  lower: true,
  strict: true,
  locale: 'id'
};

  /* CREATE */
exports.addTipeKamar = async (req, res) => { 
  uploadTipeKamar(req, res, async err => {
    if (err) {
        return res.json({ message: err })
    }

    if (!req.file) {
      let newTipeKamar = {
        nama_tipe_kamar: req.body.nama_tipe_kamar,
        slug: slugify(req.body.nama_tipe_kamar, slugOptions),
        harga: req.body.harga,
        deskripsi: req.body.deskripsi,
      }
      await tipeKamarModel.create(newTipeKamar)
      .then(result => res.json({ success: 1, message: "Data has been inserted without foto", data: result }))
      .catch(err => res.json({ success: 0, message: err.message }))
    } else {
      let newTipeKamar = {
        nama_tipe_kamar: req.body.nama_tipe_kamar,
        slug: slugify(req.body.nama_tipe_kamar, slugOptions),
        harga: req.body.harga,
        deskripsi: req.body.deskripsi,
        foto: req.file.filename,
      }
      await tipeKamarModel.create(newTipeKamar)
      .then(result => res.json({ success: 1, message: "Data has been inserted", data: result }))
      .catch(err => res.json({ success: 0, message: err.message }))
    }
  
  })
}

/* READ */
exports.getAllTipeKamar = async (req,res) => {
  await tipeKamarModel.findAll({include: ['kamar']})
    .then(result => res.json({ success: 1, data: result }))
    .catch(err => res.json({ success: 0, message: err.message }))
}

/* Update */
exports.updateTipeKamar = async (req, res) => { 
  uploadTipeKamar(req, res, async err => {
      if (err) {
          return res.json({ message: err })
      }

      if (!req.file) return res.json({ message: "No file uploaded" })


      let params = { id_tipe_kamar: req.params.id }

      let dataTipeKamar = {
        nama_tipe_kamar: req.body.nama_tipe_kamar,
        slug: slugify(req.body.nama_tipe_kamar, slugOptions),
        harga: req.body.harga,
        deskripsi: req.body.deskripsi
      }

      if (req.file) {
        let oldImg = await tipeKamarModel.findOne({ where: params });
        let oldImgName = oldImg.foto;

        let loc = path.join(__dirname, '../public/foto_tipe_kamar/', oldImgName);
        fs.unlink(loc, (err) => console.log(err));

        let finalImageURL =req.file.filename;
        dataTipeKamar.foto = finalImageURL;  
      }
      
      await tipeKamarModel.update(dataTipeKamar, { where: params })
      .then(result => res.json({ success: 1, message: "Data has been updated" }))
      .catch(error => res.json({ success: 0, message: error.message }))
  })
}

exports.deleteTipeKamar = async  (req, res) => { 

  let params = { id_tipe_kamar: req.params.id }

  
  let delImg = await tipeKamarModel.findOne({ where: params });
  if (delImg) {
    let delImgName = delImg.foto;
    let loc = path.join(__dirname, '../public/foto_tipe_kamar/', delImgName);
    fs.unlink(loc, (err) => console.log(err));
  }

  await tipeKamarModel.destroy({ where: params })
    .then(result => res.json({ success: 1, message: "Data has been deleted" }))
    .catch(error => res.json({ success: 0, message: error.message }))
}
