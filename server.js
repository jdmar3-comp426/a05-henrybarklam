// Define app using express
var express = require("express");
var app = express();
// Require database SCRIPT file
var db = require("./database.js");
// Require md5 MODULE
var md5 = require("md5");

//Require a middleware extension for express
var bodyParser = require("body-parser");

// Make Express use its own built-in body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set server port"id":id, "user": user , "pass": pass
var HTTP_PORT = 5000;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// READ (HTTP method GET) at root endpoint /app/
app.get("/app/", (req, res, next) => {
    res.json({"message":"Your API works! (200)"});
	res.status(200);
	return
});

// Define other CRUD API endpoints using express.js and better-sqlite3
// CREATE a new user (HTTP method POST) at endpoint /app/new/


// READ a list of all users (HTTP method GET) at endpoint /app/users/
app.get("/app/users", (req, res) => {	
	const stmt = db.prepare("SELECT * FROM userinfo").all();
	// res.json({"id":req.body.id, "user": req.body.user , "pass": req.body.pass});
	res.status(200).json(stmt);
	return
});

// READ a single user (HTTP method GET) at endpoint /app/user/:id
app.get("/app/user/:id", (req, res) => {
	const getOne = db.prepare("SELECT * FROM userinfo where id = ?").get(req.params.id);
	// res.json({"message":"OK (200)"});
	res.status(200).json(getOne);
	return getOne
});

//Could be an issue here - if so change back to /app/new/
app.post("/app/new/", (req, res) => {
	const getOne = db.prepare("INSERT INTO userinfo (user,pass) VALUES (?,?)").run(req.body.user, md5(req.body.pass));
	// res.json({"id":req.params.id, "user": user , "pass": pass});
	getOne["pass"] = md5(req.body.pass);
	res.status(201).json({"message": `${getOne["changes"]} record created: ID ${getOne["lastInsertRowid"]} (201)`});
	return
});

// UPDATE a single user (HTTP method PATCH) at endpoint /app/update/user/:id
app.patch("/app/update/user/:id", (req, res) => {
	const getOne = db.prepare("UPDATE userinfo SET user = COALESCE(?,user), pass = COALESCE(?,pass) WHERE id = ?").run(req.body.user, md5(req.body.pass), req.params.id);
	// res.json({"message":"OK (200)"});
	res.status(405).json({"message": `${getOne["changes"]} record updated: ID ${req.params.id} (200)`});
	return
});
// DELETE a single user (HTTP method DELETE) at endpoint /app/delete/user/:id
app.delete("/app/delete/user/:id", (req, res) => {
	const getOne = db.prepare("DELETE FROM userinfo WHERE id = ?").run(req.params.id);
	// res.json({"message":"OK (200)"});
	res.status(405).json({"message": `${getOne["changes"]} record deleted: ID ${req.params.id} (200)`});
	return
});
// Default response for any other request
app.use(function(req, res){
	res.json({"message":"Your API is working"});
    res.status(404);
	return
});
