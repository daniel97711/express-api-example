const express = require("express");
const cors = require("cors");
const express = require('express');
const {json} = express;
const config = require('./config.json');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const {parseString} = require('xml2js');
const multer = require('multer');
const {generateHtml, isTokenValid} = require('./generateHTML');

const {userRegister, changePassword} = require('./user.js');
const {clear} = require('./data.js');
const {userLogin, userLogout} = require('./userLogin.js');

const app = express();
app.use(json());
app.use(cors());
app.use(morgan('dev'));



const port = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send({ data: "Hello SENG2021!" });
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
