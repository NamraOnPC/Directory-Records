const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const dataService = require('./data-service.js');
const fs = require('fs');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

app.engine('.hbs', exphbs({ 
    
    extname: '.hbs',
    
    defaultLayout: "main",
    
    helpers: { 
    
        navLink: function(url, options){
    
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
    
        equal: function (lvalue, rvalue, options) {
    
            if (arguments.length < 3)
    
            throw new Error("Handlebars Helper equal needs 2 parameters");
    
            if (lvalue != rvalue) {
    
                return options.inverse(this);
    
            } else {
    
                return options.fn(this);
    
            }
        }
    } 
}));




app.use(function(req,res,next){
   
    let route = req.baseUrl + req.path;
   
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
   
    next();

});



app.use(express.static(path.join(__dirname + 'public')));

app.use(bodyParser.urlencoded({extended: true}))

var HTTP_PORT = process.env.PORT || 8080;

app.set('view engine', '.hbs');

app.get("/", function(req,res){

    res.render('home');

});


app.get("/home", function(req,res){

    res.render('home');

});

app.get("/about", function(req,res){

    res.render("about");
        
});

app.get("/employees/add", function(req,res){

    res.render("addEmployee");
        
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

app.post("/employee/update", function(req, res){
  
    dataService.updateEmployee(req.body).then(()=>{
  
        res.redirect("/employees");
  
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
   
    res.render("addImage");

});

app.post("/images/add", upload.single('imageFile'), (req, res) => {
   
    res.redirect("/images");

});


app.get("/images", (req, res) => {
  
    fs.readdir("./public/images/uploaded", function(err, imageFile){
  
        res.render("images",{images:imageFile});
  
    })

});


app.get("/employees", function(req, res) {

    if(req.query.status){
        
        dataService.getEmployeeByStatus(req.query.status).then(function(data){
        
            res.render("employees", {employees:data});
        
        }).catch(function(err){
        
            res.render("employees",{ message: "no results" });
        
        });
      
    }else if(req.query.department){
       
        dataService.getEmployeesByDepartment(req.query.department).then(function(data){
       
            res.render("employees", {employees:data});
       
        }).catch(function(err){
       
            res.render("employees",{ message: "no results" });
       
        });
      
    }else if(req.query.manager){
        
        dataService.getEmployeesByManager(req.query.manager).then(function(data){
         
            res.render("employees", {employees:data});
        
        }).catch(function(err){
        
            res.render("employees",{ message: "no results" });
        
        });
      
    }else{
        
        dataService.getAllEmployees().then(function(data){
        
            res.render("employees", {employees:data});
        
        }).catch(function(err){
        
            res.render("employees",{ message: "no results" });
       
        });
      
    }

});

app.get("/employee/:empNum", function(req, res) {
   
    dataService.getEmployeeByNum(req.params.empNum).then((dataService) => {
   
        res.render("employee", {employee: dataService});
   
    }).catch((err) => {
   
        res.render("employee",{message:"no results"});
   
    });

});
/*
app.get("/managers", function(req, res) {
    
    dataService.getManagers().then(function(data) {
    
        res.json(data);

    }).catch(function(err) {
     
        res.json({ message: err });
  
    });

});
*/

app.get("/departments", function(req, res) {
    
    dataService.getDepartments().then(function(data) {
    
        res.render("departments",{departments:data});

    }).catch(function(err) {

        res.render("departments",{ message: "no results" });

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

