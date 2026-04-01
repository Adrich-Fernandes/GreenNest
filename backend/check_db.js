const mongoose = require("mongoose");
require("dotenv").config();
const Gardener = require("./models/gardenerModel");

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const count = await Gardener.countDocuments({});
  const activeCount = await Gardener.countDocuments({ status: "active" });
  console.log(`Total Gardeners: ${count}`);
  console.log(`Active Gardeners: ${activeCount}`);
  const all = await Gardener.find({});
  console.log("Gardener Roles/Statuses in DB:");
  all.forEach(g => console.log(`- ${g.name}: ${g.status}`));
  process.exit(0);
}

check();
