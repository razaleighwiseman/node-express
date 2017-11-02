var mysql = require('mysql');

var config = {
  connectionLimit : 10,
  host            : '130.2.88.244',
  user            : 'xmobusr',
  password        : '5e441c2197',
  database        : 'northport-csc'
};

var pool = mysql.createPool(config);

var connection = mysql.createConnection({
  host     : '130.2.88.244',
  user     : 'xmobusr',
  password : '5e441c2197',
  database : 'northport-csc'
});
 
/*connection.connect();
 
connection.query('SELECT * FROM Northport_bug_table order by date_submitted desc limit 1', function (error, results, fields) {
  if (error) throw error;
  //console.log(results);
  console.log(results.length);
  console.log('The results is: ', results[0]);
});
 
connection.end();*/

var query0 = 'SELECT a.id, a.category, a.date_submitted, a.last_updated, a.detail, a.mode_of_request';

var query1 = 'SELECT * FROM Northport_bug_table order by date_submitted desc limit 1';

var query2 = 'SELECT  a.*, b.username, c.team, d.description FROM northport_bug_table a LEFT JOIN northport_user_table b ON a.reporter_id = b.id LEFT JOIN northport_team_table c ON a.team_id = c.id LEFT JOIN northport_bug_text_table d ON a.bug_text_id = d.id order by date_submitted desc limit 1';

var query = "INSERT INTO Northport_bug_text_table (description, steps_to_reproduce, additional_information) VALUES ('Testing an issue', '', 'Test additional info');";


pool.query(query, function (error, results, fields) {
  if (error) throw error;
  //console.log(results);
  //console.log(results.length);
  ///console.log('The results is: ', results[0]);
  console.log('Data inserted into Northport_bug_text_table: ', results.affectedRows);
  console.log('Last insert id in Northport_bug_text_table: ', results.insertId);
  
  var issue = "INSERT INTO Northport_bug_table (Category, Detail, Mode_of_request, Problem_type, Priority, Team_id, occured_date, occured_time, Reported_date, Reported_time, date_submitted, last_updated, User_dept_name, Summary, Bug_text_id, Department_id, Status, Respond_date, Respond_time, Resolved_date, Resolved_time, Resolution, Reporter_id) VALUES ('Complaint', 'Container Untraced', 'E-mail', 'Container/Operations', 30, 2, '24/02/2017', '4:00', '24/02/2017', '7:54', NOW(), NOW(), 'SWIFT Logistics TA Sdn Bhd', 'Container Reported Untraced', " + results.insertId  + ", 6, 10, '4/4/2017', '12:23', '4/4/2017', '12:23',10, 128);";

  pool.query(issue, function (error, results) {
	if (error) throw error;
	    console.log('Data inserted into Northport_bug_table: ', results.affectedRows);
	    console.log('Last insert id in Northport_bug_table: ', results.insertId);	
  });
});

