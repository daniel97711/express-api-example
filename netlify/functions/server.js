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

router.get("/", (req, res) => {
  res.send({ data: "Hello SENG2021!" });
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

