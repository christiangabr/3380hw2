//Download nodejs(https://nodejs.org/en/download)
//Run following command to install libraries: npm install express pg
//Alter ./creds.json with your local psql credentials
//Start server using command: node hw2.js
//Open browser and go to http://localhost:3000/;

const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const creds = require('./creds.json');
const pool = new Pool(creds);

app.get('/', async (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Transactions</title>
        </head>
        <body>
            <a href="/food_list"> <button>Food List Page</button> </a>
            <br>
            <br>
            <a href="/customer"> <button> Customers </button> </a>
        </body>
        </html>
    `);
});


app.get('/food_list', async (req, res) => {
    const foodId = req.query.foodId;
    const customerId = req.query.customerId;

    if (foodId && customerId) {
        try {
            await pool.query('BEGIN');
            const foodData = await pool.query('SELECT * FROM food_list WHERE food_id = $1', [foodId]);

            if (foodData.rows.length > 0) {
                const food = foodData.rows[0];
                const transactionDate = new Date().toJSON().slice(0, 10); // Get the current date (YYYY-MM-DD)
                const queryResult = await pool.query('INSERT INTO transactions (customer_id, food_id, transaction_date) VALUES ($1, $2, $3) RETURNING t_id', [customerId, food.food_id, transactionDate]);

                if (queryResult.rows.length > 0) {
                    const t_id = queryResult.rows[0].t_id;
                    await pool.query('COMMIT');
                } else {
                    await pool.query('ROLLBACK');
                    return res.status(500).send("Failed to retrieve transaction ID.");
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
            <a href="/customer"> <button> Customers </button> </a>
            </h2> 
            <h3> Chinese Restaurant </h3>
            ${food_listHtml}
            <h3> Italian Restaurant </h3>
            ${food_listHtml2}
            <h3> Mexican Restaurant </h3>
            ${food_listHtml3}
            <h3> Japanese Restaurant </h3>
            ${food_listHtml4}
            <div>
                <form action="/food_list" method="GET">
                    <label for="customerId">Enter Customer ID (1-10):</label>
                    <input type="number" name="customerId" id="customerId" required>
                    <label for="foodId">Enter Food ID:</label>
                    <input type="number" name="foodId" id="foodId" required>
                    <button type="submit">Buy Food</button>
                </form>
            <div>
        </body>
        </html>
    `);
});

app.get('/customer', async (req, res) => {

    try {
        const result = await pool.query(`SELECT * FROM customer ORDER BY customer_id`);
        if (result.rows.length > 0) {
            customerName = result.rows[0].customer_name; 
            customersHtml = result.rows.map(row => {
                return `<p>customerID: ${row.customer_id}, First Name: ${row.first_name}, Last Name: ${row.last_name}, Age: ${row.age} </p>`;
            }).join('');
        }

    } catch (error) {
        return res.status(500).send("Error: " + error.message);
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
        <h2> Customers </h2>
        ${customersHtml}
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
            ${firstName ? `<h2> Customer: ${firstName + " " + lastName} </h2>` : '<h2>Enter a Customer ID (1-10) to view transactions.</h2>'}
            <div>
                <h3>Transactions:</h3>
                ${transactionsHtml}
                ${transactionsHtml ? `<p>Total Spent: ${'$' + totalSpent}</p>` : ''}
            </div>
            <a href="/food_list">
            <button>Food List Page</button> </a>
            <br>
            <br>
            <a href="/customer"> <button> Customers </button> </a>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

