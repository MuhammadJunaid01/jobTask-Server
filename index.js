const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const { parse } = require("dotenv");
const res = require("express/lib/response");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://abbas:t43VVdhzTeg35Haf@cluster0.oisx1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("mongo pass and name", uri);
async function run() {
  try {
    await client.connect();
    const database = client.db("ArkCom");
    const jsPostCollection = database.collection("jsPost");
    app.get("/jsPost", async (req, res) => {
      const cursor = jsPostCollection.find({});
      const result = await cursor.toArray();
      //   console.log("filter result", result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
app.get("/testing", (req, res) => {
  res.send("hello testing api");
});
app.get("/", (req, res) => {
  res.send("ARK COM server is runnig ");
});
run().catch(console.dir);
app.listen(port, () => {
  console.log("server is runnig the port", port);
});
