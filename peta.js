var express = require('express')
  , http = require('http')
  , path = require('path');
var app = express();
var connection = require('./database').connection;
//var mysql2geojson = require("mysql2geojson");

var dbgeo = require("dbgeo");
app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');




// all environments
app.set('port', process.env.PORT || 8800);

//app.use(express.favicon());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// Add headers

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
 var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));  
});
var io = require('socket.io').listen(server, { log: false });


// app.listen(800, function () {
//   console.log('Example app listening on port 800!');
//admin
//mysql

  app.get('/topojson', function(req, res){
//connection.connect();
//console.log(req.query)
connection.query("SELECT asWkt(admin_kec.the_geom) as geometry, kec FROM admin_kec WHERE mbrIntersects(admin_kec.the_geom,  GeomFromText('POLYGON(("+req.query.kiri_lng+" "+req.query.kiri_lat+","+req.query.kiri_lng+" "+req.query.kanan_lat+","+req.query.kanan_lng+" "+req.query.kanan_lat+","+req.query.kanan_lng+" "+req.query.kiri_lat+","+req.query.kiri_lng+" "+req.query.kiri_lat+"))'))", function(err, rows, fields) {
  if (err) throw err;

 //console.log("SELECT asWkt(admin_kec.the_geom) as geometry FROM admin_kec WHERE MBRContains(GeomFromText( 'POLYGON(("+req.query.kiri_lng+" "+req.query.kiri_lat+","+req.query.kiri_lng+" "+req.query.kanan_lat+","+req.query.kanan_lng+" "+req.query.kanan_lat+","+req.query.kanan_lng+" "+req.query.kiri_lat+","+req.query.kiri_lng+" "+req.query.kiri_lat+"))' ),admin_kec.the_geom");

//res.end(JSON.stringify(rows))

  // MySQL query...
//ambil geojson
  dbgeo.parse({
  "data": rows,
  "outputFormat": "topojson",
  "geometryColumn": "geometry",
  "geometryType": "wkt"
},function(error, result) {
  if (error) {
    return console.log(error);
  }
  // This will log a valid GeoJSON object
 // console.log(result)  
  res.send(JSON.stringify(result))
});
});

//connection.end();
})
    app.get('/topojson_kec_by_kab', function(req, res){
  //connection.connect();
  //console.log(req.query)
  connection.query("SELECT asWkb(admin_kec.the_geom) as geometry, kec FROM admin_kec WHERE kode_kab="+req.query.kode_kab, function(err, rows, fields) {
    if (err) throw err;

   //console.log("SELECT asWkt(admin_kec.the_geom) as geometry FROM admin_kec WHERE MBRContains(GeomFromText( 'POLYGON(("+req.query.kiri_lng+" "+req.query.kiri_lat+","+req.query.kiri_lng+" "+req.query.kanan_lat+","+req.query.kanan_lng+" "+req.query.kanan_lat+","+req.query.kanan_lng+" "+req.query.kiri_lat+","+req.query.kiri_lng+" "+req.query.kiri_lat+"))' ),admin_kec.the_geom");

  //res.end(JSON.stringify(rows))

    // MySQL query...
  //ambil geojson
    dbgeo.parse({
    "data": rows,
    "outputFormat": "topojson",
    "geometryColumn": "geometry",
    "geometryType": "wkb"
  },function(error, result) {
    if (error) {
      return console.log(error);
    }
    // This will log a valid GeoJSON object
   // console.log(result)  
    res.send(JSON.stringify(result))
  });
  });

  //connection.end();
  })
<!-- start socketio connection -->

io.sockets.on('connection', function (socket) {	



});