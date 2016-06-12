
/*
 * GET home page.
 */
// import database

 var mysql      = require('mysql');

module.exports.connection = mysql.createConnection({
  host     : '',
  user     : '',
  port	   : '',
  password : '',
  database : ''
});
