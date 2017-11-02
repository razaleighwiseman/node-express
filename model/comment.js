var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    topicId: {
	type: String,
	required: true
    },
    author: {
	type: String,
	required: true
    },
    message: {
	type: String,
	required: true
    }
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Comment', commentSchema);
