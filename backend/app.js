import express from "express";
import mongoose from "mongoose";
import links from "./link.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000" ,
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/", {
  })
  .then(() => console.log("Database connected with uri : " + process.env.MONGO_URI))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.post("/short", async (req, res) => {
  const { link } = req.body;
  const prefix = process.env.PREFIX;
  const new_link = Math.random().toString(36).slice(2, 7);

  const exist = await links.exists({ shorten_url: new_link });

  if (exist)
    return res.status(400).json({
      success: false,
      message: "Some error occured , please try again",
    });

  await links.create({
    url: link,
    shorten_url: new_link,
  });

  const new_url = prefix + new_link;
  res.status(200).json({
    success: true,
    result: new_url,
  });
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;

  const link = await links.findOne({ shorten_url: id });

  if (!link)
    return res.status(400).json({
      success: false,
      message: "Destination not found",
    });

  if (link.clicks_left == 0)
    return res.status(400).json({
      success: false,
      message: "link is expired",
    });

  link.clicks_left -= 1;

  await link.save();

  res.redirect(link.url);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`server is running on port : ${ process.env.PORT || 5000}`);
});
