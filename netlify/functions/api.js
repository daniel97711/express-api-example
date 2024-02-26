import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();
const router = Router();

const port = process.env.PORT || 3000;

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

api.use("/api/", router);

export const handler = serverless(api);
