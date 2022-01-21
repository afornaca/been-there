const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP  = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => { // cb(callback func) to determine the name of the file
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv4() + '.' + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]; //!! will convert undefined to false, since if the mimetype of the file isnt png/jpg/jpeg it will return undef
        let error = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid); // first arg is error or null if no error, second arg is whether we want to upload the file or not
    }
});

module.exports = fileUpload;