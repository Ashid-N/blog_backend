var mongoose = require("mongoose");

var adminSchema = mongoose.Schema({
    email: String,
    password: String
});

var Admin = mongoose.model("admin", adminSchema); 

module.exports = Admin;