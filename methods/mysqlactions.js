var mysql = require('mysql');

var config = {
  connectionLimit : 10,
  host            : '130.2.88.244',
  user            : 'xmobusr',
  password        : '5e441c2197',
  database        : 'northport-csc'
};

var pool = mysql.createPool(config);

var functions = {

  addIssue: function(req, res) {

	var description = req.body.description;
	var extrainfo = req.body.extrainfo;

	var bug_text = "INSERT INTO Northport_bug_text_table (description, steps_to_reproduce, additional_information) VALUES ('" + description  + "', '', '" + extrainfo + "');";


	pool.query(bug_text, function (error, results) {
	  if (error) throw error;

          var type = req.body.type;
          var subject = req.body.subject;
          var mode = req.body.mode;
          var problem = req.body.problem;
          var priority = req.body.priority;
          var team = req.body.team;
          var occured_date = req.body.occured_date;
          var occured_time = req.body.occured_time;
          var reported_date = req.body.reported_date;
          var reported_time = req.body.reported_time;
          var customer = req.body.customer;
          var summary = req.body.summary;

	  var issue = "INSERT INTO Northport_bug_table (Category, Detail, Mode_of_request, Problem_type, Priority, Team_id, occured_date, occured_time, Reported_date, Reported_time, date_submitted, last_updated, User_dept_name, Summary, Bug_text_id, Department_id, Status, Resolution, Reporter_id) VALUES ('" + type + "', '" + subject + "', '" + mode + "', '" + problem + "', " + priority + ", " + team + ", '" + occured_date + "', '" + occured_time + "', '" + reported_date + "', '" + reported_time + "', NOW(), NOW(), '" + customer + "', '" + summary + "', " + results.insertId  + ", 6, 10,10, 128);";

	    pool.query(issue, function (error, results) {
		if (error) throw error;
		    res.json({success: true, msg: 'New issue submitted', id: results.insertId});
	  });
	});


  },

  addNote: function(req, res) {

	var note = req.body.note;

	var note_text = "INSERT INTO northport_bugnote_text_table (note) VALUES ('" + note + "');";

	pool.query(note_text, function (error, results) {
	  if (error) throw error;

	  var bug_id = req.body.bug_id;

	  var insert_note = "INSERT INTO northport_bugnote_table (bug_id, reporter_id, bugnote_text_id, date_submitted, last_modified) VALUES (" + bug_id + ", 128, " + results.insertId + ", NOW(), NOW());"; 

            pool.query(insert_note, function (error, results) {
                if (error) throw error;
                    res.json({success: true, msg: 'New note added', id: results.insertId});
          });
	});
  },

  getissues: function(req, res) {

	
	var query = 'SELECT  a.*, b.username, c.team, d.description, e.username "assigned_to" FROM northport_bug_table a LEFT JOIN northport_user_table b ON a.reporter_id = b.id LEFT JOIN northport_team_table c ON a.team_id = c.id LEFT JOIN northport_bug_text_table d ON a.bug_text_id = d.id LEFT JOIN northport_user_table e ON a.handler_id = e.id ORDER BY date_submitted DESC LIMIT 20';


	pool.query(query, function (error, results, fields) {
	  if (error) throw error;
	     console.log(results.length);
	     res.json(results);
	});
  },

  getissuenotes: function(req, res) {

	var bug_id = req.query.bug_id;

	var query = "SELECT a.*, b.username, c.note FROM northport_bugnote_table a LEFT JOIN Northport_user_table b ON a.reporter_id = b.id LEFT JOIN Northport_bugnote_text_table c ON a.Bugnote_text_id = c.id WHERE a.bug_id = '" + bug_id + "';";

        pool.query(query, function (error, results, fields) {
          if (error) throw error;
             console.log(results.length);
             res.json(results);
        });

  },

  getissueoptions: function(req, res) {

	var options = {};

	var query = "SELECT * FROM northport_mode_of_request_table";

	pool.query(query, function (error, results, fields) {
          if (error) throw error;
	     options.mod_of_request = results;
	     pool.query("SELECT * FROM northport_team_table", function (error, results, fields) {
		  if (error) throw error;
		     options.team = results;
		     pool.query("SELECT * FROM northport_detail_table", function (error, results, fields) {
			  if (error) throw error;
			     options.subject = results;
			     pool.query("SELECT * FROM northport_problem_type_table;", function (error, results) {
				  if (error) throw error;
				     options.problem_type = results;
				     pool.query("SELECT * FROM northport_user_department", function (error, results) {
					if (error) throw error;
					   options.customer = results;
					   res.json(options);
				     });
			     });	

             	    });
		
	     });
        });
	
  }
}

module.exports = functions;
