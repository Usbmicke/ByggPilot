const { purgeCache } = require("@netlify/functions");

exports.handler = async (req, context) => {
  try {
    console.log('🧹 Purging Netlify CDN cache...');
    

