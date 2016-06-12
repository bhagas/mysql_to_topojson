
/*
 * GET home page.
 */
// import database

 var mysql      = require('mysql');

module.exports.connection = mysql.createConnection({
  host     : '128.199.196.228',
  user     : 'root',
  port	   : '3306',
  password : 'sawunggaling26a',
  database : 'hrvplanner_ciptakarya_2016'
});