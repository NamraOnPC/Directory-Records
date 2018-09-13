/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students.
*
* Name: Namra Rupesh Fanse Student ID: 112219175 Date: 11/8/2018
*
* Online (Heroku) Link: https://assignment6web322app.herokuapp.com/
*
********************************************************************************/ 
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const dataService = require('./data-service.js');
const fs = require('fs');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const dataServiceAuth = require('./data-service-auth');
const clientSessions = require('client-sessions');

app.engine('.hbs', exphbs({

    extname: '.hbs',

    defaultLayout: "main",

    helpers: {

        navLink: function (url, options) {

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




app.use(function (req, res, next) {

    let route = req.baseUrl + req.path;

    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");

    next();

});



app.use(express.static('public'));

// set up client-sessions
app.use(clientSessions({
   
    cookieName: "session", // this is the object name that will be added to 'req'
   
    secret: "web322_assignment6",
   
    duration: 2 * 60 * 1000, // duration of the session in milliseconds(2min)
   
    activeDuration: 1000 * 60 // the session will be extended by this may ms each request

}));


app.use(bodyParser.urlencoded({ extended: true }))

app.use((req,res,next) => {

    res.locals.session = req.session;

    next();

});

let ensureLogin = (req, res, next) => {
  
    if(!req.session.user){
  
        res.redirect("/login");
  
    } else {
  
        next();
  
    }

};

var HTTP_PORT = process.env.PORT || 8080;

app.set('view engine', '.hbs');

app.get("/", function (req, res) {

    res.render('home');

});


app.get("/home", function (req, res) {

    res.render('home');

});

app.get("/about", function (req, res) {

    res.render("about");

});

app.get('/login', (req, res) => {
   
    res.render('login');

});

app.post('/login', (req, res) => {
    
    req.body.userAgent = req.get('User-Agent');

    dataServiceAuth.checkUser(req.body)
    
    .then((user) => {
    
        req.session.user = {
    
            userName: user.userName,
    
            email: user.email,
    
            loginHistory: user.loginHistory
    
        }

        res.redirect('/employees');

    }).catch((err) => {
    
        res.render('login', {errorMessage: err, userName: req.body.userName});
    
    });

});

app.get('/register', (req, res) => {
    
    res.render('register');

});

app.post('/register', (req, res) => {
    
    dataServiceAuth.registerUser(req.body)
    
    .then((value) => {
    
        res.render('register', {successMessage: "User created"});
    
    }).catch((err) => {
    
        res.render('register', {errorMessage: err, userName: req.body.userName});
    
    })

});

app.get('/logout', (req, res) => {
    
    req.session.reset();
    
    res.redirect('/');

});

app.get('/userHistory', ensureLogin, (req, res) => {
  
    res.render('userHistory');

})

app.get("/employees/add", ensureLogin ,(req, res, Departments) => {

    dataService.getDepartments()

        .then((data) => {

            res.render("addEmployee", { Departments: data });

        })

        .catch(() => {

            res.render("addEmployee", { Departments: [] })

        });

});

app.post("/employees/add", ensureLogin ,(req, res) => {

    dataService.addEmployee(req.body)

        .then(() => {

            res.redirect("/employees");

        })

        .catch(() => {

            console.log("unable to add employee");

        });

});

app.post("/employee/update",ensureLogin ,(req, res) => {

    console.log(req.body)

    dataService.updateEmployee(req.body).then(() => {

        res.redirect("/employees");

    });

});

const storage = multer.diskStorage({

    destination: path.join(__dirname, "/public/images"),

    filename: function (req, file, cb) {

        cb(null, Date.now() + path.extname(file.originalname));

    }

});

const upload = multer({ storage: storage });

app.get("/images/add", ensureLogin ,(req, res) => {

    res.render("addImage");

});


app.post("/images/add", ensureLogin, upload.single("imageFile"), (req, res) => {

    res.redirect("/images");

});
  
app.get('/images', ensureLogin, (req, res) => {

    fs.readdir( path.join(__dirname , "/public/images"), function (err, data) {
            console.log(data);
        res.render('images', { images: data });
    });

});

app.get("/employees", ensureLogin, function (req, res) {

    if (req.query.status) {

        dataService.getEmployeesByStatus(req.query.status).then((data) => {

            if (data.length > 0) res.render("employees", { employees: data });

            else res.render("employees", { message: "no results" });

        }).catch(function (err) {

            res.render("employees", { message: "no results" });

        });

    } else if (req.query.department) {

        dataService.getEmployeesByDepartment(req.query.department).then(function (data) {

            if (data.length > 0) res.render("employees", { employees: data });

            else res.render("employees", { message: "no results" });

        }).catch(function (err) {

            res.render("employees", { message: "no results" });

        });

    } else if (req.query.manager) {

        dataService.getEmployeesByManager(req.query.manager).then(function (data) {

            if (data.length > 0) res.render("employees", { employees: data });

            else res.render("employees", { message: "no results" });

        }).catch(function (err) {

            res.render("employees", { message: "no results" });

        });

    } else {

        dataService.getAllEmployees().then(function (data) {

            res.render("employees", { employees: data });

        }).catch(function (err) {

            res.render("employees", { message: "no results" });

        });

    }

});

app.get("/employee/:num",  ensureLogin, (req, res, data) => {
    // initialize an empty object to store the values
    let viewData = {};
    var num = req.params.num;
    dataService.getEmployeeByNum(num)
        .then((data) => {
            if (data) {
                viewData.employee = data; //store employee data in the "viewData" object as "employee"
            }
            else {
                viewData.employee = null; // set employee to null if none were returned
            }
        })
        .catch(() => {
            viewData.employee = null; // set employee to null if there was an error 
        })
        .then(dataService.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"

            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching 
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        })
        .catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        })
        .then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            }
            else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        })
        .catch(() => {
            res.status(500).send("Unable to get Employee");
        })
});


app.get("/employees/delete/:empNum", ensureLogin, (req, res) => {

    var empNum = req.params.empNum;

    dataService.deleteEmployeeByNum(empNum)

        .then(() => {

            res.redirect("/employees");

        })

        .catch(() => {

            res.status(500).send("Unable to Remove Employee / Employee not found)");

        })

});

app.get("/department/:departmentId", ensureLogin, (req, res) => {

    var departmentId = req.params.departmentId;

    dataService.getDepartmentById(departmentId)

        .then((data) => {

            res.render("department", { department: data });

        })

        .catch(() => {

            res.status(404).send("Department not found for this id");

        });

})


app.get("/departments", ensureLogin, function (req, res) {

    dataService.getDepartments().then(function (data) {

        if (data.length > 0) {
            res.render("departments", { departments: data });
        }

        else {
            res.render("departments", { message: "no results" });
        }

    }).catch(function (err) {

        res.render("departments", { message: "no results" });

    });

});

app.get("/departments/add", ensureLogin, function (req, res) {

    res.render('addDepartment');

});

app.post("/departments/add", ensureLogin, (req, res) => {

    dataService.addDepartment(req.body)

        .then(() => {

            res.redirect("/departments");

        })

        .catch((err) => {

            res.status(500).send("unable to add department server.js");

        });

});

app.post("/department/update", ensureLogin, (req, res) => {

    dataService.updateDepartment(req.body).then(() => {

        res.redirect('/departments');

    }).catch((err) => {

        res.status(500).send("unable to update employee server.js inside department/update function");

    });

});



app.use(function (req, res) {

    res.status(404).send("Page Not Found.");

});

dataService.initialize()

.then(dataServiceAuth.initialize)

.then(() => {

    app.listen(HTTP_PORT, onHttpStart);

}).catch((err) => {

    console.log("Not able to connect to the server");

});

onHttpStart = () => {

    console.log("Express http server listening on: " + HTTP_PORT);

}
