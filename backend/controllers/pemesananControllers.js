const express = require('express')
const moment = require("moment") 
const Op = require('sequelize');


const pemesananModel = require('../models/index').pemesanan;
const detailPemesananModel = require('../models/index').detail_pemesanan;
const kamarModel = require('../models/index').kamar;
const tipeKamarModel = require('../models/index').tipe_kamar;

/* CREATE */
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
            nomor_pemesanan: receiptNum,
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
            attributes: ["id_tipe_kamar", "nama_tipe_kamar"],
            where: { id_tipe_kamar: data.id_tipe_kamar },
            include: [
                {
                    model: kamarModel,
                    as: 'kamar',
                    attributes: ['id_kamar', 'id_tipe_kamar'],
                    include: [
                        {
                            model: detailPemesananModel,
                            as: 'detail_pemesanan',
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

        const pemesananKamarId = dataPemesanan[0].kamar.map((kamar) => kamar.id_kamar)
        const kamarTersedia = dataKamar.filter(
            (kamar) => !pemesananKamarId.includes(kamar.id_kamar)
        )

        const kamarDipilih = kamarTersedia.slice(0, data.jumlah_kamar)
        /*  
            slice() = method array di JavaScript yang berfungsi menyalin sebagian elemen array ke array baru.
            https://www.w3schools.com/jsref/jsref_slice_array.asp
        */

        const checkInDate =  new Date(data.tgl_check_in)
        const checkOutDate =  new Date(data.tgl_check_out)
        const totalHari = Math.round((checkOutDate - checkInDate) / (1000 * 3600 * 24))// ndak paham

        if(dataKamar === null || kamarTersedia.length < data.jumlah_kamar || totalHari === 0 || kamarDipilih === null) {
            return res.json({ dataKamar, kamarTersedia, totalHari,  kamarDipilih,  message: "Kamar tidak tersedia" });
        } else {
            const result = await pemesananModel.create(data)

            for(let i = 0; i < totalHari; i++) {
                for (let j = 0; j < kamarDipilih.length; j++) {
                    let tgl_akses = new Date(checkInDate)
                    tgl_akses.setDate(tgl_akses.getDate() + i)

                    let dataDetailPemesanan = {
                        id_pemesanan: result.id_pemesanan,
                        id_kamar: kamarDipilih[j].id_kamar,
                        tgl_akses: tgl_akses,
                        harga: dataTipeKamar.harga
                    }
                    await detailPemesananModel.create(dataDetailPemesanan)
                }
            }
            res.json({ success: 1, message: "Berhasil pesan kamar", data: result })
        }

    } catch (err){
        res.json({ message: err.message })
    }
}

/* READ */
exports.getAllPemesanan = async (req,res) => {
    let status = req.query.status || ''

    await pemesananModel.findAll({
        wherw: {
            [Op.or]: [{
                status_pemesanan: {[Op.like]: `%${status}$%`}
            }]
        },
        include: ['user','pelanggan','tipe_kamar']
    })
    .then(result => res.json({ success: 1, message: "Berhasil menampilkan semua data pemesanan kamar", data: result }))
    .catch(err => res.json({ msg: err.msg }))
}

/* UPDATE */
exports.updatePemesanan = async (req,res) => {
    let params = { id_pemesanan: req.params.id}

    let dataPemesanan = {
        status_pemesanan: req.body.status_pemesanan,
        id_user: req.body.id_user
    }
    await pemesananModel.update(dataPemesanan, {where: params})
    .then(result => res.json({ success: 1, message: 'Data has been updated!' }))
    .catch(err => res.json({ message: err.message }))
}

/* DELETE */
exports.deletePemesanan = async (req,res) => {
    try{
        const params = { id_pemesanan: req.params.id };

        /* Data Pemesanan */
        const cariDataPemesanan = await pemesananModel.findOne({where: params})
        if (cariDataPemesanan === null ){
            return res.status(404).json({ message: 'Data pemesanan tidak ditemukan' })
        }

        /* Data detail pemesanan */
        const cariDataDetailPemesanan = await detailPemesananModel.findAll({where:params});
        if (cariDataDetailPemesanan === null ){
            return res.status(404).json({ message: 'Data detail pemesanan tidak ditemukan' })
        }

        detailPemesananModel.destroy({ where: params })
      .then(result => {
        if (result !== null) {
          pemesananModel.destroy({ where: params })
            .then(result => res.json({ success: 1, message: 'Data pemesanan telah dihapus' }))
            .catch(err => res.json({ message: err.message }))
        }
      })
      .catch(err => res.json({ message: err.message }))
    } catch {
        res.json({ message: err.message })
    }
}