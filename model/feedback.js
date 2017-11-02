var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedbackSchema = new Schema({
    username: {
	type: String,
	required: true
    },
    type: {
	type: String,
	required: true
    },
    about: {
	type: String,
	required: true
    },
    message: {
	type: String,
	required: true
    },
    reaction: {
	type: String
    },
    img: {
	data: Buffer,
	contentType: String
    }
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Feedback', feedbackSchema);
