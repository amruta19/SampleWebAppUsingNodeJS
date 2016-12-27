var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());


/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(

    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : 'root123',
        database : 'test',
        debug    : false //set true if you wanna see debug logger
    },'request')

);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.get('',function(req,res){
    res.send('Welcome');
});

//get all employees
app.get('/api/getAllEmployees', function (req, res){
    req.getConnection(function(err,conn){

        if (err) console.error("Cannot Connect");

        var query = conn.query('SELECT * FROM employee',function(err,rows){

            if(err){
                console.log(err);
                console.error("Mysql error, check your query");
            }
            res.json(rows);
			console.log("Fetched all employees");

         });

    });
});

//search employee
app.get('/api/getEmployeesLike', function (req, res){
	 var emp_name = req.query.empName;
    req.getConnection(function(err,conn){

        if (err) console.error("Cannot Connect");

        var query = conn.query('SELECT * FROM employee where emp_name like ?','%'+[emp_name]+'%',function(err,rows){

            if(err){
                console.log(err);
                console.error("Mysql error, check your query");
            }
            res.json(rows);
			console.log("Fetched all employees");

         });

    });
});


//add employee
app.post('/api/addNewEmployee', function (req, res){
    var data = {
        emp_name:req.body.name,
        emp_email:req.body.email,
        emp_role:req.body.role
    };
    req.getConnection(function(err,conn){

        if (err) console.error("Cannot Connect");

        var query = conn.query('INSERT INTO employee set ?',data,function(err){

            if(err){
                console.log(err);
                console.error("Mysql error, check your query");
            }
			res.sendStatus(200);
			console.log("Employee added");

         });

    });
});

//delete employee
app.delete('/api/deleteEmployee', function (req, res){
	//get id
    var emp_id = req.query.empId;
    req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM employee WHERE emp_id = ? ",[emp_id], function(err, rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
            res.sendStatus(200);
			console.log("Employee deleted");
        });
     });
});

//start Server
var server = app.listen(3000,function(){
   console.log("Listening to port %s",server.address().port);
});
