const mongoose = require("mongoose");
const Value = require("../models/Value.js")
const connectDB = require("./db.js");
connectDB();
const createValue = async () => {
  try {
    const result = await Value.create({
      name: "Incrementor2",
      value_index: "0"
    });

    console.log(result);

  } catch (error) {
    console.log("No Value Created💥 "+error);
    process.exit(1);
  }
};

module.exports = createValue;
