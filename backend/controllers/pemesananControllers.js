const express = require('express')

const pemesanan = require('../models/index').pemesanan;
const detail_pemesanan = require('../models/index').detail_pemesanan;
const kamar = require('../models/index').kamar;
const tipe_kamar = require('../models/index').tipe_kamar;


exports.addPemesanan = async (req,res) => {
    try{
        let data = {
            nomor_pemesanan: `WH-${receiptNum}`,
            id_pelanggan: req.body.id_pelanggan,
            tgl_pemesanan: dt,
            tgl_check_in: req.body.tgl_check_in,
            tgl_check_out: req.body.tgl_check_out,
            nama_tamu: req.body.nama_tamu,
            jumlah_kamar: req.body.jumlah_kamar,
            id_tipe_kamar: req.body.id_tipe_kamar,
            status_pemesanan: req.body.status_pemesanan,
            id_user: req.body.id_user,
          };
    } catch{
        
    }
}