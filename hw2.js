//Download nodejs(https://nodejs.org/en/download)
//Run following command to install libraries: npm install express pg
//Alter ./creds.json with your local psql credentials
//Start server using command: node hw2.js
//Open browser and go to http://localhost:3000/;

const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;
const path = require('path'); // Import the 'path' module
const fs = require('fs'); // Import the 'fs' module

const creds = require('./creds.json');
const pool = new Pool(creds);

app.get('/', async (req, res) => {
    const foodId = req.query.foodId;
    const customerId = req.query.customerId;

    if (foodId && customerId) {
        try {
            await pool.query('BEGIN');
            const foodData = await pool.query('SELECT * FROM food_list WHERE food_id = $1', [foodId]);
            const customer_account = await pool.query('SELECT * FROM account_info WHERE customer_id = $1', [customerId]);

            if (foodData.rows.length > 0) {
                const food = foodData.rows[0];
                const bank = customer_account.rows[0];
                const transactionDate = new Date().toJSON().slice(0, 10); // Get the current date (YYYY-MM-DD)

                if (bank.account_balance > food.price) {
                    // Add transaction
                    const queryResult = await pool.query('INSERT INTO transactions (customer_id, food_id, transaction_date) VALUES ($1, $2, $3) RETURNING t_id', [customerId, food.food_id, transactionDate]);
                    
                    if (queryResult.rows.length > 0) {
                        const t_id = queryResult.rows[0].t_id;
                        await pool.query('UPDATE account_info SET account_balance = account_balance - $1 WHERE customer_id = $2', [food.price, customerId]);
                        await pool.query('COMMIT');
                    } else {
                        await pool.query('ROLLBACK');
                        return res.status(500).send("Failed to retrieve transaction ID.");
                    }
                    // Redirect to prevent form resubmission on refresh
                    return res.redirect('/transactionspage');
                } else {
                    return res.status(500).send("Account balance is too low.");
                }
            } else {
                await pool.query('ROLLBACK');
                return res.status(404).send("Food not found.");
            }
        } catch (error) {
            await pool.query('ROLLBACK');
            return res.status(500).send("Transaction error: " + error.message);
        }
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Transactions</title>
        </head>
        <body>
        <div>
        <form action ="init_tables" method=GET">
            <h3> Initialize Tables: </h3>
            <button type="submit" onclick="return confirm('Are you sure you want to initialize tables? Doing so may clear currently existing tables.')">Initialize Tables</button>
            <p> Note: This will initialize the tables in the database.</p>
        </form>
        <form action="/" method="GET">
            <h3> Make a Transaction: </h3>
            <label for="customerId">Enter Customer ID:</label>
            <input type="number" name="customerId" id="customerId" required>
            <label for="foodId">Enter Food ID:</label>
            <input type="number" name="foodId" id="foodId" required>
            <button type="submit" >Buy Food</button>
            <p> Note: Check the Customers Page for Customer IDs and the Food List page for Food IDs.</p>
        </form>
        <div>
            <a href="/food_list"> <button> Food List </button> </a>
            <br>
            <br>
            <a href="/customer"> <button> Customers </button> </a>
            <br>
            <br>
            <a href="/transactionspage"> <button> Transactions </button> </a>
        </body>
        </html>
    `);
});

app.get('/init_tables', async (req, res) => {
    const client = await pool.connect();

    try {
        // Begin a transaction
        await client.query('BEGIN');

        // Read the SQL script from the db.sql file
        const sqlFilePath = path.join(__dirname, 'db.sql');
        const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

        // Execute the SQL script to initialize tables
        await client.query(sqlScript);

        // Commit the transaction if everything is successful
        await client.query('COMMIT');

        // Release the client connection
        client.release();

        // Optionally, you can provide a success message or redirect to another page.
        return res.status(200).send("Tables initialized successfully.");
    } catch (error) {
        // Roll back the transaction in case of an error
        await client.query('ROLLBACK');

        // Release the client connection
        client.release();

        return res.status(500).send("Table initialization failed: " + error.message);
    }
});

app.get('/food_list', async (req, res) => {

    let food_listHtml = '';
    let food_listHtml2 = '';
    let food_listHtml3 = '';
    let food_listHtml4 = '';

    try {
        const result = await pool.query(`SELECT * FROM food_list WHERE food_id >= 100 AND food_id < 200 ORDER BY food_id`);
        if (result.rows.length > 0) {
            food_listHtml = result.rows.map(row => {
                return `<p>FoodID: ${row.food_id}, Food: ${row.food_name}, Price: ${'$' + row.price} </p>`;
            }).join('');
        }

        const result2 = await pool.query(`SELECT * FROM food_list WHERE food_id >= 200 AND food_id < 300 ORDER BY food_id`);
        if (result2.rows.length > 0) {
            food_listHtml2 = result2.rows.map(row => {
                return `<p>FoodID: ${row.food_id}, Food: ${row.food_name}, Price: ${'$' + row.price} </p>`;
            }).join('');
        }

        const result3 = await pool.query(`SELECT * FROM food_list WHERE food_id >= 300 AND food_id < 400 ORDER BY food_id`);
        if (result3.rows.length > 0) {
            food_listHtml3 = result3.rows.map(row => {
                return `<p>FoodID: ${row.food_id}, Food: ${row.food_name}, Price: ${'$' + row.price} </p>`;
            }).join('');
        }

        const result4 = await pool.query(`SELECT * FROM food_list WHERE food_id >= 400 AND food_id < 500 ORDER BY food_id`);
        if (result4.rows.length > 0) {
            food_listHtml4 = result4.rows.map(row => {
                return `<p>FoodID: ${row.food_id}, Food: ${row.food_name}, Price: ${'$' + row.price} </p>`;
            }).join('');
        }
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title> Food List </title>
        </head>
        <body>
            <h2> Food List Page     
            <a href="/"> <button> Home </button> </a>
            </h2> 
            <h3> The Flying Dumpling (Chinese Restaurant) </h3>
            ${food_listHtml}
            <h3> Sorrento (Italian Restaurant) </h3>
            ${food_listHtml2}
            <h3> Picuaritos (Mexican Restaurant) </h3>
            ${food_listHtml3}
            <h3> Fukuoka (Japanese Restaurant) </h3>
            ${food_listHtml4}
        </body>
        </html>
    `);
});

app.get('/customer', async (req, res) => {

    // To Display Customer Data
    try {
        const result = await pool.query(`SELECT c.customer_id as customer_id, c.first_name as first_name,
        c.last_name as last_name, c.age as age, a.card_number as card_number, a.account_balance as account_balance
        FROM customer c JOIN account_info a ON c.customer_id = a.customer_id ORDER BY c.customer_id`);
        if (result.rows.length > 0) {
            customerName = result.rows[0].customer_name; 
            customersHtml = result.rows.map(row => {
                return `<p>Customer ID: ${row.customer_id}, First Name: ${row.first_name}, Last Name: ${row.last_name}, Age: ${row.age},
                Card Number: ${row.card_number}, Account Balance: ${'$' + row.account_balance}
                </p>`;
            }).join('');
        }

    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }

    // To Add New Customer
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    const age = req.query.age;
    const cardNum = req.query.cardNum;

    if (firstName && lastName && age && cardNum) {
        try {
            await pool.query('BEGIN');
            const customerInsertResult = await pool.query('INSERT INTO customer (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING customer_id', [firstName, lastName, age]);
            const customer = customerInsertResult.rows[0];
            const customerId = customer.customer_id;
            // Insert into the 'account_info' table with the retrieved customer_id
            await pool.query('INSERT INTO account_info (customer_id, card_number, account_balance) VALUES ($1, $2, $3)', [customerId, cardNum, 0]);
            await pool.query('COMMIT');
             // Redirect to prevent form resubmission on refresh
            return res.redirect('/customer');
        } catch (error) {
            await pool.query('ROLLBACK');
            return res.status(500).send("Transaction error: " + error.message);
        }
    }



    // To Update Customer Account Balance
    const amount = req.query.amount;
    const customerId = req.query.customerId;
    if (amount && customerId) {
        try {
            await pool.query('BEGIN');
            const customerData = await pool.query('SELECT * FROM customer WHERE customer_id = $1', [customerId]);

            if (customerData.rows.length > 0) {
                await pool.query('UPDATE account_info SET account_balance = account_balance + $1 WHERE customer_id = $2', [amount, customerId]);
                await pool.query('COMMIT');
                // Redirect to prevent form resubmission on refresh
                return res.redirect('/customer');
            } else {
                await pool.query('ROLLBACK');
                return res.status(404).send("Customer ID not Found.");
            }
        } catch (error) {
            await pool.query('ROLLBACK');
            return res.status(500).send("Transaction error: " + error.message);
        }
    }


    res.send(`
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <title> Customers </title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Transactions</title>
        </head>
        <body>
        <h2> Customers 
        <a href="/"> <button> Home </button> </a> 
        </h2>
        ${customersHtml}
        <br>
        <form action="/customer" method="GET">
            <h3> Add New Customer: </h3>
            <label for="firstName">Enter First Name:</label>
            <input type="text" name="firstName" id="firstName" required>
            <label for="lastName">Enter Last Name:</label>
            <input type="text" name="lastName" id="lastName" required>
            <label for="age">Enter Age:</label>
            <input type="number" name="age" id="age" required>
            <label for="cardNum">Enter Card Number:</label>
            <input type="text" name="cardNum" id="cardNum" pattern=".{16}" title="Enter exactly 16 characters" required>
            <button type="submit">Add Customer</button>
        </form>
        <br>
        <form action="/customer" method="GET">
            <h3> Add Funds to Account Balance: </h3>
            <label for="customerId">Enter Customer ID:</label>
            <input type="number" name="customerId" id="customerId" required>
            <label for="amount">Enter Amount ($):</label>
            <input type="number" name="amount" id="amount" required>
            <button type="submit">Add Funds</button>
        </form>
        </body>
        </html>
    `);
});


app.get('/transactionspage', async (req, res) => {
    let transactionsHtml = 'No transaction yet.';
    try {
        const result = await pool.query(`SELECT * FROM transactions ORDER BY t_id`);
        if (result.rows.length > 0) {
            customerName = result.rows[0].customer_name; 
            transactionsHtml = result.rows.map(row => {
                return `<p>Transaction ID: ${row.t_id}, Customer ID: ${row.customer_id}, Food ID: ${row.food_id}, Transaction Date: ${row.transaction_date}</p>`;
            }).join('');
        }

    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }

    res.send(`
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <title> Transactions </title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Transactions</title>
        </head>
        <body>
        <h2> Transactions
        <a href="/"> <button> Home </button> </a> 
        </h2>
        ${transactionsHtml}
        <form action="/transactions" method="GET">
        <label for="customerId">Enter Customer ID:</label>
        <input type="number" name="customerId" id="customerId" required>
        <button type="submit">Get Transactions</button>
        </form>
        </body>
        </html>
    `);
});

app.get('/transactions', async (req, res) => {
    const customerId = req.query.customerId;
    let transactionsHtml = "";
    let totalSpent = 0;
    let firstName = "";
    let lastName = "";

    if (customerId) {
        try {
            const result = await pool.query(`
                SELECT t.*, f.food_name AS food_name, f.price AS food_price, c.first_name AS first_name, c.last_name as last_name, r.restaurant_name
                FROM transactions t 
                JOIN food_list f ON t.food_id = f.food_id 
                JOIN customer c ON t.customer_id = c.customer_id
                JOIN restaurant r on f.restaurant_id = r.restaurant_id
                WHERE t.customer_id = $1
            `, [customerId]);
    
            if (result.rows.length > 0) {
                firstName = result.rows[0].first_name;
                lastName = result.rows[0].last_name;
                transactionsHtml = result.rows.map(row => {
                    totalSpent += row.food_price;
                    return `<p>ID: ${row.t_id}, Restaurant: ${row.restaurant_name}, Food: ${row.food_name}, Price: ${'$' + row.food_price}, Date: ${row.transaction_date}</p>`;
                }).join('');
            }
        } catch (err) {
            return res.status(500).send("Error: " + err.message);
        }
    }
    
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Transactions</title>
        </head>
        <body>
        <a href="/"> <button> Home </button> </a> 
            ${firstName ? `<h2> ${firstName + " " + lastName + '&#39s Transactions:'} </h2>` : '<h2> No Transactions. </h2>'}
            <div>
                ${transactionsHtml}
                ${transactionsHtml ? `<p>Total Spent: ${'$' + totalSpent}</p>` : ''}
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

