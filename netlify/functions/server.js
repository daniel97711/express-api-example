import express, { Router } from "express";
import serverless from "serverless-http";

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

