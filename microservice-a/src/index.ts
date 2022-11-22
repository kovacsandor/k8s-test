import express, { Request, Response } from "express";
import axios from "axios";
import { connect } from "mongoose";
import { testObjectModel } from "./testObjectModel";

const app = express();
const port = 8080;

app.get("/microservice-a", (req: Request, res: Response) => {
  console.log("microservice-a GET / called...");
  res.status(200);
  res.send({
    test: "ok",
  });
});

app.get(
  "/microservice-a/response-including-data-from-microservice-b",
  async (req: Request, res: Response) => {
    console.log(
      "microservice-a GET /response-including-data-from-microservice-b called..."
    );
    const { data } = await axios.get(
      "http://microservice-b-cluster-ip-service:8081/microservice-b/data-from-microservice-b"
    );
    res.status(200);
    res.send({
      data: data.data,
    });
  }
);

app.get(
  "/microservice-a/test-objects-from-database",
  async (req: Request, res: Response) => {
    console.log("microservice-a GET /test-object-from-database called...");
    const testObjects = await testObjectModel.find({});
    res.status(200);
    res.send({
      testObjects,
    });
  }
);

app.post(
  "/microservice-a/add-test-object-to-database/:name",
  async (req: Request, res: Response) => {
    console.log(
      "microservice-a POST /add-test-object-to-database/:name called..."
    );
    const name = req.params.name;
    const document = testObjectModel.createDocument({ name });
    const testObject = await document.save();

    res.status(200);
    res.send({
      testObject,
    });
  }
);

app.listen(port, async () => {
  await connect(
    "mongodb://microservice-a-database-cluster-ip-service:27017/microservice-a"
  );
  console.log(`Microservice "A" listening on port ${port}...`, process.env, 'version', 2);
});
