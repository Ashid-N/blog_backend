var mongoose = require("mongoose");

var managerSchema = mongoose.Schema({
    topic: String,
    name: String,
    email: String,
    password: String,
    status: Number
});

var manager = mongoose.model("manager", managerSchema); 

module.exports = manager;