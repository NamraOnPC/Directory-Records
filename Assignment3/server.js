/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Namra Rupesh Fanse Student ID: 112219175 Date: 20/6/2018
*
* Online (Heroku) Link: https://quiet-atoll-14947.herokuapp.com/ 
*
********************************************************************************/ 


const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const dataService = require('./data-service.js');
const fs = require('fs');
const bodyParser = require('body-parser');


app.use(express.static(path.join(__dirname + 'public')));

app.use(bodyParser.urlencoded({extended: true}))

var HTTP_PORT = process.env.PORT || 8080;

app.get("/", function(req,res){

    res.sendFile(path.join(__dirname + "/views/home.html"));

});

app.get("/home", function(req,res){

    res.sendFile(path.join(__dirname + "/views/home.html"));

});

app.get("/about", function(req,res){

    res.sendFile(path.join(__dirname + '/views/about.html'));
        
});

app.get("/employees/add", function(req,res){

    res.sendFile(path.join(__dirname + '/views/addEmployee.html'));
        
});

app.post("/employees/add", (req, res) => {
    
    dataService.addEmployee(req.body) 
    
    .then(()=>{
    
        res.redirect("/employees");
    
    })
    
    .catch(()=>{
    
        console.log("unable to add employee");
    
    });

});

const storage = multer.diskStorage({

    destination: "./public/images/uploaded",
   
    filename: function(req, file , cb){
        
        cb(null, Date.now() + path.extname(file.originalname));
   
    }

});

const upload = multer({storage : storage});

app.get("/images/add", function(req,res){
   
    res.sendFile(path.join(__dirname + "/views/addImage.html"));

});

app.post("/images/add", upload.single('imageFile'), (req, res) => {
   
    res.redirect("/images");

});


app.get("/images", (req, res) => {
  
    fs.readdir("./public/images/uploaded", function(err, imageFile){
  
    res.json({"images" : imageFile});
  
    })

});


app.get("/employees", function(req, res) {

    if(req.query.status){
        
        dataService.getEmployeeByStatus(req.query.status).then(function(data){
        
            res.json(data);
        
        }).catch(function(err){
        
            res.json({message: err});
        
        });
      
    }else if(req.query.department){
       
        dataService.getEmployeesByDepartment(req.query.department).then(function(data){
       
            res.json(data);
       
        }).catch(function(err){
       
            res.json({message: err});
       
        });
      
    }else if(req.query.manager){
        
        dataService.getEmployeesByManager(req.query.manager).then(function(data){
         
            res.json(data);
        
        }).catch(function(err){
        
            res.json({message: err});
        
        });
      
    }else{
        
        dataService.getAllEmployees().then(function(data){
        
            res.json(data);
        
        }).catch(function(err){
        
            res.json({message: err});
       
        });
      
    }

});

app.get("/employees/value" , (req,res) => {

    dataService.getEmployeesByNum(req.params.value)
        
    .then((employeeById) => {
    
        res.render("employee", {data: employeeById, title: "Employee By Number" });
    
    })
    
    .catch((err) => {
    
        res.status(404).send("No Employee Found");
    
    })       

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

