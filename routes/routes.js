var express = require('express');
var actions = require('../methods/actions');
var multer = require('multer');
var upload = multer({ dest: __dirname + '/../uploads/' });
var profile = multer({ dest: __dirname + '/../uploads/profiles/' });
var post = multer({ dest: __dirname + '/../uploads/posts/' });

var router = express.Router();

router.post('/authenticate', actions.authenticate);
router.post('/adduser', actions.addNew);
router.post('/addprofile', actions.addProfile);
router.put('/updatesettings', actions.updateSettings);
router.get('/settings', actions.getSettings);
router.post('/addfeedback', upload.single('avatar'), actions.addFeedback);
router.post('/addpost', post.single('image'), actions.addPost);
router.put('/editpost', post.single('image'), actions.updatePost);
router.delete('/deletepost', actions.deletePost);
router.post('/addcomment', actions.addComment);
router.put('/addavatar', profile.single('avatar'), actions.addAvatar);
router.put('/updateuser/:id', actions.updateInfo);
router.delete('/deleteuser/:id', actions.deleteUser);
router.get('/getinfo', actions.getinfo);
router.get('/gettac/:id', actions.gettac);
router.get('/sendemail/:id', actions.sendEmail);
router.get('/activate', actions.activate);
router.get('/resetpassword/:id', actions.sendResetCode);
router.put('/addfavorite', actions.addFavorite);
router.put('/addlike', actions.addLike);
router.put('/removefavorite', actions.removeFavorite);
router.get('/getfeedback', actions.getFeedback);
router.get('/getfeedbackbyid/:id', actions.getFeedbackById);
router.get('/getfeedbackimg', actions.getFeedbackImage);
router.get('/getpost', actions.getPost);
router.get('/getpostbyid/:id', actions.getPostById);
router.get('/getpostimg/:id', actions.getPostImage);
router.get('/getfeedbackall', actions.getAllFeedback);
router.get('/getavatar', actions.getAvatar);
router.get('/getcomment', actions.getComment);

module.exports = router;

