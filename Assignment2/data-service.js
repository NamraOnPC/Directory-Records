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
    
            reject("No results returned!");
    
        }
    
        resolve(arrayOfAllEmployees);
    })

}

module.exports.getManagers = () => {
    
    var arrayToGetManagers = [];
    
    return new Promise(function(resolve,reject){
    
        if(employees.length == 0){
    
            reject("No results returned!");
    
        }else{
    
            for (var w = 0; w < employees.length; w++) {
    
            if (employees[w].isManager == true) {
    
                arrayToGetManagers.push(employees[w]);       
                
                }
            }
            
            if (arrayToGetManagers.length == 0) {
              
                reject("No results returned !");
             
            }
        
        }
        
        resolve(arrayToGetManagers);
     
    });
}

module.exports.getDepartments = () => {
  
    var arrayToGetDepartments = [];
    
    return new Promise(function(resolve,reject){
    
        if(employees.length == 0){
    
            reject("No results returned!");
    
        }else{
    
            for (var v = 0; v < departments.length; v++) {
    
                arrayToGetDepartments.push(departments[v]);       
    
            }
    
            if (arrayToGetDepartments.length == 0) {
    
                reject("No results returned!");
            }
    
        }
    
        resolve(arrayToGetDepartments);
    
    });
}