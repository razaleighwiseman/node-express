var express = require('express');

var actions = require('../methods/mysqlactions');

var router = express.Router();

router.post('/addissue', actions.addIssue);
router.post('/addnote', actions.addNote);
router.get('/issues', actions.getissues);
router.get('/issuenotes', actions.getissuenotes);
router.get('/issueoptions', actions.getissueoptions);

module.exports = router;

