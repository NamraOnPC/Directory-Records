/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Namra Rupesh Fanse Student ID: 112219175 Date: 30/5/2018
*
* Online (Heroku) Link: https://afternoon-shelf-31089.herokuapp.com/
*
********************************************************************************/ 


var express = require('express');
var app = express();
var path = require('path');
var dataService = require('./data-service.js');

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get("/", function(req,res){

    res.sendFile(path.join(__dirname + "/views/home.html"));

});

app.get("/home", function(req,res){

    res.sendFile(path.join(__dirname + "/views/home.html"));

});

app.get("/about", function(req,res){

    res.sendFile(path.join(__dirname + '/views/about.html'));
        
});

app.get("/employees", function(req, res) {

    dataService.getAllEmployees().then(function(data) {

        res.json(data);

    }).catch(function(err) {

        res.json({ message: err });

    });

});

app.get("/managers", function(req, res) {
    
    dataService.getManagers().then(function(data) {
    
        res.json(data);

    }).catch(function(err) {
     
        res.json({ message: err });
  
    });

});

app.get("/departments", function(req, res) {
    
    dataService.getDepartments().then(function(data) {
    
        res.json(data);

    }).catch(function(err) {

        res.json({ message: err });

    });

});

app.use(function(req, res) {
    
    res.status(404).send("Page Not Found.");

});

dataService.initialize() .then(() => {

    app.listen(HTTP_PORT, onHttpStart);

}).catch((err) =>{

    console.log("Not able to connect to the server");

});

 onHttpStart = () => {

    console.log("Express http server listening on: " + HTTP_PORT);

}

