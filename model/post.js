var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    username: {
	type: String,
	required: true
    },
    compname: {
	type: String,
	required: true
    },
    message: {
	type: String,
	required: true
    },
    likes: [],
    img: {
	data: Buffer,
	contentType: String
    }
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Post', postSchema);
