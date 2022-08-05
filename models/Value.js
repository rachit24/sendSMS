const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Value = new Schema({
    name: {type: String},
    value_index:{type: Number}
});

module.exports = mongoose.model('Value', Value);