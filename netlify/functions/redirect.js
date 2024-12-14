import mongoose from 'mongoose';
import links from '../../link.js';

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { dbName: 'link_shortener' });

exports.handler = async function(event, context) {
  const { id } = event.pathParameters;

  const link = await links.findOne({ shorten_url: id });

  if (!link)
    return { statusCode: 400, body: JSON.stringify({ success: false, message: "Destination not found" }) };

  if (link.clicks_left == 0)
    return { statusCode: 400, body: JSON.stringify({ success: false, message: "Link is expired" }) };

  link.clicks_left -= 1;
  await link.save();

  return {
    statusCode: 302,
    headers: { Location: link.url },
  };
};
