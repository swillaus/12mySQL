// inquirer to list set of options

var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",
    
    // Your password
    password: process.env.password,
    database: process.env.database

});


// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log( " | id: "  + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | price: " + res[i].price + " | qty: " + res[i].stock_quantity);
        }
        // run the purchase function
        purchase()
    });
}


function purchase() {

    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "What is the ID of the product you want to buy?"
        },
        {
            name: "units",
            type: "input",
            message: "How many units?"
        },
    ]).then(function (answer) {

        connection.query("SELECT * FROM products WHERE item_id = ?", [answer.id], function (err, res) {
            if (err) throw err;
            if (answer.units > res[0].stock_quantity) {
                console.log("Insufficient quantity!")
            } else {
                var revisedQuantity = res[0].stock_quantity - answer.units
                connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [revisedQuantity, answer.id],
                    function (error) {
                        if (error) throw error;
                        console.log("The new quantity of stock on hand is: " + revisedQuantity);
                        console.log("The cost of your order is $" + (res[0].price * answer.units));
                    }
                );
            }
            connection.end();
        });
    });
}



