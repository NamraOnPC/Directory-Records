const Sequelize = require('sequelize');

var sequelize = new Sequelize('ddrmvlld1poe7i', 'ahgapvgviarxwk', '2d1488e75413f946e0a6a69974714ced8a9302b7cb2bb4dc4d6ef8be63ac3135', {

    host: 'ec2-50-19-86-139.compute-1.amazonaws.com',

    dialect: 'postgres',

    port: '5432',

    dialectOptions: {

        ssl: true

    }

});


var Employee = sequelize.define('Employee', {
    employeeNum: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    departmentName: Sequelize.STRING
});


module.exports.initialize = function () {

    return new Promise(function (resolve, reject) {

        sequelize.sync().then(function (Employee) {

            console.log('Connection has been established with Employee database!!');

            resolve();

        }).then(function (Department) {

            console.log('Connection has been established with Department database!!');

            resolve();

        }).catch(function (err) {

            reject("unable to sync the database");

        });

    });

};

module.exports.getAllEmployees = () => {

    return new Promise(function (resolve, reject) {

        Employee.findAll()

            .then((data) => {

                resolve(data);

            })

            .catch((err) => {

                reject("no employee returned");

            });

    });

};


module.exports.addEmployee = (employeeData) => {

    employeeData.isManager = (employeeData.isManager) ? true : false;

    return new Promise(function (resolve, reject) {
        for (var foo in employeeData) {
            if (employeeData[foo] == "") {
                employeeData[foo] = null;
            }
        }
        Employee.create({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }).then(function (data) {
            resolve(data);
        })
            .catch(function (err) {
                reject("unable to create employee data-service.js");
            })
    });
};

module.exports.getEmployeesByStatus = (status) =>{

    return new Promise(function (resolve, reject) {

        Employee.findAll({

            where: { status: status }

        })

            .then((data) => {

                resolve(data);

            })

            .catch(() => {

                reject("no employee returned for this status");

            })

    });

};

module.exports.getEmployeesByDepartment = function (department) {

    return new Promise(function (resolve, reject) {

        Employee.findAll({

            where: { department: department }

        })

            .then((data) => {

                resolve(data);

            })

            .catch(() => {

                reject("no employee returned for this department");

            })

    });

};

module.exports.getEmployeesByManager = (managerNum) => {

    return new Promise(function (resolve, reject) {

        Employee.findAll({

            where: { employeeManagerNum: managerNum }

        })

            .then((data) => {

                resolve(data);

            })

            .catch((err) => {

                reject("no employee returned for this manager");

            })

    });

};



module.exports.getManagers = () => {

    var arrayToGetManagers = [];

    return new Promise(function (resolve, reject) {

        if (employees.length == 0) {

            reject("No results employees.length == 0");

        } else {

            for (var w = 0; w < employees.length; w++) {

                if (employees[w].isManager == true) {

                    arrayToGetManagers.push(employees[w]);

                }
            }

            if (arrayToGetManagers.length == 0) {

                reject("No results arrayToGetManagers.length == 0");

            }

        }

        resolve(arrayToGetManagers);

    });
}

module.exports.getEmployeeByNum =  (Num) => {

    return new Promise( (resolve, reject) => {

        Employee.findAll({

            where: { employeeNum: Num }

        })

            .then((data) => {

                resolve(data[0]);

            })

            .catch(() => {

                reject("no employee returned for this employee number");

            })

    });

};

module.exports.updateEmployee = (employeeData) => {

    console.log("inside data-service update" + employeeData.body);

    employeeData.isManager = (employeeData.isManager) ? true : false;

    return new Promise(function (resolve, reject) {
       
        for (var bar in employeeData) {
       
            if (employeeData[bar] == "") {
       
                employeeData[bar] = null;
       
            }
       
        }
       
        Employee.update({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        },
            {
                where: { employeeNum: employeeData.employeeNum }
            }).then(function (data) {
                resolve(data);
            })
            .catch((err) => {
                reject("unable to update employee data-service.js");
            });
    });
};

module.exports.getDepartments = () => {

    return new Promise(function (resolve, reject) {

        Department.findAll()

            .then((data) => {

                resolve(data);

            })

            .catch((err) => {

                reject("no department returned");

            });

    });

};

module.exports.addDepartment = (departmentData) => {
    
    return new Promise(function (resolve, reject) {

        for (var foo in departmentData) {

            if (departmentData[foo] == "") departmentData[foo] = null;

        };

        Department.create({

            departmentId: departmentData.departmentId,

            departmentName: departmentData.departmentName

        })

            .then(() => {

                resolve();

                console.log("successfully created a new department");

            })

            .catch(() => {

                reject("unable to create department data-service.js");

            });

    });

};

module.exports.updateDepartment = (departmentData) => {

    return new Promise(function (resolve, reject) {

        for (var bar in departmentData) {

            if (departmentData[bar] == '') {

                departmentData[bar] = null;

            }

        }

        Department.update({

            departmentId: departmentData.departmentId,

            departmentName: departmentData.departmentName
        },

            {
                where: { departmentId: departmentData.departmentId }

            }).then(function (data) {

                resolve(data);

            })

            .catch(function (err) {

                reject("unable to update department data-service.js");

            });

    });

}

module.exports.deleteEmployeeByNum = function (empNum) {

    return new Promise(function (resolve, reject) {

        Employee.destroy({

            where: { employeeNum: empNum }

        })

            .then(() => {

                resolve();

            })

            .catch(() => {

                reject("error: employee was not deleted");

            })

    })

}

module.exports.getDepartmentById = (Id) => {

    return new Promise(function (resolve, reject) {

        Department.findAll({

            where: { departmentId: Id }

        })

            .then((data) => {

                resolve(data[0]);

            })

            .catch((err) => {

                reject("no department returned for this department id");

            })

    });

};