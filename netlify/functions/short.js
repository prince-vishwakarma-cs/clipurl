import mongoose from "mongoose";
import links from "../../link.js";

const { prefix } = process.env;  // Prefix from .env
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { dbName: 'link_shortener' });

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const { link } = JSON.parse(event.body);
    const new_link = Math.random().toString(36).slice(2, 7);

    const exist = await links.exists({ shorten_url: new_link });

    if (exist)
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Some error occurred, try again" }),
      };

    await links.create({ url: link, shorten_url: new_link });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result: prefix + new_link }),
    };
  }

  return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
};
