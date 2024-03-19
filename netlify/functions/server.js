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
app.use(express.text({type: 'application/xml'}));

router.post('/render/uploadXML', upload, (req, res) => {
  const token = req.headers['authorization'];
  const tokenData = token.slice(7);
  const tokenObject = JSON.parse(tokenData);
  if (isTokenValid(tokenObject.id, tokenObject.token) === -1) {
    return res.status(401).send('Error: You are unauthorized');
  }
  if (!req.file) {
    return res.status(400).send('File not uploaded');
  }

  fs.readFile(req.file.path, 'utf8', (error, data) => {
    if (error) {
      return res.status(500).send('Error: Cannot read file');
    }

    parseString(data, (error, result) => {
      if (error) {
        res.status(400).send('The XML provided is invalid');
        return;
      }

      const data = result.Invoice;
      const json = JSON.stringify(data, null, 2);

      fs.writeFileSync(path.join(__dirname, 'data2.json'), json);

      fs.unlinkSync(req.file.path);

      res.status(200).json(data);
    });
  });
});

router.get('/render/getHTML', (req, res) => {
  const token = req.headers['authorization'];
  const tokenData = token.slice(7);
  const tokenObject = JSON.parse(tokenData);
  console.log(tokenObject.token);

  if (isTokenValid(tokenObject.id, tokenObject.token) === -1) {
    return res.status(401).send('Error: You are unauthorized');
  }
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data2.json'));
    const parsedData = JSON.parse(data);

    const html = generateHtml(parsedData);
    res.status(200).send(html);
  } catch (err) {
    res.status(500).send('Error: Cannot read JSON data');
  }
});



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