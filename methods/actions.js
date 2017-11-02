var User = require('../model/user');
var Feedback = require('../model/feedback');
var Post = require('../model/post');
var Comment = require('../model/comment');
var Profile = require('../model/profile');
var config = require('../config/database');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');

var tacGen = function(len){
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
       text += charset.charAt(Math.floor(Math.random() * charset.length));

       return text;
    };

var transportEmail = function(to, subject, html){

	var smtpConfig = {
            host: 'email.northport.com.my',
            port: 25,
            //secure: true, // use SSL
            auth: {
               user: 'razaleigh@northport.com.my',
               pass: 'RAza9897'
                   }
         };

	var transporter = nodemailer.createTransport(smtpConfig);

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"Northport Mobile" <razaleigh@northport.com.my>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: 'Hello world', // plaintext body
            html: html// html body
        };

                // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
              return console.log(error);
            }
              console.log('Message sent: ' + info.response);
        });
	
};

var functions = {
    authenticate: function(req, res) {
        User.findOne({
            email: req.body.email
        }, function(err, user){
            if (err) throw err;
            
            if(!user) {
console.log(user);
               // res.status(403).send({success: false, msg: 'Authentication failed, User not found'});
                res.json({success: false, msg: 'Authentication failed, User not found'});
            }
	    else if(user.active === 'N'){	
                res.json({success: false, msg: 'Authentication failed, User not active'});
	    }
            
           else {
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch && !err) {
                        var token = jwt.encode(user, config.secret);
                        res.json({success: true, token: token});
                    } else {
                        //return res.status(403).send({success: false, msg: 'Authenticaton failed, wrong password.'});
                	res.json({success: false, msg: 'Authenticaton failed, wrong password.'});
                    }
                })
            }
            
        })
    },
    addNew: function(req, res){
        if((!req.body.email)){
            console.log(req.body.email);
            console.log(req.body.password);
            
            res.json({success: false, msg: 'Enter all values'});
        }
        else {
            var newUser = User({
                email: req.body.email,
                //password: req.body.password,
		role: req.body.role,
		name: req.body.name,
		company: req.body.company,
		contact: req.body.contact,
		tac: tacGen(5),
		activationCode: tacGen(10)
            });
            
            newUser.save(function(err, newUser){
                if (err){
                    res.json({success:false, msg:'Failed to save'})
                }
                
                else {
                    res.json({success:true, msg:'Successfully created new user'});
                }
            })
        }
    },
    updateInfo: function(req, res){
	User.findOne({'email': req.params.id}, function(err, user){
	if (err)
           res.send(err);

	user.password = req.body.password;

      // Save the updates to the message
     	 user.save(function(err) {
       	    if (err)
               res.send(err);

	    res.json({ success:true, message: 'User edited!' });
     	 });
	});

    },
    deleteUser: function(req, res){
	User.findOne({'email': req.params.id}, function(err, user){
	if (err)
	   res.send(err);

         if(!user) {
            res.json({success: false, msg: 'delete failed, User not found'});
          }
        else{
	//delete user
	user.remove(function(err){
            if (err)
               res.send(err);

            res.json({ success:true, message: 'User removed!' });
        });
	}
       });
    },
    getinfo: function(req, res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.json({success: true, msg: {email: decodedtoken.email, name: decodedtoken.name, tac: decodedtoken.tac, myFavorite: decodedtoken.myFavorite}});
        }
        else {
            return res.json({success:false, msg: 'No header'});
        }
    },
    gettac: function(req, res) {
	User.findOne({'email': req.params.id}, function(err, user){
		if(err)
		res.send(err);
               	//res.json({success:false, msg:'tac not found'})

           	if(!user) {
                   res.json({success: false, msg: 'tac failed, User not found'});
                }
		else{
		//update tac
		user.tac = tacGen(5);

		user.save(function(err){
		  if (err)
               	    res.send(err);
		
		res.json({success: true, tac: user.tac});
		});
		}
	});
    },
    sendEmail: function(req, res) {
	User.findOne({'email': req.params.id}, function(err, user){
                if(err)
                res.send(err);
		if(!user){
		   res.json({success: false, msg: 'User not found'});
                }
                else{
                res.json({success: true, code: user.activationCode});
		
		var email = req.params.id;
		var code = user.activationCode;

		var subject = 'Account Activation - Email Verification';

		var url = 'https://mobile-appserver.northport.com.my/activate?code='+ code;

		var html = '<p>Hi,</p><p>Thank you for signing up to Northport Mobile</p>' +
                        '<p>Please activate your account by clicking on the link below: <br /><a href="'+ url +'">'+ url +'</a></p>' +
                        '<p>If you are unable to click on the link above, please copy the full URL and paste it into your browser address bar.</p>' +
                        '<p>In the event if you did not request for a Northport Mobile account, kindly ignore this email.</p>' +
                        '<p>Thank You</p><p>Yours sincerely,<br /><i>Northport Mobile Team</i></p>';

		transportEmail(email, subject, html);

                }

	});
    },
    activate: function(req, res) {
        User.findOne({'activationCode': req.query.code}, function(err, user){
        if (err)
           res.send(err);
	
        if(!user) {
           //res.json({success: false, msg: 'Failed to activate - invalid code'});
	    res.sendFile(path.join(__dirname + '/../view/errorcode.html'));
        }
	else if (user.active === 'Y'){
           //res.json({success: false, msg: 'Failed to activate - account already active'});
	    res.sendFile(path.join(__dirname + '/../view/erroractive.html'));
        }
	else{
        user.active = 'Y';

      // Save the updates to the message
         user.save(function(err) {
            if (err)
               res.send(err);

           // res.json({ success:true, message: 'User activated!', code: user.activationCode, activate: user.active });
	    res.sendFile(path.join(__dirname + '/../view/index.html'));
         });
	}
        });
    },
    sendResetCode: function(req, res) {
	User.findOne({'email': req.params.id}, function(err, user){

		if(err)
		res.send(err)	

           	if(!user) {
                   res.json({success: false, msg: 'Password reset failed, User not found'});
                }
		else{
		res.json({success: true, code: user.tac});

		var email = req.params.id;
		var code = user.tac;
		var name = user.name;

		var subject = 'Northport Mobile: Password Reset'
		
		var html = '<p>Dear '+ name +',</p><p>Here is the verification code you need to reset your password:</p>' +
			 '<h1 style=”padding:6px; background-color: white; border: black 2px solid”>'+ code +'</h1><p>This email was generated because of a password reset attempt from your account.<p>' + 
		'<p>The verification code is required to complete the password reset. No one can reset your password without also accessing this email.</p>'+
                        '<p>In the event if you did not request for password reset, kindly ignore this email.</p>' +
                        '<p>Thank You</p><p>Yours sincerely,<br /><i>Northport Mobile Team</i></p>';
		
		transportEmail(email, subject, html);
			
		}
	});
    },
    addLike: function(req, res){
        var id = req.query.id;
	var user = req.body.user;

        Post.findById(id, function(err, post) {

           if (err)
                res.send(err);

	   post.likes.push(user);

      // Save the updates to the posts  model
         post.save(function(err) {
            if (err)
               res.send(err);

            res.json({ success:true, message: user + ' like this post' });
         });
        });

    },
    addFavorite: function(req, res){
	User.findOne({'email': req.query.email}, function(err, user){
	if (err)
           res.send(err);

	user.myFavorite.push(req.body);

      // Save the updates to the user model
     	 user.save(function(err) {
       	    if (err)
               res.send(err);

	    res.json({ success:true, message: 'Favorite added!' });
     	 });
	});

    },
    removeFavorite: function(req, res){
	User.findOne({'email': req.query.email}, function(err, user){
	if (err)
           res.send(err);

	user.myFavorite.pull({cont_num: req.body.cont_num});

      // Save the updates to the user model
     	 user.save(function(err) {
       	    if (err)
               res.send(err);

	    res.json({ success:true, message: 'Favorite removed!' });
     	 });
	});

    },
    addProfile: function(req, res) {
	Profile.findOne({'username': req.body.uname}, function(err, profile){
	if (err)
	   res.send(err);
	
	if (!profile) {

	   var profile = new Profile({
		username: req.body.uname,
		password: req.body.pwd,
		name: req.body.name,
		company: req.body.company
	   });

	   profile.save(function(err, profile) {
            if (err)
               res.send(err);

            res.json({ success:true, msg: 'Profile Saved', profile: profile });

	   });
	}
	else {
	   res.json({success: false, msg: 'Profile already existed'});
	   //start logging
	}
    });

    },
    addAvatar: function(req, res) {
	Profile.findOne({'name': req.body.name}, function(err, profile) {
		if (err)
		   res.send(err);

		profile.img.data = fs.readFileSync(req.file.path);
		profile.img.contentType = 'image/png';

		profile.save(function(err, profile) {
		  if (err)
		     res.send(err);

		     res.json({success:true, msg:'Profile picture updated'}); 
		});
	});
    },
   getAvatar: function(req, res){

        var name = req.query.name;

        Profile.findOne({ $and:[{'name': name}, {'img': { $exists: true }}]}, function(err, profile) {

           if (err)
                res.send(err);

              if(!profile) {
                //display default avatar
		res.sendFile(path.join(__dirname + '/../view/avatar.png'));
              }
	      else{
                res.contentType(profile.img.contentType);
                res.send(profile.img.data);
	      }
        });
   },
   getSettings: function(req, res) {

        var username = req.query.username;

        Profile.findOne({'username': username}, function (err, profile) {

          if (err)
                res.send(err);

          res.json(profile.settings);

       });
   },
   updateSettings: function(req, res) {

	var username = req.query.username;

	Profile.findOne({'username': username}, function (err, profile) {

	  if (err)
		res.send(err);

	  profile.settings.feeds = req.body.feeds;

	  //save settings to profile
	  profile.save(function (err, profile){
		if (err)
		   res.send(err);

		  res.json({success: true, msg: 'Settings updated'});
	  });
	});
   },
    addPost: function(req, res) {

	var post = new Post({
	    username: req.body.username,
	    compname: req.body.compname,
	    message: req.body.message
	});

	if (req.file) {
	   post.img.data = fs.readFileSync(req.file.path);
	   post.img.contentType = 'image/png';
	}
   
	post.save(function(err, post) {
            if (err){
               res.json({success:false, msg:'Failed to post status'});
            }
            else {
               res.json({success:true, msg:'New post sent'});
            }
	});
    },
    updatePost: function(req, res){
	
	var id = req.query.id;

        Post.findById(id, function(err, post){
        if (err)
           res.send(err);

        post.message = req.body.message;

      // Save the updates to the message
         post.save(function(err) {
            if (err)
               res.send(err);

            res.json({ success:true, message: 'Post has been edited!' });
         });
        });

    },
    deletePost: function(req, res){

	var id = req.query.id;
	
        Post.findById(id, function(err, post){
        if (err)
           res.send(err);

         if(!post) {
            res.json({success: false, msg: 'delete failed, Post not found'});
          }
        else{
        //delete post
        post.remove(function(err){
            if (err)
               res.send(err);

            res.json({ success:true, message: 'Post has been deleted!' });
        });
        }
       });
    },

   getPost: function(req, res){

        Post.find({}, { 'img.data':0 }, { sort :{ createdAt : -1}}, function(err, posts){
            if (err)
                 res.send(err);

             res.json(posts);
        });
   },

   getPostById: function(req, res) {

	var id = req.params.id;
	
	Post.findById(id, { 'img.data': 0 }, function(err, post) {
            if (err)
                 res.send(err);

             res.json(post);

	});
   },

   getPostImage: function(req, res){

        var id = req.params.id.replace(".png", "");

        Post.findById(id, function(err, post) {

           if (err)
                res.send(err);

                res.contentType(post.img.contentType);
                res.send(post.img.data);
        });
   },

    addFeedback: function(req, res){

	var feedback = new Feedback({
            username: req.body.email,
            type: req.body.type,
            about: req.body.about,
            message: req.body.message,
            reaction: req.body.reaction
	});

	if (req.file) {
	   feedback.img.data =  fs.readFileSync(req.file.path);
	   feedback.img.contentType = 'image/png';
	}
        feedback.save(function(err, feedback){
            if (err){
               res.json({success:false, msg:'Failed to save feedback'});
            }
	    else {
               res.json({success:true, msg:'New feedback sent'});
            }
        });
	
    },
    getFeedback: function(req, res){

	var username = req.query.email;

	Feedback.find({'username': username}, { 'img.data':0 }, { sort :{ createdAt : -1}}, function(err, feedbacks){
     	    if (err)
       		 res.send(err);

             res.json(feedbacks);
	});	
   },

   getFeedbackById: function (req,res) {

	var id = req.params.id;

        Feedback.findById(id, { 'img.data': 0 }, function(err, feedback) {

           if (err)
                res.send(err);

                res.json(feedback);
        });
	
   },
   getFeedbackImage: function(req, res){

	var id = req.query.id;

	Feedback.findById(id, function(err, feedback) {

	   if (err)
		res.send(err);

	        res.contentType(feedback.img.contentType);
                res.send(feedback.img.data);
	}); 
   },
    getAllFeedback: function(req, res){

	Feedback.find({}, { 'img.data': 0 },{ sort :{ createdAt : -1}}, function(err, feedbacks){
     	    if (err)
       		 res.send(err);

             res.json(feedbacks);		
	});	
   },
   addComment: function(req, res){

	var comment = new Comment({
            topicId: req.body.topic_id,
            author: req.body.author,
            message: req.body.message
	});

        comment.save(function(err, comment){
            if (err){
               res.json({success:false, msg:'Failed to save reply'});
            }
            else {
               res.json({success:true, msg:'New reply sent'});
            }
        });
	
   },
    getComment: function(req, res){

        var topicId = req.query.topic_id;

        Comment.find({'topicId': topicId}, null, { sort :{ createdAt : 1}}, function(err, comments){
            if (err)
                 res.send(err);

             res.json(comments);
        });
   }
    
}

module.exports = functions;
