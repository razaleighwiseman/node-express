var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
    username: {
	type: String,
	required: true
    },
    password: {
	type: String,
	required: true
    },
    name: {
	type: String,
	required: true
    },
    company: {
	type: String
    },
    settings: {
	feeds: {
	   type: Boolean,
	   default: true
	}	
    },
    img: {
        data: Buffer,
        contentType: String
    }
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Profile', profileSchema);
