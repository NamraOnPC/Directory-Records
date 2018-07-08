//Name :- Namra Fanse
//Student Number :- 112219175

var express = require('express');
var { Pool } = require("pg");
var app = express();
var connectionString = "postgres://postgres:Narf@1234@localhost:5432/postgres";

var pool = new Pool({

    connectionString: connectionString

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

app.listen(3000, function () {

    console.log('Server is running.. on Port 3000');

});

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
        user: 'postgres',
        database: 'postgres',
        password: 'Narf@1234',
        port: 5432,
        max: 10, // max number of connection can be open to database
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
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