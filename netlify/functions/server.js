const express = require('express');
const { Router } = require('express');
const serverless = require('serverless-http');
const { json } = express;
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { parseString } = require('xml2js');
const multer = require('multer');
const app = express();
const router = Router();
const config = require('../../src/config.json');
const {generateHtml, isTokenValid} = require('../../src/generateHTML.js');
const {userRegister, changePassword} = require('../../src/user.js');
const {clear} = require('../../src/data.js');
const {userLogin, userLogout} = require('../../src/userLogin.js');

app.use(json());
app.use(cors());
app.use(morgan('dev'));

const PORT = parseInt(config.port);
const HOST = 'localhost';

router.get("/", (req, res) => {
  res.send({ data: "Hello SENG2021!" });
});

// user register
router.put('/user/register', (req, res) => {
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;

  try {
    const value = userRegister(email, password, userName);
    res.status(200).json(value);
  } catch (error) {
    res.status(error.statusCode).json({error: error.message});
  }
});

// change password
router.post('/user/password', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const newPassword = req.body.newPassword;

  try {
    const value = changePassword(email, password, newPassword);
    res.status(200).json(value);
  } catch (error) {
    res.status(error.statusCode).json({error: error.message});
  }
});

// help the user to login to the system
router.post('/user/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const value = userLogin(email, password);
    res.status(200).json(value);
  } catch (error) {
    res.status(error.statusCode).json({error: error.message});
  }
});

// help the user to logout from the system
router.post('/user/logout', (req, res) => {
  const userId = req.body.userId;
  const token = req.body.token;

  try {
    const value = userLogout(userId, token);
    res.status(200).json(value);
  } catch (error) {
    res.status(error.statusCode).json({error: error.message});
  }
});

// clear all the data from data.json
router.delete('/clear', (req, res) => {
  const value = clear();
  return res.json(value);
});

const storage = multer.diskStorage({
  destination: '/tmp',
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({storage: storage}).single('xmlFile');




router.get("/slow", (req, res) => {
  const { delay } = req.query;

  setTimeout(
    () =>
      res.send({
        data: `Hello SENG2021! Message Delayed by ${delay} seconds`,
      }),
    delay * 1000,
  );
});

app.use("/app/", router);

module.exports.handler = serverless(app);