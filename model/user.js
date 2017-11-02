var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
    email: {
    	type: String,
    	lowercase: true,
    	unique: true,
    	required: true
    },
    password: {
        type: String,
        required: true,
	default: 'password'
    },
    role: {
	type: String,
        required: true
	//enum: ['Shipping Line', 'Warehouse', 'NVOCC', 'Shipper', 'Others/Please specify'],
	//default: 'Shipping Line'
    },
    company: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    tac: {
        type: String,
        required: true
    },
    active: {
	type: String,
	required: true,
	default: 'N'
    },
    activationCode: {
	type: String,
	required: true
    },
    myFavorite: [{}]
                            
});

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);
