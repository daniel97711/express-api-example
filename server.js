const express = require("express");
const cors = require("cors");
const {json} = express;
const config = require('./config.json');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const {parseString} = require('xml2js');
const multer = require('multer');
const {generateHtml, isTokenValid} = require('./generateHTML');

const {userRegister, changePassword, userDetail} = require('./user.js');
const {clear} = require('./data.js');
const {userLogin, userLogout} = require('./userLogin.js');
const {getData, updateData} = require('./data.js');

const app = express();
app.use(json());
app.use(cors());
app.use(morgan('dev'));




const port = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send({ data: "Rendering Service Online All routes work as intended" });
});


// // user register
// app.put('/user/register', (req, res) => {
//   const email = req.body.email;
//   const userName = req.body.userName;
//   const password = req.body.password;

//   try {
//     const value = userRegister(email, password, userName);
//     res.status(200).json(value);
//   } catch (error) {
//     res.status(error.statusCode || 500).json({error: error.message});
//   }
// });

app.put('/user/register', (req, res) => {
  const { email, userName, password } = req.body;

  if (!email || !userName || !password) {
    return res.status(400).json({ error: 'Missing required fields in request body' });
  }

  try {
    const value = userRegister(email, password, userName);
    res.status(200).json(value);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// change password
app.post('/user/password', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const newPassword = req.body.newPassword;

  try {
    const value = changePassword(email, password, newPassword);
    res.status(200).json(value);
  } catch (error) {
    res.status(error.statusCode || 500).json({error: error.message});
  }
});

app.get('/user/detail', (req,res) => {
  const userId = req.body.userId;
  
  try {
    const response = userDetail(userId);
    res.status(200).json(response);
  } catch (error) {
    res.status(error.statusCode).json({error: error.message});
  }
});

// help the user to login to the system
app.post('/user/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const value = userLogin(email, password);
    res.status(200).json(value);
  } catch (error) {
    res.status(error.statusCode || 500).json({error: error.message});
  }
});

// help the user to logout from the system
app.post('/user/logout', (req, res) => {
  const userId = req.body.userId;
  const token = req.body.token;

  try {
    const value = userLogout(userId, token);
    res.status(200).json(value);
  } catch (error) {
    res.status(error.statusCode || 500).json({error: error.message});
  }
});

// clear all the data from data.json
app.delete('/clear', (req, res) => {
  const value = clear();
  return res.json(value);
});

const storage = multer.diskStorage({
  destination: '/tmp/',
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({storage: storage}).single('xmlFile');

app.use(express.text({type: 'application/xml'}));

app.post('/render/uploadXML', upload, (req, res) => {
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

      //invoiceList

      const parsedJson = JSON.parse(json);
      const invoiceId= parsedJson['cbc:ID'][0];

      //const invoiceId = json['cbc:ID'];
      let Data = getData();
      //console.log(invoiceId);
      //console.log(json);
      if (invoiceId != undefined) {
        const checkInvoice = Data.users.find(user => user.invoiceList.includes(invoiceId));
        if (checkInvoice === undefined) {
          const user = Data.users.find((user) => user.userId == tokenObject.id);
          if (user !== undefined) {
            user.invoiceList.push(invoiceId);
            updateData(Data);
          }
        }
      }

      fs.writeFileSync(path.join(__dirname, 'data2.json'), json);

      fs.unlinkSync(req.file.path);

      res.status(200).json(data);
    });
  });
});

app.get('/render/getHTML', (req, res) => {
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

app.post('/render/xmlToHTML', (req, res) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).send('Error: Authorization token missing');
    }
    const tokenData = token.slice(7);
    const tokenObject = JSON.parse(tokenData);
    if (isTokenValid(tokenObject.id, tokenObject.token) === -1) {
      return res.status(401).send('Error: You are unauthorized');
    }
    
    const xmlString = req.body;

    parseString(xmlString, (error, result) => {
      if (error) {
        return res.status(400).send('Error: The XML provided is invalid');
      }

      const jsonData = result.Invoice;
      const html = generateHtml(jsonData);

      res.status(200).send(html);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: Internal Server Error');
  }
});
























app.get("/slow", (req, res) => {
  const { delay } = req.query;

  setTimeout(
    () =>
      res.send({
        data: `Hello SENG2021! Message Delayed by ${delay} seconds`,
      }),
    delay * 1000,
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
