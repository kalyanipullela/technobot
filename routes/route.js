var express = require('express');
var app = express();
const router = express.Router();
const saltedMd5 = require('salted-md5')
const path = require('path');
const multer = require('multer');
var admin = require("firebase-admin");
var serviceAccount = require("../uploadfilestechnobot-firebase-adminsdk-tz20h-14e1c08ca8.json");

const model = require('../model/model');
const upload = multer({ storage: multer.memoryStorage() })


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.BUCKET_URL
});

app.locals.bucket = admin.storage().bucket()


router.get("/", (req, res) => {
    model
        .find()
        .then((imagesList) => {
            res.status(200).send(imagesList);
        })
        .catch((error) => res.status(400).send({
            success: false,
            error: 'Something went wrong'
        }))
});

router.post('/', upload.single('imageUrl'), async (req, res) => {
    const name = saltedMd5(req.file.originalname, 'SUPER-S@LT!')
    const fileName = name + path.extname(req.file.originalname);
    await app.locals.bucket.file(fileName).createWriteStream().end(req.file.buffer);
    const downloadUrl = `https://storage.googleapis.com/${process.env.BUCKET_URL}/${fileName}`;

    var imageDetails = new model({
        title: req.body.title,
        content: req.body.content,
        heading: req.body.heading,
        imageUrl: downloadUrl
    });

    imageDetails.save().then((result) => {
        res.status(200).send({
            success: true,
            data: result
        })
    }).catch((error) => res.status(400).send({
        success: false,
        error: 'Something went wrong'
    }))
});


router.put('/:id', upload.single('imageUrl'), async (req, res) => {
    model.findById(req.params.id).then(async (result) => {
        if (req.file) {
            const name = saltedMd5(req.file.originalname, 'SUPER-S@LT!')
            const fileName = name + path.extname(req.file.originalname);
            await app.locals.bucket.file(fileName).createWriteStream().end(req.file.buffer);
            const downloadUrl = `https://storage.googleapis.com/${process.env.BUCKET_URL}/${fileName}`;
            var imageData = { imageUrl: downloadUrl };
            Object.assign(req.body, imageData)
        }
        model.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((result) => {
            res.status(200).send({
                success: true,
                data: result
            })
        }).catch((error) => res.status(400).send({
            success: false,
            error: 'Something went wrong'
        }))

    })


})

router.delete('/:id', (req, res) => {
    model.findByIdAndDelete(req.params.id).then((result) => {
        console.log("result", result);
        res.status(200).send({
            success: true,
            data: result
        })
    }).catch((error) => res.status(400).send({
        success: false,
        error: 'Something went wrong'
    }))
})


module.exports = router;
