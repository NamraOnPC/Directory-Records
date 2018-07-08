//Name :- Namra Fanse
//Student Number :- 112219175
// App URL :- https://practicaltest3web322heroku.herokuapp.com/
var express = require('express');
var { Pool } = require("pg");
var app = express();

var pool = new Pool({

   user: 'tfdfwujflprcgg',
   password: '5a3b654c0fc9806247fd5b51dc4151d4d8f77e3b81bd18fed112577c8b283918',
   database: 'dfblkqc2j024ek',
   port: 5432,
   host: 'ec2-184-73-199-189.compute-1.amazonaws.com',
   ssl: true

});

app.get('/', function (req, res, next) {

    pool.connect((err, client, done) => {

        if (err) {

            console.log("not able to get connection " + err);

            res.status(400).send(err);

        }


        client.query('SELECT * FROM Employee WHERE empid= $1', [1], (err, result) => {

            done(); // closing the connection;

            if (err) {

                console.log(err);

                res.status(400).send(err);

            }

            res.status(200).send(result.rows);

        });


    });
});

app.listen(process.env.PORT || 3000 )


app.get('/sp', function (req, res, next) {

    pool.connect((err, client, done) => {

        if (err) {

            console.log("not able to get connection " + err);

            res.status(400).send(err);

        }

        client.query('SELECT * from GetAllEmployee()', (err, result) => {

            done(); // closing the connection;

            if (err) {

                console.log(err);

                res.status(400).send(err);

            }

            res.status(200).send(result.rows);

        });

    });

});

app.get('/pool', function (req, res) {

    var config = {
        user: 'tfdfwujflprcgg',
        database: 'dfblkqc2j024ek',
        password: '5a3b654c0fc9806247fd5b51dc4151d4d8f77e3b81bd18fed112577c8b283918',
        port: 5432,
        max: 10, // max number of connection can be open to database
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
        host: 'ec2-184-73-199-189.compute-1.amazonaws.com',
        ssl: true
     
    };

    var pool = new Pool(config);

    pool.connect((err, client, done) => {
       
        if (err) {
       
            console.log("not able to get connection " + err);
       
            res.status(400).send(err);
       
        }
       
        client.query('SELECT * from GetAllEmployee()', (err, result) => {
       
            //call `done()` to release the client back to the pool
       
            done();
       
            if (err) {
       
                console.log(err);
       
                res.status(400).send(err);
       
            }
       
            res.status(200).send(result.rows);
    
        });
    
    });
});