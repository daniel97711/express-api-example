import express, { Router } from "express";
import serverless from "serverless-http";
import express from "express";
import { Router } from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { parseString } from "xml2js";
import multer from "multer";

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

export const handler = serverless(app);

