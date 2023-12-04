var mongoose = require("mongoose");

var topicSchema = mongoose.Schema({
    topic: String
});


var topic = mongoose.model("topic", topicSchema);

module.exports = topic;