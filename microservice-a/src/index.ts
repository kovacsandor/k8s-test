import { connect } from "mongoose";
import { app } from "./app";

const port = 8080;

app.listen(port, async () => {  
  await connect(
    "mongodb://microservice-a-database-cluster-ip-service:27017/microservice-a"
  );
  console.log(`Microservice "A" listening on port ${port}...`, process.env);
});
