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

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "selectFunction",
            type: "list",
            message: "What function do you want to perform?",
            choices: ["Check stock levels", "Check low inventory", "Add to Inventory", "Add to Product", "Exit"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.selectFunction === "Check stock levels") {
                checkStock();
            }
            else if (answer.selectFunction === "Check low inventory") {
                checkLowStock();

            } else if (answer.selectFunction === "Add to Inventory") {
                addInventory();
            } else if (answer.selectFunction === "Add to Product") {
                addProduct();
            } else if (answer.selectFunction === "Exit") {
                connection.end();
            } else {
                connection.end();
            }
        });
}

//   check stock levels
function checkStock() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(" | id: " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | price: " + res[i].price + " | qty: " + res[i].stock_quantity);
        }

        start()
    });
}

//   check low stock products
function checkLowStock() {
    connection.query("SELECT * FROM products WHERE stock_quantity < ? ", [10], function (err, res) {
        if (err) throw err;
        if (res.length === 0) {
            console.log("No low inventory products")
        } else {
            for (var i = 0; i < res.length; i++) {
                console.log(" | id: " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | price: " + res[i].price + " | qty: " + res[i].stock_quantity);
            }
        }
        start()
    });
}

//   check stock levels
function addInventory() {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "What stock item ID do you want to update?"
        },
        {
            name: "units",
            type: "input",
            message: "How many units to receive into stock?"
        },
    ]).then(function (answer) {

        connection.query("SELECT * FROM products WHERE item_id = ?", [answer.id], function (err, res) {
            if (err) throw err;

            var revisedQuantity = res[0].stock_quantity + parseInt(answer.units, 0)

            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [revisedQuantity, answer.id],
                function (error) {
                    if (error) throw error;
                    console.log("The new quantity of stock on hand is: " + revisedQuantity);
                });
            start()
        });
    });
}

//   add a new product
function addProduct() {
    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "What is the name of the product?"
        },
        {
            name: "department_name",
            type: "input",
            message: "What department does it belong to?"
        },
        {
            name: "qty",
            type: "input",
            message: "How many items of stock are there on hand?"
        },
        {
            name: "price",
            type: "input",
            message: "What's the sale price of the product?"
        },
    ]).then(function (answer) {
        insertProduct(answer)
    })

}

function insertProduct({ product_name, department_name, price, qty }) {
   // var { product_name, department_name, price, qty } = answer;
    var sqlQry = `INSERT INTO ??
                (product_name, department_name, price, stock_quantity)
                values (?,?,?,?)`;
    var data = ["products", product_name, department_name, price, qty];

    connection.query(sqlQry, data, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    })

    // connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
    //     [answer.product_name, answer.department_name, answer.price, answer.qty], function (err, result) {
    //         if (err) throw err;
    //         console.log("1 record inserted");
    //     });
    start()
}
