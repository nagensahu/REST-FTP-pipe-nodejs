var http = require("http");
var fs = require("fs");
var url = require("url");
var formidable = require("formidable");
var client = require("ftp");
var express = require("express");
var app = express();
//var fileUp = require("express-fileupload");

//mount fileupload middleware. was causing probs with formidable. so commented
//app.use(fileUp());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//set the port to 8080 or let heroku set it by env
var port = process.env.PORT || 8080;

var config = {
	host : "test",
	user: "test",
	password: "test"
};

app.get('/upload.html', function(req,res){
	console.log("req: "+req);
	console.log("res: "+res);
	res.sendFile(__dirname+"/"+"upload.html");
});

app.post('/fileupload', function(req,res){
	console.log("req: "+req);
	console.log("res: "+res);

	console.log("going to formidable");
	var form  = new formidable.IncomingForm();

	// Parse the form and get the damn file
	form.parse(req,function(err,fields,files){
		console.log("Files: "+files.filetoupload.name);
		
		var oldpath = files.filetoupload.path;
		console.log("old path: "+oldpath);
		//var newpath = __dirname+"/"+files.filetoupload.name;
		//console.log("newpath: "+newpath);

		//Put file in FTP
		var c = new client();
		var putFile = function(){
			c.put(files.filetoupload.path,files.filetoupload.name,function(err){
				if(err) throw err;
				c.end();
			});
		};
		c.on("ready",putFile);
		c.connect(config);
		res.writeHead(200,{"Content-Type":"text/html"});
		res.write("<h1>File Uploaded</h1><a href=\"./upload.html\">Go To Upload</a>");
		res.end();
	});
});

app.post('/uploadapi',function(req,res){
	//console.log("file name is: "+req.files.filetoupload.name);
	/*var c = new client();
	var putFile = function(){
		c.put(req.files.filetoupload.name,req.files.filetoupload.name,function(err){
			if(err) throw err;
			c.end();
		});
	};
	c.on("ready",putFile);
	c.connect(config);*/

	console.log("going to formidable");
	var form  = new formidable.IncomingForm();

	// Parse the form and get the damn file
	form.parse(req,function(err,fields,files){
		console.log("Files: "+files.filetoupload.name);
		
		var oldpath = files.filetoupload.path;
		console.log("old path: "+oldpath);
		//var newpath = __dirname+"/"+files.filetoupload.name;
		//console.log("newpath: "+newpath);

		//Put file in FTP
		var c = new client();
		var putFile = function(){
			c.put(files.filetoupload.path,files.filetoupload.name,function(err){
				if(err) throw err;
				c.end();
			});
		};
		c.on("ready",putFile);
		c.connect(config);

		res.json({status : 'success'});
		res.end();
	});
});

var server = app.listen(port,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("Listening at :"+host+" "+port);
});

/*var httpcallb = function(request,response){
	var urlobj = url.parse(request.url,true);
	console.log(urlobj);
	console.log(urlobj.pathname);
	if(urlobj.pathname=="/fileupload"){
		console.log("going to formidable");
		var form  = new formidable.IncomingForm();

		// Parse the form and get the damn file
		form.parse(request,function(err,fields,files){
			console.log("Files: "+files.filetoupload.path);
			
			var oldpath = files.filetoupload.path;
			console.log("old path: "+oldpath);
			//var newpath = __dirname+"/"+files.filetoupload.name;
			//console.log("newpath: "+newpath);

			//Put file in FTP
			var c = new client();
				var putFile = function(){
					c.put(files.filetoupload.name,files.filetoupload.name,function(err){
						if(err) throw err;
						c.end();
					});
				};
				c.on("ready",putFile);
				c.connect(config);
				response.writeHead(200,{"Content-Type":"text/html"});
				response.write("<h1>File Uploaded</h1><a href=\"./upload.html\">Go To Upload</a>");
				response.end();
		});

	}else{
		// If its not a request for file upload, give them a page
		var filename = "."+urlobj.pathname;
		fs.readFile(filename,function(error,data){
			if(error){
				// if there's an error, return an error page
				console.log("errors: "+error);
				response.writeHead(404,{"Content-Type":"text/html"});
				response.write("Page not Found !!!");
				return response.end();
			}
			// if the page was found, return the page, write the page html from the data variable
			response.writeHead(200,{"Content-Type":"text/html"});
			response.write(data);
			response.end();
		});
	}
};

//start the server
http.createServer(httpcallb).listen(port);*/

console.log("Program Ended");