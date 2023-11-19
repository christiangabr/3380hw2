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
const tax = 0.05;
const discount = 0.1;
app.use(express.static(__dirname));

app.get('/', async (req, res) => {
    try {
        const foodId = req.query.foodId;
        const customerId = req.query.customerId;
        const tip = req.query.tip;

        const customerOptions = await pool.query('SELECT customer_id FROM customer');
        const foodOptions = await pool.query('SELECT food_id FROM food_list');

        if (foodId && customerId) {
            try {
                await pool.query('BEGIN');
                const foodData = await pool.query('SELECT * FROM food_list WHERE food_id = $1', [foodId]);
                const customer_account = await pool.query('SELECT * FROM account_info WHERE customer_id = $1', [customerId]);
    
                if (foodData.rows.length > 0) {
                    const food = foodData.rows[0];
                    const bank = customer_account.rows[0];
                    const transactionDate = new Date().toJSON().slice(0, 10); // Get the current date (YYYY-MM-DD)
    
                    if (bank.account_balance >= (food.price + (food.price * tax))) {
                        // Add transaction
                        const queryResult = await pool.query('INSERT INTO transactions (customer_id, food_id, transaction_date, total_cost) VALUES ($1, $2, $3, $4) RETURNING t_id', [customerId, food.food_id, transactionDate, 0]);
                        await pool.query('COMMIT');
                        if (queryResult.rows.length > 0) {
                            const t_id = queryResult.rows[0].t_id;
                            const { rows } = await pool.query('SELECT member FROM account_info WHERE customer_id = $1', [customerId]);
                            const membership = rows[0].member;
                            if (membership) {
                                let totalCost = food.price - (food.price * discount);
                                if (tip) {
                                    totalCost = totalCost + (food.price * tax);
                                    totalCost += parseFloat(tip);
                                }
                                else {
                                    totalCost = totalCost + (food.price * tax);
                                }
                                await pool.query('UPDATE account_info SET account_balance = account_balance - $1 WHERE customer_id = $2', [totalCost, customerId]);
                                await pool.query('UPDATE transactions SET total_cost = $1 WHERE t_id = $2', [totalCost, t_id]);
                                await pool.query('COMMIT');
                            }
                            else {
                                let totalCost = food.price + (food.price * tax);
                                if (tip) {
                                    totalCost += parseFloat(tip);
                                }
                                await pool.query('UPDATE account_info SET account_balance = account_balance - $1 WHERE customer_id = $2', [totalCost, customerId]);
                                await pool.query('UPDATE transactions SET total_cost = $1 WHERE t_id = $2', [totalCost, t_id]);
                                await pool.query('COMMIT');
                            }
                        } else {
                            await pool.query('ROLLBACK');
                            return res.status(500).send("Failed to retrieve transaction ID.");
                        }
                        // Redirect to prevent form resubmission on refresh
                        return res.redirect('/');
                    } else {
                        return res.status(500).send("Account balance is too low.");
                    }
                } else {
                    await pool.query('ROLLBACK');
                    return res.status(404).send("Food item not found.");
                }
            } catch (error) {
                await pool.query('ROLLBACK');
                return res.status(500).send("Transaction error: Invalid Customer ID.");
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
                <label for="customerId">Select Customer ID:</label>
                <select id="customerId" name="customerId" required>
                ${customerOptions.rows.map(option => `<option value="${option.customer_id}">${option.customer_id}</option>`).join('')}
                </select>
                <label for="foodId">Select Food ID:</label>
                <select id="foodId" name="foodId" required>
                ${foodOptions.rows.map(option => `<option value="${option.food_id}">${option.food_id}</option>`).join('')}
                </select>
                <label for="tip">Enter Tip Amount ($):</label>
                <input type="number" name="tip" id="tip">
                <button type="submit" >Make Transaction</button>
                <p> Note: Check the Customers page for Customer IDs and the Restaurants and Menus page for Food IDs.</p>
            </form>
            <div>
                <a href="/customer"> <button> Customers </button> </a>
                <br>
                <br>
                <a href="/food_list"> <button> Restaurants and Menus </button> </a>
                <br>
                <br>
                <a href="/transactionspage"> <button> Transactions </button> </a>
            <h3> Useful Links: </h3>
            <a href="readme.txt" target="_blank">View Readme File</a>
            </body>
            </html>
        `);
    }
    catch
    {
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
            <p> Note: First-time users must initialize tables.</p>
        </form>
        </body>
        </html>
    `);
    }

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
        return res.redirect('/');
    } catch (error) {
        // Roll back the transaction in case of an error
        await client.query('ROLLBACK');

        // Release the client connection
        client.release();

        return res.status(500).send("Table initialization failed: " + error.message);
    }
});

app.get('/food_list', async (req, res) => {


    // Display Restaurants + Menus
    let food_listHtml = '';
    let food_listHtml2 = '';
    try {
        const result = await pool.query(`SELECT * FROM food_list 
        JOIN restaurant ON food_list.restaurant_id = restaurant.restaurant_id 
        ORDER BY food_list.restaurant_id`);
        const restaurantOptions = await pool.query('SELECT restaurant_id FROM restaurant');
        if (result.rows.length > 0) {
                let previousRestaurantId = null;

                food_listHtml = result.rows.map(row => {
                    // Check if the current row's restaurant_id is different from the previous row's restaurant_id
                    const isDifferentRestaurantId = previousRestaurantId !== row.restaurant_id;

                    // Create different HTML based on the condition
                    const html = isDifferentRestaurantId
                        ? `<h3> ${row.restaurant_name} (${row.food_type} Restaurant),   Restaurant ID: ${row.restaurant_id}</h3>
                        <p>FoodID: ${row.food_id}, Food: ${row.food_name}, Price: ${'$' + row.price}</p>`
                        : `FoodID: ${row.food_id}, Food: ${row.food_name}, Price: ${'$' + row.price}</p>`;

                    // Update the previousRestaurantId for the next iteration
                    previousRestaurantId = row.restaurant_id;

                    return html;
                }).join('');
            }
        const result2 = await pool.query('SELECT * FROM restaurant WHERE restaurant_id NOT IN (SELECT f.restaurant_id FROM food_list f JOIN restaurant r on f.restaurant_id = r.restaurant_id)');
        if (result2.rows.length > 0) {
            food_listHtml2 = result2.rows.map(row => {
                return `<h3> ${row.restaurant_name} (${row.food_type} Restaurant),   Restaurant ID: ${row.restaurant_id}</h3>`;
            }).join('');
        }
    // Add New Restaurant
    const restaurantName = req.query.restaurantName;
    const foodType = req.query.foodType;
    if (restaurantName && foodType) {
        try {
            await pool.query('BEGIN');
            const customerInsertResult = await pool.query('INSERT INTO restaurant (restaurant_name, food_type) VALUES ($1, $2) RETURNING restaurant_id', [restaurantName, foodType]);
             // Redirect to prevent form resubmission on refresh
              await pool.query('COMMIT');
            return res.redirect('/food_list');
        } catch (error) {
            await pool.query('ROLLBACK');
            return res.status(500).send("Transaction error: " + error.message);
        }
    }

    // Add New Food Item
    const restaurantID = req.query.restaurantID;
    const foodName = req.query.foodName;
    const foodPrice = req.query.foodPrice;
    if (restaurantID && foodName && foodPrice) {
        try {
            await pool.query('BEGIN');
            const customerInsertResult = await pool.query('INSERT INTO food_list (food_name, price, restaurant_id) VALUES ($1, $2, $3) RETURNING food_id', [foodName, foodPrice, restaurantID]);
             // Redirect to prevent form resubmission on refresh
              await pool.query('COMMIT');
            return res.redirect('/food_list');
        } catch (error) {
            await pool.query('ROLLBACK');
            return res.status(500).send("Transaction error: " + error.message);
        }
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title> Food List </title>
        </head>
        <body>
            <h2> Restaurants and Menus     
            <a href="/"> <button> Home </button> </a>
            </h2> 
            ${food_listHtml}
            ${food_listHtml2}
            <form action="/food_list" method="GET">
                <br>
                <h3> Add New Restaurant: </h3>
                <label for="restaurantName">Enter Restaurant Name:</label>
                <input type="text" name="restaurantName" id="restaurantName" required>
                <label for="foodType">Enter Food Type:</label>
                <input type="text" name="foodType" id="foodType" required>
                <button type="submit">Add Restaurant</button>
                <br>
                <br>
            </form>
                <form action="/food_list" method="GET">
                <h3> Add New Food Item: </h3>
                <label for="restaurantID">Select Restaurant ID:</label>
                <select id="restaurantID" name="restaurantID" required>
                ${restaurantOptions.rows.map(option => `<option value="${option.restaurant_id}">${option.restaurant_id}</option>`).join('')}
                </select>
                <label for="foodName">Enter Food Name:</label>
                <input type="text" name="foodName" id="foodName" required>
                <label for="foodPrice">Enter Food Price ($):</label>
                <input type="number" name="foodPrice" id="foodPrice" required>
                <button type="submit">Add Food Item</button>
            </form>
        </body>
        </html>
    `);
    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }

});

app.get('/customer', async (req, res) => {

    // To Display Customer Data
    try {
        const result = await pool.query(`SELECT c.customer_id as customer_id, c.first_name as first_name,
        c.last_name as last_name, c.age as age, a.card_number as card_number, a.account_balance as account_balance,
        a.member as member
        FROM customer c JOIN account_info a ON c.customer_id = a.customer_id ORDER BY c.customer_id`);
        if (result.rows.length > 0) {
            customerName = result.rows[0].customer_name; 
            customersHtml = result.rows.map(row => {
                return `<p>Customer ID: ${row.customer_id}, First Name: ${row.first_name}, Last Name: ${row.last_name}, Age: ${row.age},
                Card Number: ${row.card_number}, Account Balance: ${'$' + row.account_balance}, Member: ${row.member}
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
            await pool.query('INSERT INTO account_info (customer_id, card_number, account_balance, member) VALUES ($1, $2, $3, $4)', [customerId, cardNum, 0, false]);
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

    if (customerId) {
        try {
            await pool.query('BEGIN');
            const customerData = await pool.query('SELECT * FROM customer WHERE customer_id = $1', [customerId]);

            if (customerData.rows.length > 0) {
                await pool.query('UPDATE account_info SET member = NOT MEMBER WHERE customer_id = $1', [customerId]);
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
            <input type="text" name="amount" id="amount" required>
            <button type="submit">Add Funds</button>
        </form>
        <br>
        <form action="/customer" method="GET">
            <h3> Update Membership: </h3>
            <label for="customerId">Enter Customer ID:</label>
            <input type="number" name="customerId" id="customerId" required>
            <button type="submit">Update Membership</button>
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
                    totalSpent += row.total_cost;
                    return `<p>ID: ${row.t_id}, Restaurant: ${row.restaurant_name}, Food: ${row.food_name}, Price: ${'$' + row.food_price}, Date: ${row.transaction_date}, Total Cost (Including Discounts, Taxes and Tips): ${row.total_cost}</p>`;
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
            </div>
            <p> Total Spent: $${totalSpent}</p>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

