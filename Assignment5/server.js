/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students.
*
* Name: Namra Rupesh Fanse Student ID: 112219175 Date: 25/7/2018
*
* Online (Heroku) Link: https://assignment5web322.herokuapp.com/
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



app.use(express.static(path.join(__dirname + 'public')));

app.use(bodyParser.urlencoded({ extended: true }))

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

app.get("/employees/add", (req, res, Departments) => {

    dataService.getDepartments()

        .then((data) => {

            res.render("addEmployee", { Departments: data });

        })

        .catch(() => {

            res.render("addEmployee", { Departments: [] })

        });

});

app.post("/employees/add", (req, res) => {

    dataService.addEmployee(req.body)

        .then(() => {

            res.redirect("/employees");

        })

        .catch(() => {

            console.log("unable to add employee");

        });

});

app.post("/employee/update",(req, res) => {

    console.log(req.body)

    dataService.updateEmployee(req.body).then(() => {

        res.redirect("/employees");

    });

});

const storage = multer.diskStorage({

    destination: "./public/images/uploaded",

    filename: function (req, file, cb) {

        cb(null, Date.now() + path.extname(file.originalname));

    }

});

const upload = multer({ storage: storage });

app.get("/images/add", function (req, res) {

    res.render("addImage");

});

app.post("/images/add", upload.single('imageFile'), (req, res) => {

    res.redirect("/images");

});


app.get("/images", (req, res) => {

    fs.readdir("./public/images/uploaded", function (err, imageFile) {

        res.render("images", { images: imageFile });

    })

});


app.get("/employees", function (req, res) {

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

app.get("/employee/:num", (req, res, data) => {
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


app.get("/employees/delete/:empNum", (req, res) => {

    var empNum = req.params.empNum;

    dataService.deleteEmployeeByNum(empNum)

        .then(() => {

            res.redirect("/employees");

        })

        .catch(() => {

            res.status(500).send("Unable to Remove Employee / Employee not found)");

        })

});

app.get("/department/:departmentId", (req, res) => {

    var departmentId = req.params.departmentId;

    dataService.getDepartmentById(departmentId)

        .then((data) => {

            res.render("department", { department: data });

        })

        .catch(() => {

            res.status(404).send("Department not found for this id");

        });

})


app.get("/departments", function (req, res) {

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

app.get("/departments/add", function (req, res) {

    res.render('addDepartment');

});

app.post("/departments/add", (req, res) => {

    dataService.addDepartment(req.body)

        .then(() => {

            res.redirect("/departments");

        })

        .catch((err) => {

            res.status(500).send("unable to add department server.js");

        });

});

app.post("/department/update", (req, res) => {

    dataService.updateDepartment(req.body).then(() => {

        res.redirect('/departments');

    }).catch((err) => {

        res.status(500).send("unable to update employee server.js inside department/update function");

    });

});



app.use(function (req, res) {

    res.status(404).send("Page Not Found.");

});

dataService.initialize().then(() => {

    app.listen(HTTP_PORT, onHttpStart);

}).catch((err) => {

    console.log("Not able to connect to the server");

});

onHttpStart = () => {

    console.log("Express http server listening on: " + HTTP_PORT);

}
