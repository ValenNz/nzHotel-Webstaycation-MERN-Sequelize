'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('tipe_kamar', [{
      nama_tipe_kamar: 'Standard Room',
      harga: '350000',
      deskripsi: 'ini adalah deskripsi dari tipe kamar Standard Room',
      foto: null,
    }], {});

    await queryInterface.bulkInsert('tipe_kamar', [{
      nama_tipe_kamar: 'Superior Room',
      harga: '450000',
      deskripsi: 'ini adalah deskripsi dari tipe kamar Superion Room',
      foto: null,
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('tipe_kamar', null, {});

  }
};
