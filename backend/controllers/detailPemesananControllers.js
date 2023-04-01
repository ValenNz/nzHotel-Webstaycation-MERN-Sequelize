const express = require('express');
const detailPemesananModel = require('../models/index').detail_pemesanan

exports.getDetailPemesanan = async (req,res) => {
    let params = {id_pemesanan: req.params.id}

    await detailPemesananModel.findAll({where: params, include: ['kamar']})
    .then(result => res.json({ success: 1, message: "Berhasil menampilkan data deyail pemesanan kamar", data: result }))
    .catch(err => res.json({ msg: err.msg }))
}