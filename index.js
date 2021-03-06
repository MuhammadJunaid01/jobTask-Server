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
    const reactPostCollection = database.collection("reactPost");
    const hooksPostCollection = database.collection("hooksPost");
    const contextPostCollection = database.collection("contextPost");
    const usersCollection = database.collection("users");
    const likesCollection = database.collection("like");
    const commentCollection = database.collection("comment");
    // javascript postCollection get api
    app.get("/jsPost", async (req, res) => {
      const cursor = jsPostCollection.find({});
      const result = await cursor.toArray();
      //   console.log("filter result", result);
      res.json(result);
    });
    app.get("/jsPost/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const result = await jsPostCollection.findOne({ _id: ObjectId(id) });
      res.json(result);
    });
    app.post("/jsPost", async (req, res) => {
      const content = req.body;
      const result = await jsPostCollection.insertOne(content);
      res.json(result);
    });
    // like system implement
    app.post("/like", async (req, res) => {
      const content = req.body;
      const result = await likesCollection.insertOne(content);
      res.json(result);
    });
    app.get("/like/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const cursor = likesCollection.find(query);
      const result = await cursor.toArray();
      //   console.log("filter result", result);
      res.json(result);
    });
    // react  postCollection get api
    app.get("/reactPost", async (req, res) => {
      const cursor = reactPostCollection.find({});
      const result = await cursor.toArray();
      //   console.log("filter result", result);
      res.json(result);
    });
    // sigle data get api react
    app.get("/react/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const result = await reactPostCollection.findOne({ _id: ObjectId(id) });
      res.json(result);
    });
    app.post("/reactPost", async (req, res) => {
      const content = req.body;
      const result = await reactPostCollection.insertOne(content);
      res.json(result);
    });
    // hooks  postCollection get api
    app.get("/hooksPost", async (req, res) => {
      const cursor = hooksPostCollection.find({});
      const result = await cursor.toArray();
      //   console.log("filter result", result);
      res.json(result);
    });
    app.post("/hooksPost", async (req, res) => {
      const content = req.body;
      const result = await hooksPostCollection.insertOne(content);
      res.json(result);
    });
    // context  postCollection get api
    app.get("/contextPost", async (req, res) => {
      const cursor = contextPostCollection.find({});
      const result = await cursor.toArray();
      //   console.log("filter result", result);
      res.json(result);
    });
    app.post("/contextPost", async (req, res) => {
      const content = req.body;
      const result = await contextPostCollection.insertOne(content);
      res.json(result);
    });
    app.post("/users", async (req, res) => {
      console.log("reviews", req.body);
      const users = await usersCollection.insertOne(req.body);
      res.json(users);
    });
    // comment post api
    app.post("/commentPostJs", async (req, res) => {
      const comment = req.body;
      const result = await commentCollection.insertOne(comment);
      res.json(result);
    });
    app.get("/commentPostJs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id: id };

      const cursor = commentCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.json(result);
    });
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      console.log("put user", user);

      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
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
