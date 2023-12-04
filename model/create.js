
var mongoose = require("mongoose");

var addSchema = mongoose.Schema({
    title: String,
    topic: String,
    content: String
});


var Add = mongoose.model("Add", addSchema);

module.exports = Add;