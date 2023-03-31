const multer = require(`multer`) 
const path = require(`path`)  

const storageUser = multer.diskStorage({
    destination: (req, file, cb) => { 
        cb(null, `./public/foto_user`)
    },

    filename: (req, file, cb) => { 
        cb(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname))
    }
})

const uploadUser = multer({
    storage: storageUser,
    fileFilter: (req, file, cb) => {
        const acceptedType = [`image/jpg`, `image/jpeg`, `image/png`]

        if (!acceptedType.includes(file.mimetype)) {
            cb(null, false) 
            return cb(`Invalid file type (${file.mimetype})`)

        }

        const fileSize = req.headers[`content-length`] 
        const maxSize = (1 * 1024 * 1024) 

        if(fileSize > maxSize){
            cb(null, false) 
            return cb(`File size is too large`) 
        }

        cb(null, true) 
    }
})
 
module.exports = uploadUser