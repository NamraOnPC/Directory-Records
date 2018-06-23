var fs = require("fs");
var employees = []; 
var departments = [];

module.exports.initialize = () => {
    
    return new Promise(function(resolve,reject){
    
        try{
    
            fs.readFile('./data/employees.json', function(err, data){
    
                if(err) throw err;
    
                employees = JSON.parse(data);
    
            });
    
            fs.readFile('./data/departments.json', function(err,data){
    
                if(err) throw err;
    
                departments = JSON.parse(data);
    
            });
    
        }catch(exception){
    
            reject("Unable to read file!");
    
        }
    
        resolve("Successfully read the file!");
    
    });

}

module.exports.getAllEmployees = () => {
    
    var arrayOfAllEmployees=[];
    
    return new Promise(function(resolve,reject){
    
        for (var i = 0; i < employees.length; i++) {
    
            arrayOfAllEmployees.push(employees[i]);
    
        }
    
        if (arrayOfAllEmployees.length == 0){
    
            reject("No results returned! arrayOfAllEmployees.length == 0");
    
        }
    
        resolve(arrayOfAllEmployees);
    })

}

module.exports.addEmployee = function(employeeData) {

    return new Promise(function(resolve,reject){

        if(!employeeData.isManager){

            employeeData.isManager = false;

        }
        
        employeeData.employeeNum = employees.length + 1;

        if(employees.length == 0){

            reject("No results returned employees.length == 0")

        }else{

            employees.push(employeeData);

            resolve(employees);

        }
    })

}

exports.getEmployeeByStatus = function(status){
    
    var arrayForStatus = [];
    
    return new Promise((resolve, reject) => {
        
        for (var i = 0; i < employees.length; i++) {
            
            if (employees[i].status == status) {
            
                arrayForStatus.push(employees[i]);
            }
        }
        if (arrayForStatus.length == 0) {
        
            reject("No Result Returned arrayForStatus.length == 0");
        }
        
        resolve(arrayForStatus);
   
    });

}

exports.getEmployeesByDepartment = function(department){
    
    var arrayToGetByDepartment = [];
   
    return new Promise((resolve, reject) => {
        
        for (var i = 0; i < employees.length; i++) {
            
            if (employees[i].department == department) {
               
                arrayToGetByDepartment.push(employees[i]);
            
            }
        
        }
        
        if (arrayToGetByDepartment.length == 0) {
        
            reject("No Result Returned arrayToGetByDepartment.length == 0");
        
        }
        
        resolve(arrayToGetByDepartment);
    
    });

}

exports.getEmployeesByManager = function(manager){
    
    var arrayToGetManager = [];

    return new Promise((resolve, reject) => {
        
        for (var i = 0; i < employees.length; i++) {
            
            if (employees[i].employeeManagerNum == manager) {
                
                arrayToGetManager.push(employees[i]);
           
            }
        
        }
        
        if (arrayToGetManager.length == 0) {
            
            reject("No Result arrayToGetManager == 0");
        
        }
        
        resolve(arrayToGetManager);
    
    });
}


module.exports.getManagers = () => {
    
    var arrayToGetManagers = [];
    
    return new Promise(function(resolve,reject){
    
        if(employees.length == 0){
    
            reject("No results employees.length == 0");
    
        }else{
    
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

exports.getEmployeeByNum = function(num){
    
    return new Promise((resolve, reject) => {
        
        for (let i = 0;i < employees.length; i++) {
           
            if (employees[i].employeeNum == num) {
              
                resolve(employees[i]);
            
            }
        
        }
        
        reject("No Result");
   
    });

}

module.exports.getDepartments = () => {
  
    var arrayToGetDepartments = [];
    
    return new Promise(function(resolve,reject){
    
        if(employees.length == 0){
    
            reject("No results returned! employees.length == 0");
    
        }else{
    
            for (var v = 0; v < departments.length; v++) {
    
                arrayToGetDepartments.push(departments[v]);       
    
            }
    
            if (arrayToGetDepartments.length == 0) {
    
                reject("No results returned! arrayToGetDepartments.length == 0");
            }
    
        }
    
        resolve(arrayToGetDepartments);
    
    });
}