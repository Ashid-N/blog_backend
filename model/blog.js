var mongoose = require("mongoose");

var blogSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    status: Number ,
    position: String
});

var Blog = mongoose.model("Blog", blogSchema); 

module.exports = Blog;
