const express = require('express');
const kamarModel = require('../models/index').kamar;

  /* CREATE */
exports.addKamar = async (req, res) => {  
      let newKamar = {
        nomor_kamar: req.body.nomor_kamar,
        id_tipe_kamar: req.body.id_tipe_kamar,
      }
      await kamarModel.create(newKamar)
      .then(result => res.json({ success: 1, message: "Data has been inserted", data: result }))
      .catch(err => res.json({ success: 0, message: err.message }))
}


/* READ */
exports.getAllKamar = async (req,res) => {
  await kamarModel.findAll({include: ['tipe_kamar']})
    .then(result => res.json({ success: 1, data: result }))
    .catch(err => res.json({ success: 0, message: err.message }))
}

/* Update */
exports.updateKamar = async (req, res) => { 
      let params = { id_kamar: req.params.id }

      let dataKamar = {
        nomor_kamar: req.body.nomor_kamar,
        id_tipe_kamar: req.body.id_tipe_kamar,
      }

      await kamarModel.update(dataKamar, { where: params })
      .then(result => res.json({ success: 1, message: "Data has been updated" }))
      .catch(error => res.json({ success: 0, message: error.message }))
}

exports.deleteKamar = async  (req, res) => { 

  let params = { id_kamar: req.params.id }

  await kamarModel.destroy({ where: params })
    .then(result => res.json({ success: 1, message: "Data has been deleted" }))
    .catch(error => res.json({ success: 0, message: error.message }))
}
