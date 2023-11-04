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
    const customerId = req.query.customerId;
    let transactionsHtml = "";
    let totalPrice = 0;
    let customerName = "";

    if (customerId) {
        try {
            const result = await pool.query(`
                SELECT t.*, p.name AS product_name, p.price AS product_price, c.name AS customer_name 
                FROM transactions t 
                JOIN product p ON t.product_id = p.product_id 
                JOIN customer c ON t.customer_id = c.customer_id
                WHERE t.customer_id = $1
            `, [customerId]);
    
            if (result.rows.length > 0) {
                customerName = result.rows[0].customer_name; 
                transactionsHtml = result.rows.map(row => {
                    totalPrice += row.product_price;
                    return `<p>ID: ${row.t_id}, Product: ${row.product_name}, Price: ${row.product_price}, Date: ${row.transaction_date}</p>`;
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
            <form action="/" method="GET">
                <label for="customerId">Enter Customer ID:</label>
                <input type="number" name="customerId" id="customerId" required>
                <button type="submit">Get Transactions</button>
            </form>
            ${customerName ? `<h2>customer.name = ${customerName}:</h2>` : '<h2>Enter a Customer ID (1-5) to view transactions.</h2>'}
            <div>
                <h3>Transactions:</h3>
                ${transactionsHtml}
                ${transactionsHtml ? `<p>Total Price: ${totalPrice}</p>` : ''}
            </div>
            <a href="/products">Click here to go to products</a>
            <a href="/employees">Click here to go to employees</a>
        </body>
        </html>
    `);
});

app.get('/products', async (req, res) => {

    const productId = req.query.productId;
    if (productId){
        try {
            await pool.query('BEGIN');
            await pool.query('UPDATE product SET quantity = quantity - 1 WHERE product_id = $1 AND quantity > 0', [productId]);
            await pool.query('COMMIT');
        } catch (error) {
            await pool.query('ROLLBACK');
            return res.status(500).send("Transaction error: " + error.message);
        }
    }
    try {
        const result = await pool.query(`SELECT * FROM PRODUCT order by name desc`);
        if (result.rows.length > 0) {
            customerName = result.rows[0].customer_name; 
            productsHtml = result.rows.map(row => {
                return `<p>Product: ${row.name},ProductID: ${row.product_id}, Price: ${row.price}, Quantity: ${row.quantity}</p>`;
            }).join('');
        }
        

    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title> PRODUCTS</title>
        </head>
        <body>
            <h2> Hey were at products page </h2>
            ${productsHtml}
            <div>
                <form action="/products" method="GET">
                    <label for="productId">Enter Product ID:</label>
                    <input type="number" name="productId" id="productId" required>
                    <button type="submit">Buy Product</button>
                </form>
            <div>
        </body>
        </html>
    `);
});

app.get('/employees', async (req, res) => {

    const first_name = req.query.first_name;
    const last_name = req.query.last_name;
    let employeesHtml = "";

    try {
        const result = await pool.query('SELECT * FROM EMPLOYEE WHERE first_name=$1 AND last_name=$2', [first_name,last_name]);
        if (result.rows.length > 0) {
            employeesHtml = result.rows.map(row => {
                return `<p>EmployeeID: ${row.employee_id}, First Name: ${row.first_name},Last Name: ${row.last_name}, Age: ${row.age}</p>`;
            }).join('');
        }
        

    } catch (error) {
        return res.status(500).send("Error: " + error.message);
    }


    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title> Employees</title>
        </head>
        <body>
            <h1>HERE AT EMPLOYEES</h1>
            ${employeesHtml}
            <div>
            <form action="/employees" method="GET">
                <label for="first_name">Enter first_name:</label>
                <input type="text" name="first_name" id="first_name" required>

                <label for="last_name">Enter last_name:</label>
                <input type="text" name="last_name" id="last_name" required>

                <button type="submit">Submit</button>
            </form>
        <div>
        </body>
        </html>
    `);
});




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

