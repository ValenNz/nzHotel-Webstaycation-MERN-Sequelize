const express = require('express')
const moment = require("moment") 
const Op = require('sequelize');


const pemesananModel = require('../models/index').pemesanan;
const detailPemesananModel = require('../models/index').detail_pemesanan;
const kamarModel = require('../models/index').kamar;
const tipeKamarModel = require('../models/index').tipe_kamar;


exports.addPemesanan = async (req,res) => {
    try{
        /* Mendapatkan data random */
        let receiptNum = Math.floor(Math.random() * (100) + 1);
        /* 
          Math.floor() : Membulatkan ke bawah dan mengembalikan bilanagan bulat 
            -   https://www.w3schools.com/jsref/jsref_floor.asp
    
          Math.random() : Membuatkan bilangan bulat acak 1 -> 100
            -   https://www.w3schools.com/jsref/jsref_random.asp
        */

        let data = {
            nomor_pemesanan: `Nz - ${receiptNum}`,
            id_pelanggan: req.body.id_pelanggan,
            tgl_pemesanan:  moment().format('YYYY-MM-DD HH:mm:ss'),
            tgl_check_in: req.body.tgl_check_in,
            tgl_check_out: req.body.tgl_check_out,
            nama_tamu: req.body.nama_tamu,
            jumlah_kamar: req.body.jumlah_kamar,
            id_tipe_kamar: req.body.id_tipe_kamar,
            status_pemesanan: req.body.status_pemesanan,
            id_user: req.body.id_user,
        };

        let dataPelanggan = await pelangganModel.findOne({where: { id_pelanggan: data.id_pelanggan }});
        if (dataPelanggan == null) {
            return res.status(404).json({
              message: "Data not found!",
            });
        }
        data.nama_pelanggan = dataPelanggan.nama_pelanggan;
        data.email = dataPelanggan.email;

        let  dataKamar = await kamarModel.findAll({ where: { id_tipe_kamar: data.id_tipe_kamar } });
        if (dataKamar == null) {
            return res.status(404).json({
              message: "Data not found!",
            });
        }

        let dataTipeKamar = await tipeKamarModel.findOne({ where: { id_tipe_kamar: data.id_tipe_kamar } });
        if (dataTipeKamar == null) {
            return res.status(404).json({
              message: "Data not found!",
            });
        }

        let dataPemesanan = await tipeKamarModel.findAll({
            where: { id_tipe_kamar: data.id_tipe_kamar },
            include: [
                {
                    model: kamarModel,
                    as: 'kamarModel',
                    attributes: ['id_kamar', 'id_tipe_kamar'],
                    include: [
                        {
                            model: detailPemesananModel,
                            as: 'detailPemesananModel',
                            attributes: ['tgl_akses'],
                            where:{
                                tgl_akses: {
                                    [Op.between]: [data.tgl_check_in, data.tgl_check_out]
                                }
                            }
                        }
                    ]
                }
            ]
        })

        const pemesananKamarId = dataPemesanan[0].kamarModel.map((kamarModel) => kamarModel.id_kamar)

        const kamarTersedia = dataKamar.filter(
            (kamarModel) => !pemesananKamarId.includes(kamarModel.id_kamar)
        )

        const kamarDipilih = kamarTersedia.slice(0, data.jumlah_kamar)
        /*  
            slice() = method array di JavaScript yang berfungsi menyalin sebagian elemen array ke array baru.
            https://www.w3schools.com/jsref/jsref_slice_array.asp
        */

        const checkInDate =  new Date(data.tgl_check_in)
        const checkOutDate =  new Date(data.tgl_check_out)
        const totalHari = Math.round((checkOutDate - checkInDate) / (1000 * 3600 * 24))



    } catch{
        
    }
}