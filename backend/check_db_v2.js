const mongoose = require("mongoose");
require("dotenv").config();
const Gardener = require("./models/gardenerModel");

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const all = await Gardener.find({});
  console.log("Total Count:", all.length);
  all.forEach((g, i) => {
    console.log(`[${i}] Name: ${g.name}, Status: '${g.status}', Bio Length: ${g.bio?.length || 0}`);
  });
  process.exit(0);
}

check();
