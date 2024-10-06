require('dotenv').config()
const express = require("express");
const mongoose = require('mongoose')
const cors = require("cors");
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')


const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir : '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 },
}))

// simple route
app.get("/", (req, res) => {
  res.json({ msg: "Welcome to Backend-API." });
});

app.get("/file/*", async (req, res) => {
  const downloadPath = path.resolve(__dirname, './uploads/', req.params[0])
  res.sendFile(downloadPath, err => {
    if (err) {
      if (err.code == 'ENOENT') {
        res.status(404).send({ msg: 'File not found!' })
      }
      else {
        res.status(500).send({ msg: err.message })
      }
    }
  })
})

// routes
app.use('/api', require('./routes/userRouter'))
app.use('/api', require('./routes/jenisPanggilanRouter'))
app.use('/api', require('./routes/jenisPerkaraRouter'))
app.use('/api', require('./routes/hasilPanggilanRouter'))
app.use('/api', require('./routes/panggilanRouter'))
app.use('/api', require('./routes/jurusitaRouter'))

// connect to database MongoDB
const URI = process.env.MONGODB_URL
mongoose.connect(URI).then(() => {
    console.log("Successfully connect to Database.");
}).catch(err => {
    console.error("Connection error", err);
    process.exit();
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});